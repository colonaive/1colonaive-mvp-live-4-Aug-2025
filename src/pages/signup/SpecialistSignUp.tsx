// /src/pages/signup/SpecialistSignUp.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi, supabase } from '../../supabase';
import { authUtils } from '../../utils/auth';
import { authToast } from '../../utils/toast';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import {
  Building2, Globe, Stethoscope, Shield,
  AlertCircle, Loader2, CheckCircle, Eye, EyeOff, Home,
  PlusCircle, XCircle
} from 'lucide-react';

interface SpecialistFormData {
  specialistName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  medicalRegistrationNo: string;
  qualifications: string;
  fieldOfSpecialization: string;
  clinicAffiliation: string;
  address: string;
  postalCode: string;
  region: string;
  website: string;
  yearsOfExperience: string;
  specialties: string[];          // predefined selections
  otherSpecialties: string[];     // free-form custom entries
  languages: string;
  operatingHours: { weekdays: string; saturday: string; sunday: string; publicHoliday: string; };
  insurancePartners: string;
  notes: string;
  agreedToTerms: boolean;
}

/** CRC‑relevant predefined options (expanded) */
const SPECIALTIES = [
  // Core endoscopy / CRC
  'Colonoscopy (Diagnostic)',
  'Colonoscopy (Screening)',
  'Screening Colonoscopy (asymptomatic)',
  'Polypectomy',
  'Polyp Detection & Removal',
  'GI Bleeding Management',
  'Colorectal Cancer Treatment',

  // Minimally invasive surgery
  'Laparoscopic Colorectal Surgery',
  'Robotic Colorectal Surgery',
  'Transanal Minimally Invasive Surgery (TAMIS)',
  'Transanal Endoscopic Microsurgery (TEM)',

  // Advanced therapeutic endoscopy
  'Endoscopic Mucosal Resection (EMR)',
  'Endoscopic Submucosal Dissection (ESD)',
  'Endoscopic Full-Thickness Resection (EFTR)',

  // Diagnostics & adjuncts
  'Upper GI Endoscopy / Gastroscopy',
  'CT Colonography (Virtual Colonoscopy)',
  'Capsule Endoscopy',

  // Related disease areas
  'IBD (Crohn\'s / Ulcerative Colitis)',
  'IBS & Functional GI Disorders',
  'Constipation / Chronic Diarrhea',
  'Haemorrhoids (Non-surgical)',
  'Haemorrhoids (Surgical)',
  'Rectal Prolapse',
  'Colonoscopy under sedation',

  // Multidisciplinary cancer care
  'Hereditary CRC Risk & Genetic Counselling',
  'Stoma Care & Survivorship',
  'Pelvic Floor Disorders & Fecal Incontinence Therapy',
];

const REGION_OPTIONS = ['North', 'South', 'East', 'West', 'Central'];

const SpecialistSignUp: React.FC = () => {
  const [formData, setFormData] = useState<SpecialistFormData>({
    specialistName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    medicalRegistrationNo: '',
    qualifications: '',
    fieldOfSpecialization: '',
    clinicAffiliation: '',
    address: '',
    postalCode: '',
    region: '',
    website: '',
    yearsOfExperience: '',
    specialties: [],
    otherSpecialties: [''], // start with one empty input
    languages: '',
    operatingHours: { weekdays: '', saturday: '', sunday: '', publicHoliday: '' },
    insurancePartners: '',
    notes: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SpecialistFormData | 'form', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { if (showSuccess) window.scrollTo(0, 0); }, [showSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox' && name === 'agreedToTerms') {
      setFormData(prev => ({ ...prev, agreedToTerms: checked }));
      return;
    }
    if (name?.startsWith('operatingHours.')) {
      const key = name.split('.')[1] as keyof SpecialistFormData['operatingHours'];
      setFormData(prev => ({ ...prev, operatingHours: { ...prev.operatingHours, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value } as SpecialistFormData));
    }
    if (errors[name as keyof SpecialistFormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
    if (errors.specialties) setErrors(prev => ({ ...prev, specialties: undefined }));
  };

  // Free‑form “Other specialties” helpers
  const updateOtherSpecialty = (idx: number, val: string) => {
    setFormData(prev => {
      const next = [...prev.otherSpecialties];
      next[idx] = val;

      // Auto-add one empty input if last becomes non-empty
      const last = next[next.length - 1];
      if (last.trim().length > 0 && next.every(s => s.trim().length > 0)) next.push('');

      // Keep at most one trailing empty
      while (next.length > 1 && next[next.length - 1] === '' && next[next.length - 2] === '') next.pop();

      return { ...prev, otherSpecialties: next };
    });
    if (errors.specialties) setErrors(prev => ({ ...prev, specialties: undefined }));
  };
  const addOtherSpecialty = () => setFormData(prev => ({ ...prev, otherSpecialties: [...prev.otherSpecialties, ''] }));
  const removeOtherSpecialty = (idx: number) =>
    setFormData(prev => {
      const next = [...prev.otherSpecialties];
      next.splice(idx, 1);
      if (next.length === 0) next.push('');
      return { ...prev, otherSpecialties: next };
    });

  // Password strength meter
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return { score, label: labels[score] || 'Very Weak', color: colors[Math.max(0, score - 1)] || 'bg-red-500' };
  };
  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = (): boolean => {
    const e: Partial<Record<keyof SpecialistFormData, string>> = {};
    if (!formData.specialistName.trim()) e.specialistName = 'Full name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!authUtils.isValidEmail(formData.email)) e.email = 'Please enter a valid email address';

    const pwVal = authUtils.validatePassword(formData.password);
    if (!formData.password) e.password = 'Password is required';
    else if (!pwVal.isValid) e.password = pwVal.message;

    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';

    if (!formData.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    if (!formData.medicalRegistrationNo.trim()) e.medicalRegistrationNo = 'Medical registration number is required';
    if (!formData.qualifications.trim()) e.qualifications = 'Professional qualifications are required';
    if (!formData.fieldOfSpecialization.trim()) e.fieldOfSpecialization = 'Field of specialization is required';
    if (!formData.clinicAffiliation.trim()) e.clinicAffiliation = 'Primary clinic affiliation is required';
    if (!formData.address.trim()) e.address = 'Practice address is required';
    if (!formData.postalCode.trim()) e.postalCode = 'Postal code is required';
    if (!formData.region) e.region = 'Region is required';
    if (!formData.yearsOfExperience.trim() || Number(formData.yearsOfExperience) < 0) e.yearsOfExperience = 'Valid years of experience is required';

    const hasCustom = formData.otherSpecialties.some(s => s.trim().length > 0);
    if (formData.specialties.length === 0 && !hasCustom) e.specialties = 'Please select or add at least one specialty';

    if (!formData.languages.trim()) e.languages = 'Languages spoken are required';
    if (!formData.agreedToTerms) e.agreedToTerms = 'You must agree to the partnership terms';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Your wrapper’s 3‑arg signature: (email, password, options)
      const { data } = await authApi.signUp(formData.email, formData.password, {
        data: {
          full_name: formData.specialistName.trim(),
          user_type: 'specialist',
        },
        emailRedirectTo: 'https://www.colonaive.ai/login?verified=true',
      });

      if (!data?.user) throw new Error('User account creation failed in Supabase Auth.');

      const mergedSpecialties = [
        ...formData.specialties,
        ...formData.otherSpecialties.map(s => s.trim()).filter(Boolean),
      ];

      const { error: rpcError } = await supabase.rpc('create_full_specialist_account', {
        p_user_id: data.user.id,
        p_user_email: formData.email.trim().toLowerCase(),
        p_full_name: formData.specialistName.trim(),
        p_phone_number: formData.phoneNumber.trim(),
        p_medical_registration_no: formData.medicalRegistrationNo.trim(),
        p_qualifications: formData.qualifications.trim(),
        p_field_of_specialization: formData.fieldOfSpecialization.trim(),
        p_clinic_affiliation: formData.clinicAffiliation.trim(),
        p_address: formData.address.trim(),
        p_postal_code: formData.postalCode.trim(),
        p_region: formData.region,
        p_years_of_experience: Number(formData.yearsOfExperience),
        p_specialties: mergedSpecialties,
        p_languages: formData.languages.trim(),
        p_website: formData.website.trim() || null,
        p_operating_hours: formData.operatingHours,
        p_insurance_partners: formData.insurancePartners.trim() || null,
        p_notes: formData.notes.trim() || null,
      });
      if (rpcError) throw rpcError;

      authToast.signUpSuccess('Registration submitted! Please check your email to verify your account.');
      setShowSuccess(true);
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred during specialist signup.';
      setErrors({ form: msg });
      authToast.signUpError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-xl mx-auto shadow-2xl w-full">
          <CardContent className="p-8 md:p-12 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Submitted!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for applying to join COLONAiVE™ as a Specialist Partner.
            </p>

            <div className="bg-yellow-50 p-6 rounded-lg my-8 text-left shadow-inner border border-yellow-200">
              <p className="text-yellow-800 font-semibold text-lg mb-2 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-yellow-700" /> Step 1: Verify Your Email
              </p>
              <p className="text-yellow-700 text-sm">
                A confirmation link has been sent to <span className="font-semibold">{formData.email}</span>.
                Please click this link to verify your email address and activate your account.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg my-8 text-left shadow-inner border border-blue-200">
              <p className="text-blue-800 font-semibold text-lg mb-2 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-700" /> Step 2: Application Review
              </p>
              <p className="text-blue-700 text-sm">
                Our team will review your application. You will be notified once the review process is complete.
                After approval and email verification, you will be able to log in to your Specialist Dashboard.
              </p>
            </div>

            <Link to="/">
              <Button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                <Home className="h-5 w-5" />
                Return to Homepage
              </Button>
            </Link>

            <p className="text-xs text-gray-500 mt-8">
              If you don't receive the email within a few minutes, please check your spam or junk folder.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Register as a Specialist Partner</h1>
            <p className="text-xl">Join our network of trusted specialists in the fight against colorectal cancer.</p>
          </div>
        </Container>
      </div>

      <Container className="px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-8">
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-800">{errors.form}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Professional & Account Information */}
              <div>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Professional & Account Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="specialistName"
                    name="specialistName"
                    label="Full Name"
                    value={formData.specialistName}
                    onChange={handleInputChange}
                    error={errors.specialistName}
                    required
                    autoComplete="name"
                    placeholder="Dr. Jane Doe"
                  />
                  <InputField
                    id="email"
                    name="email"
                    label="Email Address (for login)"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                    autoComplete="email"
                    placeholder="dr.jane.doe@clinic.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm ${
                          errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                          : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        }`}
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm ${
                          errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                 : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <InputField
                    id="medicalRegistrationNo"
                    name="medicalRegistrationNo"
                    label="Medical Registration No."
                    value={formData.medicalRegistrationNo}
                    onChange={handleInputChange}
                    error={errors.medicalRegistrationNo}
                    required
                    placeholder="SMC Registration Number"
                  />
                  <InputField
                    id="qualifications"
                    name="qualifications"
                    label="Qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    error={errors.qualifications}
                    required
                    placeholder="E.g., MBBS, MRCP, FRCS"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <InputField
                    id="fieldOfSpecialization"
                    name="fieldOfSpecialization"
                    label="Field of Specialization"
                    value={formData.fieldOfSpecialization}
                    onChange={handleInputChange}
                    error={errors.fieldOfSpecialization}
                    required
                    placeholder="e.g., Gastroenterology, Oncology"
                  />
                  <InputField
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    label="Years of Experience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    error={errors.yearsOfExperience}
                    required
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Practice Information */}
              <div>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Practice Information</h2>
                </div>

                <InputField
                  id="clinicAffiliation"
                  name="clinicAffiliation"
                  label="Clinic / Hospital Name"
                  value={formData.clinicAffiliation}
                  onChange={handleInputChange}
                  error={errors.clinicAffiliation}
                  required
                  placeholder="e.g., Singapore General Hospital"
                />

                <div className="mt-6">
                  <InputField
                    id="address"
                    name="address"
                    label="Practice Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                    required
                    placeholder="123 Main Street, #01-01, Singapore"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <InputField
                    id="postalCode"
                    name="postalCode"
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    error={errors.postalCode}
                    required
                    placeholder="123456"
                    maxLength={6}
                  />

                  <div className="mb-4">
                    <label htmlFor="region" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-sky-700/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-sky-900/20 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select region</option>
                      {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.region && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.region}</p>}
                  </div>

                  <InputField
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    error={errors.phoneNumber}
                    required
                    autoComplete="tel"
                    placeholder="+65 9123 4567"
                  />
                </div>

                <div className="mt-6">
                  <InputField
                    id="website"
                    name="website"
                    label="Website (Optional)"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    error={errors.website}
                    placeholder="https://www.drjane.com"
                  />
                </div>
              </div>

              {/* Areas of Expertise */}
              <div>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                  <Stethoscope className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Areas of Expertise</h2>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Specialties <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIALTIES.map((specialty) => (
                    <label
                      key={specialty}
                      className={`relative flex items-center cursor-pointer rounded-lg border p-3 transition-colors duration-150 ease-in-out shadow-sm ${
                        formData.specialties.includes(specialty)
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                      />
                      <span className="text-sm text-gray-700 peer-checked:font-semibold peer-checked:text-purple-700">
                        {specialty}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Other specialties (free-form) */}
                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other specialties / procedures (optional)
                  </label>

                  <div className="space-y-3">
                    {formData.otherSpecialties.map((val, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => updateOtherSpecialty(idx, e.target.value)}
                          placeholder="e.g., HIPEC, ERAS protocols, advanced imaging, etc."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-sky-900/20"
                        />
                        {formData.otherSpecialties.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOtherSpecialty(idx)}
                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                            aria-label="Remove"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                        {idx === formData.otherSpecialties.length - 1 && (
                          <button
                            type="button"
                            onClick={addOtherSpecialty}
                            className="inline-flex items-center gap-1 text-sm text-purple-700 hover:text-purple-900"
                          >
                            <PlusCircle className="h-5 w-5" /> Add another
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.specialties && <p className="text-sm text-red-600 mt-2">{errors.specialties}</p>}
                </div>
              </div>

              {/* Operating Hours & Additional Info */}
              <div>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Operating Hours & Additional Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField id="operatingHours.weekdays" name="operatingHours.weekdays" label="Weekdays Operating Hours" value={formData.operatingHours.weekdays} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 5:00 PM" />
                  <InputField id="operatingHours.saturday" name="operatingHours.saturday" label="Saturday Operating Hours" value={formData.operatingHours.saturday} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 1:00 PM / Closed" />
                  <InputField id="operatingHours.sunday" name="operatingHours.sunday" label="Sunday Operating Hours" value={formData.operatingHours.sunday} onChange={handleInputChange} placeholder="e.g., Closed" />
                  <InputField id="operatingHours.publicHoliday" name="operatingHours.publicHoliday" label="Public Holiday Operating Hours" value={formData.operatingHours.publicHoliday} onChange={handleInputChange} placeholder="e.g., Closed / Special Hours" />
                </div>

                <div className="mt-6">
                  <InputField id="languages" name="languages" label="Languages Spoken" value={formData.languages} onChange={handleInputChange} placeholder="E.g., English, Mandarin, Malay" required error={errors.languages} />
                </div>

                <div className="mt-6">
                  <InputField id="insurancePartners" name="insurancePartners" label="Insurance Partners (Optional)" value={formData.insurancePartners} onChange={handleInputChange} placeholder="List major insurance panels you're on" />
                </div>

                <div className="mt-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Additional Notes <span className="text-gray-500">(Optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-sky-900/20"
                    placeholder="Share any other relevant details..."
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-start">
                  <input
                    id="agreedToTerms"
                    name="agreedToTerms"
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1 shadow-sm"
                  />
                  <label htmlFor="agreedToTerms" className="ml-3 block text-sm text-gray-900">
                    I agree to the <a href="/terms-of-use" className="font-medium text-purple-600 hover:underline">Specialist Partnership Terms</a> and <a href="/privacy-policy" className="font-medium text-purple-600 hover:underline">Privacy Policy</a>.
                    <span className="text-red-500"> *</span>
                  </label>
                </div>
                {errors.agreedToTerms && <p className="text-red-500 text-sm mt-1 ml-7">{errors.agreedToTerms}</p>}
              </div>

              {/* Submit */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Registering Specialist Account...
                    </div>
                  ) : 'Register as Specialist Partner'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already registered?{' '}
                <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">Sign in here</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SpecialistSignUp;
