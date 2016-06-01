import { ElasticSearchToDslTemplates } from './elastic-search-dsl-templates';
import { AstParser } from 'periscope-framework';

export let AstToElasticSearchQueryParser = class AstToElasticSearchQueryParser extends AstParser {
  constructor() {
    super();
    this.templates = new ElasticSearchToDslTemplates();
  }

  get type() {
    return this._serverSide;
  }

  getFilter(astTree) {
    if (astTree) {
      let result = {
        bool: {}
      };
      this._parseTree(astTree, result.bool);
      return JSON.stringify(result);
    }
    return "";
  }

  _parseTree(treeNode, boolNode) {
    if (!treeNode.right) {
      let nLeft = treeNode.left ? treeNode.left : treeNode;
      boolNode[this._detectMustNot(nLeft) ? "must_not" : "must"] = [this._createExpression(nLeft)];
      return;
    }

    let leftOp;
    if (this._detectMustNot(treeNode.left)) leftOp = "must_not";else if (treeNode.right.connector.trim() === "||") leftOp = "should";else leftOp = "must";

    boolNode[leftOp] = [this._createExpression(treeNode.left)];
    if (treeNode.right.left) {
      boolNode[leftOp].push({ bool: {} });
      this._parseTree(treeNode.right, boolNode[leftOp][1].bool);
    } else {
      let rightOp;

      if (this._detectMustNot(treeNode.right)) rightOp = "must_not";else if (treeNode.right.connector.trim() === "||") rightOp = "should";else rightOp = "must";

      if (rightOp === leftOp) boolNode[rightOp].push(this._createExpression(treeNode.right));else boolNode[rightOp] = [this._createExpression(treeNode.right)];
      return;
    }
  }

  _detectMustNot(node) {
    if (node.operand.trim() === "!=") return true;
    return false;
  }

  _createExpression(node) {
    let fieldname = node.field;
    let operand = node.operand;
    let value = node.value;
    let res;
    switch (operand) {
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

  _createEqualExpression(node) {
    let v = node.value.trim().toLowerCase();
    let result = '';
    if (v.length >= 2) {
      if (v.lastIndexOf("%") === v.length - 1) result = this.templates.prefix(node.field, v.substring(0, v.length - 1));else if (v.indexOf("%") === 0) result = this.templates.wildcard(node.field, "*" + v.substring(1, v.length));
    }
    if (!result) {
      if (v.split(' ').length > 1) {
        result = this.templates.match(node.field, v);
      } else result = this.templates.term(node.field, v);
    }
    return result;
  }
};