import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import axios from 'axios'
import { Search, Briefcase } from 'lucide-react'

const Jobs = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [filterJobs, setFilterJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/job/get", {
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

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-6 px-4'>
                {/* Page Header */}
                <div className='mb-6'>
                    <h1 className='text-2xl font-extrabold text-foreground flex items-center gap-2'>
                        <Briefcase className='w-6 h-6 text-violet-500' />
                        Browse Jobs
                    </h1>
                    <p className='text-sm text-muted-foreground mt-1'>
                        {filterJobs.length} jobs available
                    </p>
                </div>

                <div className='flex flex-col md:flex-row gap-6'>
                    <div className='w-full md:w-[240px] flex-shrink-0'>
                        <FilterCard />
                    </div>
                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5 scroll-smooth no-scrollbar'>
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
                                <span className='text-muted-foreground font-medium'>No jobs found</span>
                                <p className='text-xs text-muted-foreground mt-1'>Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {filterJobs.map((job, index) => (
                                    <div key={job._id} className='animate-fade-in-up' style={{ opacity: 0, animationDelay: `${Math.min(index * 50, 500)}ms` }}>
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