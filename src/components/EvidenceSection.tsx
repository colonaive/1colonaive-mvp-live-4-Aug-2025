// src/components/EvidenceSection.tsx
import React from 'react';
import { CheckCircle, Info, TrendingUp, AlignLeft, Users, Target as TargetIcon, Rocket, HeartPulse } from 'lucide-react';
import { Container } from './ui/Container'; // Assuming Container component exists
import { Card, CardContent } from './ui/Card'; // Assuming Card components exist

// Updated import path to use the correct relative path
import SingaporeFlagIcon from '../assets/images/pillars/singapore-flag circular icon.webp';

const EvidenceSection = () => {
  return (
    <section className="bg-white dark:bg-slate-900 py-16 md:py-20 px-6" id="kaiser-evidence">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
            <span role="img" aria-label="microscope" className="mr-2">🧪</span> Real-World Evidence: 20-Year Screening Success
          </h2>
          <p className="text-lg text-center text-slate-600 dark:text-slate-400 mb-10 md:mb-12">
            One of the world's strongest validations for national CRC screening comes from the U.S.
          </p>

          {/* Grid for layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Kaiser Permanente Card */}
            <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200/80 dark:border-slate-700">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Kaiser Permanente's 20-Year CRC Program
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-5">
                  A landmark study demonstrated the profound impact of organized, population-wide CRC screening:
                </p>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Screening participation</strong> rose from 37% to over 80%</span>
                  </li>
                  <li className="flex items-start">
                    <TargetIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" /> {/* Use alias */}
                    <span><strong>CRC incidence</strong> dropped by approx. 30%</span>
                  </li>
                  <li className="flex items-start">
                     {/* Using the now imported HeartPulse */}
                     <HeartPulse className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>CRC mortality</strong> fell by nearly 50%</span>
                  </li>
                   <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Achieved via non-invasive tests & timely colonoscopy follow-up</span>
                  </li>
                </ul>
                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 italic">
                  Confirms systematic screening dramatically reduces CRC deaths nationally.
                </p>
              </CardContent>
            </Card>

            {/* Singapore Opportunity Card */}
            <Card className="bg-sky-50 dark:bg-sky-900/30 rounded-xl shadow-lg border border-sky-200/80 dark:border-sky-700/50">
              <CardContent className="p-6 md:p-8">
                {/* Updated h3 to include the flag image */}
                <h3 className="text-xl lg:text-2xl font-semibold text-sky-900 dark:text-sky-200 mb-4 flex items-center">
                  <img
                    src={SingaporeFlagIcon}
                    alt="Singapore flag"
                    // You can adjust size here. w-6 h-6 is 24px. w-7 h-7 is 28px.
                    // Match the approximate visual size of the emoji or other icons.
                    className="w-6 h-6 mr-2 flex-shrink-0"
                  />
                  Singapore's Opportunity: Go Further, Sooner
                </h3>
                <p className="text-sky-800 dark:text-sky-300 mb-5">
                  Project COLONAiVE™ builds upon this proven foundation — and advances it with:
                </p>
                <ul className="space-y-3 text-sky-800 dark:text-sky-300">
                   <li className="flex items-start">
                    <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>More sensitive, blood-based screening options</span>
                  </li>
                  <li className="flex items-start">
                    <Users className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Clinician-led coordination (GPs, labs, specialists)</span>
                  </li>
                   <li className="flex items-start">
                    <Rocket className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Digital pairing tools and real-time triaging</span>
                  </li>
                   <li className="flex items-start">
                    <AlignLeft className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Alignment with Healthier SG strategy</span>
                  </li>
                </ul>
                <p className="mt-6 text-sky-900 dark:text-sky-200 font-semibold">
                  With the right coordination, Singapore can achieve — and surpass — U.S. outcomes.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default EvidenceSection;