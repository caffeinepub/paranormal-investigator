import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useInvestigations,
  useCreateInvestigation,
  useUpdateInvestigation,
  useDeleteInvestigation,
} from '../../hooks/useAdminQueries';
import type { Investigation } from '../../backend';

const EMPTY_FORM: Omit<Investigation, 'date'> & { date: string } = {
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  status: 'Active',
};

export default function InvestigationsManager() {
  const { data: investigations = [], isLoading } = useInvestigations();
  const createMutation = useCreateInvestigation();
  const updateMutation = useUpdateInvestigation();
  const deleteMutation = useDeleteInvestigation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: Investigation & { id: string }) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      date: new Date(Number(item.date) / 1_000_000).toISOString().split('T')[0],
      location: item.location,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const investigation: Investigation = {
      title: form.title,
      description: form.description,
      date: BigInt(new Date(form.date).getTime()) * 1_000_000n,
      location: form.location,
      status: form.status,
    };
    const id = editingId ?? `inv-${Date.now()}`;
    if (editingId) {
      await updateMutation.mutateAsync({ id, investigation });
    } else {
      await createMutation.mutateAsync({ id, investigation });
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this investigation?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const statusColor: Record<string, string> = {
    Active: 'border-ethereal/40 bg-ethereal/10 text-ethereal',
    Closed: 'border-border/50 bg-muted/30 text-muted-foreground',
    Pending: 'border-spectral/40 bg-spectral/10 text-spectral',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{investigations.length} investigation(s) on record</p>
        <Button
          size="sm"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-ethereal hover:bg-ethereal/90 text-background"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Investigation
        </Button>
      </div>

      {showForm && (
        <Card className="border-ethereal/30 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-heading text-ethereal">
              {editingId ? 'Edit Investigation' : 'New Investigation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Investigation title"
                    required
                    className="bg-background/50 border-border/60 focus:border-ethereal/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Oklahoma City, OK"
                    required
                    className="bg-background/50 border-border/60 focus:border-ethereal/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    required
                    className="bg-background/50 border-border/60 focus:border-ethereal/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger className="bg-background/50 border-border/60 focus:border-ethereal/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the investigation..."
                  rows={3}
                  required
                  className="bg-background/50 border-border/60 focus:border-ethereal/60"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={resetForm} disabled={isSaving}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button type="submit" className="bg-ethereal hover:bg-ethereal/90 text-background" disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-ethereal" />
        </div>
      ) : investigations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No investigations yet. Add your first one above.
        </div>
      ) : (
        <div className="space-y-3">
          {investigations.map((item) => (
            <Card key={item.id} className="border-border/50 bg-card/40 hover:border-ethereal/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-semibold text-foreground truncate">{item.title}</h3>
                      <Badge variant="outline" className={statusColor[item.status] ?? 'border-border/50'}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.location} · {new Date(Number(item.date) / 1_000_000).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} className="h-8 w-8 hover:text-ethereal">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 hover:text-destructive"
                    >
                      {deleteMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
