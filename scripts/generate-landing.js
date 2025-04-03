/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// scripts/generate-landing.js
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

// Patch the default link renderer
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex("href");

  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1];

    // Replace links that start with './docs/'
    if (href.startsWith("./")) {
      token.attrs[hrefIndex][1] = href.replace(
        "./",
        "https://github.com/esri/3dgis-demos/blob/main/",
      );
    }
  }

  return defaultRender(tokens, idx, options, env, self);
};

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
  <title>3D GIS Demos</title>
  <style>
    body {
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
  </style>
  <script type="module" src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"></script>
</head>
<body>
  ${htmlContent}
</body>
</html>
`;

const htmlPath = path.join(distDir, "index.html");

fs.writeFileSync(htmlPath, html);
console.log("✅ Generated landing page from README.md", readmePath, htmlPath);
