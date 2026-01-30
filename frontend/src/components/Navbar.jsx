import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', {
                withCredentials: true
            });
            if (res.data.success) {
                setUser(null); // Context will auto-clear localStorage
                navigate("/");
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Logout failed");
        }
    }

    return (
        <div className='bg-white border-b border-gray-200'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <h1 className='text-2xl font-bold cursor-pointer' onClick={()=>navigate('/')}>
                        Career<span className='text-[#F83002]'>Link</span>
                    </h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {/* SUITE LOGIC: Role-Based Navigation */}
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li className='hover:text-[#6A38C2] cursor-pointer'><Link to="/admin/companies">Companies</Link></li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'><Link to="/admin/jobs">Jobs</Link></li>
                            </>
                        ) : (
                            <>
                                <li className='hover:text-[#6A38C2] cursor-pointer'><Link to="/">Home</Link></li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'><Link to="/jobs">Jobs</Link></li>
                            </>
                        )}
                    </ul>

                    {/* Auth Buttons or User Avatar */}
                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login"><button className='border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100'>Login</button></Link>
                            <Link to="/signup"><button className='bg-[#6A38C2] text-white px-4 py-2 rounded-md hover:bg-[#5b30a6]'>Signup</button></Link>
                        </div>
                    ) : (
                        <div className='relative group cursor-pointer'>
                            <div className='flex items-center gap-2'>
                                {/* Avatar */}
                                <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold uppercase'>
                                    {user?.fullname?.[0]}
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{user?.fullname}</span>
                                    <span className='text-xs text-gray-500 capitalize'>{user?.role}</span>
                                </div>
                            </div>
                            
                            {/* Dropdown */}
                            <div className='absolute right-0 top-10 w-48 bg-white border border-gray-100 shadow-xl rounded-md p-4 hidden group-hover:block z-50'>
                                <div className='flex flex-col gap-2'>
                                    <button onClick={logoutHandler} className='text-left text-red-600 hover:text-red-800 font-medium'>Logout</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar