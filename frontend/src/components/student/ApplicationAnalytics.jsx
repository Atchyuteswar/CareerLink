import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ApplicationAnalytics = ({ appliedJobs }) => {
    // 1. Calculate Stats from Data
    const stats = {
        applied: appliedJobs.length,
        pending: appliedJobs.filter(job => job.status === 'pending').length,
        accepted: appliedJobs.filter(job => job.status === 'accepted').length,
        rejected: appliedJobs.filter(job => job.status === 'rejected').length,
    };

    // 2. Prepare Data for Chart
    const data = [
        { name: 'Pending', value: stats.pending, color: '#fbbf24' }, // Yellow
        { name: 'Accepted', value: stats.accepted, color: '#22c55e' }, // Green
        { name: 'Rejected', value: stats.rejected, color: '#ef4444' }, // Red
    ];

    // Filter out zero values so empty slices don't show
    const activeData = data.filter(item => item.value > 0);

    return (
        <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full'>
            <h1 className='font-bold text-lg mb-4'>Application Status</h1>
            
            {stats.applied === 0 ? (
                <div className='flex flex-col items-center justify-center h-48 text-gray-400'>
                    <span>No applications yet</span>
                </div>
            ) : (
                <div className='flex items-center'>
                    {/* Chart Side */}
                    <div className='w-1/2 h-48'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={activeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {activeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend Side */}
                    <div className='w-1/2 flex flex-col gap-3 pl-4'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-yellow-400'></div>
                            <span className='text-sm text-gray-600'>Pending: <span className='font-bold text-black'>{stats.pending}</span></span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-green-500'></div>
                            <span className='text-sm text-gray-600'>Accepted: <span className='font-bold text-black'>{stats.accepted}</span></span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-red-500'></div>
                            <span className='text-sm text-gray-600'>Rejected: <span className='font-bold text-black'>{stats.rejected}</span></span>
                        </div>
                        <div className='mt-2 pt-2 border-t border-gray-100'>
                            <span className='text-sm font-bold text-gray-800'>Total: {stats.applied}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationAnalytics;