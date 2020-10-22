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
            const baseCoord = station.baseCoords;
            const labelDir = station.labelDir;
            const stationDir = station.rotation;
            const diffDir = labelDir.add(new _Rotation__WEBPACK_IMPORTED_MODULE_0__["Rotation"](-stationDir.degrees));
            const unitv = _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].UNIT.rotate(diffDir);
            const anchor = new _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"](station.stationSizeForAxis('x', unitv.x), station.stationSizeForAxis('y', unitv.y));
            const textCoords = baseCoord.add(anchor.rotate(stationDir));
            this.adapter.draw(delay, textCoords, labelDir);
        }
        return 0;
    }
    erase(delay, animate, reverse) {
        throw new Error("Method not implemented.");
    }
}


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
    constructor(adapter, stationProvider) {
        this.adapter = adapter;
        this.stationProvider = stationProvider;
        this.from = this.adapter.from;
        this.to = this.adapter.to;
        this.name = this.adapter.name;
        this.precedingStop = undefined;
        this.precedingDir = undefined;
    }
    draw(delay, animate) {
        const stops = this.adapter.stops;
        const path = [];
        let track = new _PreferredTrack__WEBPACK_IMPORTED_MODULE_3__["PreferredTrack"]('+');
        for (let j = 0; j < stops.length; j++) {
            track = track.fromString(stops[j].preferredTrack);
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error('Station with ID ' + stops[j].stationId + ' is undefined');
            track = track.fromExistingLineAtStation(stop.axisAndTrackForExistingLine(this.name));
            this.createConnection(stop, this.nextStopBaseCoord(stops, j, stop.baseCoords), track, path, delay, animate, true);
            track = track.keepOnlySign();
        }
        let duration = this.getAnimationDuration(path, animate);
        this.adapter.draw(delay, duration, path);
        return duration;
    }
    erase(delay, animate, reverse) {
        this.adapter.erase(delay, 0, reverse);
        const stops = this.adapter.stops;
        for (let j = 0; j < stops.length; j++) {
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error('Station with ID ' + stops[j].stationId + ' is undefined');
            stop.removeLine(this);
            stop.draw(delay);
        }
        return 0;
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
            return delta.inclination().halfDirection(dir, existingAxis == 'x' ? new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](90) : new _Rotation__WEBPACK_IMPORTED_MODULE_1__["Rotation"](0));
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
            console.log(helpStopId, deg, fromDir);
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
}
Line.NODE_DISTANCE = 0;
Line.SPEED = 100;


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

class Network {
    constructor(adapter) {
        this.adapter = adapter;
        this.slideIndex = {};
        this.stations = {};
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
    createVirtualStop(id, baseCoords, rotation) {
        const stop = this.adapter.createVirtualStop(id, baseCoords, rotation);
        this.stations[id] = stop;
        return stop;
    }
    setInstant(instant) {
        if (!instant.equals(_Instant__WEBPACK_IMPORTED_MODULE_0__["Instant"].BIG_BANG)) {
            this.adapter.drawEpoch(instant.epoch + '');
        }
    }
    timedDrawablesAt(now) {
        return this.slideIndex[now.epoch][now.second];
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
        let smallest = null;
        for (const [key, value] of Object.entries(dict)) {
            if (parseInt(key) > threshold && (smallest == undefined || parseInt(key) < smallest)) {
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
        return new PreferredTrack(v == '+' || v == '-' ? v : '+');
    }
    hasTrackNumber() {
        return this.value.length > 1;
    }
    get trackNumber() {
        return parseInt(this.value);
    }
    isPositive() {
        return this.value[0] == '+';
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
        this.phantom = undefined;
        this.baseCoords = this.adapter.baseCoords;
        this.rotation = this.adapter.rotation;
        this.labelDir = this.adapter.labelDir;
        this.id = this.adapter.id;
    }
    addLine(line, axis, track) {
        this.existingLines[axis].push({ line: line, axis: axis, track: track });
    }
    removeLine(line) {
        this.removeLineAtAxis(line, this.existingLines.x);
        this.removeLineAtAxis(line, this.existingLines.y);
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
        this.adapter.draw(delaySeconds, function () { return station.positionBoundaries(); });
    }
    stationSizeForAxis(axis, vector) {
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].equals(vector, 0))
            return 0;
        const size = this.positionBoundariesForAxis(this.existingLines[axis])[vector < 0 ? 0 : 1] * Station.LINE_DISTANCE;
        return size + Math.sign(vector) * (Station.DEFAULT_STOP_DIMEN + Station.LABEL_DISTANCE);
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
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");



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
    draw(delaySeconds, textCoords, labelDir) {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function () { label.draw(0, textCoords, labelDir); }, delaySeconds * 1000);
            return;
        }
        this.setCoord(this.element, textCoords);
        const labelunitv = _Vector__WEBPACK_IMPORTED_MODULE_1__["Vector"].UNIT.rotate(labelDir);
        this.element.style.textAnchor = _Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].trilemma(labelunitv.x, ['end', 'middle', 'start']);
        this.element.style.dominantBaseline = _Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].trilemma(labelunitv.y, ['baseline', 'middle', 'hanging']);
        this.element.style.visibility = 'visible';
        this.element.className.baseVal += ' station';
    }
    erase(delaySeconds) {
        throw new Error("Method not implemented.");
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
    setCoord(element, coord) {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
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
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Station */ "./src/Station.ts");
/* harmony import */ var _Instant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Instant */ "./src/Instant.ts");


class SvgLine {
    constructor(element) {
        this.element = element;
        this._stops = [];
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
    get stops() {
        var _a;
        if (this._stops.length == 0) {
            const tokens = ((_a = this.element.dataset.stops) === null || _a === void 0 ? void 0 : _a.split(/\s+/)) || [];
            let nextStop = new _Station__WEBPACK_IMPORTED_MODULE_0__["Stop"]('', '');
            for (var i = 0; i < (tokens === null || tokens === void 0 ? void 0 : tokens.length); i++) {
                if (tokens[i][0] != '-' && tokens[i][0] != '+') {
                    nextStop.stationId = tokens[i];
                    this._stops.push(nextStop);
                    nextStop = new _Station__WEBPACK_IMPORTED_MODULE_0__["Stop"]('', '');
                }
                else {
                    nextStop.preferredTrack = tokens[i];
                }
            }
        }
        return this._stops;
    }
    draw(delaySeconds, animationDurationSeconds, path) {
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.draw(0, animationDurationSeconds, path); }, delaySeconds * 1000);
            return;
        }
        let length = this.getTotalLength(path);
        const d = 'M' + path.map(v => v.x + ',' + v.y).join(' L');
        this.element.setAttribute('d', d);
        let dashedPart = this.createDashedPart(length);
        this.element.style.strokeDasharray = dashedPart + ' ' + length;
        if (animationDurationSeconds == 0) {
            length = 0;
        }
        this.animateFrame(length, length / animationDurationSeconds / SvgLine.FPS);
    }
    createDashedPart(length) {
        let dashedPart = length + '';
        const presetDash = getComputedStyle(this.element).strokeDasharray.replace(/[^0-9\s,]+/g, '');
        if (presetDash.length > 0) {
            let presetArray = presetDash.split(/[\s,]+/);
            if (presetArray.length % 2 == 1)
                presetArray = presetArray.concat(presetArray);
            const presetLength = presetArray.map(a => parseInt(a) || 0).reduce((a, b) => a + b, 0);
            dashedPart = new Array(Math.ceil(length / presetLength + 1)).join(presetArray.join(' ') + ' ') + '0';
        }
        return dashedPart;
    }
    erase(delaySeconds, animationDurationSeconds, reverse) {
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.erase(0, animationDurationSeconds, reverse); }, delaySeconds * 1000);
            return;
        }
        this.element.setAttribute('d', '');
    }
    animateFrame(length, animationPerFrame) {
        if (length > 0) {
            this.element.style.strokeDashoffset = length + '';
            length -= animationPerFrame;
            const line = this;
            window.requestAnimationFrame(function () { line.animateFrame(length, animationPerFrame); });
        }
        else {
            this.element.style.strokeDashoffset = '0';
        }
    }
    getTotalLength(path) {
        let length = 0;
        for (let i = 0; i < path.length - 1; i++) {
            length += path[i].delta(path[i + 1]).length;
        }
        return length;
    }
}
SvgLine.FPS = 60;


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
/* harmony import */ var _Station__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Station */ "./src/Station.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Line */ "./src/Line.ts");
/* harmony import */ var _SvgLine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SvgLine */ "./src/SvgLine.ts");
/* harmony import */ var _SvgStation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SvgStation */ "./src/SvgStation.ts");
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Label */ "./src/Label.ts");
/* harmony import */ var _SvgLabel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SvgLabel */ "./src/SvgLabel.ts");






class SvgNetwork {
    constructor() {
        this.svgns = "http://www.w3.org/2000/svg";
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
            return new _Line__WEBPACK_IMPORTED_MODULE_1__["Line"](new _SvgLine__WEBPACK_IMPORTED_MODULE_2__["SvgLine"](element), network);
        }
        else if (element.localName == 'text') {
            return new _Label__WEBPACK_IMPORTED_MODULE_4__["Label"](new _SvgLabel__WEBPACK_IMPORTED_MODULE_5__["SvgLabel"](element), network);
        }
        return null;
    }
    stationById(id) {
        const element = document.getElementById(id);
        if (element != undefined) {
            return new _Station__WEBPACK_IMPORTED_MODULE_0__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_3__["SvgStation"](element));
        }
        return null;
    }
    createVirtualStop(id, baseCoords, rotation) {
        var _a;
        const helpStop = document.createElementNS(this.svgns, 'rect');
        helpStop.id = id;
        helpStop.setAttribute('data-dir', rotation.name);
        this.setCoord(helpStop, baseCoords);
        helpStop.className.baseVal = 'helper';
        (_a = document.getElementById('stations')) === null || _a === void 0 ? void 0 : _a.appendChild(helpStop);
        return new _Station__WEBPACK_IMPORTED_MODULE_0__["Station"](new _SvgStation__WEBPACK_IMPORTED_MODULE_3__["SvgStation"](helpStop));
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
}


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
        const baseCoord = this.baseCoords;
        const stopDimen = [Math.max(positionBoundaries.x[1] - positionBoundaries.x[0], 0), Math.max(positionBoundaries.y[1] - positionBoundaries.y[0], 0)];
        this.element.setAttribute('width', (stopDimen[0] * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE + _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN) + '');
        this.element.setAttribute('height', (stopDimen[1] * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE + _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN) + '');
        this.element.setAttribute('transform', 'rotate(' + this.rotation.degrees + ' ' + baseCoord.x + ' ' + baseCoord.y + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE - _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].LINE_DISTANCE - _Station__WEBPACK_IMPORTED_MODULE_0__["Station"].DEFAULT_STOP_DIMEN / 2) + ')');
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
        const ratio = length / this.length;
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
}
Vector.UNIT = new Vector(0, -1);


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



// TODO: erase anim, labels, zoom, negative default tracks based on direction, reuse track of just erased line?
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
    network.setInstant(instant);
    const elements = network.timedDrawablesAt(instant);
    let delay = 0;
    for (let i = 0; i < elements.length; i++) {
        delay += drawOrEraseElement(elements[i], delay, animate, instant);
    }
    const next = network.nextInstant(instant);
    if (next) {
        const delay = animate ? instant.delta(next) : 0;
        window.setTimeout(function () { slide(next, animate); }, delay * 1000);
    }
}
function drawOrEraseElement(element, delay, animate, instant) {
    if (instant.equals(element.to) && !element.from.equals(element.to)) {
        return eraseElement(element, delay, shouldAnimate(element.to, animate));
    }
    return drawElement(element, delay, shouldAnimate(element.from, animate));
}
function drawElement(element, delay, animate) {
    return element.draw(delay, animate);
}
function eraseElement(element, delay, animate) {
    return element.erase(delay, animate, false);
}
function shouldAnimate(instant, animate) {
    if (!animate)
        return false;
    if (instant.flag == 'noanim')
        return false;
    return animate;
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luc3RhbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xhYmVsLnRzIiwid2VicGFjazovLy8uL3NyYy9MaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9OZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9QcmVmZXJyZWRUcmFjay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUm90YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N0YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N2Z0xhYmVsLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdMaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdOZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdTdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9VdGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmVjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FB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S0FDM0U7SUFDRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLE9BQXNCLEVBQUUsS0FBYSxFQUFFLE9BQWdCO0lBQ3hFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLE9BQXNCLEVBQUUsS0FBYSxFQUFFLE9BQWdCO0lBQ3pFLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxPQUFnQixFQUFFLE9BQWdCO0lBQ3JELElBQUksQ0FBQyxPQUFPO1FBQ1IsT0FBTyxLQUFLLENBQUM7SUFDakIsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVE7UUFDeEIsT0FBTyxLQUFLLENBQUM7SUFDakIsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyIsImZpbGUiOiJuZXR3b3JrLWFuaW1hdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsImV4cG9ydCBjbGFzcyBJbnN0YW50IHtcbiAgICBzdGF0aWMgQklHX0JBTkc6IEluc3RhbnQgPSBuZXcgSW5zdGFudCgwLCAwLCAnJyk7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZXBvY2g6IG51bWJlciwgcHJpdmF0ZSBfc2Vjb25kOiBudW1iZXIsIHByaXZhdGUgX2ZsYWc6IHN0cmluZykge1xuXG4gICAgfVxuICAgIGdldCBlcG9jaCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXBvY2g7XG4gICAgfVxuICAgIGdldCBzZWNvbmQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlY29uZDtcbiAgICB9XG4gICAgZ2V0IGZsYWcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsYWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20oYXJyYXk6IHN0cmluZ1tdKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFudChwYXJzZUludChhcnJheVswXSksIHBhcnNlSW50KGFycmF5WzFdKSwgYXJyYXlbMl0gPz8gJycpXG4gICAgfVxuXG4gICAgZXF1YWxzKHRoYXQ6IEluc3RhbnQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCAmJiB0aGlzLnNlY29uZCA9PSB0aGF0LnNlY29uZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IEluc3RhbnQpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5lcG9jaCA9PSB0aGF0LmVwb2NoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5zZWNvbmQgLSB0aGlzLnNlY29uZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhhdC5zZWNvbmQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFiZWxBZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIGZvclN0YXRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbik6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGFiZWwgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTGFiZWxBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG5cbiAgICBnZXQgZm9yU3RhdGlvbigpOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8ICcnKTtcbiAgICAgICAgaWYgKHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmZvclN0YXRpb247XG4gICAgICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgICAgICBjb25zdCBsYWJlbERpciA9IHN0YXRpb24ubGFiZWxEaXI7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gc3RhdGlvbi5yb3RhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IGRpZmZEaXIgPSBsYWJlbERpci5hZGQobmV3IFJvdGF0aW9uKC1zdGF0aW9uRGlyLmRlZ3JlZXMpKTtcbiAgICAgICAgICAgIGNvbnN0IHVuaXR2ID0gVmVjdG9yLlVOSVQucm90YXRlKGRpZmZEaXIpO1xuICAgICAgICAgICAgY29uc3QgYW5jaG9yID0gbmV3IFZlY3RvcihzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneCcsIHVuaXR2LngpLCBzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneScsIHVuaXR2LnkpKTtcbiAgICAgICAgICAgIGNvbnN0IHRleHRDb29yZHMgPSBiYXNlQ29vcmQuYWRkKGFuY2hvci5yb3RhdGUoc3RhdGlvbkRpcikpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIHRleHRDb29yZHMsIGxhYmVsRGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufSIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IFN0YXRpb24sIFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQWRhcHRlciBleHRlbmRzIFRpbWVkICB7XG4gICAgc3RvcHM6IFN0b3BbXTtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4pOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGluZSBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBOT0RFX0RJU1RBTkNFID0gMDtcbiAgICBzdGF0aWMgU1BFRUQgPSAxMDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IExpbmVBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIFxuICAgIHByaXZhdGUgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIHByZWNlZGluZ0RpcjogUm90YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgY29uc3QgcGF0aDogVmVjdG9yW10gPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGxldCB0cmFjayA9IG5ldyBQcmVmZXJyZWRUcmFjaygnKycpO1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8c3RvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbVN0cmluZyhzdG9wc1tqXS5wcmVmZXJyZWRUcmFjayk7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgc3RvcHNbal0uc3RhdGlvbklkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihzdG9wLmF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdG9wLCB0aGlzLm5leHRTdG9wQmFzZUNvb3JkKHN0b3BzLCBqLCBzdG9wLmJhc2VDb29yZHMpLCB0cmFjaywgcGF0aCwgZGVsYXksIGFuaW1hdGUsIHRydWUpO1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5rZWVwT25seVNpZ24oKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZHVyYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGgsIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgZHVyYXRpb24sIHBhdGgpO1xuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSwgMCwgcmV2ZXJzZSk7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8c3RvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgc3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgc3RvcC5kcmF3KGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRTdG9wQmFzZUNvb3JkKHN0b3BzOiBTdG9wW10sIGN1cnJlbnRTdG9wSW5kZXg6IG51bWJlciwgZGVmYXVsdENvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIGlmIChjdXJyZW50U3RvcEluZGV4KzEgPCBzdG9wcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gc3RvcHNbY3VycmVudFN0b3BJbmRleCsxXS5zdGF0aW9uSWQ7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyBpZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gc3RvcC5iYXNlQ29vcmRzOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0Q29vcmRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCB0cmFjazogUHJlZmVycmVkVHJhY2ssIHBhdGg6IFZlY3RvcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZWN1cnNlOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgY29uc3QgbmV3RGlyID0gdGhpcy5nZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgZGlyLCBwYXRoKTtcbiAgICAgICAgY29uc3QgbmV3UG9zID0gc3RhdGlvbi5hc3NpZ25UcmFjayhuZXdEaXIuaXNWZXJ0aWNhbCgpID8gJ3gnIDogJ3knLCB0cmFjaywgdGhpcyk7XG5cbiAgICAgICAgY29uc3QgbmV3Q29vcmQgPSBzdGF0aW9uLnJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKG5ld0RpciwgbmV3UG9zKTtcbiAgICBcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gdGhpcy5nZXRQcmVjZWRpbmdEaXIodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgb2xkQ29vcmQsIG5ld0Nvb3JkKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb25EaXIgPSBuZXdEaXIuYWRkKGRpcik7XG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IHRoaXMuaW5zZXJ0Tm9kZShvbGRDb29yZCwgdGhpcy5wcmVjZWRpbmdEaXIsIG5ld0Nvb3JkLCBzdGF0aW9uRGlyLCBwYXRoKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZm91bmQgJiYgcmVjdXJzZSAmJiB0aGlzLnByZWNlZGluZ1N0b3AgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3AgPSB0aGlzLmdldE9yQ3JlYXRlSGVscGVyU3RvcCh0aGlzLnByZWNlZGluZ0RpciwgdGhpcy5wcmVjZWRpbmdTdG9wLCBzdGF0aW9uKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMucHJlY2VkaW5nRGlyLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVDb25uZWN0aW9uKGhlbHBTdG9wLCBiYXNlQ29vcmQsIHRyYWNrLmtlZXBPbmx5U2lnbigpLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3BhdGggdG8gZml4IG9uIGxpbmUnLCB0aGlzLmFkYXB0ZXIubmFtZSwgJ2F0IHN0YXRpb24nLCBzdGF0aW9uLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gc3RhdGlvbkRpcjtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aW9uLmFkZExpbmUodGhpcywgbmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgbmV3UG9zKTtcbiAgICAgICAgcGF0aC5wdXNoKG5ld0Nvb3JkKTtcbiAgICAgICAgZGVsYXkgPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGgsIGFuaW1hdGUpICsgZGVsYXk7XG4gICAgICAgIHN0YXRpb24uZHJhdyhkZWxheSk7XG4gICAgICAgIHRoaXMucHJlY2VkaW5nU3RvcCA9IHN0YXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCBkaXI6IFJvdGF0aW9uLCBwYXRoOiBWZWN0b3JbXSk6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RvcEJhc2VDb29yZC5kZWx0YShvbGRDb29yZCkuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsdGEgPSBzdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEobmV4dFN0b3BCYXNlQ29vcmQpO1xuICAgICAgICBjb25zdCBleGlzdGluZ0F4aXMgPSBzdGF0aW9uLmF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpPy5heGlzO1xuICAgICAgICBpZiAoZXhpc3RpbmdBeGlzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbHRhLmluY2xpbmF0aW9uKCkuaGFsZkRpcmVjdGlvbihkaXIsIGV4aXN0aW5nQXhpcyA9PSAneCcgPyBuZXcgUm90YXRpb24oOTApIDogbmV3IFJvdGF0aW9uKDApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsdGEuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgfVxuICAgIFxuXG4gICAgcHJpdmF0ZSBnZXRQcmVjZWRpbmdEaXIocHJlY2VkaW5nRGlyOiBSb3RhdGlvbiB8IHVuZGVmaW5lZCwgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCwgb2xkQ29vcmQ6IFZlY3RvciwgbmV3Q29vcmQ6IFZlY3Rvcik6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHByZWNlZGluZ0RpciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWNlZGluZ1N0b3BSb3RhdGlvbiA9IHByZWNlZGluZ1N0b3A/LnJvdGF0aW9uID8/IG5ldyBSb3RhdGlvbigwKTtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24ocHJlY2VkaW5nU3RvcFJvdGF0aW9uKS5hZGQocHJlY2VkaW5nU3RvcFJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWNlZGluZ0RpciA9IHByZWNlZGluZ0Rpci5hZGQobmV3IFJvdGF0aW9uKDE4MCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVjZWRpbmdEaXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbnNlcnROb2RlKGZyb21Db29yZDogVmVjdG9yLCBmcm9tRGlyOiBSb3RhdGlvbiwgdG9Db29yZDogVmVjdG9yLCB0b0RpcjogUm90YXRpb24sIHBhdGg6IFZlY3RvcltdKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSBmcm9tQ29vcmQuZGVsdGEodG9Db29yZCk7XG4gICAgICAgIGNvbnN0IG9sZERpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUoZnJvbURpcik7XG4gICAgICAgIGNvbnN0IG5ld0RpclYgPSBWZWN0b3IuVU5JVC5yb3RhdGUodG9EaXIpO1xuICAgICAgICBpZiAoZGVsdGEuaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwob2xkRGlyViwgbmV3RGlyVikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvbHV0aW9uID0gZGVsdGEuc29sdmVEZWx0YUZvckludGVyc2VjdGlvbihvbGREaXJWLCBuZXdEaXJWKVxuICAgICAgICBpZiAoc29sdXRpb24uYSA+IExpbmUuTk9ERV9ESVNUQU5DRSAmJiBzb2x1dGlvbi5iID4gTGluZS5OT0RFX0RJU1RBTkNFKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gobmV3IFZlY3Rvcihmcm9tQ29vcmQueCtvbGREaXJWLngqc29sdXRpb24uYSwgZnJvbUNvb3JkLnkrb2xkRGlyVi55KnNvbHV0aW9uLmEpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlSGVscGVyU3RvcChmcm9tRGlyOiBSb3RhdGlvbiwgZnJvbVN0b3A6IFN0YXRpb24sIHRvU3RvcDogU3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcElkID0gJ2hfJyArIFV0aWxzLmFscGhhYmV0aWNJZChmcm9tU3RvcC5pZCwgdG9TdG9wLmlkKTtcbiAgICAgICAgbGV0IGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaGVscFN0b3BJZCk7XG4gICAgICAgIGlmIChoZWxwU3RvcCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gZnJvbVN0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nvb3JkID0gdG9TdG9wLmJhc2VDb29yZHM7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IG5ld0Nvb3JkLmRlbHRhKG9sZENvb3JkKTtcbiAgICAgICAgICAgIGNvbnN0IGRlZyA9IG9sZENvb3JkLmRlbHRhKG5ld0Nvb3JkKS5pbmNsaW5hdGlvbigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coaGVscFN0b3BJZCwgZGVnLCBmcm9tRGlyKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVybWVkaWF0ZURpciA9IG5ldyBSb3RhdGlvbigoZGVnLmRlbHRhKGZyb21EaXIpLmRlZ3JlZXMgPj0gMCA/IE1hdGguZmxvb3IoZGVnLmRlZ3JlZXMgLyA0NSkgOiBNYXRoLmNlaWwoZGVnLmRlZ3JlZXMgLyA0NSkpICogNDUpLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJtZWRpYXRlQ29vcmQgPSBkZWx0YS53aXRoTGVuZ3RoKGRlbHRhLmxlbmd0aC8yKS5hZGQobmV3Q29vcmQpO1xuXG4gICAgICAgICAgICBoZWxwU3RvcCA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLmNyZWF0ZVZpcnR1YWxTdG9wKGhlbHBTdG9wSWQsIGludGVybWVkaWF0ZUNvb3JkLCBpbnRlcm1lZGlhdGVEaXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoZWxwU3RvcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGg6IFZlY3RvcltdLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFhbmltYXRlKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRvdGFsTGVuZ3RoKHBhdGgpIC8gTGluZS5TUEVFRDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRUb3RhbExlbmd0aChwYXRoOiBWZWN0b3JbXSk6IG51bWJlciB7XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8cGF0aC5sZW5ndGgtMTsgaSsrKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gcGF0aFtpXS5kZWx0YShwYXRoW2krMV0pLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGlvblByb3ZpZGVyIHtcbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IHVuZGVmaW5lZDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG59XG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBZGFwdGVyIHtcbiAgICBpbml0aWFsaXplKG5ldHdvcms6IE5ldHdvcmspOiB2b2lkO1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgbnVsbDtcbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb247XG4gICAgZHJhd0Vwb2NoKGVwb2NoOiBzdHJpbmcpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTmV0d29yayBpbXBsZW1lbnRzIFN0YXRpb25Qcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzbGlkZUluZGV4OiB7W2lkOiBzdHJpbmddIDoge1tpZDogc3RyaW5nXTogVGltZWREcmF3YWJsZVtdfX0gPSB7fTtcbiAgICBwcml2YXRlIHN0YXRpb25zOiB7IFtpZDogc3RyaW5nXSA6IFN0YXRpb24gfSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBOZXR3b3JrQWRhcHRlcikge1xuXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmluaXRpYWxpemUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5zdGF0aW9uc1tpZF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcy5hZGFwdGVyLnN0YXRpb25CeUlkKGlkKVxuICAgICAgICAgICAgaWYgKHN0YXRpb24gIT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGlvbnNbaWRdO1xuICAgIH1cblxuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLmFkYXB0ZXIuY3JlYXRlVmlydHVhbFN0b3AoaWQsIGJhc2VDb29yZHMsIHJvdGF0aW9uKTtcbiAgICAgICAgdGhpcy5zdGF0aW9uc1tpZF0gPSBzdG9wO1xuICAgICAgICByZXR1cm4gc3RvcDtcbiAgICB9XG5cbiAgICBzZXRJbnN0YW50KGluc3RhbnQ6IEluc3RhbnQpIHtcbiAgICAgICAgaWYgKCFpbnN0YW50LmVxdWFscyhJbnN0YW50LkJJR19CQU5HKSkge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXdFcG9jaChpbnN0YW50LmVwb2NoICsgJycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCk6IFRpbWVkRHJhd2FibGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXVtub3cuc2Vjb25kXTtcbiAgICB9XG5cbiAgICBpc0Vwb2NoRXhpc3RpbmcoZXBvY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZUluZGV4W2Vwb2NoXSAhPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYWRkVG9JbmRleChlbGVtZW50OiBUaW1lZERyYXdhYmxlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0U2xpZGVJbmRleEVsZW1lbnQoZWxlbWVudC5mcm9tLCBlbGVtZW50KTtcbiAgICAgICAgaWYgKCFJbnN0YW50LkJJR19CQU5HLmVxdWFscyhlbGVtZW50LnRvKSlcbiAgICAgICAgICAgIHRoaXMuc2V0U2xpZGVJbmRleEVsZW1lbnQoZWxlbWVudC50bywgZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTbGlkZUluZGV4RWxlbWVudChpbnN0YW50OiBJbnN0YW50LCBlbGVtZW50OiBUaW1lZERyYXdhYmxlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdID0ge307XG4gICAgICAgIGlmICh0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0gPSBbXTtcbiAgICAgICAgdGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXS5wdXNoKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIG5leHRJbnN0YW50KG5vdzogSW5zdGFudCk6IEluc3RhbnQgfCBudWxsIHtcbiAgICAgICAgbGV0IGVwb2NoOiBudW1iZXIgfCBudWxsID0gbm93LmVwb2NoO1xuICAgICAgICBsZXQgc2Vjb25kOiBudW1iZXIgfCBudWxsID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZShub3cuc2Vjb25kLCB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXSk7XG4gICAgICAgIGlmIChzZWNvbmQgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXBvY2ggPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKG5vdy5lcG9jaCwgdGhpcy5zbGlkZUluZGV4KTtcbiAgICAgICAgICAgIGlmIChlcG9jaCA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBzZWNvbmQgPSB0aGlzLmZpbmRTbWFsbGVzdEFib3ZlKC0xLCB0aGlzLnNsaWRlSW5kZXhbZXBvY2hdKTtcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFudChlcG9jaCwgc2Vjb25kLCAnJyk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZmluZFNtYWxsZXN0QWJvdmUodGhyZXNob2xkOiBudW1iZXIsIGRpY3Q6IHtbaWQ6IG51bWJlcl06IGFueX0pOiBudW1iZXIgfCBudWxsIHtcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGljdCkpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChrZXkpID4gdGhyZXNob2xkICYmIChzbWFsbGVzdCA9PSB1bmRlZmluZWQgfHwgcGFyc2VJbnQoa2V5KSA8IHNtYWxsZXN0KSkge1xuICAgICAgICAgICAgICAgIHNtYWxsZXN0ID0gcGFyc2VJbnQoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc21hbGxlc3Q7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTGluZUF0U3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFByZWZlcnJlZFRyYWNrIHtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgXG4gICAgZnJvbVN0cmluZyh2YWx1ZTogc3RyaW5nKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBpZiAodmFsdWUgIT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJlZmVycmVkVHJhY2sodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZyb21OdW1iZXIodmFsdWU6IG51bWJlcik6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gdmFsdWUgPj0gMCA/ICcrJyA6ICcnO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHByZWZpeCArIHZhbHVlKTtcbiAgICB9XG5cbiAgICBmcm9tRXhpc3RpbmdMaW5lQXRTdGF0aW9uKGF0U3RhdGlvbjogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXRTdGF0aW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5oYXNUcmFja051bWJlcigpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21OdW1iZXIoYXRTdGF0aW9uLnRyYWNrKTsgICAgICAgIFxuICAgIH1cblxuICAgIGtlZXBPbmx5U2lnbigpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLnZhbHVlWzBdO1xuICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHYgPT0gJysnIHx8IHYgPT0gJy0nID8gdiA6ICcrJyk7XG4gICAgfVxuXG4gICAgaGFzVHJhY2tOdW1iZXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmxlbmd0aCA+IDE7XG4gICAgfVxuXG4gICAgZ2V0IHRyYWNrTnVtYmVyKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLnZhbHVlKVxuICAgIH1cblxuICAgIGlzUG9zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdID09ICcrJztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgICBwcml2YXRlIHN0YXRpYyBESVJTOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7J3N3JzogLTEzNSwgJ3cnOiAtOTAsICdudyc6IC00NSwgJ24nOiAwLCAnbmUnOiA0NSwgJ2UnOiA5MCwgJ3NlJzogMTM1LCAncyc6IDE4MH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWdyZWVzOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tKGRpcmVjdGlvbjogc3RyaW5nKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKFJvdGF0aW9uLkRJUlNbZGlyZWN0aW9uXSlcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhSb3RhdGlvbi5ESVJTKSkge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh2YWx1ZSwgdGhpcy5kZWdyZWVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG5cbiAgICBnZXQgZGVncmVlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVncmVlcztcbiAgICB9XG5cbiAgICBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVzIC8gMTgwICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICBhZGQodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLmRlZ3JlZXMgKyB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGlmIChzdW0gPD0gLTE4MClcbiAgICAgICAgICAgIHN1bSArPSAzNjA7XG4gICAgICAgIGlmIChzdW0gPiAxODApXG4gICAgICAgICAgICBzdW0gLT0gMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHN1bSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogUm90YXRpb24pOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBsZXQgYiA9IHRoYXQuZGVncmVlcztcbiAgICAgICAgbGV0IGRpc3QgPSBiLWE7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0KSA+IDE4MCkge1xuICAgICAgICAgICAgaWYgKGEgPCAwKVxuICAgICAgICAgICAgICAgIGEgKz0gMzYwO1xuICAgICAgICAgICAgaWYgKGIgPCAwKVxuICAgICAgICAgICAgICAgIGIgKz0gMzYwO1xuICAgICAgICAgICAgZGlzdCA9IGItYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpc3QpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBSb3RhdGlvbiB7XG4gICAgICAgIGxldCBkaXIgPSB0aGlzLmRlZ3JlZXM7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGlyLCAtOTApKVxuICAgICAgICAgICAgZGlyID0gMDtcbiAgICAgICAgZWxzZSBpZiAoZGlyIDwgLTkwKVxuICAgICAgICAgICAgZGlyICs9IDE4MDtcbiAgICAgICAgZWxzZSBpZiAoZGlyID4gOTApXG4gICAgICAgICAgICBkaXIgLT0gMTgwO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRpcik7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAlIDE4MCA9PSAwO1xuICAgIH1cblxuICAgIHF1YXJ0ZXJEaXJlY3Rpb24ocmVsYXRpdmVUbzogUm90YXRpb24pIHtcbiAgICAgICAgY29uc3QgZGVsdGFEaXIgPSByZWxhdGl2ZVRvLmRlbHRhKHRoaXMpLmRlZ3JlZXM7XG4gICAgICAgIGNvbnN0IGRlZyA9IGRlbHRhRGlyIDwgMCA/IE1hdGguY2VpbCgoZGVsdGFEaXItNDUpLzkwKSA6IE1hdGguZmxvb3IoKGRlbHRhRGlyKzQ1KS85MCk7XG4gICAgICAgIHJldHVybiBuZXcgUm90YXRpb24oZGVnKjkwKTtcbiAgICB9XG5cbiAgICBoYWxmRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uLCBzcGxpdEF4aXM6IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBsZXQgZGVnO1xuICAgICAgICBpZiAoc3BsaXRBeGlzLmlzVmVydGljYWwoKSkge1xuICAgICAgICAgICAgaWYgKGRlbHRhRGlyIDwgMCAmJiBkZWx0YURpciA+PSAtMTgwKVxuICAgICAgICAgICAgICAgIGRlZyA9IC05MDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSA5MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDkwICYmIGRlbHRhRGlyID49IC05MClcbiAgICAgICAgICAgICAgICBkZWcgPSAwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlZyA9IDE4MDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyk7XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuL0xpbmVcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uQWRhcHRlciB7XG4gICAgYmFzZUNvb3JkczogVmVjdG9yO1xuICAgIHJvdGF0aW9uOiBSb3RhdGlvbjtcbiAgICBsYWJlbERpcjogUm90YXRpb247XG4gICAgaWQ6IHN0cmluZztcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFN0b3Age1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0aW9uSWQ6IHN0cmluZywgcHVibGljIHByZWZlcnJlZFRyYWNrOiBzdHJpbmcpIHtcblxuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQXRTdGF0aW9uIHtcbiAgICBsaW5lPzogTGluZTtcbiAgICBheGlzOiBzdHJpbmc7XG4gICAgdHJhY2s6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXRpb24ge1xuICAgIHN0YXRpYyBMSU5FX0RJU1RBTkNFID0gNjtcbiAgICBzdGF0aWMgREVGQVVMVF9TVE9QX0RJTUVOID0gMTA7XG4gICAgc3RhdGljIExBQkVMX0RJU1RBTkNFID0gMDtcblxuICAgIHByaXZhdGUgZXhpc3RpbmdMaW5lczoge1tpZDogc3RyaW5nXTogTGluZUF0U3RhdGlvbltdfSA9IHt4OiBbXSwgeTogW119O1xuICAgIHByaXZhdGUgcGhhbnRvbT86IExpbmVBdFN0YXRpb24gPSB1bmRlZmluZWQ7XG4gICAgYmFzZUNvb3JkcyA9IHRoaXMuYWRhcHRlci5iYXNlQ29vcmRzO1xuICAgIHJvdGF0aW9uID0gdGhpcy5hZGFwdGVyLnJvdGF0aW9uO1xuICAgIGxhYmVsRGlyID0gdGhpcy5hZGFwdGVyLmxhYmVsRGlyO1xuICAgIGlkID0gdGhpcy5hZGFwdGVyLmlkO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhZGFwdGVyOiBTdGF0aW9uQWRhcHRlcikge1xuXG4gICAgfVxuXG4gICAgYWRkTGluZShsaW5lOiBMaW5lLCBheGlzOiBzdHJpbmcsIHRyYWNrOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5leGlzdGluZ0xpbmVzW2F4aXNdLnB1c2goe2xpbmU6IGxpbmUsIGF4aXM6IGF4aXMsIHRyYWNrOiB0cmFja30pO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbW92ZUxpbmVBdEF4aXMobGluZSwgdGhpcy5leGlzdGluZ0xpbmVzLngpO1xuICAgICAgICB0aGlzLnJlbW92ZUxpbmVBdEF4aXMobGluZSwgdGhpcy5leGlzdGluZ0xpbmVzLnkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlTGluZUF0QXhpcyhsaW5lOiBMaW5lLCBleGlzdGluZ0xpbmVzRm9yQXhpczogTGluZUF0U3RhdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBoYW50b20gPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgICAgICBleGlzdGluZ0xpbmVzRm9yQXhpcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZShsaW5lTmFtZTogc3RyaW5nKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLngpO1xuICAgICAgICBpZiAoeCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLnkpO1xuICAgICAgICBpZiAoeSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0cmFja0ZvckxpbmVBdEF4aXMobGluZU5hbWU6IHN0cmluZywgZXhpc3RpbmdMaW5lc0ZvckF4aXM6IExpbmVBdFN0YXRpb25bXSk6IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgZXhpc3RpbmdMaW5lc0ZvckF4aXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0ubGluZT8ubmFtZSA9PSBsaW5lTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFzc2lnblRyYWNrKGF4aXM6IHN0cmluZywgcHJlZmVycmVkVHJhY2s6IFByZWZlcnJlZFRyYWNrLCBsaW5lOiBMaW5lKTogbnVtYmVyIHsgXG4gICAgICAgIGlmIChwcmVmZXJyZWRUcmFjay5oYXNUcmFja051bWJlcigpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2sudHJhY2tOdW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGhhbnRvbT8ubGluZT8ubmFtZSA9PSBsaW5lLm5hbWUgJiYgdGhpcy5waGFudG9tPy5heGlzID09IGF4aXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBoYW50b20/LnRyYWNrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXMgPSB0aGlzLnBvc2l0aW9uQm91bmRhcmllcygpW2F4aXNdO1xuICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2suaXNQb3NpdGl2ZSgpID8gcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpc1sxXSArIDEgOiBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzWzBdIC0gMTtcbiAgICB9XG5cbiAgICByb3RhdGVkVHJhY2tDb29yZGluYXRlcyhpbmNvbWluZ0RpcjogUm90YXRpb24sIGFzc2lnbmVkVHJhY2s6IG51bWJlcik6IFZlY3RvciB7IFxuICAgICAgICBsZXQgbmV3Q29vcmQ6IFZlY3RvcjtcbiAgICAgICAgaWYgKGluY29taW5nRGlyLmRlZ3JlZXMgJSAxODAgPT0gMCkge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Q29vcmQgPSBuZXcgVmVjdG9yKDAsIGFzc2lnbmVkVHJhY2sgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0Nvb3JkID0gbmV3Q29vcmQucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgICAgICBuZXdDb29yZCA9IHRoaXMuYmFzZUNvb3Jkcy5hZGQobmV3Q29vcmQpO1xuICAgICAgICByZXR1cm4gbmV3Q29vcmQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXMoKToge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5wb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKHRoaXMuZXhpc3RpbmdMaW5lcy54KSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXMueSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJvdW5kYXJpZXNGb3JBeGlzKGV4aXN0aW5nTGluZXNGb3JBeGlzOiBMaW5lQXRTdGF0aW9uW10pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gWzEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVmdCA9IDA7XG4gICAgICAgIGxldCByaWdodCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2spIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlZnQgPiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gc3RhdGlvbi5wb3NpdGlvbkJvdW5kYXJpZXMoKTsgfSk7XG4gICAgfVxuXG4gICAgc3RhdGlvblNpemVGb3JBeGlzKGF4aXM6IHN0cmluZywgdmVjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZlY3RvciwgMCkpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10pW3ZlY3RvciA8IDAgPyAwIDogMV0gKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0U7XG4gICAgICAgIHJldHVybiBzaXplICsgTWF0aC5zaWduKHZlY3RvcikgKiAoU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gKyBTdGF0aW9uLkxBQkVMX0RJU1RBTkNFKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGFiZWxBZGFwdGVyIH0gZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xhYmVsIGltcGxlbWVudHMgTGFiZWxBZGFwdGVyIHtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR1RleHRFbGVtZW50KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgZm9yU3RhdGlvbigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhdGlvbjtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxhYmVsLmRyYXcoMCwgdGV4dENvb3JkcywgbGFiZWxEaXIpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENvb3JkKHRoaXMuZWxlbWVudCwgdGV4dENvb3Jkcyk7XG4gICAgICAgIGNvbnN0IGxhYmVsdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dEFuY2hvciA9IFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueCwgWydlbmQnLCAnbWlkZGxlJywgJ3N0YXJ0J10pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZG9taW5hbnRCYXNlbGluZSA9IFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueSwgWydiYXNlbGluZScsICdtaWRkbGUnLCAnaGFuZ2luZyddKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIHN0YXRpb24nO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q29vcmQoZWxlbWVudDogYW55LCBjb29yZDogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgY29vcmQueCk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd5JywgY29vcmQueSk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGluZUFkYXB0ZXIsIExpbmUgfSBmcm9tIFwiLi9MaW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTGluZSBpbXBsZW1lbnRzIExpbmVBZGFwdGVyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIEZQUyA9IDYwO1xuICAgIHByaXZhdGUgX3N0b3BzOiBTdG9wW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lIHx8ICcnO1xuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuXG4gICAgZ2V0IHN0b3BzKCk6IFN0b3BbXSB7XG4gICAgICAgIGlmICh0aGlzLl9zdG9wcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RvcHM/LnNwbGl0KC9cXHMrLykgfHwgW107XG4gICAgICAgICAgICBsZXQgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0b2tlbnM/Lmxlbmd0aDtpKyspIHsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRva2Vuc1tpXVswXSAhPSAnLScgJiYgdG9rZW5zW2ldWzBdICE9ICcrJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BzLnB1c2gobmV4dFN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AucHJlZmVycmVkVHJhY2sgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9wcztcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBsaW5lLmRyYXcoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBwYXRoKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxlbmd0aCA9IHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCk7XG4gICAgXG4gICAgICAgIGNvbnN0IGQgPSAnTScgKyBwYXRoLm1hcCh2ID0+IHYueCsnLCcrdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgXG4gICAgICAgIGxldCBkYXNoZWRQYXJ0ID0gdGhpcy5jcmVhdGVEYXNoZWRQYXJ0KGxlbmd0aCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBkYXNoZWRQYXJ0ICsgJyAnICsgbGVuZ3RoO1xuICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUobGVuZ3RoLCBsZW5ndGgvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z0xpbmUuRlBTKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZURhc2hlZFBhcnQobGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICBsZXQgZGFzaGVkUGFydCA9IGxlbmd0aCArICcnO1xuICAgICAgICBjb25zdCBwcmVzZXREYXNoID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLnN0cm9rZURhc2hhcnJheS5yZXBsYWNlKC9bXjAtOVxccyxdKy9nLCAnJyk7XG4gICAgICAgIGlmIChwcmVzZXREYXNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcmVzZXRBcnJheSA9IHByZXNldERhc2guc3BsaXQoL1tcXHMsXSsvKTtcbiAgICAgICAgICAgIGlmIChwcmVzZXRBcnJheS5sZW5ndGggJSAyID09IDEpXG4gICAgICAgICAgICAgICAgcHJlc2V0QXJyYXkgPSBwcmVzZXRBcnJheS5jb25jYXQocHJlc2V0QXJyYXkpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0TGVuZ3RoID0gcHJlc2V0QXJyYXkubWFwKGEgPT4gcGFyc2VJbnQoYSkgfHwgMCkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG4gICAgICAgICAgICBkYXNoZWRQYXJ0ID0gbmV3IEFycmF5KE1hdGguY2VpbChsZW5ndGggLyBwcmVzZXRMZW5ndGggKyAxKSkuam9pbihwcmVzZXRBcnJheS5qb2luKCcgJykgKyAnICcpICsgJzAnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXNoZWRQYXJ0O1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXM7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgbGluZS5lcmFzZSgwLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHMsIHJldmVyc2UpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgJycpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFuaW1hdGVGcmFtZShsZW5ndGg6IG51bWJlciwgYW5pbWF0aW9uUGVyRnJhbWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBsZW5ndGggKyAnJztcbiAgICAgICAgICAgIGxlbmd0aCAtPSBhbmltYXRpb25QZXJGcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbGluZS5hbmltYXRlRnJhbWUobGVuZ3RoLCBhbmltYXRpb25QZXJGcmFtZSk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSAnMCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRvdGFsTGVuZ3RoKHBhdGg6IFZlY3RvcltdKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxwYXRoLmxlbmd0aC0xOyBpKyspIHtcbiAgICAgICAgICAgIGxlbmd0aCArPSBwYXRoW2ldLmRlbHRhKHBhdGhbaSsxXSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IE5ldHdvcmtBZGFwdGVyLCBOZXR3b3JrLCBTdGF0aW9uUHJvdmlkZXIgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9MaW5lXCI7XG5pbXBvcnQgeyBTdmdMaW5lIH0gZnJvbSBcIi4vU3ZnTGluZVwiO1xuaW1wb3J0IHsgU3ZnU3RhdGlvbiB9IGZyb20gXCIuL1N2Z1N0YXRpb25cIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCB7IFN2Z0xhYmVsIH0gZnJvbSBcIi4vU3ZnTGFiZWxcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z05ldHdvcmsgaW1wbGVtZW50cyBOZXR3b3JrQWRhcHRlciB7XG5cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3ZnbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbiAgICBpbml0aWFsaXplKG5ldHdvcms6IE5ldHdvcmspOiB2b2lkIHtcbiAgICAgICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZW1lbnRzJyk/LmNoaWxkcmVuO1xuICAgICAgICBpZiAoZWxlbWVudHMgPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdQbGVhc2UgZGVmaW5lIHRoZSBcImVsZW1lbnRzXCIgZ3JvdXAuJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50OiBUaW1lZERyYXdhYmxlIHwgbnVsbCA9IHRoaXMubWlycm9yRWxlbWVudChlbGVtZW50c1tpXSwgbmV0d29yayk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV0d29yay5hZGRUb0luZGV4KGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtaXJyb3JFbGVtZW50KGVsZW1lbnQ6IGFueSwgbmV0d29yazogU3RhdGlvblByb3ZpZGVyKTogVGltZWREcmF3YWJsZSB8IG51bGwge1xuICAgICAgICBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gJ3BhdGgnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpbmUobmV3IFN2Z0xpbmUoZWxlbWVudCksIG5ldHdvcmspO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICd0ZXh0Jykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMYWJlbChuZXcgU3ZnTGFiZWwoZWxlbWVudCksIG5ldHdvcmspO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmIChlbGVtZW50ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKDxTVkdSZWN0RWxlbWVudD4gPHVua25vd24+ZWxlbWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGhlbHBTdG9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuc3ZnbnMsICdyZWN0Jyk7XG4gICAgICAgIGhlbHBTdG9wLmlkID0gaWQ7ICAgIFxuICAgICAgICBoZWxwU3RvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGlyJywgcm90YXRpb24ubmFtZSk7XG4gICAgICAgIHRoaXMuc2V0Q29vcmQoaGVscFN0b3AsIGJhc2VDb29yZHMpO1xuICAgICAgICBoZWxwU3RvcC5jbGFzc05hbWUuYmFzZVZhbCA9ICdoZWxwZXInO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGlvbnMnKT8uYXBwZW5kQ2hpbGQoaGVscFN0b3ApO1xuICAgICAgICByZXR1cm4gbmV3IFN0YXRpb24obmV3IFN2Z1N0YXRpb24oaGVscFN0b3ApKTsgIFxuICAgIH07XG5cbiAgICBwcml2YXRlIHNldENvb3JkKGVsZW1lbnQ6IGFueSwgY29vcmQ6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneCcsIGNvb3JkLngpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgneScsIGNvb3JkLnkpO1xuICAgIH1cblxuICAgIGRyYXdFcG9jaChlcG9jaDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxldCBlcG9jaExhYmVsO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJykgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlcG9jaExhYmVsID0gPFNWR1RleHRFbGVtZW50PiA8dW5rbm93bj4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vwb2NoLWxhYmVsJyk7XG4gICAgICAgICAgICBlcG9jaExhYmVsLnRleHRDb250ZW50ID0gZXBvY2g7ICAgICAgIFxuICAgICAgICB9XG4gICAgfVxuICAgXG59XG4iLCJpbXBvcnQgeyBTdGF0aW9uQWRhcHRlciwgU3RhdGlvbiB9IGZyb20gXCIuL1N0YXRpb25cIjtcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnU3RhdGlvbiBpbXBsZW1lbnRzIFN0YXRpb25BZGFwdGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR1JlY3RFbGVtZW50KSB7XG5cbiAgICB9XG4gICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaWQ7XG4gICAgfVxuICAgIGdldCBiYXNlQ29vcmRzKCk6IFZlY3RvciB7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IocGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneCcpIHx8ICcnKSB8fCAwLCBwYXJzZUludCh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd5JykgfHwgJycpIHx8IDApO1xuICAgIH1cbiAgICBnZXQgcm90YXRpb24oKTogUm90YXRpb24ge1xuICAgICAgICByZXR1cm4gUm90YXRpb24uZnJvbSh0aGlzLmVsZW1lbnQuZGF0YXNldC5kaXIgfHwgJ24nKTtcbiAgICB9XG4gICAgZ2V0IGxhYmVsRGlyKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQubGFiZWxEaXIgfHwgJ24nKTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXM6ICgpID0+IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19KTogdm9pZCB7XG4gICAgICAgIGlmIChkZWxheVNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzdGF0aW9uLmRyYXcoMCwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzID0gZ2V0UG9zaXRpb25Cb3VuZGFyaWVzKCk7XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHRoaXMuYmFzZUNvb3JkcztcbiAgICAgICAgY29uc3Qgc3RvcERpbWVuID0gW01hdGgubWF4KHBvc2l0aW9uQm91bmRhcmllcy54WzFdIC0gcG9zaXRpb25Cb3VuZGFyaWVzLnhbMF0sIDApLCBNYXRoLm1heChwb3NpdGlvbkJvdW5kYXJpZXMueVsxXSAtIHBvc2l0aW9uQm91bmRhcmllcy55WzBdLCAwKV07XG4gICAgICAgIFxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd3aWR0aCcsIChzdG9wRGltZW5bMF0gKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIChzdG9wRGltZW5bMV0gKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgKyBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTikgKyAnJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsJ3JvdGF0ZSgnICsgdGhpcy5yb3RhdGlvbi5kZWdyZWVzICsgJyAnICsgYmFzZUNvb3JkLnggKyAnICcgKyBiYXNlQ29vcmQueSArICcpIHRyYW5zbGF0ZSgnICsgKE1hdGgubWluKHBvc2l0aW9uQm91bmRhcmllcy54WzBdLCAwKSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSAtIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOIC8gMikgKyAnLCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnlbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcpJyk7XG4gICAgfVxuICAgIFxufSIsImV4cG9ydCBjbGFzcyBVdGlscyB7XG4gICAgc3RhdGljIHJlYWRvbmx5IElNUFJFQ0lTSU9OOiBudW1iZXIgPSAwLjAwMTtcblxuICAgIHN0YXRpYyBlcXVhbHMoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKSA8IFV0aWxzLklNUFJFQ0lTSU9OO1xuICAgIH1cblxuICAgIHN0YXRpYyB0cmlsZW1tYShpbnQ6IG51bWJlciwgb3B0aW9uczogW3N0cmluZywgc3RyaW5nLCBzdHJpbmddKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhpbnQsIDApKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1sxXTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnQgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1syXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uc1swXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWxwaGFiZXRpY0lkKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGEgPCBiKVxuICAgICAgICAgICAgcmV0dXJuIGEgKyAnXycgKyBiO1xuICAgICAgICByZXR1cm4gYiArICdfJyArIGE7XG4gICAgfVxufSIsImltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFZlY3RvciB7XG4gICAgc3RhdGljIFVOSVQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoMCwgLTEpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIGdldCB4KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cblxuICAgIGdldCB5KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsIDIpICsgTWF0aC5wb3codGhpcy55LCAyKSk7XG4gICAgfVxuXG4gICAgd2l0aExlbmd0aChsZW5ndGg6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gbGVuZ3RoL3RoaXMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngqcmF0aW8sIHRoaXMueSpyYXRpbyk7XG4gICAgfVxuXG4gICAgYWRkKHRoYXQgOiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKyB0aGF0LngsIHRoaXMueSArIHRoYXQueSk7XG4gICAgfVxuXG4gICAgZGVsdGEodGhhdDogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhhdC54IC0gdGhpcy54LCB0aGF0LnkgLSB0aGlzLnkpO1xuICAgIH1cblxuICAgIHJvdGF0ZSh0aGV0YTogUm90YXRpb24pOiBWZWN0b3Ige1xuICAgICAgICBsZXQgcmFkOiBudW1iZXIgPSB0aGV0YS5yYWRpYW5zO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKiBNYXRoLmNvcyhyYWQpIC0gdGhpcy55ICogTWF0aC5zaW4ocmFkKSwgdGhpcy54ICogTWF0aC5zaW4ocmFkKSArIHRoaXMueSAqIE1hdGguY29zKHJhZCkpO1xuICAgIH1cblxuICAgIGRvdFByb2R1Y3QodGhhdDogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCp0aGF0LngrdGhpcy55KnRoYXQueTtcbiAgICB9XG5cbiAgICBzb2x2ZURlbHRhRm9ySW50ZXJzZWN0aW9uKGRpcjE6IFZlY3RvciwgZGlyMjogVmVjdG9yKToge2E6IG51bWJlciwgYjogbnVtYmVyfSB7XG4gICAgICAgIGNvbnN0IGRlbHRhOiBWZWN0b3IgPSB0aGlzO1xuICAgICAgICBjb25zdCBzd2FwWmVyb0RpdmlzaW9uID0gVXRpbHMuZXF1YWxzKGRpcjIueSwgMCk7XG4gICAgICAgIGNvbnN0IHggPSBzd2FwWmVyb0RpdmlzaW9uID8gJ3knIDogJ3gnO1xuICAgICAgICBjb25zdCB5ID0gc3dhcFplcm9EaXZpc2lvbiA/ICd4JyA6ICd5JztcbiAgICAgICAgY29uc3QgZGVub21pbmF0b3IgPSAoZGlyMVt5XSpkaXIyW3hdLWRpcjFbeF0qZGlyMlt5XSk7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHMoZGVub21pbmF0b3IsIDApKSB7XG4gICAgICAgICAgICByZXR1cm4ge2E6IE5hTiwgYjogTmFOfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhID0gKGRlbHRhW3ldKmRpcjJbeF0tZGVsdGFbeF0qZGlyMlt5XSkvZGVub21pbmF0b3I7XG4gICAgICAgIGNvbnN0IGIgPSAoYSpkaXIxW3ldLWRlbHRhW3ldKS9kaXIyW3ldO1xuICAgICAgICByZXR1cm4ge2EsIGJ9O1xuICAgIH1cblxuICAgIGlzRGVsdGFNYXRjaGluZ1BhcmFsbGVsKGRpcjE6IFZlY3RvciwgZGlyMjogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsbEVxdWFsWmVybyh0aGlzLngsIGRpcjEueCwgZGlyMi54KSB8fCB0aGlzLmFsbEVxdWFsWmVybyh0aGlzLnksIGRpcjEueSwgZGlyMi55KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFsbEVxdWFsWmVybyhuMTogbnVtYmVyLCBuMjogbnVtYmVyLCBuMzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBVdGlscy5lcXVhbHMobjEsIDApICYmIFV0aWxzLmVxdWFscyhuMiwgMCkgJiYgVXRpbHMuZXF1YWxzKG4zLCAwKTtcbiAgICB9XG5cbiAgICBpbmNsaW5hdGlvbigpOiBSb3RhdGlvbiB7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy54LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy55ID4gMCA/IDE4MCA6IDApO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHRoaXMueSwgMCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKHRoaXMueCA+IDAgPyA5MCA6IC05MCk7XG4gICAgICAgIGNvbnN0IGFkamFjZW50ID0gbmV3IFZlY3RvcigwLC1NYXRoLmFicyh0aGlzLnkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbigoTWF0aC5zaWduKHRoaXMueCkqTWF0aC5hY29zKHRoaXMuZG90UHJvZHVjdChhZGphY2VudCkvYWRqYWNlbnQubGVuZ3RoL3RoaXMubGVuZ3RoKSoxODAvTWF0aC5QSSkpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3ZnTmV0d29yayB9IGZyb20gXCIuL1N2Z05ldHdvcmtcIjtcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi9OZXR3b3JrXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5cbi8vIFRPRE86IGVyYXNlIGFuaW0sIGxhYmVscywgem9vbSwgbmVnYXRpdmUgZGVmYXVsdCB0cmFja3MgYmFzZWQgb24gZGlyZWN0aW9uLCByZXVzZSB0cmFjayBvZiBqdXN0IGVyYXNlZCBsaW5lP1xuXG5jb25zdCBuZXR3b3JrOiBOZXR3b3JrID0gbmV3IE5ldHdvcmsobmV3IFN2Z05ldHdvcmsoKSk7XG5uZXR3b3JrLmluaXRpYWxpemUoKTtcblxuY29uc3QgYW5pbWF0ZUZyb21FcG9jaDogbnVtYmVyID0gZ2V0U3RhcnRFcG9jaCgpO1xuc2xpZGUoSW5zdGFudC5CSUdfQkFORywgZmFsc2UpO1xuXG5mdW5jdGlvbiBnZXRTdGFydEVwb2NoKCk6IG51bWJlciB7XG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhhc2ggJiYgbmV0d29yay5pc0Vwb2NoRXhpc3Rpbmcod2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKSkpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0ZUZyb21FcG9jaDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Zhc3QgZm9yd2FyZCB0byAnICsgYW5pbWF0ZUZyb21FcG9jaCk7XG4gICAgICAgIHJldHVybiBwYXJzZUludChhbmltYXRlRnJvbUVwb2NoKSB8fCAwO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gc2xpZGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpbnN0YW50LmVwb2NoID09IGFuaW1hdGVGcm9tRXBvY2gpXG4gICAgICAgIGFuaW1hdGUgPSB0cnVlO1xuXG4gICAgbmV0d29yay5zZXRJbnN0YW50KGluc3RhbnQpO1xuXG4gICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IG5ldHdvcmsudGltZWREcmF3YWJsZXNBdChpbnN0YW50KTtcbiAgICBsZXQgZGVsYXkgPSAwO1xuICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBkZWxheSArPSBkcmF3T3JFcmFzZUVsZW1lbnQoZWxlbWVudHNbaV0sIGRlbGF5LCBhbmltYXRlLCBpbnN0YW50KTtcbiAgICB9XG4gICAgY29uc3QgbmV4dCA9IG5ldHdvcmsubmV4dEluc3RhbnQoaW5zdGFudCk7XG4gICAgXG4gICAgaWYgKG5leHQpIHtcbiAgICAgICAgY29uc3QgZGVsYXkgPSBhbmltYXRlID8gaW5zdGFudC5kZWx0YShuZXh0KSA6IDA7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzbGlkZShuZXh0LCBhbmltYXRlKTsgfSwgZGVsYXkgKiAxMDAwKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdPckVyYXNlRWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBpbnN0YW50OiBJbnN0YW50KTogbnVtYmVyIHtcblxuICAgIGlmIChpbnN0YW50LmVxdWFscyhlbGVtZW50LnRvKSAmJiAhZWxlbWVudC5mcm9tLmVxdWFscyhlbGVtZW50LnRvKSkge1xuICAgICAgICByZXR1cm4gZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKGVsZW1lbnQudG8sIGFuaW1hdGUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRyYXdFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKGVsZW1lbnQuZnJvbSwgYW5pbWF0ZSkpO1xufVxuXG5mdW5jdGlvbiBkcmF3RWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZWxlbWVudC5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbn1cblxuZnVuY3Rpb24gZXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgIHJldHVybiBlbGVtZW50LmVyYXNlKGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZEFuaW1hdGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpbnN0YW50LmZsYWcgPT0gJ25vYW5pbScpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gYW5pbWF0ZTtcbn1cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==