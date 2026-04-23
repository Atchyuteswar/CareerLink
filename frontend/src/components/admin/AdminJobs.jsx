import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminJobsTable from './AdminJobsTable'
import AdminAnalytics from './AdminAnalytics'
import { Briefcase, Plus, Search } from 'lucide-react'

const AdminJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get("http://100.94.122.76:8000/api/v1/job/getadminjobs", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setJobs(res.data.jobs);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAdminJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto my-8 px-4'>
                {/* Page Header */}
                <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                            <Briefcase className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                        </div>
                        <div>
                            <h1 className='font-extrabold text-2xl text-foreground'>Job Dashboard</h1>
                            <p className='text-sm text-muted-foreground'>{jobs.length} jobs posted</p>
                        </div>
                    </div>
                    <Button onClick={() => navigate("/admin/jobs/create")} className="btn-primary rounded-xl gap-2">
                        <Plus className='w-4 h-4' /> New Job
                    </Button>
                </div>

                {/* Analytics Chart */}
                <AdminAnalytics jobs={jobs} />

                {/* Search */}
                <div className='flex items-center justify-between my-6'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <input
                            type="text"
                            placeholder="Filter by name or role..."
                            onChange={(e) => setSearch(e.target.value)}
                            className='pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all w-64'
                        />
                    </div>
                </div>

                <AdminJobsTable jobs={filteredJobs} />
            </div>
        </div>
    )
}

export default AdminJobs