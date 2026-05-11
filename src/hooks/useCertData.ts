import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCertEvents() {
  return useQuery({
    queryKey: ['cert_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cert_events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCertParticipants(eventId?: string) {
  return useQuery({
    queryKey: ['cert_participants', eventId ?? 'all'],
    queryFn: async () => {
      let q = supabase.from('cert_participants').select('*').order('created_at', { ascending: false });
      if (eventId) q = q.eq('event_id', eventId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCertRecords(eventId?: string) {
  return useQuery({
    queryKey: ['cert_records', eventId ?? 'all'],
    queryFn: async () => {
      let q = supabase.from('cert_records').select('*').order('created_at', { ascending: false });
      if (eventId) q = q.eq('event_id', eventId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCertTemplates() {
  return useQuery({
    queryKey: ['cert_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cert_templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCertStats() {
  return useQuery({
    queryKey: ['cert_stats'],
    queryFn: async () => {
      const [events, parts, records] = await Promise.all([
        supabase.from('cert_events').select('id', { count: 'exact', head: true }),
        supabase.from('cert_participants').select('id', { count: 'exact', head: true }),
        supabase.from('cert_records').select('status'),
      ]);
      const drafts = records.data?.filter((r: any) => r.status === 'draft').length ?? 0;
      const issued = records.data?.filter((r: any) => r.status === 'issued').length ?? 0;
      const revoked = records.data?.filter((r: any) => r.status === 'revoked').length ?? 0;
      return {
        events: events.count ?? 0,
        participants: parts.count ?? 0,
        drafts,
        issued,
        revoked,
        total: records.data?.length ?? 0,
      };
    },
  });
}
