import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { 
    Sparkles, Target, TrendingUp, BookOpen, Award, 
    ChevronRight, Zap, Brain, BarChart3, Shield,
    CheckCircle2, AlertCircle, ArrowUpRight, ExternalLink
} from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

// Skill strength meter
const SkillMeter = ({ skill, level, color }) => (
    <div className='space-y-1.5'>
        <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-foreground'>{skill}</span>
            <span className={`text-xs font-bold ${color}`}>{level}%</span>
        </div>
        <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden'>
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ 
                    width: `${level}%`, 
                    background: level >= 70 ? 'linear-gradient(90deg, #10b981, #34d399)' : 
                                level >= 40 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 
                                'linear-gradient(90deg, #ef4444, #f87171)'
                }}
            ></div>
        </div>
    </div>
);

// Radial Score Component
const RadialScore = ({ score, label, size = 120 }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * score) / 100;
    
    const getColor = () => {
        if (score >= 75) return '#10b981';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className='relative flex items-center justify-center' style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                <circle
                    cx={size/2} cy={size/2} r={radius}
                    stroke={getColor()}
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className='absolute flex flex-col items-center'>
                <span className='text-2xl font-extrabold text-foreground'>{score}</span>
                <span className='text-[10px] text-muted-foreground font-medium uppercase tracking-wider'>{label}</span>
            </div>
        </div>
    );
};

const CareerInsights = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Computed Insights
    const [careerScore, setCareerScore] = useState(0);
    const [profileCompleteness, setProfileCompleteness] = useState(0);
    const [skillDemand, setSkillDemand] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [missingSkills, setMissingSkills] = useState([]);
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, appRes] = await Promise.all([
                    axios.get("http://100.94.122.76:8000/api/v1/job/get", { withCredentials: true }),
                    axios.get("http://100.94.122.76:8000/api/v1/application/get", { withCredentials: true })
                ]);
                
                if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
                if (appRes.data.success) setAppliedJobs(appRes.data.application);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!user || jobs.length === 0) return;

        const userSkills = (user.profile?.skills || []).map(s => s.toLowerCase().trim());
        
        // 1. Profile Completeness Score
        let completeness = 0;
        if (user.fullname) completeness += 10;
        if (user.email) completeness += 10;
        if (user.phoneNumber) completeness += 10;
        if (user.profile?.bio) completeness += 15;
        if (user.profile?.headline) completeness += 10;
        if (user.profile?.skills?.length > 0) completeness += 15;
        if (user.profile?.resume) completeness += 15;
        if (user.profile?.github) completeness += 5;
        if (user.profile?.linkedin) completeness += 5;
        if (user.profile?.portfolio) completeness += 5;
        setProfileCompleteness(completeness);

        // 2. Skill Demand Analysis
        const skillCount = {};
        jobs.forEach(job => {
            const reqs = typeof job.requirements === 'string' 
                ? job.requirements.split(',').map(s => s.trim().toLowerCase())
                : (job.requirements || []).map(s => s.toLowerCase());
            reqs.forEach(req => {
                if (req) skillCount[req] = (skillCount[req] || 0) + 1;
            });
        });

        const demandSorted = Object.entries(skillCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([skill, count]) => ({
                skill,
                count,
                hasSkill: userSkills.includes(skill),
                demandPercent: Math.round((count / jobs.length) * 100)
            }));
        setSkillDemand(demandSorted);

        // 3. Missing Skills (top skills user doesn't have)
        const missing = demandSorted.filter(s => !s.hasSkill).slice(0, 5);
        setMissingSkills(missing);

        // 4. Recommended Jobs (matching score)
        const scored = jobs.map(job => {
            const reqs = typeof job.requirements === 'string' 
                ? job.requirements.split(',').map(s => s.trim().toLowerCase())
                : (job.requirements || []).map(s => s.toLowerCase());
            const matched = reqs.filter(r => userSkills.includes(r));
            const score = reqs.length > 0 ? Math.round((matched.length / reqs.length) * 100) : 0;
            return { ...job, matchScore: score, matchedSkills: matched, totalReqs: reqs.length };
        }).filter(j => j.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
        setRecommendedJobs(scored);

        // 5. Career Score (composite)
        const skillMatch = scored.length > 0 ? scored.reduce((acc, j) => acc + j.matchScore, 0) / scored.length : 0;
        const appRate = appliedJobs.length > 0 ? (appliedJobs.filter(a => a.status === 'accepted').length / appliedJobs.length) * 100 : 0;
        const totalScore = Math.round((completeness * 0.4) + (skillMatch * 0.4) + (appRate * 0.2));
        setCareerScore(Math.min(totalScore, 100));

        // 6. Smart Insights
        const smartInsights = [];
        if (completeness < 100) {
            const missing = [];
            if (!user.profile?.bio) missing.push('bio');
            if (!user.profile?.headline) missing.push('headline');
            if (!user.profile?.resume) missing.push('resume');
            if (!user.profile?.github) missing.push('GitHub');
            if (!user.profile?.linkedin) missing.push('LinkedIn');
            if (userSkills.length === 0) missing.push('skills');
            smartInsights.push({
                type: 'warning',
                title: 'Complete Your Profile',
                desc: `Add your ${missing.slice(0, 3).join(', ')} to improve visibility to recruiters.`,
                action: () => navigate('/profile')
            });
        }
        if (missingSkills.length > 0) {
            smartInsights.push({
                type: 'info',
                title: 'Skill Gap Detected',
                desc: `Learning ${missing[0]?.skill} could match you with ${missing[0]?.count}+ more jobs.`,
                action: null
            });
        }
        if (appliedJobs.filter(a => a.status === 'accepted').length > 0) {
            smartInsights.push({
                type: 'success',
                title: 'Strong Application History',
                desc: `${appliedJobs.filter(a => a.status === 'accepted').length} of your applications have been accepted!`,
                action: null
            });
        }
        if (scored.length > 0 && scored[0].matchScore >= 75) {
            smartInsights.push({
                type: 'success',
                title: 'High Match Found!',
                desc: `"${scored[0].title}" has a ${scored[0].matchScore}% skill match — consider applying!`,
                action: () => navigate(`/description/${scored[0]._id}`)
            });
        }
        setInsights(smartInsights);

    }, [user, jobs, appliedJobs, navigate]);

    if (loading) {
        return (
            <div className='bg-background min-h-screen'>
                <Navbar />
                <div className='max-w-7xl mx-auto py-20 flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    <p className='mt-4 text-muted-foreground'>Analyzing your career profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>

                {/* Page Header */}
                <div className='flex items-center gap-3 mb-8 animate-fade-in'>
                    <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20'>
                        <Brain className='w-6 h-6 text-white' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Career Insights</h1>
                        <p className='text-sm text-muted-foreground'>AI-powered analysis of your career readiness</p>
                    </div>
                </div>

                {/* Top Row: Score Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                    {/* Career Readiness Score */}
                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 text-center animate-fade-in-up' style={{opacity:0, animationDelay: '100ms'}}>
                        <div className='flex justify-center mb-4'>
                            <RadialScore score={careerScore} label="Career Score" size={130} />
                        </div>
                        <h3 className='font-bold text-foreground mb-1'>Career Readiness</h3>
                        <p className='text-xs text-muted-foreground'>
                            Based on profile completeness, skill match, and application success
                        </p>
                    </div>

                    {/* Profile Completeness */}
                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 text-center animate-fade-in-up' style={{opacity:0, animationDelay: '200ms'}}>
                        <div className='flex justify-center mb-4'>
                            <RadialScore score={profileCompleteness} label="Profile" size={130} />
                        </div>
                        <h3 className='font-bold text-foreground mb-1'>Profile Strength</h3>
                        <p className='text-xs text-muted-foreground'>
                            {profileCompleteness >= 80 ? "Your profile is strong! 💪" : "Add more details to improve visibility"}
                        </p>
                        {profileCompleteness < 100 && (
                            <Button variant="outline" size="sm" className="mt-3 rounded-lg text-xs" onClick={() => navigate('/profile')}>
                                Complete Profile
                            </Button>
                        )}
                    </div>

                    {/* Stats Summary */}
                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up' style={{opacity:0, animationDelay: '300ms'}}>
                        <h3 className='font-bold text-foreground mb-4 flex items-center gap-2'>
                            <BarChart3 className='w-4 h-4 text-violet-500' />
                            Quick Stats
                        </h3>
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Skills on Profile</span>
                                <span className='font-bold text-foreground'>{user?.profile?.skills?.length || 0}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Total Applications</span>
                                <span className='font-bold text-foreground'>{appliedJobs.length}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Accepted</span>
                                <span className='font-bold text-emerald-500'>{appliedJobs.filter(a => a.status === 'accepted').length}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Matching Jobs</span>
                                <span className='font-bold text-violet-500'>{recommendedJobs.length}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-muted-foreground'>Success Rate</span>
                                <span className='font-bold text-foreground'>
                                    {appliedJobs.length > 0 ? Math.round((appliedJobs.filter(a => a.status === 'accepted').length / appliedJobs.length) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Insights */}
                {insights.length > 0 && (
                    <div className='mb-6 animate-fade-in-up' style={{opacity:0, animationDelay: '400ms'}}>
                        <h2 className='font-bold text-lg text-foreground mb-4 flex items-center gap-2'>
                            <Sparkles className='w-5 h-5 text-violet-500' />
                            Smart Insights
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {insights.map((ins, i) => (
                                <div 
                                    key={i}
                                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                                        ${ins.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20' :
                                          ins.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20' :
                                          'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20'
                                        }`}
                                    onClick={ins.action || undefined}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                        ${ins.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/10' :
                                          ins.type === 'warning' ? 'bg-amber-100 dark:bg-amber-500/10' :
                                          'bg-blue-100 dark:bg-blue-500/10'
                                        }`}>
                                        {ins.type === 'success' ? <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400' /> :
                                         ins.type === 'warning' ? <AlertCircle className='w-4 h-4 text-amber-600 dark:text-amber-400' /> :
                                         <Zap className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                                        }
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h4 className='text-sm font-bold text-foreground'>{ins.title}</h4>
                                        <p className='text-xs text-muted-foreground mt-0.5'>{ins.desc}</p>
                                    </div>
                                    {ins.action && <ChevronRight className='w-4 h-4 text-muted-foreground flex-shrink-0 mt-1' />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom Row: Skills + Recommendations */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                    {/* Skill Demand vs Your Skills */}
                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up' style={{opacity:0, animationDelay: '500ms'}}>
                        <h2 className='font-bold text-lg text-foreground mb-1 flex items-center gap-2'>
                            <Target className='w-5 h-5 text-violet-500' />
                            Market Skill Demand
                        </h2>
                        <p className='text-xs text-muted-foreground mb-5'>How your skills match market demand across {jobs.length} jobs</p>

                        <div className='space-y-4'>
                            {skillDemand.map((item, i) => (
                                <div key={i} className='space-y-1.5'>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-sm font-medium text-foreground capitalize'>{item.skill}</span>
                                            {item.hasSkill && (
                                                <span className='text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold border border-emerald-200 dark:border-emerald-500/20'>
                                                    ✓ YOU HAVE THIS
                                                </span>
                                            )}
                                        </div>
                                        <span className='text-xs text-muted-foreground font-medium'>{item.count} jobs</span>
                                    </div>
                                    <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden'>
                                        <div 
                                            className='h-full rounded-full transition-all duration-1000 ease-out'
                                            style={{ 
                                                width: `${item.demandPercent}%`,
                                                background: item.hasSkill 
                                                    ? 'linear-gradient(90deg, #10b981, #34d399)' 
                                                    : 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {missingSkills.length > 0 && (
                            <div className='mt-6 p-4 rounded-xl bg-violet-50 dark:bg-violet-500/5 border border-violet-200 dark:border-violet-500/20'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <BookOpen className='w-4 h-4 text-violet-600 dark:text-violet-400' />
                                    <h4 className='text-sm font-bold text-violet-700 dark:text-violet-300'>Skills to Learn</h4>
                                </div>
                                <div className='flex flex-wrap gap-1.5'>
                                    {missingSkills.map((s, i) => (
                                        <span key={i} className='text-xs bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 px-2.5 py-1 rounded-lg font-medium border border-violet-200 dark:border-violet-500/20'>
                                            📚 {s.skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Recommended Jobs */}
                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 animate-fade-in-up' style={{opacity:0, animationDelay: '600ms'}}>
                        <h2 className='font-bold text-lg text-foreground mb-1 flex items-center gap-2'>
                            <Award className='w-5 h-5 text-violet-500' />
                            Recommended For You
                        </h2>
                        <p className='text-xs text-muted-foreground mb-5'>Jobs that best match your skill set</p>

                        {recommendedJobs.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-48 text-center'>
                                <div className='w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3'>
                                    <span className='text-2xl'>🔍</span>
                                </div>
                                <span className='text-sm text-muted-foreground font-medium'>No matching jobs found</span>
                                <span className='text-xs text-muted-foreground mt-1'>Add more skills to your profile to get recommendations</span>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {recommendedJobs.map((job, i) => (
                                    <div 
                                        key={job._id}
                                        onClick={() => navigate(`/description/${job._id}`)}
                                        className='group flex items-center gap-4 p-4 rounded-xl border border-gray-200/80 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-500/30 hover:bg-violet-50/50 dark:hover:bg-violet-500/5 cursor-pointer transition-all duration-200'
                                    >
                                        <div className='w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center flex-shrink-0'>
                                            <span className='text-sm font-bold text-violet-600 dark:text-violet-400'>
                                                {job.company?.name?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h4 className='text-sm font-bold text-foreground truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors'>
                                                {job.title}
                                            </h4>
                                            <p className='text-xs text-muted-foreground'>{job.company?.name} • {job.location || 'India'}</p>
                                        </div>
                                        <div className='flex items-center gap-2 flex-shrink-0'>
                                            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold
                                                ${job.matchScore >= 75 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                                                  job.matchScore >= 50 ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                                                  'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                                }`}>
                                                {job.matchScore}%
                                            </div>
                                            <ArrowUpRight className='w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button onClick={() => navigate('/jobs')} variant="outline" className="w-full mt-4 rounded-xl border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 gap-2">
                            View All Jobs <ExternalLink className='w-4 h-4' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerInsights;
