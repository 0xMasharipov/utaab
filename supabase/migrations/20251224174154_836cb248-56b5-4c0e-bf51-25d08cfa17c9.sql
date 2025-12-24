-- Enable realtime for key admin dashboard tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.education_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.enrollments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.security_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.communities;

-- Set REPLICA IDENTITY FULL for complete row data on updates
ALTER TABLE public.education_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.enrollments REPLICA IDENTITY FULL;
ALTER TABLE public.courses REPLICA IDENTITY FULL;
ALTER TABLE public.certificates REPLICA IDENTITY FULL;
ALTER TABLE public.security_events REPLICA IDENTITY FULL;
ALTER TABLE public.announcements REPLICA IDENTITY FULL;
ALTER TABLE public.communities REPLICA IDENTITY FULL;