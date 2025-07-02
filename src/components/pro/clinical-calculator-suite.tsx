// src/components/pro/clinical-calculator-suite.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Calculator, Lightbulb, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// This is a placeholder component for a suite of clinical calculators.
// A full implementation would involve separate logic for each calculator (GRACE, Wells', qSOFA, etc.)
// and potentially AI integration for context-aware suggestions or interpretations.

const calculatorTypes = [
  { id: 'qsofa', name: 'qSOFA Score (Sepsis)' },
  { id: 'grace', name: 'GRACE Score (ACS Risk)' },
  { id: 'wells-pe', name: "Wells' Score (PE)" },
  { id: 'wells-dvt', name: "Wells' Score (DVT)" },
  { id: 'chadsvasc', name: 'CHA₂DS₂-VASc Score (Stroke Risk in AF)' },
  { id: 'meld', name: 'MELD Score (Liver Disease Severity)' },
  // Add more calculators as needed
];

interface CalculationResult {
  score: number | string;
  interpretation: string;
  colorClass: string;
}

export function ClinicalCalculatorSuite() {
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [calculatorInputs, setCalculatorInputs] = useState<Record<string, string | number | boolean>>({});
  const [calculatorResult, setCalculatorResult] = useState<CalculationResult | null>(null);

  const handleCalculatorSelect = (calcId: string) => {
    setSelectedCalculator(calcId);
    setCalculatorInputs({}); // Reset inputs for new calculator
    setCalculatorResult(null);
  };

  const handleInputChange = (fieldId: string, value: string | number | boolean) => {
    setCalculatorInputs(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCalculate = () => {
    if (!selectedCalculator) return;
    
    let result: CalculationResult | null = null;

    if (selectedCalculator === 'qsofa') {
      let score = 0;
      if (calculatorInputs.respRateHigh === 'yes') score++;
      if (calculatorInputs.alteredMental === 'yes') score++;
      if (calculatorInputs.sbpLow === 'yes') score++;
      
      let interpretation = `qSOFA Score: ${score}. `;
      let colorClass = 'text-green-600 border-green-500 bg-green-500/10';

      if (score >= 2) {
        interpretation += 'High risk for poor outcome with sepsis. Consider escalating care and further sepsis workup (e.g., SOFA score).';
        colorClass = 'text-red-600 border-red-500 bg-red-500/10';
      } else {
        interpretation += 'Low risk based on qSOFA criteria. Continue monitoring.';
      }
      result = { score, interpretation, colorClass };
    } else {
      // Placeholder for other calculators
      const calculator = calculatorTypes.find(c => c.id === selectedCalculator);
      result = { score: 'N/A', interpretation: `Calculation for ${calculator?.name} is not yet implemented. This is a demonstration.`, colorClass: 'text-muted-foreground border-border bg-muted/50' };
    }

    setCalculatorResult(result);
  };

  const renderCalculatorInputs = () => {
    if (!selectedCalculator) {
      return <p className="text-muted-foreground text-sm text-center py-4">Select a calculator to see input fields.</p>;
    }
    // Dynamically render input fields based on selectedCalculator
    // This is a simplified example. A real implementation would have specific fields for each calculator.
    switch (selectedCalculator) {
      case 'qsofa':
         return (
          <div className="space-y-3 p-2 border rounded-md bg-muted/20">
            <h4 className="font-medium text-sm">qSOFA Score Inputs:</h4>
            <div><Label htmlFor="rr-qsofa">Respiratory Rate ≥ 22/min?</Label>
                <Select onValueChange={val => handleInputChange('respRateHigh', val)} value={String(calculatorInputs.respRateHigh || '')}>
                    <SelectTrigger id="rr-qsofa" className="mt-1 rounded-md"><SelectValue placeholder="Select..."/></SelectTrigger>
                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
            </div>
            <div><Label htmlFor="mental-qsofa">Altered Mental Status (GCS &lt;15?)</Label>
                 <Select onValueChange={val => handleInputChange('alteredMental', val)} value={String(calculatorInputs.alteredMental || '')}>
                    <SelectTrigger id="mental-qsofa" className="mt-1 rounded-md"><SelectValue placeholder="Select..."/></SelectTrigger>
                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
            </div>
            <div><Label htmlFor="sbp-qsofa">Systolic BP ≤ 100 mmHg?</Label>
                 <Select onValueChange={val => handleInputChange('sbpLow', val)} value={String(calculatorInputs.sbpLow || '')}>
                    <SelectTrigger id="sbp-qsofa" className="mt-1 rounded-md"><SelectValue placeholder="Select..."/></SelectTrigger>
                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
            </div>
          </div>
        );
      default:
        return <p className="text-muted-foreground text-sm text-center py-4">Input fields for {calculatorTypes.find(c => c.id === selectedCalculator)?.name} will appear here.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-orange-500/50 bg-orange-500/10">
        <Lightbulb className="h-5 w-5 text-orange-600" />
        <AlertTitle className="font-semibold text-orange-700 dark:text-orange-500">Clinical Calculator</AlertTitle>
        <AlertDescription className="text-orange-600/90 dark:text-orange-500/90 text-xs">
          This calculator suite is for educational and quick reference purposes. The qSOFA calculator is functional; others are placeholders. Always verify with official guidelines.
        </AlertDescription>
      </Alert>

      <Card className="shadow-md rounded-xl border-yellow-500/30 bg-gradient-to-br from-card via-card to-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-yellow-600" />
            Intelligent Clinical Calculator Suite
          </CardTitle>
          <CardDescription>Select a calculator, input parameters, and view results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="calculator-select">Select Calculator</Label>
            <Select onValueChange={handleCalculatorSelect}>
              <SelectTrigger id="calculator-select" className="w-full mt-1 rounded-lg">
                <SelectValue placeholder="Choose a clinical calculator..." />
              </SelectTrigger>
              <SelectContent>
                {calculatorTypes.map(calc => (
                  <SelectItem key={calc.id} value={calc.id}>{calc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderCalculatorInputs()}

          {selectedCalculator && (
            <Button onClick={handleCalculate} className="w-full sm:w-auto rounded-lg py-2.5 text-sm group mt-3">
              <Calculator className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Calculate Score
            </Button>
          )}

          {calculatorResult && (
            <div className={`mt-4 p-4 border rounded-md ${calculatorResult.colorClass}`}>
              <h4 className="font-semibold text-md mb-1">Result:</h4>
              <p className="text-lg font-bold">{calculatorResult.score}</p>
              <p className="text-sm whitespace-pre-wrap">{calculatorResult.interpretation}</p>
              
              <Alert variant="default" className="mt-3 border-red-500/50 bg-red-500/10 text-xs">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-700 dark:text-red-500 text-xs font-medium">Disclaimer</AlertTitle>
                <AlertDescription className="text-red-600/90 dark:text-red-500/90">
                  This calculator is for informational/educational use only. It does not replace clinical judgment. Always verify with official sources and guidelines.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
