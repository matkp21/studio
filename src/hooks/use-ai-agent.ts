// src/hooks/use-ai-agent.ts
"use client";

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

type AgentFunction<T, R> = (input: T) => Promise<R>;

interface UseAiAgentResult<T, R> {
  execute: (input: T) => Promise<void>;
  data: R | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * A robust hook for interacting with Genkit AI agent functions.
 * It handles loading states, errors, and parsing of AI-generated JSON
 * that might be wrapped in markdown code fences.
 *
 * @param agentFunction The server action (AI agent) to call.
 * @param schema The Zod schema to validate the AI's output.
 * @param options Optional callbacks and messages.
 */
export function useAiAgent<T, R>(
  agentFunction: AgentFunction<T, R>,
  schema: z.ZodType<R>,
  options?: {
    onSuccess?: (data: R, input: T) => void;
    onError?: (error: string) => void;
    successMessage?: string;
  }
): UseAiAgentResult<T, R> {
  const [data, setData] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const parseJsonResponse = (response: any): R | null => {
    // Genkit can sometimes return a stringified JSON within a 'response' property
    // or the direct object. It might also be wrapped in markdown code fences.
    let jsonString = '';
    if (typeof response === 'string') {
        jsonString = response;
    } else if (response && typeof response === 'object' && 'response' in response && typeof response.response === 'string') {
        jsonString = response.response;
    } else if (response && typeof response === 'object') {
        // If it's already an object, try to validate directly
        const parsed = schema.safeParse(response);
        if (parsed.success) return parsed.data;
        // If direct validation fails, it might be an object that needs to be stringified then parsed if it contains stringified JSON
        jsonString = JSON.stringify(response);
    }

    if (!jsonString) return null;

    // Clean markdown fences
    const cleanedString = jsonString.trim().replace(/^```json\s*|```\s*$/g, '');

    try {
        const jsonData = JSON.parse(cleanedString);
        const parsed = schema.safeParse(jsonData);
        if (parsed.success) {
            return parsed.data;
        } else {
            console.error("Zod validation failed:", parsed.error);
            setError(`AI response validation failed: ${parsed.error.errors.map(e => e.message).join(', ')}`);
            return null;
        }
    } catch (e) {
        console.error("JSON parsing error after cleaning:", e);
        setError("Failed to parse the AI's response as valid JSON.");
        return null;
    }
  };

  const execute = useCallback(async (input: T) => {
    setIsLoading(true);
    setError(null);
    setData(null); // Clear previous data on new execution

    try {
      const result = await agentFunction(input);
      const parsedData = parseJsonResponse(result);

      if (parsedData) {
        setData(parsedData);
        if (options?.onSuccess) {
          options.onSuccess(parsedData, input);
        } else if (options?.successMessage) {
          toast({
            title: "Success!",
            description: options.successMessage,
          });
        }
      } else {
         // The error state will have been set by parseJsonResponse
         const currentError = error || "An unexpected response format was received from the server.";
         if (options?.onError) {
            options.onError(currentError);
         } else {
            toast({ title: "Error", description: currentError, variant: 'destructive' });
         }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      if (options?.onError) {
        options.onError(errorMessage);
      } else {
        toast({
          title: "An Error Occurred",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [agentFunction, schema, options, toast, error]); // Added schema and error to dependencies

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { execute, data, isLoading, error, reset };
}