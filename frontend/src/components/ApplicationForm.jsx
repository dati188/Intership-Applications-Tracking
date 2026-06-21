import React from 'react';
import { STATUS_VALUES } from '../utils/constants';

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-slate-light bg-white focus:border-amber outline-none transition-colors text-sm';
const labelClass = 'block text-xs font-mono-tracker uppercase tracking-wide text-slate-dark mb-1.5';

const ApplicationForm = ({ form, setForm }) => {
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateSalary = (field, value) =>
    setForm((prev) => ({ ...prev, salary: { ...prev.salary, [field]: value } }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Company *</label>
          <input
            className={inputClass}
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
            placeholder="Stripe"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Role *</label>
          <input
            className={inputClass}
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            placeholder="Software Engineering Intern"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Location</label>
          <input
            className={inputClass}
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div>
          <label className={labelClass}>Work type</label>
          <select
            className={inputClass}
            value={form.remote}
            onChange={(e) => update('remote', e.target.value)}
          >
            <option>Unknown</option>
            <option>On-site</option>
            <option>Hybrid</option>
            <option>Remote</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          >
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select
            className={inputClass}
            value={form.priority}
            onChange={(e) => update('priority', e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Applied date</label>
          <input
            type="date"
            className={inputClass}
            value={form.appliedDate}
            onChange={(e) => update('appliedDate', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Deadline</label>
          <input
            type="date"
            className={inputClass}
            value={form.deadline}
            onChange={(e) => update('deadline', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Job posting URL</label>
        <input
          className={inputClass}
          value={form.jobPostingUrl}
          onChange={(e) => update('jobPostingUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Source</label>
          <input
            className={inputClass}
            value={form.source}
            onChange={(e) => update('source', e.target.value)}
            placeholder="Referral, LinkedIn, career fair..."
          />
        </div>
        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input
            className={inputClass}
            value={form.tagsInput}
            onChange={(e) => update('tagsInput', e.target.value)}
            placeholder="backend, fintech"
          />
        </div>
      </div>

      <fieldset className="border border-slate-light/60 rounded-lg p-3">
        <legend className="text-xs font-mono-tracker uppercase tracking-wide text-slate-dark px-1">
          Compensation
        </legend>
        <div className="grid grid-cols-3 gap-3 mt-1">
          <div>
            <label className={labelClass}>Amount</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.salary.amount}
              onChange={(e) => updateSalary('amount', e.target.value)}
              placeholder="50"
            />
          </div>
          <div>
            <label className={labelClass}>Period</label>
            <select
              className={inputClass}
              value={form.salary.period}
              onChange={(e) => updateSalary('period', e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="stipend">Stipend</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <input
              className={inputClass}
              value={form.salary.currency}
              onChange={(e) => updateSalary('currency', e.target.value)}
              placeholder="USD"
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          className={inputClass}
          rows={3}
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Anything worth remembering about this one..."
        />
      </div>
    </div>
  );
};

export default ApplicationForm;
