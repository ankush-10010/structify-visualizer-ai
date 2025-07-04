import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  uploadProgress: number;
}

export function UploadZone({ onFileUpload, isProcessing, uploadProgress }: UploadZoneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/jpg': ['.jpg'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Card className="p-6 bg-gradient-surface border-border/50">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Upload Floorplan Image
          </h2>
          <p className="text-muted-foreground">
            Upload a scanned blueprint, CAD print, or hand-drawn sketch
          </p>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
            isDragActive
              ? "border-primary bg-primary/5 shadow-glow"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            isProcessing && "cursor-not-allowed opacity-50",
            selectedFile && "border-primary bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative mx-auto w-48 h-32 rounded-lg overflow-hidden border border-border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedFile?.name}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {isDragActive ? "Drop your floorplan here" : "Drop your floorplan here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  PNG, JPG
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Max 10MB
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-center"
          >
            <Button
              variant="outline"
              onClick={resetUpload}
              disabled={isProcessing}
            >
              Remove
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="min-w-32"
            >
              {isProcessing ? "Processing..." : "Process Floorplan"}
            </Button>
          </motion.div>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <Progress value={uploadProgress} className="w-full" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              Processing your floorplan...
            </div>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">What happens next?</p>
            <p className="text-muted-foreground">
              Our AI will analyze your floorplan and generate segmented images, 
              vectorized structural data (GeoJSON), and a 3D model (IFC).
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}