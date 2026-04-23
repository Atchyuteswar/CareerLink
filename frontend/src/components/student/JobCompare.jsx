import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../shared/Navbar'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { Scale, Plus, X, Briefcase, MapPin, IndianRupee, Clock, Monitor, Users, CheckCircle2, XCircle, Minus } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

const JobCompare = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [allJobs, setAllJobs] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([null, null, null]);
    const [loading, setLoading] = useState(true);
    const [showPicker, setShowPicker] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://100.94.122.76:8000/api/v1/job/get", { withCredentials: true });
                if (res.data.success) setAllJobs(res.data.jobs);
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        fetchJobs();
    }, []);

    const selectJob = (slotIndex, job) => {
        const updated = [...selectedJobs];
        updated[slotIndex] = job;
        setSelectedJobs(updated);
        setShowPicker(null);
        setSearchQuery('');
    };

    const removeJob = (slotIndex) => {
        const updated = [...selectedJobs];
        updated[slotIndex] = null;
        setSelectedJobs(updated);
    };

    const activeJobs = selectedJobs.filter(Boolean);
    const filteredPickerJobs = allJobs.filter(j =>
        !selectedJobs.some(s => s?._id === j._id) &&
        (j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         j.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatSalary = (val) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L PA`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K PA`;
        return `₹${val}`;
    };

    const getBestValue = (key) => {
        const vals = activeJobs.map(j => j[key]).filter(v => v !== undefined);
        if (key === 'salary') return Math.max(...vals);
        return null;
    };

    // Comparison rows
    const rows = [
        { label: 'Company', icon: Briefcase, getValue: j => j.company?.name || '—' },
        { label: 'Location', icon: MapPin, getValue: j => j.location || '—' },
        { label: 'Salary', icon: IndianRupee, getValue: j => formatSalary(j.salary), highlight: true, rawValue: j => j.salary },
        { label: 'Job Type', icon: Clock, getValue: j => j.jobType || '—' },
        { label: 'Work Mode', icon: Monitor, getValue: j => j.workMode || '—' },
        { label: 'Experience', icon: Users, getValue: j => j.experienceLevel !== undefined ? `${j.experienceLevel}+ years` : '—' },
        { label: 'Positions', icon: Users, getValue: j => j.position || '—' },
        { label: 'Requirements', icon: CheckCircle2, getValue: j => 'skills', isSkills: true },
    ];

    const userSkills = (user?.profile?.skills || []).map(s => s.toLowerCase().trim());

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <Scale className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Compare Jobs</h1>
                        <p className='text-sm text-muted-foreground'>Select up to 3 jobs to compare side by side</p>
                    </div>
                </div>

                {/* Job Selection Slots */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    {selectedJobs.map((job, i) => (
                        <div key={i} className='relative'>
                            {job ? (
                                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5'>
                                    <button onClick={() => removeJob(i)} className='absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-colors'>
                                        <X className='w-3.5 h-3.5 text-muted-foreground hover:text-rose-500' />
                                    </button>
                                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center mb-3'>
                                        <span className='text-sm font-bold text-violet-600 dark:text-violet-400'>{job.company?.name?.[0]?.toUpperCase()}</span>
                                    </div>
                                    <h3 className='font-bold text-sm text-foreground truncate'>{job.title}</h3>
                                    <p className='text-xs text-muted-foreground mt-0.5'>{job.company?.name}</p>
                                    <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 block'>{formatSalary(job.salary)}</span>
                                </div>
                            ) : (
                                <button onClick={() => setShowPicker(i)}
                                    className='w-full h-full min-h-[140px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-violet-300 dark:hover:border-violet-500/30 hover:bg-violet-50/30 dark:hover:bg-violet-500/5 transition-all'>
                                    <div className='w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                                        <Plus className='w-5 h-5 text-muted-foreground' />
                                    </div>
                                    <span className='text-sm font-medium text-muted-foreground'>Select Job {i + 1}</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Job Picker Modal */}
                {showPicker !== null && (
                    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4' onClick={() => setShowPicker(null)}>
                        <div className='bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[70vh] overflow-hidden' onClick={e => e.stopPropagation()}>
                            <div className='p-4 border-b border-gray-200 dark:border-gray-800'>
                                <h3 className='font-bold text-foreground mb-3'>Select a Job</h3>
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search by title or company..."
                                    className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20' autoFocus />
                            </div>
                            <div className='overflow-y-auto max-h-[50vh] p-2'>
                                {filteredPickerJobs.map(job => (
                                    <button key={job._id} onClick={() => selectJob(showPicker, job)}
                                        className='w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3'>
                                        <div className='w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center flex-shrink-0'>
                                            <span className='text-xs font-bold text-violet-600 dark:text-violet-400'>{job.company?.name?.[0]?.toUpperCase()}</span>
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='text-sm font-semibold text-foreground truncate'>{job.title}</p>
                                            <p className='text-xs text-muted-foreground'>{job.company?.name} • {formatSalary(job.salary)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Comparison Table */}
                {activeJobs.length >= 2 && (
                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden animate-fade-in-up' style={{opacity:0,animationDelay:'200ms'}}>
                        <div className='p-5 border-b border-gray-100 dark:border-gray-800'>
                            <h2 className='font-bold text-lg text-foreground flex items-center gap-2'>
                                <Scale className='w-5 h-5 text-violet-500' /> Side-by-Side Comparison
                            </h2>
                        </div>

                        {rows.map((row, ri) => {
                            const Icon = row.icon;
                            const bestSalary = row.highlight ? getBestValue('salary') : null;
                            return (
                                <div key={ri} className={`grid gap-0 ${ri % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/20' : ''}`}
                                    style={{ gridTemplateColumns: `180px repeat(${activeJobs.length}, 1fr)` }}>
                                    {/* Label */}
                                    <div className='px-5 py-4 flex items-center gap-2 border-r border-gray-100 dark:border-gray-800'>
                                        <Icon className='w-4 h-4 text-muted-foreground' />
                                        <span className='text-sm font-semibold text-foreground'>{row.label}</span>
                                    </div>
                                    {/* Values */}
                                    {activeJobs.map((job, ji) => (
                                        <div key={ji} className={`px-5 py-4 ${ji < activeJobs.length - 1 ? 'border-r border-gray-100 dark:border-gray-800' : ''}`}>
                                            {row.isSkills ? (
                                                <div className='flex flex-wrap gap-1'>
                                                    {(job.requirements || []).slice(0, 5).map((req, si) => {
                                                        const hasSkill = userSkills.includes(req.toLowerCase().trim());
                                                        return (
                                                            <span key={si} className={`text-[10px] px-2 py-0.5 rounded-md font-medium border
                                                                ${hasSkill
                                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                                                    : 'bg-gray-50 dark:bg-gray-800 text-muted-foreground border-gray-200 dark:border-gray-700'
                                                                }`}>
                                                                {hasSkill ? '✓' : '○'} {req}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className={`text-sm ${
                                                    row.highlight && row.rawValue && row.rawValue(job) === bestSalary
                                                        ? 'font-bold text-emerald-600 dark:text-emerald-400'
                                                        : 'text-foreground'
                                                }`}>
                                                    {row.getValue(job)}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}

                        {/* Action Row */}
                        <div className='grid gap-0 border-t border-gray-100 dark:border-gray-800'
                            style={{ gridTemplateColumns: `180px repeat(${activeJobs.length}, 1fr)` }}>
                            <div className='px-5 py-4'></div>
                            {activeJobs.map((job, ji) => (
                                <div key={ji} className='px-5 py-4'>
                                    <Button onClick={() => navigate(`/description/${job._id}`)}
                                        className='btn-primary w-full rounded-xl text-xs h-9'>
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeJobs.length < 2 && (
                    <div className='text-center py-12'>
                        <Scale className='w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30' />
                        <p className='text-muted-foreground font-medium'>Select at least 2 jobs to compare</p>
                        <p className='text-xs text-muted-foreground mt-1'>Click the "+" slots above to add jobs</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobCompare;
