import { tsx } from "@arcgis/core/widgets/support/widget";
import { ArcgisSceneCustomEvent } from "@arcgis/map-components";
import ViewshedStore from "../stores/ViewshedStore";

const ViewshedPreview = ({ store }: { store: ViewshedStore }) => {
  return (
    <calcite-shell-panel slot="panel-end" position="end" width-scale="l">
      <calcite-panel heading="Proposed View">
        {store ? (
          <arcgis-scene
            class={`preview`}
            map={store.view.map}
            onArcgisViewReadyChange={(e: ArcgisSceneCustomEvent<void>) => {
              store.updatePreview(e.target);
            }}
          ></arcgis-scene>
        ) : (
          <div></div>
        )}
      </calcite-panel>
      <calcite-panel heading="Existing View">
        {store ? (
          <arcgis-scene
            class={`preview`}
            map={store.view.map}
            onArcgisViewReadyChange={(e: ArcgisSceneCustomEvent<void>) => {
              store.updatePreview(e.target);
              const view = e.target.view;
              const sketchLayer = view.map.allLayers.find(
                (l) => l.title === "Sketch Layer",
              ) as __esri.GraphicsLayer;
              view.whenLayerView(sketchLayer).then((lyrView) => {
                lyrView.visible = false;
              });
            }}
          ></arcgis-scene>
        ) : (
          <div></div>
        )}
      </calcite-panel>
    </calcite-shell-panel>
  );
};

export default ViewshedPreview;
