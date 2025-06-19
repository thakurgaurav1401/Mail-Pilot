'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, FileText } from 'lucide-react';
import type { EmailTemplate } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const TemplateForm = ({ template, onSave, onCancel }: { template?: EmailTemplate, onSave: (template: EmailTemplate) => void, onCancel: () => void }) => {
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [body, setBody] = useState(template?.body || '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !body) {
      toast({ variant: 'destructive', title: 'Error', description: 'All fields are required.' });
      return;
    }
    onSave({
      id: template?.id || `template-${Date.now()}`,
      name,
      subject,
      body,
      createdAt: template?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="template-name">Template Name</Label>
        <Input id="template-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Welcome Email" />
      </div>
      <div>
        <Label htmlFor="template-subject">Subject</Label>
        <Input id="template-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your email subject" />
      </div>
      <div>
        <Label htmlFor="template-body">Body</Label>
        <Textarea id="template-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Email content with {{placeholders}}" rows={10} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Template</Button>
      </DialogFooter>
    </form>
  );
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useLocalStorage<EmailTemplate[]>('emailTemplates', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>(undefined);
  const { toast } = useToast();

  const handleSaveTemplate = (template: EmailTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
      toast({ title: 'Template Updated', description: `Template "${template.name}" saved.` });
    } else {
      setTemplates([...templates, template]);
      toast({ title: 'Template Created', description: `Template "${template.name}" saved.` });
    }
    setIsFormOpen(false);
    setEditingTemplate(undefined);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({ title: 'Template Deleted', description: 'The template has been removed.' });
  };

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground">Manage your reusable email templates.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTemplate(undefined);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingTemplate(undefined); setIsFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
              <DialogDescription>
                {editingTemplate ? 'Modify your existing email template.' : 'Design a new reusable email template.'}
              </DialogDescription>
            </DialogHeader>
            <TemplateForm
              template={editingTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => { setIsFormOpen(false); setEditingTemplate(undefined); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>No Templates Yet</CardTitle>
            <CardDescription>Create your first email template to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          </CardContent>
           <CardFooter className="justify-center">
            <Button onClick={() => { setEditingTemplate(undefined); setIsFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Template
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{template.name}</CardTitle>
                <CardDescription className="truncate">Subject: {template.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{template.body}</p>
              </CardContent>
              <CardFooter className="mt-auto flex justify-between border-t pt-4">
                 <p className="text-xs text-muted-foreground">Created: {format(new Date(template.createdAt), "PP")}</p>
                <div className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)} aria-label="Edit template">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)} aria-label="Delete template">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
