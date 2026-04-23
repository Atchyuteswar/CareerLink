import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, Users, CheckCircle2, XCircle, FileText } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Badge } from '../ui/badge'

const Applicants = () => {
    const params = useParams();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`http://100.94.122.76:8000/api/v1/application/${params.id}/applicants`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setApplicants(res.data.job.applications);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, [params.id]);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`http://100.94.122.76:8000/api/v1/application/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
                // Update local state
                setApplicants(prev => prev.map(app => 
                    app._id === id ? { ...app, status: status.toLowerCase() } : app
                ));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-8 px-4'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <Users className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Applicants</h1>
                        <p className='text-sm text-muted-foreground'>{applicants.length} candidates applied</p>
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden'>
                    <Table>
                        <TableCaption className='pb-4 text-xs'>Review and manage applicants</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Full Name</TableHead>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Email</TableHead>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Contact</TableHead>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Resume</TableHead>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Date</TableHead>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Status</TableHead>
                                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground text-sm">
                                        No applicants yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applicants.map((item) => (
                                    <TableRow key={item._id} className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'>
                                        <TableCell className='font-medium text-foreground'>{item?.applicant?.fullname}</TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>{item?.applicant?.email}</TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>{item?.applicant?.phoneNumber}</TableCell>
                                        <TableCell>
                                            {item?.applicant?.profile?.resume ? (
                                                <a 
                                                    className="inline-flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:underline text-sm font-medium" 
                                                    href={item?.applicant?.profile?.resume} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    <FileText className='w-3.5 h-3.5' />
                                                    {item?.applicant?.profile?.resumeOriginalName || 'View'}
                                                </a>
                                            ) : <span className='text-muted-foreground text-sm'>N/A</span>}
                                        </TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>{item?.createdAt.split("T")[0]}</TableCell>
                                        <TableCell>
                                            <Badge className={`text-xs font-semibold px-2.5 py-0.5 ${
                                                item.status === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                                item.status === 'rejected' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' :
                                                'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                            }`} variant="outline">
                                                {item.status?.toUpperCase() || 'PENDING'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger>
                                                    <div className='w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors cursor-pointer'>
                                                        <MoreHorizontal className='w-4 h-4 text-muted-foreground' />
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-40 p-2 rounded-xl">
                                                    <button
                                                        onClick={() => statusHandler("Accepted", item._id)}
                                                        className='flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 transition-colors'
                                                    >
                                                        <CheckCircle2 className='w-4 h-4' /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => statusHandler("Rejected", item._id)}
                                                        className='flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 transition-colors'
                                                    >
                                                        <XCircle className='w-4 h-4' /> Reject
                                                    </button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Applicants