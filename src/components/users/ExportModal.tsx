import React, { useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";

const exportOptions = [
  {
    key: "csv",
    label: "As CSV",
    ext: "csv",
    svg: <FaFileCsv size={16} />, // smaller icon
  },
  {
    key: "xls",
    label: "As XLS",
    ext: "xlsx",
    svg: <FaFileExcel size={16} />, // smaller icon
  },
  {
    key: "pdf",
    label: "As PDF",
    ext: "pdf",
    svg: <FaFilePdf size={16} />, // smaller icon
  },
];

const ExportModal = ({
  onClose,
  filters = {},
  includeAll = true,
}: {
  onClose: () => void;
  filters?: Record<string, any>;
  includeAll?: boolean;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleExport = async (format: string, key: string) => {
    setSelected(key);
    setDownloading(true);
    try {
      const res = await fetch("https://apis.dojoconnect.app/export/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          include_all: includeAll,
          filters: includeAll ? undefined : filters,
        }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (e) {
      alert("Failed to export users.");
    }
    setDownloading(false);
  };

  return (
    <div
      className="bg-white rounded-md shadow-lg border border-gray-200 w-48 py-1.5"
      style={{
        position: "absolute",
        top: "110%",
        right: 0,
        zIndex: 100,
        overflow: "visible",
      }}
    >
      {/* Responsive: On mobile, show two export buttons per row */}
      <div className="flex flex-col gap-1 sm:block">
        <div className="flex flex-row gap-1 sm:flex-col">
          {exportOptions.slice(0, 2).map((opt) => {
            const isActive = selected === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                className={`flex-1 flex items-center w-full px-2.5 py-1.5 gap-2 text-left transition
                  ${isActive ? "bg-red-50" : "hover:bg-red-50"}
                  rounded-md group`}
                style={{ fontSize: "13px" }}
                disabled={downloading}
                onClick={() => handleExport(opt.ext, opt.key)}
              >
                <span
                  className={`transition ${
                    isActive ? "text-red-600" : "text-gray-500"
                  }`}
                  style={{ minWidth: 18, minHeight: 18 }}
                >
                  {React.cloneElement(opt.svg as any, {
                    color: isActive ? "#E51B1B" : "#A1A1A1",
                  })}
                </span>
                <span
                  className={`font-medium transition ${
                    isActive ? "text-red-600" : "text-gray-700"
                  }`}
                  style={{ fontSize: "13px" }}
                >
                  {downloading && isActive ? "Exporting..." : opt.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-row gap-1 sm:flex-col mt-1 sm:mt-0">
          {exportOptions.slice(2).map((opt) => {
            const isActive = selected === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                className={`flex-1 flex items-center w-full px-2.5 py-1.5 gap-2 text-left transition
                  ${isActive ? "bg-red-50" : "hover:bg-red-50"}
                  rounded-md group`}
                style={{ fontSize: "13px" }}
                disabled={downloading}
                onClick={() => handleExport(opt.ext, opt.key)}
              >
                <span
                  className={`transition ${
                    isActive ? "text-red-600" : "text-gray-500"
                  }`}
                  style={{ minWidth: 18, minHeight: 18 }}
                >
                  {React.cloneElement(opt.svg as any, {
                    color: isActive ? "#E51B1B" : "#A1A1A1",
                  })}
                </span>
                <span
                  className={`font-medium transition ${
                    isActive ? "text-red-600" : "text-gray-700"
                  }`}
                  style={{ fontSize: "13px" }}
                >
                  {downloading && isActive ? "Exporting..." : opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;