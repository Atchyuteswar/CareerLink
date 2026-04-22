import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

const AdminAnalytics = ({ jobs }) => {
    const data = jobs.map(job => ({
        name: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
        applicants: job.applications ? job.applications.length : 0
    }));

    const colors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6366f1', '#818cf8', '#c084fc'];

    return (
        <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 p-6 rounded-2xl mb-6'>
            <div className='flex items-center gap-2 mb-5'>
                <BarChart3 className='w-5 h-5 text-violet-500' />
                <h1 className='font-bold text-lg text-foreground'>Applicant Traffic</h1>
            </div>
            
            {data.length === 0 ? (
                <div className='h-64 flex flex-col items-center justify-center text-center'>
                    <div className='w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3'>
                        <span className='text-2xl'>📊</span>
                    </div>
                    <span className='text-muted-foreground font-medium'>No jobs posted yet</span>
                    <span className='text-xs text-muted-foreground mt-1'>Post a job to see analytics</span>
                </div>
            ) : (
                <div className='h-72 w-full'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: 'currentColor', fontSize: 12, opacity: 0.6}}
                                interval={0}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: 'currentColor', fontSize: 12, opacity: 0.6}} 
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{fill: 'currentColor', fillOpacity: 0.05}}
                                contentStyle={{ 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                }}
                            />
                            <Bar dataKey="applicants" radius={[8, 8, 0, 0]} barSize={45}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;