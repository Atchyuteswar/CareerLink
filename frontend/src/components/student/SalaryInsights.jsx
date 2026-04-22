import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { IndianRupee, TrendingUp, BarChart3, MapPin, Briefcase, ArrowUpRight, Filter } from 'lucide-react'

const SalaryInsights = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/job/get", { withCredentials: true });
                if (res.data.success) setJobs(res.data.jobs);
            } catch (error) { console.log(error); }
            finally { setLoading(false); }
        };
        fetchJobs();
    }, []);

    // Compute insights from real job data
    const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => j.jobType?.toLowerCase().includes(filter));
    const salaries = filteredJobs.map(j => j.salary).filter(s => s > 0).sort((a, b) => a - b);
    const avgSalary = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
    const minSalary = salaries[0] || 0;
    const maxSalary = salaries[salaries.length - 1] || 0;
    const medianSalary = salaries.length > 0 ? salaries[Math.floor(salaries.length / 2)] : 0;

    // Salary by job type
    const byType = {};
    jobs.forEach(j => {
        const type = j.jobType || 'Other';
        if (!byType[type]) byType[type] = [];
        byType[type].push(j.salary);
    });
    const typeData = Object.entries(byType).map(([type, sals]) => ({
        type,
        avg: Math.round(sals.reduce((a, b) => a + b, 0) / sals.length),
        count: sals.length
    })).sort((a, b) => b.avg - a.avg);

    // Salary by location
    const byLocation = {};
    jobs.forEach(j => {
        const loc = j.location || 'Other';
        if (!byLocation[loc]) byLocation[loc] = [];
        byLocation[loc].push(j.salary);
    });
    const locationData = Object.entries(byLocation).map(([loc, sals]) => ({
        location: loc,
        avg: Math.round(sals.reduce((a, b) => a + b, 0) / sals.length),
        count: sals.length
    })).sort((a, b) => b.avg - a.avg);

    // Top paying jobs
    const topJobs = [...jobs].sort((a, b) => b.salary - a.salary).slice(0, 5);

    const formatSalary = (val) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
        return `₹${val}`;
    };

    return (
        <div className='bg-background text-foreground min-h-screen'>
            <Navbar />

            <section className='max-w-6xl mx-auto px-4 py-12'>
                <div className='text-center mb-10'>
                    <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>Compensation</span>
                    <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight mt-2 mb-3'>
                        Salary <span className='gradient-text'>Insights</span>
                    </h1>
                    <p className='text-muted-foreground max-w-lg mx-auto'>
                        Real salary data from {jobs.length} job listings on CareerLink. Know your worth.
                    </p>
                </div>

                {loading ? (
                    <div className='flex justify-center py-16'>
                        <div className='w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    </div>
                ) : (
                    <>
                        {/* Overview Cards */}
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                            {[
                                { label: 'Average Salary', value: formatSalary(avgSalary), icon: BarChart3, color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-500/10' },
                                { label: 'Minimum', value: formatSalary(minSalary), icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-500/10' },
                                { label: 'Maximum', value: formatSalary(maxSalary), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
                                { label: 'Median', value: formatSalary(medianSalary), icon: IndianRupee, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/10' },
                            ].map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 animate-fade-in-up' style={{opacity:0,animationDelay:`${i*100}ms`}}>
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                                            <Icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                        <p className='text-2xl font-extrabold text-foreground'>{stat.value}</p>
                                        <p className='text-xs text-muted-foreground font-medium'>{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                            {/* By Job Type */}
                            <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6'>
                                <h2 className='font-bold text-lg text-foreground mb-1 flex items-center gap-2'>
                                    <Briefcase className='w-5 h-5 text-violet-500' /> Salary by Job Type
                                </h2>
                                <p className='text-xs text-muted-foreground mb-5'>Average compensation by employment type</p>
                                <div className='space-y-4'>
                                    {typeData.map((item, i) => (
                                        <div key={i} className='flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                                                    <Briefcase className='w-4 h-4 text-violet-500' />
                                                </div>
                                                <div>
                                                    <p className='text-sm font-semibold text-foreground'>{item.type}</p>
                                                    <p className='text-[11px] text-muted-foreground'>{item.count} positions</p>
                                                </div>
                                            </div>
                                            <span className='text-sm font-bold text-foreground'>{formatSalary(item.avg)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* By Location */}
                            <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6'>
                                <h2 className='font-bold text-lg text-foreground mb-1 flex items-center gap-2'>
                                    <MapPin className='w-5 h-5 text-violet-500' /> Salary by Location
                                </h2>
                                <p className='text-xs text-muted-foreground mb-5'>Average compensation by city</p>
                                <div className='space-y-4'>
                                    {locationData.map((item, i) => (
                                        <div key={i}>
                                            <div className='flex justify-between items-center mb-1'>
                                                <span className='text-sm font-medium text-foreground'>{item.location}</span>
                                                <span className='text-sm font-bold text-foreground'>{formatSalary(item.avg)}</span>
                                            </div>
                                            <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden'>
                                                <div className='h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700'
                                                    style={{ width: `${maxSalary > 0 ? (item.avg / maxSalary) * 100 : 0}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Paying Jobs */}
                        <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6'>
                            <h2 className='font-bold text-lg text-foreground mb-5 flex items-center gap-2'>
                                <TrendingUp className='w-5 h-5 text-emerald-500' /> Top Paying Jobs
                            </h2>
                            <div className='space-y-3'>
                                {topJobs.map((job, i) => (
                                    <div key={job._id} className='flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors'>
                                        <div className='flex items-center gap-3'>
                                            <span className='w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/20 dark:to-amber-400/10 flex items-center justify-center text-sm font-bold text-amber-700 dark:text-amber-400'>
                                                #{i + 1}
                                            </span>
                                            <div>
                                                <p className='text-sm font-bold text-foreground'>{job.title}</p>
                                                <p className='text-xs text-muted-foreground'>{job.company?.name} • {job.location}</p>
                                            </div>
                                        </div>
                                        <span className='text-sm font-extrabold text-emerald-600 dark:text-emerald-400'>{formatSalary(job.salary)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </section>

            <Footer />
        </div>
    )
}

export default SalaryInsights
