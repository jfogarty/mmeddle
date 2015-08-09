/*  mm.js:  mMeddle is a symbol math workspace. */

"use strict";

// KeyCodes for KeyDown and KeyUp events ONLY.
var KeyCodes = {
  'bs'            : '8',
  'tab'           : '9',
  'enter'         : '13',
//'shift'         : '16', // We don't want to treat these
//'ctrl'          : '17', // as actual keys.
//'alt'           : '18',
  'pause_break'   : '19',
  'caps_lock'     : '20',
  'escape'        : '27',
  'pgup'          : '33',
  'pgdn'          : '34',
  'end'           : '35',
  'home'          : '36',
  'left'          : '37',
  'up'            : '38',
  'right'         : '39',
  'down'          : '40',
  'insert'        : '45',
  'delete'        : '46',
  'left_window'   : '91',
  'right_window'  : '92',
  'select_key'    : '93',
  'numpad_0'      : '96',
  'numpad_1'      : '97',
  'numpad_2'      : '98',
  'numpad_3'      : '99',
  'numpad_4'      : '100',
  'numpad_5'      : '101',
  'numpad_6'      : '102',
  'numpad_7'      : '103',
  'numpad_8'      : '104',
  'numpad_9'      : '105',
  'multiply'      : '106',
  'add'           : '107',
  'subtract'      : '109',
  'decimal_point' : '110',
  'divide'        : '111',
  'f1'            : '112',
  'f2'            : '113',
  'f3'            : '114',
  'f4'            : '115',
  'f5'            : '116',
  'f6'            : '117',
  'f7'            : '118',
  'f8'            : '119',
  'f9'            : '120',
  'f10'           : '121',
  'f11'           : '122',
  'f12'           : '123',
  'num_lock'      : '144',
  'scroll_lock'   : '145',
  'semi_colon'    : '186',
  'equal_sign'    : '187',
  'comma'         : '188',
  'dash'          : '189',
  'period'        : '190',
  'forward_slash' : '191',
  'grave_accent'  : '192',
  'open_bracket'  : '219',
  'backslash'     : '220',
  'closebracket'  : '221',
  'single_quote'  : '222'
}

function numberKey(k) {
  return (k >= 48 && k <= 57) ? String.fromCharCode(k) : null;
}

function letterKey(k) {
  return (k >= 65 && k <= 90) ? String.fromCharCode(k) : null;
}

function printableKeyPress(k) {
  return (k >= 32 && k < 127) ? String.fromCharCode(k) : null;
}

var KeyNames = [];

function keyName(k) {
  if (KeyNames.length === 0) {
    Object.keys(KeyCodes).forEach(function (keyVal) { 
      KeyNames[KeyCodes[keyVal]] = keyVal; 
    });
    var v;
    for (v = 48; v <= 57; v++) {
      KeyNames[v] = String.fromCharCode(v);
    }
    for (v = 65; v <= 90; v++) {
      KeyNames[v] = String.fromCharCode(v);
    }
  }

  return (k < KeyNames.length) ? KeyNames[k] : null;
}

function eventKeyName(e) {
  var name = keyName(e.which);
  if (name) {
    if (e.metaKey) {
      name = 'meta-' + name;
    }
    else {
      if (e.shiftKey) name = 'shift-' + name;      
      if (e.altKey)   name = 'alt-' + name;
      if (e.ctrlKey)  name = 'ctrl-' + name;
    }
  }
  return name;   
}

var mmxxx;
try {
  mmxxx = function(mm, jQuery) {

    var buttonId = 0;

    //-------------------------------------------------------------------------
    function addToolButton(dnode, buttonText, cls) {
      var id = buttonId;
      var onClickFunction = function(e)  {
        alert('Button ' + id + ' clicked');
        //mm.log('Clicked:', e);
      }

      cls = cls ? cls : "";
      cls = "mmeqb" + cls;

      var btn = $('<button/>', {
          text: buttonText, 
          id: 'tbtn_' + id,
          'class': cls,
          click: onClickFunction
      });

      buttonId++;

      if (dnode) dnode.append(btn);
      return btn;
    }

    //-------------------------------------------------------------------------
    function addToolDatum(tr, buttonText, cls) {
      var td = $("<td/>");
      var btn = addToolButton(td, buttonText, cls);
      tr.append(td);
      return btn;
    }

    //-------------------------------------------------------------------------
    if (!mm) alert('the mMeddle javascript library was not loaded');
    if (!jQuery) alert('the jQuery javascript library was not loaded');    
    var $ = jQuery;
    
    mm.log('Running...');
    var main = $('#mm');
    mm.log(main);    
    
    var $ = jQuery;
    var mmWsElement = $('#mm');
    mmWsElement.find('.intro')
    .html(new Date().toString())
    .css( "border", "2px solid red" )
    .mouseenter(function(me) {
      $(me.target).css( "border", "1px solid black" )
    })
    .mouseleave(function(me) {
      $(me.target).css( "border", "2px solid green" )
    })
    .click(function(me) {
      $(me.target).slideUp();
    });
    
    //mmWsElement.find('.mmeqButtonTable').draggable();
    var bb = $('#exButtonBar');

    bb.append($("<br>"));
    addToolButton(bb, "\u00A7"); // -- Section
    addToolButton(bb, "\u2414"); // -- Paragraph
    addToolButton(bb, "\u2211"); // -- sigma
    
    addToolButton(bb, "\u204C"); // -- left rounded
    addToolButton(bb, "\u204D"); // -- right rounded
    addToolButton(bb, "\u2206"); // -- triangle
    addToolButton(bb, "\u2207"); // -- down triangle
    addToolButton(bb, "\u2261"); // -- 3 bar equivalence
    addToolButton(bb, "\u221A"); // -- radical
    addToolButton(bb, "\u2370"); // -- Question box
    addToolButton(bb, "\u2410"); // -- black triangle right
    addToolButton(bb, "\u2411"); // -- black triangle left
    addToolButton(bb, "\u241E"); // -- black triangle up      
    addToolButton(bb, "\u241F"); // -- black triangle down
    
    addToolButton(bb, "\u2400"); // -- Dotted box
    addToolButton(bb, "\u2610"); // -- Checkable Box
    addToolButton(bb, "\u2611"); // -- Checked Box
    addToolButton(bb, "\u261E"); // -- Hand pointing right
    addToolButton(bb, "\u25FF"); // -- Right triangle
    addToolButton(bb, "\u2397"); // -- Copy out (this to that)
    addToolButton(bb, "\u2398"); // -- Copy in (that to this)
    addToolButton(bb, "\u2704"); // -- Cut
    addToolButton(bb, "\u29C8"); // -- Box in box (go in)
    addToolButton(bb, "\u29C9"); // -- Box to box (clone)      
    addToolButton(bb, "\u2421"); // -- Delete      
    addToolButton(bb, "\u2420"); // -- SP (hard space)      
    addToolButton(bb, "\u2424"); // -- NL (hard return)      
    addToolButton(bb, "\u29CE"); // -- Left/Right Triagles (exchange)
    addToolButton(bb, "\uFFFC"); // -- Object box
    addToolButton(bb, "\u0528"); // -- Diag line box
    
    bb.append($("<br>"));
    addToolButton(bb, "\u00B1"); // -- +/-
    addToolButton(bb, "\u00B7"); // -- dot (mul)
    addToolButton(bb, "\u00D7"); // -- cross (mul)
    addToolButton(bb, "\u00F7"); // -- divide
    
    addToolButton(bb, "\u01C1"); // -- ||
    
    addToolButton(bb, "\u00B0"); // -- degree
    addToolButton(bb, "\u2109"); // -- degrees F
    addToolButton(bb, "\u2103"); // -- degrees C
    addToolButton(bb, "\u212A"); // -- degrees K
    addToolButton(bb, "\u212B"); // -- Angstrom
    addToolButton(bb, "\u2026"); // -- ellipsis
    
    addToolButton(bb, "\u213C"); // -- PI - Constant
    
    addToolButton(bb, "\u2115"); // -- N - Natural
    addToolButton(bb, "\u2124"); // -- Z - Integers
    addToolButton(bb, "\u211A"); // -- Q - Rational     
    addToolButton(bb, "\u211D"); // -- R - Real   
    addToolButton(bb, "\u2102"); // -- C - Complex
    
    addToolButton(bb, "\u22600"); //  Not equal to 0
    addToolButton(bb, "\u003E0"); //  Greater than 0
    addToolButton(bb, "\u22650"); //  Greater than or equal to 0

    bb.append($("<br>"));

    addToolButton(bb, "\u2152"); // -- 1/10 0.1000
    addToolButton(bb, "\u2151"); // -- 1/9  0.1111
    addToolButton(bb, "\u215B"); // -- 1/8  0.1250
    addToolButton(bb, "\u2150"); // -- 1/7  0.1428
    addToolButton(bb, "\u2159"); // -- 1/6  0.1666-->
    addToolButton(bb, "\u2155"); // -- 1/5  0.2000
    addToolButton(bb, "\u00BC"); // -- 1/4  0.2500
    addToolButton(bb, "\u2153"); // -- 1/3  0.3333
    addToolButton(bb, "\u215C"); // -- 3/8  0.3750
    addToolButton(bb, "\u2156"); // -- 2/5  0.4000
    addToolButton(bb, "\u00BD"); // -- 1/2  0.5000
    addToolButton(bb, "\u2157"); // -- 3/5  0.6000
    addToolButton(bb, "\u215D"); // -- 5/8  0.6250
    addToolButton(bb, "\u2154"); // -- 2/3  0.6666
    addToolButton(bb, "\u00BE"); // -- 3/4  0.7500
    addToolButton(bb, "\u2158"); // -- 4/5  0.8000
    addToolButton(bb, "\u215A"); // -- 5/6  0.8333
    addToolButton(bb, "\u215E"); // -- 7/8  0.8750
    addToolButton(bb, "\u215F"); // -- 1/?
    addToolButton(bb, "\u221E"); // -- Infinity

    bb.append($("<br>"));

    addToolButton(bb, "ln");
    addToolButton(bb, "log");
    addToolButton(bb, "sin");
    addToolButton(bb, "cos");
    addToolButton(bb, "tan");
    addToolButton(bb, "x\u02B8");      // -- x^y
    addToolButton(bb, "\u212F\u02DF"); // -- e^x
    addToolButton(bb, "x", "i");
    addToolButton(bb, "y", "i");
    addToolButton(bb, "z", "i");
    addToolButton(bb, "a", "bi");
    addToolButton(bb, "b", "bi");
    addToolButton(bb, "c", "bi");
    addToolButton(bb, "\u2BC0\u2BC1\u2BC2\u2BC3\u2BC4");
    bb.append($("<br>"));

    var bt = $('#exButtonTable'); 
    var tr = $("<tr/>");
    addToolDatum(tr, "\u204C"); // left rounded
    addToolDatum(tr, "\u204D"); // right rounded
    addToolDatum(tr, "\u2211"); // sigma
    bt.append(tr);
    tr = $("<tr/>");
    addToolDatum(tr, "\u2206"); // -- triangle
    addToolDatum(tr, "\u2328", " mmeqbhuge"); // -- Keyboard
    addToolDatum(tr, "\u2261"); // -- 3 bar equivalence -->
    bt.append(tr);
    tr = $("<tr/>");
    addToolDatum(tr, "\u22B2"); // -- left triangle
    addToolDatum(tr, "\u22B3"); // -- right triangle
    addToolDatum(tr, "\u2207"); // -- down triangle
    bt.append(tr);

    // ------------------------------------------------------------------------
    $(".mmeqe")
    .on('keydown', function(e) {
      //mm.log(e);
      var key = e.which;
      var keyCodeName = eventKeyName(e);
      if (keyCodeName) {
        mm.log('--------- KEYDOWN:', key, '[' + keyCodeName + ']');  
      }
    })
    .on('keypress', function(e) {
      var key = e.which;
      var dnode = $(e.target);
      var special = e.ctrlKey || e.altKey || e.metaKey;
      if (!special) {
        var textKey = printableKeyPress(key);
        if (textKey) {
          dnode.append('[' + textKey + ']');
          e.stopPropagation();
          mm.log('--------- KEYPRESS:', key, '[' + textKey + ']');
        }
      }
    })

    mm.log('Started.');
  };

  // Wait for initialization.
  jQuery(mmxxx(mmeddle, jQuery));
}
catch (e) {
  alert('mMeddle Failed:\n' + e.message + '\n' + e.stack);
}

