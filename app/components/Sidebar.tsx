"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  FolderOpen,
  Star,
  Bell,
  Settings,
  Globe,
  ShieldCheck,
  Megaphone,
  Users2,
  SlidersHorizontal,
  LucideIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAdminView } from "../hooks/useAdminView";

type ItemProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
};

const baseItem =
  "flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left transition-colors";
const idle = "hover:bg-[#102f3b] dark:hover:bg-[#102f3b] opacity-90";
const active = "bg-[#102f3b]";

function Item({ icon: Icon, label, href, onClick, isActive }: ItemProps) {
  const content = (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`${baseItem} ${isActive ? active : idle} cursor-pointer`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block" prefetch>
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}

export default function Sidebar() {
  const [adminOpen, setAdminOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setView, view } = useAdminView(); // ✅ context hook

  return (
    <aside className="flex flex-col justify-between w-60 p-3 bg-[#0A353F] text-white dark:bg-[#0b3a47]">
      {/* Top */}
      <div>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="spark w-8" />
          <span className="font-semibold">iVisa • Hub</span>
        </div>

        <nav className="mt-2 space-y-1">
          <Item
            icon={FileText}
            label="All Docs"
            href="/"
            isActive={pathname === "/"}
          />
          <Item
            icon={Star}
            label="Favorites"
            href="/favorites"
            isActive={pathname.startsWith("/favorites")}
          />
          <Item
            icon={FolderOpen}
            label="Spaces"
            href="/spaces"
            isActive={pathname.startsWith("/spaces")}
          />
          <Item
            icon={Bell}
            label="Announcements"
            href="/announcements"
            isActive={pathname.startsWith("/announcements")}
          />
          <Item
            icon={Globe}
            label="Embassy Updates"
            href="/embassy-updates"
            isActive={pathname.startsWith("/embassy-updates")}
          />

          {/* Admin Panel */}
          <button
            type="button"
            onClick={() => setAdminOpen((prev) => !prev)}
            className={`${baseItem} ${idle} flex items-center justify-between`}
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Admin Panel</span>
            </span>
            {adminOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {adminOpen && (
              <motion.div
                className="pl-3 pr-2 py-2 mt-1 rounded-md bg-[#004752] text-white dark:bg-[#004752] space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Item
                  icon={Megaphone}
                  label="Create Announcement"
                  onClick={() => setView("announcements")}
                  isActive={view === "announcements"}
                />
                <Item
                  icon={Users2}
                  label="Users"
                  onClick={() => setView("users")}
                  isActive={view === "users"}
                />
                <Item
                  icon={SlidersHorizontal}
                  label="Settings"
                  onClick={() => setView("settings")}
                  isActive={view === "settings"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-4 px-2 space-y-2">
        <Item
          icon={Settings}
          label="Settings"
          href="/settings"
          isActive={pathname.startsWith("/settings")}
        />
        <ModeToggle />
      </div>
    </aside>
  );
}
