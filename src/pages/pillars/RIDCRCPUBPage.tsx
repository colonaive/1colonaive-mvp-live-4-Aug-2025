// /home/project/src/pages/pillars/RIDCRCPUBPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Activity, Info, Loader2 } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext'; 
import { supabase } from '../../supabase';
import toast from 'react-hot-toast';

import StatsSection from '../../components/StatsSection';
import CrisisSection from '../../components/CrisisSection';
import ShareYourStoryForm from '../../components/ShareYourStoryForm';
import SG60GiftSection from '../../components/SG60GiftSection';
import JoinMovementSection from '../../components/JoinMovementSection';


const RIDCRCPUBPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userType, loading, isAuthenticated } = useAuth(); 
  const [storySubmitted, setStorySubmitted] = useState(false);

  const isChampion = isAuthenticated && userType === 'champion';

  const handleShareStoryClick = () => {
    if (isChampion) {
      navigate('/stories'); 
    } else {
      alert("You need to be a Champion to view or share stories. Please sign up to join the movement!");
      navigate('/signup/champion'); 
    }
  };

  const handleReferFriendClick = () => {
    if (isChampion) {
      navigate('/refer-friend'); 
    } else {
      alert("You need to be a Champion to Refer a Friend. Please sign up to join the movement!");
      navigate('/signup/champion'); 
    }
  };

  const handleStorySubmit = async (data: any) => {
    if (isChampion) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be logged in to share your story.");
          return false;
        }

        const { error } = await supabase.from("stories").insert([{
          user_id: user.id,
          story_type: data.storyType,
          experience_type: data.experienceType,
          location: data.location,
          content: data.content,
          is_public: data.isPublic,
          anonymous: data.anonymous,
          can_contact: data.canContact,
          approved: false, 
          submitted_at: new Date().toISOString(),
        }]);

        if (error) {
          console.error("Error submitting story:", error);
          toast.error("Submission failed. Please try again.");
          return false;
        }

        setStorySubmitted(true);
        toast.success("Thank you! Your story has been received for review.");
        return true;
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("An unexpected error occurred. Please try again.");
        return false;
      }
    } else {
      alert("You need to be a Champion to Share Your Story. Please sign up to join the movement!");
      navigate('/signup/champion');
      return false;
    }
  };
    
  return (
    <div className="pt-20">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-700 to-sky-500 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Activity className="h-12 w-12 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">RID-CRC PUB™</h1>
            <p className="text-xl">
              A national movement by people, for people — raising awareness, sharing stories, and saving lives through early detection of colorectal cancer.
            </p>
          </div>
        </Container>
      </div>

      {/* Page Content Sections */}
      <Container>
        <div className="py-16 max-w-4xl mx-auto text-left">
          <h2 className="text-3xl font-bold mb-6">Colorectal Cancer in Singapore: A Silent Crisis</h2>
          <p className="text-gray-700 mb-4">
            Colorectal cancer (CRC) is the most common cancer in Singapore — yet most people remain unaware of the danger it poses. Every day, lives are lost to this disease not because we lack treatment options, but because we detect it too late.
          </p>
          <p className="text-gray-700 mb-4">
            Only about <strong>30–40% of eligible individuals</strong> are screened on time. That means tens of thousands are walking around with early-stage disease or precancerous polyps — unaware, and untreated. More than <strong>60% of CRC diagnoses in Singapore happen at Stage 3 or 4</strong>, when treatment becomes harder and outcomes worse.
          </p>
          <p className="text-gray-700 mb-4">
            The COLONAiVE™ movement was launched to change this — not just through new tools, but by building a nationwide culture of awareness, action, and shared responsibility.
          </p>
        </div>
         {/* Dr. Francis Seow-Choen Quote Section - Moved up for better visibility */}
      <Container>
        <div className="py-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  src="/assets/advisors/francis-seow.jpg"
                  alt="Dr. Francis Seow-Choen"
                  className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-md object-cover"
                />
              </div>
              <div className="flex-1">
                <blockquote className="italic text-lg text-gray-800 border-l-4 border-blue-600 pl-6">
                  "Almost all colonic cancers arise from pre-existing polyps. If these benign polyps are removed, cancers can never arise. Therefore, although screening by colonoscopy may seem troublesome, there is nothing more comforting than to detect cancer early. Screening is therefore very important."
                </blockquote>
                <div className="mt-4 flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Dr. Francis Seow-Choen</p>
                    <p className="text-sm text-gray-600">Senior Colorectal Surgeon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      </Container>
      <StatsSection />
      <CrisisSection />
      
      <Container>
        <div className="py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Why Screening Saves Lives</h2>
          <p className="text-gray-600 mb-6">
            Watch this short video to understand how early detection through screening — including colonoscopy or non-invasive options — can prevent unnecessary deaths.
          </p>
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <iframe
              className="w-full h-96 rounded-lg"
              src="https://www.youtube.com/embed/LINK_PLACEHOLDER"
              title="CRC Awareness Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </Container>

      {/* Share Your Story */}
      <Container>
        <div className="py-16 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Your Story Can Save Someone's Life
          </h2>
          <p className="text-gray-600 mb-6">
            Have you or your loved ones been impacted by colorectal cancer? As a survivor, caregiver, or concerned citizen, your voice matters. Share your story — it could inspire someone to go for screening today.
          </p>
          
          {loading ? (
            <div className="mt-8 flex justify-center items-center p-6 bg-gray-50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mr-3" />
              <span className="text-gray-600">Checking your status...</span>
            </div>
          ) : isChampion ? (
            <>
              {storySubmitted ? (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Story Submitted Successfully!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for sharing your experience. Your story has been received for review and will help inspire others.
                  </p>
                  <Button onClick={() => setStorySubmitted(false)}>
                    Share Another Story
                  </Button>
                </div>
              ) : (
                <>
                  <ShareYourStoryForm onSubmit={handleStorySubmit} />
                  <div className="mt-6">
                    <Button variant="ghost" onClick={handleShareStoryClick}>
                      Read Real Stories
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <Info className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">This Feature is for Champions</h3>
              <p className="text-blue-700 mb-4">
                To share your story and protect your submission, please sign up to become a Champion. It's free and takes only a minute.
              </p>
              <Button onClick={() => navigate('/signup/champion')}>
                Become a Champion to Share
              </Button>
            </div>
          )}
        </div>
      </Container>

      {/* Refer Someone */}
      <Container>
        <div className="py-16 max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="p-10">
              <h2 className="text-2xl font-bold mb-4">
                Know Someone Aged 40+ Who Hasn't Been Screened?
              </h2>
              <p className="text-gray-700 mb-6">
                It only takes 1 minute to refer a friend, parent, or loved one for life-saving colorectal cancer screening.
              </p>
              
              {loading ? (
                <div className="mt-4 flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : isChampion ? (
                <Button onClick={handleReferFriendClick}>Refer Someone Now</Button>
              ) : (
                <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg text-center">
                  <p className="text-sky-700 mb-3">
                    Please sign up as a Champion to refer a friend.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/signup/champion')}>
                    Sign Up to Refer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
      
      {/* Remaining Page Content */}
      <Container>
        <div className="py-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Want to Learn More?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/education/patients/colorectal-cancer">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">What is Colorectal Cancer?</h3>
                  <p className="text-gray-600">Understand the basics of CRC — causes, risk factors, symptoms, and treatment.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/education/patients/early-symptoms-of-crc">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Early Symptoms to Watch For</h3>
                  <p className="text-gray-600">Learn to recognise warning signs and get help early.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/education/patients/how-crc-develops-from-polyps">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">How CRC Develops From Polyps</h3>
                  <p className="text-gray-600">Prevention starts with understanding — see how early polyps can become dangerous.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/education/patients/colonoscopy-gold-standard">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Colonoscopy: The Gold Standard</h3>
                  <p className="text-gray-600">Learn why colonoscopy is considered the most effective way to catch and treat CRC early.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </Container>
      <SG60GiftSection />
      <JoinMovementSection />
    </div>
  );
};

export default RIDCRCPUBPage;