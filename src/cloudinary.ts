const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() ?? ''
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() ?? ''
const baseFolder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() ?? ''

export type CloudinaryAssetKind = 'images' | 'music'

type CloudinaryResourceType = 'image' | 'video'

function normalizeFolderSegment(value: string): string {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
}

function buildFolder(slug?: string, kind?: CloudinaryAssetKind): string {
  const parts: string[] = []

  const normalizedBase = normalizeFolderSegment(baseFolder)
  if (normalizedBase) {
    parts.push(normalizedBase)
  }

  if (slug) {
    const normalizedSlug = normalizeFolderSegment(slug)
    if (normalizedSlug) {
      parts.push(normalizedSlug)
    }
  }

  if (kind) {
    parts.push(kind)
  }

  return parts.join('/')
}

function getEndpoint(resourceType: CloudinaryResourceType): string {
  return `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
}

function getResourceTypeFromFile(file: File, kind?: CloudinaryAssetKind): CloudinaryResourceType {
  if (kind === 'music') {
    return 'video'
  }

  const mime = file.type.toLowerCase()
  return mime.startsWith('audio/') || mime.startsWith('video/') ? 'video' : 'image'
}

function getResourceTypeFromDataUrl(dataUrl: string, kind?: CloudinaryAssetKind): CloudinaryResourceType {
  if (kind === 'music') {
    return 'video'
  }

  return dataUrl.startsWith('data:audio/') || dataUrl.startsWith('data:video/') ? 'video' : 'image'
}

async function runUpload(
  fileValue: File | string,
  resourceType: CloudinaryResourceType,
  slug?: string,
  kind?: CloudinaryAssetKind,
): Promise<string | null> {
  if (!cloudName || !uploadPreset) {
    return null
  }

  const form = new FormData()
  form.append('file', fileValue)
  form.append('upload_preset', uploadPreset)

  const folder = buildFolder(slug, kind)
  if (folder) {
    form.append('folder', folder)
  }

  try {
    const response = await fetch(getEndpoint(resourceType), {
      method: 'POST',
      body: form,
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as { secure_url?: string }
    return typeof payload.secure_url === 'string' ? payload.secure_url : null
  } catch {
    return null
  }
}

export function isCloudinaryEnabled(): boolean {
  return cloudName.length > 0 && uploadPreset.length > 0
}

export async function uploadFileToCloudinary(
  file: File,
  options?: { slug?: string; kind?: CloudinaryAssetKind },
): Promise<string | null> {
  return runUpload(file, getResourceTypeFromFile(file, options?.kind), options?.slug, options?.kind)
}

export async function uploadDataUrlToCloudinary(
  dataUrl: string,
  options?: { slug?: string; kind?: CloudinaryAssetKind },
): Promise<string | null> {
  if (!dataUrl.startsWith('data:')) {
    return dataUrl
  }

  return runUpload(dataUrl, getResourceTypeFromDataUrl(dataUrl, options?.kind), options?.slug, options?.kind)
}
