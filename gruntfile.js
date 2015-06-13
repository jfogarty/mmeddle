module.exports = function (grunt) {
  var glob = require('glob');
  var fs   = require('fs');
  var _    = require('lodash');

  // Load in `grunt-spritesmith` 
  grunt.loadNpmTasks('grunt-spritesmith');
//  grunt.loadNpmTasks('grunt-exec');

  // Configure grunt 
  grunt.initConfig({
    sprite:{
      options: {
      },
      s16: {
        padding: 10,
        src:'images/icons/16x16/**/*.png',
        dest: 'images/toolsprites16.png',
        destCss: 'css/toolsprites16.css'
      },
      s22: {
        padding: 10,
        src:['images/icons/22x22/**/*.png'],
        dest: 'images/toolsprites22.png',
        destCss: 'css/toolsprites22.css'
      },
      s32: {
        padding: 10,
        src:['images/icons/32x32/**/*.png'],
        dest: 'images/toolsprites32.png',
        destCss: 'css/toolsprites32.css'
      }
    }
  })

  grunt.registerTask('gensprites',
    'Convert spite images to grayscale', function() {
    var done = this.async();
    var spritesmith = require('spritesmith');
    var imageSizes = ['16', '22', '32'];
    var count = 0;
    var execs = imageSizes.length;
    imageSizes.forEach( function(size) {
      var iconDir = size + 'x' + size;
      // create an array of all icons of the same size.
      glob('./images/icons/' + iconDir + '/**/*.png', function (er, sprites) {
        if (er) throw err;
        var fn = 'toolsprites' + size;
        var n = sprites.length;
        spritesmith({
            src: sprites,
            padding: 10
          }, 
          function(err, result) {
            count++;
            if (err) throw err;
            var fo = './images/' + fn + '.png'; // generated file.
            var fref = fo; // file as referenced from the URL.
            var fcss = './css/' + fn + '.css'; // the generated css file.

            // Output the image
            fs.writeFileSync(fo, result.image, 'binary');
           
            // Generate the css.
            var css = '/*\n' +
              '    Generated CSS file.  Do not edit.\n' +
              '*/\n';
            _.forEach(result.coordinates, function(n, key, self) {
              var png = key.substr(key.lastIndexOf('/') + 1);
              var prefix = '.icon-';
              var klass = prefix + png.substr(0, png.lastIndexOf('.'));
              var x = 0 - self[key].x;
              var y = 0 - self[key].y;
              var w = self[key].width;
              var h = self[key].height;
              css += klass + ' {\n';
              css += '  background-image: url(.' + fref + ');\n';
              css += '  background-position: ' + x + 'px ' + y +'px;\n';
              css += '  width: ' + w + 'px;\n';
              css += '  height: ' + h + 'px;\n';
              css += '}\n';
            });
            fs.writeFileSync(fcss, css);
            grunt.log.writeln('Sprite created: ', fo, 'from', n, 'icons');
            if (count >= execs) done(true);
        })        
      })
    })
  })
 
  grunt.registerTask('convert',
    'Convert sprite images to grayscale', function() {
    var done = this.async();
    var im = require('imagemagick');
    var imageSizes = ['16', '22', '32'];
    var count = 0;
    var execs = imageSizes.length * 2;
    imageSizes.forEach( function(size) {
      var fn = 'toolsprites' + size;
      
      // Start async task to convert one image to grayscale
      im.convert([
        './images/' + fn + '.png',
        '-colorspace', 'gray',
        './images/' + fn + '_gray.png'],
      function(err, stdout) {
          count++;
          if (err) throw err;
          grunt.log.writeln('Image converted: ', fn + '_gray.png', stdout);
          if (count >= execs) done(true);
      })
      
      // Start async task to convert one image to focused (slight shadow)
      im.convert([
        './images/' + fn + '.png',
        '-colorspace', 'gray',
        '-fill', 'black', '-colorize', '20%',
        './images/' + fn + '_focus.png'],
      function(err, stdout) {
          count++;
          if (err) throw err;
          grunt.log.writeln('Image converted: ', fn + '_focus.png', stdout);
          if (count >= execs) done(true);
      })
    })
  })
  
  grunt.registerTask('default', [
    'sprite',
    'convert'
  ]);  
};