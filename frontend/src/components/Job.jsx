import React from 'react'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();
    
    // Calculate "Days Ago" function
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" title="Save Job">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <div className='p-2 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                    {/* Show Company Logo if available, else first letter of Company Name */}
                   <span className='font-bold text-blue-600'>{job?.company?.name?.[0] || "C"}</span>
                </div>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <span className='text-blue-700 font-bold border border-blue-200 px-2 py-1 rounded-full text-xs'>{job?.position} Positions</span>
                <span className='text-[#F83002] font-bold border border-[#F83002] px-2 py-1 rounded-full text-xs'>{job?.jobType}</span>
                <span className='text-[#7209b7] font-bold border border-[#7209b7] px-2 py-1 rounded-full text-xs'>{job?.salary} LPA</span>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <button onClick={() => navigate(`/description/${job?._id}`)} className='bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm'>Details</button>
                <button className='bg-[#6A38C2] text-white rounded-lg px-4 py-2 text-sm'>Save For Later</button>
            </div>
        </div>
    )
}

export default Job