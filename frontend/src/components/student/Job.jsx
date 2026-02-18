import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const saveJobHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/job/save/${job._id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsSaved(res.data.isBookmarked);
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='p-5 rounded-md shadow-sm bg-card text-card-foreground border border-border hover:shadow-lg transition-all duration-300'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button variant="outline" className="rounded-full" size="icon" onClick={saveJobHandler}>
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-black dark:fill-white' : ''}`} />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-muted-foreground'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-muted-foreground line-clamp-2'>{job?.description}</p>
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job._id}`)} variant="outline" className="w-full">Details</Button>
                <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job