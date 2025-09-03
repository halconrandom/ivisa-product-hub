"use client";

import { useMemo, useState } from "react";
import type { DriveFile } from "../hooks/useDrive";
import { Search } from "lucide-react";

export default function PreviewPane({
  file,
  text,
}: {
  file: DriveFile | null;
  text: string;
}) {
  const [needle, setNeedle] = useState("");

  const matches = useMemo(() => {
    if (!text || !needle) return [];
    const lower = text.toLowerCase();
    const n = needle.toLowerCase();
    const idxs: number[] = [];
    let i = lower.indexOf(n);
    while (i !== -1 && idxs.length < 50) {
      idxs.push(i);
      i = lower.indexOf(n, i + n.length);
    }
    return idxs.map((i) => ({
      i,
      before: text.slice(Math.max(0, i - 40), i),
      hit: text.slice(i, i + n.length),
      after: text.slice(i + n.length, i + n.length + 60),
    }));
  }, [text, needle]);

  if (!file)
    return (
      <div className="h-full grid place-items-center opacity-60">
        Select a document
      </div>
    );

  const isDoc = file.mimeType === "application/vnd.google-apps.document";
  const isPdf = file.mimeType === "application/pdf";
  const isFolder = file.mimeType === "application/vnd.google-apps.folder";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="font-medium">{file.name}</div>
        <a
          href={file.webViewLink}
          target="_blank"
          className="text-xs underline opacity-80"
        >
          Open in Drive
        </a>
      </div>

      <div className="flex h-full">
        {/* Sidebar with search (only for Google Docs) */}
        {isDoc && (
          <div className="w-[420px] border-r border-neutral-200 dark:border-neutral-800 p-3 space-y-2">
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-3 py-2">
              <Search className="w-4 h-4 opacity-60" />
              <input
                value={needle}
                onChange={(e) => setNeedle(e.target.value)}
                placeholder="Search in doc"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <div className="text-xs opacity-70">Matches ({matches.length})</div>
            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {matches.map((m, idx) => (
                <div
                  key={idx}
                  className="text-sm p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <span className="opacity-60">{m.before}</span>
                  <span className="bg-yellow-200/60 dark:bg-yellow-700/50 rounded px-0.5">
                    {m.hit}
                  </span>
                  <span className="opacity-60">{m.after}</span>
                </div>
              ))}
              {!matches.length && (
                <div className="text-xs opacity-50">No matches yet</div>
              )}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-6 text-sm whitespace-pre-wrap bg-white dark:bg-black">
          {isDoc && text ? (
            text
          ) : isPdf ? (
            <embed
              src={`/api/drive/export-pdf?fileId=${file.id}`}
              type="application/pdf"
              className="w-full h-full"
            />
          ) : isFolder ? (
            <div className="text-xs opacity-50">
              Folders cannot be previewed here.
            </div>
          ) : (
            <div className="text-xs opacity-50">
              This file type cannot be previewed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
