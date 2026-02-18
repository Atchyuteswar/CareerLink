import React, { useState, useContext } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
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

        // THE MOST IMPORTANT LINE:
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Required for files
                },
                withCredentials: true
            });
            if (res.data.success) {
                setUser(res.data.user); // <--- Update Context directly
                setOpen(false);
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="number" className="text-right">Number</Label>
                            <Input id="number" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="bio" className="text-right">Bio</Label>
                            <Input id="bio" name="bio" value={input.bio} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="skills" className="text-right">Skills</Label>
                            <Input id="skills" name="skills" value={input.skills} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        {/* New Fields */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="headline" className="text-right">Headline</Label>
                            <Input id="headline" name="headline" placeholder="Ex: Full Stack Dev" value={input.headline} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="github" className="text-right">GitHub</Label>
                            <Input id="github" name="github" value={input.github} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="linkedin" className="text-right">LinkedIn</Label>
                            <Input id="linkedin" name="linkedin" value={input.linkedin} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="portfolio" className="text-right">Portfolio</Label>
                            <Input id="portfolio" name="portfolio" value={input.portfolio} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="file" className="text-right">Resume</Label>
                        <div className="col-span-3">
                            <Input id="file" name="file" type="file" accept="application/pdf" onChange={fileChangeHandler} />
                            <p className='text-xs text-green-600 mt-1'>
                                * Uploading a resume will auto-fill your skills and bio if left empty.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        {loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6]">Update</Button>}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog