// /src/components/ScreeningUrgencyWidget.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

interface FormData {
  age: string;
  familyHistory: 'yes' | 'no' | '';
  symptoms: string[];
}

type RiskLevel = 'low' | 'moderate' | 'high' | null;

const ScreeningUrgencyWidget: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    familyHistory: '',
    symptoms: []
  });
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(null);

  const symptomOptions = [
    'Rectal bleeding',
    'Unexplained weight loss',
    'Persistent abdominal pain',
    'Fatigue',
    'None of the above'
  ];

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, age: e.target.value }));
    calculateRisk({ ...formData, age: e.target.value });
  };

  const handleFamilyHistoryChange = (value: 'yes' | 'no') => {
    setFormData(prev => ({ ...prev, familyHistory: value }));
    calculateRisk({ ...formData, familyHistory: value });
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
    calculateRisk({ ...formData, symptoms: newSymptoms });
  };

  const calculateRisk = (data: FormData) => {
    const age = parseInt(data.age);
    const hasSymptoms = data.symptoms.length > 0 && !data.symptoms.includes('None of the above');
    
    // High Risk Logic
    if ((age >= 45 && data.familyHistory === 'yes') || hasSymptoms) {
      setRiskLevel('high');
    }
    // Moderate Risk Logic  
    else if (age >= 45 && data.familyHistory === 'no' && !hasSymptoms) {
      setRiskLevel('moderate');
    }
    // Low Risk Logic
    else if (age < 45 && data.familyHistory === 'no' && !hasSymptoms) {
      setRiskLevel('low');
    }
    // Incomplete data
    else {
      setRiskLevel(null);
    }
  };

  const getRiskContent = () => {
    switch (riskLevel) {
      case 'high':
        return {
          icon: '🔴',
          title: 'High Risk',
          message: 'Based on your risk factors, you should consult a healthcare provider promptly about screening options. Modern blood-based screening technologies have demonstrated improved detection of early-stage disease and are being evaluated by Singapore\'s Health Sciences Authority.',
          bgColor: 'bg-red-50',
          borderColor: 'border-l-red-500',
          textColor: 'text-red-800'
        };
      case 'moderate':
        return {
          icon: '🟡',
          title: 'Moderate Risk',
          message: 'You may benefit from colorectal cancer screening. Modern screening technologies, including blood-based tests, offer improved detection capabilities. Early detection can improve survival rates to over 90% for early-stage disease.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-l-yellow-500',
          textColor: 'text-yellow-800'
        };
      case 'low':
        return {
          icon: '🟢',
          title: 'Low Risk',
          message: 'Advanced blood-based screening technologies are being evaluated by Singapore\'s Health Sciences Authority. These tests have demonstrated improved detection of early-stage disease compared to traditional methods in clinical studies.',
          bgColor: 'bg-green-50',
          borderColor: 'border-l-green-500',
          textColor: 'text-green-800'
        };
      default:
        return null;
    }
  };

  const riskContent = getRiskContent();

  return (
    <div className="bg-teal-50 p-6 shadow-xl rounded-xl max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-800 mb-2">
          Assess Your Screening Urgency
        </h2>
        <p className="text-teal-700 text-sm sm:text-base">
          Quick assessment to understand how urgently you should get screened
        </p>
      </div>

      <form className="space-y-6">
        {/* Age Input */}
        <div>
          <label htmlFor="age" className="block text-sm font-semibold text-teal-800 mb-2">
            Your Age *
          </label>
          <input
            type="number"
            id="age"
            min="18"
            max="100"
            value={formData.age}
            onChange={handleAgeChange}
            className="w-full px-4 py-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
            placeholder="Enter your age"
            required
          />
        </div>

        {/* Family History */}
        <div>
          <label className="block text-sm font-semibold text-teal-800 mb-3">
            Family History of Colorectal Cancer? *
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="familyHistory"
                checked={formData.familyHistory === 'yes'}
                onChange={() => handleFamilyHistoryChange('yes')}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="familyHistory"
                checked={formData.familyHistory === 'no'}
                onChange={() => handleFamilyHistoryChange('no')}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-semibold text-teal-800 mb-3">
            Current Symptoms (check all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {symptomOptions.map((symptom) => (
              <label key={symptom} className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(symptom)}
                  onChange={(e) => handleSymptomChange(symptom, e.target.checked)}
                  className="mr-3 mt-1 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700 text-sm">{symptom}</span>
              </label>
            ))}
          </div>
        </div>
      </form>

      {/* Risk Assessment Result */}
      {riskContent && (
        <div className="mt-8 animate-fade-in">
          <div className={`${riskContent.bgColor} p-4 rounded-lg border-l-4 ${riskContent.borderColor}`}>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{riskContent.icon}</span>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${riskContent.textColor}`}>
                  {riskContent.title}
                </h3>
                <p className={`mt-1 ${riskContent.textColor}`}>
                  {riskContent.message}
                </p>
                <p className={`mt-3 text-sm ${riskContent.textColor} italic border-t pt-3 border-gray-300`}>
                  <em>This triage result does not constitute medical advice. Always consult a licensed healthcare provider to make decisions about screening and diagnosis.</em>
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Referral Buttons */}
          <div className="mt-6 space-y-4">
            {riskLevel === 'high' && (
              <div className="text-center">
                <Link to="/find-specialist">
                  <Button className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                    Book a Colonoscopy Specialist
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  Connect with gastroenterologists and colorectal specialists in Singapore
                </p>
              </div>
            )}
            
            {riskLevel === 'moderate' && (
              <div className="text-center">
                <Link to="/find-a-gp">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                    Find a GP Near You
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  Locate general practitioners for screening consultation
                </p>
              </div>
            )}
            
            {riskLevel === 'low' && (
              <div className="text-center">
                <Link to="/get-screened">
                  <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                    Learn About Screening Options
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  Explore available screening methods and stay informed
                </p>
              </div>
            )}
            
            {/* Secondary CTA for all risk levels */}
            {riskLevel && (
              <div className="text-center pt-4 border-t border-gray-200">
                <Link to="/education/faqs" className="text-teal-600 hover:text-teal-800 underline text-sm">
                  Have questions? Visit our FAQ section
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          <strong>Disclaimer:</strong> This assessment is for informational purposes only and does not replace professional medical advice. 
          Please consult with your healthcare provider for personalized screening recommendations.
        </p>
      </div>
    </div>
  );
};

export default ScreeningUrgencyWidget;