'use client'

import { useState } from 'react'
import { HomeHeroView } from '../_components/blocks/home-hero-view'
import type { ActiveForm } from '../_types/home.types'

/**
 * HomeContainer — owns all interactive hero state for the landing page.
 *
 * ARCHITECTURE.md: containers own state/data; pages are thin shells.
 * The `page.tsx` for (main) is a Server Component that renders this container
 * alongside the other presentational page sections.
 */
export function HomeContainer() {
  const [activeForm, setActiveForm] = useState<ActiveForm>('none')

  const toggleForm = (form: 'book' | 'quote') => {
    setActiveForm((curr) => (curr === form ? 'none' : form))
  }

  return (
    <HomeHeroView 
      activeForm={activeForm} 
      onToggleForm={toggleForm} 
    />
  )
}
