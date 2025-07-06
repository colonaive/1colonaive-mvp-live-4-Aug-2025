// src/pages/HomePage.tsx
import React from 'react';

// ✅ The old HeroSection is commented out safely
// import HeroSection from "../components/HeroSection";

// ✅ Correct import of the new full-screen HeroSection1
import HeroSection1 from "../components/HeroSection1";

import CrisisSection from "../components/CrisisSection";
import WhyColonoscopyMatters from "../components/WhyColonoscopyMatters";
import BloodScreeningSection from "../components/BloodScreeningSection";
import SG60GiftSection from "../components/SG60GiftSection";
import PillarsSection from "../components/PillarsSection";
import EvidenceSection from "../components/EvidenceSection";
import NationalTargetsSection from "../components/NationalTargetsSection";
import JoinMovementSection from "../components/JoinMovementSection";

const HomePage: React.FC = () => {
  return (
    <>
      {/* ✅ Render the new HeroSection1 */}
      <HeroSection1 />

      <CrisisSection />
      <WhyColonoscopyMatters />

      {/* ✅ New section focused on blood-based screening */}
      <BloodScreeningSection />

      {/* <SG60GiftSection /> */}
      <PillarsSection />
      <EvidenceSection />
      <NationalTargetsSection />
      <JoinMovementSection />

      <div className="hidden md:block fixed bottom-5 right-5 z-40">
        {/* <UpcomingEventsPopup /> */}
      </div>
    </>
  );
};

export default HomePage;
