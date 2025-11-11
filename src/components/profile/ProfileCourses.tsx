import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCoursesProps {
  userId: string;
}

export default function ProfileCourses({ userId }: ProfileCoursesProps) {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, [userId]);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      toast.error('Failed to load courses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <Card className="glass-panel p-12 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
        <p className="text-muted-foreground mb-6">
          Start learning by exploring our course catalog
        </p>
        <Button onClick={() => navigate('/education/courses')}>
          Browse Courses
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Courses</h2>
        <p className="text-muted-foreground">Track your learning progress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id} className="glass-panel p-6 hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {enrollment.courses?.title_en}
                  </h3>
                  {enrollment.completed ? (
                    <Badge variant="default">Completed</Badge>
                  ) : (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </div>
              </div>

              {!enrollment.completed && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(enrollment.progress || 0)}%</span>
                  </div>
                  <Progress value={enrollment.progress || 0} />
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{enrollment.courses?.duration_hours || 0}h</span>
                </div>
                {enrollment.completed_at && (
                  <span>
                    Completed: {new Date(enrollment.completed_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => navigate(`/education/learn/${enrollment.courses?.slug}`)}
              >
                {enrollment.completed ? 'Review Course' : 'Continue Learning'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
