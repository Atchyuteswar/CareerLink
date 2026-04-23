import React, { useContext, useState } from 'react'
import Navbar from '../shared/Navbar'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Settings, Lock, Trash2, User, Shield, LogOut, AlertTriangle, Eye, EyeOff, Loader2, Bell, Moon } from 'lucide-react'

const AccountSettings = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            toast.error("Both passwords are required.");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords don't match.");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        try {
            setChangeLoading(true);
            const res = await axios.post("https://careerlink-1ank.onrender.com/api/v1/user/change-password", {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, { withCredentials: true });
            if (res.data.success) {
                toast.success("Password changed successfully!");
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setChangeLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("⚠️ This will permanently delete your account and all associated data. This cannot be undone. Are you sure?");
        if (!confirmed) return;
        try {
            setDeleteLoading(true);
            const res = await axios.delete("https://careerlink-1ank.onrender.com/api/v1/user/delete-account", { withCredentials: true });
            if (res.data.success) {
                toast.success("Account deleted successfully.");
                setUser(null);
                localStorage.removeItem("user");
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get("https://careerlink-1ank.onrender.com/api/v1/user/logout", { withCredentials: true });
            setUser(null);
            localStorage.removeItem("user");
            navigate('/');
            toast.success("Logged out successfully.");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='bg-background text-foreground min-h-screen'>
            <Navbar />
            <div className='max-w-2xl mx-auto px-4 py-8'>

                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <Settings className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Account Settings</h1>
                        <p className='text-sm text-muted-foreground'>Manage your account preferences and security</p>
                    </div>
                </div>

                {/* Account Info */}
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 mb-6'>
                    <h2 className='font-bold text-foreground mb-4 flex items-center gap-2'>
                        <User className='w-4 h-4 text-violet-500' /> Account Information
                    </h2>
                    <div className='space-y-3'>
                        <div className='flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800'>
                            <span className='text-sm text-muted-foreground'>Name</span>
                            <span className='text-sm font-medium text-foreground'>{user?.fullname}</span>
                        </div>
                        <div className='flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800'>
                            <span className='text-sm text-muted-foreground'>Email</span>
                            <span className='text-sm font-medium text-foreground'>{user?.email}</span>
                        </div>
                        <div className='flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800'>
                            <span className='text-sm text-muted-foreground'>Role</span>
                            <span className='text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 uppercase'>{user?.role}</span>
                        </div>
                        <div className='flex justify-between items-center py-2'>
                            <span className='text-sm text-muted-foreground'>Phone</span>
                            <span className='text-sm font-medium text-foreground'>{user?.phoneNumber}</span>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 mb-6'>
                    <h2 className='font-bold text-foreground mb-4 flex items-center gap-2'>
                        <Lock className='w-4 h-4 text-violet-500' /> Change Password
                    </h2>
                    <form onSubmit={handleChangePassword} className='space-y-4'>
                        <div>
                            <label className='text-sm font-semibold text-foreground mb-1.5 block'>Current Password</label>
                            <div className='relative'>
                                <input type={showPasswords ? 'text' : 'password'} value={passwordForm.currentPassword}
                                    onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all pr-10'
                                    placeholder="Enter current password" />
                                <button type="button" onClick={() => setShowPasswords(!showPasswords)} className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'>
                                    {showPasswords ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                </button>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='text-sm font-semibold text-foreground mb-1.5 block'>New Password</label>
                                <input type={showPasswords ? 'text' : 'password'} value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                                    placeholder="New password" />
                            </div>
                            <div>
                                <label className='text-sm font-semibold text-foreground mb-1.5 block'>Confirm New Password</label>
                                <input type={showPasswords ? 'text' : 'password'} value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                                    placeholder="Confirm new password" />
                            </div>
                        </div>
                        <Button type="submit" disabled={changeLoading} className='btn-primary rounded-xl gap-2'>
                            {changeLoading ? <><Loader2 className='w-4 h-4 animate-spin' /> Changing...</> : <><Shield className='w-4 h-4' /> Update Password</>}
                        </Button>
                    </form>
                </div>

                {/* Logout */}
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 mb-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className='font-bold text-foreground flex items-center gap-2'>
                                <LogOut className='w-4 h-4 text-muted-foreground' /> Sign Out
                            </h2>
                            <p className='text-xs text-muted-foreground mt-0.5'>Sign out of your account on this device</p>
                        </div>
                        <Button variant="outline" onClick={handleLogout} className='rounded-xl'>
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className='bg-white dark:bg-gray-900/80 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-6'>
                    <h2 className='font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2'>
                        <AlertTriangle className='w-4 h-4' /> Danger Zone
                    </h2>
                    <p className='text-sm text-muted-foreground mb-4'>
                        Deleting your account is permanent. All your data, applications, and saved jobs will be lost forever.
                    </p>
                    <Button variant="outline" onClick={handleDeleteAccount} disabled={deleteLoading}
                        className='border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl gap-2'>
                        {deleteLoading ? <><Loader2 className='w-4 h-4 animate-spin' /> Deleting...</> : <><Trash2 className='w-4 h-4' /> Delete Account</>}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings
