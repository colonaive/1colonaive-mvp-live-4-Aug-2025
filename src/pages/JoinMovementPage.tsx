import React from 'react';
import { Container } from '../components/ui/Container';
import ChampionSignUp from './signup/ChampionSignUp';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getDashboardRoute } from '../components/ProtectedRoute';

const JoinMovementPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // If user is already authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    const userRole = user.user_metadata?.role || user.app_metadata?.role || 'member';
    const dashboardPath = getDashboardRoute(userRole);
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Join the Movement</h1>
            <p className="text-xl mb-0">
              Become a Champion in Singapore's national effort to eliminate colorectal cancer.
            </p>
          </div>
        </Container>
      </div>

      <ChampionSignUp />
      
      {/* Nominate Clinician Section */}
      <section className="py-16 bg-gray-50" id="nominate-clinician">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nominate a Healthcare Provider
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Know a healthcare provider who should join our movement? Help us expand our network 
              of champions committed to eliminating colorectal cancer in Singapore.
            </p>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Nominate a GP</h3>
                  <p className="text-gray-600 mb-6">
                    Help us connect with general practitioners who can offer screening to their patients.
                  </p>
                  <a href="/contact?subject=Nominate%20GP" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                    Nominate GP
                  </a>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Nominate a Specialist</h3>
                  <p className="text-gray-600 mb-6">
                    Recommend gastroenterologists and colorectal specialists to join our network.
                  </p>
                  <a href="/contact?subject=Nominate%20Specialist" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                    Nominate Specialist
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default JoinMovementPage;