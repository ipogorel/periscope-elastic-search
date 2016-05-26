define(['exports', './data/ast/parsers/ast-to-elastic-search-query-parser', './data/schema/providers/elastic-search-schema-provider', './data/service/elasticsearch-data-service'], function (exports, _astToElasticSearchQueryParser, _elasticSearchSchemaProvider, _elasticsearchDataService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_astToElasticSearchQueryParser).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _astToElasticSearchQueryParser[key];
      }
    });
  });
  Object.keys(_elasticSearchSchemaProvider).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _elasticSearchSchemaProvider[key];
      }
    });
  });
  Object.keys(_elasticsearchDataService).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _elasticsearchDataService[key];
      }
    });
  });
  exports.configure = configure;
  function configure(aurelia) {}
});