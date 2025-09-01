// /src/pages/signup/CorporateSignUp.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../supabase';
import { authUtils } from '../../utils/auth';
import { authToast } from '../../utils/toast';
import { supabase } from '../../supabase';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Building2,
  User,
  Target,
  CheckCircle,
  Star,
  Award,
  Crown,
  AlertCircle,
  Loader2,
  Heart,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Shield,
  Globe,
  FileText,
  Zap,
  Eye,
  EyeOff,
  Home,
} from 'lucide-react';

interface CorporateFormData {
  companyName: string;
  uen: string;
  industry: string;
  companySize: string;
  contactPerson: string;
  designation: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  csrOptions: string[];
  pledgeAmount: string;
  preferDiscussion: boolean;
  additionalComments: string;
  agreedToTerms: boolean;
  agreedToNewsletter: boolean;
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
  borderColor: string;
}

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  children,
  defaultOpen = true,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-between hover:from-blue-100 hover:to-green-100 transition-all"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-blue-600">{icon}</div>}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      {isOpen && <div className="p-6 bg-white">{children}</div>}
    </div>
  );
};

const CorporateSignUp: React.FC = () => {
  const [unitCost, setUnitCost] = useState<number>(355);

  const [formData, setFormData] = useState<CorporateFormData>({
    companyName: '',
    uen: '',
    industry: '',
    companySize: '',
    contactPerson: '',
    designation: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    csrOptions: [],
    pledgeAmount: '',
    preferDiscussion: false,
    additionalComments: '',
    agreedToTerms: false,
    agreedToNewsletter: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CorporateFormData | 'form', string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTier, setCurrentTier] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      window.scrollTo(0, 0);
    }
  }, [showSuccess]);

  useEffect(() => {
    const fetchUnitCost = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('setting_name', 'crc_test_unit_cost')
          .single();
        if (error) throw error;

        // Expecting JSONB like { cost: 355 }
        if (data && data.setting_value && typeof data.setting_value.cost === 'number') {
          setUnitCost(data.setting_value.cost);
        }
      } catch (error) {
        console.error('Error fetching unit cost:', error);
      }
    };
    fetchUnitCost();
  }, []);

  const industryOptions = [
    'Banking & Finance',
    'Healthcare & Pharmaceuticals',
    'Technology & Software',
    'Manufacturing & Engineering',
    'Real Estate & Construction',
    'Retail & E-commerce',
    'Education & Training',
    'Transportation & Logistics',
    'Food & Beverage',
    'Professional Services',
    'Media & Communications',
    'Government & Public Sector',
    'Others',
  ];

  const companySizeOptions = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees',
  ];

  const csrOptionsList = [
    {
      id: 'workplace-screening',
      label: 'Workplace CRC Screening Drives',
      description: 'Organize screening events for your employees',
      impact: 'Direct employee health benefit',
    },
    {
      id: 'public-screening',
      label: 'Sponsorship of Public Screening Access',
      description: 'Fund screening tests for underserved Singaporeans',
      impact: `S$${unitCost} per life potentially saved`,
    },
    {
      id: 'health-talks',
      label: 'Employee Health & Wellness Talks',
      description: 'Educational sessions by medical professionals',
      impact: 'Preventive health awareness',
    },
    {
      id: 'public-events',
      label: 'Sponsorship of Public Health Events',
      description: 'Support community awareness campaigns',
      impact: 'Brand visibility + social impact',
    },
    {
      id: 'media-partnership',
      label: 'Co-branding & Media Partnership',
      description: 'Collaborate on awareness campaigns',
      impact: 'Shared marketing + CSR goals',
    },
  ];

  const sponsorshipTiers: SponsorshipTier[] = [
    {
      name: 'Gold Champion',
      icon: <Award className="h-8 w-8" />,
      livesReached: '100-499',
      budgetRange: `S$${(100 * unitCost).toLocaleString()}-S$${(499 * unitCost).toLocaleString()}`,
      perks: [
        'Logo placement on COLONAiVE™ website',
        'Quarterly impact reports with metrics',
        'Certificate of CSR partnership',
        'Social media recognition',
      ],
      minAmount: 100 * unitCost,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      name: 'Platinum Champion',
      icon: <Star className="h-8 w-8" />,
      livesReached: '500-999',
      budgetRange: `S$${(500 * unitCost).toLocaleString()}-S$${(999 * unitCost).toLocaleString()}`,
      perks: [
        'Homepage feature + impact story',
        'Media mentions in press releases',
        'VIP invitations to health events',
        'Custom CSR showcase content',
        'Executive networking opportunities',
      ],
      minAmount: 500 * unitCost,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
    {
      name: 'Diamond Champion',
      icon: <Crown className="h-8 w-8" />,
      livesReached: '1000+',
      budgetRange: `S$${(1000 * unitCost).toLocaleString()}+`,
      perks: [
        'Full media spotlight + feature stories',
        'Co-branded campaign materials',
        'Executive recognition dinner',
        'Speaking opportunities at events',
        'Advisory board invitation',
        'Custom CSR impact documentary',
      ],
      minAmount: 1000 * unitCost,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ];

  const calculateLives = (amount: string): number => {
    if (!amount || isNaN(Number(amount)) || unitCost === 0) return 0;
    return Math.floor(Number(amount) / unitCost);
  };

  const calculateTier = (amount: string): string => {
    if (!amount || isNaN(Number(amount))) return '';
    const numAmount = Number(amount);
    if (numAmount >= 1000 * unitCost) return 'Diamond Champion';
    if (numAmount >= 500 * unitCost) return 'Platinum Champion';
    if (numAmount >= 100 * unitCost) return 'Gold Champion';
    return '';
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password && /[a-z]/.test(password)) strength++;
    if (password && /[A-Z]/.test(password)) strength++;
    if (password && /[0-9]/.test(password)) strength++;
    if (password && /[^A-Za-z0-9]/.test(password)) strength++;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const colorIndex = Math.max(0, strength - 1);
    return {
      score: strength,
      label: labels[strength] || 'Very Weak',
      color: colors[colorIndex] || 'bg-red-500',
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'preferDiscussion' || name === 'agreedToTerms' || name === 'agreedToNewsletter') {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
        const option = value;
        setFormData((prev) => ({
          ...prev,
          csrOptions: checked ? [...prev.csrOptions, option] : prev.csrOptions.filter((item) => item !== option),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === 'pledgeAmount') {
        setCurrentTier(calculateTier(value));
      }
    }

    if (errors[name as keyof CorporateFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CorporateFormData, string>> = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.uen.trim()) newErrors.uen = 'UEN number is required';
    if (!formData.industry) newErrors.industry = 'Industry selection is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!authUtils.isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email address';

    const pwVal = authUtils.validatePassword(formData.password);
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!pwVal.isValid) newErrors.password = pwVal.message;

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.csrOptions.length === 0) newErrors.csrOptions = 'Please select at least one CSR option';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToForm = () => {
    document.getElementById('corporate-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Supabase Auth sign-up
      const { data, error } = await authApi.signUp(formData.email, formData.password, {
        full_name: formData.contactPerson.trim(),
        user_type: 'corporate_contact',
      });

      if (error) throw error;
      if (!data || !data.user) throw new Error('User account creation failed in Supabase Auth.');

      // Create corporate account via RPC
      const { error: setupError } = await supabase.rpc('create_full_corporate_account', {
        p_contact_user_id: data.user.id,
        p_company_name: formData.companyName.trim(),
        p_uen: formData.uen.trim(),
        p_industry: formData.industry,
        p_company_size: formData.companySize,
        designation: formData.designation, // match RPC signature
        p_contact_person_name: formData.contactPerson.trim(),
        p_phone_number: formData.phone.trim(),
        p_pledge_amount: formData.pledgeAmount ? Number(formData.pledgeAmount) : null,
        p_csr_options: formData.csrOptions,
        p_additional_comments: formData.additionalComments.trim() || null,
      });
      if (setupError) throw setupError;

      setIsLoading(false);
      setShowSuccess(true);
      authToast.signUpSuccess();
    } catch (err: any) {
      const errorMessage = err?.message || 'An unexpected error occurred.';
      setErrors({ form: errorMessage });
      authToast.signUpError(errorMessage);
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Submitted!</h1>
          <p className="text-lg text-gray-600">Thank you for joining our mission to reduce colorectal cancer mortality in Singapore.</p>

          <div className="bg-yellow-50 p-6 rounded-lg my-6 text-left">
            <p className="text-yellow-800 font-bold mb-2">📧 Step 1: Check Your Email</p>
            <p className="text-yellow-700">
              Please verify your email address by clicking the confirmation link we just sent to <span className="font-medium">{formData.email}</span>. This is required to activate your account.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg my-6 text-left">
            <p className="text-blue-800 font-bold mb-2">🤝 Step 2: Partnership Review</p>
            <p className="text-blue-700">Our CSR partnership team will review your application and follow up with a tailored proposal within 2-3 business days.</p>
          </div>

          <Link to="/">
            <Button className="mt-4 inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Transform Lives Through Corporate Leadership</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Every S${unitCost} contribution saves a life.</p>
            <button
              onClick={scrollToForm}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <Heart className="h-5 w-5" />
              Join as Corporate Champion
            </button>
          </div>
        </Container>
      </div>

      <div className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Strategic CSR Impact with Measurable ROI</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Partner with COLONAiVE™ for CSR initiatives that deliver tangible health outcomes, employee wellness benefits, and powerful brand association.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Measurable Health Impact</h3>
              <p className="text-gray-600">Track lives saved, early detections, and community health improvements with detailed quarterly reports</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Wellness ROI</h3>
              <p className="text-gray-600">Reduce healthcare costs through preventive screening programs and boost employee satisfaction</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Leadership Position</h3>
              <p className="text-gray-600">Establish thought leadership in healthcare CSR with co-branded campaigns and media features</p>
            </div>
          </div>
        </Container>
      </div>

      <div className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Corporate Partnership Tiers</h2>
            <p className="text-lg text-gray-600">Choose your level of impact and receive corresponding recognition and benefits</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier) => (
              <div key={tier.name} className={`${tier.bgColor} border-2 ${tier.borderColor} rounded-xl p-6 hover:shadow-lg transition-all`}>
                <div className="text-center mb-6">
                  <div className={`${tier.color} mb-3 flex justify-center`}>{tier.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-2xl font-bold text-gray-700 mb-1">{tier.livesReached}</p>
                  <p className="text-sm text-gray-600">Lives Potentially Saved</p>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{tier.budgetRange}</p>
                </div>

                <ul className="space-y-2">
                  {tier.perks.map((perk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <div id="corporate-form" className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Corporate CSR Partnership Registration</h2>
              <p className="text-lg text-gray-600">Join Singapore&apos;s leading corporations in the fight against colorectal cancer</p>
            </div>

            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-800">{errors.form}</p>
                </div>
              </div>
            )}

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                  <CollapsibleSection
                    title="Company Information"
                    subtitle="Tell us about your organization"
                    icon={<Building2 className="h-5 w-5" />}
                    defaultOpen={true}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Company Name */}
                      <div className="space-y-2">
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="ABC Corporation Pte Ltd"
                          className={`w-full px-3 py-2 border rounded-lg ${errors.companyName ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                      </div>

                      {/* UEN */}
                      <div className="space-y-2">
                        <label htmlFor="uen" className="block text-sm font-medium text-gray-700">
                          UEN Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="uen"
                          name="uen"
                          value={formData.uen}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="200123456A"
                          className={`w-full px-3 py-2 border rounded-lg ${errors.uen ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.uen && <p className="text-red-500 text-sm">{errors.uen}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      {/* Industry */}
                      <div className="space-y-2">
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                          Industry Sector <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 border rounded-lg ${errors.industry ? 'border-red-300' : 'border-gray-300'}`}
                        >
                          <option value="">Select Industry</option>
                          {industryOptions.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
                      </div>

                      {/* Company Size */}
                      <div className="space-y-2">
                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                          Company Size <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="companySize"
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleChange}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 border rounded-lg ${errors.companySize ? 'border-red-300' : 'border-gray-300'}`}
                        >
                          <option value="">Select Company Size</option>
                          {companySizeOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors.companySize && <p className="text-red-500 text-sm">{errors.companySize}</p>}
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="Primary Contact & Account Setup"
                    subtitle="Who we'll reach out to and account credentials"
                    icon={<User className="h-5 w-5" />}
                    defaultOpen={true}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Contact Person */}
                      <div className="space-y-2">
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                          Contact Person Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="John Doe"
                          className={`w-full px-3 py-2 border rounded-lg ${errors.contactPerson ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.contactPerson && <p className="text-red-500 text-sm">{errors.contactPerson}</p>}
                      </div>

                      {/* Designation */}
                      <div className="space-y-2">
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                          Job Title/Designation <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="CSR Manager"
                          className={`w-full px-3 py-2 border rounded-lg ${errors.designation ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      {/* Email */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="john.doe@company.com"
                          className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="+65 9123 4567"
                          className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      {/* Password */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Create a secure password"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                            </div>
                          </div>
                        )}
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Confirm your password"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="CSR Partnership Interests"
                    subtitle="Select partnership opportunities that interest you"
                    icon={<Heart className="h-5 w-5" />}
                    defaultOpen={true}
                  >
                    <div className="space-y-4">
                      {csrOptionsList.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.csrOptions.includes(option.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={formData.csrOptions.includes(option.id)}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="mt-1 mr-4 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                            <div className="text-sm text-gray-600 mb-2">{option.description}</div>
                            <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full inline-block">{option.impact}</div>
                          </div>
                        </label>
                      ))}
                      {errors.csrOptions && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.csrOptions}
                        </p>
                      )}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="Investment & Impact Planning"
                    subtitle="Help us understand your CSR budget and goals"
                    icon={<TrendingUp className="h-5 w-5" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Estimated Annual CSR Budget <span className="text-gray-400">(Optional)</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S$</span>
                          <input
                            type="number"
                            name="pledgeAmount"
                            value={formData.pledgeAmount}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="35500"
                            min="0"
                            step="500"
                          />
                        </div>
                        <p className="text-sm text-gray-600">Reference: S${unitCost} per screening test = 1 life potentially saved</p>

                        {formData.pledgeAmount && calculateLives(formData.pledgeAmount) > 0 && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3 mb-2">
                              <Target className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-blue-900">Projected Impact</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">S${Number(formData.pledgeAmount).toLocaleString()}</div>
                                <div className="text-xs text-gray-600">Total Investment</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-green-600">{calculateLives(formData.pledgeAmount)}</div>
                                <div className="text-xs text-gray-600">Lives Impacted</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">{currentTier.split(' ')[0] || 'Partner'}</div>
                                <div className="text-xs text-gray-600">Recognition Tier</div>
                              </div>
                            </div>

                            {currentTier && (
                              <div className="mt-3 text-center">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">🏆 {currentTier} Status</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="preferDiscussion"
                            checked={formData.preferDiscussion}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Prefer to discuss budget and partnership details in person</span>
                            <p className="text-xs text-gray-600 mt-1">Our CSR team will schedule a consultation to understand your specific goals and constraints</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="Additional Information"
                    subtitle="Share any specific requirements or questions"
                    icon={<FileText className="h-5 w-5" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-2">
                      <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
                        Comments, Questions, or Special Requirements
                      </label>
                      <textarea
                        id="additionalComments"
                        name="additionalComments"
                        rows={4}
                        value={formData.additionalComments}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Share any specific CSR goals, compliance requirements..."
                      />
                    </div>
                  </CollapsibleSection>

                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Terms & Agreements
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="agreedToTerms"
                          name="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="mt-1 mr-3 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <label htmlFor="agreedToTerms" className="text-sm text-gray-700">
                          I agree to the{' '}
                          <a href="/terms-of-use" className="text-blue-600 hover:underline font-medium">
                            Terms and Conditions
                          </a>{' '}
                          and{' '}
                          <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                            Privacy Policy
                          </a>{' '}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {errors.agreedToTerms && <p className="text-sm ml-6 text-red-500">{errors.agreedToTerms}</p>}

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="agreedToNewsletter"
                          name="agreedToNewsletter"
                          checked={formData.agreedToNewsletter}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="mt-1 mr-3 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <label htmlFor="agreedToNewsletter" className="text-sm text-gray-700">
                          Subscribe to CSR partnership updates, impact reports, and COLONAiVE™ corporate newsletters
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-8 border-t border-gray-200">
                    <blockquote className="text-lg italic text-gray-700 mb-4">
                      "Corporate leadership in healthcare isn't just about profit margins, it's about saving lives and building a healthier Singapore for everyone."
                    </blockquote>
                    <cite className="text-sm text-gray-500">- COLONAiVE™ Corporate Partnership Team</cite>
                  </div>

                  <div className="text-center pt-4">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          Creating Corporate Account...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Zap className="h-6 w-6" />
                          Create Corporate Champion Account
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-8 text-center border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium underline">
                      Sign in to your corporate dashboard
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CorporateSignUp;
