'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var mmeddle = require('../../');
}

(function test(mm) {
  var _        = mm.check(mm._);
  
  var opentype = mm.check(mm.opentype);
  var outStream;
  var canvas;
  var canvasX = 2300;
  var canvasY = 1200;
  var imageFile;
  var scale = 1;
  scale /= 2;
  scale /= 2;
    
  if (mm.config.inNode) {
    var Canvas = mm.check(mm.canvas);
    canvas = new Canvas(canvasX * scale, canvasY * scale);
  }
  else {
    mm.log.setWriteLine(outLine);
    canvasSpace = mm.document.getElementById('canvasSpace');
    var canvas = document.createElement('canvas');
    canvas.width = canvasX * scale;
    canvas.height = canvasY * scale;
    canvasSpace.appendChild(canvas);
  }
  
//  var canvas = new Canvas(230, 120);
  var ctx = canvas.getContext('2d');

  // Defined on Browser clients.
  var consoleOutput;
  var consolePrompt;
  var consoleInput;  
  
  function outLine(text) {
    if (mm.config.inNode) {
      mm.log(text)
    }
    else {
      consoleOutput.appendChild(mm.document.createTextNode(text + '\n'));
    }
  }  

  function clippedCircle(canvas, ctx) {
    var x = canvas.width / 2 - 150;
    var y = canvas.height / 2;
    var radius = 75;
    var offset = 50;

    /*
     * save() allows us to save the canvas context before
     * defining the clipping region so that we can return
     * to the default state later on
     */
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.clip();

    // draw blue circle inside clipping region
    ctx.beginPath();
    ctx.arc(x - offset, y - offset, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // draw yellow circle inside clipping region
    ctx.beginPath();
    ctx.arc(x + offset, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // draw red circle inside clipping region
    ctx.beginPath();
    ctx.arc(x, y + offset, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();

    /*
     * restore() restores the canvas ctx to its original state
     * before we defined the clipping region
     */
    ctx.restore();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'blue';
    ctx.stroke();    
  }  
  
  function min(a, b) { return a < b ? a : b }
  function max(a, b) { return a > b ? a : b }
  
  function rebound(bounds, x, y) {
    x = ('xOrigin' in bounds) ? x - bounds.xOrigin : x;
    y = ('yOrigin' in bounds) ? y - bounds.yOrigin : y;
    bounds.xMin = min(bounds.xMin, x);
    bounds.yMin = min(bounds.yMin, y);
    bounds.xMax = max(bounds.xMax, x);
    bounds.yMax = max(bounds.yMax, y);
    bounds.width  = bounds.xMax - bounds.xMin;
    bounds.height = bounds.yMax - bounds.yMin;
  }

  /**
   * @summary **Find the min and max x and y in an OpenType Path**
   * @description
   * This extends the OpenType Path to compute and add a bounds object.
   * The bounds is the maxima an minima for all x and y values in the
   * text path. If the path is based at 0, 0 then the yMin will be the 
   * (negative) height of the text above baseline, and yMax will be the
   * depth of the descenders. A negative xMin indicates a font that extended
   * left from its starting point (unusual but not that rare).
   *
   * The xOrigin and yOrigin can be added so the minima and maxima are
   * relative to that point. This is useful for paths that are not based
   * at the (0, 0) origin.
   *
   * The bounds object contains height, width, xMin, yMin, xMax, yMax;
   *
   * The bounds object is added to the Path as well as being returned.
   * @param {number} xOrigin an offset origin (optional).
   * @param {number} yOrigin an offset origin (optional).
   * @returns {object} a Bounds object.
   */      
  opentype.Path.prototype.getBounds = function getBounds(xOrigin, yOrigin) {
    var bounds = { xMin: 0, yMin: 0, xMax: 0, yMax: 0, width: 0, height: 0 };
    if (xOrigin) bounds.xOrigin = xOrigin;
    if (yOrigin) bounds.yOrigin = yOrigin;
    var n = this.commands.length;
    for (var i = 0; i < n; i ++) {
      var cmd = this.commands[i];
      if (cmd.type === 'M') {
        rebound(bounds, cmd.x, cmd.y);
      } else if (cmd.type === 'L') {
        rebound(bounds, cmd.x, cmd.y);
      } else if (cmd.type === 'C') {
        rebound(bounds, cmd.x1, cmd.y1);
        rebound(bounds, cmd.x2, cmd.y2);
        rebound(bounds, cmd.x, cmd.y);
      } else if (cmd.type === 'Q') {
        rebound(bounds, cmd.x1, cmd.y1);
        rebound(bounds, cmd.x, cmd.y);
      } else if (cmd.type === 'Z') {
        // ignore z.
      }
    }
    this.bounds = bounds;
    return this.bounds;
  }
     
  /**
   * @summary **Draw an OpenType Path at a specific location**
   * @description
   * This extends the OpenType Path to draw at a specific x, y origin
   * (assuming the Path is homed at 0, 0).
   *
   * @param {Context} ctx a Canvas 2D context or equivalent.
   * @param {number} x the location.
   * @param {number} y the location.
   */      
  opentype.Path.prototype.drawAt = function drawAt(ctx, x, y) {
    ctx.translate(x, y);
    this.draw(ctx);
    //ctx.translate(-x, -y);
    ctx.resetTransform();
  }
  
  function drawBoxedText(ctx, otFont, fontp, x, y, text) {
    
    // The defaults are path.fill:'black', stroke:null, strokeWidth:1;
    // This will execute ctx.fill() but not stroke() on a path.draw().
    var otPath = otFont.getPath(text, 0, 0, fontp, { kerning: true });
    var bounds = otPath.getBounds();
   
    // Draw baseline
    ctx.beginPath();    
    ctx.strokeStyle = 'black';    
    ctx.lineWidth = fontp < 30 ? 1 : 2;
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + bounds.xMax + 15, y);
    ctx.stroke();

    otPath.fill = 'black'; // The fill IS the lining for some fonts.
    // At smaller resolutions (under 30 pts) the stroke will fill
    // in the font and make it ugly.
    otPath.stroke = null; // For some fonts any stroke is overly bold. 
    //otPath.stroke = 'black';
    otPath.strokeWidth = 1;
    
    otPath.drawAt(ctx, x, y);
    console.log('OTPATH [BOUNDS]: ', bounds);
    
    // otFont.draw(ctx, text + 'Q', x, y + fontp, fontp);       

    console.log('H AND W: ', bounds.width, bounds.height);

    // The bounding box.
    ctx.beginPath();    
    ctx.lineWidth = 1;
    ctx.rect(x + bounds.xMin, y + bounds.yMin, bounds.width, bounds.height);
    ctx.strokeStyle = 'green';
    ctx.stroke();
    
    // Radical character
    //var radical = String.fromCharCode(0x221A); // Radical.
    //var rotPath = otFont.getPath(radical, 0, 0, bounds.height * 1.3);
    ///var rbounds = getPathBounds(rotPath);
    //otPath.fill = 'yellow';
    //otPath.stroke = 'black';    
    //otDraw(ctx, rotPath, x - rbounds.width*1.1 , y);
    
    // Draw Radical
    ctx.beginPath();      
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontp < 30 ? 1 : 2;
    var dy = fontp / 4;
    var dx = fontp / 8;
    var db = fontp / 3;
    
    // Right to left, then down
    ctx.moveTo(x + bounds.xMax + dx, y + bounds.yMin - dy);
    ctx.lineTo(x - dx, y + bounds.yMin - dy);
    ctx.lineTo(x - db, y + bounds.yMax + dy / 2);
    ctx.stroke();
    
    // Up to left as a wider bar
    ctx.beginPath();
    ctx.lineWidth = fontp < 30 ? 2 : 4;
    ctx.moveTo(x - db - 1,   y + bounds.yMax + dy / 2);
    ctx.lineTo(x - db - dx,  y + bounds.yMin / 2);
    ctx.stroke();
    
    // The final tick
    ctx.beginPath();
    ctx.lineWidth = fontp < 30 ? 1 : 2;
    ctx.lineTo(x - db - dx,       y + bounds.yMin / 2);
    ctx.lineTo(x - db - dx * 2,   y + bounds.yMin / 2 + dy / 2);
    ctx.stroke();
  }
  
  function drawBoxedTextR(ctx, otFont, fontp, x, y, text, n) {
    drawBoxedText(ctx, otFont, fontp, x, y, _.repeat(text, n));
  }
  
  function drawTextList(ctx, otFont, fontp, x, y, ch, n) {
    var xs = x;
    var ys = y;
    var yi = fontp * 1.3;
    var xi = fontp * 1.2;
    var cc = ch.charCodeAt(0);
    for (var i = 0; i < n; i++) {
      var text1  = _.repeat(String.fromCharCode(cc), 1);
      var text3  = _.repeat(String.fromCharCode(cc), 3);
      var text10 = _.repeat(String.fromCharCode(cc), 10);
      drawBoxedText(ctx, otFont, fontp, x,            y, text1);
      drawBoxedText(ctx, otFont, fontp, x + xi * 1.5, y, text3);
      drawBoxedText(ctx, otFont, fontp, x + xi * 4,   y, text10);
      y += yi;
      cc++;
      if (i === 12) {
        x += xi * 14;
        y = ys;
      }
    }
  }
  
  function drawStuff(canvas, ctx, otFont) {
    ctx.globalAlpha = 1.0; 
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);    
    ctx.fillStyle = 'white';
    ctx.fill();

    console.log('- Should be green by now.');    
    var xtxt = '-------- xyzzy: ' 
      + String.fromCharCode(0x41)
      + String.fromCharCode(0x398)
      + String.fromCharCode(0x2188)
      + String.fromCharCode(0x2B42)
      + '';
    
    var fontp = 60;
    fontp = 60 * scale;
    
    ctx.fillStyle    = "black";
    ctx.font         = fontp.toString() + "px xyzzy";
    //ctx.textAlign    = 'left';
    //ctx.textBaseline = 'bottom';    
    ctx.fillText(xtxt, 350, fontp * 0.7); // Real font.
    
    otFont.draw(ctx, xtxt, 20, fontp * 0.7, fontp); // Drawn font
    
    if (mm.config.inBrowser) {
      var p = document.getElementById("fontinfo_ttf");
      p.style.fontFamily = "'" + jsfont.fontFamily + "'";
      p.style.fontSize = "1em";   
      p.innerHTML = xtxt;
    }
     
    var x = fontp;
    var y = fontp * 2;
    
    //drawBoxedText(ctx, otFont, fontp, x, y, 'xyzzy');
    
    //drawBoxedTextR(ctx, otFont, fontp, x, y, 'j', 10);
    //drawBoxedTextR(ctx, otFont, fontp, x, y + fontp * 2, 'Q', 10);
    
    //drawTextList(ctx, otFont, fontp, x, y, "A", 26);
    drawTextList(ctx, otFont, fontp, x, y, "a", 26);

    if (fontp > 30) clippedCircle(canvas, ctx);
  }

  function outputCanvas(canvas, imageFile) {
    var canvasStream = canvas.jpegStream({
        bufsize: 4096 // output buffer size in bytes, default: 4096
      , quality: 90 // JPEG quality (0-100) default: 75
      , progressive: false // true for progressive compression, default: false
    });  

    mm.log('- Creating ' + imageFile);
    
    canvasStream.on('data', function(chunk){
      outStream.write(chunk);
    });

    canvasStream.on('end', function(){
      mm.log('- Whoo hoo! Saved ' + imageFile);
    }); 
  }  
  
  var fontFileName = 'Symbola.ttf'; 
  //fontFileName = 'AlphaWood.ttf';
  if (mm.config.inNode) {  
    var dir = __dirname + '/imgs'
    imageFile = __dirname + '/radicalOT.jpg';
    var fs = mm.check(mm.fs);
    var Canvas = mm.check(mm.canvas);
    outStream = fs.createWriteStream(imageFile);  
  
    var fontFilePath = './fonts/' + fontFileName;
    opentype.load(fontFilePath, function(err, font) {
      if (err) {
        console.error('Font could not be loaded: ' + err);
      } else {
        drawStuff(canvas, ctx, font);
        outputCanvas(canvas, imageFile);
      }
    });
  }
  else {
    var fontUrl = '/fonts/' + fontFileName;
    // On browser clients obtain the relevent DOM elements.
    consoleOutput = mm.document.getElementById('consolediv');
    consolePrompt = mm.document.getElementById('inTextPrompt');
    consoleInput  = mm.document.getElementById('cliInText');    

    consoleOutput.innerHTML = '';
    
    //-------------------------------------------------------------------------
    var jsfont = new Font();
    
    jsfont.onload = function fontLoaded() {
      mm.log('jSFont [' + fontUrl + '] LOADED - WOOO HOOO');
      mm.log(jsfont.metrics);
      //document.head.removeChild(font.toStyleNode());
      document.head.appendChild(jsfont.toStyleNode());
    }
    
    jsfont.onerror = function(errm) {
      mm.log.error('jSFont [' + fontUrl + '] failed to load: ' + errm);
    };
    
    jsfont.fontFamily = 'xyzzy';
    jsfont.src = fontUrl;

    //------------------------------------------------------------------------- 
    opentype.load(fontUrl, function(err, otfont) {
      if (err) {
        mm.log.error('Font [' + fontUrl + '] could not be loaded: ' + err);
      } else {
        drawStuff(canvas, ctx, otfont);
      }    
    });
    
  }

}(mmeddle));