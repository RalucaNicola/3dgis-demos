import Accessor from "@arcgis/core/core/Accessor";
import {
  property,
  subclass,
} from "@arcgis/core/core/accessorSupport/decorators";
import { whenOnce } from "@arcgis/core/core/reactiveUtils";
import Mesh from "@arcgis/core/geometry/Mesh";
import MeshMaterial from "@arcgis/core/geometry/support/MeshMaterial";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { FillSymbol3DLayer, MeshSymbol3D } from "@arcgis/core/symbols";
import SceneStore from "./SceneStore";
import UserStore from "./UserStore";

import MeshLocalVertexSpace from "@arcgis/core/geometry/support/MeshLocalVertexSpace";
import * as meshUtils from "@arcgis/core/geometry/support/meshUtils";

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
      await slides.getItemAt(0)?.applyTo(view, { animate: false });
    }

    this._loading = "done";

    this.addTV();
  }

  private async addTV() {
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

    const camera = this.sceneStore.view.camera;

    let mesh = Mesh.createBox(camera.position, {
      imageFace: "south",
      size: {
        height: 18,
        width: 32,
        depth: 1.5,
      },
      vertexSpace: "local",
      material: new MeshMaterial({
        colorTexture: {
          data: video,
        },
        alphaMode: "auto",
        alphaCutoff: 0.5,
        doubleSided: true,
      }),
    });

    // Slightly rotate screen
    mesh.rotate(0, 0, -15);
    // Move screen away from camera
    mesh.offset(0, 170, -10);

    // Define origin of screen to be camera position (again)
    mesh = await meshUtils.convertVertexSpace(
      mesh,
      new MeshLocalVertexSpace({
        origin: [camera.position.x, camera.position.y, camera.position.z!],
      }),
    );

    // Rotate screen in front of camera
    mesh.rotate(0, 0, -camera.heading);

    if (mesh.components && 1 < mesh.components.length) {
      mesh.components[1].material = new MeshMaterial({
        color: [40, 20, 20, 255],
        alphaMode: "auto",
        alphaCutoff: 0.5,
        doubleSided: true,
      });
    }

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
