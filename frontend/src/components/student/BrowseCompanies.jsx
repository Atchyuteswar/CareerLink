import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import axios from 'axios'
import { Building2, MapPin, Globe, ExternalLink, Search, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BrowseCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("https://careerlink-1ank.onrender.com/api/v1/company/getall");
                if (res.data.success) setCompanies(res.data.companies);
            } catch (error) { console.log(error); }
            finally { setLoading(false); }
        };
        fetchCompanies();
    }, []);

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.location || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='bg-background text-foreground min-h-screen'>
            <Navbar />

            <section className='max-w-6xl mx-auto px-4 py-12'>
                {/* Header */}
                <div className='text-center mb-10'>
                    <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>Companies</span>
                    <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight mt-2 mb-3'>
                        Browse <span className='gradient-text'>Companies</span>
                    </h1>
                    <p className='text-muted-foreground max-w-lg mx-auto'>
                        Discover top companies hiring on CareerLink. Explore their profiles and open positions.
                    </p>
                </div>

                {/* Search */}
                <div className='relative max-w-md mx-auto mb-10'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by company name or location..."
                        className='w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                    />
                </div>

                {/* Company Cards */}
                {loading ? (
                    <div className='flex justify-center py-16'>
                        <div className='w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin'></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='text-center py-16'>
                        <Building2 className='w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-40' />
                        <p className='text-muted-foreground font-medium'>No companies found</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {filtered.map((company, i) => (
                            <div key={company._id} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 card-hover animate-fade-in-up' style={{opacity:0,animationDelay:`${i*80}ms`}}>
                                {/* Logo + Name */}
                                <div className='flex items-center gap-4 mb-4'>
                                    <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                                        {company.logo ? (
                                            <img src={company.logo} alt={company.name} className='w-full h-full object-cover rounded-xl' />
                                        ) : (
                                            <span className='text-xl font-bold text-violet-600 dark:text-violet-400'>{company.name[0]?.toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className='min-w-0'>
                                        <h3 className='font-bold text-lg text-foreground truncate'>{company.name}</h3>
                                        {company.location && (
                                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                                <MapPin className='w-3 h-3' /> {company.location}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className='text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2'>
                                    {company.description || 'No description available.'}
                                </p>

                                {/* Meta */}
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <span className='inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 rounded-lg'>
                                            <Briefcase className='w-3 h-3' /> {company.jobCount || 0} Jobs
                                        </span>
                                        {company.website && (
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className='text-muted-foreground hover:text-violet-500 transition-colors'>
                                                <Globe className='w-4 h-4' />
                                            </a>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/jobs`)}
                                        className='text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1'>
                                        View Jobs <ExternalLink className='w-3 h-3' />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    )
}

export default BrowseCompanies
