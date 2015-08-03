# mmeddle 
[![Build Status][travis-image]][travis-url] 
[![Coveralls Status][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]

[npm-url]: https://www.npmjs.com/package/mmeddle
[npm-image]: https://badge.fury.io/js/mmeddle.svg
[travis-url]: https://travis-ci.org/jfogarty/mmeddle
[travis-image]: https://img.shields.io/travis/jfogarty/mmeddle.svg?branch=master
[coveralls-url]: https://coveralls.io/r/jfogarty/mmeddle
[coveralls-image]: https://img.shields.io/coveralls/jfogarty/mmeddle.svg
[depstat-url]: https://david-dm.org/jfogarty/mmeddle
[depstat-image]: https://david-dm.org/jfogarty/mmeddle.svg

[openshift-mm-url]: http://mmeddle-jfogarty.rhcloud.com
[openshift-mm-bvt-url]: http://mmeddle-jfogarty.rhcloud.com/test/testMocha.html
[openshift-mm-api-url]: http://mmeddle-jfogarty.rhcloud.com/api/index.html

A symbolic math workspace for browsers and Node.js. It features pluggable types, operators, units, and functions.

![backgound math art](images/art/mathart1.jpg)

##NOT READY FOR PRIME TIME

When an alpha release is available I'll remove this message.
For the next few months this project is closed to external developers.

**Please stand by...**

mMeddle provides a community service for engineers, scientists, students and
teachers to work with and share mathematical problems, definitions and
solutions. It focuses on symbolic algebraic math with integration of units,
dimensions, and other elements to assist users in solving real world
problems. Users can easily develop and document solutions to share with 
others as live mathematics rather than dead symbols on a page.

## Features
* Follows [semantic versioning](http://semver.org/) for releases

## Projected Features (smoke and mirrors)
* Lazy symbolic evaluation
* Algebraic transforms and substitutions for expression and equation evolution
* Dimensional analysis and validation across all levels of each expression
* Workspace composition that incorporates other live math documents
* Integer, Real, Complex, Vector, Matrix, Tensor and Logic type system plugins
* Operators with rules of replacement and inference (assoc, comm, dist, elimination, etc.)
* Plugins for SI and US Customary unit systems
* Implicit unit conversions to common base dimensions (including affine transforms)
* LaTex and mmeddle format symbolic expression entry
* MathML and LaTex math format outputs for document ready math
* Constants expression evaluations retain symbolic products
* Numeric evaluations retain rational forms (symbols * numerator/denominator)
* 100% undo/redo for every document, section, expression change

[Contributors](CONTRIBUTING.md)

[Developers](docs/DEVELOPERS.md)

[The current mMeddle test server (OpenShift hosted)][openshift-mm-url]

[The current API (OpenShift hosted)][openshift-mm-api-url]

#### End of document.
