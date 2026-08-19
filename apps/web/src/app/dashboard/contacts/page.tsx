'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Upload,
  Search,
  CheckCircle,
  FileSpreadsheet,
  FolderPlus,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function ContactsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [groupModal, setGroupModal] = useState(false);
  const [importModal, setImportModal] = useState(false);

  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [csvText, setCsvText] = useState('');

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/contacts/groups');
      if (res) {
        setGroups(res);
        if (res.length > 0 && !selectedGroupId) {
          setSelectedGroupId(res[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async (groupId: string) => {
    if (!groupId) return;
    try {
      const res = await fetchApi(`/contacts/groups/${groupId}/items?search=${encodeURIComponent(search)}`);
      if (res) setContacts(res);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadContacts(selectedGroupId);
    }
  }, [selectedGroupId, search]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !groupCode.trim()) return;

    try {
      const newGroup = await fetchApi('/contacts/groups', {
        method: 'POST',
        body: JSON.stringify({ name: groupName, code: groupCode }),
      });

      setGroupName('');
      setGroupCode('');
      setGroupModal(false);
      await loadGroups();
      setSelectedGroupId(newGroup.id);
    } catch (err: any) {
      alert(err.message || 'Failed to create group');
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim() || !selectedGroupId) return;

    try {
      // Parse lines: phone,name,company
      const lines = csvText.split('\n').map((l) => l.trim()).filter(Boolean);
      const parsedContacts = lines.map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        return {
          phoneNumber: parts[0],
          name: parts[1] || undefined,
          customVars: parts[2] ? { company: parts[2] } : undefined,
        };
      });

      await fetchApi('/contacts/bulk-import', {
        method: 'POST',
        body: JSON.stringify({
          groupId: selectedGroupId,
          contacts: parsedContacts,
        }),
      });

      setCsvText('');
      setImportModal(false);
      loadGroups();
      loadContacts(selectedGroupId);
    } catch (err: any) {
      alert(err.message || 'Import failed');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await fetchApi(`/contacts/items/${contactId}`, { method: 'DELETE' });
      loadContacts(selectedGroupId);
      loadGroups();
    } catch (err: any) {
      alert(err.message || 'Failed to delete contact');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Audience & Phonebooks</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Groups & CSV Import</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Organize customer contact lists, map custom variables, and perform high-volume CSV uploads.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setGroupModal(true)}
            className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Group</span>
          </button>
          <button
            onClick={() => setImportModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Import Contacts CSV</span>
          </button>
        </div>
      </div>

      {/* Grid: Groups Sidebar (4 cols) & Contacts List (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Groups Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
            <h2 className="text-base font-bold text-white">Contact Groups</h2>

            <div className="space-y-2">
              {groups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    selectedGroupId === g.id
                      ? 'bg-blue-950/60 border-blue-500 shadow'
                      : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{g.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{g.code}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-gray-800 text-blue-400">
                    {g._count?.contacts || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts Table Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-white">Contacts in Selected Group</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Phone Number</th>
                    <th className="pb-3 font-semibold">Contact Name</th>
                    <th className="pb-3 font-semibold">Custom Variables</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 font-sans">
                        No contacts found in this group. Click &quot;Import Contacts CSV&quot; to add.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-900/40 transition">
                        <td className="py-3 font-bold text-white">+{c.phoneNumber}</td>
                        <td className="py-3 text-gray-200 font-sans">{c.name || '—'}</td>
                        <td className="py-3 text-blue-400 font-sans truncate max-w-xs">{c.customVars || '—'}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-1 text-rose-400 hover:text-rose-300 transition"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Group */}
      {groupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-gray-750 p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Contact Group</h3>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Retail Leads"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Group Identifier Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP_LEADS_01"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setGroupModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import CSV */}
      {importModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-gray-750 p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Import Contacts via CSV / Text</h3>
            <p className="text-xs text-gray-400">
              Format: <code className="text-emerald-400 font-mono">PhoneNumber, Name, CustomCompany</code> (one contact per line)
            </p>

            <form onSubmit={handleBulkImport} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Target Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Paste CSV Lines:</label>
                <textarea
                  rows={6}
                  required
                  placeholder={`919876543210, Aarav Patel, Acme Corp\n919812345678, Priya Sharma, Starlight Tech\n919988776655, Vikram Mehta, Nexus Logistics`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setImportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
                >
                  Upload & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
