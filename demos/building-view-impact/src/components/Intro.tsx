import { tsx } from "@arcgis/core/widgets/support/widget";
import AppStore from "../stores/AppStore";

const Intro = ({ store }: { store: AppStore }) => {
  return (
    <div>
      <h1>{store.title}</h1>
      <p>
        New buildings can impact the views of places in a city. Use this
        application to upload a building model and see how the viewpoint changes
        using the interactive viewshed tool.
      </p>
    </div>
  );
};

export default Intro;
