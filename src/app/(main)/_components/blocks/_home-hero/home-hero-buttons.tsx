import { Plane, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ActiveForm } from '../../../_types/home.types'

interface HomeHeroButtonsProps {
  activeForm: ActiveForm
  onToggleForm: (form: 'book' | 'quote') => void
}

export function HomeHeroButtons({ activeForm, onToggleForm }: HomeHeroButtonsProps) {
  return (
    <div
      className={cn(
        'z-30 flex flex-col gap-4 items-center justify-center p-4',
        'md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
      )}
    >
      <Button
        variant="outline"
        aria-pressed={activeForm === 'book'}
        className={cn(
          'rounded-full h-12 border-neutral-700 bg-black/50 hover:bg-neutral-800 hover:text-white transition-all duration-300 px-6 gap-2 min-w-[160px]',
          activeForm === 'book' && 'bg-white text-gray-300 border-white hover:bg-neutral-200',
        )}
        onClick={() => onToggleForm('book')}
      >
        <Plane className="h-5 w-5" aria-hidden />
        <span className="font-medium">Book Flight</span>
      </Button>

      <Button
        variant="outline"
        aria-pressed={activeForm === 'quote'}
        className={cn(
          'rounded-full h-12 border-neutral-700 bg-black/50 hover:bg-neutral-800 hover:text-white transition-all duration-300 px-6 gap-2 min-w-[160px]',
          activeForm === 'quote' && 'bg-white text-gray-300 border-white hover:bg-neutral-200',
        )}
        onClick={() => onToggleForm('quote')}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="font-medium">Explore Trips</span>
      </Button>
    </div>
  )
}
