import React, { useEffect, useState, useContext } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import { Separator } from '../ui/separator';
import { Globe, MapPin, IndianRupee, Clock, Users, Briefcase, CheckCircle2, XCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const JobDescription = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [singleJob, setSingleJob] = useState(null);
    const [isApplied, setIsApplied] = useState(false);

    // AI Match State
    const [matchScore, setMatchScore] = useState(0);
    const [missingSkills, setMissingSkills] = useState([]);
    const [matchedSkills, setMatchedSkills] = useState([]);

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`http://100.94.122.76:8000/api/v1/job/get/${id}`, {
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

                        const matched = jobSkills.filter(skill => userSkills.includes(skill));
                        const missing = jobSkills.filter(skill => !userSkills.includes(skill));
                        const score = Math.round((matched.length / jobSkills.length) * 100);

                        setMatchScore(score);
                        setMissingSkills(missing);
                        setMatchedSkills(matched);
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
            const res = await axios.get(`http://100.94.122.76:8000/api/v1/application/apply/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsApplied(true);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply");
        }
    }

    const daysAgo = () => {
        if (!singleJob?.createdAt) return '';
        const diff = Math.floor((new Date() - new Date(singleJob.createdAt)) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        return `${diff} days ago`;
    };

    const getScoreColor = () => {
        if (matchScore >= 75) return { text: 'text-emerald-600 dark:text-emerald-400', ring: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Excellent Match' };
        if (matchScore >= 50) return { text: 'text-amber-600 dark:text-amber-400', ring: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Good Match' };
        return { text: 'text-rose-600 dark:text-rose-400', ring: '#ef4444', bg: 'bg-rose-50 dark:bg-rose-500/10', label: 'Needs Improvement' };
    };

    const scoreStyle = getScoreColor();

    if (!singleJob) {
        return (
            <div className='bg-background min-h-screen'>
                <Navbar />
                <div className='max-w-7xl mx-auto py-20 flex flex-col items-center justify-center'>
                    <div className='w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    <p className='mt-4 text-muted-foreground'>Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-8 px-4'>

                {/* Header Card */}
                <div className='relative bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-8 overflow-hidden animate-fade-in'>
                    {/* Gradient accent */}
                    <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500'></div>
                    
                    <div className='flex flex-col md:flex-row items-start justify-between gap-6'>
                        <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-4'>
                                {singleJob?.company?.logo ? (
                                    <img src={singleJob.company.logo} alt="" className='w-14 h-14 rounded-xl object-cover border border-gray-100 dark:border-gray-800' />
                                ) : (
                                    <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center'>
                                        <Briefcase className='w-7 h-7 text-violet-600 dark:text-violet-400' />
                                    </div>
                                )}
                                <div>
                                    <h3 className='font-semibold text-muted-foreground'>{singleJob?.company?.name}</h3>
                                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                        <MapPin className='w-3 h-3' />
                                        <span>{singleJob?.company?.location || singleJob?.location}</span>
                                    </div>
                                </div>
                            </div>

                            <h1 className='font-extrabold text-3xl text-foreground mb-3'>{singleJob?.title}</h1>
                            
                            <div className='flex items-center gap-2 flex-wrap'>
                                <Badge className='badge-blue text-xs font-medium' variant="outline">{singleJob?.position} Openings</Badge>
                                <Badge className='badge-red text-xs font-medium' variant="outline">{singleJob?.jobType}</Badge>
                                <Badge className='badge-purple text-xs font-medium' variant="outline">
                                    <IndianRupee className='w-3 h-3 mr-0.5' />{singleJob?.salary} LPA
                                </Badge>
                                {singleJob?.workMode && <Badge className='badge-green text-xs font-medium' variant="outline">{singleJob.workMode}</Badge>}
                                <Badge className='badge-amber text-xs font-medium' variant="outline">
                                    <Clock className='w-3 h-3 mr-0.5' />{daysAgo()}
                                </Badge>
                            </div>
                        </div>

                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-xl px-8 py-6 text-base font-semibold transition-all duration-300 
                                ${isApplied 
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700' 
                                    : 'btn-primary shadow-xl'
                                }`}
                        >
                            {isApplied ? (
                                <><CheckCircle2 className='w-5 h-5 mr-2' /> Already Applied</>
                            ) : (
                                <>Apply Now <ArrowUpRight className='w-5 h-5 ml-2' /></>
                            )}
                        </Button>
                    </div>
                </div>

                {/* AI Match Meter */}
                {user && user.role === 'student' && (
                    <div className='mt-6 bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up delay-200' style={{opacity: 0}}>
                        <div className='flex items-center gap-2 mb-4'>
                            <Sparkles className='w-5 h-5 text-violet-500' />
                            <h2 className='font-bold text-lg text-foreground'>AI Compatibility Score</h2>
                        </div>
                        
                        <div className='flex flex-col md:flex-row items-center gap-8'>
                            {/* Score Ring */}
                            <div className='relative flex items-center justify-center w-28 h-28 flex-shrink-0'>
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                                    <circle
                                        cx="50" cy="50" r="42"
                                        stroke={scoreStyle.ring}
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeLinecap="round"
                                        strokeDasharray="264"
                                        strokeDashoffset={264 - (264 * matchScore) / 100}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className='absolute flex flex-col items-center'>
                                    <span className={`text-2xl font-extrabold ${scoreStyle.text}`}>{matchScore}%</span>
                                </div>
                            </div>

                            {/* Skills Breakdown */}
                            <div className='flex-1 w-full'>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${scoreStyle.bg} ${scoreStyle.text} mb-3`}>
                                    {matchScore >= 75 ? <CheckCircle2 className='w-3.5 h-3.5' /> : <XCircle className='w-3.5 h-3.5' />}
                                    {scoreStyle.label}
                                </div>
                                <p className='text-sm text-muted-foreground mb-3'>Based on your profile skills vs job requirements</p>
                                
                                {matchedSkills.length > 0 && (
                                    <div className='mb-3'>
                                        <span className='text-xs font-semibold text-emerald-600 dark:text-emerald-400'>Matched Skills: </span>
                                        <div className='flex flex-wrap gap-1.5 mt-1'>
                                            {matchedSkills.map((s, i) => (
                                                <span key={i} className='text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20'>
                                                    ✓ {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {missingSkills.length > 0 && (
                                    <div>
                                        <span className='text-xs font-semibold text-amber-600 dark:text-amber-400'>Skills to Learn: </span>
                                        <div className='flex flex-wrap gap-1.5 mt-1'>
                                            {missingSkills.map((s, i) => (
                                                <span key={i} className='text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20'>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
                    {/* Left: Description */}
                    <div className='md:col-span-2 space-y-6'>
                        <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up delay-300' style={{opacity: 0}}>
                            <h2 className='font-bold text-xl mb-4 text-foreground'>Job Description</h2>
                            <p className='text-muted-foreground leading-relaxed whitespace-pre-line'>
                                {singleJob?.description}
                            </p>
                        </div>

                        <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up delay-400' style={{opacity: 0}}>
                            <h2 className='font-bold text-xl mb-4 text-foreground'>Requirements</h2>
                            <div className='flex flex-wrap gap-2'>
                                {singleJob?.requirements?.map((req, index) => (
                                    <span key={index} className='bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700'>
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {singleJob?.benefits && (
                            <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up delay-500' style={{opacity: 0}}>
                                <h2 className='font-bold text-xl mb-4 text-foreground'>Perks & Benefits</h2>
                                <p className='text-muted-foreground leading-relaxed'>{singleJob?.benefits}</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Company Info Card */}
                    <div className='md:col-span-1'>
                        <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 sticky top-24 animate-fade-in-up delay-300' style={{opacity: 0}}>
                            <h2 className='font-bold text-lg mb-4 text-foreground'>About the Company</h2>
                            <div className='flex items-center gap-3 mb-4'>
                                {singleJob?.company?.logo ? (
                                    <img src={singleJob.company.logo} alt="" className='w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800' />
                                ) : (
                                    <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center'>
                                        <span className='text-lg font-bold text-violet-600 dark:text-violet-400'>
                                            {singleJob?.company?.name?.[0]}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className='font-bold text-foreground'>{singleJob?.company?.name}</h3>
                                    <div className='flex items-center text-xs text-muted-foreground gap-1'>
                                        <MapPin size={12} />
                                        <span>{singleJob?.company?.location || singleJob?.location}</span>
                                    </div>
                                </div>
                            </div>

                            <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>
                                {singleJob?.company?.description || "No company description available."}
                            </p>

                            {singleJob?.company?.website && (
                                <a href={singleJob.company.website} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="w-full gap-2 rounded-xl border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500/50 mb-4">
                                        <Globe size={16} /> Visit Website
                                    </Button>
                                </a>
                            )}

                            <Separator className="my-4" />

                            <div className='space-y-3 text-sm'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-muted-foreground flex items-center gap-1.5'><Clock className='w-3.5 h-3.5' /> Posted</span>
                                    <span className='font-semibold text-foreground'>{daysAgo()}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-muted-foreground flex items-center gap-1.5'><Briefcase className='w-3.5 h-3.5' /> Experience</span>
                                    <span className='font-semibold text-foreground'>{singleJob?.experienceLevel} Years</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-muted-foreground flex items-center gap-1.5'><Users className='w-3.5 h-3.5' /> Applicants</span>
                                    <span className='font-semibold text-foreground'>{singleJob?.applications?.length}</span>
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