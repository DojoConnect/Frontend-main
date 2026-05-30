import React, { useState } from "react";
import ExportModal from "./ExportModal";
import CreateClassModal from "./CreateClassModal";

interface SearchFilterExportProps {
  dojoName?: string;
  ownerEmail?: string;
  showCreate?: boolean;
  onCreateNew?: () => void;
}

export default function SearchFilterExport({
  dojoName = "Test Dojo",
  ownerEmail = "admin@example.com",
  showCreate = true,
  onCreateNew,
}: SearchFilterExportProps) {
  const [showExport, setShowExport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        style={{
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Inputs: 2 per row on mobile, flex-start on desktop */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:items-start">
          {/* Search */}
          <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white w-full">
            <span className="text-gray-400 mr-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="outline-none bg-transparent text-xs sm:text-sm w-full"
            />
          </div>
          {/* Filter */}
          <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white w-full">
            <span className="text-gray-400 mr-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 14 14.414V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 8 17V14.414a1 1 0 0 0-.293-.707L1.293 6.707A1 1 0 0 1 1 6V4z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Filter"
              className="outline-none bg-transparent text-xs sm:text-sm w-full"
            />
          </div>
        </div>
        {/* Right Buttons: 2 per row on mobile, flex-end on desktop */}
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:justify-end md:items-center">
          {showCreate && (
            <button
              className="flex items-center gap-2 bg-red-600 text-white rounded-md px-4 py-2 font-medium shadow hover:bg-red-700 transition w-full md:w-auto text-xs sm:text-sm"
              style={{ fontSize: "0.95rem" }}
              onClick={() => {
                if (onCreateNew) onCreateNew();
                else setShowCreateModal(true);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}
          <div className="w-full md:w-auto">
            <button
              className="flex items-center gap-2 bg-white border border-red-600 rounded-md px-4 py-2 font-medium text-red-600 shadow hover:bg-red-50 transition w-full md:w-auto text-xs sm:text-sm"
              onClick={() => setShowExport((v) => !v)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h12"/>
              </svg>
              Export
            </button>
            {showExport && (
              <ExportModal onClose={() => setShowExport(false)} />
            )}
          </div>
        </div>
        <CreateClassModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          dojoName={dojoName}
          ownerEmail={ownerEmail}
          onCreated={() => setShowCreateModal(false)}
        />
      </div>
    </>
  );
}