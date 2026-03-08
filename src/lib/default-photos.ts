// Reliable placeholder images (Picsum) – same URL always loads. Replace with your own in public/images or swap to Unsplash.

const w = (seed: string, width: number, height?: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height ?? Math.round(width * 0.6)}`

export const defaultPhotos = {
  // Hero slider – multiple slides
  heroSlides: [
    w('wedding-hero-1', 1920, 1080),
    w('wedding-hero-2', 1920, 1080),
    w('wedding-hero-3', 1920, 1080),
    w('wedding-hero-4', 1920, 1080),
  ],
  // Single hero image (fallback / first slide)
  hero: w('wedding-hero-1', 1920, 1080),
  ceremony: w('ceremony-venue', 800, 500),
  reception: w('reception-venue', 800, 500),
  gallery: [
    w('gallery-1', 600, 600),
    w('gallery-2', 600, 600),
    w('gallery-3', 600, 600),
    w('gallery-4', 600, 600),
    w('gallery-5', 600, 600),
    w('gallery-6', 600, 600),
  ],
}
