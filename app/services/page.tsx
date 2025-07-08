'use client';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Split Screen */}
      <section className="relative min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left Side - Visual/Abstract */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-100 via-cyan-50 to-slate-100 relative overflow-hidden py-16 lg:py-0">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Abstract elements representing statistical concepts */}
            <div className="relative w-full h-full">
              {/* Chart/Graph representation */}
              <div className="absolute top-20 left-20 w-32 h-32 border-4 border-teal-300 rounded-lg opacity-60 transform rotate-12"></div>
              <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-300 rounded-full opacity-70"></div>
              
              {/* Data points */}
              <div className="absolute bottom-40 left-32 w-4 h-4 bg-teal-500 rounded-full opacity-80"></div>
              <div className="absolute bottom-32 left-40 w-4 h-4 bg-teal-400 rounded-full opacity-80"></div>
              <div className="absolute bottom-24 left-48 w-4 h-4 bg-teal-600 rounded-full opacity-80"></div>
              
              {/* Statistical symbols */}
              <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-cyan-400 rounded-2xl opacity-50 -rotate-12"></div>
              <div className="absolute top-60 left-60 w-20 h-20 bg-slate-200 rounded-full opacity-40"></div>
              
              {/* Connect lines */}
              <div className="absolute top-32 left-1/2 w-36 h-0.5 bg-teal-200 opacity-30 rotate-45"></div>
              <div className="absolute top-1/2 right-1/3 w-24 h-0.5 bg-cyan-300 opacity-40 -rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium tracking-wide">
                OUR SERVICES
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 tracking-tight leading-tight">
              EXCEPTIONAL<br />
              STATISTICAL<br />
              SERVICES
            </h1>
            <p className="text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-light">
              Trustworthy and customized services with a guarantee based on 32 years of experience, ensuring your academic goals are successfully met well in time.
            </p>
            <div className="flex flex-col gap-4">
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-16 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-6 tracking-tight">
              COMPREHENSIVE SERVICES
            </h2>
            <p className="text-base lg:text-lg text-slate-600 max-w-3xl mx-auto font-light">
              Complete statistical consulting services from study design to publication guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                number: "01",
                title: "Choosing Appropriate Study Design",
                description: "Expert guidance in selecting the most suitable research design for your specific research questions and objectives."
              },
              {
                number: "02", 
                title: "Formulating Aim and Objectives",
                description: "Clear articulation of research aims and specific, measurable objectives that align with your study goals."
              },
              {
                number: "03",
                title: "Population Definition & Variable Selection",
                description: "Precise definition of target populations and strategic selection of study variables for optimal research outcomes."
              },
              {
                number: "04",
                title: "Sample Size Calculation",
                description: "Accurate statistical power analysis and sample size determination to ensure meaningful and valid results."
              },
              {
                number: "05",
                title: "Selection of Study Subjects",
                description: "Strategic participant recruitment and selection criteria to minimize bias and maximize representativeness."
              },
              {
                number: "06",
                title: "Randomization",
                description: "Implementation of appropriate randomization techniques to ensure unbiased treatment allocation and validity."
              },
              {
                number: "07",
                title: "Data Management & Entry Forms",
                description: "Comprehensive data management solutions including database design and data entry form creation."
              },
              {
                number: "08",
                title: "Data Analysis & Interpretation",
                description: "Advanced statistical analysis using appropriate methods with clear interpretation of results and findings."
              },
              {
                number: "09",
                title: "Questionnaire Design & Validation",
                description: "Professional questionnaire development, validation, and psychometric testing for research instruments."
              },
              {
                number: "10",
                title: "Publication Guidance",
                description: "Expert support for design and statistical issues related to manuscript preparation and journal submission."
              }
            ].map((service, index) => (
              <div key={index} className="group border-b border-slate-100 pb-6 lg:pb-8 hover:border-teal-200 transition-all duration-300">
                <div className="flex items-start gap-4 lg:gap-6">
                  <span className="text-xl lg:text-2xl font-light text-teal-400 mt-1 flex-shrink-0">{service.number}</span>
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-medium text-slate-800 mb-3 group-hover:text-teal-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light text-sm lg:text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section - Split Screen */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Content */}
        <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight leading-tight">
              OUR<br />
              GUARANTEE
            </h2>
            
            <div className="space-y-6 lg:space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
                  <h3 className="text-base lg:text-lg font-medium text-slate-800">32 Years of Experience</h3>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Three decades of proven expertise in statistical consulting and research methodology across diverse academic and medical fields.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <h3 className="text-base lg:text-lg font-medium text-slate-800">Timely Delivery</h3>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Committed to meeting your academic deadlines with efficient project management and streamlined processes.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                  <h3 className="text-base lg:text-lg font-medium text-slate-800">Quality Assurance</h3>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Rigorous quality control measures and peer review processes ensure the highest standards in all deliverables.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                  <h3 className="text-base lg:text-lg font-medium text-slate-800">Academic Success</h3>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Dedicated to helping you achieve your academic goals with personalized guidance and ongoing support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Stats */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h3 className="text-2xl lg:text-3xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight text-center">
              PROVEN TRACK RECORD
            </h3>
            
            <div className="grid grid-cols-2 gap-6 lg:gap-8 mb-12">
              <div className="text-center relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-teal-100 rounded-full opacity-50"></div>
                <div className="text-3xl lg:text-4xl font-light text-teal-600 mb-2">500+</div>
                <div className="text-slate-600 text-xs lg:text-sm font-medium uppercase tracking-wide">Articles Reviewed</div>
              </div>
              <div className="text-center relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-cyan-100 rounded-2xl opacity-60 rotate-12"></div>
                <div className="text-3xl lg:text-4xl font-light text-cyan-600 mb-2">32</div>
                <div className="text-slate-600 text-xs lg:text-sm font-medium uppercase tracking-wide">Years Experience</div>
              </div>
              <div className="text-center relative">
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-teal-200 rounded-full opacity-40"></div>
                <div className="text-3xl lg:text-4xl font-light text-teal-500 mb-2">100%</div>
                <div className="text-slate-600 text-xs lg:text-sm font-medium uppercase tracking-wide">Success Rate</div>
              </div>
              <div className="text-center relative">
                <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-cyan-200 rounded-2xl opacity-50 -rotate-12"></div>
                <div className="text-3xl lg:text-4xl font-light text-cyan-500 mb-2">24h</div>
                <div className="text-slate-600 text-xs lg:text-sm font-medium uppercase tracking-wide">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 