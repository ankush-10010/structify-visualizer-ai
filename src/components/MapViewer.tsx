import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Layers, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface ProcessedFile {
  name: string;
  type: 'jpg' | 'geojson' | 'ifc';
  blob: Blob;
  url: string;
}

interface MapViewerProps {
  geojsonFile: ProcessedFile;
  onDownload: (file: ProcessedFile) => void;
}

export function MapViewer({ geojsonFile, onDownload }: MapViewerProps) {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [layersVisible, setLayersVisible] = useState({
    walls: true,
    windows: true,
    doors: true,
  });

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const text = await geojsonFile.blob.text();
        const data = JSON.parse(text);
        setGeojsonData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    loadGeoJSON();
  }, [geojsonFile]);

  const getFeatureStyle = (feature: any) => {
    const type = feature.properties?.type || 'default';
    
    switch (type) {
      case 'wall':
        return {
          color: '#00D2FF',
          weight: 3,
          opacity: layersVisible.walls ? 0.8 : 0,
        };
      case 'window':
        return {
          color: '#00FFA3',
          weight: 2,
          opacity: layersVisible.windows ? 0.8 : 0,
        };
      case 'door':
        return {
          color: '#FF6B6B',
          weight: 2,
          opacity: layersVisible.doors ? 0.8 : 0,
        };
      default:
        return {
          color: '#00D2FF',
          weight: 2,
          opacity: 0.8,
        };
    }
  };

  const toggleLayer = (layer: keyof typeof layersVisible) => {
    setLayersVisible(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  return (
    <Card className="p-6 bg-gradient-surface border-border/50">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Vector Map View
            </h3>
            <p className="text-muted-foreground">
              Interactive GeoJSON visualization of structural elements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(geojsonFile)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download GeoJSON
            </Button>
          </div>
        </div>

        {/* Layer Controls */}
        <Card className="p-4 bg-muted/30 border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Layers:</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleLayer('walls')}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  layersVisible.walls ? 'text-electric-blue' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  layersVisible.walls ? 'bg-electric-blue' : 'bg-muted'
                }`} />
                Walls
              </button>
              
              <button
                onClick={() => toggleLayer('windows')}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  layersVisible.windows ? 'text-mint-green' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  layersVisible.windows ? 'bg-mint-green' : 'bg-muted'
                }`} />
                Windows
              </button>
              
              <button
                onClick={() => toggleLayer('doors')}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  layersVisible.doors ? 'text-red-400' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  layersVisible.doors ? 'bg-red-400' : 'bg-muted'
                }`} />
                Doors
              </button>
            </div>
          </div>
        </Card>

        {/* Map Container */}
        <div className="relative h-96 rounded-lg overflow-hidden border border-border/50">
          {geojsonData ? (
            <div className="w-full h-full bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">Map Viewer</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive GeoJSON map would be rendered here
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Pan: Click + drag</p>
                  <p>• Zoom: Mouse wheel or +/- buttons</p>
                  <p>• Click features for details</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading map data...</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Map Navigation</p>
            <p className="text-muted-foreground">
              Use mouse to pan and zoom. Click on elements to view details. 
              Toggle layers to focus on specific structural components.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}