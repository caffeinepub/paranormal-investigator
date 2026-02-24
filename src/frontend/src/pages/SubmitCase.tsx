import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Upload, Loader2, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSubmitCase } from '@/hooks/useQueries';
import { PhenomenaType } from '@/backend';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

export default function SubmitCase() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [phenomenaType, setPhenomenaType] = useState<PhenomenaType | ''>('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const submitCaseMutation = useSubmitCase();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !phenomenaType || !description || !contactInfo) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let photoBlob: ExternalBlob | null = null;

      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const caseId = await submitCaseMutation.mutateAsync({
        location,
        phenomenaType: phenomenaType as PhenomenaType,
        description,
        contactInfo,
        photo: photoBlob,
      });

      toast.success('Oklahoma case submitted successfully!', {
        description: `Case ID: ${caseId}`,
      });

      // Reset form
      setLocation('');
      setPhenomenaType('');
      setDescription('');
      setContactInfo('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setUploadProgress(0);

      // Navigate to cases after a short delay
      setTimeout(() => {
        navigate({ to: '/cases' });
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit case', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Report <span className="text-ethereal">Oklahoma Paranormal Activity</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your Oklahoma experience with our investigation team. All submissions are reviewed and may be investigated based on the nature of the phenomena.
        </p>
      </div>

      {/* Oklahoma Only Notice */}
      <Alert className="mb-6 border-ethereal/30 bg-ethereal/5">
        <MapPin className="h-4 w-4 text-ethereal" />
        <AlertTitle className="text-ethereal">Oklahoma Cases Only</AlertTitle>
        <AlertDescription>
          We exclusively investigate paranormal activity within Oklahoma state boundaries. Please ensure your case location is within Oklahoma before submitting.
        </AlertDescription>
      </Alert>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Oklahoma Case Submission Form</CardTitle>
          <CardDescription>
            Provide detailed information about your paranormal experience in Oklahoma. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Location (Oklahoma) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g., Tulsa, OK or Oklahoma City, OK"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Please include city and state (must be in Oklahoma)
              </p>
            </div>

            {/* Phenomena Type */}
            <div className="space-y-2">
              <Label htmlFor="phenomenaType">
                Type of Phenomena <span className="text-destructive">*</span>
              </Label>
              <Select value={phenomenaType} onValueChange={(value) => setPhenomenaType(value as PhenomenaType)}>
                <SelectTrigger id="phenomenaType">
                  <SelectValue placeholder="Select phenomena type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PhenomenaType.apparitions}>Apparitions</SelectItem>
                  <SelectItem value={PhenomenaType.unexplainedSounds}>Unexplained Sounds</SelectItem>
                  <SelectItem value={PhenomenaType.movingObjects}>Moving Objects</SelectItem>
                  <SelectItem value={PhenomenaType.electromagneticAnomalies}>Electromagnetic Anomalies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Detailed Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your experience in detail. Include dates, times, frequency, and any patterns you've noticed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <Label htmlFor="contactInfo">
                Contact Information <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactInfo"
                type="email"
                placeholder="your.email@example.com"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to follow up on your Oklahoma case
              </p>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Photo Evidence (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="cursor-pointer"
                />
              </div>
              {photoPreview && (
                <div className="mt-4">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg border border-border/40"
                  />
                </div>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading: {uploadProgress}%
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-ethereal hover:bg-ethereal/90 text-background"
                disabled={submitCaseMutation.isPending}
              >
                {submitCaseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit Oklahoma Case
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
