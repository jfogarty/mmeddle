/**
 * @fileOverview mMath node foundation.
 * @module mMath/MNode
 * @description
 * mMath ndes (I use this instead of the 4 letter name to make searches
 * work better) are the foundation for its various expression structures.
 * The two most important major types are 'val' and 'op' nodes.  Val nodes
 * can be used as arguments to operators and functions.  'op' nodes represent
 * the potential invocation of an operator. 'def' nodes define invariant
 * math elements such as function definitions, operators, constants, value
 * types and units.
 */ 
'use strict';
module.exports = function registerNdes(mm) {
  var _ =   mm.check(mm._);

  function max(a, b) { return a > b ? a : b; }
  function min(a, b) { return a < b ? a : b; }

  /**
   * @summary **Base mMath MNode constructor**
   * @description
   * Edit ndes are individual items which can be selected or added to an
   * expression. Every node participates in multiple graphs. The links
   * of the graph are in the `lnks` and `rlnks` of the node, where lnks
   * are forward (as detailed by the lnk type) and rlnks are the opposite.
   * @constructor
   * @param {string} type the type name of the MNode
   * @param {object} context the mode context (usually an Expression) 
   * @param {number} parentNid the node id of the parent container
   * @returns {MNode} a mmath MNode.
   */
  function MNode(type, context, parentNid) {
    var  self = this;
    context.initNode(self);
    self.type      = type;
    self.context   = context;
    self.parentNid = parentNid;
  }

  /**
   * @summary **Commutative cmm list**
   * @description
   * The list of ndes joined by the same operation for which commutative
   * algebraic editing is allowed. The result of the expression is the
   * same regardless of the order in which the base operator is appied
   * to any of the values.
   * @param {array} list the commutative values ndes
   * @returns {mExp} a mmath expression.
   */
  MNode.prototype.cm = function cm(list) {
    var self = this;
    self.m_list = list;
    return self;
  }

  /**
   * @summary **Function join**
   * @description
   * Builds the hierarchy of a functional expression.
   * @param {MNode} left (or first) value.
   * @param {MNode} right (or second) value.     
   * @returns {fExp} a functional expression value node.
   */
  MNode.prototype.func = function func(left, right) {
    var self = this;
    self.f_left = left;
    self.f_right = right;
    return self;
  }
  
  /**
   * @summary **size of the rendered mnode**
   * @description
   * When this node is rendered to the specified display context, it will
   * required a bounding box of [w, y+, y-] where w is the horizontal width,
   * y+ is the vertical height above the lower left corner, and y- (is present
   * is the number of units of descent. Note y- is a positive value, so the
   * full y range is (y+)+(y-).
   * @param {DisplayContext} dc the display context.     
   * @returns {array} [w, y+, y-]
   */
  MNode.prototype.size = function size(dc) {
    var self = this;
    return [1, 1, 0];
  }

  /**
   * @summary **Move selection/caret within the container node**
   * @description
   * Directions are selected from the following:
   *   'out' : select the container this node is in
   *   'in'  : move into the current selection
   *   'nxt' : move to the right
   *   'prv' : move to the left
   *   'up'  : move up (or up and right)
   *   'dwn' : move down (or down and right)
   *   'sup' : move up and right
   *   'sub' : move down and right
   *
   * @param {string} dir a direction
   * @returns {bool} true when the position was moved.
   */
  MNode.prototype.move = function move(dir) {
    return false;
  }

  //--------------------------------------------------------------------------
  /**
   * @summary **Empty node constructor**
   * @description
   * An empty node is a placeholder for any other node at some location in
   * a container. 
   * @param {object} context the mode context (usually an Expression) 
   * @param {number} parentNid the node id of the parent container   
   * @returns {MNode} a mmath MNode.
   */
  function MEmpty(context, parentNid) {
    var self = this;
    MNode.call(this, 'mempty', context, parentNid);
  }

  MEmpty.prototype = _.create(MNode.prototype, { 
    'constructor': MEmpty 
  });

  MEmpty.prototype.size = function size(dc) {
    return [1.2, 1.1, 0];
  }
  
  //--------------------------------------------------------------------------
  /**
   * @summary **The base container for a row of nodes**
   * @description
   * Every expression starts out as an MRow of nodes. MRows have at most
   * one vacant placeholder that can contain any other node. The insertion
   * cursor can be between any two nodes. 
   * @param {object} context the mode context (usually an Expression) 
   * @param {number} parentNid the node id of the parent container
   * @returns {MRow} a mmath MRow MNode.
   
   */
  function MRow(context, parentNid) {
    var self = this;
    MNode.call(this, 'mrow', context, nid);
    self.row = [ new MEmpty(context, self.nid) ];
    self.caret = 1;
    
  }

  MRow.prototype = _.create(MNode.prototype, { 
    'constructor': MRow 
  });
  
  MRow.prototype.size = function size(dc) {
    var self = this;
    if (! 'chromeH' in self) {
      // TODO: Use dc to set chromeH and chromeY
      // Horizontal and vertical chrome as computed from the dc.
      //  [Left, between entries, Right]
      self.chromeH = [ 1.01, 1, 1.02 ];
      //  [Above, between entries, Below] 
      self.chromeV = [ 0, 0, 0 ];
    }
    var hsep = 0;

    var sz = self.row.reduce( function(previousSize, mnode) {
      var nsize = mnode.size(dc);
      totX  = previousSize[0] + hsep;
      maxYu = max(previousSize[1], nize[1]);
      maxYd = max(previousSize[2], nize[2]);
      hsep = self.chromeH[1];
      return [totX, maxYu, maxYd];
    }, [0, 0, 0]);

    return [ self.chromeH[0] + sz[0] + self.chromeH[2],
             sz[1] + self.chromeV[0],
             sz[2] + self.chromeV[2] ];
  }

  //--------------------------------------------------------------------------
  function eExp(obj) {
    return new MNode({ list: obj });
  }

  //--------------------------------------------------------------------------  
  function fExp(obj) {
    return new MNode(obj);
  }

  //--------------------------------------------------------------------------  
  function mExp(obj) {
    return new MNode(obj);
  }
  
  //--------------------------------------------------------------------------  
  /**
   * @summary **Expression constructor**
   * @description
   * Expressions are an isolated `MNode` DAG along with an editing cursor
   * and selection(s). The undo/redo list is also part of the expression.
   * All of the Ndes within the expression are assigned Nids (node ids) in
   * a closed space local to the expression. An external expression can be
   * referenced from the expression but is not itself part of the expression
   * unless copies of its nodes are inserted.
   *
   * The entire expression including its history and change list are self
   * contained so its easy to serialize the contents (as long as all 
   * external references are suitably truncated).
   *
   * Ndes contain various forward pointing nids that describe the graph.
   * Going backwards in the graph requireds computing the previous nid,
   * by traversing the entire graph from the front.
   * @constructor
   * @param {object} obj any initialization for the Exp.
   * @returns {Exp} a mmath Expression.
   */
  function Exp(obj) {
    var self = this;
    //self.root = new MNode();

    self.type      = 'exp';
    self.context   = self;
    self.parentNid = -1;

    var nodes = [];

    // Add the node to the local list and assign a unique nid.
    self.initNode = function initNode(self) {
      var nid = nodes.length;
      nodes.push(self);
      self.nid = nid;
    }

    self.initNode(self);
    self.nodes = nodes;

    self.changes = [];
    self.changeIndex = 0;


    MNode.call(this, 'exp', self, 0);
  }
  
  Exp.prototype = _.create(MRow.prototype, {
    'constructor': Exp
  });
  
  /**
   * @summary **Insert into the expression**
   * @description
   * The object is inserted into the expression at the current cursor
   * or insertion point.
   * @param {object} obj any MNode or valid MNode initializer
   * @param {bool} overwrite instead of insert   
   * @returns {Exp} the mmath Expression for chaining.
   */
  Exp.prototype.ins = function ins(obj, overwrite) {
    var self = this; 
    var chg = {};
    if (_.isString(obj)) {
      chg = { text: obj }
    }
    else if (_.isNumber(obj)) {
      chg = { text: obj.toString() }
    }
    else {
      _.assign(chg, obj);
    }
    if (overwrite) chg.overwrite = overwrite;

    // Convert the obj into a change.
    self.changes.push(chg);
    self.redo();
    return self;
  }
  
  /**
   * @summary **Undo the last change operation**
   * @description
   * The last operation in the change list is undone.
   * @returns true if there was something undone.
   */
  Exp.prototype.undo = function undo() {
    var self = this;
    if (self.changeIndex === 0) {
      return false;
    }
    self.changeIndex--;
    var chg = self.changes[self.changeIndex];
    self._change(chg, true);
    return true;
  }

  /**
   * @summary **Redo the last undone change operation**
   * @description
   * The last undo is redone. This is also the way that initial changes
   * are applied.
   * @returns true if there was something redone.
   */
  Exp.prototype.redo = function redo() {
    var self = this;
    if (self.changes.length < self.changeIndex) {
      return false;
    }
    var chg = self.changes[self.changeIndex];
    self._change(chg);
    self.changeIndex++;
    return true;
  }

  /**
   * @summary **Create a new node in the expression**
   * @param {object} chg a change object used as the source of the node.
   */
  Exp.prototype._addNde = function _addNde(chg) {
    var self = this;
    var node = new MNode(chg.text);
    node.nid = self.ndes.length;
    self.ndes.push(node);
    return node;
  }
  
  /**
   * @summary **Create a new node in the expression**
   * @param {object} chg a change object used as the source of the node.
   */
  Exp.prototype._addNde = function _addNde(chg) {
    var self = this;
    var node = new MNode(chg.text);
    node.nid = self.ndes.length;
    self.ndes.push(node);
    return node;
  }

  /**
   * @summary **Applies or undoes a change**
   * @description
   * The last undo is redone. This is also the way that initial changes
   * are applied.
   * @param {object} chg a change object to apply to the expression
   * @param {bool} undo true to undo a change
   */
  Exp.prototype._change = function _change(chg, undo) {
    var self = this;
    if (self.changes.length < self.changeIndex) {
      return false;
    }
    
    // There is always a current MNode since even empty expressions
    // have the expression def node.
    var currNid = self.nid;
    var currNde = self.ndes[currNid];
    var nextNid = currNde.nextNid;
    
    var chg = self.changes[self.changeIndex];
    if (undo) {
      throw new Error('in your dreams');
    }
    else {
      var node = self._addNde(chg);
      var newNid = node.nid;
      if (chg.overwrite && nid > 0) {
        chg.undo = {}
        chg.undo.nid = self.nid;
        chg.undo.prevNid = self.prevNid;
        chg.undo.nextNid = nextNid;
        // Replace the current nid with the new one.
        self.ndes[self.prevNid].nextNid = nid;
        node.nextNid = nextNid;
      }
      else {
        chg.undo = {}
        chg.undo.nid = self.nid;
        chg.undo.prevNid = self.prevNid;
        chg.undo.nextNid = nextNid;
        chg.undo.newNid = newNid;
        chg.undo.remove = true;
        // Insert the node in the list.
        currNde.nextNid = newNid;
        node.nextNid = nextNid;
        self.prevNid = self.nid; // Support overwrite.
        self.nid = newNid; // Advance to the next nid.
      }
    }
    return true;
  }

  /**
   * @summary **Insert the elements of a string**
   * @description
   * This is a shorthand for individual insertions of the components
   * parsed from the string.
   * @param {string} txt the text to be inserted as parts
   * @returns Exp
   */
  Exp.prototype.insParsed = function insParsed(txt) {
    var self = this;
    txt.split(' ').forEach(function (x) { self.ins(x); });
    return self;
  }
  
  /**
   * @summary **A string representation of the expression**
   * @description
   * Provides a representation of an expression as a pure string.
   * @param {object} options optional options to control the format
   * @returns string
   */
  Exp.prototype.toString = function toString(options) {
    var self = this;
    var s = '';
    var node = self.ndes[0];
    while (node) {
      s += '(' + node.nid + ')';
      if (node.txt) s += node.txt + ' ';
      if (node.ref) s += '[' + node.ref + '] ';
      var nid = node.nextNid;
      node = self.ndes[nid];
    }
    return s;
  }  

  //--------------------------------------------------------------------------  
  mm.mMath.eExp = eExp;
  mm.mMath.fExp = fExp;
  mm.mMath.mExp = mExp;
  
  mm.mMath.Exp  = Exp;
  mm.mMath.MNode  = MNode;
}  
