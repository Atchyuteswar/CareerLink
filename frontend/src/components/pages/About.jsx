import React from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Users, Target, Zap, Shield, Globe, Award, Heart, Rocket } from 'lucide-react'

const stats = [
    { label: 'Active Users', value: '50,000+', icon: Users },
    { label: 'Jobs Posted', value: '10,000+', icon: Target },
    { label: 'Companies', value: '500+', icon: Globe },
    { label: 'Placements', value: '8,000+', icon: Award },
];

const values = [
    { icon: Heart, title: 'People First', desc: 'We believe the right job can change a life. Our algorithms prioritize human potential over keywords.' },
    { icon: Shield, title: 'Trust & Privacy', desc: 'Your data is always encrypted and never shared without consent. Job-seeking should feel safe.' },
    { icon: Rocket, title: 'Innovation', desc: 'AI-powered matching, real-time chat, and smart career insights — we\'re building the future of hiring.' },
    { icon: Zap, title: 'Speed', desc: 'From application to offer letter — our streamlined process reduces average hiring time by 60%.' },
];

const team = [
    { name: 'Atchyuteswar', role: 'Founder & Lead Developer', emoji: '👨‍💻' },
    { name: 'CareerLink Team', role: 'Full Stack Development', emoji: '🚀' },
    { name: 'AI Engine', role: 'Smart Matching & Insights', emoji: '🤖' },
];

const About = () => {
    return (
        <div className='bg-background text-foreground min-h-screen'>
            <Navbar />

            {/* Hero */}
            <section className='relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10'></div>
                <div className='max-w-5xl mx-auto px-4 py-20 text-center relative z-10'>
                    <span className='inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-semibold tracking-wider uppercase mb-4 animate-fade-in'>
                        Our Story
                    </span>
                    <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-6 animate-fade-in-up' style={{opacity:0,animationDelay:'100ms'}}>
                        Connecting Talent With <span className='gradient-text'>Opportunity</span>
                    </h1>
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up' style={{opacity:0,animationDelay:'200ms'}}>
                        CareerLink was born from a simple idea: finding a job shouldn't be harder than doing the job. 
                        We're building India's most intelligent career platform, powered by AI and driven by people.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className='max-w-5xl mx-auto px-4 pb-16'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 text-center animate-fade-in-up' style={{opacity:0,animationDelay:`${i*100}ms`}}>
                                <div className='w-12 h-12 mx-auto mb-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                                    <Icon className='w-6 h-6 text-violet-600 dark:text-violet-400' />
                                </div>
                                <p className='text-2xl font-extrabold text-foreground'>{stat.value}</p>
                                <p className='text-xs text-muted-foreground mt-1'>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Mission */}
            <section className='bg-gray-50/50 dark:bg-gray-950/50 py-20'>
                <div className='max-w-5xl mx-auto px-4'>
                    <div className='grid md:grid-cols-2 gap-12 items-center'>
                        <div>
                            <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>Our Mission</span>
                            <h2 className='text-3xl font-extrabold text-foreground mt-2 mb-4'>Democratizing Career Growth</h2>
                            <p className='text-muted-foreground leading-relaxed mb-4'>
                                Every student and professional deserves access to the best opportunities regardless of their background. 
                                CareerLink uses AI to level the playing field — matching skills, not pedigree.
                            </p>
                            <p className='text-muted-foreground leading-relaxed'>
                                Our platform analyzes your skills, identifies gaps, recommends learning paths, and connects you 
                                directly with recruiters who value what you can do, not just where you studied.
                            </p>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            {values.map((v, i) => {
                                const Icon = v.icon;
                                return (
                                    <div key={i} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-xl p-4'>
                                        <Icon className='w-5 h-5 text-violet-500 mb-2' />
                                        <h3 className='font-bold text-sm text-foreground mb-1'>{v.title}</h3>
                                        <p className='text-xs text-muted-foreground leading-relaxed'>{v.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className='py-20'>
                <div className='max-w-5xl mx-auto px-4 text-center'>
                    <span className='text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider'>The Team</span>
                    <h2 className='text-3xl font-extrabold text-foreground mt-2 mb-10'>Built by Builders</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {team.map((member, i) => (
                            <div key={i} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 card-hover animate-fade-in-up' style={{opacity:0,animationDelay:`${i*100}ms`}}>
                                <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center'>
                                    <span className='text-3xl'>{member.emoji}</span>
                                </div>
                                <h3 className='font-bold text-lg text-foreground'>{member.name}</h3>
                                <p className='text-sm text-muted-foreground'>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default About
