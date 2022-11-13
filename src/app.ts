import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";

import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer";
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D";
import PathSymbol3DLayer from "@arcgis/core/symbols/PathSymbol3DLayer";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import WebStyleSymbol from "@arcgis/core/symbols/WebStyleSymbol";
import LineCallout3D from "@arcgis/core/symbols/callouts/LineCallout3D";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import ObjectSymbol3DLayer from "@arcgis/core/symbols/ObjectSymbol3DLayer";

import PopupTemplate from "@arcgis/core/PopupTemplate";

import { when } from "@arcgis/core/core/reactiveUtils";
import { Chart, registerables } from "chart.js";

// Layers
const streetsUrl =
  "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/Berlin_Equal_Street_Names/FeatureServer";
const buildingsUrl =
  "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_Berlin/SceneServer";

const districtsUrl =
  "https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/BerlinRBS_Ortsteile_2017/FeatureServer";

// TODO: Add berlin trees layer from Living Atlas

/********************************************************************
 * Step 1 - Add map with basemap *
 ********************************************************************/
const map = new Map({
  // TODO: find a basemap of your choice
  basemap: "topo-vector",
  // TODO: add elevation
});

const view = new MapView({
  container: document.querySelector("#viewDiv") as HTMLDivElement,
  zoom: 4,
  center: [15, 65], // TODO: add longitude, latitude of Berlin here,
  map: map,
});

// TODO: transform MapView to SceneView

/**************************************************
 * Step 2 - Add a trees layer with a web style symbol *
 **************************************************/

const treesRenderer = new SimpleRenderer({
  symbol: new WebStyleSymbol({
    // name: "", // TODO: find a web style symbol for a realisitic tree
    // styleName: "",
  }),
});

const treesLayer = new FeatureLayer({
  title: "Berlin trees",
  // TODO: make the layer more performant by adding minScale,
  // url: treesUrl,
  outFields: ["*"],
  elevationInfo: {
    mode: "on-the-ground",
  },
  renderer: treesRenderer,
});

map.add(treesLayer);

/**************************************************
 * Step 3 - Change the streets renderer to show a 3D line *
 **************************************************/
const FEMALE_COLOR = ""; // TODO: choose a color
const MALE_COLOR = ""; // TODO: choose a color

const femaleStreetSymbol = {
  value: "F",
  symbol: new LineSymbol3D({
    symbolLayers: [
      new PathSymbol3DLayer({
        profile: "quad",
        material: {
          color: FEMALE_COLOR,
        },
        width: 10,
        height: 3,
      }),
    ],
  }),
};

const maleStreetSymbol = {
  value: "M",
  symbol: new LineSymbol3D({
    symbolLayers: [
      new PathSymbol3DLayer({
        profile: "quad",
        material: {
          color: MALE_COLOR,
        },
        width: 10,
        height: 3,
      }),
    ],
  }),
};

const streetsLayer = new FeatureLayer({
  title: "Berlin streets",
  url: streetsUrl,
  outFields: ["*"],
  elevationInfo: {
    mode: "on-the-ground",
  },
  // renderer: new UniqueValueRenderer({
  //   field: "gender",
  //   // TODO: add the symbols to the renderer
  //   uniqueValueInfos: [],
  // }),
});

// TODO: add layers to the map

/**************************************************
 * Step 4 - Add districts and 3D labels *
 **************************************************/

const districtsLayer = new FeatureLayer({
  title: "Berlin district boundaries",
  url: districtsUrl,
  outFields: ["*"],
  elevationInfo: {
    mode: "on-the-ground",
  },
  renderer: new SimpleRenderer({
    symbol: new PolygonSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          outline: {
            color: "white",
            size: "2px",
            /* TODO: find a line pattern
            pattern: new LineStylePattern3D({
              style: "", 
            }),*/
            patternCap: "round",
          },
        }),
      ],
    }),
  }),
});

const districtsLabelLayer = new FeatureLayer({
  title: "Berlin district names",
  url: districtsUrl,
  outFields: ["*"],
  elevationInfo: {
    mode: "relative-to-scene",
  },
  labelingInfo: [
    {
      labelExpression: "[nam]",
      symbol: new LabelSymbol3D({
        symbolLayers: [
          new TextSymbol3DLayer({
            material: {
              color: "white",
            },
            halo: {
              size: 1,
              color: [50, 50, 50],
            },
            size: 10,
          }),
        ],
      }),
    },
  ],
  renderer: new SimpleRenderer({
    symbol: new PointSymbol3D({
      symbolLayers: [
        new ObjectSymbol3DLayer({
          width: 1,
          height: 1,
          depth: 1,
          resource: { primitive: "sphere" },
          material: { color: "white" },
        }),
      ],
      verticalOffset: {
        screenLength: 1, // TODO: find a reasonable screen length
        maxWorldLength: 1, // TODO: find a reasonable max world length
        minWorldLength: 1, // TODO: find a reasonable min world length
      },
      callout: new LineCallout3D({
        size: 1.5,
        color: [150, 150, 150],
        border: {
          color: [50, 50, 50],
        },
      }),
    }),
  }),
});

// TODO: add layers to the map

/**************************************************
 * Step 5 - Add 3D buildings with edges rendering *
 **************************************************/

const buildingSymbol = new MeshSymbol3D({
  symbolLayers: [
    new FillSymbol3DLayer({
      material: {
        color: [40, 40, 40, 0.5],
        colorMixMode: "tint",
      },
      edges: new SolidEdges3D({
        size: 0.5,
        color: [255, 255, 255, 0.5],
      }),
    }),
  ],
});

const buildingsLayer = new SceneLayer({
  title: "Berlin 3D buildings",
  url: buildingsUrl,
  outFields: ["*"],
  renderer: new SimpleRenderer({
    // TODO: add the symbol to the renderer
  }),
  legendEnabled: false,
});

map.add(buildingsLayer);

/**************************************************
 * Step 6 - Add a popup with the name & description of the street *
 **************************************************/

const arcadeExpressionInfos = [
  {
    name: "title",
    title: "Name of the person the street is named after.",
    expression: "fromJSON($feature.details).labels.en.value",
  },
  {
    name: "description",
    title: "Description of the person the street is named after.",
    expression: "fromJSON($feature.details).descriptions.en.value",
  },
  {
    name: "link",
    title: "Link to wikipedia article.",
    expression: "fromJSON($feature.details).sitelinks.enwiki.url",
  },
];

streetsLayer.popupTemplate = new PopupTemplate({
  content: "", // TODO: add content to popup template
  // expressionInfos: {} / TODO: add arcarde expressions to popup template
});

/**************************************************
 * Step 7 - Find a widget in the docs to add to your app *
 **************************************************/

// TODO: add the search widget

// TODO: add home widget

// TODO: add layer list with legend
// const layerList = new LayerList({
//   view: view,
//   listItemCreatedFunction: (event) => {
//     const item = event.item;
//     if (item.layer.type != "group") {
//       item.panel = { content: "legend", open: true };
//     }
//   },
// });

// view.ui.add(layerList, "top-right");

/**************************************************
 * Step 8 - Add a chart that shows the distribution of the streets by gender *
 **************************************************/
Chart.register(...registerables);

let femaleStreetsCounts = 0;
let maleStreetsCount = 0;

const chartCanvas = document.getElementById(
  "chart-canvas"
) as HTMLCanvasElement;

const chart = new Chart(chartCanvas, {
  type: "doughnut",
  data: {
    labels: ["Female", "Male"],
    datasets: [
      {
        label: "Zurich streets by gender",
        data: [femaleStreetsCounts, maleStreetsCount],
        backgroundColor: [FEMALE_COLOR, MALE_COLOR],
        borderColor: [FEMALE_COLOR, MALE_COLOR],
        hoverOffset: 4,
      },
    ],
  },
});

// set default chart font color to white
Chart.defaults.color = "#fff";

view.whenLayerView(streetsLayer).then((layerView) => {
  when(
    // Update the chart whenever the user is not interacting with the scene
    () => !layerView.updating,
    async () => {
      // TODO: query the features & update the chart with the correct numbers
    }
  );
});
