"use client";

import { useState, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Upload,
  Paperclip,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Link2,
  Unlink,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

export default function EditorInner() {
  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [
      // Let StarterKit provide lists, blockquote, codeBlock, hr, strike, etc.
      // Only disable heading so we can control allowed levels below.
      StarterKit.configure({ heading: false }),

      // Extra marks/extensions we actually need:
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content: "<p>Start writing your announcement...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "outline-none focus:outline-none",
      },
    },
  });

  const is = useMemo(() => {
    if (!editor) return {} as any;
    return {
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      blockquote: editor.isActive("blockquote"),
      codeBlock: editor.isActive("codeBlock"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      link: editor.isActive("link"),
      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),
      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
    };
  }, [editor, editor?.state]);

  if (!editor)
    return <div className="text-sm text-neutral-500">Loading editor...</div>;

  function handlePublish() {
    if (!editor) return;
    const body = editor.getHTML();
    console.log("Published Announcement", { title, body });
  }

  function handleAttachQuiz() {
    console.log("Attach quiz logic goes here");
  }

  function setLink() {
    if (!editor) return;
    const url = window.prompt("Enter link URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  // Toolbar button styles
  const btnBase =
    "h-8 w-8 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const btn = `${btnBase} text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:shadow`;
  const btnActive = `${btnBase} bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white shadow-md`;

  return (
    <div className="bg-white dark:bg-neutral-900 text-black dark:text-white transition-colors">
      {/* Toolbar */}
      <div className="flex justify-center flex-wrap gap-1 p-3 border-b border-black/10 dark:border-white/10">
        {[
          {
            icon: <Heading1 size={16} />,
            onClick: () =>
              editor.chain().focus().toggleHeading({ level: 1 }).run(),
            active: is.h1,
            label: "Heading 1",
          },
          {
            icon: <Heading2 size={16} />,
            onClick: () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            active: is.h2,
            label: "Heading 2",
          },
          {
            icon: <Heading3 size={16} />,
            onClick: () =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
            active: is.h3,
            label: "Heading 3",
          },
          {
            icon: <BoldIcon size={16} />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            active: is.bold,
            label: "Bold",
          },
          {
            icon: <ItalicIcon size={16} />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            active: is.italic,
            label: "Italic",
          },
          {
            icon: <UnderlineIcon size={16} />,
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            active: is.underline,
            label: "Underline",
          },
          {
            icon: <Strikethrough size={16} />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            active: is.strike,
            label: "Strikethrough",
          },
          {
            icon: <Code size={16} />,
            onClick: () => editor.chain().focus().toggleCode().run(),
            active: is.code,
            label: "Inline Code",
          },
          {
            icon: <List size={16} />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            active: is.bulletList,
            label: "Bullet List",
          },
          {
            icon: <ListOrdered size={16} />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            active: is.orderedList,
            label: "Ordered List",
          },
          {
            icon: <Quote size={16} />,
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            active: is.blockquote,
            label: "Blockquote",
          },
          {
            icon: <Code size={16} />,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            active: is.codeBlock,
            label: "Code Block",
          },
          {
            icon: <Minus size={16} />,
            onClick: () => editor.chain().focus().setHorizontalRule().run(),
            active: false,
            label: "Divider",
          },
          {
            icon: <AlignLeft size={16} />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            active: is.alignLeft,
            label: "Align Left",
          },
          {
            icon: <AlignCenter size={16} />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            active: is.alignCenter,
            label: "Align Center",
          },
          {
            icon: <AlignRight size={16} />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            active: is.alignRight,
            label: "Align Right",
          },
          {
            icon: <Link2 size={16} />,
            onClick: setLink,
            active: false,
            label: "Add Link",
          },
          {
            icon: <Unlink size={16} />,
            onClick: () => editor.chain().focus().unsetLink().run(),
            active: false,
            label: "Remove Link",
            disabled: !is.link,
          },
        ].map(({ icon, onClick, active, label, disabled }, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button
                onClick={onClick}
                disabled={disabled}
                className={active ? btnActive : btn}
              >
                {icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="text-xs">
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Title */}
      <div className="p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement title..."
          className="w-full rounded-2xl px-4 py-3 bg-white dark:bg-[#0f1b22]
                     border border-black/10 dark:border-white/10
                     shadow-sm focus:outline-none focus:ring-0
                     placeholder:text-black/40 dark:placeholder:text-white/40
                     text-2xl font-semibold mb-2"
        />
      </div>

      {/* Editor */}
      <div className="px-4 pb-4">
        <div
          onClick={() => editor?.commands.focus("end")}
          role="textbox"
          tabIndex={0}
          className="cursor-text rounded-2xl border border-black/10 dark:border-white/10
                     bg-[#f7f9fa] dark:bg-[#0f1b22]
                     shadow-sm hover:shadow-md transition-shadow min-h-[300px]"
        >
          <EditorContent
            editor={editor}
            className="prose dark:prose-invert max-w-none px-4 py-3
                       text-gray-900 dark:text-gray-100 outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-3">
        <button
          onClick={handlePublish}
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 
                     bg-gradient-to-r from-[#10B981] to-[#00D474]
                     text-white shadow-sm hover:shadow-md active:scale-[0.99]
                     transition-all focus:outline-none focus:ring-0"
        >
          <Upload className="w-4 h-4" />
          Publish
        </button>

        <button
          onClick={handleAttachQuiz}
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 
                     bg-white/70 dark:bg-white/5 backdrop-blur
                     border border-black/10 dark:border-white/10
                     hover:bg-white/90 dark:hover:bg-white/10
                     text-gray-800 dark:text-gray-100
                     shadow-sm hover:shadow-md active:scale-[0.99]
                     transition-all focus:outline-none focus:ring-0"
        >
          <Paperclip className="w-4 h-4" />
          Attach Quiz
        </button>
      </div>
    </div>
  );
}
