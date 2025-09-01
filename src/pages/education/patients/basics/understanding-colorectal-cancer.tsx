import React from 'react';
import ArticleLayout from '../../../../components/education/ArticleLayout';
import { educationArticles } from '../../../../data/education/articles';
import { useEducationContent } from '../../../../hooks/useEducationContent';

const UnderstandingColorectalCancer: React.FC = () => {
  const { getRelatedArticles } = useEducationContent();
  
  // Find this article's data
  const articleData = educationArticles.find(article => article.slug === 'understanding-colorectal-cancer');
  
  if (!articleData) {
    return <div>Article not found</div>;
  }

  const relatedArticles = getRelatedArticles(articleData.id, 3);

  return (
    <ArticleLayout article={articleData} relatedArticles={relatedArticles}>
      <div>
        {/* Introduction */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 text-blue-900">Quick Facts</h2>
          <ul className="space-y-2 text-blue-800">
            <li>• Colorectal cancer is the <strong>3rd most common cancer</strong> worldwide</li>
            <li>• In Singapore, it's the <strong>#1 cancer</strong> affecting both men and women</li>
            <li>• <strong>90% preventable</strong> with proper screening and early detection</li>
            <li>• Most effective treatment when caught in early stages</li>
          </ul>
        </div>

        <h2>What is Colorectal Cancer?</h2>
        <p>
          Colorectal cancer is a type of cancer that begins in the colon (large intestine) or rectum. 
          These cancers can also be called colon cancer or rectal cancer, depending on where they start. 
          The colon and rectum make up the large intestine, which is part of the body's digestive system.
        </p>

        <p>
          Most colorectal cancers start as a growth on the inner lining of the colon or rectum. These 
          growths are called polyps. Some types of polyps can change into cancer over time (usually 
          many years), but not all polyps become cancer.
        </p>

        {/* Anatomy Section with Visual Element */}
        <div className="bg-gray-50 rounded-lg p-6 my-8">
          <h3>Understanding Your Digestive System</h3>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p>
                The large intestine is about 5 feet long and is divided into several sections:
              </p>
              <ul className="mt-4 space-y-2">
                <li><strong>Cecum:</strong> The first part of the colon</li>
                <li><strong>Ascending colon:</strong> Goes up the right side of your belly</li>
                <li><strong>Transverse colon:</strong> Goes across your belly</li>
                <li><strong>Descending colon:</strong> Goes down the left side</li>
                <li><strong>Sigmoid colon:</strong> S-shaped section before the rectum</li>
                <li><strong>Rectum:</strong> Last 6 inches, stores waste before elimination</li>
              </ul>
            </div>
            <div className="text-center">
              <img 
                src="/assets/images/education/anatomy/colorectal-anatomy-diagram.webp" 
                alt="Detailed anatomical illustration showing the colon sections including cecum, ascending colon, transverse colon, descending colon, sigmoid colon, and rectum"
                className="w-full h-auto rounded-lg shadow-lg max-w-md mx-auto"
              />
              <p className="text-xs text-gray-500 mt-3 italic">
                Colorectal anatomy diagram. 
                Source: <a 
                  href="https://commons.wikimedia.org/wiki/File:Colon_illustration_lg.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Wikimedia Commons
                </a>
              </p>
            </div>
          </div>
        </div>

        <h2>Types of Colorectal Cancer</h2>
        <p>
          There are several types of colorectal cancer, but the most common type is adenocarcinoma, 
          which accounts for about 95% of all cases.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-green-700 mb-2">Adenocarcinoma (95%)</h4>
            <p className="text-sm">
              Starts in the cells that make mucus to lubricate the inside of the colon and rectum. 
              Most treatable when caught early.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-orange-700 mb-2">Other Types (5%)</h4>
            <p className="text-sm">
              Include lymphomas, carcinoid tumors, sarcomas, and gastrointestinal stromal tumors. 
              Require specialized treatment approaches.
            </p>
          </div>
        </div>

        <h2>Risk Factors You Should Know</h2>
        <p>
          Understanding risk factors can help you make informed decisions about screening and lifestyle choices.
        </p>

        <div className="my-8">
          <h3>Risk Factors You Can Control</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-3">Increase Risk</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Smoking tobacco</li>
                <li>• Heavy alcohol consumption</li>
                <li>• Diet high in red/processed meats</li>
                <li>• Obesity and lack of physical activity</li>
                <li>• Type 2 diabetes</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Decrease Risk</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Regular physical activity</li>
                <li>• Healthy diet with fruits/vegetables</li>
                <li>• Maintaining healthy weight</li>
                <li>• Not smoking</li>
                <li>• Limiting alcohol consumption</li>
              </ul>
            </div>
          </div>
        </div>

        <h3>Risk Factors You Cannot Control</h3>
        <ul className="space-y-2 my-4">
          <li><strong>Age:</strong> Risk increases significantly after age 45</li>
          <li><strong>Family history:</strong> Having relatives with colorectal cancer</li>
          <li><strong>Personal history:</strong> Previous colorectal cancer or certain polyps</li>
          <li><strong>Inflammatory bowel disease:</strong> Crohn's disease or ulcerative colitis</li>
          <li><strong>Genetic syndromes:</strong> Lynch syndrome or familial adenomatous polyposis</li>
        </ul>

        <h2>Singapore Statistics: Why This Matters Locally</h2>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-6">
          <h4 className="font-semibold mb-3">Colorectal Cancer in Singapore</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">#1 Cancer</p>
              <p>Most common cancer in Singapore for both men and women</p>
            </div>
            <div>
              <p className="font-medium">Rising Incidence</p>
              <p>Cases have increased significantly over the past decades</p>
            </div>
            <div>
              <p className="font-medium">Screening Success</p>
              <p>Countries with organized screening programs show 30-50% reduction in deaths</p>
            </div>
          </div>
        </div>

        <h2>The Good News: Prevention and Early Detection</h2>
        <p>
          While colorectal cancer is serious, it's also one of the most preventable cancers. Here's why there's reason for optimism:
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-green-800 mb-4">Prevention Success Stories</h4>
          <div className="space-y-3 text-green-700">
            <p>✓ <strong>Screening works:</strong> Regular screening can prevent up to 90% of colorectal cancers</p>
            <p>✓ <strong>Early detection saves lives:</strong> 5-year survival rate is over 90% when caught early</p>
            <p>✓ <strong>Treatment advances:</strong> New therapies are improving outcomes even for advanced cases</p>
            <p>✓ <strong>Simple prevention:</strong> Lifestyle changes can significantly reduce your risk</p>
          </div>
        </div>

        <h2>When to Start Screening</h2>
        <p>
          Most medical organizations recommend that people at average risk begin colorectal cancer screening at age 45. 
          However, you may need to start earlier if you have certain risk factors.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Average Risk</h4>
            <p className="text-sm mb-3">Start screening at age 45 if you have:</p>
            <ul className="text-sm space-y-1">
              <li>• No family history of colorectal cancer</li>
              <li>• No personal history of polyps</li>
              <li>• No inflammatory bowel disease</li>
              <li>• No genetic syndromes</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 bg-yellow-50">
            <h4 className="font-semibold mb-3">Higher Risk</h4>
            <p className="text-sm mb-3">May need earlier screening if you have:</p>
            <ul className="text-sm space-y-1">
              <li>• Family history of colorectal cancer</li>
              <li>• Personal history of polyps</li>
              <li>• Inflammatory bowel disease</li>
              <li>• Certain genetic conditions</li>
            </ul>
          </div>
        </div>

        <h2>Your Next Steps</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-blue-800 mb-4">Take Action Today</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              <div>
                <p className="font-medium">Assess Your Risk</p>
                <p className="text-sm text-gray-600">Consider your age, family history, and lifestyle factors</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              <div>
                <p className="font-medium">Talk to Your Doctor</p>
                <p className="text-sm text-gray-600">Discuss when you should start screening and which test is right for you</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              <div>
                <p className="font-medium">Get Screened</p>
                <p className="text-sm text-gray-600">Schedule your screening test and follow through with the appointment</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
              <div>
                <p className="font-medium">Adopt Healthy Habits</p>
                <p className="text-sm text-gray-600">Make lifestyle changes to reduce your risk</p>
              </div>
            </div>
          </div>
        </div>

        <blockquote className="bg-gray-50 border-l-4 border-gray-500 p-6 my-8 italic">
          "Colorectal cancer is largely preventable. By understanding your risk factors and getting screened 
          at the right time, you can significantly reduce your chances of developing this disease."
          <footer className="text-sm text-gray-600 mt-3 not-italic">
            — American Cancer Society Guidelines
          </footer>
        </blockquote>

        <h2>Learn More</h2>
        <p>
          Understanding colorectal cancer is the first step in prevention. Continue learning about:
        </p>
        <ul className="space-y-2 my-4">
          <li>• <a href="/education/patients/screening/colonoscopy-gold-standard" className="text-blue-600 hover:underline">Colonoscopy: The Gold Standard for Screening</a></li>
          <li>• <a href="/education/patients/symptoms/early-symptoms-of-crc" className="text-blue-600 hover:underline">Early Warning Signs and Symptoms</a></li>
          <li>• <a href="/education/patients/basics/how-crc-develops-from-polyps" className="text-blue-600 hover:underline">How Cancer Develops from Polyps</a></li>
          <li>• <a href="/get-screened" className="text-blue-600 hover:underline">Find Screening Options Near You</a></li>
        </ul>
      </div>
    </ArticleLayout>
  );
};

export default UnderstandingColorectalCancer;