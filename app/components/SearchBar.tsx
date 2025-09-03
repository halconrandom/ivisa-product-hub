"use client";

import { useRef, useEffect } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
}: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K to focus the input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Submit handler
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(); // safely call if passed
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-3 py-2 shadow-soft w-[320px] max-w-full"
    >
      <Search className="w-4 h-4 opacity-60" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search docs (⌘K)"
        className="bg-transparent outline-none text-sm w-full"
      />
    </form>
  );
}
