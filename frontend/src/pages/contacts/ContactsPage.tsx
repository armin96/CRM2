import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Building, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { contactsApi } from '../../api/endpoints';
import type { Contact } from '../../types';

const SOURCES = ['LinkedIn', 'Cold Outreach', 'Referral', 'Conference', 'Inbound', 'Website', 'Other'];

function ContactModal({ contact, onClose }: { contact?: Contact; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!contact;
  const [form, setForm] = useState({
    firstName: contact?.firstName ?? '',
    lastName: contact?.lastName ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    company: contact?.company ?? '',
    title: contact?.title ?? '',
    source: contact?.source ?? '',
    tags: contact?.tags?.join(', ') ?? '',
    notes: contact?.notes ?? '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    try {
      if (isEdit) await contactsApi.update(contact!.id, payload);
      else await contactsApi.create(payload);
      qc.invalidateQueries({ queryKey: ['contacts'] });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Contact' : 'Add Contact'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input className="form-input" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={set('email')} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" value={form.company} onChange={set('company')} />
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={form.title} onChange={set('title')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Source</label>
              <select className="form-select" value={form.source} onChange={set('source')}>
                <option value="">— Select source —</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="hot-lead, enterprise, decision-maker" />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" value={form.notes} onChange={set('notes')} rows={3} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner" /> : isEdit ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ContactsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState<'add' | Contact | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', search, page],
    queryFn: () => contactsApi.list({ search, page, size: 15 }).then(r => r.data),
    placeholderData: prev => prev,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => contactsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });

  const handleDelete = (c: Contact) => {
    if (confirm(`Delete ${c.fullName}? This cannot be undone.`)) deleteMut.mutate(c.id);
  };

  return (
    <div className="page">
      <div className="page-header" style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">Contacts</h1>
            <p className="page-subtitle">{data?.totalElements ?? 0} contacts in your network</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="search-input" style={{ width: 240 }}>
              <Search size={14} className="icon" />
              <input className="form-input" style={{ paddingLeft: 34 }}
                placeholder="Search name, email, company…"
                value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
            </div>
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              <Plus size={15} /> Add Contact
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : data?.content.length === 0 ? (
          <div className="empty-state">
            <Building size={48} />
            <h3>No contacts found</h3>
            <p>{search ? 'Try a different search term' : 'Add your first contact to get started'}</p>
            {!search && <button className="btn btn-primary" onClick={() => setModal('add')}><Plus size={15} /> Add Contact</button>}
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Tags</th>
                    <th style={{ width: 90 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.content.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: `hsl(${(c.id * 47) % 360}, 60%, 35%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: '#fff',
                          }}>
                            {c.firstName[0]}{c.lastName?.[0] ?? ''}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.fullName}</div>
                            {c.title && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.title}</div>}
                          </div>
                        </div>
                      </td>
                      <td>{c.company || <span className="text-muted">—</span>}</td>
                      <td>
                        {c.email ? (
                          <a href={`mailto:${c.email}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13 }}>
                            {c.email}
                          </a>
                        ) : <span className="text-muted">—</span>}
                      </td>
                      <td style={{ fontSize: 13 }}>{c.phone || <span className="text-muted">—</span>}</td>
                      <td>
                        {c.source ? <span className="badge badge-blue">{c.source}</span> : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {c.tags?.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                          {(c.tags?.length ?? 0) > 2 && <span className="tag">+{c.tags!.length - 2}</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setModal(c)} title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

      {modal && (
        <ContactModal
          contact={modal === 'add' ? undefined : modal as Contact}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
