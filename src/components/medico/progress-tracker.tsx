// src/components/medico/progress-tracker.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BarChart2, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { useTheme } from '@/contexts/theme-provider';

// More detailed placeholder data for demonstration
const sampleProgressData = {
  overallCompletion: 65,
  subjects: [
    { name: 'Pediatrics', progress: 75, quizzesCompleted: 5, notesReviewed: 12 },
    { name: 'Surgery', progress: 50, quizzesCompleted: 3, notesReviewed: 8 },
    { name: 'Medicine', progress: 70, quizzesCompleted: 6, notesReviewed: 15 },
    { name: 'Ob/Gyn', progress: 80, quizzesCompleted: 7, notesReviewed: 10 },
    { name: 'Pharmacology', progress: 45, quizzesCompleted: 2, notesReviewed: 18 },
  ],
  achievements: [
    { id: 'ach1', name: 'Pediatrics Quiz Master', icon: Award, unlocked: true },
    { id: 'ach2', name: 'Surgery Note Taker', icon: CheckCircle, unlocked: true },
    { id: 'ach3', name: 'Study Streak: 7 Days', icon: Target, unlocked: false },
    { id: 'ach4', name: 'Pharmacology Powerhouse', icon: Award, unlocked: false },
  ]
};

export function ProgressTracker() {
  const [progressData] = useState(sampleProgressData);
  const { resolvedTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-green-500/50 bg-green-500/10">
            <Lightbulb className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-semibold text-green-700 dark:text-green-500">Progress Dashboard</AlertTitle>
            <AlertDescription className="text-green-600/90 dark:text-green-500/90 text-xs">
              Activity tracking is active across all Medico tools! Your progress is logged, and you'll receive toast notifications. This dashboard visualizes sample data to demonstrate how your future progress will be displayed.
            </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
             <Label className="text-sm font-medium">Overall Syllabus Completion: {progressData.overallCompletion}%</Label>
             <Progress value={progressData.overallCompletion} className="w-full mt-2 h-4 rounded-full" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-primary" />
              Subject Progress
            </CardTitle>
            <CardDescription>Your current progress across different subjects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData.subjects} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={resolvedTheme === 'dark' ? 0.2 : 0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke={resolvedTheme === 'dark' ? "hsl(var(--muted-foreground))" : "#555"}
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke={resolvedTheme === 'dark' ? "hsl(var(--muted-foreground))" : "#555"} 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  cursor={{ fill: 'hsla(var(--primary)/0.1)' }}
                  contentStyle={{
                    backgroundColor: `hsl(var(--background))`,
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                <Bar 
                  dataKey="progress" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-md rounded-xl">
           <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Achievements
            </CardTitle>
            <CardDescription>Milestones you've unlocked.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
              {progressData.achievements.map(ach => (
                <div key={ach.id} className={`flex items-center gap-3 p-2 border rounded-lg ${ach.unlocked ? 'border-green-500/50 bg-green-500/10' : 'border-dashed opacity-70'}`}>
                  <div className={`p-1.5 rounded-full ${ach.unlocked ? 'bg-green-600' : 'bg-muted-foreground'}`}>
                    <ach.icon className={`h-5 w-5 ${ach.unlocked ? 'text-white' : 'text-background'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ach.name}</p>
                    {!ach.unlocked && <p className="text-xs text-muted-foreground">(Locked)</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
