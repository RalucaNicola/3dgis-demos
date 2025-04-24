import { tsx } from "@arcgis/core/widgets/support/widget";
import ViewshedStore from "../stores/ViewshedStore";

const ViewshedScreen = ({ store }: { store: ViewshedStore }) => {
  return (
    <div>
      <p>
        <span class="step">2</span>Create an interactive viewshed to analyse the
        visibility.
      </p>
      <div class="viewshed-button-container">
        {store.state === "idle" ? (
          <calcite-button
            key="viewshed-create"
            slot="footer"
            scale="l"
            onclick={() => store.create()}
          >
            Create viewshed
          </calcite-button>
        ) : (
          <calcite-button
            key="viewshed-cancel"
            slot="footer"
            scale="l"
            onclick={() => store.stopCreating()}
          >
            Cancel
          </calcite-button>
        )}
      </div>
    </div>
  );
};

export default ViewshedScreen;
