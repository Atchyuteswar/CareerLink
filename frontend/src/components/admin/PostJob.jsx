import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        benefits: "",
        workMode: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/company/get", { withCredentials: true });
                if (res.data.success) setCompanies(res.data.companies);
            } catch (error) { console.log(error); }
        }
        fetchCompanies();
    }, []);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8000/api/v1/job/post", input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                alert(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5 px-4'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-border shadow-lg rounded-md bg-card text-card-foreground'>
                    <h1 className='font-bold text-2xl mb-5'>Post a New Job</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label>Title</Label>
                            <Input name="title" value={input.title} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input name="description" value={input.description} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input name="requirements" value={input.requirements} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input name="salary" value={input.salary} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input name="location" value={input.location} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input name="jobType" value={input.jobType} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input name="experience" value={input.experience} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} className="my-1" />
                        </div>
                        <div>
                            <Label>Work Mode</Label>
                            <Select onValueChange={(value) => setInput({ ...input, workMode: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Work Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='col-span-1 md:col-span-2'>
                            <Label>Benefits</Label>
                            <Input name="benefits" value={input.benefits} onChange={changeEventHandler} placeholder="Health Insurance, Stock Options, Free Lunch..." className="my-1" />
                        </div>
                        {companies.length > 0 && (
                            <div className='col-span-1 md:col-span-2'>
                                <Label>Company</Label>
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <Button className="w-full mt-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
                    ) : (
                        <Button type="submit" className="w-full mt-4 bg-[#6A38C2] hover:bg-[#5b30a6]">Post Job</Button>
                    )}

                    {companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center mt-3'>* Please register a company first before posting a job</p>}
                </form>
            </div>
        </div>
    )
}

export default PostJob