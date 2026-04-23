import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Building2, ArrowRight } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error("Please enter a company name");
            return;
        }
        try {
            const res = await axios.post("http://100.94.122.76:8000/api/v1/company/register", { companyName }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                const companyId = res.data.company._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to create company");
        }
    }

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-2xl mx-auto my-12 px-4'>
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-black/20'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                            <Building2 className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                        </div>
                        <div>
                            <h1 className='font-extrabold text-2xl text-foreground'>Register Company</h1>
                            <p className='text-sm text-muted-foreground'>What would you like to name your company? You can change this later.</p>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm font-semibold'>Company Name</Label>
                        <Input
                            type="text"
                            className="rounded-xl"
                            placeholder="e.g. Google, Microsoft, Infosys..."
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div className='flex items-center gap-3 mt-8'>
                        <Button variant="outline" onClick={() => navigate("/admin/companies")} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button onClick={registerNewCompany} className="btn-primary rounded-xl gap-2">
                            Continue <ArrowRight className='w-4 h-4' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate