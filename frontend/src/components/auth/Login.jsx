import React, { useState, useContext } from 'react'
import Navbar from '../shared/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'sonner'
import { Loader2, Briefcase, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.email || !input.password || !input.role) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                setUser(res.data.user);
                toast.success(res.data.message);
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin/companies");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-background'>
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)] px-4'>
                <div className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10 dark:shadow-black/30 border border-gray-200/50 dark:border-gray-800 animate-scale-in'>
                    
                    {/* Left: Decorative Panel */}
                    <div className='hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden'>
                        {/* Background decoration */}
                        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
                        <div className='absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2'></div>
                        
                        <div className='relative z-10'>
                            <div className='w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-8'>
                                <Briefcase className='w-6 h-6' />
                            </div>
                            <h2 className='text-3xl font-extrabold leading-tight'>
                                Welcome Back to
                                <br />
                                <span className='text-violet-200'>CareerLink</span>
                            </h2>
                            <p className='text-violet-200 mt-4 text-sm leading-relaxed max-w-xs'>
                                Sign in to access your dashboard, track applications, and discover new opportunities tailored for you.
                            </p>
                        </div>

                        <div className='relative z-10 space-y-4'>
                            <div className='flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3'>
                                <div className='w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center'>
                                    <span className='text-sm'>📊</span>
                                </div>
                                <div>
                                    <p className='text-sm font-semibold'>Smart Matching</p>
                                    <p className='text-xs text-violet-200'>AI-powered job recommendations</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3'>
                                <div className='w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center'>
                                    <span className='text-sm'>💬</span>
                                </div>
                                <div>
                                    <p className='text-sm font-semibold'>Direct Chat</p>
                                    <p className='text-xs text-violet-200'>Message recruiters instantly</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Login Form */}
                    <div className='bg-white dark:bg-gray-900 p-8 lg:p-12 flex flex-col justify-center'>
                        <div className='max-w-sm mx-auto w-full'>
                            <div className='mb-8'>
                                <h1 className='text-2xl font-extrabold text-foreground'>Sign In</h1>
                                <p className='text-sm text-muted-foreground mt-2'>Enter your credentials to access your account</p>
                            </div>

                            <form onSubmit={submitHandler} className='space-y-5'>
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
                                        <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Signing in...</>
                                    ) : (
                                        <>Sign In <ArrowRight className='w-4 h-4 ml-2' /></>
                                    )}
                                </Button>
                            </form>

                            <p className='text-sm text-center text-muted-foreground mt-6'>
                                Don't have an account?{' '}
                                <Link to="/signup" className='text-violet-600 dark:text-violet-400 font-semibold hover:underline'>
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login