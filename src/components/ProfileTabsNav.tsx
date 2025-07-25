import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Ticket,
  Heart,
  History,
  CreditCard,
  Smartphone,
  Settings,
} from "lucide-react";
import React from "react";
import i18n from "@/lib/i18n";

interface ProfileTabsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  t: (key: string) => string;
}

const tabList = [
  {
    value: "bookings",
    labelKey: "profilepage.profileTabs.bookings",
    icon: Ticket,
  },
  {
    value: "favorites",
    labelKey: "profilepage.profileTabs.favorites",
    icon: Heart,
  },
  {
    value: "visits",
    labelKey: "profilepage.profileTabs.visits",
    icon: History,
  },
  {
    value: "billing",
    labelKey: "profilepage.profileTabs.billing",
    icon: CreditCard,
  },
  {
    value: "nfc",
    labelKey: "profilepage.profileTabs.nfc",
    icon: Smartphone,
  },
  {
    value: "settings",
    labelKey: "profilepage.profileTabs.settings",
    icon: Settings,
  },
];

export const ProfileTabsNav: React.FC<ProfileTabsNavProps> = ({
  activeTab,
  setActiveTab,
  t,
}) => {
  const isRTL = i18n.language && i18n.language.startsWith("ar");
  return (
    <div
      className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide"
      style={{ WebkitOverflowScrolling: "touch" }}
      dir={isRTL ? "rtl" : undefined}
    >
      <TabsList className="flex flex-nowrap gap-2 px-2 py-1 min-w-max">
        {tabList.map(({ value, labelKey, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex items-center gap-1 whitespace-nowrap shrink-0 px-3 py-2 text-sm md:justify-center"
            onClick={() => setActiveTab(value)}
          >
            <Icon className="h-4 w-4" />
            {t(labelKey)}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};
