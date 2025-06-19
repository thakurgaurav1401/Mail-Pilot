'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Sparkles, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { optimizeEmailContent, type OptimizeEmailContentInput, type OptimizeEmailContentOutput } from '@/ai/flows/optimize-email-content';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiOptimizerPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<OptimizeEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!subject || !body || !campaignGoal || !targetAudience) {
      toast({ variant: 'destructive', title: 'Error', description: 'All input fields are required for optimization.' });
      return;
    }
    setIsLoading(true);
    setOptimizationResult(null);
    try {
      const input: OptimizeEmailContentInput = { subject, body, campaignGoal, targetAudience };
      const result = await optimizeEmailContent(input);
      setOptimizationResult(result);
      toast({ title: 'Optimization Complete!', description: 'AI suggestions are ready.' });
    } catch (error) {
      console.error('AI Optimization Error:', error);
      toast({ variant: 'destructive', title: 'Optimization Failed', description: 'Could not get suggestions from AI. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast({ title: 'Copied!', description: `${fieldName} copied to clipboard.` }))
      .catch(() => toast({ variant: 'destructive', title: 'Copy Failed', description: `Could not copy ${fieldName}.` }));
  };


  return (
    <div className="container mx-auto space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Email Optimizer</h1>
          <p className="text-muted-foreground">Get AI-powered suggestions to improve your email content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Email Content</CardTitle>
            <CardDescription>Provide the email content you want to optimize.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-subject">Current Subject</Label>
              <Input id="current-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your current email subject" />
            </div>
            <div>
              <Label htmlFor="current-body">Current Body</Label>
              <Textarea id="current-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your current email body" rows={10} />
            </div>
            <div>
              <Label htmlFor="campaign-goal">Campaign Goal</Label>
              <Input id="campaign-goal" value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)} placeholder="e.g., Increase product sales by 15%" />
            </div>
            <div>
              <Label htmlFor="target-audience">Target Audience</Label>
              <Input id="target-audience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., Tech-savvy millennials interested in productivity tools" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleOptimize} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Optimizing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Optimize with AI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Suggestions
            </CardTitle>
            <CardDescription>Review the AI-generated improvements below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="space-y-4">
                <div>
                  <Label>Optimized Subject</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Label>Optimized Body</Label>
                  <Skeleton className="h-40 w-full" />
                </div>
                <div>
                  <Label>Explanation</Label>
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            )}
            {!isLoading && optimizationResult && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="optimized-subject">Optimized Subject</Label>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(optimizationResult.optimizedSubject, "Optimized Subject")}>
                      <Copy className="mr-2 h-3 w-3" /> Copy
                    </Button>
                  </div>
                  <Input id="optimized-subject" value={optimizationResult.optimizedSubject} readOnly className="bg-muted/50" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="optimized-body">Optimized Body</Label>
                     <Button variant="ghost" size="sm" onClick={() => copyToClipboard(optimizationResult.optimizedBody, "Optimized Body")}>
                      <Copy className="mr-2 h-3 w-3" /> Copy
                    </Button>
                  </div>
                  <Textarea id="optimized-body" value={optimizationResult.optimizedBody} readOnly rows={10} className="bg-muted/50" />
                </div>
                <div>
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea id="explanation" value={optimizationResult.explanation} readOnly rows={5} className="bg-muted/50" />
                </div>
              </>
            )}
            {!isLoading && !optimizationResult && (
              <p className="text-center text-muted-foreground py-10">Enter your email content and click "Optimize with AI" to see suggestions.</p>
            )}
          </CardContent>
           {optimizationResult && (
            <CardFooter className="flex justify-end">
                <Button onClick={() => {
                    setSubject(optimizationResult.optimizedSubject);
                    setBody(optimizationResult.optimizedBody);
                    toast({title: "Suggestions Applied", description: "Optimized content has been copied to the input fields."});
                }}>Apply Suggestions</Button>
            </CardFooter>
           )}
        </Card>
      </div>
    </div>
  );
}
