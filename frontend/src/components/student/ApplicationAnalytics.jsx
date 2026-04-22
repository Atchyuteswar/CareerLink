import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';

const ApplicationAnalytics = ({ appliedJobs }) => {
    const stats = {
        applied: appliedJobs.length,
        pending: appliedJobs.filter(job => job.status === 'pending').length,
        accepted: appliedJobs.filter(job => job.status === 'accepted').length,
        rejected: appliedJobs.filter(job => job.status === 'rejected').length,
    };

    const data = [
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        { name: 'Accepted', value: stats.accepted, color: '#10b981' },
        { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
    ];

    const activeData = data.filter(item => item.value > 0);

    const statItems = [
        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', dotColor: 'bg-amber-400' },
        { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dotColor: 'bg-emerald-500' },
        { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', dotColor: 'bg-rose-500' },
    ];

    return (
        <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 p-6 rounded-2xl h-full'>
            <div className='flex items-center gap-2 mb-5'>
                <TrendingUp className='w-5 h-5 text-violet-500' />
                <h1 className='font-bold text-lg text-foreground'>Application Status</h1>
            </div>
            
            {stats.applied === 0 ? (
                <div className='flex flex-col items-center justify-center h-48 text-center'>
                    <div className='w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3'>
                        <span className='text-2xl'>📋</span>
                    </div>
                    <span className='text-muted-foreground font-medium'>No applications yet</span>
                    <span className='text-xs text-muted-foreground mt-1'>Start applying to see your stats</span>
                </div>
            ) : (
                <>
                    {/* Chart */}
                    <div className='h-48 w-full mb-4'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={activeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={4}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {activeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats Grid */}
                    <div className='space-y-3'>
                        {statItems.map((item) => (
                            <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl ${item.bg}`}>
                                <div className='flex items-center gap-2.5'>
                                    <div className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`}></div>
                                    <span className='text-sm font-medium text-foreground'>{item.label}</span>
                                </div>
                                <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                            </div>
                        ))}
                        <div className='flex items-center justify-between p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200/50 dark:border-violet-500/20'>
                            <span className='text-sm font-semibold text-violet-700 dark:text-violet-300'>Total Applications</span>
                            <span className='text-lg font-extrabold text-violet-600 dark:text-violet-400'>{stats.applied}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ApplicationAnalytics;