// src/components/Footer.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Container } from './ui/Container';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardRoute } from './ProtectedRoute';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Handle navigation for authenticated users
  const handleAuthenticatedNavigation = (path: string, e: React.MouseEvent) => {
    // If user is authenticated and trying to access signup pages, redirect to dashboard
    if (isAuthenticated && (path.includes('/signup/') || path === '/join-the-movement')) {
      e.preventDefault();
      const userRole = user?.user_metadata?.role || user?.app_metadata?.role || 'member';
      const dashboardPath = getDashboardRoute(userRole);
      navigate(dashboardPath);
    }
  };

  // Define link data for easier management
  const patientResourceLinks = [
    { label: 'Understand CRC', path: '/education/patients/colorectal-cancer' }, // Assuming /education/patients is the hub for "Understand CRC"
    { label: 'Screening Options', path: '/get-screened' },
    { label: '🌏 Explore by Country', path: '/seo' },
    { label: '🧠 Learn About COLONAiVE™', path: '/about' },
    { label: 'Find a GP Clinic', path: '/find-a-gp' },         // CORRECTED
    { label: 'Find a Specialist Clinic', path: '/find-a-specialist' } // CORRECTED
    // { label: 'Track Your Screening', path: '/track-screening' }, // Placeholder - add route if page exists
  ];

  const professionalPortalLinks = [
    { label: 'GP Portal', path: '/register/clinic' },       // Example: Re-using clinic sign-up, or create /gp-portal page
    { label: 'Specialist Portal', path: '/register/specialist' }, // Example: Re-using specialist sign-up, or create /specialist-portal page
    { label: 'Corporate CSR', path: '/register/corporate' } // Links to existing CSR registration
  ];

  const aboutMovementLinks = [
    { label: 'Our Story', path: '/about-us' },
    { label: 'Movement Pillars', path: '/movement-pillars' },
    { label: 'Vision 2035', path: '/vision2035' },
    { label: 'Join Us', path: '/signup/champion' }
  ];

  const legalLinksData = [
    { label: 'Privacy Policy', path: '/privacy-policy' }, // CORRECTED
    { label: 'Terms of Use', path: '/terms-of-use' },   // CORRECTED
    { label: 'Cookie Policy', path: '/cookie-policy' }  // CORRECTED
  ];


  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative z-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Social Icons with Animations */}
          <div className="group">
            <Link to="/">
              <h3 className="text-2xl font-bold mb-4 relative inline-block group-hover:scale-105 transition-transform duration-300">
                COLON<span className="text-teal-400 group-hover:text-teal-300 transition-colors duration-300">AiVE</span>™
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-teal-300 group-hover:w-full transition-all duration-700 ease-in-out delay-300 opacity-70"></span>
              </h3>
            </Link>
            <p className="text-gray-300 mb-4 group-hover:text-white transition-all duration-300">
              A National Movement to Outsmart Colorectal Cancer.
            </p>
            <p className="text-sm text-gray-400 mb-4 group-hover:text-gray-300 transition-all duration-300">
              For Lives, Not for Profits.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/colonaive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-300 transition-all duration-300 hover:scale-125 transform-gpu"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/colonaive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-300 transition-all duration-300 hover:scale-125 transform-gpu"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/colonaive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-300 transition-all duration-300 hover:scale-125 transform-gpu"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@colonaive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-300 transition-all duration-300 hover:scale-125 transform-gpu"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Patient Resources Column */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-100 relative inline-block group-hover:text-teal-300 group-hover:scale-105 transition-all duration-300 group">
              Patient Resources
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </h3>
            <ul className="space-y-2">
              {patientResourceLinks.map((link) => (
                <li key={link.path} className="relative overflow-hidden group">
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-teal-300 transition-colors duration-300 relative inline-block"
                    onClick={(e) => handleAuthenticatedNavigation(link.path, e)}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Portals Column */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-100 relative inline-block group-hover:text-teal-300 group-hover:scale-105 transition-all duration-300 group">
              Professional Portals
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </h3>
            <ul className="space-y-2">
              {professionalPortalLinks.map((link) => (
                <li key={link.path} className="relative overflow-hidden group">
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-teal-300 transition-colors duration-300 relative inline-block"
                    onClick={(e) => handleAuthenticatedNavigation(link.path, e)}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About the Movement Column */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-100 relative inline-block group-hover:text-teal-300 group-hover:scale-105 transition-all duration-300 group">
              About the Movement
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </h3>
            <ul className="space-y-2">
              {aboutMovementLinks.map((link) => (
                <li key={link.path} className="relative overflow-hidden group">
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-teal-300 transition-colors duration-300 relative inline-block"
                    onClick={(e) => handleAuthenticatedNavigation(link.path, e)}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} COLONAiVE Movement. All rights reserved.
            </p>
            <div className="flex mt-4 md:mt-0 space-x-6">
              {legalLinksData.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-400 hover:text-teal-300 text-sm transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center space-y-3">
            <Link
              to="/contact"
              className="text-sm text-blue-500 hover:text-blue-400 hover:underline transition-colors duration-300 relative group"
            >
              📬 Contact Us
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </Link>
            <a
              href="mailto:info@colonaive.ai"
              className="flex items-center text-gray-400 hover:text-teal-300 text-sm transition-all duration-300 group hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              info@colonaive.ai
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};