define(['exports', 'aurelia-framework', 'periscope-framework', 'lodash'], function (exports, _aureliaFramework, _periscopeFramework, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ElasticSearchSchemaProvider = undefined;

  var _ = _interopRequireWildcard(_lodash);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ElasticSearchSchemaProvider = exports.ElasticSearchSchemaProvider = function (_SchemaProvider) {
    _inherits(ElasticSearchSchemaProvider, _SchemaProvider);

    function ElasticSearchSchemaProvider(http, host, index, type) {
      _classCallCheck(this, ElasticSearchSchemaProvider);

      var _this = _possibleConstructorReturn(this, _SchemaProvider.call(this));

      _this.host = host;
      _this.index = index;
      _this.type = type;
      http.configure(function (config) {
        config.useStandardConfiguration();
      });
      _this._http = http;
      return _this;
    }

    ElasticSearchSchemaProvider.prototype.getSchema = function getSchema() {
      var _this2 = this;

      return this._http.fetch(this.host + "_mappings/" + this.type).then(function (response) {
        return response.json();
      }).then(function (jsonData) {
        var flds = jsonData[_this2.index].mappings[_this2.type].properties;
        var result = [];
        _.forOwn(flds, function (value, key) {
          var t = value.type;
          if (t === 'float') t = "number";
          result.push({ field: key, type: t });
        });
        return {
          fields: result
        };
      });
    };

    return ElasticSearchSchemaProvider;
  }(_periscopeFramework.SchemaProvider);
});