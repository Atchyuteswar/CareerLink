import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { ModeToggle } from './mode-toggle' // <--- The new toggle
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

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

    return (
        <div className='bg-background border-b border-border transition-colors duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <h1 className='text-2xl font-bold cursor-pointer text-foreground' onClick={() => navigate('/')}>
                        Career<span className='text-[#F83002]'>Link</span>
                    </h1>
                </div>

                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5 text-foreground'>
                        {/* Student / Recruiter Logic */}
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li className='hover:text-primary cursor-pointer'><Link to="/admin/companies">Companies</Link></li>
                                <li className='hover:text-primary cursor-pointer'><Link to="/admin/jobs">Jobs</Link></li>
                                <li className="hover:text-[#6A38C2] cursor-pointer"><Link to="/chat">Messages</Link></li>
                            </>
                        ) : (
                            <>
                                <li className='hover:text-primary cursor-pointer'><Link to="/">Home</Link></li>
                                <li className='hover:text-primary cursor-pointer'><Link to="/jobs">Jobs</Link></li>
                                <li className='hover:text-primary cursor-pointer'><Link to="/saved-jobs">Saved Jobs</Link></li>
                                <li className="hover:text-[#6A38C2] cursor-pointer"><Link to="/chat">Messages</Link></li>
                            </>
                        )}
                    </ul>

                    <div className='flex items-center gap-4'>
                        {/* THEME TOGGLE */}
                        <ModeToggle />

                        {!user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                        <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 mr-4">
                                    <div className='flex gap-4 space-y-2'>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                            <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                            <p className='text-sm text-muted-foreground'>{user?.profile?.bio || "No bio"}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col my-2 text-gray-600'>
                                        {user && user.role === 'student' && (
                                            <div className='flex w-fit items-center gap-2 cursor-pointer mt-2'>
                                                <User size={18} />
                                                <Link to="/profile"><Button variant="link" className="p-0 h-auto">View Profile</Button></Link>
                                            </div>
                                        )}
                                        <div className='flex w-fit items-center gap-2 cursor-pointer mt-2 text-red-600'>
                                            <LogOut size={18} />
                                            <span onClick={logoutHandler} className="text-sm font-medium hover:underline">Logout</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar