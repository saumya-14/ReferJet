"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  History,
  Send,
  LogOut,
  CheckCircle2,
  XCircle,
  Loader2,
  Inbox,
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
];

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("send");
  const [isLoading, setIsLoading] = useState(false);
  const [history] = useState<EmailHistory[]>(dummyHistory);

  // Form state
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    companyName: "",
    subject: "",
    messageBody: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({
      recipientName: "",
      recipientEmail: "",
      companyName: "",
      subject: "",
      messageBody: "",
    });

    setIsLoading(false);
    // In a real app, you'd show a success toast here
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex w-64 flex-col border-r border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-lg"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 p-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30"
          >
            <Mail className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ReachOut
            </h1>
            <p className="text-xs text-slate-500">Email Sender</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("send")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "send"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              <Send className="h-4 w-4" />
              Send Email
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("history")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              <History className="h-4 w-4" />
              History
            </motion.button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-slate-200/80 p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-md"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="border-b border-slate-200/80 bg-white/40 backdrop-blur-xl shadow-sm"
        >
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {activeTab === "send" ? "Send Email" : "Email History"}
              </h2>
              <p className="text-xs text-slate-500">
                {activeTab === "send"
                  ? "Compose and send personalized emails"
                  : "View your email sending history"}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === "send" ? (
              <motion.div
                key="send"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-2xl"
              >
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50"
                >
                  <div className="space-y-6">
                    {/* Recipient Name */}
                    <div>
                      <label
                        htmlFor="recipientName"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        id="recipientName"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Recipient Email */}
                    <div>
                      <label
                        htmlFor="recipientEmail"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        id="recipientEmail"
                        name="recipientEmail"
                        value={formData.recipientEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label
                        htmlFor="companyName"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Acme Corporation"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Partnership Opportunity"
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <label
                        htmlFor="messageBody"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Message Body
                      </label>
                      <textarea
                        id="messageBody"
                        name="messageBody"
                        value={formData.messageBody}
                        onChange={handleInputChange}
                        required
                        rows={8}
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Email
                        </span>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-6xl"
              >
                {history.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl p-16 shadow-xl shadow-slate-200/50"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mb-4 rounded-full bg-slate-100 p-6"
                    >
                      <Inbox className="h-12 w-12 text-slate-400" />
                    </motion.div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-800">
                      No emails sent yet
                    </h3>
                    <p className="text-sm text-slate-500">
                      Your email history will appear here once you start sending
                      emails.
                    </p>
                  </motion.div>
                ) : (
                  <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200/80 bg-slate-50/50">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                              To
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Company
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Subject
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80">
                          {history.map((item, index) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{
                                backgroundColor: "rgba(99, 102, 241, 0.05)",
                              }}
                              className="cursor-pointer transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-900">
                                  {item.to}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-600">
                                  {item.company}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-slate-900 max-w-md truncate">
                                  {item.subject}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <motion.span
                                  whileHover={{ scale: 1.05 }}
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                    item.status === "sent"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {item.status === "sent" ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <XCircle className="h-3 w-3" />
                                  )}
                                  {item.status === "sent" ? "Sent" : "Failed"}
                                </motion.span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-500">
                                  {new Date(item.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
