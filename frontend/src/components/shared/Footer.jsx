import React from 'react'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-12 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Brand */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Career<span className="text-[#F83002]">Link</span>
          </h2>
          <p className="text-sm">
            Connecting talent with opportunity. The #1 platform for finding your dream job and building your career.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">Guides</a></li>
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-[#6A38C2] transition-colors">Partners</a></li>
          </ul>
        </div>

        {/* Column 4: Social Media */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#6A38C2] transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-[#6A38C2] transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-[#6A38C2] transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-[#6A38C2] transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CareerLink. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer