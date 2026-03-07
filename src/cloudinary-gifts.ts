import { normalizeGiftConfig, toSlug, type GiftConfig } from './config'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() ?? ''
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() ?? ''
const baseFolder = (import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() ?? 'womensday').replace(/^\/+|\/+$/g, '')

function getConfigPublicId(slugValue: string): string {
  const slug = toSlug(slugValue)
  return `${baseFolder}/${slug}/config`
}

function getConfigPublicUrl(slugValue: string): string {
  const publicId = getConfigPublicId(slugValue)
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}.json`
}

export function isCloudinaryGiftConfigEnabled(): boolean {
  return cloudName.length > 0 && uploadPreset.length > 0
}

export async function saveGiftConfigToCloudinary(slugValue: string, config: GiftConfig): Promise<boolean> {
  const slug = toSlug(slugValue)

  if (!slug || !isCloudinaryGiftConfigEnabled()) {
    return false
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`
  const form = new FormData()
  const payload = JSON.stringify(normalizeGiftConfig(config))

  form.append('file', new Blob([payload], { type: 'application/json' }), 'config.json')
  form.append('upload_preset', uploadPreset)
  form.append('public_id', getConfigPublicId(slug))
  form.append('overwrite', 'true')
  form.append('invalidate', 'true')

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: form,
    })

    return response.ok
  } catch {
    return false
  }
}

export async function loadGiftConfigFromCloudinary(slugValue: string): Promise<GiftConfig | null> {
  const slug = toSlug(slugValue)

  if (!slug || !isCloudinaryGiftConfigEnabled()) {
    return null
  }

  try {
    const response = await fetch(getConfigPublicUrl(slug), { cache: 'no-store' })

    if (!response.ok) {
      return null
    }

    const parsed = await response.json()
    return normalizeGiftConfig(parsed)
  } catch {
    return null
  }
}
