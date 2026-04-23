import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Contact, Mail, Pen, Github, Linkedin, Globe, FileText, Briefcase, MapPin } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import ApplicationAnalytics from './ApplicationAnalytics'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const [appliedJobs, setAppliedJobs] = useState([]);
    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get("http://100.94.122.76:8000/api/v1/application/get", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setAppliedJobs(res.data.application);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    }, []);

    return (
        <div className='bg-background min-h-screen text-foreground'>
            <Navbar />
            
            {/* Profile Card */}
            <div className='max-w-7xl mx-auto my-8 px-4'>
                <div className='relative bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden animate-fade-in'>
                    {/* Gradient Banner */}
                    <div className='h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative'>
                        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%200h40v40H0V0zm1%201h38v38H1V1z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")]'></div>
                    </div>

                    <div className='px-8 pb-8'>
                        {/* Avatar + Info */}
                        <div className='flex flex-col md:flex-row justify-between items-start -mt-12 gap-4'>
                            <div className='flex items-end gap-5'>
                                <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-900 shadow-xl flex-shrink-0">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-2xl font-bold">
                                        {user?.fullname?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='pb-1 pt-14'>
                                    <h1 className='font-extrabold text-2xl text-foreground'>{user?.fullname}</h1>
                                    {user?.profile?.headline && (
                                        <p className='text-sm font-semibold text-violet-600 dark:text-violet-400 mt-0.5'>{user?.profile?.headline}</p>
                                    )}
                                    <p className='text-sm text-muted-foreground mt-1 max-w-md leading-relaxed'>{user?.profile?.bio || "No bio added."}</p>
                                </div>
                            </div>
                            <Button onClick={() => setOpen(true)} variant="outline" className="rounded-xl border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500/50 mt-16 md:mt-4">
                                <Pen className='w-4 h-4 mr-2' /> Edit Profile
                            </Button>
                        </div>

                        {/* Contact Info & Social Links */}
                        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-3'>
                                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                                    <div className='w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center'>
                                        <Mail className='h-4 w-4 text-gray-500' />
                                    </div>
                                    <span>{user?.email}</span>
                                </div>
                                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                                    <div className='w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center'>
                                        <Contact className='h-4 w-4 text-gray-500' />
                                    </div>
                                    <span>{user?.phoneNumber}</span>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                {user?.profile?.github && (
                                    <a href={user.profile.github} target="_blank" rel="noopener noreferrer" className='flex items-center gap-3 text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors'>
                                        <div className='w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center'>
                                            <Github className='h-4 w-4' />
                                        </div>
                                        <span>GitHub Profile</span>
                                    </a>
                                )}
                                {user?.profile?.linkedin && (
                                    <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer" className='flex items-center gap-3 text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <div className='w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center'>
                                            <Linkedin className='h-4 w-4' />
                                        </div>
                                        <span>LinkedIn Profile</span>
                                    </a>
                                )}
                                {user?.profile?.portfolio && (
                                    <a href={user.profile.portfolio} target="_blank" rel="noopener noreferrer" className='flex items-center gap-3 text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'>
                                        <div className='w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center'>
                                            <Globe className='h-4 w-4' />
                                        </div>
                                        <span>Portfolio Website</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className='mt-6'>
                            <h2 className='font-bold text-lg mb-3 text-foreground'>Skills</h2>
                            <div className='flex items-center gap-2 flex-wrap'>
                                {user?.profile?.skills?.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                    <Badge key={index} className="text-sm px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 font-medium">
                                        {item}
                                    </Badge>
                                )) : <span className='text-muted-foreground text-sm'>No skills added yet</span>}
                            </div>
                        </div>

                        {/* Resume */}
                        <div className='mt-6'>
                            <h2 className="font-bold text-lg mb-3 text-foreground">Resume</h2>
                            {user?.profile?.resume ? (
                                <a
                                    target='_blank'
                                    href={user?.profile?.resume}
                                    className='inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/5 hover:border-violet-200 dark:hover:border-violet-500/30 transition-all duration-200 font-medium'
                                >
                                    <FileText className="w-4 h-4" />
                                    {user?.profile?.resumeOriginalName || "View Resume"}
                                </a>
                            ) : <span className="text-muted-foreground text-sm italic">No resume uploaded</span>}
                        </div>
                    </div>
                </div>

                {/* Content Grid: Analytics + Table */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
                    <div className='md:col-span-1 animate-fade-in-up delay-200' style={{opacity: 0}}>
                        <ApplicationAnalytics appliedJobs={appliedJobs} />
                    </div>
                    <div className='md:col-span-2 bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up delay-300' style={{opacity: 0}}>
                        <h2 className='font-bold text-lg mb-5 text-foreground'>Applied Jobs</h2>
                        <AppliedJobTable appliedJobs={appliedJobs} />
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile