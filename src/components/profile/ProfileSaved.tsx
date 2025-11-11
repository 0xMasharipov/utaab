import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bookmark, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileSavedProps {
  userId: string;
}

export default function ProfileSaved({ userId }: ProfileSavedProps) {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedItems();
  }, [userId]);

  const fetchSavedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems(data || []);
    } catch (error: any) {
      toast.error('Failed to load saved items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item removed');
      fetchSavedItems();
    } catch (error: any) {
      toast.error('Failed to remove item: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (savedItems.length === 0) {
    return (
      <Card className="glass-panel p-12 text-center">
        <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No saved items</h3>
        <p className="text-muted-foreground">
          Bookmark courses and resources to access them quickly
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Saved Items</h2>
        <p className="text-muted-foreground">Your bookmarked content</p>
      </div>

      <div className="space-y-4">
        {savedItems.map((item) => (
          <Card key={item.id} className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">{item.item_type}</h3>
                <p className="text-sm text-muted-foreground">
                  Saved {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
