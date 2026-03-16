import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageTransitionProvider } from "@/contexts/LanguageTransitionContext";

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
const AdminTeamMembers = lazy(() => import("./pages/admin/AdminTeamMembers"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageTransitionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
            <Route path="/contributor-match" element={<ContributorMatch />} />
            
            {/* Separate Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersNew />} />
              <Route path="communities" element={<AdminCommunities />} />
              <Route path="communities/:id" element={<AdminCommunityDetail />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="site-content" element={<AdminSiteContent />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="contributors" element={<AdminContributorAssessments />} />
              <Route path="team" element={<AdminTeamMembers />} />
              
              <Route path="settings" element={<AdminSettingsNew />} />
              <Route path="audit" element={<AdminAuditLog />} />
              <Route path="security" element={<AdminSecurity />} />
            </Route>
            
            {/* Legacy admin routes - redirect to new structure */}
            <Route path="/education/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="users" element={<AdminUsersNew />} />
              <Route path="settings" element={<AdminSettingsNew />} />
              <Route path="audit" element={<AdminAuditLog />} />
              <Route path="security" element={<AdminSecurity />} />
            </Route>
            
            <Route path="/kvkk-request" element={<KVKKRequest />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
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
