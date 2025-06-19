export interface Recipient {
  id: string;
  email: string;
  [key: string]: string; // For personalized fields
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // Could be HTML string
  createdAt: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  recipients: Recipient[];
  templateId?: string;
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  // Batch sending settings
  batchSize?: number;
  batchInterval?: number; // in minutes
}
