/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/fmin/build/fmin.js":
/*!*****************************************!*\
  !*** ./node_modules/fmin/build/fmin.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
     true ? factory(exports) :
    undefined;
}(this, function (exports) { 'use strict';

    /** finds the zeros of a function, given two starting points (which must
     * have opposite signs */
    function bisect(f, a, b, parameters) {
        parameters = parameters || {};
        var maxIterations = parameters.maxIterations || 100,
            tolerance = parameters.tolerance || 1e-10,
            fA = f(a),
            fB = f(b),
            delta = b - a;

        if (fA * fB > 0) {
            throw "Initial bisect points must have opposite signs";
        }

        if (fA === 0) return a;
        if (fB === 0) return b;

        for (var i = 0; i < maxIterations; ++i) {
            delta /= 2;
            var mid = a + delta,
                fMid = f(mid);

            if (fMid * fA >= 0) {
                a = mid;
            }

            if ((Math.abs(delta) < tolerance) || (fMid === 0)) {
                return mid;
            }
        }
        return a + delta;
    }

    // need some basic operations on vectors, rather than adding a dependency,
    // just define here
    function zeros(x) { var r = new Array(x); for (var i = 0; i < x; ++i) { r[i] = 0; } return r; }
    function zerosM(x,y) { return zeros(x).map(function() { return zeros(y); }); }

    function dot(a, b) {
        var ret = 0;
        for (var i = 0; i < a.length; ++i) {
            ret += a[i] * b[i];
        }
        return ret;
    }

    function norm2(a)  {
        return Math.sqrt(dot(a, a));
    }

    function scale(ret, value, c) {
        for (var i = 0; i < value.length; ++i) {
            ret[i] = value[i] * c;
        }
    }

    function weightedSum(ret, w1, v1, w2, v2) {
        for (var j = 0; j < ret.length; ++j) {
            ret[j] = w1 * v1[j] + w2 * v2[j];
        }
    }

    /** minimizes a function using the downhill simplex method */
    function nelderMead(f, x0, parameters) {
        parameters = parameters || {};

        var maxIterations = parameters.maxIterations || x0.length * 200,
            nonZeroDelta = parameters.nonZeroDelta || 1.05,
            zeroDelta = parameters.zeroDelta || 0.001,
            minErrorDelta = parameters.minErrorDelta || 1e-6,
            minTolerance = parameters.minErrorDelta || 1e-5,
            rho = (parameters.rho !== undefined) ? parameters.rho : 1,
            chi = (parameters.chi !== undefined) ? parameters.chi : 2,
            psi = (parameters.psi !== undefined) ? parameters.psi : -0.5,
            sigma = (parameters.sigma !== undefined) ? parameters.sigma : 0.5,
            maxDiff;

        // initialize simplex.
        var N = x0.length,
            simplex = new Array(N + 1);
        simplex[0] = x0;
        simplex[0].fx = f(x0);
        simplex[0].id = 0;
        for (var i = 0; i < N; ++i) {
            var point = x0.slice();
            point[i] = point[i] ? point[i] * nonZeroDelta : zeroDelta;
            simplex[i+1] = point;
            simplex[i+1].fx = f(point);
            simplex[i+1].id = i+1;
        }

        function updateSimplex(value) {
            for (var i = 0; i < value.length; i++) {
                simplex[N][i] = value[i];
            }
            simplex[N].fx = value.fx;
        }

        var sortOrder = function(a, b) { return a.fx - b.fx; };

        var centroid = x0.slice(),
            reflected = x0.slice(),
            contracted = x0.slice(),
            expanded = x0.slice();

        for (var iteration = 0; iteration < maxIterations; ++iteration) {
            simplex.sort(sortOrder);

            if (parameters.history) {
                // copy the simplex (since later iterations will mutate) and
                // sort it to have a consistent order between iterations
                var sortedSimplex = simplex.map(function (x) {
                    var state = x.slice();
                    state.fx = x.fx;
                    state.id = x.id;
                    return state;
                });
                sortedSimplex.sort(function(a,b) { return a.id - b.id; });

                parameters.history.push({x: simplex[0].slice(),
                                         fx: simplex[0].fx,
                                         simplex: sortedSimplex});
            }

            maxDiff = 0;
            for (i = 0; i < N; ++i) {
                maxDiff = Math.max(maxDiff, Math.abs(simplex[0][i] - simplex[1][i]));
            }

            if ((Math.abs(simplex[0].fx - simplex[N].fx) < minErrorDelta) &&
                (maxDiff < minTolerance)) {
                break;
            }

            // compute the centroid of all but the worst point in the simplex
            for (i = 0; i < N; ++i) {
                centroid[i] = 0;
                for (var j = 0; j < N; ++j) {
                    centroid[i] += simplex[j][i];
                }
                centroid[i] /= N;
            }

            // reflect the worst point past the centroid  and compute loss at reflected
            // point
            var worst = simplex[N];
            weightedSum(reflected, 1+rho, centroid, -rho, worst);
            reflected.fx = f(reflected);

            // if the reflected point is the best seen, then possibly expand
            if (reflected.fx < simplex[0].fx) {
                weightedSum(expanded, 1+chi, centroid, -chi, worst);
                expanded.fx = f(expanded);
                if (expanded.fx < reflected.fx) {
                    updateSimplex(expanded);
                }  else {
                    updateSimplex(reflected);
                }
            }

            // if the reflected point is worse than the second worst, we need to
            // contract
            else if (reflected.fx >= simplex[N-1].fx) {
                var shouldReduce = false;

                if (reflected.fx > worst.fx) {
                    // do an inside contraction
                    weightedSum(contracted, 1+psi, centroid, -psi, worst);
                    contracted.fx = f(contracted);
                    if (contracted.fx < worst.fx) {
                        updateSimplex(contracted);
                    } else {
                        shouldReduce = true;
                    }
                } else {
                    // do an outside contraction
                    weightedSum(contracted, 1-psi * rho, centroid, psi*rho, worst);
                    contracted.fx = f(contracted);
                    if (contracted.fx < reflected.fx) {
                        updateSimplex(contracted);
                    } else {
                        shouldReduce = true;
                    }
                }

                if (shouldReduce) {
                    // if we don't contract here, we're done
                    if (sigma >= 1) break;

                    // do a reduction
                    for (i = 1; i < simplex.length; ++i) {
                        weightedSum(simplex[i], 1 - sigma, simplex[0], sigma, simplex[i]);
                        simplex[i].fx = f(simplex[i]);
                    }
                }
            } else {
                updateSimplex(reflected);
            }
        }

        simplex.sort(sortOrder);
        return {fx : simplex[0].fx,
                x : simplex[0]};
    }

    /// searches along line 'pk' for a point that satifies the wolfe conditions
    /// See 'Numerical Optimization' by Nocedal and Wright p59-60
    /// f : objective function
    /// pk : search direction
    /// current: object containing current gradient/loss
    /// next: output: contains next gradient/loss
    /// returns a: step size taken
    function wolfeLineSearch(f, pk, current, next, a, c1, c2) {
        var phi0 = current.fx, phiPrime0 = dot(current.fxprime, pk),
            phi = phi0, phi_old = phi0,
            phiPrime = phiPrime0,
            a0 = 0;

        a = a || 1;
        c1 = c1 || 1e-6;
        c2 = c2 || 0.1;

        function zoom(a_lo, a_high, phi_lo) {
            for (var iteration = 0; iteration < 16; ++iteration) {
                a = (a_lo + a_high)/2;
                weightedSum(next.x, 1.0, current.x, a, pk);
                phi = next.fx = f(next.x, next.fxprime);
                phiPrime = dot(next.fxprime, pk);

                if ((phi > (phi0 + c1 * a * phiPrime0)) ||
                    (phi >= phi_lo)) {
                    a_high = a;

                } else  {
                    if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
                        return a;
                    }

                    if (phiPrime * (a_high - a_lo) >=0) {
                        a_high = a_lo;
                    }

                    a_lo = a;
                    phi_lo = phi;
                }
            }

            return 0;
        }

        for (var iteration = 0; iteration < 10; ++iteration) {
            weightedSum(next.x, 1.0, current.x, a, pk);
            phi = next.fx = f(next.x, next.fxprime);
            phiPrime = dot(next.fxprime, pk);
            if ((phi > (phi0 + c1 * a * phiPrime0)) ||
                (iteration && (phi >= phi_old))) {
                return zoom(a0, a, phi_old);
            }

            if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
                return a;
            }

            if (phiPrime >= 0 ) {
                return zoom(a, a0, phi);
            }

            phi_old = phi;
            a0 = a;
            a *= 2;
        }

        return a;
    }

    function conjugateGradient(f, initial, params) {
        // allocate all memory up front here, keep out of the loop for perfomance
        // reasons
        var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            yk = initial.slice(),
            pk, temp,
            a = 1,
            maxIterations;

        params = params || {};
        maxIterations = params.maxIterations || initial.length * 20;

        current.fx = f(current.x, current.fxprime);
        pk = current.fxprime.slice();
        scale(pk, current.fxprime,-1);

        for (var i = 0; i < maxIterations; ++i) {
            a = wolfeLineSearch(f, pk, current, next, a);

            // todo: history in wrong spot?
            if (params.history) {
                params.history.push({x: current.x.slice(),
                                     fx: current.fx,
                                     fxprime: current.fxprime.slice(),
                                     alpha: a});
            }

            if (!a) {
                // faiiled to find point that satifies wolfe conditions.
                // reset direction for next iteration
                scale(pk, current.fxprime, -1);

            } else {
                // update direction using Polak–Ribiere CG method
                weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

                var delta_k = dot(current.fxprime, current.fxprime),
                    beta_k = Math.max(0, dot(yk, next.fxprime) / delta_k);

                weightedSum(pk, beta_k, pk, -1, next.fxprime);

                temp = current;
                current = next;
                next = temp;
            }

            if (norm2(current.fxprime) <= 1e-5) {
                break;
            }
        }

        if (params.history) {
            params.history.push({x: current.x.slice(),
                                 fx: current.fx,
                                 fxprime: current.fxprime.slice(),
                                 alpha: a});
        }

        return current;
    }

    function gradientDescent(f, initial, params) {
        params = params || {};
        var maxIterations = params.maxIterations || initial.length * 100,
            learnRate = params.learnRate || 0.001,
            current = {x: initial.slice(), fx: 0, fxprime: initial.slice()};

        for (var i = 0; i < maxIterations; ++i) {
            current.fx = f(current.x, current.fxprime);
            if (params.history) {
                params.history.push({x: current.x.slice(),
                                     fx: current.fx,
                                     fxprime: current.fxprime.slice()});
            }

            weightedSum(current.x, 1, current.x, -learnRate, current.fxprime);
            if (norm2(current.fxprime) <= 1e-5) {
                break;
            }
        }

        return current;
    }

    function gradientDescentLineSearch(f, initial, params) {
        params = params || {};
        var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            maxIterations = params.maxIterations || initial.length * 100,
            learnRate = params.learnRate || 1,
            pk = initial.slice(),
            c1 = params.c1 || 1e-3,
            c2 = params.c2 || 0.1,
            temp,
            functionCalls = [];

        if (params.history) {
            // wrap the function call to track linesearch samples
            var inner = f;
            f = function(x, fxprime) {
                functionCalls.push(x.slice());
                return inner(x, fxprime);
            };
        }

        current.fx = f(current.x, current.fxprime);
        for (var i = 0; i < maxIterations; ++i) {
            scale(pk, current.fxprime, -1);
            learnRate = wolfeLineSearch(f, pk, current, next, learnRate, c1, c2);

            if (params.history) {
                params.history.push({x: current.x.slice(),
                                     fx: current.fx,
                                     fxprime: current.fxprime.slice(),
                                     functionCalls: functionCalls,
                                     learnRate: learnRate,
                                     alpha: learnRate});
                functionCalls = [];
            }


            temp = current;
            current = next;
            next = temp;

            if ((learnRate === 0) || (norm2(current.fxprime) < 1e-5)) break;
        }

        return current;
    }

    exports.bisect = bisect;
    exports.nelderMead = nelderMead;
    exports.conjugateGradient = conjugateGradient;
    exports.gradientDescent = gradientDescent;
    exports.gradientDescentLineSearch = gradientDescentLineSearch;
    exports.zeros = zeros;
    exports.zerosM = zerosM;
    exports.norm2 = norm2;
    exports.weightedSum = weightedSum;
    exports.scale = scale;

}));

/***/ }),

/***/ "./src/ArrivalDepartureTime.ts":
/*!*************************************!*\
  !*** ./src/ArrivalDepartureTime.ts ***!
  \*************************************/
/*! exports provided: ArrivalDepartureTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrivalDepartureTime", function() { return ArrivalDepartureTime; });
class ArrivalDepartureTime {
    constructor(value) {
        this.value = value;
    }
    parse(offset) {
        const split = this.value.split(/([-+])/);
        return parseInt(split[offset]) * (split[offset - 1] == '-' ? -1 : 1);
    }
    get departure() {
        return this.parse(2);
    }
    get arrival() {
        return this.parse(4);
    }
}


/***/ }),

/***/ "./src/BoundingBox.ts":
/*!****************************!*\
  !*** ./src/BoundingBox.ts ***!
  \****************************/
/*! exports provided: BoundingBox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoundingBox", function() { return BoundingBox; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");

class BoundingBox {
    constructor(tl, br) {
        this.tl = tl;
        this.br = br;
    }
    static from(tl_x, tl_y, br_x, br_y) {
        return new BoundingBox(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](tl_x, tl_y), new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](br_x, br_y));
    }
    get dimensions() {
        return this.tl.delta(this.br);
    }
    isNull() {
        return this.tl == _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL || this.br == _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL;
    }
    calculateBoundingBoxForZoom(percentX, percentY) {
        const bbox = this;
        const delta = bbox.dimensions;
        const relativeCenter = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](percentX / 100, percentY / 100);
        const center = bbox.tl.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](delta.x * relativeCenter.x, delta.y * relativeCenter.y));
        const edgeDistance = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](delta.x * Math.min(relativeCenter.x, 1 - relativeCenter.x), delta.y * Math.min(relativeCenter.y, 1 - relativeCenter.y));
        const ratioPreservingEdgeDistance = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](edgeDistance.y * delta.x / delta.y, edgeDistance.x * delta.y / delta.x);
        const minimalEdgeDistance = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](Math.min(edgeDistance.x, ratioPreservingEdgeDistance.x), Math.min(edgeDistance.y, ratioPreservingEdgeDistance.y));
        return new BoundingBox(center.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](-minimalEdgeDistance.x, -minimalEdgeDistance.y)), center.add(minimalEdgeDistance));
    }
}


/***/ }),

/***/ "./src/GenericTimedDrawable.ts":
/*!*************************************!*\
  !*** ./src/GenericTimedDrawable.ts ***!
  \*************************************/
/*! exports provided: GenericTimedDrawable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericTimedDrawable", function() { return GenericTimedDrawable; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Zoomer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Zoomer */ "./src/Zoomer.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");



class GenericTimedDrawable {
    constructor(adapter) {
        this.adapter = adapter;
        this.from = this.adapter.from;
        this.to = this.adapter.to;
        this.name = this.adapter.name;
        this.boundingBox = this.adapter.boundingBox;
    }
    draw(delay, animate) {
        const zoomer = new _Zoomer__WEBPACK_IMPORTED_MODULE_1__["Zoomer"](this.boundingBox);
        zoomer.include(this.getZoomedBoundingBox(), _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG, _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG, true, true, false);
        this.adapter.draw(delay, this.adapter.from.delta(this.adapter.to), zoomer.center, zoomer.scale);
        return 0;
    }
    erase(delay, animate, reverse) {
        this.adapter.erase(delay);
        return 0;
    }
    getZoomedBoundingBox() {
        const bbox = this.adapter.boundingBox;
        const center = this.adapter.zoom;
        if (center != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            const zoomBbox = bbox.calculateBoundingBoxForZoom(center.x, center.y);
            return zoomBbox;
        }
        return bbox;
    }
}
GenericTimedDrawable.LABEL_HEIGHT = 12;


/***/ }),

/***/ "./src/Gravitator.ts":
/*!***************************!*\
  !*** ./src/Gravitator.ts ***!
  \***************************/
/*! exports provided: Gravitator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gravitator", function() { return Gravitator; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");


//const mathjs = require('mathjs');
const fmin = __webpack_require__(/*! fmin */ "./node_modules/fmin/build/fmin.js");
class Gravitator {
    constructor(stationProvider) {
        this.stationProvider = stationProvider;
        this.initialWeightFactors = {};
        this.initialAngles = [];
        this.angleFPrime = {};
        this.averageEuclidianLengthRatio = -1;
        this.edges = {};
        this.vertices = {};
        this.dirty = false;
    }
    gravitate(delay, animate) {
        if (!this.dirty)
            return delay;
        this.dirty = false;
        this.initialize();
        this.initializeGraph();
        const solution = this.minimizeLoss();
        this.assertDistances(solution);
        return this.moveStationsAndLines(solution, delay, animate);
    }
    initialize() {
        const weights = this.getWeightsSum();
        const euclidian = this.getEuclidianDistanceSum();
        console.log('weights:', weights, 'euclidian:', euclidian);
        if (this.averageEuclidianLengthRatio == -1 && Object.values(this.edges).length > 0) {
            this.averageEuclidianLengthRatio = weights / euclidian;
            console.log('averageEuclidianLengthRatio^-1', 1 / this.averageEuclidianLengthRatio);
            //this.initializeAngleGradients();
        }
    }
    /*private initializeAngleGradients() {
        const expression = '(acos(((b_x-a_x)*(b_x-c_x)+(b_y-a_y)*(b_y-c_y))/(sqrt((b_x-a_x)^2+(b_y-a_y)^2)*sqrt((b_x-c_x)^2+(b_y-c_y)^2)))*((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x))/abs(((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x)))-const)';
        const f = mathjs.parse(expression);
        this.angleF = f.compile();

        const fDelta = mathjs.parse(expression + '^2');

        const vars = ['a_x', 'a_y', 'b_x', 'b_y', 'c_x', 'c_y'];
        for (let i=0; i<vars.length; i++) {
            this.angleFPrime[vars[i]] = mathjs.derivative(fDelta, vars[i]).compile();
        }
    }*/
    getWeightsSum() {
        let sum = 0;
        for (const edge of Object.values(this.edges)) {
            sum += edge.weight || 0;
        }
        return sum;
    }
    getEuclidianDistanceSum() {
        let sum = 0;
        for (const edge of Object.values(this.edges)) {
            sum += this.edgeVector(edge).length;
        }
        return sum;
    }
    edgeVector(edge) {
        return this.vertices[edge.termini[1].stationId].station.baseCoords.delta(this.vertices[edge.termini[0].stationId].station.baseCoords);
    }
    initializeGraph() {
        for (const [key, edge] of Object.entries(this.edges)) {
            if (this.initialWeightFactors[key] == undefined) {
                this.initialWeightFactors[key] = Gravitator.INITIALIZE_RELATIVE_TO_EUCLIDIAN_DISTANCE
                    ? 1 / this.averageEuclidianLengthRatio
                    : this.edgeVector(edge).length / (edge.weight || 0);
                //this.addInitialAngles(edge);
            }
        }
        let i = 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.index = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](i, i + 1);
            i += 2;
        }
    }
    addInitialAngles(edge) {
        for (const adjacent of Object.values(this.edges)) {
            if (adjacent == edge) {
                continue;
            }
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    if (edge.termini[i].stationId == adjacent.termini[j].stationId) {
                        const angle = this.threeDotAngle(this.vertices[edge.termini[i ^ 1].stationId].station.baseCoords, this.vertices[edge.termini[i].stationId].station.baseCoords, this.vertices[adjacent.termini[j ^ 1].stationId].station.baseCoords);
                        this.initialAngles.push({
                            aStation: edge.termini[i ^ 1].stationId,
                            commonStation: edge.termini[i].stationId,
                            bStation: adjacent.termini[j ^ 1].stationId,
                            angle: angle
                        });
                        return;
                    }
                }
            }
        }
        //derive arccos(((a-c)*(e-g)+(b-d)*(f-h))/(sqrt((a-c)^2+(b-d)^2)*sqrt((e-g)^2+(f-h)^2)))*((f-h)*(a-c)-(b-d)*(e-g))/|((f-h)*(a-c)-(b-d)*(e-g))|
        //derive acos(((b_x-a_x)*(b_x-c_x)+(b_y-a_y)*(b_y-c_y))/(sqrt((b_x-a_x)^2+(b_y-a_y)^2)*sqrt((b_x-c_x)^2+(b_y-c_y)^2)))*((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x))/abs(((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x)))
    }
    threeDotAngle(a, b, c) {
        return this.evaluateThreeDotFunction(this.angleF, a, b, c, 0);
    }
    evaluateThreeDotFunction(f, a, b, c, oldValue) {
        return f.evaluate({ a_x: a.x, a_y: a.y, b_x: b.x, b_y: b.y, c_x: c.x, c_y: c.y, const: oldValue });
    }
    minimizeLoss() {
        const gravitator = this;
        const params = { history: [] };
        const start = this.startStationPositions();
        const solution = fmin.conjugateGradient((A, fxprime) => {
            fxprime = fxprime || A.slice();
            for (let i = 0; i < fxprime.length; i++) {
                fxprime[i] = 0;
            }
            let fx = 0;
            fx = this.deltaToStartStationPositionsToEnsureInertness(fx, A, fxprime, gravitator);
            fx = this.deltaToCurrentStationPositionsToEnsureInertness(fx, A, fxprime, gravitator);
            //fx = this.deltaToAnglesToEnsureInertness(fx, A, fxprime, gravitator);
            fx = this.deltaToNewDistancesToEnsureAccuracy(fx, A, fxprime, gravitator);
            this.scaleGradientToEnsureWorkingStepSize(fxprime);
            return fx;
        }, start, params);
        return solution.x;
    }
    startStationPositions() {
        const start = [];
        for (const vertex of Object.values(this.vertices)) {
            start[vertex.index.x] = vertex.startCoords.x;
            start[vertex.index.y] = vertex.startCoords.y;
        }
        return start;
    }
    deltaX(A, vertices, termini) {
        return A[vertices[termini[0].stationId].index.x] - A[vertices[termini[1].stationId].index.x];
    }
    deltaY(A, vertices, termini) {
        return A[vertices[termini[0].stationId].index.y] - A[vertices[termini[1].stationId].index.y];
    }
    deltaToStartStationPositionsToEnsureInertness(fx, A, fxprime, gravitator) {
        for (const vertex of Object.values(gravitator.vertices)) {
            fx += (Math.pow(A[vertex.index.x] - vertex.startCoords.x, 2) +
                Math.pow(A[vertex.index.y] - vertex.startCoords.y, 2)) * Gravitator.INERTNESS;
            fxprime[vertex.index.x] += 2 * (A[vertex.index.x] - vertex.startCoords.x) * Gravitator.INERTNESS;
            fxprime[vertex.index.y] += 2 * (A[vertex.index.y] - vertex.startCoords.y) * Gravitator.INERTNESS;
        }
        return fx;
    }
    deltaToCurrentStationPositionsToEnsureInertness(fx, A, fxprime, gravitator) {
        for (const vertex of Object.values(gravitator.vertices)) {
            fx += (Math.pow(A[vertex.index.x] - vertex.station.baseCoords.x, 2) +
                Math.pow(A[vertex.index.y] - vertex.station.baseCoords.y, 2)) * Gravitator.INERTNESS;
            fxprime[vertex.index.x] += 2 * (A[vertex.index.x] - vertex.station.baseCoords.x) * Gravitator.INERTNESS;
            fxprime[vertex.index.y] += 2 * (A[vertex.index.y] - vertex.station.baseCoords.y) * Gravitator.INERTNESS;
        }
        return fx;
    }
    deltaToAnglesToEnsureInertness(fx, A, fxprime, gravitator) {
        for (const pair of Object.values(gravitator.initialAngles)) {
            const a = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](A[gravitator.vertices[pair.aStation].index.x], A[gravitator.vertices[pair.aStation].index.y]);
            const b = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](A[gravitator.vertices[pair.commonStation].index.x], A[gravitator.vertices[pair.commonStation].index.y]);
            const c = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](A[gravitator.vertices[pair.bStation].index.x], A[gravitator.vertices[pair.bStation].index.y]);
            const delta = this.evaluateThreeDotFunction(this.angleF, a, b, c, pair.angle);
            fx += Math.pow(delta, 2) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.aStation].index.x] += this.evaluateThreeDotFunction(this.angleFPrime['a_x'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.aStation].index.y] += this.evaluateThreeDotFunction(this.angleFPrime['a_y'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.commonStation].index.x] += this.evaluateThreeDotFunction(this.angleFPrime['b_x'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.commonStation].index.y] += this.evaluateThreeDotFunction(this.angleFPrime['b_y'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.bStation].index.x] += this.evaluateThreeDotFunction(this.angleFPrime['c_x'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.bStation].index.y] += this.evaluateThreeDotFunction(this.angleFPrime['c_y'], a, b, c, pair.angle) * Gravitator.INERTNESS;
        }
        return fx;
    }
    deltaToNewDistancesToEnsureAccuracy(fx, A, fxprime, gravitator) {
        for (const [key, edge] of Object.entries(gravitator.edges)) {
            const v = Math.pow(this.deltaX(A, gravitator.vertices, edge.termini), 2)
                + Math.pow(this.deltaY(A, gravitator.vertices, edge.termini), 2)
                - Math.pow(gravitator.initialWeightFactors[key] * (edge.weight || 0), 2);
            fx += Math.pow(v, 2);
            fxprime[gravitator.vertices[edge.termini[0].stationId].index.x] += +4 * v * this.deltaX(A, gravitator.vertices, edge.termini);
            fxprime[gravitator.vertices[edge.termini[0].stationId].index.y] += +4 * v * this.deltaY(A, gravitator.vertices, edge.termini);
            fxprime[gravitator.vertices[edge.termini[1].stationId].index.x] += -4 * v * this.deltaX(A, gravitator.vertices, edge.termini);
            fxprime[gravitator.vertices[edge.termini[1].stationId].index.y] += -4 * v * this.deltaY(A, gravitator.vertices, edge.termini);
        }
        return fx;
    }
    scaleGradientToEnsureWorkingStepSize(fxprime) {
        for (let i = 0; i < fxprime.length; i++) {
            fxprime[i] *= Gravitator.GRADIENT_SCALE;
        }
    }
    assertDistances(solution) {
        for (const [key, edge] of Object.entries(this.edges)) {
            const deviation = Math.sqrt(Math.pow(this.deltaX(solution, this.vertices, edge.termini), 2) +
                Math.pow(this.deltaY(solution, this.vertices, edge.termini), 2)) / (this.initialWeightFactors[key] * (edge.weight || 0)) - 1;
            if (Math.abs(deviation) > Gravitator.DEVIATION_WARNING) {
                console.warn(edge.name, 'diverges by ', deviation);
            }
        }
    }
    moveStationsAndLines(solution, delay, animate) {
        const animationDurationSeconds = animate ? Math.min(Gravitator.MAX_ANIM_DURATION, this.getTotalDistanceToMove(solution) / Gravitator.SPEED) : 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.move(delay, animationDurationSeconds, new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](solution[vertex.index.x], solution[vertex.index.y]));
        }
        for (const edge of Object.values(this.edges)) {
            const coords = [this.getNewStationPosition(edge.termini[0].stationId, solution), this.getNewStationPosition(edge.termini[1].stationId, solution)];
            edge.move(delay, animationDurationSeconds, coords, this.getColorByDeviation(edge, edge.weight || 0));
        }
        delay += animationDurationSeconds;
        return delay;
    }
    getColorByDeviation(edge, weight) {
        const initialDist = this.vertices[edge.termini[0].stationId].startCoords.delta(this.vertices[edge.termini[1].stationId].startCoords).length;
        return Math.max(-1, Math.min(1, (weight - this.averageEuclidianLengthRatio * initialDist) * Gravitator.COLOR_DEVIATION));
    }
    getTotalDistanceToMove(solution) {
        let sum = 0;
        for (const vertex of Object.values(this.vertices)) {
            sum += new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](solution[vertex.index.x], solution[vertex.index.y]).delta(vertex.station.baseCoords).length;
        }
        return sum;
    }
    getNewStationPosition(stationId, solution) {
        return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](solution[this.vertices[stationId].index.x], solution[this.vertices[stationId].index.y]);
    }
    addVertex(vertexId) {
        if (this.vertices[vertexId] == undefined) {
            const station = this.stationProvider.stationById(vertexId);
            if (station == undefined)
                throw new Error('Station with ID ' + vertexId + ' is undefined');
            this.vertices[vertexId] = { station: station, index: _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, startCoords: station.baseCoords };
        }
    }
    addEdge(line) {
        if (line.weight == undefined)
            return;
        this.dirty = true;
        const id = this.getIdentifier(line);
        this.edges[id] = line;
        this.addVertex(line.termini[0].stationId);
        this.addVertex(line.termini[1].stationId);
    }
    getIdentifier(line) {
        return _Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].alphabeticId(line.termini[0].stationId, line.termini[1].stationId);
    }
}
Gravitator.INERTNESS = 100;
Gravitator.GRADIENT_SCALE = 0.000000001;
Gravitator.DEVIATION_WARNING = 0.2;
Gravitator.INITIALIZE_RELATIVE_TO_EUCLIDIAN_DISTANCE = true;
Gravitator.SPEED = 250;
Gravitator.MAX_ANIM_DURATION = 6;
Gravitator.COLOR_DEVIATION = 0.02;


/***/ }),

/***/ "./src/Instant.ts":
/*!************************!*\
  !*** ./src/Instant.ts ***!
  \************************/
/*! exports provided: Instant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instant", function() { return Instant; });
class Instant {
    constructor(_epoch, _second, _flag) {
        this._epoch = _epoch;
        this._second = _second;
        this._flag = _flag;
    }
    get epoch() {
        return this._epoch;
    }
    get second() {
        return this._second;
    }
    get flag() {
        return this._flag;
    }
    static from(array) {
        var _a;
        return new Instant(parseInt(array[0]), parseInt(array[1]), (_a = array[2]) !== null && _a !== void 0 ? _a : '');
    }
    equals(that) {
        if (this.epoch == that.epoch && this.second == that.second) {
            return true;
        }
        return false;
    }
    delta(that) {
        if (this.epoch == that.epoch) {
            return that.second - this.second;
        }
        return that.second;
    }
}
Instant.BIG_BANG = new Instant(0, 0, '');


/***/ }),

/***/ "./src/Label.ts":
/*!**********************!*\
  !*** ./src/Label.ts ***!
  \**********************/
/*! exports provided: Label */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Label", function() { return Label; });
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Rotation */ "./src/Rotation.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");


class Label {
    constructor(adapter, stationProvider) {
        this.adapter = adapter;
        this.stationProvider = stationProvider;
        this.from = this.adapter.from;
        this.to = this.adapter.to;
        this.boundingBox = this.adapter.boundingBox;
        this.children = [];
    }
    hasChildren() {
        return this.children.length > 0;
    }
    get name() {
        return this.adapter.forStation || this.adapter.forLine || '';
    }
    get forStation() {
        const s = this.stationProvider.stationById(this.adapter.forStation || '');
        if (s == undefined) {
            throw new Error('Station with ID ' + this.adapter.forStation + ' is undefined');
        }
        return s;
    }
    draw(delay, animate) {
        if (this.adapter.forStation != undefined) {
            const station = this.forStation;
            station.addLabel(this);
            if (station.linesExisting()) {
                this.drawForStation(delay, station, false);
            }
            else {
                this.adapter.erase(delay);
            }
        }
        else if (this.adapter.forLine != undefined) {
            const termini = this.stationProvider.lineGroupById(this.adapter.forLine).termini;
            termini.forEach(t => {
                const s = this.stationProvider.stationById(t.stationId);
                if (s != undefined) {
                    let found = false;
                    s.labels.forEach(l => {
                        if (l.hasChildren()) {
                            found = true;
                            l.children.push(this);
                            l.draw(delay, animate);
                        }
                    });
                    if (!found) {
                        const newLabelForStation = new Label(this.adapter.cloneForStation(s.id), this.stationProvider);
                        newLabelForStation.children.push(this);
                        s.addLabel(newLabelForStation);
                        newLabelForStation.draw(delay, animate);
                        this.children.push(newLabelForStation);
                    }
                }
            });
        }
        else {
            this.adapter.draw(delay, _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL, _Rotation__WEBPACK_IMPORTED_MODULE_0__["Rotation"].from('n'), []);
        }
        return 0;
    }
    drawForStation(delaySeconds, station, forLine) {
        const baseCoord = station.baseCoords;
        let yOffset = 0;
        for (let i = 0; i < station.labels.length; i++) {
            const l = station.labels[i];
            if (l == this)
                break;
            yOffset += Label.LABEL_HEIGHT * 1.5;
        }
        const labelDir = station.labelDir;
        yOffset = Math.sign(_Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].UNIT.rotate(labelDir).y) * yOffset - (yOffset > 0 ? 2 : 0); //TODO magic numbers
        const stationDir = station.rotation;
        const diffDir = labelDir.add(new _Rotation__WEBPACK_IMPORTED_MODULE_0__["Rotation"](-stationDir.degrees));
        const unitv = _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].UNIT.rotate(diffDir);
        const anchor = new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](station.stationSizeForAxis('x', unitv.x), station.stationSizeForAxis('y', unitv.y));
        const textCoords = baseCoord.add(anchor.rotate(stationDir)).add(new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](0, yOffset));
        this.adapter.draw(delaySeconds, textCoords, labelDir, this.children.map(c => c.adapter));
    }
    erase(delay, animate, reverse) {
        if (this.adapter.forStation != undefined) {
            this.forStation.removeLabel(this);
            this.adapter.erase(delay);
        }
        else if (this.adapter.forLine != undefined) {
            this.children.forEach(c => {
                c.erase(delay, animate, reverse);
            });
        }
        else {
            this.adapter.erase(delay);
        }
        return 0;
    }
}
Label.LABEL_HEIGHT = 12;


/***/ }),

/***/ "./src/Line.ts":
/*!*********************!*\
  !*** ./src/Line.ts ***!
  \*********************/
/*! exports provided: Line */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Line", function() { return Line; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Rotation */ "./src/Rotation.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");
/* harmony import */ var _PreferredTrack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PreferredTrack */ "./src/PreferredTrack.ts");




class Line {
    constructor(adapter, stationProvider, beckStyle = true) {
        this.adapter = adapter;
        this.stationProvider = stationProvider;
        this.beckStyle = beckStyle;
        this.from = this.adapter.from;
        this.to = this.adapter.to;
        this.name = this.adapter.name;
        this.boundingBox = this.adapter.boundingBox;
        this.weight = this.adapter.weight;
        this.precedingStop = undefined;
        this.precedingDir = undefined;
        this._path = [];
    }
    draw(delay, animate) {
        const stops = this.adapter.stops;
        const path = this._path;
        let track = new _PreferredTrack__WEBPACK_IMPORTED_MODULE_3__["PreferredTrack"]('+');
        for (let j = 0; j < stops.length; j++) {
            track = track.fromString(stops[j].trackInfo);
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error(this.name + ': Station with ID ' + stops[j].stationId + ' is undefined');
            if (path.length == 0)
                track = track.fromExistingLineAtStation(stop.axisAndTrackForExistingLine(this.name));
            stops[j].coord = this.createConnection(stop, this.nextStopBaseCoord(stops, j, stop.baseCoords), track, path, delay, animate, true);
            track = track.keepOnlySign();
        }
        let duration = this.getAnimationDuration(path, animate);
        const lineGroup = this.stationProvider.lineGroupById(this.name);
        lineGroup.addLine(this);
        this.adapter.draw(delay, duration, path, this.getTotalLength(path), lineGroup.strokeColor);
        return duration;
    }
    move(delay, animationDurationSeconds, path, colorDeviation) {
        let oldPath = this._path;
        if (oldPath.length < 2 || path.length < 2) {
            console.warn('Trying to move a non existing line');
            return;
        }
        if (oldPath.length != path.length) {
            oldPath = [oldPath[0], oldPath[oldPath.length - 1]];
            path = [path[0], path[path.length - 1]];
        }
        const lineGroup = this.stationProvider.lineGroupById(this.name);
        this.adapter.move(delay, animationDurationSeconds, this._path, path, lineGroup.strokeColor, colorDeviation);
        lineGroup.strokeColor = colorDeviation;
        this._path = path;
    }
    erase(delay, animate, reverse) {
        let duration = this.getAnimationDuration(this._path, animate);
        this.stationProvider.lineGroupById(this.name).removeLine(this);
        this.adapter.erase(delay, duration, reverse, this.getTotalLength(this._path));
        const stops = this.adapter.stops;
        for (let j = 0; j < stops.length; j++) {
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error(this.name + ': Station with ID ' + stops[j].stationId + ' is undefined');
            stop.removeLine(this);
            stop.draw(delay, animate);
            if (j > 0) {
                const helpStopId = 'h_' + _Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].alphabeticId(stops[j - 1].stationId, stops[j].stationId);
                let helpStop = this.stationProvider.stationById(helpStopId);
                if (helpStop != undefined) {
                    helpStop.removeLine(this);
                }
            }
        }
        return duration;
    }
    nextStopBaseCoord(stops, currentStopIndex, defaultCoords) {
        if (currentStopIndex + 1 < stops.length) {
            const id = stops[currentStopIndex + 1].stationId;
            const stop = this.stationProvider.stationById(id);
            if (stop == undefined)
                throw new Error(this.name + ': Station with ID ' + id + ' is undefined');
            return stop.baseCoords;
        }
        return defaultCoords;
    }
    createConnection(station, nextStopBaseCoord, track, path, delay, animate, recurse) {
        const dir = station.rotation;
        const baseCoord = station.baseCoords;
        const newDir = this.getStopOrientationBasedOnThreeStops(station, nextStopBaseCoord, dir, path);
        const newPos = station.assignTrack(newDir.isVertical() ? 'x' : 'y', track, this);
        const newCoord = station.rotatedTrackCoordinates(newDir, newPos);
        if (path.length != 0) {
            const oldCoord = path[path.length - 1];
            this.precedingDir = this.getPrecedingDir(this.precedingDir, this.precedingStop, oldCoord, newCoord);
            const stationDir = newDir.add(dir);
            const found = this.insertNode(oldCoord, this.precedingDir, newCoord, stationDir, path);
            if (!found && recurse && this.precedingStop != undefined) {
                const helpStop = this.getOrCreateHelperStop(this.precedingDir, this.precedingStop, station);
                this.precedingDir = this.precedingDir.add(new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](180));
                this.createConnection(helpStop, baseCoord, track.keepOnlySign(), path, delay, animate, false);
                return this.createConnection(station, nextStopBaseCoord, track, path, delay, animate, false);
            }
            else if (!found) {
                console.warn('path to fix on line', this.adapter.name, 'at station', station.id);
            }
            this.precedingDir = stationDir;
        }
        station.addLine(this, newDir.isVertical() ? 'x' : 'y', newPos);
        path.push(newCoord);
        delay = this.getAnimationDuration(path, animate) + delay;
        station.draw(delay, animate);
        this.precedingStop = station;
        return newCoord;
    }
    getStopOrientationBasedOnThreeStops(station, nextStopBaseCoord, dir, path) {
        var _a;
        if (path.length != 0) {
            const oldCoord = path[path.length - 1];
            return nextStopBaseCoord.delta(oldCoord).inclination().quarterDirection(dir);
        }
        const delta = station.baseCoords.delta(nextStopBaseCoord);
        const existingAxis = (_a = station.axisAndTrackForExistingLine(this.name)) === null || _a === void 0 ? void 0 : _a.axis;
        if (existingAxis != undefined) {
            const existingStopOrientiation = delta.inclination().halfDirection(dir, existingAxis == 'x' ? new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](90) : new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](0));
            if (this.precedingDir == undefined) {
                this.precedingDir = existingStopOrientiation.add(dir).add(new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](180));
            }
            return existingStopOrientiation;
        }
        return delta.inclination().quarterDirection(dir);
    }
    getPrecedingDir(precedingDir, precedingStop, oldCoord, newCoord) {
        var _a;
        if (precedingDir == undefined) {
            const precedingStopRotation = (_a = precedingStop === null || precedingStop === void 0 ? void 0 : precedingStop.rotation) !== null && _a !== void 0 ? _a : new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](0);
            precedingDir = oldCoord.delta(newCoord).inclination().quarterDirection(precedingStopRotation).add(precedingStopRotation);
        }
        else {
            precedingDir = precedingDir.add(new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](180));
        }
        return precedingDir;
    }
    insertNode(fromCoord, fromDir, toCoord, toDir, path) {
        if (!this.beckStyle) {
            return true;
        }
        const delta = fromCoord.delta(toCoord);
        const oldDirV = _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].UNIT.rotate(fromDir);
        const newDirV = _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].UNIT.rotate(toDir);
        if (delta.isDeltaMatchingParallel(oldDirV, newDirV)) {
            return true;
        }
        const solution = delta.solveDeltaForIntersection(oldDirV, newDirV);
        if (solution.a > Line.NODE_DISTANCE && solution.b > Line.NODE_DISTANCE) {
            path.push(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](fromCoord.x + oldDirV.x * solution.a, fromCoord.y + oldDirV.y * solution.a));
            return true;
        }
        return false;
    }
    getOrCreateHelperStop(fromDir, fromStop, toStop) {
        const helpStopId = 'h_' + _Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].alphabeticId(fromStop.id, toStop.id);
        let helpStop = this.stationProvider.stationById(helpStopId);
        if (helpStop == undefined) {
            console.log('Creating', helpStopId);
            const oldCoord = fromStop.baseCoords;
            const newCoord = toStop.baseCoords;
            const delta = newCoord.delta(oldCoord);
            const deg = oldCoord.delta(newCoord).inclination();
            const intermediateDir = new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"]((deg.delta(fromDir).degrees >= 0 ? Math.floor(deg.degrees / 45) : Math.ceil(deg.degrees / 45)) * 45).normalize();
            const intermediateCoord = delta.withLength(delta.length / 2).add(newCoord);
            helpStop = this.stationProvider.createVirtualStop(helpStopId, intermediateCoord, intermediateDir);
        }
        return helpStop;
    }
    getAnimationDuration(path, animate) {
        if (!animate)
            return 0;
        return this.getTotalLength(path) / Line.SPEED;
    }
    getTotalLength(path) {
        let length = 0;
        for (let i = 0; i < path.length - 1; i++) {
            length += path[i].delta(path[i + 1]).length;
        }
        return length;
    }
    get termini() {
        const stops = this.adapter.stops;
        if (stops.length == 0)
            return [];
        return [stops[0], stops[stops.length - 1]];
    }
    get path() {
        return this._path;
    }
    getStop(stationId) {
        for (const stop of Object.values(this.adapter.stops)) {
            if (stop.stationId == stationId) {
                return stop;
            }
        }
        return null;
    }
}
Line.NODE_DISTANCE = 0;
Line.SPEED = 100;


/***/ }),

/***/ "./src/LineGroup.ts":
/*!**************************!*\
  !*** ./src/LineGroup.ts ***!
  \**************************/
/*! exports provided: LineGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LineGroup", function() { return LineGroup; });
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Station */ "./src/Station.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");


class LineGroup {
    constructor() {
        this._lines = [];
        this._termini = [];
        this.strokeColor = 0;
    }
    addLine(line) {
        if (!this._lines.includes(line))
            this._lines.push(line);
        this.updateTermini();
    }
    removeLine(line) {
        let i = 0;
        while (i < this._lines.length) {
            if (this._lines[i] == line) {
                this._lines.splice(i, 1);
            }
            else {
                i++;
            }
        }
        this.updateTermini();
    }
    get termini() {
        return this._termini;
    }
    getPathBetween(stationIdFrom, stationIdTo) {
        const from = this.getLinesWithStop(stationIdFrom);
        const to = this.getLinesWithStop(stationIdTo);
        if (from.length == 0 || to.length == 0) {
            return null;
        }
        for (const a of Object.values(from)) {
            for (const b of Object.values(to)) {
                if (a.line == b.line) {
                    return this.getPathBetweenStops(a.line, a.stop, b.stop);
                }
            }
        }
        for (const a of Object.values(from)) {
            for (const b of Object.values(to)) {
                const common = this.findCommonStop(a.line, b.line);
                if (common != null) {
                    const firstPart = this.getPathBetweenStops(a.line, a.stop, common);
                    const secondPart = this.getPathBetweenStops(b.line, common, b.stop);
                    const firstPartSlice = firstPart.path.slice(0, firstPart.to + 1);
                    const secondPartSlice = secondPart.path.slice(secondPart.from);
                    return { path: firstPartSlice.concat(secondPartSlice), from: firstPart.from, to: firstPartSlice.length + secondPart.to };
                }
            }
        }
        throw new Error("Complex Train routing for Lines of LineGroups not yet implemented");
    }
    getLinesWithStop(stationId) {
        const arr = [];
        for (const line of Object.values(this._lines)) {
            const stop = line.getStop(stationId);
            if (stop != null) {
                arr.push({ line: line, stop: stop });
            }
        }
        return arr;
    }
    getPathBetweenStops(line, from, to) {
        const path = line.path;
        let fromIdx = this.indexOf(path, from.coord || _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL);
        let toIdx = this.indexOf(path, to.coord || _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL);
        if (fromIdx == -1 || toIdx == -1) {
            throw new Error("Stop that should be present is not present on line " + line.name);
        }
        //const slice = path.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx)+1);
        const slice = path.slice();
        if (fromIdx > toIdx) {
            slice.reverse();
            fromIdx = slice.length - 1 - fromIdx;
            toIdx = slice.length - 1 - toIdx;
        }
        return { path: slice, from: fromIdx, to: toIdx };
    }
    indexOf(array, element) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].equals(element)) {
                return i;
            }
        }
        return -1;
    }
    findCommonStop(line1, line2) {
        for (const terminus1 of Object.values(line1.termini)) {
            for (const terminus2 of Object.values(line2.termini)) {
                if (terminus1.stationId == terminus2.stationId) {
                    return terminus1;
                }
            }
        }
        return null;
    }
    updateTermini() {
        const candidates = {};
        this._lines.forEach(l => {
            const lineTermini = l.termini;
            lineTermini.forEach(t => {
                if (!t.trackInfo.includes('*')) {
                    if (candidates[t.stationId] == undefined) {
                        candidates[t.stationId] = 1;
                    }
                    else {
                        candidates[t.stationId]++;
                    }
                }
            });
        });
        const termini = [];
        for (const [stationId, occurences] of Object.entries(candidates)) {
            if (occurences == 1) {
                termini.push(new _Station__WEBPACK_IMPORTED_MODULE_0__["Stop"](stationId, ''));
            }
        }
        this._termini = termini;
    }
}


/***/ }),

/***/ "./src/Network.ts":
/*!************************!*\
  !*** ./src/Network.ts ***!
  \************************/
/*! exports provided: Network */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Network", function() { return Network; });
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Station */ "./src/Station.ts");
/* harmony import */ var _Zoomer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Zoomer */ "./src/Zoomer.ts");
/* harmony import */ var _LineGroup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LineGroup */ "./src/LineGroup.ts");
/* harmony import */ var _Gravitator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Gravitator */ "./src/Gravitator.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Line */ "./src/Line.ts");






class Network {
    constructor(adapter) {
        this.adapter = adapter;
        this.slideIndex = {};
        this.stations = {};
        this.lineGroups = {};
        this.eraseBuffer = [];
        this.gravitator = new _Gravitator__WEBPACK_IMPORTED_MODULE_4__["Gravitator"](this);
        this.zoomer = new _Zoomer__WEBPACK_IMPORTED_MODULE_2__["Zoomer"](this.adapter.canvasSize);
    }
    initialize() {
        this.adapter.initialize(this);
    }
    stationById(id) {
        return this.stations[id];
    }
    lineGroupById(id) {
        if (this.lineGroups[id] == undefined) {
            this.lineGroups[id] = new _LineGroup__WEBPACK_IMPORTED_MODULE_3__["LineGroup"]();
        }
        return this.lineGroups[id];
    }
    createVirtualStop(id, baseCoords, rotation) {
        const stop = this.adapter.createVirtualStop(id, baseCoords, rotation);
        this.stations[id] = stop;
        return stop;
    }
    displayInstant(instant) {
        if (!instant.equals(_Instant__WEBPACK_IMPORTED_MODULE_0__["Instant"].BIG_BANG)) {
            this.adapter.drawEpoch(instant.epoch + '');
        }
    }
    timedDrawablesAt(now) {
        if (!this.isEpochExisting(now.epoch + ''))
            return [];
        return this.slideIndex[now.epoch][now.second];
    }
    drawTimedDrawablesAt(now, animate) {
        this.displayInstant(now);
        const elements = this.timedDrawablesAt(now);
        let delay = _Zoomer__WEBPACK_IMPORTED_MODULE_2__["Zoomer"].ZOOM_DURATION;
        for (let i = 0; i < elements.length; i++) {
            delay = this.drawOrEraseElement(elements[i], delay, animate, now);
        }
        delay = this.flushEraseBuffer(delay, animate);
        delay = this.gravitator.gravitate(delay, animate);
        this.adapter.zoomTo(this.zoomer.center, this.zoomer.scale, this.zoomer.duration);
        this.zoomer.reset();
        return delay;
    }
    flushEraseBuffer(delay, animate) {
        for (let i = this.eraseBuffer.length - 1; i >= 0; i--) {
            const element = this.eraseBuffer[i];
            const shouldAnimate = this.shouldAnimate(element.to, animate);
            delay += this.eraseElement(element, delay, shouldAnimate);
            this.zoomer.include(element.boundingBox, element.from, element.to, false, animate);
        }
        this.eraseBuffer = [];
        return delay;
    }
    drawOrEraseElement(element, delay, animate, instant) {
        if (instant.equals(element.to) && !element.from.equals(element.to)) {
            if (this.eraseBuffer.length > 0 && this.eraseBuffer[this.eraseBuffer.length - 1].name != element.name) {
                delay = this.flushEraseBuffer(delay, animate);
            }
            this.eraseBuffer.push(element);
            return delay;
        }
        delay = this.flushEraseBuffer(delay, animate);
        const shouldAnimate = this.shouldAnimate(element.from, animate);
        delay += this.drawElement(element, delay, shouldAnimate);
        this.zoomer.include(element.boundingBox, element.from, element.to, true, animate);
        return delay;
    }
    drawElement(element, delay, animate) {
        if (element instanceof _Line__WEBPACK_IMPORTED_MODULE_5__["Line"]) {
            this.gravitator.addEdge(element);
        }
        return element.draw(delay, animate);
    }
    eraseElement(element, delay, animate) {
        return element.erase(delay, animate, element.to.flag.includes('reverse'));
    }
    shouldAnimate(instant, animate) {
        if (!animate)
            return false;
        if (instant.flag.includes('noanim'))
            return false;
        return animate;
    }
    isEpochExisting(epoch) {
        return this.slideIndex[epoch] != undefined;
    }
    addToIndex(element) {
        this.setSlideIndexElement(element.from, element);
        if (!_Instant__WEBPACK_IMPORTED_MODULE_0__["Instant"].BIG_BANG.equals(element.to))
            this.setSlideIndexElement(element.to, element);
        if (element instanceof _Station__WEBPACK_IMPORTED_MODULE_1__["Station"]) {
            this.stations[element.id] = element;
        }
    }
    setSlideIndexElement(instant, element) {
        if (this.slideIndex[instant.epoch] == undefined)
            this.slideIndex[instant.epoch] = {};
        if (this.slideIndex[instant.epoch][instant.second] == undefined)
            this.slideIndex[instant.epoch][instant.second] = [];
        this.slideIndex[instant.epoch][instant.second].push(element);
    }
    nextInstant(now) {
        let epoch = now.epoch;
        let second = this.findSmallestAbove(now.second, this.slideIndex[now.epoch]);
        if (second == null) {
            epoch = this.findSmallestAbove(now.epoch, this.slideIndex);
            if (epoch == undefined)
                return null;
            second = this.findSmallestAbove(-1, this.slideIndex[epoch]);
            if (second == undefined)
                return null;
        }
        return new _Instant__WEBPACK_IMPORTED_MODULE_0__["Instant"](epoch, second, '');
    }
    findSmallestAbove(threshold, dict) {
        if (dict == undefined)
            return null;
        let smallest = null;
        for (const [key, value] of Object.entries(dict)) {
            if (parseInt(key) > threshold && (smallest == null || parseInt(key) < smallest)) {
                smallest = parseInt(key);
            }
        }
        return smallest;
    }
}


/***/ }),

/***/ "./src/PreferredTrack.ts":
/*!*******************************!*\
  !*** ./src/PreferredTrack.ts ***!
  \*******************************/
/*! exports provided: PreferredTrack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreferredTrack", function() { return PreferredTrack; });
class PreferredTrack {
    constructor(value) {
        this.value = value;
    }
    fromString(value) {
        if (value != '') {
            return new PreferredTrack(value);
        }
        return this;
    }
    fromNumber(value) {
        const prefix = value >= 0 ? '+' : '';
        return new PreferredTrack(prefix + value);
    }
    fromExistingLineAtStation(atStation) {
        if (atStation == undefined) {
            return this;
        }
        if (this.hasTrackNumber())
            return this;
        return this.fromNumber(atStation.track);
    }
    keepOnlySign() {
        const v = this.value[0];
        return new PreferredTrack(v == '-' ? v : '+');
    }
    hasTrackNumber() {
        return this.value.length > 1;
    }
    get trackNumber() {
        return parseInt(this.value.replace('*', ''));
    }
    isPositive() {
        return this.value[0] != '-';
    }
}


/***/ }),

/***/ "./src/Rotation.ts":
/*!*************************!*\
  !*** ./src/Rotation.ts ***!
  \*************************/
/*! exports provided: Rotation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rotation", function() { return Rotation; });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");

class Rotation {
    constructor(_degrees) {
        this._degrees = _degrees;
    }
    static from(direction) {
        return new Rotation(Rotation.DIRS[direction]);
    }
    get name() {
        for (const [key, value] of Object.entries(Rotation.DIRS)) {
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].equals(value, this.degrees)) {
                return key;
            }
        }
        return 'n';
    }
    get degrees() {
        return this._degrees;
    }
    get radians() {
        return this.degrees / 180 * Math.PI;
    }
    add(that) {
        let sum = this.degrees + that.degrees;
        if (sum <= -180)
            sum += 360;
        if (sum > 180)
            sum -= 360;
        return new Rotation(sum);
    }
    delta(that) {
        let a = this.degrees;
        let b = that.degrees;
        let dist = b - a;
        if (Math.abs(dist) > 180) {
            if (a < 0)
                a += 360;
            if (b < 0)
                b += 360;
            dist = b - a;
        }
        return new Rotation(dist);
    }
    normalize() {
        let dir = this.degrees;
        if (_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].equals(dir, -90))
            dir = 0;
        else if (dir < -90)
            dir += 180;
        else if (dir > 90)
            dir -= 180;
        return new Rotation(dir);
    }
    isVertical() {
        return this.degrees % 180 == 0;
    }
    quarterDirection(relativeTo) {
        const deltaDir = relativeTo.delta(this).degrees;
        const deg = deltaDir < 0 ? Math.ceil((deltaDir - 45) / 90) : Math.floor((deltaDir + 45) / 90);
        return new Rotation(deg * 90);
    }
    halfDirection(relativeTo, splitAxis) {
        const deltaDir = relativeTo.delta(this).degrees;
        let deg;
        if (splitAxis.isVertical()) {
            if (deltaDir < 0 && deltaDir >= -180)
                deg = -90;
            else
                deg = 90;
        }
        else {
            if (deltaDir < 90 && deltaDir >= -90)
                deg = 0;
            else
                deg = 180;
        }
        return new Rotation(deg);
    }
}
Rotation.DIRS = { 'sw': -135, 'w': -90, 'nw': -45, 'n': 0, 'ne': 45, 'e': 90, 'se': 135, 's': 180 };


/***/ }),

/***/ "./src/Station.ts":
/*!************************!*\
  !*** ./src/Station.ts ***!
  \************************/
/*! exports provided: Stop, Station */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stop", function() { return Stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Station", function() { return Station; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BoundingBox */ "./src/BoundingBox.ts");



class Stop {
    constructor(stationId, trackInfo) {
        this.stationId = stationId;
        this.trackInfo = trackInfo;
        this.coord = null;
    }
}
class Station {
    constructor(adapter) {
        this.adapter = adapter;
        this.existingLines = { x: [], y: [] };
        this.existingLabels = [];
        this.phantom = undefined;
        this.rotation = this.adapter.rotation;
        this.labelDir = this.adapter.labelDir;
        this.id = this.adapter.id;
        this.name = this.adapter.id;
        this.from = this.adapter.from;
        this.to = this.adapter.to;
    }
    get baseCoords() {
        return this.adapter.baseCoords;
    }
    set baseCoords(baseCoords) {
        this.adapter.baseCoords = baseCoords;
    }
    get boundingBox() {
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](this.adapter.baseCoords, this.adapter.baseCoords);
    }
    addLine(line, axis, track) {
        this.phantom = undefined;
        this.existingLines[axis].push({ line: line, axis: axis, track: track });
    }
    removeLine(line) {
        this.removeLineAtAxis(line, this.existingLines.x);
        this.removeLineAtAxis(line, this.existingLines.y);
    }
    addLabel(label) {
        if (!this.existingLabels.includes(label))
            this.existingLabels.push(label);
    }
    removeLabel(label) {
        let i = 0;
        while (i < this.existingLabels.length) {
            if (this.existingLabels[i] == label) {
                this.existingLabels.splice(i, 1);
            }
            else {
                i++;
            }
        }
    }
    get labels() {
        return this.existingLabels;
    }
    removeLineAtAxis(line, existingLinesForAxis) {
        let i = 0;
        while (i < existingLinesForAxis.length) {
            if (existingLinesForAxis[i].line == line) {
                this.phantom = existingLinesForAxis[i];
                existingLinesForAxis.splice(i, 1);
            }
            else {
                i++;
            }
        }
    }
    axisAndTrackForExistingLine(lineName) {
        const x = this.trackForLineAtAxis(lineName, this.existingLines.x);
        if (x != undefined) {
            return x;
        }
        const y = this.trackForLineAtAxis(lineName, this.existingLines.y);
        if (y != undefined) {
            return y;
        }
        return undefined;
    }
    trackForLineAtAxis(lineName, existingLinesForAxis) {
        var _a;
        let i = 0;
        while (i < existingLinesForAxis.length) {
            if (((_a = existingLinesForAxis[i].line) === null || _a === void 0 ? void 0 : _a.name) == lineName) {
                return existingLinesForAxis[i];
            }
            i++;
        }
        return undefined;
    }
    assignTrack(axis, preferredTrack, line) {
        var _a, _b, _c, _d;
        if (preferredTrack.hasTrackNumber()) {
            return preferredTrack.trackNumber;
        }
        if (((_b = (_a = this.phantom) === null || _a === void 0 ? void 0 : _a.line) === null || _b === void 0 ? void 0 : _b.name) == line.name && ((_c = this.phantom) === null || _c === void 0 ? void 0 : _c.axis) == axis) {
            return (_d = this.phantom) === null || _d === void 0 ? void 0 : _d.track;
        }
        const positionBoundariesForAxis = this.positionBoundaries()[axis];
        return preferredTrack.isPositive() ? positionBoundariesForAxis[1] + 1 : positionBoundariesForAxis[0] - 1;
    }
    rotatedTrackCoordinates(incomingDir, assignedTrack) {
        let newCoord;
        if (incomingDir.degrees % 180 == 0) {
            newCoord = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](assignedTrack * Station.LINE_DISTANCE, 0);
        }
        else {
            newCoord = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](0, assignedTrack * Station.LINE_DISTANCE);
        }
        newCoord = newCoord.rotate(this.rotation);
        newCoord = this.baseCoords.add(newCoord);
        return newCoord;
    }
    positionBoundaries() {
        return {
            x: this.positionBoundariesForAxis(this.existingLines.x),
            y: this.positionBoundariesForAxis(this.existingLines.y)
        };
    }
    positionBoundariesForAxis(existingLinesForAxis) {
        if (existingLinesForAxis.length == 0) {
            return [1, -1];
        }
        let left = 0;
        let right = 0;
        for (let i = 0; i < existingLinesForAxis.length; i++) {
            if (right < existingLinesForAxis[i].track) {
                right = existingLinesForAxis[i].track;
            }
            if (left > existingLinesForAxis[i].track) {
                left = existingLinesForAxis[i].track;
            }
        }
        return [left, right];
    }
    draw(delaySeconds, aniamte) {
        const station = this;
        this.existingLabels.forEach(l => l.draw(delaySeconds, false));
        const t = station.positionBoundaries();
        this.adapter.draw(delaySeconds, function () { return t; });
        return 0;
    }
    move(delaySeconds, animationDurationSeconds, to) {
        const station = this;
        this.adapter.move(delaySeconds, animationDurationSeconds, this.baseCoords, to, () => station.existingLabels.forEach(l => l.draw(0, false)));
    }
    erase(delaySeconds, animate, reverse) {
        this.adapter.erase(delaySeconds);
        return 0;
    }
    stationSizeForAxis(axis, vector) {
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(vector, 0))
            return 0;
        const dir = Math.sign(vector);
        let dimen = this.positionBoundariesForAxis(this.existingLines[axis])[vector < 0 ? 0 : 1];
        if (dir * dimen < 0) {
            dimen = 0;
        }
        return dimen * Station.LINE_DISTANCE + dir * (Station.DEFAULT_STOP_DIMEN + Station.LABEL_DISTANCE);
    }
    linesExisting() {
        if (this.existingLines.x.length > 0 || this.existingLines.y.length > 0) {
            return true;
        }
        return false;
    }
}
Station.LINE_DISTANCE = 6;
Station.DEFAULT_STOP_DIMEN = 10;
Station.LABEL_DISTANCE = 0;


/***/ }),

/***/ "./src/Train.ts":
/*!**********************!*\
  !*** ./src/Train.ts ***!
  \**********************/
/*! exports provided: Train */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Train", function() { return Train; });
/* harmony import */ var _ArrivalDepartureTime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArrivalDepartureTime */ "./src/ArrivalDepartureTime.ts");

class Train {
    constructor(adapter, stationProvider) {
        this.adapter = adapter;
        this.stationProvider = stationProvider;
        this.from = this.adapter.from;
        this.to = this.adapter.to;
        this.name = this.adapter.name;
        this.boundingBox = this.adapter.boundingBox;
    }
    draw(delay, animate) {
        const lineGroup = this.stationProvider.lineGroupById(this.name);
        const stops = this.adapter.stops;
        if (stops.length < 2) {
            throw new Error("Train " + this.name + " needs at least 2 stops");
        }
        for (let i = 1; i < stops.length; i++) {
            const arrdep = new _ArrivalDepartureTime__WEBPACK_IMPORTED_MODULE_0__["ArrivalDepartureTime"](stops[i].trackInfo);
            const path = lineGroup.getPathBetween(stops[i - 1].stationId, stops[i].stationId);
            if (path != null) {
                if (i == 1) {
                    this.adapter.draw(delay, animate, path);
                }
                this.adapter.move(delay + arrdep.departure - this.from.second, arrdep.arrival - arrdep.departure, path);
            }
            else {
                throw Error(this.name + ': No path found between ' + stops[i - 1].stationId + ' ' + stops[i].stationId);
            }
        }
        return 0;
    }
    erase(delay, animate, reverse) {
        this.adapter.erase(delay);
        return 0;
    }
}


/***/ }),

/***/ "./src/Utils.ts":
/*!**********************!*\
  !*** ./src/Utils.ts ***!
  \**********************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utils", function() { return Utils; });
class Utils {
    static equals(a, b) {
        return Math.abs(a - b) < Utils.IMPRECISION;
    }
    static trilemma(int, options) {
        if (Utils.equals(int, 0)) {
            return options[1];
        }
        else if (int > 0) {
            return options[2];
        }
        return options[0];
    }
    static alphabeticId(a, b) {
        if (a < b)
            return a + '_' + b;
        return b + '_' + a;
    }
    static ease(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
}
Utils.IMPRECISION = 0.001;


/***/ }),

/***/ "./src/Vector.ts":
/*!***********************!*\
  !*** ./src/Vector.ts ***!
  \***********************/
/*! exports provided: Vector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vector", function() { return Vector; });
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Rotation */ "./src/Rotation.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");


class Vector {
    constructor(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    withLength(length) {
        const ratio = this.length != 0 ? length / this.length : 0;
        return new Vector(this.x * ratio, this.y * ratio);
    }
    add(that) {
        return new Vector(this.x + that.x, this.y + that.y);
    }
    delta(that) {
        return new Vector(that.x - this.x, that.y - this.y);
    }
    rotate(theta) {
        let rad = theta.radians;
        return new Vector(this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad));
    }
    dotProduct(that) {
        return this.x * that.x + this.y * that.y;
    }
    solveDeltaForIntersection(dir1, dir2) {
        const delta = this;
        const swapZeroDivision = _Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(dir2.y, 0);
        const x = swapZeroDivision ? 'y' : 'x';
        const y = swapZeroDivision ? 'x' : 'y';
        const denominator = (dir1[y] * dir2[x] - dir1[x] * dir2[y]);
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(denominator, 0)) {
            return { a: NaN, b: NaN };
        }
        const a = (delta[y] * dir2[x] - delta[x] * dir2[y]) / denominator;
        const b = (a * dir1[y] - delta[y]) / dir2[y];
        return { a, b };
    }
    isDeltaMatchingParallel(dir1, dir2) {
        return this.allEqualZero(this.x, dir1.x, dir2.x) || this.allEqualZero(this.y, dir1.y, dir2.y);
    }
    allEqualZero(n1, n2, n3) {
        return _Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(n1, 0) && _Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(n2, 0) && _Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(n3, 0);
    }
    inclination() {
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(this.x, 0))
            return new _Rotation__WEBPACK_IMPORTED_MODULE_0__["Rotation"](this.y > 0 ? 180 : 0);
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(this.y, 0))
            return new _Rotation__WEBPACK_IMPORTED_MODULE_0__["Rotation"](this.x > 0 ? 90 : -90);
        const adjacent = new Vector(0, -Math.abs(this.y));
        return new _Rotation__WEBPACK_IMPORTED_MODULE_0__["Rotation"](Math.sign(this.x) * Math.acos(this.dotProduct(adjacent) / adjacent.length / this.length) * 180 / Math.PI);
    }
    angle(other) {
        return this.inclination().delta(other.inclination());
    }
    bothAxisMins(other) {
        if (this == Vector.NULL)
            return other;
        if (other == Vector.NULL)
            return this;
        return new Vector(this.x < other.x ? this.x : other.x, this.y < other.y ? this.y : other.y);
    }
    bothAxisMaxs(other) {
        if (this == Vector.NULL)
            return other;
        if (other == Vector.NULL)
            return this;
        return new Vector(this.x > other.x ? this.x : other.x, this.y > other.y ? this.y : other.y);
    }
    between(other, x) {
        const delta = this.delta(other);
        return this.add(delta.withLength(delta.length * x));
    }
    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}
Vector.UNIT = new Vector(0, -1);
Vector.NULL = new Vector(0, 0);


/***/ }),

/***/ "./src/Zoomer.ts":
/*!***********************!*\
  !*** ./src/Zoomer.ts ***!
  \***********************/
/*! exports provided: Zoomer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Zoomer", function() { return Zoomer; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Rotation */ "./src/Rotation.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BoundingBox */ "./src/BoundingBox.ts");



class Zoomer {
    constructor(canvasSize) {
        this.canvasSize = canvasSize;
        this.boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
        this.customDuration = -1;
        this.resetFlag = false;
    }
    include(boundingBox, from, to, draw, shouldAnimate, pad = true) {
        const now = draw ? from : to;
        if (now.flag.includes('keepzoom')) {
            this.resetFlag = false;
        }
        else {
            if (this.resetFlag) {
                this.doReset();
            }
            if (shouldAnimate && !now.flag.includes('nozoom')) {
                if (pad && !boundingBox.isNull()) {
                    boundingBox = this.paddedBoundingBox(boundingBox);
                }
                this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(boundingBox.tl);
                this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(boundingBox.br);
            }
        }
    }
    enforcedBoundingBox() {
        if (!this.boundingBox.isNull()) {
            const paddedBoundingBox = this.boundingBox;
            const zoomSize = paddedBoundingBox.dimensions;
            const canvasSize = this.canvasSize.dimensions;
            const minZoomSize = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](canvasSize.x / Zoomer.ZOOM_MAX_SCALE, canvasSize.y / Zoomer.ZOOM_MAX_SCALE);
            const delta = zoomSize.delta(minZoomSize);
            const additionalSpacing = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](Math.max(0, delta.x / 2), Math.max(0, delta.y / 2));
            return new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](paddedBoundingBox.tl.add(additionalSpacing.rotate(new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](180))), paddedBoundingBox.br.add(additionalSpacing));
        }
        return this.boundingBox;
    }
    paddedBoundingBox(boundingBox) {
        const padding = (this.canvasSize.dimensions.x + this.canvasSize.dimensions.y) / Zoomer.PADDING_FACTOR;
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](boundingBox.tl.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](-padding, -padding)), boundingBox.br.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](padding, padding)));
    }
    get center() {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (!enforcedBoundingBox.isNull()) {
            return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](Math.round((enforcedBoundingBox.tl.x + enforcedBoundingBox.br.x) / 2), Math.round((enforcedBoundingBox.tl.y + enforcedBoundingBox.br.y) / 2));
        }
        return this.canvasSize.tl.between(this.canvasSize.br, 0.5);
    }
    get scale() {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (!enforcedBoundingBox.isNull()) {
            const zoomSize = enforcedBoundingBox.dimensions;
            const delta = this.canvasSize.dimensions;
            return Math.min(delta.x / zoomSize.x, delta.y / zoomSize.y);
        }
        return 1;
    }
    get duration() {
        if (this.customDuration == -1) {
            return Zoomer.ZOOM_DURATION;
        }
        return this.customDuration;
    }
    doReset() {
        this.boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
        this.customDuration = -1;
        this.resetFlag = false;
    }
    reset() {
        this.resetFlag = true;
    }
}
Zoomer.ZOOM_DURATION = 1;
Zoomer.ZOOM_MAX_SCALE = 3;
Zoomer.PADDING_FACTOR = 25;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _svg_SvgNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./svg/SvgNetwork */ "./src/svg/SvgNetwork.ts");
/* harmony import */ var _Network__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Network */ "./src/Network.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");



// TODO: erase anim, labels, negative default tracks based on direction, rejoin lines track selection
let timePassed = 0;
const network = new _Network__WEBPACK_IMPORTED_MODULE_1__["Network"](new _svg_SvgNetwork__WEBPACK_IMPORTED_MODULE_0__["SvgNetwork"]());
network.initialize();
const animateFromInstant = getStartInstant();
slide(_Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG, false);
function getStartInstant() {
    if (window.location.hash) {
        const animateFromInstant = window.location.hash.replace('#', '').split('-');
        const instant = new _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"](parseInt(animateFromInstant[0]) || 0, parseInt(animateFromInstant[1]) || 0, '');
        console.log('fast forward to', instant);
        return instant;
    }
    return _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG;
}
function slide(instant, animate) {
    if (instant != _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG && instant.epoch >= animateFromInstant.epoch && instant.second >= animateFromInstant.second)
        animate = true;
    console.log(instant, 'time: ' + Math.floor(timePassed / 60) + ':' + timePassed % 60);
    network.drawTimedDrawablesAt(instant, animate);
    const next = network.nextInstant(instant);
    if (next) {
        const delta = instant.delta(next);
        timePassed += delta;
        const delay = animate ? delta : 0;
        window.setTimeout(function () { slide(next, animate); }, delay * 1000);
    }
}


/***/ }),

/***/ "./src/svg/SvgGenericTimedDrawable.ts":
/*!********************************************!*\
  !*** ./src/svg/SvgGenericTimedDrawable.ts ***!
  \********************************************/
/*! exports provided: SvgGenericTimedDrawable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgGenericTimedDrawable", function() { return SvgGenericTimedDrawable; });
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Instant */ "./src/Instant.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgNetwork */ "./src/svg/SvgNetwork.ts");




class SvgGenericTimedDrawable {
    constructor(element) {
        this.element = element;
    }
    get name() {
        return this.element.getAttribute('name') || this.element.getAttribute('src') || '';
    }
    get from() {
        return this.getInstant('from');
    }
    get to() {
        return this.getInstant('to');
    }
    get boundingBox() {
        const r = this.element.getBBox();
        const bbox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x, r.y), new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x + r.width, r.y + r.height));
        return bbox;
    }
    get zoom() {
        if (this.element.dataset['zoom'] != undefined) {
            const center = this.element.dataset['zoom'].split(' ');
            return new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](parseInt(center[0]) || 50, parseInt(center[1]) || 50);
        }
        return _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL;
    }
    draw(delaySeconds, animationDurationSeconds, zoomCenter, zoomScale) {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function () { label.draw(0, animationDurationSeconds, zoomCenter, zoomScale); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'visible';
        this.doZoom(zoomCenter, zoomScale, animationDurationSeconds);
    }
    doZoom(zoomCenter, zoomScale, animationDurationSeconds) {
        this.animateFrame(0, 1 / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS, this.boundingBox.tl.between(this.boundingBox.br, 0.5), zoomCenter, 1, zoomScale);
    }
    animateFrame(x, animationPerFrame, fromCenter, toCenter, fromScale, toScale) {
        if (x < 1) {
            x += animationPerFrame;
            const fx = x;
            const delta = fromCenter.delta(toCenter);
            const center = new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](delta.x * fx, delta.y * fx).add(fromCenter);
            const scale = (toScale - fromScale) * fx + fromScale;
            this.updateZoom(center, scale);
            const network = this;
            window.requestAnimationFrame(function () { network.animateFrame(x, animationPerFrame, fromCenter, toCenter, fromScale, toScale); });
        }
        else {
            this.updateZoom(toCenter, toScale);
        }
    }
    updateZoom(center, scale) {
        const zoomable = this.element;
        if (zoomable != undefined) {
            const origin = this.boundingBox.tl.between(this.boundingBox.br, 0.5);
            zoomable.style.transformOrigin = origin.x + 'px ' + origin.y + 'px';
            zoomable.style.transform = 'scale(' + scale + ') translate(' + (origin.x - center.x) + 'px,' + (origin.y - center.y) + 'px)';
        }
    }
    erase(delaySeconds) {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function () { label.erase(0); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'hidden';
    }
    getInstant(fromOrTo) {
        var _a;
        if (this.element.dataset[fromOrTo] != undefined) {
            const arr = (_a = this.element.dataset[fromOrTo]) === null || _a === void 0 ? void 0 : _a.split(/\s+/);
            if (arr != undefined) {
                return _Instant__WEBPACK_IMPORTED_MODULE_0__["Instant"].from(arr);
            }
        }
        return _Instant__WEBPACK_IMPORTED_MODULE_0__["Instant"].BIG_BANG;
    }
}


/***/ }),

/***/ "./src/svg/SvgLabel.ts":
/*!*****************************!*\
  !*** ./src/svg/SvgLabel.ts ***!
  \*****************************/
/*! exports provided: SvgLabel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgLabel", function() { return SvgLabel; });
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Label */ "./src/Label.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Instant */ "./src/Instant.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils */ "./src/Utils.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgNetwork */ "./src/svg/SvgNetwork.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");






class SvgLabel {
    constructor(element) {
        this.element = element;
    }
    get from() {
        return this.getInstant('from');
    }
    get to() {
        return this.getInstant('to');
    }
    get forStation() {
        return this.element.dataset.station;
    }
    get forLine() {
        return this.element.dataset.line;
    }
    get boundingBox() {
        if (this.element.style.visibility == 'visible') {
            const r = this.element.getBBox();
            return new _BoundingBox__WEBPACK_IMPORTED_MODULE_5__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](r.x, r.y), new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](r.x + r.width, r.y + r.height));
        }
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_5__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"].NULL);
    }
    draw(delaySeconds, textCoords, labelDir, children) {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function () { label.draw(0, textCoords, labelDir, children); }, delaySeconds * 1000);
            return;
        }
        if (textCoords != _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"].NULL) {
            this.setCoord(this.element, textCoords);
            if (children.length > 0) {
                this.drawLineLabels(labelDir, children);
            }
            else {
                this.drawStationLabel(labelDir);
            }
        }
        else {
            this.element.style.visibility = 'visible';
        }
    }
    translate(boxDimen, labelDir) {
        const labelunitv = _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"].UNIT.rotate(labelDir);
        this.element.style.transform = 'translate('
            + _Utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].trilemma(labelunitv.x, [-boxDimen.x + 'px', -boxDimen.x / 2 + 'px', '0px'])
            + ','
            + _Utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].trilemma(labelunitv.y, [-_Label__WEBPACK_IMPORTED_MODULE_0__["Label"].LABEL_HEIGHT + 'px', -_Label__WEBPACK_IMPORTED_MODULE_0__["Label"].LABEL_HEIGHT / 2 + 'px', '0px']) // TODO magic numbers
            + ')';
        this.element.style.visibility = 'visible';
    }
    drawLineLabels(labelDir, children) {
        this.element.children[0].innerHTML = '';
        children.forEach(c => {
            if (c instanceof SvgLabel) {
                this.drawLineLabel(c);
            }
        });
        const scale = this.element.getBoundingClientRect().width / Math.max(this.element.getBBox().width, 1);
        const bbox = this.element.children[0].getBoundingClientRect();
        this.translate(new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](bbox.width / scale, bbox.height / scale), labelDir);
    }
    drawLineLabel(label) {
        const lineLabel = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        lineLabel.className = label.classNames;
        lineLabel.innerHTML = label.text;
        this.element.children[0].appendChild(lineLabel);
    }
    drawStationLabel(labelDir) {
        if (!this.element.className.baseVal.includes('for-station'))
            this.element.className.baseVal += ' for-station';
        this.element.style.dominantBaseline = 'hanging';
        this.translate(new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](this.element.getBBox().width, this.element.getBBox().height), labelDir);
    }
    erase(delaySeconds) {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function () { label.erase(0); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'hidden';
    }
    getInstant(fromOrTo) {
        var _a;
        if (this.element.dataset[fromOrTo] != undefined) {
            const arr = (_a = this.element.dataset[fromOrTo]) === null || _a === void 0 ? void 0 : _a.split(/\s+/);
            if (arr != undefined) {
                return _Instant__WEBPACK_IMPORTED_MODULE_1__["Instant"].from(arr);
            }
        }
        return _Instant__WEBPACK_IMPORTED_MODULE_1__["Instant"].BIG_BANG;
    }
    setCoord(element, coord) {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }
    get classNames() {
        return this.element.className.baseVal + ' ' + this.forLine;
    }
    get text() {
        return this.element.innerHTML;
    }
    cloneForStation(stationId) {
        var _a;
        const lineLabel = document.createElementNS(_SvgNetwork__WEBPACK_IMPORTED_MODULE_4__["SvgNetwork"].SVGNS, 'foreignObject');
        lineLabel.className.baseVal += ' for-line';
        lineLabel.dataset.station = stationId;
        lineLabel.setAttribute('width', '1');
        const container = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        lineLabel.appendChild(container);
        (_a = document.getElementById('stations')) === null || _a === void 0 ? void 0 : _a.appendChild(lineLabel);
        return new SvgLabel(lineLabel);
    }
}


/***/ }),

/***/ "./src/svg/SvgLine.ts":
/*!****************************!*\
  !*** ./src/svg/SvgLine.ts ***!
  \****************************/
/*! exports provided: SvgLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgLine", function() { return SvgLine; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Station */ "./src/Station.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Instant */ "./src/Instant.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgNetwork */ "./src/svg/SvgNetwork.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");





class SvgLine {
    constructor(element) {
        this.element = element;
        this._stops = [];
        this.boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_4__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
    }
    get name() {
        return this.element.dataset.line || '';
    }
    get from() {
        return this.getInstant('from');
    }
    get to() {
        return this.getInstant('to');
    }
    get weight() {
        if (this.element.dataset.length == undefined) {
            return undefined;
        }
        return parseInt(this.element.dataset.length);
    }
    updateBoundingBox(path) {
        for (let i = 0; i < path.length; i++) {
            this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(path[i]);
            this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(path[i]);
        }
    }
    getInstant(fromOrTo) {
        var _a;
        if (this.element.dataset[fromOrTo] != undefined) {
            const arr = (_a = this.element.dataset[fromOrTo]) === null || _a === void 0 ? void 0 : _a.split(/\s+/);
            if (arr != undefined) {
                return _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].from(arr);
            }
        }
        return _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG;
    }
    get stops() {
        var _a;
        if (this._stops.length == 0) {
            const tokens = ((_a = this.element.dataset.stops) === null || _a === void 0 ? void 0 : _a.split(/\s+/)) || [];
            let nextStop = new _Station__WEBPACK_IMPORTED_MODULE_1__["Stop"]('', '');
            for (var i = 0; i < (tokens === null || tokens === void 0 ? void 0 : tokens.length); i++) {
                if (tokens[i][0] != '-' && tokens[i][0] != '+' && tokens[i][0] != '*') {
                    nextStop.stationId = tokens[i];
                    this._stops.push(nextStop);
                    nextStop = new _Station__WEBPACK_IMPORTED_MODULE_1__["Stop"]('', '');
                }
                else {
                    nextStop.trackInfo = tokens[i];
                }
            }
        }
        return this._stops;
    }
    draw(delaySeconds, animationDurationSeconds, path, length, colorDeviation) {
        this.updateBoundingBox(path);
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.draw(0, animationDurationSeconds, path, length, colorDeviation); }, delaySeconds * 1000);
            return;
        }
        this.element.className.baseVal += ' line ' + this.name;
        this.createPath(path);
        this.updateDasharray(length);
        if (colorDeviation != 0) {
            this.updateColor(colorDeviation);
        }
        if (animationDurationSeconds == 0) {
            length = 0;
        }
        this.animateFrame(length, 0, -length / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS);
    }
    move(delaySeconds, animationDurationSeconds, from, to, colorFrom, colorTo) {
        this.updateBoundingBox(to);
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.move(0, animationDurationSeconds, from, to, colorFrom, colorTo); }, delaySeconds * 1000);
            return;
        }
        this.animateFrameVector(from, to, colorFrom, colorTo, 0, 1 / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS);
    }
    erase(delaySeconds, animationDurationSeconds, reverse, length) {
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.erase(0, animationDurationSeconds, reverse, length); }, delaySeconds * 1000);
            return;
        }
        let from = 0;
        if (animationDurationSeconds == 0) {
            from = length;
        }
        const direction = reverse ? -1 : 1;
        this.animateFrame(from, length * direction, length / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS * direction);
    }
    createPath(path) {
        const d = 'M' + path.map(v => v.x + ',' + v.y).join(' L');
        this.element.setAttribute('d', d);
    }
    updateDasharray(length) {
        let dashedPart = length + '';
        if (this.element.dataset.dashInitial == undefined) {
            this.element.dataset.dashInitial = getComputedStyle(this.element).strokeDasharray.replace(/[^0-9\s,]+/g, '');
        }
        if (this.element.dataset.dashInitial.length > 0) {
            let presetArray = this.element.dataset.dashInitial.split(/[\s,]+/);
            if (presetArray.length % 2 == 1)
                presetArray = presetArray.concat(presetArray);
            const presetLength = presetArray.map(a => parseInt(a) || 0).reduce((a, b) => a + b, 0);
            dashedPart = new Array(Math.ceil(length / presetLength + 1)).join(presetArray.join(' ') + ' ') + '0';
        }
        this.element.style.strokeDasharray = dashedPart + ' ' + length;
    }
    updateColor(deviation) {
        this.element.style.stroke = 'rgb(' + Math.max(0, deviation) * 256 + ', 0, ' + Math.min(0, deviation) * -256 + ')';
    }
    animateFrame(from, to, animationPerFrame) {
        if (animationPerFrame < 0 && from > to || animationPerFrame > 0 && from < to) {
            this.element.style.strokeDashoffset = from + '';
            from += animationPerFrame;
            const line = this;
            window.requestAnimationFrame(function () { line.animateFrame(from, to, animationPerFrame); });
        }
        else {
            this.element.style.strokeDashoffset = to + '';
            if (to != 0) {
                this.element.style.visibility = 'hidden';
            }
        }
    }
    animateFrameVector(from, to, colorFrom, colorTo, x, animationPerFrame) {
        if (x < 1) {
            const interpolated = [];
            for (let i = 0; i < from.length; i++) {
                interpolated.push(from[i].between(to[i], x));
            }
            this.updateDasharray(interpolated[0].delta(interpolated[interpolated.length - 1]).length); // TODO arbitrary node count
            this.createPath(interpolated);
            this.updateColor((colorTo - colorFrom) * x + colorFrom);
            x += animationPerFrame;
            const line = this;
            window.requestAnimationFrame(function () { line.animateFrameVector(from, to, colorFrom, colorTo, x, animationPerFrame); });
        }
        else {
            this.updateDasharray(to[0].delta(to[to.length - 1]).length);
            this.createPath(to);
        }
    }
}


/***/ }),

/***/ "./src/svg/SvgNetwork.ts":
/*!*******************************!*\
  !*** ./src/svg/SvgNetwork.ts ***!
  \*******************************/
/*! exports provided: SvgNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgNetwork", function() { return SvgNetwork; });
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Station */ "./src/Station.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Line */ "./src/Line.ts");
/* harmony import */ var _SvgLine__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgLine */ "./src/svg/SvgLine.ts");
/* harmony import */ var _SvgStation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SvgStation */ "./src/svg/SvgStation.ts");
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Label */ "./src/Label.ts");
/* harmony import */ var _SvgLabel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SvgLabel */ "./src/svg/SvgLabel.ts");
/* harmony import */ var _GenericTimedDrawable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../GenericTimedDrawable */ "./src/GenericTimedDrawable.ts");
/* harmony import */ var _SvgGenericTimedDrawable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SvgGenericTimedDrawable */ "./src/svg/SvgGenericTimedDrawable.ts");
/* harmony import */ var _Zoomer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Zoomer */ "./src/Zoomer.ts");
/* harmony import */ var _Train__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Train */ "./src/Train.ts");
/* harmony import */ var _SvgTrain__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SvgTrain */ "./src/svg/SvgTrain.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../Utils */ "./src/Utils.ts");














class SvgNetwork {
    constructor() {
        this.currentZoomCenter = _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL;
        this.currentZoomScale = 1;
    }
    get canvasSize() {
        const svg = document.querySelector('svg');
        const box = svg === null || svg === void 0 ? void 0 : svg.viewBox.baseVal;
        if (box) {
            return new _BoundingBox__WEBPACK_IMPORTED_MODULE_0__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](box.x, box.y), new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](box.x + box.width, box.y + box.height));
        }
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_0__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL);
    }
    get beckStyle() {
        const svg = document.querySelector('svg');
        return (svg === null || svg === void 0 ? void 0 : svg.dataset.beckStyle) != 'false';
    }
    initialize(network) {
        let elements = document.getElementsByTagName("*");
        if (elements == undefined) {
            console.error('Please define the "elements" group.');
            return;
        }
        for (let i = 0; i < elements.length; i++) {
            const element = this.mirrorElement(elements[i], network);
            if (element != null) {
                network.addToIndex(element);
            }
        }
    }
    mirrorElement(element, network) {
        if (element.localName == 'path' && element.dataset.line != undefined) {
            return new _Line__WEBPACK_IMPORTED_MODULE_3__["Line"](new _SvgLine__WEBPACK_IMPORTED_MODULE_4__["SvgLine"](element), network, this.beckStyle);
        }
        else if (element.localName == 'path' && element.dataset.train != undefined) {
            return new _Train__WEBPACK_IMPORTED_MODULE_11__["Train"](new _SvgTrain__WEBPACK_IMPORTED_MODULE_12__["SvgTrain"](element), network);
        }
        else if (element.localName == 'rect' && element.dataset.station != undefined) {
            return new _Station__WEBPACK_IMPORTED_MODULE_2__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_5__["SvgStation"](element));
        }
        else if (element.localName == 'text') {
            return new _Label__WEBPACK_IMPORTED_MODULE_6__["Label"](new _SvgLabel__WEBPACK_IMPORTED_MODULE_7__["SvgLabel"](element), network);
        }
        else if (element.dataset.from != undefined || element.dataset.to != undefined) {
            return new _GenericTimedDrawable__WEBPACK_IMPORTED_MODULE_8__["GenericTimedDrawable"](new _SvgGenericTimedDrawable__WEBPACK_IMPORTED_MODULE_9__["SvgGenericTimedDrawable"](element));
        }
        return null;
    }
    createVirtualStop(id, baseCoords, rotation) {
        var _a;
        const helpStop = document.createElementNS(SvgNetwork.SVGNS, 'rect');
        helpStop.setAttribute('data-station', id);
        helpStop.setAttribute('data-dir', rotation.name);
        this.setCoord(helpStop, baseCoords);
        helpStop.className.baseVal = 'helper';
        (_a = document.getElementById('stations')) === null || _a === void 0 ? void 0 : _a.appendChild(helpStop);
        return new _Station__WEBPACK_IMPORTED_MODULE_2__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_5__["SvgStation"](helpStop));
    }
    setCoord(element, coord) {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }
    drawEpoch(epoch) {
        const event = new CustomEvent('epoch', { detail: epoch });
        document.dispatchEvent(event);
        let epochLabel;
        if (document.getElementById('epoch-label') != undefined) {
            epochLabel = document.getElementById('epoch-label');
            epochLabel.textContent = epoch;
        }
    }
    zoomTo(zoomCenter, zoomScale, animationDurationSeconds) {
        const network = this;
        window.setTimeout(function () { network.doZoom(zoomCenter, zoomScale, animationDurationSeconds); }, animationDurationSeconds <= _Zoomer__WEBPACK_IMPORTED_MODULE_10__["Zoomer"].ZOOM_DURATION ? 0 : _Zoomer__WEBPACK_IMPORTED_MODULE_10__["Zoomer"].ZOOM_DURATION * 1000);
        return;
    }
    doZoom(zoomCenter, zoomScale, animationDurationSeconds) {
        this.animateFrame(0, 1 / animationDurationSeconds / SvgNetwork.FPS, animationDurationSeconds <= _Zoomer__WEBPACK_IMPORTED_MODULE_10__["Zoomer"].ZOOM_DURATION, this.currentZoomCenter, zoomCenter, this.currentZoomScale, zoomScale);
        this.currentZoomCenter = zoomCenter;
        this.currentZoomScale = zoomScale;
    }
    animateFrame(x, animationPerFrame, ease, fromCenter, toCenter, fromScale, toScale) {
        if (x < 1) {
            x += animationPerFrame;
            const fx = ease ? _Utils__WEBPACK_IMPORTED_MODULE_13__["Utils"].ease(x) : x;
            const delta = fromCenter.delta(toCenter);
            const center = new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](delta.x * fx, delta.y * fx).add(fromCenter);
            const scale = (toScale - fromScale) * fx + fromScale;
            this.updateZoom(center, scale);
            const network = this;
            window.requestAnimationFrame(function () { network.animateFrame(x, animationPerFrame, ease, fromCenter, toCenter, fromScale, toScale); });
        }
        else {
            this.updateZoom(toCenter, toScale);
        }
    }
    updateZoom(center, scale) {
        const zoomable = document.getElementById('zoomable');
        if (zoomable != undefined) {
            const origin = this.canvasSize.tl.between(this.canvasSize.br, 0.5);
            zoomable.style.transformOrigin = origin.x + 'px ' + origin.y + 'px';
            zoomable.style.transform = 'scale(' + scale + ') translate(' + (origin.x - center.x) + 'px,' + (origin.y - center.y) + 'px)';
        }
    }
}
SvgNetwork.FPS = 60;
SvgNetwork.SVGNS = "http://www.w3.org/2000/svg";


/***/ }),

/***/ "./src/svg/SvgStation.ts":
/*!*******************************!*\
  !*** ./src/svg/SvgStation.ts ***!
  \*******************************/
/*! exports provided: SvgStation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgStation", function() { return SvgStation; });
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Station */ "./src/Station.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgNetwork */ "./src/svg/SvgNetwork.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Instant */ "./src/Instant.ts");





class SvgStation {
    constructor(element) {
        this.element = element;
    }
    get id() {
        if (this.element.dataset.station != undefined) {
            return this.element.dataset.station;
        }
        throw new Error('Station needs to have a data-station identifier');
    }
    get baseCoords() {
        return new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](parseInt(this.element.getAttribute('x') || '') || 0, parseInt(this.element.getAttribute('y') || '') || 0);
    }
    set baseCoords(baseCoords) {
        this.element.setAttribute('x', baseCoords.x + '');
        this.element.setAttribute('y', baseCoords.y + '');
    }
    get from() {
        return this.getInstant('from');
    }
    get to() {
        return this.getInstant('to');
    }
    getInstant(fromOrTo) {
        var _a;
        if (this.element.dataset[fromOrTo] != undefined) {
            const arr = (_a = this.element.dataset[fromOrTo]) === null || _a === void 0 ? void 0 : _a.split(/\s+/);
            if (arr != undefined) {
                return _Instant__WEBPACK_IMPORTED_MODULE_4__["Instant"].from(arr);
            }
        }
        return _Instant__WEBPACK_IMPORTED_MODULE_4__["Instant"].BIG_BANG;
    }
    get rotation() {
        return _Rotation__WEBPACK_IMPORTED_MODULE_2__["Rotation"].from(this.element.dataset.dir || 'n');
    }
    get labelDir() {
        return _Rotation__WEBPACK_IMPORTED_MODULE_2__["Rotation"].from(this.element.dataset.labelDir || 'n');
    }
    draw(delaySeconds, getPositionBoundaries) {
        if (delaySeconds > 0) {
            const station = this;
            window.setTimeout(function () { station.draw(0, getPositionBoundaries); }, delaySeconds * 1000);
            return;
        }
        const positionBoundaries = getPositionBoundaries();
        const stopDimen = [positionBoundaries.x[1] - positionBoundaries.x[0], positionBoundaries.y[1] - positionBoundaries.y[0]];
        if (!this.element.className.baseVal.includes('station')) {
            this.element.className.baseVal += ' station ' + this.id;
        }
        this.element.style.visibility = stopDimen[0] < 0 && stopDimen[1] < 0 ? 'hidden' : 'visible';
        this.element.setAttribute('width', (Math.max(stopDimen[0], 0) * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE + _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN) + '');
        this.element.setAttribute('height', (Math.max(stopDimen[1], 0) * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE + _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN) + '');
        this.updateTransformOrigin();
        this.element.setAttribute('transform', 'rotate(' + this.rotation.degrees + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE - _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE - _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN / 2) + ')');
    }
    updateTransformOrigin() {
        this.element.setAttribute('transform-origin', this.baseCoords.x + ' ' + this.baseCoords.y);
    }
    move(delaySeconds, animationDurationSeconds, from, to, callback) {
        if (delaySeconds > 0) {
            const station = this;
            window.setTimeout(function () { station.move(0, animationDurationSeconds, from, to, callback); }, delaySeconds * 1000);
            return;
        }
        this.animateFrameVector(from, to, 0, 1 / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS, callback);
    }
    animateFrameVector(from, to, x, animationPerFrame, callback) {
        if (x < 1) {
            this.baseCoords = from.between(to, x);
            this.updateTransformOrigin();
            callback();
            x += animationPerFrame;
            const line = this;
            window.requestAnimationFrame(function () { line.animateFrameVector(from, to, x, animationPerFrame, callback); });
        }
        else {
            this.baseCoords = to;
            this.updateTransformOrigin();
            callback();
        }
    }
    erase(delaySeconds) {
        if (delaySeconds > 0) {
            const station = this;
            window.setTimeout(function () { station.erase(0); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'hidden';
    }
}


/***/ }),

/***/ "./src/svg/SvgTrain.ts":
/*!*****************************!*\
  !*** ./src/svg/SvgTrain.ts ***!
  \*****************************/
/*! exports provided: SvgTrain */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgTrain", function() { return SvgTrain; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Station */ "./src/Station.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Instant */ "./src/Instant.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgNetwork */ "./src/svg/SvgNetwork.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");






class SvgTrain {
    constructor(element) {
        this.element = element;
        this._stops = [];
        this.boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_4__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
    }
    get name() {
        return this.element.dataset.train || '';
    }
    get from() {
        return this.getInstant('from');
    }
    get to() {
        return this.getInstant('to');
    }
    get length() {
        if (this.element.dataset.length == undefined) {
            return 2;
        }
        return parseInt(this.element.dataset.length);
    }
    get stops() {
        var _a;
        if (this._stops.length == 0) {
            const tokens = ((_a = this.element.dataset.stops) === null || _a === void 0 ? void 0 : _a.split(/\s+/)) || [];
            let nextStop = new _Station__WEBPACK_IMPORTED_MODULE_1__["Stop"]('', '');
            for (var i = 0; i < (tokens === null || tokens === void 0 ? void 0 : tokens.length); i++) {
                if (tokens[i][0] != '-' && tokens[i][0] != '+' && tokens[i][0] != '*') {
                    nextStop.stationId = tokens[i];
                    this._stops.push(nextStop);
                    nextStop = new _Station__WEBPACK_IMPORTED_MODULE_1__["Stop"]('', '');
                }
                else {
                    nextStop.trackInfo = tokens[i];
                }
            }
        }
        return this._stops;
    }
    getInstant(fromOrTo) {
        var _a;
        if (this.element.dataset[fromOrTo] != undefined) {
            const arr = (_a = this.element.dataset[fromOrTo]) === null || _a === void 0 ? void 0 : _a.split(/\s+/);
            if (arr != undefined) {
                return _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].from(arr);
            }
        }
        return _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG;
    }
    draw(delaySeconds, animate, follow) {
        if (delaySeconds > 0) {
            const train = this;
            window.setTimeout(function () { train.draw(0, animate, follow); }, delaySeconds * 1000);
            return;
        }
        this.createPath(this.calcTrainHinges(this.getPathLength(follow).lengthToStart, follow.path));
        this.element.className.baseVal += ' train';
        this.element.style.visibility = 'visible';
    }
    move(delaySeconds, animationDurationSeconds, follow) {
        if (delaySeconds > 0) {
            const train = this;
            window.setTimeout(function () { train.move(0, animationDurationSeconds, follow); }, delaySeconds * 1000);
            return;
        }
        const pathLength = this.getPathLength(follow);
        this.animateFrame(follow.path, pathLength.totalBoundedLength, pathLength.lengthToStart, (-delaySeconds) / animationDurationSeconds, 1 / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS);
    }
    getPathLength(follow) {
        let lengthToStart = 0;
        let totalBoundedLength = 0;
        for (let i = 0; i < follow.path.length - 1; i++) {
            const l = follow.path[i].delta(follow.path[i + 1]).length;
            if (i < follow.from) {
                lengthToStart += l;
            }
            else if (i < follow.to) {
                totalBoundedLength += l;
            }
        }
        return { lengthToStart: lengthToStart, totalBoundedLength: totalBoundedLength };
    }
    getPositionByLength(current, path) {
        let thresh = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const delta = path[i].delta(path[i + 1]);
            const l = delta.length;
            if (thresh + l >= current) {
                return path[i].between(path[i + 1], (current - thresh) / l).add(delta.rotate(new _Rotation__WEBPACK_IMPORTED_MODULE_5__["Rotation"](90)).withLength(SvgTrain.TRACK_OFFSET));
            }
            thresh += l;
        }
        return path[path.length - 1];
    }
    erase(delaySeconds) {
        if (delaySeconds > 0) {
            const train = this;
            window.setTimeout(function () { train.erase(0); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'hidden';
    }
    createPath(path) {
        const d = 'M' + path.map(v => v.x + ',' + v.y).join(' L');
        this.element.setAttribute('d', d);
    }
    calcTrainHinges(front, path) {
        const newTrain = [];
        for (let i = 0; i < this.length + 1; i++) {
            newTrain.push(this.getPositionByLength(front - i * SvgTrain.WAGON_LENGTH, path));
        }
        return newTrain;
    }
    ease(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    animateFrame(path, totalBoundedLength, from, x, animationPerFrame) {
        const current = from + this.ease(x) * totalBoundedLength;
        const train = this.calcTrainHinges(current, path);
        this.createPath(train);
        x += animationPerFrame;
        if (x < 1) {
            const train = this;
            window.requestAnimationFrame(function () { train.animateFrame(path, totalBoundedLength, from, x, animationPerFrame); });
        }
    }
}
SvgTrain.WAGON_LENGTH = 10;
SvgTrain.TRACK_OFFSET = 0;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQXJyaXZhbERlcGFydHVyZVRpbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JvdW5kaW5nQm94LnRzIiwid2VicGFjazovLy8uL3NyYy9HZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR3Jhdml0YXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW5zdGFudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9TdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9UcmFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvWm9vbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdMYWJlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdOZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1RyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtR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QUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSw0Q0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO1NBQzNCO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDMUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxJQUFZLEVBQUUsSUFBWTtRQUM5QyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVPLFlBQVksQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7UUFDbkQsT0FBTyw0Q0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksNENBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLDRDQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksNENBQUss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QUM1QyxDQUFDO0lBRU8sWUFBWSxDQUFDLElBQWMsRUFBRSxrQkFBMEIsRUFBRSxJQUFZLEVBQUUsQ0FBUyxFQUFFLGlCQUF5QjtRQUMvRyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUN6RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZCLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztRQUV2QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbkIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0g7SUFDTCxDQUFDOztBQXBKTSxxQkFBWSxHQUFHLEVBQUUsQ0FBQztBQUNsQixxQkFBWSxHQUFHLENBQUMsQ0FBQyIsImZpbGUiOiJuZXR3b3JrLWFuaW1hdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gICAgKGZhY3RvcnkoKGdsb2JhbC5mbWluID0gZ2xvYmFsLmZtaW4gfHwge30pKSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKiBmaW5kcyB0aGUgemVyb3Mgb2YgYSBmdW5jdGlvbiwgZ2l2ZW4gdHdvIHN0YXJ0aW5nIHBvaW50cyAod2hpY2ggbXVzdFxuICAgICAqIGhhdmUgb3Bwb3NpdGUgc2lnbnMgKi9cbiAgICBmdW5jdGlvbiBiaXNlY3QoZiwgYSwgYiwgcGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJzLm1heEl0ZXJhdGlvbnMgfHwgMTAwLFxuICAgICAgICAgICAgdG9sZXJhbmNlID0gcGFyYW1ldGVycy50b2xlcmFuY2UgfHwgMWUtMTAsXG4gICAgICAgICAgICBmQSA9IGYoYSksXG4gICAgICAgICAgICBmQiA9IGYoYiksXG4gICAgICAgICAgICBkZWx0YSA9IGIgLSBhO1xuXG4gICAgICAgIGlmIChmQSAqIGZCID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgXCJJbml0aWFsIGJpc2VjdCBwb2ludHMgbXVzdCBoYXZlIG9wcG9zaXRlIHNpZ25zXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZkEgPT09IDApIHJldHVybiBhO1xuICAgICAgICBpZiAoZkIgPT09IDApIHJldHVybiBiO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBkZWx0YSAvPSAyO1xuICAgICAgICAgICAgdmFyIG1pZCA9IGEgKyBkZWx0YSxcbiAgICAgICAgICAgICAgICBmTWlkID0gZihtaWQpO1xuXG4gICAgICAgICAgICBpZiAoZk1pZCAqIGZBID49IDApIHtcbiAgICAgICAgICAgICAgICBhID0gbWlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKE1hdGguYWJzKGRlbHRhKSA8IHRvbGVyYW5jZSkgfHwgKGZNaWQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYSArIGRlbHRhO1xuICAgIH1cblxuICAgIC8vIG5lZWQgc29tZSBiYXNpYyBvcGVyYXRpb25zIG9uIHZlY3RvcnMsIHJhdGhlciB0aGFuIGFkZGluZyBhIGRlcGVuZGVuY3ksXG4gICAgLy8ganVzdCBkZWZpbmUgaGVyZVxuICAgIGZ1bmN0aW9uIHplcm9zKHgpIHsgdmFyIHIgPSBuZXcgQXJyYXkoeCk7IGZvciAodmFyIGkgPSAwOyBpIDwgeDsgKytpKSB7IHJbaV0gPSAwOyB9IHJldHVybiByOyB9XG4gICAgZnVuY3Rpb24gemVyb3NNKHgseSkgeyByZXR1cm4gemVyb3MoeCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gemVyb3MoeSk7IH0pOyB9XG5cbiAgICBmdW5jdGlvbiBkb3QoYSwgYikge1xuICAgICAgICB2YXIgcmV0ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtMihhKSAge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGRvdChhLCBhKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUocmV0LCB2YWx1ZSwgYykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXRbaV0gPSB2YWx1ZVtpXSAqIGM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWlnaHRlZFN1bShyZXQsIHcxLCB2MSwgdzIsIHYyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmV0Lmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICByZXRbal0gPSB3MSAqIHYxW2pdICsgdzIgKiB2MltqXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBtaW5pbWl6ZXMgYSBmdW5jdGlvbiB1c2luZyB0aGUgZG93bmhpbGwgc2ltcGxleCBtZXRob2QgKi9cbiAgICBmdW5jdGlvbiBuZWxkZXJNZWFkKGYsIHgwLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuXG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1ldGVycy5tYXhJdGVyYXRpb25zIHx8IHgwLmxlbmd0aCAqIDIwMCxcbiAgICAgICAgICAgIG5vblplcm9EZWx0YSA9IHBhcmFtZXRlcnMubm9uWmVyb0RlbHRhIHx8IDEuMDUsXG4gICAgICAgICAgICB6ZXJvRGVsdGEgPSBwYXJhbWV0ZXJzLnplcm9EZWx0YSB8fCAwLjAwMSxcbiAgICAgICAgICAgIG1pbkVycm9yRGVsdGEgPSBwYXJhbWV0ZXJzLm1pbkVycm9yRGVsdGEgfHwgMWUtNixcbiAgICAgICAgICAgIG1pblRvbGVyYW5jZSA9IHBhcmFtZXRlcnMubWluRXJyb3JEZWx0YSB8fCAxZS01LFxuICAgICAgICAgICAgcmhvID0gKHBhcmFtZXRlcnMucmhvICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5yaG8gOiAxLFxuICAgICAgICAgICAgY2hpID0gKHBhcmFtZXRlcnMuY2hpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5jaGkgOiAyLFxuICAgICAgICAgICAgcHNpID0gKHBhcmFtZXRlcnMucHNpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5wc2kgOiAtMC41LFxuICAgICAgICAgICAgc2lnbWEgPSAocGFyYW1ldGVycy5zaWdtYSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMuc2lnbWEgOiAwLjUsXG4gICAgICAgICAgICBtYXhEaWZmO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgc2ltcGxleC5cbiAgICAgICAgdmFyIE4gPSB4MC5sZW5ndGgsXG4gICAgICAgICAgICBzaW1wbGV4ID0gbmV3IEFycmF5KE4gKyAxKTtcbiAgICAgICAgc2ltcGxleFswXSA9IHgwO1xuICAgICAgICBzaW1wbGV4WzBdLmZ4ID0gZih4MCk7XG4gICAgICAgIHNpbXBsZXhbMF0uaWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0geDAuc2xpY2UoKTtcbiAgICAgICAgICAgIHBvaW50W2ldID0gcG9pbnRbaV0gPyBwb2ludFtpXSAqIG5vblplcm9EZWx0YSA6IHplcm9EZWx0YTtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXSA9IHBvaW50O1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdLmZ4ID0gZihwb2ludCk7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0uaWQgPSBpKzE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVTaW1wbGV4KHZhbHVlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2ltcGxleFtOXVtpXSA9IHZhbHVlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2ltcGxleFtOXS5meCA9IHZhbHVlLmZ4O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNvcnRPcmRlciA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEuZnggLSBiLmZ4OyB9O1xuXG4gICAgICAgIHZhciBjZW50cm9pZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICByZWZsZWN0ZWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgY29udHJhY3RlZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICBleHBhbmRlZCA9IHgwLnNsaWNlKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgbWF4SXRlcmF0aW9uczsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgIHNpbXBsZXguc29ydChzb3J0T3JkZXIpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgLy8gY29weSB0aGUgc2ltcGxleCAoc2luY2UgbGF0ZXIgaXRlcmF0aW9ucyB3aWxsIG11dGF0ZSkgYW5kXG4gICAgICAgICAgICAgICAgLy8gc29ydCBpdCB0byBoYXZlIGEgY29uc2lzdGVudCBvcmRlciBiZXR3ZWVuIGl0ZXJhdGlvbnNcbiAgICAgICAgICAgICAgICB2YXIgc29ydGVkU2ltcGxleCA9IHNpbXBsZXgubWFwKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHguc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnggPSB4LmZ4O1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pZCA9IHguaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzb3J0ZWRTaW1wbGV4LnNvcnQoZnVuY3Rpb24oYSxiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG5cbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmhpc3RvcnkucHVzaCh7eDogc2ltcGxleFswXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogc2ltcGxleFswXS5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxleDogc29ydGVkU2ltcGxleH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXhEaWZmID0gMDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtYXhEaWZmID0gTWF0aC5tYXgobWF4RGlmZiwgTWF0aC5hYnMoc2ltcGxleFswXVtpXSAtIHNpbXBsZXhbMV1baV0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChNYXRoLmFicyhzaW1wbGV4WzBdLmZ4IC0gc2ltcGxleFtOXS5meCkgPCBtaW5FcnJvckRlbHRhKSAmJlxuICAgICAgICAgICAgICAgIChtYXhEaWZmIDwgbWluVG9sZXJhbmNlKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wdXRlIHRoZSBjZW50cm9pZCBvZiBhbGwgYnV0IHRoZSB3b3JzdCBwb2ludCBpbiB0aGUgc2ltcGxleFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSArPSBzaW1wbGV4W2pdW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSAvPSBOO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZWZsZWN0IHRoZSB3b3JzdCBwb2ludCBwYXN0IHRoZSBjZW50cm9pZCAgYW5kIGNvbXB1dGUgbG9zcyBhdCByZWZsZWN0ZWRcbiAgICAgICAgICAgIC8vIHBvaW50XG4gICAgICAgICAgICB2YXIgd29yc3QgPSBzaW1wbGV4W05dO1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0ocmVmbGVjdGVkLCAxK3JobywgY2VudHJvaWQsIC1yaG8sIHdvcnN0KTtcbiAgICAgICAgICAgIHJlZmxlY3RlZC5meCA9IGYocmVmbGVjdGVkKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlZmxlY3RlZCBwb2ludCBpcyB0aGUgYmVzdCBzZWVuLCB0aGVuIHBvc3NpYmx5IGV4cGFuZFxuICAgICAgICAgICAgaWYgKHJlZmxlY3RlZC5meCA8IHNpbXBsZXhbMF0uZngpIHtcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShleHBhbmRlZCwgMStjaGksIGNlbnRyb2lkLCAtY2hpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgZXhwYW5kZWQuZnggPSBmKGV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwYW5kZWQuZnggPCByZWZsZWN0ZWQuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgocmVmbGVjdGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWZsZWN0ZWQgcG9pbnQgaXMgd29yc2UgdGhhbiB0aGUgc2Vjb25kIHdvcnN0LCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBjb250cmFjdFxuICAgICAgICAgICAgZWxzZSBpZiAocmVmbGVjdGVkLmZ4ID49IHNpbXBsZXhbTi0xXS5meCkge1xuICAgICAgICAgICAgICAgIHZhciBzaG91bGRSZWR1Y2UgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWZsZWN0ZWQuZnggPiB3b3JzdC5meCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhbiBpbnNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMStwc2ksIGNlbnRyb2lkLCAtcHNpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHdvcnN0LmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGFuIG91dHNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMS1wc2kgKiByaG8sIGNlbnRyb2lkLCBwc2kqcmhvLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHJlZmxlY3RlZC5meCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFJlZHVjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkUmVkdWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGRvbid0IGNvbnRyYWN0IGhlcmUsIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpZ21hID49IDEpIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGEgcmVkdWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBzaW1wbGV4Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShzaW1wbGV4W2ldLCAxIC0gc2lnbWEsIHNpbXBsZXhbMF0sIHNpZ21hLCBzaW1wbGV4W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZXhbaV0uZnggPSBmKHNpbXBsZXhbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KHJlZmxlY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaW1wbGV4LnNvcnQoc29ydE9yZGVyKTtcbiAgICAgICAgcmV0dXJuIHtmeCA6IHNpbXBsZXhbMF0uZngsXG4gICAgICAgICAgICAgICAgeCA6IHNpbXBsZXhbMF19O1xuICAgIH1cblxuICAgIC8vLyBzZWFyY2hlcyBhbG9uZyBsaW5lICdwaycgZm9yIGEgcG9pbnQgdGhhdCBzYXRpZmllcyB0aGUgd29sZmUgY29uZGl0aW9uc1xuICAgIC8vLyBTZWUgJ051bWVyaWNhbCBPcHRpbWl6YXRpb24nIGJ5IE5vY2VkYWwgYW5kIFdyaWdodCBwNTktNjBcbiAgICAvLy8gZiA6IG9iamVjdGl2ZSBmdW5jdGlvblxuICAgIC8vLyBwayA6IHNlYXJjaCBkaXJlY3Rpb25cbiAgICAvLy8gY3VycmVudDogb2JqZWN0IGNvbnRhaW5pbmcgY3VycmVudCBncmFkaWVudC9sb3NzXG4gICAgLy8vIG5leHQ6IG91dHB1dDogY29udGFpbnMgbmV4dCBncmFkaWVudC9sb3NzXG4gICAgLy8vIHJldHVybnMgYTogc3RlcCBzaXplIHRha2VuXG4gICAgZnVuY3Rpb24gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhLCBjMSwgYzIpIHtcbiAgICAgICAgdmFyIHBoaTAgPSBjdXJyZW50LmZ4LCBwaGlQcmltZTAgPSBkb3QoY3VycmVudC5meHByaW1lLCBwayksXG4gICAgICAgICAgICBwaGkgPSBwaGkwLCBwaGlfb2xkID0gcGhpMCxcbiAgICAgICAgICAgIHBoaVByaW1lID0gcGhpUHJpbWUwLFxuICAgICAgICAgICAgYTAgPSAwO1xuXG4gICAgICAgIGEgPSBhIHx8IDE7XG4gICAgICAgIGMxID0gYzEgfHwgMWUtNjtcbiAgICAgICAgYzIgPSBjMiB8fCAwLjE7XG5cbiAgICAgICAgZnVuY3Rpb24gem9vbShhX2xvLCBhX2hpZ2gsIHBoaV9sbykge1xuICAgICAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgMTY7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgYSA9IChhX2xvICsgYV9oaWdoKS8yO1xuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKG5leHQueCwgMS4wLCBjdXJyZW50LngsIGEsIHBrKTtcbiAgICAgICAgICAgICAgICBwaGkgPSBuZXh0LmZ4ID0gZihuZXh0LngsIG5leHQuZnhwcmltZSk7XG4gICAgICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHBoaSA+PSBwaGlfbG8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGFfaGlnaCA9IGE7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHBoaVByaW1lKSA8PSAtYzIgKiBwaGlQcmltZTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBoaVByaW1lICogKGFfaGlnaCAtIGFfbG8pID49MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYV9oaWdoID0gYV9sbztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGFfbG8gPSBhO1xuICAgICAgICAgICAgICAgICAgICBwaGlfbG8gPSBwaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IDEwOyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0obmV4dC54LCAxLjAsIGN1cnJlbnQueCwgYSwgcGspO1xuICAgICAgICAgICAgcGhpID0gbmV4dC5meCA9IGYobmV4dC54LCBuZXh0LmZ4cHJpbWUpO1xuICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG4gICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAoaXRlcmF0aW9uICYmIChwaGkgPj0gcGhpX29sZCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb20oYTAsIGEsIHBoaV9vbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMocGhpUHJpbWUpIDw9IC1jMiAqIHBoaVByaW1lMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhpUHJpbWUgPj0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbShhLCBhMCwgcGhpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGhpX29sZCA9IHBoaTtcbiAgICAgICAgICAgIGEwID0gYTtcbiAgICAgICAgICAgIGEgKj0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmp1Z2F0ZUdyYWRpZW50KGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICAvLyBhbGxvY2F0ZSBhbGwgbWVtb3J5IHVwIGZyb250IGhlcmUsIGtlZXAgb3V0IG9mIHRoZSBsb29wIGZvciBwZXJmb21hbmNlXG4gICAgICAgIC8vIHJlYXNvbnNcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG5leHQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIHlrID0gaW5pdGlhbC5zbGljZSgpLFxuICAgICAgICAgICAgcGssIHRlbXAsXG4gICAgICAgICAgICBhID0gMSxcbiAgICAgICAgICAgIG1heEl0ZXJhdGlvbnM7XG5cbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAyMDtcblxuICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgIHBrID0gY3VycmVudC5meHByaW1lLnNsaWNlKCk7XG4gICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsLTEpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBhID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhKTtcblxuICAgICAgICAgICAgLy8gdG9kbzogaGlzdG9yeSBpbiB3cm9uZyBzcG90P1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGF9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhKSB7XG4gICAgICAgICAgICAgICAgLy8gZmFpaWxlZCB0byBmaW5kIHBvaW50IHRoYXQgc2F0aWZpZXMgd29sZmUgY29uZGl0aW9ucy5cbiAgICAgICAgICAgICAgICAvLyByZXNldCBkaXJlY3Rpb24gZm9yIG5leHQgaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBkaXJlY3Rpb24gdXNpbmcgUG9sYWvigJNSaWJpZXJlIENHIG1ldGhvZFxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHlrLCAxLCBuZXh0LmZ4cHJpbWUsIC0xLCBjdXJyZW50LmZ4cHJpbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlbHRhX2sgPSBkb3QoY3VycmVudC5meHByaW1lLCBjdXJyZW50LmZ4cHJpbWUpLFxuICAgICAgICAgICAgICAgICAgICBiZXRhX2sgPSBNYXRoLm1heCgwLCBkb3QoeWssIG5leHQuZnhwcmltZSkgLyBkZWx0YV9rKTtcblxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHBrLCBiZXRhX2ssIHBrLCAtMSwgbmV4dC5meHByaW1lKTtcblxuICAgICAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50O1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgICAgIG5leHQgPSB0ZW1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9ybTIoY3VycmVudC5meHByaW1lKSA8PSAxZS01KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBhfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncmFkaWVudERlc2NlbnQoZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDEwMCxcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHBhcmFtcy5sZWFyblJhdGUgfHwgMC4wMDEsXG4gICAgICAgICAgICBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlaWdodGVkU3VtKGN1cnJlbnQueCwgMSwgY3VycmVudC54LCAtbGVhcm5SYXRlLCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICAgICAgaWYgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPD0gMWUtNSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbmV4dCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMTAwLFxuICAgICAgICAgICAgbGVhcm5SYXRlID0gcGFyYW1zLmxlYXJuUmF0ZSB8fCAxLFxuICAgICAgICAgICAgcGsgPSBpbml0aWFsLnNsaWNlKCksXG4gICAgICAgICAgICBjMSA9IHBhcmFtcy5jMSB8fCAxZS0zLFxuICAgICAgICAgICAgYzIgPSBwYXJhbXMuYzIgfHwgMC4xLFxuICAgICAgICAgICAgdGVtcCxcbiAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIC8vIHdyYXAgdGhlIGZ1bmN0aW9uIGNhbGwgdG8gdHJhY2sgbGluZXNlYXJjaCBzYW1wbGVzXG4gICAgICAgICAgICB2YXIgaW5uZXIgPSBmO1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKHgsIGZ4cHJpbWUpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzLnB1c2goeC5zbGljZSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5uZXIoeCwgZnhwcmltZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuICAgICAgICAgICAgbGVhcm5SYXRlID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBsZWFyblJhdGUsIGMxLCBjMik7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHM6IGZ1bmN0aW9uQ2FsbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhcm5SYXRlOiBsZWFyblJhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGxlYXJuUmF0ZX0pO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB0ZW1wID0gY3VycmVudDtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgbmV4dCA9IHRlbXA7XG5cbiAgICAgICAgICAgIGlmICgobGVhcm5SYXRlID09PSAwKSB8fCAobm9ybTIoY3VycmVudC5meHByaW1lKSA8IDFlLTUpKSBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGV4cG9ydHMuYmlzZWN0ID0gYmlzZWN0O1xuICAgIGV4cG9ydHMubmVsZGVyTWVhZCA9IG5lbGRlck1lYWQ7XG4gICAgZXhwb3J0cy5jb25qdWdhdGVHcmFkaWVudCA9IGNvbmp1Z2F0ZUdyYWRpZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50ID0gZ3JhZGllbnREZXNjZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaCA9IGdyYWRpZW50RGVzY2VudExpbmVTZWFyY2g7XG4gICAgZXhwb3J0cy56ZXJvcyA9IHplcm9zO1xuICAgIGV4cG9ydHMuemVyb3NNID0gemVyb3NNO1xuICAgIGV4cG9ydHMubm9ybTIgPSBub3JtMjtcbiAgICBleHBvcnRzLndlaWdodGVkU3VtID0gd2VpZ2h0ZWRTdW07XG4gICAgZXhwb3J0cy5zY2FsZSA9IHNjYWxlO1xuXG59KSk7IiwiZXhwb3J0IGNsYXNzIEFycml2YWxEZXBhcnR1cmVUaW1lIHtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlKG9mZnNldDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3BsaXQgPSB0aGlzLnZhbHVlLnNwbGl0KC8oWy0rXSkvKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHNwbGl0W29mZnNldF0pICogKHNwbGl0W29mZnNldC0xXSA9PSAnLScgPyAtMSA6IDEpXG4gICAgfVxuXG4gICAgZ2V0IGRlcGFydHVyZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZSgyKTtcbiAgICB9XG5cbiAgICBnZXQgYXJyaXZhbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZSg0KTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgY2xhc3MgQm91bmRpbmdCb3gge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0bDogVmVjdG9yLCBwdWJsaWMgYnI6IFZlY3Rvcikge1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKHRsX3g6IG51bWJlciwgdGxfeTogbnVtYmVyLCBicl94OiBudW1iZXIsIGJyX3k6IG51bWJlcik6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHRsX3gsIHRsX3kpLCBuZXcgVmVjdG9yKGJyX3gsIGJyX3kpKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IGRpbWVuc2lvbnMoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGwuZGVsdGEodGhpcy5icik7XG4gICAgfVxuICAgIGlzTnVsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGwgPT0gVmVjdG9yLk5VTEwgfHwgdGhpcy5iciA9PSBWZWN0b3IuTlVMTDtcbiAgICB9XG4gICAgXG4gICAgY2FsY3VsYXRlQm91bmRpbmdCb3hGb3Jab29tKHBlcmNlbnRYOiBudW1iZXIsIHBlcmNlbnRZOiBudW1iZXIpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzO1xuICAgICAgICBjb25zdCBkZWx0YSA9IGJib3guZGltZW5zaW9ucztcbiAgICAgICAgY29uc3QgcmVsYXRpdmVDZW50ZXIgPSBuZXcgVmVjdG9yKHBlcmNlbnRYIC8gMTAwLCBwZXJjZW50WSAvIDEwMCk7XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IGJib3gudGwuYWRkKG5ldyBWZWN0b3IoZGVsdGEueCAqIHJlbGF0aXZlQ2VudGVyLngsIGRlbHRhLnkgKiByZWxhdGl2ZUNlbnRlci55KSk7XG4gICAgICAgIGNvbnN0IGVkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIE1hdGgubWluKHJlbGF0aXZlQ2VudGVyLngsIDEgLSByZWxhdGl2ZUNlbnRlci54KSwgZGVsdGEueSAqIE1hdGgubWluKHJlbGF0aXZlQ2VudGVyLnksIDEgLSByZWxhdGl2ZUNlbnRlci55KSk7XG4gICAgICAgIGNvbnN0IHJhdGlvUHJlc2VydmluZ0VkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoZWRnZURpc3RhbmNlLnkgKiBkZWx0YS54IC8gZGVsdGEueSwgZWRnZURpc3RhbmNlLnggKiBkZWx0YS55IC8gZGVsdGEueCk7XG4gICAgICAgIGNvbnN0IG1pbmltYWxFZGdlRGlzdGFuY2UgPSBuZXcgVmVjdG9yKE1hdGgubWluKGVkZ2VEaXN0YW5jZS54LCByYXRpb1ByZXNlcnZpbmdFZGdlRGlzdGFuY2UueCksIE1hdGgubWluKGVkZ2VEaXN0YW5jZS55LCByYXRpb1ByZXNlcnZpbmdFZGdlRGlzdGFuY2UueSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KGNlbnRlci5hZGQobmV3IFZlY3RvcigtbWluaW1hbEVkZ2VEaXN0YW5jZS54LCAtbWluaW1hbEVkZ2VEaXN0YW5jZS55KSksIGNlbnRlci5hZGQobWluaW1hbEVkZ2VEaXN0YW5jZSkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgWm9vbWVyIH0gZnJvbSBcIi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNUaW1lZERyYXdhYmxlQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94O1xuICAgIHpvb206IFZlY3RvcjtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlcik6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgR2VuZXJpY1RpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTEFCRUxfSEVJR0hUID0gMTI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IEdlbmVyaWNUaW1lZERyYXdhYmxlQWRhcHRlcikge1xuXG4gICAgfVxuXG4gICAgZnJvbSA9IHRoaXMuYWRhcHRlci5mcm9tO1xuICAgIHRvID0gdGhpcy5hZGFwdGVyLnRvO1xuICAgIG5hbWUgPSB0aGlzLmFkYXB0ZXIubmFtZTtcbiAgICBib3VuZGluZ0JveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHpvb21lciA9IG5ldyBab29tZXIodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgICAgIHpvb21lci5pbmNsdWRlKHRoaXMuZ2V0Wm9vbWVkQm91bmRpbmdCb3goKSwgSW5zdGFudC5CSUdfQkFORywgSW5zdGFudC5CSUdfQkFORywgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgdGhpcy5hZGFwdGVyLmZyb20uZGVsdGEodGhpcy5hZGFwdGVyLnRvKSwgem9vbWVyLmNlbnRlciwgem9vbWVyLnNjYWxlKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Wm9vbWVkQm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBiYm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuYWRhcHRlci56b29tO1xuICAgICAgICBpZiAoY2VudGVyICE9IFZlY3Rvci5OVUxMKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tQmJveCA9IGJib3guY2FsY3VsYXRlQm91bmRpbmdCb3hGb3Jab29tKGNlbnRlci54LCBjZW50ZXIueSk7XG4gICAgICAgICAgICByZXR1cm4gem9vbUJib3g7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJib3g7XG4gICAgfVxuXG4gICAgXG59IiwiaW1wb3J0IHsgU3RhdGlvbiwgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcblxuLy9jb25zdCBtYXRoanMgPSByZXF1aXJlKCdtYXRoanMnKTtcbmNvbnN0IGZtaW4gPSByZXF1aXJlKCdmbWluJyk7XG5cblxuZXhwb3J0IGNsYXNzIEdyYXZpdGF0b3Ige1xuICAgIHN0YXRpYyBJTkVSVE5FU1MgPSAxMDA7XG4gICAgc3RhdGljIEdSQURJRU5UX1NDQUxFID0gMC4wMDAwMDAwMDE7XG4gICAgc3RhdGljIERFVklBVElPTl9XQVJOSU5HID0gMC4yO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFX1JFTEFUSVZFX1RPX0VVQ0xJRElBTl9ESVNUQU5DRSA9IHRydWU7XG4gICAgc3RhdGljIFNQRUVEID0gMjUwO1xuICAgIHN0YXRpYyBNQVhfQU5JTV9EVVJBVElPTiA9IDY7XG4gICAgc3RhdGljIENPTE9SX0RFVklBVElPTiA9IDAuMDI7XG5cbiAgICBwcml2YXRlIGluaXRpYWxXZWlnaHRGYWN0b3JzOiB7W2lkOiBzdHJpbmddIDogbnVtYmVyfSA9IHt9O1xuICAgIHByaXZhdGUgaW5pdGlhbEFuZ2xlczoge2FTdGF0aW9uOiBzdHJpbmcsIGNvbW1vblN0YXRpb246IHN0cmluZywgYlN0YXRpb246IHN0cmluZywgYW5nbGU6IG51bWJlcn1bXSA9IFtdO1xuICAgIHByaXZhdGUgYW5nbGVGOiBhbnk7XG4gICAgcHJpdmF0ZSBhbmdsZUZQcmltZToge1tpZDogc3RyaW5nXTogYW55fSA9IHt9O1xuICAgIHByaXZhdGUgYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvOiBudW1iZXIgPSAtMTtcbiAgICBwcml2YXRlIGVkZ2VzOiB7W2lkOiBzdHJpbmddOiBMaW5lfSA9IHt9O1xuICAgIHByaXZhdGUgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvciwgc3RhcnRDb29yZHM6IFZlY3Rvcn19ID0ge307XG4gICAgcHJpdmF0ZSBkaXJ0eSA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBzdGF0aW9uUHJvdmlkZXI6IFN0YXRpb25Qcm92aWRlcikge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBncmF2aXRhdGUoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICghdGhpcy5kaXJ0eSlcbiAgICAgICAgICAgIHJldHVybiBkZWxheTtcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplR3JhcGgoKTtcbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSB0aGlzLm1pbmltaXplTG9zcygpO1xuICAgICAgICB0aGlzLmFzc2VydERpc3RhbmNlcyhzb2x1dGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVTdGF0aW9uc0FuZExpbmVzKHNvbHV0aW9uLCBkZWxheSwgYW5pbWF0ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplKCkge1xuICAgICAgICBjb25zdCB3ZWlnaHRzID0gdGhpcy5nZXRXZWlnaHRzU3VtKCk7XG4gICAgICAgIGNvbnN0IGV1Y2xpZGlhbiA9IHRoaXMuZ2V0RXVjbGlkaWFuRGlzdGFuY2VTdW0oKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3dlaWdodHM6Jywgd2VpZ2h0cywgJ2V1Y2xpZGlhbjonLCBldWNsaWRpYW4pO1xuICAgICAgICBpZiAodGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8gPT0gLTEgJiYgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyA9IHdlaWdodHMgLyBldWNsaWRpYW47XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvXi0xJywgMS90aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyk7XG5cbiAgICAgICAgICAgIC8vdGhpcy5pbml0aWFsaXplQW5nbGVHcmFkaWVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICAvKnByaXZhdGUgaW5pdGlhbGl6ZUFuZ2xlR3JhZGllbnRzKCkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gJyhhY29zKCgoYl94LWFfeCkqKGJfeC1jX3gpKyhiX3ktYV95KSooYl95LWNfeSkpLyhzcXJ0KChiX3gtYV94KV4yKyhiX3ktYV95KV4yKSpzcXJ0KChiX3gtY194KV4yKyhiX3ktY195KV4yKSkpKigoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpL2FicygoKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKSktY29uc3QpJztcbiAgICAgICAgY29uc3QgZiA9IG1hdGhqcy5wYXJzZShleHByZXNzaW9uKTtcbiAgICAgICAgdGhpcy5hbmdsZUYgPSBmLmNvbXBpbGUoKTtcblxuICAgICAgICBjb25zdCBmRGVsdGEgPSBtYXRoanMucGFyc2UoZXhwcmVzc2lvbiArICdeMicpO1xuXG4gICAgICAgIGNvbnN0IHZhcnMgPSBbJ2FfeCcsICdhX3knLCAnYl94JywgJ2JfeScsICdjX3gnLCAnY195J107XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx2YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFuZ2xlRlByaW1lW3ZhcnNbaV1dID0gbWF0aGpzLmRlcml2YXRpdmUoZkRlbHRhLCB2YXJzW2ldKS5jb21waWxlKCk7XG4gICAgICAgIH1cbiAgICB9Ki9cblxuICAgIHByaXZhdGUgZ2V0V2VpZ2h0c1N1bSgpIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gZWRnZS53ZWlnaHQgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RXVjbGlkaWFuRGlzdGFuY2VTdW0oKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IHRoaXMuZWRnZVZlY3RvcihlZGdlKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVkZ2VWZWN0b3IoZWRnZTogTGluZSk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3Jkcy5kZWx0YSh0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3Jkcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplR3JhcGgoKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldID0gR3Jhdml0YXRvci5JTklUSUFMSVpFX1JFTEFUSVZFX1RPX0VVQ0xJRElBTl9ESVNUQU5DRVxuICAgICAgICAgICAgICAgICAgICA/IDEgLyB0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpb1xuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZWRnZVZlY3RvcihlZGdlKS5sZW5ndGggLyAoZWRnZS53ZWlnaHQgfHwgMCk7XG4gICAgICAgICAgICAgICAgLy90aGlzLmFkZEluaXRpYWxBbmdsZXMoZWRnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXguaW5kZXggPSBuZXcgVmVjdG9yKGksIGkrMSk7XG4gICAgICAgICAgICBpICs9IDI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEluaXRpYWxBbmdsZXMoZWRnZTogTGluZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGFkamFjZW50IG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGlmIChhZGphY2VudCA9PSBlZGdlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8MjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPDI7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWRnZS50ZXJtaW5pW2ldLnN0YXRpb25JZCA9PSBhZGphY2VudC50ZXJtaW5pW2pdLnN0YXRpb25JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLnRocmVlRG90QW5nbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbaV4xXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVtpXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzW2FkamFjZW50LnRlcm1pbmlbal4xXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3Jkc1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbEFuZ2xlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3RhdGlvbjogZWRnZS50ZXJtaW5pW2leMV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vblN0YXRpb246IGVkZ2UudGVybWluaVtpXS5zdGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYlN0YXRpb246IGFkamFjZW50LnRlcm1pbmlbal4xXS5zdGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL2Rlcml2ZSBhcmNjb3MoKChhLWMpKihlLWcpKyhiLWQpKihmLWgpKS8oc3FydCgoYS1jKV4yKyhiLWQpXjIpKnNxcnQoKGUtZyleMisoZi1oKV4yKSkpKigoZi1oKSooYS1jKS0oYi1kKSooZS1nKSkvfCgoZi1oKSooYS1jKS0oYi1kKSooZS1nKSl8XG4gICAgICAgIC8vZGVyaXZlIGFjb3MoKChiX3gtYV94KSooYl94LWNfeCkrKGJfeS1hX3kpKihiX3ktY195KSkvKHNxcnQoKGJfeC1hX3gpXjIrKGJfeS1hX3kpXjIpKnNxcnQoKGJfeC1jX3gpXjIrKGJfeS1jX3kpXjIpKSkqKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkvYWJzKCgoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpKVxuICAgIH1cblxuICAgIHByaXZhdGUgdGhyZWVEb3RBbmdsZShhOiBWZWN0b3IsIGI6IFZlY3RvciwgYzogVmVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRiwgYSwgYiwgYywgMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24oZjogYW55LCBhOiBWZWN0b3IsIGI6IFZlY3RvciwgYzogVmVjdG9yLCBvbGRWYWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBmLmV2YWx1YXRlKHthX3g6IGEueCwgYV95OiBhLnksIGJfeDogYi54LCBiX3k6IGIueSwgY194OiBjLngsIGNfeTogYy55LCBjb25zdDogb2xkVmFsdWV9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1pbmltaXplTG9zcygpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IGdyYXZpdGF0b3IgPSB0aGlzO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7aGlzdG9yeTogW119O1xuICAgICAgICBjb25zdCBzdGFydDogbnVtYmVyW10gPSB0aGlzLnN0YXJ0U3RhdGlvblBvc2l0aW9ucygpO1xuICAgICAgICBjb25zdCBzb2x1dGlvbiA9IGZtaW4uY29uanVnYXRlR3JhZGllbnQoKEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSkgPT4ge1xuICAgICAgICAgICAgZnhwcmltZSA9IGZ4cHJpbWUgfHwgQS5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZ4cHJpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmeHByaW1lW2ldID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmeCA9IDA7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb1N0YXJ0U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5kZWx0YVRvQ3VycmVudFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICAvL2Z4ID0gdGhpcy5kZWx0YVRvQW5nbGVzVG9FbnN1cmVJbmVydG5lc3MoZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9OZXdEaXN0YW5jZXNUb0Vuc3VyZUFjY3VyYWN5KGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIHRoaXMuc2NhbGVHcmFkaWVudFRvRW5zdXJlV29ya2luZ1N0ZXBTaXplKGZ4cHJpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZ4O1xuICAgICAgICB9LCBzdGFydCwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHNvbHV0aW9uLng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydFN0YXRpb25Qb3NpdGlvbnMoKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCBzdGFydDogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgc3RhcnRbdmVydGV4LmluZGV4LnhdID0gdmVydGV4LnN0YXJ0Q29vcmRzLng7XG4gICAgICAgICAgICBzdGFydFt2ZXJ0ZXguaW5kZXgueV0gPSB2ZXJ0ZXguc3RhcnRDb29yZHMueTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhcnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVgoQTogbnVtYmVyW10sIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3J9fSwgdGVybWluaTogU3RvcFtdKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIEFbdmVydGljZXNbdGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnhdIC0gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVkoQTogbnVtYmVyW10sIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3J9fSwgdGVybWluaTogU3RvcFtdKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIEFbdmVydGljZXNbdGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnldIC0gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueV07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvU3RhcnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgZnggKz0gKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhcnRDb29yZHMueCwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhcnRDb29yZHMueSwgMilcbiAgICAgICAgICAgICAgICApICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC54XSArPSAyICogKEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGFydENvb3Jkcy54KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueV0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhcnRDb29yZHMueSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvQ3VycmVudFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IudmVydGljZXMpKSB7XG4gICAgICAgICAgICBmeCArPSAoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueCwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLnksIDIpXG4gICAgICAgICAgICAgICAgKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueF0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLngpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC55XSArPSAyICogKEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvQW5nbGVzVG9FbnN1cmVJbmVydG5lc3MoZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIE9iamVjdC52YWx1ZXMoZ3Jhdml0YXRvci5pbml0aWFsQW5nbGVzKSkge1xuICAgICAgICAgICAgY29uc3QgYSA9IG5ldyBWZWN0b3IoQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueV0pO1xuICAgICAgICAgICAgY29uc3QgYiA9IG5ldyBWZWN0b3IoQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnldKTtcbiAgICAgICAgICAgIGNvbnN0IGMgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnldKTtcblxuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRiwgYSwgYiwgYywgcGFpci5hbmdsZSk7XG4gICAgICAgICAgICBmeCArPSBNYXRoLnBvdyhkZWx0YSwgMikgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcblxuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnhdICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2FfeCddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnldICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2FfeSddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueF0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYl94J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC55XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydiX3knXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC54XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydjX3gnXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC55XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydjX3knXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvTmV3RGlzdGFuY2VzVG9FbnN1cmVBY2N1cmFjeShmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKGdyYXZpdGF0b3IuZWRnZXMpKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdiA9IE1hdGgucG93KHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICArIE1hdGgucG93KHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAtIE1hdGgucG93KGdyYXZpdGF0b3IuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSAqIChlZGdlLndlaWdodCB8fCAwKSwgMik7XG4gICAgICAgICAgICBmeCArPSBNYXRoLnBvdyh2LCAyKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC54XSArPSArNCAqIHYgKiB0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnldICs9ICs0ICogdiAqIHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueF0gKz0gLTQgKiB2ICogdGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XSArPSAtNCAqIHYgKiB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjYWxlR3JhZGllbnRUb0Vuc3VyZVdvcmtpbmdTdGVwU2l6ZShmeHByaW1lOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnhwcmltZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZnhwcmltZVtpXSAqPSBHcmF2aXRhdG9yLkdSQURJRU5UX1NDQUxFO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnREaXN0YW5jZXMoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldmlhdGlvbiA9IE1hdGguc3FydChcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyh0aGlzLmRlbHRhWChzb2x1dGlvbiwgdGhpcy52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHRoaXMuZGVsdGFZKHNvbHV0aW9uLCB0aGlzLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKVxuICAgICAgICAgICAgKSAvICh0aGlzLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gKiAoZWRnZS53ZWlnaHQgfHwgMCkpIC0gMTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkZXZpYXRpb24pID4gR3Jhdml0YXRvci5ERVZJQVRJT05fV0FSTklORykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlZGdlLm5hbWUsICdkaXZlcmdlcyBieSAnLCBkZXZpYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBcblxuICAgIHByaXZhdGUgbW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb246IG51bWJlcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID0gYW5pbWF0ZSA/IE1hdGgubWluKEdyYXZpdGF0b3IuTUFYX0FOSU1fRFVSQVRJT04sIHRoaXMuZ2V0VG90YWxEaXN0YW5jZVRvTW92ZShzb2x1dGlvbikgLyBHcmF2aXRhdG9yLlNQRUVEKSA6IDA7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHZlcnRleC5zdGF0aW9uLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgbmV3IFZlY3Rvcihzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueF0sIHNvbHV0aW9uW3ZlcnRleC5pbmRleC55XSkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZHMgPSBbdGhpcy5nZXROZXdTdGF0aW9uUG9zaXRpb24oZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZCwgc29sdXRpb24pLCB0aGlzLmdldE5ld1N0YXRpb25Qb3NpdGlvbihlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkLCBzb2x1dGlvbildO1xuICAgICAgICAgICAgZWRnZS5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIGNvb3JkcywgdGhpcy5nZXRDb2xvckJ5RGV2aWF0aW9uKGVkZ2UsIGVkZ2Uud2VpZ2h0IHx8IDApKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxheSArPSBhbmltYXRpb25EdXJhdGlvblNlY29uZHM7XG4gICAgICAgIHJldHVybiBkZWxheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvbG9yQnlEZXZpYXRpb24oZWRnZTogTGluZSwgd2VpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgaW5pdGlhbERpc3QgPSB0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLnN0YXJ0Q29vcmRzLmRlbHRhKHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uc3RhcnRDb29yZHMpLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCAod2VpZ2h0IC0gdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8gKiBpbml0aWFsRGlzdCkgKiBHcmF2aXRhdG9yLkNPTE9SX0RFVklBVElPTikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VG90YWxEaXN0YW5jZVRvTW92ZShzb2x1dGlvbjogbnVtYmVyW10pIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHN1bSArPSBuZXcgVmVjdG9yKHNvbHV0aW9uW3ZlcnRleC5pbmRleC54XSwgc29sdXRpb25bdmVydGV4LmluZGV4LnldKS5kZWx0YSh2ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5ld1N0YXRpb25Qb3NpdGlvbihzdGF0aW9uSWQ6IHN0cmluZywgc29sdXRpb246IG51bWJlcltdKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3Ioc29sdXRpb25bdGhpcy52ZXJ0aWNlc1tzdGF0aW9uSWRdLmluZGV4LnhdLCBzb2x1dGlvblt0aGlzLnZlcnRpY2VzW3N0YXRpb25JZF0uaW5kZXgueV0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkVmVydGV4KHZlcnRleElkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMudmVydGljZXNbdmVydGV4SWRdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHZlcnRleElkKTtcbiAgICAgICAgICAgIGlmIChzdGF0aW9uID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdmVydGV4SWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1t2ZXJ0ZXhJZF0gPSB7c3RhdGlvbjogc3RhdGlvbiwgaW5kZXg6IFZlY3Rvci5OVUxMLCBzdGFydENvb3Jkczogc3RhdGlvbi5iYXNlQ29vcmRzfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZEVkZ2UobGluZTogTGluZSkge1xuICAgICAgICBpZiAobGluZS53ZWlnaHQgPT0gdW5kZWZpbmVkKSBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRJZGVudGlmaWVyKGxpbmUpO1xuICAgICAgICB0aGlzLmVkZ2VzW2lkXSA9IGxpbmU7XG4gICAgICAgIHRoaXMuYWRkVmVydGV4KGxpbmUudGVybWluaVswXS5zdGF0aW9uSWQpO1xuICAgICAgICB0aGlzLmFkZFZlcnRleChsaW5lLnRlcm1pbmlbMV0uc3RhdGlvbklkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldElkZW50aWZpZXIobGluZTogTGluZSkge1xuICAgICAgICByZXR1cm4gVXRpbHMuYWxwaGFiZXRpY0lkKGxpbmUudGVybWluaVswXS5zdGF0aW9uSWQsIGxpbmUudGVybWluaVsxXS5zdGF0aW9uSWQpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBJbnN0YW50IHtcbiAgICBzdGF0aWMgQklHX0JBTkc6IEluc3RhbnQgPSBuZXcgSW5zdGFudCgwLCAwLCAnJyk7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZXBvY2g6IG51bWJlciwgcHJpdmF0ZSBfc2Vjb25kOiBudW1iZXIsIHByaXZhdGUgX2ZsYWc6IHN0cmluZykge1xuXG4gICAgfVxuICAgIGdldCBlcG9jaCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXBvY2g7XG4gICAgfVxuICAgIGdldCBzZWNvbmQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlY29uZDtcbiAgICB9XG4gICAgZ2V0IGZsYWcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsYWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20oYXJyYXk6IHN0cmluZ1tdKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFudChwYXJzZUludChhcnJheVswXSksIHBhcnNlSW50KGFycmF5WzFdKSwgYXJyYXlbMl0gPz8gJycpXG4gICAgfVxuXG4gICAgZXF1YWxzKHRoYXQ6IEluc3RhbnQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCAmJiB0aGlzLnNlY29uZCA9PSB0aGF0LnNlY29uZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IEluc3RhbnQpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5lcG9jaCA9PSB0aGF0LmVwb2NoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5zZWNvbmQgLSB0aGlzLnNlY29uZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhhdC5zZWNvbmQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFiZWxBZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIGZvclN0YXRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBmb3JMaW5lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94O1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIHRleHRDb29yZHM6IFZlY3RvciwgbGFiZWxEaXI6IFJvdGF0aW9uLCBjaGlsZHJlbjogTGFiZWxBZGFwdGVyW10pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbiAgICBjbG9uZUZvclN0YXRpb24oc3RhdGlvbklkOiBzdHJpbmcpOiBMYWJlbEFkYXB0ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBMYWJlbCBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBMQUJFTF9IRUlHSFQgPSAxMjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTGFiZWxBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgYm91bmRpbmdCb3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG4gICAgY2hpbGRyZW46IExhYmVsW10gPSBbXTtcblxuICAgIGhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiB8fCB0aGlzLmFkYXB0ZXIuZm9yTGluZSB8fCAnJztcbiAgICB9XG4gICAgXG4gICAgZ2V0IGZvclN0YXRpb24oKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiB8fCAnJyk7XG4gICAgICAgIGlmIChzID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyLmZvclN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5mb3JTdGF0aW9uO1xuICAgICAgICAgICAgc3RhdGlvbi5hZGRMYWJlbCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChzdGF0aW9uLmxpbmVzRXhpc3RpbmcoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZvclN0YXRpb24oZGVsYXksIHN0YXRpb24sIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFkYXB0ZXIuZm9yTGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlcm1pbmkgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMuYWRhcHRlci5mb3JMaW5lKS50ZXJtaW5pO1xuICAgICAgICAgICAgdGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh0LnN0YXRpb25JZCk7XG4gICAgICAgICAgICAgICAgaWYgKHMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzLmxhYmVscy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGwuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbC5kcmF3KGRlbGF5LCBhbmltYXRlKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdMYWJlbEZvclN0YXRpb24gPSBuZXcgTGFiZWwodGhpcy5hZGFwdGVyLmNsb25lRm9yU3RhdGlvbihzLmlkKSwgdGhpcy5zdGF0aW9uUHJvdmlkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGFiZWxGb3JTdGF0aW9uLmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmFkZExhYmVsKG5ld0xhYmVsRm9yU3RhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2gobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgVmVjdG9yLk5VTEwsIFJvdGF0aW9uLmZyb20oJ24nKSwgW10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0ZvclN0YXRpb24oZGVsYXlTZWNvbmRzOiBudW1iZXIsIHN0YXRpb246IFN0YXRpb24sIGZvckxpbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgYmFzZUNvb3JkID0gc3RhdGlvbi5iYXNlQ29vcmRzO1xuICAgICAgICBsZXQgeU9mZnNldCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxzdGF0aW9uLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbCA9IHN0YXRpb24ubGFiZWxzW2ldO1xuICAgICAgICAgICAgaWYgKGwgPT0gdGhpcylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHlPZmZzZXQgKz0gTGFiZWwuTEFCRUxfSEVJR0hUKjEuNTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYWJlbERpciA9IHN0YXRpb24ubGFiZWxEaXI7XG5cbiAgICAgICAgeU9mZnNldCA9IE1hdGguc2lnbihWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpLnkpKnlPZmZzZXQgLSAoeU9mZnNldD4wID8gMiA6IDApOyAvL1RPRE8gbWFnaWMgbnVtYmVyc1xuICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gc3RhdGlvbi5yb3RhdGlvbjtcbiAgICAgICAgY29uc3QgZGlmZkRpciA9IGxhYmVsRGlyLmFkZChuZXcgUm90YXRpb24oLXN0YXRpb25EaXIuZGVncmVlcykpO1xuICAgICAgICBjb25zdCB1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShkaWZmRGlyKTtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gbmV3IFZlY3RvcihzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneCcsIHVuaXR2LngpLCBzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneScsIHVuaXR2LnkpKTtcbiAgICAgICAgY29uc3QgdGV4dENvb3JkcyA9IGJhc2VDb29yZC5hZGQoYW5jaG9yLnJvdGF0ZShzdGF0aW9uRGlyKSkuYWRkKG5ldyBWZWN0b3IoMCwgeU9mZnNldCkpO1xuICAgIFxuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIHRleHRDb29yZHMsIGxhYmVsRGlyLCB0aGlzLmNoaWxkcmVuLm1hcChjID0+IGMuYWRhcHRlcikpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyLmZvclN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZvclN0YXRpb24ucmVtb3ZlTGFiZWwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgIGMuZXJhc2UoZGVsYXksIGFuaW1hdGUsIHJldmVyc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuL1ByZWZlcnJlZFRyYWNrXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCAge1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveDtcbiAgICB3ZWlnaHQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcGF0aDogVmVjdG9yW10sIGxlbmd0aDogbnVtYmVyLCBjb2xvckRldmlhdGlvbjogbnVtYmVyKTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSwgY29sb3JGcm9tOiBudW1iZXIsIGNvbG9yVG86IG51bWJlcik6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBsZW5ndGg6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBMaW5lIGltcGxlbWVudHMgVGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIE5PREVfRElTVEFOQ0UgPSAwO1xuICAgIHN0YXRpYyBTUEVFRCA9IDEwMDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTGluZUFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIsIHByaXZhdGUgYmVja1N0eWxlOiBib29sZWFuID0gdHJ1ZSkge1xuXG4gICAgfVxuXG4gICAgZnJvbSA9IHRoaXMuYWRhcHRlci5mcm9tO1xuICAgIHRvID0gdGhpcy5hZGFwdGVyLnRvO1xuICAgIG5hbWUgPSB0aGlzLmFkYXB0ZXIubmFtZTtcbiAgICBib3VuZGluZ0JveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcbiAgICB3ZWlnaHQgPSB0aGlzLmFkYXB0ZXIud2VpZ2h0O1xuICAgIFxuICAgIHByaXZhdGUgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIHByZWNlZGluZ0RpcjogUm90YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBfcGF0aDogVmVjdG9yW10gPSBbXTtcblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5fcGF0aDtcbiAgICAgICAgXG4gICAgICAgIGxldCB0cmFjayA9IG5ldyBQcmVmZXJyZWRUcmFjaygnKycpO1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8c3RvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbVN0cmluZyhzdG9wc1tqXS50cmFja0luZm8pO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMubmFtZSArICc6IFN0YXRpb24gd2l0aCBJRCAnICsgc3RvcHNbal0uc3RhdGlvbklkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihzdG9wLmF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3RvcHNbal0uY29vcmQgPSB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RvcCwgdGhpcy5uZXh0U3RvcEJhc2VDb29yZChzdG9wcywgaiwgc3RvcC5iYXNlQ29vcmRzKSwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCB0cnVlKTtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2sua2VlcE9ubHlTaWduKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKTtcbiAgICAgICAgY29uc3QgbGluZUdyb3VwID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpO1xuICAgICAgICBsaW5lR3JvdXAuYWRkTGluZSh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIGR1cmF0aW9uLCBwYXRoLCB0aGlzLmdldFRvdGFsTGVuZ3RoKHBhdGgpLCBsaW5lR3JvdXAuc3Ryb2tlQ29sb3IpO1xuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgbW92ZShkZWxheTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcGF0aDogVmVjdG9yW10sIGNvbG9yRGV2aWF0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG9sZFBhdGggPSB0aGlzLl9wYXRoO1xuICAgICAgICBpZiAob2xkUGF0aC5sZW5ndGggPCAyIHx8IHBhdGgubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdUcnlpbmcgdG8gbW92ZSBhIG5vbiBleGlzdGluZyBsaW5lJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9sZFBhdGgubGVuZ3RoICE9IHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICBvbGRQYXRoID0gW29sZFBhdGhbMF0sIG9sZFBhdGhbb2xkUGF0aC5sZW5ndGgtMV1dO1xuICAgICAgICAgICAgcGF0aCA9IFtwYXRoWzBdLCBwYXRoW3BhdGgubGVuZ3RoLTFdXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaW5lR3JvdXAgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHRoaXMuX3BhdGgsIHBhdGgsIGxpbmVHcm91cC5zdHJva2VDb2xvciwgY29sb3JEZXZpYXRpb24pO1xuICAgICAgICBsaW5lR3JvdXAuc3Ryb2tlQ29sb3IgPSBjb2xvckRldmlhdGlvbjtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uRHVyYXRpb24odGhpcy5fcGF0aCwgYW5pbWF0ZSk7XG4gICAgICAgIHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKS5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXksIGR1cmF0aW9uLCByZXZlcnNlLCB0aGlzLmdldFRvdGFsTGVuZ3RoKHRoaXMuX3BhdGgpKTtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMubmFtZSArICc6IFN0YXRpb24gd2l0aCBJRCAnICsgc3RvcHNbal0uc3RhdGlvbklkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHN0b3AucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgICAgIHN0b3AuZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChzdG9wc1tqLTFdLnN0YXRpb25JZCwgc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBsZXQgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChoZWxwU3RvcElkKTtcbiAgICAgICAgICAgICAgICBpZiAoaGVscFN0b3AgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlbHBTdG9wLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRTdG9wQmFzZUNvb3JkKHN0b3BzOiBTdG9wW10sIGN1cnJlbnRTdG9wSW5kZXg6IG51bWJlciwgZGVmYXVsdENvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIGlmIChjdXJyZW50U3RvcEluZGV4KzEgPCBzdG9wcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gc3RvcHNbY3VycmVudFN0b3BJbmRleCsxXS5zdGF0aW9uSWQ7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLm5hbWUgKyAnOiBTdGF0aW9uIHdpdGggSUQgJyArIGlkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBzdG9wLmJhc2VDb29yZHM7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRDb29yZHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDb25uZWN0aW9uKHN0YXRpb246IFN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkOiBWZWN0b3IsIHRyYWNrOiBQcmVmZXJyZWRUcmFjaywgcGF0aDogVmVjdG9yW10sIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJlY3Vyc2U6IGJvb2xlYW4pOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBkaXIgPSBzdGF0aW9uLnJvdGF0aW9uO1xuICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgIGNvbnN0IG5ld0RpciA9IHRoaXMuZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIGRpciwgcGF0aCk7XG4gICAgICAgIGNvbnN0IG5ld1BvcyA9IHN0YXRpb24uYXNzaWduVHJhY2sobmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgdHJhY2ssIHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gc3RhdGlvbi5yb3RhdGVkVHJhY2tDb29yZGluYXRlcyhuZXdEaXIsIG5ld1Bvcyk7XG4gICAgXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgXG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMuZ2V0UHJlY2VkaW5nRGlyKHRoaXMucHJlY2VkaW5nRGlyLCB0aGlzLnByZWNlZGluZ1N0b3AsIG9sZENvb3JkLCBuZXdDb29yZCk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gbmV3RGlyLmFkZChkaXIpO1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmluc2VydE5vZGUob2xkQ29vcmQsIHRoaXMucHJlY2VkaW5nRGlyLCBuZXdDb29yZCwgc3RhdGlvbkRpciwgcGF0aCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWZvdW5kICYmIHJlY3Vyc2UgJiYgdGhpcy5wcmVjZWRpbmdTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wID0gdGhpcy5nZXRPckNyZWF0ZUhlbHBlclN0b3AodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgc3RhdGlvbik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSB0aGlzLnByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihoZWxwU3RvcCwgYmFzZUNvb3JkLCB0cmFjay5rZWVwT25seVNpZ24oKSwgcGF0aCwgZGVsYXksIGFuaW1hdGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb25uZWN0aW9uKHN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkLCB0cmFjaywgcGF0aCwgZGVsYXksIGFuaW1hdGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdwYXRoIHRvIGZpeCBvbiBsaW5lJywgdGhpcy5hZGFwdGVyLm5hbWUsICdhdCBzdGF0aW9uJywgc3RhdGlvbi5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHN0YXRpb25EaXI7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGlvbi5hZGRMaW5lKHRoaXMsIG5ld0Rpci5pc1ZlcnRpY2FsKCkgPyAneCcgOiAneScsIG5ld1Bvcyk7XG4gICAgICAgIHBhdGgucHVzaChuZXdDb29yZCk7XG5cbiAgICAgICAgZGVsYXkgPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGgsIGFuaW1hdGUpICsgZGVsYXk7XG4gICAgICAgIHN0YXRpb24uZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIHRoaXMucHJlY2VkaW5nU3RvcCA9IHN0YXRpb247XG4gICAgICAgIHJldHVybiBuZXdDb29yZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFN0b3BPcmllbnRhdGlvbkJhc2VkT25UaHJlZVN0b3BzKHN0YXRpb246IFN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkOiBWZWN0b3IsIGRpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogUm90YXRpb24ge1xuICAgICAgICBpZiAocGF0aC5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBwYXRoW3BhdGgubGVuZ3RoLTFdO1xuICAgICAgICAgICAgcmV0dXJuIG5leHRTdG9wQmFzZUNvb3JkLmRlbHRhKG9sZENvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24oZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWx0YSA9IHN0YXRpb24uYmFzZUNvb3Jkcy5kZWx0YShuZXh0U3RvcEJhc2VDb29yZCk7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQXhpcyA9IHN0YXRpb24uYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKHRoaXMubmFtZSk/LmF4aXM7XG4gICAgICAgIGlmIChleGlzdGluZ0F4aXMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1N0b3BPcmllbnRpYXRpb24gPSBkZWx0YS5pbmNsaW5hdGlvbigpLmhhbGZEaXJlY3Rpb24oZGlyLCBleGlzdGluZ0F4aXMgPT0gJ3gnID8gbmV3IFJvdGF0aW9uKDkwKSA6IG5ldyBSb3RhdGlvbigwKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVjZWRpbmdEaXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSBleGlzdGluZ1N0b3BPcmllbnRpYXRpb24uYWRkKGRpcikuYWRkKG5ldyBSb3RhdGlvbigxODApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ1N0b3BPcmllbnRpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlbHRhLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihkaXIpO1xuICAgIH1cbiAgICBcblxuICAgIHByaXZhdGUgZ2V0UHJlY2VkaW5nRGlyKHByZWNlZGluZ0RpcjogUm90YXRpb24gfCB1bmRlZmluZWQsIHByZWNlZGluZ1N0b3A6IFN0YXRpb24gfCB1bmRlZmluZWQsIG9sZENvb3JkOiBWZWN0b3IsIG5ld0Nvb3JkOiBWZWN0b3IpOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChwcmVjZWRpbmdEaXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBwcmVjZWRpbmdTdG9wUm90YXRpb24gPSBwcmVjZWRpbmdTdG9wPy5yb3RhdGlvbiA/PyBuZXcgUm90YXRpb24oMCk7XG4gICAgICAgICAgICBwcmVjZWRpbmdEaXIgPSBvbGRDb29yZC5kZWx0YShuZXdDb29yZCkuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKHByZWNlZGluZ1N0b3BSb3RhdGlvbikuYWRkKHByZWNlZGluZ1N0b3BSb3RhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmVjZWRpbmdEaXIgPSBwcmVjZWRpbmdEaXIuYWRkKG5ldyBSb3RhdGlvbigxODApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJlY2VkaW5nRGlyO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5zZXJ0Tm9kZShmcm9tQ29vcmQ6IFZlY3RvciwgZnJvbURpcjogUm90YXRpb24sIHRvQ29vcmQ6IFZlY3RvciwgdG9EaXI6IFJvdGF0aW9uLCBwYXRoOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuYmVja1N0eWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWx0YTogVmVjdG9yID0gZnJvbUNvb3JkLmRlbHRhKHRvQ29vcmQpO1xuICAgICAgICBjb25zdCBvbGREaXJWID0gVmVjdG9yLlVOSVQucm90YXRlKGZyb21EaXIpO1xuICAgICAgICBjb25zdCBuZXdEaXJWID0gVmVjdG9yLlVOSVQucm90YXRlKHRvRGlyKTtcbiAgICAgICAgaWYgKGRlbHRhLmlzRGVsdGFNYXRjaGluZ1BhcmFsbGVsKG9sZERpclYsIG5ld0RpclYpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb2x1dGlvbiA9IGRlbHRhLnNvbHZlRGVsdGFGb3JJbnRlcnNlY3Rpb24ob2xkRGlyViwgbmV3RGlyVilcbiAgICAgICAgaWYgKHNvbHV0aW9uLmEgPiBMaW5lLk5PREVfRElTVEFOQ0UgJiYgc29sdXRpb24uYiA+IExpbmUuTk9ERV9ESVNUQU5DRSkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKG5ldyBWZWN0b3IoZnJvbUNvb3JkLngrb2xkRGlyVi54KnNvbHV0aW9uLmEsIGZyb21Db29yZC55K29sZERpclYueSpzb2x1dGlvbi5hKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPckNyZWF0ZUhlbHBlclN0b3AoZnJvbURpcjogUm90YXRpb24sIGZyb21TdG9wOiBTdGF0aW9uLCB0b1N0b3A6IFN0YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgaGVscFN0b3BJZCA9ICdoXycgKyBVdGlscy5hbHBoYWJldGljSWQoZnJvbVN0b3AuaWQsIHRvU3RvcC5pZCk7XG4gICAgICAgIGxldCBoZWxwU3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGhlbHBTdG9wSWQpO1xuICAgICAgICBpZiAoaGVscFN0b3AgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ3JlYXRpbmcnLCBoZWxwU3RvcElkKTtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gZnJvbVN0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gdG9TdG9wLmJhc2VDb29yZHM7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IG5ld0Nvb3JkLmRlbHRhKG9sZENvb3JkKTtcbiAgICAgICAgICAgIGNvbnN0IGRlZyA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJtZWRpYXRlRGlyID0gbmV3IFJvdGF0aW9uKChkZWcuZGVsdGEoZnJvbURpcikuZGVncmVlcyA+PSAwID8gTWF0aC5mbG9vcihkZWcuZGVncmVlcyAvIDQ1KSA6IE1hdGguY2VpbChkZWcuZGVncmVlcyAvIDQ1KSkgKiA0NSkubm9ybWFsaXplKCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVDb29yZCA9IGRlbHRhLndpdGhMZW5ndGgoZGVsdGEubGVuZ3RoLzIpLmFkZChuZXdDb29yZCk7XG5cbiAgICAgICAgICAgIGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuY3JlYXRlVmlydHVhbFN0b3AoaGVscFN0b3BJZCwgaW50ZXJtZWRpYXRlQ29vcmQsIGludGVybWVkaWF0ZURpcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlbHBTdG9wO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QW5pbWF0aW9uRHVyYXRpb24ocGF0aDogVmVjdG9yW10sIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCkgLyBMaW5lLlNQRUVEO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFRvdGFsTGVuZ3RoKHBhdGg6IFZlY3RvcltdKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxwYXRoLmxlbmd0aC0xOyBpKyspIHtcbiAgICAgICAgICAgIGxlbmd0aCArPSBwYXRoW2ldLmRlbHRhKHBhdGhbaSsxXSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0IHRlcm1pbmkoKTogU3RvcFtdIHtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGlmIChzdG9wcy5sZW5ndGggPT0gMCkgXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiBbc3RvcHNbMF0sIHN0b3BzW3N0b3BzLmxlbmd0aC0xXV07XG4gICAgfVxuXG4gICAgZ2V0IHBhdGgoKTogVmVjdG9yW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcbiAgICB9XG5cbiAgICBnZXRTdG9wKHN0YXRpb25JZDogc3RyaW5nKTogU3RvcCB8IG51bGwge1xuICAgICAgICBmb3IgKGNvbnN0IHN0b3Agb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmFkYXB0ZXIuc3RvcHMpKSB7XG4gICAgICAgICAgICBpZiAoc3RvcC5zdGF0aW9uSWQgPT0gc3RhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufSIsImltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9MaW5lXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lR3JvdXAge1xuICAgIHByaXZhdGUgX2xpbmVzOiBMaW5lW10gPSBbXTtcbiAgICBwcml2YXRlIF90ZXJtaW5pOiBTdG9wW10gPSBbXTtcbiAgICBzdHJva2VDb2xvciA9IDA7XG4gICAgXG4gICAgYWRkTGluZShsaW5lOiBMaW5lKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5fbGluZXMuaW5jbHVkZXMobGluZSkpXG4gICAgICAgICAgICB0aGlzLl9saW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRlcm1pbmkoKTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuX2xpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVzW2ldID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVRlcm1pbmkoKTtcbiAgICB9XG5cbiAgICBnZXQgdGVybWluaSgpOiBTdG9wW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGVybWluaTtcbiAgICB9XG5cbiAgICBnZXRQYXRoQmV0d2VlbihzdGF0aW9uSWRGcm9tOiBzdHJpbmcsIHN0YXRpb25JZFRvOiBzdHJpbmcpOiB7cGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlcn0gfCBudWxsIHtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZ2V0TGluZXNXaXRoU3RvcChzdGF0aW9uSWRGcm9tKTtcbiAgICAgICAgY29uc3QgdG8gPSB0aGlzLmdldExpbmVzV2l0aFN0b3Aoc3RhdGlvbklkVG8pO1xuXG4gICAgICAgIGlmIChmcm9tLmxlbmd0aCA9PSAwIHx8IHRvLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBPYmplY3QudmFsdWVzKGZyb20pKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgT2JqZWN0LnZhbHVlcyh0bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS5saW5lID09IGIubGluZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXRoQmV0d2VlblN0b3BzKGEubGluZSwgYS5zdG9wLCBiLnN0b3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgT2JqZWN0LnZhbHVlcyhmcm9tKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIE9iamVjdC52YWx1ZXModG8pKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tbW9uID0gdGhpcy5maW5kQ29tbW9uU3RvcChhLmxpbmUsIGIubGluZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbW1vbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0UGFydCA9IHRoaXMuZ2V0UGF0aEJldHdlZW5TdG9wcyhhLmxpbmUsIGEuc3RvcCwgY29tbW9uKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Vjb25kUGFydCA9IHRoaXMuZ2V0UGF0aEJldHdlZW5TdG9wcyhiLmxpbmUsIGNvbW1vbiwgYi5zdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyc3RQYXJ0U2xpY2UgPSBmaXJzdFBhcnQucGF0aC5zbGljZSgwLCBmaXJzdFBhcnQudG8rMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlY29uZFBhcnRTbGljZSA9IHNlY29uZFBhcnQucGF0aC5zbGljZShzZWNvbmRQYXJ0LmZyb20pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBwYXRoOiBmaXJzdFBhcnRTbGljZS5jb25jYXQoc2Vjb25kUGFydFNsaWNlKSwgZnJvbTogZmlyc3RQYXJ0LmZyb20sIHRvOiBmaXJzdFBhcnRTbGljZS5sZW5ndGggKyBzZWNvbmRQYXJ0LnRvfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcGxleCBUcmFpbiByb3V0aW5nIGZvciBMaW5lcyBvZiBMaW5lR3JvdXBzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRMaW5lc1dpdGhTdG9wKHN0YXRpb25JZDogc3RyaW5nKToge2xpbmU6IExpbmUsIHN0b3A6IFN0b3B9W10ge1xuICAgICAgICBjb25zdCBhcnI6IHtsaW5lOiBMaW5lLCBzdG9wOiBTdG9wfVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBPYmplY3QudmFsdWVzKHRoaXMuX2xpbmVzKSkge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IGxpbmUuZ2V0U3RvcChzdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKHtsaW5lOiBsaW5lLCBzdG9wOiBzdG9wfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBhdGhCZXR3ZWVuU3RvcHMobGluZTogTGluZSwgZnJvbTogU3RvcCwgdG86IFN0b3ApOiB7cGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlcn0ge1xuICAgICAgICBjb25zdCBwYXRoID0gbGluZS5wYXRoO1xuICAgICAgICBsZXQgZnJvbUlkeCA9IHRoaXMuaW5kZXhPZihwYXRoLCBmcm9tLmNvb3JkIHx8IFZlY3Rvci5OVUxMKTtcbiAgICAgICAgbGV0IHRvSWR4ID0gdGhpcy5pbmRleE9mKHBhdGgsIHRvLmNvb3JkIHx8IFZlY3Rvci5OVUxMKTtcbiAgICAgICAgaWYgKGZyb21JZHggPT0gLTEgfHwgdG9JZHggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0b3AgdGhhdCBzaG91bGQgYmUgcHJlc2VudCBpcyBub3QgcHJlc2VudCBvbiBsaW5lIFwiICsgbGluZS5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICAvL2NvbnN0IHNsaWNlID0gcGF0aC5zbGljZShNYXRoLm1pbihmcm9tSWR4LCB0b0lkeCksIE1hdGgubWF4KGZyb21JZHgsIHRvSWR4KSsxKTtcbiAgICAgICAgY29uc3Qgc2xpY2UgPSBwYXRoLnNsaWNlKCk7XG4gICAgICAgIGlmIChmcm9tSWR4ID4gdG9JZHgpIHtcbiAgICAgICAgICAgIHNsaWNlLnJldmVyc2UoKTtcbiAgICAgICAgICAgIGZyb21JZHggPSBzbGljZS5sZW5ndGggLSAxIC0gZnJvbUlkeDtcbiAgICAgICAgICAgIHRvSWR4ID0gc2xpY2UubGVuZ3RoIC0gMSAtIHRvSWR4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHBhdGg6IHNsaWNlLCBmcm9tOiBmcm9tSWR4LCB0bzogdG9JZHggfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluZGV4T2YoYXJyYXk6IFZlY3RvcltdLCBlbGVtZW50OiBWZWN0b3IpIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0uZXF1YWxzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluZENvbW1vblN0b3AobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogU3RvcCB8IG51bGwge1xuICAgICAgICBmb3IgKGNvbnN0IHRlcm1pbnVzMSBvZiBPYmplY3QudmFsdWVzKGxpbmUxLnRlcm1pbmkpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRlcm1pbnVzMiBvZiBPYmplY3QudmFsdWVzKGxpbmUyLnRlcm1pbmkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlcm1pbnVzMS5zdGF0aW9uSWQgPT0gdGVybWludXMyLnN0YXRpb25JZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVybWludXMxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVRlcm1pbmkoKSB7XG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZXM6IHtbaWQ6IHN0cmluZ10gOiBudW1iZXJ9ID0ge307XG4gICAgICAgIHRoaXMuX2xpbmVzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lVGVybWluaSA9IGwudGVybWluaTtcbiAgICAgICAgICAgIGxpbmVUZXJtaW5pLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0LnRyYWNrSW5mby5pbmNsdWRlcygnKicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtzdGF0aW9uSWQsIG9jY3VyZW5jZXNdIG9mIE9iamVjdC5lbnRyaWVzKGNhbmRpZGF0ZXMpKSB7XG4gICAgICAgICAgICBpZiAob2NjdXJlbmNlcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGVybWluaS5wdXNoKG5ldyBTdG9wKHN0YXRpb25JZCwgJycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90ZXJtaW5pID0gdGVybWluaTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuL1pvb21lclwiO1xuaW1wb3J0IHsgTGluZUdyb3VwIH0gZnJvbSBcIi4vTGluZUdyb3VwXCI7XG5pbXBvcnQgeyBHcmF2aXRhdG9yIH0gZnJvbSBcIi4vR3Jhdml0YXRvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBZGFwdGVyIHtcbiAgICBjYW52YXNTaXplOiBCb3VuZGluZ0JveDtcbiAgICBpbml0aWFsaXplKG5ldHdvcms6IE5ldHdvcmspOiB2b2lkO1xuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbjtcbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQ7XG4gICAgem9vbVRvKHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIE5ldHdvcmsgaW1wbGVtZW50cyBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHByaXZhdGUgc2xpZGVJbmRleDoge1tpZDogc3RyaW5nXSA6IHtbaWQ6IHN0cmluZ106IFRpbWVkRHJhd2FibGVbXX19ID0ge307XG4gICAgcHJpdmF0ZSBzdGF0aW9uczogeyBbaWQ6IHN0cmluZ10gOiBTdGF0aW9uIH0gPSB7fTtcbiAgICBwcml2YXRlIGxpbmVHcm91cHM6IHsgW2lkOiBzdHJpbmddIDogTGluZUdyb3VwIH0gPSB7fTtcbiAgICBwcml2YXRlIGVyYXNlQnVmZmVyOiBUaW1lZERyYXdhYmxlW10gPSBbXTtcbiAgICBwcml2YXRlIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3I7XG4gICAgcHJpdmF0ZSB6b29tZXI6IFpvb21lcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTmV0d29ya0FkYXB0ZXIpIHtcbiAgICAgICAgdGhpcy5ncmF2aXRhdG9yID0gbmV3IEdyYXZpdGF0b3IodGhpcyk7XG4gICAgICAgIHRoaXMuem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmFkYXB0ZXIuY2FudmFzU2l6ZSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmluaXRpYWxpemUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aW9uc1tpZF07XG4gICAgfVxuXG4gICAgbGluZUdyb3VwQnlJZChpZDogc3RyaW5nKTogTGluZUdyb3VwIHtcbiAgICAgICAgaWYgKHRoaXMubGluZUdyb3Vwc1tpZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVHcm91cHNbaWRdID0gbmV3IExpbmVHcm91cCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmVHcm91cHNbaWRdO1xuICAgIH1cblxuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLmFkYXB0ZXIuY3JlYXRlVmlydHVhbFN0b3AoaWQsIGJhc2VDb29yZHMsIHJvdGF0aW9uKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uc1tpZF0gPSBzdG9wO1xuICAgICAgICByZXR1cm4gc3RvcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRpc3BsYXlJbnN0YW50KGluc3RhbnQ6IEluc3RhbnQpIHtcbiAgICAgICAgaWYgKCFpbnN0YW50LmVxdWFscyhJbnN0YW50LkJJR19CQU5HKSkge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXdFcG9jaChpbnN0YW50LmVwb2NoICsgJycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRpbWVkRHJhd2FibGVzQXQobm93OiBJbnN0YW50KTogVGltZWREcmF3YWJsZVtdIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRXBvY2hFeGlzdGluZyhub3cuZXBvY2ggKyAnJykpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXVtub3cuc2Vjb25kXTtcbiAgICB9XG5cbiAgICBkcmF3VGltZWREcmF3YWJsZXNBdChub3c6IEluc3RhbnQsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmRpc3BsYXlJbnN0YW50KG5vdyk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzOiBUaW1lZERyYXdhYmxlW10gPSB0aGlzLnRpbWVkRHJhd2FibGVzQXQobm93KTtcbiAgICAgICAgbGV0IGRlbGF5ID0gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGVsYXkgPSB0aGlzLmRyYXdPckVyYXNlRWxlbWVudChlbGVtZW50c1tpXSwgZGVsYXksIGFuaW1hdGUsIG5vdyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRXJhc2VCdWZmZXIoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICBkZWxheSA9IHRoaXMuZ3Jhdml0YXRvci5ncmF2aXRhdGUoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuem9vbVRvKHRoaXMuem9vbWVyLmNlbnRlciwgdGhpcy56b29tZXIuc2NhbGUsIHRoaXMuem9vbWVyLmR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy56b29tZXIucmVzZXQoKTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZmx1c2hFcmFzZUJ1ZmZlcihkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaT10aGlzLmVyYXNlQnVmZmVyLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVyYXNlQnVmZmVyW2ldO1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LnRvLCBhbmltYXRlKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IHRoaXMuZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgICAgIHRoaXMuem9vbWVyLmluY2x1ZGUoZWxlbWVudC5ib3VuZGluZ0JveCwgZWxlbWVudC5mcm9tLCBlbGVtZW50LnRvLCBmYWxzZSwgYW5pbWF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcmFzZUJ1ZmZlciA9IFtdO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3T3JFcmFzZUVsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgaW5zdGFudDogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGlmIChpbnN0YW50LmVxdWFscyhlbGVtZW50LnRvKSAmJiAhZWxlbWVudC5mcm9tLmVxdWFscyhlbGVtZW50LnRvKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXJhc2VCdWZmZXIubGVuZ3RoID4gMCAmJiB0aGlzLmVyYXNlQnVmZmVyW3RoaXMuZXJhc2VCdWZmZXIubGVuZ3RoLTFdLm5hbWUgIT0gZWxlbWVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRXJhc2VCdWZmZXIoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lcmFzZUJ1ZmZlci5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaEVyYXNlQnVmZmVyKGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LmZyb20sIGFuaW1hdGUpO1xuICAgICAgICBkZWxheSArPSB0aGlzLmRyYXdFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgdGhpcy56b29tZXIuaW5jbHVkZShlbGVtZW50LmJvdW5kaW5nQm94LCBlbGVtZW50LmZyb20sIGVsZW1lbnQudG8sIHRydWUsIGFuaW1hdGUpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZHJhd0VsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTGluZSkge1xuICAgICAgICAgICAgdGhpcy5ncmF2aXRhdG9yLmFkZEVkZ2UoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5lcmFzZShkZWxheSwgYW5pbWF0ZSwgZWxlbWVudC50by5mbGFnLmluY2x1ZGVzKCdyZXZlcnNlJykpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHNob3VsZEFuaW1hdGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChpbnN0YW50LmZsYWcuaW5jbHVkZXMoJ25vYW5pbScpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gYW5pbWF0ZTtcbiAgICB9XG5cbiAgICBpc0Vwb2NoRXhpc3RpbmcoZXBvY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZUluZGV4W2Vwb2NoXSAhPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYWRkVG9JbmRleChlbGVtZW50OiBUaW1lZERyYXdhYmxlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0U2xpZGVJbmRleEVsZW1lbnQoZWxlbWVudC5mcm9tLCBlbGVtZW50KTtcbiAgICAgICAgaWYgKCFJbnN0YW50LkJJR19CQU5HLmVxdWFscyhlbGVtZW50LnRvKSlcbiAgICAgICAgICAgIHRoaXMuc2V0U2xpZGVJbmRleEVsZW1lbnQoZWxlbWVudC50bywgZWxlbWVudCk7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU3RhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdGF0aW9uc1tlbGVtZW50LmlkXSA9IGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNsaWRlSW5kZXhFbGVtZW50KGluc3RhbnQ6IEluc3RhbnQsIGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9IFtdO1xuICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdLnB1c2goZWxlbWVudCk7XG4gICAgfVxuXG4gICAgbmV4dEluc3RhbnQobm93OiBJbnN0YW50KTogSW5zdGFudCB8IG51bGwge1xuICAgICAgICBsZXQgZXBvY2g6IG51bWJlciB8IG51bGwgPSBub3cuZXBvY2g7XG4gICAgICAgIGxldCBzZWNvbmQ6IG51bWJlciB8IG51bGwgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5zZWNvbmQsIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdKTtcbiAgICAgICAgaWYgKHNlY29uZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcG9jaCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LmVwb2NoLCB0aGlzLnNsaWRlSW5kZXgpO1xuICAgICAgICAgICAgaWYgKGVwb2NoID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHNlY29uZCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUoLTEsIHRoaXMuc2xpZGVJbmRleFtlcG9jaF0pO1xuICAgICAgICAgICAgaWYgKHNlY29uZCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW50KGVwb2NoLCBzZWNvbmQsICcnKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmaW5kU21hbGxlc3RBYm92ZSh0aHJlc2hvbGQ6IG51bWJlciwgZGljdDoge1tpZDogbnVtYmVyXTogYW55fSk6IG51bWJlciB8IG51bGwge1xuICAgICAgICBpZiAoZGljdCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGljdCkpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChrZXkpID4gdGhyZXNob2xkICYmIChzbWFsbGVzdCA9PSBudWxsIHx8IHBhcnNlSW50KGtleSkgPCBzbWFsbGVzdCkpIHtcbiAgICAgICAgICAgICAgICBzbWFsbGVzdCA9IHBhcnNlSW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNtYWxsZXN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IExpbmVBdFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJyZWRUcmFjayB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgaWYgKHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlID49IDAgPyAnKycgOiAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayhwcmVmaXggKyB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihhdFN0YXRpb246IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGF0U3RhdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhY2tOdW1iZXIoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tTnVtYmVyKGF0U3RhdGlvbi50cmFjayk7ICAgICAgICBcbiAgICB9XG5cbiAgICBrZWVwT25seVNpZ24oKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy52YWx1ZVswXTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayh2ID09ICctJyA/IHYgOiAnKycpO1xuICAgIH1cblxuICAgIGhhc1RyYWNrTnVtYmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGdldCB0cmFja051bWJlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy52YWx1ZS5yZXBsYWNlKCcqJywgJycpKVxuICAgIH1cblxuICAgIGlzUG9zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdICE9ICctJztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgICBwcml2YXRlIHN0YXRpYyBESVJTOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7J3N3JzogLTEzNSwgJ3cnOiAtOTAsICdudyc6IC00NSwgJ24nOiAwLCAnbmUnOiA0NSwgJ2UnOiA5MCwgJ3NlJzogMTM1LCAncyc6IDE4MH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWdyZWVzOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGRpcmVjdGlvbjogc3RyaW5nKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKFJvdGF0aW9uLkRJUlNbZGlyZWN0aW9uXSlcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhSb3RhdGlvbi5ESVJTKSkge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2YWx1ZSwgdGhpcy5kZWdyZWVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG5cbiAgICBnZXQgZGVncmVlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVncmVlcztcbiAgICB9XG5cbiAgICBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzIC8gMTgwICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICBhZGQodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLmRlZ3JlZXMgKyB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGlmIChzdW0gPD0gLTE4MClcbiAgICAgICAgICAgIHN1bSArPSAzNjA7XG4gICAgICAgIGlmIChzdW0gPiAxODApXG4gICAgICAgICAgICBzdW0gLT0gMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHN1bSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBsZXQgYiA9IHRoYXQuZGVncmVlcztcbiAgICAgICAgbGV0IGRpc3QgPSBiLWE7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0KSA+IDE4MCkge1xuICAgICAgICAgICAgaWYgKGEgPCAwKVxuICAgICAgICAgICAgICAgIGEgKz0gMzYwO1xuICAgICAgICAgICAgaWYgKGIgPCAwKVxuICAgICAgICAgICAgICAgIGIgKz0gMzYwO1xuICAgICAgICAgICAgZGlzdCA9IGItYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpc3QpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBkaXIgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGlyLCAtOTApKVxuICAgICAgICAgICAgZGlyID0gMDtcbiAgICAgICAgZWxzZSBpZiAoZGlyIDwgLTkwKVxuICAgICAgICAgICAgZGlyICs9IDE4MDtcbiAgICAgICAgZWxzZSBpZiAoZGlyID4gOTApXG4gICAgICAgICAgICBkaXIgLT0gMTgwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpcik7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAlIDE4MCA9PSAwO1xuICAgIH1cblxuICAgIHF1YXJ0ZXJEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGNvbnN0IGRlZyA9IGRlbHRhRGlyIDwgMCA/IE1hdGguY2VpbCgoZGVsdGFEaXItNDUpLzkwKSA6IE1hdGguZmxvb3IoKGRlbHRhRGlyKzQ1KS85MCk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKjkwKTtcbiAgICB9XG5cbiAgICBoYWxmRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBzcGxpdEF4aXM6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBsZXQgZGVnO1xuICAgICAgICBpZiAoc3BsaXRBeGlzLmlzVmVydGljYWwoKSkge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgMCAmJiBkZWx0YURpciA+PSAtMTgwKVxuICAgICAgICAgICAgICAgIGRlZyA9IC05MDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSA5MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDkwICYmIGRlbHRhRGlyID49IC05MClcbiAgICAgICAgICAgICAgICBkZWcgPSAwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDE4MDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyk7XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBiYXNlQ29vcmRzOiBWZWN0b3I7XG4gICAgcm90YXRpb246IFJvdGF0aW9uO1xuICAgIGxhYmVsRGlyOiBSb3RhdGlvbjtcbiAgICBpZDogc3RyaW5nO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGlvbklkOiBzdHJpbmcsIHB1YmxpYyB0cmFja0luZm86IHN0cmluZykge1xuXG4gICAgfVxuXG4gICAgcHVibGljIGNvb3JkOiBWZWN0b3IgfCBudWxsID0gbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQXRTdGF0aW9uIHtcbiAgICBsaW5lPzogTGluZTtcbiAgICBheGlzOiBzdHJpbmc7XG4gICAgdHJhY2s6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXRpb24gaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IExpbmVBdFN0YXRpb25bXX0gPSB7eDogW10sIHk6IFtdfTtcbiAgICBwcml2YXRlIGV4aXN0aW5nTGFiZWxzOiBMYWJlbFtdID0gW107XG4gICAgcHJpdmF0ZSBwaGFudG9tPzogTGluZUF0U3RhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLmlkO1xuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogU3RhdGlvbkFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGdldCBiYXNlQ29vcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgc2V0IGJhc2VDb29yZHMoYmFzZUNvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzID0gYmFzZUNvb3JkcztcbiAgICB9XG5cblxuICAgIGdldCBib3VuZGluZ0JveCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveCh0aGlzLmFkYXB0ZXIuYmFzZUNvb3JkcywgdGhpcy5hZGFwdGVyLmJhc2VDb29yZHMpO1xuICAgIH1cblxuXG4gICAgYWRkTGluZShsaW5lOiBMaW5lLCBheGlzOiBzdHJpbmcsIHRyYWNrOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5waGFudG9tID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10ucHVzaCh7bGluZTogbGluZSwgYXhpczogYXhpcywgdHJhY2s6IHRyYWNrfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGluZShsaW5lOiBMaW5lKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgfVxuXG4gICAgYWRkTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5leGlzdGluZ0xhYmVscy5pbmNsdWRlcyhsYWJlbCkpXG4gICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnB1c2gobGFiZWwpO1xuICAgIH1cblxuICAgIHJlbW92ZUxhYmVsKGxhYmVsOiBMYWJlbCk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5leGlzdGluZ0xhYmVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGFiZWxzW2ldID09IGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGlzdGluZ0xhYmVscy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsYWJlbHMoKTogTGFiZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4aXN0aW5nTGFiZWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlTGluZUF0QXhpcyhsaW5lOiBMaW5lLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBoYW50b20gPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgICAgICBleGlzdGluZ0xpbmVzRm9yQXhpcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZShsaW5lTmFtZTogc3RyaW5nKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLngpO1xuICAgICAgICBpZiAoeCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLnkpO1xuICAgICAgICBpZiAoeSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFja0ZvckxpbmVBdEF4aXMobGluZU5hbWU6IHN0cmluZywgZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0ubGluZT8ubmFtZSA9PSBsaW5lTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFzc2lnblRyYWNrKGF4aXM6IHN0cmluZywgcHJlZmVycmVkVHJhY2s6IFByZWZlcnJlZFRyYWNrLCBsaW5lOiBMaW5lKTogbnVtYmVyIHsgXG4gICAgICAgIGlmIChwcmVmZXJyZWRUcmFjay5oYXNUcmFja051bWJlcigpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2sudHJhY2tOdW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGhhbnRvbT8ubGluZT8ubmFtZSA9PSBsaW5lLm5hbWUgJiYgdGhpcy5waGFudG9tPy5heGlzID09IGF4aXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBoYW50b20/LnRyYWNrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMgPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllcygpW2F4aXNdO1xuICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2suaXNQb3NpdGl2ZSgpID8gcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpc1sxXSArIDEgOiBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzBdIC0gMTtcbiAgICB9XG5cbiAgICByb3RhdGVkVHJhY2tDb29yZGluYXRlcyhpbmNvbWluZ0RpcjogUm90YXRpb24sIGFzc2lnbmVkVHJhY2s6IG51bWJlcik6IFZlY3RvciB7IFxuICAgICAgICBsZXQgbmV3Q29vcmQ6IFZlY3RvcjtcbiAgICAgICAgaWYgKGluY29taW5nRGlyLmRlZ3JlZXMgJSAxODAgPT0gMCkge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKDAsIGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0Nvb3JkID0gbmV3Q29vcmQucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgICAgICBuZXdDb29yZCA9IHRoaXMuYmFzZUNvb3Jkcy5hZGQobmV3Q29vcmQpO1xuICAgICAgICByZXR1cm4gbmV3Q29vcmQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXMoKToge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy54KSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXMueSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gWzEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVmdCA9IDA7XG4gICAgICAgIGxldCByaWdodCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2spIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlZnQgPiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmlhbXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMuZm9yRWFjaChsID0+IGwuZHJhdyhkZWxheVNlY29uZHMsIGZhbHNlKSk7XG4gICAgICAgIGNvbnN0IHQgPSBzdGF0aW9uLnBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdDsgfSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB0bzogVmVjdG9yKSB7XG4gICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheVNlY29uZHMsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5iYXNlQ29vcmRzLCB0bywgKCkgPT4gc3RhdGlvbi5leGlzdGluZ0xhYmVscy5mb3JFYWNoKGwgPT4gbC5kcmF3KDAsIGZhbHNlKSkpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5U2Vjb25kcyk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHN0YXRpb25TaXplRm9yQXhpcyhheGlzOiBzdHJpbmcsIHZlY3RvcjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2ZWN0b3IsIDApKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGNvbnN0IGRpciA9IE1hdGguc2lnbih2ZWN0b3IpO1xuICAgICAgICBsZXQgZGltZW4gPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzW2F4aXNdKVt2ZWN0b3IgPCAwID8gMCA6IDFdO1xuICAgICAgICBpZiAoZGlyKmRpbWVuIDwgMCkge1xuICAgICAgICAgICAgZGltZW4gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbiAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIGRpciAqIChTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiArIFN0YXRpb24uTEFCRUxfRElTVEFOQ0UpO1xuICAgIH1cblxuICAgIGxpbmVzRXhpc3RpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGluZXMueC5sZW5ndGggPiAwIHx8IHRoaXMuZXhpc3RpbmdMaW5lcy55Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgQXJyaXZhbERlcGFydHVyZVRpbWUgfSBmcm9tIFwiLi9BcnJpdmFsRGVwYXJ0dXJlVGltZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRyYWluQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94O1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgZm9sbG93OiB7cGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlcn0pOiB2b2lkO1xuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmb2xsb3c6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSk6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgVHJhaW4gaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogVHJhaW5BZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIGJvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgbGluZUdyb3VwID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpXG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBpZiAoc3RvcHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHJhaW4gXCIgKyB0aGlzLm5hbWUgKyBcIiBuZWVkcyBhdCBsZWFzdCAyIHN0b3BzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MTsgaTxzdG9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJyZGVwID0gbmV3IEFycml2YWxEZXBhcnR1cmVUaW1lKHN0b3BzW2ldLnRyYWNrSW5mbyk7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbGluZUdyb3VwLmdldFBhdGhCZXR3ZWVuKHN0b3BzW2ktMV0uc3RhdGlvbklkLCBzdG9wc1tpXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIGFuaW1hdGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheSArIGFycmRlcC5kZXBhcnR1cmUgLSB0aGlzLmZyb20uc2Vjb25kLCBhcnJkZXAuYXJyaXZhbCAtIGFycmRlcC5kZXBhcnR1cmUsIHBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzLm5hbWUgKyAnOiBObyBwYXRoIGZvdW5kIGJldHdlZW4gJyArIHN0b3BzW2ktMV0uc3RhdGlvbklkICsgJyAnICsgc3RvcHNbaV0uc3RhdGlvbklkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU1QUkVDSVNJT046IG51bWJlciA9IDAuMDAxO1xuXG4gICAgc3RhdGljIGVxdWFscyhhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDwgVXRpbHMuSU1QUkVDSVNJT047XG4gICAgfVxuXG4gICAgc3RhdGljIHRyaWxlbW1hKGludDogbnVtYmVyLCBvcHRpb25zOiBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10pOiBzdHJpbmcge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGludCwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKGludCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zWzBdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhbHBoYWJldGljSWQoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYSA8IGIpXG4gICAgICAgICAgICByZXR1cm4gYSArICdfJyArIGI7XG4gICAgICAgIHJldHVybiBiICsgJ18nICsgYTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZWFzZSh4OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDMpIC8gMjtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgVmVjdG9yIHtcbiAgICBzdGF0aWMgVU5JVDogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAtMSk7XG4gICAgc3RhdGljIE5VTEw6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgMCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF94OiBudW1iZXIsIHByaXZhdGUgX3k6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgZ2V0IHgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgfVxuXG4gICAgZ2V0IHkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKTtcbiAgICB9XG5cbiAgICB3aXRoTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLmxlbmd0aCAhPSAwID8gbGVuZ3RoL3RoaXMubGVuZ3RoIDogMDtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54KnJhdGlvLCB0aGlzLnkqcmF0aW8pO1xuICAgIH1cblxuICAgIGFkZCh0aGF0IDogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICsgdGhhdC54LCB0aGlzLnkgKyB0aGF0LnkpO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoYXQueCAtIHRoaXMueCwgdGhhdC55IC0gdGhpcy55KTtcbiAgICB9XG5cbiAgICByb3RhdGUodGhldGE6IFJvdGF0aW9uKTogVmVjdG9yIHtcbiAgICAgICAgbGV0IHJhZDogbnVtYmVyID0gdGhldGEucmFkaWFucztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICogTWF0aC5jb3MocmFkKSAtIHRoaXMueSAqIE1hdGguc2luKHJhZCksIHRoaXMueCAqIE1hdGguc2luKHJhZCkgKyB0aGlzLnkgKiBNYXRoLmNvcyhyYWQpKTtcbiAgICB9XG5cbiAgICBkb3RQcm9kdWN0KHRoYXQ6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLngqdGhhdC54K3RoaXMueSp0aGF0Lnk7XG4gICAgfVxuXG4gICAgc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IHthOiBudW1iZXIsIGI6IG51bWJlcn0ge1xuICAgICAgICBjb25zdCBkZWx0YTogVmVjdG9yID0gdGhpcztcbiAgICAgICAgY29uc3Qgc3dhcFplcm9EaXZpc2lvbiA9IFV0aWxzLmVxdWFscyhkaXIyLnksIDApO1xuICAgICAgICBjb25zdCB4ID0gc3dhcFplcm9EaXZpc2lvbiA/ICd5JyA6ICd4JztcbiAgICAgICAgY29uc3QgeSA9IHN3YXBaZXJvRGl2aXNpb24gPyAneCcgOiAneSc7XG4gICAgICAgIGNvbnN0IGRlbm9taW5hdG9yID0gKGRpcjFbeV0qZGlyMlt4XS1kaXIxW3hdKmRpcjJbeV0pO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGRlbm9taW5hdG9yLCAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHthOiBOYU4sIGI6IE5hTn07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYSA9IChkZWx0YVt5XSpkaXIyW3hdLWRlbHRhW3hdKmRpcjJbeV0pL2Rlbm9taW5hdG9yO1xuICAgICAgICBjb25zdCBiID0gKGEqZGlyMVt5XS1kZWx0YVt5XSkvZGlyMlt5XTtcbiAgICAgICAgcmV0dXJuIHthLCBifTtcbiAgICB9XG5cbiAgICBpc0RlbHRhTWF0Y2hpbmdQYXJhbGxlbChkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGxFcXVhbFplcm8odGhpcy54LCBkaXIxLngsIGRpcjIueCkgfHwgdGhpcy5hbGxFcXVhbFplcm8odGhpcy55LCBkaXIxLnksIGRpcjIueSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbGxFcXVhbFplcm8objE6IG51bWJlciwgbjI6IG51bWJlciwgbjM6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gVXRpbHMuZXF1YWxzKG4xLCAwKSAmJiBVdGlscy5lcXVhbHMobjIsIDApICYmIFV0aWxzLmVxdWFscyhuMywgMCk7XG4gICAgfVxuXG4gICAgaW5jbGluYXRpb24oKTogUm90YXRpb24ge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueCwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueSA+IDAgPyAxODAgOiAwKTtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh0aGlzLnksIDApKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbih0aGlzLnggPiAwID8gOTAgOiAtOTApO1xuICAgICAgICBjb25zdCBhZGphY2VudCA9IG5ldyBWZWN0b3IoMCwtTWF0aC5hYnModGhpcy55KSk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oTWF0aC5zaWduKHRoaXMueCkqTWF0aC5hY29zKHRoaXMuZG90UHJvZHVjdChhZGphY2VudCkvYWRqYWNlbnQubGVuZ3RoL3RoaXMubGVuZ3RoKSoxODAvTWF0aC5QSSk7XG4gICAgfVxuXG4gICAgYW5nbGUob3RoZXI6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5jbGluYXRpb24oKS5kZWx0YShvdGhlci5pbmNsaW5hdGlvbigpKTtcbiAgICB9XG5cbiAgICBib3RoQXhpc01pbnMob3RoZXI6IFZlY3Rvcikge1xuICAgICAgICBpZiAodGhpcyA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgaWYgKG90aGVyID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCA8IG90aGVyLnggPyB0aGlzLnggOiBvdGhlci54LCB0aGlzLnkgPCBvdGhlci55ID8gdGhpcy55IDogb3RoZXIueSlcbiAgICB9XG5cbiAgICBib3RoQXhpc01heHMob3RoZXI6IFZlY3Rvcikge1xuICAgICAgICBpZiAodGhpcyA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgaWYgKG90aGVyID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCA+IG90aGVyLnggPyB0aGlzLnggOiBvdGhlci54LCB0aGlzLnkgPiBvdGhlci55ID8gdGhpcy55IDogb3RoZXIueSlcbiAgICB9XG5cbiAgICBiZXR3ZWVuKG90aGVyOiBWZWN0b3IsIHg6IG51bWJlcikge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuZGVsdGEob3RoZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgqeCkpO1xuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT0gb3RoZXIueCAmJiB0aGlzLnkgPT0gb3RoZXIueTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5cblxuXG5leHBvcnQgY2xhc3MgWm9vbWVyIHtcbiAgICBzdGF0aWMgWk9PTV9EVVJBVElPTiA9IDE7XG4gICAgc3RhdGljIFpPT01fTUFYX1NDQUxFID0gMztcbiAgICBzdGF0aWMgUEFERElOR19GQUNUT1IgPSAyNTtcbiAgICBcbiAgICBwcml2YXRlIGJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgcHJpdmF0ZSBjdXN0b21EdXJhdGlvbiA9IC0xO1xuICAgIHByaXZhdGUgcmVzZXRGbGFnID0gZmFsc2U7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXNTaXplOiBCb3VuZGluZ0JveCkge1xuICAgIH1cblxuICAgIGluY2x1ZGUoYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94LCBmcm9tOiBJbnN0YW50LCB0bzogSW5zdGFudCwgZHJhdzogYm9vbGVhbiwgc2hvdWxkQW5pbWF0ZTogYm9vbGVhbiwgcGFkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBub3cgPSBkcmF3ID8gZnJvbSA6IHRvO1xuICAgICAgICBpZiAobm93LmZsYWcuaW5jbHVkZXMoJ2tlZXB6b29tJykpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRGbGFnID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXNldEZsYWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvUmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaG91bGRBbmltYXRlICYmICFub3cuZmxhZy5pbmNsdWRlcygnbm96b29tJykpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFkICYmICFib3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveCA9IHRoaXMucGFkZGVkQm91bmRpbmdCb3goYm91bmRpbmdCb3gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LnRsID0gdGhpcy5ib3VuZGluZ0JveC50bC5ib3RoQXhpc01pbnMoYm91bmRpbmdCb3gudGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3guYnIgPSB0aGlzLmJvdW5kaW5nQm94LmJyLmJvdGhBeGlzTWF4cyhib3VuZGluZ0JveC5icik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGVuZm9yY2VkQm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBpZiAoIXRoaXMuYm91bmRpbmdCb3guaXNOdWxsKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZGRlZEJvdW5kaW5nQm94ID0gdGhpcy5ib3VuZGluZ0JveDtcbiAgICAgICAgICAgIGNvbnN0IHpvb21TaXplID0gcGFkZGVkQm91bmRpbmdCb3guZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1NpemUgPSB0aGlzLmNhbnZhc1NpemUuZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IG1pblpvb21TaXplID0gbmV3IFZlY3RvcihjYW52YXNTaXplLnggLyBab29tZXIuWk9PTV9NQVhfU0NBTEUsIGNhbnZhc1NpemUueSAvIFpvb21lci5aT09NX01BWF9TQ0FMRSk7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHpvb21TaXplLmRlbHRhKG1pblpvb21TaXplKTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxTcGFjaW5nID0gbmV3IFZlY3RvcihNYXRoLm1heCgwLCBkZWx0YS54LzIpLCBNYXRoLm1heCgwLCBkZWx0YS55LzIpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChcbiAgICAgICAgICAgICAgICBwYWRkZWRCb3VuZGluZ0JveC50bC5hZGQoYWRkaXRpb25hbFNwYWNpbmcucm90YXRlKG5ldyBSb3RhdGlvbigxODApKSksXG4gICAgICAgICAgICAgICAgcGFkZGVkQm91bmRpbmdCb3guYnIuYWRkKGFkZGl0aW9uYWxTcGFjaW5nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhZGRlZEJvdW5kaW5nQm94KGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgcGFkZGluZyA9ICh0aGlzLmNhbnZhc1NpemUuZGltZW5zaW9ucy54ICsgdGhpcy5jYW52YXNTaXplLmRpbWVuc2lvbnMueSkvWm9vbWVyLlBBRERJTkdfRkFDVE9SO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFxuICAgICAgICAgICAgYm91bmRpbmdCb3gudGwuYWRkKG5ldyBWZWN0b3IoLXBhZGRpbmcsIC1wYWRkaW5nKSksXG4gICAgICAgICAgICBib3VuZGluZ0JveC5ici5hZGQobmV3IFZlY3RvcihwYWRkaW5nLCBwYWRkaW5nKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgY2VudGVyKCk6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKCFlbmZvcmNlZEJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnggKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLngpLzIpLCBcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnkgKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLnkpLzIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXNTaXplLnRsLmJldHdlZW4odGhpcy5jYW52YXNTaXplLmJyLCAwLjUpO1xuICAgIH1cblxuICAgIGdldCBzY2FsZSgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBlbmZvcmNlZEJvdW5kaW5nQm94ID0gdGhpcy5lbmZvcmNlZEJvdW5kaW5nQm94KCk7XG4gICAgICAgIGlmICghZW5mb3JjZWRCb3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBlbmZvcmNlZEJvdW5kaW5nQm94LmRpbWVuc2lvbnM7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKGRlbHRhLnggLyB6b29tU2l6ZS54LCBkZWx0YS55IC8gem9vbVNpemUueSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgZ2V0IGR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmN1c3RvbUR1cmF0aW9uID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tRHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1Jlc2V0KCkge1xuICAgICAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIHRoaXMuY3VzdG9tRHVyYXRpb24gPSAtMTtcbiAgICAgICAgdGhpcy5yZXNldEZsYWcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucmVzZXRGbGFnID0gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vc3ZnL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuXG4vLyBUT0RPOiBlcmFzZSBhbmltLCBsYWJlbHMsIG5lZ2F0aXZlIGRlZmF1bHQgdHJhY2tzIGJhc2VkIG9uIGRpcmVjdGlvbiwgcmVqb2luIGxpbmVzIHRyYWNrIHNlbGVjdGlvblxuXG5sZXQgdGltZVBhc3NlZCA9IDA7XG5cbmNvbnN0IG5ldHdvcms6IE5ldHdvcmsgPSBuZXcgTmV0d29yayhuZXcgU3ZnTmV0d29yaygpKTtcbm5ldHdvcmsuaW5pdGlhbGl6ZSgpO1xuXG5jb25zdCBhbmltYXRlRnJvbUluc3RhbnQ6IEluc3RhbnQgPSBnZXRTdGFydEluc3RhbnQoKTtcbnNsaWRlKEluc3RhbnQuQklHX0JBTkcsIGZhbHNlKTtcblxuZnVuY3Rpb24gZ2V0U3RhcnRJbnN0YW50KCk6IEluc3RhbnQge1xuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgIGNvbnN0IGFuaW1hdGVGcm9tSW5zdGFudDogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpLnNwbGl0KCctJyk7XG4gICAgICAgIGNvbnN0IGluc3RhbnQgPSBuZXcgSW5zdGFudChwYXJzZUludChhbmltYXRlRnJvbUluc3RhbnRbMF0pIHx8IDAsIHBhcnNlSW50KGFuaW1hdGVGcm9tSW5zdGFudFsxXSkgfHwgMCwgJycpO1xuICAgICAgICBjb25zb2xlLmxvZygnZmFzdCBmb3J3YXJkIHRvJywgaW5zdGFudCk7XG4gICAgICAgIHJldHVybiBpbnN0YW50O1xuICAgIH1cbiAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbn1cblxuZnVuY3Rpb24gc2xpZGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpbnN0YW50ICE9IEluc3RhbnQuQklHX0JBTkcgJiYgaW5zdGFudC5lcG9jaCA+PSBhbmltYXRlRnJvbUluc3RhbnQuZXBvY2ggJiYgaW5zdGFudC5zZWNvbmQgPj0gYW5pbWF0ZUZyb21JbnN0YW50LnNlY29uZClcbiAgICAgICAgYW5pbWF0ZSA9IHRydWU7XG5cbiAgICBjb25zb2xlLmxvZyhpbnN0YW50LCAndGltZTogJyArIE1hdGguZmxvb3IodGltZVBhc3NlZCAvIDYwKSArICc6JyArIHRpbWVQYXNzZWQgJSA2MCk7XG5cbiAgICBuZXR3b3JrLmRyYXdUaW1lZERyYXdhYmxlc0F0KGluc3RhbnQsIGFuaW1hdGUpO1xuICAgIGNvbnN0IG5leHQgPSBuZXR3b3JrLm5leHRJbnN0YW50KGluc3RhbnQpO1xuICAgIFxuICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gaW5zdGFudC5kZWx0YShuZXh0KTtcbiAgICAgICAgdGltZVBhc3NlZCArPSBkZWx0YTtcbiAgICAgICAgY29uc3QgZGVsYXkgPSBhbmltYXRlID8gZGVsdGEgOiAwO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2xpZGUobmV4dCwgYW5pbWF0ZSk7IH0sIGRlbGF5ICogMTAwMCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIgfSBmcm9tIFwiLi4vR2VuZXJpY1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuXG5leHBvcnQgY2xhc3MgU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgIGNvbnN0IGJib3ggPSBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3RvcihyLngsIHIueSksIG5ldyBWZWN0b3Ioci54K3Iud2lkdGgsIHIueStyLmhlaWdodCkpO1xuICAgICAgICByZXR1cm4gYmJveDtcbiAgICB9XG5cbiAgICBnZXQgem9vbSgpOiBWZWN0b3Ige1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbJ3pvb20nXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0Wyd6b29tJ10uc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHBhcnNlSW50KGNlbnRlclswXSkgfHwgNTAsIHBhcnNlSW50KGNlbnRlclsxXSkgfHwgNTApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBWZWN0b3IuTlVMTDtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxhYmVsLmRyYXcoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCB6b29tQ2VudGVyLCB6b29tU2NhbGUpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgdGhpcy5kb1pvb20oem9vbUNlbnRlciwgem9vbVNjYWxlLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG9ab29tKHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lKDAsIDEvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTLCB0aGlzLmJvdW5kaW5nQm94LnRsLmJldHdlZW4odGhpcy5ib3VuZGluZ0JveC5iciwgMC41KSwgem9vbUNlbnRlciwgMSwgem9vbVNjYWxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIsIGZyb21DZW50ZXI6IFZlY3RvciwgdG9DZW50ZXI6IFZlY3RvciwgZnJvbVNjYWxlOiBudW1iZXIsIHRvU2NhbGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIHggKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBmeCA9IHg7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGZyb21DZW50ZXIuZGVsdGEodG9DZW50ZXIpXG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yKGRlbHRhLnggKiBmeCwgZGVsdGEueSAqIGZ4KS5hZGQoZnJvbUNlbnRlcik7XG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9ICh0b1NjYWxlIC0gZnJvbVNjYWxlKSAqIGZ4ICsgZnJvbVNjYWxlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKGNlbnRlciwgc2NhbGUpO1xuICAgICAgICAgICAgY29uc3QgbmV0d29yayA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBuZXR3b3JrLmFuaW1hdGVGcmFtZSh4LCBhbmltYXRpb25QZXJGcmFtZSwgZnJvbUNlbnRlciwgdG9DZW50ZXIsIGZyb21TY2FsZSwgdG9TY2FsZSk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKHRvQ2VudGVyLCB0b1NjYWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlWm9vbShjZW50ZXI6IFZlY3Rvciwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBjb25zdCB6b29tYWJsZSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgaWYgKHpvb21hYmxlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gdGhpcy5ib3VuZGluZ0JveC50bC5iZXR3ZWVuKHRoaXMuYm91bmRpbmdCb3guYnIsIDAuNSk7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBvcmlnaW4ueCArICdweCAnICsgb3JpZ2luLnkgKyAncHgnO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZSArICcpIHRyYW5zbGF0ZSgnICsgKG9yaWdpbi54IC0gY2VudGVyLngpICsgJ3B4LCcgKyAob3JpZ2luLnkgLSBjZW50ZXIueSkgKyAncHgpJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZXJhc2UoMCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnN0YW50KGZyb21PclRvOiBzdHJpbmcpOiBJbnN0YW50IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXT8uc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgaWYgKGFyciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5zdGFudC5mcm9tKGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG4gICAgfVxufSIsImltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbEFkYXB0ZXIsIExhYmVsIH0gZnJvbSBcIi4uL0xhYmVsXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uL1V0aWxzXCI7XG5pbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xhYmVsIGltcGxlbWVudHMgTGFiZWxBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgZm9yU3RhdGlvbigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhdGlvbjtcbiAgICB9XG5cbiAgICBnZXQgZm9yTGluZSgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQubGluZTtcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPT0gJ3Zpc2libGUnKSB7XG4gICAgICAgICAgICBjb25zdCByID0gdGhpcy5lbGVtZW50LmdldEJCb3goKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3RvcihyLngsIHIueSksIG5ldyBWZWN0b3Ioci54K3Iud2lkdGgsIHIueStyLmhlaWdodCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbiwgY2hpbGRyZW46IExhYmVsQWRhcHRlcltdKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZHJhdygwLCB0ZXh0Q29vcmRzLCBsYWJlbERpciwgY2hpbGRyZW4pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dENvb3JkcyAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgdGhpcy5zZXRDb29yZCh0aGlzLmVsZW1lbnQsIHRleHRDb29yZHMpO1xuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdMaW5lTGFiZWxzKGxhYmVsRGlyLCBjaGlsZHJlbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1N0YXRpb25MYWJlbChsYWJlbERpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdHJhbnNsYXRlKGJveERpbWVuOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbikge1xuICAgICAgICBjb25zdCBsYWJlbHVuaXR2ID0gVmVjdG9yLlVOSVQucm90YXRlKGxhYmVsRGlyKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoJ1xuICAgICAgICAgICAgKyBVdGlscy50cmlsZW1tYShsYWJlbHVuaXR2LngsIFstYm94RGltZW4ueCArICdweCcsIC1ib3hEaW1lbi54LzIgKyAncHgnLCAnMHB4J10pXG4gICAgICAgICAgICArICcsJ1xuICAgICAgICAgICAgKyBVdGlscy50cmlsZW1tYShsYWJlbHVuaXR2LnksIFstTGFiZWwuTEFCRUxfSEVJR0hUICsgJ3B4JywgLUxhYmVsLkxBQkVMX0hFSUdIVC8yICsgJ3B4JywgJzBweCddKSAvLyBUT0RPIG1hZ2ljIG51bWJlcnNcbiAgICAgICAgICAgICsgJyknO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMaW5lTGFiZWxzKGxhYmVsRGlyOiBSb3RhdGlvbiwgY2hpbGRyZW46IExhYmVsQWRhcHRlcltdKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgIGlmIChjIGluc3RhbmNlb2YgU3ZnTGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdMaW5lTGFiZWwoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoL01hdGgubWF4KHRoaXMuZWxlbWVudC5nZXRCQm94KCkud2lkdGgsIDEpO1xuICAgICAgICBjb25zdCBiYm94ID0gdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZShuZXcgVmVjdG9yKGJib3gud2lkdGgvc2NhbGUsIGJib3guaGVpZ2h0L3NjYWxlKSwgbGFiZWxEaXIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xpbmVMYWJlbChsYWJlbDogU3ZnTGFiZWwpIHtcbiAgICAgICAgY29uc3QgbGluZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgICBsaW5lTGFiZWwuY2xhc3NOYW1lID0gbGFiZWwuY2xhc3NOYW1lcztcbiAgICAgICAgbGluZUxhYmVsLmlubmVySFRNTCA9IGxhYmVsLnRleHQ7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5hcHBlbmRDaGlsZChsaW5lTGFiZWwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1N0YXRpb25MYWJlbChsYWJlbERpcjogUm90YXRpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwuaW5jbHVkZXMoJ2Zvci1zdGF0aW9uJykpXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBmb3Itc3RhdGlvbic7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kb21pbmFudEJhc2VsaW5lID0gJ2hhbmdpbmcnO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZShuZXcgVmVjdG9yKHRoaXMuZWxlbWVudC5nZXRCQm94KCkud2lkdGgsIHRoaXMuZWxlbWVudC5nZXRCQm94KCkuaGVpZ2h0KSwgbGFiZWxEaXIpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZXJhc2UoMCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnN0YW50KGZyb21PclRvOiBzdHJpbmcpOiBJbnN0YW50IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXT8uc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgaWYgKGFyciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5zdGFudC5mcm9tKGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDb29yZChlbGVtZW50OiBhbnksIGNvb3JkOiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3gnLCBjb29yZC54KTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBjb29yZC55KTtcbiAgICB9XG5cbiAgICBnZXQgY2xhc3NOYW1lcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICsgJyAnICsgdGhpcy5mb3JMaW5lO1xuICAgIH1cblxuICAgIGdldCB0ZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIGNsb25lRm9yU3RhdGlvbihzdGF0aW9uSWQ6IHN0cmluZyk6IExhYmVsQWRhcHRlciB7XG4gICAgICAgIGNvbnN0IGxpbmVMYWJlbDogU1ZHR3JhcGhpY3NFbGVtZW50ID0gPFNWR0dyYXBoaWNzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnTmV0d29yay5TVkdOUywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAgICAgbGluZUxhYmVsLmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgZm9yLWxpbmUnO1xuICAgICAgICBsaW5lTGFiZWwuZGF0YXNldC5zdGF0aW9uID0gc3RhdGlvbklkO1xuICAgICAgICBsaW5lTGFiZWwuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcsICdkaXYnKTtcbiAgICAgICAgbGluZUxhYmVsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0aW9ucycpPy5hcHBlbmRDaGlsZChsaW5lTGFiZWwpO1xuICAgICAgICByZXR1cm4gbmV3IFN2Z0xhYmVsKGxpbmVMYWJlbClcbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IHsgTGluZUFkYXB0ZXIsIExpbmUgfSBmcm9tIFwiLi4vTGluZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTGluZSBpbXBsZW1lbnRzIExpbmVBZGFwdGVyIHtcblxuICAgIHByaXZhdGUgX3N0b3BzOiBTdG9wW10gPSBbXTtcbiAgICBib3VuZGluZ0JveCA9IG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdQYXRoRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LmxpbmUgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IHdlaWdodCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUJvdW5kaW5nQm94KHBhdGg6IFZlY3RvcltdKTogdm9pZCB7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8cGF0aC5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LnRsID0gdGhpcy5ib3VuZGluZ0JveC50bC5ib3RoQXhpc01pbnMocGF0aFtpXSk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LmJyID0gdGhpcy5ib3VuZGluZ0JveC5ici5ib3RoQXhpc01heHMocGF0aFtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG5cblxuICAgIGdldCBzdG9wcygpOiBTdG9wW10ge1xuICAgICAgICBpZiAodGhpcy5fc3RvcHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0b3BzPy5zcGxpdCgvXFxzKy8pIHx8IFtdO1xuICAgICAgICAgICAgbGV0IG5leHRTdG9wID0gbmV3IFN0b3AoJycsICcnKTtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dG9rZW5zPy5sZW5ndGg7aSsrKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0b2tlbnNbaV1bMF0gIT0gJy0nICYmIHRva2Vuc1tpXVswXSAhPSAnKycgJiYgdG9rZW5zW2ldWzBdICE9ICcqJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BzLnB1c2gobmV4dFN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AudHJhY2tJbmZvID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcHM7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlciwgY29sb3JEZXZpYXRpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHBhdGgpO1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGxpbmUuZHJhdygwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHBhdGgsIGxlbmd0aCwgY29sb3JEZXZpYXRpb24pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBsaW5lICcgKyB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuY3JlYXRlUGF0aChwYXRoKTtcbiAgICBcbiAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkobGVuZ3RoKTtcbiAgICAgICAgaWYgKGNvbG9yRGV2aWF0aW9uICE9IDApIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3IoY29sb3JEZXZpYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgbGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShsZW5ndGgsIDAsIC1sZW5ndGgvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTKTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSwgY29sb3JGcm9tOiBudW1iZXIsIGNvbG9yVG86IG51bWJlcikge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHRvKTtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBsaW5lLm1vdmUoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBmcm9tLCB0bywgY29sb3JGcm9tLCBjb2xvclRvKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIGNvbG9yRnJvbSwgY29sb3JUbywgMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMpO1xuICAgIH1cblxuICAgIFxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxpbmUuZXJhc2UoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCByZXZlcnNlLCBsZW5ndGgpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZnJvbSA9IDA7XG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgZnJvbSA9IGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSByZXZlcnNlID8gLTEgOiAxO1xuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShmcm9tLCBsZW5ndGggKiBkaXJlY3Rpb24sIGxlbmd0aC9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMgKiBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGF0aChwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBjb25zdCBkID0gJ00nICsgcGF0aC5tYXAodiA9PiB2LngrJywnK3YueSkuam9pbignIEwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGFzaGFycmF5KGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBkYXNoZWRQYXJ0ID0gbGVuZ3RoICsgJyc7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLnN0cm9rZURhc2hhcnJheS5yZXBsYWNlKC9bXjAtOVxccyxdKy9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcmVzZXRBcnJheSA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgICAgICBpZiAocHJlc2V0QXJyYXkubGVuZ3RoICUgMiA9PSAxKVxuICAgICAgICAgICAgICAgIHByZXNldEFycmF5ID0gcHJlc2V0QXJyYXkuY29uY2F0KHByZXNldEFycmF5KTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldExlbmd0aCA9IHByZXNldEFycmF5Lm1hcChhID0+IHBhcnNlSW50KGEpIHx8IDApLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuICAgICAgICAgICAgZGFzaGVkUGFydCA9IG5ldyBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gcHJlc2V0TGVuZ3RoICsgMSkpLmpvaW4ocHJlc2V0QXJyYXkuam9pbignICcpICsgJyAnKSArICcwJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gZGFzaGVkUGFydCArICcgJyArIGxlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNvbG9yKGRldmlhdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2UgPSAncmdiKCcgKyBNYXRoLm1heCgwLCBkZXZpYXRpb24pICogMjU2ICsgJywgMCwgJyArIE1hdGgubWluKDAsIGRldmlhdGlvbikgKiAtMjU2ICsgJyknO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZShmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvblBlckZyYW1lIDwgMCAmJiBmcm9tID4gdG8gfHwgYW5pbWF0aW9uUGVyRnJhbWUgPiAwICYmIGZyb20gPCB0bykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBmcm9tICsgJyc7XG4gICAgICAgICAgICBmcm9tICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZShmcm9tLCB0bywgYW5pbWF0aW9uUGVyRnJhbWUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gdG8gKyAnJztcbiAgICAgICAgICAgIGlmICh0byAhPSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10sIGNvbG9yRnJvbTogbnVtYmVyLCBjb2xvclRvOiBudW1iZXIsIHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVycG9sYXRlZCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZWQucHVzaChmcm9tW2ldLmJldHdlZW4odG9baV0sIHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KGludGVycG9sYXRlZFswXS5kZWx0YShpbnRlcnBvbGF0ZWRbaW50ZXJwb2xhdGVkLmxlbmd0aC0xXSkubGVuZ3RoKTsgLy8gVE9ETyBhcmJpdHJhcnkgbm9kZSBjb3VudFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKGludGVycG9sYXRlZCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbG9yKChjb2xvclRvLWNvbG9yRnJvbSkqeCtjb2xvckZyb20pO1xuXG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgY29sb3JGcm9tLCBjb2xvclRvLCB4LCBhbmltYXRpb25QZXJGcmFtZSk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkodG9bMF0uZGVsdGEodG9bdG8ubGVuZ3RoLTFdKS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHRvKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBOZXR3b3JrQWRhcHRlciwgTmV0d29yaywgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4uL05ldHdvcmtcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4uL0xpbmVcIjtcbmltcG9ydCB7IFN2Z0xpbmUgfSBmcm9tIFwiLi9TdmdMaW5lXCI7XG5pbXBvcnQgeyBTdmdTdGF0aW9uIH0gZnJvbSBcIi4vU3ZnU3RhdGlvblwiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi4vTGFiZWxcIjtcbmltcG9ydCB7IFN2Z0xhYmVsIH0gZnJvbSBcIi4vU3ZnTGFiZWxcIjtcbmltcG9ydCB7IEdlbmVyaWNUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4uL0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdmdHZW5lcmljVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBab29tZXIgfSBmcm9tIFwiLi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBUcmFpbiB9IGZyb20gXCIuLi9UcmFpblwiO1xuaW1wb3J0IHsgU3ZnVHJhaW4gfSBmcm9tIFwiLi9TdmdUcmFpblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z05ldHdvcmsgaW1wbGVtZW50cyBOZXR3b3JrQWRhcHRlciB7XG5cbiAgICBzdGF0aWMgRlBTID0gNjA7XG4gICAgc3RhdGljIFNWR05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbUNlbnRlcjogVmVjdG9yID0gVmVjdG9yLk5VTEw7XG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbVNjYWxlOiBudW1iZXIgPSAxO1xuXG4gICAgZ2V0IGNhbnZhc1NpemUoKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgICAgY29uc3QgYm94ID0gc3ZnPy52aWV3Qm94LmJhc2VWYWw7XG4gICAgICAgIGlmIChib3gpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3Rvcihib3gueCwgYm94LnkpLCBuZXcgVmVjdG9yKGJveC54K2JveC53aWR0aCwgYm94LnkrYm94LmhlaWdodCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTsgICAgICAgIFxuICAgIH1cblxuICAgIGdldCBiZWNrU3R5bGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmJlY2tTdHlsZSAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQge1xuICAgICAgICBsZXQgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIik7XG4gICAgICAgIGlmIChlbGVtZW50cyA9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1BsZWFzZSBkZWZpbmUgdGhlIFwiZWxlbWVudHNcIiBncm91cC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUgfCBudWxsID0gdGhpcy5taXJyb3JFbGVtZW50KGVsZW1lbnRzW2ldLCBuZXR3b3JrKTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXR3b3JrLmFkZFRvSW5kZXgoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1pcnJvckVsZW1lbnQoZWxlbWVudDogYW55LCBuZXR3b3JrOiBTdGF0aW9uUHJvdmlkZXIpOiBUaW1lZERyYXdhYmxlIHwgbnVsbCB7XG4gICAgICAgIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAncGF0aCcgJiYgZWxlbWVudC5kYXRhc2V0LmxpbmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpbmUobmV3IFN2Z0xpbmUoZWxlbWVudCksIG5ldHdvcmssIHRoaXMuYmVja1N0eWxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAncGF0aCcgJiYgZWxlbWVudC5kYXRhc2V0LnRyYWluICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUcmFpbihuZXcgU3ZnVHJhaW4oZWxlbWVudCksIG5ldHdvcmspO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdyZWN0JyAmJiBlbGVtZW50LmRhdGFzZXQuc3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RhdGlvbihuZXcgU3ZnU3RhdGlvbihlbGVtZW50KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExhYmVsKG5ldyBTdmdMYWJlbChlbGVtZW50KSwgbmV0d29yayk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5kYXRhc2V0LmZyb20gIT0gdW5kZWZpbmVkIHx8IGVsZW1lbnQuZGF0YXNldC50byAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgR2VuZXJpY1RpbWVkRHJhd2FibGUobmV3IFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlKGVsZW1lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcCA9IDxTVkdSZWN0RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z05ldHdvcmsuU1ZHTlMsICdyZWN0Jyk7XG4gICAgICAgIGhlbHBTdG9wLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0aW9uJywgaWQpO1xuICAgICAgICBoZWxwU3RvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGlyJywgcm90YXRpb24ubmFtZSk7XG4gICAgICAgIHRoaXMuc2V0Q29vcmQoaGVscFN0b3AsIGJhc2VDb29yZHMpO1xuICAgICAgICBoZWxwU3RvcC5jbGFzc05hbWUuYmFzZVZhbCA9ICdoZWxwZXInO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGlvbnMnKT8uYXBwZW5kQ2hpbGQoaGVscFN0b3ApO1xuICAgICAgICByZXR1cm4gbmV3IFN0YXRpb24obmV3IFN2Z1N0YXRpb24oaGVscFN0b3ApKTsgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q29vcmQoZWxlbWVudDogYW55LCBjb29yZDogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgY29vcmQueCk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd5JywgY29vcmQueSk7XG4gICAgfVxuXG4gICAgZHJhd0Vwb2NoKGVwb2NoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2Vwb2NoJywgeyBkZXRhaWw6IGVwb2NoIH0pO1xuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgXG4gICAgICAgIGxldCBlcG9jaExhYmVsO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJykgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlcG9jaExhYmVsID0gPFNWR1RleHRFbGVtZW50PiA8dW5rbm93bj4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJyk7XG4gICAgICAgICAgICBlcG9jaExhYmVsLnRleHRDb250ZW50ID0gZXBvY2g7ICAgICAgIFxuICAgICAgICB9XG4gICAgfVxuICAgXG4gICAgem9vbVRvKHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5ldHdvcmsgPSB0aGlzO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbmV0d29yay5kb1pvb20oem9vbUNlbnRlciwgem9vbVNjYWxlLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMpOyB9LFxuICAgICAgICBhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPD0gWm9vbWVyLlpPT01fRFVSQVRJT04gPyAwIDogWm9vbWVyLlpPT01fRFVSQVRJT04gKiAxMDAwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG9ab29tKHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lKDAsIDEvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPD0gWm9vbWVyLlpPT01fRFVSQVRJT04sIHRoaXMuY3VycmVudFpvb21DZW50ZXIsIHpvb21DZW50ZXIsIHRoaXMuY3VycmVudFpvb21TY2FsZSwgem9vbVNjYWxlKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Wm9vbUNlbnRlciA9IHpvb21DZW50ZXI7XG4gICAgICAgIHRoaXMuY3VycmVudFpvb21TY2FsZSA9IHpvb21TY2FsZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIsIGVhc2U6IGJvb2xlYW4sIGZyb21DZW50ZXI6IFZlY3RvciwgdG9DZW50ZXI6IFZlY3RvciwgZnJvbVNjYWxlOiBudW1iZXIsIHRvU2NhbGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIHggKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBmeCA9IGVhc2UgPyBVdGlscy5lYXNlKHgpIDogeDtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gZnJvbUNlbnRlci5kZWx0YSh0b0NlbnRlcilcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIGZ4LCBkZWx0YS55ICogZngpLmFkZChmcm9tQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gKHRvU2NhbGUgLSBmcm9tU2NhbGUpICogZnggKyBmcm9tU2NhbGU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20oY2VudGVyLCBzY2FsZSk7XG4gICAgICAgICAgICBjb25zdCBuZXR3b3JrID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IG5ldHdvcmsuYW5pbWF0ZUZyYW1lKHgsIGFuaW1hdGlvblBlckZyYW1lLCBlYXNlLCBmcm9tQ2VudGVyLCB0b0NlbnRlciwgZnJvbVNjYWxlLCB0b1NjYWxlKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20odG9DZW50ZXIsIHRvU2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGNlbnRlcjogVmVjdG9yLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHpvb21hYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3pvb21hYmxlJyk7XG4gICAgICAgIGlmICh6b29tYWJsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuY2FudmFzU2l6ZS50bC5iZXR3ZWVuKHRoaXMuY2FudmFzU2l6ZS5iciwgMC41KTtcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IG9yaWdpbi54ICsgJ3B4ICcgKyBvcmlnaW4ueSArICdweCc7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlICsgJykgdHJhbnNsYXRlKCcgKyAob3JpZ2luLnggLSBjZW50ZXIueCkgKyAncHgsJyArIChvcmlnaW4ueSAtIGNlbnRlci55KSArICdweCknO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU3RhdGlvbkFkYXB0ZXIsIFN0YXRpb24gfSBmcm9tIFwiLi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1N0YXRpb24gaW1wbGVtZW50cyBTdGF0aW9uQWRhcHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR1JlY3RFbGVtZW50KSB7XG5cbiAgICB9XG4gICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gbmVlZHMgdG8gaGF2ZSBhIGRhdGEtc3RhdGlvbiBpZGVudGlmaWVyJyk7XG4gICAgfVxuICAgIGdldCBiYXNlQ29vcmRzKCk6IFZlY3RvciB7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneCcpIHx8ICcnKSB8fCAwLCBwYXJzZUludCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd5JykgfHwgJycpIHx8IDApO1xuICAgIH1cbiAgICBzZXQgYmFzZUNvb3JkcyhiYXNlQ29vcmRzOiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGJhc2VDb29yZHMueCArICcnKTsgXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBiYXNlQ29vcmRzLnkgKyAnJyk7IFxuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuICAgIGdldCByb3RhdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRpciB8fCAnbicpO1xuICAgIH1cbiAgICBnZXQgbGFiZWxEaXIoKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gUm90YXRpb24uZnJvbSh0aGlzLmVsZW1lbnQuZGF0YXNldC5sYWJlbERpciB8fCAnbicpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXRpb24uZHJhdygwLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXMpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3NpdGlvbkJvdW5kYXJpZXMgPSBnZXRQb3NpdGlvbkJvdW5kYXJpZXMoKTtcbiAgICAgICAgY29uc3Qgc3RvcERpbWVuID0gW3Bvc2l0aW9uQm91bmRhcmllcy54WzFdIC0gcG9zaXRpb25Cb3VuZGFyaWVzLnhbMF0sIHBvc2l0aW9uQm91bmRhcmllcy55WzFdIC0gcG9zaXRpb25Cb3VuZGFyaWVzLnlbMF1dO1xuICAgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwuaW5jbHVkZXMoJ3N0YXRpb24nKSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgc3RhdGlvbiAnICsgdGhpcy5pZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9IHN0b3BEaW1lblswXSA8IDAgJiYgc3RvcERpbWVuWzFdIDwgMCA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKE1hdGgubWF4KHN0b3BEaW1lblswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIChNYXRoLm1heChzdG9wRGltZW5bMV0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4pICsgJycpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCdyb3RhdGUoJyArIHRoaXMucm90YXRpb24uZGVncmVlcyArICcpIHRyYW5zbGF0ZSgnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnLCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnlbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcpJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCB0aGlzLmJhc2VDb29yZHMueCArICcgJyArIHRoaXMuYmFzZUNvb3Jkcy55KTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhdGlvbi5tb3ZlKDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgZnJvbSwgdG8sIGNhbGxiYWNrKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIDAsIDEvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWVWZWN0b3IoZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCB4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgdGhpcy5iYXNlQ29vcmRzID0gZnJvbS5iZXR3ZWVuKHRvLCB4KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgeCwgYW5pbWF0aW9uUGVyRnJhbWUsIGNhbGxiYWNrKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VDb29yZHMgPSB0bztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXRpb24uZXJhc2UoMCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFRyYWluQWRhcHRlciB9IGZyb20gXCIuLi9UcmFpblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1RyYWluIGltcGxlbWVudHMgVHJhaW5BZGFwdGVyIHtcbiAgICBzdGF0aWMgV0FHT05fTEVOR1RIID0gMTA7XG4gICAgc3RhdGljIFRSQUNLX09GRlNFVCA9IDA7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG4gICAgYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC50cmFpbiB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcz8uc3BsaXQoL1xccysvKSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucz8ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5zW2ldWzBdICE9ICctJyAmJiB0b2tlbnNbaV1bMF0gIT0gJysnICYmIHRva2Vuc1tpXVswXSAhPSAnKicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3Auc3RhdGlvbklkID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdG9wcy5wdXNoKG5leHRTdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdG9wLnRyYWNrSW5mbyA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3BzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIGZvbGxvdzogeyBwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyIH0pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWluID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdHJhaW4uZHJhdygwLCBhbmltYXRlLCBmb2xsb3cpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZVBhdGgodGhpcy5jYWxjVHJhaW5IaW5nZXModGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdykubGVuZ3RoVG9TdGFydCwgZm9sbG93LnBhdGgpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgdHJhaW4nO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZm9sbG93OiB7IHBhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIgfSkge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdHJhaW4gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0cmFpbi5tb3ZlKDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgZm9sbG93KTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRoTGVuZ3RoID0gdGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUoXG4gICAgICAgICAgICBmb2xsb3cucGF0aCxcbiAgICAgICAgICAgIHBhdGhMZW5ndGgudG90YWxCb3VuZGVkTGVuZ3RoLFxuICAgICAgICAgICAgcGF0aExlbmd0aC5sZW5ndGhUb1N0YXJ0LFxuICAgICAgICAgICAgKC1kZWxheVNlY29uZHMpIC8gYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLFxuICAgICAgICAgICAgMSAvIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyAvIFN2Z05ldHdvcmsuRlBTKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBhdGhMZW5ndGgoZm9sbG93OiB7IHBhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIgfSk6IHsgbGVuZ3RoVG9TdGFydDogbnVtYmVyLCB0b3RhbEJvdW5kZWRMZW5ndGg6IG51bWJlciB9IHtcbiAgICAgICAgbGV0IGxlbmd0aFRvU3RhcnQgPSAwO1xuICAgICAgICBsZXQgdG90YWxCb3VuZGVkTGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb2xsb3cucGF0aC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBmb2xsb3cucGF0aFtpXS5kZWx0YShmb2xsb3cucGF0aFtpICsgMV0pLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpIDwgZm9sbG93LmZyb20pIHtcbiAgICAgICAgICAgICAgICBsZW5ndGhUb1N0YXJ0ICs9IGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPCBmb2xsb3cudG8pIHtcbiAgICAgICAgICAgICAgICB0b3RhbEJvdW5kZWRMZW5ndGggKz0gbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBsZW5ndGhUb1N0YXJ0OiBsZW5ndGhUb1N0YXJ0LCB0b3RhbEJvdW5kZWRMZW5ndGg6IHRvdGFsQm91bmRlZExlbmd0aCB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UG9zaXRpb25CeUxlbmd0aChjdXJyZW50OiBudW1iZXIsIHBhdGg6IFZlY3RvcltdKTogVmVjdG9yIHtcbiAgICAgICAgbGV0IHRocmVzaCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gcGF0aFtpXS5kZWx0YShwYXRoW2kgKyAxXSk7XG4gICAgICAgICAgICBjb25zdCBsID0gZGVsdGEubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHRocmVzaCArIGwgPj0gY3VycmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoW2ldLmJldHdlZW4ocGF0aFtpICsgMV0sIChjdXJyZW50IC0gdGhyZXNoKSAvIGwpLmFkZChkZWx0YS5yb3RhdGUobmV3IFJvdGF0aW9uKDkwKSkud2l0aExlbmd0aChTdmdUcmFpbi5UUkFDS19PRkZTRVQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocmVzaCArPSBsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWluID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdHJhaW4uZXJhc2UoMCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVQYXRoKHBhdGg6IFZlY3RvcltdKSB7XG4gICAgICAgIGNvbnN0IGQgPSAnTScgKyBwYXRoLm1hcCh2ID0+IHYueCArICcsJyArIHYueSkuam9pbignIEwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY1RyYWluSGluZ2VzKGZyb250OiBudW1iZXIsIHBhdGg6IFZlY3RvcltdKTogVmVjdG9yW10ge1xuICAgICAgICBjb25zdCBuZXdUcmFpbjogVmVjdG9yW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aCArIDE7IGkrKykge1xuICAgICAgICAgICAgbmV3VHJhaW4ucHVzaCh0aGlzLmdldFBvc2l0aW9uQnlMZW5ndGgoZnJvbnQgLSBpICogU3ZnVHJhaW4uV0FHT05fTEVOR1RILCBwYXRoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1RyYWluO1xuICAgIH1cblxuICAgIHByaXZhdGUgZWFzZSh4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gLShNYXRoLmNvcyhNYXRoLlBJICogeCkgLSAxKSAvIDI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUocGF0aDogVmVjdG9yW10sIHRvdGFsQm91bmRlZExlbmd0aDogbnVtYmVyLCBmcm9tOiBudW1iZXIsIHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gZnJvbSArIHRoaXMuZWFzZSh4KSAqIHRvdGFsQm91bmRlZExlbmd0aDtcbiAgICAgICAgY29uc3QgdHJhaW4gPSB0aGlzLmNhbGNUcmFpbkhpbmdlcyhjdXJyZW50LCBwYXRoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHRyYWluKTtcblxuICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuXG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgY29uc3QgdHJhaW4gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7IHRyYWluLmFuaW1hdGVGcmFtZShwYXRoLCB0b3RhbEJvdW5kZWRMZW5ndGgsIGZyb20sIHgsIGFuaW1hdGlvblBlckZyYW1lKTsgfSk7XG4gICAgICAgIH1cbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==