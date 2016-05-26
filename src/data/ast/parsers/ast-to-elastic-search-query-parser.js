import {AstParser} from 'periscope-framework';


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
          "query": {
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
        res = this._createRangeExpression(node,"gt");
        break;
      case "<":
        res = this._createRangeExpression(node,"lt");
        break;
      case ">=":
        res = this._createRangeExpression(node,"gte");
        break;
      case "<=":
        res = this._createRangeExpression(node,"lte");
        break;
    }
    return res;
  }

  _createRangeExpression(node, operand){
    return {
      "range": {
        [node.field]: {
          [operand]: node.value
        },
      }
    };
  }

  _createEqualExpression(node){
    let v = node.value.trim().toLowerCase();
    let result = '';
    if (v.length>=2){
      if (v.lastIndexOf("%")===(v.length-1)) {
        result = {
          "prefix": {
            [node.field]: v.substring(0, v.length - 1),
          }
        };
      }
      else if (v.indexOf("%")===0) {
        result = {
          "wildcard": {
            [node.field]: "*" + v.substring(1, v.length),
          }
        };
      }
    }

    if (!result){
      if (v.split(' ').length>1) { //multi word search!
        result = {
          "match": {
            [node.field]:{
              "query":v,
              "operator": "and"
            }
          }
        };
      }
      else { // single word search
        result = {
          "term": {
            [node.field]: v
          }
        };
      }
    }
    return result;
  }

}
