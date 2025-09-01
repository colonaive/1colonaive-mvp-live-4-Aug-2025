import React from 'react';
import ArticleLayout from '../../../../components/education/ArticleLayout';
import { educationArticles } from '../../../../data/education/articles';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import {
  Search,
  Shield,
  Microscope,
  Clock,
  ShieldCheck,
  CheckCircle,
  Heart,
  Users,
  ArrowRight,
  AlertCircle,
  Star
} from 'lucide-react';

const ColonoscopyGoldStandard: React.FC = () => {
  const { getRelatedArticles } = useEducationContent();
  
  const articleData = educationArticles.find(article => article.id === 'colonoscopy-gold-standard-001');
  
  if (!articleData) {
    return <div>Article not found</div>;
  }

  const relatedArticles = getRelatedArticles(articleData.id, 3);

  return (
    <ArticleLayout article={articleData} relatedArticles={relatedArticles}>
      <div className="space-y-8">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed">
            When it comes to preventing colorectal cancer, no screening method has proven more effective than colonoscopy. 
            Colonoscopy is commonly considered the gold standard because it directly assesses the physical presence of lesions in the colon. 
            Its unique ability to both detect and remove precancerous polyps in a single procedure makes it the cornerstone of colorectal cancer prevention.
          </p>
        </div>

        {/* Hero Statistics */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-blue-800">Why Colonoscopy is the Gold Standard</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50%</div>
              <p className="text-gray-700">Reduction in colorectal cancer deaths when people actually undergo colonoscopy</p>
              <p className="text-sm text-gray-500 mt-2">Source: New England Journal of Medicine, 2022</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">95%</div>
              <p className="text-gray-700">Detection rate for advanced adenomas and polyps</p>
              <p className="text-sm text-gray-500 mt-2">Source: Medical literature review</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10</div>
              <p className="text-gray-700">Years between screenings with normal results</p>
              <p className="text-sm text-gray-500 mt-2">Source: Clinical guidelines</p>
            </div>
          </div>
        </div>

        {/* Scoped In Time | Saved In Time Banner - FIXED RESPONSIVE */}
        <div className="relative bg-gradient-to-r from-blue-700 via-teal-600 to-cyan-500 rounded-xl p-12 text-white text-center overflow-hidden mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            
            {/* FIXED: Changed responsive breakpoints from sm: to lg: */}
            <h2 className="text-3xl hidden lg:block font-bold mb-4 tracking-tight">
              <span className="text-cyan-200">Scoped In Time</span>
              <span className="mx-4 text-white text-6xl">|</span>
              <span className="text-yellow-200">Saved In Time</span>
            </h2>
            <h2 className="text-2xl block lg:hidden font-bold mb-4 tracking-tight">
              <span className="text-cyan-200">Scoped In Time</span>
              <span className="mx-2 text-white text-3xl">|</span>
              <span className="text-yellow-200">Saved In Time</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              Where screening meets treatment in a single procedure — the ultimate in preventive medicine
            </p>
            
            {/* FIXED: Changed responsive breakpoints */}
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-8 text-lg">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-300 mr-2" />
                <span>Detect</span>
              </div>
              <div className="hidden lg:flex items-center">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-yellow-300 mr-2" />
                <span>Remove</span>
              </div>
              <div className="hidden lg:flex items-center">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-red-300 mr-2" />
                <span>Prevent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Begins While Screening */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-8 border-2 border-teal-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-teal-800 mb-4">
              "Where Treatment Begins While Screening"
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Colonoscopy is revolutionizing preventive medicine by being the only screening procedure that can 
              immediately treat what it finds, transforming potential cancer threats into resolved health victories.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Search className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-teal-700">Real-Time Detection</h3>
              <p className="text-gray-600">Advanced imaging identifies even the smallest polyps and abnormalities instantly</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Shield className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Immediate Intervention</h3>
              <p className="text-gray-600">Precancerous polyps are removed on the spot, preventing cancer before it starts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Heart className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-green-700">Instant Peace of Mind</h3>
              <p className="text-gray-600">Leave the procedure knowing potential threats have been eliminated</p>
            </div>
          </div>
        </div>

        {/* What Makes Colonoscopy Special */}
        <div>
          <h2 className="text-3xl font-bold mb-6">What Makes Colonoscopy the Gold Standard?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Search className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-semibold text-blue-700">Complete Visualization</h3>
                </div>
                <p className="text-gray-700">
                  Colonoscopy examines every inch of your colon and rectum with high-definition imaging, 
                  providing unparalleled visibility to detect even the smallest abnormalities that could develop into cancer.
                </p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="h-6 w-6 text-teal-500" />
                  <h3 className="text-xl font-semibold text-teal-700">Detect AND Treat Simultaneously</h3>
                </div>
                <p className="text-gray-700">
                  Colonoscopy is the only test that can help prevent colon cancer because we are able to find polyps that need to be removed before they become cancerous.
                  This unique capability means treatment begins the moment a threat is identified.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Microscope className="h-6 w-6 text-purple-500" />
                  <h3 className="text-xl font-semibold text-purple-700">Precision Medicine</h3>
                </div>
                <p className="text-gray-700">
                  Advanced instruments allow for precise polyp removal and tissue sampling during the same session, 
                  ensuring comprehensive care without the need for multiple procedures.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-6 w-6 text-green-500" />
                  <h3 className="text-xl font-semibold text-green-700">Decade-Long Protection</h3>
                </div>
                <p className="text-gray-700">
                  With normal results, you're protected for 10 full years before your next screening, 
                  providing unmatched long-term peace of mind and convenience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Evidence */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">The Science Behind the Gold Standard</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-l-4 border-amber-500">
              <h3 className="text-xl font-semibold mb-3 text-amber-700">The National Polyp Study Legacy</h3>
              <p className="text-gray-700 mb-4">
                The incidence of colorectal cancer is reduced by colonoscopic polypectomy. These results provide evidence of the progression of adenoma to adenocarcinoma and of the effectiveness of the current practice of searching for and removing adenomatous polyps in the colon.
              </p>
              <p className="text-gray-700">
                Among 2,602 patients who had adenomas removed during participation, after a median of 15.8 years, 1246 patients had died from any cause and 12 had died from CRC. Given an estimated 25.4 expected deaths from CRC in the general population, 
                this represents a dramatic reduction in cancer deaths.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Recent European Study Insights</h3>
              <p className="text-gray-700 mb-4">
                When only people who actually had colonoscopy were analyzed, colonoscopy reduced the number of colorectal cancers by 31% and of CRC-associated deaths by 50%.
              </p>
              <p className="text-gray-700">
                The take-home message of this study is that when people have screening colonoscopies, deaths from colorectal cancer are reduced by half. That's a huge reduction!
              </p>
            </div>
          </div>
        </div>

        {/* How Colonoscopy Prevents Cancer */}
        <div>
          <h2 className="text-3xl font-bold mb-6">How Colonoscopy Prevents Cancer</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">The Polyp-to-Cancer Journey</h3>
            <p className="text-gray-700 mb-4">
              Around 75% of colorectal cancers start from adenomatous polyps, and about 80% of all colon polyps are adenomas. But only about 5% of adenomas are actually malignant.
            </p>
            <p className="text-gray-700">
              The risk of a random, average-size colon polyp becoming cancerous is estimated to be 8% over 10 years and 24% over 20 years. 
              Colonoscopy interrupts this progression by removing polyps before they can become cancerous.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Search className="h-8 w-8 text-green-600 mb-4" />
              <h4 className="font-semibold text-lg mb-3 text-green-700">Step 1: Detection</h4>
              <p className="text-gray-600">Advanced camera technology identifies even small polyps and suspicious areas throughout the colon.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h4 className="font-semibold text-lg mb-3 text-blue-700">Step 2: Removal</h4>
              <p className="text-gray-600">Specialized instruments remove polyps immediately, preventing potential cancer development.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Microscope className="h-8 w-8 text-purple-600 mb-4" />
              <h4 className="font-semibold text-lg mb-3 text-purple-700">Step 3: Analysis</h4>
              <p className="text-gray-600">Removed tissue is analyzed to determine if any cancer cells are present and guide future care.</p>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div>
          <h2 className="text-3xl font-bold mb-6">What to Expect: A Modern, Comfortable Experience</h2>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-4">You're in Expert Hands</h3>
                <p className="text-green-700 mb-4">
                  Modern colonoscopy is performed by highly trained gastroenterologists or colorectal surgeons using state-of-the-art equipment. 
                  Most patients sleep comfortably under sedation and wake up feeling refreshed.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">During the Procedure:</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• Comfortable sedation keeps you relaxed</li>
                      <li>• Procedure typically takes 30-60 minutes</li>
                      <li>• Continuous monitoring of vital signs</li>
                      <li>• Immediate polyp removal if needed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">What You'll Experience:</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• Like a comfortable, peaceful nap</li>
                      <li>• Minimal to no discomfort</li>
                      <li>• Quick recovery time</li>
                      <li>• Immediate preliminary results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Who Should Get Screened */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">Who Should Get a Colonoscopy?</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Average Risk Individuals</h3>
              <p className="text-gray-700 mb-2">
                <strong>Starting at age 45</strong> (recently lowered from 50 due to rising rates in younger adults)
              </p>
              <p className="text-gray-700">
                If no polyps are found and you have no risk factors, your next colonoscopy won't be needed for 10 years.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border-l-4 border-amber-500">
              <h3 className="text-xl font-semibold mb-3 text-amber-700">Higher Risk Individuals</h3>
              <p className="text-gray-700 mb-3">Consider starting screening earlier (age 40 or younger) if you have:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Family history of colorectal cancer or polyps</li>
                <li>Personal history of inflammatory bowel disease</li>
                <li>Certain inherited syndromes (Lynch syndrome, FAP)</li>
                <li>Previous personal history of polyps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Addressing Common Concerns */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Addressing Common Concerns</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">💰 "Is it expensive?"</h3>
              <p className="text-gray-700">
                Screening colonoscopies are typically covered by insurance at 100% with no copay when performed according to guidelines. 
                The cost of prevention is far less than the cost of treating cancer.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-green-700">😴 "Will it hurt?"</h3>
              <p className="text-gray-700">
                Modern sedation techniques ensure you'll be comfortable and relaxed. Most patients report it was 
                much easier than they expected and wish they hadn't worried so much.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-purple-700">🕐 "Do I have time?"</h3>
              <p className="text-gray-700">
                The procedure itself takes about 30-60 minutes, and you'll need about half a day for the entire process including recovery. 
                That's a small investment for 10 years of peace of mind.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-teal-700">🥤 "What about the prep?"</h3>
              <p className="text-gray-700">
                Modern prep solutions are much more tolerable than in the past. Your doctor can recommend options that 
                work best for you, including flavored solutions and split-dose preparations.
              </p>
            </div>
          </div>
        </div>

        {/* The Bottom Line */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">The Bottom Line</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl mb-6 opacity-90">
              Removing polyps during colonoscopy can not only prevent colorectal cancer, but also reduce deaths from the disease for years.
            </p>
            <p className="text-lg mb-8 opacity-80">
              Colonoscopy stands alone as the only screening method that can detect, treat, and prevent colorectal cancer 
              in a single procedure. It's not just screening — it's the beginning of treatment and the path to prevention.
            </p>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">The COLONAiVE Promise</h3>
              <p className="text-lg">
                The benefits of early detection and prevention far outweigh the temporary discomfort associated with the procedure. 
                Colonoscopy transforms screening from simple detection into active cancer prevention — truly making it the gold standard of preventive medicine.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Don't let fear or misconceptions prevent you from getting this life-saving screening. 
            Talk to your doctor about when you should start colonoscopy screening.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">
              <strong>For average-risk individuals:</strong> Start screening at age 45<br />
              <strong>For higher-risk individuals:</strong> Discuss earlier screening with your doctor
            </p>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default ColonoscopyGoldStandard;