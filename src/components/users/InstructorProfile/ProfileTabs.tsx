import React from "react";

export type Tab = "Overview" | "Assigned Classes" | "Activites";

export default function ProfileTabs({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: Tab[];
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <div className="flex gap-3 sm:gap-8 border-b border-gray-200 mb-4 sm:mb-8 overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 text-xs sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap
            ${activeTab === tab
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500 border-b-2 border-transparent hover:text-red-600"}
            bg-transparent
          `}
          style={{ outline: "none", background: "none" }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}