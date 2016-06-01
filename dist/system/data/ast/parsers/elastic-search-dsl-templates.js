"use strict";

System.register(["lodash"], function (_export, _context) {
  "use strict";

  var _, ElasticSearchToDslTemplates;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash;
    }],
    execute: function () {
      _export("ElasticSearchToDslTemplates", ElasticSearchToDslTemplates = function () {
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
      }());

      _export("ElasticSearchToDslTemplates", ElasticSearchToDslTemplates);
    }
  };
});