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
import SceneView from "@arcgis/core/views/SceneView";
import { ScreenType } from "../interfaces";
import { applySlide } from "../utils";

type RealisticStoreProperties = Pick<RealisticStore, "view">;

@subclass()
class RealisticStore extends Accessor {
  readonly type = ScreenType.Realistic;
  @property({ constructOnly: true })
  view: SceneView;

  constructor(props: RealisticStoreProperties) {
    super(props);
    applySlide(props.view, "App: Realistic Visualization");
  }
}

export default RealisticStore;
