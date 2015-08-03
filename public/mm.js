/*  mm.js:  mMeddle is a symbol math workspace. */

"use strict";
var mmxxx;
try {
  mmxxx = function(mm, jQuery) {
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

    mm.log('Started.');
  };

  jQuery(mmxxx(mmeddle, jQuery));
}
catch (e) {
  alert('mMeddle Failed:\n' + e.message + '\n' + e.stack);
}

