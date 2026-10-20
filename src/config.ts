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

export type RecipientType = 'lover' | 'best-friend'

export type GiftConfig = {
  recipientType: RecipientType
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

export const LOVER_PHOTO_COMPLIMENTS = [
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
]

export const BEST_FRIEND_PHOTO_COMPLIMENTS = [
  '20/10 vui vẻ nha, bớt suy nghĩ linh tinh và cười nhiều lên.',
  'Chúc bà lúc nào cũng xinh, vui và gặp toàn chuyện dễ chịu.',
  'Cảm ơn vì đã chịu nghe tui kể đủ thứ chuyện trên đời.',
  'Bạn thân gì mà lâu lâu cũng khiến tui quên mất đang nói chuyện với bạn thân.',
  'Hôm nay cứ vui hết mình, chuyện không vui để mai tính.',
  'Chúc bà ăn ngon không mập, ngủ muộn vẫn không có quầng thâm.',
  'Mong bà gặp đúng người hợp gu; nếu gu giống tui thì càng tiện.',
  'Bình thường hay chọc bà thôi, chứ thật ra cũng quý bà nhiều.',
  'Có chuyện gì cứ gọi, trừ lúc tui đang ngủ thì gọi hai lần.',
  'Chúc cô bạn thân ngày càng xinh và bớt bắt nạt tui lại.',
  'Bà cứ vui vẻ là được, phần còn lại từ từ giải quyết.',
  'Không cần hoàn hảo đâu, phiên bản hiện tại cũng ổn áp rồi.',
  'Thân nhau lâu vậy mà đôi lúc nhìn bà vẫn thấy hơi rung rinh, cũng lạ.',
  '20/10 nhận nhiều quà nha, phần của tui thì giữ bí mật một chút.',
  'Chúc bà luôn có người đồng hành; nếu chưa chốt ai thì tui đăng ký.',
  'Nói chung là chúc bà mọi điều tốt đẹp, còn chi tiết để gặp rồi nói.',
]

const LEGACY_BEST_FRIEND_COMPLIMENTS = new Set([
  'Bạn thân gì mà lâu lâu cũng khiến người ta hơi bối rối.',
  'Mong bà luôn gặp người tử tế, giống tui chẳng hạn.',
  'Thân nhau lâu vậy mà nhìn bà vẫn chưa thấy chán, cũng lạ.',
  '20/10 nhận nhiều quà nha, thiếu thì tui bù một món.',
  'Chúc bà luôn có người đồng hành; ghế bên cạnh tui vẫn đang trống.',
  'Chúc cô bạn thân của anh ngày 20/10 luôn vui, xinh đẹp và được cưng chiều thật nhiều.',
  'Chúc cô bạn thân của tôi ngày 20/10 luôn vui, xinh đẹp và được cưng chiều thật nhiều.',
  'Cảm ơn em vì vừa là bạn thân, vừa là người khiến những ngày bình thường trở nên đặc biệt.',
  'Không biết gọi em là bạn thân có còn đủ nữa không, nhưng trước mắt cứ thế đã nhé.',
  'Chúc em luôn hạnh phúc; còn nếu thiếu người làm em vui thì cứ tìm anh.',
  'Người ta có bạn thân để tâm sự, còn anh có em để vừa tâm sự vừa nhớ.',
  'Ở cạnh em rất thoải mái, chỉ có trái tim là đôi lúc hơi mất bình tĩnh.',
  'Chúc cô gái đặc biệt hơn mức bạn bè một chút của anh luôn rạng rỡ.',
  'Anh mong hôm nay em nhận được nhiều yêu thương, phần của anh thì hơi nhiều hơn một chút.',
  'Chúng ta cứ làm bạn thân nhé, còn chữ “thân” đến mức nào thì để sau tính.',
  'Có những người càng thân càng bình thường, riêng em càng thân anh càng thấy đặc biệt.',
  '20/10 vui vẻ nhé cô bạn khiến anh đôi lúc quên mất mình chỉ là bạn.',
  'Nếu sau này em hỏi ai thương em nhất, anh xin phép được đứng trong danh sách ứng viên.',
  'Mong nụ cười này luôn ở đó, vì hình như anh thích nó nhiều hơn mức cần thiết.',
  'Bạn thân thì không được ghen, nhưng nếu em thân với người khác hơn anh thì cũng hơi khó chịu đấy.',
  'Chúc em gặp được người luôn ở bên em; nếu chưa gặp thì nhìn sang bên cạnh thử nhé.',
  'Anh không hứa điều gì lớn lao, chỉ hứa khi em cần thì anh vẫn luôn ở đây.',
])

function hasLegacyBestFriendCompliments(lines: string[]): boolean {
  return lines.some((line) => LEGACY_BEST_FRIEND_COMPLIMENTS.has(line))
}

export const DEFAULT_GIFT_CONFIG: GiftConfig = {
  recipientType: 'lover',
  introText: 'Chúc mừng Ngày Phụ nữ Việt Nam 20/10',
  letterTitle: 'Gửi người tôi yêu thương nhất',
  letterContent:
    'Ngày 20/10, anh chúc em luôn rạng rỡ, mạnh mẽ và bình yên trong tim.\n\nCảm ơn em vì đã làm mỗi ngày của anh trở nên dịu dàng hơn.\n\nMong em luôn được yêu thương đúng như cách em xứng đáng.',
  letterSignature: 'Người luôn thương em ❤️',
  musicUrl: '',
  bouquetImage: `${REMOTE_BASE}/assets/images/wrapper_flower.png`,
  rabbitLeftImage: `${REMOTE_BASE}/assets/images/mewmew.gif`,
  rabbitRightImage: `${REMOTE_BASE}/assets/images/mewmew.gif`,
  flyingImages: [`${REMOTE_BASE}/assets/images/wrapper_flower.png`],
  photoCompliments: [...LOVER_PHOTO_COMPLIMENTS],
}

export const BEST_FRIEND_GIFT_CONFIG: GiftConfig = {
  ...DEFAULT_GIFT_CONFIG,
  recipientType: 'best-friend',
  introText: '20/10 vui vẻ nha, cô bạn thân!',
  letterTitle: 'Gửi cô bạn thân',
  letterContent:
    '20/10 vui vẻ nha. Chúc bà lúc nào cũng xinh, vui và gặp nhiều chuyện dễ chịu.\n\nCảm ơn vì đã luôn nghe tui kể đủ thứ chuyện trên đời. Bình thường hay chọc nhau vậy thôi chứ tui quý bà nhiều lắm.\n\nCứ vui vẻ nhé, có chuyện gì thì gọi tui.',
  letterSignature: 'Bạn thân của bà',
  flyingImages: [...DEFAULT_GIFT_CONFIG.flyingImages],
  photoCompliments: [...BEST_FRIEND_PHOTO_COMPLIMENTS],
}

export function getGiftTemplate(recipientType: RecipientType): GiftConfig {
  const template = recipientType === 'best-friend' ? BEST_FRIEND_GIFT_CONFIG : DEFAULT_GIFT_CONFIG
  return {
    ...template,
    flyingImages: [...template.flyingImages],
    photoCompliments: [...template.photoCompliments],
  }
}

export function getRecipientTypeForSlug(slugValue: string): RecipientType {
  const slug = toSlug(slugValue)
  return !slug || slug === 'tinh' ? 'lover' : 'best-friend'
}

export function applyRecipientTemplateForSlug(source: GiftConfig, slugValue: string): GiftConfig {
  const recipientType = getRecipientTypeForSlug(slugValue)

  if (source.recipientType === recipientType) {
    const useUpdatedBestFriendCopy =
      recipientType === 'best-friend' && hasLegacyBestFriendCompliments(source.photoCompliments)
    const template = getGiftTemplate(recipientType)
    const photoCompliments =
      useUpdatedBestFriendCopy ? [...BEST_FRIEND_PHOTO_COMPLIMENTS] : [...source.photoCompliments]

    return {
      ...source,
      introText: useUpdatedBestFriendCopy ? template.introText : source.introText,
      letterTitle: useUpdatedBestFriendCopy ? template.letterTitle : source.letterTitle,
      letterContent: useUpdatedBestFriendCopy ? template.letterContent : source.letterContent,
      letterSignature: useUpdatedBestFriendCopy ? template.letterSignature : source.letterSignature,
      flyingImages: [...source.flyingImages],
      photoCompliments,
    }
  }

  const template = getGiftTemplate(recipientType)
  return {
    ...template,
    musicUrl: source.musicUrl,
    bouquetImage: source.bouquetImage,
    rabbitLeftImage: source.rabbitLeftImage,
    rabbitRightImage: source.rabbitRightImage,
    flyingImages: [...source.flyingImages],
  }
}

function normalizeRecipientType(value: unknown): RecipientType {
  return value === 'best-friend' ? 'best-friend' : 'lover'
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
    return getGiftTemplate('lover')
  }

  const value = data as Partial<GiftConfig>
  const recipientType = normalizeRecipientType(value.recipientType)
  const fallback = getGiftTemplate(recipientType)

  let photoCompliments = normalizeComplimentList(value.photoCompliments, fallback.photoCompliments)

  const useUpdatedBestFriendCopy =
    recipientType === 'best-friend' && hasLegacyBestFriendCompliments(photoCompliments)

  if (useUpdatedBestFriendCopy) {
    photoCompliments = [...BEST_FRIEND_PHOTO_COMPLIMENTS]
  }

  // Configs saved before recipient types existed contained both pools. Keep legacy
  // lover cards from showing the newer best-friend lines.
  if (value.recipientType === undefined && recipientType === 'lover') {
    const bestFriendLines = new Set([
      ...BEST_FRIEND_PHOTO_COMPLIMENTS,
      ...LEGACY_BEST_FRIEND_COMPLIMENTS,
    ])
    const loverOnly = photoCompliments.filter((line) => !bestFriendLines.has(line))
    photoCompliments = loverOnly.length > 0 ? loverOnly : [...fallback.photoCompliments]
  }

  return {
    recipientType,
    introText: useUpdatedBestFriendCopy ? fallback.introText : normalizeString(value.introText, fallback.introText),
    letterTitle: useUpdatedBestFriendCopy ? fallback.letterTitle : normalizeString(value.letterTitle, fallback.letterTitle),
    letterContent: useUpdatedBestFriendCopy ? fallback.letterContent : normalizeString(value.letterContent, fallback.letterContent),
    letterSignature: useUpdatedBestFriendCopy
      ? fallback.letterSignature
      : normalizeString(value.letterSignature, fallback.letterSignature),
    musicUrl: typeof value.musicUrl === 'string' ? value.musicUrl.trim() : fallback.musicUrl,
    bouquetImage: normalizeString(value.bouquetImage, fallback.bouquetImage),
    rabbitLeftImage: normalizeString(value.rabbitLeftImage, fallback.rabbitLeftImage),
    rabbitRightImage: normalizeString(value.rabbitRightImage, fallback.rabbitRightImage),
    flyingImages: normalizeImageList(value.flyingImages, fallback.flyingImages),
    photoCompliments,
  }
}

export function normalizeGiftConfigPatch(data: unknown): GiftConfigPatch {
  if (!data || typeof data !== 'object') {
    return {}
  }

  const value = data as Partial<GiftConfig>
  const patch: GiftConfigPatch = {}

  if (value.recipientType === 'lover' || value.recipientType === 'best-friend') patch.recipientType = value.recipientType
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

  if (now.recipientType !== root.recipientType) patch.recipientType = now.recipientType
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
      return getGiftTemplate('lover')
    }

    return normalizeGiftConfig(JSON.parse(raw))
  } catch {
    return getGiftTemplate('lover')
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
