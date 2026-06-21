import { format, formatDistanceToNow, isPast, isToday, isValid } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (!isValid(d)) return '—';
  return format(d, 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (!isValid(d)) return '—';
  return format(d, "MMM d, yyyy 'at' h:mm a");
};

export const formatRelative = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (!isValid(d)) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
};

export const isOverdue = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return isValid(d) && isPast(d) && !isToday(d);
};

export const toInputDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (!isValid(d)) return '';
  return format(d, 'yyyy-MM-dd');
};
