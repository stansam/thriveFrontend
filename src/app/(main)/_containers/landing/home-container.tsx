'use client'

import { useState } from 'react'
import { HomeHeroView } from '../../_components/landing/home-hero-view'
import type { ActiveForm } from '../../_types/home.types'

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
