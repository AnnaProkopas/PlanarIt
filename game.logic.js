const radius = 17, EPS = 0.000001;

if (gameSession === undefined) var gameSession = {};

gameSession.point = function(x, y, radius) {
    this.x = x;
    this.y = y;
}

gameSession.line = function(p1, p2) {
    this.beginPoint = p1;
    this.endPoint = p2;
    this.beginCoords = gameSession.points[this.beginPoint];
    this.endCoords = gameSession.points[this.endPoint];
    this.A = this.endCoords.y - this.beginCoords.y;
    this.B = this.beginCoords.x - this.endCoords.x;
    this.C = -this.A * (this.beginCoords.x) - this.B * (this.beginCoords.y);
}

function isInSegment(a, b, c) {
    if (Math.abs(a - b) < EPS || Math.abs(b - c) < EPS) return false;
    const r = 0;
    return (a + r < b && b < c - r) || (c + r < b && b < a - r);
}

function isIntersecting(a, b) {
    let delta = a.A * b.B - b.A * a.B;
    if (Math.abs(delta) < 1e-10) return false;
    let delta_x = -b.B * a.C + a.B * b.C;
    let delta_y = -a.A * b.C + b.A * a.C;
    let x = delta_x / delta;
    let y = delta_y / delta;

    if ((isInSegment(a.beginCoords.x, x, a.endCoords.x) || isInSegment(a.beginCoords.y, y, a.endCoords.y)) &&
        (isInSegment(b.beginCoords.x, x, b.endCoords.x) || isInSegment(b.beginCoords.y, y, b.endCoords.y))) {
        return { x: x, y: y };
    }
    return false;
}

//TODO SOLVER (firebase)
//TODO RESULTS TABLE