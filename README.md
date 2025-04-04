# Collection of 3D GIS demos

This repository contains demos showcasing 3D GIS capabilities of ArcGIS. The custom apps are built with the [Maps SDK for JavaScript](https://developers.arcgis.com/javascript/) and [Calcite Design System](https://developers.arcgis.com/calcite-design-system/).

- [3D GIS demo organization](https://3dgis.maps.arcgis.com/home/content.html?sortField=modified&sortOrder=desc&view=grid&contentType=all&focus=applications-web#org) on ArcGIS Online
- [Source code](https://github.com/esri/3d-gis-demos) on GitHub

## Demos

### Urban change over time

This app demonstrates how you can use 3D object layers to visualize and apply changes in a system of record.

**[View it live](https://esri.github.io/3dgis-demos/urban-change-over-time)**

[![Download 3D Buildings and Terrain](./demos/urban-change-over-time/public/thumbnail.png)](https://esri.github.io/3dgis-demos/urban-change-over-time)

### Urban TV

Place a billboard showing an image or video in your scene.

**[View it live](https://esri.github.io/3dgis-demos/urban-tv)**

[![Billboard with video](./demos/urban-tv/public/thumbnail.png)](https://esri.github.io/3dgis-demos/urban-tv)

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

Copyright 2025 Esri

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
