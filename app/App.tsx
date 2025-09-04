"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import AnnouncementRail from "./components/AnnouncementRail";
import SearchBar from "./components/SearchBar";
import DocList from "./components/DocList";
import PreviewPane from "./components/PreviewPane";
import AdminMainView from "./components/AdminMainView";
import { useDrive } from "./hooks/useDrive";
import { AdminViewProvider, useAdminView } from "./hooks/useAdminView";

export default function AppWrapper() {
  return (
    <AdminViewProvider>
      <App />
    </AdminViewProvider>
  );
}

function App() {
  const { files, selected, selectFile, q, setQ, docText, openBestMatch } =
    useDrive();
  const [showRight] = useState(true);
  const { view } = useAdminView();

  return (
    <div
      className="h-screen grid"
      style={{
        gridTemplateColumns: showRight ? "240px 1fr 320px" : "240px 1fr",
      }}
    >
      <Sidebar />

      <main className="flex flex-col">
        <div className="p-3 flex max-w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
          <SearchBar value={q} onChange={setQ} onSubmit={openBestMatch} />
          <div className="text-xs opacity-60 hidden md:block">
            Tip: ⌘K / CTRL+K to focus search
          </div>
        </div>

        <div className="h-[calc(100vh-60px)] overflow-auto p-3">
          {view ? (
            <AdminMainView />
          ) : (
            <div className="grid grid-cols-2 h-full">
              <DocList files={files} onOpen={selectFile} />
              <div className="border-l border-neutral-200 dark:border-neutral-800">
                <PreviewPane file={selected} text={docText} />
              </div>
            </div>
          )}
        </div>
      </main>

      {showRight && <AnnouncementRail />}
    </div>
  );
}
