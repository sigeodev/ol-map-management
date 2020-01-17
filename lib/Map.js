"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.LAYER_TYPE = void 0;

var _react = _interopRequireDefault(require("react"));

var _htmlToImage = require("html-to-image");

var _Map = _interopRequireDefault(require("ol/Map"));

var _WKT = _interopRequireDefault(require("ol/format/WKT"));

var _Feature = _interopRequireDefault(require("ol/Feature"));

var _Collection = _interopRequireDefault(require("ol/Collection"));

var _Vector = _interopRequireDefault(require("ol/layer/Vector"));

var _Vector2 = _interopRequireDefault(require("ol/source/Vector"));

var _Tile = _interopRequireDefault(require("ol/layer/Tile"));

var _TileWMS = _interopRequireDefault(require("ol/source/TileWMS"));

var _BingMaps = _interopRequireDefault(require("ol/source/BingMaps"));

var _Group = _interopRequireDefault(require("ol/layer/Group"));

var _OSM = _interopRequireDefault(require("ol/source/OSM"));

var _proj = require("ol/proj");

var _GeoJSON = _interopRequireDefault(require("ol/format/GeoJSON"));

var _Terrain = _interopRequireDefault(require("@material-ui/icons/Terrain"));

var _Flight = _interopRequireDefault(require("@material-ui/icons/Flight"));

var _Brightness = _interopRequireDefault(require("@material-ui/icons/Brightness4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LAYER_TYPE = {
  WMS: 'wms',
  VECTOR: 'vector'
};
exports.LAYER_TYPE = LAYER_TYPE;
var BASE_LAYERS = [{
  value: 'RoadOnDemand',
  icon: _react["default"].createElement(_Terrain["default"], null),
  label: 'Strada',
  // TODO: i18n
  mutuallyExclusive: true
}, {
  value: 'CanvasDark',
  icon: _react["default"].createElement(_Brightness["default"], null),
  label: 'Dark',
  // TODO: i18n
  mutuallyExclusive: true
}, {
  value: 'AerialWithLabelsOnDemand',
  icon: _react["default"].createElement(_Flight["default"], null),
  label: 'Aereo',
  // TODO: i18n
  mutuallyExclusive: true
}];

var Map =
/*#__PURE__*/
function () {
  function Map() {
    var _this = this;

    _classCallCheck(this, Map);

    _defineProperty(this, "map", null);

    _defineProperty(this, "bingKey", null);

    _defineProperty(this, "duration", 2000);

    _defineProperty(this, "interaction", null);

    _defineProperty(this, "layerToInteraction", null);

    _defineProperty(this, "getMap", function () {
      return _this.map;
    });

    _defineProperty(this, "getView", function () {
      return _this.map.getView();
    });

    _defineProperty(this, "getSize", function () {
      return _this.map.getSize();
    });

    _defineProperty(this, "setDuration", function (duration) {
      _this.duration = duration;
    });

    _defineProperty(this, "getDuration", function () {
      return _this.duration;
    });

    _defineProperty(this, "setBingKey", function (bingKey) {
      _this.bingKey = bingKey;
    });

    _defineProperty(this, "getBingKey", function () {
      return _this.bingKey;
    });

    _defineProperty(this, "getDefaultBaseLayers", function () {
      var baseLayers = [];
      /**
       * Create invisible base layers
       */

      BASE_LAYERS.forEach(function (baseLayer, i) {
        baseLayers = [].concat(_toConsumableArray(baseLayers), [new _Tile["default"]({
          visible: false,
          preload: Infinity,
          source: new _BingMaps["default"]({
            key: _this.bingKey,
            imagerySet: baseLayer.value,
            crossOrigin: 'Anonymous'
          })
        })]);
        baseLayers[i].set('mutuallyExclusive', baseLayer.mutuallyExclusive);
        baseLayers[i].set('icon', baseLayer.icon);
        baseLayers[i].set('label', baseLayer.label);
      });
      /**
       * Enable (set to visible) first base layer!
       */

      baseLayers[0].setVisible(true);
      return baseLayers;
    });

    _defineProperty(this, "getInteraction", function () {
      return _this.interaction;
    });

    _defineProperty(this, "addInteraction", function (interaction) {
      return new Promise(function (resolve) {
        _this.interaction = interaction;

        _this.map.addInteraction(_this.interaction);

        resolve();
      });
    });

    _defineProperty(this, "removeInteraction", function () {
      return new Promise(function (resolve) {
        if (!_this.interaction) {
          resolve();
        }

        _this.map.removeInteraction(_this.interaction);

        resolve();
      });
    });

    _defineProperty(this, "on", function (evt, callback) {
      return _this.map.on(evt, callback);
    });

    _defineProperty(this, "onInteraction", function (evt, callback) {
      if (!_this.interaction) {
        return;
      }

      _this.interaction.on(evt, callback);
    });

    _defineProperty(this, "removeLayer", function (layer) {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          resolve();
        }

        _this.map.removeLayer(layer);

        resolve();
      });
    });

    _defineProperty(this, "addLayer", function (layer) {
      if (!_this.map) {
        return;
      }

      _this.map.addLayer(layer);
    });

    _defineProperty(this, "parseFeatures", function (data) {
      if (!data) {
        return;
      }

      var features = new _Collection["default"]();
      data.forEach(function (f) {
        features.push(_this.parseFeature(f));
      });
      return features;
    });

    _defineProperty(this, "addGeoJSONFeature", function (layer, feature, customOptions) {
      return new Promise(function (resolve, reject) {
        if (!layer || !feature) {
          reject();
        }

        var source = layer.getSource();

        if (!source) {
          reject();
        }

        var parsedFeature = _this.parseGeoJSONFeature(feature, customOptions);

        source.addFeature(parsedFeature);
        return resolve(source);
      });
    });

    _defineProperty(this, "addFeature", function (layer, feature, customOptions) {
      return new Promise(function (resolve, reject) {
        if (!layer || !feature) {
          reject();
        }

        var source = layer.getSource();

        if (!source) {
          reject();
        }

        var parsedFeature = _this.parseFeature(feature, customOptions);

        source.addFeature(parsedFeature);
        return resolve(source);
      });
    });

    _defineProperty(this, "removeFeatures", function (layer) {
      return new Promise(function (resolve, reject) {
        if (!layer) {
          reject();
        }

        var source = layer.getSource();

        if (!source) {
          reject();
        }

        source.clear();
        return resolve(source);
      });
    });

    _defineProperty(this, "addFeatures", function (layer, features) {
      return new Promise(function (resolve, reject) {
        if (!layer || !features) {
          reject();
        }

        var source = layer.getSource();

        if (!source) {
          reject();
        }

        var parsedFeatures = _this.parseFeatures(features);

        source.addFeatures(parsedFeatures.getArray());
        return resolve(source);
      });
    });

    _defineProperty(this, "createLayers", function (layers, id_parent) {
      if (isEmpty(layers)) {
        return;
      }

      layers.forEach(function (layer) {
        var type = layer.type || LAYER_TYPE.VECTOR;
        var upperType = type.toUpperCase();
        var options = {};

        switch (type.toLowerCase()) {
          case LAYER_TYPE.WMS:
            {
              var params = {
                LAYERS: layer.name,
                TILED: true
              };

              if (layer.cqlFilter) {
                var cqlFilterReplaced = layer.cqlFilter.replace('%1%', layer.cqlValue);
                params = _objectSpread({}, params, {
                  cql_filter: cqlFilterReplaced
                });
              }

              options = _objectSpread({}, options, {
                url: layer.url,
                params: params
              });
              break;
            }

          default:
            break;
        }

        var layertoGenerate = _this.createLayer(upperType, options, _objectSpread({}, layer, {
          type: type.toLowerCase(),
          isRoot: !id_parent,
          idParent: id_parent
        }));

        layertoGenerate.setVisible(layer.visible);

        _this.addLayer(layertoGenerate);

        if (layer.group) {
          _this.createLayers(layer.layers, layertoGenerate.ol_uid);
        }
      });
    });

    _defineProperty(this, "createLayer", function (type, sourceOptions, customOptions, style) {
      if (!type) {
        return false;
      }

      var newLayer;

      switch (type.toLowerCase()) {
        case LAYER_TYPE.WMS:
          newLayer = _this.createWMSLayer(sourceOptions);
          break;

        case LAYER_TYPE.VECTOR:
          newLayer = _this.createVectorLayer(sourceOptions, style);
          break;

        default:
          newLayer = _this.createTileLayer(sourceOptions);
          break;
      }

      customOptions && Object.keys(customOptions).forEach(function (key) {
        newLayer.set(key, customOptions[key]);
      });
      return newLayer;
    });

    _defineProperty(this, "incrementZoom", function () {
      var view = _this.getView();

      var duration = _this.duration;
      var zoom = view.getZoom();
      view.animate({
        zoom: zoom + 1,
        duration: duration / 2
      });
    });

    _defineProperty(this, "reduceZoom", function () {
      var view = _this.getView();

      var duration = _this.duration;
      var zoom = view.getZoom();
      view.animate({
        zoom: zoom - 1,
        duration: duration / 2
      });
    });

    _defineProperty(this, "changeMapLocation", function (nextLocation) {
      if (!nextLocation) {
        return;
      }

      var view = _this.getView();

      var duration = _this.duration;
      var zoom = view.getZoom();
      view.animate({
        center: nextLocation,
        duration: duration
      });
      view.animate({
        zoom: zoom - 1,
        duration: duration / 2
      }, {
        zoom: zoom,
        duration: duration / 2
      });
    });

    _defineProperty(this, "changeMapFit", function (bboxOrGeometry, options) {
      if (!bboxOrGeometry) {
        return;
      }

      var view = _this.getView();

      var size = _this.getSize();

      var duration = _this.duration;
      view.fit(bboxOrGeometry, _objectSpread({
        size: size,
        duration: duration
      }, options));
    });

    _defineProperty(this, "openOnGoogleMaps", function () {
      /**
       * Map view
       * @constant
       */
      var view = _this.getView();
      /**
       * Transform map in 4326
       * @constant
       */


      var mapCenter = (0, _proj.transform)(view.getCenter(), view.getProjection(), 'EPSG:4326');
      /**
       * Get zoom
       * @constant
       */

      var zoom = view.getZoom();
      /**
       * Get lat
       * @constant
       */

      var lat = mapCenter[0];
      /**
       * Get lon
       * @constant
       */

      var lon = mapCenter[1];
      /**
       * Open a google map window
       * @constant
       */

      var gMapsWin = window.open("https://www.google.it/maps/@?api=1&map_action=map&center=".concat(lon, ",").concat(lat, "&zoom=").concat(zoom), 'gmaps', 'width=1024,height=768');
      /**
       * Focus on it!
       */

      gMapsWin === null || gMapsWin === void 0 ? void 0 : gMapsWin.focus();
    });

    _defineProperty(this, "capture", function () {
      (0, _htmlToImage.toPng)(_this.map.getTargetElement(), {
        filter: function filter(element) {
          return element.className ? element.className.indexOf('ol-control') === -1 : true;
        }
      }).then(function (dataURL) {
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = "map.png";
        a.click();
      });
    });

    _defineProperty(this, "getFeatureInfo", function (coordinate) {
      return new Promise(function (resolve, reject) {
        if (!coordinate) {
          reject();
        }

        var layerToInteraction = _this.getLayerToInteraction();

        var view = _this.getView();

        var type = layerToInteraction.values_.type;
        var source = layerToInteraction.getSource();

        if (!type || !source) {
          reject();
        }

        switch (type) {
          case LAYER_TYPE.VECTOR:
            {
              var data = source.getFeaturesAtCoordinate(coordinate);
              return resolve(data);
            }

          case LAYER_TYPE.WMS:
            {
              var viewResolution = view.getResolution();
              var viewProjection = view.getProjection();
              var url = source.getGetFeatureInfoUrl(coordinate, viewResolution, viewProjection.getCode(), {
                INFO_FORMAT: 'application/json'
              });

              if (!url) {
                return;
              }

              fetch(url).then(function (res) {
                var data = res;

                if (data) {
                  return data.json().then(function (dataJson) {
                    return resolve(dataJson);
                  });
                }

                return reject();
              });
              break;
            }

          default:
            return reject();
        }
      });
    });

    _defineProperty(this, "resetSelectedFeatures", function () {
      return new Promise(function (resolve) {
        if (!_this.interaction || !_this.interaction.getFeatures) {
          resolve();
        }

        _this.interaction.getFeatures().clear();

        resolve();
      });
    });

    _defineProperty(this, "getLayers", function () {
      if (!_this.map) {
        return [];
      }

      return _this.map.getLayers().getArray();
    });

    _defineProperty(this, "getLayerToInteraction", function () {
      return _this.layerToInteraction;
    });

    _defineProperty(this, "removeLayerToInteraction", function () {
      _this.layerToInteraction = null;
    });

    _defineProperty(this, "setLayerToInteraction", function (value) {
      if (!value) {
        return;
      }

      var layers = _this.getLayers();

      var layer = layers.find(function (layer) {
        return layer.ol_uid === value;
      });

      if (!layer) {
        return;
      }

      _this.layerToInteraction = layer;
    });

    _defineProperty(this, "changeLayerVisibility", function (layer, isVisible) {
      return new Promise(function (resolve, reject) {
        var layers = _this.getLayers();

        if (!layer) {
          return reject();
        }

        if (layer.values_.mutuallyExclusive) {
          // Logic only on mutually exclusive layers
          var mutuallyExclusiveLayers = layers.filter(function (layer) {
            return layer.values_.mutuallyExclusive;
          });
          mutuallyExclusiveLayers.forEach(function (l) {
            l.setVisible(l.ol_uid === layer.ol_uid);
          });
          resolve();
        } else {
          layer.setVisible(isVisible);
          /**
           * If you set the layer to invisible and this layer is the current layer
           * to interaction, reset it!
           */

          if (!isVisible && _this.layerToInteraction && _this.layerToInteraction.ol_uid === layer.ol_uid) {
            _this.removeInteraction();
          }

          resolve();
        }
      });
    });

    _defineProperty(this, "resetLayers", function () {
      return new Promise(function (resolve, reject) {
        var layers = _this.getLayers();

        if (!layers) {
          reject();
        }

        _this.map.setLayerGroup(new _Group["default"]());
        /**
         * Add default layers
         */


        var newBaseLayers = _this.getDefaultBaseLayers();

        newBaseLayers.forEach(function (layer) {
          _this.addLayer(layer);
        });
        resolve();
      });
    });

    _defineProperty(this, "changeOpacity", function (layer, value) {
      return new Promise(function (resolve, reject) {
        if (!layer) {
          reject();
        }

        layer.setOpacity(value);
        resolve();
      });
    });
  }

  _createClass(Map, [{
    key: "create",
    value: function create(params) {
      if (!params) {
        return;
      }

      this.map = new _Map["default"](_objectSpread({}, params, {
        layers: params.layers || this.getDefaultBaseLayers()
      }));
      return this.map;
    }
  }, {
    key: "parseGeoJSONFeature",

    /**
     * Parse GeoJSON feature
     *
     * @param f
     * @param customOptions
     */
    value: function parseGeoJSONFeature(f, customOptions) {
      if (!f) {
        return;
      }

      var format = new _GeoJSON["default"]();
      var feature = new _Feature["default"]();
      var geom = format.readGeometry(f.geom || f.geometry);
      feature.setId(f.id);
      feature.setGeometry(geom);
      console.log(customOptions, Object.keys(customOptions));

      if (customOptions) {
        Object.keys(customOptions).forEach(function (key) {
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

  }, {
    key: "parseFeature",
    value: function parseFeature(f, customOptions) {
      if (!f) {
        return;
      }

      var format = new _WKT["default"]();
      var feature = new _Feature["default"]();
      var geom = format.readGeometryFromText(f.geom);
      feature.setId(f.id);
      feature.setGeometry(geom);

      if (customOptions) {
        Object.keys(customOptions).forEach(function (key) {
          return feature.set(key, customOptions[key]);
        });
      }

      return feature;
    }
    /**
     * Parse WKT features
     *
     * @param data
     */

  }, {
    key: "createVectorLayer",

    /**
     *
     * @param sourceOptions
     * @param style
     */
    value: function createVectorLayer(sourceOptions, style) {
      var options = {};

      if (sourceOptions) {
        options = _objectSpread({}, sourceOptions, {}, sourceOptions);
      }

      return new _Vector["default"]({
        source: new _Vector2["default"](_objectSpread({}, options, {
          crossOrigin: 'Anonymous'
        })),
        style: style,
        updateWhileAnimating: true,
        updateWhileInteracting: true
      });
    }
    /**
     *
     * @param sourceOptions
     */

  }, {
    key: "createWMSLayer",
    value: function createWMSLayer(sourceOptions) {
      return new _Tile["default"]({
        source: new _TileWMS["default"](_objectSpread({}, sourceOptions, {
          crossOrigin: 'Anonymous'
        }))
      });
    }
    /**
     *
     * @param sourceOptions
     */

  }, {
    key: "createTileLayer",
    value: function createTileLayer(sourceOptions) {
      var options = {};

      if (sourceOptions) {
        options = _objectSpread({}, sourceOptions, {}, options);
      }

      return new _Tile["default"]({
        source: new _OSM["default"](_objectSpread({}, options, {
          crossOrigin: 'Anonymous'
        })),
        updateWhileAnimating: true,
        updateWhileInteracting: true
      });
    }
  }, {
    key: "addSelectedFeature",

    /**
     *
     * @param feature
     */
    value: function addSelectedFeature(feature) {
      if (!feature) {
        return;
      }

      var features = this.interaction.getFeatures(); // const length = features.getLength();

      features.push(feature);
    }
    /**
     * Reset selected features
     */

  }]);

  return Map;
}();

var _default = Map;
exports["default"] = _default;