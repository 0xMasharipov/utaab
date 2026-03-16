import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, ChevronUp, GitMerge } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminContributorAssessments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['admin-contributor-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributor_assessments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = assessments?.filter((a) =>
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getResult = (item: any) => {
    try {
      return item.ai_result as any;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contributor Assessments</h1>
        <p className="text-muted-foreground">View AI-matched contributor results</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <Card className="glass-panel">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading assessments...</p>
          </CardContent>
        </Card>
      ) : filtered && filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => {
            const result = getResult(item);
            const isExpanded = expandedId === item.id;
            const primaryRole = result?.primaryRole || result?.primary_role || 'N/A';
            const matchScore = result?.matchScore || result?.match_score || result?.score || null;

            return (
              <Card key={item.id} className="glass-panel overflow-hidden">
                <CardContent className="p-0">
                  <button
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors text-left"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.full_name}</p>
                        <p className="text-sm text-muted-foreground truncate">{item.email}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-3">
                        <Badge variant="outline">{primaryRole}</Badge>
                        {matchScore && (
                          <Badge className="bg-primary/20 text-primary border-0">
                            {matchScore}%
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </button>

                  {isExpanded && result && (
                    <div className="border-t border-border/50 p-4 space-y-4 bg-muted/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.summary && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Profile Summary</h4>
                            <p className="text-sm text-muted-foreground">{result.summary}</p>
                          </div>
                        )}
                        {result.secondaryRole && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Secondary Role</h4>
                            <Badge variant="secondary">{result.secondaryRole}</Badge>
                          </div>
                        )}
                        {result.strengths && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Strengths</h4>
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray(result.strengths) ? result.strengths : [result.strengths]).map((s: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {result.growthPaths && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Growth Paths</h4>
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray(result.growthPaths) ? result.growthPaths : [result.growthPaths]).map((g: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">{g}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {item.form_data && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            Raw Form Data
                          </summary>
                          <pre className="mt-2 p-3 rounded-lg bg-muted/20 overflow-auto max-h-48 text-muted-foreground">
                            {JSON.stringify(item.form_data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass-panel">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
            <p className="text-muted-foreground">
              Contributor assessments will appear here once submitted
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
