import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner' // Ensure you have this installed, or use alert
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Badge } from '../ui/badge' // npx shadcn@latest add badge

const Applicants = () => {
    const params = useParams();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/application/${params.id}/applicants`, {
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
            const res = await axios.post(`http://localhost:8000/api/v1/application/status/${id}/update`, { status });
            if (res.data.success) {
                alert(res.data.message);
                // Ideally, you'd update the local state here to avoid a reload, but reload works for now
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Update failed");
        }
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-xl my-5 text-foreground'>Applicants ({applicants.length})</h1>
                <div className='border border-border rounded-md'>
                    <Table>
                        <TableCaption>A list of your recent applicants</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>FullName</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Resume</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicants && applicants.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item?.applicant?.fullname}</TableCell>
                                    <TableCell>{item?.applicant?.email}</TableCell>
                                    <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                    <TableCell>
                                        {item?.applicant?.profile?.resume ? (
                                            <a className="text-blue-600 hover:underline cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </a>
                                        ) : <span className='text-muted-foreground'>NA</span>}
                                    </TableCell>
                                    <TableCell>{item?.createdAt.split("T")[0]}</TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal className='cursor-pointer' />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32 p-0 bg-popover border-border">
                                                <div className='flex flex-col'>
                                                    {["Accepted", "Rejected"].map((status, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => statusHandler(status, item._id)}
                                                            className='flex w-full items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-sm'
                                                        >
                                                            {/* Simple checkmark logic if you want, or just text */}
                                                            <span>{status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Applicants