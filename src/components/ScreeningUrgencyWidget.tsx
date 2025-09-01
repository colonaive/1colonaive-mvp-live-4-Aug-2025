// /src/components/ScreeningUrgencyWidget.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

const ScreeningUrgencyWidget: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 shadow-xl rounded-xl max-w-5xl mx-auto border border-teal-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-800 mb-3">
          Colorectal Cancer Screening Guidelines
        </h2>
        <p className="text-teal-700 text-lg">
          Evidence-based guidance to help you understand when and how to get screened
        </p>
      </div>

      <div className="space-y-8 text-gray-800">
        
        {/* Age-Based Screening Guidelines */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">1</span>
            Age-Based Screening Guidelines
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-blue-900">🎯 Standard Risk (Age 45+)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start"><span className="text-green-600 mr-2">•</span>Begin regular screening at age 45</li>
                    <li className="flex items-start"><span className="text-green-600 mr-2">•</span>No family history of colorectal cancer</li>
                    <li className="flex items-start"><span className="text-green-600 mr-2">•</span>No concerning symptoms present</li>
                    <li className="flex items-start"><span className="text-green-600 mr-2">•</span>Multiple screening options available</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-orange-900">⚡ High Risk (Earlier Screening)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start"><span className="text-orange-600 mr-2">•</span>Family history: Start 10 years before youngest relative's diagnosis</li>
                    <li className="flex items-start"><span className="text-orange-600 mr-2">•</span>Personal history of polyps or inflammatory bowel disease</li>
                    <li className="flex items-start"><span className="text-orange-600 mr-2">•</span>Genetic syndromes (Lynch syndrome, FAP)</li>
                    <li className="flex items-start"><span className="text-orange-600 mr-2">•</span>Previous radiation to abdomen/pelvis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Symptom Awareness */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">2</span>
            When to Seek Immediate Evaluation
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-red-900">🚨 Red Flag Symptoms</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-red-600 mr-2">•</span>Rectal bleeding or blood in stool</li>
                  <li className="flex items-start"><span className="text-red-600 mr-2">•</span>Persistent change in bowel habits (&ge;2 weeks)</li>
                  <li className="flex items-start"><span className="text-red-600 mr-2">•</span>Unexplained weight loss (&gt;5% body weight)</li>
                  <li className="flex items-start"><span className="text-red-600 mr-2">•</span>Persistent abdominal pain or cramping</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-yellow-900">⚠️ Additional Concerns</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-yellow-600 mr-2">•</span>Iron deficiency anemia (unexplained)</li>
                  <li className="flex items-start"><span className="text-yellow-600 mr-2">•</span>Feeling that bowel doesn't empty completely</li>
                  <li className="flex items-start"><span className="text-yellow-600 mr-2">•</span>Narrow stools or changes in stool consistency</li>
                  <li className="flex items-start"><span className="text-yellow-600 mr-2">•</span>Persistent fatigue or weakness</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-800 font-medium">
                <span className="font-bold">Important:</span> Any of these symptoms warrant prompt medical evaluation, regardless of age. 
                Early-onset colorectal cancer (under age 50) is increasing globally.
              </p>
            </div>
          </div>
        </section>

        {/* Screening Options */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">3</span>
            Available Screening Methods
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-purple-900">🩸 Non-Invasive Testing</h4>
                <div className="space-y-3">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800">Blood-Based Screening</h5>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• HSA-cleared technologies available</li>
                      <li>• Detects circulating tumor DNA</li>
                      <li>• Convenient, no bowel preparation</li>
                      <li>• Suitable for average-risk screening</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800">FIT (Fecal Immunochemical Test)</h5>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• Annual testing recommended</li>
                      <li>• Detects hidden blood in stool</li>
                      <li>• Home collection available</li>
                      <li>• Widely available in Singapore</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-teal-900">🔬 Colonoscopy (Gold Standard)</h4>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-teal-800">Direct Visualization &amp; Prevention</h5>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Only method that prevents cancer</li>
                    <li>• Removes precancerous polyps during procedure</li>
                    <li>• Most comprehensive screening option</li>
                    <li>• Recommended every 10 years if normal</li>
                  </ul>
                  <div className="mt-3 p-3 bg-teal-100 rounded border border-teal-200">
                    <p className="text-teal-800 text-sm font-medium">
                      <span className="font-bold">Best For:</span> High-risk individuals, family history, 
                      symptoms present, or follow-up after positive screening test
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Framework */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">4</span>
            Choosing Your Screening Approach
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-indigo-500">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Your Situation</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Recommended Action</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Timeframe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">🚨 Any symptoms present</td>
                    <td className="p-4 font-medium text-red-700">Colonoscopy with specialist</td>
                    <td className="p-4 text-red-700">Urgent (within weeks)</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 text-gray-700">👨‍👩‍👧‍👦 Strong family history</td>
                    <td className="p-4 font-medium text-orange-700">Colonoscopy with specialist</td>
                    <td className="p-4 text-orange-700">Within 2-3 months</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">🎯 Age 45+ standard risk</td>
                    <td className="p-4 font-medium text-blue-700">Blood test or FIT with GP</td>
                    <td className="p-4 text-blue-700">Within 3-6 months</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 text-gray-700">✅ Previous normal colonoscopy</td>
                    <td className="p-4 font-medium text-green-700">Continue routine screening</td>
                    <td className="p-4 text-green-700">As per previous recommendations</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-700">🤔 Unsure about risk level</td>
                    <td className="p-4 font-medium text-purple-700">Consult GP for personalized plan</td>
                    <td className="p-4 text-purple-700">Within 1-2 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section>
          <div className="bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">📊 Evidence-Based Impact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">90%+</div>
                <p className="text-gray-700 text-sm mt-1">Survival rate when caught early</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">62%</div>
                <p className="text-gray-700 text-sm mt-1">Reduction in CRC mortality with screening</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">26</div>
                <p className="text-gray-700 text-sm mt-1">Lives saved per 1,000 people screened</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Horizontal Separator */}
      <hr className="border-t-2 border-teal-200 my-8" />

      {/* Call-to-Action Buttons */}
      <div className="text-center space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Ready to Take Action?</h3>
        <p className="text-gray-700 text-lg mb-6">Choose the screening approach that's right for you</p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
          {/* Get Screened CTA */}
          <div className="w-full sm:w-1/2">
            <Link to="/triage">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-lg font-semibold px-8 py-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-2xl mr-3">🩸</span>
                Get Screened
              </Button>
            </Link>
            <p className="text-sm text-gray-600 mt-3">
              Non-invasive screening with blood test or FIT
            </p>
          </div>

          {/* Get Scoped CTA */}
          <div className="w-full sm:w-1/2">
            <Link to="/find-a-specialist">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-lg font-semibold px-8 py-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-2xl mr-3">🩺</span>
                Get Scoped
              </Button>
            </Link>
            <p className="text-sm text-gray-600 mt-3">
              Direct colonoscopy with specialist
            </p>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and does not constitute medical advice. 
            Always consult with qualified healthcare professionals for personalized screening recommendations based on your individual risk factors and medical history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreeningUrgencyWidget;