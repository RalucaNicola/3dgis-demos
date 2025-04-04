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

import esriRequest from "@arcgis/core/request";

export function timeout(timeoutInMilliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeoutInMilliseconds);
  });
}

const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

export async function isValidVideoUrl(videoUrl: string) {
  if (videoUrl && videoUrl.startsWith("https://")) {
    try {
      const response = await esriRequest(videoUrl, {
        method: "head",
        responseType: "text",
      });

      if (!response.getHeader) {
        return false;
      }

      const contentType = response.getHeader("content-type");

      if (!contentType) {
        return false;
      }

      return allowedVideoTypes.includes(contentType);
    } catch {}
  }
  return false;
}
