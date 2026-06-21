import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useApplications = (filters = {}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.archived) params.archived = filters.archived;

      const { data } = await api.get('/applications', { params });
      setApplications(data.applications);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load applications');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search, filters.archived]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (payload) => {
    const { data } = await api.post('/applications', payload);
    setApplications((prev) => [data.application, ...prev]);
    return data.application;
  };

  const updateApplication = async (id, payload, alreadyUpdated = false) => {
    if (alreadyUpdated) {
      // payload is already the full updated application (e.g. from a sub-resource mutation)
      setApplications((prev) => prev.map((app) => (app._id === id ? payload : app)));
      return payload;
    }
    const { data } = await api.put(`/applications/${id}`, payload);
    setApplications((prev) => prev.map((app) => (app._id === id ? data.application : app)));
    return data.application;
  };

  const deleteApplication = async (id) => {
    await api.delete(`/applications/${id}`);
    setApplications((prev) => prev.filter((app) => app._id !== id));
  };

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    setApplications,
  };
};
