import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader2, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

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
                toast.success("Job posted successfully!");
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='flex items-center justify-center w-full my-8 px-4'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl w-full bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-black/20 rounded-2xl'>
                    <div className='flex items-center gap-3 mb-8'>
                        <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                            <PlusCircle className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                        </div>
                        <div>
                            <h1 className='font-extrabold text-2xl text-foreground'>Post a New Job</h1>
                            <p className='text-sm text-muted-foreground'>Fill in the details to create a new listing</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div>
                            <Label className='text-sm font-semibold'>Job Title</Label>
                            <Input name="title" value={input.title} onChange={changeEventHandler} className="mt-1.5 rounded-xl" placeholder="e.g. Frontend Developer" />
                        </div>
                        <div>
                            <Label className='text-sm font-semibold'>Location</Label>
                            <Input name="location" value={input.location} onChange={changeEventHandler} className="mt-1.5 rounded-xl" placeholder="e.g. Bangalore" />
                        </div>
                        <div className='md:col-span-2'>
                            <Label className='text-sm font-semibold'>Description</Label>
                            <Input name="description" value={input.description} onChange={changeEventHandler} className="mt-1.5 rounded-xl" placeholder="Describe the role..." />
                        </div>
                        <div>
                            <Label className='text-sm font-semibold'>Requirements</Label>
                            <Input name="requirements" value={input.requirements} onChange={changeEventHandler} className="mt-1.5 rounded-xl" placeholder="React, Node.js, MongoDB..." />
                        </div>
                        <div>
                            <Label className='text-sm font-semibold'>Salary (LPA)</Label>
                            <Input name="salary" value={input.salary} onChange={changeEventHandler} className="mt-1.5 rounded-xl" placeholder="e.g. 8" />
                        </div>
                        <div>
                            <Label className='text-sm font-semibold'>Job Type</Label>
                            <Input name="jobType" value={input.jobType} onChange={changeEventHandler} className="mt-1.5 rounded-xl" placeholder="Full-time / Part-time / Internship" />
                        </div>
                        <div>
                            <Label className='text-sm font-semibold'>Experience (Years)</Label>
                            <Input name="experience" value={input.experience} onChange={changeEventHandler} className="mt-1.5 rounded-xl" placeholder="e.g. 2" />
                        </div>
                        <div>
                            <Label className='text-sm font-semibold'>No of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} className="mt-1.5 rounded-xl" />
                        </div>
                        <div>
                            <Label className='text-sm font-semibold'>Work Mode</Label>
                            <Select onValueChange={(value) => setInput({ ...input, workMode: value })}>
                                <SelectTrigger className="mt-1.5 rounded-xl">
                                    <SelectValue placeholder="Select Work Mode" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectGroup>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='md:col-span-2'>
                            <Label className='text-sm font-semibold'>Benefits</Label>
                            <Input name="benefits" value={input.benefits} onChange={changeEventHandler} placeholder="Health Insurance, Stock Options, Free Lunch..." className="mt-1.5 rounded-xl" />
                        </div>
                        {companies.length > 0 && (
                            <div className='md:col-span-2'>
                                <Label className='text-sm font-semibold'>Company</Label>
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="mt-1.5 rounded-xl">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
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
                        <Button className="w-full mt-6 rounded-xl h-12" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Posting...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full mt-6 btn-primary rounded-xl h-12 font-semibold text-base">
                            Post Job
                        </Button>
                    )}

                    {companies.length === 0 && (
                        <p className='text-xs text-rose-500 font-semibold text-center mt-4'>
                            ⚠️ Please register a company first before posting a job
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PostJob