import React, { useEffect, useState } from 'react'
import LatestJobCards from './LatestJobCards'
import axios from 'axios'
// import { useSelector } from 'react-redux' // Uncomment if using Redux

const LatestJobs = () => {
    // const { allJobs } = useSelector(store => store.job); // Use this if you have Redux

    // OR use local state if you removed Redux:
    const [allJobs, setAllJobs] = useState([]);
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
        <div className='max-w-7xl mx-auto my-20 px-4'>
            <h1 className='text-4xl font-bold text-foreground'><span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                {allJobs.length <= 0 ? <span className='text-muted-foreground'>No Job Available</span> : allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)}
            </div>
        </div>
    )
}

export default LatestJobs