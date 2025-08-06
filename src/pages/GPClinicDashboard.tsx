// /home/project/src/pages/GPClinicDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent, CardHeader } // Removed CardTitle, CardDescription
from '../components/ui/Card'; 
import { Button } from '../components/ui/Button';
import { 
  Building, // Using generic Building, or Hospital if more appropriate
  Users, 
  CalendarCheck, 
  UserCog, 
  FileText, 
  ShieldCheck, 
  MessageSquareHeart, // Changed from Quote for a softer feel
  Bell, 
  ChevronRight,
  LogOut,
  Settings,
  Mail,
  Phone,
  Clock,
  MapPin,
  ListChecks, // More generic than ListOrdered
  Activity,
  ClipboardList, // For services
  Stethoscope // For doctor
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

interface GPClinicFullProfile {
  id: string;
  // From profiles
  contact_person_name: string | null; // Was full_name in profiles, maps to contactPersonName from form
  email: string | null;
  profile_phone_number: string | null; 

  // From "GPClinics" table
  clinic_name: string | null;
  doctor_full_name: string | null;
  license_number: string | null;
  address: string | null;
  postal_code: string | null;
  region: string | null;
  languages_spoken: string | null;
  website: string | null;
  description: string | null;
  services_offered: string[] | null;
  operating_hours: { weekdays?: string; saturday?: string; sunday?: string; publicHoliday?: string; } | null;
}

const GPClinicDashboard: React.FC = () => {
  const { user, signOut, userType } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<GPClinicFullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder stats
  const [stats, setStats] = useState({
    patientScreeningsToday: 0,
    upcomingFollowUps: 0,
    activePatientsInProgram: 0,
    profileCompletion: 75, 
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("You must be logged in to view this page.");
      navigate('/login');
      return;
    }
    if (userType && userType !== 'gpclinic') { // Check for 'gpclinic' role
      setError("Access denied. This dashboard is for GP Clinics only.");
      setLoading(false);
      // navigate(getDashboardRoute(userType)); // Or redirect to their correct dashboard
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number') // full_name here is contact_person_name
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("Admin profile not found for this clinic.");

        const { data: clinicData, error: clinicError } = await supabase
          .from('gpclinics') // Note: Case-sensitive if table was created with quotes
          .select('*') 
          .eq('id', user.id) // id in GPClinics is the FK to profiles.id (and auth.users.id)
          .single();

        if (clinicError) throw clinicError;
        if (!clinicData) throw new Error("GP Clinic details not found.");
        
        setData({
          id: profileData.id,
          contact_person_name: profileData.full_name, // Map profiles.full_name to contact_person_name
          email: profileData.email,
          profile_phone_number: profileData.phone_number,
          ...clinicData 
        });

      } catch (err: any) {
        console.error("GP Clinic Dashboard error:", err);
        setError(err.message || "An unexpected error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (user && userType === 'gpclinic') {
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-lg text-gray-700">
          <Activity className="h-10 w-10 animate-spin text-teal-600" />
          <h2 className="font-semibold">Loading GP Clinic Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 pt-20 flex items-center justify-center p-4">
        <Card className="text-center max-w-lg mx-auto shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-red-700">Dashboard Access Error</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{error || "Could not load your GP Clinic dashboard data."}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-gray-100 pt-20">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          <div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-tr from-teal-500 to-green-600 rounded-full text-white">
                 <Building className="h-8 w-8" /> 
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{data.clinic_name || 'GP Clinic'}</h1>
                <div className="flex items-center">
                  <span className="text-md text-gray-600">GP Clinic Dashboard</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm font-medium px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                    Partner Clinic
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/profile/gp-clinic')} className="group"> {/* Tentative path */}
                <Settings className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform"/> Clinic Settings
            </Button>
            <Button variant="ghost" onClick={handleSignOut} className="text-red-600 hover:bg-red-100 hover:text-red-700 group">
                <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform"/> Sign Out
            </Button>
            <Bell className="h-6 w-6 text-gray-400 cursor-pointer hover:text-teal-600 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-700 font-medium">Patient Screenings Today</p>
                <p className="text-3xl font-bold text-teal-800">{stats.patientScreeningsToday}</p>
              </div>
              <Stethoscope className="h-10 w-10 text-teal-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Upcoming Follow-ups</p>
                <p className="text-3xl font-bold text-green-800">{stats.upcomingFollowUps}</p>
              </div>
              <CalendarCheck className="h-10 w-10 text-green-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Active Patients in Program</p>
                <p className="text-3xl font-bold text-blue-800">{stats.activePatientsInProgram}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="p-5">
              <p className="text-sm text-gray-600 font-medium mb-1">Clinic Profile Setup</p>
               <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-teal-500 h-2.5 rounded-full" style={{width: `${stats.profileCompletion}%`}}></div>
              </div>
              <p className="text-xs text-teal-700 mt-1 text-right">{stats.profileCompletion}% complete</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><ClipboardList className="h-6 w-6 text-teal-600"/>Patient Screening & Referrals</h3>
                <p className="text-sm text-gray-500">Manage patients undergoing screening and referrals to specialists.</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                  <p>No active patient screenings or referrals at this moment.</p>
                  <p className="text-sm">Screening kits requested and patient referrals will appear here.</p>
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                    <Button variant="outline">View Screening Log</Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">New Patient Screening</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><MessageSquareHeart className="h-6 w-6 text-green-600"/>Patient Communication</h3>
                <p className="text-sm text-gray-500">Templates and tools for patient follow-up and education.</p>
              </CardHeader>
              <CardContent>
                 <div className="text-center py-6 text-gray-500">
                  <p>Communication tools coming soon.</p>
                </div>
                <div className="mt-4 flex gap-3">
                    <Button variant="outline">View Message Templates</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700"><UserCog className="h-5 w-5 text-teal-600"/>Clinic Profile</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Dr. In Charge:</strong> {data.doctor_full_name || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">License:</strong> {data.license_number || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Location:</strong> {data.address ? `${data.address}, ${data.region}, S(${data.postal_code})` : 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Services:</strong> {data.services_offered?.join(', ') || 'N/A'}</p>
                <Button className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white" onClick={() => navigate('/profile/gp-clinic')}>Edit Clinic Details</Button> {/* Tentative path */}
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700"><FileText className="h-5 w-5 text-green-600"/>COLONAiVE™ Resources</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/education/clinicians" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg group">
                    <span className="text-sm">Screening Guidelines</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600"/>
                </Link>
                <Link to="/education/resources" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg group">
                    <span className="text-sm">Patient Education Materials</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600"/>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default GPClinicDashboard;