import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

// Same extensions as the editor
const extensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Link.configure({
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
];

export function tiptapJsonToHtml(jsonContent: string): string {
  try {
    const json = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
    return generateHTML(json, extensions);
  } catch (error) {
    console.error("Failed to convert Tiptap JSON to HTML:", error);
    return jsonContent; // Return raw content as fallback
  }
}
