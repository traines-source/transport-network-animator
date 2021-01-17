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
        this.averageEuclidianLengthRatio = -1;
        this.edges = {};
        this.vertices = {};
    }
    gravitate(delay, animate) {
        this.initialize();
        this.obtainStations();
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
            sum += this.euclidianDistance(edge);
        }
        return sum;
    }
    euclidianDistance(edge) {
        return this.vertices[edge.termini[0].stationId].station.baseCoords.delta(this.vertices[edge.termini[1].stationId].station.baseCoords).length;
    }
    obtainStations() {
        for (const [key, edge] of Object.entries(this.edges)) {
            if (this.initialWeightFactors[key] == undefined) {
                this.initialWeightFactors[key] = Gravitator.INITIALIZE_RELATIVE_TO_EUCLIDIAN_DISTANCE
                    ? 1 / this.averageEuclidianLengthRatio
                    : this.euclidianDistance(edge) / (edge.weight || 0);
            }
        }
        let i = 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.index = new _Vector__WEBPACK_IMPORTED_MODULE_0__["Vector"](i, i + 1);
            i += 2;
        }
    }
    minimizeLoss() {
        const gravitator = this;
        const params = { history: [] };
        const start = this.startStationPositions();
        const solution = fmin.conjugateGradient((A, fxprime) => {
            fxprime = fxprime || A.slice();
            let fx = 0;
            fx = this.deltaToStartStationPositionsToEnsureInertness(fx, A, fxprime, gravitator);
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
            fxprime[vertex.index.x] = 2 * (A[vertex.index.x] - vertex.startCoords.x) * Gravitator.INERTNESS;
            fxprime[vertex.index.y] = 2 * (A[vertex.index.y] - vertex.startCoords.y) * Gravitator.INERTNESS;
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
        return new _Rotation__WEBPACK_IMPORTED_MODULE_0__["Rotation"]((Math.sign(this.x) * Math.acos(this.dotProduct(adjacent) / adjacent.length / this.length) * 180 / Math.PI));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZtaW4vYnVpbGQvZm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvR3Jhdml0YXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW5zdGFudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTGFiZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmVHcm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJlZmVycmVkVHJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JvdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9TdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdMYWJlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ZnTGluZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ZnTmV0d29yay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ZnU3RhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvWm9vbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtR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ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4udHNcIik7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAgIChmYWN0b3J5KChnbG9iYWwuZm1pbiA9IGdsb2JhbC5mbWluIHx8IHt9KSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgICAvKiogZmluZHMgdGhlIHplcm9zIG9mIGEgZnVuY3Rpb24sIGdpdmVuIHR3byBzdGFydGluZyBwb2ludHMgKHdoaWNoIG11c3RcbiAgICAgKiBoYXZlIG9wcG9zaXRlIHNpZ25zICovXG4gICAgZnVuY3Rpb24gYmlzZWN0KGYsIGEsIGIsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgfHwge307XG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1ldGVycy5tYXhJdGVyYXRpb25zIHx8IDEwMCxcbiAgICAgICAgICAgIHRvbGVyYW5jZSA9IHBhcmFtZXRlcnMudG9sZXJhbmNlIHx8IDFlLTEwLFxuICAgICAgICAgICAgZkEgPSBmKGEpLFxuICAgICAgICAgICAgZkIgPSBmKGIpLFxuICAgICAgICAgICAgZGVsdGEgPSBiIC0gYTtcblxuICAgICAgICBpZiAoZkEgKiBmQiA+IDApIHtcbiAgICAgICAgICAgIHRocm93IFwiSW5pdGlhbCBiaXNlY3QgcG9pbnRzIG11c3QgaGF2ZSBvcHBvc2l0ZSBzaWduc1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZBID09PSAwKSByZXR1cm4gYTtcbiAgICAgICAgaWYgKGZCID09PSAwKSByZXR1cm4gYjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgZGVsdGEgLz0gMjtcbiAgICAgICAgICAgIHZhciBtaWQgPSBhICsgZGVsdGEsXG4gICAgICAgICAgICAgICAgZk1pZCA9IGYobWlkKTtcblxuICAgICAgICAgICAgaWYgKGZNaWQgKiBmQSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYSA9IG1pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChNYXRoLmFicyhkZWx0YSkgPCB0b2xlcmFuY2UpIHx8IChmTWlkID09PSAwKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGEgKyBkZWx0YTtcbiAgICB9XG5cbiAgICAvLyBuZWVkIHNvbWUgYmFzaWMgb3BlcmF0aW9ucyBvbiB2ZWN0b3JzLCByYXRoZXIgdGhhbiBhZGRpbmcgYSBkZXBlbmRlbmN5LFxuICAgIC8vIGp1c3QgZGVmaW5lIGhlcmVcbiAgICBmdW5jdGlvbiB6ZXJvcyh4KSB7IHZhciByID0gbmV3IEFycmF5KHgpOyBmb3IgKHZhciBpID0gMDsgaSA8IHg7ICsraSkgeyByW2ldID0gMDsgfSByZXR1cm4gcjsgfVxuICAgIGZ1bmN0aW9uIHplcm9zTSh4LHkpIHsgcmV0dXJuIHplcm9zKHgpLm1hcChmdW5jdGlvbigpIHsgcmV0dXJuIHplcm9zKHkpOyB9KTsgfVxuXG4gICAgZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgICAgICAgdmFyIHJldCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmV0ICs9IGFbaV0gKiBiW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybTIoYSkgIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkb3QoYSwgYSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlKHJldCwgdmFsdWUsIGMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmV0W2ldID0gdmFsdWVbaV0gKiBjO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2VpZ2h0ZWRTdW0ocmV0LCB3MSwgdjEsIHcyLCB2Mikge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJldC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgcmV0W2pdID0gdzEgKiB2MVtqXSArIHcyICogdjJbal07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogbWluaW1pemVzIGEgZnVuY3Rpb24gdXNpbmcgdGhlIGRvd25oaWxsIHNpbXBsZXggbWV0aG9kICovXG4gICAgZnVuY3Rpb24gbmVsZGVyTWVhZChmLCB4MCwgcGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCB7fTtcblxuICAgICAgICB2YXIgbWF4SXRlcmF0aW9ucyA9IHBhcmFtZXRlcnMubWF4SXRlcmF0aW9ucyB8fCB4MC5sZW5ndGggKiAyMDAsXG4gICAgICAgICAgICBub25aZXJvRGVsdGEgPSBwYXJhbWV0ZXJzLm5vblplcm9EZWx0YSB8fCAxLjA1LFxuICAgICAgICAgICAgemVyb0RlbHRhID0gcGFyYW1ldGVycy56ZXJvRGVsdGEgfHwgMC4wMDEsXG4gICAgICAgICAgICBtaW5FcnJvckRlbHRhID0gcGFyYW1ldGVycy5taW5FcnJvckRlbHRhIHx8IDFlLTYsXG4gICAgICAgICAgICBtaW5Ub2xlcmFuY2UgPSBwYXJhbWV0ZXJzLm1pbkVycm9yRGVsdGEgfHwgMWUtNSxcbiAgICAgICAgICAgIHJobyA9IChwYXJhbWV0ZXJzLnJobyAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMucmhvIDogMSxcbiAgICAgICAgICAgIGNoaSA9IChwYXJhbWV0ZXJzLmNoaSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMuY2hpIDogMixcbiAgICAgICAgICAgIHBzaSA9IChwYXJhbWV0ZXJzLnBzaSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtZXRlcnMucHNpIDogLTAuNSxcbiAgICAgICAgICAgIHNpZ21hID0gKHBhcmFtZXRlcnMuc2lnbWEgIT09IHVuZGVmaW5lZCkgPyBwYXJhbWV0ZXJzLnNpZ21hIDogMC41LFxuICAgICAgICAgICAgbWF4RGlmZjtcblxuICAgICAgICAvLyBpbml0aWFsaXplIHNpbXBsZXguXG4gICAgICAgIHZhciBOID0geDAubGVuZ3RoLFxuICAgICAgICAgICAgc2ltcGxleCA9IG5ldyBBcnJheShOICsgMSk7XG4gICAgICAgIHNpbXBsZXhbMF0gPSB4MDtcbiAgICAgICAgc2ltcGxleFswXS5meCA9IGYoeDApO1xuICAgICAgICBzaW1wbGV4WzBdLmlkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IHgwLnNsaWNlKCk7XG4gICAgICAgICAgICBwb2ludFtpXSA9IHBvaW50W2ldID8gcG9pbnRbaV0gKiBub25aZXJvRGVsdGEgOiB6ZXJvRGVsdGE7XG4gICAgICAgICAgICBzaW1wbGV4W2krMV0gPSBwb2ludDtcbiAgICAgICAgICAgIHNpbXBsZXhbaSsxXS5meCA9IGYocG9pbnQpO1xuICAgICAgICAgICAgc2ltcGxleFtpKzFdLmlkID0gaSsxO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlU2ltcGxleCh2YWx1ZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNpbXBsZXhbTl1baV0gPSB2YWx1ZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNpbXBsZXhbTl0uZnggPSB2YWx1ZS5meDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzb3J0T3JkZXIgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLmZ4IC0gYi5meDsgfTtcblxuICAgICAgICB2YXIgY2VudHJvaWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgcmVmbGVjdGVkID0geDAuc2xpY2UoKSxcbiAgICAgICAgICAgIGNvbnRyYWN0ZWQgPSB4MC5zbGljZSgpLFxuICAgICAgICAgICAgZXhwYW5kZWQgPSB4MC5zbGljZSgpO1xuXG4gICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IG1heEl0ZXJhdGlvbnM7ICsraXRlcmF0aW9uKSB7XG4gICAgICAgICAgICBzaW1wbGV4LnNvcnQoc29ydE9yZGVyKTtcblxuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIC8vIGNvcHkgdGhlIHNpbXBsZXggKHNpbmNlIGxhdGVyIGl0ZXJhdGlvbnMgd2lsbCBtdXRhdGUpIGFuZFxuICAgICAgICAgICAgICAgIC8vIHNvcnQgaXQgdG8gaGF2ZSBhIGNvbnNpc3RlbnQgb3JkZXIgYmV0d2VlbiBpdGVyYXRpb25zXG4gICAgICAgICAgICAgICAgdmFyIHNvcnRlZFNpbXBsZXggPSBzaW1wbGV4Lm1hcChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSB4LnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmZ4ID0geC5meDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaWQgPSB4LmlkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc29ydGVkU2ltcGxleC5zb3J0KGZ1bmN0aW9uKGEsYikgeyByZXR1cm4gYS5pZCAtIGIuaWQ7IH0pO1xuXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5oaXN0b3J5LnB1c2goe3g6IHNpbXBsZXhbMF0uc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZng6IHNpbXBsZXhbMF0uZngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZXg6IHNvcnRlZFNpbXBsZXh9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF4RGlmZiA9IDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbWF4RGlmZiA9IE1hdGgubWF4KG1heERpZmYsIE1hdGguYWJzKHNpbXBsZXhbMF1baV0gLSBzaW1wbGV4WzFdW2ldKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoTWF0aC5hYnMoc2ltcGxleFswXS5meCAtIHNpbXBsZXhbTl0uZngpIDwgbWluRXJyb3JEZWx0YSkgJiZcbiAgICAgICAgICAgICAgICAobWF4RGlmZiA8IG1pblRvbGVyYW5jZSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29tcHV0ZSB0aGUgY2VudHJvaWQgb2YgYWxsIGJ1dCB0aGUgd29yc3QgcG9pbnQgaW4gdGhlIHNpbXBsZXhcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBOOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjZW50cm9pZFtpXSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgY2VudHJvaWRbaV0gKz0gc2ltcGxleFtqXVtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2VudHJvaWRbaV0gLz0gTjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVmbGVjdCB0aGUgd29yc3QgcG9pbnQgcGFzdCB0aGUgY2VudHJvaWQgIGFuZCBjb21wdXRlIGxvc3MgYXQgcmVmbGVjdGVkXG4gICAgICAgICAgICAvLyBwb2ludFxuICAgICAgICAgICAgdmFyIHdvcnN0ID0gc2ltcGxleFtOXTtcbiAgICAgICAgICAgIHdlaWdodGVkU3VtKHJlZmxlY3RlZCwgMStyaG8sIGNlbnRyb2lkLCAtcmhvLCB3b3JzdCk7XG4gICAgICAgICAgICByZWZsZWN0ZWQuZnggPSBmKHJlZmxlY3RlZCk7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWZsZWN0ZWQgcG9pbnQgaXMgdGhlIGJlc3Qgc2VlbiwgdGhlbiBwb3NzaWJseSBleHBhbmRcbiAgICAgICAgICAgIGlmIChyZWZsZWN0ZWQuZnggPCBzaW1wbGV4WzBdLmZ4KSB7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oZXhwYW5kZWQsIDErY2hpLCBjZW50cm9pZCwgLWNoaSwgd29yc3QpO1xuICAgICAgICAgICAgICAgIGV4cGFuZGVkLmZ4ID0gZihleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgaWYgKGV4cGFuZGVkLmZ4IDwgcmVmbGVjdGVkLmZ4KSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgoZXhwYW5kZWQpO1xuICAgICAgICAgICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVTaW1wbGV4KHJlZmxlY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGUgcmVmbGVjdGVkIHBvaW50IGlzIHdvcnNlIHRoYW4gdGhlIHNlY29uZCB3b3JzdCwgd2UgbmVlZCB0b1xuICAgICAgICAgICAgLy8gY29udHJhY3RcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlZmxlY3RlZC5meCA+PSBzaW1wbGV4W04tMV0uZngpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2hvdWxkUmVkdWNlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVmbGVjdGVkLmZ4ID4gd29yc3QuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gYW4gaW5zaWRlIGNvbnRyYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKGNvbnRyYWN0ZWQsIDErcHNpLCBjZW50cm9pZCwgLXBzaSwgd29yc3QpO1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdGVkLmZ4ID0gZihjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyYWN0ZWQuZnggPCB3b3JzdC5meCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFJlZHVjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhbiBvdXRzaWRlIGNvbnRyYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodGVkU3VtKGNvbnRyYWN0ZWQsIDEtcHNpICogcmhvLCBjZW50cm9pZCwgcHNpKnJobywgd29yc3QpO1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdGVkLmZ4ID0gZihjb250cmFjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyYWN0ZWQuZnggPCByZWZsZWN0ZWQuZngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNpbXBsZXgoY29udHJhY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRSZWR1Y2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFJlZHVjZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBkb24ndCBjb250cmFjdCBoZXJlLCB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWdtYSA+PSAxKSBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBkbyBhIHJlZHVjdGlvblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgc2ltcGxleC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ZWRTdW0oc2ltcGxleFtpXSwgMSAtIHNpZ21hLCBzaW1wbGV4WzBdLCBzaWdtYSwgc2ltcGxleFtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGV4W2ldLmZ4ID0gZihzaW1wbGV4W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlU2ltcGxleChyZWZsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2ltcGxleC5zb3J0KHNvcnRPcmRlcik7XG4gICAgICAgIHJldHVybiB7ZnggOiBzaW1wbGV4WzBdLmZ4LFxuICAgICAgICAgICAgICAgIHggOiBzaW1wbGV4WzBdfTtcbiAgICB9XG5cbiAgICAvLy8gc2VhcmNoZXMgYWxvbmcgbGluZSAncGsnIGZvciBhIHBvaW50IHRoYXQgc2F0aWZpZXMgdGhlIHdvbGZlIGNvbmRpdGlvbnNcbiAgICAvLy8gU2VlICdOdW1lcmljYWwgT3B0aW1pemF0aW9uJyBieSBOb2NlZGFsIGFuZCBXcmlnaHQgcDU5LTYwXG4gICAgLy8vIGYgOiBvYmplY3RpdmUgZnVuY3Rpb25cbiAgICAvLy8gcGsgOiBzZWFyY2ggZGlyZWN0aW9uXG4gICAgLy8vIGN1cnJlbnQ6IG9iamVjdCBjb250YWluaW5nIGN1cnJlbnQgZ3JhZGllbnQvbG9zc1xuICAgIC8vLyBuZXh0OiBvdXRwdXQ6IGNvbnRhaW5zIG5leHQgZ3JhZGllbnQvbG9zc1xuICAgIC8vLyByZXR1cm5zIGE6IHN0ZXAgc2l6ZSB0YWtlblxuICAgIGZ1bmN0aW9uIHdvbGZlTGluZVNlYXJjaChmLCBwaywgY3VycmVudCwgbmV4dCwgYSwgYzEsIGMyKSB7XG4gICAgICAgIHZhciBwaGkwID0gY3VycmVudC5meCwgcGhpUHJpbWUwID0gZG90KGN1cnJlbnQuZnhwcmltZSwgcGspLFxuICAgICAgICAgICAgcGhpID0gcGhpMCwgcGhpX29sZCA9IHBoaTAsXG4gICAgICAgICAgICBwaGlQcmltZSA9IHBoaVByaW1lMCxcbiAgICAgICAgICAgIGEwID0gMDtcblxuICAgICAgICBhID0gYSB8fCAxO1xuICAgICAgICBjMSA9IGMxIHx8IDFlLTY7XG4gICAgICAgIGMyID0gYzIgfHwgMC4xO1xuXG4gICAgICAgIGZ1bmN0aW9uIHpvb20oYV9sbywgYV9oaWdoLCBwaGlfbG8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IDE2OyArK2l0ZXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGEgPSAoYV9sbyArIGFfaGlnaCkvMjtcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShuZXh0LngsIDEuMCwgY3VycmVudC54LCBhLCBwayk7XG4gICAgICAgICAgICAgICAgcGhpID0gbmV4dC5meCA9IGYobmV4dC54LCBuZXh0LmZ4cHJpbWUpO1xuICAgICAgICAgICAgICAgIHBoaVByaW1lID0gZG90KG5leHQuZnhwcmltZSwgcGspO1xuXG4gICAgICAgICAgICAgICAgaWYgKChwaGkgPiAocGhpMCArIGMxICogYSAqIHBoaVByaW1lMCkpIHx8XG4gICAgICAgICAgICAgICAgICAgIChwaGkgPj0gcGhpX2xvKSkge1xuICAgICAgICAgICAgICAgICAgICBhX2hpZ2ggPSBhO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhwaGlQcmltZSkgPD0gLWMyICogcGhpUHJpbWUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwaGlQcmltZSAqIChhX2hpZ2ggLSBhX2xvKSA+PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFfaGlnaCA9IGFfbG87XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhX2xvID0gYTtcbiAgICAgICAgICAgICAgICAgICAgcGhpX2xvID0gcGhpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCAxMDsgKytpdGVyYXRpb24pIHtcbiAgICAgICAgICAgIHdlaWdodGVkU3VtKG5leHQueCwgMS4wLCBjdXJyZW50LngsIGEsIHBrKTtcbiAgICAgICAgICAgIHBoaSA9IG5leHQuZnggPSBmKG5leHQueCwgbmV4dC5meHByaW1lKTtcbiAgICAgICAgICAgIHBoaVByaW1lID0gZG90KG5leHQuZnhwcmltZSwgcGspO1xuICAgICAgICAgICAgaWYgKChwaGkgPiAocGhpMCArIGMxICogYSAqIHBoaVByaW1lMCkpIHx8XG4gICAgICAgICAgICAgICAgKGl0ZXJhdGlvbiAmJiAocGhpID49IHBoaV9vbGQpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6b29tKGEwLCBhLCBwaGlfb2xkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHBoaVByaW1lKSA8PSAtYzIgKiBwaGlQcmltZTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBoaVByaW1lID49IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb20oYSwgYTAsIHBoaSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBoaV9vbGQgPSBwaGk7XG4gICAgICAgICAgICBhMCA9IGE7XG4gICAgICAgICAgICBhICo9IDI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25qdWdhdGVHcmFkaWVudChmLCBpbml0aWFsLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gYWxsb2NhdGUgYWxsIG1lbW9yeSB1cCBmcm9udCBoZXJlLCBrZWVwIG91dCBvZiB0aGUgbG9vcCBmb3IgcGVyZm9tYW5jZVxuICAgICAgICAvLyByZWFzb25zXG4gICAgICAgIHZhciBjdXJyZW50ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICBuZXh0ID0ge3g6IGluaXRpYWwuc2xpY2UoKSwgZng6IDAsIGZ4cHJpbWU6IGluaXRpYWwuc2xpY2UoKX0sXG4gICAgICAgICAgICB5ayA9IGluaXRpYWwuc2xpY2UoKSxcbiAgICAgICAgICAgIHBrLCB0ZW1wLFxuICAgICAgICAgICAgYSA9IDEsXG4gICAgICAgICAgICBtYXhJdGVyYXRpb25zO1xuXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgbWF4SXRlcmF0aW9ucyA9IHBhcmFtcy5tYXhJdGVyYXRpb25zIHx8IGluaXRpYWwubGVuZ3RoICogMjA7XG5cbiAgICAgICAgY3VycmVudC5meCA9IGYoY3VycmVudC54LCBjdXJyZW50LmZ4cHJpbWUpO1xuICAgICAgICBwayA9IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpO1xuICAgICAgICBzY2FsZShwaywgY3VycmVudC5meHByaW1lLC0xKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEl0ZXJhdGlvbnM7ICsraSkge1xuICAgICAgICAgICAgYSA9IHdvbGZlTGluZVNlYXJjaChmLCBwaywgY3VycmVudCwgbmV4dCwgYSk7XG5cbiAgICAgICAgICAgIC8vIHRvZG86IGhpc3RvcnkgaW4gd3Jvbmcgc3BvdD9cbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5oaXN0b3J5LnB1c2goe3g6IGN1cnJlbnQueC5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4cHJpbWU6IGN1cnJlbnQuZnhwcmltZS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBhfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYSkge1xuICAgICAgICAgICAgICAgIC8vIGZhaWlsZWQgdG8gZmluZCBwb2ludCB0aGF0IHNhdGlmaWVzIHdvbGZlIGNvbmRpdGlvbnMuXG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgZGlyZWN0aW9uIGZvciBuZXh0IGl0ZXJhdGlvblxuICAgICAgICAgICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsIC0xKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZGlyZWN0aW9uIHVzaW5nIFBvbGFr4oCTUmliaWVyZSBDRyBtZXRob2RcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bSh5aywgMSwgbmV4dC5meHByaW1lLCAtMSwgY3VycmVudC5meHByaW1lKTtcblxuICAgICAgICAgICAgICAgIHZhciBkZWx0YV9rID0gZG90KGN1cnJlbnQuZnhwcmltZSwgY3VycmVudC5meHByaW1lKSxcbiAgICAgICAgICAgICAgICAgICAgYmV0YV9rID0gTWF0aC5tYXgoMCwgZG90KHlrLCBuZXh0LmZ4cHJpbWUpIC8gZGVsdGFfayk7XG5cbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bShwaywgYmV0YV9rLCBwaywgLTEsIG5leHQuZnhwcmltZSk7XG5cbiAgICAgICAgICAgICAgICB0ZW1wID0gY3VycmVudDtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgICAgICAgICAgICBuZXh0ID0gdGVtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPD0gMWUtNSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ4OiBjdXJyZW50LmZ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnhwcmltZTogY3VycmVudC5meHByaW1lLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHBoYTogYX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3JhZGllbnREZXNjZW50KGYsIGluaXRpYWwsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIHZhciBtYXhJdGVyYXRpb25zID0gcGFyYW1zLm1heEl0ZXJhdGlvbnMgfHwgaW5pdGlhbC5sZW5ndGggKiAxMDAsXG4gICAgICAgICAgICBsZWFyblJhdGUgPSBwYXJhbXMubGVhcm5SYXRlIHx8IDAuMDAxLFxuICAgICAgICAgICAgY3VycmVudCA9IHt4OiBpbml0aWFsLnNsaWNlKCksIGZ4OiAwLCBmeHByaW1lOiBpbml0aWFsLnNsaWNlKCl9O1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SXRlcmF0aW9uczsgKytpKSB7XG4gICAgICAgICAgICBjdXJyZW50LmZ4ID0gZihjdXJyZW50LngsIGN1cnJlbnQuZnhwcmltZSk7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ZWlnaHRlZFN1bShjdXJyZW50LngsIDEsIGN1cnJlbnQueCwgLWxlYXJuUmF0ZSwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgICAgIGlmIChub3JtMihjdXJyZW50LmZ4cHJpbWUpIDw9IDFlLTUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdyYWRpZW50RGVzY2VudExpbmVTZWFyY2goZiwgaW5pdGlhbCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG5leHQgPSB7eDogaW5pdGlhbC5zbGljZSgpLCBmeDogMCwgZnhwcmltZTogaW5pdGlhbC5zbGljZSgpfSxcbiAgICAgICAgICAgIG1heEl0ZXJhdGlvbnMgPSBwYXJhbXMubWF4SXRlcmF0aW9ucyB8fCBpbml0aWFsLmxlbmd0aCAqIDEwMCxcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHBhcmFtcy5sZWFyblJhdGUgfHwgMSxcbiAgICAgICAgICAgIHBrID0gaW5pdGlhbC5zbGljZSgpLFxuICAgICAgICAgICAgYzEgPSBwYXJhbXMuYzEgfHwgMWUtMyxcbiAgICAgICAgICAgIGMyID0gcGFyYW1zLmMyIHx8IDAuMSxcbiAgICAgICAgICAgIHRlbXAsXG4gICAgICAgICAgICBmdW5jdGlvbkNhbGxzID0gW107XG5cbiAgICAgICAgaWYgKHBhcmFtcy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAvLyB3cmFwIHRoZSBmdW5jdGlvbiBjYWxsIHRvIHRyYWNrIGxpbmVzZWFyY2ggc2FtcGxlc1xuICAgICAgICAgICAgdmFyIGlubmVyID0gZjtcbiAgICAgICAgICAgIGYgPSBmdW5jdGlvbih4LCBmeHByaW1lKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25DYWxscy5wdXNoKHguc2xpY2UoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlubmVyKHgsIGZ4cHJpbWUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnQuZnggPSBmKGN1cnJlbnQueCwgY3VycmVudC5meHByaW1lKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhJdGVyYXRpb25zOyArK2kpIHtcbiAgICAgICAgICAgIHNjYWxlKHBrLCBjdXJyZW50LmZ4cHJpbWUsIC0xKTtcbiAgICAgICAgICAgIGxlYXJuUmF0ZSA9IHdvbGZlTGluZVNlYXJjaChmLCBwaywgY3VycmVudCwgbmV4dCwgbGVhcm5SYXRlLCBjMSwgYzIpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMuaGlzdG9yeS5wdXNoKHt4OiBjdXJyZW50Lnguc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeDogY3VycmVudC5meCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeHByaW1lOiBjdXJyZW50LmZ4cHJpbWUuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzOiBmdW5jdGlvbkNhbGxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYXJuUmF0ZTogbGVhcm5SYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFscGhhOiBsZWFyblJhdGV9KTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzID0gW107XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgICAgICAgIG5leHQgPSB0ZW1wO1xuXG4gICAgICAgICAgICBpZiAoKGxlYXJuUmF0ZSA9PT0gMCkgfHwgKG5vcm0yKGN1cnJlbnQuZnhwcmltZSkgPCAxZS01KSkgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICBleHBvcnRzLmJpc2VjdCA9IGJpc2VjdDtcbiAgICBleHBvcnRzLm5lbGRlck1lYWQgPSBuZWxkZXJNZWFkO1xuICAgIGV4cG9ydHMuY29uanVnYXRlR3JhZGllbnQgPSBjb25qdWdhdGVHcmFkaWVudDtcbiAgICBleHBvcnRzLmdyYWRpZW50RGVzY2VudCA9IGdyYWRpZW50RGVzY2VudDtcbiAgICBleHBvcnRzLmdyYWRpZW50RGVzY2VudExpbmVTZWFyY2ggPSBncmFkaWVudERlc2NlbnRMaW5lU2VhcmNoO1xuICAgIGV4cG9ydHMuemVyb3MgPSB6ZXJvcztcbiAgICBleHBvcnRzLnplcm9zTSA9IHplcm9zTTtcbiAgICBleHBvcnRzLm5vcm0yID0gbm9ybTI7XG4gICAgZXhwb3J0cy53ZWlnaHRlZFN1bSA9IHdlaWdodGVkU3VtO1xuICAgIGV4cG9ydHMuc2NhbGUgPSBzY2FsZTtcblxufSkpOyIsImltcG9ydCB7IFN0YXRpb24sIFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9MaW5lXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5cbmNvbnN0IGZtaW4gPSByZXF1aXJlKCdmbWluJyk7XG5cblxuZXhwb3J0IGNsYXNzIEdyYXZpdGF0b3Ige1xuICAgIHN0YXRpYyBJTkVSVE5FU1MgPSAxMDA7XG4gICAgc3RhdGljIEdSQURJRU5UX1NDQUxFID0gMC4wMDAwMDAwMDE7XG4gICAgc3RhdGljIERFVklBVElPTl9XQVJOSU5HID0gMC4xO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFX1JFTEFUSVZFX1RPX0VVQ0xJRElBTl9ESVNUQU5DRSA9IHRydWU7XG5cbiAgICBwcml2YXRlIGluaXRpYWxXZWlnaHRGYWN0b3JzOiB7W2lkOiBzdHJpbmddIDogbnVtYmVyfSA9IHt9O1xuICAgIHByaXZhdGUgYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvOiBudW1iZXIgPSAtMTtcbiAgICBwcml2YXRlIGVkZ2VzOiB7W2lkOiBzdHJpbmddOiBMaW5lfSA9IHt9O1xuICAgIHByaXZhdGUgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvciwgc3RhcnRDb29yZHM6IFZlY3Rvcn19ID0ge307XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGdyYXZpdGF0ZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMub2J0YWluU3RhdGlvbnMoKTtcbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSB0aGlzLm1pbmltaXplTG9zcygpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmVkZ2VzKTtcbiAgICAgICAgdGhpcy5hc3NlcnREaXN0YW5jZXMoc29sdXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlU3RhdGlvbnNBbmRMaW5lcyhzb2x1dGlvbiwgZGVsYXksIGFuaW1hdGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvID09IC0xICYmIE9iamVjdC52YWx1ZXModGhpcy5lZGdlcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW8gPSB0aGlzLmdldFdlaWdodHNTdW0oKSAvIHRoaXMuZ2V0RXVjbGlkaWFuRGlzdGFuY2VTdW0oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdmVyYWdlRXVjbGlkaWFuTGVuZ3RoUmF0aW9eLTEnLCAxL3RoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0V2VpZ2h0c1N1bSgpIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBPYmplY3QudmFsdWVzKHRoaXMuZWRnZXMpKSB7XG4gICAgICAgICAgICBzdW0gKz0gZWRnZS53ZWlnaHQgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RXVjbGlkaWFuRGlzdGFuY2VTdW0oKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgc3VtICs9IHRoaXMuZXVjbGlkaWFuRGlzdGFuY2UoZWRnZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGV1Y2xpZGlhbkRpc3RhbmNlKGVkZ2U6IExpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzBdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKHRoaXMudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uc3RhdGlvbi5iYXNlQ29vcmRzKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvYnRhaW5TdGF0aW9ucygpIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBlZGdlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxXZWlnaHRGYWN0b3JzW2tleV0gPSBHcmF2aXRhdG9yLklOSVRJQUxJWkVfUkVMQVRJVkVfVE9fRVVDTElESUFOX0RJU1RBTkNFXG4gICAgICAgICAgICAgICAgICAgID8gMSAvIHRoaXMuYXZlcmFnZUV1Y2xpZGlhbkxlbmd0aFJhdGlvXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5ldWNsaWRpYW5EaXN0YW5jZShlZGdlKSAvIChlZGdlLndlaWdodCB8fCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4IG9mIE9iamVjdC52YWx1ZXModGhpcy52ZXJ0aWNlcykpIHtcbiAgICAgICAgICAgIHZlcnRleC5pbmRleCA9IG5ldyBWZWN0b3IoaSwgaSsxKTtcbiAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWluaW1pemVMb3NzKCk6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3QgZ3Jhdml0YXRvciA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtoaXN0b3J5OiBbXX07XG4gICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXJbXSA9IHRoaXMuc3RhcnRTdGF0aW9uUG9zaXRpb25zKCk7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZm1pbi5jb25qdWdhdGVHcmFkaWVudCgoQTogbnVtYmVyW10sIGZ4cHJpbWU6IG51bWJlcltdKSA9PiB7XG4gICAgICAgICAgICBmeHByaW1lID0gZnhwcmltZSB8fCBBLnNsaWNlKCk7XG4gICAgICAgICAgICBsZXQgZnggPSAwO1xuICAgICAgICAgICAgZnggPSB0aGlzLmRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeCwgQSwgZnhwcmltZSwgZ3Jhdml0YXRvcik7XG4gICAgICAgICAgICBmeCA9IHRoaXMuZGVsdGFUb05ld0Rpc3RhbmNlc1RvRW5zdXJlQWNjdXJhY3koZngsIEEsIGZ4cHJpbWUsIGdyYXZpdGF0b3IpO1xuICAgICAgICAgICAgdGhpcy5zY2FsZUdyYWRpZW50VG9FbnN1cmVXb3JraW5nU3RlcFNpemUoZnhwcmltZSk7XG4gICAgICAgICAgICByZXR1cm4gZng7XG4gICAgICAgIH0sIHN0YXJ0LCBwYXJhbXMpO1xuICAgICAgICByZXR1cm4gc29sdXRpb24ueDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0U3RhdGlvblBvc2l0aW9ucygpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICBzdGFydFt2ZXJ0ZXguaW5kZXgueF0gPSB2ZXJ0ZXguc3RhcnRDb29yZHMueDtcbiAgICAgICAgICAgIHN0YXJ0W3ZlcnRleC5pbmRleC55XSA9IHZlcnRleC5zdGFydENvb3Jkcy55O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGFydDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWChBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueF0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC54XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhWShBOiBudW1iZXJbXSwgdmVydGljZXM6IHtbaWQ6IHN0cmluZ10gOiB7c3RhdGlvbjogU3RhdGlvbiwgaW5kZXg6IFZlY3Rvcn19LCB0ZXJtaW5pOiBTdG9wW10pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQVt2ZXJ0aWNlc1t0ZXJtaW5pWzBdLnN0YXRpb25JZF0uaW5kZXgueV0gLSBBW3ZlcnRpY2VzW3Rlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbHRhVG9TdGFydFN0YXRpb25Qb3NpdGlvbnNUb0Vuc3VyZUluZXJ0bmVzcyhmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKGdyYXZpdGF0b3IudmVydGljZXMpKSB7XG4gICAgICAgICAgICBmeCArPSAoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnhdLXZlcnRleC5zdGFydENvb3Jkcy54LCAyKSArXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KEFbdmVydGV4LmluZGV4LnldLXZlcnRleC5zdGFydENvb3Jkcy55LCAyKVxuICAgICAgICAgICAgICAgICkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnhdID0gMiAqIChBW3ZlcnRleC5pbmRleC54XS12ZXJ0ZXguc3RhcnRDb29yZHMueCkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgICAgIGZ4cHJpbWVbdmVydGV4LmluZGV4LnldID0gMiAqIChBW3ZlcnRleC5pbmRleC55XS12ZXJ0ZXguc3RhcnRDb29yZHMueSkgKiBHcmF2aXRhdG9yLklORVJUTkVTUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZng7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWx0YVRvTmV3RGlzdGFuY2VzVG9FbnN1cmVBY2N1cmFjeShmeDogbnVtYmVyLCBBOiBudW1iZXJbXSwgZnhwcmltZTogbnVtYmVyW10sIGdyYXZpdGF0b3I6IEdyYXZpdGF0b3IpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGVkZ2VdIG9mIE9iamVjdC5lbnRyaWVzKGdyYXZpdGF0b3IuZWRnZXMpKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdiA9IE1hdGgucG93KHRoaXMuZGVsdGFYKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICArIE1hdGgucG93KHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAtIE1hdGgucG93KGdyYXZpdGF0b3IuaW5pdGlhbFdlaWdodEZhY3RvcnNba2V5XSAqIChlZGdlLndlaWdodCB8fCAwKSwgMik7XG4gICAgICAgICAgICBmeCArPSBNYXRoLnBvdyh2LCAyKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkXS5pbmRleC54XSArPSArNCAqIHYgKiB0aGlzLmRlbHRhWChBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICAgICAgZnhwcmltZVtncmF2aXRhdG9yLnZlcnRpY2VzW2VkZ2UudGVybWluaVswXS5zdGF0aW9uSWRdLmluZGV4LnldICs9ICs0ICogdiAqIHRoaXMuZGVsdGFZKEEsIGdyYXZpdGF0b3IudmVydGljZXMsIGVkZ2UudGVybWluaSk7XG4gICAgICAgICAgICBmeHByaW1lW2dyYXZpdGF0b3IudmVydGljZXNbZWRnZS50ZXJtaW5pWzFdLnN0YXRpb25JZF0uaW5kZXgueF0gKz0gLTQgKiB2ICogdGhpcy5kZWx0YVgoQSwgZ3Jhdml0YXRvci52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKTtcbiAgICAgICAgICAgIGZ4cHJpbWVbZ3Jhdml0YXRvci52ZXJ0aWNlc1tlZGdlLnRlcm1pbmlbMV0uc3RhdGlvbklkXS5pbmRleC55XSArPSAtNCAqIHYgKiB0aGlzLmRlbHRhWShBLCBncmF2aXRhdG9yLnZlcnRpY2VzLCBlZGdlLnRlcm1pbmkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjYWxlR3JhZGllbnRUb0Vuc3VyZVdvcmtpbmdTdGVwU2l6ZShmeHByaW1lOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnhwcmltZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZnhwcmltZVtpXSAqPSBHcmF2aXRhdG9yLkdSQURJRU5UX1NDQUxFO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnREaXN0YW5jZXMoc29sdXRpb246IG51bWJlcltdKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZWRnZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5lZGdlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldmlhdGlvbiA9IE1hdGguYWJzKDEgLSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5kZWx0YVgoc29sdXRpb24sIHRoaXMudmVydGljZXMsIGVkZ2UudGVybWluaSksIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyh0aGlzLmRlbHRhWShzb2x1dGlvbiwgdGhpcy52ZXJ0aWNlcywgZWRnZS50ZXJtaW5pKSwgMilcbiAgICAgICAgICAgICkgLyAodGhpcy5pbml0aWFsV2VpZ2h0RmFjdG9yc1trZXldICogKGVkZ2Uud2VpZ2h0IHx8IDApKSk7XG4gICAgICAgICAgICBpZiAoZGV2aWF0aW9uID4gR3Jhdml0YXRvci5ERVZJQVRJT05fV0FSTklORykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlZGdlLm5hbWUsICdkaXZlcmdlcyBieSAnLCBkZXZpYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBcblxuICAgIHByaXZhdGUgbW92ZVN0YXRpb25zQW5kTGluZXMoc29sdXRpb246IG51bWJlcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID0gYW5pbWF0ZSA/IDMgOiAwO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiBPYmplY3QudmFsdWVzKHRoaXMudmVydGljZXMpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXguc3RhdGlvbi5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIG5ldyBWZWN0b3Ioc29sdXRpb25bdmVydGV4LmluZGV4LnhdLCBzb2x1dGlvblt2ZXJ0ZXguaW5kZXgueV0pKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmVkZ2VzKSkge1xuICAgICAgICAgICAgZWRnZS5tb3ZlKGRlbGF5LCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIFt0aGlzLmdldE5ld1N0YXRpb25Qb3NpdGlvbihlZGdlLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBzb2x1dGlvbiksIHRoaXMuZ2V0TmV3U3RhdGlvblBvc2l0aW9uKGVkZ2UudGVybWluaVsxXS5zdGF0aW9uSWQsIHNvbHV0aW9uKV0pO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ICs9IGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcztcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TmV3U3RhdGlvblBvc2l0aW9uKHN0YXRpb25JZDogc3RyaW5nLCBzb2x1dGlvbjogbnVtYmVyW10pOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcihzb2x1dGlvblt0aGlzLnZlcnRpY2VzW3N0YXRpb25JZF0uaW5kZXgueF0sIHNvbHV0aW9uW3RoaXMudmVydGljZXNbc3RhdGlvbklkXS5pbmRleC55XSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRWZXJ0ZXgodmVydGV4SWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNlc1t2ZXJ0ZXhJZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQodmVydGV4SWQpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyB2ZXJ0ZXhJZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzW3ZlcnRleElkXSA9IHtzdGF0aW9uOiBzdGF0aW9uLCBpbmRleDogVmVjdG9yLk5VTEwsIHN0YXJ0Q29vcmRzOiBzdGF0aW9uLmJhc2VDb29yZHN9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkRWRnZShsaW5lOiBMaW5lKSB7XG4gICAgICAgIGlmIChsaW5lLndlaWdodCA9PSB1bmRlZmluZWQpIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0SWRlbnRpZmllcihsaW5lKTtcbiAgICAgICAgdGhpcy5lZGdlc1tpZF0gPSBsaW5lO1xuICAgICAgICB0aGlzLmFkZFZlcnRleChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkKTtcbiAgICAgICAgdGhpcy5hZGRWZXJ0ZXgobGluZS50ZXJtaW5pWzFdLnN0YXRpb25JZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZGVudGlmaWVyKGxpbmU6IExpbmUpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmFscGhhYmV0aWNJZChsaW5lLnRlcm1pbmlbMF0uc3RhdGlvbklkLCBsaW5lLnRlcm1pbmlbMV0uc3RhdGlvbklkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5zdGFudCB7XG4gICAgc3RhdGljIEJJR19CQU5HOiBJbnN0YW50ID0gbmV3IEluc3RhbnQoMCwgMCwgJycpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Vwb2NoOiBudW1iZXIsIHByaXZhdGUgX3NlY29uZDogbnVtYmVyLCBwcml2YXRlIF9mbGFnOiBzdHJpbmcpIHtcblxuICAgIH1cbiAgICBnZXQgZXBvY2goKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vwb2NoO1xuICAgIH1cbiAgICBnZXQgc2Vjb25kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWNvbmQ7XG4gICAgfVxuICAgIGdldCBmbGFnKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFnO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGFycmF5OiBzdHJpbmdbXSk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQocGFyc2VJbnQoYXJyYXlbMF0pLCBwYXJzZUludChhcnJheVsxXSksIGFycmF5WzJdID8/ICcnKVxuICAgIH1cblxuICAgIGVxdWFscyh0aGF0OiBJbnN0YW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmVwb2NoID09IHRoYXQuZXBvY2ggJiYgdGhpcy5zZWNvbmQgPT0gdGhhdC5zZWNvbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBJbnN0YW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kIC0gdGhpcy5zZWNvbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQuc2Vjb25kO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGltZWREcmF3YWJsZSwgVGltZWQgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExhYmVsQWRhcHRlciBleHRlbmRzIFRpbWVkIHtcbiAgICBmb3JTdGF0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZm9yTGluZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGJvdW5kaW5nQm94OiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn07XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgdGV4dENvb3JkczogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSk6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xuICAgIGNsb25lRm9yU3RhdGlvbihzdGF0aW9uSWQ6IHN0cmluZyk6IExhYmVsQWRhcHRlcjtcbn1cblxuZXhwb3J0IGNsYXNzIExhYmVsIGltcGxlbWVudHMgVGltZWREcmF3YWJsZSB7XG4gICAgc3RhdGljIExBQkVMX0hFSUdIVCA9IDEyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBMYWJlbEFkYXB0ZXIsIHByaXZhdGUgc3RhdGlvblByb3ZpZGVyOiBTdGF0aW9uUHJvdmlkZXIpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBib3VuZGluZ0JveCA9IHRoaXMuYWRhcHRlci5ib3VuZGluZ0JveDtcbiAgICBjaGlsZHJlbjogTGFiZWxbXSA9IFtdO1xuXG4gICAgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8IHRoaXMuYWRhcHRlci5mb3JMaW5lIHx8ICcnO1xuICAgIH1cbiAgICBcbiAgICBnZXQgZm9yU3RhdGlvbigpOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8ICcnKTtcbiAgICAgICAgaWYgKHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmZvclN0YXRpb247XG4gICAgICAgICAgICBzdGF0aW9uLmFkZExhYmVsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpb24ubGluZXNFeGlzdGluZygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3Rm9yU3RhdGlvbihkZWxheSwgc3RhdGlvbiwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZXJhc2UoZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWRhcHRlci5mb3JMaW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgdGVybWluaSA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmxpbmVHcm91cEJ5SWQodGhpcy5hZGFwdGVyLmZvckxpbmUpLnRlcm1pbmk7XG4gICAgICAgICAgICB0ZXJtaW5pLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHQuc3RhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBpZiAocyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHMubGFiZWxzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLmRyYXcoZGVsYXksIGFuaW1hdGUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xhYmVsRm9yU3RhdGlvbiA9IG5ldyBMYWJlbCh0aGlzLmFkYXB0ZXIuY2xvbmVGb3JTdGF0aW9uKHMuaWQpLCB0aGlzLnN0YXRpb25Qcm92aWRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYWJlbEZvclN0YXRpb24uY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYWRkTGFiZWwobmV3TGFiZWxGb3JTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xhYmVsRm9yU3RhdGlvbi5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXdMYWJlbEZvclN0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdGb3JTdGF0aW9uKGRlbGF5U2Vjb25kczogbnVtYmVyLCBzdGF0aW9uOiBTdGF0aW9uLCBmb3JMaW5lOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgbGV0IHlPZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8c3RhdGlvbi5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBzdGF0aW9uLmxhYmVsc1tpXTtcbiAgICAgICAgICAgIGlmIChsID09IHRoaXMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB5T2Zmc2V0ICs9IExhYmVsLkxBQkVMX0hFSUdIVCoxLjU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFiZWxEaXIgPSBzdGF0aW9uLmxhYmVsRGlyO1xuXG4gICAgICAgIHlPZmZzZXQgPSBNYXRoLnNpZ24oVmVjdG9yLlVOSVQucm90YXRlKGxhYmVsRGlyKS55KSp5T2Zmc2V0IC0gKHlPZmZzZXQ+MCA/IDIgOiAwKTsgLy9UT0RPIG1hZ2ljIG51bWJlcnNcbiAgICAgICAgY29uc3Qgc3RhdGlvbkRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGRpZmZEaXIgPSBsYWJlbERpci5hZGQobmV3IFJvdGF0aW9uKC1zdGF0aW9uRGlyLmRlZ3JlZXMpKTtcbiAgICAgICAgY29uc3QgdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZGlmZkRpcik7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IG5ldyBWZWN0b3Ioc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3gnLCB1bml0di54KSwgc3RhdGlvbi5zdGF0aW9uU2l6ZUZvckF4aXMoJ3knLCB1bml0di55KSk7XG4gICAgICAgIGNvbnN0IHRleHRDb29yZHMgPSBiYXNlQ29vcmQuYWRkKGFuY2hvci5yb3RhdGUoc3RhdGlvbkRpcikpLmFkZChuZXcgVmVjdG9yKDAsIHlPZmZzZXQpKTtcbiAgICBcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXlTZWNvbmRzLCB0ZXh0Q29vcmRzLCBsYWJlbERpciwgdGhpcy5jaGlsZHJlbi5tYXAoYyA9PiBjLmFkYXB0ZXIpKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5mb3JTdGF0aW9uLnJlbW92ZUxhYmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFkYXB0ZXIuZm9yTGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBjLmVyYXNlKGRlbGF5LCBhbmltYXRlLCByZXZlcnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdGF0aW9uLCBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuL1ByZWZlcnJlZFRyYWNrXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUFkYXB0ZXIgZXh0ZW5kcyBUaW1lZCAge1xuICAgIHN0b3BzOiBTdG9wW107XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJvdW5kaW5nQm94OiB7IHRsOiBWZWN0b3I7IGJyOiBWZWN0b3I7IH07XG4gICAgd2VpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlcik6IHZvaWQ7XG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10pOiB2b2lkO1xuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGluZSBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBOT0RFX0RJU1RBTkNFID0gMDtcbiAgICBzdGF0aWMgU1BFRUQgPSAxMDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IExpbmVBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyLCBwcml2YXRlIGJlY2tTdHlsZTogYm9vbGVhbiA9IHRydWUpIHtcblxuICAgIH1cblxuICAgIGZyb20gPSB0aGlzLmFkYXB0ZXIuZnJvbTtcbiAgICB0byA9IHRoaXMuYWRhcHRlci50bztcbiAgICBuYW1lID0gdGhpcy5hZGFwdGVyLm5hbWU7XG4gICAgYm91bmRpbmdCb3ggPSB0aGlzLmFkYXB0ZXIuYm91bmRpbmdCb3g7XG4gICAgd2VpZ2h0ID0gdGhpcy5hZGFwdGVyLndlaWdodDtcbiAgICBcbiAgICBwcml2YXRlIHByZWNlZGluZ1N0b3A6IFN0YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBwcmVjZWRpbmdEaXI6IFJvdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgcGF0aDogVmVjdG9yW10gPSBbXTtcblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wYXRoO1xuICAgICAgICBcbiAgICAgICAgbGV0IHRyYWNrID0gbmV3IFByZWZlcnJlZFRyYWNrKCcrJyk7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tU3RyaW5nKHN0b3BzW2pdLnByZWZlcnJlZFRyYWNrKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5mcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKHN0b3AuYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKHRoaXMubmFtZSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RvcCwgdGhpcy5uZXh0U3RvcEJhc2VDb29yZChzdG9wcywgaiwgc3RvcC5iYXNlQ29vcmRzKSwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCB0cnVlKTtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2sua2VlcE9ubHlTaWduKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uUHJvdmlkZXIubGluZUdyb3VwQnlJZCh0aGlzLm5hbWUpLmFkZExpbmUodGhpcyk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kcmF3KGRlbGF5LCBkdXJhdGlvbiwgcGF0aCwgdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSk7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5OiBudW1iZXIsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kczogbnVtYmVyLCBwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBsZXQgb2xkUGF0aCA9IHRoaXMucGF0aDtcbiAgICAgICAgaWYgKG9sZFBhdGgubGVuZ3RoIDwgMiB8fCBwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVHJ5aW5nIHRvIG1vdmUgYSBub24gZXhpc3RpbmcgbGluZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbGRQYXRoLmxlbmd0aCAhPSBwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgb2xkUGF0aCA9IFtvbGRQYXRoWzBdLCBvbGRQYXRoW29sZFBhdGgubGVuZ3RoLTFdXTtcbiAgICAgICAgICAgIHBhdGggPSBbcGF0aFswXSwgcGF0aFtwYXRoLmxlbmd0aC0xXV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGFwdGVyLm1vdmUoZGVsYXksIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgdGhpcy5wYXRoLCBwYXRoKTtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbih0aGlzLnBhdGgsIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLnN0YXRpb25Qcm92aWRlci5saW5lR3JvdXBCeUlkKHRoaXMubmFtZSkucmVtb3ZlTGluZSh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmVyYXNlKGRlbGF5LCBkdXJhdGlvbiwgcmV2ZXJzZSwgdGhpcy5nZXRUb3RhbExlbmd0aCh0aGlzLnBhdGgpKTtcbiAgICAgICAgY29uc3Qgc3RvcHMgPSB0aGlzLmFkYXB0ZXIuc3RvcHM7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajxzdG9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICBpZiAoc3RvcCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0aW9uIHdpdGggSUQgJyArIHN0b3BzW2pdLnN0YXRpb25JZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICBzdG9wLnJlbW92ZUxpbmUodGhpcyk7XG4gICAgICAgICAgICBzdG9wLmRyYXcoZGVsYXkpO1xuICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3BJZCA9ICdoXycgKyBVdGlscy5hbHBoYWJldGljSWQoc3RvcHNbai0xXS5zdGF0aW9uSWQsIHN0b3BzW2pdLnN0YXRpb25JZCk7XG4gICAgICAgICAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGhlbHBTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBoZWxwU3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0U3RvcEJhc2VDb29yZChzdG9wczogU3RvcFtdLCBjdXJyZW50U3RvcEluZGV4OiBudW1iZXIsIGRlZmF1bHRDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICBpZiAoY3VycmVudFN0b3BJbmRleCsxIDwgc3RvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHN0b3BzW2N1cnJlbnRTdG9wSW5kZXgrMV0uc3RhdGlvbklkO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgaWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3AuYmFzZUNvb3JkczsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdENvb3JkcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgdHJhY2s6IFByZWZlcnJlZFRyYWNrLCBwYXRoOiBWZWN0b3JbXSwgZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmVjdXJzZTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBkaXIgPSBzdGF0aW9uLnJvdGF0aW9uO1xuICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgIGNvbnN0IG5ld0RpciA9IHRoaXMuZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIGRpciwgcGF0aCk7XG4gICAgICAgIGNvbnN0IG5ld1BvcyA9IHN0YXRpb24uYXNzaWduVHJhY2sobmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgdHJhY2ssIHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gc3RhdGlvbi5yb3RhdGVkVHJhY2tDb29yZGluYXRlcyhuZXdEaXIsIG5ld1Bvcyk7XG4gICAgXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgXG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMuZ2V0UHJlY2VkaW5nRGlyKHRoaXMucHJlY2VkaW5nRGlyLCB0aGlzLnByZWNlZGluZ1N0b3AsIG9sZENvb3JkLCBuZXdDb29yZCk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gbmV3RGlyLmFkZChkaXIpO1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmluc2VydE5vZGUob2xkQ29vcmQsIHRoaXMucHJlY2VkaW5nRGlyLCBuZXdDb29yZCwgc3RhdGlvbkRpciwgcGF0aCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWZvdW5kICYmIHJlY3Vyc2UgJiYgdGhpcy5wcmVjZWRpbmdTdG9wICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlbHBTdG9wID0gdGhpcy5nZXRPckNyZWF0ZUhlbHBlclN0b3AodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgc3RhdGlvbik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVjZWRpbmdEaXIgPSB0aGlzLnByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihoZWxwU3RvcCwgYmFzZUNvb3JkLCB0cmFjay5rZWVwT25seVNpZ24oKSwgcGF0aCwgZGVsYXksIGFuaW1hdGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24oc3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQsIHRyYWNrLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdwYXRoIHRvIGZpeCBvbiBsaW5lJywgdGhpcy5hZGFwdGVyLm5hbWUsICdhdCBzdGF0aW9uJywgc3RhdGlvbi5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHN0YXRpb25EaXI7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGlvbi5hZGRMaW5lKHRoaXMsIG5ld0Rpci5pc1ZlcnRpY2FsKCkgPyAneCcgOiAneScsIG5ld1Bvcyk7XG4gICAgICAgIHBhdGgucHVzaChuZXdDb29yZCk7XG4gICAgICAgIGRlbGF5ID0gdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbihwYXRoLCBhbmltYXRlKSArIGRlbGF5O1xuICAgICAgICBzdGF0aW9uLmRyYXcoZGVsYXkpO1xuICAgICAgICB0aGlzLnByZWNlZGluZ1N0b3AgPSBzdGF0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RvcE9yaWVudGF0aW9uQmFzZWRPblRocmVlU3RvcHMoc3RhdGlvbjogU3RhdGlvbiwgbmV4dFN0b3BCYXNlQ29vcmQ6IFZlY3RvciwgZGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDb29yZCA9IHBhdGhbcGF0aC5sZW5ndGgtMV07XG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0b3BCYXNlQ29vcmQuZGVsdGEob2xkQ29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc3RhdGlvbi5iYXNlQ29vcmRzLmRlbHRhKG5leHRTdG9wQmFzZUNvb3JkKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdBeGlzID0gc3RhdGlvbi5heGlzQW5kVHJhY2tGb3JFeGlzdGluZ0xpbmUodGhpcy5uYW1lKT8uYXhpcztcbiAgICAgICAgaWYgKGV4aXN0aW5nQXhpcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbiA9IGRlbHRhLmluY2xpbmF0aW9uKCkuaGFsZkRpcmVjdGlvbihkaXIsIGV4aXN0aW5nQXhpcyA9PSAneCcgPyBuZXcgUm90YXRpb24oOTApIDogbmV3IFJvdGF0aW9uKDApKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbi5hZGQoZGlyKS5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nU3RvcE9yaWVudGlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsdGEuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgfVxuICAgIFxuXG4gICAgcHJpdmF0ZSBnZXRQcmVjZWRpbmdEaXIocHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCwgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCwgb2xkQ29vcmQ6IFZlY3RvciwgbmV3Q29vcmQ6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWNlZGluZ1N0b3BSb3RhdGlvbiA9IHByZWNlZGluZ1N0b3A/LnJvdGF0aW9uID8/IG5ldyBSb3RhdGlvbigwKTtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24ocHJlY2VkaW5nU3RvcFJvdGF0aW9uKS5hZGQocHJlY2VkaW5nU3RvcFJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IHByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVjZWRpbmdEaXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbnNlcnROb2RlKGZyb21Db29yZDogVmVjdG9yLCBmcm9tRGlyOiBSb3RhdGlvbiwgdG9Db29yZDogVmVjdG9yLCB0b0RpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5iZWNrU3R5bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSBmcm9tQ29vcmQuZGVsdGEodG9Db29yZCk7XG4gICAgICAgIGNvbnN0IG9sZERpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZnJvbURpcik7XG4gICAgICAgIGNvbnN0IG5ld0RpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUodG9EaXIpO1xuICAgICAgICBpZiAoZGVsdGEuaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwob2xkRGlyViwgbmV3RGlyVikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZGVsdGEuc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihvbGREaXJWLCBuZXdEaXJWKVxuICAgICAgICBpZiAoc29sdXRpb24uYSA+IExpbmUuTk9ERV9ESVNUQU5DRSAmJiBzb2x1dGlvbi5iID4gTGluZS5OT0RFX0RJU1RBTkNFKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gobmV3IFZlY3Rvcihmcm9tQ29vcmQueCtvbGREaXJWLngqc29sdXRpb24uYSwgZnJvbUNvb3JkLnkrb2xkRGlyVi55KnNvbHV0aW9uLmEpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlSGVscGVyU3RvcChmcm9tRGlyOiBSb3RhdGlvbiwgZnJvbVN0b3A6IFN0YXRpb24sIHRvU3RvcDogU3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChmcm9tU3RvcC5pZCwgdG9TdG9wLmlkKTtcbiAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgIGlmIChoZWxwU3RvcCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZycsIGhlbHBTdG9wSWQpO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBmcm9tU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgbmV3Q29vcmQgPSB0b1N0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3Q29vcmQuZGVsdGEob2xkQ29vcmQpO1xuICAgICAgICAgICAgY29uc3QgZGVnID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVEaXIgPSBuZXcgUm90YXRpb24oKGRlZy5kZWx0YShmcm9tRGlyKS5kZWdyZWVzID49IDAgPyBNYXRoLmZsb29yKGRlZy5kZWdyZWVzIC8gNDUpIDogTWF0aC5jZWlsKGRlZy5kZWdyZWVzIC8gNDUpKSAqIDQ1KS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZUNvb3JkID0gZGVsdGEud2l0aExlbmd0aChkZWx0YS5sZW5ndGgvMikuYWRkKG5ld0Nvb3JkKTtcblxuICAgICAgICAgICAgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5jcmVhdGVWaXJ0dWFsU3RvcChoZWxwU3RvcElkLCBpbnRlcm1lZGlhdGVDb29yZCwgaW50ZXJtZWRpYXRlRGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGVscFN0b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBbmltYXRpb25EdXJhdGlvbihwYXRoOiBWZWN0b3JbXSwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3RhbExlbmd0aChwYXRoKSAvIExpbmUuU1BFRUQ7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0VG90YWxMZW5ndGgocGF0aDogVmVjdG9yW10pOiBudW1iZXIge1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhdGgubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgbGVuZ3RoICs9IHBhdGhbaV0uZGVsdGEocGF0aFtpKzFdKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXQgdGVybWluaSgpOiBTdG9wW10ge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgaWYgKHN0b3BzLmxlbmd0aCA9PSAwKSBcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIFtzdG9wc1swXSwgc3RvcHNbc3RvcHMubGVuZ3RoLTFdXTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lR3JvdXAge1xuICAgIHByaXZhdGUgbGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgX3Rlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgIFxuICAgIGFkZExpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMubGluZXMuaW5jbHVkZXMobGluZSkpXG4gICAgICAgICAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmVzW2ldID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVGVybWluaSgpO1xuICAgIH1cblxuICAgIGdldCB0ZXJtaW5pKCk6IFN0b3BbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJtaW5pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVGVybWluaSgpIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlczoge1tpZDogc3RyaW5nXSA6IG51bWJlcn0gPSB7fTtcbiAgICAgICAgdGhpcy5saW5lcy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZVRlcm1pbmkgPSBsLnRlcm1pbmk7XG4gICAgICAgICAgICBsaW5lVGVybWluaS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdC5wcmVmZXJyZWRUcmFjay5pbmNsdWRlcygnKicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5kaWRhdGVzW3Quc3RhdGlvbklkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbdC5zdGF0aW9uSWRdKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRlcm1pbmk6IFN0b3BbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtzdGF0aW9uSWQsIG9jY3VyZW5jZXNdIG9mIE9iamVjdC5lbnRyaWVzKGNhbmRpZGF0ZXMpKSB7XG4gICAgICAgICAgICBpZiAob2NjdXJlbmNlcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGVybWluaS5wdXNoKG5ldyBTdG9wKHN0YXRpb25JZCwgJycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90ZXJtaW5pID0gdGVybWluaTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFpvb21lciB9IGZyb20gXCIuL1pvb21lclwiO1xuaW1wb3J0IHsgTGluZUdyb3VwIH0gZnJvbSBcIi4vTGluZUdyb3VwXCI7XG5pbXBvcnQgeyBHcmF2aXRhdG9yIH0gZnJvbSBcIi4vR3Jhdml0YXRvclwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBZGFwdGVyIHtcbiAgICBjYW52YXNTaXplOiBWZWN0b3I7XG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZDtcbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IG51bGw7XG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uO1xuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZDtcbiAgICB6b29tVG8oem9vbUNlbnRlcjogVmVjdG9yLCB6b29tU2NhbGU6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTmV0d29yayBpbXBsZW1lbnRzIFN0YXRpb25Qcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzbGlkZUluZGV4OiB7W2lkOiBzdHJpbmddIDoge1tpZDogc3RyaW5nXTogVGltZWREcmF3YWJsZVtdfX0gPSB7fTtcbiAgICBwcml2YXRlIHN0YXRpb25zOiB7IFtpZDogc3RyaW5nXSA6IFN0YXRpb24gfSA9IHt9O1xuICAgIHByaXZhdGUgbGluZUdyb3VwczogeyBbaWQ6IHN0cmluZ10gOiBMaW5lR3JvdXAgfSA9IHt9O1xuICAgIHByaXZhdGUgZXJhc2VCdWZmZXI6IFRpbWVkRHJhd2FibGVbXSA9IFtdO1xuICAgIHByaXZhdGUgZ3Jhdml0YXRvcjogR3Jhdml0YXRvcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTmV0d29ya0FkYXB0ZXIpIHtcbiAgICAgICAgdGhpcy5ncmF2aXRhdG9yID0gbmV3IEdyYXZpdGF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmluaXRpYWxpemUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5zdGF0aW9uc1tpZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5hZGFwdGVyLnN0YXRpb25CeUlkKGlkKVxuICAgICAgICAgICAgaWYgKHN0YXRpb24gIT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGlvbnNbaWRdO1xuICAgIH1cblxuICAgIGxpbmVHcm91cEJ5SWQoaWQ6IHN0cmluZyk6IExpbmVHcm91cCB7XG4gICAgICAgIGlmICh0aGlzLmxpbmVHcm91cHNbaWRdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5saW5lR3JvdXBzW2lkXSA9IG5ldyBMaW5lR3JvdXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5saW5lR3JvdXBzW2lkXTtcbiAgICB9XG5cbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5hZGFwdGVyLmNyZWF0ZVZpcnR1YWxTdG9wKGlkLCBiYXNlQ29vcmRzLCByb3RhdGlvbik7XG4gICAgICAgIHRoaXMuc3RhdGlvbnNbaWRdID0gc3RvcDtcbiAgICAgICAgcmV0dXJuIHN0b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaXNwbGF5SW5zdGFudChpbnN0YW50OiBJbnN0YW50KSB7XG4gICAgICAgIGlmICghaW5zdGFudC5lcXVhbHMoSW5zdGFudC5CSUdfQkFORykpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5kcmF3RXBvY2goaW5zdGFudC5lcG9jaCArICcnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCk6IFRpbWVkRHJhd2FibGVbXSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Vwb2NoRXhpc3Rpbmcobm93LmVwb2NoICsgJycpKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZUluZGV4W25vdy5lcG9jaF1bbm93LnNlY29uZF07XG4gICAgfVxuXG4gICAgZHJhd1RpbWVkRHJhd2FibGVzQXQobm93OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgem9vbWVyID0gbmV3IFpvb21lcih0aGlzLmFkYXB0ZXIuY2FudmFzU2l6ZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUluc3RhbnQobm93KTtcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IHRoaXMudGltZWREcmF3YWJsZXNBdChub3cpO1xuICAgICAgICBsZXQgZGVsYXkgPSBab29tZXIuWk9PTV9EVVJBVElPTjtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWxheSA9IHRoaXMuZHJhd09yRXJhc2VFbGVtZW50KGVsZW1lbnRzW2ldLCBkZWxheSwgYW5pbWF0ZSwgbm93LCB6b29tZXIpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGF5ID0gdGhpcy5mbHVzaEVyYXNlQnVmZmVyKGRlbGF5LCBhbmltYXRlLCB6b29tZXIpO1xuICAgICAgICBkZWxheSA9IHRoaXMuZ3Jhdml0YXRvci5ncmF2aXRhdGUoZGVsYXksIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuem9vbVRvKHpvb21lci5jZW50ZXIsIHpvb21lci5zY2FsZSwgWm9vbWVyLlpPT01fRFVSQVRJT04pO1xuICAgICAgICByZXR1cm4gZGVsYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmbHVzaEVyYXNlQnVmZmVyKGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIHpvb21lcjogWm9vbWVyKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaT10aGlzLmVyYXNlQnVmZmVyLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVyYXNlQnVmZmVyW2ldO1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LnRvLCBhbmltYXRlKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IHRoaXMuZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgICAgIHpvb21lci5pbmNsdWRlKGVsZW1lbnQuYm91bmRpbmdCb3gsIGVsZW1lbnQudG8sIHNob3VsZEFuaW1hdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJhc2VCdWZmZXIgPSBbXTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd09yRXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4sIGluc3RhbnQ6IEluc3RhbnQsIHpvb21lcjogWm9vbWVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKGluc3RhbnQuZXF1YWxzKGVsZW1lbnQudG8pICYmICFlbGVtZW50LmZyb20uZXF1YWxzKGVsZW1lbnQudG8pKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lcmFzZUJ1ZmZlci5sZW5ndGggPiAwICYmIHRoaXMuZXJhc2VCdWZmZXJbdGhpcy5lcmFzZUJ1ZmZlci5sZW5ndGgtMV0ubmFtZSAhPSBlbGVtZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hFcmFzZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSwgem9vbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZXJhc2VCdWZmZXIucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBkZWxheTtcbiAgICAgICAgfVxuICAgICAgICBkZWxheSA9IHRoaXMuZmx1c2hFcmFzZUJ1ZmZlcihkZWxheSwgYW5pbWF0ZSwgem9vbWVyKTtcbiAgICAgICAgY29uc3Qgc2hvdWxkQW5pbWF0ZSA9IHRoaXMuc2hvdWxkQW5pbWF0ZShlbGVtZW50LmZyb20sIGFuaW1hdGUpO1xuICAgICAgICBkZWxheSArPSB0aGlzLmRyYXdFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgem9vbWVyLmluY2x1ZGUoZWxlbWVudC5ib3VuZGluZ0JveCwgZWxlbWVudC5mcm9tLCBzaG91bGRBbmltYXRlKTtcbiAgICAgICAgcmV0dXJuIGRlbGF5O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGRyYXdFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIExpbmUpIHtcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0YXRvci5hZGRFZGdlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50LmRyYXcoZGVsYXksIGFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGVyYXNlRWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZXJhc2UoZGVsYXksIGFuaW1hdGUsIGVsZW1lbnQudG8uZmxhZyA9PSAncmV2ZXJzZScpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHNob3VsZEFuaW1hdGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChpbnN0YW50LmZsYWcgPT0gJ25vYW5pbScpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBhbmltYXRlO1xuICAgIH1cblxuICAgIGlzRXBvY2hFeGlzdGluZyhlcG9jaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdICE9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhZGRUb0luZGV4KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LmZyb20sIGVsZW1lbnQpO1xuICAgICAgICBpZiAoIUluc3RhbnQuQklHX0JBTkcuZXF1YWxzKGVsZW1lbnQudG8pKVxuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZUluZGV4RWxlbWVudChlbGVtZW50LnRvLCBlbGVtZW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNsaWRlSW5kZXhFbGVtZW50KGluc3RhbnQ6IEluc3RhbnQsIGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9IFtdO1xuICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdLnB1c2goZWxlbWVudCk7XG4gICAgfVxuXG4gICAgbmV4dEluc3RhbnQobm93OiBJbnN0YW50KTogSW5zdGFudCB8IG51bGwge1xuICAgICAgICBsZXQgZXBvY2g6IG51bWJlciB8IG51bGwgPSBub3cuZXBvY2g7XG4gICAgICAgIGxldCBzZWNvbmQ6IG51bWJlciB8IG51bGwgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5zZWNvbmQsIHRoaXMuc2xpZGVJbmRleFtub3cuZXBvY2hdKTtcbiAgICAgICAgaWYgKHNlY29uZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcG9jaCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LmVwb2NoLCB0aGlzLnNsaWRlSW5kZXgpO1xuICAgICAgICAgICAgaWYgKGVwb2NoID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHNlY29uZCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUoLTEsIHRoaXMuc2xpZGVJbmRleFtlcG9jaF0pO1xuICAgICAgICAgICAgaWYgKHNlY29uZCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW50KGVwb2NoLCBzZWNvbmQsICcnKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmaW5kU21hbGxlc3RBYm92ZSh0aHJlc2hvbGQ6IG51bWJlciwgZGljdDoge1tpZDogbnVtYmVyXTogYW55fSk6IG51bWJlciB8IG51bGwge1xuICAgICAgICBpZiAoZGljdCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGljdCkpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChrZXkpID4gdGhyZXNob2xkICYmIChzbWFsbGVzdCA9PSBudWxsIHx8IHBhcnNlSW50KGtleSkgPCBzbWFsbGVzdCkpIHtcbiAgICAgICAgICAgICAgICBzbWFsbGVzdCA9IHBhcnNlSW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNtYWxsZXN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IExpbmVBdFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJyZWRUcmFjayB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgaWYgKHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlID49IDAgPyAnKycgOiAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayhwcmVmaXggKyB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihhdFN0YXRpb246IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGF0U3RhdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhY2tOdW1iZXIoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tTnVtYmVyKGF0U3RhdGlvbi50cmFjayk7ICAgICAgICBcbiAgICB9XG5cbiAgICBrZWVwT25seVNpZ24oKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy52YWx1ZVswXTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayh2ID09ICctJyA/IHYgOiAnKycpO1xuICAgIH1cblxuICAgIGhhc1RyYWNrTnVtYmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGdldCB0cmFja051bWJlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy52YWx1ZS5yZXBsYWNlKCcqJywgJycpKVxuICAgIH1cblxuICAgIGlzUG9zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdICE9ICctJztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgICBwcml2YXRlIHN0YXRpYyBESVJTOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7J3N3JzogLTEzNSwgJ3cnOiAtOTAsICdudyc6IC00NSwgJ24nOiAwLCAnbmUnOiA0NSwgJ2UnOiA5MCwgJ3NlJzogMTM1LCAncyc6IDE4MH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWdyZWVzOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGRpcmVjdGlvbjogc3RyaW5nKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKFJvdGF0aW9uLkRJUlNbZGlyZWN0aW9uXSlcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhSb3RhdGlvbi5ESVJTKSkge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2YWx1ZSwgdGhpcy5kZWdyZWVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG5cbiAgICBnZXQgZGVncmVlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVncmVlcztcbiAgICB9XG5cbiAgICBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzIC8gMTgwICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICBhZGQodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLmRlZ3JlZXMgKyB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGlmIChzdW0gPD0gLTE4MClcbiAgICAgICAgICAgIHN1bSArPSAzNjA7XG4gICAgICAgIGlmIChzdW0gPiAxODApXG4gICAgICAgICAgICBzdW0gLT0gMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHN1bSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBsZXQgYiA9IHRoYXQuZGVncmVlcztcbiAgICAgICAgbGV0IGRpc3QgPSBiLWE7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0KSA+IDE4MCkge1xuICAgICAgICAgICAgaWYgKGEgPCAwKVxuICAgICAgICAgICAgICAgIGEgKz0gMzYwO1xuICAgICAgICAgICAgaWYgKGIgPCAwKVxuICAgICAgICAgICAgICAgIGIgKz0gMzYwO1xuICAgICAgICAgICAgZGlzdCA9IGItYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpc3QpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBkaXIgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGlyLCAtOTApKVxuICAgICAgICAgICAgZGlyID0gMDtcbiAgICAgICAgZWxzZSBpZiAoZGlyIDwgLTkwKVxuICAgICAgICAgICAgZGlyICs9IDE4MDtcbiAgICAgICAgZWxzZSBpZiAoZGlyID4gOTApXG4gICAgICAgICAgICBkaXIgLT0gMTgwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpcik7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAlIDE4MCA9PSAwO1xuICAgIH1cblxuICAgIHF1YXJ0ZXJEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGNvbnN0IGRlZyA9IGRlbHRhRGlyIDwgMCA/IE1hdGguY2VpbCgoZGVsdGFEaXItNDUpLzkwKSA6IE1hdGguZmxvb3IoKGRlbHRhRGlyKzQ1KS85MCk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKjkwKTtcbiAgICB9XG5cbiAgICBoYWxmRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBzcGxpdEF4aXM6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBsZXQgZGVnO1xuICAgICAgICBpZiAoc3BsaXRBeGlzLmlzVmVydGljYWwoKSkge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgMCAmJiBkZWx0YURpciA+PSAtMTgwKVxuICAgICAgICAgICAgICAgIGRlZyA9IC05MDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSA5MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDkwICYmIGRlbHRhRGlyID49IC05MClcbiAgICAgICAgICAgICAgICBkZWcgPSAwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDE4MDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyk7XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uQWRhcHRlciB7XG4gICAgYmFzZUNvb3JkczogVmVjdG9yO1xuICAgIHJvdGF0aW9uOiBSb3RhdGlvbjtcbiAgICBsYWJlbERpcjogUm90YXRpb247XG4gICAgaWQ6IHN0cmluZztcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZDtcbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGlvbklkOiBzdHJpbmcsIHB1YmxpYyBwcmVmZXJyZWRUcmFjazogc3RyaW5nKSB7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUF0U3RhdGlvbiB7XG4gICAgbGluZT86IExpbmU7XG4gICAgYXhpczogc3RyaW5nO1xuICAgIHRyYWNrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aW9uIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IExpbmVBdFN0YXRpb25bXX0gPSB7eDogW10sIHk6IFtdfTtcbiAgICBwcml2YXRlIGV4aXN0aW5nTGFiZWxzOiBMYWJlbFtdID0gW107XG4gICAgcHJpdmF0ZSBwaGFudG9tPzogTGluZUF0U3RhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogU3RhdGlvbkFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGdldCBiYXNlQ29vcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmJhc2VDb29yZHM7XG4gICAgfVxuXG4gICAgc2V0IGJhc2VDb29yZHMoYmFzZUNvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzID0gYmFzZUNvb3JkcztcbiAgICB9XG5cbiAgICBhZGRMaW5lKGxpbmU6IExpbmUsIGF4aXM6IHN0cmluZywgdHJhY2s6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBoYW50b20gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMaW5lc1theGlzXS5wdXNoKHtsaW5lOiBsaW5lLCBheGlzOiBheGlzLCB0cmFjazogdHJhY2t9KTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy54KTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy55KTtcbiAgICB9XG5cbiAgICBhZGRMYWJlbChsYWJlbDogTGFiZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmV4aXN0aW5nTGFiZWxzLmluY2x1ZGVzKGxhYmVsKSlcbiAgICAgICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGFiZWwobGFiZWw6IExhYmVsKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmV4aXN0aW5nTGFiZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMYWJlbHNbaV0gPT0gbGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4aXN0aW5nTGFiZWxzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxhYmVscygpOiBMYWJlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhpc3RpbmdMYWJlbHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVMaW5lQXRBeGlzKGxpbmU6IExpbmUsIGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiB2b2lkIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLmxpbmUgPT0gbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGhhbnRvbSA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nTGluZXNGb3JBeGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXhpc0FuZFRyYWNrRm9yRXhpc3RpbmdMaW5lKGxpbmVOYW1lOiBzdHJpbmcpOiBMaW5lQXRTdGF0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueCk7XG4gICAgICAgIGlmICh4ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMudHJhY2tGb3JMaW5lQXRBeGlzKGxpbmVOYW1lLCB0aGlzLmV4aXN0aW5nTGluZXMueSk7XG4gICAgICAgIGlmICh5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZTogc3RyaW5nLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lPy5uYW1lID09IGxpbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXNzaWduVHJhY2soYXhpczogc3RyaW5nLCBwcmVmZXJyZWRUcmFjazogUHJlZmVycmVkVHJhY2ssIGxpbmU6IExpbmUpOiBudW1iZXIgeyBcbiAgICAgICAgaWYgKHByZWZlcnJlZFRyYWNrLmhhc1RyYWNrTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay50cmFja051bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5waGFudG9tPy5saW5lPy5uYW1lID09IGxpbmUubmFtZSAmJiB0aGlzLnBoYW50b20/LmF4aXMgPT0gYXhpcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGhhbnRvbT8udHJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzKClbYXhpc107XG4gICAgICAgIHJldHVybiBwcmVmZXJyZWRUcmFjay5pc1Bvc2l0aXZlKCkgPyBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzFdICsgMSA6IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXNbMF0gLSAxO1xuICAgIH1cblxuICAgIHJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKGluY29taW5nRGlyOiBSb3RhdGlvbiwgYXNzaWduZWRUcmFjazogbnVtYmVyKTogVmVjdG9yIHsgXG4gICAgICAgIGxldCBuZXdDb29yZDogVmVjdG9yO1xuICAgICAgICBpZiAoaW5jb21pbmdEaXIuZGVncmVlcyAlIDE4MCA9PSAwKSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdDb29yZCA9IG5ldyBWZWN0b3IoMCwgYXNzaWduZWRUcmFjayAqIFN0YXRpb24uTElORV9ESVNUQU5DRSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Q29vcmQgPSBuZXdDb29yZC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgICAgIG5ld0Nvb3JkID0gdGhpcy5iYXNlQ29vcmRzLmFkZChuZXdDb29yZCk7XG4gICAgICAgIHJldHVybiBuZXdDb29yZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllcygpOiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzLngpLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy55KVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMoZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbMSwgLTFdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgbGV0IHJpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0gZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVmdCA+IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbGVmdCwgcmlnaHRdO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMYWJlbHMuZm9yRWFjaChsID0+IGwuZHJhdyhkZWxheVNlY29uZHMsIGZhbHNlKSk7XG4gICAgICAgIGNvbnN0IHQgPSBzdGF0aW9uLnBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdDsgfSk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHRvOiBWZWN0b3IpIHtcbiAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRhcHRlci5tb3ZlKGRlbGF5U2Vjb25kcywgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCB0aGlzLmJhc2VDb29yZHMsIHRvLCAoKSA9PiBzdGF0aW9uLmV4aXN0aW5nTGFiZWxzLmZvckVhY2gobCA9PiBsLmRyYXcoMCwgZmFsc2UpKSk7XG4gICAgfVxuXG4gICAgc3RhdGlvblNpemVGb3JBeGlzKGF4aXM6IHN0cmluZywgdmVjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZlY3RvciwgMCkpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY29uc3QgZGlyID0gTWF0aC5zaWduKHZlY3Rvcik7XG4gICAgICAgIGxldCBkaW1lbiA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10pW3ZlY3RvciA8IDAgPyAwIDogMV07XG4gICAgICAgIGlmIChkaXIqZGltZW4gPCAwKSB7XG4gICAgICAgICAgICBkaW1lbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgZGlyICogKFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOICsgU3RhdGlvbi5MQUJFTF9ESVNUQU5DRSk7XG4gICAgfVxuXG4gICAgbGluZXNFeGlzdGluZygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXhpc3RpbmdMaW5lcy54Lmxlbmd0aCA+IDAgfHwgdGhpcy5leGlzdGluZ0xpbmVzLnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbEFkYXB0ZXIsIExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdMYWJlbCBpbXBsZW1lbnRzIExhYmVsQWRhcHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuXG4gICAgfVxuXG4gICAgZ2V0IGZyb20oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ2Zyb20nKTtcbiAgICB9XG5cbiAgICBnZXQgdG8oKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbnQoJ3RvJyk7XG4gICAgfVxuXG4gICAgZ2V0IGZvclN0YXRpb24oKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXRpb247XG4gICAgfVxuXG4gICAgZ2V0IGZvckxpbmUoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kYXRhc2V0LmxpbmU7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCk6IHt0bDogVmVjdG9yLCBicjogVmVjdG9yfSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpO1xuICAgICAgICAgICAgcmV0dXJuIHt0bDogbmV3IFZlY3RvcihyLmxlZnQsIHIudG9wKSwgYnI6IG5ldyBWZWN0b3Ioci5yaWdodCwgci5ib3R0b20pfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3RsOiBWZWN0b3IuTlVMTCwgYnI6IFZlY3Rvci5OVUxMfTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbiwgY2hpbGRyZW46IExhYmVsQWRhcHRlcltdKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGFiZWwuZHJhdygwLCB0ZXh0Q29vcmRzLCBsYWJlbERpciwgY2hpbGRyZW4pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENvb3JkKHRoaXMuZWxlbWVudCwgdGV4dENvb3Jkcyk7XG5cbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd0xpbmVMYWJlbHMobGFiZWxEaXIsIGNoaWxkcmVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1N0YXRpb25MYWJlbChsYWJlbERpcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYW5zbGF0ZShib3hEaW1lbjogVmVjdG9yLCBsYWJlbERpcjogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgbGFiZWx1bml0diA9IFZlY3Rvci5VTklULnJvdGF0ZShsYWJlbERpcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di54LCBbLWJveERpbWVuLnggKyAncHgnLCAtYm94RGltZW4ueC8yICsgJ3B4JywgJzBweCddKVxuICAgICAgICAgICAgKyAnLCdcbiAgICAgICAgICAgICsgVXRpbHMudHJpbGVtbWEobGFiZWx1bml0di55LCBbLUxhYmVsLkxBQkVMX0hFSUdIVCArICdweCcsIC1MYWJlbC5MQUJFTF9IRUlHSFQvMiArICdweCcsICcwcHgnXSkgLy8gVE9ETyBtYWdpYyBudW1iZXJzXG4gICAgICAgICAgICArICcpJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGluZUxhYmVscyhsYWJlbERpcjogUm90YXRpb24sIGNoaWxkcmVuOiBMYWJlbEFkYXB0ZXJbXSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICBpZiAoYyBpbnN0YW5jZW9mIFN2Z0xhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3TGluZUxhYmVsKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC9NYXRoLm1heCh0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCAxKTtcbiAgICAgICAgY29uc3QgYmJveCA9IHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3RvcihiYm94LndpZHRoL3NjYWxlLCBiYm94LmhlaWdodC9zY2FsZSksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMaW5lTGFiZWwobGFiZWw6IFN2Z0xhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxpbmVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcsICdkaXYnKTtcbiAgICAgICAgbGluZUxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsLmNsYXNzTmFtZXM7XG4gICAgICAgIGxpbmVMYWJlbC5pbm5lckhUTUwgPSBsYWJlbC50ZXh0O1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQobGluZUxhYmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTdGF0aW9uTGFiZWwobGFiZWxEaXI6IFJvdGF0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsLmluY2x1ZGVzKCdmb3Itc3RhdGlvbicpKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsICs9ICcgZm9yLXN0YXRpb24nO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZG9taW5hbnRCYXNlbGluZSA9ICdoYW5naW5nJztcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3Rvcih0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLndpZHRoLCB0aGlzLmVsZW1lbnQuZ2V0QkJveCgpLmhlaWdodCksIGxhYmVsRGlyKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxhYmVsLmVyYXNlKDApOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q29vcmQoZWxlbWVudDogYW55LCBjb29yZDogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgY29vcmQueCk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd5JywgY29vcmQueSk7XG4gICAgfVxuXG4gICAgZ2V0IGNsYXNzTmFtZXMoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArICcgJyArIHRoaXMuZm9yTGluZTtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBjbG9uZUZvclN0YXRpb24oc3RhdGlvbklkOiBzdHJpbmcpOiBMYWJlbEFkYXB0ZXIge1xuICAgICAgICBjb25zdCBsaW5lTGFiZWw6IFNWR0dyYXBoaWNzRWxlbWVudCA9IDxTVkdHcmFwaGljc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z05ldHdvcmsuU1ZHTlMsICdmb3JlaWduT2JqZWN0Jyk7XG4gICAgICAgIGxpbmVMYWJlbC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIGZvci1saW5lJztcbiAgICAgICAgbGluZUxhYmVsLmRhdGFzZXQuc3RhdGlvbiA9IHN0YXRpb25JZDtcbiAgICAgICAgbGluZUxhYmVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMScpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnLCAnZGl2Jyk7XG4gICAgICAgIGxpbmVMYWJlbC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgIFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGlvbnMnKT8uYXBwZW5kQ2hpbGQobGluZUxhYmVsKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdmdMYWJlbChsaW5lTGFiZWwpXG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IExpbmVBZGFwdGVyLCBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBTdG9wIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdMaW5lIGltcGxlbWVudHMgTGluZUFkYXB0ZXIge1xuXG4gICAgcHJpdmF0ZSBfc3RvcHM6IFN0b3BbXSA9IFtdO1xuICAgIGJvdW5kaW5nQm94ID0ge3RsOiBWZWN0b3IuTlVMTCwgYnI6IFZlY3Rvci5OVUxMfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lIHx8ICcnO1xuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIGdldCB3ZWlnaHQoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0Lmxlbmd0aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZWxlbWVudC5kYXRhc2V0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVCb3VuZGluZ0JveChwYXRoOiBWZWN0b3JbXSk6IHZvaWQge1xuICAgICAgICBmb3IobGV0IGk9MDtpPHBhdGgubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC50bCA9IHRoaXMuYm91bmRpbmdCb3gudGwuYm90aEF4aXNNaW5zKHBhdGhbaV0pO1xuICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0JveC5iciA9IHRoaXMuYm91bmRpbmdCb3guYnIuYm90aEF4aXNNYXhzKHBhdGhbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnN0YW50KGZyb21PclRvOiBzdHJpbmcpOiBJbnN0YW50IHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuZWxlbWVudC5kYXRhc2V0W2Zyb21PclRvXT8uc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgaWYgKGFyciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5zdGFudC5mcm9tKGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluc3RhbnQuQklHX0JBTkc7XG4gICAgfVxuXG5cbiAgICBnZXQgc3RvcHMoKTogU3RvcFtdIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0b3BzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdG9wcz8uc3BsaXQoL1xccysvKSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRva2Vucz8ubGVuZ3RoO2krKykgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5zW2ldWzBdICE9ICctJyAmJiB0b2tlbnNbaV1bMF0gIT0gJysnICYmIHRva2Vuc1tpXVswXSAhPSAnKicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3Auc3RhdGlvbklkID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdG9wcy5wdXNoKG5leHRTdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdG9wLnByZWZlcnJlZFRyYWNrID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcHM7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdLCBsZW5ndGg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KHBhdGgpO1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGxpbmUuZHJhdygwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHBhdGgsIGxlbmd0aCk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnICcgKyB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuY3JlYXRlUGF0aChwYXRoKTtcbiAgICBcbiAgICAgICAgdGhpcy51cGRhdGVEYXNoYXJyYXkobGVuZ3RoKTsgICAgICAgIFxuICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUobGVuZ3RoLCAwLCAtbGVuZ3RoL2FuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcy9TdmdOZXR3b3JrLkZQUyk7XG4gICAgfVxuXG4gICAgbW92ZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIGZyb206IFZlY3RvcltdLCB0bzogVmVjdG9yW10pIHtcbiAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCh0byk7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgbGluZS5tb3ZlKDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgZnJvbSwgdG8pOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgMCwgMS9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMpO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbiwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxpbmUuZXJhc2UoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCByZXZlcnNlLCBsZW5ndGgpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZnJvbSA9IDA7XG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvblNlY29uZHMgPT0gMCkge1xuICAgICAgICAgICAgZnJvbSA9IGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSByZXZlcnNlID8gLTEgOiAxO1xuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZShmcm9tLCBsZW5ndGggKiBkaXJlY3Rpb24sIGxlbmd0aC9hbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMgKiBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGF0aChwYXRoOiBWZWN0b3JbXSkge1xuICAgICAgICBjb25zdCBkID0gJ00nICsgcGF0aC5tYXAodiA9PiB2LngrJywnK3YueSkuam9pbignIEwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGFzaGFycmF5KGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBkYXNoZWRQYXJ0ID0gbGVuZ3RoICsgJyc7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC5kYXNoSW5pdGlhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLnN0cm9rZURhc2hhcnJheS5yZXBsYWNlKC9bXjAtOVxccyxdKy9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcmVzZXRBcnJheSA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmRhc2hJbml0aWFsLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgICAgICBpZiAocHJlc2V0QXJyYXkubGVuZ3RoICUgMiA9PSAxKVxuICAgICAgICAgICAgICAgIHByZXNldEFycmF5ID0gcHJlc2V0QXJyYXkuY29uY2F0KHByZXNldEFycmF5KTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldExlbmd0aCA9IHByZXNldEFycmF5Lm1hcChhID0+IHBhcnNlSW50KGEpIHx8IDApLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuICAgICAgICAgICAgZGFzaGVkUGFydCA9IG5ldyBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gcHJlc2V0TGVuZ3RoICsgMSkpLmpvaW4ocHJlc2V0QXJyYXkuam9pbignICcpICsgJyAnKSArICcwJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gZGFzaGVkUGFydCArICcgJyArIGxlbmd0aDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyLCBhbmltYXRpb25QZXJGcmFtZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChhbmltYXRpb25QZXJGcmFtZSA8IDAgJiYgZnJvbSA+IHRvIHx8IGFuaW1hdGlvblBlckZyYW1lID4gMCAmJiBmcm9tIDwgdG8pIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gZnJvbSArICcnO1xuICAgICAgICAgICAgZnJvbSArPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbGluZS5hbmltYXRlRnJhbWUoZnJvbSwgdG8sIGFuaW1hdGlvblBlckZyYW1lKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHRvICsgJyc7XG4gICAgICAgICAgICBpZiAodG8gIT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tOiBWZWN0b3JbXSwgdG86IFZlY3RvcltdLCB4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHggPCAxKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZWQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVkLnB1c2goZnJvbVtpXS5iZXR3ZWVuKHRvW2ldLCB4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURhc2hhcnJheShpbnRlcnBvbGF0ZWRbMF0uZGVsdGEoaW50ZXJwb2xhdGVkW2ludGVycG9sYXRlZC5sZW5ndGgtMV0pLmxlbmd0aCk7IC8vIFRPRE8gYXJiaXRyYXJ5IG5vZGUgY291bnRcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGF0aChpbnRlcnBvbGF0ZWQpO1xuXG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgeCwgYW5pbWF0aW9uUGVyRnJhbWUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGFzaGFycmF5KHRvWzBdLmRlbHRhKHRvW3RvLmxlbmd0aC0xXSkubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGF0aCh0byk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgTmV0d29ya0FkYXB0ZXIsIE5ldHdvcmssIFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFN2Z0xpbmUgfSBmcm9tIFwiLi9TdmdMaW5lXCI7XG5pbXBvcnQgeyBTdmdTdGF0aW9uIH0gZnJvbSBcIi4vU3ZnU3RhdGlvblwiO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwiLi9MYWJlbFwiO1xuaW1wb3J0IHsgU3ZnTGFiZWwgfSBmcm9tIFwiLi9TdmdMYWJlbFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTmV0d29yayBpbXBsZW1lbnRzIE5ldHdvcmtBZGFwdGVyIHtcblxuICAgIHN0YXRpYyBGUFMgPSA2MDtcbiAgICBzdGF0aWMgU1ZHTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRab29tQ2VudGVyOiBWZWN0b3IgPSBWZWN0b3IuTlVMTDtcbiAgICBwcml2YXRlIGN1cnJlbnRab29tU2NhbGU6IG51bWJlciA9IDE7XG5cbiAgICBnZXQgY2FudmFzU2l6ZSgpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgICAgY29uc3QgYm94ID0gc3ZnPy52aWV3Qm94LmJhc2VWYWw7XG4gICAgICAgIGlmIChib3gpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFZlY3Rvci5OVUxMOyAgICAgICAgXG4gICAgfVxuXG4gICAgZ2V0IGJlY2tTdHlsZSgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICAgIHJldHVybiBzdmc/LmRhdGFzZXQuYmVja1N0eWxlICE9ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZCB7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbGVtZW50cycpPy5jaGlsZHJlbjtcbiAgICAgICAgaWYgKGVsZW1lbnRzID09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUGxlYXNlIGRlZmluZSB0aGUgXCJlbGVtZW50c1wiIGdyb3VwLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudDogVGltZWREcmF3YWJsZSB8IG51bGwgPSB0aGlzLm1pcnJvckVsZW1lbnQoZWxlbWVudHNbaV0sIG5ldHdvcmspO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuYWRkVG9JbmRleChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWlycm9yRWxlbWVudChlbGVtZW50OiBhbnksIG5ldHdvcms6IFN0YXRpb25Qcm92aWRlcik6IFRpbWVkRHJhd2FibGUgfCBudWxsIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lKG5ldyBTdmdMaW5lKGVsZW1lbnQpLCBuZXR3b3JrLCB0aGlzLmJlY2tTdHlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3RleHQnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExhYmVsKG5ldyBTdmdMYWJlbChlbGVtZW50KSwgbmV0d29yayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCBudWxsIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgaWYgKGVsZW1lbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0YXRpb24obmV3IFN2Z1N0YXRpb24oPFNWR1JlY3RFbGVtZW50PiA8dW5rbm93bj5lbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgaGVscFN0b3AgPSA8U1ZHUmVjdEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdOZXR3b3JrLlNWR05TLCAncmVjdCcpO1xuICAgICAgICBoZWxwU3RvcC5pZCA9IGlkOyAgICBcbiAgICAgICAgaGVscFN0b3Auc2V0QXR0cmlidXRlKCdkYXRhLWRpcicsIHJvdGF0aW9uLm5hbWUpO1xuICAgICAgICB0aGlzLnNldENvb3JkKGhlbHBTdG9wLCBiYXNlQ29vcmRzKTtcbiAgICAgICAgaGVscFN0b3AuY2xhc3NOYW1lLmJhc2VWYWwgPSAnaGVscGVyJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpb25zJyk/LmFwcGVuZENoaWxkKGhlbHBTdG9wKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGhlbHBTdG9wKSk7ICBcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzZXRDb29yZChlbGVtZW50OiBhbnksIGNvb3JkOiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3gnLCBjb29yZC54KTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBjb29yZC55KTtcbiAgICB9XG5cbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgZXBvY2hMYWJlbDtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXBvY2hMYWJlbCA9IDxTVkdUZXh0RWxlbWVudD4gPHVua25vd24+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpO1xuICAgICAgICAgICAgZXBvY2hMYWJlbC50ZXh0Q29udGVudCA9IGVwb2NoOyAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgIFxuICAgIHpvb21Ubyh6b29tQ2VudGVyOiBWZWN0b3IsIHpvb21TY2FsZTogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlcikge1xuICAgICAgICBjb25zb2xlLmxvZyh6b29tQ2VudGVyLCB6b29tU2NhbGUpO1xuICAgICAgICB0aGlzLmFuaW1hdGVGcmFtZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMvU3ZnTmV0d29yay5GUFMsIHRoaXMuY3VycmVudFpvb21DZW50ZXIsIHpvb21DZW50ZXIsIHRoaXMuY3VycmVudFpvb21TY2FsZSwgem9vbVNjYWxlKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Wm9vbUNlbnRlciA9IHpvb21DZW50ZXI7XG4gICAgICAgIHRoaXMuY3VycmVudFpvb21TY2FsZSA9IHpvb21TY2FsZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZSh4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIsIGZyb21DZW50ZXI6IFZlY3RvciwgdG9DZW50ZXI6IFZlY3RvciwgZnJvbVNjYWxlOiBudW1iZXIsIHRvU2NhbGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoeCA8IDEpIHtcbiAgICAgICAgICAgIHggKz0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBlYXNlID0gdGhpcy5lYXNlKHgpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBmcm9tQ2VudGVyLmRlbHRhKHRvQ2VudGVyKVxuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlY3RvcihkZWx0YS54ICogZWFzZSwgZGVsdGEueSAqIGVhc2UpLmFkZChmcm9tQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gKHRvU2NhbGUgLSBmcm9tU2NhbGUpICogZWFzZSArIGZyb21TY2FsZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbShjZW50ZXIsIHNjYWxlKTtcbiAgICAgICAgICAgIGNvbnN0IG5ldHdvcmsgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbmV0d29yay5hbmltYXRlRnJhbWUoeCwgYW5pbWF0aW9uUGVyRnJhbWUsIGZyb21DZW50ZXIsIHRvQ2VudGVyLCBmcm9tU2NhbGUsIHRvU2NhbGUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWm9vbSh0b0NlbnRlciwgdG9TY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGVhc2UoeDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB4IDwgMC41ID8gNCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAzKSAvIDI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGNlbnRlcjogVmVjdG9yLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHpvb21hYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3pvb21hYmxlJyk7XG4gICAgICAgIGlmICh6b29tYWJsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHpvb21hYmxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgem9vbWFibGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZSArICcpIHRyYW5zbGF0ZSgnICsgKHRoaXMuY2FudmFzU2l6ZS54IC8gMiAtIGNlbnRlci54KSArICdweCwnICsgKHRoaXMuY2FudmFzU2l6ZS55IC8gMiAtIGNlbnRlci55KSArICdweCknO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU3RhdGlvbkFkYXB0ZXIsIFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN2Z05ldHdvcmsgfSBmcm9tIFwiLi9TdmdOZXR3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdTdGF0aW9uIGltcGxlbWVudHMgU3RhdGlvbkFkYXB0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUmVjdEVsZW1lbnQpIHtcblxuICAgIH1cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pZDtcbiAgICB9XG4gICAgZ2V0IGJhc2VDb29yZHMoKTogVmVjdG9yIHsgICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihwYXJzZUludCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd4JykgfHwgJycpIHx8IDAsIHBhcnNlSW50KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3knKSB8fCAnJykgfHwgMCk7XG4gICAgfVxuICAgIHNldCBiYXNlQ29vcmRzKGJhc2VDb29yZHM6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgYmFzZUNvb3Jkcy54ICsgJycpOyBcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGJhc2VDb29yZHMueSArICcnKTsgXG4gICAgfVxuXG4gICAgZ2V0IHJvdGF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQuZGlyIHx8ICduJyk7XG4gICAgfVxuICAgIGdldCBsYWJlbERpcigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmxhYmVsRGlyIHx8ICduJyk7XG4gICAgfVxuXG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzOiAoKSA9PiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhdGlvbi5kcmF3KDAsIGdldFBvc2l0aW9uQm91bmRhcmllcyk7IH0sIGRlbGF5U2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllcyA9IGdldFBvc2l0aW9uQm91bmRhcmllcygpO1xuICAgICAgICBjb25zdCBzdG9wRGltZW4gPSBbcG9zaXRpb25Cb3VuZGFyaWVzLnhbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgcG9zaXRpb25Cb3VuZGFyaWVzLnlbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueVswXV07XG4gICAgICAgIFxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9IHN0b3BEaW1lblswXSA8IDAgJiYgc3RvcERpbWVuWzFdIDwgMCA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKE1hdGgubWF4KHN0b3BEaW1lblswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIChNYXRoLm1heChzdG9wRGltZW5bMV0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFICsgU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4pICsgJycpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybU9yaWdpbigpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCdyb3RhdGUoJyArIHRoaXMucm90YXRpb24uZGVncmVlcyArICcpIHRyYW5zbGF0ZSgnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnLCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnlbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcpJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUcmFuc2Zvcm1PcmlnaW4oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCB0aGlzLmJhc2VDb29yZHMueCArICcgJyArIHRoaXMuYmFzZUNvb3Jkcy55KTtcbiAgICB9XG5cbiAgICBtb3ZlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlvbiA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhdGlvbi5tb3ZlKDAsIGFuaW1hdGlvbkR1cmF0aW9uU2Vjb25kcywgZnJvbSwgdG8sIGNhbGxiYWNrKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWVWZWN0b3IoZnJvbSwgdG8sIDAsIDEvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z05ldHdvcmsuRlBTLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWVWZWN0b3IoZnJvbTogVmVjdG9yLCB0bzogVmVjdG9yLCB4OiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIGlmICh4IDwgMSkge1xuICAgICAgICAgICAgdGhpcy5iYXNlQ29vcmRzID0gZnJvbS5iZXR3ZWVuKHRvLCB4KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB4ICs9IGFuaW1hdGlvblBlckZyYW1lO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsaW5lLmFuaW1hdGVGcmFtZVZlY3Rvcihmcm9tLCB0bywgeCwgYW5pbWF0aW9uUGVyRnJhbWUsIGNhbGxiYWNrKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VDb29yZHMgPSB0bztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtT3JpZ2luKCk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufSIsImV4cG9ydCBjbGFzcyBVdGlscyB7XG4gICAgc3RhdGljIHJlYWRvbmx5IElNUFJFQ0lTSU9OOiBudW1iZXIgPSAwLjAwMTtcblxuICAgIHN0YXRpYyBlcXVhbHMoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKSA8IFV0aWxzLklNUFJFQ0lTSU9OO1xuICAgIH1cblxuICAgIHN0YXRpYyB0cmlsZW1tYShpbnQ6IG51bWJlciwgb3B0aW9uczogW3N0cmluZywgc3RyaW5nLCBzdHJpbmddKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhpbnQsIDApKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1sxXTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnQgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1syXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uc1swXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWxwaGFiZXRpY0lkKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGEgPCBiKVxuICAgICAgICAgICAgcmV0dXJuIGEgKyAnXycgKyBiO1xuICAgICAgICByZXR1cm4gYiArICdfJyArIGE7XG4gICAgfVxufSIsImltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFZlY3RvciB7XG4gICAgc3RhdGljIFVOSVQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgLTEpO1xuICAgIHN0YXRpYyBOVUxMOiBWZWN0b3IgPSBuZXcgVmVjdG9yKDAsIDApO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIGdldCB4KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cblxuICAgIGdldCB5KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsIDIpICsgTWF0aC5wb3codGhpcy55LCAyKSk7XG4gICAgfVxuXG4gICAgd2l0aExlbmd0aChsZW5ndGg6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gdGhpcy5sZW5ndGggIT0gMCA/IGxlbmd0aC90aGlzLmxlbmd0aCA6IDA7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCpyYXRpbywgdGhpcy55KnJhdGlvKTtcbiAgICB9XG5cbiAgICBhZGQodGhhdCA6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCArIHRoYXQueCwgdGhpcy55ICsgdGhhdC55KTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGF0LnggLSB0aGlzLngsIHRoYXQueSAtIHRoaXMueSk7XG4gICAgfVxuXG4gICAgcm90YXRlKHRoZXRhOiBSb3RhdGlvbik6IFZlY3RvciB7XG4gICAgICAgIGxldCByYWQ6IG51bWJlciA9IHRoZXRhLnJhZGlhbnM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCAqIE1hdGguY29zKHJhZCkgLSB0aGlzLnkgKiBNYXRoLnNpbihyYWQpLCB0aGlzLnggKiBNYXRoLnNpbihyYWQpICsgdGhpcy55ICogTWF0aC5jb3MocmFkKSk7XG4gICAgfVxuXG4gICAgZG90UHJvZHVjdCh0aGF0OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54KnRoYXQueCt0aGlzLnkqdGhhdC55O1xuICAgIH1cblxuICAgIHNvbHZlRGVsdGFGb3JJbnRlcnNlY3Rpb24oZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiB7YTogbnVtYmVyLCBiOiBudW1iZXJ9IHtcbiAgICAgICAgY29uc3QgZGVsdGE6IFZlY3RvciA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHN3YXBaZXJvRGl2aXNpb24gPSBVdGlscy5lcXVhbHMoZGlyMi55LCAwKTtcbiAgICAgICAgY29uc3QgeCA9IHN3YXBaZXJvRGl2aXNpb24gPyAneScgOiAneCc7XG4gICAgICAgIGNvbnN0IHkgPSBzd2FwWmVyb0RpdmlzaW9uID8gJ3gnIDogJ3knO1xuICAgICAgICBjb25zdCBkZW5vbWluYXRvciA9IChkaXIxW3ldKmRpcjJbeF0tZGlyMVt4XSpkaXIyW3ldKTtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhkZW5vbWluYXRvciwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7YTogTmFOLCBiOiBOYU59O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGEgPSAoZGVsdGFbeV0qZGlyMlt4XS1kZWx0YVt4XSpkaXIyW3ldKS9kZW5vbWluYXRvcjtcbiAgICAgICAgY29uc3QgYiA9IChhKmRpcjFbeV0tZGVsdGFbeV0pL2RpcjJbeV07XG4gICAgICAgIHJldHVybiB7YSwgYn07XG4gICAgfVxuXG4gICAgaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwoZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsRXF1YWxaZXJvKHRoaXMueCwgZGlyMS54LCBkaXIyLngpIHx8IHRoaXMuYWxsRXF1YWxaZXJvKHRoaXMueSwgZGlyMS55LCBkaXIyLnkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWxsRXF1YWxaZXJvKG4xOiBudW1iZXIsIG4yOiBudW1iZXIsIG4zOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmVxdWFscyhuMSwgMCkgJiYgVXRpbHMuZXF1YWxzKG4yLCAwKSAmJiBVdGlscy5lcXVhbHMobjMsIDApO1xuICAgIH1cblxuICAgIGluY2xpbmF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh0aGlzLngsIDApKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbih0aGlzLnkgPiAwID8gMTgwIDogMCk7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy55LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy54ID4gMCA/IDkwIDogLTkwKTtcbiAgICAgICAgY29uc3QgYWRqYWNlbnQgPSBuZXcgVmVjdG9yKDAsLU1hdGguYWJzKHRoaXMueSkpO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKChNYXRoLnNpZ24odGhpcy54KSpNYXRoLmFjb3ModGhpcy5kb3RQcm9kdWN0KGFkamFjZW50KS9hZGphY2VudC5sZW5ndGgvdGhpcy5sZW5ndGgpKjE4MC9NYXRoLlBJKSk7XG4gICAgfVxuXG4gICAgYm90aEF4aXNNaW5zKG90aGVyOiBWZWN0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gb3RoZXI7XG4gICAgICAgIGlmIChvdGhlciA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggPCBvdGhlci54ID8gdGhpcy54IDogb3RoZXIueCwgdGhpcy55IDwgb3RoZXIueSA/IHRoaXMueSA6IG90aGVyLnkpXG4gICAgfVxuXG4gICAgYm90aEF4aXNNYXhzKG90aGVyOiBWZWN0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMgPT0gVmVjdG9yLk5VTEwpXG4gICAgICAgICAgICByZXR1cm4gb3RoZXI7XG4gICAgICAgIGlmIChvdGhlciA9PSBWZWN0b3IuTlVMTClcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggPiBvdGhlci54ID8gdGhpcy54IDogb3RoZXIueCwgdGhpcy55ID4gb3RoZXIueSA/IHRoaXMueSA6IG90aGVyLnkpXG4gICAgfVxuXG4gICAgYmV0d2VlbihvdGhlcjogVmVjdG9yLCB4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLmRlbHRhKG90aGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGRlbHRhLndpdGhMZW5ndGgoZGVsdGEubGVuZ3RoKngpKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuXG5cblxuZXhwb3J0IGNsYXNzIFpvb21lciB7XG4gICAgc3RhdGljIFpPT01fRFVSQVRJT04gPSAxO1xuICAgIHN0YXRpYyBaT09NX01BWF9TQ0FMRSA9IDM7XG4gICAgc3RhdGljIFBBRERJTkdfRkFDVE9SID0gMjU7XG4gICAgXG4gICAgcHJpdmF0ZSBib3VuZGluZ0JveCA9IHt0bDogVmVjdG9yLk5VTEwsIGJyOiBWZWN0b3IuTlVMTH07XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXNTaXplOiBWZWN0b3IpIHtcblxuICAgIH1cblxuICAgIGluY2x1ZGUoYm91bmRpbmdCb3g6IHsgdGw6IFZlY3RvciwgYnI6IFZlY3RvciB9LCBub3c6IEluc3RhbnQsIHNob3VsZEFuaW1hdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHNob3VsZEFuaW1hdGUgJiYgbm93LmZsYWcgIT0gJ25vem9vbScpIHtcbiAgICAgICAgICAgIHRoaXMuYm91bmRpbmdCb3gudGwgPSB0aGlzLmJvdW5kaW5nQm94LnRsLmJvdGhBeGlzTWlucyhib3VuZGluZ0JveC50bCk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nQm94LmJyID0gdGhpcy5ib3VuZGluZ0JveC5ici5ib3RoQXhpc01heHMoYm91bmRpbmdCb3guYnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbmZvcmNlZEJvdW5kaW5nQm94KCk6IHt0bDogVmVjdG9yLCBicjogVmVjdG9yfSB7XG4gICAgICAgIGlmICh0aGlzLmJvdW5kaW5nQm94LnRsICE9IFZlY3Rvci5OVUxMICYmIHRoaXMuYm91bmRpbmdCb3guYnIgIT0gVmVjdG9yLk5VTEwpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZGRlZEJvdW5kaW5nQm94ID0gdGhpcy5wYWRkZWRCb3VuZGluZ0JveCgpO1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBwYWRkZWRCb3VuZGluZ0JveC50bC5kZWx0YShwYWRkZWRCb3VuZGluZ0JveC5icik7XG4gICAgICAgICAgICBjb25zdCBtaW5ab29tU2l6ZSA9IG5ldyBWZWN0b3IodGhpcy5jYW52YXNTaXplLnggLyBab29tZXIuWk9PTV9NQVhfU0NBTEUsIHRoaXMuY2FudmFzU2l6ZS55IC8gWm9vbWVyLlpPT01fTUFYX1NDQUxFKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gem9vbVNpemUuZGVsdGEobWluWm9vbVNpemUpO1xuICAgICAgICAgICAgY29uc3QgYWRkaXRpb25hbFNwYWNpbmcgPSBuZXcgVmVjdG9yKE1hdGgubWF4KDAsIGRlbHRhLngvMiksIE1hdGgubWF4KDAsIGRlbHRhLnkvMikpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRsOiBwYWRkZWRCb3VuZGluZ0JveC50bC5hZGQoYWRkaXRpb25hbFNwYWNpbmcucm90YXRlKG5ldyBSb3RhdGlvbigxODApKSksXG4gICAgICAgICAgICAgICAgYnI6IHBhZGRlZEJvdW5kaW5nQm94LmJyLmFkZChhZGRpdGlvbmFsU3BhY2luZylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmRpbmdCb3g7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYWRkZWRCb3VuZGluZ0JveCgpOiB7dGw6IFZlY3RvciwgYnI6IFZlY3Rvcn0ge1xuICAgICAgICBjb25zdCBwYWRkaW5nID0gKHRoaXMuY2FudmFzU2l6ZS54ICsgdGhpcy5jYW52YXNTaXplLnkpL1pvb21lci5QQURESU5HX0ZBQ1RPUjtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRsOiB0aGlzLmJvdW5kaW5nQm94LnRsLmFkZChuZXcgVmVjdG9yKC1wYWRkaW5nLCAtcGFkZGluZykpLFxuICAgICAgICAgICAgYnI6IHRoaXMuYm91bmRpbmdCb3guYnIuYWRkKG5ldyBWZWN0b3IocGFkZGluZywgcGFkZGluZykpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IGNlbnRlcigpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBlbmZvcmNlZEJvdW5kaW5nQm94ID0gdGhpcy5lbmZvcmNlZEJvdW5kaW5nQm94KCk7XG4gICAgICAgIGlmIChlbmZvcmNlZEJvdW5kaW5nQm94LnRsICE9IFZlY3Rvci5OVUxMICYmIGVuZm9yY2VkQm91bmRpbmdCb3guYnIgIT0gVmVjdG9yLk5VTEwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueCArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueCkvMiksIFxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGVuZm9yY2VkQm91bmRpbmdCb3gudGwueSArIGVuZm9yY2VkQm91bmRpbmdCb3guYnIueSkvMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMuY2FudmFzU2l6ZS54IC8gMiwgdGhpcy5jYW52YXNTaXplLnkgLyAyKTs7XG4gICAgfVxuXG4gICAgZ2V0IHNjYWxlKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGVuZm9yY2VkQm91bmRpbmdCb3ggPSB0aGlzLmVuZm9yY2VkQm91bmRpbmdCb3goKTtcbiAgICAgICAgaWYgKGVuZm9yY2VkQm91bmRpbmdCb3gudGwgIT0gVmVjdG9yLk5VTEwgJiYgZW5mb3JjZWRCb3VuZGluZ0JveC5iciAhPSBWZWN0b3IuTlVMTCkge1xuICAgICAgICAgICAgY29uc3Qgem9vbVNpemUgPSBlbmZvcmNlZEJvdW5kaW5nQm94LnRsLmRlbHRhKGVuZm9yY2VkQm91bmRpbmdCb3guYnIpO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMuY2FudmFzU2l6ZS54IC8gem9vbVNpemUueCwgdGhpcy5jYW52YXNTaXplLnkgLyB6b29tU2l6ZS55KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5cbi8vIFRPRE86IGVyYXNlIGFuaW0sIGxhYmVscywgbmVnYXRpdmUgZGVmYXVsdCB0cmFja3MgYmFzZWQgb24gZGlyZWN0aW9uLCByZWpvaW4gbGluZXMgdHJhY2sgc2VsZWN0aW9uXG5cbmNvbnN0IG5ldHdvcms6IE5ldHdvcmsgPSBuZXcgTmV0d29yayhuZXcgU3ZnTmV0d29yaygpKTtcbm5ldHdvcmsuaW5pdGlhbGl6ZSgpO1xuXG5jb25zdCBhbmltYXRlRnJvbUVwb2NoOiBudW1iZXIgPSBnZXRTdGFydEVwb2NoKCk7XG5zbGlkZShJbnN0YW50LkJJR19CQU5HLCBmYWxzZSk7XG5cbmZ1bmN0aW9uIGdldFN0YXJ0RXBvY2goKTogbnVtYmVyIHtcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaGFzaCAmJiBuZXR3b3JrLmlzRXBvY2hFeGlzdGluZyh3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpKSkge1xuICAgICAgICBjb25zdCBhbmltYXRlRnJvbUVwb2NoOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgICBjb25zb2xlLmxvZygnZmFzdCBmb3J3YXJkIHRvICcgKyBhbmltYXRlRnJvbUVwb2NoKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGFuaW1hdGVGcm9tRXBvY2gpIHx8IDA7XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBzbGlkZShpbnN0YW50OiBJbnN0YW50LCBhbmltYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGluc3RhbnQuZXBvY2ggPT0gYW5pbWF0ZUZyb21FcG9jaClcbiAgICAgICAgYW5pbWF0ZSA9IHRydWU7XG5cbiAgICBuZXR3b3JrLmRyYXdUaW1lZERyYXdhYmxlc0F0KGluc3RhbnQsIGFuaW1hdGUpO1xuICAgIGNvbnN0IG5leHQgPSBuZXR3b3JrLm5leHRJbnN0YW50KGluc3RhbnQpO1xuICAgIFxuICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gYW5pbWF0ZSA/IGluc3RhbnQuZGVsdGEobmV4dCkgOiAwO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2xpZGUobmV4dCwgYW5pbWF0ZSk7IH0sIGRlbGF5ICogMTAwMCk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==