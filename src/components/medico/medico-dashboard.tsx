
// src/components/medico/medico-dashboard.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckSquare, Settings, CalendarDays, Star
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { allMedicoToolsList } from '@/config/medico-tools-config';
import type { MedicoTool } from '@/types/medico-tools';
import { HeroWidgets, type HeroTask } from '@/components/homepage/hero-widgets';
import { MedicoToolCard } from './medico-tool-card';

// Wrapper component to handle suspense boundary for useSearchParams
export function MedicoDashboard() {
    const [isEditMode, setIsEditMode] = useState(false);
    
    // The single source of truth for tool order
    const [displayedTools, setDisplayedTools] = useState<MedicoTool[]>(allMedicoToolsList);
    
    // These are now derived from the single state, ensuring consistency
    const frequentlyUsedMedicoToolIds = allMedicoToolsList
        .filter(t => t.isFrequentlyUsed)
        .map(t => t.id);

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
                    axis="y"
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
