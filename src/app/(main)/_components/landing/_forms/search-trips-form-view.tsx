"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SearchAutocomplete } from "../../search-autocomplete";
import { DurationRangePicker } from "./duration-range-picker";
import { BudgetRangePicker } from "./budget-range-picker";
import type { SearchTripsFormProps } from "../../../_props/package.props";

export function SearchTripsFormView({
  className,
  onSearch,
}: SearchTripsFormProps) {
  const [duration, setDuration] = useState<{ min?: number; max?: number }>({});
  const [budget, setBudget] = useState<{ min?: number; max?: number }>({});
  const [q, setQ] = useState("");
  const [travelStyle, setTravelStyle] = useState("all");

  const handleSubmit = () => {
    onSearch({
      q,
      travelStyle: travelStyle as "all" | "international" | "domestic",
      duration,
      budget,
    });
  };

  return (
    <Card
      className={cn(
        "w-[90vw] max-w-[450px] p-6 bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-2xl",
        className
      )}
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Find Your Next Trip
          </h2>
          <p className="text-sm text-neutral-400">
            Discover curated packages and exclusive deals.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-neutral-300 tracking-wider">
              Destination / Package
            </Label>
            <SearchAutocomplete value={q} onChange={setQ} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-300 tracking-wider">
                Duration
              </Label>
              <DurationRangePicker value={duration} onChange={setDuration} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-300 tracking-wider">
                Budget
              </Label>
              <BudgetRangePicker value={budget} onChange={setBudget} />
            </div>
          </div>

          <div className="pt-2">
            <Label className="text-xs font-medium text-neutral-300 tracking-wider mb-2 block">
              Travel Style
            </Label>
            <RadioGroup
              value={travelStyle}
              onValueChange={setTravelStyle}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="all"
                  id="r-all"
                  className="border-white text-[#88734C]"
                />
                <Label htmlFor="r-all" className="text-sm text-neutral-300">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="international"
                  id="r-int"
                  className="border-white text-[#88734C]"
                />
                <Label htmlFor="r-int" className="text-sm text-neutral-300">
                  International
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="domestic"
                  id="r-dom"
                  className="border-white text-[#88734C]"
                />
                <Label htmlFor="r-dom" className="text-sm text-neutral-300">
                  Domestic
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-white text-black hover:bg-neutral-200 font-semibold h-11 transition-all duration-300"
        >
          Explore Packages
        </Button>
      </div>
    </Card>
  );
}

export default SearchTripsFormView;
