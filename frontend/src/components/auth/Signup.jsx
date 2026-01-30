import React, { useState } from 'react'
import Navbar from '../Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                alert(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    
                    <div className='my-2'>
                        <label className='block text-sm font-medium'>Full Name</label>
                        <input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="Atchyut" className='w-full border p-2 rounded-md' />
                    </div>
                    <div className='my-2'>
                        <label className='block text-sm font-medium'>Email</label>
                        <input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="atchyut@gmail.com" className='w-full border p-2 rounded-md' />
                    </div>
                    <div className='my-2'>
                        <label className='block text-sm font-medium'>Phone Number</label>
                        <input type="text" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="8080808080" className='w-full border p-2 rounded-md' />
                    </div>
                    <div className='my-2'>
                        <label className='block text-sm font-medium'>Password</label>
                        <input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="******" className='w-full border p-2 rounded-md' />
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <div className="flex items-center space-x-2">
                                <input type="radio" name="role" value="student" onChange={changeEventHandler} className="cursor-pointer" />
                                <label>Student</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" name="role" value="recruiter" onChange={changeEventHandler} className="cursor-pointer" />
                                <label>Recruiter</label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className='w-full bg-black text-white p-2 rounded-md mt-4 hover:bg-gray-800'>Signup</button>
                    <span className='text-sm block mt-2'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup