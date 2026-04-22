import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Search, Briefcase, Building2, Users, ArrowRight, Sparkles, TrendingUp, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: "Frontend Developer", icon: "💻" },
    { name: "Backend Developer", icon: "⚙️" },
    { name: "Full Stack Developer", icon: "🚀" },
    { name: "Data Scientist", icon: "📊" },
    { name: "UI/UX Designer", icon: "🎨" },
    { name: "DevOps Engineer", icon: "☁️" },
    { name: "Mobile Developer", icon: "📱" },
    { name: "AI/ML Engineer", icon: "🤖" },
];

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const increment = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const searchJobHandler = () => {
        if (query.trim()) {
            navigate(`/browse?keyword=${encodeURIComponent(query)}`);
        } else {
            navigate("/browse");
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') searchJobHandler();
    }

    return (
        <div className='relative overflow-hidden'>
            {/* Background Gradient & Decorative Elements */}
            <div className='absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/30'></div>
            
            {/* Floating gradient orbs */}
            <div className='absolute top-20 left-10 w-72 h-72 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse-soft'></div>
            <div className='absolute top-40 right-20 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse-soft delay-500'></div>
            <div className='absolute -bottom-20 left-1/3 w-80 h-80 bg-fuchsia-400/10 dark:bg-fuchsia-600/5 rounded-full blur-3xl animate-pulse-soft delay-300'></div>

            {/* Grid Pattern Overlay */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%200h40v40H0V0zm1%201h38v38H1V1z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")] opacity-50'></div>
            
            <div className='relative max-w-7xl mx-auto px-4 pt-16 pb-20'>
                {/* Badge */}
                <div className='flex justify-center mb-8 animate-fade-in'>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20'>
                        <Sparkles className='w-4 h-4 text-violet-600 dark:text-violet-400' />
                        <span className='text-sm font-semibold text-violet-700 dark:text-violet-300'>India's #1 Career Platform</span>
                        <TrendingUp className='w-4 h-4 text-violet-600 dark:text-violet-400' />
                    </div>
                </div>
                
                {/* Main Heading */}
                <div className='text-center mb-8 animate-fade-in-up'>
                    <h1 className='text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-foreground'>
                        Discover Your
                        <br />
                        <span className='gradient-text'>Perfect Career</span>
                    </h1>
                    <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed'>
                        Connect with top companies, explore thousands of opportunities, 
                        and take the next step in your professional journey.
                    </p>
                </div>

                {/* Search Bar */}
                <div className='max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200' style={{opacity: 0}}>
                    <div className='flex items-center bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl shadow-violet-500/10 dark:shadow-black/30 border border-gray-200/60 dark:border-gray-700/60 p-2 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-400 transition-all duration-300'>
                        <Search className='w-5 h-5 text-gray-400 ml-4 mr-2 flex-shrink-0' />
                        <input
                            type="text"
                            placeholder='Search jobs, roles, or companies...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className='flex-1 outline-none border-none bg-transparent text-foreground placeholder:text-gray-400 text-base px-2 py-2'
                        />
                        <Button 
                            onClick={searchJobHandler} 
                            className="btn-primary rounded-xl h-11 px-6 text-sm font-semibold"
                        >
                            Search Jobs
                            <ArrowRight className='w-4 h-4 ml-1' />
                        </Button>
                    </div>
                    <div className='flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground'>
                        <span>Popular:</span>
                        {["React Developer", "Python", "Data Analyst"].map((term) => (
                            <button 
                                key={term}
                                onClick={() => { setQuery(term); }}
                                className='text-violet-600 dark:text-violet-400 hover:underline font-medium transition-colors'
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-3 gap-6 max-w-xl mx-auto mb-16 animate-fade-in-up delay-400' style={{opacity: 0}}>
                    <div className='text-center group'>
                        <div className='w-14 h-14 mx-auto mb-3 rounded-2xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                            <Briefcase className='w-7 h-7 text-violet-600 dark:text-violet-400' />
                        </div>
                        <div className='text-3xl font-extrabold text-foreground'>
                            <AnimatedCounter end={10000} suffix="+" />
                        </div>
                        <p className='text-sm text-muted-foreground mt-1 font-medium'>Active Jobs</p>
                    </div>
                    <div className='text-center group'>
                        <div className='w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                            <Building2 className='w-7 h-7 text-indigo-600 dark:text-indigo-400' />
                        </div>
                        <div className='text-3xl font-extrabold text-foreground'>
                            <AnimatedCounter end={500} suffix="+" />
                        </div>
                        <p className='text-sm text-muted-foreground mt-1 font-medium'>Companies</p>
                    </div>
                    <div className='text-center group'>
                        <div className='w-14 h-14 mx-auto mb-3 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                            <Users className='w-7 h-7 text-fuchsia-600 dark:text-fuchsia-400' />
                        </div>
                        <div className='text-3xl font-extrabold text-foreground'>
                            <AnimatedCounter end={50000} suffix="+" />
                        </div>
                        <p className='text-sm text-muted-foreground mt-1 font-medium'>Users</p>
                    </div>
                </div>

                {/* Category Quick Browse */}
                <div className='animate-fade-in-up delay-600' style={{opacity: 0}}>
                    <h3 className='text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6'>
                        Explore by Category
                    </h3>
                    <div className='flex flex-wrap justify-center gap-3 max-w-3xl mx-auto'>
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => { setQuery(cat.name); navigate(`/browse?keyword=${encodeURIComponent(cat.name)}`); }}
                                className='group flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/5 shadow-sm hover:shadow-md hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-0.5'
                            >
                                <span className='text-lg'>{cat.icon}</span>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors'>
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection