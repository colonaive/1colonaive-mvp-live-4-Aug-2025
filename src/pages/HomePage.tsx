// src/pages/HomePage.tsx
import React from 'react';

import HeroSection from "../components/HeroSection";
import CrisisSection from "../components/CrisisSection";
import WhyColonoscopyMatters from "../components/WhyColonoscopyMatters";
import ScreeningUrgencyWidget from "../components/ScreeningUrgencyWidget";
import BloodScreeningSection from "../components/BloodScreeningSection";
import PillarsSection from "../components/PillarsSection";
import EvidenceSection from "../components/EvidenceSection";
import NationalTargetsSection from "../components/NationalTargetsSection";
import JoinMovementSection from "../components/JoinMovementSection";
import { RegionalScreeningCTA } from "../components/SEOPageList";

const HomePage: React.FC = () => {
  return (
    <>
      {/* ✅ Hero section */}
      <HeroSection />

      {/* ✅ Screening Urgency Widget (must come immediately after hero) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScreeningUrgencyWidget />
        </div>
      </section>

      <CrisisSection />
      <WhyColonoscopyMatters />
      <BloodScreeningSection />
      <PillarsSection />
      <EvidenceSection />
      
      {/* Regional Screening Options */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <RegionalScreeningCTA />
        </div>
      </section>
      
      <NationalTargetsSection />
      <JoinMovementSection />

      <div className="hidden md:block fixed bottom-5 right-5 z-40">
        {/* <UpcomingEventsPopup /> */}
      </div>
    </>
  );
};

export default HomePage;
