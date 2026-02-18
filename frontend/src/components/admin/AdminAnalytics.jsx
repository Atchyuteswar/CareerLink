import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminAnalytics = ({ jobs }) => {
    // 1. Prepare Data: Map jobs to { name: "Job Title", applicants: count }
    const data = jobs.map(job => ({
        name: job.title,
        applicants: job.applications ? job.applications.length : 0
    }));

    return (
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6'>
            <h1 className='font-bold text-lg mb-4 text-gray-700'>Applicant Traffic</h1>
            
            {data.length === 0 ? (
                <div className='h-64 flex items-center justify-center text-gray-400'>
                    No jobs posted yet.
                </div>
            ) : (
                <div className='h-64 w-full'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#6b7280', fontSize: 12}}
                                interval={0} // Show all labels
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#6b7280', fontSize: 12}} 
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{fill: '#f3f4f6'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="applicants" fill="#6A38C2" radius={[4, 4, 0, 0]} barSize={50}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6A38C2' : '#8b5cf6'} />
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