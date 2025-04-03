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

import "@esri/calcite-components/dist/components/calcite-button";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-shell-panel";

import ViewshedStore from "../stores/ViewshedStore";

const ViewshedScreen = ({ store }: { store: ViewshedStore }) => {
  return (
    <calcite-shell-panel
      key="viewshed-screen"
      slot="panel-end"
      display-mode="float"
    >
      <calcite-panel>
        {store.state === "idle" ? (
          <calcite-button
            key="viewshed-create"
            slot="footer"
            width="full"
            onclick={() => store.create()}
          >
            Create viewshed
          </calcite-button>
        ) : (
          <calcite-button
            key="viewshed-cancel"
            slot="footer"
            width="full"
            appearance="outline-fill"
            onclick={() => store.stopCreating()}
          >
            Cancel
          </calcite-button>
        )}
      </calcite-panel>
    </calcite-shell-panel>
  );
};

export default ViewshedScreen;
