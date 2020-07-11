const LINE_DISTANCE = 6;
const DEFAULT_STOP_DIMEN = 10;
const NODE_DISTANCE = 20;
const SPEED = 200;

const UNITV = [0, -1];
const DIRS = {'n': 0, 'ne': 45, 'nw': -45, 'w': -90};
const svgns = "http://www.w3.org/2000/svg";
const stationLines = {};
const slideIndex = {};
const lines = document.getElementById('lines').children;

var precedingStop = undefined;
var precedingDir = undefined;

createSlideIndex();

const animateFromEpoch = getStartEpoch();
slide(0, 0, false);

function getStartEpoch() {
    if(window.location.hash && slideIndex[window.location.hash.replace('#', '')] != undefined) {
        const animateFromEpoch = window.location.hash.replace('#', '');
        console.log('fast forward to ' + animateFromEpoch);
        return animateFromEpoch;
    }
    return 0;
}

function slide(epoch, second, animate) {
    if (epoch == animateFromEpoch)
        animate = true;

    const elements = slideIndex[epoch][second];
    let delay = 0;
    for (let i=0; i<elements.length; i++) {
        delay += drawOrEraseElement(elements[i], delay, animate, epoch, second);
    }
    const next = getNextEpochAndSecond(epoch, second);
    
    if (next) {
        const delay = animate ? getInstantDelta([epoch, second], next) : 0;
        window.setTimeout(function() { slide(next[0], next[1], animate); }, delay * 1000);
    }
}

function drawOrEraseElement(element, delay, animate, epoch, second) {
    var from = getInstant(element, 'from')
    var to = getInstant(element, 'to')

    if (equalsInstant(to, [epoch, second]) && !equalsInstant(from, to)) {
        return eraseElement(element, delay, shouldAnimate(to, animate));
    }
    return drawLine(element, delay, shouldAnimate(from, animate));
}



function drawElement(element, delay, animate) {
    return drawLine(element, delay, animate);
}

function eraseElement(element, delay, animate) {
    return eraseLine(element, delay);
}

function drawLine(line, delay, animate) {
    const stops = line.dataset.stops.split(' ');
    const path = [];
    precedingStop = undefined;
    precedingDir = undefined;
    let rightSide = true;
    for (let j=0; j<stops.length; j++) {
        if (stops[j][0] == '_') {
            rightSide = stops[j] == '_r';
            continue;
        }
        const stop = document.getElementById(stops[j]);
        createConnection(stop, getNextStopBaseCoord(stops, j, getStopBaseCoord(stop)), rightSide, path, line, delay, animate, true);
    }
    let duration = getAnimationDuration(path, animate);
    window.setTimeout(function () { rerenderLine(line, path, animate); }, delay * 1000);
    return duration;
}

function eraseLine(line, delay) {
    if (delay > 0) {
        window.setTimeout(function() { eraseLine(line, 0); }, delay * 1000);
        return;
    }
    line.setAttribute('d', '');
    const stops = line.dataset.stops.split(' ');
    for (let j=0; j<stops.length; j++) {
        if (stops[j][0] == '_') {
            continue;
        }
        const stop = document.getElementById(stops[j]);
        const dir = DIRS[stop.getAttribute('data-dir')];
        const baseCoord = getStopBaseCoord(stop);
        const existingLinesAtStation = getExistingLinesAtStation(stops[j]);
        removeExistingLineAtStationAxis(existingLinesAtStation.x, line.dataset.line);
        removeExistingLineAtStationAxis(existingLinesAtStation.y, line.dataset.line);
        rerenderStation(existingLinesAtStation, dir, baseCoord, stop);
    }
    return 0;
}

function removeExistingLineAtStationAxis(existingLinesAtStationAxis, lineId) {
    let i = 0;
    while (i < existingLinesAtStationAxis.length) {
        if (existingLinesAtStationAxis[i].line == lineId) {
            existingLinesAtStationAxis.splice(i, 1);
        } else {
            i++;
        }
    }
}


function getInstantDelta(instant1, instant2) {
    if (instant1[0] == instant2[0]) {
        return parseInt(instant2[1]) - parseInt(instant1[1]);
    }
    return instant2[1];
}

function equalsInstant(instant1, instant2) {
    if (instant1[0] == instant2[0] && instant1[1] == instant2[1]) {
        return true;
    }
    return false;
}

function getNextEpochAndSecond(epoch, second) {
    second = findSmallestAbove(second, slideIndex[epoch]);
    if (second == undefined) {
        epoch = findSmallestAbove(epoch, slideIndex);
        if (epoch == undefined)
            return false;
        second = findSmallestAbove(-1, slideIndex[epoch]);
    }
    return [epoch, second];
}

function findSmallestAbove(threshold, dict) {
    threshold = parseInt(threshold);
    let smallest = undefined;
    for (const [key, value] of Object.entries(dict)) {
        if (parseInt(key) > threshold && (smallest == undefined || parseInt(key) < smallest)) {
            smallest = parseInt(key);
        }
    }
    return smallest;
}

function createSlideIndex() {
    for (let i=0; i<lines.length; i++) {
        setSlideIndexElement(getInstant(lines[i], 'from'), lines[i]);
        const to = getInstant(lines[i], 'to');
        if (!equalsInstant(to, [0, 0]))
            setSlideIndexElement(to, lines[i]);
    }
}



function getInstant(element, fromOrTo) {
    if (element.dataset[fromOrTo] != undefined) {
        return element.dataset[fromOrTo].split(' ');
    }
    return [0, 0];
}

function shouldAnimate(instant, animate) {
    if (!animate)
        return false;
    if (instant.length > 2 && instant[2] == 'noanim')
        return false;
    return animate;
}

function setSlideIndexElement(instant, element) {
    if (slideIndex[instant[0]] == undefined)
        slideIndex[instant[0]] = {};
    if (slideIndex[instant[0]][instant[1]] == undefined)
        slideIndex[instant[0]][instant[1]] = [];
    slideIndex[instant[0]][instant[1]].push(element);
}

function createConnection(stop, nextStopBaseCoord, rightSide, path, line, delay, animate, recurse) {
    const dir = DIRS[stop.getAttribute('data-dir')];
    const baseCoord = getStopBaseCoord(stop);
    const existingLinesAtStation = getExistingLinesAtStation(stop.id);
    const positionBoundaries = getPositionBoundaries(existingLinesAtStation);
    const newDir = getStopOrientationBasedOnThreeStops(baseCoord, nextStopBaseCoord, dir, path);
    const newPos = getPosition(rightSide, positionBoundaries[newDir % 180 == 0 ? 'x' : 'y']);
    const newCoord = getRotatedPositionCoordinates(dir, newDir, newPos, baseCoord);

    if (path.length != 0) {
        const oldCoord = path[path.length-1];

        precedingDir = getPrecedingDir(precedingDir, precedingStop, oldCoord, newCoord);

        const stationDir = addDeg(newDir, dir);
        const found = insertNode(oldCoord, precedingDir, newCoord, stationDir, path);

        if (!found && recurse) {            
            const helpStop = getOrCreateHelperStop(precedingDir, precedingStop, stop);
            
            precedingDir = addDeg(precedingDir, 180);
            createConnection(helpStop, baseCoord, rightSide, path, line, delay, animate, false);
            createConnection(stop, nextStopBaseCoord, rightSide, path, line, delay, animate, false);
            return;
        } else if (!found) {
            console.log('path to fix on line', line.dataset.line, 'at station', stop.id);
        }
        precedingDir = stationDir;
    }
    existingLinesAtStation[newDir % 180 == 0 ? 'x' : 'y'].push({line: line.dataset.line, pos: newPos});
    path.push(newCoord);
    delay = getAnimationDuration(path, animate) + delay;
    window.setTimeout(function() { rerenderStation(existingLinesAtStation, dir, baseCoord, stop); }, delay * 1000);

    precedingStop = stop;
}

function getAnimationDuration(path, animate) {
    if (!animate)
        return 0;
    return getTotalLength(path) / SPEED;
}
function getTotalLength(path) {
    let length = 0;
    for (let i=0; i<path.length-1; i++) {
        length += vlength(vdelta(path[i], path[i+1]));
    }
    return length;
}

function getExistingLinesAtStation(stopId) {
    if (stationLines[stopId] == undefined) {
        stationLines[stopId] = {x : [], y: []};
    }
    return stationLines[stopId];
}

function getStopOrientationBasedOnThreeStops(baseCoord, nextStopBaseCoord, dir, path) {
    let newDir;
    if (path.length != 0) {
        const oldCoord = path[path.length-1];
        newDir = getStopOrientation(vdelta(oldCoord, nextStopBaseCoord), dir);
    } else {
        newDir = getStopOrientation(vdelta(nextStopBaseCoord, baseCoord), dir);
    }
    return newDir;
}

function getRotatedPositionCoordinates(dir, newDir, newPos, baseCoord) {
    let newCoord;
    if (newDir % 180 == 0) {
        newCoord = [newPos * LINE_DISTANCE, 0];
    } else {
        newCoord = [0, newPos * LINE_DISTANCE];
    }
    newCoord = rotate(newCoord, dir)
    newCoord = [baseCoord[0] + newCoord[0], baseCoord[1] + newCoord[1]];
    return newCoord;
}

function rerenderStation(existingLinesAtStation, dir, baseCoord, stop) {
    const positionBoundaries = getPositionBoundaries(existingLinesAtStation);
    const stopDimen = [Math.max(positionBoundaries.x[1] - positionBoundaries.x[0], 0), Math.max(positionBoundaries.y[1] - positionBoundaries.y[0], 0)];
    
    stop.setAttribute('width', stopDimen[0] * LINE_DISTANCE + DEFAULT_STOP_DIMEN);
    stop.setAttribute('height', stopDimen[1] * LINE_DISTANCE + DEFAULT_STOP_DIMEN);    
    stop.setAttribute('transform','rotate(' + dir + ' ' + baseCoord[0] + ' ' + baseCoord[1] + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * LINE_DISTANCE - DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * LINE_DISTANCE - DEFAULT_STOP_DIMEN / 2) + ')');
}

function alphabeticId(a, b) {
    if (a < b)
        return a + '_' + b;
    return b + '_' + a;
}

function getDirName(dir) {
    for (const [key, value] of Object.entries(DIRS)) {
        if (value == dir) {
            return key;
        }
    }
    return 'n';
}

function vinclination(delta) {
    if (delta[0] == 0)
        return delta[1] > 0 ? 180 : 0;
    if (delta[1] == 0)
        return delta[0] > 0 ? 90 : -90;
    const adjacent = [0,-Math.abs(delta[1])];
    return (Math.sign(delta[0])*Math.acos(vscalar(adjacent, delta)/vlength(adjacent)/vlength(delta))*180/Math.PI);
    //const deltaDir = Math.sign(delta[0])*Math.acos(-delta[1]/Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2)));
}

function normalizeDir(dir) {
    if (dir == 90)
        dir = 0;
    else if (dir < -90)
        dir += 180;
    else if (dir > 90)
        dir -= 180;
    return dir;
}

function getOrCreateHelperStop(fromDir, fromStop, toStop) {
    const helpStopId = 'h_' + alphabeticId(fromStop.id, toStop.id);
    let helpStop = document.getElementById(helpStopId);
    if (helpStop == undefined) {
        const oldCoord = getStopBaseCoord(fromStop);
        const newCoord = getStopBaseCoord(toStop);
        const delta = vdelta(oldCoord, newCoord);
        const deg = vinclination(vdelta(newCoord, oldCoord));
        console.log(helpStopId, deg, fromDir);
        const intermediateDir = normalizeDir((fromDir >= deg ? Math.floor(deg / 45) : Math.ceil(deg / 45)) * 45);
        const intermediateCoord = vadd(vwithlength(delta, vlength(delta)/2), newCoord);

        helpStop = document.createElementNS(svgns, 'rect');
        helpStop.id = helpStopId;    
        helpStop.setAttribute('data-dir', getDirName(intermediateDir));
        helpStop.setAttribute('x', intermediateCoord[0]);
        helpStop.setAttribute('y', intermediateCoord[1]);
        helpStop.className.baseVal = 'helper';
        document.getElementById('stations').appendChild(helpStop);
    }
    return helpStop;
}

function getPrecedingDir(precedingDir, precedingStop, oldCoord, newCoord) {
    if (precedingDir == undefined) {
        precedingDir = addDeg(getStopOrientation(vdelta(newCoord, oldCoord), DIRS[precedingStop.dataset.dir]), DIRS[precedingStop.dataset.dir]);
    } else {
        precedingDir = addDeg(precedingDir, 180);
    }
    return precedingDir;
}


function getNextStopBaseCoord(stops, currentStopIndex, defaultCoord) {
    for (let j=currentStopIndex+1;j<stops.length;j++) {
        if (stops[j][0] == '_') {
            continue;
        }
        return getStopBaseCoord(document.getElementById(stops[j]));
    }
    return defaultCoord;
}

function getStopBaseCoord(stop) {
    if (stop == undefined)
        return [0, 0];
    return [parseInt(stop.getAttribute('x')), parseInt(stop.getAttribute('y'))];
}

function ensureDefault(number, def) {
    number = parseInt(number);
    if (isNaN(number)) {
        return def;
    }
    return number;
}

function getPosition(rightSide, positionBoundariesAtStationAxis) {
    return rightSide ? positionBoundariesAtStationAxis[1] + 1 : positionBoundariesAtStationAxis[0] - 1;
}

function getPositionBoundaries(existingLinesAtStation) {
    return {
        x: getPositionBoundariesForAxis(existingLinesAtStation.x),
        y: getPositionBoundariesForAxis(existingLinesAtStation.y)
    };
}

function getPositionBoundariesForAxis(existingLinesAtStationAxis) {
    if (existingLinesAtStationAxis.length == 0) {
        return [1, -1];
    }
    let left = 0;
    let right = 0;
    for (let i=0; i<existingLinesAtStationAxis.length; i++) {
        if (right < existingLinesAtStationAxis[i].pos) {
            right = existingLinesAtStationAxis[i].pos;
        }
        if (left > existingLinesAtStationAxis[i].pos) {
            left = existingLinesAtStationAxis[i].pos;
        }
    }
    return [left, right];
}

function rotate(coords, theta) {
    theta = theta / 180 * Math.PI;
    return [coords[0] * Math.cos(theta) - coords[1] * Math.sin(theta), coords[0] * Math.sin(theta) + coords[1] * Math.cos(theta)]
}

function rotateUnitV(theta) {
    return rotate(UNITV, theta);
}

function solveForAAndB(delta, v1, v2) {
    const swapZeroDivision = v2[1] == 0;
    const x = 0 ^ swapZeroDivision;
    const y = 1 ^ swapZeroDivision;
    const denominator = (v1[y]*v2[x]-v1[x]*v2[y]);
    if (denominator == 0) {
        return [NaN, NaN];
    }
    const a = (delta[x]*v2[y]-delta[y]*v2[x])/denominator;
    const b = (delta[y]+a*v1[y])/v2[y];
    return [a, b];
}

function vdelta(v1, v2) {
    return [v1[0]-v2[0], v1[1]-v2[1]];
}
function vlength(v) {
    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
}
function vwithlength(v, length) {
    const ratio = length/vlength(v);
    return [v[0]*ratio, v[1]*ratio];
}
function vadd(v1, v2) {
    return [v1[0]+v2[0], v1[1]+v2[1]];
}
function vscalar(v1, v2) {
    return v1[0]*v2[0]+v1[1]*v2[1];
}

function getStopOrientation(delta, dir) {
    //const deltaDir = (Math.sign(delta[0])*Math.acos(-delta[1]/Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2))))*180/Math.PI;
    const deltaDir = vinclination(delta)-dir;
    const deg = deltaDir < 0 ? Math.ceil((deltaDir-45)/90) : Math.floor((deltaDir+45)/90);
    return deg*90;
}

function insertNode(fromCoord, fromDir, toCoord, toDir, path) {
    const delta = vdelta(fromCoord, toCoord);
    const oldDirV = rotateUnitV(fromDir);
    const newDirV = rotateUnitV(toDir);
    if (matchingParallel(0, fromCoord, toCoord, oldDirV, newDirV) || matchingParallel(1, fromCoord, toCoord, oldDirV, newDirV)) {
        return true;
    }
    //let a = (delta[0]*newDirV[1]-delta[1]*newDirV[0])/(oldDirV[1]*newDirV[0]-oldDirV[0]*newDirV[1]);
    const solution = solveForAAndB(delta, oldDirV, newDirV)
    if (solution[0] > 0 && solution[1] > 0) {
        path.push([fromCoord[0]+oldDirV[0]*solution[0], fromCoord[1]+oldDirV[1]*solution[0]]);
        return newDirV;
    }
    return false;
}

function matchingParallel(axis, fromCoord, toCoord, oldDirV, newDirV) {
    return fromCoord[axis] == toCoord[axis] && oldDirV[axis] == 0 && newDirV[axis] == 0
}

function addDeg(a, b) {
    let sum = a + b;
    if (sum <= -180)
        sum += 360;
    if (sum > 180)
        sum -= 360;
    return sum;
}

function rerenderLine(line, path, animate) {
    const length = getTotalLength(path);
    const duration = length / SPEED;

    const d = 'M' + path.join(' L');
    line.setAttribute('d', d);

    line.style.transition = line.style.WebkitTransition = 'none';
    line.style.strokeDasharray = length + ' ' + length;
    if (animate) {        
        line.style.strokeDashoffset = length;
        line.getBoundingClientRect();
        line.style.transition = line.style.WebkitTransition = 'stroke-dashoffset ' + duration + 's linear';
    }
    line.style.strokeDashoffset = '0';
}