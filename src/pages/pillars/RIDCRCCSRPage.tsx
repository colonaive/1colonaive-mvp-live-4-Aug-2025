// /home/project/src/pages/pillars/RIDCRCCSRPage.tsx

import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Building2,
  Heart,
  Users,
  TrendingUp,
  Award,
  Shield,
  Globe,
  Target,
  CheckCircle,
  Star,
  Handshake,
  BarChart3,
  Calendar,
  Mail,
  ArrowRight,
  AlertTriangle,
  Zap,
  Trophy,
  Presentation,
  Briefcase,
  FileText
} from 'lucide-react';
import { supabase } from '../../supabase';

interface PartnerTestimonial {
  company: string;
  quote: string;
  role: string;
  tier: string;
}

const RIDCRCCSRPage: React.FC = () => {
  const [partnersCount, setPartnersCount] = useState(0);
  const [livesImpacted, setLivesImpacted] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: partners } = await supabase
        .from('corporate_sponsorships')
        .select('id')
        .eq('status', 'active');

      if (partners) {
        setPartnersCount(partners.length);
        // Simulate lives impacted calculation (you can make this more sophisticated)
        setLivesImpacted(partners.length * 350);
      }
    };
    fetchStats();
  }, []);

  const tierBenefits = [
    {
      tier: "Gold Partner",
      investment: "100-499 Tests",
      color: "from-yellow-400 to-orange-500",
      borderColor: "border-yellow-500",
      icon: <Award className="h-8 w-8" />,
      benefits: [
        "Company logo on CSR showcase page",
        "Dedicated sponsor feature story",
        "CSR impact report with metrics",
        "Certificate of partnership",
        "Optional workplace screening setup"
      ],
      impact: "Potentially save 50-100 lives through early detection"
    },
    {
      tier: "Platinum Partner",
      investment: "500-999 Tests",
      color: "from-gray-400 to-gray-600",
      borderColor: "border-gray-500",
      icon: <Star className="h-8 w-8" />,
      benefits: [
        "All Gold benefits included",
        "Homepage partner badge",
        "Featured in press releases",
        "Employee wellness story highlight",
        "Quarterly impact presentations",
        "Co-branded screening events"
      ],
      impact: "Potentially save 250-500 lives and create massive awareness"
    },
    {
      tier: "Diamond Partner",
      investment: "1000+ Tests",
      color: "from-blue-400 to-purple-600",
      borderColor: "border-blue-500",
      icon: <Trophy className="h-8 w-8" />,
      benefits: [
        "All Platinum benefits included",
        "Premium homepage spotlight",
        "Joint media coverage opportunities",
        "Speaking opportunities at events",
        "Custom CSR campaign development",
        "Executive recognition ceremonies",
        "Annual healthcare excellence award"
      ],
      impact: "Potentially save 500+ lives and become a national health champion"
    }
  ];

  const impactStats = [
    { number: "90%", label: "Survival Rate When Detected Early", icon: <Heart className="h-6 w-6 text-red-500" /> },
    { number: "60%+", label: "Currently Diagnosed Late Stage", icon: <AlertTriangle className="h-6 w-6 text-orange-500" /> },
    { number: "70%", label: "Skip Recommended Screening", icon: <Shield className="h-6 w-6 text-blue-500" /> },
    { number: "#1", label: "Cancer in Singapore", icon: <Target className="h-6 w-6 text-purple-500" /> }
  ];

  const corporateBenefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Enhanced Brand Reputation",
      description: "Position your company as a healthcare innovation leader and life-saving champion in Singapore."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Employee Wellness Program",
      description: "Provide valuable health screening benefits to your workforce, boosting morale and retention."
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "National Media Exposure",
      description: "Gain positive media coverage and recognition as a socially responsible corporate citizen."
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: "CSR Excellence Recognition",
      description: "Receive industry awards and certifications for outstanding corporate social responsibility."
    },
    {
      icon: <Handshake className="h-8 w-8 text-teal-600" />,
      title: "Strategic Partnerships",
      description: "Connect with healthcare leaders, government agencies, and other premium corporate partners."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      title: "Measurable Impact Reporting",
      description: "Receive detailed analytics and impact reports to showcase your contribution to stakeholders."
    }
  ];

  // Testimonials will be populated from real partner feedback via their dashboards
  const testimonials: PartnerTestimonial[] = [];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Building2 className="h-16 w-16 text-white mx-auto mb-8" />
            <h1 className="text-5xl font-bold mb-6">RID-CRC CSR™</h1>
            <p className="text-2xl mb-6 font-light">
              Corporate Champions Against Cancer
            </p>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Partner with Singapore's most impactful health movement. Your corporate sponsorship doesn't just build brand reputation — it saves lives through early colorectal cancer detection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/corporate">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                  Become a Partner Today
                </Button>
              </Link>
              <Link to="/register/corporate">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  Calculate Your Impact
                </Button>
              </Link>
              <a href="/pdfs/CSR_PitchDeck_COLONAIVE.pdf" download="COLONAiVE_Corporate_Partnership_Deck.pdf" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg inline-flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Download Pitch Deck
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Crisis Statement with Urgency */}
      <Container>
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 sm:p-8 mb-8 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <AlertTriangle className="h-10 w-10 text-red-600 flex-shrink-0" />
              <div className="min-w-0 w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-red-800 mb-4 break-words">
                  The Corporate Opportunity to Save Lives
                </h2>
                <p className="text-red-700 mb-4 text-base sm:text-lg break-words">
                  <strong>
                    Every day, Singaporeans die from colorectal cancer — not because we can't treat it, but because we detect it too late.
                  </strong>
                </p>
                <p className="text-red-700 mb-6 text-base sm:text-lg break-words">
                  Your corporate partnership can change this narrative. While traditional CSR focuses on charity, this is about
                  <strong> measurable life-saving impact </strong>
                  that elevates your brand as a true healthcare champion.
                </p>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {impactStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center bg-white p-4 rounded-lg shadow-sm break-words w-full"
                    >
                      <div className="flex justify-center mb-2">{stat.icon}</div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{stat.number}</div>
                      <div className="text-sm text-gray-600 break-words">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


      </Container>

      {/* Current Impact Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Growing Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-800">{partnersCount}+</div>
                <div className="text-lg text-gray-600">Corporate Partners</div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-800">{livesImpacted.toLocaleString()}+</div>
                <div className="text-lg text-gray-600">Lives Potentially Saved</div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-800">2035</div>
                <div className="text-lg text-gray-600">CRC-Free Singapore Goal</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Partnership Tiers */}
      <Container>
        <div className="py-16 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Choose Your Partnership Level</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every tier creates meaningful impact. Select the partnership level that aligns with your corporate values and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tierBenefits.map((tier, index) => (
              <Card key={index} className={`border-t-4 ${tier.borderColor} hover:shadow-xl transition-shadow duration-300 relative`}>
                <CardContent className="p-8">
                  <div className={`bg-gradient-to-r ${tier.color} text-white p-4 rounded-lg mb-6 text-center`}>
                    <div className="flex justify-center mb-2">{tier.icon}</div>
                    <h3 className="text-2xl font-bold">{tier.tier}</h3>
                    <p className="text-lg opacity-90">{tier.investment}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-lg text-gray-800">Partnership Benefits:</h4>
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h5 className="font-semibold text-gray-800 mb-2">Potential Impact:</h5>
                    <p className="text-gray-700 text-sm">{tier.impact}</p>
                  </div>

                  <Link to="/register/corporate" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                      Choose {tier.tier}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>

      {/* Corporate Benefits Section */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Why Leading Companies Choose COLONAiVE™</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Beyond saving lives, your partnership delivers tangible business value and positions your company as a healthcare innovation leader.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {corporateBenefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {benefit.icon}
                      <h3 className="text-xl font-semibold ml-3">{benefit.title}</h3>
                    </div>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Success Stories & Testimonials - Placeholder for Real Partner Feedback */}
      <Container>
        <div className="py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Partner Success Stories</h2>
            <p className="text-xl text-gray-600">Real feedback from companies making a real difference</p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {testimonial.tier} Partner
                      </span>
                    </div>
                    <blockquote className="text-gray-700 mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-800">{testimonial.company}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Be Among Our First Corporate Partners
                </h3>
                <p className="text-gray-600 mb-6">
                  Your company could be the first to share a powerful story of how corporate CSR partnerships are saving lives and making a measurable impact in Singapore's fight against colorectal cancer.
                </p>
                <Link to="/register/corporate">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                    Become a Founding Partner
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Impact Calculator Section */}
      <div id="impact-calculator" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Presentation className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 sm:mb-8" />

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Calculate Your Potential Impact
            </h2>

            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
              See how your corporate partnership translates into lives saved and community impact
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-white bg-opacity-20 p-4 sm:p-6 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">500</div>
                <div className="text-base sm:text-lg">Tests Sponsored</div>
                <div className="text-xs sm:text-sm opacity-75 mt-1 sm:mt-2">Platinum Partnership</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 sm:p-6 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">250+</div>
                <div className="text-base sm:text-lg">Potential Lives Saved</div>
                <div className="text-xs sm:text-sm opacity-75 mt-1 sm:mt-2">Through early detection</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 sm:p-6 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">$2.5M+</div>
                <div className="text-base sm:text-lg">Healthcare Cost Savings</div>
                <div className="text-xs sm:text-sm opacity-75 mt-1 sm:mt-2">Early vs late treatment</div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Link to="/register/corporate">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                >
                  Start Your Partnership Journey
                </Button>
              </Link>
              <p className="text-xs sm:text-sm opacity-75">
                Custom impact calculations available for larger partnerships
              </p>
            </div>
          </div>
        </Container>
      </div>



      {/* How It Works */}
      <Container>
        <div className="py-16 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Your Partnership Journey</h2>
            <p className="text-xl text-gray-600">From signup to impact — here's how we make it seamless</p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Partnership Setup",
                description: "Complete our corporate signup form and choose your sponsorship tier. Our team contacts you within 24 hours.",
                icon: <Briefcase className="h-8 w-8 text-blue-600" />
              },
              {
                step: "2",
                title: "Program Customization",
                description: "We tailor the screening program to your workforce size, locations, and CSR objectives.",
                icon: <Target className="h-8 w-8 text-green-600" />
              },
              {
                step: "3",
                title: "Launch & Execution",
                description: "Roll out employee screening, launch awareness campaigns, and begin making measurable impact.",
                icon: <Zap className="h-8 w-8 text-purple-600" />
              },
              {
                step: "4",
                title: "Impact Reporting",
                description: "Receive quarterly reports showing lives impacted, media coverage, and ROI metrics for your stakeholders.",
                icon: <BarChart3 className="h-8 w-8 text-orange-600" />
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative">
                <div className="flex-shrink-0">
                  <div className="bg-gray-100 rounded-full p-4 text-center">
                    <span className="text-2xl font-bold text-gray-800">{item.step}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    {item.icon}
                    <h3 className="text-2xl font-semibold ml-3">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>

                {/* Responsive Arrow */}
                {index < 3 && (
                  <div className="hidden sm:flex flex-shrink-0">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

            ))}
          </div>
        </div>
      </Container>

      {/* Current Showcase Preview */}
      <div className="bg-blue-50 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Showcase of Champions</h2>
            <p className="text-xl text-gray-600 mb-8">
              See how we recognize and celebrate our corporate partners
            </p>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏢</div>
                  <div className="font-semibold">Your Company</div>
                  <div className="text-sm text-gray-500">Future Partner</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🤝</div>
                  <div className="font-semibold">Partner Spotlight</div>
                  <div className="text-sm text-gray-500">Coming Soon</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💼</div>
                  <div className="font-semibold">Corporate Champion</div>
                  <div className="text-sm text-gray-500">Available Slot</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="font-semibold">Feature Partner</div>
                  <div className="text-sm text-gray-500">Premium Tier</div>
                </div>
              </div>
              <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  Be among the first companies to be featured as a life-saving corporate champion
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
              <Link to="/csr-showcase">
                <Button variant="outline" className="w-full sm:w-auto">View Full Showcase</Button>
              </Link>
              <Link to="/signup/corporate">
                <Button className="w-full sm:w-auto">Join the Showcase</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto mb-8" />
            <h2 className="text-4xl font-bold mb-6">Every Partnership Saves Lives</h2>
            <p className="text-xl mb-8 opacity-90">
              Don't let this opportunity pass. While your competitors focus on traditional CSR,
              you can lead Singapore's fight against its #1 cancer and build an unparalleled reputation as a life-saving corporate champion.
            </p>

            <div className="bg-white bg-opacity-20 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Saving Lives?</h3>
              <p className="mb-4">
                Join the movement that's eliminating colorectal cancer by 2035. Your corporate partnership begins with a single click.
              </p>
            </div>

            <div className="space-y-4">
              <Link to="/register/corporate">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold px-12 py-4 text-xl">
                  Become a Life-Saving Partner
                </Button>
              </Link>
              <div className="flex justify-center space-x-6 text-sm opacity-75">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Setup in 24 hours</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Dedicated support</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  <span>Immediate impact</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Navigation Footer */}
      <div className="py-8 bg-gray-50">
        <Container>
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/movement-pillars">
                <Button variant="outline" className="w-full sm:w-auto">Explore All Pillars</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="w-full sm:w-auto">Learn More About COLONAiVE™</Button>
              </Link>
            </div>
            <Link to="/">
              <Button variant="secondary" className="w-full sm:w-auto">Return to Home</Button>
            </Link>
          </div>
        </Container>
      </div>
  </div>
  );
};

export default RIDCRCCSRPage;