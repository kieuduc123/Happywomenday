import { getApps, initializeApp } from 'firebase/app'
import { deleteDoc, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
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

function getCollectionName(): string {
  return import.meta.env.VITE_FIREBASE_COLLECTION?.trim() || 'gifts'
}

export function isFirebaseEnabled(): boolean {
  return firestore !== null
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
  } catch {
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
  } catch {
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
  } catch {
    return false
  }
}
