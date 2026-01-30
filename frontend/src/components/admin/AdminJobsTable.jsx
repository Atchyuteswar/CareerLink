import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminJobsTable = () => { 
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

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

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-200 mt-5">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Company Name</th>
                        <th className="py-2 px-4 border-b text-left">Role</th>
                        <th className="py-2 px-4 border-b text-left">Date Posted</th>
                        <th className="py-2 px-4 border-b text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs?.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{job?.company?.name}</td>
                            <td className="py-2 px-4 border-b">{job?.title}</td>
                            <td className="py-2 px-4 border-b">{job?.createdAt.split("T")[0]}</td>
                            <td className="py-2 px-4 border-b text-right">
                                <button 
                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                    className="bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800">
                                    View Applicants
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminJobsTable