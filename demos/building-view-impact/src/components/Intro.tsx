import { tsx } from "@arcgis/core/widgets/support/widget";

const Intro = () => {
  return (
    <div>
      <p>
        See how the view from your window changes when a new proposed
        construction is built close by.
      </p>
      <img src="./building-viewshed.png" class="intro-image"></img>
    </div>
  );
};

export default Intro;
