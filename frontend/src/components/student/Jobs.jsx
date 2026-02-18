import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import axios from 'axios'

const Jobs = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [filterJobs, setFilterJobs] = useState([]);

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
            }
        }
        fetchJobs();
    }, []);

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <div className='flex flex-col md:flex-row gap-5'>
                    <div className='w-full md:w-[20%]'>
                        <FilterCard />
                    </div>
                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5 scroll-smooth no-scrollbar'> 
                        {filterJobs.length <= 0 ? (
                            <div className='flex items-center justify-center h-full text-muted-foreground'>
                                <span>No jobs found</span>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {filterJobs.map((job) => (
                                    <div key={job._id}>
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