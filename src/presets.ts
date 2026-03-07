import { getPathSlug, type GiftConfig } from './config'

type GiftPreset = Partial<GiftConfig>

const PERSON_PRESETS: Record<string, GiftPreset> = {
  hongnhung: {
    introText: "Happy Women's Day Hồng Nhung",
    letterTitle: 'Gửi Hồng Nhung',
    letterContent:
      'Chúc em một ngày 8/3 thật rạng rỡ và đầy niềm vui.\n\nCảm ơn em vì luôn dịu dàng và đáng yêu theo cách rất riêng.\n\nMong mọi điều tốt đẹp sẽ luôn đến với em.',
    letterSignature: 'Người thương em ❤️',
    bouquetImage: 'https://womensdaypro.onrender.com/assets/images/wrapper_flower.png',
    rabbitLeftImage: 'https://womensdaypro.onrender.com/assets/images/mewmew.gif',
    rabbitRightImage: 'https://womensdaypro.onrender.com/assets/images/mewmew.gif',
    flyingImages: ['https://womensdaypro.onrender.com/assets/images/wrapper_flower.png'],
    photoCompliments: ['Hồng Nhung luôn tỏa sáng theo cách rất riêng.'],
  },
}

export function getPresetFromPath(pathname: string): GiftPreset | null {
  const slug = getPathSlug(pathname)

  if (!slug) {
    return null
  }

  return PERSON_PRESETS[slug] ?? null
}
