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
    sort(elements, draw, animate) {
        if (elements.length == 0) {
            return [];
        }
        const representativeElement = elements[0];
        if (representativeElement instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_0__["Line"] && representativeElement.animOrder != undefined) {
            return this.orderByGeometricDirection(elements, representativeElement.animOrder, draw, animate);
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
    orderByGeometricDirection(elements, direction, draw, animate) {
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
            const noanim = !animate || ((_a = cache[i].element[draw ? 'from' : 'to']) === null || _a === void 0 ? void 0 : _a.flag.includes('noanim'));
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
    sortDrawableBuffer(now, animate) {
        if (this.drawableBuffer.length == 0) {
            return [];
        }
        return this.drawableSorter.sort(this.drawableBuffer, this.isDraw(this.drawableBuffer[this.drawableBuffer.length - 1], now), animate);
    }
    flushDrawableBuffer(delay, animate, now) {
        const delays = this.sortDrawableBuffer(now, animate);
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
        if (!this.beckStyle || !this.adapter.beckStyle) {
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
        const lBox = this.element.getBBox();
        if (document.getElementById('zoomable') != undefined) {
            const zoomable = document.getElementById('zoomable');
            const zRect = zoomable.getBoundingClientRect();
            const zBox = zoomable.getBBox();
            const lRect = this.element.getBoundingClientRect();
            const zScale = zBox.width / zRect.width;
            const x = (lRect.x - zRect.x) * zScale + zBox.x;
            const y = (lRect.y - zRect.y) * zScale + zBox.y;
            return new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](x, y), new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](x + lRect.width * zScale, y + lRect.height * zScale));
        }
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_2__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](lBox.x, lBox.y), new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](lBox.x + lBox.width, lBox.y + lBox.height));
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
            if (this.element.localName == 'g') {
                this.element.style.opacity = '1';
            }
        });
    }
    erase(delaySeconds) {
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_0__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.style.visibility = 'hidden';
            if (this.element.localName == 'g') {
                this.element.style.opacity = '0';
            }
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
/* harmony import */ var _BoundingBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../BoundingBox */ "./src/BoundingBox.ts");




class SvgKenImage extends _SvgAbstractTimedDrawable__WEBPACK_IMPORTED_MODULE_2__["SvgAbstractTimedDrawable"] {
    constructor(element) {
        super(element);
        this.element = element;
    }
    get boundingBox() {
        const r = this.element.getBBox();
        return new _BoundingBox__WEBPACK_IMPORTED_MODULE_3__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](r.x, r.y), new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](r.x + r.width, r.y + r.height));
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
            return super.boundingBox;
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
    get beckStyle() {
        if (this.element.dataset.beckStyle == undefined) {
            return true;
        }
        return this.element.dataset.beckStyle != 'false';
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
        const b = super.boundingBox;
        this._boundingBox.tl = b.tl;
        this._boundingBox.br = b.br;
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
        return parseFloat(svg === null || svg === void 0 ? void 0 : svg.dataset.zoomMaxScale);
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
        return new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](parseFloat(this.element.getAttribute('x') || '') || 0, parseFloat(this.element.getAttribute('y') || '') || 0);
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
        this.element.className.baseVal += ' train';
        this.setPath(this.calcTrainHinges(this.getPathLength(follow).lengthToStart, follow.path));
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_3__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQW5pbWF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Fycml2YWxEZXBhcnR1cmVUaW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9Cb3VuZGluZ0JveC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvRHJhd2FibGVTb3J0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXZpdGF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luc3RhbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9VdGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmVjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9ab29tZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9BYnN0cmFjdFRpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9HZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhd2FibGVzL0ltYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9kcmF3YWJsZXMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9MaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9kcmF3YWJsZXMvU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhd2FibGVzL1RyYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnQW5pbWF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdHZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z0ltYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdMaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1N0YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdUcmFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBLElBQUksS0FBNEQ7QUFDaEUsSUFBSSxTQUM0QztBQUNoRCxDQUFD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Q0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFXLENBQUMsYUFBaUM7UUFDaEQsTUFBTSxPQUFPLEdBQUcsYUFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFFO1lBQ3RCLE9BQU87Z0JBQ0gsSUFBSSw4Q0FBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELElBQUksOENBQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzRixDQUFDO1NBQ0w7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FFSiIsImZpbGUiOiJuZXR3b3JrLWFuaW1hdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gICAgKGZhY3RvcnkoKGdsb2JhbC5mbWluID0gZ2xvYmFsLmZtaW4gfHwge30pKSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKiBmaW5kcyB0aGUgemVyb3Mgb2YgYSBmdW5jdGlvbiwgZ2l2ZW4gdHdvIHN0YXJ0aW5nIHBvaW50cyAod2hpY2ggbXVzdFxuICAgICAqIGhhdmUgb3Bwb3NpdGUgc2lnbnMgKi9cbiAgICBmdW5jdGlvbiBiaXNlY3QoZiwgYSwgYiwgcGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJzLm1heEl0ZXJhdGlvbnMgfHwgMTAwLFxuICAgICAgICAgICAgdG9sZXJhbmNlID0gcGFyYW1ldGVycy50b2xlcmFuY2UgfHwgMWUtMTAsXG4gICAgICAgICAgICBmQSA9IGYoYSksXG4gICAgICAgICAgICBmQiA9IGYoYiksXG4gICAgICAgICAgICBkZWx0YSA9IGIgLSBhO1xuXG4gICAgICAgIGlmIChmQSAqIGZCID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgXCJJbml0aWFsIGJpc2VjdCBwb2ludHMgbXVzdCBoYXZlIG9wcG9zaXRlIHNpZ25zXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZkEgPT09IDApIHJldHVybiBhO1xuICAgICAgICBpZiAoZkIgPT09IDApIHJldHVybiBiO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBkZWx0YSAvPSAyO1xuICAgICAgICAgICAgdmFyIG1pZCA9IGEgKyBkZWx0YSxcbiAgICAgICAgICAgICAgICBmTWlkID0gZihtaWQpO1xuXG4gICAgICAgICAgICBpZiAoZk1pZCAqIGZBID49IDApIHtcbiAgICAgICAgICAgICAgICBhID0gbWlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKE1hdGguYWJzKGRlbHRhKSA8IHRvbGVyYW5jZSkgfHwgKGZNaWQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYSArIGRlbHRhO1xuICAgIH1cblxuICAgIC8vIG5lZWQgc29tZSBiYXNpYyBvcGVyYXRpb25zIG9uIHZlY3RvcnMsIHJhdGhlciB0aGFuIGFkZGluZyBhIGRlcGVuZGVuY3ksXG4gICAgLy8ganVzdCBkZWZpbmUgaGVyZVxuICAgIGZ1bmN0aW9uIHplcm9zKHgpIHsgdmFyIHIgPSBuZXcgQXJyYXkoeCk7IGZvciAodmFyIGkgPSAwOyBpIDwgeDsgKytpKSB7IHJbaV0gPSAwOyB9IHJldHVybiByOyB9XG4gICAgZnVuY3Rpb24gemVyb3NNKHgseSkgeyByZXR1cm4gemVyb3MoeCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gemVyb3MoeSk7IH0pOyB9XG5cbiAgICBmdW5jdGlvbiBkb3QoYSwgYikge1xuICAgICAgICB2YXIgcmV0ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtMihhKSAge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGRvdChhLCBhKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUocmV0LCB2YWx1ZSwgYykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXRbaV0gPSB2YWx1ZVtpXSAqIGM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWlnaHRlZFN1bShyZXQsIHcxLCB2MSwgdzIsIHYyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmV0Lmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICByZXRbal0gPSB3MSAqIHYxW2pdICsgdzIgKiB2MltqXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBtaW5pbWl6ZXMgYSBmdW5jdGlvbiB1c2luZyB0aGUgZG93bmhpbGwgc2ltcGxleCBtZXRob2QgKi9cbiAgICBmdW5jdGlvbiBuZWxkZXJNZWFkKGYsIHgwLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuXG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1ldGVycy5tYXhJdGVyYXRpb25zIHx8IHgwLmxlbmd0aCAqIDIwMCxcbiAgICAgICAgICAgIG5vblplcm9EZWx0YSA9IHBhcmFtZXRlcnMubm9uWmVyb0RlbHRhIHx8IDEuMDUsXG4gICAgICAgICAgICB6ZXJvRGVsdGEgPSBwYXJhbWV0ZXJzLnplcm9EZWx0YSB8fCAwLjAwMSxcbiAgICAgICAgICAgIG1pbkVycm9yRGVsdGEgPSBwYXJhbWV0ZXJzLm1pbkVycm9yRGVsdGEgfHwgMWUtNixcbiAgICAgICAgICAgIG1pblRvbGVyYW5jZSA9IHBhcmFtZXRlcnMubWluRXJyb3JEZWx0YSB8fCAxZS01LFxuICAgICAgICAgICAgcmhvID0gKHBhcmFtZXRlcnMucmhvICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5yaG8gOiAxLFxuICAgICAgICAgICAgY2hpID0gKHBhcmFtZXRlcnMuY2hpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5jaGkgOiAyLFxuICAgICAgICAgICAgcHNpID0gKHBhcmFtZXRlcnMucHNpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5wc2kgOiAtMC41LFxuICAgICAgICAgICAgc2lnbWEgPSAocGFyYW1ldGVycy5zaWdtYSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMuc2lnbWEgOiAwLjUsXG4gICAgICAgICAgICBtYXhEaWZmO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgc2ltcGxleC5cbiAgICAgICAgdmFyIE4gPSB4MC5sZW5ndGgsXG4gICAgICAgICAgICBzaW1wbGV4ID0gbmV3IEFycmF5KE4gKyAxKTtcbiAgICAgICAgc2ltcGxleFswXSA9IHgwO1xuICAgICAgICBzaW1wbGV4WzBdLmZ4ID0gZih4MCk7XG4gICAgICAgIHNpbXBsZXhbMF0uaWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0geDAuc2xpY2UoKTtcbiAgICAgICAgICAgIHBvaW50W2ldID0gcG9pbnRbaV0gPyBwb2ludFtpXSAqIG5vblplcm9EZWx0YSA6IHplcm9EZWx0YTtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXSA9IHBvaW50O1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdLmZ4ID0gZihwb2ludCk7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0uaWQgPSBpKzE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVTaW1wbGV4KHZhbHVlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2ltcGxleFtOXVtpXSA9IHZhbHVlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2ltcGxleFtOXS5meCA9IHZhbHVlLmZ4O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNvcnRPcmRlciA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEuZnggLSBiLmZ4OyB9O1xuXG4gICAgICAgIHZhciBjZW50cm9pZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICByZWZsZWN0ZWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgY29udHJhY3RlZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICBleHBhbmRlZCA9IHgwLnNsaWNlKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgbWF4SXRlcmF0aW9uczsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgIHNpbXBsZXguc29ydChzb3J0T3JkZXIpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgLy8gY29weSB0aGUgc2ltcGxleCAoc2luY2UgbGF0ZXIgaXRlcmF0aW9ucyB3aWxsIG11dGF0ZSkgYW5kXG4gICAgICAgICAgICAgICAgLy8gc29ydCBpdCB0byBoYXZlIGEgY29uc2lzdGVudCBvcmRlciBiZXR3ZWVuIGl0ZXJhdGlvbnNcbiAgICAgICAgICAgICAgICB2YXIgc29ydGVkU2ltcGxleCA9IHNpbXBsZXgubWFwKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHguc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnggPSB4LmZ4O1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pZCA9IHguaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzb3J0ZWRTaW1wbGV4LnNvcnQoZnVuY3Rpb24oYSxiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG5cbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmhpc3RvcnkucHVzaCh7eDogc2ltcGxleFswXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogc2ltcGxleFswXS5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxleDogc29ydGVkU2ltcGxleH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXhEaWZmID0gMDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtYXhEaWZmID0gTWF0aC5tYXgobWF4RGlmZiwgTWF0aC5hYnMoc2ltcGxleFswXVtpXSAtIHNpbXBsZXhbMV1baV0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChNYXRoLmFicyhzaW1wbGV4WzBdLmZ4IC0gc2ltcGxleFtOXS5meCkgPCBtaW5FcnJvckRlbHRhKSAmJlxuICAgICAgICAgICAgICAgIChtYXhEaWZmIDwgbWluVG9sZXJhbmNlKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wdXRlIHRoZSBjZW50cm9pZCBvZiBhbGwgYnV0IHRoZSB3b3JzdCBwb2ludCBpbiB0aGUgc2ltcGxleFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSArPSBzaW1wbGV4W2pdW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSAvPSBOO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZWZsZWN0IHRoZSB3b3JzdCBwb2ludCBwYXN0IHRoZSBjZW50cm9pZCAgYW5kIGNvbXB1dGUgbG9zcyBhdCByZWZsZWN0ZWRcbiAgICAgICAgICAgIC8vIHBvaW50XG4gICAgICAgICAgICB2YXIgd29yc3QgPSBzaW1wbGV4W05dO1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0ocmVmbGVjdGVkLCAxK3JobywgY2VudHJvaWQsIC1yaG8sIHdvcnN0KTtcbiAgICAgICAgICAgIHJlZmxlY3RlZC5meCA9IGYocmVmbGVjdGVkKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlZmxlY3RlZCBwb2ludCBpcyB0aGUgYmVzdCBzZWVuLCB0aGVuIHBvc3NpYmx5IGV4cGFuZFxuICAgICAgICAgICAgaWYgKHJlZmxlY3RlZC5meCA8IHNpbXBsZXhbMF0uZngpIHtcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShleHBhbmRlZCwgMStjaGksIGNlbnRyb2lkLCAtY2hpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgZXhwYW5kZWQuZnggPSBmKGV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwYW5kZWQuZnggPCByZWZsZWN0ZWQuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgocmVmbGVjdGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWZsZWN0ZWQgcG9pbnQgaXMgd29yc2UgdGhhbiB0aGUgc2Vjb25kIHdvcnN0LCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBjb250cmFjdFxuICAgICAgICAgICAgZWxzZSBpZiAocmVmbGVjdGVkLmZ4ID49IHNpbXBsZXhbTi0xXS5meCkge1xuICAgICAgICAgICAgICAgIHZhciBzaG91bGRSZWR1Y2UgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWZsZWN0ZWQuZnggPiB3b3JzdC5meCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhbiBpbnNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMStwc2ksIGNlbnRyb2lkLCAtcHNpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHdvcnN0LmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGFuIG91dHNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMS1wc2kgKiByaG8sIGNlbnRyb2lkLCBwc2kqcmhvLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHJlZmxlY3RlZC5meCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFJlZHVjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkUmVkdWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGRvbid0IGNvbnRyYWN0IGhlcmUsIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpZ21hID49IDEpIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGEgcmVkdWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBzaW1wbGV4Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShzaW1wbGV4W2ldLCAxIC0gc2lnbWEsIHNpbXBsZXhbMF0sIHNpZ21hLCBzaW1wbGV4W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZXhbaV0uZnggPSBmKHNpbXBsZXhbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KHJlZmxlY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaW1wbGV4LnNvcnQoc29ydE9yZGVyKTtcbiAgICAgICAgcmV0dXJuIHtmeCA6IHNpbXBsZXhbMF0uZngsXG4gICAgICAgICAgICAgICAgeCA6IHNpbXBsZXhbMF19O1xuICAgIH1cblxuICAgIC8vLyBzZWFyY2hlcyBhbG9uZyBsaW5lICdwaycgZm9yIGEgcG9pbnQgdGhhdCBzYXRpZmllcyB0aGUgd29sZmUgY29uZGl0aW9uc1xuICAgIC8vLyBTZWUgJ051bWVyaWNhbCBPcHRpbWl6YXRpb24nIGJ5IE5vY2VkYWwgYW5kIFdyaWdodCBwNTktNjBcbiAgICAvLy8gZiA6IG9iamVjdGl2ZSBmdW5jdGlvblxuICAgIC8vLyBwayA6IHNlYXJjaCBkaXJlY3Rpb25cbiAgICAvLy8gY3VycmVudDogb2JqZWN0IGNvbnRhaW5pbmcgY3VycmVudCBncmFkaWVudC9sb3NzXG4gICAgLy8vIG5leHQ6IG91dHB1dDogY29udGFpbnMgbmV4dCBncmFkaWVudC9sb3NzXG4gICAgLy8vIHJldHVybnMgYTogc3RlcCBzaXplIHRha2VuXG4gICAgZnVuY3Rpb24gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhLCBjMSwgYzIpIHtcbiAgICAgICAgdmFyIHBoaTAgPSBjdXJyZW50LmZ4LCBwaGlQcmltZTAgPSBkb3QoY3VycmVudC5meHByaW1lLCBwayksXG4gICAgICAgICAgICBwaGkgPSBwaGkwLCBwaGlfb2xkID0gcGhpMCxcbiAgICAgICAgICAgIHBoaVByaW1lID0gcGhpUHJpbWUwLFxuICAgICAgICAgICAgYTAgPSAwO1xuXG4gICAgICAgIGEgPSBhIHx8IDE7XG4gICAgICAgIGMxID0gYzEgfHwgMWUtNjtcbiAgICAgICAgYzIgPSBjMiB8fCAwLjE7XG5cbiAgICAgICAgZnVuY3Rpb24gem9vbShhX2xvLCBhX2hpZ2gsIHBoaV9sbykge1xuICAgICAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgMTY7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgYSA9IChhX2xvICsgYV9oaWdoKS8yO1xuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKG5leHQueCwgMS4wLCBjdXJyZW50LngsIGEsIHBrKTtcbiAgICAgICAgICAgICAgICBwaGkgPSBuZXh0LmZ4ID0gZihuZXh0LngsIG5leHQuZnhwcmltZSk7XG4gICAgICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHBoaSA+PSBwaGlfbG8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGFfaGlnaCA9IGE7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHBoaVByaW1lKSA8PSAtYzIgKiBwaGlQcmltZTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBoaVByaW1lICogKGFfaGlnaCAtIGFfbG8pID49MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYV9oaWdoID0gYV9sbztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGFfbG8gPSBhO1xuICAgICAgICAgICAgICAgICAgICBwaGlfbG8gPSBwaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IDEwOyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0obmV4dC54LCAxLjAsIGN1cnJlbnQueCwgYSwgcGspO1xuICAgICAgICAgICAgcGhpID0gbmV4dC5meCA9IGYobmV4dC54LCBuZXh0LmZ4cHJpbWUpO1xuICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG4gICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAoaXRlcmF0aW9uICYmIChwaGkgPj0gcGhpX29sZCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb20oYTAsIGEsIHBoaV9vbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMocGhpUHJpbWUpIDw9IC1jMiAqIHBoaVByaW1lMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhpUHJpbWUgPj0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbShhLCBhMCwgcGhpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGhpX29sZCA9IHBoaTtcbiAgICAgICAgICAgIGEwID0gYTtcbiAgICAgICAgICAgIGEgKj0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmp1Z2F0ZUdyYWRpZW50KGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICAvLyBhbGxvY2F0ZSBhbGwgbWVtb3J5IHVwIGZyb250IGhlcmUsIGtlZXAgb3V0IG9mIHRoZSBsb29wIGZvciBwZXJmb21hbmNlXG4gICAgICAgIC8vIHJlYXNvbnNcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG5leHQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIHlrID0gaW5pdGlhbC5zbGljZSgpLFxuICAgICAgICAgICAgcGssIHRlbXAsXG4gICAgICAgICAgICBhID0gMSxcbiAgICAgICAgICAgIG1heEl0ZXJhdGlvbnM7XG5cbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAyMDtcblxuICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgIHBrID0gY3VycmVudC5meHByaW1lLnNsaWNlKCk7XG4gICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsLTEpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBhID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhKTtcblxuICAgICAgICAgICAgLy8gdG9kbzogaGlzdG9yeSBpbiB3cm9uZyBzcG90P1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGF9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhKSB7XG4gICAgICAgICAgICAgICAgLy8gZmFpaWxlZCB0byBmaW5kIHBvaW50IHRoYXQgc2F0aWZpZXMgd29sZmUgY29uZGl0aW9ucy5cbiAgICAgICAgICAgICAgICAvLyByZXNldCBkaXJlY3Rpb24gZm9yIG5leHQgaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBkaXJlY3Rpb24gdXNpbmcgUG9sYWvigJNSaWJpZXJlIENHIG1ldGhvZFxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHlrLCAxLCBuZXh0LmZ4cHJpbWUsIC0xLCBjdXJyZW50LmZ4cHJpbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlbHRhX2sgPSBkb3QoY3VycmVudC5meHByaW1lLCBjdXJyZW50LmZ4cHJpbWUpLFxuICAgICAgICAgICAgICAgICAgICBiZXRhX2sgPSBNYXRoLm1heCgwLCBkb3QoeWssIG5leHQuZnhwcmltZSkgLyBkZWx0YV9rKTtcblxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHBrLCBiZXRhX2ssIHBrLCAtMSwgbmV4dC5meHByaW1lKTtcblxuICAgICAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50O1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgICAgIG5leHQgPSB0ZW1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9ybTIoY3VycmVudC5meHByaW1lKSA8PSAxZS01KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBhfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncmFkaWVudERlc2NlbnQoZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDEwMCxcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHBhcmFtcy5sZWFyblJhdGUgfHwgMC4wMDEsXG4gICAgICAgICAgICBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlaWdodGVkU3VtKGN1cnJlbnQueCwgMSwgY3VycmVudC54LCAtbGVhcm5SYXRlLCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICAgICAgaWYgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPD0gMWUtNSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbmV4dCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMTAwLFxuICAgICAgICAgICAgbGVhcm5SYXRlID0gcGFyYW1zLmxlYXJuUmF0ZSB8fCAxLFxuICAgICAgICAgICAgcGsgPSBpbml0aWFsLnNsaWNlKCksXG4gICAgICAgICAgICBjMSA9IHBhcmFtcy5jMSB8fCAxZS0zLFxuICAgICAgICAgICAgYzIgPSBwYXJhbXMuYzIgfHwgMC4xLFxuICAgICAgICAgICAgdGVtcCxcbiAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIC8vIHdyYXAgdGhlIGZ1bmN0aW9uIGNhbGwgdG8gdHJhY2sgbGluZXNlYXJjaCBzYW1wbGVzXG4gICAgICAgICAgICB2YXIgaW5uZXIgPSBmO1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKHgsIGZ4cHJpbWUpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzLnB1c2goeC5zbGljZSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5uZXIoeCwgZnhwcmltZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuICAgICAgICAgICAgbGVhcm5SYXRlID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBsZWFyblJhdGUsIGMxLCBjMik7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHM6IGZ1bmN0aW9uQ2FsbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhcm5SYXRlOiBsZWFyblJhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGxlYXJuUmF0ZX0pO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB0ZW1wID0gY3VycmVudDtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgbmV4dCA9IHRlbXA7XG5cbiAgICAgICAgICAgIGlmICgobGVhcm5SYXRlID09PSAwKSB8fCAobm9ybTIoY3VycmVudC5meHByaW1lKSA8IDFlLTUpKSBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGV4cG9ydHMuYmlzZWN0ID0gYmlzZWN0O1xuICAgIGV4cG9ydHMubmVsZGVyTWVhZCA9IG5lbGRlck1lYWQ7XG4gICAgZXhwb3J0cy5jb25qdWdhdGVHcmFkaWVudCA9IGNvbmp1Z2F0ZUdyYWRpZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50ID0gZ3JhZGllbnREZXNjZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaCA9IGdyYWRpZW50RGVzY2VudExpbmVTZWFyY2g7XG4gICAgZXhwb3J0cy56ZXJvcyA9IHplcm9zO1xuICAgIGV4cG9ydHMuemVyb3NNID0gemVyb3NNO1xuICAgIGV4cG9ydHMubm9ybTIgPSBub3JtMjtcbiAgICBleHBvcnRzLndlaWdodGVkU3VtID0gd2VpZ2h0ZWRTdW07XG4gICAgZXhwb3J0cy5zY2FsZSA9IHNjYWxlO1xuXG59KSk7IiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFuaW1hdG9yIHtcblxuICAgIHN0YXRpYyBFQVNFX05PTkU6ICh4OiBudW1iZXIpID0+IG51bWJlciA9IHggPT4geDtcbiAgICBzdGF0aWMgRUFTRV9DVUJJQzogKHg6IG51bWJlcikgPT4gbnVtYmVyID0geCA9PiB4IDwgMC41ID8gNCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAzKSAvIDI7XG4gICAgc3RhdGljIEVBU0VfU0lORTogKHg6IG51bWJlcikgPT4gbnVtYmVyID0geCA9PiAtKE1hdGguY29zKE1hdGguUEkgKiB4KSAtIDEpIC8gMjtcbiAgICBcbiAgICBwcml2YXRlIF9mcm9tOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX3RvOiBudW1iZXIgPSAxO1xuICAgIHByaXZhdGUgX3RpbWVQYXNzZWQ6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfZWFzZTogKHg6IG51bWJlcikgPT4gbnVtYmVyID0gQW5pbWF0b3IuRUFTRV9OT05FO1xuXG4gICAgcHJpdmF0ZSBjYWxsYmFjazogKHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuKSA9PiBib29sZWFuID0geCA9PiB0cnVlO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgZHVyYXRpb25NaWxsaXNlY29uZHM6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgZnJvbShmcm9tOiBudW1iZXIpOiBBbmltYXRvciB7XG4gICAgICAgIHRoaXMuX2Zyb20gPSBmcm9tO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG8odG86IG51bWJlcik6IEFuaW1hdG9yIHtcbiAgICAgICAgdGhpcy5fdG8gPSB0bztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHRpbWVQYXNzZWQodGltZVBhc3NlZDogbnVtYmVyKTogQW5pbWF0b3Ige1xuICAgICAgICB0aGlzLl90aW1lUGFzc2VkID0gdGltZVBhc3NlZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGVhc2UoZWFzZTogKHg6IG51bWJlcikgPT4gbnVtYmVyKTogQW5pbWF0b3Ige1xuICAgICAgICB0aGlzLl9lYXNlID0gZWFzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHdhaXQoZGVsYXlNaWxsaXNlY29uZHM6IG51bWJlciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5TWlsbGlzZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KGNhbGxiYWNrLCBkZWxheU1pbGxpc2Vjb25kcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYW5pbWF0ZShkdXJhdGlvbk1pbGxpc2Vjb25kczogbnVtYmVyLCBjYWxsYmFjazogKHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuKSA9PiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHVyYXRpb25NaWxsaXNlY29uZHMgPSBkdXJhdGlvbk1pbGxpc2Vjb25kcztcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMubm93KCk7XG4gICAgICAgIHRoaXMuZnJhbWUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZyYW1lKCkge1xuICAgICAgICBjb25zdCBub3cgPSB0aGlzLm5vdygpO1xuICAgICAgICBsZXQgeCA9IDE7XG4gICAgICAgIGlmICh0aGlzLmR1cmF0aW9uTWlsbGlzZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgeCA9IChub3ctdGhpcy5zdGFydFRpbWUrdGhpcy5fdGltZVBhc3NlZCkgLyB0aGlzLmR1cmF0aW9uTWlsbGlzZWNvbmRzO1xuICAgICAgICB9XG4gICAgICAgIHggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB4KSk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLl9mcm9tICsgKHRoaXMuX3RvLXRoaXMuX2Zyb20pICogdGhpcy5fZWFzZSh4KTtcbiAgICAgICAgY29uc3QgY29udCA9IHRoaXMuY2FsbGJhY2soeSwgeCA9PSAxKTtcbiAgICAgICAgaWYgKGNvbnQgJiYgeCA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEZyYW1lKCgpID0+IHRoaXMuZnJhbWUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgbm93KCk6IG51bWJlcjtcblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCB0aW1lb3V0KGNhbGxiYWNrOiAoKSA9PiB2b2lkLCBkZWxheU1pbGxpc2Vjb25kczogbnVtYmVyKTogdm9pZDtcblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZXF1ZXN0RnJhbWUoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuIiwiZXhwb3J0IGNsYXNzIEFycml2YWxEZXBhcnR1cmVUaW1lIHtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlKG9mZnNldDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3BsaXQgPSB0aGlzLnZhbHVlLnNwbGl0KC8oWy0rXSkvKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHNwbGl0W29mZnNldF0pICogKHNwbGl0W29mZnNldC0xXSA9PSAnLScgPyAtMSA6IDEpXG4gICAgfVxuXG4gICAgZ2V0IGRlcGFydHVyZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZSgyKTtcbiAgICB9XG5cbiAgICBnZXQgYXJyaXZhbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZSg0KTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgY2xhc3MgQm91bmRpbmdCb3gge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0bDogVmVjdG9yLCBwdWJsaWMgYnI6IFZlY3Rvcikge1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKHRsX3g6IG51bWJlciwgdGxfeTogbnVtYmVyLCBicl94OiBudW1iZXIsIGJyX3k6IG51bWJlcik6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHRsX3gsIHRsX3kpLCBuZXcgVmVjdG9yKGJyX3gsIGJyX3kpKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IGRpbWVuc2lvbnMoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGwuZGVsdGEodGhpcy5icik7XG4gICAgfVxuICAgIGlzTnVsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGwgPT0gVmVjdG9yLk5VTEwgfHwgdGhpcy5iciA9PSBWZWN0b3IuTlVMTDtcbiAgICB9XG4gICAgXG4gICAgY2FsY3VsYXRlQm91bmRpbmdCb3hGb3Jab29tKHBlcmNlbnRYOiBudW1iZXIsIHBlcmNlbnRZOiBudW1iZXIpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzO1xuICAgICAgICBjb25zdCBkZWx0YSA9IGJib3guZGltZW5zaW9ucztcbiAgICAgICAgY29uc3QgcmVsYXRpdmVDZW50ZXIgPSBuZXcgVmVjdG9yKHBlcmNlbnRYIC8gMTAwLCBwZXJjZW50WSAvIDEwMCk7XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IGJib3gudGwuYWRkKG5ldyBWZWN0b3IoZGVsdGEueCAqIHJlbGF0aXZlQ2VudGVyLngsIGRlbHRhLnkgKiByZWxhdGl2ZUNlbnRlci55KSk7XG4gICAgICAgIGNvbnN0IGVkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIE1hdGgubWluKHJlbGF0aXZlQ2VudGVyLngsIDEgLSByZWxhdGl2ZUNlbnRlci54KSwgZGVsdGEueSAqIE1hdGgubWluKHJlbGF0aXZlQ2VudGVyLnksIDEgLSByZWxhdGl2ZUNlbnRlci55KSk7XG4gICAgICAgIGNvbnN0IHJhdGlvUHJlc2VydmluZ0VkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoZWRnZURpc3RhbmNlLnkgKiBkZWx0YS54IC8gZGVsdGEueSwgZWRnZURpc3RhbmNlLnggKiBkZWx0YS55IC8gZGVsdGEueCk7XG4gICAgICAgIGNvbnN0IG1pbmltYWxFZGdlRGlzdGFuY2UgPSBuZXcgVmVjdG9yKE1hdGgubWluKGVkZ2VEaXN0YW5jZS54LCByYXRpb1ByZXNlcnZpbmdFZGdlRGlzdGFuY2UueCksIE1hdGgubWluKGVkZ2VEaXN0YW5jZS55LCByYXRpb1ByZXNlcnZpbmdFZGdlRGlzdGFuY2UueSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KGNlbnRlci5hZGQobmV3IFZlY3RvcigtbWluaW1hbEVkZ2VEaXN0YW5jZS54LCAtbWluaW1hbEVkZ2VEaXN0YW5jZS55KSksIGNlbnRlci5hZGQobWluaW1hbEVkZ2VEaXN0YW5jZSkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9kcmF3YWJsZXMvVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIERyYXdhYmxlU29ydGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHNvcnQoZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSwgZHJhdzogYm9vbGVhbiwgYW5pbWF0ZTogYm9vbGVhbik6IHtkZWxheTogbnVtYmVyLCByZXZlcnNlOiBib29sZWFufVtdIHtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVwcmVzZW50YXRpdmVFbGVtZW50ID0gZWxlbWVudHNbMF07XG4gICAgICAgIGlmIChyZXByZXNlbnRhdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBMaW5lICYmIHJlcHJlc2VudGF0aXZlRWxlbWVudC5hbmltT3JkZXIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcmRlckJ5R2VvbWV0cmljRGlyZWN0aW9uKGVsZW1lbnRzLCByZXByZXNlbnRhdGl2ZUVsZW1lbnQuYW5pbU9yZGVyLCBkcmF3LCBhbmltYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRyYXcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWlsZFNvcnRhYmxlQ2FjaGUoZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSwgZGlyZWN0aW9uOiBSb3RhdGlvbik6IHtlbGVtZW50OiBMaW5lLCB0ZXJtaW5pOiBWZWN0b3JbXSwgcHJvamVjdGlvbjogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBhbmltYXRpb25EdXJhdGlvbjogbnVtYmVyfVtdIHtcbiAgICAgICAgY29uc3QgY2FjaGUgOiB7ZWxlbWVudDogTGluZSwgdGVybWluaTogVmVjdG9yW10sIHByb2plY3Rpb246IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgYW5pbWF0aW9uRHVyYXRpb246IG51bWJlcn1bXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7aTxlbGVtZW50cy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudHNbaV0gaW5zdGFuY2VvZiBMaW5lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IDxMaW5lPmVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGxldCB0ZXJtaW5pID0gW1ZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTF07XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlcm1pbmkgPSBbZWxlbWVudC5wYXRoWzBdLCBlbGVtZW50LnBhdGhbZWxlbWVudC5wYXRoLmxlbmd0aC0xXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2oxID0gdGVybWluaVswXS5zaWduZWRMZW5ndGhQcm9qZWN0ZWRBdChkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2oyID0gdGVybWluaVsxXS5zaWduZWRMZW5ndGhQcm9qZWN0ZWRBdChkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldmVyc2UgPSBwcm9qMSA8IHByb2oyO1xuICAgICAgICAgICAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlcm1pbmkucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWNoZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgdGVybWluaTogdGVybWluaSxcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbjogTWF0aC5tYXgocHJvajEsIHByb2oyKSxcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZTogcmV2ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IGVsZW1lbnQuYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlO1xuICAgIH1cblxuICAgIHByaXZhdGUgb3JkZXJCeUdlb21ldHJpY0RpcmVjdGlvbihlbGVtZW50czogVGltZWREcmF3YWJsZVtdLCBkaXJlY3Rpb246IFJvdGF0aW9uLCBkcmF3OiBib29sZWFuLCBhbmltYXRlOiBib29sZWFuKToge2RlbGF5OiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW59W10ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYnVpbGRTb3J0YWJsZUNhY2hlKGVsZW1lbnRzLCBkaXJlY3Rpb24pO1xuICAgICAgICBjYWNoZS5zb3J0KChhLCBiKSA9PiAoYS5wcm9qZWN0aW9uIDwgYi5wcm9qZWN0aW9uKSA/IDEgOiAtMSk7XG4gICAgICAgIGVsZW1lbnRzLnNwbGljZSgwLCBlbGVtZW50cy5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IGRlbGF5czoge2RlbGF5OiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW59W10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8Y2FjaGUubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgY29uc3QgcmVmUG9pbnQgPSBjYWNoZVtpXS50ZXJtaW5pWzBdO1xuICAgICAgICAgICAgbGV0IHNob3J0ZXN0ID0gcmVmUG9pbnQuZGVsdGEoY2FjaGVbMF0udGVybWluaVswXSkubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IHByb2plY3Rpb25Gb3JTaG9ydGVzdCA9IDA7XG4gICAgICAgICAgICBsZXQgZGVsYXlGb3JTaG9ydGVzdCA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajxpO2orKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDtrPDI7aysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gcmVmUG9pbnQuZGVsdGEoY2FjaGVbal0udGVybWluaVtrXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvdGVudGlhbFNob3J0ZXN0ID0gZGVsdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG90ZW50aWFsU2hvcnRlc3QgPD0gc2hvcnRlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3J0ZXN0ID0gcG90ZW50aWFsU2hvcnRlc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uRm9yU2hvcnRlc3QgPSBkZWx0YS5zaWduZWRMZW5ndGhQcm9qZWN0ZWRBdChkaXJlY3Rpb24pOyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlGb3JTaG9ydGVzdCA9IGRlbGF5c1tqXS5kZWxheSArIChrID09IDEgPyBjYWNoZVtqXS5hbmltYXRpb25EdXJhdGlvbiA6IDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgbm9hbmltID0gIWFuaW1hdGUgfHwgY2FjaGVbaV0uZWxlbWVudFtkcmF3ID8gJ2Zyb20nIDogJ3RvJ10/LmZsYWcuaW5jbHVkZXMoJ25vYW5pbScpO1xuICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBub2FuaW0gPyAwIDogKGRlbGF5Rm9yU2hvcnRlc3QgKyBwcm9qZWN0aW9uRm9yU2hvcnRlc3QvY2FjaGVbaV0uZWxlbWVudC5zcGVlZCk7XG4gICAgICAgICAgICBkZWxheXMucHVzaCh7ZGVsYXk6IGRlbGF5LCByZXZlcnNlOiBjYWNoZVtpXS5yZXZlcnNlID09IGRyYXd9KTtcbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goY2FjaGVbaV0uZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlbGF5cztcbiAgICB9XG59IiwiaW1wb3J0IHsgU3RhdGlvbiwgU3RvcCB9IGZyb20gXCIuL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9kcmF3YWJsZXMvTGluZVwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuXG4vL2NvbnN0IG1hdGhqcyA9IHJlcXVpcmUoJ21hdGhqcycpO1xuY29uc3QgZm1pbiA9IHJlcXVpcmUoJ2ZtaW4nKTtcblxuXG5leHBvcnQgY2xhc3MgR3Jhdml0YXRvciB7XG4gICAgc3RhdGljIElORVJUTkVTUyA9IDEwMDtcbiAgICBzdGF0aWMgR1JBRElFTlRfU0NBTEUgPSAwLjAwMDAwMDAwMTtcbiAgICBzdGF0aWMgREVWSUFUSU9OX1dBUk5JTkcgPSAwLjI7XG4gICAgc3RhdGljIElOSVRJQUxJWkVfUkVMQVRJVkVfVE9fRVVDTElESUFOX0RJU1RBTkNFID0gdHJ1ZTtcbiAgICBzdGF0aWMgU1BFRUQgPSAyNTA7XG4gICAgc3RhdGljIE1BWF9BTklNX0RVUkFUSU9OID0gNjtcbiAgICBzdGF0aWMgQ09MT1JfREVWSUFUSU9OID0gMC4wMjtcblxuICAgIHByaXZhdGUgaW5pdGlhbFdlaWdodEZhY3RvcnM6IHtbaWQ6IHN0cmluZ10gOiBudW1iZXJ9ID0ge307XG4gICAgcHJpdmF0ZSBpbml0aWFsQW5nbGVzOiB7YVN0YXRpb246IHN0cmluZywgY29tbW9uU3RhdGlvbjogc3RyaW5nLCBiU3RhdGlvbjogc3RyaW5nLCBhbmdsZTogbnVtYmVyfVtdID0gW107XG4gICAgcHJpdmF0ZSBhbmdsZUY6IGFueTtcbiAgICBwcml2YXRlIGFuZ2xlRlByaW1lOiB7W2lkOiBzdHJpbmddOiBhbnl9ID0ge307XG4gICAgcHJpdmF0ZSBhdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW86IG51bWJlciA9IC0xO1xuICAgIHByaXZhdGUgZWRnZXM6IHtbaWQ6IHN0cmluZ106IExpbmV9ID0ge307XG4gICAgcHJpdmF0ZSB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yLCBzdGFydENvb3JkczogVmVjdG9yfX0gPSB7fTtcbiAgICBwcml2YXRlIGRpcnR5ID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGdyYXZpdGF0ZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpcnR5KVxuICAgICAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVHcmFwaCgpO1xuICAgICAgICBjb25zdCBzb2x1dGlvbiA9IHRoaXMubWluaW1pemVMb3NzKCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0RGlzdGFuY2VzKHNvbHV0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb24sIGRlbGF5LCBhbmltYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGNvbnN0IHdlaWdodHMgPSB0aGlzLmdldFdlaWdodHNTdW0oKTtcbiAgICAgICAgY29uc3QgZXVjbGlkaWFuID0gdGhpcy5nZXRFdWNsaWRpYW5EaXN0YW5jZVN1bSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnd2VpZ2h0czonLCB3ZWlnaHRzLCAnZXVjbGlkaWFuOicsIGV1Y2xpZGlhbik7XG4gICAgICAgIGlmICh0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyA9PSAtMSAmJiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID0gd2VpZ2h0cyAvIGV1Y2xpZGlhbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW9eLTEnLCAxL3RoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvKTtcblxuICAgICAgICAgICAgLy90aGlzLmluaXRpYWxpemVBbmdsZUdyYWRpZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8qcHJpdmF0ZSBpbml0aWFsaXplQW5nbGVHcmFkaWVudHMoKSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSAnKGFjb3MoKChiX3gtYV94KSooYl94LWNfeCkrKGJfeS1hX3kpKihiX3ktY195KSkvKHNxcnQoKGJfeC1hX3gpXjIrKGJfeS1hX3kpXjIpKnNxcnQoKGJfeC1jX3gpXjIrKGJfeS1jX3kpXjIpKSkqKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkvYWJzKCgoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpKS1jb25zdCknO1xuICAgICAgICBjb25zdCBmID0gbWF0aGpzLnBhcnNlKGV4cHJlc3Npb24pO1xuICAgICAgICB0aGlzLmFuZ2xlRiA9IGYuY29tcGlsZSgpO1xuXG4gICAgICAgIGNvbnN0IGZEZWx0YSA9IG1hdGhqcy5wYXJzZShleHByZXNzaW9uICsgJ14yJyk7XG5cbiAgICAgICAgY29uc3QgdmFycyA9IFsnYV94JywgJ2FfeScsICdiX3gnLCAnYl95JywgJ2NfeCcsICdjX3knXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHZhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYW5nbGVGUHJpbWVbdmFyc1tpXV0gPSBtYXRoanMuZGVyaXZhdGl2ZShmRGVsdGEsIHZhcnNbaV0pLmNvbXBpbGUoKTtcbiAgICAgICAgfVxuICAgIH0qL1xuXG4gICAgcHJpdmF0ZSBnZXRXZWlnaHRzU3VtKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIHN1bSArPSBlZGdlLndlaWdodCB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRFdWNsaWRpYW5EaXN0YW5jZVN1bSgpIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gdGhpcy5lZGdlVmVjdG9yKGVkZ2UpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZWRnZVZlY3RvcihlZGdlOiBMaW5lKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemVHcmFwaCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gPSBHcmF2aXRhdG9yLklOSVRJQUxJWkVfUkVMQVRJVkVfVE9fRVVDTElESUFOX0RJU1RBTkNFXG4gICAgICAgICAgICAgICAgICAgID8gMSAvIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5lZGdlVmVjdG9yKGVkZ2UpLmxlbmd0aCAvIChlZGdlLndlaWdodCB8fCAwKTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuYWRkSW5pdGlhbEFuZ2xlcyhlZGdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHZlcnRleC5pbmRleCA9IG5ldyBWZWN0b3IoaSwgaSsxKTtcbiAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkSW5pdGlhbEFuZ2xlcyhlZGdlOiBMaW5lKSB7XG4gICAgICAgIGZvciAoY29uc3QgYWRqYWNlbnQgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgaWYgKGFkamFjZW50ID09IGVkZ2UpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTwyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8MjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkID09IGFkamFjZW50LnRlcm1pbmlbal0uc3RhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMudGhyZWVEb3RBbmdsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVtpXjFdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pW2ldLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbYWRqYWNlbnQudGVybWluaVtqXjFdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsQW5nbGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFTdGF0aW9uOiBlZGdlLnRlcm1pbmlbaV4xXS5zdGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uU3RhdGlvbjogZWRnZS50ZXJtaW5pW2ldLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiU3RhdGlvbjogYWRqYWNlbnQudGVybWluaVtqXjFdLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vZGVyaXZlIGFyY2NvcygoKGEtYykqKGUtZykrKGItZCkqKGYtaCkpLyhzcXJ0KChhLWMpXjIrKGItZCleMikqc3FydCgoZS1nKV4yKyhmLWgpXjIpKSkqKChmLWgpKihhLWMpLShiLWQpKihlLWcpKS98KChmLWgpKihhLWMpLShiLWQpKihlLWcpKXxcbiAgICAgICAgLy9kZXJpdmUgYWNvcygoKGJfeC1hX3gpKihiX3gtY194KSsoYl95LWFfeSkqKGJfeS1jX3kpKS8oc3FydCgoYl94LWFfeCleMisoYl95LWFfeSleMikqc3FydCgoYl94LWNfeCleMisoYl95LWNfeSleMikpKSooKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKS9hYnMoKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJlZURvdEFuZ2xlKGE6IFZlY3RvciwgYjogVmVjdG9yLCBjOiBWZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGLCBhLCBiLCBjLCAwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbihmOiBhbnksIGE6IFZlY3RvciwgYjogVmVjdG9yLCBjOiBWZWN0b3IsIG9sZFZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGYuZXZhbHVhdGUoe2FfeDogYS54LCBhX3k6IGEueSwgYl94OiBiLngsIGJfeTogYi55LCBjX3g6IGMueCwgY195OiBjLnksIGNvbnN0OiBvbGRWYWx1ZX0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWluaW1pemVMb3NzKCk6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3QgZ3Jhdml0YXRvciA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtoaXN0b3J5OiBbXX07XG4gICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXJbXSA9IHRoaXMuc3RhcnRTdGF0aW9uUG9zaXRpb25zKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZm1pbi5jb25qdWdhdGVHcmFkaWVudCgoQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdKSA9PiB7XG4gICAgICAgICAgICBmeHByaW1lID0gZnhwcmltZSB8fCBBLnNsaWNlKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnhwcmltZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZ4cHJpbWVbaV0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGZ4ID0gMDtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5kZWx0YVRvU3RhcnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9DdXJyZW50U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIC8vZnggPSB0aGlzLmRlbHRhVG9BbmdsZXNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb05ld0Rpc3RhbmNlc1RvRW5zdXJlQWNjdXJhY3koZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgdGhpcy5zY2FsZUdyYWRpZW50VG9FbnN1cmVXb3JraW5nU3RlcFNpemUoZnhwcmltZSk7XG4gICAgICAgICAgICByZXR1cm4gZng7XG4gICAgICAgIH0sIHN0YXJ0LCBwYXJhbXMpO1xuICAgICAgICByZXR1cm4gc29sdXRpb24ueDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0U3RhdGlvblBvc2l0aW9ucygpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdGFydFt2ZXJ0ZXguaW5kZXgueF0gPSB2ZXJ0ZXguc3RhcnRDb29yZHMueDtcbiAgICAgICAgICAgIHN0YXJ0W3ZlcnRleC5pbmRleC55XSA9IHZlcnRleC5zdGFydENvb3Jkcy55O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGFydDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWChBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueF0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC54XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWShBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueV0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IudmVydGljZXMpKSB7XG4gICAgICAgICAgICBmeCArPSAoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGFydENvb3Jkcy54LCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGFydENvb3Jkcy55LCAyKVxuICAgICAgICAgICAgICAgICkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnhdICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXJ0Q29vcmRzLngpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC55XSArPSAyICogKEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGFydENvb3Jkcy55KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9DdXJyZW50U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXMoZ3Jhdml0YXRvci52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIGZ4ICs9IChcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy54LCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueSwgMilcbiAgICAgICAgICAgICAgICApICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC54XSArPSAyICogKEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueCkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnldICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy55KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9BbmdsZXNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLmluaXRpYWxBbmdsZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC55XSk7XG4gICAgICAgICAgICBjb25zdCBiID0gbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueV0pO1xuICAgICAgICAgICAgY29uc3QgYyA9IG5ldyBWZWN0b3IoQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueV0pO1xuXG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKTtcbiAgICAgICAgICAgIGZ4ICs9IE1hdGgucG93KGRlbHRhLCAyKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuXG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueF0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYV94J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYV95J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC54XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydiX3gnXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnldICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2JfeSddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnhdICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2NfeCddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnldICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2NfeSddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9OZXdEaXN0YW5jZXNUb0Vuc3VyZUFjY3VyYWN5KGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXMoZ3Jhdml0YXRvci5lZGdlcykpIHsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB2ID0gTWF0aC5wb3codGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICAgICAgICAgICAgICsgTWF0aC5wb3codGhpcy5kZWx0YVkoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICAgICAgICAgICAgIC0gTWF0aC5wb3coZ3Jhdml0YXRvci5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApLCAyKTtcbiAgICAgICAgICAgIGZ4ICs9IE1hdGgucG93KHYsIDIpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnhdICs9ICs0ICogdiAqIHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueV0gKz0gKzQgKiB2ICogdGhpcy5kZWx0YVkoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC54XSArPSAtNCAqIHYgKiB0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnldICs9IC00ICogdiAqIHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2NhbGVHcmFkaWVudFRvRW5zdXJlV29ya2luZ1N0ZXBTaXplKGZ4cHJpbWU6IG51bWJlcltdKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmeHByaW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmeHByaW1lW2ldICo9IEdyYXZpdGF0b3IuR1JBRElFTlRfU0NBTEU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzc2VydERpc3RhbmNlcyhzb2x1dGlvbjogbnVtYmVyW10pIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWF0aW9uID0gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgICAgIE1hdGgucG93KHRoaXMuZGVsdGFYKHNvbHV0aW9uLCB0aGlzLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVkoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICApIC8gKHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSAqIChlZGdlLndlaWdodCB8fCAwKSkgLSAxO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRldmlhdGlvbikgPiBHcmF2aXRhdG9yLkRFVklBVElPTl9XQVJOSU5HKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVkZ2UubmFtZSwgJ2RpdmVyZ2VzIGJ5ICcsIGRldmlhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IFxuXG4gICAgcHJpdmF0ZSBtb3ZlU3RhdGlvbnNBbmRMaW5lcyhzb2x1dGlvbjogbnVtYmVyW10sIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPSBhbmltYXRlID8gTWF0aC5taW4oR3Jhdml0YXRvci5NQVhfQU5JTV9EVVJBVElPTiwgdGhpcy5nZXRUb3RhbERpc3RhbmNlVG9Nb3ZlKHNvbHV0aW9uKSAvIEdyYXZpdGF0b3IuU1BFRUQpIDogMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgdmVydGV4LnN0YXRpb24ubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBuZXcgVmVjdG9yKHNvbHV0aW9uW3ZlcnRleC5pbmRleC54XSwgc29sdXRpb25bdmVydGV4LmluZGV4LnldKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkcyA9IFt0aGlzLmdldE5ld1N0YXRpb25Qb3NpdGlvbihlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBzb2x1dGlvbiksIHRoaXMuZ2V0TmV3U3RhdGlvblBvc2l0aW9uKGVkZ2UudGVybWluaVsxXS5zdGF0aW9uSWQsIHNvbHV0aW9uKV07XG4gICAgICAgICAgICBlZGdlLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgY29vcmRzLCB0aGlzLmdldENvbG9yQnlEZXZpYXRpb24oZWRnZSwgZWRnZS53ZWlnaHQgfHwgMCkpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ICs9IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcztcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29sb3JCeURldmlhdGlvbihlZGdlOiBMaW5lLCB3ZWlnaHQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBpbml0aWFsRGlzdCA9IHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uc3RhcnRDb29yZHMuZGVsdGEodGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5zdGFydENvb3JkcykubGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsICh3ZWlnaHQgLSB0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyAqIGluaXRpYWxEaXN0KSAqIEdyYXZpdGF0b3IuQ09MT1JfREVWSUFUSU9OKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUb3RhbERpc3RhbmNlVG9Nb3ZlKHNvbHV0aW9uOiBudW1iZXJbXSkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IG5ldyBWZWN0b3Ioc29sdXRpb25bdmVydGV4LmluZGV4LnhdLCBzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueV0pLmRlbHRhKHZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TmV3U3RhdGlvblBvc2l0aW9uKHN0YXRpb25JZDogc3RyaW5nLCBzb2x1dGlvbjogbnVtYmVyW10pOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcihzb2x1dGlvblt0aGlzLnZlcnRpY2VzW3N0YXRpb25JZF0uaW5kZXgueF0sIHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC55XSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRWZXJ0ZXgodmVydGV4SWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNlc1t2ZXJ0ZXhJZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQodmVydGV4SWQpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyB2ZXJ0ZXhJZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9IHtzdGF0aW9uOiBzdGF0aW9uLCBpbmRleDogVmVjdG9yLk5VTEwsIHN0YXJ0Q29vcmRzOiBzdGF0aW9uLmJhc2VDb29yZHN9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkRWRnZShsaW5lOiBMaW5lKSB7XG4gICAgICAgIGlmIChsaW5lLndlaWdodCA9PSB1bmRlZmluZWQpIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldElkZW50aWZpZXIobGluZSk7XG4gICAgICAgIHRoaXMuZWRnZXNbaWRdID0gbGluZTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzBdLnN0YXRpb25JZCk7XG4gICAgICAgIHRoaXMuYWRkVmVydGV4KGxpbmUudGVybWluaVsxXS5zdGF0aW9uSWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SWRlbnRpZmllcihsaW5lOiBMaW5lKSB7XG4gICAgICAgIHJldHVybiBVdGlscy5hbHBoYWJldGljSWQobGluZS50ZXJtaW5pWzBdLnN0YXRpb25JZCwgbGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEluc3RhbnQge1xuICAgIHN0YXRpYyBCSUdfQkFORzogSW5zdGFudCA9IG5ldyBJbnN0YW50KDAsIDAsICcnKTtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lcG9jaDogbnVtYmVyLCBwcml2YXRlIF9zZWNvbmQ6IG51bWJlciwgcHJpdmF0ZSBfZmxhZzogc3RyaW5nKSB7XG5cbiAgICB9XG4gICAgZ2V0IGVwb2NoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lcG9jaDtcbiAgICB9XG4gICAgZ2V0IHNlY29uZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2Vjb25kO1xuICAgIH1cbiAgICBnZXQgZmxhZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmxhZztcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbShhcnJheTogc3RyaW5nW10pOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW50KHBhcnNlSW50KGFycmF5WzBdKSwgcGFyc2VJbnQoYXJyYXlbMV0pLCBhcnJheVsyXSA/PyAnJylcbiAgICB9XG5cbiAgICBlcXVhbHModGhhdDogSW5zdGFudCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5lcG9jaCA9PSB0aGF0LmVwb2NoICYmIHRoaXMuc2Vjb25kID09IHRoYXQuc2Vjb25kKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2gpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LnNlY29uZCAtIHRoaXMuc2Vjb25kO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGF0LnNlY29uZDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9kcmF3YWJsZXMvTGluZVwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcblxuZXhwb3J0IGNsYXNzIExpbmVHcm91cCB7XG4gICAgcHJpdmF0ZSBfbGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgX3Rlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgIHN0cm9rZUNvbG9yID0gMDtcbiAgICBcbiAgICBhZGRMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLl9saW5lcy5pbmNsdWRlcyhsaW5lKSlcbiAgICAgICAgICAgIHRoaXMuX2xpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5fbGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGluZXNbaV0gPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFN0b3BbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJtaW5pO1xuICAgIH1cblxuICAgIGdldFBhdGhCZXR3ZWVuKHN0YXRpb25JZEZyb206IHN0cmluZywgc3RhdGlvbklkVG86IHN0cmluZyk6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSB8IG51bGwge1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5nZXRMaW5lc1dpdGhTdG9wKHN0YXRpb25JZEZyb20pO1xuICAgICAgICBjb25zdCB0byA9IHRoaXMuZ2V0TGluZXNXaXRoU3RvcChzdGF0aW9uSWRUbyk7XG5cbiAgICAgICAgaWYgKGZyb20ubGVuZ3RoID09IDAgfHwgdG8ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIE9iamVjdC52YWx1ZXMoZnJvbSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiBPYmplY3QudmFsdWVzKHRvKSkge1xuICAgICAgICAgICAgICAgIGlmIChhLmxpbmUgPT0gYi5saW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhdGhCZXR3ZWVuU3RvcHMoYS5saW5lLCBhLnN0b3AsIGIuc3RvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBPYmplY3QudmFsdWVzKGZyb20pKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgT2JqZWN0LnZhbHVlcyh0bykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tb24gPSB0aGlzLmZpbmRDb21tb25TdG9wKGEubGluZSwgYi5saW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoY29tbW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyc3RQYXJ0ID0gdGhpcy5nZXRQYXRoQmV0d2VlblN0b3BzKGEubGluZSwgYS5zdG9wLCBjb21tb24pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRQYXJ0ID0gdGhpcy5nZXRQYXRoQmV0d2VlblN0b3BzKGIubGluZSwgY29tbW9uLCBiLnN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFBhcnRTbGljZSA9IGZpcnN0UGFydC5wYXRoLnNsaWNlKDAsIGZpcnN0UGFydC50bysxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Vjb25kUGFydFNsaWNlID0gc2Vjb25kUGFydC5wYXRoLnNsaWNlKHNlY29uZFBhcnQuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHBhdGg6IGZpcnN0UGFydFNsaWNlLmNvbmNhdChzZWNvbmRQYXJ0U2xpY2UpLCBmcm9tOiBmaXJzdFBhcnQuZnJvbSwgdG86IGZpcnN0UGFydFNsaWNlLmxlbmd0aCArIHNlY29uZFBhcnQudG99O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wbGV4IFRyYWluIHJvdXRpbmcgZm9yIExpbmVzIG9mIExpbmVHcm91cHMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldExpbmVzV2l0aFN0b3Aoc3RhdGlvbklkOiBzdHJpbmcpOiB7bGluZTogTGluZSwgc3RvcDogU3RvcH1bXSB7XG4gICAgICAgIGNvbnN0IGFycjoge2xpbmU6IExpbmUsIHN0b3A6IFN0b3B9W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIE9iamVjdC52YWx1ZXModGhpcy5fbGluZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gbGluZS5nZXRTdG9wKHN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goe2xpbmU6IGxpbmUsIHN0b3A6IHN0b3B9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UGF0aEJldHdlZW5TdG9wcyhsaW5lOiBMaW5lLCBmcm9tOiBTdG9wLCB0bzogU3RvcCk6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBsaW5lLnBhdGg7XG4gICAgICAgIGxldCBmcm9tSWR4ID0gdGhpcy5pbmRleE9mKHBhdGgsIGZyb20uY29vcmQgfHwgVmVjdG9yLk5VTEwpO1xuICAgICAgICBsZXQgdG9JZHggPSB0aGlzLmluZGV4T2YocGF0aCwgdG8uY29vcmQgfHwgVmVjdG9yLk5VTEwpO1xuICAgICAgICBpZiAoZnJvbUlkeCA9PSAtMSB8fCB0b0lkeCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RvcCB0aGF0IHNob3VsZCBiZSBwcmVzZW50IGlzIG5vdCBwcmVzZW50IG9uIGxpbmUgXCIgKyBsaW5lLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc3Qgc2xpY2UgPSBwYXRoLnNsaWNlKE1hdGgubWluKGZyb21JZHgsIHRvSWR4KSwgTWF0aC5tYXgoZnJvbUlkeCwgdG9JZHgpKzEpO1xuICAgICAgICBjb25zdCBzbGljZSA9IHBhdGguc2xpY2UoKTtcbiAgICAgICAgaWYgKGZyb21JZHggPiB0b0lkeCkge1xuICAgICAgICAgICAgc2xpY2UucmV2ZXJzZSgpO1xuICAgICAgICAgICAgZnJvbUlkeCA9IHNsaWNlLmxlbmd0aCAtIDEgLSBmcm9tSWR4O1xuICAgICAgICAgICAgdG9JZHggPSBzbGljZS5sZW5ndGggLSAxIC0gdG9JZHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgcGF0aDogc2xpY2UsIGZyb206IGZyb21JZHgsIHRvOiB0b0lkeCB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5kZXhPZihhcnJheTogVmVjdG9yW10sIGVsZW1lbnQ6IFZlY3Rvcikge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXS5lcXVhbHMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kQ29tbW9uU3RvcChsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBTdG9wIHwgbnVsbCB7XG4gICAgICAgIGZvciAoY29uc3QgdGVybWludXMxIG9mIE9iamVjdC52YWx1ZXMobGluZTEudGVybWluaSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGVybWludXMyIG9mIE9iamVjdC52YWx1ZXMobGluZTIudGVybWluaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGVybWludXMxLnN0YXRpb25JZCA9PSB0ZXJtaW51czIuc3RhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXJtaW51czE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVGVybWluaSgpIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaChsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVUZXJtaW5pID0gbC50ZXJtaW5pO1xuICAgICAgICAgICAgbGluZVRlcm1pbmkuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXQudHJhY2tJbmZvLmluY2x1ZGVzKCcqJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0rKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGVybWluaTogU3RvcFtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgW3N0YXRpb25JZCwgb2NjdXJlbmNlc10gb2YgT2JqZWN0LmVudHJpZXMoY2FuZGlkYXRlcykpIHtcbiAgICAgICAgICAgIGlmIChvY2N1cmVuY2VzID09IDEpIHtcbiAgICAgICAgICAgICAgICB0ZXJtaW5pLnB1c2gobmV3IFN0b3Aoc3RhdGlvbklkLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Rlcm1pbmkgPSB0ZXJtaW5pO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9UaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuL1pvb21lclwiO1xuaW1wb3J0IHsgTGluZUdyb3VwIH0gZnJvbSBcIi4vTGluZUdyb3VwXCI7XG5pbXBvcnQgeyBHcmF2aXRhdG9yIH0gZnJvbSBcIi4vR3Jhdml0YXRvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBEcmF3YWJsZVNvcnRlciB9IGZyb20gXCIuL0RyYXdhYmxlU29ydGVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGlvblByb3ZpZGVyIHtcbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IHVuZGVmaW5lZDtcbiAgICBsaW5lR3JvdXBCeUlkKGlkOiBzdHJpbmcpOiBMaW5lR3JvdXA7XG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uO1xufVxuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrQWRhcHRlciB7XG4gICAgY2FudmFzU2l6ZTogQm91bmRpbmdCb3g7XG4gICAgYXV0b1N0YXJ0OiBib29sZWFuO1xuICAgIHpvb21NYXhTY2FsZTogbnVtYmVyO1xuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQ7XG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uO1xuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZDtcbiAgICB6b29tVG8oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTmV0d29yayBpbXBsZW1lbnRzIFN0YXRpb25Qcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzbGlkZUluZGV4OiB7W2lkOiBzdHJpbmddIDoge1tpZDogc3RyaW5nXTogVGltZWREcmF3YWJsZVtdfX0gPSB7fTtcbiAgICBwcml2YXRlIHN0YXRpb25zOiB7IFtpZDogc3RyaW5nXSA6IFN0YXRpb24gfSA9IHt9O1xuICAgIHByaXZhdGUgbGluZUdyb3VwczogeyBbaWQ6IHN0cmluZ10gOiBMaW5lR3JvdXAgfSA9IHt9O1xuICAgIHByaXZhdGUgZHJhd2FibGVCdWZmZXI6IFRpbWVkRHJhd2FibGVbXSA9IFtdO1xuICAgIHByaXZhdGUgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcjtcbiAgICBwcml2YXRlIHpvb21lcjogWm9vbWVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBOZXR3b3JrQWRhcHRlciwgcHJpdmF0ZSBkcmF3YWJsZVNvcnRlcjogRHJhd2FibGVTb3J0ZXIpIHtcbiAgICAgICAgdGhpcy5ncmF2aXRhdG9yID0gbmV3IEdyYXZpdGF0b3IodGhpcyk7XG4gICAgICAgIHRoaXMuem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmFkYXB0ZXIuY2FudmFzU2l6ZSwgdGhpcy5hZGFwdGVyLnpvb21NYXhTY2FsZSk7XG4gICAgfVxuXG4gICAgZ2V0IGF1dG9TdGFydCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5hdXRvU3RhcnQ7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmluaXRpYWxpemUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aW9uc1tpZF07XG4gICAgfVxuXG4gICAgbGluZUdyb3VwQnlJZChpZDogc3RyaW5nKTogTGluZUdyb3VwIHtcbiAgICAgICAgaWYgKHRoaXMubGluZUdyb3Vwc1tpZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVHcm91cHNbaWRdID0gbmV3IExpbmVHcm91cCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmVHcm91cHNbaWRdO1xuICAgIH1cblxuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLmFkYXB0ZXIuY3JlYXRlVmlydHVhbFN0b3AoaWQsIGJhc2VDb29yZHMsIHJvdGF0aW9uKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uc1tpZF0gPSBzdG9wO1xuICAgICAgICByZXR1cm4gc3RvcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRpc3BsYXlJbnN0YW50KGluc3RhbnQ6IEluc3RhbnQpIHtcbiAgICAgICAgaWYgKCFpbnN0YW50LmVxdWFscyhJbnN0YW50LkJJR19CQU5HKSkge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXdFcG9jaChpbnN0YW50LmVwb2NoICsgJycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRpbWVkRHJhd2FibGVzQXQobm93OiBJbnN0YW50KTogVGltZWREcmF3YWJsZVtdIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRXBvY2hFeGlzdGluZyhub3cuZXBvY2ggKyAnJykpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXVtub3cuc2Vjb25kXTtcbiAgICB9XG5cbiAgICBkcmF3VGltZWREcmF3YWJsZXNBdChub3c6IEluc3RhbnQsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmRpc3BsYXlJbnN0YW50KG5vdyk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzOiBUaW1lZERyYXdhYmxlW10gPSB0aGlzLnRpbWVkRHJhd2FibGVzQXQobm93KTtcbiAgICAgICAgbGV0IGRlbGF5ID0gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGVsYXkgPSB0aGlzLnBvcHVsYXRlRHJhd2FibGVCdWZmZXIoZWxlbWVudHNbaV0sIGRlbGF5LCBhbmltYXRlLCBub3cpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaERyYXdhYmxlQnVmZmVyKGRlbGF5LCBhbmltYXRlLCBub3cpO1xuICAgICAgICBkZWxheSA9IHRoaXMuZ3Jhdml0YXRvci5ncmF2aXRhdGUoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuem9vbVRvKHRoaXMuem9vbWVyLmNlbnRlciwgdGhpcy56b29tZXIuc2NhbGUsIHRoaXMuem9vbWVyLmR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy56b29tZXIucmVzZXQoKTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgcG9wdWxhdGVEcmF3YWJsZUJ1ZmZlcihlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBub3c6IEluc3RhbnQpOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMuaXNEcmF3YWJsZUVsaWdsaWJsZUZvclNhbWVCdWZmZXIoZWxlbWVudCwgbm93KSkge1xuICAgICAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRHJhd2FibGVCdWZmZXIoZGVsYXksIGFuaW1hdGUsIG5vdyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmF3YWJsZUJ1ZmZlci5wdXNoKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzb3J0RHJhd2FibGVCdWZmZXIobm93OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKToge2RlbGF5OiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW59W10ge1xuICAgICAgICBpZiAodGhpcy5kcmF3YWJsZUJ1ZmZlci5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdhYmxlU29ydGVyLnNvcnQodGhpcy5kcmF3YWJsZUJ1ZmZlciwgdGhpcy5pc0RyYXcodGhpcy5kcmF3YWJsZUJ1ZmZlclt0aGlzLmRyYXdhYmxlQnVmZmVyLmxlbmd0aC0xXSwgbm93KSwgYW5pbWF0ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmbHVzaERyYXdhYmxlQnVmZmVyKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIG5vdzogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGRlbGF5cyA9IHRoaXMuc29ydERyYXdhYmxlQnVmZmVyKG5vdywgYW5pbWF0ZSk7XG4gICAgICAgIGNvbnN0IG92ZXJyaWRlID0gZGVsYXlzLmxlbmd0aCA9PSB0aGlzLmRyYXdhYmxlQnVmZmVyLmxlbmd0aDtcbiAgICAgICAgbGV0IG1heERlbGF5ID0gZGVsYXk7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLmRyYXdhYmxlQnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzcGVjaWZpY0RlbGF5ID0gb3ZlcnJpZGUgPyBkZWxheSArIGRlbGF5c1tpXS5kZWxheSA6IG1heERlbGF5O1xuICAgICAgICAgICAgY29uc3Qgb3ZlcnJpZGVSZXZlcnNlID0gb3ZlcnJpZGUgPyBkZWxheXNbaV0ucmV2ZXJzZSA6IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgbmV3RGVsYXkgPSB0aGlzLmRyYXdPckVyYXNlRWxlbWVudCh0aGlzLmRyYXdhYmxlQnVmZmVyW2ldLCBzcGVjaWZpY0RlbGF5LCBhbmltYXRlLCBvdmVycmlkZVJldmVyc2UsIG5vdylcbiAgICAgICAgICAgIG1heERlbGF5ID0gTWF0aC5tYXgobmV3RGVsYXksIG1heERlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdhYmxlQnVmZmVyID0gW107XG4gICAgICAgIHJldHVybiBtYXhEZWxheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRHJhdyhlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBub3c6IEluc3RhbnQpIHtcbiAgICAgICAgcmV0dXJuIG5vdy5lcXVhbHMoZWxlbWVudC5mcm9tKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRHJhd2FibGVFbGlnbGlibGVGb3JTYW1lQnVmZmVyKGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIG5vdzogSW5zdGFudCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5kcmF3YWJsZUJ1ZmZlci5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFzdEVsZW1lbnQgPSB0aGlzLmRyYXdhYmxlQnVmZmVyW3RoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoLTFdO1xuICAgICAgICBpZiAoZWxlbWVudC5uYW1lICE9IGxhc3RFbGVtZW50Lm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0RyYXcoZWxlbWVudCwgbm93KSAhPSB0aGlzLmlzRHJhdyhsYXN0RWxlbWVudCwgbm93KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTGluZSAmJiBsYXN0RWxlbWVudCBpbnN0YW5jZW9mIExpbmUgJiYgZWxlbWVudC5hbmltT3JkZXI/LmRlZ3JlZXMgIT0gbGFzdEVsZW1lbnQuYW5pbU9yZGVyPy5kZWdyZWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3T3JFcmFzZUVsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgb3ZlcnJpZGVSZXZlcnNlOiBib29sZWFuLCBub3c6IEluc3RhbnQpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBkcmF3ID0gdGhpcy5pc0RyYXcoZWxlbWVudCwgbm93KTtcbiAgICAgICAgY29uc3QgaW5zdGFudCA9IGRyYXcgPyBlbGVtZW50LmZyb20gOiBlbGVtZW50LnRvO1xuICAgICAgICBjb25zdCBzaG91bGRBbmltYXRlID0gdGhpcy5zaG91bGRBbmltYXRlKGluc3RhbnQsIGFuaW1hdGUpO1xuICAgICAgICBjb25zdCByZXZlcnNlID0gb3ZlcnJpZGVSZXZlcnNlICE9IGluc3RhbnQuZmxhZy5pbmNsdWRlcygncmV2ZXJzZScpO1xuICAgICAgICBkZWxheSArPSBkcmF3XG4gICAgICAgICAgICA/IHRoaXMuZHJhd0VsZW1lbnQoZWxlbWVudCwgZGVsYXksIHNob3VsZEFuaW1hdGUsIHJldmVyc2UpXG4gICAgICAgICAgICA6IHRoaXMuZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlLCByZXZlcnNlKTtcbiAgICAgICAgdGhpcy56b29tZXIuaW5jbHVkZShlbGVtZW50LmJvdW5kaW5nQm94LCBlbGVtZW50LmZyb20sIGVsZW1lbnQudG8sIGRyYXcsIGFuaW1hdGUpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZHJhd0VsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTGluZSkge1xuICAgICAgICAgICAgdGhpcy5ncmF2aXRhdG9yLmFkZEVkZ2UoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZHJhdyhkZWxheSwgYW5pbWF0ZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5lcmFzZShkZWxheSwgYW5pbWF0ZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgc2hvdWxkQW5pbWF0ZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGluc3RhbnQuZmxhZy5pbmNsdWRlcygnbm9hbmltJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBhbmltYXRlO1xuICAgIH1cblxuICAgIGlzRXBvY2hFeGlzdGluZyhlcG9jaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdICE9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhZGRUb0luZGV4KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LmZyb20sIGVsZW1lbnQpO1xuICAgICAgICBpZiAoIUluc3RhbnQuQklHX0JBTkcuZXF1YWxzKGVsZW1lbnQudG8pKVxuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LnRvLCBlbGVtZW50KTtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBTdGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRpb25zW2VsZW1lbnQuaWRdID0gZWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U2xpZGVJbmRleEVsZW1lbnQoaW5zdGFudDogSW5zdGFudCwgZWxlbWVudDogVGltZWREcmF3YWJsZSk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9IHt9O1xuICAgICAgICBpZiAodGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdID0gW107XG4gICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0ucHVzaChlbGVtZW50KTtcbiAgICB9XG5cbiAgICBuZXh0SW5zdGFudChub3c6IEluc3RhbnQpOiBJbnN0YW50IHwgbnVsbCB7XG4gICAgICAgIGxldCBlcG9jaDogbnVtYmVyIHwgbnVsbCA9IG5vdy5lcG9jaDtcbiAgICAgICAgbGV0IHNlY29uZDogbnVtYmVyIHwgbnVsbCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LnNlY29uZCwgdGhpcy5zbGlkZUluZGV4W25vdy5lcG9jaF0pO1xuICAgICAgICBpZiAoc2Vjb25kID09IG51bGwpIHtcbiAgICAgICAgICAgIGVwb2NoID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZShub3cuZXBvY2gsIHRoaXMuc2xpZGVJbmRleCk7XG4gICAgICAgICAgICBpZiAoZXBvY2ggPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgc2Vjb25kID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZSgtMSwgdGhpcy5zbGlkZUluZGV4W2Vwb2NoXSk7XG4gICAgICAgICAgICBpZiAoc2Vjb25kID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQoZXBvY2gsIHNlY29uZCwgJycpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZpbmRTbWFsbGVzdEFib3ZlKHRocmVzaG9sZDogbnVtYmVyLCBkaWN0OiB7W2lkOiBudW1iZXJdOiBhbnl9KTogbnVtYmVyIHwgbnVsbCB7XG4gICAgICAgIGlmIChkaWN0ID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBsZXQgc21hbGxlc3QgPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkaWN0KSkge1xuICAgICAgICAgICAgaWYgKHBhcnNlSW50KGtleSkgPiB0aHJlc2hvbGQgJiYgKHNtYWxsZXN0ID09IG51bGwgfHwgcGFyc2VJbnQoa2V5KSA8IHNtYWxsZXN0KSkge1xuICAgICAgICAgICAgICAgIHNtYWxsZXN0ID0gcGFyc2VJbnQoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc21hbGxlc3Q7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTGluZUF0U3RhdGlvbiB9IGZyb20gXCIuL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJyZWRUcmFjayB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgaWYgKHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlID49IDAgPyAnKycgOiAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayhwcmVmaXggKyB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihhdFN0YXRpb246IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGF0U3RhdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhY2tOdW1iZXIoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tTnVtYmVyKGF0U3RhdGlvbi50cmFjayk7ICAgICAgICBcbiAgICB9XG5cbiAgICBrZWVwT25seVNpZ24oKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy52YWx1ZVswXTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayh2ID09ICctJyA/IHYgOiAnKycpO1xuICAgIH1cblxuICAgIGhhc1RyYWNrTnVtYmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGdldCB0cmFja051bWJlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy52YWx1ZS5yZXBsYWNlKCcqJywgJycpKVxuICAgIH1cblxuICAgIGlzUG9zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdICE9ICctJztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgICBwcml2YXRlIHN0YXRpYyBESVJTOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7J3N3JzogLTEzNSwgJ3cnOiAtOTAsICdudyc6IC00NSwgJ24nOiAwLCAnbmUnOiA0NSwgJ2UnOiA5MCwgJ3NlJzogMTM1LCAncyc6IDE4MH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWdyZWVzOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGRpcmVjdGlvbjogc3RyaW5nKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKFJvdGF0aW9uLkRJUlNbZGlyZWN0aW9uXSB8fCAwKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhSb3RhdGlvbi5ESVJTKSkge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2YWx1ZSwgdGhpcy5kZWdyZWVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG5cbiAgICBnZXQgZGVncmVlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVncmVlcztcbiAgICB9XG5cbiAgICBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzIC8gMTgwICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICBhZGQodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLmRlZ3JlZXMgKyB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGlmIChzdW0gPD0gLTE4MClcbiAgICAgICAgICAgIHN1bSArPSAzNjA7XG4gICAgICAgIGlmIChzdW0gPiAxODApXG4gICAgICAgICAgICBzdW0gLT0gMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHN1bSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBsZXQgYiA9IHRoYXQuZGVncmVlcztcbiAgICAgICAgbGV0IGRpc3QgPSBiLWE7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0KSA+IDE4MCkge1xuICAgICAgICAgICAgaWYgKGEgPCAwKVxuICAgICAgICAgICAgICAgIGEgKz0gMzYwO1xuICAgICAgICAgICAgaWYgKGIgPCAwKVxuICAgICAgICAgICAgICAgIGIgKz0gMzYwO1xuICAgICAgICAgICAgZGlzdCA9IGItYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpc3QpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBkaXIgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGlyLCAtOTApKVxuICAgICAgICAgICAgZGlyID0gMDtcbiAgICAgICAgZWxzZSBpZiAoZGlyIDwgLTkwKVxuICAgICAgICAgICAgZGlyICs9IDE4MDtcbiAgICAgICAgZWxzZSBpZiAoZGlyID4gOTApXG4gICAgICAgICAgICBkaXIgLT0gMTgwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpcik7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAlIDE4MCA9PSAwO1xuICAgIH1cblxuICAgIHF1YXJ0ZXJEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBjb25zdCBkZWcgPSBkZWx0YURpciA8IDAgPyBNYXRoLmNlaWwoKGRlbHRhRGlyLTQ1KS85MCkgOiBNYXRoLmZsb29yKChkZWx0YURpcis0NSkvOTApO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyo5MCk7XG4gICAgfVxuXG4gICAgaGFsZkRpcmVjdGlvbihyZWxhdGl2ZVRvOiBSb3RhdGlvbiwgc3BsaXRBeGlzOiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGxldCBkZWc7XG4gICAgICAgIGlmIChzcGxpdEF4aXMuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICAgICAgICBpZiAoZGVsdGFEaXIgPCAwICYmIGRlbHRhRGlyID49IC0xODApXG4gICAgICAgICAgICAgICAgZGVnID0gLTkwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDkwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgOTAgJiYgZGVsdGFEaXIgPj0gLTkwKVxuICAgICAgICAgICAgICAgIGRlZyA9IDA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVnID0gMTgwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKTtcbiAgICB9XG5cbiAgICBuZWFyZXN0Um91bmRlZEluRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBkaXJlY3Rpb246IG51bWJlcikge1xuICAgICAgICBjb25zdCBjZWlsZWRPckZsb29yZWRPcmllbnRhdGlvbiA9IHJlbGF0aXZlVG8ucm91bmQoZGlyZWN0aW9uKTtcbiAgICAgICAgY29uc3QgZGlmZmVyZW5jZUluT3JpZW50YXRpb24gPSBNYXRoLmFicyhjZWlsZWRPckZsb29yZWRPcmllbnRhdGlvbi5kZWdyZWVzIC0gdGhpcy5kZWdyZWVzKSAlIDkwO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQobmV3IFJvdGF0aW9uKE1hdGguc2lnbihkaXJlY3Rpb24pKmRpZmZlcmVuY2VJbk9yaWVudGF0aW9uKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByb3VuZChkaXJlY3Rpb246IG51bWJlcik6IFJvdGF0aW9uIHtcbiAgICAgICAgY29uc3QgZGVnID0gdGhpcy5kZWdyZWVzIC8gNDU7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oKGRpcmVjdGlvbiA+PSAwID8gTWF0aC5jZWlsKGRlZykgOiBNYXRoLmZsb29yKGRlZykpICogNDUpO1xuICAgIH1cblxuICAgIFxufSIsImV4cG9ydCBjbGFzcyBVdGlscyB7XG4gICAgc3RhdGljIHJlYWRvbmx5IElNUFJFQ0lTSU9OOiBudW1iZXIgPSAwLjAwMTtcblxuICAgIHN0YXRpYyBlcXVhbHMoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKSA8IFV0aWxzLklNUFJFQ0lTSU9OO1xuICAgIH1cblxuICAgIHN0YXRpYyB0cmlsZW1tYShpbnQ6IG51bWJlciwgb3B0aW9uczogW3N0cmluZywgc3RyaW5nLCBzdHJpbmddKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhpbnQsIDApKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1sxXTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnQgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1syXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uc1swXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWxwaGFiZXRpY0lkKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGEgPCBiKVxuICAgICAgICAgICAgcmV0dXJuIGEgKyAnXycgKyBiO1xuICAgICAgICByZXR1cm4gYiArICdfJyArIGE7XG4gICAgfVxuXG4gICAgc3RhdGljIGVhc2UoeDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB4IDwgMC41ID8gNCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAzKSAvIDI7XG4gICAgfVxufSIsImltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFZlY3RvciB7XG4gICAgc3RhdGljIFVOSVQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgLTEpO1xuICAgIHN0YXRpYyBOVUxMOiBWZWN0b3IgPSBuZXcgVmVjdG9yKDAsIDApO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIGdldCB4KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cblxuICAgIGdldCB5KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsIDIpICsgTWF0aC5wb3codGhpcy55LCAyKSk7XG4gICAgfVxuXG4gICAgd2l0aExlbmd0aChsZW5ndGg6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gdGhpcy5sZW5ndGggIT0gMCA/IGxlbmd0aC90aGlzLmxlbmd0aCA6IDA7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCpyYXRpbywgdGhpcy55KnJhdGlvKTtcbiAgICB9XG5cbiAgICBzaWduZWRMZW5ndGhQcm9qZWN0ZWRBdChkaXJlY3Rpb246IFJvdGF0aW9uKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcyA9IFZlY3Rvci5VTklULnJvdGF0ZShkaXJlY3Rpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kb3RQcm9kdWN0KHMpL3MuZG90UHJvZHVjdChzKTtcbiAgICB9XG5cbiAgICBhZGQodGhhdCA6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCArIHRoYXQueCwgdGhpcy55ICsgdGhhdC55KTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGF0LnggLSB0aGlzLngsIHRoYXQueSAtIHRoaXMueSk7XG4gICAgfVxuXG4gICAgcm90YXRlKHRoZXRhOiBSb3RhdGlvbik6IFZlY3RvciB7XG4gICAgICAgIGxldCByYWQ6IG51bWJlciA9IHRoZXRhLnJhZGlhbnM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCAqIE1hdGguY29zKHJhZCkgLSB0aGlzLnkgKiBNYXRoLnNpbihyYWQpLCB0aGlzLnggKiBNYXRoLnNpbihyYWQpICsgdGhpcy55ICogTWF0aC5jb3MocmFkKSk7XG4gICAgfVxuXG4gICAgZG90UHJvZHVjdCh0aGF0OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54KnRoYXQueCt0aGlzLnkqdGhhdC55O1xuICAgIH1cblxuICAgIHNvbHZlRGVsdGFGb3JJbnRlcnNlY3Rpb24oZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiB7YTogbnVtYmVyLCBiOiBudW1iZXJ9IHtcbiAgICAgICAgY29uc3QgZGVsdGE6IFZlY3RvciA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHN3YXBaZXJvRGl2aXNpb24gPSBVdGlscy5lcXVhbHMoZGlyMi55LCAwKTtcbiAgICAgICAgY29uc3QgeCA9IHN3YXBaZXJvRGl2aXNpb24gPyAneScgOiAneCc7XG4gICAgICAgIGNvbnN0IHkgPSBzd2FwWmVyb0RpdmlzaW9uID8gJ3gnIDogJ3knO1xuICAgICAgICBjb25zdCBkZW5vbWluYXRvciA9IChkaXIxW3ldKmRpcjJbeF0tZGlyMVt4XSpkaXIyW3ldKTtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhkZW5vbWluYXRvciwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7YTogTmFOLCBiOiBOYU59O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGEgPSAoZGVsdGFbeV0qZGlyMlt4XS1kZWx0YVt4XSpkaXIyW3ldKS9kZW5vbWluYXRvcjtcbiAgICAgICAgY29uc3QgYiA9IChhKmRpcjFbeV0tZGVsdGFbeV0pL2RpcjJbeV07XG4gICAgICAgIHJldHVybiB7YSwgYn07XG4gICAgfVxuXG4gICAgaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwoZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgYSA9IHRoaXMuYW5nbGUoZGlyMSkuZGVncmVlcztcbiAgICAgICAgY29uc3QgYiA9IGRpcjEuYW5nbGUoZGlyMikuZGVncmVlcztcbiAgICAgICAgcmV0dXJuIFV0aWxzLmVxdWFscyhhICUgMTgwLCAwKSAmJiBVdGlscy5lcXVhbHMoYiAlIDE4MCwgMCk7XG4gICAgfVxuXG4gICAgaW5jbGluYXRpb24oKTogUm90YXRpb24ge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueCwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueSA+IDAgPyAxODAgOiAwKTtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh0aGlzLnksIDApKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbih0aGlzLnggPiAwID8gOTAgOiAtOTApO1xuICAgICAgICBjb25zdCBhZGphY2VudCA9IG5ldyBWZWN0b3IoMCwtTWF0aC5hYnModGhpcy55KSk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oTWF0aC5zaWduKHRoaXMueCkqTWF0aC5hY29zKHRoaXMuZG90UHJvZHVjdChhZGphY2VudCkvYWRqYWNlbnQubGVuZ3RoL3RoaXMubGVuZ3RoKSoxODAvTWF0aC5QSSk7XG4gICAgfVxuXG4gICAgYW5nbGUob3RoZXI6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5jbGluYXRpb24oKS5kZWx0YShvdGhlci5pbmNsaW5hdGlvbigpKTtcbiAgICB9XG5cbiAgICBib3RoQXhpc01pbnMob3RoZXI6IFZlY3Rvcikge1xuICAgICAgICBpZiAodGhpcyA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgaWYgKG90aGVyID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCA8IG90aGVyLnggPyB0aGlzLnggOiBvdGhlci54LCB0aGlzLnkgPCBvdGhlci55ID8gdGhpcy55IDogb3RoZXIueSlcbiAgICB9XG5cbiAgICBib3RoQXhpc01heHMob3RoZXI6IFZlY3Rvcikge1xuICAgICAgICBpZiAodGhpcyA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgaWYgKG90aGVyID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCA+IG90aGVyLnggPyB0aGlzLnggOiBvdGhlci54LCB0aGlzLnkgPiBvdGhlci55ID8gdGhpcy55IDogb3RoZXIueSlcbiAgICB9XG5cbiAgICBiZXR3ZWVuKG90aGVyOiBWZWN0b3IsIHg6IG51bWJlcikge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuZGVsdGEob3RoZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgqeCkpO1xuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT0gb3RoZXIueCAmJiB0aGlzLnkgPT0gb3RoZXIueTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi9Cb3VuZGluZ0JveFwiO1xuXG5leHBvcnQgY2xhc3MgWm9vbWVyIHtcbiAgICBzdGF0aWMgWk9PTV9EVVJBVElPTiA9IDE7XG4gICAgc3RhdGljIFBBRERJTkdfRkFDVE9SID0gNDA7XG4gICAgXG4gICAgcHJpdmF0ZSBib3VuZGluZ0JveCA9IG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuICAgIHByaXZhdGUgY3VzdG9tRHVyYXRpb24gPSAtMTtcbiAgICBwcml2YXRlIHJlc2V0RmxhZyA9IGZhbHNlO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FudmFzU2l6ZTogQm91bmRpbmdCb3gsIHByaXZhdGUgem9vbU1heFNjYWxlID0gMykge1xuICAgIH1cblxuICAgIGluY2x1ZGUoYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94LCBmcm9tOiBJbnN0YW50LCB0bzogSW5zdGFudCwgZHJhdzogYm9vbGVhbiwgc2hvdWxkQW5pbWF0ZTogYm9vbGVhbiwgcGFkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBub3cgPSBkcmF3ID8gZnJvbSA6IHRvO1xuICAgICAgICBpZiAobm93LmZsYWcuaW5jbHVkZXMoJ2tlZXB6b29tJykpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRGbGFnID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXNldEZsYWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvUmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaG91bGRBbmltYXRlICYmICFub3cuZmxhZy5pbmNsdWRlcygnbm96b29tJykpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFkICYmICFib3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveCA9IHRoaXMucGFkZGVkQm91bmRpbmdCb3goYm91bmRpbmdCb3gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LnRsID0gdGhpcy5ib3VuZGluZ0JveC50bC5ib3RoQXhpc01pbnMoYm91bmRpbmdCb3gudGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3guYnIgPSB0aGlzLmJvdW5kaW5nQm94LmJyLmJvdGhBeGlzTWF4cyhib3VuZGluZ0JveC5icik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGVuZm9yY2VkQm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBpZiAoIXRoaXMuYm91bmRpbmdCb3guaXNOdWxsKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZGRlZEJvdW5kaW5nQm94ID0gdGhpcy5ib3VuZGluZ0JveDtcbiAgICAgICAgICAgIGNvbnN0IHpvb21TaXplID0gcGFkZGVkQm91bmRpbmdCb3guZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1NpemUgPSB0aGlzLmNhbnZhc1NpemUuZGltZW5zaW9ucztcbiAgICAgICAgICAgIGNvbnN0IG1pblpvb21TaXplID0gbmV3IFZlY3RvcihjYW52YXNTaXplLnggLyB0aGlzLnpvb21NYXhTY2FsZSwgY2FudmFzU2l6ZS55IC8gdGhpcy56b29tTWF4U2NhbGUpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSB6b29tU2l6ZS5kZWx0YShtaW5ab29tU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsU3BhY2luZyA9IG5ldyBWZWN0b3IoTWF0aC5tYXgoMCwgZGVsdGEueC8yKSwgTWF0aC5tYXgoMCwgZGVsdGEueS8yKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goXG4gICAgICAgICAgICAgICAgcGFkZGVkQm91bmRpbmdCb3gudGwuYWRkKGFkZGl0aW9uYWxTcGFjaW5nLnJvdGF0ZShuZXcgUm90YXRpb24oMTgwKSkpLFxuICAgICAgICAgICAgICAgIHBhZGRlZEJvdW5kaW5nQm94LmJyLmFkZChhZGRpdGlvbmFsU3BhY2luZylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmRpbmdCb3g7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYWRkZWRCb3VuZGluZ0JveChib3VuZGluZ0JveDogQm91bmRpbmdCb3gpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IHBhZGRpbmcgPSBab29tZXIuUEFERElOR19GQUNUT1IqTWF0aC5taW4odGhpcy56b29tTWF4U2NhbGUsIDgpO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFxuICAgICAgICAgICAgYm91bmRpbmdCb3gudGwuYWRkKG5ldyBWZWN0b3IoLXBhZGRpbmcsIC1wYWRkaW5nKSksXG4gICAgICAgICAgICBib3VuZGluZ0JveC5ici5hZGQobmV3IFZlY3RvcihwYWRkaW5nLCBwYWRkaW5nKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgY2VudGVyKCk6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKCFlbmZvcmNlZEJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnggKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLngpLzIpLCBcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnkgKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLnkpLzIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXNTaXplLnRsLmJldHdlZW4odGhpcy5jYW52YXNTaXplLmJyLCAwLjUpO1xuICAgIH1cblxuICAgIGdldCBzY2FsZSgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBlbmZvcmNlZEJvdW5kaW5nQm94ID0gdGhpcy5lbmZvcmNlZEJvdW5kaW5nQm94KCk7XG4gICAgICAgIGlmICghZW5mb3JjZWRCb3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBlbmZvcmNlZEJvdW5kaW5nQm94LmRpbWVuc2lvbnM7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKGRlbHRhLnggLyB6b29tU2l6ZS54LCBkZWx0YS55IC8gem9vbVNpemUueSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgZ2V0IGR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmN1c3RvbUR1cmF0aW9uID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tRHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1Jlc2V0KCkge1xuICAgICAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIHRoaXMuY3VzdG9tRHVyYXRpb24gPSAtMTtcbiAgICAgICAgdGhpcy5yZXNldEZsYWcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucmVzZXRGbGFnID0gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBib3VuZGluZ0JveDogQm91bmRpbmdCb3g7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIF9mcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgcHJpdmF0ZSBfdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgcHJpdmF0ZSBfbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIHByaXZhdGUgX2JvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXI7XG5cbiAgICBhYnN0cmFjdCBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyO1xuXG59IiwiaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlLCBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEdlbmVyaWNUaW1lZERyYXdhYmxlIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIpIHtcbiAgICAgICAgc3VwZXIoYWRhcHRlcik7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksICFhbmltYXRlID8gMCA6IHRoaXMuYWRhcHRlci5mcm9tLmRlbHRhKHRoaXMuYWRhcHRlci50bykpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuLi9ab29tZXJcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlLCBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2VuSW1hZ2VBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgem9vbTogVmVjdG9yO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBLZW5JbWFnZSBleHRlbmRzIEFic3RyYWN0VGltZWREcmF3YWJsZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYWRhcHRlcjogS2VuSW1hZ2VBZGFwdGVyKSB7XG4gICAgICAgIHN1cGVyKGFkYXB0ZXIpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHpvb21lciA9IG5ldyBab29tZXIodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgICAgIHpvb21lci5pbmNsdWRlKHRoaXMuZ2V0Wm9vbWVkQm91bmRpbmdCb3goKSwgSW5zdGFudC5CSUdfQkFORywgSW5zdGFudC5CSUdfQkFORywgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgIWFuaW1hdGUgPyAwIDogdGhpcy5hZGFwdGVyLmZyb20uZGVsdGEodGhpcy5hZGFwdGVyLnRvKSwgem9vbWVyLmNlbnRlciwgem9vbWVyLnNjYWxlKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Wm9vbWVkQm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBiYm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuYWRhcHRlci56b29tO1xuICAgICAgICBpZiAoY2VudGVyICE9IFZlY3Rvci5OVUxMKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tQmJveCA9IGJib3guY2FsY3VsYXRlQm91bmRpbmdCb3hGb3Jab29tKGNlbnRlci54LCBjZW50ZXIueSk7XG4gICAgICAgICAgICByZXR1cm4gem9vbUJib3g7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJib3g7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlLCBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFiZWxBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgZm9yU3RhdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGZvckxpbmU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbiwgY2hpbGRyZW46IExhYmVsQWRhcHRlcltdKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyO1xufVxuXG5leHBvcnQgY2xhc3MgTGFiZWwgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBMQUJFTF9IRUlHSFQgPSAxMjtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBMYWJlbEFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgc3VwZXIoYWRhcHRlcik7XG4gICAgfVxuXG4gICAgY2hpbGRyZW46IExhYmVsW10gPSBbXTtcblxuICAgIGhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiB8fCB0aGlzLmFkYXB0ZXIuZm9yTGluZSB8fCAnJztcbiAgICB9XG4gICAgXG4gICAgZ2V0IGZvclN0YXRpb24oKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiB8fCAnJyk7XG4gICAgICAgIGlmIChzID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyLmZvclN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5mb3JTdGF0aW9uO1xuICAgICAgICAgICAgc3RhdGlvbi5hZGRMYWJlbCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChzdGF0aW9uLmxpbmVzRXhpc3RpbmcoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZvclN0YXRpb24oZGVsYXksIHN0YXRpb24sIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFkYXB0ZXIuZm9yTGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlcm1pbmkgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMuYWRhcHRlci5mb3JMaW5lKS50ZXJtaW5pO1xuICAgICAgICAgICAgdGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh0LnN0YXRpb25JZCk7XG4gICAgICAgICAgICAgICAgaWYgKHMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzLmxhYmVscy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGwuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbC5kcmF3KGRlbGF5LCBhbmltYXRlKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdMYWJlbEZvclN0YXRpb24gPSBuZXcgTGFiZWwodGhpcy5hZGFwdGVyLmNsb25lRm9yU3RhdGlvbihzLmlkKSwgdGhpcy5zdGF0aW9uUHJvdmlkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGFiZWxGb3JTdGF0aW9uLmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmFkZExhYmVsKG5ld0xhYmVsRm9yU3RhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2gobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgVmVjdG9yLk5VTEwsIFJvdGF0aW9uLmZyb20oJ24nKSwgW10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0ZvclN0YXRpb24oZGVsYXlTZWNvbmRzOiBudW1iZXIsIHN0YXRpb246IFN0YXRpb24sIGZvckxpbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgYmFzZUNvb3JkID0gc3RhdGlvbi5iYXNlQ29vcmRzO1xuICAgICAgICBsZXQgeU9mZnNldCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxzdGF0aW9uLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbCA9IHN0YXRpb24ubGFiZWxzW2ldO1xuICAgICAgICAgICAgaWYgKGwgPT0gdGhpcylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHlPZmZzZXQgKz0gTGFiZWwuTEFCRUxfSEVJR0hUKjEuNTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYWJlbERpciA9IHN0YXRpb24ubGFiZWxEaXI7XG5cbiAgICAgICAgeU9mZnNldCA9IE1hdGguc2lnbihWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpLnkpKnlPZmZzZXQgLSAoeU9mZnNldD4wID8gMiA6IDApOyAvL1RPRE8gbWFnaWMgbnVtYmVyc1xuICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gc3RhdGlvbi5yb3RhdGlvbjtcbiAgICAgICAgY29uc3QgZGlmZkRpciA9IGxhYmVsRGlyLmFkZChuZXcgUm90YXRpb24oLXN0YXRpb25EaXIuZGVncmVlcykpO1xuICAgICAgICBjb25zdCB1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShkaWZmRGlyKTtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gbmV3IFZlY3RvcihzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneCcsIHVuaXR2LngpLCBzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneScsIHVuaXR2LnkpKTtcbiAgICAgICAgY29uc3QgdGV4dENvb3JkcyA9IGJhc2VDb29yZC5hZGQoYW5jaG9yLnJvdGF0ZShzdGF0aW9uRGlyKSkuYWRkKG5ldyBWZWN0b3IoMCwgeU9mZnNldCkpO1xuICAgIFxuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIHRleHRDb29yZHMsIGxhYmVsRGlyLCB0aGlzLmNoaWxkcmVuLm1hcChjID0+IGMuYWRhcHRlcikpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyLmZvclN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZvclN0YXRpb24ucmVtb3ZlTGFiZWwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgIGMuZXJhc2UoZGVsYXksIGFuaW1hdGUsIHJldmVyc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4uL05ldHdvcmtcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi9VdGlsc1wiO1xuaW1wb3J0IHsgUHJlZmVycmVkVHJhY2sgfSBmcm9tIFwiLi4vUHJlZmVycmVkVHJhY2tcIjtcbmltcG9ydCB7IEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIsIEFic3RyYWN0VGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmVBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciAge1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgd2VpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgdG90YWxMZW5ndGg6IG51bWJlcjtcbiAgICB0ZXJtaW5pOiBWZWN0b3JbXTtcbiAgICBzcGVlZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGFuaW1PcmRlcjogUm90YXRpb24gfCB1bmRlZmluZWQ7XG4gICAgYmVja1N0eWxlOiBib29sZWFuO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBwYXRoOiBWZWN0b3JbXSwgbGVuZ3RoOiBudW1iZXIsIGNvbG9yRGV2aWF0aW9uOiBudW1iZXIpOiB2b2lkO1xuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCBjb2xvckZyb206IG51bWJlciwgY29sb3JUbzogbnVtYmVyKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4sIGxlbmd0aDogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIExpbmUgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBOT0RFX0RJU1RBTkNFID0gMDtcbiAgICBzdGF0aWMgU1BFRUQgPSAxMDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYWRhcHRlcjogTGluZUFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIsIHByaXZhdGUgYmVja1N0eWxlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihhZGFwdGVyKTtcbiAgICB9XG5cbiAgICB3ZWlnaHQgPSB0aGlzLmFkYXB0ZXIud2VpZ2h0O1xuICAgIGFuaW1PcmRlciA9IHRoaXMuYWRhcHRlci5hbmltT3JkZXI7XG4gICAgXG4gICAgcHJpdmF0ZSBwcmVjZWRpbmdTdG9wOiBTdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgcHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIF9wYXRoOiBWZWN0b3JbXSA9IFtdO1xuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCEodGhpcy5hZGFwdGVyLnRvdGFsTGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGluZShkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBsZXQgZHVyYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHRoaXMuX3BhdGgsIGFuaW1hdGUpO1xuICAgICAgICBjb25zdCBsaW5lR3JvdXAgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSk7XG4gICAgICAgIGxpbmVHcm91cC5hZGRMaW5lKHRoaXMpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgZHVyYXRpb24sIHJldmVyc2UsIHRoaXMuX3BhdGgsIHRoaXMuZ2V0VG90YWxMZW5ndGgodGhpcy5fcGF0aCksIGxpbmVHcm91cC5zdHJva2VDb2xvcik7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSwgY29sb3JEZXZpYXRpb246IG51bWJlcikge1xuICAgICAgICBsZXQgb2xkUGF0aCA9IHRoaXMuX3BhdGg7XG4gICAgICAgIGlmIChvbGRQYXRoLmxlbmd0aCA8IDIgfHwgcGF0aC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RyeWluZyB0byBtb3ZlIGEgbm9uLWV4aXN0aW5nIGxpbmUnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkUGF0aC5sZW5ndGggIT0gcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIG9sZFBhdGggPSBbb2xkUGF0aFswXSwgb2xkUGF0aFtvbGRQYXRoLmxlbmd0aC0xXV07XG4gICAgICAgICAgICBwYXRoID0gW3BhdGhbMF0sIHBhdGhbcGF0aC5sZW5ndGgtMV1dO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpbmVHcm91cCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5fcGF0aCwgcGF0aCwgbGluZUdyb3VwLnN0cm9rZUNvbG9yLCBjb2xvckRldmlhdGlvbik7XG4gICAgICAgIGxpbmVHcm91cC5zdHJva2VDb2xvciA9IGNvbG9yRGV2aWF0aW9uO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLl9wYXRoLCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSwgZHVyYXRpb24sIHJldmVyc2UsIHRoaXMuZ2V0VG90YWxMZW5ndGgodGhpcy5fcGF0aCkpO1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPHN0b3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5uYW1lICsgJzogU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgc3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgc3RvcC5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wSWQgPSAnaF8nICsgVXRpbHMuYWxwaGFiZXRpY0lkKHN0b3BzW2otMV0uc3RhdGlvbklkLCBzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIGxldCBoZWxwU3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGhlbHBTdG9wSWQpO1xuICAgICAgICAgICAgICAgIGlmIChoZWxwU3RvcCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVscFN0b3AucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTGluZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5fcGF0aDtcblxuICAgICAgICBsZXQgdHJhY2sgPSBuZXcgUHJlZmVycmVkVHJhY2soJysnKTtcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPHN0b3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0cmFjayA9IHRyYWNrLmZyb21TdHJpbmcoc3RvcHNbal0udHJhY2tJbmZvKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLm5hbWUgKyAnOiBTdGF0aW9uIHdpdGggSUQgJyArIHN0b3BzW2pdLnN0YXRpb25JZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICBpZiAocGF0aC5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICB0cmFjayA9IHRyYWNrLmZyb21FeGlzdGluZ0xpbmVBdFN0YXRpb24oc3RvcC5heGlzQW5kVHJhY2tGb3JFeGlzdGluZ0xpbmUodGhpcy5uYW1lKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN0b3BzW2pdLmNvb3JkID0gdGhpcy5jcmVhdGVDb25uZWN0aW9uKHN0b3AsIHRoaXMubmV4dFN0b3BCYXNlQ29vcmQoc3RvcHMsIGosIHN0b3AuYmFzZUNvb3JkcyksIHRyYWNrLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgdHJ1ZSk7XG4gICAgICAgICAgICB0cmFjayA9IHRyYWNrLmtlZXBPbmx5U2lnbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0U3RvcEJhc2VDb29yZChzdG9wczogU3RvcFtdLCBjdXJyZW50U3RvcEluZGV4OiBudW1iZXIsIGRlZmF1bHRDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICBpZiAoY3VycmVudFN0b3BJbmRleCsxIDwgc3RvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHN0b3BzW2N1cnJlbnRTdG9wSW5kZXgrMV0uc3RhdGlvbklkO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5uYW1lICsgJzogU3RhdGlvbiB3aXRoIElEICcgKyBpZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gc3RvcC5iYXNlQ29vcmRzOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0Q29vcmRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCB0cmFjazogUHJlZmVycmVkVHJhY2ssIHBhdGg6IFZlY3RvcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZWN1cnNlOiBib29sZWFuKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgZGlyID0gc3RhdGlvbi5yb3RhdGlvbjtcbiAgICAgICAgY29uc3QgYmFzZUNvb3JkID0gc3RhdGlvbi5iYXNlQ29vcmRzO1xuICAgICAgICBjb25zdCBuZXdEaXIgPSB0aGlzLmdldFN0b3BPcmllbnRhdGlvbkJhc2VkT25UaHJlZVN0b3BzKHN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkLCBkaXIsIHBhdGgpO1xuICAgICAgICBjb25zdCBuZXdQb3MgPSBzdGF0aW9uLmFzc2lnblRyYWNrKG5ld0Rpci5pc1ZlcnRpY2FsKCkgPyAneCcgOiAneScsIHRyYWNrLCB0aGlzKTtcblxuICAgICAgICBjb25zdCBuZXdDb29yZCA9IHN0YXRpb24ucm90YXRlZFRyYWNrQ29vcmRpbmF0ZXMobmV3RGlyLCBuZXdQb3MpO1xuICAgIFxuICAgICAgICBpZiAocGF0aC5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBwYXRoW3BhdGgubGVuZ3RoLTFdO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSB0aGlzLmdldFByZWNlZGluZ0Rpcih0aGlzLnByZWNlZGluZ0RpciwgdGhpcy5wcmVjZWRpbmdTdG9wLCBvbGRDb29yZCwgbmV3Q29vcmQpO1xuICAgIFxuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbkRpciA9IG5ld0Rpci5hZGQoZGlyKTtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gdGhpcy5pbnNlcnROb2RlKG9sZENvb3JkLCB0aGlzLnByZWNlZGluZ0RpciwgbmV3Q29vcmQsIHN0YXRpb25EaXIsIHBhdGgpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFmb3VuZCAmJiByZWN1cnNlICYmIHRoaXMucHJlY2VkaW5nU3RvcCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWxwU3RvcCA9IHRoaXMuZ2V0T3JDcmVhdGVIZWxwZXJTdG9wKHRoaXMucHJlY2VkaW5nRGlyLCB0aGlzLnByZWNlZGluZ1N0b3AsIHN0YXRpb24pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gdGhpcy5wcmVjZWRpbmdEaXIuYWRkKG5ldyBSb3RhdGlvbigxODApKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oaGVscFN0b3AsIGJhc2VDb29yZCwgdHJhY2sua2VlcE9ubHlTaWduKCksIHBhdGgsIGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybigncGF0aCB0byBmaXggb24gbGluZScsIHRoaXMuYWRhcHRlci5uYW1lLCAnYXQgc3RhdGlvbicsIHN0YXRpb24uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSBzdGF0aW9uRGlyO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpb24uYWRkTGluZSh0aGlzLCBuZXdEaXIuaXNWZXJ0aWNhbCgpID8gJ3gnIDogJ3knLCBuZXdQb3MpO1xuICAgICAgICBwYXRoLnB1c2gobmV3Q29vcmQpO1xuXG4gICAgICAgIGRlbGF5ID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKSArIGRlbGF5O1xuICAgICAgICBzdGF0aW9uLmRyYXcoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLnByZWNlZGluZ1N0b3AgPSBzdGF0aW9uO1xuICAgICAgICByZXR1cm4gbmV3Q29vcmQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCBkaXI6IFJvdGF0aW9uLCBwYXRoOiBWZWN0b3JbXSk6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RvcEJhc2VDb29yZC5kZWx0YShvbGRDb29yZCkuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsdGEgPSBzdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEobmV4dFN0b3BCYXNlQ29vcmQpO1xuICAgICAgICBjb25zdCBleGlzdGluZ0F4aXMgPSBzdGF0aW9uLmF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpPy5heGlzO1xuICAgICAgICBpZiAoZXhpc3RpbmdBeGlzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdTdG9wT3JpZW50aWF0aW9uID0gZGVsdGEuaW5jbGluYXRpb24oKS5oYWxmRGlyZWN0aW9uKGRpciwgZXhpc3RpbmdBeGlzID09ICd4JyA/IG5ldyBSb3RhdGlvbig5MCkgOiBuZXcgUm90YXRpb24oMCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlY2VkaW5nRGlyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gZXhpc3RpbmdTdG9wT3JpZW50aWF0aW9uLmFkZChkaXIpLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdTdG9wT3JpZW50aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWx0YS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24oZGlyKTtcbiAgICB9XG4gICAgXG5cbiAgICBwcml2YXRlIGdldFByZWNlZGluZ0RpcihwcmVjZWRpbmdEaXI6IFJvdGF0aW9uIHwgdW5kZWZpbmVkLCBwcmVjZWRpbmdTdG9wOiBTdGF0aW9uIHwgdW5kZWZpbmVkLCBvbGRDb29yZDogVmVjdG9yLCBuZXdDb29yZDogVmVjdG9yKTogUm90YXRpb24ge1xuICAgICAgICBpZiAocHJlY2VkaW5nRGlyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgcHJlY2VkaW5nU3RvcFJvdGF0aW9uID0gcHJlY2VkaW5nU3RvcD8ucm90YXRpb24gPz8gbmV3IFJvdGF0aW9uKDApO1xuICAgICAgICAgICAgcHJlY2VkaW5nRGlyID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihwcmVjZWRpbmdTdG9wUm90YXRpb24pLmFkZChwcmVjZWRpbmdTdG9wUm90YXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJlY2VkaW5nRGlyID0gcHJlY2VkaW5nRGlyLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZWNlZGluZ0RpcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluc2VydE5vZGUoZnJvbUNvb3JkOiBWZWN0b3IsIGZyb21EaXI6IFJvdGF0aW9uLCB0b0Nvb3JkOiBWZWN0b3IsIHRvRGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmJlY2tTdHlsZSB8fCAhdGhpcy5hZGFwdGVyLmJlY2tTdHlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsdGE6IFZlY3RvciA9IGZyb21Db29yZC5kZWx0YSh0b0Nvb3JkKTtcbiAgICAgICAgY29uc3Qgb2xkRGlyViA9IFZlY3Rvci5VTklULnJvdGF0ZShmcm9tRGlyKTtcbiAgICAgICAgY29uc3QgbmV3RGlyViA9IFZlY3Rvci5VTklULnJvdGF0ZSh0b0Rpcik7XG4gICAgICAgIGlmIChkZWx0YS5pc0RlbHRhTWF0Y2hpbmdQYXJhbGxlbChvbGREaXJWLCBuZXdEaXJWKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSBkZWx0YS5zb2x2ZURlbHRhRm9ySW50ZXJzZWN0aW9uKG9sZERpclYsIG5ld0RpclYpXG4gICAgICAgIGlmIChzb2x1dGlvbi5hID4gTGluZS5OT0RFX0RJU1RBTkNFICYmIHNvbHV0aW9uLmIgPiBMaW5lLk5PREVfRElTVEFOQ0UpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChuZXcgVmVjdG9yKGZyb21Db29yZC54K29sZERpclYueCpzb2x1dGlvbi5hLCBmcm9tQ29vcmQueStvbGREaXJWLnkqc29sdXRpb24uYSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3JDcmVhdGVIZWxwZXJTdG9wKGZyb21EaXI6IFJvdGF0aW9uLCBmcm9tU3RvcDogU3RhdGlvbiwgdG9TdG9wOiBTdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGhlbHBTdG9wSWQgPSAnaF8nICsgVXRpbHMuYWxwaGFiZXRpY0lkKGZyb21TdG9wLmlkLCB0b1N0b3AuaWQpO1xuICAgICAgICBsZXQgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChoZWxwU3RvcElkKTtcbiAgICAgICAgaWYgKGhlbHBTdG9wID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBmcm9tU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgbmV3Q29vcmQgPSB0b1N0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3Q29vcmQuZGVsdGEob2xkQ29vcmQpO1xuICAgICAgICAgICAgY29uc3QgZGVnID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVEaXIgPSBmcm9tU3RvcC5yb3RhdGlvbi5uZWFyZXN0Um91bmRlZEluRGlyZWN0aW9uKGRlZywgZnJvbURpci5kZWx0YShkZWcpLmRlZ3JlZXMpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJtZWRpYXRlQ29vcmQgPSBkZWx0YS53aXRoTGVuZ3RoKGRlbHRhLmxlbmd0aC8yKS5hZGQobmV3Q29vcmQpO1xuXG4gICAgICAgICAgICBoZWxwU3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmNyZWF0ZVZpcnR1YWxTdG9wKGhlbHBTdG9wSWQsIGludGVybWVkaWF0ZUNvb3JkLCBpbnRlcm1lZGlhdGVEaXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoZWxwU3RvcDtcbiAgICB9XG5cbiAgICBnZXQgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHRoaXMuX3BhdGgsIHRydWUpO1xuICAgIH1cblxuICAgIGdldCBzcGVlZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnNwZWVkIHx8IExpbmUuU1BFRUQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBbmltYXRpb25EdXJhdGlvbihwYXRoOiBWZWN0b3JbXSwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSAvIHRoaXMuc3BlZWQ7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0VG90YWxMZW5ndGgocGF0aDogVmVjdG9yW10pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBhY3R1YWxMZW5ndGggPSB0aGlzLmFkYXB0ZXIudG90YWxMZW5ndGg7XG4gICAgICAgIGlmIChhY3R1YWxMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0dWFsTGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8cGF0aC5sZW5ndGgtMTsgaSsrKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gcGF0aFtpXS5kZWx0YShwYXRoW2krMV0pLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFN0b3BbXSB7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBpZiAoc3RvcHMubGVuZ3RoID09IDApIFxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gW3N0b3BzWzBdLCBzdG9wc1tzdG9wcy5sZW5ndGgtMV1dO1xuICAgIH1cblxuICAgIGdldCBwYXRoKCk6IFZlY3RvcltdIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhdGgubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudGVybWluaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcbiAgICB9XG5cbiAgICBnZXRTdG9wKHN0YXRpb25JZDogc3RyaW5nKTogU3RvcCB8IG51bGwge1xuICAgICAgICBmb3IgKGNvbnN0IHN0b3Agb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmFkYXB0ZXIuc3RvcHMpKSB7XG4gICAgICAgICAgICBpZiAoc3RvcC5zdGF0aW9uSWQgPT0gc3RhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4uL1ByZWZlcnJlZFRyYWNrXCI7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gXCIuL0xhYmVsXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlLCBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGlvbkFkYXB0ZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIHtcbiAgICBiYXNlQ29vcmRzOiBWZWN0b3I7XG4gICAgcm90YXRpb246IFJvdGF0aW9uO1xuICAgIGxhYmVsRGlyOiBSb3RhdGlvbjtcbiAgICBpZDogc3RyaW5nO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGlvbklkOiBzdHJpbmcsIHB1YmxpYyB0cmFja0luZm86IHN0cmluZykge1xuXG4gICAgfVxuXG4gICAgcHVibGljIGNvb3JkOiBWZWN0b3IgfCBudWxsID0gbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQXRTdGF0aW9uIHtcbiAgICBsaW5lPzogTGluZTtcbiAgICBheGlzOiBzdHJpbmc7XG4gICAgdHJhY2s6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBMSU5FX0RJU1RBTkNFID0gNjtcbiAgICBzdGF0aWMgREVGQVVMVF9TVE9QX0RJTUVOID0gMTA7XG4gICAgc3RhdGljIExBQkVMX0RJU1RBTkNFID0gMDtcblxuICAgIHByaXZhdGUgZXhpc3RpbmdMaW5lczoge1tpZDogc3RyaW5nXTogTGluZUF0U3RhdGlvbltdfSA9IHt4OiBbXSwgeTogW119O1xuICAgIHByaXZhdGUgZXhpc3RpbmdMYWJlbHM6IExhYmVsW10gPSBbXTtcbiAgICBwcml2YXRlIHBoYW50b20/OiBMaW5lQXRTdGF0aW9uID0gdW5kZWZpbmVkO1xuICAgIHJvdGF0aW9uID0gdGhpcy5hZGFwdGVyLnJvdGF0aW9uO1xuICAgIGxhYmVsRGlyID0gdGhpcy5hZGFwdGVyLmxhYmVsRGlyO1xuICAgIGlkID0gdGhpcy5hZGFwdGVyLmlkO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFkYXB0ZXI6IFN0YXRpb25BZGFwdGVyKSB7XG4gICAgICAgIHN1cGVyKGFkYXB0ZXIpO1xuICAgIH1cblxuICAgIGdldCBiYXNlQ29vcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgc2V0IGJhc2VDb29yZHMoYmFzZUNvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzID0gYmFzZUNvb3JkcztcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKSB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3godGhpcy5hZGFwdGVyLmJhc2VDb29yZHMsIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzKTtcbiAgICB9XG5cbiAgICBhZGRMaW5lKGxpbmU6IExpbmUsIGF4aXM6IHN0cmluZywgdHJhY2s6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBoYW50b20gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMaW5lc1theGlzXS5wdXNoKHtsaW5lOiBsaW5lLCBheGlzOiBheGlzLCB0cmFjazogdHJhY2t9KTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy54KTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy55KTtcbiAgICB9XG5cbiAgICBhZGRMYWJlbChsYWJlbDogTGFiZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmV4aXN0aW5nTGFiZWxzLmluY2x1ZGVzKGxhYmVsKSlcbiAgICAgICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmV4aXN0aW5nTGFiZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMYWJlbHNbaV0gPT0gbGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxhYmVscygpOiBMYWJlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhpc3RpbmdMYWJlbHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVMaW5lQXRBeGlzKGxpbmU6IExpbmUsIGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiB2b2lkIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLmxpbmUgPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGhhbnRvbSA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nTGluZXNGb3JBeGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKGxpbmVOYW1lOiBzdHJpbmcpOiBMaW5lQXRTdGF0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIGlmICh4ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgICAgIGlmICh5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZTogc3RyaW5nLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lPy5uYW1lID09IGxpbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXNzaWduVHJhY2soYXhpczogc3RyaW5nLCBwcmVmZXJyZWRUcmFjazogUHJlZmVycmVkVHJhY2ssIGxpbmU6IExpbmUpOiBudW1iZXIgeyBcbiAgICAgICAgaWYgKHByZWZlcnJlZFRyYWNrLmhhc1RyYWNrTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay50cmFja051bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5waGFudG9tPy5saW5lPy5uYW1lID09IGxpbmUubmFtZSAmJiB0aGlzLnBoYW50b20/LmF4aXMgPT0gYXhpcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGhhbnRvbT8udHJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzKClbYXhpc107XG4gICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay5pc1Bvc2l0aXZlKCkgPyBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzFdICsgMSA6IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXNbMF0gLSAxO1xuICAgIH1cblxuICAgIHJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKGluY29taW5nRGlyOiBSb3RhdGlvbiwgYXNzaWduZWRUcmFjazogbnVtYmVyKTogVmVjdG9yIHsgXG4gICAgICAgIGxldCBuZXdDb29yZDogVmVjdG9yO1xuICAgICAgICBpZiAoaW5jb21pbmdEaXIuZGVncmVlcyAlIDE4MCA9PSAwKSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoMCwgYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Q29vcmQgPSBuZXdDb29yZC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgICAgIG5ld0Nvb3JkID0gdGhpcy5iYXNlQ29vcmRzLmFkZChuZXdDb29yZCk7XG4gICAgICAgIHJldHVybiBuZXdDb29yZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllcygpOiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzLngpLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy55KVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMoZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbMSwgLTFdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgbGV0IHJpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0gZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVmdCA+IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbGVmdCwgcmlnaHRdO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcztcbiAgICAgICAgdGhpcy5leGlzdGluZ0xhYmVscy5mb3JFYWNoKGwgPT4gbC5kcmF3KGRlbGF5U2Vjb25kcywgZmFsc2UpKTtcbiAgICAgICAgY29uc3QgdCA9IHN0YXRpb24ucG9zaXRpb25Cb3VuZGFyaWVzKCk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5U2Vjb25kcywgZnVuY3Rpb24oKSB7IHJldHVybiB0OyB9KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHRvOiBWZWN0b3IpIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5U2Vjb25kcywgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCB0aGlzLmJhc2VDb29yZHMsIHRvLCAoKSA9PiBzdGF0aW9uLmV4aXN0aW5nTGFiZWxzLmZvckVhY2gobCA9PiBsLmRyYXcoMCwgZmFsc2UpKSk7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXlTZWNvbmRzKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgc3RhdGlvblNpemVGb3JBeGlzKGF4aXM6IHN0cmluZywgdmVjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZlY3RvciwgMCkpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY29uc3QgZGlyID0gTWF0aC5zaWduKHZlY3Rvcik7XG4gICAgICAgIGxldCBkaW1lbiA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10pW3ZlY3RvciA8IDAgPyAwIDogMV07XG4gICAgICAgIGlmIChkaXIqZGltZW4gPCAwKSB7XG4gICAgICAgICAgICBkaW1lbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgZGlyICogKFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOICsgU3RhdGlvbi5MQUJFTF9ESVNUQU5DRSk7XG4gICAgfVxuXG4gICAgbGluZXNFeGlzdGluZygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMaW5lcy54Lmxlbmd0aCA+IDAgfHwgdGhpcy5leGlzdGluZ0xpbmVzLnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4uL05ldHdvcmtcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IEFycml2YWxEZXBhcnR1cmVUaW1lIH0gZnJvbSBcIi4uL0Fycml2YWxEZXBhcnR1cmVUaW1lXCI7XG5pbXBvcnQgeyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyLCBBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9BYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUcmFpbkFkYXB0ZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIHtcbiAgICBzdG9wczogU3RvcFtdO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIGZvbGxvdzoge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9KTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZm9sbG93OiB7cGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlcn0pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFRyYWluIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBUcmFpbkFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgc3VwZXIoYWRhcHRlcik7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgbGluZUdyb3VwID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpXG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBpZiAoc3RvcHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHJhaW4gXCIgKyB0aGlzLm5hbWUgKyBcIiBuZWVkcyBhdCBsZWFzdCAyIHN0b3BzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MTsgaTxzdG9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJyZGVwID0gbmV3IEFycml2YWxEZXBhcnR1cmVUaW1lKHN0b3BzW2ldLnRyYWNrSW5mbyk7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbGluZUdyb3VwLmdldFBhdGhCZXR3ZWVuKHN0b3BzW2ktMV0uc3RhdGlvbklkLCBzdG9wc1tpXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIGFuaW1hdGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheSArIGFycmRlcC5kZXBhcnR1cmUgLSB0aGlzLmZyb20uc2Vjb25kLCBhcnJkZXAuYXJyaXZhbCAtIGFycmRlcC5kZXBhcnR1cmUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IodGhpcy5uYW1lICsgJzogTm8gcGF0aCBmb3VuZCBiZXR3ZWVuICcgKyBzdG9wc1tpLTFdLnN0YXRpb25JZCArICcgJyArIHN0b3BzW2ldLnN0YXRpb25JZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufSIsImltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9zdmcvU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL3N2Zy9TdmdBbmltYXRvclwiO1xuaW1wb3J0IHsgRHJhd2FibGVTb3J0ZXIgfSBmcm9tIFwiLi9EcmF3YWJsZVNvcnRlclwiO1xuXG5sZXQgdGltZVBhc3NlZCA9IDA7XG5cbmNvbnN0IG5ldHdvcms6IE5ldHdvcmsgPSBuZXcgTmV0d29yayhuZXcgU3ZnTmV0d29yaygpLCBuZXcgRHJhd2FibGVTb3J0ZXIoKSk7XG5jb25zdCBhbmltYXRlRnJvbUluc3RhbnQ6IEluc3RhbnQgPSBnZXRTdGFydEluc3RhbnQoKTtcbmxldCBzdGFydGVkID0gZmFsc2U7XG5cbmlmIChuZXR3b3JrLmF1dG9TdGFydCkge1xuICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgIHN0YXJ0VHJhbnNwb3J0TmV0d29ya0FuaW1hdG9yKCk7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0VHJhbnNwb3J0TmV0d29ya0FuaW1hdG9yJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChzdGFydGVkKSB7XG4gICAgICAgIGNvbnNvbGUud2FybigndHJhbnNwb3J0LW5ldHdvcmstYW5pbWF0b3IgYWxyZWFkeSBzdGFydGVkLiBZb3Ugc2hvdWxkIHByb2JhYmx5IHNldCBkYXRhLWF1dG8tc3RhcnQ9XCJmYWxzZVwiLiBTdGFydGluZyBhbnl3YXlzLicpXG4gICAgfVxuICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgIHN0YXJ0VHJhbnNwb3J0TmV0d29ya0FuaW1hdG9yKCk7XG59KTtcblxuZnVuY3Rpb24gc3RhcnRUcmFuc3BvcnROZXR3b3JrQW5pbWF0b3IoKSB7XG4gICAgbmV0d29yay5pbml0aWFsaXplKCk7ICAgIFxuICAgIHNsaWRlKEluc3RhbnQuQklHX0JBTkcsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gZ2V0U3RhcnRJbnN0YW50KCk6IEluc3RhbnQge1xuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgIGNvbnN0IGFuaW1hdGVGcm9tSW5zdGFudDogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpLnNwbGl0KCctJyk7XG4gICAgICAgIGNvbnN0IGluc3RhbnQgPSBuZXcgSW5zdGFudChwYXJzZUludChhbmltYXRlRnJvbUluc3RhbnRbMF0pIHx8IDAsIHBhcnNlSW50KGFuaW1hdGVGcm9tSW5zdGFudFsxXSkgfHwgMCwgJycpO1xuICAgICAgICBjb25zb2xlLmxvZygnZmFzdCBmb3J3YXJkIHRvJywgaW5zdGFudCk7XG4gICAgICAgIHJldHVybiBpbnN0YW50O1xuICAgIH1cbiAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbn1cblxuZnVuY3Rpb24gc2xpZGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpbnN0YW50ICE9IEluc3RhbnQuQklHX0JBTkcgJiYgaW5zdGFudC5lcG9jaCA+PSBhbmltYXRlRnJvbUluc3RhbnQuZXBvY2ggJiYgaW5zdGFudC5zZWNvbmQgPj0gYW5pbWF0ZUZyb21JbnN0YW50LnNlY29uZClcbiAgICAgICAgYW5pbWF0ZSA9IHRydWU7XG5cbiAgICBjb25zb2xlLmxvZyhpbnN0YW50LCAndGltZTogJyArIE1hdGguZmxvb3IodGltZVBhc3NlZCAvIDYwKSArICc6JyArIHRpbWVQYXNzZWQgJSA2MCk7XG5cbiAgICBuZXR3b3JrLmRyYXdUaW1lZERyYXdhYmxlc0F0KGluc3RhbnQsIGFuaW1hdGUpO1xuICAgIGNvbnN0IG5leHQgPSBuZXR3b3JrLm5leHRJbnN0YW50KGluc3RhbnQpO1xuICAgIFxuICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gaW5zdGFudC5kZWx0YShuZXh0KTtcbiAgICAgICAgdGltZVBhc3NlZCArPSBkZWx0YTtcbiAgICAgICAgY29uc3QgZGVsYXkgPSBhbmltYXRlID8gZGVsdGEgOiAwO1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5KjEwMDAsICgpID0+IHNsaWRlKG5leHQsIGFuaW1hdGUpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9BYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSBpbXBsZW1lbnRzIEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1lbnQ6IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBsQm94ID0gdGhpcy5lbGVtZW50LmdldEJCb3goKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tYWJsZScpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgem9vbWFibGUgPSA8U1ZHR3JhcGhpY3NFbGVtZW50PiA8dW5rbm93bj4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3pvb21hYmxlJyk7XG4gICAgICAgICAgICBjb25zdCB6UmVjdCA9IHpvb21hYmxlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgekJveCA9IHpvb21hYmxlLmdldEJCb3goKTtcbiAgICAgICAgICAgIGNvbnN0IGxSZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgelNjYWxlID0gekJveC53aWR0aC96UmVjdC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHggPSAobFJlY3QueC16UmVjdC54KSp6U2NhbGUrekJveC54O1xuICAgICAgICAgICAgY29uc3QgeSA9IChsUmVjdC55LXpSZWN0LnkpKnpTY2FsZSt6Qm94Lnk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KG5ldyBWZWN0b3IoeCwgeSksIG5ldyBWZWN0b3IoeCtsUmVjdC53aWR0aCp6U2NhbGUsIHkrbFJlY3QuaGVpZ2h0KnpTY2FsZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3RvcihsQm94LngsIGxCb3gueSksIG5ldyBWZWN0b3IobEJveC54K2xCb3gud2lkdGgsIGxCb3gueStsQm94LmhlaWdodCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBbmltYXRvciB9IGZyb20gXCIuLi9BbmltYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnQW5pbWF0b3IgZXh0ZW5kcyBBbmltYXRvciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbm93KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGltZW91dChjYWxsYmFjazogKCkgPT4gdm9pZCwgZGVsYXlNaWxsaXNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgZGVsYXlNaWxsaXNlY29uZHMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXF1ZXN0RnJhbWUoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmxvY2FsTmFtZSA9PSAnZycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQubG9jYWxOYW1lID09ICdnJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3ZnQW5pbWF0b3IgfSBmcm9tIFwiLi9TdmdBbmltYXRvclwiO1xuaW1wb3J0IHsgS2VuSW1hZ2VBZGFwdGVyIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9JbWFnZVwiO1xuaW1wb3J0IHsgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnS2VuSW1hZ2UgZXh0ZW5kcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBLZW5JbWFnZUFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1lbnQ6IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3RvcihyLngsIHIueSksIG5ldyBWZWN0b3Ioci54K3Iud2lkdGgsIHIueStyLmhlaWdodCkpO1xuICAgIH1cblxuICAgIGdldCB6b29tKCk6IFZlY3RvciB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFsnem9vbSddICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbJ3pvb20nXS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VJbnQoY2VudGVyWzBdKSB8fCA1MCwgcGFyc2VJbnQoY2VudGVyWzFdKSB8fCA1MCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFZlY3Rvci5OVUxMO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzKjEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9tQ2VudGVyID0gdGhpcy5ib3VuZGluZ0JveC50bC5iZXR3ZWVuKHRoaXMuYm91bmRpbmdCb3guYnIsIDAuNSlcbiAgICAgICAgICAgICAgICBhbmltYXRvclxuICAgICAgICAgICAgICAgICAgICAuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMqMTAwMCwgKHgsIGlzTGFzdCkgPT4gdGhpcy5hbmltYXRlRnJhbWUoeCwgaXNMYXN0LCBmcm9tQ2VudGVyLCB6b29tQ2VudGVyLCAxLCB6b29tU2NhbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4sIGZyb21DZW50ZXI6IFZlY3RvciwgdG9DZW50ZXI6IFZlY3RvciwgZnJvbVNjYWxlOiBudW1iZXIsIHRvU2NhbGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWlzTGFzdCkge1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBmcm9tQ2VudGVyLmRlbHRhKHRvQ2VudGVyKVxuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlY3RvcihkZWx0YS54ICogeCwgZGVsdGEueSAqIHgpLmFkZChmcm9tQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gKHRvU2NhbGUgLSBmcm9tU2NhbGUpICogeCArIGZyb21TY2FsZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbShjZW50ZXIsIHNjYWxlKTsgICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbSh0b0NlbnRlciwgdG9TY2FsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGNlbnRlcjogVmVjdG9yLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHpvb21hYmxlID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBpZiAoem9vbWFibGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJldHdlZW4odGhpcy5ib3VuZGluZ0JveC5iciwgMC41KTtcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IG9yaWdpbi54ICsgJ3B4ICcgKyBvcmlnaW4ueSArICdweCc7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlICsgJykgdHJhbnNsYXRlKCcgKyAob3JpZ2luLnggLSBjZW50ZXIueCkgKyAncHgsJyArIChvcmlnaW4ueSAtIGNlbnRlci55KSArICdweCknO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbEFkYXB0ZXIsIExhYmVsIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9MYWJlbFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vVXRpbHNcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgU3ZnQW5pbWF0b3IgfSBmcm9tIFwiLi9TdmdBbmltYXRvclwiO1xuaW1wb3J0IHsgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdMYWJlbCBleHRlbmRzIFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSBpbXBsZW1lbnRzIExhYmVsQWRhcHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudDogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIGdldCBmb3JTdGF0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uO1xuICAgIH1cblxuICAgIGdldCBmb3JMaW5lKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5ib3VuZGluZ0JveDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGV4dENvb3JkcyAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29vcmQodGhpcy5lbGVtZW50LCB0ZXh0Q29vcmRzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdMaW5lTGFiZWxzKGxhYmVsRGlyLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYW5zbGF0ZShib3hEaW1lbjogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgbGFiZWx1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShsYWJlbERpcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di54LCBbLWJveERpbWVuLnggKyAncHgnLCAtYm94RGltZW4ueC8yICsgJ3B4JywgJzBweCddKVxuICAgICAgICAgICAgKyAnLCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di55LCBbLUxhYmVsLkxBQkVMX0hFSUdIVCArICdweCcsIC1MYWJlbC5MQUJFTF9IRUlHSFQvMiArICdweCcsICcwcHgnXSkgLy8gVE9ETyBtYWdpYyBudW1iZXJzXG4gICAgICAgICAgICArICcpJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVscyhsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICBpZiAoYyBpbnN0YW5jZW9mIFN2Z0xhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3TGluZUxhYmVsKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC9NYXRoLm1heCh0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCAxKTtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3RvcihiYm94LndpZHRoL3NjYWxlLCBiYm94LmhlaWdodC9zY2FsZSksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMaW5lTGFiZWwobGFiZWw6IFN2Z0xhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxpbmVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcsICdkaXYnKTtcbiAgICAgICAgbGluZUxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsLmNsYXNzTmFtZXM7XG4gICAgICAgIGxpbmVMYWJlbC5pbm5lckhUTUwgPSBsYWJlbC50ZXh0O1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQobGluZUxhYmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTdGF0aW9uTGFiZWwobGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdmb3Itc3RhdGlvbicpKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgZm9yLXN0YXRpb24nO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZG9taW5hbnRCYXNlbGluZSA9ICdoYW5naW5nJztcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3Rvcih0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLmhlaWdodCksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGdldCBjbGFzc05hbWVzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKyAnICcgKyB0aGlzLmZvckxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyIHtcbiAgICAgICAgY29uc3QgbGluZUxhYmVsOiBTVkdHcmFwaGljc0VsZW1lbnQgPSA8U1ZHR3JhcGhpY3NFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgICAgICBsaW5lTGFiZWwuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBmb3ItbGluZSc7XG4gICAgICAgIGxpbmVMYWJlbC5kYXRhc2V0LnN0YXRpb24gPSBzdGF0aW9uSWQ7XG4gICAgICAgIGxpbmVMYWJlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgICBsaW5lTGFiZWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZW1lbnRzJyk/LmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgICAgIHJldHVybiBuZXcgU3ZnTGFiZWwobGluZUxhYmVsKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBMaW5lQWRhcHRlciB9IGZyb20gXCIuLi9kcmF3YWJsZXMvTGluZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuLi9kcmF3YWJsZXMvU3RhdGlvblwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFN2Z0FuaW1hdG9yIH0gZnJvbSBcIi4vU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3ZnVXRpbHMgfSBmcm9tIFwiLi9TdmdVdGlsc1wiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xpbmUgZXh0ZW5kcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBMaW5lQWRhcHRlciB7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG4gICAgcHJpdmF0ZSBfYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdQYXRoRWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQubGluZSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRpbmdCb3g7XG4gICAgfVxuXG4gICAgZ2V0IHdlaWdodCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQud2VpZ2h0ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQud2VpZ2h0KTtcbiAgICB9XG5cbiAgICBnZXQgYmVja1N0eWxlKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuYmVja1N0eWxlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LmJlY2tTdHlsZSAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGdldCB0b3RhbExlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgfVxuXG4gICAgZ2V0IHRlcm1pbmkoKTogVmVjdG9yW10ge1xuICAgICAgICBjb25zdCBkID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZCcpO1xuICAgICAgICByZXR1cm4gU3ZnVXRpbHMucmVhZFRlcm1pbmkoZCB8fCB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIGdldCBhbmltT3JkZXIoKTogUm90YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuYW5pbU9yZGVyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUm90YXRpb24uZnJvbSh0aGlzLmVsZW1lbnQuZGF0YXNldC5hbmltT3JkZXIpO1xuICAgIH1cblxuICAgIGdldCBzcGVlZCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuc3BlZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmVsZW1lbnQuZGF0YXNldC5zcGVlZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVCb3VuZGluZ0JveChwYXRoOiBWZWN0b3JbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBiID0gc3VwZXIuYm91bmRpbmdCb3g7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nQm94LnRsID0gYi50bDtcbiAgICAgICAgdGhpcy5fYm91bmRpbmdCb3guYnIgPSBiLmJyO1xuICAgIH1cblxuICAgIGdldCBzdG9wcygpOiBTdG9wW10ge1xuICAgICAgICBpZiAodGhpcy5fc3RvcHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3BzID0gU3ZnVXRpbHMucmVhZFN0b3BzKHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0b3BzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcHM7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4sIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlciwgY29sb3JEZXZpYXRpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB0aGlzLmNyZWF0ZVBhdGgocGF0aCk7XG4gICAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3gocGF0aCk7XG5cbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMgKiAxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBsaW5lICcgKyB0aGlzLm5hbWU7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheShsZW5ndGgpO1xuICAgICAgICAgICAgaWYgKGNvbG9yRGV2aWF0aW9uICE9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbG9yKGNvbG9yRGV2aWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSByZXZlcnNlID8gLTEgOiAxO1xuICAgICAgICAgICAgYW5pbWF0b3JcbiAgICAgICAgICAgICAgICAuZnJvbShsZW5ndGgqZGlyZWN0aW9uKVxuICAgICAgICAgICAgICAgIC50bygwKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyAqIDEwMDAsICh4OiBudW1iZXIsIGlzTGFzdDogYm9vbGVhbikgPT4gdGhpcy5hbmltYXRlRnJhbWUoeCwgaXNMYXN0KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCBjb2xvckZyb206IG51bWJlciwgY29sb3JUbzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3godG8pO1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBhbmltYXRvci5hbmltYXRlKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyoxMDAwLCAoeCwgaXNMYXN0KSA9PiB0aGlzLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgY29sb3JGcm9tLCBjb2xvclRvLCB4LCBpc0xhc3QpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBsZW5ndGg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyAqIDEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBmcm9tID0gMDtcbiAgICAgICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgICAgIGZyb20gPSBsZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSByZXZlcnNlID8gLTEgOiAxO1xuICAgICAgICAgICAgYW5pbWF0b3JcbiAgICAgICAgICAgICAgICAuZnJvbShmcm9tKVxuICAgICAgICAgICAgICAgIC50byhsZW5ndGgqZGlyZWN0aW9uKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyoxMDAwLCAoeCwgaXNMYXN0KSA9PiB0aGlzLmFuaW1hdGVGcmFtZSh4LCBpc0xhc3QpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVQYXRoKHBhdGg6IFZlY3RvcltdKSB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZCA9ICdNJyArIHBhdGgubWFwKHYgPT4gdi54KycsJyt2LnkpLmpvaW4oJyBMJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2QnLCBkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZURhc2hhcnJheShsZW5ndGg6IG51bWJlcikge1xuICAgICAgICBsZXQgZGFzaGVkUGFydCA9IGxlbmd0aCArICcnO1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbCA9IGdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KS5zdHJva2VEYXNoYXJyYXkucmVwbGFjZSgvW14wLTlcXHMsXSsvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcHJlc2V0QXJyYXkgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbC5zcGxpdCgvW1xccyxdKy8pO1xuICAgICAgICAgICAgaWYgKHByZXNldEFycmF5Lmxlbmd0aCAlIDIgPT0gMSlcbiAgICAgICAgICAgICAgICBwcmVzZXRBcnJheSA9IHByZXNldEFycmF5LmNvbmNhdChwcmVzZXRBcnJheSk7XG4gICAgICAgICAgICBjb25zdCBwcmVzZXRMZW5ndGggPSBwcmVzZXRBcnJheS5tYXAoYSA9PiBwYXJzZUludChhKSB8fCAwKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcbiAgICAgICAgICAgIGRhc2hlZFBhcnQgPSBuZXcgQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHByZXNldExlbmd0aCArIDEpKS5qb2luKHByZXNldEFycmF5LmpvaW4oJyAnKSArICcgJykgKyAnMCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hhcnJheSA9IGRhc2hlZFBhcnQgKyAnICcgKyBsZW5ndGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVDb2xvcihkZXZpYXRpb246IG51bWJlcikge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlID0gJ3JnYignICsgTWF0aC5tYXgoMCwgZGV2aWF0aW9uKSAqIDI1NiArICcsIDAsICcgKyBNYXRoLm1pbigwLCBkZXZpYXRpb24pICogLTI1NiArICcpJztcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSB4ICsgJyc7XG4gICAgICAgIGlmIChpc0xhc3QgJiYgeCAhPSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10sIGNvbG9yRnJvbTogbnVtYmVyLCBjb2xvclRvOiBudW1iZXIsIHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXNMYXN0KSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZWQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVkLnB1c2goZnJvbVtpXS5iZXR3ZWVuKHRvW2ldLCB4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheShpbnRlcnBvbGF0ZWRbMF0uZGVsdGEoaW50ZXJwb2xhdGVkW2ludGVycG9sYXRlZC5sZW5ndGgtMV0pLmxlbmd0aCk7IC8vIFRPRE8gYXJiaXRyYXJ5IG5vZGUgY291bnRcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGF0aChpbnRlcnBvbGF0ZWQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDb2xvcigoY29sb3JUby1jb2xvckZyb20pKngrY29sb3JGcm9tKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KHRvWzBdLmRlbHRhKHRvW3RvLmxlbmd0aC0xXSkubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGF0aCh0byk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSIsImltcG9ydCB7IE5ldHdvcmtBZGFwdGVyLCBOZXR3b3JrLCBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuLi9kcmF3YWJsZXMvVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBTdmdMaW5lIH0gZnJvbSBcIi4vU3ZnTGluZVwiO1xuaW1wb3J0IHsgU3ZnU3RhdGlvbiB9IGZyb20gXCIuL1N2Z1N0YXRpb25cIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9MYWJlbFwiO1xuaW1wb3J0IHsgU3ZnTGFiZWwgfSBmcm9tIFwiLi9TdmdMYWJlbFwiO1xuaW1wb3J0IHsgR2VuZXJpY1RpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdmdHZW5lcmljVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBab29tZXIgfSBmcm9tIFwiLi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBUcmFpbiB9IGZyb20gXCIuLi9kcmF3YWJsZXMvVHJhaW5cIjtcbmltcG9ydCB7IFN2Z1RyYWluIH0gZnJvbSBcIi4vU3ZnVHJhaW5cIjtcbmltcG9ydCB7IFN2Z0FuaW1hdG9yIH0gZnJvbSBcIi4vU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IFN2Z0tlbkltYWdlIH0gZnJvbSBcIi4vU3ZnSW1hZ2VcIjtcbmltcG9ydCB7IEtlbkltYWdlIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9JbWFnZVwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTmV0d29yayBpbXBsZW1lbnRzIE5ldHdvcmtBZGFwdGVyIHtcblxuICAgIHN0YXRpYyBTVkdOUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcblxuICAgIHByaXZhdGUgY3VycmVudFpvb21DZW50ZXI6IFZlY3RvciA9IFZlY3Rvci5OVUxMO1xuICAgIHByaXZhdGUgY3VycmVudFpvb21TY2FsZTogbnVtYmVyID0gMTtcblxuICAgIGdldCBjYW52YXNTaXplKCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIGNvbnN0IGJveCA9IHN2Zz8udmlld0JveC5iYXNlVmFsO1xuICAgICAgICBpZiAoYm94KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KG5ldyBWZWN0b3IoYm94LngsIGJveC55KSwgbmV3IFZlY3Rvcihib3gueCtib3gud2lkdGgsIGJveC55K2JveC5oZWlnaHQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgfVxuXG4gICAgZ2V0IGF1dG9TdGFydCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIHJldHVybiBzdmc/LmRhdGFzZXQuYXV0b1N0YXJ0ICE9ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgZ2V0IHpvb21NYXhTY2FsZSgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgICAgaWYgKHN2Zz8uZGF0YXNldC56b29tTWF4U2NhbGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChzdmc/LmRhdGFzZXQuem9vbU1heFNjYWxlKTtcbiAgICB9XG5cbiAgICBnZXQgYmVja1N0eWxlKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgICAgcmV0dXJuIHN2Zz8uZGF0YXNldC5iZWNrU3R5bGUgIT0gJ2ZhbHNlJztcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKG5ldHdvcms6IE5ldHdvcmspOiB2b2lkIHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVsZW1lbnRzXCIpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0EgZ3JvdXAgd2l0aCB0aGUgaWQgXCJlbGVtZW50c1wiIGlzIG1pc3NpbmcgaW4gdGhlIFNWRyBzb3VyY2UuIEl0IG1pZ2h0IGJlIG5lZWRlZCBmb3IgaGVscGVyIHN0YXRpb25zIGFuZCBsYWJlbHMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUgfCBudWxsID0gdGhpcy5taXJyb3JFbGVtZW50KGVsZW1lbnRzW2ldLCBuZXR3b3JrKTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXR3b3JrLmFkZFRvSW5kZXgoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1pcnJvckVsZW1lbnQoZWxlbWVudDogYW55LCBuZXR3b3JrOiBTdGF0aW9uUHJvdmlkZXIpOiBUaW1lZERyYXdhYmxlIHwgbnVsbCB7XG4gICAgICAgIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAncGF0aCcgJiYgZWxlbWVudC5kYXRhc2V0LmxpbmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpbmUobmV3IFN2Z0xpbmUoZWxlbWVudCksIG5ldHdvcmssIHRoaXMuYmVja1N0eWxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAncGF0aCcgJiYgZWxlbWVudC5kYXRhc2V0LnRyYWluICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUcmFpbihuZXcgU3ZnVHJhaW4oZWxlbWVudCksIG5ldHdvcmspO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdyZWN0JyAmJiBlbGVtZW50LmRhdGFzZXQuc3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RhdGlvbihuZXcgU3ZnU3RhdGlvbihlbGVtZW50KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExhYmVsKG5ldyBTdmdMYWJlbChlbGVtZW50KSwgbmV0d29yayk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ2ltYWdlJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBLZW5JbWFnZShuZXcgU3ZnS2VuSW1hZ2UoZWxlbWVudCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuZGF0YXNldC5mcm9tICE9IHVuZGVmaW5lZCB8fCBlbGVtZW50LmRhdGFzZXQudG8gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEdlbmVyaWNUaW1lZERyYXdhYmxlKG5ldyBTdmdHZW5lcmljVGltZWREcmF3YWJsZShlbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgaGVscFN0b3AgPSA8U1ZHUmVjdEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAncmVjdCcpO1xuICAgICAgICBoZWxwU3RvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGlvbicsIGlkKTtcbiAgICAgICAgaGVscFN0b3Auc2V0QXR0cmlidXRlKCdkYXRhLWRpcicsIHJvdGF0aW9uLm5hbWUpO1xuICAgICAgICB0aGlzLnNldENvb3JkKGhlbHBTdG9wLCBiYXNlQ29vcmRzKTtcbiAgICAgICAgaGVscFN0b3AuY2xhc3NOYW1lLmJhc2VWYWwgPSAnaGVscGVyJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZW1lbnRzJyk/LmFwcGVuZENoaWxkKGhlbHBTdG9wKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGhlbHBTdG9wKSk7ICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdlcG9jaCcsIHsgZGV0YWlsOiBlcG9jaCB9KTtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIFxuICAgICAgICBsZXQgZXBvY2hMYWJlbDtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXBvY2hMYWJlbCA9IDxTVkdUZXh0RWxlbWVudD4gPHVua25vd24+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpO1xuICAgICAgICAgICAgZXBvY2hMYWJlbC50ZXh0Q29udGVudCA9IGVwb2NoOyAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgIFxuICAgIHpvb21Ubyh6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBjb25zdCBkZWZhdWx0QmVoYXZpb3VyID0gYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzIDw9IFpvb21lci5aT09NX0RVUkFUSU9OO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlZmF1bHRCZWhhdmlvdXIgPyAwIDogWm9vbWVyLlpPT01fRFVSQVRJT04gKiAxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Wm9vbUNlbnRlciA9IHRoaXMuY3VycmVudFpvb21DZW50ZXI7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Wm9vbVNjYWxlID0gdGhpcy5jdXJyZW50Wm9vbVNjYWxlO1xuICAgICAgICAgICAgYW5pbWF0b3JcbiAgICAgICAgICAgICAgICAuZWFzZShkZWZhdWx0QmVoYXZpb3VyID8gU3ZnQW5pbWF0b3IuRUFTRV9DVUJJQyA6IFN2Z0FuaW1hdG9yLkVBU0VfTk9ORSlcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMgKiAxMDAwLCAoeCwgaXNMYXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lKHgsIGlzTGFzdCwgY3VycmVudFpvb21DZW50ZXIsIHpvb21DZW50ZXIsIGN1cnJlbnRab29tU2NhbGUsIHpvb21TY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Wm9vbUNlbnRlciA9IHpvb21DZW50ZXI7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRab29tU2NhbGUgPSB6b29tU2NhbGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lKHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuLCBmcm9tQ2VudGVyOiBWZWN0b3IsIHRvQ2VudGVyOiBWZWN0b3IsIGZyb21TY2FsZTogbnVtYmVyLCB0b1NjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFpc0xhc3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gZnJvbUNlbnRlci5kZWx0YSh0b0NlbnRlcilcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIHgsIGRlbHRhLnkgKiB4KS5hZGQoZnJvbUNlbnRlcik7XG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9ICh0b1NjYWxlIC0gZnJvbVNjYWxlKSAqIHggKyBmcm9tU2NhbGU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20oY2VudGVyLCBzY2FsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20odG9DZW50ZXIsIHRvU2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGNlbnRlcjogVmVjdG9yLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHpvb21hYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3pvb21hYmxlJyk7XG4gICAgICAgIGlmICh6b29tYWJsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuY2FudmFzU2l6ZS50bC5iZXR3ZWVuKHRoaXMuY2FudmFzU2l6ZS5iciwgMC41KTtcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IG9yaWdpbi54ICsgJ3B4ICcgKyBvcmlnaW4ueSArICdweCc7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlICsgJykgdHJhbnNsYXRlKCcgKyAob3JpZ2luLnggLSBjZW50ZXIueCkgKyAncHgsJyArIChvcmlnaW4ueSAtIGNlbnRlci55KSArICdweCknO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU3RhdGlvbkFkYXB0ZXIsIFN0YXRpb24gfSBmcm9tIFwiLi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1N0YXRpb24gZXh0ZW5kcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBTdGF0aW9uQWRhcHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudDogU1ZHUmVjdEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gbmVlZHMgdG8gaGF2ZSBhIGRhdGEtc3RhdGlvbiBpZGVudGlmaWVyJyk7XG4gICAgfVxuXG4gICAgZ2V0IGJhc2VDb29yZHMoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd4JykgfHwgJycpIHx8IDAsIHBhcnNlRmxvYXQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneScpIHx8ICcnKSB8fCAwKTtcbiAgICB9XG5cbiAgICBzZXQgYmFzZUNvb3JkcyhiYXNlQ29vcmRzOiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGJhc2VDb29yZHMueCArICcnKTsgXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBiYXNlQ29vcmRzLnkgKyAnJyk7IFxuICAgIH1cblxuICAgIGdldCByb3RhdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRpciB8fCAnbicpO1xuICAgIH1cbiAgICBnZXQgbGFiZWxEaXIoKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gUm90YXRpb24uZnJvbSh0aGlzLmVsZW1lbnQuZGF0YXNldC5sYWJlbERpciB8fCAnbicpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzID0gZ2V0UG9zaXRpb25Cb3VuZGFyaWVzKCk7XG4gICAgICAgICAgICBjb25zdCBzdG9wRGltZW4gPSBbcG9zaXRpb25Cb3VuZGFyaWVzLnhbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgcG9zaXRpb25Cb3VuZGFyaWVzLnlbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueVswXV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdzdGF0aW9uJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBzdGF0aW9uICcgKyB0aGlzLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBzdG9wRGltZW5bMF0gPCAwICYmIHN0b3BEaW1lblsxXSA8IDAgPyAnaGlkZGVuJyA6ICd2aXNpYmxlJztcbiAgICBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKE1hdGgubWF4KHN0b3BEaW1lblswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAoTWF0aC5tYXgoc3RvcERpbWVuWzFdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCdyb3RhdGUoJyArIHRoaXMucm90YXRpb24uZGVncmVlcyArICcpIHRyYW5zbGF0ZSgnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnLCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnlbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcpJyk7XG4gICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtT3JpZ2luKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgdGhpcy5iYXNlQ29vcmRzLnggKyAnICcgKyB0aGlzLmJhc2VDb29yZHMueSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgYW5pbWF0b3JcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMqMTAwMCwgKHgsIGlzTGFzdCkgPT4gdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoeCwgaXNMYXN0LCBmcm9tLCB0bywgY2FsbGJhY2spKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWVWZWN0b3IoeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4sIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFpc0xhc3QpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZUNvb3JkcyA9IGZyb20uYmV0d2Vlbih0bywgeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VDb29yZHMgPSB0bztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuLi9kcmF3YWJsZXMvU3RhdGlvblwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFRyYWluQWRhcHRlciB9IGZyb20gXCIuLi9kcmF3YWJsZXMvVHJhaW5cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IFN2Z1V0aWxzIH0gZnJvbSBcIi4vU3ZnVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1RyYWluIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgVHJhaW5BZGFwdGVyIHtcbiAgICBzdGF0aWMgV0FHT05fTEVOR1RIID0gMTA7XG4gICAgc3RhdGljIFRSQUNLX09GRlNFVCA9IDA7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnRyYWluIHx8ICcnO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9wcyA9IFN2Z1V0aWxzLnJlYWRTdG9wcyh0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3BzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIGZvbGxvdzogeyBwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgdHJhaW4nO1xuICAgICAgICB0aGlzLnNldFBhdGgodGhpcy5jYWxjVHJhaW5IaW5nZXModGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdykubGVuZ3RoVG9TdGFydCwgZm9sbG93LnBhdGgpKTtcblxuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgfSk7ICAgICAgICBcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZm9sbG93OiB7IHBhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIgfSkge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXRoTGVuZ3RoID0gdGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdyk7XG5cbiAgICAgICAgICAgIGFuaW1hdG9yXG4gICAgICAgICAgICAgICAgLmVhc2UoU3ZnQW5pbWF0b3IuRUFTRV9TSU5FKVxuICAgICAgICAgICAgICAgIC5mcm9tKHBhdGhMZW5ndGgubGVuZ3RoVG9TdGFydClcbiAgICAgICAgICAgICAgICAudG8ocGF0aExlbmd0aC5sZW5ndGhUb1N0YXJ0K3BhdGhMZW5ndGgudG90YWxCb3VuZGVkTGVuZ3RoKVxuICAgICAgICAgICAgICAgIC50aW1lUGFzc2VkKGRlbGF5U2Vjb25kcyA8IDAgPyAoLWRlbGF5U2Vjb25kcyoxMDAwKSA6IDApXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzKjEwMDAsICh4LCBpc0xhc3QpID0+IHRoaXMuYW5pbWF0ZUZyYW1lKHgsIGZvbGxvdy5wYXRoKSk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UGF0aExlbmd0aChmb2xsb3c6IHsgcGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlciB9KTogeyBsZW5ndGhUb1N0YXJ0OiBudW1iZXIsIHRvdGFsQm91bmRlZExlbmd0aDogbnVtYmVyIH0ge1xuICAgICAgICBsZXQgbGVuZ3RoVG9TdGFydCA9IDA7XG4gICAgICAgIGxldCB0b3RhbEJvdW5kZWRMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvbGxvdy5wYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbCA9IGZvbGxvdy5wYXRoW2ldLmRlbHRhKGZvbGxvdy5wYXRoW2kgKyAxXSkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGkgPCBmb2xsb3cuZnJvbSkge1xuICAgICAgICAgICAgICAgIGxlbmd0aFRvU3RhcnQgKz0gbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IGZvbGxvdy50bykge1xuICAgICAgICAgICAgICAgIHRvdGFsQm91bmRlZExlbmd0aCArPSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGxlbmd0aFRvU3RhcnQ6IGxlbmd0aFRvU3RhcnQsIHRvdGFsQm91bmRlZExlbmd0aDogdG90YWxCb3VuZGVkTGVuZ3RoIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQb3NpdGlvbkJ5TGVuZ3RoKGN1cnJlbnQ6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiBWZWN0b3Ige1xuICAgICAgICBsZXQgdGhyZXNoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBwYXRoW2ldLmRlbHRhKHBhdGhbaSArIDFdKTtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBkZWx0YS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodGhyZXNoICsgbCA+PSBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGhbaV0uYmV0d2VlbihwYXRoW2kgKyAxXSwgKGN1cnJlbnQgLSB0aHJlc2gpIC8gbCkuYWRkKGRlbHRhLnJvdGF0ZShuZXcgUm90YXRpb24oOTApKS53aXRoTGVuZ3RoKFN2Z1RyYWluLlRSQUNLX09GRlNFVCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyZXNoICs9IGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFBhdGgocGF0aDogVmVjdG9yW10pIHtcbiAgICAgICAgY29uc3QgZCA9ICdNJyArIHBhdGgubWFwKHYgPT4gdi54ICsgJywnICsgdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjVHJhaW5IaW5nZXMoZnJvbnQ6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiBWZWN0b3JbXSB7XG4gICAgICAgIGNvbnN0IG5ld1RyYWluOiBWZWN0b3JbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoICsgMTsgaSsrKSB7XG4gICAgICAgICAgICBuZXdUcmFpbi5wdXNoKHRoaXMuZ2V0UG9zaXRpb25CeUxlbmd0aChmcm9udCAtIGkgKiBTdmdUcmFpbi5XQUdPTl9MRU5HVEgsIHBhdGgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VHJhaW47XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoeDogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB0cmFpblBhdGggPSB0aGlzLmNhbGNUcmFpbkhpbmdlcyh4LCBwYXRoKTtcbiAgICAgICAgdGhpcy5zZXRQYXRoKHRyYWluUGF0aCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdVdGlscyB7XG5cbiAgICBzdGF0aWMgcmVhZFN0b3BzKHN0b3BzU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA6IFN0b3BbXSA9IFtdO1xuICAgICAgICBjb25zdCB0b2tlbnMgPSBzdG9wc1N0cmluZz8uc3BsaXQoL1xccysvKSB8fCBbXTtcbiAgICAgICAgbGV0IG5leHRTdG9wID0gbmV3IFN0b3AoJycsICcnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnM/Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodG9rZW5zW2ldWzBdICE9ICctJyAmJiB0b2tlbnNbaV1bMF0gIT0gJysnICYmIHRva2Vuc1tpXVswXSAhPSAnKicpIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgc3RvcHMucHVzaChuZXh0U3RvcCk7XG4gICAgICAgICAgICAgICAgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RvcC50cmFja0luZm8gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWFkVGVybWluaSh0ZXJtaW5pU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBWZWN0b3JbXSB7XG4gICAgICAgIGNvbnN0IG51bWJlcnMgPSB0ZXJtaW5pU3RyaW5nPy50cmltKCkuc3BsaXQoL1teXFxkLl0rLyk7XG4gICAgICAgIGlmIChudW1iZXJzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yKHBhcnNlRmxvYXQobnVtYmVyc1sxXSksIHBhcnNlRmxvYXQobnVtYmVyc1syXSkpLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IocGFyc2VGbG9hdChudW1iZXJzW251bWJlcnMubGVuZ3RoLTJdKSwgcGFyc2VGbG9hdChudW1iZXJzW251bWJlcnMubGVuZ3RoLTFdKSlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxufSJdLCJzb3VyY2VSb290IjoiIn0=