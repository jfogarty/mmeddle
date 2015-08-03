var fs         = require('fs'),
    del        = require('del'),
    gulp       = require('gulp'),
    glob       = require('glob'),
    g_bump     = require('gulp-bump'),
    g_jshint   = require('gulp-jshint'),
    g_git      = require('gulp-git'),
    g_mocha    = require('gulp-mocha'),
    g_shell    = require('gulp-shell')
    g_size     = require('gulp-size'),
    g_util     = require('gulp-util'),
    g_webpack  = require('webpack-stream'),
    path       = require('path'),
    webpack    = require('webpack'),
    uglify     = require('uglify-js'),
    _          = require('lodash');

var paths = {    
  ENTRY:    './index.js',
  FILE:     'mmeddle.js',
  FILE_MIN: 'mmeddle.min.js',
  FILE_MAP: 'mmeddle.map',
  HEADER:   './src/header.js',
  VERSION:  './src/version.js',
  DIST:     './dist',
  REF_SRC:  './src/function/',
  REF_DEST: './docs/reference/functions/',
  NODE_BIN: './node_modules/.bin',

//  images:  './images/**/*',
  SRC_glob:     ['index.js', 'src/**/*.js'],
  ALLJS_glob:   ['test/**/*.js', '!test/libs/*.js', 'index.js', 'src/**/*.js'],
  LINTSRC_glob: ['test/**/*.js', '!test/libs/*.js', 'index.js', 'src/**/*.js',
                 'testm/**/*.js', 'scratch/**/*.js'],
  TESTS_min:    ['test/test.mmeddle.js'],
  TESTS_all:    ['test/**/test.*.js'],
  TESTS_basic:  ['test/test.mmeddle*js', 'test/**/test.base**js']
};

var pkg = require('./package.json');

var enableMinify = true;
if (typeof process.env.MMEDDLE_MIN !== 'undefined') {
  enableMinify = process.env.MMEDDLE_MIN === 'true' ? true : false;
}  

var enableDocs = true;
if (typeof process.env.MMEDDLE_DOCS !== 'undefined') {
  enableDocs = process.env.MMEDDLE_DOCS === 'true' ? true : false;
}  

var testsLint = false;
if (typeof process.env.MMEDDLE_LINT !== 'undefined') {
  testsLint = process.env.MMEDDLE_LINT === 'true' ? true : false;
}

var minifiyNode = true;
if (typeof process.env.MMEDDLE_MINNODE !== 'undefined') {
  testsLint = process.env.MMEDDLE_MINNODE === 'true' ? true : false;
}  

var testsGlob = 'TESTS_basic';
if (typeof process.env.MMEDDLE_TESTS !== 'undefined') {
  testsGlob = 'TESTS_' + process.env.MMEDDLE_TESTS;
}

var testsReporter = 'spec';
if (typeof process.env.MMEDDLE_TESTREPORTER !== 'undefined') {
  testsReporter = process.env.MMEDDLE_TESTREPORTER;
}

paths.MMEDDLE_JS     = path.join(paths.DIST, paths.FILE);
paths.MMEDDLE_MIN_JS = path.join(paths.DIST, paths.FILE_MIN);
paths.MMEDDLE_MAP_JS = path.join(paths.DIST, paths.FILE_MAP);

var g_banner = false;
var g_versionUpdated = false;

//----------------------------------------------------------------------------
// Functions
//----------------------------------------------------------------------------

// Make package.json script commands into windows/unix compatible
// shell commands that are found in the ./node_modules/.bin directory.
function nodeBin(cmd) {
 var cmdParts = cmd.split(' ');
 var cmdPath = path.join(paths.NODE_BIN, cmdParts[0]);
 cmdParts[0] = path.normalize(cmdPath);
 return cmdParts.join(' ');
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Browser Packaging and Distribution
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function cleanDistDirectory(cb) {
  del([path.join(paths.DIST, '*')], function(err, deletedFiles) {
    if (deletedFiles.length > 0) {
      g_util.log('Files deleted:', deletedFiles.join(', '));
    }
    else {
      g_util.log('No files deleted.');
    }
    cb();
  });
}

// generate banner with today's date and correct version
function createBanner() {
  // Create the new banner only once.
  if (!g_banner) {
    // today, formatted as yyyy-mm-dd
    var today = g_util.date(new Date(), 'yyyy-mm-dd');
    var version = pkg.version;
    g_util.log('createBanner:' + paths.HEADER);
    g_banner = String(fs.readFileSync(paths.HEADER))
        .replace('@@date', today)
        .replace('@@version', version);
  }
  return g_banner;
}

// generate a js file containing the version number
function updateVersionFile() {
  if (g_versionUpdated) {
    return;
  }
  
  g_util.log('updateVersionFile:' + paths.VERSION);
  var version = pkg.version;
  // generate file with version number
  fs.writeFileSync(paths.VERSION, 'module.exports = {\n' + 
      '  version: \'' + version + '\',\n' +
      '  ts: \'' + Date().toString() + '\'\n' +
      '};\n' +
      '// Note: This file is automatically generated when building mmeddle.js.\n' +
      '// Changes made in this file will be overwritten.\n');
  g_versionUpdated = true;
}
// WebPack the mMeddle library into a browser loadable file.
function bundle() {
  // update the banner contents (has a date in it which should stay up to date)
  g_util.log('bundle:' + paths.MMEDDLE_JS);
  var banner = createBanner();
  var bannerPlugin = new webpack.BannerPlugin(banner, {
    entryOnly: true,
    raw: true
  });

  bannerPlugin.banner = banner;
  updateVersionFile();

  // This remove all of the NODE.js only code from the webpack.
  var ignoreNodeOnlys = new webpack.IgnorePlugin(
      new RegExp('' +
        'MongoDBProvider|' +
        'FileProvider|' +
        '^del$|' +
        '^mkdirp$|' +        
        '^socket.io$|' +
        '^canvas$|' +
        '^ansi$|' +
      	'^\./server/' +
        ''));
        
  var webPackPlugins = [ bannerPlugin ];
  // Right now I like the 140,000+ line monster since it is a good
  // stress case, but most of this is node trash that has no place
  // on the browser.  Uncomment the following
  // ignoreNodeOnlys 
  if (minifiyNode) {
    webPackPlugins.push(ignoreNodeOnlys)
  }
    
  return gulp.src(paths.ENTRY)
    .pipe(g_webpack({

        output: { 
          library: 'mmeddle',
          libraryTarget: 'umd',
          filename: paths.FILE,
          pathinfo: true
        },
        externals: {
          // 'crypto' is referenced by decimal.js
        },
        module: {
          noParse: [
//            path.join(__dirname, "src", "sal", "FileProvider"),
//            path.join(__dirname, "src", "sal", "MongoDBProvider"),
          ],
        },
        plugins: webPackPlugins, 
        cache: true
      }, null,
      function(err, stats) {
        if (err) {
          g_util.log('******************NOT bundled ' + paths.MMEDDLE_JS);
          g_util.log(err);
        }
        g_util.log('bundled ' + paths.MMEDDLE_JS);
      }))
    .pipe(g_size({ title: "Full source browser script: " + paths.MMEDDLE_JS }))
    .pipe(gulp.dest(paths.DIST));
}

function minify() {
  var result = uglify.minify([paths.MMEDDLE_JS], {
      mangle: false, // JF - See if this helps
      //compress: {}
      compress: false, // JF - See if this helps
      outSourceMap: paths.FILE_MAP,
      output: {
        comments: /@license/
      }
    });
  fs.writeFileSync(paths.MMEDDLE_MIN_JS, result.code);
  fs.writeFileSync(paths.MMEDDLE_MAP_JS, result.map);
  g_util.log('Minified ' + paths.MMEDDLE_MIN_JS);
  g_util.log('Mapped ' + paths.MMEDDLE_MAP_JS);
  return gulp.src(paths.MMEDDLE_MIN_JS)
      .pipe(g_size({ title: "Minimized browser script: " + paths.MMEDDLE_MIN_JS }));
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Browser user interface CSS-Sprites generation
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function genSprites(done) {
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
          g_util.log('Sprite created: ', fo, 'from', n, 'icons');
          if (count >= execs) done();
      })        
    })
  })
}

function convertSprites(done) {
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
        g_util.log('Image converted: ', fn + '_gray.png', stdout);
        if (count >= execs) done();
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
        g_util.log('Image converted: ', fn + '_focus.png', stdout);
        if (count >= execs) done();
    })
  })
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Testing, code quality and coverage
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function doLint() {
  if (!testsLint) {
    g_util.log(g_util.colors.red(' JSHINT tests skipped.'));
  }
  else {
    return gulp.src(paths.LINTSRC_glob)
        .pipe(g_jshint('.jshintrc'))
        .pipe(g_jshint.reporter('jshint-stylish'));
    g_util.log(g_util.colors.green(' JSHINT  *completed*'));
  }
  //cb();
}

function mochaTests() {
  if (testsGlob === 'TESTS_none' || testsGlob === 'TESTS_false') {
    g_util.log(g_util.colors.red(' Mocha tests skipped.'));
    return;
  }
  var glob = paths[testsGlob];
  if (!glob) {
    g_util.log(g_util.colors.red(' MMEDDLE_TESTS is invalid. Tests skipped.'));
    return;
  }
  var rpt = testsReporter;
  var fileSet = glob.join(' ');
  var cmd = nodeBin('mocha -u bdd -r should --recursive -R ' +
      rpt + ' ' + fileSet);
  g_util.log(g_util.colors.green(cmd));
  return gulp.src('./', {read: false})
    .pipe(g_shell([cmd]))
}

// ***** Note - as of 1-may-2015 Karma tests are not yet running although
// it does successfully launch the browsers (chrome, firefox, and phantomJS)
// and tries to start some tests.
function karmaTests(done) {
  var karma = require('karma').server;
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
}

//----------------------------------------------------------------------------
// Gulp Tasks.
//----------------------------------------------------------------------------

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Browser user interface tool generation
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('sprites', ['genSprites'], function(done) {
  convertSprites(done);
});

gulp.task('genSprites', function(done) {
  genSprites(done);
});

gulp.task('convertSprites', function(done) {
  convertSprites(done);
});

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Testing, code quality and coverage
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Wrapper to run Lint by itself.
gulp.task('lint', [], doLint);

// Wrapper to run test with name testm.
gulp.task('testm', ['test']);

// Run the PhantomJS browser based tests a bit indirectly.
gulp.task('testb', ['bundle', 'minify'], g_shell.task([
  nodeBin(pkg.scripts.testb)
]));

// Run the PhantomJS browser based tests a bit indirectly.
gulp.task('testmb', ['testm'], function() {
  return bundle()
    .pipe(g_shell([ nodeBin(pkg.scripts.testb) ]));
});

// Run Mocha tests on all test.*js files.
gulp.task('test', ['lint'], function () {
  return mochaTests();
});

// Run Karma browser tests
gulp.task('testk', function (done) {
  return karmaTests(done);
});

// Open generated web pages 
gulp.task('showcoverage', g_shell.task([
  path.join('.', 'coverage', 'lcov-report', 'index.html')
], { ignoreErrors: true }));

// NOTE!  Run code coverage with 'npm run coverage'

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Browser Packaging and Distribution
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('clean', function (cb) {
  return cleanDistDirectory(cb);
});

gulp.task('copyClient', function () {
  return gulp.src(['./bin/*'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle', ['copyClient', 'test'], function () {
  return bundle();
});

gulp.task('minify', ['bundle'], function () {
  if (enableMinify) {
    return minify();
  }
  else {
    g_util.log(g_util.colors.red(' Minify skipped.'));
  }
});

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Documentation
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function generateDocs() {
  if (!enableDocs) {
    g_util.log(g_util.colors.red(' API docs generation skipped.'));
  }
  else {
    var cmd = nodeBin(pkg.scripts.docs);
    g_util.log(g_util.colors.green(cmd));
    return gulp.src('./', {read: false})
      .pipe(g_shell([cmd]))
  }
}

gulp.task('docs', function() {
  return generateDocs()
});

gulp.task('showdocs', g_shell.task([
  path.join('.', 'docs', 'src', 'index.html')
], { ignoreErrors: true }));

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Publication - NPM, Git
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Increment the version number.
gulp.task('bump', function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(g_bump())
    .pipe(gulp.dest('./'));
});

// Commit, tag and push changes to the master branch in GitHub.
gulp.task('commit-tag-push', function () {
  var version = pkg.version;
  var v = 'v' + version;
  var message = 'Release ' + v; 
  
  // Make the message more interesting using an environment variable.
  if (process.env.GIT_COMMIT_MESSAGE) {
    message += ' - ' + process.env.GIT_COMMIT_MESSAGE;
  }

  g_util.log('Commit Tag and Push as: "' + message + '"');
  return gulp.src('./')
    .pipe(g_git.commit(message))
    .pipe(g_git.tag(v, message))
    .pipe(g_git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});

// Publish the package to NPM.
gulp.task('npm', function (done) {
  require('child_process').spawn(
    'npm',
      ['publish'], { stdio: 'inherit' }
    ).on('close', done);
});

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Aggregate build sets
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Watch task to automatically test and lint when the source code changes
gulp.task('watch', ['minify'], function () {
  // Just do tests while watching.
  gulp.watch(paths.ALLJS_glob, ['testm']);
});

// Watch to automatically test, lint, then build and test in browser.
gulp.task('watchb', ['testm', 'bundle'], function () {
  // Just do tests while watching.
  gulp.watch(paths.ALLJS_glob, ['testmb']);
});

// The default task (called when you run `gulp`)
gulp.task('default', ['bundle', 'minify']);


 