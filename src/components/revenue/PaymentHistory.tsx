'use client';
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaDownload } from "react-icons/fa";
import { formatDateCustom } from "@/lib/dateFormatter";
import { boDashboardService } from '@/services/bo-dashboard.service';

// --- Export Modal ---
const exportOptions = [
  {
    key: "pdf",
    label: "As PDF",
    svg: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"></svg>
    ),
  },
  {
    key: "xlsx",
    label: "As XLSX",
    svg: (
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none"></svg>
    ),
  },
  {
    key: "csv",
    label: "As CSV",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"></svg>
    ),
  },
];

function ExportModal({ onClose, onExport }: { onClose: () => void; onExport: (format: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div
      className="bg-white rounded-md shadow-lg border border-gray-200 w-56 py-2"
      style={{
        position: "absolute",
        top: "110%",
        right: 0,
        zIndex: 100,
      }}
    >
      {exportOptions.map((opt) => {
        const isActive = selected === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            className={`flex items-center w-full px-4 py-2 gap-3 text-left transition
              ${isActive ? "bg-red-50" : ""}
              rounded-md group`}
            onClick={() => {
              setSelected(opt.key);
              onExport(opt.key);
              onClose();
            }}
          >
            <span
              className={`transition ${
                isActive ? "text-red-600" : "text-gray-500"
              }`}
            >
              {React.cloneElement(opt.svg, {
                ...(isActive
                  ? { color: "#E51B1B" }
                  : { color: "#A1A1A1" }),
              })}
            </span>
            <span
              className={`font-medium transition ${
                isActive ? "text-red-600" : "text-gray-700"
              }`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// --- Payment History Component ---
type PaymentRow = {
  dojo: string;
  plan: string;
  amount: string;
  date: string;
  status: string;
  statusColor: string;
};

type PaymentHistoryProps = {
  filter: "today" | "week" | "month" | "all" | "custom";
  customRange?: { start?: string; end?: string };
};

function getStatusColor(status: string) {
  if (status.toLowerCase() === "paid") return "bg-green-500";
  return "bg-yellow-500";
}

export default function PaymentHistory({ filter, customRange }: PaymentHistoryProps) {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Fetch payment history from back-office API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const page = 1;
        const limit = 20;
        const resp = await boDashboardService.getPaymentHistory(page, limit);
        const data = resp.data || [];
        if (cancelled) return;
        setRows(
          (data || []).map((t: any) => ({
            dojo: t.className || t.dojoName || "N/A",
            plan: t.subscription_plan || t.plan || "",
            amount: t.amount ? `£${t.amount}` : "N/A",
            date: t.paidAt ? formatDateCustom(t.paidAt) : (t.createdAt ? formatDateCustom(t.createdAt) : "N/A"),
            status: t.status || (t.paymentStatus ? t.paymentStatus : "Paid"),
            statusColor: getStatusColor(t.status || (t.paymentStatus ? t.paymentStatus : "Paid")),
          }))
        );
      } catch (err) {
        console.error('Failed to load payment history', err);
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [filter, customRange]);

  // Export handler
  const handleExport = async (format: string) => {
    setLoading(true);
    try {
      const blob = await boDashboardService.exportPaymentHistory();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-history.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export payment history.');
    } finally {
      setLoading(false);
    }
  };

  // Empty state
  if (loading || rows.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 mt-8 relative">
        <div className="flex flex-col items-center justify-center w-full h-full" style={{ minHeight: 220 }}>
          <img
src="https://res.cloudinary.com/cloud-two-tech/image/upload/v1750963970/Illustration_found_gfbbgd.png"
            alt="No payment history"
            className="w-32 h-32 sm:w-48 sm:h-48 mb-6 opacity-80"
          />
          <span className="text-gray-400 font-bold text-xs sm:text-base">
            No payment history found.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mt-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <span className="text-sm sm:text-base font-semibold text-black">Payment History</span>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center relative w-full sm:w-auto">
          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded-md bg-white px-2 py-1 sm:px-3 sm:py-2 w-full sm:w-auto mb-2 sm:mb-0">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none bg-transparent text-xs sm:text-sm text-gray-500 placeholder-gray-400 w-full sm:w-32 md:w-40"
              disabled
            />
          </div>
          {/* Filter */}
          <div className="flex items-center border border-gray-300 rounded-md bg-white px-2 py-1 sm:px-3 sm:py-2 w-full sm:w-auto mb-2 sm:mb-0">
            <FaFilter className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Filter"
              className="outline-none bg-transparent text-xs sm:text-sm text-gray-500 placeholder-gray-400 w-full sm:w-16 md:w-24"
              disabled
            />
          </div>
          {/* Export */}
          <div className="relative w-full sm:w-auto">
            <button
              className="flex items-center gap-2 bg-red-600 border border-gray-300 rounded-md px-4 py-2 text-xs sm:text-sm text-white font-medium w-full sm:w-auto"
              onClick={() => setShowExport((v) => !v)}
              type="button"
            >
              <FaDownload className="text-white" />
              Export
            </button>
            {showExport && (
              <ExportModal
                onClose={() => setShowExport(false)}
                onExport={handleExport}
              />
            )}
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-md overflow-x-auto">
        <table className="min-w-[700px] w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-black font-semibold">Dojo Name</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-black font-semibold">Plan</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-black font-semibold">Amount</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-black font-semibold">Date</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-black font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-600">{row.dojo}</td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-600">{row.plan}</td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-600">{row.amount}</td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-600">{row.date}</td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${row.statusColor}`}></span>
                    <span>{row.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}