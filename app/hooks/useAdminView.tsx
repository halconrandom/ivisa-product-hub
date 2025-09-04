"use client";

import { useState, createContext, useContext } from "react";

type AdminView = "announcements" | "users" | "settings" | null;

const AdminViewContext = createContext<{
  view: AdminView;
  setView: (view: AdminView) => void;
}>({
  view: null,
  setView: () => {},
});

export function AdminViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<AdminView>(null);

  return (
    <AdminViewContext.Provider value={{ view, setView }}>
      {children}
    </AdminViewContext.Provider>
  );
}

export const useAdminView = () => useContext(AdminViewContext);
