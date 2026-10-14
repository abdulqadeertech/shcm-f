import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Search,
  Users,
  Clock,
  Eye,
  Sliders,
  RefreshCw,
  Server,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  ExternalLink,
  Check,
  Filter,
  Sparkles,
  Send,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { leadService, InquiryItem, InquiryStatus } from '../services/leadService';

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  country: string;
  currency: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  subscriptionPlan: string;
  subscriptionStatus: string;
  maxEmployees: number;
  companySize: string | null;
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  suspendedReason: string | null;
  employeeCount: number;
  departmentCount: number;
  branchCount: number;
  owner: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  } | null;
}

export const SuperAdminPage: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'companies' | 'inquiries' | 'audit'>('companies');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('ALL');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryNotes, setInquiryNotes] = useState('');

  // Modals state
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [companyDetailData, setCompanyDetailData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Status Action Modal (Approve / Reject / Suspend)
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    company: CompanyItem | null;
    action: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'REACTIVATE';
    reason: string;
  }>({
    open: false,
    company: null,
    action: 'APPROVE',
    reason: '',
  });

  // Subscription Modal
  const [subModal, setSubModal] = useState<{
    open: boolean;
    company: CompanyItem | null;
    plan: string;
    maxEmployees: number;
  }>({
    open: false,
    company: null,
    plan: 'STARTER',
    maxEmployees: 25,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ovRes, compRes, logRes] = await Promise.all([
        apiRequest('/superadmin/overview'),
        apiRequest(`/superadmin/companies?status=${statusFilter}&plan=${planFilter}&search=${encodeURIComponent(searchQuery)}`),
        apiRequest('/superadmin/audit-logs'),
      ]);

      setOverview(ovRes?.data || null);
      setCompanies(compRes?.data || []);
      setAuditLogs(logRes?.data || []);
    } catch (err: any) {
      console.error('Super Admin fetch error:', err);
      toastError(err?.message || 'Failed to load platform administration metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInquiries = () => {
    setInquiries(leadService.getInquiries());
  };

  useEffect(() => {
    loadData();
    refreshInquiries();

    const handleInquiryChange = () => refreshInquiries();
    window.addEventListener('smarthcm:inquiry_added', handleInquiryChange);
    window.addEventListener('smarthcm:inquiry_updated', handleInquiryChange);
    window.addEventListener('smarthcm:inquiry_deleted', handleInquiryChange);
    return () => {
      window.removeEventListener('smarthcm:inquiry_added', handleInquiryChange);
      window.removeEventListener('smarthcm:inquiry_updated', handleInquiryChange);
      window.removeEventListener('smarthcm:inquiry_deleted', handleInquiryChange);
    };
  }, [statusFilter, planFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  // Inquiry Operations
  const handleOpenInquiry = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
    setInquiryNotes(inquiry.notes || '');
    setInquiryModalOpen(true);
  };

  const handleUpdateInquiryStatus = (id: string, newStatus: InquiryStatus) => {
    const ok = leadService.updateInquiryStatus(id, newStatus);
    if (ok) {
      success(`Inquiry status transitioned to ${newStatus}.`, 'Lead Updated');
      refreshInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    }
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client inquiry?')) {
      leadService.deleteInquiry(id);
      success('Inquiry record purged from platform.', 'Lead Removed');
      refreshInquiries();
      if (selectedInquiry?.id === id) {
        setInquiryModalOpen(false);
      }
    }
  };

  const handleSaveInquiryNotes = () => {
    if (!selectedInquiry) return;
    leadService.updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, inquiryNotes);
    success('Consultation follow-up notes updated.', 'Saved');
    refreshInquiries();
    setSelectedInquiry({ ...selectedInquiry, notes: inquiryNotes });
  };

  // Open Company Dossier
  const handleOpenDetail = async (company: CompanyItem) => {
    setSelectedCompany(company);
    setDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const res = await apiRequest(`/superadmin/companies/${company.id}`);
      setCompanyDetailData(res?.data || null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load detailed company profile.');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Submit Status Change (Approve, Reject, Suspend, Reactivate)
  const handleConfirmStatusAction = async () => {
    if (!actionModal.company) return;

    let targetStatus = 'ACTIVE';
    if (actionModal.action === 'REJECT') targetStatus = 'REJECTED';
    if (actionModal.action === 'SUSPEND') targetStatus = 'SUSPENDED';
    if (actionModal.action === 'REACTIVATE' || actionModal.action === 'APPROVE') targetStatus = 'ACTIVE';

    try {
      await apiRequest(`/superadmin/companies/${actionModal.company.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: targetStatus,
          reason: actionModal.reason,
        }),
      });

      success(
        `Workspace ${actionModal.company.name} successfully updated to ${targetStatus}.`,
        'Platform Action Verified'
      );
      setActionModal({ open: false, company: null, action: 'APPROVE', reason: '' });
      loadData();
    } catch (err: any) {
      toastError(err?.message || 'Failed to update company workspace status.');
    }
  };

  // Submit Subscription Change
  const handleConfirmSubscription = async () => {
    if (!subModal.company) return;

    try {
      await apiRequest(`/superadmin/companies/${subModal.company.id}/subscription`, {
        method: 'PATCH',
        body: JSON.stringify({
          plan: subModal.plan,
          maxEmployees: Number(subModal.maxEmployees),
        }),
      });

      success(
        `Updated subscription tier to ${subModal.plan} with ${subModal.maxEmployees} employee limit.`,
        'Plan Updated'
      );
      setSubModal({ open: false, company: null, plan: 'STARTER', maxEmployees: 25 });
      loadData();
    } catch (err: any) {
      toastError(err?.message || 'Failed to update company subscription plan.');
    }
  };

  const pendingCount = overview?.companyCounts?.pending || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      <Breadcrumbs
        items={[
          { label: 'Platform Engine', to: '/dashboard' },
          { label: 'Super Administration' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#14425b]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Tenant SaaS Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global management of registered companies, approvals, strict tenant isolation, and subscription limits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[#14425b] bg-[#071c26] text-white hover:bg-[#0b2b3c] text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh Platform State</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Companies */}
        <div className="p-4 rounded-2xl bg-[#08222f] border border-[#14425b] shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Workspaces</span>
            <Building2 size={16} className="text-[#ff6f32]" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {overview?.companyCounts?.total || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-tenant companies</div>
        </div>

        {/* Active Companies */}
        <div className="p-4 rounded-2xl bg-[#08222f] border border-[#14425b] shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Workspaces</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {overview?.companyCounts?.active || 0}
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1">Operational & live</div>
        </div>

        {/* Pending Applications */}
        <div className={`p-4 rounded-2xl border shadow-md transition ${
          pendingCount > 0
            ? 'bg-amber-500/10 border-amber-500/40'
            : 'bg-[#08222f] border-[#14425b]'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Review</span>
            <Clock size={16} className={pendingCount > 0 ? 'text-amber-400' : 'text-slate-400'} />
          </div>
          <div className={`text-2xl font-black mt-2 ${pendingCount > 0 ? 'text-amber-300' : 'text-white'}`}>
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting admin sign-off</div>
        </div>

        {/* Suspended Companies */}
        <div className="p-4 rounded-2xl bg-[#08222f] border border-[#14425b] shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Suspended / Review</span>
            <PauseCircle size={16} className="text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {overview?.companyCounts?.suspended || 0}
          </div>
          <div className="text-[11px] text-rose-400/90 mt-1">Access restricted</div>
        </div>

        {/* Total Platform Employees */}
        <div className="p-4 rounded-2xl bg-[#08222f] border border-[#14425b] shadow-md col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Personnel</span>
            <Users size={16} className="text-[#ff6f32]" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {overview?.totalEmployees || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all organizations</div>
        </div>
      </div>

      {/* System Health Strip */}
      <div className="p-3.5 rounded-xl bg-[#071c26] border border-[#14425b] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Server size={15} className="text-emerald-400 shrink-0" />
          <span>Status: <strong className="text-emerald-400">OPERATIONAL</strong></span>
          <span className="text-slate-600">•</span>
          <span>Engine: <strong className="text-white">SmartHCM Enterprise SaaS Core</strong></span>
        </div>

        <div className="flex items-center space-x-4 text-slate-400 text-[11px]">
          <span>Uptime: <strong className="text-white">{Math.floor((overview?.systemHealth?.uptimeSeconds || 0) / 60)}m</strong></span>
          <span>Memory: <strong className="text-white">{overview?.systemHealth?.memoryMb || 0} MB</strong></span>
          <span>Node: <strong className="text-white">{overview?.systemHealth?.nodeVersion || 'v20'}</strong></span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#14425b]">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'companies'
              ? 'border-[#ff6f32] text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Building2 size={15} />
          <span>Registered Companies</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#ff6f32] text-white font-extrabold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'inquiries'
              ? 'border-[#ff6f32] text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare size={15} />
          <span>Client Messages & Inquiries</span>
          {inquiries.filter((i) => i.status === 'NEW').length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-extrabold animate-pulse">
              {inquiries.filter((i) => i.status === 'NEW').length} NEW
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'audit'
              ? 'border-[#ff6f32] text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Platform Audit Trail</span>
        </button>
      </div>

      {activeTab === 'companies' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#08222f] border border-[#14425b]">
              {[
                { id: 'ALL', label: 'All Companies' },
                { id: 'PENDING', label: `Pending (${pendingCount})` },
                { id: 'ACTIVE', label: 'Active' },
                { id: 'SUSPENDED', label: 'Suspended' },
                { id: 'REJECTED', label: 'Rejected' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[#ff6f32] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company or slug..."
                  className="w-full pl-8 pr-3 py-2 bg-[#08222f] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff6f32]"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#071c26] border border-[#14425b] text-white text-xs font-semibold hover:bg-[#0b2b3c] transition cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Companies Table Container */}
          <div className="bg-[#08222f] rounded-2xl border border-[#14425b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#14425b] bg-[#071c26] text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3.5">Company Workspace</th>
                    <th className="px-4 py-3.5">Owner / Contact</th>
                    <th className="px-4 py-3.5">Plan & Capacity</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Registered</th>
                    <th className="px-4 py-3.5 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14425b] text-slate-300">
                  {!Array.isArray(companies) || companies.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-xs">
                        No companies match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    companies.map((comp) => {
                      const isPending = comp.status === 'PENDING';
                      const isSuspended = comp.status === 'SUSPENDED';
                      const isActive = comp.status === 'ACTIVE';

                      return (
                        <tr key={comp.id} className="hover:bg-[#071c26]/60 transition">
                          {/* Workspace info */}
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-white text-sm">{comp.name}</div>
                            <div className="text-[11px] text-[#ff6f32] font-mono mt-0.5">
                              {comp.slug}.smarthcm.cloud
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {comp.country} • {comp.currency}
                            </div>
                          </td>

                          {/* Owner */}
                          <td className="px-4 py-3.5">
                            {comp.owner ? (
                              <div>
                                <div className="font-semibold text-white">
                                  {comp.owner.firstName} {comp.owner.lastName}
                                </div>
                                <div className="text-slate-400 text-[11px]">{comp.owner.email}</div>
                              </div>
                            ) : (
                              <span className="text-slate-500">Unassigned</span>
                            )}
                          </td>

                          {/* Plan & Capacity */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ff6f32]/15 text-[#ff6f32] border border-[#ff6f32]/30 mb-1">
                              {comp.subscriptionPlan || 'STARTER'}
                            </span>
                            <div className="text-[11px] text-slate-300">
                              <strong>{comp.employeeCount}</strong> / {comp.maxEmployees} employees
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            {isActive && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 size={12} />
                                <span>Active</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                <Clock size={12} />
                                <span>Pending Approval</span>
                              </span>
                            )}
                            {isSuspended && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                <PauseCircle size={12} />
                                <span>Suspended</span>
                              </span>
                            )}
                            {comp.status === 'REJECTED' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                                <XCircle size={12} />
                                <span>Rejected</span>
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                            {new Date(comp.createdAt).toLocaleDateString()}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            {/* View Dossier */}
                            <button
                              onClick={() => handleOpenDetail(comp)}
                              className="px-2.5 py-1 rounded-lg bg-[#071c26] hover:bg-[#0b2b3c] border border-[#14425b] text-white text-xs font-medium transition cursor-pointer"
                              title="Inspect Workspace Dossier"
                            >
                              <Eye size={13} className="inline mr-1" />
                              <span>View</span>
                            </button>

                            {/* Plan Limit Modal */}
                            <button
                              onClick={() =>
                                setSubModal({
                                  open: true,
                                  company: comp,
                                  plan: comp.subscriptionPlan || 'STARTER',
                                  maxEmployees: comp.maxEmployees || 25,
                                })
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#071c26] hover:bg-[#0b2b3c] border border-[#14425b] text-slate-200 text-xs font-medium transition cursor-pointer"
                              title="Manage Plan & Capacity"
                            >
                              <Sliders size={13} className="inline mr-1" />
                              <span>Plan</span>
                            </button>

                            {/* Approve Button */}
                            {isPending && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    open: true,
                                    company: comp,
                                    action: 'APPROVE',
                                    reason: '',
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                              >
                                Approve
                              </button>
                            )}

                            {/* Reject Button */}
                            {isPending && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    open: true,
                                    company: comp,
                                    action: 'REJECT',
                                    reason: '',
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition cursor-pointer"
                              >
                                Reject
                              </button>
                            )}

                            {/* Suspend Button */}
                            {isActive && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    open: true,
                                    company: comp,
                                    action: 'SUSPEND',
                                    reason: '',
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-medium transition cursor-pointer"
                              >
                                Suspend
                              </button>
                            )}

                            {/* Reactivate Button */}
                            {isSuspended && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    open: true,
                                    company: comp,
                                    action: 'REACTIVATE',
                                    reason: '',
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                              >
                                Reactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="bg-[#08222f] rounded-2xl border border-[#14425b] overflow-hidden shadow-xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#14425b]">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck size={18} className="text-[#ff6f32]" />
              <span>Platform Administrative Audit Log</span>
            </h3>
            <span className="text-xs text-slate-400">Immutable Compliance Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#14425b] text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Company</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#14425b] text-slate-300">
                {!Array.isArray(auditLogs) || auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      No administrative logs found.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#071c26]/60 transition">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {log.actorEmail || 'System Core'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#071c26] border border-[#14425b] text-[#ff6f32]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {log.organization?.name || log.organizationId}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] font-mono truncate max-w-xs">
                        {log.detailsJson || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiries & Client Messages Tab */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {/* Inquiry Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#08222f] border border-[#14425b] shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Inquiries</span>
                <MessageSquare size={16} className="text-[#ff6f32]" />
              </div>
              <div className="text-2xl font-black text-white mt-2">
                {inquiries.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">From all marketing touchpoints</div>
            </div>

            <div className={`p-4 rounded-2xl border shadow-md transition ${
              inquiries.filter((i) => i.status === 'NEW').length > 0
                ? 'bg-amber-500/10 border-amber-500/40'
                : 'bg-[#08222f] border-[#14425b]'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>New / Unread Leads</span>
                <Clock size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300 mt-2">
                {inquiries.filter((i) => i.status === 'NEW').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Requires sales callback</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#08222f] border border-[#14425b] shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>In Discussion</span>
                <Phone size={16} className="text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">
                {inquiries.filter((i) => i.status === 'CONTACTED' || i.status === 'QUALIFIED').length}
              </div>
              <div className="text-[11px] text-sky-400/90 mt-1">Proposal or demo stage</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#08222f] border border-[#14425b] shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Converted Clients</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                {inquiries.filter((i) => i.status === 'CONVERTED').length}
              </div>
              <div className="text-[11px] text-emerald-400/90 mt-1">Active workspaces created</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-[#08222f] rounded-2xl border border-[#14425b] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#051822] border border-[#14425b]">
              {[
                { id: 'ALL', label: `All (${inquiries.length})` },
                { id: 'NEW', label: `New (${inquiries.filter((i) => i.status === 'NEW').length})` },
                { id: 'CONTACTED', label: 'Contacted' },
                { id: 'QUALIFIED', label: 'Qualified' },
                { id: 'CONVERTED', label: 'Converted' },
                { id: 'CLOSED', label: 'Closed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setInquiryStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    inquiryStatusFilter === tab.id
                      ? 'bg-[#ff6f32] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Channel / Type Filter & Search Box */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <select
                value={inquiryTypeFilter}
                onChange={(e) => setInquiryTypeFilter(e.target.value)}
                className="px-3 py-2 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white focus:outline-none focus:border-[#ff6f32]"
              >
                <option value="ALL">All Touchpoints</option>
                <option value="CONTACT_US">Contact Us Consultation</option>
                <option value="DEMO_REQUEST">Demo Requests</option>
                <option value="SALES_INQUIRY">Sales Inquiries</option>
                <option value="COMPANY_APPLICATION">Company Applications</option>
              </select>

              <div className="relative flex-1 sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lead or company..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6f32]"
                />
              </div>
            </div>
          </div>

          {/* Inquiries Data Table */}
          <div className="bg-[#08222f] rounded-2xl border border-[#14425b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#14425b] text-slate-400 uppercase text-[10px] font-bold bg-[#071c26]">
                    <th className="py-3 px-3.5">Received</th>
                    <th className="py-3 px-3.5">Channel / Touchpoint</th>
                    <th className="py-3 px-3.5">Contact Person & Company</th>
                    <th className="py-3 px-3.5">Official Email & Phone</th>
                    <th className="py-3 px-3.5">Referral Source</th>
                    <th className="py-3 px-3.5">Message / Interest</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14425b] text-slate-300">
                  {inquiries
                    .filter((inq) => {
                      const matchStatus = inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter;
                      const matchType = inquiryTypeFilter === 'ALL' || inq.type === inquiryTypeFilter;
                      const q = inquirySearch.toLowerCase();
                      const matchSearch =
                        !q ||
                        inq.fullName.toLowerCase().includes(q) ||
                        inq.companyName.toLowerCase().includes(q) ||
                        inq.email.toLowerCase().includes(q) ||
                        inq.phone.toLowerCase().includes(q) ||
                        inq.message.toLowerCase().includes(q);
                      return matchStatus && matchType && matchSearch;
                    })
                    .map((inq) => {
                      let typeLabel = 'Contact Us';
                      let typeClass = 'bg-[#ff6f32]/10 text-[#ff6f32] border-[#ff6f32]/30';
                      if (inq.type === 'DEMO_REQUEST') {
                        typeLabel = 'Demo Request';
                        typeClass = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
                      } else if (inq.type === 'SALES_INQUIRY') {
                        typeLabel = 'Sales Inq';
                        typeClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                      } else if (inq.type === 'COMPANY_APPLICATION') {
                        typeLabel = 'Application';
                        typeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                      }

                      return (
                        <tr key={inq.id} className="hover:bg-[#071c26]/60 transition">
                          <td className="py-3.5 px-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {new Date(inq.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          <td className="py-3.5 px-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeClass}`}>
                              {typeLabel}
                            </span>
                          </td>

                          <td className="py-3.5 px-3.5">
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{inq.fullName}</span>
                              {inq.status === 'NEW' && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">{inq.companyName}</div>
                            {inq.teamSize && (
                              <div className="text-[10px] text-slate-500">{inq.teamSize}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-3.5 text-xs font-mono">
                            <div className="flex items-center space-x-1">
                              <a
                                href={`mailto:${inq.email}?subject=${encodeURIComponent(`SmartHCM Enterprise Follow-Up: ${inq.companyName}`)}`}
                                className="text-white hover:text-[#ff6f32] transition"
                              >
                                {inq.email}
                              </a>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              <a href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-emerald-400">
                                {inq.phone}
                              </a>
                            </div>
                          </td>

                          <td className="py-3.5 px-3.5 text-[11px] text-slate-400">
                            {inq.source || 'Direct Website'}
                          </td>

                          <td className="py-3.5 px-3.5 max-w-xs">
                            <div className="text-slate-300 truncate font-normal" title={inq.message}>
                              {inq.message}
                            </div>
                            {inq.moduleInterest && (
                              <div className="text-[10px] text-[#ff6f32] truncate mt-0.5">
                                Req: {inq.moduleInterest}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as InquiryStatus)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border bg-[#051822] cursor-pointer focus:outline-none ${
                                inq.status === 'NEW'
                                  ? 'border-amber-500/50 text-amber-300'
                                  : inq.status === 'CONTACTED'
                                  ? 'border-sky-500/50 text-sky-300'
                                  : inq.status === 'QUALIFIED'
                                  ? 'border-purple-500/50 text-purple-300'
                                  : inq.status === 'CONVERTED'
                                  ? 'border-emerald-500/50 text-emerald-300'
                                  : 'border-slate-600 text-slate-400'
                              }`}
                            >
                              <option value="NEW">NEW (Unread)</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="QUALIFIED">QUALIFIED</option>
                              <option value="CONVERTED">CONVERTED (Client)</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleOpenInquiry(inq)}
                                title="View Message & Dossier"
                                className="p-1.5 rounded-lg bg-[#071c26] border border-[#14425b] text-slate-300 hover:text-white hover:border-[#ff6f32] transition cursor-pointer"
                              >
                                <Eye size={13} />
                              </button>
                              <a
                                href={`mailto:${inq.email}?subject=${encodeURIComponent(`SmartHCM Consultation: ${inq.companyName}`)}`}
                                title="Reply via Email"
                                className="p-1.5 rounded-lg bg-[#071c26] border border-[#14425b] text-sky-400 hover:bg-sky-500/10 transition"
                              >
                                <Mail size={13} />
                              </a>
                              <a
                                href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`}
                                title="Call Client Phone"
                                className="p-1.5 rounded-lg bg-[#071c26] border border-[#14425b] text-emerald-400 hover:bg-emerald-500/10 transition"
                              >
                                <Phone size={13} />
                              </a>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                title="Delete Record"
                                className="p-1.5 rounded-lg bg-[#071c26] border border-[#14425b] text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Detailed View Modal */}
      {inquiryModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#08222f] border border-[#14425b] rounded-2xl max-w-xl w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#14425b]">
              <div>
                <span className="text-[10px] font-bold text-[#ff6f32] uppercase tracking-wider">
                  Client Inquiry Dossier • #{selectedInquiry.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedInquiry.companyName}
                </h3>
              </div>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="p-4 bg-[#051822] rounded-xl border border-[#14425b] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Primary Contact:</span>
                <div className="font-bold text-white text-sm">{selectedInquiry.fullName}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Company / Org:</span>
                <div className="font-bold text-white text-sm">{selectedInquiry.companyName}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Official Email:</span>
                <div>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-sky-400 font-mono hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Contact Phone:</span>
                <div>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-emerald-400 font-mono hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Company Size:</span>
                <div className="text-white">{selectedInquiry.teamSize || 'Not specified'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Lead Channel / Source:</span>
                <div className="text-[#ff6f32]">{selectedInquiry.source || 'Website'}</div>
              </div>
            </div>

            {/* Requested Modules */}
            {selectedInquiry.moduleInterest && (
              <div className="p-3 bg-[#051822] rounded-xl border border-[#14425b] text-xs">
                <span className="text-slate-400 text-[11px] block mb-1">Modules of Interest:</span>
                <span className="font-bold text-white">{selectedInquiry.moduleInterest}</span>
              </div>
            )}

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Message & Requirements:
              </label>
              <div className="p-3.5 bg-[#051822] rounded-xl border border-[#14425b] text-xs text-slate-200 leading-relaxed max-h-36 overflow-y-auto">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Internal Sales / Follow-Up Notes:
              </label>
              <textarea
                rows={2}
                value={inquiryNotes}
                onChange={(e) => setInquiryNotes(e.target.value)}
                placeholder="Log discussion notes, pricing quote sent, or next follow-up meeting..."
                className="w-full px-3 py-2 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6f32]"
              />
              <div className="flex justify-end mt-1.5">
                <button
                  onClick={handleSaveInquiryNotes}
                  className="px-3 py-1 bg-[#14425b] hover:bg-[#1a5575] text-white text-[11px] font-semibold rounded-lg transition cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 border-t border-[#14425b] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-semibold">Change Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as InquiryStatus)}
                  className="px-2.5 py-1.5 bg-[#051822] border border-[#14425b] rounded-lg text-xs text-white"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CONVERTED">CONVERTED (Client)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`SmartHCM Enterprise Proposal: ${selectedInquiry.companyName}`)}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <Mail size={13} />
                  <span>Reply Email</span>
                </a>
                <a
                  href={`tel:${selectedInquiry.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <Phone size={13} />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => setInquiryModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#071c26] border border-[#14425b] text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Status Action Confirmation (Approve / Reject / Suspend) */}
      {actionModal.open && actionModal.company && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#08222f] border border-[#14425b] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {actionModal.action === 'APPROVE' && 'Approve Company Application'}
              {actionModal.action === 'REJECT' && 'Reject Company Application'}
              {actionModal.action === 'SUSPEND' && 'Suspend Company Workspace'}
              {actionModal.action === 'REACTIVATE' && 'Reactivate Company Workspace'}
            </h3>

            <p className="text-xs text-slate-300">
              Workspace: <strong className="text-white">{actionModal.company.name}</strong> ({actionModal.company.slug})
            </p>

            {(actionModal.action === 'REJECT' || actionModal.action === 'SUSPEND') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for {actionModal.action.toLowerCase()} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={actionModal.reason}
                  onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
                  placeholder="Enter reason for audit and notification record..."
                  className="w-full px-3 py-2 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff6f32]"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ open: false, company: null, action: 'APPROVE', reason: '' })}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#14425b] bg-[#071c26] text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusAction}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer ${
                  actionModal.action === 'REJECT' || actionModal.action === 'SUSPEND'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-[#ff6f32] hover:bg-[#ea580c]'
                }`}
              >
                Confirm {actionModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Manage Subscription & Plan Capacity */}
      {subModal.open && subModal.company && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#08222f] border border-[#14425b] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sliders size={18} className="text-[#ff6f32]" />
              <span>Modify Subscription & Entitlement</span>
            </h3>

            <p className="text-xs text-slate-300">
              Workspace: <strong className="text-white">{subModal.company.name}</strong>
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subscription Tier *
                </label>
                <select
                  value={subModal.plan}
                  onChange={(e) => {
                    const nextPlan = e.target.value;
                    const defaultCap = nextPlan === 'ENTERPRISE' ? 1000 : nextPlan === 'GROWTH' ? 100 : 25;
                    setSubModal({ ...subModal, plan: nextPlan, maxEmployees: defaultCap });
                  }}
                  className="w-full px-3 py-2 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff6f32]"
                >
                  <option value="STARTER" className="bg-[#08222f]">Starter Tier</option>
                  <option value="GROWTH" className="bg-[#08222f]">Growth Tier</option>
                  <option value="ENTERPRISE" className="bg-[#08222f]">Enterprise Tier</option>
                  <option value="TRIAL" className="bg-[#08222f]">Evaluation Trial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Maximum Active Employee Limit *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={subModal.maxEmployees}
                  onChange={(e) => setSubModal({ ...subModal, maxEmployees: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff6f32]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Enforces server-side quota on employee onboarding.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setSubModal({ open: false, company: null, plan: 'STARTER', maxEmployees: 25 })}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#14425b] bg-[#071c26] text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubscription}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ff6f32] hover:bg-[#ea580c] text-white transition cursor-pointer"
              >
                Save Subscription Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Comprehensive Company Dossier */}
      {detailModalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#08222f] border border-[#14425b] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-left shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#14425b]">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCompany.name}</h3>
                <div className="text-xs text-[#ff6f32] font-mono mt-0.5">
                  {selectedCompany.slug}.smarthcm.cloud
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                <RefreshCw size={16} className="animate-spin text-[#ff6f32]" />
                <span>Loading company ledger records...</span>
              </div>
            ) : companyDetailData ? (
              <div className="space-y-4 text-xs">
                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-[#051822] rounded-xl border border-[#14425b]">
                    <div className="text-slate-400 text-[10px]">Employees</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {companyDetailData.metrics?.employees || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-[#051822] rounded-xl border border-[#14425b]">
                    <div className="text-slate-400 text-[10px]">Departments</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {companyDetailData.metrics?.departments || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-[#051822] rounded-xl border border-[#14425b]">
                    <div className="text-slate-400 text-[10px]">Payroll Runs</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {companyDetailData.metrics?.payrollRuns || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-[#051822] rounded-xl border border-[#14425b]">
                    <div className="text-slate-400 text-[10px]">Leave Requests</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {companyDetailData.metrics?.leaveRequests || 0}
                    </div>
                  </div>
                </div>

                {/* Company Owner & Metadata */}
                <div className="p-4 bg-[#051822] rounded-xl border border-[#14425b] space-y-2">
                  <div className="font-bold text-white text-xs">Primary Organization Owner</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div>
                      Email: <strong className="text-white">{selectedCompany.owner?.email || 'N/A'}</strong>
                    </div>
                    <div>
                      Name: <strong className="text-white">{selectedCompany.owner?.firstName} {selectedCompany.owner?.lastName}</strong>
                    </div>
                    <div>
                      Phone: <strong className="text-white">{selectedCompany.phone || 'N/A'}</strong>
                    </div>
                    <div>
                      Operating Country: <strong className="text-white">{selectedCompany.country}</strong>
                    </div>
                  </div>
                </div>

                {/* Subscription History */}
                <div className="space-y-2">
                  <div className="font-bold text-white text-xs">Subscription Entitlement Records</div>
                  <div className="p-3 bg-[#051822] rounded-xl border border-[#14425b] divide-y divide-[#14425b]">
                    {!Array.isArray(companyDetailData?.subscriptionHistory) || companyDetailData.subscriptionHistory.length === 0 ? (
                      <div className="text-slate-500 py-2">No past billing transactions.</div>
                    ) : (
                      companyDetailData.subscriptionHistory.map((sub: any) => (
                        <div key={sub.id} className="py-2 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-bold text-white">{sub.plan} Tier</span>
                            <span className="text-slate-500 ml-2">({sub.maxEmployees} seats)</span>
                          </div>
                          <div className="text-slate-400 font-mono">
                            {new Date(sub.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#071c26] border border-[#14425b] text-white hover:bg-[#0b2b3c] transition cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
