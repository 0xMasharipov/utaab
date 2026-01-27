import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2, Image, Video } from 'lucide-react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  folder?: string;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  accept = 'image/*',
  folder = 'uploads',
  label = 'Upload file',
  maxSizeMB = 50,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = accept.includes('video');
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleUpload = async (file: File) => {
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const ext = file.name.split('.').pop();
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filename);

      setProgress(100);
      onChange(urlData.publicUrl);
      toast.success('File uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file: ' + error.message);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Extract the path from the URL
      const url = new URL(value);
      const pathParts = url.pathname.split('/storage/v1/object/public/media/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from('media').remove([filePath]);
      }
    } catch (error) {
      console.error('Failed to delete file from storage:', error);
    }

    onChange(null);
  };

  if (value) {
    return (
      <div className="relative group">
        {isVideo ? (
          <video
            src={value}
            className="w-full h-40 object-cover rounded-lg border border-border"
            controls
          />
        ) : (
          <img
            src={value}
            alt="Uploaded file"
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        isUploading && "pointer-events-none opacity-50"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {isUploading ? (
        <div className="space-y-2">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {isVideo ? (
            <Video className="h-8 w-8 mx-auto text-muted-foreground" />
          ) : (
            <Image className="h-8 w-8 mx-auto text-muted-foreground" />
          )}
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Max size: {maxSizeMB}MB
          </p>
        </div>
      )}
    </div>
  );
}
