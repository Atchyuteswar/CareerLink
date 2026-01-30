import React, { useState } from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/v1/company/register", {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                alert(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            alert("Failed to register company.");
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
                </div>

                <label>Company Name</label>
                <input
                    type="text"
                    className='w-full border border-gray-200 p-2 my-2 rounded-md'
                    placeholder="JobHunt, Microsoft etc."
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className='flex items-center gap-2 my-10'>
                    <button onClick={() => navigate("/admin/companies")} className='border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100'>Cancel</button>
                    <button onClick={registerNewCompany} className='bg-[#6A38C2] text-white px-4 py-2 rounded-md hover:bg-[#5b30a6]'>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate