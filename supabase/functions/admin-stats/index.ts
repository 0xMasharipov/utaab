import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Allowed origins for CORS
const allowedOrigins = [
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
  'https://id.preview.lovableproject.com',
  Deno.env.get('SITE_URL') || '',
].filter(Boolean);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.some(allowed => 
    origin === allowed || origin.endsWith('.lovableproject.com') || origin.includes('localhost')
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User is admin - fetch stats
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get comprehensive stats in parallel
    const [
      profilesResult,
      adminRolesResult,
      coursesResult,
      publishedCoursesResult,
      lessonsResult,
      enrollmentsResult,
      completedEnrollmentsResult,
      certificatesResult,
      reviewsResult,
      securityEventsResult,
      criticalEventsResult,
      announcementsResult,
      activeAnnouncementsResult,
      mediaResult,
      adminSessionsResult,
      communitiesResult,
    ] = await Promise.all([
      supabaseAdmin.from('education_profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
      supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabaseAdmin.from('lessons').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('enrollments').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('enrollments').select('id', { count: 'exact', head: true }).eq('completed', true),
      supabaseAdmin.from('certificates').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('reviews').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('security_events').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabaseAdmin.from('security_events').select('id', { count: 'exact', head: true }).eq('severity', 'critical').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabaseAdmin.from('announcements').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('announcements').select('id', { count: 'exact', head: true }).eq('visibility', 'published').lte('start_time', new Date().toISOString()).or('end_time.is.null,end_time.gte.' + new Date().toISOString()),
      supabaseAdmin.from('media_library').select('file_size', { count: 'exact' }),
      supabaseAdmin.from('admin_sessions').select('id', { count: 'exact', head: true }).gt('expires_at', new Date().toISOString()),
      supabaseAdmin.from('communities').select('id', { count: 'exact', head: true }),
    ]);

    // Calculate storage usage
    const totalStorage = mediaResult.data?.reduce((acc, item) => acc + (item.file_size || 0), 0) || 0;
    const storageGB = (totalStorage / (1024 * 1024 * 1024)).toFixed(2);

    // Get top courses by enrollment
    const { data: topCourses } = await supabaseAdmin
      .from('courses')
      .select('title_en, total_enrollments')
      .order('total_enrollments', { ascending: false })
      .limit(5);

    // Get new users this week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: newUsersThisWeek } = await supabaseAdmin
      .from('education_profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekAgo);

    // Calculate completion rate
    const completionRate = enrollmentsResult.count 
      ? ((completedEnrollmentsResult.count || 0) / enrollmentsResult.count * 100).toFixed(1)
      : 0;

    const stats = {
      // System Health
      systemHealth: {
        totalUsers: profilesResult.count || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        activeAdmins: adminRolesResult.count || 0,
        activeSessions: adminSessionsResult.count || 0,
        errorRate: criticalEventsResult.count || 0,
      },
      // Content Metrics
      contentMetrics: {
        totalCourses: coursesResult.count || 0,
        publishedCourses: publishedCoursesResult.count || 0,
        draftCourses: (coursesResult.count || 0) - (publishedCoursesResult.count || 0),
        totalLessons: lessonsResult.count || 0,
        storageUsedGB: storageGB,
        mediaFiles: mediaResult.count || 0,
      },
      // Engagement
      engagement: {
        totalEnrollments: enrollmentsResult.count || 0,
        completedCourses: completedEnrollmentsResult.count || 0,
        inProgressCourses: (enrollmentsResult.count || 0) - (completedEnrollmentsResult.count || 0),
        completionRate: completionRate,
        certificatesIssued: certificatesResult.count || 0,
        totalReviews: reviewsResult.count || 0,
        topCourses: topCourses || [],
      },
      // Security
      security: {
        eventsLast24h: securityEventsResult.count || 0,
        criticalEventsLast24h: criticalEventsResult.count || 0,
      },
      // Announcements
      announcements: {
        total: announcementsResult.count || 0,
        active: activeAnnouncementsResult.count || 0,
      },
      // Communities
      communities: {
        total: communitiesResult.count || 0,
      },
    };

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
