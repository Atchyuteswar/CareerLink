import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { ChevronDown, HelpCircle, Search } from 'lucide-react'

const faqData = [
    {
        category: 'For Job Seekers',
        items: [
            { q: 'How do I create an account?', a: 'Click "Get Started" on the homepage, choose your role as "Student", fill in your details, and you\'re ready to go! It takes less than 2 minutes.' },
            { q: 'How does the AI skill matching work?', a: 'Our AI compares your listed skills with job requirements to calculate a compatibility score. The higher the match, the better the fit. You can see this on each job\'s detail page.' },
            { q: 'Can I upload my resume?', a: 'Yes! Go to your Profile page and upload a PDF resume. Our system automatically parses it to extract skills, which are added to your profile for better matching.' },
            { q: 'How do I save jobs for later?', a: 'Click the bookmark icon on any job card to save it. You can view all saved jobs from the "Saved" page in the navigation bar.' },
            { q: 'What is the Career Insights page?', a: 'Career Insights is our AI-powered dashboard that shows your career readiness score, skill demand in the market, and personalized job recommendations based on your profile.' },
        ]
    },
    {
        category: 'For Employers',
        items: [
            { q: 'How do I post a job?', a: 'Register as a "Recruiter", create a company profile, then navigate to Jobs → New Job. Fill in the details like title, requirements, salary, and work mode.' },
            { q: 'Can I search for candidates?', a: 'Yes! Use the Candidate Search page to find job seekers by name, skills, or headline. You can view their profiles, skills, and resumes.' },
            { q: 'How do I manage applications?', a: 'Go to your Jobs Dashboard, click "View" on any job to see all applicants. You can Accept or Reject each application with one click.' },
            { q: 'Is there a messaging system?', a: 'Yes, our real-time chat system allows direct communication between recruiters and candidates. Access it from the "Messages" tab.' },
        ]
    },
    {
        category: 'Account & Privacy',
        items: [
            { q: 'How do I change my password?', a: 'Go to Account Settings from your profile dropdown. You can change your password by entering your current password and the new one.' },
            { q: 'Can I delete my account?', a: 'Yes, go to Account Settings and click "Delete Account" in the Danger Zone section. This action is permanent and cannot be undone.' },
            { q: 'Is my data secure?', a: 'Absolutely. We use industry-standard encryption (bcrypt for passwords, JWT for sessions) and your data is stored securely in MongoDB Atlas. We never share personal data without consent.' },
        ]
    },
];

const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className='border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden transition-all'>
            <button onClick={() => setOpen(!open)} className='w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors'>
                <span className='text-sm font-semibold text-foreground pr-4'>{q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className='px-5 pb-4 text-sm text-muted-foreground leading-relaxed'>{a}</p>
            </div>
        </div>
    );
};

const FAQs = () => {
    const [search, setSearch] = useState('');

    const filtered = faqData.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className='bg-background text-foreground min-h-screen'>
            <Navbar />

            <section className='max-w-3xl mx-auto px-4 py-16'>
                <div className='text-center mb-10'>
                    <span className='inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-semibold tracking-wider uppercase mb-4'>
                        Help Center
                    </span>
                    <h1 className='text-4xl font-extrabold tracking-tight mb-4'>
                        Frequently Asked <span className='gradient-text'>Questions</span>
                    </h1>
                    <p className='text-muted-foreground max-w-lg mx-auto'>
                        Quick answers to the most common questions about CareerLink.
                    </p>
                </div>

                {/* Search */}
                <div className='relative mb-10'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search for answers..."
                        className='w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                    />
                </div>

                {/* FAQ Categories */}
                {filtered.length === 0 ? (
                    <div className='text-center py-12'>
                        <HelpCircle className='w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50' />
                        <p className='text-muted-foreground'>No results found for "{search}"</p>
                    </div>
                ) : (
                    filtered.map((cat, i) => (
                        <div key={i} className='mb-8'>
                            <h2 className='text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-4'>{cat.category}</h2>
                            <div className='space-y-2'>
                                {cat.items.map((item, j) => (
                                    <FAQItem key={j} q={item.q} a={item.a} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </section>

            <Footer />
        </div>
    )
}

export default FAQs
