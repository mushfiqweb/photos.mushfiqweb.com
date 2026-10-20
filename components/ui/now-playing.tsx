'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import { Brand } from '~/components/ui/brand'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { MusicWaves } from '~/components/ui/music-waves'
import { useNowPlaying } from '~/hooks/use-now-playing'

export function SpotifyNowPlaying({
  className,
  showCover,
  songEffect = 'none',
  isActive,
  hideAlbumOnMobile = false,
  hideArtistOnMobile = false,
  compactTitleOnMobile = false,
  compactOnMobile = false,
}: {
  className?: string
  showCover?: boolean
  songEffect?: 'none' | 'underline'
  isActive?: boolean
  hideAlbumOnMobile?: boolean
  hideArtistOnMobile?: boolean
  compactTitleOnMobile?: boolean
  compactOnMobile?: boolean
}) {
  let { isPlaying, songUrl, title, artist, album, albumImageUrl } = useNowPlaying()

  let shouldHideAlbum = hideAlbumOnMobile || compactOnMobile
  let shouldHideArtist = hideArtistOnMobile || compactOnMobile
  let shouldCompactTitle = compactTitleOnMobile || compactOnMobile

  return (
    <div className={clsx('flex items-center min-w-0', className)}>
      {isPlaying && showCover && albumImageUrl ? (
        <Image
          src={albumImageUrl}
          alt={title || 'Spotify track'}
          width={40}
          height={40}
          className={clsx(
            'h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0 animate-spin rounded-full border border-gray-300 [animation-duration:6s] dark:border-gray-700 transition-all duration-300',
            isActive && 'ring-2 ring-spotify/60 scale-105'
          )}
        />
      ) : (
        <Brand
          as="icon"
          name="Spotify"
          className={clsx(
            'h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0 transition-transform duration-300 text-spotify',
            isActive && 'scale-110'
          )}
        />
      )}
      <div className="ml-2.5 flex min-w-0 flex-1 items-center overflow-x-auto no-scrollbar">
        {isPlaying && songUrl ? (
          <div className="flex items-center whitespace-nowrap">
            <MusicWaves
              className={clsx(
                'mr-2 shrink-0 transition-all duration-300',
                isActive && 'scale-110'
              )}
            />
            <Link
              href={songUrl}
              className="inline-flex items-center whitespace-nowrap text-xs sm:text-sm font-medium transition-colors"
              title={`${title} - ${artist || ''}${album ? ` - Album: ${album}` : ''}`}
            >
              <span
                className={clsx(
                  'font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap',
                  shouldCompactTitle && 'text-[12px] leading-tight sm:text-sm sm:leading-normal'
                )}
              >
                {songEffect === 'underline' ? (
                  <GrowingUnderline className="whitespace-nowrap">{title}</GrowingUnderline>
                ) : (
                  <span className="whitespace-nowrap">{title}</span>
                )}
              </span>
              {artist && (
                <span
                  className={clsx(
                    'items-center whitespace-nowrap',
                    shouldHideArtist ? 'hidden sm:inline-flex' : 'inline-flex'
                  )}
                >
                  <span className="mx-1 sm:mx-1.5 text-gray-500 whitespace-nowrap">-</span>
                  <span className="text-gray-500 whitespace-nowrap">{artist}</span>
                </span>
              )}
              {album && (
                <span
                  className={clsx(
                    'items-center whitespace-nowrap',
                    shouldHideAlbum ? 'hidden sm:inline-flex' : 'inline-flex'
                  )}
                >
                  <span className="mx-1 sm:mx-1.5 text-gray-500 whitespace-nowrap">-</span>
                  <span className="text-gray-500 whitespace-nowrap">Album: {album}</span>
                </span>
              )}
            </Link>
          </div>
        ) : (
          <div className="inline-flex items-center whitespace-nowrap text-xs sm:text-sm">
            <p className="font-medium text-neutral-800 dark:text-neutral-200">Not Playing</p>
            <span className="mx-1 sm:mx-1.5 text-gray-500">-</span>
            <p className="text-gray-500">Spotify</p>
          </div>
        )}
      </div>
    </div>
  )
}
