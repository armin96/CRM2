import type { AxiosResponse } from 'axios';
import api from './client';
import type {
  Contact, ContactPage, Deal, KanbanBoard,
  EmailLog, EmailPage, DashboardStats, DealStage, Priority, EmailStatus
} from '../types';
import { INITIAL_CONTACTS, INITIAL_DEALS, INITIAL_EMAILS } from './mockData';

function mockRes<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

// Local storage persistent fallback for static demo hosting (Vercel)
const getStored = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`minicrm_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(`minicrm_${key}`, JSON.stringify(value));
  } catch {
    // ignore
  }
};

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: async (data: { email: string; password: string; fullName: string }): Promise<AxiosResponse<{ token: string; email: string; fullName: string; userId: number }>> => {
    try {
      return await api.post('/auth/register', data);
    } catch (err: any) {
      if (!err.response || err.response.status === 404 || err.response.status === 405) {
        return mockRes({
          token: 'demo-mock-jwt-token-for-static-hosting',
          email: data.email,
          fullName: data.fullName,
          userId: Date.now(),
        });
      }
      throw err;
    }
  },
  login: async (data: { email: string; password: string }): Promise<AxiosResponse<{ token: string; email: string; fullName: string; userId: number }>> => {
    try {
      return await api.post('/auth/login', data);
    } catch (err: any) {
      if (!err.response || err.response.status === 404 || err.response.status === 405) {
        return mockRes({
          token: 'demo-mock-jwt-token-for-static-hosting',
          email: data.email || 'demo@minicrm.io',
          fullName: 'Alex Johnson',
          userId: 1,
        });
      }
      throw err;
    }
  },
  me: async (): Promise<AxiosResponse<{ id: number; email: string; fullName: string }>> => {
    try {
      return await api.get('/auth/me');
    } catch (err: any) {
      if (!err.response || err.response.status === 404 || err.response.status === 405) {
        return mockRes({ id: 1, email: 'demo@minicrm.io', fullName: 'Alex Johnson' });
      }
      throw err;
    }
  },
};

// ─── Contacts ────────────────────────────────────────────────────────────────
export const contactsApi = {
  list: async (params: { search?: string; page?: number; size?: number }): Promise<AxiosResponse<ContactPage>> => {
    try {
      return await api.get('/contacts', { params });
    } catch {
      let list = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      const query = (params.search || '').toLowerCase();
      if (query) {
        list = list.filter(c =>
          c.fullName.toLowerCase().includes(query) ||
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.company && c.company.toLowerCase().includes(query))
        );
      }
      return mockRes({
        content: list,
        page: params.page || 0,
        size: params.size || 20,
        totalElements: list.length,
        totalPages: Math.ceil(list.length / (params.size || 20)) || 1,
      });
    }
  },
  get: async (id: number): Promise<AxiosResponse<Contact>> => {
    try {
      return await api.get(`/contacts/${id}`);
    } catch {
      const list = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      const found = list.find(c => c.id === id) || list[0];
      return mockRes(found);
    }
  },
  create: async (data: Partial<Contact>): Promise<AxiosResponse<Contact>> => {
    try {
      return await api.post('/contacts', data);
    } catch {
      const list = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      const newContact: Contact = {
        id: Date.now(),
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email,
        phone: data.phone,
        company: data.company,
        title: data.title,
        source: data.source,
        tags: data.tags || [],
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setStored('contacts', [newContact, ...list]);
      return mockRes(newContact);
    }
  },
  update: async (id: number, data: Partial<Contact>): Promise<AxiosResponse<Contact>> => {
    try {
      return await api.put(`/contacts/${id}`, data);
    } catch {
      const list = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      const updated = list.map(c => c.id === id ? { ...c, ...data, fullName: `${data.firstName || c.firstName} ${data.lastName || c.lastName}`.trim(), updatedAt: new Date().toISOString() } : c);
      setStored('contacts', updated);
      const found = updated.find(c => c.id === id) || list[0];
      return mockRes(found);
    }
  },
  delete: async (id: number): Promise<AxiosResponse<void>> => {
    try {
      return await api.delete(`/contacts/${id}`);
    } catch {
      const list = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      setStored('contacts', list.filter(c => c.id !== id));
      return mockRes(undefined as void);
    }
  },
};

// ─── Deals / Pipeline ────────────────────────────────────────────────────────
export const dealsApi = {
  kanban: async (): Promise<AxiosResponse<KanbanBoard>> => {
    try {
      return await api.get('/deals/kanban');
    } catch {
      const deals = getStored<Deal[]>('deals', INITIAL_DEALS);
      const columns: Record<DealStage, Deal[]> = {
        LEAD: [], CONTACTED: [], QUALIFIED: [], PROPOSAL: [], WON: [], LOST: [],
      };
      for (const d of deals) {
        if (columns[d.stage]) columns[d.stage].push(d);
      }
      return mockRes({ columns });
    }
  },
  list: async (): Promise<AxiosResponse<Deal[]>> => {
    try {
      return await api.get('/deals');
    } catch {
      return mockRes(getStored<Deal[]>('deals', INITIAL_DEALS));
    }
  },
  create: async (data: {
    title: string; contactId?: number; value?: number;
    stage?: DealStage; priority?: Priority;
    expectedCloseDate?: string; notes?: string;
  }): Promise<AxiosResponse<Deal>> => {
    try {
      return await api.post('/deals', data);
    } catch {
      const deals = getStored<Deal[]>('deals', INITIAL_DEALS);
      const contacts = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      const contact = contacts.find(c => c.id === data.contactId);
      const newDeal: Deal = {
        id: Date.now(),
        title: data.title,
        contactId: data.contactId,
        contactName: contact ? contact.fullName : undefined,
        value: data.value,
        stage: data.stage || 'LEAD',
        priority: data.priority || 'MEDIUM',
        expectedCloseDate: data.expectedCloseDate,
        notes: data.notes,
        position: deals.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setStored('deals', [...deals, newDeal]);
      return mockRes(newDeal);
    }
  },
  update: async (id: number, data: Partial<Deal>): Promise<AxiosResponse<Deal>> => {
    try {
      return await api.put(`/deals/${id}`, data);
    } catch {
      const deals = getStored<Deal[]>('deals', INITIAL_DEALS);
      const updated = deals.map(d => d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d);
      setStored('deals', updated);
      const found = updated.find(d => d.id === id) || deals[0];
      return mockRes(found);
    }
  },
  updateStage: async (id: number, stage: DealStage, position: number): Promise<AxiosResponse<Deal>> => {
    try {
      return await api.patch(`/deals/${id}/stage`, { stage, position });
    } catch {
      const deals = getStored<Deal[]>('deals', INITIAL_DEALS);
      const updated = deals.map(d => d.id === id ? { ...d, stage, position, updatedAt: new Date().toISOString() } : d);
      setStored('deals', updated);
      const found = updated.find(d => d.id === id) || deals[0];
      return mockRes(found);
    }
  },
  delete: async (id: number): Promise<AxiosResponse<void>> => {
    try {
      return await api.delete(`/deals/${id}`);
    } catch {
      const deals = getStored<Deal[]>('deals', INITIAL_DEALS);
      setStored('deals', deals.filter(d => d.id !== id));
      return mockRes(undefined as void);
    }
  },
};

// ─── Email Logs ───────────────────────────────────────────────────────────────
export const emailsApi = {
  list: async (params: { contactId?: number; page?: number; size?: number }): Promise<AxiosResponse<EmailPage>> => {
    try {
      return await api.get('/emails', { params });
    } catch {
      const list = getStored<EmailLog[]>('emails', INITIAL_EMAILS);
      return mockRes({
        content: list,
        page: params.page || 0,
        size: params.size || 20,
        totalElements: list.length,
        totalPages: 1,
      });
    }
  },
  create: async (data: {
    contactId?: number; dealId?: number; subject: string;
    bodyPreview?: string; sentAt?: string;
  }): Promise<AxiosResponse<EmailLog>> => {
    try {
      return await api.post('/emails', data);
    } catch {
      const list = getStored<EmailLog[]>('emails', INITIAL_EMAILS);
      const contacts = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      const contact = contacts.find(c => c.id === data.contactId);
      const newEmail: EmailLog = {
        id: Date.now(),
        contactId: data.contactId,
        contactName: contact ? contact.fullName : undefined,
        subject: data.subject,
        bodyPreview: data.bodyPreview,
        status: 'SENT',
        sentAt: data.sentAt || new Date().toISOString(),
      };
      setStored('emails', [newEmail, ...list]);
      return mockRes(newEmail);
    }
  },
  updateStatus: async (id: number, status: EmailStatus): Promise<AxiosResponse<EmailLog>> => {
    try {
      return await api.patch(`/emails/${id}/status`, { status });
    } catch {
      const list = getStored<EmailLog[]>('emails', INITIAL_EMAILS);
      const updated = list.map(e => e.id === id ? { ...e, status, openedAt: status === 'OPENED' ? new Date().toISOString() : e.openedAt, repliedAt: status === 'REPLIED' ? new Date().toISOString() : e.repliedAt } : e);
      setStored('emails', updated);
      const found = updated.find(e => e.id === id) || list[0];
      return mockRes(found);
    }
  },
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: async (): Promise<AxiosResponse<DashboardStats>> => {
    try {
      return await api.get('/dashboard/stats');
    } catch {
      const contacts = getStored<Contact[]>('contacts', INITIAL_CONTACTS);
      const deals = getStored<Deal[]>('deals', INITIAL_DEALS);
      const emails = getStored<EmailLog[]>('emails', INITIAL_EMAILS);

      const activeDeals = deals.filter(d => !['WON', 'LOST'].includes(d.stage));
      const totalPipelineValue = activeDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
      const wonDeals = deals.filter(d => d.stage === 'WON').length;
      const conversionRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;

      const stageCounts: Record<string, { count: number; value: number }> = {
        LEAD: { count: 0, value: 0 },
        CONTACTED: { count: 0, value: 0 },
        QUALIFIED: { count: 0, value: 0 },
        PROPOSAL: { count: 0, value: 0 },
        WON: { count: 0, value: 0 },
        LOST: { count: 0, value: 0 },
      };

      for (const d of deals) {
        if (stageCounts[d.stage]) {
          stageCounts[d.stage].count += 1;
          stageCounts[d.stage].value += Number(d.value || 0);
        }
      }

      const emailStatusCounts: Record<string, number> = {
        SENT: 0, OPENED: 0, REPLIED: 0, BOUNCED: 0,
      };
      for (const e of emails) {
        if (emailStatusCounts[e.status] !== undefined) {
          emailStatusCounts[e.status] += 1;
        }
      }

      return mockRes({
        totalContacts: contacts.length,
        totalDeals: deals.length,
        totalPipelineValue,
        wonDeals,
        conversionRate: Math.round(conversionRate * 10) / 10,
        dealsByStage: Object.entries(stageCounts).map(([stage, v]) => ({
          stage: stage as DealStage,
          count: v.count,
          value: v.value,
        })),
        emailsByStatus: Object.entries(emailStatusCounts).map(([status, count]) => ({
          status: status as EmailStatus,
          count,
        })),
      });
    }
  },
};
