"use strict";

System.register(["periscope-framework"], function (_export, _context) {
  "use strict";

  var AstParser, _createClass, AstToElasticSearchQueryParser;

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
    setters: [function (_periscopeFramework) {
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

      _export("AstToElasticSearchQueryParser", AstToElasticSearchQueryParser = function (_AstParser) {
        _inherits(AstToElasticSearchQueryParser, _AstParser);

        function AstToElasticSearchQueryParser() {
          _classCallCheck(this, AstToElasticSearchQueryParser);

          return _possibleConstructorReturn(this, _AstParser.call(this));
        }

        AstToElasticSearchQueryParser.prototype.getFilter = function getFilter(astTree) {
          if (astTree[0]) {
            var result = {
              "query_string": {
                "query": this._parseTree(astTree[0], [])
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
          return result.join(" ").trim();
        };

        AstToElasticSearchQueryParser.prototype._createExpression = function _createExpression(connector, node) {
          var result = "";
          var fieldname = node.field;
          var operand = this._createEsStyleOperand(node.operand);
          var v = node.value.trim();
          var c = this._createEsStyleConnector(connector);
          if (v.split(' ').length > 1) v = "\"" + v + "\"";else v = v.toLowerCase();

          result = c + " " + fieldname + operand + v;
          return result.trim();
        };

        AstToElasticSearchQueryParser.prototype._createEsStyleConnector = function _createEsStyleConnector(connector) {
          if (!connector) return "";
          switch (connector.trim()) {
            case "||":
              return "OR";
            case "&&":
              return "AND";
            default:
              return "";
          }
        };

        AstToElasticSearchQueryParser.prototype._createEsStyleOperand = function _createEsStyleOperand(operand) {
          var res = "";
          switch (operand) {
            case "==":
              res = ":";
              break;
            case "!=":
              res = res = ":!";
              break;
            case ">":
              res = ":>";
              break;
            case "<":
              res = ":<";
              break;
            case ">=":
              res = ":>=";
              break;
            case "<=":
              res = ":<=";
              break;
          }
          return res;
        };

        _createClass(AstToElasticSearchQueryParser, [{
          key: "type",
          get: function get() {
            return this._serverSide;
          }
        }]);

        return AstToElasticSearchQueryParser;
      }(AstParser));

      _export("AstToElasticSearchQueryParser", AstToElasticSearchQueryParser);
    }
  };
});