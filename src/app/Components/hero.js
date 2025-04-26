import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#031626] opacity-90"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            ...YOUR PATHWAY
            <br />
            TO TECH EXCELLENCE...
          </h1>

          {/* Hero Image */}
          <div className="relative w-64 h-64 mx-auto my-12">
            <Image
              src="/Screen Shot 2025-04-18 at 10.26.05 PM.png"
              alt="Hero Globe"
              width={256}
              height={256}
              className="object-contain"
            />
          </div>

          {/* Button */}
          <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
