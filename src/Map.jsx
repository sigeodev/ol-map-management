import React from 'react';
import axios from 'axios';

import OlMap from 'ol/Map';
import Select from 'ol/interaction/Select';
import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM';

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
    label: 'Strada', // TODO: i18n
    mutuallyExclusive: true
  },
  {
    value: 'CanvasDark',
    icon: <DarkIcon />,
    label: 'Dark', // TODO: i18n
    mutuallyExclusive: true
  },
  {
    value: 'AerialWithLabelsOnDemand',
    icon: <FlightIcon />,
    label: 'Aereo', // TODO: i18n
    mutuallyExclusive: true
  }
];

class Map {
  map = null;
  bingKey = null;
  duration = 2000;
  selectInteraction = null;
  layerToInteraction = null;

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
            imagerySet: baseLayer.value
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

  addInteraction = () => {
    this.selectInteraction = new Select();
    this.map.addInteraction(this.selectInteraction);
  };

  on = (evt, callback) => this.map.on(evt, callback);
  onInteraction = (evt, callback) => this.selectInteraction.on(evt, callback);
  removeLayer = layer => this.map.removeLayer(layer);
  addLayer = layer => this.map.addLayer(layer);

  /**
   * Parse WKT feature
   *
   * @param f
   */
  parseFeature(f) {
    if (!f) {
      return;
    }

    const format = new WKT();
    const feature = new Feature();
    const geom = format.readGeometryFromText(f.geom);

    feature.setId(f.id);
    feature.setGeometry(geom);
    // feature.set('typeId', f.siteType.id);
    // feature.set('type', f.siteType);
    // feature.set('rotation', f.rotation || 0);

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
   * Add feature in a layer
   *
   * @param layer
   * @param feature
   */
  addFeature = (layer, feature) => {
    return new Promise((resolve, reject) => {
      if (!layer || !feature) {
        reject();
      }

      const source = layer.getSource();

      if (!source) {
        reject();
      }

      const parsedFeature = this.parseFeature(feature);
      source.addFeature(parsedFeature);

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
      source: new VectorSource(options),
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
    return new TileLayer({ source: new TileWMS(sourceOptions) });
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
      source: new OSM(options),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });
  }

  createLayer = (type, isVisible, sourceOptions, customOptions, style) => {
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

    newLayer.setVisible(isVisible);
    this.addLayer(newLayer);

    return newLayer;
  };

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

  /**
   *
   * @param coordinate
   */
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

          axios.get(url).then(res => {
            const data = res;
            return resolve(data);
          });
          break;
        }
        default:
          return reject();
      }
    });
  };

  /**
   *
   * @param feature
   */
  addSelectedFeature(feature) {
    if (!feature) {
      return;
    }

    const features = this.selectInteraction.getFeatures();
    // const length = features.getLength();

    features.push(feature);
  }

  /**
   * Reset selected features
   */
  resetSelectedFeatures = () => {
    this.selectInteraction.getFeatures().clear();
  };

  getLayers = () => this.map.getLayers().getArray();
  getLayerToInteraction = () => this.layerToInteraction;

  setLayerToInteraction = value => {
    if (!value) {
      return;
    }

    const layers = this.getLayers();
    const layer = layers.find(layer => layer.ol_uid === value);

    if (!layer) {
      return;
    }

    this.layerToInteraction = layer;
  };

  /**
   * Exclusive change base layers visibility (one visible, all other invisible)
   *
   * @param layer
   * @param isVisible
   */
  changeLayerVisibility = (layer, isVisible) => {
    const layers = this.getLayers();

    if (!layer) {
      return;
    }

    if (layer.values_.mutuallyExclusive) {
      // Logic only on mutually exclusive layers
      const mutuallyExclusiveLayers = layers.filter(layer => layer.values_.mutuallyExclusive);
      mutuallyExclusiveLayers.forEach(l => {
        l.setVisible(l.ol_uid === layer.ol_uid);
      });
    } else {
      layer.setVisible(isVisible);

      /**
       * If you set the layer to invisible and this layer is the current layer
       * to interaction, reset it!
       */

      /**
       * if (!isVisible && layerToInteraction && layerToInteraction.ol_uid === layer.ol_uid) {
				return this.resetLayerToInteraction();
			}
       */
    }

    // this.forceUpdate();
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

      /**
       * Remove all layers
       */
      layers.forEach(layer => {
        this.removeLayer(layer);
      });

      /**
       * Add default layers
       */
      const newBaseLayers = this.getDefaultBaseLayers();
      newBaseLayers.forEach(layer => {
        this.addLayer(layer);
      });

      // Show the first base layer!
      this.changeLayerVisibility(newBaseLayers[0]);
      resolve();
    });

  changeOpacity = (layer, value) => {
    if (!layer) {
      return;
    }

    layer.setOpacity(value);
  };
}

export default new Map();