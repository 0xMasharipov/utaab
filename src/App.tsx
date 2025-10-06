import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { EducationHome } from "./pages/education/EducationHome";
import { CourseCatalog } from "./pages/education/CourseCatalog";
import { CourseDetail } from "./pages/education/CourseDetail";
import { CourseLearn } from "./pages/education/CourseLearn";
import { EducationRegister } from "./pages/education/EducationRegister";
import { EducationSignIn } from "./pages/education/EducationSignIn";
import { InstructorProfile } from "./pages/education/InstructorProfile";
import { UserProfile } from "./pages/education/UserProfile";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminOverview } from "./pages/education/admin/AdminOverview";
import { AdminCourses } from "./pages/education/admin/AdminCourses";
import { AdminAnnouncements } from "./pages/education/admin/AdminAnnouncements";
import { AdminMessages } from "./pages/education/admin/AdminMessages";
import { AdminMedia } from "./pages/education/admin/AdminMedia";
import { AdminUsers } from "./pages/education/admin/AdminUsers";
import { AdminSettings } from "./pages/education/admin/AdminSettings";
import { AdminAuditLog } from "./pages/education/admin/AdminAuditLog";
import { AdminSecurity } from "./pages/education/admin/AdminSecurity";
import { KVKKRequest } from "./pages/KVKKRequest";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/education/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="audit" element={<AdminAuditLog />} />
              <Route path="security" element={<AdminSecurity />} />
            </Route>
            <Route path="/kvkk-request" element={<KVKKRequest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
