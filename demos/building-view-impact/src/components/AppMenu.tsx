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

import { tsx } from "@arcgis/core/widgets/support/widget";

import "@esri/calcite-components/dist/components/calcite-card";
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-loader";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-shell-panel";

import AppStore from "../stores/AppStore";
import Intro from "./Intro";
import UploadScreen from "./UploadScreen";
import ViewshedScreen from "./ViewshedScreen";

const AppMenu = ({ store }: { store: AppStore }) => {
  return (
    <calcite-shell-panel slot="panel-start" position="start">
      <div class="container">
        <Intro></Intro>
        {store.uploadStore ? (
          <UploadScreen store={store.uploadStore}></UploadScreen>
        ) : (
          <div></div>
        )}
        {store.viewshedStore ? (
          <ViewshedScreen store={store.viewshedStore}></ViewshedScreen>
        ) : (
          <div></div>
        )}
      </div>
    </calcite-shell-panel>
  );
};

export default AppMenu;
