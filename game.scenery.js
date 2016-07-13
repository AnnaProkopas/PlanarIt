const fieldWidth = 1000, fieldHeight = 800;
var canvas, ctx, cursorPosX, cursorPosY, selectedPoint, count = 0;

if (gameSession === undefined) var gameSession = {};
gameSession.currentLevel = minLevel;

function initialize() {
    gameSession.createLayout();
    cursorPosX = 0; cursorPosY = 0;
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = fieldWidth;
    canvas.height = fieldHeight;
    document.body.appendChild(canvas);
    canvas.addEventListener('mousemove',  mouseMove,  false);
    canvas.addEventListener('mousedown',  mouseDown,  false);
    canvas.addEventListener('mouseup',    mouseUp,    false);
    draw();
}

function movePoint() {
    gameSession.points[selectedPoint].x = cursorPosX;
    gameSession.points[selectedPoint].y = cursorPosY;
}

function selectPoint() {
    selectedPoint = undefined;
    let x, y, xDis, yDis, dis, minDis = Math.PI * (radius * radius) / 2;
    for (let i = 0; i < gameSession.points.length; ++i) {
        x = gameSession.points[i].x;
        y = gameSession.points[i].y;
        xDis = x - cursorPosX;
        yDis = y - cursorPosY;
        dis  = xDis * xDis + yDis * yDis;
        if (dis <= minDis) { minDis = dis; selectedPoint = i };
    }
}

function draw() {
    ctx.clearRect(0, 0, fieldWidth, fieldHeight);
    let x, y;
    ctx.lineWidth = 2;
    let ps = [];
    for (let i = 0, t0, t1; i < gameSession.edges.length; ++i) {
        gameSession.edges[i].beginCoords = gameSession.points[gameSession.edges[i].beginPoint];
        gameSession.edges[i].endCoords = gameSession.points[gameSession.edges[i].endPoint];
        gameSession.edges[i].A = gameSession.edges[i].endCoords.y - gameSession.edges[i].beginCoords.y;
        gameSession.edges[i].B = gameSession.edges[i].beginCoords.x - gameSession.edges[i].endCoords.x;
        gameSession.edges[i].C = -gameSession.edges[i].A * (gameSession.edges[i].beginCoords.x) -
                                  gameSession.edges[i].B * (gameSession.edges[i].beginCoords.y);
        t0 = gameSession.points[gameSession.edges[i].beginPoint];
        t1 = gameSession.points[gameSession.edges[i].endPoint];

        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgb(0, 0, 0)';
        ctx.strokeStyle = '#98FB98';
        for (let j = 0; j < gameSession.edges.length; ++j) {
            let curEdge = gameSession.edges[i], nextEdge = gameSession.edges[j];
            if (curEdge == nextEdge) continue;
            let p = isIntersecting(curEdge, nextEdge);
            if (p !== false) {
                console.log(p);
                ctx.strokeStyle = '#e74c3c';
                ps.push(p);
            }
        }
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = 0; i < ps.length; ++i) {
        drawPointPath(5, ps[i].x, ps[i].y);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
    for (let i = 0; i < gameSession.points.length; ++i) {
        x = gameSession.points[i].x;
        y = gameSession.points[i].y;
        drawPointPath(radius, x, y);
        ctx.fillStyle = '#333';
        ctx.fill();
    }
    window.requestAnimationFrame(draw);
}

function drawPointPath(r, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
}

function getMouseCoords(event) {
    cursorPosX = event.pageX - canvas.offsetLeft;
    cursorPosY = event.pageY - canvas.offsetTop;
    if (cursorPosX > fieldWidth - radius) cursorPosX = fieldWidth - radius;
    else if (cursorPosX < radius) cursorPosX = radius;
    if (cursorPosY > fieldHeight - radius) cursorPosY = fieldHeight - radius;
    else if (cursorPosY < radius) cursorPosY = radius;
}

function mouseDown(event) {
    getMouseCoords(event);
    selectPoint();
    movePoint();
}

function mouseUp(event) {
    selectedPoint = undefined;
}

function mouseMove(event) {
    getMouseCoords(event);
    if (selectedPoint != undefined) movePoint();
}

function clear(obj) {
    while (obj.lastChild) obj.removeChild(obj.lastChild);
}

gameSession.changeLevel = function(inc) {
    if (gameSession.currentLevel + inc >= minLevel && gameSession.currentLevel + inc <= maxLevel)
        gameSession.currentLevel += inc;
    gameSession.createLayout();
}

gameSession.createLayout = function() {
    gameSession.points = [];
    gameSession.edges  = [];
    let level = presetLevels[gameSession.currentLevel];
    for (let i = 0; i < level.points.length; ++i)
        gameSession.points.push(new gameSession.point(level.points[i].x, level.points[i].y, radius));
    for (let i = 0; i < level.edges.length; ++i)
        for (let j = 0; j < level.edges[i].length - 1; ++j)
            gameSession.edges.push(new gameSession.line(level.edges[i][j], level.edges[i][j + 1]));
};

gameSession.generateLayout = function(level) {

}

window.onload = initialize;