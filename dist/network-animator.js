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
        if (!(this.adapter.totalLength > 0)) {
            this.createLine(delay, animate);
        }
        let duration = this.getAnimationDuration(this._path, animate);
        const lineGroup = this.stationProvider.lineGroupById(this.name);
        lineGroup.addLine(this);
        this.adapter.draw(delay, duration, this._path, this.getTotalLength(this._path), lineGroup.strokeColor);
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
    createLine(delay, animate) {
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
            const intermediateDir = fromStop.rotation.nearestRoundedInDirection(deg, fromDir.delta(deg).degrees);
            const intermediateCoord = delta.withLength(delta.length / 2).add(newCoord);
            helpStop = this.stationProvider.createVirtualStop(helpStopId, intermediateCoord, intermediateDir);
        }
        return helpStop;
    }
    getAnimationDuration(path, animate) {
        if (!animate)
            return 0;
        return this.getTotalLength(path) / (this.adapter.speed || Line.SPEED);
    }
    getTotalLength(path) {
        const actualLength = this.adapter.totalLength;
        if (actualLength > 0) {
            return actualLength;
        }
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
    get autoStart() {
        return this.adapter.autoStart;
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
    nearestRoundedInDirection(relativeTo, direction) {
        const ceiledOrFlooredOrientation = relativeTo.round(direction);
        const differenceInOrientation = Math.abs(ceiledOrFlooredOrientation.degrees - this.degrees) % 90;
        return this.add(new Rotation(Math.sign(direction) * differenceInOrientation));
    }
    round(direction) {
        const deg = this.degrees / 45;
        return new Rotation((direction >= 0 ? Math.ceil(deg) : Math.floor(deg)) * 45);
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



let timePassed = 0;
const network = new _Network__WEBPACK_IMPORTED_MODULE_1__["Network"](new _svg_SvgNetwork__WEBPACK_IMPORTED_MODULE_0__["SvgNetwork"]());
const animateFromInstant = getStartInstant();
let started = false;
if (network.autoStart) {
    started = true;
    startTransportNetworkAnimator();
}
document.addEventListener('startTransportNetworkAnimator', function (e) {
    if (started) {
        console.warn('transport-network-animator already started. You should probably set data-auto-start="false". Starting anyways.');
    }
    started = true;
    startTransportNetworkAnimator();
});
function startTransportNetworkAnimator() {
    network.initialize();
    slide(_Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG, false);
}
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
        (_a = document.getElementById('elements')) === null || _a === void 0 ? void 0 : _a.appendChild(lineLabel);
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
    get totalLength() {
        return this.element.getTotalLength();
    }
    get speed() {
        if (this.element.dataset.speed == undefined) {
            return undefined;
        }
        return parseInt(this.element.dataset.speed);
    }
    updateBoundingBox(path) {
        if (path.length == 0) {
            if (this.element.style.visibility == 'visible') {
                const r = this.element.getBBox();
                this.boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_4__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](r.x, r.y), new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](r.x + r.width, r.y + r.height));
                return;
            }
            this.boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_4__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
            return;
        }
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
        this.element.style.visibility = 'visible';
        if (path.length == 0) {
            return;
        }
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
    get autoStart() {
        const svg = document.querySelector('svg');
        return (svg === null || svg === void 0 ? void 0 : svg.dataset.autoStart) != 'false';
    }
    get beckStyle() {
        const svg = document.querySelector('svg');
        return (svg === null || svg === void 0 ? void 0 : svg.dataset.beckStyle) != 'false';
    }
    initialize(network) {
        if (document.getElementById("elements")) {
            console.warn('A group with the id "elements" is missing in the SVG source. It might be needed for helper stations and labels.');
        }
        let elements = document.getElementsByTagName("*");
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
        (_a = document.getElementById('elements')) === null || _a === void 0 ? void 0 : _a.appendChild(helpStop);
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
        const x = (now - startTime) / animationDurationMs + offset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQXJyaXZhbERlcGFydHVyZVRpbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JvdW5kaW5nQm94LnRzIiwid2VicGFjazovLy8uL3NyYy9HZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR3Jhdml0YXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW5zdGFudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9TdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9UcmFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvWm9vbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdMYWJlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdOZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1RyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtR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QUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFLO0lBQ0wsQ0FBQzs7QUFySk0scUJBQVksR0FBRyxFQUFFLENBQUM7QUFDbEIscUJBQVksR0FBRyxDQUFDLENBQUMiLCJmaWxlIjoibmV0d29yay1hbmltYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4udHNcIik7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAgIChmYWN0b3J5KChnbG9iYWwuZm1pbiA9IGdsb2JhbC5mbWluIHx8IHt9KSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgICAvKiogZmluZHMgdGhlIHplcm9zIG9mIGEgZnVuY3Rpb24sIGdpdmVuIHR3byBzdGFydGluZyBwb2ludHMgKHdoaWNoIG11c3RcbiAgICAgKiBoYXZlIG9wcG9zaXRlIHNpZ25zICovXG4gICAgZnVuY3Rpb24gYmlzZWN0KGYsIGEsIGIsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgfHwge307XG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1ldGVycy5tYXhJdGVyYXRpb25zIHx8IDEwMCxcbiAgICAgICAgICAgIHRvbGVyYW5jZSA9IHBhcmFtZXRlcnMudG9sZXJhbmNlIHx8IDFlLTEwLFxuICAgICAgICAgICAgZkEgPSBmKGEpLFxuICAgICAgICAgICAgZkIgPSBmKGIpLFxuICAgICAgICAgICAgZGVsdGEgPSBiIC0gYTtcblxuICAgICAgICBpZiAoZkEgKiBmQiA+IDApIHtcbiAgICAgICAgICAgIHRocm93IFwiSW5pdGlhbCBiaXNlY3QgcG9pbnRzIG11c3QgaGF2ZSBvcHBvc2l0ZSBzaWduc1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZBID09PSAwKSByZXR1cm4gYTtcbiAgICAgICAgaWYgKGZCID09PSAwKSByZXR1cm4gYjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgZGVsdGEgLz0gMjtcbiAgICAgICAgICAgIHZhciBtaWQgPSBhICsgZGVsdGEsXG4gICAgICAgICAgICAgICAgZk1pZCA9IGYobWlkKTtcblxuICAgICAgICAgICAgaWYgKGZNaWQgKiBmQSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYSA9IG1pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChNYXRoLmFicyhkZWx0YSkgPCB0b2xlcmFuY2UpIHx8IChmTWlkID09PSAwKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGEgKyBkZWx0YTtcbiAgICB9XG5cbiAgICAvLyBuZWVkIHNvbWUgYmFzaWMgb3BlcmF0aW9ucyBvbiB2ZWN0b3JzLCByYXRoZXIgdGhhbiBhZGRpbmcgYSBkZXBlbmRlbmN5LFxuICAgIC8vIGp1c3QgZGVmaW5lIGhlcmVcbiAgICBmdW5jdGlvbiB6ZXJvcyh4KSB7IHZhciByID0gbmV3IEFycmF5KHgpOyBmb3IgKHZhciBpID0gMDsgaSA8IHg7ICsraSkgeyByW2ldID0gMDsgfSByZXR1cm4gcjsgfVxuICAgIGZ1bmN0aW9uIHplcm9zTSh4LHkpIHsgcmV0dXJuIHplcm9zKHgpLm1hcChmdW5jdGlvbigpIHsgcmV0dXJuIHplcm9zKHkpOyB9KTsgfVxuXG4gICAgZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgICAgICAgdmFyIHJldCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmV0ICs9IGFbaV0gKiBiW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybTIoYSkgIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkb3QoYSwgYSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlKHJldCwgdmFsdWUsIGMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmV0W2ldID0gdmFsdWVbaV0gKiBjO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2VpZ2h0ZWRTdW0ocmV0LCB3MSwgdjEsIHcyLCB2Mikge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJldC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgcmV0W2pdID0gdzEgKiB2MVtqXSArIHcyICogdjJbal07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogbWluaW1pemVzIGEgZnVuY3Rpb24gdXNpbmcgdGhlIGRvd25oaWxsIHNpbXBsZXggbWV0aG9kICovXG4gICAgZnVuY3Rpb24gbmVsZGVyTWVhZChmLCB4MCwgcGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCB7fTtcblxuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtZXRlcnMubWF4SXRlcmF0aW9ucyB8fCB4MC5sZW5ndGggKiAyMDAsXG4gICAgICAgICAgICBub25aZXJvRGVsdGEgPSBwYXJhbWV0ZXJzLm5vblplcm9EZWx0YSB8fCAxLjA1LFxuICAgICAgICAgICAgemVyb0RlbHRhID0gcGFyYW1ldGVycy56ZXJvRGVsdGEgfHwgMC4wMDEsXG4gICAgICAgICAgICBtaW5FcnJvckRlbHRhID0gcGFyYW1ldGVycy5taW5FcnJvckRlbHRhIHx8IDFlLTYsXG4gICAgICAgICAgICBtaW5Ub2xlcmFuY2UgPSBwYXJhbWV0ZXJzLm1pbkVycm9yRGVsdGEgfHwgMWUtNSxcbiAgICAgICAgICAgIHJobyA9IChwYXJhbWV0ZXJzLnJobyAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMucmhvIDogMSxcbiAgICAgICAgICAgIGNoaSA9IChwYXJhbWV0ZXJzLmNoaSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMuY2hpIDogMixcbiAgICAgICAgICAgIHBzaSA9IChwYXJhbWV0ZXJzLnBzaSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMucHNpIDogLTAuNSxcbiAgICAgICAgICAgIHNpZ21hID0gKHBhcmFtZXRlcnMuc2lnbWEgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnNpZ21hIDogMC41LFxuICAgICAgICAgICAgbWF4RGlmZjtcblxuICAgICAgICAvLyBpbml0aWFsaXplIHNpbXBsZXguXG4gICAgICAgIHZhciBOID0geDAubGVuZ3RoLFxuICAgICAgICAgICAgc2ltcGxleCA9IG5ldyBBcnJheShOICsgMSk7XG4gICAgICAgIHNpbXBsZXhbMF0gPSB4MDtcbiAgICAgICAgc2ltcGxleFswXS5meCA9IGYoeDApO1xuICAgICAgICBzaW1wbGV4WzBdLmlkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IHgwLnNsaWNlKCk7XG4gICAgICAgICAgICBwb2ludFtpXSA9IHBvaW50W2ldID8gcG9pbnRbaV0gKiBub25aZXJvRGVsdGEgOiB6ZXJvRGVsdGE7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0gPSBwb2ludDtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXS5meCA9IGYocG9pbnQpO1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdLmlkID0gaSsxO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlU2ltcGxleCh2YWx1ZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNpbXBsZXhbTl1baV0gPSB2YWx1ZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNpbXBsZXhbTl0uZnggPSB2YWx1ZS5meDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzb3J0T3JkZXIgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLmZ4IC0gYi5meDsgfTtcblxuICAgICAgICB2YXIgY2VudHJvaWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgcmVmbGVjdGVkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIGNvbnRyYWN0ZWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgZXhwYW5kZWQgPSB4MC5zbGljZSgpO1xuXG4gICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IG1heEl0ZXJhdGlvbnM7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICBzaW1wbGV4LnNvcnQoc29ydE9yZGVyKTtcblxuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIC8vIGNvcHkgdGhlIHNpbXBsZXggKHNpbmNlIGxhdGVyIGl0ZXJhdGlvbnMgd2lsbCBtdXRhdGUpIGFuZFxuICAgICAgICAgICAgICAgIC8vIHNvcnQgaXQgdG8gaGF2ZSBhIGNvbnNpc3RlbnQgb3JkZXIgYmV0d2VlbiBpdGVyYXRpb25zXG4gICAgICAgICAgICAgICAgdmFyIHNvcnRlZFNpbXBsZXggPSBzaW1wbGV4Lm1hcChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSB4LnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmZ4ID0geC5meDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaWQgPSB4LmlkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc29ydGVkU2ltcGxleC5zb3J0KGZ1bmN0aW9uKGEsYikgeyByZXR1cm4gYS5pZCAtIGIuaWQ7IH0pO1xuXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5oaXN0b3J5LnB1c2goe3g6IHNpbXBsZXhbMF0uc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IHNpbXBsZXhbMF0uZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZXg6IHNvcnRlZFNpbXBsZXh9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF4RGlmZiA9IDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbWF4RGlmZiA9IE1hdGgubWF4KG1heERpZmYsIE1hdGguYWJzKHNpbXBsZXhbMF1baV0gLSBzaW1wbGV4WzFdW2ldKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoTWF0aC5hYnMoc2ltcGxleFswXS5meCAtIHNpbXBsZXhbTl0uZngpIDwgbWluRXJyb3JEZWx0YSkgJiZcbiAgICAgICAgICAgICAgICAobWF4RGlmZiA8IG1pblRvbGVyYW5jZSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29tcHV0ZSB0aGUgY2VudHJvaWQgb2YgYWxsIGJ1dCB0aGUgd29yc3QgcG9pbnQgaW4gdGhlIHNpbXBsZXhcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgY2VudHJvaWRbaV0gKz0gc2ltcGxleFtqXVtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2VudHJvaWRbaV0gLz0gTjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVmbGVjdCB0aGUgd29yc3QgcG9pbnQgcGFzdCB0aGUgY2VudHJvaWQgIGFuZCBjb21wdXRlIGxvc3MgYXQgcmVmbGVjdGVkXG4gICAgICAgICAgICAvLyBwb2ludFxuICAgICAgICAgICAgdmFyIHdvcnN0ID0gc2ltcGxleFtOXTtcbiAgICAgICAgICAgIHdlaWdodGVkU3VtKHJlZmxlY3RlZCwgMStyaG8sIGNlbnRyb2lkLCAtcmhvLCB3b3JzdCk7XG4gICAgICAgICAgICByZWZsZWN0ZWQuZnggPSBmKHJlZmxlY3RlZCk7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWZsZWN0ZWQgcG9pbnQgaXMgdGhlIGJlc3Qgc2VlbiwgdGhlbiBwb3NzaWJseSBleHBhbmRcbiAgICAgICAgICAgIGlmIChyZWZsZWN0ZWQuZnggPCBzaW1wbGV4WzBdLmZ4KSB7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oZXhwYW5kZWQsIDErY2hpLCBjZW50cm9pZCwgLWNoaSwgd29yc3QpO1xuICAgICAgICAgICAgICAgIGV4cGFuZGVkLmZ4ID0gZihleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgaWYgKGV4cGFuZGVkLmZ4IDwgcmVmbGVjdGVkLmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgoZXhwYW5kZWQpO1xuICAgICAgICAgICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KHJlZmxlY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGUgcmVmbGVjdGVkIHBvaW50IGlzIHdvcnNlIHRoYW4gdGhlIHNlY29uZCB3b3JzdCwgd2UgbmVlZCB0b1xuICAgICAgICAgICAgLy8gY29udHJhY3RcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlZmxlY3RlZC5meCA+PSBzaW1wbGV4W04tMV0uZngpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2hvdWxkUmVkdWNlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVmbGVjdGVkLmZ4ID4gd29yc3QuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYW4gaW5zaWRlIGNvbnRyYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKGNvbnRyYWN0ZWQsIDErcHNpLCBjZW50cm9pZCwgLXBzaSwgd29yc3QpO1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdGVkLmZ4ID0gZihjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyYWN0ZWQuZnggPCB3b3JzdC5meCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFJlZHVjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhbiBvdXRzaWRlIGNvbnRyYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKGNvbnRyYWN0ZWQsIDEtcHNpICogcmhvLCBjZW50cm9pZCwgcHNpKnJobywgd29yc3QpO1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdGVkLmZ4ID0gZihjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyYWN0ZWQuZnggPCByZWZsZWN0ZWQuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRSZWR1Y2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFJlZHVjZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBkb24ndCBjb250cmFjdCBoZXJlLCB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWdtYSA+PSAxKSBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhIHJlZHVjdGlvblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgc2ltcGxleC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oc2ltcGxleFtpXSwgMSAtIHNpZ21hLCBzaW1wbGV4WzBdLCBzaWdtYSwgc2ltcGxleFtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGV4W2ldLmZ4ID0gZihzaW1wbGV4W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChyZWZsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2ltcGxleC5zb3J0KHNvcnRPcmRlcik7XG4gICAgICAgIHJldHVybiB7ZnggOiBzaW1wbGV4WzBdLmZ4LFxuICAgICAgICAgICAgICAgIHggOiBzaW1wbGV4WzBdfTtcbiAgICB9XG5cbiAgICAvLy8gc2VhcmNoZXMgYWxvbmcgbGluZSAncGsnIGZvciBhIHBvaW50IHRoYXQgc2F0aWZpZXMgdGhlIHdvbGZlIGNvbmRpdGlvbnNcbiAgICAvLy8gU2VlICdOdW1lcmljYWwgT3B0aW1pemF0aW9uJyBieSBOb2NlZGFsIGFuZCBXcmlnaHQgcDU5LTYwXG4gICAgLy8vIGYgOiBvYmplY3RpdmUgZnVuY3Rpb25cbiAgICAvLy8gcGsgOiBzZWFyY2ggZGlyZWN0aW9uXG4gICAgLy8vIGN1cnJlbnQ6IG9iamVjdCBjb250YWluaW5nIGN1cnJlbnQgZ3JhZGllbnQvbG9zc1xuICAgIC8vLyBuZXh0OiBvdXRwdXQ6IGNvbnRhaW5zIG5leHQgZ3JhZGllbnQvbG9zc1xuICAgIC8vLyByZXR1cm5zIGE6IHN0ZXAgc2l6ZSB0YWtlblxuICAgIGZ1bmN0aW9uIHdvbGZlTGluZVNlYXJjaChmLCBwaywgY3VycmVudCwgbmV4dCwgYSwgYzEsIGMyKSB7XG4gICAgICAgIHZhciBwaGkwID0gY3VycmVudC5meCwgcGhpUHJpbWUwID0gZG90KGN1cnJlbnQuZnhwcmltZSwgcGspLFxuICAgICAgICAgICAgcGhpID0gcGhpMCwgcGhpX29sZCA9IHBoaTAsXG4gICAgICAgICAgICBwaGlQcmltZSA9IHBoaVByaW1lMCxcbiAgICAgICAgICAgIGEwID0gMDtcblxuICAgICAgICBhID0gYSB8fCAxO1xuICAgICAgICBjMSA9IGMxIHx8IDFlLTY7XG4gICAgICAgIGMyID0gYzIgfHwgMC4xO1xuXG4gICAgICAgIGZ1bmN0aW9uIHpvb20oYV9sbywgYV9oaWdoLCBwaGlfbG8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IDE2OyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGEgPSAoYV9sbyArIGFfaGlnaCkvMjtcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShuZXh0LngsIDEuMCwgY3VycmVudC54LCBhLCBwayk7XG4gICAgICAgICAgICAgICAgcGhpID0gbmV4dC5meCA9IGYobmV4dC54LCBuZXh0LmZ4cHJpbWUpO1xuICAgICAgICAgICAgICAgIHBoaVByaW1lID0gZG90KG5leHQuZnhwcmltZSwgcGspO1xuXG4gICAgICAgICAgICAgICAgaWYgKChwaGkgPiAocGhpMCArIGMxICogYSAqIHBoaVByaW1lMCkpIHx8XG4gICAgICAgICAgICAgICAgICAgIChwaGkgPj0gcGhpX2xvKSkge1xuICAgICAgICAgICAgICAgICAgICBhX2hpZ2ggPSBhO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhwaGlQcmltZSkgPD0gLWMyICogcGhpUHJpbWUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwaGlQcmltZSAqIChhX2hpZ2ggLSBhX2xvKSA+PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFfaGlnaCA9IGFfbG87XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhX2xvID0gYTtcbiAgICAgICAgICAgICAgICAgICAgcGhpX2xvID0gcGhpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCAxMDsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgIHdlaWdodGVkU3VtKG5leHQueCwgMS4wLCBjdXJyZW50LngsIGEsIHBrKTtcbiAgICAgICAgICAgIHBoaSA9IG5leHQuZnggPSBmKG5leHQueCwgbmV4dC5meHByaW1lKTtcbiAgICAgICAgICAgIHBoaVByaW1lID0gZG90KG5leHQuZnhwcmltZSwgcGspO1xuICAgICAgICAgICAgaWYgKChwaGkgPiAocGhpMCArIGMxICogYSAqIHBoaVByaW1lMCkpIHx8XG4gICAgICAgICAgICAgICAgKGl0ZXJhdGlvbiAmJiAocGhpID49IHBoaV9vbGQpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6b29tKGEwLCBhLCBwaGlfb2xkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHBoaVByaW1lKSA8PSAtYzIgKiBwaGlQcmltZTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBoaVByaW1lID49IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb20oYSwgYTAsIHBoaSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBoaV9vbGQgPSBwaGk7XG4gICAgICAgICAgICBhMCA9IGE7XG4gICAgICAgICAgICBhICo9IDI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25qdWdhdGVHcmFkaWVudChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gYWxsb2NhdGUgYWxsIG1lbW9yeSB1cCBmcm9udCBoZXJlLCBrZWVwIG91dCBvZiB0aGUgbG9vcCBmb3IgcGVyZm9tYW5jZVxuICAgICAgICAvLyByZWFzb25zXG4gICAgICAgIHZhciBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBuZXh0ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICB5ayA9IGluaXRpYWwuc2xpY2UoKSxcbiAgICAgICAgICAgIHBrLCB0ZW1wLFxuICAgICAgICAgICAgYSA9IDEsXG4gICAgICAgICAgICBtYXhJdGVyYXRpb25zO1xuXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMjA7XG5cbiAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICBwayA9IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpO1xuICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLC0xKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgYSA9IHdvbGZlTGluZVNlYXJjaChmLCBwaywgY3VycmVudCwgbmV4dCwgYSk7XG5cbiAgICAgICAgICAgIC8vIHRvZG86IGhpc3RvcnkgaW4gd3Jvbmcgc3BvdD9cbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBhfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYSkge1xuICAgICAgICAgICAgICAgIC8vIGZhaWlsZWQgdG8gZmluZCBwb2ludCB0aGF0IHNhdGlmaWVzIHdvbGZlIGNvbmRpdGlvbnMuXG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgZGlyZWN0aW9uIGZvciBuZXh0IGl0ZXJhdGlvblxuICAgICAgICAgICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsIC0xKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZGlyZWN0aW9uIHVzaW5nIFBvbGFr4oCTUmliaWVyZSBDRyBtZXRob2RcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bSh5aywgMSwgbmV4dC5meHByaW1lLCAtMSwgY3VycmVudC5meHByaW1lKTtcblxuICAgICAgICAgICAgICAgIHZhciBkZWx0YV9rID0gZG90KGN1cnJlbnQuZnhwcmltZSwgY3VycmVudC5meHByaW1lKSxcbiAgICAgICAgICAgICAgICAgICAgYmV0YV9rID0gTWF0aC5tYXgoMCwgZG90KHlrLCBuZXh0LmZ4cHJpbWUpIC8gZGVsdGFfayk7XG5cbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShwaywgYmV0YV9rLCBwaywgLTEsIG5leHQuZnhwcmltZSk7XG5cbiAgICAgICAgICAgICAgICB0ZW1wID0gY3VycmVudDtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgICAgICAgICAgICBuZXh0ID0gdGVtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPD0gMWUtNSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogYX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3JhZGllbnREZXNjZW50KGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAxMDAsXG4gICAgICAgICAgICBsZWFyblJhdGUgPSBwYXJhbXMubGVhcm5SYXRlIHx8IDAuMDAxLFxuICAgICAgICAgICAgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9O1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShjdXJyZW50LngsIDEsIGN1cnJlbnQueCwgLWxlYXJuUmF0ZSwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgICAgIGlmIChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDw9IDFlLTUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdyYWRpZW50RGVzY2VudExpbmVTZWFyY2goZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG5leHQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDEwMCxcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHBhcmFtcy5sZWFyblJhdGUgfHwgMSxcbiAgICAgICAgICAgIHBrID0gaW5pdGlhbC5zbGljZSgpLFxuICAgICAgICAgICAgYzEgPSBwYXJhbXMuYzEgfHwgMWUtMyxcbiAgICAgICAgICAgIGMyID0gcGFyYW1zLmMyIHx8IDAuMSxcbiAgICAgICAgICAgIHRlbXAsXG4gICAgICAgICAgICBmdW5jdGlvbkNhbGxzID0gW107XG5cbiAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAvLyB3cmFwIHRoZSBmdW5jdGlvbiBjYWxsIHRvIHRyYWNrIGxpbmVzZWFyY2ggc2FtcGxlc1xuICAgICAgICAgICAgdmFyIGlubmVyID0gZjtcbiAgICAgICAgICAgIGYgPSBmdW5jdGlvbih4LCBmeHByaW1lKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxscy5wdXNoKHguc2xpY2UoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlubmVyKHgsIGZ4cHJpbWUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsIC0xKTtcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHdvbGZlTGluZVNlYXJjaChmLCBwaywgY3VycmVudCwgbmV4dCwgbGVhcm5SYXRlLCBjMSwgYzIpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzOiBmdW5jdGlvbkNhbGxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYXJuUmF0ZTogbGVhcm5SYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBsZWFyblJhdGV9KTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzID0gW107XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgICAgICAgIG5leHQgPSB0ZW1wO1xuXG4gICAgICAgICAgICBpZiAoKGxlYXJuUmF0ZSA9PT0gMCkgfHwgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPCAxZS01KSkgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBleHBvcnRzLmJpc2VjdCA9IGJpc2VjdDtcbiAgICBleHBvcnRzLm5lbGRlck1lYWQgPSBuZWxkZXJNZWFkO1xuICAgIGV4cG9ydHMuY29uanVnYXRlR3JhZGllbnQgPSBjb25qdWdhdGVHcmFkaWVudDtcbiAgICBleHBvcnRzLmdyYWRpZW50RGVzY2VudCA9IGdyYWRpZW50RGVzY2VudDtcbiAgICBleHBvcnRzLmdyYWRpZW50RGVzY2VudExpbmVTZWFyY2ggPSBncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoO1xuICAgIGV4cG9ydHMuemVyb3MgPSB6ZXJvcztcbiAgICBleHBvcnRzLnplcm9zTSA9IHplcm9zTTtcbiAgICBleHBvcnRzLm5vcm0yID0gbm9ybTI7XG4gICAgZXhwb3J0cy53ZWlnaHRlZFN1bSA9IHdlaWdodGVkU3VtO1xuICAgIGV4cG9ydHMuc2NhbGUgPSBzY2FsZTtcblxufSkpOyIsImV4cG9ydCBjbGFzcyBBcnJpdmFsRGVwYXJ0dXJlVGltZSB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZShvZmZzZXQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHNwbGl0ID0gdGhpcy52YWx1ZS5zcGxpdCgvKFstK10pLyk7XG4gICAgICAgIHJldHVybiBwYXJzZUludChzcGxpdFtvZmZzZXRdKSAqIChzcGxpdFtvZmZzZXQtMV0gPT0gJy0nID8gLTEgOiAxKVxuICAgIH1cblxuICAgIGdldCBkZXBhcnR1cmUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2UoMik7XG4gICAgfVxuXG4gICAgZ2V0IGFycml2YWwoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2UoNCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcblxuZXhwb3J0IGNsYXNzIEJvdW5kaW5nQm94IHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGw6IFZlY3RvciwgcHVibGljIGJyOiBWZWN0b3IpIHtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbSh0bF94OiBudW1iZXIsIHRsX3k6IG51bWJlciwgYnJfeDogbnVtYmVyLCBicl95OiBudW1iZXIpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3Rvcih0bF94LCB0bF95KSwgbmV3IFZlY3Rvcihicl94LCBicl95KSk7XG4gICAgfVxuICAgIFxuICAgIGdldCBkaW1lbnNpb25zKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRsLmRlbHRhKHRoaXMuYnIpO1xuICAgIH1cbiAgICBpc051bGwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRsID09IFZlY3Rvci5OVUxMIHx8IHRoaXMuYnIgPT0gVmVjdG9yLk5VTEw7XG4gICAgfVxuICAgIFxuICAgIGNhbGN1bGF0ZUJvdW5kaW5nQm94Rm9yWm9vbShwZXJjZW50WDogbnVtYmVyLCBwZXJjZW50WTogbnVtYmVyKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBiYm94ID0gdGhpcztcbiAgICAgICAgY29uc3QgZGVsdGEgPSBiYm94LmRpbWVuc2lvbnM7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQ2VudGVyID0gbmV3IFZlY3RvcihwZXJjZW50WCAvIDEwMCwgcGVyY2VudFkgLyAxMDApO1xuICAgICAgICBjb25zdCBjZW50ZXIgPSBiYm94LnRsLmFkZChuZXcgVmVjdG9yKGRlbHRhLnggKiByZWxhdGl2ZUNlbnRlci54LCBkZWx0YS55ICogcmVsYXRpdmVDZW50ZXIueSkpO1xuICAgICAgICBjb25zdCBlZGdlRGlzdGFuY2UgPSBuZXcgVmVjdG9yKGRlbHRhLnggKiBNYXRoLm1pbihyZWxhdGl2ZUNlbnRlci54LCAxIC0gcmVsYXRpdmVDZW50ZXIueCksIGRlbHRhLnkgKiBNYXRoLm1pbihyZWxhdGl2ZUNlbnRlci55LCAxIC0gcmVsYXRpdmVDZW50ZXIueSkpO1xuICAgICAgICBjb25zdCByYXRpb1ByZXNlcnZpbmdFZGdlRGlzdGFuY2UgPSBuZXcgVmVjdG9yKGVkZ2VEaXN0YW5jZS55ICogZGVsdGEueCAvIGRlbHRhLnksIGVkZ2VEaXN0YW5jZS54ICogZGVsdGEueSAvIGRlbHRhLngpO1xuICAgICAgICBjb25zdCBtaW5pbWFsRWRnZURpc3RhbmNlID0gbmV3IFZlY3RvcihNYXRoLm1pbihlZGdlRGlzdGFuY2UueCwgcmF0aW9QcmVzZXJ2aW5nRWRnZURpc3RhbmNlLngpLCBNYXRoLm1pbihlZGdlRGlzdGFuY2UueSwgcmF0aW9QcmVzZXJ2aW5nRWRnZURpc3RhbmNlLnkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChjZW50ZXIuYWRkKG5ldyBWZWN0b3IoLW1pbmltYWxFZGdlRGlzdGFuY2UueCwgLW1pbmltYWxFZGdlRGlzdGFuY2UueSkpLCBjZW50ZXIuYWRkKG1pbmltYWxFZGdlRGlzdGFuY2UpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuL1pvb21lclwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveDtcbiAgICB6b29tOiBWZWN0b3I7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIpOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEdlbmVyaWNUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgVGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIExBQkVMX0hFSUdIVCA9IDEyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLm5hbWU7XG4gICAgYm91bmRpbmdCb3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCB6b29tZXIgPSBuZXcgWm9vbWVyKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgICAgICB6b29tZXIuaW5jbHVkZSh0aGlzLmdldFpvb21lZEJvdW5kaW5nQm94KCksIEluc3RhbnQuQklHX0JBTkcsIEluc3RhbnQuQklHX0JBTkcsIHRydWUsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIHRoaXMuYWRhcHRlci5mcm9tLmRlbHRhKHRoaXMuYWRhcHRlci50byksIHpvb21lci5jZW50ZXIsIHpvb21lci5zY2FsZSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFpvb21lZEJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcblxuICAgICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmFkYXB0ZXIuem9vbTtcbiAgICAgICAgaWYgKGNlbnRlciAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgY29uc3Qgem9vbUJib3ggPSBiYm94LmNhbGN1bGF0ZUJvdW5kaW5nQm94Rm9yWm9vbShjZW50ZXIueCwgY2VudGVyLnkpO1xuICAgICAgICAgICAgcmV0dXJuIHpvb21CYm94O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYm94O1xuICAgIH1cblxuICAgIFxufSIsImltcG9ydCB7IFN0YXRpb24sIFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9MaW5lXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5cbi8vY29uc3QgbWF0aGpzID0gcmVxdWlyZSgnbWF0aGpzJyk7XG5jb25zdCBmbWluID0gcmVxdWlyZSgnZm1pbicpO1xuXG5cbmV4cG9ydCBjbGFzcyBHcmF2aXRhdG9yIHtcbiAgICBzdGF0aWMgSU5FUlRORVNTID0gMTAwO1xuICAgIHN0YXRpYyBHUkFESUVOVF9TQ0FMRSA9IDAuMDAwMDAwMDAxO1xuICAgIHN0YXRpYyBERVZJQVRJT05fV0FSTklORyA9IDAuMjtcbiAgICBzdGF0aWMgSU5JVElBTElaRV9SRUxBVElWRV9UT19FVUNMSURJQU5fRElTVEFOQ0UgPSB0cnVlO1xuICAgIHN0YXRpYyBTUEVFRCA9IDI1MDtcbiAgICBzdGF0aWMgTUFYX0FOSU1fRFVSQVRJT04gPSA2O1xuICAgIHN0YXRpYyBDT0xPUl9ERVZJQVRJT04gPSAwLjAyO1xuXG4gICAgcHJpdmF0ZSBpbml0aWFsV2VpZ2h0RmFjdG9yczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICBwcml2YXRlIGluaXRpYWxBbmdsZXM6IHthU3RhdGlvbjogc3RyaW5nLCBjb21tb25TdGF0aW9uOiBzdHJpbmcsIGJTdGF0aW9uOiBzdHJpbmcsIGFuZ2xlOiBudW1iZXJ9W10gPSBbXTtcbiAgICBwcml2YXRlIGFuZ2xlRjogYW55O1xuICAgIHByaXZhdGUgYW5nbGVGUHJpbWU6IHtbaWQ6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICBwcml2YXRlIGF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbzogbnVtYmVyID0gLTE7XG4gICAgcHJpdmF0ZSBlZGdlczoge1tpZDogc3RyaW5nXTogTGluZX0gPSB7fTtcbiAgICBwcml2YXRlIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3IsIHN0YXJ0Q29vcmRzOiBWZWN0b3J9fSA9IHt9O1xuICAgIHByaXZhdGUgZGlydHkgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgZ3Jhdml0YXRlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMuZGlydHkpXG4gICAgICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdyYXBoKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gdGhpcy5taW5pbWl6ZUxvc3MoKTtcbiAgICAgICAgdGhpcy5hc3NlcnREaXN0YW5jZXMoc29sdXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlU3RhdGlvbnNBbmRMaW5lcyhzb2x1dGlvbiwgZGVsYXksIGFuaW1hdGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgY29uc3Qgd2VpZ2h0cyA9IHRoaXMuZ2V0V2VpZ2h0c1N1bSgpO1xuICAgICAgICBjb25zdCBldWNsaWRpYW4gPSB0aGlzLmdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3ZWlnaHRzOicsIHdlaWdodHMsICdldWNsaWRpYW46JywgZXVjbGlkaWFuKTtcbiAgICAgICAgaWYgKHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID09IC0xICYmIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8gPSB3ZWlnaHRzIC8gZXVjbGlkaWFuO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2F2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpb14tMScsIDEvdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8pO1xuXG4gICAgICAgICAgICAvL3RoaXMuaW5pdGlhbGl6ZUFuZ2xlR3JhZGllbnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG4gICAgLypwcml2YXRlIGluaXRpYWxpemVBbmdsZUdyYWRpZW50cygpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9ICcoYWNvcygoKGJfeC1hX3gpKihiX3gtY194KSsoYl95LWFfeSkqKGJfeS1jX3kpKS8oc3FydCgoYl94LWFfeCleMisoYl95LWFfeSleMikqc3FydCgoYl94LWNfeCleMisoYl95LWNfeSleMikpKSooKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKS9hYnMoKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkpLWNvbnN0KSc7XG4gICAgICAgIGNvbnN0IGYgPSBtYXRoanMucGFyc2UoZXhwcmVzc2lvbik7XG4gICAgICAgIHRoaXMuYW5nbGVGID0gZi5jb21waWxlKCk7XG5cbiAgICAgICAgY29uc3QgZkRlbHRhID0gbWF0aGpzLnBhcnNlKGV4cHJlc3Npb24gKyAnXjInKTtcblxuICAgICAgICBjb25zdCB2YXJzID0gWydhX3gnLCAnYV95JywgJ2JfeCcsICdiX3knLCAnY194JywgJ2NfeSddO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dmFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hbmdsZUZQcmltZVt2YXJzW2ldXSA9IG1hdGhqcy5kZXJpdmF0aXZlKGZEZWx0YSwgdmFyc1tpXSkuY29tcGlsZSgpO1xuICAgICAgICB9XG4gICAgfSovXG5cbiAgICBwcml2YXRlIGdldFdlaWdodHNTdW0oKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IGVkZ2Uud2VpZ2h0IHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIHN1bSArPSB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlZGdlVmVjdG9yKGVkZ2U6IExpbmUpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEodGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUdyYXBoKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSA9IEdyYXZpdGF0b3IuSU5JVElBTElaRV9SRUxBVElWRV9UT19FVUNMSURJQU5fRElTVEFOQ0VcbiAgICAgICAgICAgICAgICAgICAgPyAxIC8gdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW9cbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoIC8gKGVkZ2Uud2VpZ2h0IHx8IDApO1xuICAgICAgICAgICAgICAgIC8vdGhpcy5hZGRJbml0aWFsQW5nbGVzKGVkZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgdmVydGV4LmluZGV4ID0gbmV3IFZlY3RvcihpLCBpKzEpO1xuICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRJbml0aWFsQW5nbGVzKGVkZ2U6IExpbmUpIHtcbiAgICAgICAgZm9yIChjb25zdCBhZGphY2VudCBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBpZiAoYWRqYWNlbnQgPT0gZWRnZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPDI7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajwyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2UudGVybWluaVtpXS5zdGF0aW9uSWQgPT0gYWRqYWNlbnQudGVybWluaVtqXS5zdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy50aHJlZURvdEFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pW2leMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1thZGphY2VudC50ZXJtaW5pW2peMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxBbmdsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVN0YXRpb246IGVkZ2UudGVybWluaVtpXjFdLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb25TdGF0aW9uOiBlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJTdGF0aW9uOiBhZGphY2VudC50ZXJtaW5pW2peMV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBhbmdsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9kZXJpdmUgYXJjY29zKCgoYS1jKSooZS1nKSsoYi1kKSooZi1oKSkvKHNxcnQoKGEtYyleMisoYi1kKV4yKSpzcXJ0KChlLWcpXjIrKGYtaCleMikpKSooKGYtaCkqKGEtYyktKGItZCkqKGUtZykpL3woKGYtaCkqKGEtYyktKGItZCkqKGUtZykpfFxuICAgICAgICAvL2Rlcml2ZSBhY29zKCgoYl94LWFfeCkqKGJfeC1jX3gpKyhiX3ktYV95KSooYl95LWNfeSkpLyhzcXJ0KChiX3gtYV94KV4yKyhiX3ktYV95KV4yKSpzcXJ0KChiX3gtY194KV4yKyhiX3ktY195KV4yKSkpKigoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpL2FicygoKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKSlcbiAgICB9XG5cbiAgICBwcml2YXRlIHRocmVlRG90QW5nbGUoYTogVmVjdG9yLCBiOiBWZWN0b3IsIGM6IFZlY3Rvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUYsIGEsIGIsIGMsIDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKGY6IGFueSwgYTogVmVjdG9yLCBiOiBWZWN0b3IsIGM6IFZlY3Rvciwgb2xkVmFsdWU6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gZi5ldmFsdWF0ZSh7YV94OiBhLngsIGFfeTogYS55LCBiX3g6IGIueCwgYl95OiBiLnksIGNfeDogYy54LCBjX3k6IGMueSwgY29uc3Q6IG9sZFZhbHVlfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtaW5pbWl6ZUxvc3MoKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCBncmF2aXRhdG9yID0gdGhpcztcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge2hpc3Rvcnk6IFtdfTtcbiAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlcltdID0gdGhpcy5zdGFydFN0YXRpb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSBmbWluLmNvbmp1Z2F0ZUdyYWRpZW50KChBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10pID0+IHtcbiAgICAgICAgICAgIGZ4cHJpbWUgPSBmeHByaW1lIHx8IEEuc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTxmeHByaW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZnhwcmltZVtpXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZnggPSAwO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb0N1cnJlbnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgLy9meCA9IHRoaXMuZGVsdGFUb0FuZ2xlc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5kZWx0YVRvTmV3RGlzdGFuY2VzVG9FbnN1cmVBY2N1cmFjeShmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICB0aGlzLnNjYWxlR3JhZGllbnRUb0Vuc3VyZVdvcmtpbmdTdGVwU2l6ZShmeHByaW1lKTtcbiAgICAgICAgICAgIHJldHVybiBmeDtcbiAgICAgICAgfSwgc3RhcnQsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiBzb2x1dGlvbi54O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRTdGF0aW9uUG9zaXRpb25zKCk6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHN0YXJ0W3ZlcnRleC5pbmRleC54XSA9IHZlcnRleC5zdGFydENvb3Jkcy54O1xuICAgICAgICAgICAgc3RhcnRbdmVydGV4LmluZGV4LnldID0gdmVydGV4LnN0YXJ0Q29vcmRzLnk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXJ0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFYKEE6IG51bWJlcltdLCB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yfX0sIHRlcm1pbmk6IFN0b3BbXSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBBW3ZlcnRpY2VzW3Rlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC54XSAtIEFbdmVydGljZXNbdGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFZKEE6IG51bWJlcltdLCB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yfX0sIHRlcm1pbmk6IFN0b3BbXSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBBW3ZlcnRpY2VzW3Rlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC55XSAtIEFbdmVydGljZXNbdGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnldO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb1N0YXJ0U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXMoZ3Jhdml0YXRvci52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIGZ4ICs9IChcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXJ0Q29vcmRzLngsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXJ0Q29vcmRzLnksIDIpXG4gICAgICAgICAgICAgICAgKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueF0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhcnRDb29yZHMueCkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnldICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXJ0Q29vcmRzLnkpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb0N1cnJlbnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgZnggKz0gKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLngsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy55LCAyKVxuICAgICAgICAgICAgICAgICkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnhdICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy54KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueV0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLnkpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb0FuZ2xlc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IuaW5pdGlhbEFuZ2xlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnldKTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC55XSk7XG4gICAgICAgICAgICBjb25zdCBjID0gbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC55XSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUYsIGEsIGIsIGMsIHBhaXIuYW5nbGUpO1xuICAgICAgICAgICAgZnggKz0gTWF0aC5wb3coZGVsdGEsIDIpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG5cbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC54XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydhX3gnXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC55XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydhX3knXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnhdICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2JfeCddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYl95J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueF0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnY194J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnY195J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb05ld0Rpc3RhbmNlc1RvRW5zdXJlQWNjdXJhY3koZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyhncmF2aXRhdG9yLmVkZ2VzKSkgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHYgPSBNYXRoLnBvdyh0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyBNYXRoLnBvdyh0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLSBNYXRoLnBvdyhncmF2aXRhdG9yLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gKiAoZWRnZS53ZWlnaHQgfHwgMCksIDIpO1xuICAgICAgICAgICAgZnggKz0gTWF0aC5wb3codiwgMik7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueF0gKz0gKzQgKiB2ICogdGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC55XSArPSArNCAqIHYgKiB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnhdICs9IC00ICogdiAqIHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueV0gKz0gLTQgKiB2ICogdGhpcy5kZWx0YVkoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY2FsZUdyYWRpZW50VG9FbnN1cmVXb3JraW5nU3RlcFNpemUoZnhwcmltZTogbnVtYmVyW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZ4cHJpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZ4cHJpbWVbaV0gKj0gR3Jhdml0YXRvci5HUkFESUVOVF9TQ0FMRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0RGlzdGFuY2VzKHNvbHV0aW9uOiBudW1iZXJbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBkZXZpYXRpb24gPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVgoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyh0aGlzLmRlbHRhWShzb2x1dGlvbiwgdGhpcy52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICkgLyAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApKSAtIDE7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGV2aWF0aW9uKSA+IEdyYXZpdGF0b3IuREVWSUFUSU9OX1dBUk5JTkcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZWRnZS5uYW1lLCAnZGl2ZXJnZXMgYnkgJywgZGV2aWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICBwcml2YXRlIG1vdmVTdGF0aW9uc0FuZExpbmVzKHNvbHV0aW9uOiBudW1iZXJbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9IGFuaW1hdGUgPyBNYXRoLm1pbihHcmF2aXRhdG9yLk1BWF9BTklNX0RVUkFUSU9OLCB0aGlzLmdldFRvdGFsRGlzdGFuY2VUb01vdmUoc29sdXRpb24pIC8gR3Jhdml0YXRvci5TUEVFRCkgOiAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXguc3RhdGlvbi5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIG5ldyBWZWN0b3Ioc29sdXRpb25bdmVydGV4LmluZGV4LnhdLCBzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueV0pKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgY29uc3QgY29vcmRzID0gW3RoaXMuZ2V0TmV3U3RhdGlvblBvc2l0aW9uKGVkZ2UudGVybWluaVswXS5zdGF0aW9uSWQsIHNvbHV0aW9uKSwgdGhpcy5nZXROZXdTdGF0aW9uUG9zaXRpb24oZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZCwgc29sdXRpb24pXTtcbiAgICAgICAgICAgIGVkZ2UubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBjb29yZHMsIHRoaXMuZ2V0Q29sb3JCeURldmlhdGlvbihlZGdlLCBlZGdlLndlaWdodCB8fCAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgKz0gYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb2xvckJ5RGV2aWF0aW9uKGVkZ2U6IExpbmUsIHdlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxEaXN0ID0gdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5zdGFydENvb3Jkcy5kZWx0YSh0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLnN0YXJ0Q29vcmRzKS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgKHdlaWdodCAtIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvICogaW5pdGlhbERpc3QpICogR3Jhdml0YXRvci5DT0xPUl9ERVZJQVRJT04pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRvdGFsRGlzdGFuY2VUb01vdmUoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gbmV3IFZlY3Rvcihzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueF0sIHNvbHV0aW9uW3ZlcnRleC5pbmRleC55XSkuZGVsdGEodmVydGV4LnN0YXRpb24uYmFzZUNvb3JkcykubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXdTdGF0aW9uUG9zaXRpb24oc3RhdGlvbklkOiBzdHJpbmcsIHNvbHV0aW9uOiBudW1iZXJbXSk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC54XSwgc29sdXRpb25bdGhpcy52ZXJ0aWNlc1tzdGF0aW9uSWRdLmluZGV4LnldKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFZlcnRleCh2ZXJ0ZXhJZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh2ZXJ0ZXhJZCk7XG4gICAgICAgICAgICBpZiAoc3RhdGlvbiA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHZlcnRleElkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHRoaXMudmVydGljZXNbdmVydGV4SWRdID0ge3N0YXRpb246IHN0YXRpb24sIGluZGV4OiBWZWN0b3IuTlVMTCwgc3RhcnRDb29yZHM6IHN0YXRpb24uYmFzZUNvb3Jkc307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRFZGdlKGxpbmU6IExpbmUpIHtcbiAgICAgICAgaWYgKGxpbmUud2VpZ2h0ID09IHVuZGVmaW5lZCkgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0SWRlbnRpZmllcihsaW5lKTtcbiAgICAgICAgdGhpcy5lZGdlc1tpZF0gPSBsaW5lO1xuICAgICAgICB0aGlzLmFkZFZlcnRleChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkKTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZGVudGlmaWVyKGxpbmU6IExpbmUpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmFscGhhYmV0aWNJZChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBsaW5lLnRlcm1pbmlbMV0uc3RhdGlvbklkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5zdGFudCB7XG4gICAgc3RhdGljIEJJR19CQU5HOiBJbnN0YW50ID0gbmV3IEluc3RhbnQoMCwgMCwgJycpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Vwb2NoOiBudW1iZXIsIHByaXZhdGUgX3NlY29uZDogbnVtYmVyLCBwcml2YXRlIF9mbGFnOiBzdHJpbmcpIHtcblxuICAgIH1cbiAgICBnZXQgZXBvY2goKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vwb2NoO1xuICAgIH1cbiAgICBnZXQgc2Vjb25kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWNvbmQ7XG4gICAgfVxuICAgIGdldCBmbGFnKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFnO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGFycmF5OiBzdHJpbmdbXSk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQocGFyc2VJbnQoYXJyYXlbMF0pLCBwYXJzZUludChhcnJheVsxXSksIGFycmF5WzJdID8/ICcnKVxuICAgIH1cblxuICAgIGVxdWFscyh0aGF0OiBJbnN0YW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2ggJiYgdGhpcy5zZWNvbmQgPT0gdGhhdC5zZWNvbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kIC0gdGhpcy5zZWNvbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExhYmVsQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBmb3JTdGF0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZm9yTGluZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveDtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbiwgY2hpbGRyZW46IExhYmVsQWRhcHRlcltdKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyO1xufVxuXG5leHBvcnQgY2xhc3MgTGFiZWwgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTEFCRUxfSEVJR0hUID0gMTI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IExhYmVsQWRhcHRlciwgcHJpdmF0ZSBzdGF0aW9uUHJvdmlkZXI6IFN0YXRpb25Qcm92aWRlcikge1xuXG4gICAgfVxuXG4gICAgZnJvbSA9IHRoaXMuYWRhcHRlci5mcm9tO1xuICAgIHRvID0gdGhpcy5hZGFwdGVyLnRvO1xuICAgIGJvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuICAgIGNoaWxkcmVuOiBMYWJlbFtdID0gW107XG5cbiAgICBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gfHwgdGhpcy5hZGFwdGVyLmZvckxpbmUgfHwgJyc7XG4gICAgfVxuICAgIFxuICAgIGdldCBmb3JTdGF0aW9uKCk6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBzID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQodGhpcy5hZGFwdGVyLmZvclN0YXRpb24gfHwgJycpO1xuICAgICAgICBpZiAocyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyB0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXMuZm9yU3RhdGlvbjtcbiAgICAgICAgICAgIHN0YXRpb24uYWRkTGFiZWwodGhpcyk7XG4gICAgICAgICAgICBpZiAoc3RhdGlvbi5saW5lc0V4aXN0aW5nKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGb3JTdGF0aW9uKGRlbGF5LCBzdGF0aW9uLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hZGFwdGVyLmZvckxpbmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXJtaW5pID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLmFkYXB0ZXIuZm9yTGluZSkudGVybWluaTtcbiAgICAgICAgICAgIHRlcm1pbmkuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQodC5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIGlmIChzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcy5sYWJlbHMuZm9yRWFjaChsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsLmhhc0NoaWxkcmVuKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbC5jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwuZHJhdyhkZWxheSwgYW5pbWF0ZSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3TGFiZWxGb3JTdGF0aW9uID0gbmV3IExhYmVsKHRoaXMuYWRhcHRlci5jbG9uZUZvclN0YXRpb24ocy5pZCksIHRoaXMuc3RhdGlvblByb3ZpZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xhYmVsRm9yU3RhdGlvbi5jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5hZGRMYWJlbChuZXdMYWJlbEZvclN0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGFiZWxGb3JTdGF0aW9uLmRyYXcoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKG5ld0xhYmVsRm9yU3RhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIFZlY3Rvci5OVUxMLCBSb3RhdGlvbi5mcm9tKCduJyksIFtdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdGb3JTdGF0aW9uKGRlbGF5U2Vjb25kczogbnVtYmVyLCBzdGF0aW9uOiBTdGF0aW9uLCBmb3JMaW5lOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgbGV0IHlPZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8c3RhdGlvbi5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBzdGF0aW9uLmxhYmVsc1tpXTtcbiAgICAgICAgICAgIGlmIChsID09IHRoaXMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB5T2Zmc2V0ICs9IExhYmVsLkxBQkVMX0hFSUdIVCoxLjU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFiZWxEaXIgPSBzdGF0aW9uLmxhYmVsRGlyO1xuXG4gICAgICAgIHlPZmZzZXQgPSBNYXRoLnNpZ24oVmVjdG9yLlVOSVQucm90YXRlKGxhYmVsRGlyKS55KSp5T2Zmc2V0IC0gKHlPZmZzZXQ+MCA/IDIgOiAwKTsgLy9UT0RPIG1hZ2ljIG51bWJlcnNcbiAgICAgICAgY29uc3Qgc3RhdGlvbkRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGRpZmZEaXIgPSBsYWJlbERpci5hZGQobmV3IFJvdGF0aW9uKC1zdGF0aW9uRGlyLmRlZ3JlZXMpKTtcbiAgICAgICAgY29uc3QgdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZGlmZkRpcik7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IG5ldyBWZWN0b3Ioc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3gnLCB1bml0di54KSwgc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3knLCB1bml0di55KSk7XG4gICAgICAgIGNvbnN0IHRleHRDb29yZHMgPSBiYXNlQ29vcmQuYWRkKGFuY2hvci5yb3RhdGUoc3RhdGlvbkRpcikpLmFkZChuZXcgVmVjdG9yKDAsIHlPZmZzZXQpKTtcbiAgICBcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXlTZWNvbmRzLCB0ZXh0Q29vcmRzLCBsYWJlbERpciwgdGhpcy5jaGlsZHJlbi5tYXAoYyA9PiBjLmFkYXB0ZXIpKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5mb3JTdGF0aW9uLnJlbW92ZUxhYmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFkYXB0ZXIuZm9yTGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBjLmVyYXNlKGRlbGF5LCBhbmltYXRlLCByZXZlcnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgU3RhdGlvbiwgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuaW1wb3J0IHsgUHJlZmVycmVkVHJhY2sgfSBmcm9tIFwiLi9QcmVmZXJyZWRUcmFja1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmVBZGFwdGVyIGV4dGVuZHMgVGltZWQgIHtcbiAgICBzdG9wczogU3RvcFtdO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBib3VuZGluZ0JveDogQm91bmRpbmdCb3g7XG4gICAgd2VpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgdG90YWxMZW5ndGg6IG51bWJlcjtcbiAgICBzcGVlZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSwgbGVuZ3RoOiBudW1iZXIsIGNvbG9yRGV2aWF0aW9uOiBudW1iZXIpOiB2b2lkO1xuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCBjb2xvckZyb206IG51bWJlciwgY29sb3JUbzogbnVtYmVyKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4sIGxlbmd0aDogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIExpbmUgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTk9ERV9ESVNUQU5DRSA9IDA7XG4gICAgc3RhdGljIFNQRUVEID0gMTAwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBMaW5lQWRhcHRlciwgcHJpdmF0ZSBzdGF0aW9uUHJvdmlkZXI6IFN0YXRpb25Qcm92aWRlciwgcHJpdmF0ZSBiZWNrU3R5bGU6IGJvb2xlYW4gPSB0cnVlKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIGJvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuICAgIHdlaWdodCA9IHRoaXMuYWRhcHRlci53ZWlnaHQ7XG4gICAgXG4gICAgcHJpdmF0ZSBwcmVjZWRpbmdTdG9wOiBTdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgcHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIF9wYXRoOiBWZWN0b3JbXSA9IFtdO1xuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCEodGhpcy5hZGFwdGVyLnRvdGFsTGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGluZShkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBsZXQgZHVyYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHRoaXMuX3BhdGgsIGFuaW1hdGUpO1xuICAgICAgICBjb25zdCBsaW5lR3JvdXAgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSk7XG4gICAgICAgIGxpbmVHcm91cC5hZGRMaW5lKHRoaXMpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgZHVyYXRpb24sIHRoaXMuX3BhdGgsIHRoaXMuZ2V0VG90YWxMZW5ndGgodGhpcy5fcGF0aCksIGxpbmVHcm91cC5zdHJva2VDb2xvcik7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSwgY29sb3JEZXZpYXRpb246IG51bWJlcikge1xuICAgICAgICBsZXQgb2xkUGF0aCA9IHRoaXMuX3BhdGg7XG4gICAgICAgIGlmIChvbGRQYXRoLmxlbmd0aCA8IDIgfHwgcGF0aC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RyeWluZyB0byBtb3ZlIGEgbm9uIGV4aXN0aW5nIGxpbmUnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkUGF0aC5sZW5ndGggIT0gcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIG9sZFBhdGggPSBbb2xkUGF0aFswXSwgb2xkUGF0aFtvbGRQYXRoLmxlbmd0aC0xXV07XG4gICAgICAgICAgICBwYXRoID0gW3BhdGhbMF0sIHBhdGhbcGF0aC5sZW5ndGgtMV1dO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpbmVHcm91cCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5fcGF0aCwgcGF0aCwgbGluZUdyb3VwLnN0cm9rZUNvbG9yLCBjb2xvckRldmlhdGlvbik7XG4gICAgICAgIGxpbmVHcm91cC5zdHJva2VDb2xvciA9IGNvbG9yRGV2aWF0aW9uO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLl9wYXRoLCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSwgZHVyYXRpb24sIHJldmVyc2UsIHRoaXMuZ2V0VG90YWxMZW5ndGgodGhpcy5fcGF0aCkpO1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPHN0b3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5uYW1lICsgJzogU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgc3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgc3RvcC5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wSWQgPSAnaF8nICsgVXRpbHMuYWxwaGFiZXRpY0lkKHN0b3BzW2otMV0uc3RhdGlvbklkLCBzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIGxldCBoZWxwU3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGhlbHBTdG9wSWQpO1xuICAgICAgICAgICAgICAgIGlmIChoZWxwU3RvcCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVscFN0b3AucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTGluZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5fcGF0aDtcblxuICAgICAgICBsZXQgdHJhY2sgPSBuZXcgUHJlZmVycmVkVHJhY2soJysnKTtcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPHN0b3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0cmFjayA9IHRyYWNrLmZyb21TdHJpbmcoc3RvcHNbal0udHJhY2tJbmZvKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLm5hbWUgKyAnOiBTdGF0aW9uIHdpdGggSUQgJyArIHN0b3BzW2pdLnN0YXRpb25JZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICBpZiAocGF0aC5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICB0cmFjayA9IHRyYWNrLmZyb21FeGlzdGluZ0xpbmVBdFN0YXRpb24oc3RvcC5heGlzQW5kVHJhY2tGb3JFeGlzdGluZ0xpbmUodGhpcy5uYW1lKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN0b3BzW2pdLmNvb3JkID0gdGhpcy5jcmVhdGVDb25uZWN0aW9uKHN0b3AsIHRoaXMubmV4dFN0b3BCYXNlQ29vcmQoc3RvcHMsIGosIHN0b3AuYmFzZUNvb3JkcyksIHRyYWNrLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgdHJ1ZSk7XG4gICAgICAgICAgICB0cmFjayA9IHRyYWNrLmtlZXBPbmx5U2lnbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0U3RvcEJhc2VDb29yZChzdG9wczogU3RvcFtdLCBjdXJyZW50U3RvcEluZGV4OiBudW1iZXIsIGRlZmF1bHRDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICBpZiAoY3VycmVudFN0b3BJbmRleCsxIDwgc3RvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHN0b3BzW2N1cnJlbnRTdG9wSW5kZXgrMV0uc3RhdGlvbklkO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5uYW1lICsgJzogU3RhdGlvbiB3aXRoIElEICcgKyBpZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gc3RvcC5iYXNlQ29vcmRzOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0Q29vcmRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCB0cmFjazogUHJlZmVycmVkVHJhY2ssIHBhdGg6IFZlY3RvcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZWN1cnNlOiBib29sZWFuKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgZGlyID0gc3RhdGlvbi5yb3RhdGlvbjtcbiAgICAgICAgY29uc3QgYmFzZUNvb3JkID0gc3RhdGlvbi5iYXNlQ29vcmRzO1xuICAgICAgICBjb25zdCBuZXdEaXIgPSB0aGlzLmdldFN0b3BPcmllbnRhdGlvbkJhc2VkT25UaHJlZVN0b3BzKHN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkLCBkaXIsIHBhdGgpO1xuICAgICAgICBjb25zdCBuZXdQb3MgPSBzdGF0aW9uLmFzc2lnblRyYWNrKG5ld0Rpci5pc1ZlcnRpY2FsKCkgPyAneCcgOiAneScsIHRyYWNrLCB0aGlzKTtcblxuICAgICAgICBjb25zdCBuZXdDb29yZCA9IHN0YXRpb24ucm90YXRlZFRyYWNrQ29vcmRpbmF0ZXMobmV3RGlyLCBuZXdQb3MpO1xuICAgIFxuICAgICAgICBpZiAocGF0aC5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBwYXRoW3BhdGgubGVuZ3RoLTFdO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSB0aGlzLmdldFByZWNlZGluZ0Rpcih0aGlzLnByZWNlZGluZ0RpciwgdGhpcy5wcmVjZWRpbmdTdG9wLCBvbGRDb29yZCwgbmV3Q29vcmQpO1xuICAgIFxuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbkRpciA9IG5ld0Rpci5hZGQoZGlyKTtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gdGhpcy5pbnNlcnROb2RlKG9sZENvb3JkLCB0aGlzLnByZWNlZGluZ0RpciwgbmV3Q29vcmQsIHN0YXRpb25EaXIsIHBhdGgpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFmb3VuZCAmJiByZWN1cnNlICYmIHRoaXMucHJlY2VkaW5nU3RvcCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWxwU3RvcCA9IHRoaXMuZ2V0T3JDcmVhdGVIZWxwZXJTdG9wKHRoaXMucHJlY2VkaW5nRGlyLCB0aGlzLnByZWNlZGluZ1N0b3AsIHN0YXRpb24pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gdGhpcy5wcmVjZWRpbmdEaXIuYWRkKG5ldyBSb3RhdGlvbigxODApKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oaGVscFN0b3AsIGJhc2VDb29yZCwgdHJhY2sua2VlcE9ubHlTaWduKCksIHBhdGgsIGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybigncGF0aCB0byBmaXggb24gbGluZScsIHRoaXMuYWRhcHRlci5uYW1lLCAnYXQgc3RhdGlvbicsIHN0YXRpb24uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSBzdGF0aW9uRGlyO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpb24uYWRkTGluZSh0aGlzLCBuZXdEaXIuaXNWZXJ0aWNhbCgpID8gJ3gnIDogJ3knLCBuZXdQb3MpO1xuICAgICAgICBwYXRoLnB1c2gobmV3Q29vcmQpO1xuXG4gICAgICAgIGRlbGF5ID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKSArIGRlbGF5O1xuICAgICAgICBzdGF0aW9uLmRyYXcoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLnByZWNlZGluZ1N0b3AgPSBzdGF0aW9uO1xuICAgICAgICByZXR1cm4gbmV3Q29vcmQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCBkaXI6IFJvdGF0aW9uLCBwYXRoOiBWZWN0b3JbXSk6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RvcEJhc2VDb29yZC5kZWx0YShvbGRDb29yZCkuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsdGEgPSBzdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEobmV4dFN0b3BCYXNlQ29vcmQpO1xuICAgICAgICBjb25zdCBleGlzdGluZ0F4aXMgPSBzdGF0aW9uLmF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpPy5heGlzO1xuICAgICAgICBpZiAoZXhpc3RpbmdBeGlzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdTdG9wT3JpZW50aWF0aW9uID0gZGVsdGEuaW5jbGluYXRpb24oKS5oYWxmRGlyZWN0aW9uKGRpciwgZXhpc3RpbmdBeGlzID09ICd4JyA/IG5ldyBSb3RhdGlvbig5MCkgOiBuZXcgUm90YXRpb24oMCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlY2VkaW5nRGlyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gZXhpc3RpbmdTdG9wT3JpZW50aWF0aW9uLmFkZChkaXIpLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdTdG9wT3JpZW50aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWx0YS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24oZGlyKTtcbiAgICB9XG4gICAgXG5cbiAgICBwcml2YXRlIGdldFByZWNlZGluZ0RpcihwcmVjZWRpbmdEaXI6IFJvdGF0aW9uIHwgdW5kZWZpbmVkLCBwcmVjZWRpbmdTdG9wOiBTdGF0aW9uIHwgdW5kZWZpbmVkLCBvbGRDb29yZDogVmVjdG9yLCBuZXdDb29yZDogVmVjdG9yKTogUm90YXRpb24ge1xuICAgICAgICBpZiAocHJlY2VkaW5nRGlyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgcHJlY2VkaW5nU3RvcFJvdGF0aW9uID0gcHJlY2VkaW5nU3RvcD8ucm90YXRpb24gPz8gbmV3IFJvdGF0aW9uKDApO1xuICAgICAgICAgICAgcHJlY2VkaW5nRGlyID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihwcmVjZWRpbmdTdG9wUm90YXRpb24pLmFkZChwcmVjZWRpbmdTdG9wUm90YXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJlY2VkaW5nRGlyID0gcHJlY2VkaW5nRGlyLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZWNlZGluZ0RpcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluc2VydE5vZGUoZnJvbUNvb3JkOiBWZWN0b3IsIGZyb21EaXI6IFJvdGF0aW9uLCB0b0Nvb3JkOiBWZWN0b3IsIHRvRGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmJlY2tTdHlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsdGE6IFZlY3RvciA9IGZyb21Db29yZC5kZWx0YSh0b0Nvb3JkKTtcbiAgICAgICAgY29uc3Qgb2xkRGlyViA9IFZlY3Rvci5VTklULnJvdGF0ZShmcm9tRGlyKTtcbiAgICAgICAgY29uc3QgbmV3RGlyViA9IFZlY3Rvci5VTklULnJvdGF0ZSh0b0Rpcik7XG4gICAgICAgIGlmIChkZWx0YS5pc0RlbHRhTWF0Y2hpbmdQYXJhbGxlbChvbGREaXJWLCBuZXdEaXJWKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSBkZWx0YS5zb2x2ZURlbHRhRm9ySW50ZXJzZWN0aW9uKG9sZERpclYsIG5ld0RpclYpXG4gICAgICAgIGlmIChzb2x1dGlvbi5hID4gTGluZS5OT0RFX0RJU1RBTkNFICYmIHNvbHV0aW9uLmIgPiBMaW5lLk5PREVfRElTVEFOQ0UpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChuZXcgVmVjdG9yKGZyb21Db29yZC54K29sZERpclYueCpzb2x1dGlvbi5hLCBmcm9tQ29vcmQueStvbGREaXJWLnkqc29sdXRpb24uYSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3JDcmVhdGVIZWxwZXJTdG9wKGZyb21EaXI6IFJvdGF0aW9uLCBmcm9tU3RvcDogU3RhdGlvbiwgdG9TdG9wOiBTdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGhlbHBTdG9wSWQgPSAnaF8nICsgVXRpbHMuYWxwaGFiZXRpY0lkKGZyb21TdG9wLmlkLCB0b1N0b3AuaWQpO1xuICAgICAgICBsZXQgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChoZWxwU3RvcElkKTtcbiAgICAgICAgaWYgKGhlbHBTdG9wID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NyZWF0aW5nJywgaGVscFN0b3BJZCk7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IGZyb21TdG9wLmJhc2VDb29yZHM7XG4gICAgICAgICAgICBjb25zdCBuZXdDb29yZCA9IHRvU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBuZXdDb29yZC5kZWx0YShvbGRDb29yZCk7XG4gICAgICAgICAgICBjb25zdCBkZWcgPSBvbGRDb29yZC5kZWx0YShuZXdDb29yZCkuaW5jbGluYXRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZURpciA9IGZyb21TdG9wLnJvdGF0aW9uLm5lYXJlc3RSb3VuZGVkSW5EaXJlY3Rpb24oZGVnLCBmcm9tRGlyLmRlbHRhKGRlZykuZGVncmVlcyk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVDb29yZCA9IGRlbHRhLndpdGhMZW5ndGgoZGVsdGEubGVuZ3RoLzIpLmFkZChuZXdDb29yZCk7XG5cbiAgICAgICAgICAgIGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuY3JlYXRlVmlydHVhbFN0b3AoaGVscFN0b3BJZCwgaW50ZXJtZWRpYXRlQ29vcmQsIGludGVybWVkaWF0ZURpcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlbHBTdG9wO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QW5pbWF0aW9uRHVyYXRpb24ocGF0aDogVmVjdG9yW10sIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCkgLyAodGhpcy5hZGFwdGVyLnNwZWVkIHx8IExpbmUuU1BFRUQpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFRvdGFsTGVuZ3RoKHBhdGg6IFZlY3RvcltdKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYWN0dWFsTGVuZ3RoID0gdGhpcy5hZGFwdGVyLnRvdGFsTGVuZ3RoO1xuICAgICAgICBpZiAoYWN0dWFsTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdHVhbExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhdGgubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgbGVuZ3RoICs9IHBhdGhbaV0uZGVsdGEocGF0aFtpKzFdKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXQgdGVybWluaSgpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA9PSAwKSBcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIFtzdG9wc1swXSwgc3RvcHNbc3RvcHMubGVuZ3RoLTFdXTtcbiAgICB9XG5cbiAgICBnZXQgcGF0aCgpOiBWZWN0b3JbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuICAgIH1cblxuICAgIGdldFN0b3Aoc3RhdGlvbklkOiBzdHJpbmcpOiBTdG9wIHwgbnVsbCB7XG4gICAgICAgIGZvciAoY29uc3Qgc3RvcCBvZiBPYmplY3QudmFsdWVzKHRoaXMuYWRhcHRlci5zdG9wcykpIHtcbiAgICAgICAgICAgIGlmIChzdG9wLnN0YXRpb25JZCA9PSBzdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59IiwiaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcblxuZXhwb3J0IGNsYXNzIExpbmVHcm91cCB7XG4gICAgcHJpdmF0ZSBfbGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgX3Rlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgIHN0cm9rZUNvbG9yID0gMDtcbiAgICBcbiAgICBhZGRMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLl9saW5lcy5pbmNsdWRlcyhsaW5lKSlcbiAgICAgICAgICAgIHRoaXMuX2xpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5fbGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGluZXNbaV0gPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFN0b3BbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJtaW5pO1xuICAgIH1cblxuICAgIGdldFBhdGhCZXR3ZWVuKHN0YXRpb25JZEZyb206IHN0cmluZywgc3RhdGlvbklkVG86IHN0cmluZyk6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSB8IG51bGwge1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5nZXRMaW5lc1dpdGhTdG9wKHN0YXRpb25JZEZyb20pO1xuICAgICAgICBjb25zdCB0byA9IHRoaXMuZ2V0TGluZXNXaXRoU3RvcChzdGF0aW9uSWRUbyk7XG5cbiAgICAgICAgaWYgKGZyb20ubGVuZ3RoID09IDAgfHwgdG8ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIE9iamVjdC52YWx1ZXMoZnJvbSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiBPYmplY3QudmFsdWVzKHRvKSkge1xuICAgICAgICAgICAgICAgIGlmIChhLmxpbmUgPT0gYi5saW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhdGhCZXR3ZWVuU3RvcHMoYS5saW5lLCBhLnN0b3AsIGIuc3RvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBPYmplY3QudmFsdWVzKGZyb20pKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgT2JqZWN0LnZhbHVlcyh0bykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tb24gPSB0aGlzLmZpbmRDb21tb25TdG9wKGEubGluZSwgYi5saW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoY29tbW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyc3RQYXJ0ID0gdGhpcy5nZXRQYXRoQmV0d2VlblN0b3BzKGEubGluZSwgYS5zdG9wLCBjb21tb24pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRQYXJ0ID0gdGhpcy5nZXRQYXRoQmV0d2VlblN0b3BzKGIubGluZSwgY29tbW9uLCBiLnN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFBhcnRTbGljZSA9IGZpcnN0UGFydC5wYXRoLnNsaWNlKDAsIGZpcnN0UGFydC50bysxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Vjb25kUGFydFNsaWNlID0gc2Vjb25kUGFydC5wYXRoLnNsaWNlKHNlY29uZFBhcnQuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHBhdGg6IGZpcnN0UGFydFNsaWNlLmNvbmNhdChzZWNvbmRQYXJ0U2xpY2UpLCBmcm9tOiBmaXJzdFBhcnQuZnJvbSwgdG86IGZpcnN0UGFydFNsaWNlLmxlbmd0aCArIHNlY29uZFBhcnQudG99O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wbGV4IFRyYWluIHJvdXRpbmcgZm9yIExpbmVzIG9mIExpbmVHcm91cHMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldExpbmVzV2l0aFN0b3Aoc3RhdGlvbklkOiBzdHJpbmcpOiB7bGluZTogTGluZSwgc3RvcDogU3RvcH1bXSB7XG4gICAgICAgIGNvbnN0IGFycjoge2xpbmU6IExpbmUsIHN0b3A6IFN0b3B9W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIE9iamVjdC52YWx1ZXModGhpcy5fbGluZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gbGluZS5nZXRTdG9wKHN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goe2xpbmU6IGxpbmUsIHN0b3A6IHN0b3B9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UGF0aEJldHdlZW5TdG9wcyhsaW5lOiBMaW5lLCBmcm9tOiBTdG9wLCB0bzogU3RvcCk6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBsaW5lLnBhdGg7XG4gICAgICAgIGxldCBmcm9tSWR4ID0gdGhpcy5pbmRleE9mKHBhdGgsIGZyb20uY29vcmQgfHwgVmVjdG9yLk5VTEwpO1xuICAgICAgICBsZXQgdG9JZHggPSB0aGlzLmluZGV4T2YocGF0aCwgdG8uY29vcmQgfHwgVmVjdG9yLk5VTEwpO1xuICAgICAgICBpZiAoZnJvbUlkeCA9PSAtMSB8fCB0b0lkeCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RvcCB0aGF0IHNob3VsZCBiZSBwcmVzZW50IGlzIG5vdCBwcmVzZW50IG9uIGxpbmUgXCIgKyBsaW5lLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc3Qgc2xpY2UgPSBwYXRoLnNsaWNlKE1hdGgubWluKGZyb21JZHgsIHRvSWR4KSwgTWF0aC5tYXgoZnJvbUlkeCwgdG9JZHgpKzEpO1xuICAgICAgICBjb25zdCBzbGljZSA9IHBhdGguc2xpY2UoKTtcbiAgICAgICAgaWYgKGZyb21JZHggPiB0b0lkeCkge1xuICAgICAgICAgICAgc2xpY2UucmV2ZXJzZSgpO1xuICAgICAgICAgICAgZnJvbUlkeCA9IHNsaWNlLmxlbmd0aCAtIDEgLSBmcm9tSWR4O1xuICAgICAgICAgICAgdG9JZHggPSBzbGljZS5sZW5ndGggLSAxIC0gdG9JZHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgcGF0aDogc2xpY2UsIGZyb206IGZyb21JZHgsIHRvOiB0b0lkeCB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5kZXhPZihhcnJheTogVmVjdG9yW10sIGVsZW1lbnQ6IFZlY3Rvcikge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXS5lcXVhbHMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kQ29tbW9uU3RvcChsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBTdG9wIHwgbnVsbCB7XG4gICAgICAgIGZvciAoY29uc3QgdGVybWludXMxIG9mIE9iamVjdC52YWx1ZXMobGluZTEudGVybWluaSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGVybWludXMyIG9mIE9iamVjdC52YWx1ZXMobGluZTIudGVybWluaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGVybWludXMxLnN0YXRpb25JZCA9PSB0ZXJtaW51czIuc3RhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXJtaW51czE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVGVybWluaSgpIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaChsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVUZXJtaW5pID0gbC50ZXJtaW5pO1xuICAgICAgICAgICAgbGluZVRlcm1pbmkuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXQudHJhY2tJbmZvLmluY2x1ZGVzKCcqJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0rKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGVybWluaTogU3RvcFtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgW3N0YXRpb25JZCwgb2NjdXJlbmNlc10gb2YgT2JqZWN0LmVudHJpZXMoY2FuZGlkYXRlcykpIHtcbiAgICAgICAgICAgIGlmIChvY2N1cmVuY2VzID09IDEpIHtcbiAgICAgICAgICAgICAgICB0ZXJtaW5pLnB1c2gobmV3IFN0b3Aoc3RhdGlvbklkLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Rlcm1pbmkgPSB0ZXJtaW5pO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgWm9vbWVyIH0gZnJvbSBcIi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBMaW5lR3JvdXAgfSBmcm9tIFwiLi9MaW5lR3JvdXBcIjtcbmltcG9ydCB7IEdyYXZpdGF0b3IgfSBmcm9tIFwiLi9HcmF2aXRhdG9yXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpb25Qcm92aWRlciB7XG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQ7XG4gICAgbGluZUdyb3VwQnlJZChpZDogc3RyaW5nKTogTGluZUdyb3VwO1xuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0FkYXB0ZXIge1xuICAgIGNhbnZhc1NpemU6IEJvdW5kaW5nQm94O1xuICAgIGF1dG9TdGFydDogYm9vbGVhbjtcbiAgICBpbml0aWFsaXplKG5ldHdvcms6IE5ldHdvcmspOiB2b2lkO1xuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbjtcbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQ7XG4gICAgem9vbVRvKHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIE5ldHdvcmsgaW1wbGVtZW50cyBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHByaXZhdGUgc2xpZGVJbmRleDoge1tpZDogc3RyaW5nXSA6IHtbaWQ6IHN0cmluZ106IFRpbWVkRHJhd2FibGVbXX19ID0ge307XG4gICAgcHJpdmF0ZSBzdGF0aW9uczogeyBbaWQ6IHN0cmluZ10gOiBTdGF0aW9uIH0gPSB7fTtcbiAgICBwcml2YXRlIGxpbmVHcm91cHM6IHsgW2lkOiBzdHJpbmddIDogTGluZUdyb3VwIH0gPSB7fTtcbiAgICBwcml2YXRlIGVyYXNlQnVmZmVyOiBUaW1lZERyYXdhYmxlW10gPSBbXTtcbiAgICBwcml2YXRlIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3I7XG4gICAgcHJpdmF0ZSB6b29tZXI6IFpvb21lcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTmV0d29ya0FkYXB0ZXIpIHtcbiAgICAgICAgdGhpcy5ncmF2aXRhdG9yID0gbmV3IEdyYXZpdGF0b3IodGhpcyk7XG4gICAgICAgIHRoaXMuem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmFkYXB0ZXIuY2FudmFzU2l6ZSk7XG4gICAgfVxuXG4gICAgZ2V0IGF1dG9TdGFydCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5hdXRvU3RhcnQ7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmluaXRpYWxpemUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aW9uc1tpZF07XG4gICAgfVxuXG4gICAgbGluZUdyb3VwQnlJZChpZDogc3RyaW5nKTogTGluZUdyb3VwIHtcbiAgICAgICAgaWYgKHRoaXMubGluZUdyb3Vwc1tpZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVHcm91cHNbaWRdID0gbmV3IExpbmVHcm91cCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmVHcm91cHNbaWRdO1xuICAgIH1cblxuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLmFkYXB0ZXIuY3JlYXRlVmlydHVhbFN0b3AoaWQsIGJhc2VDb29yZHMsIHJvdGF0aW9uKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uc1tpZF0gPSBzdG9wO1xuICAgICAgICByZXR1cm4gc3RvcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRpc3BsYXlJbnN0YW50KGluc3RhbnQ6IEluc3RhbnQpIHtcbiAgICAgICAgaWYgKCFpbnN0YW50LmVxdWFscyhJbnN0YW50LkJJR19CQU5HKSkge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXdFcG9jaChpbnN0YW50LmVwb2NoICsgJycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRpbWVkRHJhd2FibGVzQXQobm93OiBJbnN0YW50KTogVGltZWREcmF3YWJsZVtdIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRXBvY2hFeGlzdGluZyhub3cuZXBvY2ggKyAnJykpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXVtub3cuc2Vjb25kXTtcbiAgICB9XG5cbiAgICBkcmF3VGltZWREcmF3YWJsZXNBdChub3c6IEluc3RhbnQsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmRpc3BsYXlJbnN0YW50KG5vdyk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzOiBUaW1lZERyYXdhYmxlW10gPSB0aGlzLnRpbWVkRHJhd2FibGVzQXQobm93KTtcbiAgICAgICAgbGV0IGRlbGF5ID0gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGVsYXkgPSB0aGlzLmRyYXdPckVyYXNlRWxlbWVudChlbGVtZW50c1tpXSwgZGVsYXksIGFuaW1hdGUsIG5vdyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRXJhc2VCdWZmZXIoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICBkZWxheSA9IHRoaXMuZ3Jhdml0YXRvci5ncmF2aXRhdGUoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuem9vbVRvKHRoaXMuem9vbWVyLmNlbnRlciwgdGhpcy56b29tZXIuc2NhbGUsIHRoaXMuem9vbWVyLmR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy56b29tZXIucmVzZXQoKTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZmx1c2hFcmFzZUJ1ZmZlcihkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaT10aGlzLmVyYXNlQnVmZmVyLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVyYXNlQnVmZmVyW2ldO1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LnRvLCBhbmltYXRlKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IHRoaXMuZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgICAgIHRoaXMuem9vbWVyLmluY2x1ZGUoZWxlbWVudC5ib3VuZGluZ0JveCwgZWxlbWVudC5mcm9tLCBlbGVtZW50LnRvLCBmYWxzZSwgYW5pbWF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcmFzZUJ1ZmZlciA9IFtdO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3T3JFcmFzZUVsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgaW5zdGFudDogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGlmIChpbnN0YW50LmVxdWFscyhlbGVtZW50LnRvKSAmJiAhZWxlbWVudC5mcm9tLmVxdWFscyhlbGVtZW50LnRvKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXJhc2VCdWZmZXIubGVuZ3RoID4gMCAmJiB0aGlzLmVyYXNlQnVmZmVyW3RoaXMuZXJhc2VCdWZmZXIubGVuZ3RoLTFdLm5hbWUgIT0gZWxlbWVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRXJhc2VCdWZmZXIoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lcmFzZUJ1ZmZlci5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaEVyYXNlQnVmZmVyKGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LmZyb20sIGFuaW1hdGUpO1xuICAgICAgICBkZWxheSArPSB0aGlzLmRyYXdFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgdGhpcy56b29tZXIuaW5jbHVkZShlbGVtZW50LmJvdW5kaW5nQm94LCBlbGVtZW50LmZyb20sIGVsZW1lbnQudG8sIHRydWUsIGFuaW1hdGUpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZHJhd0VsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTGluZSkge1xuICAgICAgICAgICAgdGhpcy5ncmF2aXRhdG9yLmFkZEVkZ2UoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5lcmFzZShkZWxheSwgYW5pbWF0ZSwgZWxlbWVudC50by5mbGFnLmluY2x1ZGVzKCdyZXZlcnNlJykpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHNob3VsZEFuaW1hdGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChpbnN0YW50LmZsYWcuaW5jbHVkZXMoJ25vYW5pbScpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gYW5pbWF0ZTtcbiAgICB9XG5cbiAgICBpc0Vwb2NoRXhpc3RpbmcoZXBvY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZUluZGV4W2Vwb2NoXSAhPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYWRkVG9JbmRleChlbGVtZW50OiBUaW1lZERyYXdhYmxlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0U2xpZGVJbmRleEVsZW1lbnQoZWxlbWVudC5mcm9tLCBlbGVtZW50KTtcbiAgICAgICAgaWYgKCFJbnN0YW50LkJJR19CQU5HLmVxdWFscyhlbGVtZW50LnRvKSlcbiAgICAgICAgICAgIHRoaXMuc2V0U2xpZGVJbmRleEVsZW1lbnQoZWxlbWVudC50bywgZWxlbWVudCk7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU3RhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdGF0aW9uc1tlbGVtZW50LmlkXSA9IGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNsaWRlSW5kZXhFbGVtZW50KGluc3RhbnQ6IEluc3RhbnQsIGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9IFtdO1xuICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdLnB1c2goZWxlbWVudCk7XG4gICAgfVxuXG4gICAgbmV4dEluc3RhbnQobm93OiBJbnN0YW50KTogSW5zdGFudCB8IG51bGwge1xuICAgICAgICBsZXQgZXBvY2g6IG51bWJlciB8IG51bGwgPSBub3cuZXBvY2g7XG4gICAgICAgIGxldCBzZWNvbmQ6IG51bWJlciB8IG51bGwgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5zZWNvbmQsIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdKTtcbiAgICAgICAgaWYgKHNlY29uZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcG9jaCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LmVwb2NoLCB0aGlzLnNsaWRlSW5kZXgpO1xuICAgICAgICAgICAgaWYgKGVwb2NoID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHNlY29uZCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUoLTEsIHRoaXMuc2xpZGVJbmRleFtlcG9jaF0pO1xuICAgICAgICAgICAgaWYgKHNlY29uZCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW50KGVwb2NoLCBzZWNvbmQsICcnKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmaW5kU21hbGxlc3RBYm92ZSh0aHJlc2hvbGQ6IG51bWJlciwgZGljdDoge1tpZDogbnVtYmVyXTogYW55fSk6IG51bWJlciB8IG51bGwge1xuICAgICAgICBpZiAoZGljdCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGljdCkpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChrZXkpID4gdGhyZXNob2xkICYmIChzbWFsbGVzdCA9PSBudWxsIHx8IHBhcnNlSW50KGtleSkgPCBzbWFsbGVzdCkpIHtcbiAgICAgICAgICAgICAgICBzbWFsbGVzdCA9IHBhcnNlSW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNtYWxsZXN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IExpbmVBdFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJyZWRUcmFjayB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgaWYgKHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlID49IDAgPyAnKycgOiAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayhwcmVmaXggKyB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihhdFN0YXRpb246IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGF0U3RhdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhY2tOdW1iZXIoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tTnVtYmVyKGF0U3RhdGlvbi50cmFjayk7ICAgICAgICBcbiAgICB9XG5cbiAgICBrZWVwT25seVNpZ24oKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy52YWx1ZVswXTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayh2ID09ICctJyA/IHYgOiAnKycpO1xuICAgIH1cblxuICAgIGhhc1RyYWNrTnVtYmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGdldCB0cmFja051bWJlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy52YWx1ZS5yZXBsYWNlKCcqJywgJycpKVxuICAgIH1cblxuICAgIGlzUG9zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdICE9ICctJztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgICBwcml2YXRlIHN0YXRpYyBESVJTOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7J3N3JzogLTEzNSwgJ3cnOiAtOTAsICdudyc6IC00NSwgJ24nOiAwLCAnbmUnOiA0NSwgJ2UnOiA5MCwgJ3NlJzogMTM1LCAncyc6IDE4MH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWdyZWVzOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGRpcmVjdGlvbjogc3RyaW5nKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKFJvdGF0aW9uLkRJUlNbZGlyZWN0aW9uXSlcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhSb3RhdGlvbi5ESVJTKSkge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2YWx1ZSwgdGhpcy5kZWdyZWVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG5cbiAgICBnZXQgZGVncmVlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVncmVlcztcbiAgICB9XG5cbiAgICBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzIC8gMTgwICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICBhZGQodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLmRlZ3JlZXMgKyB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGlmIChzdW0gPD0gLTE4MClcbiAgICAgICAgICAgIHN1bSArPSAzNjA7XG4gICAgICAgIGlmIChzdW0gPiAxODApXG4gICAgICAgICAgICBzdW0gLT0gMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHN1bSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBsZXQgYiA9IHRoYXQuZGVncmVlcztcbiAgICAgICAgbGV0IGRpc3QgPSBiLWE7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0KSA+IDE4MCkge1xuICAgICAgICAgICAgaWYgKGEgPCAwKVxuICAgICAgICAgICAgICAgIGEgKz0gMzYwO1xuICAgICAgICAgICAgaWYgKGIgPCAwKVxuICAgICAgICAgICAgICAgIGIgKz0gMzYwO1xuICAgICAgICAgICAgZGlzdCA9IGItYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpc3QpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBkaXIgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGlyLCAtOTApKVxuICAgICAgICAgICAgZGlyID0gMDtcbiAgICAgICAgZWxzZSBpZiAoZGlyIDwgLTkwKVxuICAgICAgICAgICAgZGlyICs9IDE4MDtcbiAgICAgICAgZWxzZSBpZiAoZGlyID4gOTApXG4gICAgICAgICAgICBkaXIgLT0gMTgwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpcik7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAlIDE4MCA9PSAwO1xuICAgIH1cblxuICAgIHF1YXJ0ZXJEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBjb25zdCBkZWcgPSBkZWx0YURpciA8IDAgPyBNYXRoLmNlaWwoKGRlbHRhRGlyLTQ1KS85MCkgOiBNYXRoLmZsb29yKChkZWx0YURpcis0NSkvOTApO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyo5MCk7XG4gICAgfVxuXG4gICAgaGFsZkRpcmVjdGlvbihyZWxhdGl2ZVRvOiBSb3RhdGlvbiwgc3BsaXRBeGlzOiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGxldCBkZWc7XG4gICAgICAgIGlmIChzcGxpdEF4aXMuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICAgICAgICBpZiAoZGVsdGFEaXIgPCAwICYmIGRlbHRhRGlyID49IC0xODApXG4gICAgICAgICAgICAgICAgZGVnID0gLTkwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDkwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgOTAgJiYgZGVsdGFEaXIgPj0gLTkwKVxuICAgICAgICAgICAgICAgIGRlZyA9IDA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVnID0gMTgwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKTtcbiAgICB9XG5cbiAgICBuZWFyZXN0Um91bmRlZEluRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBkaXJlY3Rpb246IG51bWJlcikge1xuICAgICAgICBjb25zdCBjZWlsZWRPckZsb29yZWRPcmllbnRhdGlvbiA9IHJlbGF0aXZlVG8ucm91bmQoZGlyZWN0aW9uKTtcbiAgICAgICAgY29uc3QgZGlmZmVyZW5jZUluT3JpZW50YXRpb24gPSBNYXRoLmFicyhjZWlsZWRPckZsb29yZWRPcmllbnRhdGlvbi5kZWdyZWVzIC0gdGhpcy5kZWdyZWVzKSAlIDkwO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQobmV3IFJvdGF0aW9uKE1hdGguc2lnbihkaXJlY3Rpb24pKmRpZmZlcmVuY2VJbk9yaWVudGF0aW9uKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByb3VuZChkaXJlY3Rpb246IG51bWJlcik6IFJvdGF0aW9uIHtcbiAgICAgICAgY29uc3QgZGVnID0gdGhpcy5kZWdyZWVzIC8gNDU7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oKGRpcmVjdGlvbiA+PSAwID8gTWF0aC5jZWlsKGRlZykgOiBNYXRoLmZsb29yKGRlZykpICogNDUpO1xuICAgIH1cblxuICAgIFxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBiYXNlQ29vcmRzOiBWZWN0b3I7XG4gICAgcm90YXRpb246IFJvdGF0aW9uO1xuICAgIGxhYmVsRGlyOiBSb3RhdGlvbjtcbiAgICBpZDogc3RyaW5nO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGlvbklkOiBzdHJpbmcsIHB1YmxpYyB0cmFja0luZm86IHN0cmluZykge1xuXG4gICAgfVxuXG4gICAgcHVibGljIGNvb3JkOiBWZWN0b3IgfCBudWxsID0gbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQXRTdGF0aW9uIHtcbiAgICBsaW5lPzogTGluZTtcbiAgICBheGlzOiBzdHJpbmc7XG4gICAgdHJhY2s6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXRpb24gaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IExpbmVBdFN0YXRpb25bXX0gPSB7eDogW10sIHk6IFtdfTtcbiAgICBwcml2YXRlIGV4aXN0aW5nTGFiZWxzOiBMYWJlbFtdID0gW107XG4gICAgcHJpdmF0ZSBwaGFudG9tPzogTGluZUF0U3RhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLmlkO1xuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogU3RhdGlvbkFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGdldCBiYXNlQ29vcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgc2V0IGJhc2VDb29yZHMoYmFzZUNvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzID0gYmFzZUNvb3JkcztcbiAgICB9XG5cblxuICAgIGdldCBib3VuZGluZ0JveCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveCh0aGlzLmFkYXB0ZXIuYmFzZUNvb3JkcywgdGhpcy5hZGFwdGVyLmJhc2VDb29yZHMpO1xuICAgIH1cblxuXG4gICAgYWRkTGluZShsaW5lOiBMaW5lLCBheGlzOiBzdHJpbmcsIHRyYWNrOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5waGFudG9tID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10ucHVzaCh7bGluZTogbGluZSwgYXhpczogYXhpcywgdHJhY2s6IHRyYWNrfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGluZShsaW5lOiBMaW5lKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgfVxuXG4gICAgYWRkTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5leGlzdGluZ0xhYmVscy5pbmNsdWRlcyhsYWJlbCkpXG4gICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnB1c2gobGFiZWwpO1xuICAgIH1cblxuICAgIHJlbW92ZUxhYmVsKGxhYmVsOiBMYWJlbCk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5leGlzdGluZ0xhYmVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGFiZWxzW2ldID09IGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGlzdGluZ0xhYmVscy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsYWJlbHMoKTogTGFiZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4aXN0aW5nTGFiZWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlTGluZUF0QXhpcyhsaW5lOiBMaW5lLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBoYW50b20gPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgICAgICBleGlzdGluZ0xpbmVzRm9yQXhpcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZShsaW5lTmFtZTogc3RyaW5nKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLngpO1xuICAgICAgICBpZiAoeCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLnkpO1xuICAgICAgICBpZiAoeSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFja0ZvckxpbmVBdEF4aXMobGluZU5hbWU6IHN0cmluZywgZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0ubGluZT8ubmFtZSA9PSBsaW5lTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFzc2lnblRyYWNrKGF4aXM6IHN0cmluZywgcHJlZmVycmVkVHJhY2s6IFByZWZlcnJlZFRyYWNrLCBsaW5lOiBMaW5lKTogbnVtYmVyIHsgXG4gICAgICAgIGlmIChwcmVmZXJyZWRUcmFjay5oYXNUcmFja051bWJlcigpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2sudHJhY2tOdW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGhhbnRvbT8ubGluZT8ubmFtZSA9PSBsaW5lLm5hbWUgJiYgdGhpcy5waGFudG9tPy5heGlzID09IGF4aXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBoYW50b20/LnRyYWNrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMgPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllcygpW2F4aXNdO1xuICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2suaXNQb3NpdGl2ZSgpID8gcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpc1sxXSArIDEgOiBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzBdIC0gMTtcbiAgICB9XG5cbiAgICByb3RhdGVkVHJhY2tDb29yZGluYXRlcyhpbmNvbWluZ0RpcjogUm90YXRpb24sIGFzc2lnbmVkVHJhY2s6IG51bWJlcik6IFZlY3RvciB7IFxuICAgICAgICBsZXQgbmV3Q29vcmQ6IFZlY3RvcjtcbiAgICAgICAgaWYgKGluY29taW5nRGlyLmRlZ3JlZXMgJSAxODAgPT0gMCkge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKDAsIGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0Nvb3JkID0gbmV3Q29vcmQucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgICAgICBuZXdDb29yZCA9IHRoaXMuYmFzZUNvb3Jkcy5hZGQobmV3Q29vcmQpO1xuICAgICAgICByZXR1cm4gbmV3Q29vcmQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXMoKToge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy54KSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXMueSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gWzEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVmdCA9IDA7XG4gICAgICAgIGxldCByaWdodCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2spIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlZnQgPiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmlhbXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMuZm9yRWFjaChsID0+IGwuZHJhdyhkZWxheVNlY29uZHMsIGZhbHNlKSk7XG4gICAgICAgIGNvbnN0IHQgPSBzdGF0aW9uLnBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdDsgfSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB0bzogVmVjdG9yKSB7XG4gICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheVNlY29uZHMsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5iYXNlQ29vcmRzLCB0bywgKCkgPT4gc3RhdGlvbi5leGlzdGluZ0xhYmVscy5mb3JFYWNoKGwgPT4gbC5kcmF3KDAsIGZhbHNlKSkpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5U2Vjb25kcyk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHN0YXRpb25TaXplRm9yQXhpcyhheGlzOiBzdHJpbmcsIHZlY3RvcjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2ZWN0b3IsIDApKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGNvbnN0IGRpciA9IE1hdGguc2lnbih2ZWN0b3IpO1xuICAgICAgICBsZXQgZGltZW4gPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzW2F4aXNdKVt2ZWN0b3IgPCAwID8gMCA6IDFdO1xuICAgICAgICBpZiAoZGlyKmRpbWVuIDwgMCkge1xuICAgICAgICAgICAgZGltZW4gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbiAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIGRpciAqIChTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiArIFN0YXRpb24uTEFCRUxfRElTVEFOQ0UpO1xuICAgIH1cblxuICAgIGxpbmVzRXhpc3RpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGluZXMueC5sZW5ndGggPiAwIHx8IHRoaXMuZXhpc3RpbmdMaW5lcy55Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgQXJyaXZhbERlcGFydHVyZVRpbWUgfSBmcm9tIFwiLi9BcnJpdmFsRGVwYXJ0dXJlVGltZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRyYWluQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94O1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgZm9sbG93OiB7cGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlcn0pOiB2b2lkO1xuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmb2xsb3c6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSk6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgVHJhaW4gaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogVHJhaW5BZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIGJvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgbGluZUdyb3VwID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpXG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBpZiAoc3RvcHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHJhaW4gXCIgKyB0aGlzLm5hbWUgKyBcIiBuZWVkcyBhdCBsZWFzdCAyIHN0b3BzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MTsgaTxzdG9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJyZGVwID0gbmV3IEFycml2YWxEZXBhcnR1cmVUaW1lKHN0b3BzW2ldLnRyYWNrSW5mbyk7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbGluZUdyb3VwLmdldFBhdGhCZXR3ZWVuKHN0b3BzW2ktMV0uc3RhdGlvbklkLCBzdG9wc1tpXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIGFuaW1hdGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheSArIGFycmRlcC5kZXBhcnR1cmUgLSB0aGlzLmZyb20uc2Vjb25kLCBhcnJkZXAuYXJyaXZhbCAtIGFycmRlcC5kZXBhcnR1cmUsIHBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzLm5hbWUgKyAnOiBObyBwYXRoIGZvdW5kIGJldHdlZW4gJyArIHN0b3BzW2ktMV0uc3RhdGlvbklkICsgJyAnICsgc3RvcHNbaV0uc3RhdGlvbklkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU1QUkVDSVNJT046IG51bWJlciA9IDAuMDAxO1xuXG4gICAgc3RhdGljIGVxdWFscyhhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDwgVXRpbHMuSU1QUkVDSVNJT047XG4gICAgfVxuXG4gICAgc3RhdGljIHRyaWxlbW1hKGludDogbnVtYmVyLCBvcHRpb25zOiBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10pOiBzdHJpbmcge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGludCwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKGludCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zWzBdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhbHBoYWJldGljSWQoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYSA8IGIpXG4gICAgICAgICAgICByZXR1cm4gYSArICdfJyArIGI7XG4gICAgICAgIHJldHVybiBiICsgJ18nICsgYTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZWFzZSh4OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDMpIC8gMjtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgVmVjdG9yIHtcbiAgICBzdGF0aWMgVU5JVDogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAtMSk7XG4gICAgc3RhdGljIE5VTEw6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgMCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF94OiBudW1iZXIsIHByaXZhdGUgX3k6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgZ2V0IHgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgfVxuXG4gICAgZ2V0IHkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKTtcbiAgICB9XG5cbiAgICB3aXRoTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLmxlbmd0aCAhPSAwID8gbGVuZ3RoL3RoaXMubGVuZ3RoIDogMDtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54KnJhdGlvLCB0aGlzLnkqcmF0aW8pO1xuICAgIH1cblxuICAgIGFkZCh0aGF0IDogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICsgdGhhdC54LCB0aGlzLnkgKyB0aGF0LnkpO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoYXQueCAtIHRoaXMueCwgdGhhdC55IC0gdGhpcy55KTtcbiAgICB9XG5cbiAgICByb3RhdGUodGhldGE6IFJvdGF0aW9uKTogVmVjdG9yIHtcbiAgICAgICAgbGV0IHJhZDogbnVtYmVyID0gdGhldGEucmFkaWFucztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICogTWF0aC5jb3MocmFkKSAtIHRoaXMueSAqIE1hdGguc2luKHJhZCksIHRoaXMueCAqIE1hdGguc2luKHJhZCkgKyB0aGlzLnkgKiBNYXRoLmNvcyhyYWQpKTtcbiAgICB9XG5cbiAgICBkb3RQcm9kdWN0KHRoYXQ6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLngqdGhhdC54K3RoaXMueSp0aGF0Lnk7XG4gICAgfVxuXG4gICAgc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IHthOiBudW1iZXIsIGI6IG51bWJlcn0ge1xuICAgICAgICBjb25zdCBkZWx0YTogVmVjdG9yID0gdGhpcztcbiAgICAgICAgY29uc3Qgc3dhcFplcm9EaXZpc2lvbiA9IFV0aWxzLmVxdWFscyhkaXIyLnksIDApO1xuICAgICAgICBjb25zdCB4ID0gc3dhcFplcm9EaXZpc2lvbiA/ICd5JyA6ICd4JztcbiAgICAgICAgY29uc3QgeSA9IHN3YXBaZXJvRGl2aXNpb24gPyAneCcgOiAneSc7XG4gICAgICAgIGNvbnN0IGRlbm9taW5hdG9yID0gKGRpcjFbeV0qZGlyMlt4XS1kaXIxW3hdKmRpcjJbeV0pO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGRlbm9taW5hdG9yLCAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHthOiBOYU4sIGI6IE5hTn07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYSA9IChkZWx0YVt5XSpkaXIyW3hdLWRlbHRhW3hdKmRpcjJbeV0pL2Rlbm9taW5hdG9yO1xuICAgICAgICBjb25zdCBiID0gKGEqZGlyMVt5XS1kZWx0YVt5XSkvZGlyMlt5XTtcbiAgICAgICAgcmV0dXJuIHthLCBifTtcbiAgICB9XG5cbiAgICBpc0RlbHRhTWF0Y2hpbmdQYXJhbGxlbChkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGxFcXVhbFplcm8odGhpcy54LCBkaXIxLngsIGRpcjIueCkgfHwgdGhpcy5hbGxFcXVhbFplcm8odGhpcy55LCBkaXIxLnksIGRpcjIueSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbGxFcXVhbFplcm8objE6IG51bWJlciwgbjI6IG51bWJlciwgbjM6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gVXRpbHMuZXF1YWxzKG4xLCAwKSAmJiBVdGlscy5lcXVhbHMobjIsIDApICYmIFV0aWxzLmVxdWFscyhuMywgMCk7XG4gICAgfVxuXG4gICAgaW5jbGluYXRpb24oKTogUm90YXRpb24ge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueCwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueSA+IDAgPyAxODAgOiAwKTtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh0aGlzLnksIDApKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbih0aGlzLnggPiAwID8gOTAgOiAtOTApO1xuICAgICAgICBjb25zdCBhZGphY2VudCA9IG5ldyBWZWN0b3IoMCwtTWF0aC5hYnModGhpcy55KSk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oTWF0aC5zaWduKHRoaXMueCkqTWF0aC5hY29zKHRoaXMuZG90UHJvZHVjdChhZGphY2VudCkvYWRqYWNlbnQubGVuZ3RoL3RoaXMubGVuZ3RoKSoxODAvTWF0aC5QSSk7XG4gICAgfVxuXG4gICAgYW5nbGUob3RoZXI6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5jbGluYXRpb24oKS5kZWx0YShvdGhlci5pbmNsaW5hdGlvbigpKTtcbiAgICB9XG5cbiAgICBib3RoQXhpc01pbnMob3RoZXI6IFZlY3Rvcikge1xuICAgICAgICBpZiAodGhpcyA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgaWYgKG90aGVyID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCA8IG90aGVyLnggPyB0aGlzLnggOiBvdGhlci54LCB0aGlzLnkgPCBvdGhlci55ID8gdGhpcy55IDogb3RoZXIueSlcbiAgICB9XG5cbiAgICBib3RoQXhpc01heHMob3RoZXI6IFZlY3Rvcikge1xuICAgICAgICBpZiAodGhpcyA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgaWYgKG90aGVyID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCA+IG90aGVyLnggPyB0aGlzLnggOiBvdGhlci54LCB0aGlzLnkgPiBvdGhlci55ID8gdGhpcy55IDogb3RoZXIueSlcbiAgICB9XG5cbiAgICBiZXR3ZWVuKG90aGVyOiBWZWN0b3IsIHg6IG51bWJlcikge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuZGVsdGEob3RoZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgqeCkpO1xuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT0gb3RoZXIueCAmJiB0aGlzLnkgPT0gb3RoZXIueTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5cblxuXG5leHBvcnQgY2xhc3MgWm9vbWVyIHtcbiAgICBzdGF0aWMgWk9PTV9EVVJBVElPTiA9IDE7XG4gICAgc3RhdGljIFpPT01fTUFYX1NDQUxFID0gMztcbiAgICBzdGF0aWMgUEFERElOR19GQUNUT1IgPSAyNTtcbiAgICBcbiAgICBwcml2YXRlIGJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgcHJpdmF0ZSBjdXN0b21EdXJhdGlvbiA9IC0xO1xuICAgIHByaXZhdGUgcmVzZXRGbGFnID0gZmFsc2U7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXNTaXplOiBCb3VuZGluZ0JveCkge1xuICAgIH1cblxuICAgIGluY2x1ZGUoYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94LCBmcm9tOiBJbnN0YW50LCB0bzogSW5zdGFudCwgZHJhdzogYm9vbGVhbiwgc2hvdWxkQW5pbWF0ZTogYm9vbGVhbiwgcGFkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBub3cgPSBkcmF3ID8gZnJvbSA6IHRvO1xuICAgICAgICBpZiAobm93LmZsYWcuaW5jbHVkZXMoJ2tlZXB6b29tJykpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRGbGFnID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXNldEZsYWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvUmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaG91bGRBbmltYXRlICYmICFub3cuZmxhZy5pbmNsdWRlcygnbm96b29tJykpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFkICYmICFib3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveCA9IHRoaXMucGFkZGVkQm91bmRpbmdCb3goYm91bmRpbmdCb3gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LnRsID0gdGhpcy5ib3VuZGluZ0JveC50bC5ib3RoQXhpc01pbnMoYm91bmRpbmdCb3gudGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3guYnIgPSB0aGlzLmJvdW5kaW5nQm94LmJyLmJvdGhBeGlzTWF4cyhib3VuZGluZ0JveC5icik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGVuZm9yY2VkQm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBpZiAoIXRoaXMuYm91bmRpbmdCb3guaXNOdWxsKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZGRlZEJvdW5kaW5nQm94ID0gdGhpcy5ib3VuZGluZ0JveDtcbiAgICAgICAgICAgIGNvbnN0IHpvb21TaXplID0gcGFkZGVkQm91bmRpbmdCb3guZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1NpemUgPSB0aGlzLmNhbnZhc1NpemUuZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IG1pblpvb21TaXplID0gbmV3IFZlY3RvcihjYW52YXNTaXplLnggLyBab29tZXIuWk9PTV9NQVhfU0NBTEUsIGNhbnZhc1NpemUueSAvIFpvb21lci5aT09NX01BWF9TQ0FMRSk7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHpvb21TaXplLmRlbHRhKG1pblpvb21TaXplKTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxTcGFjaW5nID0gbmV3IFZlY3RvcihNYXRoLm1heCgwLCBkZWx0YS54LzIpLCBNYXRoLm1heCgwLCBkZWx0YS55LzIpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChcbiAgICAgICAgICAgICAgICBwYWRkZWRCb3VuZGluZ0JveC50bC5hZGQoYWRkaXRpb25hbFNwYWNpbmcucm90YXRlKG5ldyBSb3RhdGlvbigxODApKSksXG4gICAgICAgICAgICAgICAgcGFkZGVkQm91bmRpbmdCb3guYnIuYWRkKGFkZGl0aW9uYWxTcGFjaW5nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhZGRlZEJvdW5kaW5nQm94KGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgcGFkZGluZyA9ICh0aGlzLmNhbnZhc1NpemUuZGltZW5zaW9ucy54ICsgdGhpcy5jYW52YXNTaXplLmRpbWVuc2lvbnMueSkvWm9vbWVyLlBBRERJTkdfRkFDVE9SO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFxuICAgICAgICAgICAgYm91bmRpbmdCb3gudGwuYWRkKG5ldyBWZWN0b3IoLXBhZGRpbmcsIC1wYWRkaW5nKSksXG4gICAgICAgICAgICBib3VuZGluZ0JveC5ici5hZGQobmV3IFZlY3RvcihwYWRkaW5nLCBwYWRkaW5nKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgY2VudGVyKCk6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKCFlbmZvcmNlZEJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnggKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLngpLzIpLCBcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnkgKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLnkpLzIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXNTaXplLnRsLmJldHdlZW4odGhpcy5jYW52YXNTaXplLmJyLCAwLjUpO1xuICAgIH1cblxuICAgIGdldCBzY2FsZSgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBlbmZvcmNlZEJvdW5kaW5nQm94ID0gdGhpcy5lbmZvcmNlZEJvdW5kaW5nQm94KCk7XG4gICAgICAgIGlmICghZW5mb3JjZWRCb3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBlbmZvcmNlZEJvdW5kaW5nQm94LmRpbWVuc2lvbnM7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKGRlbHRhLnggLyB6b29tU2l6ZS54LCBkZWx0YS55IC8gem9vbVNpemUueSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgZ2V0IGR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmN1c3RvbUR1cmF0aW9uID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tRHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1Jlc2V0KCkge1xuICAgICAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIHRoaXMuY3VzdG9tRHVyYXRpb24gPSAtMTtcbiAgICAgICAgdGhpcy5yZXNldEZsYWcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucmVzZXRGbGFnID0gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vc3ZnL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuXG5sZXQgdGltZVBhc3NlZCA9IDA7XG5cbmNvbnN0IG5ldHdvcms6IE5ldHdvcmsgPSBuZXcgTmV0d29yayhuZXcgU3ZnTmV0d29yaygpKTtcbmNvbnN0IGFuaW1hdGVGcm9tSW5zdGFudDogSW5zdGFudCA9IGdldFN0YXJ0SW5zdGFudCgpO1xubGV0IHN0YXJ0ZWQgPSBmYWxzZTtcblxuaWYgKG5ldHdvcmsuYXV0b1N0YXJ0KSB7XG4gICAgc3RhcnRlZCA9IHRydWU7XG4gICAgc3RhcnRUcmFuc3BvcnROZXR3b3JrQW5pbWF0b3IoKTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc3RhcnRUcmFuc3BvcnROZXR3b3JrQW5pbWF0b3InLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKHN0YXJ0ZWQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCd0cmFuc3BvcnQtbmV0d29yay1hbmltYXRvciBhbHJlYWR5IHN0YXJ0ZWQuIFlvdSBzaG91bGQgcHJvYmFibHkgc2V0IGRhdGEtYXV0by1zdGFydD1cImZhbHNlXCIuIFN0YXJ0aW5nIGFueXdheXMuJylcbiAgICB9XG4gICAgc3RhcnRlZCA9IHRydWU7XG4gICAgc3RhcnRUcmFuc3BvcnROZXR3b3JrQW5pbWF0b3IoKTtcbn0pO1xuXG5mdW5jdGlvbiBzdGFydFRyYW5zcG9ydE5ldHdvcmtBbmltYXRvcigpIHtcbiAgICBuZXR3b3JrLmluaXRpYWxpemUoKTsgICAgXG4gICAgc2xpZGUoSW5zdGFudC5CSUdfQkFORywgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBnZXRTdGFydEluc3RhbnQoKTogSW5zdGFudCB7XG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0ZUZyb21JbnN0YW50OiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJykuc3BsaXQoJy0nKTtcbiAgICAgICAgY29uc3QgaW5zdGFudCA9IG5ldyBJbnN0YW50KHBhcnNlSW50KGFuaW1hdGVGcm9tSW5zdGFudFswXSkgfHwgMCwgcGFyc2VJbnQoYW5pbWF0ZUZyb21JbnN0YW50WzFdKSB8fCAwLCAnJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmYXN0IGZvcndhcmQgdG8nLCBpbnN0YW50KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbnQ7XG4gICAgfVxuICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xufVxuXG5mdW5jdGlvbiBzbGlkZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGluc3RhbnQgIT0gSW5zdGFudC5CSUdfQkFORyAmJiBpbnN0YW50LmVwb2NoID49IGFuaW1hdGVGcm9tSW5zdGFudC5lcG9jaCAmJiBpbnN0YW50LnNlY29uZCA+PSBhbmltYXRlRnJvbUluc3RhbnQuc2Vjb25kKVxuICAgICAgICBhbmltYXRlID0gdHJ1ZTtcblxuICAgIGNvbnNvbGUubG9nKGluc3RhbnQsICd0aW1lOiAnICsgTWF0aC5mbG9vcih0aW1lUGFzc2VkIC8gNjApICsgJzonICsgdGltZVBhc3NlZCAlIDYwKTtcblxuICAgIG5ldHdvcmsuZHJhd1RpbWVkRHJhd2FibGVzQXQoaW5zdGFudCwgYW5pbWF0ZSk7XG4gICAgY29uc3QgbmV4dCA9IG5ldHdvcmsubmV4dEluc3RhbnQoaW5zdGFudCk7XG4gICAgXG4gICAgaWYgKG5leHQpIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBpbnN0YW50LmRlbHRhKG5leHQpO1xuICAgICAgICB0aW1lUGFzc2VkICs9IGRlbHRhO1xuICAgICAgICBjb25zdCBkZWxheSA9IGFuaW1hdGUgPyBkZWx0YSA6IDA7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzbGlkZShuZXh0LCBhbmltYXRlKTsgfSwgZGVsYXkgKiAxMDAwKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IEdlbmVyaWNUaW1lZERyYXdhYmxlQWRhcHRlciB9IGZyb20gXCIuLi9HZW5lcmljVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdHZW5lcmljVGltZWREcmF3YWJsZSBpbXBsZW1lbnRzIEdlbmVyaWNUaW1lZERyYXdhYmxlQWRhcHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCByID0gdGhpcy5lbGVtZW50LmdldEJCb3goKTtcbiAgICAgICAgY29uc3QgYmJveCA9IG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHIueCwgci55KSwgbmV3IFZlY3RvcihyLngrci53aWR0aCwgci55K3IuaGVpZ2h0KSk7XG4gICAgICAgIHJldHVybiBiYm94O1xuICAgIH1cblxuICAgIGdldCB6b29tKCk6IFZlY3RvciB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFsnem9vbSddICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbJ3pvb20nXS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VJbnQoY2VudGVyWzBdKSB8fCA1MCwgcGFyc2VJbnQoY2VudGVyWzFdKSB8fCA1MCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFZlY3Rvci5OVUxMO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZHJhdygwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHpvb21DZW50ZXIsIHpvb21TY2FsZSk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICB0aGlzLmRvWm9vbSh6b29tQ2VudGVyLCB6b29tU2NhbGUsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1pvb20oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUoMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMsIHRoaXMuYm91bmRpbmdCb3gudGwuYmV0d2Vlbih0aGlzLmJvdW5kaW5nQm94LmJyLCAwLjUpLCB6b29tQ2VudGVyLCAxLCB6b29tU2NhbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lKHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlciwgZnJvbUNlbnRlcjogVmVjdG9yLCB0b0NlbnRlcjogVmVjdG9yLCBmcm9tU2NhbGU6IG51bWJlciwgdG9TY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgeCArPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGZ4ID0geDtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gZnJvbUNlbnRlci5kZWx0YSh0b0NlbnRlcilcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIGZ4LCBkZWx0YS55ICogZngpLmFkZChmcm9tQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gKHRvU2NhbGUgLSBmcm9tU2NhbGUpICogZnggKyBmcm9tU2NhbGU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20oY2VudGVyLCBzY2FsZSk7XG4gICAgICAgICAgICBjb25zdCBuZXR3b3JrID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IG5ldHdvcmsuYW5pbWF0ZUZyYW1lKHgsIGFuaW1hdGlvblBlckZyYW1lLCBmcm9tQ2VudGVyLCB0b0NlbnRlciwgZnJvbVNjYWxlLCB0b1NjYWxlKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20odG9DZW50ZXIsIHRvU2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGNlbnRlcjogVmVjdG9yLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHpvb21hYmxlID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBpZiAoem9vbWFibGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJldHdlZW4odGhpcy5ib3VuZGluZ0JveC5iciwgMC41KTtcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IG9yaWdpbi54ICsgJ3B4ICcgKyBvcmlnaW4ueSArICdweCc7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlICsgJykgdHJhbnNsYXRlKCcgKyAob3JpZ2luLnggLSBjZW50ZXIueCkgKyAncHgsJyArIChvcmlnaW4ueSAtIGNlbnRlci55KSArICdweCknO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBsYWJlbC5lcmFzZSgwKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IExhYmVsQWRhcHRlciwgTGFiZWwgfSBmcm9tIFwiLi4vTGFiZWxcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vVXRpbHNcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTGFiZWwgaW1wbGVtZW50cyBMYWJlbEFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIGdldCBmb3JTdGF0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uO1xuICAgIH1cblxuICAgIGdldCBmb3JMaW5lKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHIueCwgci55KSwgbmV3IFZlY3RvcihyLngrci53aWR0aCwgci55K3IuaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIHRleHRDb29yZHM6IFZlY3RvciwgbGFiZWxEaXI6IFJvdGF0aW9uLCBjaGlsZHJlbjogTGFiZWxBZGFwdGVyW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBsYWJlbC5kcmF3KDAsIHRleHRDb29yZHMsIGxhYmVsRGlyLCBjaGlsZHJlbik7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Q29vcmRzICE9IFZlY3Rvci5OVUxMKSB7XG4gICAgICAgICAgICB0aGlzLnNldENvb3JkKHRoaXMuZWxlbWVudCwgdGV4dENvb3Jkcyk7XG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0xpbmVMYWJlbHMobGFiZWxEaXIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGUoYm94RGltZW46IFZlY3RvciwgbGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnXG4gICAgICAgICAgICArIFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueCwgWy1ib3hEaW1lbi54ICsgJ3B4JywgLWJveERpbWVuLngvMiArICdweCcsICcwcHgnXSlcbiAgICAgICAgICAgICsgJywnXG4gICAgICAgICAgICArIFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueSwgWy1MYWJlbC5MQUJFTF9IRUlHSFQgKyAncHgnLCAtTGFiZWwuTEFCRUxfSEVJR0hULzIgKyAncHgnLCAnMHB4J10pIC8vIFRPRE8gbWFnaWMgbnVtYmVyc1xuICAgICAgICAgICAgKyAnKSc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xpbmVMYWJlbHMobGFiZWxEaXI6IFJvdGF0aW9uLCBjaGlsZHJlbjogTGFiZWxBZGFwdGVyW10pIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgaWYgKGMgaW5zdGFuY2VvZiBTdmdMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0xpbmVMYWJlbChjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgvTWF0aC5tYXgodGhpcy5lbGVtZW50LmdldEJCb3goKS53aWR0aCwgMSk7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IoYmJveC53aWR0aC9zY2FsZSwgYmJveC5oZWlnaHQvc2NhbGUpLCBsYWJlbERpcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVsKGxhYmVsOiBTdmdMYWJlbCkge1xuICAgICAgICBjb25zdCBsaW5lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnLCAnZGl2Jyk7XG4gICAgICAgIGxpbmVMYWJlbC5jbGFzc05hbWUgPSBsYWJlbC5jbGFzc05hbWVzO1xuICAgICAgICBsaW5lTGFiZWwuaW5uZXJIVE1MID0gbGFiZWwudGV4dDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyOiBSb3RhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbC5pbmNsdWRlcygnZm9yLXN0YXRpb24nKSlcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIGZvci1zdGF0aW9uJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmRvbWluYW50QmFzZWxpbmUgPSAnaGFuZ2luZyc7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IodGhpcy5lbGVtZW50LmdldEJCb3goKS53aWR0aCwgdGhpcy5lbGVtZW50LmdldEJCb3goKS5oZWlnaHQpLCBsYWJlbERpcik7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBsYWJlbC5lcmFzZSgwKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGdldCBjbGFzc05hbWVzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKyAnICcgKyB0aGlzLmZvckxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyIHtcbiAgICAgICAgY29uc3QgbGluZUxhYmVsOiBTVkdHcmFwaGljc0VsZW1lbnQgPSA8U1ZHR3JhcGhpY3NFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgICAgICBsaW5lTGFiZWwuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBmb3ItbGluZSc7XG4gICAgICAgIGxpbmVMYWJlbC5kYXRhc2V0LnN0YXRpb24gPSBzdGF0aW9uSWQ7XG4gICAgICAgIGxpbmVMYWJlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgICBsaW5lTGFiZWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZW1lbnRzJyk/LmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgICAgIHJldHVybiBuZXcgU3ZnTGFiZWwobGluZUxhYmVsKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBMaW5lQWRhcHRlciB9IGZyb20gXCIuLi9MaW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdMaW5lIGltcGxlbWVudHMgTGluZUFkYXB0ZXIge1xuXG4gICAgcHJpdmF0ZSBfc3RvcHM6IFN0b3BbXSA9IFtdO1xuICAgIGJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR1BhdGhFbGVtZW50KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQubGluZSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgd2VpZ2h0KCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGgpO1xuICAgIH1cblxuICAgIGdldCB0b3RhbExlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgfVxuXG4gICAgZ2V0IHNwZWVkKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5zcGVlZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZWxlbWVudC5kYXRhc2V0LnNwZWVkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUJvdW5kaW5nQm94KHBhdGg6IFZlY3RvcltdKTogdm9pZCB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPT0gJ3Zpc2libGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHIueCwgci55KSwgbmV3IFZlY3RvcihyLngrci53aWR0aCwgci55K3IuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgaT0wO2k8cGF0aC5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LnRsID0gdGhpcy5ib3VuZGluZ0JveC50bC5ib3RoQXhpc01pbnMocGF0aFtpXSk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LmJyID0gdGhpcy5ib3VuZGluZ0JveC5ici5ib3RoQXhpc01heHMocGF0aFtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG5cblxuICAgIGdldCBzdG9wcygpOiBTdG9wW10ge1xuICAgICAgICBpZiAodGhpcy5fc3RvcHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0b3BzPy5zcGxpdCgvXFxzKy8pIHx8IFtdO1xuICAgICAgICAgICAgbGV0IG5leHRTdG9wID0gbmV3IFN0b3AoJycsICcnKTtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dG9rZW5zPy5sZW5ndGg7aSsrKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0b2tlbnNbaV1bMF0gIT0gJy0nICYmIHRva2Vuc1tpXVswXSAhPSAnKycgJiYgdG9rZW5zW2ldWzBdICE9ICcqJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BzLnB1c2gobmV4dFN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AudHJhY2tJbmZvID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcHM7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlciwgY29sb3JEZXZpYXRpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHBhdGgpO1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGxpbmUuZHJhdygwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHBhdGgsIGxlbmd0aCwgY29sb3JEZXZpYXRpb24pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBsaW5lICcgKyB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuY3JlYXRlUGF0aChwYXRoKTtcbiAgICBcbiAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkobGVuZ3RoKTtcbiAgICAgICAgaWYgKGNvbG9yRGV2aWF0aW9uICE9IDApIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3IoY29sb3JEZXZpYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgbGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShsZW5ndGgsIDAsIC1sZW5ndGgvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTKTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSwgY29sb3JGcm9tOiBudW1iZXIsIGNvbG9yVG86IG51bWJlcikge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHRvKTtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBsaW5lLm1vdmUoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBmcm9tLCB0bywgY29sb3JGcm9tLCBjb2xvclRvKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIGNvbG9yRnJvbSwgY29sb3JUbywgMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMpO1xuICAgIH1cblxuICAgIFxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxpbmUuZXJhc2UoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCByZXZlcnNlLCBsZW5ndGgpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZnJvbSA9IDA7XG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgZnJvbSA9IGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSByZXZlcnNlID8gLTEgOiAxO1xuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShmcm9tLCBsZW5ndGggKiBkaXJlY3Rpb24sIGxlbmd0aC9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMgKiBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGF0aChwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkID0gJ00nICsgcGF0aC5tYXAodiA9PiB2LngrJywnK3YueSkuam9pbignIEwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGFzaGFycmF5KGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBkYXNoZWRQYXJ0ID0gbGVuZ3RoICsgJyc7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLnN0cm9rZURhc2hhcnJheS5yZXBsYWNlKC9bXjAtOVxccyxdKy9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcmVzZXRBcnJheSA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgICAgICBpZiAocHJlc2V0QXJyYXkubGVuZ3RoICUgMiA9PSAxKVxuICAgICAgICAgICAgICAgIHByZXNldEFycmF5ID0gcHJlc2V0QXJyYXkuY29uY2F0KHByZXNldEFycmF5KTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldExlbmd0aCA9IHByZXNldEFycmF5Lm1hcChhID0+IHBhcnNlSW50KGEpIHx8IDApLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuICAgICAgICAgICAgZGFzaGVkUGFydCA9IG5ldyBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gcHJlc2V0TGVuZ3RoICsgMSkpLmpvaW4ocHJlc2V0QXJyYXkuam9pbignICcpICsgJyAnKSArICcwJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gZGFzaGVkUGFydCArICcgJyArIGxlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNvbG9yKGRldmlhdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2UgPSAncmdiKCcgKyBNYXRoLm1heCgwLCBkZXZpYXRpb24pICogMjU2ICsgJywgMCwgJyArIE1hdGgubWluKDAsIGRldmlhdGlvbikgKiAtMjU2ICsgJyknO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZShmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvblBlckZyYW1lIDwgMCAmJiBmcm9tID4gdG8gfHwgYW5pbWF0aW9uUGVyRnJhbWUgPiAwICYmIGZyb20gPCB0bykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBmcm9tICsgJyc7XG4gICAgICAgICAgICBmcm9tICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZShmcm9tLCB0bywgYW5pbWF0aW9uUGVyRnJhbWUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gdG8gKyAnJztcbiAgICAgICAgICAgIGlmICh0byAhPSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10sIGNvbG9yRnJvbTogbnVtYmVyLCBjb2xvclRvOiBudW1iZXIsIHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVycG9sYXRlZCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZWQucHVzaChmcm9tW2ldLmJldHdlZW4odG9baV0sIHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KGludGVycG9sYXRlZFswXS5kZWx0YShpbnRlcnBvbGF0ZWRbaW50ZXJwb2xhdGVkLmxlbmd0aC0xXSkubGVuZ3RoKTsgLy8gVE9ETyBhcmJpdHJhcnkgbm9kZSBjb3VudFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKGludGVycG9sYXRlZCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbG9yKChjb2xvclRvLWNvbG9yRnJvbSkqeCtjb2xvckZyb20pO1xuXG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgY29sb3JGcm9tLCBjb2xvclRvLCB4LCBhbmltYXRpb25QZXJGcmFtZSk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkodG9bMF0uZGVsdGEodG9bdG8ubGVuZ3RoLTFdKS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHRvKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBOZXR3b3JrQWRhcHRlciwgTmV0d29yaywgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4uL05ldHdvcmtcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4uL0xpbmVcIjtcbmltcG9ydCB7IFN2Z0xpbmUgfSBmcm9tIFwiLi9TdmdMaW5lXCI7XG5pbXBvcnQgeyBTdmdTdGF0aW9uIH0gZnJvbSBcIi4vU3ZnU3RhdGlvblwiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi4vTGFiZWxcIjtcbmltcG9ydCB7IFN2Z0xhYmVsIH0gZnJvbSBcIi4vU3ZnTGFiZWxcIjtcbmltcG9ydCB7IEdlbmVyaWNUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4uL0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdmdHZW5lcmljVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBab29tZXIgfSBmcm9tIFwiLi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBUcmFpbiB9IGZyb20gXCIuLi9UcmFpblwiO1xuaW1wb3J0IHsgU3ZnVHJhaW4gfSBmcm9tIFwiLi9TdmdUcmFpblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z05ldHdvcmsgaW1wbGVtZW50cyBOZXR3b3JrQWRhcHRlciB7XG5cbiAgICBzdGF0aWMgRlBTID0gNjA7XG4gICAgc3RhdGljIFNWR05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbUNlbnRlcjogVmVjdG9yID0gVmVjdG9yLk5VTEw7XG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbVNjYWxlOiBudW1iZXIgPSAxO1xuXG4gICAgZ2V0IGNhbnZhc1NpemUoKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgICAgY29uc3QgYm94ID0gc3ZnPy52aWV3Qm94LmJhc2VWYWw7XG4gICAgICAgIGlmIChib3gpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3Rvcihib3gueCwgYm94LnkpLCBuZXcgVmVjdG9yKGJveC54K2JveC53aWR0aCwgYm94LnkrYm94LmhlaWdodCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTsgICAgICAgIFxuICAgIH1cblxuICAgIGdldCBhdXRvU3RhcnQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmF1dG9TdGFydCAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGdldCBiZWNrU3R5bGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmJlY2tTdHlsZSAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbGVtZW50c1wiKSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdBIGdyb3VwIHdpdGggdGhlIGlkIFwiZWxlbWVudHNcIiBpcyBtaXNzaW5nIGluIHRoZSBTVkcgc291cmNlLiBJdCBtaWdodCBiZSBuZWVkZWQgZm9yIGhlbHBlciBzdGF0aW9ucyBhbmQgbGFiZWxzLicpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50OiBUaW1lZERyYXdhYmxlIHwgbnVsbCA9IHRoaXMubWlycm9yRWxlbWVudChlbGVtZW50c1tpXSwgbmV0d29yayk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV0d29yay5hZGRUb0luZGV4KGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtaXJyb3JFbGVtZW50KGVsZW1lbnQ6IGFueSwgbmV0d29yazogU3RhdGlvblByb3ZpZGVyKTogVGltZWREcmF3YWJsZSB8IG51bGwge1xuICAgICAgICBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3BhdGgnICYmIGVsZW1lbnQuZGF0YXNldC5saW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lKG5ldyBTdmdMaW5lKGVsZW1lbnQpLCBuZXR3b3JrLCB0aGlzLmJlY2tTdHlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3BhdGgnICYmIGVsZW1lbnQuZGF0YXNldC50cmFpbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVHJhaW4obmV3IFN2Z1RyYWluKGVsZW1lbnQpLCBuZXR3b3JrKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAncmVjdCcgJiYgZWxlbWVudC5kYXRhc2V0LnN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0YXRpb24obmV3IFN2Z1N0YXRpb24oZWxlbWVudCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMYWJlbChuZXcgU3ZnTGFiZWwoZWxlbWVudCksIG5ldHdvcmspO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuZGF0YXNldC5mcm9tICE9IHVuZGVmaW5lZCB8fCBlbGVtZW50LmRhdGFzZXQudG8gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEdlbmVyaWNUaW1lZERyYXdhYmxlKG5ldyBTdmdHZW5lcmljVGltZWREcmF3YWJsZShlbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgaGVscFN0b3AgPSA8U1ZHUmVjdEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAncmVjdCcpO1xuICAgICAgICBoZWxwU3RvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGlvbicsIGlkKTtcbiAgICAgICAgaGVscFN0b3Auc2V0QXR0cmlidXRlKCdkYXRhLWRpcicsIHJvdGF0aW9uLm5hbWUpO1xuICAgICAgICB0aGlzLnNldENvb3JkKGhlbHBTdG9wLCBiYXNlQ29vcmRzKTtcbiAgICAgICAgaGVscFN0b3AuY2xhc3NOYW1lLmJhc2VWYWwgPSAnaGVscGVyJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZW1lbnRzJyk/LmFwcGVuZENoaWxkKGhlbHBTdG9wKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGhlbHBTdG9wKSk7ICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdlcG9jaCcsIHsgZGV0YWlsOiBlcG9jaCB9KTtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIFxuICAgICAgICBsZXQgZXBvY2hMYWJlbDtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXBvY2hMYWJlbCA9IDxTVkdUZXh0RWxlbWVudD4gPHVua25vd24+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpO1xuICAgICAgICAgICAgZXBvY2hMYWJlbC50ZXh0Q29udGVudCA9IGVwb2NoOyAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgIFxuICAgIHpvb21Ubyh6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcikge1xuICAgICAgICBjb25zdCBuZXR3b3JrID0gdGhpcztcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IG5ldHdvcmsuZG9ab29tKHpvb21DZW50ZXIsIHpvb21TY2FsZSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzKTsgfSxcbiAgICAgICAgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzIDw9IFpvb21lci5aT09NX0RVUkFUSU9OID8gMCA6IFpvb21lci5aT09NX0RVUkFUSU9OICogMTAwMCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRvWm9vbSh6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcikge1xuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZSgwLCAxL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUywgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzIDw9IFpvb21lci5aT09NX0RVUkFUSU9OLCB0aGlzLmN1cnJlbnRab29tQ2VudGVyLCB6b29tQ2VudGVyLCB0aGlzLmN1cnJlbnRab29tU2NhbGUsIHpvb21TY2FsZSk7XG4gICAgICAgIHRoaXMuY3VycmVudFpvb21DZW50ZXIgPSB6b29tQ2VudGVyO1xuICAgICAgICB0aGlzLmN1cnJlbnRab29tU2NhbGUgPSB6b29tU2NhbGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoeDogbnVtYmVyLCBhbmltYXRpb25QZXJGcmFtZTogbnVtYmVyLCBlYXNlOiBib29sZWFuLCBmcm9tQ2VudGVyOiBWZWN0b3IsIHRvQ2VudGVyOiBWZWN0b3IsIGZyb21TY2FsZTogbnVtYmVyLCB0b1NjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHggPCAxKSB7XG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgZnggPSBlYXNlID8gVXRpbHMuZWFzZSh4KSA6IHg7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGZyb21DZW50ZXIuZGVsdGEodG9DZW50ZXIpXG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yKGRlbHRhLnggKiBmeCwgZGVsdGEueSAqIGZ4KS5hZGQoZnJvbUNlbnRlcik7XG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9ICh0b1NjYWxlIC0gZnJvbVNjYWxlKSAqIGZ4ICsgZnJvbVNjYWxlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKGNlbnRlciwgc2NhbGUpO1xuICAgICAgICAgICAgY29uc3QgbmV0d29yayA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBuZXR3b3JrLmFuaW1hdGVGcmFtZSh4LCBhbmltYXRpb25QZXJGcmFtZSwgZWFzZSwgZnJvbUNlbnRlciwgdG9DZW50ZXIsIGZyb21TY2FsZSwgdG9TY2FsZSk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKHRvQ2VudGVyLCB0b1NjYWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlWm9vbShjZW50ZXI6IFZlY3Rvciwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBjb25zdCB6b29tYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tYWJsZScpO1xuICAgICAgICBpZiAoem9vbWFibGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmNhbnZhc1NpemUudGwuYmV0d2Vlbih0aGlzLmNhbnZhc1NpemUuYnIsIDAuNSk7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBvcmlnaW4ueCArICdweCAnICsgb3JpZ2luLnkgKyAncHgnO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZSArICcpIHRyYW5zbGF0ZSgnICsgKG9yaWdpbi54IC0gY2VudGVyLngpICsgJ3B4LCcgKyAob3JpZ2luLnkgLSBjZW50ZXIueSkgKyAncHgpJztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFN0YXRpb25BZGFwdGVyLCBTdGF0aW9uIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuLi9JbnN0YW50XCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdTdGF0aW9uIGltcGxlbWVudHMgU3RhdGlvbkFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdSZWN0RWxlbWVudCkge1xuXG4gICAgfVxuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIG5lZWRzIHRvIGhhdmUgYSBkYXRhLXN0YXRpb24gaWRlbnRpZmllcicpO1xuICAgIH1cbiAgICBnZXQgYmFzZUNvb3JkcygpOiBWZWN0b3IgeyAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHBhcnNlSW50KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gnKSB8fCAnJykgfHwgMCwgcGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneScpIHx8ICcnKSB8fCAwKTtcbiAgICB9XG4gICAgc2V0IGJhc2VDb29yZHMoYmFzZUNvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3gnLCBiYXNlQ29vcmRzLnggKyAnJyk7IFxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd5JywgYmFzZUNvb3Jkcy55ICsgJycpOyBcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG5cbiAgICBnZXQgcm90YXRpb24oKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gUm90YXRpb24uZnJvbSh0aGlzLmVsZW1lbnQuZGF0YXNldC5kaXIgfHwgJ24nKTtcbiAgICB9XG4gICAgZ2V0IGxhYmVsRGlyKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQubGFiZWxEaXIgfHwgJ24nKTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzdGF0aW9uLmRyYXcoMCwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzID0gZ2V0UG9zaXRpb25Cb3VuZGFyaWVzKCk7XG4gICAgICAgIGNvbnN0IHN0b3BEaW1lbiA9IFtwb3NpdGlvbkJvdW5kYXJpZXMueFsxXSAtIHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCBwb3NpdGlvbkJvdW5kYXJpZXMueVsxXSAtIHBvc2l0aW9uQm91bmRhcmllcy55WzBdXTtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdzdGF0aW9uJykpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIHN0YXRpb24gJyArIHRoaXMuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBzdG9wRGltZW5bMF0gPCAwICYmIHN0b3BEaW1lblsxXSA8IDAgPyAnaGlkZGVuJyA6ICd2aXNpYmxlJztcblxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd3aWR0aCcsIChNYXRoLm1heChzdG9wRGltZW5bMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4pICsgJycpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAoTWF0aC5tYXgoc3RvcERpbWVuWzFdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywncm90YXRlKCcgKyB0aGlzLnJvdGF0aW9uLmRlZ3JlZXMgKyAnKSB0cmFuc2xhdGUoJyArIChNYXRoLm1pbihwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgLSBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiAvIDIpICsgJywnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy55WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnKScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtT3JpZ2luKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgdGhpcy5iYXNlQ29vcmRzLnggKyAnICcgKyB0aGlzLmJhc2VDb29yZHMueSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXRpb24ubW92ZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIGZyb20sIHRvLCBjYWxsYmFjayk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb20sIHRvLCAwLCAxL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgeDogbnVtYmVyLCBhbmltYXRpb25QZXJGcmFtZTogbnVtYmVyLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZUNvb3JkcyA9IGZyb20uYmV0d2Vlbih0bywgeCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgeCArPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbGluZS5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIHgsIGFuaW1hdGlvblBlckZyYW1lLCBjYWxsYmFjayk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iYXNlQ29vcmRzID0gdG87XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzdGF0aW9uLmVyYXNlKDApOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFRyYWluQWRhcHRlciB9IGZyb20gXCIuLi9UcmFpblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1RyYWluIGltcGxlbWVudHMgVHJhaW5BZGFwdGVyIHtcbiAgICBzdGF0aWMgV0FHT05fTEVOR1RIID0gMTA7XG4gICAgc3RhdGljIFRSQUNLX09GRlNFVCA9IDA7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG4gICAgYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC50cmFpbiB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcz8uc3BsaXQoL1xccysvKSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucz8ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5zW2ldWzBdICE9ICctJyAmJiB0b2tlbnNbaV1bMF0gIT0gJysnICYmIHRva2Vuc1tpXVswXSAhPSAnKicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3Auc3RhdGlvbklkID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdG9wcy5wdXNoKG5leHRTdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdG9wLnRyYWNrSW5mbyA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3BzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIGZvbGxvdzogeyBwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyIH0pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWluID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdHJhaW4uZHJhdygwLCBhbmltYXRlLCBmb2xsb3cpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFBhdGgodGhpcy5jYWxjVHJhaW5IaW5nZXModGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdykubGVuZ3RoVG9TdGFydCwgZm9sbG93LnBhdGgpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgdHJhaW4nO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZm9sbG93OiB7IHBhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIgfSkge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdHJhaW4gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0cmFpbi5tb3ZlKDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgZm9sbG93KTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRoTGVuZ3RoID0gdGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUoXG4gICAgICAgICAgICBmb2xsb3cucGF0aCxcbiAgICAgICAgICAgIHBhdGhMZW5ndGgudG90YWxCb3VuZGVkTGVuZ3RoLFxuICAgICAgICAgICAgcGF0aExlbmd0aC5sZW5ndGhUb1N0YXJ0LFxuICAgICAgICAgICAgKC1kZWxheVNlY29uZHMpIC8gYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLFxuICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzICogMTAwMCxcbiAgICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UGF0aExlbmd0aChmb2xsb3c6IHsgcGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlciB9KTogeyBsZW5ndGhUb1N0YXJ0OiBudW1iZXIsIHRvdGFsQm91bmRlZExlbmd0aDogbnVtYmVyIH0ge1xuICAgICAgICBsZXQgbGVuZ3RoVG9TdGFydCA9IDA7XG4gICAgICAgIGxldCB0b3RhbEJvdW5kZWRMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvbGxvdy5wYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbCA9IGZvbGxvdy5wYXRoW2ldLmRlbHRhKGZvbGxvdy5wYXRoW2kgKyAxXSkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGkgPCBmb2xsb3cuZnJvbSkge1xuICAgICAgICAgICAgICAgIGxlbmd0aFRvU3RhcnQgKz0gbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IGZvbGxvdy50bykge1xuICAgICAgICAgICAgICAgIHRvdGFsQm91bmRlZExlbmd0aCArPSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGxlbmd0aFRvU3RhcnQ6IGxlbmd0aFRvU3RhcnQsIHRvdGFsQm91bmRlZExlbmd0aDogdG90YWxCb3VuZGVkTGVuZ3RoIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQb3NpdGlvbkJ5TGVuZ3RoKGN1cnJlbnQ6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiBWZWN0b3Ige1xuICAgICAgICBsZXQgdGhyZXNoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBwYXRoW2ldLmRlbHRhKHBhdGhbaSArIDFdKTtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBkZWx0YS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodGhyZXNoICsgbCA+PSBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGhbaV0uYmV0d2VlbihwYXRoW2kgKyAxXSwgKGN1cnJlbnQgLSB0aHJlc2gpIC8gbCkuYWRkKGRlbHRhLnJvdGF0ZShuZXcgUm90YXRpb24oOTApKS53aXRoTGVuZ3RoKFN2Z1RyYWluLlRSQUNLX09GRlNFVCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyZXNoICs9IGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdHJhaW4gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0cmFpbi5lcmFzZSgwKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFBhdGgocGF0aDogVmVjdG9yW10pIHtcbiAgICAgICAgY29uc3QgZCA9ICdNJyArIHBhdGgubWFwKHYgPT4gdi54ICsgJywnICsgdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjVHJhaW5IaW5nZXMoZnJvbnQ6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiBWZWN0b3JbXSB7XG4gICAgICAgIGNvbnN0IG5ld1RyYWluOiBWZWN0b3JbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoICsgMTsgaSsrKSB7XG4gICAgICAgICAgICBuZXdUcmFpbi5wdXNoKHRoaXMuZ2V0UG9zaXRpb25CeUxlbmd0aChmcm9udCAtIGkgKiBTdmdUcmFpbi5XQUdPTl9MRU5HVEgsIHBhdGgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VHJhaW47XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlYXNlKHg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAtKE1hdGguY29zKE1hdGguUEkgKiB4KSAtIDEpIC8gMjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZShwYXRoOiBWZWN0b3JbXSwgdG90YWxCb3VuZGVkTGVuZ3RoOiBudW1iZXIsIGxlbmd0aFRvU3RhcnQ6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uTXM6IG51bWJlciwgc3RhcnRUaW1lOiBET01IaWdoUmVzVGltZVN0YW1wLCBub3c6IERPTUhpZ2hSZXNUaW1lU3RhbXApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgeCA9IChub3cgLSBzdGFydFRpbWUpIC8gYW5pbWF0aW9uRHVyYXRpb25NcyArIG9mZnNldDtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IGxlbmd0aFRvU3RhcnQgKyB0aGlzLmVhc2UoeCkgKiB0b3RhbEJvdW5kZWRMZW5ndGg7XG4gICAgICAgIGNvbnN0IHRyYWluUGF0aCA9IHRoaXMuY2FsY1RyYWluSGluZ2VzKGN1cnJlbnQsIHBhdGgpO1xuICAgICAgICB0aGlzLnNldFBhdGgodHJhaW5QYXRoKTtcblxuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWluID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKHRpbWVzdGFtcCkgeyB0cmFpbi5hbmltYXRlRnJhbWUocGF0aCwgdG90YWxCb3VuZGVkTGVuZ3RoLCBsZW5ndGhUb1N0YXJ0LCBvZmZzZXQsIGFuaW1hdGlvbkR1cmF0aW9uTXMsIHN0YXJ0VGltZSwgdGltZXN0YW1wKTsgfSk7XG4gICAgICAgIH1cbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==