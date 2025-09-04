// components/AdminMainView.tsx
"use client";

import { useAdminView } from "../hooks/useAdminView";
import EditorInner from "./editor/EditorInner";
import CreateAnnouncement from "../admin/CreateAnnouncement";

export default function AdminMainView() {
  const { view } = useAdminView();

  if (view === "announcements") {
    return <CreateAnnouncement />;
  }

  if (view === "users") {
    return (
      <p className="text-sm text-muted-foreground">
        User management coming soon.
      </p>
    );
  }

  if (view === "settings") {
    return (
      <p className="text-sm text-muted-foreground">
        Settings panel coming soon.
      </p>
    );
  }

  return (
    <div className="text-sm text-neutral-500">
      Select an admin section from the sidebar.
    </div>
  );
}
