import { getApps, initializeApp } from 'firebase/app'
import { deleteDoc, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { normalizeGiftConfig, toSlug, type GiftConfig } from './config'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() ?? '',
}

const required = [firebaseConfig.apiKey, firebaseConfig.authDomain, firebaseConfig.projectId]
const firebaseEnabled = required.every((value) => value.length > 0)
const firebaseApp = firebaseEnabled ? (getApps()[0] ?? initializeApp(firebaseConfig)) : null
const firestore = firebaseApp ? getFirestore(firebaseApp) : null
const storage = firebaseApp ? getStorage(firebaseApp) : null

type UploadKind = 'images' | 'music'

function getCollectionName(): string {
  return import.meta.env.VITE_FIREBASE_COLLECTION?.trim() || 'gifts'
}

export function isFirebaseEnabled(): boolean {
  return firestore !== null
}

export function isFirebaseStorageEnabled(): boolean {
  return storage !== null
}

function guessExtensionFromMime(mimeType: string): string {
  const mime = mimeType.toLowerCase().trim()

  if (mime.includes('jpeg')) return 'jpg'
  if (mime.includes('png')) return 'png'
  if (mime.includes('webp')) return 'webp'
  if (mime.includes('gif')) return 'gif'
  if (mime.includes('avif')) return 'avif'
  if (mime.includes('svg')) return 'svg'
  if (mime.includes('mpeg')) return 'mp3'
  if (mime.includes('mp4')) return 'm4a'
  if (mime.includes('ogg')) return 'ogg'
  if (mime.includes('wav')) return 'wav'

  return 'bin'
}

function guessExtensionFromFile(file: File): string {
  const dot = file.name.lastIndexOf('.')

  if (dot > -1 && dot < file.name.length - 1) {
    return file.name.slice(dot + 1).toLowerCase()
  }

  return guessExtensionFromMime(file.type)
}

function makeAssetPath(slug: string, kind: UploadKind, extension: string): string {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const safeExt = extension.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin'
  return `${getCollectionName()}/${slug}/${kind}/${id}.${safeExt}`
}

async function uploadBlobToFirebase(slugValue: string, blob: Blob, extension: string, kind: UploadKind): Promise<string | null> {
  if (!storage) {
    return null
  }

  const slug = toSlug(slugValue)

  if (!slug) {
    return null
  }

  try {
    const path = makeAssetPath(slug, kind, extension)
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, blob, {
      contentType: blob.type || undefined,
      cacheControl: 'public,max-age=31536000',
    })
    return await getDownloadURL(fileRef)
  } catch (error) {
    console.error('Firebase Storage upload failed:', error)
    return null
  }
}

export async function uploadGiftFileToFirebase(slugValue: string, file: File, kind: UploadKind): Promise<string | null> {
  const extension = guessExtensionFromFile(file)
  return uploadBlobToFirebase(slugValue, file, extension, kind)
}

export async function uploadGiftDataUrlToFirebase(slugValue: string, dataUrl: string, kind: UploadKind): Promise<string | null> {
  if (!dataUrl.startsWith('data:')) {
    return dataUrl
  }

  try {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    const extension = guessExtensionFromMime(blob.type)
    return await uploadBlobToFirebase(slugValue, blob, extension, kind)
  } catch (error) {
    console.error('Convert data URL before upload failed:', error)
    return null
  }
}

export async function loadGiftConfigFromFirebase(slugValue: string): Promise<GiftConfig | null> {
  if (!firestore) {
    return null
  }

  const slug = toSlug(slugValue)

  if (!slug) {
    return null
  }

  try {
    const snap = await getDoc(doc(firestore, getCollectionName(), slug))

    if (!snap.exists()) {
      return null
    }

    const raw = snap.data()
    const payload = raw?.config ?? raw
    return normalizeGiftConfig(payload)
  } catch (error) {
    console.error('Load gift config from Firebase failed:', error)
    return null
  }
}

export async function saveGiftConfigToFirebase(slugValue: string, config: GiftConfig): Promise<boolean> {
  if (!firestore) {
    return false
  }

  const slug = toSlug(slugValue)

  if (!slug) {
    return false
  }

  try {
    await setDoc(
      doc(firestore, getCollectionName(), slug),
      {
        slug,
        config: normalizeGiftConfig(config),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    return true
  } catch (error) {
    console.error('Save gift config to Firebase failed:', error)
    return false
  }
}

export async function clearGiftConfigFromFirebase(slugValue: string): Promise<boolean> {
  if (!firestore) {
    return false
  }

  const slug = toSlug(slugValue)

  if (!slug) {
    return false
  }

  try {
    await deleteDoc(doc(firestore, getCollectionName(), slug))
    return true
  } catch (error) {
    console.error('Delete gift config from Firebase failed:', error)
    return false
  }
}
