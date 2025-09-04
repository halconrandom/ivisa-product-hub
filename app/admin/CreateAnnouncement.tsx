"use client";

import EditorInner from "../components/editor/EditorInner";

export default function CreateAnnouncement() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Create New Announcement</h2>
      <EditorInner />
    </div>
  );
}
