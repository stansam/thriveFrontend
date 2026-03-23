'use client'

import { Suspense, lazy } from 'react'
import { SplineSceneProps } from '../../_props/landing/home-hero.props'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }: SplineSceneProps) {
    return (
        <Suspense
            fallback={
                <div className="w-full h-full flex items-center justify-center">
                    <span className="loader"></span>
                </div>
            }
        >
            <Spline
                scene={scene}
                className={className}
            />
        </Suspense>
    )
}
