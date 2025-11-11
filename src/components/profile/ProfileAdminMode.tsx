import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Shield, Upload, Megaphone, MessageSquare, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfileAdminModeProps {
  userId: string;
}

export default function ProfileAdminMode({ userId }: ProfileAdminModeProps) {
  return (
    <div className="space-y-6">
      <Alert className="glass-panel border-primary/50">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>Root Admin Mode:</strong> You have access to embedded admin tools within your profile.
        </AlertDescription>
      </Alert>

      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Tools</h2>
        <p className="text-muted-foreground">Quick access to administrative functions</p>
      </div>

      <Tabs defaultValue="uploads" className="space-y-6">
        <TabsList className="glass-panel">
          <TabsTrigger value="uploads" className="gap-2">
            <Upload className="h-4 w-4" />
            Quick Uploads
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="uploads">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Uploads</h3>
            <p className="text-muted-foreground">
              Upload media files quickly without navigating to the full media library.
            </p>
            {/* Upload functionality would go here */}
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Announcements</h3>
            <p className="text-muted-foreground">
              Create and manage announcements directly from your profile.
            </p>
            {/* Announcement creation form would go here */}
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">User Messages</h3>
            <p className="text-muted-foreground">
              Respond to user inquiries and support requests.
            </p>
            {/* Message management would go here */}
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-muted-foreground">
              View recent administrative actions and system events (read-only).
            </p>
            {/* Audit log display would go here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
