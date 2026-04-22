import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

const AppliedJobTable = ({ appliedJobs }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted':
                return { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20', icon: CheckCircle2 };
            case 'rejected':
                return { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/20', icon: XCircle };
            default:
                return { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20', icon: Clock };
        }
    };

    return (
        <div className='rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden'>
            <Table>
                <TableCaption className='pb-4 text-xs'>Your recent job applications</TableCaption>
                <TableHeader>
                    <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                        <TableHead className='font-semibold text-xs uppercase tracking-wider'>Date</TableHead>
                        <TableHead className='font-semibold text-xs uppercase tracking-wider'>Job Role</TableHead>
                        <TableHead className='font-semibold text-xs uppercase tracking-wider'>Company</TableHead>
                        <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(!appliedJobs || appliedJobs.length <= 0) ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground text-sm">
                                You haven't applied to any jobs yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        appliedJobs.map((item) => {
                            const style = getStatusStyle(item.status);
                            const StatusIcon = style.icon;
                            return (
                                <TableRow key={item._id} className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'>
                                    <TableCell className='text-sm text-muted-foreground'>{item?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className='text-sm font-medium text-foreground'>{item.job?.title}</TableCell>
                                    <TableCell className='text-sm text-muted-foreground'>{item.job?.company?.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={`${style.bg} ${style.text} ${style.border} text-xs font-semibold px-3 py-1 gap-1`} variant="outline">
                                            <StatusIcon className='w-3 h-3' />
                                            {item.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable