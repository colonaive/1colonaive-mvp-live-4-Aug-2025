import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Newspaper,
  UserPlus,
  Briefcase,
  FileText,
  Settings,
  ArrowLeft,
} from 'lucide-react';

const quickActions = [
  { label: 'Manage News Feed', path: '/admin/news', icon: Newspaper, description: 'Review, approve and manage CRC news articles' },
  { label: 'Partner Specialists', path: '/admin/partner-specialists', icon: Users, description: 'View and manage partner specialist profiles' },
  { label: 'Add New Specialist', path: '/admin/partner-specialists/new', icon: UserPlus, description: 'Onboard a new partner specialist' },
  { label: 'CSR Partners', path: '/admin/csr-partners', icon: Briefcase, description: 'Manage corporate social responsibility partners' },
  { label: 'Add CSR Partner', path: '/admin/csr/new', icon: FileText, description: 'Register a new CSR partner organisation' },
  { label: 'CSR Showcase', path: '/csr-showcase', icon: LayoutDashboard, description: 'Preview the public CSR showcase page' },
];

const intelligenceLinks = [
  { label: 'CEO Cockpit', path: '/admin/ceo-cockpit', description: 'Strategic founder command centre' },
  { label: 'LinkedIn Intelligence', path: '/admin/linkedin-intelligence', description: 'LinkedIn engagement and outreach tracking' },
  { label: 'Relationship Intelligence', path: '/admin/relationship-intelligence', description: 'Key relationship status and follow-ups' },
  { label: 'CRC Radar', path: '/admin/crc-radar', description: 'Colorectal cancer research and market intelligence' },
  { label: 'Relationship Priority', path: '/admin/cockpit/relationships', description: 'Priority relationship action queue' },
];

export default function WorkRoom() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-7 h-7 text-[#004F8C]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Work Room</h1>
                <p className="text-sm text-gray-500 mt-0.5">Execution layer — manage operations, content, and partners</p>
              </div>
            </div>
            <Link
              to="/admin/ceo-cockpit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#004F8C] hover:bg-[#003d6b] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              CEO Cockpit
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-[#004F8C]/30 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#004F8C]/10 flex items-center justify-center group-hover:bg-[#004F8C]/20 transition-colors">
                  <action.icon className="w-5 h-5 text-[#004F8C]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-[#004F8C] transition-colors">{action.label}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Intelligence Links */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Intelligence Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {intelligenceLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group p-5 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">{link.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
