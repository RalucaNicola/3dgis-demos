import Accessor from "@arcgis/core/core/Accessor";
import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Polygon from "@arcgis/core/geometry/Polygon";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SceneFilter from "@arcgis/core/layers/support/SceneFilter";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import { ScreenType } from "../interfaces";
import { findLayerById, findLayerByTitle } from "../utils";

type UploadStoreProperties = Pick<UploadStore, "view" | "deviceId">;
const MAX_FILESIZE_MB = 50;

@subclass()
class UploadStore extends Accessor {
    readonly type = ScreenType.Intro;

    @property({ constructOnly: true })
    view: __esri.SceneView;

    @property()
    sceneLayer: __esri.SceneLayer;

    @property()
    buildingsLayer: __esri.SceneLayer;

    @property()
    deviceId: string;

    @property()
    isUploading: boolean = false;

    @property()
    isUpdating: boolean = false;

    @property()
    sizeWarning: boolean = false;

    @property()
    sketchVM: __esri.SketchViewModel;

    @property()
    sketchLayer = new GraphicsLayer({
        title: "Sketch Layer"
    });

    @property()
    sketchAreas: __esri.Collection<Polygon>;

    updateSketchAreas() {
        this.sketchAreas = this.sketchLayer.graphics.map((graphic) => Polygon.fromExtent(graphic.geometry?.extent as __esri.Extent) as __esri.Polygon);
        this.buildingsLayer.filter = new SceneFilter({
            geometries: this.sketchAreas,
            spatialRelationship: "disjoint"
        })
    }

    constructor(props: UploadStoreProperties) {
        super(props);
        const view = props.view;
        this.deviceId = props.deviceId;
        this.sceneLayer = findLayerByTitle(view.map, "Building Upload") as __esri.SceneLayer;
        this.buildingsLayer = findLayerById(view.map, "18c679fde82-layer-38") as __esri.SceneLayer;
        view.map.layers.add(this.sketchLayer);
        this.sketchVM = new SketchViewModel({
            layer: this.sketchLayer,
            view
        });

        this.sketchVM.on("update", async (event) => {
            console.log("update", event);
            if (this.isUpdating) return this.sketchVM.cancel();
            this.updateSketchAreas();
        });

        this.sketchVM.on("create", async (event) => {
            console.log("create", event);
            if (this.isUpdating) return this.sketchVM.cancel();
            //@ts-ignore
            if (event.state === "complete" && !event.aborted) {
                this.sketchVM.update(event.graphic);
            }
        });

    }

    async uploadModel(file: File) {
        const bytes = file.size;
        const mb = bytes / (1024 * 1024);

        if (mb > MAX_FILESIZE_MB) {
            this.sizeWarning = true;
        } else {
            try {
                this.isUploading = true;
                // Make sure the scene layer has loaded before doing anything
                if (!this.sceneLayer.loaded) await this.sceneLayer.load();

                const mesh = await this.sceneLayer.convertMesh([file]);

                await mesh.load();
                // Add the graphic to the sketch-viewmodel to enable editing
                //@ts-ignore
                this.sketchVM.place(mesh, {
                    graphicProperties: {
                        layer: this.sketchLayer,
                        attributes: { deviceid: this.deviceId }
                    }
                });
            } finally {
                this.isUploading = false;
            }
        }
    }
}

export default UploadStore;