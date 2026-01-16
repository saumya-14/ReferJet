"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  History,
  Send,
  LogOut,
  CheckCircle2,
  Loader2,
  Inbox,
  Search,
  Bell,
  MoreHorizontal,
} from "lucide-react";

// Types
type Tab = "send" | "history";

interface EmailHistory {
  id: string;
  to: string;
  company: string;
  subject: string;
  status: "sent" | "failed";
  date: string;
}

// Dummy history data
const dummyHistory: EmailHistory[] = [
  {
    id: "1",
    to: "john.doe@example.com",
    company: "Acme Corp",
    subject: "Partnership Opportunity",
    status: "sent",
    date: "2024-01-15",
  },
  {
    id: "2",
    to: "sarah.smith@tech.io",
    company: "Tech Innovations",
    subject: "Follow-up on Proposal",
    status: "sent",
    date: "2024-01-14",
  },
  {
    id: "3",
    to: "mike.johnson@startup.com",
    company: "StartupHub",
    subject: "Introduction & Collaboration",
    status: "failed",
    date: "2024-01-13",
  },
  {
    id: "4",
    to: "emily.chen@design.co",
    company: "Design Studio",
    subject: "Project Discussion",
    status: "sent",
    date: "2024-01-12",
  },
  {
    id: "5",
    to: "alex.wong@finance.net",
    company: "Finance Net",
    subject: "Q1 Review Meeting",
    status: "sent",
    date: "2024-01-10",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("send");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<EmailHistory[]>(dummyHistory);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    companyName: "",
    subject: "",
    messageBody: "",
  });

  const handleLogout = async () => {
    // Simulate logout delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add to history (simulated)
    const newEmail: EmailHistory = {
      id: Math.random().toString(36).substr(2, 9),
      to: formData.recipientEmail,
      company: formData.companyName,
      subject: formData.subject,
      status: "sent",
      date: new Date().toISOString().split("T")[0],
    };
    setHistory([newEmail, ...history]);

    // Reset form
    setFormData({
      recipientName: "",
      recipientEmail: "",
      companyName: "",
      subject: "",
      messageBody: "",
    });

    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans text-slate-900">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
      </div>

      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-20 flex w-72 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">ReachOut</h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>
          <NavItem
            active={activeTab === "send"}
            onClick={() => setActiveTab("send")}
            icon={<Send className="h-4 w-4" />}
            label="Send Email"
          />
          <NavItem
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<History className="h-4 w-4" />}
            label="History"
          />
        </nav>

        {/* User Profile / Logout */}
        <div className="border-t border-slate-200/60 p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <span className="text-xs font-bold">JD</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-slate-700 group-hover:text-slate-900">
                John Doe
              </p>
              <p className="truncate text-xs text-slate-500">
                john@example.com
              </p>
            </div>
            <LogOut className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/50 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {activeTab === "send" ? "Compose Message" : "Email History"}
            </h2>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-sm text-slate-500">
              {activeTab === "send"
                ? "Create a new outreach campaign"
                : "Track your sent messages"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700">
              <Search className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-5xl">
            <AnimatePresence mode="wait">
              {activeTab === "send" ? (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <InputField
                              label="Recipient Name"
                              id="recipientName"
                              placeholder="e.g. Sarah Connor"
                              value={formData.recipientName}
                              onChange={handleInputChange}
                            />
                            <InputField
                              label="Recipient Email"
                              id="recipientEmail"
                              type="email"
                              placeholder="sarah@skynet.com"
                              value={formData.recipientEmail}
                              onChange={handleInputChange}
                            />
                          </div>
                          <InputField
                            label="Company Name"
                            id="companyName"
                            placeholder="e.g. Cyberdyne Systems"
                            value={formData.companyName}
                            onChange={handleInputChange}
                          />
                          <InputField
                            label="Subject"
                            id="subject"
                            placeholder="Regarding your recent inquiry..."
                            value={formData.subject}
                            onChange={handleInputChange}
                          />
                          <div>
                            <label
                              htmlFor="messageBody"
                              className="mb-2 block text-sm font-medium text-slate-700"
                            >
                              Message
                            </label>
                            <textarea
                              id="messageBody"
                              name="messageBody"
                              rows={8}
                              required
                              value={formData.messageBody}
                              onChange={handleInputChange}
                              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                              placeholder="Type your message here..."
                            />
                          </div>

                          <div className="flex items-center justify-end gap-4 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  recipientName: "",
                                  recipientEmail: "",
                                  companyName: "",
                                  subject: "",
                                  messageBody: "",
                                });
                              }}
                              className="rounded-xl px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                              Clear
                            </button>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/30 active:scale-95 disabled:opacity-70"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              {isLoading ? "Sending..." : "Send Email"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Tips / Info Section */}
                    <div className="lg:col-span-1">
                      <div className="space-y-6">
                        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
                          <h3 className="mb-2 font-semibold text-indigo-900">
                            Pro Tips
                          </h3>
                          <ul className="space-y-3 text-sm text-indigo-800/80">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                              <span>Keep your subject lines under 50 characters for better open rates.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                              <span>Personalize the first sentence to grab attention immediately.</span>
                            </li>
                          </ul>
                        </div>

                        {showSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-green-100 bg-green-50 p-6"
                          >
                            <div className="flex items-center gap-3 text-green-700">
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="font-semibold">Email Sent!</span>
                            </div>
                            <p className="mt-2 text-sm text-green-600">
                              Your message has been successfully queued for delivery.
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Recipient
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Company
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Subject
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {history.map((item, index) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group transition-colors hover:bg-slate-50/80"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                                    {item.to.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-slate-900">
                                    {item.to}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {item.company}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {item.subject}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "sent"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${item.status === "sent" ? "bg-emerald-500" : "bg-red-500"
                                    }`} />
                                  {item.status === "sent" ? "Sent" : "Failed"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {item.date}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="rounded-lg p-2 text-slate-400 opacity-0 transition-all hover:bg-white hover:text-slate-600 hover:shadow-sm group-hover:opacity-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {history.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="mb-4 rounded-full bg-slate-50 p-4">
                          <Inbox className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500">No emails sent yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper Components

function NavItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${active
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`transition-colors ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
            }`}
        >
          {icon}
        </span>
        {label}
      </div>
      {active && (
        <motion.div
          layoutId="activeNav"
          className="h-1.5 w-1.5 rounded-full bg-indigo-600"
        />
      )}
    </button>
  );
}

function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        required
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
        placeholder={placeholder}
      />
    </div>
  );
}
