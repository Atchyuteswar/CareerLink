import React, { useContext, useState } from 'react'
import Navbar from './Navbar'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { AuthContext } from '../context/AuthContext'

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useContext(AuthContext);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl'>
                            {/* Profile Image or Avatar */}
                            {user?.profile?.profilePhoto ? (
                                <img src={user?.profile?.profilePhoto} alt="profile" className='rounded-full h-full w-full object-cover' />
                            ) : (
                                <span>{user?.fullname?.[0]}</span>
                            )}
                        </div>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p className='text-gray-500'>{user?.profile?.bio || "No bio added yet."}</p>
                        </div>
                    </div>
                    <button onClick={() => setOpen(true)} className='text-right h-8 border border-gray-400 rounded-md px-3 hover:bg-gray-100'>
                        Edit
                    </button>
                </div>

                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <span className='font-bold'>Email:</span>
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <span className='font-bold'>Phone:</span>
                        <span>{user?.phoneNumber}</span>
                    </div>
                    <div className='my-5'>
                        <h1 className='font-bold mb-2'>Skills</h1>
                        <div className='flex items-center gap-1'>
                            {user?.profile?.skills?.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                <span key={index} className='bg-black text-white px-2 py-1 rounded-full text-sm'>{item}</span>
                            )) : <span>NA</span>}
                        </div>
                    </div>
                </div>
                
                {/* Applied Jobs Section */}
                <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                    <AppliedJobTable />
                </div>
            </div>

            {/* Edit Popup */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile