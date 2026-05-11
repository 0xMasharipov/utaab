import { useState, useMemo } from 'react';
import { CertNav } from '@/components/admin/cert/CertNav';
import { useCertEvents, useCertParticipants, useCertRecords } from '@/hooks/useCertData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Upload } from 'lucide-react';
import { buildSerial, defaultPrefix } from '@/lib/serial';
import { hashSerial, hashEvent, hashIssuedBy, toDbHex } from '@/lib/certHash';

async function createDraftCertForParticipant(eventId: string, participantId: string) {
  const { data: ev } = await supabase.from('cert_events').select('*').eq('id', eventId).maybeSingle();
  if (!ev) throw new Error('Event not found');
  const { count } = await supabase
    .from('cert_records').select('id', { count: 'exact', head: true }).eq('event_id', eventId);
  const year = ev.event_date ? new Date(ev.event_date).getFullYear() : new Date().getFullYear();
  const prefix = ev.serial_prefix || defaultPrefix(ev.event_code);
  const serial = buildSerial(prefix, year, (count ?? 0) + 1);
  const serial_hash = toDbHex(hashSerial(serial));
  const event_hash = toDbHex(hashEvent(ev.event_name, ev.event_date ?? '', ev.speaker_name ?? ''));
  const issued_by_hash = toDbHex(hashIssuedBy(ev.issued_by));
  const { error } = await supabase.from('cert_records').insert({
    event_id: eventId,
    participant_id: participantId,
    serial_number: serial,
    serial_hash,
    event_hash,
    issued_by_hash,
    status: 'draft',
  });
  if (error) throw error;
}

export default function CertParticipants() {
  const { data: events } = useCertEvents();
  const [eventId, setEventId] = useState<string>('all');
  const filterId = eventId === 'all' ? undefined : eventId;
  const { data: parts, isLoading } = useCertParticipants(filterId);
  const { data: records } = useCertRecords(filterId);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [form, setForm] = useState({ event_id: '', full_name: '', email: '', phone: '', notes: '' });
  const [csvText, setCsvText] = useState('full_name,email,phone\n');

  const recordsByPart = useMemo(() => {
    const m = new Map<string, any>();
    (records ?? []).forEach((r: any) => { if (r.participant_id) m.set(r.participant_id, r); });
    return m;
  }, [records]);

  const add = async () => {
    if (!form.event_id || !form.full_name) { toast.error('Event and name required'); return; }
    const { data, error } = await supabase
      .from('cert_participants')
      .insert({ event_id: form.event_id, full_name: form.full_name, email: form.email || null, phone: form.phone || null, notes: form.notes || null })
      .select().single();
    if (error) return toast.error(error.message);
    try { await createDraftCertForParticipant(form.event_id, data.id); }
    catch (e: any) { toast.error('Created participant but failed cert: ' + e.message); }
    toast.success('Participant added');
    qc.invalidateQueries({ queryKey: ['cert_participants'] });
    qc.invalidateQueries({ queryKey: ['cert_records'] });
    setOpen(false);
    setForm({ event_id: form.event_id, full_name: '', email: '', phone: '', notes: '' });
  };

  const importCsv = async () => {
    if (!form.event_id) { toast.error('Select event first'); return; }
    const lines = csvText.split(/\r?\n/).filter(Boolean);
    const header = lines.shift()!.split(',').map((s) => s.trim().toLowerCase());
    const idx = (k: string) => header.indexOf(k);
    let ok = 0, fail = 0;
    for (const line of lines) {
      const cells = line.split(',').map((s) => s.trim());
      const full_name = cells[idx('full_name')] || cells[idx('name')];
      if (!full_name) { fail++; continue; }
      const email = idx('email') >= 0 ? cells[idx('email')] || null : null;
      const phone = idx('phone') >= 0 ? cells[idx('phone')] || null : null;
      const { data, error } = await supabase
        .from('cert_participants')
        .insert({ event_id: form.event_id, full_name, email, phone })
        .select().single();
      if (error) { fail++; continue; }
      try { await createDraftCertForParticipant(form.event_id, data.id); ok++; } catch { fail++; }
    }
    toast.success(`Imported ${ok}, failed ${fail}`);
    qc.invalidateQueries({ queryKey: ['cert_participants'] });
    qc.invalidateQueries({ queryKey: ['cert_records'] });
    setCsvOpen(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete participant? Their certificate record will also be removed.')) return;
    await supabase.from('cert_records').delete().eq('participant_id', id);
    const { error } = await supabase.from('cert_participants').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['cert_participants'] });
    qc.invalidateQueries({ queryKey: ['cert_records'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Participants</h1>
          <p className="text-muted-foreground mt-1">Each new participant auto-creates a draft certificate.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setForm({ ...form, event_id: filterId || form.event_id }); setCsvOpen(true); }}>
            <Upload className="h-4 w-4 mr-2" /> CSV import
          </Button>
          <Button onClick={() => { setForm({ ...form, event_id: filterId || form.event_id }); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add participant
          </Button>
        </div>
      </div>
      <CertNav />

      <Card className="p-4 glass-section border-white/10">
        <div className="flex items-center gap-3 flex-wrap">
          <Label className="text-sm">Event:</Label>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger className="w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              {(events ?? []).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.event_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-6 glass-section border-white/10 overflow-x-auto">
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Name</th><th>Email</th><th>Phone</th><th>Serial</th><th></th></tr>
            </thead>
            <tbody>
              {(parts ?? []).map((p: any) => {
                const r = recordsByPart.get(p.id);
                return (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="py-2 font-medium">{p.full_name}</td>
                    <td className="text-muted-foreground">{p.email || '—'}</td>
                    <td className="text-muted-foreground">{p.phone || '—'}</td>
                    <td className="font-mono text-xs">{r?.serial_number ?? '—'}</td>
                    <td className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                );
              })}
              {(parts ?? []).length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No participants.</td></tr>}
            </tbody>
          </table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add participant</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Event</Label>
              <Select value={form.event_id} onValueChange={(v) => setForm({ ...form, event_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pick event" /></SelectTrigger>
                <SelectContent>
                  {(events ?? []).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.event_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Full name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={add}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={csvOpen} onOpenChange={setCsvOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>CSV import</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Event</Label>
              <Select value={form.event_id} onValueChange={(v) => setForm({ ...form, event_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pick event" /></SelectTrigger>
                <SelectContent>
                  {(events ?? []).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.event_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>CSV (header: full_name,email,phone)</Label>
              <Textarea rows={10} value={csvText} onChange={(e) => setCsvText(e.target.value)} className="font-mono text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCsvOpen(false)}>Cancel</Button>
            <Button onClick={importCsv}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
