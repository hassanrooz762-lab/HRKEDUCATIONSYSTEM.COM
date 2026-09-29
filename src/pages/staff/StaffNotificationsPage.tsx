import React, { useEffect, useState } from 'react';
import { NotificationItem } from '../../types';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Eye,
  Megaphone,
  Check,
} from 'lucide-react';

export const StaffNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form / Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'General' | 'Exam' | 'Holiday' | 'Fee' | 'Meeting' | 'Important'>('General');
  const [isPublished, setIsPublished] = useState(true);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Alert State
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch('/api/staff/notifications', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setMessage('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('General');
    setIsPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (n: NotificationItem) => {
    setEditingId(n.id);
    setTitle(n.title);
    setMessage(n.message);
    setDate(n.date);
    setCategory(n.category);
    setIsPublished(Boolean(n.is_published));
    setModalOpen(true);
  };

  const handleSaveNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!title.trim() || !message.trim() || !date.trim()) {
      setAlert({ type: 'error', message: 'Title, message, and date are required.' });
      return;
    }

    try {
      const token = localStorage.getItem('hrk_staff_token');
      const payload = {
        title: title.trim(),
        message: message.trim(),
        date: date.trim(),
        category,
        is_published: isPublished ? 1 : 0,
      };

      const url = editingId ? `/api/staff/notifications/${editingId}` : '/api/staff/notifications';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setAlert({ type: 'error', message: json.error || 'Failed to save circular.' });
      } else {
        setAlert({
          type: 'success',
          message: editingId
            ? 'Announcement updated successfully.'
            : 'Circular published and now visible on the public notice board.',
        });
        setModalOpen(false);
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error saving notification:', err);
      setAlert({ type: 'error', message: 'Failed to contact database server.' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch(`/api/staff/notifications/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();

      if (json.success) {
        setAlert({ type: 'success', message: 'Notification removed.' });
        setDeleteConfirmId(null);
        fetchNotifications();
      } else {
        setAlert({ type: 'error', message: json.error || 'Failed to delete notification.' });
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setAlert({ type: 'error', message: 'Deletion failed.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 font-serif-brand flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-700" />
            Notice Board & Circular Management
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Publish official academic news, BISE board exam datesheets, and holiday notices for parents.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Circular</span>
        </button>
      </div>

      {/* Alert Notice */}
      {alert && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start justify-between gap-3 ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
            <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading announcements...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">
                    {n.category}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {n.date}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      n.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {n.is_published ? 'Live on Public' : 'Draft / Private'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug">{n.title}</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {n.message}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                <button
                  onClick={() => handleOpenEdit(n)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(n.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
            No circulars created yet. Click "Publish New Circular" to create your first announcement.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">Delete Announcement</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              Are you sure you want to permanently remove this notification? It will be removed from both staff and public notice boards.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Notification Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp my-8">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 font-serif-brand flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-red-700" />
                {editingId ? 'Edit Circular' : 'Create New Circular'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Circular Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule of Annual Board Exams 2026"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam Announcement</option>
                    <option value="Holiday">Holiday Notice</option>
                    <option value="Fee">Fee Reminder</option>
                    <option value="Meeting">Parent Meeting (PTM)</option>
                    <option value="Important">Important Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Announcement Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Message Content <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Detailed circular text for parents and students..."
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                ></textarea>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <input
                  type="checkbox"
                  id="publishToggle"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-red-700 rounded border-stone-300 focus:ring-red-600"
                />
                <label htmlFor="publishToggle" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Publish immediately (Visible on public school portal)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow"
                >
                  {editingId ? 'Save Changes' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
