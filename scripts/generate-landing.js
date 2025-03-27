// scripts/generate-landing.js
const fs = require("fs");
const path = require("path");
// const MarkdownIt = require("markdown-it");

// const md = new MarkdownIt();
// const readmePath = path.resolve(__dirname, "../README.md");
// const distDir = path.resolve(__dirname, "../dist");

// // Ensure dist exists
// if (!fs.existsSync(distDir)) {
//   fs.mkdirSync(distDir, { recursive: true });
// }

// // Read and convert README.md
// const markdown = fs.readFileSync(readmePath, "utf-8");
// const htmlContent = md.render(markdown);

// Build the final HTML page
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script>
    window.location.replace("https://3dgis.maps.arcgis.com/home/content.html?view=grid&focus=applications-web#org");
  </script>
  ${htmlContent}
</body>
</html>
`;

// fs.writeFileSync(path.join(distDir, "index.html"), html);
console.log("✅ Generated landing page");
