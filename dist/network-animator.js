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


const fmin = __webpack_require__(/*! fmin */ "./node_modules/fmin/build/fmin.js");
class Gravitator {
    constructor(stationProvider) {
        this.stationProvider = stationProvider;
        this.initialWeightFactors = {};
        this.initialAngles = [];
        this.averageEuclidianLengthRatio = -1;
        this.edges = {};
        this.vertices = {};
    }
    gravitate(delay, animate) {
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
        }
    }
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
                this.addInitialAngles(edge);
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
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    if (edge.termini[i].stationId == adjacent.termini[j].stationId) {
                        this.initialAngles.push({
                            aStation: edge.termini[i ^ 1].stationId,
                            commonStation: edge.termini[i].stationId,
                            bStation: edge.termini[j ^ 1].stationId,
                            angle: this.threeDotAngleLoss(this.vertices[edge.termini[i ^ 1].stationId].station.baseCoords, this.vertices[edge.termini[i].stationId].station.baseCoords, this.vertices[edge.termini[j ^ 1].stationId].station.baseCoords)
                        });
                    }
                }
            }
        }
        //derive arccos(((a-c)*(e-g)+(b-d)*(f-h))/(sqrt((a-c)^2+(b-d)^2)*sqrt((e-g)^2+(f-h)^2)))*((f-h)*(a-c)-(b-d)*(e-g))/|((f-h)*(a-c)-(b-d)*(e-g))|
    }
    threeDotAngleLoss(d1, d2, d3) {
        return this.threeDotProduct(d1, d2, d3) * this.threeDotSign(d1, d2, d3);
    }
    threeDotProduct(d1, d2, d3) {
        return (d2.x - d1.x) * (d2.x - d3.x) + (d2.y - d1.y) * (d2.y - d3.y);
    }
    threeDotSign(d1, d2, d3) {
        return (d2.y - d3.y) * (d2.x - d1.x) + (d2.y - d1.y) * (d2.x - d3.x);
    }
    minimizeLoss() {
        const gravitator = this;
        const params = { history: [] };
        const start = this.startStationPositions();
        const solution = fmin.conjugateGradient((A, fxprime) => {
            fxprime = fxprime || A.slice();
            let fx = 0;
            fx = this.deltaToStartStationPositionsToEnsureInertness(fx, A, fxprime, gravitator);
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
                Math.pow(A[vertex.index.y] - vertex.startCoords.y, 2) +
                Math.pow(A[vertex.index.x] - vertex.station.baseCoords.x, 2) +
                Math.pow(A[vertex.index.y] - vertex.station.baseCoords.y, 2)) * Gravitator.INERTNESS;
            fxprime[vertex.index.x] = 2 * (2 * A[vertex.index.x] - vertex.startCoords.x - vertex.station.baseCoords.x) * Gravitator.INERTNESS;
            fxprime[vertex.index.y] = 2 * (2 * A[vertex.index.y] - vertex.startCoords.y - vertex.station.baseCoords.y) * Gravitator.INERTNESS;
        }
        return fx;
    }
    deltaToAnglesToEnsureInertness(fx, A, fxprime, gravitator) {
        for (const pair of Object.values(gravitator.initialAngles)) {
            const v = this.threeDotAngleLoss(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](A[gravitator.vertices[pair.aStation].index.x], A[gravitator.vertices[pair.aStation].index.y]), new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](A[gravitator.vertices[pair.commonStation].index.x], A[gravitator.vertices[pair.commonStation].index.y]), new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](A[gravitator.vertices[pair.bStation].index.x], A[gravitator.vertices[pair.bStation].index.y])) - pair.angle;
            fx += Math.pow(v, 2);
        }
        return fx;
        /*
        Math.pow(
                new Vector(this.deltaX(A, gravitator.vertices, pair.edgeA.termini), this.deltaY(A, gravitator.vertices, pair.edgeA.termini)).angle(
                    new Vector(this.deltaX(A, gravitator.vertices, pair.edgeB.termini), this.deltaY(A, gravitator.vertices, pair.edgeB.termini))
                ).degrees - pair.angle.degrees
                */
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
        const animationDurationSeconds = animate ? 3 : 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.move(delay, animationDurationSeconds, new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](solution[vertex.index.x], solution[vertex.index.y]));
        }
        for (const edge of Object.values(this.edges)) {
            edge.move(delay, animationDurationSeconds, [this.getNewStationPosition(edge.termini[0].stationId, solution), this.getNewStationPosition(edge.termini[1].stationId, solution)]);
        }
        delay += animationDurationSeconds;
        return delay;
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
        delay = this.gravitator.gravitate(delay, animate);
        this.adapter.zoomTo(zoomer.center, zoomer.scale, _Zoomer__WEBPACK_IMPORTED_MODULE_1__["Zoomer"].ZOOM_DURATION);
        return delay;
    }
    flushEraseBuffer(delay, animate, zoomer) {
        for (let i = this.eraseBuffer.length - 1; i >= 0; i--) {
            const element = this.eraseBuffer[i];
            const shouldAnimate = this.shouldAnimate(element.to, animate);
            delay += this.eraseElement(element, delay, shouldAnimate);
            zoomer.include(element.boundingBox, element.to, shouldAnimate);
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
        zoomer.include(element.boundingBox, element.from, shouldAnimate);
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

/***/ "./src/SvgLabel.ts":
/*!*************************!*\
  !*** ./src/SvgLabel.ts ***!
  \*************************/
/*! exports provided: SvgLabel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgLabel", function() { return SvgLabel; });
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Label */ "./src/Label.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgNetwork */ "./src/SvgNetwork.ts");





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
            return { tl: new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](r.left, r.top), br: new _Vector__WEBPACK_IMPORTED_MODULE_2__["Vector"](r.right, r.bottom) };
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

/***/ "./src/SvgLine.ts":
/*!************************!*\
  !*** ./src/SvgLine.ts ***!
  \************************/
/*! exports provided: SvgLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgLine", function() { return SvgLine; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Station */ "./src/Station.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgNetwork */ "./src/SvgNetwork.ts");




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

/***/ "./src/SvgNetwork.ts":
/*!***************************!*\
  !*** ./src/SvgNetwork.ts ***!
  \***************************/
/*! exports provided: SvgNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgNetwork", function() { return SvgNetwork; });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Station */ "./src/Station.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Line */ "./src/Line.ts");
/* harmony import */ var _SvgLine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgLine */ "./src/SvgLine.ts");
/* harmony import */ var _SvgStation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SvgStation */ "./src/SvgStation.ts");
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Label */ "./src/Label.ts");
/* harmony import */ var _SvgLabel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SvgLabel */ "./src/SvgLabel.ts");







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
        return null;
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
        console.log(zoomCenter, zoomScale);
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

/***/ "./src/SvgStation.ts":
/*!***************************!*\
  !*** ./src/SvgStation.ts ***!
  \***************************/
/*! exports provided: SvgStation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgStation", function() { return SvgStation; });
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Station */ "./src/Station.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Rotation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Rotation */ "./src/Rotation.ts");
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgNetwork */ "./src/SvgNetwork.ts");




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
    }
    include(boundingBox, now, shouldAnimate) {
        if (shouldAnimate && now.flag != 'nozoom') {
            this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(boundingBox.tl);
            this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(boundingBox.br);
        }
    }
    enforcedBoundingBox() {
        if (this.boundingBox.tl != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL && this.boundingBox.br != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            const paddedBoundingBox = this.paddedBoundingBox();
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
    paddedBoundingBox() {
        const padding = (this.canvasSize.x + this.canvasSize.y) / Zoomer.PADDING_FACTOR;
        return {
            tl: this.boundingBox.tl.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](-padding, -padding)),
            br: this.boundingBox.br.add(new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](padding, padding))
        };
    }
    get center() {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL && enforcedBoundingBox.br != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](Math.round((enforcedBoundingBox.tl.x + enforcedBoundingBox.br.x) / 2), Math.round((enforcedBoundingBox.tl.y + enforcedBoundingBox.br.y) / 2));
        }
        return new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](this.canvasSize.x / 2, this.canvasSize.y / 2);
        ;
    }
    get scale() {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL && enforcedBoundingBox.br != _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"].NULL) {
            const zoomSize = enforcedBoundingBox.tl.delta(enforcedBoundingBox.br);
            return Math.min(this.canvasSize.x / zoomSize.x, this.canvasSize.y / zoomSize.y);
        }
        return 1;
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
/* harmony import */ var _SvgNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SvgNetwork */ "./src/SvgNetwork.ts");
/* harmony import */ var _Network__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Network */ "./src/Network.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");



// TODO: erase anim, labels, negative default tracks based on direction, rejoin lines track selection
const network = new _Network__WEBPACK_IMPORTED_MODULE_1__["Network"](new _SvgNetwork__WEBPACK_IMPORTED_MODULE_0__["SvgNetwork"]());
network.initialize();
const animateFromEpoch = getStartEpoch();
slide(_Instant__WEBPACK_IMPORTED_MODULE_2__["Instant"].BIG_BANG, false);
function getStartEpoch() {
    if (window.location.hash && network.isEpochExisting(window.location.hash.replace('#', ''))) {
        const animateFromEpoch = window.location.hash.replace('#', '');
        console.log('fast forward to ' + animateFromEpoch);
        return parseInt(animateFromEpoch) || 0;
    }
    return 0;
}
function slide(instant, animate) {
    if (instant.epoch == animateFromEpoch)
        animate = true;
    network.drawTimedDrawablesAt(instant, animate);
    const next = network.nextInstant(instant);
    if (next) {
        const delay = animate ? instant.delta(next) : 0;
        window.setTimeout(function () { slide(next, animate); }, delay * 1000);
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvR3Jhdml0YXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW5zdGFudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9TdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdMYWJlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ZnTGluZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ZnTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ZnU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvWm9vbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtR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QztJQUMvQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTFDLElBQUksSUFBSSxFQUFFO1FBQ04sTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFhLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ3pFO0FBQ0wsQ0FBQyIsImZpbGUiOiJuZXR3b3JrLWFuaW1hdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gICAgKGZhY3RvcnkoKGdsb2JhbC5mbWluID0gZ2xvYmFsLmZtaW4gfHwge30pKSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKiBmaW5kcyB0aGUgemVyb3Mgb2YgYSBmdW5jdGlvbiwgZ2l2ZW4gdHdvIHN0YXJ0aW5nIHBvaW50cyAod2hpY2ggbXVzdFxuICAgICAqIGhhdmUgb3Bwb3NpdGUgc2lnbnMgKi9cbiAgICBmdW5jdGlvbiBiaXNlY3QoZiwgYSwgYiwgcGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJzLm1heEl0ZXJhdGlvbnMgfHwgMTAwLFxuICAgICAgICAgICAgdG9sZXJhbmNlID0gcGFyYW1ldGVycy50b2xlcmFuY2UgfHwgMWUtMTAsXG4gICAgICAgICAgICBmQSA9IGYoYSksXG4gICAgICAgICAgICBmQiA9IGYoYiksXG4gICAgICAgICAgICBkZWx0YSA9IGIgLSBhO1xuXG4gICAgICAgIGlmIChmQSAqIGZCID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgXCJJbml0aWFsIGJpc2VjdCBwb2ludHMgbXVzdCBoYXZlIG9wcG9zaXRlIHNpZ25zXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZkEgPT09IDApIHJldHVybiBhO1xuICAgICAgICBpZiAoZkIgPT09IDApIHJldHVybiBiO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBkZWx0YSAvPSAyO1xuICAgICAgICAgICAgdmFyIG1pZCA9IGEgKyBkZWx0YSxcbiAgICAgICAgICAgICAgICBmTWlkID0gZihtaWQpO1xuXG4gICAgICAgICAgICBpZiAoZk1pZCAqIGZBID49IDApIHtcbiAgICAgICAgICAgICAgICBhID0gbWlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKE1hdGguYWJzKGRlbHRhKSA8IHRvbGVyYW5jZSkgfHwgKGZNaWQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYSArIGRlbHRhO1xuICAgIH1cblxuICAgIC8vIG5lZWQgc29tZSBiYXNpYyBvcGVyYXRpb25zIG9uIHZlY3RvcnMsIHJhdGhlciB0aGFuIGFkZGluZyBhIGRlcGVuZGVuY3ksXG4gICAgLy8ganVzdCBkZWZpbmUgaGVyZVxuICAgIGZ1bmN0aW9uIHplcm9zKHgpIHsgdmFyIHIgPSBuZXcgQXJyYXkoeCk7IGZvciAodmFyIGkgPSAwOyBpIDwgeDsgKytpKSB7IHJbaV0gPSAwOyB9IHJldHVybiByOyB9XG4gICAgZnVuY3Rpb24gemVyb3NNKHgseSkgeyByZXR1cm4gemVyb3MoeCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gemVyb3MoeSk7IH0pOyB9XG5cbiAgICBmdW5jdGlvbiBkb3QoYSwgYikge1xuICAgICAgICB2YXIgcmV0ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtMihhKSAge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGRvdChhLCBhKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUocmV0LCB2YWx1ZSwgYykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXRbaV0gPSB2YWx1ZVtpXSAqIGM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWlnaHRlZFN1bShyZXQsIHcxLCB2MSwgdzIsIHYyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmV0Lmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICByZXRbal0gPSB3MSAqIHYxW2pdICsgdzIgKiB2MltqXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBtaW5pbWl6ZXMgYSBmdW5jdGlvbiB1c2luZyB0aGUgZG93bmhpbGwgc2ltcGxleCBtZXRob2QgKi9cbiAgICBmdW5jdGlvbiBuZWxkZXJNZWFkKGYsIHgwLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuXG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1ldGVycy5tYXhJdGVyYXRpb25zIHx8IHgwLmxlbmd0aCAqIDIwMCxcbiAgICAgICAgICAgIG5vblplcm9EZWx0YSA9IHBhcmFtZXRlcnMubm9uWmVyb0RlbHRhIHx8IDEuMDUsXG4gICAgICAgICAgICB6ZXJvRGVsdGEgPSBwYXJhbWV0ZXJzLnplcm9EZWx0YSB8fCAwLjAwMSxcbiAgICAgICAgICAgIG1pbkVycm9yRGVsdGEgPSBwYXJhbWV0ZXJzLm1pbkVycm9yRGVsdGEgfHwgMWUtNixcbiAgICAgICAgICAgIG1pblRvbGVyYW5jZSA9IHBhcmFtZXRlcnMubWluRXJyb3JEZWx0YSB8fCAxZS01LFxuICAgICAgICAgICAgcmhvID0gKHBhcmFtZXRlcnMucmhvICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5yaG8gOiAxLFxuICAgICAgICAgICAgY2hpID0gKHBhcmFtZXRlcnMuY2hpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5jaGkgOiAyLFxuICAgICAgICAgICAgcHNpID0gKHBhcmFtZXRlcnMucHNpICE9PSB1bmRlZmluZWQpID8gcGFyYW1ldGVycy5wc2kgOiAtMC41LFxuICAgICAgICAgICAgc2lnbWEgPSAocGFyYW1ldGVycy5zaWdtYSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMuc2lnbWEgOiAwLjUsXG4gICAgICAgICAgICBtYXhEaWZmO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgc2ltcGxleC5cbiAgICAgICAgdmFyIE4gPSB4MC5sZW5ndGgsXG4gICAgICAgICAgICBzaW1wbGV4ID0gbmV3IEFycmF5KE4gKyAxKTtcbiAgICAgICAgc2ltcGxleFswXSA9IHgwO1xuICAgICAgICBzaW1wbGV4WzBdLmZ4ID0gZih4MCk7XG4gICAgICAgIHNpbXBsZXhbMF0uaWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0geDAuc2xpY2UoKTtcbiAgICAgICAgICAgIHBvaW50W2ldID0gcG9pbnRbaV0gPyBwb2ludFtpXSAqIG5vblplcm9EZWx0YSA6IHplcm9EZWx0YTtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXSA9IHBvaW50O1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdLmZ4ID0gZihwb2ludCk7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0uaWQgPSBpKzE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVTaW1wbGV4KHZhbHVlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2ltcGxleFtOXVtpXSA9IHZhbHVlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2ltcGxleFtOXS5meCA9IHZhbHVlLmZ4O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNvcnRPcmRlciA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEuZnggLSBiLmZ4OyB9O1xuXG4gICAgICAgIHZhciBjZW50cm9pZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICByZWZsZWN0ZWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgY29udHJhY3RlZCA9IHgwLnNsaWNlKCksXG4gICAgICAgICAgICBleHBhbmRlZCA9IHgwLnNsaWNlKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgbWF4SXRlcmF0aW9uczsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgIHNpbXBsZXguc29ydChzb3J0T3JkZXIpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgLy8gY29weSB0aGUgc2ltcGxleCAoc2luY2UgbGF0ZXIgaXRlcmF0aW9ucyB3aWxsIG11dGF0ZSkgYW5kXG4gICAgICAgICAgICAgICAgLy8gc29ydCBpdCB0byBoYXZlIGEgY29uc2lzdGVudCBvcmRlciBiZXR3ZWVuIGl0ZXJhdGlvbnNcbiAgICAgICAgICAgICAgICB2YXIgc29ydGVkU2ltcGxleCA9IHNpbXBsZXgubWFwKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHguc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnggPSB4LmZ4O1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pZCA9IHguaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzb3J0ZWRTaW1wbGV4LnNvcnQoZnVuY3Rpb24oYSxiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG5cbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmhpc3RvcnkucHVzaCh7eDogc2ltcGxleFswXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogc2ltcGxleFswXS5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxleDogc29ydGVkU2ltcGxleH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXhEaWZmID0gMDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtYXhEaWZmID0gTWF0aC5tYXgobWF4RGlmZiwgTWF0aC5hYnMoc2ltcGxleFswXVtpXSAtIHNpbXBsZXhbMV1baV0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChNYXRoLmFicyhzaW1wbGV4WzBdLmZ4IC0gc2ltcGxleFtOXS5meCkgPCBtaW5FcnJvckRlbHRhKSAmJlxuICAgICAgICAgICAgICAgIChtYXhEaWZmIDwgbWluVG9sZXJhbmNlKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wdXRlIHRoZSBjZW50cm9pZCBvZiBhbGwgYnV0IHRoZSB3b3JzdCBwb2ludCBpbiB0aGUgc2ltcGxleFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICAgICAgICAgIGNlbnRyb2lkW2ldID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSArPSBzaW1wbGV4W2pdW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSAvPSBOO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZWZsZWN0IHRoZSB3b3JzdCBwb2ludCBwYXN0IHRoZSBjZW50cm9pZCAgYW5kIGNvbXB1dGUgbG9zcyBhdCByZWZsZWN0ZWRcbiAgICAgICAgICAgIC8vIHBvaW50XG4gICAgICAgICAgICB2YXIgd29yc3QgPSBzaW1wbGV4W05dO1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0ocmVmbGVjdGVkLCAxK3JobywgY2VudHJvaWQsIC1yaG8sIHdvcnN0KTtcbiAgICAgICAgICAgIHJlZmxlY3RlZC5meCA9IGYocmVmbGVjdGVkKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlZmxlY3RlZCBwb2ludCBpcyB0aGUgYmVzdCBzZWVuLCB0aGVuIHBvc3NpYmx5IGV4cGFuZFxuICAgICAgICAgICAgaWYgKHJlZmxlY3RlZC5meCA8IHNpbXBsZXhbMF0uZngpIHtcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShleHBhbmRlZCwgMStjaGksIGNlbnRyb2lkLCAtY2hpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgZXhwYW5kZWQuZnggPSBmKGV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwYW5kZWQuZnggPCByZWZsZWN0ZWQuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgocmVmbGVjdGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWZsZWN0ZWQgcG9pbnQgaXMgd29yc2UgdGhhbiB0aGUgc2Vjb25kIHdvcnN0LCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBjb250cmFjdFxuICAgICAgICAgICAgZWxzZSBpZiAocmVmbGVjdGVkLmZ4ID49IHNpbXBsZXhbTi0xXS5meCkge1xuICAgICAgICAgICAgICAgIHZhciBzaG91bGRSZWR1Y2UgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWZsZWN0ZWQuZnggPiB3b3JzdC5meCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhbiBpbnNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMStwc2ksIGNlbnRyb2lkLCAtcHNpLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHdvcnN0LmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGFuIG91dHNpZGUgY29udHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oY29udHJhY3RlZCwgMS1wc2kgKiByaG8sIGNlbnRyb2lkLCBwc2kqcmhvLCB3b3JzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0ZWQuZnggPSBmKGNvbnRyYWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJhY3RlZC5meCA8IHJlZmxlY3RlZC5meCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFJlZHVjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkUmVkdWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGRvbid0IGNvbnRyYWN0IGhlcmUsIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpZ21hID49IDEpIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIGEgcmVkdWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBzaW1wbGV4Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShzaW1wbGV4W2ldLCAxIC0gc2lnbWEsIHNpbXBsZXhbMF0sIHNpZ21hLCBzaW1wbGV4W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZXhbaV0uZnggPSBmKHNpbXBsZXhbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KHJlZmxlY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaW1wbGV4LnNvcnQoc29ydE9yZGVyKTtcbiAgICAgICAgcmV0dXJuIHtmeCA6IHNpbXBsZXhbMF0uZngsXG4gICAgICAgICAgICAgICAgeCA6IHNpbXBsZXhbMF19O1xuICAgIH1cblxuICAgIC8vLyBzZWFyY2hlcyBhbG9uZyBsaW5lICdwaycgZm9yIGEgcG9pbnQgdGhhdCBzYXRpZmllcyB0aGUgd29sZmUgY29uZGl0aW9uc1xuICAgIC8vLyBTZWUgJ051bWVyaWNhbCBPcHRpbWl6YXRpb24nIGJ5IE5vY2VkYWwgYW5kIFdyaWdodCBwNTktNjBcbiAgICAvLy8gZiA6IG9iamVjdGl2ZSBmdW5jdGlvblxuICAgIC8vLyBwayA6IHNlYXJjaCBkaXJlY3Rpb25cbiAgICAvLy8gY3VycmVudDogb2JqZWN0IGNvbnRhaW5pbmcgY3VycmVudCBncmFkaWVudC9sb3NzXG4gICAgLy8vIG5leHQ6IG91dHB1dDogY29udGFpbnMgbmV4dCBncmFkaWVudC9sb3NzXG4gICAgLy8vIHJldHVybnMgYTogc3RlcCBzaXplIHRha2VuXG4gICAgZnVuY3Rpb24gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhLCBjMSwgYzIpIHtcbiAgICAgICAgdmFyIHBoaTAgPSBjdXJyZW50LmZ4LCBwaGlQcmltZTAgPSBkb3QoY3VycmVudC5meHByaW1lLCBwayksXG4gICAgICAgICAgICBwaGkgPSBwaGkwLCBwaGlfb2xkID0gcGhpMCxcbiAgICAgICAgICAgIHBoaVByaW1lID0gcGhpUHJpbWUwLFxuICAgICAgICAgICAgYTAgPSAwO1xuXG4gICAgICAgIGEgPSBhIHx8IDE7XG4gICAgICAgIGMxID0gYzEgfHwgMWUtNjtcbiAgICAgICAgYzIgPSBjMiB8fCAwLjE7XG5cbiAgICAgICAgZnVuY3Rpb24gem9vbShhX2xvLCBhX2hpZ2gsIHBoaV9sbykge1xuICAgICAgICAgICAgZm9yICh2YXIgaXRlcmF0aW9uID0gMDsgaXRlcmF0aW9uIDwgMTY7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgYSA9IChhX2xvICsgYV9oaWdoKS8yO1xuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKG5leHQueCwgMS4wLCBjdXJyZW50LngsIGEsIHBrKTtcbiAgICAgICAgICAgICAgICBwaGkgPSBuZXh0LmZ4ID0gZihuZXh0LngsIG5leHQuZnhwcmltZSk7XG4gICAgICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHBoaSA+PSBwaGlfbG8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGFfaGlnaCA9IGE7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHBoaVByaW1lKSA8PSAtYzIgKiBwaGlQcmltZTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBoaVByaW1lICogKGFfaGlnaCAtIGFfbG8pID49MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYV9oaWdoID0gYV9sbztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGFfbG8gPSBhO1xuICAgICAgICAgICAgICAgICAgICBwaGlfbG8gPSBwaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IDEwOyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgd2VpZ2h0ZWRTdW0obmV4dC54LCAxLjAsIGN1cnJlbnQueCwgYSwgcGspO1xuICAgICAgICAgICAgcGhpID0gbmV4dC5meCA9IGYobmV4dC54LCBuZXh0LmZ4cHJpbWUpO1xuICAgICAgICAgICAgcGhpUHJpbWUgPSBkb3QobmV4dC5meHByaW1lLCBwayk7XG4gICAgICAgICAgICBpZiAoKHBoaSA+IChwaGkwICsgYzEgKiBhICogcGhpUHJpbWUwKSkgfHxcbiAgICAgICAgICAgICAgICAoaXRlcmF0aW9uICYmIChwaGkgPj0gcGhpX29sZCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb20oYTAsIGEsIHBoaV9vbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMocGhpUHJpbWUpIDw9IC1jMiAqIHBoaVByaW1lMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhpUHJpbWUgPj0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbShhLCBhMCwgcGhpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGhpX29sZCA9IHBoaTtcbiAgICAgICAgICAgIGEwID0gYTtcbiAgICAgICAgICAgIGEgKj0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmp1Z2F0ZUdyYWRpZW50KGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICAvLyBhbGxvY2F0ZSBhbGwgbWVtb3J5IHVwIGZyb250IGhlcmUsIGtlZXAgb3V0IG9mIHRoZSBsb29wIGZvciBwZXJmb21hbmNlXG4gICAgICAgIC8vIHJlYXNvbnNcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG5leHQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIHlrID0gaW5pdGlhbC5zbGljZSgpLFxuICAgICAgICAgICAgcGssIHRlbXAsXG4gICAgICAgICAgICBhID0gMSxcbiAgICAgICAgICAgIG1heEl0ZXJhdGlvbnM7XG5cbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAyMDtcblxuICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgIHBrID0gY3VycmVudC5meHByaW1lLnNsaWNlKCk7XG4gICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsLTEpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBhID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBhKTtcblxuICAgICAgICAgICAgLy8gdG9kbzogaGlzdG9yeSBpbiB3cm9uZyBzcG90P1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmhpc3RvcnkucHVzaCh7eDogY3VycmVudC54LnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGF9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhKSB7XG4gICAgICAgICAgICAgICAgLy8gZmFpaWxlZCB0byBmaW5kIHBvaW50IHRoYXQgc2F0aWZpZXMgd29sZmUgY29uZGl0aW9ucy5cbiAgICAgICAgICAgICAgICAvLyByZXNldCBkaXJlY3Rpb24gZm9yIG5leHQgaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBkaXJlY3Rpb24gdXNpbmcgUG9sYWvigJNSaWJpZXJlIENHIG1ldGhvZFxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHlrLCAxLCBuZXh0LmZ4cHJpbWUsIC0xLCBjdXJyZW50LmZ4cHJpbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlbHRhX2sgPSBkb3QoY3VycmVudC5meHByaW1lLCBjdXJyZW50LmZ4cHJpbWUpLFxuICAgICAgICAgICAgICAgICAgICBiZXRhX2sgPSBNYXRoLm1heCgwLCBkb3QoeWssIG5leHQuZnhwcmltZSkgLyBkZWx0YV9rKTtcblxuICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKHBrLCBiZXRhX2ssIHBrLCAtMSwgbmV4dC5meHByaW1lKTtcblxuICAgICAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50O1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgICAgIG5leHQgPSB0ZW1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9ybTIoY3VycmVudC5meHByaW1lKSA8PSAxZS01KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IGN1cnJlbnQuZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBhfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncmFkaWVudERlc2NlbnQoZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgdmFyIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDEwMCxcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHBhcmFtcy5sZWFyblJhdGUgfHwgMC4wMDEsXG4gICAgICAgICAgICBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlaWdodGVkU3VtKGN1cnJlbnQueCwgMSwgY3VycmVudC54LCAtbGVhcm5SYXRlLCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICAgICAgaWYgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPD0gMWUtNSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbmV4dCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9LFxuICAgICAgICAgICAgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMTAwLFxuICAgICAgICAgICAgbGVhcm5SYXRlID0gcGFyYW1zLmxlYXJuUmF0ZSB8fCAxLFxuICAgICAgICAgICAgcGsgPSBpbml0aWFsLnNsaWNlKCksXG4gICAgICAgICAgICBjMSA9IHBhcmFtcy5jMSB8fCAxZS0zLFxuICAgICAgICAgICAgYzIgPSBwYXJhbXMuYzIgfHwgMC4xLFxuICAgICAgICAgICAgdGVtcCxcbiAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcblxuICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIC8vIHdyYXAgdGhlIGZ1bmN0aW9uIGNhbGwgdG8gdHJhY2sgbGluZXNlYXJjaCBzYW1wbGVzXG4gICAgICAgICAgICB2YXIgaW5uZXIgPSBmO1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKHgsIGZ4cHJpbWUpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzLnB1c2goeC5zbGljZSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5uZXIoeCwgZnhwcmltZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgc2NhbGUocGssIGN1cnJlbnQuZnhwcmltZSwgLTEpO1xuICAgICAgICAgICAgbGVhcm5SYXRlID0gd29sZmVMaW5lU2VhcmNoKGYsIHBrLCBjdXJyZW50LCBuZXh0LCBsZWFyblJhdGUsIGMxLCBjMik7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHM6IGZ1bmN0aW9uQ2FsbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhcm5SYXRlOiBsZWFyblJhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGxlYXJuUmF0ZX0pO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ2FsbHMgPSBbXTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB0ZW1wID0gY3VycmVudDtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICAgICAgbmV4dCA9IHRlbXA7XG5cbiAgICAgICAgICAgIGlmICgobGVhcm5SYXRlID09PSAwKSB8fCAobm9ybTIoY3VycmVudC5meHByaW1lKSA8IDFlLTUpKSBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGV4cG9ydHMuYmlzZWN0ID0gYmlzZWN0O1xuICAgIGV4cG9ydHMubmVsZGVyTWVhZCA9IG5lbGRlck1lYWQ7XG4gICAgZXhwb3J0cy5jb25qdWdhdGVHcmFkaWVudCA9IGNvbmp1Z2F0ZUdyYWRpZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50ID0gZ3JhZGllbnREZXNjZW50O1xuICAgIGV4cG9ydHMuZ3JhZGllbnREZXNjZW50TGluZVNlYXJjaCA9IGdyYWRpZW50RGVzY2VudExpbmVTZWFyY2g7XG4gICAgZXhwb3J0cy56ZXJvcyA9IHplcm9zO1xuICAgIGV4cG9ydHMuemVyb3NNID0gemVyb3NNO1xuICAgIGV4cG9ydHMubm9ybTIgPSBub3JtMjtcbiAgICBleHBvcnRzLndlaWdodGVkU3VtID0gd2VpZ2h0ZWRTdW07XG4gICAgZXhwb3J0cy5zY2FsZSA9IHNjYWxlO1xuXG59KSk7IiwiaW1wb3J0IHsgU3RhdGlvbiwgU3RvcCB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcblxuY29uc3QgZm1pbiA9IHJlcXVpcmUoJ2ZtaW4nKTtcblxuXG5leHBvcnQgY2xhc3MgR3Jhdml0YXRvciB7XG4gICAgc3RhdGljIElORVJUTkVTUyA9IDEwMDtcbiAgICBzdGF0aWMgR1JBRElFTlRfU0NBTEUgPSAwLjAwMDAwMDAwMTtcbiAgICBzdGF0aWMgREVWSUFUSU9OX1dBUk5JTkcgPSAwLjE7XG4gICAgc3RhdGljIElOSVRJQUxJWkVfUkVMQVRJVkVfVE9fRVVDTElESUFOX0RJU1RBTkNFID0gdHJ1ZTtcblxuICAgIHByaXZhdGUgaW5pdGlhbFdlaWdodEZhY3RvcnM6IHtbaWQ6IHN0cmluZ10gOiBudW1iZXJ9ID0ge307XG4gICAgcHJpdmF0ZSBpbml0aWFsQW5nbGVzOiB7YVN0YXRpb246IHN0cmluZywgY29tbW9uU3RhdGlvbjogc3RyaW5nLCBiU3RhdGlvbjogc3RyaW5nLCBhbmdsZTogbnVtYmVyfVtdID0gW107IFxuICAgIHByaXZhdGUgYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvOiBudW1iZXIgPSAtMTtcbiAgICBwcml2YXRlIGVkZ2VzOiB7W2lkOiBzdHJpbmddOiBMaW5lfSA9IHt9O1xuICAgIHByaXZhdGUgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvciwgc3RhcnRDb29yZHM6IFZlY3Rvcn19ID0ge307XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGdyYXZpdGF0ZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdyYXBoKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gdGhpcy5taW5pbWl6ZUxvc3MoKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5lZGdlcyk7XG4gICAgICAgIHRoaXMuYXNzZXJ0RGlzdGFuY2VzKHNvbHV0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb24sIGRlbGF5LCBhbmltYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyA9PSAtMSAmJiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID0gdGhpcy5nZXRXZWlnaHRzU3VtKCkgLyB0aGlzLmdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvXi0xJywgMS90aGlzLmF2ZXJhZ2VFdWNsaWRpYW5MZW5ndGhSYXRpbyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFdlaWdodHNTdW0oKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IGVkZ2Uud2VpZ2h0IHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEV1Y2xpZGlhbkRpc3RhbmNlU3VtKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIHN1bSArPSB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlZGdlVmVjdG9yKGVkZ2U6IExpbmUpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEodGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUdyYXBoKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSA9IEdyYXZpdGF0b3IuSU5JVElBTElaRV9SRUxBVElWRV9UT19FVUNMSURJQU5fRElTVEFOQ0VcbiAgICAgICAgICAgICAgICAgICAgPyAxIC8gdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW9cbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmVkZ2VWZWN0b3IoZWRnZSkubGVuZ3RoIC8gKGVkZ2Uud2VpZ2h0IHx8IDApO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5pdGlhbEFuZ2xlcyhlZGdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHZlcnRleC5pbmRleCA9IG5ldyBWZWN0b3IoaSwgaSsxKTtcbiAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkSW5pdGlhbEFuZ2xlcyhlZGdlOiBMaW5lKSB7XG4gICAgICAgIGZvciAoY29uc3QgYWRqYWNlbnQgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPDI7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajwyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2UudGVybWluaVtpXS5zdGF0aW9uSWQgPT0gYWRqYWNlbnQudGVybWluaVtqXS5zdGF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbEFuZ2xlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3RhdGlvbjogZWRnZS50ZXJtaW5pW2leMV0uc3RhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vblN0YXRpb246IGVkZ2UudGVybWluaVtpXS5zdGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYlN0YXRpb246IGVkZ2UudGVybWluaVtqXjFdLnN0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogdGhpcy50aHJlZURvdEFuZ2xlTG9zcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbaV4xXS5zdGF0aW9uSWRdLnN0YXRpb24uYmFzZUNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbaV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pW2peMV0uc3RhdGlvbklkXS5zdGF0aW9uLmJhc2VDb29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL2Rlcml2ZSBhcmNjb3MoKChhLWMpKihlLWcpKyhiLWQpKihmLWgpKS8oc3FydCgoYS1jKV4yKyhiLWQpXjIpKnNxcnQoKGUtZyleMisoZi1oKV4yKSkpKigoZi1oKSooYS1jKS0oYi1kKSooZS1nKSkvfCgoZi1oKSooYS1jKS0oYi1kKSooZS1nKSl8XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJlZURvdEFuZ2xlTG9zcyhkMTogVmVjdG9yLCBkMjogVmVjdG9yLCBkMzogVmVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRocmVlRG90UHJvZHVjdChkMSwgZDIsIGQzKSp0aGlzLnRocmVlRG90U2lnbihkMSxkMixkMyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJlZURvdFByb2R1Y3QoZDE6IFZlY3RvciwgZDI6IFZlY3RvciwgZDM6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAoZDIueC1kMS54KSooZDIueC1kMy54KSsoZDIueS1kMS55KSooZDIueS1kMy55KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRocmVlRG90U2lnbihkMTogVmVjdG9yLCBkMjogVmVjdG9yLCBkMzogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIChkMi55LWQzLnkpKihkMi54LWQxLngpKyhkMi55LWQxLnkpKihkMi54LWQzLngpO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBtaW5pbWl6ZUxvc3MoKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCBncmF2aXRhdG9yID0gdGhpcztcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge2hpc3Rvcnk6IFtdfTtcbiAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlcltdID0gdGhpcy5zdGFydFN0YXRpb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSBmbWluLmNvbmp1Z2F0ZUdyYWRpZW50KChBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10pID0+IHtcbiAgICAgICAgICAgIGZ4cHJpbWUgPSBmeHByaW1lIHx8IEEuc2xpY2UoKTtcbiAgICAgICAgICAgIGxldCBmeCA9IDA7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb1N0YXJ0U3RhdGlvblBvc2l0aW9uc1RvRW5zdXJlSW5lcnRuZXNzKGZ4LCBBLCBmeHByaW1lLCBncmF2aXRhdG9yKTtcbiAgICAgICAgICAgIC8vZnggPSB0aGlzLmRlbHRhVG9BbmdsZXNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb05ld0Rpc3RhbmNlc1RvRW5zdXJlQWNjdXJhY3koZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgdGhpcy5zY2FsZUdyYWRpZW50VG9FbnN1cmVXb3JraW5nU3RlcFNpemUoZnhwcmltZSk7XG4gICAgICAgICAgICByZXR1cm4gZng7XG4gICAgICAgIH0sIHN0YXJ0LCBwYXJhbXMpO1xuICAgICAgICByZXR1cm4gc29sdXRpb24ueDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0U3RhdGlvblBvc2l0aW9ucygpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdGFydFt2ZXJ0ZXguaW5kZXgueF0gPSB2ZXJ0ZXguc3RhcnRDb29yZHMueDtcbiAgICAgICAgICAgIHN0YXJ0W3ZlcnRleC5pbmRleC55XSA9IHZlcnRleC5zdGFydENvb3Jkcy55O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGFydDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWChBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueF0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC54XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWShBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueV0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IudmVydGljZXMpKSB7XG4gICAgICAgICAgICBmeCArPSAoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGFydENvb3Jkcy54LCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGFydENvb3Jkcy55LCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGF0aW9uLmJhc2VDb29yZHMueCwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhdGlvbi5iYXNlQ29vcmRzLnksIDIpXG4gICAgICAgICAgICAgICAgKSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueF0gPSAyICogKDIqQVt2ZXJ0ZXguaW5kZXgueF0tdmVydGV4LnN0YXJ0Q29vcmRzLngtdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy54KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICAgICAgZnhwcmltZVt2ZXJ0ZXguaW5kZXgueV0gPSAyICogKDIqQVt2ZXJ0ZXguaW5kZXgueV0tdmVydGV4LnN0YXJ0Q29vcmRzLnktdmVydGV4LnN0YXRpb24uYmFzZUNvb3Jkcy55KSAqIEdyYXZpdGF0b3IuSU5FUlRORVNTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9BbmdsZXNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgT2JqZWN0LnZhbHVlcyhncmF2aXRhdG9yLmluaXRpYWxBbmdsZXMpKSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gdGhpcy50aHJlZURvdEFuZ2xlTG9zcyhcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmFTdGF0aW9uXS5pbmRleC54XSwgQVtncmF2aXRhdG9yLnZlcnRpY2VzW3BhaXIuYVN0YXRpb25dLmluZGV4LnldKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yKEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmNvbW1vblN0YXRpb25dLmluZGV4LnhdLCBBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5jb21tb25TdGF0aW9uXS5pbmRleC55XSksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcihBW2dyYXZpdGF0b3IudmVydGljZXNbcGFpci5iU3RhdGlvbl0uaW5kZXgueF0sIEFbZ3Jhdml0YXRvci52ZXJ0aWNlc1twYWlyLmJTdGF0aW9uXS5pbmRleC55XSlcbiAgICAgICAgICAgICkgLSBwYWlyLmFuZ2xlO1xuICAgICAgICAgICAgZnggKz0gTWF0aC5wb3codiwgMik7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICByZXR1cm4gZng7XG5cbiAgICAgICAgLypcbiAgICAgICAgTWF0aC5wb3coXG4gICAgICAgICAgICAgICAgbmV3IFZlY3Rvcih0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBwYWlyLmVkZ2VBLnRlcm1pbmkpLCB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBwYWlyLmVkZ2VBLnRlcm1pbmkpKS5hbmdsZShcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3Rvcih0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBwYWlyLmVkZ2VCLnRlcm1pbmkpLCB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBwYWlyLmVkZ2VCLnRlcm1pbmkpKVxuICAgICAgICAgICAgICAgICkuZGVncmVlcyAtIHBhaXIuYW5nbGUuZGVncmVlc1xuICAgICAgICAgICAgICAgICovXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvTmV3RGlzdGFuY2VzVG9FbnN1cmVBY2N1cmFjeShmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKGdyYXZpdGF0b3IuZWRnZXMpKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdiA9IE1hdGgucG93KHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICArIE1hdGgucG93KHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAtIE1hdGgucG93KGdyYXZpdGF0b3IuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSAqIChlZGdlLndlaWdodCB8fCAwKSwgMik7XG4gICAgICAgICAgICBmeCArPSBNYXRoLnBvdyh2LCAyKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC54XSArPSArNCAqIHYgKiB0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnldICs9ICs0ICogdiAqIHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueF0gKz0gLTQgKiB2ICogdGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XSArPSAtNCAqIHYgKiB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjYWxlR3JhZGllbnRUb0Vuc3VyZVdvcmtpbmdTdGVwU2l6ZShmeHByaW1lOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnhwcmltZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZnhwcmltZVtpXSAqPSBHcmF2aXRhdG9yLkdSQURJRU5UX1NDQUxFO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnREaXN0YW5jZXMoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldmlhdGlvbiA9IE1hdGguYWJzKDEgLSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVgoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyh0aGlzLmRlbHRhWShzb2x1dGlvbiwgdGhpcy52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICkgLyAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApKSk7XG4gICAgICAgICAgICBpZiAoZGV2aWF0aW9uID4gR3Jhdml0YXRvci5ERVZJQVRJT05fV0FSTklORykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlZGdlLm5hbWUsICdkaXZlcmdlcyBieSAnLCBkZXZpYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBcblxuICAgIHByaXZhdGUgbW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb246IG51bWJlcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID0gYW5pbWF0ZSA/IDMgOiAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXguc3RhdGlvbi5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIG5ldyBWZWN0b3Ioc29sdXRpb25bdmVydGV4LmluZGV4LnhdLCBzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueV0pKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgZWRnZS5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIFt0aGlzLmdldE5ld1N0YXRpb25Qb3NpdGlvbihlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBzb2x1dGlvbiksIHRoaXMuZ2V0TmV3U3RhdGlvblBvc2l0aW9uKGVkZ2UudGVybWluaVsxXS5zdGF0aW9uSWQsIHNvbHV0aW9uKV0pO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ICs9IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcztcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TmV3U3RhdGlvblBvc2l0aW9uKHN0YXRpb25JZDogc3RyaW5nLCBzb2x1dGlvbjogbnVtYmVyW10pOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcihzb2x1dGlvblt0aGlzLnZlcnRpY2VzW3N0YXRpb25JZF0uaW5kZXgueF0sIHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC55XSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRWZXJ0ZXgodmVydGV4SWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNlc1t2ZXJ0ZXhJZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQodmVydGV4SWQpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyB2ZXJ0ZXhJZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9IHtzdGF0aW9uOiBzdGF0aW9uLCBpbmRleDogVmVjdG9yLk5VTEwsIHN0YXJ0Q29vcmRzOiBzdGF0aW9uLmJhc2VDb29yZHN9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkRWRnZShsaW5lOiBMaW5lKSB7XG4gICAgICAgIGlmIChsaW5lLndlaWdodCA9PSB1bmRlZmluZWQpIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0SWRlbnRpZmllcihsaW5lKTtcbiAgICAgICAgdGhpcy5lZGdlc1tpZF0gPSBsaW5lO1xuICAgICAgICB0aGlzLmFkZFZlcnRleChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkKTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZGVudGlmaWVyKGxpbmU6IExpbmUpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmFscGhhYmV0aWNJZChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBsaW5lLnRlcm1pbmlbMV0uc3RhdGlvbklkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5zdGFudCB7XG4gICAgc3RhdGljIEJJR19CQU5HOiBJbnN0YW50ID0gbmV3IEluc3RhbnQoMCwgMCwgJycpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Vwb2NoOiBudW1iZXIsIHByaXZhdGUgX3NlY29uZDogbnVtYmVyLCBwcml2YXRlIF9mbGFnOiBzdHJpbmcpIHtcblxuICAgIH1cbiAgICBnZXQgZXBvY2goKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vwb2NoO1xuICAgIH1cbiAgICBnZXQgc2Vjb25kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWNvbmQ7XG4gICAgfVxuICAgIGdldCBmbGFnKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFnO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGFycmF5OiBzdHJpbmdbXSk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQocGFyc2VJbnQoYXJyYXlbMF0pLCBwYXJzZUludChhcnJheVsxXSksIGFycmF5WzJdID8/ICcnKVxuICAgIH1cblxuICAgIGVxdWFscyh0aGF0OiBJbnN0YW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2ggJiYgdGhpcy5zZWNvbmQgPT0gdGhhdC5zZWNvbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kIC0gdGhpcy5zZWNvbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExhYmVsQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBmb3JTdGF0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZm9yTGluZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGJvdW5kaW5nQm94OiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn07XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIGNsb25lRm9yU3RhdGlvbihzdGF0aW9uSWQ6IHN0cmluZyk6IExhYmVsQWRhcHRlcjtcbn1cblxuZXhwb3J0IGNsYXNzIExhYmVsIGltcGxlbWVudHMgVGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIExBQkVMX0hFSUdIVCA9IDEyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBMYWJlbEFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBib3VuZGluZ0JveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcbiAgICBjaGlsZHJlbjogTGFiZWxbXSA9IFtdO1xuXG4gICAgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8IHRoaXMuYWRhcHRlci5mb3JMaW5lIHx8ICcnO1xuICAgIH1cbiAgICBcbiAgICBnZXQgZm9yU3RhdGlvbigpOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8ICcnKTtcbiAgICAgICAgaWYgKHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmZvclN0YXRpb247XG4gICAgICAgICAgICBzdGF0aW9uLmFkZExhYmVsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24ubGluZXNFeGlzdGluZygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3Rm9yU3RhdGlvbihkZWxheSwgc3RhdGlvbiwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgdGVybWluaSA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5hZGFwdGVyLmZvckxpbmUpLnRlcm1pbmk7XG4gICAgICAgICAgICB0ZXJtaW5pLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHQuc3RhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBpZiAocyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHMubGFiZWxzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmRyYXcoZGVsYXksIGFuaW1hdGUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xhYmVsRm9yU3RhdGlvbiA9IG5ldyBMYWJlbCh0aGlzLmFkYXB0ZXIuY2xvbmVGb3JTdGF0aW9uKHMuaWQpLCB0aGlzLnN0YXRpb25Qcm92aWRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYWRkTGFiZWwobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xhYmVsRm9yU3RhdGlvbi5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXdMYWJlbEZvclN0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdGb3JTdGF0aW9uKGRlbGF5U2Vjb25kczogbnVtYmVyLCBzdGF0aW9uOiBTdGF0aW9uLCBmb3JMaW5lOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgbGV0IHlPZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8c3RhdGlvbi5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBzdGF0aW9uLmxhYmVsc1tpXTtcbiAgICAgICAgICAgIGlmIChsID09IHRoaXMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB5T2Zmc2V0ICs9IExhYmVsLkxBQkVMX0hFSUdIVCoxLjU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFiZWxEaXIgPSBzdGF0aW9uLmxhYmVsRGlyO1xuXG4gICAgICAgIHlPZmZzZXQgPSBNYXRoLnNpZ24oVmVjdG9yLlVOSVQucm90YXRlKGxhYmVsRGlyKS55KSp5T2Zmc2V0IC0gKHlPZmZzZXQ+MCA/IDIgOiAwKTsgLy9UT0RPIG1hZ2ljIG51bWJlcnNcbiAgICAgICAgY29uc3Qgc3RhdGlvbkRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGRpZmZEaXIgPSBsYWJlbERpci5hZGQobmV3IFJvdGF0aW9uKC1zdGF0aW9uRGlyLmRlZ3JlZXMpKTtcbiAgICAgICAgY29uc3QgdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZGlmZkRpcik7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IG5ldyBWZWN0b3Ioc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3gnLCB1bml0di54KSwgc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3knLCB1bml0di55KSk7XG4gICAgICAgIGNvbnN0IHRleHRDb29yZHMgPSBiYXNlQ29vcmQuYWRkKGFuY2hvci5yb3RhdGUoc3RhdGlvbkRpcikpLmFkZChuZXcgVmVjdG9yKDAsIHlPZmZzZXQpKTtcbiAgICBcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXlTZWNvbmRzLCB0ZXh0Q29vcmRzLCBsYWJlbERpciwgdGhpcy5jaGlsZHJlbi5tYXAoYyA9PiBjLmFkYXB0ZXIpKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5mb3JTdGF0aW9uLnJlbW92ZUxhYmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFkYXB0ZXIuZm9yTGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBjLmVyYXNlKGRlbGF5LCBhbmltYXRlLCByZXZlcnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuL1ByZWZlcnJlZFRyYWNrXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCAge1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJvdW5kaW5nQm94OiB7IHRsOiBWZWN0b3I7IGJyOiBWZWN0b3I7IH07XG4gICAgd2VpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlcik6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGluZSBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBOT0RFX0RJU1RBTkNFID0gMDtcbiAgICBzdGF0aWMgU1BFRUQgPSAxMDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IExpbmVBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyLCBwcml2YXRlIGJlY2tTdHlsZTogYm9vbGVhbiA9IHRydWUpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLm5hbWU7XG4gICAgYm91bmRpbmdCb3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG4gICAgd2VpZ2h0ID0gdGhpcy5hZGFwdGVyLndlaWdodDtcbiAgICBcbiAgICBwcml2YXRlIHByZWNlZGluZ1N0b3A6IFN0YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBwcmVjZWRpbmdEaXI6IFJvdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgcGF0aDogVmVjdG9yW10gPSBbXTtcblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wYXRoO1xuICAgICAgICBcbiAgICAgICAgbGV0IHRyYWNrID0gbmV3IFByZWZlcnJlZFRyYWNrKCcrJyk7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tU3RyaW5nKHN0b3BzW2pdLnByZWZlcnJlZFRyYWNrKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKHN0b3AuYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKHRoaXMubmFtZSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RvcCwgdGhpcy5uZXh0U3RvcEJhc2VDb29yZChzdG9wcywgaiwgc3RvcC5iYXNlQ29vcmRzKSwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCB0cnVlKTtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2sua2VlcE9ubHlTaWduKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpLmFkZExpbmUodGhpcyk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBkdXJhdGlvbiwgcGF0aCwgdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSk7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBsZXQgb2xkUGF0aCA9IHRoaXMucGF0aDtcbiAgICAgICAgaWYgKG9sZFBhdGgubGVuZ3RoIDwgMiB8fCBwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVHJ5aW5nIHRvIG1vdmUgYSBub24gZXhpc3RpbmcgbGluZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbGRQYXRoLmxlbmd0aCAhPSBwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgb2xkUGF0aCA9IFtvbGRQYXRoWzBdLCBvbGRQYXRoW29sZFBhdGgubGVuZ3RoLTFdXTtcbiAgICAgICAgICAgIHBhdGggPSBbcGF0aFswXSwgcGF0aFtwYXRoLmxlbmd0aC0xXV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5wYXRoLCBwYXRoKTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLnBhdGgsIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSkucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5LCBkdXJhdGlvbiwgcmV2ZXJzZSwgdGhpcy5nZXRUb3RhbExlbmd0aCh0aGlzLnBhdGgpKTtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHN0b3BzW2pdLnN0YXRpb25JZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICBzdG9wLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgICAgICBzdG9wLmRyYXcoZGVsYXkpO1xuICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3BJZCA9ICdoXycgKyBVdGlscy5hbHBoYWJldGljSWQoc3RvcHNbai0xXS5zdGF0aW9uSWQsIHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGhlbHBTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBoZWxwU3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0U3RvcEJhc2VDb29yZChzdG9wczogU3RvcFtdLCBjdXJyZW50U3RvcEluZGV4OiBudW1iZXIsIGRlZmF1bHRDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICBpZiAoY3VycmVudFN0b3BJbmRleCsxIDwgc3RvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHN0b3BzW2N1cnJlbnRTdG9wSW5kZXgrMV0uc3RhdGlvbklkO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgaWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3AuYmFzZUNvb3JkczsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdENvb3JkcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgdHJhY2s6IFByZWZlcnJlZFRyYWNrLCBwYXRoOiBWZWN0b3JbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmVjdXJzZTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBkaXIgPSBzdGF0aW9uLnJvdGF0aW9uO1xuICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgIGNvbnN0IG5ld0RpciA9IHRoaXMuZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIGRpciwgcGF0aCk7XG4gICAgICAgIGNvbnN0IG5ld1BvcyA9IHN0YXRpb24uYXNzaWduVHJhY2sobmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgdHJhY2ssIHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gc3RhdGlvbi5yb3RhdGVkVHJhY2tDb29yZGluYXRlcyhuZXdEaXIsIG5ld1Bvcyk7XG4gICAgXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgXG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMuZ2V0UHJlY2VkaW5nRGlyKHRoaXMucHJlY2VkaW5nRGlyLCB0aGlzLnByZWNlZGluZ1N0b3AsIG9sZENvb3JkLCBuZXdDb29yZCk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gbmV3RGlyLmFkZChkaXIpO1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmluc2VydE5vZGUob2xkQ29vcmQsIHRoaXMucHJlY2VkaW5nRGlyLCBuZXdDb29yZCwgc3RhdGlvbkRpciwgcGF0aCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWZvdW5kICYmIHJlY3Vyc2UgJiYgdGhpcy5wcmVjZWRpbmdTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wID0gdGhpcy5nZXRPckNyZWF0ZUhlbHBlclN0b3AodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgc3RhdGlvbik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSB0aGlzLnByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihoZWxwU3RvcCwgYmFzZUNvb3JkLCB0cmFjay5rZWVwT25seVNpZ24oKSwgcGF0aCwgZGVsYXksIGFuaW1hdGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIHRyYWNrLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdwYXRoIHRvIGZpeCBvbiBsaW5lJywgdGhpcy5hZGFwdGVyLm5hbWUsICdhdCBzdGF0aW9uJywgc3RhdGlvbi5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHN0YXRpb25EaXI7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGlvbi5hZGRMaW5lKHRoaXMsIG5ld0Rpci5pc1ZlcnRpY2FsKCkgPyAneCcgOiAneScsIG5ld1Bvcyk7XG4gICAgICAgIHBhdGgucHVzaChuZXdDb29yZCk7XG4gICAgICAgIGRlbGF5ID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKSArIGRlbGF5O1xuICAgICAgICBzdGF0aW9uLmRyYXcoZGVsYXkpO1xuICAgICAgICB0aGlzLnByZWNlZGluZ1N0b3AgPSBzdGF0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgZGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0b3BCYXNlQ29vcmQuZGVsdGEob2xkQ29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKG5leHRTdG9wQmFzZUNvb3JkKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdBeGlzID0gc3RhdGlvbi5heGlzQW5kVHJhY2tGb3JFeGlzdGluZ0xpbmUodGhpcy5uYW1lKT8uYXhpcztcbiAgICAgICAgaWYgKGV4aXN0aW5nQXhpcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbiA9IGRlbHRhLmluY2xpbmF0aW9uKCkuaGFsZkRpcmVjdGlvbihkaXIsIGV4aXN0aW5nQXhpcyA9PSAneCcgPyBuZXcgUm90YXRpb24oOTApIDogbmV3IFJvdGF0aW9uKDApKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbi5hZGQoZGlyKS5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsdGEuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgfVxuICAgIFxuXG4gICAgcHJpdmF0ZSBnZXRQcmVjZWRpbmdEaXIocHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCwgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCwgb2xkQ29vcmQ6IFZlY3RvciwgbmV3Q29vcmQ6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWNlZGluZ1N0b3BSb3RhdGlvbiA9IHByZWNlZGluZ1N0b3A/LnJvdGF0aW9uID8/IG5ldyBSb3RhdGlvbigwKTtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24ocHJlY2VkaW5nU3RvcFJvdGF0aW9uKS5hZGQocHJlY2VkaW5nU3RvcFJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IHByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVjZWRpbmdEaXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbnNlcnROb2RlKGZyb21Db29yZDogVmVjdG9yLCBmcm9tRGlyOiBSb3RhdGlvbiwgdG9Db29yZDogVmVjdG9yLCB0b0RpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5iZWNrU3R5bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSBmcm9tQ29vcmQuZGVsdGEodG9Db29yZCk7XG4gICAgICAgIGNvbnN0IG9sZERpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZnJvbURpcik7XG4gICAgICAgIGNvbnN0IG5ld0RpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUodG9EaXIpO1xuICAgICAgICBpZiAoZGVsdGEuaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwob2xkRGlyViwgbmV3RGlyVikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZGVsdGEuc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihvbGREaXJWLCBuZXdEaXJWKVxuICAgICAgICBpZiAoc29sdXRpb24uYSA+IExpbmUuTk9ERV9ESVNUQU5DRSAmJiBzb2x1dGlvbi5iID4gTGluZS5OT0RFX0RJU1RBTkNFKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gobmV3IFZlY3Rvcihmcm9tQ29vcmQueCtvbGREaXJWLngqc29sdXRpb24uYSwgZnJvbUNvb3JkLnkrb2xkRGlyVi55KnNvbHV0aW9uLmEpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlSGVscGVyU3RvcChmcm9tRGlyOiBSb3RhdGlvbiwgZnJvbVN0b3A6IFN0YXRpb24sIHRvU3RvcDogU3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChmcm9tU3RvcC5pZCwgdG9TdG9wLmlkKTtcbiAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgIGlmIChoZWxwU3RvcCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZycsIGhlbHBTdG9wSWQpO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBmcm9tU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgbmV3Q29vcmQgPSB0b1N0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3Q29vcmQuZGVsdGEob2xkQ29vcmQpO1xuICAgICAgICAgICAgY29uc3QgZGVnID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVEaXIgPSBuZXcgUm90YXRpb24oKGRlZy5kZWx0YShmcm9tRGlyKS5kZWdyZWVzID49IDAgPyBNYXRoLmZsb29yKGRlZy5kZWdyZWVzIC8gNDUpIDogTWF0aC5jZWlsKGRlZy5kZWdyZWVzIC8gNDUpKSAqIDQ1KS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZUNvb3JkID0gZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgvMikuYWRkKG5ld0Nvb3JkKTtcblxuICAgICAgICAgICAgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5jcmVhdGVWaXJ0dWFsU3RvcChoZWxwU3RvcElkLCBpbnRlcm1lZGlhdGVDb29yZCwgaW50ZXJtZWRpYXRlRGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGVscFN0b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBbmltYXRpb25EdXJhdGlvbihwYXRoOiBWZWN0b3JbXSwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSAvIExpbmUuU1BFRUQ7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0VG90YWxMZW5ndGgocGF0aDogVmVjdG9yW10pOiBudW1iZXIge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhdGgubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgbGVuZ3RoICs9IHBhdGhbaV0uZGVsdGEocGF0aFtpKzFdKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXQgdGVybWluaSgpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA9PSAwKSBcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIFtzdG9wc1swXSwgc3RvcHNbc3RvcHMubGVuZ3RoLTFdXTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lR3JvdXAge1xuICAgIHByaXZhdGUgbGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgX3Rlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgIFxuICAgIGFkZExpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMubGluZXMuaW5jbHVkZXMobGluZSkpXG4gICAgICAgICAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmVzW2ldID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFN0b3BbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJtaW5pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVGVybWluaSgpIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICAgICAgdGhpcy5saW5lcy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZVRlcm1pbmkgPSBsLnRlcm1pbmk7XG4gICAgICAgICAgICBsaW5lVGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdC5wcmVmZXJyZWRUcmFjay5pbmNsdWRlcygnKicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtzdGF0aW9uSWQsIG9jY3VyZW5jZXNdIG9mIE9iamVjdC5lbnRyaWVzKGNhbmRpZGF0ZXMpKSB7XG4gICAgICAgICAgICBpZiAob2NjdXJlbmNlcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGVybWluaS5wdXNoKG5ldyBTdG9wKHN0YXRpb25JZCwgJycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90ZXJtaW5pID0gdGVybWluaTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuL1pvb21lclwiO1xuaW1wb3J0IHsgTGluZUdyb3VwIH0gZnJvbSBcIi4vTGluZUdyb3VwXCI7XG5pbXBvcnQgeyBHcmF2aXRhdG9yIH0gZnJvbSBcIi4vR3Jhdml0YXRvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBZGFwdGVyIHtcbiAgICBjYW52YXNTaXplOiBWZWN0b3I7XG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZDtcbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IG51bGw7XG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uO1xuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZDtcbiAgICB6b29tVG8oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTmV0d29yayBpbXBsZW1lbnRzIFN0YXRpb25Qcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzbGlkZUluZGV4OiB7W2lkOiBzdHJpbmddIDoge1tpZDogc3RyaW5nXTogVGltZWREcmF3YWJsZVtdfX0gPSB7fTtcbiAgICBwcml2YXRlIHN0YXRpb25zOiB7IFtpZDogc3RyaW5nXSA6IFN0YXRpb24gfSA9IHt9O1xuICAgIHByaXZhdGUgbGluZUdyb3VwczogeyBbaWQ6IHN0cmluZ10gOiBMaW5lR3JvdXAgfSA9IHt9O1xuICAgIHByaXZhdGUgZXJhc2VCdWZmZXI6IFRpbWVkRHJhd2FibGVbXSA9IFtdO1xuICAgIHByaXZhdGUgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTmV0d29ya0FkYXB0ZXIpIHtcbiAgICAgICAgdGhpcy5ncmF2aXRhdG9yID0gbmV3IEdyYXZpdGF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmluaXRpYWxpemUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5zdGF0aW9uc1tpZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5hZGFwdGVyLnN0YXRpb25CeUlkKGlkKVxuICAgICAgICAgICAgaWYgKHN0YXRpb24gIT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGlvbnNbaWRdO1xuICAgIH1cblxuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cCB7XG4gICAgICAgIGlmICh0aGlzLmxpbmVHcm91cHNbaWRdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5saW5lR3JvdXBzW2lkXSA9IG5ldyBMaW5lR3JvdXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5saW5lR3JvdXBzW2lkXTtcbiAgICB9XG5cbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5hZGFwdGVyLmNyZWF0ZVZpcnR1YWxTdG9wKGlkLCBiYXNlQ29vcmRzLCByb3RhdGlvbik7XG4gICAgICAgIHRoaXMuc3RhdGlvbnNbaWRdID0gc3RvcDtcbiAgICAgICAgcmV0dXJuIHN0b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaXNwbGF5SW5zdGFudChpbnN0YW50OiBJbnN0YW50KSB7XG4gICAgICAgIGlmICghaW5zdGFudC5lcXVhbHMoSW5zdGFudC5CSUdfQkFORykpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5kcmF3RXBvY2goaW5zdGFudC5lcG9jaCArICcnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCk6IFRpbWVkRHJhd2FibGVbXSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Vwb2NoRXhpc3Rpbmcobm93LmVwb2NoICsgJycpKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZUluZGV4W25vdy5lcG9jaF1bbm93LnNlY29uZF07XG4gICAgfVxuXG4gICAgZHJhd1RpbWVkRHJhd2FibGVzQXQobm93OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmFkYXB0ZXIuY2FudmFzU2l6ZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUluc3RhbnQobm93KTtcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IHRoaXMudGltZWREcmF3YWJsZXNBdChub3cpO1xuICAgICAgICBsZXQgZGVsYXkgPSBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMuZHJhd09yRXJhc2VFbGVtZW50KGVsZW1lbnRzW2ldLCBkZWxheSwgYW5pbWF0ZSwgbm93LCB6b29tZXIpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaEVyYXNlQnVmZmVyKGRlbGF5LCBhbmltYXRlLCB6b29tZXIpO1xuICAgICAgICBkZWxheSA9IHRoaXMuZ3Jhdml0YXRvci5ncmF2aXRhdGUoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuem9vbVRvKHpvb21lci5jZW50ZXIsIHpvb21lci5zY2FsZSwgWm9vbWVyLlpPT01fRFVSQVRJT04pO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmbHVzaEVyYXNlQnVmZmVyKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHpvb21lcjogWm9vbWVyKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaT10aGlzLmVyYXNlQnVmZmVyLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVyYXNlQnVmZmVyW2ldO1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LnRvLCBhbmltYXRlKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IHRoaXMuZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgICAgIHpvb21lci5pbmNsdWRlKGVsZW1lbnQuYm91bmRpbmdCb3gsIGVsZW1lbnQudG8sIHNob3VsZEFuaW1hdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJhc2VCdWZmZXIgPSBbXTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd09yRXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIGluc3RhbnQ6IEluc3RhbnQsIHpvb21lcjogWm9vbWVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKGluc3RhbnQuZXF1YWxzKGVsZW1lbnQudG8pICYmICFlbGVtZW50LmZyb20uZXF1YWxzKGVsZW1lbnQudG8pKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lcmFzZUJ1ZmZlci5sZW5ndGggPiAwICYmIHRoaXMuZXJhc2VCdWZmZXJbdGhpcy5lcmFzZUJ1ZmZlci5sZW5ndGgtMV0ubmFtZSAhPSBlbGVtZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hFcmFzZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSwgem9vbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZXJhc2VCdWZmZXIucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBkZWxheTtcbiAgICAgICAgfVxuICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hFcmFzZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSwgem9vbWVyKTtcbiAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LmZyb20sIGFuaW1hdGUpO1xuICAgICAgICBkZWxheSArPSB0aGlzLmRyYXdFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgem9vbWVyLmluY2x1ZGUoZWxlbWVudC5ib3VuZGluZ0JveCwgZWxlbWVudC5mcm9tLCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGRyYXdFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIExpbmUpIHtcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0YXRvci5hZGRFZGdlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50LmRyYXcoZGVsYXksIGFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGVyYXNlRWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZXJhc2UoZGVsYXksIGFuaW1hdGUsIGVsZW1lbnQudG8uZmxhZyA9PSAncmV2ZXJzZScpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHNob3VsZEFuaW1hdGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChpbnN0YW50LmZsYWcgPT0gJ25vYW5pbScpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBhbmltYXRlO1xuICAgIH1cblxuICAgIGlzRXBvY2hFeGlzdGluZyhlcG9jaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdICE9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhZGRUb0luZGV4KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LmZyb20sIGVsZW1lbnQpO1xuICAgICAgICBpZiAoIUluc3RhbnQuQklHX0JBTkcuZXF1YWxzKGVsZW1lbnQudG8pKVxuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LnRvLCBlbGVtZW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNsaWRlSW5kZXhFbGVtZW50KGluc3RhbnQ6IEluc3RhbnQsIGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9IFtdO1xuICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdLnB1c2goZWxlbWVudCk7XG4gICAgfVxuXG4gICAgbmV4dEluc3RhbnQobm93OiBJbnN0YW50KTogSW5zdGFudCB8IG51bGwge1xuICAgICAgICBsZXQgZXBvY2g6IG51bWJlciB8IG51bGwgPSBub3cuZXBvY2g7XG4gICAgICAgIGxldCBzZWNvbmQ6IG51bWJlciB8IG51bGwgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5zZWNvbmQsIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdKTtcbiAgICAgICAgaWYgKHNlY29uZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcG9jaCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LmVwb2NoLCB0aGlzLnNsaWRlSW5kZXgpO1xuICAgICAgICAgICAgaWYgKGVwb2NoID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHNlY29uZCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUoLTEsIHRoaXMuc2xpZGVJbmRleFtlcG9jaF0pO1xuICAgICAgICAgICAgaWYgKHNlY29uZCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW50KGVwb2NoLCBzZWNvbmQsICcnKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmaW5kU21hbGxlc3RBYm92ZSh0aHJlc2hvbGQ6IG51bWJlciwgZGljdDoge1tpZDogbnVtYmVyXTogYW55fSk6IG51bWJlciB8IG51bGwge1xuICAgICAgICBpZiAoZGljdCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGljdCkpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChrZXkpID4gdGhyZXNob2xkICYmIChzbWFsbGVzdCA9PSBudWxsIHx8IHBhcnNlSW50KGtleSkgPCBzbWFsbGVzdCkpIHtcbiAgICAgICAgICAgICAgICBzbWFsbGVzdCA9IHBhcnNlSW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNtYWxsZXN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IExpbmVBdFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJyZWRUcmFjayB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgaWYgKHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlID49IDAgPyAnKycgOiAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayhwcmVmaXggKyB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihhdFN0YXRpb246IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGF0U3RhdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhY2tOdW1iZXIoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tTnVtYmVyKGF0U3RhdGlvbi50cmFjayk7ICAgICAgICBcbiAgICB9XG5cbiAgICBrZWVwT25seVNpZ24oKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy52YWx1ZVswXTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayh2ID09ICctJyA/IHYgOiAnKycpO1xuICAgIH1cblxuICAgIGhhc1RyYWNrTnVtYmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGdldCB0cmFja051bWJlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy52YWx1ZS5yZXBsYWNlKCcqJywgJycpKVxuICAgIH1cblxuICAgIGlzUG9zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdICE9ICctJztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgICBwcml2YXRlIHN0YXRpYyBESVJTOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7J3N3JzogLTEzNSwgJ3cnOiAtOTAsICdudyc6IC00NSwgJ24nOiAwLCAnbmUnOiA0NSwgJ2UnOiA5MCwgJ3NlJzogMTM1LCAncyc6IDE4MH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWdyZWVzOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGRpcmVjdGlvbjogc3RyaW5nKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKFJvdGF0aW9uLkRJUlNbZGlyZWN0aW9uXSlcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhSb3RhdGlvbi5ESVJTKSkge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2YWx1ZSwgdGhpcy5kZWdyZWVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG5cbiAgICBnZXQgZGVncmVlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVncmVlcztcbiAgICB9XG5cbiAgICBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzIC8gMTgwICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICBhZGQodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLmRlZ3JlZXMgKyB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGlmIChzdW0gPD0gLTE4MClcbiAgICAgICAgICAgIHN1bSArPSAzNjA7XG4gICAgICAgIGlmIChzdW0gPiAxODApXG4gICAgICAgICAgICBzdW0gLT0gMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHN1bSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBsZXQgYiA9IHRoYXQuZGVncmVlcztcbiAgICAgICAgbGV0IGRpc3QgPSBiLWE7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0KSA+IDE4MCkge1xuICAgICAgICAgICAgaWYgKGEgPCAwKVxuICAgICAgICAgICAgICAgIGEgKz0gMzYwO1xuICAgICAgICAgICAgaWYgKGIgPCAwKVxuICAgICAgICAgICAgICAgIGIgKz0gMzYwO1xuICAgICAgICAgICAgZGlzdCA9IGItYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpc3QpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBkaXIgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGlyLCAtOTApKVxuICAgICAgICAgICAgZGlyID0gMDtcbiAgICAgICAgZWxzZSBpZiAoZGlyIDwgLTkwKVxuICAgICAgICAgICAgZGlyICs9IDE4MDtcbiAgICAgICAgZWxzZSBpZiAoZGlyID4gOTApXG4gICAgICAgICAgICBkaXIgLT0gMTgwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpcik7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAlIDE4MCA9PSAwO1xuICAgIH1cblxuICAgIHF1YXJ0ZXJEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGNvbnN0IGRlZyA9IGRlbHRhRGlyIDwgMCA/IE1hdGguY2VpbCgoZGVsdGFEaXItNDUpLzkwKSA6IE1hdGguZmxvb3IoKGRlbHRhRGlyKzQ1KS85MCk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKjkwKTtcbiAgICB9XG5cbiAgICBoYWxmRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBzcGxpdEF4aXM6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBsZXQgZGVnO1xuICAgICAgICBpZiAoc3BsaXRBeGlzLmlzVmVydGljYWwoKSkge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgMCAmJiBkZWx0YURpciA+PSAtMTgwKVxuICAgICAgICAgICAgICAgIGRlZyA9IC05MDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSA5MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDkwICYmIGRlbHRhRGlyID49IC05MClcbiAgICAgICAgICAgICAgICBkZWcgPSAwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDE4MDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyk7XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uQWRhcHRlciB7XG4gICAgYmFzZUNvb3JkczogVmVjdG9yO1xuICAgIHJvdGF0aW9uOiBSb3RhdGlvbjtcbiAgICBsYWJlbERpcjogUm90YXRpb247XG4gICAgaWQ6IHN0cmluZztcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGlvbklkOiBzdHJpbmcsIHB1YmxpYyBwcmVmZXJyZWRUcmFjazogc3RyaW5nKSB7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUF0U3RhdGlvbiB7XG4gICAgbGluZT86IExpbmU7XG4gICAgYXhpczogc3RyaW5nO1xuICAgIHRyYWNrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aW9uIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IExpbmVBdFN0YXRpb25bXX0gPSB7eDogW10sIHk6IFtdfTtcbiAgICBwcml2YXRlIGV4aXN0aW5nTGFiZWxzOiBMYWJlbFtdID0gW107XG4gICAgcHJpdmF0ZSBwaGFudG9tPzogTGluZUF0U3RhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogU3RhdGlvbkFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGdldCBiYXNlQ29vcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgc2V0IGJhc2VDb29yZHMoYmFzZUNvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzID0gYmFzZUNvb3JkcztcbiAgICB9XG5cbiAgICBhZGRMaW5lKGxpbmU6IExpbmUsIGF4aXM6IHN0cmluZywgdHJhY2s6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBoYW50b20gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMaW5lc1theGlzXS5wdXNoKHtsaW5lOiBsaW5lLCBheGlzOiBheGlzLCB0cmFjazogdHJhY2t9KTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy54KTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy55KTtcbiAgICB9XG5cbiAgICBhZGRMYWJlbChsYWJlbDogTGFiZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmV4aXN0aW5nTGFiZWxzLmluY2x1ZGVzKGxhYmVsKSlcbiAgICAgICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmV4aXN0aW5nTGFiZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMYWJlbHNbaV0gPT0gbGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxhYmVscygpOiBMYWJlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhpc3RpbmdMYWJlbHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVMaW5lQXRBeGlzKGxpbmU6IExpbmUsIGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiB2b2lkIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLmxpbmUgPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGhhbnRvbSA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nTGluZXNGb3JBeGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKGxpbmVOYW1lOiBzdHJpbmcpOiBMaW5lQXRTdGF0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIGlmICh4ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgICAgIGlmICh5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZTogc3RyaW5nLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lPy5uYW1lID09IGxpbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXNzaWduVHJhY2soYXhpczogc3RyaW5nLCBwcmVmZXJyZWRUcmFjazogUHJlZmVycmVkVHJhY2ssIGxpbmU6IExpbmUpOiBudW1iZXIgeyBcbiAgICAgICAgaWYgKHByZWZlcnJlZFRyYWNrLmhhc1RyYWNrTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay50cmFja051bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5waGFudG9tPy5saW5lPy5uYW1lID09IGxpbmUubmFtZSAmJiB0aGlzLnBoYW50b20/LmF4aXMgPT0gYXhpcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGhhbnRvbT8udHJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzKClbYXhpc107XG4gICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay5pc1Bvc2l0aXZlKCkgPyBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzFdICsgMSA6IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXNbMF0gLSAxO1xuICAgIH1cblxuICAgIHJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKGluY29taW5nRGlyOiBSb3RhdGlvbiwgYXNzaWduZWRUcmFjazogbnVtYmVyKTogVmVjdG9yIHsgXG4gICAgICAgIGxldCBuZXdDb29yZDogVmVjdG9yO1xuICAgICAgICBpZiAoaW5jb21pbmdEaXIuZGVncmVlcyAlIDE4MCA9PSAwKSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoMCwgYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Q29vcmQgPSBuZXdDb29yZC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgICAgIG5ld0Nvb3JkID0gdGhpcy5iYXNlQ29vcmRzLmFkZChuZXdDb29yZCk7XG4gICAgICAgIHJldHVybiBuZXdDb29yZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllcygpOiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzLngpLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy55KVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMoZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbMSwgLTFdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgbGV0IHJpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0gZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVmdCA+IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbGVmdCwgcmlnaHRdO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMuZm9yRWFjaChsID0+IGwuZHJhdyhkZWxheVNlY29uZHMsIGZhbHNlKSk7XG4gICAgICAgIGNvbnN0IHQgPSBzdGF0aW9uLnBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdDsgfSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHRvOiBWZWN0b3IpIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5U2Vjb25kcywgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCB0aGlzLmJhc2VDb29yZHMsIHRvLCAoKSA9PiBzdGF0aW9uLmV4aXN0aW5nTGFiZWxzLmZvckVhY2gobCA9PiBsLmRyYXcoMCwgZmFsc2UpKSk7XG4gICAgfVxuXG4gICAgc3RhdGlvblNpemVGb3JBeGlzKGF4aXM6IHN0cmluZywgdmVjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZlY3RvciwgMCkpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY29uc3QgZGlyID0gTWF0aC5zaWduKHZlY3Rvcik7XG4gICAgICAgIGxldCBkaW1lbiA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10pW3ZlY3RvciA8IDAgPyAwIDogMV07XG4gICAgICAgIGlmIChkaXIqZGltZW4gPCAwKSB7XG4gICAgICAgICAgICBkaW1lbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgZGlyICogKFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOICsgU3RhdGlvbi5MQUJFTF9ESVNUQU5DRSk7XG4gICAgfVxuXG4gICAgbGluZXNFeGlzdGluZygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMaW5lcy54Lmxlbmd0aCA+IDAgfHwgdGhpcy5leGlzdGluZ0xpbmVzLnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbEFkYXB0ZXIsIExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdMYWJlbCBpbXBsZW1lbnRzIExhYmVsQWRhcHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IGZvclN0YXRpb24oKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb247XG4gICAgfVxuXG4gICAgZ2V0IGZvckxpbmUoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LmxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IHt0bDogVmVjdG9yLCBicjogVmVjdG9yfSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpO1xuICAgICAgICAgICAgcmV0dXJuIHt0bDogbmV3IFZlY3RvcihyLmxlZnQsIHIudG9wKSwgYnI6IG5ldyBWZWN0b3Ioci5yaWdodCwgci5ib3R0b20pfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3RsOiBWZWN0b3IuTlVMTCwgYnI6IFZlY3Rvci5OVUxMfTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbiwgY2hpbGRyZW46IExhYmVsQWRhcHRlcltdKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZHJhdygwLCB0ZXh0Q29vcmRzLCBsYWJlbERpciwgY2hpbGRyZW4pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENvb3JkKHRoaXMuZWxlbWVudCwgdGV4dENvb3Jkcyk7XG5cbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd0xpbmVMYWJlbHMobGFiZWxEaXIsIGNoaWxkcmVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1N0YXRpb25MYWJlbChsYWJlbERpcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYW5zbGF0ZShib3hEaW1lbjogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgbGFiZWx1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShsYWJlbERpcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di54LCBbLWJveERpbWVuLnggKyAncHgnLCAtYm94RGltZW4ueC8yICsgJ3B4JywgJzBweCddKVxuICAgICAgICAgICAgKyAnLCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di55LCBbLUxhYmVsLkxBQkVMX0hFSUdIVCArICdweCcsIC1MYWJlbC5MQUJFTF9IRUlHSFQvMiArICdweCcsICcwcHgnXSkgLy8gVE9ETyBtYWdpYyBudW1iZXJzXG4gICAgICAgICAgICArICcpJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVscyhsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICBpZiAoYyBpbnN0YW5jZW9mIFN2Z0xhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3TGluZUxhYmVsKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC9NYXRoLm1heCh0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCAxKTtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3RvcihiYm94LndpZHRoL3NjYWxlLCBiYm94LmhlaWdodC9zY2FsZSksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMaW5lTGFiZWwobGFiZWw6IFN2Z0xhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxpbmVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcsICdkaXYnKTtcbiAgICAgICAgbGluZUxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsLmNsYXNzTmFtZXM7XG4gICAgICAgIGxpbmVMYWJlbC5pbm5lckhUTUwgPSBsYWJlbC50ZXh0O1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQobGluZUxhYmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTdGF0aW9uTGFiZWwobGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdmb3Itc3RhdGlvbicpKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgZm9yLXN0YXRpb24nO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZG9taW5hbnRCYXNlbGluZSA9ICdoYW5naW5nJztcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3Rvcih0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLmhlaWdodCksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxhYmVsLmVyYXNlKDApOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q29vcmQoZWxlbWVudDogYW55LCBjb29yZDogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgY29vcmQueCk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd5JywgY29vcmQueSk7XG4gICAgfVxuXG4gICAgZ2V0IGNsYXNzTmFtZXMoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArICcgJyArIHRoaXMuZm9yTGluZTtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBjbG9uZUZvclN0YXRpb24oc3RhdGlvbklkOiBzdHJpbmcpOiBMYWJlbEFkYXB0ZXIge1xuICAgICAgICBjb25zdCBsaW5lTGFiZWw6IFNWR0dyYXBoaWNzRWxlbWVudCA9IDxTVkdHcmFwaGljc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z05ldHdvcmsuU1ZHTlMsICdmb3JlaWduT2JqZWN0Jyk7XG4gICAgICAgIGxpbmVMYWJlbC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIGZvci1saW5lJztcbiAgICAgICAgbGluZUxhYmVsLmRhdGFzZXQuc3RhdGlvbiA9IHN0YXRpb25JZDtcbiAgICAgICAgbGluZUxhYmVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMScpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnLCAnZGl2Jyk7XG4gICAgICAgIGxpbmVMYWJlbC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgIFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGlvbnMnKT8uYXBwZW5kQ2hpbGQobGluZUxhYmVsKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdmdMYWJlbChsaW5lTGFiZWwpXG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IExpbmVBZGFwdGVyLCBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdMaW5lIGltcGxlbWVudHMgTGluZUFkYXB0ZXIge1xuXG4gICAgcHJpdmF0ZSBfc3RvcHM6IFN0b3BbXSA9IFtdO1xuICAgIGJvdW5kaW5nQm94ID0ge3RsOiBWZWN0b3IuTlVMTCwgYnI6IFZlY3Rvci5OVUxMfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lIHx8ICcnO1xuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIGdldCB3ZWlnaHQoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0Lmxlbmd0aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZWxlbWVudC5kYXRhc2V0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVCb3VuZGluZ0JveChwYXRoOiBWZWN0b3JbXSk6IHZvaWQge1xuICAgICAgICBmb3IobGV0IGk9MDtpPHBhdGgubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC50bCA9IHRoaXMuYm91bmRpbmdCb3gudGwuYm90aEF4aXNNaW5zKHBhdGhbaV0pO1xuICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC5iciA9IHRoaXMuYm91bmRpbmdCb3guYnIuYm90aEF4aXNNYXhzKHBhdGhbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnN0YW50KGZyb21PclRvOiBzdHJpbmcpOiBJbnN0YW50IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXT8uc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgaWYgKGFyciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5zdGFudC5mcm9tKGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG4gICAgfVxuXG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcz8uc3BsaXQoL1xccysvKSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRva2Vucz8ubGVuZ3RoO2krKykgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5zW2ldWzBdICE9ICctJyAmJiB0b2tlbnNbaV1bMF0gIT0gJysnICYmIHRva2Vuc1tpXVswXSAhPSAnKicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3Auc3RhdGlvbklkID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdG9wcy5wdXNoKG5leHRTdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdG9wLnByZWZlcnJlZFRyYWNrID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcHM7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHBhdGgpO1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGxpbmUuZHJhdygwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHBhdGgsIGxlbmd0aCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnICcgKyB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuY3JlYXRlUGF0aChwYXRoKTtcbiAgICBcbiAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkobGVuZ3RoKTsgICAgICAgIFxuICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUobGVuZ3RoLCAwLCAtbGVuZ3RoL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUyk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10pIHtcbiAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCh0byk7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgbGluZS5tb3ZlKDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgZnJvbSwgdG8pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxpbmUuZXJhc2UoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCByZXZlcnNlLCBsZW5ndGgpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZnJvbSA9IDA7XG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgZnJvbSA9IGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSByZXZlcnNlID8gLTEgOiAxO1xuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShmcm9tLCBsZW5ndGggKiBkaXJlY3Rpb24sIGxlbmd0aC9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMgKiBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGF0aChwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBjb25zdCBkID0gJ00nICsgcGF0aC5tYXAodiA9PiB2LngrJywnK3YueSkuam9pbignIEwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGFzaGFycmF5KGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBkYXNoZWRQYXJ0ID0gbGVuZ3RoICsgJyc7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLnN0cm9rZURhc2hhcnJheS5yZXBsYWNlKC9bXjAtOVxccyxdKy9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcmVzZXRBcnJheSA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgICAgICBpZiAocHJlc2V0QXJyYXkubGVuZ3RoICUgMiA9PSAxKVxuICAgICAgICAgICAgICAgIHByZXNldEFycmF5ID0gcHJlc2V0QXJyYXkuY29uY2F0KHByZXNldEFycmF5KTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldExlbmd0aCA9IHByZXNldEFycmF5Lm1hcChhID0+IHBhcnNlSW50KGEpIHx8IDApLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuICAgICAgICAgICAgZGFzaGVkUGFydCA9IG5ldyBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gcHJlc2V0TGVuZ3RoICsgMSkpLmpvaW4ocHJlc2V0QXJyYXkuam9pbignICcpICsgJyAnKSArICcwJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gZGFzaGVkUGFydCArICcgJyArIGxlbmd0aDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyLCBhbmltYXRpb25QZXJGcmFtZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChhbmltYXRpb25QZXJGcmFtZSA8IDAgJiYgZnJvbSA+IHRvIHx8IGFuaW1hdGlvblBlckZyYW1lID4gMCAmJiBmcm9tIDwgdG8pIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gZnJvbSArICcnO1xuICAgICAgICAgICAgZnJvbSArPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbGluZS5hbmltYXRlRnJhbWUoZnJvbSwgdG8sIGFuaW1hdGlvblBlckZyYW1lKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHRvICsgJyc7XG4gICAgICAgICAgICBpZiAodG8gIT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCB4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHggPCAxKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZWQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVkLnB1c2goZnJvbVtpXS5iZXR3ZWVuKHRvW2ldLCB4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheShpbnRlcnBvbGF0ZWRbMF0uZGVsdGEoaW50ZXJwb2xhdGVkW2ludGVycG9sYXRlZC5sZW5ndGgtMV0pLmxlbmd0aCk7IC8vIFRPRE8gYXJiaXRyYXJ5IG5vZGUgY291bnRcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGF0aChpbnRlcnBvbGF0ZWQpO1xuXG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgeCwgYW5pbWF0aW9uUGVyRnJhbWUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KHRvWzBdLmRlbHRhKHRvW3RvLmxlbmd0aC0xXSkubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGF0aCh0byk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgTmV0d29ya0FkYXB0ZXIsIE5ldHdvcmssIFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFN2Z0xpbmUgfSBmcm9tIFwiLi9TdmdMaW5lXCI7XG5pbXBvcnQgeyBTdmdTdGF0aW9uIH0gZnJvbSBcIi4vU3ZnU3RhdGlvblwiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi9MYWJlbFwiO1xuaW1wb3J0IHsgU3ZnTGFiZWwgfSBmcm9tIFwiLi9TdmdMYWJlbFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTmV0d29yayBpbXBsZW1lbnRzIE5ldHdvcmtBZGFwdGVyIHtcblxuICAgIHN0YXRpYyBGUFMgPSA2MDtcbiAgICBzdGF0aWMgU1ZHTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRab29tQ2VudGVyOiBWZWN0b3IgPSBWZWN0b3IuTlVMTDtcbiAgICBwcml2YXRlIGN1cnJlbnRab29tU2NhbGU6IG51bWJlciA9IDE7XG5cbiAgICBnZXQgY2FudmFzU2l6ZSgpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgICAgY29uc3QgYm94ID0gc3ZnPy52aWV3Qm94LmJhc2VWYWw7XG4gICAgICAgIGlmIChib3gpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFZlY3Rvci5OVUxMOyAgICAgICAgXG4gICAgfVxuXG4gICAgZ2V0IGJlY2tTdHlsZSgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIHJldHVybiBzdmc/LmRhdGFzZXQuYmVja1N0eWxlICE9ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZCB7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbGVtZW50cycpPy5jaGlsZHJlbjtcbiAgICAgICAgaWYgKGVsZW1lbnRzID09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUGxlYXNlIGRlZmluZSB0aGUgXCJlbGVtZW50c1wiIGdyb3VwLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudDogVGltZWREcmF3YWJsZSB8IG51bGwgPSB0aGlzLm1pcnJvckVsZW1lbnQoZWxlbWVudHNbaV0sIG5ldHdvcmspO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuYWRkVG9JbmRleChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWlycm9yRWxlbWVudChlbGVtZW50OiBhbnksIG5ldHdvcms6IFN0YXRpb25Qcm92aWRlcik6IFRpbWVkRHJhd2FibGUgfCBudWxsIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lKG5ldyBTdmdMaW5lKGVsZW1lbnQpLCBuZXR3b3JrLCB0aGlzLmJlY2tTdHlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExhYmVsKG5ldyBTdmdMYWJlbChlbGVtZW50KSwgbmV0d29yayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCBudWxsIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgaWYgKGVsZW1lbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0YXRpb24obmV3IFN2Z1N0YXRpb24oPFNWR1JlY3RFbGVtZW50PiA8dW5rbm93bj5lbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgaGVscFN0b3AgPSA8U1ZHUmVjdEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAncmVjdCcpO1xuICAgICAgICBoZWxwU3RvcC5pZCA9IGlkOyAgICBcbiAgICAgICAgaGVscFN0b3Auc2V0QXR0cmlidXRlKCdkYXRhLWRpcicsIHJvdGF0aW9uLm5hbWUpO1xuICAgICAgICB0aGlzLnNldENvb3JkKGhlbHBTdG9wLCBiYXNlQ29vcmRzKTtcbiAgICAgICAgaGVscFN0b3AuY2xhc3NOYW1lLmJhc2VWYWwgPSAnaGVscGVyJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpb25zJyk/LmFwcGVuZENoaWxkKGhlbHBTdG9wKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGhlbHBTdG9wKSk7ICBcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzZXRDb29yZChlbGVtZW50OiBhbnksIGNvb3JkOiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3gnLCBjb29yZC54KTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBjb29yZC55KTtcbiAgICB9XG5cbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgZXBvY2hMYWJlbDtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXBvY2hMYWJlbCA9IDxTVkdUZXh0RWxlbWVudD4gPHVua25vd24+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpO1xuICAgICAgICAgICAgZXBvY2hMYWJlbC50ZXh0Q29udGVudCA9IGVwb2NoOyAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgIFxuICAgIHpvb21Ubyh6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcikge1xuICAgICAgICBjb25zb2xlLmxvZyh6b29tQ2VudGVyLCB6b29tU2NhbGUpO1xuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMsIHRoaXMuY3VycmVudFpvb21DZW50ZXIsIHpvb21DZW50ZXIsIHRoaXMuY3VycmVudFpvb21TY2FsZSwgem9vbVNjYWxlKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Wm9vbUNlbnRlciA9IHpvb21DZW50ZXI7XG4gICAgICAgIHRoaXMuY3VycmVudFpvb21TY2FsZSA9IHpvb21TY2FsZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIsIGZyb21DZW50ZXI6IFZlY3RvciwgdG9DZW50ZXI6IFZlY3RvciwgZnJvbVNjYWxlOiBudW1iZXIsIHRvU2NhbGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIHggKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBlYXNlID0gdGhpcy5lYXNlKHgpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBmcm9tQ2VudGVyLmRlbHRhKHRvQ2VudGVyKVxuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlY3RvcihkZWx0YS54ICogZWFzZSwgZGVsdGEueSAqIGVhc2UpLmFkZChmcm9tQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gKHRvU2NhbGUgLSBmcm9tU2NhbGUpICogZWFzZSArIGZyb21TY2FsZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbShjZW50ZXIsIHNjYWxlKTtcbiAgICAgICAgICAgIGNvbnN0IG5ldHdvcmsgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbmV0d29yay5hbmltYXRlRnJhbWUoeCwgYW5pbWF0aW9uUGVyRnJhbWUsIGZyb21DZW50ZXIsIHRvQ2VudGVyLCBmcm9tU2NhbGUsIHRvU2NhbGUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbSh0b0NlbnRlciwgdG9TY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGVhc2UoeDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB4IDwgMC41ID8gNCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAzKSAvIDI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGNlbnRlcjogVmVjdG9yLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHpvb21hYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3pvb21hYmxlJyk7XG4gICAgICAgIGlmICh6b29tYWJsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZSArICcpIHRyYW5zbGF0ZSgnICsgKHRoaXMuY2FudmFzU2l6ZS54IC8gMiAtIGNlbnRlci54KSArICdweCwnICsgKHRoaXMuY2FudmFzU2l6ZS55IC8gMiAtIGNlbnRlci55KSArICdweCknO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU3RhdGlvbkFkYXB0ZXIsIFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdTdGF0aW9uIGltcGxlbWVudHMgU3RhdGlvbkFkYXB0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUmVjdEVsZW1lbnQpIHtcblxuICAgIH1cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pZDtcbiAgICB9XG4gICAgZ2V0IGJhc2VDb29yZHMoKTogVmVjdG9yIHsgICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihwYXJzZUludCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd4JykgfHwgJycpIHx8IDAsIHBhcnNlSW50KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3knKSB8fCAnJykgfHwgMCk7XG4gICAgfVxuICAgIHNldCBiYXNlQ29vcmRzKGJhc2VDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgYmFzZUNvb3Jkcy54ICsgJycpOyBcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGJhc2VDb29yZHMueSArICcnKTsgXG4gICAgfVxuXG4gICAgZ2V0IHJvdGF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQuZGlyIHx8ICduJyk7XG4gICAgfVxuICAgIGdldCBsYWJlbERpcigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmxhYmVsRGlyIHx8ICduJyk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzOiAoKSA9PiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhdGlvbi5kcmF3KDAsIGdldFBvc2l0aW9uQm91bmRhcmllcyk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllcyA9IGdldFBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICBjb25zdCBzdG9wRGltZW4gPSBbcG9zaXRpb25Cb3VuZGFyaWVzLnhbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgcG9zaXRpb25Cb3VuZGFyaWVzLnlbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueVswXV07XG4gICAgICAgIFxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9IHN0b3BEaW1lblswXSA8IDAgJiYgc3RvcERpbWVuWzFdIDwgMCA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKE1hdGgubWF4KHN0b3BEaW1lblswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIChNYXRoLm1heChzdG9wRGltZW5bMV0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4pICsgJycpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCdyb3RhdGUoJyArIHRoaXMucm90YXRpb24uZGVncmVlcyArICcpIHRyYW5zbGF0ZSgnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnLCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnlbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcpJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCB0aGlzLmJhc2VDb29yZHMueCArICcgJyArIHRoaXMuYmFzZUNvb3Jkcy55KTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhdGlvbi5tb3ZlKDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgZnJvbSwgdG8sIGNhbGxiYWNrKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIDAsIDEvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWVWZWN0b3IoZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCB4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgdGhpcy5iYXNlQ29vcmRzID0gZnJvbS5iZXR3ZWVuKHRvLCB4KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgeCwgYW5pbWF0aW9uUGVyRnJhbWUsIGNhbGxiYWNrKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VDb29yZHMgPSB0bztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufSIsImV4cG9ydCBjbGFzcyBVdGlscyB7XG4gICAgc3RhdGljIHJlYWRvbmx5IElNUFJFQ0lTSU9OOiBudW1iZXIgPSAwLjAwMTtcblxuICAgIHN0YXRpYyBlcXVhbHMoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKSA8IFV0aWxzLklNUFJFQ0lTSU9OO1xuICAgIH1cblxuICAgIHN0YXRpYyB0cmlsZW1tYShpbnQ6IG51bWJlciwgb3B0aW9uczogW3N0cmluZywgc3RyaW5nLCBzdHJpbmddKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhpbnQsIDApKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1sxXTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnQgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1syXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uc1swXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWxwaGFiZXRpY0lkKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGEgPCBiKVxuICAgICAgICAgICAgcmV0dXJuIGEgKyAnXycgKyBiO1xuICAgICAgICByZXR1cm4gYiArICdfJyArIGE7XG4gICAgfVxufSIsImltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFZlY3RvciB7XG4gICAgc3RhdGljIFVOSVQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgLTEpO1xuICAgIHN0YXRpYyBOVUxMOiBWZWN0b3IgPSBuZXcgVmVjdG9yKDAsIDApO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIGdldCB4KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cblxuICAgIGdldCB5KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsIDIpICsgTWF0aC5wb3codGhpcy55LCAyKSk7XG4gICAgfVxuXG4gICAgd2l0aExlbmd0aChsZW5ndGg6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gdGhpcy5sZW5ndGggIT0gMCA/IGxlbmd0aC90aGlzLmxlbmd0aCA6IDA7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCpyYXRpbywgdGhpcy55KnJhdGlvKTtcbiAgICB9XG5cbiAgICBhZGQodGhhdCA6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCArIHRoYXQueCwgdGhpcy55ICsgdGhhdC55KTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGF0LnggLSB0aGlzLngsIHRoYXQueSAtIHRoaXMueSk7XG4gICAgfVxuXG4gICAgcm90YXRlKHRoZXRhOiBSb3RhdGlvbik6IFZlY3RvciB7XG4gICAgICAgIGxldCByYWQ6IG51bWJlciA9IHRoZXRhLnJhZGlhbnM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCAqIE1hdGguY29zKHJhZCkgLSB0aGlzLnkgKiBNYXRoLnNpbihyYWQpLCB0aGlzLnggKiBNYXRoLnNpbihyYWQpICsgdGhpcy55ICogTWF0aC5jb3MocmFkKSk7XG4gICAgfVxuXG4gICAgZG90UHJvZHVjdCh0aGF0OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54KnRoYXQueCt0aGlzLnkqdGhhdC55O1xuICAgIH1cblxuICAgIHNvbHZlRGVsdGFGb3JJbnRlcnNlY3Rpb24oZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiB7YTogbnVtYmVyLCBiOiBudW1iZXJ9IHtcbiAgICAgICAgY29uc3QgZGVsdGE6IFZlY3RvciA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHN3YXBaZXJvRGl2aXNpb24gPSBVdGlscy5lcXVhbHMoZGlyMi55LCAwKTtcbiAgICAgICAgY29uc3QgeCA9IHN3YXBaZXJvRGl2aXNpb24gPyAneScgOiAneCc7XG4gICAgICAgIGNvbnN0IHkgPSBzd2FwWmVyb0RpdmlzaW9uID8gJ3gnIDogJ3knO1xuICAgICAgICBjb25zdCBkZW5vbWluYXRvciA9IChkaXIxW3ldKmRpcjJbeF0tZGlyMVt4XSpkaXIyW3ldKTtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhkZW5vbWluYXRvciwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7YTogTmFOLCBiOiBOYU59O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGEgPSAoZGVsdGFbeV0qZGlyMlt4XS1kZWx0YVt4XSpkaXIyW3ldKS9kZW5vbWluYXRvcjtcbiAgICAgICAgY29uc3QgYiA9IChhKmRpcjFbeV0tZGVsdGFbeV0pL2RpcjJbeV07XG4gICAgICAgIHJldHVybiB7YSwgYn07XG4gICAgfVxuXG4gICAgaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwoZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsRXF1YWxaZXJvKHRoaXMueCwgZGlyMS54LCBkaXIyLngpIHx8IHRoaXMuYWxsRXF1YWxaZXJvKHRoaXMueSwgZGlyMS55LCBkaXIyLnkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWxsRXF1YWxaZXJvKG4xOiBudW1iZXIsIG4yOiBudW1iZXIsIG4zOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmVxdWFscyhuMSwgMCkgJiYgVXRpbHMuZXF1YWxzKG4yLCAwKSAmJiBVdGlscy5lcXVhbHMobjMsIDApO1xuICAgIH1cblxuICAgIGluY2xpbmF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh0aGlzLngsIDApKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbih0aGlzLnkgPiAwID8gMTgwIDogMCk7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy55LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy54ID4gMCA/IDkwIDogLTkwKTtcbiAgICAgICAgY29uc3QgYWRqYWNlbnQgPSBuZXcgVmVjdG9yKDAsLU1hdGguYWJzKHRoaXMueSkpO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKE1hdGguc2lnbih0aGlzLngpKk1hdGguYWNvcyh0aGlzLmRvdFByb2R1Y3QoYWRqYWNlbnQpL2FkamFjZW50Lmxlbmd0aC90aGlzLmxlbmd0aCkqMTgwL01hdGguUEkpO1xuICAgIH1cblxuICAgIGFuZ2xlKG90aGVyOiBWZWN0b3IpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmluY2xpbmF0aW9uKCkuZGVsdGEob3RoZXIuaW5jbGluYXRpb24oKSk7XG4gICAgfVxuXG4gICAgYm90aEF4aXNNaW5zKG90aGVyOiBWZWN0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gb3RoZXI7XG4gICAgICAgIGlmIChvdGhlciA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggPCBvdGhlci54ID8gdGhpcy54IDogb3RoZXIueCwgdGhpcy55IDwgb3RoZXIueSA/IHRoaXMueSA6IG90aGVyLnkpXG4gICAgfVxuXG4gICAgYm90aEF4aXNNYXhzKG90aGVyOiBWZWN0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gb3RoZXI7XG4gICAgICAgIGlmIChvdGhlciA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggPiBvdGhlci54ID8gdGhpcy54IDogb3RoZXIueCwgdGhpcy55ID4gb3RoZXIueSA/IHRoaXMueSA6IG90aGVyLnkpXG4gICAgfVxuXG4gICAgYmV0d2VlbihvdGhlcjogVmVjdG9yLCB4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLmRlbHRhKG90aGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGRlbHRhLndpdGhMZW5ndGgoZGVsdGEubGVuZ3RoKngpKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuXG5cblxuZXhwb3J0IGNsYXNzIFpvb21lciB7XG4gICAgc3RhdGljIFpPT01fRFVSQVRJT04gPSAxO1xuICAgIHN0YXRpYyBaT09NX01BWF9TQ0FMRSA9IDM7XG4gICAgc3RhdGljIFBBRERJTkdfRkFDVE9SID0gMjU7XG4gICAgXG4gICAgcHJpdmF0ZSBib3VuZGluZ0JveCA9IHt0bDogVmVjdG9yLk5VTEwsIGJyOiBWZWN0b3IuTlVMTH07XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXNTaXplOiBWZWN0b3IpIHtcblxuICAgIH1cblxuICAgIGluY2x1ZGUoYm91bmRpbmdCb3g6IHsgdGw6IFZlY3RvciwgYnI6IFZlY3RvciB9LCBub3c6IEluc3RhbnQsIHNob3VsZEFuaW1hdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHNob3VsZEFuaW1hdGUgJiYgbm93LmZsYWcgIT0gJ25vem9vbScpIHtcbiAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3gudGwgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJvdGhBeGlzTWlucyhib3VuZGluZ0JveC50bCk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LmJyID0gdGhpcy5ib3VuZGluZ0JveC5ici5ib3RoQXhpc01heHMoYm91bmRpbmdCb3guYnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbmZvcmNlZEJvdW5kaW5nQm94KCk6IHt0bDogVmVjdG9yLCBicjogVmVjdG9yfSB7XG4gICAgICAgIGlmICh0aGlzLmJvdW5kaW5nQm94LnRsICE9IFZlY3Rvci5OVUxMICYmIHRoaXMuYm91bmRpbmdCb3guYnIgIT0gVmVjdG9yLk5VTEwpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZGRlZEJvdW5kaW5nQm94ID0gdGhpcy5wYWRkZWRCb3VuZGluZ0JveCgpO1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBwYWRkZWRCb3VuZGluZ0JveC50bC5kZWx0YShwYWRkZWRCb3VuZGluZ0JveC5icik7XG4gICAgICAgICAgICBjb25zdCBtaW5ab29tU2l6ZSA9IG5ldyBWZWN0b3IodGhpcy5jYW52YXNTaXplLnggLyBab29tZXIuWk9PTV9NQVhfU0NBTEUsIHRoaXMuY2FudmFzU2l6ZS55IC8gWm9vbWVyLlpPT01fTUFYX1NDQUxFKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gem9vbVNpemUuZGVsdGEobWluWm9vbVNpemUpO1xuICAgICAgICAgICAgY29uc3QgYWRkaXRpb25hbFNwYWNpbmcgPSBuZXcgVmVjdG9yKE1hdGgubWF4KDAsIGRlbHRhLngvMiksIE1hdGgubWF4KDAsIGRlbHRhLnkvMikpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRsOiBwYWRkZWRCb3VuZGluZ0JveC50bC5hZGQoYWRkaXRpb25hbFNwYWNpbmcucm90YXRlKG5ldyBSb3RhdGlvbigxODApKSksXG4gICAgICAgICAgICAgICAgYnI6IHBhZGRlZEJvdW5kaW5nQm94LmJyLmFkZChhZGRpdGlvbmFsU3BhY2luZylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmRpbmdCb3g7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYWRkZWRCb3VuZGluZ0JveCgpOiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn0ge1xuICAgICAgICBjb25zdCBwYWRkaW5nID0gKHRoaXMuY2FudmFzU2l6ZS54ICsgdGhpcy5jYW52YXNTaXplLnkpL1pvb21lci5QQURESU5HX0ZBQ1RPUjtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRsOiB0aGlzLmJvdW5kaW5nQm94LnRsLmFkZChuZXcgVmVjdG9yKC1wYWRkaW5nLCAtcGFkZGluZykpLFxuICAgICAgICAgICAgYnI6IHRoaXMuYm91bmRpbmdCb3guYnIuYWRkKG5ldyBWZWN0b3IocGFkZGluZywgcGFkZGluZykpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IGNlbnRlcigpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBlbmZvcmNlZEJvdW5kaW5nQm94ID0gdGhpcy5lbmZvcmNlZEJvdW5kaW5nQm94KCk7XG4gICAgICAgIGlmIChlbmZvcmNlZEJvdW5kaW5nQm94LnRsICE9IFZlY3Rvci5OVUxMICYmIGVuZm9yY2VkQm91bmRpbmdCb3guYnIgIT0gVmVjdG9yLk5VTEwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueCArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueCkvMiksIFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueSArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueSkvMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMuY2FudmFzU2l6ZS54IC8gMiwgdGhpcy5jYW52YXNTaXplLnkgLyAyKTs7XG4gICAgfVxuXG4gICAgZ2V0IHNjYWxlKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKGVuZm9yY2VkQm91bmRpbmdCb3gudGwgIT0gVmVjdG9yLk5VTEwgJiYgZW5mb3JjZWRCb3VuZGluZ0JveC5iciAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBlbmZvcmNlZEJvdW5kaW5nQm94LnRsLmRlbHRhKGVuZm9yY2VkQm91bmRpbmdCb3guYnIpO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMuY2FudmFzU2l6ZS54IC8gem9vbVNpemUueCwgdGhpcy5jYW52YXNTaXplLnkgLyB6b29tU2l6ZS55KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5cbi8vIFRPRE86IGVyYXNlIGFuaW0sIGxhYmVscywgbmVnYXRpdmUgZGVmYXVsdCB0cmFja3MgYmFzZWQgb24gZGlyZWN0aW9uLCByZWpvaW4gbGluZXMgdHJhY2sgc2VsZWN0aW9uXG5cbmNvbnN0IG5ldHdvcms6IE5ldHdvcmsgPSBuZXcgTmV0d29yayhuZXcgU3ZnTmV0d29yaygpKTtcbm5ldHdvcmsuaW5pdGlhbGl6ZSgpO1xuXG5jb25zdCBhbmltYXRlRnJvbUVwb2NoOiBudW1iZXIgPSBnZXRTdGFydEVwb2NoKCk7XG5zbGlkZShJbnN0YW50LkJJR19CQU5HLCBmYWxzZSk7XG5cbmZ1bmN0aW9uIGdldFN0YXJ0RXBvY2goKTogbnVtYmVyIHtcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaGFzaCAmJiBuZXR3b3JrLmlzRXBvY2hFeGlzdGluZyh3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpKSkge1xuICAgICAgICBjb25zdCBhbmltYXRlRnJvbUVwb2NoOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgICBjb25zb2xlLmxvZygnZmFzdCBmb3J3YXJkIHRvICcgKyBhbmltYXRlRnJvbUVwb2NoKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGFuaW1hdGVGcm9tRXBvY2gpIHx8IDA7XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBzbGlkZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGluc3RhbnQuZXBvY2ggPT0gYW5pbWF0ZUZyb21FcG9jaClcbiAgICAgICAgYW5pbWF0ZSA9IHRydWU7XG5cbiAgICBuZXR3b3JrLmRyYXdUaW1lZERyYXdhYmxlc0F0KGluc3RhbnQsIGFuaW1hdGUpO1xuICAgIGNvbnN0IG5leHQgPSBuZXR3b3JrLm5leHRJbnN0YW50KGluc3RhbnQpO1xuICAgIFxuICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gYW5pbWF0ZSA/IGluc3RhbnQuZGVsdGEobmV4dCkgOiAwO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2xpZGUobmV4dCwgYW5pbWF0ZSk7IH0sIGRlbGF5ICogMTAwMCk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==