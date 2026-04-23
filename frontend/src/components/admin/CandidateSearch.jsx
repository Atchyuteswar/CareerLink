import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios'
import { Search, Users, MapPin, Briefcase, FileText, ExternalLink, Filter } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'

const CandidateSearch = () => {
    const [candidates, setCandidates] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const searchCandidates = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (skills) params.append('skills', skills);
            
            const res = await axios.get(`http://localhost:8000/api/v1/user/candidates?${params.toString()}`, {
                withCredentials: true
            });
            if (res.data.success) setCandidates(res.data.candidates);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        searchCandidates();
    }, []);

    return (
        <div className='bg-background text-foreground min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8'>

                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <Users className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Find Candidates</h1>
                        <p className='text-sm text-muted-foreground'>Search through {candidates.length} candidate profiles</p>
                    </div>
                </div>

                {/* Search Controls */}
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 mb-8'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                                placeholder="Search by name or headline..."
                                className='w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                            />
                        </div>
                        <div className='relative'>
                            <Filter className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input type="text" value={skills} onChange={e => setSkills(e.target.value)}
                                placeholder="Filter by skills (React, Node...)"
                                className='w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                            />
                        </div>
                        <Button onClick={searchCandidates} disabled={loading} className='btn-primary rounded-xl gap-2 h-[42px]'>
                            <Search className='w-4 h-4' /> Search
                        </Button>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className='flex justify-center py-16'>
                        <div className='w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    </div>
                ) : candidates.length === 0 ? (
                    <div className='text-center py-16'>
                        <Users className='w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-40' />
                        <p className='text-muted-foreground font-medium'>No candidates found</p>
                        <p className='text-xs text-muted-foreground mt-1'>Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {candidates.map((candidate, i) => (
                            <div key={candidate._id} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 card-hover animate-fade-in-up' style={{opacity:0,animationDelay:`${i*60}ms`}}>
                                <div className='flex items-start gap-4'>
                                    <Avatar className="h-14 w-14 flex-shrink-0">
                                        <AvatarImage src={candidate.profile?.profilePhoto} />
                                        <AvatarFallback className="bg-gradient-to-br from-violet-400 to-indigo-400 text-white font-bold text-lg">
                                            {candidate.fullname?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-bold text-lg text-foreground'>{candidate.fullname}</h3>
                                        {candidate.profile?.headline && (
                                            <p className='text-sm text-violet-600 dark:text-violet-400 font-medium'>{candidate.profile.headline}</p>
                                        )}
                                        <p className='text-xs text-muted-foreground mt-1'>{candidate.email}</p>

                                        {/* Skills */}
                                        {candidate.profile?.skills?.length > 0 && (
                                            <div className='flex flex-wrap gap-1.5 mt-3'>
                                                {candidate.profile.skills.slice(0, 5).map((skill, j) => (
                                                    <Badge key={j} className='text-[10px] bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20' variant="outline">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {candidate.profile.skills.length > 5 && (
                                                    <Badge className='text-[10px]' variant="outline">
                                                        +{candidate.profile.skills.length - 5}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className='flex items-center gap-3 mt-4'>
                                            {candidate.profile?.resume && (
                                                <a href={candidate.profile.resume} target="_blank" rel="noopener noreferrer"
                                                    className='inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline'>
                                                    <FileText className='w-3.5 h-3.5' /> Resume
                                                </a>
                                            )}
                                            <button onClick={() => navigate('/chat')}
                                                className='inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline'>
                                                💬 Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CandidateSearch
