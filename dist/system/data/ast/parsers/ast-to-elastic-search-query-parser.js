'use strict';

System.register(['./elastic-search-dsl-templates', 'periscope-framework'], function (_export, _context) {
  "use strict";

  var ElasticSearchToDslTemplates, AstParser, _createClass, AstToElasticSearchQueryParser;

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

  return {
    setters: [function (_elasticSearchDslTemplates) {
      ElasticSearchToDslTemplates = _elasticSearchDslTemplates.ElasticSearchToDslTemplates;
    }, function (_periscopeFramework) {
      AstParser = _periscopeFramework.AstParser;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('AstToElasticSearchQueryParser', AstToElasticSearchQueryParser = function (_AstParser) {
        _inherits(AstToElasticSearchQueryParser, _AstParser);

        function AstToElasticSearchQueryParser() {
          _classCallCheck(this, AstToElasticSearchQueryParser);

          var _this = _possibleConstructorReturn(this, _AstParser.call(this));

          _this.templates = new ElasticSearchToDslTemplates();
          return _this;
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
      }(AstParser));

      _export('AstToElasticSearchQueryParser', AstToElasticSearchQueryParser);
    }
  };
});