import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Globe, Megaphone, Save } from "lucide-react";

export default function AdminSiteContent() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [selectedLocale, setSelectedLocale] = useState(i18n.language);

  const { data: messages, refetch } = useQuery({
    queryKey: ['site-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_messages')
        .select('*')
        .order('category', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSaveMessage = async (messageId: string, content: Record<string, string>) => {
    try {
      const { error } = await supabase
        .from('site_messages')
        .update(content)
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: t("common.success"),
        description: "Content updated successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const groupedMessages = messages?.reduce((acc, msg) => {
    const category = msg.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Content</h1>
        <p className="text-muted-foreground">Manage site-wide content, messages, and announcements</p>
      </div>

      <div className="flex items-center gap-4">
        <Label>Language:</Label>
        <Select value={selectedLocale} onValueChange={setSelectedLocale}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="tr">Türkçe</SelectItem>
            <SelectItem value="ru">Русский</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">
            <FileText className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="pages">
            <Globe className="mr-2 h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Megaphone className="mr-2 h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          {Object.entries(groupedMessages || {}).map(([category, msgs]) => (
            <Card key={category} className="glass-card">
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
                <CardDescription>
                  Manage {category} content across all languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {msgs?.map((msg) => {
                  const contentKey = `content_${selectedLocale}` as keyof typeof msg;
                  const content = msg[contentKey] as string || '';

                  return (
                    <div key={msg.id} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold">{msg.message_key}</Label>
                        <Badge variant="outline">{msg.message_type}</Badge>
                      </div>
                      <Textarea
                        value={content}
                        onChange={(e) => {
                          // Update state would go here
                        }}
                        className="min-h-[100px]"
                        placeholder={`Enter ${selectedLocale.toUpperCase()} content...`}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveMessage(msg.id, { [contentKey]: content })}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pages">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Static Pages</CardTitle>
              <CardDescription>Manage About, Community, Resources pages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Page editor coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Announcements</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage site-wide announcements
              </p>
            </div>
            <Button>Create Announcement</Button>
          </div>

          <div className="grid gap-4">
            {announcements?.map((announcement) => {
              const titleKey = `title_${selectedLocale}` as keyof typeof announcement;
              const title = (announcement[titleKey] as string) || announcement.title_en;

              return (
                <Card key={announcement.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                          {announcement.visibility} • {announcement.delivery_channels?.join(', ')}
                        </CardDescription>
                      </div>
                      <Badge className={
                        announcement.visibility === 'published' 
                          ? 'bg-green-500/20 text-green-700' 
                          : 'bg-gray-500/20'
                      }>
                        {announcement.visibility}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Preview</Button>
                      {announcement.impressions && (
                        <span className="text-sm text-muted-foreground ml-auto">
                          {announcement.impressions} impressions • {announcement.clicks} clicks
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
