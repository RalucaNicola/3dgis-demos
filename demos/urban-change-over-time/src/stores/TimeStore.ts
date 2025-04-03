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
import TimeExtent from "@arcgis/core/time/TimeExtent";
import SceneView from "@arcgis/core/views/SceneView";
import { ScreenType } from "../interfaces";
import { applySlide } from "../utils";

type TimeStoreProperties = Pick<TimeStore, "view">;

@subclass()
class TimeStore extends Accessor {
  readonly type = ScreenType.Time;

  @property({ constructOnly: true })
  view: SceneView;

  constructor(props: TimeStoreProperties) {
    super(props);

    const view = props.view;

    applySlide(props.view, "App: Start").then(() => {
      view.timeExtent = new TimeExtent({
        start: new Date("1200-01-02"),
        end: new Date("1200-01-02"),
      });
    });

    this.addHandles({
      remove: () => {
        view.timeExtent = null as any;
      },
    });
  }
}

export default TimeStore;
