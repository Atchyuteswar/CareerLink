import React, { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { LogOut, User, Briefcase, Building2, MessageSquare, Home, BookmarkCheck, Search, Brain, Users, Settings } from 'lucide-react'

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', {
                withCredentials: true
            });
            if (res.data.success) {
                setUser(null);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children, icon: Icon }) => (
        <Link to={to} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
            ${isActive(to) 
                ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10' 
                : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </Link>
    );

    return (
        <nav className='glass-nav sticky top-0 z-50 transition-all duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo */}
                <div className='flex items-center gap-2 cursor-pointer group' onClick={() => navigate('/')}>
                    <div className='w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300'>
                        <Briefcase className='w-5 h-5 text-white' />
                    </div>
                    <h1 className='text-xl font-bold text-foreground tracking-tight'>
                        Career<span className='gradient-text'>Link</span>
                    </h1>
                </div>

                {/* Navigation Links */}
                <div className='hidden md:flex items-center gap-1'>
                    {user && user.role === 'recruiter' ? (
                        <>
                            <NavLink to="/admin/companies" icon={Building2}>Companies</NavLink>
                            <NavLink to="/admin/jobs" icon={Briefcase}>Jobs</NavLink>
                            <NavLink to="/admin/candidates" icon={Users}>Candidates</NavLink>
                            <NavLink to="/chat" icon={MessageSquare}>Messages</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" icon={Home}>Home</NavLink>
                            <NavLink to="/jobs" icon={Search}>Jobs</NavLink>
                            <NavLink to="/saved-jobs" icon={BookmarkCheck}>Saved</NavLink>
                            <NavLink to="/career-insights" icon={Brain}>Insights</NavLink>
                            <NavLink to="/chat" icon={MessageSquare}>Messages</NavLink>
                        </>
                    )}
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-3'>
                    <ModeToggle />

                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login">
                                <Button variant="ghost" className="text-sm font-medium hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="btn-primary text-sm font-medium rounded-xl px-5">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="relative cursor-pointer group">
                                    <Avatar className="h-9 w-9 ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all duration-300">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-semibold text-sm">
                                            {user?.fullname?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-950"></span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-0 rounded-xl shadow-xl border-gray-200/50 dark:border-gray-800" align="end">
                                {/* User Info Header */}
                                <div className='p-4 border-b border-gray-100 dark:border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className="h-11 w-11">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-semibold">
                                                {user?.fullname?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='min-w-0'>
                                            <h4 className='font-semibold text-sm text-foreground truncate'>{user?.fullname}</h4>
                                            <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
                                            {user?.profile?.headline && (
                                                <p className='text-xs text-violet-600 dark:text-violet-400 mt-0.5 truncate'>{user?.profile?.headline}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Actions */}
                                <div className='p-2'>
                                    {user && user.role === 'student' && (
                                        <button 
                                            onClick={() => navigate('/profile')} 
                                            className='flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
                                        >
                                            <User className="w-4 h-4" />
                                            <span>View Profile</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => navigate('/settings')} 
                                        className='flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                    <button 
                                        onClick={logoutHandler} 
                                        className='flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors'
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar