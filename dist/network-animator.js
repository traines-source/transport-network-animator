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

class DrawableSorter {
    constructor() {
    }
    sort(elements, draw) {
        if (elements.length == 0) {
            return [];
        }
        const representativeElement = elements[0];
        if (representativeElement instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_0__["Line"] && representativeElement.animOrder != undefined) {
            return this.orderByGeometricDirection(elements, representativeElement.animOrder);
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
                const termini = [element.path[0], element.path[element.path.length - 1]];
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
    orderByGeometricDirection(elements, direction) {
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
                let delta = refPoint.delta(cache[j].termini[0]);
                let potentialShortest = delta.length;
                if (potentialShortest < shortest) {
                    shortest = potentialShortest;
                    projectionForShortest = delta.signedLengthProjectedAt(direction);
                    delayForShortest = delays[j].delay;
                }
                delta = refPoint.delta(cache[j].termini[1]);
                potentialShortest = delta.length;
                if (potentialShortest < shortest) {
                    shortest = potentialShortest;
                    projectionForShortest = delta.signedLengthProjectedAt(direction);
                    delayForShortest = delays[j].delay + cache[j].animationDuration;
                }
            }
            const delay = delayForShortest + projectionForShortest / cache[i].element.speed;
            delays.push({ delay: delay, reverse: cache[i].reverse });
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
        console.log(now);
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
            const overrideReverse = override ? delays[i].reverse : undefined;
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
        if (element instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_5__["Line"] && lastElement instanceof _drawables_Line__WEBPACK_IMPORTED_MODULE_5__["Line"] && element.animOrder != lastElement.animOrder) {
            return false;
        }
        return true;
    }
    drawOrEraseElement(element, delay, animate, overrideReverse, now) {
        const draw = this.isDraw(element, now);
        const instant = draw ? element.from : element.to;
        const shouldAnimate = this.shouldAnimate(instant, animate);
        const reverse = overrideReverse != undefined ? overrideReverse : instant.flag.includes('reverse');
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
            console.log('do we get here');
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
Zoomer.PADDING_FACTOR = 25;


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
            this.adapter.termini;
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
        const numbers = d === null || d === void 0 ? void 0 : d.trim().split(/[^\d]+/);
        if (numbers != undefined) {
            return [
                new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](parseInt(numbers[1]), parseInt(numbers[2])),
                new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](parseInt(numbers[numbers.length - 2]), parseInt(numbers[numbers.length - 1]))
            ];
        }
        return [];
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
        if (path.length == 0) {
            if (this.element.style.visibility == 'visible') {
                const r = this.element.getBBox();
                this._boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_1__["BoundingBox"](new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](r.x, r.y), new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](r.x + r.width, r.y + r.height));
                return;
            }
            this._boundingBox = new _BoundingBox__WEBPACK_IMPORTED_MODULE_1__["BoundingBox"](_Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL);
            return;
        }
        for (let i = 0; i < path.length; i++) {
            this._boundingBox.tl = this._boundingBox.tl.bothAxisMins(path[i]);
            this._boundingBox.br = this._boundingBox.br.bothAxisMaxs(path[i]);
        }
    }
    get stops() {
        if (this._stops.length == 0) {
            this._stops = _SvgUtils__WEBPACK_IMPORTED_MODULE_4__["SvgUtils"].readStops(this.element.dataset.stops);
        }
        return this._stops;
    }
    draw(delaySeconds, animationDurationSeconds, reverse, path, length, colorDeviation) {
        this.updateBoundingBox(path);
        const animator = new _SvgAnimator__WEBPACK_IMPORTED_MODULE_2__["SvgAnimator"]();
        animator.wait(delaySeconds * 1000, () => {
            this.element.className.baseVal += ' line ' + this.name;
            this.element.style.visibility = 'visible';
            this.createPath(path);
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
            console.log(element);
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
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQW5pbWF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Fycml2YWxEZXBhcnR1cmVUaW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9Cb3VuZGluZ0JveC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvRHJhd2FibGVTb3J0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXZpdGF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luc3RhbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9VdGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmVjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9ab29tZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9BYnN0cmFjdFRpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9HZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhd2FibGVzL0ltYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9kcmF3YWJsZXMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXdhYmxlcy9MaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9kcmF3YWJsZXMvU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhd2FibGVzL1RyYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnQW5pbWF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdHZW5lcmljVGltZWREcmF3YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z0ltYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdMaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1N0YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdUcmFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBLElBQUksS0FBNEQ7QUFDaEUsSUFBSSxTQUM0QztBQUNoRCxDQUFD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QUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUcsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE1BQU0sR0FBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFO2dCQUNuRSxRQUFRLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckIsUUFBUSxHQUFHLElBQUksdURBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDL0I7aUJBQU07Z0JBQ0gsUUFBUSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEM7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FFSiIsImZpbGUiOiJuZXR3b3JrLWFuaW1hdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gICAgKGZhY3RvcnkoKGdsb2JhbC5mbWluID0gZ2xvYmFsLmZtaW4gfHwge30pKSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKiBmaW5kcyB0aGUgemVyb3Mgb2YgYSBmdW5jdGlvbiwgZ2l2ZW4gdHdvIHN0YXJ0aW5nIHBvaW50cyAod2hpY2ggbXVzdFxuICAgICAqIGhhdmUgb3Bwb3NpdGUgc2lnbnMgKi9cbiAgICBmdW5jdGlvbiBiaXNlY3QoZiwgYSwgYiwgcGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJzLm1heEl0ZXJhdGlvbnMgfHwgMTAwLFxuICAgICAgICAgICAgdG9sZXJhbmNlID0gcGFyYW1ldGVycy50b2xlcmFuY2UgfHwgMWUtMTAsXG4gICAgICAgICAgICBmQSA9IGYoYSksXG4gICAgICAgICAgICBmQiA9IGYoYiksXG4gICAgICAgICAgICBkZWx0YSA9IGIgLSBhO1xuXG4gICAgICAgIGlmIChmQSAqIGZCID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgXCJJbml0aWFsIGJpc2VjdCBwb2ludHMgbXVzdCBoYXZlIG9wcG9zaXRlIHNpZ25zXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZkEgPT09IDApIHJldHVybiBhO1xuICAgICAgICBpZiAoZkIgPT09IDApIHJldHVybiBiO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBkZWx0YSAvPSAyO1xuICAgICAgICAgICAgdmFyIG1pZCA9IGEgKyBkZWx0YSxcbiAgICAgICAgICAgICAgICBmTWlkID0gZihtaWQpO1xuXG4gICAgICAgICAgICBpZiAoZk1pZCAqIGZBID49IDApIHtcbiAgICAgICAgICAgICAgICBhID0gbWlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKE1hdGguYWJzKGRlbHRhKSA8IHRvbGVyYW5jZSkgfHwgKGZNaWQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYSArIGRlbHRhO1xuICAgIH1cblxuICAgIC8vIG5lZWQgc29tZSBiYXNpYyBvcGVyYXRpb25zIG9uIHZlY3RvcnMsIHJhdGhlciB0aGFuIGFkZGluZyBhIGRlcGVuZGVuY3ksXG4gICAgLy8ganVzdCBkZWZpbmUgaGVyZVxuICAgIGZ1bmN0aW9uIHplcm9zKHgpIHsgdmFyIHIgPSBuZXcgQXJyYXkoeCk7IGZvciAodmFyIGkgPSAwOyBpIDwgeDsgKytpKSB7IHJbaV0gPSAwOyB9IHJldHVybiByOyB9XG4gICAgZnVuY3Rpb24gemVyb3NNKHgseSkgeyByZXR1cm4gemVyb3MoeCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gemVyb3MoeSk7IH0pOyB9XG5cbiAgICBmdW5jdGlvbiBkb3QoYSwgYikge1xuICAgICAgICB2YXIgcmV0ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtMihhKSAge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGRvdChhLCBhKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUocmV0LCB2YWx1ZSwgYykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXRbaV0gPSB2YWx1ZVtpXSAqIGM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWlnaHRlZFN1bShyZXQsIHcxLCB2MSwgdzIsIHYyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmV0Lmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICByZXRbal0gPSB3MSAqIHYxW2pdICsgdzIgKiB2MltqXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBtaW5pbWl6ZXMgYSBmdW5jdGlvbiB1c2luZyB0aGUgZG93bmhpbGwgc2ltcGxleCBtZXRob2QgKi9cbiAgICBmdW5jdGlvbiBuZWxkZXJNZWFkKGYsIHgwLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuXG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1ldGVycy5tYXhJdGVyYXRpb25zIHx8IHgwLmxlbmd0aCAqIDIwMCxcbiAgICAgICAgICAgIG5vblplcm9EZWx0YSA9IHBhcmFtZXRlcnMubm9uWmVyb0RlbHRhIHx8IDEuMDUsXG4gICAgICAgICAgICB6ZXJvRGVsdGEgPSBwYXJhbWV0ZXJzLnplcm9EZWx0YSB8fCAwLjAwMSxcbiAgICAgICAgICAgIG1pbkVycm9yRGVsdGEgPSBwYXJhbWV0ZXJzLm1pbkVycm9yRGVsdGEgfHwgMWUtNixcbiAgICAgICAgICAgIG1pblRvbGVyYW5jZSA9IHBhcmFtZXRlcnMubWluRXJyb3JEZWx0YSB8fCAxZS01LFxuICAgICAgICAgICAgcmhvID0gKHBhcmFtZXRlcnMucmhvICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5yaG8gOiAxLFxuICAgICAgICAgICAgY2hpID0gKHBhcmFtZXRlcnMuY2hpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5jaGkgOiAyLFxuICAgICAgICAgICAgcHNpID0gKHBhcmFtZXRlcnMucHNpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5wc2kgOiAtMC41LFxuICAgICAgICAgICAgc2lnbWEgPSAocGFyYW1ldGVycy5zaWdtYSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMuc2lnbWEgOiAwLjUsXG4gICAgICAgICAgICBtYXhEaWZmO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgc2ltcGxleC5cbiAgICAgICAgdmFyIE4gPSB4MC5sZW5ndGgsXG4gICAgICAgICAgICBzaW1wbGV4ID0gbmV3IEFycmF5KE4gKyAxKTtcbiAgICAgICAgc2ltcGxleFswXSA9IHgwO1xuICAgICAgICBzaW1wbGV4WzBdLmZ4ID0gZih4MCk7XG4gICAgICAgIHNpbXBsZXhbMF0uaWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0geDAuc2xpY2UoKTtcbiAgICAgICAgICAgIHBvaW50W2ldID0gcG9pbnRbaV0gPyBwb2ludFtpXSAqIG5vblplcm9EZWx0YSA6IHplcm9EZWx0YTtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXSA9IHBvaW50O1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdLmZ4ID0gZihwb2ludCk7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0uaWQgPSBpKzE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVTaW1wbGV4KHZhbHVlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2ltcGxleFtOXVtpXSA9IHZhbHVlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2ltcGxleFtOXS5meCA9IHZhbHVlLmZ4O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNvcnRPcmRlciA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEuZnggLSBiLmZ4OyB9O1xuXG4gICAgICAgIHZhciBjZW50cm9pZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICByZWZsZWN0ZWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgY29udHJhY3RlZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICBleHBhbmRlZCA9IHgwLnNsaWNlKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgbWF4SXRlcmF0aW9uczsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgIHNpbXBsZXguc29ydChzb3J0T3JkZXIpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgLy8gY29weSB0aGUgc2ltcGxleCAoc2luY2UgbGF0ZXIgaXRlcmF0aW9ucyB3aWxsIG11dGF0ZSkgYW5kXG4gICAgICAgICAgICAgICAgLy8gc29ydCBpdCB0byBoYXZlIGEgY29uc2lzdGVudCBvcmRlciBiZXR3ZWVuIGl0ZXJhdGlvbnNcbiAgICAgICAgICAgICAgICB2YXIgc29ydGVkU2ltcGxleCA9IHNpbXBsZXgubWFwKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHguc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnggPSB4LmZ4O1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pZCA9IHguaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzb3J0ZWRTaW1wbGV4LnNvcnQoZnVuY3Rpb24oYSxiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG5cbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmhpc3RvcnkucHVzaCh7eDogc2ltcGxleFswXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogc2ltcGxleFswXS5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxleDogc29ydGVkU2ltcGxleH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXhEaWZmID0gMDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtYXhEaWZmID0gTWF0aC5tYXgobWF4RGlmZiwgTWF0aC5hYnMoc2ltcGxleFswXVtpXSAtIHNpbXBsZXhbMV1baV0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChNYXRoLmFicyhzaW1wbGV4WzBdLmZ4IC0gc2ltcGxleFtOXS5meCkgPCBtaW5FcnJvckRlbHRhKSAmJlxuICAgICAgICAgICAgICAgIChtYXhEaWZmIDwgbWluVG9sZXJhbmNlKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wdXRlIHRoZSBjZW50cm9pZCBvZiBhbGwgYnV0IHRoZSB3b3JzdCBwb2ludCBpbiB0aGUgc2ltcGxleFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSArPSBzaW1wbGV4W2pdW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSAvPSBOO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZWZsZWN0IHRoZSB3b3JzdCBwb2ludCBwYXN0IHRoZSBjZW50cm9pZCAgYW5kIGNvbXB1dGUgbG9zcyBhdCByZWZsZWN0ZWRcbiAgICAgICAgICAgIC8vIHBvaW50XG4gICAgICAgICAgICB2YXIgd29yc3QgPSBzaW1wbGV4W05dO1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0ocmVmbGVjdGVkLCAxK3JobywgY2VudHJvaWQsIC1yaG8sIHdvcnN0KTtcbiAgICAgICAgICAgIHJlZmxlY3RlZC5meCA9IGYocmVmbGVjdGVkKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlZmxlY3RlZCBwb2ludCBpcyB0aGUgYmVzdCBzZWVuLCB0aGVuIHBvc3NpYmx5IGV4cGFuZFxuICAgICAgICAgICAgaWYgKHJlZmxlY3RlZC5meCA8IHNpbXBsZXhbMF0uZngpIHtcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShleHBhbmRlZCwgMStjaGksIGNlbnRyb2lkLCAtY2hpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgZXhwYW5kZWQuZnggPSBmKGV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwYW5kZWQuZnggPCByZWZsZWN0ZWQuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgocmVmbGVjdGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWZsZWN0ZWQgcG9pbnQgaXMgd29yc2UgdGhhbiB0aGUgc2Vjb25kIHdvcnN0LCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBjb250cmFjdFxuICAgICAgICAgICAgZWxzZSBpZiAocmVmbGVjdGVkLmZ4ID49IHNpbXBsZXhbTi0xXS5meCkge1xuICAgICAgICAgICAgICAgIHZhciBzaG91bGRSZWR1Y2UgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWZsZWN0ZWQuZnggPiB3b3JzdC5meCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhbiBpbnNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMStwc2ksIGNlbnRyb2lkLCAtcHNpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHdvcnN0LmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGFuIG91dHNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMS1wc2kgKiByaG8sIGNlbnRyb2lkLCBwc2kqcmhvLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHJlZmxlY3RlZC5meCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFJlZHVjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkUmVkdWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGRvbid0IGNvbnRyYWN0IGhlcmUsIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpZ21hID49IDEpIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGEgcmVkdWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBzaW1wbGV4Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShzaW1wbGV4W2ldLCAxIC0gc2lnbWEsIHNpbXBsZXhbMF0sIHNpZ21hLCBzaW1wbGV4W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZXhbaV0uZnggPSBmKHNpbXBsZXhbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KHJlZmxlY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaW1wbGV4LnNvcnQoc29ydE9yZGVyKTtcbiAgICAgICAgcmV0dXJuIHtmeCA6IHNpbXBsZXhbMF0uZngsXG4gICAgICAgICAgICAgICAgeCA6IHNpbXBsZXhbMF19O1xuICAgIH1cblxuICAgIC8vLyBzZWFyY2hlcyBhbG9uZyBsaW5lICdwaycgZm9yIGEgcG9pbnQgdGhhdCBzYXRpZmllcyB0aGUgd29sZmUgY29uZGl0aW9uc1xuICAgIC8vLyBTZWUgJ051bWVyaWNhbCBPcHRpbWl6YXRpb24nIGJ5IE5vY2VkYWwgYW5kIFdyaWdodCBwNTktNjBcbiAgICAvLy8gZiA6IG9iamVjdGl2ZSBmdW5jdGlvblxuICAgIC8vLyBwayA6IHNlYXJjaCBkaXJlY3Rpb25cbiAgICAvLy8gY3VycmVudDogb2JqZWN0IGNvbnRhaW5pbmcgY3VycmVudCBncmFkaWVudC9sb3NzXG4gICAgLy8vIG5leHQ6IG91dHB1dDogY29udGFpbnMgbmV4dCBncmFkaWVudC9sb3NzXG4gICAgLy8vIHJldHVybnMgYTogc3RlcCBzaXplIHRha2VuXG4gICAgZnVuY3Rpb24gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhLCBjMSwgYzIpIHtcbiAgICAgICAgdmFyIHBoaTAgPSBjdXJyZW50LmZ4LCBwaGlQcmltZTAgPSBkb3QoY3VycmVudC5meHByaW1lLCBwayksXG4gICAgICAgICAgICBwaGkgPSBwaGkwLCBwaGlfb2xkID0gcGhpMCxcbiAgICAgICAgICAgIHBoaVByaW1lID0gcGhpUHJpbWUwLFxuICAgICAgICAgICAgYTAgPSAwO1xuXG4gICAgICAgIGEgPSBhIHx8IDE7XG4gICAgICAgIGMxID0gYzEgfHwgMWUtNjtcbiAgICAgICAgYzIgPSBjMiB8fCAwLjE7XG5cbiAgICAgICAgZnVuY3Rpb24gem9vbShhX2xvLCBhX2hpZ2gsIHBoaV9sbykge1xuICAgICAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgMTY7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgYSA9IChhX2xvICsgYV9oaWdoKS8yO1xuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKG5leHQueCwgMS4wLCBjdXJyZW50LngsIGEsIHBrKTtcbiAgICAgICAgICAgICAgICBwaGkgPSBuZXh0LmZ4ID0gZihuZXh0LngsIG5leHQuZnhwcmltZSk7XG4gICAgICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHBoaSA+PSBwaGlfbG8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGFfaGlnaCA9IGE7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHBoaVByaW1lKSA8PSAtYzIgKiBwaGlQcmltZTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBoaVByaW1lICogKGFfaGlnaCAtIGFfbG8pID49MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYV9oaWdoID0gYV9sbztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGFfbG8gPSBhO1xuICAgICAgICAgICAgICAgICAgICBwaGlfbG8gPSBwaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IDEwOyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0obmV4dC54LCAxLjAsIGN1cnJlbnQueCwgYSwgcGspO1xuICAgICAgICAgICAgcGhpID0gbmV4dC5meCA9IGYobmV4dC54LCBuZXh0LmZ4cHJpbWUpO1xuICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG4gICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAoaXRlcmF0aW9uICYmIChwaGkgPj0gcGhpX29sZCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb20oYTAsIGEsIHBoaV9vbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMocGhpUHJpbWUpIDw9IC1jMiAqIHBoaVByaW1lMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhpUHJpbWUgPj0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbShhLCBhMCwgcGhpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGhpX29sZCA9IHBoaTtcbiAgICAgICAgICAgIGEwID0gYTtcbiAgICAgICAgICAgIGEgKj0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmp1Z2F0ZUdyYWRpZW50KGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICAvLyBhbGxvY2F0ZSBhbGwgbWVtb3J5IHVwIGZyb250IGhlcmUsIGtlZXAgb3V0IG9mIHRoZSBsb29wIGZvciBwZXJmb21hbmNlXG4gICAgICAgIC8vIHJlYXNvbnNcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG5leHQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIHlrID0gaW5pdGlhbC5zbGljZSgpLFxuICAgICAgICAgICAgcGssIHRlbXAsXG4gICAgICAgICAgICBhID0gMSxcbiAgICAgICAgICAgIG1heEl0ZXJhdGlvbnM7XG5cbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAyMDtcblxuICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgIHBrID0gY3VycmVudC5meHByaW1lLnNsaWNlKCk7XG4gICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsLTEpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBhID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhKTtcblxuICAgICAgICAgICAgLy8gdG9kbzogaGlzdG9yeSBpbiB3cm9uZyBzcG90P1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGF9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhKSB7XG4gICAgICAgICAgICAgICAgLy8gZmFpaWxlZCB0byBmaW5kIHBvaW50IHRoYXQgc2F0aWZpZXMgd29sZmUgY29uZGl0aW9ucy5cbiAgICAgICAgICAgICAgICAvLyByZXNldCBkaXJlY3Rpb24gZm9yIG5leHQgaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBkaXJlY3Rpb24gdXNpbmcgUG9sYWvigJNSaWJpZXJlIENHIG1ldGhvZFxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHlrLCAxLCBuZXh0LmZ4cHJpbWUsIC0xLCBjdXJyZW50LmZ4cHJpbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlbHRhX2sgPSBkb3QoY3VycmVudC5meHByaW1lLCBjdXJyZW50LmZ4cHJpbWUpLFxuICAgICAgICAgICAgICAgICAgICBiZXRhX2sgPSBNYXRoLm1heCgwLCBkb3QoeWssIG5leHQuZnhwcmltZSkgLyBkZWx0YV9rKTtcblxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHBrLCBiZXRhX2ssIHBrLCAtMSwgbmV4dC5meHByaW1lKTtcblxuICAgICAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50O1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgICAgIG5leHQgPSB0ZW1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9ybTIoY3VycmVudC5meHByaW1lKSA8PSAxZS01KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBhfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncmFkaWVudERlc2NlbnQoZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDEwMCxcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHBhcmFtcy5sZWFyblJhdGUgfHwgMC4wMDEsXG4gICAgICAgICAgICBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlaWdodGVkU3VtKGN1cnJlbnQueCwgMSwgY3VycmVudC54LCAtbGVhcm5SYXRlLCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICAgICAgaWYgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPD0gMWUtNSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbmV4dCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMTAwLFxuICAgICAgICAgICAgbGVhcm5SYXRlID0gcGFyYW1zLmxlYXJuUmF0ZSB8fCAxLFxuICAgICAgICAgICAgcGsgPSBpbml0aWFsLnNsaWNlKCksXG4gICAgICAgICAgICBjMSA9IHBhcmFtcy5jMSB8fCAxZS0zLFxuICAgICAgICAgICAgYzIgPSBwYXJhbXMuYzIgfHwgMC4xLFxuICAgICAgICAgICAgdGVtcCxcbiAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIC8vIHdyYXAgdGhlIGZ1bmN0aW9uIGNhbGwgdG8gdHJhY2sgbGluZXNlYXJjaCBzYW1wbGVzXG4gICAgICAgICAgICB2YXIgaW5uZXIgPSBmO1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKHgsIGZ4cHJpbWUpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzLnB1c2goeC5zbGljZSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5uZXIoeCwgZnhwcmltZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuICAgICAgICAgICAgbGVhcm5SYXRlID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBsZWFyblJhdGUsIGMxLCBjMik7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHM6IGZ1bmN0aW9uQ2FsbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhcm5SYXRlOiBsZWFyblJhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGxlYXJuUmF0ZX0pO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB0ZW1wID0gY3VycmVudDtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgbmV4dCA9IHRlbXA7XG5cbiAgICAgICAgICAgIGlmICgobGVhcm5SYXRlID09PSAwKSB8fCAobm9ybTIoY3VycmVudC5meHByaW1lKSA8IDFlLTUpKSBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGV4cG9ydHMuYmlzZWN0ID0gYmlzZWN0O1xuICAgIGV4cG9ydHMubmVsZGVyTWVhZCA9IG5lbGRlck1lYWQ7XG4gICAgZXhwb3J0cy5jb25qdWdhdGVHcmFkaWVudCA9IGNvbmp1Z2F0ZUdyYWRpZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50ID0gZ3JhZGllbnREZXNjZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaCA9IGdyYWRpZW50RGVzY2VudExpbmVTZWFyY2g7XG4gICAgZXhwb3J0cy56ZXJvcyA9IHplcm9zO1xuICAgIGV4cG9ydHMuemVyb3NNID0gemVyb3NNO1xuICAgIGV4cG9ydHMubm9ybTIgPSBub3JtMjtcbiAgICBleHBvcnRzLndlaWdodGVkU3VtID0gd2VpZ2h0ZWRTdW07XG4gICAgZXhwb3J0cy5zY2FsZSA9IHNjYWxlO1xuXG59KSk7IiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFuaW1hdG9yIHtcblxuICAgIHN0YXRpYyBFQVNFX05PTkU6ICh4OiBudW1iZXIpID0+IG51bWJlciA9IHggPT4geDtcbiAgICBzdGF0aWMgRUFTRV9DVUJJQzogKHg6IG51bWJlcikgPT4gbnVtYmVyID0geCA9PiB4IDwgMC41ID8gNCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAzKSAvIDI7XG4gICAgc3RhdGljIEVBU0VfU0lORTogKHg6IG51bWJlcikgPT4gbnVtYmVyID0geCA9PiAtKE1hdGguY29zKE1hdGguUEkgKiB4KSAtIDEpIC8gMjtcbiAgICBcbiAgICBwcml2YXRlIF9mcm9tOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX3RvOiBudW1iZXIgPSAxO1xuICAgIHByaXZhdGUgX3RpbWVQYXNzZWQ6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfZWFzZTogKHg6IG51bWJlcikgPT4gbnVtYmVyID0gQW5pbWF0b3IuRUFTRV9OT05FO1xuXG4gICAgcHJpdmF0ZSBjYWxsYmFjazogKHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuKSA9PiBib29sZWFuID0geCA9PiB0cnVlO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgZHVyYXRpb25NaWxsaXNlY29uZHM6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgZnJvbShmcm9tOiBudW1iZXIpOiBBbmltYXRvciB7XG4gICAgICAgIHRoaXMuX2Zyb20gPSBmcm9tO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG8odG86IG51bWJlcik6IEFuaW1hdG9yIHtcbiAgICAgICAgdGhpcy5fdG8gPSB0bztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHRpbWVQYXNzZWQodGltZVBhc3NlZDogbnVtYmVyKTogQW5pbWF0b3Ige1xuICAgICAgICB0aGlzLl90aW1lUGFzc2VkID0gdGltZVBhc3NlZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGVhc2UoZWFzZTogKHg6IG51bWJlcikgPT4gbnVtYmVyKTogQW5pbWF0b3Ige1xuICAgICAgICB0aGlzLl9lYXNlID0gZWFzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHdhaXQoZGVsYXlNaWxsaXNlY29uZHM6IG51bWJlciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5TWlsbGlzZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KGNhbGxiYWNrLCBkZWxheU1pbGxpc2Vjb25kcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYW5pbWF0ZShkdXJhdGlvbk1pbGxpc2Vjb25kczogbnVtYmVyLCBjYWxsYmFjazogKHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuKSA9PiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHVyYXRpb25NaWxsaXNlY29uZHMgPSBkdXJhdGlvbk1pbGxpc2Vjb25kcztcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMubm93KCk7XG4gICAgICAgIHRoaXMuZnJhbWUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZyYW1lKCkge1xuICAgICAgICBjb25zdCBub3cgPSB0aGlzLm5vdygpO1xuICAgICAgICBsZXQgeCA9IDE7XG4gICAgICAgIGlmICh0aGlzLmR1cmF0aW9uTWlsbGlzZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgeCA9IChub3ctdGhpcy5zdGFydFRpbWUrdGhpcy5fdGltZVBhc3NlZCkgLyB0aGlzLmR1cmF0aW9uTWlsbGlzZWNvbmRzO1xuICAgICAgICB9XG4gICAgICAgIHggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB4KSk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLl9mcm9tICsgKHRoaXMuX3RvLXRoaXMuX2Zyb20pICogdGhpcy5fZWFzZSh4KTtcbiAgICAgICAgY29uc3QgY29udCA9IHRoaXMuY2FsbGJhY2soeSwgeCA9PSAxKTtcbiAgICAgICAgaWYgKGNvbnQgJiYgeCA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEZyYW1lKCgpID0+IHRoaXMuZnJhbWUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgbm93KCk6IG51bWJlcjtcblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCB0aW1lb3V0KGNhbGxiYWNrOiAoKSA9PiB2b2lkLCBkZWxheU1pbGxpc2Vjb25kczogbnVtYmVyKTogdm9pZDtcblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZXF1ZXN0RnJhbWUoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuIiwiZXhwb3J0IGNsYXNzIEFycml2YWxEZXBhcnR1cmVUaW1lIHtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlKG9mZnNldDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3BsaXQgPSB0aGlzLnZhbHVlLnNwbGl0KC8oWy0rXSkvKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHNwbGl0W29mZnNldF0pICogKHNwbGl0W29mZnNldC0xXSA9PSAnLScgPyAtMSA6IDEpXG4gICAgfVxuXG4gICAgZ2V0IGRlcGFydHVyZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZSgyKTtcbiAgICB9XG5cbiAgICBnZXQgYXJyaXZhbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZSg0KTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgY2xhc3MgQm91bmRpbmdCb3gge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0bDogVmVjdG9yLCBwdWJsaWMgYnI6IFZlY3Rvcikge1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKHRsX3g6IG51bWJlciwgdGxfeTogbnVtYmVyLCBicl94OiBudW1iZXIsIGJyX3k6IG51bWJlcik6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yKHRsX3gsIHRsX3kpLCBuZXcgVmVjdG9yKGJyX3gsIGJyX3kpKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IGRpbWVuc2lvbnMoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGwuZGVsdGEodGhpcy5icik7XG4gICAgfVxuICAgIGlzTnVsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGwgPT0gVmVjdG9yLk5VTEwgfHwgdGhpcy5iciA9PSBWZWN0b3IuTlVMTDtcbiAgICB9XG4gICAgXG4gICAgY2FsY3VsYXRlQm91bmRpbmdCb3hGb3Jab29tKHBlcmNlbnRYOiBudW1iZXIsIHBlcmNlbnRZOiBudW1iZXIpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzO1xuICAgICAgICBjb25zdCBkZWx0YSA9IGJib3guZGltZW5zaW9ucztcbiAgICAgICAgY29uc3QgcmVsYXRpdmVDZW50ZXIgPSBuZXcgVmVjdG9yKHBlcmNlbnRYIC8gMTAwLCBwZXJjZW50WSAvIDEwMCk7XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IGJib3gudGwuYWRkKG5ldyBWZWN0b3IoZGVsdGEueCAqIHJlbGF0aXZlQ2VudGVyLngsIGRlbHRhLnkgKiByZWxhdGl2ZUNlbnRlci55KSk7XG4gICAgICAgIGNvbnN0IGVkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIE1hdGgubWluKHJlbGF0aXZlQ2VudGVyLngsIDEgLSByZWxhdGl2ZUNlbnRlci54KSwgZGVsdGEueSAqIE1hdGgubWluKHJlbGF0aXZlQ2VudGVyLnksIDEgLSByZWxhdGl2ZUNlbnRlci55KSk7XG4gICAgICAgIGNvbnN0IHJhdGlvUHJlc2VydmluZ0VkZ2VEaXN0YW5jZSA9IG5ldyBWZWN0b3IoZWRnZURpc3RhbmNlLnkgKiBkZWx0YS54IC8gZGVsdGEueSwgZWRnZURpc3RhbmNlLnggKiBkZWx0YS55IC8gZGVsdGEueCk7XG4gICAgICAgIGNvbnN0IG1pbmltYWxFZGdlRGlzdGFuY2UgPSBuZXcgVmVjdG9yKE1hdGgubWluKGVkZ2VEaXN0YW5jZS54LCByYXRpb1ByZXNlcnZpbmdFZGdlRGlzdGFuY2UueCksIE1hdGgubWluKGVkZ2VEaXN0YW5jZS55LCByYXRpb1ByZXNlcnZpbmdFZGdlRGlzdGFuY2UueSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KGNlbnRlci5hZGQobmV3IFZlY3RvcigtbWluaW1hbEVkZ2VEaXN0YW5jZS54LCAtbWluaW1hbEVkZ2VEaXN0YW5jZS55KSksIGNlbnRlci5hZGQobWluaW1hbEVkZ2VEaXN0YW5jZSkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9kcmF3YWJsZXMvVGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIERyYXdhYmxlU29ydGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHNvcnQoZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSwgZHJhdzogYm9vbGVhbik6IHtkZWxheTogbnVtYmVyLCByZXZlcnNlOiBib29sZWFufVtdIHtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVwcmVzZW50YXRpdmVFbGVtZW50ID0gZWxlbWVudHNbMF07XG4gICAgICAgIGlmIChyZXByZXNlbnRhdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBMaW5lICYmIHJlcHJlc2VudGF0aXZlRWxlbWVudC5hbmltT3JkZXIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcmRlckJ5R2VvbWV0cmljRGlyZWN0aW9uKGVsZW1lbnRzLCByZXByZXNlbnRhdGl2ZUVsZW1lbnQuYW5pbU9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRyYXcpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWlsZFNvcnRhYmxlQ2FjaGUoZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSwgZGlyZWN0aW9uOiBSb3RhdGlvbik6IHtlbGVtZW50OiBMaW5lLCB0ZXJtaW5pOiBWZWN0b3JbXSwgcHJvamVjdGlvbjogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBhbmltYXRpb25EdXJhdGlvbjogbnVtYmVyfVtdIHtcbiAgICAgICAgY29uc3QgY2FjaGUgOiB7ZWxlbWVudDogTGluZSwgdGVybWluaTogVmVjdG9yW10sIHByb2plY3Rpb246IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgYW5pbWF0aW9uRHVyYXRpb246IG51bWJlcn1bXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7aTxlbGVtZW50cy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudHNbaV0gaW5zdGFuY2VvZiBMaW5lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IDxMaW5lPmVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlcm1pbmkgPSBbZWxlbWVudC5wYXRoWzBdLCBlbGVtZW50LnBhdGhbZWxlbWVudC5wYXRoLmxlbmd0aC0xXV07XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvajEgPSB0ZXJtaW5pWzBdLnNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvajIgPSB0ZXJtaW5pWzFdLnNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2ZXJzZSA9IHByb2oxIDwgcHJvajI7XG4gICAgICAgICAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVybWluaS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhY2hlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICB0ZXJtaW5pOiB0ZXJtaW5pLFxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uOiBNYXRoLm1heChwcm9qMSwgcHJvajIpLFxuICAgICAgICAgICAgICAgICAgICByZXZlcnNlOiByZXZlcnNlLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EdXJhdGlvbjogZWxlbWVudC5hbmltYXRpb25EdXJhdGlvblNlY29uZHNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvcmRlckJ5R2VvbWV0cmljRGlyZWN0aW9uKGVsZW1lbnRzOiBUaW1lZERyYXdhYmxlW10sIGRpcmVjdGlvbjogUm90YXRpb24pOiB7ZGVsYXk6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbn1bXSB7XG4gICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5idWlsZFNvcnRhYmxlQ2FjaGUoZWxlbWVudHMsIGRpcmVjdGlvbik7XG4gICAgICAgIGNhY2hlLnNvcnQoKGEsIGIpID0+IChhLnByb2plY3Rpb24gPCBiLnByb2plY3Rpb24pID8gMSA6IC0xKTtcbiAgICAgICAgZWxlbWVudHMuc3BsaWNlKDAsIGVsZW1lbnRzLmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgZGVsYXlzOiB7ZGVsYXk6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbn1bXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7aTxjYWNoZS5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBjb25zdCByZWZQb2ludCA9IGNhY2hlW2ldLnRlcm1pbmlbMF07XG4gICAgICAgICAgICBsZXQgc2hvcnRlc3QgPSByZWZQb2ludC5kZWx0YShjYWNoZVswXS50ZXJtaW5pWzBdKS5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgcHJvamVjdGlvbkZvclNob3J0ZXN0ID0gMDtcbiAgICAgICAgICAgIGxldCBkZWxheUZvclNob3J0ZXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPGk7aisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRlbHRhID0gcmVmUG9pbnQuZGVsdGEoY2FjaGVbal0udGVybWluaVswXSk7XG4gICAgICAgICAgICAgICAgbGV0IHBvdGVudGlhbFNob3J0ZXN0ID0gZGVsdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChwb3RlbnRpYWxTaG9ydGVzdCA8IHNob3J0ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3J0ZXN0ID0gcG90ZW50aWFsU2hvcnRlc3Q7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25Gb3JTaG9ydGVzdCA9IGRlbHRhLnNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGRlbGF5Rm9yU2hvcnRlc3QgPSBkZWxheXNbal0uZGVsYXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbHRhID0gcmVmUG9pbnQuZGVsdGEoY2FjaGVbal0udGVybWluaVsxXSk7XG4gICAgICAgICAgICAgICAgcG90ZW50aWFsU2hvcnRlc3QgPSBkZWx0YS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKHBvdGVudGlhbFNob3J0ZXN0IDwgc2hvcnRlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcnRlc3QgPSBwb3RlbnRpYWxTaG9ydGVzdDtcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbkZvclNob3J0ZXN0ID0gZGVsdGEuc2lnbmVkTGVuZ3RoUHJvamVjdGVkQXQoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsYXlGb3JTaG9ydGVzdCA9IGRlbGF5c1tqXS5kZWxheSArIGNhY2hlW2pdLmFuaW1hdGlvbkR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gZGVsYXlGb3JTaG9ydGVzdCArIHByb2plY3Rpb25Gb3JTaG9ydGVzdC9jYWNoZVtpXS5lbGVtZW50LnNwZWVkO1xuICAgICAgICAgICAgZGVsYXlzLnB1c2goe2RlbGF5OiBkZWxheSwgcmV2ZXJzZTogY2FjaGVbaV0ucmV2ZXJzZX0pO1xuICAgICAgICAgICAgZWxlbWVudHMucHVzaChjYWNoZVtpXS5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsYXlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5cbi8vY29uc3QgbWF0aGpzID0gcmVxdWlyZSgnbWF0aGpzJyk7XG5jb25zdCBmbWluID0gcmVxdWlyZSgnZm1pbicpO1xuXG5cbmV4cG9ydCBjbGFzcyBHcmF2aXRhdG9yIHtcbiAgICBzdGF0aWMgSU5FUlRORVNTID0gMTAwO1xuICAgIHN0YXRpYyBHUkFESUVOVF9TQ0FMRSA9IDAuMDAwMDAwMDAxO1xuICAgIHN0YXRpYyBERVZJQVRJT05fV0FSTklORyA9IDAuMjtcbiAgICBzdGF0aWMgSU5JVElBTElaRV9SRUxBVElWRV9UT19FVUNMSURJQU5fRElTVEFOQ0UgPSB0cnVlO1xuICAgIHN0YXRpYyBTUEVFRCA9IDI1MDtcbiAgICBzdGF0aWMgTUFYX0FOSU1fRFVSQVRJT04gPSA2O1xuICAgIHN0YXRpYyBDT0xPUl9ERVZJQVRJT04gPSAwLjAyO1xuXG4gICAgcHJpdmF0ZSBpbml0aWFsV2VpZ2h0RmFjdG9yczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICBwcml2YXRlIGluaXRpYWxBbmdsZXM6IHthU3RhdGlvbjogc3RyaW5nLCBjb21tb25TdGF0aW9uOiBzdHJpbmcsIGJTdGF0aW9uOiBzdHJpbmcsIGFuZ2xlOiBudW1iZXJ9W10gPSBbXTtcbiAgICBwcml2YXRlIGFuZ2xlRjogYW55O1xuICAgIHByaXZhdGUgYW5nbGVGUHJpbWU6IHtbaWQ6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICBwcml2YXRlIGF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbzogbnVtYmVyID0gLTE7XG4gICAgcHJpdmF0ZSBlZGdlczoge1tpZDogc3RyaW5nXTogTGluZX0gPSB7fTtcbiAgICBwcml2YXRlIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3IsIHN0YXJ0Q29vcmRzOiBWZWN0b3J9fSA9IHt9O1xuICAgIHByaXZhdGUgZGlydHkgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgZ3Jhdml0YXRlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMuZGlydHkpXG4gICAgICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdyYXBoKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gdGhpcy5taW5pbWl6ZUxvc3MoKTtcbiAgICAgICAgdGhpcy5hc3NlcnREaXN0YW5jZXMoc29sdXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlU3RhdGlvbnNBbmRMaW5lcyhzb2x1dGlvbiwgZGVsYXksIGFuaW1hdGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgY29uc3Qgd2VpZ2h0cyA9IHRoaXMuZ2V0V2VpZ2h0c1N1bSgpO1xuICAgICAgICBjb25zdCBldWNsaWRpYW4gPSB0aGlzLmdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3ZWlnaHRzOicsIHdlaWdodHMsICdldWNsaWRpYW46JywgZXVjbGlkaWFuKTtcbiAgICAgICAgaWYgKHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID09IC0xICYmIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8gPSB3ZWlnaHRzIC8gZXVjbGlkaWFuO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2F2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpb14tMScsIDEvdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8pO1xuXG4gICAgICAgICAgICAvL3RoaXMuaW5pdGlhbGl6ZUFuZ2xlR3JhZGllbnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG4gICAgLypwcml2YXRlIGluaXRpYWxpemVBbmdsZUdyYWRpZW50cygpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9ICcoYWNvcygoKGJfeC1hX3gpKihiX3gtY194KSsoYl95LWFfeSkqKGJfeS1jX3kpKS8oc3FydCgoYl94LWFfeCleMisoYl95LWFfeSleMikqc3FydCgoYl94LWNfeCleMisoYl95LWNfeSleMikpKSooKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKS9hYnMoKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkpLWNvbnN0KSc7XG4gICAgICAgIGNvbnN0IGYgPSBtYXRoanMucGFyc2UoZXhwcmVzc2lvbik7XG4gICAgICAgIHRoaXMuYW5nbGVGID0gZi5jb21waWxlKCk7XG5cbiAgICAgICAgY29uc3QgZkRlbHRhID0gbWF0aGpzLnBhcnNlKGV4cHJlc3Npb24gKyAnXjInKTtcblxuICAgICAgICBjb25zdCB2YXJzID0gWydhX3gnLCAnYV95JywgJ2JfeCcsICdiX3knLCAnY194JywgJ2NfeSddO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dmFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hbmdsZUZQcmltZVt2YXJzW2ldXSA9IG1hdGhqcy5kZXJpdmF0aXZlKGZEZWx0YSwgdmFyc1tpXSkuY29tcGlsZSgpO1xuICAgICAgICB9XG4gICAgfSovXG5cbiAgICBwcml2YXRlIGdldFdlaWdodHNTdW0oKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IGVkZ2Uud2VpZ2h0IHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIHN1bSArPSB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlZGdlVmVjdG9yKGVkZ2U6IExpbmUpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEodGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUdyYXBoKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSA9IEdyYXZpdGF0b3IuSU5JVElBTElaRV9SRUxBVElWRV9UT19FVUNMSURJQU5fRElTVEFOQ0VcbiAgICAgICAgICAgICAgICAgICAgPyAxIC8gdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW9cbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoIC8gKGVkZ2Uud2VpZ2h0IHx8IDApO1xuICAgICAgICAgICAgICAgIC8vdGhpcy5hZGRJbml0aWFsQW5nbGVzKGVkZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgdmVydGV4LmluZGV4ID0gbmV3IFZlY3RvcihpLCBpKzEpO1xuICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRJbml0aWFsQW5nbGVzKGVkZ2U6IExpbmUpIHtcbiAgICAgICAgZm9yIChjb25zdCBhZGphY2VudCBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBpZiAoYWRqYWNlbnQgPT0gZWRnZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPDI7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajwyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2UudGVybWluaVtpXS5zdGF0aW9uSWQgPT0gYWRqYWNlbnQudGVybWluaVtqXS5zdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy50aHJlZURvdEFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pW2leMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1thZGphY2VudC50ZXJtaW5pW2peMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxBbmdsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVN0YXRpb246IGVkZ2UudGVybWluaVtpXjFdLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb25TdGF0aW9uOiBlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJTdGF0aW9uOiBhZGphY2VudC50ZXJtaW5pW2peMV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBhbmdsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9kZXJpdmUgYXJjY29zKCgoYS1jKSooZS1nKSsoYi1kKSooZi1oKSkvKHNxcnQoKGEtYyleMisoYi1kKV4yKSpzcXJ0KChlLWcpXjIrKGYtaCleMikpKSooKGYtaCkqKGEtYyktKGItZCkqKGUtZykpL3woKGYtaCkqKGEtYyktKGItZCkqKGUtZykpfFxuICAgICAgICAvL2Rlcml2ZSBhY29zKCgoYl94LWFfeCkqKGJfeC1jX3gpKyhiX3ktYV95KSooYl95LWNfeSkpLyhzcXJ0KChiX3gtYV94KV4yKyhiX3ktYV95KV4yKSpzcXJ0KChiX3gtY194KV4yKyhiX3ktY195KV4yKSkpKigoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpL2FicygoKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKSlcbiAgICB9XG5cbiAgICBwcml2YXRlIHRocmVlRG90QW5nbGUoYTogVmVjdG9yLCBiOiBWZWN0b3IsIGM6IFZlY3Rvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUYsIGEsIGIsIGMsIDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKGY6IGFueSwgYTogVmVjdG9yLCBiOiBWZWN0b3IsIGM6IFZlY3Rvciwgb2xkVmFsdWU6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gZi5ldmFsdWF0ZSh7YV94OiBhLngsIGFfeTogYS55LCBiX3g6IGIueCwgYl95OiBiLnksIGNfeDogYy54LCBjX3k6IGMueSwgY29uc3Q6IG9sZFZhbHVlfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtaW5pbWl6ZUxvc3MoKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCBncmF2aXRhdG9yID0gdGhpcztcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge2hpc3Rvcnk6IFtdfTtcbiAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlcltdID0gdGhpcy5zdGFydFN0YXRpb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSBmbWluLmNvbmp1Z2F0ZUdyYWRpZW50KChBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10pID0+IHtcbiAgICAgICAgICAgIGZ4cHJpbWUgPSBmeHByaW1lIHx8IEEuc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTxmeHByaW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZnhwcmltZVtpXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZnggPSAwO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb0N1cnJlbnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgLy9meCA9IHRoaXMuZGVsdGFUb0FuZ2xlc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5kZWx0YVRvTmV3RGlzdGFuY2VzVG9FbnN1cmVBY2N1cmFjeShmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICB0aGlzLnNjYWxlR3JhZGllbnRUb0Vuc3VyZVdvcmtpbmdTdGVwU2l6ZShmeHByaW1lKTtcbiAgICAgICAgICAgIHJldHVybiBmeDtcbiAgICAgICAgfSwgc3RhcnQsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiBzb2x1dGlvbi54O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRTdGF0aW9uUG9zaXRpb25zKCk6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHN0YXJ0W3ZlcnRleC5pbmRleC54XSA9IHZlcnRleC5zdGFydENvb3Jkcy54O1xuICAgICAgICAgICAgc3RhcnRbdmVydGV4LmluZGV4LnldID0gdmVydGV4LnN0YXJ0Q29vcmRzLnk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXJ0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFYKEE6IG51bWJlcltdLCB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yfX0sIHRlcm1pbmk6IFN0b3BbXSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBBW3ZlcnRpY2VzW3Rlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC54XSAtIEFbdmVydGljZXNbdGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFZKEE6IG51bWJlcltdLCB2ZXJ0aWNlczoge1tpZDogc3RyaW5nXSA6IHtzdGF0aW9uOiBTdGF0aW9uLCBpbmRleDogVmVjdG9yfX0sIHRlcm1pbmk6IFN0b3BbXSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBBW3ZlcnRpY2VzW3Rlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC55XSAtIEFbdmVydGljZXNbdGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnldO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb1N0YXJ0U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXMoZ3Jhdml0YXRvci52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIGZ4ICs9IChcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXJ0Q29vcmRzLngsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXJ0Q29vcmRzLnksIDIpXG4gICAgICAgICAgICAgICAgKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueF0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhcnRDb29yZHMueCkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnldICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXJ0Q29vcmRzLnkpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb0N1cnJlbnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgZnggKz0gKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLngsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy55LCAyKVxuICAgICAgICAgICAgICAgICkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnhdICs9IDIgKiAoQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy54KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueV0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLnkpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb0FuZ2xlc1RvRW5zdXJlSW5lcnRuZXNzKGZ4OiBudW1iZXIsIEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSwgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcik6IG51bWJlciB7XG4gICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IuaW5pdGlhbEFuZ2xlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnldKTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC55XSk7XG4gICAgICAgICAgICBjb25zdCBjID0gbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC55XSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUYsIGEsIGIsIGMsIHBhaXIuYW5nbGUpO1xuICAgICAgICAgICAgZnggKz0gTWF0aC5wb3coZGVsdGEsIDIpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG5cbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC54XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydhX3gnXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC55XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydhX3knXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnhdICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2JfeCddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYl95J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueF0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnY194J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueV0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnY195J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ4O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsdGFUb05ld0Rpc3RhbmNlc1RvRW5zdXJlQWNjdXJhY3koZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyhncmF2aXRhdG9yLmVkZ2VzKSkgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHYgPSBNYXRoLnBvdyh0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyBNYXRoLnBvdyh0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpLCAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLSBNYXRoLnBvdyhncmF2aXRhdG9yLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gKiAoZWRnZS53ZWlnaHQgfHwgMCksIDIpO1xuICAgICAgICAgICAgZnggKz0gTWF0aC5wb3codiwgMik7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueF0gKz0gKzQgKiB2ICogdGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC55XSArPSArNCAqIHYgKiB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLmluZGV4LnhdICs9IC00ICogdiAqIHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueV0gKz0gLTQgKiB2ICogdGhpcy5kZWx0YVkoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY2FsZUdyYWRpZW50VG9FbnN1cmVXb3JraW5nU3RlcFNpemUoZnhwcmltZTogbnVtYmVyW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZ4cHJpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZ4cHJpbWVbaV0gKj0gR3Jhdml0YXRvci5HUkFESUVOVF9TQ0FMRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0RGlzdGFuY2VzKHNvbHV0aW9uOiBudW1iZXJbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBkZXZpYXRpb24gPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVgoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyh0aGlzLmRlbHRhWShzb2x1dGlvbiwgdGhpcy52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICkgLyAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApKSAtIDE7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGV2aWF0aW9uKSA+IEdyYXZpdGF0b3IuREVWSUFUSU9OX1dBUk5JTkcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZWRnZS5uYW1lLCAnZGl2ZXJnZXMgYnkgJywgZGV2aWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICBwcml2YXRlIG1vdmVTdGF0aW9uc0FuZExpbmVzKHNvbHV0aW9uOiBudW1iZXJbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9IGFuaW1hdGUgPyBNYXRoLm1pbihHcmF2aXRhdG9yLk1BWF9BTklNX0RVUkFUSU9OLCB0aGlzLmdldFRvdGFsRGlzdGFuY2VUb01vdmUoc29sdXRpb24pIC8gR3Jhdml0YXRvci5TUEVFRCkgOiAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXguc3RhdGlvbi5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIG5ldyBWZWN0b3Ioc29sdXRpb25bdmVydGV4LmluZGV4LnhdLCBzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueV0pKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgY29uc3QgY29vcmRzID0gW3RoaXMuZ2V0TmV3U3RhdGlvblBvc2l0aW9uKGVkZ2UudGVybWluaVswXS5zdGF0aW9uSWQsIHNvbHV0aW9uKSwgdGhpcy5nZXROZXdTdGF0aW9uUG9zaXRpb24oZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZCwgc29sdXRpb24pXTtcbiAgICAgICAgICAgIGVkZ2UubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBjb29yZHMsIHRoaXMuZ2V0Q29sb3JCeURldmlhdGlvbihlZGdlLCBlZGdlLndlaWdodCB8fCAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgKz0gYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb2xvckJ5RGV2aWF0aW9uKGVkZ2U6IExpbmUsIHdlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxEaXN0ID0gdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5zdGFydENvb3Jkcy5kZWx0YSh0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLnN0YXJ0Q29vcmRzKS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgKHdlaWdodCAtIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvICogaW5pdGlhbERpc3QpICogR3Jhdml0YXRvci5DT0xPUl9ERVZJQVRJT04pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRvdGFsRGlzdGFuY2VUb01vdmUoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gbmV3IFZlY3Rvcihzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueF0sIHNvbHV0aW9uW3ZlcnRleC5pbmRleC55XSkuZGVsdGEodmVydGV4LnN0YXRpb24uYmFzZUNvb3JkcykubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXdTdGF0aW9uUG9zaXRpb24oc3RhdGlvbklkOiBzdHJpbmcsIHNvbHV0aW9uOiBudW1iZXJbXSk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC54XSwgc29sdXRpb25bdGhpcy52ZXJ0aWNlc1tzdGF0aW9uSWRdLmluZGV4LnldKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFZlcnRleCh2ZXJ0ZXhJZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh2ZXJ0ZXhJZCk7XG4gICAgICAgICAgICBpZiAoc3RhdGlvbiA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHZlcnRleElkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHRoaXMudmVydGljZXNbdmVydGV4SWRdID0ge3N0YXRpb246IHN0YXRpb24sIGluZGV4OiBWZWN0b3IuTlVMTCwgc3RhcnRDb29yZHM6IHN0YXRpb24uYmFzZUNvb3Jkc307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRFZGdlKGxpbmU6IExpbmUpIHtcbiAgICAgICAgaWYgKGxpbmUud2VpZ2h0ID09IHVuZGVmaW5lZCkgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0SWRlbnRpZmllcihsaW5lKTtcbiAgICAgICAgdGhpcy5lZGdlc1tpZF0gPSBsaW5lO1xuICAgICAgICB0aGlzLmFkZFZlcnRleChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkKTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZGVudGlmaWVyKGxpbmU6IExpbmUpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmFscGhhYmV0aWNJZChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBsaW5lLnRlcm1pbmlbMV0uc3RhdGlvbklkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5zdGFudCB7XG4gICAgc3RhdGljIEJJR19CQU5HOiBJbnN0YW50ID0gbmV3IEluc3RhbnQoMCwgMCwgJycpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Vwb2NoOiBudW1iZXIsIHByaXZhdGUgX3NlY29uZDogbnVtYmVyLCBwcml2YXRlIF9mbGFnOiBzdHJpbmcpIHtcblxuICAgIH1cbiAgICBnZXQgZXBvY2goKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vwb2NoO1xuICAgIH1cbiAgICBnZXQgc2Vjb25kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWNvbmQ7XG4gICAgfVxuICAgIGdldCBmbGFnKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFnO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGFycmF5OiBzdHJpbmdbXSk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQocGFyc2VJbnQoYXJyYXlbMF0pLCBwYXJzZUludChhcnJheVsxXSksIGFycmF5WzJdID8/ICcnKVxuICAgIH1cblxuICAgIGVxdWFscyh0aGF0OiBJbnN0YW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2ggJiYgdGhpcy5zZWNvbmQgPT0gdGhhdC5zZWNvbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kIC0gdGhpcy5zZWNvbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL2RyYXdhYmxlcy9MaW5lXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgY2xhc3MgTGluZUdyb3VwIHtcbiAgICBwcml2YXRlIF9saW5lczogTGluZVtdID0gW107XG4gICAgcHJpdmF0ZSBfdGVybWluaTogU3RvcFtdID0gW107XG4gICAgc3Ryb2tlQ29sb3IgPSAwO1xuICAgIFxuICAgIGFkZExpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuX2xpbmVzLmluY2x1ZGVzKGxpbmUpKVxuICAgICAgICAgICAgdGhpcy5fbGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXJtaW5pKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGluZShsaW5lOiBMaW5lKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLl9saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9saW5lc1tpXSA9PSBsaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVUZXJtaW5pKCk7XG4gICAgfVxuXG4gICAgZ2V0IHRlcm1pbmkoKTogU3RvcFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Rlcm1pbmk7XG4gICAgfVxuXG4gICAgZ2V0UGF0aEJldHdlZW4oc3RhdGlvbklkRnJvbTogc3RyaW5nLCBzdGF0aW9uSWRUbzogc3RyaW5nKToge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9IHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmdldExpbmVzV2l0aFN0b3Aoc3RhdGlvbklkRnJvbSk7XG4gICAgICAgIGNvbnN0IHRvID0gdGhpcy5nZXRMaW5lc1dpdGhTdG9wKHN0YXRpb25JZFRvKTtcblxuICAgICAgICBpZiAoZnJvbS5sZW5ndGggPT0gMCB8fCB0by5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgT2JqZWN0LnZhbHVlcyhmcm9tKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIE9iamVjdC52YWx1ZXModG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEubGluZSA9PSBiLmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGF0aEJldHdlZW5TdG9wcyhhLmxpbmUsIGEuc3RvcCwgYi5zdG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIE9iamVjdC52YWx1ZXMoZnJvbSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiBPYmplY3QudmFsdWVzKHRvKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1vbiA9IHRoaXMuZmluZENvbW1vblN0b3AoYS5saW5lLCBiLmxpbmUpO1xuICAgICAgICAgICAgICAgIGlmIChjb21tb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFBhcnQgPSB0aGlzLmdldFBhdGhCZXR3ZWVuU3RvcHMoYS5saW5lLCBhLnN0b3AsIGNvbW1vbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlY29uZFBhcnQgPSB0aGlzLmdldFBhdGhCZXR3ZWVuU3RvcHMoYi5saW5lLCBjb21tb24sIGIuc3RvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0UGFydFNsaWNlID0gZmlyc3RQYXJ0LnBhdGguc2xpY2UoMCwgZmlyc3RQYXJ0LnRvKzEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRQYXJ0U2xpY2UgPSBzZWNvbmRQYXJ0LnBhdGguc2xpY2Uoc2Vjb25kUGFydC5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcGF0aDogZmlyc3RQYXJ0U2xpY2UuY29uY2F0KHNlY29uZFBhcnRTbGljZSksIGZyb206IGZpcnN0UGFydC5mcm9tLCB0bzogZmlyc3RQYXJ0U2xpY2UubGVuZ3RoICsgc2Vjb25kUGFydC50b307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBsZXggVHJhaW4gcm91dGluZyBmb3IgTGluZXMgb2YgTGluZUdyb3VwcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TGluZXNXaXRoU3RvcChzdGF0aW9uSWQ6IHN0cmluZyk6IHtsaW5lOiBMaW5lLCBzdG9wOiBTdG9wfVtdIHtcbiAgICAgICAgY29uc3QgYXJyOiB7bGluZTogTGluZSwgc3RvcDogU3RvcH1bXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLl9saW5lcykpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSBsaW5lLmdldFN0b3Aoc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7bGluZTogbGluZSwgc3RvcDogc3RvcH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQYXRoQmV0d2VlblN0b3BzKGxpbmU6IExpbmUsIGZyb206IFN0b3AsIHRvOiBTdG9wKToge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9IHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGxpbmUucGF0aDtcbiAgICAgICAgbGV0IGZyb21JZHggPSB0aGlzLmluZGV4T2YocGF0aCwgZnJvbS5jb29yZCB8fCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIGxldCB0b0lkeCA9IHRoaXMuaW5kZXhPZihwYXRoLCB0by5jb29yZCB8fCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIGlmIChmcm9tSWR4ID09IC0xIHx8IHRvSWR4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdG9wIHRoYXQgc2hvdWxkIGJlIHByZXNlbnQgaXMgbm90IHByZXNlbnQgb24gbGluZSBcIiArIGxpbmUubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zdCBzbGljZSA9IHBhdGguc2xpY2UoTWF0aC5taW4oZnJvbUlkeCwgdG9JZHgpLCBNYXRoLm1heChmcm9tSWR4LCB0b0lkeCkrMSk7XG4gICAgICAgIGNvbnN0IHNsaWNlID0gcGF0aC5zbGljZSgpO1xuICAgICAgICBpZiAoZnJvbUlkeCA+IHRvSWR4KSB7XG4gICAgICAgICAgICBzbGljZS5yZXZlcnNlKCk7XG4gICAgICAgICAgICBmcm9tSWR4ID0gc2xpY2UubGVuZ3RoIC0gMSAtIGZyb21JZHg7XG4gICAgICAgICAgICB0b0lkeCA9IHNsaWNlLmxlbmd0aCAtIDEgLSB0b0lkeDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBwYXRoOiBzbGljZSwgZnJvbTogZnJvbUlkeCwgdG86IHRvSWR4IH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbmRleE9mKGFycmF5OiBWZWN0b3JbXSwgZWxlbWVudDogVmVjdG9yKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycmF5W2ldLmVxdWFscyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRDb21tb25TdG9wKGxpbmUxOiBMaW5lLCBsaW5lMjogTGluZSk6IFN0b3AgfCBudWxsIHtcbiAgICAgICAgZm9yIChjb25zdCB0ZXJtaW51czEgb2YgT2JqZWN0LnZhbHVlcyhsaW5lMS50ZXJtaW5pKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0ZXJtaW51czIgb2YgT2JqZWN0LnZhbHVlcyhsaW5lMi50ZXJtaW5pKSkge1xuICAgICAgICAgICAgICAgIGlmICh0ZXJtaW51czEuc3RhdGlvbklkID09IHRlcm1pbnVzMi5zdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlcm1pbnVzMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUZXJtaW5pKCkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGVzOiB7W2lkOiBzdHJpbmddIDogbnVtYmVyfSA9IHt9O1xuICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZVRlcm1pbmkgPSBsLnRlcm1pbmk7XG4gICAgICAgICAgICBsaW5lVGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdC50cmFja0luZm8uaW5jbHVkZXMoJyonKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuZGlkYXRlc1t0LnN0YXRpb25JZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0ZXJtaW5pOiBTdG9wW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBbc3RhdGlvbklkLCBvY2N1cmVuY2VzXSBvZiBPYmplY3QuZW50cmllcyhjYW5kaWRhdGVzKSkge1xuICAgICAgICAgICAgaWYgKG9jY3VyZW5jZXMgPT0gMSkge1xuICAgICAgICAgICAgICAgIHRlcm1pbmkucHVzaChuZXcgU3RvcChzdGF0aW9uSWQsICcnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGVybWluaSA9IHRlcm1pbmk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vZHJhd2FibGVzL1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgWm9vbWVyIH0gZnJvbSBcIi4vWm9vbWVyXCI7XG5pbXBvcnQgeyBMaW5lR3JvdXAgfSBmcm9tIFwiLi9MaW5lR3JvdXBcIjtcbmltcG9ydCB7IEdyYXZpdGF0b3IgfSBmcm9tIFwiLi9HcmF2aXRhdG9yXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vZHJhd2FibGVzL0xpbmVcIjtcbmltcG9ydCB7IERyYXdhYmxlU29ydGVyIH0gZnJvbSBcIi4vRHJhd2FibGVTb3J0ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBZGFwdGVyIHtcbiAgICBjYW52YXNTaXplOiBCb3VuZGluZ0JveDtcbiAgICBhdXRvU3RhcnQ6IGJvb2xlYW47XG4gICAgem9vbU1heFNjYWxlOiBudW1iZXI7XG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG4gICAgZHJhd0Vwb2NoKGVwb2NoOiBzdHJpbmcpOiB2b2lkO1xuICAgIHpvb21Ubyh6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBOZXR3b3JrIGltcGxlbWVudHMgU3RhdGlvblByb3ZpZGVyIHtcbiAgICBwcml2YXRlIHNsaWRlSW5kZXg6IHtbaWQ6IHN0cmluZ10gOiB7W2lkOiBzdHJpbmddOiBUaW1lZERyYXdhYmxlW119fSA9IHt9O1xuICAgIHByaXZhdGUgc3RhdGlvbnM6IHsgW2lkOiBzdHJpbmddIDogU3RhdGlvbiB9ID0ge307XG4gICAgcHJpdmF0ZSBsaW5lR3JvdXBzOiB7IFtpZDogc3RyaW5nXSA6IExpbmVHcm91cCB9ID0ge307XG4gICAgcHJpdmF0ZSBkcmF3YWJsZUJ1ZmZlcjogVGltZWREcmF3YWJsZVtdID0gW107XG4gICAgcHJpdmF0ZSBncmF2aXRhdG9yOiBHcmF2aXRhdG9yO1xuICAgIHByaXZhdGUgem9vbWVyOiBab29tZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IE5ldHdvcmtBZGFwdGVyLCBwcml2YXRlIGRyYXdhYmxlU29ydGVyOiBEcmF3YWJsZVNvcnRlcikge1xuICAgICAgICB0aGlzLmdyYXZpdGF0b3IgPSBuZXcgR3Jhdml0YXRvcih0aGlzKTtcbiAgICAgICAgdGhpcy56b29tZXIgPSBuZXcgWm9vbWVyKHRoaXMuYWRhcHRlci5jYW52YXNTaXplLCB0aGlzLmFkYXB0ZXIuem9vbU1heFNjYWxlKTtcbiAgICB9XG5cbiAgICBnZXQgYXV0b1N0YXJ0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmF1dG9TdGFydDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpb25zW2lkXTtcbiAgICB9XG5cbiAgICBsaW5lR3JvdXBCeUlkKGlkOiBzdHJpbmcpOiBMaW5lR3JvdXAge1xuICAgICAgICBpZiAodGhpcy5saW5lR3JvdXBzW2lkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGluZUdyb3Vwc1tpZF0gPSBuZXcgTGluZUdyb3VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubGluZUdyb3Vwc1tpZF07XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuYWRhcHRlci5jcmVhdGVWaXJ0dWFsU3RvcChpZCwgYmFzZUNvb3Jkcywgcm90YXRpb24pO1xuICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0b3A7XG4gICAgICAgIHJldHVybiBzdG9wO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGlzcGxheUluc3RhbnQoaW5zdGFudDogSW5zdGFudCkge1xuICAgICAgICBpZiAoIWluc3RhbnQuZXF1YWxzKEluc3RhbnQuQklHX0JBTkcpKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhd0Vwb2NoKGluc3RhbnQuZXBvY2ggKyAnJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGltZWREcmF3YWJsZXNBdChub3c6IEluc3RhbnQpOiBUaW1lZERyYXdhYmxlW10ge1xuICAgICAgICBpZiAoIXRoaXMuaXNFcG9jaEV4aXN0aW5nKG5vdy5lcG9jaCArICcnKSlcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdW25vdy5zZWNvbmRdO1xuICAgIH1cblxuICAgIGRyYXdUaW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuZGlzcGxheUluc3RhbnQobm93KTtcbiAgICAgICAgY29uc29sZS5sb2cobm93KTtcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IHRoaXMudGltZWREcmF3YWJsZXNBdChub3cpO1xuICAgICAgICBsZXQgZGVsYXkgPSBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMucG9wdWxhdGVEcmF3YWJsZUJ1ZmZlcihlbGVtZW50c1tpXSwgZGVsYXksIGFuaW1hdGUsIG5vdyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsYXkgPSB0aGlzLmZsdXNoRHJhd2FibGVCdWZmZXIoZGVsYXksIGFuaW1hdGUsIG5vdyk7XG4gICAgICAgIGRlbGF5ID0gdGhpcy5ncmF2aXRhdG9yLmdyYXZpdGF0ZShkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIHRoaXMuYWRhcHRlci56b29tVG8odGhpcy56b29tZXIuY2VudGVyLCB0aGlzLnpvb21lci5zY2FsZSwgdGhpcy56b29tZXIuZHVyYXRpb24pO1xuICAgICAgICB0aGlzLnpvb21lci5yZXNldCgpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3B1bGF0ZURyYXdhYmxlQnVmZmVyKGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIG5vdzogSW5zdGFudCk6IG51bWJlciB7XG4gICAgICAgIGlmICghdGhpcy5pc0RyYXdhYmxlRWxpZ2xpYmxlRm9yU2FtZUJ1ZmZlcihlbGVtZW50LCBub3cpKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hEcmF3YWJsZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSwgbm93KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdhYmxlQnVmZmVyLnB1c2goZWxlbWVudCk7XG4gICAgICAgIHJldHVybiBkZWxheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNvcnREcmF3YWJsZUJ1ZmZlcihub3c6IEluc3RhbnQpOiB7ZGVsYXk6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbn1bXSB7XG4gICAgICAgIGlmICh0aGlzLmRyYXdhYmxlQnVmZmVyLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2FibGVTb3J0ZXIuc29ydCh0aGlzLmRyYXdhYmxlQnVmZmVyLCB0aGlzLmlzRHJhdyh0aGlzLmRyYXdhYmxlQnVmZmVyW3RoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoLTFdLCBub3cpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZsdXNoRHJhd2FibGVCdWZmZXIoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgbm93OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZGVsYXlzID0gdGhpcy5zb3J0RHJhd2FibGVCdWZmZXIobm93KTtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGUgPSBkZWxheXMubGVuZ3RoID09IHRoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoO1xuICAgICAgICBsZXQgbWF4RGVsYXkgPSBkZWxheTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNwZWNpZmljRGVsYXkgPSBvdmVycmlkZSA/IGRlbGF5ICsgZGVsYXlzW2ldLmRlbGF5IDogbWF4RGVsYXk7XG4gICAgICAgICAgICBjb25zdCBvdmVycmlkZVJldmVyc2UgPSBvdmVycmlkZSA/IGRlbGF5c1tpXS5yZXZlcnNlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3QgbmV3RGVsYXkgPSB0aGlzLmRyYXdPckVyYXNlRWxlbWVudCh0aGlzLmRyYXdhYmxlQnVmZmVyW2ldLCBzcGVjaWZpY0RlbGF5LCBhbmltYXRlLCBvdmVycmlkZVJldmVyc2UsIG5vdylcbiAgICAgICAgICAgIG1heERlbGF5ID0gTWF0aC5tYXgobmV3RGVsYXksIG1heERlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdhYmxlQnVmZmVyID0gW107XG4gICAgICAgIHJldHVybiBtYXhEZWxheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRHJhdyhlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBub3c6IEluc3RhbnQpIHtcbiAgICAgICAgcmV0dXJuIG5vdy5lcXVhbHMoZWxlbWVudC5mcm9tKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRHJhd2FibGVFbGlnbGlibGVGb3JTYW1lQnVmZmVyKGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIG5vdzogSW5zdGFudCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5kcmF3YWJsZUJ1ZmZlci5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFzdEVsZW1lbnQgPSB0aGlzLmRyYXdhYmxlQnVmZmVyW3RoaXMuZHJhd2FibGVCdWZmZXIubGVuZ3RoLTFdO1xuICAgICAgICBpZiAoZWxlbWVudC5uYW1lICE9IGxhc3RFbGVtZW50Lm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0RyYXcoZWxlbWVudCwgbm93KSAhPSB0aGlzLmlzRHJhdyhsYXN0RWxlbWVudCwgbm93KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTGluZSAmJiBsYXN0RWxlbWVudCBpbnN0YW5jZW9mIExpbmUgJiYgZWxlbWVudC5hbmltT3JkZXIgIT0gbGFzdEVsZW1lbnQuYW5pbU9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3T3JFcmFzZUVsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgb3ZlcnJpZGVSZXZlcnNlOiBib29sZWFuIHwgdW5kZWZpbmVkLCBub3c6IEluc3RhbnQpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBkcmF3ID0gdGhpcy5pc0RyYXcoZWxlbWVudCwgbm93KTtcbiAgICAgICAgY29uc3QgaW5zdGFudCA9IGRyYXcgPyBlbGVtZW50LmZyb20gOiBlbGVtZW50LnRvO1xuICAgICAgICBjb25zdCBzaG91bGRBbmltYXRlID0gdGhpcy5zaG91bGRBbmltYXRlKGluc3RhbnQsIGFuaW1hdGUpO1xuICAgICAgICBjb25zdCByZXZlcnNlID0gb3ZlcnJpZGVSZXZlcnNlICE9IHVuZGVmaW5lZCA/IG92ZXJyaWRlUmV2ZXJzZSA6IGluc3RhbnQuZmxhZy5pbmNsdWRlcygncmV2ZXJzZScpO1xuICAgICAgICBkZWxheSArPSBkcmF3XG4gICAgICAgICAgICA/IHRoaXMuZHJhd0VsZW1lbnQoZWxlbWVudCwgZGVsYXksIHNob3VsZEFuaW1hdGUsIHJldmVyc2UpXG4gICAgICAgICAgICA6IHRoaXMuZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlLCByZXZlcnNlKTtcbiAgICAgICAgdGhpcy56b29tZXIuaW5jbHVkZShlbGVtZW50LmJvdW5kaW5nQm94LCBlbGVtZW50LmZyb20sIGVsZW1lbnQudG8sIGRyYXcsIGFuaW1hdGUpO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZHJhd0VsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTGluZSkge1xuICAgICAgICAgICAgdGhpcy5ncmF2aXRhdG9yLmFkZEVkZ2UoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZHJhdyhkZWxheSwgYW5pbWF0ZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5lcmFzZShkZWxheSwgYW5pbWF0ZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgc2hvdWxkQW5pbWF0ZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGluc3RhbnQuZmxhZy5pbmNsdWRlcygnbm9hbmltJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBhbmltYXRlO1xuICAgIH1cblxuICAgIGlzRXBvY2hFeGlzdGluZyhlcG9jaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdICE9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhZGRUb0luZGV4KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LmZyb20sIGVsZW1lbnQpO1xuICAgICAgICBpZiAoIUluc3RhbnQuQklHX0JBTkcuZXF1YWxzKGVsZW1lbnQudG8pKVxuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LnRvLCBlbGVtZW50KTtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBTdGF0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZG8gd2UgZ2V0IGhlcmUnKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGlvbnNbZWxlbWVudC5pZF0gPSBlbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTbGlkZUluZGV4RWxlbWVudChpbnN0YW50OiBJbnN0YW50LCBlbGVtZW50OiBUaW1lZERyYXdhYmxlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdID0ge307XG4gICAgICAgIGlmICh0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPSBbXTtcbiAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXS5wdXNoKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIG5leHRJbnN0YW50KG5vdzogSW5zdGFudCk6IEluc3RhbnQgfCBudWxsIHtcbiAgICAgICAgbGV0IGVwb2NoOiBudW1iZXIgfCBudWxsID0gbm93LmVwb2NoO1xuICAgICAgICBsZXQgc2Vjb25kOiBudW1iZXIgfCBudWxsID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZShub3cuc2Vjb25kLCB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXSk7XG4gICAgICAgIGlmIChzZWNvbmQgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXBvY2ggPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5lcG9jaCwgdGhpcy5zbGlkZUluZGV4KTtcbiAgICAgICAgICAgIGlmIChlcG9jaCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBzZWNvbmQgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKC0xLCB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdKTtcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFudChlcG9jaCwgc2Vjb25kLCAnJyk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZmluZFNtYWxsZXN0QWJvdmUodGhyZXNob2xkOiBudW1iZXIsIGRpY3Q6IHtbaWQ6IG51bWJlcl06IGFueX0pOiBudW1iZXIgfCBudWxsIHtcbiAgICAgICAgaWYgKGRpY3QgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCBzbWFsbGVzdCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRpY3QpKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoa2V5KSA+IHRocmVzaG9sZCAmJiAoc21hbGxlc3QgPT0gbnVsbCB8fCBwYXJzZUludChrZXkpIDwgc21hbGxlc3QpKSB7XG4gICAgICAgICAgICAgICAgc21hbGxlc3QgPSBwYXJzZUludChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzbWFsbGVzdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBMaW5lQXRTdGF0aW9uIH0gZnJvbSBcIi4vZHJhd2FibGVzL1N0YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFByZWZlcnJlZFRyYWNrIHtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgXG4gICAgZnJvbVN0cmluZyh2YWx1ZTogc3RyaW5nKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBpZiAodmFsdWUgIT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJlZmVycmVkVHJhY2sodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZyb21OdW1iZXIodmFsdWU6IG51bWJlcik6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gdmFsdWUgPj0gMCA/ICcrJyA6ICcnO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHByZWZpeCArIHZhbHVlKTtcbiAgICB9XG5cbiAgICBmcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKGF0U3RhdGlvbjogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXRTdGF0aW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5oYXNUcmFja051bWJlcigpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21OdW1iZXIoYXRTdGF0aW9uLnRyYWNrKTsgICAgICAgIFxuICAgIH1cblxuICAgIGtlZXBPbmx5U2lnbigpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLnZhbHVlWzBdO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHYgPT0gJy0nID8gdiA6ICcrJyk7XG4gICAgfVxuXG4gICAgaGFzVHJhY2tOdW1iZXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmxlbmd0aCA+IDE7XG4gICAgfVxuXG4gICAgZ2V0IHRyYWNrTnVtYmVyKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLnZhbHVlLnJlcGxhY2UoJyonLCAnJykpXG4gICAgfVxuXG4gICAgaXNQb3NpdGl2ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbMF0gIT0gJy0nO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRpb24ge1xuICAgIHByaXZhdGUgc3RhdGljIERJUlM6IHsgW2lkOiBzdHJpbmddOiBudW1iZXIgfSA9IHsnc3cnOiAtMTM1LCAndyc6IC05MCwgJ253JzogLTQ1LCAnbic6IDAsICduZSc6IDQ1LCAnZSc6IDkwLCAnc2UnOiAxMzUsICdzJzogMTgwfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RlZ3JlZXM6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20oZGlyZWN0aW9uOiBzdHJpbmcpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oUm90YXRpb24uRElSU1tkaXJlY3Rpb25dIHx8IDApO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKFJvdGF0aW9uLkRJUlMpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZhbHVlLCB0aGlzLmRlZ3JlZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ24nO1xuICAgIH1cblxuICAgIGdldCBkZWdyZWVzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWdyZWVzO1xuICAgIH1cblxuICAgIGdldCByYWRpYW5zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlZ3JlZXMgLyAxODAgKiBNYXRoLlBJO1xuICAgIH1cblxuICAgIGFkZCh0aGF0OiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMuZGVncmVlcyArIHRoYXQuZGVncmVlcztcbiAgICAgICAgaWYgKHN1bSA8PSAtMTgwKVxuICAgICAgICAgICAgc3VtICs9IDM2MDtcbiAgICAgICAgaWYgKHN1bSA+IDE4MClcbiAgICAgICAgICAgIHN1bSAtPSAzNjA7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oc3VtKTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IGEgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGxldCBiID0gdGhhdC5kZWdyZWVzO1xuICAgICAgICBsZXQgZGlzdCA9IGItYTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3QpID4gMTgwKSB7XG4gICAgICAgICAgICBpZiAoYSA8IDApXG4gICAgICAgICAgICAgICAgYSArPSAzNjA7XG4gICAgICAgICAgICBpZiAoYiA8IDApXG4gICAgICAgICAgICAgICAgYiArPSAzNjA7XG4gICAgICAgICAgICBkaXN0ID0gYi1hO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGlzdCk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgbGV0IGRpciA9IHRoaXMuZGVncmVlcztcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhkaXIsIC05MCkpXG4gICAgICAgICAgICBkaXIgPSAwO1xuICAgICAgICBlbHNlIGlmIChkaXIgPCAtOTApXG4gICAgICAgICAgICBkaXIgKz0gMTgwO1xuICAgICAgICBlbHNlIGlmIChkaXIgPiA5MClcbiAgICAgICAgICAgIGRpciAtPSAxODA7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGlyKTtcbiAgICB9XG5cbiAgICBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzICUgMTgwID09IDA7XG4gICAgfVxuXG4gICAgcXVhcnRlckRpcmVjdGlvbihyZWxhdGl2ZVRvOiBSb3RhdGlvbik6IFJvdGF0aW9uIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGNvbnN0IGRlZyA9IGRlbHRhRGlyIDwgMCA/IE1hdGguY2VpbCgoZGVsdGFEaXItNDUpLzkwKSA6IE1hdGguZmxvb3IoKGRlbHRhRGlyKzQ1KS85MCk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKjkwKTtcbiAgICB9XG5cbiAgICBoYWxmRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBzcGxpdEF4aXM6IFJvdGF0aW9uKTogUm90YXRpb24ge1xuICAgICAgICBjb25zdCBkZWx0YURpciA9IHJlbGF0aXZlVG8uZGVsdGEodGhpcykuZGVncmVlcztcbiAgICAgICAgbGV0IGRlZztcbiAgICAgICAgaWYgKHNwbGl0QXhpcy5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDAgJiYgZGVsdGFEaXIgPj0gLTE4MClcbiAgICAgICAgICAgICAgICBkZWcgPSAtOTA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVnID0gOTA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGVsdGFEaXIgPCA5MCAmJiBkZWx0YURpciA+PSAtOTApXG4gICAgICAgICAgICAgICAgZGVnID0gMDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSAxODA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihkZWcpO1xuICAgIH1cblxuICAgIG5lYXJlc3RSb3VuZGVkSW5EaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24sIGRpcmVjdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNlaWxlZE9yRmxvb3JlZE9yaWVudGF0aW9uID0gcmVsYXRpdmVUby5yb3VuZChkaXJlY3Rpb24pO1xuICAgICAgICBjb25zdCBkaWZmZXJlbmNlSW5PcmllbnRhdGlvbiA9IE1hdGguYWJzKGNlaWxlZE9yRmxvb3JlZE9yaWVudGF0aW9uLmRlZ3JlZXMgLSB0aGlzLmRlZ3JlZXMpICUgOTA7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChuZXcgUm90YXRpb24oTWF0aC5zaWduKGRpcmVjdGlvbikqZGlmZmVyZW5jZUluT3JpZW50YXRpb24pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJvdW5kKGRpcmVjdGlvbjogbnVtYmVyKTogUm90YXRpb24ge1xuICAgICAgICBjb25zdCBkZWcgPSB0aGlzLmRlZ3JlZXMgLyA0NTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbigoZGlyZWN0aW9uID49IDAgPyBNYXRoLmNlaWwoZGVnKSA6IE1hdGguZmxvb3IoZGVnKSkgKiA0NSk7XG4gICAgfVxuXG4gICAgXG59IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU1QUkVDSVNJT046IG51bWJlciA9IDAuMDAxO1xuXG4gICAgc3RhdGljIGVxdWFscyhhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDwgVXRpbHMuSU1QUkVDSVNJT047XG4gICAgfVxuXG4gICAgc3RhdGljIHRyaWxlbW1hKGludDogbnVtYmVyLCBvcHRpb25zOiBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10pOiBzdHJpbmcge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGludCwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKGludCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zWzBdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhbHBoYWJldGljSWQoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYSA8IGIpXG4gICAgICAgICAgICByZXR1cm4gYSArICdfJyArIGI7XG4gICAgICAgIHJldHVybiBiICsgJ18nICsgYTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZWFzZSh4OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDMpIC8gMjtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgVmVjdG9yIHtcbiAgICBzdGF0aWMgVU5JVDogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAtMSk7XG4gICAgc3RhdGljIE5VTEw6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgMCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF94OiBudW1iZXIsIHByaXZhdGUgX3k6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgZ2V0IHgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgfVxuXG4gICAgZ2V0IHkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKTtcbiAgICB9XG5cbiAgICB3aXRoTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLmxlbmd0aCAhPSAwID8gbGVuZ3RoL3RoaXMubGVuZ3RoIDogMDtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54KnJhdGlvLCB0aGlzLnkqcmF0aW8pO1xuICAgIH1cblxuICAgIHNpZ25lZExlbmd0aFByb2plY3RlZEF0KGRpcmVjdGlvbjogUm90YXRpb24pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzID0gVmVjdG9yLlVOSVQucm90YXRlKGRpcmVjdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLmRvdFByb2R1Y3Qocykvcy5kb3RQcm9kdWN0KHMpO1xuICAgIH1cblxuICAgIGFkZCh0aGF0IDogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICsgdGhhdC54LCB0aGlzLnkgKyB0aGF0LnkpO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoYXQueCAtIHRoaXMueCwgdGhhdC55IC0gdGhpcy55KTtcbiAgICB9XG5cbiAgICByb3RhdGUodGhldGE6IFJvdGF0aW9uKTogVmVjdG9yIHtcbiAgICAgICAgbGV0IHJhZDogbnVtYmVyID0gdGhldGEucmFkaWFucztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICogTWF0aC5jb3MocmFkKSAtIHRoaXMueSAqIE1hdGguc2luKHJhZCksIHRoaXMueCAqIE1hdGguc2luKHJhZCkgKyB0aGlzLnkgKiBNYXRoLmNvcyhyYWQpKTtcbiAgICB9XG5cbiAgICBkb3RQcm9kdWN0KHRoYXQ6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLngqdGhhdC54K3RoaXMueSp0aGF0Lnk7XG4gICAgfVxuXG4gICAgc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IHthOiBudW1iZXIsIGI6IG51bWJlcn0ge1xuICAgICAgICBjb25zdCBkZWx0YTogVmVjdG9yID0gdGhpcztcbiAgICAgICAgY29uc3Qgc3dhcFplcm9EaXZpc2lvbiA9IFV0aWxzLmVxdWFscyhkaXIyLnksIDApO1xuICAgICAgICBjb25zdCB4ID0gc3dhcFplcm9EaXZpc2lvbiA/ICd5JyA6ICd4JztcbiAgICAgICAgY29uc3QgeSA9IHN3YXBaZXJvRGl2aXNpb24gPyAneCcgOiAneSc7XG4gICAgICAgIGNvbnN0IGRlbm9taW5hdG9yID0gKGRpcjFbeV0qZGlyMlt4XS1kaXIxW3hdKmRpcjJbeV0pO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGRlbm9taW5hdG9yLCAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHthOiBOYU4sIGI6IE5hTn07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYSA9IChkZWx0YVt5XSpkaXIyW3hdLWRlbHRhW3hdKmRpcjJbeV0pL2Rlbm9taW5hdG9yO1xuICAgICAgICBjb25zdCBiID0gKGEqZGlyMVt5XS1kZWx0YVt5XSkvZGlyMlt5XTtcbiAgICAgICAgcmV0dXJuIHthLCBifTtcbiAgICB9XG5cbiAgICBpc0RlbHRhTWF0Y2hpbmdQYXJhbGxlbChkaXIxOiBWZWN0b3IsIGRpcjI6IFZlY3Rvcik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBhID0gdGhpcy5hbmdsZShkaXIxKS5kZWdyZWVzO1xuICAgICAgICBjb25zdCBiID0gZGlyMS5hbmdsZShkaXIyKS5kZWdyZWVzO1xuICAgICAgICByZXR1cm4gVXRpbHMuZXF1YWxzKGEgJSAxODAsIDApICYmIFV0aWxzLmVxdWFscyhiICUgMTgwLCAwKTtcbiAgICB9XG5cbiAgICBpbmNsaW5hdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy54LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy55ID4gMCA/IDE4MCA6IDApO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueSwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueCA+IDAgPyA5MCA6IC05MCk7XG4gICAgICAgIGNvbnN0IGFkamFjZW50ID0gbmV3IFZlY3RvcigwLC1NYXRoLmFicyh0aGlzLnkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihNYXRoLnNpZ24odGhpcy54KSpNYXRoLmFjb3ModGhpcy5kb3RQcm9kdWN0KGFkamFjZW50KS9hZGphY2VudC5sZW5ndGgvdGhpcy5sZW5ndGgpKjE4MC9NYXRoLlBJKTtcbiAgICB9XG5cbiAgICBhbmdsZShvdGhlcjogVmVjdG9yKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmNsaW5hdGlvbigpLmRlbHRhKG90aGVyLmluY2xpbmF0aW9uKCkpO1xuICAgIH1cblxuICAgIGJvdGhBeGlzTWlucyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54IDwgb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA8IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJvdGhBeGlzTWF4cyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ID4gb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA+IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJldHdlZW4ob3RoZXI6IFZlY3RvciwgeDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5kZWx0YShvdGhlcik7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChkZWx0YS53aXRoTGVuZ3RoKGRlbHRhLmxlbmd0aCp4KSk7XG4gICAgfVxuXG4gICAgZXF1YWxzKG90aGVyOiBWZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PSBvdGhlci54ICYmIHRoaXMueSA9PSBvdGhlci55O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuL0JvdW5kaW5nQm94XCI7XG5cbmV4cG9ydCBjbGFzcyBab29tZXIge1xuICAgIHN0YXRpYyBaT09NX0RVUkFUSU9OID0gMTtcbiAgICBzdGF0aWMgUEFERElOR19GQUNUT1IgPSAyNTtcbiAgICBcbiAgICBwcml2YXRlIGJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgcHJpdmF0ZSBjdXN0b21EdXJhdGlvbiA9IC0xO1xuICAgIHByaXZhdGUgcmVzZXRGbGFnID0gZmFsc2U7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXNTaXplOiBCb3VuZGluZ0JveCwgcHJpdmF0ZSB6b29tTWF4U2NhbGUgPSAzKSB7XG4gICAgfVxuXG4gICAgaW5jbHVkZShib3VuZGluZ0JveDogQm91bmRpbmdCb3gsIGZyb206IEluc3RhbnQsIHRvOiBJbnN0YW50LCBkcmF3OiBib29sZWFuLCBzaG91bGRBbmltYXRlOiBib29sZWFuLCBwYWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IG5vdyA9IGRyYXcgPyBmcm9tIDogdG87XG4gICAgICAgIGlmIChub3cuZmxhZy5pbmNsdWRlcygna2VlcHpvb20nKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldEZsYWcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0RmxhZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9SZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNob3VsZEFuaW1hdGUgJiYgIW5vdy5mbGFnLmluY2x1ZGVzKCdub3pvb20nKSkge1xuICAgICAgICAgICAgICAgIGlmIChwYWQgJiYgIWJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gdGhpcy5wYWRkZWRCb3VuZGluZ0JveChib3VuZGluZ0JveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3gudGwgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJvdGhBeGlzTWlucyhib3VuZGluZ0JveC50bCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC5iciA9IHRoaXMuYm91bmRpbmdCb3guYnIuYm90aEF4aXNNYXhzKGJvdW5kaW5nQm94LmJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZW5mb3JjZWRCb3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGlmICghdGhpcy5ib3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgY29uc3QgcGFkZGVkQm91bmRpbmdCb3ggPSB0aGlzLmJvdW5kaW5nQm94O1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBwYWRkZWRCb3VuZGluZ0JveC5kaW1lbnNpb25zO1xuICAgICAgICAgICAgY29uc3QgY2FudmFzU2l6ZSA9IHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zO1xuICAgICAgICAgICAgY29uc3QgbWluWm9vbVNpemUgPSBuZXcgVmVjdG9yKGNhbnZhc1NpemUueCAvIHRoaXMuem9vbU1heFNjYWxlLCBjYW52YXNTaXplLnkgLyB0aGlzLnpvb21NYXhTY2FsZSk7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHpvb21TaXplLmRlbHRhKG1pblpvb21TaXplKTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxTcGFjaW5nID0gbmV3IFZlY3RvcihNYXRoLm1heCgwLCBkZWx0YS54LzIpLCBNYXRoLm1heCgwLCBkZWx0YS55LzIpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChcbiAgICAgICAgICAgICAgICBwYWRkZWRCb3VuZGluZ0JveC50bC5hZGQoYWRkaXRpb25hbFNwYWNpbmcucm90YXRlKG5ldyBSb3RhdGlvbigxODApKSksXG4gICAgICAgICAgICAgICAgcGFkZGVkQm91bmRpbmdCb3guYnIuYWRkKGFkZGl0aW9uYWxTcGFjaW5nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhZGRlZEJvdW5kaW5nQm94KGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgcGFkZGluZyA9ICh0aGlzLmNhbnZhc1NpemUuZGltZW5zaW9ucy54ICsgdGhpcy5jYW52YXNTaXplLmRpbWVuc2lvbnMueSkvWm9vbWVyLlBBRERJTkdfRkFDVE9SO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFxuICAgICAgICAgICAgYm91bmRpbmdCb3gudGwuYWRkKG5ldyBWZWN0b3IoLXBhZGRpbmcsIC1wYWRkaW5nKSksXG4gICAgICAgICAgICBib3VuZGluZ0JveC5ici5hZGQobmV3IFZlY3RvcihwYWRkaW5nLCBwYWRkaW5nKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgY2VudGVyKCk6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKCFlbmZvcmNlZEJvdW5kaW5nQm94LmlzTnVsbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnggKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLngpLzIpLCBcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChlbmZvcmNlZEJvdW5kaW5nQm94LnRsLnkgKyBlbmZvcmNlZEJvdW5kaW5nQm94LmJyLnkpLzIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXNTaXplLnRsLmJldHdlZW4odGhpcy5jYW52YXNTaXplLmJyLCAwLjUpO1xuICAgIH1cblxuICAgIGdldCBzY2FsZSgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBlbmZvcmNlZEJvdW5kaW5nQm94ID0gdGhpcy5lbmZvcmNlZEJvdW5kaW5nQm94KCk7XG4gICAgICAgIGlmICghZW5mb3JjZWRCb3VuZGluZ0JveC5pc051bGwoKSkge1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBlbmZvcmNlZEJvdW5kaW5nQm94LmRpbWVuc2lvbnM7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuY2FudmFzU2l6ZS5kaW1lbnNpb25zO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKGRlbHRhLnggLyB6b29tU2l6ZS54LCBkZWx0YS55IC8gem9vbVNpemUueSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgZ2V0IGR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmN1c3RvbUR1cmF0aW9uID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tRHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1Jlc2V0KCkge1xuICAgICAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgICAgIHRoaXMuY3VzdG9tRHVyYXRpb24gPSAtMTtcbiAgICAgICAgdGhpcy5yZXNldEZsYWcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucmVzZXRGbGFnID0gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBib3VuZGluZ0JveDogQm91bmRpbmdCb3g7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIF9mcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgcHJpdmF0ZSBfdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgcHJpdmF0ZSBfbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIHByaXZhdGUgX2JvdW5kaW5nQm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXI7XG5cbiAgICBhYnN0cmFjdCBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyO1xuXG59IiwiaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlLCBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEdlbmVyaWNUaW1lZERyYXdhYmxlIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIpIHtcbiAgICAgICAgc3VwZXIoYWRhcHRlcik7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksICFhbmltYXRlID8gMCA6IHRoaXMuYWRhcHRlci5mcm9tLmRlbHRhKHRoaXMuYWRhcHRlci50bykpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuLi9ab29tZXJcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlLCBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2VuSW1hZ2VBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgem9vbTogVmVjdG9yO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBLZW5JbWFnZSBleHRlbmRzIEFic3RyYWN0VGltZWREcmF3YWJsZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYWRhcHRlcjogS2VuSW1hZ2VBZGFwdGVyKSB7XG4gICAgICAgIHN1cGVyKGFkYXB0ZXIpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHpvb21lciA9IG5ldyBab29tZXIodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgICAgIHpvb21lci5pbmNsdWRlKHRoaXMuZ2V0Wm9vbWVkQm91bmRpbmdCb3goKSwgSW5zdGFudC5CSUdfQkFORywgSW5zdGFudC5CSUdfQkFORywgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgIWFuaW1hdGUgPyAwIDogdGhpcy5hZGFwdGVyLmZyb20uZGVsdGEodGhpcy5hZGFwdGVyLnRvKSwgem9vbWVyLmNlbnRlciwgem9vbWVyLnNjYWxlKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Wm9vbWVkQm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBiYm94ID0gdGhpcy5hZGFwdGVyLmJvdW5kaW5nQm94O1xuXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuYWRhcHRlci56b29tO1xuICAgICAgICBpZiAoY2VudGVyICE9IFZlY3Rvci5OVUxMKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tQmJveCA9IGJib3guY2FsY3VsYXRlQm91bmRpbmdCb3hGb3Jab29tKGNlbnRlci54LCBjZW50ZXIueSk7XG4gICAgICAgICAgICByZXR1cm4gem9vbUJib3g7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJib3g7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlLCBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFiZWxBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgZm9yU3RhdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGZvckxpbmU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbiwgY2hpbGRyZW46IExhYmVsQWRhcHRlcltdKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyO1xufVxuXG5leHBvcnQgY2xhc3MgTGFiZWwgZXh0ZW5kcyBBYnN0cmFjdFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBMQUJFTF9IRUlHSFQgPSAxMjtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBMYWJlbEFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgc3VwZXIoYWRhcHRlcik7XG4gICAgfVxuXG4gICAgY2hpbGRyZW46IExhYmVsW10gPSBbXTtcblxuICAgIGhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiB8fCB0aGlzLmFkYXB0ZXIuZm9yTGluZSB8fCAnJztcbiAgICB9XG4gICAgXG4gICAgZ2V0IGZvclN0YXRpb24oKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiB8fCAnJyk7XG4gICAgICAgIGlmIChzID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyLmZvclN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5mb3JTdGF0aW9uO1xuICAgICAgICAgICAgc3RhdGlvbi5hZGRMYWJlbCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChzdGF0aW9uLmxpbmVzRXhpc3RpbmcoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZvclN0YXRpb24oZGVsYXksIHN0YXRpb24sIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFkYXB0ZXIuZm9yTGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlcm1pbmkgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMuYWRhcHRlci5mb3JMaW5lKS50ZXJtaW5pO1xuICAgICAgICAgICAgdGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh0LnN0YXRpb25JZCk7XG4gICAgICAgICAgICAgICAgaWYgKHMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzLmxhYmVscy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGwuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbC5kcmF3KGRlbGF5LCBhbmltYXRlKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdMYWJlbEZvclN0YXRpb24gPSBuZXcgTGFiZWwodGhpcy5hZGFwdGVyLmNsb25lRm9yU3RhdGlvbihzLmlkKSwgdGhpcy5zdGF0aW9uUHJvdmlkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGFiZWxGb3JTdGF0aW9uLmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmFkZExhYmVsKG5ld0xhYmVsRm9yU3RhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2gobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgVmVjdG9yLk5VTEwsIFJvdGF0aW9uLmZyb20oJ24nKSwgW10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0ZvclN0YXRpb24oZGVsYXlTZWNvbmRzOiBudW1iZXIsIHN0YXRpb246IFN0YXRpb24sIGZvckxpbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgYmFzZUNvb3JkID0gc3RhdGlvbi5iYXNlQ29vcmRzO1xuICAgICAgICBsZXQgeU9mZnNldCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxzdGF0aW9uLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbCA9IHN0YXRpb24ubGFiZWxzW2ldO1xuICAgICAgICAgICAgaWYgKGwgPT0gdGhpcylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHlPZmZzZXQgKz0gTGFiZWwuTEFCRUxfSEVJR0hUKjEuNTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYWJlbERpciA9IHN0YXRpb24ubGFiZWxEaXI7XG5cbiAgICAgICAgeU9mZnNldCA9IE1hdGguc2lnbihWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpLnkpKnlPZmZzZXQgLSAoeU9mZnNldD4wID8gMiA6IDApOyAvL1RPRE8gbWFnaWMgbnVtYmVyc1xuICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gc3RhdGlvbi5yb3RhdGlvbjtcbiAgICAgICAgY29uc3QgZGlmZkRpciA9IGxhYmVsRGlyLmFkZChuZXcgUm90YXRpb24oLXN0YXRpb25EaXIuZGVncmVlcykpO1xuICAgICAgICBjb25zdCB1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShkaWZmRGlyKTtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gbmV3IFZlY3RvcihzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneCcsIHVuaXR2LngpLCBzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneScsIHVuaXR2LnkpKTtcbiAgICAgICAgY29uc3QgdGV4dENvb3JkcyA9IGJhc2VDb29yZC5hZGQoYW5jaG9yLnJvdGF0ZShzdGF0aW9uRGlyKSkuYWRkKG5ldyBWZWN0b3IoMCwgeU9mZnNldCkpO1xuICAgIFxuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIHRleHRDb29yZHMsIGxhYmVsRGlyLCB0aGlzLmNoaWxkcmVuLm1hcChjID0+IGMuYWRhcHRlcikpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyLmZvclN0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZvclN0YXRpb24ucmVtb3ZlTGFiZWwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgIGMuZXJhc2UoZGVsYXksIGFuaW1hdGUsIHJldmVyc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4uL05ldHdvcmtcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi9VdGlsc1wiO1xuaW1wb3J0IHsgUHJlZmVycmVkVHJhY2sgfSBmcm9tIFwiLi4vUHJlZmVycmVkVHJhY2tcIjtcbmltcG9ydCB7IEFic3RyYWN0VGltZWREcmF3YWJsZUFkYXB0ZXIsIEFic3RyYWN0VGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmVBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciAge1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgd2VpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgdG90YWxMZW5ndGg6IG51bWJlcjtcbiAgICB0ZXJtaW5pOiBWZWN0b3JbXTtcbiAgICBzcGVlZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGFuaW1PcmRlcjogUm90YXRpb24gfCB1bmRlZmluZWQ7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4sIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlciwgY29sb3JEZXZpYXRpb246IG51bWJlcik6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10sIGNvbG9yRnJvbTogbnVtYmVyLCBjb2xvclRvOiBudW1iZXIpOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGluZSBleHRlbmRzIEFic3RyYWN0VGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIE5PREVfRElTVEFOQ0UgPSAwO1xuICAgIHN0YXRpYyBTUEVFRCA9IDEwMDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBMaW5lQWRhcHRlciwgcHJpdmF0ZSBzdGF0aW9uUHJvdmlkZXI6IFN0YXRpb25Qcm92aWRlciwgcHJpdmF0ZSBiZWNrU3R5bGU6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGFkYXB0ZXIpO1xuICAgIH1cblxuICAgIHdlaWdodCA9IHRoaXMuYWRhcHRlci53ZWlnaHQ7XG4gICAgYW5pbU9yZGVyID0gdGhpcy5hZGFwdGVyLmFuaW1PcmRlcjtcbiAgICBcbiAgICBwcml2YXRlIHByZWNlZGluZ1N0b3A6IFN0YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBwcmVjZWRpbmdEaXI6IFJvdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgX3BhdGg6IFZlY3RvcltdID0gW107XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoISh0aGlzLmFkYXB0ZXIudG90YWxMZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVMaW5lKGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uRHVyYXRpb24odGhpcy5fcGF0aCwgYW5pbWF0ZSk7XG4gICAgICAgIGNvbnN0IGxpbmVHcm91cCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKTtcbiAgICAgICAgbGluZUdyb3VwLmFkZExpbmUodGhpcyk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBkdXJhdGlvbiwgcmV2ZXJzZSwgdGhpcy5fcGF0aCwgdGhpcy5nZXRUb3RhbExlbmd0aCh0aGlzLl9wYXRoKSwgbGluZUdyb3VwLnN0cm9rZUNvbG9yKTtcbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXk6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBjb2xvckRldmlhdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIGxldCBvbGRQYXRoID0gdGhpcy5fcGF0aDtcbiAgICAgICAgaWYgKG9sZFBhdGgubGVuZ3RoIDwgMiB8fCBwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVHJ5aW5nIHRvIG1vdmUgYSBub24tZXhpc3RpbmcgbGluZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbGRQYXRoLmxlbmd0aCAhPSBwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgb2xkUGF0aCA9IFtvbGRQYXRoWzBdLCBvbGRQYXRoW29sZFBhdGgubGVuZ3RoLTFdXTtcbiAgICAgICAgICAgIHBhdGggPSBbcGF0aFswXSwgcGF0aFtwYXRoLmxlbmd0aC0xXV07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGluZUdyb3VwID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCB0aGlzLl9wYXRoLCBwYXRoLCBsaW5lR3JvdXAuc3Ryb2tlQ29sb3IsIGNvbG9yRGV2aWF0aW9uKTtcbiAgICAgICAgbGluZUdyb3VwLnN0cm9rZUNvbG9yID0gY29sb3JEZXZpYXRpb247XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBsZXQgZHVyYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHRoaXMuX3BhdGgsIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSkucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5LCBkdXJhdGlvbiwgcmV2ZXJzZSwgdGhpcy5nZXRUb3RhbExlbmd0aCh0aGlzLl9wYXRoKSk7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8c3RvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLm5hbWUgKyAnOiBTdGF0aW9uIHdpdGggSUQgJyArIHN0b3BzW2pdLnN0YXRpb25JZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICBzdG9wLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgICAgICBzdG9wLmRyYXcoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3BJZCA9ICdoXycgKyBVdGlscy5hbHBoYWJldGljSWQoc3RvcHNbai0xXS5zdGF0aW9uSWQsIHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGhlbHBTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBoZWxwU3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVMaW5lKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9wYXRoO1xuXG4gICAgICAgIGxldCB0cmFjayA9IG5ldyBQcmVmZXJyZWRUcmFjaygnKycpO1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8c3RvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbVN0cmluZyhzdG9wc1tqXS50cmFja0luZm8pO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMubmFtZSArICc6IFN0YXRpb24gd2l0aCBJRCAnICsgc3RvcHNbal0uc3RhdGlvbklkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihzdG9wLmF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3RvcHNbal0uY29vcmQgPSB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RvcCwgdGhpcy5uZXh0U3RvcEJhc2VDb29yZChzdG9wcywgaiwgc3RvcC5iYXNlQ29vcmRzKSwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCB0cnVlKTtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2sua2VlcE9ubHlTaWduKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRTdG9wQmFzZUNvb3JkKHN0b3BzOiBTdG9wW10sIGN1cnJlbnRTdG9wSW5kZXg6IG51bWJlciwgZGVmYXVsdENvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIGlmIChjdXJyZW50U3RvcEluZGV4KzEgPCBzdG9wcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gc3RvcHNbY3VycmVudFN0b3BJbmRleCsxXS5zdGF0aW9uSWQ7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLm5hbWUgKyAnOiBTdGF0aW9uIHdpdGggSUQgJyArIGlkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBzdG9wLmJhc2VDb29yZHM7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRDb29yZHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDb25uZWN0aW9uKHN0YXRpb246IFN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkOiBWZWN0b3IsIHRyYWNrOiBQcmVmZXJyZWRUcmFjaywgcGF0aDogVmVjdG9yW10sIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJlY3Vyc2U6IGJvb2xlYW4pOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBkaXIgPSBzdGF0aW9uLnJvdGF0aW9uO1xuICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgIGNvbnN0IG5ld0RpciA9IHRoaXMuZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIGRpciwgcGF0aCk7XG4gICAgICAgIGNvbnN0IG5ld1BvcyA9IHN0YXRpb24uYXNzaWduVHJhY2sobmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgdHJhY2ssIHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gc3RhdGlvbi5yb3RhdGVkVHJhY2tDb29yZGluYXRlcyhuZXdEaXIsIG5ld1Bvcyk7XG4gICAgXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgXG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMuZ2V0UHJlY2VkaW5nRGlyKHRoaXMucHJlY2VkaW5nRGlyLCB0aGlzLnByZWNlZGluZ1N0b3AsIG9sZENvb3JkLCBuZXdDb29yZCk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gbmV3RGlyLmFkZChkaXIpO1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmluc2VydE5vZGUob2xkQ29vcmQsIHRoaXMucHJlY2VkaW5nRGlyLCBuZXdDb29yZCwgc3RhdGlvbkRpciwgcGF0aCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWZvdW5kICYmIHJlY3Vyc2UgJiYgdGhpcy5wcmVjZWRpbmdTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wID0gdGhpcy5nZXRPckNyZWF0ZUhlbHBlclN0b3AodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgc3RhdGlvbik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSB0aGlzLnByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihoZWxwU3RvcCwgYmFzZUNvb3JkLCB0cmFjay5rZWVwT25seVNpZ24oKSwgcGF0aCwgZGVsYXksIGFuaW1hdGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb25uZWN0aW9uKHN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkLCB0cmFjaywgcGF0aCwgZGVsYXksIGFuaW1hdGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdwYXRoIHRvIGZpeCBvbiBsaW5lJywgdGhpcy5hZGFwdGVyLm5hbWUsICdhdCBzdGF0aW9uJywgc3RhdGlvbi5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHN0YXRpb25EaXI7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGlvbi5hZGRMaW5lKHRoaXMsIG5ld0Rpci5pc1ZlcnRpY2FsKCkgPyAneCcgOiAneScsIG5ld1Bvcyk7XG4gICAgICAgIHBhdGgucHVzaChuZXdDb29yZCk7XG5cbiAgICAgICAgZGVsYXkgPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGgsIGFuaW1hdGUpICsgZGVsYXk7XG4gICAgICAgIHN0YXRpb24uZHJhdyhkZWxheSwgYW5pbWF0ZSk7XG4gICAgICAgIHRoaXMucHJlY2VkaW5nU3RvcCA9IHN0YXRpb247XG4gICAgICAgIHJldHVybiBuZXdDb29yZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFN0b3BPcmllbnRhdGlvbkJhc2VkT25UaHJlZVN0b3BzKHN0YXRpb246IFN0YXRpb24sIG5leHRTdG9wQmFzZUNvb3JkOiBWZWN0b3IsIGRpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogUm90YXRpb24ge1xuICAgICAgICBpZiAocGF0aC5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBwYXRoW3BhdGgubGVuZ3RoLTFdO1xuICAgICAgICAgICAgcmV0dXJuIG5leHRTdG9wQmFzZUNvb3JkLmRlbHRhKG9sZENvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24oZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWx0YSA9IHN0YXRpb24uYmFzZUNvb3Jkcy5kZWx0YShuZXh0U3RvcEJhc2VDb29yZCk7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQXhpcyA9IHN0YXRpb24uYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKHRoaXMubmFtZSk/LmF4aXM7XG4gICAgICAgIGlmIChleGlzdGluZ0F4aXMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1N0b3BPcmllbnRpYXRpb24gPSBkZWx0YS5pbmNsaW5hdGlvbigpLmhhbGZEaXJlY3Rpb24oZGlyLCBleGlzdGluZ0F4aXMgPT0gJ3gnID8gbmV3IFJvdGF0aW9uKDkwKSA6IG5ldyBSb3RhdGlvbigwKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVjZWRpbmdEaXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSBleGlzdGluZ1N0b3BPcmllbnRpYXRpb24uYWRkKGRpcikuYWRkKG5ldyBSb3RhdGlvbigxODApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ1N0b3BPcmllbnRpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlbHRhLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihkaXIpO1xuICAgIH1cbiAgICBcblxuICAgIHByaXZhdGUgZ2V0UHJlY2VkaW5nRGlyKHByZWNlZGluZ0RpcjogUm90YXRpb24gfCB1bmRlZmluZWQsIHByZWNlZGluZ1N0b3A6IFN0YXRpb24gfCB1bmRlZmluZWQsIG9sZENvb3JkOiBWZWN0b3IsIG5ld0Nvb3JkOiBWZWN0b3IpOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChwcmVjZWRpbmdEaXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBwcmVjZWRpbmdTdG9wUm90YXRpb24gPSBwcmVjZWRpbmdTdG9wPy5yb3RhdGlvbiA/PyBuZXcgUm90YXRpb24oMCk7XG4gICAgICAgICAgICBwcmVjZWRpbmdEaXIgPSBvbGRDb29yZC5kZWx0YShuZXdDb29yZCkuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKHByZWNlZGluZ1N0b3BSb3RhdGlvbikuYWRkKHByZWNlZGluZ1N0b3BSb3RhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmVjZWRpbmdEaXIgPSBwcmVjZWRpbmdEaXIuYWRkKG5ldyBSb3RhdGlvbigxODApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJlY2VkaW5nRGlyO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5zZXJ0Tm9kZShmcm9tQ29vcmQ6IFZlY3RvciwgZnJvbURpcjogUm90YXRpb24sIHRvQ29vcmQ6IFZlY3RvciwgdG9EaXI6IFJvdGF0aW9uLCBwYXRoOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuYmVja1N0eWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWx0YTogVmVjdG9yID0gZnJvbUNvb3JkLmRlbHRhKHRvQ29vcmQpO1xuICAgICAgICBjb25zdCBvbGREaXJWID0gVmVjdG9yLlVOSVQucm90YXRlKGZyb21EaXIpO1xuICAgICAgICBjb25zdCBuZXdEaXJWID0gVmVjdG9yLlVOSVQucm90YXRlKHRvRGlyKTtcbiAgICAgICAgaWYgKGRlbHRhLmlzRGVsdGFNYXRjaGluZ1BhcmFsbGVsKG9sZERpclYsIG5ld0RpclYpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb2x1dGlvbiA9IGRlbHRhLnNvbHZlRGVsdGFGb3JJbnRlcnNlY3Rpb24ob2xkRGlyViwgbmV3RGlyVilcbiAgICAgICAgaWYgKHNvbHV0aW9uLmEgPiBMaW5lLk5PREVfRElTVEFOQ0UgJiYgc29sdXRpb24uYiA+IExpbmUuTk9ERV9ESVNUQU5DRSkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKG5ldyBWZWN0b3IoZnJvbUNvb3JkLngrb2xkRGlyVi54KnNvbHV0aW9uLmEsIGZyb21Db29yZC55K29sZERpclYueSpzb2x1dGlvbi5hKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPckNyZWF0ZUhlbHBlclN0b3AoZnJvbURpcjogUm90YXRpb24sIGZyb21TdG9wOiBTdGF0aW9uLCB0b1N0b3A6IFN0YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgaGVscFN0b3BJZCA9ICdoXycgKyBVdGlscy5hbHBoYWJldGljSWQoZnJvbVN0b3AuaWQsIHRvU3RvcC5pZCk7XG4gICAgICAgIGxldCBoZWxwU3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGhlbHBTdG9wSWQpO1xuICAgICAgICBpZiAoaGVscFN0b3AgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IGZyb21TdG9wLmJhc2VDb29yZHM7XG4gICAgICAgICAgICBjb25zdCBuZXdDb29yZCA9IHRvU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBuZXdDb29yZC5kZWx0YShvbGRDb29yZCk7XG4gICAgICAgICAgICBjb25zdCBkZWcgPSBvbGRDb29yZC5kZWx0YShuZXdDb29yZCkuaW5jbGluYXRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZURpciA9IGZyb21TdG9wLnJvdGF0aW9uLm5lYXJlc3RSb3VuZGVkSW5EaXJlY3Rpb24oZGVnLCBmcm9tRGlyLmRlbHRhKGRlZykuZGVncmVlcyk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVDb29yZCA9IGRlbHRhLndpdGhMZW5ndGgoZGVsdGEubGVuZ3RoLzIpLmFkZChuZXdDb29yZCk7XG5cbiAgICAgICAgICAgIGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuY3JlYXRlVmlydHVhbFN0b3AoaGVscFN0b3BJZCwgaW50ZXJtZWRpYXRlQ29vcmQsIGludGVybWVkaWF0ZURpcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlbHBTdG9wO1xuICAgIH1cblxuICAgIGdldCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QW5pbWF0aW9uRHVyYXRpb24odGhpcy5fcGF0aCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHNwZWVkKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuc3BlZWQgfHwgTGluZS5TUEVFRDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGg6IFZlY3RvcltdLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFhbmltYXRlKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRvdGFsTGVuZ3RoKHBhdGgpIC8gdGhpcy5zcGVlZDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRUb3RhbExlbmd0aChwYXRoOiBWZWN0b3JbXSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGFjdHVhbExlbmd0aCA9IHRoaXMuYWRhcHRlci50b3RhbExlbmd0aDtcbiAgICAgICAgaWYgKGFjdHVhbExlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBhY3R1YWxMZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxwYXRoLmxlbmd0aC0xOyBpKyspIHtcbiAgICAgICAgICAgIGxlbmd0aCArPSBwYXRoW2ldLmRlbHRhKHBhdGhbaSsxXSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0IHRlcm1pbmkoKTogU3RvcFtdIHtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGlmIChzdG9wcy5sZW5ndGggPT0gMCkgXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiBbc3RvcHNbMF0sIHN0b3BzW3N0b3BzLmxlbmd0aC0xXV07XG4gICAgfVxuXG4gICAgZ2V0IHBhdGgoKTogVmVjdG9yW10ge1xuICAgICAgICBpZiAodGhpcy5fcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLnRlcm1pbmk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG4gICAgfVxuXG4gICAgZ2V0U3RvcChzdGF0aW9uSWQ6IHN0cmluZyk6IFN0b3AgfCBudWxsIHtcbiAgICAgICAgZm9yIChjb25zdCBzdG9wIG9mIE9iamVjdC52YWx1ZXModGhpcy5hZGFwdGVyLnN0b3BzKSkge1xuICAgICAgICAgICAgaWYgKHN0b3Auc3RhdGlvbklkID09IHN0YXRpb25JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuLi9QcmVmZXJyZWRUcmFja1wiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi9MYWJlbFwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IEFic3RyYWN0VGltZWREcmF3YWJsZSwgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB9IGZyb20gXCIuL0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpb25BZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgYmFzZUNvb3JkczogVmVjdG9yO1xuICAgIHJvdGF0aW9uOiBSb3RhdGlvbjtcbiAgICBsYWJlbERpcjogUm90YXRpb247XG4gICAgaWQ6IHN0cmluZztcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgU3RvcCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHN0YXRpb25JZDogc3RyaW5nLCBwdWJsaWMgdHJhY2tJbmZvOiBzdHJpbmcpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBjb29yZDogVmVjdG9yIHwgbnVsbCA9IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUF0U3RhdGlvbiB7XG4gICAgbGluZT86IExpbmU7XG4gICAgYXhpczogc3RyaW5nO1xuICAgIHRyYWNrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aW9uIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IExpbmVBdFN0YXRpb25bXX0gPSB7eDogW10sIHk6IFtdfTtcbiAgICBwcml2YXRlIGV4aXN0aW5nTGFiZWxzOiBMYWJlbFtdID0gW107XG4gICAgcHJpdmF0ZSBwaGFudG9tPzogTGluZUF0U3RhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhZGFwdGVyOiBTdGF0aW9uQWRhcHRlcikge1xuICAgICAgICBzdXBlcihhZGFwdGVyKTtcbiAgICB9XG5cbiAgICBnZXQgYmFzZUNvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzO1xuICAgIH1cblxuICAgIHNldCBiYXNlQ29vcmRzKGJhc2VDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuYmFzZUNvb3JkcyA9IGJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzLCB0aGlzLmFkYXB0ZXIuYmFzZUNvb3Jkcyk7XG4gICAgfVxuXG4gICAgYWRkTGluZShsaW5lOiBMaW5lLCBheGlzOiBzdHJpbmcsIHRyYWNrOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5waGFudG9tID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10ucHVzaCh7bGluZTogbGluZSwgYXhpczogYXhpcywgdHJhY2s6IHRyYWNrfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGluZShsaW5lOiBMaW5lKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluZUF0QXhpcyhsaW5lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgfVxuXG4gICAgYWRkTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5leGlzdGluZ0xhYmVscy5pbmNsdWRlcyhsYWJlbCkpXG4gICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnB1c2gobGFiZWwpO1xuICAgIH1cblxuICAgIHJlbW92ZUxhYmVsKGxhYmVsOiBMYWJlbCk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5leGlzdGluZ0xhYmVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGFiZWxzW2ldID09IGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGlzdGluZ0xhYmVscy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsYWJlbHMoKTogTGFiZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4aXN0aW5nTGFiZWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlTGluZUF0QXhpcyhsaW5lOiBMaW5lLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBoYW50b20gPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgICAgICBleGlzdGluZ0xpbmVzRm9yQXhpcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZShsaW5lTmFtZTogc3RyaW5nKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLngpO1xuICAgICAgICBpZiAoeCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLnkpO1xuICAgICAgICBpZiAoeSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFja0ZvckxpbmVBdEF4aXMobGluZU5hbWU6IHN0cmluZywgZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0ubGluZT8ubmFtZSA9PSBsaW5lTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFzc2lnblRyYWNrKGF4aXM6IHN0cmluZywgcHJlZmVycmVkVHJhY2s6IFByZWZlcnJlZFRyYWNrLCBsaW5lOiBMaW5lKTogbnVtYmVyIHsgXG4gICAgICAgIGlmIChwcmVmZXJyZWRUcmFjay5oYXNUcmFja051bWJlcigpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2sudHJhY2tOdW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGhhbnRvbT8ubGluZT8ubmFtZSA9PSBsaW5lLm5hbWUgJiYgdGhpcy5waGFudG9tPy5heGlzID09IGF4aXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBoYW50b20/LnRyYWNrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMgPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllcygpW2F4aXNdO1xuICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2suaXNQb3NpdGl2ZSgpID8gcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpc1sxXSArIDEgOiBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzBdIC0gMTtcbiAgICB9XG5cbiAgICByb3RhdGVkVHJhY2tDb29yZGluYXRlcyhpbmNvbWluZ0RpcjogUm90YXRpb24sIGFzc2lnbmVkVHJhY2s6IG51bWJlcik6IFZlY3RvciB7IFxuICAgICAgICBsZXQgbmV3Q29vcmQ6IFZlY3RvcjtcbiAgICAgICAgaWYgKGluY29taW5nRGlyLmRlZ3JlZXMgJSAxODAgPT0gMCkge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKDAsIGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0Nvb3JkID0gbmV3Q29vcmQucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgICAgICBuZXdDb29yZCA9IHRoaXMuYmFzZUNvb3Jkcy5hZGQobmV3Q29vcmQpO1xuICAgICAgICByZXR1cm4gbmV3Q29vcmQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXMoKToge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy54KSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXMueSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gWzEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVmdCA9IDA7XG4gICAgICAgIGxldCByaWdodCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2spIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlZnQgPiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMuZm9yRWFjaChsID0+IGwuZHJhdyhkZWxheVNlY29uZHMsIGZhbHNlKSk7XG4gICAgICAgIGNvbnN0IHQgPSBzdGF0aW9uLnBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdDsgfSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCB0bzogVmVjdG9yKSB7XG4gICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICB0aGlzLmFkYXB0ZXIubW92ZShkZWxheVNlY29uZHMsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5iYXNlQ29vcmRzLCB0bywgKCkgPT4gc3RhdGlvbi5leGlzdGluZ0xhYmVscy5mb3JFYWNoKGwgPT4gbC5kcmF3KDAsIGZhbHNlKSkpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5U2Vjb25kcyk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHN0YXRpb25TaXplRm9yQXhpcyhheGlzOiBzdHJpbmcsIHZlY3RvcjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2ZWN0b3IsIDApKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGNvbnN0IGRpciA9IE1hdGguc2lnbih2ZWN0b3IpO1xuICAgICAgICBsZXQgZGltZW4gPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzW2F4aXNdKVt2ZWN0b3IgPCAwID8gMCA6IDFdO1xuICAgICAgICBpZiAoZGlyKmRpbWVuIDwgMCkge1xuICAgICAgICAgICAgZGltZW4gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbiAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIGRpciAqIChTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiArIFN0YXRpb24uTEFCRUxfRElTVEFOQ0UpO1xuICAgIH1cblxuICAgIGxpbmVzRXhpc3RpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmV4aXN0aW5nTGluZXMueC5sZW5ndGggPiAwIHx8IHRoaXMuZXhpc3RpbmdMaW5lcy55Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBBcnJpdmFsRGVwYXJ0dXJlVGltZSB9IGZyb20gXCIuLi9BcnJpdmFsRGVwYXJ0dXJlVGltZVwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciwgQWJzdHJhY3RUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhaW5BZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB7XG4gICAgc3RvcHM6IFN0b3BbXTtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBmb2xsb3c6IHtwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyfSk6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZvbGxvdzoge3BhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXJ9KTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFpbiBleHRlbmRzIEFic3RyYWN0VGltZWREcmF3YWJsZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYWRhcHRlcjogVHJhaW5BZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIHN1cGVyKGFkYXB0ZXIpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGxpbmVHcm91cCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5uYW1lKVxuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRyYWluIFwiICsgdGhpcy5uYW1lICsgXCIgbmVlZHMgYXQgbGVhc3QgMiBzdG9wc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpPTE7IGk8c3RvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmRlcCA9IG5ldyBBcnJpdmFsRGVwYXJ0dXJlVGltZShzdG9wc1tpXS50cmFja0luZm8pO1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IGxpbmVHcm91cC5nZXRQYXRoQmV0d2VlbihzdG9wc1tpLTFdLnN0YXRpb25JZCwgc3RvcHNbaV0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChwYXRoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBhbmltYXRlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXkgKyBhcnJkZXAuZGVwYXJ0dXJlIC0gdGhpcy5mcm9tLnNlY29uZCwgYXJyZGVwLmFycml2YWwgLSBhcnJkZXAuZGVwYXJ0dXJlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMubmFtZSArICc6IE5vIHBhdGggZm91bmQgYmV0d2VlbiAnICsgc3RvcHNbaS0xXS5zdGF0aW9uSWQgKyAnICcgKyBzdG9wc1tpXS5zdGF0aW9uSWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vc3ZnL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3ZnQW5pbWF0b3IgfSBmcm9tIFwiLi9zdmcvU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IERyYXdhYmxlU29ydGVyIH0gZnJvbSBcIi4vRHJhd2FibGVTb3J0ZXJcIjtcblxubGV0IHRpbWVQYXNzZWQgPSAwO1xuXG5jb25zdCBuZXR3b3JrOiBOZXR3b3JrID0gbmV3IE5ldHdvcmsobmV3IFN2Z05ldHdvcmsoKSwgbmV3IERyYXdhYmxlU29ydGVyKCkpO1xuY29uc3QgYW5pbWF0ZUZyb21JbnN0YW50OiBJbnN0YW50ID0gZ2V0U3RhcnRJbnN0YW50KCk7XG5sZXQgc3RhcnRlZCA9IGZhbHNlO1xuXG5pZiAobmV0d29yay5hdXRvU3RhcnQpIHtcbiAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICBzdGFydFRyYW5zcG9ydE5ldHdvcmtBbmltYXRvcigpO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzdGFydFRyYW5zcG9ydE5ldHdvcmtBbmltYXRvcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3RyYW5zcG9ydC1uZXR3b3JrLWFuaW1hdG9yIGFscmVhZHkgc3RhcnRlZC4gWW91IHNob3VsZCBwcm9iYWJseSBzZXQgZGF0YS1hdXRvLXN0YXJ0PVwiZmFsc2VcIi4gU3RhcnRpbmcgYW55d2F5cy4nKVxuICAgIH1cbiAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICBzdGFydFRyYW5zcG9ydE5ldHdvcmtBbmltYXRvcigpO1xufSk7XG5cbmZ1bmN0aW9uIHN0YXJ0VHJhbnNwb3J0TmV0d29ya0FuaW1hdG9yKCkge1xuICAgIG5ldHdvcmsuaW5pdGlhbGl6ZSgpOyAgICBcbiAgICBzbGlkZShJbnN0YW50LkJJR19CQU5HLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0SW5zdGFudCgpOiBJbnN0YW50IHtcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgICAgICBjb25zdCBhbmltYXRlRnJvbUluc3RhbnQ6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKS5zcGxpdCgnLScpO1xuICAgICAgICBjb25zdCBpbnN0YW50ID0gbmV3IEluc3RhbnQocGFyc2VJbnQoYW5pbWF0ZUZyb21JbnN0YW50WzBdKSB8fCAwLCBwYXJzZUludChhbmltYXRlRnJvbUluc3RhbnRbMV0pIHx8IDAsICcnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Zhc3QgZm9yd2FyZCB0bycsIGluc3RhbnQpO1xuICAgICAgICByZXR1cm4gaW5zdGFudDtcbiAgICB9XG4gICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG59XG5cbmZ1bmN0aW9uIHNsaWRlKGluc3RhbnQ6IEluc3RhbnQsIGFuaW1hdGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoaW5zdGFudCAhPSBJbnN0YW50LkJJR19CQU5HICYmIGluc3RhbnQuZXBvY2ggPj0gYW5pbWF0ZUZyb21JbnN0YW50LmVwb2NoICYmIGluc3RhbnQuc2Vjb25kID49IGFuaW1hdGVGcm9tSW5zdGFudC5zZWNvbmQpXG4gICAgICAgIGFuaW1hdGUgPSB0cnVlO1xuXG4gICAgY29uc29sZS5sb2coaW5zdGFudCwgJ3RpbWU6ICcgKyBNYXRoLmZsb29yKHRpbWVQYXNzZWQgLyA2MCkgKyAnOicgKyB0aW1lUGFzc2VkICUgNjApO1xuXG4gICAgbmV0d29yay5kcmF3VGltZWREcmF3YWJsZXNBdChpbnN0YW50LCBhbmltYXRlKTtcbiAgICBjb25zdCBuZXh0ID0gbmV0d29yay5uZXh0SW5zdGFudChpbnN0YW50KTtcbiAgICBcbiAgICBpZiAobmV4dCkge1xuICAgICAgICBjb25zdCBkZWx0YSA9IGluc3RhbnQuZGVsdGEobmV4dCk7XG4gICAgICAgIHRpbWVQYXNzZWQgKz0gZGVsdGE7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gYW5pbWF0ZSA/IGRlbHRhIDogMDtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheSoxMDAwLCAoKSA9PiBzbGlkZShuZXh0LCBhbmltYXRlKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgQWJzdHJhY3RUaW1lZERyYXdhYmxlQWRhcHRlciB9IGZyb20gXCIuLi9kcmF3YWJsZXMvQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBBYnN0cmFjdFRpbWVkRHJhd2FibGVBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3RvcihyLngsIHIueSksIG5ldyBWZWN0b3Ioci54K3Iud2lkdGgsIHIueStyLmhlaWdodCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBbmltYXRvciB9IGZyb20gXCIuLi9BbmltYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnQW5pbWF0b3IgZXh0ZW5kcyBBbmltYXRvciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbm93KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGltZW91dChjYWxsYmFjazogKCkgPT4gdm9pZCwgZGVsYXlNaWxsaXNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgZGVsYXlNaWxsaXNlY29uZHMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXF1ZXN0RnJhbWUoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzKjEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBLZW5JbWFnZUFkYXB0ZXIgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0ltYWdlXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0tlbkltYWdlIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgS2VuSW1hZ2VBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IHpvb20oKTogVmVjdG9yIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0Wyd6b29tJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFsnem9vbSddLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihwYXJzZUludChjZW50ZXJbMF0pIHx8IDUwLCBwYXJzZUludChjZW50ZXJbMV0pIHx8IDUwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVmVjdG9yLk5VTEw7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWxheVNlY29uZHMqMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyb21DZW50ZXIgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJldHdlZW4odGhpcy5ib3VuZGluZ0JveC5iciwgMC41KVxuICAgICAgICAgICAgICAgIGFuaW1hdG9yXG4gICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyoxMDAwLCAoeCwgaXNMYXN0KSA9PiB0aGlzLmFuaW1hdGVGcmFtZSh4LCBpc0xhc3QsIGZyb21DZW50ZXIsIHpvb21DZW50ZXIsIDEsIHpvb21TY2FsZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGlzTGFzdDogYm9vbGVhbiwgZnJvbUNlbnRlcjogVmVjdG9yLCB0b0NlbnRlcjogVmVjdG9yLCBmcm9tU2NhbGU6IG51bWJlciwgdG9TY2FsZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXNMYXN0KSB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGZyb21DZW50ZXIuZGVsdGEodG9DZW50ZXIpXG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yKGRlbHRhLnggKiB4LCBkZWx0YS55ICogeCkuYWRkKGZyb21DZW50ZXIpO1xuICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSAodG9TY2FsZSAtIGZyb21TY2FsZSkgKiB4ICsgZnJvbVNjYWxlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKGNlbnRlciwgc2NhbGUpOyAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKHRvQ2VudGVyLCB0b1NjYWxlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVpvb20oY2VudGVyOiBWZWN0b3IsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgem9vbWFibGUgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIGlmICh6b29tYWJsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuYm91bmRpbmdCb3gudGwuYmV0d2Vlbih0aGlzLmJvdW5kaW5nQm94LmJyLCAwLjUpO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gb3JpZ2luLnggKyAncHggJyArIG9yaWdpbi55ICsgJ3B4JztcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSB0cmFuc2xhdGUoJyArIChvcmlnaW4ueCAtIGNlbnRlci54KSArICdweCwnICsgKG9yaWdpbi55IC0gY2VudGVyLnkpICsgJ3B4KSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IExhYmVsQWRhcHRlciwgTGFiZWwgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0xhYmVsXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi9VdGlsc1wiO1xuaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIi4uL0JvdW5kaW5nQm94XCI7XG5pbXBvcnQgeyBTdmdBbmltYXRvciB9IGZyb20gXCIuL1N2Z0FuaW1hdG9yXCI7XG5pbXBvcnQgeyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9TdmdBYnN0cmFjdFRpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xhYmVsIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgTGFiZWxBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IGZvclN0YXRpb24oKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb247XG4gICAgfVxuXG4gICAgZ2V0IGZvckxpbmUoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LmxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID09ICd2aXNpYmxlJykge1xuICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KG5ldyBWZWN0b3Ioci54LCByLnkpLCBuZXcgVmVjdG9yKHIueCtyLndpZHRoLCByLnkrci5oZWlnaHQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGV4dENvb3JkcyAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29vcmQodGhpcy5lbGVtZW50LCB0ZXh0Q29vcmRzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdMaW5lTGFiZWxzKGxhYmVsRGlyLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYW5zbGF0ZShib3hEaW1lbjogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgbGFiZWx1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShsYWJlbERpcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di54LCBbLWJveERpbWVuLnggKyAncHgnLCAtYm94RGltZW4ueC8yICsgJ3B4JywgJzBweCddKVxuICAgICAgICAgICAgKyAnLCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di55LCBbLUxhYmVsLkxBQkVMX0hFSUdIVCArICdweCcsIC1MYWJlbC5MQUJFTF9IRUlHSFQvMiArICdweCcsICcwcHgnXSkgLy8gVE9ETyBtYWdpYyBudW1iZXJzXG4gICAgICAgICAgICArICcpJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVscyhsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICBpZiAoYyBpbnN0YW5jZW9mIFN2Z0xhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3TGluZUxhYmVsKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC9NYXRoLm1heCh0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCAxKTtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3RvcihiYm94LndpZHRoL3NjYWxlLCBiYm94LmhlaWdodC9zY2FsZSksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMaW5lTGFiZWwobGFiZWw6IFN2Z0xhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxpbmVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcsICdkaXYnKTtcbiAgICAgICAgbGluZUxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsLmNsYXNzTmFtZXM7XG4gICAgICAgIGxpbmVMYWJlbC5pbm5lckhUTUwgPSBsYWJlbC50ZXh0O1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQobGluZUxhYmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTdGF0aW9uTGFiZWwobGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdmb3Itc3RhdGlvbicpKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgZm9yLXN0YXRpb24nO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZG9taW5hbnRCYXNlbGluZSA9ICdoYW5naW5nJztcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3Rvcih0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLmhlaWdodCksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGdldCBjbGFzc05hbWVzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKyAnICcgKyB0aGlzLmZvckxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyIHtcbiAgICAgICAgY29uc3QgbGluZUxhYmVsOiBTVkdHcmFwaGljc0VsZW1lbnQgPSA8U1ZHR3JhcGhpY3NFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgICAgICBsaW5lTGFiZWwuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBmb3ItbGluZSc7XG4gICAgICAgIGxpbmVMYWJlbC5kYXRhc2V0LnN0YXRpb24gPSBzdGF0aW9uSWQ7XG4gICAgICAgIGxpbmVMYWJlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgICBsaW5lTGFiZWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZW1lbnRzJyk/LmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgICAgIHJldHVybiBuZXcgU3ZnTGFiZWwobGluZUxhYmVsKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBMaW5lQWRhcHRlciB9IGZyb20gXCIuLi9kcmF3YWJsZXMvTGluZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgU3RvcCB9IGZyb20gXCIuLi9kcmF3YWJsZXMvU3RhdGlvblwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiLi4vQm91bmRpbmdCb3hcIjtcbmltcG9ydCB7IFN2Z0FuaW1hdG9yIH0gZnJvbSBcIi4vU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3ZnVXRpbHMgfSBmcm9tIFwiLi9TdmdVdGlsc1wiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xpbmUgZXh0ZW5kcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBMaW5lQWRhcHRlciB7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG4gICAgcHJpdmF0ZSBfYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdQYXRoRWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQubGluZSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRpbmdCb3g7XG4gICAgfVxuXG4gICAgZ2V0IHdlaWdodCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQud2VpZ2h0ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQud2VpZ2h0KTtcbiAgICB9XG5cbiAgICBnZXQgdG90YWxMZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRUb3RhbExlbmd0aCgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFZlY3RvcltdIHtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2QnKTtcbiAgICAgICAgY29uc3QgbnVtYmVycyA9IGQ/LnRyaW0oKS5zcGxpdCgvW15cXGRdKy8pO1xuICAgICAgICBpZiAobnVtYmVycyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcihwYXJzZUludChudW1iZXJzWzFdKSwgcGFyc2VJbnQobnVtYmVyc1syXSkpLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IocGFyc2VJbnQobnVtYmVyc1tudW1iZXJzLmxlbmd0aC0yXSksIHBhcnNlSW50KG51bWJlcnNbbnVtYmVycy5sZW5ndGgtMV0pKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgZ2V0IGFuaW1PcmRlcigpOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5hbmltT3JkZXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmFuaW1PcmRlcik7XG4gICAgfVxuXG4gICAgZ2V0IHNwZWVkKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5zcGVlZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZWxlbWVudC5kYXRhc2V0LnNwZWVkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUJvdW5kaW5nQm94KHBhdGg6IFZlY3RvcltdKTogdm9pZCB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPT0gJ3Zpc2libGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYm91bmRpbmdCb3ggPSBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3RvcihyLngsIHIueSksIG5ldyBWZWN0b3Ioci54K3Iud2lkdGgsIHIueStyLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2JvdW5kaW5nQm94ID0gbmV3IEJvdW5kaW5nQm94KFZlY3Rvci5OVUxMLCBWZWN0b3IuTlVMTCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpPTA7aTxwYXRoLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kaW5nQm94LnRsID0gdGhpcy5fYm91bmRpbmdCb3gudGwuYm90aEF4aXNNaW5zKHBhdGhbaV0pO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRpbmdCb3guYnIgPSB0aGlzLl9ib3VuZGluZ0JveC5ici5ib3RoQXhpc01heHMocGF0aFtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9wcyA9IFN2Z1V0aWxzLnJlYWRTdG9wcyh0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3BzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBwYXRoOiBWZWN0b3JbXSwgbGVuZ3RoOiBudW1iZXIsIGNvbG9yRGV2aWF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveChwYXRoKTtcblxuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyAqIDEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIGxpbmUgJyArIHRoaXMubmFtZTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHBhdGgpO1xuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICBpZiAoY29sb3JEZXZpYXRpb24gIT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3IoY29sb3JEZXZpYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHJldmVyc2UgPyAtMSA6IDE7XG4gICAgICAgICAgICBhbmltYXRvclxuICAgICAgICAgICAgICAgIC5mcm9tKGxlbmd0aCpkaXJlY3Rpb24pXG4gICAgICAgICAgICAgICAgLnRvKDApXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzICogMTAwMCwgKHg6IG51bWJlciwgaXNMYXN0OiBib29sZWFuKSA9PiB0aGlzLmFuaW1hdGVGcmFtZSh4LCBpc0xhc3QpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10sIGNvbG9yRnJvbTogbnVtYmVyLCBjb2xvclRvOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCh0byk7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzKjEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGFuaW1hdG9yLmFuaW1hdGUoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzKjEwMDAsICh4LCBpc0xhc3QpID0+IHRoaXMuYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb20sIHRvLCBjb2xvckZyb20sIGNvbG9yVG8sIHgsIGlzTGFzdCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4sIGxlbmd0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzICogMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZyb20gPSAwO1xuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9IGxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHJldmVyc2UgPyAtMSA6IDE7XG4gICAgICAgICAgICBhbmltYXRvclxuICAgICAgICAgICAgICAgIC5mcm9tKGZyb20pXG4gICAgICAgICAgICAgICAgLnRvKGxlbmd0aCpkaXJlY3Rpb24pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzKjEwMDAsICh4LCBpc0xhc3QpID0+IHRoaXMuYW5pbWF0ZUZyYW1lKHgsIGlzTGFzdCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVBhdGgocGF0aDogVmVjdG9yW10pIHtcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkID0gJ00nICsgcGF0aC5tYXAodiA9PiB2LngrJywnK3YueSkuam9pbignIEwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGFzaGFycmF5KGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBkYXNoZWRQYXJ0ID0gbGVuZ3RoICsgJyc7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLnN0cm9rZURhc2hhcnJheS5yZXBsYWNlKC9bXjAtOVxccyxdKy9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcmVzZXRBcnJheSA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgICAgICBpZiAocHJlc2V0QXJyYXkubGVuZ3RoICUgMiA9PSAxKVxuICAgICAgICAgICAgICAgIHByZXNldEFycmF5ID0gcHJlc2V0QXJyYXkuY29uY2F0KHByZXNldEFycmF5KTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldExlbmd0aCA9IHByZXNldEFycmF5Lm1hcChhID0+IHBhcnNlSW50KGEpIHx8IDApLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuICAgICAgICAgICAgZGFzaGVkUGFydCA9IG5ldyBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gcHJlc2V0TGVuZ3RoICsgMSkpLmpvaW4ocHJlc2V0QXJyYXkuam9pbignICcpICsgJyAnKSArICcwJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gZGFzaGVkUGFydCArICcgJyArIGxlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNvbG9yKGRldmlhdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2UgPSAncmdiKCcgKyBNYXRoLm1heCgwLCBkZXZpYXRpb24pICogMjU2ICsgJywgMCwgJyArIE1hdGgubWluKDAsIGRldmlhdGlvbikgKiAtMjU2ICsgJyknO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGlzTGFzdDogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHggKyAnJztcbiAgICAgICAgaWYgKGlzTGFzdCAmJiB4ICE9IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWVWZWN0b3IoZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSwgY29sb3JGcm9tOiBudW1iZXIsIGNvbG9yVG86IG51bWJlciwgeDogbnVtYmVyLCBpc0xhc3Q6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFpc0xhc3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVycG9sYXRlZCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZWQucHVzaChmcm9tW2ldLmJldHdlZW4odG9baV0sIHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KGludGVycG9sYXRlZFswXS5kZWx0YShpbnRlcnBvbGF0ZWRbaW50ZXJwb2xhdGVkLmxlbmd0aC0xXSkubGVuZ3RoKTsgLy8gVE9ETyBhcmJpdHJhcnkgbm9kZSBjb3VudFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKGludGVycG9sYXRlZCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbG9yKChjb2xvclRvLWNvbG9yRnJvbSkqeCtjb2xvckZyb20pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkodG9bMF0uZGVsdGEodG9bdG8ubGVuZ3RoLTFdKS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHRvKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTmV0d29ya0FkYXB0ZXIsIE5ldHdvcmssIFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9UaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi4vZHJhd2FibGVzL1N0YXRpb25cIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0xpbmVcIjtcbmltcG9ydCB7IFN2Z0xpbmUgfSBmcm9tIFwiLi9TdmdMaW5lXCI7XG5pbXBvcnQgeyBTdmdTdGF0aW9uIH0gZnJvbSBcIi4vU3ZnU3RhdGlvblwiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0xhYmVsXCI7XG5pbXBvcnQgeyBTdmdMYWJlbCB9IGZyb20gXCIuL1N2Z0xhYmVsXCI7XG5pbXBvcnQgeyBHZW5lcmljVGltZWREcmF3YWJsZSB9IGZyb20gXCIuLi9kcmF3YWJsZXMvR2VuZXJpY1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuLi9ab29tZXJcIjtcbmltcG9ydCB7IFRyYWluIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9UcmFpblwiO1xuaW1wb3J0IHsgU3ZnVHJhaW4gfSBmcm9tIFwiLi9TdmdUcmFpblwiO1xuaW1wb3J0IHsgU3ZnQW5pbWF0b3IgfSBmcm9tIFwiLi9TdmdBbmltYXRvclwiO1xuaW1wb3J0IHsgU3ZnS2VuSW1hZ2UgfSBmcm9tIFwiLi9TdmdJbWFnZVwiO1xuaW1wb3J0IHsgS2VuSW1hZ2UgfSBmcm9tIFwiLi4vZHJhd2FibGVzL0ltYWdlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdOZXR3b3JrIGltcGxlbWVudHMgTmV0d29ya0FkYXB0ZXIge1xuXG4gICAgc3RhdGljIFNWR05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbUNlbnRlcjogVmVjdG9yID0gVmVjdG9yLk5VTEw7XG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbVNjYWxlOiBudW1iZXIgPSAxO1xuXG4gICAgZ2V0IGNhbnZhc1NpemUoKTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgICAgY29uc3QgYm94ID0gc3ZnPy52aWV3Qm94LmJhc2VWYWw7XG4gICAgICAgIGlmIChib3gpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gobmV3IFZlY3Rvcihib3gueCwgYm94LnkpLCBuZXcgVmVjdG9yKGJveC54K2JveC53aWR0aCwgYm94LnkrYm94LmhlaWdodCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goVmVjdG9yLk5VTEwsIFZlY3Rvci5OVUxMKTsgICAgICAgIFxuICAgIH1cblxuICAgIGdldCBhdXRvU3RhcnQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmF1dG9TdGFydCAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGdldCB6b29tTWF4U2NhbGUoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIGlmIChzdmc/LmRhdGFzZXQuem9vbU1heFNjYWxlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIDM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN2Zz8uZGF0YXNldC56b29tTWF4U2NhbGUpO1xuICAgIH1cblxuICAgIGdldCBiZWNrU3R5bGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmJlY2tTdHlsZSAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWxlbWVudHNcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQSBncm91cCB3aXRoIHRoZSBpZCBcImVsZW1lbnRzXCIgaXMgbWlzc2luZyBpbiB0aGUgU1ZHIHNvdXJjZS4gSXQgbWlnaHQgYmUgbmVlZGVkIGZvciBoZWxwZXIgc3RhdGlvbnMgYW5kIGxhYmVscy4nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIik7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudDogVGltZWREcmF3YWJsZSB8IG51bGwgPSB0aGlzLm1pcnJvckVsZW1lbnQoZWxlbWVudHNbaV0sIG5ldHdvcmspO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuYWRkVG9JbmRleChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWlycm9yRWxlbWVudChlbGVtZW50OiBhbnksIG5ldHdvcms6IFN0YXRpb25Qcm92aWRlcik6IFRpbWVkRHJhd2FibGUgfCBudWxsIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJyAmJiBlbGVtZW50LmRhdGFzZXQubGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGluZShuZXcgU3ZnTGluZShlbGVtZW50KSwgbmV0d29yaywgdGhpcy5iZWNrU3R5bGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJyAmJiBlbGVtZW50LmRhdGFzZXQudHJhaW4gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRyYWluKG5ldyBTdmdUcmFpbihlbGVtZW50KSwgbmV0d29yayk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3JlY3QnICYmIGVsZW1lbnQuZGF0YXNldC5zdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGVsZW1lbnQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGFiZWwobmV3IFN2Z0xhYmVsKGVsZW1lbnQpLCBuZXR3b3JrKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAnaW1hZ2UnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEtlbkltYWdlKG5ldyBTdmdLZW5JbWFnZShlbGVtZW50KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5kYXRhc2V0LmZyb20gIT0gdW5kZWZpbmVkIHx8IGVsZW1lbnQuZGF0YXNldC50byAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBHZW5lcmljVGltZWREcmF3YWJsZShuZXcgU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUoZWxlbWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGhlbHBTdG9wID0gPFNWR1JlY3RFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnTmV0d29yay5TVkdOUywgJ3JlY3QnKTtcbiAgICAgICAgaGVscFN0b3Auc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRpb24nLCBpZCk7XG4gICAgICAgIGhlbHBTdG9wLnNldEF0dHJpYnV0ZSgnZGF0YS1kaXInLCByb3RhdGlvbi5uYW1lKTtcbiAgICAgICAgdGhpcy5zZXRDb29yZChoZWxwU3RvcCwgYmFzZUNvb3Jkcyk7XG4gICAgICAgIGhlbHBTdG9wLmNsYXNzTmFtZS5iYXNlVmFsID0gJ2hlbHBlcic7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbGVtZW50cycpPy5hcHBlbmRDaGlsZChoZWxwU3RvcCk7XG4gICAgICAgIHJldHVybiBuZXcgU3RhdGlvbihuZXcgU3ZnU3RhdGlvbihoZWxwU3RvcCkpOyAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDb29yZChlbGVtZW50OiBhbnksIGNvb3JkOiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3gnLCBjb29yZC54KTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBjb29yZC55KTtcbiAgICB9XG5cbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnZXBvY2gnLCB7IGRldGFpbDogZXBvY2ggfSk7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICBcbiAgICAgICAgbGV0IGVwb2NoTGFiZWw7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXBvY2gtbGFiZWwnKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVwb2NoTGFiZWwgPSA8U1ZHVGV4dEVsZW1lbnQ+IDx1bmtub3duPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXBvY2gtbGFiZWwnKTtcbiAgICAgICAgICAgIGVwb2NoTGFiZWwudGV4dENvbnRlbnQgPSBlcG9jaDsgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG4gICBcbiAgICB6b29tVG8oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3IgPSBuZXcgU3ZnQW5pbWF0b3IoKTtcbiAgICAgICAgY29uc3QgZGVmYXVsdEJlaGF2aW91ciA9IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA8PSBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgYW5pbWF0b3Iud2FpdChkZWZhdWx0QmVoYXZpb3VyID8gMCA6IFpvb21lci5aT09NX0RVUkFUSU9OICogMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFpvb21DZW50ZXIgPSB0aGlzLmN1cnJlbnRab29tQ2VudGVyO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFpvb21TY2FsZSA9IHRoaXMuY3VycmVudFpvb21TY2FsZTtcbiAgICAgICAgICAgIGFuaW1hdG9yXG4gICAgICAgICAgICAgICAgLmVhc2UoZGVmYXVsdEJlaGF2aW91ciA/IFN2Z0FuaW1hdG9yLkVBU0VfQ1VCSUMgOiBTdmdBbmltYXRvci5FQVNFX05PTkUpXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzICogMTAwMCwgKHgsIGlzTGFzdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZSh4LCBpc0xhc3QsIGN1cnJlbnRab29tQ2VudGVyLCB6b29tQ2VudGVyLCBjdXJyZW50Wm9vbVNjYWxlLCB6b29tU2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFpvb21DZW50ZXIgPSB6b29tQ2VudGVyO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Wm9vbVNjYWxlID0gem9vbVNjYWxlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGlzTGFzdDogYm9vbGVhbiwgZnJvbUNlbnRlcjogVmVjdG9yLCB0b0NlbnRlcjogVmVjdG9yLCBmcm9tU2NhbGU6IG51bWJlciwgdG9TY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghaXNMYXN0KSB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGZyb21DZW50ZXIuZGVsdGEodG9DZW50ZXIpXG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yKGRlbHRhLnggKiB4LCBkZWx0YS55ICogeCkuYWRkKGZyb21DZW50ZXIpO1xuICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSAodG9TY2FsZSAtIGZyb21TY2FsZSkgKiB4ICsgZnJvbVNjYWxlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKGNlbnRlciwgc2NhbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVab29tKHRvQ2VudGVyLCB0b1NjYWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlWm9vbShjZW50ZXI6IFZlY3Rvciwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBjb25zdCB6b29tYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tYWJsZScpO1xuICAgICAgICBpZiAoem9vbWFibGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmNhbnZhc1NpemUudGwuYmV0d2Vlbih0aGlzLmNhbnZhc1NpemUuYnIsIDAuNSk7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBvcmlnaW4ueCArICdweCAnICsgb3JpZ2luLnkgKyAncHgnO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZSArICcpIHRyYW5zbGF0ZSgnICsgKG9yaWdpbi54IC0gY2VudGVyLngpICsgJ3B4LCcgKyAob3JpZ2luLnkgLSBjZW50ZXIueSkgKyAncHgpJztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFN0YXRpb25BZGFwdGVyLCBTdGF0aW9uIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3ZnQW5pbWF0b3IgfSBmcm9tIFwiLi9TdmdBbmltYXRvclwiO1xuaW1wb3J0IHsgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdTdGF0aW9uIGV4dGVuZHMgU3ZnQWJzdHJhY3RUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgU3RhdGlvbkFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1lbnQ6IFNWR1JlY3RFbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIG5lZWRzIHRvIGhhdmUgYSBkYXRhLXN0YXRpb24gaWRlbnRpZmllcicpO1xuICAgIH1cblxuICAgIGdldCBiYXNlQ29vcmRzKCk6IFZlY3RvciB7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneCcpIHx8ICcnKSB8fCAwLCBwYXJzZUludCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd5JykgfHwgJycpIHx8IDApO1xuICAgIH1cblxuICAgIHNldCBiYXNlQ29vcmRzKGJhc2VDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgYmFzZUNvb3Jkcy54ICsgJycpOyBcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGJhc2VDb29yZHMueSArICcnKTsgXG4gICAgfVxuXG4gICAgZ2V0IHJvdGF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQuZGlyIHx8ICduJyk7XG4gICAgfVxuICAgIGdldCBsYWJlbERpcigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmxhYmVsRGlyIHx8ICduJyk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzOiAoKSA9PiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbkJvdW5kYXJpZXMgPSBnZXRQb3NpdGlvbkJvdW5kYXJpZXMoKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3BEaW1lbiA9IFtwb3NpdGlvbkJvdW5kYXJpZXMueFsxXSAtIHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCBwb3NpdGlvbkJvdW5kYXJpZXMueVsxXSAtIHBvc2l0aW9uQm91bmRhcmllcy55WzBdXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwuaW5jbHVkZXMoJ3N0YXRpb24nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIHN0YXRpb24gJyArIHRoaXMuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9IHN0b3BEaW1lblswXSA8IDAgJiYgc3RvcERpbWVuWzFdIDwgMCA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAoTWF0aC5tYXgoc3RvcERpbWVuWzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIChNYXRoLm1heChzdG9wRGltZW5bMV0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4pICsgJycpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsJ3JvdGF0ZSgnICsgdGhpcy5yb3RhdGlvbi5kZWdyZWVzICsgJykgdHJhbnNsYXRlKCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnhbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcsJyArIChNYXRoLm1pbihwb3NpdGlvbkJvdW5kYXJpZXMueVswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgLSBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiAvIDIpICsgJyknKTtcbiAgICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCB0aGlzLmJhc2VDb29yZHMueCArICcgJyArIHRoaXMuYmFzZUNvb3Jkcy55KTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBhbmltYXRvclxuICAgICAgICAgICAgICAgIC5hbmltYXRlKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyoxMDAwLCAoeCwgaXNMYXN0KSA9PiB0aGlzLmFuaW1hdGVGcmFtZVZlY3Rvcih4LCBpc0xhc3QsIGZyb20sIHRvLCBjYWxsYmFjaykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZVZlY3Rvcih4OiBudW1iZXIsIGlzTGFzdDogYm9vbGVhbiwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWlzTGFzdCkge1xuICAgICAgICAgICAgdGhpcy5iYXNlQ29vcmRzID0gZnJvbS5iZXR3ZWVuKHRvLCB4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZUNvb3JkcyA9IHRvO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzKjEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9TdGF0aW9uXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCB9IGZyb20gXCIuLi9Cb3VuZGluZ0JveFwiO1xuaW1wb3J0IHsgVHJhaW5BZGFwdGVyIH0gZnJvbSBcIi4uL2RyYXdhYmxlcy9UcmFpblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN2Z0FuaW1hdG9yIH0gZnJvbSBcIi4vU3ZnQW5pbWF0b3JcIjtcbmltcG9ydCB7IFN2Z0Fic3RyYWN0VGltZWREcmF3YWJsZSB9IGZyb20gXCIuL1N2Z0Fic3RyYWN0VGltZWREcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3ZnVXRpbHMgfSBmcm9tIFwiLi9TdmdVdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgU3ZnVHJhaW4gZXh0ZW5kcyBTdmdBYnN0cmFjdFRpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBUcmFpbkFkYXB0ZXIge1xuICAgIHN0YXRpYyBXQUdPTl9MRU5HVEggPSAxMDtcbiAgICBzdGF0aWMgVFJBQ0tfT0ZGU0VUID0gMDtcblxuICAgIHByaXZhdGUgX3N0b3BzOiBTdG9wW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBTVkdQYXRoRWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQudHJhaW4gfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChWZWN0b3IuTlVMTCwgVmVjdG9yLk5VTEwpO1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0Lmxlbmd0aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmVsZW1lbnQuZGF0YXNldC5sZW5ndGgpO1xuICAgIH1cblxuICAgIGdldCBzdG9wcygpOiBTdG9wW10ge1xuICAgICAgICBpZiAodGhpcy5fc3RvcHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3BzID0gU3ZnVXRpbHMucmVhZFN0b3BzKHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0b3BzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcHM7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgZm9sbG93OiB7IHBhdGg6IFZlY3RvcltdLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIgfSk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IG5ldyBTdmdBbmltYXRvcigpO1xuICAgICAgICBhbmltYXRvci53YWl0KGRlbGF5U2Vjb25kcyoxMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFBhdGgodGhpcy5jYWxjVHJhaW5IaW5nZXModGhpcy5nZXRQYXRoTGVuZ3RoKGZvbGxvdykubGVuZ3RoVG9TdGFydCwgZm9sbG93LnBhdGgpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIHRyYWluJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICB9KTsgICAgICAgIFxuICAgIH1cblxuICAgIG1vdmUoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBmb2xsb3c6IHsgcGF0aDogVmVjdG9yW10sIGZyb206IG51bWJlciwgdG86IG51bWJlciB9KSB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzKjEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhMZW5ndGggPSB0aGlzLmdldFBhdGhMZW5ndGgoZm9sbG93KTtcblxuICAgICAgICAgICAgYW5pbWF0b3JcbiAgICAgICAgICAgICAgICAuZWFzZShTdmdBbmltYXRvci5FQVNFX1NJTkUpXG4gICAgICAgICAgICAgICAgLmZyb20ocGF0aExlbmd0aC5sZW5ndGhUb1N0YXJ0KVxuICAgICAgICAgICAgICAgIC50byhwYXRoTGVuZ3RoLmxlbmd0aFRvU3RhcnQrcGF0aExlbmd0aC50b3RhbEJvdW5kZWRMZW5ndGgpXG4gICAgICAgICAgICAgICAgLnRpbWVQYXNzZWQoZGVsYXlTZWNvbmRzIDwgMCA/ICgtZGVsYXlTZWNvbmRzKjEwMDApIDogMClcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZShhbmltYXRpb25EdXJhdGlvblNlY29uZHMqMTAwMCwgKHgsIGlzTGFzdCkgPT4gdGhpcy5hbmltYXRlRnJhbWUoeCwgZm9sbG93LnBhdGgpKTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQYXRoTGVuZ3RoKGZvbGxvdzogeyBwYXRoOiBWZWN0b3JbXSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyIH0pOiB7IGxlbmd0aFRvU3RhcnQ6IG51bWJlciwgdG90YWxCb3VuZGVkTGVuZ3RoOiBudW1iZXIgfSB7XG4gICAgICAgIGxldCBsZW5ndGhUb1N0YXJ0ID0gMDtcbiAgICAgICAgbGV0IHRvdGFsQm91bmRlZExlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9sbG93LnBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gZm9sbG93LnBhdGhbaV0uZGVsdGEoZm9sbG93LnBhdGhbaSArIDFdKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoaSA8IGZvbGxvdy5mcm9tKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoVG9TdGFydCArPSBsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpIDwgZm9sbG93LnRvKSB7XG4gICAgICAgICAgICAgICAgdG90YWxCb3VuZGVkTGVuZ3RoICs9IGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgbGVuZ3RoVG9TdGFydDogbGVuZ3RoVG9TdGFydCwgdG90YWxCb3VuZGVkTGVuZ3RoOiB0b3RhbEJvdW5kZWRMZW5ndGggfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBvc2l0aW9uQnlMZW5ndGgoY3VycmVudDogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSk6IFZlY3RvciB7XG4gICAgICAgIGxldCB0aHJlc2ggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IHBhdGhbaV0uZGVsdGEocGF0aFtpICsgMV0pO1xuICAgICAgICAgICAgY29uc3QgbCA9IGRlbHRhLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICh0aHJlc2ggKyBsID49IGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aFtpXS5iZXR3ZWVuKHBhdGhbaSArIDFdLCAoY3VycmVudCAtIHRocmVzaCkgLyBsKS5hZGQoZGVsdGEucm90YXRlKG5ldyBSb3RhdGlvbig5MCkpLndpdGhMZW5ndGgoU3ZnVHJhaW4uVFJBQ0tfT0ZGU0VUKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJlc2ggKz0gbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFuaW1hdG9yID0gbmV3IFN2Z0FuaW1hdG9yKCk7XG4gICAgICAgIGFuaW1hdG9yLndhaXQoZGVsYXlTZWNvbmRzKjEwMDAsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0UGF0aChwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBjb25zdCBkID0gJ00nICsgcGF0aC5tYXAodiA9PiB2LnggKyAnLCcgKyB2LnkpLmpvaW4oJyBMJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2QnLCBkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNUcmFpbkhpbmdlcyhmcm9udDogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSk6IFZlY3RvcltdIHtcbiAgICAgICAgY29uc3QgbmV3VHJhaW46IFZlY3RvcltdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGggKyAxOyBpKyspIHtcbiAgICAgICAgICAgIG5ld1RyYWluLnB1c2godGhpcy5nZXRQb3NpdGlvbkJ5TGVuZ3RoKGZyb250IC0gaSAqIFN2Z1RyYWluLldBR09OX0xFTkdUSCwgcGF0aCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdUcmFpbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIHBhdGg6IFZlY3RvcltdKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHRyYWluUGF0aCA9IHRoaXMuY2FsY1RyYWluSGluZ2VzKHgsIHBhdGgpO1xuICAgICAgICB0aGlzLnNldFBhdGgodHJhaW5QYXRoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSIsImltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi4vZHJhd2FibGVzL1N0YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1V0aWxzIHtcblxuICAgIHN0YXRpYyByZWFkU3RvcHMoc3RvcHNTdHJpbmc6IHN0cmluZyB8IHVuZGVmaW5lZCk6IFN0b3BbXSB7XG4gICAgICAgIGNvbnN0IHN0b3BzIDogU3RvcFtdID0gW107XG4gICAgICAgIGNvbnN0IHRva2VucyA9IHN0b3BzU3RyaW5nPy5zcGxpdCgvXFxzKy8pIHx8IFtdO1xuICAgICAgICBsZXQgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucz8ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0b2tlbnNbaV1bMF0gIT0gJy0nICYmIHRva2Vuc1tpXVswXSAhPSAnKycgJiYgdG9rZW5zW2ldWzBdICE9ICcqJykge1xuICAgICAgICAgICAgICAgIG5leHRTdG9wLnN0YXRpb25JZCA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICBzdG9wcy5wdXNoKG5leHRTdG9wKTtcbiAgICAgICAgICAgICAgICBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHRTdG9wLnRyYWNrSW5mbyA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcHM7XG4gICAgfVxuXG59Il0sInNvdXJjZVJvb3QiOiIifQ==