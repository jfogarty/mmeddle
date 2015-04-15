# mMeddle Developer's Guide
[![Build Status](https://travis-ci.org/jfogarty/mmeddle.svg?branch=master)](https://travis-ci.org/jfogarty/mmeddle)
[![Coverage Status](https://coveralls.io/repos/jfogarty/mmeddle/badge.svg)](https://coveralls.io/r/jfogarty/mmeddle)

[https://github.com/jfogarty/mmeddle](https://github.com/jfogarty/mmeddle)

![backgound math art](../images/art/mathart2.png)

`mmeddle.js` is a symbolic math workspace for browsers and Node.js. It features pluggable types, operators, units, and functions.

# mMeddle IS NOT YET OPEN FOR DEVELOPMENT
# move along please, these aren't the droids you're looking for...

This library is the headless workhorse for maintaining *mMeddle* documents, 
and performing symbolic math operations. It runs in backend servers as
an **Express** application using a **MongoDB** database for primary storage. 
The same engine runs in browsers as a minified script as part of the *mMeddler*
SPA (single page application).

## That Vision Thing

The grand plan (or pipe dream) is for *mMeddle* to become a community service
which loads the *mMeddler* SPA user interface to client pads and computers.
*mMeddler* users will write their own math-based documents using standard
mathematical notations, manipulate equations using drag and drop based symbolic
algebra, and produce numerical results in the form of values, graphs and tables.

The backend service will maintain a cloud of private and public symbolic math
documents organized by scientific, engineering, mathematical, and pedegogical topics.
Math inclined programmers will extend the nature of the maths that we can handle,
while subject matter experts will publish and edit live documents containing equations, expanations, problems, and solutions. Student, teachers, geeks and the strangely
curious will have access to a level of math that has mostly been out of reach
through layers of technical barriers. A golden age will flourish and all world problems
will be solved as a direct result of your hard work on this bucket of code. 

## Structure

*mMeddle* is structured as a single main module `mmeddle` which contains bindings
between the other modules. Modules within sub-directories usually contain no
*requires* statements unless they are to a node_module (preferably one which
is in some way unique to a single module) or to a sub-directory from the one containing
the module. `require("..\[a modulename]")` is avoided if at all possible.

Isolating the bindings between modules to a single outer level module greatly eases
restructuring and module substitution for the various environments in which mmeddle
must run.

## Building

Gulp and a `gulpfile.js` provide the build and test environment:

    gulp
    
This runs the gulpfile.js `default` task which performs verification tests,
then builds and packages the various forms of the library.

The build steps are currently:

Task | Description
---- | -----------
**test** | do the node.js Mocha BDD BVTs tests using a mock SAL (service abstraction layer)
**lint** | jshint the source using `.jshintrc` rules
**clean** | delete the `./dist` directory contents
**bundle** | **WebPack** the client for use in a browser
**minify** | make a .min version for reasonable load times
**testb** | run the browser BVTs using a **PhantomJS** headless browser

## Testing

Testing is primariy done with a set of **Mocha** tests using the **BDD** (behavior
driven development) style. Developers are strongly encouraged to use this style
for their own tests. All integrations require passing tests.

To run the **BVT**s (base verification tests) use:

    gulp test
    
During development continuous tests on every source change is enabled with:

    gulp watch

Every test **.js** source file must start with a `test.` prefix.  
    
### Code Coverage

If you are using test driven development rather than writing all your tests
after your code has lumbered into life, its easy to keep your coverage numbers
up. Check the current coverage using:

    gulp coverage
    
This runs the **istanbul** code coverage tool against the Mocha test suite.  You can
examine the annotated source by browsing to `./coverage/lcov-report/index.html` or run

    gulp showcoverage
    
We want our code coverage numbers over **90%**, so don't be shy about addng test cases.
    
### Testing With Persistent Data

You'll probably quickly get tired of testing without any persistent data. The next step
is to enable the local filesystem Storage SAL plugin: `storageFs`. When that gets old, install
a [MongoDB server](https://www.mongodb.org/downloads) and enable the `storageMongoDB` Storage
SAL plugin.


## Cloud Build Automation

The [github/mmeddle](https://github.com/jfogarty/mmeddle) repository is linked
to the [Travis-CI/mmeddle](https://travis-ci.org/jfogarty/mmeddle) service. Every commit
pushed to the **master** branch triggers an npm install and cloud build of the 
default **npm test** (gulp test task). When this succeeds **gulp coverage** is run,
and the new code coverage statistics are pushed to
[coveralls/mmeddle](https://coveralls.io/r/jfogarty/mmeddle). The build and code
coverage push update the little badges in the upper left corner of the README.md in
the project root. These should of course stay green.

mMeddle is currently hosted at RedHat's OpenShift node.js service at
[openShift/mmeddle](http://mmeddle-jfogarty.rhcloud.com/). 
This hosts a MongoDB database for the test service. This database is firewalled and
cannot be accessed from outside. 

We are currently not automatically pushing *mMeddle* to the test service, so I
do that when I'm happy with the current state of the build. At some point we can
turn on automatic pushing directly from [Travis-CI](https://travis-ci.org) since
it has built-in OpenShift support.
 
For most testing we use a globally accessible MongoDB
test database at [MongoLab](https://mongolab.com/) 
named [`mmSpace`](https://mongolab.com/databases/mmspace).  
This is accessed using a connection URL or mongo CLI that looks a lot like:

    mongodb://<dbuser>:(<dbpassword>)@ds061621.mongolab.com:61621/mmspace
    mongo ds061621.mongolab.com:61621/mmspace -u <dbuser> -p <dbpassword>

Contact me at [johnhenryfogarty@gmail.com](mailto:johnhenryfogarty@gmail.com)
once you have a commit under your belt if you need access to the test database.
The database is small (limited to 500MB) and I can't  guarantee any
kind of stabiliy to its structure or contents for some time to come.
    
## Documentation

Documentation is mostly generated from the source using jsdoc tags throughout
the code. The task to build the docs is:

    gulp docs

Each `./src` directory contains its own **README.md** markdown document which
provides a **short** overview on the structure and use of the source in broad terms.
This should not restate the jsdoc and should try not be more than a page long. 
