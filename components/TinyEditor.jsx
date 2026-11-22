"use client";

import { Editor } from "@tinymce/tinymce-react";

// Self-hosted TinyMCE — no cloud API key.
// Assets are copied to public/tinymce by scripts/copy-tinymce.js (postinstall).
export default function TinyEditor({ value, onChange, height = 220 }) {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      value={value || ""}
      onEditorChange={(content) => onChange && onChange(content)}
      init={{
        height,
        menubar: false,
        plugins: "link lists code preview",
        toolbar:
          "formatselect | bold italic underline | bullist numlist | link | alignleft aligncenter alignright | removeformat | code preview",
        block_formats: "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6",
        branding: false,
        promotion: false,
        license_key: "gpl",
      }}
    />
  );
}
