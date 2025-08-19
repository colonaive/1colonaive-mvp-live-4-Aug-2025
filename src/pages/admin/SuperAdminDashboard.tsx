// /src/pages/admin/SuperAdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Users, Calendar, FileText, Database, Settings,
  BarChart3, Shield, Activity, Download, RefreshCw, Search, Filter, Eye, Stethoscope
} from 'lucide-react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  activeChampions: number;
  totalSpecialists: number;
  totalClinics: number;
  recentActivity: any[];
}

interface Specialist {
  id: string;
  full_name: string;
  email: string;
  clinic_affiliation: string;
  address: string;
  specialties: string[];
  is_approved: boolean;
  created_at: string;
}

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'specialists' | 'content' | 'events' | 'system' | 'settings'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    activeChampions: 0,
    totalSpecialists: 0,
    totalClinics: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [specialistsLoading, setSpecialistsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchSpecialists = async () => {
    try {
      setSpecialistsLoading(true);
      const { data, error } = await supabase
        .from('specialists')
        .select(`
          id,
          clinic_affiliation,
          address,
          specialties,
          is_approved,
          created_at,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted: Specialist[] = (data || []).map((item: any) => ({
        id: item.id,
        full_name: item.profiles?.full_name || 'N/A',
        email: item.profiles?.email || 'N/A',
        clinic_affiliation: item.clinic_affiliation,
        address: item.address,
        specialties: item.specialties || [],
        is_approved: !!item.is_approved,
        created_at: item.created_at,
      }));

      setSpecialists(formatted);
    } catch (err) {
      console.error('Error fetching specialists:', err);
    } finally {
      setSpecialistsLoading(false);
    }
  };

  const toggleSpecialistApproval = async (specialistId: string, currentApproval: boolean) => {
    try {
      const { error } = await supabase
        .from('specialists')
        .update({ is_approved: !currentApproval })
        .eq('id', specialistId);

      if (error) throw error;
      await fetchSpecialists();
    } catch (err) {
      console.error('Error updating specialist approval:', err);
      alert('Failed to update specialist approval status');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [
        usersResult,
        eventsResult,
        championsResult,
        specialistsResult,
        clinicsResult,
        activityResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('user_type', 'champion'),
        supabase.from('specialists').select('id', { count: 'exact', head: true }),
        supabase.from('GPClinics').select('id', { count: 'exact', head: true }),
        supabase
          .from('admin_activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalEvents: eventsResult.count || 0,
        activeChampions: championsResult.count || 0,
        totalSpecialists: specialistsResult.count || 0,
        totalClinics: clinicsResult.count || 0,
        recentActivity: activityResult.data || []
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'users', label: 'User Management', icon: <Users className="h-4 w-4" /> },
    { id: 'specialists', label: 'Project Partners', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'content', label: 'Content Management', icon: <FileText className="h-4 w-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    { id: 'system', label: 'System Monitoring', icon: <Database className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ] as const;

  const StatCard = ({ title, value, icon, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && <p className="text-sm text-green-600">+{trend}% from last month</p>}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={<Users className="h-6 w-6 text-blue-600" />} trend={12} />
        <StatCard title="Active Champions" value={stats.activeChampions.toLocaleString()} icon={<Shield className="h-6 w-6 text-green-600" />} trend={8} />
        <StatCard title="Total Events" value={stats.totalEvents.toLocaleString()} icon={<Calendar className="h-6 w-6 text-purple-600" />} trend={15} />
        <StatCard title="System Health" value="98.5%" icon={<Activity className="h-6 w-6 text-emerald-600" />} trend={2} />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Admin Activity</h3>
            <Button size="sm" variant="outline" onClick={fetchDashboardStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{new Date(activity.created_at).toLocaleString()}</p>
                  </div>
                  <span className="text-sm text-blue-600">Admin</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const UserManagementTab = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">User Management</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">User Management Interface</h4>
          <p className="text-gray-600">
            Advanced user management features will be displayed here, including user roles, permissions, and account status.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const ContentManagementTab = () => (
    <Card>
      <CardContent className="p-6">
        {/* >>> Quick actions row with CSR link <<< */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Content Management</h3>
          <div className="flex items-center gap-3">
            {/* Opens the CSR partners admin page */}
            <a href="/admin/csr-partners">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Manage CSR Partners
              </Button>
            </a>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Content Management System</h4>
          <p className="text-gray-600">Manage stories, educational content, and approve user submissions.</p>
        </div>
      </CardContent>
    </Card>
  );

  const EventsTab = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Events Management</h3>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Events Dashboard</h4>
          <p className="text-gray-600">Create, manage, and monitor all COLONAiVE events and webinars.</p>
        </div>
      </CardContent>
    </Card>
  );

  const SystemMonitoringTab = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">System Monitoring</h3>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">System Health Monitor</h4>
          <p className="text-gray-600">Monitor system performance, database status, and security logs.</p>
        </div>
      </CardContent>
    </Card>
  );

  const SpecialistsTab = () => {
    useEffect(() => {
      if (activeTab === 'specialists' && specialists.length === 0) {
        fetchSpecialists();
      }
    }, [activeTab]);

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Project Partner Management</h3>
            <div className="flex items-center gap-3">
              {/* Admin-curated specialist entry form */}
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => navigate('/admin/partner-specialists/new')}
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Add Partner Specialist
              </Button>

              {/* View public directory */}
              <a href="/find-a-specialist" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Directory
                </Button>
              </a>

              {/* Refresh */}
              <Button size="sm" variant="outline" onClick={fetchSpecialists}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {specialistsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading specialists...</p>
            </div>
          ) : specialists.length > 0 ? (
            <div className="space-y-4">
              {specialists.map((specialist) => (
                <div key={specialist.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{specialist.full_name}</h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            specialist.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {specialist.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{specialist.email}</p>
                      <p className="text-sm text-gray-600 mb-1">{specialist.clinic_affiliation}</p>
                      <p className="text-sm text-gray-600 mb-2">{specialist.address}</p>
                      {specialist.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {specialist.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Applied: {new Date(specialist.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {specialist.is_approved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => toggleSpecialistApproval(specialist.id, true)}
                        >
                          Remove Approval
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => toggleSpecialistApproval(specialist.id, false)}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Specialist Applications</h4>
              <p className="text-gray-600">No specialist applications have been submitted yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const SettingsTab = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">System Settings</h3>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Administration Settings</h4>
          <p className="text-gray-600">Configure system settings, security parameters, and administrative preferences.</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UserManagementTab />;
      case 'specialists':
        return <SpecialistsTab />;
      case 'content':
        return <ContentManagementTab />;
      case 'events':
        return <EventsTab />;
      case 'system':
        return <SystemMonitoringTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">COLONAiVE™ Admin</h1>
                <p className="text-sm text-gray-500">Super Administrator Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderTabContent()}</div>
    </div>
  );
};

export default SuperAdminDashboard;
