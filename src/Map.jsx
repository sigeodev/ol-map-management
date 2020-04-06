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
  onReset = null;

  create(params) {
    if (!params) {
      return;
    }

    this.map = new OlMap({
      ...params,
      layers: params.layers || this.getDefaultBaseLayers()
    });

    return this.map;
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

  setResetHandler = handler => {
    if (!handler) {
      return;
    }

    this.onReset = handler;
  };

  getDefaultBaseLayers = () => {
    let baseLayers = [];

    /**
     * Create invisible base layers
     */
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

    /**
     * Enable (set to visible) first base layer!
     */
    baseLayers[0].setVisible(true);
    return baseLayers;
  };

  addInteraction = interaction => {
    return new Promise(resolve => {
      this.customInteractions = [...this.customInteractions, interaction];
      this.map.addInteraction(interaction);
      resolve();
    });
  };

  removeInteraction = interaction => {
    return new Promise((resolve, reject) => {
      if (!interaction) {
        reject();
      }

      this.customInteractions = this.customInteractions.filter(i => i.ol_uid !== interaction.ol_uid);
      this.map.removeInteraction(interaction);
      resolve();
    });
  };

  on = (evt, callback) => this.map.on(evt, callback);

  removeLayer = layer => {
    return new Promise((resolve, reject) => {
      if (!this.map) {
        resolve();
      }

      this.customLayers = this.customLayers.filter(l => l.ol_uid !== layer.ol_uid);
      this.map.removeLayer(layer);

      resolve();
    });
  };
  addLayer = layer => {
    if (!this.map) {
      return;
    }

    this.map.addLayer(layer);
  };

  /**
   * Parse GeoJSON feature
   *
   * @param f
   * @param customOptions
   */
  parseGeoJSONFeature(f, customOptions) {
    if (!f) {
      return;
    }

    const format = new GeoJSON();
    const feature = new Feature();
    const geom = format.readGeometry(f.geom || f.geometry);

    feature.setId(f.id);
    feature.setGeometry(geom);

    if (!isEmpty(customOptions)) {
      Object.keys(customOptions).forEach(key => {
        feature.set(key, customOptions[key]);
      });
    }

    return feature;
  }

  /**
   * Parse WKT feature
   *
   * @param f
   * @param customOptions
   */
  parseFeature(f, customOptions) {
    if (!f) {
      return;
    }

    const format = new WKT();
    const feature = new Feature();
    const geom = format.readGeometryFromText(f.geom || f.geometry);

    feature.setId(f.id);
    feature.setGeometry(geom);

    if (!isEmpty(customOptions)) {
      Object.keys(customOptions).forEach(key => feature.set(key, customOptions[key]));
    }

    return feature;
  }

  /**
   * Parse WKT features
   *
   * @param data
   */
  parseFeatures = data => {
    if (!data) {
      return;
    }

    const features = new Collection();

    data.forEach(f => {
      features.push(this.parseFeature(f));
    });

    return features;
  };

  /**
   * Add GeoJson feature in a layer
   *
   * @param layer
   * @param feature
   * @param customOptions
   * @returns {Promise<unknown>}
   */
  addGeoJSONFeature = (layer, feature, customOptions) => {
    return new Promise((resolve, reject) => {
      if (!layer || !feature) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      const parsedFeature = this.parseGeoJSONFeature(feature, customOptions);
      source.addFeature(parsedFeature);

      return resolve(source);
    });
  };

  /**
   * Add feature in a layer
   *
   * @param layer
   * @param feature
   * @param customOptions
   * @returns {Promise<unknown>}
   */
  addFeature = (layer, feature, customOptions) => {
    return new Promise((resolve, reject) => {
      if (!layer || !feature) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      const parsedFeature = this.parseFeature(feature, customOptions);
      source.addFeature(parsedFeature);

      return resolve(source);
    });
  };

  removeFeatures = layer => {
    return new Promise((resolve, reject) => {
      if (!layer) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      source.clear();
      return resolve(source);
    });
  };

  /**
   * Add features in a layer
   *
   * @param layer
   * @param features
   */
  addFeatures = (layer, features) => {
    return new Promise((resolve, reject) => {
      if (!layer || !features) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      const parsedFeatures = this.parseFeatures(features);
      source.addFeatures(parsedFeatures.getArray());

      return resolve(source);
    });
  };

  /**
   *
   * @param sourceOptions
   * @param style
   */
  createVectorLayer(sourceOptions, style) {
    let options = {};

    if (sourceOptions) {
      options = { ...sourceOptions, ...sourceOptions };
    }

    return new VectorLayer({
      source: new VectorSource({ ...options, crossOrigin: 'Anonymous' }),
      style,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });
  }

  /**
   *
   * @param sourceOptions
   */
  createWMSLayer(sourceOptions) {
    return new TileLayer({ source: new TileWMS({ ...sourceOptions, crossOrigin: 'Anonymous' }) });
  }

  /**
   *
   * @param sourceOptions
   */
  createTileLayer(sourceOptions) {
    let options = {};

    if (sourceOptions) {
      options = { ...sourceOptions, ...options };
    }

    return new TileLayer({
      source: new OSM({ ...options, crossOrigin: 'Anonymous' }),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });
  }

  createLayers = (layers, id_parent) => {
    if (isEmpty(layers)) {
      return;
    }

    layers.forEach(layer => {
      const type = layer.type || LAYER_TYPE.VECTOR;
      const upperType = type.toUpperCase();

      let options = {};

      switch (type.toLowerCase()) {
        case LAYER_TYPE.WMS: {
          let params = { LAYERS: layer.name, TILED: true };

          if (layer.cqlFilter) {
            const cqlFilterReplaced = layer.cqlFilter.replace('%1%', layer.cqlValue);
            params = { ...params, cql_filter: cqlFilterReplaced };
          }

          options = { ...options, url: layer.url, params };
          break;
        }
        default:
          break;
      }

      const layertoGenerate = this.createLayer(upperType, options, {
        ...layer,
        type: type.toLowerCase(),
        isRoot: !id_parent,
        idParent: id_parent
      });

      layertoGenerate.setVisible(layer.visible);
      this.addLayer(layertoGenerate);

      if (layer.group) {
        this.createLayers(layer.layers, layertoGenerate.ol_uid);
      }
    });
  };

  createLayer = (type, sourceOptions, customOptions, style) => {
    if (!type) {
      return false;
    }

    let newLayer;

    switch (type.toLowerCase()) {
      case LAYER_TYPE.WMS:
        newLayer = this.createWMSLayer(sourceOptions);
        break;
      case LAYER_TYPE.VECTOR:
        newLayer = this.createVectorLayer(sourceOptions, style);
        break;
      default:
        newLayer = this.createTileLayer(sourceOptions);
        break;
    }

    customOptions &&
      Object.keys(customOptions).forEach(key => {
        newLayer.set(key, customOptions[key]);
      });

    this.customLayers = [...this.customLayers, newLayer];

    return newLayer;
  };

  createAsyncLayer = (type, sourceOptions, customOptions, style) =>
    new Promise((resolve, reject) => {
      if (!type) {
        return reject();
      }

      let newLayer;

      switch (type.toLowerCase()) {
        case LAYER_TYPE.WMS:
          newLayer = this.createWMSLayer(sourceOptions);
          break;
        case LAYER_TYPE.VECTOR:
          newLayer = this.createVectorLayer(sourceOptions, style);
          break;
        default:
          newLayer = this.createTileLayer(sourceOptions);
          break;
      }

      customOptions &&
        Object.keys(customOptions).forEach(key => {
          newLayer.set(key, customOptions[key]);
        });

      return resolve(newLayer);
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
  capture = () => {
    toPng(this.map.getTargetElement(), {
      filter: element => (element.className ? element.className.indexOf('ol-control') === -1 : true)
    }).then(dataURL => {
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
  changeLayerVisibility = (layer, isVisible) => {
    return new Promise((resolve, reject) => {
      const layers = this.getLayers();

      if (!layer) {
        return reject();
      }

      if (layer.get('mutuallyExclusive')) {
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
  };

  /**
   * Reset layers
   */
  resetLayers = () =>
    new Promise((resolve, reject) => {
      const layers = this.getLayers();

      if (!layers) {
        reject();
      }

      this.map.setLayerGroup(new Group());
      this.customLayers = [];

      /**
       * Add default layers
       */
      const newBaseLayers = this.getDefaultBaseLayers();
      newBaseLayers.forEach(layer => {
        this.addLayer(layer);
      });

      if (this.onReset) {
        this.onReset();
      }

      resolve();
    });

  resetCustomLayers = () =>
    new Promise(resolve => {
      this.customLayers.forEach(l => this.removeLayer(l));
      this.changeLayerVisibility(this.getLayers()[0], true);

      resolve();
    });

  /**
   * Reset interactions
   */
  resetInteractions = () =>
    new Promise((resolve, reject) => {
      const interactions = this.getInteractions();

      if (!interactions) {
        reject();
      }

      interactions.forEach(i => this.removeInteraction(i));
      resolve();
    });

  /**
   * Reset custom interactions
   */
  resetCustomInteractions = () =>
    new Promise(resolve => {
      this.customInteractions.forEach(i => this.removeInteraction(i));
      resolve();
    });

  changeOpacity = (layer, value) => {
    return new Promise((resolve, reject) => {
      if (!layer) {
        reject();
      }

      layer.setOpacity(value);
      resolve();
    });
  };
}

export default Map;
