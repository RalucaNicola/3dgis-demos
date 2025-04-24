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

import {
  property,
  subclass,
} from "@arcgis/core/core/accessorSupport/decorators";

import { tsx } from "@arcgis/core/widgets/support/widget";

import AppStore from "../stores/AppStore";
import { Widget } from "./Widget";

import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";

import { ArcgisSceneCustomEvent } from "@arcgis/map-components";
import "@arcgis/map-components/dist/components/arcgis-compass";
import "@arcgis/map-components/dist/components/arcgis-navigation-toggle";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import AppMenu from "./AppMenu";
import StartupDialog from "./StartupDialog";
import User from "./User";
import ViewshedPreview from "./ViewshedPreview";

type AppProperties = Pick<App, "store">;

@subclass()
class App extends Widget<AppProperties> {
  @property()
  store: AppStore;

  private bindView(arcgisScene: HTMLArcgisSceneElement) {
    const view = arcgisScene.view;
    this.store.sceneStore.view = view;
    view.popupEnabled = false;
  }

  render() {
    return (
      <div>
        <calcite-shell>
          <StartupDialog store={this.store}></StartupDialog>
          <User store={this.store}></User>
          <AppMenu store={this.store}></AppMenu>
          <ViewshedPreview store={this.store.viewshedStore}></ViewshedPreview>
          <arcgis-scene
            item-id={this.store.webSceneId}
            onArcgisViewReadyChange={(e: ArcgisSceneCustomEvent<void>) =>
              this.bindView(e.target)
            }
          ></arcgis-scene>
        </calcite-shell>
      </div>
    );
  }
}

export default App;
