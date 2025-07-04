// src/components/medico/mock-exam-suite.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trophy, Clock, Loader2, PlayCircle, BarChart, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { trackProgress } from '@/ai/agents/medico/ProgressTrackerAgent';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: Question[];
}

const sampleExams: Exam[] = [
  { 
    id: 'exam1', title: 'Weekly Med-Surg Challenge', description: 'A 20-question challenge covering key General Medicine and Surgery topics.', 
    timeLimitMinutes: 20, 
    questions: Array.from({ length: 20 }, (_, i) => ({
      id: `q${i+1}`,
      text: `This is question ${i+1} about a common medical scenario. Which of the following is the most likely diagnosis?`,
      options: ['Option A', 'Option B', 'Option C', 'Correct Answer D'],
      correctAnswerIndex: 3,
    }))
  },
  { 
    id: 'exam2', title: 'Weekend Pharmacology Sprint', description: 'A rapid-fire 15-question test on drug mechanisms and side effects.', 
    timeLimitMinutes: 10,
    questions: Array.from({ length: 15 }, (_, i) => ({
      id: `pq${i+1}`,
      text: `What is the primary mechanism of action for Drug X in question ${i+1}?`,
      options: ['Mechanism A', 'Correct Mechanism B', 'Mechanism C', 'Mechanism D'],
      correctAnswerIndex: 1,
    }))
  },
];

const sampleLeaderboard = [
    { rank: 1, name: 'MedicoPro', score: 1850, time: '18:32' },
    { rank: 2, name: 'AnatomyAce', score: 1820, time: '19:10' },
    { rank: 3, name: 'SutureSelf', score: 1790, time: '19:45' },
    { rank: 4, name: 'FutureMD', score: 1750, time: '20:01' },
];


export function MockExamSuite() {
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [examResult, setExamResult] = useState<{ score: number; correct: number; total: number } | null>(null);
  const { toast } = useToast();

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
    setTimeLeft(exam.timeLimitMinutes * 60);
    setExamResult(null);
    setUserAnswers({});
    const newTimerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(newTimerId);
          handleSubmitExam(true); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerId(newTimerId);
  };
  
  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({...prev, [questionId]: answerIndex}));
  };

  const handleSubmitExam = useCallback((timeUp = false) => {
    if (!activeExam) return;
    if (timerId) clearInterval(timerId);

    let correctCount = 0;
    activeExam.questions.forEach(q => {
        if (userAnswers[q.id] === q.correctAnswerIndex) {
            correctCount++;
        }
    });
    
    const score = Math.round((correctCount / activeExam.questions.length) * 100);
    setExamResult({ score, correct: correctCount, total: activeExam.questions.length });
    
    if (timeUp) {
        toast({ title: "Time's Up!", description: `Exam submitted automatically. Your score: ${score}%`, variant: 'destructive'});
    } else {
        toast({ title: 'Exam Submitted!', description: `You scored ${score}%!` });
    }

    trackProgress({
        activityType: 'mcq_session',
        topic: `Mock Exam: ${activeExam.title}`,
        score: score,
    }).catch(err => console.warn("Failed to track progress for mock exam:", err));

  }, [activeExam, timerId, userAnswers, toast]);

  const resetExam = () => {
    if (timerId) clearInterval(timerId);
    setActiveExam(null);
    setExamResult(null);
    setUserAnswers({});
  };

  if (activeExam) {
    return (
        <Card className="shadow-lg rounded-xl border-blue-500/30">
            <CardHeader>
                <CardTitle>{activeExam.title}</CardTitle>
                <CardDescription>Answer all questions before the time runs out.</CardDescription>
                <div className="space-y-1 pt-2">
                    <Label className="text-xs font-semibold">Time Remaining:</Label>
                    <Progress value={(timeLeft / (activeExam.timeLimitMinutes * 60)) * 100} className="h-2" />
                    <p className="text-center font-mono text-sm text-muted-foreground">
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{ (timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                {examResult ? (
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold">Exam Finished!</h3>
                        <p className="text-4xl font-bold text-primary">{examResult.score}%</p>
                        <p>You answered {examResult.correct} out of {examResult.total} questions correctly.</p>
                        <Button onClick={resetExam} className="rounded-lg">Back to Exam List</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeExam.questions.map((q, index) => (
                            <div key={q.id} className="p-3 border rounded-lg">
                                <p className="font-semibold text-sm mb-2">Q{index+1}: {q.text}</p>
                                <RadioGroup onValueChange={(val) => handleAnswerChange(q.id, parseInt(val))} value={String(userAnswers[q.id])}>
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <RadioGroupItem value={String(i)} id={`${q.id}-opt${i}`} />
                                            <Label htmlFor={`${q.id}-opt${i}`} className="text-sm font-normal">{opt}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                 {!examResult && <Button onClick={() => handleSubmitExam(false)} className="w-full rounded-lg">Submit Exam</Button>}
            </CardFooter>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-primary"/>Mock Exam Challenges</CardTitle>
                <CardDescription>Select a timed exam, test your knowledge, and climb the leaderboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {sampleExams.map(exam => (
                        <li key={exam.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{exam.title}</p>
                                <p className="text-xs text-muted-foreground">{exam.description}</p>
                            </div>
                            <Button size="sm" onClick={() => startExam(exam)} className="rounded-md">
                                <PlayCircle className="mr-2 h-4 w-4"/>Start
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        <Card className="shadow-md rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="h-6 w-6 text-yellow-500"/>Leaderboard</CardTitle>
                <CardDescription>Top performers in the weekly challenges. (Demo)</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-1">
                    {sampleLeaderboard.map(entry => (
                        <li key={entry.rank} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 text-sm">
                            <span className="font-medium">#{entry.rank} {entry.name}</span>
                            <span className="text-muted-foreground">{entry.score} pts ({entry.time})</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
