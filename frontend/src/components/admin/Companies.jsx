import React from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom'
import CompaniesTable from './CompaniesTable'

const Companies = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <h1 className='font-bold text-xl'>My Companies</h1>
                    <button 
                        onClick={() => navigate("/admin/companies/create")} 
                        className="bg-[#6A38C2] text-white px-4 py-2 rounded-md hover:bg-[#5b30a6]">
                        New Company
                    </button>
                </div>
                <CompaniesTable />
            </div>
        </div>
    )
}

export default Companies