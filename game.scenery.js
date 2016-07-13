const fieldWidth = 1000, fieldHeight = 800;
var canvas, ctx, cursorPosX, cursorPosY,
    selectedPoint, intersectionPoints,
    points, edges, count, currentLevel = minLevel;

window.onload = initialize;

function initialize() {
    field.createLayout();
    cursorPosX = cursorPosY = 0;
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = fieldWidth;
    canvas.height = fieldHeight;
    document.body.appendChild(canvas);
    canvas.addEventListener('mousemove',  mouse.move,  false);
    canvas.addEventListener('mousedown',  mouse.down,  false);
    canvas.addEventListener('mouseup',    mouse.up,    false);
    draw();
}

function draw() {
    ctx.clearRect(0, 0, fieldWidth, fieldHeight);
    let x, y;
    ctx.lineWidth = 2;
    intersectionPoints = [];
    for (let i = 0; i < edges.length; ++i) {
        count = 0;
        let curBegin = points[edges[i].beginPoint],
            curEnd = points[edges[i].endPoint];
        for (let j = 0; j < edges.length; ++j) {
            let nextBegin = points[edges[j].beginPoint],
                nextEnd = points[edges[j].endPoint];
            let curLine  = makeLine(curBegin, curEnd),
                nextLine = makeLine(nextBegin, nextEnd);
            let curEdge  = edges[i],
                nextEdge = edges[j];
            if (curLine == nextLine) continue;
            let p = intersectionPoint(curLine, nextLine);
            if (p !== false) {
                ++count;
                curEdge.intersecting = nextEdge.intersecting = true;
                intersectionPoints.push(p);
                break;
            }
            if (count == 0) curEdge.intersecting = false;
        }
    }
    for (let i = 0, t0, t1; i < edges.length; ++i) {
        t0 = points[edges[i].beginPoint];
        t1 = points[edges[i].endPoint];
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgb(0, 0, 0)';
        ctx.strokeStyle = "green";
        if (edges[i].intersecting) ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = 0; i < intersectionPoints.length; ++i) {
        field.drawPointPath(5, intersectionPoints[i].x, intersectionPoints[i].y);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
    for (let i = 0; i < points.length; ++i) {
        x = points[i].x;
        y = points[i].y;
        field.drawPointPath(radius, x, y);
        ctx.fillStyle = '#333';
        ctx.fill();
    }
    window.requestAnimationFrame(draw);
};

function Field() {
    this.clear = function(obj) {
        while (obj.lastChild) obj.removeChild(obj.lastChild);
    }
    this.selectPoint = function() {
        selectedPoint = undefined;
        let x, y, xDis, yDis, dis, minDis = Math.PI * (radius * radius) / 2;
        for (let i = 0; i < points.length; ++i) {
            x = points[i].x;
            y = points[i].y;
            xDis = x - cursorPosX;
            yDis = y - cursorPosY;
            dis  = xDis * xDis + yDis * yDis;
            if (dis <= minDis) { minDis = dis; selectedPoint = i };
        }
    }
    this.movePoint = function() {
        points[selectedPoint].x = cursorPosX;
        points[selectedPoint].y = cursorPosY;
        console.log(points);
    }
    this.drawPointPath = function(r, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.closePath();
    }
    this.createLayout = function() {
        points = [];
        edges  = [];
        let level = presetLevels[currentLevel];
        for (let i = 0; i < level.points.length; ++i) {
            let point = {};
            point.x = level.points[i].x;
            point.y = level.points[i].y;
            points.push(point);
        }
        console.log(points);
        for (let i = 0; i < level.edges.length; ++i)
            for (let j = 0; j < level.edges[i].length - 1; ++j) {
                let edge  = {};
                edge.beginPoint = level.edges[i][j];
                edge.endPoint = level.edges[i][j + 1];
                edge.intersecting = false;
                edges.push(edge);
            }
        console.log(points, edges);
    }
    this.changeLevel = function(inc) {
        if (currentLevel + inc >= minLevel &&
            currentLevel + inc <= maxLevel)
            currentLevel += inc;
        field.createLayout();
    }
}

function Mouse() {
    this.move = function(event) {
        mouse.getCoords(event);
        if (selectedPoint != undefined) field.movePoint();
    }
    this.down = function(event) {
        mouse.getCoords(event);
        field.selectPoint();
        field.movePoint();
    }
    this.up = function(event) {
        selectedPoint = undefined;
        if (intersectionPoints.length == 0 && currentLevel != maxLevel)
            field.changeLevel(1);
    }
    this.getCoords = function(event) {
        cursorPosX = event.pageX - canvas.offsetLeft;
        cursorPosY = event.pageY - canvas.offsetTop;
        if (cursorPosX > fieldWidth - radius) cursorPosX = fieldWidth - radius;
        else if (cursorPosX < radius) cursorPosX = radius;
        if (cursorPosY > fieldHeight - radius) cursorPosY = fieldHeight - radius;
        else if (cursorPosY < radius) cursorPosY = radius;
    }

};

var mouse = new Mouse();
var field = new Field();