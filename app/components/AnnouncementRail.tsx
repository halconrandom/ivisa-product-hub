import { Pin, X } from "lucide-react";
import { useState } from "react";
import { seedAnnouncements } from "../data/announcements";

export default function AnnouncementRail() {
  const [items, setItems] = useState(seedAnnouncements || []);
  function dismiss(id: string) {
    setItems((s) => s.filter((i) => i.id !== id));
  }
  function togglePin(id: string) {
    setItems((s) =>
      s.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i))
    );
  }

  const pinned = items.filter((i) => i.pinned);
  const rest = items.filter((i) => !i.pinned);

  return (
    <aside className="w-80 border-l border-neutral-200 dark:border-neutral-800 p-3 space-y-3">
      <div className="text-sm font-semibold">Announcements</div>
      {[...pinned, ...rest].map((a) => (
        <div
          key={a.id}
          className="rounded-2xl p-3 bg-white/60 dark:bg-neutral-900/50 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <a href={a.href} className="font-medium hover:underline">
              {a.title}
            </a>
            <div className="flex gap-2">
              <button onClick={() => togglePin(a.id)} title="Pin">
                <Pin
                  className={"w-4 h-4 " + (a.pinned ? "text-emerald-500" : "")}
                />
              </button>
              <button onClick={() => dismiss(a.id)} title="Dismiss">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs mt-1 opacity-80">{a.date}</div>
          <p className="text-sm mt-1">{a.body}</p>
        </div>
      ))}
    </aside>
  );
}
