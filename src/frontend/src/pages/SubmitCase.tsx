import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

      toast.success('Case submitted successfully!', {
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
          Report <span className="text-ethereal">Paranormal Activity</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your experience with our investigation team. All submissions are reviewed and may be investigated based on the nature of the phenomena.
        </p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Case Submission Form</CardTitle>
          <CardDescription>
            Please provide as much detail as possible. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., 123 Elm Street, Salem, MA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Provide the address or general location where the activity occurred
              </p>
            </div>

            {/* Phenomena Type */}
            <div className="space-y-2">
              <Label htmlFor="phenomenaType">Type of Phenomena *</Label>
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
              <Label htmlFor="description">Description of Events *</Label>
              <Textarea
                id="description"
                placeholder="Describe what you experienced in detail. Include dates, times, and any patterns you've noticed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Include as many details as possible: dates, times, witnesses, environmental conditions, etc.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input
                id="contactInfo"
                placeholder="Email or phone number"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to follow up on your case
              </p>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Evidence Photo (Optional)</Label>
              <div className="border-2 border-dashed border-border/40 rounded-lg p-6 hover:border-ethereal/30 transition-colors">
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {photoPreview ? (
                    <div className="relative w-full">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Click to upload a photo of the location or evidence
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ethereal transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-ethereal hover:bg-ethereal/90 text-background font-semibold"
                disabled={submitCaseMutation.isPending}
              >
                {submitCaseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Case...
                  </>
                ) : submitCaseMutation.isSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Case Submitted!
                  </>
                ) : (
                  'Submit Case Report'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
