import {ElasticSearchToDslTemplates} from './elastic-search-dsl-templates';
import {AstParser} from 'periscope-framework';

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
