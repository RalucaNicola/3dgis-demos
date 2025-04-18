import ViewshedAnalysis from "@arcgis/core/analysis/ViewshedAnalysis";
import Accessor from "@arcgis/core/core/Accessor";
import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import ViewshedAnalysisView3D from "@arcgis/core/views/3d/analysis/ViewshedAnalysisView3D";
import { ScreenType } from "../interfaces";
import { getCameraFromViewshed } from "../utils";
type ViewshedStoreProperties = Pick<ViewshedStore, "view">;

@subclass()
class ViewshedStore extends Accessor {
    readonly type = ScreenType.Upload;

    @property({ constructOnly: true })
    view: __esri.SceneView;

    @property()
    viewshedAnalysis = new ViewshedAnalysis();

    @property()
    analysisView: ViewshedAnalysisView3D;

    @property()
    displayPreviewContainer: boolean = false;

    @property()
    get state() {
        return this.abortController ? "creating" : "idle";
    }

    @property()
    private abortController: AbortController | null;

    constructor(props: ViewshedStoreProperties) {
        super(props);
        const view = props.view;
        view.analyses.add(this.viewshedAnalysis);

        view.whenAnalysisView(this.viewshedAnalysis).then((analysisView) => {
            this.analysisView = analysisView;
        });

        reactiveUtils.watch(() => this.analysisView?.selectedViewshed, (selectedViewshed) => {
            this.displayPreviewContainer = selectedViewshed ? true : false;
        })
    }

    create() {
        this.stopCreating();
        this.abortController = new AbortController();

        const viewshedCounter = this.viewshedAnalysis.viewsheds.length;
        // Watch whenever the a new viewshed is created and selected and then stop the creation method.
        reactiveUtils.when(
            () =>
                this.viewshedAnalysis.viewsheds.length > viewshedCounter &&
                this.analysisView.selectedViewshed,
            () => {
                this.stopCreating();
            },
        );

        this.analysisView.createViewsheds(this.abortController).catch((e) => {
            // When the operation is cancelled, don't do anything. Any other errors are thrown.
            if (!promiseUtils.isAbortError(e)) {
                throw e;
            }
        });
    }

    stopCreating() {
        this.abortController?.abort();
        this.abortController = null;
    }

    updatePreview(previewElement: HTMLArcgisSceneElement) {
        const previewView = previewElement.view;
        previewView.environment = this.view.environment;
        previewView.ui.components = [];

        reactiveUtils.when(
            () => {
                const viewshed = this.analysisView?.selectedViewshed;
                return viewshed ? getCameraFromViewshed(viewshed) : null;
            },
            (camera) => {
                previewView.camera = camera;
            }, { initial: true }
        );
    }


}

export default ViewshedStore;
