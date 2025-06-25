'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Split Screen */}
      <section className="relative min-h-screen flex pt-16">
        {/* Left Side - Visual/Abstract */}
        <div className="w-1/2 bg-gradient-to-br from-teal-100 via-cyan-50 to-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Abstract geometric shapes */}
            <div className="relative w-full h-full">
              <div className="absolute top-20 left-20 w-32 h-32 bg-teal-300 rounded-full opacity-60"></div>
              <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-300 rounded-2xl opacity-70 rotate-12"></div>
              <div className="absolute bottom-40 left-32 w-40 h-40 bg-slate-200 rounded-full opacity-50"></div>
              <div className="absolute bottom-20 right-20 w-28 h-28 bg-teal-200 rounded-2xl opacity-60 -rotate-12"></div>
              <div className="absolute top-60 left-60 w-20 h-20 bg-cyan-400 rounded-full opacity-40"></div>
              <div className="absolute top-32 left-1/2 w-36 h-36 border-4 border-teal-200 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          <div className="max-w-lg px-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium tracking-wide">
                STATISTICAL CONSULTING
              </span>
            </div>
            <h1 className="text-6xl font-light text-slate-800 mb-8 tracking-tight leading-tight">
              WE ARE<br />
              ARYA<br />
              STATISTICS
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed font-light">
              A statistical consultancy firm based in academia, specializing in research methodology and data analysis.
            </p>
            <div className="flex flex-col gap-4">
              <button className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium text-left hover:bg-teal-700 transition-all duration-300">
                Start Your Project
              </button>
              <button className="px-8 py-3 text-slate-600 rounded-lg font-medium text-left hover:text-slate-800 transition-all duration-300">
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-light text-slate-800 mb-12 tracking-tight leading-tight">
                OUR<br />
                SERVICES
              </h2>
            </div>
            <div className="space-y-12">
              {[
                {
                  number: "01",
                  title: "Statistical Analysis",
                  description: "Advanced data analysis using modern statistical methods and machine learning techniques for research excellence."
                },
                {
                  number: "02",
                  title: "Research Design",
                  description: "Expert consultation on study design, methodology, and experimental planning to ensure robust outcomes."
                },
                {
                  number: "03",
                  title: "Data Management",
                  description: "Professional data cleaning, validation, and management using industry-standard tools and practices."
                },
                {
                  number: "04",
                  title: "Publication Support",
                  description: "Statistical review and methodology validation for journal submissions and academic publications."
                }
              ].map((service, index) => (
                <div key={index} className="group border-b border-slate-100 pb-8">
                  <div className="flex items-start gap-6">
                    <span className="text-2xl font-light text-teal-400 mt-1">{service.number}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-slate-800 mb-3">{service.title}</h3>
                      <p className="text-slate-600 leading-relaxed font-light">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Split Screen */}
      <section id="about" className="min-h-screen flex">
        {/* Left Side - Content */}
        <div className="w-1/2 bg-slate-50 flex items-center justify-center">
          <div className="max-w-lg px-12">
            <h2 className="text-5xl font-light text-slate-800 mb-12 tracking-tight leading-tight">
              EXPERT<br />
              STATISTICAL<br />
              CONSULTING
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Advanced Expertise</h3>
                <p className="text-slate-600 font-light leading-relaxed">PhD-level statisticians with multi-domain experience across academia and industry.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Proven Results</h3>
                <p className="text-slate-600 font-light leading-relaxed">500+ successful projects with 98% client satisfaction rate.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Quality Assured</h3>
                <p className="text-slate-600 font-light leading-relaxed">Rigorous review process for all deliverables and methodologies.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Stats Visual */}
        <div className="w-1/2 bg-white flex items-center justify-center relative">
          <div className="grid grid-cols-2 gap-16 text-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-teal-100 rounded-full opacity-50"></div>
              <div className="text-6xl font-light text-teal-600 mb-4">500+</div>
              <div className="text-slate-600 text-sm font-medium uppercase tracking-wide">Projects</div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-cyan-100 rounded-2xl opacity-60 rotate-12"></div>
              <div className="text-6xl font-light text-cyan-600 mb-4">15+</div>
              <div className="text-slate-600 text-sm font-medium uppercase tracking-wide">Years</div>
            </div>
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 w-18 h-18 bg-teal-200 rounded-full opacity-40"></div>
              <div className="text-6xl font-light text-teal-500 mb-4">98%</div>
              <div className="text-slate-600 text-sm font-medium uppercase tracking-wide">Satisfaction</div>
            </div>
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-cyan-200 rounded-2xl opacity-50 -rotate-12"></div>
              <div className="text-6xl font-light text-cyan-500 mb-4">50+</div>
              <div className="text-slate-600 text-sm font-medium uppercase tracking-wide">Publications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Split Screen */}
      <section id="contact" className="min-h-screen flex">
        {/* Left Side - Abstract Visual */}
        <div className="w-1/2 bg-gradient-to-br from-slate-100 via-teal-50 to-cyan-100 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-32 left-24 w-40 h-40 bg-teal-200 rounded-3xl opacity-40 rotate-12"></div>
            <div className="absolute bottom-32 right-24 w-36 h-36 bg-cyan-200 rounded-full opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-teal-300 rounded-full opacity-20"></div>
            <div className="absolute top-20 right-32 w-24 h-24 bg-slate-300 rounded-2xl opacity-30 -rotate-12"></div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          <div className="max-w-lg px-12 w-full">
            <h2 className="text-5xl font-light text-slate-800 mb-12 tracking-tight leading-tight">
              GET IN<br />
              TOUCH
            </h2>
            
            <div className="space-y-6 mb-12">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Email</h3>
                <p className="text-slate-600 font-light">info@aryastatistics.com</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Response Time</h3>
                <p className="text-slate-600 font-light">Within 24 hours</p>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <input 
                  type="text" 
                  className="w-full px-0 py-4 border-0 border-b-2 border-slate-200 focus:border-teal-400 focus:ring-0 bg-transparent text-slate-800 placeholder-slate-400 transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  className="w-full px-0 py-4 border-0 border-b-2 border-slate-200 focus:border-teal-400 focus:ring-0 bg-transparent text-slate-800 placeholder-slate-400 transition-all"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  className="w-full px-0 py-4 border-0 border-b-2 border-slate-200 focus:border-teal-400 focus:ring-0 bg-transparent text-slate-800 placeholder-slate-400 transition-all"
                  placeholder="Organization"
                />
              </div>
              <div>
                <textarea 
                  rows={3} 
                  className="w-full px-0 py-4 border-0 border-b-2 border-slate-200 focus:border-teal-400 focus:ring-0 bg-transparent text-slate-800 placeholder-slate-400 transition-all resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all duration-300 mt-8"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-medium text-slate-800 mb-6">Arya Statistics</h3>
              <p className="text-slate-600 font-light leading-relaxed">
                Professional statistical consulting for researchers worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-slate-800 font-medium mb-6 uppercase tracking-wide text-sm">Services</h4>
              <ul className="space-y-3 text-slate-600 font-light">
                <li><a href="#" className="hover:text-teal-600 transition-colors">Statistical Analysis</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors">Research Design</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors">Data Management</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors">Publication Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 font-medium mb-6 uppercase tracking-wide text-sm">Company</h4>
              <ul className="space-y-3 text-slate-600 font-light">
                <li><a href="#" className="hover:text-teal-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 font-medium mb-6 uppercase tracking-wide text-sm">Contact</h4>
              <div className="space-y-3 text-slate-600 font-light">
                <p>info@aryastatistics.com</p>
                <p>+1 (555) 123-STAT</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-16 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2024 Arya Statistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
