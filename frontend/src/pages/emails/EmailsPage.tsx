import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Mail, X, ChevronLeft, ChevronRight, Eye, MessageSquare, AlertCircle } from 'lucide-react';
import { emailsApi, contactsApi } from '../../api/endpoints';
import type { EmailStatus } from '../../types';
import { format } from 'date-fns';

const STATUS_CONFIG: Record<EmailStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  SENT: { label: 'Sent', icon: <Mail size={12} />, cls: 'badge-blue' },
  OPENED: { label: 'Opened', icon: <Eye size={12} />, cls: 'badge-yellow' },
  REPLIED: { label: 'Replied', icon: <MessageSquare size={12} />, cls: 'badge-green' },
  BOUNCED: { label: 'Bounced', icon: <AlertCircle size={12} />, cls: 'badge-red' },
};

function LogEmailModal({ contacts, onClose }: {
  contacts: { id: number; fullName: string }[];
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ contactId: '', subject: '', bodyPreview: '', sentAt: '' });
  const [loading, setLoading] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<any>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await emailsApi.create({
        contactId: form.contactId ? Number(form.contactId) : undefined,
        subject: form.subject,
        bodyPreview: form.bodyPreview || undefined,
        sentAt: form.sentAt || undefined,
      });
      qc.invalidateQueries({ queryKey: ['emails'] });
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Log Email</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Contact</label>
              <select className="form-select" value={form.contactId} onChange={set('contactId')}>
                <option value="">— Select contact —</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input className="form-input" value={form.subject} onChange={set('subject')}
                placeholder="e.g. Following up on our demo call" required />
            </div>
            <div className="form-group">
              <label className="form-label">Body Preview</label>
              <textarea className="form-textarea" value={form.bodyPreview} onChange={set('bodyPreview')}
                rows={3} placeholder="Brief summary of the email content…" />
            </div>
            <div className="form-group">
              <label className="form-label">Sent At (optional)</label>
              <input className="form-input" type="datetime-local" value={form.sentAt} onChange={set('sentAt')} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner" /> : 'Log Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EmailsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['emails', page],
    queryFn: () => emailsApi.list({ page, size: 15 }).then(r => r.data),
    placeholderData: prev => prev,
  });

  const { data: contactsData } = useQuery({
    queryKey: ['contacts', '', 0],
    queryFn: () => contactsApi.list({ page: 0, size: 100 }).then(r => r.data),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: EmailStatus }) =>
      emailsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emails'] }),
  });

  return (
    <div className="page">
      <div className="page-header" style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Email Sequences</h1>
            <p className="page-subtitle">{data?.totalElements ?? 0} emails logged</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Log Email
          </button>
        </div>
      </div>

      <div className="page-content">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : data?.content.length === 0 ? (
          <div className="empty-state">
            <Mail size={48} />
            <h3>No emails logged yet</h3>
            <p>Log your outreach emails to track open and reply rates</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Log Email</button>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Sent</th>
                    <th>Opened</th>
                    <th>Replied</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.content.map(email => {
                    const cfg = STATUS_CONFIG[email.status];
                    return (
                      <tr key={email.id}>
                        <td>
                          <div style={{ maxWidth: 300 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {email.subject}
                            </div>
                            {email.bodyPreview && (
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {email.bodyPreview}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ fontSize: 13 }}>
                          {email.contactName ?? <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <span className={`badge ${cfg.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {email.sentAt ? format(new Date(email.sentAt), 'MMM d, HH:mm') : '—'}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {email.openedAt ? format(new Date(email.openedAt), 'MMM d, HH:mm') : '—'}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {email.repliedAt ? format(new Date(email.repliedAt), 'MMM d, HH:mm') : '—'}
                        </td>
                        <td>
                          <select
                            className="form-select"
                            style={{ fontSize: 12, padding: '4px 8px', width: 'auto' }}
                            value={email.status}
                            onChange={e => statusMut.mutate({ id: email.id, status: e.target.value as EmailStatus })}
                          >
                            {(Object.keys(STATUS_CONFIG) as EmailStatus[]).map(s => (
                              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {(data?.totalPages ?? 0) > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Page {page + 1} of {data?.totalPages}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft size={14} />
                  </button>
                  <button className="btn btn-secondary btn-sm" disabled={page >= (data?.totalPages ?? 1) - 1} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <LogEmailModal
          contacts={contactsData?.content.map(c => ({ id: c.id, fullName: c.fullName })) ?? []}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
