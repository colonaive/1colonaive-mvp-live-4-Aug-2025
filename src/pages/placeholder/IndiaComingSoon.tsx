// India Coming Soon Page
import React from 'react';
import CountryComingSoon from './CountryComingSoon';

const IndiaComingSoon: React.FC = () => {
  return (
    <CountryComingSoon
      country="India"
      countryCode="IN"
      flag="/assets/flags/india-flag.png"
      currency="INR"
      estimatedLaunch="Q2 2025"
      primaryColor="from-orange-900 via-red-800 to-pink-700"
      accentColor="bg-orange-600"
    />
  );
};

export default IndiaComingSoon;