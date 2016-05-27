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
        "query_string": {
          "query": this._parseTree(astTree[0], [])
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
    return result.join(" ").trim();
  }

  _createExpression(connector, node){
    let result = "";
    let fieldname = node.field;
    let operand = this._createEsStyleOperand(node.operand);
    let v = node.value.trim();
    let c = this._createEsStyleConnector(connector)
    if (v.split(' ').length>1) // multiple words
      v = "\"" + v + "\""
    else
      v = v.toLowerCase();

    result= c + " " + fieldname + operand + v;
    return result.trim();
  }

  _createEsStyleConnector(connector){
    if (!connector)
      return "";
    switch (connector.trim()){
      case "||":
        return "OR"
      case "&&":
        return "AND"
      default:
        return "";
    }
  }

  _createEsStyleOperand(operand){
    let res = "";
    switch (operand){
      case "==":
        res = ":";
        break;
      case "!=":
        res = res = ":!";
        break;
      case ">":
        res = ":>";
        break;
      case "<":
        res = ":<";
        break;
      case ">=":
        res = ":>=";
        break;
      case "<=":
        res = ":<=";
        break;
    }
    return res;
  }
}
