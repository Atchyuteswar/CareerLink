import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios'
import { BarChart3, TrendingUp, Users, Eye, Briefcase, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react'

const AnalyticsDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsRes = await axios.get("https://careerlink-1ank.onrender.com/api/v1/job/getadminjobs", { withCredentials: true });
                if (jobsRes.data.success) {
                    setJobs(jobsRes.data.jobs);
                    const allApps = [];
                    for (const job of jobsRes.data.jobs) {
                        try {
                            const appRes = await axios.get(`https://careerlink-1ank.onrender.com/api/v1/application/${job._id}/applicants`, { withCredentials: true });
                            if (appRes.data.success && appRes.data.job?.applications) {
                                appRes.data.job.applications.forEach(app => {
                                    allApps.push({ ...app, jobTitle: job.title, jobId: job._id, jobCreatedAt: job.createdAt });
                                });
                            }
                        } catch (e) {}
                    }
                    setApplications(allApps);
                }
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    // Compute analytics
    const totalJobs = jobs.length;
    const totalApplications = applications.length;
    const acceptedCount = applications.filter(a => a.status === 'accepted').length;
    const rejectedCount = applications.filter(a => a.status === 'rejected').length;
    const pendingCount = applications.filter(a => a.status === 'pending').length;
    const acceptRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(1) : 0;

    // Applications per job
    const jobApps = jobs.map(j => ({
        title: j.title,
        count: applications.filter(a => a.jobId === j._id).length,
        accepted: applications.filter(a => a.jobId === j._id && a.status === 'accepted').length,
        rejected: applications.filter(a => a.jobId === j._id && a.status === 'rejected').length,
    })).sort((a, b) => b.count - a.count);

    // Timeline data (last 7 days mock — real would use createdAt)
    const timelineDays = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(); date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayApps = applications.filter(a => {
            const d = new Date(a.createdAt);
            return d.toDateString() === date.toDateString();
        }).length;
        timelineDays.push({ day: dayStr, count: dayApps });
    }
    const maxDayApps = Math.max(...timelineDays.map(d => d.count), 1);

    // Funnel
    const funnel = [
        { label: 'Total Applied', count: totalApplications, color: 'bg-violet-500', pct: 100 },
        { label: 'Under Review', count: pendingCount, color: 'bg-amber-500', pct: totalApplications > 0 ? ((pendingCount/totalApplications)*100).toFixed(0) : 0 },
        { label: 'Accepted', count: acceptedCount, color: 'bg-emerald-500', pct: totalApplications > 0 ? ((acceptedCount/totalApplications)*100).toFixed(0) : 0 },
        { label: 'Rejected', count: rejectedCount, color: 'bg-rose-500', pct: totalApplications > 0 ? ((rejectedCount/totalApplications)*100).toFixed(0) : 0 },
    ];

    if (loading) {
        return (
            <div className='bg-background min-h-screen'>
                <Navbar />
                <div className='max-w-7xl mx-auto py-20 flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    <p className='mt-4 text-muted-foreground'>Analyzing your data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <BarChart3 className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Hiring Analytics</h1>
                        <p className='text-sm text-muted-foreground'>Performance overview of your job postings</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                    {[
                        { label: 'Active Jobs', value: totalJobs, icon: Briefcase, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', trend: '+2', up: true },
                        { label: 'Applications', value: totalApplications, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', trend: '+5', up: true },
                        { label: 'Accept Rate', value: `${acceptRate}%`, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '+1.2%', up: true },
                        { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', trend: '-3', up: false },
                    ].map((kpi, i) => {
                        const Icon = kpi.icon;
                        return (
                            <div key={i} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 animate-fade-in-up' style={{opacity:0,animationDelay:`${i*100}ms`}}>
                                <div className='flex items-center justify-between mb-3'>
                                    <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                                    </div>
                                    <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${kpi.up ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'}`}>
                                        {kpi.up ? <ArrowUpRight className='w-3 h-3' /> : <ArrowDownRight className='w-3 h-3' />}
                                        {kpi.trend}
                                    </span>
                                </div>
                                <p className='text-2xl font-extrabold text-foreground'>{kpi.value}</p>
                                <p className='text-xs text-muted-foreground font-medium mt-0.5'>{kpi.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Timeline Chart */}
                    <div className='md:col-span-2 bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='font-bold text-foreground flex items-center gap-2'>
                                <TrendingUp className='w-4 h-4 text-violet-500' /> Applications This Week
                            </h3>
                            <span className='text-xs text-muted-foreground flex items-center gap-1'><Calendar className='w-3 h-3' /> Last 7 days</span>
                        </div>
                        <div className='flex items-end justify-between gap-2 h-40'>
                            {timelineDays.map((d, i) => (
                                <div key={i} className='flex flex-col items-center gap-1 flex-1'>
                                    <span className='text-[10px] font-bold text-foreground'>{d.count}</span>
                                    <div className='w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-indigo-400 transition-all duration-500'
                                        style={{ height: `${Math.max((d.count / maxDayApps) * 120, 4)}px` }}></div>
                                    <span className='text-[9px] text-muted-foreground font-medium mt-1'>{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Funnel */}
                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6'>
                        <h3 className='font-bold text-foreground flex items-center gap-2 mb-4'>
                            <Users className='w-4 h-4 text-violet-500' /> Application Funnel
                        </h3>
                        <div className='space-y-4'>
                            {funnel.map((stage, i) => (
                                <div key={i}>
                                    <div className='flex items-center justify-between mb-1'>
                                        <span className='text-xs font-semibold text-foreground'>{stage.label}</span>
                                        <span className='text-xs font-bold text-muted-foreground'>{stage.count} ({stage.pct}%)</span>
                                    </div>
                                    <div className='h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden'>
                                        <div className={`h-full rounded-full ${stage.color} transition-all duration-700`} style={{ width: `${stage.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Job Performance Table */}
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 mt-6'>
                    <h3 className='font-bold text-foreground flex items-center gap-2 mb-4'>
                        <Briefcase className='w-4 h-4 text-violet-500' /> Job Performance
                    </h3>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b border-gray-100 dark:border-gray-800'>
                                    <th className='text-left text-[11px] text-muted-foreground font-semibold uppercase tracking-wider pb-3 pr-4'>Job Title</th>
                                    <th className='text-center text-[11px] text-muted-foreground font-semibold uppercase tracking-wider pb-3 px-2'>Applications</th>
                                    <th className='text-center text-[11px] text-muted-foreground font-semibold uppercase tracking-wider pb-3 px-2'>Accepted</th>
                                    <th className='text-center text-[11px] text-muted-foreground font-semibold uppercase tracking-wider pb-3 px-2'>Rejected</th>
                                    <th className='text-center text-[11px] text-muted-foreground font-semibold uppercase tracking-wider pb-3'>Funnel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobApps.map((jp, i) => (
                                    <tr key={i} className='border-b border-gray-50 dark:border-gray-800/50 last:border-0'>
                                        <td className='py-3 pr-4'>
                                            <span className='text-sm font-semibold text-foreground'>{jp.title}</span>
                                        </td>
                                        <td className='py-3 text-center'>
                                            <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>{jp.count}</span>
                                        </td>
                                        <td className='py-3 text-center'>
                                            <span className='text-sm font-bold text-emerald-600 dark:text-emerald-400'>{jp.accepted}</span>
                                        </td>
                                        <td className='py-3 text-center'>
                                            <span className='text-sm font-bold text-rose-600 dark:text-rose-400'>{jp.rejected}</span>
                                        </td>
                                        <td className='py-3'>
                                            <div className='w-24 mx-auto h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden'>
                                                <div className='h-full flex'>
                                                    <div className='bg-emerald-500 h-full' style={{ width: `${jp.count > 0 ? (jp.accepted/jp.count)*100 : 0}%` }}></div>
                                                    <div className='bg-rose-500 h-full' style={{ width: `${jp.count > 0 ? (jp.rejected/jp.count)*100 : 0}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {jobApps.length === 0 && (
                            <div className='text-center py-8'>
                                <p className='text-sm text-muted-foreground'>No job data available yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
