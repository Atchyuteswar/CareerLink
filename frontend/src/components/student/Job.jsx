import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Bookmark, MapPin, Clock, IndianRupee, ArrowUpRight, Building2 } from 'lucide-react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days}d ago`;
    }

    const saveJobHandler = async (e) => {
        e.stopPropagation();
        try {
            const res = await axios.post(`http://100.94.122.76:8000/api/v1/job/save/${job._id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsSaved(res.data.isBookmarked);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Please login to save jobs");
        }
    }

    return (
        <div className='group relative bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 card-hover overflow-hidden'>
            {/* Subtle hover gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-violet-500/0 to-indigo-500/0 group-hover:from-violet-500/5 group-hover:to-indigo-500/5 dark:group-hover:from-violet-500/5 dark:group-hover:to-indigo-500/3 transition-all duration-500 rounded-2xl'></div>
            
            <div className='relative'>
                {/* Top Row: Time + Bookmark */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg'>
                        <Clock className='w-3 h-3' />
                        <span>{daysAgoFunction(job?.createdAt)}</span>
                    </div>
                    <button 
                        onClick={saveJobHandler}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110
                            ${isSaved 
                                ? 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400' 
                                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-violet-600 hover:border-violet-200 dark:hover:text-violet-400 dark:hover:border-violet-500/30'
                            }`}
                    >
                        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Company Info */}
                <div className='flex items-center gap-3 mb-4'>
                    <div className='w-11 h-11 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-800'>
                        {job?.company?.logo ? (
                            <img src={job.company.logo} alt="" className='w-full h-full object-cover' />
                        ) : (
                            <Building2 className='w-5 h-5 text-gray-400' />
                        )}
                    </div>
                    <div>
                        <h3 className='font-semibold text-sm text-foreground'>{job?.company?.name}</h3>
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <MapPin className='w-3 h-3' />
                            <span>{job?.location || 'India'}</span>
                        </div>
                    </div>
                </div>

                {/* Job Title & Description */}
                <h2 className='font-bold text-lg text-foreground mb-2'>{job?.title}</h2>
                <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4'>{job?.description}</p>

                {/* Badges */}
                <div className='flex items-center gap-2 flex-wrap mb-5'>
                    <Badge className='badge-blue text-xs font-medium' variant="outline">
                        {job?.position} Positions
                    </Badge>
                    <Badge className='badge-red text-xs font-medium' variant="outline">
                        {job?.jobType}
                    </Badge>
                    <Badge className='badge-purple text-xs font-medium' variant="outline">
                        <IndianRupee className='w-3 h-3 mr-0.5' />{job?.salary} LPA
                    </Badge>
                    {job?.workMode && (
                        <Badge className='badge-green text-xs font-medium' variant="outline">
                            {job.workMode}
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3'>
                    <Button 
                        onClick={() => navigate(`/description/${job._id}`)} 
                        variant="outline" 
                        className="flex-1 rounded-xl border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/5 text-sm font-medium"
                    >
                        View Details
                        <ArrowUpRight className='w-4 h-4 ml-1' />
                    </Button>
                    <Button 
                        onClick={saveJobHandler}
                        className="flex-1 btn-primary rounded-xl text-sm font-medium"
                    >
                        {isSaved ? 'Saved ✓' : 'Save Job'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Job