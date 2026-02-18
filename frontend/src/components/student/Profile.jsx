import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Contact, Mail, Pen, Github, Linkedin, Globe, FileText, Download } from 'lucide-react' // <--- Added Icons
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
                const res = await axios.get("http://localhost:8000/api/v1/application/get", {
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

    const isHaveResume = user?.profile?.resume ? true : false;

    return (
        <div className='bg-background min-h-screen text-foreground'>
            <Navbar />
            <div className='max-w-7xl mx-auto border border-border rounded-2xl my-5 p-8 bg-card shadow-sm'>

                {/* Header: Avatar, Info, Edit Button */}
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24 cursor-pointer">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            {/* Headline (New) */}
                            {user?.profile?.headline && (
                                <p className='text-sm font-semibold text-[#6A38C2]'>{user?.profile?.headline}</p>
                            )}
                            <p className='text-sm text-muted-foreground mt-1'>{user?.profile?.bio || "No bio added."}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
                        <Pen className='w-4 h-4 mr-2' /> Edit Profile
                    </Button>
                </div>

                {/* Contact Info & Social Links */}
                <div className='my-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                            <Mail className='h-4 w-4' />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                            <Contact className='h-4 w-4' />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>

                    {/* New Social Links Section */}
                    <div className='space-y-2'>
                        {user?.profile?.github && (
                            <div className='flex items-center gap-3 text-sm text-muted-foreground hover:text-[#6A38C2] transition-colors'>
                                <Github className='h-4 w-4' />
                                <a href={user.profile.github} target="_blank" rel="noopener noreferrer">GitHub Profile</a>
                            </div>
                        )}
                        {user?.profile?.linkedin && (
                            <div className='flex items-center gap-3 text-sm text-muted-foreground hover:text-blue-600 transition-colors'>
                                <Linkedin className='h-4 w-4' />
                                <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                            </div>
                        )}
                        {user?.profile?.portfolio && (
                            <div className='flex items-center gap-3 text-sm text-muted-foreground hover:text-green-600 transition-colors'>
                                <Globe className='h-4 w-4' />
                                <a href={user.profile.portfolio} target="_blank" rel="noopener noreferrer">Portfolio Website</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg mb-2'>Skills</h1>
                    <div className='flex items-center gap-1 flex-wrap'>
                        {user?.profile?.skills?.length !== 0 ? user?.profile?.skills.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{item}</Badge>
                        )) : <span className='text-muted-foreground text-sm'>NA</span>}
                    </div>
                </div>

                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        user?.profile?.resume ? (
                            <div className="flex items-center gap-2 mt-2">
                                <FileText className="text-[#6A38C2]" />
                                <a
                                    target='_blank'
                                    href={user?.profile?.resume}
                                    className='text-blue-500 w-full hover:underline cursor-pointer'
                                >
                                    {user?.profile?.resumeOriginalName || "Download Resume"}
                                </a>
                            </div>
                        ) : <span className="text-muted-foreground italic">No resume uploaded</span>
                    }
                </div>
            </div>

            {/* Content Grid: Analytics + Table */}
            <div className='max-w-7xl mx-auto rounded-2xl my-5 grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='md:col-span-1'>
                    <ApplicationAnalytics appliedJobs={appliedJobs} />
                </div>
                <div className='md:col-span-2 bg-card rounded-2xl border border-border p-5'>
                    <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                    <AppliedJobTable appliedJobs={appliedJobs} />
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile