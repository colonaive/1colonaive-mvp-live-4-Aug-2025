import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, User, Target, CheckCircle, Star, Award, Crown, AlertCircle, Loader2, Heart, Users, Briefcase } from 'lucide-react';

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  csrOptions: string[];
  pledgeAmount: string;
  preferDiscussion: boolean;
  additionalComments: string;
}

interface SponsorshipTier {
  name: string;
  icon: React.ReactNode;
  livesReached: string;
  budgetRange: string;
  perks: string[];
  minAmount: number;
  color: string;
  bgColor: string;
}

const CorporateSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    csrOptions: [],
    pledgeAmount: '',
    preferDiscussion: false,
    additionalComments: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'api', string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTier, setCurrentTier] = useState<string>('');

  const csrOptionsList = [
    'Workplace CRC Screening Drives',
    'Sponsorship of Public Screening Access',
    'Employee Health Talks',
    'Sponsorship of Public Events',
    'Co-branding / Media Engagement'
  ];

  const sponsorshipTiers: SponsorshipTier[] = [
    {
      name: 'Gold Sponsor',
      icon: <Award className="h-8 w-8" />,
      livesReached: '100–499',
      budgetRange: 'S$35,500–S$177,445',
      perks: ['Logo + link on CSR Showcase page', 'Quarterly impact reports', 'Certificate of appreciation'],
      minAmount: 35500,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Platinum Sponsor',
      icon: <Star className="h-8 w-8" />,
      livesReached: '500–999',
      budgetRange: 'S$177,500–S$354,645',
      perks: ['Homepage badge + impact story', 'Media mentions in campaigns', 'VIP event invitations'],
      minAmount: 177500,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      name: 'Diamond Sponsor',
      icon: <Crown className="h-8 w-8" />,
      livesReached: '1000+',
      budgetRange: 'S$355,000+',
      perks: ['Full spotlight + media feature', 'Co-branded campaign materials', 'Executive recognition dinner'],
      minAmount: 355000,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const calculateTier = (amount: string): string => {
    if (!amount || isNaN(Number(amount))) return '';
    const numAmount = Number(amount);
    
    if (numAmount >= 355000) return 'Diamond Sponsor';
    if (numAmount >= 177500) return 'Platinum Sponsor';
    if (numAmount >= 35500) return 'Gold Sponsor';
    return '';
  };

  const calculateLives = (amount: string): number => {
    if (!amount || isNaN(Number(amount))) return 0;
    return Math.floor(Number(amount) / 355);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'preferDiscussion') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        // Handle CSR options checkboxes
        const option = value;
        setFormData(prev => ({
          ...prev,
          csrOptions: checked 
            ? [...prev.csrOptions, option]
            : prev.csrOptions.filter(item => item !== option)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'pledgeAmount') {
        setCurrentTier(calculateTier(value));
      }
    }

    // Clear errors when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[+]?[(]?[\d\s\-()]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.csrOptions.length === 0) {
      newErrors.csrOptions = 'Please select at least one CSR option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, api: undefined }));
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual Supabase integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 5000);
      
    } catch (error: any) {
      setErrors(prev => ({ ...prev, api: error.message || 'An unexpected error occurred.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('sponsorship-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to COLONAiVE™!</h1>
            <p className="text-lg text-gray-600">
              Thank you for joining our mission to reduce colorectal cancer mortality in Singapore.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <p className="text-green-800 font-medium mb-2">What happens next?</p>
            <p className="text-green-700">
              Our team will review your CSR preferences and follow up with a tailored proposal within 2-3 business days.
              Together, we'll create a meaningful impact in Singapore's fight against colorectal cancer.
            </p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to homepage in a few seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join the Movement. Save Lives.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Be a Corporate Champion in Singapore's fight against colorectal cancer.
          </p>
          <button 
            onClick={scrollToForm}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Become a Sponsor
          </button>
        </div>
      </div>

      {/* Impact Messaging */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Make a Meaningful CSR Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Partner with COLONAiVE™ to create lasting change in Singapore's public health landscape
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sponsor CRC Screening</h3>
              <p className="text-gray-600">Fund screening tests for underserved Singaporeans at S$355 per test</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Briefcase className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Workplace Screening</h3>
              <p className="text-gray-600">Organize staff screening drives to promote employee wellness</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Public Health Events</h3>
              <p className="text-gray-600">Host educational talks and awareness campaigns with clinicians</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsorship Tiers */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recognition Tiers</h2>
            <p className="text-lg text-gray-600">
              Choose your level of impact and receive corresponding recognition
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Tier</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">No. of Lives Reached</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Estimated Budget (S$355/test)</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Visibility Perks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sponsorshipTiers.map((tier, index) => (
                  <tr key={tier.name} className={`${tier.bgColor} hover:bg-opacity-75 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={tier.color}>
                          {tier.icon}
                        </div>
                        <span className="font-semibold text-gray-900">{tier.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {tier.livesReached}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {tier.budgetRange}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tier.perks.map((perk, perkIndex) => (
                          <li key={perkIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sponsorship Form */}
      <div id="sponsorship-form" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sponsorship Interest Form</h2>
            <p className="text-lg text-gray-600">
              Let us know how you'd like to make an impact
            </p>
          </div>

          {errors.api && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{errors.api}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ABC Corporation Pte Ltd"
                  />
                </div>
                {errors.companyName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.contactPerson && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john.doe@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+65 9123 4567"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* CSR Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred CSR Options <span className="text-red-500">*</span>
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {csrOptionsList.map(option => (
                  <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.csrOptions.includes(option)}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {errors.csrOptions && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.csrOptions}
                </p>
              )}
            </div>

            {/* Pledge Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Pledge Amount <span className="text-gray-400">(optional)</span>
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S$</span>
                  <input
                    type="number"
                    name="pledgeAmount"
                    value={formData.pledgeAmount}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="35500"
                    min="0"
                    step="500"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  At S$355 per test, a S$35,500 pledge will support 100 lives.
                </p>
                {formData.pledgeAmount && calculateLives(formData.pledgeAmount) > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Your pledge of S${Number(formData.pledgeAmount).toLocaleString()} will support approximately{' '}
                      <span className="font-bold">{calculateLives(formData.pledgeAmount)} lives</span>
                      {currentTier && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {currentTier}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Prefer Discussion */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="preferDiscussion"
                  checked={formData.preferDiscussion}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  We'd prefer to discuss and finalize budget later.
                </span>
              </label>
            </div>

            {/* Additional Comments */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Any specific requirements or questions about the partnership..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2 min-w-[250px] justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    Submit & Join the Movement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CorporateSignUp;