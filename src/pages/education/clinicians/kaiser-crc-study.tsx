import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../components/ui/Container'; // Assuming Container handles its own padding/max-width
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ExternalLink, ArrowLeft, TrendingUp, Users, Target, Clock } from 'lucide-react';

// --- Reusable Key Finding Card Component (Internal to this file) ---
interface KeyFindingCardProps {
  icon: React.ElementType;
  iconColorClass: string;
  title: string;
  children: React.ReactNode;
}

const KeyFindingCard: React.FC<KeyFindingCardProps> = ({
  icon: Icon,
  iconColorClass,
  title,
  children,
}) => {
  return (
    <Card>
      {/* Assuming CardContent provides default padding or use p-6 here if needed */}
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon with A11y improvement and dynamic color */}
          <Icon
            className={`h-8 w-8 ${iconColorClass} flex-shrink-0`}
            aria-hidden="true"
          />
          <div>
            {/* Heading inside the card */}
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {/* Content passed as children */}
            <div className="text-muted-foreground">{children}</div> {/* Use theme color */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page Component ---
const KaiserCRCStudyPage: React.FC = () => {
  return (
    // pt-20 might be part of a global layout, keeping it here for now
    <div className="pt-32">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16 md:py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {/* Responsive heading size */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">
              Lessons from the Kaiser Permanente CRC Screening Program: How Early Detection Transforms Outcomes
            </h1>
            <p className="text-lg sm:text-xl mb-0"> {/* Slightly adjusted size */}
              A comprehensive analysis of a 20-year screening initiative that revolutionized CRC prevention
            </p>
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <main className="py-12 md:py-16 bg-background"> {/* Use theme background */}
        <Container>
          {/* Constrain content width */}
          <div className="max-w-3xl mx-auto">
            
            {/* Introduction - Applying prose more selectively */}
            <div className="prose prose-lg max-w-none text-foreground mb-12"> {/* Use theme color + prose */}
              <p className="text-xl leading-relaxed"> {/* Removed redundant text-gray-700 */}
                Widespread CRC screening initiatives have demonstrated profound impact in public health outcomes.
                One of the most robust examples is Kaiser Permanente's integrated CRC screening program, which
                achieved significant reductions in colorectal cancer incidence and mortality over a 20-year period.
                Project COLONAiVE™ draws inspiration from such success to accelerate Singapore's fight against CRC.
              </p>
            </div>

            {/* Key Findings Section */}
            <section aria-labelledby="key-findings-heading" className="mb-12">
              <h2 id="key-findings-heading" className="text-3xl font-bold mb-8">Key Program Outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KeyFindingCard
                  icon={TrendingUp}
                  iconColorClass="text-blue-600"
                  title="Reduced Incidence"
                >
                  <p>
                    CRC incidence reduced by approximately <span className="font-bold text-blue-600">33%</span>
                    through systematic screening implementation.
                  </p>
                </KeyFindingCard>

                <KeyFindingCard
                  icon={Target}
                  iconColorClass="text-teal-600"
                  title="Mortality Impact"
                >
                  <p>
                    CRC-related mortality reduced by <span className="font-bold text-teal-600">50%</span>
                    through early detection and intervention.
                  </p>
                </KeyFindingCard>

                <KeyFindingCard
                  icon={Users}
                  iconColorClass="text-purple-600"
                  title="Multiple Options"
                >
                  <p>
                    Increased uptake achieved by offering diverse screening methods tailored to patient preferences.
                  </p>
                </KeyFindingCard>

                <KeyFindingCard
                  icon={Clock}
                  iconColorClass="text-indigo-600"
                  title="Timely Follow-up"
                >
                  <p>
                    Emphasis on prompt colonoscopy referrals following positive screening results.
                  </p>
                </KeyFindingCard>
              </div>
            </section>

            {/* Singapore Application Section */}
            <section aria-labelledby="singapore-application-heading" className="mb-12">
              {/* Using Card for visual separation */}
              <Card className="bg-blue-50 border-l-4 border-blue-600">
                <CardContent className="p-6 md:p-8">
                  {/* Use prose within the content area for text/list styling */}
                   <div className="prose prose-lg max-w-none">
                      <h2 id="singapore-application-heading" className="text-2xl font-bold mb-4 !mt-0"> {/* !mt-0 to override prose margin */}
                         Application to Singapore
                      </h2>
                      <p className="text-foreground/90"> {/* Use theme color */}
                        Singapore's national CRC screening uptake remains under 40%. With the integration of convenient
                        non-invasive blood-based tests — alongside colonoscopy — Project COLONAiVE™ aims to emulate
                        and exceed Kaiser's outcomes, leading Singapore toward a future of lower CRC mortality rates
                        and earlier interventions.
                      </p>
                      <p className="text-foreground font-semibold"> {/* Use theme color */}
                        Key opportunities for improvement:
                      </p>
                      {/* space-y-2 handled by prose */}
                      <ul className="pl-5 mt-2">
                        <li>Integration of modern blood-based screening options</li>
                        <li>Enhanced follow-up protocols for positive results</li>
                        <li>Improved coordination between primary and specialist care</li>
                        <li>Data-driven monitoring of screening outcomes</li>
                      </ul>
                   </div>
                </CardContent>
              </Card>
            </section>

            {/* Reference Section */}
            <section aria-labelledby="reference-heading" className="mb-12">
              {/* Use theme background/muted */}
              <div className="bg-muted rounded-lg p-6">
                <h3 id="reference-heading" className="font-bold mb-2 text-foreground">Source Reference</h3> {/* Use theme color */}
                <p className="text-muted-foreground mb-2">Division of Research, Kaiser Permanente</p> {/* Use theme color */}
                <a
                  href="https://divisionofresearch.kaiserpermanente.org/colorectal-cancer-screen-program/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center group" // Use inline-flex and group for potential hover effects
                >
                  Visit Kaiser Permanente CRC Screening Study Page
                  <ExternalLink className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
                </a>
              </div>
            </section>

            {/* Call to Action */}
            <section aria-label="Call to action" className="mb-12">
               {/* Using a distinct visual style */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg p-8 text-center">
                <h2 className="text-xl sm:text-2xl font-bold mb-0"> {/* Adjusted size slightly */}
                  Together, by embracing screening innovations and earlier interventions, we can save lives,
                  Champion early detection, and achieve our Vision 2045.
                </h2>
              </div>
            </section>

            {/* Navigation */}
            <nav className="mt-12 flex justify-start items-center"> {/* Changed justify-between to justify-start */}
              <Link to="/education/clinicians">
                <Button variant="secondary" className="inline-flex items-center"> {/* Use inline-flex */}
                  <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                  Back to Clinician Hub
                </Button>
              </Link>
              {/* Add other navigation/actions here if needed, justify-between would make sense then */}
            </nav>

          </div>
        </Container>
      </main>
    </div>
  );
};

export default KaiserCRCStudyPage;