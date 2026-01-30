import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import axios from 'axios'

const Jobs = () => {
    const [allJobs, setAllJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/job/get", {
                    withCredentials: true
                });
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
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        allJobs.length <= 0 ? <span>No jobs found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        allJobs.map((job) => (
                                            <div key={job._id}>
                                                {/* Pass the individual job data as a "prop" to the card */}
                                                <Job job={job} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs