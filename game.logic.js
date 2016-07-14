const radius = 17, EPS = 1e-10;

function randInt(min, max) {
    ++max;
    return (Math.floor(Math.random() * (max - min)) + min);
}

function makeLine(point1, point2) {
    let beginPoint = { x: point1.x, y: point1.y };
    let endPoint = { x: point2.x, y: point2.y };
    let A = point2.y - point1.y;
    let B = point1.x - point2.x;
    let C = -A * point1.x - B * point1.y;
    return { A: A, B: B, C: C, beginPoint: beginPoint, endPoint: endPoint };
}

function isInSegment(a, b, c) {
    if (Math.abs(a - b) < EPS || Math.abs(b - c) < EPS) return false;
    return (a < b && b < c) || (c < b && b < a);
}

function intersectionPoint(line1, line2) {
    let det = line1.A * line2.B - line2.A * line1.B;
    if (Math.abs(det) < 1e-10) return false;
    let detX = -line2.B * line1.C + line1.B * line2.C;
    let detY = -line1.A * line2.C + line2.A * line1.C;
    let x = detX / det;
    let y = detY / det;
    if ((isInSegment(line1.beginPoint.x, x, line1.endPoint.x) ||
         isInSegment(line1.beginPoint.y, y, line1.endPoint.y)) &&
        (isInSegment(line2.beginPoint.x, x, line2.endPoint.x) ||
         isInSegment(line2.beginPoint.y, y, line2.endPoint.y)))
            return { x: x, y: y};
    return false;
}
