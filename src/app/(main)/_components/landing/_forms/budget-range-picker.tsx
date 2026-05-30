"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BudgetRangePickerProps {
  value: { min?: number; max?: number };
  onChange: (value: { min?: number; max?: number }) => void;
}

export function BudgetRangePicker({ value, onChange }: BudgetRangePickerProps) {
  const formatBudgetLabel = () => {
    if (!value.min && !value.max) return "Any Budget";
    if (value.min && value.max) return `$${value.min} - $${value.max}`;
    if (value.min) return `Min $${value.min}`;
    if (value.max) return `Max $${value.max}`;
    return "Any Budget";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-black/50 border-white/10 text-neutral-200 hover:bg-neutral-800 hover:text-white"
        >
          {formatBudgetLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-neutral-900 border-white/10 text-white">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Budget (USD)</h4>
            <p className="text-xs text-neutral-400">
              Set your minimum and maximum budget.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-price" className="text-xs">Min</Label>
              <Input
                id="min-price"
                type="number"
                min="0"
                step="100"
                value={value.min || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    min: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="bg-black/50 border-white/10 text-white h-8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price" className="text-xs">Max</Label>
              <Input
                id="max-price"
                type="number"
                min="0"
                step="100"
                value={value.max || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    max: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="bg-black/50 border-white/10 text-white h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default BudgetRangePicker;
