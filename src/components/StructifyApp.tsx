import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { UploadZone } from './UploadZone';
import { ProcessingPipeline } from './ProcessingPipeline';
import { ResultsDashboard } from './ResultsDashboard';
import { useToast } from '@/hooks/use-toast';
import { processImage, reprocessImage } from '@/backend';

interface ProcessedFile {
  name: string;
  type: 'jpg' | 'geojson' | 'ifc';
  blob: Blob;
  url: string;
}

type AppState = 'upload' | 'processing' | 'results';

export function StructifyApp() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      setOriginalFile(file); // Store original file for reprocessing
      setAppState('processing');
      setUploadProgress(0);
      setProcessingStep(0);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Simulate processing steps
      const steps = [
        { step: 0, delay: 1000, description: 'Analyzing image...' },
        { step: 1, delay: 2000, description: 'Creating segments...' },
        { step: 2, delay: 1500, description: 'Vectorizing data...' },
        { step: 3, delay: 2000, description: 'Building 3D model...' },
      ];

      for (const { step, delay } of steps) {
        setProcessingStep(step);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Call backend to process image
      const zipBlob = await processImage(file);
      
      // Extract files from zip
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipBlob);
      const extractedFiles = await extractFilesFromZip(zipContent);
      setProcessedFiles(extractedFiles);
      
      setAppState('results');
      
      toast({
        title: "Processing Complete!",
        description: "Your floorplan has been successfully processed.",
      });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing your floorplan. Please try again.",
        variant: "destructive",
      });
      setAppState('upload');
    }
  };

  const extractFilesFromZip = async (zip: JSZip): Promise<ProcessedFile[]> => {
    const files: ProcessedFile[] = [];

    for (const fileName of Object.keys(zip.files)) {
      const file = zip.files[fileName];
      if (!file.dir) {
        const blob = await file.async('blob');
        const url = URL.createObjectURL(blob);
        
        let type: 'jpg' | 'geojson' | 'ifc';
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          type = 'jpg';
        } else if (fileName.endsWith('.geojson')) {
          type = 'geojson';
        } else if (fileName.endsWith('.ifc')) {
          type = 'ifc';
        } else {
          continue; // Skip unknown file types
        }

        files.push({
          name: fileName,
          type,
          blob,
          url
        });
      }
    }

    return files;
  };

  const handleDownload = (file: ProcessedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `${file.name} is being downloaded.`,
    });
  };

  const handleReprocess = async (thresholds: Record<string, number>) => {
    if (!originalFile) {
      toast({
        title: "Error",
        description: "Original image not found. Please upload again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAppState('processing');
      setUploadProgress(0);
      setProcessingStep(0);

      // Simulate processing steps for reprocessing
      const steps = [
        { step: 0, delay: 500, description: 'Applying thresholds...' },
        { step: 1, delay: 1500, description: 'Re-segmenting image...' },
        { step: 2, delay: 1000, description: 'Updating vectors...' },
        { step: 3, delay: 1500, description: 'Rebuilding 3D model...' },
      ];

      for (const { step, delay } of steps) {
        setProcessingStep(step);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Call backend to reprocess image
      const zipBlob = await reprocessImage(originalFile, thresholds);
      
      // Extract files from zip
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipBlob);
      const extractedFiles = await extractFilesFromZip(zipContent);
      setProcessedFiles(extractedFiles);
      
      setAppState('results');
      
      toast({
        title: "Reprocessing Complete!",
        description: "Your floorplan has been reprocessed with new thresholds.",
      });

    } catch (error) {
      console.error('Reprocessing failed:', error);
      toast({
        title: "Reprocessing Failed",
        description: "There was an error reprocessing your floorplan. Please try again.",
        variant: "destructive",
      });
      setAppState('results'); // Return to results instead of upload
    }
  };

  const handleReset = () => {
    setAppState('upload');
    setUploadProgress(0);
    setProcessingStep(0);
    setOriginalFile(null);
    // Clean up URLs
    processedFiles.forEach(file => URL.revokeObjectURL(file.url));
    setProcessedFiles([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary" />
              <h1 className="text-2xl font-bold text-foreground">StructifyAI</h1>
            </div>
            {appState === 'results' && (
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Process Another →
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <UploadZone
                onFileUpload={handleFileUpload}
                isProcessing={false}
                uploadProgress={uploadProgress}
              />
            </motion.div>
          )}

          {appState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <ProcessingPipeline
                currentStep={processingStep}
                isComplete={false}
              />
            </motion.div>
          )}

          {appState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <ResultsDashboard
                files={processedFiles}
                onDownload={handleDownload}
                onReprocess={handleReprocess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>StructifyAI - Transform your floorplans into intelligent data</p>
            <p className="mt-2">Powered by advanced AI image processing and vectorization</p>
          </div>
        </div>
      </footer>
    </div>
  );
}