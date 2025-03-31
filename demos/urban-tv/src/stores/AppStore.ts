import Accessor from "@arcgis/core/core/Accessor";
import {
  property,
  subclass,
} from "@arcgis/core/core/accessorSupport/decorators";
import { whenOnce } from "@arcgis/core/core/reactiveUtils";
import Mesh from "@arcgis/core/geometry/Mesh";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import MeshComponent from "@arcgis/core/geometry/support/MeshComponent";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { FillSymbol3DLayer, MeshSymbol3D } from "@arcgis/core/symbols";
import SceneStore from "./SceneStore";
import UserStore from "./UserStore";

type AppStoreProperties = Pick<AppStore, "webSceneId" | "skipPreload">;

@subclass()
class AppStore extends Accessor {
  @property({ constructOnly: true })
  webSceneId: string;

  @property({ constructOnly: true })
  sceneStore = new SceneStore();

  @property()
  get skipStartupDialog() {
    return localStorage.getItem("skipStartupDialog") === "true";
  }
  set skipStartupDialog(skip: boolean) {
    localStorage.setItem("skipStartupDialog", `${skip}`);
  }

  @property()
  isStartupDialogShown = true;

  @property()
  skipPreload = false;

  @property()
  title: string;

  @property({ constructOnly: true })
  userStore = new UserStore();

  @property()
  get loading() {
    return this._loading;
  }

  @property()
  private _loading: "scene" | "preload-slides" | "done" = "scene";

  constructor(props: AppStoreProperties) {
    super(props);

    whenOnce(() => this.sceneStore.ready).then(async () => {
      await this.performAppLoad();

      if (this.skipStartupDialog) {
        this.isStartupDialogShown = false;
      }
    });
  }

  private async performAppLoad() {
    const view = this.sceneStore.view;
    const map = this.sceneStore.map;

    if (map.portalItem?.title) {
      this.title = document.title = map.portalItem.title;
    }

    await map.loadAll();

    if (!this.skipPreload) {
      this._loading = "preload-slides";

      const slides = map.presentation.slides.filter((slide) => slide.hidden);
      for (const slide of slides) {
        slide.applyTo(view, { animate: false });
        await whenOnce(() => !view.updating);
      }
      slides.getItemAt(0)?.applyTo(view, { animate: false });
    }

    this._loading = "done";

    this.addTV();
  }

  private addTV() {
    const video = document.createElement("video");
    video.src = "./Shot_02_1080.mp4";
    video.autoplay = false;
    video.loop = false;
    video.muted = false;
    video.crossOrigin = "anonymous";
    video.preload = "none";

    // Add video to DOM as hidden element
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.height = "0";
    video.style.visibility = "hidden";
    document.body.append(video);

    const mesh = new Mesh({
      spatialReference: SpatialReference.WebMercator,
      components: [
        new MeshComponent({
          faces: [8, 9, 10, 8, 10, 11],
          material: {
            colorTexture: {
              data: video,
            },
            alphaMode: "auto",
            alphaCutoff: 0.5,
            doubleSided: true,
          },
          shading: "source",
        }),
        new MeshComponent({
          faces: [
            0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 12, 13, 14, 12, 14, 15, 16, 17,
            18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
          ],
          material: {
            color: [40, 20, 20, 255],
            alphaMode: "auto",
            alphaCutoff: 0.5,
            doubleSided: true,
          },
          shading: "source",
        }),
      ],
      vertexSpace: {
        type: "local",
        origin: [950184.2042933014, 6004001.337255693, 420],
      },
      transform: {
        translation: [0, 0, 0],
        rotationAxis: [0, 0, 1],
        rotationAngle: 250,
        scale: [11 / 6, 1.5, 1.5],
        // scale: [0.4773428993661809, 0.4773428993661765, 0.4773428993661756]
      },
      vertexAttributes: {
        position: [
          -8, -0.5, 0, 8, -0.5, 0, 8, -0.5, 11, -8, -0.5, 11, 8, -0.5, 0, 8,
          0.5, 0, 8, 0.5, 11, 8, -0.5, 11, 8, 0.5, 0, -8, 0.5, 0, -8, 0.5, 11,
          8, 0.5, 11, -8, 0.5, 0, -8, -0.5, 0, -8, -0.5, 11, -8, 0.5, 11, -8,
          -0.5, 11, 8, -0.5, 11, 8, 0.5, 11, -8, 0.5, 11, -8, 0.5, 0, 8, 0.5, 0,
          8, -0.5, 0, -8, -0.5, 0,
        ],
        uv: [
          0, 0.625, 0.25, 0.625, 0.25, 0.375, 0, 0.375, 0.25, 0.625, 0.5, 0.625,
          0.5, 0.375, 0.25, 0.375, 0, 1, 1, 1, 1, 0, 0, 0, 0.75, 0.625, 1,
          0.625, 1, 0.375, 0.75, 0.375, 0, 0.375, 0.25, 0.375, 0.25, 0.125, 0,
          0.125, 0, 0.875, 0.25, 0.875, 0.25, 0.625, 0, 0.625,
        ],
        normal: [
          0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
          0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0,
          0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1,
          0, 0, -1, 0, 0, -1,
        ],
      } as any,
    });

    const layer = new GraphicsLayer({
      graphics: [
        new Graphic({
          geometry: mesh,
          symbol: new MeshSymbol3D({
            symbolLayers: [
              new FillSymbol3DLayer({
                material: {
                  color: "white",
                },
              }),
            ],
          }),
        }),
      ],
    });

    const map = this.sceneStore.map;
    const view = this.sceneStore.view;

    map.add(layer);

    let playing = false;

    view.on("immediate-click", async (e) => {
      const { results } = await view.hitTest(e);

      for (const result of results) {
        if (result.layer === layer) {
          if (playing) {
            video.pause();
          } else {
            video.play();
          }
          playing = !playing;
        }
      }
    });

    const slides = map.presentation.slides;

    window.onkeydown = (e: KeyboardEvent) => {
      const index = Number.parseInt(e.key);

      if (0 < index && index <= slides.length) {
        const slide = slides.getItemAt(index - 1);

        if (slide) {
          slide.applyTo(view);
        }
      }
    };
  }
}

export default AppStore;
