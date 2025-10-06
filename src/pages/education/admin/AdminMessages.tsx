import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, MoreVertical, Edit, Trash2, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

export const AdminMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('static');

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages', activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_messages')
        .select('*')
        .eq('message_type', activeTab)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredMessages = messages?.filter((message) =>
    message.message_key?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Site Messages</h1>
          <p className="text-muted-foreground">Manage static content and broadcast messages</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Message
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass">
          <TabsTrigger value="static">Static Messages</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcasts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Search */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <div className="grid gap-4">
            {isLoading ? (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Loading messages...</p>
                </CardContent>
              </Card>
            ) : filteredMessages && filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <Card key={message.id} className="glass hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                            {message.message_key}
                          </code>
                          {message.is_published && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Published
                            </Badge>
                          )}
                          {message.category && (
                            <Badge variant="outline">{message.category}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {message.content_en}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>Version: {message.version}</span>
                          {activeTab === 'broadcast' && message.target_audience && (
                            <>
                              <span>•</span>
                              <span>Target: {message.target_audience}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try adjusting your search' : `Create your first ${activeTab} message`}
                  </p>
                  <Button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Message
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
