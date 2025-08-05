// Translations for Screening Eligibility Wizard
// Placeholder structure for future i18n implementation

export interface WizardTranslations {
  title: string;
  subtitle: string;
  age: {
    label: string;
    placeholder: string;
  };
  familyHistory: {
    label: string;
    yes: string;
    no: string;
  };
  symptoms: {
    label: string;
    options: {
      rectalBleeding: string;
      abdominalPain: string;
      fatigue: string;
      weightLoss: string;
      none: string;
    };
  };
  location: {
    label: string;
    placeholder: string;
  };
  submitButton: string;
  riskLevels: {
    high: {
      title: string;
      level: string;
      message: string;
    };
    moderate: {
      title: string;
      level: string;
      message: string;
    };
    low: {
      title: string;
      level: string;
      message: string;
    };
  };
  ctaButtons: {
    findSpecialist: string;
    bookColonoscopy: string;
    getBloodTest: string;
    learnMore: string;
  };
  disclaimer: string;
}

// Default English translations
export const defaultTranslations: WizardTranslations = {
  title: 'Screening Eligibility Wizard',
  subtitle: 'Get personalized screening recommendations based on international guidelines and your location',
  age: {
    label: 'Your Age *',
    placeholder: 'Enter your age'
  },
  familyHistory: {
    label: 'Family History of Colorectal Cancer? *',
    yes: 'Yes',
    no: 'No'
  },
  symptoms: {
    label: 'Current Symptoms (check all that apply)',
    options: {
      rectalBleeding: 'Rectal bleeding',
      abdominalPain: 'Persistent abdominal pain',
      fatigue: 'Fatigue',
      weightLoss: 'Unexplained weight loss',
      none: 'None of the above'
    }
  },
  location: {
    label: 'Your Location *',
    placeholder: 'Choose your country'
  },
  submitButton: 'Get My Screening Recommendation',
  riskLevels: {
    high: {
      title: 'High Priority Screening Recommended',
      level: 'HIGH RISK',
      message: 'Based on your age, family history, or symptoms, you should consult a healthcare provider promptly about screening options. Early detection can improve survival rates to over 90%.'
    },
    moderate: {
      title: 'Screening Recommended - Consider Your Options',
      level: 'MODERATE RISK',
      message: 'You may benefit from colorectal cancer screening. Consider discussing screening options with your healthcare provider.'
    },
    low: {
      title: 'Continue Monitoring - Stay Informed',
      level: 'LOW RISK',
      message: 'Based on your current profile, you\'re at lower risk. However, stay informed about colorectal cancer and consider screening as you age.'
    }
  },
  ctaButtons: {
    findSpecialist: 'Find a Specialist',
    bookColonoscopy: 'Book a Colonoscopy',
    getBloodTest: 'Get a Blood Test',
    learnMore: 'Learn More'
  },
  disclaimer: 'This tool is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Please consult a doctor for personalized screening recommendations.'
};

// Regional translations placeholders
export const regionalTranslations: Record<string, Partial<WizardTranslations>> = {
  SG: {
    // Singapore-specific translations (English + some local terms)
    title: 'CRC Screening Eligibility Check',
    riskLevels: {
      high: {
        message: 'Based on your risk factors, you should consult a healthcare provider promptly about screening options. HSA-cleared blood-based screening technologies are available in Singapore.'
      },
      moderate: {
        message: 'You may benefit from colorectal cancer screening. MOH recommends screening starting at age 50, or earlier with family history.'
      }
    }
  },
  IN: {
    // India-specific translations (English + Hindi placeholders)
    riskLevels: {
      high: {
        message: 'आपके जोखिम कारकों के आधार पर | Based on your risk factors, you should get screened promptly. Advanced screening is available across major Indian cities.'
      }
    }
  },
  PH: {
    // Philippines-specific translations (English + Filipino)
    title: 'Screening Eligibility Assessment | Pagsusulit sa Eligibility',
    riskLevels: {
      high: {
        message: 'Kailangan mo ng screening agad | You need screening promptly based on your risk factors. PhilHealth coverage may be available.'
      }
    }
  },
  JP: {
    // Japan-specific translations (English + Japanese)
    title: '検診適格性ウィザード | Screening Eligibility Wizard',
    riskLevels: {
      high: {
        message: 'リスク要因に基づいて | Based on your risk factors, you should consult a healthcare provider. National Health Insurance coverage available.'
      }
    }
  },
  AU: {
    // Australia-specific translations
    riskLevels: {
      high: {
        message: 'Based on your risk factors, you should get screened promptly. Consider both NBCSP and private screening options.'
      },
      moderate: {
        message: 'You may benefit from bowel cancer screening. The National Bowel Cancer Screening Program provides free testing for eligible Australians.'
      }
    }
  }
};

// Translation utility function
export const getTranslations = (countryCode: string = 'SG', locale: string = 'en'): WizardTranslations => {
  const regional = regionalTranslations[countryCode] || {};
  
  // Deep merge default translations with regional overrides
  return {
    ...defaultTranslations,
    ...regional,
    riskLevels: {
      ...defaultTranslations.riskLevels,
      ...regional.riskLevels,
      high: { ...defaultTranslations.riskLevels.high, ...regional.riskLevels?.high },
      moderate: { ...defaultTranslations.riskLevels.moderate, ...regional.riskLevels?.moderate },
      low: { ...defaultTranslations.riskLevels.low, ...regional.riskLevels?.low }
    }
  };
};

// Future implementation notes:
// 1. Add full translations for each country's primary languages
// 2. Implement proper i18n library (react-i18next, next-i18next)
// 3. Add language detection based on browser/user preference
// 4. Add language switcher UI component
// 5. Implement pluralization rules for different languages
// 6. Add RTL (right-to-left) support for Arabic markets if needed

export default { getTranslations, defaultTranslations, regionalTranslations };