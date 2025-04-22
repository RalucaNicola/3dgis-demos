import { tsx } from "@arcgis/core/widgets/support/widget";
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-loader";
import UploadStore from "../stores/UploadStore";

const UploadScreen = ({ store }: { store: UploadStore }) => {
  return (
    <div>
      <p>
        <span class="step">1</span>Upload the model of the proposed
        construction.
      </p>
      <div
        id="drop-zone"
        ondragover={(event: DragEvent) => {
          event?.preventDefault();
        }}
        ondrop={async (event: DragEvent) => {
          event?.preventDefault();
          if (event.dataTransfer) {
            const files = event.dataTransfer.items
              ? Array.from(event.dataTransfer.items)
                  .filter((item) => item.kind === "file")
                  .map((item) => item.getAsFile())
              : Array.from(event.dataTransfer.files);
            const [file] = files;
            try {
              if (file) {
                store.uploadModel(file);
              }
            } catch (error) {
              console.log(error);
            }
          }
        }}
      >
        <div>
          <label class="custom-file-upload">
            Browse for files
            <calcite-icon icon="folder" scale="s"></calcite-icon>
            <input
              type="file"
              onchange={(event: Event) => {
                const input = event.target as HTMLInputElement;
                if (input.files) {
                  const [file] = Array.from(input.files);
                  try {
                    if (file) {
                      store.uploadModel(file);
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    // if the user tries to upload the same file again, we need to clear the input value so that the change event is triggered again
                    input.value = "";
                  }
                }
              }}
            />
          </label>
          <p>or drag a file here</p>
        </div>
        {(store.isUploading || store.isUpdating) && (
          <calcite-loader class="loader" scale="m"></calcite-loader>
        )}
      </div>
    </div>
  );
};

export default UploadScreen;
