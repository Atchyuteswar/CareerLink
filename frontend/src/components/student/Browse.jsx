import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Job from './Job'
import axios from 'axios'
// REMOVED Redux imports

const Browse = () => {
    // We are now using local state instead of Redux
    const [allJobs, setAllJobs] = useState([]);
    
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch all jobs directly
                const res = await axios.get("http://localhost:8000/api/v1/job/get", {
                    withCredentials: true
                });
                if(res.data.success){
                    setAllJobs(res.data.jobs);
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
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-xl my-10 text-foreground'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {allJobs.map((job) => (
                        <Job key={job._id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Browse