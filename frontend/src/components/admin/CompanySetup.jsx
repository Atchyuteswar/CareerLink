import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Building2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { toast } from 'sonner'

const CompanySetup = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/company/get/${params.id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setInput({
                        name: res.data.company.name || "",
                        description: res.data.company.description || "",
                        website: res.data.company.website || "",
                        location: res.data.company.location || "",
                        file: res.data.company.logo || null
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompany();
    }, [params.id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);

        if (input.file && typeof input.file !== 'string') {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.put(`http://localhost:8000/api/v1/company/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-2xl mx-auto my-10 px-4'>
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-black/20'>
                    <form onSubmit={submitHandler}>
                        {/* Header */}
                        <div className='flex items-center gap-4 mb-8'>
                            <Button type="button" onClick={() => navigate("/admin/companies")} variant="outline" size="icon" className="rounded-xl">
                                <ArrowLeft className='w-4 h-4' />
                            </Button>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                                    <Building2 className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                                </div>
                                <div>
                                    <h1 className='font-extrabold text-xl text-foreground'>Company Setup</h1>
                                    <p className='text-sm text-muted-foreground'>Configure your company profile</p>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-6'>
                            {/* Logo */}
                            <div className='flex flex-col items-center gap-3'>
                                <Avatar className="h-24 w-24 ring-4 ring-gray-100 dark:ring-gray-800">
                                    <AvatarImage src={typeof input.file === 'string' ? input.file : null} />
                                    <AvatarFallback className="bg-gradient-to-br from-violet-400 to-indigo-400 text-white text-2xl font-bold">
                                        {input.name?.[0]?.toUpperCase() || 'C'}
                                    </AvatarFallback>
                                </Avatar>
                                <Label className="cursor-pointer text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline">
                                    Upload Logo
                                    <Input type="file" accept="image/*" className="hidden" onChange={changeFileHandler} />
                                </Label>
                            </div>

                            {/* Fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <div className="md:col-span-2">
                                    <Label className='text-sm font-semibold'>Company Name</Label>
                                    <Input type="text" name="name" value={input.name} onChange={changeEventHandler} className="mt-1.5 rounded-xl" />
                                </div>
                                <div className="md:col-span-2">
                                    <Label className='text-sm font-semibold'>Description</Label>
                                    <Textarea name="description" value={input.description} onChange={changeEventHandler} placeholder="Tell us about your company..." className="mt-1.5 rounded-xl" />
                                </div>
                                <div>
                                    <Label className='text-sm font-semibold'>Website</Label>
                                    <Input type="text" name="website" value={input.website} onChange={changeEventHandler} placeholder="https://..." className="mt-1.5 rounded-xl" />
                                </div>
                                <div>
                                    <Label className='text-sm font-semibold'>Location</Label>
                                    <Input type="text" name="location" value={input.location} onChange={changeEventHandler} placeholder="City, Country" className="mt-1.5 rounded-xl" />
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <Button className="w-full mt-8 rounded-xl h-12" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full mt-8 btn-primary rounded-xl h-12 font-semibold text-base">
                                Update Company
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanySetup