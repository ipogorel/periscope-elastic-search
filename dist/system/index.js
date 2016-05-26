'use strict';

System.register(['./data/ast/parsers/ast-to-elastic-search-query-parser', './data/schema/providers/elastic-search-schema-provider', './data/service/elasticsearch-data-service'], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_dataAstParsersAstToElasticSearchQueryParser) {
      var _exportObj = {};

      for (var _key in _dataAstParsersAstToElasticSearchQueryParser) {
        if (_key !== "default") _exportObj[_key] = _dataAstParsersAstToElasticSearchQueryParser[_key];
      }

      _export(_exportObj);
    }, function (_dataSchemaProvidersElasticSearchSchemaProvider) {
      var _exportObj2 = {};

      for (var _key2 in _dataSchemaProvidersElasticSearchSchemaProvider) {
        if (_key2 !== "default") _exportObj2[_key2] = _dataSchemaProvidersElasticSearchSchemaProvider[_key2];
      }

      _export(_exportObj2);
    }, function (_dataServiceElasticsearchDataService) {
      var _exportObj3 = {};

      for (var _key3 in _dataServiceElasticsearchDataService) {
        if (_key3 !== "default") _exportObj3[_key3] = _dataServiceElasticsearchDataService[_key3];
      }

      _export(_exportObj3);
    }],
    execute: function () {
      function configure(aurelia) {}

      _export('configure', configure);
    }
  };
});