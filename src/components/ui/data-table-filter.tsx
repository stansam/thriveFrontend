import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FilterOption {
    label: string;
    value: string;
    icon?: any;
}

interface DataTableFilterProps {
    title?: string;
    options: FilterOption[];
    value?: string;
    onChange?: (value: string) => void;
    selectedValues?: string[];
    onValuesChange?: (values: string[]) => void;
    isMultiSelect?: boolean;
    className?: string;
    label?: string;
}

export default function DataTableFilter({ 
    title, 
    options, 
    value, 
    onChange, 
    selectedValues = [], 
    onValuesChange, 
    isMultiSelect = false, 
    className 
}: DataTableFilterProps) {
    
    // For simplicity in mocked version, we just render a simple select
    // It will return the first item or comma-separated if we want to hack multi-select via a normal select temporarily
    const handleChange = (val: string) => {
        if (isMultiSelect && onValuesChange) {
            // Simulated toggle
            const newValues = selectedValues.includes(val) 
                ? selectedValues.filter(v => v !== val)
                : [...selectedValues, val];
            onValuesChange(newValues);
        } else if (onChange) {
            onChange(val);
        }
    };

    return (
        <div className={className}>
            <Select 
                value={isMultiSelect ? (selectedValues.length > 0 ? selectedValues.join(', ') : '') : value} 
                onValueChange={handleChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={title} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
