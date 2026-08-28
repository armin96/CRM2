import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCorners
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X, Calendar, User, GripVertical } from 'lucide-react';
import { dealsApi, contactsApi } from '../../api/endpoints';
import type { Deal, DealStage, Priority } from '../../types';

const STAGES: { key: DealStage; label: string; color: string }[] = [
  { key: 'LEAD', label: '🎯 Lead', color: '#4a5f82' },
  { key: 'CONTACTED', label: '📞 Contacted', color: '#3b82f6' },
  { key: 'QUALIFIED', label: '✅ Qualified', color: '#8b5cf6' },
  { key: 'PROPOSAL', label: '📄 Proposal', color: '#f59e0b' },
  { key: 'WON', label: '🏆 Won', color: '#10b981' },
  { key: 'LOST', label: '❌ Lost', color: '#ef4444' },
];

const PRIORITY_BADGE: Record<Priority, { label: string; cls: string }> = {
  HIGH: { label: 'High', cls: 'badge-red' },
  MEDIUM: { label: 'Medium', cls: 'badge-yellow' },
  LOW: { label: 'Low', cls: 'badge-gray' },
};

function fmt(v?: number | null) {
  if (!v) return null;
  return v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;
}

function DealCard({ deal, isDragging }: { deal: Deal; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } = useSortable({ id: deal.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`kanban-card${isDragging ? ' dragging' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <span {...attributes} {...listeners} style={{ color: 'var(--text-muted)', cursor: 'grab', marginTop: 2, flexShrink: 0 }}>
          <GripVertical size={14} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="kanban-card-title truncate">{deal.title}</div>
          {deal.contactName && (
            <div className="kanban-card-contact" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <User size={11} />{deal.contactName}
            </div>
          )}
          <div className="kanban-card-footer">
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {deal.value && <span className="kanban-card-value">{fmt(Number(deal.value))}</span>}
              <span className={`badge ${PRIORITY_BADGE[deal.priority].cls}`}>
                {PRIORITY_BADGE[deal.priority].label}
              </span>
            </div>
            {deal.expectedCloseDate && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Calendar size={10} />
                {new Date(deal.expectedCloseDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddDealModal({ defaultStage, contacts, onClose }: {
  defaultStage: DealStage;
  contacts: { id: number; fullName: string }[];
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: '', contactId: '', value: '', stage: defaultStage,
    priority: 'MEDIUM' as Priority, expectedCloseDate: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<any>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await dealsApi.create({
        title: form.title,
        contactId: form.contactId ? Number(form.contactId) : undefined,
        value: form.value ? Number(form.value) : undefined,
        stage: form.stage, priority: form.priority,
        expectedCloseDate: form.expectedCloseDate || undefined,
        notes: form.notes || undefined,
      });
      qc.invalidateQueries({ queryKey: ['kanban'] });
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Add Deal</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Deal Title *</label>
              <input className="form-input" value={form.title} onChange={set('title')} placeholder="e.g. Acme Corp — Enterprise License" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Contact</label>
                <select className="form-select" value={form.contactId} onChange={set('contactId')}>
                  <option value="">— None —</option>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Value ($)</label>
                <input className="form-input" type="number" value={form.value} onChange={set('value')} placeholder="0" min="0" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select className="form-select" value={form.stage} onChange={set('stage')}>
                  {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={set('priority')}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Expected Close Date</label>
              <input className="form-input" type="date" value={form.expectedCloseDate} onChange={set('expectedCloseDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" value={form.notes} onChange={set('notes')} rows={2} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner" /> : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PipelinePage() {
  const qc = useQueryClient();
  const [addModal, setAddModal] = useState<DealStage | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const { data: kanban } = useQuery({
    queryKey: ['kanban'],
    queryFn: () => dealsApi.kanban().then(r => r.data),
  });

  const { data: contactsData } = useQuery({
    queryKey: ['contacts', '', 0],
    queryFn: () => contactsApi.list({ page: 0, size: 100 }).then(r => r.data),
  });

  const stageMut = useMutation({
    mutationFn: ({ id, stage, position }: { id: number; stage: DealStage; position: number }) =>
      dealsApi.updateStage(id, stage, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kanban'] }),
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const allDeals = kanban ? Object.values(kanban.columns).flat() : [];
  const activeDeal = activeId ? allDeals.find(d => d.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => setActiveId(Number(event.active.id));

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || !kanban) return;

    const activeId = Number(active.id);
    const overId = over.id as string;

    // Find which stage the dragged card is in
    let fromStage: DealStage | null = null;
    let toStage: DealStage | null = null;

    for (const [stage, deals] of Object.entries(kanban.columns)) {
      if (deals.some(d => d.id === activeId)) fromStage = stage as DealStage;
      if (deals.some(d => d.id === Number(overId)) || stage === overId) toStage = stage as DealStage;
    }

    if (!fromStage || !toStage) return;

    const toDeals = kanban.columns[toStage];
    const overIndex = toDeals.findIndex(d => d.id === Number(overId));
    const newPosition = overIndex >= 0 ? overIndex : toDeals.length;

    stageMut.mutate({ id: activeId, stage: toStage, position: newPosition });
  };

  const totalValue = allDeals
    .filter(d => !['WON', 'LOST'].includes(d.stage))
    .reduce((sum, d) => sum + Number(d.value ?? 0), 0);

  return (
    <div className="page">
      <div className="page-header" style={{ paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Sales Pipeline</h1>
            <p className="page-subtitle">
              {allDeals.length} deals · Pipeline value: <span className="text-green" style={{ fontWeight: 600 }}>
                ${totalValue.toLocaleString()}
              </span>
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setAddModal('LEAD')}>
            <Plus size={15} /> Add Deal
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 28px 24px' }}>
        <DndContext sensors={sensors} collisionDetection={closestCorners}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {STAGES.map(({ key, label, color }) => {
              const deals = kanban?.columns[key] ?? [];
              const colValue = deals.reduce((s, d) => s + Number(d.value ?? 0), 0);
              return (
                <div key={key} className="kanban-column">
                  <div className="kanban-column-header">
                    <div className="kanban-column-title">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                      {label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {colValue > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
                          {fmt(colValue)}
                        </span>
                      )}
                      <span className="kanban-column-count">{deals.length}</span>
                      <button
                        onClick={() => setAddModal(key)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, borderRadius: 4 }}
                        title={`Add deal to ${label}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="kanban-cards" id={key}>
                    <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                      {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                    </SortableContext>
                    {deals.length === 0 && (
                      <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                        Drop deals here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <DragOverlay>
            {activeDeal && <DealCard deal={activeDeal} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>

      {addModal && (
        <AddDealModal
          defaultStage={addModal}
          contacts={contactsData?.content.map(c => ({ id: c.id, fullName: c.fullName })) ?? []}
          onClose={() => setAddModal(null)}
        />
      )}
    </div>
  );
}
