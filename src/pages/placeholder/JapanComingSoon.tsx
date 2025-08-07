// Japan Coming Soon Page
import React from 'react';
import CountryComingSoon from './CountryComingSoon';

const JapanComingSoon: React.FC = () => {
  return (
    <CountryComingSoon
      country="Japan"
      countryCode="JP"
      flag="/assets/flags/japan-flag.png"
      currency="JPY"
      estimatedLaunch="Q4 2025"
      primaryColor="from-red-900 via-pink-800 to-rose-700"
      accentColor="bg-red-600"
    />
  );
};

export default JapanComingSoon;