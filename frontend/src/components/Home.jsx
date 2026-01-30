import React from 'react'
import Navbar from './Navbar'

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className='text-center my-20'>
        <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Job</span></h1>
        <p className='mt-5 text-gray-500'>Your gateway to thousands of job opportunities across top companies.</p>
      </div>
    </div>
  )
}

export default Home