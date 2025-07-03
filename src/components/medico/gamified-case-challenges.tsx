// src/components/medico/gamified-case-challenges.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Swords, Trophy, Clock, Loader2, PlayCircle, Target, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  caseDetails: string;
  correctAnswer: string;
  timeLimitSeconds: number;
}

const sampleChallenges: Challenge[] = [
  { id: 'c1', title: 'The Feverish Traveler', difficulty: 'Easy', description: 'Diagnose a patient returning from abroad with a high fever.', caseDetails: 'A 32-year-old male presents with a 5-day history of high-grade fever, headache, myalgia, and retro-orbital pain. He recently returned from a trip to Southeast Asia. On examination, he has a petechial rash.', correctAnswer: 'Dengue Fever', timeLimitSeconds: 120 },
  { id: 'c2', title: 'The Acute Abdomen Puzzle', difficulty: 'Medium', description: 'A classic surgical case presenting with abdominal pain.', caseDetails: 'A 22-year-old female presents with a 12-hour history of periumbilical pain that has now localized to the right iliac fossa. She has nausea and loss of appetite. On examination, there is tenderness at McBurney\'s point.', correctAnswer: 'Acute Appendicitis', timeLimitSeconds: 90 },
  { id: 'c3', title: 'The Breathless Senior', difficulty: 'Hard', description: 'A complex case with multiple comorbidities.', caseDetails: 'An 80-year-old female with a history of hypertension and congestive heart failure presents with worsening shortness of breath over 3 days. She has bilateral pitting edema up to her knees and crackles on lung auscultation.', correctAnswer: 'Acute Decompensated Heart Failure', timeLimitSeconds: 60 },
];

const sampleLeaderboard = [
  { rank: 1, name: 'Dr. Ace', score: 2850 },
  { rank: 2, name: 'MedicoMax', score: 2700 },
  { rank: 3, name: 'StudentX', score: 2550 },
  { rank: 4, name: 'Learner99', score: 2400 },
  { rank: 5, name: 'FutureDoc', score: 2250 },
];


export function GamifiedCaseChallenges() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setTimeLeft(challenge.timeLimitSeconds);
    setResult(null);
    setUserAnswer('');
    setScore(null);
    const newTimerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(newTimerId);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerId(newTimerId);
  };
  
  const handleTimeUp = () => {
     if (timerId) clearInterval(timerId);
     setResult('incorrect');
     setScore(0);
     toast({
        title: "Time's Up!",
        description: "You ran out of time for this challenge.",
        variant: 'destructive',
     });
  }

  const handleSubmitAnswer = () => {
    if (!activeChallenge) return;
    if (timerId) clearInterval(timerId);
    
    const isCorrect = userAnswer.trim().toLowerCase() === activeChallenge.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      setResult('correct');
      const points = 50 + timeLeft; // Base points + time bonus
      setScore(points);
      toast({ title: 'Correct!', description: `You earned ${points} points!` });
    } else {
      setResult('incorrect');
      setScore(0);
      toast({ title: 'Incorrect', description: 'Better luck next time!', variant: 'destructive' });
    }
  };

  const resetChallenge = () => {
    if (timerId) clearInterval(timerId);
    setActiveChallenge(null);
    setResult(null);
    setScore(null);
    setUserAnswer('');
  };

  const getDifficultyClass = (difficulty: Challenge['difficulty']) => {
    if (difficulty === 'Hard') return 'text-red-500 bg-red-500/10';
    if (difficulty === 'Medium') return 'text-orange-500 bg-orange-500/10';
    return 'text-green-500 bg-green-500/10';
  }

  if (activeChallenge) {
    return (
        <Card className="shadow-lg rounded-xl border-blue-500/30">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{activeChallenge.title}</span>
                    <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', getDifficultyClass(activeChallenge.difficulty))}>
                        {activeChallenge.difficulty}
                    </span>
                </CardTitle>
                <CardDescription>Read the case and submit your primary diagnosis within the time limit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="font-semibold">Case Details:</Label>
                    <p className="text-sm p-3 bg-muted/50 rounded-md mt-1 whitespace-pre-wrap">{activeChallenge.caseDetails}</p>
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4"/>Time Remaining:</Label>
                    <Progress value={(timeLeft / activeChallenge.timeLimitSeconds) * 100} className="h-3" />
                    <p className="text-center font-mono text-lg">{timeLeft}s</p>
                </div>
                
                {result === null ? (
                    <div className="space-y-2">
                        <Label htmlFor="diagnosis-answer">Your Diagnosis:</Label>
                        <Input id="diagnosis-answer" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="Type your diagnosis here..." className="rounded-md"/>
                        <Button onClick={handleSubmitAnswer} className="w-full rounded-lg">Submit Answer</Button>
                    </div>
                ) : (
                    <div className="space-y-3 pt-3 border-t">
                        <h3 className="font-semibold text-lg text-center">Result</h3>
                        {result === 'correct' ? (
                            <Alert variant="default" className="border-green-500 bg-green-500/10">
                                <CheckCircle className="h-5 w-5 text-green-600"/>
                                <AlertTitle className="text-green-700">Correct!</AlertTitle>
                                <AlertDescription className="text-green-600/90">
                                    The correct diagnosis was: <strong>{activeChallenge.correctAnswer}</strong>. You scored {score} points!
                                </AlertDescription>
                            </Alert>
                        ) : (
                             <Alert variant="destructive">
                                <XCircle className="h-5 w-5"/>
                                <AlertTitle>Incorrect</AlertTitle>
                                <AlertDescription>
                                    The correct diagnosis was: <strong>{activeChallenge.correctAnswer}</strong>. Keep practicing!
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button onClick={resetChallenge} variant="outline" className="w-full rounded-lg">Back to Challenges</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="h-6 w-6 text-primary"/>Available Challenges</CardTitle>
                <CardDescription>Select a case to test your diagnostic skills against the clock.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {sampleChallenges.map(challenge => (
                        <li key={challenge.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{challenge.title}</p>
                                <p className="text-xs text-muted-foreground">{challenge.description}</p>
                            </div>
                            <Button size="sm" onClick={() => startChallenge(challenge)} className="rounded-md">
                                <PlayCircle className="mr-2 h-4 w-4"/>Start
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        <Card className="shadow-md rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500"/>Leaderboard</CardTitle>
                <CardDescription>See how you rank against other students. (Demo)</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-1">
                    {sampleLeaderboard.map(entry => (
                        <li key={entry.rank} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                            <span className="font-medium text-sm">#{entry.rank} {entry.name}</span>
                            <span className="text-sm text-muted-foreground">{entry.score} pts</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
