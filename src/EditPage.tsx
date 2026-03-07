import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  DEFAULT_GIFT_CONFIG,
  SONG_LIBRARY,
  buildGiftConfigPatch,
  clearGiftConfig,
  clearGiftConfigBySlug,
  encodeGiftConfigToToken,
  loadGiftConfig,
  loadGiftConfigBySlug,
  saveGiftConfig,
  saveGiftConfigBySlug,
  toSlug,
  type GiftConfig,
} from './config'
import {
  clearGiftConfigFromFirebase,
  isFirebaseEnabled,
  loadGiftConfigFromFirebase,
  saveGiftConfigToFirebase,
} from './firebase-gifts'
import { isCloudinaryEnabled, uploadDataUrlToCloudinary, uploadFileToCloudinary } from './cloudinary'
import { getPresetFromPath } from './presets'
import './edit-page.css'

type StatusType = 'ok' | 'error' | ''
const LAST_EDIT_SLUG_KEY = 'wday_last_edit_slug_v1'

function toImageList(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function toTextList(text: string): string[] {
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

function getInitialSlug(): string {
  const params = new URLSearchParams(window.location.search)
  const fromQuery = toSlug(params.get('slug') ?? params.get('name') ?? '')

  if (fromQuery) {
    return fromQuery
  }

  try {
    return toSlug(window.localStorage.getItem(LAST_EDIT_SLUG_KEY) ?? '')
  } catch {
    return ''
  }
}

function getBaseConfigForSlug(slug: string): GiftConfig {
  const preset = slug ? getPresetFromPath(`/${slug}`) : null

  return {
    ...DEFAULT_GIFT_CONFIG,
    ...(preset ?? {}),
  }
}

function loadConfigForSlug(slug: string): GiftConfig {
  if (!slug) {
    return loadGiftConfig()
  }

  return loadGiftConfigBySlug(slug) ?? getBaseConfigForSlug(slug)
}

function persistLastEditSlug(slug: string): void {
  try {
    if (slug) {
      window.localStorage.setItem(LAST_EDIT_SLUG_KEY, slug)
      return
    }

    window.localStorage.removeItem(LAST_EDIT_SLUG_KEY)
  } catch {
    // Ignore localStorage failures.
  }
}

function hasInlineDataUrls(config: GiftConfig): boolean {
  if (config.musicUrl.startsWith('data:')) {
    return true
  }

  const urls = [config.bouquetImage, config.rabbitLeftImage, config.rabbitRightImage, ...config.flyingImages]
  return urls.some((url) => url.startsWith('data:'))
}

export default function EditPage() {
  const initialSlug = useMemo(() => getInitialSlug(), [])
  const [slug, setSlug] = useState<string>(initialSlug)
  const [config, setConfig] = useState<GiftConfig>(() => loadConfigForSlug(initialSlug))
  const [shareLink, setShareLink] = useState<string>('')
  const [status, setStatus] = useState<{ message: string; type: StatusType }>({
    message: '',
    type: '',
  })
  const firebaseEnabled = useMemo(() => isFirebaseEnabled(), [])
  const cloudinaryEnabled = useMemo(() => isCloudinaryEnabled(), [])

  const previewImages = useMemo(() => toImageList(config.flyingImages.join('\n')), [config.flyingImages])

  const setField = <K extends keyof GiftConfig>(field: K, value: GiftConfig[K]) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const uploadInlineAssetsToCloudinary = async (slugValue: string, source: GiftConfig): Promise<GiftConfig | null> => {
    const next: GiftConfig = {
      ...source,
      flyingImages: [...source.flyingImages],
      photoCompliments: [...source.photoCompliments],
    }

    const uploadOne = async (value: string, kind: 'images' | 'music'): Promise<string | null> => {
      if (!value.startsWith('data:')) {
        return value
      }

      return uploadDataUrlToCloudinary(value, { slug: slugValue, kind })
    }

    const musicUploaded = await uploadOne(next.musicUrl, 'music')
    if (next.musicUrl.startsWith('data:') && !musicUploaded) {
      return null
    }
    if (musicUploaded) {
      next.musicUrl = musicUploaded
    }

    const bouquetUploaded = await uploadOne(next.bouquetImage, 'images')
    if (next.bouquetImage.startsWith('data:') && !bouquetUploaded) {
      return null
    }
    if (bouquetUploaded) {
      next.bouquetImage = bouquetUploaded
    }

    const leftUploaded = await uploadOne(next.rabbitLeftImage, 'images')
    if (next.rabbitLeftImage.startsWith('data:') && !leftUploaded) {
      return null
    }
    if (leftUploaded) {
      next.rabbitLeftImage = leftUploaded
    }

    const rightUploaded = await uploadOne(next.rabbitRightImage, 'images')
    if (next.rabbitRightImage.startsWith('data:') && !rightUploaded) {
      return null
    }
    if (rightUploaded) {
      next.rabbitRightImage = rightUploaded
    }

    for (let i = 0; i < next.flyingImages.length; i += 1) {
      const item = next.flyingImages[i]

      if (!item.startsWith('data:')) {
        continue
      }

      const uploaded = await uploadDataUrlToCloudinary(item, { slug: slugValue, kind: 'images' })

      if (!uploaded) {
        return null
      }

      next.flyingImages[i] = uploaded
    }

    return next
  }

  const applySlugContext = async (value: string) => {
    const nextSlug = toSlug(value)
    setSlug(nextSlug)
    const nextConfig = loadConfigForSlug(nextSlug)
    setConfig(nextConfig)
    setShareLink('')
    persistLastEditSlug(nextSlug)

    if (nextSlug && firebaseEnabled) {
      const cloudConfig = await loadGiftConfigFromFirebase(nextSlug)

      if (cloudConfig) {
        setConfig(cloudConfig)
        setStatus({
          message: `Đã nạp cấu hình cloud cho /${nextSlug}.`,
          type: 'ok',
        })
        return
      }
    }

    setStatus({
      message: nextSlug
        ? firebaseEnabled
          ? `Không có dữ liệu cloud cho /${nextSlug}, đang dùng local/preset.`
          : `Đã chuyển sang cấu hình /${nextSlug}.`
        : 'Đã chuyển sang cấu hình mặc định (/).',
      type: 'ok',
    })
  }

  const onMusicFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const normalizedSlug = toSlug(slug)

    try {
      if (cloudinaryEnabled) {
        setStatus({ message: 'Đang upload nhạc lên Cloudinary...', type: 'ok' })
        const uploadedUrl = await uploadFileToCloudinary(file, {
          slug: normalizedSlug || undefined,
          kind: 'music',
        })

        if (uploadedUrl) {
          setField('musicUrl', uploadedUrl)
          setStatus({ message: 'Đã upload nhạc cloud, nhớ bấm Lưu.', type: 'ok' })
          return
        }
      }

      const dataUrl = await readAsDataUrl(file)
      setField('musicUrl', dataUrl)
      setStatus({
        message: !cloudinaryEnabled
          ? 'Đã nạp nhạc local, nhớ bấm Lưu.'
          : 'Upload cloud lỗi, đã fallback sang local data URL. Nhớ bấm Lưu.',
        type: cloudinaryEnabled ? 'error' : 'ok',
      })
    } catch {
      setStatus({ message: 'Không đọc được file nhạc.', type: 'error' })
    }
  }

  const onImageFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    const normalizedSlug = toSlug(slug)

    try {
      if (cloudinaryEnabled) {
        setStatus({ message: 'Đang upload ảnh lên Cloudinary...', type: 'ok' })
        const uploadedUrls: string[] = []

        for (const file of files) {
          // eslint-disable-next-line no-await-in-loop
          const uploaded = await uploadFileToCloudinary(file, {
            slug: normalizedSlug || undefined,
            kind: 'images',
          })

          if (!uploaded) {
            throw new Error('Upload image failed')
          }

          uploadedUrls.push(uploaded)
        }

        setConfig((prev) => ({
          ...prev,
          flyingImages: uploadedUrls,
        }))
        setStatus({ message: `Đã upload ${uploadedUrls.length} ảnh cloud, nhớ bấm Lưu.`, type: 'ok' })
        return
      }

      const urls = await Promise.all(files.map((file) => readAsDataUrl(file)))
      setConfig((prev) => ({
        ...prev,
        flyingImages: urls,
      }))
      setStatus({
        message: !cloudinaryEnabled
          ? `Đã nạp ${urls.length} ảnh local, nhớ bấm Lưu.`
          : 'Upload cloud lỗi, đã fallback sang ảnh local data URL. Nhớ bấm Lưu.',
        type: cloudinaryEnabled ? 'error' : 'ok',
      })
    } catch {
      setStatus({ message: 'Không upload/đọc được ảnh.', type: 'error' })
    }
  }

  const buildCleanConfig = (): GiftConfig => {
    const trimmedFlyingImages = config.flyingImages.map((item) => item.trim()).filter((item) => item.length > 0)
    const fallbackImage = config.bouquetImage.trim() || DEFAULT_GIFT_CONFIG.bouquetImage
    const normalizedFlyingImages = trimmedFlyingImages.length > 0 ? trimmedFlyingImages : [fallbackImage]
    const normalizedBouquetImage = config.bouquetImage.trim() || normalizedFlyingImages[0] || DEFAULT_GIFT_CONFIG.bouquetImage

    return {
      introText: config.introText.trim() || DEFAULT_GIFT_CONFIG.introText,
      letterTitle: config.letterTitle.trim() || DEFAULT_GIFT_CONFIG.letterTitle,
      letterContent: config.letterContent.trim() || DEFAULT_GIFT_CONFIG.letterContent,
      letterSignature: config.letterSignature.trim() || DEFAULT_GIFT_CONFIG.letterSignature,
      musicUrl: config.musicUrl.trim(),
      bouquetImage: normalizedBouquetImage,
      rabbitLeftImage: config.rabbitLeftImage.trim() || DEFAULT_GIFT_CONFIG.rabbitLeftImage,
      rabbitRightImage: config.rabbitRightImage.trim() || DEFAULT_GIFT_CONFIG.rabbitRightImage,
      flyingImages: normalizedFlyingImages,
      photoCompliments:
        config.photoCompliments.length > 0 ? config.photoCompliments : [...DEFAULT_GIFT_CONFIG.photoCompliments],
    }
  }

  const buildTokenShareLink = (cleaned: GiftConfig, slugValue: string): string => {
    const normalizedSlug = toSlug(slugValue)
    const base = getBaseConfigForSlug(normalizedSlug)
    const patch = buildGiftConfigPatch(cleaned, base)
    const token = encodeGiftConfigToToken(patch)
    const path = normalizedSlug ? `/${normalizedSlug}` : '/'
    const url = new URL(path, window.location.origin)
    url.searchParams.set('g', token)
    return url.toString()
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedSlug = toSlug(slug)
    let cleaned = buildCleanConfig()
    let firebaseSaved = false

    if (normalizedSlug) {
      if (cloudinaryEnabled && hasInlineDataUrls(cleaned)) {
        setStatus({ message: 'Đang chuyển ảnh/nhạc local lên Cloudinary...', type: 'ok' })
        const uploadedConfig = await uploadInlineAssetsToCloudinary(normalizedSlug, cleaned)

        if (!uploadedConfig) {
          setStatus({
            message: 'Có file local chưa upload được lên cloud. Hãy thử upload lại ảnh/nhạc rồi lưu.',
            type: 'error',
          })
          return
        }

        cleaned = uploadedConfig
      }

      saveGiftConfigBySlug(normalizedSlug, cleaned)

      if (firebaseEnabled) {
        firebaseSaved = await saveGiftConfigToFirebase(normalizedSlug, cleaned)
      }
    } else {
      saveGiftConfig(cleaned)
    }

    persistLastEditSlug(normalizedSlug)
    setSlug(normalizedSlug)
    setConfig(cleaned)
    const tokenLink = buildTokenShareLink(cleaned, normalizedSlug)
    setShareLink(tokenLink)
    setStatus({
      message: normalizedSlug
        ? firebaseEnabled
          ? firebaseSaved
            ? `Đã lưu /${normalizedSlug}. Hãy gửi link có ?g= để máy nào cũng mở đúng ảnh.`
            : `Firebase chưa lưu được, nhưng link ?g= vẫn dùng tốt trên mọi máy.`
          : `Đã lưu Cloudinary-only. Hãy gửi link có ?g= trong ô bên dưới để máy nào cũng mở đúng ảnh.`
        : 'Đã lưu. Mở trang / để xem thay đổi.',
      type: 'ok',
    })
  }

  const handleBuildShareLink = () => {
    const cleaned = buildCleanConfig()
    const normalizedSlug = toSlug(slug)
    const link = buildTokenShareLink(cleaned, normalizedSlug)
    setShareLink(link)

    if (hasInlineDataUrls(cleaned)) {
      setStatus({
        message: 'Bạn đang dùng ảnh/nhạc upload trực tiếp (data URL) nên link vẫn dễ dài. Nên đổi sang URL online để link ngắn.',
        type: 'error',
      })
      return
    }

    if (link.length > 7000) {
      setStatus({
        message: 'Link vẫn quá dài. Giảm số ảnh hoặc dùng URL ảnh ngắn hơn.',
        type: 'error',
      })
      return
    }

    setStatus({
      message: 'Đã tạo link chia sẻ không cần database. Gửi link này là người nhận mở đúng nội dung.',
      type: 'ok',
    })
  }

  const handleCopyShareLink = async () => {
    if (!shareLink) {
      setStatus({ message: 'Chưa có link để copy. Bấm Tạo link chia sẻ trước.', type: 'error' })
      return
    }

    try {
      await navigator.clipboard.writeText(shareLink)
      setStatus({ message: 'Đã copy link chia sẻ.', type: 'ok' })
    } catch {
      setStatus({ message: 'Không copy được tự động, hãy copy thủ công ở ô link.', type: 'error' })
    }
  }

  const handleCopySlugLink = async () => {
    const normalizedSlug = toSlug(slug)

    if (!normalizedSlug) {
      setStatus({ message: 'Nhập slug trước khi copy link.', type: 'error' })
      return
    }

    const cleaned = buildCleanConfig()
    const link = buildTokenShareLink(cleaned, normalizedSlug)

    try {
      await navigator.clipboard.writeText(link)
      setShareLink(link)
      setStatus({ message: `Đã copy link ${link}`, type: 'ok' })
    } catch {
      setShareLink(link)
      setStatus({ message: 'Không copy được tự động, đã điền link vào ô để copy tay.', type: 'error' })
    }
  }

  const handleReset = async () => {
    const normalizedSlug = toSlug(slug)

    if (normalizedSlug) {
      if (firebaseEnabled) {
        await clearGiftConfigFromFirebase(normalizedSlug)
      }

      clearGiftConfigBySlug(normalizedSlug)
      const base = getBaseConfigForSlug(normalizedSlug)
      setConfig(base)
      setShareLink('')
      setStatus({
        message: firebaseEnabled
          ? `Đã xóa local + cloud cho /${normalizedSlug}.`
          : `Đã xóa cấu hình /${normalizedSlug}. Link đó vẫn mở được với giao diện mặc định/preset.`,
        type: 'ok',
      })
      return
    }

    clearGiftConfig()
    setConfig({ ...DEFAULT_GIFT_CONFIG })
    setShareLink('')
    setStatus({ message: 'Đã reset về mặc định (/).', type: 'ok' })
  }

  const linkPath = slug ? `/${slug}` : '/'

  return (
    <main className="edit-page">
      <header className="edit-page__header">
        <h1>Chỉnh sửa thiệp 8/3</h1>
        <a href="/" className="edit-page__back">
          Xem thiệp
        </a>
      </header>

      <form className="edit-form" onSubmit={handleSave}>
        <label>
          <span>Tên link người nhận (slug). Ví dụ: hongnhung, trang</span>
          <input value={slug} onChange={(e) => setSlug(toSlug(e.target.value))} placeholder="hongnhung" />
        </label>

        <div className="edit-slug-actions">
          <button
            type="button"
            className="edit-btn"
            onClick={() => {
              void applySlugContext(slug)
            }}
          >
            Nạp theo tên
          </button>
          <a href={linkPath} className="edit-btn">
            Mở {linkPath}
          </a>
          <button type="button" className="edit-btn" onClick={handleCopySlugLink}>
            Copy link gửi đi
          </button>
        </div>

        <p className="edit-note">
          Firebase: <strong>{firebaseEnabled ? 'ON' : 'OFF'}</strong>.{' '}
          {firebaseEnabled
            ? 'Đang lưu online theo slug, gửi link /ten là máy khác mở đúng.'
            : 'Không dùng Firebase: gửi link có ?g= để máy khác mở đúng ảnh.'}
        </p>

        <p className="edit-note">
          Cloudinary: <strong>{cloudinaryEnabled ? 'ON' : 'OFF'}</strong>.{' '}
          {cloudinaryEnabled
            ? 'Upload ảnh/nhạc trong form sẽ đẩy lên Cloudinary, rồi lưu URL vào Firestore.'
            : 'Chưa cấu hình Cloudinary nên upload chỉ lưu local (data URL).'}
        </p>

        <p className="edit-note">
          Cách gọn nhất không cần DB: upload ảnh vào <code>{`public/gifts/${slug || 'hongnhung'}/`}</code> theo tên{' '}
          <code>1.jpg, 2.jpg...</code>. Vào link <code>{slug ? `/${slug}` : '/hongnhung'}</code> sẽ tự lấy đúng bộ ảnh đó.
        </p>

        <div className="edit-slug-actions">
          <button type="button" className="edit-btn" onClick={handleBuildShareLink}>
            Tạo link chia sẻ (không cần DB)
          </button>
          <button type="button" className="edit-btn" onClick={handleCopyShareLink}>
            Copy link
          </button>
        </div>

        <label>
          <span>Link chia sẻ đầy đủ (gửi cho người nhận mở máy nào cũng ra đúng nội dung)</span>
          <textarea rows={3} value={shareLink} onChange={(e) => setShareLink(e.target.value)} />
        </label>

        <label>
          <span>Intro text</span>
          <input value={config.introText} onChange={(e) => setField('introText', e.target.value)} />
        </label>

        <label>
          <span>Tiêu đề thư</span>
          <input value={config.letterTitle} onChange={(e) => setField('letterTitle', e.target.value)} />
        </label>

        <label>
          <span>Nội dung thư</span>
          <textarea
            rows={7}
            value={config.letterContent}
            onChange={(e) => setField('letterContent', e.target.value)}
          />
        </label>

        <label>
          <span>Chữ ký</span>
          <input value={config.letterSignature} onChange={(e) => setField('letterSignature', e.target.value)} />
        </label>

        <label>
          <span>Nhạc (1 link hoặc nhiều link, mỗi dòng 1 link). Để trống = random từ thư viện.</span>
          <textarea rows={4} value={config.musicUrl} onChange={(e) => setField('musicUrl', e.target.value)} />
        </label>

        <label>
          <span>Upload 1 bài nhạc</span>
          <input type="file" accept="audio/*" onChange={onMusicFileChange} />
        </label>

        <label>
          <span>Ảnh bó hoa (URL)</span>
          <input value={config.bouquetImage} onChange={(e) => setField('bouquetImage', e.target.value)} />
        </label>

        <label>
          <span>Ảnh thỏ trái (URL)</span>
          <input value={config.rabbitLeftImage} onChange={(e) => setField('rabbitLeftImage', e.target.value)} />
        </label>

        <label>
          <span>Ảnh thỏ phải (URL)</span>
          <input value={config.rabbitRightImage} onChange={(e) => setField('rabbitRightImage', e.target.value)} />
        </label>

        <label>
          <span>Ảnh bay (mỗi dòng 1 URL/data URL)</span>
          <textarea
            rows={6}
            value={config.flyingImages.join('\n')}
            onChange={(e) => setField('flyingImages', toImageList(e.target.value))}
          />
        </label>

        <label>
          <span>Lời khen theo ảnh (mỗi dòng 1 câu). Nếu ít hơn số ảnh, hệ thống tự random thêm từ bộ 20+ câu.</span>
          <textarea
            rows={5}
            value={config.photoCompliments.join('\n')}
            onChange={(e) => setField('photoCompliments', toTextList(e.target.value))}
          />
        </label>

        <label>
          <span>Upload nhiều ảnh bay</span>
          <input type="file" accept="image/*" multiple onChange={onImageFilesChange} />
        </label>

        <section className="edit-preview">
          <h2>Thư viện nhạc mặc định</h2>
          <p>{SONG_LIBRARY.length} bài. Để trống trường nhạc là hệ thống tự random theo lượt mở.</p>
          <h2>Preview ảnh bay</h2>
          <div className="edit-preview__grid">
            {previewImages.map((url, index) => (
              <div className="edit-preview__item" key={`${url}-${index}`}>
                <img src={url} alt="preview" />
              </div>
            ))}
          </div>
        </section>

        <div className="edit-actions">
          <button type="submit" className="edit-btn edit-btn--primary">
            Lưu cấu hình
          </button>
          <button type="button" className="edit-btn" onClick={handleReset}>
            Reset mặc định
          </button>
        </div>

        <p className={`edit-status ${status.type ? `is-${status.type}` : ''}`}>{status.message}</p>
      </form>
    </main>
  )
}
