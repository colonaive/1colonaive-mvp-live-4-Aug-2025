// /src/components/HeroSection1.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Container } from './ui/Container';

const HeroSection1: React.FC = () => {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat text-white overflow-hidden"
      style={{
        backgroundImage: `url(/images/hero-pillar-team.webp)`,
        backgroundPosition: 'center 60%',
        backdropFilter: 'blur(4px)', // Not all browsers support, but included
      }}
    >
      {/* Darker Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 backdrop-blur-sm" />
      
      {/* Content */}
      <Container className="relative z-10 pt-16 md:pt-20 pb-12 md:pb-16 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          
          {/* Enhanced Urgency Tag with Hope Balance */}
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg tracking-wider">
              SINGAPORE'S #1 CANCER THREAT - BUT 95% SURVIVAL WHEN DETECTED EARLY
            </span>
          </div>

          {/* Credibility Signal */}
          <div className="mb-4">
            <p className="text-base sm:text-lg text-blue-200 font-medium"
               style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              Clinician-led movement backed by Singapore's leading colorectal surgeons and gastroenterologists
            </p>
          </div>
          
          {/* Main Headline with Bolder Shadow */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6"
              style={{
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)'
              }}>
            Screening Saves Lives. <span className="text-green-400">New Study Shows 26 Lives Saved per 1,000.</span>
          </h1>
          
          {/* Subtext with More Visibility */}
          <p className="text-xl sm:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto font-medium"
             style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.85)' }}>
            Every day, <span className="font-bold text-red-300">3 Singaporeans</span> are diagnosed with late-stage colorectal cancer. Early screening gives you a <span className="font-bold text-green-300">95% survival chance.</span>
          </p>

          {/* Primary CTA Button */}
          <div className="mb-8">
            <Link to="/get-screened">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xl font-bold px-12 py-5 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                Get Screened Now
              </Button>
            </Link>
          </div>

          {/* Lives Saved Counter */}
          <div className="mb-8 p-6 bg-black/30 rounded-xl shadow-xl backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-bold text-green-300 animate-pulse"
               style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              🚑 Lives Saved So Far: <span className="text-4xl text-green-200">8,412</span>
            </p>
          </div>
          
          {/* Secondary CTA Button */}
          <div className="flex justify-center">
            <Link to="/join-movement">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-xl transition-transform transform hover:scale-105">
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection1;