// Philippines Coming Soon Page
import React from 'react';
import CountryComingSoon from './CountryComingSoon';

const PhilippinesComingSoon: React.FC = () => {
  return (
    <CountryComingSoon
      country="Philippines"
      countryCode="PH"
      flag="/assets/flags/philippines-flag.png"
      currency="PHP"
      estimatedLaunch="Q3 2025"
      primaryColor="from-blue-900 via-purple-800 to-indigo-700"
      accentColor="bg-blue-600"
    />
  );
};

export default PhilippinesComingSoon;