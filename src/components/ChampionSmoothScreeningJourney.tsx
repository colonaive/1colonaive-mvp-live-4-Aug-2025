import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button'; // Assuming this is a styled button component
import { Card, CardContent } from './ui/Card'; // Assuming these are styled card components
import { UserPlus, Stethoscope, HelpCircle } from 'lucide-react';

// Define step types for better type safety and readability
type ScreeningStep = 'start' | 'familydoctor' | 'specialist' | 'help';

const ChampionSmoothScreeningJourney: React.FC = () => {
  // Use the defined type for state
  const [step, setStep] = useState<ScreeningStep>('start');
  const navigate = useNavigate();

  // Data structure for step content to reduce repetition
  const stepContent = {
    familydoctor: {
      title: 'Family Doctor Route',
      description:
        "If you already have a trusted GP, it's great to consult them for your CRC screening plan. They can guide you through the screening process and refer you to a specialist if needed.",
      ctaText: 'Find a GP',
      ctaLink: '/clinics', // Assuming '/clinics' lists GPs too
    },
    specialist: {
      title: 'Specialist Route',
      description:
        'Consulting a colorectal surgeon or gastroenterologist is a direct way to arrange your colonoscopy or evaluation. They specialize in colorectal health and can provide comprehensive screening services.',
      ctaText: 'Find a Specialist',
      ctaLink: '/clinics', // Assuming '/clinics' lists specialists too
    },
    help: {
      title: 'Need Help Deciding?',
      description: null, // Use null for unique content sections
      ctaText: 'Explore Available Doctors',
      ctaLink: '/clinics',
    },
  };

  // Helper function to render common step layouts
  const renderStepContent = (stepKey: 'familydoctor' | 'specialist' | 'help') => {
    const content = stepContent[stepKey];
    if (!content) return null;

    return (
      // Add aria-live for screen reader announcements on content change
      <div className="text-center space-y-6" aria-live="polite">
        <h3 className="text-xl font-semibold text-blue-700">{content.title}</h3>
        {content.description && (
          <p className="text-gray-700">{content.description}</p>
        )}

        {/* Specific content for the 'help' step */}
        {stepKey === 'help' && (
          <div className="text-gray-700 space-y-4">
            <p>
              No worries, Champion! Here's a simple guide:
            </p>
            {/* Use more semantic list styling if available, or keep simple */}
            <ul className="text-left list-disc list-inside space-y-2 max-w-md mx-auto pl-4">
              {/* Removed custom bullet, using standard list style */}
              <li>
                If you're healthy but overdue for screening, starting with a GP is a good choice.
              </li>
              <li>
                If you have concerning symptoms, seeing a specialist directly may be faster.
              </li>
            </ul>
          </div>
        )}

        {/* Consistent Button Section */}
        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
          <Button
            variant="primary"
            className="w-full sm:w-auto" // Keep responsiveness
            onClick={() => navigate(content.ctaLink)}
          >
            {content.ctaText}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto" // Keep responsiveness
            onClick={() => setStep('start')}
          >
            Back to Options
          </Button>
        </div>
      </div>
    );
  };

  return (
    // Consider responsive padding
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6 sm:p-8"> {/* Adjusted padding */}
        {step === 'start' && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-primary"> {/* Use semantic color if defined */}
              Start Your Screening Journey, Champion!
            </h2>
            <p className="text-foreground-muted"> {/* Use semantic color if defined */}
              Before we guide you, may we ask — who do you prefer to consult first?
            </p>
            {/* Grid layout remains similar, check button styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Potential Button Refinement: Move common styles to Button component variants if possible */}
              <Button
                variant="primary"
                onClick={() => setStep('familydoctor')}
                // Consider adjusting padding if `py-6` is too large, or keep if intentional
                className="flex items-center justify-center space-x-2 py-4"
              >
                <UserPlus className="h-5 w-5 mr-2" aria-hidden="true" /> {/* Added aria-hidden, adjusted spacing slightly */}
                <span>My Family Doctor (GP)</span>
              </Button>
              <Button
                variant="secondary" // Assuming this variant exists and is styled appropriately
                onClick={() => setStep('specialist')}
                className="flex items-center justify-center space-x-2 py-4"
              >
                <Stethoscope className="h-5 w-5 mr-2" aria-hidden="true" />
                <span>A Specialist</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('help')}
                // Explain complex class: Centers button on sm, spans full on lg if needed
                className="flex items-center justify-center space-x-2 py-4 col-span-1 sm:col-span-2 lg:col-span-1" // Kept original span logic
              >
                <HelpCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                <span>I'm Not Sure</span>
              </Button>
            </div>
          </div>
        )}

        {/* Render subsequent steps using the helper function */}
        {step === 'familydoctor' && renderStepContent('familydoctor')}
        {step === 'specialist' && renderStepContent('specialist')}
        {step === 'help' && renderStepContent('help')}
      </CardContent>
    </Card>
  );
};

export default ChampionSmoothScreeningJourney;