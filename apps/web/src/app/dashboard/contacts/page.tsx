'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Upload,
  Search,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Contacts & Audience</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Organize contact lists, custom variable properties, and bulk CSV phonebooks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setGroupModal(true)}
            className="inline-flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-lg transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Create Group</span>
          </button>
          <button
            onClick={() => setImportModal(true)}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Grid: Groups (4 cols) & Contacts (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Groups Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contact Groups</h2>

            <div className="space-y-1.5">
              {groups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                    selectedGroupId === g.id
                      ? 'bg-zinc-800/90 border-blue-500 shadow-sm'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">{g.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{g.code}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-950 text-zinc-400 border border-zinc-800">
                    {g._count?.contacts || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts Column */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-200">Contacts List</h2>
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5 font-medium">Phone Number</th>
                    <th className="pb-2.5 font-medium">Name</th>
                    <th className="pb-2.5 font-medium">Variables</th>
                    <th className="pb-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 font-mono">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-zinc-500 font-sans">
                        No contacts found in this group. Click &quot;Import CSV&quot; to add.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-900/60 transition">
                        <td className="py-2.5 font-medium text-zinc-200">+{c.phoneNumber}</td>
                        <td className="py-2.5 text-zinc-300 font-sans">{c.name || '—'}</td>
                        <td className="py-2.5 text-zinc-400 font-sans truncate max-w-xs">{c.customVars || '—'}</td>
                        <td className="py-2.5 text-right font-sans">
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-zinc-100">Create Contact Group</h3>

            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Retail Customers"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Identifier Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP_GRP_01"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono uppercase text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setGroupModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import CSV */}
      {importModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Import Contacts via CSV</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Format: <code className="text-zinc-200 font-mono">PhoneNumber, Name, Company</code> (one per line)
              </p>
            </div>

            <form onSubmit={handleBulkImport} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Select Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">CSV Lines</label>
                <textarea
                  rows={5}
                  required
                  placeholder={`919876543210, Aarav Patel, Acme Corp\n919812345678, Priya Sharma, Starlight Tech\n919988776655, Vikram Mehta, Nexus`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setImportModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm"
                >
                  Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
