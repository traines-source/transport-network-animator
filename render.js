const LINE_DISTANCE = 6;
const DEFAULT_STOP_DIMEN = 10;
const UNITV = [0, -1];
const NODE_DISTANCE = 20;
const DIRS = {'n': 0, 'ne': 45};
const svgns = "http://www.w3.org/2000/svg";
const stationLines = {};
const lines = document.getElementById('lines').children;


for (let i=0; i<lines.length; i++) {
    const stops = lines[i].dataset.stops.split(' ');
    const path = [];
    var precedingStop = undefined;
    var precedingDir = undefined;
    let rightSide = true;
    for (let j=0; j<stops.length; j++) {
        if (stops[j][0] == '_') {
            rightSide = stops[j] == '_r';
            continue;
        }
        const stop = document.getElementById(stops[j]);        
        createConnection(stop, getNextStopBaseCoord(stops, j, getStopBaseCoord(stop)), rightSide, path, lines[i], true);
    }
    let d = 'M' + path.join(' L');
    lines[i].setAttribute('d', d);
}

function createConnection(stop, nextStopBaseCoord, rightSide, path, line, recurse) {
    const dir = DIRS[stop.getAttribute('data-dir')];
    const baseCoord = getStopBaseCoord(stop)
    const existingLinesAtStation = getExistingLinesAtStation(stop);
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
            const helpStop = getOrCreateHelperStop(precedingStop, stop);
            
            precedingDir = addDeg(precedingDir, 180);
            createConnection(helpStop, nextStopBaseCoord, rightSide, path, line, false);
            createConnection(stop, nextStopBaseCoord, rightSide, path, line, false);
            return;
        } else if (!found) {
            console.log('path to fix on line', line.dataset.line, 'at station', stop.id);
        }
        precedingDir = stationDir;
    }
    
    redrawStation(existingLinesAtStation, newDir, dir, newPos, baseCoord, stop, line);
    path.push(newCoord);
    precedingStop = stop;
}

function getExistingLinesAtStation(stop) {
    if (stationLines[stop.id] == undefined) {
        stationLines[stop.id] = {x : [], y: []};
    }
    return stationLines[stop.id];
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

function redrawStation(existingLinesAtStation, newDir, dir, newPos, baseCoord, stop, line) {
    existingLinesAtStation[newDir % 180 == 0 ? 'x' : 'y'].push({line: line.dataset.line, pos: newPos});
    const positionBoundaries = getPositionBoundaries(existingLinesAtStation);
    const stopDimen = [Math.max(positionBoundaries.x[1] - positionBoundaries.x[0], 0), Math.max(positionBoundaries.y[1] - positionBoundaries.y[0], 0)];
    
    stop.setAttribute('width', stopDimen[0] * LINE_DISTANCE + DEFAULT_STOP_DIMEN);
    stop.setAttribute('height', stopDimen[1] * LINE_DISTANCE + DEFAULT_STOP_DIMEN);    
    stop.setAttribute('transform','rotate(' + dir + ' ' + baseCoord[0] + ' ' + baseCoord[1] + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * LINE_DISTANCE - DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * LINE_DISTANCE - DEFAULT_STOP_DIMEN / 2) + ')');
}

function getOrCreateHelperStop(fromStop, toStop) {
    const helpStopId = 'h_' + fromStop.id + '_' + toStop.id;
    let helpStop = document.getElementById(helpStopId);
    if (helpStop == undefined) {
        const oldCoord = getStopBaseCoord(fromStop);
        const newCoord = getStopBaseCoord(toStop);
        const delta = vdelta(oldCoord, newCoord);
        const adjacent = [0,-Math.abs(delta[1])];
        const deg = (Math.sign(delta[0])*Math.acos(vscalar(adjacent, delta)/vlength(adjacent)/vlength(delta))*180/Math.PI);
        const intermediateDir = ((deg >= 0 ? Math.ceil(deg / 45) : Math.floor(deg / 45)) * 45);
        const intermediateCoord = vadd(vwithlength(delta, vlength(delta)/2), newCoord);

        helpStop = document.createElementNS(svgns, 'rect');
        helpStop.id = helpStopId;    
        helpStop.setAttribute('data-dir', intermediateDir == 0 ? 'n' : 'ne');
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
    for (let i=0;i<existingLinesAtStationAxis.length;i++) {
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
    const deltaDir = Math.sign(delta[0])*Math.acos(-delta[1]/Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2)));
    const deg = Math.floor((deltaDir*180/Math.PI-dir+45)/90)*90;
    return deg;
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
    //TODO attention -10 % 360 != 350
    return (a % 360 + b % 360) % 360;
}