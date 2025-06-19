'use client';

import React, { useState, useCallback, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UploadCloud, Trash2, UserPlus } from 'lucide-react';
import type { Recipient } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';

// Basic CSV parser
const parseCSV = (csvText: string): Recipient[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 1) return [];
  
  const headers = lines[0].split(',').map(header => header.trim());
  const emailHeaderIndex = headers.findIndex(h => h.toLowerCase() === 'email');

  if (emailHeaderIndex === -1) {
    throw new Error("CSV must contain an 'email' column.");
  }

  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(value => value.trim());
    const recipient: Recipient = { id: `csv-${Date.now()}-${index}`, email: '' };
    headers.forEach((header, i) => {
      recipient[header] = values[i];
    });
    if (!recipient.email) {
        throw new Error(`Row ${index + 2} is missing an email address.`);
    }
    return recipient;
  });
};


export default function RecipientsPage() {
  const [recipients, setRecipients] = useLocalStorage<Recipient[]>('recipientsList', []);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsedRecipients = parseCSV(text);
          setRecipients(prev => [...prev, ...parsedRecipients.filter(p => !prev.find(r => r.email === p.email))]); // Add new, unique recipients
          toast({ title: 'Recipients Uploaded', description: `${parsedRecipients.length} recipients processed from ${file.name}.` });
        } catch (error: any) {
          toast({ variant: 'destructive', title: 'CSV Parsing Error', description: error.message || 'Failed to parse CSV file.' });
          setFileName(null);
        }
      };
      reader.readAsText(file);
    }
  }, [setRecipients, toast]);

  const deleteRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
    toast({ title: 'Recipient Deleted', description: 'The recipient has been removed from the list.' });
  };
  
  const displayedHeaders = recipients.length > 0 ? Object.keys(recipients[0]).filter(h => h !== 'id') : ['email'];


  return (
    <div className="container mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Recipients</CardTitle>
          <CardDescription>Upload a CSV file with recipient details. Ensure your CSV has an 'email' column, and other columns for personalization (e.g., 'firstName', 'companyName').</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row">
          <Label htmlFor="csv-upload" className={
            "flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          }>
            <UploadCloud className="h-5 w-5" />
            <span>{fileName ? `Selected: ${fileName}` : 'Choose CSV File'}</span>
          </Label>
          <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
          {/* Add Manual Entry Button - Future Feature */}
          {/* <Button variant="outline"> <UserPlus className="mr-2 h-4 w-4" /> Add Manually</Button> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recipient List</CardTitle>
          <CardDescription>View and manage your uploaded recipients.</CardDescription>
        </CardHeader>
        <CardContent>
          {recipients.length === 0 ? (
            <p className="text-muted-foreground">No recipients uploaded yet. Upload a CSV file to get started.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {displayedHeaders.map(header => <TableHead key={header} className="capitalize">{header}</TableHead>)}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      {displayedHeaders.map(header => <TableCell key={`${recipient.id}-${header}`}>{recipient[header] || '-'}</TableCell>)}
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteRecipient(recipient.id)} aria-label="Delete recipient">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
