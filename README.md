# Collection of 3D GIS demos

This repository contains the [3D GIS](https://3dgis.maps.arcgis.com/home/content.html?sortField=modified&sortOrder=desc&view=grid&contentType=all&focus=applications-web#org) demos. These are custom apps built with the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/).

## Demos

### Urban change over time

This app demonstrates how you can use 3D object layers to visualize and apply changes in a system of record.

**[View it live](https://esri.github.io/3dgis-demos/urban-change-over-time)**

[![Download 3D Buildings and Terrain](https://www.arcgis.com/sharing/content/items/30bd624de45247dfa53320a8213729a4/resources/screenshots/02-download-3d-data.png)](https://esri.github.io/3dgis-demos/urban-change-over-time)

## Prerequisites

- Node.js 18.0+

The template comes set up with Prettier for formatting. Take a look at their [editor integration docs](https://prettier.io/docs/en/editors) to integrate it into your development environment.

## Run projects locally

To start, run for example:

```
npm install
npm run dev:urban-change-over-time
```

Then open your browser at http://localhost:3000/

## Create productive build

To build all apps in the repository, use:

```
npm run build-all
```

Alternatively, you can build individual apps using:

```
npm run build --workspace=urban-change-over-time
```

The `dist` folder then contains all the files for the web app which can be copied to a web server.

## Deployment

The project uses a [GitHub Action](https://github.com/features/actions) script (see [`publish-all.yml`](./.github/workflows/publish-all.yml)) to build and publish all apps to [GitHub Pages](https://pages.github.com/).

Alternatively [`publish-changed.yml`](./.github/workflows/publish-all.yml) is run after pushing to the main branch, only building and deploying apps that have changed.

## Licensing

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](./license.txt) file.
