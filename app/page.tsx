import React from 'react'
import Hero from './components/Hero'
import AboutUs from './components/AboutUs'
import BookNow from './components/BookNow'
import ContactUs from './components/ContactUs'
import Pricing from './components/Pricing'

const HomePage = () => {
  return (
   <main>
    <Hero/>
    <AboutUs/>
    <BookNow/>
    <Pricing/>
    <ContactUs/>
   </main>  )
}

export default HomePage