"use client";

import { useState } from "react";

export type TabType = "description" | "reviews" | "shipping";

interface ProductTabsProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export default function ProductTabs({
  activeTab = "description",
  onTabChange,
}: ProductTabsProps) {
  const [active, setActive] = useState<TabType>(activeTab);

  const handleTabClick = (tab: TabType) => {
    setActive(tab);
    onTabChange?.(tab);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "reviews", label: "Reviews (124)" },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="flex gap-6 sm:gap-12 min-w-max sm:min-w-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`py-4 text-base font-medium transition-colors whitespace-nowrap ${
              active === tab.id
                ? "text-(--primary) border-b-2 border-(--primary)"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
