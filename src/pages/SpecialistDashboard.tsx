// /home/project/src/pages/SpecialistDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent, CardHeader } from '../components/ui/Card'; 
import { Button } from '../components/ui/Button';
import { 
  Briefcase, // MODIFIED: Changed from BriefcaseMedical to Briefcase
  Users, 
  CalendarDays, 
  UserCog, 
  FileText, 
  ShieldCheck, 
  MessageSquareQuote, 
  Bell, 
  ChevronRight,
  LogOut,
  Settings,
  Mail,
  Phone,
  Clock,
  MapPin,
  ListOrdered,
  Activity,
  Award,
  BookOpenCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

interface SpecialistFullProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  profile_phone_number: string | null;
  medical_registration_no: string | null;
  qualifications: string | null;
  field_of_specialization: string | null;
  clinic_affiliation: string | null;
  address: string | null;
  postal_code: string | null;
  region: string | null;
  website: string | null;
  years_of_experience: number | null;
  specialties: string[] | null;
  languages: string | null;
  operating_hours: { weekdays?: string; saturday?: string; sunday?: string; publicHoliday?: string; } | null;
  insurance_partners: string | null;
  notes: string | null;
}

const SpecialistDashboard: React.FC = () => {
  const { user, signOut, userType } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<SpecialistFullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    newReferrals: 0,
    upcomingAppointments: 0,
    patientsHelpedToday: 0,
    profileCompletion: 80, 
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("You must be logged in to view this page.");
      navigate('/login');
      return;
    }
    if (userType && userType !== 'specialist') {
      setError("Access denied. This dashboard is for specialists only.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("Profile not found.");

        const { data: specialistData, error: specialistError } = await supabase
          .from('specialists')
          .select('*')
          .eq('id', user.id)
          .single();

        if (specialistError) throw specialistError;
        if (!specialistData) throw new Error("Specialist-specific details not found.");
        
        setData({
          id: profileData.id,
          full_name: profileData.full_name,
          email: profileData.email,
          profile_phone_number: profileData.phone_number,
          ...specialistData 
        });

      } catch (err: any) {
        console.error("Specialist Dashboard error:", err);
        setError(err.message || "An unexpected error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (user && userType === 'specialist') {
        fetchDashboardData();
    }
  }, [user, userType, navigate]);
  
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      alert(`Sign out failed: ${error.message}`);
    } else {
      navigate('/'); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-lg text-gray-700">
          <Activity className="h-10 w-10 animate-spin text-indigo-600" />
          <h2 className="font-semibold">Loading Specialist Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 pt-20 flex items-center justify-center p-4">
        <Card className="text-center max-w-lg mx-auto shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-red-700">Dashboard Access Error</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{error || "Could not load your specialist dashboard data. Please ensure your profile is complete or contact support."}</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getOperatingHoursDisplay = () => {
    if (!data.operating_hours) return "Not specified";
    const { weekdays, saturday, sunday, publicHoliday } = data.operating_hours;
    let display = [];
    if (weekdays) display.push(`Weekdays: ${weekdays}`);
    if (saturday) display.push(`Saturday: ${saturday}`);
    if (sunday) display.push(`Sunday: ${sunday}`);
    if (publicHoliday) display.push(`Public Holidays: ${publicHoliday}`);
    return display.length > 0 ? display.join(' | ') : "Not specified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-gray-100 pt-20">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          <div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full text-white">
                 {/* MODIFIED: Using Briefcase icon */}
                 <Briefcase className="h-8 w-8" /> 
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dr. {data.full_name || 'Specialist'}</h1>
                <div className="flex items-center">
                  <span className="text-md text-gray-600">Specialist Dashboard</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm font-medium px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                    {data.field_of_specialization || 'Specialist'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/profile')} className="group">
                <Settings className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform"/> Profile Settings
            </Button>
            <Button variant="ghost" onClick={handleSignOut} className="text-red-600 hover:bg-red-100 hover:text-red-700 group">
                <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform"/> Sign Out
            </Button>
            <Bell className="h-6 w-6 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="shadow-md hover:shadow-xl transition-shadow ease-in-out duration-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 font-medium">New Referrals</p>
                <p className="text-3xl font-bold text-indigo-800">{stats.newReferrals}</p>
              </div>
              <Mail className="h-10 w-10 text-indigo-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition-shadow ease-in-out duration-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-purple-800">{stats.upcomingAppointments}</p>
              </div>
              <CalendarDays className="h-10 w-10 text-purple-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition-shadow ease-in-out duration-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Patients Triaged Today</p>
                <p className="text-3xl font-bold text-green-800">{stats.patientsHelpedToday}</p>
              </div>
              <Users className="h-10 w-10 text-green-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition-shadow ease-in-out duration-300">
            <CardContent className="p-5">
              <p className="text-sm text-gray-600 font-medium mb-1">Profile Readiness</p>
               <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${stats.profileCompletion}%`}}></div>
              </div>
              <p className="text-xs text-blue-700 mt-1 text-right">{stats.profileCompletion}% complete</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><ListOrdered className="h-6 w-6 text-indigo-600"/>Incoming Patient Referrals</h3>
                <p className="text-sm text-gray-500">Review and manage new patient referrals assigned to you.</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                  <p>No new patient referrals at this time.</p>
                  <p className="text-sm">Referrals from GP clinics and the platform will appear here.</p>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button variant="outline">View All Referrals</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><CalendarDays className="h-6 w-6 text-purple-600"/>My Availability & Schedule</h3>
                <p className="text-sm text-gray-500">Manage your consultation hours and view your appointment calendar.</p>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-purple-50 rounded-lg mb-4">
                    <h3 className="font-medium text-purple-800 mb-1 flex items-center gap-2"><Clock className="h-5 w-5"/>Current Operating Hours</h3>
                    <p className="text-sm text-purple-700">{getOperatingHoursDisplay()}</p>
                </div>
                 <div className="text-center py-6 text-gray-500">
                  <p>Full schedule management coming soon.</p>
                </div>
                <div className="mt-4 flex gap-3">
                    <Button variant="default" className="bg-purple-600 hover:bg-purple-700">Update Availability</Button>
                    <Button variant="outline">View Full Calendar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700"><UserCog className="h-5 w-5 text-indigo-600"/>My Specialist Profile</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Reg. No:</strong> {data.medical_registration_no || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Qualifications:</strong> {data.qualifications || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Clinic:</strong> {data.clinic_affiliation || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Location:</strong> {data.address ? `${data.address}, Singapore ${data.postal_code}` : 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Languages:</strong> {data.languages || 'N/A'}</p>
                <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate('/profile/specialist')}>Edit Full Profile Details</Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700"><BookOpenCheck className="h-5 w-5 text-green-600"/>Clinical Resources</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/education/clinicians" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg group">
                    <span className="text-sm">COLONAiVE™ Clinical Guidelines</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600"/>
                </Link>
                <Link to="/education/clinicians/guidelines" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg group">
                    <span className="text-sm">Referral Protocols</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600"/>
                </Link>
                 <Link to="/education/newsroom/research-updates" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg group">
                    <span className="text-sm">Latest Research Updates</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600"/>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <Award className="h-7 w-7"/>
                    <h2 className="text-xl font-semibold">Join the Movement</h2>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  Your expertise is vital in our mission to reduce colorectal cancer mortality. 
                  Help us by sharing your insights and participating in upcoming initiatives.
                </p>
                <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">Learn More & Contribute</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SpecialistDashboard;