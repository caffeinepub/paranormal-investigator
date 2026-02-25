import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
} from '../../hooks/useAdminQueries';
import type { TeamMember } from '../../backend';

const EMPTY_FORM = { name: '', role: '', bio: '' };

export default function TeamManager() {
  const { data: members = [], isLoading } = useTeamMembers();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: TeamMember & { id: string }) => {
    setEditingId(item.id);
    setForm({ name: item.name, role: item.role, bio: item.bio });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const member: TeamMember = { name: form.name, role: form.role, bio: form.bio };
    const id = editingId ?? `member-${Date.now()}`;
    if (editingId) {
      await updateMutation.mutateAsync({ id, member });
    } else {
      await createMutation.mutateAsync({ id, member });
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{members.length} team member(s) on record</p>
        <Button
          size="sm"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-ethereal hover:bg-ethereal/90 text-background"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Member
        </Button>
      </div>

      {showForm && (
        <Card className="border-ethereal/30 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-heading text-ethereal">
              {editingId ? 'Edit Team Member' : 'New Team Member'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Dr. Jane Smith"
                    required
                    className="bg-background/50 border-border/60 focus:border-ethereal/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role / Title</Label>
                  <Input
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Lead Investigator"
                    required
                    className="bg-background/50 border-border/60 focus:border-ethereal/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Brief biography and expertise..."
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
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No team members yet. Add your first one above.
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((item) => (
            <Card key={item.id} className="border-border/50 bg-card/40 hover:border-ethereal/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-ethereal/10 border border-ethereal/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-ethereal" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-semibold text-foreground">{item.name}</span>
                        <span className="text-xs text-ethereal bg-ethereal/10 px-2 py-0.5 rounded-full">{item.role}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.bio}</p>
                    </div>
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
