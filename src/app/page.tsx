'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Building2, TrendingUp, CheckCircle2, Clock, Send } from 'lucide-react';

interface Lead {
  id: string;
  lead_display_id?: string;
  sbu: string;
  client_name: string;
  title: string;
  qualification_status: string;
  status: string;
  next_action?: string;
  next_action_date?: string;
  created_at?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czsmkajwvalywcujlywx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6c21rYWp3dmFseXdjdWpseXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0ODcxNTAsImV4cCI6MjA1NDA2MzE1MH0.G-7QRQ-fx19e5FqxOgClqq13Naq2-Jfsna7YMAwhsBk';

const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function CRMDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [sbu, setSbu] = useState('INST');
  const [clientName, setClientName] = useState('');
  const [title, setTitle] = useState('');
  const [qualStatus, setQualStatus] = useState('Draft');
  const [nextAction, setNextAction] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !title) return;
    setSubmitting(true);

    const { error } = await supabase.from('leads').insert({
      sbu,
      client_name: clientName,
      title,
      qualification_status: qualStatus,
      next_action: nextAction || null,
      next_action_date: nextActionDate || null,
      status: 'Lead',
    });

    if (!error) {
      setClientName('');
      setTitle('');
      setNextAction('');
      setNextActionDate('');
      await fetchLeads();
    } else {
      alert('Error saving record: ' + error.message);
    }
    setSubmitting(false);
  };

  const totalOpps = leads.length;
  const qualifiedCount = leads.filter((l) => l.qualification_status === 'Qualified').length;
  const proposalCount = leads.filter((l) => l.status === 'Proposal / RFP').length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              The i-Capital Africa Institute
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Lead & Proposal Master Tracker — Pipeline Advancement
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
            ● Database Connected
          </span>
        </header>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Opportunities</span>
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-bold mt-2 text-white">{totalOpps}</p>
            <p className="text-xs text-slate-500 mt-1">Active CRM Records</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Qualified Pipeline</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold mt-2 text-white">{qualifiedCount}</p>
            <p className="text-xs text-slate-500 mt-1">Screened & Verified</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Proposal Ready</span>
              <Send className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-bold mt-2 text-white">{proposalCount}</p>
            <p className="text-xs text-slate-500 mt-1">Handoff Stage</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Pipeline Velocity</span>
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold mt-2 text-white">
              {totalOpps > 0 ? `${((qualifiedCount / totalOpps) * 100).toFixed(0)}%` : '0%'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Qualification Efficiency</p>
          </div>
        </div>

        {/* Lead Intake Form */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Capture New Opportunity</h2>
          </div>
          <form onSubmit={handleCreateLead} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Strategic Business Unit (SBU)</label>
              <select
                value={sbu}
                onChange={(e) => setSbu(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="INST">INST</option>
                <option value="DAS">DAS</option>
                <option value="IIP">IIP</option>
                <option value="CBS">CBS</option>
                <option value="XU">XU</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Client / Organization</label>
              <input
                type="text"
                required
                placeholder="e.g. Bank of Abyssinia, EthSwitch"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Opportunity Scope / Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Executive Leadership Study Tour"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Qualification Status</label>
              <select
                value={qualStatus}
                onChange={(e) => setQualStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Qualified">Qualified</option>
                <option value="Disqualified">Disqualified</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Next Action</label>
              <input
                type="text"
                placeholder="e.g. Submit revised ToR compliance matrix"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Next Action Target Date</label>
              <input
                type="date"
                value={nextActionDate}
                onChange={(e) => setNextActionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Add Opportunity'}
              </button>
            </div>
          </form>
        </section>

        {/* Active Opportunities Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white">Active Opportunities Ledger</h2>
            <button
              onClick={fetchLeads}
              className="text-xs text-indigo-400 hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Lead ID</th>
                  <th className="py-3 px-4">SBU</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Opportunity Scope</th>
                  <th className="py-3 px-4">Qualification</th>
                  <th className="py-3 px-4">Next Action</th>
                  <th className="py-3 px-4">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">Loading pipeline records...</td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">No opportunities recorded yet. Add one above!</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">{lead.lead_display_id || 'LD-XXXX'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 border border-slate-700">
                          {lead.sbu}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{lead.client_name}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          lead.qualification_status === 'Qualified'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {lead.qualification_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{lead.next_action || '—'}</td>
                      <td className="py-3 px-4 text-slate-400 flex items-center gap-1.5 pt-3.5">
                        {lead.next_action_date && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                        {lead.next_action_date || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}