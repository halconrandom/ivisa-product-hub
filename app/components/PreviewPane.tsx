"use client";

import { useEffect, useMemo, useRef, useState, ReactElement } from "react";
import type { DriveFile } from "../hooks/useDrive";
import { Search } from "lucide-react";

export default function PreviewPane({
  file,
  text,
  jumpTo,
  onJumpConsumed,
}: {
  file: DriveFile | null;
  text: string;
  jumpTo?: string | null;
  onJumpConsumed?: () => void;
}) {
  const [needle, setNeedle] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isDoc = file?.mimeType === "application/vnd.google-apps.document";
  const isPdf = file?.mimeType === "application/pdf";
  const isFolder = file?.mimeType === "application/vnd.google-apps.folder";

  const matches = useMemo(() => {
    const t = text ?? "";
    const n = (needle || "").trim();
    if (!t || !n) return [];
    const lower = t.toLowerCase();
    const q = n.toLowerCase();
    const out: Array<{ start: number; length: number }> = [];
    let p = 0;
    while (out.length < 50) {
      const i = lower.indexOf(q, p);
      if (i === -1) break;
      out.push({ start: i, length: q.length });
      p = i + q.length;
    }
    return out;
  }, [text, needle]);

  // If jumpTo is provided (from global search), scroll to the first hit
  useEffect(() => {
    if (!isDoc || !jumpTo) return;
    setNeedle(jumpTo);

    const id = setTimeout(() => {
      const el = document.querySelector('[data-hit="0"]') as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      onJumpConsumed?.();
    }, 100);

    return () => clearTimeout(id);
  }, [isDoc, jumpTo, onJumpConsumed]);

  if (!file)
    return (
      <div className="h-full grid place-items-center opacity-60">
        Select a document
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="font-medium truncate">{file.name}</div>
        <a
          href={file.webViewLink}
          target="_blank"
          className="text-xs underline opacity-80"
        >
          Open in Drive
        </a>
      </div>

      <div className="flex h-full">
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
          </div>
        )}

        <div
          ref={containerRef}
          className="flex-1 overflow-auto p-6 text-sm whitespace-pre-wrap bg-white dark:bg-black"
        >
          {isDoc ? (
            <DocText text={text} matches={matches} />
          ) : isPdf ? (
            <embed
              src={`/api/drive/export-pdf?fileId=${file.id}`}
              type="application/pdf"
              className="w-full h-[calc(100vh-120px)]"
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

function DocText({
  text,
  matches,
}: {
  text: string;
  matches: Array<{ start: number; length: number }>;
}) {
  if (!text)
    return <div className="text-xs opacity-60">No content to display.</div>;
  if (!matches.length) return <pre className="whitespace-pre-wrap">{text}</pre>;

  const spans: React.ReactElement[] = [];
  let cursor = 0;

  matches.forEach((m, idx) => {
    if (m.start > cursor) {
      spans.push(
        <span key={`t-${idx}-pre`}>{text.slice(cursor, m.start)}</span>
      );
    }
    spans.push(
      <mark
        key={`t-${idx}-hit`}
        data-hit={idx}
        className="rounded px-0.5 bg-yellow-200 dark:bg-yellow-600"
      >
        {text.slice(m.start, m.start + m.length)}
      </mark>
    );
    cursor = m.start + m.length;
  });
  if (cursor < text.length) {
    spans.push(<span key="t-tail">{text.slice(cursor)}</span>);
  }

  return <pre className="whitespace-pre-wrap leading-6">{spans}</pre>;
}
