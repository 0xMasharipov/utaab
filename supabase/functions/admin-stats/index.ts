import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Allowed origins for CORS
const allowedOrigins = [
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
  'https://utaab.org',
  'https://www.utaab.org',
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

    // ===== Traffic / Site Visits =====
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const last30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const last7dStart = new Date();
    last7dStart.setUTCDate(last7dStart.getUTCDate() - 6);
    last7dStart.setUTCHours(0, 0, 0, 0);

    const [
      totalVisitsRes,
      visitsTodayRes,
      visitsLast24hRes,
      uniqueVisitorsRes,
      countriesRes,
      visitsForChartRes,
    ] = await Promise.all([
      supabaseAdmin.from('site_visits').select('id', { count: 'exact', head: true }).eq('is_bot', false),
      supabaseAdmin.from('site_visits').select('id', { count: 'exact', head: true }).eq('is_bot', false).gte('created_at', todayStart),
      supabaseAdmin.from('site_visits').select('id', { count: 'exact', head: true }).eq('is_bot', false).gte('created_at', last24h),
      supabaseAdmin.from('site_visits').select('visitor_hash').eq('is_bot', false).gte('created_at', last24h).limit(50000),
      supabaseAdmin.from('site_visits').select('country_code,country_name').eq('is_bot', false).gte('created_at', last30d).not('country_code', 'is', null).limit(50000),
      supabaseAdmin.from('site_visits').select('created_at,visitor_hash').eq('is_bot', false).gte('created_at', last7dStart.toISOString()).limit(50000),
    ]);

    // Unique visitors 24h
    const uniqueSet = new Set<string>();
    (uniqueVisitorsRes.data || []).forEach((r: any) => r.visitor_hash && uniqueSet.add(r.visitor_hash));
    const uniqueVisitors24h = uniqueSet.size;

    // Top countries (last 30d)
    const countryCounts = new Map<string, { code: string; name: string; visits: number }>();
    (countriesRes.data || []).forEach((r: any) => {
      const code = (r.country_code || '').toUpperCase();
      if (!code) return;
      const cur = countryCounts.get(code);
      if (cur) cur.visits++;
      else countryCounts.set(code, { code, name: r.country_name || code, visits: 1 });
    });
    const topCountries = Array.from(countryCounts.values())
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10)
      .map((c) => ({ country_code: c.code, country_name: c.name, visits: c.visits }));

    // Daily visits (last 7 days) — bucket client-side from one query
    const dailyVisitsMap = new Map<string, { visits: number; uniques: Set<string> }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyVisitsMap.set(key, { visits: 0, uniques: new Set() });
    }
    (visitsForChartRes.data || []).forEach((r: any) => {
      const key = String(r.created_at).slice(0, 10);
      const bucket = dailyVisitsMap.get(key);
      if (bucket) {
        bucket.visits++;
        if (r.visitor_hash) bucket.uniques.add(r.visitor_hash);
      }
    });
    const dailyVisits = Array.from(dailyVisitsMap.entries()).map(([date, v]) => ({
      date,
      visits: v.visits,
      unique_visitors: v.uniques.size,
    }));

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

    // Daily metrics for the last 7 days
    const dailyMetrics: { date: string; registrations: number; enrollments: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [regResult, enrResult] = await Promise.all([
        supabaseAdmin
          .from('education_profiles')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', dayStart.toISOString())
          .lte('created_at', dayEnd.toISOString()),
        supabaseAdmin
          .from('enrollments')
          .select('id', { count: 'exact', head: true })
          .gte('enrolled_at', dayStart.toISOString())
          .lte('enrolled_at', dayEnd.toISOString()),
      ]);

      dailyMetrics.push({
        date: dayStart.toISOString().split('T')[0],
        registrations: regResult.count || 0,
        enrollments: enrResult.count || 0,
      });
    }

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
      // Daily Metrics (last 7 days)
      dailyMetrics,
      // Site Traffic
      traffic: {
        totalVisits: totalVisitsRes.count || 0,
        visitsToday: visitsTodayRes.count || 0,
        visitsLast24h: visitsLast24hRes.count || 0,
        uniqueVisitors24h,
        topCountries,
        dailyVisits,
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
