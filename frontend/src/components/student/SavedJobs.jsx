import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Job from './Job' // Re-using your existing Job card!
import axios from 'axios'

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);

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
            }
        }
        fetchSavedJobs();
    }, []);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <h1 className='font-bold text-xl my-5 text-[#6A38C2]'>Saved Jobs ({savedJobs.length})</h1>

                {savedJobs.length <= 0 ? (
                    <div className='flex flex-col items-center justify-center h-96'>
                        <span className='text-gray-400 text-lg'>You haven't saved any jobs yet.</span>
                        <span className='text-gray-300 text-sm mt-2'>Click the bookmark icon on jobs to see them here.</span>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                        {savedJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedJobs