import React, { useState, useContext } from 'react' // <--- Add useContext
import Navbar from '../Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext); // <--- Add setUser

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                // Update Context (LocalStorage updates automatically via useEffect)
                setUser(res.data.user);

                // INTELLIGENT ROUTING
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin/companies");
                } else {
                    navigate("/");
                }
                alert(res.data.message);
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
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <label className='block text-sm font-medium'>Email</label>
                        <input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="atchyut@gmail.com" className='w-full border p-2 rounded-md' />
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
                    <button type="submit" className='w-full bg-black text-white p-2 rounded-md mt-4 hover:bg-gray-800'>Login</button>
                    <span className='text-sm block mt-2'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login