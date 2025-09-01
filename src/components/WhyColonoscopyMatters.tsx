// // src/components/WhyColonoscopyMatters.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container } from './ui/Container';
// import { Button } from './ui/Button';

// const WhyColonoscopyMatters = () => {
//   const navigate = useNavigate();

//   return (
//     // Use a lighter background like bg-slate-50 or keep white depending on flow
//     <section className="py-32 md:py-20 px-6 bg-white dark:bg-slate-900">
//       <Container>
//         <div className="max-w-4xl mx-auto text-center">
//           {/* Adjusted text colors for better contrast */}
//           <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 dark:text-blue-300 mb-6">
//             Why Colonoscopy Is Still the Gold Standard
//           </h2>
//           <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-8">
//             Understanding the most effective tool for colorectal cancer prevention and early detection.
//             Its unique ability to both detect and remove precancerous polyps makes it the gold standard.
//           </p>
//           <p className="text-xl md:text-2xl italic text-teal-700 dark:text-teal-400 font-medium max-w-3xl mx-auto mb-10">
//             "Where Treatment Begins While Screening"
//           </p>
//           {/* Buttons Added */}
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Button
//               size="lg"
//               variant="primary"
//               onClick={() => navigate('/get-screened')}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8" // Example primary style
//             >
//               Get Screened Now
//             </Button>
//             <Button
//               size="lg"
//               variant="sky"
//               className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-sky-300 dark:border-sky-300 dark:hover:bg-sky-900/40 px-8" // Example outline style
//               onClick={() => navigate('/education/patients/colonoscopy-gold-standard')}
//             >
//               Learn More
//             </Button>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default WhyColonoscopyMatters;







import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './ui/Container';
// import { Button } from './ui/Button';

const WhyColonoscopyMatters = () => {
  // const navigate = useNavigate();

  return (
    <section className=" relative overflow-hidden">
      {/* Background elements with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #0b1e3b 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}
      ></div>

      {/* Colonoscopy Section */}
      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto text-center mb-20 md:mb-32">
          {/* Animated tag */}
          <div
            className="inline-block mb-6 overflow-hidden"
            style={{
              animation: "fadeInDown 0.8s ease-out, pulse 5s ease-in-out infinite",
              animationDelay: "0s, 1s"
            }}
          >
            <span className="bg-[#25D0B1]/10 text-[#0b1e3b] px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              CRITICAL INFORMATION
            </span>
          </div>

          {/* Animated heading */}
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0b1e3b] mb-6"
            style={{
              animation: "fadeIn 1s ease-out, headingColor 5s ease-in-out infinite",
              animationDelay: "0.3s, 2s"
            }}
          >
            Why Colonoscopy is the Gold Standard
          </h2>

          {/* Animated divider */}
          <div
            className="h-1 w-24 bg-[#25D0B1] mx-auto mb-10 rounded-full"
            style={{
              animation: "scaleX 0.8s ease-out, widthPulse 5s ease-in-out infinite",
              animationDelay: "0.5s, 2s",
              transformOrigin: "center"
            }}
          ></div>

          {/* Animated paragraph */}
          <p
            className="text-lg md:text-xl text-[#0b1e3b]/80 max-w-4xl mx-auto mb-12 leading-relaxed"
            style={{
              animation: "fadeIn 1s ease-out",
              animationDelay: "0.7s"
            }}
          >
            Colonoscopy is more than just a screening test. It is the <span className="font-semibold">only method that can both detect and treat colorectal cancer at the same time.</span> Early detection and <span className="text-[#25D0B1] font-medium">removal of polyps can prevent colorectal cancer</span> before it develops.
          </p>

          {/* Quote box with animation */}
          <div
            className="relative py-10 px-6 md:px-10 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto border-l-4 border-[#25D0B1]"
            style={{
              animation: "fadeIn 1s ease-out, floatUpDown 5s ease-in-out infinite",
              animationDelay: "0.9s, 3s"
            }}
          >
            {/* Quote icon */}
            <svg className="absolute top-5 left-5 text-[#25D0B1]/20 w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            {/* Quote text */}
            <p className="text-xl md:text-2xl lg:text-3xl italic text-[#0b1e3b] font-medium">
              "Where Treatment Begins While Screening"
            </p>
          </div>
        </div>
      </Container>

      {/* SG60 Gift Section */}
      <div className="relative py-20 md:py-24">
        {/* Decorative top edge */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10"></div>

        {/* Background with animation */}
        <div
          className="absolute inset-0 bg-[#0b1e3b] z-0"
          style={{
            animation: "backgroundPulse 5s ease-in-out infinite",
            animationDelay: "2s"
          }}
        ></div>

        {/* Animated decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#25D0B1]/10 blur-3xl"
            style={{ animation: "moveAround 10s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#25D0B1]/5 blur-3xl"
            style={{ animation: "moveAround 8s ease-in-out infinite reverse" }}
          ></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated badge */}
            <div
              className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full mb-8"
              style={{
                animation: "fadeIn 1s ease-out, glowPulse 5s ease-in-out infinite",
                animationDelay: "0.2s, 1s"
              }}
            >
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D0B1] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D0B1]"></span>
              </span>
              <span className="text-[#25D0B1] font-medium tracking-wider text-sm">NATIONAL INITIATIVE</span>
            </div>

            {/* Animated heading */}
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight"
              style={{
                animation: "fadeIn 1s ease-out",
                animationDelay: "0.4s"
              }}
            >
              🎁 Our SG60 Gift:
              <span
                className="block text-[#25D0B1] mt-2"
                style={{
                  animation: "pulseText 5s ease-in-out infinite",
                  animationDelay: "1s"
                }}
              >
                A Healthier Nation, Together.
              </span>
            </h2>

            {/* Statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto my-12">
              {/* 2030 Card */}
              <div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 "
                style={{
                  animation: "fadeIn 1s ease-out, cardPulse 5s ease-in-out infinite",
                  animationDelay: "0.6s, 2s"
                }}
              >
                <p className="text-white/80 text-lg mb-2">By</p>
                <p
                  className="text-[#25D0B1] text-5xl font-bold mb-4"
                  style={{
                    animation: "scaleNumbers 5s ease-in-out infinite",
                    animationDelay: "2.5s"
                  }}
                >
                  2030
                </p>
                <p className="text-white text-xl">Reach <strong>80%</strong> screening uptake</p>
              </div>

              {/* 2035 Card */}
              <div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 "
                style={{
                  animation: "fadeIn 1s ease-out, cardPulse 5s ease-in-out infinite",
                  animationDelay: "0.8s, 2.5s"
                }}
              >
                <p className="text-white/80 text-lg mb-2">By</p>
                <p
                  className="text-[#25D0B1] text-5xl font-bold mb-4"
                  style={{
                    animation: "scaleNumbers 5s ease-in-out infinite",
                    animationDelay: "3s"
                  }}
                >
                  2035
                </p>
                <p className="text-white text-xl">Reduce deaths by <strong>80%</strong></p>
              </div>
            </div>

            {/* Mission statement */}
            <div
              className="max-w-3xl mx-auto mb-12 bg-white/5 p-6 rounded-xl border border-white/10"
              style={{
                animation: "fadeIn 1s ease-out, floatUpDown 5s ease-in-out infinite",
                animationDelay: "1s, 4s"
              }}
            >
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                This is our national contribution — powered by doctors, supported by sponsors, embraced by citizens.
                <span className="ml-2 text-white">🇸🇬</span>
              </p>
            </div>

            {/* CTA Button */}
            <Link
              to="/join-the-movement"
              className="group inline-flex items-center gap-2 bg-[#25D0B1] hover:bg-[#25D0B1]/90 text-[#0b1e3b] py-4 px-8 rounded-xl font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#25D0B1]/20"
              style={{
                animation: "fadeIn 1s ease-out, buttonGlow 5s ease-in-out infinite",
                animationDelay: "1.2s, 3s"
              }}
            >
              Be Part of This Gift
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                style={{
                  animation: "moveArrow 5s ease-in-out infinite",
                  animationDelay: "3.5s"
                }}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </Container>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes widthPulse {
          0%, 100% { width: 96px; }
          50% { width: 120px; }
        }
        
        @keyframes headingColor {
          0%, 100% { color: #0b1e3b; }
          50% { color: #25D0B1; }
        }
        
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes backgroundPulse {
          0%, 100% { background-color: #0b1e3b; }
          50% { background-color: #0a1729; }
        }
        
        @keyframes moveAround {
          0% { transform: translate(0, 0); }
          33% { transform: translate(40px, 20px); }
          66% { transform: translate(-20px, 40px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 208, 177, 0); }
          50% { box-shadow: 0 0 15px 0 rgba(37, 208, 177, 0.3); }
        }
        
        @keyframes pulseText {
          0%, 100% { text-shadow: 0 0 0 rgba(37, 208, 177, 0); }
          50% { text-shadow: 0 0 10px rgba(37, 208, 177, 0.5); }
        }
        
        @keyframes cardPulse {
          0%, 100% { transform: scale(1); border-color: rgba(255, 255, 255, 0.2); }
          50% { transform: scale(1.02); border-color: rgba(37, 208, 177, 0.4); }
        }
        
        @keyframes scaleNumbers {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 4px 6px rgba(37, 208, 177, 0.2); }
          50% { box-shadow: 0 4px 20px rgba(37, 208, 177, 0.4); }
        }
        
        @keyframes moveArrow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
      `}</style>
    </section>
  );
};

export default WhyColonoscopyMatters;
