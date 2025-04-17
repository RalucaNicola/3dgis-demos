import { tsx } from "@arcgis/core/widgets/support/widget";
import { ArcgisSceneCustomEvent } from "@arcgis/map-components";
import ViewshedStore from "../stores/ViewshedStore";

const ViewshedScreen = ({ store }: { store: ViewshedStore }) => {
  return (
    <div>
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
      <arcgis-scene
        class={`preview ${store.displayPreviewContainer ? "display" : "hide"}`}
        map={store.view.map}
        onArcgisViewReadyChange={(e: ArcgisSceneCustomEvent<void>) => {
          store.updatePreview(e.target);
        }}
      ></arcgis-scene>
    </div>
  );
};

export default ViewshedScreen;
