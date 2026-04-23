import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios'
import { toast } from 'sonner'
import { ClipboardList, Clock, Eye, CheckCircle, XCircle, CornerDownRight, ChevronDown, StickyNote, Undo2, MapPin, IndianRupee, ExternalLink, Search, Filter } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
    pending: { label: 'Applied', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', dot: 'bg-amber-400', step: 1 },
    reviewed: { label: 'Reviewed', icon: Eye, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', dot: 'bg-blue-400', step: 2 },
    shortlisted: { label: 'Shortlisted', icon: CheckCircle, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20', dot: 'bg-indigo-400', step: 3 },
    interview: { label: 'Interview', icon: CornerDownRight, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20', dot: 'bg-violet-400', step: 4 },
    accepted: { label: 'Accepted', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-400', step: 5 },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', dot: 'bg-rose-400', step: -1 },
    withdrawn: { label: 'Withdrawn', icon: Undo2, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800/50', border: 'border-gray-200 dark:border-gray-700', dot: 'bg-gray-400', step: -2 },
};

const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const ApplicationTracker = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedNote, setExpandedNote] = useState(null);
    const [noteText, setNoteText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await axios.get("https://careerlink-1ank.onrender.com/api/v1/application/get", { withCredentials: true });
                if (res.data.success) setApplications(res.data.application || []);
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        fetchApps();
    }, []);

    const handleWithdraw = async (appId) => {
        if (!window.confirm("Are you sure you want to withdraw this application?")) return;
        try {
            const res = await axios.post(`https://careerlink-1ank.onrender.com/api/v1/application/withdraw/${appId}`, {}, { withCredentials: true });
            if (res.data.success) {
                setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: 'withdrawn' } : a));
                toast.success("Application withdrawn.");
            }
        } catch (e) { toast.error("Failed to withdraw."); }
    };

    const handleSaveNote = async (appId) => {
        try {
            const res = await axios.post(`https://careerlink-1ank.onrender.com/api/v1/application/note/${appId}`, { note: noteText }, { withCredentials: true });
            if (res.data.success) {
                setApplications(prev => prev.map(a => a._id === appId ? { ...a, notes: noteText } : a));
                toast.success("Note saved.");
                setExpandedNote(null);
            }
        } catch (e) { toast.error("Failed to save note."); }
    };

    const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

    // Stats
    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    };

    const pipelineStages = ['pending', 'reviewed', 'shortlisted', 'interview', 'accepted'];

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-5xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-6'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <ClipboardList className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Application Tracker</h1>
                        <p className='text-sm text-muted-foreground'>Track all your job applications in one place</p>
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-4 gap-3 mb-6'>
                    {[
                        { label: 'Total', value: stats.total, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
                        { label: 'Pending', value: stats.pending, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                        { label: 'Accepted', value: stats.accepted, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                        { label: 'Rejected', value: stats.rejected, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
                    ].map((s, i) => (
                        <div key={i} className={`${s.bg} rounded-xl p-3.5 text-center`}>
                            <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                            <p className='text-[11px] text-muted-foreground font-medium'>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className='flex items-center gap-2 mb-6 overflow-x-auto pb-2'>
                    {['all', 'pending', 'accepted', 'rejected', 'withdrawn'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all whitespace-nowrap
                                ${filter === f
                                    ? 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/30'
                                    : 'bg-gray-50 dark:bg-gray-800/50 text-muted-foreground border-gray-200 dark:border-gray-700'}`}>
                            {f === 'all' ? `All (${applications.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${applications.filter(a => a.status === f).length})`}
                        </button>
                    ))}
                </div>

                {/* Applications */}
                {loading ? (
                    <div className='flex justify-center py-16'>
                        <div className='w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='text-center py-16'>
                        <ClipboardList className='w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-40' />
                        <p className='text-muted-foreground font-medium'>No applications found</p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {filtered.map((app, i) => {
                            const config = statusConfig[app.status] || statusConfig.pending;
                            const Icon = config.icon;
                            const job = app.job;
                            return (
                                <div key={app._id} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 animate-fade-in-up' style={{opacity:0,animationDelay:`${i*80}ms`}}>
                                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                        {/* Job Info */}
                                        <div className='flex items-start gap-3 flex-1'>
                                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center flex-shrink-0'>
                                                <span className='text-sm font-bold text-violet-600 dark:text-violet-400'>
                                                    {job?.company?.name?.[0]?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div className='min-w-0'>
                                                <h3 className='font-bold text-foreground'>{job?.title || 'Unknown Job'}</h3>
                                                <p className='text-sm text-muted-foreground'>{job?.company?.name}</p>
                                                <div className='flex items-center gap-3 mt-1 text-xs text-muted-foreground'>
                                                    {job?.location && <span className='flex items-center gap-0.5'><MapPin className='w-3 h-3' /> {job.location}</span>}
                                                    {job?.salary && <span className='flex items-center gap-0.5'><IndianRupee className='w-3 h-3' /> {job.salary >= 100000 ? `${(job.salary/100000).toFixed(1)}L` : `${(job.salary/1000).toFixed(0)}K`}</span>}
                                                    <span className='flex items-center gap-0.5'><Clock className='w-3 h-3' /> {timeAgo(app.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status + Actions */}
                                        <div className='flex items-center gap-2'>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${config.bg} ${config.color} border ${config.border}`}>
                                                <Icon className='w-3.5 h-3.5' /> {config.label}
                                            </span>

                                            {/* Actions Dropdown */}
                                            <div className='flex items-center gap-1'>
                                                {app.status === 'pending' && (
                                                    <button onClick={() => handleWithdraw(app._id)}
                                                        className='text-[11px] font-medium text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1'>
                                                        <Undo2 className='w-3 h-3' /> Withdraw
                                                    </button>
                                                )}
                                                <button onClick={() => { setExpandedNote(expandedNote === app._id ? null : app._id); setNoteText(app.notes || ''); }}
                                                    className='text-[11px] font-medium text-violet-500 hover:text-violet-600 hover:underline flex items-center gap-1 ml-2'>
                                                    <StickyNote className='w-3 h-3' /> Notes
                                                </button>
                                                <button onClick={() => navigate(`/description/${job?._id}`)}
                                                    className='text-[11px] font-medium text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 ml-2'>
                                                    <ExternalLink className='w-3 h-3' /> View
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Timeline */}
                                    {app.status !== 'withdrawn' && app.status !== 'rejected' && (
                                        <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-800'>
                                            <div className='flex items-center gap-0'>
                                                {pipelineStages.map((stage, si) => {
                                                    const sc = statusConfig[stage];
                                                    const currentStep = config.step || 0;
                                                    const isComplete = sc.step <= currentStep;
                                                    const isCurrent = stage === app.status;
                                                    return (
                                                        <React.Fragment key={stage}>
                                                            <div className='flex flex-col items-center' style={{ flex: 1 }}>
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                                                                    ${isCurrent ? `${sc.bg} ${sc.color} ring-2 ring-offset-1 ring-offset-background ${sc.border.replace('border', 'ring')}` 
                                                                    : isComplete ? 'bg-emerald-500 text-white' 
                                                                    : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'}`}>
                                                                    {isComplete && !isCurrent ? '✓' : si + 1}
                                                                </div>
                                                                <span className={`text-[9px] mt-1 font-medium ${isCurrent ? sc.color : isComplete ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                                                    {sc.label}
                                                                </span>
                                                            </div>
                                                            {si < pipelineStages.length - 1 && (
                                                                <div className={`h-0.5 flex-1 rounded-full transition-all mt-[-12px]
                                                                    ${sc.step < currentStep ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes Editor */}
                                    {expandedNote === app._id && (
                                        <div className='mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 animate-fade-in'>
                                            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
                                                placeholder="Add personal notes about this application..."
                                                className='w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none'
                                            />
                                            <div className='flex justify-end gap-2 mt-2'>
                                                <Button variant="outline" size="sm" className='rounded-lg text-xs' onClick={() => setExpandedNote(null)}>Cancel</Button>
                                                <Button size="sm" className='btn-primary rounded-lg text-xs' onClick={() => handleSaveNote(app._id)}>Save Note</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationTracker;
