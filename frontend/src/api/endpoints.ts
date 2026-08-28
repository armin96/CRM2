import api from './client';
import type {
  Contact, ContactPage, Deal, KanbanBoard,
  EmailLog, EmailPage, DashboardStats, DealStage, Priority, EmailStatus
} from '../types';

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post<{ token: string; email: string; fullName: string; userId: number }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; email: string; fullName: string; userId: number }>('/auth/login', data),
  me: () => api.get<{ id: number; email: string; fullName: string }>('/auth/me'),
};

// ─── Contacts ────────────────────────────────────────────────────────────────
export const contactsApi = {
  list: (params: { search?: string; page?: number; size?: number }) =>
    api.get<ContactPage>('/contacts', { params }),
  get: (id: number) => api.get<Contact>(`/contacts/${id}`),
  create: (data: Partial<Contact>) => api.post<Contact>('/contacts', data),
  update: (id: number, data: Partial<Contact>) => api.put<Contact>(`/contacts/${id}`, data),
  delete: (id: number) => api.delete(`/contacts/${id}`),
};

// ─── Deals / Pipeline ────────────────────────────────────────────────────────
export const dealsApi = {
  kanban: () => api.get<KanbanBoard>('/deals/kanban'),
  list: () => api.get<Deal[]>('/deals'),
  create: (data: {
    title: string; contactId?: number; value?: number;
    stage?: DealStage; priority?: Priority;
    expectedCloseDate?: string; notes?: string;
  }) => api.post<Deal>('/deals', data),
  update: (id: number, data: Partial<Deal>) => api.put<Deal>(`/deals/${id}`, data),
  updateStage: (id: number, stage: DealStage, position: number) =>
    api.patch<Deal>(`/deals/${id}/stage`, { stage, position }),
  delete: (id: number) => api.delete(`/deals/${id}`),
};

// ─── Email Logs ───────────────────────────────────────────────────────────────
export const emailsApi = {
  list: (params: { contactId?: number; page?: number; size?: number }) =>
    api.get<EmailPage>('/emails', { params }),
  create: (data: {
    contactId?: number; dealId?: number; subject: string;
    bodyPreview?: string; sentAt?: string;
  }) => api.post<EmailLog>('/emails', data),
  updateStatus: (id: number, status: EmailStatus) =>
    api.patch<EmailLog>(`/emails/${id}/status`, { status }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => api.get<DashboardStats>('/dashboard/stats'),
};
