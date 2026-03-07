import './style.css'
import {
  DEFAULT_GIFT_CONFIG,
  SONG_LIBRARY,
  clearGiftConfig,
  clearGiftConfigBySlug,
  decodeGiftConfigFromToken,
  getPathSlug,
  loadGiftConfig,
  loadGiftConfigBySlug,
  normalizeGiftConfigPatch,
  saveGiftConfig,
  saveGiftConfigBySlug,
  type GiftConfig,
} from './config'
import { clearGiftConfigFromFirebase, isFirebaseEnabled, loadGiftConfigFromFirebase, saveGiftConfigToFirebase } from './firebase-gifts'
import { getPresetFromPath } from './presets'

type LetterData = {
  title: string
  content: string
  signature: string
  flyingImages: string[]
  photoCompliments: string[]
  hasVipPhotos: boolean
}

const orientationOverlay = document.getElementById('orientationOverlay')
const btnDaHieu = document.getElementById('btnDaHieu') as HTMLButtonElement | null
const audio = document.getElementById('audio-para-ti') as HTMLAudioElement | null

const introEl = document.getElementById('intro')
const introTextEl = document.querySelector('.intro__text')
const flowersEl = document.querySelector('.flowers')
const ramoEl = document.querySelector('.ramo')
const ramoImg = document.getElementById('bouquetImage') as HTMLImageElement | null
const rabbitLeftImg = document.getElementById('rabbitLeftImage') as HTMLImageElement | null
const rabbitRightImg = document.getElementById('rabbitRightImage') as HTMLImageElement | null

const letterEnvelope = document.querySelector('.letter-envelope, .letter') as HTMLElement | null
const letterModal = document.getElementById('letterModal')
const letterCloseBtn = document.getElementById('letterClose') as HTMLButtonElement | null
const letterTitleEl = document.getElementById('letterTitle')
const letterContentEl = document.getElementById('letterContent')
const letterModalFooter = document.getElementById('letterModalFooter')
const letterBtnContinue = document.getElementById('letterBtnContinue') as HTMLButtonElement | null
const photoFloatContainer = document.getElementById('photoFloatContainer')

const imageViewer = document.getElementById('imageViewer')
const imageViewerImage = document.getElementById('imageViewerImage') as HTMLImageElement | null
const imageViewerCompliment = document.getElementById('imageViewerCompliment')
const imageViewerCounter = document.getElementById('imageViewerCounter')
const imageViewerClose = document.getElementById('imageViewerClose') as HTMLButtonElement | null
const imageBookSpread = document.getElementById('imageBookSpread')

const activeSlug = getPathSlug(window.location.pathname)
const presetConfig = getPresetFromPath(window.location.pathname) ?? {}
const storedConfig = activeSlug ? loadGiftConfigBySlug(activeSlug) : loadGiftConfig()

let config: GiftConfig = {
  ...DEFAULT_GIFT_CONFIG,
  ...presetConfig,
  ...(storedConfig ?? {}),
}

const inlineMusicSrc = audio?.getAttribute('src')?.trim() ?? ''
if (!config.musicUrl && inlineMusicSrc.length > 0) {
  config = {
    ...config,
    musicUrl: inlineMusicSrc,
  }
}

const letterData: LetterData = {
  title: '',
  content: '',
  signature: '',
  flyingImages: [],
  photoCompliments: [],
  hasVipPhotos: false,
}

let letterTypingTimeout: number | null = null
let flyingInterval: number | null = null
let shuffledZones: number[] = []
let zonePointer = 0
let shuffledUrls: string[] = []
let urlPointer = 0
let autoPlayListenersBound = false
let sessionMusicUrl = ''
let sessionMusicSeed = ''
const LAST_MUSIC_KEY = 'wday_last_music_v1'
let imageViewerItems: string[] = []
let imageViewerComplimentDeck: string[] = []
let imageViewerIndex = 0
let imageViewerAlt = 'Ảnh phóng to'
let imageViewerFlipLock = false
let imageViewerFlipMidTimer: number | null = null
let imageViewerFlipEndTimer: number | null = null
const IMAGE_FLIP_DURATION_MS = 520
const FOLDER_GIFTS_ROOT = '/gifts'
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']

function getMusicCandidates(value: string): string[] {
  return value
    .split(/[\n|]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function chooseDifferentSong(pool: string[]): string {
  if (pool.length === 0) {
    return ''
  }

  if (pool.length === 1) {
    return pool[0]
  }

  const last = window.localStorage.getItem(LAST_MUSIC_KEY) ?? ''
  const selectable = pool.filter((song) => song !== last)
  const source = selectable.length > 0 ? selectable : pool
  return source[Math.floor(Math.random() * source.length)]
}

function resolveSessionMusicUrl(): string {
  const configured = getMusicCandidates(config.musicUrl)
  const isSingleDefaultLibrarySong = configured.length === 1 && SONG_LIBRARY.includes(configured[0])
  const pool =
    configured.length >= 2
      ? configured
      : configured.length === 0 || isSingleDefaultLibrarySong
        ? SONG_LIBRARY
        : configured

  if (pool.length === 0) {
    return ''
  }

  const seed = pool.join('||')

  if (sessionMusicUrl && sessionMusicSeed === seed) {
    return sessionMusicUrl
  }

  sessionMusicSeed = seed
  sessionMusicUrl = chooseDifferentSong(pool)

  if (sessionMusicUrl) {
    window.localStorage.setItem(LAST_MUSIC_KEY, sessionMusicUrl)
  }

  return sessionMusicUrl
}

function getUrlOverrides(): Partial<GiftConfig> {
  const params = new URLSearchParams(window.location.search)
  const read = (key: string): string => params.get(key)?.trim() ?? ''

  const giftToken = read('g') || read('gift')
  const intro = read('intro')
  const title = read('title')
  const content = read('content').replace(/\\n/g, '\n')
  const signature = read('signature')
  const music = read('music')
  const bouquet = read('bouquet')
  const left = read('left')
  const right = read('right')
  const imgsRaw = read('imgs')
  const complimentsRaw = (read('praises') || read('compliments')).replace(/\\n/g, '\n')
  const imgs = imgsRaw
    ? imgsRaw
        .split('|')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : []
  const compliments = complimentsRaw
    ? complimentsRaw
        .split(/[\n|]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : []

  const tokenConfig = giftToken ? decodeGiftConfigFromToken(giftToken) : null
  const overrides: Partial<GiftConfig> = tokenConfig ? { ...tokenConfig } : {}

  if (intro) overrides.introText = intro
  if (title) overrides.letterTitle = title
  if (content) overrides.letterContent = content
  if (signature) overrides.letterSignature = signature
  if (music) overrides.musicUrl = music
  if (bouquet) overrides.bouquetImage = bouquet
  if (left) overrides.rabbitLeftImage = left
  if (right) overrides.rabbitRightImage = right
  if (imgs.length > 0) overrides.flyingImages = imgs
  if (compliments.length > 0) overrides.photoCompliments = compliments

  return overrides
}

const urlOverrides = getUrlOverrides()

config = {
  ...config,
  ...urlOverrides,
}

function hasMeaningfulUrlOverrides(overrides: Partial<GiftConfig>): boolean {
  return (
    typeof overrides.introText === 'string' ||
    typeof overrides.letterTitle === 'string' ||
    typeof overrides.letterContent === 'string' ||
    typeof overrides.letterSignature === 'string' ||
    typeof overrides.musicUrl === 'string' ||
    typeof overrides.bouquetImage === 'string' ||
    typeof overrides.rabbitLeftImage === 'string' ||
    typeof overrides.rabbitRightImage === 'string' ||
    Array.isArray(overrides.flyingImages) ||
    Array.isArray(overrides.photoCompliments)
  )
}

function saveActiveConfig(value: GiftConfig): void {
  if (activeSlug) {
    if (isFirebaseEnabled()) {
      void saveGiftConfigToFirebase(activeSlug, value)
    }

    saveGiftConfigBySlug(activeSlug, value)
    return
  }

  saveGiftConfig(value)
}

function clearActiveConfig(): void {
  if (activeSlug) {
    if (isFirebaseEnabled()) {
      void clearGiftConfigFromFirebase(activeSlug)
    }

    clearGiftConfigBySlug(activeSlug)
    return
  }

  clearGiftConfig()
}

function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function toFolderAssetUrl(folderPath: string, value: string): string {
  const clean = value.trim()

  if (!clean) {
    return clean
  }

  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('/')
  ) {
    return clean
  }

  const normalized = clean.replace(/^\.?\//, '')
  return `${folderPath}/${normalized}`
}

function isImageLikeResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type')?.toLowerCase().trim() ?? ''

  if (!contentType) {
    return true
  }

  if (contentType.startsWith('image/')) {
    return true
  }

  if (contentType.includes('application/octet-stream')) {
    return true
  }

  return false
}

async function checkAssetExists(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, { method: 'HEAD', cache: 'no-store' })

    if (head.ok && isImageLikeResponse(head)) {
      return true
    }
  } catch {
    // Ignore HEAD failures, try GET fallback below.
  }

  try {
    const get = await fetch(url, { cache: 'no-store' })
    return get.ok && isImageLikeResponse(get)
  } catch {
    return false
  }
}

async function loadFolderPatchFromConfigJson(slug: string): Promise<Partial<GiftConfig> | null> {
  const folderPath = `${FOLDER_GIFTS_ROOT}/${encodeURIComponent(slug)}`
  const configUrl = `${folderPath}/config.json`

  try {
    const response = await fetch(configUrl, { cache: 'no-store' })

    if (!response.ok) {
      return null
    }

    const parsed = await response.json()
    const patch = normalizeGiftConfigPatch(parsed)
    const resolved: Partial<GiftConfig> = { ...patch }

    if (resolved.musicUrl) resolved.musicUrl = toFolderAssetUrl(folderPath, resolved.musicUrl)
    if (resolved.bouquetImage) resolved.bouquetImage = toFolderAssetUrl(folderPath, resolved.bouquetImage)
    if (resolved.rabbitLeftImage) resolved.rabbitLeftImage = toFolderAssetUrl(folderPath, resolved.rabbitLeftImage)
    if (resolved.rabbitRightImage) resolved.rabbitRightImage = toFolderAssetUrl(folderPath, resolved.rabbitRightImage)
    if (resolved.flyingImages) resolved.flyingImages = resolved.flyingImages.map((item) => toFolderAssetUrl(folderPath, item))

    return resolved
  } catch {
    return null
  }
}

async function probeSequentialFolderImages(slug: string, maxCount = 40): Promise<string[]> {
  const folderPath = `${FOLDER_GIFTS_ROOT}/${encodeURIComponent(slug)}`
  const urls: string[] = []
  let missesInRow = 0

  for (let i = 1; i <= maxCount; i += 1) {
    let found = ''

    for (const ext of IMAGE_EXTENSIONS) {
      const url = `${folderPath}/${i}.${ext}`

      // eslint-disable-next-line no-await-in-loop
      const exists = await checkAssetExists(url)

      if (exists) {
        found = url
        break
      }
    }

    if (found) {
      urls.push(found)
      missesInRow = 0
      continue
    }

    missesInRow += 1

    if (urls.length > 0 && missesInRow >= 3) {
      break
    }
  }

  return urls
}

async function loadFolderPatchBySlug(slug: string): Promise<Partial<GiftConfig> | null> {
  if (!slug) {
    return null
  }

  const jsonPatch = await loadFolderPatchFromConfigJson(slug)

  if (jsonPatch) {
    return jsonPatch
  }

  const images = await probeSequentialFolderImages(slug)

  if (images.length === 0) {
    return null
  }

  const displayName = slugToDisplayName(slug)

  return {
    introText: `Happy Women's Day ${displayName}`,
    letterTitle: `Gửi ${displayName}`,
    flyingImages: images,
    bouquetImage: images[0],
  }
}

async function hydrateConfigFromRemoteSources(): Promise<void> {
  if (!activeSlug) {
    return
  }

  // If URL already provides full/partial payload (e.g. ?g=...), skip remote probing to avoid noisy requests.
  if (hasMeaningfulUrlOverrides(urlOverrides)) {
    return
  }

  let remotePatch: Partial<GiftConfig> | null = null

  if (isFirebaseEnabled()) {
    const cloudConfig = await loadGiftConfigFromFirebase(activeSlug)

    if (cloudConfig) {
      remotePatch = cloudConfig
    }
  }

  if (!remotePatch) {
    remotePatch = await loadFolderPatchBySlug(activeSlug)
  }

  if (!remotePatch) {
    return
  }

  config = {
    ...config,
    ...remotePatch,
    ...urlOverrides,
  }

  sessionMusicUrl = ''
  sessionMusicSeed = ''
  syncLetterDataWithConfig()
  applyConfigToScene()
}

function syncLetterDataWithConfig(): void {
  letterData.title = config.letterTitle
  letterData.content = config.letterContent
  letterData.signature = config.letterSignature
  letterData.flyingImages = config.flyingImages
  letterData.photoCompliments = config.photoCompliments
  letterData.hasVipPhotos = config.flyingImages.length > 0
}

function markZoomable(image: HTMLImageElement | null): void {
  if (!image) {
    return
  }

  image.dataset.zoomable = 'true'
  image.classList.add('zoomable-image')
}

function applyConfigToScene(): void {
  if (introTextEl) {
    introTextEl.textContent = config.introText
  }

  if (audio) {
    const musicUrl = resolveSessionMusicUrl()

    audio.loop = false
    audio.autoplay = false
    audio.preload = 'auto'
    audio.removeAttribute('loop')

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('nexttrack', () => {})
      navigator.mediaSession.setActionHandler('previoustrack', () => {})
    }

    audio.onended = () => {
      sessionMusicUrl = ''
      sessionMusicSeed = ''

      const nextMusic = resolveSessionMusicUrl()

      if (!nextMusic) {
        audio.pause()
        return
      }

      audio.src = nextMusic
      audio.load()
      audio.play().catch(() => {
        // Người dùng có thể chặn autoplay.
      })
    }

    if (musicUrl) {
      audio.src = musicUrl
      audio.load()
    } else {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
  }

  if (ramoImg) {
    ramoImg.src = config.bouquetImage
  }

  if (rabbitLeftImg) {
    rabbitLeftImg.src = config.rabbitLeftImage
  }

  if (rabbitRightImg) {
    rabbitRightImg.src = config.rabbitRightImage
  }

  markZoomable(ramoImg)
  markZoomable(rabbitLeftImg)
  markZoomable(rabbitRightImg)
}

function randomBetween(a: number, b: number): number {
  return Math.random() * (b - a) + a
}

function parseImageLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function parseTextLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Cannot read file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Cannot read file'))
    }

    reader.readAsDataURL(file)
  })
}

function createParticles(): void {
  const particlesContainer = document.querySelector('.particles')

  if (!particlesContainer) {
    return
  }

  const numParticles = 20

  for (let i = 0; i < numParticles; i += 1) {
    const p = document.createElement('div')
    p.className = 'particle'
    p.style.left = `${randomBetween(0, 100)}vw`

    const size = randomBetween(0.5, 1.5)
    p.style.width = `${size}vmin`
    p.style.height = `${size}vmin`

    p.style.animationDuration = `${randomBetween(3, 7)}s`
    p.style.animationDelay = `${randomBetween(0, 5)}s`
    p.style.opacity = String(randomBetween(0.4, 0.9))
    particlesContainer.appendChild(p)
  }
}

function showRamoAndRest(): void {
  ramoEl?.classList.add('ramo--visible')

  document.querySelectorAll('.rabbit').forEach((rabbit) => {
    rabbit.classList.add('rabbit--visible')
  })

  const letterEl = document.querySelector('.letter')
  letterEl?.classList.add('letter--visible')
}

function tryShowBouquet(): void {
  if (ramoImg?.complete) {
    showRamoAndRest()
    return
  }

  if (ramoImg) {
    ramoImg.addEventListener('load', showRamoAndRest, { once: true })
    ramoImg.addEventListener('error', showRamoAndRest, { once: true })
    window.setTimeout(showRamoAndRest, 8000)
    return
  }

  showRamoAndRest()
}

function playAudio(forceFromStart = false): void {
  if (!audio) {
    return
  }

  if (!audio.src) {
    const fallbackMusic = resolveSessionMusicUrl()

    if (!fallbackMusic) {
      return
    }

    audio.src = fallbackMusic
    audio.load()
  }

  if (forceFromStart || audio.ended) {
    audio.currentTime = 0
  }

  audio.play().catch(() => {
    // Người dùng có thể chặn autoplay.
  })
}

function setupGlobalAutoPlayOnInteraction(): void {
  if (autoPlayListenersBound) {
    return
  }

  autoPlayListenersBound = true

  const tryPlayFromGesture = (): void => {
    if (!audio || !audio.src) {
      return
    }

    if (!audio.paused && !audio.ended) {
      return
    }

    playAudio()
  }

  document.addEventListener('pointerdown', tryPlayFromGesture, { capture: true })
  document.addEventListener('touchstart', tryPlayFromGesture, { capture: true, passive: true })
  document.addEventListener('keydown', tryPlayFromGesture, { capture: true })
}

function startExperience(): void {
  orientationOverlay?.setAttribute('style', 'display:none')

  const letterEl = document.querySelector('.letter')
  ramoEl?.classList.remove('ramo--visible')
  document.querySelectorAll('.rabbit').forEach((r) => r.classList.remove('rabbit--visible'))
  letterEl?.classList.remove('letter--visible')
  introEl?.classList.remove('is-done')

  flowersEl?.classList.add('flowers--paused')
  document.body.classList.remove('not-loaded')

  window.setTimeout(() => {
    flowersEl?.classList.remove('flowers--paused')
  }, 500)

  window.setTimeout(() => {
    tryShowBouquet()
  }, 3500)

  window.setTimeout(() => {
    introEl?.classList.add('is-done')
  }, 6000)

}

function typeChar(chars: string[], index: number, el: HTMLElement, onDone?: () => void): void {
  if (index >= chars.length) {
    onDone?.()
    return
  }

  const ch = chars[index]

  if (ch === '\n') {
    el.appendChild(document.createElement('br'))
  } else {
    el.appendChild(document.createTextNode(ch))
  }

  if (letterModal?.classList.contains('is-open')) {
    el.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }

  const codePoint = ch.codePointAt(0) ?? 0
  const delay = ch.length > 1 || codePoint > 0xffff ? 50 : /[.,!?;:]/.test(ch) ? 70 : ch === ' ' ? 32 : 28

  letterTypingTimeout = window.setTimeout(() => {
    typeChar(chars, index + 1, el, onDone)
  }, delay)
}

function openLetterModal(): void {
  if (!letterModal || !letterTitleEl || !letterContentEl) {
    return
  }

  letterModal.classList.add('is-open')
  letterTitleEl.textContent = ''
  letterContentEl.innerHTML = ''

  if (letterModalFooter) {
    letterModalFooter.style.display = 'none'
  }

  const onTitleDone = (): void => {
    const paragraphs = letterData.content.split(/\n\n+/)
    let paraIndex = 0

    const typeNextParagraph = (): void => {
      if (paraIndex >= paragraphs.length) {
        if (letterData.signature) {
          const sigWrap = document.createElement('p')
          sigWrap.className = 'letter-modal__signature-wrap'
          sigWrap.style.margin = '20px 0 0 0'

          const sigEl = document.createElement('span')
          sigEl.className = 'letter-modal__signature'

          letterContentEl.appendChild(sigWrap)
          sigWrap.appendChild(sigEl)

          typeChar(Array.from(letterData.signature), 0, sigEl, () => {
            if (letterModalFooter && letterData.hasVipPhotos) {
              letterModalFooter.style.display = 'block'
            }
          })
        } else if (letterModalFooter && letterData.hasVipPhotos) {
          letterModalFooter.style.display = 'block'
        }

        return
      }

      const p = document.createElement('p')
      p.style.margin = '0 0 12px 0'
      letterContentEl.appendChild(p)

      const paraText = paragraphs[paraIndex].replace(/\n/g, '\n')
      typeChar(Array.from(paraText), 0, p, () => {
        paraIndex += 1
        typeNextParagraph()
      })
    }

    typeNextParagraph()
  }

  window.setTimeout(() => {
    typeChar(Array.from(letterData.title), 0, letterTitleEl, onTitleDone)
  }, 80)
}

function closeLetterModal(): void {
  if (letterTypingTimeout) {
    window.clearTimeout(letterTypingTimeout)
    letterTypingTimeout = null
  }

  letterModal?.classList.remove('is-open')
}

function shuffleArray(arr: number[] | string[]): typeof arr {
  const a = arr.slice() as typeof arr

  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i]
    a[i] = a[j]
    a[j] = temp
  }

  return a
}

function nextZone(): number {
  if (zonePointer >= shuffledZones.length) {
    shuffledZones = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) as number[]
    zonePointer = 0
  }

  return shuffledZones[zonePointer++]
}

function nextUrl(urls: string[]): string {
  if (shuffledUrls.length !== urls.length || urlPointer >= shuffledUrls.length) {
    shuffledUrls = shuffleArray(urls) as string[]
    urlPointer = 0
  }

  return shuffledUrls[urlPointer++]
}

function addFlyingBatch(): void {
  if (!photoFloatContainer || !photoFloatContainer.classList.contains('is-active')) {
    return
  }

  const urls = letterData.flyingImages.length > 0 ? letterData.flyingImages : [config.bouquetImage]
  const count = 2 + Math.floor(Math.random() * 2)

  for (let b = 0; b < count; b += 1) {
    const zone = nextZone()
    let leftPct = zone * 10 + 1.5 + Math.random() * 7
    leftPct = Math.min(Math.max(leftPct, 2), 88)

    const wrap = document.createElement('div')
    wrap.className = 'photo-float'
    wrap.style.left = `${leftPct}%`
    wrap.style.animationDuration = `${7 + Math.random() * 4}s`
    wrap.style.animationDelay = '0s'
    wrap.style.setProperty('--float-rotate', `${Math.random() * 30 - 15}deg`)

    const img = document.createElement('img')
    img.src = nextUrl(urls)
    img.alt = 'Ảnh kỷ niệm'
    img.style.width = '100%'
    img.style.height = 'auto'
    img.style.display = 'block'
    markZoomable(img)

    wrap.appendChild(img)
    wrap.addEventListener('animationend', () => {
      wrap.remove()
    })

    photoFloatContainer.appendChild(wrap)
  }
}

function startFlyingPhotos(): void {
  closeLetterModal()
  document.body.classList.add('content-hidden')

  if (!photoFloatContainer) {
    return
  }

  photoFloatContainer.classList.add('is-active')
  photoFloatContainer.innerHTML = ''

  shuffledUrls = []
  urlPointer = 0
  shuffledZones = []
  zonePointer = 0

  if (flyingInterval) {
    window.clearInterval(flyingInterval)
  }

  addFlyingBatch()
  flyingInterval = window.setInterval(addFlyingBatch, 2000)
}

function buildImageViewerItems(clickedSrc: string): string[] {
  const base = (letterData.flyingImages.length > 0 ? letterData.flyingImages : [config.bouquetImage])
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
  const unique = [...new Set(base)]

  if (clickedSrc && !unique.includes(clickedSrc)) {
    unique.unshift(clickedSrc)
  }

  return unique.length > 0 ? unique : [clickedSrc]
}

function uniqueStrings(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim()).filter((item) => item.length > 0))]
}

function buildImageViewerComplimentDeck(total: number): string[] {
  if (total <= 0) {
    return []
  }

  const customPool = uniqueStrings(letterData.photoCompliments)
  const fallbackPool = uniqueStrings(DEFAULT_GIFT_CONFIG.photoCompliments)

  const mergedPool = [...customPool]
  fallbackPool.forEach((line) => {
    if (!mergedPool.includes(line)) {
      mergedPool.push(line)
    }
  })

  const sourcePool = mergedPool.length > 0 ? mergedPool : ['Em luôn rạng rỡ và đáng yêu.']
  const deck: string[] = []

  while (deck.length < total) {
    const shuffled = shuffleArray(sourcePool) as string[]

    if (deck.length > 0 && shuffled.length > 1 && shuffled[0] === deck[deck.length - 1]) {
      const first = shuffled[0]
      shuffled[0] = shuffled[1]
      shuffled[1] = first
    }

    for (let i = 0; i < shuffled.length && deck.length < total; i += 1) {
      deck.push(shuffled[i])
    }
  }

  return deck
}

function getDeckComplimentByIndex(index: number): string {
  if (imageViewerComplimentDeck.length === 0) {
    return 'Em luôn rạng rỡ và đáng yêu.'
  }

  return imageViewerComplimentDeck[((index % imageViewerComplimentDeck.length) + imageViewerComplimentDeck.length) % imageViewerComplimentDeck.length]
}

function renderImageViewer(): void {
  if (!imageViewerImage || !imageViewerCompliment || !imageViewerCounter || imageViewerItems.length === 0) {
    return
  }

  const size = imageViewerItems.length
  const safeIndex = ((imageViewerIndex % size) + size) % size
  const src = imageViewerItems[safeIndex]

  imageViewerImage.src = src
  imageViewerImage.alt = imageViewerAlt
  imageViewerCompliment.textContent = getDeckComplimentByIndex(safeIndex)
  imageViewerCounter.textContent = `${safeIndex + 1}/${size}`
}

function clearImageViewerFlipState(): void {
  imageBookSpread?.classList.remove('is-flipping-next', 'is-flipping-prev')

  if (imageViewerFlipMidTimer) {
    window.clearTimeout(imageViewerFlipMidTimer)
    imageViewerFlipMidTimer = null
  }

  if (imageViewerFlipEndTimer) {
    window.clearTimeout(imageViewerFlipEndTimer)
    imageViewerFlipEndTimer = null
  }

  imageViewerFlipLock = false
}

function flipImageViewer(step: number): void {
  if (imageViewerItems.length <= 1 || imageViewerFlipLock || !imageBookSpread) {
    return
  }

  const normalizedStep = step >= 0 ? 1 : -1
  imageViewerFlipLock = true
  imageBookSpread.classList.remove('is-flipping-next', 'is-flipping-prev')
  imageBookSpread.classList.add(normalizedStep > 0 ? 'is-flipping-next' : 'is-flipping-prev')

  imageViewerFlipMidTimer = window.setTimeout(() => {
    imageViewerIndex += normalizedStep
    renderImageViewer()
  }, Math.round(IMAGE_FLIP_DURATION_MS * 0.46))

  imageViewerFlipEndTimer = window.setTimeout(() => {
    clearImageViewerFlipState()
  }, IMAGE_FLIP_DURATION_MS)
}

function openImageViewer(src: string, altText: string): void {
  if (!imageViewer || !imageViewerImage) {
    return
  }

  imageViewerItems = buildImageViewerItems(src)
  imageViewerComplimentDeck = buildImageViewerComplimentDeck(imageViewerItems.length)
  imageViewerIndex = Math.max(imageViewerItems.indexOf(src), 0)
  imageViewerAlt = altText || 'Ảnh phóng to'
  clearImageViewerFlipState()
  renderImageViewer()
  imageViewer.classList.add('is-open')
  imageViewer.hidden = false
}

function closeImageViewer(): void {
  if (!imageViewer || !imageViewerImage) {
    return
  }

  imageViewer.classList.remove('is-open')
  imageViewer.hidden = true
  imageViewerImage.src = ''
  imageViewerItems = []
  imageViewerComplimentDeck = []
  imageViewerIndex = 0
  clearImageViewerFlipState()

  if (imageViewerCompliment) {
    imageViewerCompliment.textContent = ''
  }

  if (imageViewerCounter) {
    imageViewerCounter.textContent = ''
  }
}

function setupImageViewer(): void {
  if (!imageViewer) {
    return
  }

  imageViewerClose?.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
    event.stopPropagation()
    closeImageViewer()
  })

  imageBookSpread?.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const rect = imageBookSpread.getBoundingClientRect()

    if (rect.width <= 0) {
      return
    }

    const x = (event as MouseEvent).clientX - rect.left
    const step = x < rect.width / 2 ? -1 : 1

    flipImageViewer(step)
  })

  imageViewer.addEventListener('click', (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    if (!target.closest('.image-book')) {
      closeImageViewer()
    }
  })

  document.addEventListener('click', (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const image = target.closest('img[data-zoomable="true"]') as HTMLImageElement | null

    if (!image || !image.src) {
      return
    }

    openImageViewer(image.src, image.alt)
  })
}

function setupAdminPanel(): void {
  const adminHotspot = document.getElementById('adminHotspot') as HTMLButtonElement | null
  const adminPanel = document.getElementById('adminPanel')
  const adminBackdrop = document.getElementById('adminBackdrop')
  const adminClose = document.getElementById('adminClose') as HTMLButtonElement | null
  const adminForm = document.getElementById('adminForm') as HTMLFormElement | null
  const adminReset = document.getElementById('adminReset') as HTMLButtonElement | null
  const adminStatus = document.getElementById('adminStatus')

  const adminIntroText = document.getElementById('adminIntroText') as HTMLInputElement | null
  const adminLetterTitle = document.getElementById('adminLetterTitle') as HTMLInputElement | null
  const adminLetterContent = document.getElementById('adminLetterContent') as HTMLTextAreaElement | null
  const adminLetterSignature = document.getElementById('adminLetterSignature') as HTMLInputElement | null
  const adminMusicUrl = document.getElementById('adminMusicUrl') as HTMLInputElement | null
  const adminMusicFile = document.getElementById('adminMusicFile') as HTMLInputElement | null
  const adminBouquetImage = document.getElementById('adminBouquetImage') as HTMLInputElement | null
  const adminRabbitLeftImage = document.getElementById('adminRabbitLeftImage') as HTMLInputElement | null
  const adminRabbitRightImage = document.getElementById('adminRabbitRightImage') as HTMLInputElement | null
  const adminFlyingImages = document.getElementById('adminFlyingImages') as HTMLTextAreaElement | null
  const adminPhotoCompliments = document.getElementById('adminPhotoCompliments') as HTMLTextAreaElement | null
  const adminFlyingImageFiles = document.getElementById('adminFlyingImageFiles') as HTMLInputElement | null

  if (
    !adminPanel ||
    !adminBackdrop ||
    !adminClose ||
    !adminForm ||
    !adminReset ||
    !adminStatus ||
    !adminIntroText ||
    !adminLetterTitle ||
    !adminLetterContent ||
    !adminLetterSignature ||
    !adminMusicUrl ||
    !adminMusicFile ||
    !adminBouquetImage ||
    !adminRabbitLeftImage ||
    !adminRabbitRightImage ||
    !adminFlyingImages ||
    !adminPhotoCompliments ||
    !adminFlyingImageFiles
  ) {
    return
  }

  const setStatus = (message: string, type: 'ok' | 'error' = 'ok'): void => {
    adminStatus.textContent = message
    adminStatus.classList.remove('is-ok', 'is-error')

    if (message.length > 0) {
      adminStatus.classList.add(type === 'ok' ? 'is-ok' : 'is-error')
    }
  }

  const fillForm = (value: GiftConfig): void => {
    adminIntroText.value = value.introText
    adminLetterTitle.value = value.letterTitle
    adminLetterContent.value = value.letterContent
    adminLetterSignature.value = value.letterSignature
    adminMusicUrl.value = value.musicUrl
    adminBouquetImage.value = value.bouquetImage
    adminRabbitLeftImage.value = value.rabbitLeftImage
    adminRabbitRightImage.value = value.rabbitRightImage
    adminFlyingImages.value = value.flyingImages.join('\n')
    adminPhotoCompliments.value = value.photoCompliments.join('\n')
  }

  const closePanel = (): void => {
    adminPanel.classList.remove('is-open')
    adminPanel.hidden = true
    setStatus('')
  }

  const openPanel = (): void => {
    fillForm(config)
    adminPanel.hidden = false
    adminPanel.classList.add('is-open')
    setStatus('')
  }

  adminHotspot?.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    openPanel()
  })

  adminBackdrop.addEventListener('click', closePanel)
  adminClose.addEventListener('click', closePanel)

  adminMusicFile.addEventListener('change', async () => {
    const file = adminMusicFile.files?.[0]

    if (!file) {
      return
    }

    try {
      const dataUrl = await readAsDataUrl(file)
      adminMusicUrl.value = dataUrl
      setStatus('Đã nạp file nhạc. Nhấn Lưu cấu hình.', 'ok')
    } catch {
      setStatus('Không đọc được file nhạc.', 'error')
    }
  })

  adminFlyingImageFiles.addEventListener('change', async () => {
    const files = Array.from(adminFlyingImageFiles.files ?? [])

    if (files.length === 0) {
      return
    }

    try {
      const dataUrls = await Promise.all(files.map((file) => readAsDataUrl(file)))
      const merged = [...parseImageLines(adminFlyingImages.value), ...dataUrls]
      adminFlyingImages.value = merged.join('\n')
      setStatus('Đã nạp ảnh. Nhấn Lưu cấu hình.', 'ok')
    } catch {
      setStatus('Không đọc được ảnh vừa chọn.', 'error')
    }
  })

  adminForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const bouquet = adminBouquetImage.value.trim() || DEFAULT_GIFT_CONFIG.bouquetImage
    const images = parseImageLines(adminFlyingImages.value)
    const compliments = parseTextLines(adminPhotoCompliments.value)

    config = {
      introText: adminIntroText.value.trim() || DEFAULT_GIFT_CONFIG.introText,
      letterTitle: adminLetterTitle.value.trim() || DEFAULT_GIFT_CONFIG.letterTitle,
      letterContent: adminLetterContent.value.trim() || DEFAULT_GIFT_CONFIG.letterContent,
      letterSignature: adminLetterSignature.value.trim() || DEFAULT_GIFT_CONFIG.letterSignature,
      musicUrl: adminMusicUrl.value.trim(),
      bouquetImage: bouquet,
      rabbitLeftImage: adminRabbitLeftImage.value.trim() || DEFAULT_GIFT_CONFIG.rabbitLeftImage,
      rabbitRightImage: adminRabbitRightImage.value.trim() || DEFAULT_GIFT_CONFIG.rabbitRightImage,
      flyingImages: images.length > 0 ? images : [bouquet],
      photoCompliments: compliments.length > 0 ? compliments : [...DEFAULT_GIFT_CONFIG.photoCompliments],
    }

    sessionMusicUrl = ''
    sessionMusicSeed = ''
    saveActiveConfig(config)
    syncLetterDataWithConfig()
    applyConfigToScene()
    setStatus('Đã lưu. Trang thiệp đã cập nhật ngay.', 'ok')
  })

  adminReset.addEventListener('click', () => {
    clearActiveConfig()
    config = {
      ...DEFAULT_GIFT_CONFIG,
      ...presetConfig,
    }
    sessionMusicUrl = ''
    sessionMusicSeed = ''
    syncLetterDataWithConfig()
    applyConfigToScene()
    fillForm(config)
    setStatus('Đã reset về mặc định.', 'ok')
  })

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'e') {
      event.preventDefault()

      if (adminPanel.classList.contains('is-open')) {
        closePanel()
      } else {
        openPanel()
      }
    }

    if (event.key === 'Escape' && adminPanel.classList.contains('is-open')) {
      closePanel()
    }
  })
}

syncLetterDataWithConfig()
applyConfigToScene()
createParticles()
setupImageViewer()
setupAdminPanel()
setupGlobalAutoPlayOnInteraction()
void hydrateConfigFromRemoteSources()

btnDaHieu?.addEventListener('click', () => {
  playAudio(true)
  startExperience()
})

letterEnvelope?.addEventListener('click', (event) => {
  event.preventDefault()
  openLetterModal()
})

letterCloseBtn?.addEventListener('click', (event) => {
  event.preventDefault()
  event.stopPropagation()
  closeLetterModal()
})

letterModal?.querySelector('.letter-modal__backdrop')?.addEventListener('click', closeLetterModal)

letterBtnContinue?.addEventListener('click', startFlyingPhotos)

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' && imageViewer?.classList.contains('is-open')) {
    event.preventDefault()
    flipImageViewer(1)
    return
  }

  if (event.key === 'ArrowLeft' && imageViewer?.classList.contains('is-open')) {
    event.preventDefault()
    flipImageViewer(-1)
    return
  }

  if (event.key === 'Escape' && imageViewer?.classList.contains('is-open')) {
    closeImageViewer()
    return
  }

  if ((event.key === 'x' || event.key === 'X') && imageViewer?.classList.contains('is-open')) {
    closeImageViewer()
    return
  }

  if (event.key === 'Escape' && letterModal?.classList.contains('is-open')) {
    closeLetterModal()
  }

  if ((event.key === 'x' || event.key === 'X') && letterModal?.classList.contains('is-open')) {
    closeLetterModal()
  }
})
