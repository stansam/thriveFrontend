'use client'

import { Minus, Plus } from 'lucide-react'
import type { CounterGroupProps, PassengerCounterProps } from '../../../_props/landing/search-flights.props'

function CounterGroup({ label, value, min, onDecrement, onIncrement }: CounterGroupProps) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-[10px] text-neutral-500">{label}</span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onDecrement}
                    disabled={value <= min}
                    className="text-neutral-400 hover:text-white disabled:opacity-30"
                    aria-label={`Decrease ${label.toLowerCase()}`}
                >
                    <Minus size={12} />
                </button>
                <span className="text-sm font-medium w-3 text-center">{value}</span>
                <button
                    type="button"
                    onClick={onIncrement}
                    className="text-neutral-400 hover:text-white"
                    aria-label={`Increase ${label.toLowerCase()}`}
                >
                    <Plus size={12} />
                </button>
            </div>
        </div>
    )
}

export function PassengerCounter({ adults, numChildren, onAdultsChange, onChildrenChange }: PassengerCounterProps) {
    return (
        <div className="flex flex-col space-y-2">
            <span className="text-xs text-neutral-400">Passengers</span>
            <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-md p-1 px-2">
                <CounterGroup
                    label="Adults"
                    value={adults}
                    min={1}
                    onDecrement={() => onAdultsChange(Math.max(1, adults - 1))}
                    onIncrement={() => onAdultsChange(adults + 1)}
                />
                <div className="w-px h-6 bg-white/10" />
                <CounterGroup
                    label="Children"
                    value={numChildren}
                    min={0}
                    onDecrement={() => onChildrenChange(Math.max(0, numChildren - 1))}
                    onIncrement={() => onChildrenChange(numChildren + 1)}
                />
            </div>
        </div>
    )
}
