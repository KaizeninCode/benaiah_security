"use client";
import React from "react";
import Button from "./Button";
import Link from "next/link";

const Header = () => {
  const [open, setOpen] = React.useState(false);
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
  ];
  return (
      <header className="flex items-center justify-between lg:mx-16 mx-8 py-3 sticky top-0 z-50 bg-white shadow-md">
    {/* // <header className="flex items-center justify-between lg:mx-16 mx-8 py-3 border-b-red-500 border-b-3"> */}
      <div>
        <h1 className="text-2xl font-extrabold">
          Benaiah <span className="text-red-500">Security</span> Group
        </h1>
      </div>
      {/* mobile nav */}
      <div className="md:hidden">
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="p-2 rounded-md text-red-500"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden ">
          <div
            className="absolute inset-0 bg-white opacity-40"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-y-0 left-0 bg-red-500 text-white w-64 p-4 shadow-lg overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-white hover:text-red-500 transition duration-300 ease-in-out"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              {links.map((it) => (
                <li key={it.url}>
                  <Link
                    href={it.url}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-red-500 transition duration-300 ease-in-out"
                  >
                    {/* <span className="text-gray-300">{it.icon}</span> */}
                    <span className="font-medium">{it.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      <nav className="max-md:hidden">
        <div className="flex items-center justify-between gap-12">
          {links.map((link) => (
            <a
              href={link.url}
              key={link.url}
              className="text-lg hover:text-red-600 transition duration-500 ease-in-out hover:scale-105"
            >
              {" "}
              {link.name}{" "}
            </a>
          ))}
        </div>
      </nav>
      <div className="space-x-8 max-md:hidden">
        <Button className="hover:bg-gray-200 transition duration-300 hover:text-black px-2 py-2 rounded-md" title="Log In" />
        {/* <Button className="bg-green-300 hover:bg-green-700 text-black" /> */}
        <Button className="bg-red-500 text-white border border-red-600
               hover:bg-white transition duration-300 px-3 py-2 rounded-md hover:text-black"title="Sign Up" />
      </div>
    </header>
  );
};

export default Header;
