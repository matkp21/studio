// src/components/medico/medico-dashboard.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowRight, Star, Settings, CheckSquare, GripVertical, CalendarDays
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import Link from 'next/link';
import { allMedicoToolsList, frequentlyUsedMedicoToolIds } from '@/config/medico-tools-config';
import type { MedicoTool, ActiveToolId } from '@/types/medico-tools';
import { HeroWidgets, type HeroTask } from '@/components/homepage/hero-widgets';

interface MedicoToolCardProps {
  tool: MedicoTool;
  isFrequentlyUsed?: boolean;
  isEditMode?: boolean;
}

const MedicoToolCard: React.FC<MedicoToolCardProps> = ({ tool, isFrequentlyUsed, isEditMode }) => {
  const cardContent = (
    <motion.div
      whileHover={!isEditMode ? { y: -5, boxShadow: "0px 10px 20px hsla(var(--primary) / 0.1)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={cn(
        "bg-card rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col group relative border-2 border-transparent",
        !isEditMode && "hover:shadow-xl cursor-pointer tool-card-frequent firebase-gradient-border-hover animate-subtle-pulse-glow",
        tool.comingSoon && "opacity-60 hover:shadow-md cursor-not-allowed",
        isEditMode && "cursor-grab border-dashed border-muted-foreground/50"
      )}
      role="button"
      tabIndex={tool.comingSoon || isEditMode ? -1 : 0}
      aria-disabled={!!(tool.comingSoon || isEditMode)}
      aria-label={`Launch ${tool.title}`}
    >
      {isEditMode && (
        <GripVertical className="absolute top-2 right-2 h-5 w-5 text-muted-foreground z-10" title="Drag to reorder" />
      )}
      {isFrequentlyUsed && !isEditMode && (
        <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-400 fill-yellow-400 z-10" />
      )}
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-3 mb-1.5">
          <div className={cn(
              "p-2 rounded-lg bg-primary/10 text-primary transition-colors duration-300",
              !isEditMode && "group-hover:bg-primary/20"
          )}>
              <tool.icon className={cn(
                  "h-7 w-7 transition-transform duration-300",
                  !isEditMode && "group-hover:scale-110 text-primary"
              )} />
          </div>
          <CardTitle className={cn(
              "text-lg leading-tight text-foreground",
               !isEditMode && "group-hover:text-primary"
          )}>{tool.title}</CardTitle>
        </div>
        <CardDescription className="text-xs leading-relaxed line-clamp-2 min-h-[2.5em]">{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 px-4 pb-3 flex-grow flex items-end">
        {tool.comingSoon ? (
          <div className="text-center text-xs text-amber-700 dark:text-amber-500 font-semibold p-1.5 bg-amber-500/10 rounded-md w-full">
            Coming Soon!
          </div>
        ) : (
           <div className="w-full text-right">
              <Button variant="link" size="sm" disabled={isEditMode} className={cn(
                  "text-primary group-hover:underline p-0 h-auto text-xs",
                   isEditMode && "text-muted-foreground cursor-default"
                  )}>
                 Open Tool <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
           </div>
        )}
      </CardContent>
    </motion.div>
  );

  const linkHref = tool.href || `/medico/${tool.id}`;

  if (!isEditMode && !tool.comingSoon) {
    return (
      <Link href={linkHref} className="no-underline h-full flex">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

// Wrapper component to handle suspense boundary for useSearchParams
export function MedicoDashboard() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [displayedTools, setDisplayedTools] = useState<MedicoTool[]>(allMedicoToolsList);
    
    const frequentlyUsedTools = displayedTools.filter(tool => frequentlyUsedMedicoToolIds.includes(tool.id));
    const otherTools = displayedTools.filter(tool => !frequentlyUsedMedicoToolIds.includes(tool.id));
    
    const medicoTasks: HeroTask[] = [
      { id: 'med-1', date: new Date(), title: 'Anatomy Lecture', description: '10:00 AM - Skeletal System' },
      { id: 'med-2', date: new Date(), title: 'Study Group: Cardiology', description: '4:00 PM - Discuss ECGs' },
      { id: 'med-3', date: new Date(new Date().setDate(new Date().getDate() + 1)), title: 'Quiz Due: Pharmacology', description: 'Covers autonomic drugs' },
    ];


     return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1 firebase-gradient-text">Medico Study Hub</h1>
                    <p className="text-md text-muted-foreground">
                    Your AI-powered command center for acing medical studies.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)} size="sm" className="rounded-lg group">
                {isEditMode ? <CheckSquare className="mr-2 h-4 w-4"/> : <Settings className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-45"/>}
                {isEditMode ? 'Save Layout' : 'Customize'}
                </Button>
            </div>
            
             <Card className="shadow-lg rounded-xl mb-10">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-primary"/>
                    Schedule Overview
                  </CardTitle>
                  <CardDescription>
                    Your upcoming tasks, events, and a quick-access clock.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <HeroWidgets tasks={medicoTasks} />
                </CardContent>
              </Card>

            
                {isEditMode ? (
                <>
                    <div className="p-4 mb-6 border border-dashed border-primary/50 rounded-lg bg-primary/5 text-center">
                        <p className="text-sm text-primary">
                            Customize Dashboard: Drag and drop the tool cards below to reorder your dashboard.
                        </p>
                    </div>
                    <Reorder.Group
                    as="div"
                    values={displayedTools}
                    onReorder={setDisplayedTools}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                    {displayedTools.map((tool) => (
                        <Reorder.Item key={tool.id} value={tool} layout>
                        <MedicoToolCard 
                            tool={tool} 
                            isFrequentlyUsed={frequentlyUsedMedicoToolIds.includes(tool.id)} 
                            isEditMode={isEditMode} 
                        />
                        </Reorder.Item>
                    ))}
                    </Reorder.Group>
                </>
                ) : (
                <>
                    {frequentlyUsedTools.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                        <Star className="mr-2 h-6 w-6 text-yellow-400 fill-yellow-400"/> Frequently Used
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {frequentlyUsedTools.map((tool) => (
                            <MedicoToolCard key={`${tool.id}-freq`} tool={tool} isFrequentlyUsed isEditMode={isEditMode} />
                        ))}
                        </div>
                    </section>
                    )}

                    <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-5">All Medico Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {otherTools.map((tool) => (
                            <MedicoToolCard key={tool.id} tool={tool} isEditMode={isEditMode} />
                        ))}
                    </div>
                    </section>
                </>
                )}
        </div>
    );
};
