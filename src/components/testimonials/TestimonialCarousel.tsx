import React from 'react';
import { Container } from '../ui/Container';
import { Card, CardContent } from '../ui/Card';
import { MessageCircle } from 'lucide-react';

// TESTIMONIAL CAROUSEL - COMMENTED OUT UNTIL REAL TESTIMONIALS AVAILABLE
// TODO: Enable this component only after verified patient testimonials are collected
// TODO: Connect to content/stories.json when real testimonial data is available

interface TestimonialCarouselProps {
  page?: 'homepage' | 'get-screened' | 'education';
  region?: string;
  maxItems?: number;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  page = 'homepage',
  region,
  maxItems = 3
}) => {
  
  // DISABLED: No testimonials will be shown until real ones are available
  const showTestimonials = false;
  
  if (!showTestimonials) {
    return (
      <div className="py-8 bg-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="opacity-50">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Patient Testimonials
              </h3>
              <p className="text-gray-500 text-sm">
                Real patient testimonials will appear here once verified submissions are received.
              </p>
            </div>
            
            {/* Placeholder structure for future testimonials */}
            <div className="grid md:grid-cols-3 gap-6 mt-8 opacity-25">
              {[1, 2, 3].map(i => (
                <Card key={i} className="border-dashed">
                  <CardContent className="p-6">
                    <div className="h-24 bg-gray-100 rounded mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }
  
  return null; // Returns nothing when testimonials are disabled
};

export default TestimonialCarousel;

// COMMENTED OUT INJECTION COMMANDS:
// 
// claude inject-testimonial-carousel --pages="homepage, get-screened, education" \
//   --testimonialsFile="./content/stories.json"
//
// This will remain commented until:
// 1. Real patient testimonials are collected
// 2. Proper consent and verification processes are in place
// 3. Medical accuracy review is completed