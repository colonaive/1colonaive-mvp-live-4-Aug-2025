// src/routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';


import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';


// Admin
import { AdminLogin } from './pages/admin/AdminLogin';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import NewsFeedAdminPage from './pages/admin/NewsFeedAdminPage';
import AdminPartnerSpecialistForm from './pages/admin/AdminPartnerSpecialistForm';
import AdminCSRPartnerForm from './pages/admin/AdminCSRPartnerForm';
import CSRPartnersAdminPage from './pages/admin/CSRPartnersAdminPage';
import PartnerSpecialistsAdminPage from './pages/admin/PartnerSpecialistsAdminPage';


// ✅ Verified CRC News (two-column, AI summaries)
import LiveCRCNews from './pages/LiveCRCNews';


// Pages
import ChampionProfileSettings from './pages/ChampionProfileSettings';
import SpecialistProfileSettings from './pages/SpecialistProfileSettings';
import GPClinicProfileSettings from './pages/GPClinicProfileSettings';
import HomePage from './pages/HomePage';
import SpecialistSelfSignup from "./pages/public/SpecialistSelfSignup";
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/contact';
import AdvisorsPage from './pages/about/AdvisorsPage';
import ScreeningPage from './pages/ScreeningPage';
import JoinMovementPage from './pages/JoinMovementPage';
import ShareYourStoryPage from './pages/share-your-story';
import StoriesPage from './pages/stories';
import HowItWorksPage from './pages/HowItWorksPage';
import OurLabPartnerPage from './pages/OurLabPartner';


// Registration
import GPClinicSignUp from './pages/signup/GPClinicSignUp';
import CorporateSignUp from './pages/signup/CorporateSignUp';
import ChampionSignUp from './pages/signup/ChampionSignUp';
import SpecialistPublicForm from "./pages/SpecialistPublicForm";


// Auth
import ChampionSignIn from './pages/auth/ChampionSignIn';
import LoginForm from './components/auth/LoginForm';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import LoginRedirectPage from './pages/LoginRedirectPage';


// Education
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
// Evidence (new)



// ✅ Newsroom (keep the foldered hub + subpages)
import NewsroomHub from './pages/education/newsroom';
import PressReleasesPage from './pages/education/newsroom/press-releases';
import ResearchUpdatesPage from './pages/education/newsroom/research-updates';


import FAQsPage from './pages/education/FAQsPage';
import ResourcesPage from './pages/education/ResourcesPage';


// Individual Article Pages
import UnderstandingColorectalCancer from './pages/education/patients/basics/understanding-colorectal-cancer';
import HowCrcDevelopsFromPolyps from './pages/education/patients/basics/how-crc-develops-from-polyps';
import ColonoscopyPreparationGuide from './pages/education/patients/screening/colonoscopy-preparation-complete-guide';
import EarlyWarningSigns from './pages/education/patients/symptoms/early-warning-signs';
import ColonoscopyGoldStandard from './pages/education/patients/screening/colonoscopy-gold-standard';
import ColorectalCancerPage from './pages/education/patients/colorectal-cancer';


// Other
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
import SchemaTestPage from './pages/dev/SchemaTestPage';
import ChampionThankYouPage from './pages/ChampionThankYouPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import SupportPage from './pages/SupportPage';
import UpcomingClinicsPage from './pages/UpcomingClinicsPage';


// SEO Landing Pages
import {
  ColorectalCancerScreeningSingaporePage,
  ColonCancerTestSingaporePage,
  BloodTestColorectalCancerPage,
  ColorectalCancerScreeningAustraliaPage,
  DaChangAiShaZhaPage,
  SingaporeColorectalScreening,
  AustraliaBowelCancerScreening
} from './pages/seo';
import ColorectalCancerScreeningIndia from './pages/seo/colorectal-cancer-screening-india';
import ColorectalCancerScreeningPhilippines from './pages/seo/colorectal-cancer-screening-philippines';
import ColorectalCancerScreeningJapan from './pages/seo/colorectal-cancer-screening-japan';


// Placeholders
import IndiaComingSoon from './pages/placeholder/IndiaComingSoon';
import PhilippinesComingSoon from './pages/placeholder/PhilippinesComingSoon';
import JapanComingSoon from './pages/placeholder/JapanComingSoon';
import AustraliaComingSoon from './pages/placeholder/AustraliaComingSoon';


// Dashboards
import ChampionDashboard from './pages/ChampionDashboard';
import CorporateDashboard from './pages/CorporateDashboard';
import SpecialistDashboard from './pages/SpecialistDashboard';
import GPClinicDashboard from './pages/GPClinicDashboard';


// ✅ NEW: Evidence page
import ColonAiQHSAEvidencePage from './pages/evidence/colonaiq-hsa';


const MainRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about/advisors" element={<AdvisorsPage />} />
          <Route path="/vision2035" element={<Vision2035Page />} />
          <Route path="/csr-showcase" element={<CSRShowcasePage />} />
          <Route path="/get-screened" element={<ScreeningPage />} />
          <Route path="/join-the-movement" element={<JoinMovementPage />} />
          <Route path="/join-movement" element={<JoinMovementPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/our-lab-partner" element={<OurLabPartnerPage />} />


          {/* ✅ Public self-signup form for specialists */}
          <Route path="/partner-specialist/apply" element={<SpecialistSelfSignup />} />


          {/* ✅ Evidence routes */}
          <Route path="/evidence" element={<Navigate to="/evidence/colonaiq-hsa" replace />} />
          <Route path="/evidence/colonaiq-hsa" element={<ColonAiQHSAEvidencePage />} />


          {/* ✅ CRC news */}
          <Route path="/live-crc-news" element={<LiveCRCNews />} />
          <Route path="/news" element={<Navigate to="/live-crc-news" replace />} />


          {/* Education */}
          <Route path="/education" element={<EducationHub />} />
          <Route path="/education/article/:slug" element={<ArticlePage />} />


          {/* Patient education */}
          <Route path="/education/patients" element={<PatientEducationHub />} />
          <Route path="/education/patients/basics" element={<PatientBasicsHub />} />
          <Route path="/education/patients/screening" element={<PatientScreeningHub />} />
          <Route path="/education/patients/symptoms" element={<PatientSymptomsHub />} />
          <Route path="/education/patients/prevention" element={<PatientPreventionHub />} />
          <Route
            path="/education/patients/colorectal-cancer"
            element={<ColorectalCancerPage />}
          />
          {/* Individual articles */}
          <Route path="/education/article/understanding-colorectal-cancer" element={<UnderstandingColorectalCancer />} />
          <Route path="/education/article/how-crc-develops-from-polyps" element={<HowCrcDevelopsFromPolyps />} />
          <Route path="/education/article/colonoscopy-preparation-complete-guide" element={<ColonoscopyPreparationGuide />} />
          <Route path="/education/article/early-warning-signs" element={<EarlyWarningSigns />} />
          <Route path="/education/article/colonoscopy-gold-standard" element={<ColonoscopyGoldStandard />} />


          {/* Clinician education */}
          <Route path="/education/clinicians" element={<ClinicianEducationHub />} />
          <Route path="/education/clinicians/guidelines" element={<ClinicianGuidelinesHub />} />
          <Route path="/education/clinicians/research" element={<ClinicianResearchHub />} />
          <Route path="/education/clinicians/case-studies" element={<ClinicianCaseStudiesHub />} />
          <Route path="/education/clinicians/cme-resources" element={<ClinicianCMEHub />} />


          {/* ✅ Newsroom hub + subpages */}
          <Route path="/education/newsroom" element={<NewsroomHub />} />
          <Route path="/education/newsroom/press-releases" element={<PressReleasesPage />} />
          <Route path="/education/newsroom/research-updates" element={<ResearchUpdatesPage />} />


          {/* Legacy CRC-news URLs → new feed */}
          <Route path="/newsroom/crc-news" element={<Navigate to="/live-crc-news" replace />} />
          <Route path="/newsroom/crc-news-feed" element={<Navigate to="/live-crc-news" replace />} />


          <Route path="/education/faqs" element={<FAQsPage />} />
          <Route path="/education/resources" element={<ResourcesPage />} />
          <Route path="/upcoming-events" element={<UpcomingEventsPage />} />
          <Route path="/find-a-gp" element={<FindGPPage />} />
          <Route path="/find-specialist" element={<FindSpecialistPage />} />
          <Route path="/find-a-specialist" element={<FindSpecialistPage />} />
          <Route path="/triage" element={<TriagePage />} />


          <Route path="/support" element={<SupportPage />} />
          <Route path="/upcoming-clinics" element={<UpcomingClinicsPage />} />


          {/* Convenience redirects */}
          <Route path="/clinics" element={<Navigate to="/find-a-gp" replace />} />
          <Route path="/choose-screening" element={<Navigate to="/get-screened" replace />} />
          <Route path="/terms" element={<Navigate to="/terms-of-use" replace />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/movement-pillars" element={<PillarsPage />} />
          <Route path="/pillars/rid-crc-pub" element={<RIDCRCPUBPage />} />
          <Route path="/pillars/rid-crc-sgp" element={<RIDCRCSGPPage />} />
          <Route path="/pillars/rid-crc-gov" element={<RIDCRCGOVPage />} />
          <Route path="/pillars/rid-crc-csr" element={<RIDCRCCSRPage />} />
          <Route path="/pillars/rid-crc-edu" element={<RIDCRCEDUPage />} />
          <Route path="/clinical-trials" element={<ClinicalTrialsPage />} />


          {/* Auth & registration */}
          <Route path="/signup/champion" element={<ChampionSignUp />} />
          <Route path="/register/clinic" element={<GPClinicSignUp />} />
          <Route path="/register/corporate" element={<CorporateSignUp />} />
          <Route path="/champion-sign-in" element={<PublicRoute><ChampionSignIn /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginForm redirectTo="/login-redirect" /></PublicRoute>} />
          <Route path="/login-redirect" element={<LoginRedirectPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/champion-signup-success" element={<ChampionThankYouPage />} />


          {/* Admin */}
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route
            path="/admin/dashboard"
            element={<ProtectedAdminRoute><SuperAdminDashboard /></ProtectedAdminRoute>}
          />
          {/* CSR list (protected) */}
          <Route
            path="/admin/csr-partners"
            element={<ProtectedAdminRoute><CSRPartnersAdminPage /></ProtectedAdminRoute>}
          />
          {/* Alias to the same CSR list */}
          <Route
            path="/admin/csr"
            element={<ProtectedAdminRoute><CSRPartnersAdminPage /></ProtectedAdminRoute>}
          />
          <Route
            path="/admin/news"
            element={<ProtectedAdminRoute><NewsFeedAdminPage /></ProtectedAdminRoute>}
          />
          <Route
            path="/admin/partner-specialists"
            element={<ProtectedAdminRoute><PartnerSpecialistsAdminPage /></ProtectedAdminRoute>}
          />


          {/* CSR create & edit (protected) */}
          <Route
            path="/admin/csr/new"
            element={<ProtectedAdminRoute><AdminCSRPartnerForm /></ProtectedAdminRoute>}
          />
          <Route
            path="/admin/csr/:id/edit"
            element={<ProtectedAdminRoute><AdminCSRPartnerForm /></ProtectedAdminRoute>}
          />
          {/* Partner specialist create (protected) */}
          <Route
            path="/admin/partner-specialists/new"
            element={<ProtectedAdminRoute><AdminPartnerSpecialistForm /></ProtectedAdminRoute>}
          />
          <Route path="/specialist-submission" element={<SpecialistPublicForm />} />


          {/* Protected */}
          <Route path="/refer-friend" element={<ProtectedRoute><ShareYourStoryPage /></ProtectedRoute>} />
          <Route path="/share-your-story" element={<ProtectedRoute><ShareYourStoryPage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><CRCQuiz /></ProtectedRoute>} />
          <Route path="/dashboard/champion" element={<ProtectedRoute><ChampionDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/specialist" element={<ProtectedRoute><SpecialistDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/corporate" element={<ProtectedRoute><CorporateDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/gp-clinic" element={<ProtectedRoute><GPClinicDashboard /></ProtectedRoute>} />


          {/* Profiles */}
          <Route path="/profile/champion" element={<ProtectedRoute><ChampionProfileSettings /></ProtectedRoute>} />
          <Route path="/profile/specialist" element={<ProtectedRoute><SpecialistProfileSettings /></ProtectedRoute>} />
          <Route path="/profile/gp-clinic" element={<ProtectedRoute><GPClinicProfileSettings /></ProtectedRoute>} />


          {/* Legal */}
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />


          {/* Dev */}
          <Route path="/dev-preview" element={<DevPreview />} />
          <Route path="/component-preview" element={<ComponentPreview />} />
          <Route path="/dynamic-page-preview" element={<DynamicPagePreview />} />
          <Route path="/schema-test" element={<SchemaTestPage />} />


          {/* SEO */}
          <Route path="/seo/singapore-colorectal-screening" element={<SingaporeColorectalScreening />} />
          <Route path="/seo/australia-bowel-cancer-screening" element={<AustraliaBowelCancerScreening />} />
          <Route path="/seo/colorectal-cancer-screening-india" element={<ColorectalCancerScreeningIndia />} />
          <Route path="/seo/colorectal-cancer-screening-philippines" element={<ColorectalCancerScreeningPhilippines />} />
          <Route path="/seo/colorectal-cancer-screening-japan" element={<ColorectalCancerScreeningJapan />} />
          <Route path="/seo/colorectal-cancer-screening-singapore" element={<ColorectalCancerScreeningSingaporePage />} />
          <Route path="/seo/colon-cancer-test-singapore" element={<ColonCancerTestSingaporePage />} />
          <Route path="/seo/blood-test-colorectal-cancer" element={<BloodTestColorectalCancerPage />} />
          <Route path="/seo/colorectal-cancer-screening-australia" element={<ColorectalCancerScreeningAustraliaPage />} />
          <Route path="/seo/da-chang-ai-sha-zha" element={<DaChangAiShaZhaPage />} />


          {/* Intl quick links */}
          <Route path="/education/in" element={<IndiaComingSoon />} />
          <Route path="/education/ph" element={<PhilippinesComingSoon />} />
          <Route path="/education/jp" element={<JapanComingSoon />} />
          <Route path="/education/au" element={<AustraliaComingSoon />} />


          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


export default MainRoutes;