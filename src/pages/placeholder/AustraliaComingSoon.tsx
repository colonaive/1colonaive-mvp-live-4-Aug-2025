// Australia Coming Soon Page
import React from 'react';
import CountryComingSoon from './CountryComingSoon';

const AustraliaComingSoon: React.FC = () => {
  return (
    <CountryComingSoon
      country="Australia"
      countryCode="AU"
      flag="/assets/flags/australia-flag.png"
      currency="AUD"
      estimatedLaunch="Q1 2025"
      primaryColor="from-blue-900 via-green-800 to-yellow-700"
      accentColor="bg-green-600"
    />
  );
};

export default AustraliaComingSoon;