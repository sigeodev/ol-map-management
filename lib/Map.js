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

var _Select = _interopRequireDefault(require("ol/interaction/Select"));

var _Modify = _interopRequireDefault(require("ol/interaction/Modify"));

var _Draw = _interopRequireDefault(require("ol/interaction/Draw"));

var _GeometryType = _interopRequireDefault(require("ol/geom/GeometryType"));

var _Terrain = _interopRequireDefault(require("@material-ui/icons/Terrain"));

var _Flight = _interopRequireDefault(require("@material-ui/icons/Flight"));

var _Brightness = _interopRequireDefault(require("@material-ui/icons/Brightness4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  icon: /*#__PURE__*/_react["default"].createElement(_Terrain["default"], null),
  label: 'Strada',
  mutuallyExclusive: true
}, {
  value: 'CanvasDark',
  icon: /*#__PURE__*/_react["default"].createElement(_Brightness["default"], null),
  label: 'Dark',
  mutuallyExclusive: true
}, {
  value: 'AerialWithLabelsOnDemand',
  icon: /*#__PURE__*/_react["default"].createElement(_Flight["default"], null),
  label: 'Aereo',
  mutuallyExclusive: true
}];

var Map = /*#__PURE__*/function () {
  function Map() {
    var _this = this;

    _classCallCheck(this, Map);

    _defineProperty(this, "map", null);

    _defineProperty(this, "bingKey", null);

    _defineProperty(this, "duration", 2000);

    _defineProperty(this, "customInteractions", []);

    _defineProperty(this, "customLayers", []);

    _defineProperty(this, "editing", null);

    _defineProperty(this, "selection", null);

    _defineProperty(this, "drawing", {
      layer: null,
      interaction: null
    });

    _defineProperty(this, "getMap", function () {
      return _this.map;
    });

    _defineProperty(this, "getView", function () {
      return _this.map.getView();
    });

    _defineProperty(this, "getSize", function () {
      return _this.map.getSize();
    });

    _defineProperty(this, "getSelection", function () {
      return _this.selection;
    });

    _defineProperty(this, "getEditing", function () {
      return _this.editing;
    });

    _defineProperty(this, "getDrawing", function () {
      return _this.drawing;
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
      var baseLayers = []; // Create invisible base layers

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
      }); // Enable (set to visible) first base layer!

      baseLayers[0].setVisible(true);
      return baseLayers;
    });

    _defineProperty(this, "reset", function () {
      return Promise.all([_this.resetCustomLayers(), _this.resetCustomInteractions()]);
    });

    _defineProperty(this, "pushSelectedFeature", function (feature) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.selection || !feature) {
          reject();
        }

        _this.selection.getFeatures().push(feature);

        _this.selection.dispatchEvent('select');

        resolve(_this.selection);
      });
    });

    _defineProperty(this, "cleanSelection", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.selection) {
          reject();
        }

        _this.selection.getFeatures().clear();

        _this.selection.dispatchEvent('change');

        resolve(_this.selection);
      });
    });

    _defineProperty(this, "enableSelection", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.selection) {
          reject();
        }

        _this.selection.setActive(true);

        resolve(_this.selection);
      });
    });

    _defineProperty(this, "disableSelection", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.selection) {
          reject();
        }

        _this.selection.setActive(false);

        resolve(_this.selection);
      });
    });

    _defineProperty(this, "disableEditing", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.editing || !_this.selection) {
          reject();
        }

        _this.editing.setActive(false);

        _this.selection.setActive(true);

        resolve(_this.editing);
      });
    });

    _defineProperty(this, "enableEditing", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.editing || !_this.selection) {
          reject();
        }

        _this.editing.setActive(true);

        _this.selection.setActive(false);

        resolve(_this.editing);
      });
    });

    _defineProperty(this, "disableDrawing", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.drawing || !_this.selection) {
          reject();
        }

        _this.drawing.interaction.setActive(false);

        _this.selection.setActive(true);

        resolve(_this.drawing);
      });
    });

    _defineProperty(this, "changeSelectionInteraction", function (options) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.selection || (0, _isEmpty["default"])(options)) {
          reject();
        }

        var currentActiveState = _this.selection.getActive();

        _this.removeInteraction(_this.selection);

        var newInteraction = new _Select["default"](options);
        newInteraction.setActive(currentActiveState);

        _this.addInteraction(newInteraction);

        _this.selection = newInteraction;
        resolve(_this.selection);
      });
    });

    _defineProperty(this, "changeEditingInteraction", function (options) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.editing || (0, _isEmpty["default"])(options)) {
          reject();
        }

        var currentActiveState = _this.editing.getActive();

        _this.removeInteraction(_this.editing);

        var newEditingInteraction = new _Modify["default"](_objectSpread({
          features: _this.selection.getFeatures()
        }, options));
        newEditingInteraction.setActive(currentActiveState);

        _this.addInteraction(newEditingInteraction);

        _this.editing = newEditingInteraction;
        resolve(_this.editing);
      });
    });

    _defineProperty(this, "changeDrawingInteraction", function (options) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.drawing || (0, _isEmpty["default"])(options)) {
          reject();
        }

        var source = _this.drawing.layer.getSource();

        var currentActiveState = _this.drawing.interaction.getActive();

        _this.removeInteraction(_this.drawing.interaction);

        var newDrawingInteraction = new _Draw["default"](_objectSpread({
          source: source,
          type: _GeometryType["default"].POLYGON
        }, options));
        newDrawingInteraction.setActive(currentActiveState);

        _this.addInteraction(newDrawingInteraction);

        _this.drawing = _objectSpread(_objectSpread({}, _this.drawing), {}, {
          interaction: newDrawingInteraction
        });
        resolve(_this.drawing);
      });
    });

    _defineProperty(this, "enableDrawing", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !_this.drawing || !_this.selection) {
          reject();
        }

        _this.drawing.interaction.setActive(true);

        _this.selection.setActive(false);

        resolve(_this.drawing);
      });
    });

    _defineProperty(this, "addInteraction", function (interaction) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !interaction) {
          reject();
        }

        _this.customInteractions = [].concat(_toConsumableArray(_this.customInteractions), [interaction]);

        _this.map.addInteraction(interaction);

        resolve(_this.customInteractions);
      });
    });

    _defineProperty(this, "removeInteraction", function (interaction) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !interaction) {
          reject();
        }

        _this.customInteractions = _this.customInteractions.filter(function (i) {
          return i.ol_uid !== interaction.ol_uid;
        });

        _this.map.removeInteraction(interaction);

        resolve(_this.customInteractions);
      });
    });

    _defineProperty(this, "removeLayer", function (layer) {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        _this.customLayers = _this.customLayers.filter(function (l) {
          return l.ol_uid !== layer.ol_uid;
        });

        _this.map.removeLayer(layer);

        resolve(_this.getLayers());
      });
    });

    _defineProperty(this, "addLayer", function (layer) {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        _this.customLayers = [].concat(_toConsumableArray(_this.customLayers), [layer]);

        _this.map.addLayer(layer);

        resolve(_this.getLayers());
      });
    });

    _defineProperty(this, "addGeoJSONItem", function (layer, item) {
      if (!_this.map || !layer || !item) {
        return undefined;
      }

      var source = layer.getSource();

      var feature = _this.createGeoJSONFeature(item);

      return source.addFeature(feature);
    });

    _defineProperty(this, "addGeoJSONItems", function (layer, items) {
      if (!_this.map || !layer || !items) {
        return undefined;
      }

      var source = layer.getSource();
      var features = items.map(function (i) {
        return _this.createGeoJSONFeature(i);
      });
      return source.addFeatures(features);
    });

    _defineProperty(this, "createGeoJSONFeature", function (item) {
      if (!_this.map || !item) {
        return undefined;
      }

      var format = new _GeoJSON["default"]();
      return new _Feature["default"](_objectSpread(_objectSpread({}, item), {}, {
        geometry: format.readGeometry(item.geom || item.geometry)
      }));
    });

    _defineProperty(this, "createWKTFeature", function (item) {
      if (!_this.map || !item) {
        return undefined;
      }

      var format = new _WKT["default"]();
      return new _Feature["default"](_objectSpread(_objectSpread({}, item), {}, {
        geometry: format.readGeometryFromText(item.geom || item.geometry)
      }));
    });

    _defineProperty(this, "addWKTItem", function (layer, item) {
      if (!_this.map || !layer || !item) {
        return undefined;
      }

      var source = layer.getSource();

      var feature = _this.createWKTFeature(item);

      return source.addFeature(feature);
    });

    _defineProperty(this, "addWKTItems", function (layer, items) {
      if (!_this.map || !layer || !items) {
        reject();
      }

      var source = layer.getSource();
      var features = items.map(function (i) {
        return _this.createWKTFeature(i);
      });
      return source.addFeatures(features);
    });

    _defineProperty(this, "removeFeatures", function (layer) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !layer) {
          reject();
        }

        var source = layer.getSource();

        if (!source) {
          reject();
        }

        source.clear();
        resolve(source);
      });
    });

    _defineProperty(this, "createVectorLayer", function (sourceOptions, style) {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        var options = {};

        if (sourceOptions) {
          options = _objectSpread(_objectSpread({}, sourceOptions), options);
        }

        var layer = new _Vector["default"]({
          source: new _Vector2["default"](_objectSpread(_objectSpread({}, options), {}, {
            crossOrigin: 'Anonymous'
          })),
          style: style,
          updateWhileAnimating: true,
          updateWhileInteracting: true
        });

        if (!layer) {
          reject();
        }

        resolve(layer);
      });
    });

    _defineProperty(this, "createWMSLayer", function (sourceOptions) {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        var options = {};

        if (sourceOptions) {
          options = _objectSpread(_objectSpread({}, sourceOptions), options);
        }

        var layer = new _Tile["default"]({
          source: new _TileWMS["default"](_objectSpread(_objectSpread({}, sourceOptions), {}, {
            crossOrigin: 'Anonymous'
          })),
          preload: Infinity
        });

        if (!layer) {
          reject();
        }

        resolve(layer);
      });
    });

    _defineProperty(this, "createTileLayer", function (sourceOptions) {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        var options = {};

        if (sourceOptions) {
          options = _objectSpread(_objectSpread({}, sourceOptions), options);
        }

        var layer = new _Tile["default"]({
          source: new _OSM["default"](_objectSpread(_objectSpread({}, options), {}, {
            crossOrigin: 'Anonymous'
          })),
          preload: Infinity,
          updateWhileAnimating: true,
          updateWhileInteracting: true
        });

        if (!layer) {
          reject();
        }

        resolve(layer);
      });
    });

    _defineProperty(this, "createLayer", function (type, sourceOptions, customOptions, style) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !type) {
          reject();
        }

        var funcToCall;

        switch (type.toLowerCase()) {
          case LAYER_TYPE.WMS:
            funcToCall = _this.createWMSLayer;
            break;

          case LAYER_TYPE.VECTOR:
            funcToCall = _this.createVectorLayer;
            break;

          default:
            funcToCall = _this.createTileLayer;
            break;
        }

        funcToCall(sourceOptions, style).then(function (newLayer) {
          customOptions && Object.keys(customOptions).forEach(function (key) {
            newLayer.set(key, customOptions[key]);
          });
          resolve(newLayer);
        })["catch"](function () {
          return reject();
        });
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

    _defineProperty(this, "capture", function (full) {
      if (!_this.map) {
        return;
      }

      var options = {};

      if (!full) {
        options = _objectSpread(_objectSpread({}, options), {}, {
          filter: function filter(element) {
            return element.className ? element.className.indexOf('ol-control') === -1 : true;
          }
        });
      }

      (0, _htmlToImage.toPng)(_this.map.getTargetElement(), options).then(function (dataURL) {
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
        if (!_this.map || !layer) {
          reject();
        }

        var layers = _this.getLayers();

        var isMutuallyExclusive = layer.get('mutuallyExclusive');

        if (isMutuallyExclusive) {
          // Logic only on mutually exclusive layers
          var mutuallyExclusiveLayers = layers.filter(function (layer) {
            return layer.get('mutuallyExclusive');
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
        if (!_this.map) {
          reject();
        }

        var layers = _this.getLayers();

        if (!layers) {
          reject();
        }

        _this.map.setLayerGroup(new _Group["default"]());

        _this.customLayers = [];
        resolve(_this.getLayers());
      });
    });

    _defineProperty(this, "resetCustomLayers", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        Promise.all(_this.customLayers.map(function (l) {
          return _this.removeLayer(l);
        })).then(function () {
          var firstLayer = _this.getLayers()[0];

          if (firstLayer) {
            _this.changeLayerVisibility(firstLayer, true);
          }

          resolve();
        })["catch"](function () {
          return reject();
        });
      });
    });

    _defineProperty(this, "resetInteractions", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        var interactions = _this.getInteractions();

        if (!interactions) {
          reject();
        }

        Promise.all(interactions.map(function (i) {
          return _this.removeInteraction(i);
        })).then(function () {
          return resolve();
        })["catch"](function () {
          return reject();
        });
      });
    });

    _defineProperty(this, "resetCustomInteractions", function () {
      return new Promise(function (resolve, reject) {
        if (!_this.map) {
          reject();
        }

        if ((0, _isEmpty["default"])(_this.customInteractions)) {
          resolve();
        }

        Promise.all(_this.customInteractions.map(function (i) {
          return _this.removeInteraction(i);
        })).then(function () {
          return resolve();
        })["catch"](function () {
          return reject();
        });
      });
    });

    _defineProperty(this, "changeOpacity", function (layer, value) {
      return new Promise(function (resolve, reject) {
        if (!_this.map || !layer) {
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
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (!params) {
          reject();
        }

        var layers = params.layers,
            rest = _objectWithoutProperties(params, ["layers"]);

        _this2.map = new _Map["default"](_objectSpread(_objectSpread({}, rest), {}, {
          layers: layers || _this2.getDefaultBaseLayers()
        }));

        _this2.createLayer(LAYER_TYPE.VECTOR, null, {
          mutuallyExclusive: false,
          type: LAYER_TYPE.VECTOR
        }).then(function (drawingLayer) {
          var drawing = {
            layer: drawingLayer,
            interaction: new _Draw["default"]({
              source: drawingLayer.getSource(),
              type: _GeometryType["default"].POLYGON
            })
          };
          var selection = new _Select["default"]();
          var editing = new _Modify["default"]({
            features: selection.getFeatures()
          });
          drawingLayer.setZIndex(300);
          drawing.interaction.setActive(false);
          editing.setActive(false);
          selection.setActive(true);

          _this2.map.addLayer(drawing.layer);

          _this2.map.addInteraction(drawing.interaction);

          _this2.map.addInteraction(editing);

          _this2.map.addInteraction(selection);

          _this2.editing = editing;
          _this2.selection = selection;
          _this2.drawing = drawing;
          resolve(_this2.map);
        })["catch"](function (e) {
          return reject(e);
        });
      });
    }
  }]);

  return Map;
}();

var _default = Map;
exports["default"] = _default;