// /home/project/src/components/StatsSection.tsx
import React from 'react';
import { Container } from './ui/Container';

interface StatItemProps {
  value: string;
  label: string;
  description: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, description }) => {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{value}</div>
      <div className="text-xl font-semibold mb-2">{label}</div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// CORRECTED: Converted from a named export to a default export for consistency.
const StatsSection: React.FC = () => {
  return (
    <section className="py-20 bg-blue-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">The Impact of Early Detection</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding the statistics behind colorectal cancer helps illustrate 
            why our movement is so important.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem
            value="90%"
            label="Survival Rate"
            description="When detected early, the 5-year survival rate for colorectal cancer is about 90%."
          />
          <StatItem
            value="50%"
            label="Preventable"
            description="Nearly half of all colorectal cancer cases could be prevented with regular screening."
          />
          <StatItem
            value="#1"
            label="Most Common Cancer"
            description="Colorectal cancer is the most common cancer among men in Singapore."
          />
          <StatItem
            value="50+"
            label="Colonoscopy Age"
            description="International Guidelines recommend scoping once every 10 years starting at age 50."
          />
        </div>

        <div className="mt-16 p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4">Time is of the Essence</h3>
              <p className="text-gray-600 mb-4">
                Colorectal cancer typically develops slowly over several years. This provides a critical 
                window of opportunity for early detection and intervention.
              </p>
              <p className="text-gray-600">
                By the time symptoms appear, the cancer may have advanced. That's why regular screening 
                is essential—it can detect cancer before symptoms develop, when treatment is most effective.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="h-48 w-48 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-100">
                <div className="text-center px-4">
                  <div className="text-4xl font-bold text-blue-600 mb-2">4–6%</div>
                  <div className="text-gray-700 text-sm leading-tight">
                    Lifetime risk of developing colorectal cancer
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Data based on Singapore Cancer Registry estimates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default StatsSection;

