import React from "react";

const AboutUs = () => {
  return (
    <section id="about" className="lg:px-16 lg:py-4 p-8">
      <div className="grid md:grid-cols-2 gap-8 w-full lg:border-b lg:border-b-red-500 lg:pb-20">
        <div className="flex-col lg:py-18 flex items-start justify-between">
          <span className="text-red-500 mb-4">Why we're different</span>
          <h1 className="text-4xl font-semibold">About Us</h1>
          <p className="text-lg my-4">
            Protect what matters today. <br />
            Contact us to request a quotation, book a site survey, or learn more
            about our home and office security packages.
          </p>
          <h3 className="text-3xl font-semibold">
            Why We're <span className="text-red-500">Better.</span>
          </h3>
          <p className="text-lg my-4">
            We are a modern, professional security solutions company providing
            home security systems, CCTV installation, trained guards, and fully
            integrated security services for residential, commercial, and
            corporate clients. <br />
            Innovating the future with Cutting Edge Technology. This includes
            CCTV, Encrypted devices and professional security men. <br />
            With a strong focus on technology, reliability, and trained
            personnel, we deliver round-the-clock protection you can trust.
          </p>
        <div className="text-red-500 gap-2 flex items-center justify-around text-xl cursor-pointer">
            <h4>Learn more</h4>
            <span>&rarr;</span>
        </div>
          <div className="border-b border-red-500 mt-16 w-4/5 mx-auto md:hidden" />
        </div>
        <div className='bg-[url("/about.png")] bg-cover bg-center rounded-lg shadow-lg shadow-gray-500'/>
        
      </div>
    </section>
  );
};

export default AboutUs;
