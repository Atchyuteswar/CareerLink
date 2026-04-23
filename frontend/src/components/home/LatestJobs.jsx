import React, { useEffect, useState } from 'react'
import LatestJobCards from './LatestJobCards'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const LatestJobs = () => {
    const [allJobs, setAllJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/job/get", { withCredentials: true });
                if (res.data.success) {
                    setAllJobs(res.data.jobs);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchJobs();
    }, []);

    return (
        <section className='section-padding bg-gray-50/50 dark:bg-gray-950/50'>
            <div className='container-main'>
                {/* Section Header */}
                <div className='flex items-end justify-between mb-10'>
                    <div>
                        <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>
                            Opportunities
                        </span>
                        <h2 className='text-3xl md:text-4xl font-extrabold text-foreground mt-2 tracking-tight'>
                            Latest <span className='gradient-text'>Job Openings</span>
                        </h2>
                        <p className='text-muted-foreground mt-2 max-w-lg'>
                            Fresh opportunities from top companies, curated just for you.
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/jobs')}
                        className='hidden md:flex items-center gap-2 rounded-xl border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10'
                    >
                        View All Jobs
                        <ArrowRight className='w-4 h-4' />
                    </Button>
                </div>

                {/* Job Cards Grid */}
                {allJobs.length <= 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mb-4'>
                            <span className='text-3xl'>🔍</span>
                        </div>
                        <span className='text-muted-foreground text-lg font-medium'>No jobs available right now</span>
                        <p className='text-sm text-muted-foreground mt-1'>Check back soon for new opportunities!</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {allJobs.slice(0, 6).map((job, index) => (
                            <div 
                                key={job._id} 
                                className='animate-fade-in-up' 
                                style={{ opacity: 0, animationDelay: `${index * 100}ms` }}
                            >
                                <LatestJobCards job={job} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Mobile View All Button */}
                <div className='flex md:hidden justify-center mt-8'>
                    <Button 
                        onClick={() => navigate('/jobs')}
                        className='btn-primary rounded-xl'
                    >
                        View All Jobs
                        <ArrowRight className='w-4 h-4 ml-2' />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default LatestJobs