import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ROUND_TYPE_VALUES, ROUND_OUTCOME_VALUES, ROUND_OUTCOME_STYLES } from '../utils/constants';
import { formatDate, toInputDate } from '../utils/date';
import api from '../utils/api';

const emptyRound = { type: 'Phone Screen', title: '', date: '', outcome: 'Scheduled', notes: '', interviewers: '' };

const RoundsManager = ({ applicationId, rounds, onUpdate }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyRound);
  const [expandedId, setExpandedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const sortedRounds = [...rounds].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        interviewers: form.interviewers
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const { data } = await api.post(`/applications/${applicationId}/rounds`, payload);
      onUpdate(data.application);
      setForm(emptyRound);
      setAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roundId) => {
    try {
      const { data } = await api.delete(`/applications/${applicationId}/rounds/${roundId}`);
      onUpdate(data.application);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOutcomeChange = async (roundId, outcome) => {
    try {
      const { data } = await api.put(`/applications/${applicationId}/rounds/${roundId}`, { outcome });
      onUpdate(data.application);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="space-y-2">
        {sortedRounds.map((round) => {
          const isOpen = expandedId === round._id;
          return (
            <div key={round._id} className="border border-slate-light/60 rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : round._id)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-medium text-sm text-ink truncate">{round.type}</span>
                  {round.title && <span className="text-xs text-slate-dark truncate">— {round.title}</span>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-mono-tracker text-slate hidden sm:inline">{formatDate(round.date)}</span>
                  <span className={`status-stub text-[10px] ${ROUND_OUTCOME_STYLES[round.outcome]}`}>
                    {round.outcome}
                  </span>
                  {isOpen ? <ChevronUp size={15} className="text-slate" /> : <ChevronDown size={15} className="text-slate" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-light/50 space-y-2.5">
                  <p className="text-xs font-mono-tracker text-slate sm:hidden">{formatDate(round.date)}</p>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-dark">Outcome:</label>
                    <select
                      value={round.outcome}
                      onChange={(e) => handleOutcomeChange(round._id, e.target.value)}
                      className="text-xs border border-slate-light rounded px-2 py-1 bg-paper"
                    >
                      {ROUND_OUTCOME_VALUES.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {round.interviewers?.length > 0 && (
                    <p className="text-xs text-slate-dark">
                      <span className="font-medium">Interviewers:</span> {round.interviewers.join(', ')}
                    </p>
                  )}

                  {round.notes && <p className="text-sm text-ink whitespace-pre-wrap">{round.notes}</p>}

                  <button
                    type="button"
                    onClick={() => handleDelete(round._id)}
                    className="flex items-center gap-1 text-xs text-coral-dark hover:text-coral font-medium mt-1"
                  >
                    <Trash2 size={12} /> Remove round
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {sortedRounds.length === 0 && !adding && (
          <p className="text-sm text-slate text-center py-4">No interview rounds logged yet.</p>
        )}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="mt-3 border border-amber/40 bg-amber-light/30 rounded-lg p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
            >
              {ROUND_TYPE_VALUES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
            />
          </div>
          <input
            placeholder="Round title (optional, e.g. 'with hiring manager')"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full text-sm border border-slate-light rounded-md px-2.5 py-1.5 bg-white"
          />
          <input
            placeholder="Interviewers (comma separated)"
            value={form.interviewers}
            onChange={(e) => setForm((f) => ({ ...f, interviewers: e.target.value }))}
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
            <button
              type="submit"
              disabled={saving}
              className="bg-ink text-paper text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-60"
            >
              Save round
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setForm(emptyRound); }}
              className="text-xs text-slate-dark px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-3 flex items-center gap-1.5 text-sm text-amber-dark font-medium hover:text-ink"
        >
          <Plus size={15} /> Add interview round
        </button>
      )}
    </div>
  );
};

export default RoundsManager;
