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

import AppStore from "../stores/AppStore";

import { tsx } from "@arcgis/core/widgets/support/widget";

import "@esri/calcite-components/dist/components/calcite-shell";
import { ScreenType } from "../interfaces";
import DownloadScreen from "./DownloadScreen";
import TimeScreen from "./TimeScreen";
import UploadScreen from "./UploadScreen";
import Viewshed from "./ViewshedScreen";

function renderScreen(store: AppStore) {
  const screenStore = store.currentScreenStore;
  switch (screenStore?.type) {
    case ScreenType.Time:
      return <TimeScreen store={screenStore}></TimeScreen>;
    case ScreenType.Download:
      return <DownloadScreen store={screenStore}></DownloadScreen>;
    case ScreenType.Upload:
      return <UploadScreen store={screenStore}></UploadScreen>;
    case ScreenType.Viewshed:
      return <Viewshed store={screenStore}></Viewshed>;
  }
}

const AppScreen = ({ store }: { store: AppStore }) => {
  return (
    <calcite-shell id="screen" content-behind="true">
      {renderScreen(store)}
    </calcite-shell>
  );
};

export default AppScreen;
