import React, { useState } from 'react';
import { Plus, Trash2, Mail, Phone, Linkedin } from 'lucide-react';
import api from '../utils/api';

const emptyContact = { name: '', role: '', email: '', phone: '', linkedin: '', notes: '' };

const ContactsManager = ({ applicationId, contacts, onUpdate }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyContact);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post(`/applications/${applicationId}/contacts`, form);
      onUpdate(data.application);
      setForm(emptyContact);
      setAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      const { data } = await api.delete(`/applications/${applicationId}/contacts/${contactId}`);
      onUpdate(data.application);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="space-y-2">
        {contacts.map((contact) => (
          <div key={contact._id} className="border border-slate-light/60 rounded-lg bg-white p-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{contact.name}</p>
              {contact.role && <p className="text-xs text-slate-dark mb-1">{contact.role}</p>}
              <div className="flex flex-wrap gap-3 mt-1">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-amber-dark hover:underline">
                    <Mail size={11} /> {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <span className="flex items-center gap-1 text-xs text-slate-dark">
                    <Phone size={11} /> {contact.phone}
                  </span>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-amber-dark hover:underline">
                    <Linkedin size={11} /> Profile
                  </a>
                )}
              </div>
              {contact.notes && <p className="text-xs text-slate-dark mt-1.5">{contact.notes}</p>}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(contact._id)}
              className="text-slate hover:text-coral-dark flex-shrink-0"
              aria-label="Remove contact"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {contacts.length === 0 && !adding && (
          <p className="text-sm text-slate text-center py-4">No contacts added yet.</p>
        )}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="mt-3 border border-amber/40 bg-amber-light/30 rounded-lg p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <input
              placeholder="Name *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
              required
            />
            <input
              placeholder="Role (e.g. Recruiter)"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
            />
          </div>
          <input
            placeholder="LinkedIn URL"
            value={form.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
            className="w-full text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
          />
          <textarea
            placeholder="Notes"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="w-full text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
          />
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className="bg-ink text-paper text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-60">
              Save contact
            </button>
            <button type="button" onClick={() => { setAdding(false); setForm(emptyContact); }} className="text-xs text-slate-dark px-3 py-1.5">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="mt-3 flex items-center gap-1.5 text-sm text-amber-dark font-medium hover:text-ink">
          <Plus size={15} /> Add contact
        </button>
      )}
    </div>
  );
};

export default ContactsManager;
