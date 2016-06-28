'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticSearchSchemaProvider = exports.ElasticSearchToDslTemplates = exports.AstToElasticSearchQueryParser = exports.ElasticSearchDataService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _elasticSearchDslTemplates = require('./data/ast/parsers/elastic-search-dsl-templates');

Object.keys(_elasticSearchDslTemplates).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _elasticSearchDslTemplates[key];
    }
  });
});

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

var ElasticSearchDataService = exports.ElasticSearchDataService = (_dec = (0, _aureliaFramework.transient)(), _dec(_class = function (_DataService) {
  _inherits(ElasticSearchDataService, _DataService);

  function ElasticSearchDataService() {
    _classCallCheck(this, ElasticSearchDataService);

    return _possibleConstructorReturn(this, _DataService.call(this));
  }

  ElasticSearchDataService.prototype.read = function read(options) {
    var _this2 = this;

    var url = this.url + "_search";
    var request = {};
    if (options.fields) request._source = { include: options.fields };
    if (options.filter) request.query = JSON.parse(this.filterParser.getFilter(options.filter));
    if (options.take) request.size = options.take;
    if (options.skip) request.from = options.skip;
    if (options.sort) {
      var s = options.sort;
      if (!options.sortDir) request.sort = [s];else {
        request.sort = [{}];
        request.sort[0][s] = options.sortDir;
      }
    }

    return this.httpClient.fetch(url, {
      method: 'post',
      body: (0, _aureliaFetchClient.json)(request)
    }).then(function (response) {
      var a = 2;
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
}(_periscopeFramework.DataService)) || _class);

var AstToElasticSearchQueryParser = exports.AstToElasticSearchQueryParser = function (_AstParser) {
  _inherits(AstToElasticSearchQueryParser, _AstParser);

  function AstToElasticSearchQueryParser() {
    _classCallCheck(this, AstToElasticSearchQueryParser);

    var _this3 = _possibleConstructorReturn(this, _AstParser.call(this));

    _this3.templates = new ElasticSearchToDslTemplates();
    return _this3;
  }

  AstToElasticSearchQueryParser.prototype.getFilter = function getFilter(astTree) {
    if (astTree) {
      var result = {
        bool: {}
      };
      this._parseTree(astTree, result.bool);
      return JSON.stringify(result);
    }
    return "";
  };

  AstToElasticSearchQueryParser.prototype._parseTree = function _parseTree(treeNode, boolNode) {
    if (!treeNode.right) {
      var nLeft = treeNode.left ? treeNode.left : treeNode;
      boolNode["must"] = [this._createExpression(nLeft)];
      return;
    }

    var lop = this._getOccurrenceType(treeNode, "left");
    var rop = this._getOccurrenceType(treeNode, "right");

    if (treeNode.left.right) {
      boolNode[lop] = [{ bool: {} }];
      this._parseTree(treeNode.left, boolNode[lop][0].bool);
    } else boolNode[lop] = [this._createExpression(treeNode.left)];

    if (treeNode.right.left) {
      boolNode[lop].push({ bool: {} });
      this._parseTree(treeNode.right, boolNode[lop][1].bool);
    } else {
      if (lop === rop) boolNode[rop].push(this._createExpression(treeNode.right));else boolNode[rop] = [this._createExpression(treeNode.right)];
    }
    return;
  };

  AstToElasticSearchQueryParser.prototype._getOccurrenceType = function _getOccurrenceType(treeNode, side) {
    switch (side) {
      case "left":
        if (treeNode.left) {
          if (treeNode.left.operand && treeNode.left.operand.trim() === "!=") return "must_not";else if (treeNode.right.connector.trim() === "||") return "should";
        }
        return "must";
      case "right":
        if (treeNode.right) {
          if (treeNode.right.operand && treeNode.right.operand.trim() === "!=") return "must_not";else if (treeNode.right.connector.trim() === "||") return "should";
        }
        return "must";
      default:
        return "";
    }
  };

  AstToElasticSearchQueryParser.prototype._createExpression = function _createExpression(node) {
    var fieldname = node.field;
    var operand = node.operand;
    var value = node.value;
    var res = void 0;
    switch (operand) {
      case "==":
      case "!=":
        res = this._createEqualExpression(node);
        break;
      case ">":
      case "<":
      case ">=":
      case "<=":
        res = this.templates.range(fieldname, operand, value);
        break;
      case "in":
        res = this.templates.terms(fieldname, value);
        break;
    }
    return res;
  };

  AstToElasticSearchQueryParser.prototype._createEqualExpression = function _createEqualExpression(node) {
    var v = node.value.trim();
    var result = '';
    if (v.length >= 2) {
      if (v.lastIndexOf("%") === v.length - 1) result = this.templates.prefix(node.field, v.substring(0, v.length - 1));else if (v.indexOf("%") === 0) result = this.templates.wildcard(node.field, "*" + v.substring(1, v.length));
    }
    if (!result) {
      if (v.split(' ').length > 1) {
        result = this.templates.match(node.field, v);
      } else result = this.templates.term(node.field, v);
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

var ElasticSearchToDslTemplates = exports.ElasticSearchToDslTemplates = function () {
  function ElasticSearchToDslTemplates() {
    _classCallCheck(this, ElasticSearchToDslTemplates);
  }

  ElasticSearchToDslTemplates.prototype.range = function range(field, operand, value) {
    var _field, _range;

    var o = "";
    switch (operand) {
      case ">":
        o = "gt";
        break;
      case "<":
        o = "lt";
        break;
      case ">=":
        o = "gte";
        break;
      case "<=":
        o = "lte";
        break;
    }
    return {
      "range": (_range = {}, _range[field] = (_field = {}, _field[o] = value, _field), _range)
    };
  };

  ElasticSearchToDslTemplates.prototype.wildcard = function wildcard(field, value) {
    var _wildcard;

    return {
      "wildcard": (_wildcard = {}, _wildcard[field] = value.toLowerCase(), _wildcard)
    };
  };

  ElasticSearchToDslTemplates.prototype.prefix = function prefix(field, value) {
    var _prefix;

    return {
      "prefix": (_prefix = {}, _prefix[field] = value.toLowerCase(), _prefix)
    };
  };

  ElasticSearchToDslTemplates.prototype.terms = function terms(field, valuesArray) {
    var _terms;

    return {
      "terms": (_terms = {}, _terms[field] = _.map(valuesArray, function (v) {
        return v.toLowerCase();
      }), _terms)
    };
  };

  ElasticSearchToDslTemplates.prototype.term = function term(field, value) {
    var _term;

    return {
      "term": (_term = {}, _term[field] = value.toLowerCase(), _term)
    };
  };

  ElasticSearchToDslTemplates.prototype.match = function match(field, value) {
    var _match;

    return {
      "match": (_match = {}, _match[field] = {
        "query": value.toLowerCase(),
        "operator": "and"
      }, _match)
    };
  };

  return ElasticSearchToDslTemplates;
}();

var ElasticSearchSchemaProvider = exports.ElasticSearchSchemaProvider = function (_SchemaProvider) {
  _inherits(ElasticSearchSchemaProvider, _SchemaProvider);

  function ElasticSearchSchemaProvider(http, host, index, type) {
    _classCallCheck(this, ElasticSearchSchemaProvider);

    var _this4 = _possibleConstructorReturn(this, _SchemaProvider.call(this));

    _this4.host = host;
    _this4.index = index;
    _this4.type = type;
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
}(_periscopeFramework.SchemaProvider);