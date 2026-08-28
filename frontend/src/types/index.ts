// Type definitions for MiniCRM

export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName?: string;
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPage {
  content: Contact[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type DealStage = 'LEAD' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Deal {
  id: number;
  title: string;
  contactId?: number;
  contactName?: string;
  value?: number;
  stage: DealStage;
  priority: Priority;
  expectedCloseDate?: string;
  notes?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanBoard {
  columns: Record<DealStage, Deal[]>;
}

export type EmailStatus = 'SENT' | 'OPENED' | 'REPLIED' | 'BOUNCED';

export interface EmailLog {
  id: number;
  contactId?: number;
  contactName?: string;
  dealId?: number;
  dealTitle?: string;
  subject: string;
  bodyPreview?: string;
  status: EmailStatus;
  sentAt: string;
  openedAt?: string;
  repliedAt?: string;
}

export interface EmailPage {
  content: EmailLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface StageCount {
  stage: DealStage;
  count: number;
  value: number;
}

export interface EmailStatusCount {
  status: EmailStatus;
  count: number;
}

export interface DashboardStats {
  totalContacts: number;
  totalDeals: number;
  totalPipelineValue: number;
  wonDeals: number;
  conversionRate: number;
  dealsByStage: StageCount[];
  emailsByStatus: EmailStatusCount[];
}
