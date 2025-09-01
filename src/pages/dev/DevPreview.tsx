import React from 'react';

// Components to preview — import only those that exist
import AboutMovementSection from '../../components/AboutMovementSection';
import BookingButton from '../../components/BookingButton';
import BookingPopup from '../../components/BookingPopup';
import ChampionBookingRequestForm from '../../components/ChampionBookingRequestForm';
import { ChampionChoiceModal } from '../../components/ChampionChoiceModal';
import ChampionFamilyDoctorFlow from '../../components/ChampionFamilyDoctorFlow';
import ChampionPopup from '../../components/ChampionPopup';
import ChampionReferralPopup from '../../components/ChampionReferralPopup';
import { ChampionSignUpForm } from '../../components/ChampionSignUpForm';
import ChampionSmoothScreeningJourney from '../../components/ChampionSmoothScreeningJourney';
import ChampionSpecialistFinderFlow from '../../components/ChampionSpecialistFinderFlow';
import { ChatLauncher } from '../../components/ChatLauncher';
import ClinicDisplay from '../../components/ClinicDisplay';
import CrisisSection from '../../components/CrisisSection';
import { CtaSection } from '../../components/CtaSection';
import DashboardModules from '../../components/DashboardModules';
import EvidenceSection from '../../components/EvidenceSection';
import HeroSection from '../../components/HeroSection';
import { HomeSearchBar } from '../../components/HomeSearchBar';
import JoinMovementSection from '../../components/JoinMovementSection';
import NationalTargetsSection from '../../components/NationalTargetsSection';
import WhyColonoscopyMatters from '../../components/WhyColonoscopyMatters';

export default function DevPreview() {
  return (
    <div className="space-y-12 p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🧪 Component Preview Playground</h1>

      <Preview title="AboutMovementSection"><AboutMovementSection /></Preview>
      <Preview title="BookingButton"><BookingButton /></Preview>
      <Preview title="BookingPopup"><BookingPopup /></Preview>
      <Preview title="ChampionBookingRequestForm"><ChampionBookingRequestForm /></Preview>
      <Preview title="ChampionChoiceModal"><ChampionChoiceModal /></Preview>
      <Preview title="ChampionFamilyDoctorFlow"><ChampionFamilyDoctorFlow /></Preview>
      <Preview title="ChampionPopup"><ChampionPopup /></Preview>
      <Preview title="ChampionReferralPopup"><ChampionReferralPopup /></Preview>
      <Preview title="ChampionSignUpForm"><ChampionSignUpForm /></Preview>
      <Preview title="ChampionSmoothScreeningJourney"><ChampionSmoothScreeningJourney /></Preview>
      <Preview title="ChampionSpecialistFinderFlow"><ChampionSpecialistFinderFlow /></Preview>
      <Preview title="ChatLauncher"><ChatLauncher /></Preview>
      <Preview title="ClinicDisplay"><ClinicDisplay /></Preview>
      <Preview title="CrisisSection"><CrisisSection /></Preview>
      <Preview title="CtaSection"><CtaSection /></Preview>
      <Preview title="DashboardModules"><DashboardModules /></Preview>
      <Preview title="EvidenceSection"><EvidenceSection /></Preview>
      <Preview title="HeroSection"><HeroSection /></Preview>
      <Preview title="HomeSearchBar"><HomeSearchBar /></Preview>
      <Preview title="JoinMovementSection"><JoinMovementSection /></Preview>
      <Preview title="NationalTargetsSection"><NationalTargetsSection /></Preview>
      <Preview title="WhyColonoscopyMatters"><WhyColonoscopyMatters /></Preview>
    </div>
  );
}

function Preview({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-gray-200 rounded-md p-6 shadow bg-white">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">{title}</h2>
      <div>{children}</div>
    </section>
  );
}