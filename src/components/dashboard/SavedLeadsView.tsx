import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  Download,
  Trash2,
  Send,
  MessageSquare,
  ExternalLink,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Lead } from '../../types';
import { useToast } from '../../context/ToastContext';

interface SavedLeadsViewProps {
  savedLeads: Lead[];
  onRemoveSavedLead: (id: string) => void;
  onSelectLead: (lead: Lead) => void;
  onGenerateMessage: (lead: Lead) => void;
  onAddToCampaign: (lead: Lead) => void;
  onNavigateToFindLeads: () => void;
}

export const SavedLeadsView: React.FC<SavedLeadsViewProps> = ({
  savedLeads,
  onRemoveSavedLead,
  onSelectLead,
  onGenerateMessage,
  onAddToCampaign,
  onNavigateToFindLeads,
}) => {
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const filtered = savedLeads.filter(
    (l) =>
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase()) ||
      l.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCsv = () => {
    if (savedLeads.length === 0) return;
    const headers = ['Company', 'Contact', 'Role', 'Industry', 'Country', 'Match Score', 'Email', 'Website'];
    const rows = savedLeads.map((l) => [
      `"${l.company}"`,
      `"${l.contact}"`,
      `"${l.role}"`,
      `"${l.industry}"`,
      `"${l.country}"`,
      `${l.matchScore}%`,
      `"${l.email}"`,
      `"${l.website}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `andeola_saved_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', 'Exported saved leads to CSV.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            Curated Accounts
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Saved Lead Lists
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            High-conviction prospects shortlisted for dedicated outbound sequences and CRM sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={savedLeads.length === 0}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved list..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Total Saved: <strong className="text-white">{savedLeads.length}</strong> accounts
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Industry</th>
                  <th className="py-3 px-3">Country</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3 font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {lead.company}
                    </td>
                    <td className="py-3.5 px-3 text-slate-200 font-medium">
                      {lead.contact}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {lead.role}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {lead.industry}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {lead.country}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-mono">
                        {lead.matchScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onGenerateMessage(lead)}
                          title="Generate Message"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onAddToCampaign(lead)}
                          title="Add to Campaign"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onRemoveSavedLead(lead.id);
                            showToast('Removed', `Removed ${lead.company} from your list`, 'info');
                          }}
                          title="Remove from saved"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">
              No saved prospects yet
            </p>
            <button
              onClick={onNavigateToFindLeads}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
            >
              <span>Explore Leads Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
