import React from 'react'
import Hero from './components/Hero'
import AboutUs from './components/AboutUs'
import BookNow from './components/BookNow'
import ContactUs from './components/ContactUs'

const HomePage = () => {
  return (
   <main>
    <Hero/>
    <AboutUs/>
    <BookNow/>
    <ContactUs/>
   </main>  )
}

export default HomePage