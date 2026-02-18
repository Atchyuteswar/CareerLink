import React, { useEffect, useState, useContext } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import { Separator } from '../ui/separator'; // npx shadcn@latest add separator
import { Globe, MapPin } from 'lucide-react';

const JobDescription = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [singleJob, setSingleJob] = useState(null);
    const [isApplied, setIsApplied] = useState(false);

    // AI Match State
    const [matchScore, setMatchScore] = useState(0);
    const [missingSkills, setMissingSkills] = useState([]);

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/job/get/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSingleJob(res.data.job);
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));

                    // --- MATCH ALGO ---
                    if (user && user.profile?.skills && res.data.job.requirements) {
                        const jobSkills = typeof res.data.job.requirements === 'string'
                            ? res.data.job.requirements.split(',').map(s => s.trim().toLowerCase())
                            : res.data.job.requirements.map(s => s.toLowerCase());
                        const userSkills = user.profile.skills.map(s => s.toLowerCase());

                        const matchedSkills = jobSkills.filter(skill => userSkills.includes(skill));
                        const missing = jobSkills.filter(skill => !userSkills.includes(skill));
                        const score = Math.round((matchedSkills.length / jobSkills.length) * 100);

                        setMatchScore(score);
                        setMissingSkills(missing);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [id, user]);

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/application/apply/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsApplied(true);
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    return (
        <div className='bg-background min-h-screen pb-10'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>

                {/* 1. Header Section */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-3xl text-foreground'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-2 mt-2 flex-wrap'>
                            <Badge className={'text-blue-700 bg-blue-50'} variant="outline">{singleJob?.position} Openings</Badge>
                            <Badge className={'text-[#F83002] bg-red-50'} variant="outline">{singleJob?.jobType}</Badge>
                            <Badge className={'text-[#7209b7] bg-purple-50'} variant="outline">{singleJob?.salary} LPA</Badge>
                            {/* NEW: Work Mode Badge */}
                            {singleJob?.workMode && <Badge className={'text-green-700 bg-green-50'} variant="outline">{singleJob.workMode}</Badge>}
                        </div>
                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-lg px-8 py-6 text-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                {/* 2. AI Match Meter */}
                <div className='mt-8 p-6 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm'>
                    <div>
                        <h2 className='font-bold text-lg text-foreground'>AI Compatibility Score</h2>
                        <p className='text-sm text-muted-foreground'>Based on your profile skills vs job requirements</p>
                        {matchScore < 100 && missingSkills.length > 0 && (
                            <div className='mt-2'>
                                <span className='text-xs text-yellow-600 font-bold'>Missing: </span>
                                {missingSkills.map((s, i) => <span key={i} className='text-xs text-muted-foreground mr-2'>{s}</span>)}
                            </div>
                        )}
                    </div>
                    <div className='relative flex items-center justify-center w-20 h-20 rounded-full bg-card shadow-inner'>
                        <span className={`text-xl font-bold ${matchScore >= 75 ? 'text-green-600' : matchScore >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {matchScore}%
                        </span>
                        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                            <circle
                                cx="40" cy="40" r="36"
                                stroke={matchScore >= 75 ? "#16a34a" : matchScore >= 50 ? "#ca8a04" : "#ef4444"}
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray="226"
                                strokeDashoffset={226 - (226 * matchScore) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                    </div>
                </div>

                {/* 3. Job Description & Benefits */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-8'>
                    {/* Left: Description */}
                    <div className='md:col-span-2 space-y-6'>
                        <div>
                            <h1 className='font-bold text-xl mb-3'>Job Description</h1>
                            <p className='text-muted-foreground leading-relaxed whitespace-pre-line'>
                                {singleJob?.description}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h1 className='font-bold text-xl mb-3'>Requirements</h1>
                            <div className='flex flex-wrap gap-2'>
                                {singleJob?.requirements?.map((req, index) => (
                                    <span key={index} className='bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium'>
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* NEW: Benefits Section */}
                        {singleJob?.benefits && (
                            <>
                                <Separator />
                                <div>
                                    <h1 className='font-bold text-xl mb-3'>Perks & Benefits</h1>
                                    <p className='text-muted-foreground'>{singleJob?.benefits}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: Company Info Card */}
                    <div className='md:col-span-1'>
                        <div className='bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24'>
                            <h2 className='font-bold text-lg mb-4'>About the Company</h2>
                            <div className='flex items-center gap-3 mb-4'>
                                <img src={singleJob?.company?.logo} alt="" className='w-12 h-12 rounded-full object-cover border' />
                                <div>
                                    <h3 className='font-bold'>{singleJob?.company?.name}</h3>
                                    <div className='flex items-center text-xs text-muted-foreground gap-1'>
                                        <MapPin size={12} />
                                        <span>{singleJob?.company?.location || singleJob?.location}</span>
                                    </div>
                                </div>
                            </div>

                            <p className='text-sm text-muted-foreground mb-4 line-clamp-4'>
                                {singleJob?.company?.description || "No company description available."}
                            </p>

                            {singleJob?.company?.website && (
                                <a href={singleJob.company.website} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Globe size={16} /> Visit Website
                                    </Button>
                                </a>
                            )}

                            <Separator className="my-4" />

                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Posted:</span>
                                    <span className='font-medium'>{singleJob?.createdAt.split("T")[0]}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Experience:</span>
                                    <span className='font-medium'>{singleJob?.experienceLevel} Years</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Applicants:</span>
                                    <span className='font-medium'>{singleJob?.applications?.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription