import * as _ from 'lodash';
import {DataService,AstParser,SchemaProvider} from 'periscope-framework';
import {transient,inject} from 'aurelia-framework';
import {json} from 'aurelia-fetch-client';

export * from './data/ast/parsers/elastic-search-dsl-templates';
export * from './data/ast/parsers/ast-to-elastic-search-query-parser';
export * from './data/schema/providers/elastic-search-schema-provider';
export * from './data/service/elasticsearch-data-service';

export function configure(aurelia) {

}

@transient()
export class ElasticSearchDataService extends DataService {
  constructor() {
    super();
  }

  read(options) { //options: fields,filter, take, skip, sort
    let url = this.url + "_search"
    let request = {};
    if (options.fields)
      request._source = {include: options.fields};
    if (options.filter)
      request.query = JSON.parse(this.filterParser? this.filterParser.getFilter(options.filter):options.filter);
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


    return this.httpClient
      .fetch(url,{
        method: 'post',
        body: json(request)
      })
      .then(response => {
        var a = 2;
        return response.json();
      })
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
    this.templates = new ElasticSearchToDslTemplates();
  }

  get type(){
    return this._serverSide;
  }

  getFilter(astTree) {
    if (astTree) {
      let result = {
        bool:{}
      }
      this._parseTree(astTree, result.bool)
      return JSON.stringify(result);
    }
    return "";
  }


  _parseTree(treeNode, boolNode){
    if (!treeNode.right){
      let nLeft = treeNode.left?treeNode.left:treeNode;
      boolNode["must"] = [this._createExpression(nLeft)];
      return;
    }

    let lop = this._getOccurrenceType(treeNode,"left");
    let rop = this._getOccurrenceType(treeNode,"right");

    if (treeNode.left.right) { // left node contain subbranches
      boolNode[lop] =[{bool: {}}];
      this._parseTree(treeNode.left, boolNode[lop][0].bool);
    }
    else // left node contain expression
      boolNode[lop] = [this._createExpression(treeNode.left)];

    if (treeNode.right.left){ // right node contain subbranches
      boolNode[lop].push({bool:{}});
      this._parseTree(treeNode.right, boolNode[lop][1].bool);
    }
    else {// right node contain expression
      if (lop===rop)
        boolNode[rop].push(this._createExpression(treeNode.right));
      else
        boolNode[rop] = [this._createExpression(treeNode.right)];
    }
    return;
  }

  _getOccurrenceType(treeNode, side){
    switch(side){
      case "left":
        if (treeNode.left) {
          if (treeNode.left.operand && treeNode.left.operand.trim() === "!=")
            return "must_not";
          else if (treeNode.right.connector.trim() === "||")
            return "should";
        }
        return "must";
      case "right":
        if (treeNode.right) {
          if (treeNode.right.operand && treeNode.right.operand.trim() === "!=")
            return "must_not";
          else if (treeNode.right.connector.trim() === "||")
            return "should";
        }
        return "must";
      default:
        return "";
    }
  }

  _createExpression(node){
    let fieldname = node.field;
    let operand = node.operand;
    let value = node.value;
    let res;
    switch (operand){
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
  }


  _createEqualExpression(node){
    let v = node.value.trim();
    let result = '';
    if (v.length>=2){
      if (v.lastIndexOf("%")===(v.length-1))
        result = this.templates.prefix(node.field, v.substring(0, v.length - 1));
      else if (v.indexOf("%")===0)
        result = this.templates.wildcard(node.field, "*" + v.substring(1, v.length));
    }
    if (!result){
      if (v.split(' ').length>1) {  //multi word search!
        result = this.templates.match(node.field, v);
      }
      else  // single word search
        result = this.templates.term(node.field, v)
    }
    return result;
  }
}

export class ElasticSearchToDslTemplates{

  range(field, operand, value){
    let o = "";
    switch (operand){
      case ">":
        o ="gt";
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
      "range": {
        [field]: {
          [o]: value
        },
      }
    };
  }

  wildcard(field, value){
    return {
      "wildcard": {
        [field]: value.toLowerCase(),
      }
    };
  }
  prefix(field, value){
    return {
      "prefix": {
        [field]: value.toLowerCase(),
      }
    };
  }

  terms(field, valuesArray){
    return {
      "terms": {
        [field]: _.map(valuesArray,v=>{
          return v.toLowerCase();
        })
      }
    }
  }


  term(field, value){
    return {
      "term": {
        [field]: value.toLowerCase()
      }
    }
  }

  match(field, value){
    return {
      "match": {
        [field]:{
          "query":value.toLowerCase(),
          "operator": "and"
        }
      }
    };
  }
}


export class ElasticSearchSchemaProvider extends SchemaProvider{
  constructor(http, host, index, type){
    super();
    this.host = host;
    this.index = index;
    this.type = type;
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

