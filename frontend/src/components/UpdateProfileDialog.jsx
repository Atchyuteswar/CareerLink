import React, { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: null
    });

    if (!open) return null; // Don't render if not open

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Prepare Data (Using FormData to handle files later)
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8000/api/v1/user/profile/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                setUser(res.data.user);
                setOpen(false);
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50'>
            <div className='bg-white p-8 rounded-md w-96 shadow-lg relative'>
                <h1 className='font-bold text-xl mb-5'>Update Profile</h1>
                <button onClick={() => setOpen(false)} className='absolute top-2 right-4 text-gray-500 hover:text-black'>✕</button>
                
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <label className='text-right'>Name</label>
                            <input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} className='col-span-3 border p-2 rounded-md' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <label className='text-right'>Bio</label>
                            <input type="text" name="bio" value={input.bio} onChange={changeEventHandler} className='col-span-3 border p-2 rounded-md' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <label className='text-right'>Skills</label>
                            <input type="text" name="skills" value={input.skills} onChange={changeEventHandler} className='col-span-3 border p-2 rounded-md' />
                        </div>
                    </div>
                    <button type="submit" className='w-full bg-black text-white p-2 rounded-md'>
                        {loading ? "Updating..." : "Update"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdateProfileDialog