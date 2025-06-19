'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CalendarClock, ListFilter, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';

interface BatchSettings {
  enabled: boolean;
  batchSize: number;
  intervalMinutes: number;
}

export default function SettingsPage() {
  const [defaultScheduleTime, setDefaultScheduleTime] = useLocalStorage<string>('defaultScheduleTime', '09:00');
  const [batchSettings, setBatchSettings] = useLocalStorage<BatchSettings>('batchSettings', {
    enabled: false,
    batchSize: 100,
    intervalMinutes: 5,
  });
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, these settings would be saved to a backend.
    toast({ title: 'Settings Saved', description: 'Your preferences have been updated.' });
    // localStorage is handled by the hook automatically
  };
  
  const handleBatchSettingChange = <K extends keyof BatchSettings>(key: K, value: BatchSettings[K]) => {
    setBatchSettings(prev => ({ ...prev, [key]: value }));
  };


  return (
    <div className="container mx-auto space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure MailPilot to your needs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5" />Default Scheduling</CardTitle>
            <CardDescription>Set default options for scheduling emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-time">Default Send Time</Label>
              <Input
                id="default-time"
                type="time"
                value={defaultScheduleTime}
                onChange={(e) => setDefaultScheduleTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">This time will be pre-filled when scheduling campaigns.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListFilter className="h-5 w-5" />Batch Sending</CardTitle>
            <CardDescription>Configure batch sending to avoid spam filters and manage server load.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="batch-sending-enabled"
                checked={batchSettings.enabled}
                onCheckedChange={(checked) => handleBatchSettingChange('enabled', checked)}
              />
              <Label htmlFor="batch-sending-enabled">Enable Batch Sending</Label>
            </div>
            {batchSettings.enabled && (
              <>
                <div>
                  <Label htmlFor="batch-size">Emails per Batch</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={batchSettings.batchSize}
                    onChange={(e) => handleBatchSettingChange('batchSize', parseInt(e.target.value, 10) || 0)}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="batch-interval">Interval Between Batches (minutes)</Label>
                  <Input
                    id="batch-interval"
                    type="number"
                    value={batchSettings.intervalMinutes}
                    onChange={(e) => handleBatchSettingChange('intervalMinutes', parseInt(e.target.value, 10) || 0)}
                    min="1"
                  />
                </div>
              </>
            )}
             <p className="text-xs text-muted-foreground">Note: Actual batch sending logic requires backend implementation.</p>
          </CardContent>
        </Card>
        
        {/* Placeholder for future settings like API Keys, Integrations etc. */}
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">More account settings will be available here in future versions (e.g., notification preferences, theme selection, API keys).</p>
            </CardContent>
        </Card>

      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" /> Save All Settings
        </Button>
      </div>
    </div>
  );
}
