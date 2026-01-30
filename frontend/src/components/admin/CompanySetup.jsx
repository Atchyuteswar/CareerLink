import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const CompanySetup = () => {
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: ""
    });
    const params = useParams();
    const navigate = useNavigate();

    // Fetch existing data (if any)
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/company/get/${params.id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setInput({
                        name: res.data.company.name,
                        description: res.data.company.description || "",
                        website: res.data.company.website || "",
                        location: res.data.company.location || ""
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompany();
    }, [params.id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/company/update/${params.id}`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                alert(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            alert("Update failed");
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler} className='border border-gray-200 rounded-md p-8'>
                    <div className='flex items-center gap-5 mb-5'>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='font-bold'>Company Name</label>
                            <input type="text" name="name" value={input.name} onChange={changeEventHandler} className='w-full border p-2 rounded-md' />
                        </div>
                        <div>
                            <label className='font-bold'>Description</label>
                            <input type="text" name="description" value={input.description} onChange={changeEventHandler} className='w-full border p-2 rounded-md' />
                        </div>
                        <div>
                            <label className='font-bold'>Website</label>
                            <input type="text" name="website" value={input.website} onChange={changeEventHandler} className='w-full border p-2 rounded-md' />
                        </div>
                        <div>
                            <label className='font-bold'>Location</label>
                            <input type="text" name="location" value={input.location} onChange={changeEventHandler} className='w-full border p-2 rounded-md' />
                        </div>
                    </div>
                    <button type="submit" className='w-full mt-8 bg-black text-white p-2 rounded-md hover:bg-gray-800'>Update</button>
                </form>
            </div>
        </div>
    )
}

export default CompanySetup