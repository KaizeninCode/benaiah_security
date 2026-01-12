"use client";

import React, { useState } from "react";
import Button from "./Button";

const ContactUs = () => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          phoneNumber: Number(formState.phoneNumber),
          message: formState.message,
        }),
      });
      if (res.ok) {
        setFormState({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          message: "",
        });
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section id="contact" className="lg:px-16 lg:py-4 p-8 lg:mb-8">
      <div className="grid md:grid-cols-2 w-full ">
        <div className="flex-col flex items-start justify-between">
          <h1 className="text-4xl font-semibold">Contact Us</h1>
          <p className="text-lg my-4">Our team would love to hear from you.</p>
          <form
            action=""
            onSubmit={handleSubmit}
            className="rounded-md shadow-sm shadow-slate-500 space-y-6 p-6 w-4/5 max-md:mx-auto"
          >
            <div className="flex justify-between items-center gap-8">
              <div className="flex flex-col items-start justify-center gap-1 w-1/2">
                <label htmlFor="firstName" className="text-lg font-medium">
                  First name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="First Name"
                  value={formState.firstName}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col items-start justify-center gap-1 w-1/2">
                <label htmlFor="lastName" className="text-lg font-medium">
                  Last name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="Last Name"
                  value={formState.lastName}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-center gap-1">
              <label htmlFor="email" className="text-lg font-medium">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="email@example.com"
                value={formState.email}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-1">
              <label htmlFor="phoneNumber" className="text-lg font-medium">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                type="phone"
                id="phoneNumber"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="+254 700 000 000"
                value={formState.phoneNumber}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-1">
              <label htmlFor="phoneNumber" className="text-lg font-medium">
                Message<span className="text-red-500">*</span>
              </label>
              <textarea
                // type="text"
                id="message"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Leave us a message..."
                value={formState.message}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </div>
            <div className="bg-red-500 rounded-md w-fit mx-auto">
              <Button
                title="Submit Message"
                className="text-white hover:text-black"
              />
            </div>
          </form>
        </div>
        <div className='bg-[url("/contact.png")] bg-cover bg-center rounded-lg shadow-md shadow-gray-500' />
      </div>
    </section>
  );
};

export default ContactUs;
