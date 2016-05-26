import * as _ from 'lodash';
import {DataService,AstParser,SchemaProvider} from 'periscope-framework';
import {inject,transient} from 'aurelia-framework';
import {HttpClient,json} from 'aurelia-fetch-client';

export * from './data/ast/parsers/ast-to-elastic-search-query-parser';
export * from './data/schema/providers/elastic-search-schema-provider';
export * from './data/service/elasticsearch-data-service';

export function configure(aurelia) {

}

@transient()
@inject(HttpClient)
export class ElasticSearchDataService extends DataService {
  constructor(http) {
    super();
    http.configure(config => {
      config.useStandardConfiguration();
    });
    this._http = http;
  }

  read(options) { //options: fields,filter, take, skip, sort
    let url = this.url + "_search"
    let request = {};
    if (options.fields)
      request._source = {include: options.fields};
    if (options.filter && options.filter.length>0)
      request.query = JSON.parse(this.filterParser.getFilter(options.filter));
    if (options.take)
      request.size = options.take;
    if (options.skip)
      request.from = options.skip;
    if (options.sort) {
      let s = options.sort;
      if (!options.sortDir)
        request.sort = [s];
      else{
        request.sort = [{}];
        request.sort[0][s] = options.sortDir;
      }
    }

    //request.query = {"prefix": {"ProductName" : "contoso"}};

    return this._http
      .fetch(url,{
        method: 'post',
        body: json(request)
      })
      .then(response => {return response.json(); })
      .then(jsonData => {
        //let d = (this.dataMapper? this.dataMapper(jsonData) : _.map(jsonData.hits.hits,"_source"));
        let d = _.map(jsonData.hits.hits,"_source");
        return {
          data: d,
          total: (this.totalMapper? this.totalMapper(jsonData) : jsonData.hits.total)
        }
      });
  }
}

export class AstToElasticSearchQueryParser extends AstParser{
  constructor(){
    super();
  }

  get type(){
    return this._serverSide;
  }

  getFilter(astTree) {
    if (astTree[0]) {
      let result = {
        "constant_score": {
          "filter": {
            "bool": {
              "must": this._parseTree(astTree[0], [])
            }
          }
        }
      }
      return JSON.stringify(result);
    }
    return "";
  }

  _parseTree(treeNode, result){

    if (treeNode.left) {
      result.push(this._createExpression(treeNode.connector, treeNode.left));
      if (treeNode.right)
        this._parseTree(treeNode.right, result);
    }
    else
      result.push(this._createExpression(treeNode.connector, treeNode));
    return result;
  }

  _createExpression(connector, node){
    let fieldname = node.field;
    let operand = node.operand;
    let value = node.value;
    let res;
    switch (operand){
      case "==":
        res = this._createEqualExpression(node);
        break;
      case "!=":
        res = '{"term" : {"' + node.field + '":"' + node.value + '"}}'; //??????????????
        break;
      case ">":
        res =  '{"range" : {"' + node.field + '":{"gt":' + node.value + '}}}'
        break;
      case "<":
        res =  '{"range" : {"' + node.field + '":{"lt":' + node.value + '}}}'
        break;
      case ">=":
        res =  '{"range" : {"' + node.field + '":{"gte":' + node.value + '}}}'
        break;
      case "<=":
        res =  '{"range" : {"' + node.field + '":{"lte":' + node.value + '}}}'
        break;
    }
    return JSON.parse(res);
  }

  _createEqualExpression(node){
    let v = node.value.trim().toLowerCase();
    let result = '';
    if (v.length>=2){
      if (v.lastIndexOf("%")===(v.length-1))
        result = '{"prefix" : {"' + node.field + '":"' + v.substring(0,v.length-1) +'"}}';
      else if (v.indexOf("%")===0)
        result = '{"wildcard" : {"' + node.field + '":"*' + v.substring(1,v.length) +'"}}';
    }
    if (!result)
      result = '{"term" : {"' + node.field + '":"' + v + '"}}';
    return result;
  }

}


@inject(HttpClient)
export class ElasticSearchSchemaProvider extends SchemaProvider{
  constructor(http, host, index, type){
    super();
    this.host = host;
    this.index = index;
    this.type = type;
    http.configure(config => {
      config.useStandardConfiguration();
    });
    this._http = http;
  }
  getSchema(){
    return this._http
      .fetch(this.host + "_mappings/" + this.type)
      .then(response => {return response.json(); })
      .then(jsonData => {
        let flds = jsonData[this.index].mappings[this.type].properties;
        let result = [];
        _.forOwn(flds,(value, key)=>{
          let t = value.type;
          if (t==='float')
            t="number";
          result.push({field:key, type:t});
        })
        return {
          fields:result
        }
      });
  }
}

