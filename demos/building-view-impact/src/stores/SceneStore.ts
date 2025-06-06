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
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import SceneLayerView from "@arcgis/core/views/layers/SceneLayerView";
import SceneView from "@arcgis/core/views/SceneView";
import WebScene from "@arcgis/core/WebScene";

@subclass()
class SceneStore extends Accessor {
  @property({ readOnly: true })
  get ready() {
    return this._ready;
  }

  @property()
  get view() {
    if (!this.ready) {
      throw new Error("SceneView has not yet been initialized");
    }
    return this._view!;
  }
  set view(view: SceneView) {
    this._view = view;
  }

  @property({ aliasOf: "view.map", readOnly: true })
  map: WebScene;

  @property()
  downloadLayer: SceneLayer;

  @property()
  uploadLayer: SceneLayer;

  @property()
  lowPolyTrees: SceneLayer;

  @property()
  realisticTrees: SceneLayer;

  @property()
  mesh: IntegratedMeshLayer;

  @property()
  buildingsLayer: SceneLayer;

  @property()
  buildingsLayerView: SceneLayerView;

  @property()
  private _view: SceneView | null;

  @property()
  private _ready = false;

  constructor() {
    super();

    whenOnce(() => this._view).then(async (view) => {
      await view.when();
      await this.findLayers(view);
      this._ready = true;
    });
  }

  private async findLayers(view: SceneView) {
    const map = view.map;

    // this.downloadLayer = findLayerById(map, "190697a6c61-layer-314");
    // this.uploadLayer = findLayerByTitle(map, "Building Upload");
    // this.lowPolyTrees = findLayerById(map, "19058d7d9f2-layer-87");
    // this.realisticTrees = findLayerById(map, "19058d7d2b5-layer-86");
    // this.mesh = findLayerById(map, "1904131bf90-layer-113");
    // this.buildingsLayer = findLayerById(map, "190697a6c61-layer-314");

    // this.buildingsLayerView = await view.whenLayerView(this.buildingsLayer);
  }
}

export default SceneStore;
