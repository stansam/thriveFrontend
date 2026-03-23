'use client'

import { Spotlight } from './spotlight'
import { Card } from '@/components/ui/card'
import type { ActiveForm } from '../../_types/home.types'

import { HomeHeroContent } from './_home-hero/home-hero-content'
import { HomeHeroButtons } from './_home-hero/home-hero-buttons'
import { HomeHeroVisuals } from './_home-hero/home-hero-visuals'

interface HomeHeroViewProps {
  activeForm: ActiveForm
  onToggleForm: (form: 'book' | 'quote') => void
}

export function HomeHeroView({ activeForm, onToggleForm }: HomeHeroViewProps) {
  return (
    <section className="flex items-center justify-center p-4 min-h-screen">
      <Card className="w-full min-h-[600px] h-auto md:h-[600px] bg-black/96 relative overflow-hidden border-neutral-800 transition-[height] duration-500 ease-in-out">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        <div className="flex h-full flex-col md:flex-row relative">
          <HomeHeroContent />
          <HomeHeroButtons activeForm={activeForm} onToggleForm={onToggleForm} />
          <HomeHeroVisuals activeForm={activeForm} />
        </div>
      </Card>
    </section>
  )
}
