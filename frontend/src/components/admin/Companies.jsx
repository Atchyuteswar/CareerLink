import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit, MoreHorizontal, Plus, Building2, Search } from 'lucide-react'

const Companies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/company/get", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setCompanies(res.data.companies);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto my-8 px-4'>
                {/* Page Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                        <Building2 className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                    </div>
                    <div>
                        <h1 className='font-extrabold text-2xl text-foreground'>Your Companies</h1>
                        <p className='text-sm text-muted-foreground'>{companies.length} registered companies</p>
                    </div>
                </div>

                {/* Controls */}
                <div className='flex items-center justify-between mb-6'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            onChange={(e) => setSearch(e.target.value)}
                            className='pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all w-64'
                        />
                    </div>
                    <Button onClick={() => navigate("/admin/companies/create")} className="btn-primary rounded-xl gap-2">
                        <Plus className='w-4 h-4' /> New Company
                    </Button>
                </div>

                {/* Table */}
                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden'>
                    <Table>
                        <TableCaption className='pb-4 text-xs'>A list of your registered companies</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Logo</TableHead>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Name</TableHead>
                                <TableHead className='font-semibold text-xs uppercase tracking-wider'>Date</TableHead>
                                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCompanies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground text-sm">
                                        No companies found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <TableRow key={company._id} className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'>
                                        <TableCell>
                                            <Avatar className="rounded-xl">
                                                <AvatarImage src={company.logo} />
                                                <AvatarFallback className="bg-gradient-to-br from-violet-400 to-indigo-400 text-white rounded-xl text-sm font-semibold">
                                                    {company.name?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className='font-medium text-foreground'>{company.name}</TableCell>
                                        <TableCell className='text-muted-foreground text-sm'>{company.createdAt.split("T")[0]}</TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger>
                                                    <div className='w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors cursor-pointer'>
                                                        <MoreHorizontal className='w-4 h-4 text-muted-foreground' />
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-32 p-2 rounded-xl">
                                                    <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-sm transition-colors'>
                                                        <Edit className='w-4 h-4' />
                                                        <span>Edit</span>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Companies