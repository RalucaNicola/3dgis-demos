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

import { whenOnce } from "@arcgis/core/core/reactiveUtils";
import * as kernel from "@arcgis/core/kernel";
import "@esri/calcite-components/dist/calcite/calcite.css";
import App from "./components/App";
import AppStore from "./stores/AppStore";

console.log(`Using ArcGIS Maps SDK for JavaScript v${kernel.fullVersion}`);

// setAssetPath("https://js.arcgis.com/calcite-components/1.0.0-beta.77/assets");

const params = new URLSearchParams(document.location.search.slice(1));

const webSceneId = params.get("webscene") || "d4d4a2a8e4944946af59785938b17df9";

const skipPreload = params.has("skipPreload");

const store = new AppStore({
  webSceneId,
  skipPreload,
});

new App({
  container: "app",
  store,
});

whenOnce(() => store.sceneStore.ready).then(() => {
  (window as any)["view"] = store.sceneStore.view;
});
