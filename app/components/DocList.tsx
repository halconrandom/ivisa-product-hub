"use client";

import type { DriveFile } from "../hooks/useDrive";

export default function DocList({
  files = [],
  onOpen,
}: {
  files?: DriveFile[];
  onOpen: (f: DriveFile) => void;
}) {
  if (!files.length) {
    return (
      <div className="px-3 py-6 text-sm opacity-60">
        No documents yet. Try a different search.
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {files.map((f) => (
        <button
          key={f.id}
          onClick={() => onOpen(f)}
          className="w-full text-left px-3 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="truncate font-medium">{f.name}</div>
              <div className="text-xs opacity-60 truncate">
                {new Date(f.modifiedTime).toLocaleString()} • {mimeLabel(f.mimeType)}
              </div>
            </div>
            {/* tiny type chip */}
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 opacity-70">
              {shortMime(f.mimeType)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function mimeLabel(m: string) {
  if (m === "application/pdf") return "PDF";
  if (m === "application/vnd.google-apps.document") return "Google Doc";
  if (m === "application/vnd.google-apps.folder") return "Folder";
  return m.split("/")[1] ?? m;
}

function shortMime(m: string) {
  if (m === "application/pdf") return "PDF";
  if (m === "application/vnd.google-apps.document") return "DOC";
  if (m === "application/vnd.google-apps.folder") return "DIR";
  return (m.split("/")[1] ?? m).slice(0, 6).toUpperCase();
}
