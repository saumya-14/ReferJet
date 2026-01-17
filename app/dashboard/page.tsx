"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  History,
  LayoutGrid,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Search,
  Loader2,
  ChevronRight,
  MoreHorizontal,
  Users,
  FileText,
  Send,
  Eye,
  CheckCircle2,
  Settings,
  X
} from "lucide-react";

// --- Types ---

type View = "campaigns" | "editor" | "history";

interface Recipient {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Campaign {
  id: string;
  name: string;
  status: "draft" | "sent";
  recipients: Recipient[];
  template: {
    subject: string;
    body: string;
  };
  createdAt: string;
}

interface HistoryItem {
  id: string;
  campaignName: string;
  recipientEmail: string;
  status: "sent" | "failed";
  date: string;
}

// --- Dummy Data ---

const initialCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q1 Outreach",
    status: "draft",
    recipients: [
      { id: "1", name: "Sarah Connor", email: "sarah@skynet.com", company: "Cyberdyne" },
      { id: "2", name: "John Doe", email: "john@doe.com", company: "Acme Corp" },
    ],
    template: {
      subject: "Partnership Opportunity",
      body: "Hi {{name}},\n\nI noticed that {{company}} is doing great things...",
    },
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Beta Testers Invite",
    status: "sent",
    recipients: [],
    template: { subject: "", body: "" },
    createdAt: "2024-01-10",
  },
];

const dummyHistory: HistoryItem[] = [
  { id: "1", campaignName: "Beta Testers Invite", recipientEmail: "alex@test.com", status: "sent", date: "2024-01-10" },
  { id: "2", campaignName: "Beta Testers Invite", recipientEmail: "sam@test.com", status: "sent", date: "2024-01-10" },
];

// --- Main Component ---

export default function Dashboard() {
  const router = useRouter();

  // Navigation State
  const [currentView, setCurrentView] = useState<View>("campaigns");

  // Data State
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [history, setHistory] = useState<HistoryItem[]>(dummyHistory);

  // Editor State
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---

  const handleCreateCampaign = () => {
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Untitled Campaign",
      status: "draft",
      recipients: [],
      template: { subject: "", body: "" },
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEditingCampaign(newCampaign);
    setCurrentView("editor");
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign({ ...campaign }); // Clone to avoid direct mutation
    setCurrentView("editor");
  };

  const handleSaveCampaign = (savedCampaign: Campaign) => {
    setCampaigns((prev) => {
      const exists = prev.find((c) => c.id === savedCampaign.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCampaign.id ? savedCampaign : c));
      }
      return [savedCampaign, ...prev];
    });
    setEditingCampaign(null); // Clear editing state used for dirty checking if needed
    setCurrentView("campaigns");
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    setIsLoading(true);
    // Simulate API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update campaign status
    const sentCampaign = { ...campaign, status: "sent" as const };
    handleSaveCampaign(sentCampaign);

    // Add to History
    const newHistoryItems = campaign.recipients.map(r => ({
      id: Math.random().toString(36).substr(2, 9),
      campaignName: campaign.name,
      recipientEmail: r.email,
      status: "sent" as const,
      date: new Date().toISOString().split("T")[0]
    }));
    setHistory(prev => [...newHistoryItems, ...prev]);

    setIsLoading(false);
  };

  const handleDeleteCampaign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleLogout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans text-slate-900">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onChangeView={(view) => {
          // If switching away from editor, maybe warn? For now just switch.
          setCurrentView(view);
          setEditingCampaign(null);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <Header
          title={
            currentView === "campaigns" ? "Campaigns" :
              currentView === "history" ? "Outreach History" :
                "Edit Campaign"
          }
          currentView={currentView}
          onCreateClick={handleCreateCampaign}
        />

        {/* Content Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              {currentView === "campaigns" && (
                <CampaignsList
                  key="campaigns"
                  campaigns={campaigns}
                  onEdit={handleEditCampaign}
                  onDelete={handleDeleteCampaign}
                />
              )}

              {currentView === "editor" && editingCampaign && (
                <CampaignEditor
                  key="editor"
                  campaign={editingCampaign}
                  onSave={handleSaveCampaign}
                  onSend={handleSendCampaign}
                  onCancel={() => setCurrentView("campaigns")}
                  isLoading={isLoading}
                />
              )}

              {currentView === "history" && (
                <HistoryView key="history" history={history} />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function Sidebar({
  currentView,
  onChangeView,
  onLogout
}: {
  currentView: View;
  onChangeView: (v: View) => void;
  onLogout: () => void;
}) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="relative z-20 hidden w-64 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl md:flex"
    >
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <Mail className="h-5 w-5" />
          </div>
          <span className="font-bold text-slate-800">ReachOut</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        <NavItem
          active={currentView === "campaigns" || currentView === "editor"}
          onClick={() => onChangeView("campaigns")}
          icon={<LayoutGrid className="h-4 w-4" />}
          label="Campaigns"
        />
        <NavItem
          active={currentView === "history"}
          onClick={() => onChangeView("history")}
          icon={<History className="h-4 w-4" />}
          label="History"
        />
      </nav>

      <div className="border-t border-slate-200/60 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
    >
      <span className={active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"}> {icon} </span>
      {label}
    </button>
  )
}

function Header({ title, currentView, onCreateClick }: { title: string, currentView: View, onCreateClick: () => void }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/50 px-8 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      </div>
      {currentView === "campaigns" && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-slate-900/30 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create Campaign</span>
        </button>
      )}
    </header>
  )
}

// --- View: Campaigns List ---

function CampaignsList({ campaigns, onEdit, onDelete }: { campaigns: Campaign[], onEdit: (c: Campaign) => void, onDelete: (id: string, e: React.MouseEvent) => void }) {
  if (campaigns.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-6">
          <LayoutGrid className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No campaigns yet</h3>
        <p className="max-w-xs text-sm text-slate-500 mt-2">Create your first outreach campaign to get started.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          onClick={() => onEdit(campaign)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${campaign.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${campaign.status === 'sent' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {campaign.status === 'sent' ? 'Sent' : 'Draft'}
            </div>
            <button
              onClick={(e) => onDelete(campaign.id, e)}
              className="rounded-lg p-2 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mb-1 text-lg font-semibold text-slate-900">{campaign.name}</h3>
          <p className="mb-4 text-sm text-slate-500">Created on {campaign.createdAt}</p>

          <div className="flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {campaign.recipients.length} Recipients
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// --- View: Campaign Editor ---

function CampaignEditor({
  campaign,
  onSave,
  onSend,
  onCancel,
  isLoading
}: {
  campaign: Campaign,
  onSave: (c: Campaign) => void,
  onSend: (c: Campaign) => void,
  onCancel: () => void,
  isLoading: boolean
}) {
  const [localCampaign, setLocalCampaign] = useState<Campaign>(campaign);
  const [activeRecipientPreview, setActiveRecipientPreview] = useState<Recipient | null>(null);

  // Initialize preview if recipients exist
  if (!activeRecipientPreview && localCampaign.recipients.length > 0) {
    setActiveRecipientPreview(localCampaign.recipients[0]);
  }

  const updateName = (name: string) => setLocalCampaign(prev => ({ ...prev, name }));

  const addRecipient = () => {
    if (localCampaign.recipients.length >= 20) return alert("Max 20 recipients");
    const newRecipient: Recipient = {
      id: Math.random().toString(),
      name: "",
      email: "",
      company: ""
    };
    setLocalCampaign(prev => ({ ...prev, recipients: [...prev.recipients, newRecipient] }));
    if (!activeRecipientPreview) setActiveRecipientPreview(newRecipient);
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setLocalCampaign(prev => ({
      ...prev,
      recipients: prev.recipients.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const removeRecipient = (id: string) => {
    setLocalCampaign(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r.id !== id)
    }));
    if (activeRecipientPreview?.id === id) setActiveRecipientPreview(null);
  };

  const previewBody = (template: string, recipient: Recipient | null) => {
    if (!recipient) return template;
    return template
      .replace(/{{name}}/g, recipient.name || "(name)")
      .replace(/{{company}}/g, recipient.company || "(company)");
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex h-[calc(100vh-140px)] flex-col gap-6">

      {/* Top Bar of Editor */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={localCampaign.name}
            onChange={(e) => updateName(e.target.value)}
            placeholder="Campaign Name"
            className="w-full max-w-lg rounded-xl border-transparent bg-transparent px-0 py-2 text-2xl font-bold text-slate-900 placeholder-slate-300 focus:border-indigo-500 focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onSave(localCampaign)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Save Draft
          </button>
          <button
            onClick={() => onSend(localCampaign)}
            disabled={isLoading || localCampaign.recipients.length === 0}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/30 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send Campaign
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">

        {/* Left: Recipients */}
        <div className="flex w-1/2 flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              Recipients
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{localCampaign.recipients.length} / 20</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {localCampaign.recipients.map((recipient, i) => (
              <div key={recipient.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="pt-3 text-xs font-medium text-slate-400 w-4">{i + 1}</span>
                <div className="grid flex-1 grid-cols-3 gap-2">
                  <input
                    placeholder="Name"
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={recipient.name}
                    onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                  />
                  <input
                    placeholder="Email"
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={recipient.email}
                    onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                  />
                  <input
                    placeholder="Company"
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={recipient.company}
                    onChange={(e) => updateRecipient(recipient.id, 'company', e.target.value)}
                  />
                </div>
                <button onClick={() => removeRecipient(recipient.id)} className="p-2 text-slate-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addRecipient}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Add Recipient
            </button>
          </div>
        </div>

        {/* Right: Template & Preview */}
        <div className="flex w-1/2 flex-col gap-4">

          {/* Template Editor */}
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-4 bg-slate-50/50">
              <input
                placeholder="Email Subject"
                value={localCampaign.template.subject}
                onChange={(e) => setLocalCampaign(prev => ({ ...prev, template: { ...prev.template, subject: e.target.value } }))}
                className="w-full bg-transparent text-sm font-medium placeholder-slate-400 focus:outline-none"
              />
            </div>
            <textarea
              className="flex-1 resize-none p-4 text-sm leading-relaxed text-slate-700 focus:outline-none"
              placeholder="Write your email template here... &#10;Use {{name}} for name &#10;Use {{company}} for company"
              value={localCampaign.template.body}
              onChange={(e) => setLocalCampaign(prev => ({ ...prev, template: { ...prev.template, body: e.target.value } }))}
            />
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2">
              <p className="text-xs text-slate-400">Available variables: <span className="font-mono text-indigo-500">{"{{name}}"}</span>, <span className="font-mono text-indigo-500">{"{{company}}"}</span></p>
            </div>
          </div>

          {/* Live Preview */}
          <div className="h-1/3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-inner">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Eye className="h-3 w-3" /> Live Preview
              </h4>
              <select
                className="rounded-lg border-none bg-white py-1 pl-2 pr-6 text-xs text-slate-600 shadow-sm focus:ring-0"
                onChange={(e) => {
                  const r = localCampaign.recipients.find(rec => rec.id === e.target.value);
                  setActiveRecipientPreview(r || null);
                }}
                value={activeRecipientPreview?.id || ""}
              >
                {localCampaign.recipients.length === 0 && <option>No recipients added</option>}
                {localCampaign.recipients.map(r => (
                  <option key={r.id} value={r.id}>{r.name || "Unnamed"}</option>
                ))}
              </select>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm text-sm text-slate-600 whitespace-pre-wrap h-full overflow-y-auto">
              {previewBody(localCampaign.template.body, activeRecipientPreview)}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// --- View: History ---

function HistoryView({ history }: { history: HistoryItem[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Campaign</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Recipient</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {history.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.campaignName}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item.recipientEmail}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Sent
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {history.length === 0 && <div className="p-8 text-center text-slate-500">No history available yet.</div>}
    </motion.div>
  );
}
