import React from 'react'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <Card onClick={() => navigate(`/description/${job._id}`)} className='cursor-pointer hover:shadow-2xl transition-all duration-300 border-gray-200 dark:border-gray-800'>
            <CardHeader className="pb-2">
                <div className='flex justify-between items-start'>
                    <div>
                        <CardTitle className='font-medium text-lg'>{job?.company?.name}</CardTitle>
                        <CardDescription className='text-sm text-gray-500'>India</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>{job?.description}</p>

                <div className='flex items-center gap-2 mt-4'>
                    <Badge className={'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'} variant="outline">{job?.position} Positions</Badge>
                    <Badge className={'text-[#F83002] bg-red-50 hover:bg-red-100 border-red-200'} variant="outline">{job?.jobType}</Badge>
                    <Badge className={'text-[#7209b7] bg-purple-50 hover:bg-purple-100 border-purple-200'} variant="outline">{job?.salary}LPA</Badge>
                </div>
            </CardContent>
        </Card>
    )
}

export default LatestJobCards