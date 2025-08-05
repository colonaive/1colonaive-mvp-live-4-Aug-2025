import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { supabase } from '@/supabase';
import { Card, CardContent } from '@/components/ui/Card';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import ClinicSchemaService from '@/services/clinicSchemaService';

// Define the GP interface to match the combined data from GPClinics and Profiles
interface GP {
  id: string;
  clinic_name: string;
  doctor_full_name: string | null; // From profiles.full_name
  phone_number: string | null; // From profiles.phone_number
  address: string | null;
  postal_code: string | null;
  region: string | null;
  languages_spoken: string | null; // This will need to be parsed if it's a comma-separated string
  website: string | null;
  description: string | null;
  services_offered: string[] | null;
  operating_hours: any | null; // Adjust type if you have a specific structure for operating hours
}

const FindGPPage: React.FC = () => {
  const location = useLocation();
  const [gps, setGPs] = useState<GP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    const fetchGPs = async () => {
      setLoading(true);
      // Select all columns from GPClinics and nest the profiles data
      const { data, error } = await supabase
        .from('gpclinics')
        .select(`
          id,
          clinic_name,
          address,
          postal_code,
          region,
          languages_spoken,
          website,
          description,
          services_offered,
          operating_hours,
          profiles (
            full_name,
            phone_number
          )
        `);

      if (error) {
        console.error('Error fetching GPs:', error);
      } else if (data) {
        const formattedData: GP[] = data.map((item: any) => ({
          id: item.id,
          clinic_name: item.clinic_name,
          doctor_full_name: item.profiles?.full_name || null,
          phone_number: item.profiles?.phone_number || null, // Assuming phone number is in profiles
          address: item.address,
          postal_code: item.postal_code,
          region: item.region,
          languages_spoken: item.languages_spoken, // Assuming this is a comma-separated string
          website: item.website,
          description: item.description,
          services_offered: item.services_offered,
          operating_hours: item.operating_hours,
        }));
        setGPs(formattedData);
      }
      setLoading(false);
    };

    fetchGPs();
  }, []); // Run once on mount

  // Memoized lists for filters
  const allRegions = useMemo(() =>
    Array.from(new Set(gps.map(gp => gp.region))).filter(Boolean).sort() as string[]
  , [gps]);

  const allLanguages = useMemo(() =>
    Array.from(new Set(gps.flatMap(gp => gp.languages_spoken ? gp.languages_spoken.split(',').map(lang => lang.trim()) : []))).filter(Boolean).sort() as string[]
  , [gps]);

  const filteredGPs = useMemo(() => {
    return gps.filter(gp => {
      const matchesSearch =
        searchTerm === '' ||
        gp.doctor_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gp.clinic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gp.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gp.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion =
        selectedRegion === '' ||
        gp.region === selectedRegion;

      const matchesLanguage =
        selectedLanguage === '' ||
        (gp.languages_spoken && gp.languages_spoken.split(',').map(lang => lang.trim()).includes(selectedLanguage));

      return matchesSearch && matchesRegion && matchesLanguage;
    });
  }, [gps, searchTerm, selectedRegion, selectedLanguage]);

  // Generate schema markup for clinic directory
  const schemas = [
    ClinicSchemaService.generateMedicalDirectorySchema(),
    ClinicSchemaService.generateHealthcareNetworkSchema(),
    ClinicSchemaService.generateClinicFAQSchema()
  ];

  return (
    <div className="pt-20">
      {/* SEO and Schema Markup */}
      <Helmet>
        <title>Find GP Clinics for Colorectal Cancer Screening | Singapore</title>
        <meta name="description" content="Find trusted GP clinics and specialists for colorectal cancer screening in Singapore. Book appointments for ColonAiQ® blood tests, FIT tests, and colonoscopy services." />
        <meta name="keywords" content="GP clinic Singapore, colorectal cancer screening, ColonAiQ blood test, colonoscopy Singapore, find doctor" />
        <link rel="canonical" href="https://colonaive.com/find-a-gp" />
      </Helmet>
      
      <SchemaMarkup schemas={schemas} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <Link to="/triage" className="inline-flex items-center text-white/80 hover:text-white text-sm mb-2">
                ← Back to Triage Assessment
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-6">Find a Trusted Family Doctor (GP)</h1>
            <p className="text-lg mt-4 text-white font-medium">
              Colorectal cancer is preventable. Your GP is your first line of defense.
            </p>
            <p className="text-xl mb-8">
              Connect with GPs who offer colorectal cancer screening and referral services.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search by doctor name, clinic, or location..."
                className="w-full py-4 px-5 pl-14 rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <section className="py-12 bg-slate-50">
        <Container>
          {/* Triage Banner */}
          {location.state?.fromTriage && (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-6 text-center font-medium">
              Based on your triage result, a GP consult is recommended. Choose a provider below.
            </div>
          )}
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">All Regions</option>
              {allRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">All Languages</option>
              {allLanguages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>

            {(selectedRegion || selectedLanguage || searchTerm) && (
              <Button
                variant="outline"
                className="px-4 py-3 rounded-lg shadow-sm hover:bg-gray-100"
                onClick={() => {
                  setSelectedRegion('');
                  setSelectedLanguage('');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Motivational Stats */}
          <p className="text-center text-gray-700 mb-2 text-sm">
            Early detection saves lives. Trusted GPs can help you get started.
          </p>
          
          {/* Results Count */}
          <p className="text-gray-600 mb-6 text-center">
            {loading ? "Loading..." : `Found ${filteredGPs.length} clinic${filteredGPs.length !== 1 ? 's' : ''}`}
          </p>

          {/* GP List */}
          {loading ? (
            <p className="text-center text-gray-600">Loading GP clinics...</p>
          ) : filteredGPs.length > 0 ? (
            <div className="grid gap-6">
              {filteredGPs.map((gp) => (
                <Card key={gp.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{gp.doctor_full_name}</h2>
                        <p className="text-gray-800 font-medium mb-2">{gp.clinic_name}</p>

                        <div className="flex items-start mb-2">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-600">{gp.address}</p>
                            {gp.postal_code && <p className="text-gray-500">Singapore {gp.postal_code}</p>}
                          </div>
                        </div>

                        {gp.phone_number && (
                          <div className="flex items-center mb-2">
                            <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                            <a href={`tel:${gp.phone_number}`} className="text-blue-600 hover:text-blue-800">
                              {gp.phone_number}
                            </a>
                          </div>
                        )}

                        {gp.website && (
                          <div className="flex items-center mb-4">
                            <Globe className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                            <a
                              href={gp.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                        {gp.description && <p className="text-gray-700 text-sm mt-3">{gp.description}</p>}
                      </div>

                      <div className="md:text-right flex flex-col items-start md:items-end">
                        {gp.languages_spoken && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500 mb-1">Languages</p>
                            <div className="flex flex-wrap gap-2 md:justify-end">
                              {gp.languages_spoken.split(',').map((language, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                                  {language.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {gp.services_offered && gp.services_offered.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500 mb-1">Services</p>
                            <div className="flex flex-wrap gap-2 md:justify-end">
                              {gp.services_offered.map((service, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <Button disabled className="w-full md:w-auto mt-auto">
                          Appointment Booking Coming Soon
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No clinics found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRegion('');
                  setSelectedLanguage('');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default FindGPPage;
