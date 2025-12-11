import React from "react";
import Button from "./Button";

const ContactUs = () => {
  return (
    <section id="contact" className="lg:px-16 lg:py-4 p-8 lg:mb-8">
      <div className="grid md:grid-cols-2 gap-8 w-full ">
        <div className="flex-col lg:py-18 flex items-start justify-between">
          <h1 className="text-4xl font-semibold">Contact Us</h1>
          <p className="text-lg my-4">Our team would love to hear from you.</p>
          <form
            action=""
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
              />
            </div>
            <div className="bg-red-500 rounded-md w-fit mx-auto">
              <Button title="Submit Message" />
            </div>
          </form>
        </div>
        <div className='bg-[url("/contact.png")] bg-cover bg-center rounded-lg shadow-lg shadow-gray-500' />
      </div>
    </section>
  );
};

export default ContactUs;
