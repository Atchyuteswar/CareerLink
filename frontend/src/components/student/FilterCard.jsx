import React, { useState } from 'react'
import { Label } from '../ui/label'
import { SlidersHorizontal, MapPin, Briefcase, IndianRupee, Monitor, Globe, Clock, ChevronDown, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'

const FilterCard = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        location: '',
        industry: '',
        salary: '',
        workMode: '',
        experience: '',
        jobType: '',
    });

    const [expandedSections, setExpandedSections] = useState({
        location: true, industry: true, salary: true, workMode: true, experience: false, jobType: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const updateFilter = (key, value) => {
        const newVal = filters[key] === value ? '' : value;
        const updated = { ...filters, [key]: newVal };
        setFilters(updated);
        if (onFilterChange) onFilterChange(updated);
    };

    const clearAll = () => {
        const cleared = { location: '', industry: '', salary: '', workMode: '', experience: '', jobType: '' };
        setFilters(cleared);
        if (onFilterChange) onFilterChange(cleared);
    };

    const hasFilters = Object.values(filters).some(v => v !== '');

    const filterSections = [
        {
            key: 'location', label: 'Location', icon: MapPin,
            options: ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Chennai', 'Remote']
        },
        {
            key: 'industry', label: 'Industry', icon: Briefcase,
            options: ['Frontend Developer', 'Backend Developer', 'FullStack Developer', 'Data Scientist', 'DevOps Engineer', 'UI/UX Designer', 'Mobile Developer', 'Project Manager']
        },
        {
            key: 'salary', label: 'Salary (LPA)', icon: IndianRupee,
            options: ['0-3L', '3-6L', '6-10L', '10-15L', '15L+']
        },
        {
            key: 'workMode', label: 'Work Mode', icon: Monitor,
            options: ['Remote', 'On-site', 'Hybrid']
        },
        {
            key: 'experience', label: 'Experience', icon: Clock,
            options: ['Fresher (0-1)', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years']
        },
        {
            key: 'jobType', label: 'Job Type', icon: Globe,
            options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
        }
    ];

    const activeCount = Object.values(filters).filter(v => v !== '').length;

    return (
        <div className='w-full bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 p-5 rounded-2xl sticky top-24'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                    <SlidersHorizontal className='w-4 h-4 text-violet-500' />
                    <h1 className='font-bold text-lg text-foreground'>Filters</h1>
                    {activeCount > 0 && (
                        <span className='text-[10px] font-bold bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 px-1.5 py-0.5 rounded-md'>{activeCount}</span>
                    )}
                </div>
                {hasFilters && (
                    <button onClick={clearAll} className='text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors'>
                        <RotateCcw className='w-3 h-3' /> Clear
                    </button>
                )}
            </div>

            {/* Filter Sections */}
            <div className='space-y-1'>
                {filterSections.map((section) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSections[section.key];
                    return (
                        <div key={section.key} className='border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-2'>
                            {/* Section Header - clickable */}
                            <button onClick={() => toggleSection(section.key)}
                                className='flex items-center justify-between w-full py-2 text-left'>
                                <div className='flex items-center gap-2'>
                                    <Icon className='w-3.5 h-3.5 text-muted-foreground' />
                                    <span className='font-semibold text-xs text-foreground uppercase tracking-wider'>{section.label}</span>
                                    {filters[section.key] && (
                                        <span className='w-1.5 h-1.5 rounded-full bg-violet-500'></span>
                                    )}
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Options */}
                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className='flex flex-wrap gap-1.5 pb-2'>
                                    {section.options.map((option) => {
                                        const isActive = filters[section.key] === option;
                                        return (
                                            <button key={option} onClick={() => updateFilter(section.key, option)}
                                                className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all duration-150
                                                    ${isActive 
                                                        ? 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/30 shadow-sm' 
                                                        : 'bg-gray-50 dark:bg-gray-800/50 text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-500/20'}`}>
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default FilterCard