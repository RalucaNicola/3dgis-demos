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

import Accessor from "@arcgis/core/core/Accessor";
import {
  property,
  subclass,
} from "@arcgis/core/core/accessorSupport/decorators";
import { whenOnce } from "@arcgis/core/core/reactiveUtils";
import Geometry from "@arcgis/core/geometry/Geometry";
import Polygon from "@arcgis/core/geometry/Polygon";
import SceneModifications from "@arcgis/core/layers/support/SceneModifications";
// import { originGraphic, waterGraphic } from "../constants";
// import { ScreenType } from "../interfaces";
// import { createToggle } from "../snippet";
// import DownloadStore from "./DownloadStore";
// import RealisticStore from "./RealisticStore";
import SceneStore from "./SceneStore";
// import TimeStore from "./TimeStore";
// import UploadStore from "./UploadStore";
import { default as ExampleStore, default as UploadStore } from './UploadStore';
import UserStore from "./UserStore";
import ViewshedStore from "./ViewshedStore";
// import ViewshedStore from "./ViewshedStore";

type AppStoreProperties = Pick<AppStore, "webSceneId" | "skipPreload">;

export type ScreenStoreUnion = ExampleStore | ViewshedStore;

@subclass()
class AppStore extends Accessor {
  @property({ constructOnly: true })
  webSceneId: string;

  @property({ constructOnly: true })
  sceneStore = new SceneStore();

  @property()
  get skipStartupDialog() {
    return localStorage.getItem("skipStartupDialog") === "true";
  }
  set skipStartupDialog(skip: boolean) {
    localStorage.setItem("skipStartupDialog", `${skip}`);
  }

  @property()
  isStartupDialogShown = true;

  @property()
  skipPreload = true;

  @property()
  title: string;

  @property({ constructOnly: true })
  userStore = new UserStore();

  @property()
  viewshedStore: ViewshedStore;

  @property()
  uploadStore: UploadStore;

  @property()
  get loading() {
    return this._loading;
  }

  @property()
  private _loading: "scene" | "delete-models" | "preload-slides" | "done" =
    "scene";

  @property({ constructOnly: true })
  deviceId: string;

  @property()
  selectedArea: Geometry;

  @property()
  uploadedFootprint: Polygon;


  private modifications: SceneModifications | nullish;

  @property()
  get currentScreenStore() {
    return this._currentScreen;
  }
  set currentScreenStore(screen: ScreenStoreUnion | null) {
    const current = this._currentScreen;
    if (current) {
      current.destroy();
    }
    this._currentScreen = screen;
  }

  @property({})
  private _currentScreen: ScreenStoreUnion | null;

  constructor(props: AppStoreProperties) {
    super(props);

    let deviceId = localStorage.getItem("deviceId");
    if (deviceId === null) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }
    this.deviceId = deviceId;

    // this.addHandles([
    //   watch(
    //     () => this.uploadedFootprint,
    //     () => this.updateFootprintFilter(),
    //   ),
    //   {
    //     remove: () => {
    //       window.onkeydown = null;
    //     },
    //   },
    // ]);

    whenOnce(() => this.sceneStore.ready).then(async () => {
      await this.performAppLoad();

      this.uploadStore = new UploadStore({ view: this.sceneStore.view, deviceId });
      this.viewshedStore = new ViewshedStore({ view: this.sceneStore.view });

      if (this.skipStartupDialog) {
        this.isStartupDialogShown = false;
      }
    });
  }

  private async performAppLoad() {
    const view = this.sceneStore.view;
    const map = this.sceneStore.map;

    if (map.portalItem?.title) {
      this.title = document.title = map.portalItem.title;
    }

    await map.loadAll();

    this.sceneStore.uploadLayer.definitionExpression = `deviceid = '${this.deviceId}'`;
    const field = this.sceneStore.uploadLayer.fields.find(
      (f) => f.name === "deviceid",
    )!;
    field.defaultValue = this.deviceId;

    // this.modifications = this.sceneStore.mesh.modifications;

    // this._loading = "delete-models";
    // const query = this.sceneStore.uploadLayer.createQuery();
    // query.returnGeometry = false;
    // const { features } = await this.sceneStore.uploadLayer.queryFeatures(query);
    // if (features.length) {
    //   await this.sceneStore.uploadLayer.applyEdits({
    //     deleteFeatures: features,
    //   });
    // }

    if (!this.skipPreload) {
      this._loading = "preload-slides";

      const slides = map.presentation.slides.filter((slide) => slide.hidden);
      for (const slide of slides) {
        slide.applyTo(view, { animate: false });
        await whenOnce(() => !view.updating);
      }
      slides.getItemAt(0)?.applyTo(view, { animate: false });
    }

    this._loading = "done";
  }

  // private async updateFootprintFilter() {
  //   const view = this.sceneStore.view;
  //   if (!view) {
  //     return;
  //   }

  //   const footprint = this.uploadedFootprint;
  //   const layerView = await view.whenLayerView(this.sceneStore.downloadLayer);

  //   if (footprint) {
  //     const modifications = this.modifications
  //       ? this.modifications.clone()
  //       : new SceneModifications();

  //     modifications.add(
  //       new SceneModification({
  //         geometry: footprint,
  //         type: "replace",
  //       }),
  //     );

  //     this.sceneStore.mesh.modifications = modifications;
  //   } else {
  //     this.sceneStore.mesh.modifications = this.modifications;
  //     layerView.filter = null as any;
  //   }
  // }

}

export default AppStore;
