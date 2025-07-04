import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { UploadZone } from './UploadZone';
import { ProcessingPipeline } from './ProcessingPipeline';
import { ResultsDashboard } from './ResultsDashboard';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
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

      // Simulate API call to backend
      const formData = new FormData();
      formData.append('floorplan', file);

      // For demo purposes, create mock processed files
      const mockFiles = await createMockProcessedFiles();
      setProcessedFiles(mockFiles);
      
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

  const createMockProcessedFiles = async (): Promise<ProcessedFile[]> => {
    // Create mock files for demonstration
    const files: ProcessedFile[] = [];

    // Mock JPG segmentations
    for (let i = 1; i <= 4; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d')!;
      
      // Create different colored rectangles for different segments
      const colors = ['#00D2FF', '#00FFA3', '#FF6B6B', '#FFB800'];
      ctx.fillStyle = colors[i - 1];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Segment ${i}`, canvas.width / 2, canvas.height / 2);

      const blob = await new Promise<Blob>(resolve => 
        canvas.toBlob(resolve as BlobCallback, 'image/jpeg', 0.8)
      );

      files.push({
        name: `segment_${i}.jpg`,
        type: 'jpg',
        blob: blob!,
        url: URL.createObjectURL(blob!)
      });
    }

    // Mock GeoJSON
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { type: "wall", id: "wall_1" },
          geometry: {
            type: "LineString",
            coordinates: [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]]
          }
        }
      ]
    };

    const geojsonBlob = new Blob([JSON.stringify(mockGeoJSON)], { type: 'application/json' });
    files.push({
      name: 'structure.geojson',
      type: 'geojson',
      blob: geojsonBlob,
      url: URL.createObjectURL(geojsonBlob)
    });

    // Mock IFC file
    const mockIFC = "ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');\nDATA;\nENDSEC;\nEND-ISO-10303-21;";
    const ifcBlob = new Blob([mockIFC], { type: 'application/octet-stream' });
    files.push({
      name: 'model.ifc',
      type: 'ifc',
      blob: ifcBlob,
      url: URL.createObjectURL(ifcBlob)
    });

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

  const handleReset = () => {
    setAppState('upload');
    setUploadProgress(0);
    setProcessingStep(0);
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