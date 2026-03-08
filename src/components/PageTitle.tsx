'use client'

import { useEffect } from 'react'
import { useSiteData } from '@/context/SiteDataContext'

export default function PageTitle() {
  const { config } = useSiteData()

  useEffect(() => {
    const names = config.couple.names.join(' & ')
    const date = config.date.full
    document.title = `${names}'s Wedding | ${date}`
  }, [config.couple.names, config.date.full])

  return null
}
