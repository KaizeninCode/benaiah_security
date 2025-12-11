import React from 'react'

type ButtonProps = {
    title: string;
    className?: string;
    onClick?: ()=>void;

}

const Button = ({title, className}: ButtonProps) => {
  return (
    // <button className={`px-3 py-2 bg-red-600 text-white hover:text-red-600 hover:bg-red-300 hover:border-red-600 transition duration-500 ease-in-out rounded-md cursor-pointer ${className?`${className}`:''}`}>{title}</button>

    <button
  className={`
    px-3 py-2 hover:bg-gray-200 hover:border-red-600 transition duration-500 ease-in-out rounded-md cursor-pointer ${className}`} >
  {title}
</button>

  )
}

export default Button