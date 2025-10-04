import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface CourseReviewsProps {
  courseId: string;
  isEnrolled: boolean;
}

export const CourseReviews = ({ courseId, isEnrolled }: CourseReviewsProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, course_id, rating, comment, created_at, updated_at, user_id')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: userReview } = useQuery({
    queryKey: ['user-review', courseId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      if (rating === 0) throw new Error('Please select a rating');

      const reviewData = {
        user_id: user.id,
        course_id: courseId,
        rating,
        comment: comment.trim() || null,
      };

      if (userReview) {
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', userReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] });
      queryClient.invalidateQueries({ queryKey: ['user-review', courseId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setShowReviewForm(false);
      setComment('');
      toast({
        title: "Success!",
        description: userReview ? "Review updated" : "Review submitted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }
    if (!isEnrolled) {
      toast({
        title: "Enrollment required",
        description: "You must be enrolled to review this course",
        variant: "destructive",
      });
      return;
    }
    submitReview.mutate();
  };

  // Load existing review into form
  useEffect(() => {
    if (userReview && showReviewForm) {
      setRating(userReview.rating);
      setComment(userReview.comment || '');
    }
  }, [userReview, showReviewForm]);

  const renderStars = (value: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (interactive ? (hoverRating || rating) : value)
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('education.course.reviews')}</CardTitle>
          {isEnrolled && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              variant="outline"
              size="sm"
            >
              {userReview ? 'Edit Review' : 'Write a Review'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Form */}
        {showReviewForm && (
          <div className="space-y-4 p-4 glass rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              {renderStars(rating, true)}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Review (Optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this course..."
                className="glass min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={submitReview.isPending || rating === 0}
                className="btn-primary"
              >
                {submitReview.isPending ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
              </Button>
              <Button
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(userReview?.rating || 0);
                  setComment(userReview?.comment || '');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => {
              // Only show user_id indicator if it's the current user's review (privacy protection)
              const isOwnReview = user?.id === review.user_id;
              const displayInitial = isOwnReview 
                ? review.user_id.substring(0, 2).toUpperCase()
                : 'U'; // Generic initial for other users
              
              return (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {displayInitial}
                      </div>
                      <div>
                        {renderStars(review.rating)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                          {isOwnReview && <span className="ml-2 text-accent">(Your review)</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground ml-13">
                      {review.comment}
                    </p>
                  )}
                  <Separator className="bg-white/10" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No reviews yet. Be the first to review this course!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
