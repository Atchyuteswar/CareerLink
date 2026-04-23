import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Eye, Edit, Trash2, Users } from 'lucide-react'

const AdminJobsTable = ({ jobs }) => { 
    const navigate = useNavigate();

    const deleteJobHandler = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/job/delete/${jobId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                window.location.reload(); 
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Delete failed");
        }
    }

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/80 dark:border-gray-800">
            <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                        <th className="py-3.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                        <th className="py-3.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                        <th className="py-3.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="py-3.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applicants</th>
                        <th className="py-3.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {jobs?.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                                No jobs found
                            </td>
                        </tr>
                    ) : (
                        jobs?.map((job) => (
                            <tr key={job._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="py-3.5 px-4 whitespace-nowrap text-sm font-medium text-foreground">{job?.company?.name}</td>
                                <td className="py-3.5 px-4 whitespace-nowrap text-sm text-muted-foreground">{job?.title}</td>
                                <td className="py-3.5 px-4 whitespace-nowrap text-sm text-muted-foreground">{job?.createdAt.split("T")[0]}</td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                                        ${job.applications.length > 0 
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                                            : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                                        }`}>
                                        <Users className='w-3 h-3' />
                                        {job.applications.length}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                                    <div className='flex justify-end gap-2'>
                                        <button 
                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 px-3 py-1.5 rounded-lg transition-colors">
                                            <Eye className='w-3.5 h-3.5' /> View
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/admin/jobs/${job._id}/edit`)} 
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-lg transition-colors">
                                            <Edit className='w-3.5 h-3.5' /> Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteJobHandler(job._id)} 
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors">
                                            <Trash2 className='w-3.5 h-3.5' /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AdminJobsTable