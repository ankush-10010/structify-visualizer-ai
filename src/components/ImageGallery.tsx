import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProcessedFile {
  name: string;
  type: 'jpg' | 'geojson' | 'ifc';
  blob: Blob;
  url: string;
}

interface ImageGalleryProps {
  images: ProcessedFile[];
  onDownload: (file: ProcessedFile) => void;
}

export function ImageGallery({ images, onDownload }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProcessedFile | null>(null);

  return (
    <>
      <Card className="p-6 bg-gradient-surface border-border/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Segmentation Results
              </h3>
              <p className="text-muted-foreground">
                AI-generated image segments from your floorplan
              </p>
            </div>
            <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted/30">
              {images.length} images
            </span>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No segmentation images available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Card className="overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all duration-300">
                    <div className="relative aspect-video">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="glass"
                          onClick={() => setSelectedImage(image)}
                          className="gap-2"
                        >
                          <ZoomIn className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="glass"
                          onClick={() => onDownload(image)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm font-medium text-foreground truncate">
                        {image.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(image.blob.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() => onDownload(selectedImage)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg">
                <p className="text-sm font-medium">{selectedImage.name}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}