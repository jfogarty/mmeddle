# mMeddle Development Setup for Linux Mint 17.2 [Cinnamon] "Rafaela"

[https://github.com/jfogarty/mmeddle][github-mm-url]

`mmeddle.js` is a symbolic math workspace for browsers and Node.js.
This guide is a cheat sheet for installing its development tools on
Linux Mint [Cinnamon GUI] 17.2 "Rafaela" systems.

I setup my systems to dual boot Windows and Linux - in this case Mint
(which is mostly Ubuntu) with the Cinnamon GUI (which is mostly Gnome).
I use VirtualBox with Debian, Ubuntu, and CentOS images for system specific testing.

On the Windows side it is **really** important that you edit with LF
instead of CRLF as the line endings for files. If you do this you can
copy files back and forth and you can directly access the NTFS mounts
without mucking things up.

**Before you start, you should understand that these instructions are WRONG**.
Your system is different. The path's shown will have changed. There will be
new and different dependencies. You will need to figure it out and when you
do, please push your changes back to this file.  You will save some other
poor schmoe the troubles you've just worked through and life will be better
because of it.

## Validate your basic development tools

```
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get install build-essential
	gcc -v
	make -v    

```

## Installing mMeddle


```
    git clone https://github.com/jfogarty/mmeddle.git
    cd mmeddle
    
    sudo npm install -g gulp

    sudo npm install -g node-gyp
    
	  sudo npm install -g jsonlint
    sudo npm install -g phantomjs

    sudo apt-get install -y imagemagick
    sudo apt-get install -y graphicsmagick

    npm install

```

## Installing other tools

I do a lot of development with little or no network connection. 
I use **http://devdocs.io/offline** to download excellent searchable docs
of the main APIs used in mMeddle.

I edit primarily with **Sublime Text**.  To view the .md (markdown) files add
** Add Markdown Viewer 1.8+** to Firefox.


### Chrome

```
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

 sudo apt-get install hardinfo
```


### Assorted stuff

```
   sudo apt-get install hardinfo
   sudo apt-get install clipit
   sudo apt-get install guake
```

## Raw Console Notes

```
john@jfmc-asus ~/js/mm $ npm install
 
> phantomjs@1.9.7-15 install /home/john/js/mm/node_modules/phantomjs
> node install.js

Download already available at /tmp/phantomjs/phantomjs-1.9.7-linux-x86_64.tar.bz2
Extracting tar contents (via spawned process)
Copying extracted folder /tmp/phantomjs/phantomjs-1.9.7-linux-x86_64.tar.bz2-extract-1438569891216/phantomjs-1.9.7-linux-x86_64 -> /home/john/js/mm/node_modules/phantomjs/lib/phantom
Writing location.js file
Done. Phantomjs binary available at /home/john/js/mm/node_modules/phantomjs/lib/phantom/bin/phantomjs
 
> kerberos@0.0.12 install /home/john/js/mm/node_modules/mongodb/node_modules/mongodb-core/node_modules/kerberos
> (node-gyp rebuild 2> builderror.log) || (exit 0)

make: Entering directory `/home/john/js/mm/node_modules/mongodb/node_modules/mongodb-core/node_modules/kerberos/build'
  CXX(target) Release/obj.target/kerberos/lib/kerberos.o
make: Leaving directory `/home/john/js/mm/node_modules/mongodb/node_modules/mongodb-core/node_modules/kerberos/build'
npm WARN optional dep failed, continuing fsevents@0.3.7
npm WARN prefer global jsonlint@1.6.2 should be installed with -g
npm WARN installMany nopt was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany npmlog was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany request was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany semver was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany tar was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany tar-pack was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany mkdirp was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany rc was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
npm WARN installMany rimraf was bundled with node-pre-gyp@0.6.4, but bundled package wasn't found in unpacked tree
 
> ws@0.4.32 install /home/john/js/mm/node_modules/socket.io-client/node_modules/ws
> (node-gyp rebuild 2> builderror.log) || (exit 0)

make: Entering directory `/home/john/js/mm/node_modules/socket.io-client/node_modules/ws/build'
  CXX(target) Release/obj.target/bufferutil/src/bufferutil.o
  SOLINK_MODULE(target) Release/obj.target/bufferutil.node
  COPY Release/bufferutil.node
  CXX(target) Release/obj.target/validation/src/validation.o
  SOLINK_MODULE(target) Release/obj.target/validation.node
  COPY Release/validation.node
make: Leaving directory `/home/john/js/mm/node_modules/socket.io-client/node_modules/ws/build'
 
> ws@0.4.32 install /home/john/js/mm/node_modules/socket.io/node_modules/socket.io-client/node_modules/ws
> (node-gyp rebuild 2> builderror.log) || (exit 0)

make: Entering directory `/home/john/js/mm/node_modules/socket.io/node_modules/socket.io-client/node_modules/ws/build'
  CXX(target) Release/obj.target/bufferutil/src/bufferutil.o
  SOLINK_MODULE(target) Release/obj.target/bufferutil.node
  COPY Release/bufferutil.node
  CXX(target) Release/obj.target/validation/src/validation.o
  SOLINK_MODULE(target) Release/obj.target/validation.node
  COPY Release/validation.node
make: Leaving directory `/home/john/js/mm/node_modules/socket.io/node_modules/socket.io-client/node_modules/ws/build'

> bson-ext@0.1.10 install /home/john/js/mm/node_modules/mongodb/node_modules/mongodb-core/node_modules/bson/node_modules/bson-ext
> (node-pre-gyp install --fallback-to-build) || (node-gyp rebuild 2> builderror.log) || (exit 0)

make: Entering directory `/home/john/js/mm/node_modules/mongodb/node_modules/mongodb-core/node_modules/bson/node_modules/bson-ext/build'
  CXX(target) Release/obj.target/bson/ext/bson.o
  SOLINK_MODULE(target) Release/obj.target/bson.node
  COPY Release/bson.node
make: Leaving directory `/home/john/js/mm/node_modules/mongodb/node_modules/mongodb-core/node_modules/bson/node_modules/bson-ext/build'
istanbul-instrumenter-loader@0.1.3 node_modules/istanbul-instrumenter-loader

imagemagick@0.1.3 node_modules/imagemagick

ansi@0.3.0 node_modules/ansi

sf@0.1.8 node_modules/sf

q@1.2.0 node_modules/q

async@1.4.0 node_modules/async

commander@2.8.1 node_modules/commander
└── graceful-readlink@1.0.1

mkdirp@0.5.1 node_modules/mkdirp
└── minimist@0.0.8

run-sequence@1.1.2 node_modules/run-sequence
└── chalk@1.1.0 (escape-string-regexp@1.0.3, supports-color@2.0.0, ansi-styles@2.1.0, strip-ansi@3.0.0, has-ansi@2.0.0)

jshint-stylish@2.0.1 node_modules/jshint-stylish
├── log-symbols@1.0.2
├── plur@1.0.0
├── text-table@0.2.0
├── string-length@1.0.1 (strip-ansi@3.0.0)
└── chalk@1.1.0 (escape-string-regexp@1.0.3, supports-color@2.0.0, ansi-styles@2.1.0, strip-ansi@3.0.0, has-ansi@2.0.0)

del@1.2.0 node_modules/del
├── is-path-cwd@1.0.0
├── object-assign@2.1.1
├── rimraf@2.4.2
├── each-async@1.1.1 (set-immediate-shim@1.0.1, onetime@1.0.0)
├── globby@2.1.0 (object-assign@3.0.0, array-union@1.0.1)
└── is-path-in-cwd@1.0.0 (is-path-inside@1.0.0)

bignumber.js@2.0.7 node_modules/bignumber.js

serve-static@1.10.0 node_modules/serve-static
├── escape-html@1.0.2
├── parseurl@1.3.0
└── send@0.13.0 (destroy@1.0.3, fresh@0.3.0, range-parser@1.0.2, statuses@1.2.1, etag@1.7.0, ms@0.7.1, depd@1.0.1, debug@2.2.0, mime@1.3.4, http-errors@1.3.1, on-finished@2.3.0)

webpack-stream@2.1.0 node_modules/webpack-stream
├── through@2.3.8
├── memory-fs@0.2.0
└── vinyl@0.5.0 (clone-stats@0.0.1, replace-ext@0.0.1, clone@1.0.2)

gulp-mocha@2.1.3 node_modules/gulp-mocha
├── resolve-from@1.0.0
├── plur@1.0.0
├── through@2.3.8
└── temp@0.8.3 (os-tmpdir@1.0.1, rimraf@2.2.8)

glob@5.0.14 node_modules/glob
├── path-is-absolute@1.0.0
├── inherits@2.0.1
├── once@1.3.2 (wrappy@1.0.1)
├── inflight@1.0.4 (wrappy@1.0.1)
└── minimatch@2.0.10 (brace-expansion@1.1.0)

gulp-bump@0.3.1 node_modules/gulp-bump
├── dot-object@0.6.0
├── semver@4.3.6
└── through2@0.5.1 (xtend@3.0.0, readable-stream@1.0.33)

gulp-util@3.0.6 node_modules/gulp-util
├── array-differ@1.0.0
├── array-uniq@1.0.2
├── beeper@1.1.0
├── lodash._reescape@3.0.0
├── lodash._reinterpolate@3.0.0
├── object-assign@3.0.0
├── lodash._reevaluate@3.0.0
├── replace-ext@0.0.1
├── minimist@1.1.2
├── chalk@1.1.0 (escape-string-regexp@1.0.3, supports-color@2.0.0, ansi-styles@2.1.0, strip-ansi@3.0.0, has-ansi@2.0.0)
├── vinyl@0.5.0 (clone-stats@0.0.1, clone@1.0.2)
├── lodash.template@3.6.2 (lodash._basetostring@3.0.1, lodash._basecopy@3.0.1, lodash._basevalues@3.0.0, lodash.templatesettings@3.1.0, lodash.restparam@3.6.1, lodash.escape@3.0.0, lodash._isiterateecall@3.0.9, lodash.keys@3.1.2)
├── through2@2.0.0 (xtend@4.0.0, readable-stream@2.0.2)
├── multipipe@0.1.2 (duplexer2@0.0.2)
└── dateformat@1.0.11 (get-stdin@4.0.1, meow@3.3.0)

gulp-git@1.2.4 node_modules/gulp-git
├── any-shell-escape@0.1.1
├── require-dir@0.1.0
└── through2@0.6.5 (xtend@4.0.0, readable-stream@1.0.33)

express@4.13.2 node_modules/express
├── escape-html@1.0.2
├── merge-descriptors@1.0.0
├── array-flatten@1.1.1
├── cookie@0.1.3
├── utils-merge@1.0.0
├── cookie-signature@1.0.6
├── methods@1.1.1
├── fresh@0.3.0
├── range-parser@1.0.2
├── vary@1.0.1
├── path-to-regexp@0.1.7
├── etag@1.7.0
├── content-type@1.0.1
├── parseurl@1.3.0
├── content-disposition@0.5.0
├── depd@1.0.1
├── on-finished@2.3.0 (ee-first@1.1.1)
├── finalhandler@0.4.0 (unpipe@1.0.0)
├── qs@4.0.0
├── debug@2.2.0 (ms@0.7.1)
├── proxy-addr@1.0.8 (forwarded@0.1.0, ipaddr.js@1.0.1)
├── send@0.13.0 (destroy@1.0.3, statuses@1.2.1, ms@0.7.1, mime@1.3.4, http-errors@1.3.1)
├── accepts@1.2.12 (negotiator@0.5.3, mime-types@2.1.4)
└── type-is@1.6.6 (media-typer@0.3.0, mime-types@2.1.4)

gulp-minify@0.0.5 node_modules/gulp-minify
├── minimatch@1.0.0 (sigmund@1.0.1, lru-cache@2.6.5)
├── through2@0.4.2 (xtend@2.1.2, readable-stream@1.0.33)
└── gulp-util@2.2.20 (lodash._reinterpolate@2.4.1, minimist@0.2.0, chalk@0.5.1, vinyl@0.2.3, lodash.template@2.4.1, through2@0.5.1, multipipe@0.1.2, dateformat@1.0.11)

should@7.0.2 node_modules/should
├── should-type@0.2.0
├── should-equal@0.5.0
└── should-format@0.3.0

uglify-js@2.4.24 node_modules/uglify-js
├── uglify-to-browserify@1.0.2
├── async@0.2.10
├── yargs@3.5.4 (decamelize@1.0.0, camelcase@1.2.1, window-size@0.1.0, wordwrap@0.0.2)
└── source-map@0.1.34 (amdefine@1.0.0)

mocha@2.2.5 node_modules/mocha
├── escape-string-regexp@1.0.2
├── supports-color@1.2.1
├── growl@1.8.1
├── commander@2.3.0
├── diff@1.4.0
├── debug@2.0.0 (ms@0.6.2)
├── mkdirp@0.5.0 (minimist@0.0.8)
├── glob@3.2.3 (inherits@2.0.1, graceful-fs@2.0.3, minimatch@0.2.14)
└── jade@0.26.3 (commander@0.6.1, mkdirp@0.3.0)

mocha-phantomjs@3.6.0 node_modules/mocha-phantomjs
├── commander@2.0.0
└── mocha@1.20.1 (diff@1.0.7, growl@1.7.0, mkdirp@0.3.5, debug@2.2.0, glob@3.2.3, jade@0.26.3)

ssh2@0.4.10 node_modules/ssh2
├── readable-stream@1.0.33 (isarray@0.0.1, inherits@2.0.1, string_decoder@0.10.31, core-util-is@1.0.1)
└── ssh2-streams@0.0.15 (streamsearch@0.1.2, jsbn@0.0.0, asn1@0.2.2)

gulp@3.9.0 node_modules/gulp
├── pretty-hrtime@1.0.0
├── interpret@0.6.5
├── deprecated@0.0.1
├── archy@1.0.0
├── tildify@1.1.0 (os-homedir@1.0.1)
├── minimist@1.1.2
├── v8flags@2.0.10 (user-home@1.1.1)
├── chalk@1.1.0 (escape-string-regexp@1.0.3, supports-color@2.0.0, ansi-styles@2.1.0, strip-ansi@3.0.0, has-ansi@2.0.0)
├── semver@4.3.6
├── orchestrator@0.3.7 (stream-consume@0.1.0, sequencify@0.0.7, end-of-stream@0.1.5)
├── liftoff@2.1.0 (extend@2.0.1, rechoir@0.6.2, flagged-respawn@0.3.1, resolve@1.1.6, findup-sync@0.2.1)
└── vinyl-fs@0.3.13 (graceful-fs@3.0.8, strip-bom@1.0.0, defaults@1.0.2, vinyl@0.4.6, through2@0.6.5, glob-stream@3.1.18, glob-watcher@0.0.6)

request@2.60.0 node_modules/request
├── aws-sign2@0.5.0
├── forever-agent@0.6.1
├── stringstream@0.0.4
├── caseless@0.11.0
├── oauth-sign@0.8.0
├── tunnel-agent@0.4.1
├── form-data@1.0.0-rc3
├── isstream@0.1.2
├── json-stringify-safe@5.0.1
├── extend@3.0.0
├── node-uuid@1.4.3
├── qs@4.0.0
├── combined-stream@1.0.5 (delayed-stream@1.0.0)
├── mime-types@2.1.4 (mime-db@1.16.0)
├── http-signature@0.11.0 (assert-plus@0.1.5, asn1@0.1.11, ctype@0.5.3)
├── bl@1.0.0 (readable-stream@2.0.2)
├── tough-cookie@2.0.0
├── hawk@3.1.0 (cryptiles@2.0.4, sntp@1.0.9, boom@2.8.0, hoek@2.14.0)
└── har-validator@1.8.0 (chalk@1.1.0, is-my-json-valid@2.12.1, bluebird@2.9.34)

gulp-uglify@1.2.0 node_modules/gulp-uglify
├── deap@1.0.0
├── through2@0.6.5 (xtend@4.0.0, readable-stream@1.0.33)
├── vinyl-sourcemaps-apply@0.1.4 (source-map@0.1.43)
└── uglify-js@2.4.19 (uglify-to-browserify@1.0.2, async@0.2.10, yargs@3.5.4, source-map@0.1.34)

grunt@0.4.5 node_modules/grunt
├── dateformat@1.0.2-1.2.3
├── which@1.0.9
├── eventemitter2@0.4.14
├── getobject@0.1.0
├── rimraf@2.2.8
├── colors@0.6.2
├── async@0.1.22
├── grunt-legacy-util@0.2.0
├── hooker@0.2.3
├── exit@0.1.2
├── nopt@1.0.10 (abbrev@1.0.7)
├── minimatch@0.2.14 (sigmund@1.0.1, lru-cache@2.6.5)
├── glob@3.1.21 (inherits@1.0.0, graceful-fs@1.2.3)
├── lodash@0.9.2
├── coffee-script@1.3.3
├── underscore.string@2.2.1
├── iconv-lite@0.2.11
├── findup-sync@0.1.3 (glob@3.2.11, lodash@2.4.2)
├── grunt-legacy-log@0.1.2 (grunt-legacy-log-utils@0.1.1, underscore.string@2.3.3, lodash@2.4.2)
└── js-yaml@2.0.5 (argparse@0.1.16, esprima@1.0.4)

coveralls@2.11.3 node_modules/coveralls
├── lcov-parse@0.0.6
├── log-driver@1.2.4
├── request@2.40.0 (forever-agent@0.5.2, aws-sign2@0.5.0, oauth-sign@0.3.0, stringstream@0.0.4, tunnel-agent@0.4.1, json-stringify-safe@5.0.1, qs@1.0.2, node-uuid@1.4.3, mime-types@1.0.2, form-data@0.1.4, http-signature@0.10.1, hawk@1.1.1, tough-cookie@2.0.0)
└── js-yaml@3.0.1 (argparse@0.1.16, esprima@1.0.4)

gulp-size@1.2.3 node_modules/gulp-size
├── chalk@1.1.0 (escape-string-regexp@1.0.3, supports-color@2.0.0, ansi-styles@2.1.0, has-ansi@2.0.0, strip-ansi@3.0.0)
├── pretty-bytes@2.0.1 (get-stdin@4.0.1, number-is-nan@1.0.0, meow@3.3.0)
├── through2@2.0.0 (xtend@4.0.0, readable-stream@2.0.2)
└── gzip-size@1.0.0 (concat-stream@1.5.0, browserify-zlib@0.1.4)

phantomjs@1.9.7-15 node_modules/phantomjs
├── which@1.0.9
├── progress@1.1.8
├── rimraf@2.2.8
├── kew@0.1.7
├── ncp@0.4.2
├── mkdirp@0.3.5
├── request-progress@0.3.1 (throttleit@0.0.2)
├── adm-zip@0.2.1
├── npmconf@0.0.24 (inherits@1.0.0, once@1.1.1, osenv@0.0.3, ini@1.1.0, semver@1.1.4, nopt@2.2.1, config-chain@1.1.9)
└── request@2.36.0 (forever-agent@0.5.2, aws-sign2@0.5.0, qs@0.6.6, oauth-sign@0.3.0, tunnel-agent@0.4.1, json-stringify-safe@5.0.1, mime@1.2.11, node-uuid@1.4.3, form-data@0.1.4, http-signature@0.10.1, hawk@1.0.0, tough-cookie@2.0.0)

fast-sha256@0.9.2 node_modules/fast-sha256

lodash@3.10.0 node_modules/lodash

gulp-shell@0.4.2 node_modules/gulp-shell
├── through2@0.6.5 (xtend@4.0.0, readable-stream@1.0.33)
├── async@1.2.1
└── lodash@3.9.3

istanbul@0.3.17 node_modules/istanbul
├── supports-color@1.3.1
├── which@1.0.9
├── abbrev@1.0.7
├── wordwrap@0.0.3
├── nopt@3.0.3
├── once@1.3.2 (wrappy@1.0.1)
├── esprima@2.4.1
├── resolve@1.1.6
├── fileset@0.2.1 (minimatch@2.0.10)
├── js-yaml@3.3.1 (esprima@2.2.0, argparse@1.0.2)
├── escodegen@1.6.1 (esutils@1.1.6, estraverse@1.9.3, optionator@0.5.0, source-map@0.1.43, esprima@1.2.5)
└── handlebars@3.0.0 (optimist@0.6.1, source-map@0.1.43, uglify-js@2.3.6)

jsdom@5.6.1 node_modules/jsdom
├── setimmediate@1.0.2
├── xml-name-validator@2.0.1
├── xtend@4.0.0
├── xmlhttprequest@1.7.0
├── browser-request@0.3.3
├── cssom@0.3.0
├── nwmatcher@1.3.6
├── parse5@1.5.0
├── tough-cookie@1.2.0
├── acorn@1.2.2
├── acorn-globals@1.0.5 (acorn@2.1.0)
├── htmlparser2@3.8.3 (domelementtype@1.3.0, entities@1.0.0, domhandler@2.3.0, readable-stream@1.1.13, domutils@1.5.1)
├── escodegen@1.6.1 (esutils@1.1.6, estraverse@1.9.3, optionator@0.5.0, source-map@0.1.43, esprima@1.2.5)
└── cssstyle@0.2.29

jsonlint@1.6.2 node_modules/jsonlint
├── nomnom@1.8.1 (underscore@1.6.0, chalk@0.4.0)
└── JSV@4.0.2

webpack@1.10.5 node_modules/webpack
├── interpret@0.6.5
├── tapable@0.1.9
├── clone@1.0.2
├── memory-fs@0.2.0
├── supports-color@3.1.0 (has-flag@1.0.0)
├── enhanced-resolve@0.9.0 (graceful-fs@3.0.8)
├── optimist@0.6.1 (wordwrap@0.0.3, minimist@0.0.10)
├── webpack-core@0.6.6 (source-list-map@0.1.5, source-map@0.4.4)
├── esprima@1.2.5
├── watchpack@0.2.8 (graceful-fs@3.0.8, async@0.9.2, chokidar@1.0.5)
└── node-libs-browser@0.5.2 (https-browserify@0.0.0, tty-browserify@0.0.0, constants-browserify@0.0.1, path-browserify@0.0.0, os-browserify@0.1.2, string_decoder@0.10.31, process@0.11.1, punycode@1.3.2, domain-browser@1.1.4, querystring-es3@0.2.1, assert@1.3.0, timers-browserify@1.4.1, events@1.0.2, vm-browserify@0.0.4, stream-browserify@1.0.0, util@0.10.3, http-browserify@1.7.0, readable-stream@1.1.13, url@0.10.3, buffer@3.3.1, console-browserify@1.1.0, browserify-zlib@0.1.4, crypto-browserify@3.2.8)

gulp-jshint@1.11.2 node_modules/gulp-jshint
├── minimatch@2.0.10 (brace-expansion@1.1.0)
├── through2@0.6.5 (xtend@4.0.0, readable-stream@1.0.33)
├── rcloader@0.1.2 (rcfinder@0.1.8, lodash@2.4.2)
└── jshint@2.8.0 (strip-json-comments@1.0.4, console-browserify@1.1.0, exit@0.1.2, shelljs@0.3.0, cli@0.6.6, htmlparser2@3.8.3, lodash@3.7.0)

mathjs@2.0.1 node_modules/mathjs
├── tiny-emitter@1.0.0
├── fraction.js@2.5.0
├── typed-function@0.10.1
└── decimal.js@4.0.2

socket.io-client@0.9.17 node_modules/socket.io-client
├── xmlhttprequest@1.4.2
├── uglify-js@1.2.5
├── ws@0.4.32 (tinycolor@0.0.1, options@0.0.6, commander@2.1.0, nan@1.0.0)
└── active-x-obfuscator@0.0.1 (zeparser@0.0.5)

socket.io@0.9.17 node_modules/socket.io
├── base64id@0.1.0
├── policyfile@0.0.4
├── redis@0.7.3
└── socket.io-client@0.9.16 (xmlhttprequest@1.4.2, uglify-js@1.2.5, active-x-obfuscator@0.0.1, ws@0.4.32)

jsdoc@3.3.2 node_modules/jsdoc
├── escape-string-regexp@1.0.3
├── strip-json-comments@1.0.4
├── underscore@1.7.0
├── taffydb@2.6.2
├── async@0.9.2
├── js2xmlparser@0.1.9
├── wrench@1.5.8
├── marked@0.3.5
├── requizzle@0.2.1 (underscore@1.6.0)
├── catharsis@0.8.7 (underscore-contrib@0.3.0)
└── esprima@1.1.0-dev-harmony

mongodb@2.0.27 node_modules/mongodb
├── readable-stream@1.0.31 (isarray@0.0.1, inherits@2.0.1, string_decoder@0.10.31, core-util-is@1.0.1)
└── mongodb-core@1.1.21 (rimraf@2.2.6, mkdirp@0.5.0, kerberos@0.0.12, bson@0.3.2)

ink-docstrap@0.5.2 node_modules/ink-docstrap
└── moment@2.6.0
john@jfmc-asus ~/js/mm $ 
```

