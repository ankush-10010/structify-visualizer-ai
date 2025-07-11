import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Image, Map, Box, ZoomIn, RefreshCw } from 'lucide-react';
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
  onReprocess?: (thresholds: Record<string, number>) => void;
}

export function ResultsDashboard({ files, onDownload, onReprocess }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState('images');
  const [thresholds, setThresholds] = useState<Record<string, number>>({});
  const [isReprocessing, setIsReprocessing] = useState(false);

  const thresholdOptions = [
    'bedroom', 'dining room', 'kitchen', 'sofa', 'living room', 
    'toilet', 'bed', 'wardrobe', 'commode', 'door'
  ];

  const jpgFiles = files.filter(f => f.type === 'jpg');
  const geojsonFile = files.find(f => f.type === 'geojson');
  const ifcFile = files.find(f => f.type === 'ifc');

  const handleDownloadAll = () => {
    files.forEach(file => onDownload(file));
  };

  const handleThresholdChange = (item: string, value: string) => {
    setThresholds(prev => ({
      ...prev,
      [item]: parseFloat(value) || 0
    }));
  };

  const handleReprocess = async () => {
    if (!onReprocess) return;
    
    setIsReprocessing(true);
    try {
      await onReprocess(thresholds);
    } catch (error) {
      console.error('Reprocessing failed:', error);
    } finally {
      setIsReprocessing(false);
    }
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

        {/* Thresholds Section */}
        <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border/30">
          <h3 className="text-lg font-semibold text-foreground mb-4">Adjust Thresholds</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {thresholdOptions.map((item) => (
              <div key={item} className="space-y-2">
                <label className="text-sm font-medium text-foreground capitalize">
                  {item}
                </label>
                <Select 
                  value={thresholds[item]?.toString() || ""} 
                  onValueChange={(value) => handleThresholdChange(item, value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="0.5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.1</SelectItem>
                    <SelectItem value="0.2">0.2</SelectItem>
                    <SelectItem value="0.3">0.3</SelectItem>
                    <SelectItem value="0.4">0.4</SelectItem>
                    <SelectItem value="0.5">0.5</SelectItem>
                    <SelectItem value="0.6">0.6</SelectItem>
                    <SelectItem value="0.7">0.7</SelectItem>
                    <SelectItem value="0.8">0.8</SelectItem>
                    <SelectItem value="0.9">0.9</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <Button
            onClick={handleReprocess}
            disabled={isReprocessing || !onReprocess}
            className="gap-2"
            variant="secondary"
          >
            <RefreshCw className={`w-4 h-4 ${isReprocessing ? 'animate-spin' : ''}`} />
            {isReprocessing ? 'Reprocessing...' : 'Reprocess Image'}
          </Button>
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