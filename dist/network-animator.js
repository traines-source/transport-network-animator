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

/***/ "./src/Animator.ts":
/*!*************************!*\
  !*** ./src/Animator.ts ***!
  \*************************/
/*! exports provided: Animator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animator", function() { return Animator; });
class Animator {
    constructor() {
        this._from = 0;
        this._to = 1;
        this._timePassed = 0;
        this._ease = Animator.EASE_NONE;
        this.callback = x => true;
        this.startTime = 0;
        this.durationMilliseconds = 0;
    }
    from(from) {
        this._from = from;
        return this;
    }
    to(to) {
        this._to = to;
        return this;
    }
    timePassed(timePassed) {
        this._timePassed = timePassed;
        return this;
    }
    ease(ease) {
        this._ease = ease;
        return this;
    }
    wait(delayMilliseconds, callback) {
        if (delayMilliseconds > 0) {
            this.timeout(callback, delayMilliseconds);
            return;
        }
        callback();
    }
    animate(durationMilliseconds, callback) {
        this.durationMilliseconds = durationMilliseconds;
        this.callback = callback;
        this.startTime = this.now();
        this.frame();
    }
    frame() {
        const now = this.now();
        let x = 1;
        if (this.durationMilliseconds > 0) {
            x = (now - this.startTime + this._timePassed) / this.durationMilliseconds;
        }
        x = Math.max(0, Math.min(1, x));
        const y = this._from + (this._to - this._from) * this._ease(x);
        const cont = this.callback(y, x == 1);
        if (cont && x < 1) {
            this.requestFrame(() => this.frame());
        }
    }
}
Animator.EASE_NONE = x => x;
Animator.EASE_CUBIC = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
Animator.EASE_SINE = x => -(Math.cos(Math.PI * x) - 1) / 2;


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

/***/ "./src/DrawableSorter.ts":
/*!*******************************!*\
  !*** ./src/DrawableSorter.ts ***!
  \*******************************/
/*! exports provided: DrawableSorter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawableSorter", function() { return DrawableSorter; });
/* harmony import */ var _drawables_Line__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawables/Line */ "./src/drawables/Line.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");


class DrawableSorter {
    constructor() {
    }
    sort(elements, draw) {
        if (elements.length == 0) {
            return [];
        }
        const representativeElement = elements[0];
        if (representativeElement instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_0__["Line"] && representativeElement.animOrder != undefined) {
            return this.orderByGeometricDirection(elements, representativeElement.animOrder, draw);
        }
        if (!draw) {
            elements.reverse();
        }
        return [];
    }
    buildSortableCache(elements, direction) {
        const cache = [];
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_0__["Line"]) {
                const element = elements[i];
                let termini = [_Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL];
                if (element.path.length > 1) {
                    termini = [element.path[0], element.path[element.path.length - 1]];
                }
                const proj1 = termini[0].signedLengthProjectedAt(direction);
                const proj2 = termini[1].signedLengthProjectedAt(direction);
                const reverse = proj1 < proj2;
                if (reverse) {
                    termini.reverse();
                }
                cache.push({
                    element: element,
                    termini: termini,
                    projection: Math.max(proj1, proj2),
                    reverse: reverse,
                    animationDuration: element.animationDurationSeconds
                });
            }
        }
        return cache;
    }
    orderByGeometricDirection(elements, direction, draw) {
        var _a;
        const cache = this.buildSortableCache(elements, direction);
        cache.sort((a, b) => (a.projection < b.projection) ? 1 : -1);
        elements.splice(0, elements.length);
        const delays = [];
        for (let i = 0; i < cache.length; i++) {
            const refPoint = cache[i].termini[0];
            let shortest = refPoint.delta(cache[0].termini[0]).length;
            let projectionForShortest = 0;
            let delayForShortest = 0;
            for (let j = 0; j < i; j++) {
                for (let k = 0; k < 2; k++) {
                    const delta = refPoint.delta(cache[j].termini[k]);
                    const potentialShortest = delta.length;
                    if (potentialShortest <= shortest) {
                        shortest = potentialShortest;
                        projectionForShortest = delta.signedLengthProjectedAt(direction);
                        delayForShortest = delays[j].delay + (k == 1 ? cache[j].animationDuration : 0);
                    }
                }
            }
            const noanim = (_a = cache[i].element[draw ? 'from' : 'to']) === null || _a === void 0 ? void 0 : _a.flag.includes('noanim');
            const delay = noanim ? 0 : (delayForShortest + projectionForShortest / cache[i].element.speed);
            delays.push({ delay: delay, reverse: cache[i].reverse == draw });
            elements.push(cache[i].element);
        }
        return delays;
    }
}


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

/***/ "./src/LineGroup.ts":
/*!**************************!*\
  !*** ./src/LineGroup.ts ***!
  \**************************/
/*! exports provided: LineGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LineGroup", function() { return LineGroup; });
/* harmony import */ var _drawables_Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawables/Station */ "./src/drawables/Station.ts");
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
                termini.push(new _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Stop"](stationId, ''));
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
/* harmony import */ var _drawables_Station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drawables/Station */ "./src/drawables/Station.ts");
/* harmony import */ var _Zoomer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Zoomer */ "./src/Zoomer.ts");
/* harmony import */ var _LineGroup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LineGroup */ "./src/LineGroup.ts");
/* harmony import */ var _Gravitator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Gravitator */ "./src/Gravitator.ts");
/* harmony import */ var _drawables_Line__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./drawables/Line */ "./src/drawables/Line.ts");






class Network {
    constructor(adapter, drawableSorter) {
        this.adapter = adapter;
        this.drawableSorter = drawableSorter;
        this.slideIndex = {};
        this.stations = {};
        this.lineGroups = {};
        this.drawableBuffer = [];
        this.gravitator = new _Gravitator__WEBPACK_IMPORTED_MODULE_4__["Gravitator"](this);
        this.zoomer = new _Zoomer__WEBPACK_IMPORTED_MODULE_2__["Zoomer"](this.adapter.canvasSize, this.adapter.zoomMaxScale);
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
            delay = this.populateDrawableBuffer(elements[i], delay, animate, now);
        }
        delay = this.flushDrawableBuffer(delay, animate, now);
        delay = this.gravitator.gravitate(delay, animate);
        this.adapter.zoomTo(this.zoomer.center, this.zoomer.scale, this.zoomer.duration);
        this.zoomer.reset();
        return delay;
    }
    populateDrawableBuffer(element, delay, animate, now) {
        if (!this.isDrawableEliglibleForSameBuffer(element, now)) {
            delay = this.flushDrawableBuffer(delay, animate, now);
        }
        this.drawableBuffer.push(element);
        return delay;
    }
    sortDrawableBuffer(now) {
        if (this.drawableBuffer.length == 0) {
            return [];
        }
        return this.drawableSorter.sort(this.drawableBuffer, this.isDraw(this.drawableBuffer[this.drawableBuffer.length - 1], now));
    }
    flushDrawableBuffer(delay, animate, now) {
        const delays = this.sortDrawableBuffer(now);
        const override = delays.length == this.drawableBuffer.length;
        let maxDelay = delay;
        for (let i = 0; i < this.drawableBuffer.length; i++) {
            const specificDelay = override ? delay + delays[i].delay : maxDelay;
            const overrideReverse = override ? delays[i].reverse : false;
            const newDelay = this.drawOrEraseElement(this.drawableBuffer[i], specificDelay, animate, overrideReverse, now);
            maxDelay = Math.max(newDelay, maxDelay);
        }
        this.drawableBuffer = [];
        return maxDelay;
    }
    isDraw(element, now) {
        return now.equals(element.from);
    }
    isDrawableEliglibleForSameBuffer(element, now) {
        var _a, _b;
        if (this.drawableBuffer.length == 0) {
            return true;
        }
        const lastElement = this.drawableBuffer[this.drawableBuffer.length - 1];
        if (element.name != lastElement.name) {
            return false;
        }
        if (this.isDraw(element, now) != this.isDraw(lastElement, now)) {
            return false;
        }
        if (element instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_5__["Line"] && lastElement instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_5__["Line"] && ((_a = element.animOrder) === null || _a === void 0 ? void 0 : _a.degrees) != ((_b = lastElement.animOrder) === null || _b === void 0 ? void 0 : _b.degrees)) {
            return false;
        }
        return true;
    }
    drawOrEraseElement(element, delay, animate, overrideReverse, now) {
        const draw = this.isDraw(element, now);
        const instant = draw ? element.from : element.to;
        const shouldAnimate = this.shouldAnimate(instant, animate);
        const reverse = overrideReverse != instant.flag.includes('reverse');
        delay += draw
            ? this.drawElement(element, delay, shouldAnimate, reverse)
            : this.eraseElement(element, delay, shouldAnimate, reverse);
        this.zoomer.include(element.boundingBox, element.from, element.to, draw, animate);
        return delay;
    }
    drawElement(element, delay, animate, reverse) {
        if (element instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_5__["Line"]) {
            this.gravitator.addEdge(element);
        }
        return element.draw(delay, animate, reverse);
    }
    eraseElement(element, delay, animate, reverse) {
        return element.erase(delay, animate, reverse);
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
        if (element instanceof _drawables_Station__WEBPACK_IMPORTED_MODULE_1__["Station"]) {
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
        return new Rotation(Rotation.DIRS[direction] || 0);
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
    signedLengthProjectedAt(direction) {
        const s = Vector.UNIT.rotate(direction);
        return this.dotProduct(s) / s.dotProduct(s);
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
        const a = this.angle(dir1).degrees;
        const b = dir1.angle(dir2).degrees;
        return _Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(a % 180, 0) && _Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(b % 180, 0);
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
    constructor(canvasSize, zoomMaxScale = 3) {
        this.canvasSize = canvasSize;
        this.zoomMaxScale = zoomMaxScale;
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
            const minZoomSize = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](canvasSize.x / this.zoomMaxScale, canvasSize.y / this.zoomMaxScale);
            const delta = zoomSize.delta(minZoomSize);
            const additionalSpacing = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](Math.max(0, delta.x / 2), Math.max(0, delta.y / 2));
            return new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](paddedBoundingBox.tl.add(additionalSpacing.rotate(new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](180))), paddedBoundingBox.br.add(additionalSpacing));
        }
        return this.boundingBox;
    }
    paddedBoundingBox(boundingBox) {
        const padding = Zoomer.PADDING_FACTOR * Math.min(this.zoomMaxScale, 8);
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
Zoomer.PADDING_FACTOR = 40;


/***/ }),

/***/ "./src/drawables/AbstractTimedDrawable.ts":
/*!************************************************!*\
  !*** ./src/drawables/AbstractTimedDrawable.ts ***!
  \************************************************/
/*! exports provided: AbstractTimedDrawable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractTimedDrawable", function() { return AbstractTimedDrawable; });
class AbstractTimedDrawable {
    constructor(adapter) {
        this.adapter = adapter;
        this._from = this.adapter.from;
        this._to = this.adapter.to;
        this._name = this.adapter.name;
        this._boundingBox = this.adapter.boundingBox;
    }
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get name() {
        return this._name;
    }
    get boundingBox() {
        return this._boundingBox;
    }
}


/***/ }),

/***/ "./src/drawables/GenericTimedDrawable.ts":
/*!***********************************************!*\
  !*** ./src/drawables/GenericTimedDrawable.ts ***!
  \***********************************************/
/*! exports provided: GenericTimedDrawable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericTimedDrawable", function() { return GenericTimedDrawable; });
/* harmony import */ var _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractTimedDrawable */ "./src/drawables/AbstractTimedDrawable.ts");

class GenericTimedDrawable extends _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_0__["AbstractTimedDrawable"] {
    constructor(adapter) {
        super(adapter);
        this.adapter = adapter;
    }
    draw(delay, animate) {
        this.adapter.draw(delay, !animate ? 0 : this.adapter.from.delta(this.adapter.to));
        return 0;
    }
    erase(delay, animate, reverse) {
        this.adapter.erase(delay);
        return 0;
    }
}


/***/ }),

/***/ "./src/drawables/Image.ts":
/*!********************************!*\
  !*** ./src/drawables/Image.ts ***!
  \********************************/
/*! exports provided: KenImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KenImage", function() { return KenImage; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Zoomer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Zoomer */ "./src/Zoomer.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Instant */ "./src/Instant.ts");
/* harmony import */ var _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbstractTimedDrawable */ "./src/drawables/AbstractTimedDrawable.ts");




class KenImage extends _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_3__["AbstractTimedDrawable"] {
    constructor(adapter) {
        super(adapter);
        this.adapter = adapter;
    }
    draw(delay, animate) {
        const zoomer = new _Zoomer__WEBPACK_IMPORTED_MODULE_1__["Zoomer"](this.boundingBox);
        zoomer.include(this.getZoomedBoundingBox(), _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG, _Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG, true, true, false);
        this.adapter.draw(delay, !animate ? 0 : this.adapter.from.delta(this.adapter.to), zoomer.center, zoomer.scale);
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


/***/ }),

/***/ "./src/drawables/Label.ts":
/*!********************************!*\
  !*** ./src/drawables/Label.ts ***!
  \********************************/
/*! exports provided: Label */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Label", function() { return Label; });
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractTimedDrawable */ "./src/drawables/AbstractTimedDrawable.ts");



class Label extends _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_2__["AbstractTimedDrawable"] {
    constructor(adapter, stationProvider) {
        super(adapter);
        this.adapter = adapter;
        this.stationProvider = stationProvider;
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

/***/ "./src/drawables/Line.ts":
/*!*******************************!*\
  !*** ./src/drawables/Line.ts ***!
  \*******************************/
/*! exports provided: Line */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Line", function() { return Line; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Utils */ "./src/Utils.ts");
/* harmony import */ var _PreferredTrack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../PreferredTrack */ "./src/PreferredTrack.ts");
/* harmony import */ var _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AbstractTimedDrawable */ "./src/drawables/AbstractTimedDrawable.ts");





class Line extends _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_4__["AbstractTimedDrawable"] {
    constructor(adapter, stationProvider, beckStyle = true) {
        super(adapter);
        this.adapter = adapter;
        this.stationProvider = stationProvider;
        this.beckStyle = beckStyle;
        this.weight = this.adapter.weight;
        this.animOrder = this.adapter.animOrder;
        this.precedingStop = undefined;
        this.precedingDir = undefined;
        this._path = [];
    }
    draw(delay, animate, reverse) {
        if (!(this.adapter.totalLength > 0)) {
            this.createLine(delay, animate);
        }
        let duration = this.getAnimationDuration(this._path, animate);
        const lineGroup = this.stationProvider.lineGroupById(this.name);
        lineGroup.addLine(this);
        this.adapter.draw(delay, duration, reverse, this._path, this.getTotalLength(this._path), lineGroup.strokeColor);
        return duration;
    }
    move(delay, animationDurationSeconds, path, colorDeviation) {
        let oldPath = this._path;
        if (oldPath.length < 2 || path.length < 2) {
            console.warn('Trying to move a non-existing line');
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
    get animationDurationSeconds() {
        return this.getAnimationDuration(this._path, true);
    }
    get speed() {
        return this.adapter.speed || Line.SPEED;
    }
    getAnimationDuration(path, animate) {
        if (!animate)
            return 0;
        return this.getTotalLength(path) / this.speed;
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
        if (this._path.length == 0) {
            return this.adapter.termini;
        }
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

/***/ "./src/drawables/Station.ts":
/*!**********************************!*\
  !*** ./src/drawables/Station.ts ***!
  \**********************************/
/*! exports provided: Stop, Station */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stop", function() { return Stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Station", function() { return Station; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils */ "./src/Utils.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbstractTimedDrawable */ "./src/drawables/AbstractTimedDrawable.ts");




class Stop {
    constructor(stationId, trackInfo) {
        this.stationId = stationId;
        this.trackInfo = trackInfo;
        this.coord = null;
    }
}
class Station extends _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_3__["AbstractTimedDrawable"] {
    constructor(adapter) {
        super(adapter);
        this.adapter = adapter;
        this.existingLines = { x: [], y: [] };
        this.existingLabels = [];
        this.phantom = undefined;
        this.rotation = this.adapter.rotation;
        this.labelDir = this.adapter.labelDir;
        this.id = this.adapter.id;
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
    draw(delaySeconds, animate) {
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

/***/ "./src/drawables/Train.ts":
/*!********************************!*\
  !*** ./src/drawables/Train.ts ***!
  \********************************/
/*! exports provided: Train */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Train", function() { return Train; });
/* harmony import */ var _ArrivalDepartureTime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ArrivalDepartureTime */ "./src/ArrivalDepartureTime.ts");
/* harmony import */ var _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractTimedDrawable */ "./src/drawables/AbstractTimedDrawable.ts");


class Train extends _AbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_1__["AbstractTimedDrawable"] {
    constructor(adapter, stationProvider) {
        super(adapter);
        this.adapter = adapter;
        this.stationProvider = stationProvider;
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
                if (animate) {
                    this.adapter.move(delay + arrdep.departure - this.from.second, arrdep.arrival - arrdep.departure, path);
                }
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
/* harmony import */ var _svg_SvgAnimator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./svg/SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _DrawableSorter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DrawableSorter */ "./src/DrawableSorter.ts");





let timePassed = 0;
const network = new _Network__WEBPACK_IMPORTED_MODULE_1__["Network"](new _svg_SvgNetwork__WEBPACK_IMPORTED_MODULE_0__["SvgNetwork"](), new _DrawableSorter__WEBPACK_IMPORTED_MODULE_4__["DrawableSorter"]());
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
        const animator = new _svg_SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delay * 1000, () => slide(next, animate));
    }
}


/***/ }),

/***/ "./src/svg/SvgAbstractTimedDrawable.ts":
/*!*********************************************!*\
  !*** ./src/svg/SvgAbstractTimedDrawable.ts ***!
  \*********************************************/
/*! exports provided: SvgAbstractTimedDrawable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgAbstractTimedDrawable", function() { return SvgAbstractTimedDrawable; });
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Instant */ "./src/Instant.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");



class SvgAbstractTimedDrawable {
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
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x, r.y), new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x + r.width, r.y + r.height));
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

/***/ "./src/svg/SvgAnimator.ts":
/*!********************************!*\
  !*** ./src/svg/SvgAnimator.ts ***!
  \********************************/
/*! exports provided: SvgAnimator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgAnimator", function() { return SvgAnimator; });
/* harmony import */ var _Animator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Animator */ "./src/Animator.ts");

class SvgAnimator extends _Animator__WEBPACK_IMPORTED_MODULE_0__["Animator"] {
    constructor() {
        super();
    }
    now() {
        return performance.now();
    }
    timeout(callback, delayMilliseconds) {
        window.setTimeout(callback, delayMilliseconds);
    }
    requestFrame(callback) {
        window.requestAnimationFrame(callback);
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
/* harmony import */ var _SvgAnimator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SvgAbstractTimedDrawable */ "./src/svg/SvgAbstractTimedDrawable.ts");


class SvgGenericTimedDrawable extends _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_1__["SvgAbstractTimedDrawable"] {
    constructor(element) {
        super(element);
        this.element = element;
    }
    draw(delaySeconds, animationDurationSeconds) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_0__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'visible';
        });
    }
    erase(delaySeconds) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_0__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'hidden';
        });
    }
}


/***/ }),

/***/ "./src/svg/SvgImage.ts":
/*!*****************************!*\
  !*** ./src/svg/SvgImage.ts ***!
  \*****************************/
/*! exports provided: SvgKenImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgKenImage", function() { return SvgKenImage; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _SvgAnimator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SvgAbstractTimedDrawable */ "./src/svg/SvgAbstractTimedDrawable.ts");



class SvgKenImage extends _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_2__["SvgAbstractTimedDrawable"] {
    constructor(element) {
        super(element);
        this.element = element;
    }
    get zoom() {
        if (this.element.dataset['zoom'] != undefined) {
            const center = this.element.dataset['zoom'].split(' ');
            return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](parseInt(center[0]) || 50, parseInt(center[1]) || 50);
        }
        return _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL;
    }
    draw(delaySeconds, animationDurationSeconds, zoomCenter, zoomScale) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_1__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'visible';
            if (animationDurationSeconds > 0) {
                const fromCenter = this.boundingBox.tl.between(this.boundingBox.br, 0.5);
                animator
                    .animate(animationDurationSeconds * 1000, (x, isLast) => this.animateFrame(x, isLast, fromCenter, zoomCenter, 1, zoomScale));
            }
        });
    }
    animateFrame(x, isLast, fromCenter, toCenter, fromScale, toScale) {
        if (!isLast) {
            const delta = fromCenter.delta(toCenter);
            const center = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](delta.x * x, delta.y * x).add(fromCenter);
            const scale = (toScale - fromScale) * x + fromScale;
            this.updateZoom(center, scale);
        }
        else {
            this.updateZoom(toCenter, toScale);
        }
        return true;
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
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_1__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'hidden';
        });
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
/* harmony import */ var _drawables_Label__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../drawables/Label */ "./src/drawables/Label.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Utils */ "./src/Utils.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgNetwork */ "./src/svg/SvgNetwork.ts");
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _SvgAnimator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SvgAbstractTimedDrawable */ "./src/svg/SvgAbstractTimedDrawable.ts");







class SvgLabel extends _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_6__["SvgAbstractTimedDrawable"] {
    constructor(element) {
        super(element);
        this.element = element;
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
            return new _BoundingBox__WEBPACK_IMPORTED_MODULE_4__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x, r.y), new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x + r.width, r.y + r.height));
        }
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_4__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL);
    }
    draw(delaySeconds, textCoords, labelDir, children) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_5__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            if (textCoords != _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL) {
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
        });
    }
    translate(boxDimen, labelDir) {
        const labelunitv = _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].UNIT.rotate(labelDir);
        this.element.style.transform = 'translate('
            + _Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].trilemma(labelunitv.x, [-boxDimen.x + 'px', -boxDimen.x / 2 + 'px', '0px'])
            + ','
            + _Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].trilemma(labelunitv.y, [-_drawables_Label__WEBPACK_IMPORTED_MODULE_0__["Label"].LABEL_HEIGHT + 'px', -_drawables_Label__WEBPACK_IMPORTED_MODULE_0__["Label"].LABEL_HEIGHT / 2 + 'px', '0px']) // TODO magic numbers
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
        this.translate(new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](bbox.width / scale, bbox.height / scale), labelDir);
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
        this.translate(new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](this.element.getBBox().width, this.element.getBBox().height), labelDir);
    }
    erase(delaySeconds) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_5__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'hidden';
        });
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
        const lineLabel = document.createElementNS(_SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].SVGNS, 'foreignObject');
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
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _SvgAnimator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgAbstractTimedDrawable */ "./src/svg/SvgAbstractTimedDrawable.ts");
/* harmony import */ var _SvgUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgUtils */ "./src/svg/SvgUtils.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");






class SvgLine extends _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_3__["SvgAbstractTimedDrawable"] {
    constructor(element) {
        super(element);
        this.element = element;
        this._stops = [];
        this._boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_1__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
    }
    get name() {
        return this.element.dataset.line || '';
    }
    get boundingBox() {
        return this._boundingBox;
    }
    get weight() {
        if (this.element.dataset.weight == undefined) {
            return undefined;
        }
        return parseInt(this.element.dataset.weight);
    }
    get totalLength() {
        return this.element.getTotalLength();
    }
    get termini() {
        const d = this.element.getAttribute('d');
        return _SvgUtils__WEBPACK_IMPORTED_MODULE_4__["SvgUtils"].readTermini(d || undefined);
    }
    get animOrder() {
        if (this.element.dataset.animOrder == undefined) {
            return undefined;
        }
        return _Rotation__WEBPACK_IMPORTED_MODULE_5__["Rotation"].from(this.element.dataset.animOrder);
    }
    get speed() {
        if (this.element.dataset.speed == undefined) {
            return undefined;
        }
        return parseInt(this.element.dataset.speed);
    }
    updateBoundingBox(path) {
        const lBox = this.element.getBBox();
        if (document.getElementById('zoomable') != undefined) {
            const zoomable = document.getElementById('zoomable');
            const zRect = zoomable.getBoundingClientRect();
            const zBox = zoomable.getBBox();
            const lRect = this.element.getBoundingClientRect();
            const zScale = zBox.width / zRect.width;
            const x = (lRect.x - zRect.x) * zScale + zBox.x;
            const y = (lRect.y - zRect.y) * zScale + zBox.y;
            this._boundingBox.tl = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](x, y);
            this._boundingBox.br = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](x + lRect.width * zScale, y + lRect.height * zScale);
            return;
        }
        this._boundingBox.tl = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](lBox.x, lBox.y);
        this._boundingBox.br = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](lBox.x + lBox.width, lBox.y + lBox.height);
    }
    get stops() {
        if (this._stops.length == 0) {
            this._stops = _SvgUtils__WEBPACK_IMPORTED_MODULE_4__["SvgUtils"].readStops(this.element.dataset.stops);
        }
        return this._stops;
    }
    draw(delaySeconds, animationDurationSeconds, reverse, path, length, colorDeviation) {
        this.element.style.visibility = 'hidden';
        this.createPath(path);
        this.updateBoundingBox(path);
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_2__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.className.baseVal += ' line ' + this.name;
            this.element.style.visibility = 'visible';
            this.updateDasharray(length);
            if (colorDeviation != 0) {
                this.updateColor(colorDeviation);
            }
            if (animationDurationSeconds == 0) {
                length = 0;
            }
            const direction = reverse ? -1 : 1;
            animator
                .from(length * direction)
                .to(0)
                .animate(animationDurationSeconds * 1000, (x, isLast) => this.animateFrame(x, isLast));
        });
    }
    move(delaySeconds, animationDurationSeconds, from, to, colorFrom, colorTo) {
        this.updateBoundingBox(to);
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_2__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            animator.animate(animationDurationSeconds * 1000, (x, isLast) => this.animateFrameVector(from, to, colorFrom, colorTo, x, isLast));
        });
    }
    erase(delaySeconds, animationDurationSeconds, reverse, length) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_2__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            let from = 0;
            if (animationDurationSeconds == 0) {
                from = length;
            }
            const direction = reverse ? -1 : 1;
            animator
                .from(from)
                .to(length * direction)
                .animate(animationDurationSeconds * 1000, (x, isLast) => this.animateFrame(x, isLast));
        });
    }
    createPath(path) {
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
    animateFrame(x, isLast) {
        this.element.style.strokeDashoffset = x + '';
        if (isLast && x != 0) {
            this.element.style.visibility = 'hidden';
        }
        return true;
    }
    animateFrameVector(from, to, colorFrom, colorTo, x, isLast) {
        if (!isLast) {
            const interpolated = [];
            for (let i = 0; i < from.length; i++) {
                interpolated.push(from[i].between(to[i], x));
            }
            this.updateDasharray(interpolated[0].delta(interpolated[interpolated.length - 1]).length); // TODO arbitrary node count
            this.createPath(interpolated);
            this.updateColor((colorTo - colorFrom) * x + colorFrom);
        }
        else {
            this.updateDasharray(to[0].delta(to[to.length - 1]).length);
            this.createPath(to);
        }
        return true;
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
/* harmony import */ var _drawables_Station__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../drawables/Station */ "./src/drawables/Station.ts");
/* harmony import */ var _drawables_Line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../drawables/Line */ "./src/drawables/Line.ts");
/* harmony import */ var _SvgLine__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgLine */ "./src/svg/SvgLine.ts");
/* harmony import */ var _SvgStation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SvgStation */ "./src/svg/SvgStation.ts");
/* harmony import */ var _drawables_Label__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../drawables/Label */ "./src/drawables/Label.ts");
/* harmony import */ var _SvgLabel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SvgLabel */ "./src/svg/SvgLabel.ts");
/* harmony import */ var _drawables_GenericTimedDrawable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../drawables/GenericTimedDrawable */ "./src/drawables/GenericTimedDrawable.ts");
/* harmony import */ var _SvgGenericTimedDrawable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SvgGenericTimedDrawable */ "./src/svg/SvgGenericTimedDrawable.ts");
/* harmony import */ var _Zoomer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Zoomer */ "./src/Zoomer.ts");
/* harmony import */ var _drawables_Train__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../drawables/Train */ "./src/drawables/Train.ts");
/* harmony import */ var _SvgTrain__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SvgTrain */ "./src/svg/SvgTrain.ts");
/* harmony import */ var _SvgAnimator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _SvgImage__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./SvgImage */ "./src/svg/SvgImage.ts");
/* harmony import */ var _drawables_Image__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../drawables/Image */ "./src/drawables/Image.ts");
















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
    get zoomMaxScale() {
        const svg = document.querySelector('svg');
        if ((svg === null || svg === void 0 ? void 0 : svg.dataset.zoomMaxScale) == undefined) {
            return 3;
        }
        return parseInt(svg === null || svg === void 0 ? void 0 : svg.dataset.zoomMaxScale);
    }
    get beckStyle() {
        const svg = document.querySelector('svg');
        return (svg === null || svg === void 0 ? void 0 : svg.dataset.beckStyle) != 'false';
    }
    initialize(network) {
        if (!document.getElementById("elements")) {
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
            return new _drawables_Line__WEBPACK_IMPORTED_MODULE_3__["Line"](new _SvgLine__WEBPACK_IMPORTED_MODULE_4__["SvgLine"](element), network, this.beckStyle);
        }
        else if (element.localName == 'path' && element.dataset.train != undefined) {
            return new _drawables_Train__WEBPACK_IMPORTED_MODULE_11__["Train"](new _SvgTrain__WEBPACK_IMPORTED_MODULE_12__["SvgTrain"](element), network);
        }
        else if (element.localName == 'rect' && element.dataset.station != undefined) {
            return new _drawables_Station__WEBPACK_IMPORTED_MODULE_2__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_5__["SvgStation"](element));
        }
        else if (element.localName == 'text') {
            return new _drawables_Label__WEBPACK_IMPORTED_MODULE_6__["Label"](new _SvgLabel__WEBPACK_IMPORTED_MODULE_7__["SvgLabel"](element), network);
        }
        else if (element.localName == 'image') {
            return new _drawables_Image__WEBPACK_IMPORTED_MODULE_15__["KenImage"](new _SvgImage__WEBPACK_IMPORTED_MODULE_14__["SvgKenImage"](element));
        }
        else if (element.dataset.from != undefined || element.dataset.to != undefined) {
            return new _drawables_GenericTimedDrawable__WEBPACK_IMPORTED_MODULE_8__["GenericTimedDrawable"](new _SvgGenericTimedDrawable__WEBPACK_IMPORTED_MODULE_9__["SvgGenericTimedDrawable"](element));
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
        return new _drawables_Station__WEBPACK_IMPORTED_MODULE_2__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_5__["SvgStation"](helpStop));
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
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_13__["SvgAnimator"]();
        const defaultBehaviour = animationDurationSeconds <= _Zoomer__WEBPACK_IMPORTED_MODULE_10__["Zoomer"].ZOOM_DURATION;
        animator.wait(defaultBehaviour ? 0 : _Zoomer__WEBPACK_IMPORTED_MODULE_10__["Zoomer"].ZOOM_DURATION * 1000, () => {
            const currentZoomCenter = this.currentZoomCenter;
            const currentZoomScale = this.currentZoomScale;
            animator
                .ease(defaultBehaviour ? _SvgAnimator__WEBPACK_IMPORTED_MODULE_13__["SvgAnimator"].EASE_CUBIC : _SvgAnimator__WEBPACK_IMPORTED_MODULE_13__["SvgAnimator"].EASE_NONE)
                .animate(animationDurationSeconds * 1000, (x, isLast) => {
                this.animateFrame(x, isLast, currentZoomCenter, zoomCenter, currentZoomScale, zoomScale);
                return true;
            });
            this.currentZoomCenter = zoomCenter;
            this.currentZoomScale = zoomScale;
        });
    }
    animateFrame(x, isLast, fromCenter, toCenter, fromScale, toScale) {
        if (!isLast) {
            const delta = fromCenter.delta(toCenter);
            const center = new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](delta.x * x, delta.y * x).add(fromCenter);
            const scale = (toScale - fromScale) * x + fromScale;
            this.updateZoom(center, scale);
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
/* harmony import */ var _drawables_Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../drawables/Station */ "./src/drawables/Station.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");
/* harmony import */ var _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgAbstractTimedDrawable */ "./src/svg/SvgAbstractTimedDrawable.ts");





class SvgStation extends _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_4__["SvgAbstractTimedDrawable"] {
    constructor(element) {
        super(element);
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
    get rotation() {
        return _Rotation__WEBPACK_IMPORTED_MODULE_2__["Rotation"].from(this.element.dataset.dir || 'n');
    }
    get labelDir() {
        return _Rotation__WEBPACK_IMPORTED_MODULE_2__["Rotation"].from(this.element.dataset.labelDir || 'n');
    }
    draw(delaySeconds, getPositionBoundaries) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            const positionBoundaries = getPositionBoundaries();
            const stopDimen = [positionBoundaries.x[1] - positionBoundaries.x[0], positionBoundaries.y[1] - positionBoundaries.y[0]];
            if (!this.element.className.baseVal.includes('station')) {
                this.element.className.baseVal += ' station ' + this.id;
            }
            this.element.style.visibility = stopDimen[0] < 0 && stopDimen[1] < 0 ? 'hidden' : 'visible';
            this.element.setAttribute('width', (Math.max(stopDimen[0], 0) * _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE + _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN) + '');
            this.element.setAttribute('height', (Math.max(stopDimen[1], 0) * _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE + _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN) + '');
            this.updateTransformOrigin();
            this.element.setAttribute('transform', 'rotate(' + this.rotation.degrees + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE - _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE - _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN / 2) + ')');
        });
    }
    updateTransformOrigin() {
        this.element.setAttribute('transform-origin', this.baseCoords.x + ' ' + this.baseCoords.y);
    }
    move(delaySeconds, animationDurationSeconds, from, to, callback) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            animator
                .animate(animationDurationSeconds * 1000, (x, isLast) => this.animateFrameVector(x, isLast, from, to, callback));
        });
    }
    animateFrameVector(x, isLast, from, to, callback) {
        if (!isLast) {
            this.baseCoords = from.between(to, x);
        }
        else {
            this.baseCoords = to;
        }
        this.updateTransformOrigin();
        callback();
        return true;
    }
    erase(delaySeconds) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'hidden';
        });
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
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Rotation */ "./src/Rotation.ts");
/* harmony import */ var _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgAnimator */ "./src/svg/SvgAnimator.ts");
/* harmony import */ var _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgAbstractTimedDrawable */ "./src/svg/SvgAbstractTimedDrawable.ts");
/* harmony import */ var _SvgUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SvgUtils */ "./src/svg/SvgUtils.ts");






class SvgTrain extends _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_4__["SvgAbstractTimedDrawable"] {
    constructor(element) {
        super(element);
        this.element = element;
        this._stops = [];
    }
    get name() {
        return this.element.dataset.train || '';
    }
    get boundingBox() {
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_1__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
    }
    get length() {
        if (this.element.dataset.length == undefined) {
            return 2;
        }
        return parseInt(this.element.dataset.length);
    }
    get stops() {
        if (this._stops.length == 0) {
            this._stops = _SvgUtils__WEBPACK_IMPORTED_MODULE_5__["SvgUtils"].readStops(this.element.dataset.stops);
        }
        return this._stops;
    }
    draw(delaySeconds, animate, follow) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.setPath(this.calcTrainHinges(this.getPathLength(follow).lengthToStart, follow.path));
            this.element.className.baseVal += ' train';
            this.element.style.visibility = 'visible';
        });
    }
    move(delaySeconds, animationDurationSeconds, follow) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            const pathLength = this.getPathLength(follow);
            animator
                .ease(_SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"].EASE_SINE)
                .from(pathLength.lengthToStart)
                .to(pathLength.lengthToStart + pathLength.totalBoundedLength)
                .timePassed(delaySeconds < 0 ? (-delaySeconds * 1000) : 0)
                .animate(animationDurationSeconds * 1000, (x, isLast) => this.animateFrame(x, follow.path));
        });
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
                return path[i].between(path[i + 1], (current - thresh) / l).add(delta.rotate(new _Rotation__WEBPACK_IMPORTED_MODULE_2__["Rotation"](90)).withLength(SvgTrain.TRACK_OFFSET));
            }
            thresh += l;
        }
        return path[path.length - 1];
    }
    erase(delaySeconds) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'hidden';
        });
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
    animateFrame(x, path) {
        const trainPath = this.calcTrainHinges(x, path);
        this.setPath(trainPath);
        return true;
    }
}
SvgTrain.WAGON_LENGTH = 10;
SvgTrain.TRACK_OFFSET = 0;


/***/ }),

/***/ "./src/svg/SvgUtils.ts":
/*!*****************************!*\
  !*** ./src/svg/SvgUtils.ts ***!
  \*****************************/
/*! exports provided: SvgUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgUtils", function() { return SvgUtils; });
/* harmony import */ var _drawables_Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../drawables/Station */ "./src/drawables/Station.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");


class SvgUtils {
    static readStops(stopsString) {
        const stops = [];
        const tokens = (stopsString === null || stopsString === void 0 ? void 0 : stopsString.split(/\s+/)) || [];
        let nextStop = new _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Stop"]('', '');
        for (var i = 0; i < (tokens === null || tokens === void 0 ? void 0 : tokens.length); i++) {
            if (tokens[i][0] != '-' && tokens[i][0] != '+' && tokens[i][0] != '*') {
                nextStop.stationId = tokens[i];
                stops.push(nextStop);
                nextStop = new _drawables_Station__WEBPACK_IMPORTED_MODULE_0__["Stop"]('', '');
            }
            else {
                nextStop.trackInfo = tokens[i];
            }
        }
        return stops;
    }
    static readTermini(terminiString) {
        const numbers = terminiString === null || terminiString === void 0 ? void 0 : terminiString.trim().split(/[^\d.]+/);
        if (numbers != undefined) {
            return [
                new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](parseFloat(numbers[1]), parseFloat(numbers[2])),
                new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](parseFloat(numbers[numbers.length - 2]), parseFloat(numbers[numbers.length - 1]))
            ];
        }
        return [];
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQW5pbWF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Fycml2YWxEZXBhcnR1cmVUaW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9Cb3VuZGluZ0JveC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvRHJhd2FibGVTb3J0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXZpdGF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luc3RhbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9VdGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmVjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9ab29tZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9BYnN0cmFjdFRpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9HZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhd2FibGVzL0ltYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9kcmF3YWJsZXMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9MaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9kcmF3YWJsZXMvU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhd2FibGVzL1RyYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnQW5pbWF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdHZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z0ltYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdMaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1N0YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdUcmFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBLElBQUksS0FBNEQ7QUFDaEUsSUFBSSxTQUM0QztBQUNoRCxDQUFD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QUMsT0FBTyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNGLENBQUM7U0FDTDtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUVKIiwiZmlsZSI6Im5ldHdvcmstYW5pbWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgICAoZmFjdG9yeSgoZ2xvYmFsLmZtaW4gPSBnbG9iYWwuZm1pbiB8fCB7fSkpKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqIGZpbmRzIHRoZSB6ZXJvcyBvZiBhIGZ1bmN0aW9uLCBnaXZlbiB0d28gc3RhcnRpbmcgcG9pbnRzICh3aGljaCBtdXN0XG4gICAgICogaGF2ZSBvcHBvc2l0ZSBzaWducyAqL1xuICAgIGZ1bmN0aW9uIGJpc2VjdChmLCBhLCBiLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtZXRlcnMubWF4SXRlcmF0aW9ucyB8fCAxMDAsXG4gICAgICAgICAgICB0b2xlcmFuY2UgPSBwYXJhbWV0ZXJzLnRvbGVyYW5jZSB8fCAxZS0xMCxcbiAgICAgICAgICAgIGZBID0gZihhKSxcbiAgICAgICAgICAgIGZCID0gZihiKSxcbiAgICAgICAgICAgIGRlbHRhID0gYiAtIGE7XG5cbiAgICAgICAgaWYgKGZBICogZkIgPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkluaXRpYWwgYmlzZWN0IHBvaW50cyBtdXN0IGhhdmUgb3Bwb3NpdGUgc2lnbnNcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmQSA9PT0gMCkgcmV0dXJuIGE7XG4gICAgICAgIGlmIChmQiA9PT0gMCkgcmV0dXJuIGI7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGRlbHRhIC89IDI7XG4gICAgICAgICAgICB2YXIgbWlkID0gYSArIGRlbHRhLFxuICAgICAgICAgICAgICAgIGZNaWQgPSBmKG1pZCk7XG5cbiAgICAgICAgICAgIGlmIChmTWlkICogZkEgPj0gMCkge1xuICAgICAgICAgICAgICAgIGEgPSBtaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoTWF0aC5hYnMoZGVsdGEpIDwgdG9sZXJhbmNlKSB8fCAoZk1pZCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhICsgZGVsdGE7XG4gICAgfVxuXG4gICAgLy8gbmVlZCBzb21lIGJhc2ljIG9wZXJhdGlvbnMgb24gdmVjdG9ycywgcmF0aGVyIHRoYW4gYWRkaW5nIGEgZGVwZW5kZW5jeSxcbiAgICAvLyBqdXN0IGRlZmluZSBoZXJlXG4gICAgZnVuY3Rpb24gemVyb3MoeCkgeyB2YXIgciA9IG5ldyBBcnJheSh4KTsgZm9yICh2YXIgaSA9IDA7IGkgPCB4OyArK2kpIHsgcltpXSA9IDA7IH0gcmV0dXJuIHI7IH1cbiAgICBmdW5jdGlvbiB6ZXJvc00oeCx5KSB7IHJldHVybiB6ZXJvcyh4KS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiB6ZXJvcyh5KTsgfSk7IH1cblxuICAgIGZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gICAgICAgIHZhciByZXQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJldCArPSBhW2ldICogYltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm0yKGEpICB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZG90KGEsIGEpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZShyZXQsIHZhbHVlLCBjKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJldFtpXSA9IHZhbHVlW2ldICogYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlaWdodGVkU3VtKHJldCwgdzEsIHYxLCB3MiwgdjIpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIHJldFtqXSA9IHcxICogdjFbal0gKyB3MiAqIHYyW2pdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIG1pbmltaXplcyBhIGZ1bmN0aW9uIHVzaW5nIHRoZSBkb3duaGlsbCBzaW1wbGV4IG1ldGhvZCAqL1xuICAgIGZ1bmN0aW9uIG5lbGRlck1lYWQoZiwgeDAsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgfHwge307XG5cbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJzLm1heEl0ZXJhdGlvbnMgfHwgeDAubGVuZ3RoICogMjAwLFxuICAgICAgICAgICAgbm9uWmVyb0RlbHRhID0gcGFyYW1ldGVycy5ub25aZXJvRGVsdGEgfHwgMS4wNSxcbiAgICAgICAgICAgIHplcm9EZWx0YSA9IHBhcmFtZXRlcnMuemVyb0RlbHRhIHx8IDAuMDAxLFxuICAgICAgICAgICAgbWluRXJyb3JEZWx0YSA9IHBhcmFtZXRlcnMubWluRXJyb3JEZWx0YSB8fCAxZS02LFxuICAgICAgICAgICAgbWluVG9sZXJhbmNlID0gcGFyYW1ldGVycy5taW5FcnJvckRlbHRhIHx8IDFlLTUsXG4gICAgICAgICAgICByaG8gPSAocGFyYW1ldGVycy5yaG8gIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnJobyA6IDEsXG4gICAgICAgICAgICBjaGkgPSAocGFyYW1ldGVycy5jaGkgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLmNoaSA6IDIsXG4gICAgICAgICAgICBwc2kgPSAocGFyYW1ldGVycy5wc2kgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnBzaSA6IC0wLjUsXG4gICAgICAgICAgICBzaWdtYSA9IChwYXJhbWV0ZXJzLnNpZ21hICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5zaWdtYSA6IDAuNSxcbiAgICAgICAgICAgIG1heERpZmY7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBzaW1wbGV4LlxuICAgICAgICB2YXIgTiA9IHgwLmxlbmd0aCxcbiAgICAgICAgICAgIHNpbXBsZXggPSBuZXcgQXJyYXkoTiArIDEpO1xuICAgICAgICBzaW1wbGV4WzBdID0geDA7XG4gICAgICAgIHNpbXBsZXhbMF0uZnggPSBmKHgwKTtcbiAgICAgICAgc2ltcGxleFswXS5pZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSB4MC5zbGljZSgpO1xuICAgICAgICAgICAgcG9pbnRbaV0gPSBwb2ludFtpXSA/IHBvaW50W2ldICogbm9uWmVyb0RlbHRhIDogemVyb0RlbHRhO1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdID0gcG9pbnQ7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0uZnggPSBmKHBvaW50KTtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXS5pZCA9IGkrMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNpbXBsZXgodmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzaW1wbGV4W05dW2ldID0gdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaW1wbGV4W05dLmZ4ID0gdmFsdWUuZng7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc29ydE9yZGVyID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS5meCAtIGIuZng7IH07XG5cbiAgICAgICAgdmFyIGNlbnRyb2lkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIHJlZmxlY3RlZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICBjb250cmFjdGVkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIGV4cGFuZGVkID0geDAuc2xpY2UoKTtcblxuICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCBtYXhJdGVyYXRpb25zOyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgc2ltcGxleC5zb3J0KHNvcnRPcmRlcik7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb3B5IHRoZSBzaW1wbGV4IChzaW5jZSBsYXRlciBpdGVyYXRpb25zIHdpbGwgbXV0YXRlKSBhbmRcbiAgICAgICAgICAgICAgICAvLyBzb3J0IGl0IHRvIGhhdmUgYSBjb25zaXN0ZW50IG9yZGVyIGJldHdlZW4gaXRlcmF0aW9uc1xuICAgICAgICAgICAgICAgIHZhciBzb3J0ZWRTaW1wbGV4ID0gc2ltcGxleC5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0geC5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5meCA9IHguZng7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmlkID0geC5pZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNvcnRlZFNpbXBsZXguc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEuaWQgLSBiLmlkOyB9KTtcblxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuaGlzdG9yeS5wdXNoKHt4OiBzaW1wbGV4WzBdLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBzaW1wbGV4WzBdLmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGV4OiBzb3J0ZWRTaW1wbGV4fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1heERpZmYgPSAwO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgICAgIG1heERpZmYgPSBNYXRoLm1heChtYXhEaWZmLCBNYXRoLmFicyhzaW1wbGV4WzBdW2ldIC0gc2ltcGxleFsxXVtpXSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKE1hdGguYWJzKHNpbXBsZXhbMF0uZnggLSBzaW1wbGV4W05dLmZ4KSA8IG1pbkVycm9yRGVsdGEpICYmXG4gICAgICAgICAgICAgICAgKG1heERpZmYgPCBtaW5Ub2xlcmFuY2UpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbXB1dGUgdGhlIGNlbnRyb2lkIG9mIGFsbCBidXQgdGhlIHdvcnN0IHBvaW50IGluIHRoZSBzaW1wbGV4XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICAgICAgY2VudHJvaWRbaV0gPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldICs9IHNpbXBsZXhbal1baV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldIC89IE47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlZmxlY3QgdGhlIHdvcnN0IHBvaW50IHBhc3QgdGhlIGNlbnRyb2lkICBhbmQgY29tcHV0ZSBsb3NzIGF0IHJlZmxlY3RlZFxuICAgICAgICAgICAgLy8gcG9pbnRcbiAgICAgICAgICAgIHZhciB3b3JzdCA9IHNpbXBsZXhbTl07XG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShyZWZsZWN0ZWQsIDErcmhvLCBjZW50cm9pZCwgLXJobywgd29yc3QpO1xuICAgICAgICAgICAgcmVmbGVjdGVkLmZ4ID0gZihyZWZsZWN0ZWQpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgcmVmbGVjdGVkIHBvaW50IGlzIHRoZSBiZXN0IHNlZW4sIHRoZW4gcG9zc2libHkgZXhwYW5kXG4gICAgICAgICAgICBpZiAocmVmbGVjdGVkLmZ4IDwgc2ltcGxleFswXS5meCkge1xuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKGV4cGFuZGVkLCAxK2NoaSwgY2VudHJvaWQsIC1jaGksIHdvcnN0KTtcbiAgICAgICAgICAgICAgICBleHBhbmRlZC5meCA9IGYoZXhwYW5kZWQpO1xuICAgICAgICAgICAgICAgIGlmIChleHBhbmRlZC5meCA8IHJlZmxlY3RlZC5meCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICB9ICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChyZWZsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlZmxlY3RlZCBwb2ludCBpcyB3b3JzZSB0aGFuIHRoZSBzZWNvbmQgd29yc3QsIHdlIG5lZWQgdG9cbiAgICAgICAgICAgIC8vIGNvbnRyYWN0XG4gICAgICAgICAgICBlbHNlIGlmIChyZWZsZWN0ZWQuZnggPj0gc2ltcGxleFtOLTFdLmZ4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3VsZFJlZHVjZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlZmxlY3RlZC5meCA+IHdvcnN0LmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGFuIGluc2lkZSBjb250cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShjb250cmFjdGVkLCAxK3BzaSwgY2VudHJvaWQsIC1wc2ksIHdvcnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3RlZC5meCA9IGYoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cmFjdGVkLmZ4IDwgd29yc3QuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRSZWR1Y2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYW4gb3V0c2lkZSBjb250cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShjb250cmFjdGVkLCAxLXBzaSAqIHJobywgY2VudHJvaWQsIHBzaSpyaG8sIHdvcnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3RlZC5meCA9IGYoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cmFjdGVkLmZ4IDwgcmVmbGVjdGVkLmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRSZWR1Y2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZG9uJ3QgY29udHJhY3QgaGVyZSwgd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2lnbWEgPj0gMSkgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYSByZWR1Y3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IHNpbXBsZXgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHNpbXBsZXhbaV0sIDEgLSBzaWdtYSwgc2ltcGxleFswXSwgc2lnbWEsIHNpbXBsZXhbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxleFtpXS5meCA9IGYoc2ltcGxleFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgocmVmbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNpbXBsZXguc29ydChzb3J0T3JkZXIpO1xuICAgICAgICByZXR1cm4ge2Z4IDogc2ltcGxleFswXS5meCxcbiAgICAgICAgICAgICAgICB4IDogc2ltcGxleFswXX07XG4gICAgfVxuXG4gICAgLy8vIHNlYXJjaGVzIGFsb25nIGxpbmUgJ3BrJyBmb3IgYSBwb2ludCB0aGF0IHNhdGlmaWVzIHRoZSB3b2xmZSBjb25kaXRpb25zXG4gICAgLy8vIFNlZSAnTnVtZXJpY2FsIE9wdGltaXphdGlvbicgYnkgTm9jZWRhbCBhbmQgV3JpZ2h0IHA1OS02MFxuICAgIC8vLyBmIDogb2JqZWN0aXZlIGZ1bmN0aW9uXG4gICAgLy8vIHBrIDogc2VhcmNoIGRpcmVjdGlvblxuICAgIC8vLyBjdXJyZW50OiBvYmplY3QgY29udGFpbmluZyBjdXJyZW50IGdyYWRpZW50L2xvc3NcbiAgICAvLy8gbmV4dDogb3V0cHV0OiBjb250YWlucyBuZXh0IGdyYWRpZW50L2xvc3NcbiAgICAvLy8gcmV0dXJucyBhOiBzdGVwIHNpemUgdGFrZW5cbiAgICBmdW5jdGlvbiB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGEsIGMxLCBjMikge1xuICAgICAgICB2YXIgcGhpMCA9IGN1cnJlbnQuZngsIHBoaVByaW1lMCA9IGRvdChjdXJyZW50LmZ4cHJpbWUsIHBrKSxcbiAgICAgICAgICAgIHBoaSA9IHBoaTAsIHBoaV9vbGQgPSBwaGkwLFxuICAgICAgICAgICAgcGhpUHJpbWUgPSBwaGlQcmltZTAsXG4gICAgICAgICAgICBhMCA9IDA7XG5cbiAgICAgICAgYSA9IGEgfHwgMTtcbiAgICAgICAgYzEgPSBjMSB8fCAxZS02O1xuICAgICAgICBjMiA9IGMyIHx8IDAuMTtcblxuICAgICAgICBmdW5jdGlvbiB6b29tKGFfbG8sIGFfaGlnaCwgcGhpX2xvKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCAxNjsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBhID0gKGFfbG8gKyBhX2hpZ2gpLzI7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0obmV4dC54LCAxLjAsIGN1cnJlbnQueCwgYSwgcGspO1xuICAgICAgICAgICAgICAgIHBoaSA9IG5leHQuZnggPSBmKG5leHQueCwgbmV4dC5meHByaW1lKTtcbiAgICAgICAgICAgICAgICBwaGlQcmltZSA9IGRvdChuZXh0LmZ4cHJpbWUsIHBrKTtcblxuICAgICAgICAgICAgICAgIGlmICgocGhpID4gKHBoaTAgKyBjMSAqIGEgKiBwaGlQcmltZTApKSB8fFxuICAgICAgICAgICAgICAgICAgICAocGhpID49IHBoaV9sbykpIHtcbiAgICAgICAgICAgICAgICAgICAgYV9oaWdoID0gYTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMocGhpUHJpbWUpIDw9IC1jMiAqIHBoaVByaW1lMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocGhpUHJpbWUgKiAoYV9oaWdoIC0gYV9sbykgPj0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhX2hpZ2ggPSBhX2xvO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYV9sbyA9IGE7XG4gICAgICAgICAgICAgICAgICAgIHBoaV9sbyA9IHBoaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgMTA7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShuZXh0LngsIDEuMCwgY3VycmVudC54LCBhLCBwayk7XG4gICAgICAgICAgICBwaGkgPSBuZXh0LmZ4ID0gZihuZXh0LngsIG5leHQuZnhwcmltZSk7XG4gICAgICAgICAgICBwaGlQcmltZSA9IGRvdChuZXh0LmZ4cHJpbWUsIHBrKTtcbiAgICAgICAgICAgIGlmICgocGhpID4gKHBoaTAgKyBjMSAqIGEgKiBwaGlQcmltZTApKSB8fFxuICAgICAgICAgICAgICAgIChpdGVyYXRpb24gJiYgKHBoaSA+PSBwaGlfb2xkKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbShhMCwgYSwgcGhpX29sZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhwaGlQcmltZSkgPD0gLWMyICogcGhpUHJpbWUwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwaGlQcmltZSA+PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6b29tKGEsIGEwLCBwaGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwaGlfb2xkID0gcGhpO1xuICAgICAgICAgICAgYTAgPSBhO1xuICAgICAgICAgICAgYSAqPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uanVnYXRlR3JhZGllbnQoZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIC8vIGFsbG9jYXRlIGFsbCBtZW1vcnkgdXAgZnJvbnQgaGVyZSwga2VlcCBvdXQgb2YgdGhlIGxvb3AgZm9yIHBlcmZvbWFuY2VcbiAgICAgICAgLy8gcmVhc29uc1xuICAgICAgICB2YXIgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbmV4dCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgeWsgPSBpbml0aWFsLnNsaWNlKCksXG4gICAgICAgICAgICBwaywgdGVtcCxcbiAgICAgICAgICAgIGEgPSAxLFxuICAgICAgICAgICAgbWF4SXRlcmF0aW9ucztcblxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDIwO1xuXG4gICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgcGsgPSBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKTtcbiAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwtMSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGEgPSB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGEpO1xuXG4gICAgICAgICAgICAvLyB0b2RvOiBoaXN0b3J5IGluIHdyb25nIHNwb3Q/XG4gICAgICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogYX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWEpIHtcbiAgICAgICAgICAgICAgICAvLyBmYWlpbGVkIHRvIGZpbmQgcG9pbnQgdGhhdCBzYXRpZmllcyB3b2xmZSBjb25kaXRpb25zLlxuICAgICAgICAgICAgICAgIC8vIHJlc2V0IGRpcmVjdGlvbiBmb3IgbmV4dCBpdGVyYXRpb25cbiAgICAgICAgICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLCAtMSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGRpcmVjdGlvbiB1c2luZyBQb2xha+KAk1JpYmllcmUgQ0cgbWV0aG9kXG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oeWssIDEsIG5leHQuZnhwcmltZSwgLTEsIGN1cnJlbnQuZnhwcmltZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGVsdGFfayA9IGRvdChjdXJyZW50LmZ4cHJpbWUsIGN1cnJlbnQuZnhwcmltZSksXG4gICAgICAgICAgICAgICAgICAgIGJldGFfayA9IE1hdGgubWF4KDAsIGRvdCh5aywgbmV4dC5meHByaW1lKSAvIGRlbHRhX2spO1xuXG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0ocGssIGJldGFfaywgcGssIC0xLCBuZXh0LmZ4cHJpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICAgICAgbmV4dCA9IHRlbXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDw9IDFlLTUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGF9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdyYWRpZW50RGVzY2VudChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMTAwLFxuICAgICAgICAgICAgbGVhcm5SYXRlID0gcGFyYW1zLmxlYXJuUmF0ZSB8fCAwLjAwMSxcbiAgICAgICAgICAgIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY3VycmVudC54LCAxLCBjdXJyZW50LngsIC1sZWFyblJhdGUsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgICAgICBpZiAobm9ybTIoY3VycmVudC5meHByaW1lKSA8PSAxZS01KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoKGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIHZhciBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBuZXh0ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAxMDAsXG4gICAgICAgICAgICBsZWFyblJhdGUgPSBwYXJhbXMubGVhcm5SYXRlIHx8IDEsXG4gICAgICAgICAgICBwayA9IGluaXRpYWwuc2xpY2UoKSxcbiAgICAgICAgICAgIGMxID0gcGFyYW1zLmMxIHx8IDFlLTMsXG4gICAgICAgICAgICBjMiA9IHBhcmFtcy5jMiB8fCAwLjEsXG4gICAgICAgICAgICB0ZW1wLFxuICAgICAgICAgICAgZnVuY3Rpb25DYWxscyA9IFtdO1xuXG4gICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgLy8gd3JhcCB0aGUgZnVuY3Rpb24gY2FsbCB0byB0cmFjayBsaW5lc2VhcmNoIHNhbXBsZXNcbiAgICAgICAgICAgIHZhciBpbm5lciA9IGY7XG4gICAgICAgICAgICBmID0gZnVuY3Rpb24oeCwgZnhwcmltZSkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMucHVzaCh4LnNsaWNlKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbm5lcih4LCBmeHByaW1lKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLCAtMSk7XG4gICAgICAgICAgICBsZWFyblJhdGUgPSB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGxlYXJuUmF0ZSwgYzEsIGMyKTtcblxuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxsczogZnVuY3Rpb25DYWxscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWFyblJhdGU6IGxlYXJuUmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogbGVhcm5SYXRlfSk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxscyA9IFtdO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50O1xuICAgICAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICBuZXh0ID0gdGVtcDtcblxuICAgICAgICAgICAgaWYgKChsZWFyblJhdGUgPT09IDApIHx8IChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDwgMWUtNSkpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZXhwb3J0cy5iaXNlY3QgPSBiaXNlY3Q7XG4gICAgZXhwb3J0cy5uZWxkZXJNZWFkID0gbmVsZGVyTWVhZDtcbiAgICBleHBvcnRzLmNvbmp1Z2F0ZUdyYWRpZW50ID0gY29uanVnYXRlR3JhZGllbnQ7XG4gICAgZXhwb3J0cy5ncmFkaWVudERlc2NlbnQgPSBncmFkaWVudERlc2NlbnQ7XG4gICAgZXhwb3J0cy5ncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoID0gZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaDtcbiAgICBleHBvcnRzLnplcm9zID0gemVyb3M7XG4gICAgZXhwb3J0cy56ZXJvc00gPSB6ZXJvc007XG4gICAgZXhwb3J0cy5ub3JtMiA9IG5vcm0yO1xuICAgIGV4cG9ydHMud2VpZ2h0ZWRTdW0gPSB3ZWlnaHRlZFN1bTtcbiAgICBleHBvcnRzLnNjYWxlID0gc2NhbGU7XG5cbn0pKTsiLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgQW5pbWF0b3Ige1xuXG4gICAgc3RhdGljIEVBU0VfTk9ORTogKHg6IG51bWJlcikgPT4gbnVtYmVyID0geCA9PiB4O1xuICAgIHN0YXRpYyBFQVNFX0NVQklDOiAoeDogbnVtYmVyKSA9PiBudW1iZXIgPSB4ID0+IHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDMpIC8gMjtcbiAgICBzdGF0aWMgRUFTRV9TSU5FOiAoeDogbnVtYmVyKSA9PiBudW1iZXIgPSB4ID0+IC0oTWF0aC5jb3MoTWF0aC5QSSAqIHgpIC0gMSkgLyAyO1xuICAgIFxuICAgIHByaXZhdGUgX2Zyb206IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfdG86IG51bWJlciA9IDE7XG4gICAgcHJpdmF0ZSBfdGltZVBhc3NlZDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9lYXNlOiAoeDogbnVtYmVyKSA9PiBudW1iZXIgPSBBbmltYXRvci5FQVNFX05PTkU7XG5cbiAgICBwcml2YXRlIGNhbGxiYWNrOiAoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4pID0+IGJvb2xlYW4gPSB4ID0+IHRydWU7XG4gICAgcHJpdmF0ZSBzdGFydFRpbWU6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBkdXJhdGlvbk1pbGxpc2Vjb25kczogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBmcm9tKGZyb206IG51bWJlcik6IEFuaW1hdG9yIHtcbiAgICAgICAgdGhpcy5fZnJvbSA9IGZyb207XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyB0byh0bzogbnVtYmVyKTogQW5pbWF0b3Ige1xuICAgICAgICB0aGlzLl90byA9IHRvO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdGltZVBhc3NlZCh0aW1lUGFzc2VkOiBudW1iZXIpOiBBbmltYXRvciB7XG4gICAgICAgIHRoaXMuX3RpbWVQYXNzZWQgPSB0aW1lUGFzc2VkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZWFzZShlYXNlOiAoeDogbnVtYmVyKSA9PiBudW1iZXIpOiBBbmltYXRvciB7XG4gICAgICAgIHRoaXMuX2Vhc2UgPSBlYXNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgd2FpdChkZWxheU1pbGxpc2Vjb25kczogbnVtYmVyLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlNaWxsaXNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQoY2FsbGJhY2ssIGRlbGF5TWlsbGlzZWNvbmRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhbmltYXRlKGR1cmF0aW9uTWlsbGlzZWNvbmRzOiBudW1iZXIsIGNhbGxiYWNrOiAoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4pID0+IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kdXJhdGlvbk1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uTWlsbGlzZWNvbmRzO1xuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5ub3coKTtcbiAgICAgICAgdGhpcy5mcmFtZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZnJhbWUoKSB7XG4gICAgICAgIGNvbnN0IG5vdyA9IHRoaXMubm93KCk7XG4gICAgICAgIGxldCB4ID0gMTtcbiAgICAgICAgaWYgKHRoaXMuZHVyYXRpb25NaWxsaXNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICB4ID0gKG5vdy10aGlzLnN0YXJ0VGltZSt0aGlzLl90aW1lUGFzc2VkKSAvIHRoaXMuZHVyYXRpb25NaWxsaXNlY29uZHM7XG4gICAgICAgIH1cbiAgICAgICAgeCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHgpKTtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuX2Zyb20gKyAodGhpcy5fdG8tdGhpcy5fZnJvbSkgKiB0aGlzLl9lYXNlKHgpO1xuICAgICAgICBjb25zdCBjb250ID0gdGhpcy5jYWxsYmFjayh5LCB4ID09IDEpO1xuICAgICAgICBpZiAoY29udCAmJiB4IDwgMSkge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnJhbWUoKCkgPT4gdGhpcy5mcmFtZSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBub3coKTogbnVtYmVyO1xuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHRpbWVvdXQoY2FsbGJhY2s6ICgpID0+IHZvaWQsIGRlbGF5TWlsbGlzZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlcXVlc3RGcmFtZShjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG4iLCJleHBvcnQgY2xhc3MgQXJyaXZhbERlcGFydHVyZVRpbWUge1xuICAgIHByaXZhdGUgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2Uob2Zmc2V0OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzcGxpdCA9IHRoaXMudmFsdWUuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoc3BsaXRbb2Zmc2V0XSkgKiAoc3BsaXRbb2Zmc2V0LTFdID09ICctJyA/IC0xIDogMSlcbiAgICB9XG5cbiAgICBnZXQgZGVwYXJ0dXJlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKDIpO1xuICAgIH1cblxuICAgIGdldCBhcnJpdmFsKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKDQpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBCb3VuZGluZ0JveCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHRsOiBWZWN0b3IsIHB1YmxpYyBicjogVmVjdG9yKSB7XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20odGxfeDogbnVtYmVyLCB0bF95OiBudW1iZXIsIGJyX3g6IG51bWJlciwgYnJfeTogbnVtYmVyKTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KG5ldyBWZWN0b3IodGxfeCwgdGxfeSksIG5ldyBWZWN0b3IoYnJfeCwgYnJfeSkpO1xuICAgIH1cbiAgICBcbiAgICBnZXQgZGltZW5zaW9ucygpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy50bC5kZWx0YSh0aGlzLmJyKTtcbiAgICB9XG4gICAgaXNOdWxsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50bCA9PSBWZWN0b3IuTlVMTCB8fCB0aGlzLmJyID09IFZlY3Rvci5OVUxMO1xuICAgIH1cbiAgICBcbiAgICBjYWxjdWxhdGVCb3VuZGluZ0JveEZvclpvb20ocGVyY2VudFg6IG51bWJlciwgcGVyY2VudFk6IG51bWJlcik6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gYmJveC5kaW1lbnNpb25zO1xuICAgICAgICBjb25zdCByZWxhdGl2ZUNlbnRlciA9IG5ldyBWZWN0b3IocGVyY2VudFggLyAxMDAsIHBlcmNlbnRZIC8gMTAwKTtcbiAgICAgICAgY29uc3QgY2VudGVyID0gYmJveC50bC5hZGQobmV3IFZlY3RvcihkZWx0YS54ICogcmVsYXRpdmVDZW50ZXIueCwgZGVsdGEueSAqIHJlbGF0aXZlQ2VudGVyLnkpKTtcbiAgICAgICAgY29uc3QgZWRnZURpc3RhbmNlID0gbmV3IFZlY3RvcihkZWx0YS54ICogTWF0aC5taW4ocmVsYXRpdmVDZW50ZXIueCwgMSAtIHJlbGF0aXZlQ2VudGVyLngpLCBkZWx0YS55ICogTWF0aC5taW4ocmVsYXRpdmVDZW50ZXIueSwgMSAtIHJlbGF0aXZlQ2VudGVyLnkpKTtcbiAgICAgICAgY29uc3QgcmF0aW9QcmVzZXJ2aW5nRWRnZURpc3RhbmNlID0gbmV3IFZlY3RvcihlZGdlRGlzdGFuY2UueSAqIGRlbHRhLnggLyBkZWx0YS55LCBlZGdlRGlzdGFuY2UueCAqIGRlbHRhLnkgLyBkZWx0YS54KTtcbiAgICAgICAgY29uc3QgbWluaW1hbEVkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoTWF0aC5taW4oZWRnZURpc3RhbmNlLngsIHJhdGlvUHJlc2VydmluZ0VkZ2VEaXN0YW5jZS54KSwgTWF0aC5taW4oZWRnZURpc3RhbmNlLnksIHJhdGlvUHJlc2VydmluZ0VkZ2VEaXN0YW5jZS55KSk7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goY2VudGVyLmFkZChuZXcgVmVjdG9yKC1taW5pbWFsRWRnZURpc3RhbmNlLngsIC1taW5pbWFsRWRnZURpc3RhbmNlLnkpKSwgY2VudGVyLmFkZChtaW5pbWFsRWRnZURpc3RhbmNlKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9UaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vZHJhd2FibGVzL0xpbmVcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRHJhd2FibGVTb3J0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgc29ydChlbGVtZW50czogVGltZWREcmF3YWJsZVtdLCBkcmF3OiBib29sZWFuKToge2RlbGF5OiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW59W10ge1xuICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXByZXNlbnRhdGl2ZUVsZW1lbnQgPSBlbGVtZW50c1swXTtcbiAgICAgICAgaWYgKHJlcHJlc2VudGF0aXZlRWxlbWVudCBpbnN0YW5jZW9mIExpbmUgJiYgcmVwcmVzZW50YXRpdmVFbGVtZW50LmFuaW1PcmRlciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9yZGVyQnlHZW9tZXRyaWNEaXJlY3Rpb24oZWxlbWVudHMsIHJlcHJlc2VudGF0aXZlRWxlbWVudC5hbmltT3JkZXIsIGRyYXcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZHJhdykge1xuICAgICAgICAgICAgZWxlbWVudHMucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGJ1aWxkU29ydGFibGVDYWNoZShlbGVtZW50czogVGltZWREcmF3YWJsZVtdLCBkaXJlY3Rpb246IFJvdGF0aW9uKToge2VsZW1lbnQ6IExpbmUsIHRlcm1pbmk6IFZlY3RvcltdLCBwcm9qZWN0aW9uOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4sIGFuaW1hdGlvbkR1cmF0aW9uOiBudW1iZXJ9W10ge1xuICAgICAgICBjb25zdCBjYWNoZSA6IHtlbGVtZW50OiBMaW5lLCB0ZXJtaW5pOiBWZWN0b3JbXSwgcHJvamVjdGlvbjogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBhbmltYXRpb25EdXJhdGlvbjogbnVtYmVyfVtdID0gW107XG4gICAgICAgIGZvciAobGV0IGk9MDtpPGVsZW1lbnRzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50c1tpXSBpbnN0YW5jZW9mIExpbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gPExpbmU+ZWxlbWVudHNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHRlcm1pbmkgPSBbVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMXTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5wYXRoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVybWluaSA9IFtlbGVtZW50LnBhdGhbMF0sIGVsZW1lbnQucGF0aFtlbGVtZW50LnBhdGgubGVuZ3RoLTFdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvajEgPSB0ZXJtaW5pWzBdLnNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvajIgPSB0ZXJtaW5pWzFdLnNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2ZXJzZSA9IHByb2oxIDwgcHJvajI7XG4gICAgICAgICAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVybWluaS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhY2hlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICB0ZXJtaW5pOiB0ZXJtaW5pLFxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uOiBNYXRoLm1heChwcm9qMSwgcHJvajIpLFxuICAgICAgICAgICAgICAgICAgICByZXZlcnNlOiByZXZlcnNlLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EdXJhdGlvbjogZWxlbWVudC5hbmltYXRpb25EdXJhdGlvblNlY29uZHNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvcmRlckJ5R2VvbWV0cmljRGlyZWN0aW9uKGVsZW1lbnRzOiBUaW1lZERyYXdhYmxlW10sIGRpcmVjdGlvbjogUm90YXRpb24sIGRyYXc6IGJvb2xlYW4pOiB7ZGVsYXk6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbn1bXSB7XG4gICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5idWlsZFNvcnRhYmxlQ2FjaGUoZWxlbWVudHMsIGRpcmVjdGlvbik7XG4gICAgICAgIGNhY2hlLnNvcnQoKGEsIGIpID0+IChhLnByb2plY3Rpb24gPCBiLnByb2plY3Rpb24pID8gMSA6IC0xKTtcbiAgICAgICAgZWxlbWVudHMuc3BsaWNlKDAsIGVsZW1lbnRzLmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgZGVsYXlzOiB7ZGVsYXk6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbn1bXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7aTxjYWNoZS5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBjb25zdCByZWZQb2ludCA9IGNhY2hlW2ldLnRlcm1pbmlbMF07XG4gICAgICAgICAgICBsZXQgc2hvcnRlc3QgPSByZWZQb2ludC5kZWx0YShjYWNoZVswXS50ZXJtaW5pWzBdKS5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgcHJvamVjdGlvbkZvclNob3J0ZXN0ID0gMDtcbiAgICAgICAgICAgIGxldCBkZWxheUZvclNob3J0ZXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPGk7aisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wO2s8MjtrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSByZWZQb2ludC5kZWx0YShjYWNoZVtqXS50ZXJtaW5pW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG90ZW50aWFsU2hvcnRlc3QgPSBkZWx0YS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3RlbnRpYWxTaG9ydGVzdCA8PSBzaG9ydGVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvcnRlc3QgPSBwb3RlbnRpYWxTaG9ydGVzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25Gb3JTaG9ydGVzdCA9IGRlbHRhLnNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbik7ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxheUZvclNob3J0ZXN0ID0gZGVsYXlzW2pdLmRlbGF5ICsgKGsgPT0gMSA/IGNhY2hlW2pdLmFuaW1hdGlvbkR1cmF0aW9uIDogMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub2FuaW0gPSBjYWNoZVtpXS5lbGVtZW50W2RyYXcgPyAnZnJvbScgOiAndG8nXT8uZmxhZy5pbmNsdWRlcygnbm9hbmltJyk7XG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IG5vYW5pbSA/IDAgOiAoZGVsYXlGb3JTaG9ydGVzdCArIHByb2plY3Rpb25Gb3JTaG9ydGVzdC9jYWNoZVtpXS5lbGVtZW50LnNwZWVkKTtcbiAgICAgICAgICAgIGRlbGF5cy5wdXNoKHtkZWxheTogZGVsYXksIHJldmVyc2U6IGNhY2hlW2ldLnJldmVyc2UgPT0gZHJhd30pO1xuICAgICAgICAgICAgZWxlbWVudHMucHVzaChjYWNoZVtpXS5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsYXlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5cbi8vY29uc3QgbWF0aGpzID0gcmVxdWlyZSgnbWF0aGpzJyk7XG5jb25zdCBmbWluID0gcmVxdWlyZSgnZm1pbicpO1xuXG5cbmV4cG9ydCBjbGFzcyBHcmF2aXRhdG9yIHtcbiAgICBzdGF0aWMgSU5FUlRORVNTID0gMTAwO1xuICAgIHN0YXRpYyBHUkFESUVOVF9TQ0FMRSA9IDAuMDAwMDAwMDAxO1xuICAgIHN0YXRpYyBERVZJQVRJT05fV0FSTklORyA9IDAuMjtcbiAgICBzdGF0aWMgSU5JVElBTElaRV9SRUxBVElWRV9UT19FVUNMSURJQU5fRElTVEFOQ0UgPSB0cnVlO1xuICAgIHN0YXRpYyBTUEVFRCA9IDI1MDtcbiAgICBzdGF0aWMgTUFYX0FOSU1fRFVSQVRJT04gPSA2O1xuICAgIHN0YXRpYyBDT0xPUl9ERVZJQVRJT04gPSAwLjAyO1xuXG4gICAgcHJpdmF0ZSBpbml0aWFsV2VpZ2h0RmFjdG9yczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICBwcml2YXRlIGluaXRpYWxBbmdsZXM6IHthU3RhdGlvbjogc3RyaW5nLCBjb21tb25TdGF0aW9uOiBzdHJpbmcsIGJTdGF0aW9uOiBzdHJpbmcsIGFuZ2xlOiBudW1iZXJ9W10gPSBbXTtcbiAgICBwcml2YXRlIGFuZ2xlRjogYW55O1xuICAgIHByaXZhdGUgYW5nbGVGUHJpbWU6IHtbaWQ6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICBwcml2YXRlIGF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbzogbnVtYmVyID0gLTE7XG4gICAgcHJpdmF0ZSBlZGdlczoge1tpZDogc3RyaW5nXTogTGluZX0gPSB7fTtcbiAgICBwcml2YXRlIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3IsIHN0YXJ0Q29vcmRzOiBWZWN0b3J9fSA9IHt9O1xuICAgIHByaXZhdGUgZGlydHkgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgZ3Jhdml0YXRlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMuZGlydHkpXG4gICAgICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdyYXBoKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gdGhpcy5taW5pbWl6ZUxvc3MoKTtcbiAgICAgICAgdGhpcy5hc3NlcnREaXN0YW5jZXMoc29sdXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlU3RhdGlvbnNBbmRMaW5lcyhzb2x1dGlvbiwgZGVsYXksIGFuaW1hdGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgY29uc3Qgd2VpZ2h0cyA9IHRoaXMuZ2V0V2VpZ2h0c1N1bSgpO1xuICAgICAgICBjb25zdCBldWNsaWRpYW4gPSB0aGlzLmdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3ZWlnaHRzOicsIHdlaWdodHMsICdldWNsaWRpYW46JywgZXVjbGlkaWFuKTtcbiAgICAgICAgaWYgKHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID09IC0xICYmIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8gPSB3ZWlnaHRzIC8gZXVjbGlkaWFuO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2F2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpb14tMScsIDEvdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8pO1xuXG4gICAgICAgICAgICAvL3RoaXMuaW5pdGlhbGl6ZUFuZ2xlR3JhZGllbnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG4gICAgLypwcml2YXRlIGluaXRpYWxpemVBbmdsZUdyYWRpZW50cygpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9ICcoYWNvcygoKGJfeC1hX3gpKihiX3gtY194KSsoYl95LWFfeSkqKGJfeS1jX3kpKS8oc3FydCgoYl94LWFfeCleMisoYl95LWFfeSleMikqc3FydCgoYl94LWNfeCleMisoYl95LWNfeSleMikpKSooKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKS9hYnMoKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkpLWNvbnN0KSc7XG4gICAgICAgIGNvbnN0IGYgPSBtYXRoanMucGFyc2UoZXhwcmVzc2lvbik7XG4gICAgICAgIHRoaXMuYW5nbGVGID0gZi5jb21waWxlKCk7XG5cbiAgICAgICAgY29uc3QgZkRlbHRhID0gbWF0aGpzLnBhcnNlKGV4cHJlc3Npb24gKyAnXjInKTtcblxuICAgICAgICBjb25zdCB2YXJzID0gWydhX3gnLCAnYV95JywgJ2JfeCcsICdiX3knLCAnY194JywgJ2NfeSddO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dmFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hbmdsZUZQcmltZVt2YXJzW2ldXSA9IG1hdGhqcy5kZXJpdmF0aXZlKGZEZWx0YSwgdmFyc1tpXSkuY29tcGlsZSgpO1xuICAgICAgICB9XG4gICAgfSovXG5cbiAgICBwcml2YXRlIGdldFdlaWdodHNTdW0oKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IGVkZ2Uud2VpZ2h0IHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIHN1bSArPSB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlZGdlVmVjdG9yKGVkZ2U6IExpbmUpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEodGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUdyYXBoKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSA9IEdyYXZpdGF0b3IuSU5JVElBTElaRV9SRUxBVElWRV9UT19FVUNMSURJQU5fRElTVEFOQ0VcbiAgICAgICAgICAgICAgICAgICAgPyAxIC8gdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW9cbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoIC8gKGVkZ2Uud2VpZ2h0IHx8IDApO1xuICAgICAgICAgICAgICAgIC8vdGhpcy5hZGRJbml0aWFsQW5nbGVzKGVkZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgdmVydGV4LmluZGV4ID0gbmV3IFZlY3RvcihpLCBpKzEpO1xuICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRJbml0aWFsQW5nbGVzKGVkZ2U6IExpbmUpIHtcbiAgICAgICAgZm9yIChjb25zdCBhZGphY2VudCBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBpZiAoYWRqYWNlbnQgPT0gZWRnZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPDI7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajwyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2UudGVybWluaVtpXS5zdGF0aW9uSWQgPT0gYWRqYWNlbnQudGVybWluaVtqXS5zdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy50aHJlZURvdEFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pW2leMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1thZGphY2VudC50ZXJtaW5pW2peMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxBbmdsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVN0YXRpb246IGVkZ2UudGVybWluaVtpXjFdLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb25TdGF0aW9uOiBlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJTdGF0aW9uOiBhZGphY2VudC50ZXJtaW5pW2peMV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBhbmdsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9kZXJpdmUgYXJjY29zKCgoYS1jKSooZS1nKSsoYi1kKSooZi1oKSkvKHNxcnQoKGEtYyleMisoYi1kKV4yKSpzcXJ0KChlLWcpXjIrKGYtaCleMikpKSooKGYtaCkqKGEtYyktKGItZCkqKGUtZykpL3woKGYtaCkqKGEtYyktKGItZCkqKGUtZykpfFxuICAgICAgICAvL2Rlcml2ZSBhY29zKCgoYl94LWFfeCkqKGJfeC1jX3gpKyhiX3ktYV95KSooYl95LWNfeSkpLyhzcXJ0KChiX3gtYV94KV4yKyhiX3ktYV95KV4yKSpzcXJ0KChiX3gtY194KV4yKyhiX3ktY195KV4yKSkpKigoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpL2FicygoKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKSlcbiAgICB9XG5cbiAgICBwcml2YXRlIHRocmVlRG90QW5nbGUoYTogVmVjdG9yLCBiOiBWZWN0b3IsIGM6IFZlY3Rvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUYsIGEsIGIsIGMsIDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKGY6IGFueSwgYTogVmVjdG9yLCBiOiBWZWN0b3IsIGM6IFZlY3Rvciwgb2xkVmFsdWU6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gZi5ldmFsdWF0ZSh7YV94OiBhLngsIGFfeTogYS55LCBiX3g6IGIueCwgYl95OiBiLnksIGNfeDogYy54LCBjX3k6IGMueSwgY29uc3Q6IG9sZFZhbHVlfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtaW5pbWl6ZUxvc3MoKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCBncmF2aXRhdG9yID0gdGhpcztcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge2hpc3Rvcnk6IFtdfTtcbiAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlcltdID0gdGhpcy5zdGFydFN0YXRpb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSBmbWluLmNvbmp1Z2F0ZUdyYWRpZW50KChBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10pID0+IHtcbiAgICAgICAgICAgIGZ4cHJpbWUgPSBmeHByaW1lIHx8IEEuc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTxmeHByaW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZnhwcmltZVtpXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZnggPSAwO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb0N1cnJlbnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgLy9meCA9IHRoaXMuZGVsdGFUb0FuZ2xlc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5kZWx0YVRvTmV3RGlzdGFuY2VzVG9FbnN1cmVBY2N1cmFjeShmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICB0aGlzLnNjYWxlR3JhZGllbnRUb0Vuc3VyZVdvcmtpbmdTdGVwU2l6ZShmeHByaW1lKTtcbiAgICAgICAgICAgIHJldHVybiBmeDtcbiAgICAgICAgfSwgc3RhcnQsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiBzb2x1dGlvbi54O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRTdGF0aW9uUG9zaXRpb25zKCk6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHN0YXJ0W3ZlcnRleC5pbmRleC54XSA9IHZlcnRleC5zdGFydENvb3Jkcy54O1xuICAgICAgICAgICAgc3RhcnRbdmVydGV4LmluZGV4LnldID0gdmVydGV4LnN0YXJ0Q29vcmRzLnk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXJ0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFYKEE6IG51bWJlcltdLCB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yfX0sIHRlcm1pbmk6IFN0b3BbXSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBBW3ZlcnRpY2VzW3Rlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC54XSAtIEFbdmVydGljZXNbdGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFZKEE6IG51bWJlcltdLCB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yfX0sIHRlcm1pbmk6IFN0b3BbXSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBBW3ZlcnRpY2VzW3Rlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC55XSAtIEFbdmVydGljZXNbdGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnldO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb1N0YXJ0U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXMoZ3Jhdml0YXRvci52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIGZ4ICs9IChcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXJ0Q29vcmRzLngsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXJ0Q29vcmRzLnksIDIpXG4gICAgICAgICAgICAgICAgKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueF0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhcnRDb29yZHMueCkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnldICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXJ0Q29vcmRzLnkpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb0N1cnJlbnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgZnggKz0gKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLngsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy55LCAyKVxuICAgICAgICAgICAgICAgICkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnhdICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy54KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueV0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLnkpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb0FuZ2xlc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IuaW5pdGlhbEFuZ2xlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnldKTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC55XSk7XG4gICAgICAgICAgICBjb25zdCBjID0gbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC55XSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUYsIGEsIGIsIGMsIHBhaXIuYW5nbGUpO1xuICAgICAgICAgICAgZnggKz0gTWF0aC5wb3coZGVsdGEsIDIpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG5cbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC54XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydhX3gnXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC55XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydhX3knXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnhdICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2JfeCddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYl95J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueF0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnY194J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnY195J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb05ld0Rpc3RhbmNlc1RvRW5zdXJlQWNjdXJhY3koZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyhncmF2aXRhdG9yLmVkZ2VzKSkgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHYgPSBNYXRoLnBvdyh0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyBNYXRoLnBvdyh0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLSBNYXRoLnBvdyhncmF2aXRhdG9yLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gKiAoZWRnZS53ZWlnaHQgfHwgMCksIDIpO1xuICAgICAgICAgICAgZnggKz0gTWF0aC5wb3codiwgMik7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueF0gKz0gKzQgKiB2ICogdGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC55XSArPSArNCAqIHYgKiB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnhdICs9IC00ICogdiAqIHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueV0gKz0gLTQgKiB2ICogdGhpcy5kZWx0YVkoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY2FsZUdyYWRpZW50VG9FbnN1cmVXb3JraW5nU3RlcFNpemUoZnhwcmltZTogbnVtYmVyW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZ4cHJpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZ4cHJpbWVbaV0gKj0gR3Jhdml0YXRvci5HUkFESUVOVF9TQ0FMRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0RGlzdGFuY2VzKHNvbHV0aW9uOiBudW1iZXJbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBkZXZpYXRpb24gPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVgoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyh0aGlzLmRlbHRhWShzb2x1dGlvbiwgdGhpcy52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICkgLyAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApKSAtIDE7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGV2aWF0aW9uKSA+IEdyYXZpdGF0b3IuREVWSUFUSU9OX1dBUk5JTkcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZWRnZS5uYW1lLCAnZGl2ZXJnZXMgYnkgJywgZGV2aWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICBwcml2YXRlIG1vdmVTdGF0aW9uc0FuZExpbmVzKHNvbHV0aW9uOiBudW1iZXJbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9IGFuaW1hdGUgPyBNYXRoLm1pbihHcmF2aXRhdG9yLk1BWF9BTklNX0RVUkFUSU9OLCB0aGlzLmdldFRvdGFsRGlzdGFuY2VUb01vdmUoc29sdXRpb24pIC8gR3Jhdml0YXRvci5TUEVFRCkgOiAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXguc3RhdGlvbi5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIG5ldyBWZWN0b3Ioc29sdXRpb25bdmVydGV4LmluZGV4LnhdLCBzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueV0pKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgY29uc3QgY29vcmRzID0gW3RoaXMuZ2V0TmV3U3RhdGlvblBvc2l0aW9uKGVkZ2UudGVybWluaVswXS5zdGF0aW9uSWQsIHNvbHV0aW9uKSwgdGhpcy5nZXROZXdTdGF0aW9uUG9zaXRpb24oZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZCwgc29sdXRpb24pXTtcbiAgICAgICAgICAgIGVkZ2UubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBjb29yZHMsIHRoaXMuZ2V0Q29sb3JCeURldmlhdGlvbihlZGdlLCBlZGdlLndlaWdodCB8fCAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgKz0gYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb2xvckJ5RGV2aWF0aW9uKGVkZ2U6IExpbmUsIHdlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxEaXN0ID0gdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5zdGFydENvb3Jkcy5kZWx0YSh0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLnN0YXJ0Q29vcmRzKS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgKHdlaWdodCAtIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvICogaW5pdGlhbERpc3QpICogR3Jhdml0YXRvci5DT0xPUl9ERVZJQVRJT04pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRvdGFsRGlzdGFuY2VUb01vdmUoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gbmV3IFZlY3Rvcihzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueF0sIHNvbHV0aW9uW3ZlcnRleC5pbmRleC55XSkuZGVsdGEodmVydGV4LnN0YXRpb24uYmFzZUNvb3JkcykubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXdTdGF0aW9uUG9zaXRpb24oc3RhdGlvbklkOiBzdHJpbmcsIHNvbHV0aW9uOiBudW1iZXJbXSk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC54XSwgc29sdXRpb25bdGhpcy52ZXJ0aWNlc1tzdGF0aW9uSWRdLmluZGV4LnldKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFZlcnRleCh2ZXJ0ZXhJZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh2ZXJ0ZXhJZCk7XG4gICAgICAgICAgICBpZiAoc3RhdGlvbiA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHZlcnRleElkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHRoaXMudmVydGljZXNbdmVydGV4SWRdID0ge3N0YXRpb246IHN0YXRpb24sIGluZGV4OiBWZWN0b3IuTlVMTCwgc3RhcnRDb29yZHM6IHN0YXRpb24uYmFzZUNvb3Jkc307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRFZGdlKGxpbmU6IExpbmUpIHtcbiAgICAgICAgaWYgKGxpbmUud2VpZ2h0ID09IHVuZGVmaW5lZCkgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0SWRlbnRpZmllcihsaW5lKTtcbiAgICAgICAgdGhpcy5lZGdlc1tpZF0gPSBsaW5lO1xuICAgICAgICB0aGlzLmFkZFZlcnRleChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkKTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZGVudGlmaWVyKGxpbmU6IExpbmUpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmFscGhhYmV0aWNJZChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBsaW5lLnRlcm1pbmlbMV0uc3RhdGlvbklkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5zdGFudCB7XG4gICAgc3RhdGljIEJJR19CQU5HOiBJbnN0YW50ID0gbmV3IEluc3RhbnQoMCwgMCwgJycpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Vwb2NoOiBudW1iZXIsIHByaXZhdGUgX3NlY29uZDogbnVtYmVyLCBwcml2YXRlIF9mbGFnOiBzdHJpbmcpIHtcblxuICAgIH1cbiAgICBnZXQgZXBvY2goKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vwb2NoO1xuICAgIH1cbiAgICBnZXQgc2Vjb25kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWNvbmQ7XG4gICAgfVxuICAgIGdldCBmbGFnKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFnO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGFycmF5OiBzdHJpbmdbXSk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQocGFyc2VJbnQoYXJyYXlbMF0pLCBwYXJzZUludChhcnJheVsxXSksIGFycmF5WzJdID8/ICcnKVxuICAgIH1cblxuICAgIGVxdWFscyh0aGF0OiBJbnN0YW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2ggJiYgdGhpcy5zZWNvbmQgPT0gdGhhdC5zZWNvbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kIC0gdGhpcy5zZWNvbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgY2xhc3MgTGluZUdyb3VwIHtcbiAgICBwcml2YXRlIF9saW5lczogTGluZVtdID0gW107XG4gICAgcHJpdmF0ZSBfdGVybWluaTogU3RvcFtdID0gW107XG4gICAgc3Ryb2tlQ29sb3IgPSAwO1xuICAgIFxuICAgIGFkZExpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuX2xpbmVzLmluY2x1ZGVzKGxpbmUpKVxuICAgICAgICAgICAgdGhpcy5fbGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXJtaW5pKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGluZShsaW5lOiBMaW5lKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLl9saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9saW5lc1tpXSA9PSBsaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVUZXJtaW5pKCk7XG4gICAgfVxuXG4gICAgZ2V0IHRlcm1pbmkoKTogU3RvcFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Rlcm1pbmk7XG4gICAgfVxuXG4gICAgZ2V0UGF0aEJldHdlZW4oc3RhdGlvbklkRnJvbTogc3RyaW5nLCBzdGF0aW9uSWRUbzogc3RyaW5nKToge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9IHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmdldExpbmVzV2l0aFN0b3Aoc3RhdGlvbklkRnJvbSk7XG4gICAgICAgIGNvbnN0IHRvID0gdGhpcy5nZXRMaW5lc1dpdGhTdG9wKHN0YXRpb25JZFRvKTtcblxuICAgICAgICBpZiAoZnJvbS5sZW5ndGggPT0gMCB8fCB0by5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgT2JqZWN0LnZhbHVlcyhmcm9tKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIE9iamVjdC52YWx1ZXModG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEubGluZSA9PSBiLmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGF0aEJldHdlZW5TdG9wcyhhLmxpbmUsIGEuc3RvcCwgYi5zdG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIE9iamVjdC52YWx1ZXMoZnJvbSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiBPYmplY3QudmFsdWVzKHRvKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1vbiA9IHRoaXMuZmluZENvbW1vblN0b3AoYS5saW5lLCBiLmxpbmUpO1xuICAgICAgICAgICAgICAgIGlmIChjb21tb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFBhcnQgPSB0aGlzLmdldFBhdGhCZXR3ZWVuU3RvcHMoYS5saW5lLCBhLnN0b3AsIGNvbW1vbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlY29uZFBhcnQgPSB0aGlzLmdldFBhdGhCZXR3ZWVuU3RvcHMoYi5saW5lLCBjb21tb24sIGIuc3RvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0UGFydFNsaWNlID0gZmlyc3RQYXJ0LnBhdGguc2xpY2UoMCwgZmlyc3RQYXJ0LnRvKzEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRQYXJ0U2xpY2UgPSBzZWNvbmRQYXJ0LnBhdGguc2xpY2Uoc2Vjb25kUGFydC5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcGF0aDogZmlyc3RQYXJ0U2xpY2UuY29uY2F0KHNlY29uZFBhcnRTbGljZSksIGZyb206IGZpcnN0UGFydC5mcm9tLCB0bzogZmlyc3RQYXJ0U2xpY2UubGVuZ3RoICsgc2Vjb25kUGFydC50b307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBsZXggVHJhaW4gcm91dGluZyBmb3IgTGluZXMgb2YgTGluZUdyb3VwcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TGluZXNXaXRoU3RvcChzdGF0aW9uSWQ6IHN0cmluZyk6IHtsaW5lOiBMaW5lLCBzdG9wOiBTdG9wfVtdIHtcbiAgICAgICAgY29uc3QgYXJyOiB7bGluZTogTGluZSwgc3RvcDogU3RvcH1bXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLl9saW5lcykpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSBsaW5lLmdldFN0b3Aoc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7bGluZTogbGluZSwgc3RvcDogc3RvcH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQYXRoQmV0d2VlblN0b3BzKGxpbmU6IExpbmUsIGZyb206IFN0b3AsIHRvOiBTdG9wKToge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9IHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGxpbmUucGF0aDtcbiAgICAgICAgbGV0IGZyb21JZHggPSB0aGlzLmluZGV4T2YocGF0aCwgZnJvbS5jb29yZCB8fCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIGxldCB0b0lkeCA9IHRoaXMuaW5kZXhPZihwYXRoLCB0by5jb29yZCB8fCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIGlmIChmcm9tSWR4ID09IC0xIHx8IHRvSWR4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdG9wIHRoYXQgc2hvdWxkIGJlIHByZXNlbnQgaXMgbm90IHByZXNlbnQgb24gbGluZSBcIiArIGxpbmUubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zdCBzbGljZSA9IHBhdGguc2xpY2UoTWF0aC5taW4oZnJvbUlkeCwgdG9JZHgpLCBNYXRoLm1heChmcm9tSWR4LCB0b0lkeCkrMSk7XG4gICAgICAgIGNvbnN0IHNsaWNlID0gcGF0aC5zbGljZSgpO1xuICAgICAgICBpZiAoZnJvbUlkeCA+IHRvSWR4KSB7XG4gICAgICAgICAgICBzbGljZS5yZXZlcnNlKCk7XG4gICAgICAgICAgICBmcm9tSWR4ID0gc2xpY2UubGVuZ3RoIC0gMSAtIGZyb21JZHg7XG4gICAgICAgICAgICB0b0lkeCA9IHNsaWNlLmxlbmd0aCAtIDEgLSB0b0lkeDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBwYXRoOiBzbGljZSwgZnJvbTogZnJvbUlkeCwgdG86IHRvSWR4IH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbmRleE9mKGFycmF5OiBWZWN0b3JbXSwgZWxlbWVudDogVmVjdG9yKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycmF5W2ldLmVxdWFscyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRDb21tb25TdG9wKGxpbmUxOiBMaW5lLCBsaW5lMjogTGluZSk6IFN0b3AgfCBudWxsIHtcbiAgICAgICAgZm9yIChjb25zdCB0ZXJtaW51czEgb2YgT2JqZWN0LnZhbHVlcyhsaW5lMS50ZXJtaW5pKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0ZXJtaW51czIgb2YgT2JqZWN0LnZhbHVlcyhsaW5lMi50ZXJtaW5pKSkge1xuICAgICAgICAgICAgICAgIGlmICh0ZXJtaW51czEuc3RhdGlvbklkID09IHRlcm1pbnVzMi5zdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlcm1pbnVzMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUZXJtaW5pKCkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGVzOiB7W2lkOiBzdHJpbmddIDogbnVtYmVyfSA9IHt9O1xuICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZVRlcm1pbmkgPSBsLnRlcm1pbmk7XG4gICAgICAgICAgICBsaW5lVGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdC50cmFja0luZm8uaW5jbHVkZXMoJyonKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0ZXJtaW5pOiBTdG9wW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBbc3RhdGlvbklkLCBvY2N1cmVuY2VzXSBvZiBPYmplY3QuZW50cmllcyhjYW5kaWRhdGVzKSkge1xuICAgICAgICAgICAgaWYgKG9jY3VyZW5jZXMgPT0gMSkge1xuICAgICAgICAgICAgICAgIHRlcm1pbmkucHVzaChuZXcgU3RvcChzdGF0aW9uSWQsICcnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGVybWluaSA9IHRlcm1pbmk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vZHJhd2FibGVzL1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgWm9vbWVyIH0gZnJvbSBcIi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBMaW5lR3JvdXAgfSBmcm9tIFwiLi9MaW5lR3JvdXBcIjtcbmltcG9ydCB7IEdyYXZpdGF0b3IgfSBmcm9tIFwiLi9HcmF2aXRhdG9yXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vZHJhd2FibGVzL0xpbmVcIjtcbmltcG9ydCB7IERyYXdhYmxlU29ydGVyIH0gZnJvbSBcIi4vRHJhd2FibGVTb3J0ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBZGFwdGVyIHtcbiAgICBjYW52YXNTaXplOiBCb3VuZGluZ0JveDtcbiAgICBhdXRvU3RhcnQ6IGJvb2xlYW47XG4gICAgem9vbU1heFNjYWxlOiBudW1iZXI7XG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG4gICAgZHJhd0Vwb2NoKGVwb2NoOiBzdHJpbmcpOiB2b2lkO1xuICAgIHpvb21Ubyh6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBOZXR3b3JrIGltcGxlbWVudHMgU3RhdGlvblByb3ZpZGVyIHtcbiAgICBwcml2YXRlIHNsaWRlSW5kZXg6IHtbaWQ6IHN0cmluZ10gOiB7W2lkOiBzdHJpbmddOiBUaW1lZERyYXdhYmxlW119fSA9IHt9O1xuICAgIHByaXZhdGUgc3RhdGlvbnM6IHsgW2lkOiBzdHJpbmddIDogU3RhdGlvbiB9ID0ge307XG4gICAgcHJpdmF0ZSBsaW5lR3JvdXBzOiB7IFtpZDogc3RyaW5nXSA6IExpbmVHcm91cCB9ID0ge307XG4gICAgcHJpdmF0ZSBkcmF3YWJsZUJ1ZmZlcjogVGltZWREcmF3YWJsZVtdID0gW107XG4gICAgcHJpdmF0ZSBncmF2aXRhdG9yOiBHcmF2aXRhdG9yO1xuICAgIHByaXZhdGUgem9vbWVyOiBab29tZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IE5ldHdvcmtBZGFwdGVyLCBwcml2YXRlIGRyYXdhYmxlU29ydGVyOiBEcmF3YWJsZVNvcnRlcikge1xuICAgICAgICB0aGlzLmdyYXZpdGF0b3IgPSBuZXcgR3Jhdml0YXRvcih0aGlzKTtcbiAgICAgICAgdGhpcy56b29tZXIgPSBuZXcgWm9vbWVyKHRoaXMuYWRhcHRlci5jYW52YXNTaXplLCB0aGlzLmFkYXB0ZXIuem9vbU1heFNjYWxlKTtcbiAgICB9XG5cbiAgICBnZXQgYXV0b1N0YXJ0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmF1dG9TdGFydDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpb25zW2lkXTtcbiAgICB9XG5cbiAgICBsaW5lR3JvdXBCeUlkKGlkOiBzdHJpbmcpOiBMaW5lR3JvdXAge1xuICAgICAgICBpZiAodGhpcy5saW5lR3JvdXBzW2lkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGluZUdyb3Vwc1tpZF0gPSBuZXcgTGluZUdyb3VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubGluZUdyb3Vwc1tpZF07XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuYWRhcHRlci5jcmVhdGVWaXJ0dWFsU3RvcChpZCwgYmFzZUNvb3Jkcywgcm90YXRpb24pO1xuICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0b3A7XG4gICAgICAgIHJldHVybiBzdG9wO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGlzcGxheUluc3RhbnQoaW5zdGFudDogSW5zdGFudCkge1xuICAgICAgICBpZiAoIWluc3RhbnQuZXF1YWxzKEluc3RhbnQuQklHX0JBTkcpKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhd0Vwb2NoKGluc3RhbnQuZXBvY2ggKyAnJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGltZWREcmF3YWJsZXNBdChub3c6IEluc3RhbnQpOiBUaW1lZERyYXdhYmxlW10ge1xuICAgICAgICBpZiAoIXRoaXMuaXNFcG9jaEV4aXN0aW5nKG5vdy5lcG9jaCArICcnKSlcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdW25vdy5zZWNvbmRdO1xuICAgIH1cblxuICAgIGRyYXdUaW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuZGlzcGxheUluc3RhbnQobm93KTtcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IHRoaXMudGltZWREcmF3YWJsZXNBdChub3cpO1xuICAgICAgICBsZXQgZGVsYXkgPSBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMucG9wdWxhdGVEcmF3YWJsZUJ1ZmZlcihlbGVtZW50c1tpXSwgZGVsYXksIGFuaW1hdGUsIG5vdyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRHJhd2FibGVCdWZmZXIoZGVsYXksIGFuaW1hdGUsIG5vdyk7XG4gICAgICAgIGRlbGF5ID0gdGhpcy5ncmF2aXRhdG9yLmdyYXZpdGF0ZShkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIHRoaXMuYWRhcHRlci56b29tVG8odGhpcy56b29tZXIuY2VudGVyLCB0aGlzLnpvb21lci5zY2FsZSwgdGhpcy56b29tZXIuZHVyYXRpb24pO1xuICAgICAgICB0aGlzLnpvb21lci5yZXNldCgpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3B1bGF0ZURyYXdhYmxlQnVmZmVyKGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIG5vdzogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGlmICghdGhpcy5pc0RyYXdhYmxlRWxpZ2xpYmxlRm9yU2FtZUJ1ZmZlcihlbGVtZW50LCBub3cpKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hEcmF3YWJsZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSwgbm93KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdhYmxlQnVmZmVyLnB1c2goZWxlbWVudCk7XG4gICAgICAgIHJldHVybiBkZWxheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNvcnREcmF3YWJsZUJ1ZmZlcihub3c6IEluc3RhbnQpOiB7ZGVsYXk6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbn1bXSB7XG4gICAgICAgIGlmICh0aGlzLmRyYXdhYmxlQnVmZmVyLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2FibGVTb3J0ZXIuc29ydCh0aGlzLmRyYXdhYmxlQnVmZmVyLCB0aGlzLmlzRHJhdyh0aGlzLmRyYXdhYmxlQnVmZmVyW3RoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoLTFdLCBub3cpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZsdXNoRHJhd2FibGVCdWZmZXIoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgbm93OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZGVsYXlzID0gdGhpcy5zb3J0RHJhd2FibGVCdWZmZXIobm93KTtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGUgPSBkZWxheXMubGVuZ3RoID09IHRoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoO1xuICAgICAgICBsZXQgbWF4RGVsYXkgPSBkZWxheTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNwZWNpZmljRGVsYXkgPSBvdmVycmlkZSA/IGRlbGF5ICsgZGVsYXlzW2ldLmRlbGF5IDogbWF4RGVsYXk7XG4gICAgICAgICAgICBjb25zdCBvdmVycmlkZVJldmVyc2UgPSBvdmVycmlkZSA/IGRlbGF5c1tpXS5yZXZlcnNlIDogZmFsc2U7XG4gICAgICAgICAgICBjb25zdCBuZXdEZWxheSA9IHRoaXMuZHJhd09yRXJhc2VFbGVtZW50KHRoaXMuZHJhd2FibGVCdWZmZXJbaV0sIHNwZWNpZmljRGVsYXksIGFuaW1hdGUsIG92ZXJyaWRlUmV2ZXJzZSwgbm93KVxuICAgICAgICAgICAgbWF4RGVsYXkgPSBNYXRoLm1heChuZXdEZWxheSwgbWF4RGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhd2FibGVCdWZmZXIgPSBbXTtcbiAgICAgICAgcmV0dXJuIG1heERlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNEcmF3KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIG5vdzogSW5zdGFudCkge1xuICAgICAgICByZXR1cm4gbm93LmVxdWFscyhlbGVtZW50LmZyb20pO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNEcmF3YWJsZUVsaWdsaWJsZUZvclNhbWVCdWZmZXIoZWxlbWVudDogVGltZWREcmF3YWJsZSwgbm93OiBJbnN0YW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmRyYXdhYmxlQnVmZmVyLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXN0RWxlbWVudCA9IHRoaXMuZHJhd2FibGVCdWZmZXJbdGhpcy5kcmF3YWJsZUJ1ZmZlci5sZW5ndGgtMV07XG4gICAgICAgIGlmIChlbGVtZW50Lm5hbWUgIT0gbGFzdEVsZW1lbnQubmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRHJhdyhlbGVtZW50LCBub3cpICE9IHRoaXMuaXNEcmF3KGxhc3RFbGVtZW50LCBub3cpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBMaW5lICYmIGxhc3RFbGVtZW50IGluc3RhbmNlb2YgTGluZSAmJiBlbGVtZW50LmFuaW1PcmRlcj8uZGVncmVlcyAhPSBsYXN0RWxlbWVudC5hbmltT3JkZXI/LmRlZ3JlZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdPckVyYXNlRWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBvdmVycmlkZVJldmVyc2U6IGJvb2xlYW4sIG5vdzogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGRyYXcgPSB0aGlzLmlzRHJhdyhlbGVtZW50LCBub3cpO1xuICAgICAgICBjb25zdCBpbnN0YW50ID0gZHJhdyA/IGVsZW1lbnQuZnJvbSA6IGVsZW1lbnQudG87XG4gICAgICAgIGNvbnN0IHNob3VsZEFuaW1hdGUgPSB0aGlzLnNob3VsZEFuaW1hdGUoaW5zdGFudCwgYW5pbWF0ZSk7XG4gICAgICAgIGNvbnN0IHJldmVyc2UgPSBvdmVycmlkZVJldmVyc2UgIT0gaW5zdGFudC5mbGFnLmluY2x1ZGVzKCdyZXZlcnNlJyk7XG4gICAgICAgIGRlbGF5ICs9IGRyYXdcbiAgICAgICAgICAgID8gdGhpcy5kcmF3RWxlbWVudChlbGVtZW50LCBkZWxheSwgc2hvdWxkQW5pbWF0ZSwgcmV2ZXJzZSlcbiAgICAgICAgICAgIDogdGhpcy5lcmFzZUVsZW1lbnQoZWxlbWVudCwgZGVsYXksIHNob3VsZEFuaW1hdGUsIHJldmVyc2UpO1xuICAgICAgICB0aGlzLnpvb21lci5pbmNsdWRlKGVsZW1lbnQuYm91bmRpbmdCb3gsIGVsZW1lbnQuZnJvbSwgZWxlbWVudC50bywgZHJhdywgYW5pbWF0ZSk7XG4gICAgICAgIHJldHVybiBkZWxheTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBkcmF3RWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBMaW5lKSB7XG4gICAgICAgICAgICB0aGlzLmdyYXZpdGF0b3IuYWRkRWRnZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudC5kcmF3KGRlbGF5LCBhbmltYXRlLCByZXZlcnNlKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBlcmFzZUVsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmVyYXNlKGRlbGF5LCBhbmltYXRlLCByZXZlcnNlKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBzaG91bGRBbmltYXRlKGluc3RhbnQ6IEluc3RhbnQsIGFuaW1hdGU6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFhbmltYXRlKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoaW5zdGFudC5mbGFnLmluY2x1ZGVzKCdub2FuaW0nKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGFuaW1hdGU7XG4gICAgfVxuXG4gICAgaXNFcG9jaEV4aXN0aW5nKGVwb2NoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2xpZGVJbmRleFtlcG9jaF0gIT0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFkZFRvSW5kZXgoZWxlbWVudDogVGltZWREcmF3YWJsZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldFNsaWRlSW5kZXhFbGVtZW50KGVsZW1lbnQuZnJvbSwgZWxlbWVudCk7XG4gICAgICAgIGlmICghSW5zdGFudC5CSUdfQkFORy5lcXVhbHMoZWxlbWVudC50bykpXG4gICAgICAgICAgICB0aGlzLnNldFNsaWRlSW5kZXhFbGVtZW50KGVsZW1lbnQudG8sIGVsZW1lbnQpO1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFN0YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGlvbnNbZWxlbWVudC5pZF0gPSBlbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTbGlkZUluZGV4RWxlbWVudChpbnN0YW50OiBJbnN0YW50LCBlbGVtZW50OiBUaW1lZERyYXdhYmxlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdID0ge307XG4gICAgICAgIGlmICh0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPSBbXTtcbiAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXS5wdXNoKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIG5leHRJbnN0YW50KG5vdzogSW5zdGFudCk6IEluc3RhbnQgfCBudWxsIHtcbiAgICAgICAgbGV0IGVwb2NoOiBudW1iZXIgfCBudWxsID0gbm93LmVwb2NoO1xuICAgICAgICBsZXQgc2Vjb25kOiBudW1iZXIgfCBudWxsID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZShub3cuc2Vjb25kLCB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXSk7XG4gICAgICAgIGlmIChzZWNvbmQgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXBvY2ggPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5lcG9jaCwgdGhpcy5zbGlkZUluZGV4KTtcbiAgICAgICAgICAgIGlmIChlcG9jaCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBzZWNvbmQgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKC0xLCB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdKTtcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFudChlcG9jaCwgc2Vjb25kLCAnJyk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZmluZFNtYWxsZXN0QWJvdmUodGhyZXNob2xkOiBudW1iZXIsIGRpY3Q6IHtbaWQ6IG51bWJlcl06IGFueX0pOiBudW1iZXIgfCBudWxsIHtcbiAgICAgICAgaWYgKGRpY3QgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCBzbWFsbGVzdCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRpY3QpKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoa2V5KSA+IHRocmVzaG9sZCAmJiAoc21hbGxlc3QgPT0gbnVsbCB8fCBwYXJzZUludChrZXkpIDwgc21hbGxlc3QpKSB7XG4gICAgICAgICAgICAgICAgc21hbGxlc3QgPSBwYXJzZUludChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzbWFsbGVzdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBMaW5lQXRTdGF0aW9uIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFByZWZlcnJlZFRyYWNrIHtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgXG4gICAgZnJvbVN0cmluZyh2YWx1ZTogc3RyaW5nKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBpZiAodmFsdWUgIT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJlZmVycmVkVHJhY2sodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZyb21OdW1iZXIodmFsdWU6IG51bWJlcik6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gdmFsdWUgPj0gMCA/ICcrJyA6ICcnO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHByZWZpeCArIHZhbHVlKTtcbiAgICB9XG5cbiAgICBmcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKGF0U3RhdGlvbjogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXRTdGF0aW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5oYXNUcmFja051bWJlcigpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21OdW1iZXIoYXRTdGF0aW9uLnRyYWNrKTsgICAgICAgIFxuICAgIH1cblxuICAgIGtlZXBPbmx5U2lnbigpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLnZhbHVlWzBdO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHYgPT0gJy0nID8gdiA6ICcrJyk7XG4gICAgfVxuXG4gICAgaGFzVHJhY2tOdW1iZXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmxlbmd0aCA+IDE7XG4gICAgfVxuXG4gICAgZ2V0IHRyYWNrTnVtYmVyKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLnZhbHVlLnJlcGxhY2UoJyonLCAnJykpXG4gICAgfVxuXG4gICAgaXNQb3NpdGl2ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbMF0gIT0gJy0nO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRpb24ge1xuICAgIHByaXZhdGUgc3RhdGljIERJUlM6IHsgW2lkOiBzdHJpbmddOiBudW1iZXIgfSA9IHsnc3cnOiAtMTM1LCAndyc6IC05MCwgJ253JzogLTQ1LCAnbic6IDAsICduZSc6IDQ1LCAnZSc6IDkwLCAnc2UnOiAxMzUsICdzJzogMTgwfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RlZ3JlZXM6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20oZGlyZWN0aW9uOiBzdHJpbmcpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oUm90YXRpb24uRElSU1tkaXJlY3Rpb25dIHx8IDApO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKFJvdGF0aW9uLkRJUlMpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZhbHVlLCB0aGlzLmRlZ3JlZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ24nO1xuICAgIH1cblxuICAgIGdldCBkZWdyZWVzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWdyZWVzO1xuICAgIH1cblxuICAgIGdldCByYWRpYW5zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlZ3JlZXMgLyAxODAgKiBNYXRoLlBJO1xuICAgIH1cblxuICAgIGFkZCh0aGF0OiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMuZGVncmVlcyArIHRoYXQuZGVncmVlcztcbiAgICAgICAgaWYgKHN1bSA8PSAtMTgwKVxuICAgICAgICAgICAgc3VtICs9IDM2MDtcbiAgICAgICAgaWYgKHN1bSA+IDE4MClcbiAgICAgICAgICAgIHN1bSAtPSAzNjA7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oc3VtKTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IGEgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGxldCBiID0gdGhhdC5kZWdyZWVzO1xuICAgICAgICBsZXQgZGlzdCA9IGItYTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3QpID4gMTgwKSB7XG4gICAgICAgICAgICBpZiAoYSA8IDApXG4gICAgICAgICAgICAgICAgYSArPSAzNjA7XG4gICAgICAgICAgICBpZiAoYiA8IDApXG4gICAgICAgICAgICAgICAgYiArPSAzNjA7XG4gICAgICAgICAgICBkaXN0ID0gYi1hO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGlzdCk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IGRpciA9IHRoaXMuZGVncmVlcztcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhkaXIsIC05MCkpXG4gICAgICAgICAgICBkaXIgPSAwO1xuICAgICAgICBlbHNlIGlmIChkaXIgPCAtOTApXG4gICAgICAgICAgICBkaXIgKz0gMTgwO1xuICAgICAgICBlbHNlIGlmIChkaXIgPiA5MClcbiAgICAgICAgICAgIGRpciAtPSAxODA7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGlyKTtcbiAgICB9XG5cbiAgICBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzICUgMTgwID09IDA7XG4gICAgfVxuXG4gICAgcXVhcnRlckRpcmVjdGlvbihyZWxhdGl2ZVRvOiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGNvbnN0IGRlZyA9IGRlbHRhRGlyIDwgMCA/IE1hdGguY2VpbCgoZGVsdGFEaXItNDUpLzkwKSA6IE1hdGguZmxvb3IoKGRlbHRhRGlyKzQ1KS85MCk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKjkwKTtcbiAgICB9XG5cbiAgICBoYWxmRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBzcGxpdEF4aXM6IFJvdGF0aW9uKTogUm90YXRpb24ge1xuICAgICAgICBjb25zdCBkZWx0YURpciA9IHJlbGF0aXZlVG8uZGVsdGEodGhpcykuZGVncmVlcztcbiAgICAgICAgbGV0IGRlZztcbiAgICAgICAgaWYgKHNwbGl0QXhpcy5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDAgJiYgZGVsdGFEaXIgPj0gLTE4MClcbiAgICAgICAgICAgICAgICBkZWcgPSAtOTA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVnID0gOTA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGVsdGFEaXIgPCA5MCAmJiBkZWx0YURpciA+PSAtOTApXG4gICAgICAgICAgICAgICAgZGVnID0gMDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSAxODA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihkZWcpO1xuICAgIH1cblxuICAgIG5lYXJlc3RSb3VuZGVkSW5EaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24sIGRpcmVjdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNlaWxlZE9yRmxvb3JlZE9yaWVudGF0aW9uID0gcmVsYXRpdmVUby5yb3VuZChkaXJlY3Rpb24pO1xuICAgICAgICBjb25zdCBkaWZmZXJlbmNlSW5PcmllbnRhdGlvbiA9IE1hdGguYWJzKGNlaWxlZE9yRmxvb3JlZE9yaWVudGF0aW9uLmRlZ3JlZXMgLSB0aGlzLmRlZ3JlZXMpICUgOTA7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChuZXcgUm90YXRpb24oTWF0aC5zaWduKGRpcmVjdGlvbikqZGlmZmVyZW5jZUluT3JpZW50YXRpb24pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJvdW5kKGRpcmVjdGlvbjogbnVtYmVyKTogUm90YXRpb24ge1xuICAgICAgICBjb25zdCBkZWcgPSB0aGlzLmRlZ3JlZXMgLyA0NTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbigoZGlyZWN0aW9uID49IDAgPyBNYXRoLmNlaWwoZGVnKSA6IE1hdGguZmxvb3IoZGVnKSkgKiA0NSk7XG4gICAgfVxuXG4gICAgXG59IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU1QUkVDSVNJT046IG51bWJlciA9IDAuMDAxO1xuXG4gICAgc3RhdGljIGVxdWFscyhhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDwgVXRpbHMuSU1QUkVDSVNJT047XG4gICAgfVxuXG4gICAgc3RhdGljIHRyaWxlbW1hKGludDogbnVtYmVyLCBvcHRpb25zOiBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10pOiBzdHJpbmcge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGludCwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKGludCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zWzBdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhbHBoYWJldGljSWQoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYSA8IGIpXG4gICAgICAgICAgICByZXR1cm4gYSArICdfJyArIGI7XG4gICAgICAgIHJldHVybiBiICsgJ18nICsgYTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZWFzZSh4OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDMpIC8gMjtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgVmVjdG9yIHtcbiAgICBzdGF0aWMgVU5JVDogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAtMSk7XG4gICAgc3RhdGljIE5VTEw6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgMCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF94OiBudW1iZXIsIHByaXZhdGUgX3k6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgZ2V0IHgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgfVxuXG4gICAgZ2V0IHkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKTtcbiAgICB9XG5cbiAgICB3aXRoTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLmxlbmd0aCAhPSAwID8gbGVuZ3RoL3RoaXMubGVuZ3RoIDogMDtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54KnJhdGlvLCB0aGlzLnkqcmF0aW8pO1xuICAgIH1cblxuICAgIHNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbjogUm90YXRpb24pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzID0gVmVjdG9yLlVOSVQucm90YXRlKGRpcmVjdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLmRvdFByb2R1Y3Qocykvcy5kb3RQcm9kdWN0KHMpO1xuICAgIH1cblxuICAgIGFkZCh0aGF0IDogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICsgdGhhdC54LCB0aGlzLnkgKyB0aGF0LnkpO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoYXQueCAtIHRoaXMueCwgdGhhdC55IC0gdGhpcy55KTtcbiAgICB9XG5cbiAgICByb3RhdGUodGhldGE6IFJvdGF0aW9uKTogVmVjdG9yIHtcbiAgICAgICAgbGV0IHJhZDogbnVtYmVyID0gdGhldGEucmFkaWFucztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICogTWF0aC5jb3MocmFkKSAtIHRoaXMueSAqIE1hdGguc2luKHJhZCksIHRoaXMueCAqIE1hdGguc2luKHJhZCkgKyB0aGlzLnkgKiBNYXRoLmNvcyhyYWQpKTtcbiAgICB9XG5cbiAgICBkb3RQcm9kdWN0KHRoYXQ6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLngqdGhhdC54K3RoaXMueSp0aGF0Lnk7XG4gICAgfVxuXG4gICAgc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IHthOiBudW1iZXIsIGI6IG51bWJlcn0ge1xuICAgICAgICBjb25zdCBkZWx0YTogVmVjdG9yID0gdGhpcztcbiAgICAgICAgY29uc3Qgc3dhcFplcm9EaXZpc2lvbiA9IFV0aWxzLmVxdWFscyhkaXIyLnksIDApO1xuICAgICAgICBjb25zdCB4ID0gc3dhcFplcm9EaXZpc2lvbiA/ICd5JyA6ICd4JztcbiAgICAgICAgY29uc3QgeSA9IHN3YXBaZXJvRGl2aXNpb24gPyAneCcgOiAneSc7XG4gICAgICAgIGNvbnN0IGRlbm9taW5hdG9yID0gKGRpcjFbeV0qZGlyMlt4XS1kaXIxW3hdKmRpcjJbeV0pO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGRlbm9taW5hdG9yLCAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHthOiBOYU4sIGI6IE5hTn07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYSA9IChkZWx0YVt5XSpkaXIyW3hdLWRlbHRhW3hdKmRpcjJbeV0pL2Rlbm9taW5hdG9yO1xuICAgICAgICBjb25zdCBiID0gKGEqZGlyMVt5XS1kZWx0YVt5XSkvZGlyMlt5XTtcbiAgICAgICAgcmV0dXJuIHthLCBifTtcbiAgICB9XG5cbiAgICBpc0RlbHRhTWF0Y2hpbmdQYXJhbGxlbChkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBhID0gdGhpcy5hbmdsZShkaXIxKS5kZWdyZWVzO1xuICAgICAgICBjb25zdCBiID0gZGlyMS5hbmdsZShkaXIyKS5kZWdyZWVzO1xuICAgICAgICByZXR1cm4gVXRpbHMuZXF1YWxzKGEgJSAxODAsIDApICYmIFV0aWxzLmVxdWFscyhiICUgMTgwLCAwKTtcbiAgICB9XG5cbiAgICBpbmNsaW5hdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy54LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy55ID4gMCA/IDE4MCA6IDApO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueSwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueCA+IDAgPyA5MCA6IC05MCk7XG4gICAgICAgIGNvbnN0IGFkamFjZW50ID0gbmV3IFZlY3RvcigwLC1NYXRoLmFicyh0aGlzLnkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihNYXRoLnNpZ24odGhpcy54KSpNYXRoLmFjb3ModGhpcy5kb3RQcm9kdWN0KGFkamFjZW50KS9hZGphY2VudC5sZW5ndGgvdGhpcy5sZW5ndGgpKjE4MC9NYXRoLlBJKTtcbiAgICB9XG5cbiAgICBhbmdsZShvdGhlcjogVmVjdG9yKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmNsaW5hdGlvbigpLmRlbHRhKG90aGVyLmluY2xpbmF0aW9uKCkpO1xuICAgIH1cblxuICAgIGJvdGhBeGlzTWlucyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54IDwgb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA8IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJvdGhBeGlzTWF4cyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ID4gb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA+IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJldHdlZW4ob3RoZXI6IFZlY3RvciwgeDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5kZWx0YShvdGhlcik7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChkZWx0YS53aXRoTGVuZ3RoKGRlbHRhLmxlbmd0aCp4KSk7XG4gICAgfVxuXG4gICAgZXF1YWxzKG90aGVyOiBWZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PSBvdGhlci54ICYmIHRoaXMueSA9PSBvdGhlci55O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5cbmV4cG9ydCBjbGFzcyBab29tZXIge1xuICAgIHN0YXRpYyBaT09NX0RVUkFUSU9OID0gMTtcbiAgICBzdGF0aWMgUEFERElOR19GQUNUT1IgPSA0MDtcbiAgICBcbiAgICBwcml2YXRlIGJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgcHJpdmF0ZSBjdXN0b21EdXJhdGlvbiA9IC0xO1xuICAgIHByaXZhdGUgcmVzZXRGbGFnID0gZmFsc2U7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXNTaXplOiBCb3VuZGluZ0JveCwgcHJpdmF0ZSB6b29tTWF4U2NhbGUgPSAzKSB7XG4gICAgfVxuXG4gICAgaW5jbHVkZShib3VuZGluZ0JveDogQm91bmRpbmdCb3gsIGZyb206IEluc3RhbnQsIHRvOiBJbnN0YW50LCBkcmF3OiBib29sZWFuLCBzaG91bGRBbmltYXRlOiBib29sZWFuLCBwYWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IG5vdyA9IGRyYXcgPyBmcm9tIDogdG87XG4gICAgICAgIGlmIChub3cuZmxhZy5pbmNsdWRlcygna2VlcHpvb20nKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldEZsYWcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0RmxhZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9SZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNob3VsZEFuaW1hdGUgJiYgIW5vdy5mbGFnLmluY2x1ZGVzKCdub3pvb20nKSkge1xuICAgICAgICAgICAgICAgIGlmIChwYWQgJiYgIWJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gdGhpcy5wYWRkZWRCb3VuZGluZ0JveChib3VuZGluZ0JveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3gudGwgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJvdGhBeGlzTWlucyhib3VuZGluZ0JveC50bCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC5iciA9IHRoaXMuYm91bmRpbmdCb3guYnIuYm90aEF4aXNNYXhzKGJvdW5kaW5nQm94LmJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZW5mb3JjZWRCb3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGlmICghdGhpcy5ib3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgY29uc3QgcGFkZGVkQm91bmRpbmdCb3ggPSB0aGlzLmJvdW5kaW5nQm94O1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBwYWRkZWRCb3VuZGluZ0JveC5kaW1lbnNpb25zO1xuICAgICAgICAgICAgY29uc3QgY2FudmFzU2l6ZSA9IHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zO1xuICAgICAgICAgICAgY29uc3QgbWluWm9vbVNpemUgPSBuZXcgVmVjdG9yKGNhbnZhc1NpemUueCAvIHRoaXMuem9vbU1heFNjYWxlLCBjYW52YXNTaXplLnkgLyB0aGlzLnpvb21NYXhTY2FsZSk7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHpvb21TaXplLmRlbHRhKG1pblpvb21TaXplKTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxTcGFjaW5nID0gbmV3IFZlY3RvcihNYXRoLm1heCgwLCBkZWx0YS54LzIpLCBNYXRoLm1heCgwLCBkZWx0YS55LzIpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChcbiAgICAgICAgICAgICAgICBwYWRkZWRCb3VuZGluZ0JveC50bC5hZGQoYWRkaXRpb25hbFNwYWNpbmcucm90YXRlKG5ldyBSb3RhdGlvbigxODApKSksXG4gICAgICAgICAgICAgICAgcGFkZGVkQm91bmRpbmdCb3guYnIuYWRkKGFkZGl0aW9uYWxTcGFjaW5nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhZGRlZEJvdW5kaW5nQm94KGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgcGFkZGluZyA9IFpvb21lci5QQURESU5HX0ZBQ1RPUipNYXRoLm1pbih0aGlzLnpvb21NYXhTY2FsZSwgOCk7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goXG4gICAgICAgICAgICBib3VuZGluZ0JveC50bC5hZGQobmV3IFZlY3RvcigtcGFkZGluZywgLXBhZGRpbmcpKSxcbiAgICAgICAgICAgIGJvdW5kaW5nQm94LmJyLmFkZChuZXcgVmVjdG9yKHBhZGRpbmcsIHBhZGRpbmcpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldCBjZW50ZXIoKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgZW5mb3JjZWRCb3VuZGluZ0JveCA9IHRoaXMuZW5mb3JjZWRCb3VuZGluZ0JveCgpO1xuICAgICAgICBpZiAoIWVuZm9yY2VkQm91bmRpbmdCb3guaXNOdWxsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueCArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueCkvMiksIFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueSArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueSkvMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhc1NpemUudGwuYmV0d2Vlbih0aGlzLmNhbnZhc1NpemUuYnIsIDAuNSk7XG4gICAgfVxuXG4gICAgZ2V0IHNjYWxlKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKCFlbmZvcmNlZEJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tU2l6ZSA9IGVuZm9yY2VkQm91bmRpbmdCb3guZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5jYW52YXNTaXplLmRpbWVuc2lvbnM7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5taW4oZGVsdGEueCAvIHpvb21TaXplLngsIGRlbHRhLnkgLyB6b29tU2l6ZS55KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBnZXQgZHVyYXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tRHVyYXRpb24gPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21EdXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRvUmVzZXQoKSB7XG4gICAgICAgIHRoaXMuYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcbiAgICAgICAgdGhpcy5jdXN0b21EdXJhdGlvbiA9IC0xO1xuICAgICAgICB0aGlzLnJlc2V0RmxhZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy5yZXNldEZsYWcgPSB0cnVlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveDtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0VGltZWREcmF3YWJsZSBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFkYXB0ZXI6IEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIHByaXZhdGUgX2Zyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICBwcml2YXRlIF90byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBwcml2YXRlIF9uYW1lID0gdGhpcy5hZGFwdGVyLm5hbWU7XG4gICAgcHJpdmF0ZSBfYm91bmRpbmdCb3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb207XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG87XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kaW5nQm94O1xuICAgIH1cblxuICAgIGFic3RyYWN0IGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlcjtcblxuICAgIGFic3RyYWN0IGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXI7XG5cbn0iLCJpbXBvcnQgeyBBYnN0cmFjdFRpbWVkRHJhd2FibGUsIEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIgfSBmcm9tIFwiLi9BYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIHtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgR2VuZXJpY1RpbWVkRHJhd2FibGUgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFkYXB0ZXI6IEdlbmVyaWNUaW1lZERyYXdhYmxlQWRhcHRlcikge1xuICAgICAgICBzdXBlcihhZGFwdGVyKTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgIWFuaW1hdGUgPyAwIDogdGhpcy5hZGFwdGVyLmZyb20uZGVsdGEodGhpcy5hZGFwdGVyLnRvKSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgWm9vbWVyIH0gZnJvbSBcIi4uL1pvb21lclwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBBYnN0cmFjdFRpbWVkRHJhd2FibGUsIEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIgfSBmcm9tIFwiLi9BYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBLZW5JbWFnZUFkYXB0ZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIHtcbiAgICB6b29tOiBWZWN0b3I7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIpOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEtlbkltYWdlIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBLZW5JbWFnZUFkYXB0ZXIpIHtcbiAgICAgICAgc3VwZXIoYWRhcHRlcik7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmJvdW5kaW5nQm94KTtcbiAgICAgICAgem9vbWVyLmluY2x1ZGUodGhpcy5nZXRab29tZWRCb3VuZGluZ0JveCgpLCBJbnN0YW50LkJJR19CQU5HLCBJbnN0YW50LkJJR19CQU5HLCB0cnVlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCAhYW5pbWF0ZSA/IDAgOiB0aGlzLmFkYXB0ZXIuZnJvbS5kZWx0YSh0aGlzLmFkYXB0ZXIudG8pLCB6b29tZXIuY2VudGVyLCB6b29tZXIuc2NhbGUpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRab29tZWRCb3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG5cbiAgICAgICAgY29uc3QgY2VudGVyID0gdGhpcy5hZGFwdGVyLnpvb207XG4gICAgICAgIGlmIChjZW50ZXIgIT0gVmVjdG9yLk5VTEwpIHtcbiAgICAgICAgICAgIGNvbnN0IHpvb21CYm94ID0gYmJveC5jYWxjdWxhdGVCb3VuZGluZ0JveEZvclpvb20oY2VudGVyLngsIGNlbnRlci55KTtcbiAgICAgICAgICAgIHJldHVybiB6b29tQmJveDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmJveDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBBYnN0cmFjdFRpbWVkRHJhd2FibGUsIEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIgfSBmcm9tIFwiLi9BYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBMYWJlbEFkYXB0ZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIHtcbiAgICBmb3JTdGF0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZm9yTGluZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIHRleHRDb29yZHM6IFZlY3RvciwgbGFiZWxEaXI6IFJvdGF0aW9uLCBjaGlsZHJlbjogTGFiZWxBZGFwdGVyW10pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbiAgICBjbG9uZUZvclN0YXRpb24oc3RhdGlvbklkOiBzdHJpbmcpOiBMYWJlbEFkYXB0ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBMYWJlbCBleHRlbmRzIEFic3RyYWN0VGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIExBQkVMX0hFSUdIVCA9IDEyO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFkYXB0ZXI6IExhYmVsQWRhcHRlciwgcHJpdmF0ZSBzdGF0aW9uUHJvdmlkZXI6IFN0YXRpb25Qcm92aWRlcikge1xuICAgICAgICBzdXBlcihhZGFwdGVyKTtcbiAgICB9XG5cbiAgICBjaGlsZHJlbjogTGFiZWxbXSA9IFtdO1xuXG4gICAgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8IHRoaXMuYWRhcHRlci5mb3JMaW5lIHx8ICcnO1xuICAgIH1cbiAgICBcbiAgICBnZXQgZm9yU3RhdGlvbigpOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8ICcnKTtcbiAgICAgICAgaWYgKHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmZvclN0YXRpb247XG4gICAgICAgICAgICBzdGF0aW9uLmFkZExhYmVsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24ubGluZXNFeGlzdGluZygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3Rm9yU3RhdGlvbihkZWxheSwgc3RhdGlvbiwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgdGVybWluaSA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5hZGFwdGVyLmZvckxpbmUpLnRlcm1pbmk7XG4gICAgICAgICAgICB0ZXJtaW5pLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHQuc3RhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBpZiAocyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHMubGFiZWxzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmRyYXcoZGVsYXksIGFuaW1hdGUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xhYmVsRm9yU3RhdGlvbiA9IG5ldyBMYWJlbCh0aGlzLmFkYXB0ZXIuY2xvbmVGb3JTdGF0aW9uKHMuaWQpLCB0aGlzLnN0YXRpb25Qcm92aWRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYWRkTGFiZWwobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xhYmVsRm9yU3RhdGlvbi5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXdMYWJlbEZvclN0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBWZWN0b3IuTlVMTCwgUm90YXRpb24uZnJvbSgnbicpLCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3Rm9yU3RhdGlvbihkZWxheVNlY29uZHM6IG51bWJlciwgc3RhdGlvbjogU3RhdGlvbiwgZm9yTGluZTogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgIGxldCB5T2Zmc2V0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHN0YXRpb24ubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gc3RhdGlvbi5sYWJlbHNbaV07XG4gICAgICAgICAgICBpZiAobCA9PSB0aGlzKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgeU9mZnNldCArPSBMYWJlbC5MQUJFTF9IRUlHSFQqMS41O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxhYmVsRGlyID0gc3RhdGlvbi5sYWJlbERpcjtcblxuICAgICAgICB5T2Zmc2V0ID0gTWF0aC5zaWduKFZlY3Rvci5VTklULnJvdGF0ZShsYWJlbERpcikueSkqeU9mZnNldCAtICh5T2Zmc2V0PjAgPyAyIDogMCk7IC8vVE9ETyBtYWdpYyBudW1iZXJzXG4gICAgICAgIGNvbnN0IHN0YXRpb25EaXIgPSBzdGF0aW9uLnJvdGF0aW9uO1xuICAgICAgICBjb25zdCBkaWZmRGlyID0gbGFiZWxEaXIuYWRkKG5ldyBSb3RhdGlvbigtc3RhdGlvbkRpci5kZWdyZWVzKSk7XG4gICAgICAgIGNvbnN0IHVuaXR2ID0gVmVjdG9yLlVOSVQucm90YXRlKGRpZmZEaXIpO1xuICAgICAgICBjb25zdCBhbmNob3IgPSBuZXcgVmVjdG9yKHN0YXRpb24uc3RhdGlvblNpemVGb3JBeGlzKCd4JywgdW5pdHYueCksIHN0YXRpb24uc3RhdGlvblNpemVGb3JBeGlzKCd5JywgdW5pdHYueSkpO1xuICAgICAgICBjb25zdCB0ZXh0Q29vcmRzID0gYmFzZUNvb3JkLmFkZChhbmNob3Iucm90YXRlKHN0YXRpb25EaXIpKS5hZGQobmV3IFZlY3RvcigwLCB5T2Zmc2V0KSk7XG4gICAgXG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5U2Vjb25kcywgdGV4dENvb3JkcywgbGFiZWxEaXIsIHRoaXMuY2hpbGRyZW4ubWFwKGMgPT4gYy5hZGFwdGVyKSk7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yU3RhdGlvbi5yZW1vdmVMYWJlbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hZGFwdGVyLmZvckxpbmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgYy5lcmFzZShkZWxheSwgYW5pbWF0ZSwgcmV2ZXJzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufSIsImltcG9ydCB7IFN0YXRpb24sIFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuLi9QcmVmZXJyZWRUcmFja1wiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciwgQWJzdHJhY3RUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUFkYXB0ZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyICB7XG4gICAgc3RvcHM6IFN0b3BbXTtcbiAgICB3ZWlnaHQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICB0b3RhbExlbmd0aDogbnVtYmVyO1xuICAgIHRlcm1pbmk6IFZlY3RvcltdO1xuICAgIHNwZWVkOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgYW5pbU9yZGVyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZDtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgcGF0aDogVmVjdG9yW10sIGxlbmd0aDogbnVtYmVyLCBjb2xvckRldmlhdGlvbjogbnVtYmVyKTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSwgY29sb3JGcm9tOiBudW1iZXIsIGNvbG9yVG86IG51bWJlcik6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBsZW5ndGg6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBMaW5lIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTk9ERV9ESVNUQU5DRSA9IDA7XG4gICAgc3RhdGljIFNQRUVEID0gMTAwO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFkYXB0ZXI6IExpbmVBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyLCBwcml2YXRlIGJlY2tTdHlsZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgc3VwZXIoYWRhcHRlcik7XG4gICAgfVxuXG4gICAgd2VpZ2h0ID0gdGhpcy5hZGFwdGVyLndlaWdodDtcbiAgICBhbmltT3JkZXIgPSB0aGlzLmFkYXB0ZXIuYW5pbU9yZGVyO1xuICAgIFxuICAgIHByaXZhdGUgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIHByZWNlZGluZ0RpcjogUm90YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBfcGF0aDogVmVjdG9yW10gPSBbXTtcblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICghKHRoaXMuYWRhcHRlci50b3RhbExlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUxpbmUoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLl9wYXRoLCBhbmltYXRlKTtcbiAgICAgICAgY29uc3QgbGluZUdyb3VwID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpO1xuICAgICAgICBsaW5lR3JvdXAuYWRkTGluZSh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIGR1cmF0aW9uLCByZXZlcnNlLCB0aGlzLl9wYXRoLCB0aGlzLmdldFRvdGFsTGVuZ3RoKHRoaXMuX3BhdGgpLCBsaW5lR3JvdXAuc3Ryb2tlQ29sb3IpO1xuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgbW92ZShkZWxheTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcGF0aDogVmVjdG9yW10sIGNvbG9yRGV2aWF0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG9sZFBhdGggPSB0aGlzLl9wYXRoO1xuICAgICAgICBpZiAob2xkUGF0aC5sZW5ndGggPCAyIHx8IHBhdGgubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdUcnlpbmcgdG8gbW92ZSBhIG5vbi1leGlzdGluZyBsaW5lJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9sZFBhdGgubGVuZ3RoICE9IHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICBvbGRQYXRoID0gW29sZFBhdGhbMF0sIG9sZFBhdGhbb2xkUGF0aC5sZW5ndGgtMV1dO1xuICAgICAgICAgICAgcGF0aCA9IFtwYXRoWzBdLCBwYXRoW3BhdGgubGVuZ3RoLTFdXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaW5lR3JvdXAgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHRoaXMuX3BhdGgsIHBhdGgsIGxpbmVHcm91cC5zdHJva2VDb2xvciwgY29sb3JEZXZpYXRpb24pO1xuICAgICAgICBsaW5lR3JvdXAuc3Ryb2tlQ29sb3IgPSBjb2xvckRldmlhdGlvbjtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uRHVyYXRpb24odGhpcy5fcGF0aCwgYW5pbWF0ZSk7XG4gICAgICAgIHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKS5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXksIGR1cmF0aW9uLCByZXZlcnNlLCB0aGlzLmdldFRvdGFsTGVuZ3RoKHRoaXMuX3BhdGgpKTtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMubmFtZSArICc6IFN0YXRpb24gd2l0aCBJRCAnICsgc3RvcHNbal0uc3RhdGlvbklkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHN0b3AucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgICAgIHN0b3AuZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChzdG9wc1tqLTFdLnN0YXRpb25JZCwgc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBsZXQgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChoZWxwU3RvcElkKTtcbiAgICAgICAgICAgICAgICBpZiAoaGVscFN0b3AgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlbHBTdG9wLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxpbmUoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuX3BhdGg7XG5cbiAgICAgICAgbGV0IHRyYWNrID0gbmV3IFByZWZlcnJlZFRyYWNrKCcrJyk7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tU3RyaW5nKHN0b3BzW2pdLnRyYWNrSW5mbyk7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5uYW1lICsgJzogU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKHN0b3AuYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKHRoaXMubmFtZSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzdG9wc1tqXS5jb29yZCA9IHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdG9wLCB0aGlzLm5leHRTdG9wQmFzZUNvb3JkKHN0b3BzLCBqLCBzdG9wLmJhc2VDb29yZHMpLCB0cmFjaywgcGF0aCwgZGVsYXksIGFuaW1hdGUsIHRydWUpO1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5rZWVwT25seVNpZ24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbmV4dFN0b3BCYXNlQ29vcmQoc3RvcHM6IFN0b3BbXSwgY3VycmVudFN0b3BJbmRleDogbnVtYmVyLCBkZWZhdWx0Q29vcmRzOiBWZWN0b3IpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRTdG9wSW5kZXgrMSA8IHN0b3BzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBzdG9wc1tjdXJyZW50U3RvcEluZGV4KzFdLnN0YXRpb25JZDtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChpZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMubmFtZSArICc6IFN0YXRpb24gd2l0aCBJRCAnICsgaWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3AuYmFzZUNvb3JkczsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdENvb3JkcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgdHJhY2s6IFByZWZlcnJlZFRyYWNrLCBwYXRoOiBWZWN0b3JbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmVjdXJzZTogYm9vbGVhbik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgY29uc3QgbmV3RGlyID0gdGhpcy5nZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgZGlyLCBwYXRoKTtcbiAgICAgICAgY29uc3QgbmV3UG9zID0gc3RhdGlvbi5hc3NpZ25UcmFjayhuZXdEaXIuaXNWZXJ0aWNhbCgpID8gJ3gnIDogJ3knLCB0cmFjaywgdGhpcyk7XG5cbiAgICAgICAgY29uc3QgbmV3Q29vcmQgPSBzdGF0aW9uLnJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKG5ld0RpciwgbmV3UG9zKTtcbiAgICBcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gdGhpcy5nZXRQcmVjZWRpbmdEaXIodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgb2xkQ29vcmQsIG5ld0Nvb3JkKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb25EaXIgPSBuZXdEaXIuYWRkKGRpcik7XG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IHRoaXMuaW5zZXJ0Tm9kZShvbGRDb29yZCwgdGhpcy5wcmVjZWRpbmdEaXIsIG5ld0Nvb3JkLCBzdGF0aW9uRGlyLCBwYXRoKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZm91bmQgJiYgcmVjdXJzZSAmJiB0aGlzLnByZWNlZGluZ1N0b3AgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3AgPSB0aGlzLmdldE9yQ3JlYXRlSGVscGVyU3RvcCh0aGlzLnByZWNlZGluZ0RpciwgdGhpcy5wcmVjZWRpbmdTdG9wLCBzdGF0aW9uKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMucHJlY2VkaW5nRGlyLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVDb25uZWN0aW9uKGhlbHBTdG9wLCBiYXNlQ29vcmQsIHRyYWNrLmtlZXBPbmx5U2lnbigpLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIHRyYWNrLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3BhdGggdG8gZml4IG9uIGxpbmUnLCB0aGlzLmFkYXB0ZXIubmFtZSwgJ2F0IHN0YXRpb24nLCBzdGF0aW9uLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gc3RhdGlvbkRpcjtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aW9uLmFkZExpbmUodGhpcywgbmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgbmV3UG9zKTtcbiAgICAgICAgcGF0aC5wdXNoKG5ld0Nvb3JkKTtcblxuICAgICAgICBkZWxheSA9IHRoaXMuZ2V0QW5pbWF0aW9uRHVyYXRpb24ocGF0aCwgYW5pbWF0ZSkgKyBkZWxheTtcbiAgICAgICAgc3RhdGlvbi5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5wcmVjZWRpbmdTdG9wID0gc3RhdGlvbjtcbiAgICAgICAgcmV0dXJuIG5ld0Nvb3JkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgZGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0b3BCYXNlQ29vcmQuZGVsdGEob2xkQ29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKG5leHRTdG9wQmFzZUNvb3JkKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdBeGlzID0gc3RhdGlvbi5heGlzQW5kVHJhY2tGb3JFeGlzdGluZ0xpbmUodGhpcy5uYW1lKT8uYXhpcztcbiAgICAgICAgaWYgKGV4aXN0aW5nQXhpcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbiA9IGRlbHRhLmluY2xpbmF0aW9uKCkuaGFsZkRpcmVjdGlvbihkaXIsIGV4aXN0aW5nQXhpcyA9PSAneCcgPyBuZXcgUm90YXRpb24oOTApIDogbmV3IFJvdGF0aW9uKDApKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbi5hZGQoZGlyKS5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsdGEuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgfVxuICAgIFxuXG4gICAgcHJpdmF0ZSBnZXRQcmVjZWRpbmdEaXIocHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCwgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCwgb2xkQ29vcmQ6IFZlY3RvciwgbmV3Q29vcmQ6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWNlZGluZ1N0b3BSb3RhdGlvbiA9IHByZWNlZGluZ1N0b3A/LnJvdGF0aW9uID8/IG5ldyBSb3RhdGlvbigwKTtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24ocHJlY2VkaW5nU3RvcFJvdGF0aW9uKS5hZGQocHJlY2VkaW5nU3RvcFJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IHByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVjZWRpbmdEaXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbnNlcnROb2RlKGZyb21Db29yZDogVmVjdG9yLCBmcm9tRGlyOiBSb3RhdGlvbiwgdG9Db29yZDogVmVjdG9yLCB0b0RpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5iZWNrU3R5bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSBmcm9tQ29vcmQuZGVsdGEodG9Db29yZCk7XG4gICAgICAgIGNvbnN0IG9sZERpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZnJvbURpcik7XG4gICAgICAgIGNvbnN0IG5ld0RpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUodG9EaXIpO1xuICAgICAgICBpZiAoZGVsdGEuaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwob2xkRGlyViwgbmV3RGlyVikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZGVsdGEuc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihvbGREaXJWLCBuZXdEaXJWKVxuICAgICAgICBpZiAoc29sdXRpb24uYSA+IExpbmUuTk9ERV9ESVNUQU5DRSAmJiBzb2x1dGlvbi5iID4gTGluZS5OT0RFX0RJU1RBTkNFKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gobmV3IFZlY3Rvcihmcm9tQ29vcmQueCtvbGREaXJWLngqc29sdXRpb24uYSwgZnJvbUNvb3JkLnkrb2xkRGlyVi55KnNvbHV0aW9uLmEpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlSGVscGVyU3RvcChmcm9tRGlyOiBSb3RhdGlvbiwgZnJvbVN0b3A6IFN0YXRpb24sIHRvU3RvcDogU3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChmcm9tU3RvcC5pZCwgdG9TdG9wLmlkKTtcbiAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgIGlmIChoZWxwU3RvcCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gZnJvbVN0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gdG9TdG9wLmJhc2VDb29yZHM7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IG5ld0Nvb3JkLmRlbHRhKG9sZENvb3JkKTtcbiAgICAgICAgICAgIGNvbnN0IGRlZyA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJtZWRpYXRlRGlyID0gZnJvbVN0b3Aucm90YXRpb24ubmVhcmVzdFJvdW5kZWRJbkRpcmVjdGlvbihkZWcsIGZyb21EaXIuZGVsdGEoZGVnKS5kZWdyZWVzKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZUNvb3JkID0gZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgvMikuYWRkKG5ld0Nvb3JkKTtcblxuICAgICAgICAgICAgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5jcmVhdGVWaXJ0dWFsU3RvcChoZWxwU3RvcElkLCBpbnRlcm1lZGlhdGVDb29yZCwgaW50ZXJtZWRpYXRlRGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGVscFN0b3A7XG4gICAgfVxuXG4gICAgZ2V0IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLl9wYXRoLCB0cnVlKTtcbiAgICB9XG5cbiAgICBnZXQgc3BlZWQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5zcGVlZCB8fCBMaW5lLlNQRUVEO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QW5pbWF0aW9uRHVyYXRpb24ocGF0aDogVmVjdG9yW10sIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCkgLyB0aGlzLnNwZWVkO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFRvdGFsTGVuZ3RoKHBhdGg6IFZlY3RvcltdKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYWN0dWFsTGVuZ3RoID0gdGhpcy5hZGFwdGVyLnRvdGFsTGVuZ3RoO1xuICAgICAgICBpZiAoYWN0dWFsTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdHVhbExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhdGgubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgbGVuZ3RoICs9IHBhdGhbaV0uZGVsdGEocGF0aFtpKzFdKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXQgdGVybWluaSgpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA9PSAwKSBcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIFtzdG9wc1swXSwgc3RvcHNbc3RvcHMubGVuZ3RoLTFdXTtcbiAgICB9XG5cbiAgICBnZXQgcGF0aCgpOiBWZWN0b3JbXSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnRlcm1pbmk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG4gICAgfVxuXG4gICAgZ2V0U3RvcChzdGF0aW9uSWQ6IHN0cmluZyk6IFN0b3AgfCBudWxsIHtcbiAgICAgICAgZm9yIChjb25zdCBzdG9wIG9mIE9iamVjdC52YWx1ZXModGhpcy5hZGFwdGVyLnN0b3BzKSkge1xuICAgICAgICAgICAgaWYgKHN0b3Auc3RhdGlvbklkID09IHN0YXRpb25JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuLi9QcmVmZXJyZWRUcmFja1wiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi9MYWJlbFwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IEFic3RyYWN0VGltZWREcmF3YWJsZSwgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB9IGZyb20gXCIuL0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpb25BZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgYmFzZUNvb3JkczogVmVjdG9yO1xuICAgIHJvdGF0aW9uOiBSb3RhdGlvbjtcbiAgICBsYWJlbERpcjogUm90YXRpb247XG4gICAgaWQ6IHN0cmluZztcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgU3RvcCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHN0YXRpb25JZDogc3RyaW5nLCBwdWJsaWMgdHJhY2tJbmZvOiBzdHJpbmcpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBjb29yZDogVmVjdG9yIHwgbnVsbCA9IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUF0U3RhdGlvbiB7XG4gICAgbGluZT86IExpbmU7XG4gICAgYXhpczogc3RyaW5nO1xuICAgIHRyYWNrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aW9uIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IExpbmVBdFN0YXRpb25bXX0gPSB7eDogW10sIHk6IFtdfTtcbiAgICBwcml2YXRlIGV4aXN0aW5nTGFiZWxzOiBMYWJlbFtdID0gW107XG4gICAgcHJpdmF0ZSBwaGFudG9tPzogTGluZUF0U3RhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBTdGF0aW9uQWRhcHRlcikge1xuICAgICAgICBzdXBlcihhZGFwdGVyKTtcbiAgICB9XG5cbiAgICBnZXQgYmFzZUNvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzO1xuICAgIH1cblxuICAgIHNldCBiYXNlQ29vcmRzKGJhc2VDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuYmFzZUNvb3JkcyA9IGJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzLCB0aGlzLmFkYXB0ZXIuYmFzZUNvb3Jkcyk7XG4gICAgfVxuXG4gICAgYWRkTGluZShsaW5lOiBMaW5lLCBheGlzOiBzdHJpbmcsIHRyYWNrOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5waGFudG9tID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10ucHVzaCh7bGluZTogbGluZSwgYXhpczogYXhpcywgdHJhY2s6IHRyYWNrfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGluZShsaW5lOiBMaW5lKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgfVxuXG4gICAgYWRkTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5leGlzdGluZ0xhYmVscy5pbmNsdWRlcyhsYWJlbCkpXG4gICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnB1c2gobGFiZWwpO1xuICAgIH1cblxuICAgIHJlbW92ZUxhYmVsKGxhYmVsOiBMYWJlbCk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5leGlzdGluZ0xhYmVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGFiZWxzW2ldID09IGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGlzdGluZ0xhYmVscy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsYWJlbHMoKTogTGFiZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4aXN0aW5nTGFiZWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlTGluZUF0QXhpcyhsaW5lOiBMaW5lLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBoYW50b20gPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgICAgICBleGlzdGluZ0xpbmVzRm9yQXhpcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZShsaW5lTmFtZTogc3RyaW5nKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLngpO1xuICAgICAgICBpZiAoeCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLnkpO1xuICAgICAgICBpZiAoeSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFja0ZvckxpbmVBdEF4aXMobGluZU5hbWU6IHN0cmluZywgZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0ubGluZT8ubmFtZSA9PSBsaW5lTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFzc2lnblRyYWNrKGF4aXM6IHN0cmluZywgcHJlZmVycmVkVHJhY2s6IFByZWZlcnJlZFRyYWNrLCBsaW5lOiBMaW5lKTogbnVtYmVyIHsgXG4gICAgICAgIGlmIChwcmVmZXJyZWRUcmFjay5oYXNUcmFja051bWJlcigpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2sudHJhY2tOdW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGhhbnRvbT8ubGluZT8ubmFtZSA9PSBsaW5lLm5hbWUgJiYgdGhpcy5waGFudG9tPy5heGlzID09IGF4aXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBoYW50b20/LnRyYWNrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMgPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllcygpW2F4aXNdO1xuICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2suaXNQb3NpdGl2ZSgpID8gcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpc1sxXSArIDEgOiBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzBdIC0gMTtcbiAgICB9XG5cbiAgICByb3RhdGVkVHJhY2tDb29yZGluYXRlcyhpbmNvbWluZ0RpcjogUm90YXRpb24sIGFzc2lnbmVkVHJhY2s6IG51bWJlcik6IFZlY3RvciB7IFxuICAgICAgICBsZXQgbmV3Q29vcmQ6IFZlY3RvcjtcbiAgICAgICAgaWYgKGluY29taW5nRGlyLmRlZ3JlZXMgJSAxODAgPT0gMCkge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKDAsIGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0Nvb3JkID0gbmV3Q29vcmQucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgICAgICBuZXdDb29yZCA9IHRoaXMuYmFzZUNvb3Jkcy5hZGQobmV3Q29vcmQpO1xuICAgICAgICByZXR1cm4gbmV3Q29vcmQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXMoKToge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy54KSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXMueSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gWzEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVmdCA9IDA7XG4gICAgICAgIGxldCByaWdodCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2spIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlZnQgPiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMuZm9yRWFjaChsID0+IGwuZHJhdyhkZWxheVNlY29uZHMsIGZhbHNlKSk7XG4gICAgICAgIGNvbnN0IHQgPSBzdGF0aW9uLnBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdDsgfSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB0bzogVmVjdG9yKSB7XG4gICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheVNlY29uZHMsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5iYXNlQ29vcmRzLCB0bywgKCkgPT4gc3RhdGlvbi5leGlzdGluZ0xhYmVscy5mb3JFYWNoKGwgPT4gbC5kcmF3KDAsIGZhbHNlKSkpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5U2Vjb25kcyk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHN0YXRpb25TaXplRm9yQXhpcyhheGlzOiBzdHJpbmcsIHZlY3RvcjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2ZWN0b3IsIDApKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGNvbnN0IGRpciA9IE1hdGguc2lnbih2ZWN0b3IpO1xuICAgICAgICBsZXQgZGltZW4gPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzW2F4aXNdKVt2ZWN0b3IgPCAwID8gMCA6IDFdO1xuICAgICAgICBpZiAoZGlyKmRpbWVuIDwgMCkge1xuICAgICAgICAgICAgZGltZW4gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbiAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIGRpciAqIChTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiArIFN0YXRpb24uTEFCRUxfRElTVEFOQ0UpO1xuICAgIH1cblxuICAgIGxpbmVzRXhpc3RpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGluZXMueC5sZW5ndGggPiAwIHx8IHRoaXMuZXhpc3RpbmdMaW5lcy55Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBBcnJpdmFsRGVwYXJ0dXJlVGltZSB9IGZyb20gXCIuLi9BcnJpdmFsRGVwYXJ0dXJlVGltZVwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciwgQWJzdHJhY3RUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhaW5BZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgc3RvcHM6IFN0b3BbXTtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBmb2xsb3c6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSk6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZvbGxvdzoge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9KTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFpbiBleHRlbmRzIEFic3RyYWN0VGltZWREcmF3YWJsZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYWRhcHRlcjogVHJhaW5BZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIHN1cGVyKGFkYXB0ZXIpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGxpbmVHcm91cCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKVxuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRyYWluIFwiICsgdGhpcy5uYW1lICsgXCIgbmVlZHMgYXQgbGVhc3QgMiBzdG9wc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpPTE7IGk8c3RvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmRlcCA9IG5ldyBBcnJpdmFsRGVwYXJ0dXJlVGltZShzdG9wc1tpXS50cmFja0luZm8pO1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IGxpbmVHcm91cC5nZXRQYXRoQmV0d2VlbihzdG9wc1tpLTFdLnN0YXRpb25JZCwgc3RvcHNbaV0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChwYXRoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBhbmltYXRlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXkgKyBhcnJkZXAuZGVwYXJ0dXJlIC0gdGhpcy5mcm9tLnNlY29uZCwgYXJyZGVwLmFycml2YWwgLSBhcnJkZXAuZGVwYXJ0dXJlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMubmFtZSArICc6IE5vIHBhdGggZm91bmQgYmV0d2VlbiAnICsgc3RvcHNbaS0xXS5zdGF0aW9uSWQgKyAnICcgKyBzdG9wc1tpXS5zdGF0aW9uSWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vc3ZnL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3ZnQW5pbWF0b3IgfSBmcm9tIFwiLi9zdmcvU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IERyYXdhYmxlU29ydGVyIH0gZnJvbSBcIi4vRHJhd2FibGVTb3J0ZXJcIjtcblxubGV0IHRpbWVQYXNzZWQgPSAwO1xuXG5jb25zdCBuZXR3b3JrOiBOZXR3b3JrID0gbmV3IE5ldHdvcmsobmV3IFN2Z05ldHdvcmsoKSwgbmV3IERyYXdhYmxlU29ydGVyKCkpO1xuY29uc3QgYW5pbWF0ZUZyb21JbnN0YW50OiBJbnN0YW50ID0gZ2V0U3RhcnRJbnN0YW50KCk7XG5sZXQgc3RhcnRlZCA9IGZhbHNlO1xuXG5pZiAobmV0d29yay5hdXRvU3RhcnQpIHtcbiAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICBzdGFydFRyYW5zcG9ydE5ldHdvcmtBbmltYXRvcigpO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzdGFydFRyYW5zcG9ydE5ldHdvcmtBbmltYXRvcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3RyYW5zcG9ydC1uZXR3b3JrLWFuaW1hdG9yIGFscmVhZHkgc3RhcnRlZC4gWW91IHNob3VsZCBwcm9iYWJseSBzZXQgZGF0YS1hdXRvLXN0YXJ0PVwiZmFsc2VcIi4gU3RhcnRpbmcgYW55d2F5cy4nKVxuICAgIH1cbiAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICBzdGFydFRyYW5zcG9ydE5ldHdvcmtBbmltYXRvcigpO1xufSk7XG5cbmZ1bmN0aW9uIHN0YXJ0VHJhbnNwb3J0TmV0d29ya0FuaW1hdG9yKCkge1xuICAgIG5ldHdvcmsuaW5pdGlhbGl6ZSgpOyAgICBcbiAgICBzbGlkZShJbnN0YW50LkJJR19CQU5HLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0SW5zdGFudCgpOiBJbnN0YW50IHtcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgICAgICBjb25zdCBhbmltYXRlRnJvbUluc3RhbnQ6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKS5zcGxpdCgnLScpO1xuICAgICAgICBjb25zdCBpbnN0YW50ID0gbmV3IEluc3RhbnQocGFyc2VJbnQoYW5pbWF0ZUZyb21JbnN0YW50WzBdKSB8fCAwLCBwYXJzZUludChhbmltYXRlRnJvbUluc3RhbnRbMV0pIHx8IDAsICcnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Zhc3QgZm9yd2FyZCB0bycsIGluc3RhbnQpO1xuICAgICAgICByZXR1cm4gaW5zdGFudDtcbiAgICB9XG4gICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG59XG5cbmZ1bmN0aW9uIHNsaWRlKGluc3RhbnQ6IEluc3RhbnQsIGFuaW1hdGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoaW5zdGFudCAhPSBJbnN0YW50LkJJR19CQU5HICYmIGluc3RhbnQuZXBvY2ggPj0gYW5pbWF0ZUZyb21JbnN0YW50LmVwb2NoICYmIGluc3RhbnQuc2Vjb25kID49IGFuaW1hdGVGcm9tSW5zdGFudC5zZWNvbmQpXG4gICAgICAgIGFuaW1hdGUgPSB0cnVlO1xuXG4gICAgY29uc29sZS5sb2coaW5zdGFudCwgJ3RpbWU6ICcgKyBNYXRoLmZsb29yKHRpbWVQYXNzZWQgLyA2MCkgKyAnOicgKyB0aW1lUGFzc2VkICUgNjApO1xuXG4gICAgbmV0d29yay5kcmF3VGltZWREcmF3YWJsZXNBdChpbnN0YW50LCBhbmltYXRlKTtcbiAgICBjb25zdCBuZXh0ID0gbmV0d29yay5uZXh0SW5zdGFudChpbnN0YW50KTtcbiAgICBcbiAgICBpZiAobmV4dCkge1xuICAgICAgICBjb25zdCBkZWx0YSA9IGluc3RhbnQuZGVsdGEobmV4dCk7XG4gICAgICAgIHRpbWVQYXNzZWQgKz0gZGVsdGE7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gYW5pbWF0ZSA/IGRlbHRhIDogMDtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheSoxMDAwLCAoKSA9PiBzbGlkZShuZXh0LCBhbmltYXRlKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB9IGZyb20gXCIuLi9kcmF3YWJsZXMvQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3RvcihyLngsIHIueSksIG5ldyBWZWN0b3Ioci54K3Iud2lkdGgsIHIueStyLmhlaWdodCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBbmltYXRvciB9IGZyb20gXCIuLi9BbmltYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnQW5pbWF0b3IgZXh0ZW5kcyBBbmltYXRvciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbm93KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGltZW91dChjYWxsYmFjazogKCkgPT4gdm9pZCwgZGVsYXlNaWxsaXNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgZGVsYXlNaWxsaXNlY29uZHMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXF1ZXN0RnJhbWUoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzKjEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBLZW5JbWFnZUFkYXB0ZXIgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0ltYWdlXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0tlbkltYWdlIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgS2VuSW1hZ2VBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IHpvb20oKTogVmVjdG9yIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0Wyd6b29tJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFsnem9vbSddLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihwYXJzZUludChjZW50ZXJbMF0pIHx8IDUwLCBwYXJzZUludChjZW50ZXJbMV0pIHx8IDUwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVmVjdG9yLk5VTEw7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyb21DZW50ZXIgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJldHdlZW4odGhpcy5ib3VuZGluZ0JveC5iciwgMC41KVxuICAgICAgICAgICAgICAgIGFuaW1hdG9yXG4gICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyoxMDAwLCAoeCwgaXNMYXN0KSA9PiB0aGlzLmFuaW1hdGVGcmFtZSh4LCBpc0xhc3QsIGZyb21DZW50ZXIsIHpvb21DZW50ZXIsIDEsIHpvb21TY2FsZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGlzTGFzdDogYm9vbGVhbiwgZnJvbUNlbnRlcjogVmVjdG9yLCB0b0NlbnRlcjogVmVjdG9yLCBmcm9tU2NhbGU6IG51bWJlciwgdG9TY2FsZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXNMYXN0KSB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGZyb21DZW50ZXIuZGVsdGEodG9DZW50ZXIpXG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yKGRlbHRhLnggKiB4LCBkZWx0YS55ICogeCkuYWRkKGZyb21DZW50ZXIpO1xuICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSAodG9TY2FsZSAtIGZyb21TY2FsZSkgKiB4ICsgZnJvbVNjYWxlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKGNlbnRlciwgc2NhbGUpOyAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKHRvQ2VudGVyLCB0b1NjYWxlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVpvb20oY2VudGVyOiBWZWN0b3IsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgem9vbWFibGUgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIGlmICh6b29tYWJsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuYm91bmRpbmdCb3gudGwuYmV0d2Vlbih0aGlzLmJvdW5kaW5nQm94LmJyLCAwLjUpO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gb3JpZ2luLnggKyAncHggJyArIG9yaWdpbi55ICsgJ3B4JztcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSB0cmFuc2xhdGUoJyArIChvcmlnaW4ueCAtIGNlbnRlci54KSArICdweCwnICsgKG9yaWdpbi55IC0gY2VudGVyLnkpICsgJ3B4KSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IExhYmVsQWRhcHRlciwgTGFiZWwgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0xhYmVsXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi9VdGlsc1wiO1xuaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xhYmVsIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgTGFiZWxBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IGZvclN0YXRpb24oKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb247XG4gICAgfVxuXG4gICAgZ2V0IGZvckxpbmUoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LmxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID09ICd2aXNpYmxlJykge1xuICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KG5ldyBWZWN0b3Ioci54LCByLnkpLCBuZXcgVmVjdG9yKHIueCtyLndpZHRoLCByLnkrci5oZWlnaHQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGV4dENvb3JkcyAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29vcmQodGhpcy5lbGVtZW50LCB0ZXh0Q29vcmRzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdMaW5lTGFiZWxzKGxhYmVsRGlyLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYW5zbGF0ZShib3hEaW1lbjogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgbGFiZWx1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShsYWJlbERpcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di54LCBbLWJveERpbWVuLnggKyAncHgnLCAtYm94RGltZW4ueC8yICsgJ3B4JywgJzBweCddKVxuICAgICAgICAgICAgKyAnLCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di55LCBbLUxhYmVsLkxBQkVMX0hFSUdIVCArICdweCcsIC1MYWJlbC5MQUJFTF9IRUlHSFQvMiArICdweCcsICcwcHgnXSkgLy8gVE9ETyBtYWdpYyBudW1iZXJzXG4gICAgICAgICAgICArICcpJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVscyhsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICBpZiAoYyBpbnN0YW5jZW9mIFN2Z0xhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3TGluZUxhYmVsKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC9NYXRoLm1heCh0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCAxKTtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3RvcihiYm94LndpZHRoL3NjYWxlLCBiYm94LmhlaWdodC9zY2FsZSksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMaW5lTGFiZWwobGFiZWw6IFN2Z0xhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxpbmVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcsICdkaXYnKTtcbiAgICAgICAgbGluZUxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsLmNsYXNzTmFtZXM7XG4gICAgICAgIGxpbmVMYWJlbC5pbm5lckhUTUwgPSBsYWJlbC50ZXh0O1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQobGluZUxhYmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTdGF0aW9uTGFiZWwobGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdmb3Itc3RhdGlvbicpKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgZm9yLXN0YXRpb24nO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZG9taW5hbnRCYXNlbGluZSA9ICdoYW5naW5nJztcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3Rvcih0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLmhlaWdodCksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGdldCBjbGFzc05hbWVzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKyAnICcgKyB0aGlzLmZvckxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyIHtcbiAgICAgICAgY29uc3QgbGluZUxhYmVsOiBTVkdHcmFwaGljc0VsZW1lbnQgPSA8U1ZHR3JhcGhpY3NFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgICAgICBsaW5lTGFiZWwuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBmb3ItbGluZSc7XG4gICAgICAgIGxpbmVMYWJlbC5kYXRhc2V0LnN0YXRpb24gPSBzdGF0aW9uSWQ7XG4gICAgICAgIGxpbmVMYWJlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgICBsaW5lTGFiZWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZW1lbnRzJyk/LmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgICAgIHJldHVybiBuZXcgU3ZnTGFiZWwobGluZUxhYmVsKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBMaW5lQWRhcHRlciB9IGZyb20gXCIuLi9kcmF3YWJsZXMvTGluZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuLi9kcmF3YWJsZXMvU3RhdGlvblwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFN2Z0FuaW1hdG9yIH0gZnJvbSBcIi4vU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3ZnVXRpbHMgfSBmcm9tIFwiLi9TdmdVdGlsc1wiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xpbmUgZXh0ZW5kcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBMaW5lQWRhcHRlciB7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG4gICAgcHJpdmF0ZSBfYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdQYXRoRWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQubGluZSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRpbmdCb3g7XG4gICAgfVxuXG4gICAgZ2V0IHdlaWdodCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQud2VpZ2h0ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQud2VpZ2h0KTtcbiAgICB9XG5cbiAgICBnZXQgdG90YWxMZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRUb3RhbExlbmd0aCgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFZlY3RvcltdIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2QnKTtcbiAgICAgICAgcmV0dXJuIFN2Z1V0aWxzLnJlYWRUZXJtaW5pKGQgfHwgdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBnZXQgYW5pbU9yZGVyKCk6IFJvdGF0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmFuaW1PcmRlciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQuYW5pbU9yZGVyKTtcbiAgICB9XG5cbiAgICBnZXQgc3BlZWQoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LnNwZWVkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQuc3BlZWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQm91bmRpbmdCb3gocGF0aDogVmVjdG9yW10pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbEJveCA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbWFibGUnKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHpvb21hYmxlID0gPFNWR0dyYXBoaWNzRWxlbWVudD4gPHVua25vd24+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tYWJsZScpO1xuICAgICAgICAgICAgY29uc3QgelJlY3QgPSB6b29tYWJsZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IHpCb3ggPSB6b29tYWJsZS5nZXRCQm94KCk7XG4gICAgICAgICAgICBjb25zdCBsUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IHpTY2FsZSA9IHpCb3gud2lkdGgvelJlY3Qud2lkdGg7XG4gICAgICAgICAgICBjb25zdCB4ID0gKGxSZWN0LngtelJlY3QueCkqelNjYWxlK3pCb3gueDtcbiAgICAgICAgICAgIGNvbnN0IHkgPSAobFJlY3QueS16UmVjdC55KSp6U2NhbGUrekJveC55O1xuICAgICAgICAgICAgdGhpcy5fYm91bmRpbmdCb3gudGwgPSBuZXcgVmVjdG9yKHgsIHkpO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRpbmdCb3guYnIgPSBuZXcgVmVjdG9yKHgrbFJlY3Qud2lkdGgqelNjYWxlLCB5K2xSZWN0LmhlaWdodCp6U2NhbGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nQm94LnRsID0gbmV3IFZlY3RvcihsQm94LngsIGxCb3gueSk7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nQm94LmJyID0gbmV3IFZlY3RvcihsQm94LngrbEJveC53aWR0aCwgbEJveC55K2xCb3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9wcyA9IFN2Z1V0aWxzLnJlYWRTdG9wcyh0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3BzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBwYXRoOiBWZWN0b3JbXSwgbGVuZ3RoOiBudW1iZXIsIGNvbG9yRGV2aWF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHBhdGgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHBhdGgpO1xuXG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzICogMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgbGluZSAnICsgdGhpcy5uYW1lO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICAgIGlmIChjb2xvckRldmlhdGlvbiAhPSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb2xvcihjb2xvckRldmlhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gcmV2ZXJzZSA/IC0xIDogMTtcbiAgICAgICAgICAgIGFuaW1hdG9yXG4gICAgICAgICAgICAgICAgLmZyb20obGVuZ3RoKmRpcmVjdGlvbilcbiAgICAgICAgICAgICAgICAudG8oMClcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMgKiAxMDAwLCAoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4pID0+IHRoaXMuYW5pbWF0ZUZyYW1lKHgsIGlzTGFzdCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSwgY29sb3JGcm9tOiBudW1iZXIsIGNvbG9yVG86IG51bWJlcikge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHRvKTtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgYW5pbWF0b3IuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMqMTAwMCwgKHgsIGlzTGFzdCkgPT4gdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIGNvbG9yRnJvbSwgY29sb3JUbywgeCwgaXNMYXN0KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMgKiAxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZnJvbSA9IDA7XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gbGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gcmV2ZXJzZSA/IC0xIDogMTtcbiAgICAgICAgICAgIGFuaW1hdG9yXG4gICAgICAgICAgICAgICAgLmZyb20oZnJvbSlcbiAgICAgICAgICAgICAgICAudG8obGVuZ3RoKmRpcmVjdGlvbilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMqMTAwMCwgKHgsIGlzTGFzdCkgPT4gdGhpcy5hbmltYXRlRnJhbWUoeCwgaXNMYXN0KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGF0aChwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGQgPSAnTScgKyBwYXRoLm1hcCh2ID0+IHYueCsnLCcrdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVEYXNoYXJyYXkobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGRhc2hlZFBhcnQgPSBsZW5ndGggKyAnJztcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuc3Ryb2tlRGFzaGFycmF5LnJlcGxhY2UoL1teMC05XFxzLF0rL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHByZXNldEFycmF5ID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwuc3BsaXQoL1tcXHMsXSsvKTtcbiAgICAgICAgICAgIGlmIChwcmVzZXRBcnJheS5sZW5ndGggJSAyID09IDEpXG4gICAgICAgICAgICAgICAgcHJlc2V0QXJyYXkgPSBwcmVzZXRBcnJheS5jb25jYXQocHJlc2V0QXJyYXkpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0TGVuZ3RoID0gcHJlc2V0QXJyYXkubWFwKGEgPT4gcGFyc2VJbnQoYSkgfHwgMCkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG4gICAgICAgICAgICBkYXNoZWRQYXJ0ID0gbmV3IEFycmF5KE1hdGguY2VpbChsZW5ndGggLyBwcmVzZXRMZW5ndGggKyAxKSkuam9pbihwcmVzZXRBcnJheS5qb2luKCcgJykgKyAnICcpICsgJzAnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBkYXNoZWRQYXJ0ICsgJyAnICsgbGVuZ3RoO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQ29sb3IoZGV2aWF0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZSA9ICdyZ2IoJyArIE1hdGgubWF4KDAsIGRldmlhdGlvbikgKiAyNTYgKyAnLCAwLCAnICsgTWF0aC5taW4oMCwgZGV2aWF0aW9uKSAqIC0yNTYgKyAnKSc7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lKHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0geCArICcnO1xuICAgICAgICBpZiAoaXNMYXN0ICYmIHggIT0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCBjb2xvckZyb206IG51bWJlciwgY29sb3JUbzogbnVtYmVyLCB4OiBudW1iZXIsIGlzTGFzdDogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWlzTGFzdCkge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVkID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlZC5wdXNoKGZyb21baV0uYmV0d2Vlbih0b1tpXSwgeCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkoaW50ZXJwb2xhdGVkWzBdLmRlbHRhKGludGVycG9sYXRlZFtpbnRlcnBvbGF0ZWQubGVuZ3RoLTFdKS5sZW5ndGgpOyAvLyBUT0RPIGFyYml0cmFyeSBub2RlIGNvdW50XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBhdGgoaW50ZXJwb2xhdGVkKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3IoKGNvbG9yVG8tY29sb3JGcm9tKSp4K2NvbG9yRnJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheSh0b1swXS5kZWx0YSh0b1t0by5sZW5ndGgtMV0pLmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBhdGgodG8pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBOZXR3b3JrQWRhcHRlciwgTmV0d29yaywgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4uL05ldHdvcmtcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi4vZHJhd2FibGVzL1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuLi9kcmF3YWJsZXMvU3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuLi9kcmF3YWJsZXMvTGluZVwiO1xuaW1wb3J0IHsgU3ZnTGluZSB9IGZyb20gXCIuL1N2Z0xpbmVcIjtcbmltcG9ydCB7IFN2Z1N0YXRpb24gfSBmcm9tIFwiLi9TdmdTdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gXCIuLi9kcmF3YWJsZXMvTGFiZWxcIjtcbmltcG9ydCB7IFN2Z0xhYmVsIH0gZnJvbSBcIi4vU3ZnTGFiZWxcIjtcbmltcG9ydCB7IEdlbmVyaWNUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9HZW5lcmljVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdHZW5lcmljVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgWm9vbWVyIH0gZnJvbSBcIi4uL1pvb21lclwiO1xuaW1wb3J0IHsgVHJhaW4gfSBmcm9tIFwiLi4vZHJhd2FibGVzL1RyYWluXCI7XG5pbXBvcnQgeyBTdmdUcmFpbiB9IGZyb20gXCIuL1N2Z1RyYWluXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdLZW5JbWFnZSB9IGZyb20gXCIuL1N2Z0ltYWdlXCI7XG5pbXBvcnQgeyBLZW5JbWFnZSB9IGZyb20gXCIuLi9kcmF3YWJsZXMvSW1hZ2VcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z05ldHdvcmsgaW1wbGVtZW50cyBOZXR3b3JrQWRhcHRlciB7XG5cbiAgICBzdGF0aWMgU1ZHTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRab29tQ2VudGVyOiBWZWN0b3IgPSBWZWN0b3IuTlVMTDtcbiAgICBwcml2YXRlIGN1cnJlbnRab29tU2NhbGU6IG51bWJlciA9IDE7XG5cbiAgICBnZXQgY2FudmFzU2l6ZSgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICBjb25zdCBib3ggPSBzdmc/LnZpZXdCb3guYmFzZVZhbDtcbiAgICAgICAgaWYgKGJveCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKGJveC54LCBib3gueSksIG5ldyBWZWN0b3IoYm94LngrYm94LndpZHRoLCBib3gueStib3guaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuICAgIH1cblxuICAgIGdldCBhdXRvU3RhcnQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmF1dG9TdGFydCAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGdldCB6b29tTWF4U2NhbGUoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIGlmIChzdmc/LmRhdGFzZXQuem9vbU1heFNjYWxlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIDM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN2Zz8uZGF0YXNldC56b29tTWF4U2NhbGUpO1xuICAgIH1cblxuICAgIGdldCBiZWNrU3R5bGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmJlY2tTdHlsZSAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWxlbWVudHNcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQSBncm91cCB3aXRoIHRoZSBpZCBcImVsZW1lbnRzXCIgaXMgbWlzc2luZyBpbiB0aGUgU1ZHIHNvdXJjZS4gSXQgbWlnaHQgYmUgbmVlZGVkIGZvciBoZWxwZXIgc3RhdGlvbnMgYW5kIGxhYmVscy4nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIik7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudDogVGltZWREcmF3YWJsZSB8IG51bGwgPSB0aGlzLm1pcnJvckVsZW1lbnQoZWxlbWVudHNbaV0sIG5ldHdvcmspO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuYWRkVG9JbmRleChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWlycm9yRWxlbWVudChlbGVtZW50OiBhbnksIG5ldHdvcms6IFN0YXRpb25Qcm92aWRlcik6IFRpbWVkRHJhd2FibGUgfCBudWxsIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJyAmJiBlbGVtZW50LmRhdGFzZXQubGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGluZShuZXcgU3ZnTGluZShlbGVtZW50KSwgbmV0d29yaywgdGhpcy5iZWNrU3R5bGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJyAmJiBlbGVtZW50LmRhdGFzZXQudHJhaW4gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRyYWluKG5ldyBTdmdUcmFpbihlbGVtZW50KSwgbmV0d29yayk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3JlY3QnICYmIGVsZW1lbnQuZGF0YXNldC5zdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGVsZW1lbnQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGFiZWwobmV3IFN2Z0xhYmVsKGVsZW1lbnQpLCBuZXR3b3JrKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAnaW1hZ2UnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEtlbkltYWdlKG5ldyBTdmdLZW5JbWFnZShlbGVtZW50KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5kYXRhc2V0LmZyb20gIT0gdW5kZWZpbmVkIHx8IGVsZW1lbnQuZGF0YXNldC50byAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgR2VuZXJpY1RpbWVkRHJhd2FibGUobmV3IFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlKGVsZW1lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcCA9IDxTVkdSZWN0RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z05ldHdvcmsuU1ZHTlMsICdyZWN0Jyk7XG4gICAgICAgIGhlbHBTdG9wLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0aW9uJywgaWQpO1xuICAgICAgICBoZWxwU3RvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGlyJywgcm90YXRpb24ubmFtZSk7XG4gICAgICAgIHRoaXMuc2V0Q29vcmQoaGVscFN0b3AsIGJhc2VDb29yZHMpO1xuICAgICAgICBoZWxwU3RvcC5jbGFzc05hbWUuYmFzZVZhbCA9ICdoZWxwZXInO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWxlbWVudHMnKT8uYXBwZW5kQ2hpbGQoaGVscFN0b3ApO1xuICAgICAgICByZXR1cm4gbmV3IFN0YXRpb24obmV3IFN2Z1N0YXRpb24oaGVscFN0b3ApKTsgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q29vcmQoZWxlbWVudDogYW55LCBjb29yZDogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgY29vcmQueCk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd5JywgY29vcmQueSk7XG4gICAgfVxuXG4gICAgZHJhd0Vwb2NoKGVwb2NoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2Vwb2NoJywgeyBkZXRhaWw6IGVwb2NoIH0pO1xuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgXG4gICAgICAgIGxldCBlcG9jaExhYmVsO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJykgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlcG9jaExhYmVsID0gPFNWR1RleHRFbGVtZW50PiA8dW5rbm93bj4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJyk7XG4gICAgICAgICAgICBlcG9jaExhYmVsLnRleHRDb250ZW50ID0gZXBvY2g7ICAgICAgIFxuICAgICAgICB9XG4gICAgfVxuICAgXG4gICAgem9vbVRvKHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRCZWhhdmlvdXIgPSBhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPD0gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVmYXVsdEJlaGF2aW91ciA/IDAgOiBab29tZXIuWk9PTV9EVVJBVElPTiAqIDEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRab29tQ2VudGVyID0gdGhpcy5jdXJyZW50Wm9vbUNlbnRlcjtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRab29tU2NhbGUgPSB0aGlzLmN1cnJlbnRab29tU2NhbGU7XG4gICAgICAgICAgICBhbmltYXRvclxuICAgICAgICAgICAgICAgIC5lYXNlKGRlZmF1bHRCZWhhdmlvdXIgPyBTdmdBbmltYXRvci5FQVNFX0NVQklDIDogU3ZnQW5pbWF0b3IuRUFTRV9OT05FKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyAqIDEwMDAsICh4LCBpc0xhc3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUoeCwgaXNMYXN0LCBjdXJyZW50Wm9vbUNlbnRlciwgem9vbUNlbnRlciwgY3VycmVudFpvb21TY2FsZSwgem9vbVNjYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRab29tQ2VudGVyID0gem9vbUNlbnRlcjtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFpvb21TY2FsZSA9IHpvb21TY2FsZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4sIGZyb21DZW50ZXI6IFZlY3RvciwgdG9DZW50ZXI6IFZlY3RvciwgZnJvbVNjYWxlOiBudW1iZXIsIHRvU2NhbGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoIWlzTGFzdCkge1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBmcm9tQ2VudGVyLmRlbHRhKHRvQ2VudGVyKVxuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlY3RvcihkZWx0YS54ICogeCwgZGVsdGEueSAqIHgpLmFkZChmcm9tQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gKHRvU2NhbGUgLSBmcm9tU2NhbGUpICogeCArIGZyb21TY2FsZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbShjZW50ZXIsIHNjYWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbSh0b0NlbnRlciwgdG9TY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVpvb20oY2VudGVyOiBWZWN0b3IsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgem9vbWFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbWFibGUnKTtcbiAgICAgICAgaWYgKHpvb21hYmxlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gdGhpcy5jYW52YXNTaXplLnRsLmJldHdlZW4odGhpcy5jYW52YXNTaXplLmJyLCAwLjUpO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gb3JpZ2luLnggKyAncHggJyArIG9yaWdpbi55ICsgJ3B4JztcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSB0cmFuc2xhdGUoJyArIChvcmlnaW4ueCAtIGNlbnRlci54KSArICdweCwnICsgKG9yaWdpbi55IC0gY2VudGVyLnkpICsgJ3B4KSc7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdGF0aW9uQWRhcHRlciwgU3RhdGlvbiB9IGZyb20gXCIuLi9kcmF3YWJsZXMvU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN2Z0FuaW1hdG9yIH0gZnJvbSBcIi4vU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnU3RhdGlvbiBleHRlbmRzIFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSBpbXBsZW1lbnRzIFN0YXRpb25BZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdSZWN0RWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiBuZWVkcyB0byBoYXZlIGEgZGF0YS1zdGF0aW9uIGlkZW50aWZpZXInKTtcbiAgICB9XG5cbiAgICBnZXQgYmFzZUNvb3JkcygpOiBWZWN0b3IgeyAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHBhcnNlSW50KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gnKSB8fCAnJykgfHwgMCwgcGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneScpIHx8ICcnKSB8fCAwKTtcbiAgICB9XG5cbiAgICBzZXQgYmFzZUNvb3JkcyhiYXNlQ29vcmRzOiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGJhc2VDb29yZHMueCArICcnKTsgXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBiYXNlQ29vcmRzLnkgKyAnJyk7IFxuICAgIH1cblxuICAgIGdldCByb3RhdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRpciB8fCAnbicpO1xuICAgIH1cbiAgICBnZXQgbGFiZWxEaXIoKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gUm90YXRpb24uZnJvbSh0aGlzLmVsZW1lbnQuZGF0YXNldC5sYWJlbERpciB8fCAnbicpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzID0gZ2V0UG9zaXRpb25Cb3VuZGFyaWVzKCk7XG4gICAgICAgICAgICBjb25zdCBzdG9wRGltZW4gPSBbcG9zaXRpb25Cb3VuZGFyaWVzLnhbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgcG9zaXRpb25Cb3VuZGFyaWVzLnlbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueVswXV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdzdGF0aW9uJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBzdGF0aW9uICcgKyB0aGlzLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBzdG9wRGltZW5bMF0gPCAwICYmIHN0b3BEaW1lblsxXSA8IDAgPyAnaGlkZGVuJyA6ICd2aXNpYmxlJztcbiAgICBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKE1hdGgubWF4KHN0b3BEaW1lblswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAoTWF0aC5tYXgoc3RvcERpbWVuWzFdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCdyb3RhdGUoJyArIHRoaXMucm90YXRpb24uZGVncmVlcyArICcpIHRyYW5zbGF0ZSgnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnLCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnlbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcpJyk7XG4gICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtT3JpZ2luKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgdGhpcy5iYXNlQ29vcmRzLnggKyAnICcgKyB0aGlzLmJhc2VDb29yZHMueSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgYW5pbWF0b3JcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMqMTAwMCwgKHgsIGlzTGFzdCkgPT4gdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoeCwgaXNMYXN0LCBmcm9tLCB0bywgY2FsbGJhY2spKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWVWZWN0b3IoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4sIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFpc0xhc3QpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZUNvb3JkcyA9IGZyb20uYmV0d2Vlbih0bywgeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VDb29yZHMgPSB0bztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuLi9kcmF3YWJsZXMvU3RhdGlvblwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFRyYWluQWRhcHRlciB9IGZyb20gXCIuLi9kcmF3YWJsZXMvVHJhaW5cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IFN2Z1V0aWxzIH0gZnJvbSBcIi4vU3ZnVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1RyYWluIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgVHJhaW5BZGFwdGVyIHtcbiAgICBzdGF0aWMgV0FHT05fTEVOR1RIID0gMTA7XG4gICAgc3RhdGljIFRSQUNLX09GRlNFVCA9IDA7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnRyYWluIHx8ICcnO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9wcyA9IFN2Z1V0aWxzLnJlYWRTdG9wcyh0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3BzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIGZvbGxvdzogeyBwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyIH0pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRQYXRoKHRoaXMuY2FsY1RyYWluSGluZ2VzKHRoaXMuZ2V0UGF0aExlbmd0aChmb2xsb3cpLmxlbmd0aFRvU3RhcnQsIGZvbGxvdy5wYXRoKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyB0cmFpbic7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgfSk7ICAgICAgICBcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZm9sbG93OiB7IHBhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIgfSkge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXRoTGVuZ3RoID0gdGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdyk7XG5cbiAgICAgICAgICAgIGFuaW1hdG9yXG4gICAgICAgICAgICAgICAgLmVhc2UoU3ZnQW5pbWF0b3IuRUFTRV9TSU5FKVxuICAgICAgICAgICAgICAgIC5mcm9tKHBhdGhMZW5ndGgubGVuZ3RoVG9TdGFydClcbiAgICAgICAgICAgICAgICAudG8ocGF0aExlbmd0aC5sZW5ndGhUb1N0YXJ0K3BhdGhMZW5ndGgudG90YWxCb3VuZGVkTGVuZ3RoKVxuICAgICAgICAgICAgICAgIC50aW1lUGFzc2VkKGRlbGF5U2Vjb25kcyA8IDAgPyAoLWRlbGF5U2Vjb25kcyoxMDAwKSA6IDApXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzKjEwMDAsICh4LCBpc0xhc3QpID0+IHRoaXMuYW5pbWF0ZUZyYW1lKHgsIGZvbGxvdy5wYXRoKSk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UGF0aExlbmd0aChmb2xsb3c6IHsgcGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlciB9KTogeyBsZW5ndGhUb1N0YXJ0OiBudW1iZXIsIHRvdGFsQm91bmRlZExlbmd0aDogbnVtYmVyIH0ge1xuICAgICAgICBsZXQgbGVuZ3RoVG9TdGFydCA9IDA7XG4gICAgICAgIGxldCB0b3RhbEJvdW5kZWRMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvbGxvdy5wYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbCA9IGZvbGxvdy5wYXRoW2ldLmRlbHRhKGZvbGxvdy5wYXRoW2kgKyAxXSkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGkgPCBmb2xsb3cuZnJvbSkge1xuICAgICAgICAgICAgICAgIGxlbmd0aFRvU3RhcnQgKz0gbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IGZvbGxvdy50bykge1xuICAgICAgICAgICAgICAgIHRvdGFsQm91bmRlZExlbmd0aCArPSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGxlbmd0aFRvU3RhcnQ6IGxlbmd0aFRvU3RhcnQsIHRvdGFsQm91bmRlZExlbmd0aDogdG90YWxCb3VuZGVkTGVuZ3RoIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQb3NpdGlvbkJ5TGVuZ3RoKGN1cnJlbnQ6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiBWZWN0b3Ige1xuICAgICAgICBsZXQgdGhyZXNoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBwYXRoW2ldLmRlbHRhKHBhdGhbaSArIDFdKTtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBkZWx0YS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodGhyZXNoICsgbCA+PSBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGhbaV0uYmV0d2VlbihwYXRoW2kgKyAxXSwgKGN1cnJlbnQgLSB0aHJlc2gpIC8gbCkuYWRkKGRlbHRhLnJvdGF0ZShuZXcgUm90YXRpb24oOTApKS53aXRoTGVuZ3RoKFN2Z1RyYWluLlRSQUNLX09GRlNFVCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyZXNoICs9IGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFBhdGgocGF0aDogVmVjdG9yW10pIHtcbiAgICAgICAgY29uc3QgZCA9ICdNJyArIHBhdGgubWFwKHYgPT4gdi54ICsgJywnICsgdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjVHJhaW5IaW5nZXMoZnJvbnQ6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiBWZWN0b3JbXSB7XG4gICAgICAgIGNvbnN0IG5ld1RyYWluOiBWZWN0b3JbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoICsgMTsgaSsrKSB7XG4gICAgICAgICAgICBuZXdUcmFpbi5wdXNoKHRoaXMuZ2V0UG9zaXRpb25CeUxlbmd0aChmcm9udCAtIGkgKiBTdmdUcmFpbi5XQUdPTl9MRU5HVEgsIHBhdGgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VHJhaW47XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoeDogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB0cmFpblBhdGggPSB0aGlzLmNhbGNUcmFpbkhpbmdlcyh4LCBwYXRoKTtcbiAgICAgICAgdGhpcy5zZXRQYXRoKHRyYWluUGF0aCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdVdGlscyB7XG5cbiAgICBzdGF0aWMgcmVhZFN0b3BzKHN0b3BzU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA6IFN0b3BbXSA9IFtdO1xuICAgICAgICBjb25zdCB0b2tlbnMgPSBzdG9wc1N0cmluZz8uc3BsaXQoL1xccysvKSB8fCBbXTtcbiAgICAgICAgbGV0IG5leHRTdG9wID0gbmV3IFN0b3AoJycsICcnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnM/Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodG9rZW5zW2ldWzBdICE9ICctJyAmJiB0b2tlbnNbaV1bMF0gIT0gJysnICYmIHRva2Vuc1tpXVswXSAhPSAnKicpIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgc3RvcHMucHVzaChuZXh0U3RvcCk7XG4gICAgICAgICAgICAgICAgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RvcC50cmFja0luZm8gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWFkVGVybWluaSh0ZXJtaW5pU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBWZWN0b3JbXSB7XG4gICAgICAgIGNvbnN0IG51bWJlcnMgPSB0ZXJtaW5pU3RyaW5nPy50cmltKCkuc3BsaXQoL1teXFxkLl0rLyk7XG4gICAgICAgIGlmIChudW1iZXJzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yKHBhcnNlRmxvYXQobnVtYmVyc1sxXSksIHBhcnNlRmxvYXQobnVtYmVyc1syXSkpLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IocGFyc2VGbG9hdChudW1iZXJzW251bWJlcnMubGVuZ3RoLTJdKSwgcGFyc2VGbG9hdChudW1iZXJzW251bWJlcnMubGVuZ3RoLTFdKSlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxufSJdLCJzb3VyY2VSb290IjoiIn0=