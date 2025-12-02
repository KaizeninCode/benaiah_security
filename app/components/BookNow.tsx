import React from "react";
import { IconBase } from "react-icons";
import { CiLock } from "react-icons/ci";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";

const BookNow = () => {
  const features = [
    {
      title: "Home Security",
      description:
        "We help homeowners protect their families and property through comprehensive solutions.",
        icon: <CiLock />,
    },
    {
      title: "Physical Security",
      description:
        "Our licensed security guards are trained to maintain safety, enforce access rules, and respond to emergencies professionally.",
        icon: <IoShieldCheckmark />,
    },
    {
      title: "Office Security",
      description:
        "We combine technology and manpower to build secure, efficient workplaces.",
        icon: <FaCamera />,
    },
  ];
  return (
    <section className="lg:px-16 lg:py-4 p-8">
      <div className="gap-8 w-full lg:border-b lg:border-b-red-500 lg:pb-20">
        <div className="lg:w-3/5 flex flex-col items-start justify-between">
          <span className="text-red-500 mb-4">Features</span>
          <h1 className="text-4xl font-semibold mb-4">Book Now</h1>
          <p className="text-xl">
            Take the first step toward a safer environment. Our team of trained
            guards, certified security technicians, and expert risk assessors
            are ready to help secure your home, office, or property. Book now
            and we&apos;ll arrange a consultation to understand your needs and
            provide a customized, reliable security solution.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <div className="rounded-lg bg-slate-100 p-4" key={index}>
                <div className="mb-10 p-3 text-2xl bg-red-500 w-fit rounded-xl text-white">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-lg">{feature.description}</p>
              <div className="text-red-500 gap-2 w-1/3 mt-4 flex items-start justify-center mx-auto cursor-pointer">
                <h4>Learn more</h4>
                <span>&rarr;</span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-b border-red-500 mt-16 w-4/5 mx-auto md:hidden" />
      </div>
    </section>
  );
};

export default BookNow;
