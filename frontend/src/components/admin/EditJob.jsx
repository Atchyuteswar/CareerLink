import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditJob = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Initial State
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

    // 1. Fetch Existing Job Data
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/job/get/${params.id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    const job = res.data.job;
                    setInput({
                        title: job.title,
                        description: job.description,
                        requirements: job.requirements, // Assuming it's array or string
                        salary: job.salary,
                        location: job.location,
                        jobType: job.jobType,
                        experience: job.experienceLevel,
                        position: job.position,
                        companyId: job.company?._id || job.company
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchJob();
    }, [params.id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    // 2. Submit Updates
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`http://localhost:8000/api/v1/job/update/${params.id}`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                alert(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <h1 className='font-bold text-2xl mb-5'>Edit Job</h1>
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
                            <input type="number" name="salary" value={input.salary} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
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
                            <input type="number" name="experience" value={input.experience} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                        <div>
                            <label className='font-bold'>No of Positions</label>
                            <input type="number" name="position" value={input.position} onChange={changeEventHandler} className='w-full border p-2 rounded-md my-1' />
                        </div>
                    </div>

                    {/* Note: We usually don't allow changing the Company of a job once posted, so we hide the dropdown here. */}

                    <button type="submit" className='w-full bg-[#6A38C2] text-white p-2 rounded-md mt-4'>
                        {loading ? "Updating..." : "Update Job"}
                    </button>
                    <button type="button" onClick={() => navigate("/admin/jobs")} className='w-full bg-gray-500 text-white p-2 rounded-md mt-2'>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditJob