import { useState } from 'react';
import { CertNav } from '@/components/admin/cert/CertNav';
import { useCertEvents, useCertTemplates } from '@/hooks/useCertData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { buildEventCode, defaultPrefix } from '@/lib/serial';

const empty = {
  id: '',
  event_name: '',
  event_slug: '',
  event_code: '',
  event_type: 'Seminar',
  speaker_name: '',
  event_date: '',
  start_time: '',
  end_time: '',
  location: '',
  description: '',
  issued_by: 'UTAAB',
  organizer: 'UTAAB',
  partners: '' as string,
  certificate_title: 'Certificate of Participation',
  certificate_description: '',
  template_id: null as string | null,
  serial_prefix: '',
  status: 'draft',
};

export default function CertEvents() {
  const { data: events, isLoading } = useCertEvents();
  const { data: templates } = useCertTemplates();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const editing = !!form.id;

  const reset = () => setForm(empty);
  const onName = (v: string) => {
    const code = buildEventCode(v);
    setForm((f) => ({
      ...f,
      event_name: v,
      event_code: f.event_code || code,
      event_slug: f.event_slug || v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      serial_prefix: f.serial_prefix || defaultPrefix(code),
    }));
  };

  const save = async () => {
    if (!form.event_name || !form.event_slug || !form.event_code) {
      toast.error('Name, slug and code are required'); return;
    }
    const payload: any = {
      event_name: form.event_name,
      event_slug: form.event_slug,
      event_code: form.event_code.toUpperCase(),
      event_type: form.event_type,
      speaker_name: form.speaker_name || null,
      event_date: form.event_date || null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      location: form.location || null,
      description: form.description || null,
      issued_by: form.issued_by || 'UTAAB',
      organizer: form.organizer || null,
      partners: form.partners ? form.partners.split(',').map((s) => s.trim()).filter(Boolean) : [],
      certificate_title: form.certificate_title,
      certificate_description: form.certificate_description || null,
      template_id: form.template_id || null,
      serial_prefix: form.serial_prefix || defaultPrefix(form.event_code),
      status: form.status,
    };
    const { error } = editing
      ? await supabase.from('cert_events').update(payload).eq('id', form.id)
      : await supabase.from('cert_events').insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? 'Event updated' : 'Event created');
    qc.invalidateQueries({ queryKey: ['cert_events'] });
    setOpen(false); reset();
  };

  const edit = (e: any) => {
    setForm({
      ...empty,
      ...e,
      event_date: e.event_date ?? '',
      start_time: e.start_time ?? '',
      end_time: e.end_time ?? '',
      partners: (e.partners ?? []).join(', '),
      template_id: e.template_id ?? null,
    });
    setOpen(true);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this event? Linked participants and certificates will remain but orphaned.')) return;
    const { error } = await supabase.from('cert_events').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Event deleted');
    qc.invalidateQueries({ queryKey: ['cert_events'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Events</h1>
          <p className="text-muted-foreground mt-1">Seminars, workshops & bootcamps that issue certificates.</p>
        </div>
        <Button onClick={() => { reset(); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New event
        </Button>
      </div>
      <CertNav />

      <Card className="p-6 glass-section border-white/10 overflow-x-auto">
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Name</th><th>Code</th><th>Date</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {(events ?? []).map((e: any) => (
                <tr key={e.id} className="border-t border-white/5">
                  <td className="py-2 font-medium">{e.event_name}<div className="text-xs text-muted-foreground">{e.speaker_name}</div></td>
                  <td className="font-mono">{e.event_code}</td>
                  <td className="text-muted-foreground">{e.event_date ?? '—'}</td>
                  <td><span className="px-2 py-1 rounded-full text-xs bg-white/5">{e.status}</span></td>
                  <td className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => edit(e)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => del(e.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {(events ?? []).length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No events yet.</td></tr>}
            </tbody>
          </table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit event' : 'New event'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Event name</Label>
              <Input value={form.event_name} onChange={(e) => onName(e.target.value)} />
            </div>
            <div><Label>Event code</Label><Input value={form.event_code} onChange={(e) => setForm({ ...form, event_code: e.target.value.toUpperCase() })} /></div>
            <div><Label>Slug</Label><Input value={form.event_slug} onChange={(e) => setForm({ ...form, event_slug: e.target.value })} /></div>
            <div><Label>Type</Label><Input value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} /></div>
            <div><Label>Speaker</Label><Input value={form.speaker_name} onChange={(e) => setForm({ ...form, speaker_name: e.target.value })} /></div>
            <div><Label>Date</Label><Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Start</Label><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
              <div><Label>End</Label><Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
            </div>
            <div className="col-span-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><Label>Issued by</Label><Input value={form.issued_by} onChange={(e) => setForm({ ...form, issued_by: e.target.value })} /></div>
            <div><Label>Organizer</Label><Input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} /></div>
            <div className="col-span-2"><Label>Partners (comma-separated)</Label><Input value={form.partners} onChange={(e) => setForm({ ...form, partners: e.target.value })} /></div>
            <div><Label>Certificate title</Label><Input value={form.certificate_title} onChange={(e) => setForm({ ...form, certificate_title: e.target.value })} /></div>
            <div><Label>Serial prefix</Label><Input value={form.serial_prefix} onChange={(e) => setForm({ ...form, serial_prefix: e.target.value })} /></div>
            <div>
              <Label>Template</Label>
              <Select value={form.template_id ?? '__none'} onValueChange={(v) => setForm({ ...form, template_id: v === '__none' ? null : v })}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {(templates ?? []).map((t: any) => <SelectItem key={t.id} value={t.id}>{t.template_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save changes' : 'Create event'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
