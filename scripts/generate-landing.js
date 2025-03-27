// scripts/generate-landing.js
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();
const readmePath = path.resolve(__dirname, "../README.md");
const distDir = path.resolve(__dirname, "../dist");

// Ensure dist exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read and convert README.md
const markdown = fs.readFileSync(readmePath, "utf-8");
const htmlContent = md.render(markdown);

// Build the final HTML page
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>📘 Project Overview</title>
  <style>
    body {
      font-family: sans-serif;
      max-width: 800px;
      margin: auto;
      padding: 2rem;
      line-height: 1.6;
    }
    h1, h2, h3 {
      margin-top: 2rem;
    }
    pre {
      background: #f6f8fa;
      padding: 1rem;
      overflow-x: auto;
    }
    code {
      background: #f0f0f0;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), html);
console.log("✅ Generated landing page from README.md");
