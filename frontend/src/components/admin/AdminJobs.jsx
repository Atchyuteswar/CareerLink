import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminJobsTable from './AdminJobsTable' // We will update this next
import AdminAnalytics from './AdminAnalytics' // Keep your chart!

const AdminJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/job/getadminjobs", {
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
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between my-5'>
                    <h1 className='font-bold text-2xl text-foreground'>Job Dashboard</h1>
                    <Button onClick={() => navigate("/admin/jobs/create")} className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                        New Job
                    </Button>
                </div>

                {/* Innovation 3: Analytics Chart */}
                <div className='mb-8'>
                    <AdminAnalytics jobs={jobs} />
                </div>

                <div className='flex items-center justify-between my-4'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name or role..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* We pass the jobs down to the table */}
                <AdminJobsTable jobs={filteredJobs} />
            </div>
        </div>
    )
}

export default AdminJobs