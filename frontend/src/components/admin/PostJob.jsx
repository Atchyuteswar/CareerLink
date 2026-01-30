import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    // Fetch companies so recruiter can select one
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/company/get", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setCompanies(res.data.companies);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("Submitting Job Data:", input);
        try {
            const res = await axios.post("http://localhost:8000/api/v1/job/post", input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                alert(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <h1 className='font-bold text-2xl mb-5'>Post a New Job</h1>

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label className='font-bold'>Title</label>
                            <input type="text" name="title" value={input.title} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        <div>
                            <label className='font-bold'>Description</label>
                            <input type="text" name="description" value={input.description} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        <div>
                            <label className='font-bold'>Requirements</label>
                            <input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        <div>
                            <label className='font-bold'>Salary</label>
                            <input type="text" name="salary" value={input.salary} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        <div>
                            <label className='font-bold'>Location</label>
                            <input type="text" name="location" value={input.location} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        <div>
                            <label className='font-bold'>Job Type</label>
                            <select name="jobType" value={input.jobType} onChange={changeEventHandler} className="w-full border p-2 rounded-md my-1">
                                <option value="">Select Job Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div>
                            <label className='font-bold'>Experience Level</label>
                            <input type="text" name="experience" value={input.experience} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        <div>
                            <label className='font-bold'>No of Position</label>
                            <input type="number" name="position" value={input.position} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        {/* Company Selection */}
                        <div className='col-span-2'>
                            <label className='font-bold'>Select Company</label>
                            {companies.length > 0 ? (
                                <select className='w-full border p-2 rounded-md my-1' name="companyId" onChange={changeEventHandler}>
                                    <option value="">Select a Company</option>
                                    {companies.map((company) => (
                                        <option key={company._id} value={company._id}>{company.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className='text-red-500 text-xs'>Please register a company first.</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" className='w-full bg-black text-white p-2 rounded-md mt-4 hover:bg-gray-800'>Post Job</button>
                    {companies.length === 0 && <p className='text-center text-red-600 font-bold mt-2'>*Please register a company first</p>}
                </form>
            </div>
        </div>
    )
}

export default PostJob