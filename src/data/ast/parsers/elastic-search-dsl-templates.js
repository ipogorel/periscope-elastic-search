import * as _ from 'lodash';

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

