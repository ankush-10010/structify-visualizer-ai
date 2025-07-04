import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Image, Map, Box } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'processing' | 'completed';
}

interface ProcessingPipelineProps {
  currentStep: number;
  isComplete: boolean;
}

export function ProcessingPipeline({ currentStep, isComplete }: ProcessingPipelineProps) {
  const steps: ProcessingStep[] = [
    {
      id: 'upload',
      title: 'Image Analysis',
      description: 'Processing floorplan image',
      icon: Image,
      status: currentStep >= 0 ? (currentStep > 0 ? 'completed' : 'processing') : 'pending',
    },
    {
      id: 'segmentation',
      title: 'Segmentation',
      description: 'Creating image segments',
      icon: Image,
      status: currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'processing') : 'pending',
    },
    {
      id: 'vectorization',
      title: 'Vectorization',
      description: 'Generating GeoJSON data',
      icon: Map,
      status: currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'processing') : 'pending',
    },
    {
      id: 'modeling',
      title: '3D Modeling',
      description: 'Building IFC model',
      icon: Box,
      status: currentStep >= 3 ? (isComplete ? 'completed' : 'processing') : 'pending',
    },
  ];

  return (
    <Card className="p-6 bg-gradient-surface border-border/50">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Processing Pipeline
          </h3>
          <p className="text-muted-foreground">
            AI analysis in progress...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300",
                  step.status === 'completed' && "border-primary/50 bg-primary/5",
                  step.status === 'processing' && "border-primary bg-primary/10 shadow-glow",
                  step.status === 'pending' && "border-border bg-muted/20"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                  step.status === 'completed' && "bg-primary text-primary-foreground",
                  step.status === 'processing' && "bg-primary/20 text-primary",
                  step.status === 'pending' && "bg-muted text-muted-foreground"
                )}>
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : step.status === 'processing' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-medium transition-colors",
                      step.status === 'completed' && "text-primary",
                      step.status === 'processing' && "text-primary",
                      step.status === 'pending' && "text-muted-foreground"
                    )}>
                      {step.title}
                    </h4>
                    {step.status === 'processing' && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm transition-colors",
                    step.status === 'pending' && "text-muted-foreground",
                    (step.status === 'processing' || step.status === 'completed') && "text-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "absolute left-9 mt-16 w-0.5 h-4 transition-colors",
                    step.status === 'completed' && "bg-primary",
                    step.status !== 'completed' && "bg-border"
                  )} />
                )}
              </motion.div>
            );
          })}
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 rounded-lg bg-primary/10 border border-primary/50"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <Check className="w-5 h-5" />
              <span className="font-medium">Processing Complete!</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your results are ready to view
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
}