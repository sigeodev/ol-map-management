"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.LAYER_TYPE = void 0;

var _react = _interopRequireDefault(require("react"));

var _htmlToImage = require("html-to-image");

var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));

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
  mutuallyExclusive: true
}, {
  value: 'CanvasDark',
  icon: _react["default"].createElement(_Brightness["default"], null),
  label: 'Dark',
  mutuallyExclusive: true
}, {
  value: 'AerialWithLabelsOnDemand',
  icon: _react["default"].createElement(_Flight["default"], null),
  label: 'Aereo',
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

    _defineProperty(this, "customInteractions", []);

    _defineProperty(this, "customLayers", []);

    _defineProperty(this, "onReset", null);

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

    _defineProperty(this, "setResetHandler", function (handler) {
      if (!handler) {
        return;
      }

      _this.onReset = handler;
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

    _defineProperty(this, "addInteraction", function (interaction) {
      return new Promise(function (resolve) {
        _this.customInteractions = [].concat(_toConsumableArray(_this.customInteractions), [interaction]);

        _this.map.addInteraction(interaction);

        resolve();
      });
    });

    _defineProperty(this, "removeInteraction", function (interaction) {
      return new Promise(function (resolve, reject) {
        if (!interaction) {
          reject();
        }

        _this.customInteractions = _this.customInteractions.filter(function (i) {
          return i.ol_uid !== interaction.ol_uid;
        });

        _this.map.removeInteraction(interaction);

        resolve();
      });
    });

    _defineProperty(this, "on", function (evt, callback) {
      return _this.map.on(evt, callback);
    });

    _defineProperty(this, "removeLayer", function (layer) {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          resolve();
        }

        _this.customLayers = _this.customLayers.filter(function (l) {
          return l.ol_uid !== layer.ol_uid;
        });

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
      if ((0, _isEmpty["default"])(layers)) {
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
      _this.customLayers = [].concat(_toConsumableArray(_this.customLayers), [newLayer]);
      return newLayer;
    });

    _defineProperty(this, "createAsyncLayer", function (type, sourceOptions, customOptions, style) {
      return new Promise(function (resolve, reject) {
        if (!type) {
          return reject();
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
        return resolve(newLayer);
      });
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

    _defineProperty(this, "getLayers", function () {
      if (!_this.map) {
        return [];
      }

      return _this.map.getLayers().getArray();
    });

    _defineProperty(this, "getInteractions", function () {
      if (!_this.map) {
        return [];
      }

      return _this.map.getInteractions().getArray();
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

        _this.customLayers = [];
        /**
         * Add default layers
         */

        var newBaseLayers = _this.getDefaultBaseLayers();

        newBaseLayers.forEach(function (layer) {
          _this.addLayer(layer);
        });

        if (_this.onReset) {
          _this.onReset();
        }

        resolve();
      });
    });

    _defineProperty(this, "resetCustomLayers", function () {
      return new Promise(function (resolve) {
        _this.customLayers.forEach(function (l) {
          return _this.removeLayer(l);
        });

        resolve();
      });
    });

    _defineProperty(this, "resetInteractions", function () {
      return new Promise(function (resolve, reject) {
        var interactions = _this.getInteractions();

        if (!interactions) {
          reject();
        }

        interactions.forEach(function (i) {
          return _this.removeInteraction(i);
        });
        resolve();
      });
    });

    _defineProperty(this, "resetCustomInteractions", function () {
      return new Promise(function (resolve) {
        _this.customInteractions.forEach(function (i) {
          return _this.removeInteraction(i);
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

      if (!(0, _isEmpty["default"])(customOptions)) {
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
      var geom = format.readGeometryFromText(f.geom || f.geometry);
      feature.setId(f.id);
      feature.setGeometry(geom);

      if (!(0, _isEmpty["default"])(customOptions)) {
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
  }]);

  return Map;
}();

var _default = Map;
exports["default"] = _default;