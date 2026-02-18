import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminJobsTable = ({ jobs, setJobs }) => { 
    const navigate = useNavigate();

    // DELETE FUNCTION
    const deleteJobHandler = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/job/delete/${jobId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                alert(res.data.message);
                // Refresh the list immediately in the UI
                window.location.reload(); 
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Delete failed");
        }
    }

    return (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {jobs?.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{job?.company?.name}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{job?.title}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{job?.createdAt.split("T")[0]}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.applications.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {job.applications.length}
                                </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className='flex justify-end gap-2'>
                                    {/* View Applicants */}
                                    <button 
                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                        className="text-blue-600 hover:text-blue-900 border border-blue-200 px-2 py-1 rounded">
                                        View
                                    </button>

                                    {/* EDIT BUTTON */}
                                    <button 
                                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)} 
                                        className="text-green-600 hover:text-green-900 border border-green-200 px-2 py-1 rounded">
                                        Edit
                                    </button>

                                    {/* DELETE BUTTON */}
                                    <button 
                                        onClick={() => deleteJobHandler(job._id)} 
                                        className="text-red-600 hover:text-red-900 border border-red-200 px-2 py-1 rounded">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminJobsTable