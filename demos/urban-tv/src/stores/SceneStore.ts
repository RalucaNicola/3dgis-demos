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
  private _view: SceneView | null;

  @property()
  private _ready = false;

  constructor() {
    super();

    whenOnce(() => this._view).then(async (view) => {
      await view.when();
      this._ready = true;
    });
  }
}

export default SceneStore;
