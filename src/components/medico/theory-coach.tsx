
// src/components/medico/theory-coach.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import type { NextStepSuggestion } from '@/ai/schemas/medico-tools-schemas';

// Mock AI response structure now aligns with real agent outputs
interface TheoryConcept {
  name: string;
  explanation: string;
  analogy: string;
  key_points: string[];
  nextSteps: NextStepSuggestion[];
}

const mockAIResponse: TheoryConcept = {
  name: "Myocardial Infarction",
  explanation: "Myocardial infarction (MI), commonly known as a heart attack, occurs when blood flow to a part of the heart is blocked for a long enough time that part of the heart muscle is damaged or dies. The blockage is most often a buildup of fat, cholesterol and other substances, which form a plaque in the coronary arteries (atherosclerosis).",
  analogy: "Think of the coronary arteries as the fuel lines to the heart engine. An MI is like a clog in one of those fuel lines, starving a part of the engine of fuel and oxygen, causing it to sputter and die.",
  key_points: [
    "Caused by coronary artery blockage.",
    "Leads to heart muscle damage (necrosis).",
    "Primary symptom is chest pain (angina pectoris).",
    "Diagnosis involves ECG, cardiac markers (Troponin), and coronary angiography."
  ],
  nextSteps: [
    { tool: 'mcq', topic: 'Myocardial Infarction', reason: 'Test your MI knowledge' },
    { tool: 'cases', topic: 'Chest Pain Differential Diagnosis', reason: 'Simulate a case' },
    { tool: 'flashcards', topic: 'Cardiac Enzymes', reason: 'Create flashcards' },
    { tool: 'diagnobot', topic: 'ECG in Myocardial Infarction', reason: 'Practice ECG Interpretation' }
  ]
};

export function TheoryCoach() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<TheoryConcept | null>(null);
  const [error, setError] = useState('');

  const handleFetchTheory = async () => {
    if (!topic) {
      setError('Please enter a medical topic to get started.');
      return;
    }
    setError('');
    setIsLoading(true);
    setAiResponse(null);

    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, you would make an API call here.
    if (topic.toLowerCase().includes('myocardial infarction')) {
        setAiResponse(mockAIResponse);
    } else {
        setError("Sorry, I can only explain 'Myocardial Infarction' in this demo. Try that topic!");
        setAiResponse(null);
    }

    setIsLoading(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center">
            <BookOpen className="mr-3 h-7 w-7 text-primary" />
            Theory Coach
          </CardTitle>
          <CardDescription className="text-md text-gray-500 dark:text-gray-400">
            Your personal AI tutor. Break down complex medical theories into easy-to-understand concepts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'Myocardial Infarction', 'Diabetes Mellitus'"
              className="flex-grow text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleFetchTheory()}
              aria-label="Medical Topic Input"
            />
            <Button onClick={handleFetchTheory} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Explain Theory
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-300">Reticulating splines... AI is thinking...</p>
            </div>
          )}

          {aiResponse && (
            <>
              <motion.div 
                className="space-y-6"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 dark:text-white border-b-2 border-primary pb-2">
                  {aiResponse.name}
                </motion.h2>

                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-semibold">Explanation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MarkdownRenderer content={aiResponse.explanation} />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">Analogy</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-400">
                      <MarkdownRenderer content={aiResponse.analogy} />
                    </AlertDescription>
                  </Alert>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Key Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {aiResponse.key_points.map((point, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-start"
                            custom={index}
                            variants={itemVariants}
                          >
                            <ChevronRight className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
               <CardFooter className="p-0 pt-6 mt-6 border-t flex flex-col items-start gap-4">
                  {aiResponse.nextSteps && aiResponse.nextSteps.length > 0 && (
                    <div className="w-full">
                        <h4 className="font-semibold text-md mb-2 text-primary">Recommended Next Steps:</h4>
                        <div className="flex flex-wrap gap-2">
                            {aiResponse.nextSteps.map((step, index) => (
                                <Button key={index} variant="outline" size="sm" asChild>
                                    <Link href={`/medico/${step.tool}?topic=${encodeURIComponent(step.topic)}`}>
                                        {step.reason} <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                  )}
              </CardFooter>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
