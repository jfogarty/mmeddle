/**
 * @fileOverview Lexer math text lexical analyser.
 * @module core/Lexer
 */ 
'use strict';
module.exports = function registerLexer(mm) {
  var _ = mm._;

  /**
   * @summary The worlds simplest lexical parser.
   * @constructor
   * @return {Lexer} a lexer to parse and manage a set of tokens.
   * @example
   *   // Tokens can contain one or more properties:
   *   {
   *      char: 'x',        // a symbol character
   *      id: 'id_12',      // an identifier
   *      lcid: 'name',     // the `id` in lower case
   *      number: '1.1e24', // a number string
   *      pos: 3241,        // character offset in input string.
   *   }
   */  
  var Lexer = (function lexerCtorCtor() {
    return function LexerCtor() {
      var self = this;
      self.tokens = [];
      self.inx = 0;
    }
  }());

  /**
   * @summary Determine if the token list is exhausted.
   * @return {bool} true if there are no more tokens.
   */  
  Lexer.prototype.done = function done() {
    var self = this;
    return (self.inx >= self.tokens.length);
  }

  /**
   * @summary Get the current token without advancing in the list.
   * @return {Token} the current token or an empty object.
   */  
  Lexer.prototype.token = function token() {
    var self = this;
    return (self.inx < self.tokens.length) ? self.tokens[self.inx] : {};
  }
  
  /**
   * @summary Get and remove the next token.
   * @return {Token} the next token from the list or an empty object.
   */  
  Lexer.prototype.next = function next(s) {
    var self = this;
    return (self.inx < self.tokens.length) ? self.tokens[self.inx++] : {};
  }

 /**
  * @summary Expand all arguments containing | into array.
  * @static
  * @param {Array} array an array of strings, some containing |
  * @return {Array} a bigger array with all | split out.
  */  
  Lexer.expandBar = function expandBar(array) {
    var r = [];
    array.forEach(function(a) {
      var s = a.split('|');
      s.forEach(function(v) { r.push(v) });
    });
    return r;
  }

  /**
   * @summary Determine if current token is a command token.
   * @description
   * The input is a list of lower case words which are matched in a case
   * insensitive way against an id token.
   * @param {...*} command words to match 
   * @return {bool} true if one of the inputs matches.
   */  
  Lexer.prototype.isCmd = function isCmd() {
    var self = this;
    var token = self.token();
    var args = Lexer.expandBar(Array.prototype.slice.call(arguments));
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (token.lcid === arg) return true;
      // Allow single character symbols to be used as commands.
      if (arg.length === 1 && token.char === arg) return true;
    }
    return false;
  }

  /**
   * @suummary Parse a string into a set of tokens.
   * @description
   * The input string (or array of strings) is parsed into an
   * array of token objects.
   * @param {String|Array} text 
   * @return {Array} an array of lex tokens.
   */
  Lexer.prototype.parse = function parse(s) {
    var self = this;
    self.tokens = [];
    self.inx = 0;
    if (_.isArray(s)) s = s.join(' ');
    self.text = s;
    var token; 
    //var reWhitespace = /^\s/;
    var reIdentifier = /^[A-Za-z_]+[0-9A-Za-z_$]*/;
    var reNumber = /^(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/
    var charPos = 0;

    function prune(sym) {
      var n = sym.length;
      s = s.substring(n);
      charPos += n;
    }

    function tryMatch(prop, re) {
      var v = s.match(re);
      if (!v) return false;
      token.pos = charPos;
      var sym = v[0];
      prune(sym);
      token[prop] = v[0];
      return true;
    }

    function whitespace(s) {
      var spaces = '';
      var v;
      do {
        v = s.match(/^\s/);
        if (v) {
          spaces += v[0];
          s = s.substring(1);
        }
      } while (v);
      return spaces;
    }

    function nextToken() {
      token = {};
      var ws = whitespace(s);
      if (ws) {
        prune(ws);
        token.whitespace = ws;
      }
      if (tryMatch('id', reIdentifier)) {
        token.lcid = token.id.toLowerCase();
        return;
      }
      if (tryMatch('number', reNumber)) return;
      if (s.length > 0) {
        token.char = s[0];
        token.pos = charPos++;
        s = s.substring(1);
      }
    }

    while(s) {
      nextToken();
      self.tokens.push(token);
    }

    return self.tokens;
  }

  return Lexer;
}
