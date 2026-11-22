// Copies self-hosted TinyMCE assets into public/tinymce so the editor
// works with NO cloud API key. Runs automatically on postinstall.
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "tinymce");
const dest = path.join(__dirname, "..", "public", "tinymce");

try {
  if (!fs.existsSync(src)) {
    console.log("[copy-tinymce] tinymce package not found, skipping.");
    process.exit(0);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log("[copy-tinymce] Copied TinyMCE assets to public/tinymce");
} catch (err) {
  console.error("[copy-tinymce] Failed:", err.message);
  // Do not fail install if copy fails; editor will show a clear note.
  process.exit(0);
}
