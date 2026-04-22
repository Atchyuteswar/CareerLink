import React, { useEffect, useContext } from 'react'
import Navbar from '../shared/Navbar'
import HeroSection from './HeroSection'
import LatestJobs from './LatestJobs'
import Footer from '../shared/Footer'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Shield, Zap, Target, Users, CheckCircle2 } from 'lucide-react'

// Features section component
const Features = () => {
    const features = [
        {
            icon: Target,
            title: "AI-Powered Matching",
            desc: "Our smart algorithm matches your skills with job requirements and shows compatibility scores.",
            color: "text-violet-500",
            bg: "bg-violet-100 dark:bg-violet-500/10"
        },
        {
            icon: Zap,
            title: "Real-Time Chat",
            desc: "Direct messaging between candidates and recruiters for faster hiring decisions.",
            color: "text-amber-500",
            bg: "bg-amber-100 dark:bg-amber-500/10"
        },
        {
            icon: Shield,
            title: "Resume Parser",
            desc: "Upload your resume and let our AI auto-fill your profile with skills and experience.",
            color: "text-emerald-500",
            bg: "bg-emerald-100 dark:bg-emerald-500/10"
        },
        {
            icon: Users,
            title: "Application Tracking",
            desc: "Track all your applications with visual analytics showing acceptance rates.",
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-500/10"
        },
    ];

    return (
        <section className='section-padding'>
            <div className='container-main'>
                <div className='text-center mb-12'>
                    <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>
                        Why CareerLink?
                    </span>
                    <h2 className='text-3xl md:text-4xl font-extrabold text-foreground mt-2 tracking-tight'>
                        Features That Set Us <span className='gradient-text'>Apart</span>
                    </h2>
                    <p className='text-muted-foreground mt-3 max-w-lg mx-auto'>
                        Everything you need to accelerate your career, all in one platform.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div 
                                key={index}
                                className='group bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 card-hover animate-fade-in-up'
                                style={{ opacity: 0, animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className='font-bold text-lg text-foreground mb-2'>{feature.title}</h3>
                                <p className='text-sm text-muted-foreground leading-relaxed'>{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// How It Works section
const HowItWorks = () => {
    const steps = [
        { step: "01", title: "Create Your Profile", desc: "Sign up and build your professional profile with skills, resume, and social links." },
        { step: "02", title: "Browse & Match", desc: "Explore jobs and get AI-powered compatibility scores to find the perfect match." },
        { step: "03", title: "Apply & Track", desc: "Apply with one click and track your application status in real-time." },
        { step: "04", title: "Get Hired", desc: "Chat with recruiters, attend interviews, and land your dream job." },
    ];

    return (
        <section className='section-padding bg-gray-50/50 dark:bg-gray-950/50'>
            <div className='container-main'>
                <div className='text-center mb-12'>
                    <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>
                        How It Works
                    </span>
                    <h2 className='text-3xl md:text-4xl font-extrabold text-foreground mt-2 tracking-tight'>
                        Land Your Dream Job in <span className='gradient-text'>4 Steps</span>
                    </h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {steps.map((item, index) => (
                        <div key={index} className='relative text-center animate-fade-in-up' style={{ opacity: 0, animationDelay: `${index * 150}ms` }}>
                            <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20'>
                                <span className='text-white font-extrabold text-lg'>{item.step}</span>
                            </div>
                            <h3 className='font-bold text-lg text-foreground mb-2'>{item.title}</h3>
                            <p className='text-sm text-muted-foreground leading-relaxed'>{item.desc}</p>
                            {index < steps.length - 1 && (
                                <div className='hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-violet-200 dark:border-violet-800'></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Testimonial / CTA Section
const CTASection = () => (
    <section className='section-padding'>
        <div className='container-main'>
            <div className='relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-center text-white overflow-hidden'>
                <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
                <div className='absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2'></div>
                
                <div className='relative z-10'>
                    <h2 className='text-3xl md:text-4xl font-extrabold mb-4'>
                        Ready to Start Your Career Journey?
                    </h2>
                    <p className='text-violet-200 max-w-xl mx-auto mb-8 leading-relaxed'>
                        Join thousands of professionals who have found their dream jobs through CareerLink. 
                        It's free, fast, and intelligent.
                    </p>
                    <div className='flex items-center justify-center gap-4 flex-wrap'>
                        <a href="/signup" className='inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-all duration-300 shadow-lg hover:shadow-xl'>
                            Get Started Free
                        </a>
                        <a href="/jobs" className='inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300'>
                            Browse Jobs
                        </a>
                    </div>
                    <div className='flex items-center justify-center gap-6 mt-8 text-sm text-violet-200'>
                        <span className='flex items-center gap-1.5'><CheckCircle2 className='w-4 h-4' /> Free forever</span>
                        <span className='flex items-center gap-1.5'><CheckCircle2 className='w-4 h-4' /> No credit card</span>
                        <span className='flex items-center gap-1.5'><CheckCircle2 className='w-4 h-4' /> AI-powered</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'recruiter') {
            navigate("/admin/companies");
        }
    }, [user, navigate]);

    return (
        <div className='bg-background text-foreground min-h-screen flex flex-col'>
            <Navbar />
            <HeroSection />
            <LatestJobs />
            <Features />
            <HowItWorks />
            <CTASection />
            <Footer />
        </div>
    )
}

export default Home