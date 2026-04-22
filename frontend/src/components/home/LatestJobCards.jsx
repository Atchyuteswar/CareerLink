import React from 'react'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, IndianRupee, ArrowUpRight } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const daysAgo = () => {
        if (!job?.createdAt) return '';
        const diff = Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        return `${diff}d ago`;
    };

    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='group relative bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 cursor-pointer card-hover overflow-hidden'
        >
            {/* Subtle gradient accent on hover */}
            <div className='absolute inset-0 bg-gradient-to-br from-violet-500/0 to-indigo-500/0 group-hover:from-violet-500/5 group-hover:to-indigo-500/5 dark:group-hover:from-violet-500/5 dark:group-hover:to-indigo-500/3 transition-all duration-500 rounded-2xl'></div>
            
            <div className='relative'>
                {/* Header: Company + Time */}
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        {job?.company?.logo ? (
                            <img src={job.company.logo} alt="" className='w-11 h-11 rounded-xl object-cover border border-gray-100 dark:border-gray-800' />
                        ) : (
                            <div className='w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center'>
                                <span className='text-lg font-bold text-violet-600 dark:text-violet-400'>
                                    {job?.company?.name?.[0]?.toUpperCase() || 'C'}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className='font-semibold text-sm text-foreground'>{job?.company?.name}</h3>
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <MapPin className='w-3 h-3' />
                                <span>{job?.location || 'India'}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-1 text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md'>
                        <Clock className='w-3 h-3' />
                        <span>{daysAgo()}</span>
                    </div>
                </div>

                {/* Job Title & Description */}
                <h2 className='font-bold text-lg text-foreground mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors'>
                    {job?.title}
                    <ArrowUpRight className='inline-block w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity' />
                </h2>
                <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4'>
                    {job?.description}
                </p>

                {/* Badges */}
                <div className='flex items-center gap-2 flex-wrap'>
                    <Badge className='badge-blue text-xs font-medium' variant="outline">
                        {job?.position} Positions
                    </Badge>
                    <Badge className='badge-red text-xs font-medium' variant="outline">
                        {job?.jobType}
                    </Badge>
                    <Badge className='badge-purple text-xs font-medium' variant="outline">
                        <IndianRupee className='w-3 h-3 mr-0.5' />
                        {job?.salary} LPA
                    </Badge>
                    {job?.workMode && (
                        <Badge className='badge-green text-xs font-medium' variant="outline">
                            {job.workMode}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards