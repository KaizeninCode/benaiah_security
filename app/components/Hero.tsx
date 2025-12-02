
import Button from "./Button";

const Hero = () => {
  return (
    <section
      id="home"
      className="lg:p-16 p-8"
    >
    
        <div className="grid md:grid-cols-2 gap-8 w-full lg:border-b lg:border-b-red-500 lg:pb-20">
          <div className="flex-col lg:py-18 flex items-start justify-between gap-12">
            <h1 className="text-6xl font-semibold">
              Your Security,
              <br /> <span className="text-red-500">Our Priority.</span>
            </h1>
            <h3 className="text-2xl">
              To become the region&apos;s leading provider of integrated
              security services by combining skilled manpower with advanced
              surveillance systems to create safe, secure environments for all.
            </h3>
            <div className="space-x-8 max-md:mx-auto">
              <Button title="Sign Up" />
              <Button title="Book Now" />
            </div>
            <div className="border-b border-red-500 mt-16 w-4/5 mx-auto md:hidden"/>
          </div>
          {/* <div className='bg-[url("/hero.jpeg")] bg-cover bg-center rounded-lg shadow-lg'> */}
          <div
            className="relative max-md:hidden"
            style={{ clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          >
            <img
              src="./hero.jpeg"
              alt="Security"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
    </section>
  );
};

export default Hero;
