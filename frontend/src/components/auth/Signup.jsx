import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, Briefcase, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.role) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post('http://100.94.122.76:8000/api/v1/user/register', input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-background'>
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8'>
                <div className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10 dark:shadow-black/30 border border-gray-200/50 dark:border-gray-800 animate-scale-in'>
                    
                    {/* Left: Decorative Panel */}
                    <div className='hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white relative overflow-hidden'>
                        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
                        <div className='absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2'></div>
                        
                        <div className='relative z-10'>
                            <div className='w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-8'>
                                <Briefcase className='w-6 h-6' />
                            </div>
                            <h2 className='text-3xl font-extrabold leading-tight'>
                                Start Your Career
                                <br />
                                <span className='text-indigo-200'>Journey Today</span>
                            </h2>
                            <p className='text-indigo-200 mt-4 text-sm leading-relaxed max-w-xs'>
                                Join thousands of professionals and companies on India's fastest growing career platform.
                            </p>
                        </div>

                        <div className='relative z-10 space-y-4'>
                            <div className='flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3'>
                                <div className='w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center'>
                                    <span className='text-sm'>📋</span>
                                </div>
                                <div>
                                    <p className='text-sm font-semibold'>Resume Parser</p>
                                    <p className='text-xs text-indigo-200'>Auto-fill profile from your resume</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3'>
                                <div className='w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center'>
                                    <span className='text-sm'>🎯</span>
                                </div>
                                <div>
                                    <p className='text-sm font-semibold'>AI Skill Match</p>
                                    <p className='text-xs text-indigo-200'>See how you match with jobs</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3'>
                                <div className='w-8 h-8 rounded-lg bg-rose-400/20 flex items-center justify-center'>
                                    <span className='text-sm'>📊</span>
                                </div>
                                <div>
                                    <p className='text-sm font-semibold'>Analytics Dashboard</p>
                                    <p className='text-xs text-indigo-200'>Track your application status</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Signup Form */}
                    <div className='bg-white dark:bg-gray-900 p-8 lg:p-12 flex flex-col justify-center'>
                        <div className='max-w-sm mx-auto w-full'>
                            <div className='mb-8'>
                                <h1 className='text-2xl font-extrabold text-foreground'>Create Account</h1>
                                <p className='text-sm text-muted-foreground mt-2'>Fill in your details to get started</p>
                            </div>

                            <form onSubmit={submitHandler} className='space-y-4'>
                                {/* Full Name */}
                                <div>
                                    <label className='block text-sm font-semibold text-foreground mb-2'>Full Name</label>
                                    <div className='relative'>
                                        <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input 
                                            type="text" 
                                            value={input.fullname} 
                                            name="fullname" 
                                            onChange={changeEventHandler} 
                                            placeholder="John Doe" 
                                            className='w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-foreground placeholder:text-gray-400 input-focus text-sm' 
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className='block text-sm font-semibold text-foreground mb-2'>Email Address</label>
                                    <div className='relative'>
                                        <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input 
                                            type="email" 
                                            value={input.email} 
                                            name="email" 
                                            onChange={changeEventHandler} 
                                            placeholder="you@example.com" 
                                            className='w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-foreground placeholder:text-gray-400 input-focus text-sm' 
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className='block text-sm font-semibold text-foreground mb-2'>Phone Number</label>
                                    <div className='relative'>
                                        <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input 
                                            type="text" 
                                            value={input.phoneNumber} 
                                            name="phoneNumber" 
                                            onChange={changeEventHandler} 
                                            placeholder="9876543210" 
                                            className='w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-foreground placeholder:text-gray-400 input-focus text-sm' 
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className='block text-sm font-semibold text-foreground mb-2'>Password</label>
                                    <div className='relative'>
                                        <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input 
                                            type="password" 
                                            value={input.password} 
                                            name="password" 
                                            onChange={changeEventHandler} 
                                            placeholder="••••••••" 
                                            className='w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-foreground placeholder:text-gray-400 input-focus text-sm' 
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className='block text-sm font-semibold text-foreground mb-3'>I am a</label>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <label 
                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-medium
                                                ${input.role === 'student' 
                                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300' 
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <input type="radio" name="role" value="student" onChange={changeEventHandler} className="hidden" />
                                            <span>🎓</span> Student
                                        </label>
                                        <label 
                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-medium
                                                ${input.role === 'recruiter' 
                                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300' 
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <input type="radio" name="role" value="recruiter" onChange={changeEventHandler} className="hidden" />
                                            <span>💼</span> Recruiter
                                        </label>
                                    </div>
                                </div>

                                {/* Submit */}
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className='w-full btn-primary rounded-xl h-12 text-sm font-semibold'
                                >
                                    {loading ? (
                                        <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Creating Account...</>
                                    ) : (
                                        <>Create Account <ArrowRight className='w-4 h-4 ml-2' /></>
                                    )}
                                </Button>
                            </form>

                            <p className='text-sm text-center text-muted-foreground mt-6'>
                                Already have an account?{' '}
                                <Link to="/login" className='text-violet-600 dark:text-violet-400 font-semibold hover:underline'>
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup