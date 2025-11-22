import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { mitBlockchainLectures } from '@/data/mitOcwLectures';

interface SubtitleJob {
  id: string;
  lecture_id: number;
  lecture_title: string;
  status: string;
  progress: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  generated_files: {
    en: string | null;
    tr: string | null;
    ru: string | null;
    ar: string | null;
  };
}

const AdminSubtitles = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<SubtitleJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAll, setGeneratingAll] = useState(false);

  useEffect(() => {
    loadJobs();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('subtitle-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subtitle_jobs'
        },
        () => {
          loadJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('subtitle_jobs')
        .select('*')
        .order('lecture_id', { ascending: true });

      if (error) throw error;

      const typedJobs = (data || []).map(job => ({
        ...job,
        generated_files: job.generated_files as { en: string | null; tr: string | null; ru: string | null; ar: string | null }
      })) as SubtitleJob[];

      setJobs(typedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subtitle jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSubtitles = async (lectureId: number) => {
    try {
      const lecture = mitBlockchainLectures.find(l => l.id === lectureId);
      if (!lecture) return;

      // Create job record
      const { data: job, error: jobError } = await supabase
        .from('subtitle_jobs')
        .insert({
          lecture_id: lectureId,
          lecture_title: lecture.title,
          video_url: lecture.videoUrl,
          status: 'pending',
          progress: 0
        })
        .select()
        .single();

      if (jobError) throw jobError;

      toast({
        title: 'Job Created',
        description: `Subtitle generation started for Lecture ${lectureId}`,
      });

      // Call edge function
      const { error: functionError } = await supabase.functions.invoke('generate-subtitles', {
        body: { jobId: job.id }
      });

      if (functionError) throw functionError;

    } catch (error) {
      console.error('Error generating subtitles:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate subtitles',
        variant: 'destructive',
      });
    }
  };

  const generateAllSubtitles = async () => {
    setGeneratingAll(true);
    
    try {
      let successCount = 0;
      
      for (const lecture of mitBlockchainLectures) {
        const existingJob = jobs.find(j => j.lecture_id === lecture.id && j.status === 'completed');
        if (!existingJob) {
          await generateSubtitles(lecture.id);
          successCount++;
          // Delay between jobs to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      toast({
        title: 'Batch Started',
        description: `Started generating subtitles for ${successCount} lectures`,
      });
    } catch (error) {
      console.error('Error in batch generation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start batch generation',
        variant: 'destructive',
      });
    } finally {
      setGeneratingAll(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/20 text-blue-300"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-300"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge>Not Started</Badge>;
    }
  };

  const getLectureJob = (lectureId: number) => {
    return jobs.find(j => j.lecture_id === lectureId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Subtitle Generation</h1>
          <p className="text-muted-foreground">Manage AI-powered subtitle generation for MIT OpenCourseWare lectures</p>
        </div>
        <Button
          onClick={generateAllSubtitles}
          disabled={generatingAll}
          size="lg"
          className="gap-2"
        >
          {generatingAll ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating All...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Generate All Missing
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {mitBlockchainLectures.map((lecture) => {
          const job = getLectureJob(lecture.id);
          
          return (
            <Card key={lecture.id} className="p-6 bg-background/40 backdrop-blur-sm border-border/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Lecture {lecture.id}: {lecture.title}
                    </h3>
                    {job && getStatusBadge(job.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Duration: {lecture.duration}
                  </p>

                  {job && job.status === 'processing' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  {job && job.status === 'completed' && (
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-green-500/10">EN</Badge>
                      <Badge variant="outline" className="bg-green-500/10">TR</Badge>
                      <Badge variant="outline" className="bg-green-500/10">RU</Badge>
                      <Badge variant="outline" className="bg-green-500/10">AR</Badge>
                    </div>
                  )}

                  {job && job.status === 'failed' && job.error_message && (
                    <p className="text-sm text-red-400 mt-2">Error: {job.error_message}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {!job || job.status === 'failed' ? (
                    <Button
                      onClick={() => generateSubtitles(lecture.id)}
                      size="sm"
                      className="gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {job?.status === 'failed' ? 'Retry' : 'Generate'}
                    </Button>
                  ) : job.status === 'completed' ? (
                    <Button
                      onClick={() => generateSubtitles(lecture.id)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Cost & Time Estimates</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• OpenAI Whisper: ~$0.50 per lecture (~$12 total for 24 lectures)</li>
          <li>• Translation via Lovable AI: Included in free tier</li>
          <li>• Processing time: ~10-18 minutes per lecture</li>
          <li>• Total batch time: ~4-7 hours (sequential) or 1-2 hours (parallel)</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSubtitles;
