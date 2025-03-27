// scripts/generate-landing.js
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "../dist");
const appsDir = path.resolve(distDir);
const apps = fs.readdirSync(appsDir).filter((file) => {
  const appPath = path.join(appsDir, file);
  return fs.statSync(appPath).isDirectory() && file !== "assets";
});

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>App Launcher</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; }
    h1 { font-size: 2rem; }
    ul { list-style-type: none; padding-left: 0; }
    li { margin: 0.5rem 0; }
    a { text-decoration: none; color: #0366d6; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Available Apps</h1>
  <ul>
    ${apps.map((app) => `<li><a href="${app}/">${app}</a></li>`).join("\n")}
  </ul>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), html);
console.log("✅ Landing page generated!");
