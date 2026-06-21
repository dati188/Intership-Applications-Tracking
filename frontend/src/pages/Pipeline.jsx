import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { PIPELINE_STATUSES, STATUS_STYLES } from '../utils/constants';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationDetailModal from '../components/ApplicationDetailModal';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';

const emptyForm = {
  company: '',
  role: '',
  location: '',
  remote: 'Unknown',
  status: 'Wishlist',
  priority: 'Medium',
  appliedDate: '',
  deadline: '',
  jobPostingUrl: '',
  source: '',
  tagsInput: '',
  notes: '',
  salary: { amount: '', period: 'hourly', currency: 'USD', negotiated: false },
};

const Pipeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const { applications, loading, error, createApplication, updateApplication, deleteApplication } =
    useApplications({ search });

  const [selectedId, setSelectedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setCreateOpen(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const columns = useMemo(() => {
    const grouped = {};
    PIPELINE_STATUSES.forEach((s) => { grouped[s] = []; });
    applications.forEach((app) => {
      if (PIPELINE_STATUSES.includes(app.status)) {
        grouped[app.status].push(app);
      }
    });
    return grouped;
  }, [applications]);

  const otherApplications = useMemo(
    () => applications.filter((app) => !PIPELINE_STATUSES.includes(app.status)),
    [applications]
  );

  const selectedApplication = useMemo(
    () => applications.find((app) => app._id === selectedId) || null,
    [applications, selectedId]
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...createForm,
        tags: createForm.tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        salary: {
          ...createForm.salary,
          amount: createForm.salary.amount === '' ? undefined : Number(createForm.salary.amount),
        },
      };
      delete payload.tagsInput;
      const newApp = await createApplication(payload);
      setCreateOpen(false);
      setCreateForm(emptyForm);
      setSelectedId(newApp._id);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDrop = async (status) => {
    if (!draggedId) return;
    const app = applications.find((a) => a._id === draggedId);
    if (app && app.status !== status) {
      await updateApplication(draggedId, { status });
    }
    setDraggedId(null);
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Pipeline</h1>
          <p className="text-sm text-slate-dark mt-1">Drag cards between stages as things move.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role"
              className="pl-9 pr-3 py-2 rounded-lg border border-slate-light bg-white text-sm w-56 focus:border-amber outline-none"
            />
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 bg-ink text-paper text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-ink-light transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-coral-light text-coral-dark text-sm rounded-lg p-3 mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-amber" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto kanban-scroll pb-6">
          {PIPELINE_STATUSES.map((status) => (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
              className="flex-shrink-0 w-72"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[status].split(' ')[0]}`} />
                  <h2 className="font-mono-tracker text-xs uppercase tracking-wide font-semibold text-ink">
                    {status}
                  </h2>
                </div>
                <span className="text-xs font-mono-tracker text-slate">{columns[status].length}</span>
              </div>

              <div className="space-y-2.5 min-h-[120px] bg-ink/[0.03] rounded-xl p-2">
                {columns[status].map((app) => (
                  <ApplicationCard
                    key={app._id}
                    application={app}
                    draggable
                    onDragStart={() => setDraggedId(app._id)}
                    onClick={() => setSelectedId(app._id)}
                  />
                ))}
                {columns[status].length === 0 && (
                  <div className="text-xs text-slate text-center py-6 px-2">
                    Drop a card here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {otherApplications.length > 0 && (
        <div className="mt-2">
          <h2 className="font-mono-tracker text-xs uppercase tracking-wide font-semibold text-slate-dark mb-3 px-1">
            Closed out
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherApplications.map((app) => (
              <ApplicationCard key={app._id} application={app} onClick={() => setSelectedId(app._id)} />
            ))}
          </div>
        </div>
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedId(null)}
          onUpdate={updateApplication}
          onDelete={deleteApplication}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New application">
        <form onSubmit={handleCreate}>
          <ApplicationForm form={createForm} setForm={setCreateForm} />
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-light/60">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="text-sm text-slate-dark px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 bg-ink text-paper font-medium text-sm px-4 py-2 rounded-lg hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              {creating && <Loader2 size={15} className="animate-spin" />}
              Create application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Pipeline;
