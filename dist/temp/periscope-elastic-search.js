'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticSearchSchemaProvider = exports.AstToElasticSearchQueryParser = exports.ElasticSearchDataService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class, _dec3, _class2;

var _astToElasticSearchQueryParser = require('./data/ast/parsers/ast-to-elastic-search-query-parser');

Object.keys(_astToElasticSearchQueryParser).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _astToElasticSearchQueryParser[key];
    }
  });
});

var _elasticSearchSchemaProvider = require('./data/schema/providers/elastic-search-schema-provider');

Object.keys(_elasticSearchSchemaProvider).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _elasticSearchSchemaProvider[key];
    }
  });
});

var _elasticsearchDataService = require('./data/service/elasticsearch-data-service');

Object.keys(_elasticsearchDataService).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _elasticsearchDataService[key];
    }
  });
});
exports.configure = configure;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _periscopeFramework = require('periscope-framework');

var _aureliaFramework = require('aurelia-framework');

var _aureliaFetchClient = require('aurelia-fetch-client');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function configure(aurelia) {}

var ElasticSearchDataService = exports.ElasticSearchDataService = (_dec = (0, _aureliaFramework.transient)(), _dec2 = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = _dec2(_class = function (_DataService) {
  _inherits(ElasticSearchDataService, _DataService);

  function ElasticSearchDataService(http) {
    _classCallCheck(this, ElasticSearchDataService);

    var _this = _possibleConstructorReturn(this, _DataService.call(this));

    http.configure(function (config) {
      config.useStandardConfiguration();
    });
    _this._http = http;
    return _this;
  }

  ElasticSearchDataService.prototype.read = function read(options) {
    var _this2 = this;

    var url = this.url + "_search";
    var request = {};
    if (options.fields) request._source = { include: options.fields };
    if (options.filter && options.filter.length > 0) request.query = JSON.parse(this.filterParser.getFilter(options.filter));
    if (options.take) request.size = options.take;
    if (options.skip) request.from = options.skip;
    if (options.sort) {
      var s = options.sort;
      if (!options.sortDir) request.sort = [s];else {
        request.sort = [{}];
        request.sort[0][s] = options.sortDir;
      }
    }

    return this._http.fetch(url, {
      method: 'post',
      body: (0, _aureliaFetchClient.json)(request)
    }).then(function (response) {
      return response.json();
    }).then(function (jsonData) {
      var d = _.map(jsonData.hits.hits, "_source");
      return {
        data: d,
        total: _this2.totalMapper ? _this2.totalMapper(jsonData) : jsonData.hits.total
      };
    });
  };

  return ElasticSearchDataService;
}(_periscopeFramework.DataService)) || _class) || _class);

var AstToElasticSearchQueryParser = exports.AstToElasticSearchQueryParser = function (_AstParser) {
  _inherits(AstToElasticSearchQueryParser, _AstParser);

  function AstToElasticSearchQueryParser() {
    _classCallCheck(this, AstToElasticSearchQueryParser);

    return _possibleConstructorReturn(this, _AstParser.call(this));
  }

  AstToElasticSearchQueryParser.prototype.getFilter = function getFilter(astTree) {
    if (astTree[0]) {
      var result = {
        "constant_score": {
          "query": {
            "bool": {
              "must": this._parseTree(astTree[0], [])
            }
          }
        }
      };
      return JSON.stringify(result);
    }
    return "";
  };

  AstToElasticSearchQueryParser.prototype._parseTree = function _parseTree(treeNode, result) {

    if (treeNode.left) {
      result.push(this._createExpression(treeNode.connector, treeNode.left));
      if (treeNode.right) this._parseTree(treeNode.right, result);
    } else result.push(this._createExpression(treeNode.connector, treeNode));
    return result;
  };

  AstToElasticSearchQueryParser.prototype._createExpression = function _createExpression(connector, node) {
    var fieldname = node.field;
    var operand = node.operand;
    var value = node.value;
    var res = void 0;
    switch (operand) {
      case "==":
        res = this._createEqualExpression(node);
        break;
      case "!=":
        res = '{"term" : {"' + node.field + '":"' + node.value + '"}}';
        break;
      case ">":
        res = this._createRangeExpression(node, "gt");
        break;
      case "<":
        res = this._createRangeExpression(node, "lt");
        break;
      case ">=":
        res = this._createRangeExpression(node, "gte");
        break;
      case "<=":
        res = this._createRangeExpression(node, "lte");
        break;
    }
    return res;
  };

  AstToElasticSearchQueryParser.prototype._createRangeExpression = function _createRangeExpression(node, operand) {
    var _node$field, _range;

    return {
      "range": (_range = {}, _range[node.field] = (_node$field = {}, _node$field[operand] = node.value, _node$field), _range)
    };
  };

  AstToElasticSearchQueryParser.prototype._createEqualExpression = function _createEqualExpression(node) {
    var v = node.value.trim().toLowerCase();
    var result = '';
    if (v.length >= 2) {
      if (v.lastIndexOf("%") === v.length - 1) {
        var _prefix;

        result = {
          "prefix": (_prefix = {}, _prefix[node.field] = v.substring(0, v.length - 1), _prefix)
        };
      } else if (v.indexOf("%") === 0) {
        var _wildcard;

        result = {
          "wildcard": (_wildcard = {}, _wildcard[node.field] = "*" + v.substring(1, v.length), _wildcard)
        };
      }
    }

    if (!result) {
      if (v.split(' ').length > 1) {
        var _match;

        result = {
          "match": (_match = {}, _match[node.field] = {
            "query": v,
            "operator": "and"
          }, _match)
        };
      } else {
        var _term;

        result = {
          "term": (_term = {}, _term[node.field] = v, _term)
        };
      }
    }
    return result;
  };

  _createClass(AstToElasticSearchQueryParser, [{
    key: 'type',
    get: function get() {
      return this._serverSide;
    }
  }]);

  return AstToElasticSearchQueryParser;
}(_periscopeFramework.AstParser);

var ElasticSearchSchemaProvider = exports.ElasticSearchSchemaProvider = (_dec3 = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec3(_class2 = function (_SchemaProvider) {
  _inherits(ElasticSearchSchemaProvider, _SchemaProvider);

  function ElasticSearchSchemaProvider(http, host, index, type) {
    _classCallCheck(this, ElasticSearchSchemaProvider);

    var _this4 = _possibleConstructorReturn(this, _SchemaProvider.call(this));

    _this4.host = host;
    _this4.index = index;
    _this4.type = type;
    http.configure(function (config) {
      config.useStandardConfiguration();
    });
    _this4._http = http;
    return _this4;
  }

  ElasticSearchSchemaProvider.prototype.getSchema = function getSchema() {
    var _this5 = this;

    return this._http.fetch(this.host + "_mappings/" + this.type).then(function (response) {
      return response.json();
    }).then(function (jsonData) {
      var flds = jsonData[_this5.index].mappings[_this5.type].properties;
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
}(_periscopeFramework.SchemaProvider)) || _class2);