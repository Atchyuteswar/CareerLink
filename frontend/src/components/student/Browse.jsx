import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Job from './Job'
import axios from 'axios'
import { Search } from 'lucide-react'

const Browse = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://100.94.122.76:8000/api/v1/job/get", {
                    withCredentials: true
                });
                if(res.data.success){
                    setAllJobs(res.data.jobs);
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
            <div className='max-w-7xl mx-auto my-8 px-4'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <Search className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Search Results</h1>
                        <p className='text-sm text-muted-foreground'>{allJobs.length} jobs found</p>
                    </div>
                </div>
                
                {loading ? (
                    <div className='flex flex-col items-center justify-center h-64'>
                        <div className='w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                        <p className='mt-4 text-muted-foreground text-sm'>Searching jobs...</p>
                    </div>
                ) : allJobs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-64 text-center'>
                        <div className='w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4'>
                            <span className='text-2xl'>🔍</span>
                        </div>
                        <span className='text-muted-foreground font-medium'>No jobs found</span>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {allJobs.map((job, index) => (
                            <div key={job._id} className='animate-fade-in-up' style={{ opacity: 0, animationDelay: `${Math.min(index * 50, 500)}ms` }}>
                                <Job job={job} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse