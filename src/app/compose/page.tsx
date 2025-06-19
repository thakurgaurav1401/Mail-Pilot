
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Send, CalendarClock, Save, Wand2, ListCollapse, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { EmailTemplate, Recipient } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import Link from 'next/link';
import { format } from 'date-fns';

// Mock data for recipients and templates for now
const mockRecipients: Recipient[] = [
  { id: '1', email: 'test1@example.com', firstName: 'John', lastName: 'Doe' },
  { id: '2', email: 'test2@example.com', firstName: 'Jane', lastName: 'Smith' },
];

export default function ComposePage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>(mockRecipients); // Placeholder
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [previewRecipient, setPreviewRecipient] = useState<Recipient | undefined>(mockRecipients[0]);
  const [templates] = useLocalStorage<EmailTemplate[]>('emailTemplates', []);
  const [, setEmailsSentCount] = useLocalStorage<number>('emailsSentCount', 0);
  const { toast } = useToast();

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
      toast({ title: 'Template Loaded', description: `Template "${template.name}" has been loaded.` });
    }
  };

  const handlePersonalizePreview = (content: string, recipient?: Recipient) => {
    if (!recipient) return content;
    let personalizedContent = content;
    Object.keys(recipient).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      personalizedContent = personalizedContent.replace(regex, (recipient as any)[key]);
    });
    return personalizedContent;
  };

  const handleSend = () => {
    if (!subject || !body) {
      toast({ variant: 'destructive', title: 'Error', description: 'Subject and body cannot be empty.' });
      return;
    }
    if (selectedRecipients.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select recipients.' });
      return;
    }
    // Mock sending logic
    toast({ title: 'Email Sent!', description: `Your email "${subject}" has been sent to ${selectedRecipients.length} recipients.` });
    
    // Increment the total emails sent count
    setEmailsSentCount(prevCount => prevCount + selectedRecipients.length);
  };
  
  const handleSchedule = () => {
     if (!scheduledAt) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a date and time to schedule.' });
      return;
    }
    // Mock scheduling logic
    toast({ title: 'Email Scheduled!', description: `Your email "${subject}" is scheduled for ${format(scheduledAt, "PPP p")}.` });
  };

  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
          <CardDescription>Craft your message and prepare it for sending.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" type="text" placeholder="Enter email subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              placeholder="Write your email content here... You can use placeholders like {{firstName}} or {{lastName}}."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={15}
              className="min-h-[300px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              This is a plain text editor. For rich text formatting, a dedicated editor component would be used in a full application.
            </p>
          </div>
           <div className="space-y-2">
            <Label htmlFor="template-select">Load Template</Label>
            <Select onValueChange={handleLoadTemplate}>
              <SelectTrigger id="template-select">
                <SelectValue placeholder="Select a template (optional)" />
              </SelectTrigger>
              <SelectContent>
                {templates.length > 0 ? (
                  templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-templates" disabled>No templates available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2">
           <Link href="/optimizer" passHref>
             <Button variant="outline">
              <Wand2 className="mr-2 h-4 w-4" /> AI Optimize
            </Button>
          </Link>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" /> Save as Draft
          </Button>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" /> Send Now
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Recipients</CardTitle>
            <CardDescription>Select recipients for this campaign.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently using mock recipients. Full recipient management <Link href="/recipients" className="text-primary underline">here</Link>.</p>
            <p className="text-sm font-medium mt-2">Sending to: {selectedRecipients.length} recipient(s)</p>
            {/* Placeholder for recipient selection UI */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Preview</CardTitle>
            <CardDescription>See how your email will look for a recipient.</CardDescription>
          </CardHeader>
          <CardContent>
             <Select onValueChange={(value) => setPreviewRecipient(selectedRecipients.find(r => r.id === value))} defaultValue={previewRecipient?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient to preview" />
              </SelectTrigger>
              <SelectContent>
                {selectedRecipients.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.email} ({r.firstName})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 space-y-2 rounded-md border p-4 shadow-sm">
              <p className="text-sm font-semibold">Subject: {handlePersonalizePreview(subject, previewRecipient)}</p>
              <hr/>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">
                {handlePersonalizePreview(body, previewRecipient)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5" />Scheduling</CardTitle>
             <CardDescription>Schedule this email to be sent later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  {scheduledAt ? format(scheduledAt, "PPP p") : <span>Pick a date and time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledAt}
                  onSelect={setScheduledAt}
                  initialFocus
                />
                {/* Basic time picker - ideally use a dedicated component */}
                <div className="p-2 border-t">
                    <Input 
                        type="time" 
                        defaultValue={scheduledAt ? format(scheduledAt, "HH:mm") : undefined}
                        onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            setScheduledAt(currentDate => {
                                const newDate = currentDate ? new Date(currentDate) : new Date();
                                newDate.setHours(hours, minutes);
                                return newDate;
                            });
                        }}
                    />
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={handleSchedule} className="w-full" disabled={!scheduledAt}>
              Schedule Email
            </Button>
            <p className="text-xs text-muted-foreground">Note: Actual email scheduling requires backend infrastructure.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
