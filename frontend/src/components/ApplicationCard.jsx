import React from 'react';
import { MapPin, Calendar, Users, Paperclip, GripVertical } from 'lucide-react';
import { formatDate, isOverdue } from '../utils/date';
import { PRIORITY_STYLES } from '../utils/constants';

const ApplicationCard = ({ application, onClick, draggable, onDragStart }) => {
  const {
    company,
    role,
    location,
    deadline,
    rounds = [],
    contacts = [],
    documents = [],
    priority,
  } = application;

  const overdue = isOverdue(deadline);

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className="bg-white rounded-lg border border-slate-light/50 shadow-card hover:shadow-lifted hover:-translate-y-0.5 transition-all cursor-pointer p-3.5 group"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-display font-semibold text-ink text-[15px] leading-snug">
          {company}
        </h3>
        <GripVertical size={14} className="text-slate-light opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
      </div>
      <p className="text-sm text-slate-dark mb-2.5 leading-snug">{role}</p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate font-mono-tracker">
        {location && (
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {location}
          </span>
        )}
        {deadline && (
          <span className={`flex items-center gap-1 ${overdue ? 'text-coral-dark font-semibold' : ''}`}>
            <Calendar size={11} />
            {formatDate(deadline)}
          </span>
        )}
      </div>

      {(rounds.length > 0 || contacts.length > 0 || documents.length > 0) && (
        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-light/40 text-xs text-slate">
          {rounds.length > 0 && (
            <span className="flex items-center gap-1" title="Interview rounds">
              <span className="w-1.5 h-1.5 rounded-full bg-amber" />
              {rounds.length} round{rounds.length !== 1 ? 's' : ''}
            </span>
          )}
          {contacts.length > 0 && (
            <span className="flex items-center gap-1" title="Contacts">
              <Users size={11} />
              {contacts.length}
            </span>
          )}
          {documents.length > 0 && (
            <span className="flex items-center gap-1" title="Documents">
              <Paperclip size={11} />
              {documents.length}
            </span>
          )}
        </div>
      )}

      {priority === 'High' && (
        <div className={`mt-2 text-[11px] font-mono-tracker uppercase tracking-wide font-semibold ${PRIORITY_STYLES[priority]}`}>
          ★ High priority
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
