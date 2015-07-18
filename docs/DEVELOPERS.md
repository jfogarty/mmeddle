# mMeddle Developer's Guide
[![Build Status][travis-image]][travis-url] 
[![Coveralls Status][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]

[npm-url]: https://www.npmjs.com/package/mmeddle
[npm-image]: https://badge.fury.io/js/mmeddle.svg

[nodeico-url]: https://nodei.co/npm/mmeddle/
[nodeico-image]: https://nodei.co/npm/mmeddle.png?compact=true

[travis-url]: https://travis-ci.org/jfogarty/mmeddle
[travis-image]: https://img.shields.io/travis/jfogarty/mmeddle.svg?branch=master

[coveralls-url]: https://coveralls.io/r/jfogarty/mmeddle
[coveralls-image]: https://img.shields.io/coveralls/jfogarty/mmeddle.svg

[depstat-url]: https://david-dm.org/jfogarty/mmeddle
[depstat-image]: https://david-dm.org/jfogarty/mmeddle.svg

[openshift-mm-url]: http://mmeddle-jfogarty.rhcloud.com
[openshift-mm-bvt-url]: http://mmeddle-jfogarty.rhcloud.com/test/testMocha.html
[openshift-mm-api-url]: http://mmeddle-jfogarty.rhcloud.com/api/index.html
[openshift-mm-cli-url]: http://mmeddle-jfogarty.rhcloud.com/test/webcli.html
[openshift-mm-climin-url]: http://mmeddle-jfogarty.rhcloud.com/test/webcli-min.html

[mongolab-mmSpace]: https://mongolab.com/databases/mmspace  

[github-mm-url]: https://github.com/jfogarty/mmeddle

[https://github.com/jfogarty/mmeddle][github-mm-url]

[graphicsMagick-url]: http://www.graphicsmagick.org/
[imageMagick-url]: http://www.imagemagick.org/

![backgound math art](../images/art/mathart2.png)

`mmeddle.js` is a symbolic math workspace for browsers and Node.js. It features pluggable types, operators, units, and functions.

# mMeddle IS NOT YET OPEN FOR DEVELOPMENT
### move along please, these aren't the droids you're looking for...

[![NPM NODE ICON][nodeico-image]][nodeico-url]

This library is the headless workhorse for maintaining *mMeddle* documents, 
and performing symbolic math operations. It runs in backend servers as
an **Express** application using a **MongoDB** database for primary storage. 
The same engine runs in browsers as a minified script as part of the *mMeddler*
SPA (single page application).

It includes all source, images and test cases for building and testing mMeddle.
**bin\cli.js** is a text mode node.js client that runs standalone or is
enhanced (significantly) by having access to a mMeddle server. **server.js**
is the mMeddle server you can run locally. The mMeddle browser client
application is started using http://localhost:8080 when the server is running.
This provides access to the browser test cases, the **webCli** (a browser based
version of the **cli.js**) and its **mmeddle.min.js** minimized twin.

This document (./mmeddle/docs/DEVELOPERS.md) is a markdown file that provides
a developer's overview for building and testing mmeddle bits.
For code structure documents, you can read the README.md files in each source
directory and build the `docs/src/index.html` for the generated API as
described here.

## That Vision Thing

The grand plan (or pipe dream) is for *mMeddle* to become a community service
which loads the *mMeddler* user interface to client pads and computers.
*mMeddler* users will write their own math-based documents using standard
mathematical notations, manipulate equations using drag and drop based symbolic
algebra, and produce numerical results in the form of values, graphs and tables.

The backend service will maintain a cloud of private and public symbolic math
documents organized by scientific, engineering, mathematical, and pedegogical 
topics. Math inclined programmers will extend the nature of the maths that we
can handle, while subject matter experts will publish and edit live documents
containing equations, explanations, problems, and solutions. Student, teachers,
geeks and the strangely curious will have access to a level of math that has
mostly been out of reach through layers of technical barriers. A golden age
will flourish and all world problems will be solved as a direct result of your
hard work on this bucket of code. 

## Your First Checkin

You should read this document from end to end and try to build mMeddle
and run every test case and chunk of code you can find. As you do so,
please check back to here to figure out what lies have been told that
caused you trouble.

All documents - especially ones that detail the dynamics of the development
process become quickly out of date. When you have solved your local 
development issues, your first pull request should consist of fixes to
this document. Your work here will multiply your efforts by other developers
who won't waste the same time you had to. Pay it forward. 

## Structure

*mMeddle* is structured as a single main module `mmeddle` which contains 
bindings between the other modules. Modules within sub-directories usually 
contain no *requires* statements unless they are to node_modules (preferably
ones which is are unique to a single module) or to a sub-directory from the
one containing the module. `require("..\[a modulename]")` is **not** permitted
in this code.

The `index.js` files in each source directory load the `mm` (mMeddle main)
object with the global bindings produced in that directory.

Isolating the bindings between modules to a single outer level module 
eases restructuring and module substitution for the various environments
in which mmeddle must run. The `mm` object is also the central point for
inserting mock implementations such as `MockSock` that allows in-process
testing of client apps within the server.

## Installation

MMeddle is a pretty typical node.js github hosted application. You must start
by installing `git` and `node` (which includes the `npm` - node 
package manager).  You should install the full package to a local directory
using github or a .zip or .tar of the package. Then:

    npm install
    
This will take a while (minutes) unless you are on a blazingly fast connection
or already have all the required packages from `package.json` already
available on your machine in some way `npm` can get them.  Any errors or
warnings should be cause for concern. When possible, we use `"latest"` as
the required version. This gets us into trouble when incompatibilies creep
into those modules, but the pain is usually worth it, so expect to work
through such issues from time to time.

### Other tools you will need or want

- **Firefox** and **Firebug**: the primary client browser and dev tool used in testing
- **Markdown viewer**: extension for Firefox or equivalent for chrome
- **mongoDB**: get it if you will do more than trivial testing
- **imagemagick**: required if you rebuild the sprite based icons
- **gimp**: or an equivalent if you plan to mess with icon or toolbar images

**Firefox and Firebug**: Other browsers and their dev interfaces can be used
as well, but I focus on Firefox first. We must run well in **Chrome** and
**Safari**, especially on iPads and other fondle-slabs. I don't care much
about trying to support **Internet Explorer** as it continues to be the bane
of existence for browser compatibility - at least as of IE 11. 
Life is too short.

**Markdown viewer**: The docs are either `.md` markdown files, or 
generated .html created by `jsdoc`. Your life is better if you can
easily view the .md files in their properly rendered form; I use the 
Firefox extension, you may have another solution.

**mongoDB**: Persistent data is accessed through a MongoDB instance. You
will want to create one locally fairly soon after you have finished the
first phase of playing around. I do most of my testing without the DB
(using the `fileProvider` interface) since I like to see and edit the
files directly. This is useful for testing but does not scale well, so
all production work uses the database. So far we've been able to resist
using the attractive DB specific facilities that will eventually make 
file based storage impractical.

**imageMagick**: This is used for building the sprite icons, for graying
them out, and mouseover highlights.  You won't need this unless you need to
add new icons to the sprite tables.

## Building

Gulp and a `gulpfile.js` provide the build and test environment:

    gulp
    
This runs the gulpfile.js `default` task which performs verification tests,
then builds and packages the various forms of the library.

### Gulp Build Tasks

Task | Description
---- | -----------
**test** | do the node.js Mocha BDD BVTs tests 
**lint** | jshint the source using `.jshintrc` rules
**clean** | delete the `./dist` directory contents
**bundle** | **WebPack** the client for use in a browser
**minify** | make a .min version for reasonable load times
**testb** | run the browser BVTs using a **PhantomJS** headless browser

### Speciality and Utility tasks

Task | Description
---- | -----------
**bump** | increment the version number in `package.json` and `bower.json` 
**showdocs** | open the API docs in a browser
**showcoverage** | open the code coverage reports in a browser
**sprites** | regenerate sprites for icons (requires imageMagick)
**testk** | run Karma tests (**not yet running properly**)


## Testing

Testing is primariy done with a set of **Mocha** tests using the **BDD** 
(behaviordriven development) style. Developers are strongly encouraged to
use this style for their own tests. All integrations require passing tests.

Note the boilerplate code in the top of `test.*js` files to allow the same
tests to run in your browser, the **PhantomJS** headless browser,
and **node.js**.

### mMeddle Gulp Test Setup Environment Variables

If no environment variables are defined, then the default gulp settings
are equivalent to setting:

    MMEDDLE_TESTS=basic
    MMEDDLE_TESTREPORTER=list
    MMEDDLE_MIN=true
    MMEDDLE_LINT=true
    
The 'basic' tests do not require a server a background mMeddle server so
they are more easily run, but don't test all that much. You can also set:

    MMEDDLE_TESTS=none
    MMEDDLE_TESTS=min
    MMEDDLE_TESTS=all
    
Min selects an absolute minimum test set, and really just checks to be
sure that testing is working at all. Use this rarely. All selects the full
test suite and you will need to have a server running.   

`MMEDDLE_MIN` generates the minified version of mMeddle for browser clients.
This is the most time consuming build step and is rarely needed for testing.
You can disable it, but you must test the minified WebCLI before any checkin.
mMeddle uses lots of things than can make the uglifier unhappy so do not
miss this step.

The test reporters can be selected from :

    MMEDDLE_TESTREPORTER=nyan
    MMEDDLE_TESTREPORTER=progress
    MMEDDLE_TESTREPORTER=dot
    MMEDDLE_TESTREPORTER=min 
    MMEDDLE_TESTREPORTER=spec
    MMEDDLE_TESTREPORTER=list

As noted above, 'all' tests require a background mMeddle server. You
should start alocal server (**127.0.0.1:8080**) in its own shell using:

    npm start
or

    node server
    
To run the **BVT**s (base verification tests) you run:

    gulp test

Note if you see an error that looks something like the following then you are
probably trying to run the server tests and failing to get a connection to
a mMeddle server.

  1)  "before each" hook: **mochaTestConnect:**
     Error: timeout of 2000ms exceeded. ...
    
During development continuous tests on every source change is enabled with:

    gulp watch
    
Note that `gulp watchb` does continuous PhantomJS browser based testing but is
more annoying since the bundled mmeddle.js must be rebuilt on every source
change (which is pig-slow). See `MMEDDLE_MIN` environment variable.


### Test Case File Naming

Every test **.js** source file starts with a `test.` prefix. With the exception
of test.mmeddle (which is a base test), all other base test files start with
`test.base.`.  These are the tests that run with MMEDDLE_TESTS=basic and
must run without server access. All other tests can require access to the
server, but will only be run with MMEDDLE_TESTS=all or when run
specifically from the mocha command line.

    mocha -u bdd -r should --recursive -R list test/[test.specfic-test-case.js]

##  CLI - Command Line Testing
    
`bin/cli` is a simple command line application that provides you with access
to the text mode CLI. This is a good place to get started with development
since it is usually much easier to debug in the node server to node client
world than it is in the node server to AngularJS brower app.

Run the text mode version of the CLI with:

    node bin/cli

The **cli** uses an emulated version of browser localStorage,
which places 'local' files in the **./storage/localStorage/app** directory.

The CLI does not give you access to everything mMeddle can do, and it is
really terrible as a way to write math, but it is still the best way to
test your non-UI code.

Connection to the localhost server is the default, but you can use the
`.host remote` command to connect to the live remote server.

The CLI works with `mocksock` testing as well, so this is often an easy
way to debug client/server issues since both run in the same process.
Start the server and CLI using mocksock via:

    node server --mock --app bin/cli.js

Note that in this mode, both the app (CLI) and the Server log messages are sent
to the same **./logs/server-[yymmdd].log** file.

##  Browser Testing
    
Browser BVT tests are started from [test/testMocha.html][openshift-mm-bvt-url]
(this link is to the test server).  To do more than rudimentary testing
you must run a mMeddle server.

Use http://127.0.0.1:8080/test/webcli.html to start the web based text
mode cli. You can reach the online version at [test/webcli.html][openshift-mm-cli-url] or [test/webcli.min.html][openshift-mm-climin-url].

Note that the CLI uses browser localStorage to hold the current workspace and
user login information. The localStorage domains will be different depending
on how you start the app, so this may cause you some confusion at first.
Some mocha unit tests will wipe out your local storage as well.

Configuration of the webCli comes from the `./dist/config.js` file loaded
when the page loads.  This file is created from the merge of the current
server configuration with `./config/browser.config.json`, when server
starts execution.

You can work on a local version of the WebCLI and mmeddle library while
using the live server by entering a `.host remote` command.
using the live server by entering a `.host remote` command.

## Local Server Execution

The mMeddle server (server.js) is started in the traditional way with:

    npm start
        or
    node server

This is an `Express` web server which exposes the entire development
tree as static content on **//localhost:8080**. The `index.html` page has links
to various things of interest.

Interaction with the client is almost exclusively through `socket.io`
connections. Socket connections are almost immediately superceeded by
workspace session connections (persistent connections that maintain
session MMSIDs in browser localStorage and in server `wsSessions`.

### Testing With the mMeddle Server

Some BVTs will run without a server, but many will not.  Start `server.js`
in its own shell and make sure your firewalls allow access to localhost:8080.

The server also supports directly running a single node.js client app (such as
`bin\cli.js`) within the same shell (use: `-a appName.js`) and even within the
same process through the MockSock socket.io simulator (add the `-m` flag).

### mMeddle Server Environment Variables

Here are some important server environment variables you need to know:

    MMEDDLE_PORT: port used by local server [8080]
    MMEDDLE_IPADDR: IP address used by local server [127.0.0.1]
    MONGODB_DB_URL: Set the mongo database connection url [mongodb://localhost/mydb]    

    OPENSHIFT_NODEJS_IP: ip address used by the OpenShift test servers
    OPENSHIFT_NODEJS_PORT: port used by the OpenShift test servers
    
    MMEDDLE_NOFS: disables use of the FileStorage storage provider
    MMEDDLE_NODB: disables use of any Database storage provider
    MMEDDLE_MOCKSOCK: force use of MockSock socket.io simulator
    MMEDDLE_LOCALSTORAGE: subdirectory for simulated localStorage [app]


### PhantomJS dependence on Q 1.2.0

Q 1.3.0 added a more restrictive test for node.js execution which checks to
see that `process.toString() === [Object process]` instead of just 
`(typeof process !== "undefined" && process.nextTick)` which is what 1.2 did.
This breaks Mocha PhantomJS tests of Webpacked Q since it then tries to use
`requestTick = setImmediate.bind(window, flush);` with an undefined .bind.
Until this is resolved, we have to stick with the older Q. PhantomJS 1.9.16
defines a process [Object object] and a nextTick function. 
    
## Code Coverage

If you are using test driven development rather than writing all your tests
after your code has lumbered into life, its easy to keep your coverage numbers
up. I almost always end up writing most of my test cases after I've gotten
a lot of code to work, but you may be more disciplined.

We want to keep coverage well above 90% overall and 100% for critical
components. Check the current coverage using:

    MOCKSOCK=true
    npm run coverage
    
This runs the **istanbul** code coverage tool against the Mocha test suite.
The `mocksock=true` runs an in-process version of the server during testing.
You should look at the `.\logs\_mocha-yymmdd.log` file to see the interaction
between the mock server and the test client. 

To get the fullest code coverage you should:

- Make sure you have shutdown any other server you have running first or it
will fail. 
- Make sure that `mochaConsoleMute` is false or omitted in 
`./config/_mocha.config` (or other config files), otherwise the console
output routines will be suppressed which limits test coverage.
- Make sure that your **MongoDB** service is up and running or you will get
only `FileProvider` coverage.

You can examine the annotated source by browsing to `./coverage/lcov-report/index.html`
or run

    gulp showcoverage
    
Don't be shy about addng test cases, but if code such as an error case is
too difficult to mock properly, then add an `/* istanbul ignore if */` or
equivalent **after** inspecting the code extremely carefully. If at all
possible, test the uncovered code using a one-off test program and then
add a comment next to your `/* istanbul ignore ... */` that notes that
the testing was done. 

It is alarming how often uncovered code ends up being the source of the
exception that crashes the server, disables the client, or corrupts the data.

    
## Persistent Data

mMeddle uses four forms of read/write persistent data:

- MongoDB Database storage : primary storage mechanism
- Filesystem storage : available for testing and fallback
- Client remote storage : browser & clients to the server
- LocalStorage : used by browser clients and emulated for Node.js clients

The first is a MongoDB database.  You should install one locally; see
[MongoDB server](https://www.mongodb.org/downloads) . The server will look
for a database using the `./sal/MongoDBProvider'.  You can inspect the
contents of the MongoDB using its `Mongo` client application, but it is
a bit painful.

The second is the filesystem itself. If your mongoDB database cannot be
found then IO will be to the file system. Most, if not all, functions which
currently use the database can be accomplished using the `./sal/FileProvider`.
The file system is slower and does not scale well, but has the great advantage
that it is really easy to look at the JSON files produced and see whats
going on. I do most early debugging with the database turned off.

The third is really just the remote form of the first two. When logged into
a server, client storage operations are remoted by the `./sal/ClientProvider`.
The storage operations are funneled through the workspace connection 
socket to the corresponding session on the server.

The last is `localStorage` in the browser to maintain session information.
Node.js client applications use a simulated form of localStorage which is
saved to the `./storage/localStorage/[app]` directory. See `./sal/LocalStorage`.
The practical limit of localStorage is 2.5 million characters per domain so
we need to be careful to not extend our local requirements to anything like
that number.


## Cloud Build Automation

The [github/mmeddle][github-mm-url] repository is linked
to the [Travis-CI/mmeddle][travis-url] service. Every commit
pushed to the **master** branch triggers an npm install and cloud build of the 
default **npm test** (gulp test task). When this succeeds **npm run coverage** is run,
and the new code coverage statistics are pushed to
[coveralls/mmeddle][coveralls-url]. See the `./.travis.yml` file for this.

The build and code coverage push update the little badges in the upper left 
corner of the README.md in the project root. These should of course stay green.

mMeddle is currently hosted at RedHat's OpenShift node.js service at
[openShift/mmeddle][openshift-mm-url]. 
This hosts a MongoDB database for the test service. This database is firewalled
and can't be accessed from outside, although you can ssh to the server and
run the mongo cli from the shell.

We are currently not automatically pushing *mMeddle* to the test service, so I
do that when I'm happy with the current state of the build. At some point we can
turn on automatic pushing directly from [Travis-CI](https://travis-ci.org) since
it has built-in OpenShift support.
 
For most testing we use a globally accessible MongoDB
test database at [MongoLab](https://mongolab.com/) 
named [`mmSpace`][mongolab-mmSpace].  
This is accessed using a connection URL or mongo CLI that looks a lot like:

    mongodb://<dbuser>:(<dbpassword>)@ds061621.mongolab.com:61621/mmspace
    mongo ds061621.mongolab.com:61621/mmspace -u <dbuser> -p <dbpassword>

Contact me at [johnhenryfogarty@gmail.com](mailto:johnhenryfogarty@gmail.com)
once you have a commit under your belt if you need access to the test database.
The database is small (limited to 500MB) and I can't  guarantee any
kind of stabiliy to its structure or contents for some time to come.
    
## Documentation

API Documentation is mostly generated from the source using jsdoc tags throughout
the code. The task to build the docs is:

    gulp docs

Each `./src` directory contains its own **README.md** markdown document which
provides a **short** overview on the structure and use of the source in broad 
terms. This should not restate the jsdoc and should try not be more than a
page long. 

The generated docs can be accessed via [../api/index.html](../api/index.html)
(if you have built them locally and this MD is local), or from the
[OpenShift mMeddle Server][openshift-mm-api-url].

Set the environment variable: **MMEDDLE_DOCS** to false to skip API document
generation.

## Debugging

Sometimes you've got no choice.

I rely on five mechanisms for debugging beyond stack trace failures.
 These are:
 
- Add more detailed unit tests until the problem is obvious. This has the
advantage of leaving around a useful retest in case the problem shows up
again. I also write special one of a kind micro apps when the unit test
framework is too annoying.
Use node-inspector for debugging the server (and other node applications).
- Examine the `./logs`. The server, cli, mochatests and mockServer produce
logs for each mm.log.debug output. This is the best way to add 'write
statements' to your code. Each day these apps start a new log file.
- Use the CLI backtick operator to view javascript objects on the console.
You can also use **\`mm.log.debug [obj]** to output objects directly to the
cli log file. You need a **administrator: true,** line in your 
**./config/user-[alias].config** to enable use of this command.
- Use the Firefox Firebug test environment for browser debugging. This
is quite good with the webcli, and not bad with AngularJS apps.
- Use node-inspector for debugging the server (and other node applications).


### Debugging Unit Tests

I debug unit tests for node using node-inspector on Chrome on a Windows system, so your experience may differ.  Start `node-inspector` in its own shell and leave it running, then:

    node-debug --debug-brk node_modules\mocha\bin\_mocha -u bdd -r should

The `_mocha` selects the *real* .js file for the mocha engine, instead of the stub that launches a separate test process. Note that there are a lot of checked exceptions thrown and there is a timer used by mocha that may annoy you. Often it is easier to just debug an scratch function without having the Mocha infrastructure getting in the way.

**Note:** My console log always starts with the message:
> Error: Injection failed: no require in current frame

I ignore this but, nothing bad seems to happen. This may be related to 
[node-inspector broken](https://github.com/node-inspector/node-inspector) : 
(*Node Inspector is currently broken on Node >= v0.11.14*)
since I am currently debugging under node 0.12.0. It is flakey, but usually
gets the job done. Good luck.

![Node Inspector Screen Capture](../images/dev/BrowserMocha-NodeInspectorDebug.jpg)

### Debugging Browser Unit Tests

Debugging for the browser consists of opening `test\testMocha.html` under your favorite browser and using its script debugging tools. I prefer **Mozilla Firefox** with the **Firebug console** add-in. Don't forget to run the **gulp bundle** task first or you will be debugging an old version (I've never done that).

The Mocha page is nice in that you can select and drill down into test suites anmd rerun the tests individually. Clicking a test's **it()** text shows the source of the test.

## Windows Development (sigh)

I write code on Windows and need to keep the development environment Windows friendly (or
at least no more unfriendly than necessary). 

In **git config** if you use Windows, you should set

    git config core.autocrlf input

The files in the repository should not contain CRLF endings, and you should use an
editor on Windows that doesn't put them on by default (I use Notepad++).

I use **gulp** and put some effort into making sure that any scripts are equivalent
on Windows and *nix versions. The Travis-CI integration service helps with this.

### Windows and file paths longer than 255 characters

Incredibly in the year 2015, Windows still has many problems with paths that
are longer than 255 characters. Such paths are not uncommon when installing
node_modules - especially ones for `gulp` or `grunt` tools that rely on
lots of other modules. Usually this does not cripple you, but will have to
do stupid things in order to remove such directories since normal windows
commands fail. Be afraid.

## Possibly Helpful Notes

### Windows Node 0.12.0

On Windows `Node 0.12.0` is not completely stable. You will need to install
at least the Community edition of Visual Studio 2013 in order to allow
rebuilds of Buffer and Validate which will be required by installation of
many modules. 

You can also expect that many modules will complain about `fsevents`
and an occasionaly outright compilation failures due to C++ core class 
changes. You can work around these but it is a big pain.

You may save some pain by using `Node 0.10.38` instead. This is what I am 
currently doing, but I use `NVM` to test under 0.12.0 before I do a checkin.  

### Windows Node 0.12.0 and socket.io incompatibility

This annoying problem currently (Apr 2015) does not allow the latest
socket.io to install without a NanSymbol deprecated error during the
windows compilation. Let this finish then:

    cd node_modules\socket.io\node_modules\engine.io\node_modules
    npm install ws@latest
    
This is ugly but works fine and lets Windows development continue.

Also note that currently we are stuck on **Socket.io-0.9.16** until someone
has the time and smarts to get **CORS** (Cross-Origin Resource Sharing)
working with localhost in **Socket-1.3.6** or whatever is current when we
get around to it.

### Relaxing Firefox localhost file access

In Firefox go to the fake URL **about:config**.  Promise to be careful.
Change **security.fileuri.strict_origin_policy** to false.

### Relaxing Chrome localhost file access

From the command line (in the chrome installation directory):

    chrome --allow-file-access-from-files
    
### NodeJS Testing of Equation Graphics

`MNode` objects draw to `DisplayContext` objects. The gmDC can be used
for testing on Node as long as you have independently installed
[`GraphicsMagick`][graphicsMagick-url] or [`ImageMagick`][imageMagick-url].
This creates .png files as the result of performing expression `.render()`
operations. You will need to enable this by setting 

    displayContext: 'gm'

in an appropriate config.json file.

I've been using only ImageMagick. To verify it is installed correctly
you should be able to see its version from the command line. For example:

    C:\jf\_mMeddle\_mm>convert --version
    Version: ImageMagick 6.9.1-2 Q16 x64 2015-04-14 http://www.imagemagick.org
    Copyright: Copyright (C) 1999-2015 ImageMagick Studio LLC
    License: http://www.imagemagick.org/script/license.php
    Features: DPC Modules OpenMP
    Delegates (built-in): bzlib cairo freetype jbig jng jp2 jpeg lcms lqr openexr pangocairo png ps rsvg tiff webp xml zlib

You will note this is running on Windows, but of course its easier on almost
any other OS.

    
## The End
If you're here, perhaps you've already found errors in this document or
in mMeddle. Don't be shy - you can fix this.
    Thanks, **JF**
