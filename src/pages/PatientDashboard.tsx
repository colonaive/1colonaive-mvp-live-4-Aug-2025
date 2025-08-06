import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Bell, 
  Stethoscope, 
  ClipboardCheck, 
  SearchCheck, 
  CalendarDays,
  FileText,
  AlertCircle,
  ArrowRight,
  Activity,
  Target
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Container className="py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My CRC-Safe Dashboard</h1>
            <p className="text-gray-600">Track your screening journey and stay informed</p>
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </div>
        </div>

        {/* Screening Status Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-2">Your Screening Status</h2>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Up to date with screening recommendations</span>
                </div>
                <Link to="/get-screened">
                  <Button variant="primary" className="group">
                    View Screening Timeline
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {action.icon}
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Upcoming Screenings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Upcoming Screenings</h2>
              </div>
              {upcomingScreenings.map((screening, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{screening.type}</p>
                    <p className="text-sm text-gray-600">{screening.date}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {screening.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Latest Results</h2>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No test results available yet</p>
                <Button variant="outline">Schedule a Screening</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tips */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Health Tip</h3>
                <p className="text-gray-700 mb-4">
                  Regular screening is key to early detection. Consider discussing your screening options 
                  with your healthcare provider at your next visit.
                </p>
                <Link to="/education/patients">
                  <Button variant="outline" className="group">
                    Learn More About Prevention
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

const quickActions = [
  {
    icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
    title: "Find a GP",
    description: "Search for clinics offering blood-based CRC screening",
    link: "/find-gp"
  },
  {
    icon: <SearchCheck className="h-6 w-6 text-teal-600" />,
    title: "View Test Results",
    description: "Check your latest screening results and recommendations",
    link: "/results"
  },
  {
    icon: <ClipboardCheck className="h-6 w-6 text-purple-600" />,
    title: "Understand CRC",
    description: "Learn about symptoms, risk factors, and prevention",
    link: "/education/patients"
  }
];

const upcomingScreenings = [
  {
    type: "ColonAiQ® Blood Test",
    date: "Due in 3 months",
    status: "Upcoming",
    action: "Schedule Now"
  }
];

export default PatientDashboard;