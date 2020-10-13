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
            track = track.fromExistingLineAtStation(stop.getAxisAndTrackForExistingLine(this.name));
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
        const newPos = station.assignTrack(newDir.isVertical() ? 'x' : 'y', track);
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
        const existingAxis = (_a = station.getAxisAndTrackForExistingLine(this.name)) === null || _a === void 0 ? void 0 : _a.axis;
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
        this.adapter.drawEpoch(instant.epoch + '');
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
        this.baseCoords = this.adapter.baseCoords;
        this.rotation = this.adapter.rotation;
        this.labelDir = this.adapter.labelDir;
        this.id = this.adapter.id;
    }
    addLine(line, axis, track) {
        this.existingLines[axis].push({ line: line, track: track });
    }
    removeLine(line) {
        this.removeLineAtAxis(line, this.existingLines.x);
        this.removeLineAtAxis(line, this.existingLines.y);
    }
    removeLineAtAxis(line, existingLinesForAxis) {
        let i = 0;
        while (i < existingLinesForAxis.length) {
            if (existingLinesForAxis[i].line == line) {
                existingLinesForAxis.splice(i, 1);
            }
            else {
                i++;
            }
        }
    }
    getAxisAndTrackForExistingLine(lineName) {
        const x = this.getTrackForLineAtAxis(lineName, this.existingLines.x);
        if (x != undefined) {
            x.axis = 'x';
            return x;
        }
        const y = this.getTrackForLineAtAxis(lineName, this.existingLines.y);
        if (y != undefined) {
            y.axis = 'y';
            return y;
        }
        return undefined;
    }
    getTrackForLineAtAxis(lineName, existingLinesForAxis) {
        let i = 0;
        while (i < existingLinesForAxis.length) {
            if (existingLinesForAxis[i].line.name == lineName) {
                return { line: existingLinesForAxis[i].line, axis: '', track: existingLinesForAxis[i].track };
            }
            i++;
        }
        return undefined;
    }
    assignTrack(axis, preferredTrack) {
        const positionBoundariesForAxis = this.positionBoundaries()[axis];
        if (preferredTrack.hasTrackNumber()) {
            return preferredTrack.trackNumber;
        }
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
        let dashedPart = length + '';
        const presetDash = getComputedStyle(this.element).strokeDasharray.replace(/[^0-9\s,]+/g, '');
        if (presetDash.length > 0) {
            let presetArray = presetDash.split(/[\s,]+/);
            if (presetArray.length % 2 == 1)
                presetArray = presetArray.concat(presetArray);
            const presetLength = presetArray.map(a => parseInt(a) || 0).reduce((a, b) => a + b, 0);
            dashedPart = new Array(Math.ceil(length / presetLength + 1)).join(presetArray.join(' ') + ' ') + '0';
        }
        this.element.style.strokeDasharray = dashedPart + ' ' + length;
        if (animationDurationSeconds == 0) {
            length = 0;
        }
        this.animateFrame(length, length / animationDurationSeconds / SvgLine.FPS);
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
var precedingStop = undefined;
var precedingDir = undefined;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luc3RhbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xhYmVsLnRzIiwid2VicGFjazovLy8uL3NyYy9MaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9OZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9QcmVmZXJyZWRUcmFjay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUm90YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N0YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N2Z0xhYmVsLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdMaW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdOZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9TdmdTdGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9VdGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmVjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FB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QyxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksNENBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztTQUMzQjtRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsT0FBTyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsdUJBQXVCLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDOUMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFTyxZQUFZLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO1FBQ25ELE9BQU8sNENBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLDRDQUFLLENBQUMsTUFBTSxDQUFD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WSxDQUFDLE9BQXNCLEVBQUUsS0FBYSxFQUFFLE9BQWdCO0lBQ3pFLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxPQUFnQixFQUFFLE9BQWdCO0lBQ3JELElBQUksQ0FBQyxPQUFPO1FBQ1IsT0FBTyxLQUFLLENBQUM7SUFDakIsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVE7UUFDeEIsT0FBTyxLQUFLLENBQUM7SUFDakIsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyIsImZpbGUiOiJuZXR3b3JrLWFuaW1hdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsImV4cG9ydCBjbGFzcyBJbnN0YW50IHtcbiAgICBzdGF0aWMgQklHX0JBTkc6IEluc3RhbnQgPSBuZXcgSW5zdGFudCgwLCAwLCAnJyk7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZXBvY2g6IG51bWJlciwgcHJpdmF0ZSBfc2Vjb25kOiBudW1iZXIsIHByaXZhdGUgX2ZsYWc6IHN0cmluZykge1xuXG4gICAgfVxuICAgIGdldCBlcG9jaCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXBvY2g7XG4gICAgfVxuICAgIGdldCBzZWNvbmQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlY29uZDtcbiAgICB9XG4gICAgZ2V0IGZsYWcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsYWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb20oYXJyYXk6IHN0cmluZ1tdKTogSW5zdGFudCB7XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFudChwYXJzZUludChhcnJheVswXSksIHBhcnNlSW50KGFycmF5WzFdKSwgYXJyYXlbMl0gPz8gJycpXG4gICAgfVxuXG4gICAgZXF1YWxzKHRoYXQ6IEluc3RhbnQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXBvY2ggPT0gdGhhdC5lcG9jaCAmJiB0aGlzLnNlY29uZCA9PSB0aGF0LnNlY29uZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IEluc3RhbnQpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5lcG9jaCA9PSB0aGF0LmVwb2NoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5zZWNvbmQgLSB0aGlzLnNlY29uZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhhdC5zZWNvbmQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaW1lZERyYXdhYmxlLCBUaW1lZCB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBTdGF0aW9uIH0gZnJvbSBcIi4vU3RhdGlvblwiO1xuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFiZWxBZGFwdGVyIGV4dGVuZHMgVGltZWQge1xuICAgIGZvclN0YXRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbik6IHZvaWQ7XG4gICAgZXJhc2UoZGVsYXlTZWNvbmRzOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGFiZWwgaW1wbGVtZW50cyBUaW1lZERyYXdhYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogTGFiZWxBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG5cbiAgICBnZXQgZm9yU3RhdGlvbigpOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3RhdGlvblByb3ZpZGVyLnN0YXRpb25CeUlkKHRoaXMuYWRhcHRlci5mb3JTdGF0aW9uIHx8ICcnKTtcbiAgICAgICAgaWYgKHMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgdGhpcy5hZGFwdGVyLmZvclN0YXRpb24gKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGRyYXcoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXIuZm9yU3RhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmZvclN0YXRpb247XG4gICAgICAgICAgICBjb25zdCBiYXNlQ29vcmQgPSBzdGF0aW9uLmJhc2VDb29yZHM7XG4gICAgICAgICAgICBjb25zdCBsYWJlbERpciA9IHN0YXRpb24ubGFiZWxEaXI7XG4gICAgICAgICAgICBjb25zdCBzdGF0aW9uRGlyID0gc3RhdGlvbi5yb3RhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IGRpZmZEaXIgPSBsYWJlbERpci5hZGQobmV3IFJvdGF0aW9uKC1zdGF0aW9uRGlyLmRlZ3JlZXMpKTtcbiAgICAgICAgICAgIGNvbnN0IHVuaXR2ID0gVmVjdG9yLlVOSVQucm90YXRlKGRpZmZEaXIpO1xuICAgICAgICAgICAgY29uc3QgYW5jaG9yID0gbmV3IFZlY3RvcihzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneCcsIHVuaXR2LngpLCBzdGF0aW9uLnN0YXRpb25TaXplRm9yQXhpcygneScsIHVuaXR2LnkpKTtcbiAgICAgICAgICAgIGNvbnN0IHRleHRDb29yZHMgPSBiYXNlQ29vcmQuYWRkKGFuY2hvci5yb3RhdGUoc3RhdGlvbkRpcikpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyLmRyYXcoZGVsYXksIHRleHRDb29yZHMsIGxhYmVsRGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZXZlcnNlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufSIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUsIFRpbWVkIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcbmltcG9ydCB7IFN0YXRpb24sIFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFN0YXRpb25Qcm92aWRlciB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFByZWZlcnJlZFRyYWNrIH0gZnJvbSBcIi4vUHJlZmVycmVkVHJhY2tcIjtcblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQWRhcHRlciBleHRlbmRzIFRpbWVkICB7XG4gICAgc3RvcHM6IFN0b3BbXTtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHBhdGg6IFZlY3RvcltdKTogdm9pZDtcbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4pOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGluZSBpbXBsZW1lbnRzIFRpbWVkRHJhd2FibGUge1xuICAgIHN0YXRpYyBOT0RFX0RJU1RBTkNFID0gMDtcbiAgICBzdGF0aWMgU1BFRUQgPSAxMDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IExpbmVBZGFwdGVyLCBwcml2YXRlIHN0YXRpb25Qcm92aWRlcjogU3RhdGlvblByb3ZpZGVyKSB7XG5cbiAgICB9XG5cbiAgICBmcm9tID0gdGhpcy5hZGFwdGVyLmZyb207XG4gICAgdG8gPSB0aGlzLmFkYXB0ZXIudG87XG4gICAgbmFtZSA9IHRoaXMuYWRhcHRlci5uYW1lO1xuICAgIFxuICAgIHByaXZhdGUgcHJlY2VkaW5nU3RvcDogU3RhdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIHByZWNlZGluZ0RpcjogUm90YXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBkcmF3KGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzdG9wcyA9IHRoaXMuYWRhcHRlci5zdG9wcztcbiAgICAgICAgY29uc3QgcGF0aDogVmVjdG9yW10gPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGxldCB0cmFjayA9IG5ldyBQcmVmZXJyZWRUcmFjaygnKycpO1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8c3RvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbVN0cmluZyhzdG9wc1tqXS5wcmVmZXJyZWRUcmFjayk7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoc3RvcHNbal0uc3RhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChzdG9wID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRpb24gd2l0aCBJRCAnICsgc3RvcHNbal0uc3RhdGlvbklkICsgJyBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHRyYWNrID0gdHJhY2suZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihzdG9wLmdldEF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdG9wLCB0aGlzLm5leHRTdG9wQmFzZUNvb3JkKHN0b3BzLCBqLCBzdG9wLmJhc2VDb29yZHMpLCB0cmFjaywgcGF0aCwgZGVsYXksIGFuaW1hdGUsIHRydWUpO1xuICAgICAgICAgICAgdHJhY2sgPSB0cmFjay5rZWVwT25seVNpZ24oKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZHVyYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGgsIGFuaW1hdGUpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheSwgZHVyYXRpb24sIHBhdGgpO1xuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfVxuXG4gICAgZXJhc2UoZGVsYXk6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbiwgcmV2ZXJzZTogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5lcmFzZShkZWxheSwgMCwgcmV2ZXJzZSk7XG4gICAgICAgIGNvbnN0IHN0b3BzID0gdGhpcy5hZGFwdGVyLnN0b3BzO1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8c3RvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChzdG9wc1tqXS5zdGF0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyBzdG9wc1tqXS5zdGF0aW9uSWQgKyAnIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgc3RvcC5yZW1vdmVMaW5lKHRoaXMpO1xuICAgICAgICAgICAgc3RvcC5kcmF3KGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRTdG9wQmFzZUNvb3JkKHN0b3BzOiBTdG9wW10sIGN1cnJlbnRTdG9wSW5kZXg6IG51bWJlciwgZGVmYXVsdENvb3JkczogVmVjdG9yKSB7XG4gICAgICAgIGlmIChjdXJyZW50U3RvcEluZGV4KzEgPCBzdG9wcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gc3RvcHNbY3VycmVudFN0b3BJbmRleCsxXS5zdGF0aW9uSWQ7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuc3RhdGlvbkJ5SWQoaWQpO1xuICAgICAgICAgICAgaWYgKHN0b3AgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGlvbiB3aXRoIElEICcgKyBpZCArICcgaXMgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gc3RvcC5iYXNlQ29vcmRzOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0Q29vcmRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCB0cmFjazogUHJlZmVycmVkVHJhY2ssIHBhdGg6IFZlY3RvcltdLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCByZWN1cnNlOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRpciA9IHN0YXRpb24ucm90YXRpb247XG4gICAgICAgIGNvbnN0IGJhc2VDb29yZCA9IHN0YXRpb24uYmFzZUNvb3JkcztcbiAgICAgICAgY29uc3QgbmV3RGlyID0gdGhpcy5nZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgZGlyLCBwYXRoKTtcbiAgICAgICAgY29uc3QgbmV3UG9zID0gc3RhdGlvbi5hc3NpZ25UcmFjayhuZXdEaXIuaXNWZXJ0aWNhbCgpID8gJ3gnIDogJ3knLCB0cmFjayk7XG5cbiAgICAgICAgY29uc3QgbmV3Q29vcmQgPSBzdGF0aW9uLnJvdGF0ZWRUcmFja0Nvb3JkaW5hdGVzKG5ld0RpciwgbmV3UG9zKTtcbiAgICBcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gdGhpcy5nZXRQcmVjZWRpbmdEaXIodGhpcy5wcmVjZWRpbmdEaXIsIHRoaXMucHJlY2VkaW5nU3RvcCwgb2xkQ29vcmQsIG5ld0Nvb3JkKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb25EaXIgPSBuZXdEaXIuYWRkKGRpcik7XG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IHRoaXMuaW5zZXJ0Tm9kZShvbGRDb29yZCwgdGhpcy5wcmVjZWRpbmdEaXIsIG5ld0Nvb3JkLCBzdGF0aW9uRGlyLCBwYXRoKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZm91bmQgJiYgcmVjdXJzZSAmJiB0aGlzLnByZWNlZGluZ1N0b3AgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscFN0b3AgPSB0aGlzLmdldE9yQ3JlYXRlSGVscGVyU3RvcCh0aGlzLnByZWNlZGluZ0RpciwgdGhpcy5wcmVjZWRpbmdTdG9wLCBzdGF0aW9uKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnByZWNlZGluZ0RpciA9IHRoaXMucHJlY2VkaW5nRGlyLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVDb25uZWN0aW9uKGhlbHBTdG9wLCBiYXNlQ29vcmQsIHRyYWNrLmtlZXBPbmx5U2lnbigpLCBwYXRoLCBkZWxheSwgYW5pbWF0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihzdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZCwgdHJhY2ssIHBhdGgsIGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3BhdGggdG8gZml4IG9uIGxpbmUnLCB0aGlzLmFkYXB0ZXIubmFtZSwgJ2F0IHN0YXRpb24nLCBzdGF0aW9uLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJlY2VkaW5nRGlyID0gc3RhdGlvbkRpcjtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aW9uLmFkZExpbmUodGhpcywgbmV3RGlyLmlzVmVydGljYWwoKSA/ICd4JyA6ICd5JywgbmV3UG9zKTtcbiAgICAgICAgcGF0aC5wdXNoKG5ld0Nvb3JkKTtcbiAgICAgICAgZGVsYXkgPSB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKHBhdGgsIGFuaW1hdGUpICsgZGVsYXk7XG4gICAgICAgIHN0YXRpb24uZHJhdyhkZWxheSk7XG4gICAgICAgIHRoaXMucHJlY2VkaW5nU3RvcCA9IHN0YXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTdG9wT3JpZW50YXRpb25CYXNlZE9uVGhyZWVTdG9wcyhzdGF0aW9uOiBTdGF0aW9uLCBuZXh0U3RvcEJhc2VDb29yZDogVmVjdG9yLCBkaXI6IFJvdGF0aW9uLCBwYXRoOiBWZWN0b3JbXSk6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZENvb3JkID0gcGF0aFtwYXRoLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RvcEJhc2VDb29yZC5kZWx0YShvbGRDb29yZCkuaW5jbGluYXRpb24oKS5xdWFydGVyRGlyZWN0aW9uKGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsdGEgPSBzdGF0aW9uLmJhc2VDb29yZHMuZGVsdGEobmV4dFN0b3BCYXNlQ29vcmQpO1xuICAgICAgICBjb25zdCBleGlzdGluZ0F4aXMgPSBzdGF0aW9uLmdldEF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZSh0aGlzLm5hbWUpPy5heGlzO1xuICAgICAgICBpZiAoZXhpc3RpbmdBeGlzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbHRhLmluY2xpbmF0aW9uKCkuaGFsZkRpcmVjdGlvbihkaXIsIGV4aXN0aW5nQXhpcyA9PSAneCcgPyBuZXcgUm90YXRpb24oOTApIDogbmV3IFJvdGF0aW9uKDApKTsgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWx0YS5pbmNsaW5hdGlvbigpLnF1YXJ0ZXJEaXJlY3Rpb24oZGlyKTtcbiAgICB9XG4gICAgXG5cbiAgICBwcml2YXRlIGdldFByZWNlZGluZ0RpcihwcmVjZWRpbmdEaXI6IFJvdGF0aW9uIHwgdW5kZWZpbmVkLCBwcmVjZWRpbmdTdG9wOiBTdGF0aW9uIHwgdW5kZWZpbmVkLCBvbGRDb29yZDogVmVjdG9yLCBuZXdDb29yZDogVmVjdG9yKTogUm90YXRpb24ge1xuICAgICAgICBpZiAocHJlY2VkaW5nRGlyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgcHJlY2VkaW5nU3RvcFJvdGF0aW9uID0gcHJlY2VkaW5nU3RvcD8ucm90YXRpb24gPz8gbmV3IFJvdGF0aW9uKDApO1xuICAgICAgICAgICAgcHJlY2VkaW5nRGlyID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCkucXVhcnRlckRpcmVjdGlvbihwcmVjZWRpbmdTdG9wUm90YXRpb24pLmFkZChwcmVjZWRpbmdTdG9wUm90YXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJlY2VkaW5nRGlyID0gcHJlY2VkaW5nRGlyLmFkZChuZXcgUm90YXRpb24oMTgwKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZWNlZGluZ0RpcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluc2VydE5vZGUoZnJvbUNvb3JkOiBWZWN0b3IsIGZyb21EaXI6IFJvdGF0aW9uLCB0b0Nvb3JkOiBWZWN0b3IsIHRvRGlyOiBSb3RhdGlvbiwgcGF0aDogVmVjdG9yW10pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZGVsdGE6IFZlY3RvciA9IGZyb21Db29yZC5kZWx0YSh0b0Nvb3JkKTtcbiAgICAgICAgY29uc3Qgb2xkRGlyViA9IFZlY3Rvci5VTklULnJvdGF0ZShmcm9tRGlyKTtcbiAgICAgICAgY29uc3QgbmV3RGlyViA9IFZlY3Rvci5VTklULnJvdGF0ZSh0b0Rpcik7XG4gICAgICAgIGlmIChkZWx0YS5pc0RlbHRhTWF0Y2hpbmdQYXJhbGxlbChvbGREaXJWLCBuZXdEaXJWKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29sdXRpb24gPSBkZWx0YS5zb2x2ZURlbHRhRm9ySW50ZXJzZWN0aW9uKG9sZERpclYsIG5ld0RpclYpXG4gICAgICAgIGlmIChzb2x1dGlvbi5hID4gTGluZS5OT0RFX0RJU1RBTkNFICYmIHNvbHV0aW9uLmIgPiBMaW5lLk5PREVfRElTVEFOQ0UpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChuZXcgVmVjdG9yKGZyb21Db29yZC54K29sZERpclYueCpzb2x1dGlvbi5hLCBmcm9tQ29vcmQueStvbGREaXJWLnkqc29sdXRpb24uYSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3JDcmVhdGVIZWxwZXJTdG9wKGZyb21EaXI6IFJvdGF0aW9uLCBmcm9tU3RvcDogU3RhdGlvbiwgdG9TdG9wOiBTdGF0aW9uKTogU3RhdGlvbiB7XG4gICAgICAgIGNvbnN0IGhlbHBTdG9wSWQgPSAnaF8nICsgVXRpbHMuYWxwaGFiZXRpY0lkKGZyb21TdG9wLmlkLCB0b1N0b3AuaWQpO1xuICAgICAgICBsZXQgaGVscFN0b3AgPSB0aGlzLnN0YXRpb25Qcm92aWRlci5zdGF0aW9uQnlJZChoZWxwU3RvcElkKTtcbiAgICAgICAgaWYgKGhlbHBTdG9wID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkQ29vcmQgPSBmcm9tU3RvcC5iYXNlQ29vcmRzO1xuICAgICAgICAgICAgY29uc3QgbmV3Q29vcmQgPSB0b1N0b3AuYmFzZUNvb3JkcztcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3Q29vcmQuZGVsdGEob2xkQ29vcmQpO1xuICAgICAgICAgICAgY29uc3QgZGVnID0gb2xkQ29vcmQuZGVsdGEobmV3Q29vcmQpLmluY2xpbmF0aW9uKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhoZWxwU3RvcElkLCBkZWcsIGZyb21EaXIpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJtZWRpYXRlRGlyID0gbmV3IFJvdGF0aW9uKChkZWcuZGVsdGEoZnJvbURpcikuZGVncmVlcyA+PSAwID8gTWF0aC5mbG9vcihkZWcuZGVncmVlcyAvIDQ1KSA6IE1hdGguY2VpbChkZWcuZGVncmVlcyAvIDQ1KSkgKiA0NSkubm9ybWFsaXplKCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVDb29yZCA9IGRlbHRhLndpdGhMZW5ndGgoZGVsdGEubGVuZ3RoLzIpLmFkZChuZXdDb29yZCk7XG5cbiAgICAgICAgICAgIGhlbHBTdG9wID0gdGhpcy5zdGF0aW9uUHJvdmlkZXIuY3JlYXRlVmlydHVhbFN0b3AoaGVscFN0b3BJZCwgaW50ZXJtZWRpYXRlQ29vcmQsIGludGVybWVkaWF0ZURpcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlbHBTdG9wO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QW5pbWF0aW9uRHVyYXRpb24ocGF0aDogVmVjdG9yW10sIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICBpZiAoIWFuaW1hdGUpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCkgLyBMaW5lLlNQRUVEO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFRvdGFsTGVuZ3RoKHBhdGg6IFZlY3RvcltdKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxwYXRoLmxlbmd0aC0xOyBpKyspIHtcbiAgICAgICAgICAgIGxlbmd0aCArPSBwYXRoW2ldLmRlbHRhKHBhdGhbaSsxXSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxufSIsImltcG9ydCB7IFRpbWVkRHJhd2FibGUgfSBmcm9tIFwiLi9EcmF3YWJsZVwiO1xuaW1wb3J0IHsgSW5zdGFudCB9IGZyb20gXCIuL0luc3RhbnRcIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aW9uUHJvdmlkZXIge1xuICAgIHN0YXRpb25CeUlkKGlkOiBzdHJpbmcpOiBTdGF0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0FkYXB0ZXIge1xuICAgIGluaXRpYWxpemUobmV0d29yazogTmV0d29yayk6IHZvaWQ7XG4gICAgc3RhdGlvbkJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRpb24gfCBudWxsO1xuICAgIGNyZWF0ZVZpcnR1YWxTdG9wKGlkOiBzdHJpbmcsIGJhc2VDb29yZHM6IFZlY3Rvciwgcm90YXRpb246IFJvdGF0aW9uKTogU3RhdGlvbjtcbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBOZXR3b3JrIGltcGxlbWVudHMgU3RhdGlvblByb3ZpZGVyIHtcbiAgICBwcml2YXRlIHNsaWRlSW5kZXg6IHtbaWQ6IHN0cmluZ10gOiB7W2lkOiBzdHJpbmddOiBUaW1lZERyYXdhYmxlW119fSA9IHt9O1xuICAgIHByaXZhdGUgc3RhdGlvbnM6IHsgW2lkOiBzdHJpbmddIDogU3RhdGlvbiB9ID0ge307XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFkYXB0ZXI6IE5ldHdvcmtBZGFwdGVyKSB7XG5cbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRpb25zW2lkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzLmFkYXB0ZXIuc3RhdGlvbkJ5SWQoaWQpXG4gICAgICAgICAgICBpZiAoc3RhdGlvbiAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGlvbnNbaWRdID0gc3RhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aW9uc1tpZF07XG4gICAgfVxuXG4gICAgY3JlYXRlVmlydHVhbFN0b3AoaWQ6IHN0cmluZywgYmFzZUNvb3JkczogVmVjdG9yLCByb3RhdGlvbjogUm90YXRpb24pOiBTdGF0aW9uIHtcbiAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuYWRhcHRlci5jcmVhdGVWaXJ0dWFsU3RvcChpZCwgYmFzZUNvb3Jkcywgcm90YXRpb24pO1xuICAgICAgICB0aGlzLnN0YXRpb25zW2lkXSA9IHN0b3A7XG4gICAgICAgIHJldHVybiBzdG9wO1xuICAgIH1cblxuICAgIHNldEluc3RhbnQoaW5zdGFudDogSW5zdGFudCkge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhd0Vwb2NoKGluc3RhbnQuZXBvY2ggKyAnJylcbiAgICB9XG5cbiAgICB0aW1lZERyYXdhYmxlc0F0KG5vdzogSW5zdGFudCk6IFRpbWVkRHJhd2FibGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlSW5kZXhbbm93LmVwb2NoXVtub3cuc2Vjb25kXTtcbiAgICB9XG5cbiAgICBpc0Vwb2NoRXhpc3RpbmcoZXBvY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZUluZGV4W2Vwb2NoXSAhPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFRvSW5kZXgoZWxlbWVudDogVGltZWREcmF3YWJsZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldFNsaWRlSW5kZXhFbGVtZW50KGVsZW1lbnQuZnJvbSwgZWxlbWVudCk7XG4gICAgICAgIGlmICghSW5zdGFudC5CSUdfQkFORy5lcXVhbHMoZWxlbWVudC50bykpXG4gICAgICAgICAgICB0aGlzLnNldFNsaWRlSW5kZXhFbGVtZW50KGVsZW1lbnQudG8sIGVsZW1lbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U2xpZGVJbmRleEVsZW1lbnQoaW5zdGFudDogSW5zdGFudCwgZWxlbWVudDogVGltZWREcmF3YWJsZSk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXSA9IHt9O1xuICAgICAgICBpZiAodGhpcy5zbGlkZUluZGV4W2luc3RhbnQuZXBvY2hdW2luc3RhbnQuc2Vjb25kXSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnNsaWRlSW5kZXhbaW5zdGFudC5lcG9jaF1baW5zdGFudC5zZWNvbmRdID0gW107XG4gICAgICAgIHRoaXMuc2xpZGVJbmRleFtpbnN0YW50LmVwb2NoXVtpbnN0YW50LnNlY29uZF0ucHVzaChlbGVtZW50KTtcbiAgICB9XG5cbiAgICBuZXh0SW5zdGFudChub3c6IEluc3RhbnQpOiBJbnN0YW50IHwgbnVsbCB7XG4gICAgICAgIGxldCBlcG9jaDogbnVtYmVyIHwgbnVsbCA9IG5vdy5lcG9jaDtcbiAgICAgICAgbGV0IHNlY29uZDogbnVtYmVyIHwgbnVsbCA9IHRoaXMuZmluZFNtYWxsZXN0QWJvdmUobm93LnNlY29uZCwgdGhpcy5zbGlkZUluZGV4W25vdy5lcG9jaF0pO1xuICAgICAgICBpZiAoc2Vjb25kID09IG51bGwpIHtcbiAgICAgICAgICAgIGVwb2NoID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZShub3cuZXBvY2gsIHRoaXMuc2xpZGVJbmRleCk7XG4gICAgICAgICAgICBpZiAoZXBvY2ggPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgc2Vjb25kID0gdGhpcy5maW5kU21hbGxlc3RBYm92ZSgtMSwgdGhpcy5zbGlkZUluZGV4W2Vwb2NoXSk7XG4gICAgICAgICAgICBpZiAoc2Vjb25kID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEluc3RhbnQoZXBvY2gsIHNlY29uZCwgJycpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZpbmRTbWFsbGVzdEFib3ZlKHRocmVzaG9sZDogbnVtYmVyLCBkaWN0OiB7W2lkOiBudW1iZXJdOiBhbnl9KTogbnVtYmVyIHwgbnVsbCB7XG4gICAgICAgIGxldCBzbWFsbGVzdCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRpY3QpKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoa2V5KSA+IHRocmVzaG9sZCAmJiAoc21hbGxlc3QgPT0gdW5kZWZpbmVkIHx8IHBhcnNlSW50KGtleSkgPCBzbWFsbGVzdCkpIHtcbiAgICAgICAgICAgICAgICBzbWFsbGVzdCA9IHBhcnNlSW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNtYWxsZXN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IExpbmVBdFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJyZWRUcmFjayB7XG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFByZWZlcnJlZFRyYWNrIHtcbiAgICAgICAgaWYgKHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWZlcnJlZFRyYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBQcmVmZXJyZWRUcmFjayB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlID49IDAgPyAnKycgOiAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayhwcmVmaXggKyB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnJvbUV4aXN0aW5nTGluZUF0U3RhdGlvbihhdFN0YXRpb246IExpbmVBdFN0YXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGF0U3RhdGlvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhY2tOdW1iZXIoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tTnVtYmVyKGF0U3RhdGlvbi50cmFjayk7ICAgICAgICBcbiAgICB9XG5cbiAgICBrZWVwT25seVNpZ24oKTogUHJlZmVycmVkVHJhY2sge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy52YWx1ZVswXTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVmZXJyZWRUcmFjayh2ID09ICcrJyB8fCB2ID09ICctJyA/IHYgOiAnKycpO1xuICAgIH1cblxuICAgIGhhc1RyYWNrTnVtYmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGggPiAxO1xuICAgIH1cblxuICAgIGdldCB0cmFja051bWJlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy52YWx1ZSlcbiAgICB9XG5cbiAgICBpc1Bvc2l0aXZlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVswXSA9PSAnKyc7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRElSUzogeyBbaWQ6IHN0cmluZ106IG51bWJlciB9ID0geydzdyc6IC0xMzUsICd3JzogLTkwLCAnbncnOiAtNDUsICduJzogMCwgJ25lJzogNDUsICdlJzogOTAsICdzZSc6IDEzNSwgJ3MnOiAxODB9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGVncmVlczogbnVtYmVyKSB7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbShkaXJlY3Rpb246IHN0cmluZyk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihSb3RhdGlvbi5ESVJTW2RpcmVjdGlvbl0pXG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoUm90YXRpb24uRElSUykpIHtcbiAgICAgICAgICAgIGlmIChVdGlscy5lcXVhbHModmFsdWUsIHRoaXMuZGVncmVlcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnbic7XG4gICAgfVxuXG4gICAgZ2V0IGRlZ3JlZXMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZ3JlZXM7XG4gICAgfVxuXG4gICAgZ2V0IHJhZGlhbnMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVncmVlcyAvIDE4MCAqIE1hdGguUEk7XG4gICAgfVxuXG4gICAgYWRkKHRoYXQ6IFJvdGF0aW9uKTogUm90YXRpb24ge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5kZWdyZWVzICsgdGhhdC5kZWdyZWVzO1xuICAgICAgICBpZiAoc3VtIDw9IC0xODApXG4gICAgICAgICAgICBzdW0gKz0gMzYwO1xuICAgICAgICBpZiAoc3VtID4gMTgwKVxuICAgICAgICAgICAgc3VtIC09IDM2MDtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihzdW0pO1xuICAgIH1cblxuICAgIGRlbHRhKHRoYXQ6IFJvdGF0aW9uKTogUm90YXRpb24ge1xuICAgICAgICBsZXQgYSA9IHRoaXMuZGVncmVlcztcbiAgICAgICAgbGV0IGIgPSB0aGF0LmRlZ3JlZXM7XG4gICAgICAgIGxldCBkaXN0ID0gYi1hO1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdCkgPiAxODApIHtcbiAgICAgICAgICAgIGlmIChhIDwgMClcbiAgICAgICAgICAgICAgICBhICs9IDM2MDtcbiAgICAgICAgICAgIGlmIChiIDwgMClcbiAgICAgICAgICAgICAgICBiICs9IDM2MDtcbiAgICAgICAgICAgIGRpc3QgPSBiLWE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihkaXN0KTtcbiAgICB9XG5cbiAgICBub3JtYWxpemUoKTogUm90YXRpb24ge1xuICAgICAgICBsZXQgZGlyID0gdGhpcy5kZWdyZWVzO1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGRpciwgLTkwKSlcbiAgICAgICAgICAgIGRpciA9IDA7XG4gICAgICAgIGVsc2UgaWYgKGRpciA8IC05MClcbiAgICAgICAgICAgIGRpciArPSAxODA7XG4gICAgICAgIGVsc2UgaWYgKGRpciA+IDkwKVxuICAgICAgICAgICAgZGlyIC09IDE4MDtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihkaXIpO1xuICAgIH1cblxuICAgIGlzVmVydGljYWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlZ3JlZXMgJSAxODAgPT0gMDtcbiAgICB9XG5cbiAgICBxdWFydGVyRGlyZWN0aW9uKHJlbGF0aXZlVG86IFJvdGF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhRGlyID0gcmVsYXRpdmVUby5kZWx0YSh0aGlzKS5kZWdyZWVzO1xuICAgICAgICBjb25zdCBkZWcgPSBkZWx0YURpciA8IDAgPyBNYXRoLmNlaWwoKGRlbHRhRGlyLTQ1KS85MCkgOiBNYXRoLmZsb29yKChkZWx0YURpcis0NSkvOTApO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKGRlZyo5MCk7XG4gICAgfVxuXG4gICAgaGFsZkRpcmVjdGlvbihyZWxhdGl2ZVRvOiBSb3RhdGlvbiwgc3BsaXRBeGlzOiBSb3RhdGlvbikge1xuICAgICAgICBjb25zdCBkZWx0YURpciA9IHJlbGF0aXZlVG8uZGVsdGEodGhpcykuZGVncmVlcztcbiAgICAgICAgbGV0IGRlZztcbiAgICAgICAgaWYgKHNwbGl0QXhpcy5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgICAgICAgIGlmIChkZWx0YURpciA8IDAgJiYgZGVsdGFEaXIgPj0gLTE4MClcbiAgICAgICAgICAgICAgICBkZWcgPSAtOTA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVnID0gOTA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGVsdGFEaXIgPCA5MCAmJiBkZWx0YURpciA+PSAtOTApXG4gICAgICAgICAgICAgICAgZGVnID0gMDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWcgPSAxODA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbihkZWcpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9MaW5lXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBQcmVmZXJyZWRUcmFjayB9IGZyb20gXCIuL1ByZWZlcnJlZFRyYWNrXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGlvbkFkYXB0ZXIge1xuICAgIGJhc2VDb29yZHM6IFZlY3RvcjtcbiAgICByb3RhdGlvbjogUm90YXRpb247XG4gICAgbGFiZWxEaXI6IFJvdGF0aW9uO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgZHJhdyhkZWxheVNlY29uZHM6IG51bWJlciwgZ2V0UG9zaXRpb25Cb3VuZGFyaWVzOiAoKSA9PiB7W2lkOiBzdHJpbmddOiBbbnVtYmVyLCBudW1iZXJdfSk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGlvbklkOiBzdHJpbmcsIHB1YmxpYyBwcmVmZXJyZWRUcmFjazogc3RyaW5nKSB7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUF0U3RhdGlvbiB7XG4gICAgbGluZT86IExpbmU7XG4gICAgYXhpczogc3RyaW5nO1xuICAgIHRyYWNrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aW9uIHtcbiAgICBzdGF0aWMgTElORV9ESVNUQU5DRSA9IDY7XG4gICAgc3RhdGljIERFRkFVTFRfU1RPUF9ESU1FTiA9IDEwO1xuICAgIHN0YXRpYyBMQUJFTF9ESVNUQU5DRSA9IDA7XG5cbiAgICBwcml2YXRlIGV4aXN0aW5nTGluZXM6IHtbaWQ6IHN0cmluZ106IHtsaW5lOiBMaW5lLCB0cmFjazogbnVtYmVyfVtdfSA9IHt4OiBbXSwgeTogW119O1xuICAgIGJhc2VDb29yZHMgPSB0aGlzLmFkYXB0ZXIuYmFzZUNvb3JkcztcbiAgICByb3RhdGlvbiA9IHRoaXMuYWRhcHRlci5yb3RhdGlvbjtcbiAgICBsYWJlbERpciA9IHRoaXMuYWRhcHRlci5sYWJlbERpcjtcbiAgICBpZCA9IHRoaXMuYWRhcHRlci5pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWRhcHRlcjogU3RhdGlvbkFkYXB0ZXIpIHtcblxuICAgIH1cblxuICAgIGFkZExpbmUobGluZTogTGluZSwgYXhpczogc3RyaW5nLCB0cmFjazogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdMaW5lc1theGlzXS5wdXNoKHtsaW5lOiBsaW5lLCB0cmFjazogdHJhY2t9KTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmU6IExpbmUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy54KTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaW5lQXRBeGlzKGxpbmUsIHRoaXMuZXhpc3RpbmdMaW5lcy55KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUxpbmVBdEF4aXMobGluZTogTGluZSwgZXhpc3RpbmdMaW5lc0ZvckF4aXM6IHtsaW5lOiBMaW5lLCB0cmFjazogbnVtYmVyfVtdKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lID09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICBleGlzdGluZ0xpbmVzRm9yQXhpcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEF4aXNBbmRUcmFja0ZvckV4aXN0aW5nTGluZShsaW5lTmFtZTogc3RyaW5nKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdldFRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLngpO1xuICAgICAgICBpZiAoeCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHguYXhpcyA9ICd4JztcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdldFRyYWNrRm9yTGluZUF0QXhpcyhsaW5lTmFtZSwgdGhpcy5leGlzdGluZ0xpbmVzLnkpO1xuICAgICAgICBpZiAoeSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHkuYXhpcyA9ICd5JztcbiAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUcmFja0ZvckxpbmVBdEF4aXMobGluZU5hbWU6IHN0cmluZywgZXhpc3RpbmdMaW5lc0ZvckF4aXM6IHtsaW5lOiBMaW5lLCB0cmFjazogbnVtYmVyfVtdKTogTGluZUF0U3RhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS5saW5lLm5hbWUgPT0gbGluZU5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge2xpbmU6IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLmxpbmUsIGF4aXM6ICcnLCB0cmFjazogZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2t9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXNzaWduVHJhY2soYXhpczogc3RyaW5nLCBwcmVmZXJyZWRUcmFjazogUHJlZmVycmVkVHJhY2spOiBudW1iZXIgeyBcbiAgICAgICAgY29uc3QgcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzKClbYXhpc107XG4gICAgICAgIGlmIChwcmVmZXJyZWRUcmFjay5oYXNUcmFja051bWJlcigpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZmVycmVkVHJhY2sudHJhY2tOdW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZWZlcnJlZFRyYWNrLmlzUG9zaXRpdmUoKSA/IHBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXNbMV0gKyAxIDogcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpc1swXSAtIDE7XG4gICAgfVxuXG4gICAgcm90YXRlZFRyYWNrQ29vcmRpbmF0ZXMoaW5jb21pbmdEaXI6IFJvdGF0aW9uLCBhc3NpZ25lZFRyYWNrOiBudW1iZXIpOiBWZWN0b3IgeyBcbiAgICAgICAgbGV0IG5ld0Nvb3JkOiBWZWN0b3I7XG4gICAgICAgIGlmIChpbmNvbWluZ0Rpci5kZWdyZWVzICUgMTgwID09IDApIHtcbiAgICAgICAgICAgIG5ld0Nvb3JkID0gbmV3IFZlY3Rvcihhc3NpZ25lZFRyYWNrICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFLCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0Nvb3JkID0gbmV3IFZlY3RvcigwLCBhc3NpZ25lZFRyYWNrICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdDb29yZCA9IG5ld0Nvb3JkLnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICAgICAgbmV3Q29vcmQgPSB0aGlzLmJhc2VDb29yZHMuYWRkKG5ld0Nvb3JkKTtcbiAgICAgICAgcmV0dXJuIG5ld0Nvb3JkO1xuICAgIH1cblxuICAgIHByaXZhdGUgcG9zaXRpb25Cb3VuZGFyaWVzKCk6IHtbaWQ6IHN0cmluZ106IFtudW1iZXIsIG51bWJlcl19IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXMueCksXG4gICAgICAgICAgICB5OiB0aGlzLnBvc2l0aW9uQm91bmRhcmllc0ZvckF4aXModGhpcy5leGlzdGluZ0xpbmVzLnkpXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyhleGlzdGluZ0xpbmVzRm9yQXhpczoge2xpbmU6IExpbmUsIHRyYWNrOiBudW1iZXJ9W10pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgaWYgKGV4aXN0aW5nTGluZXNGb3JBeGlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gWzEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGVmdCA9IDA7XG4gICAgICAgIGxldCByaWdodCA9IDA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxleGlzdGluZ0xpbmVzRm9yQXhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgZXhpc3RpbmdMaW5lc0ZvckF4aXNbaV0udHJhY2spIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IGV4aXN0aW5nTGluZXNGb3JBeGlzW2ldLnRyYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlZnQgPiBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaykge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBleGlzdGluZ0xpbmVzRm9yQXhpc1tpXS50cmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZHJhdyhkZWxheVNlY29uZHMsIGZ1bmN0aW9uKCkgeyByZXR1cm4gc3RhdGlvbi5wb3NpdGlvbkJvdW5kYXJpZXMoKTsgfSk7XG4gICAgfVxuXG4gICAgc3RhdGlvblNpemVGb3JBeGlzKGF4aXM6IHN0cmluZywgdmVjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKHZlY3RvciwgMCkpXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMucG9zaXRpb25Cb3VuZGFyaWVzRm9yQXhpcyh0aGlzLmV4aXN0aW5nTGluZXNbYXhpc10pW3ZlY3RvciA8IDAgPyAwIDogMV0gKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0U7XG4gICAgICAgIHJldHVybiBzaXplICsgTWF0aC5zaWduKHZlY3RvcikgKiAoU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gKyBTdGF0aW9uLkxBQkVMX0RJU1RBTkNFKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgTGFiZWxBZGFwdGVyIH0gZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFN2Z0xhYmVsIGltcGxlbWVudHMgTGFiZWxBZGFwdGVyIHtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IFNWR1RleHRFbGVtZW50KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgZnJvbSgpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgnZnJvbScpO1xuICAgIH1cblxuICAgIGdldCB0bygpOiBJbnN0YW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFudCgndG8nKTtcbiAgICB9XG5cbiAgICBnZXQgZm9yU3RhdGlvbigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhdGlvbjtcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCB0ZXh0Q29vcmRzOiBWZWN0b3IsIGxhYmVsRGlyOiBSb3RhdGlvbik6IHZvaWQge1xuICAgICAgICBpZiAoZGVsYXlTZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxhYmVsLmRyYXcoMCwgdGV4dENvb3JkcywgbGFiZWxEaXIpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENvb3JkKHRoaXMuZWxlbWVudCwgdGV4dENvb3Jkcyk7XG4gICAgICAgIGNvbnN0IGxhYmVsdW5pdHYgPSBWZWN0b3IuVU5JVC5yb3RhdGUobGFiZWxEaXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dEFuY2hvciA9IFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueCwgWydlbmQnLCAnbWlkZGxlJywgJ3N0YXJ0J10pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZG9taW5hbnRCYXNlbGluZSA9IFV0aWxzLnRyaWxlbW1hKGxhYmVsdW5pdHYueSwgWydiYXNlbGluZScsICdtaWRkbGUnLCAnaGFuZ2luZyddKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCArPSAnIHN0YXRpb24nO1xuICAgIH1cblxuICAgIGVyYXNlKGRlbGF5U2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q29vcmQoZWxlbWVudDogYW55LCBjb29yZDogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgY29vcmQueCk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd5JywgY29vcmQueSk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGluZUFkYXB0ZXIsIExpbmUgfSBmcm9tIFwiLi9MaW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBJbnN0YW50IH0gZnJvbSBcIi4vSW5zdGFudFwiO1xuXG5leHBvcnQgY2xhc3MgU3ZnTGluZSBpbXBsZW1lbnRzIExpbmVBZGFwdGVyIHtcblxuICAgIHByaXZhdGUgc3RhdGljIEZQUyA9IDYwO1xuICAgIHByaXZhdGUgX3N0b3BzOiBTdG9wW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogU1ZHUGF0aEVsZW1lbnQpIHtcblxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5saW5lIHx8ICcnO1xuICAgIH1cblxuICAgIGdldCBmcm9tKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCdmcm9tJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRvKCk6IEluc3RhbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW50KCd0bycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5zdGFudChmcm9tT3JUbzogc3RyaW5nKTogSW5zdGFudCB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmVsZW1lbnQuZGF0YXNldFtmcm9tT3JUb10/LnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIGlmIChhcnIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluc3RhbnQuZnJvbShhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbnN0YW50LkJJR19CQU5HO1xuICAgIH1cblxuXG4gICAgZ2V0IHN0b3BzKCk6IFN0b3BbXSB7XG4gICAgICAgIGlmICh0aGlzLl9zdG9wcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RvcHM/LnNwbGl0KC9cXHMrLykgfHwgW107XG4gICAgICAgICAgICBsZXQgbmV4dFN0b3AgPSBuZXcgU3RvcCgnJywgJycpO1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0b2tlbnM/Lmxlbmd0aDtpKyspIHsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRva2Vuc1tpXVswXSAhPSAnLScgJiYgdG9rZW5zW2ldWzBdICE9ICcrJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcC5zdGF0aW9uSWQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BzLnB1c2gobmV4dFN0b3ApO1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RvcCA9IG5ldyBTdG9wKCcnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0b3AucHJlZmVycmVkVHJhY2sgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9wcztcbiAgICB9XG5cbiAgICBkcmF3KGRlbGF5U2Vjb25kczogbnVtYmVyLCBhbmltYXRpb25EdXJhdGlvblNlY29uZHM6IG51bWJlciwgcGF0aDogVmVjdG9yW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBsaW5lLmRyYXcoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCBwYXRoKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxlbmd0aCA9IHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCk7XG4gICAgXG4gICAgICAgIGNvbnN0IGQgPSAnTScgKyBwYXRoLm1hcCh2ID0+IHYueCsnLCcrdi55KS5qb2luKCcgTCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgXG4gICAgICAgIGxldCBkYXNoZWRQYXJ0ID0gbGVuZ3RoICsgJyc7XG4gICAgICAgIGNvbnN0IHByZXNldERhc2ggPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuc3Ryb2tlRGFzaGFycmF5LnJlcGxhY2UoL1teMC05XFxzLF0rL2csICcnKTtcbiAgICAgICAgaWYgKHByZXNldERhc2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHByZXNldEFycmF5ID0gcHJlc2V0RGFzaC5zcGxpdCgvW1xccyxdKy8pO1xuICAgICAgICAgICAgaWYgKHByZXNldEFycmF5Lmxlbmd0aCAlIDIgPT0gMSlcbiAgICAgICAgICAgICAgICBwcmVzZXRBcnJheSA9IHByZXNldEFycmF5LmNvbmNhdChwcmVzZXRBcnJheSk7XG4gICAgICAgICAgICBjb25zdCBwcmVzZXRMZW5ndGggPSBwcmVzZXRBcnJheS5tYXAoYSA9PiBwYXJzZUludChhKSB8fCAwKS5yZWR1Y2UoKGEsIGIpID0+IGErYiwgMCk7XG4gICAgICAgICAgICBkYXNoZWRQYXJ0ID0gbmV3IEFycmF5KE1hdGguY2VpbChsZW5ndGggLyBwcmVzZXRMZW5ndGggKyAxKSkuam9pbihwcmVzZXRBcnJheS5qb2luKCcgJykgKyAnICcpICsgJzAnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBkYXNoZWRQYXJ0ICsgJyAnICsgbGVuZ3RoO1xuICAgICAgICBpZiAoYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRlRnJhbWUobGVuZ3RoLCBsZW5ndGgvYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzL1N2Z0xpbmUuRlBTKTtcbiAgICB9XG5cbiAgICBlcmFzZShkZWxheVNlY29uZHM6IG51bWJlciwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGxpbmUuZXJhc2UoMCwgYW5pbWF0aW9uRHVyYXRpb25TZWNvbmRzLCByZXZlcnNlKTsgfSwgZGVsYXlTZWNvbmRzICogMTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnZCcsICcnKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBhbmltYXRlRnJhbWUobGVuZ3RoOiBudW1iZXIsIGFuaW1hdGlvblBlckZyYW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gbGVuZ3RoICsgJyc7XG4gICAgICAgICAgICBsZW5ndGggLT0gYW5pbWF0aW9uUGVyRnJhbWU7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcztcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxpbmUuYW5pbWF0ZUZyYW1lKGxlbmd0aCwgYW5pbWF0aW9uUGVyRnJhbWUpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gJzAnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUb3RhbExlbmd0aChwYXRoOiBWZWN0b3JbXSk6IG51bWJlciB7XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8cGF0aC5sZW5ndGgtMTsgaSsrKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gcGF0aFtpXS5kZWx0YShwYXRoW2krMV0pLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBOZXR3b3JrQWRhcHRlciwgTmV0d29yaywgU3RhdGlvblByb3ZpZGVyIH0gZnJvbSBcIi4vTmV0d29ya1wiO1xuaW1wb3J0IHsgVGltZWREcmF3YWJsZSB9IGZyb20gXCIuL0RyYXdhYmxlXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcbmltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4vTGluZVwiO1xuaW1wb3J0IHsgU3ZnTGluZSB9IGZyb20gXCIuL1N2Z0xpbmVcIjtcbmltcG9ydCB7IFN2Z1N0YXRpb24gfSBmcm9tIFwiLi9TdmdTdGF0aW9uXCI7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gXCIuL0xhYmVsXCI7XG5pbXBvcnQgeyBTdmdMYWJlbCB9IGZyb20gXCIuL1N2Z0xhYmVsXCI7XG5cbmV4cG9ydCBjbGFzcyBTdmdOZXR3b3JrIGltcGxlbWVudHMgTmV0d29ya0FkYXB0ZXIge1xuXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHN2Z25zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG4gICAgaW5pdGlhbGl6ZShuZXR3b3JrOiBOZXR3b3JrKTogdm9pZCB7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbGVtZW50cycpPy5jaGlsZHJlbjtcbiAgICAgICAgaWYgKGVsZW1lbnRzID09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUGxlYXNlIGRlZmluZSB0aGUgXCJlbGVtZW50c1wiIGdyb3VwLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudDogVGltZWREcmF3YWJsZSB8IG51bGwgPSB0aGlzLm1pcnJvckVsZW1lbnQoZWxlbWVudHNbaV0sIG5ldHdvcmspO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuYWRkVG9JbmRleChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWlycm9yRWxlbWVudChlbGVtZW50OiBhbnksIG5ldHdvcms6IFN0YXRpb25Qcm92aWRlcik6IFRpbWVkRHJhd2FibGUgfCBudWxsIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09ICdwYXRoJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lKG5ldyBTdmdMaW5lKGVsZW1lbnQpLCBuZXR3b3JrKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGFiZWwobmV3IFN2Z0xhYmVsKGVsZW1lbnQpLCBuZXR3b3JrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aW9uQnlJZChpZDogc3RyaW5nKTogU3RhdGlvbiB8IG51bGwge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBpZiAoZWxlbWVudCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RhdGlvbihuZXcgU3ZnU3RhdGlvbig8U1ZHUmVjdEVsZW1lbnQ+IDx1bmtub3duPmVsZW1lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjcmVhdGVWaXJ0dWFsU3RvcChpZDogc3RyaW5nLCBiYXNlQ29vcmRzOiBWZWN0b3IsIHJvdGF0aW9uOiBSb3RhdGlvbik6IFN0YXRpb24ge1xuICAgICAgICBjb25zdCBoZWxwU3RvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLnN2Z25zLCAncmVjdCcpO1xuICAgICAgICBoZWxwU3RvcC5pZCA9IGlkOyAgICBcbiAgICAgICAgaGVscFN0b3Auc2V0QXR0cmlidXRlKCdkYXRhLWRpcicsIHJvdGF0aW9uLm5hbWUpO1xuICAgICAgICB0aGlzLnNldENvb3JkKGhlbHBTdG9wLCBiYXNlQ29vcmRzKTtcbiAgICAgICAgaGVscFN0b3AuY2xhc3NOYW1lLmJhc2VWYWwgPSAnaGVscGVyJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpb25zJyk/LmFwcGVuZENoaWxkKGhlbHBTdG9wKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aW9uKG5ldyBTdmdTdGF0aW9uKGhlbHBTdG9wKSk7ICBcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzZXRDb29yZChlbGVtZW50OiBhbnksIGNvb3JkOiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3gnLCBjb29yZC54KTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBjb29yZC55KTtcbiAgICB9XG5cbiAgICBkcmF3RXBvY2goZXBvY2g6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgZXBvY2hMYWJlbDtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXBvY2hMYWJlbCA9IDxTVkdUZXh0RWxlbWVudD4gPHVua25vd24+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcG9jaC1sYWJlbCcpO1xuICAgICAgICAgICAgZXBvY2hMYWJlbC50ZXh0Q29udGVudCA9IGVwb2NoOyAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgIFxufVxuIiwiaW1wb3J0IHsgU3RhdGlvbkFkYXB0ZXIsIFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi9WZWN0b3JcIjtcbmltcG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN2Z1N0YXRpb24gaW1wbGVtZW50cyBTdGF0aW9uQWRhcHRlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBTVkdSZWN0RWxlbWVudCkge1xuXG4gICAgfVxuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlkO1xuICAgIH1cbiAgICBnZXQgYmFzZUNvb3JkcygpOiBWZWN0b3IgeyAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHBhcnNlSW50KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gnKSB8fCAnJykgfHwgMCwgcGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgneScpIHx8ICcnKSB8fCAwKTtcbiAgICB9XG4gICAgZ2V0IHJvdGF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgcmV0dXJuIFJvdGF0aW9uLmZyb20odGhpcy5lbGVtZW50LmRhdGFzZXQuZGlyIHx8ICduJyk7XG4gICAgfVxuICAgIGdldCBsYWJlbERpcigpOiBSb3RhdGlvbiB7XG4gICAgICAgIHJldHVybiBSb3RhdGlvbi5mcm9tKHRoaXMuZWxlbWVudC5kYXRhc2V0LmxhYmVsRGlyIHx8ICduJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXcoZGVsYXlTZWNvbmRzOiBudW1iZXIsIGdldFBvc2l0aW9uQm91bmRhcmllczogKCkgPT4ge1tpZDogc3RyaW5nXTogW251bWJlciwgbnVtYmVyXX0pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlbGF5U2Vjb25kcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpb24gPSB0aGlzO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXRpb24uZHJhdygwLCBnZXRQb3NpdGlvbkJvdW5kYXJpZXMpOyB9LCBkZWxheVNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3NpdGlvbkJvdW5kYXJpZXMgPSBnZXRQb3NpdGlvbkJvdW5kYXJpZXMoKTtcbiAgICAgICAgY29uc3QgYmFzZUNvb3JkID0gdGhpcy5iYXNlQ29vcmRzO1xuICAgICAgICBjb25zdCBzdG9wRGltZW4gPSBbTWF0aC5tYXgocG9zaXRpb25Cb3VuZGFyaWVzLnhbMV0gLSBwb3NpdGlvbkJvdW5kYXJpZXMueFswXSwgMCksIE1hdGgubWF4KHBvc2l0aW9uQm91bmRhcmllcy55WzFdIC0gcG9zaXRpb25Cb3VuZGFyaWVzLnlbMF0sIDApXTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKHN0b3BEaW1lblswXSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgKHN0b3BEaW1lblsxXSAqIFN0YXRpb24uTElORV9ESVNUQU5DRSArIFN0YXRpb24uREVGQVVMVF9TVE9QX0RJTUVOKSArICcnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywncm90YXRlKCcgKyB0aGlzLnJvdGF0aW9uLmRlZ3JlZXMgKyAnICcgKyBiYXNlQ29vcmQueCArICcgJyArIGJhc2VDb29yZC55ICsgJykgdHJhbnNsYXRlKCcgKyAoTWF0aC5taW4ocG9zaXRpb25Cb3VuZGFyaWVzLnhbMF0sIDApICogU3RhdGlvbi5MSU5FX0RJU1RBTkNFIC0gU3RhdGlvbi5ERUZBVUxUX1NUT1BfRElNRU4gLyAyKSArICcsJyArIChNYXRoLm1pbihwb3NpdGlvbkJvdW5kYXJpZXMueVswXSwgMCkgKiBTdGF0aW9uLkxJTkVfRElTVEFOQ0UgLSBTdGF0aW9uLkRFRkFVTFRfU1RPUF9ESU1FTiAvIDIpICsgJyknKTtcbiAgICB9XG4gICAgXG59IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU1QUkVDSVNJT046IG51bWJlciA9IDAuMDAxO1xuXG4gICAgc3RhdGljIGVxdWFscyhhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDwgVXRpbHMuSU1QUkVDSVNJT047XG4gICAgfVxuXG4gICAgc3RhdGljIHRyaWxlbW1hKGludDogbnVtYmVyLCBvcHRpb25zOiBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10pOiBzdHJpbmcge1xuICAgICAgICBpZiAoVXRpbHMuZXF1YWxzKGludCwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKGludCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zWzJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zWzBdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhbHBoYWJldGljSWQoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYSA8IGIpXG4gICAgICAgICAgICByZXR1cm4gYSArICdfJyArIGI7XG4gICAgICAgIHJldHVybiBiICsgJ18nICsgYTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tIFwiLi9Sb3RhdGlvblwiO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgVmVjdG9yIHtcbiAgICBzdGF0aWMgVU5JVDogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAtMSk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF94OiBudW1iZXIsIHByaXZhdGUgX3k6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgZ2V0IHgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgfVxuXG4gICAgZ2V0IHkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKTtcbiAgICB9XG5cbiAgICB3aXRoTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSBsZW5ndGgvdGhpcy5sZW5ndGg7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCpyYXRpbywgdGhpcy55KnJhdGlvKTtcbiAgICB9XG5cbiAgICBhZGQodGhhdCA6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCArIHRoYXQueCwgdGhpcy55ICsgdGhhdC55KTtcbiAgICB9XG5cbiAgICBkZWx0YSh0aGF0OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGF0LnggLSB0aGlzLngsIHRoYXQueSAtIHRoaXMueSk7XG4gICAgfVxuXG4gICAgcm90YXRlKHRoZXRhOiBSb3RhdGlvbik6IFZlY3RvciB7XG4gICAgICAgIGxldCByYWQ6IG51bWJlciA9IHRoZXRhLnJhZGlhbnM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCAqIE1hdGguY29zKHJhZCkgLSB0aGlzLnkgKiBNYXRoLnNpbihyYWQpLCB0aGlzLnggKiBNYXRoLnNpbihyYWQpICsgdGhpcy55ICogTWF0aC5jb3MocmFkKSk7XG4gICAgfVxuXG4gICAgZG90UHJvZHVjdCh0aGF0OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54KnRoYXQueCt0aGlzLnkqdGhhdC55O1xuICAgIH1cblxuICAgIHNvbHZlRGVsdGFGb3JJbnRlcnNlY3Rpb24oZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiB7YTogbnVtYmVyLCBiOiBudW1iZXJ9IHtcbiAgICAgICAgY29uc3QgZGVsdGE6IFZlY3RvciA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHN3YXBaZXJvRGl2aXNpb24gPSBVdGlscy5lcXVhbHMoZGlyMi55LCAwKTtcbiAgICAgICAgY29uc3QgeCA9IHN3YXBaZXJvRGl2aXNpb24gPyAneScgOiAneCc7XG4gICAgICAgIGNvbnN0IHkgPSBzd2FwWmVyb0RpdmlzaW9uID8gJ3gnIDogJ3knO1xuICAgICAgICBjb25zdCBkZW5vbWluYXRvciA9IChkaXIxW3ldKmRpcjJbeF0tZGlyMVt4XSpkaXIyW3ldKTtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyhkZW5vbWluYXRvciwgMCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7YTogTmFOLCBiOiBOYU59O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGEgPSAoZGVsdGFbeV0qZGlyMlt4XS1kZWx0YVt4XSpkaXIyW3ldKS9kZW5vbWluYXRvcjtcbiAgICAgICAgY29uc3QgYiA9IChhKmRpcjFbeV0tZGVsdGFbeV0pL2RpcjJbeV07XG4gICAgICAgIHJldHVybiB7YSwgYn07XG4gICAgfVxuXG4gICAgaXNEZWx0YU1hdGNoaW5nUGFyYWxsZWwoZGlyMTogVmVjdG9yLCBkaXIyOiBWZWN0b3IpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsRXF1YWxaZXJvKHRoaXMueCwgZGlyMS54LCBkaXIyLngpIHx8IHRoaXMuYWxsRXF1YWxaZXJvKHRoaXMueSwgZGlyMS55LCBkaXIyLnkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWxsRXF1YWxaZXJvKG4xOiBudW1iZXIsIG4yOiBudW1iZXIsIG4zOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLmVxdWFscyhuMSwgMCkgJiYgVXRpbHMuZXF1YWxzKG4yLCAwKSAmJiBVdGlscy5lcXVhbHMobjMsIDApO1xuICAgIH1cblxuICAgIGluY2xpbmF0aW9uKCk6IFJvdGF0aW9uIHtcbiAgICAgICAgaWYgKFV0aWxzLmVxdWFscyh0aGlzLngsIDApKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSb3RhdGlvbih0aGlzLnkgPiAwID8gMTgwIDogMCk7XG4gICAgICAgIGlmIChVdGlscy5lcXVhbHModGhpcy55LCAwKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUm90YXRpb24odGhpcy54ID4gMCA/IDkwIDogLTkwKTtcbiAgICAgICAgY29uc3QgYWRqYWNlbnQgPSBuZXcgVmVjdG9yKDAsLU1hdGguYWJzKHRoaXMueSkpO1xuICAgICAgICByZXR1cm4gbmV3IFJvdGF0aW9uKChNYXRoLnNpZ24odGhpcy54KSpNYXRoLmFjb3ModGhpcy5kb3RQcm9kdWN0KGFkamFjZW50KS9hZGphY2VudC5sZW5ndGgvdGhpcy5sZW5ndGgpKjE4MC9NYXRoLlBJKSk7XG4gICAgfVxufSIsImltcG9ydCB7IFN0YXRpb24gfSBmcm9tIFwiLi9TdGF0aW9uXCI7XG5pbXBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uXCI7XG5pbXBvcnQgeyBTdmdOZXR3b3JrIH0gZnJvbSBcIi4vU3ZnTmV0d29ya1wiO1xuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuL05ldHdvcmtcIjtcbmltcG9ydCB7IEluc3RhbnQgfSBmcm9tIFwiLi9JbnN0YW50XCI7XG5pbXBvcnQgeyBUaW1lZERyYXdhYmxlIH0gZnJvbSBcIi4vRHJhd2FibGVcIjtcblxuLy8gVE9ETzogZXJhc2UgYW5pbSwgbGFiZWxzLCB6b29tLCBuZWdhdGl2ZSBkZWZhdWx0IHRyYWNrcyBiYXNlZCBvbiBkaXJlY3Rpb24sIHJldXNlIHRyYWNrIG9mIGp1c3QgZXJhc2VkIGxpbmU/XG5cblxudmFyIHByZWNlZGluZ1N0b3AgOiBTdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xudmFyIHByZWNlZGluZ0RpciA6IFJvdGF0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG5jb25zdCBuZXR3b3JrOiBOZXR3b3JrID0gbmV3IE5ldHdvcmsobmV3IFN2Z05ldHdvcmsoKSk7XG5uZXR3b3JrLmluaXRpYWxpemUoKTtcblxuY29uc3QgYW5pbWF0ZUZyb21FcG9jaDogbnVtYmVyID0gZ2V0U3RhcnRFcG9jaCgpO1xuc2xpZGUoSW5zdGFudC5CSUdfQkFORywgZmFsc2UpO1xuXG5mdW5jdGlvbiBnZXRTdGFydEVwb2NoKCk6IG51bWJlciB7XG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhhc2ggJiYgbmV0d29yay5pc0Vwb2NoRXhpc3Rpbmcod2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKSkpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0ZUZyb21FcG9jaDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Zhc3QgZm9yd2FyZCB0byAnICsgYW5pbWF0ZUZyb21FcG9jaCk7XG4gICAgICAgIHJldHVybiBwYXJzZUludChhbmltYXRlRnJvbUVwb2NoKSB8fCAwO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gc2xpZGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpbnN0YW50LmVwb2NoID09IGFuaW1hdGVGcm9tRXBvY2gpXG4gICAgICAgIGFuaW1hdGUgPSB0cnVlO1xuXG4gICAgbmV0d29yay5zZXRJbnN0YW50KGluc3RhbnQpO1xuXG4gICAgY29uc3QgZWxlbWVudHM6IFRpbWVkRHJhd2FibGVbXSA9IG5ldHdvcmsudGltZWREcmF3YWJsZXNBdChpbnN0YW50KTtcbiAgICBsZXQgZGVsYXkgPSAwO1xuICAgIGZvciAobGV0IGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBkZWxheSArPSBkcmF3T3JFcmFzZUVsZW1lbnQoZWxlbWVudHNbaV0sIGRlbGF5LCBhbmltYXRlLCBpbnN0YW50KTtcbiAgICB9XG4gICAgY29uc3QgbmV4dCA9IG5ldHdvcmsubmV4dEluc3RhbnQoaW5zdGFudCk7XG4gICAgXG4gICAgaWYgKG5leHQpIHtcbiAgICAgICAgY29uc3QgZGVsYXkgPSBhbmltYXRlID8gaW5zdGFudC5kZWx0YShuZXh0KSA6IDA7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzbGlkZShuZXh0LCBhbmltYXRlKTsgfSwgZGVsYXkgKiAxMDAwKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdPckVyYXNlRWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuLCBpbnN0YW50OiBJbnN0YW50KTogbnVtYmVyIHtcblxuICAgIGlmIChpbnN0YW50LmVxdWFscyhlbGVtZW50LnRvKSAmJiAhZWxlbWVudC5mcm9tLmVxdWFscyhlbGVtZW50LnRvKSkge1xuICAgICAgICByZXR1cm4gZXJhc2VFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKGVsZW1lbnQudG8sIGFuaW1hdGUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRyYXdFbGVtZW50KGVsZW1lbnQsIGRlbGF5LCBzaG91bGRBbmltYXRlKGVsZW1lbnQuZnJvbSwgYW5pbWF0ZSkpO1xufVxuXG5mdW5jdGlvbiBkcmF3RWxlbWVudChlbGVtZW50OiBUaW1lZERyYXdhYmxlLCBkZWxheTogbnVtYmVyLCBhbmltYXRlOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZWxlbWVudC5kcmF3KGRlbGF5LCBhbmltYXRlKTtcbn1cblxuZnVuY3Rpb24gZXJhc2VFbGVtZW50KGVsZW1lbnQ6IFRpbWVkRHJhd2FibGUsIGRlbGF5OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4pOiBudW1iZXIge1xuICAgIHJldHVybiBlbGVtZW50LmVyYXNlKGRlbGF5LCBhbmltYXRlLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZEFuaW1hdGUoaW5zdGFudDogSW5zdGFudCwgYW5pbWF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmICghYW5pbWF0ZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpbnN0YW50LmZsYWcgPT0gJ25vYW5pbScpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gYW5pbWF0ZTtcbn1cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==