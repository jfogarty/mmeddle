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

A symbolic math workspace for browsers and Node.js. It features pluggable types, operators, units, and functions.

![backgound math art](images/art/mathart1.jpg)

##NOT READY FOR PRIME TIME

When an alpha release is available I'll remove this message.
For the next few months this project is closed to external developers.

**Please stand by...**

## Features
* Follows [semantic versioning](http://semver.org/) for releases

## Projected Features (smoke and mirrors)
* Lazy symbolic evaluation
* Algebraic transforms and substitutions for expression and equation evolution
* Dimensional analysis and validation across all levels of each expression
* Workspace composition that incorporates other live math documents
* Integer, Real, Complex, Vector, Matrix, Tensor and Logic type system plugins
* Operators with rules of repacement and inference (assoc, comm, dist, elmination, etc.)
* Plugins for SI and US Customary unit systems
* Implicit unit conversions to common base dimensions (including affine transforms)
* LaTex and mmeddle format symbolic expression entry
* MathML and LaTex math format outputs for document ready math
* Constants expression evalautions retain symbolic products
* Numeric evaluations retain rational forms (symbols * numerator/denominator)
* 100% undo/redo for every document, section, expression change

[Contributors](CONTRIBUTING.md)

[Developers](docs/DEVELOPERS.md)

[The API is generated into ./api/index.html](api/index.html)

#### End of document.
