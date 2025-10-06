import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const AdminAuditLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-log', actionFilter, entityFilter],
    queryFn: async () => {
      let query = supabase.from('audit_log').select('*');
      
      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }
      
      if (entityFilter !== 'all') {
        query = query.eq('entity_type', entityFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
  });

  const filteredLogs = auditLogs?.filter((log) =>
    log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entity_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      create: 'bg-green-500/20 text-green-400 border-green-500/50',
      update: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      delete: 'bg-red-500/20 text-red-400 border-red-500/50',
      publish: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    };
    return colors[action] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">Track all administrative actions and changes</p>
        </div>
        <Button variant="outline" className="glass">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user or entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="publish">Publish</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="media">Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <div className="space-y-3">
        {isLoading ? (
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading audit log...</p>
            </CardContent>
          </Card>
        ) : filteredLogs && filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <Card key={log.id} className="glass hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline">{log.entity_type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                      </span>
                    </div>
                    <p className="text-sm mb-1">
                      <span className="font-medium">
                        {log.user_email 
                          ? `${log.user_email.substring(0, 3)}***@${log.user_email.split('@')[1]?.substring(0, 3)}***` 
                          : 'System'}
                      </span>
                      {' '}performed{' '}
                      <span className="font-medium">{log.action}</span>
                      {' '}on{' '}
                      <span className="font-medium">{log.entity_type}</span>
                      {log.entity_name && <span>: {log.entity_name}</span>}
                    </p>
                    {log.ip_address && (
                      <p className="text-xs text-muted-foreground">
                        IP: {String(log.ip_address).split('.').slice(0, 2).join('.')}.***.***.***
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No audit logs found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search filters' : 'Audit log entries will appear here'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
