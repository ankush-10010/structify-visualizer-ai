import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image, Map, Box, ZoomIn } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { MapViewer } from './MapViewer';
import { ModelViewer } from './ModelViewer';

interface ProcessedFile {
  name: string;
  type: 'jpg' | 'geojson' | 'ifc';
  blob: Blob;
  url: string;
}

interface ResultsDashboardProps {
  files: ProcessedFile[];
  onDownload: (file: ProcessedFile) => void;
}

export function ResultsDashboard({ files, onDownload }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState('images');

  const jpgFiles = files.filter(f => f.type === 'jpg');
  const geojsonFile = files.find(f => f.type === 'geojson');
  const ifcFile = files.find(f => f.type === 'ifc');

  const handleDownloadAll = () => {
    files.forEach(file => onDownload(file));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="p-6 bg-gradient-surface border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Processing Results
            </h2>
            <p className="text-muted-foreground">
              Your floorplan has been successfully processed
            </p>
          </div>
          <Button
            variant="hero"
            size="lg"
            onClick={handleDownloadAll}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download All
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Image className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Segmentations</p>
              <p className="text-xs text-muted-foreground">{jpgFiles.length} images</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Map className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Vector Data</p>
              <p className="text-xs text-muted-foreground">{geojsonFile ? '1 GeoJSON' : 'Not available'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-8 h-8 rounded-full bg-mint-green/20 flex items-center justify-center">
              <Box className="w-4 h-4 text-mint-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">3D Model</p>
              <p className="text-xs text-muted-foreground">{ifcFile ? '1 IFC file' : 'Not available'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="p-6 bg-gradient-surface border-border/50">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger 
              value="images" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Image className="w-4 h-4" />
              Segmentations
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={!geojsonFile}
            >
              <Map className="w-4 h-4" />
              Vector Map
            </TabsTrigger>
            <TabsTrigger 
              value="model" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={!ifcFile}
            >
              <Box className="w-4 h-4" />
              3D Model
            </TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="images" className="space-y-0">
          <ImageGallery 
            images={jpgFiles} 
            onDownload={onDownload}
          />
        </TabsContent>

        <TabsContent value="map" className="space-y-0">
          {geojsonFile && (
            <MapViewer 
              geojsonFile={geojsonFile} 
              onDownload={onDownload}
            />
          )}
        </TabsContent>

        <TabsContent value="model" className="space-y-0">
          {ifcFile && (
            <ModelViewer 
              ifcFile={ifcFile} 
              onDownload={onDownload}
            />
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}