import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const JobDescription = () => {
    const { id } = useParams();
    const [singleJob, setSingleJob] = useState(null);
    const [isApplied, setIsApplied] = useState(false);

    // 1. Fetch Job Details
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/job/get/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSingleJob(res.data.job);
                    // Check if current user has already applied
                    // (Note: In a real app, we would compare userId, but for now we will rely on button state after click)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [id]);

    // 2. Apply Functionality
    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/application/apply/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsApplied(true); // Update UI
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <Navbar />
            
            <div className='flex items-center justify-between mt-5'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <span className='text-blue-700 font-bold border border-blue-200 px-2 py-1 rounded-full text-xs'>{singleJob?.position} Positions</span>
                        <span className='text-[#F83002] font-bold border border-[#F83002] px-2 py-1 rounded-full text-xs'>{singleJob?.jobType}</span>
                        <span className='text-[#7209b7] font-bold border border-[#7209b7] px-2 py-1 rounded-full text-xs'>{singleJob?.salary} LPA</span>
                    </div>
                </div>
                <button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg px-4 py-2 ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'} text-white`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </button>
            </div>

            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
            </div>
        </div>
    )
}

export default JobDescription