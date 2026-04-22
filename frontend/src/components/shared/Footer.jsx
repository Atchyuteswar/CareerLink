import React from 'react'
import { Briefcase, Facebook, Twitter, Linkedin, Instagram, Github, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="relative bg-gray-50 dark:bg-gray-950 border-t border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
      {/* Gradient top accent */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent'></div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-violet-500/20'>
                <Briefcase className='w-5 h-5 text-white' />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Career<span className="gradient-text">Link</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              India's premier career platform connecting talented professionals with top companies. Your dream job is one click away.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Github, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: For Job Seekers */}
          <div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-5">For Job Seekers</h3>
            <ul className="space-y-3">
              {[
                { label: "Browse Jobs", to: "/jobs" },
                { label: "Saved Jobs", to: "/saved-jobs" },
                { label: "Browse Companies", to: "/companies" },
                { label: "Salary Insights", to: "/salary-insights" },
                { label: "Career Insights", to: "/career-insights" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Employers */}
          <div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-5">For Employers</h3>
            <ul className="space-y-3">
              {[
                { label: "Post a Job", to: "/admin/jobs/create" },
                { label: "Manage Companies", to: "/admin/companies" },
                { label: "Find Candidates", to: "/admin/candidates" },
                { label: "View Applicants", to: "/admin/jobs" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", to: "/about" },
                { label: "Contact Us", to: "/contact" },
                { label: "FAQs", to: "/faqs" },
                { label: "Privacy Policy", to: "/about" },
                { label: "Terms of Service", to: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CareerLink. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for India's talent
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer