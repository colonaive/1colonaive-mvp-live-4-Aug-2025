// /src/components/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Container } from './ui/Container';

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat text-white overflow-hidden"
      style={{
        backgroundImage: `url(/public/assets/hero-bg-v2.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Professional Darkened Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 z-0" />
      
      {/* Content */}
      <Container className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-8 text-center">
        <div className="max-w-5xl mx-auto animate-fade-in">
          
          {/* Credibility Badge */}
          <div className="mb-8 animate-slide-up">
            <span className="inline-block bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm text-white text-sm font-semibold px-6 py-3 rounded-full shadow-2xl border border-white/20">
              Clinician-Led National Movement • Singapore's Leading Medical Experts
            </span>
          </div>
          
          {/* Main Headline - Bold & Uppercase */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-8 tracking-tight text-shadow-xl animate-slide-up">
            Screening Saves Lives.
            <br />
            <span className="text-emerald-400 font-black">New Study Shows 26 Lives Saved per 1,000.</span>
          </h1>
          
          {/* Subheading - Serious but Hopeful */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-12 max-w-4xl mx-auto font-medium leading-relaxed text-shadow-lg animate-slide-up animation-delay-200">
            Every day, <span className="font-bold text-red-300">3 Singaporeans</span> are diagnosed with late-stage colorectal cancer.
            <br className="hidden sm:block" />
            Early screening gives you a <span className="font-bold text-emerald-300">95% survival chance.</span>
          </p>

          {/* CTA Section */}
          <div className="space-y-8 animate-slide-up animation-delay-400">
            
            {/* Primary CTA Button */}
            <div>
              <Link to="/get-screened">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xl font-bold px-14 py-6 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-3xl border border-white/20 backdrop-blur-sm">
                  Get Screened Now
                </Button>
              </Link>
            </div>

            {/* Lives Saved Counter Placeholder */}
            <div className="p-6 bg-black/10 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-500/20">
              <p className="text-lg sm:text-xl font-medium text-neutral-400 italic text-shadow-md">
                🔄 Real-time Lives Saved Counter: Updating Soon (Backed by Verified Screenings)
              </p>
              <p className="text-sm text-neutral-500 mt-2 italic text-shadow-sm">
                This feature will reflect live, verified screening completions once available.
              </p>
            </div>
            
            {/* Secondary CTA Button */}
            <div>
              <Link to="/signup/champion">
                <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-lg font-semibold px-10 py-4 rounded-xl shadow-xl transition-all duration-500 transform hover:scale-105 border border-white/10 backdrop-blur-sm">
                  Join the Movement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;