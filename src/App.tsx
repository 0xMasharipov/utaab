import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageTransitionProvider } from "@/contexts/LanguageTransitionContext";
import { ADMIN_ROUTES } from "@/config/routes";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";
import { Web3Providers } from "@/lib/web3/Web3Providers";

// Lazy load all route components for better code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EducationHome = lazy(() => import("./pages/education/EducationHome").then(m => ({ default: m.EducationHome })));
const CourseCatalog = lazy(() => import("./pages/education/CourseCatalog").then(m => ({ default: m.CourseCatalog })));
const CourseDetail = lazy(() => import("./pages/education/CourseDetail").then(m => ({ default: m.CourseDetail })));
const CourseLearn = lazy(() => import("./pages/education/CourseLearn").then(m => ({ default: m.CourseLearn })));
const EducationRegister = lazy(() => import("./pages/education/EducationRegister").then(m => ({ default: m.EducationRegister })));
const EducationSignIn = lazy(() => import("./pages/education/EducationSignIn").then(m => ({ default: m.EducationSignIn })));
const InstructorProfile = lazy(() => import("./pages/education/InstructorProfile").then(m => ({ default: m.InstructorProfile })));
const UserProfile = lazy(() => import("./pages/education/UserProfile").then(m => ({ default: m.UserProfile })));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import("./pages/education/admin/AdminOverview").then(m => ({ default: m.AdminOverview })));
const AdminCourses = lazy(() => import("./pages/education/admin/AdminCourses").then(m => ({ default: m.AdminCourses })));
const AdminAnnouncements = lazy(() => import("./pages/education/admin/AdminAnnouncements").then(m => ({ default: m.AdminAnnouncements })));
const AdminMessages = lazy(() => import("./pages/education/admin/AdminMessages").then(m => ({ default: m.AdminMessages })));
const AdminMedia = lazy(() => import("./pages/education/admin/AdminMedia").then(m => ({ default: m.AdminMedia })));
const AdminUsers = lazy(() => import("./pages/education/admin/AdminUsers").then(m => ({ default: m.AdminUsers })));
const AdminSettings = lazy(() => import("./pages/education/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AdminAuditLog = lazy(() => import("./pages/education/admin/AdminAuditLog").then(m => ({ default: m.AdminAuditLog })));
const AdminSecurity = lazy(() => import("./pages/education/admin/AdminSecurity").then(m => ({ default: m.AdminSecurity })));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminSiteContent = lazy(() => import("./pages/admin/AdminSiteContent"));
const AdminUsersNew = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCommunities = lazy(() => import("./pages/admin/AdminCommunities"));
const AdminCommunityDetail = lazy(() => import("./pages/admin/AdminCommunityDetail"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminSettingsNew = lazy(() => import("./pages/admin/AdminSettingsNew"));

const Profile = lazy(() => import("./pages/Profile"));
const KVKKRequest = lazy(() => import("./pages/KVKKRequest").then(m => ({ default: m.KVKKRequest })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").then(m => ({ default: m.TermsOfService })));
const BlockchainAndMoney = lazy(() => import("./pages/education/BlockchainAndMoney").then(m => ({ default: m.BlockchainAndMoney })));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const ContributorMatch = lazy(() => import("./pages/ContributorMatch"));
const AdminContributorAssessments = lazy(() => import("./pages/admin/AdminContributorAssessments"));
const EducationalGuides = lazy(() => import("./pages/learn/EducationalGuides"));
const Workshops = lazy(() => import("./pages/learn/Workshops"));
const About = lazy(() => import("./pages/About"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const LearnHub = lazy(() => import("./pages/LearnHub"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const Whitepaper = lazy(() => import("./pages/Whitepaper"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TonRaPage = lazy(() => import("./pages/projects/TonRaPage"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const CertDashboard = lazy(() => import("./pages/admin/cert/CertDashboard"));
const CertEvents = lazy(() => import("./pages/admin/cert/CertEvents"));
const CertParticipants = lazy(() => import("./pages/admin/cert/CertParticipants"));
const CertRecords = lazy(() => import("./pages/admin/cert/CertRecords"));
const CertTemplates = lazy(() => import("./pages/admin/cert/CertTemplates"));
const CertSettings = lazy(() => import("./pages/admin/cert/CertSettings"));

const queryClient = new QueryClient();

function RouterTracker() {
  usePageViewTracker();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageTransitionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <RouterTracker />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/education" element={<EducationHome />} />
            <Route path="/education/courses" element={<CourseCatalog />} />
            <Route path="/education/course/:slug" element={<CourseDetail />} />
            <Route path="/education/learn/:slug" element={<CourseLearn />} />
            <Route path="/education/register" element={<EducationRegister />} />
            <Route path="/education/sign-in" element={<EducationSignIn />} />
            <Route path="/education/profile" element={<UserProfile />} />
            <Route path="/education/instructor/:id" element={<InstructorProfile />} />
            <Route path="/education/blockchain-and-money" element={<BlockchainAndMoney />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contributor-match" element={<ContributorMatch />} />
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/guides" element={<EducationalGuides />} />
            <Route path="/learn/workshops" element={<Workshops />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/projects/tonra" element={<TonRaPage />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            
            {/* Authentication */}
            <Route path={ADMIN_ROUTES.LOGIN} element={<AdminLogin />} />
            
            {/* Protected Layout */}
            <Route path={ADMIN_ROUTES.BASE} element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="p3" element={<AdminDashboard />} />
              <Route path="q7w" element={<AdminUsersNew />} />
              <Route path="r2f" element={<AdminCommunities />} />
              <Route path="r2f/:id" element={<AdminCommunityDetail />} />
              <Route path="t5j" element={<AdminEvents />} />
              <Route path="s6c" element={<AdminSiteContent />} />
              <Route path="m4b" element={<AdminBlog />} />
              <Route path="k8n" element={<AdminCourses />} />
              <Route path="a1x" element={<AdminAnnouncements />} />
              <Route path="d9g" element={<AdminMessages />} />
              <Route path="h3v" element={<AdminMedia />} />
              <Route path="w7p" element={<AdminContributorAssessments />} />
              <Route path="y5l" element={<AdminSettingsNew />} />
              <Route path="f8u" element={<AdminAuditLog />} />
              <Route path="z2e" element={<AdminSecurity />} />
              <Route path="cd0" element={<CertDashboard />} />
              <Route path="c1e" element={<CertEvents />} />
              <Route path="c2p" element={<CertParticipants />} />
              <Route path="c3r" element={<CertRecords />} />
              <Route path="c4t" element={<CertTemplates />} />
              <Route path="c5s" element={<CertSettings />} />
            </Route>
            
            {/* Legacy redirects */}
            <Route path="/admin/*" element={<NotFound />} />
            <Route path="/education/admin/*" element={<Navigate to={ADMIN_ROUTES.DASHBOARD} replace />} />
            
            <Route path="/kvkk-request" element={<KVKKRequest />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageTransitionProvider>
    </QueryClientProvider>
  );
}

export default App;
