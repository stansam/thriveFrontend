import type { ActiveForm } from '../../_types/home.types'

export interface HomeHeroButtonsProps {
    activeForm: ActiveForm
    onToggleForm: (form: 'book' | 'quote') => void
}

export interface HomeHeroViewProps {
    activeForm: ActiveForm
    onToggleForm: (form: 'book' | 'quote') => void
}

export interface HomeHeroVisualsProps {
    activeForm: ActiveForm
}

export interface SpotlightProps {
    className?: string;
    fill?: string;
};

export interface SplineSceneProps {
    scene: string
    className?: string
}