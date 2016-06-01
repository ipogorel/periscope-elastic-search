"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      "wildcard": (_wildcard = {}, _wildcard[field] = value, _wildcard)
    };
  };

  ElasticSearchToDslTemplates.prototype.prefix = function prefix(field, value) {
    var _prefix;

    return {
      "prefix": (_prefix = {}, _prefix[field] = value, _prefix)
    };
  };

  ElasticSearchToDslTemplates.prototype.terms = function terms(field, value) {
    var _terms;

    return {
      "terms": (_terms = {}, _terms[field] = value, _terms)
    };
  };

  ElasticSearchToDslTemplates.prototype.term = function term(field, value) {
    var _term;

    return {
      "term": (_term = {}, _term[field] = value, _term)
    };
  };

  ElasticSearchToDslTemplates.prototype.match = function match(field, value) {
    var _match;

    return {
      "match": (_match = {}, _match[field] = {
        "query": value,
        "operator": "and"
      }, _match)
    };
  };

  return ElasticSearchToDslTemplates;
}();