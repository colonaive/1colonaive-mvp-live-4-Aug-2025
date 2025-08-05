// Advanced Screening Eligibility Wizard - Phase 4 COLONAiVE SEO Strategy
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { AlertTriangle, CheckCircle, Heart, MapPin, Calendar, Users, Activity } from 'lucide-react';

interface FormData {
  age: string;
  familyHistory: 'yes' | 'no' | '';
  symptoms: string[];
  location: 'SG' | 'IN' | 'PH' | 'JP' | 'AU' | '';
}

type RiskLevel = 'low' | 'moderate' | 'high' | null;

interface CountryConfig {
  name: string;
  code: 'SG' | 'IN' | 'PH' | 'JP' | 'AU';
  standardScreeningAge: number;
  earlyScreeningAge: number;
  familyHistoryThreshold: number;
  currency: string;
  bloodTestPrice: string;
  colonoscopyPrice: string;
  screeningProgram?: string;
}

const countryConfigs: Record<string, CountryConfig> = {
  SG: {
    name: 'Singapore',
    code: 'SG',
    standardScreeningAge: 50,
    earlyScreeningAge: 40,
    familyHistoryThreshold: 40,
    currency: 'SGD',
    bloodTestPrice: '$200-$300',
    colonoscopyPrice: '$800-$1,500',
    screeningProgram: 'National CRC Screening Programme'
  },
  IN: {
    name: 'India',
    code: 'IN',
    standardScreeningAge: 45,
    earlyScreeningAge: 40,
    familyHistoryThreshold: 35,
    currency: 'INR',
    bloodTestPrice: '₹8,000-₹12,000',
    colonoscopyPrice: '₹8,000-₹25,000'
  },
  PH: {
    name: 'Philippines',
    code: 'PH',
    standardScreeningAge: 50,
    earlyScreeningAge: 40,
    familyHistoryThreshold: 30,
    currency: 'PHP',
    bloodTestPrice: '₱4,000-₱6,500',
    colonoscopyPrice: '₱15,000-₱35,000',
    screeningProgram: 'PhilHealth Coverage Available'
  },
  JP: {
    name: 'Japan',
    code: 'JP',
    standardScreeningAge: 50,
    earlyScreeningAge: 40,
    familyHistoryThreshold: 40,
    currency: 'JPY',
    bloodTestPrice: '¥20,000-¥30,000',
    colonoscopyPrice: '¥15,000-¥40,000',
    screeningProgram: 'National Health Insurance Coverage'
  },
  AU: {
    name: 'Australia',
    code: 'AU',
    standardScreeningAge: 50,
    earlyScreeningAge: 45,
    familyHistoryThreshold: 40,
    currency: 'AUD',
    bloodTestPrice: 'AUD $250-$350',
    colonoscopyPrice: 'AUD $1,000-$2,500',
    screeningProgram: 'National Bowel Cancer Screening Program'
  }
};

const ScreeningEligibilityWizard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    familyHistory: '',
    symptoms: [],
    location: ''
  });
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(null);
  const [showResults, setShowResults] = useState(false);

  const symptomOptions = [
    'Rectal bleeding',
    'Persistent abdominal pain', 
    'Fatigue',
    'Unexplained weight loss',
    'None of the above'
  ];

  // Detect user's country (placeholder for browser geolocation)
  useEffect(() => {
    // Placeholder for country detection logic
    // In production, this could use browser geolocation or IP detection
    const detectCountry = () => {
      // Default to Singapore for now
      setFormData(prev => ({ ...prev, location: 'SG' }));
    };
    
    if (!formData.location) {
      detectCountry();
    }
  }, [formData.location]);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAge = e.target.value;
    setFormData(prev => ({ ...prev, age: newAge }));
    if (showResults) {
      calculateRisk({ ...formData, age: newAge });
    }
  };

  const handleFamilyHistoryChange = (value: 'yes' | 'no') => {
    setFormData(prev => ({ ...prev, familyHistory: value }));
    if (showResults) {
      calculateRisk({ ...formData, familyHistory: value });
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    let newSymptoms: string[];
    
    if (symptom === 'None of the above') {
      newSymptoms = checked ? ['None of the above'] : [];
    } else {
      newSymptoms = checked 
        ? [...formData.symptoms.filter(s => s !== 'None of the above'), symptom]
        : formData.symptoms.filter(s => s !== symptom);
    }
    
    setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
    if (showResults) {
      calculateRisk({ ...formData, symptoms: newSymptoms });
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocation = e.target.value as FormData['location'];
    setFormData(prev => ({ ...prev, location: newLocation }));
    if (showResults) {
      calculateRisk({ ...formData, location: newLocation });
    }
  };

  const calculateRisk = (data: FormData) => {
    const age = parseInt(data.age);
    const hasSymptoms = data.symptoms.length > 0 && !data.symptoms.includes('None of the above');
    const config = countryConfigs[data.location || 'SG'];
    
    // High Risk Logic - Country specific
    if (hasSymptoms) {
      setRiskLevel('high');
      return;
    }
    
    if (data.familyHistory === 'yes') {
      if (age >= config.familyHistoryThreshold || age >= config.earlyScreeningAge) {
        setRiskLevel('high');
        return;
      }
    }
    
    if (age >= config.standardScreeningAge) {
      setRiskLevel('high');
      return;
    }
    
    // Moderate Risk Logic
    if (age >= config.earlyScreeningAge && age < config.standardScreeningAge) {
      if (data.familyHistory === 'no' && !hasSymptoms) {
        setRiskLevel('moderate');
        return;
      }
    }
    
    // Special case for Philippines - more aggressive screening for family history
    if (data.location === 'PH' && data.familyHistory === 'yes' && age >= 30) {
      setRiskLevel('moderate');
      return;
    }
    
    // Low Risk Logic
    if (age < config.earlyScreeningAge && data.familyHistory === 'no' && !hasSymptoms) {
      setRiskLevel('low');
      return;
    }
    
    // Default case
    setRiskLevel('moderate');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.age || !formData.familyHistory || !formData.location) {
      return;
    }
    
    calculateRisk(formData);
    setShowResults(true);
    
    // Analytics hook placeholder
    trackEligibilityCheck({
      country: formData.location,
      age: parseInt(formData.age),
      familyHistory: formData.familyHistory === 'yes',
      symptoms: formData.symptoms,
      riskLevel: riskLevel
    });
  };

  // Analytics placeholder function
  const trackEligibilityCheck = (data: any) => {
    // Placeholder for analytics tracking
    console.log('Eligibility check tracked:', data);
  };

  const getRiskContent = () => {
    const config = countryConfigs[formData.location || 'SG'];
    
    switch (riskLevel) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
          title: 'High Priority Screening Recommended',
          level: 'HIGH RISK',
          message: `Based on your age, family history, or symptoms, you should consult a healthcare provider promptly about screening options in ${config.name}. Early detection can improve survival rates to over 90%.`,
          bgColor: 'bg-red-50',
          borderColor: 'border-l-red-500',
          textColor: 'text-red-800',
          levelColor: 'text-red-600',
          ctaButtons: [
            { text: 'Find a Specialist', href: '/specialists', primary: true },
            { text: 'Book a Colonoscopy', href: '/get-screened#colonoscopy', primary: false },
            { text: 'Get a Blood Test', href: '/get-screened#blood-test', primary: false }
          ]
        };
      case 'moderate':
        return {
          icon: <Heart className="h-8 w-8 text-yellow-600" />,
          title: 'Screening Recommended - Consider Your Options',
          level: 'MODERATE RISK',
          message: `You may benefit from colorectal cancer screening in ${config.name}. Consider discussing screening options with your healthcare provider. ${config.screeningProgram ? `${config.screeningProgram} may be available.` : ''}`,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-l-yellow-500',
          textColor: 'text-yellow-800',
          levelColor: 'text-yellow-600',
          ctaButtons: [
            { text: 'Get a Blood Test', href: '/get-screened#blood-test', primary: true },
            { text: 'Find a Specialist', href: '/specialists', primary: false },
            { text: 'Learn More', href: '/education/patients/colorectal-cancer', primary: false }
          ]
        };
      case 'low':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-600" />,
          title: 'Continue Monitoring - Stay Informed',
          level: 'LOW RISK',
          message: `Based on your current profile, you're at lower risk. However, stay informed about colorectal cancer and consider screening as you age. Early detection is always beneficial.`,
          bgColor: 'bg-green-50',
          borderColor: 'border-l-green-500',
          textColor: 'text-green-800',
          levelColor: 'text-green-600',
          ctaButtons: [
            { text: 'Learn More', href: '/education/patients/colorectal-cancer', primary: true },
            { text: 'Get a Blood Test', href: '/get-screened#blood-test', primary: false }
          ]
        };
      default:
        return null;
    }
  };

  const riskContent = getRiskContent();
  const config = countryConfigs[formData.location || 'SG'];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 shadow-xl rounded-xl max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Screening Eligibility Wizard
        </h2>
        <p className="text-gray-700 text-base sm:text-lg">
          Get personalized screening recommendations based on international guidelines and your location
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Location Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <label htmlFor="location" className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Your Location *
          </label>
          <select
            id="location"
            value={formData.location}
            onChange={handleLocationChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg"
            required
          >
            <option value="">Choose your country</option>
            <option value="SG">🇸🇬 Singapore</option>
            <option value="IN">🇮🇳 India</option>
            <option value="PH">🇵🇭 Philippines</option>
            <option value="JP">🇯🇵 Japan</option>
            <option value="AU">🇦🇺 Australia</option>
          </select>
          {formData.location && (
            <p className="mt-2 text-sm text-gray-600">
              Screening guidelines adapted for {config.name}
            </p>
          )}
        </div>

        {/* Age Input */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <label htmlFor="age" className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Your Age *
          </label>
          <input
            type="number"
            id="age"
            min="18"
            max="100"
            value={formData.age}
            onChange={handleAgeChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg"
            placeholder="Enter your age"
            required
          />
          {formData.location && formData.age && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>{config.name} Guidelines:</strong> Standard screening at {config.standardScreeningAge}+, 
                early screening at {config.earlyScreeningAge}+ with risk factors
              </p>
            </div>
          )}
        </div>

        {/* Family History */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Family History of Colorectal Cancer? *
          </label>
          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="familyHistory"
                checked={formData.familyHistory === 'yes'}
                onChange={() => handleFamilyHistoryChange('yes')}
                className="mr-3 text-blue-600 focus:ring-blue-500 scale-125"
              />
              <span className="text-gray-900 font-medium">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="familyHistory"
                checked={formData.familyHistory === 'no'}
                onChange={() => handleFamilyHistoryChange('no')}
                className="mr-3 text-blue-600 focus:ring-blue-500 scale-125"
              />
              <span className="text-gray-900 font-medium">No</span>
            </label>
          </div>
        </div>

        {/* Symptoms Checklist */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Current Symptoms (check all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {symptomOptions.map((symptom) => (
              <label key={symptom} className="flex items-start cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(symptom)}
                  onChange={(e) => handleSymptomChange(symptom, e.target.checked)}
                  className="mr-3 mt-1 text-blue-600 focus:ring-blue-500 scale-125"
                />
                <span className="text-gray-900 font-medium">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-lg font-semibold px-12 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            disabled={!formData.age || !formData.familyHistory || !formData.location}
          >
            Get My Screening Recommendation
          </Button>
        </div>
      </form>

      {/* Results Section */}
      {showResults && riskContent && (
        <div className="mt-10 animate-fade-in">
          <div className={`${riskContent.bgColor} p-6 rounded-xl border-l-8 ${riskContent.borderColor} shadow-lg`}>
            <div className="flex items-start space-x-4">
              {riskContent.icon}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <h3 className={`font-bold text-xl ${riskContent.textColor}`}>
                    {riskContent.title}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${riskContent.levelColor} bg-white/80 mt-2 sm:mt-0`}>
                    {riskContent.level}
                  </span>
                </div>
                <p className={`${riskContent.textColor} text-base leading-relaxed mb-4`}>
                  {riskContent.message}
                </p>
                
                {/* Country-specific cost information */}
                <div className="bg-white/60 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Screening Options in {config.name}:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Blood Test:</span> {config.bloodTestPrice}
                    </div>
                    <div>
                      <span className="font-medium">Colonoscopy:</span> {config.colonoscopyPrice}
                    </div>
                  </div>
                  {config.screeningProgram && (
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Coverage:</strong> {config.screeningProgram}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contextual CTA Buttons */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {riskContent.ctaButtons.map((button, index) => (
                <a key={index} href={button.href}>
                  <Button
                    className={`${
                      button.primary
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white'
                        : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    } text-lg font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto`}
                  >
                    {button.text}
                  </Button>
                </a>
              ))}
            </div>
            
            {/* Educational link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <a 
                href={`/education/${formData.location.toLowerCase()}`} 
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                Learn more about colorectal cancer in {config.name}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Disclaimer */}
      <div className="mt-8 p-6 bg-gray-100 rounded-lg border">
        <p className="text-sm text-gray-700 text-center leading-relaxed">
          <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. 
          The recommendations are based on general screening guidelines and your self-reported information. Individual risk factors may vary, and screening decisions 
          should always be made in consultation with qualified healthcare providers who can assess your complete medical history and current health status. 
          Please consult a doctor for personalized screening recommendations.
        </p>
      </div>
    </div>
  );
};

export default ScreeningEligibilityWizard;