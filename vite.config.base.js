import MarkdownIt from "markdown-it";
import { defineConfig } from "vite";

export function createBaseConfig({
  appName,
  outDir = `../../dist/${appName}`,
}) {
  return defineConfig({
    server: {
      port: 3000,
    },
    base: "./",
    build: {
      target: "es2020",
      outDir,
      emptyOutDir: true,
    },
    plugins: [
      mdToHtmlPlugin({
        markdownItOptions: {
          // Optionally pass any markdown-it options here.
          html: true,
          linkify: true,
          typographer: true,
        },
      }),
    ],
  });
}
function mdToHtmlPlugin(options = {}) {
  const md = new MarkdownIt(options.markdownItOptions || {});

  return {
    name: "md-to-html",
    transform(src, id) {
      // Check if the file is a Markdown file.
      if (id.endsWith(".md")) {
        // Convert the raw Markdown source to HTML.
        const html = md.render(src);
        // Return a JS module that exports the HTML string.
        return {
          code: `export default ${JSON.stringify(html)};`,
          map: null,
        };
      }
    },
  };
}
