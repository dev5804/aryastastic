"use client";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-blue-100 flex flex-col items-center justify-center pt-28">
      {/* Logo - just the image, no card or border */}
      <div className="mb-10 flex justify-center">
        <img src="/logo.png" alt="Statistical Radial Logo" className="w-40 h-40 object-contain" />
      </div>
      {/* Quote */}
      <div className="max-w-2xl w-full mb-8">
        <div className="rounded-xl px-6 py-6 text-center shadow-md bg-white/90 border border-cyan-200">
          <p className="text-lg md:text-xl font-serif font-semibold text-cyan-800 mb-2">
            “To consult the statistician after an experiment is finished is often merely to ask him to conduct a post mortem examination. He can perhaps say what the experiment died of.”
          </p>
          <p className="text-base font-bold text-cyan-600 mt-2 font-serif">Ronald Fisher</p>
        </div>
      </div>
      {/* Welcome Message */}
      <div className="max-w-2xl w-full">
        <div className="rounded-xl px-6 py-8 text-center shadow-md bg-white/90 border border-cyan-200">
          <h2 className="text-2xl md:text-3xl font-serif font-light text-cyan-700 mb-4">
            Warm welcome to the
          </h2>
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-cyan-800 mb-6">
            Ayra Statistical Consultancy and Solutions Services
          </h3>
          <p className="text-base md:text-lg font-serif font-light text-cyan-700 italic">
            I appreciate you taking the time to visit this website. Based on my 32 years of expertise advising researchers on planning, designing, collecting data, analyzing, and concluding research as well as critically judging more than 500 manuscripts, I promise that you will receive good, reliable, and trustworthy service here.
          </p>
        </div>
      </div>
    </div>
  );
} 