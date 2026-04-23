import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'sonner'
import { Star, ThumbsUp, Building2, Search, PenSquare, X, Shield, ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const StarRating = ({ value, onChange, size = 'md' }) => {
    const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
    return (
        <div className='flex items-center gap-0.5'>
            {[1, 2, 3, 4, 5].map(i => (
                <button key={i} type="button" onClick={() => onChange?.(i)}
                    className={`${onChange ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}>
                    <Star className={`${sizes[size]} ${i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                </button>
            ))}
        </div>
    );
};

const CompanyReviews = () => {
    const { user } = useContext(AuthContext);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [avgRatings, setAvgRatings] = useState(null);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchQ, setSearchQ] = useState('');
    const [form, setForm] = useState({
        rating: 4, title: '', pros: '', cons: '', reviewType: 'employee', isAnonymous: false,
        ratings: { culture: 3, workLifeBalance: 3, salary: 3, growth: 3 }
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("https://careerlink-1ank.onrender.com/api/v1/company/getall");
                if (res.data.success) {
                    setCompanies(res.data.companies);
                    if (res.data.companies.length > 0) {
                        setSelectedCompany(res.data.companies[0]);
                    }
                }
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (!selectedCompany) return;
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`https://careerlink-1ank.onrender.com/api/v1/review/company/${selectedCompany._id}`);
                if (res.data.success) {
                    setReviews(res.data.reviews);
                    setAvgRating(res.data.avgRating);
                    setAvgRatings(res.data.avgRatings);
                    setTotalReviews(res.data.totalReviews);
                }
            } catch (e) { console.log(e); }
        };
        fetchReviews();
    }, [selectedCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.rating) return toast.error("Title and rating are required.");
        try {
            setSubmitting(true);
            const res = await axios.post("https://careerlink-1ank.onrender.com/api/v1/review/create", {
                company: selectedCompany._id, ...form
            }, { withCredentials: true });
            if (res.data.success) {
                setReviews(prev => [res.data.review, ...prev]);
                setShowForm(false);
                setForm({ rating: 4, title: '', pros: '', cons: '', reviewType: 'employee', isAnonymous: false, ratings: { culture: 3, workLifeBalance: 3, salary: 3, growth: 3 } });
                toast.success("Review posted!");
            }
        } catch (e) { toast.error("Failed to post review."); }
        finally { setSubmitting(false); }
    };

    const handleHelpful = async (reviewId) => {
        try {
            const res = await axios.post(`https://careerlink-1ank.onrender.com/api/v1/review/helpful/${reviewId}`, {}, { withCredentials: true });
            if (res.data.success) {
                setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpful: Array(res.data.helpfulCount).fill(null) } : r));
            }
        } catch (e) { toast.error("Login to vote."); }
    };

    const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(searchQ.toLowerCase()));

    const ratingLabels = { culture: 'Culture', workLifeBalance: 'Work-Life Balance', salary: 'Compensation', growth: 'Career Growth' };

    const timeAgo = (d) => {
        const s = Math.floor((Date.now() - new Date(d)) / 1000);
        if (s < 3600) return `${Math.floor(s/60)}m ago`;
        if (s < 86400) return `${Math.floor(s/3600)}h ago`;
        return `${Math.floor(s/86400)}d ago`;
    };

    return (
        <div className='bg-background min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>Reviews</span>
                    <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight mt-2 mb-3'>
                        Company <span className='gradient-text'>Reviews</span>
                    </h1>
                    <p className='text-muted-foreground max-w-lg mx-auto'>
                        Real reviews from employees and interview candidates. Know before you apply.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                    {/* Company List Sidebar */}
                    <div className='md:col-span-1'>
                        <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-4 sticky top-24'>
                            <div className='relative mb-3'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' />
                                <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                                    placeholder="Search companies..."
                                    className='w-full pl-8 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20'
                                />
                            </div>
                            <div className='space-y-1 max-h-[400px] overflow-y-auto'>
                                {filteredCompanies.map(c => (
                                    <button key={c._id} onClick={() => setSelectedCompany(c)}
                                        className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition-all text-sm
                                            ${selectedCompany?._id === c._id 
                                                ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 font-semibold' 
                                                : 'text-foreground hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}>
                                        <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center flex-shrink-0'>
                                            <span className='text-xs font-bold text-violet-600 dark:text-violet-400'>{c.name[0]?.toUpperCase()}</span>
                                        </div>
                                        <span className='truncate'>{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className='md:col-span-3'>
                        {selectedCompany ? (
                            <>
                                {/* Company Header + Summary */}
                                <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 mb-6'>
                                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center'>
                                                <span className='text-2xl font-bold text-violet-600 dark:text-violet-400'>{selectedCompany.name[0]?.toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-bold text-foreground'>{selectedCompany.name}</h2>
                                                <div className='flex items-center gap-2 mt-1'>
                                                    <StarRating value={Math.round(avgRating)} size="sm" />
                                                    <span className='text-sm font-bold text-foreground'>{avgRating}</span>
                                                    <span className='text-xs text-muted-foreground'>({totalReviews} reviews)</span>
                                                </div>
                                            </div>
                                        </div>
                                        {user && (
                                            <Button onClick={() => setShowForm(!showForm)} className='btn-primary rounded-xl gap-2'>
                                                <PenSquare className='w-4 h-4' /> Write Review
                                            </Button>
                                        )}
                                    </div>

                                    {/* Category Ratings */}
                                    {avgRatings && (
                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800'>
                                            {Object.entries(ratingLabels).map(([key, label]) => (
                                                <div key={key} className='text-center'>
                                                    <p className='text-lg font-bold text-foreground'>{avgRatings[key]}</p>
                                                    <div className='w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mt-1 overflow-hidden'>
                                                        <div className='h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500' style={{ width: `${(avgRatings[key] / 5) * 100}%` }}></div>
                                                    </div>
                                                    <p className='text-[10px] text-muted-foreground mt-1 font-medium'>{label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Write Review Form */}
                                {showForm && (
                                    <div className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 mb-6 animate-fade-in'>
                                        <div className='flex justify-between items-center mb-4'>
                                            <h3 className='font-bold text-foreground'>Write a Review</h3>
                                            <button onClick={() => setShowForm(false)}><X className='w-4 h-4 text-muted-foreground' /></button>
                                        </div>
                                        <form onSubmit={handleSubmit} className='space-y-4'>
                                            <div>
                                                <label className='text-xs font-semibold text-foreground mb-1.5 block'>Overall Rating *</label>
                                                <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} size="lg" />
                                            </div>
                                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                                                {Object.entries(ratingLabels).map(([key, label]) => (
                                                    <div key={key}>
                                                        <label className='text-[10px] font-semibold text-muted-foreground mb-1 block'>{label}</label>
                                                        <StarRating value={form.ratings[key]} onChange={v => setForm({ ...form, ratings: { ...form.ratings, [key]: v } })} size="sm" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <label className='text-xs font-semibold text-foreground mb-1.5 block'>Title *</label>
                                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                                    placeholder="Summarize your experience"
                                                    className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20' />
                                            </div>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div>
                                                    <label className='text-xs font-semibold text-foreground mb-1.5 block'>Pros</label>
                                                    <textarea value={form.pros} onChange={e => setForm({ ...form, pros: e.target.value })} rows={3}
                                                        placeholder="What did you like?"
                                                        className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none' />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-semibold text-foreground mb-1.5 block'>Cons</label>
                                                    <textarea value={form.cons} onChange={e => setForm({ ...form, cons: e.target.value })} rows={3}
                                                        placeholder="What could be improved?"
                                                        className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none' />
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-4'>
                                                <select value={form.reviewType} onChange={e => setForm({ ...form, reviewType: e.target.value })}
                                                    className='px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs font-medium text-foreground'>
                                                    <option value="employee">Employee Review</option>
                                                    <option value="interview">Interview Experience</option>
                                                    <option value="intern">Intern Review</option>
                                                </select>
                                                <label className='flex items-center gap-2 text-xs text-muted-foreground cursor-pointer'>
                                                    <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({ ...form, isAnonymous: e.target.checked })}
                                                        className='rounded border-gray-300 text-violet-600' />
                                                    <Shield className='w-3.5 h-3.5' /> Post anonymously
                                                </label>
                                            </div>
                                            <Button type="submit" disabled={submitting} className='btn-primary rounded-xl gap-2'>
                                                {submitting ? 'Posting...' : 'Submit Review'}
                                            </Button>
                                        </form>
                                    </div>
                                )}

                                {/* Reviews List */}
                                {reviews.length === 0 ? (
                                    <div className='text-center py-16'>
                                        <Star className='w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-30' />
                                        <p className='text-muted-foreground font-medium'>No reviews yet</p>
                                        <p className='text-xs text-muted-foreground mt-1'>Be the first to review {selectedCompany.name}</p>
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        {reviews.map((review, i) => (
                                            <div key={review._id} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 animate-fade-in-up' style={{opacity:0,animationDelay:`${i*80}ms`}}>
                                                <div className='flex items-start justify-between gap-3'>
                                                    <div className='flex items-center gap-3'>
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={!review.isAnonymous ? review.reviewer?.profile?.profilePhoto : undefined} />
                                                            <AvatarFallback className="bg-gradient-to-br from-violet-400 to-indigo-400 text-white text-xs font-bold">
                                                                {review.isAnonymous ? '?' : review.reviewer?.fullname?.[0]?.toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className='text-sm font-bold text-foreground'>
                                                                {review.isAnonymous ? 'Anonymous' : review.reviewer?.fullname}
                                                            </p>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='text-[10px] bg-gray-100 dark:bg-gray-800 text-muted-foreground px-1.5 py-0.5 rounded font-medium capitalize'>{review.reviewType}</span>
                                                                <span className='text-[10px] text-muted-foreground'>{timeAgo(review.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <StarRating value={review.rating} size="sm" />
                                                </div>

                                                <h4 className='font-bold text-foreground mt-3'>{review.title}</h4>

                                                {review.pros && (
                                                    <div className='mt-2'>
                                                        <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase'>Pros</span>
                                                        <p className='text-sm text-muted-foreground'>{review.pros}</p>
                                                    </div>
                                                )}
                                                {review.cons && (
                                                    <div className='mt-2'>
                                                        <span className='text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase'>Cons</span>
                                                        <p className='text-sm text-muted-foreground'>{review.cons}</p>
                                                    </div>
                                                )}

                                                <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800'>
                                                    <button onClick={() => handleHelpful(review._id)}
                                                        className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet-500 transition-colors'>
                                                        <ThumbsUp className='w-3.5 h-3.5' /> Helpful ({review.helpful?.length || 0})
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='text-center py-16'>
                                <Building2 className='w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-30' />
                                <p className='text-muted-foreground'>Select a company to view reviews</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CompanyReviews;
