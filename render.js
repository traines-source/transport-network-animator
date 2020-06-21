const LINE_DISTANCE = 6;
const DEFAULT_STOP_DIMEN = 5;
const UNITV = [0, -1];
const NODE_DISTANCE = 20;
const DIRS = {'n': 0, 'ne': 45, 'nw': -45, 'w': -90};
var stationLines = {};
var lines = document.getElementById('lines').children;
for (var i=0; i<lines.length; i++) {
    var stops = lines[i].dataset.stops.split(' ');
    var path = [];
    var precedingStop = undefined;
    var precedingDir = undefined;
    var rightSide = true;
    for (var j=0; j<stops.length; j++) {
        if (stops[j][0] == '_') {
            rightSide = stops[j] == '_r';
            continue;
        }
        var stop = document.getElementById(stops[j]);
        var dir = DIRS[stop.dataset.dir];
        var baseCoord = [parseInt(stop.getAttribute('x')), parseInt(stop.getAttribute('y'))];
        if (stationLines[stops[j]] == undefined) {
            stationLines[stops[j]] = [];
        }
        var existingLinesAtStation = stationLines[stops[j]];
        var positionBoundaries = getPositionBoundaries(existingLinesAtStation);
        var newPos = rightSide ? positionBoundaries[1] + 1 : positionBoundaries[0] - 1;
        newCoord = [newPos * LINE_DISTANCE, 0];
        console.log(stops[j])
        console.log(newCoord)
        newCoord = rotate(newCoord, dir)
        console.log(newCoord);
        newCoord = [baseCoord[0] + newCoord[0], baseCoord[1] + newCoord[1]];
        existingLinesAtStation.push({line: lines[i].dataset.line, pos: newPos})
        var positionBoundaries = getPositionBoundaries(existingLinesAtStation);
        var positionCount = positionBoundaries[1] - positionBoundaries[0];
        var stopDimen = [positionCount, 0];
       
        console.log("--");
        stop.setAttribute('width', stopDimen[0] * LINE_DISTANCE + DEFAULT_STOP_DIMEN);
        stop.setAttribute('height', stopDimen[1] * LINE_DISTANCE + DEFAULT_STOP_DIMEN);
      
        stop.setAttribute('transform','rotate(' + dir + ' ' + baseCoord[0] + ' ' + baseCoord[1] + ') translate(' + (positionBoundaries[0] * LINE_DISTANCE - DEFAULT_STOP_DIMEN / 2) + ',' + (- DEFAULT_STOP_DIMEN / 2) + ')');
            
    
        if (path.length != 0) {
            var oldCoord = path[path.length-1];

            if (precedingDir == undefined) {
                precedingDir = addDeg(getStopOrientation(vdelta(newCoord, oldCoord)), DIRS[precedingStop.dataset.dir]);
            } else {
                precedingDir = addDeg(precedingDir, 180);
            }

            
            var newDir = addDeg(dir, getStopOrientation(vdelta(oldCoord, newCoord)));
            var found = insertNode(oldCoord, precedingDir, newCoord, newDir);
            
            if (!found) {
                console.log('no easy solution found');
                var delta = vdelta(oldCoord, newCoord);
                var adjacent = [0,-Math.abs(delta[1])];

                var deg = (Math.sign(delta[0])*Math.acos(vscalar(adjacent, delta)/vlength(adjacent)/vlength(delta))*180/Math.PI);
                var intermediateDir = (deg >= 0 ? Math.ceil(deg / 45) : Math.floor(deg / 45)) * 45;
                //Math.ceil((addDeg(precedingDir, 180) + newDir) / 90) * 45 + 45;
                var intermediateCoord = vadd(oldCoord, vwithlength(vadd(rotateUnitV(addDeg(intermediateDir, 180)), rotateUnitV(precedingDir)), NODE_DISTANCE));
                
                console.log('interdir', delta, adjacent, deg, newDir, intermediateDir);
                if(insertNode(oldCoord, precedingDir, intermediateCoord, intermediateDir) || true) {
                    insertNode(intermediateCoord, addDeg(intermediateDir, 180), newCoord, newDir);
                }
            }
            precedingDir = newDir;
        }
        path.push(newCoord);
        precedingStop = stop;
    }
    var d = 'M' + path.join(' L');
    console.log(d);
    lines[i].setAttribute('d', d);
    
    console.log('line')
}

function ensureDefault(number, def) {
    number = parseInt(number);
    if (isNaN(number)) {
        return def;
    }
    return number;
}

function getPositionBoundaries(existingLinesAtStation) {
    if (existingLinesAtStation.length == 0) {
        return [1, -1];
    }
    var left = 0;
    var right = 0;
    for (var i=0;i<existingLinesAtStation.length;i++) {
        if (right < existingLinesAtStation[i].pos) {
            right = existingLinesAtStation[i].pos;
        }
        if (left > existingLinesAtStation[i].pos) {
            left = existingLinesAtStation[i].pos;
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
    var swapZeroDivision = v2[1] == 0;
    var x = 0 ^ swapZeroDivision;
    var y = 1 ^ swapZeroDivision;
    var denominator = (v1[y]*v2[x]-v1[x]*v2[y]);
    if (denominator == 0) {
        return [NaN, NaN];
    }
    var a = (delta[x]*v2[y]-delta[y]*v2[x])/denominator;
    var b = (delta[y]+a*v1[y])/v2[y];
    return [a, b];
}

function vdelta(v1, v2) {
    return [v1[0]-v2[0], v1[1]-v2[1]];
}
function vlength(v) {
    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
}
function vwithlength(v, length) {
    var current = vlength(v);
    return [v[0]*length/current, v[1]*length/current];
}
function vadd(v1, v2) {
    return [v1[0]+v2[0], v1[1]+v2[1]];
}
function vscalar(v1, v2) {
    return v1[0]*v2[0]+v1[1]*v2[1];
}

function getStopOrientation(delta) {
    var deltaDir = Math.sign(delta[0])*Math.acos(-delta[1]/Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2)));
    var deg = 0;
    if (Math.abs(deltaDir*180/Math.PI-dir) > 90) {
        deg = 180;
    }
    return deg;
}

function insertNode(fromCoord, fromDir, toCoord, toDir) {
    var delta = vdelta(fromCoord, toCoord);
    var oldDirV = rotateUnitV(fromDir);
    var newDirV = rotateUnitV(toDir);
    console.log('dirs', oldDirV, newDirV);
    if (matchingParallel(0, fromCoord, toCoord, oldDirV, newDirV) || matchingParallel(1, fromCoord, toCoord, oldDirV, newDirV)) {
        return true;
    }
    //var a = (delta[0]*newDirV[1]-delta[1]*newDirV[0])/(oldDirV[1]*newDirV[0]-oldDirV[0]*newDirV[1]);
    var solution = solveForAAndB(delta, oldDirV, newDirV)
    console.log('slution', solution)
    if (solution[0] > 0 && solution[1] > 0) {
        path.push([fromCoord[0]+oldDirV[0]*solution[0], fromCoord[1]+oldDirV[1]*solution[0]]);
        console.log('virtual station', path[path.length-1])
        return newDir;
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