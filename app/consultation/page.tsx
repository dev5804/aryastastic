'use client';

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Split Screen */}
      <section className="relative min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left Side - Visual/Abstract */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-100 via-cyan-50 to-slate-100 relative overflow-hidden py-16 lg:py-0">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Abstract elements representing consultation process */}
            <div className="relative w-full h-full">
              {/* Consultation flow representation */}
              <div className="absolute top-20 left-20 w-24 h-24 border-4 border-teal-300 rounded-lg opacity-60 transform rotate-12"></div>
              <div className="absolute top-32 left-40 w-4 h-4 bg-teal-500 rounded-full opacity-80"></div>
              <div className="absolute top-20 left-56 w-20 h-20 bg-cyan-300 rounded-full opacity-70"></div>
              
              {/* Flow arrows */}
              <div className="absolute top-40 left-32 w-16 h-0.5 bg-teal-400 opacity-60 rotate-45"></div>
              <div className="absolute top-48 left-48 w-16 h-0.5 bg-cyan-400 opacity-60 -rotate-45"></div>
              
              {/* Research elements */}
              <div className="absolute bottom-40 left-32 w-32 h-32 border-2 border-cyan-400 rounded-2xl opacity-50 -rotate-12"></div>
              <div className="absolute bottom-20 right-20 w-28 h-28 bg-teal-200 rounded-full opacity-60"></div>
              <div className="absolute top-60 right-32 w-6 h-6 bg-slate-300 rounded-full opacity-60"></div>
              <div className="absolute bottom-32 right-40 w-6 h-6 bg-teal-400 rounded-full opacity-70"></div>
              
              {/* Document representation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-28 bg-white/80 rounded-lg shadow-sm border border-teal-200 opacity-70"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium tracking-wide">
                CONSULTATION GUIDE
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 tracking-tight leading-tight">
              RESEARCH<br />
              CONSULTATION<br />
              REQUIREMENTS
            </h1>
            <p className="text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-light">
              Complete information guide for effective statistical consultation. Please prepare these details before your consultation session.
            </p>
          </div>
        </div>
      </section>

      {/* Basic Information Section */}
      <section className="py-16 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight leading-tight">
                BASIC<br />
                INFORMATION
              </h2>
            </div>
            <div className="space-y-6 lg:space-y-8">
              {[
                {
                  title: "Title",
                  description: "Complete research title with clear indication of the scope and focus of your study"
                },
                {
                  title: "Aim of the Study",
                  description: "Primary goal and purpose of your research investigation"
                },
                {
                  title: "Research Question",
                  description: "Specific question(s) your research aims to answer"
                },
                {
                  title: "Research Hypothesis", 
                  description: "Your predicted outcome or relationship between variables"
                },
                {
                  title: "Statistical Hypothesis",
                  description: "Null and alternative hypotheses for statistical testing"
                },
                {
                  title: "Research Objectives",
                  description: "Specific, measurable goals that support your research aim"
                }
              ].map((item, index) => (
                <div key={index} className="border-b border-slate-100 pb-6">
                  <h3 className="text-lg lg:text-xl font-medium text-slate-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-light text-sm lg:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Study Design Section - Split Screen */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Study Design */}
        <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight leading-tight">
              STUDY<br />
              DESIGN &<br />
              POPULATION
            </h2>
            
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h3 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Study Population(s)</h3>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Target population and comparison population if applicable
                </p>
              </div>
              
              <div>
                <h3 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Sample Selection</h3>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Method of sample selection and sampling technique
                </p>
              </div>
              
              <div>
                <h3 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Time Period</h3>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Duration and timeline of your research study
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Study Types */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h3 className="text-2xl lg:text-3xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight">
              STUDY DESIGN TYPES
            </h3>
            
            <div className="space-y-6 lg:space-y-8">
              <div className="bg-teal-50 p-4 lg:p-6 rounded-2xl">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Observational Studies</h4>
                <ul className="text-slate-600 font-light text-sm lg:text-base space-y-1">
                  <li>• <strong>Prospective</strong> - following participants forward in time</li>
                  <li>• <strong>Retrospective</strong> - looking back at existing data</li>
                  <li>• <strong>Cross-sectional</strong> - snapshot at one point in time</li>
                  <li>• <strong>Descriptive</strong> - describing characteristics</li>
                  <li>• <strong>Explorative</strong> - exploring relationships</li>
                </ul>
              </div>
              
              <div className="bg-cyan-50 p-4 lg:p-6 rounded-2xl">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Experimental Studies</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">
                  Randomized controlled trials, quasi-experimental designs
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Qualitative Studies</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">
                  Phenomenology, grounded theory, ethnography
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Variables Section */}
      <section className="py-16 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-6 tracking-tight">
              STUDY VARIABLES
            </h2>
            <p className="text-base lg:text-lg text-slate-600 max-w-3xl mx-auto font-light">
              Comprehensive identification and classification of all study variables
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Dependent Variables",
                subtitle: "Outcome/Response Variables",
                description: "Primary and secondary outcome measures that you want to study or predict",
                color: "teal"
              },
              {
                title: "Design Variables",
                subtitle: "Study Design Elements", 
                description: "Variables that define your study structure and methodology",
                color: "cyan"
              },
              {
                title: "Independent Variables",
                subtitle: "Predictor Variables",
                description: "Variables that may influence or predict the outcome measures",
                color: "slate"
              },
              {
                title: "Proxy Variables",
                subtitle: "With Justification",
                description: "Substitute variables used when direct measurement isn't possible. Include clear justification for why proxy variables are necessary and how they relate to the actual variables of interest.",
                color: "teal"
              },
              {
                title: "Other Variables",
                subtitle: "Additional Factors",
                description: "Confounding variables, mediators, moderators, and control variables",
                color: "cyan"
              }
            ].map((variable, index) => (
              <div key={index} className={`bg-${variable.color}-50 p-6 rounded-2xl border border-${variable.color}-100`}>
                <h3 className="text-lg font-medium text-slate-800 mb-2">{variable.title}</h3>
                <p className={`text-${variable.color}-600 text-sm font-medium mb-3`}>{variable.subtitle}</p>
                <p className="text-slate-600 font-light text-sm leading-relaxed">{variable.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section - Split Screen */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Data Collection & Analysis */}
        <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h2 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight leading-tight">
              DATA &<br />
              ANALYSIS
            </h2>
            
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h3 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Data Collection Tools</h3>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Questionnaire tools, instruments, scales, and measurement devices
                </p>
              </div>
              
              <div>
                <h3 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Effect Measures</h3>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Descriptive statistics and effect size measures for your study
                </p>
              </div>
              
              <div>
                <h3 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Statistical Analysis Scheme</h3>
                <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                  Planned statistical tests, analyses, and analytical approach
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Introduction & Methodology */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <h3 className="text-2xl lg:text-3xl font-light text-slate-800 mb-8 lg:mb-12 tracking-tight">
              INTRODUCTION & CONTEXT
            </h3>
            
            <div className="space-y-6 lg:space-y-8">
              <div className="border-l-4 border-teal-400 pl-6">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">General Overview</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">
                  Provide a general overview of the topic, then gradually narrow the focus to the specific subject
                </p>
              </div>
              
              <div className="border-l-4 border-cyan-400 pl-6">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Existing Knowledge</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">
                  What is already known about your research topic
                </p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-6">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Knowledge Gap</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">
                  What remains unknown and needs investigation
                </p>
              </div>
              
              <div className="border-l-4 border-cyan-500 pl-6">
                <h4 className="text-base lg:text-lg font-medium text-slate-800 mb-3">Purpose of Study</h4>
                <p className="text-slate-600 font-light text-sm lg:text-base">
                  Explain the question that the research is trying to solve, and why it needs to be addressed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Requirements Section */}
      <section className="py-16 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-slate-800 mb-6 tracking-tight">
              ADDITIONAL REQUIREMENTS
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-teal-50 p-6 lg:p-8 rounded-2xl">
              <h3 className="text-xl lg:text-2xl font-medium text-slate-800 mb-4">Methodology Brief</h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                Concise summary of your research methodology including approach, design, participants, 
                data collection methods, and analytical strategy.
              </p>
            </div>
            
            <div className="bg-cyan-50 p-6 lg:p-8 rounded-2xl">
              <h3 className="text-xl lg:text-2xl font-medium text-slate-800 mb-4">Master Reference Article</h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm lg:text-base">
                Key reference article that closely relates to your study design, methodology, 
                or analytical approach to guide the consultation process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 