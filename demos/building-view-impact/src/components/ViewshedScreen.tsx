import { tsx } from "@arcgis/core/widgets/support/widget";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item";
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
      {store.viewsheds.length > 0 ? (
        <calcite-list selection-mode="single">
          {store.viewsheds.map((viewshed, index) => (
            <calcite-list-item
              key={`viewshed-${index}`}
              label={`Viewshed #${index + 1}`}
              selected={store.analysisView?.selectedViewshed === viewshed}
              onCalciteListItemSelect={() => store.selectViewshed(viewshed)}
            >
              <calcite-action
                slot="actions-end"
                icon="trash"
                text="Delete"
                onclick={(e: Event) => {
                  e.stopPropagation();
                  store.deleteViewshed(viewshed);
                }}
              ></calcite-action>
            </calcite-list-item>
          ))}
        </calcite-list>
      ) : null}
    </div>
  );
};

export default ViewshedScreen;
