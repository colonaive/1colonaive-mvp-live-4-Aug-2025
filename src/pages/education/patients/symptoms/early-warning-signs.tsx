import React from 'react';
import { Link } from 'react-router-dom';
import ArticleLayout from '../../../../components/education/ArticleLayout';
import { educationArticles } from '../../../../data/education/articles';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { AlertTriangle, Clock, Stethoscope, TrendingUp, ExternalLink } from 'lucide-react';

const EarlyWarningSigns: React.FC = () => {
  const { getRelatedArticles } = useEducationContent();
  
  const articleData = educationArticles.find(article => article.slug === 'early-warning-signs');
  
  if (!articleData) {
    return <div>Article not found</div>;
  }

  const relatedArticles = getRelatedArticles(articleData.id, 3);

  return (
    <ArticleLayout article={articleData} relatedArticles={relatedArticles}>
      <div className="prose prose-lg max-w-none">
        
        {/* Critical Message */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Critical Message</h3>
              <p className="text-red-700 mb-0">
                Early detection saves lives. If you experience any persistent symptoms described in this article, 
                don't delay seeking medical attention. <span className="font-semibold">When detected early, colorectal cancer has a 90% five-year survival rate.</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-xl text-gray-700 leading-relaxed mb-8">
          Colorectal cancer is often called a "silent disease" because early stages may produce no symptoms. 
          However, as tumors grow, they create warning signs that shouldn't be ignored. Recognizing these 
          symptoms and seeking prompt medical evaluation can make the difference between early-stage, 
          highly treatable cancer and advanced disease.
        </p>

        {/* Singapore Context */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Colorectal Cancer in Singapore</h3>
              <p className="text-blue-700 mb-2">
                Colorectal cancer is Singapore's top cancer killer, affecting over 1,865 people annually. 
                Alarmingly, cases are rising among younger adults under 50, particularly rectal cancer cases.
              </p>
              <p className="text-blue-700 mb-0">
                For men, colorectal cancer ranks as the second most common cancer (1 in 23 lifetime risk), 
                while for women it's the third most common (1 in 34 lifetime risk).
              </p>
            </div>
          </div>
        </div>

        {/* Four Key Warning Signs */}
        <h2 className="text-2xl font-bold mb-6">The Four Critical Warning Signs</h2>
        
        <p className="mb-6">
          Mayo Clinic research has identified four key symptoms experienced by people diagnosed with 
          early-onset colorectal cancer in the 3 months to 2 years before their diagnosis:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm">
            <h3 className="text-lg font-semibold text-red-800 mb-3">1. Abdominal Pain</h3>
            <p className="text-gray-700 mb-3">
              Ongoing discomfort in the belly area, including cramps, gas, or pain that doesn't resolve 
              with typical remedies. This pain may be persistent or come and go.
            </p>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-red-700 mb-0">
                <strong>Key Point:</strong> Pain that persists for more than two weeks, especially with other symptoms.
              </p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-orange-500 p-6 rounded-r-lg shadow-sm">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">2. Diarrhea</h3>
            <p className="text-gray-700 mb-3">
              In younger adults with colorectal cancer, diarrhea is more common than constipation. 
              Look for loose, watery stools that persist for days or weeks.
            </p>
            <div className="bg-orange-50 p-3 rounded">
              <p className="text-sm text-orange-700 mb-0">
                <strong>Key Point:</strong> Diarrhea lasting more than a few days, especially if accompanied by pain.
              </p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm">
            <h3 className="text-lg font-semibold text-red-900 mb-3">3. Blood in Bowel Movements</h3>
            <p className="text-gray-700 mb-3">
              Blood may appear bright red or make stools look dark and tarry. Sometimes blood isn't 
              visible but shows up in medical tests as iron deficiency anemia.
            </p>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-red-700 mb-0">
                <strong>Critical:</strong> Any blood in stool should be evaluated immediately, even if intermittent.
              </p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-yellow-500 p-6 rounded-r-lg shadow-sm">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">4. Iron Deficiency Anemia</h3>
            <p className="text-gray-700 mb-3">
              Slow, hidden blood loss can lead to low iron levels, causing fatigue, weakness, 
              and pale appearance. Often detected through routine blood tests.
            </p>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-sm text-yellow-700 mb-0">
                <strong>Watch For:</strong> Unusual fatigue, shortness of breath, or pale skin tone.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Symptoms */}
        <h2 className="text-2xl font-bold mb-6">Additional Warning Signs to Monitor</h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold mb-1">Changes in Bowel Habits</h4>
              <p className="text-gray-700">
                Constipation, narrower stools, or more frequent bowel movements lasting more than a few days.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold mb-1">Feeling of Incomplete Evacuation</h4>
              <p className="text-gray-700">
                A persistent feeling that your bowel doesn't empty completely, even after a bowel movement.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold mb-1">Unexplained Weight Loss</h4>
              <p className="text-gray-700">
                Losing weight without trying, especially if accompanied by other symptoms.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold mb-1">Persistent Fatigue</h4>
              <p className="text-gray-700">
                Unusual tiredness that doesn't improve with rest, often related to anemia from blood loss.
              </p>
            </div>
          </div>
        </div>

        {/* When to See a Doctor */}
        <h2 className="text-2xl font-bold mb-6">When to Seek Medical Attention</h2>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
          <div className="flex items-start space-x-3">
            <Clock className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-3">Immediate Medical Attention Required</h3>
              
              <h4 className="font-semibold text-red-700 mb-2">See a doctor immediately if you have:</h4>
              <ul className="space-y-1 mb-4">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-red-700">Any blood in your stool (bright red or dark)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-red-700">Severe or persistent abdominal pain</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-red-700">Sudden onset of bowel changes</span>
                </li>
              </ul>

              <h4 className="font-semibold text-red-700 mb-2">Schedule an appointment within days if you have:</h4>
              <ul className="space-y-1">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-red-700">Symptoms persisting for more than 2 weeks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-red-700">Multiple symptoms occurring together</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-red-700">Unexplained weight loss or extreme fatigue</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Early vs Late Detection */}
        <h2 className="text-2xl font-bold mb-6">The Reality: Early vs. Late Detection</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Early Detection (Stage I-II)</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>90%+ five-year survival rate</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Less invasive treatment options</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Shorter recovery times</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Lower healthcare costs</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Late Detection (Stage III-IV)</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>15% or lower five-year survival rate</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>More extensive surgery required</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Longer, more difficult treatment</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Significant impact on quality of life</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Steps */}
        <h2 className="text-2xl font-bold mb-6">Your Action Plan</h2>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Take These Steps Today:</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">1</span>
              <div>
                <h4 className="font-semibold mb-1">Monitor Your Symptoms</h4>
                <p className="text-gray-700">Keep a symptom diary noting frequency, severity, and triggers</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">2</span>
              <div>
                <h4 className="font-semibold mb-1">Don't Wait</h4>
                <p className="text-gray-700">If symptoms persist more than 2 weeks or you notice blood, see a doctor immediately</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">3</span>
              <div>
                <h4 className="font-semibold mb-1">Know Your Family History</h4>
                <p className="text-gray-700">Discuss any family history of colorectal cancer with your doctor</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">4</span>
              <div>
                <h4 className="font-semibold mb-1">Consider Regular Screening</h4>
                <p className="text-gray-700">Talk to your doctor about age-appropriate screening options</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps CTAs */}
        <h2 className="text-2xl font-bold mb-6">Take Action Now</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/find-a-gp"
            className="group p-6 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              <Stethoscope className="h-6 w-6 text-red-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1 group-hover:text-red-900">Find a Doctor</h4>
                <p className="text-gray-700 text-sm group-hover:text-gray-800">
                  Don't delay - find a general practitioner or gastroenterologist near you to discuss your symptoms
                </p>
                <span className="inline-flex items-center text-red-600 text-sm font-medium mt-2 group-hover:text-red-700">
                  Search doctors <ExternalLink className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>

          <Link 
            to="/get-screened"
            className="group p-6 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              <Stethoscope className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1 group-hover:text-blue-900">Get Screened</h4>
                <p className="text-gray-700 text-sm group-hover:text-gray-800">
                  Learn about screening options available in Singapore and how to access them
                </p>
                <span className="inline-flex items-center text-blue-600 text-sm font-medium mt-2 group-hover:text-blue-700">
                  Screening options <ExternalLink className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Triage Tool CTA */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-purple-900 mb-3">Unsure if your symptoms need a doctor's review?</h3>
            <p className="text-purple-800 mb-6">
              Try our Triage Tool today to get personalized guidance based on your specific symptoms and risk factors.
            </p>
            <Link 
              to="/triage"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Triage Tool
            </Link>
          </div>
        </div>

        {/* Severe Symptoms Warning */}
        <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Severe Symptoms</h3>
              <p className="text-red-700 mb-3">
                If you experience severe abdominal pain, significant blood in stool, or signs of bowel obstruction, 
                contact your healthcare provider immediately or visit the nearest emergency department.
              </p>
              <p className="text-red-700 text-sm">
                <strong>Remember:</strong> This information is for educational purposes only and does not replace professional medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">The Bottom Line</h3>
          <p className="text-gray-700 mb-4">
            Colorectal cancer is highly treatable when caught early, but deadly when diagnosed late. 
            The warning signs exist, and recognizing them can save your life. Don't let embarrassment, 
            fear, or a busy schedule prevent you from seeking medical attention for persistent symptoms.
          </p>
          <p className="text-gray-700 font-semibold mb-0">
            Your life is worth a conversation with your doctor. Make that appointment today.
          </p>
        </div>

        {/* Related Articles */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">Continue Learning</h3>
          <div className="space-y-2">
            <Link 
              to="/education/article/understanding-colorectal-cancer"
              className="block text-orange-700 hover:text-orange-900 hover:underline"
            >
              → Understanding Colorectal Cancer: Complete Guide
            </Link>
            <Link 
              to="/education/article/colonoscopy-preparation-complete-guide"
              className="block text-orange-700 hover:text-orange-900 hover:underline"
            >
              → Colonoscopy Preparation: Step-by-Step Guide
            </Link>
            <Link 
              to="/education/patients/screening"
              className="block text-orange-700 hover:text-orange-900 hover:underline"
            >
              → Explore All Screening Options
            </Link>
          </div>
        </div>

      </div>
    </ArticleLayout>
  );
};

export default EarlyWarningSigns;