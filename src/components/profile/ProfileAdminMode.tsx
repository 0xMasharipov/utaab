import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Shield, Upload, Megaphone, MessageSquare, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

interface ProfileAdminModeProps {
  userId: string;
}

export default function ProfileAdminMode({ userId }: ProfileAdminModeProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Alert className="glass-panel border-primary/50">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>{t('profile.adminMode.rootAdminAlert')}</strong> {t('profile.adminMode.rootAdminDesc')}
        </AlertDescription>
      </Alert>

      <div>
        <h2 className="text-2xl font-bold mb-2">{t('profile.adminMode.adminTools')}</h2>
        <p className="text-muted-foreground">{t('profile.adminMode.adminToolsDesc')}</p>
      </div>

      <Tabs defaultValue="uploads" className="space-y-6">
        <TabsList className="glass-panel">
          <TabsTrigger value="uploads" className="gap-2">
            <Upload className="h-4 w-4" />
            {t('profile.adminMode.quickUploads')}
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            {t('profile.adminMode.announcements')}
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('profile.adminMode.messages')}
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('profile.adminMode.auditLog')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="uploads">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">{t('profile.adminMode.quickUploads')}</h3>
            <p className="text-muted-foreground">
              {t('profile.adminMode.quickUploadsDesc')}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">{t('profile.adminMode.announcements')}</h3>
            <p className="text-muted-foreground">
              {t('profile.adminMode.announcementsDesc')}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">{t('profile.adminMode.messages')}</h3>
            <p className="text-muted-foreground">
              {t('profile.adminMode.messagesDesc')}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">{t('profile.adminMode.auditLogTitle')}</h3>
            <p className="text-muted-foreground">
              {t('profile.adminMode.auditLogDesc')}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
