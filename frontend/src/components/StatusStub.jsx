import React from 'react';
import { STATUS_STYLES } from '../utils/constants';

const StatusStub = ({ status, className = '' }) => {
  const styles = STATUS_STYLES[status] || 'bg-slate-light text-ink';
  return (
    <span className={`status-stub ${styles} ${className}`}>
      {status}
    </span>
  );
};

export default StatusStub;
