import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Textarea } from '../ui/textarea' // Ensure you have this component
import { Avatar, AvatarImage } from '../ui/avatar'

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

    // Fetch existing data
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
                        file: res.data.company.logo || null // Store existing logo URL
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

        // Only append file if it's a new file object (not the URL string)
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
                alert(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-xl mx-auto my-10 px-4'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 mb-5'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='col-span-2 flex flex-col items-center gap-2 mb-4'>
                            <Avatar className="h-24 w-24 border border-gray-200">
                                <AvatarImage src={typeof input.file === 'string' ? input.file : null} />
                            </Avatar>
                            <Label className="cursor-pointer text-blue-600 hover:underline">
                                Upload Logo
                                <Input type="file" accept="image/*" className="hidden" onChange={changeFileHandler} />
                            </Label>
                        </div>

                        <div className="col-span-2">
                            <Label>Company Name</Label>
                            <Input type="text" name="name" value={input.name} onChange={changeEventHandler} />
                        </div>
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea name="description" value={input.description} onChange={changeEventHandler} placeholder="Tell us about your company..." />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input type="text" name="website" value={input.website} onChange={changeEventHandler} placeholder="https://..." />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} placeholder="City, Country" />
                        </div>
                    </div>
                    {loading ? <Button className="w-full mt-8"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full mt-8 bg-[#6A38C2] hover:bg-[#5b30a6]">Update Company</Button>}
                </form>
            </div>
        </div>
    )
}

export default CompanySetup