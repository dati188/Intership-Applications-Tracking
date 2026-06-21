import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Save, Archive, ArchiveRestore } from 'lucide-react';
import Modal from './Modal';
import ApplicationForm from './ApplicationForm';
import RoundsManager from './RoundsManager';
import ContactsManager from './ContactsManager';
import DocumentsManager from './DocumentsManager';
import { toInputDate } from '../utils/date';

const buildFormFromApplication = (app) => ({
  company: app.company || '',
  role: app.role || '',
  location: app.location || '',
  remote: app.remote || 'Unknown',
  status: app.status || 'Wishlist',
  priority: app.priority || 'Medium',
  appliedDate: toInputDate(app.appliedDate),
  deadline: toInputDate(app.deadline),
  jobPostingUrl: app.jobPostingUrl || '',
  source: app.source || '',
  tagsInput: (app.tags || []).join(', '),
  notes: app.notes || '',
  salary: {
    amount: app.salary?.amount ?? '',
    period: app.salary?.period || 'hourly',
    currency: app.salary?.currency || 'USD',
    negotiated: app.salary?.negotiated || false,
  },
});

const TABS = ['Overview', 'Interview rounds', 'Contacts', 'Documents'];

const ApplicationDetailModal = ({ application, onClose, onUpdate, onDelete }) => {
  const [tab, setTab] = useState('Overview');
  const [form, setForm] = useState(buildFormFromApplication(application));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm(buildFormFromApplication(application));
    setDirty(false);
  }, [application._id]);

  const handleFormChange = (updater) => {
    setForm(updater);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        salary: {
          ...form.salary,
          amount: form.salary.amount === '' ? undefined : Number(form.salary.amount),
        },
      };
      delete payload.tagsInput;
      await onUpdate(application._id, payload);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete the application for ${application.company}? This can't be undone.`)) return;
    await onDelete(application._id);
    onClose();
  };

  const handleArchiveToggle = async () => {
    await onUpdate(application._id, { archived: !application.archived });
  };

  const handleSubResourceUpdate = (updatedApplication) => {
    onUpdate(application._id, updatedApplication, true);
  };

  return (
    <Modal open={true} onClose={onClose} title={`${application.company} — ${application.role}`} maxWidth="max-w-3xl">
      <div className="flex gap-1 border-b border-slate-light/60 mb-5 -mt-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'border-amber text-ink' : 'border-transparent text-slate-dark hover:text-ink'
            }`}
          >
            {t}
            {t === 'Interview rounds' && application.rounds.length > 0 && (
              <span className="ml-1.5 text-xs text-slate">({application.rounds.length})</span>
            )}
            {t === 'Contacts' && application.contacts.length > 0 && (
              <span className="ml-1.5 text-xs text-slate">({application.contacts.length})</span>
            )}
            {t === 'Documents' && application.documents.length > 0 && (
              <span className="ml-1.5 text-xs text-slate">({application.documents.length})</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <ApplicationForm form={form} setForm={handleFormChange} />}

      {tab === 'Interview rounds' && (
        <RoundsManager applicationId={application._id} rounds={application.rounds} onUpdate={handleSubResourceUpdate} />
      )}

      {tab === 'Contacts' && (
        <ContactsManager applicationId={application._id} contacts={application.contacts} onUpdate={handleSubResourceUpdate} />
      )}

      {tab === 'Documents' && (
        <DocumentsManager applicationId={application._id} documents={application.documents} onUpdate={handleSubResourceUpdate} />
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-light/60">
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm text-coral-dark hover:text-coral font-medium"
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            onClick={handleArchiveToggle}
            className="flex items-center gap-1.5 text-sm text-slate-dark hover:text-ink font-medium"
          >
            {application.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
            {application.archived ? 'Unarchive' : 'Archive'}
          </button>
        </div>

        {tab === 'Overview' && (
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 bg-ink text-paper font-medium text-sm px-4 py-2 rounded-lg hover:bg-ink-light transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save changes
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ApplicationDetailModal;
