import { tsx } from "@arcgis/core/widgets/support/widget";
import AppStore from "../stores/AppStore";

const Intro = ({ store }: { store: AppStore }) => {
  return (
    <div>
      <div class="header">
        <h1
          onclick={() => {
            const itemPageUrl = store.sceneStore.map.portalItem?.itemPageUrl;
            if (itemPageUrl) {
              window.open(itemPageUrl, "new");
            }
          }}
        >
          Building View Impact
        </h1>
        <calcite-button
          appearance="transparent"
          kind="neutral"
          icon-start="information"
          slot="content-start"
          onclick={() => (store.isStartupDialogShown = true)}
          round
        ></calcite-button>
      </div>
      <p>
        See how the view from your window changes when a new proposed
        construction is built close by.
      </p>
      <img src="./building-viewshed.png" class="intro-image"></img>
    </div>
  );
};

export default Intro;
