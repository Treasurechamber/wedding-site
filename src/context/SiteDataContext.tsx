'use client'

import { createContext, useContext } from 'react'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import { weddingConfig } from '@/lib/wedding-config'
import { defaultPhotos } from '@/lib/default-photos'

type WeddingConfig = typeof weddingConfig

type SiteData = {
  config: WeddingConfig
  heroSlides: string[]
  gallery: string[]
  ceremonyImage: string
  receptionImage: string
}

const defaultSiteData: SiteData = {
  config: weddingConfig,
  heroSlides: defaultPhotos.heroSlides,
  gallery: defaultPhotos.gallery,
  ceremonyImage: defaultPhotos.ceremony,
  receptionImage: defaultPhotos.reception,
}

const SiteDataContext = createContext<SiteData>(defaultSiteData)

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const configRaw = useQuery(api.siteConfig.get) ?? null
  const heroUrls = useQuery(api.media.listUrlsByLabel, { label: 'hero' }) ?? []
  const galleryUrls = useQuery(api.media.listUrlsByLabel, { label: 'gallery' }) ?? []
  const ceremonyUrls = useQuery(api.media.listUrlsByLabel, { label: 'ceremony' }) ?? []
  const receptionUrls = useQuery(api.media.listUrlsByLabel, { label: 'reception' }) ?? []

  let config: WeddingConfig = weddingConfig
  if (configRaw) {
    try {
      config = { ...weddingConfig, ...JSON.parse(configRaw) } as WeddingConfig
    } catch {
      // keep static config on parse error
    }
  }

  const value: SiteData = {
    config,
    heroSlides: heroUrls.length > 0 ? heroUrls : defaultPhotos.heroSlides,
    gallery: galleryUrls.length > 0 ? galleryUrls : defaultPhotos.gallery,
    ceremonyImage: ceremonyUrls[0] ?? defaultPhotos.ceremony,
    receptionImage: receptionUrls[0] ?? defaultPhotos.reception,
  }

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  return useContext(SiteDataContext)
}
