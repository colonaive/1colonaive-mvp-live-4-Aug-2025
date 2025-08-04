import { AdminLogin } from './pages/admin/AdminLogin';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import NewsFeedAdmin from './pages/admin/NewsFeedAdmin';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import ReferFriendForm from './pages/ReferFriendForm';

// Pages
import ChampionProfileSettings from './pages/ChampionProfileSettings';
import SpecialistProfileSettings from './pages/SpecialistProfileSettings';
import GPClinicProfileSettings from './pages/GPClinicProfileSettings';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import AdvisorsPage from './pages/about/AdvisorsPage';
import ScreeningPage from './pages/ScreeningPage';
import JoinMovementPage from './pages/JoinMovementPage';
import ShareYourStoryPage from './pages/share-your-story';
import StoriesPage from './pages/stories';

// Registration Pages
import GPClinicSignUp from './pages/signup/GPClinicSignUp';
import SpecialistSignUp from './pages/signup/SpecialistSignUp';
import CorporateSignUp from './pages/signup/CorporateSignUp';
import ChampionSignUp from './pages/signup/ChampionSignUp';

// Auth Pages
import ChampionSignIn from './pages/auth/ChampionSignIn';
import LoginForm from './components/auth/LoginForm';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import LoginRedirectPage from './pages/LoginRedirectPage';

// Education Pages
import EducationHub from './pages/education';
import ArticlePage from './pages/education/article/[slug]';
import PatientEducationHub from './pages/education/patients';
import PatientBasicsHub from './pages/education/patients/basics';
import PatientScreeningHub from './pages/education/patients/screening';
import PatientSymptomsHub from './pages/education/patients/symptoms';
import PatientPreventionHub from './pages/education/patients/prevention';
import ClinicianEducationHub from './pages/education/clinicians';
import ClinicianGuidelinesHub from './pages/education/clinicians/guidelines';
import ClinicianResearchHub from './pages/education/clinicians/research';
import ClinicianCaseStudiesHub from './pages/education/clinicians/case-studies';
import ClinicianCMEHub from './pages/education/clinicians/cme-resources';
import NewsroomHub from './pages/education/newsroom';
import PressReleasesPage from './pages/education/newsroom/press-releases';
import ResearchUpdatesPage from './pages/education/newsroom/research-updates';
import CRCNewsFeed from './pages/newsroom/CRCNewsFeed';
import CRCNewsFeedPage from './pages/newsroom/CRCNewsFeedPage';
import FAQsPage from './pages/education/FAQsPage';
import NewsroomPage from './pages/education/NewsroomPage';
import ResourcesPage from './pages/education/ResourcesPage';

// Individual Article Pages
import UnderstandingColorectalCancer from './pages/education/patients/basics/understanding-colorectal-cancer';
import HowCrcDevelopsFromPolyps from './pages/education/patients/basics/how-crc-develops-from-polyps';
import ColonoscopyPreparationGuide from './pages/education/patients/screening/colonoscopy-preparation-complete-guide';
import EarlyWarningSigns from './pages/education/patients/symptoms/early-warning-signs';
import ColonoscopyGoldStandard from './pages/education/patients/screening/colonoscopy-gold-standard';

// Other Pages
import Vision2035Page from './pages/Vision2035Page';
import CSRShowcasePage from './pages/CSRShowcasePage';
import UpcomingEventsPage from './pages/UpcomingEventsPage';
import FindGPPage from './pages/FindGPPage';
import FindSpecialistPage from './pages/FindSpecialistPage';
import TriagePage from './pages/triage';
import PillarsPage from './pages/PillarsPage';
import RIDCRCPUBPage from './pages/pillars/RIDCRCPUBPage';
import RIDCRCSGPPage from './pages/pillars/RIDCRCSGPPage';
import RIDCRCGOVPage from './pages/pillars/RIDCRCGOVPage';
import RIDCRCCSRPage from './pages/pillars/RIDCRCCSRPage';
import RIDCRCEDUPage from './pages/pillars/RIDCRCEDUPage';
import ClinicalTrialsPage from './pages/ClinicalTrialsPage';
import CRCQuiz from './pages/CRCQuiz';
import DevPreview from './pages/dev/DevPreview';
import ComponentPreview from './pages/dev/ComponentPreview';
import DynamicPagePreview from './pages/dev/DynamicPagePreview';
import ChampionThankYouPage from './pages/ChampionThankYouPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';

// Dashboards
import ChampionDashboard from './pages/ChampionDashboard';
import CorporateDashboard from './pages/CorporateDashboard';
import SpecialistDashboard from './pages/SpecialistDashboard';
import GPClinicDashboard from './pages/GPClinicDashboard';

const MainRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/about/advisors" element={<AdvisorsPage />} />
          <Route path="/vision2035" element={<Vision2035Page />} />
          <Route path="/csr-showcase" element={<CSRShowcasePage />} />
          <Route path="/get-screened" element={<ScreeningPage />} />
          <Route path="/join-the-movement" element={<JoinMovementPage />} />
          <Route path="/join-movement" element={<JoinMovementPage />} />
          <Route path="/stories" element={<StoriesPage />} />
        
          
          {/* Education routes */}
          <Route path="/education" element={<EducationHub />} />
          <Route path="/education/article/:slug" element={<ArticlePage />} />
          
          {/* Patient education routes */}
          <Route path="/education/patients" element={<PatientEducationHub />} />
          <Route path="/education/patients/basics" element={<PatientBasicsHub />} />
          <Route path="/education/patients/screening" element={<PatientScreeningHub />} />
          <Route path="/education/patients/symptoms" element={<PatientSymptomsHub />} />
          <Route path="/education/patients/prevention" element={<PatientPreventionHub />} />
          
          {/* Individual Article Routes */}
          <Route path="/education/article/understanding-colorectal-cancer" element={<UnderstandingColorectalCancer />} />
          <Route path="/education/article/how-crc-develops-from-polyps" element={<HowCrcDevelopsFromPolyps />} />
         <Route path="/education/article/colonoscopy-preparation-complete-guide" element={<ColonoscopyPreparationGuide />} />
          <Route path="/education/article/early-warning-signs" element={<EarlyWarningSigns />} />
          <Route path="/education/article/colonoscopy-gold-standard" element={<ColonoscopyGoldStandard />} />
          
          {/* Clinician education routes */}
          <Route path="/education/clinicians" element={<ClinicianEducationHub />} />
          <Route path="/education/clinicians/guidelines" element={<ClinicianGuidelinesHub />} />
          <Route path="/education/clinicians/research" element={<ClinicianResearchHub />} />
          <Route path="/education/clinicians/case-studies" element={<ClinicianCaseStudiesHub />} />
          <Route path="/education/clinicians/cme-resources" element={<ClinicianCMEHub />} />
          
          {/* Newsroom routes */}
          <Route path="/education/newsroom" element={<NewsroomHub />} />
          <Route path="/education/newsroom/press-releases" element={<PressReleasesPage />} />
          <Route path="/education/newsroom/research-updates" element={<ResearchUpdatesPage />} />
          <Route path="/newsroom/crc-news" element={<CRCNewsFeed />} />
          <Route path="/newsroom/crc-news-feed" element={<CRCNewsFeedPage />} />
          
          <Route path="/education/faqs" element={<FAQsPage />} />
          <Route path="/education/newsroom" element={<NewsroomPage />} />
          <Route path="/education/resources" element={<ResourcesPage />} />
          <Route path="/upcoming-events" element={<UpcomingEventsPage />} />
          <Route path="/find-a-gp" element={<FindGPPage />} />
          <Route path="/find-specialist" element={<FindSpecialistPage />} />
          <Route path="/triage" element={<TriagePage />} />
          <Route path="/movement-pillars" element={<PillarsPage />} />
          <Route path="/pillars/rid-crc-pub" element={<RIDCRCPUBPage />} />
          <Route path="/pillars/rid-crc-sgp" element={<RIDCRCSGPPage />} />
          <Route path="/pillars/rid-crc-gov" element={<RIDCRCGOVPage />} />
          <Route path="/pillars/rid-crc-csr" element={<RIDCRCCSRPage />} />
          <Route path="/pillars/rid-crc-edu" element={<RIDCRCEDUPage />} />
          <Route path="/clinical-trials" element={<ClinicalTrialsPage />} />
          
          {/* Auth & Registration */}
          <Route path="/signup/champion" element={<ChampionSignUp />} />
          <Route path="/register/clinic" element={<GPClinicSignUp />} />
          <Route path="/register/specialist" element={<SpecialistSignUp />} />
          <Route path="/register/corporate" element={<CorporateSignUp />} />
          <Route path="/champion-sign-in" element={<PublicRoute><ChampionSignIn /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginForm redirectTo="/login-redirect" /></PublicRoute>} /> 
          <Route path="/login-redirect" element={<LoginRedirectPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/champion-signup-success" element={<ChampionThankYouPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute>
                <SuperAdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/news" 
            element={
              <ProtectedAdminRoute>
                <NewsFeedAdmin />
              </ProtectedAdminRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route path="/refer-friend" element={<ProtectedRoute><ReferFriendForm /></ProtectedRoute>} />
          <Route path="/share-your-story" element={<ProtectedRoute><ShareYourStoryPage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><CRCQuiz /></ProtectedRoute>} />
          <Route path="/dashboard/champion" element={<ProtectedRoute><ChampionDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/specialist" element={<ProtectedRoute><SpecialistDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/corporate" element={<ProtectedRoute><CorporateDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/gp-clinic" element={<ProtectedRoute><GPClinicDashboard /></ProtectedRoute>} />
          
          {/* Profile Pages */}
          <Route path="/profile/champion" element={<ProtectedRoute><ChampionProfileSettings /></ProtectedRoute>} />
          <Route path="/profile/specialist" element={<ProtectedRoute><SpecialistProfileSettings /></ProtectedRoute>} />
          <Route path="/profile/gp-clinic" element={<ProtectedRoute><GPClinicProfileSettings /></ProtectedRoute>} />

          {/* Legal Pages */}
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />

          {/* Dev Preview */}
          <Route path="/dev-preview" element={<DevPreview />} />
          <Route path="/component-preview" element={<ComponentPreview />} />
          <Route path="/dynamic-page-preview" element={<DynamicPagePreview />} />


          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default MainRoutes;