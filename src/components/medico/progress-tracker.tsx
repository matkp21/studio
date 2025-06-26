// src/components/medico/progress-tracker.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, BarChart2, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

// Placeholder data for demonstration
const sampleProgressData = {
  overallCompletion: 65, // percentage
  subjects: [
    { name: 'Pediatrics', progress: 75, quizzesCompleted: 5, notesReviewed: 12 },
    { name: 'Surgery', progress: 50, quizzesCompleted: 3, notesReviewed: 8 },
    { name: 'Medicine', progress: 70, quizzesCompleted: 6, notesReviewed: 15 },
  ],
  achievements: [
    { id: 'ach1', name: 'Pediatrics Quiz Master', icon: Award, unlocked: true },
    { id: 'ach2', name: 'Surgery Note Taker', icon: CheckCircle, unlocked: true },
    { id: 'ach3', name: 'Study Streak: 7 Days', icon: Target, unlocked: false },
  ]
};

export function ProgressTracker() {
  const [progressData, setProgressData] = useState(sampleProgressData);

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-green-500/50 bg-green-500/10">
            <Lightbulb className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-semibold text-green-700 dark:text-green-500">Conceptual Feature</AlertTitle>
            <AlertDescription className="text-green-600/90 dark:text-green-500/90 text-xs">
            This interface represents a future Progress Tracker tool with gamification elements. A full implementation would involve tracking user activity across different study tools (MCQs, notes, cases) and awarding achievements.
            </AlertDescription>
      </Alert>

      <Card className="shadow-md rounded-xl border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-amber-600" />
            Study Progress Overview
          </CardTitle>
          <CardDescription>Track your learning journey and unlock achievements!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Overall Progress: {progressData.overallCompletion}%</Label>
            <Progress value={progressData.overallCompletion} className="w-full mt-1 h-3 rounded-full" />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-md">Subject Progress:</h4>
            {progressData.subjects.map(subject => (
              <div key={subject.name} className="p-3 border rounded-md bg-muted/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-xs text-muted-foreground">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2 rounded-full" />
                <p className="text-xs text-muted-foreground mt-1">
                  Quizzes: {subject.quizzesCompleted} | Notes: {subject.notesReviewed}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-semibold text-md mb-2">Achievements:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {progressData.achievements.map(ach => (
                <div key={ach.id} className={`p-3 border rounded-lg text-center ${ach.unlocked ? 'border-green-500 bg-green-500/10' : 'border-dashed opacity-60'}`}>
                  <ach.icon className={`mx-auto h-8 w-8 mb-1 ${ach.unlocked ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <p className="text-xs font-medium">{ach.name}</p>
                  {!ach.unlocked && <p className="text-xs text-muted-foreground">(Locked)</p>}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic text-center pt-4">
              (Gamification elements like points, leaderboards, and daily challenges would be added here.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
