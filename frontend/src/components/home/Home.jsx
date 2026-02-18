import React, { useEffect, useContext } from 'react'
import Navbar from '../shared/Navbar'
import HeroSection from './HeroSection'
import LatestJobs from './LatestJobs'
import Footer from '../shared/Footer' // <--- Import Footer
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

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
      <Footer /> {/* <--- Add Footer here */}
    </div>
  )
}

export default Home