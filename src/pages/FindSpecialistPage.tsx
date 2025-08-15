// /home/project/src/pages/FindSpecialistPage.tsx

import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Phone, Globe } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/supabase';

// Define the Specialist interface to match the combined data from the database query
interface Specialist {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  clinic_affiliation: string | null;
  address: string | null;
  website: string | null;
  specialties: string[] | null;
  field_of_specialization: string | null;
}

// RESTORED: Helper component for the custom-styled ordered list from your original design
const CustomListItem = ({ number, children }: { number: number; children: React.ReactNode }) => (
  <li className="flex items-start">
    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full font-bold text-sm mr-4 mt-1">
      {number}
    </div>
    <span className="text-gray-700">{children}</span>
  </li>
);

const FindSpecialistPage: React.FC = () => {
  // CORRECT: State management for data, loading, and filters
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // CORRECT: useEffect hook to fetch and join data from Supabase on component mount
  useEffect(() => {
    const fetchSpecialists = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('specialists')
        .select(`
          id,
          clinic_affiliation,
          address,
          website,
          specialties,
          field_of_specialization,
          profiles (
            full_name,
            phone_number
          )
        `)
        .eq('is_approved', true);

      if (error) {
        console.error('Error fetching specialists:', error);
      } else if (data) {
        const formattedData: Specialist[] = data.map((item: any) => ({
          id: item.id,
          full_name: item.profiles?.full_name || 'N/A',
          phone_number: item.profiles?.phone_number || null,
          clinic_affiliation: item.clinic_affiliation,
          address: item.address,
          website: item.website,
          specialties: item.specialties,
          field_of_specialization: item.field_of_specialization,
        }));
        setSpecialists(formattedData);
      }
      setLoading(false);
    };

    fetchSpecialists();
  }, []);

  // CORRECT: Memoized derived state for performance
  const allSpecialties = useMemo(() => Array.from(new Set(specialists.flatMap((s) => s.specialties || []))).sort(), [specialists]);
  const filteredSpecialists = useMemo(() => {
    return specialists.filter((specialist) => {
      const nameOrClinic = `${specialist.full_name || ''} ${specialist.clinic_affiliation || ''}`.toLowerCase();
      const matchesSearch = searchTerm === '' || nameOrClinic.includes(searchTerm.toLowerCase()) || specialist.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === null || (specialist.specialties?.includes(selectedSpecialty) ?? false);
      return matchesSearch && matchesSpecialty;
    });
  }, [specialists, searchTerm, selectedSpecialty]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4">
              <Link to="/triage" className="inline-flex items-center text-white/80 hover:text-white text-sm mb-2">
                ← Back to Triage Assessment
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-4">Find a COLONAiVE Project Partner Specialist</h1>
            <p className="text-xl mb-8">For all your colonoscopy and advanced colorectal cancer screening and Early CRC Treatment needs.</p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search by clinic, partner specialist, or location..."
                className="w-full py-4 px-5 pl-14 rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </Container>
      </div>

      {/* Info Section */}
      <section className="py-8 bg-blue-50 border-b border-blue-100">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-blue-100 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🏆 Approved Project Partners</h3>
              <p className="text-blue-700">
                Our Project Partners committed to our mission of early detection and treatment of colorectal cancer.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-slate-50">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filter Sidebar */}
            <aside className="lg:w-1/4">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-4 px-2">Filter By Specialty</h3>
                <div className="space-y-2">
                  <button onClick={() => setSelectedSpecialty(null)} className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${selectedSpecialty === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    All Specialties
                  </button>
                  {allSpecialties.map((specialty) => (
                    <button key={specialty} onClick={() => setSelectedSpecialty(specialty)} className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${selectedSpecialty === specialty ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Specialist Listings */}
            <main className="lg:w-3/4">
              <div className="flex justify-between items-baseline mb-6">
                <h2 className="text-2xl font-bold">{filteredSpecialists.length} {filteredSpecialists.length === 1 ? 'Partner Clinic' : 'Partner Clinics'} Found</h2>
              </div>

              {loading ? (
                <p className="text-gray-600">Loading partner clinics...</p>
              ) : filteredSpecialists.length > 0 ? (
                <div className="space-y-6">
                  {filteredSpecialists.map((specialist) => (
                    <Card key={specialist.id} className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <h3 className="text-xl font-bold text-gray-800">{specialist.clinic_affiliation}</h3>
                                <p className="text-md font-semibold text-blue-700 mb-3">{specialist.full_name}</p>
                                <div className="space-y-2 mb-4 text-gray-600">
                                <div className="flex items-center"><MapPin className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" />{specialist.address}</div>
                                {specialist.phone_number && <div className="flex items-center"><Phone className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" />{specialist.phone_number}</div>}
                                {specialist.website && <div className="flex items-center"><Globe className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" /><a href={specialist.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit Website</a></div>}
                                </div>
                                {specialist.specialties && specialist.specialties.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Treatments & Specialties:</h4>
                                    <div className="flex flex-wrap gap-2">
                                    {specialist.specialties.map((spec, index) => (<span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{spec}</span>))}
                                    </div>
                                </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center items-start md:items-end space-y-3">
                                <Button className="w-full md:w-auto">Make Appointment</Button>
                                <Button variant="outline" className="w-full md:w-auto">Learn More</Button>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card><CardContent className="p-8 text-center text-gray-600">No partner clinics match your current search criteria. Please try a different search term or filter.</CardContent></Card>
              )}
            </main>
          </div>
        </Container>
      </section>

      {/* RESTORED: The "Preparing for Your Visit" section with the original beautiful design */}
      <section className="py-20 bg-blue-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Preparing for Your Visit</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Knowing what to expect can help make your screening experience smoother.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-800">Before Your Appointment</h3>
              <ol className="space-y-4">
                <CustomListItem number={1}>Check with your insurance provider about coverage.</CustomListItem>
                <CustomListItem number={2}>Bring your medical history and any previous screening results.</CustomListItem>
                <CustomListItem number={3}>Prepare a list of questions you may have.</CustomListItem>
                <CustomListItem number={4}>Follow any preparation instructions provided by the clinic.</CustomListItem>
              </ol>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-800">Questions to Ask</h3>
              <ol className="space-y-4">
                <CustomListItem number={1}>Which screening test is right for me and why?</CustomListItem>
                <CustomListItem number={2}>How do I prepare for the screening?</CustomListItem>
                <CustomListItem number={3}>What are the risks and benefits of this screening method?</CustomListItem>
                <CustomListItem number={4}>How will I receive my results and what happens next?</CustomListItem>
              </ol>
            </div>
          </div>
          <div className="mt-12 text-center bg-white p-8 rounded-lg max-w-3xl mx-auto border border-gray-200">
            <h3 className="font-bold text-xl mb-3 text-gray-800">Need Financial Assistance?</h3>
            <p className="text-gray-600 mb-6">Several programs exist to help cover the cost of colorectal cancer screening for those who qualify. Don't let financial concerns prevent you from getting screened.</p>
            <Button size="lg">Explore Financial Assistance Options</Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FindSpecialistPage;
