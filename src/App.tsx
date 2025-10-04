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
import { EducationRegister } from "./pages/education/EducationRegister";
import { InstructorProfile } from "./pages/education/InstructorProfile";
import { AdminDashboard } from "./pages/education/AdminDashboard";
import './i18n/config';

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="/education/register" element={<EducationRegister />} />
          <Route path="/education/instructor/:id" element={<InstructorProfile />} />
          <Route path="/education/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
