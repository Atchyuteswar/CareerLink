import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'

const AppliedJobTable = ({ appliedJobs }) => {
    return (
        <div className='rounded-md border border-border'>
            <Table>
                <TableCaption>A list of your recent applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(!appliedJobs || appliedJobs.length <= 0) ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                You haven't applied to any jobs yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        appliedJobs.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{item.job?.title}</TableCell>
                                <TableCell>{item.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${item?.status === "rejected" ? 'bg-red-400' : item.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                                        {item.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable