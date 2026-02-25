import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from '../../hooks/useAdminQueries';
import type { Testimonial } from '../../backend';

const EMPTY_FORM = { author: '', quote: '', date: new Date().toISOString().split('T')[0] };

export default function TestimonialsManager() {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: Testimonial & { id: string }) => {
    setEditingId(item.id);
    setForm({
      author: item.author,
      quote: item.quote,
      date: new Date(Number(item.date) / 1_000_000).toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const testimonial: Testimonial = {
      author: form.author,
      quote: form.quote,
      date: BigInt(new Date(form.date).getTime()) * 1_000_000n,
    };
    const id = editingId ?? `test-${Date.now()}`;
    if (editingId) {
      await updateMutation.mutateAsync({ id, testimonial });
    } else {
      await createMutation.mutateAsync({ id, testimonial });
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{testimonials.length} testimonial(s) on record</p>
        <Button
          size="sm"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-ethereal hover:bg-ethereal/90 text-background"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Testimonial
        </Button>
      </div>

      {showForm && (
        <Card className="border-ethereal/30 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-heading text-ethereal">
              {editingId ? 'Edit Testimonial' : 'New Testimonial'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author Name</Label>
                  <Input
                    value={form.author}
                    onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    placeholder="John Doe"
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
              </div>
              <div className="space-y-2">
                <Label>Quote / Testimonial</Label>
                <Textarea
                  value={form.quote}
                  onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                  placeholder="Their experience with our team..."
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
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No testimonials yet. Add your first one above.
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((item) => (
            <Card key={item.id} className="border-border/50 bg-card/40 hover:border-ethereal/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Quote className="h-4 w-4 text-ethereal flex-shrink-0" />
                      <span className="font-heading font-semibold text-foreground">{item.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(Number(item.date) / 1_000_000).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground italic line-clamp-2">"{item.quote}"</p>
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
