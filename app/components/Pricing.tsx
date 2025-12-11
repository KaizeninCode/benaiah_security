import React from "react";
import { BsLightningCharge } from "react-icons/bs";
import { PiStackSimpleLight } from "react-icons/pi";
import { GoStack } from "react-icons/go";

const Pricing = () => {
  const plans = [
    {
      title: "Basic plan",
      icon: <BsLightningCharge/>,
      priceLabel: "Ksh 2500",
      description: "Billed annually",
      features: [
        "1 trained guard assigned",
        "Basic CCTV installation",
        "Up to 10 individual users",
        "20GB data/user",
        "Basic visitor records",
      ],
    },
    {
      title: "Standard plan",
      icon: <PiStackSimpleLight/>,
      priceLabel: "Ksh 5000",
      description: "Billed annually",
      features: [
        "1-3 Guards",
        "Day + night coverage",
        "Up to 20 individual users",
        "CCTV Installation",
        "Cloud Video backup",
      ],
    },
    {
      title: "Enterprise plan",
      icon: <GoStack/>,
      priceLabel: "Ksh 10,000",
      description: "Billed annually",
      features: [
        "Multiple guards",
        "Up-to-date visitors logs",
        "Full CCTV setup",
        "Unlimited individual data",
        "Longer data backup",
      ],
    },
  ];

  return (
    <section className="lg:px-16 lg:py-4 p-8">
      <div className="gap-8 w-full lg:border-b lg:border-b-white lg:pb-20">
        <div className="lg:w-3/5 flex flex-col items-start justify-between">
          <span className="text-red-500 mb-4">Simple, transparent pricing</span>
          <h1 className="text-4xl font-semibold mb-4">Pricing</h1>
          <p className="text-lg">
            We believe Benaiah Ulinzi group should be accessible to all
            companies, no matter the size.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {plans.map((plan, index) => (
            <div className="rounded-lg shadow-lg p-4" key={index}>
              <div className="mx-auto w-fit">
                  <div className="mx-auto mb-3 p-3 text-2xl bg-red-500 w-fit rounded-full text-white">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
                  <p className="text-center">{plan.description}</p>
              </div>
              <div className="p-4 w-4/5 mx-auto">
                {plan.features.map((feature, index) => (
                    <ul className="space-y-4 px-4 text-slate-600 list-disc" key = {index}>
                        <li className="mb-4">{feature}</li>
                    </ul>
                ))}
              </div>
              {/* <div className="text-red-500 gap-2 w-1/3 mt-4 flex items-start justify-center mx-auto cursor-pointer">
                <h4>Learn more</h4>
                <span>&rarr;</span>
              </div> */}
            </div>
          ))}
        </div>
        <div className="border-t mt-16 w-4/5 mx-auto md:hidden" />
      </div>
    </section>
  );
};

export default Pricing;
