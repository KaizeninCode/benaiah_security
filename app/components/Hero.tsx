import React from 'react'
import Button from './Button'

const Hero = () => {
  return (
    <section id="home" className='min-h-screen max-w-5xl'>
        <div className="grid grid-cols-2 gap-8 w-full mx-16">
            <div className='flex-col py-18 flex items-start justify-between gap-12'>
                <h1 className="text-6xl font-semibold">Your Security,<br /> <span className="text-red-500">Our Priority.</span></h1>
                <h3 className="text-2xl">To become the region&apos;s leading provider of integrated security services by combining skilled manpower with advanced surveillance systems to create safe, secure environments for all.</h3>
                <div className="space-x-12">
                    <Button title='Sign Up'/>
                    <Button title='Book Now'className='bg-red-600 text-white hover:text-red-600 hover:bg-white hover:border-red-600 transition duration-500 ease-in-out'/>
                </div>
            </div>
            <div className='h-128'>
                {/* <img src="./hero.jpeg" alt="Security" className='w-full h-full object-cover' /> */}
            </div>
        </div>
    </section>
  )
}

export default Hero