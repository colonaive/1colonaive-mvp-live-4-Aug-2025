import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Country data with flag emojis and image paths
const countries = [
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', flagIcon: '/assets/flags/singapore-flag.png', path: '/' },
  { code: 'ph', name: 'Philippines', flag: '🇵🇭', flagIcon: '/assets/flags/philippines-flag.png', path: null },
  { code: 'in', name: 'India', flag: '🇮🇳', flagIcon: '/assets/flags/india-flag.png', path: '/in' }
];

interface CountrySelectorProps {
  className?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial selected country based on path
  const initialCountry = location.pathname.startsWith('/in')
    ? countries.find(c => c.code === 'in')
    : countries.find(c => c.code === 'sg');

  const [selectedCountry, setSelectedCountry] = useState(initialCountry || countries[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectCountry = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    if (country.path) {
      // Small delay to ensure state updates before navigation if necessary
      setTimeout(() => navigate(country.path), 0);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-sm text-white hover:text-teal-300 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Display flag image instead of emoji */}
        <img
          src={selectedCountry.flagIcon}
          alt={`${selectedCountry.name} flag`}
          className="w-5 h-3.5 mr-1.5 object-cover rounded-sm"
        />
        <span className="hidden sm:inline">{selectedCountry.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 rounded-md bg-[#0b1e3b] shadow-lg ring-1 ring-white/10 z-[9999]">
          <ul className="py-1">
            {countries.map((country) => (
              <li key={country.code}>
                <button
                  onClick={() => selectCountry(country)}
                  className={`block w-full px-4 py-2 text-sm text-left ${selectedCountry.code === country.code
                      ? 'bg-blue-600 text-white'
                      : 'text-white hover:bg-blue-700'
                    }`}
                >
                  {/* Display flag image instead of emoji */}
                  <img
                    src={country.flagIcon}
                    alt={`${country.name} flag`}
                    className="w-5 h-3.5 mr-2 inline-block object-cover rounded-sm"
                  />
                  {country.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;