import { useState } from 'react';
import { CertNav } from '@/components/admin/cert/CertNav';
import { useCertTemplates } from '@/hooks/useCertData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const empty = {
  id: '', template_name: '', title_text: 'Certificate of Participation',
  body_text: '', signature_text: '', footer_text: '',
  background_color: '#061A3A', primary_color: '#FFFFFF', secondary_color: '#2D8CFF',
  show_qr: true,
};

export default function CertTemplates() {
  const { data, isLoading } = useCertTemplates();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const save = async () => {
    if (!form.template_name) return toast.error('Name required');
    const payload: any = { ...form }; const id = payload.id; delete payload.id;
    const { error } = id
      ? await supabase.from('cert_templates').update(payload).eq('id', id)
      : await supabase.from('cert_templates').insert(payload);
    if (error) return toast.error(error.message);
    toast.success('Saved');
    qc.invalidateQueries({ queryKey: ['cert_templates'] });
    setOpen(false); setForm(empty);
  };
  const del = async (id: string) => {
    if (!confirm('Delete template?')) return;
    const { error } = await supabase.from('cert_templates').delete().eq('id', id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ['cert_templates'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Templates</h1>
          <p className="text-muted-foreground mt-1">Visual & text templates used when generating certificate PDFs.</p>
        </div>
        <Button onClick={() => { setForm(empty); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> New template</Button>
      </div>
      <CertNav />

      <Card className="p-6 glass-section border-white/10 overflow-x-auto">
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr><th className="py-2">Name</th><th>Title</th><th>Colors</th><th></th></tr></thead>
            <tbody>
              {(data ?? []).map((t: any) => (
                <tr key={t.id} className="border-t border-white/5">
                  <td className="py-2 font-medium">{t.template_name}</td>
                  <td className="text-muted-foreground">{t.title_text}</td>
                  <td className="flex gap-2 py-2">
                    <span className="w-5 h-5 rounded" style={{ background: t.background_color }} />
                    <span className="w-5 h-5 rounded" style={{ background: t.primary_color }} />
                    <span className="w-5 h-5 rounded" style={{ background: t.secondary_color }} />
                  </td>
                  <td className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => { setForm({ ...empty, ...t }); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => del(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {(data ?? []).length === 0 && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No templates yet.</td></tr>}
            </tbody>
          </table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? 'Edit template' : 'New template'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Name</Label><Input value={form.template_name} onChange={(e) => setForm({ ...form, template_name: e.target.value })} /></div>
            <div className="col-span-2"><Label>Title text</Label><Input value={form.title_text} onChange={(e) => setForm({ ...form, title_text: e.target.value })} /></div>
            <div className="col-span-2"><Label>Body text</Label><Textarea rows={3} value={form.body_text ?? ''} onChange={(e) => setForm({ ...form, body_text: e.target.value })} /></div>
            <div className="col-span-2"><Label>Signature text</Label><Input value={form.signature_text ?? ''} onChange={(e) => setForm({ ...form, signature_text: e.target.value })} /></div>
            <div className="col-span-2"><Label>Footer text</Label><Input value={form.footer_text ?? ''} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} /></div>
            <div><Label>Background</Label><Input type="color" value={form.background_color} onChange={(e) => setForm({ ...form, background_color: e.target.value })} /></div>
            <div><Label>Primary</Label><Input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} /></div>
            <div><Label>Secondary</Label><Input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
