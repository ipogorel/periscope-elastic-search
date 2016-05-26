"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AstToElasticSearchQueryParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _periscopeFramework = require("periscope-framework");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    key: "type",
    get: function get() {
      return this._serverSide;
    }
  }]);

  return AstToElasticSearchQueryParser;
}(_periscopeFramework.AstParser);