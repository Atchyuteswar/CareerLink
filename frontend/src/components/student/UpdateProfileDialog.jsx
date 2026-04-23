import React, { useState, useContext } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(AuthContext); 
    const USER_API_END_POINT = "http://localhost:8000/api/v1/user";

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        headline: user?.profile?.headline || "",
        github: user?.profile?.github || "",
        linkedin: user?.profile?.linkedin || "",
        portfolio: user?.profile?.portfolio || "",
        file: user?.profile?.resume || ""
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        formData.append("headline", input.headline);
        formData.append("github", input.github);
        formData.append("linkedin", input.linkedin);
        formData.append("portfolio", input.portfolio);

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                setUser(res.data.user);
                setOpen(false);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl border-gray-200/80 dark:border-gray-800 p-0 overflow-hidden" onInteractOutside={() => setOpen(false)}>
                {/* Header with gradient */}
                <div className='bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5'>
                    <DialogTitle className='text-white text-lg font-bold'>Update Profile</DialogTitle>
                    <p className='text-violet-200 text-sm mt-1'>Keep your information up to date</p>
                </div>
                
                <form onSubmit={submitHandler} className='px-6 pb-6'>
                    <div className='grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2'>
                        {/* Basic Info */}
                        <div className='space-y-3'>
                            <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Basic Info</h3>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="name" className="text-right text-sm font-medium">Name</Label>
                                <Input id="name" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="email" className="text-right text-sm font-medium">Email</Label>
                                <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="number" className="text-right text-sm font-medium">Phone</Label>
                                <Input id="number" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800'>
                            <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2'>Professional</h3>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="headline" className="text-right text-sm font-medium">Title</Label>
                                <Input id="headline" name="headline" placeholder="Ex: Full Stack Dev" value={input.headline} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="bio" className="text-right text-sm font-medium">Bio</Label>
                                <Input id="bio" name="bio" value={input.bio} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="skills" className="text-right text-sm font-medium">Skills</Label>
                                <Input id="skills" name="skills" placeholder="React, Node, Python..." value={input.skills} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                        </div>

                        {/* Links */}
                        <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800'>
                            <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2'>Links</h3>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="github" className="text-right text-sm font-medium">GitHub</Label>
                                <Input id="github" name="github" placeholder="https://github.com/..." value={input.github} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="linkedin" className="text-right text-sm font-medium">LinkedIn</Label>
                                <Input id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." value={input.linkedin} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="portfolio" className="text-right text-sm font-medium">Portfolio</Label>
                                <Input id="portfolio" name="portfolio" placeholder="https://..." value={input.portfolio} onChange={changeEventHandler} className="col-span-3 rounded-xl" />
                            </div>
                        </div>

                        {/* Resume */}
                        <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800'>
                            <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2'>Resume</h3>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="file" className="text-right text-sm font-medium">Upload</Label>
                                <div className="col-span-3">
                                    <Input id="file" name="file" type="file" accept="application/pdf" onChange={fileChangeHandler} className="rounded-xl" />
                                    <p className='text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium'>
                                        ✨ Uploading a resume will auto-fill your skills and bio
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        {loading ? (
                            <Button className="w-full rounded-xl h-11" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full btn-primary rounded-xl h-11 font-semibold">
                                Save Changes
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog