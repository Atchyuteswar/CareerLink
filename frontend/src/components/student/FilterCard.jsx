import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    // In a real app, you would pass 'selectedValue' up to the parent via props
    // For now, we'll just set up the UI logic
    const [selectedValue, setSelectedValue] = useState('');

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    // You would use this useEffect to dispatch a Redux action or call a parent function
    useEffect(() => {
        // console.log(selectedValue);
    }, [selectedValue]);

    return (
        <div className='w-full bg-background p-3 rounded-md border border-border'>
            <h1 className='font-bold text-lg text-foreground'>Filter Jobs</h1>
            <hr className='mt-3 border-border' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={index}>
                        <h1 className='font-bold text-lg my-3 text-foreground'>{data.filterType}</h1>
                        {data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`
                            return (
                                <div key={idx} className='flex items-center space-x-2 my-2'>
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId} className="text-muted-foreground cursor-pointer">{item}</Label>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

export default FilterCard