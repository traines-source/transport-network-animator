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

class GenericTimedDrawable {
    constructor(adapter) {
        this.adapter = adapter;
        this.from = this.adapter.from;
        this.to = this.adapter.to;
        this.name = this.adapter.name;
    }
    draw(delay, animate) {
        this.adapter.draw(delay);
        return 0;
    }
    erase(delay, animate, reverse) {
        this.adapter.erase(delay);
        return 0;
    }
    get boundingBox() {
        const bbox = this.adapter.boundingBox;
        const center = this.adapter.zoom;
        if (this.adapter.zoom != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            const zoomBbox = this.calculateBoundingBoxForZoom(center.x, center.y, bbox);
            console.log('zoom', zoomBbox);
            return zoomBbox;
        }
        return bbox;
    }
    calculateBoundingBoxForZoom(percentX, percentY, bbox) {
        const delta = bbox.tl.delta(bbox.br);
        const relativeCenter = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](percentX / 100, percentY / 100);
        const center = bbox.tl.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](delta.x * relativeCenter.x, delta.y * relativeCenter.y));
        const edgeDistance = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](delta.x * Math.min(relativeCenter.x, 1 - relativeCenter.x), delta.y * Math.min(relativeCenter.y, 1 - relativeCenter.y));
        return { tl: center.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](-edgeDistance.x, -edgeDistance.y)), br: center.add(edgeDistance) };
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
        console.log(this.edges);
        this.assertDistances(solution);
        return this.moveStationsAndLines(solution, delay, animate);
    }
    initialize() {
        if (this.averageEuclidianLengthRatio == -1 && Object.values(this.edges).length > 0) {
            this.averageEuclidianLengthRatio = this.getWeightsSum() / this.getEuclidianDistanceSum();
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
            console.log(delta);
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
            const deviation = Math.abs(1 - Math.sqrt(Math.pow(this.deltaX(solution, this.vertices, edge.termini), 2) +
                Math.pow(this.deltaY(solution, this.vertices, edge.termini), 2)) / (this.initialWeightFactors[key] * (edge.weight || 0)));
            if (deviation > Gravitator.DEVIATION_WARNING) {
                console.warn(edge.name, 'diverges by ', deviation);
            }
        }
    }
    moveStationsAndLines(solution, delay, animate) {
        const animationDurationSeconds = animate ? this.getTotalDistanceToMove(solution) / Gravitator.SPEED : 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.move(delay, animationDurationSeconds, new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](solution[vertex.index.x], solution[vertex.index.y]));
        }
        for (const edge of Object.values(this.edges)) {
            edge.move(delay, animationDurationSeconds, [this.getNewStationPosition(edge.termini[0].stationId, solution), this.getNewStationPosition(edge.termini[1].stationId, solution)]);
        }
        delay += animationDurationSeconds;
        return delay;
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
Gravitator.DEVIATION_WARNING = 0.1;
Gravitator.INITIALIZE_RELATIVE_TO_EUCLIDIAN_DISTANCE = true;
Gravitator.SPEED = 250;


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
        this.path = [];
    }
    draw(delay, animate) {
        const stops = this.adapter.stops;
        const path = this.path;
        let track = new _PreferredTrack__WEBPACK_IMPORTED_MODULE_3__["PreferredTrack"]('+');
        for (let j = 0; j < stops.length; j++) {
            track = track.fromString(stops[j].preferredTrack);
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error('Station with ID ' + stops[j].stationId + ' is undefined');
            if (path.length == 0)
                track = track.fromExistingLineAtStation(stop.axisAndTrackForExistingLine(this.name));
            this.createConnection(stop, this.nextStopBaseCoord(stops, j, stop.baseCoords), track, path, delay, animate, true);
            track = track.keepOnlySign();
        }
        let duration = this.getAnimationDuration(path, animate);
        this.stationProvider.lineGroupById(this.name).addLine(this);
        this.adapter.draw(delay, duration, path, this.getTotalLength(path));
        return duration;
    }
    move(delay, animationDurationSeconds, path) {
        let oldPath = this.path;
        if (oldPath.length < 2 || path.length < 2) {
            console.warn('Trying to move a non existing line');
            return;
        }
        if (oldPath.length != path.length) {
            oldPath = [oldPath[0], oldPath[oldPath.length - 1]];
            path = [path[0], path[path.length - 1]];
        }
        this.adapter.move(delay, animationDurationSeconds, this.path, path);
        this.path = path;
    }
    erase(delay, animate, reverse) {
        let duration = this.getAnimationDuration(this.path, animate);
        this.stationProvider.lineGroupById(this.name).removeLine(this);
        this.adapter.erase(delay, duration, reverse, this.getTotalLength(this.path));
        const stops = this.adapter.stops;
        for (let j = 0; j < stops.length; j++) {
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error('Station with ID ' + stops[j].stationId + ' is undefined');
            stop.removeLine(this);
            stop.draw(delay);
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
                throw new Error('Station with ID ' + id + ' is undefined');
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
                this.createConnection(station, nextStopBaseCoord, track, path, delay, animate, false);
                return;
            }
            else if (!found) {
                console.warn('path to fix on line', this.adapter.name, 'at station', station.id);
            }
            this.precedingDir = stationDir;
        }
        station.addLine(this, newDir.isVertical() ? 'x' : 'y', newPos);
        path.push(newCoord);
        delay = this.getAnimationDuration(path, animate) + delay;
        station.draw(delay);
        this.precedingStop = station;
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

class LineGroup {
    constructor() {
        this.lines = [];
        this._termini = [];
    }
    addLine(line) {
        if (!this.lines.includes(line))
            this.lines.push(line);
        this.updateTermini();
    }
    removeLine(line) {
        let i = 0;
        while (i < this.lines.length) {
            if (this.lines[i] == line) {
                this.lines.splice(i, 1);
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
    updateTermini() {
        const candidates = {};
        this.lines.forEach(l => {
            const lineTermini = l.termini;
            lineTermini.forEach(t => {
                if (!t.preferredTrack.includes('*')) {
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
/* harmony import */ var _Zoomer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Zoomer */ "./src/Zoomer.ts");
/* harmony import */ var _LineGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LineGroup */ "./src/LineGroup.ts");
/* harmony import */ var _Gravitator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Gravitator */ "./src/Gravitator.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Line */ "./src/Line.ts");





class Network {
    constructor(adapter) {
        this.adapter = adapter;
        this.slideIndex = {};
        this.stations = {};
        this.lineGroups = {};
        this.eraseBuffer = [];
        this.gravitator = new _Gravitator__WEBPACK_IMPORTED_MODULE_3__["Gravitator"](this);
    }
    initialize() {
        this.adapter.initialize(this);
    }
    stationById(id) {
        if (this.stations[id] == undefined) {
            const station = this.adapter.stationById(id);
            if (station != null)
                this.stations[id] = station;
        }
        return this.stations[id];
    }
    lineGroupById(id) {
        if (this.lineGroups[id] == undefined) {
            this.lineGroups[id] = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["LineGroup"]();
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
        const zoomer = new _Zoomer__WEBPACK_IMPORTED_MODULE_1__["Zoomer"](this.adapter.canvasSize);
        this.displayInstant(now);
        const elements = this.timedDrawablesAt(now);
        let delay = _Zoomer__WEBPACK_IMPORTED_MODULE_1__["Zoomer"].ZOOM_DURATION;
        for (let i = 0; i < elements.length; i++) {
            delay = this.drawOrEraseElement(elements[i], delay, animate, now, zoomer);
        }
        delay = this.flushEraseBuffer(delay, animate, zoomer);
        console.log(now);
        delay = this.gravitator.gravitate(delay, animate);
        this.adapter.zoomTo(zoomer.center, zoomer.scale, zoomer.duration);
        return delay;
    }
    flushEraseBuffer(delay, animate, zoomer) {
        for (let i = this.eraseBuffer.length - 1; i >= 0; i--) {
            const element = this.eraseBuffer[i];
            const shouldAnimate = this.shouldAnimate(element.to, animate);
            delay += this.eraseElement(element, delay, shouldAnimate);
            zoomer.include(element, false, shouldAnimate);
        }
        this.eraseBuffer = [];
        return delay;
    }
    drawOrEraseElement(element, delay, animate, instant, zoomer) {
        if (instant.equals(element.to) && !element.from.equals(element.to)) {
            if (this.eraseBuffer.length > 0 && this.eraseBuffer[this.eraseBuffer.length - 1].name != element.name) {
                delay = this.flushEraseBuffer(delay, animate, zoomer);
            }
            this.eraseBuffer.push(element);
            return delay;
        }
        delay = this.flushEraseBuffer(delay, animate, zoomer);
        const shouldAnimate = this.shouldAnimate(element.from, animate);
        delay += this.drawElement(element, delay, shouldAnimate);
        zoomer.include(element, true, shouldAnimate);
        return delay;
    }
    drawElement(element, delay, animate) {
        if (element instanceof _Line__WEBPACK_IMPORTED_MODULE_4__["Line"]) {
            this.gravitator.addEdge(element);
        }
        return element.draw(delay, animate);
    }
    eraseElement(element, delay, animate) {
        return element.erase(delay, animate, element.to.flag == 'reverse');
    }
    shouldAnimate(instant, animate) {
        if (!animate)
            return false;
        if (instant.flag == 'noanim')
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


class Stop {
    constructor(stationId, preferredTrack) {
        this.stationId = stationId;
        this.preferredTrack = preferredTrack;
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
    }
    get baseCoords() {
        return this.adapter.baseCoords;
    }
    set baseCoords(baseCoords) {
        this.adapter.baseCoords = baseCoords;
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
    draw(delaySeconds) {
        const station = this;
        this.existingLabels.forEach(l => l.draw(delaySeconds, false));
        const t = station.positionBoundaries();
        this.adapter.draw(delaySeconds, function () { return t; });
    }
    move(delaySeconds, animationDurationSeconds, to) {
        const station = this;
        this.adapter.move(delaySeconds, animationDurationSeconds, this.baseCoords, to, () => station.existingLabels.forEach(l => l.draw(0, false)));
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


class Zoomer {
    constructor(canvasSize) {
        this.canvasSize = canvasSize;
        this.boundingBox = { tl: _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, br: _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL };
        this.customDuration = 0;
    }
    include(element, draw, shouldAnimate) {
        let boundingBox = element.boundingBox;
        const now = draw ? element.from : element.to;
        if (shouldAnimate && !now.flag.includes('nozoom')) {
            if (now.flag.includes('slowzoom') && draw) {
                this.customDuration = element.from.delta(element.to);
            }
            else {
                boundingBox = this.paddedBoundingBox(boundingBox);
            }
            this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(boundingBox.tl);
            this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(boundingBox.br);
        }
    }
    enforcedBoundingBox() {
        if (this.boundingBox.tl != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL && this.boundingBox.br != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            const paddedBoundingBox = this.boundingBox;
            const zoomSize = paddedBoundingBox.tl.delta(paddedBoundingBox.br);
            const minZoomSize = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](this.canvasSize.x / Zoomer.ZOOM_MAX_SCALE, this.canvasSize.y / Zoomer.ZOOM_MAX_SCALE);
            const delta = zoomSize.delta(minZoomSize);
            const additionalSpacing = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](Math.max(0, delta.x / 2), Math.max(0, delta.y / 2));
            return {
                tl: paddedBoundingBox.tl.add(additionalSpacing.rotate(new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](180))),
                br: paddedBoundingBox.br.add(additionalSpacing)
            };
        }
        return this.boundingBox;
    }
    paddedBoundingBox(boundingBox) {
        const padding = (this.canvasSize.x + this.canvasSize.y) / Zoomer.PADDING_FACTOR;
        return {
            tl: boundingBox.tl.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](-padding, -padding)),
            br: boundingBox.br.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](padding, padding))
        };
    }
    get center() {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL && enforcedBoundingBox.br != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](Math.round((enforcedBoundingBox.tl.x + enforcedBoundingBox.br.x) / 2), Math.round((enforcedBoundingBox.tl.y + enforcedBoundingBox.br.y) / 2));
        }
        return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](this.canvasSize.x / 2, this.canvasSize.y / 2);
    }
    get scale() {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL && enforcedBoundingBox.br != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            const zoomSize = enforcedBoundingBox.tl.delta(enforcedBoundingBox.br);
            return Math.min(this.canvasSize.x / zoomSize.x, this.canvasSize.y / zoomSize.y);
        }
        return 1;
    }
    get duration() {
        if (this.customDuration == 0) {
            return Zoomer.ZOOM_DURATION;
        }
        return this.customDuration;
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
    if (instant.epoch == animateFromInstant.epoch && instant.second >= animateFromInstant.second)
        animate = true;
    network.drawTimedDrawablesAt(instant, animate);
    const next = network.nextInstant(instant);
    if (next) {
        const delay = animate ? instant.delta(next) : 0;
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
        const bbox = { tl: new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x, r.y), br: new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](r.x + r.width, r.y + r.height) };
        console.log('bbox', bbox);
        return bbox;
    }
    get zoom() {
        if (this.element.dataset['zoom'] != undefined) {
            const center = this.element.dataset['zoom'].split(' ');
            return new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](parseInt(center[0]) || 50, parseInt(center[1]) || 50);
        }
        return _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].NULL;
    }
    draw(delaySeconds) {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function () { label.draw(0); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'visible';
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
            return { tl: new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](r.x, r.y), br: new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](r.x + r.width, r.y + r.height) };
        }
        return { tl: _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"].NULL, br: _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"].NULL };
    }
    draw(delaySeconds, textCoords, labelDir, children) {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function () { label.draw(0, textCoords, labelDir, children); }, delaySeconds * 1000);
            return;
        }
        this.setCoord(this.element, textCoords);
        if (children.length > 0) {
            this.drawLineLabels(labelDir, children);
        }
        else {
            this.drawStationLabel(labelDir);
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




class SvgLine {
    constructor(element) {
        this.element = element;
        this._stops = [];
        this.boundingBox = { tl: _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL, br: _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL };
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
                    nextStop.preferredTrack = tokens[i];
                }
            }
        }
        return this._stops;
    }
    draw(delaySeconds, animationDurationSeconds, path, length) {
        this.updateBoundingBox(path);
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.draw(0, animationDurationSeconds, path, length); }, delaySeconds * 1000);
            return;
        }
        this.element.className.baseVal += ' ' + this.name;
        this.createPath(path);
        this.updateDasharray(length);
        if (animationDurationSeconds == 0) {
            length = 0;
        }
        this.animateFrame(length, 0, -length / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS);
    }
    move(delaySeconds, animationDurationSeconds, from, to) {
        this.updateBoundingBox(to);
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.move(0, animationDurationSeconds, from, to); }, delaySeconds * 1000);
            return;
        }
        this.animateFrameVector(from, to, 0, 1 / animationDurationSeconds / _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__["SvgNetwork"].FPS);
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
    animateFrameVector(from, to, x, animationPerFrame) {
        if (x < 1) {
            const interpolated = [];
            for (let i = 0; i < from.length; i++) {
                interpolated.push(from[i].between(to[i], x));
            }
            this.updateDasharray(interpolated[0].delta(interpolated[interpolated.length - 1]).length); // TODO arbitrary node count
            this.createPath(interpolated);
            x += animationPerFrame;
            const line = this;
            window.requestAnimationFrame(function () { line.animateFrameVector(from, to, x, animationPerFrame); });
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
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Vector */ "./src/Vector.ts");
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Station */ "./src/Station.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Line */ "./src/Line.ts");
/* harmony import */ var _SvgLine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgLine */ "./src/svg/SvgLine.ts");
/* harmony import */ var _SvgStation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgStation */ "./src/svg/SvgStation.ts");
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Label */ "./src/Label.ts");
/* harmony import */ var _SvgLabel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SvgLabel */ "./src/svg/SvgLabel.ts");
/* harmony import */ var _GenericTimedDrawable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../GenericTimedDrawable */ "./src/GenericTimedDrawable.ts");
/* harmony import */ var _SvgGenericTimedDrawable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SvgGenericTimedDrawable */ "./src/svg/SvgGenericTimedDrawable.ts");









class SvgNetwork {
    constructor() {
        this.currentZoomCenter = _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL;
        this.currentZoomScale = 1;
    }
    get canvasSize() {
        const svg = document.querySelector('svg');
        const box = svg === null || svg === void 0 ? void 0 : svg.viewBox.baseVal;
        if (box) {
            return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](box.width, box.height);
        }
        return _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL;
    }
    get beckStyle() {
        const svg = document.querySelector('svg');
        return (svg === null || svg === void 0 ? void 0 : svg.dataset.beckStyle) != 'false';
    }
    initialize(network) {
        var _a;
        let elements = (_a = document.getElementById('elements')) === null || _a === void 0 ? void 0 : _a.children;
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
        if (element.localName == 'path') {
            return new _Line__WEBPACK_IMPORTED_MODULE_2__["Line"](new _SvgLine__WEBPACK_IMPORTED_MODULE_3__["SvgLine"](element), network, this.beckStyle);
        }
        else if (element.localName == 'text') {
            return new _Label__WEBPACK_IMPORTED_MODULE_5__["Label"](new _SvgLabel__WEBPACK_IMPORTED_MODULE_6__["SvgLabel"](element), network);
        }
        return new _GenericTimedDrawable__WEBPACK_IMPORTED_MODULE_7__["GenericTimedDrawable"](new _SvgGenericTimedDrawable__WEBPACK_IMPORTED_MODULE_8__["SvgGenericTimedDrawable"](element));
    }
    stationById(id) {
        const element = document.getElementById(id);
        if (element != undefined) {
            return new _Station__WEBPACK_IMPORTED_MODULE_1__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_4__["SvgStation"](element));
        }
        return null;
    }
    createVirtualStop(id, baseCoords, rotation) {
        var _a;
        const helpStop = document.createElementNS(SvgNetwork.SVGNS, 'rect');
        helpStop.id = id;
        helpStop.setAttribute('data-dir', rotation.name);
        this.setCoord(helpStop, baseCoords);
        helpStop.className.baseVal = 'helper';
        (_a = document.getElementById('stations')) === null || _a === void 0 ? void 0 : _a.appendChild(helpStop);
        return new _Station__WEBPACK_IMPORTED_MODULE_1__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_4__["SvgStation"](helpStop));
    }
    ;
    setCoord(element, coord) {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }
    drawEpoch(epoch) {
        let epochLabel;
        if (document.getElementById('epoch-label') != undefined) {
            epochLabel = document.getElementById('epoch-label');
            epochLabel.textContent = epoch;
        }
    }
    zoomTo(zoomCenter, zoomScale, animationDurationSeconds) {
        console.log(zoomCenter, zoomScale, animationDurationSeconds);
        this.animateFrame(0, animationDurationSeconds / SvgNetwork.FPS, this.currentZoomCenter, zoomCenter, this.currentZoomScale, zoomScale);
        this.currentZoomCenter = zoomCenter;
        this.currentZoomScale = zoomScale;
    }
    animateFrame(x, animationPerFrame, fromCenter, toCenter, fromScale, toScale) {
        if (x < 1) {
            x += animationPerFrame;
            const ease = this.ease(x);
            const delta = fromCenter.delta(toCenter);
            const center = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](delta.x * ease, delta.y * ease).add(fromCenter);
            const scale = (toScale - fromScale) * ease + fromScale;
            this.updateZoom(center, scale);
            const network = this;
            window.requestAnimationFrame(function () { network.animateFrame(x, animationPerFrame, fromCenter, toCenter, fromScale, toScale); });
        }
        else {
            this.updateZoom(toCenter, toScale);
        }
    }
    ease(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    updateZoom(center, scale) {
        const zoomable = document.getElementById('zoomable');
        if (zoomable != undefined) {
            zoomable.style.transformOrigin = 'center';
            zoomable.style.transform = 'scale(' + scale + ') translate(' + (this.canvasSize.x / 2 - center.x) + 'px,' + (this.canvasSize.y / 2 - center.y) + 'px)';
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




class SvgStation {
    constructor(element) {
        this.element = element;
    }
    get id() {
        return this.element.id;
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
        if (delaySeconds > 0) {
            const station = this;
            window.setTimeout(function () { station.draw(0, getPositionBoundaries); }, delaySeconds * 1000);
            return;
        }
        const positionBoundaries = getPositionBoundaries();
        const stopDimen = [positionBoundaries.x[1] - positionBoundaries.x[0], positionBoundaries.y[1] - positionBoundaries.y[0]];
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
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvR2VuZXJpY1RpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXZpdGF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luc3RhbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xhYmVsLnRzIiwid2VicGFjazovLy8uL3NyYy9MaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9MaW5lR3JvdXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL05ldHdvcmsudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ByZWZlcnJlZFRyYWNrLnRzIiwid2VicGFjazovLy8uL3NyYy9Sb3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvWm9vbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdMYWJlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ZnL1N2Z0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N2Zy9TdmdOZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9zdmcvU3ZnU3RhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FB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a0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25IO2FBQU07WUFDSCxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUM3QixRQUFRLEVBQUUsQ0FBQztTQUNkO0lBQ0wsQ0FBQztDQUVKIiwiZmlsZSI6Im5ldHdvcmstYW5pbWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgICAoZmFjdG9yeSgoZ2xvYmFsLmZtaW4gPSBnbG9iYWwuZm1pbiB8fCB7fSkpKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqIGZpbmRzIHRoZSB6ZXJvcyBvZiBhIGZ1bmN0aW9uLCBnaXZlbiB0d28gc3RhcnRpbmcgcG9pbnRzICh3aGljaCBtdXN0XG4gICAgICogaGF2ZSBvcHBvc2l0ZSBzaWducyAqL1xuICAgIGZ1bmN0aW9uIGJpc2VjdChmLCBhLCBiLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtZXRlcnMubWF4SXRlcmF0aW9ucyB8fCAxMDAsXG4gICAgICAgICAgICB0b2xlcmFuY2UgPSBwYXJhbWV0ZXJzLnRvbGVyYW5jZSB8fCAxZS0xMCxcbiAgICAgICAgICAgIGZBID0gZihhKSxcbiAgICAgICAgICAgIGZCID0gZihiKSxcbiAgICAgICAgICAgIGRlbHRhID0gYiAtIGE7XG5cbiAgICAgICAgaWYgKGZBICogZkIgPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkluaXRpYWwgYmlzZWN0IHBvaW50cyBtdXN0IGhhdmUgb3Bwb3NpdGUgc2lnbnNcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmQSA9PT0gMCkgcmV0dXJuIGE7XG4gICAgICAgIGlmIChmQiA9PT0gMCkgcmV0dXJuIGI7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGRlbHRhIC89IDI7XG4gICAgICAgICAgICB2YXIgbWlkID0gYSArIGRlbHRhLFxuICAgICAgICAgICAgICAgIGZNaWQgPSBmKG1pZCk7XG5cbiAgICAgICAgICAgIGlmIChmTWlkICogZkEgPj0gMCkge1xuICAgICAgICAgICAgICAgIGEgPSBtaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoTWF0aC5hYnMoZGVsdGEpIDwgdG9sZXJhbmNlKSB8fCAoZk1pZCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhICsgZGVsdGE7XG4gICAgfVxuXG4gICAgLy8gbmVlZCBzb21lIGJhc2ljIG9wZXJhdGlvbnMgb24gdmVjdG9ycywgcmF0aGVyIHRoYW4gYWRkaW5nIGEgZGVwZW5kZW5jeSxcbiAgICAvLyBqdXN0IGRlZmluZSBoZXJlXG4gICAgZnVuY3Rpb24gemVyb3MoeCkgeyB2YXIgciA9IG5ldyBBcnJheSh4KTsgZm9yICh2YXIgaSA9IDA7IGkgPCB4OyArK2kpIHsgcltpXSA9IDA7IH0gcmV0dXJuIHI7IH1cbiAgICBmdW5jdGlvbiB6ZXJvc00oeCx5KSB7IHJldHVybiB6ZXJvcyh4KS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiB6ZXJvcyh5KTsgfSk7IH1cblxuICAgIGZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gICAgICAgIHZhciByZXQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJldCArPSBhW2ldICogYltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm0yKGEpICB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZG90KGEsIGEpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZShyZXQsIHZhbHVlLCBjKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJldFtpXSA9IHZhbHVlW2ldICogYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlaWdodGVkU3VtKHJldCwgdzEsIHYxLCB3MiwgdjIpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIHJldFtqXSA9IHcxICogdjFbal0gKyB3MiAqIHYyW2pdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIG1pbmltaXplcyBhIGZ1bmN0aW9uIHVzaW5nIHRoZSBkb3duaGlsbCBzaW1wbGV4IG1ldGhvZCAqL1xuICAgIGZ1bmN0aW9uIG5lbGRlck1lYWQoZiwgeDAsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgfHwge307XG5cbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJzLm1heEl0ZXJhdGlvbnMgfHwgeDAubGVuZ3RoICogMjAwLFxuICAgICAgICAgICAgbm9uWmVyb0RlbHRhID0gcGFyYW1ldGVycy5ub25aZXJvRGVsdGEgfHwgMS4wNSxcbiAgICAgICAgICAgIHplcm9EZWx0YSA9IHBhcmFtZXRlcnMuemVyb0RlbHRhIHx8IDAuMDAxLFxuICAgICAgICAgICAgbWluRXJyb3JEZWx0YSA9IHBhcmFtZXRlcnMubWluRXJyb3JEZWx0YSB8fCAxZS02LFxuICAgICAgICAgICAgbWluVG9sZXJhbmNlID0gcGFyYW1ldGVycy5taW5FcnJvckRlbHRhIHx8IDFlLTUsXG4gICAgICAgICAgICByaG8gPSAocGFyYW1ldGVycy5yaG8gIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnJobyA6IDEsXG4gICAgICAgICAgICBjaGkgPSAocGFyYW1ldGVycy5jaGkgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLmNoaSA6IDIsXG4gICAgICAgICAgICBwc2kgPSAocGFyYW1ldGVycy5wc2kgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnBzaSA6IC0wLjUsXG4gICAgICAgICAgICBzaWdtYSA9IChwYXJhbWV0ZXJzLnNpZ21hICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5zaWdtYSA6IDAuNSxcbiAgICAgICAgICAgIG1heERpZmY7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBzaW1wbGV4LlxuICAgICAgICB2YXIgTiA9IHgwLmxlbmd0aCxcbiAgICAgICAgICAgIHNpbXBsZXggPSBuZXcgQXJyYXkoTiArIDEpO1xuICAgICAgICBzaW1wbGV4WzBdID0geDA7XG4gICAgICAgIHNpbXBsZXhbMF0uZnggPSBmKHgwKTtcbiAgICAgICAgc2ltcGxleFswXS5pZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSB4MC5zbGljZSgpO1xuICAgICAgICAgICAgcG9pbnRbaV0gPSBwb2ludFtpXSA/IHBvaW50W2ldICogbm9uWmVyb0RlbHRhIDogemVyb0RlbHRhO1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdID0gcG9pbnQ7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0uZnggPSBmKHBvaW50KTtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXS5pZCA9IGkrMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNpbXBsZXgodmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzaW1wbGV4W05dW2ldID0gdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaW1wbGV4W05dLmZ4ID0gdmFsdWUuZng7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc29ydE9yZGVyID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS5meCAtIGIuZng7IH07XG5cbiAgICAgICAgdmFyIGNlbnRyb2lkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIHJlZmxlY3RlZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICBjb250cmFjdGVkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIGV4cGFuZGVkID0geDAuc2xpY2UoKTtcblxuICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCBtYXhJdGVyYXRpb25zOyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgc2ltcGxleC5zb3J0KHNvcnRPcmRlcik7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb3B5IHRoZSBzaW1wbGV4IChzaW5jZSBsYXRlciBpdGVyYXRpb25zIHdpbGwgbXV0YXRlKSBhbmRcbiAgICAgICAgICAgICAgICAvLyBzb3J0IGl0IHRvIGhhdmUgYSBjb25zaXN0ZW50IG9yZGVyIGJldHdlZW4gaXRlcmF0aW9uc1xuICAgICAgICAgICAgICAgIHZhciBzb3J0ZWRTaW1wbGV4ID0gc2ltcGxleC5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0geC5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5meCA9IHguZng7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmlkID0geC5pZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNvcnRlZFNpbXBsZXguc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEuaWQgLSBiLmlkOyB9KTtcblxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuaGlzdG9yeS5wdXNoKHt4OiBzaW1wbGV4WzBdLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBzaW1wbGV4WzBdLmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGV4OiBzb3J0ZWRTaW1wbGV4fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1heERpZmYgPSAwO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgICAgIG1heERpZmYgPSBNYXRoLm1heChtYXhEaWZmLCBNYXRoLmFicyhzaW1wbGV4WzBdW2ldIC0gc2ltcGxleFsxXVtpXSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKE1hdGguYWJzKHNpbXBsZXhbMF0uZnggLSBzaW1wbGV4W05dLmZ4KSA8IG1pbkVycm9yRGVsdGEpICYmXG4gICAgICAgICAgICAgICAgKG1heERpZmYgPCBtaW5Ub2xlcmFuY2UpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbXB1dGUgdGhlIGNlbnRyb2lkIG9mIGFsbCBidXQgdGhlIHdvcnN0IHBvaW50IGluIHRoZSBzaW1wbGV4XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICAgICAgY2VudHJvaWRbaV0gPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldICs9IHNpbXBsZXhbal1baV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldIC89IE47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlZmxlY3QgdGhlIHdvcnN0IHBvaW50IHBhc3QgdGhlIGNlbnRyb2lkICBhbmQgY29tcHV0ZSBsb3NzIGF0IHJlZmxlY3RlZFxuICAgICAgICAgICAgLy8gcG9pbnRcbiAgICAgICAgICAgIHZhciB3b3JzdCA9IHNpbXBsZXhbTl07XG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShyZWZsZWN0ZWQsIDErcmhvLCBjZW50cm9pZCwgLXJobywgd29yc3QpO1xuICAgICAgICAgICAgcmVmbGVjdGVkLmZ4ID0gZihyZWZsZWN0ZWQpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgcmVmbGVjdGVkIHBvaW50IGlzIHRoZSBiZXN0IHNlZW4sIHRoZW4gcG9zc2libHkgZXhwYW5kXG4gICAgICAgICAgICBpZiAocmVmbGVjdGVkLmZ4IDwgc2ltcGxleFswXS5meCkge1xuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKGV4cGFuZGVkLCAxK2NoaSwgY2VudHJvaWQsIC1jaGksIHdvcnN0KTtcbiAgICAgICAgICAgICAgICBleHBhbmRlZC5meCA9IGYoZXhwYW5kZWQpO1xuICAgICAgICAgICAgICAgIGlmIChleHBhbmRlZC5meCA8IHJlZmxlY3RlZC5meCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICB9ICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChyZWZsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlZmxlY3RlZCBwb2ludCBpcyB3b3JzZSB0aGFuIHRoZSBzZWNvbmQgd29yc3QsIHdlIG5lZWQgdG9cbiAgICAgICAgICAgIC8vIGNvbnRyYWN0XG4gICAgICAgICAgICBlbHNlIGlmIChyZWZsZWN0ZWQuZnggPj0gc2ltcGxleFtOLTFdLmZ4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3VsZFJlZHVjZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlZmxlY3RlZC5meCA+IHdvcnN0LmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGFuIGluc2lkZSBjb250cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShjb250cmFjdGVkLCAxK3BzaSwgY2VudHJvaWQsIC1wc2ksIHdvcnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3RlZC5meCA9IGYoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cmFjdGVkLmZ4IDwgd29yc3QuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRSZWR1Y2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYW4gb3V0c2lkZSBjb250cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShjb250cmFjdGVkLCAxLXBzaSAqIHJobywgY2VudHJvaWQsIHBzaSpyaG8sIHdvcnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3RlZC5meCA9IGYoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cmFjdGVkLmZ4IDwgcmVmbGVjdGVkLmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRSZWR1Y2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZG9uJ3QgY29udHJhY3QgaGVyZSwgd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2lnbWEgPj0gMSkgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYSByZWR1Y3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IHNpbXBsZXgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHNpbXBsZXhbaV0sIDEgLSBzaWdtYSwgc2ltcGxleFswXSwgc2lnbWEsIHNpbXBsZXhbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxleFtpXS5meCA9IGYoc2ltcGxleFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgocmVmbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNpbXBsZXguc29ydChzb3J0T3JkZXIpO1xuICAgICAgICByZXR1cm4ge2Z4IDogc2ltcGxleFswXS5meCxcbiAgICAgICAgICAgICAgICB4IDogc2ltcGxleFswXX07XG4gICAgfVxuXG4gICAgLy8vIHNlYXJjaGVzIGFsb25nIGxpbmUgJ3BrJyBmb3IgYSBwb2ludCB0aGF0IHNhdGlmaWVzIHRoZSB3b2xmZSBjb25kaXRpb25zXG4gICAgLy8vIFNlZSAnTnVtZXJpY2FsIE9wdGltaXphdGlvbicgYnkgTm9jZWRhbCBhbmQgV3JpZ2h0IHA1OS02MFxuICAgIC8vLyBmIDogb2JqZWN0aXZlIGZ1bmN0aW9uXG4gICAgLy8vIHBrIDogc2VhcmNoIGRpcmVjdGlvblxuICAgIC8vLyBjdXJyZW50OiBvYmplY3QgY29udGFpbmluZyBjdXJyZW50IGdyYWRpZW50L2xvc3NcbiAgICAvLy8gbmV4dDogb3V0cHV0OiBjb250YWlucyBuZXh0IGdyYWRpZW50L2xvc3NcbiAgICAvLy8gcmV0dXJucyBhOiBzdGVwIHNpemUgdGFrZW5cbiAgICBmdW5jdGlvbiB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGEsIGMxLCBjMikge1xuICAgICAgICB2YXIgcGhpMCA9IGN1cnJlbnQuZngsIHBoaVByaW1lMCA9IGRvdChjdXJyZW50LmZ4cHJpbWUsIHBrKSxcbiAgICAgICAgICAgIHBoaSA9IHBoaTAsIHBoaV9vbGQgPSBwaGkwLFxuICAgICAgICAgICAgcGhpUHJpbWUgPSBwaGlQcmltZTAsXG4gICAgICAgICAgICBhMCA9IDA7XG5cbiAgICAgICAgYSA9IGEgfHwgMTtcbiAgICAgICAgYzEgPSBjMSB8fCAxZS02O1xuICAgICAgICBjMiA9IGMyIHx8IDAuMTtcblxuICAgICAgICBmdW5jdGlvbiB6b29tKGFfbG8sIGFfaGlnaCwgcGhpX2xvKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCAxNjsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBhID0gKGFfbG8gKyBhX2hpZ2gpLzI7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0obmV4dC54LCAxLjAsIGN1cnJlbnQueCwgYSwgcGspO1xuICAgICAgICAgICAgICAgIHBoaSA9IG5leHQuZnggPSBmKG5leHQueCwgbmV4dC5meHByaW1lKTtcbiAgICAgICAgICAgICAgICBwaGlQcmltZSA9IGRvdChuZXh0LmZ4cHJpbWUsIHBrKTtcblxuICAgICAgICAgICAgICAgIGlmICgocGhpID4gKHBoaTAgKyBjMSAqIGEgKiBwaGlQcmltZTApKSB8fFxuICAgICAgICAgICAgICAgICAgICAocGhpID49IHBoaV9sbykpIHtcbiAgICAgICAgICAgICAgICAgICAgYV9oaWdoID0gYTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMocGhpUHJpbWUpIDw9IC1jMiAqIHBoaVByaW1lMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocGhpUHJpbWUgKiAoYV9oaWdoIC0gYV9sbykgPj0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhX2hpZ2ggPSBhX2xvO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYV9sbyA9IGE7XG4gICAgICAgICAgICAgICAgICAgIHBoaV9sbyA9IHBoaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgMTA7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShuZXh0LngsIDEuMCwgY3VycmVudC54LCBhLCBwayk7XG4gICAgICAgICAgICBwaGkgPSBuZXh0LmZ4ID0gZihuZXh0LngsIG5leHQuZnhwcmltZSk7XG4gICAgICAgICAgICBwaGlQcmltZSA9IGRvdChuZXh0LmZ4cHJpbWUsIHBrKTtcbiAgICAgICAgICAgIGlmICgocGhpID4gKHBoaTAgKyBjMSAqIGEgKiBwaGlQcmltZTApKSB8fFxuICAgICAgICAgICAgICAgIChpdGVyYXRpb24gJiYgKHBoaSA+PSBwaGlfb2xkKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbShhMCwgYSwgcGhpX29sZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhwaGlQcmltZSkgPD0gLWMyICogcGhpUHJpbWUwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwaGlQcmltZSA+PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6b29tKGEsIGEwLCBwaGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwaGlfb2xkID0gcGhpO1xuICAgICAgICAgICAgYTAgPSBhO1xuICAgICAgICAgICAgYSAqPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uanVnYXRlR3JhZGllbnQoZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIC8vIGFsbG9jYXRlIGFsbCBtZW1vcnkgdXAgZnJvbnQgaGVyZSwga2VlcCBvdXQgb2YgdGhlIGxvb3AgZm9yIHBlcmZvbWFuY2VcbiAgICAgICAgLy8gcmVhc29uc1xuICAgICAgICB2YXIgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbmV4dCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgeWsgPSBpbml0aWFsLnNsaWNlKCksXG4gICAgICAgICAgICBwaywgdGVtcCxcbiAgICAgICAgICAgIGEgPSAxLFxuICAgICAgICAgICAgbWF4SXRlcmF0aW9ucztcblxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDIwO1xuXG4gICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgcGsgPSBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKTtcbiAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwtMSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGEgPSB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGEpO1xuXG4gICAgICAgICAgICAvLyB0b2RvOiBoaXN0b3J5IGluIHdyb25nIHNwb3Q/XG4gICAgICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogYX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWEpIHtcbiAgICAgICAgICAgICAgICAvLyBmYWlpbGVkIHRvIGZpbmQgcG9pbnQgdGhhdCBzYXRpZmllcyB3b2xmZSBjb25kaXRpb25zLlxuICAgICAgICAgICAgICAgIC8vIHJlc2V0IGRpcmVjdGlvbiBmb3IgbmV4dCBpdGVyYXRpb25cbiAgICAgICAgICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLCAtMSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGRpcmVjdGlvbiB1c2luZyBQb2xha+KAk1JpYmllcmUgQ0cgbWV0aG9kXG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oeWssIDEsIG5leHQuZnhwcmltZSwgLTEsIGN1cnJlbnQuZnhwcmltZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGVsdGFfayA9IGRvdChjdXJyZW50LmZ4cHJpbWUsIGN1cnJlbnQuZnhwcmltZSksXG4gICAgICAgICAgICAgICAgICAgIGJldGFfayA9IE1hdGgubWF4KDAsIGRvdCh5aywgbmV4dC5meHByaW1lKSAvIGRlbHRhX2spO1xuXG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0ocGssIGJldGFfaywgcGssIC0xLCBuZXh0LmZ4cHJpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICAgICAgbmV4dCA9IHRlbXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDw9IDFlLTUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGF9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdyYWRpZW50RGVzY2VudChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMTAwLFxuICAgICAgICAgICAgbGVhcm5SYXRlID0gcGFyYW1zLmxlYXJuUmF0ZSB8fCAwLjAwMSxcbiAgICAgICAgICAgIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY3VycmVudC54LCAxLCBjdXJyZW50LngsIC1sZWFyblJhdGUsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgICAgICBpZiAobm9ybTIoY3VycmVudC5meHByaW1lKSA8PSAxZS01KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoKGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIHZhciBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBuZXh0ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAxMDAsXG4gICAgICAgICAgICBsZWFyblJhdGUgPSBwYXJhbXMubGVhcm5SYXRlIHx8IDEsXG4gICAgICAgICAgICBwayA9IGluaXRpYWwuc2xpY2UoKSxcbiAgICAgICAgICAgIGMxID0gcGFyYW1zLmMxIHx8IDFlLTMsXG4gICAgICAgICAgICBjMiA9IHBhcmFtcy5jMiB8fCAwLjEsXG4gICAgICAgICAgICB0ZW1wLFxuICAgICAgICAgICAgZnVuY3Rpb25DYWxscyA9IFtdO1xuXG4gICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgLy8gd3JhcCB0aGUgZnVuY3Rpb24gY2FsbCB0byB0cmFjayBsaW5lc2VhcmNoIHNhbXBsZXNcbiAgICAgICAgICAgIHZhciBpbm5lciA9IGY7XG4gICAgICAgICAgICBmID0gZnVuY3Rpb24oeCwgZnhwcmltZSkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMucHVzaCh4LnNsaWNlKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbm5lcih4LCBmeHByaW1lKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLCAtMSk7XG4gICAgICAgICAgICBsZWFyblJhdGUgPSB3b2xmZUxpbmVTZWFyY2goZiwgcGssIGN1cnJlbnQsIG5leHQsIGxlYXJuUmF0ZSwgYzEsIGMyKTtcblxuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxsczogZnVuY3Rpb25DYWxscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWFyblJhdGU6IGxlYXJuUmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogbGVhcm5SYXRlfSk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxscyA9IFtdO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50O1xuICAgICAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICBuZXh0ID0gdGVtcDtcblxuICAgICAgICAgICAgaWYgKChsZWFyblJhdGUgPT09IDApIHx8IChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDwgMWUtNSkpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZXhwb3J0cy5iaXNlY3QgPSBiaXNlY3Q7XG4gICAgZXhwb3J0cy5uZWxkZXJNZWFkID0gbmVsZGVyTWVhZDtcbiAgICBleHBvcnRzLmNvbmp1Z2F0ZUdyYWRpZW50ID0gY29uanVnYXRlR3JhZGllbnQ7XG4gICAgZXhwb3J0cy5ncmFkaWVudERlc2NlbnQgPSBncmFkaWVudERlc2NlbnQ7XG4gICAgZXhwb3J0cy5ncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoID0gZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaDtcbiAgICBleHBvcnRzLnplcm9zID0gemVyb3M7XG4gICAgZXhwb3J0cy56ZXJvc00gPSB6ZXJvc007XG4gICAgZXhwb3J0cy5ub3JtMiA9IG5vcm0yO1xuICAgIGV4cG9ydHMud2VpZ2h0ZWRTdW0gPSB3ZWlnaHRlZFN1bTtcbiAgICBleHBvcnRzLnNjYWxlID0gc2NhbGU7XG5cbn0pKTsiLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJvdW5kaW5nQm94OiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn07XG4gICAgem9vbTogVmVjdG9yO1xuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEdlbmVyaWNUaW1lZERyYXdhYmxlIGltcGxlbWVudHMgVGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIExBQkVMX0hFSUdIVCA9IDEyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLm5hbWU7XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHJldmVyc2U6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdCb3goKToge3RsOiBWZWN0b3IsIGJyOiBWZWN0b3J9IHtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcblxuICAgICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmFkYXB0ZXIuem9vbTtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlci56b29tICE9IFZlY3Rvci5OVUxMKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tQmJveCA9IHRoaXMuY2FsY3VsYXRlQm91bmRpbmdCb3hGb3Jab29tKGNlbnRlci54LCBjZW50ZXIueSwgYmJveCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnem9vbScsIHpvb21CYm94KTtcbiAgICAgICAgICAgIHJldHVybiB6b29tQmJveDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmJveDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZUJvdW5kaW5nQm94Rm9yWm9vbShwZXJjZW50WDogbnVtYmVyLCBwZXJjZW50WTogbnVtYmVyLCBiYm94OiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn0pOiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn0ge1xuICAgICAgICBjb25zdCBkZWx0YSA9IGJib3gudGwuZGVsdGEoYmJveC5icik7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQ2VudGVyID0gbmV3IFZlY3RvcihwZXJjZW50WC8xMDAsIHBlcmNlbnRZLzEwMCk7XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IGJib3gudGwuYWRkKG5ldyBWZWN0b3IoZGVsdGEueCpyZWxhdGl2ZUNlbnRlci54LCBkZWx0YS55KnJlbGF0aXZlQ2VudGVyLnkpKTtcbiAgICAgICAgY29uc3QgZWRnZURpc3RhbmNlID0gbmV3IFZlY3RvcihkZWx0YS54Kk1hdGgubWluKHJlbGF0aXZlQ2VudGVyLngsIDEtcmVsYXRpdmVDZW50ZXIueCksIGRlbHRhLnkqTWF0aC5taW4ocmVsYXRpdmVDZW50ZXIueSwgMS1yZWxhdGl2ZUNlbnRlci55KSk7XG4gICAgICAgIHJldHVybiB7dGw6IGNlbnRlci5hZGQobmV3IFZlY3RvcigtZWRnZURpc3RhbmNlLngsIC1lZGdlRGlzdGFuY2UueSkpLCBicjogY2VudGVyLmFkZChlZGdlRGlzdGFuY2UpfTtcbiAgICB9XG59IiwiaW1wb3J0IHsgU3RhdGlvbiwgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcblxuLy9jb25zdCBtYXRoanMgPSByZXF1aXJlKCdtYXRoanMnKTtcbmNvbnN0IGZtaW4gPSByZXF1aXJlKCdmbWluJyk7XG5cblxuZXhwb3J0IGNsYXNzIEdyYXZpdGF0b3Ige1xuICAgIHN0YXRpYyBJTkVSVE5FU1MgPSAxMDA7XG4gICAgc3RhdGljIEdSQURJRU5UX1NDQUxFID0gMC4wMDAwMDAwMDE7XG4gICAgc3RhdGljIERFVklBVElPTl9XQVJOSU5HID0gMC4xO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFX1JFTEFUSVZFX1RPX0VVQ0xJRElBTl9ESVNUQU5DRSA9IHRydWU7XG4gICAgc3RhdGljIFNQRUVEID0gMjUwO1xuXG4gICAgcHJpdmF0ZSBpbml0aWFsV2VpZ2h0RmFjdG9yczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICBwcml2YXRlIGluaXRpYWxBbmdsZXM6IHthU3RhdGlvbjogc3RyaW5nLCBjb21tb25TdGF0aW9uOiBzdHJpbmcsIGJTdGF0aW9uOiBzdHJpbmcsIGFuZ2xlOiBudW1iZXJ9W10gPSBbXTtcbiAgICBwcml2YXRlIGFuZ2xlRjogYW55O1xuICAgIHByaXZhdGUgYW5nbGVGUHJpbWU6IHtbaWQ6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICBwcml2YXRlIGF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbzogbnVtYmVyID0gLTE7XG4gICAgcHJpdmF0ZSBlZGdlczoge1tpZDogc3RyaW5nXTogTGluZX0gPSB7fTtcbiAgICBwcml2YXRlIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3IsIHN0YXJ0Q29vcmRzOiBWZWN0b3J9fSA9IHt9O1xuICAgIHByaXZhdGUgZGlydHkgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgZ3Jhdml0YXRlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMuZGlydHkpXG4gICAgICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdyYXBoKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gdGhpcy5taW5pbWl6ZUxvc3MoKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5lZGdlcyk7XG4gICAgICAgIHRoaXMuYXNzZXJ0RGlzdGFuY2VzKHNvbHV0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb24sIGRlbGF5LCBhbmltYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyA9PSAtMSAmJiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID0gdGhpcy5nZXRXZWlnaHRzU3VtKCkgLyB0aGlzLmdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvXi0xJywgMS90aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyk7XG5cbiAgICAgICAgICAgIC8vdGhpcy5pbml0aWFsaXplQW5nbGVHcmFkaWVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICAvKnByaXZhdGUgaW5pdGlhbGl6ZUFuZ2xlR3JhZGllbnRzKCkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gJyhhY29zKCgoYl94LWFfeCkqKGJfeC1jX3gpKyhiX3ktYV95KSooYl95LWNfeSkpLyhzcXJ0KChiX3gtYV94KV4yKyhiX3ktYV95KV4yKSpzcXJ0KChiX3gtY194KV4yKyhiX3ktY195KV4yKSkpKigoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpL2FicygoKGJfeS1jX3kpKihiX3gtYV94KS0oYl95LWFfeSkqKGJfeC1jX3gpKSktY29uc3QpJztcbiAgICAgICAgY29uc3QgZiA9IG1hdGhqcy5wYXJzZShleHByZXNzaW9uKTtcbiAgICAgICAgdGhpcy5hbmdsZUYgPSBmLmNvbXBpbGUoKTtcblxuICAgICAgICBjb25zdCBmRGVsdGEgPSBtYXRoanMucGFyc2UoZXhwcmVzc2lvbiArICdeMicpO1xuXG4gICAgICAgIGNvbnN0IHZhcnMgPSBbJ2FfeCcsICdhX3knLCAnYl94JywgJ2JfeScsICdjX3gnLCAnY195J107XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx2YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFuZ2xlRlByaW1lW3ZhcnNbaV1dID0gbWF0aGpzLmRlcml2YXRpdmUoZkRlbHRhLCB2YXJzW2ldKS5jb21waWxlKCk7XG4gICAgICAgIH1cbiAgICB9Ki9cblxuICAgIHByaXZhdGUgZ2V0V2VpZ2h0c1N1bSgpIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gZWRnZS53ZWlnaHQgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RXVjbGlkaWFuRGlzdGFuY2VTdW0oKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IHRoaXMuZWRnZVZlY3RvcihlZGdlKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVkZ2VWZWN0b3IoZWRnZTogTGluZSk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVsxXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3Jkcy5kZWx0YSh0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3Jkcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplR3JhcGgoKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldID0gR3Jhdml0YXRvci5JTklUSUFMSVpFX1JFTEFUSVZFX1RPX0VVQ0xJRElBTl9ESVNUQU5DRVxuICAgICAgICAgICAgICAgICAgICA/IDEgLyB0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpb1xuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZWRnZVZlY3RvcihlZGdlKS5sZW5ndGggLyAoZWRnZS53ZWlnaHQgfHwgMCk7XG4gICAgICAgICAgICAgICAgLy90aGlzLmFkZEluaXRpYWxBbmdsZXMoZWRnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXguaW5kZXggPSBuZXcgVmVjdG9yKGksIGkrMSk7XG4gICAgICAgICAgICBpICs9IDI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEluaXRpYWxBbmdsZXMoZWRnZTogTGluZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGFkamFjZW50IG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGlmIChhZGphY2VudCA9PSBlZGdlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8MjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPDI7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWRnZS50ZXJtaW5pW2ldLnN0YXRpb25JZCA9PSBhZGphY2VudC50ZXJtaW5pW2pdLnN0YXRpb25JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLnRocmVlRG90QW5nbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbaV4xXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzW2VkZ2UudGVybWluaVtpXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzW2FkamFjZW50LnRlcm1pbmlbal4xXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3Jkc1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbEFuZ2xlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3RhdGlvbjogZWRnZS50ZXJtaW5pW2leMV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vblN0YXRpb246IGVkZ2UudGVybWluaVtpXS5zdGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYlN0YXRpb246IGFkamFjZW50LnRlcm1pbmlbal4xXS5zdGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL2Rlcml2ZSBhcmNjb3MoKChhLWMpKihlLWcpKyhiLWQpKihmLWgpKS8oc3FydCgoYS1jKV4yKyhiLWQpXjIpKnNxcnQoKGUtZyleMisoZi1oKV4yKSkpKigoZi1oKSooYS1jKS0oYi1kKSooZS1nKSkvfCgoZi1oKSooYS1jKS0oYi1kKSooZS1nKSl8XG4gICAgICAgIC8vZGVyaXZlIGFjb3MoKChiX3gtYV94KSooYl94LWNfeCkrKGJfeS1hX3kpKihiX3ktY195KSkvKHNxcnQoKGJfeC1hX3gpXjIrKGJfeS1hX3kpXjIpKnNxcnQoKGJfeC1jX3gpXjIrKGJfeS1jX3kpXjIpKSkqKChiX3ktY195KSooYl94LWFfeCktKGJfeS1hX3kpKihiX3gtY194KSkvYWJzKCgoYl95LWNfeSkqKGJfeC1hX3gpLShiX3ktYV95KSooYl94LWNfeCkpKVxuICAgIH1cblxuICAgIHByaXZhdGUgdGhyZWVEb3RBbmdsZShhOiBWZWN0b3IsIGI6IFZlY3RvciwgYzogVmVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRiwgYSwgYiwgYywgMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24oZjogYW55LCBhOiBWZWN0b3IsIGI6IFZlY3RvciwgYzogVmVjdG9yLCBvbGRWYWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBmLmV2YWx1YXRlKHthX3g6IGEueCwgYV95OiBhLnksIGJfeDogYi54LCBiX3k6IGIueSwgY194OiBjLngsIGNfeTogYy55LCBjb25zdDogb2xkVmFsdWV9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1pbmltaXplTG9zcygpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IGdyYXZpdGF0b3IgPSB0aGlzO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7aGlzdG9yeTogW119O1xuICAgICAgICBjb25zdCBzdGFydDogbnVtYmVyW10gPSB0aGlzLnN0YXJ0U3RhdGlvblBvc2l0aW9ucygpO1xuICAgICAgICBjb25zdCBzb2x1dGlvbiA9IGZtaW4uY29uanVnYXRlR3JhZGllbnQoKEE6IG51bWJlcltdLCBmeHByaW1lOiBudW1iZXJbXSkgPT4ge1xuICAgICAgICAgICAgZnhwcmltZSA9IGZ4cHJpbWUgfHwgQS5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZ4cHJpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmeHByaW1lW2ldID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmeCA9IDA7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb1N0YXJ0U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5kZWx0YVRvQ3VycmVudFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICAvL2Z4ID0gdGhpcy5kZWx0YVRvQW5nbGVzVG9FbnN1cmVJbmVydG5lc3MoZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9OZXdEaXN0YW5jZXNUb0Vuc3VyZUFjY3VyYWN5KGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIHRoaXMuc2NhbGVHcmFkaWVudFRvRW5zdXJlV29ya2luZ1N0ZXBTaXplKGZ4cHJpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZ4O1xuICAgICAgICB9LCBzdGFydCwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHNvbHV0aW9uLng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydFN0YXRpb25Qb3NpdGlvbnMoKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCBzdGFydDogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgc3RhcnRbdmVydGV4LmluZGV4LnhdID0gdmVydGV4LnN0YXJ0Q29vcmRzLng7XG4gICAgICAgICAgICBzdGFydFt2ZXJ0ZXguaW5kZXgueV0gPSB2ZXJ0ZXguc3RhcnRDb29yZHMueTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhcnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVgoQTogbnVtYmVyW10sIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3J9fSwgdGVybWluaTogU3RvcFtdKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIEFbdmVydGljZXNbdGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnhdIC0gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVkoQTogbnVtYmVyW10sIHZlcnRpY2VzOiB7W2lkOiBzdHJpbmddIDoge3N0YXRpb246IFN0YXRpb24sIGluZGV4OiBWZWN0b3J9fSwgdGVybWluaTogU3RvcFtdKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIEFbdmVydGljZXNbdGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnldIC0gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueV07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvU3RhcnRTdGF0aW9uUG9zaXRpb25zVG9FbnN1cmVJbmVydG5lc3MoZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgZnggKz0gKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhcnRDb29yZHMueCwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhcnRDb29yZHMueSwgMilcbiAgICAgICAgICAgICAgICApICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC54XSArPSAyICogKEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGFydENvb3Jkcy54KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueV0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhcnRDb29yZHMueSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvQ3VycmVudFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IudmVydGljZXMpKSB7XG4gICAgICAgICAgICBmeCArPSAoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueCwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLnksIDIpXG4gICAgICAgICAgICAgICAgKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueF0gKz0gMiAqIChBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLngpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW3ZlcnRleC5pbmRleC55XSArPSAyICogKEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvQW5nbGVzVG9FbnN1cmVJbmVydG5lc3MoZng6IG51bWJlciwgQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdLCBncmF2aXRhdG9yOiBHcmF2aXRhdG9yKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIE9iamVjdC52YWx1ZXMoZ3Jhdml0YXRvci5pbml0aWFsQW5nbGVzKSkge1xuICAgICAgICAgICAgY29uc3QgYSA9IG5ldyBWZWN0b3IoQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5hU3RhdGlvbl0uaW5kZXgueV0pO1xuICAgICAgICAgICAgY29uc3QgYiA9IG5ldyBWZWN0b3IoQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnldKTtcbiAgICAgICAgICAgIGNvbnN0IGMgPSBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYlN0YXRpb25dLmluZGV4LnldKTtcblxuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRiwgYSwgYiwgYywgcGFpci5hbmdsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkZWx0YSk7XG4gICAgICAgICAgICBmeCArPSBNYXRoLnBvdyhkZWx0YSwgMikgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcblxuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnhdICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2FfeCddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnldICs9IHRoaXMuZXZhbHVhdGVUaHJlZURvdEZ1bmN0aW9uKHRoaXMuYW5nbGVGUHJpbWVbJ2FfeSddLCBhLCBiLCBjLCBwYWlyLmFuZ2xlKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuY29tbW9uU3RhdGlvbl0uaW5kZXgueF0gKz0gdGhpcy5ldmFsdWF0ZVRocmVlRG90RnVuY3Rpb24odGhpcy5hbmdsZUZQcmltZVsnYl94J10sIGEsIGIsIGMsIHBhaXIuYW5nbGUpICogR3Jhdml0YXRvci5JTkVSVE5FU1M7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC55XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydiX3knXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC54XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydjX3gnXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC55XSArPSB0aGlzLmV2YWx1YXRlVGhyZWVEb3RGdW5jdGlvbih0aGlzLmFuZ2xlRlByaW1lWydjX3knXSwgYSwgYiwgYywgcGFpci5hbmdsZSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvTmV3RGlzdGFuY2VzVG9FbnN1cmVBY2N1cmFjeShmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKGdyYXZpdGF0b3IuZWRnZXMpKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdiA9IE1hdGgucG93KHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICArIE1hdGgucG93KHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAtIE1hdGgucG93KGdyYXZpdGF0b3IuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSAqIChlZGdlLndlaWdodCB8fCAwKSwgMik7XG4gICAgICAgICAgICBmeCArPSBNYXRoLnBvdyh2LCAyKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC54XSArPSArNCAqIHYgKiB0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnldICs9ICs0ICogdiAqIHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueF0gKz0gLTQgKiB2ICogdGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XSArPSAtNCAqIHYgKiB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjYWxlR3JhZGllbnRUb0Vuc3VyZVdvcmtpbmdTdGVwU2l6ZShmeHByaW1lOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnhwcmltZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZnhwcmltZVtpXSAqPSBHcmF2aXRhdG9yLkdSQURJRU5UX1NDQUxFO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnREaXN0YW5jZXMoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldmlhdGlvbiA9IE1hdGguYWJzKDEgLSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVgoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyh0aGlzLmRlbHRhWShzb2x1dGlvbiwgdGhpcy52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICkgLyAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApKSk7XG4gICAgICAgICAgICBpZiAoZGV2aWF0aW9uID4gR3Jhdml0YXRvci5ERVZJQVRJT05fV0FSTklORykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlZGdlLm5hbWUsICdkaXZlcmdlcyBieSAnLCBkZXZpYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBcblxuICAgIHByaXZhdGUgbW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb246IG51bWJlcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID0gYW5pbWF0ZSA/IHRoaXMuZ2V0VG90YWxEaXN0YW5jZVRvTW92ZShzb2x1dGlvbikgLyBHcmF2aXRhdG9yLlNQRUVEIDogMDtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXggb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnZlcnRpY2VzKSkge1xuICAgICAgICAgICAgdmVydGV4LnN0YXRpb24ubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBuZXcgVmVjdG9yKHNvbHV0aW9uW3ZlcnRleC5pbmRleC54XSwgc29sdXRpb25bdmVydGV4LmluZGV4LnldKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGVkZ2UubW92ZShkZWxheSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBbdGhpcy5nZXROZXdTdGF0aW9uUG9zaXRpb24oZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZCwgc29sdXRpb24pLCB0aGlzLmdldE5ld1N0YXRpb25Qb3NpdGlvbihlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkLCBzb2x1dGlvbildKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxheSArPSBhbmltYXRpb25EdXJhdGlvblNlY29uZHM7XG4gICAgICAgIHJldHVybiBkZWxheTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRvdGFsRGlzdGFuY2VUb01vdmUoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gbmV3IFZlY3Rvcihzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueF0sIHNvbHV0aW9uW3ZlcnRleC5pbmRleC55XSkuZGVsdGEodmVydGV4LnN0YXRpb24uYmFzZUNvb3JkcykubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXdTdGF0aW9uUG9zaXRpb24oc3RhdGlvbklkOiBzdHJpbmcsIHNvbHV0aW9uOiBudW1iZXJbXSk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC54XSwgc29sdXRpb25bdGhpcy52ZXJ0aWNlc1tzdGF0aW9uSWRdLmluZGV4LnldKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFZlcnRleCh2ZXJ0ZXhJZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZCh2ZXJ0ZXhJZCk7XG4gICAgICAgICAgICBpZiAoc3RhdGlvbiA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHZlcnRleElkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHRoaXMudmVydGljZXNbdmVydGV4SWRdID0ge3N0YXRpb246IHN0YXRpb24sIGluZGV4OiBWZWN0b3IuTlVMTCwgc3RhcnRDb29yZHM6IHN0YXRpb24uYmFzZUNvb3Jkc307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRFZGdlKGxpbmU6IExpbmUpIHtcbiAgICAgICAgaWYgKGxpbmUud2VpZ2h0ID09IHVuZGVmaW5lZCkgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0SWRlbnRpZmllcihsaW5lKTtcbiAgICAgICAgdGhpcy5lZGdlc1tpZF0gPSBsaW5lO1xuICAgICAgICB0aGlzLmFkZFZlcnRleChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkKTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZGVudGlmaWVyKGxpbmU6IExpbmUpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmFscGhhYmV0aWNJZChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBsaW5lLnRlcm1pbmlbMV0uc3RhdGlvbklkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5zdGFudCB7XG4gICAgc3RhdGljIEJJR19CQU5HOiBJbnN0YW50ID0gbmV3IEluc3RhbnQoMCwgMCwgJycpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Vwb2NoOiBudW1iZXIsIHByaXZhdGUgX3NlY29uZDogbnVtYmVyLCBwcml2YXRlIF9mbGFnOiBzdHJpbmcpIHtcblxuICAgIH1cbiAgICBnZXQgZXBvY2goKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vwb2NoO1xuICAgIH1cbiAgICBnZXQgc2Vjb25kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWNvbmQ7XG4gICAgfVxuICAgIGdldCBmbGFnKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFnO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGFycmF5OiBzdHJpbmdbXSk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQocGFyc2VJbnQoYXJyYXlbMF0pLCBwYXJzZUludChhcnJheVsxXSksIGFycmF5WzJdID8/ICcnKVxuICAgIH1cblxuICAgIGVxdWFscyh0aGF0OiBJbnN0YW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2ggJiYgdGhpcy5zZWNvbmQgPT0gdGhhdC5zZWNvbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kIC0gdGhpcy5zZWNvbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExhYmVsQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBmb3JTdGF0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZm9yTGluZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGJvdW5kaW5nQm94OiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn07XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIGNsb25lRm9yU3RhdGlvbihzdGF0aW9uSWQ6IHN0cmluZyk6IExhYmVsQWRhcHRlcjtcbn1cblxuZXhwb3J0IGNsYXNzIExhYmVsIGltcGxlbWVudHMgVGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIExBQkVMX0hFSUdIVCA9IDEyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBMYWJlbEFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBib3VuZGluZ0JveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcbiAgICBjaGlsZHJlbjogTGFiZWxbXSA9IFtdO1xuXG4gICAgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8IHRoaXMuYWRhcHRlci5mb3JMaW5lIHx8ICcnO1xuICAgIH1cbiAgICBcbiAgICBnZXQgZm9yU3RhdGlvbigpOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8ICcnKTtcbiAgICAgICAgaWYgKHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmZvclN0YXRpb247XG4gICAgICAgICAgICBzdGF0aW9uLmFkZExhYmVsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24ubGluZXNFeGlzdGluZygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3Rm9yU3RhdGlvbihkZWxheSwgc3RhdGlvbiwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgdGVybWluaSA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5hZGFwdGVyLmZvckxpbmUpLnRlcm1pbmk7XG4gICAgICAgICAgICB0ZXJtaW5pLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHQuc3RhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBpZiAocyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHMubGFiZWxzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmRyYXcoZGVsYXksIGFuaW1hdGUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xhYmVsRm9yU3RhdGlvbiA9IG5ldyBMYWJlbCh0aGlzLmFkYXB0ZXIuY2xvbmVGb3JTdGF0aW9uKHMuaWQpLCB0aGlzLnN0YXRpb25Qcm92aWRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYWRkTGFiZWwobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xhYmVsRm9yU3RhdGlvbi5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXdMYWJlbEZvclN0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdGb3JTdGF0aW9uKGRlbGF5U2Vjb25kczogbnVtYmVyLCBzdGF0aW9uOiBTdGF0aW9uLCBmb3JMaW5lOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgbGV0IHlPZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8c3RhdGlvbi5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBzdGF0aW9uLmxhYmVsc1tpXTtcbiAgICAgICAgICAgIGlmIChsID09IHRoaXMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB5T2Zmc2V0ICs9IExhYmVsLkxBQkVMX0hFSUdIVCoxLjU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFiZWxEaXIgPSBzdGF0aW9uLmxhYmVsRGlyO1xuXG4gICAgICAgIHlPZmZzZXQgPSBNYXRoLnNpZ24oVmVjdG9yLlVOSVQucm90YXRlKGxhYmVsRGlyKS55KSp5T2Zmc2V0IC0gKHlPZmZzZXQ+MCA/IDIgOiAwKTsgLy9UT0RPIG1hZ2ljIG51bWJlcnNcbiAgICAgICAgY29uc3Qgc3RhdGlvbkRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGRpZmZEaXIgPSBsYWJlbERpci5hZGQobmV3IFJvdGF0aW9uKC1zdGF0aW9uRGlyLmRlZ3JlZXMpKTtcbiAgICAgICAgY29uc3QgdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZGlmZkRpcik7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IG5ldyBWZWN0b3Ioc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3gnLCB1bml0di54KSwgc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3knLCB1bml0di55KSk7XG4gICAgICAgIGNvbnN0IHRleHRDb29yZHMgPSBiYXNlQ29vcmQuYWRkKGFuY2hvci5yb3RhdGUoc3RhdGlvbkRpcikpLmFkZChuZXcgVmVjdG9yKDAsIHlPZmZzZXQpKTtcbiAgICBcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXlTZWNvbmRzLCB0ZXh0Q29vcmRzLCBsYWJlbERpciwgdGhpcy5jaGlsZHJlbi5tYXAoYyA9PiBjLmFkYXB0ZXIpKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5mb3JTdGF0aW9uLnJlbW92ZUxhYmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFkYXB0ZXIuZm9yTGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBjLmVyYXNlKGRlbGF5LCBhbmltYXRlLCByZXZlcnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuL1ByZWZlcnJlZFRyYWNrXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCAge1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJvdW5kaW5nQm94OiB7IHRsOiBWZWN0b3I7IGJyOiBWZWN0b3I7IH07XG4gICAgd2VpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlcik6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGluZSBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBOT0RFX0RJU1RBTkNFID0gMDtcbiAgICBzdGF0aWMgU1BFRUQgPSAxMDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IExpbmVBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyLCBwcml2YXRlIGJlY2tTdHlsZTogYm9vbGVhbiA9IHRydWUpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLm5hbWU7XG4gICAgYm91bmRpbmdCb3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG4gICAgd2VpZ2h0ID0gdGhpcy5hZGFwdGVyLndlaWdodDtcbiAgICBcbiAgICBwcml2YXRlIHByZWNlZGluZ1N0b3A6IFN0YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBwcmVjZWRpbmdEaXI6IFJvdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgcGF0aDogVmVjdG9yW10gPSBbXTtcblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wYXRoO1xuICAgICAgICBcbiAgICAgICAgbGV0IHRyYWNrID0gbmV3IFByZWZlcnJlZFRyYWNrKCcrJyk7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tU3RyaW5nKHN0b3BzW2pdLnByZWZlcnJlZFRyYWNrKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKHN0b3AuYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKHRoaXMubmFtZSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RvcCwgdGhpcy5uZXh0U3RvcEJhc2VDb29yZChzdG9wcywgaiwgc3RvcC5iYXNlQ29vcmRzKSwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCB0cnVlKTtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2sua2VlcE9ubHlTaWduKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpLmFkZExpbmUodGhpcyk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBkdXJhdGlvbiwgcGF0aCwgdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSk7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBsZXQgb2xkUGF0aCA9IHRoaXMucGF0aDtcbiAgICAgICAgaWYgKG9sZFBhdGgubGVuZ3RoIDwgMiB8fCBwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVHJ5aW5nIHRvIG1vdmUgYSBub24gZXhpc3RpbmcgbGluZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbGRQYXRoLmxlbmd0aCAhPSBwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgb2xkUGF0aCA9IFtvbGRQYXRoWzBdLCBvbGRQYXRoW29sZFBhdGgubGVuZ3RoLTFdXTtcbiAgICAgICAgICAgIHBhdGggPSBbcGF0aFswXSwgcGF0aFtwYXRoLmxlbmd0aC0xXV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5wYXRoLCBwYXRoKTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLnBhdGgsIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSkucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5LCBkdXJhdGlvbiwgcmV2ZXJzZSwgdGhpcy5nZXRUb3RhbExlbmd0aCh0aGlzLnBhdGgpKTtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHN0b3BzW2pdLnN0YXRpb25JZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICBzdG9wLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgICAgICBzdG9wLmRyYXcoZGVsYXkpO1xuICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3BJZCA9ICdoXycgKyBVdGlscy5hbHBoYWJldGljSWQoc3RvcHNbai0xXS5zdGF0aW9uSWQsIHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGhlbHBTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBoZWxwU3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0U3RvcEJhc2VDb29yZChzdG9wczogU3RvcFtdLCBjdXJyZW50U3RvcEluZGV4OiBudW1iZXIsIGRlZmF1bHRDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICBpZiAoY3VycmVudFN0b3BJbmRleCsxIDwgc3RvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHN0b3BzW2N1cnJlbnRTdG9wSW5kZXgrMV0uc3RhdGlvbklkO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgaWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3AuYmFzZUNvb3JkczsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdENvb3JkcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgdHJhY2s6IFByZWZlcnJlZFRyYWNrLCBwYXRoOiBWZWN0b3JbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmVjdXJzZTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBkaXIgPSBzdGF0aW9uLnJvdGF0aW9uO1xuICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgIGNvbnN0IG5ld0RpciA9IHRoaXMuZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIGRpciwgcGF0aCk7XG4gICAgICAgIGNvbnN0IG5ld1BvcyA9IHN0YXRpb24uYXNzaWduVHJhY2sobmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgdHJhY2ssIHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gc3RhdGlvbi5yb3RhdGVkVHJhY2tDb29yZGluYXRlcyhuZXdEaXIsIG5ld1Bvcyk7XG4gICAgXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgXG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMuZ2V0UHJlY2VkaW5nRGlyKHRoaXMucHJlY2VkaW5nRGlyLCB0aGlzLnByZWNlZGluZ1N0b3AsIG9sZENvb3JkLCBuZXdDb29yZCk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gbmV3RGlyLmFkZChkaXIpO1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmluc2VydE5vZGUob2xkQ29vcmQsIHRoaXMucHJlY2VkaW5nRGlyLCBuZXdDb29yZCwgc3RhdGlvbkRpciwgcGF0aCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWZvdW5kICYmIHJlY3Vyc2UgJiYgdGhpcy5wcmVjZWRpbmdTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wID0gdGhpcy5nZXRPckNyZWF0ZUhlbHBlclN0b3AodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgc3RhdGlvbik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSB0aGlzLnByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihoZWxwU3RvcCwgYmFzZUNvb3JkLCB0cmFjay5rZWVwT25seVNpZ24oKSwgcGF0aCwgZGVsYXksIGFuaW1hdGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIHRyYWNrLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdwYXRoIHRvIGZpeCBvbiBsaW5lJywgdGhpcy5hZGFwdGVyLm5hbWUsICdhdCBzdGF0aW9uJywgc3RhdGlvbi5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHN0YXRpb25EaXI7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGlvbi5hZGRMaW5lKHRoaXMsIG5ld0Rpci5pc1ZlcnRpY2FsKCkgPyAneCcgOiAneScsIG5ld1Bvcyk7XG4gICAgICAgIHBhdGgucHVzaChuZXdDb29yZCk7XG4gICAgICAgIGRlbGF5ID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKSArIGRlbGF5O1xuICAgICAgICBzdGF0aW9uLmRyYXcoZGVsYXkpO1xuICAgICAgICB0aGlzLnByZWNlZGluZ1N0b3AgPSBzdGF0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgZGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0b3BCYXNlQ29vcmQuZGVsdGEob2xkQ29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKG5leHRTdG9wQmFzZUNvb3JkKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdBeGlzID0gc3RhdGlvbi5heGlzQW5kVHJhY2tGb3JFeGlzdGluZ0xpbmUodGhpcy5uYW1lKT8uYXhpcztcbiAgICAgICAgaWYgKGV4aXN0aW5nQXhpcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbiA9IGRlbHRhLmluY2xpbmF0aW9uKCkuaGFsZkRpcmVjdGlvbihkaXIsIGV4aXN0aW5nQXhpcyA9PSAneCcgPyBuZXcgUm90YXRpb24oOTApIDogbmV3IFJvdGF0aW9uKDApKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbi5hZGQoZGlyKS5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsdGEuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgfVxuICAgIFxuXG4gICAgcHJpdmF0ZSBnZXRQcmVjZWRpbmdEaXIocHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCwgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCwgb2xkQ29vcmQ6IFZlY3RvciwgbmV3Q29vcmQ6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWNlZGluZ1N0b3BSb3RhdGlvbiA9IHByZWNlZGluZ1N0b3A/LnJvdGF0aW9uID8/IG5ldyBSb3RhdGlvbigwKTtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24ocHJlY2VkaW5nU3RvcFJvdGF0aW9uKS5hZGQocHJlY2VkaW5nU3RvcFJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IHByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVjZWRpbmdEaXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbnNlcnROb2RlKGZyb21Db29yZDogVmVjdG9yLCBmcm9tRGlyOiBSb3RhdGlvbiwgdG9Db29yZDogVmVjdG9yLCB0b0RpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5iZWNrU3R5bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSBmcm9tQ29vcmQuZGVsdGEodG9Db29yZCk7XG4gICAgICAgIGNvbnN0IG9sZERpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZnJvbURpcik7XG4gICAgICAgIGNvbnN0IG5ld0RpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUodG9EaXIpO1xuICAgICAgICBpZiAoZGVsdGEuaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwob2xkRGlyViwgbmV3RGlyVikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZGVsdGEuc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihvbGREaXJWLCBuZXdEaXJWKVxuICAgICAgICBpZiAoc29sdXRpb24uYSA+IExpbmUuTk9ERV9ESVNUQU5DRSAmJiBzb2x1dGlvbi5iID4gTGluZS5OT0RFX0RJU1RBTkNFKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gobmV3IFZlY3Rvcihmcm9tQ29vcmQueCtvbGREaXJWLngqc29sdXRpb24uYSwgZnJvbUNvb3JkLnkrb2xkRGlyVi55KnNvbHV0aW9uLmEpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlSGVscGVyU3RvcChmcm9tRGlyOiBSb3RhdGlvbiwgZnJvbVN0b3A6IFN0YXRpb24sIHRvU3RvcDogU3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChmcm9tU3RvcC5pZCwgdG9TdG9wLmlkKTtcbiAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgIGlmIChoZWxwU3RvcCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZycsIGhlbHBTdG9wSWQpO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBmcm9tU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgbmV3Q29vcmQgPSB0b1N0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3Q29vcmQuZGVsdGEob2xkQ29vcmQpO1xuICAgICAgICAgICAgY29uc3QgZGVnID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVEaXIgPSBuZXcgUm90YXRpb24oKGRlZy5kZWx0YShmcm9tRGlyKS5kZWdyZWVzID49IDAgPyBNYXRoLmZsb29yKGRlZy5kZWdyZWVzIC8gNDUpIDogTWF0aC5jZWlsKGRlZy5kZWdyZWVzIC8gNDUpKSAqIDQ1KS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZUNvb3JkID0gZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgvMikuYWRkKG5ld0Nvb3JkKTtcblxuICAgICAgICAgICAgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5jcmVhdGVWaXJ0dWFsU3RvcChoZWxwU3RvcElkLCBpbnRlcm1lZGlhdGVDb29yZCwgaW50ZXJtZWRpYXRlRGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGVscFN0b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBbmltYXRpb25EdXJhdGlvbihwYXRoOiBWZWN0b3JbXSwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSAvIExpbmUuU1BFRUQ7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0VG90YWxMZW5ndGgocGF0aDogVmVjdG9yW10pOiBudW1iZXIge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhdGgubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgbGVuZ3RoICs9IHBhdGhbaV0uZGVsdGEocGF0aFtpKzFdKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXQgdGVybWluaSgpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA9PSAwKSBcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIFtzdG9wc1swXSwgc3RvcHNbc3RvcHMubGVuZ3RoLTFdXTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lR3JvdXAge1xuICAgIHByaXZhdGUgbGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgX3Rlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgIFxuICAgIGFkZExpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMubGluZXMuaW5jbHVkZXMobGluZSkpXG4gICAgICAgICAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmVzW2ldID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFN0b3BbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJtaW5pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVGVybWluaSgpIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICAgICAgdGhpcy5saW5lcy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZVRlcm1pbmkgPSBsLnRlcm1pbmk7XG4gICAgICAgICAgICBsaW5lVGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdC5wcmVmZXJyZWRUcmFjay5pbmNsdWRlcygnKicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtzdGF0aW9uSWQsIG9jY3VyZW5jZXNdIG9mIE9iamVjdC5lbnRyaWVzKGNhbmRpZGF0ZXMpKSB7XG4gICAgICAgICAgICBpZiAob2NjdXJlbmNlcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGVybWluaS5wdXNoKG5ldyBTdG9wKHN0YXRpb25JZCwgJycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90ZXJtaW5pID0gdGVybWluaTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuL1pvb21lclwiO1xuaW1wb3J0IHsgTGluZUdyb3VwIH0gZnJvbSBcIi4vTGluZUdyb3VwXCI7XG5pbXBvcnQgeyBHcmF2aXRhdG9yIH0gZnJvbSBcIi4vR3Jhdml0YXRvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBZGFwdGVyIHtcbiAgICBjYW52YXNTaXplOiBWZWN0b3I7XG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZDtcbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IG51bGw7XG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uO1xuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZDtcbiAgICB6b29tVG8oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTmV0d29yayBpbXBsZW1lbnRzIFN0YXRpb25Qcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzbGlkZUluZGV4OiB7W2lkOiBzdHJpbmddIDoge1tpZDogc3RyaW5nXTogVGltZWREcmF3YWJsZVtdfX0gPSB7fTtcbiAgICBwcml2YXRlIHN0YXRpb25zOiB7IFtpZDogc3RyaW5nXSA6IFN0YXRpb24gfSA9IHt9O1xuICAgIHByaXZhdGUgbGluZUdyb3VwczogeyBbaWQ6IHN0cmluZ10gOiBMaW5lR3JvdXAgfSA9IHt9O1xuICAgIHByaXZhdGUgZXJhc2VCdWZmZXI6IFRpbWVkRHJhd2FibGVbXSA9IFtdO1xuICAgIHByaXZhdGUgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTmV0d29ya0FkYXB0ZXIpIHtcbiAgICAgICAgdGhpcy5ncmF2aXRhdG9yID0gbmV3IEdyYXZpdGF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmluaXRpYWxpemUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5zdGF0aW9uc1tpZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5hZGFwdGVyLnN0YXRpb25CeUlkKGlkKVxuICAgICAgICAgICAgaWYgKHN0YXRpb24gIT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGlvbnNbaWRdO1xuICAgIH1cblxuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cCB7XG4gICAgICAgIGlmICh0aGlzLmxpbmVHcm91cHNbaWRdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5saW5lR3JvdXBzW2lkXSA9IG5ldyBMaW5lR3JvdXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5saW5lR3JvdXBzW2lkXTtcbiAgICB9XG5cbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5hZGFwdGVyLmNyZWF0ZVZpcnR1YWxTdG9wKGlkLCBiYXNlQ29vcmRzLCByb3RhdGlvbik7XG4gICAgICAgIHRoaXMuc3RhdGlvbnNbaWRdID0gc3RvcDtcbiAgICAgICAgcmV0dXJuIHN0b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaXNwbGF5SW5zdGFudChpbnN0YW50OiBJbnN0YW50KSB7XG4gICAgICAgIGlmICghaW5zdGFudC5lcXVhbHMoSW5zdGFudC5CSUdfQkFORykpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5kcmF3RXBvY2goaW5zdGFudC5lcG9jaCArICcnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCk6IFRpbWVkRHJhd2FibGVbXSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Vwb2NoRXhpc3Rpbmcobm93LmVwb2NoICsgJycpKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZUluZGV4W25vdy5lcG9jaF1bbm93LnNlY29uZF07XG4gICAgfVxuXG4gICAgZHJhd1RpbWVkRHJhd2FibGVzQXQobm93OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmFkYXB0ZXIuY2FudmFzU2l6ZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUluc3RhbnQobm93KTtcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IHRoaXMudGltZWREcmF3YWJsZXNBdChub3cpO1xuICAgICAgICBsZXQgZGVsYXkgPSBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMuZHJhd09yRXJhc2VFbGVtZW50KGVsZW1lbnRzW2ldLCBkZWxheSwgYW5pbWF0ZSwgbm93LCB6b29tZXIpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaEVyYXNlQnVmZmVyKGRlbGF5LCBhbmltYXRlLCB6b29tZXIpO1xuICAgICAgICBjb25zb2xlLmxvZyhub3cpO1xuICAgICAgICBkZWxheSA9IHRoaXMuZ3Jhdml0YXRvci5ncmF2aXRhdGUoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuem9vbVRvKHpvb21lci5jZW50ZXIsIHpvb21lci5zY2FsZSwgem9vbWVyLmR1cmF0aW9uKTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZmx1c2hFcmFzZUJ1ZmZlcihkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCB6b29tZXI6IFpvb21lcik6IG51bWJlciB7XG4gICAgICAgIGZvciAobGV0IGk9dGhpcy5lcmFzZUJ1ZmZlci5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lcmFzZUJ1ZmZlcltpXTtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZEFuaW1hdGUgPSB0aGlzLnNob3VsZEFuaW1hdGUoZWxlbWVudC50bywgYW5pbWF0ZSk7XG4gICAgICAgICAgICBkZWxheSArPSB0aGlzLmVyYXNlRWxlbWVudChlbGVtZW50LCBkZWxheSwgc2hvdWxkQW5pbWF0ZSk7XG4gICAgICAgICAgICB6b29tZXIuaW5jbHVkZShlbGVtZW50LCBmYWxzZSwgc2hvdWxkQW5pbWF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcmFzZUJ1ZmZlciA9IFtdO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3T3JFcmFzZUVsZW1lbnQoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgaW5zdGFudDogSW5zdGFudCwgem9vbWVyOiBab29tZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoaW5zdGFudC5lcXVhbHMoZWxlbWVudC50bykgJiYgIWVsZW1lbnQuZnJvbS5lcXVhbHMoZWxlbWVudC50bykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVyYXNlQnVmZmVyLmxlbmd0aCA+IDAgJiYgdGhpcy5lcmFzZUJ1ZmZlclt0aGlzLmVyYXNlQnVmZmVyLmxlbmd0aC0xXS5uYW1lICE9IGVsZW1lbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaEVyYXNlQnVmZmVyKGRlbGF5LCBhbmltYXRlLCB6b29tZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lcmFzZUJ1ZmZlci5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaEVyYXNlQnVmZmVyKGRlbGF5LCBhbmltYXRlLCB6b29tZXIpO1xuICAgICAgICBjb25zdCBzaG91bGRBbmltYXRlID0gdGhpcy5zaG91bGRBbmltYXRlKGVsZW1lbnQuZnJvbSwgYW5pbWF0ZSk7XG4gICAgICAgIGRlbGF5ICs9IHRoaXMuZHJhd0VsZW1lbnQoZWxlbWVudCwgZGVsYXksIHNob3VsZEFuaW1hdGUpO1xuICAgICAgICB6b29tZXIuaW5jbHVkZShlbGVtZW50LCB0cnVlLCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGRyYXdFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIExpbmUpIHtcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0YXRvci5hZGRFZGdlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50LmRyYXcoZGVsYXksIGFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGVyYXNlRWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZXJhc2UoZGVsYXksIGFuaW1hdGUsIGVsZW1lbnQudG8uZmxhZyA9PSAncmV2ZXJzZScpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHNob3VsZEFuaW1hdGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChpbnN0YW50LmZsYWcgPT0gJ25vYW5pbScpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBhbmltYXRlO1xuICAgIH1cblxuICAgIGlzRXBvY2hFeGlzdGluZyhlcG9jaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdICE9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhZGRUb0luZGV4KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LmZyb20sIGVsZW1lbnQpO1xuICAgICAgICBpZiAoIUluc3RhbnQuQklHX0JBTkcuZXF1YWxzKGVsZW1lbnQudG8pKVxuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LnRvLCBlbGVtZW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNsaWRlSW5kZXhFbGVtZW50KGluc3RhbnQ6IEluc3RhbnQsIGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9IFtdO1xuICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdLnB1c2goZWxlbWVudCk7XG4gICAgfVxuXG4gICAgbmV4dEluc3RhbnQobm93OiBJbnN0YW50KTogSW5zdGFudCB8IG51bGwge1xuICAgICAgICBsZXQgZXBvY2g6IG51bWJlciB8IG51bGwgPSBub3cuZXBvY2g7XG4gICAgICAgIGxldCBzZWNvbmQ6IG51bWJlciB8IG51bGwgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5zZWNvbmQsIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdKTtcbiAgICAgICAgaWYgKHNlY29uZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcG9jaCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LmVwb2NoLCB0aGlzLnNsaWRlSW5kZXgpO1xuICAgICAgICAgICAgaWYgKGVwb2NoID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHNlY29uZCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUoLTEsIHRoaXMuc2xpZGVJbmRleFtlcG9jaF0pO1xuICAgICAgICAgICAgaWYgKHNlY29uZCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW50KGVwb2NoLCBzZWNvbmQsICcnKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmaW5kU21hbGxlc3RBYm92ZSh0aHJlc2hvbGQ6IG51bWJlciwgZGljdDoge1tpZDogbnVtYmVyXTogYW55fSk6IG51bWJlciB8IG51bGwge1xuICAgICAgICBpZiAoZGljdCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGljdCkpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChrZXkpID4gdGhyZXNob2xkICYmIChzbWFsbGVzdCA9PSBudWxsIHx8IHBhcnNlSW50KGtleSkgPCBzbWFsbGVzdCkpIHtcbiAgICAgICAgICAgICAgICBzbWFsbGVzdCA9IHBhcnNlSW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNtYWxsZXN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IExpbmVBdFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJyZWRUcmFjayB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgaWYgKHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlID49IDAgPyAnKycgOiAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayhwcmVmaXggKyB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihhdFN0YXRpb246IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGF0U3RhdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhY2tOdW1iZXIoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tTnVtYmVyKGF0U3RhdGlvbi50cmFjayk7ICAgICAgICBcbiAgICB9XG5cbiAgICBrZWVwT25seVNpZ24oKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy52YWx1ZVswXTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayh2ID09ICctJyA/IHYgOiAnKycpO1xuICAgIH1cblxuICAgIGhhc1RyYWNrTnVtYmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGdldCB0cmFja051bWJlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy52YWx1ZS5yZXBsYWNlKCcqJywgJycpKVxuICAgIH1cblxuICAgIGlzUG9zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdICE9ICctJztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgICBwcml2YXRlIHN0YXRpYyBESVJTOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7J3N3JzogLTEzNSwgJ3cnOiAtOTAsICdudyc6IC00NSwgJ24nOiAwLCAnbmUnOiA0NSwgJ2UnOiA5MCwgJ3NlJzogMTM1LCAncyc6IDE4MH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWdyZWVzOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGRpcmVjdGlvbjogc3RyaW5nKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKFJvdGF0aW9uLkRJUlNbZGlyZWN0aW9uXSlcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhSb3RhdGlvbi5ESVJTKSkge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2YWx1ZSwgdGhpcy5kZWdyZWVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG5cbiAgICBnZXQgZGVncmVlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVncmVlcztcbiAgICB9XG5cbiAgICBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzIC8gMTgwICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICBhZGQodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLmRlZ3JlZXMgKyB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGlmIChzdW0gPD0gLTE4MClcbiAgICAgICAgICAgIHN1bSArPSAzNjA7XG4gICAgICAgIGlmIChzdW0gPiAxODApXG4gICAgICAgICAgICBzdW0gLT0gMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHN1bSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBsZXQgYiA9IHRoYXQuZGVncmVlcztcbiAgICAgICAgbGV0IGRpc3QgPSBiLWE7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0KSA+IDE4MCkge1xuICAgICAgICAgICAgaWYgKGEgPCAwKVxuICAgICAgICAgICAgICAgIGEgKz0gMzYwO1xuICAgICAgICAgICAgaWYgKGIgPCAwKVxuICAgICAgICAgICAgICAgIGIgKz0gMzYwO1xuICAgICAgICAgICAgZGlzdCA9IGItYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpc3QpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBkaXIgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGlyLCAtOTApKVxuICAgICAgICAgICAgZGlyID0gMDtcbiAgICAgICAgZWxzZSBpZiAoZGlyIDwgLTkwKVxuICAgICAgICAgICAgZGlyICs9IDE4MDtcbiAgICAgICAgZWxzZSBpZiAoZGlyID4gOTApXG4gICAgICAgICAgICBkaXIgLT0gMTgwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpcik7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAlIDE4MCA9PSAwO1xuICAgIH1cblxuICAgIHF1YXJ0ZXJEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGNvbnN0IGRlZyA9IGRlbHRhRGlyIDwgMCA/IE1hdGguY2VpbCgoZGVsdGFEaXItNDUpLzkwKSA6IE1hdGguZmxvb3IoKGRlbHRhRGlyKzQ1KS85MCk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKjkwKTtcbiAgICB9XG5cbiAgICBoYWxmRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBzcGxpdEF4aXM6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBsZXQgZGVnO1xuICAgICAgICBpZiAoc3BsaXRBeGlzLmlzVmVydGljYWwoKSkge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgMCAmJiBkZWx0YURpciA+PSAtMTgwKVxuICAgICAgICAgICAgICAgIGRlZyA9IC05MDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSA5MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDkwICYmIGRlbHRhRGlyID49IC05MClcbiAgICAgICAgICAgICAgICBkZWcgPSAwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDE4MDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyk7XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uQWRhcHRlciB7XG4gICAgYmFzZUNvb3JkczogVmVjdG9yO1xuICAgIHJvdGF0aW9uOiBSb3RhdGlvbjtcbiAgICBsYWJlbERpcjogUm90YXRpb247XG4gICAgaWQ6IHN0cmluZztcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGlvbklkOiBzdHJpbmcsIHB1YmxpYyBwcmVmZXJyZWRUcmFjazogc3RyaW5nKSB7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUF0U3RhdGlvbiB7XG4gICAgbGluZT86IExpbmU7XG4gICAgYXhpczogc3RyaW5nO1xuICAgIHRyYWNrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aW9uIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IExpbmVBdFN0YXRpb25bXX0gPSB7eDogW10sIHk6IFtdfTtcbiAgICBwcml2YXRlIGV4aXN0aW5nTGFiZWxzOiBMYWJlbFtdID0gW107XG4gICAgcHJpdmF0ZSBwaGFudG9tPzogTGluZUF0U3RhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogU3RhdGlvbkFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGdldCBiYXNlQ29vcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgc2V0IGJhc2VDb29yZHMoYmFzZUNvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzID0gYmFzZUNvb3JkcztcbiAgICB9XG5cbiAgICBhZGRMaW5lKGxpbmU6IExpbmUsIGF4aXM6IHN0cmluZywgdHJhY2s6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBoYW50b20gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMaW5lc1theGlzXS5wdXNoKHtsaW5lOiBsaW5lLCBheGlzOiBheGlzLCB0cmFjazogdHJhY2t9KTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy54KTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy55KTtcbiAgICB9XG5cbiAgICBhZGRMYWJlbChsYWJlbDogTGFiZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmV4aXN0aW5nTGFiZWxzLmluY2x1ZGVzKGxhYmVsKSlcbiAgICAgICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmV4aXN0aW5nTGFiZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMYWJlbHNbaV0gPT0gbGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxhYmVscygpOiBMYWJlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhpc3RpbmdMYWJlbHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVMaW5lQXRBeGlzKGxpbmU6IExpbmUsIGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiB2b2lkIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLmxpbmUgPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGhhbnRvbSA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nTGluZXNGb3JBeGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKGxpbmVOYW1lOiBzdHJpbmcpOiBMaW5lQXRTdGF0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIGlmICh4ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgICAgIGlmICh5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZTogc3RyaW5nLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lPy5uYW1lID09IGxpbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXNzaWduVHJhY2soYXhpczogc3RyaW5nLCBwcmVmZXJyZWRUcmFjazogUHJlZmVycmVkVHJhY2ssIGxpbmU6IExpbmUpOiBudW1iZXIgeyBcbiAgICAgICAgaWYgKHByZWZlcnJlZFRyYWNrLmhhc1RyYWNrTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay50cmFja051bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5waGFudG9tPy5saW5lPy5uYW1lID09IGxpbmUubmFtZSAmJiB0aGlzLnBoYW50b20/LmF4aXMgPT0gYXhpcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGhhbnRvbT8udHJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzKClbYXhpc107XG4gICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay5pc1Bvc2l0aXZlKCkgPyBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzFdICsgMSA6IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXNbMF0gLSAxO1xuICAgIH1cblxuICAgIHJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKGluY29taW5nRGlyOiBSb3RhdGlvbiwgYXNzaWduZWRUcmFjazogbnVtYmVyKTogVmVjdG9yIHsgXG4gICAgICAgIGxldCBuZXdDb29yZDogVmVjdG9yO1xuICAgICAgICBpZiAoaW5jb21pbmdEaXIuZGVncmVlcyAlIDE4MCA9PSAwKSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoMCwgYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Q29vcmQgPSBuZXdDb29yZC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgICAgIG5ld0Nvb3JkID0gdGhpcy5iYXNlQ29vcmRzLmFkZChuZXdDb29yZCk7XG4gICAgICAgIHJldHVybiBuZXdDb29yZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllcygpOiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzLngpLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy55KVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMoZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbMSwgLTFdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgbGV0IHJpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0gZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVmdCA+IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbGVmdCwgcmlnaHRdO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMuZm9yRWFjaChsID0+IGwuZHJhdyhkZWxheVNlY29uZHMsIGZhbHNlKSk7XG4gICAgICAgIGNvbnN0IHQgPSBzdGF0aW9uLnBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdDsgfSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHRvOiBWZWN0b3IpIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5U2Vjb25kcywgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCB0aGlzLmJhc2VDb29yZHMsIHRvLCAoKSA9PiBzdGF0aW9uLmV4aXN0aW5nTGFiZWxzLmZvckVhY2gobCA9PiBsLmRyYXcoMCwgZmFsc2UpKSk7XG4gICAgfVxuXG4gICAgc3RhdGlvblNpemVGb3JBeGlzKGF4aXM6IHN0cmluZywgdmVjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZlY3RvciwgMCkpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY29uc3QgZGlyID0gTWF0aC5zaWduKHZlY3Rvcik7XG4gICAgICAgIGxldCBkaW1lbiA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10pW3ZlY3RvciA8IDAgPyAwIDogMV07XG4gICAgICAgIGlmIChkaXIqZGltZW4gPCAwKSB7XG4gICAgICAgICAgICBkaW1lbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgZGlyICogKFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOICsgU3RhdGlvbi5MQUJFTF9ESVNUQU5DRSk7XG4gICAgfVxuXG4gICAgbGluZXNFeGlzdGluZygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMaW5lcy54Lmxlbmd0aCA+IDAgfHwgdGhpcy5leGlzdGluZ0xpbmVzLnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVXRpbHMge1xuICAgIHN0YXRpYyByZWFkb25seSBJTVBSRUNJU0lPTjogbnVtYmVyID0gMC4wMDE7XG5cbiAgICBzdGF0aWMgZXF1YWxzKGE6IG51bWJlciwgYjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gYikgPCBVdGlscy5JTVBSRUNJU0lPTjtcbiAgICB9XG5cbiAgICBzdGF0aWMgdHJpbGVtbWEoaW50OiBudW1iZXIsIG9wdGlvbnM6IFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoaW50LCAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNbMV07XG4gICAgICAgIH0gZWxzZSBpZiAoaW50ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNbMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdGlvbnNbMF07XG4gICAgfVxuXG4gICAgc3RhdGljIGFscGhhYmV0aWNJZChhOiBzdHJpbmcsIGI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChhIDwgYilcbiAgICAgICAgICAgIHJldHVybiBhICsgJ18nICsgYjtcbiAgICAgICAgcmV0dXJuIGIgKyAnXycgKyBhO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBWZWN0b3Ige1xuICAgIHN0YXRpYyBVTklUOiBWZWN0b3IgPSBuZXcgVmVjdG9yKDAsIC0xKTtcbiAgICBzdGF0aWMgTlVMTDogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAwKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3g6IG51bWJlciwgcHJpdmF0ZSBfeTogbnVtYmVyKSB7XG5cbiAgICB9XG5cbiAgICBnZXQgeCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5feDtcbiAgICB9XG5cbiAgICBnZXQgeSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5feTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LCAyKSArIE1hdGgucG93KHRoaXMueSwgMikpO1xuICAgIH1cblxuICAgIHdpdGhMZW5ndGgobGVuZ3RoOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCByYXRpbyA9IHRoaXMubGVuZ3RoICE9IDAgPyBsZW5ndGgvdGhpcy5sZW5ndGggOiAwO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngqcmF0aW8sIHRoaXMueSpyYXRpbyk7XG4gICAgfVxuXG4gICAgYWRkKHRoYXQgOiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKyB0aGF0LngsIHRoaXMueSArIHRoYXQueSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhhdC54IC0gdGhpcy54LCB0aGF0LnkgLSB0aGlzLnkpO1xuICAgIH1cblxuICAgIHJvdGF0ZSh0aGV0YTogUm90YXRpb24pOiBWZWN0b3Ige1xuICAgICAgICBsZXQgcmFkOiBudW1iZXIgPSB0aGV0YS5yYWRpYW5zO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKiBNYXRoLmNvcyhyYWQpIC0gdGhpcy55ICogTWF0aC5zaW4ocmFkKSwgdGhpcy54ICogTWF0aC5zaW4ocmFkKSArIHRoaXMueSAqIE1hdGguY29zKHJhZCkpO1xuICAgIH1cblxuICAgIGRvdFByb2R1Y3QodGhhdDogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCp0aGF0LngrdGhpcy55KnRoYXQueTtcbiAgICB9XG5cbiAgICBzb2x2ZURlbHRhRm9ySW50ZXJzZWN0aW9uKGRpcjE6IFZlY3RvciwgZGlyMjogVmVjdG9yKToge2E6IG51bWJlciwgYjogbnVtYmVyfSB7XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSB0aGlzO1xuICAgICAgICBjb25zdCBzd2FwWmVyb0RpdmlzaW9uID0gVXRpbHMuZXF1YWxzKGRpcjIueSwgMCk7XG4gICAgICAgIGNvbnN0IHggPSBzd2FwWmVyb0RpdmlzaW9uID8gJ3knIDogJ3gnO1xuICAgICAgICBjb25zdCB5ID0gc3dhcFplcm9EaXZpc2lvbiA/ICd4JyA6ICd5JztcbiAgICAgICAgY29uc3QgZGVub21pbmF0b3IgPSAoZGlyMVt5XSpkaXIyW3hdLWRpcjFbeF0qZGlyMlt5XSk7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGVub21pbmF0b3IsIDApKSB7XG4gICAgICAgICAgICByZXR1cm4ge2E6IE5hTiwgYjogTmFOfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhID0gKGRlbHRhW3ldKmRpcjJbeF0tZGVsdGFbeF0qZGlyMlt5XSkvZGVub21pbmF0b3I7XG4gICAgICAgIGNvbnN0IGIgPSAoYSpkaXIxW3ldLWRlbHRhW3ldKS9kaXIyW3ldO1xuICAgICAgICByZXR1cm4ge2EsIGJ9O1xuICAgIH1cblxuICAgIGlzRGVsdGFNYXRjaGluZ1BhcmFsbGVsKGRpcjE6IFZlY3RvciwgZGlyMjogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsbEVxdWFsWmVybyh0aGlzLngsIGRpcjEueCwgZGlyMi54KSB8fCB0aGlzLmFsbEVxdWFsWmVybyh0aGlzLnksIGRpcjEueSwgZGlyMi55KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFsbEVxdWFsWmVybyhuMTogbnVtYmVyLCBuMjogbnVtYmVyLCBuMzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBVdGlscy5lcXVhbHMobjEsIDApICYmIFV0aWxzLmVxdWFscyhuMiwgMCkgJiYgVXRpbHMuZXF1YWxzKG4zLCAwKTtcbiAgICB9XG5cbiAgICBpbmNsaW5hdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy54LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy55ID4gMCA/IDE4MCA6IDApO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueSwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueCA+IDAgPyA5MCA6IC05MCk7XG4gICAgICAgIGNvbnN0IGFkamFjZW50ID0gbmV3IFZlY3RvcigwLC1NYXRoLmFicyh0aGlzLnkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihNYXRoLnNpZ24odGhpcy54KSpNYXRoLmFjb3ModGhpcy5kb3RQcm9kdWN0KGFkamFjZW50KS9hZGphY2VudC5sZW5ndGgvdGhpcy5sZW5ndGgpKjE4MC9NYXRoLlBJKTtcbiAgICB9XG5cbiAgICBhbmdsZShvdGhlcjogVmVjdG9yKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmNsaW5hdGlvbigpLmRlbHRhKG90aGVyLmluY2xpbmF0aW9uKCkpO1xuICAgIH1cblxuICAgIGJvdGhBeGlzTWlucyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54IDwgb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA8IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJvdGhBeGlzTWF4cyhvdGhlcjogVmVjdG9yKSB7XG4gICAgICAgIGlmICh0aGlzID09IFZlY3Rvci5OVUxMKVxuICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICBpZiAob3RoZXIgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ID4gb3RoZXIueCA/IHRoaXMueCA6IG90aGVyLngsIHRoaXMueSA+IG90aGVyLnkgPyB0aGlzLnkgOiBvdGhlci55KVxuICAgIH1cblxuICAgIGJldHdlZW4ob3RoZXI6IFZlY3RvciwgeDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5kZWx0YShvdGhlcik7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChkZWx0YS53aXRoTGVuZ3RoKGRlbHRhLmxlbmd0aCp4KSk7XG4gICAgfVxufSIsImltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuXG5cblxuZXhwb3J0IGNsYXNzIFpvb21lciB7XG4gICAgc3RhdGljIFpPT01fRFVSQVRJT04gPSAxO1xuICAgIHN0YXRpYyBaT09NX01BWF9TQ0FMRSA9IDM7XG4gICAgc3RhdGljIFBBRERJTkdfRkFDVE9SID0gMjU7XG4gICAgXG4gICAgcHJpdmF0ZSBib3VuZGluZ0JveCA9IHt0bDogVmVjdG9yLk5VTEwsIGJyOiBWZWN0b3IuTlVMTH07XG4gICAgcHJpdmF0ZSBjdXN0b21EdXJhdGlvbiA9IDA7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXNTaXplOiBWZWN0b3IpIHtcblxuICAgIH1cblxuICAgIGluY2x1ZGUoZWxlbWVudDogVGltZWREcmF3YWJsZSwgZHJhdzogYm9vbGVhbiwgc2hvdWxkQW5pbWF0ZTogYm9vbGVhbikge1xuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBlbGVtZW50LmJvdW5kaW5nQm94O1xuICAgICAgICBjb25zdCBub3cgPSBkcmF3ID8gZWxlbWVudC5mcm9tIDogZWxlbWVudC50bztcbiAgICAgICAgaWYgKHNob3VsZEFuaW1hdGUgJiYgIW5vdy5mbGFnLmluY2x1ZGVzKCdub3pvb20nKSkge1xuICAgICAgICAgICAgaWYgKG5vdy5mbGFnLmluY2x1ZGVzKCdzbG93em9vbScpICYmIGRyYXcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbUR1cmF0aW9uID0gZWxlbWVudC5mcm9tLmRlbHRhKGVsZW1lbnQudG8pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib3VuZGluZ0JveCA9IHRoaXMucGFkZGVkQm91bmRpbmdCb3goYm91bmRpbmdCb3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC50bCA9IHRoaXMuYm91bmRpbmdCb3gudGwuYm90aEF4aXNNaW5zKGJvdW5kaW5nQm94LnRsKTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3guYnIgPSB0aGlzLmJvdW5kaW5nQm94LmJyLmJvdGhBeGlzTWF4cyhib3VuZGluZ0JveC5icik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGVuZm9yY2VkQm91bmRpbmdCb3goKToge3RsOiBWZWN0b3IsIGJyOiBWZWN0b3J9IHtcbiAgICAgICAgaWYgKHRoaXMuYm91bmRpbmdCb3gudGwgIT0gVmVjdG9yLk5VTEwgJiYgdGhpcy5ib3VuZGluZ0JveC5iciAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgY29uc3QgcGFkZGVkQm91bmRpbmdCb3ggPSB0aGlzLmJvdW5kaW5nQm94O1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBwYWRkZWRCb3VuZGluZ0JveC50bC5kZWx0YShwYWRkZWRCb3VuZGluZ0JveC5icik7XG4gICAgICAgICAgICBjb25zdCBtaW5ab29tU2l6ZSA9IG5ldyBWZWN0b3IodGhpcy5jYW52YXNTaXplLnggLyBab29tZXIuWk9PTV9NQVhfU0NBTEUsIHRoaXMuY2FudmFzU2l6ZS55IC8gWm9vbWVyLlpPT01fTUFYX1NDQUxFKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gem9vbVNpemUuZGVsdGEobWluWm9vbVNpemUpO1xuICAgICAgICAgICAgY29uc3QgYWRkaXRpb25hbFNwYWNpbmcgPSBuZXcgVmVjdG9yKE1hdGgubWF4KDAsIGRlbHRhLngvMiksIE1hdGgubWF4KDAsIGRlbHRhLnkvMikpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRsOiBwYWRkZWRCb3VuZGluZ0JveC50bC5hZGQoYWRkaXRpb25hbFNwYWNpbmcucm90YXRlKG5ldyBSb3RhdGlvbigxODApKSksXG4gICAgICAgICAgICAgICAgYnI6IHBhZGRlZEJvdW5kaW5nQm94LmJyLmFkZChhZGRpdGlvbmFsU3BhY2luZylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmRpbmdCb3g7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYWRkZWRCb3VuZGluZ0JveChib3VuZGluZ0JveDoge3RsOiBWZWN0b3IsIGJyOiBWZWN0b3J9KToge3RsOiBWZWN0b3IsIGJyOiBWZWN0b3J9IHtcbiAgICAgICAgY29uc3QgcGFkZGluZyA9ICh0aGlzLmNhbnZhc1NpemUueCArIHRoaXMuY2FudmFzU2l6ZS55KS9ab29tZXIuUEFERElOR19GQUNUT1I7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0bDogYm91bmRpbmdCb3gudGwuYWRkKG5ldyBWZWN0b3IoLXBhZGRpbmcsIC1wYWRkaW5nKSksXG4gICAgICAgICAgICBicjogYm91bmRpbmdCb3guYnIuYWRkKG5ldyBWZWN0b3IocGFkZGluZywgcGFkZGluZykpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IGNlbnRlcigpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBlbmZvcmNlZEJvdW5kaW5nQm94ID0gdGhpcy5lbmZvcmNlZEJvdW5kaW5nQm94KCk7XG4gICAgICAgIGlmIChlbmZvcmNlZEJvdW5kaW5nQm94LnRsICE9IFZlY3Rvci5OVUxMICYmIGVuZm9yY2VkQm91bmRpbmdCb3guYnIgIT0gVmVjdG9yLk5VTEwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueCArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueCkvMiksIFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueSArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueSkvMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMuY2FudmFzU2l6ZS54IC8gMiwgdGhpcy5jYW52YXNTaXplLnkgLyAyKTtcbiAgICB9XG5cbiAgICBnZXQgc2NhbGUoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZW5mb3JjZWRCb3VuZGluZ0JveCA9IHRoaXMuZW5mb3JjZWRCb3VuZGluZ0JveCgpO1xuICAgICAgICBpZiAoZW5mb3JjZWRCb3VuZGluZ0JveC50bCAhPSBWZWN0b3IuTlVMTCAmJiBlbmZvcmNlZEJvdW5kaW5nQm94LmJyICE9IFZlY3Rvci5OVUxMKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tU2l6ZSA9IGVuZm9yY2VkQm91bmRpbmdCb3gudGwuZGVsdGEoZW5mb3JjZWRCb3VuZGluZ0JveC5icik7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5taW4odGhpcy5jYW52YXNTaXplLnggLyB6b29tU2l6ZS54LCB0aGlzLmNhbnZhc1NpemUueSAvIHpvb21TaXplLnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGdldCBkdXJhdGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5jdXN0b21EdXJhdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9vbWVyLlpPT01fRFVSQVRJT047XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tRHVyYXRpb247XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL3N2Zy9TdmdOZXR3b3JrXCI7XG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcblxuLy8gVE9ETzogZXJhc2UgYW5pbSwgbGFiZWxzLCBuZWdhdGl2ZSBkZWZhdWx0IHRyYWNrcyBiYXNlZCBvbiBkaXJlY3Rpb24sIHJlam9pbiBsaW5lcyB0cmFjayBzZWxlY3Rpb25cblxuY29uc3QgbmV0d29yazogTmV0d29yayA9IG5ldyBOZXR3b3JrKG5ldyBTdmdOZXR3b3JrKCkpO1xubmV0d29yay5pbml0aWFsaXplKCk7XG5cbmNvbnN0IGFuaW1hdGVGcm9tSW5zdGFudDogSW5zdGFudCA9IGdldFN0YXJ0SW5zdGFudCgpO1xuc2xpZGUoSW5zdGFudC5CSUdfQkFORywgZmFsc2UpO1xuXG5mdW5jdGlvbiBnZXRTdGFydEluc3RhbnQoKTogSW5zdGFudCB7XG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0ZUZyb21JbnN0YW50OiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJykuc3BsaXQoJy0nKTtcbiAgICAgICAgY29uc3QgaW5zdGFudCA9IG5ldyBJbnN0YW50KHBhcnNlSW50KGFuaW1hdGVGcm9tSW5zdGFudFswXSkgfHwgMCwgcGFyc2VJbnQoYW5pbWF0ZUZyb21JbnN0YW50WzFdKSB8fCAwLCAnJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmYXN0IGZvcndhcmQgdG8nLCBpbnN0YW50KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbnQ7XG4gICAgfVxuICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xufVxuXG5mdW5jdGlvbiBzbGlkZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGluc3RhbnQuZXBvY2ggPT0gYW5pbWF0ZUZyb21JbnN0YW50LmVwb2NoICYmIGluc3RhbnQuc2Vjb25kID49IGFuaW1hdGVGcm9tSW5zdGFudC5zZWNvbmQpXG4gICAgICAgIGFuaW1hdGUgPSB0cnVlO1xuXG4gICAgbmV0d29yay5kcmF3VGltZWREcmF3YWJsZXNBdChpbnN0YW50LCBhbmltYXRlKTtcbiAgICBjb25zdCBuZXh0ID0gbmV0d29yay5uZXh0SW5zdGFudChpbnN0YW50KTtcbiAgICBcbiAgICBpZiAobmV4dCkge1xuICAgICAgICBjb25zdCBkZWxheSA9IGFuaW1hdGUgPyBpbnN0YW50LmRlbHRhKG5leHQpIDogMDtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHNsaWRlKG5leHQsIGFuaW1hdGUpOyB9LCBkZWxheSAqIDEwMDApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uL1ZlY3RvclwiO1xuaW1wb3J0IHsgR2VuZXJpY1RpbWVkRHJhd2FibGVBZGFwdGVyIH0gZnJvbSBcIi4uL0dlbmVyaWNUaW1lZERyYXdhYmxlXCI7XG5pbXBvcnQgeyBERUZBVUxUX01JTl9WRVJTSU9OIH0gZnJvbSBcInRsc1wiO1xuXG5leHBvcnQgY2xhc3MgU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGUgaW1wbGVtZW50cyBHZW5lcmljVGltZWREcmF3YWJsZUFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IHt0bDogVmVjdG9yLCBicjogVmVjdG9yfSB7XG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpO1xuICAgICAgICBjb25zdCBiYm94ID0ge3RsOiBuZXcgVmVjdG9yKHIueCwgci55KSwgYnI6IG5ldyBWZWN0b3Ioci54K3Iud2lkdGgsIHIueStyLmhlaWdodCl9O1xuICAgICAgICBjb25zb2xlLmxvZygnYmJveCcsIGJib3gpO1xuICAgICAgICByZXR1cm4gYmJveDtcbiAgICB9XG5cbiAgICBnZXQgem9vbSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0Wyd6b29tJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFsnem9vbSddLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihwYXJzZUludChjZW50ZXJbMF0pIHx8IDUwLCBwYXJzZUludChjZW50ZXJbMV0pIHx8IDUwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVmVjdG9yLk5VTEw7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxhYmVsLmRyYXcoMCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZXJhc2UoMCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnN0YW50KGZyb21PclRvOiBzdHJpbmcpOiBJbnN0YW50IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXT8uc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgaWYgKGFyciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5zdGFudC5mcm9tKGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG4gICAgfVxufSIsImltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbEFkYXB0ZXIsIExhYmVsIH0gZnJvbSBcIi4uL0xhYmVsXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4uL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uL1V0aWxzXCI7XG5pbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTGFiZWwgaW1wbGVtZW50cyBMYWJlbEFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIGdldCBmb3JTdGF0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGF0aW9uO1xuICAgIH1cblxuICAgIGdldCBmb3JMaW5lKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lO1xuICAgIH1cblxuICAgIGdldCBib3VuZGluZ0JveCgpOiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn0ge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPT0gJ3Zpc2libGUnKSB7XG4gICAgICAgICAgICBjb25zdCByID0gdGhpcy5lbGVtZW50LmdldEJCb3goKTtcbiAgICAgICAgICAgIHJldHVybiB7dGw6IG5ldyBWZWN0b3Ioci54LCByLnkpLCBicjogbmV3IFZlY3RvcihyLngrci53aWR0aCwgci55K3IuaGVpZ2h0KX07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt0bDogVmVjdG9yLk5VTEwsIGJyOiBWZWN0b3IuTlVMTH07XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxhYmVsLmRyYXcoMCwgdGV4dENvb3JkcywgbGFiZWxEaXIsIGNoaWxkcmVuKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDb29yZCh0aGlzLmVsZW1lbnQsIHRleHRDb29yZHMpO1xuXG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdMaW5lTGFiZWxzKGxhYmVsRGlyLCBjaGlsZHJlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdTdGF0aW9uTGFiZWwobGFiZWxEaXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGUoYm94RGltZW46IFZlY3RvciwgbGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnXG4gICAgICAgICAgICArIFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueCwgWy1ib3hEaW1lbi54ICsgJ3B4JywgLWJveERpbWVuLngvMiArICdweCcsICcwcHgnXSlcbiAgICAgICAgICAgICsgJywnXG4gICAgICAgICAgICArIFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueSwgWy1MYWJlbC5MQUJFTF9IRUlHSFQgKyAncHgnLCAtTGFiZWwuTEFCRUxfSEVJR0hULzIgKyAncHgnLCAnMHB4J10pIC8vIFRPRE8gbWFnaWMgbnVtYmVyc1xuICAgICAgICAgICAgKyAnKSc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xpbmVMYWJlbHMobGFiZWxEaXI6IFJvdGF0aW9uLCBjaGlsZHJlbjogTGFiZWxBZGFwdGVyW10pIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgaWYgKGMgaW5zdGFuY2VvZiBTdmdMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0xpbmVMYWJlbChjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgvTWF0aC5tYXgodGhpcy5lbGVtZW50LmdldEJCb3goKS53aWR0aCwgMSk7XG4gICAgICAgIGNvbnN0IGJib3ggPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IoYmJveC53aWR0aC9zY2FsZSwgYmJveC5oZWlnaHQvc2NhbGUpLCBsYWJlbERpcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVsKGxhYmVsOiBTdmdMYWJlbCkge1xuICAgICAgICBjb25zdCBsaW5lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnLCAnZGl2Jyk7XG4gICAgICAgIGxpbmVMYWJlbC5jbGFzc05hbWUgPSBsYWJlbC5jbGFzc05hbWVzO1xuICAgICAgICBsaW5lTGFiZWwuaW5uZXJIVE1MID0gbGFiZWwudGV4dDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3U3RhdGlvbkxhYmVsKGxhYmVsRGlyOiBSb3RhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbC5pbmNsdWRlcygnZm9yLXN0YXRpb24nKSlcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIGZvci1zdGF0aW9uJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmRvbWluYW50QmFzZWxpbmUgPSAnaGFuZ2luZyc7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IodGhpcy5lbGVtZW50LmdldEJCb3goKS53aWR0aCwgdGhpcy5lbGVtZW50LmdldEJCb3goKS5oZWlnaHQpLCBsYWJlbERpcik7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBsYWJlbC5lcmFzZSgwKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGdldCBjbGFzc05hbWVzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgKyAnICcgKyB0aGlzLmZvckxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgY2xvbmVGb3JTdGF0aW9uKHN0YXRpb25JZDogc3RyaW5nKTogTGFiZWxBZGFwdGVyIHtcbiAgICAgICAgY29uc3QgbGluZUxhYmVsOiBTVkdHcmFwaGljc0VsZW1lbnQgPSA8U1ZHR3JhcGhpY3NFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgICAgICBsaW5lTGFiZWwuY2xhc3NOYW1lLmJhc2VWYWwgKz0gJyBmb3ItbGluZSc7XG4gICAgICAgIGxpbmVMYWJlbC5kYXRhc2V0LnN0YXRpb24gPSBzdGF0aW9uSWQ7XG4gICAgICAgIGxpbmVMYWJlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgICBsaW5lTGFiZWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpb25zJyk/LmFwcGVuZENoaWxkKGxpbmVMYWJlbCk7XG4gICAgICAgIHJldHVybiBuZXcgU3ZnTGFiZWwobGluZUxhYmVsKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBMaW5lQWRhcHRlciwgTGluZSB9IGZyb20gXCIuLi9MaW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL1N2Z05ldHdvcmtcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xpbmUgaW1wbGVtZW50cyBMaW5lQWRhcHRlciB7XG5cbiAgICBwcml2YXRlIF9zdG9wczogU3RvcFtdID0gW107XG4gICAgYm91bmRpbmdCb3ggPSB7dGw6IFZlY3Rvci5OVUxMLCBicjogVmVjdG9yLk5VTEx9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdQYXRoRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LmxpbmUgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IHdlaWdodCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5lbGVtZW50LmRhdGFzZXQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUJvdW5kaW5nQm94KHBhdGg6IFZlY3RvcltdKTogdm9pZCB7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8cGF0aC5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LnRsID0gdGhpcy5ib3VuZGluZ0JveC50bC5ib3RoQXhpc01pbnMocGF0aFtpXSk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LmJyID0gdGhpcy5ib3VuZGluZ0JveC5ici5ib3RoQXhpc01heHMocGF0aFtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluc3RhbnQoZnJvbU9yVG86IHN0cmluZyk6IEluc3RhbnQge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5lbGVtZW50LmRhdGFzZXRbZnJvbU9yVG9dPy5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICBpZiAoYXJyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbnN0YW50LmZyb20oYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5zdGFudC5CSUdfQkFORztcbiAgICB9XG5cblxuICAgIGdldCBzdG9wcygpOiBTdG9wW10ge1xuICAgICAgICBpZiAodGhpcy5fc3RvcHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0b3BzPy5zcGxpdCgvXFxzKy8pIHx8IFtdO1xuICAgICAgICAgICAgbGV0IG5leHRTdG9wID0gbmV3IFN0b3AoJycsICcnKTtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dG9rZW5zPy5sZW5ndGg7aSsrKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0b2tlbnNbaV1bMF0gIT0gJy0nICYmIHRva2Vuc1tpXVswXSAhPSAnKycgJiYgdG9rZW5zW2ldWzBdICE9ICcqJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BzLnB1c2gobmV4dFN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AucHJlZmVycmVkVHJhY2sgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9wcztcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcGF0aDogVmVjdG9yW10sIGxlbmd0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3gocGF0aCk7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgbGluZS5kcmF3KDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgcGF0aCwgbGVuZ3RoKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgJyArIHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHBhdGgpO1xuICAgIFxuICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheShsZW5ndGgpOyAgICAgICAgXG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgbGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShsZW5ndGgsIDAsIC1sZW5ndGgvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTKTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yW10sIHRvOiBWZWN0b3JbXSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHRvKTtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBsaW5lLm1vdmUoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBmcm9tLCB0byk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb20sIHRvLCAwLCAxL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUyk7XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuLCBsZW5ndGg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGluZS5lcmFzZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHJldmVyc2UsIGxlbmd0aCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmcm9tID0gMDtcbiAgICAgICAgaWYgKGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcyA9PSAwKSB7XG4gICAgICAgICAgICBmcm9tID0gbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHJldmVyc2UgPyAtMSA6IDE7XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lKGZyb20sIGxlbmd0aCAqIGRpcmVjdGlvbiwgbGVuZ3RoL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUyAqIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVQYXRoKHBhdGg6IFZlY3RvcltdKSB7XG4gICAgICAgIGNvbnN0IGQgPSAnTScgKyBwYXRoLm1hcCh2ID0+IHYueCsnLCcrdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVEYXNoYXJyYXkobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGRhc2hlZFBhcnQgPSBsZW5ndGggKyAnJztcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuc3Ryb2tlRGFzaGFycmF5LnJlcGxhY2UoL1teMC05XFxzLF0rL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHByZXNldEFycmF5ID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuZGFzaEluaXRpYWwuc3BsaXQoL1tcXHMsXSsvKTtcbiAgICAgICAgICAgIGlmIChwcmVzZXRBcnJheS5sZW5ndGggJSAyID09IDEpXG4gICAgICAgICAgICAgICAgcHJlc2V0QXJyYXkgPSBwcmVzZXRBcnJheS5jb25jYXQocHJlc2V0QXJyYXkpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0TGVuZ3RoID0gcHJlc2V0QXJyYXkubWFwKGEgPT4gcGFyc2VJbnQoYSkgfHwgMCkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG4gICAgICAgICAgICBkYXNoZWRQYXJ0ID0gbmV3IEFycmF5KE1hdGguY2VpbChsZW5ndGggLyBwcmVzZXRMZW5ndGggKyAxKSkuam9pbihwcmVzZXRBcnJheS5qb2luKCcgJykgKyAnICcpICsgJzAnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBkYXNoZWRQYXJ0ICsgJyAnICsgbGVuZ3RoO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZShmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvblBlckZyYW1lIDwgMCAmJiBmcm9tID4gdG8gfHwgYW5pbWF0aW9uUGVyRnJhbWUgPiAwICYmIGZyb20gPCB0bykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBmcm9tICsgJyc7XG4gICAgICAgICAgICBmcm9tICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZShmcm9tLCB0bywgYW5pbWF0aW9uUGVyRnJhbWUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gdG8gKyAnJztcbiAgICAgICAgICAgIGlmICh0byAhPSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10sIHg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVycG9sYXRlZCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZWQucHVzaChmcm9tW2ldLmJldHdlZW4odG9baV0sIHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KGludGVycG9sYXRlZFswXS5kZWx0YShpbnRlcnBvbGF0ZWRbaW50ZXJwb2xhdGVkLmxlbmd0aC0xXSkubGVuZ3RoKTsgLy8gVE9ETyBhcmJpdHJhcnkgbm9kZSBjb3VudFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKGludGVycG9sYXRlZCk7XG5cbiAgICAgICAgICAgIHggKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxpbmUuYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb20sIHRvLCB4LCBhbmltYXRpb25QZXJGcmFtZSk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkodG9bMF0uZGVsdGEodG9bdG8ubGVuZ3RoLTFdKS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXRoKHRvKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBOZXR3b3JrQWRhcHRlciwgTmV0d29yaywgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4uL05ldHdvcmtcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi4vTGluZVwiO1xuaW1wb3J0IHsgU3ZnTGluZSB9IGZyb20gXCIuL1N2Z0xpbmVcIjtcbmltcG9ydCB7IFN2Z1N0YXRpb24gfSBmcm9tIFwiLi9TdmdTdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gXCIuLi9MYWJlbFwiO1xuaW1wb3J0IHsgU3ZnTGFiZWwgfSBmcm9tIFwiLi9TdmdMYWJlbFwiO1xuaW1wb3J0IHsgR2VuZXJpY1RpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi4vR2VuZXJpY1RpbWVkRHJhd2FibGVcIjtcbmltcG9ydCB7IFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vU3ZnR2VuZXJpY1RpbWVkRHJhd2FibGVcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z05ldHdvcmsgaW1wbGVtZW50cyBOZXR3b3JrQWRhcHRlciB7XG5cbiAgICBzdGF0aWMgRlBTID0gNjA7XG4gICAgc3RhdGljIFNWR05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbUNlbnRlcjogVmVjdG9yID0gVmVjdG9yLk5VTEw7XG4gICAgcHJpdmF0ZSBjdXJyZW50Wm9vbVNjYWxlOiBudW1iZXIgPSAxO1xuXG4gICAgZ2V0IGNhbnZhc1NpemUoKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIGNvbnN0IGJveCA9IHN2Zz8udmlld0JveC5iYXNlVmFsO1xuICAgICAgICBpZiAoYm94KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcihib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBWZWN0b3IuTlVMTDsgICAgICAgIFxuICAgIH1cblxuICAgIGdldCBiZWNrU3R5bGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICByZXR1cm4gc3ZnPy5kYXRhc2V0LmJlY2tTdHlsZSAhPSAnZmFsc2UnO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQge1xuICAgICAgICBsZXQgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWxlbWVudHMnKT8uY2hpbGRyZW47XG4gICAgICAgIGlmIChlbGVtZW50cyA9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1BsZWFzZSBkZWZpbmUgdGhlIFwiZWxlbWVudHNcIiBncm91cC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUgfCBudWxsID0gdGhpcy5taXJyb3JFbGVtZW50KGVsZW1lbnRzW2ldLCBuZXR3b3JrKTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXR3b3JrLmFkZFRvSW5kZXgoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1pcnJvckVsZW1lbnQoZWxlbWVudDogYW55LCBuZXR3b3JrOiBTdGF0aW9uUHJvdmlkZXIpOiBUaW1lZERyYXdhYmxlIHwgbnVsbCB7XG4gICAgICAgIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAncGF0aCcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGluZShuZXcgU3ZnTGluZShlbGVtZW50KSwgbmV0d29yaywgdGhpcy5iZWNrU3R5bGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMYWJlbChuZXcgU3ZnTGFiZWwoZWxlbWVudCksIG5ldHdvcmspO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgR2VuZXJpY1RpbWVkRHJhd2FibGUobmV3IFN2Z0dlbmVyaWNUaW1lZERyYXdhYmxlKGVsZW1lbnQpKTtcbiAgICB9XG5cbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IG51bGwge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBpZiAoZWxlbWVudCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RhdGlvbihuZXcgU3ZnU3RhdGlvbig8U1ZHUmVjdEVsZW1lbnQ+IDx1bmtub3duPmVsZW1lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcCA9IDxTVkdSZWN0RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z05ldHdvcmsuU1ZHTlMsICdyZWN0Jyk7XG4gICAgICAgIGhlbHBTdG9wLmlkID0gaWQ7ICAgIFxuICAgICAgICBoZWxwU3RvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGlyJywgcm90YXRpb24ubmFtZSk7XG4gICAgICAgIHRoaXMuc2V0Q29vcmQoaGVscFN0b3AsIGJhc2VDb29yZHMpO1xuICAgICAgICBoZWxwU3RvcC5jbGFzc05hbWUuYmFzZVZhbCA9ICdoZWxwZXInO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGlvbnMnKT8uYXBwZW5kQ2hpbGQoaGVscFN0b3ApO1xuICAgICAgICByZXR1cm4gbmV3IFN0YXRpb24obmV3IFN2Z1N0YXRpb24oaGVscFN0b3ApKTsgIFxuICAgIH07XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxldCBlcG9jaExhYmVsO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJykgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlcG9jaExhYmVsID0gPFNWR1RleHRFbGVtZW50PiA8dW5rbm93bj4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJyk7XG4gICAgICAgICAgICBlcG9jaExhYmVsLnRleHRDb250ZW50ID0gZXBvY2g7ICAgICAgIFxuICAgICAgICB9XG4gICAgfVxuICAgXG4gICAgem9vbVRvKHpvb21DZW50ZXI6IFZlY3Rvciwgem9vbVNjYWxlOiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHpvb21DZW50ZXIsIHpvb21TY2FsZSwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzKTtcbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTLCB0aGlzLmN1cnJlbnRab29tQ2VudGVyLCB6b29tQ2VudGVyLCB0aGlzLmN1cnJlbnRab29tU2NhbGUsIHpvb21TY2FsZSk7XG4gICAgICAgIHRoaXMuY3VycmVudFpvb21DZW50ZXIgPSB6b29tQ2VudGVyO1xuICAgICAgICB0aGlzLmN1cnJlbnRab29tU2NhbGUgPSB6b29tU2NhbGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoeDogbnVtYmVyLCBhbmltYXRpb25QZXJGcmFtZTogbnVtYmVyLCBmcm9tQ2VudGVyOiBWZWN0b3IsIHRvQ2VudGVyOiBWZWN0b3IsIGZyb21TY2FsZTogbnVtYmVyLCB0b1NjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHggPCAxKSB7XG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgZWFzZSA9IHRoaXMuZWFzZSh4KTtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gZnJvbUNlbnRlci5kZWx0YSh0b0NlbnRlcilcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWN0b3IoZGVsdGEueCAqIGVhc2UsIGRlbHRhLnkgKiBlYXNlKS5hZGQoZnJvbUNlbnRlcik7XG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9ICh0b1NjYWxlIC0gZnJvbVNjYWxlKSAqIGVhc2UgKyBmcm9tU2NhbGU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20oY2VudGVyLCBzY2FsZSk7XG4gICAgICAgICAgICBjb25zdCBuZXR3b3JrID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IG5ldHdvcmsuYW5pbWF0ZUZyYW1lKHgsIGFuaW1hdGlvblBlckZyYW1lLCBmcm9tQ2VudGVyLCB0b0NlbnRlciwgZnJvbVNjYWxlLCB0b1NjYWxlKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVpvb20odG9DZW50ZXIsIHRvU2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlYXNlKHg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDQgKiB4ICogeCAqIHggOiAxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgMykgLyAyO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlWm9vbShjZW50ZXI6IFZlY3Rvciwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBjb25zdCB6b29tYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tYWJsZScpO1xuICAgICAgICBpZiAoem9vbWFibGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB6b29tYWJsZS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSAnY2VudGVyJztcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSB0cmFuc2xhdGUoJyArICh0aGlzLmNhbnZhc1NpemUueCAvIDIgLSBjZW50ZXIueCkgKyAncHgsJyArICh0aGlzLmNhbnZhc1NpemUueSAvIDIgLSBjZW50ZXIueSkgKyAncHgpJztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFN0YXRpb25BZGFwdGVyLCBTdGF0aW9uIH0gZnJvbSBcIi4uL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4uL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuXG5leHBvcnQgY2xhc3MgU3ZnU3RhdGlvbiBpbXBsZW1lbnRzIFN0YXRpb25BZGFwdGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR1JlY3RFbGVtZW50KSB7XG5cbiAgICB9XG4gICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaWQ7XG4gICAgfVxuICAgIGdldCBiYXNlQ29vcmRzKCk6IFZlY3RvciB7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneCcpIHx8ICcnKSB8fCAwLCBwYXJzZUludCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd5JykgfHwgJycpIHx8IDApO1xuICAgIH1cbiAgICBzZXQgYmFzZUNvb3JkcyhiYXNlQ29vcmRzOiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGJhc2VDb29yZHMueCArICcnKTsgXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBiYXNlQ29vcmRzLnkgKyAnJyk7IFxuICAgIH1cblxuICAgIGdldCByb3RhdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRpciB8fCAnbicpO1xuICAgIH1cbiAgICBnZXQgbGFiZWxEaXIoKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gUm90YXRpb24uZnJvbSh0aGlzLmVsZW1lbnQuZGF0YXNldC5sYWJlbERpciB8fCAnbicpO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXRpb24uZHJhdygwLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXMpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3NpdGlvbkJvdW5kYXJpZXMgPSBnZXRQb3NpdGlvbkJvdW5kYXJpZXMoKTtcbiAgICAgICAgY29uc3Qgc3RvcERpbWVuID0gW3Bvc2l0aW9uQm91bmRhcmllcy54WzFdIC0gcG9zaXRpb25Cb3VuZGFyaWVzLnhbMF0sIHBvc2l0aW9uQm91bmRhcmllcy55WzFdIC0gcG9zaXRpb25Cb3VuZGFyaWVzLnlbMF1dO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBzdG9wRGltZW5bMF0gPCAwICYmIHN0b3BEaW1lblsxXSA8IDAgPyAnaGlkZGVuJyA6ICd2aXNpYmxlJztcblxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd3aWR0aCcsIChNYXRoLm1heChzdG9wRGltZW5bMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4pICsgJycpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAoTWF0aC5tYXgoc3RvcERpbWVuWzFdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywncm90YXRlKCcgKyB0aGlzLnJvdGF0aW9uLmRlZ3JlZXMgKyAnKSB0cmFuc2xhdGUoJyArIChNYXRoLm1pbihwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgLSBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiAvIDIpICsgJywnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy55WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnKScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtT3JpZ2luKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgdGhpcy5iYXNlQ29vcmRzLnggKyAnICcgKyB0aGlzLmJhc2VDb29yZHMueSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXRpb24ubW92ZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIGZyb20sIHRvLCBjYWxsYmFjayk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb20sIHRvLCAwLCAxL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUZyYW1lVmVjdG9yKGZyb206IFZlY3RvciwgdG86IFZlY3RvciwgeDogbnVtYmVyLCBhbmltYXRpb25QZXJGcmFtZTogbnVtYmVyLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZUNvb3JkcyA9IGZyb20uYmV0d2Vlbih0bywgeCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgeCArPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbGluZS5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIHgsIGFuaW1hdGlvblBlckZyYW1lLCBjYWxsYmFjayk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iYXNlQ29vcmRzID0gdG87XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0iXSwic291cmNlUm9vdCI6IiJ9