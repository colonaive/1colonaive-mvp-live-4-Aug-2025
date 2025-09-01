import React from 'react';
import ArticleLayout from '../../../../components/education/ArticleLayout';
import { educationArticles } from '../../../../data/education/articles';
import { useEducationContent } from '../../../../hooks/useEducationContent';

const ColonoscopyPreparationGuide: React.FC = () => {
  const { getRelatedArticles } = useEducationContent();

  const articleData = educationArticles.find(article => article.slug === 'colonoscopy-preparation-complete-guide');

  if (!articleData) {
    return <div>Article not found</div>;
  }

  const relatedArticles = getRelatedArticles(articleData.id, 3);

  return (
    <ArticleLayout article={articleData} relatedArticles={relatedArticles}>
      <div>
        {/* Encouraging Introduction */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 text-green-900">The Good News About Colonoscopy</h2>
          <ul className="space-y-2 text-green-800">
            <li>• <strong>Highly effective:</strong> Prevents up to 90% of colorectal cancers</li>
            <li>• <strong>Safe procedure:</strong> Serious complications occur in less than 1 in 1,000 cases</li>
            <li>• <strong>Quick recovery:</strong> Most people return to normal activities the next day</li>
            <li>• <strong>Life-saving:</strong> Early detection leads to over 90% survival rates</li>
          </ul>
        </div>

        <h2>Why This Preparation Guide Matters</h2>
        <p>
          If you're reading this, you've already made an important decision for your health. Colonoscopy
          is the most effective way to prevent colorectal cancer, and with simple preparation, you're
          setting yourself up for the best possible results.
        </p>

        <p>
          This guide will walk you through everything you need to know in a straightforward, easy-to-follow
          way. Think of preparation as the foundation that makes your screening as effective as possible—and
          it's much simpler than most people think.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-blue-800 mb-3">Quick Overview: It's Easier Than You Think</h4>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-2">1</div>
              <p className="text-sm font-medium">Week Before</p>
              <p className="text-xs text-gray-600">Simple planning</p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-2">2</div>
              <p className="text-sm font-medium">Day Before</p>
              <p className="text-xs text-gray-600">Clear liquids &amp; prep</p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-2">3</div>
              <p className="text-sm font-medium">Procedure Day</p>
              <p className="text-xs text-gray-600">30-60 minutes</p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-2">4</div>
              <p className="text-sm font-medium">Recovery</p>
              <p className="text-xs text-gray-600">Back to normal</p>
            </div>
          </div>
        </div>

        <h2>Simple Planning: One Week Before</h2>
        <p>
          The most important preparation happens before you even start the medical prep. This week is
          about setting yourself up for success with simple planning steps.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-yellow-800 mb-4">Your Simple Planning Checklist</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-600 mr-3 text-lg">✓</span>
              <div>
                <p className="font-medium">Arrange Your Ride</p>
                <p className="text-sm text-gray-600">You'll need someone to drive you home after sedation—a great excuse to catch up with a friend or family member!</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-3 text-lg">✓</span>
              <div>
                <p className="font-medium">Get Your Prep Kit</p>
                <p className="text-sm text-gray-600">Pick up your prescribed preparation medication and stock up on clear liquids you enjoy</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-3 text-lg">✓</span>
              <div>
                <p className="font-medium">Review Medications</p>
                <p className="text-sm text-gray-600">Your doctor will tell you which medications to pause temporarily—usually just blood thinners and iron supplements</p>
              </div>
            </div>
          </div>
        </div>

        <h2>Smart Eating: Days Before Your Procedure</h2>
        <p>
          For a few days before your procedure, you'll switch to easily digestible foods. This isn't
          about strict dieting—it's about choosing foods that are gentle on your system and make the
          cleaning process more effective.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-4">Great Food Choices</h4>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium">Comfort Foods:</h5>
                <p className="text-green-700">White rice, pasta, white bread, crackers, chicken soup</p>
              </div>
              <div>
                <h5 className="font-medium">Proteins:</h5>
                <p className="text-green-700">Grilled chicken, fish, eggs, tender meats</p>
              </div>
              <div>
                <h5 className="font-medium">Asian Favorites:</h5>
                <p className="text-green-700">Plain congee, steamed fish, chicken rice (no sauce), clear broths</p>
              </div>
              <div>
                <h5 className="font-medium">Snacks:</h5>
                <p className="text-green-700">Crackers, white toast, plain cookies</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h4 className="font-semibold text-orange-800 mb-4">Foods to Skip Temporarily</h4>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium">High-Fiber Items:</h5>
                <p className="text-orange-700">Whole grains, nuts, seeds, raw vegetables</p>
              </div>
              <div>
                <h5 className="font-medium">Tough to Digest:</h5>
                <p className="text-orange-700">Tough meats, dried beans, corn</p>
              </div>
              <div>
                <h5 className="font-medium">Raw Items:</h5>
                <p className="text-orange-700">Fresh fruits with skins, raw vegetables, salads</p>
              </div>
              <p className="text-xs text-orange-600 mt-3 italic">Don't worry—you can enjoy all these foods again right after your procedure!</p>
            </div>
          </div>
        </div>

        <h2>The Day Before: Clear Liquids Made Simple</h2>
        <p>
          The day before your procedure, you'll switch to clear liquids. Think of this as giving your
          digestive system a gentle rest while staying well-hydrated and comfortable.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-blue-800 mb-4">Clear Liquid Options You'll Actually Enjoy</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h5 className="font-medium mb-2 text-green-700">Refreshing Drinks</h5>
              <ul className="text-sm space-y-1">
                <li>• Apple juice (clear, no pulp)</li>
                <li>• Sports drinks</li>
                <li>• Clear soft drinks</li>
                <li>• Coconut water</li>
                <li>• Iced tea (no milk)</li>
                <li>• Lemonade (strained)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2 text-blue-700">Warm Comfort</h5>
              <ul className="text-sm space-y-1">
                <li>• Clear chicken broth</li>
                <li>• Vegetable broth (strained)</li>
                <li>• Herbal teas</li>
                <li>• Black coffee (no cream)</li>
                <li>• Clear bouillon</li>
                <li>• Honey in drinks</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2 text-purple-700">Sweet Treats</h5>
              <ul className="text-sm space-y-1">
                <li>• Clear gelatin desserts</li>
                <li>• Popsicles (avoid red/purple)</li>
                <li>• Hard candies</li>
                <li>• Honey</li>
                <li>• Sugar in drinks</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 italic">Pro tip: Avoid red or purple liquids as they can interfere with the examination</p>
        </div>

        <h2>The Prep Solution: Easier Than Expected</h2>
        <p>
          Your doctor will prescribe a bowel preparation solution. While this is the part many people
          worry about most, modern preparations are much more tolerable than older versions, and most
          people find it's not as difficult as they expected.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-green-800 mb-4">Making Prep More Comfortable</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Before You Start:</h5>
              <ul className="text-sm space-y-1">
                <li>• Chill the solution—it tastes better cold</li>
                <li>• Have lime wedges or approved hard candy ready</li>
                <li>• Set up a comfortable spot near the bathroom</li>
                <li>• Have entertainment ready (books, tablet, etc.)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">During Prep:</h5>
              <ul className="text-sm space-y-1">
                <li>• Drink through a straw to minimize taste</li>
                <li>• Take small breaks if you feel nauseous</li>
                <li>• Stay hydrated with approved clear liquids</li>
                <li>• Remember: this is temporary and effective</li>
              </ul>
            </div>
          </div>
        </div>

        <h3>What to Expect</h3>
        <p>
          You'll start having bowel movements within 1-4 hours of starting the prep. This is exactly
          what should happen—it means the preparation is working. By the end, you'll be passing clear
          or light yellow liquid, which indicates you're ready for an effective examination.
        </p>

        <h2>Procedure Day: Smoother Than You Think</h2>
        <p>
          The day you've been preparing for is actually the easiest part. The procedure itself is
          typically 30-60 minutes, and you'll be comfortably sedated throughout.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-blue-800 mb-4">Your Day Timeline</h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
              <div>
                <h5 className="font-medium">Arrival (30 min early)</h5>
                <p className="text-sm text-gray-600">Check-in, paperwork, and pre-procedure preparation</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
              <div>
                <h5 className="font-medium">Pre-Procedure (15-30 min)</h5>
                <p className="text-sm text-gray-600">Change into comfortable gown, IV placement, meet your team</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
              <div>
                <h5 className="font-medium">The Procedure (30-60 min)</h5>
                <p className="text-sm text-gray-600">You'll be comfortably sedated—most people don't remember anything</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
              <div>
                <h5 className="font-medium">Recovery (60-90 min)</h5>
                <p className="text-sm text-gray-600">Wake up gradually, have a snack, get your results</p>
              </div>
            </div>
          </div>
        </div>

        <h3>What to Bring</h3>
        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div>
            <h5 className="font-medium mb-2">Essential Items:</h5>
            <ul className="text-sm space-y-1">
              <li>• Photo ID and insurance card</li>
              <li>• List of medications you take</li>
              <li>• Comfortable clothes to change back into</li>
              <li>• Your designated driver's contact info</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Leave at Home:</h5>
            <ul className="text-sm space-y-1">
              <li>• Jewelry and valuables</li>
              <li>• Contact lenses (wear glasses instead)</li>
              <li>• Nail polish and makeup</li>
              <li>• Dentures (if removable)</li>
            </ul>
          </div>
        </div>

        <h2>Quick Recovery and Great Results</h2>
        <p>
          Most people are surprised by how quickly they feel back to normal. Recovery is typically
          straightforward, and you'll have valuable information about your health.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-green-800 mb-4">Recovery Made Simple</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Same Day:</h5>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Rest while sedation wears off</li>
                <li>• Start with light foods when hungry</li>
                <li>• Stay hydrated</li>
                <li>• No driving for 24 hours</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Next Day:</h5>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Return to normal diet</li>
                <li>• Resume regular activities</li>
                <li>• Back to work (most people)</li>
                <li>• Feel proud of taking care of your health!</li>
              </ul>
            </div>
          </div>
        </div>

        <h3>Understanding Your Results</h3>
        <p>
          Your doctor will share preliminary results right after the procedure. Most people receive
          excellent news—no polyps found and normal results.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-blue-800 mb-4">Possible Outcomes &amp; Next Steps</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
              <div>
                <p className="font-medium">Normal Results (Most Common)</p>
                <p className="text-sm text-gray-600">Your next screening in 10 years—you're done for a decade!</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">i</span>
              <div>
                <p className="font-medium">Small Polyps Found</p>
                <p className="text-sm text-gray-600">Removed during procedure—crisis prevented! Next screening in 3-5 years</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">!</span>
              <div>
                <p className="font-medium">Significant Findings</p>
                <p className="text-sm text-gray-600">Early detection means excellent treatment options and outcomes</p>
              </div>
            </div>
          </div>
        </div>

        <h2>Addressing Common Concerns</h2>
        <p>
          It's natural to have questions or concerns. Here are honest answers to the most common
          worries people have about colonoscopy preparation and the procedure.
        </p>

        <div className="space-y-6 my-8">
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-medium">"Will the prep make me very sick?"</h5>
            <p className="text-sm text-gray-700">Most people experience manageable bowel movements and some bloating. Nausea is uncommon with modern preparations, and any discomfort is temporary.</p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h5 className="font-medium">"Is the procedure painful?"</h5>
            <p className="text-sm text-gray-700">With sedation, you'll be comfortable and won't remember the procedure. Most people say it was much easier than they expected.</p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h5 className="font-medium">"What if they find something?"</h5>
            <p className="text-sm text-gray-700">Finding and removing polyps is actually great news—you've prevented cancer! Early detection means excellent treatment options.</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h5 className="font-medium">"Can I manage the prep while working?"</h5>
            <p className="text-sm text-gray-700">Many people successfully do prep in the evening and work normally the next day until their procedure. Plan for a quiet evening during prep.</p>
          </div>
        </div>

        <h2>Special Situations Made Simple</h2>
        <p>
          If you have specific health conditions, your healthcare team will provide modified instructions
          to ensure your safety and comfort.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Diabetes Management</h4>
            <p className="text-sm">Your doctor will provide specific guidance for medication adjustments. Many diabetics successfully complete prep with minor modifications to their routine.</p>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Heart or Kidney Conditions</h4>
            <p className="text-sm">Your medical team will choose the safest preparation option for your situation. Colonoscopy is routinely performed safely for people with these conditions.</p>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Taking Multiple Medications</h4>
            <p className="text-sm">Your healthcare provider will review each medication and give you clear guidance on what to continue, pause, or adjust temporarily.</p>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Previous Difficult Prep</h4>
            <p className="text-sm">If you've had challenges before, there are alternative preparation options available. Discuss your experience with your doctor.</p>
          </div>
        </div>

        <h2>The Life-Saving Impact of Your Decision</h2>
        <p>
          By choosing to have a colonoscopy, you're making one of the most effective preventive health
          decisions possible. This simple procedure has prevented countless cancers and saved millions of lives.
        </p>

        <blockquote className="bg-gray-50 border-l-4 border-gray-500 p-6 my-8 italic">
          "Colonoscopy is the most effective tool we have for preventing colorectal cancer. When patients
          complete proper preparation, we can detect and remove pre-cancerous polyps before they ever
          become a threat. It's prevention in action."
          <footer className="text-sm text-gray-600 mt-3 not-italic">
            — American Society for Gastrointestinal Endoscopy
          </footer>
        </blockquote>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h4 className="font-semibold text-green-800 mb-4">Your Health Investment</h4>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">90%</div>
              <p className="text-sm">Cancer prevention rate with regular screening</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">10 Years</div>
              <p className="text-sm">Peace of mind with normal results</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">24 Hours</div>
              <p className="text-sm">Back to normal activities</p>
            </div>
          </div>
        </div>

        <h2>Ready to Take Action?</h2>
        <p>
          You now have everything you need to confidently prepare for your colonoscopy. This preparation
          isn't just about the procedure—it's about taking control of your health and potentially
          preventing a life-threatening disease.
        </p>

        {/* ENHANCED CTA SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 my-8">
          <h4 className="font-semibold text-blue-800 mb-6 text-lg sm:text-xl">
            Your Next Steps
          </h4>

          {/* CTA 1: Schedule Screening */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 sm:p-6 mb-4 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h5 className="text-lg sm:text-xl font-bold mb-2 flex items-center">
                  <span className="mr-2 sm:mr-3">📅</span>
                  Schedule Your Screening
                </h5>
                <p className="text-green-100 text-sm sm:text-base">
                  Contact your healthcare provider or use our specialist locator to find qualified providers near you.
                </p>
              </div>
              <a
                href="/find-a-specialist"
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 shadow-md w-full sm:w-auto text-center"
              >
                Find A Specialist →
              </a>
            </div>
          </div>

          {/* CTA 2: Preparation Guide */}
          <div className="flex items-start gap-4 mb-6 p-4 bg-white rounded-lg border border-blue-100">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              2
            </span>
            <div>
              <p className="font-medium text-sm sm:text-base">
                Follow This Preparation Guide
              </p>
              <p className="text-sm text-gray-600">
                You're now well-prepared to complete the process successfully. Bookmark this guide for easy reference during your preparation.
              </p>
            </div>
          </div>

          {/* CTA 3: Share Story */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h5 className="text-lg sm:text-xl font-bold mb-2 flex items-center">
                  <span className="mr-2 sm:mr-3">💬</span>
                  Share Your Experience
                </h5>
                <p className="text-purple-100 text-sm sm:text-base">
                  Join our community of Champions and inspire others to prioritize their health. Your story could save lives!
                </p>
                <p className="text-xs text-purple-200 mt-1 italic">
                  *Members-only feature - Sign up to share your journey
                </p>
              </div>
              <a
                href="/members/share-story"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200 shadow-md w-full sm:w-auto text-center"
              >
                Share Story →
              </a>
            </div>
          </div>
        </div>



        <h2>Continue Your Health Journey</h2>
        <p>
          Colonoscopy is just one part of comprehensive colorectal health. Continue learning about
          prevention, early detection, and maintaining optimal digestive health.
        </p>
        <ul className="space-y-2 my-4">
          <li>• <a href="/education/patients/basics/understanding-colorectal-cancer" className="text-blue-600 hover:underline">Understanding Colorectal Cancer: A Comprehensive Guide</a></li>
          <li>• <a href="/education/patients/basics/how-crc-develops-from-polyps" className="text-blue-600 hover:underline">How Colorectal Cancer Develops from Polyps</a></li>
          <li>• <a href="/education/patients/screening/screening-options-overview" className="text-blue-600 hover:underline">Complete Guide to Screening Options</a></li>
          <li>• <a href="/get-screened" className="text-blue-600 hover:underline">Find Screening Locations Near You</a></li>
        </ul>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
          <p className="text-green-800 font-medium">
            Remember: The few days of preparation are a small investment for potentially decades of health
            and peace of mind. You're making an excellent decision for your future.
          </p>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default ColonoscopyPreparationGuide;