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
import "@esri/calcite-components/dist/components/calcite-checkbox";
import "@esri/calcite-components/dist/components/calcite-dialog";
import "@esri/calcite-components/dist/components/calcite-label";
import AppStore from "../stores/AppStore";

import splash from "../../README.md";

const Loader = ({ store }: { store: AppStore }) => {
  switch (store.loading) {
    case "scene":
      return <calcite-loader text="Loading scene..."></calcite-loader>;
    case "delete-models":
      return (
        <calcite-loader text="Delete previous uploads..."></calcite-loader>
      );
    case "preload-slides":
      return <calcite-loader text="Preload viewpoints"></calcite-loader>;
    default:
      return [];
  }
};

const Description = () => {
  const bind = (div: HTMLDivElement) => {
    div.innerHTML = splash;
  };

  return <div afterCreate={bind}></div>;
};

const StartupDialog = ({ store }: { store: AppStore }) => {
  const loading = store.loading !== "done";

  const itemControl = !loading && store.sceneStore.map.portalItem?.itemControl;
  const canUpdate = itemControl === "admin" || itemControl === "update";

  let updatingWebScene = false;
  async function updateWebScene() {
    updatingWebScene = true;

    try {
      const portalItem = store.sceneStore.map.portalItem;
      if (portalItem) {
        portalItem.description = splash;
        await portalItem.update();
      }
    } finally {
      updatingWebScene = false;
    }
  }

  return (
    <calcite-dialog
      slot="dialogs"
      open={store.isStartupDialogShown}
      modal
      escapeDisabled
      outsideCloseDisabled
      closeDisabled={loading}
      heading={loading ? null : store.title}
      onCalciteDialogClose={() => (store.isStartupDialogShown = false)}
    >
      <div class="startup-dialog-content">
        {loading ? (
          <Loader store={store}></Loader>
        ) : (
          <Description></Description>
        )}
      </div>

      {canUpdate
        ? [
            <calcite-button
              key="update-web-scene"
              disabled={updatingWebScene}
              loading={updatingWebScene}
              slot="footer-start"
              kind="neutral"
              onclick={updateWebScene}
            >
              Update web scene
            </calcite-button>,
          ]
        : []}

      {loading
        ? []
        : [
            <calcite-label slot="footer-end" layout="inline-space-between">
              <calcite-checkbox
                checked={store.skipStartupDialog}
                disabled={loading}
                onCalciteCheckboxChange={() => {
                  store.skipStartupDialog = !store.skipStartupDialog;
                }}
              ></calcite-checkbox>
              Hide on startup
            </calcite-label>,
            <calcite-button
              key="close-startup-dialog"
              disabled={loading}
              slot="footer-end"
              onclick={() => {
                store.isStartupDialogShown = false;
              }}
            >
              Close
            </calcite-button>,
          ]}
    </calcite-dialog>
  );
};

export default StartupDialog;
