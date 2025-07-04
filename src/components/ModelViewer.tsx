import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, ZoomIn, ZoomOut, Info, Box } from 'lucide-react';

interface ProcessedFile {
  name: string;
  type: 'jpg' | 'geojson' | 'ifc';
  blob: Blob;
  url: string;
}

interface ModelViewerProps {
  ifcFile: ProcessedFile;
  onDownload: (file: ProcessedFile) => void;
}

export function ModelViewer({ ifcFile, onDownload }: ModelViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIFCViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For now, we'll show a placeholder since web-ifc-viewer setup requires more configuration
        // In a real implementation, you'd initialize the IFC viewer here
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading IFC viewer:', err);
        setError('Failed to load 3D model viewer');
        setIsLoading(false);
      }
    };

    loadIFCViewer();
  }, [ifcFile]);

  const handleReset = () => {
    // Reset camera position
    console.log('Resetting camera position');
  };

  const handleZoomIn = () => {
    // Zoom in
    console.log('Zooming in');
  };

  const handleZoomOut = () => {
    // Zoom out
    console.log('Zooming out');
  };

  return (
    <Card className="p-6 bg-gradient-surface border-border/50">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              3D Model Viewer
            </h3>
            <p className="text-muted-foreground">
              Interactive IFC model of your floorplan structure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(ifcFile)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download IFC
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="p-4 bg-muted/30 border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Controls:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleZoomIn}
                className="gap-2"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleZoomOut}
                className="gap-2"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* 3D Viewer Container */}
        <div 
          ref={viewerRef}
          className="relative h-96 rounded-lg overflow-hidden border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10"
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading 3D model...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Initializing IFC viewer
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <Info className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-sm text-destructive mb-2">{error}</p>
                <p className="text-xs text-muted-foreground">
                  The IFC file is available for download
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Box className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">3D Model Ready</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive IFC viewer would be rendered here
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Orbit: Click + drag</p>
                  <p>• Pan: Right-click + drag</p>
                  <p>• Zoom: Mouse wheel</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">3D Model Information</p>
            <p className="text-muted-foreground">
              This IFC file contains the 3D structural representation of your floorplan. 
              Use the controls to navigate around the model and inspect building elements.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}