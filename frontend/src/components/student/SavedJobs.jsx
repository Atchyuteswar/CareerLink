import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Job from './Job'
import axios from 'axios'
import { BookmarkCheck } from 'lucide-react'

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/job/get/saved/jobs", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSavedJobs(res.data.savedJobs);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedJobs();
    }, []);

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-8 px-4'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <BookmarkCheck className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Saved Jobs</h1>
                        <p className='text-sm text-muted-foreground'>{savedJobs.length} saved positions</p>
                    </div>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center justify-center h-64'>
                        <div className='w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                        <p className='mt-4 text-muted-foreground text-sm'>Loading saved jobs...</p>
                    </div>
                ) : savedJobs.length <= 0 ? (
                    <div className='flex flex-col items-center justify-center h-80 text-center'>
                        <div className='w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4'>
                            <span className='text-3xl'>🔖</span>
                        </div>
                        <span className='text-muted-foreground font-medium text-lg'>No saved jobs yet</span>
                        <span className='text-sm text-muted-foreground mt-2 max-w-xs'>
                            Click the bookmark icon on any job to save it here for later
                        </span>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10'>
                        {savedJobs.map((job, index) => (
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

export default SavedJobs