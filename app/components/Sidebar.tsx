import { motion } from "framer-motion";
import {
  FileText,
  FolderOpen,
  Star,
  Bell,
  Settings,
  Globe,
} from "lucide-react";

export default function Sidebar() {
  const Item = ({ icon: Icon, label }: any) => (
    <motion.button
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900"
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
  return (
    <aside className="w-60 p-3 border-r border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="spark w-8" />
        <span className="font-semibold">iVisa • Hub</span>
      </div>
      <nav className="mt-2 space-y-1">
        <Item icon={FileText} label="All Docs" />
        <Item icon={Star} label="Favorites" />
        <Item icon={FolderOpen} label="Spaces" />
        <Item icon={Bell} label="Announcements" />
        <Item icon={Globe} label="Embassy Updates" />
      </nav>
      <div className="mt-6 px-2">
        <Item icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}