import { useEffect, useState } from 'react';
import { MapPin, AlertTriangle, Send, CheckCircle, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActor } from '../hooks/useActor';
import { ExternalBlob } from '../backend';
import { useAnalytics } from '../hooks/useAnalytics';

const PHENOMENA_TYPES = [
  'Apparitions / Visual Phenomena',
  'Unexplained Sounds / EVP',
  'Moving Objects / Poltergeist',
  'Electromagnetic Anomalies',
  'Temperature Fluctuations',
  'Shadow Figures',
  'Other',
];

interface FormState {
  location: string;
  phenomenaType: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  photo: File | null;
}

const EMPTY_FORM: FormState = {
  location: '',
  phenomenaType: '',
  description: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  photo: null,
};

export default function SubmitCase() {
  const { trackPageVisit, trackFormSubmission } = useAnalytics();
  const { actor, isFetching: actorLoading } = useActor();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    trackPageVisit('SubmitCase');
    // Reset any stale error state on mount
    setError('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm(f => ({ ...f, photo: file }));
  };

  const handleFieldChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!form.location.trim()) { setError('Please enter the Oklahoma location.'); return; }
    if (!form.phenomenaType) { setError('Please select the type of phenomena.'); return; }
    if (!form.description.trim()) { setError('Please describe what you experienced.'); return; }
    if (!form.contactName.trim()) { setError('Please enter your name.'); return; }
    if (!form.contactEmail.trim()) { setError('Please enter your email address.'); return; }

    // If actor is still loading, wait — don't show an error yet
    if (actorLoading) {
      setError('Still connecting to the backend. Please wait a moment and try again.');
      return;
    }

    if (!actor) {
      setError('Unable to connect to the backend. Please refresh the page and try again.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const contactInfo = [
        form.contactName.trim(),
        form.contactEmail.trim(),
        form.contactPhone.trim() ? form.contactPhone.trim() : null,
      ].filter(Boolean).join(' | ');

      let photoBlob: ExternalBlob | null = null;
      if (form.photo) {
        const arrayBuffer = await form.photo.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
      }

      await actor.submitCase(
        form.location.trim(),
        form.phenomenaType,
        form.description.trim(),
        contactInfo,
        photoBlob,
        form.contactEmail.trim().toLowerCase(),
      );

      trackFormSubmission('case_submission');
      setSubmitted(true);
      setError('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Case submission error:', message);
      setError('Something went wrong. Please try again or contact us directly by email.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-ethereal/10 border border-ethereal/20 shadow-glow">
            <CheckCircle className="h-10 w-10 text-ethereal" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">Case Submitted!</h2>
          <p className="text-muted-foreground leading-relaxed">
            Thank you for reaching out. Our Oklahoma team will review your case and contact you within 48 hours.
          </p>
          <Button
            onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); setError(''); }}
            variant="outline"
            className="border-ethereal/40 hover:bg-ethereal/10 hover:border-ethereal/60"
          >
            Submit Another Case
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 lg:px-6 py-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10 space-y-4">
        <Badge variant="outline" className="border-ethereal/40 bg-ethereal/10 text-ethereal">
          <Send className="h-3 w-3 mr-2" />
          Case Submission
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold">
          Submit Your <span className="text-ethereal">Case</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Experiencing unexplained phenomena in Oklahoma? Share the details and our team will review your case.
        </p>
      </div>

      {/* Oklahoma Notice */}
      <Alert className="mb-8 border-ethereal/30 bg-ethereal/5">
        <MapPin className="h-4 w-4 text-ethereal" />
        <AlertDescription className="text-sm">
          <strong className="text-foreground">Oklahoma Investigations Only.</strong>{' '}
          We exclusively investigate paranormal phenomena within the state of Oklahoma. Please ensure your location is within Oklahoma before submitting.
        </AlertDescription>
      </Alert>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Case Details</CardTitle>
          <CardDescription>All information is kept strictly confidential.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Only show error when there is one (never on initial load) */}
          {error && (
            <Alert variant="destructive" className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Oklahoma Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  id="location"
                  value={form.location}
                  onChange={e => handleFieldChange('location', e.target.value)}
                  placeholder="City, County, or Address in Oklahoma"
                  className="pl-10 bg-background border-border/60 focus:border-ethereal/60 text-foreground placeholder:text-muted-foreground"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Phenomena Type */}
            <div className="space-y-2">
              <Label>
                Type of Phenomena <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.phenomenaType}
                onValueChange={v => handleFieldChange('phenomenaType', v)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-background border-border/60 focus:border-ethereal/60 text-foreground">
                  <SelectValue placeholder="Select phenomena type" />
                </SelectTrigger>
                <SelectContent>
                  {PHENOMENA_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={e => handleFieldChange('description', e.target.value)}
                placeholder="Describe what you experienced in as much detail as possible. Include dates, times, frequency, and any witnesses..."
                rows={5}
                className="bg-background border-border/60 focus:border-ethereal/60 resize-none text-foreground placeholder:text-muted-foreground"
                disabled={isSubmitting}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-foreground">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactName"
                    value={form.contactName}
                    onChange={e => handleFieldChange('contactName', e.target.value)}
                    placeholder="Your name"
                    className="bg-background border-border/60 focus:border-ethereal/60 text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={e => handleFieldChange('contactEmail', e.target.value)}
                    placeholder="your@email.com"
                    className="bg-background border-border/60 focus:border-ethereal/60 text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contactPhone">Phone Number (optional)</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={form.contactPhone}
                    onChange={e => handleFieldChange('contactPhone', e.target.value)}
                    placeholder="(555) 000-0000"
                    className="bg-background border-border/60 focus:border-ethereal/60 text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Photo Evidence (optional)</Label>
              {form.photo ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-ethereal/30 bg-ethereal/5">
                  <Upload className="h-4 w-4 text-ethereal flex-shrink-0" />
                  <span className="text-sm text-foreground flex-1 truncate">{form.photo.name}</span>
                  {isSubmitting && uploadProgress > 0 && (
                    <span className="text-xs text-ethereal">{uploadProgress}%</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, photo: null }))}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-border/60 hover:border-ethereal/40 bg-background/30 hover:bg-ethereal/5 transition-all cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload a photo</span>
                  <span className="text-xs text-muted-foreground/60">PNG, JPG, GIF up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-ethereal hover:bg-ethereal/90 text-background font-semibold shadow-glow hover:shadow-glow-lg transition-all py-6 text-base"
              disabled={isSubmitting || actorLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Submitting Case...'}
                </>
              ) : actorLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Case
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
