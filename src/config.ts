import athousandyears from './assets/athousandyears.mp3'
import anhnangcuaanh from './assets/anhnangcuaanh.mp3'
import cochacyeuladay from './assets/cochacyeuladay.mp3'
import codoidieu from './assets/codoidieu.mp3'
import danchoem from './assets/danhchoem.mp3'
import daobuochongkong from './assets/daobuochongkong.mp3'
import denbenanh from './assets/denbenanh.mp3'
import dongiananhyeuem from './assets/dongiananhyeuem.mp3'
import duchotanthe from './assets/duchotanthe.mp3'
import givemeyourforever from './assets/givemeyourforever.mp3'
import iloveyou from './assets/iloveyou.mp3'
import thuongemdengia from './assets/thuongemdengia.mp3'
import yeuemhonmoingay from './assets/yeuemhonmoingay.mp3'
import yeuemratnhieu from './assets/yeuemratnhieu.mp3'

export type GiftConfig = {
  introText: string
  letterTitle: string
  letterContent: string
  letterSignature: string
  musicUrl: string
  bouquetImage: string
  rabbitLeftImage: string
  rabbitRightImage: string
  flyingImages: string[]
  photoCompliments: string[]
}

export type GiftConfigPatch = Partial<GiftConfig>

const REMOTE_BASE = 'https://womensdaypro.onrender.com'
const STORAGE_KEY = 'wday_gift_config_v1'
const STORAGE_BY_SLUG_KEY = 'wday_gift_config_by_slug_v1'

export const SONG_LIBRARY = [
  athousandyears,
  anhnangcuaanh,
  cochacyeuladay,
  codoidieu,
  danchoem,
  daobuochongkong,
  denbenanh,
  dongiananhyeuem,
  duchotanthe,
  givemeyourforever,
  iloveyou,
  thuongemdengia,
  yeuemhonmoingay,
  yeuemratnhieu,
]

export const DEFAULT_GIFT_CONFIG: GiftConfig = {
  introText: "Happy Women's Day 8/3",
  letterTitle: 'Gửi người tôi yêu thương nhất',
  letterContent:
    'Ngày 8/3, anh chúc em luôn rạng rỡ, mạnh mẽ và bình yên trong tim.\n\nCảm ơn em vì đã làm mỗi ngày của anh trở nên dịu dàng hơn.\n\nMong em luôn được yêu thương đúng như cách em xứng đáng.',
  letterSignature: 'Người luôn thương em ❤️',
  musicUrl: '',
  bouquetImage: `${REMOTE_BASE}/assets/images/wrapper_flower.png`,
  rabbitLeftImage: `${REMOTE_BASE}/assets/images/mewmew.gif`,
  rabbitRightImage: `${REMOTE_BASE}/assets/images/mewmew.gif`,
  flyingImages: [`${REMOTE_BASE}/assets/images/wrapper_flower.png`],
  photoCompliments: [
    'Em là điều ngọt ngào nhất trong ngày của anh.',
    'Nụ cười của em làm cả bầu trời dịu lại.',
    'Em xinh theo cách khiến người ta nhớ mãi.',
    'Càng nhìn em, anh càng thấy bình yên.',
    'Em bước vào là tim anh tự động ngoan hơn.',
    'Ở cạnh em, mọi mệt mỏi đều tan nhanh.',
    'Em vừa đáng yêu vừa mạnh mẽ, hiếm lắm.',
    'Ánh mắt em làm anh quên hết deadline.',
    'Em không cần cố, vẫn luôn nổi bật.',
    'Em là phiên bản đẹp nhất của chính mình.',
    'Có em, ngày thường cũng thành ngày đặc biệt.',
    'Em cười một cái, anh vui cả ngày.',
    'Em là người khiến anh muốn tử tế hơn mỗi ngày.',
    'Chỉ cần em xuất hiện, khung hình nào cũng thành kỷ niệm.',
    'Em dịu dàng nhưng không hề yếu đuối, anh nể lắm.',
    'Em xinh không chỉ ở ngoài, mà còn ở cách sống.',
    'Mỗi tấm ảnh của em đều có năng lượng rất riêng.',
    'Em càng lớn càng cuốn hút theo kiểu trưởng thành.',
    'Anh thích cách em luôn làm mọi thứ trở nên ấm áp.',
    'Thật may vì anh được biết một người tuyệt như em.',
    'Em là điểm cộng đẹp nhất của năm nay.',
    'Cứ là em thôi, đã đủ làm tim anh rung rồi.',
  ],
}

function normalizeString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

function normalizeImageList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback
  }

  const urls = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  return urls.length > 0 ? urls : fallback
}

function normalizeComplimentList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback
  }

  const lines = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  return lines.length > 0 ? lines : fallback
}

export function normalizeGiftConfig(data: unknown): GiftConfig {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_GIFT_CONFIG }
  }

  const value = data as Partial<GiftConfig>

  return {
    introText: normalizeString(value.introText, DEFAULT_GIFT_CONFIG.introText),
    letterTitle: normalizeString(value.letterTitle, DEFAULT_GIFT_CONFIG.letterTitle),
    letterContent: normalizeString(value.letterContent, DEFAULT_GIFT_CONFIG.letterContent),
    letterSignature: normalizeString(value.letterSignature, DEFAULT_GIFT_CONFIG.letterSignature),
    musicUrl: typeof value.musicUrl === 'string' ? value.musicUrl.trim() : DEFAULT_GIFT_CONFIG.musicUrl,
    bouquetImage: normalizeString(value.bouquetImage, DEFAULT_GIFT_CONFIG.bouquetImage),
    rabbitLeftImage: normalizeString(value.rabbitLeftImage, DEFAULT_GIFT_CONFIG.rabbitLeftImage),
    rabbitRightImage: normalizeString(value.rabbitRightImage, DEFAULT_GIFT_CONFIG.rabbitRightImage),
    flyingImages: normalizeImageList(value.flyingImages, DEFAULT_GIFT_CONFIG.flyingImages),
    photoCompliments: normalizeComplimentList(value.photoCompliments, DEFAULT_GIFT_CONFIG.photoCompliments),
  }
}

export function normalizeGiftConfigPatch(data: unknown): GiftConfigPatch {
  if (!data || typeof data !== 'object') {
    return {}
  }

  const value = data as Partial<GiftConfig>
  const patch: GiftConfigPatch = {}

  if (typeof value.introText === 'string') patch.introText = value.introText.trim()
  if (typeof value.letterTitle === 'string') patch.letterTitle = value.letterTitle.trim()
  if (typeof value.letterContent === 'string') patch.letterContent = value.letterContent.trim()
  if (typeof value.letterSignature === 'string') patch.letterSignature = value.letterSignature.trim()
  if (typeof value.musicUrl === 'string') patch.musicUrl = value.musicUrl.trim()
  if (typeof value.bouquetImage === 'string') patch.bouquetImage = value.bouquetImage.trim()
  if (typeof value.rabbitLeftImage === 'string') patch.rabbitLeftImage = value.rabbitLeftImage.trim()
  if (typeof value.rabbitRightImage === 'string') patch.rabbitRightImage = value.rabbitRightImage.trim()

  if (Array.isArray(value.flyingImages)) {
    patch.flyingImages = value.flyingImages
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  if (Array.isArray(value.photoCompliments)) {
    patch.photoCompliments = value.photoCompliments
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return patch
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

export function buildGiftConfigPatch(current: GiftConfig, base: GiftConfig): GiftConfigPatch {
  const now = normalizeGiftConfig(current)
  const root = normalizeGiftConfig(base)
  const patch: GiftConfigPatch = {}

  if (now.introText !== root.introText) patch.introText = now.introText
  if (now.letterTitle !== root.letterTitle) patch.letterTitle = now.letterTitle
  if (now.letterContent !== root.letterContent) patch.letterContent = now.letterContent
  if (now.letterSignature !== root.letterSignature) patch.letterSignature = now.letterSignature
  if (now.musicUrl !== root.musicUrl) patch.musicUrl = now.musicUrl
  if (now.bouquetImage !== root.bouquetImage) patch.bouquetImage = now.bouquetImage
  if (now.rabbitLeftImage !== root.rabbitLeftImage) patch.rabbitLeftImage = now.rabbitLeftImage
  if (now.rabbitRightImage !== root.rabbitRightImage) patch.rabbitRightImage = now.rabbitRightImage
  if (!arraysEqual(now.flyingImages, root.flyingImages)) patch.flyingImages = now.flyingImages
  if (!arraysEqual(now.photoCompliments, root.photoCompliments)) patch.photoCompliments = now.photoCompliments

  return patch
}

export function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getPathSlug(pathname: string): string {
  const first = pathname
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter((part) => part.length > 0)[0]

  if (!first) {
    return ''
  }

  try {
    return toSlug(decodeURIComponent(first))
  } catch {
    return toSlug(first)
  }
}

function loadSlugStore(): Record<string, GiftConfig> {
  try {
    const raw = window.localStorage.getItem(STORAGE_BY_SLUG_KEY)

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>

    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    const result: Record<string, GiftConfig> = {}

    Object.entries(parsed).forEach(([key, value]) => {
      const slug = toSlug(key)

      if (!slug) {
        return
      }

      result[slug] = normalizeGiftConfig(value)
    })

    return result
  } catch {
    return {}
  }
}

function saveSlugStore(store: Record<string, GiftConfig>): void {
  window.localStorage.setItem(STORAGE_BY_SLUG_KEY, JSON.stringify(store))
}

export function loadGiftConfig(): GiftConfig {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return { ...DEFAULT_GIFT_CONFIG }
    }

    return normalizeGiftConfig(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_GIFT_CONFIG }
  }
}

export function saveGiftConfig(config: GiftConfig): void {
  const normalized = normalizeGiftConfig(config)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
}

export function clearGiftConfig(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function loadGiftConfigBySlug(slugValue: string): GiftConfig | null {
  const slug = toSlug(slugValue)

  if (!slug) {
    return null
  }

  const store = loadSlugStore()
  return store[slug] ?? null
}

export function saveGiftConfigBySlug(slugValue: string, config: GiftConfig): void {
  const slug = toSlug(slugValue)

  if (!slug) {
    return
  }

  const store = loadSlugStore()
  store[slug] = normalizeGiftConfig(config)
  saveSlugStore(store)
}

export function clearGiftConfigBySlug(slugValue: string): void {
  const slug = toSlug(slugValue)

  if (!slug) {
    return
  }

  const store = loadSlugStore()

  if (!(slug in store)) {
    return
  }

  delete store[slug]
  saveSlugStore(store)
}

function base64UrlEncodeUtf8(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecodeUtf8(value: string): string {
  const base64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new TextDecoder().decode(bytes)
}

type GiftTokenPayload = {
  v: 1
  d: GiftConfigPatch
}

export function encodeGiftConfigToToken(config: GiftConfigPatch): string {
  const normalizedPatch = normalizeGiftConfigPatch(config)
  const payload: GiftTokenPayload = {
    v: 1,
    d: normalizedPatch,
  }
  const json = JSON.stringify(payload)
  return base64UrlEncodeUtf8(json)
}

export function decodeGiftConfigFromToken(token: string): GiftConfigPatch | null {
  try {
    if (!token || token.trim().length === 0) {
      return null
    }

    const json = base64UrlDecodeUtf8(token.trim())
    const parsed = JSON.parse(json) as unknown

    if (parsed && typeof parsed === 'object' && 'v' in parsed && 'd' in parsed) {
      const payload = parsed as { v?: unknown; d?: unknown }

      if (payload.v === 1) {
        return normalizeGiftConfigPatch(payload.d)
      }
    }

    // Backward compatibility for old links that stored full GiftConfig.
    if (parsed && typeof parsed === 'object') {
      return normalizeGiftConfig(parsed)
    }

    return null
  } catch {
    return null
  }
}
