import Accessor from "@arcgis/core/core/Accessor";
import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import { ScreenType } from "../interfaces";
import { findLayerByTitle } from "../utils";

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
    sketchLayer = new GraphicsLayer();

    constructor(props: UploadStoreProperties) {
        super(props);
        const view = props.view;
        this.deviceId = props.deviceId;
        this.sceneLayer = findLayerByTitle(view.map, "Building Upload") as __esri.SceneLayer;
        view.map.layers.add(this.sketchLayer);
        this.sketchVM = new SketchViewModel({
            layer: this.sketchLayer,
            view
        });

        this.sketchVM.on("update", async (event) => {
            console.log("update", event);
            if (this.isUpdating) return this.sketchVM.cancel();

            const objectIdField = this.sceneLayer.objectIdField;
            if (event.state === "start") {
                const [graphic] = event.graphics;
                const sv = view.layerViews.filter((view) => view.layer === this.sketchLayer).getItemAt(0) as __esri.GraphicsLayerView;
                await reactiveUtils.whenOnce(() => sv.updating);
                await reactiveUtils.whenOnce(() => !sv.updating);

                this.sceneLayer.excludeObjectIds.add(graphic.attributes[objectIdField]);
            }

            if (event.state === "complete" && !event.aborted) {
                const graphic = event.graphics[0];
                const hasBeenAdded = graphic.attributes[objectIdField] != null;

                const edits = hasBeenAdded ? { updateFeatures: [graphic] } : { addFeatures: [graphic] };
                this.isUpdating = true;

                await this.sceneLayer.applyEdits(edits).then(({ addFeatureResults }) => {
                    if (!hasBeenAdded) {
                        const id = addFeatureResults[0].objectId as number;
                        graphic.attributes[objectIdField] = id;
                        this.sceneLayer.excludeObjectIds.add(id);
                    }
                }).catch(error => {
                    console.log(error);
                });

                this.isUpdating = false;
            }
        });

        this.sketchVM.on("create", async (event) => {
            console.log("create", event);
            if (this.isUpdating) return this.sketchVM.cancel();
            //@ts-ignore
            if (event.state === "complete" && !event.aborted) {
                this.sketchVM.update(event.graphic);
            }
        });

        this.sketchVM.on("delete", async (event) => {
            console.log("delete", event);
            this.isUpdating = true;
            await this.sceneLayer.applyEdits({
                deleteFeatures: event.graphics
            });

            this.isUpdating = false;
        });

        view.on("click", async (event) => {

            if (this.isUploading || this.isUpdating) return;

            // Listen for the click event
            const hitTestResults = await view.hitTest(event);
            // Search for features where the user clicked
            if (hitTestResults.results) {

                const graphicHits = hitTestResults.results.filter((result) => "graphic" in result);
                console.log(graphicHits);
                const [userGraphic] = graphicHits
                    .map((result) => result.graphic)
                    .filter((graphic) => graphic.attributes?.deviceid === this.deviceId);

                if (userGraphic) {
                    if (!this.sketchLayer.graphics.includes(userGraphic)) {
                        const objectIdField = this.sceneLayer.objectIdField;

                        const query = this.sceneLayer.createQuery();
                        query.returnGeometry = true;
                        query.objectIds = [userGraphic.attributes[objectIdField]];

                        const res = await this.sceneLayer.queryFeatures(query);
                        const mesh = res.features.find((feature) => feature.geometry?.type === "mesh");

                        if (mesh != null) {
                            // the default graphic symbol will color the mesh orange. We simply give it an  empty fill so the look of the graphic is not changed.
                            mesh.symbol = {
                                type: "mesh-3d", // autocasts as new PolygonSymbol3D()
                                symbolLayers: [
                                    {
                                        type: "fill" // autocasts as new FillSymbol3DLayer()
                                    }
                                ]
                            };

                            this.sketchLayer.add(mesh);
                            this.sketchVM.update(mesh);
                        }
                    }
                }
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