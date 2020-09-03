import React from 'react';
import { toPng } from 'html-to-image';
import isEmpty from 'lodash/isEmpty';

import OlMap from 'ol/Map';
import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import BingMaps from 'ol/source/BingMaps';
import Group from 'ol/layer/Group';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import TerrainIcon from '@material-ui/icons/Terrain';
import FlightIcon from '@material-ui/icons/Flight';
import DarkIcon from '@material-ui/icons/Brightness4';

export const LAYER_TYPE = {
  WMS: 'wms',
  VECTOR: 'vector'
};

const BASE_LAYERS = [
  {
    value: 'RoadOnDemand',
    icon: <TerrainIcon />,
    label: 'Strada',
    mutuallyExclusive: true
  },
  {
    value: 'CanvasDark',
    icon: <DarkIcon />,
    label: 'Dark',
    mutuallyExclusive: true
  },
  {
    value: 'AerialWithLabelsOnDemand',
    icon: <FlightIcon />,
    label: 'Aereo',
    mutuallyExclusive: true
  }
];

class Map {
  map = null;
  bingKey = null;
  duration = 2000;
  customInteractions = [];
  customLayers = [];

  editing = null;
  selection = null;

  drawing = {
    layer: null,
    interaction: null
  };

  create(params) {
    return new Promise((resolve, reject) => {
      if (!params) {
        reject();
      }

      const { layers, ...rest } = params;

      this.map = new OlMap({
        ...rest,
        layers: layers || this.getDefaultBaseLayers()
      });

      this.createLayer(LAYER_TYPE.VECTOR, null, {
        mutuallyExclusive: false,
        type: LAYER_TYPE.VECTOR
      })
        .then(drawingLayer => {
          const drawing = {
            layer: drawingLayer,
            interaction: new Draw({
              source: drawingLayer.getSource(),
              type: GeometryType.POLYGON
            })
          };

          const selection = new Select();
          const editing = new Modify({
            features: selection.interaction.getFeatures()
          });

          drawingLayer.setZIndex(300);
          drawing.interaction.setActive(false);
          editing.setActive(false);
          selection.setActive(true);

          this.addLayer(drawing.layer);
          this.addInteraction(drawing.interaction);
          this.addInteraction(editing);
          this.addInteraction(selection);

          this.editing = editing;
          this.selection = selection;
          this.drawing = drawing;

          resolve(this.map);
        })
        .catch(e => reject(e));
    });
  }

  getMap = () => this.map;
  getView = () => this.map.getView();
  getSize = () => this.map.getSize();

  setDuration = duration => {
    this.duration = duration;
  };

  getDuration = () => this.duration;

  setBingKey = bingKey => {
    this.bingKey = bingKey;
  };

  getBingKey = () => this.bingKey;

  getDefaultBaseLayers = () => {
    let baseLayers = [];

    // Create invisible base layers
    BASE_LAYERS.forEach((baseLayer, i) => {
      baseLayers = [
        ...baseLayers,
        new TileLayer({
          visible: false,
          preload: Infinity,
          source: new BingMaps({
            key: this.bingKey,
            imagerySet: baseLayer.value,
            crossOrigin: 'Anonymous'
          })
        })
      ];
      baseLayers[i].set('mutuallyExclusive', baseLayer.mutuallyExclusive);
      baseLayers[i].set('icon', baseLayer.icon);
      baseLayers[i].set('label', baseLayer.label);
    });

    // Enable (set to visible) first base layer!
    baseLayers[0].setVisible(true);
    return baseLayers;
  };

  reset = () => Promise.all([this.resetCustomLayers(), this.resetCustomInteractions()]);

  pushSelectedFeature = feature =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.selection || !feature) {
        reject();
      }

      this.selection.getFeatures().push(feature);
      this.selection.dispatchEvent('select');

      resolve(this.selection);
    });

  cleanSelection = () =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.selection) {
        reject();
      }

      this.selection.getFeatures().clear();
      this.selection.dispatchEvent('change');

      resolve(this.selection);
    });

  enableSelection = () =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.selection) {
        reject();
      }

      this.selection.setActive(true);
      resolve(this.selection);
    });

  disableSelection = () =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.selection) {
        reject();
      }

      this.selection.setActive(false);
      resolve(this.selection);
    });

  disableEditing = () =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.editing || !this.selection) {
        reject();
      }

      this.editing.setActive(false);
      this.selection.setActive(true);

      resolve(this.editing);
    });

  enableEditing = () =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.editing || !this.selection) {
        reject();
      }

      this.editing.setActive(true);
      this.selection.setActive(false);

      resolve(this.editing);
    });

  disableDrawing = () =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.drawing || !this.selection) {
        reject();
      }

      this.drawing.setActive(false);
      this.selection.setActive(true);

      resolve(this.drawing);
    });

  enableDrawing = () =>
    new Promise((resolve, reject) => {
      if (!this.map || !this.drawing || !this.selection) {
        reject();
      }

      this.drawing.setActive(true);
      this.selection.setActive(false);

      resolve(this.drawing);
    });

  addInteraction = interaction =>
    new Promise((resolve, reject) => {
      if (!this.map || !interaction) {
        reject();
      }

      this.customInteractions = [...this.customInteractions, interaction];
      this.map.addInteraction(interaction);
      resolve(this.customInteractions);
    });

  removeInteraction = interaction =>
    new Promise((resolve, reject) => {
      if (!this.map || !interaction) {
        reject();
      }

      this.customInteractions = this.customInteractions.filter(i => i.ol_uid !== interaction.ol_uid);
      this.map.removeInteraction(interaction);
      resolve(this.customInteractions);
    });

  removeLayer = layer =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      this.customLayers = this.customLayers.filter(l => l.ol_uid !== layer.ol_uid);
      this.map.removeLayer(layer);

      resolve(this.getLayers());
    });

  addLayer = layer =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      this.customLayers = [...this.customLayers, layer];
      this.map.addLayer(layer);

      resolve(this.getLayers());
    });

  /**
   * Parse GeoJSON feature
   *
   * @param f
   * @param customOptions
   */
  parseGeoJSONFeature = (f, customOptions) =>
    new Promise((resolve, reject) => {
      if (!this.map || !f) {
        reject();
      }

      const format = new GeoJSON();
      const feature = new Feature();
      const geom = format.readGeometry(f.geom || f.geometry);

      if (!geom) {
        reject();
      }

      feature.setId(f.id);
      feature.setGeometry(geom);

      if (!isEmpty(customOptions)) {
        Object.keys(customOptions).forEach(key => {
          feature.set(key, customOptions[key]);
        });
      }

      resolve(feature);
    });

  /**
   * Parse WKT feature
   *
   * @param f
   * @param customOptions
   */
  parseWKTFeature = (f, customOptions) =>
    new Promise((resolve, reject) => {
      if (!this.map || !f) {
        reject();
      }

      const format = new WKT();
      const feature = new Feature();
      const geom = format.readGeometryFromText(f.geom || f.geometry);

      if (!geom) {
        reject();
      }

      feature.setId(f.id);
      feature.setGeometry(geom);

      if (!isEmpty(customOptions)) {
        Object.keys(customOptions).forEach(key => feature.set(key, customOptions[key]));
      }

      return resolve(feature);
    });

  /**
   * Parse WKT features
   *
   * @param features
   */
  parseWKTFeatures = features =>
    new Promise((resolve, reject) => {
      if (!this.map || !features) {
        reject();
      }

      const collection = new Collection();

      features.forEach(feature => {
        collection.push(this.parseWKTFeature(feature));
      });

      resolve(collection);
    });

  /**
   * Add GeoJson feature in a layer
   *
   * @param layer
   * @param feature
   * @param customOptions
   * @returns {Promise<unknown>}
   */
  addGeoJSONFeature = (layer, feature, customOptions) =>
    new Promise((resolve, reject) => {
      if (!this.map || !layer || !feature) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      this.parseGeoJSONFeature(feature, customOptions).then(parsedFeature => {
        source.addFeature(parsedFeature);
        resolve(source);
      });
    });

  /**
   * Add feature in a layer
   *
   * @param layer
   * @param feature
   * @param customOptions
   * @returns {Promise<unknown>}
   */
  addWKTFeature = (layer, feature, customOptions) =>
    new Promise((resolve, reject) => {
      if (!this.map || !layer || !feature) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      this.parseWKTFeature(feature, customOptions).then(parsedFeature => {
        source.addFeature(parsedFeature);
        resolve(source);
      });
    });

  /**
   * Add features in a layer
   *
   * @param layer
   * @param features
   */
  addWKTFeatures = (layer, features) =>
    new Promise((resolve, reject) => {
      if (!this.map || !layer || !features) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      this.parseWKTFeatures(features).then(parsedFeatures => {
        source.addFeatures(parsedFeatures.getArray());
        resolve(source);
      });
    });

  /**
   * Remove features from a lyer
   *
   * @param layer
   */
  removeFeatures = layer =>
    new Promise((resolve, reject) => {
      if (!this.map || !layer) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      source.clear();
      resolve(source);
    });

  /**
   *
   * @param sourceOptions
   * @param style
   */
  createVectorLayer = (sourceOptions, style) =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      let options = {};

      if (sourceOptions) {
        options = { ...sourceOptions, ...options };
      }

      const layer = new VectorLayer({
        source: new VectorSource({ ...options, crossOrigin: 'Anonymous' }),
        style,
        updateWhileAnimating: true,
        updateWhileInteracting: true
      });

      if (!layer) {
        reject();
      }

      resolve(layer);
    });

  /**
   *
   * @param sourceOptions
   */
  createWMSLayer = sourceOptions =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      let options = {};

      if (sourceOptions) {
        options = { ...sourceOptions, ...options };
      }

      const layer = new TileLayer({ source: new TileWMS({ ...sourceOptions, crossOrigin: 'Anonymous' }), preload: Infinity });

      if (!layer) {
        reject();
      }

      resolve(layer);
    });

  /**
   *
   * @param sourceOptions
   */
  createTileLayer = sourceOptions =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      let options = {};

      if (sourceOptions) {
        options = { ...sourceOptions, ...options };
      }

      const layer = new TileLayer({
        source: new OSM({ ...options, crossOrigin: 'Anonymous' }),
        preload: Infinity,
        updateWhileAnimating: true,
        updateWhileInteracting: true
      });

      if (!layer) {
        reject();
      }

      resolve(layer);
    });

  createLayer = (type, sourceOptions, customOptions, style) =>
    new Promise((resolve, reject) => {
      if (!this.map || !type) {
        reject();
      }

      let funcToCall;

      switch (type.toLowerCase()) {
        case LAYER_TYPE.WMS:
          funcToCall = this.createWMSLayer;
          break;
        case LAYER_TYPE.VECTOR:
          funcToCall = this.createVectorLayer;
          break;
        default:
          funcToCall = this.createTileLayer;
          break;
      }

      funcToCall(sourceOptions, style)
        .then(newLayer => {
          customOptions &&
            Object.keys(customOptions).forEach(key => {
              newLayer.set(key, customOptions[key]);
            });

          resolve(newLayer);
        })
        .catch(() => reject());
    });

  /**
   * Increment zoom + 1
   */
  incrementZoom = () => {
    const view = this.getView();
    const duration = this.duration;
    const zoom = view.getZoom();

    view.animate({
      zoom: zoom + 1,
      duration: duration / 2
    });
  };

  /**
   * Reduce zoom - 1
   */
  reduceZoom = () => {
    const view = this.getView();
    const duration = this.duration;
    const zoom = view.getZoom();

    view.animate({
      zoom: zoom - 1,
      duration: duration / 2
    });
  };

  /**
   * Change map location
   *
   * @param nextLocation
   */
  changeMapLocation = nextLocation => {
    if (!nextLocation) {
      return;
    }

    const view = this.getView();
    const duration = this.duration;
    const zoom = view.getZoom();

    view.animate({
      center: nextLocation,
      duration
    });

    view.animate(
      {
        zoom: zoom - 1,
        duration: duration / 2
      },
      {
        zoom,
        duration: duration / 2
      }
    );
  };

  /**
   * Change map fit with a bbox or geometry
   *
   * @param bboxOrGeometry
   * @param options
   */
  changeMapFit = (bboxOrGeometry, options) => {
    if (!bboxOrGeometry) {
      return;
    }

    const view = this.getView();
    const size = this.getSize();
    const duration = this.duration;

    view.fit(bboxOrGeometry, { size, duration, ...options });
  };

  openOnGoogleMaps = () => {
    /**
     * Map view
     * @constant
     */
    const view = this.getView();

    /**
     * Transform map in 4326
     * @constant
     */
    const mapCenter = transform(view.getCenter(), view.getProjection(), 'EPSG:4326');

    /**
     * Get zoom
     * @constant
     */
    const zoom = view.getZoom();

    /**
     * Get lat
     * @constant
     */
    const lat = mapCenter[0];

    /**
     * Get lon
     * @constant
     */
    const lon = mapCenter[1];

    /**
     * Open a google map window
     * @constant
     */
    const gMapsWin = window.open(`https://www.google.it/maps/@?api=1&map_action=map&center=${lon},${lat}&zoom=${zoom}`, 'gmaps', 'width=1024,height=768');

    /**
     * Focus on it!
     */
    gMapsWin?.focus();
  };

  /**
   * Capture image map
   */
  capture = full => {
    if (!this.map) {
      return;
    }

    let options = {};

    if (!full) {
      options = {
        ...options,
        filter: element => (element.className ? element.className.indexOf('ol-control') === -1 : true)
      };
    }

    toPng(this.map.getTargetElement(), options).then(dataURL => {
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = `map.png`;
      a.click();
    });
  };

  /**
  getFeatureInfo = coordinate => {
    return new Promise((resolve, reject) => {
      if (!coordinate) {
        reject();
      }

      const layerToInteraction = this.getLayerToInteraction();
      const view = this.getView();
      const type = layerToInteraction.values_.type;
      const source = layerToInteraction.getSource();

      if (!type || !source) {
        reject();
      }

      switch (type) {
        case LAYER_TYPE.VECTOR: {
          const data = source.getFeaturesAtCoordinate(coordinate);
          return resolve(data);
        }
        case LAYER_TYPE.WMS: {
          const viewResolution = view.getResolution();
          const viewProjection = view.getProjection();
          const url = source.getGetFeatureInfoUrl(coordinate, viewResolution, viewProjection.getCode(), { INFO_FORMAT: 'application/json' });

          if (!url) {
            return;
          }

          fetch(url).then(res => {
            const data = res;

            if (data) {
              return data.json().then(dataJson => resolve(dataJson));
            }

            return reject();
          });
          break;
        }
        default:
          return reject();
      }
    });
  };
 */

  getLayers = () => {
    if (!this.map) {
      return [];
    }

    return this.map.getLayers().getArray();
  };

  getInteractions = () => {
    if (!this.map) {
      return [];
    }

    return this.map.getInteractions().getArray();
  };

  /**
   * Exclusive change base layers visibility (one visible, all other invisible)
   *
   * @param layer
   * @param isVisible
   */
  changeLayerVisibility = (layer, isVisible) =>
    new Promise((resolve, reject) => {
      if (!this.map || !layer) {
        reject();
      }

      const layers = this.getLayers();
      const isMutuallyExclusive = layer.get('mutuallyExclusive');

      if (isMutuallyExclusive) {
        // Logic only on mutually exclusive layers
        const mutuallyExclusiveLayers = layers.filter(layer => layer.get('mutuallyExclusive'));
        mutuallyExclusiveLayers.forEach(l => {
          l.setVisible(l.ol_uid === layer.ol_uid);
        });

        resolve();
      } else {
        layer.setVisible(isVisible);
        resolve();
      }
    });

  /**
   * Reset layers
   */
  resetLayers = () =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      const layers = this.getLayers();

      if (!layers) {
        reject();
      }

      this.map.setLayerGroup(new Group());

      this.customLayers = [];
      resolve(this.getLayers());
    });

  resetCustomLayers = () =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      Promise.all(this.customLayers.map(l => this.removeLayer(l)))
        .then(() => {
          const firstLayer = this.getLayers()[0];

          if (firstLayer) {
            this.changeLayerVisibility(firstLayer, true);
          }

          resolve();
        })
        .catch(() => reject());
    });

  /**
   * Reset interactions
   */
  resetInteractions = () =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      const interactions = this.getInteractions();

      if (!interactions) {
        reject();
      }

      Promise.all(interactions.map(i => this.removeInteraction(i)))
        .then(() => resolve())
        .catch(() => reject());
    });

  /**
   * Reset custom interactions
   */
  resetCustomInteractions = () =>
    new Promise((resolve, reject) => {
      if (!this.map) {
        reject();
      }

      if (isEmpty(this.customInteractions)) {
        resolve();
      }

      Promise.all(this.customInteractions.map(i => this.removeInteraction(i)))
        .then(() => resolve())
        .catch(() => reject());
    });

  changeOpacity = (layer, value) =>
    new Promise((resolve, reject) => {
      if (!this.map || !layer) {
        reject();
      }

      layer.setOpacity(value);
      resolve();
    });
}

export default Map;
