// src/components/explorer/model-selection-card.tsx
"use client";

import type { InteractiveModel } from '@/types/interactive-models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image'; // Import NextImage

interface ModelSelectionCardProps {
  model: InteractiveModel;
}

export function ModelSelectionCard({ model }: ModelSelectionCardProps) {
  return (
    <Card className="shadow-lg rounded-xl overflow-hidden hover:shadow-primary/20 transition-all duration-300 ease-in-out group border-border/50 hover:border-primary/40 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors">
                <model.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{model.title}</CardTitle>
        </div>
        <CardDescription className="text-xs line-clamp-2 min-h-[2.5em]">{model.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="aspect-video bg-muted/50 rounded-md overflow-hidden mb-4 relative border">
           {/* Using NextImage for placeholder */}
           <Image 
            src={model.posterSrc || "https://placehold.co/600x400.png"} 
            alt={`${model.title} preview`} 
            layout="fill" 
            objectFit="cover" 
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={model.dataAiHint || "3d model preview"}
          />
        </div>
        <Button asChild variant="outline" size="sm" className="w-full rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Link href={`/explorer/${model.id}`}>
            Explore Model <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
