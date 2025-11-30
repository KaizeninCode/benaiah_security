import React from 'react'

type ButtonProps = {
    title: string;
    className?: string;

}

const Button = ({title, className}: ButtonProps) => {
  return (
    <button className={`p-3 border rounded-xl cursor-pointer ${className?`${className}`:''}`}>{title}</button>
  )
}

export default Button