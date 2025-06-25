'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Split Screen on Desktop, Stacked on Mobile */}
      <section className="relative min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left Side - Image and Basic Info */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-100 via-cyan-50 to-slate-100 relative overflow-hidden flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg text-center px-4">
            {/* Profile Image Placeholder */}
            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white rounded-full mx-auto mb-8 shadow-lg flex items-center justify-center">
              <div className="w-40 h-40 lg:w-56 lg:h-56 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 lg:w-24 lg:h-24 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-light text-slate-800 mb-4 tracking-tight">
              Dr. Dashrath R Basannar
            </h1>
            <p className="text-lg text-slate-600 mb-6 font-light">
              Scientist F (Retd)
            </p>
            
            <div className="space-y-3 text-slate-600 text-sm lg:text-base">
              <p className="flex items-center justify-center gap-2 flex-wrap">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="break-all">ayrastatisticalconsultancy@gmail.com</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                +91 9420697320
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Professional Summary */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium tracking-wide">
                ABOUT DR. BASANNAR
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 tracking-tight leading-tight">
              EXPERT<br />
              STATISTICAL<br />
              CONSULTANT
            </h2>
            <p className="text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-light">
              With 32 years of distinguished service as a scientist at AFMC Pune, Dr. Basannar brings unparalleled expertise in clinical statistics, research methodology, and data analysis to academic and medical research.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
                <span className="text-slate-600 font-light text-sm lg:text-base">500+ Research Articles Reviewed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
                <span className="text-slate-600 font-light text-sm lg:text-base">32 Years of Scientific Excellence</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span className="text-slate-600 font-light text-sm lg:text-base">WHO Fellowship Recipient</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Qualifications Section */}
      <section className="py-16 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight leading-tight">
                ACADEMIC<br />
                QUALIFICATIONS
              </h2>
            </div>
            <div className="space-y-6 lg:space-y-8">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-lg lg:text-xl font-medium text-slate-800 mb-3">
                  M.Sc Mathematics with Statistics & OR
                </h3>
                <p className="text-slate-600 font-light">
                  Indian Institute of Technology, Powai
                </p>
                <p className="text-sm text-teal-600 mt-1">Specialization in Statistics and Operations Research</p>
              </div>
              
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-lg lg:text-xl font-medium text-slate-800 mb-3">
                  Master in Population Studies
                </h3>
                <p className="text-slate-600 font-light">
                  International Institute for Population Sciences, Mumbai
                </p>
                <p className="text-sm text-teal-600 mt-1">Silver Medal Recipient</p>
              </div>
              
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-lg lg:text-xl font-medium text-slate-800 mb-3">
                  Diploma in Advanced Computing
                </h3>
                <p className="text-slate-600 font-light">
                  Centre for Development of Advanced Computing (C-DAC)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section - Split Screen on Desktop, Stacked on Mobile */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Experience Details */}
        <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight leading-tight">
              EXPERTISE &<br />
              EXPERIENCE
            </h2>
            
            <div className="space-y-6 lg:space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl lg:text-2xl font-light text-teal-400">01</span>
                  <h3 className="text-base lg:text-lg font-medium text-slate-800">Clinical Research Excellence</h3>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  32 years as a scientist at AFMC Pune, reviewing 500+ research articles for prestigious medical journals including MJAFI, IJMR, and Industrial Psychiatry Journal.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl lg:text-2xl font-light text-cyan-400">02</span>
                  <h3 className="text-base lg:text-lg font-medium text-slate-800">Academic Guidance</h3>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Extensive experience guiding PhD, MD, MSc nursing, MDS, MBBS students and clinical researchers in study design, sample size estimation, and statistical analysis.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl lg:text-2xl font-light text-teal-500">03</span>
                  <h3 className="text-base lg:text-lg font-medium text-slate-800">Software Development</h3>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Developed specialized software for clinical research methodology training and sample size calculations, widely used across Maharashtra&apos;s teaching institutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Achievements */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h3 className="text-2xl lg:text-3xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight">
              AWARDS & RECOGNITION
            </h3>
            
            <div className="space-y-6 lg:space-y-8">
              <div className="bg-teal-50 p-4 lg:p-6 rounded-2xl">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Reviewer Recognition Awards</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">Medical Journal Armed Forces India (2012, 2021, 2023)</p>
              </div>
              
              <div className="bg-cyan-50 p-4 lg:p-6 rounded-2xl">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">DGAFMS Award</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">SR COL COMDT Award (2016)</p>
              </div>
              
              <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">WHO Fellowship</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">International Recognition (2017)</p>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-12 grid grid-cols-2 gap-6 lg:gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-light text-teal-600 mb-2">61</div>
                <div className="text-slate-600 text-xs lg:text-sm font-medium uppercase tracking-wide">Publications</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-light text-cyan-600 mb-2">20</div>
                <div className="text-slate-600 text-xs lg:text-sm font-medium uppercase tracking-wide">AFMRC Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications & Career Section */}
      <section className="py-16 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight">
                PUBLICATIONS & CONTRIBUTIONS
              </h2>
              
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-2">Book Author</h4>
                  <p className="text-slate-600 font-light text-sm lg:text-base">"Clinical Statistics: Basic Fundamentals"</p>
                </div>
                
                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-2">Chapter Contributions</h4>
                  <ul className="text-slate-600 font-light space-y-1 text-sm lg:text-base">
                    <li>• "Nursing Research in 21st Century" (2 chapters)</li>
                    <li>• "Text Book of Public Health and Community Medicine"</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-2">Editorial Board</h4>
                  <p className="text-slate-600 font-light text-sm lg:text-base">Association of Industrial Psychiatry of India</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight">
                CAREER JOURNEY
              </h2>
              
              <div className="space-y-3 lg:space-y-4">
                {[
                  { year: "2024", role: "Visiting Lecturer", org: "Trinity College of Engineering & Research" },
                  { year: "2024", role: "Visiting Faculty", org: "Maharashtra University of Health Sciences" },
                  { year: "2024", role: "Visiting Faculty", org: "Centre for Publication Ethics, SPPU" },
                  { year: "1991-2024", role: "Scientist", org: "Armed Forces Medical College (AFMC)" },
                  { year: "1989-91", role: "Scientist", org: "Scientific Analysis Group, DRDO" },
                  { year: "1988-89", role: "Lecturer", org: "Poona College, Statistics Department" },
                  { year: "1988", role: "Visiting Lecturer", org: "VIT, Mathematics Department" }
                ].map((position, index) => (
                  <div key={index} className="flex gap-4 lg:gap-6 pb-3 lg:pb-4 border-b border-slate-200">
                    <span className="text-teal-600 font-medium text-xs lg:text-sm w-16 lg:w-20 flex-shrink-0">{position.year}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-slate-800 font-medium text-sm lg:text-base">{position.role}</h4>
                      <p className="text-slate-600 font-light text-xs lg:text-sm break-words">{position.org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 