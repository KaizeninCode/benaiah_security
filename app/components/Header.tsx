import { url } from 'inspector'
import React from 'react'
import Button from './Button'

const Header = () => {
    const links = [
        {
            name: "Home",
            url: "#home",
        },
        {
            name: "About Us",
            url: "#about",
        },
        {
            name: "Pricing",
            url: "#pricing",
        },
        {
            name: "Contact Us",
            url: "#contact",
        },
    ]
  return (
<header className='flex items-center justify-around p-3'>
    <div>Lorem ipsum dolor sit amet.</div>
    <nav >
        <div className="flex items-center justify-between gap-12">
        {links.map(link => (
            <a href= {link.url} key={link.url} className='hover:text-red-600 transition duration-500 ease-in-out hover:scale-105'> {link.name} </a>
        ))}
        </div>
    </nav>
    <div className='space-x-8'>
        <Button title = 'Log In'/>
        <Button title = 'Sign Up' className='bg-red-600 text-white hover:text-red-600 hover:bg-white hover:border-red-600 transition duration-500 ease-in-out'/>
    </div>
</header>  )
}

export default Header