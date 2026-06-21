import React, { useState } from 'react';
import { Plus, Trash2, FileText, ExternalLink } from 'lucide-react';
import { DOCUMENT_TYPES } from '../utils/constants';
import api from '../utils/api';

const emptyDocument = { label: '', type: 'Resume', url: '', notes: '' };

const DocumentsManager = ({ applicationId, documents, onUpdate }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyDocument);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post(`/applications/${applicationId}/documents`, form);
      onUpdate(data.application);
      setForm(emptyDocument);
      setAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      const { data } = await api.delete(`/applications/${applicationId}/documents/${documentId}`);
      onUpdate(data.application);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc._id} className="border border-slate-light/60 rounded-lg bg-white p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText size={16} className="text-amber-dark flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{doc.label}</p>
                <p className="text-xs text-slate-dark">{doc.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {doc.url && (
                <a href={doc.url} target="_blank" rel="noreferrer" className="text-slate hover:text-amber-dark" aria-label="Open document">
                  <ExternalLink size={14} />
                </a>
              )}
              <button type="button" onClick={() => handleDelete(doc._id)} className="text-slate hover:text-coral-dark" aria-label="Remove document">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {documents.length === 0 && !adding && (
          <p className="text-sm text-slate text-center py-4">No documents linked yet.</p>
        )}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="mt-3 border border-amber/40 bg-amber-light/30 rounded-lg p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <input
              placeholder="Label * (e.g. Resume v3)"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <input
            placeholder="Link (URL to file, Google Drive, etc.)"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            className="w-full text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
          />
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className="bg-ink text-paper text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-60">
              Save document
            </button>
            <button type="button" onClick={() => { setAdding(false); setForm(emptyDocument); }} className="text-xs text-slate-dark px-3 py-1.5">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="mt-3 flex items-center gap-1.5 text-sm text-amber-dark font-medium hover:text-ink">
          <Plus size={15} /> Add document
        </button>
      )}
    </div>
  );
};

export default DocumentsManager;
