import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios'
import { toast } from 'sonner'
import { Columns3, Clock, Eye, Users, CheckCircle, XCircle, ArrowRight, FileText, MessageSquare, GripVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useNavigate } from 'react-router-dom'

const stages = [
    { key: 'pending', label: 'New Applications', icon: Clock, color: 'border-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/5', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-400' },
    { key: 'reviewed', label: 'Under Review', icon: Eye, color: 'border-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/5', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-400' },
    { key: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'border-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/5', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-400' },
    { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'border-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/5', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-400' },
];

const KanbanBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState('all');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsRes = await axios.get("http://100.94.122.76:8000/api/v1/job/getadminjobs", { withCredentials: true });
                if (jobsRes.data.success) {
                    setJobs(jobsRes.data.jobs);
                    // Fetch applicants for all jobs
                    const allApps = [];
                    for (const job of jobsRes.data.jobs) {
                        try {
                            const appRes = await axios.get(`http://100.94.122.76:8000/api/v1/application/${job._id}/applicants`, { withCredentials: true });
                            if (appRes.data.success && appRes.data.job?.applications) {
                                appRes.data.job.applications.forEach(app => {
                                    allApps.push({ ...app, jobTitle: job.title, jobId: job._id });
                                });
                            }
                        } catch (e) { /* skip */ }
                    }
                    setApplications(allApps);
                }
            } catch (error) { console.log(error); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const moveToStage = async (applicationId, newStatus) => {
        try {
            const res = await axios.post(`http://100.94.122.76:8000/api/v1/application/status/${applicationId}/update`, 
                { status: newStatus }, { withCredentials: true });
            if (res.data.success) {
                setApplications(prev => prev.map(app => 
                    app._id === applicationId ? { ...app, status: newStatus } : app
                ));
                toast.success(`Moved to ${newStatus}`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredApps = selectedJob === 'all' 
        ? applications 
        : applications.filter(a => a.jobId === selectedJob);

    const getStageApps = (stageKey) => filteredApps.filter(a => a.status === stageKey);

    if (loading) {
        return (
            <div className='bg-background min-h-screen'>
                <Navbar />
                <div className='max-w-7xl mx-auto py-20 flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    <p className='mt-4 text-muted-foreground'>Loading pipeline...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-[1400px] mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                            <Columns3 className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                        </div>
                        <div>
                            <h1 className='font-extrabold text-2xl text-foreground'>Hiring Pipeline</h1>
                            <p className='text-sm text-muted-foreground'>{applications.length} total candidates across {jobs.length} jobs</p>
                        </div>
                    </div>

                    <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                        className='px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm font-medium text-foreground focus:outline-none cursor-pointer max-w-xs'>
                        <option value="all">All Jobs ({applications.length} candidates)</option>
                        {jobs.map(job => {
                            const count = applications.filter(a => a.jobId === job._id).length;
                            return <option key={job._id} value={job._id}>{job.title} ({count})</option>;
                        })}
                    </select>
                </div>

                {/* Pipeline Stats */}
                <div className='grid grid-cols-4 gap-3 mb-6'>
                    {stages.map(stage => {
                        const Icon = stage.icon;
                        const count = getStageApps(stage.key).length;
                        return (
                            <div key={stage.key} className={`${stage.bg} border ${stage.color} rounded-xl p-3 flex items-center gap-3`}>
                                <div className={`w-2 h-2 rounded-full ${stage.dot}`}></div>
                                <div>
                                    <p className={`text-lg font-extrabold ${stage.text}`}>{count}</p>
                                    <p className='text-[11px] text-muted-foreground font-medium'>{stage.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Kanban Columns */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    {stages.map(stage => {
                        const Icon = stage.icon;
                        const stageApps = getStageApps(stage.key);
                        return (
                            <div key={stage.key} className='bg-gray-50/50 dark:bg-gray-950/30 rounded-2xl p-3 min-h-[400px]'>
                                {/* Column Header */}
                                <div className={`flex items-center gap-2 mb-3 px-2`}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${stage.dot}`}></div>
                                    <span className='text-sm font-bold text-foreground'>{stage.label}</span>
                                    <span className='text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md font-semibold ml-auto'>{stageApps.length}</span>
                                </div>

                                {/* Cards */}
                                <div className='space-y-2'>
                                    {stageApps.map((app, i) => (
                                        <div key={app._id} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-xl p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default animate-fade-in' style={{animationDelay: `${i*60}ms`}}>
                                            {/* Candidate Info */}
                                            <div className='flex items-center gap-2.5 mb-2'>
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={app.applicant?.profile?.profilePhoto} />
                                                    <AvatarFallback className="bg-gradient-to-br from-violet-400 to-indigo-400 text-white text-xs font-bold">
                                                        {app.applicant?.fullname?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='min-w-0'>
                                                    <p className='text-xs font-bold text-foreground truncate'>{app.applicant?.fullname}</p>
                                                    <p className='text-[10px] text-muted-foreground truncate'>{app.applicant?.email}</p>
                                                </div>
                                            </div>

                                            {/* Job Tag */}
                                            <div className='mb-2'>
                                                <span className='text-[10px] font-medium bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-500/20'>
                                                    {app.jobTitle}
                                                </span>
                                            </div>

                                            {/* Skills Preview */}
                                            {app.applicant?.profile?.skills?.length > 0 && (
                                                <div className='flex flex-wrap gap-1 mb-2'>
                                                    {app.applicant.profile.skills.slice(0, 3).map((s, si) => (
                                                        <span key={si} className='text-[9px] bg-gray-50 dark:bg-gray-800 text-muted-foreground px-1.5 py-0.5 rounded'>{s}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className='flex items-center gap-1 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800'>
                                                {app.applicant?.profile?.resume && (
                                                    <a href={app.applicant.profile.resume} target="_blank" rel="noopener noreferrer"
                                                        className='text-[10px] font-medium text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-0.5'>
                                                        <FileText className='w-3 h-3' /> CV
                                                    </a>
                                                )}
                                                <div className='ml-auto flex items-center gap-0.5'>
                                                    {stage.key === 'pending' && (
                                                        <>
                                                            <button onClick={() => moveToStage(app._id, 'accepted')} title="Accept"
                                                                className='w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors'>
                                                                <CheckCircle className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                                                            </button>
                                                            <button onClick={() => moveToStage(app._id, 'rejected')} title="Reject"
                                                                className='w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors'>
                                                                <XCircle className='w-3.5 h-3.5 text-rose-600 dark:text-rose-400' />
                                                            </button>
                                                        </>
                                                    )}
                                                    {stage.key === 'accepted' && (
                                                        <button onClick={() => navigate('/chat')} title="Message"
                                                            className='w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors'>
                                                            <MessageSquare className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {stageApps.length === 0 && (
                                        <div className='text-center py-8 opacity-40'>
                                            <Icon className='w-6 h-6 text-muted-foreground mx-auto mb-1' />
                                            <p className='text-[11px] text-muted-foreground'>No candidates</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
