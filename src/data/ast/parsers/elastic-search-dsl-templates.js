export class ElasticSearchToDslTemplates{

  range (field, operand, value) {
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
        [field]: value,
      }
    };
  }
  prefix(field, value){
    return {
      "prefix": {
        [field]: value,
      }
    };
  }

  terms(field, value){
    return {
      "terms": {
        [field]: value
      }
    }
  }


  term(field, value){
    return {
      "term": {
        [field]: value
      }
    }
  }

  match(field, value){
    return {
      "match": {
        [field]:{
          "query":value,
          "operator": "and"
        }
      }
    };
  }
}

