define(["exports", "lodash"], function (exports, _lodash) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ElasticSearchToDslTemplates = undefined;

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
});