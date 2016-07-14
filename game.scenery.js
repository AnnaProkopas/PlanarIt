var canvas, ctx, intersectionPoints, selectedPoint,
    points, edges, count, currentLevel = minLevel,
    fieldPointColor = "#333", intersectionPointColor = "black",
    noIntersectionColor = "black", intersectionColor = "grey",
    mode, pointsCount, minPointsCount = 10, maxPointsCount = 11, score;

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
            }
            if (!count) curEdge.intersecting = false;
        }
    }
    for (let i = 0, t0, t1; i < edges.length; ++i) {
        t0 = points[edges[i].beginPoint];
        t1 = points[edges[i].endPoint];
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgb(255, 255, 255)';
        ctx.strokeStyle = "rgb(255,255,255)";
        if (edges[i].intersecting)  {
            ctx.shadowColor = 'rgb(0, 0, 0)';
            ctx.strokeStyle = intersectionColor;
        }
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = 0; i < intersectionPoints.length; ++i) {
        ctx.shadowColor = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.arc(intersectionPoints[i].x, intersectionPoints[i].y, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = intersectionPointColor;
        ctx.fill();
    }
    for (let i = 0; i < points.length; ++i) {
        x = points[i].x;
        y = points[i].y;
        field.drawPointPath(radius, x, y, i);
        ctx.fill();
    }
    window.requestAnimationFrame(draw);
};

function Field() {
    this.clear = function(obj) {
        if (points && edges && intersectionPoints) {
            for (let i = 0; i < points.length; ++i) points[i] = null;
            for (let i = 0; i < edges.length; ++i) edges[i] = null;
            for (let i = 0; i < intersectionPoints.length; ++i) intersectionPoints[i] = null;
            canvas = null;
        }
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
        console.log(selectedPoint);
        points[selectedPoint].x = cursorPosX;
        points[selectedPoint].y = cursorPosY;
    }
    this.drawPointPath = function(r, x, y, i) {
        if (i == selectedPoint)
            ctx.fillStyle = isMoving ? "#5A5A5A" : "rgb(255,255,255)";
        else
            ctx.fillStyle = "rgb(255,255,255)";
        ctx.beginPath();
        ctx.arc(x,y,r - 7,0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
    }
    this.changeLevel = function (inc, skip = false) {
        if (mode == "classic") {
            if (currentLevel + inc >= minLevel &&
                currentLevel + inc <= maxLevel) {
                currentLevel += inc;
                field.createLayout();
            } else if ((currentLevel + inc) == maxLevel + 1)
                returnToMenu();
        }
        else if (pointsCount + inc <= maxPointsCount &&
                 pointsCount + inc >= minPointsCount)
            field.generateLayout(pointsCount += inc);
        else field.generateLayout(pointsCount);
        score = parseInt(score) + 100 - 100*skip;
        document.getElementById("score").innerHTML = "Score: " + score;
        if (!skip) {
            let sound = document.createElement("audio");
            sound.src = "victory.mp3";
            sound.setAttribute("preload", "auto");
            sound.setAttribute("controls", "none");
            sound.style.display = "none";
            sound.play();
        }
    }
    this.createLayout = function() {
        points = [];
        edges  = [];
        let level = presetLevels[currentLevel];
        for (let i = 0; i < level.points.length; ++i) {
            let point = {};
            point.x = level.points[i].x;
            point.y = level.points[i].y;
            //point.const = false;
            points.push(point);
        }
        for (let i = 0; i < level.edges.length; ++i) {
            for (let j = 0; j < level.edges[i].length - 1; ++j) {
                let edge = {};
                edge.beginPoint = level.edges[i][j];
                edge.endPoint = level.edges[i][j + 1];
                edge.intersecting = false;
                edges.push(edge);
            }
        }
    }
    this.generateLayout = function(amount) {
        let coin = randInt(1, 2); //DEBUG MODE --> randInt(1, 2)
        console.log(coin);
        switch(coin) {
            case 1: treeGenerate(amount); break;
            case 2: triangleGenerate(amount); break;
            default: break;
        }
    }
}

var field = new Field();