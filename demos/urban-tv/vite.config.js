import path from "path";
import { createBaseConfig } from "../../vite.config.base.js";

const appName = path.basename(__dirname);

export default createBaseConfig({
  appName,
  outDir: `../../dist/${appName}`,
});
