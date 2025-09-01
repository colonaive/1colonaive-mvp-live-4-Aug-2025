import React from 'react';
import { Container } from '../../../components/ui/Container';
import { Card, CardContent } from '../../../components/ui/Card';
import { AlertCircle, Droplets, Activity, Scale, Battery, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

const EarlySymptomsOfCRC: React.FC = () => {
  const symptoms = [
    {
      icon: <Droplets className="h-6 w-6 text-red-500" />, // Icon element itself
      title: "Blood in the stool",
      description: "Can appear bright red or very dark in color"
    },
    {
      icon: <Activity className="h-6 w-6 text-blue-500" />,
      title: "Changes in bowel habits",
      description: "Including diarrhea, constipation, or stool narrowing"
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
      title: "Persistent abdominal discomfort",
      description: "Including cramps, gas, or pain"
    },
    {
      icon: <Scale className="h-6 w-6 text-purple-500" />,
      title: "Unexplained weight loss",
      description: "Losing weight without trying"
    },
    {
      icon: <Battery className="h-6 w-6 text-yellow-500" />,
      title: "Weakness or fatigue",
      description: "Feeling unusually tired or weak"
    },
    {
      icon: <Clock className="h-6 w-6 text-teal-500" />,
      title: "Incomplete bowel movements",
      description: "Feeling that the bowel doesn't empty completely"
    }
  ];

  return (
    // Consider adjusting pt-20 based on global header/layout needs
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {/* Added responsive font size */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Early Symptoms of Colorectal Cancer</h1>
            <p className="text-xl mb-0">
              Learn about the warning signs that shouldn't be ignored.
            </p>
          </div>
        </Container>
      </div>

      <section className="py-16">
        <Container>
          {/* Using max-w within Container for readable text width */}
          <div className="max-w-3xl mx-auto">
            {/* Using prose for consistent article styling */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8">
                Colorectal cancer (CRC) often develops silently, with minimal symptoms in the early stages.
                Recognizing warning signs early can be lifesaving.
              </p>

              <h2 className="text-2xl font-bold mb-6">Common Early Symptoms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {symptoms.map((symptom, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      {/* Using flex gap for spacing, added aria-hidden to icon */}
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {/* Clone element to add aria-hidden */}
                          {React.cloneElement(symptom.icon, { 'aria-hidden': true })}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">{symptom.title}</h3>
                          <p className="text-gray-600">{symptom.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Note Box - Good distinct styling */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-12">
                <h3 className="text-lg font-bold text-amber-800 mb-2">Important Note</h3>
                <p className="text-amber-700">
                  Many of these symptoms can also be caused by non-cancerous conditions such as hemorrhoids
                  or irritable bowel syndrome. However, it is crucial not to ignore them - timely evaluation
                  can make a significant difference.
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-6">Why Early Detection Matters</h2>
              {/* Stats Card - Clear emphasis */}
              <Card className="bg-gradient-to-r from-blue-50 to-teal-50 mb-12">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-4">90%</div>
                    <p className="text-xl text-gray-800 mb-4">
                      Five-year survival rate when detected early
                    </p>
                    <p className="text-gray-600">
                      Early detection not only improves treatment outcomes but often allows less invasive
                      treatments and better quality of life.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Updated Action Section */}
              <div className="bg-blue-50 rounded-lg p-8 mb-12">
                <div className="flex items-center justify-center mb-6">
                  {/* Added aria-hidden to decorative icon */}
                  <AlertCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Concerned About Symptoms?</h2>
                {/* Removed <br /> for natural text wrapping */}
                <p className="text-lg text-center mb-8">
                  If you or a loved one are experiencing any of the symptoms described above,
                  <strong> early detection through proper screening can save lives.</strong>
                </p>
                {/* Using space-y for vertical button spacing */}
                <div className="space-y-4 max-w-lg mx-auto">
                  <h3 className="text-xl font-bold text-center mb-6">Take the first step today:</h3>
                  <Link to="/screening/find-gp" className="block">
                    <Button variant="primary" className="w-full py-3 text-lg">
                      Find a GP for Screening Options
                    </Button>
                  </Link>
                  <Link to="/screening/find-specialist" className="block">
                    <Button variant="outline" className="w-full py-3 text-lg">
                      Book a Colonoscopy Consultation with a Specialist
                    </Button>
                  </Link>
                </div>
                <p className="text-center mt-8 text-gray-700 italic">
                  Project COLONAiVE™ is here to support you on your journey toward early detection, timely treatment, and peace of mind.
                </p>
              </div>

              {/* Triage Tool CTA */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">Unsure if your symptoms need a doctor's review?</h3>
                  <p className="text-green-800 mb-6">
                    Try our Triage Tool today to get personalized guidance based on your symptoms and risk factors.
                  </p>
                  <Link 
                    to="/triage"
                    className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Try Triage Tool
                  </Link>
                </div>
              </div>

              {/* Final closing text */}
              <div className="text-center border-t border-gray-200 pt-12">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Stay informed. Stay proactive.
                </p>
                <p className="text-lg text-blue-600 font-bold">
                  Project COLONAiVE™ is here to support you on your journey toward early detection and prevention.
                </p>
              </div>
            </div> {/* End prose */}
          </div> {/* End max-w-3xl */}
        </Container>
      </section>
    </div>
  );
};

export default EarlySymptomsOfCRC;