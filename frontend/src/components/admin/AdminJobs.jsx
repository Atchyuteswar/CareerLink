import React from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom'
import AdminJobsTable from './AdminJobsTable'

const AdminJobs = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <h1 className='font-bold text-xl'>My Posted Jobs</h1>
                    <button 
                        onClick={() => navigate("/admin/jobs/create")} 
                        className="bg-[#6A38C2] text-white px-4 py-2 rounded-md hover:bg-[#5b30a6]">
                        New Job
                    </button>
                </div>
                <AdminJobsTable />
            </div>
        </div>
    )
}

export default AdminJobs