declare module 'periscope-elastic-search' {
  import * as _ from 'lodash';
  import {
    DataService,
    AstParser,
    SchemaProvider
  } from 'periscope-framework';
  import {
    inject,
    transient
  } from 'aurelia-framework';
  import {
    HttpClient,
    json
  } from 'aurelia-fetch-client';
  export * from 'periscope-elastic-search/data/ast/parsers/ast-to-elastic-search-query-parser';
  export * from 'periscope-elastic-search/data/schema/providers/elastic-search-schema-provider';
  export * from 'periscope-elastic-search/data/service/elasticsearch-data-service';
  export function configure(aurelia: any): any;
  export class ElasticSearchDataService extends DataService {
    constructor(http: any);
    read(options: any): any;
  }
  export class AstToElasticSearchQueryParser extends AstParser {
    constructor();
    type: any;
    getFilter(astTree: any): any;
  }
  export class ElasticSearchSchemaProvider extends SchemaProvider {
    constructor(http: any, host: any, index: any, type: any);
    getSchema(): any;
  }
}