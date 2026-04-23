import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import axios from 'axios'
import { Search, Briefcase, SlidersHorizontal, X, ArrowUpDown, LayoutGrid, List, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'

const Jobs = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [filterJobs, setFilterJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://100.94.122.76:8000/api/v1/job/get", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setAllJobs(res.data.jobs);
                    setFilterJobs(res.data.jobs);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    // Combined search + filter logic
    const applyFilters = useCallback((filters, search, sort) => {
        let result = [...allJobs];

        // Text search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(job =>
                job.title?.toLowerCase().includes(q) ||
                job.description?.toLowerCase().includes(q) ||
                job.company?.name?.toLowerCase().includes(q) ||
                job.location?.toLowerCase().includes(q)
            );
        }

        // Location filter
        if (filters.location) {
            result = result.filter(job => {
                if (filters.location === 'Remote') return job.workMode?.toLowerCase() === 'remote';
                return job.location?.toLowerCase().includes(filters.location.toLowerCase());
            });
        }

        // Industry filter
        if (filters.industry) {
            result = result.filter(job =>
                job.title?.toLowerCase().includes(filters.industry.toLowerCase())
            );
        }

        // Salary filter
        if (filters.salary) {
            const ranges = {
                '0-3L': [0, 300000], '3-6L': [300000, 600000], '6-10L': [600000, 1000000],
                '10-15L': [1000000, 1500000], '15L+': [1500000, Infinity]
            };
            const [min, max] = ranges[filters.salary] || [0, Infinity];
            result = result.filter(job => job.salary >= min && job.salary <= max);
        }

        // Work Mode
        if (filters.workMode) {
            result = result.filter(job =>
                job.workMode?.toLowerCase() === filters.workMode.toLowerCase()
            );
        }

        // Experience
        if (filters.experience) {
            const expRanges = {
                'Fresher (0-1)': [0, 1], '1-3 Years': [1, 3], '3-5 Years': [3, 5],
                '5-10 Years': [5, 10], '10+ Years': [10, 100]
            };
            const [min, max] = expRanges[filters.experience] || [0, 100];
            result = result.filter(job => job.experienceLevel >= min && job.experienceLevel <= max);
        }

        // Job Type
        if (filters.jobType) {
            result = result.filter(job =>
                job.jobType?.toLowerCase().includes(filters.jobType.toLowerCase())
            );
        }

        // Sorting
        if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sort === 'salary-high') result.sort((a, b) => b.salary - a.salary);
        else if (sort === 'salary-low') result.sort((a, b) => a.salary - b.salary);

        setFilterJobs(result);
    }, [allJobs]);

    useEffect(() => {
        applyFilters(activeFilters, searchQuery, sortBy);
    }, [searchQuery, sortBy, activeFilters, applyFilters]);

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
    };

    const activeFilterCount = Object.values(activeFilters).filter(v => v !== '').length;

    // Check if job was posted in last 24 hours
    const isNew = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        return diff < 24 * 60 * 60 * 1000;
    };

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-6 px-4'>
                {/* Page Header with Search */}
                <div className='mb-6'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <h1 className='text-2xl font-extrabold text-foreground flex items-center gap-2'>
                                <Briefcase className='w-6 h-6 text-violet-500' />
                                Browse Jobs
                            </h1>
                            <p className='text-sm text-muted-foreground mt-1'>
                                {filterJobs.length} of {allJobs.length} jobs
                                {activeFilterCount > 0 && <span className='text-violet-500'> • {activeFilterCount} filters active</span>}
                            </p>
                        </div>

                        {/* Search + Sort */}
                        <div className='flex items-center gap-3'>
                            <div className='relative flex-1 md:w-72'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search jobs, companies..."
                                    className='w-full pl-9 pr-9 py-2.5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className='absolute right-3 top-1/2 -translate-y-1/2'>
                                        <X className='w-3.5 h-3.5 text-muted-foreground hover:text-foreground' />
                                    </button>
                                )}
                            </div>

                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                                className='px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs font-medium text-foreground focus:outline-none cursor-pointer'>
                                <option value="newest">Newest First</option>
                                <option value="salary-high">Salary: High → Low</option>
                                <option value="salary-low">Salary: Low → High</option>
                            </select>

                            {/* Mobile filter toggle */}
                            <Button variant="outline" className="md:hidden rounded-xl" onClick={() => setShowMobileFilter(!showMobileFilter)}>
                                <SlidersHorizontal className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-6'>
                    {/* Sidebar Filter */}
                    <div className={`w-full md:w-[260px] flex-shrink-0 ${showMobileFilter ? 'block' : 'hidden md:block'}`}>
                        <FilterCard onFilterChange={handleFilterChange} />
                    </div>

                    {/* Job Grid */}
                    <div className='flex-1 pb-8'>
                        {loading ? (
                            <div className='flex flex-col items-center justify-center h-64'>
                                <div className='w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                                <p className='mt-4 text-muted-foreground text-sm'>Loading jobs...</p>
                            </div>
                        ) : filterJobs.length <= 0 ? (
                            <div className='flex flex-col items-center justify-center h-64 text-center'>
                                <div className='w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4'>
                                    <Search className='w-7 h-7 text-gray-400' />
                                </div>
                                <span className='text-muted-foreground font-medium'>No jobs match your criteria</span>
                                <p className='text-xs text-muted-foreground mt-1'>Try adjusting your filters or search terms</p>
                                {(searchQuery || activeFilterCount > 0) && (
                                    <Button variant="outline" className='mt-4 rounded-xl text-xs' onClick={() => { setSearchQuery(''); setActiveFilters({}); }}>
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {filterJobs.map((job, index) => (
                                    <div key={job._id} className='relative animate-fade-in-up' style={{ opacity: 0, animationDelay: `${Math.min(index * 50, 500)}ms` }}>
                                        {isNew(job.createdAt) && (
                                            <div className='absolute -top-1.5 -right-1.5 z-10'>
                                                <span className='flex items-center gap-1 text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/20'>
                                                    <Sparkles className='w-2.5 h-2.5' /> NEW
                                                </span>
                                            </div>
                                        )}
                                        <Job job={job} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs