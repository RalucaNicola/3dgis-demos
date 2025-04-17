/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Viewshed from "@arcgis/core/analysis/Viewshed";
import Camera from "@arcgis/core/Camera";
import { isAbortError } from "@arcgis/core/core/promiseUtils";
import Layer from "@arcgis/core/layers/Layer";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import WebScene from "@arcgis/core/WebScene";

export function timeout(timeoutInMilliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeoutInMilliseconds);
  });
}

/**
 * Suppress errors about uncaught abort errors in promises, for cases where we expect them to be thrown.
 */
export async function ignoreAbortErrors<T>(
  promise: Promise<T>,
): Promise<T | undefined> {
  try {
    return await promise;
  } catch (error: any) {
    if (!isAbortError(error)) {
      throw error;
    }
    return undefined;
  }
}

/**
 * Apply a slide by moving to the viewpoint before changing layer visibility.
 */
export async function applySlide(view: SceneView, title: string) {
  const map = view.map as WebScene;
  if (map.presentation) {
    const slides = map.presentation.slides;
    const slide = slides.find(
      ({ title: slideTitle }) => slideTitle.text === title,
    );
    if (slide) {
      try {
        await view.goTo(slide.viewpoint);
      } finally {
        await slide.applyTo(view, { animate: false });
      }
    }
  }
}

export function findLayerById<T extends Layer>(map: Map, layerId: string) {
  const layer = map.findLayerById(layerId) as T;
  if (!layer) {
    throw new Error(`No layer with id ${layerId} found`);
  }
  return layer;
}

export function findLayerByTitle<T extends Layer>(map: Map, title: string) {
  const layer = map.allLayers.find(l => l.title === title) as T;
  if (!layer) {
    throw new Error(`No layer with title ${title} found`);
  }
  return layer;
}

export function getCameraFromViewshed(viewshed: Viewshed) {
  return new Camera({
    position: viewshed.observer as __esri.Point,
    heading: viewshed.heading,
    tilt: viewshed.tilt,
    fov: getDiagonal(viewshed.verticalFieldOfView, viewshed.horizontalFieldOfView)
  });
}
function getDiagonal(a: number, b: number) {
  return Math.sqrt(a ** 2 + b ** 2);
}
