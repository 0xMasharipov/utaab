import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Check, Trash2 } from 'lucide-react';

interface ProfileNotificationsProps {
  userId: string;
}

export default function ProfileNotifications({ userId }: ProfileNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      toast.error('Failed to load notifications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      fetchNotifications();
    } catch (error: any) {
      toast.error('Failed to mark as read: ' + error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error: any) {
      toast.error('Failed to mark all as read: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <Card className="glass-panel p-12 text-center">
        <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No notifications</h3>
        <p className="text-muted-foreground">
          You're all caught up!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Notifications</h2>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead} className="gap-2">
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`glass-panel p-6 ${!notification.read ? 'border-primary/50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{notification.title}</h3>
                  {!notification.read && <Badge variant="default">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
