"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect } from "react";

// Create and configure lowlight instance with common languages
const lowlight = createLowlight(common);

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export function Editor({ content, onChange, editable = true, placeholder = "Start writing..." }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable any AI-related features - v1.0 is pure editing only
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Typography,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      // Convert JSON to string for storage
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      try {
        // Parse the JSON string content and set it in the editor
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        editor.commands.setContent(parsedContent);
      } catch (error) {
        // If parsing fails, treat it as plain text
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-background">
      {editable && (
        <div className="flex gap-2 mb-4 pb-4 border-b border-border flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("bold") ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("italic") ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("heading", { level: 3 }) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("bulletList") ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Bullet List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("orderedList") ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Numbered List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("codeBlock") ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Code Block
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={cn(
              "px-3 py-1 rounded text-sm font-medium transition-colors",
              editor.isActive("link") ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Link
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

// Import cn from utils
function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}
