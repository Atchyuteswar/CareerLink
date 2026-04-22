import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill all required fields.");
            return;
        }
        setLoading(true);
        // Simulate sending
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you within 24 hours.");
            setForm({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    const contactInfo = [
        { icon: Mail, label: 'Email Us', value: 'support@careerlink.in', sub: 'We reply within 24 hours' },
        { icon: Phone, label: 'Call Us', value: '+91 770-285-0277', sub: 'Mon-Fri, 9AM-6PM IST' },
        { icon: MapPin, label: 'Visit Us', value: 'Hyderabad, Telangana', sub: 'India' },
    ];

    return (
        <div className='bg-background text-foreground min-h-screen'>
            <Navbar />

            <section className='max-w-6xl mx-auto px-4 py-16'>
                <div className='text-center mb-12'>
                    <span className='inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-semibold tracking-wider uppercase mb-4'>
                        Contact Us
                    </span>
                    <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-4'>
                        Get in <span className='gradient-text'>Touch</span>
                    </h1>
                    <p className='text-muted-foreground max-w-lg mx-auto'>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-12'>
                    {contactInfo.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} className='bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 text-center animate-fade-in-up' style={{opacity:0,animationDelay:`${i*100}ms`}}>
                                <div className='w-12 h-12 mx-auto mb-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center'>
                                    <Icon className='w-5 h-5 text-violet-600 dark:text-violet-400' />
                                </div>
                                <h3 className='font-bold text-foreground'>{item.label}</h3>
                                <p className='text-sm text-violet-600 dark:text-violet-400 font-medium mt-1'>{item.value}</p>
                                <p className='text-xs text-muted-foreground mt-0.5'>{item.sub}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Contact Form */}
                <div className='max-w-2xl mx-auto bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-black/20 animate-fade-in-up' style={{opacity:0,animationDelay:'400ms'}}>
                    <div className='flex items-center gap-2 mb-6'>
                        <MessageSquare className='w-5 h-5 text-violet-500' />
                        <h2 className='font-bold text-lg text-foreground'>Send us a message</h2>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div>
                                <label className='text-sm font-semibold text-foreground mb-1.5 block'>Name *</label>
                                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                    className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                                    placeholder="Your name" />
                            </div>
                            <div>
                                <label className='text-sm font-semibold text-foreground mb-1.5 block'>Email *</label>
                                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                                    className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                                    placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className='text-sm font-semibold text-foreground mb-1.5 block'>Subject</label>
                            <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                                className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                                placeholder="What's this about?" />
                        </div>
                        <div>
                            <label className='text-sm font-semibold text-foreground mb-1.5 block'>Message *</label>
                            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5}
                                className='w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none'
                                placeholder="Tell us what you need help with..." />
                        </div>
                        <Button type="submit" disabled={loading} className='w-full btn-primary rounded-xl h-12 font-semibold text-base gap-2'>
                            {loading ? 'Sending...' : <><Send className='w-4 h-4' /> Send Message</>}
                        </Button>
                    </form>

                    <div className='flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-center'>
                        <Clock className='w-3.5 h-3.5' />
                        <span>Average response time: Under 24 hours</span>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Contact
