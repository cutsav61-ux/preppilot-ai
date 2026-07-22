import { LayoutDashboard, History, User, Settings, PlusCircle, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Route isn't built yet — shown but not clickable, with a "Soon" badge. */
  comingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "New interview", href: ROUTES.interviewNew, icon: PlusCircle },
  { label: "History", href: ROUTES.history, icon: History },
  { label: "Profile", href: ROUTES.profile, icon: User },
  { label: "Settings", href: ROUTES.settings, icon: Settings, comingSoon: true },
];
