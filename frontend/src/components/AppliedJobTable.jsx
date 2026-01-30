import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AppliedJobTable = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/application/get", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setAppliedJobs(res.data.application);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    }, []);

    return (
        <div>
            <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Date</th>
                        <th className="py-2 px-4 border-b text-left">Job Role</th>
                        <th className="py-2 px-4 border-b text-left">Company</th>
                        <th className="py-2 px-4 border-b text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appliedJobs.length <= 0 ? <span>You haven't applied to any job yet.</span> : appliedJobs.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{item?.createdAt.split("T")[0]}</td>
                            <td className="py-2 px-4 border-b">{item.job?.title}</td>
                            <td className="py-2 px-4 border-b">{item.job?.company?.name}</td>
                            <td className="py-2 px-4 border-b text-right">
                                <span className={`${item.status === "rejected" ? 'bg-red-500' : item.status === 'pending' ? 'bg-gray-400' : 'bg-green-600'} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                                    {item.status.toUpperCase()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AppliedJobTable