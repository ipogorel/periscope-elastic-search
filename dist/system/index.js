'use strict';

System.register(['./data/ast/parsers/elastic-search-dsl-templates', './data/ast/parsers/ast-to-elastic-search-query-parser', './data/schema/providers/elastic-search-schema-provider', './data/service/elasticsearch-data-service'], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_dataAstParsersElasticSearchDslTemplates) {
      var _exportObj = {};

      for (var _key in _dataAstParsersElasticSearchDslTemplates) {
        if (_key !== "default") _exportObj[_key] = _dataAstParsersElasticSearchDslTemplates[_key];
      }

      _export(_exportObj);
    }, function (_dataAstParsersAstToElasticSearchQueryParser) {
      var _exportObj2 = {};

      for (var _key2 in _dataAstParsersAstToElasticSearchQueryParser) {
        if (_key2 !== "default") _exportObj2[_key2] = _dataAstParsersAstToElasticSearchQueryParser[_key2];
      }

      _export(_exportObj2);
    }, function (_dataSchemaProvidersElasticSearchSchemaProvider) {
      var _exportObj3 = {};

      for (var _key3 in _dataSchemaProvidersElasticSearchSchemaProvider) {
        if (_key3 !== "default") _exportObj3[_key3] = _dataSchemaProvidersElasticSearchSchemaProvider[_key3];
      }

      _export(_exportObj3);
    }, function (_dataServiceElasticsearchDataService) {
      var _exportObj4 = {};

      for (var _key4 in _dataServiceElasticsearchDataService) {
        if (_key4 !== "default") _exportObj4[_key4] = _dataServiceElasticsearchDataService[_key4];
      }

      _export(_exportObj4);
    }],
    execute: function () {
      function configure(aurelia) {}

      _export('configure', configure);
    }
  };
});