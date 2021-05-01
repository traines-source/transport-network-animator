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
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");





class SvgTrain {
    constructor(element) {
        this.element = element;
        this._stops = [];
        this.boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_3__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
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
        this.setPath(this.calcTrainHinges(this.getPathLength(follow).lengthToStart, follow.path));
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
        this.animateFrame(follow.path, pathLength.totalBoundedLength, pathLength.lengthToStart, (-delaySeconds) / animationDurationSeconds, animationDurationSeconds * 1000, performance.now(), performance.now());
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
                return path[i].between(path[i + 1], (current - thresh) / l).add(delta.rotate(new _Rotation__WEBPACK_IMPORTED_MODULE_4__["Rotation"](90)).withLength(SvgTrain.TRACK_OFFSET));
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
    setPath(path) {
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
    animateFrame(path, totalBoundedLength, lengthToStart, offset, animationDurationMs, startTime, now) {
        const x = offset + (now - startTime) / animationDurationMs * (offset + 1);
        const current = lengthToStart + this.ease(x) * totalBoundedLength;
        const trainPath = this.calcTrainHinges(current, path);
        this.setPath(trainPath);
        if (x < 1) {
            const train = this;
            window.requestAnimationFrame(function (timestamp) { train.animateFrame(path, totalBoundedLength, lengthToStart, offset, animationDurationMs, startTime, timestamp); });
        }
    }
}
SvgTrain.WAGON_LENGTH = 10;
SvgTrain.TRACK_OFFSET = 0;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQXJyaXZhbERlcGFydHVyZVRpbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JvdW5kaW5nQm94LnRzIiwid2VicGFjazovLy8uL3NyYy9HZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR3Jhdml0YXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW5zdGFudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9TdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9UcmFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvWm9vbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdMYWJlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdOZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1RyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBLElBQUksS0FBNEQ7QUFDaEUsSUFBSSxTQUM0QztBQUNoRCxDQUFDLDJCQUEyQjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHVCQUF1QixtQkFBbUI7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0IsZ0JBQWdCLE9BQU8sT0FBTyxVQUFVLEVBQUUsVUFBVTtBQUNqRywwQkFBMEIsaUNBQWlDLGlCQUFpQixFQUFFLEVBQUU7O0FBRWhGO0FBQ0E7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsa0JBQWtCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QyxvQkFBb0I7O0FBRTVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCQUErQiwyQkFBMkI7QUFDMUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixrREFBa0Qsb0JBQW9CLEVBQUU7O0FBRXhFLHlDQUF5QztBQUN6QztBQUNBLGdFQUFnRTtBQUNoRTs7QUFFQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQkFBK0Isb0JBQW9CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsZ0JBQWdCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtCQUErQixnQkFBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixvREFBb0Q7QUFDM0Usb0JBQW9CLG9EQUFvRDtBQUN4RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsbUJBQW1CO0FBQzFDOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBLDhDQUE4QztBQUM5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkIsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0Esc0VBQXNFO0FBQ3RFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLG9EQUFvRDtBQUMzRSxvQkFBb0Isb0RBQW9EO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsbUJBQW1CO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDLEc7Ozs7Ozs7Ozs7OztBQ3hhRDtBQUFBO0FBQU8sTUFBTSxvQkFBb0I7SUFHN0IsWUFBWSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxLQUFLLENBQUMsTUFBYztRQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDO0NBRUo7Ozs7Ozs7Ozs7Ozs7QUNwQkQ7QUFBQTtBQUFBO0FBQWtDO0FBRTNCLE1BQU0sV0FBVztJQUNwQixZQUFtQixFQUFVLEVBQVMsRUFBVTtRQUE3QixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBUTtJQUNoRCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFZLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxJQUFZO1FBQzlELE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSw4Q0FBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLDhDQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxNQUFNO1FBQ0YsT0FBTyxJQUFJLENBQUMsRUFBRSxJQUFJLDhDQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksOENBQU0sQ0FBQyxJQUFJLENBQUM7SUFDNUQsQ0FBQztJQUVELDJCQUEyQixDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDMUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDOUIsTUFBTSxjQUFjLEdBQUcsSUFBSSw4Q0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksOENBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRixNQUFNLFlBQVksR0FBRyxJQUFJLDhDQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEosTUFBTSwyQkFBMkIsR0FBRyxJQUFJLDhDQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2SCxNQUFNLG1CQUFtQixHQUFHLElBQUksOENBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekosT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksOENBQU0sQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDcEksQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7O0FDekJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBa0M7QUFDQTtBQUNFO0FBVTdCLE1BQU0sb0JBQW9CO0lBRzdCLFlBQW9CLE9BQW9DO1FBQXBDLFlBQU8sR0FBUCxPQUFPLENBQTZCO1FBSXhELFNBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QixPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDckIsU0FBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pCLGdCQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7SUFMdkMsQ0FBQztJQU9ELElBQUksQ0FBQyxLQUFhLEVBQUUsT0FBZ0I7UUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSw4Q0FBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLGdEQUFPLENBQUMsUUFBUSxFQUFFLGdEQUFPLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hHLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFhLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtRQUNuRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFTyxvQkFBb0I7UUFDeEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFFdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDakMsSUFBSSxNQUFNLElBQUksOENBQU0sQ0FBQyxJQUFJLEVBQUU7WUFDdkIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sUUFBUSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7QUFoQ00saUNBQVksR0FBRyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNkN0I7QUFBQTtBQUFBO0FBQUE7QUFBa0M7QUFFRjtBQUdoQyxtQ0FBbUM7QUFDbkMsTUFBTSxJQUFJLEdBQUcsbUJBQU8sQ0FBQywrQ0FBTSxDQUFDLENBQUM7QUFHdEIsTUFBTSxVQUFVO0lBa0JuQixZQUFvQixlQUFnQztRQUFoQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFUNUMseUJBQW9CLEdBQTRCLEVBQUUsQ0FBQztRQUNuRCxrQkFBYSxHQUFpRixFQUFFLENBQUM7UUFFakcsZ0JBQVcsR0FBd0IsRUFBRSxDQUFDO1FBQ3RDLGdDQUEyQixHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLFVBQUssR0FBeUIsRUFBRSxDQUFDO1FBQ2pDLGFBQVEsR0FBNEUsRUFBRSxDQUFDO1FBQ3ZGLFVBQUssR0FBRyxLQUFLLENBQUM7SUFJdEIsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFhLEVBQUUsT0FBZ0I7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ1gsT0FBTyxLQUFLLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTyxVQUFVO1FBQ2QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLENBQUMsMkJBQTJCLElBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNoRixJQUFJLENBQUMsMkJBQTJCLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUVsRixrQ0FBa0M7U0FDckM7SUFFTCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFFSyxhQUFhO1FBQ2pCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU8sdUJBQXVCO1FBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUMsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1NBQ3ZDO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU8sVUFBVSxDQUFDLElBQVU7UUFDekIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxSSxDQUFDO0lBRU8sZUFBZTtRQUNuQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEQsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxFQUFFO2dCQUM3QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLHlDQUF5QztvQkFDakYsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsMkJBQTJCO29CQUN0QyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCw4QkFBOEI7YUFDakM7U0FDSjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLEtBQUssTUFBTSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0MsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLDhDQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ1Y7SUFDTCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsSUFBVTtRQUMvQixLQUFLLE1BQU0sUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlDLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtnQkFDbEIsU0FBUzthQUNaO1lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTt3QkFDNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUNwRSxDQUFDO3dCQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDOzRCQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzs0QkFDckMsYUFBYSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzs0QkFDeEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7NEJBQ3pDLEtBQUssRUFBRSxLQUFLO3lCQUNmLENBQUMsQ0FBQzt3QkFDSCxPQUFPO3FCQUNWO2lCQUNKO2FBQ0o7U0FDSjtRQUNELDhJQUE4STtRQUM5SSwrTUFBK007SUFDbk4sQ0FBQztJQUVPLGFBQWEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDakQsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU8sd0JBQXdCLENBQUMsQ0FBTSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLFFBQWdCO1FBQ3RGLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUFFTyxZQUFZO1FBQ2hCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQztRQUN4QixNQUFNLE1BQU0sR0FBRyxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUM3QixNQUFNLEtBQUssR0FBYSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNyRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFXLEVBQUUsT0FBaUIsRUFBRSxFQUFFO1lBQ3ZFLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCO1lBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxHQUFHLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNwRixFQUFFLEdBQUcsSUFBSSxDQUFDLCtDQUErQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3RGLHVFQUF1RTtZQUN2RSxFQUFFLEdBQUcsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEIsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFTyxxQkFBcUI7UUFDekIsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQzNCLEtBQUssTUFBTSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0MsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDN0MsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sTUFBTSxDQUFDLENBQVcsRUFBRSxRQUE0RCxFQUFFLE9BQWU7UUFDckcsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFFTyxNQUFNLENBQUMsQ0FBVyxFQUFFLFFBQTRELEVBQUUsT0FBZTtRQUNyRyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVPLDZDQUE2QyxDQUFDLEVBQVUsRUFBRSxDQUFXLEVBQUUsT0FBaUIsRUFBRSxVQUFzQjtRQUNwSCxLQUFLLE1BQU0sTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JELEVBQUUsSUFBSSxDQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN0RCxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDN0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDO1lBQy9GLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztTQUNsRztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVPLCtDQUErQyxDQUFDLEVBQVUsRUFBRSxDQUFXLEVBQUUsT0FBaUIsRUFBRSxVQUFzQjtRQUN0SCxLQUFLLE1BQU0sTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JELEVBQUUsSUFBSSxDQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQzdELEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztZQUM3QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDO1lBQ3RHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7U0FDekc7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTyw4QkFBOEIsQ0FBQyxFQUFVLEVBQUUsQ0FBVyxFQUFFLE9BQWlCLEVBQUUsVUFBc0I7UUFDckcsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN4RCxNQUFNLENBQUMsR0FBRyxJQUFJLDhDQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkgsTUFBTSxDQUFDLEdBQUcsSUFBSSw4Q0FBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdILE1BQU0sQ0FBQyxHQUFHLElBQUksOENBQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVuSCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUUsRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFFaEQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztZQUMxSixPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDO1lBQzFKLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDL0osT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztZQUMvSixPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDO1lBQzFKLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7U0FDN0o7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTyxtQ0FBbUMsQ0FBQyxFQUFVLEVBQUUsQ0FBVyxFQUFFLE9BQWlCLEVBQUUsVUFBc0I7UUFDMUcsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2tCQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztrQkFDOUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JGLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUgsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlILE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5SCxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakk7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTyxvQ0FBb0MsQ0FBQyxPQUFpQjtRQUMxRCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQztTQUMzQztJQUNMLENBQUM7SUFFTyxlQUFlLENBQUMsUUFBa0I7UUFDdEMsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNsRSxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5RCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixFQUFFO2dCQUNwRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3REO1NBQ0o7SUFDTCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsUUFBa0IsRUFBRSxLQUFhLEVBQUUsT0FBZ0I7UUFDNUUsTUFBTSx3QkFBd0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoSixLQUFLLE1BQU0sTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxJQUFJLDhDQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hIO1FBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQyxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsSixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEc7UUFDRCxLQUFLLElBQUksd0JBQXdCLENBQUM7UUFDbEMsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVPLG1CQUFtQixDQUFDLElBQVUsRUFBRSxNQUFjO1FBQ2xELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDNUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQywyQkFBMkIsR0FBRyxXQUFXLENBQUMsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM3SCxDQUFDO0lBRU8sc0JBQXNCLENBQUMsUUFBa0I7UUFDN0MsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osS0FBSyxNQUFNLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMvQyxHQUFHLElBQUksSUFBSSw4Q0FBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDO1NBQ2pIO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU8scUJBQXFCLENBQUMsU0FBaUIsRUFBRSxRQUFrQjtRQUMvRCxPQUFPLElBQUksOENBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUcsQ0FBQztJQUVPLFNBQVMsQ0FBQyxRQUFnQjtRQUM5QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQ3RDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELElBQUksT0FBTyxJQUFJLFNBQVM7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxHQUFHLGVBQWUsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSw4Q0FBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBQyxDQUFDO1NBQ3JHO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFVO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVM7WUFDeEIsT0FBTztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRU8sYUFBYSxDQUFDLElBQVU7UUFDNUIsT0FBTyw0Q0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7O0FBclNNLG9CQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ2hCLHlCQUFjLEdBQUcsV0FBVyxDQUFDO0FBQzdCLDRCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUN4QixvREFBeUMsR0FBRyxJQUFJLENBQUM7QUFDakQsZ0JBQUssR0FBRyxHQUFHLENBQUM7QUFDWiw0QkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDdEIsMEJBQWUsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNqQmxDO0FBQUE7QUFBTyxNQUFNLE9BQU87SUFHaEIsWUFBb0IsTUFBYyxFQUFVLE9BQWUsRUFBVSxLQUFhO1FBQTlELFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUVsRixDQUFDO0lBQ0QsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFlOztRQUN2QixPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxFQUFFLENBQUM7SUFDOUUsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFhO1FBQ2hCLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN4RCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFhO1FBQ2YsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDcEM7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQzs7QUEvQk0sZ0JBQVEsR0FBWSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0FDRXJEO0FBQUE7QUFBQTtBQUFBO0FBQXNDO0FBRUo7QUFXM0IsTUFBTSxLQUFLO0lBR2QsWUFBb0IsT0FBcUIsRUFBVSxlQUFnQztRQUEvRCxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBSW5GLFNBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QixPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDckIsZ0JBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUN2QyxhQUFRLEdBQVksRUFBRSxDQUFDO0lBTHZCLENBQUM7SUFPRCxXQUFXO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsSUFBSSxTQUFTLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsQ0FBQztTQUNuRjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFhLEVBQUUsT0FBZ0I7UUFDaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUU7WUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNoQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDOUM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDN0I7U0FDSjthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksU0FBUyxFQUFFO1lBQzFDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2pGLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxDQUFDLElBQUksU0FBUyxFQUFFO29CQUNoQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ2xCLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNqQixJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTs0QkFDakIsS0FBSyxHQUFHLElBQUksQ0FBQzs0QkFDYixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7eUJBQzFCO29CQUNMLENBQUMsQ0FBQyxDQUFDO29CQUNILElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQ1IsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUMvRixrQkFBa0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN2QyxDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7d0JBQy9CLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7cUJBQzFDO2lCQUNKO1lBRUwsQ0FBQyxDQUFDLENBQUM7U0FDTjthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLDhDQUFNLENBQUMsSUFBSSxFQUFFLGtEQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU8sY0FBYyxDQUFDLFlBQW9CLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtRQUMzRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsSUFBSSxJQUFJO2dCQUNULE1BQU07WUFDVixPQUFPLElBQUksS0FBSyxDQUFDLFlBQVksR0FBQyxHQUFHLENBQUM7U0FDckM7UUFDRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRWxDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLDhDQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CO1FBQ3ZHLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGtEQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLEtBQUssR0FBRyw4Q0FBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSw4Q0FBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUcsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksOENBQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUV4RixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBYSxFQUFFLE9BQWdCLEVBQUUsT0FBZ0I7UUFDbkQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0I7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLFNBQVMsRUFBRTtZQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDdEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDOztBQWxHTSxrQkFBWSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ2Q3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBa0M7QUFFSTtBQUNOO0FBQ2tCO0FBWTNDLE1BQU0sSUFBSTtJQUliLFlBQW9CLE9BQW9CLEVBQVUsZUFBZ0MsRUFBVSxZQUFxQixJQUFJO1FBQWpHLFlBQU8sR0FBUCxPQUFPLENBQWE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQUlySCxTQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDekIsT0FBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3JCLFNBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QixnQkFBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLFdBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUVyQixrQkFBYSxHQUF3QixTQUFTLENBQUM7UUFDL0MsaUJBQVksR0FBeUIsU0FBUyxDQUFDO1FBQy9DLFVBQUssR0FBYSxFQUFFLENBQUM7SUFWN0IsQ0FBQztJQVlELElBQUksQ0FBQyxLQUFhLEVBQUUsT0FBZ0I7UUFDaEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDakMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV4QixJQUFJLEtBQUssR0FBRyxJQUFJLDhEQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNsRSxJQUFJLElBQUksSUFBSSxTQUFTO2dCQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUMsQ0FBQztZQUM3RixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQztnQkFDaEIsS0FBSyxHQUFHLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFekYsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkksS0FBSyxHQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNoQztRQUNELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0YsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFhLEVBQUUsd0JBQWdDLEVBQUUsSUFBYyxFQUFFLGNBQXNCO1FBQ3hGLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDbkQsT0FBTztTQUNWO1FBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDL0IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekM7UUFDRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLHdCQUF3QixFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDNUcsU0FBUyxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7UUFDdkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFhLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtRQUNuRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksSUFBSSxJQUFJLFNBQVM7Z0JBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxDQUFDO1lBQzdGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNQLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyw0Q0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLFFBQVEsSUFBSSxTQUFTLEVBQUU7b0JBQ3ZCLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzdCO2FBQ0o7U0FDSjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxLQUFhLEVBQUUsZ0JBQXdCLEVBQUUsYUFBcUI7UUFDcEYsSUFBSSxnQkFBZ0IsR0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNuQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLEdBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQy9DLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELElBQUksSUFBSSxJQUFJLFNBQVM7Z0JBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBb0IsR0FBRyxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUM7WUFDN0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztJQUVPLGdCQUFnQixDQUFDLE9BQWdCLEVBQUUsaUJBQXlCLEVBQUUsS0FBcUIsRUFBRSxJQUFjLEVBQUUsS0FBYSxFQUFFLE9BQWdCLEVBQUUsT0FBZ0I7UUFDMUosTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUM3QixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9GLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakYsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVqRSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXBHLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXZGLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksU0FBUyxFQUFFO2dCQUN0RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUU1RixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksa0RBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzlGLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDaEc7aUJBQU0sSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZixPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDcEY7WUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQztTQUNsQztRQUNELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwQixLQUFLLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDekQsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7UUFDN0IsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVPLG1DQUFtQyxDQUFDLE9BQWdCLEVBQUUsaUJBQXlCLEVBQUUsR0FBYSxFQUFFLElBQWM7O1FBQ2xILElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDbEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsT0FBTyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEY7UUFDRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFELE1BQU0sWUFBWSxTQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDBDQUFFLElBQUksQ0FBQztRQUMxRSxJQUFJLFlBQVksSUFBSSxTQUFTLEVBQUU7WUFDM0IsTUFBTSx3QkFBd0IsR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxZQUFZLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLGtEQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksa0RBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xJLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGtEQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoRjtZQUNELE9BQU8sd0JBQXdCLENBQUM7U0FDbkM7UUFDRCxPQUFPLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBR08sZUFBZSxDQUFDLFlBQWtDLEVBQUUsYUFBa0MsRUFBRSxRQUFnQixFQUFFLFFBQWdCOztRQUM5SCxJQUFJLFlBQVksSUFBSSxTQUFTLEVBQUU7WUFDM0IsTUFBTSxxQkFBcUIsU0FBRyxhQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsUUFBUSxtQ0FBSSxJQUFJLGtEQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUM1SDthQUFNO1lBQ0gsWUFBWSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxrREFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdEQ7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRU8sVUFBVSxDQUFDLFNBQWlCLEVBQUUsT0FBaUIsRUFBRSxPQUFlLEVBQUUsS0FBZSxFQUFFLElBQWM7UUFDckcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE1BQU0sS0FBSyxHQUFXLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsTUFBTSxPQUFPLEdBQUcsOENBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sT0FBTyxHQUFHLDhDQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDakQsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO1FBQ2xFLElBQUksUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNwRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksOENBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxPQUFpQixFQUFFLFFBQWlCLEVBQUUsTUFBZTtRQUMvRSxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsNENBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUQsSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7WUFDckMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNuQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkQsTUFBTSxlQUFlLEdBQUcsSUFBSSxrREFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3RKLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV6RSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDckc7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRU8sb0JBQW9CLENBQUMsSUFBYyxFQUFFLE9BQWdCO1FBQ3pELElBQUksQ0FBQyxPQUFPO1lBQ1IsT0FBTyxDQUFDLENBQUM7UUFDYixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsRCxDQUFDO0lBRU8sY0FBYyxDQUFDLElBQWM7UUFDakMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7U0FDN0M7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQWlCO1FBQ3JCLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQUU7Z0JBQzdCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O0FBNU5NLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFVBQUssR0FBRyxHQUFHLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNwQnZCO0FBQUE7QUFBQTtBQUFBO0FBQWlDO0FBQ0M7QUFFM0IsTUFBTSxTQUFTO0lBQXRCO1FBQ1ksV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQzlCLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO0lBNkhwQixDQUFDO0lBM0hHLE9BQU8sQ0FBQyxJQUFVO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFVO1FBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1QjtpQkFBTTtnQkFDSCxDQUFDLEVBQUUsQ0FBQzthQUNQO1NBQ0o7UUFDRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRUQsY0FBYyxDQUFDLGFBQXFCLEVBQUUsV0FBbUI7UUFDckQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakMsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRTtvQkFDbEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDM0Q7YUFDSjtTQUNKO1FBQ0QsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pDLEtBQUssTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO29CQUNoQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNuRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRSxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvRCxPQUFPLEVBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLGNBQWMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLEVBQUUsRUFBQyxDQUFDO2lCQUMzSDthQUNKO1NBQ0o7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVPLGdCQUFnQixDQUFDLFNBQWlCO1FBQ3RDLE1BQU0sR0FBRyxHQUErQixFQUFFLENBQUM7UUFDM0MsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMzQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQzthQUN0QztTQUNKO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU8sbUJBQW1CLENBQUMsSUFBVSxFQUFFLElBQVUsRUFBRSxFQUFRO1FBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSw4Q0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksOENBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEY7UUFDRCxpRkFBaUY7UUFDakYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzNCLElBQUksT0FBTyxHQUFHLEtBQUssRUFBRTtZQUNqQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDaEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUNyQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3BDO1FBQ0QsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUVPLE9BQU8sQ0FBQyxLQUFlLEVBQUUsT0FBZTtRQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzFCLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7U0FDSjtRQUNELE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDO0lBRU8sY0FBYyxDQUFDLEtBQVcsRUFBRSxLQUFXO1FBQzNDLEtBQUssTUFBTSxTQUFTLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbEQsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDbEQsSUFBSSxTQUFTLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7b0JBQzVDLE9BQU8sU0FBUyxDQUFDO2lCQUNwQjthQUNKO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sYUFBYTtRQUNqQixNQUFNLFVBQVUsR0FBNEIsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDOUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM1QixJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxFQUFFO3dCQUN0QyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDL0I7eUJBQU07d0JBQ0gsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO3FCQUM3QjtpQkFDSjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLE9BQU8sR0FBVyxFQUFFLENBQUM7UUFDM0IsS0FBSyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDOUQsSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFO2dCQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksNkNBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN6QztTQUNKO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7O0FDbElEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBb0M7QUFDQTtBQUdGO0FBQ007QUFDRTtBQUNaO0FBZXZCLE1BQU0sT0FBTztJQVFoQixZQUFvQixPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQVBuQyxlQUFVLEdBQXFELEVBQUUsQ0FBQztRQUNsRSxhQUFRLEdBQStCLEVBQUUsQ0FBQztRQUMxQyxlQUFVLEdBQWlDLEVBQUUsQ0FBQztRQUM5QyxnQkFBVyxHQUFvQixFQUFFLENBQUM7UUFLdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNEQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDhDQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxXQUFXLENBQUMsRUFBVTtRQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELGFBQWEsQ0FBQyxFQUFVO1FBQ3BCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxTQUFTLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLG9EQUFTLEVBQUUsQ0FBQztTQUN6QztRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBVSxFQUFFLFVBQWtCLEVBQUUsUUFBa0I7UUFDaEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxjQUFjLENBQUMsT0FBZ0I7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0RBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUM3QztJQUNMLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxHQUFZO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLE9BQU8sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELG9CQUFvQixDQUFDLEdBQVksRUFBRSxPQUFnQjtRQUMvQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sUUFBUSxHQUFvQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0QsSUFBSSxLQUFLLEdBQUcsOENBQU0sQ0FBQyxhQUFhLENBQUM7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNyRTtRQUNELEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxLQUFhLEVBQUUsT0FBZ0I7UUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5RCxLQUFLLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN0RjtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxPQUFzQixFQUFFLEtBQWEsRUFBRSxPQUFnQixFQUFFLE9BQWdCO1FBQ2hHLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDaEUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDakcsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDakQ7WUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRSxLQUFLLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sV0FBVyxDQUFDLE9BQXNCLEVBQUUsS0FBYSxFQUFFLE9BQWdCO1FBQ3ZFLElBQUksT0FBTyxZQUFZLDBDQUFJLEVBQUU7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDcEM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTyxZQUFZLENBQUMsT0FBc0IsRUFBRSxLQUFhLEVBQUUsT0FBZ0I7UUFDeEUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVPLGFBQWEsQ0FBQyxPQUFnQixFQUFFLE9BQWdCO1FBQ3BELElBQUksQ0FBQyxPQUFPO1lBQ1IsT0FBTyxLQUFLLENBQUM7UUFDakIsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDL0IsT0FBTyxLQUFLLENBQUM7UUFDakIsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELGVBQWUsQ0FBQyxLQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUM7SUFDL0MsQ0FBQztJQUVELFVBQVUsQ0FBQyxPQUFzQjtRQUM3QixJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsZ0RBQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBSSxPQUFPLFlBQVksZ0RBQU8sRUFBRTtZQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsT0FBZ0IsRUFBRSxPQUFzQjtRQUNqRSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQVM7WUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVM7WUFDM0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBWTtRQUNwQixJQUFJLEtBQUssR0FBa0IsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNyQyxJQUFJLE1BQU0sR0FBa0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzRixJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDaEIsS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLEtBQUssSUFBSSxTQUFTO2dCQUNsQixPQUFPLElBQUksQ0FBQztZQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLE1BQU0sSUFBSSxTQUFTO2dCQUNuQixPQUFPLElBQUksQ0FBQztTQUNuQjtRQUNELE9BQU8sSUFBSSxnREFBTyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVPLGlCQUFpQixDQUFDLFNBQWlCLEVBQUUsSUFBeUI7UUFDbEUsSUFBSSxJQUFJLElBQUksU0FBUztZQUNqQixPQUFPLElBQUksQ0FBQztRQUNoQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDcEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDN0MsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUU7Z0JBQzdFLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDNUI7U0FDSjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7OztBQzdLRDtBQUFBO0FBQU8sTUFBTSxjQUFjO0lBR3ZCLFlBQVksS0FBYTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWE7UUFDcEIsSUFBSSxLQUFLLElBQUksRUFBRSxFQUFFO1lBQ2IsT0FBTyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBYTtRQUNwQixNQUFNLE1BQU0sR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyQyxPQUFPLElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQseUJBQXlCLENBQUMsU0FBb0M7UUFDMUQsSUFBSSxTQUFTLElBQUksU0FBUyxFQUFFO1lBQ3hCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFHLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUM7UUFDaEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsWUFBWTtRQUNSLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTyxJQUFJLGNBQWMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksV0FBVztRQUNYLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsVUFBVTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7SUFDaEMsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7O0FDL0NEO0FBQUE7QUFBQTtBQUFnQztBQUV6QixNQUFNLFFBQVE7SUFHakIsWUFBb0IsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUVwQyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFpQjtRQUN6QixPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0RCxJQUFJLDRDQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ25DLE9BQU8sR0FBRyxDQUFDO2FBQ2Q7U0FDSjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1AsT0FBTyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBYztRQUNkLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUc7WUFDWCxHQUFHLElBQUksR0FBRyxDQUFDO1FBQ2YsSUFBSSxHQUFHLEdBQUcsR0FBRztZQUNULEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDZixPQUFPLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBYztRQUNoQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNmLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDTCxDQUFDLElBQUksR0FBRyxDQUFDO1lBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDTCxDQUFDLElBQUksR0FBRyxDQUFDO1lBQ2IsSUFBSSxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3ZCLElBQUksNENBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3RCLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDUCxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFDZCxHQUFHLElBQUksR0FBRyxDQUFDO2FBQ1YsSUFBSSxHQUFHLEdBQUcsRUFBRTtZQUNiLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDZixPQUFPLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELGdCQUFnQixDQUFDLFVBQW9CO1FBQ2pDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2hELE1BQU0sR0FBRyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEdBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEYsT0FBTyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEdBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxVQUFvQixFQUFFLFNBQW1CO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2hELElBQUksR0FBRyxDQUFDO1FBQ1IsSUFBSSxTQUFTLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDeEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEdBQUc7Z0JBQ2hDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQzs7Z0JBRVYsR0FBRyxHQUFHLEVBQUUsQ0FBQztTQUNoQjthQUFNO1lBQ0gsSUFBSSxRQUFRLEdBQUcsRUFBRSxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLEdBQUcsR0FBRyxDQUFDLENBQUM7O2dCQUVSLEdBQUcsR0FBRyxHQUFHLENBQUM7U0FDakI7UUFDRCxPQUFPLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7O0FBdEZjLGFBQUksR0FBNkIsRUFBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ0h0STtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBa0M7QUFHRjtBQUlZO0FBWXJDLE1BQU0sSUFBSTtJQUNiLFlBQW1CLFNBQWlCLEVBQVMsU0FBaUI7UUFBM0MsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFJdkQsVUFBSyxHQUFrQixJQUFJLENBQUM7SUFGbkMsQ0FBQztDQUdKO0FBUU0sTUFBTSxPQUFPO0lBZWhCLFlBQW9CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBVm5DLGtCQUFhLEdBQW9DLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7UUFDaEUsbUJBQWMsR0FBWSxFQUFFLENBQUM7UUFDN0IsWUFBTyxHQUFtQixTQUFTLENBQUM7UUFDNUMsYUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pDLGFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDckIsU0FBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLFNBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QixPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFJckIsQ0FBQztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLFVBQWtCO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUN6QyxDQUFDO0lBR0QsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLHdEQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBR0QsT0FBTyxDQUFDLElBQVUsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsVUFBVSxDQUFDLElBQVU7UUFDakIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQVk7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUNwQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQVk7UUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7WUFDbkMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtnQkFDakMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO2dCQUNILENBQUMsRUFBRSxDQUFDO2FBQ1A7U0FDSjtJQUNMLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVPLGdCQUFnQixDQUFDLElBQVUsRUFBRSxvQkFBcUM7UUFDdEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsT0FBTyxDQUFDLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxFQUFFO1lBQ3BDLElBQUksb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxDQUFDLEVBQUUsQ0FBQzthQUNQO1NBQ0o7SUFDTCxDQUFDO0lBRUQsMkJBQTJCLENBQUMsUUFBZ0I7UUFDeEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUNoQixPQUFPLENBQUMsQ0FBQztTQUNaO1FBQ0QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUNoQixPQUFPLENBQUMsQ0FBQztTQUNaO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVPLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsb0JBQXFDOztRQUM5RSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixPQUFPLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7WUFDcEMsSUFBSSwyQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLDBDQUFFLElBQUksS0FBSSxRQUFRLEVBQUU7Z0JBQ2hELE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEM7WUFDRCxDQUFDLEVBQUUsQ0FBQztTQUNQO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFZLEVBQUUsY0FBOEIsRUFBRSxJQUFVOztRQUNoRSxJQUFJLGNBQWMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNqQyxPQUFPLGNBQWMsQ0FBQyxXQUFXLENBQUM7U0FDckM7UUFDRCxJQUFJLGlCQUFJLENBQUMsT0FBTywwQ0FBRSxJQUFJLDBDQUFFLElBQUksS0FBSSxJQUFJLENBQUMsSUFBSSxJQUFJLFdBQUksQ0FBQyxPQUFPLDBDQUFFLElBQUksS0FBSSxJQUFJLEVBQUU7WUFDckUsYUFBTyxJQUFJLENBQUMsT0FBTywwQ0FBRSxLQUFLLENBQUM7U0FDOUI7UUFDRCxNQUFNLHlCQUF5QixHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3RyxDQUFDO0lBRUQsdUJBQXVCLENBQUMsV0FBcUIsRUFBRSxhQUFxQjtRQUNoRSxJQUFJLFFBQWdCLENBQUM7UUFDckIsSUFBSSxXQUFXLENBQUMsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDaEMsUUFBUSxHQUFHLElBQUksOENBQU0sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRTthQUFNO1lBQ0gsUUFBUSxHQUFHLElBQUksOENBQU0sQ0FBQyxDQUFDLEVBQUUsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNuRTtRQUNELFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVPLGtCQUFrQjtRQUN0QixPQUFPO1lBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN2RCxDQUFDLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1NBQzFELENBQUM7SUFDTixDQUFDO0lBRU8seUJBQXlCLENBQUMsb0JBQXFDO1FBQ25FLElBQUksb0JBQW9CLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNsQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7UUFDRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7UUFDYixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlDLElBQUksS0FBSyxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDdkMsS0FBSyxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUN6QztZQUNELElBQUksSUFBSSxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDdEMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUN4QztTQUNKO1FBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxDQUFDLFlBQW9CLEVBQUUsT0FBZ0I7UUFDdkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsY0FBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELElBQUksQ0FBQyxZQUFvQixFQUFFLHdCQUFnQyxFQUFFLEVBQVU7UUFDbkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSx3QkFBd0IsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoSixDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQW9CLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtRQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNqQyxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxJQUFZLEVBQUUsTUFBYztRQUMzQyxJQUFJLDRDQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdkIsT0FBTyxDQUFDLENBQUM7UUFDYixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RixJQUFJLEdBQUcsR0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2YsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLEdBQUcsT0FBTyxDQUFDLGFBQWEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZHLENBQUM7SUFFRCxhQUFhO1FBQ1QsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEUsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7O0FBbExNLHFCQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLDBCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUN4QixzQkFBYyxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQy9COUI7QUFBQTtBQUFBO0FBQThEO0FBV3ZELE1BQU0sS0FBSztJQUVkLFlBQW9CLE9BQXFCLEVBQVUsZUFBZ0M7UUFBL0QsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUluRixTQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDekIsT0FBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3JCLFNBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QixnQkFBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0lBTHZDLENBQUM7SUFPRCxJQUFJLENBQUMsS0FBYSxFQUFFLE9BQWdCO1FBQ2hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDL0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLHlCQUF5QixDQUFDLENBQUM7U0FDckU7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFJLDBFQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1RCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoRixJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzNDO2dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMzRztpQkFBTTtnQkFDSCxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLDBCQUEwQixHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQ3hHO1NBQ0o7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBYSxFQUFFLE9BQWdCLEVBQUUsT0FBZ0I7UUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7QUNwREQ7QUFBQTtBQUFPLE1BQU0sS0FBSztJQUdkLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDOUIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQy9DLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQVcsRUFBRSxPQUFpQztRQUMxRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNMLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDdkIsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFTO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRSxDQUFDOztBQXZCZSxpQkFBVyxHQUFXLEtBQUssQ0FBQzs7Ozs7Ozs7Ozs7OztBQ0RoRDtBQUFBO0FBQUE7QUFBQTtBQUFzQztBQUNOO0FBRXpCLE1BQU0sTUFBTTtJQUlmLFlBQW9CLEVBQVUsRUFBVSxFQUFVO1FBQTlCLE9BQUUsR0FBRixFQUFFLENBQVE7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFRO0lBRWxELENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQWM7UUFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxHQUFHLENBQUMsSUFBYTtRQUNiLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxLQUFLLENBQUMsSUFBWTtRQUNkLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxNQUFNLENBQUMsS0FBZTtRQUNsQixJQUFJLEdBQUcsR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDeEgsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFZO1FBQ25CLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQseUJBQXlCLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDaEQsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDO1FBQzNCLE1BQU0sZ0JBQWdCLEdBQUcsNENBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDdkMsTUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSw0Q0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO1NBQzNCO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDMUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxJQUFZLEVBQUUsSUFBWTtRQUM5QyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVPLFlBQVksQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7UUFDbkQsT0FBTyw0Q0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksNENBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLDRDQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksNENBQUss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Q0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU8sWUFBWSxDQUFDLElBQWMsRUFBRSxrQkFBMEIsRUFBRSxhQUFxQixFQUFFLE1BQWMsRUFBRSxtQkFBMkIsRUFBRSxTQUE4QixFQUFFLEdBQXdCO1FBQ3pMLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRSxNQUFNLE9BQU8sR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUNsRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQztZQUNuQixNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBVSxTQUFTLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxSztJQUNMLENBQUM7O0FBckpNLHFCQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLHFCQUFZLEdBQUcsQ0FBQyxDQUFDIiwiZmlsZSI6Im5ldHdvcmstYW5pbWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgICAoZmFjdG9yeSgoZ2xvYmFsLmZtaW4gPSBnbG9iYWwuZm1pbiB8fCB7fSkpKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqIGZpbmRzIHRoZSB6ZXJvcyBvZiBhIGZ1bmN0aW9uLCBnaXZlbiB0d28gc3RhcnRpbmcgcG9pbnRzICh3aGljaCBtdXN0XG4gICAgICogaGF2ZSBvcHBvc2l0ZSBzaWducyAqL1xuICAgIGZ1bmN0aW9uIGJpc2VjdChmLCBhLCBiLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtZXRlcnMubWF4SXRlcmF0aW9ucyB8fCAxMDAsXG4gICAgICAgICAgICB0b2xlcmFuY2UgPSBwYXJhbWV0ZXJzLnRvbGVyYW5jZSB8fCAxZS0xMCxcbiAgICAgICAgICAgIGZBID0gZihhKSxcbiAgICAgICAgICAgIGZCID0gZihiKSxcbiAgICAgICAgICAgIGRlbHRhID0gYiAtIGE7XG5cbiAgICAgICAgaWYgKGZBICogZkIgPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkluaXRpYWwgYmlzZWN0IHBvaW50cyBtdXN0IGhhdmUgb3Bwb3NpdGUgc2lnbnNcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmQSA9PT0gMCkgcmV0dXJuIGE7XG4gICAgICAgIGlmIChmQiA9PT0gMCkgcmV0dXJuIGI7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGRlbHRhIC89IDI7XG4gICAgICAgICAgICB2YXIgbWlkID0gYSArIGRlbHRhLFxuICAgICAgICAgICAgICAgIGZNaWQgPSBmKG1pZCk7XG5cbiAgICAgICAgICAgIGlmIChmTWlkICogZkEgPj0gMCkge1xuICAgICAgICAgICAgICAgIGEgPSBtaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoTWF0aC5hYnMoZGVsdGEpIDwgdG9sZXJhbmNlKSB8fCAoZk1pZCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhICsgZGVsdGE7XG4gICAgfVxuXG4gICAgLy8gbmVlZCBzb21lIGJhc2ljIG9wZXJhdGlvbnMgb24gdmVjdG9ycywgcmF0aGVyIHRoYW4gYWRkaW5nIGEgZGVwZW5kZW5jeSxcbiAgICAvLyBqdXN0IGRlZmluZSBoZXJlXG4gICAgZnVuY3Rpb24gemVyb3MoeCkgeyB2YXIgciA9IG5ldyBBcnJheSh4KTsgZm9yICh2YXIgaSA9IDA7IGkgPCB4OyArK2kpIHsgcltpXSA9IDA7IH0gcmV0dXJuIHI7IH1cbiAgICBmdW5jdGlvbiB6ZXJvc00oeCx5KSB7IHJldHVybiB6ZXJvcyh4KS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiB6ZXJvcyh5KTsgfSk7IH1cblxuICAgIGZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gICAgICAgIHZhciByZXQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJldCArPSBhW2ldICogYltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm0yKGEpICB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZG90KGEsIGEpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZShyZXQsIHZhbHVlLCBjKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJldFtpXSA9IHZhbHVlW2ldICogYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlaWdodGVkU3VtKHJldCwgdzEsIHYxLCB3MiwgdjIpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIHJldFtqXSA9IHcxICogdjFbal0gKyB3MiAqIHYyW2pdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIG1pbmltaXplcyBhIGZ1bmN0aW9uIHVzaW5nIHRoZSBkb3duaGlsbCBzaW1wbGV4IG1ldGhvZCAqL1xuICAgIGZ1bmN0aW9uIG5lbGRlck1lYWQoZiwgeDAsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgfHwge307XG5cbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJzLm1heEl0ZXJhdGlvbnMgfHwgeDAubGVuZ3RoICogMjAwLFxuICAgICAgICAgICAgbm9uWmVyb0RlbHRhID0gcGFyYW1ldGVycy5ub25aZXJvRGVsdGEgfHwgMS4wNSxcbiAgICAgICAgICAgIHplcm9EZWx0YSA9IHBhcmFtZXRlcnMuemVyb0RlbHRhIHx8IDAuMDAxLFxuICAgICAgICAgICAgbWluRXJyb3JEZWx0YSA9IHBhcmFtZXRlcnMubWluRXJyb3JEZWx0YSB8fCAxZS02LFxuICAgICAgICAgICAgbWluVG9sZXJhbmNlID0gcGFyYW1ldGVycy5taW5FcnJvckRlbHRhIHx8IDFlLTUsXG4gICAgICAgICAgICByaG8gPSAocGFyYW1ldGVycy5yaG8gIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnJobyA6IDEsXG4gICAgICAgICAgICBjaGkgPSAocGFyYW1ldGVycy5jaGkgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLmNoaSA6IDIsXG4gICAgICAgICAgICBwc2kgPSAocGFyYW1ldGVycy5wc2kgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnBzaSA6IC0wLjUsXG4gICAgICAgICAgICBzaWdtYSA9IChwYXJhbWV0ZXJzLnNpZ21hICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5zaWdtYSA6IDAuNSxcbiAgICAgICAgICAgIG1heERpZmY7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBzaW1wbGV4LlxuICAgICAgICB2YXIgTiA9IHgwLmxlbmd0aCxcbiAgICAgICAgICAgIHNpbXBsZXggPSBuZXcgQXJyYXkoTiArIDEpO1xuICAgICAgICBzaW1wbGV4WzBdID0geDA7XG4gICAgICAgIHNpbXBsZXhbMF0uZnggPSBmKHgwKTtcbiAgICAgICAgc2ltcGxleFswXS5pZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSB4MC5zbGljZSgpO1xuICAgICAgICAgICAgcG9pbnRbaV0gPSBwb2ludFtpXSA/IHBvaW50W2ldICogbm9uWmVyb0RlbHRhIDogemVyb0RlbHRhO1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdID0gcG9pbnQ7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0uZnggPSBmKHBvaW50KTtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXS5pZCA9IGkrMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNpbXBsZXgodmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzaW1wbGV4W05dW2ldID0gdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaW1wbGV4W05dLmZ4ID0gdmFsdWUuZng7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc29ydE9yZGVyID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS5meCAtIGIuZng7IH07XG5cbiAgICAgICAgdmFyIGNlbnRyb2lkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIHJlZmxlY3RlZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICBjb250cmFjdGVkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIGV4cGFuZGVkID0geDAuc2xpY2UoKTtcblxuICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCBtYXhJdGVyYXRpb25zOyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgc2ltcGxleC5zb3J0KHNvcnRPcmRlcik7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb3B5IHRoZSBzaW1wbGV4IChzaW5jZSBsYXRlciBpdGVyYXRpb25zIHdpbGwgbXV0YXRlKSBhbmRcbiAgICAgICAgICAgICAgICAvLyBzb3J0IGl0IHRvIGhhdmUgYSBjb25zaXN0ZW50IG9yZGVyIGJldHdlZW4gaXRlcmF0aW9uc1xuICAgICAgICAgICAgICAgIHZhciBzb3J0ZWRTaW1wbGV4ID0gc2ltcGxleC5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0geC5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5meCA9IHguZng7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmlkID0geC5pZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNvcnRlZFNpbXBsZXguc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEuaWQgLSBiLmlkOyB9KTtcblxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuaGlzdG9yeS5wdXNoKHt4OiBzaW1wbGV4WzBdLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBzaW1wbGV4WzBdLmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGV4OiBzb3J0ZWRTaW1wbGV4fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1heERpZmYgPSAwO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgICAgIG1heERpZmYgPSBNYXRoLm1heChtYXhEaWZmLCBNYXRoLmFicyhzaW1wbGV4WzBdW2ldIC0gc2ltcGxleFsxXVtpXSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKE1hdGguYWJzKHNpbXBsZXhbMF0uZnggLSBzaW1wbGV4W05dLmZ4KSA8IG1pbkVycm9yRGVsdGEpICYmXG4gICAgICAgICAgICAgICAgKG1heERpZmYgPCBtaW5Ub2xlcmFuY2UpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbXB1dGUgdGhlIGNlbnRyb2lkIG9mIGFsbCBidXQgdGhlIHdvcnN0IHBvaW50IGluIHRoZSBzaW1wbGV4XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICAgICAgY2VudHJvaWRbaV0gPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldICs9IHNpbXBsZXhbal1baV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldIC89IE47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlZmxlY3QgdGhlIHdvcnN0IHBvaW50IHBhc3QgdGhlIGNlbnRyb2lkICBhbmQgY29tcHV0ZSBsb3NzIGF0IHJlZmxlY3RlZFxuICAgICAgICAgICAgLy8gcG9pbnRcbiAgICAgICAgICAgIHZhciB3b3JzdCA9IHNpbXBsZXhbTl07XG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShyZWZsZWN0ZWQsIDErcmhvLCBjZW50cm9pZCwgLXJobywgd29yc3QpO1xuICAgICAgICAgICAgcmVmbGVjdGVkLmZ4ID0gZihyZWZsZWN0ZWQpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgcmVmbGVjdGVkIHBvaW50IGlzIHRoZSBiZXN0IHNlZW4sIHRoZW4gcG9zc2libHkgZXhwYW5kXG4gICAgICAgICAgICBpZiAocmVmbGVjdGVkLmZ4IDwgc2ltcGxleFswXS5meCkge1xuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKGV4cGFuZGVkLCAxK2NoaSwgY2VudHJvaWQsIC1jaGksIHdvcnN0KTtcbiAgICAgICAgICAgICAgICBleHBhbmRlZC5meCA9IGYoZXhwYW5kZWQpO1xuICAgICAgICAgICAgICAgIGlmIChleHBhbmRlZC5meCA8IHJlZmxlY3RlZC5meCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICB9ICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChyZWZsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlZmxlY3RlZCBwb2ludCBpcyB3b3JzZSB0aGFuIHRoZSBzZWNvbmQgd29yc3QsIHdlIG5lZWQgdG9cbiAgICAgICAgICAgIC8vIGNvbnRyYWN0XG4gICAgICAgICAgICBlbHNlIGlmIChyZWZsZWN0ZWQuZnggPj0gc2ltcGxleFtOLTFdLmZ4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3VsZFJlZHVjZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlZmxlY3RlZC5meCA+IHdvcnN0LmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGFuIGluc2lkZSBjb250cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShjb250cmFjdGVkLCAxK3BzaSwgY2VudHJvaWQsIC1wc2ksIHdvcnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3RlZC5meCA9IGYoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cmFjdGVkLmZ4IDwgd29yc3QuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRSZWR1Y2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYW4gb3V0c2lkZSBjb250cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShjb250cmFjdGVkLCAxLXBzaSAqIHJobywgY2VudHJvaWQsIHBzaSpyaG8sIHdvcnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3RlZC5meCA9IGYoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cmFjdGVkLmZ4IDwgcmVmbGVjdGVkLmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRSZWR1Y2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZG9uJ3QgY29udHJhY3QgaGVyZSwgd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2lnbWEgPj0gMSkgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYSByZWR1Y3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IHNpbXBsZXgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHNpbXBsZXhbaV0sIDEgLSBzaWdtYSwgc2ltcGxleFswXSwgc2lnbWEsIHNpbXBsZXhbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxleFtpXS5meCA9IGYoc2ltcGxleFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgocmVmbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNpbXBsZXguc29ydChzb3J0T3JkZXIpO1xuICAgICAgICByZXR1cm4ge2Z4IDogc2ltcGxleFswXS5meCxcbiAgICAgICAgICAgICAgICB4IDogc2ltcGxleFswXX07XG4gICAgfVxuXG4gICAgLy8vIHNlYXJjaGVzIGFsb25nIGxpbmUgJ3BrJyBmb3IgYSBwb2ludCB0aGF0IHNhdGlmaWVzIHRoZSB3b2xmZSBjb25kaXRpb25zXG4gICAgLy8vIFNlZSAnTnVtZXJpY2FsIE9wdGltaXphdGlvbicgYnkgTm9jZWRhbCBhbmQgV3JpZ2h0IHA1OS02MFxuICAgIC8vLyBmIDogb2JqZWN0aXZlIGZ1bmN0aW9uXG4gICAgLy8vIHBrIDogc2VhcmNoIGRpcmVjdGlvblxuICAgIC8vLyBjdXJyZW50OiBvYmplY3QgY29udGFpbmluZyBjdXJyZW50IGdyYWRpZW50L2xvc3NcbiAgICAvLy8gbmV4dDogb3V0cHV0OiBjb250YWlucyBuZXh0IGdyYWRpZW50L2xvc3NcbiAgICAvLy8gcmV0dXJucyBhOiBzdGVwIHNpemUgdGFrZW5cbiAgICBmdW5jdGlvbiB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGEsIGMxLCBjMikge1xuICAgICAgICB2YXIgcGhpMCA9IGN1cnJlbnQuZngsIHBoaVByaW1lMCA9IGRvdChjdXJyZW50LmZ4cHJpbWUsIHBrKSxcbiAgICAgICAgICAgIHBoaSA9IHBoaTAsIHBoaV9vbGQgPSBwaGkwLFxuICAgICAgICAgICAgcGhpUHJpbWUgPSBwaGlQcmltZTAsXG4gICAgICAgICAgICBhMCA9IDA7XG5cbiAgICAgICAgYSA9IGEgfHwgMTtcbiAgICAgICAgYzEgPSBjMSB8fCAxZS02O1xuICAgICAgICBjMiA9IGMyIHx8IDAuMTtcblxuICAgICAgICBmdW5jdGlvbiB6b29tKGFfbG8sIGFfaGlnaCwgcGhpX2xvKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCAxNjsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBhID0gKGFfbG8gKyBhX2hpZ2gpLzI7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0obmV4dC54LCAxLjAsIGN1cnJlbnQueCwgYSwgcGspO1xuICAgICAgICAgICAgICAgIHBoaSA9IG5leHQuZnggPSBmKG5leHQueCwgbmV4dC5meHByaW1lKTtcbiAgICAgICAgICAgICAgICBwaGlQcmltZSA9IGRvdChuZXh0LmZ4cHJpbWUsIHBrKTtcblxuICAgICAgICAgICAgICAgIGlmICgocGhpID4gKHBoaTAgKyBjMSAqIGEgKiBwaGlQcmltZTApKSB8fFxuICAgICAgICAgICAgICAgICAgICAocGhpID49IHBoaV9sbykpIHtcbiAgICAgICAgICAgICAgICAgICAgYV9oaWdoID0gYTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMocGhpUHJpbWUpIDw9IC1jMiAqIHBoaVByaW1lMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocGhpUHJpbWUgKiAoYV9oaWdoIC0gYV9sbykgPj0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhX2hpZ2ggPSBhX2xvO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYV9sbyA9IGE7XG4gICAgICAgICAgICAgICAgICAgIHBoaV9sbyA9IHBoaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgMTA7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShuZXh0LngsIDEuMCwgY3VycmVudC54LCBhLCBwayk7XG4gICAgICAgICAgICBwaGkgPSBuZXh0LmZ4ID0gZihuZXh0LngsIG5leHQuZnhwcmltZSk7XG4gICAgICAgICAgICBwaGlQcmltZSA9IGRvdChuZXh0LmZ4cHJpbWUsIHBrKTtcbiAgICAgICAgICAgIGlmICgocGhpID4gKHBoaTAgKyBjMSAqIGEgKiBwaGlQcmltZTApKSB8fFxuICAgICAgICAgICAgICAgIChpdGVyYXRpb24gJiYgKHBoaSA+PSBwaGlfb2xkKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbShhMCwgYSwgcGhpX29sZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhwaGlQcmltZSkgPD0gLWMyICogcGhpUHJpbWUwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwaGlQcmltZSA+PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6b29tKGEsIGEwLCBwaGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwaGlfb2xkID0gcGhpO1xuICAgICAgICAgICAgYTAgPSBhO1xuICAgICAgICAgICAgYSAqPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uanVnYXRlR3JhZGllbnQoZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIC8vIGFsbG9jYXRlIGFsbCBtZW1vcnkgdXAgZnJvbnQgaGVyZSwga2VlcCBvdXQgb2YgdGhlIGxvb3AgZm9yIHBlcmZvbWFuY2VcbiAgICAgICAgLy8gcmVhc29uc1xuICAgICAgICB2YXIgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbmV4dCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgeWsgPSBpbml0aWFsLnNsaWNlKCksXG4gICAgICAgICAgICBwaywgdGVtcCxcbiAgICAgICAgICAgIGEgPSAxLFxuICAgICAgICAgICAgbWF4SXRlcmF0aW9ucztcblxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDIwO1xuXG4gICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgcGsgPSBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKTtcbiAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwtMSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGEgPSB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGEpO1xuXG4gICAgICAgICAgICAvLyB0b2RvOiBoaXN0b3J5IGluIHdyb25nIHNwb3Q/XG4gICAgICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogYX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWEpIHtcbiAgICAgICAgICAgICAgICAvLyBmYWlpbGVkIHRvIGZpbmQgcG9pbnQgdGhhdCBzYXRpZmllcyB3b2xmZSBjb25kaXRpb25zLlxuICAgICAgICAgICAgICAgIC8vIHJlc2V0IGRpcmVjdGlvbiBmb3IgbmV4dCBpdGVyYXRpb25cbiAgICAgICAgICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLCAtMSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGRpcmVjdGlvbiB1c2luZyBQb2xha+KAk1JpYmllcmUgQ0cgbWV0aG9kXG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oeWssIDEsIG5leHQuZnhwcmltZSwgLTEsIGN1cnJlbnQuZnhwcmltZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGVsdGFfayA9IGRvdChjdXJyZW50LmZ4cHJpbWUsIGN1cnJlbnQuZnhwcmltZSksXG4gICAgICAgICAgICAgICAgICAgIGJldGFfayA9IE1hdGgubWF4KDAsIGRvdCh5aywgbmV4dC5meHByaW1lKSAvIGRlbHRhX2spO1xuXG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0ocGssIGJldGFfaywgcGssIC0xLCBuZXh0LmZ4cHJpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICAgICAgbmV4dCA9IHRlbXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDw9IDFlLTUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGF9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdyYWRpZW50RGVzY2VudChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMTAwLFxuICAgICAgICAgICAgbGVhcm5SYXRlID0gcGFyYW1zLmxlYXJuUmF0ZSB8fCAwLjAwMSxcbiAgICAgICAgICAgIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY3VycmVudC54LCAxLCBjdXJyZW50LngsIC1sZWFyblJhdGUsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgICAgICBpZiAobm9ybTIoY3VycmVudC5meHByaW1lKSA8PSAxZS01KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoKGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIHZhciBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBuZXh0ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAxMDAsXG4gICAgICAgICAgICBsZWFyblJhdGUgPSBwYXJhbXMubGVhcm5SYXRlIHx8IDEsXG4gICAgICAgICAgICBwayA9IGluaXRpYWwuc2xpY2UoKSxcbiAgICAgICAgICAgIGMxID0gcGFyYW1zLmMxIHx8IDFlLTMsXG4gICAgICAgICAgICBjMiA9IHBhcmFtcy5jMiB8fCAwLjEsXG4gICAgICAgICAgICB0ZW1wLFxuICAgICAgICAgICAgZnVuY3Rpb25DYWxscyA9IFtdO1xuXG4gICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgLy8gd3JhcCB0aGUgZnVuY3Rpb24gY2FsbCB0byB0cmFjayBsaW5lc2VhcmNoIHNhbXBsZXNcbiAgICAgICAgICAgIHZhciBpbm5lciA9IGY7XG4gICAgICAgICAgICBmID0gZnVuY3Rpb24oeCwgZnhwcmltZSkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMucHVzaCh4LnNsaWNlKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbm5lcih4LCBmeHByaW1lKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLCAtMSk7XG4gICAgICAgICAgICBsZWFyblJhdGUgPSB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGxlYXJuUmF0ZSwgYzEsIGMyKTtcblxuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxsczogZnVuY3Rpb25DYWxscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWFyblJhdGU6IGxlYXJuUmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogbGVhcm5SYXRlfSk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxscyA9IFtdO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50O1xuICAgICAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICBuZXh0ID0gdGVtcDtcblxuICAgICAgICAgICAgaWYgKChsZWFyblJhdGUgPT09IDApIHx8IChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDwgMWUtNSkpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZXhwb3J0cy5iaXNlY3QgPSBiaXNlY3Q7XG4gICAgZXhwb3J0cy5uZWxkZXJNZWFkID0gbmVsZGVyTWVhZDtcbiAgICBleHBvcnRzLmNvbmp1Z2F0ZUdyYWRpZW50ID0gY29uanVnYXRlR3JhZGllbnQ7XG4gICAgZXhwb3J0cy5ncmFkaWVudERlc2NlbnQgPSBncmFkaWVudERlc2NlbnQ7XG4gICAgZXhwb3J0cy5ncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoID0gZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaDtcbiAgICBleHBvcnRzLnplcm9zID0gemVyb3M7XG4gICAgZXhwb3J0cy56ZXJvc00gPSB6ZXJvc007XG4gICAgZXhwb3J0cy5ub3JtMiA9IG5vcm0yO1xuICAgIGV4cG9ydHMud2VpZ2h0ZWRTdW0gPSB3ZWlnaHRlZFN1bTtcbiAgICBleHBvcnRzLnNjYWxlID0gc2NhbGU7XG5cbn0pKTsiLCJleHBvcnQgY2xhc3MgQXJyaXZhbERlcGFydHVyZVRpbWUge1xuICAgIHByaXZhdGUgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2Uob2Zmc2V0OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzcGxpdCA9IHRoaXMudmFsdWUuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoc3BsaXRbb2Zmc2V0XSkgKiAoc3BsaXRbb2Zmc2V0LTFdID09ICctJyA/IC0xIDogMSlcbiAgICB9XG5cbiAgICBnZXQgZGVwYXJ0dXJlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKDIpO1xuICAgIH1cblxuICAgIGdldCBhcnJpdmFsKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKDQpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBCb3VuZGluZ0JveCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHRsOiBWZWN0b3IsIHB1YmxpYyBicjogVmVjdG9yKSB7XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20odGxfeDogbnVtYmVyLCB0bF95OiBudW1iZXIsIGJyX3g6IG51bWJlciwgYnJfeTogbnVtYmVyKTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KG5ldyBWZWN0b3IodGxfeCwgdGxfeSksIG5ldyBWZWN0b3IoYnJfeCwgYnJfeSkpO1xuICAgIH1cbiAgICBcbiAgICBnZXQgZGltZW5zaW9ucygpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy50bC5kZWx0YSh0aGlzLmJyKTtcbiAgICB9XG4gICAgaXNOdWxsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50bCA9PSBWZWN0b3IuTlVMTCB8fCB0aGlzLmJyID09IFZlY3Rvci5OVUxMO1xuICAgIH1cbiAgICBcbiAgICBjYWxjdWxhdGVCb3VuZGluZ0JveEZvclpvb20ocGVyY2VudFg6IG51bWJlciwgcGVyY2VudFk6IG51bWJlcik6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gYmJveC5kaW1lbnNpb25zO1xuICAgICAgICBjb25zdCByZWxhdGl2ZUNlbnRlciA9IG5ldyBWZWN0b3IocGVyY2VudFggLyAxMDAsIHBlcmNlbnRZIC8gMTAwKTtcbiAgICAgICAgY29uc3QgY2VudGVyID0gYmJveC50bC5hZGQobmV3IFZlY3RvcihkZWx0YS54ICogcmVsYXRpdmVDZW50ZXIueCwgZGVsdGEueSAqIHJlbGF0aXZlQ2VudGVyLnkpKTtcbiAgICAgICAgY29uc3QgZWRnZURpc3RhbmNlID0gbmV3IFZlY3RvcihkZWx0YS54ICogTWF0aC5taW4ocmVsYXRpdmVDZW50ZXIueCwgMSAtIHJlbGF0aXZlQ2VudGVyLngpLCBkZWx0YS55ICogTWF0aC5taW4ocmVsYXRpdmVDZW50ZXIueSwgMSAtIHJlbGF0aXZlQ2VudGVyLnkpKTtcbiAgICAgICAgY29uc3QgcmF0aW9QcmVzZXJ2aW5nRWRnZURpc3RhbmNlID0gbmV3IFZlY3RvcihlZGdlRGlzdGFuY2UueSAqIGRlbHRhLnggLyBkZWx0YS55LCBlZGdlRGlzdGFuY2UueCAqIGRlbHRhLnkgLyBkZWx0YS54KTtcbiAgICAgICAgY29uc3QgbWluaW1hbEVkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoTWF0aC5taW4oZWRnZURpc3RhbmNlLngsIHJhdGlvUHJlc2VydmluZ0VkZ2VEaXN0YW5jZS54KSwgTWF0aC5taW4oZWRnZURpc3RhbmNlLnksIHJhdGlvUHJlc2VydmluZ0VkZ2VEaXN0YW5jZS55KSk7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goY2VudGVyLmFkZChuZXcgVmVjdG9yKC1taW5pbWFsRWRnZURpc3RhbmNlLngsIC1taW5pbWFsRWRnZURpc3RhbmNlLnkpKSwgY2VudGVyLmFkZChtaW5pbWFsRWRnZURpc3RhbmNlKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBab29tZXIgfSBmcm9tIFwiLi9ab29tZXJcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBib3VuZGluZ0JveDogQm91bmRpbmdCb3g7XG4gICAgem9vbTogVmVjdG9yO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBHZW5lcmljVGltZWREcmF3YWJsZSBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBMQUJFTF9IRUlHSFQgPSAxMjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIGJvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmJvdW5kaW5nQm94KTtcbiAgICAgICAgem9vbWVyLmluY2x1ZGUodGhpcy5nZXRab29tZWRCb3VuZGluZ0JveCgpLCBJbnN0YW50LkJJR19CQU5HLCBJbnN0YW50LkJJR19CQU5HLCB0cnVlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCB0aGlzLmFkYXB0ZXIuZnJvbS5kZWx0YSh0aGlzLmFkYXB0ZXIudG8pLCB6b29tZXIuY2VudGVyLCB6b29tZXIuc2NhbGUpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRab29tZWRCb3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG5cbiAgICAgICAgY29uc3QgY2VudGVyID0gdGhpcy5hZGFwdGVyLnpvb207XG4gICAgICAgIGlmIChjZW50ZXIgIT0gVmVjdG9yLk5VTEwpIHtcbiAgICAgICAgICAgIGNvbnN0IHpvb21CYm94ID0gYmJveC5jYWxjdWxhdGVCb3VuZGluZ0JveEZvclpvb20oY2VudGVyLngsIGNlbnRlci55KTtcbiAgICAgICAgICAgIHJldHVybiB6b29tQmJveDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmJveDtcbiAgICB9XG5cbiAgICBcbn0iLCJpbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuXG4vL2NvbnN0IG1hdGhqcyA9IHJlcXVpcmUoJ21hdGhqcycpO1xuY29uc3QgZm1pbiA9IHJlcXVpcmUoJ2ZtaW4nKTtcblxuXG5leHBvcnQgY2xhc3MgR3Jhdml0YXRvciB7XG4gICAgc3RhdGljIElORVJUTkVTUyA9IDEwMDtcbiAgICBzdGF0aWMgR1JBRElFTlRfU0NBTEUgPSAwLjAwMDAwMDAwMTtcbiAgICBzdGF0aWMgREVWSUFUSU9OX1dBUk5JTkcgPSAwLjI7XG4gICAgc3RhdGljIElOSVRJQUxJWkVfUkVMQVRJVkVfVE9fRVVDTElESUFOX0RJU1RBTkNFID0gdHJ1ZTtcbiAgICBzdGF0aWMgU1BFRUQgPSAyNTA7XG4gICAgc3RhdGljIE1BWF9BTklNX0RVUkFUSU9OID0gNjtcbiAgICBzdGF0aWMgQ09MT1JfREVWSUFUSU9OID0gMC4wMjtcblxuICAgIHByaXZhdGUgaW5pdGlhbFdlaWdodEZhY3RvcnM6IHtbaWQ6IHN0cmluZ10gOiBudW1iZXJ9ID0ge307XG4gICAgcHJpdmF0ZSBpbml0aWFsQW5nbGVzOiB7YVN0YXRpb246IHN0cmluZywgY29tbW9uU3RhdGlvbjogc3RyaW5nLCBiU3RhdGlvbjogc3RyaW5nLCBhbmdsZTogbnVtYmVyfVtdID0gW107XG4gICAgcHJpdmF0ZSBhbmdsZUY6IGFueTtcbiAgICBwcml2YXRlIGFuZ2xlRlByaW1lOiB7W2lkOiBzdHJpbmddOiBhbnl9ID0ge307XG4gICAgcHJpdmF0ZSBhdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW86IG51bWJlciA9IC0xO1xuICAgIHByaXZhdGUgZWRnZXM6IHtbaWQ6IHN0cmluZ106IExpbmV9ID0ge307XG4gICAgcHJpdmF0ZSB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yLCBzdGFydENvb3JkczogVmVjdG9yfX0gPSB7fTtcbiAgICBwcml2YXRlIGRpcnR5ID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGdyYXZpdGF0ZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpcnR5KVxuICAgICAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVHcmFwaCgpO1xuICAgICAgICBjb25zdCBzb2x1dGlvbiA9IHRoaXMubWluaW1pemVMb3NzKCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0RGlzdGFuY2VzKHNvbHV0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb24sIGRlbGF5LCBhbmltYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGNvbnN0IHdlaWdodHMgPSB0aGlzLmdldFdlaWdodHNTdW0oKTtcbiAgICAgICAgY29uc3QgZXVjbGlkaWFuID0gdGhpcy5nZXRFdWNsaWRpYW5EaXN0YW5jZVN1bSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnd2VpZ2h0czonLCB3ZWlnaHRzLCAnZXVjbGlkaWFuOicsIGV1Y2xpZGlhbik7XG4gICAgICAgIGlmICh0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyA9PSAtMSAmJiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID0gd2VpZ2h0cyAvIGV1Y2xpZGlhbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW9eLTEnLCAxL3RoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvKTtcblxuICAgICAgICAgICAgLy90aGlzLmluaXRpYWxpemVBbmdsZUdyYWRpZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8qcHJpdmF0ZSBpbml0aWFsaXplQW5nbGVHcmFkaWVudHMoKSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSAnKGFjb3MoKChiX3gtYV94KSooYl94LWNfeCkrKGJfeS1hX3kpKihiX3ktY195KSkvKHNxcnQoKGJfeC1hX3gpXjIrKGJfeS1hX3kpXjIpKnNxcnQoKGJfeC1jX3gpXjIrKGJfeS1jX3kpXjIpKSkqKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkvYWJzKCgoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpKS1jb25zdCknO1xuICAgICAgICBjb25zdCBmID0gbWF0aGpzLnBhcnNlKGV4cHJlc3Npb24pO1xuICAgICAgICB0aGlzLmFuZ2xlRiA9IGYuY29tcGlsZSgpO1xuXG4gICAgICAgIGNvbnN0IGZEZWx0YSA9IG1hdGhqcy5wYXJzZShleHByZXNzaW9uICsgJ14yJyk7XG5cbiAgICAgICAgY29uc3QgdmFycyA9IFsnYV94JywgJ2FfeScsICdiX3gnLCAnYl95JywgJ2NfeCcsICdjX3knXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHZhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYW5nbGVGUHJpbWVbdmFyc1tpXV0gPSBtYXRoanMuZGVyaXZhdGl2ZShmRGVsdGEsIHZhcnNbaV0pLmNvbXBpbGUoKTtcbiAgICAgICAgfVxuICAgIH0qL1xuXG4gICAgcHJpdmF0ZSBnZXRXZWlnaHRzU3VtKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIHN1bSArPSBlZGdlLndlaWdodCB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRFdWNsaWRpYW5EaXN0YW5jZVN1bSgpIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gdGhpcy5lZGdlVmVjdG9yKGVkZ2UpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZWRnZVZlY3RvcihlZGdlOiBMaW5lKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemVHcmFwaCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gPSBHcmF2aXRhdG9yLklOSVRJQUxJWkVfUkVMQVRJVkVfVE9fRVVDTElESUFOX0RJU1RBTkNFXG4gICAgICAgICAgICAgICAgICAgID8gMSAvIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5lZGdlVmVjdG9yKGVkZ2UpLmxlbmd0aCAvIChlZGdlLndlaWdodCB8fCAwKTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuYWRkSW5pdGlhbEFuZ2xlcyhlZGdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHZlcnRleC5pbmRleCA9IG5ldyBWZWN0b3IoaSwgaSsxKTtcbiAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkSW5pdGlhbEFuZ2xlcyhlZGdlOiBMaW5lKSB7XG4gICAgICAgIGZvciAoY29uc3QgYWRqYWNlbnQgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgaWYgKGFkamFjZW50ID09IGVkZ2UpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTwyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8MjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkID09IGFkamFjZW50LnRlcm1pbmlbal0uc3RhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMudGhyZWVEb3RBbmdsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVtpXjFdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pW2ldLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbYWRqYWNlbnQudGVybWluaVtqXjFdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsQW5nbGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFTdGF0aW9uOiBlZGdlLnRlcm1pbmlbaV4xXS5zdGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uU3RhdGlvbjogZWRnZS50ZXJtaW5pW2ldLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiU3RhdGlvbjogYWRqYWNlbnQudGVybWluaVtqXjFdLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vZGVyaXZlIGFyY2NvcygoKGEtYykqKGUtZykrKGItZCkqKGYtaCkpLyhzcXJ0KChhLWMpXjIrKGItZCleMikqc3FydCgoZS1nKV4yKyhmLWgpXjIpKSkqKChmLWgpKihhLWMpLShiLWQpKihlLWcpKS98KChmLWgpKihhLWMpLShiLWQpKihlLWcpKXxcbiAgICAgICAgLy9kZXJpdmUgYWNvcygoKGJfeC1hX3gpKihiX3gtY194KSsoYl95LWFfeSkqKGJfeS1jX3kpKS8oc3FydCgoYl94LWFfeCleMisoYl95LWFfeSleMikqc3FydCgoYl94LWNfeCleMisoYl95LWNfeSleMikpKSooKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKS9hYnMoKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJlZURvdEFuZ2xlKGE6IFZlY3RvciwgYjogVmVjdG9yLCBjOiBWZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGLCBhLCBiLCBjLCAwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbihmOiBhbnksIGE6IFZlY3RvciwgYjogVmVjdG9yLCBjOiBWZWN0b3IsIG9sZFZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGYuZXZhbHVhdGUoe2FfeDogYS54LCBhX3k6IGEueSwgYl94OiBiLngsIGJfeTogYi55LCBjX3g6IGMueCwgY195OiBjLnksIGNvbnN0OiBvbGRWYWx1ZX0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWluaW1pemVMb3NzKCk6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3QgZ3Jhdml0YXRvciA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtoaXN0b3J5OiBbXX07XG4gICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXJbXSA9IHRoaXMuc3RhcnRTdGF0aW9uUG9zaXRpb25zKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZm1pbi5jb25qdWdhdGVHcmFkaWVudCgoQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdKSA9PiB7XG4gICAgICAgICAgICBmeHByaW1lID0gZnhwcmltZSB8fCBBLnNsaWNlKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnhwcmltZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZ4cHJpbWVbaV0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGZ4ID0gMDtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5kZWx0YVRvU3RhcnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9DdXJyZW50U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIC8vZnggPSB0aGlzLmRlbHRhVG9BbmdsZXNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb05ld0Rpc3RhbmNlc1RvRW5zdXJlQWNjdXJhY3koZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgdGhpcy5zY2FsZUdyYWRpZW50VG9FbnN1cmVXb3JraW5nU3RlcFNpemUoZnhwcmltZSk7XG4gICAgICAgICAgICByZXR1cm4gZng7XG4gICAgICAgIH0sIHN0YXJ0LCBwYXJhbXMpO1xuICAgICAgICByZXR1cm4gc29sdXRpb24ueDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0U3RhdGlvblBvc2l0aW9ucygpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdGFydFt2ZXJ0ZXguaW5kZXgueF0gPSB2ZXJ0ZXguc3RhcnRDb29yZHMueDtcbiAgICAgICAgICAgIHN0YXJ0W3ZlcnRleC5pbmRleC55XSA9IHZlcnRleC5zdGFydENvb3Jkcy55O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGFydDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWChBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueF0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC54XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWShBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueV0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IudmVydGljZXMpKSB7XG4gICAgICAgICAgICBmeCArPSAoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGFydENvb3Jkcy54LCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGFydENvb3Jkcy55LCAyKVxuICAgICAgICAgICAgICAgICkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnhdICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXJ0Q29vcmRzLngpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC55XSArPSAyICogKEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGFydENvb3Jkcy55KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9DdXJyZW50U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXMoZ3Jhdml0YXRvci52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIGZ4ICs9IChcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy54LCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueSwgMilcbiAgICAgICAgICAgICAgICApICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC54XSArPSAyICogKEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueCkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnldICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy55KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9BbmdsZXNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLmluaXRpYWxBbmdsZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC55XSk7XG4gICAgICAgICAgICBjb25zdCBiID0gbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueV0pO1xuICAgICAgICAgICAgY29uc3QgYyA9IG5ldyBWZWN0b3IoQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueV0pO1xuXG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKTtcbiAgICAgICAgICAgIGZ4ICs9IE1hdGgucG93KGRlbHRhLCAyKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuXG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueF0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYV94J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYV95J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC54XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydiX3gnXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnldICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2JfeSddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnhdICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2NfeCddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnldICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2NfeSddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9OZXdEaXN0YW5jZXNUb0Vuc3VyZUFjY3VyYWN5KGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXMoZ3Jhdml0YXRvci5lZGdlcykpIHsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB2ID0gTWF0aC5wb3codGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICAgICAgICAgICAgICsgTWF0aC5wb3codGhpcy5kZWx0YVkoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICAgICAgICAgICAgIC0gTWF0aC5wb3coZ3Jhdml0YXRvci5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApLCAyKTtcbiAgICAgICAgICAgIGZ4ICs9IE1hdGgucG93KHYsIDIpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnhdICs9ICs0ICogdiAqIHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueV0gKz0gKzQgKiB2ICogdGhpcy5kZWx0YVkoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC54XSArPSAtNCAqIHYgKiB0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnldICs9IC00ICogdiAqIHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2NhbGVHcmFkaWVudFRvRW5zdXJlV29ya2luZ1N0ZXBTaXplKGZ4cHJpbWU6IG51bWJlcltdKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmeHByaW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmeHByaW1lW2ldICo9IEdyYXZpdGF0b3IuR1JBRElFTlRfU0NBTEU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzc2VydERpc3RhbmNlcyhzb2x1dGlvbjogbnVtYmVyW10pIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWF0aW9uID0gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgICAgIE1hdGgucG93KHRoaXMuZGVsdGFYKHNvbHV0aW9uLCB0aGlzLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVkoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICApIC8gKHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSAqIChlZGdlLndlaWdodCB8fCAwKSkgLSAxO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRldmlhdGlvbikgPiBHcmF2aXRhdG9yLkRFVklBVElPTl9XQVJOSU5HKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVkZ2UubmFtZSwgJ2RpdmVyZ2VzIGJ5ICcsIGRldmlhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IFxuXG4gICAgcHJpdmF0ZSBtb3ZlU3RhdGlvbnNBbmRMaW5lcyhzb2x1dGlvbjogbnVtYmVyW10sIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPSBhbmltYXRlID8gTWF0aC5taW4oR3Jhdml0YXRvci5NQVhfQU5JTV9EVVJBVElPTiwgdGhpcy5nZXRUb3RhbERpc3RhbmNlVG9Nb3ZlKHNvbHV0aW9uKSAvIEdyYXZpdGF0b3IuU1BFRUQpIDogMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgdmVydGV4LnN0YXRpb24ubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBuZXcgVmVjdG9yKHNvbHV0aW9uW3ZlcnRleC5pbmRleC54XSwgc29sdXRpb25bdmVydGV4LmluZGV4LnldKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkcyA9IFt0aGlzLmdldE5ld1N0YXRpb25Qb3NpdGlvbihlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBzb2x1dGlvbiksIHRoaXMuZ2V0TmV3U3RhdGlvblBvc2l0aW9uKGVkZ2UudGVybWluaVsxXS5zdGF0aW9uSWQsIHNvbHV0aW9uKV07XG4gICAgICAgICAgICBlZGdlLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgY29vcmRzLCB0aGlzLmdldENvbG9yQnlEZXZpYXRpb24oZWRnZSwgZWRnZS53ZWlnaHQgfHwgMCkpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ICs9IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcztcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29sb3JCeURldmlhdGlvbihlZGdlOiBMaW5lLCB3ZWlnaHQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBpbml0aWFsRGlzdCA9IHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uc3RhcnRDb29yZHMuZGVsdGEodGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5zdGFydENvb3JkcykubGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsICh3ZWlnaHQgLSB0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyAqIGluaXRpYWxEaXN0KSAqIEdyYXZpdGF0b3IuQ09MT1JfREVWSUFUSU9OKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUb3RhbERpc3RhbmNlVG9Nb3ZlKHNvbHV0aW9uOiBudW1iZXJbXSkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IG5ldyBWZWN0b3Ioc29sdXRpb25bdmVydGV4LmluZGV4LnhdLCBzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueV0pLmRlbHRhKHZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TmV3U3RhdGlvblBvc2l0aW9uKHN0YXRpb25JZDogc3RyaW5nLCBzb2x1dGlvbjogbnVtYmVyW10pOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcihzb2x1dGlvblt0aGlzLnZlcnRpY2VzW3N0YXRpb25JZF0uaW5kZXgueF0sIHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC55XSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRWZXJ0ZXgodmVydGV4SWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNlc1t2ZXJ0ZXhJZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQodmVydGV4SWQpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyB2ZXJ0ZXhJZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9IHtzdGF0aW9uOiBzdGF0aW9uLCBpbmRleDogVmVjdG9yLk5VTEwsIHN0YXJ0Q29vcmRzOiBzdGF0aW9uLmJhc2VDb29yZHN9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkRWRnZShsaW5lOiBMaW5lKSB7XG4gICAgICAgIGlmIChsaW5lLndlaWdodCA9PSB1bmRlZmluZWQpIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldElkZW50aWZpZXIobGluZSk7XG4gICAgICAgIHRoaXMuZWRnZXNbaWRdID0gbGluZTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzBdLnN0YXRpb25JZCk7XG4gICAgICAgIHRoaXMuYWRkVmVydGV4KGxpbmUudGVybWluaVsxXS5zdGF0aW9uSWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SWRlbnRpZmllcihsaW5lOiBMaW5lKSB7XG4gICAgICAgIHJldHVybiBVdGlscy5hbHBoYWJldGljSWQobGluZS50ZXJtaW5pWzBdLnN0YXRpb25JZCwgbGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEluc3RhbnQge1xuICAgIHN0YXRpYyBCSUdfQkFORzogSW5zdGFudCA9IG5ldyBJbnN0YW50KDAsIDAsICcnKTtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lcG9jaDogbnVtYmVyLCBwcml2YXRlIF9zZWNvbmQ6IG51bWJlciwgcHJpdmF0ZSBfZmxhZzogc3RyaW5nKSB7XG5cbiAgICB9XG4gICAgZ2V0IGVwb2NoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lcG9jaDtcbiAgICB9XG4gICAgZ2V0IHNlY29uZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2Vjb25kO1xuICAgIH1cbiAgICBnZXQgZmxhZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmxhZztcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbShhcnJheTogc3RyaW5nW10pOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW50KHBhcnNlSW50KGFycmF5WzBdKSwgcGFyc2VJbnQoYXJyYXlbMV0pLCBhcnJheVsyXSA/PyAnJylcbiAgICB9XG5cbiAgICBlcXVhbHModGhhdDogSW5zdGFudCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5lcG9jaCA9PSB0aGF0LmVwb2NoICYmIHRoaXMuc2Vjb25kID09IHRoYXQuc2Vjb25kKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2gpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LnNlY29uZCAtIHRoaXMuc2Vjb25kO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGF0LnNlY29uZDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBMYWJlbEFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCB7XG4gICAgZm9yU3RhdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGZvckxpbmU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBib3VuZGluZ0JveDogQm91bmRpbmdCb3g7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIGNsb25lRm9yU3RhdGlvbihzdGF0aW9uSWQ6IHN0cmluZyk6IExhYmVsQWRhcHRlcjtcbn1cblxuZXhwb3J0IGNsYXNzIExhYmVsIGltcGxlbWVudHMgVGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIExBQkVMX0hFSUdIVCA9IDEyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBMYWJlbEFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBib3VuZGluZ0JveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcbiAgICBjaGlsZHJlbjogTGFiZWxbXSA9IFtdO1xuXG4gICAgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8IHRoaXMuYWRhcHRlci5mb3JMaW5lIHx8ICcnO1xuICAgIH1cbiAgICBcbiAgICBnZXQgZm9yU3RhdGlvbigpOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8ICcnKTtcbiAgICAgICAgaWYgKHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmZvclN0YXRpb247XG4gICAgICAgICAgICBzdGF0aW9uLmFkZExhYmVsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24ubGluZXNFeGlzdGluZygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3Rm9yU3RhdGlvbihkZWxheSwgc3RhdGlvbiwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgdGVybWluaSA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5hZGFwdGVyLmZvckxpbmUpLnRlcm1pbmk7XG4gICAgICAgICAgICB0ZXJtaW5pLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHQuc3RhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBpZiAocyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHMubGFiZWxzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmRyYXcoZGVsYXksIGFuaW1hdGUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xhYmVsRm9yU3RhdGlvbiA9IG5ldyBMYWJlbCh0aGlzLmFkYXB0ZXIuY2xvbmVGb3JTdGF0aW9uKHMuaWQpLCB0aGlzLnN0YXRpb25Qcm92aWRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYWRkTGFiZWwobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xhYmVsRm9yU3RhdGlvbi5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXdMYWJlbEZvclN0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBWZWN0b3IuTlVMTCwgUm90YXRpb24uZnJvbSgnbicpLCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3Rm9yU3RhdGlvbihkZWxheVNlY29uZHM6IG51bWJlciwgc3RhdGlvbjogU3RhdGlvbiwgZm9yTGluZTogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgIGxldCB5T2Zmc2V0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHN0YXRpb24ubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gc3RhdGlvbi5sYWJlbHNbaV07XG4gICAgICAgICAgICBpZiAobCA9PSB0aGlzKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgeU9mZnNldCArPSBMYWJlbC5MQUJFTF9IRUlHSFQqMS41O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxhYmVsRGlyID0gc3RhdGlvbi5sYWJlbERpcjtcblxuICAgICAgICB5T2Zmc2V0ID0gTWF0aC5zaWduKFZlY3Rvci5VTklULnJvdGF0ZShsYWJlbERpcikueSkqeU9mZnNldCAtICh5T2Zmc2V0PjAgPyAyIDogMCk7IC8vVE9ETyBtYWdpYyBudW1iZXJzXG4gICAgICAgIGNvbnN0IHN0YXRpb25EaXIgPSBzdGF0aW9uLnJvdGF0aW9uO1xuICAgICAgICBjb25zdCBkaWZmRGlyID0gbGFiZWxEaXIuYWRkKG5ldyBSb3RhdGlvbigtc3RhdGlvbkRpci5kZWdyZWVzKSk7XG4gICAgICAgIGNvbnN0IHVuaXR2ID0gVmVjdG9yLlVOSVQucm90YXRlKGRpZmZEaXIpO1xuICAgICAgICBjb25zdCBhbmNob3IgPSBuZXcgVmVjdG9yKHN0YXRpb24uc3RhdGlvblNpemVGb3JBeGlzKCd4JywgdW5pdHYueCksIHN0YXRpb24uc3RhdGlvblNpemVGb3JBeGlzKCd5JywgdW5pdHYueSkpO1xuICAgICAgICBjb25zdCB0ZXh0Q29vcmRzID0gYmFzZUNvb3JkLmFkZChhbmNob3Iucm90YXRlKHN0YXRpb25EaXIpKS5hZGQobmV3IFZlY3RvcigwLCB5T2Zmc2V0KSk7XG4gICAgXG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5U2Vjb25kcywgdGV4dENvb3JkcywgbGFiZWxEaXIsIHRoaXMuY2hpbGRyZW4ubWFwKGMgPT4gYy5hZGFwdGVyKSk7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yU3RhdGlvbi5yZW1vdmVMYWJlbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hZGFwdGVyLmZvckxpbmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgYy5lcmFzZShkZWxheSwgYW5pbWF0ZSwgcmV2ZXJzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufSIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFN0YXRpb24sIFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQWRhcHRlciBleHRlbmRzIFRpbWVkICB7XG4gICAgc3RvcHM6IFN0b3BbXTtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94O1xuICAgIHdlaWdodDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSwgbGVuZ3RoOiBudW1iZXIsIGNvbG9yRGV2aWF0aW9uOiBudW1iZXIpOiB2b2lkO1xuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCBjb2xvckZyb206IG51bWJlciwgY29sb3JUbzogbnVtYmVyKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4sIGxlbmd0aDogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIExpbmUgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTk9ERV9ESVNUQU5DRSA9IDA7XG4gICAgc3RhdGljIFNQRUVEID0gMTAwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBMaW5lQWRhcHRlciwgcHJpdmF0ZSBzdGF0aW9uUHJvdmlkZXI6IFN0YXRpb25Qcm92aWRlciwgcHJpdmF0ZSBiZWNrU3R5bGU6IGJvb2xlYW4gPSB0cnVlKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIGJvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuICAgIHdlaWdodCA9IHRoaXMuYWRhcHRlci53ZWlnaHQ7XG4gICAgXG4gICAgcHJpdmF0ZSBwcmVjZWRpbmdTdG9wOiBTdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgcHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIF9wYXRoOiBWZWN0b3JbXSA9IFtdO1xuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9wYXRoO1xuICAgICAgICBcbiAgICAgICAgbGV0IHRyYWNrID0gbmV3IFByZWZlcnJlZFRyYWNrKCcrJyk7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tU3RyaW5nKHN0b3BzW2pdLnRyYWNrSW5mbyk7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5uYW1lICsgJzogU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKHN0b3AuYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKHRoaXMubmFtZSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzdG9wc1tqXS5jb29yZCA9IHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdG9wLCB0aGlzLm5leHRTdG9wQmFzZUNvb3JkKHN0b3BzLCBqLCBzdG9wLmJhc2VDb29yZHMpLCB0cmFjaywgcGF0aCwgZGVsYXksIGFuaW1hdGUsIHRydWUpO1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5rZWVwT25seVNpZ24oKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZHVyYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGgsIGFuaW1hdGUpO1xuICAgICAgICBjb25zdCBsaW5lR3JvdXAgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSk7XG4gICAgICAgIGxpbmVHcm91cC5hZGRMaW5lKHRoaXMpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgZHVyYXRpb24sIHBhdGgsIHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCksIGxpbmVHcm91cC5zdHJva2VDb2xvcik7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSwgY29sb3JEZXZpYXRpb246IG51bWJlcikge1xuICAgICAgICBsZXQgb2xkUGF0aCA9IHRoaXMuX3BhdGg7XG4gICAgICAgIGlmIChvbGRQYXRoLmxlbmd0aCA8IDIgfHwgcGF0aC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RyeWluZyB0byBtb3ZlIGEgbm9uIGV4aXN0aW5nIGxpbmUnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkUGF0aC5sZW5ndGggIT0gcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIG9sZFBhdGggPSBbb2xkUGF0aFswXSwgb2xkUGF0aFtvbGRQYXRoLmxlbmd0aC0xXV07XG4gICAgICAgICAgICBwYXRoID0gW3BhdGhbMF0sIHBhdGhbcGF0aC5sZW5ndGgtMV1dO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpbmVHcm91cCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5fcGF0aCwgcGF0aCwgbGluZUdyb3VwLnN0cm9rZUNvbG9yLCBjb2xvckRldmlhdGlvbik7XG4gICAgICAgIGxpbmVHcm91cC5zdHJva2VDb2xvciA9IGNvbG9yRGV2aWF0aW9uO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLl9wYXRoLCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSwgZHVyYXRpb24sIHJldmVyc2UsIHRoaXMuZ2V0VG90YWxMZW5ndGgodGhpcy5fcGF0aCkpO1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPHN0b3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5uYW1lICsgJzogU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgc3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgc3RvcC5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wSWQgPSAnaF8nICsgVXRpbHMuYWxwaGFiZXRpY0lkKHN0b3BzW2otMV0uc3RhdGlvbklkLCBzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIGxldCBoZWxwU3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGhlbHBTdG9wSWQpO1xuICAgICAgICAgICAgICAgIGlmIChoZWxwU3RvcCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVscFN0b3AucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgbmV4dFN0b3BCYXNlQ29vcmQoc3RvcHM6IFN0b3BbXSwgY3VycmVudFN0b3BJbmRleDogbnVtYmVyLCBkZWZhdWx0Q29vcmRzOiBWZWN0b3IpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRTdG9wSW5kZXgrMSA8IHN0b3BzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBzdG9wc1tjdXJyZW50U3RvcEluZGV4KzFdLnN0YXRpb25JZDtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChpZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMubmFtZSArICc6IFN0YXRpb24gd2l0aCBJRCAnICsgaWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3AuYmFzZUNvb3JkczsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdENvb3JkcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgdHJhY2s6IFByZWZlcnJlZFRyYWNrLCBwYXRoOiBWZWN0b3JbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmVjdXJzZTogYm9vbGVhbik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgY29uc3QgbmV3RGlyID0gdGhpcy5nZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgZGlyLCBwYXRoKTtcbiAgICAgICAgY29uc3QgbmV3UG9zID0gc3RhdGlvbi5hc3NpZ25UcmFjayhuZXdEaXIuaXNWZXJ0aWNhbCgpID8gJ3gnIDogJ3knLCB0cmFjaywgdGhpcyk7XG5cbiAgICAgICAgY29uc3QgbmV3Q29vcmQgPSBzdGF0aW9uLnJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKG5ld0RpciwgbmV3UG9zKTtcbiAgICBcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gdGhpcy5nZXRQcmVjZWRpbmdEaXIodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgb2xkQ29vcmQsIG5ld0Nvb3JkKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb25EaXIgPSBuZXdEaXIuYWRkKGRpcik7XG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IHRoaXMuaW5zZXJ0Tm9kZShvbGRDb29yZCwgdGhpcy5wcmVjZWRpbmdEaXIsIG5ld0Nvb3JkLCBzdGF0aW9uRGlyLCBwYXRoKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZm91bmQgJiYgcmVjdXJzZSAmJiB0aGlzLnByZWNlZGluZ1N0b3AgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3AgPSB0aGlzLmdldE9yQ3JlYXRlSGVscGVyU3RvcCh0aGlzLnByZWNlZGluZ0RpciwgdGhpcy5wcmVjZWRpbmdTdG9wLCBzdGF0aW9uKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMucHJlY2VkaW5nRGlyLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVDb25uZWN0aW9uKGhlbHBTdG9wLCBiYXNlQ29vcmQsIHRyYWNrLmtlZXBPbmx5U2lnbigpLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIHRyYWNrLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3BhdGggdG8gZml4IG9uIGxpbmUnLCB0aGlzLmFkYXB0ZXIubmFtZSwgJ2F0IHN0YXRpb24nLCBzdGF0aW9uLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gc3RhdGlvbkRpcjtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aW9uLmFkZExpbmUodGhpcywgbmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgbmV3UG9zKTtcbiAgICAgICAgcGF0aC5wdXNoKG5ld0Nvb3JkKTtcblxuICAgICAgICBkZWxheSA9IHRoaXMuZ2V0QW5pbWF0aW9uRHVyYXRpb24ocGF0aCwgYW5pbWF0ZSkgKyBkZWxheTtcbiAgICAgICAgc3RhdGlvbi5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5wcmVjZWRpbmdTdG9wID0gc3RhdGlvbjtcbiAgICAgICAgcmV0dXJuIG5ld0Nvb3JkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgZGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0b3BCYXNlQ29vcmQuZGVsdGEob2xkQ29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKG5leHRTdG9wQmFzZUNvb3JkKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdBeGlzID0gc3RhdGlvbi5heGlzQW5kVHJhY2tGb3JFeGlzdGluZ0xpbmUodGhpcy5uYW1lKT8uYXhpcztcbiAgICAgICAgaWYgKGV4aXN0aW5nQXhpcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbiA9IGRlbHRhLmluY2xpbmF0aW9uKCkuaGFsZkRpcmVjdGlvbihkaXIsIGV4aXN0aW5nQXhpcyA9PSAneCcgPyBuZXcgUm90YXRpb24oOTApIDogbmV3IFJvdGF0aW9uKDApKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbi5hZGQoZGlyKS5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsdGEuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgfVxuICAgIFxuXG4gICAgcHJpdmF0ZSBnZXRQcmVjZWRpbmdEaXIocHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCwgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCwgb2xkQ29vcmQ6IFZlY3RvciwgbmV3Q29vcmQ6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWNlZGluZ1N0b3BSb3RhdGlvbiA9IHByZWNlZGluZ1N0b3A/LnJvdGF0aW9uID8/IG5ldyBSb3RhdGlvbigwKTtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24ocHJlY2VkaW5nU3RvcFJvdGF0aW9uKS5hZGQocHJlY2VkaW5nU3RvcFJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IHByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVjZWRpbmdEaXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbnNlcnROb2RlKGZyb21Db29yZDogVmVjdG9yLCBmcm9tRGlyOiBSb3RhdGlvbiwgdG9Db29yZDogVmVjdG9yLCB0b0RpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5iZWNrU3R5bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSBmcm9tQ29vcmQuZGVsdGEodG9Db29yZCk7XG4gICAgICAgIGNvbnN0IG9sZERpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZnJvbURpcik7XG4gICAgICAgIGNvbnN0IG5ld0RpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUodG9EaXIpO1xuICAgICAgICBpZiAoZGVsdGEuaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwob2xkRGlyViwgbmV3RGlyVikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZGVsdGEuc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihvbGREaXJWLCBuZXdEaXJWKVxuICAgICAgICBpZiAoc29sdXRpb24uYSA+IExpbmUuTk9ERV9ESVNUQU5DRSAmJiBzb2x1dGlvbi5iID4gTGluZS5OT0RFX0RJU1RBTkNFKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gobmV3IFZlY3Rvcihmcm9tQ29vcmQueCtvbGREaXJWLngqc29sdXRpb24uYSwgZnJvbUNvb3JkLnkrb2xkRGlyVi55KnNvbHV0aW9uLmEpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlSGVscGVyU3RvcChmcm9tRGlyOiBSb3RhdGlvbiwgZnJvbVN0b3A6IFN0YXRpb24sIHRvU3RvcDogU3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChmcm9tU3RvcC5pZCwgdG9TdG9wLmlkKTtcbiAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgIGlmIChoZWxwU3RvcCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZycsIGhlbHBTdG9wSWQpO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBmcm9tU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgbmV3Q29vcmQgPSB0b1N0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3Q29vcmQuZGVsdGEob2xkQ29vcmQpO1xuICAgICAgICAgICAgY29uc3QgZGVnID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVEaXIgPSBuZXcgUm90YXRpb24oKGRlZy5kZWx0YShmcm9tRGlyKS5kZWdyZWVzID49IDAgPyBNYXRoLmZsb29yKGRlZy5kZWdyZWVzIC8gNDUpIDogTWF0aC5jZWlsKGRlZy5kZWdyZWVzIC8gNDUpKSAqIDQ1KS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZUNvb3JkID0gZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgvMikuYWRkKG5ld0Nvb3JkKTtcblxuICAgICAgICAgICAgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5jcmVhdGVWaXJ0dWFsU3RvcChoZWxwU3RvcElkLCBpbnRlcm1lZGlhdGVDb29yZCwgaW50ZXJtZWRpYXRlRGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGVscFN0b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBbmltYXRpb25EdXJhdGlvbihwYXRoOiBWZWN0b3JbXSwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSAvIExpbmUuU1BFRUQ7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0VG90YWxMZW5ndGgocGF0aDogVmVjdG9yW10pOiBudW1iZXIge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhdGgubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgbGVuZ3RoICs9IHBhdGhbaV0uZGVsdGEocGF0aFtpKzFdKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXQgdGVybWluaSgpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA9PSAwKSBcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIFtzdG9wc1swXSwgc3RvcHNbc3RvcHMubGVuZ3RoLTFdXTtcbiAgICB9XG5cbiAgICBnZXQgcGF0aCgpOiBWZWN0b3JbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuICAgIH1cblxuICAgIGdldFN0b3Aoc3RhdGlvbklkOiBzdHJpbmcpOiBTdG9wIHwgbnVsbCB7XG4gICAgICAgIGZvciAoY29uc3Qgc3RvcCBvZiBPYmplY3QudmFsdWVzKHRoaXMuYWRhcHRlci5zdG9wcykpIHtcbiAgICAgICAgICAgIGlmIChzdG9wLnN0YXRpb25JZCA9PSBzdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59IiwiaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcblxuZXhwb3J0IGNsYXNzIExpbmVHcm91cCB7XG4gICAgcHJpdmF0ZSBfbGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgX3Rlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgIHN0cm9rZUNvbG9yID0gMDtcbiAgICBcbiAgICBhZGRMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLl9saW5lcy5pbmNsdWRlcyhsaW5lKSlcbiAgICAgICAgICAgIHRoaXMuX2xpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5fbGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGluZXNbaV0gPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFN0b3BbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJtaW5pO1xuICAgIH1cblxuICAgIGdldFBhdGhCZXR3ZWVuKHN0YXRpb25JZEZyb206IHN0cmluZywgc3RhdGlvbklkVG86IHN0cmluZyk6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSB8IG51bGwge1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5nZXRMaW5lc1dpdGhTdG9wKHN0YXRpb25JZEZyb20pO1xuICAgICAgICBjb25zdCB0byA9IHRoaXMuZ2V0TGluZXNXaXRoU3RvcChzdGF0aW9uSWRUbyk7XG5cbiAgICAgICAgaWYgKGZyb20ubGVuZ3RoID09IDAgfHwgdG8ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIE9iamVjdC52YWx1ZXMoZnJvbSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiBPYmplY3QudmFsdWVzKHRvKSkge1xuICAgICAgICAgICAgICAgIGlmIChhLmxpbmUgPT0gYi5saW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhdGhCZXR3ZWVuU3RvcHMoYS5saW5lLCBhLnN0b3AsIGIuc3RvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBPYmplY3QudmFsdWVzKGZyb20pKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgT2JqZWN0LnZhbHVlcyh0bykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tb24gPSB0aGlzLmZpbmRDb21tb25TdG9wKGEubGluZSwgYi5saW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoY29tbW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyc3RQYXJ0ID0gdGhpcy5nZXRQYXRoQmV0d2VlblN0b3BzKGEubGluZSwgYS5zdG9wLCBjb21tb24pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRQYXJ0ID0gdGhpcy5nZXRQYXRoQmV0d2VlblN0b3BzKGIubGluZSwgY29tbW9uLCBiLnN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFBhcnRTbGljZSA9IGZpcnN0UGFydC5wYXRoLnNsaWNlKDAsIGZpcnN0UGFydC50bysxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Vjb25kUGFydFNsaWNlID0gc2Vjb25kUGFydC5wYXRoLnNsaWNlKHNlY29uZFBhcnQuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHBhdGg6IGZpcnN0UGFydFNsaWNlLmNvbmNhdChzZWNvbmRQYXJ0U2xpY2UpLCBmcm9tOiBmaXJzdFBhcnQuZnJvbSwgdG86IGZpcnN0UGFydFNsaWNlLmxlbmd0aCArIHNlY29uZFBhcnQudG99O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wbGV4IFRyYWluIHJvdXRpbmcgZm9yIExpbmVzIG9mIExpbmVHcm91cHMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldExpbmVzV2l0aFN0b3Aoc3RhdGlvbklkOiBzdHJpbmcpOiB7bGluZTogTGluZSwgc3RvcDogU3RvcH1bXSB7XG4gICAgICAgIGNvbnN0IGFycjoge2xpbmU6IExpbmUsIHN0b3A6IFN0b3B9W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIE9iamVjdC52YWx1ZXModGhpcy5fbGluZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gbGluZS5nZXRTdG9wKHN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goe2xpbmU6IGxpbmUsIHN0b3A6IHN0b3B9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UGF0aEJldHdlZW5TdG9wcyhsaW5lOiBMaW5lLCBmcm9tOiBTdG9wLCB0bzogU3RvcCk6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBsaW5lLnBhdGg7XG4gICAgICAgIGxldCBmcm9tSWR4ID0gdGhpcy5pbmRleE9mKHBhdGgsIGZyb20uY29vcmQgfHwgVmVjdG9yLk5VTEwpO1xuICAgICAgICBsZXQgdG9JZHggPSB0aGlzLmluZGV4T2YocGF0aCwgdG8uY29vcmQgfHwgVmVjdG9yLk5VTEwpO1xuICAgICAgICBpZiAoZnJvbUlkeCA9PSAtMSB8fCB0b0lkeCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RvcCB0aGF0IHNob3VsZCBiZSBwcmVzZW50IGlzIG5vdCBwcmVzZW50IG9uIGxpbmUgXCIgKyBsaW5lLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc3Qgc2xpY2UgPSBwYXRoLnNsaWNlKE1hdGgubWluKGZyb21JZHgsIHRvSWR4KSwgTWF0aC5tYXgoZnJvbUlkeCwgdG9JZHgpKzEpO1xuICAgICAgICBjb25zdCBzbGljZSA9IHBhdGguc2xpY2UoKTtcbiAgICAgICAgaWYgKGZyb21JZHggPiB0b0lkeCkge1xuICAgICAgICAgICAgc2xpY2UucmV2ZXJzZSgpO1xuICAgICAgICAgICAgZnJvbUlkeCA9IHNsaWNlLmxlbmd0aCAtIDEgLSBmcm9tSWR4O1xuICAgICAgICAgICAgdG9JZHggPSBzbGljZS5sZW5ndGggLSAxIC0gdG9JZHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgcGF0aDogc2xpY2UsIGZyb206IGZyb21JZHgsIHRvOiB0b0lkeCB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5kZXhPZihhcnJheTogVmVjdG9yW10sIGVsZW1lbnQ6IFZlY3Rvcikge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXS5lcXVhbHMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kQ29tbW9uU3RvcChsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBTdG9wIHwgbnVsbCB7XG4gICAgICAgIGZvciAoY29uc3QgdGVybWludXMxIG9mIE9iamVjdC52YWx1ZXMobGluZTEudGVybWluaSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGVybWludXMyIG9mIE9iamVjdC52YWx1ZXMobGluZTIudGVybWluaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGVybWludXMxLnN0YXRpb25JZCA9PSB0ZXJtaW51czIuc3RhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXJtaW51czE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVGVybWluaSgpIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaChsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVUZXJtaW5pID0gbC50ZXJtaW5pO1xuICAgICAgICAgICAgbGluZVRlcm1pbmkuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXQudHJhY2tJbmZvLmluY2x1ZGVzKCcqJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0rKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGVybWluaTogU3RvcFtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgW3N0YXRpb25JZCwgb2NjdXJlbmNlc10gb2YgT2JqZWN0LmVudHJpZXMoY2FuZGlkYXRlcykpIHtcbiAgICAgICAgICAgIGlmIChvY2N1cmVuY2VzID09IDEpIHtcbiAgICAgICAgICAgICAgICB0ZXJtaW5pLnB1c2gobmV3IFN0b3Aoc3RhdGlvbklkLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Rlcm1pbmkgPSB0ZXJtaW5pO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgWm9vbWVyIH0gZnJvbSBcIi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBMaW5lR3JvdXAgfSBmcm9tIFwiLi9MaW5lR3JvdXBcIjtcbmltcG9ydCB7IEdyYXZpdGF0b3IgfSBmcm9tIFwiLi9HcmF2aXRhdG9yXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpb25Qcm92aWRlciB7XG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQ7XG4gICAgbGluZUdyb3VwQnlJZChpZDogc3RyaW5nKTogTGluZUdyb3VwO1xuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0FkYXB0ZXIge1xuICAgIGNhbnZhc1NpemU6IEJvdW5kaW5nQm94O1xuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQ7XG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uO1xuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZDtcbiAgICB6b29tVG8oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTmV0d29yayBpbXBsZW1lbnRzIFN0YXRpb25Qcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzbGlkZUluZGV4OiB7W2lkOiBzdHJpbmddIDoge1tpZDogc3RyaW5nXTogVGltZWREcmF3YWJsZVtdfX0gPSB7fTtcbiAgICBwcml2YXRlIHN0YXRpb25zOiB7IFtpZDogc3RyaW5nXSA6IFN0YXRpb24gfSA9IHt9O1xuICAgIHByaXZhdGUgbGluZUdyb3VwczogeyBbaWQ6IHN0cmluZ10gOiBMaW5lR3JvdXAgfSA9IHt9O1xuICAgIHByaXZhdGUgZXJhc2VCdWZmZXI6IFRpbWVkRHJhd2FibGVbXSA9IFtdO1xuICAgIHByaXZhdGUgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcjtcbiAgICBwcml2YXRlIHpvb21lcjogWm9vbWVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBOZXR3b3JrQWRhcHRlcikge1xuICAgICAgICB0aGlzLmdyYXZpdGF0b3IgPSBuZXcgR3Jhdml0YXRvcih0aGlzKTtcbiAgICAgICAgdGhpcy56b29tZXIgPSBuZXcgWm9vbWVyKHRoaXMuYWRhcHRlci5jYW52YXNTaXplKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpb25zW2lkXTtcbiAgICB9XG5cbiAgICBsaW5lR3JvdXBCeUlkKGlkOiBzdHJpbmcpOiBMaW5lR3JvdXAge1xuICAgICAgICBpZiAodGhpcy5saW5lR3JvdXBzW2lkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGluZUdyb3Vwc1tpZF0gPSBuZXcgTGluZUdyb3VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubGluZUdyb3Vwc1tpZF07XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuYWRhcHRlci5jcmVhdGVWaXJ0dWFsU3RvcChpZCwgYmFzZUNvb3Jkcywgcm90YXRpb24pO1xuICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0b3A7XG4gICAgICAgIHJldHVybiBzdG9wO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGlzcGxheUluc3RhbnQoaW5zdGFudDogSW5zdGFudCkge1xuICAgICAgICBpZiAoIWluc3RhbnQuZXF1YWxzKEluc3RhbnQuQklHX0JBTkcpKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhd0Vwb2NoKGluc3RhbnQuZXBvY2ggKyAnJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGltZWREcmF3YWJsZXNBdChub3c6IEluc3RhbnQpOiBUaW1lZERyYXdhYmxlW10ge1xuICAgICAgICBpZiAoIXRoaXMuaXNFcG9jaEV4aXN0aW5nKG5vdy5lcG9jaCArICcnKSlcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdW25vdy5zZWNvbmRdO1xuICAgIH1cblxuICAgIGRyYXdUaW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuZGlzcGxheUluc3RhbnQobm93KTtcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IHRoaXMudGltZWREcmF3YWJsZXNBdChub3cpO1xuICAgICAgICBsZXQgZGVsYXkgPSBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMuZHJhd09yRXJhc2VFbGVtZW50KGVsZW1lbnRzW2ldLCBkZWxheSwgYW5pbWF0ZSwgbm93KTtcbiAgICAgICAgfVxuICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hFcmFzZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIGRlbGF5ID0gdGhpcy5ncmF2aXRhdG9yLmdyYXZpdGF0ZShkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIHRoaXMuYWRhcHRlci56b29tVG8odGhpcy56b29tZXIuY2VudGVyLCB0aGlzLnpvb21lci5zY2FsZSwgdGhpcy56b29tZXIuZHVyYXRpb24pO1xuICAgICAgICB0aGlzLnpvb21lci5yZXNldCgpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmbHVzaEVyYXNlQnVmZmVyKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBmb3IgKGxldCBpPXRoaXMuZXJhc2VCdWZmZXIubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZXJhc2VCdWZmZXJbaV07XG4gICAgICAgICAgICBjb25zdCBzaG91bGRBbmltYXRlID0gdGhpcy5zaG91bGRBbmltYXRlKGVsZW1lbnQudG8sIGFuaW1hdGUpO1xuICAgICAgICAgICAgZGVsYXkgKz0gdGhpcy5lcmFzZUVsZW1lbnQoZWxlbWVudCwgZGVsYXksIHNob3VsZEFuaW1hdGUpO1xuICAgICAgICAgICAgdGhpcy56b29tZXIuaW5jbHVkZShlbGVtZW50LmJvdW5kaW5nQm94LCBlbGVtZW50LmZyb20sIGVsZW1lbnQudG8sIGZhbHNlLCBhbmltYXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVyYXNlQnVmZmVyID0gW107XG4gICAgICAgIHJldHVybiBkZWxheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdPckVyYXNlRWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBpbnN0YW50OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKGluc3RhbnQuZXF1YWxzKGVsZW1lbnQudG8pICYmICFlbGVtZW50LmZyb20uZXF1YWxzKGVsZW1lbnQudG8pKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lcmFzZUJ1ZmZlci5sZW5ndGggPiAwICYmIHRoaXMuZXJhc2VCdWZmZXJbdGhpcy5lcmFzZUJ1ZmZlci5sZW5ndGgtMV0ubmFtZSAhPSBlbGVtZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hFcmFzZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVyYXNlQnVmZmVyLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRXJhc2VCdWZmZXIoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICBjb25zdCBzaG91bGRBbmltYXRlID0gdGhpcy5zaG91bGRBbmltYXRlKGVsZW1lbnQuZnJvbSwgYW5pbWF0ZSk7XG4gICAgICAgIGRlbGF5ICs9IHRoaXMuZHJhd0VsZW1lbnQoZWxlbWVudCwgZGVsYXksIHNob3VsZEFuaW1hdGUpO1xuICAgICAgICB0aGlzLnpvb21lci5pbmNsdWRlKGVsZW1lbnQuYm91bmRpbmdCb3gsIGVsZW1lbnQuZnJvbSwgZWxlbWVudC50bywgdHJ1ZSwgYW5pbWF0ZSk7XG4gICAgICAgIHJldHVybiBkZWxheTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBkcmF3RWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBMaW5lKSB7XG4gICAgICAgICAgICB0aGlzLmdyYXZpdGF0b3IuYWRkRWRnZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudC5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBlcmFzZUVsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmVyYXNlKGRlbGF5LCBhbmltYXRlLCBlbGVtZW50LnRvLmZsYWcuaW5jbHVkZXMoJ3JldmVyc2UnKSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgc2hvdWxkQW5pbWF0ZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGluc3RhbnQuZmxhZy5pbmNsdWRlcygnbm9hbmltJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBhbmltYXRlO1xuICAgIH1cblxuICAgIGlzRXBvY2hFeGlzdGluZyhlcG9jaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdICE9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhZGRUb0luZGV4KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LmZyb20sIGVsZW1lbnQpO1xuICAgICAgICBpZiAoIUluc3RhbnQuQklHX0JBTkcuZXF1YWxzKGVsZW1lbnQudG8pKVxuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LnRvLCBlbGVtZW50KTtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBTdGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRpb25zW2VsZW1lbnQuaWRdID0gZWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U2xpZGVJbmRleEVsZW1lbnQoaW5zdGFudDogSW5zdGFudCwgZWxlbWVudDogVGltZWREcmF3YWJsZSk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9IHt9O1xuICAgICAgICBpZiAodGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdID0gW107XG4gICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0ucHVzaChlbGVtZW50KTtcbiAgICB9XG5cbiAgICBuZXh0SW5zdGFudChub3c6IEluc3RhbnQpOiBJbnN0YW50IHwgbnVsbCB7XG4gICAgICAgIGxldCBlcG9jaDogbnVtYmVyIHwgbnVsbCA9IG5vdy5lcG9jaDtcbiAgICAgICAgbGV0IHNlY29uZDogbnVtYmVyIHwgbnVsbCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LnNlY29uZCwgdGhpcy5zbGlkZUluZGV4W25vdy5lcG9jaF0pO1xuICAgICAgICBpZiAoc2Vjb25kID09IG51bGwpIHtcbiAgICAgICAgICAgIGVwb2NoID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZShub3cuZXBvY2gsIHRoaXMuc2xpZGVJbmRleCk7XG4gICAgICAgICAgICBpZiAoZXBvY2ggPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgc2Vjb25kID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZSgtMSwgdGhpcy5zbGlkZUluZGV4W2Vwb2NoXSk7XG4gICAgICAgICAgICBpZiAoc2Vjb25kID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQoZXBvY2gsIHNlY29uZCwgJycpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZpbmRTbWFsbGVzdEFib3ZlKHRocmVzaG9sZDogbnVtYmVyLCBkaWN0OiB7W2lkOiBudW1iZXJdOiBhbnl9KTogbnVtYmVyIHwgbnVsbCB7XG4gICAgICAgIGlmIChkaWN0ID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBsZXQgc21hbGxlc3QgPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkaWN0KSkge1xuICAgICAgICAgICAgaWYgKHBhcnNlSW50KGtleSkgPiB0aHJlc2hvbGQgJiYgKHNtYWxsZXN0ID09IG51bGwgfHwgcGFyc2VJbnQoa2V5KSA8IHNtYWxsZXN0KSkge1xuICAgICAgICAgICAgICAgIHNtYWxsZXN0ID0gcGFyc2VJbnQoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc21hbGxlc3Q7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTGluZUF0U3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFByZWZlcnJlZFRyYWNrIHtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgXG4gICAgZnJvbVN0cmluZyh2YWx1ZTogc3RyaW5nKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBpZiAodmFsdWUgIT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJlZmVycmVkVHJhY2sodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZyb21OdW1iZXIodmFsdWU6IG51bWJlcik6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gdmFsdWUgPj0gMCA/ICcrJyA6ICcnO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHByZWZpeCArIHZhbHVlKTtcbiAgICB9XG5cbiAgICBmcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKGF0U3RhdGlvbjogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXRTdGF0aW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5oYXNUcmFja051bWJlcigpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21OdW1iZXIoYXRTdGF0aW9uLnRyYWNrKTsgICAgICAgIFxuICAgIH1cblxuICAgIGtlZXBPbmx5U2lnbigpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLnZhbHVlWzBdO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHYgPT0gJy0nID8gdiA6ICcrJyk7XG4gICAgfVxuXG4gICAgaGFzVHJhY2tOdW1iZXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmxlbmd0aCA+IDE7XG4gICAgfVxuXG4gICAgZ2V0IHRyYWNrTnVtYmVyKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLnZhbHVlLnJlcGxhY2UoJyonLCAnJykpXG4gICAgfVxuXG4gICAgaXNQb3NpdGl2ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbMF0gIT0gJy0nO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRpb24ge1xuICAgIHByaXZhdGUgc3RhdGljIERJUlM6IHsgW2lkOiBzdHJpbmddOiBudW1iZXIgfSA9IHsnc3cnOiAtMTM1LCAndyc6IC05MCwgJ253JzogLTQ1LCAnbic6IDAsICduZSc6IDQ1LCAnZSc6IDkwLCAnc2UnOiAxMzUsICdzJzogMTgwfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RlZ3JlZXM6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20oZGlyZWN0aW9uOiBzdHJpbmcpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oUm90YXRpb24uRElSU1tkaXJlY3Rpb25dKVxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKFJvdGF0aW9uLkRJUlMpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZhbHVlLCB0aGlzLmRlZ3JlZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ24nO1xuICAgIH1cblxuICAgIGdldCBkZWdyZWVzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWdyZWVzO1xuICAgIH1cblxuICAgIGdldCByYWRpYW5zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlZ3JlZXMgLyAxODAgKiBNYXRoLlBJO1xuICAgIH1cblxuICAgIGFkZCh0aGF0OiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMuZGVncmVlcyArIHRoYXQuZGVncmVlcztcbiAgICAgICAgaWYgKHN1bSA8PSAtMTgwKVxuICAgICAgICAgICAgc3VtICs9IDM2MDtcbiAgICAgICAgaWYgKHN1bSA+IDE4MClcbiAgICAgICAgICAgIHN1bSAtPSAzNjA7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oc3VtKTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IGEgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGxldCBiID0gdGhhdC5kZWdyZWVzO1xuICAgICAgICBsZXQgZGlzdCA9IGItYTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3QpID4gMTgwKSB7XG4gICAgICAgICAgICBpZiAoYSA8IDApXG4gICAgICAgICAgICAgICAgYSArPSAzNjA7XG4gICAgICAgICAgICBpZiAoYiA8IDApXG4gICAgICAgICAgICAgICAgYiArPSAzNjA7XG4gICAgICAgICAgICBkaXN0ID0gYi1hO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGlzdCk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IGRpciA9IHRoaXMuZGVncmVlcztcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhkaXIsIC05MCkpXG4gICAgICAgICAgICBkaXIgPSAwO1xuICAgICAgICBlbHNlIGlmIChkaXIgPCAtOTApXG4gICAgICAgICAgICBkaXIgKz0gMTgwO1xuICAgICAgICBlbHNlIGlmIChkaXIgPiA5MClcbiAgICAgICAgICAgIGRpciAtPSAxODA7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGlyKTtcbiAgICB9XG5cbiAgICBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzICUgMTgwID09IDA7XG4gICAgfVxuXG4gICAgcXVhcnRlckRpcmVjdGlvbihyZWxhdGl2ZVRvOiBSb3RhdGlvbikge1xuICAgICAgICBjb25zdCBkZWx0YURpciA9IHJlbGF0aXZlVG8uZGVsdGEodGhpcykuZGVncmVlcztcbiAgICAgICAgY29uc3QgZGVnID0gZGVsdGFEaXIgPCAwID8gTWF0aC5jZWlsKChkZWx0YURpci00NSkvOTApIDogTWF0aC5mbG9vcigoZGVsdGFEaXIrNDUpLzkwKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihkZWcqOTApO1xuICAgIH1cblxuICAgIGhhbGZEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24sIHNwbGl0QXhpczogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGxldCBkZWc7XG4gICAgICAgIGlmIChzcGxpdEF4aXMuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICAgICAgICBpZiAoZGVsdGFEaXIgPCAwICYmIGRlbHRhRGlyID49IC0xODApXG4gICAgICAgICAgICAgICAgZGVnID0gLTkwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDkwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgOTAgJiYgZGVsdGFEaXIgPj0gLTkwKVxuICAgICAgICAgICAgICAgIGRlZyA9IDA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVnID0gMTgwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuaW1wb3J0IHsgUHJlZmVycmVkVHJhY2sgfSBmcm9tIFwiLi9QcmVmZXJyZWRUcmFja1wiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi9MYWJlbFwiO1xuaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpb25BZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIGJhc2VDb29yZHM6IFZlY3RvcjtcbiAgICByb3RhdGlvbjogUm90YXRpb247XG4gICAgbGFiZWxEaXI6IFJvdGF0aW9uO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzOiAoKSA9PiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSk6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmcm9tOiBWZWN0b3IsIHRvOiBWZWN0b3IsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFN0b3Age1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0aW9uSWQ6IHN0cmluZywgcHVibGljIHRyYWNrSW5mbzogc3RyaW5nKSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgY29vcmQ6IFZlY3RvciB8IG51bGwgPSBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpbmVBdFN0YXRpb24ge1xuICAgIGxpbmU/OiBMaW5lO1xuICAgIGF4aXM6IHN0cmluZztcbiAgICB0cmFjazogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdGlvbiBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBMSU5FX0RJU1RBTkNFID0gNjtcbiAgICBzdGF0aWMgREVGQVVMVF9TVE9QX0RJTUVOID0gMTA7XG4gICAgc3RhdGljIExBQkVMX0RJU1RBTkNFID0gMDtcblxuICAgIHByaXZhdGUgZXhpc3RpbmdMaW5lczoge1tpZDogc3RyaW5nXTogTGluZUF0U3RhdGlvbltdfSA9IHt4OiBbXSwgeTogW119O1xuICAgIHByaXZhdGUgZXhpc3RpbmdMYWJlbHM6IExhYmVsW10gPSBbXTtcbiAgICBwcml2YXRlIHBoYW50b20/OiBMaW5lQXRTdGF0aW9uID0gdW5kZWZpbmVkO1xuICAgIHJvdGF0aW9uID0gdGhpcy5hZGFwdGVyLnJvdGF0aW9uO1xuICAgIGxhYmVsRGlyID0gdGhpcy5hZGFwdGVyLmxhYmVsRGlyO1xuICAgIGlkID0gdGhpcy5hZGFwdGVyLmlkO1xuICAgIG5hbWUgPSB0aGlzLmFkYXB0ZXIuaWQ7XG4gICAgZnJvbSA9IHRoaXMuYWRhcHRlci5mcm9tO1xuICAgIHRvID0gdGhpcy5hZGFwdGVyLnRvO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBTdGF0aW9uQWRhcHRlcikge1xuXG4gICAgfVxuXG4gICAgZ2V0IGJhc2VDb29yZHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuYmFzZUNvb3JkcztcbiAgICB9XG5cbiAgICBzZXQgYmFzZUNvb3JkcyhiYXNlQ29vcmRzOiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmJhc2VDb29yZHMgPSBiYXNlQ29vcmRzO1xuICAgIH1cblxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzLCB0aGlzLmFkYXB0ZXIuYmFzZUNvb3Jkcyk7XG4gICAgfVxuXG5cbiAgICBhZGRMaW5lKGxpbmU6IExpbmUsIGF4aXM6IHN0cmluZywgdHJhY2s6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBoYW50b20gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMaW5lc1theGlzXS5wdXNoKHtsaW5lOiBsaW5lLCBheGlzOiBheGlzLCB0cmFjazogdHJhY2t9KTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy54KTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy55KTtcbiAgICB9XG5cbiAgICBhZGRMYWJlbChsYWJlbDogTGFiZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmV4aXN0aW5nTGFiZWxzLmluY2x1ZGVzKGxhYmVsKSlcbiAgICAgICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmV4aXN0aW5nTGFiZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMYWJlbHNbaV0gPT0gbGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxhYmVscygpOiBMYWJlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhpc3RpbmdMYWJlbHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVMaW5lQXRBeGlzKGxpbmU6IExpbmUsIGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiB2b2lkIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLmxpbmUgPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGhhbnRvbSA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nTGluZXNGb3JBeGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKGxpbmVOYW1lOiBzdHJpbmcpOiBMaW5lQXRTdGF0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIGlmICh4ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgICAgIGlmICh5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZTogc3RyaW5nLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lPy5uYW1lID09IGxpbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXNzaWduVHJhY2soYXhpczogc3RyaW5nLCBwcmVmZXJyZWRUcmFjazogUHJlZmVycmVkVHJhY2ssIGxpbmU6IExpbmUpOiBudW1iZXIgeyBcbiAgICAgICAgaWYgKHByZWZlcnJlZFRyYWNrLmhhc1RyYWNrTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay50cmFja051bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5waGFudG9tPy5saW5lPy5uYW1lID09IGxpbmUubmFtZSAmJiB0aGlzLnBoYW50b20/LmF4aXMgPT0gYXhpcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGhhbnRvbT8udHJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzKClbYXhpc107XG4gICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay5pc1Bvc2l0aXZlKCkgPyBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzFdICsgMSA6IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXNbMF0gLSAxO1xuICAgIH1cblxuICAgIHJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKGluY29taW5nRGlyOiBSb3RhdGlvbiwgYXNzaWduZWRUcmFjazogbnVtYmVyKTogVmVjdG9yIHsgXG4gICAgICAgIGxldCBuZXdDb29yZDogVmVjdG9yO1xuICAgICAgICBpZiAoaW5jb21pbmdEaXIuZGVncmVlcyAlIDE4MCA9PSAwKSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoMCwgYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Q29vcmQgPSBuZXdDb29yZC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgICAgIG5ld0Nvb3JkID0gdGhpcy5iYXNlQ29vcmRzLmFkZChuZXdDb29yZCk7XG4gICAgICAgIHJldHVybiBuZXdDb29yZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllcygpOiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzLngpLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy55KVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMoZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbMSwgLTFdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgbGV0IHJpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0gZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVmdCA+IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbGVmdCwgcmlnaHRdO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaWFtdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcztcbiAgICAgICAgdGhpcy5leGlzdGluZ0xhYmVscy5mb3JFYWNoKGwgPT4gbC5kcmF3KGRlbGF5U2Vjb25kcywgZmFsc2UpKTtcbiAgICAgICAgY29uc3QgdCA9IHN0YXRpb24ucG9zaXRpb25Cb3VuZGFyaWVzKCk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5U2Vjb25kcywgZnVuY3Rpb24oKSB7IHJldHVybiB0OyB9KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHRvOiBWZWN0b3IpIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5U2Vjb25kcywgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCB0aGlzLmJhc2VDb29yZHMsIHRvLCAoKSA9PiBzdGF0aW9uLmV4aXN0aW5nTGFiZWxzLmZvckVhY2gobCA9PiBsLmRyYXcoMCwgZmFsc2UpKSk7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXlTZWNvbmRzKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgc3RhdGlvblNpemVGb3JBeGlzKGF4aXM6IHN0cmluZywgdmVjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZlY3RvciwgMCkpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY29uc3QgZGlyID0gTWF0aC5zaWduKHZlY3Rvcik7XG4gICAgICAgIGxldCBkaW1lbiA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10pW3ZlY3RvciA8IDAgPyAwIDogMV07XG4gICAgICAgIGlmIChkaXIqZGltZW4gPCAwKSB7XG4gICAgICAgICAgICBkaW1lbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgZGlyICogKFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOICsgU3RhdGlvbi5MQUJFTF9ESVNUQU5DRSk7XG4gICAgfVxuXG4gICAgbGluZXNFeGlzdGluZygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMaW5lcy54Lmxlbmd0aCA+IDAgfHwgdGhpcy5leGlzdGluZ0xpbmVzLnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBBcnJpdmFsRGVwYXJ0dXJlVGltZSB9IGZyb20gXCIuL0Fycml2YWxEZXBhcnR1cmVUaW1lXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhaW5BZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBib3VuZGluZ0JveDogQm91bmRpbmdCb3g7XG4gICAgc3RvcHM6IFN0b3BbXTtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBmb2xsb3c6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSk6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZvbGxvdzoge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9KTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFpbiBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBUcmFpbkFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLm5hbWU7XG4gICAgYm91bmRpbmdCb3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBsaW5lR3JvdXAgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSlcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGlmIChzdG9wcy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUcmFpbiBcIiArIHRoaXMubmFtZSArIFwiIG5lZWRzIGF0IGxlYXN0IDIgc3RvcHNcIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaT0xOyBpPHN0b3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcnJkZXAgPSBuZXcgQXJyaXZhbERlcGFydHVyZVRpbWUoc3RvcHNbaV0udHJhY2tJbmZvKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBsaW5lR3JvdXAuZ2V0UGF0aEJldHdlZW4oc3RvcHNbaS0xXS5zdGF0aW9uSWQsIHN0b3BzW2ldLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAocGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgYW5pbWF0ZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5ICsgYXJyZGVwLmRlcGFydHVyZSAtIHRoaXMuZnJvbS5zZWNvbmQsIGFycmRlcC5hcnJpdmFsIC0gYXJyZGVwLmRlcGFydHVyZSwgcGF0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMubmFtZSArICc6IE5vIHBhdGggZm91bmQgYmV0d2VlbiAnICsgc3RvcHNbaS0xXS5zdGF0aW9uSWQgKyAnICcgKyBzdG9wc1tpXS5zdGF0aW9uSWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVXRpbHMge1xuICAgIHN0YXRpYyByZWFkb25seSBJTVBSRUNJU0lPTjogbnVtYmVyID0gMC4wMDE7XG5cbiAgICBzdGF0aWMgZXF1YWxzKGE6IG51bWJlciwgYjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gYikgPCBVdGlscy5JTVBSRUNJU0lPTjtcbiAgICB9XG5cbiAgICBzdGF0aWMgdHJpbGVtbWEoaW50OiBudW1iZXIsIG9wdGlvbnM6IFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoaW50LCAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNbMV07XG4gICAgICAgIH0gZWxzZSBpZiAoaW50ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNbMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdGlvbnNbMF07XG4gICAgfVxuXG4gICAgc3RhdGljIGFscGhhYmV0aWNJZChhOiBzdHJpbmcsIGI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChhIDwgYilcbiAgICAgICAgICAgIHJldHVybiBhICsgJ18nICsgYjtcbiAgICAgICAgcmV0dXJuIGIgKyAnXycgKyBhO1xuICAgIH1cblxuICAgIHN0YXRpYyBlYXNlKHg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDQgKiB4ICogeCAqIHggOiAxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgMykgLyAyO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBWZWN0b3Ige1xuICAgIHN0YXRpYyBVTklUOiBWZWN0b3IgPSBuZXcgVmVjdG9yKDAsIC0xKTtcbiAgICBzdGF0aWMgTlVMTDogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAwKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3g6IG51bWJlciwgcHJpdmF0ZSBfeTogbnVtYmVyKSB7XG5cbiAgICB9XG5cbiAgICBnZXQgeCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5feDtcbiAgICB9XG5cbiAgICBnZXQgeSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5feTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LCAyKSArIE1hdGgucG93KHRoaXMueSwgMikpO1xuICAgIH1cblxuICAgIHdpdGhMZW5ndGgobGVuZ3RoOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCByYXRpbyA9IHRoaXMubGVuZ3RoICE9IDAgPyBsZW5ndGgvdGhpcy5sZW5ndGggOiAwO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngqcmF0aW8sIHRoaXMueSpyYXRpbyk7XG4gICAgfVxuXG4gICAgYWRkKHRoYXQgOiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKyB0aGF0LngsIHRoaXMueSArIHRoYXQueSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhhdC54IC0gdGhpcy54LCB0aGF0LnkgLSB0aGlzLnkpO1xuICAgIH1cblxuICAgIHJvdGF0ZSh0aGV0YTogUm90YXRpb24pOiBWZWN0b3Ige1xuICAgICAgICBsZXQgcmFkOiBudW1iZXIgPSB0aGV0YS5yYWRpYW5zO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKiBNYXRoLmNvcyhyYWQpIC0gdGhpcy55ICogTWF0aC5zaW4ocmFkKSwgdGhpcy54ICogTWF0aC5zaW4ocmFkKSArIHRoaXMueSAqIE1hdGguY29zKHJhZCkpO1xuICAgIH1cblxuICAgIGRvdFByb2R1Y3QodGhhdDogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCp0aGF0LngrdGhpcy55KnRoYXQueTtcbiAgICB9XG5cbiAgICBzb2x2ZURlbHRhRm9ySW50ZXJzZWN0aW9uKGRpcjE6IFZlY3RvciwgZGlyMjogVmVjdG9yKToge2E6IG51bWJlciwgYjogbnVtYmVyfSB7XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSB0aGlzO1xuICAgICAgICBjb25zdCBzd2FwWmVyb0RpdmlzaW9uID0gVXRpbHMuZXF1YWxzKGRpcjIueSwgMCk7XG4gICAgICAgIGNvbnN0IHggPSBzd2FwWmVyb0RpdmlzaW9uID8gJ3knIDogJ3gnO1xuICAgICAgICBjb25zdCB5ID0gc3dhcFplcm9EaXZpc2lvbiA/ICd4JyA6ICd5JztcbiAgICAgICAgY29uc3QgZGVub21pbmF0b3IgPSAoZGlyMVt5XSpkaXIyW3hdLWRpcjFbeF0qZGlyMlt5XSk7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGVub21pbmF0b3IsIDApKSB7XG4gICAgICAgICAgICByZXR1cm4ge2E6IE5hTiwgYjogTmFOfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhID0gKGRlbHRhW3ldKmRpcjJbeF0tZGVsdGFbeF0qZGlyMlt5XSkvZGVub21pbmF0b3I7XG4gICAgICAgIGNvbnN0IGIgPSAoYSpkaXIxW3ldLWRlbHRhW3ldKS9kaXIyW3ldO1xuICAgICAgICByZXR1cm4ge2EsIGJ9O1xuICAgIH1cblxuICAgIGlzRGVsdGFNYXRjaGluZ1BhcmFsbGVsKGRpcjE6IFZlY3RvciwgZGlyMjogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsbEVxdWFsWmVybyh0aGlzLngsIGRpcjEueCwgZGlyMi54KSB8fCB0aGlzLmFsbEVxdWFsWmVybyh0aGlzLnksIGRpcjEueSwgZGlyMi55KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFsbEVxdWFsWmVybyhuMTogbnVtYmVyLCBuMjogbnVtYmVyLCBuMzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBVdGlscy5lcXVhbHMobjEsIDApICYmIFV0aWxzLmVxdWFscyhuMiwgMCkgJiYgVXRpbHMuZXF1YWxzKG4zLCAwKTtcbiAgICB9XG5cbiAgICBpbmNsaW5hdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy54LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy55ID4gMCA/IDE4MCA6IDApO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueSwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueCA+IDAgPyA5MCA6IC05MCk7XG4gICAgICAgIGNvbnN0IGFkamFjZW50ID0gbmV3IFZlY3RvcigwLC1NYXRoLmFicyh0aGlzLnkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihNYXRoLnNpZ24odGhpcy54KSpNYXRoLmFjb3ModGhpcy5kb3RQcm9kdWN0KGFkamFjZW50KS9hZGphY2VudC5sZW5ndGgvdGhpcy5sZW5ndGgpKjE4MC9NYXRoLlBJKTtcbiAgICB9XG5cbiAgICBhbmdsZShvdGhlcjogVmVjdG9yKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmNsaW5hdGlvbigpLmRlbHRhKG90aGVyLmluY2xpbmF0aW9uKCkpO1xuICAgIH1cblxuICAgIGJvdGhBeGlzTWlucyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54IDwgb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA8IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJvdGhBeGlzTWF4cyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ID4gb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA+IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJldHdlZW4ob3RoZXI6IFZlY3RvciwgeDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5kZWx0YShvdGhlcik7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChkZWx0YS53aXRoTGVuZ3RoKGRlbHRhLmxlbmd0aCp4KSk7XG4gICAgfVxuXG4gICAgZXF1YWxzKG90aGVyOiBWZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PSBvdGhlci54ICYmIHRoaXMueSA9PSBvdGhlci55O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcblxuXG5cbmV4cG9ydCBjbGFzcyBab29tZXIge1xuICAgIHN0YXRpYyBaT09NX0RVUkFUSU9OID0gMTtcbiAgICBzdGF0aWMgWk9PTV9NQVhfU0NBTEUgPSAzO1xuICAgIHN0YXRpYyBQQURESU5HX0ZBQ1RPUiA9IDI1O1xuICAgIFxuICAgIHByaXZhdGUgYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcbiAgICBwcml2YXRlIGN1c3RvbUR1cmF0aW9uID0gLTE7XG4gICAgcHJpdmF0ZSByZXNldEZsYWcgPSBmYWxzZTtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhbnZhc1NpemU6IEJvdW5kaW5nQm94KSB7XG4gICAgfVxuXG4gICAgaW5jbHVkZShib3VuZGluZ0JveDogQm91bmRpbmdCb3gsIGZyb206IEluc3RhbnQsIHRvOiBJbnN0YW50LCBkcmF3OiBib29sZWFuLCBzaG91bGRBbmltYXRlOiBib29sZWFuLCBwYWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IG5vdyA9IGRyYXcgPyBmcm9tIDogdG87XG4gICAgICAgIGlmIChub3cuZmxhZy5pbmNsdWRlcygna2VlcHpvb20nKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldEZsYWcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0RmxhZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9SZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNob3VsZEFuaW1hdGUgJiYgIW5vdy5mbGFnLmluY2x1ZGVzKCdub3pvb20nKSkge1xuICAgICAgICAgICAgICAgIGlmIChwYWQgJiYgIWJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gdGhpcy5wYWRkZWRCb3VuZGluZ0JveChib3VuZGluZ0JveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3gudGwgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJvdGhBeGlzTWlucyhib3VuZGluZ0JveC50bCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC5iciA9IHRoaXMuYm91bmRpbmdCb3guYnIuYm90aEF4aXNNYXhzKGJvdW5kaW5nQm94LmJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZW5mb3JjZWRCb3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGlmICghdGhpcy5ib3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgY29uc3QgcGFkZGVkQm91bmRpbmdCb3ggPSB0aGlzLmJvdW5kaW5nQm94O1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBwYWRkZWRCb3VuZGluZ0JveC5kaW1lbnNpb25zO1xuICAgICAgICAgICAgY29uc3QgY2FudmFzU2l6ZSA9IHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zO1xuICAgICAgICAgICAgY29uc3QgbWluWm9vbVNpemUgPSBuZXcgVmVjdG9yKGNhbnZhc1NpemUueCAvIFpvb21lci5aT09NX01BWF9TQ0FMRSwgY2FudmFzU2l6ZS55IC8gWm9vbWVyLlpPT01fTUFYX1NDQUxFKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gem9vbVNpemUuZGVsdGEobWluWm9vbVNpemUpO1xuICAgICAgICAgICAgY29uc3QgYWRkaXRpb25hbFNwYWNpbmcgPSBuZXcgVmVjdG9yKE1hdGgubWF4KDAsIGRlbHRhLngvMiksIE1hdGgubWF4KDAsIGRlbHRhLnkvMikpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFxuICAgICAgICAgICAgICAgIHBhZGRlZEJvdW5kaW5nQm94LnRsLmFkZChhZGRpdGlvbmFsU3BhY2luZy5yb3RhdGUobmV3IFJvdGF0aW9uKDE4MCkpKSxcbiAgICAgICAgICAgICAgICBwYWRkZWRCb3VuZGluZ0JveC5ici5hZGQoYWRkaXRpb25hbFNwYWNpbmcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmJvdW5kaW5nQm94O1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFkZGVkQm91bmRpbmdCb3goYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94KTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBwYWRkaW5nID0gKHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zLnggKyB0aGlzLmNhbnZhc1NpemUuZGltZW5zaW9ucy55KS9ab29tZXIuUEFERElOR19GQUNUT1I7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goXG4gICAgICAgICAgICBib3VuZGluZ0JveC50bC5hZGQobmV3IFZlY3RvcigtcGFkZGluZywgLXBhZGRpbmcpKSxcbiAgICAgICAgICAgIGJvdW5kaW5nQm94LmJyLmFkZChuZXcgVmVjdG9yKHBhZGRpbmcsIHBhZGRpbmcpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldCBjZW50ZXIoKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgZW5mb3JjZWRCb3VuZGluZ0JveCA9IHRoaXMuZW5mb3JjZWRCb3VuZGluZ0JveCgpO1xuICAgICAgICBpZiAoIWVuZm9yY2VkQm91bmRpbmdCb3guaXNOdWxsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueCArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueCkvMiksIFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueSArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueSkvMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhc1NpemUudGwuYmV0d2Vlbih0aGlzLmNhbnZhc1NpemUuYnIsIDAuNSk7XG4gICAgfVxuXG4gICAgZ2V0IHNjYWxlKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKCFlbmZvcmNlZEJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tU2l6ZSA9IGVuZm9yY2VkQm91bmRpbmdCb3guZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5jYW52YXNTaXplLmRpbWVuc2lvbnM7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5taW4oZGVsdGEueCAvIHpvb21TaXplLngsIGRlbHRhLnkgLyB6b29tU2l6ZS55KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBnZXQgZHVyYXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tRHVyYXRpb24gPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21EdXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRvUmVzZXQoKSB7XG4gICAgICAgIHRoaXMuYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcbiAgICAgICAgdGhpcy5jdXN0b21EdXJhdGlvbiA9IC0xO1xuICAgICAgICB0aGlzLnJlc2V0RmxhZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy5yZXNldEZsYWcgPSB0cnVlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9zdmcvU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5cbi8vIFRPRE86IGVyYXNlIGFuaW0sIGxhYmVscywgbmVnYXRpdmUgZGVmYXVsdCB0cmFja3MgYmFzZWQgb24gZGlyZWN0aW9uLCByZWpvaW4gbGluZXMgdHJhY2sgc2VsZWN0aW9uXG5cbmxldCB0aW1lUGFzc2VkID0gMDtcblxuY29uc3QgbmV0d29yazogTmV0d29yayA9IG5ldyBOZXR3b3JrKG5ldyBTdmdOZXR3b3JrKCkpO1xubmV0d29yay5pbml0aWFsaXplKCk7XG5cbmNvbnN0IGFuaW1hdGVGcm9tSW5zdGFudDogSW5zdGFudCA9IGdldFN0YXJ0SW5zdGFudCgpO1xuc2xpZGUoSW5zdGFudC5CSUdfQkFORywgZmFsc2UpO1xuXG5mdW5jdGlvbiBnZXRTdGFydEluc3RhbnQoKTogSW5zdGFudCB7XG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0ZUZyb21JbnN0YW50OiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJykuc3BsaXQoJy0nKTtcbiAgICAgICAgY29uc3QgaW5zdGFudCA9IG5ldyBJbnN0YW50KHBhcnNlSW50KGFuaW1hdGVGcm9tSW5zdGFudFswXSkgfHwgMCwgcGFyc2VJbnQoYW5pbWF0ZUZyb21JbnN0YW50WzFdKSB8fCAwLCAnJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmYXN0IGZvcndhcmQgdG8nLCBpbnN0YW50KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbnQ7XG4gICAgfVxuICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xufVxuXG5mdW5jdGlvbiBzbGlkZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGluc3RhbnQgIT0gSW5zdGFudC5CSUdfQkFORyAmJiBpbnN0YW50LmVwb2NoID49IGFuaW1hdGVGcm9tSW5zdGFudC5lcG9jaCAmJiBpbnN0YW50LnNlY29uZCA+PSBhbmltYXRlRnJvbUluc3RhbnQuc2Vjb25kKVxuICAgICAgICBhbmltYXRlID0gdHJ1ZTtcblxuICAgIGNvbnNvbGUubG9nKGluc3RhbnQsICd0aW1lOiAnICsgTWF0aC5mbG9vcih0aW1lUGFzc2VkIC8gNjApICsgJzonICsgdGltZVBhc3NlZCAlIDYwKTtcblxuICAgIG5ldHdvcmsuZHJhd1RpbWVkRHJhd2FibGVzQXQoaW5zdGFudCwgYW5pbWF0ZSk7XG4gICAgY29uc3QgbmV4dCA9IG5ldHdvcmsubmV4dEluc3RhbnQoaW5zdGFudCk7XG4gICAgXG4gICAgaWYgKG5leHQpIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBpbnN0YW50LmRlbHRhKG5leHQpO1xuICAgICAgICB0aW1lUGFzc2VkICs9IGRlbHRhO1xuICAgICAgICBjb25zdCBkZWxheSA9IGFuaW1hdGUgPyBkZWx0YSA6IDA7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzbGlkZShuZXh0LCBhbmltYXRlKTsgfSwgZGVsYXkgKiAxMDAwKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IEdlbmVyaWNUaW1lZERyYXdhYmxlQWRhcHRlciB9IGZyb20gXCIuLi9HZW5lcmljVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdHZW5lcmljVGltZWREcmF3YWJsZSBpbXBsZW1lbnRzIEdlbmVyaWNUaW1lZERyYXdhYmxlQWRhcHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCByID0gdGhpcy5lbGVtZW50LmdldEJCb3goKTtcbiAgICAgICAgY29uc3QgYmJveCA9IG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHIueCwgci55KSwgbmV3IFZlY3RvcihyLngrci53aWR0aCwgci55K3IuaGVpZ2h0KSk7XG4gICAgICAgIHJldHVybiBiYm94O1xuICAgIH1cblxuICAgIGdldCB6b29tKCk6IFZlY3RvciB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFsnem9vbSddICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbJ3pvb20nXS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VJbnQoY2VudGVyWzBdKSB8fCA1MCwgcGFyc2VJbnQoY2VudGVyWzFdKSB8fCA1MCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFZlY3Rvci5OVUxMO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZHJhdygwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHpvb21DZW50ZXIsIHpvb21TY2FsZSk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICB0aGlzLmRvWm9vbSh6b29tQ2VudGVyLCB6b29tU2NhbGUsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1pvb20oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUoMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMsIHRoaXMuYm91bmRpbmdCb3gudGwuYmV0d2Vlbih0aGlzLmJvdW5kaW5nQm94LmJyLCAwLjUpLCB6b29tQ2VudGVyLCAxLCB6b29tU2NhbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lKHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlciwgZnJvbUNlbnRlcjogVmVjdG9yLCB0b0NlbnRlcjogVmVjdG9yLCBmcm9tU2NhbGU6IG51bWJlciwgdG9TY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgeCArPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGZ4ID0geDtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gZnJvbUNlbnRlci5kZWx0YSh0b0NlbnRlcilcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIGZ4LCBkZWx0YS55ICogZngpLmFkZChmcm9tQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gKHRvU2NhbGUgLSBmcm9tU2NhbGUpICogZnggKyBmcm9tU2NhbGU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20oY2VudGVyLCBzY2FsZSk7XG4gICAgICAgICAgICBjb25zdCBuZXR3b3JrID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IG5ldHdvcmsuYW5pbWF0ZUZyYW1lKHgsIGFuaW1hdGlvblBlckZyYW1lLCBmcm9tQ2VudGVyLCB0b0NlbnRlciwgZnJvbVNjYWxlLCB0b1NjYWxlKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20odG9DZW50ZXIsIHRvU2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGNlbnRlcjogVmVjdG9yLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHpvb21hYmxlID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBpZiAoem9vbWFibGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJldHdlZW4odGhpcy5ib3VuZGluZ0JveC5iciwgMC41KTtcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IG9yaWdpbi54ICsgJ3B4ICcgKyBvcmlnaW4ueSArICdweCc7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlICsgJykgdHJhbnNsYXRlKCcgKyAob3JpZ2luLnggLSBjZW50ZXIueCkgKyAncHgsJyArIChvcmlnaW4ueSAtIGNlbnRlci55KSArICdweCknO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBsYWJlbC5lcmFzZSgwKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IExhYmVsQWRhcHRlciwgTGFiZWwgfSBmcm9tIFwiLi4vTGFiZWxcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vVXRpbHNcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTGFiZWwgaW1wbGVtZW50cyBMYWJlbEFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIGdldCBmb3JTdGF0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uO1xuICAgIH1cblxuICAgIGdldCBmb3JMaW5lKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHIueCwgci55KSwgbmV3IFZlY3RvcihyLngrci53aWR0aCwgci55K3IuaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIHRleHRDb29yZHM6IFZlY3RvciwgbGFiZWxEaXI6IFJvdGF0aW9uLCBjaGlsZHJlbjogTGFiZWxBZGFwdGVyW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBsYWJlbC5kcmF3KDAsIHRleHRDb29yZHMsIGxhYmVsRGlyLCBjaGlsZHJlbik7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Q29vcmRzICE9IFZlY3Rvci5OVUxMKSB7XG4gICAgICAgICAgICB0aGlzLnNldENvb3JkKHRoaXMuZWxlbWVudCwgdGV4dENvb3Jkcyk7XG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0xpbmVMYWJlbHMobGFiZWxEaXIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGUoYm94RGltZW46IFZlY3RvciwgbGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnXG4gICAgICAgICAgICArIFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueCwgWy1ib3hEaW1lbi54ICsgJ3B4JywgLWJveERpbWVuLngvMiArICdweCcsICcwcHgnXSlcbiAgICAgICAgICAgICsgJywnXG4gICAgICAgICAgICArIFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueSwgWy1MYWJlbC5MQUJFTF9IRUlHSFQgKyAncHgnLCAtTGFiZWwuTEFCRUxfSEVJR0hULzIgKyAncHgnLCAnMHB4J10pIC8vIFRPRE8gbWFnaWMgbnVtYmVyc1xuICAgICAgICAgICAgKyAnKSc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xpbmVMYWJlbHMobGFiZWxEaXI6IFJvdGF0aW9uLCBjaGlsZHJlbjogTGFiZWxBZGFwdGVyW10pIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgaWYgKGMgaW5zdGFuY2VvZiBTdmdMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0xpbmVMYWJlbChjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgvTWF0aC5tYXgodGhpcy5lbGVtZW50LmdldEJCb3goKS53aWR0aCwgMSk7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IoYmJveC53aWR0aC9zY2FsZSwgYmJveC5oZWlnaHQvc2NhbGUpLCBsYWJlbERpcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVsKGxhYmVsOiBTdmdMYWJlbCkge1xuICAgICAgICBjb25zdCBsaW5lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnLCAnZGl2Jyk7XG4gICAgICAgIGxpbmVMYWJlbC5jbGFzc05hbWUgPSBsYWJlbC5jbGFzc05hbWVzO1xuICAgICAgICBsaW5lTGFiZWwuaW5uZXJIVE1MID0gbGFiZWwudGV4dDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyOiBSb3RhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbC5pbmNsdWRlcygnZm9yLXN0YXRpb24nKSlcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIGZvci1zdGF0aW9uJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmRvbWluYW50QmFzZWxpbmUgPSAnaGFuZ2luZyc7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IodGhpcy5lbGVtZW50LmdldEJCb3goKS53aWR0aCwgdGhpcy5lbGVtZW50LmdldEJCb3goKS5oZWlnaHQpLCBsYWJlbERpcik7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBsYWJlbC5lcmFzZSgwKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGdldCBjbGFzc05hbWVzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKyAnICcgKyB0aGlzLmZvckxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyIHtcbiAgICAgICAgY29uc3QgbGluZUxhYmVsOiBTVkdHcmFwaGljc0VsZW1lbnQgPSA8U1ZHR3JhcGhpY3NFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgICAgICBsaW5lTGFiZWwuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBmb3ItbGluZSc7XG4gICAgICAgIGxpbmVMYWJlbC5kYXRhc2V0LnN0YXRpb24gPSBzdGF0aW9uSWQ7XG4gICAgICAgIGxpbmVMYWJlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgICBsaW5lTGFiZWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpb25zJyk/LmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgICAgIHJldHVybiBuZXcgU3ZnTGFiZWwobGluZUxhYmVsKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBMaW5lQWRhcHRlciwgTGluZSB9IGZyb20gXCIuLi9MaW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdMaW5lIGltcGxlbWVudHMgTGluZUFkYXB0ZXIge1xuXG4gICAgcHJpdmF0ZSBfc3RvcHM6IFN0b3BbXSA9IFtdO1xuICAgIGJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR1BhdGhFbGVtZW50KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQubGluZSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgd2VpZ2h0KCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQm91bmRpbmdCb3gocGF0aDogVmVjdG9yW10pOiB2b2lkIHtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxwYXRoLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3gudGwgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJvdGhBeGlzTWlucyhwYXRoW2ldKTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3guYnIgPSB0aGlzLmJvdW5kaW5nQm94LmJyLmJvdGhBeGlzTWF4cyhwYXRoW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuXG4gICAgZ2V0IHN0b3BzKCk6IFN0b3BbXSB7XG4gICAgICAgIGlmICh0aGlzLl9zdG9wcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RvcHM/LnNwbGl0KC9cXHMrLykgfHwgW107XG4gICAgICAgICAgICBsZXQgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0b2tlbnM/Lmxlbmd0aDtpKyspIHsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRva2Vuc1tpXVswXSAhPSAnLScgJiYgdG9rZW5zW2ldWzBdICE9ICcrJyAmJiB0b2tlbnNbaV1bMF0gIT0gJyonKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdG9wLnN0YXRpb25JZCA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RvcHMucHVzaChuZXh0U3RvcCk7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdG9wID0gbmV3IFN0b3AoJycsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcC50cmFja0luZm8gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9wcztcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcGF0aDogVmVjdG9yW10sIGxlbmd0aDogbnVtYmVyLCBjb2xvckRldmlhdGlvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3gocGF0aCk7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgbGluZS5kcmF3KDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgcGF0aCwgbGVuZ3RoLCBjb2xvckRldmlhdGlvbik7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIGxpbmUgJyArIHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHBhdGgpO1xuICAgIFxuICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheShsZW5ndGgpO1xuICAgICAgICBpZiAoY29sb3JEZXZpYXRpb24gIT0gMCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDb2xvcihjb2xvckRldmlhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9PSAwKSB7XG4gICAgICAgICAgICBsZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lKGxlbmd0aCwgMCwgLWxlbmd0aC9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMpO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCBjb2xvckZyb206IG51bWJlciwgY29sb3JUbzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3godG8pO1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGxpbmUubW92ZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIGZyb20sIHRvLCBjb2xvckZyb20sIGNvbG9yVG8pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgY29sb3JGcm9tLCBjb2xvclRvLCAwLCAxL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUyk7XG4gICAgfVxuXG4gICAgXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBsZW5ndGg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGluZS5lcmFzZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHJldmVyc2UsIGxlbmd0aCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmcm9tID0gMDtcbiAgICAgICAgaWYgKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9PSAwKSB7XG4gICAgICAgICAgICBmcm9tID0gbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHJldmVyc2UgPyAtMSA6IDE7XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lKGZyb20sIGxlbmd0aCAqIGRpcmVjdGlvbiwgbGVuZ3RoL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUyAqIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVQYXRoKHBhdGg6IFZlY3RvcltdKSB7XG4gICAgICAgIGNvbnN0IGQgPSAnTScgKyBwYXRoLm1hcCh2ID0+IHYueCsnLCcrdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVEYXNoYXJyYXkobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGRhc2hlZFBhcnQgPSBsZW5ndGggKyAnJztcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuc3Ryb2tlRGFzaGFycmF5LnJlcGxhY2UoL1teMC05XFxzLF0rL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHByZXNldEFycmF5ID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwuc3BsaXQoL1tcXHMsXSsvKTtcbiAgICAgICAgICAgIGlmIChwcmVzZXRBcnJheS5sZW5ndGggJSAyID09IDEpXG4gICAgICAgICAgICAgICAgcHJlc2V0QXJyYXkgPSBwcmVzZXRBcnJheS5jb25jYXQocHJlc2V0QXJyYXkpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0TGVuZ3RoID0gcHJlc2V0QXJyYXkubWFwKGEgPT4gcGFyc2VJbnQoYSkgfHwgMCkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG4gICAgICAgICAgICBkYXNoZWRQYXJ0ID0gbmV3IEFycmF5KE1hdGguY2VpbChsZW5ndGggLyBwcmVzZXRMZW5ndGggKyAxKSkuam9pbihwcmVzZXRBcnJheS5qb2luKCcgJykgKyAnICcpICsgJzAnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBkYXNoZWRQYXJ0ICsgJyAnICsgbGVuZ3RoO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQ29sb3IoZGV2aWF0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZSA9ICdyZ2IoJyArIE1hdGgubWF4KDAsIGRldmlhdGlvbikgKiAyNTYgKyAnLCAwLCAnICsgTWF0aC5taW4oMCwgZGV2aWF0aW9uKSAqIC0yNTYgKyAnKSc7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lKGZyb206IG51bWJlciwgdG86IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoYW5pbWF0aW9uUGVyRnJhbWUgPCAwICYmIGZyb20gPiB0byB8fCBhbmltYXRpb25QZXJGcmFtZSA+IDAgJiYgZnJvbSA8IHRvKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IGZyb20gKyAnJztcbiAgICAgICAgICAgIGZyb20gKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxpbmUuYW5pbWF0ZUZyYW1lKGZyb20sIHRvLCBhbmltYXRpb25QZXJGcmFtZSk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSB0byArICcnO1xuICAgICAgICAgICAgaWYgKHRvICE9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWVWZWN0b3IoZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSwgY29sb3JGcm9tOiBudW1iZXIsIGNvbG9yVG86IG51bWJlciwgeDogbnVtYmVyLCBhbmltYXRpb25QZXJGcmFtZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVkID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlZC5wdXNoKGZyb21baV0uYmV0d2Vlbih0b1tpXSwgeCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkoaW50ZXJwb2xhdGVkWzBdLmRlbHRhKGludGVycG9sYXRlZFtpbnRlcnBvbGF0ZWQubGVuZ3RoLTFdKS5sZW5ndGgpOyAvLyBUT0RPIGFyYml0cmFyeSBub2RlIGNvdW50XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBhdGgoaW50ZXJwb2xhdGVkKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3IoKGNvbG9yVG8tY29sb3JGcm9tKSp4K2NvbG9yRnJvbSk7XG5cbiAgICAgICAgICAgIHggKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxpbmUuYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb20sIHRvLCBjb2xvckZyb20sIGNvbG9yVG8sIHgsIGFuaW1hdGlvblBlckZyYW1lKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheSh0b1swXS5kZWx0YSh0b1t0by5sZW5ndGgtMV0pLmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBhdGgodG8pO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IE5ldHdvcmtBZGFwdGVyLCBOZXR3b3JrLCBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi4vTGluZVwiO1xuaW1wb3J0IHsgU3ZnTGluZSB9IGZyb20gXCIuL1N2Z0xpbmVcIjtcbmltcG9ydCB7IFN2Z1N0YXRpb24gfSBmcm9tIFwiLi9TdmdTdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gXCIuLi9MYWJlbFwiO1xuaW1wb3J0IHsgU3ZnTGFiZWwgfSBmcm9tIFwiLi9TdmdMYWJlbFwiO1xuaW1wb3J0IHsgR2VuZXJpY1RpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi4vR2VuZXJpY1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuLi9ab29tZXJcIjtcbmltcG9ydCB7IFRyYWluIH0gZnJvbSBcIi4uL1RyYWluXCI7XG5pbXBvcnQgeyBTdmdUcmFpbiB9IGZyb20gXCIuL1N2Z1RyYWluXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTmV0d29yayBpbXBsZW1lbnRzIE5ldHdvcmtBZGFwdGVyIHtcblxuICAgIHN0YXRpYyBGUFMgPSA2MDtcbiAgICBzdGF0aWMgU1ZHTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRab29tQ2VudGVyOiBWZWN0b3IgPSBWZWN0b3IuTlVMTDtcbiAgICBwcml2YXRlIGN1cnJlbnRab29tU2NhbGU6IG51bWJlciA9IDE7XG5cbiAgICBnZXQgY2FudmFzU2l6ZSgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICBjb25zdCBib3ggPSBzdmc/LnZpZXdCb3guYmFzZVZhbDtcbiAgICAgICAgaWYgKGJveCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKGJveC54LCBib3gueSksIG5ldyBWZWN0b3IoYm94LngrYm94LndpZHRoLCBib3gueStib3guaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpOyAgICAgICAgXG4gICAgfVxuXG4gICAgZ2V0IGJlY2tTdHlsZSgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIHJldHVybiBzdmc/LmRhdGFzZXQuYmVja1N0eWxlICE9ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZCB7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKTtcbiAgICAgICAgaWYgKGVsZW1lbnRzID09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUGxlYXNlIGRlZmluZSB0aGUgXCJlbGVtZW50c1wiIGdyb3VwLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudDogVGltZWREcmF3YWJsZSB8IG51bGwgPSB0aGlzLm1pcnJvckVsZW1lbnQoZWxlbWVudHNbaV0sIG5ldHdvcmspO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuYWRkVG9JbmRleChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWlycm9yRWxlbWVudChlbGVtZW50OiBhbnksIG5ldHdvcms6IFN0YXRpb25Qcm92aWRlcik6IFRpbWVkRHJhd2FibGUgfCBudWxsIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJyAmJiBlbGVtZW50LmRhdGFzZXQubGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGluZShuZXcgU3ZnTGluZShlbGVtZW50KSwgbmV0d29yaywgdGhpcy5iZWNrU3R5bGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJyAmJiBlbGVtZW50LmRhdGFzZXQudHJhaW4gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRyYWluKG5ldyBTdmdUcmFpbihlbGVtZW50KSwgbmV0d29yayk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3JlY3QnICYmIGVsZW1lbnQuZGF0YXNldC5zdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGVsZW1lbnQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGFiZWwobmV3IFN2Z0xhYmVsKGVsZW1lbnQpLCBuZXR3b3JrKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmRhdGFzZXQuZnJvbSAhPSB1bmRlZmluZWQgfHwgZWxlbWVudC5kYXRhc2V0LnRvICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBHZW5lcmljVGltZWREcmF3YWJsZShuZXcgU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUoZWxlbWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGhlbHBTdG9wID0gPFNWR1JlY3RFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnTmV0d29yay5TVkdOUywgJ3JlY3QnKTtcbiAgICAgICAgaGVscFN0b3Auc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRpb24nLCBpZCk7XG4gICAgICAgIGhlbHBTdG9wLnNldEF0dHJpYnV0ZSgnZGF0YS1kaXInLCByb3RhdGlvbi5uYW1lKTtcbiAgICAgICAgdGhpcy5zZXRDb29yZChoZWxwU3RvcCwgYmFzZUNvb3Jkcyk7XG4gICAgICAgIGhlbHBTdG9wLmNsYXNzTmFtZS5iYXNlVmFsID0gJ2hlbHBlcic7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0aW9ucycpPy5hcHBlbmRDaGlsZChoZWxwU3RvcCk7XG4gICAgICAgIHJldHVybiBuZXcgU3RhdGlvbihuZXcgU3ZnU3RhdGlvbihoZWxwU3RvcCkpOyAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDb29yZChlbGVtZW50OiBhbnksIGNvb3JkOiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3gnLCBjb29yZC54KTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBjb29yZC55KTtcbiAgICB9XG5cbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnZXBvY2gnLCB7IGRldGFpbDogZXBvY2ggfSk7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICBcbiAgICAgICAgbGV0IGVwb2NoTGFiZWw7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXBvY2gtbGFiZWwnKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVwb2NoTGFiZWwgPSA8U1ZHVGV4dEVsZW1lbnQ+IDx1bmtub3duPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXBvY2gtbGFiZWwnKTtcbiAgICAgICAgICAgIGVwb2NoTGFiZWwudGV4dENvbnRlbnQgPSBlcG9jaDsgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG4gICBcbiAgICB6b29tVG8oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV0d29yayA9IHRoaXM7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBuZXR3b3JrLmRvWm9vbSh6b29tQ2VudGVyLCB6b29tU2NhbGUsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyk7IH0sXG4gICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA8PSBab29tZXIuWk9PTV9EVVJBVElPTiA/IDAgOiBab29tZXIuWk9PTV9EVVJBVElPTiAqIDEwMDApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1pvb20oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUoMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA8PSBab29tZXIuWk9PTV9EVVJBVElPTiwgdGhpcy5jdXJyZW50Wm9vbUNlbnRlciwgem9vbUNlbnRlciwgdGhpcy5jdXJyZW50Wm9vbVNjYWxlLCB6b29tU2NhbGUpO1xuICAgICAgICB0aGlzLmN1cnJlbnRab29tQ2VudGVyID0gem9vbUNlbnRlcjtcbiAgICAgICAgdGhpcy5jdXJyZW50Wm9vbVNjYWxlID0gem9vbVNjYWxlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lKHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlciwgZWFzZTogYm9vbGVhbiwgZnJvbUNlbnRlcjogVmVjdG9yLCB0b0NlbnRlcjogVmVjdG9yLCBmcm9tU2NhbGU6IG51bWJlciwgdG9TY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgeCArPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGZ4ID0gZWFzZSA/IFV0aWxzLmVhc2UoeCkgOiB4O1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBmcm9tQ2VudGVyLmRlbHRhKHRvQ2VudGVyKVxuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlY3RvcihkZWx0YS54ICogZngsIGRlbHRhLnkgKiBmeCkuYWRkKGZyb21DZW50ZXIpO1xuICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSAodG9TY2FsZSAtIGZyb21TY2FsZSkgKiBmeCArIGZyb21TY2FsZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbShjZW50ZXIsIHNjYWxlKTtcbiAgICAgICAgICAgIGNvbnN0IG5ldHdvcmsgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbmV0d29yay5hbmltYXRlRnJhbWUoeCwgYW5pbWF0aW9uUGVyRnJhbWUsIGVhc2UsIGZyb21DZW50ZXIsIHRvQ2VudGVyLCBmcm9tU2NhbGUsIHRvU2NhbGUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbSh0b0NlbnRlciwgdG9TY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVpvb20oY2VudGVyOiBWZWN0b3IsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgem9vbWFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbWFibGUnKTtcbiAgICAgICAgaWYgKHpvb21hYmxlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gdGhpcy5jYW52YXNTaXplLnRsLmJldHdlZW4odGhpcy5jYW52YXNTaXplLmJyLCAwLjUpO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gb3JpZ2luLnggKyAncHggJyArIG9yaWdpbi55ICsgJ3B4JztcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSB0cmFuc2xhdGUoJyArIChvcmlnaW4ueCAtIGNlbnRlci54KSArICdweCwnICsgKG9yaWdpbi55IC0gY2VudGVyLnkpICsgJ3B4KSc7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdGF0aW9uQWRhcHRlciwgU3RhdGlvbiB9IGZyb20gXCIuLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnU3RhdGlvbiBpbXBsZW1lbnRzIFN0YXRpb25BZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUmVjdEVsZW1lbnQpIHtcblxuICAgIH1cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiBuZWVkcyB0byBoYXZlIGEgZGF0YS1zdGF0aW9uIGlkZW50aWZpZXInKTtcbiAgICB9XG4gICAgZ2V0IGJhc2VDb29yZHMoKTogVmVjdG9yIHsgICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihwYXJzZUludCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd4JykgfHwgJycpIHx8IDAsIHBhcnNlSW50KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3knKSB8fCAnJykgfHwgMCk7XG4gICAgfVxuICAgIHNldCBiYXNlQ29vcmRzKGJhc2VDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgYmFzZUNvb3Jkcy54ICsgJycpOyBcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGJhc2VDb29yZHMueSArICcnKTsgXG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnN0YW50KGZyb21PclRvOiBzdHJpbmcpOiBJbnN0YW50IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXT8uc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgaWYgKGFyciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5zdGFudC5mcm9tKGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG4gICAgfVxuXG4gICAgZ2V0IHJvdGF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQuZGlyIHx8ICduJyk7XG4gICAgfVxuICAgIGdldCBsYWJlbERpcigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmxhYmVsRGlyIHx8ICduJyk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzOiAoKSA9PiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhdGlvbi5kcmF3KDAsIGdldFBvc2l0aW9uQm91bmRhcmllcyk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllcyA9IGdldFBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICBjb25zdCBzdG9wRGltZW4gPSBbcG9zaXRpb25Cb3VuZGFyaWVzLnhbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgcG9zaXRpb25Cb3VuZGFyaWVzLnlbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueVswXV07XG4gICAgICAgIFxuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbC5pbmNsdWRlcygnc3RhdGlvbicpKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBzdGF0aW9uICcgKyB0aGlzLmlkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gc3RvcERpbWVuWzBdIDwgMCAmJiBzdG9wRGltZW5bMV0gPCAwID8gJ2hpZGRlbicgOiAndmlzaWJsZSc7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAoTWF0aC5tYXgoc3RvcERpbWVuWzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgKE1hdGgubWF4KHN0b3BEaW1lblsxXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsJ3JvdGF0ZSgnICsgdGhpcy5yb3RhdGlvbi5kZWdyZWVzICsgJykgdHJhbnNsYXRlKCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnhbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcsJyArIChNYXRoLm1pbihwb3NpdGlvbkJvdW5kYXJpZXMueVswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgLSBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiAvIDIpICsgJyknKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtLW9yaWdpbicsIHRoaXMuYmFzZUNvb3Jkcy54ICsgJyAnICsgdGhpcy5iYXNlQ29vcmRzLnkpO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmcm9tOiBWZWN0b3IsIHRvOiBWZWN0b3IsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzdGF0aW9uLm1vdmUoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBmcm9tLCB0bywgY2FsbGJhY2spOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tOiBWZWN0b3IsIHRvOiBWZWN0b3IsIHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHggPCAxKSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VDb29yZHMgPSBmcm9tLmJldHdlZW4odG8sIHgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHggKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxpbmUuYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb20sIHRvLCB4LCBhbmltYXRpb25QZXJGcmFtZSwgY2FsbGJhY2spOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZUNvb3JkcyA9IHRvO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhdGlvbi5lcmFzZSgwKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgVHJhaW5BZGFwdGVyIH0gZnJvbSBcIi4uL1RyYWluXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnVHJhaW4gaW1wbGVtZW50cyBUcmFpbkFkYXB0ZXIge1xuICAgIHN0YXRpYyBXQUdPTl9MRU5HVEggPSAxMDtcbiAgICBzdGF0aWMgVFJBQ0tfT0ZGU0VUID0gMDtcblxuICAgIHByaXZhdGUgX3N0b3BzOiBTdG9wW10gPSBbXTtcbiAgICBib3VuZGluZ0JveCA9IG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdQYXRoRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnRyYWluIHx8ICcnO1xuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0Lmxlbmd0aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGgpO1xuICAgIH1cblxuICAgIGdldCBzdG9wcygpOiBTdG9wW10ge1xuICAgICAgICBpZiAodGhpcy5fc3RvcHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0b3BzPy5zcGxpdCgvXFxzKy8pIHx8IFtdO1xuICAgICAgICAgICAgbGV0IG5leHRTdG9wID0gbmV3IFN0b3AoJycsICcnKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zPy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbnNbaV1bMF0gIT0gJy0nICYmIHRva2Vuc1tpXVswXSAhPSAnKycgJiYgdG9rZW5zW2ldWzBdICE9ICcqJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BzLnB1c2gobmV4dFN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AudHJhY2tJbmZvID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnN0YW50KGZyb21PclRvOiBzdHJpbmcpOiBJbnN0YW50IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXT8uc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgaWYgKGFyciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5zdGFudC5mcm9tKGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgZm9sbG93OiB7IHBhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIgfSk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdHJhaW4gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0cmFpbi5kcmF3KDAsIGFuaW1hdGUsIGZvbGxvdyk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0UGF0aCh0aGlzLmNhbGNUcmFpbkhpbmdlcyh0aGlzLmdldFBhdGhMZW5ndGgoZm9sbG93KS5sZW5ndGhUb1N0YXJ0LCBmb2xsb3cucGF0aCkpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyB0cmFpbic7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmb2xsb3c6IHsgcGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlciB9KSB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFpbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRyYWluLm1vdmUoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBmb2xsb3cpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhdGhMZW5ndGggPSB0aGlzLmdldFBhdGhMZW5ndGgoZm9sbG93KTtcblxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShcbiAgICAgICAgICAgIGZvbGxvdy5wYXRoLFxuICAgICAgICAgICAgcGF0aExlbmd0aC50b3RhbEJvdW5kZWRMZW5ndGgsXG4gICAgICAgICAgICBwYXRoTGVuZ3RoLmxlbmd0aFRvU3RhcnQsXG4gICAgICAgICAgICAoLWRlbGF5U2Vjb25kcykgLyBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsXG4gICAgICAgICAgICBhbmltYXRpb25EdXJhdGlvblNlY29uZHMgKiAxMDAwLFxuICAgICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQYXRoTGVuZ3RoKGZvbGxvdzogeyBwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyIH0pOiB7IGxlbmd0aFRvU3RhcnQ6IG51bWJlciwgdG90YWxCb3VuZGVkTGVuZ3RoOiBudW1iZXIgfSB7XG4gICAgICAgIGxldCBsZW5ndGhUb1N0YXJ0ID0gMDtcbiAgICAgICAgbGV0IHRvdGFsQm91bmRlZExlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9sbG93LnBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gZm9sbG93LnBhdGhbaV0uZGVsdGEoZm9sbG93LnBhdGhbaSArIDFdKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoaSA8IGZvbGxvdy5mcm9tKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoVG9TdGFydCArPSBsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpIDwgZm9sbG93LnRvKSB7XG4gICAgICAgICAgICAgICAgdG90YWxCb3VuZGVkTGVuZ3RoICs9IGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgbGVuZ3RoVG9TdGFydDogbGVuZ3RoVG9TdGFydCwgdG90YWxCb3VuZGVkTGVuZ3RoOiB0b3RhbEJvdW5kZWRMZW5ndGggfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBvc2l0aW9uQnlMZW5ndGgoY3VycmVudDogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSk6IFZlY3RvciB7XG4gICAgICAgIGxldCB0aHJlc2ggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHBhdGhbaV0uZGVsdGEocGF0aFtpICsgMV0pO1xuICAgICAgICAgICAgY29uc3QgbCA9IGRlbHRhLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICh0aHJlc2ggKyBsID49IGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aFtpXS5iZXR3ZWVuKHBhdGhbaSArIDFdLCAoY3VycmVudCAtIHRocmVzaCkgLyBsKS5hZGQoZGVsdGEucm90YXRlKG5ldyBSb3RhdGlvbig5MCkpLndpdGhMZW5ndGgoU3ZnVHJhaW4uVFJBQ0tfT0ZGU0VUKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJlc2ggKz0gbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFpbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRyYWluLmVyYXNlKDApOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0UGF0aChwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBjb25zdCBkID0gJ00nICsgcGF0aC5tYXAodiA9PiB2LnggKyAnLCcgKyB2LnkpLmpvaW4oJyBMJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2QnLCBkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNUcmFpbkhpbmdlcyhmcm9udDogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSk6IFZlY3RvcltdIHtcbiAgICAgICAgY29uc3QgbmV3VHJhaW46IFZlY3RvcltdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGggKyAxOyBpKyspIHtcbiAgICAgICAgICAgIG5ld1RyYWluLnB1c2godGhpcy5nZXRQb3NpdGlvbkJ5TGVuZ3RoKGZyb250IC0gaSAqIFN2Z1RyYWluLldBR09OX0xFTkdUSCwgcGF0aCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdUcmFpbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVhc2UoeDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIC0oTWF0aC5jb3MoTWF0aC5QSSAqIHgpIC0gMSkgLyAyO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lKHBhdGg6IFZlY3RvcltdLCB0b3RhbEJvdW5kZWRMZW5ndGg6IG51bWJlciwgbGVuZ3RoVG9TdGFydDogbnVtYmVyLCBvZmZzZXQ6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25NczogbnVtYmVyLCBzdGFydFRpbWU6IERPTUhpZ2hSZXNUaW1lU3RhbXAsIG5vdzogRE9NSGlnaFJlc1RpbWVTdGFtcCk6IHZvaWQge1xuICAgICAgICBjb25zdCB4ID0gb2Zmc2V0ICsgKG5vdyAtIHN0YXJ0VGltZSkgLyBhbmltYXRpb25EdXJhdGlvbk1zICogKG9mZnNldCArIDEpO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gbGVuZ3RoVG9TdGFydCArIHRoaXMuZWFzZSh4KSAqIHRvdGFsQm91bmRlZExlbmd0aDtcbiAgICAgICAgY29uc3QgdHJhaW5QYXRoID0gdGhpcy5jYWxjVHJhaW5IaW5nZXMoY3VycmVudCwgcGF0aCk7XG4gICAgICAgIHRoaXMuc2V0UGF0aCh0cmFpblBhdGgpO1xuXG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgY29uc3QgdHJhaW4gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAodGltZXN0YW1wKSB7IHRyYWluLmFuaW1hdGVGcmFtZShwYXRoLCB0b3RhbEJvdW5kZWRMZW5ndGgsIGxlbmd0aFRvU3RhcnQsIG9mZnNldCwgYW5pbWF0aW9uRHVyYXRpb25Ncywgc3RhcnRUaW1lLCB0aW1lc3RhbXApOyB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9