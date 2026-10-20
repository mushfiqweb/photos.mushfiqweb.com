import photosData from './photos-db.json'

export interface PhotoExif {
  camera?: string | null
  make?: string | null
  model?: string | null
  lens?: string | null
  focalLength?: string | null
  focalLength35mm?: string | null
  aperture?: string | null
  shutterSpeed?: string | null
  iso?: string | null
  isoValue?: number | null
  meteringMode?: string | null
  whiteBalance?: string | null
  dateTaken?: string | null
  dateTakenISO?: string | null
  software?: string | null
}

export interface Photo {
  id: string
  filename: string
  src: string
  url: string
  fileSizeBytes: number
  fileSize: string
  width: number
  height: number
  aspectRatio: number
  orientation: 'landscape' | 'portrait' | 'square'
  title: string
  caption: string
  description?: string
  category: string
  tags?: string[]
  blurDataURL?: string
  exif: PhotoExif
  rawExif?: Record<string, any>
}

export const ALL_PHOTOS: Photo[] = photosData as Photo[]

export const CATEGORIES = [
  'All',
  'Street & Life',
  'Nature & Flora',
  'Portraits',
  'Concerts & Music',
  'Urban & Architecture',
  'Monochrome',
] as const

export type Category = (typeof CATEGORIES)[number]

export function getAllPhotos(): Photo[] {
  return ALL_PHOTOS
}

export function getPhotoById(id: string): Photo | undefined {
  return ALL_PHOTOS.find((p) => p.id === id)
}

export function getPhotosByCategory(category: string): Photo[] {
  if (category === 'All' || !category) return ALL_PHOTOS
  return ALL_PHOTOS.filter((p) => p.category === category)
}

export function photoToSlug(photo: Photo): string {
  return photo.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function findPhotoBySlug(photos: Photo[], hash: string): Photo | undefined {
  if (!hash) return undefined
  const clean = decodeURIComponent(hash.replace(/^#/, '')).toLowerCase().trim()
  if (!clean) return undefined

  return (
    photos.find((p) => photoToSlug(p) === clean) ||
    photos.find((p) => p.id.toLowerCase() === clean) ||
    photos.find((p) => p.filename.toLowerCase().replace(/\.[^/.]+$/, '') === clean)
  )
}
