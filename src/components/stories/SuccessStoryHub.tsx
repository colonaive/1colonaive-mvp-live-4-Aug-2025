import React from 'react';
import { Container } from '../ui/Container';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, FileText, Volume2, Heart, MessageCircle } from 'lucide-react';

// SUCCESS STORY HUB COMPONENT - SCAFFOLD ONLY
// TODO: Inject verified stories only after live patient signups
// TODO: Connect to content/stories.json when real data is available

interface SuccessStoryHubProps {
  region?: string;
  language?: string;
  showSubmissionPrompt?: boolean;
}

const SuccessStoryHub: React.FC<SuccessStoryHubProps> = ({
  region = 'all',
  language = 'en',
  showSubmissionPrompt = true
}) => {
  
  // PLACEHOLDER: Will be replaced with real story data
  const hasStories = false; // Always false until real stories are added
  
  return (
    <div className="py-16 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                Success Stories & Patient Journeys
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who took control of their health through early screening.
            </p>
          </div>

          {/* Story Content Area - Currently Empty */}
          {!hasStories && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Stories Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  We're building a collection of inspiring patient journeys. 
                  Real stories will be shared here with patient consent and medical accuracy verification.
                </p>
                
                {showSubmissionPrompt && (
                  <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Share Your Story
                    </h4>
                    <p className="text-blue-700 text-sm mb-4">
                      Have you completed colorectal cancer screening? 
                      Your experience could help others take the first step.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      Submit Your Story
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Story Categories - Ready for future content */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 opacity-50">
            <Card>
              <CardContent className="p-6 text-center">
                <Play className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Video Stories</h3>
                <p className="text-sm text-gray-600">
                  Personal video testimonials from patients
                </p>
                <div className="text-2xl font-bold text-blue-600 mt-2">0</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Written Stories</h3>
                <p className="text-sm text-gray-600">
                  Detailed patient journey narratives
                </p>
                <div className="text-2xl font-bold text-green-600 mt-2">0</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Volume2 className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Audio Stories</h3>
                <p className="text-sm text-gray-600">
                  Voice recordings and interviews
                </p>
                <div className="text-2xl font-bold text-purple-600 mt-2">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Legal and Disclaimer */}
          <div className="text-center text-xs text-gray-500 border-t pt-8">
            <p className="mb-2">
              <strong>Medical Disclaimer:</strong> All patient stories are shared with consent and are for informational purposes only. 
              Individual results may vary. Always consult with healthcare professionals for personalized medical advice.
            </p>
            <p>
              Patient privacy is protected through anonymization where requested. 
              No personal health information is shared without explicit consent.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SuccessStoryHub;