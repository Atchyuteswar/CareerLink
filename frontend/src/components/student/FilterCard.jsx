import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { SlidersHorizontal, MapPin, Briefcase, IndianRupee, Monitor } from 'lucide-react'

const filterData = [
    {
        filterType: "Location",
        icon: MapPin,
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        icon: Briefcase,
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        icon: IndianRupee,
        array: ["0-40k", "42k-1 Lakh", "1 Lakh - 5 Lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    return (
        <div className='w-full bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 p-5 rounded-2xl sticky top-24'>
            <div className='flex items-center gap-2 mb-4'>
                <SlidersHorizontal className='w-4 h-4 text-violet-500' />
                <h1 className='font-bold text-lg text-foreground'>Filters</h1>
            </div>
            
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => {
                    const Icon = data.icon;
                    return (
                        <div key={index} className='mb-5'>
                            <div className='flex items-center gap-2 mb-3'>
                                <Icon className='w-3.5 h-3.5 text-muted-foreground' />
                                <h2 className='font-semibold text-sm text-foreground uppercase tracking-wider'>{data.filterType}</h2>
                            </div>
                            <div className='space-y-2'>
                                {data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`;
                                    return (
                                        <div key={idx} className='flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer'>
                                            <RadioGroupItem value={item} id={itemId} className="border-gray-300 dark:border-gray-600" />
                                            <Label htmlFor={itemId} className="text-sm text-muted-foreground cursor-pointer font-medium">{item}</Label>
                                        </div>
                                    )
                                })}
                            </div>
                            {index < filterData.length - 1 && (
                                <div className='border-b border-gray-100 dark:border-gray-800 mt-4'></div>
                            )}
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    )
}

export default FilterCard