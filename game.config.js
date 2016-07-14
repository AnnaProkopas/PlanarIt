const fieldWidth = 1000, fieldHeight = 800, n = 3;
var progressDelta = 10;
var cursorPosX, cursorPosY, isMoving;

var levelControls = [];
levelControls.push(createButton("selector", "return-button", returnToMenu));
levelControls.push(createButton("selector", "reset-button", resetLevel));
levelControls.push(createButton("selector", "bwd-button", prevLevel));
levelControls.push(createButton("selector", "fwd-button", nextLevel));
levelControls.push(createButton("selector", "inc-button", nextLevel));
levelControls.push(createButton("selector", "dec-button", prevLevel));
levelControls.push(createLabel("score", "score", "Score: 0"));
var selectors = createDiv("selectors", "selectors", "");

var progressBar = createDiv("progress-bar", "progress-bar", "");
progressBar.appendChild(createDiv("progress-status", "progress-status", ""));

var levelSelectTable = [];
for (let i = 0; i < n; ++i) {
    levelSelectTable.push(createDiv("level-select-row", "row" + i, ""));
    for (let j = 0; j < n; ++j) {
        levelSelectTable[i].appendChild(createDiv("level-select-tile", i * n + j, (i + 1) + j * n));
        levelSelectTable[i].lastChild.onclick = function () {
            currentLevel = (i + 1) + j * n - 1;
            field.clear(document.body);
            initializeField();
        };
    };
}

var menuButtons = createDiv("menu", "menu", "");
menuButtons.setAttribute("align", "center");
menuButtons.appendChild(createDiv("menu-selector", "new-game", "New game"));
menuButtons.lastChild.onclick = startClassicGame;
menuButtons.appendChild(createDiv("menu-selector", "endless", "Endless game"));
menuButtons.lastChild.onclick = startTimeRush;

for (let i = 0; i < levelControls.length; ++i) {
    selectors.appendChild(levelControls[i]);
}

function returnToMenu() {
    field.clear(document.body);
    initializeMenu();
}

function resetLevel() {
    if (mode == "classic") field.createLayout();
    else field.generateLayout(pointsCount);
}

function nextLevel() {
    field.changeLevel(1, true);
}

function prevLevel() {
    field.changeLevel(-1, true);
}

function createDiv(className, id, label) {
    let div = document.createElement("div");
    div.className = className;
    div.id = id;
    div.appendChild(document.createElement("label"));
    div.lastChild.innerHTML = label;
    return div;
}


function createLabel(className, id, innerHTML) {
    let label = document.createElement("label");
    label.className = className;
    label.id = id;
    label.innerHTML = innerHTML;
    return label;
}

function createButton(className, id, fn) {
    let btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.id = id;
    btn.onclick = fn;
    return btn;
}

function initializeLevelControls() {
    document.body.appendChild(selectors);
}

function initializeField() {
    if (mode == "classic") field.createLayout();
    else field.generateLayout(minPointsCount);
    cursorPosX = cursorPosY = score = 0;
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = fieldWidth > screen.availWidth ? screen.availWidth : fieldWidth;
    canvas.height = fieldHeight > screen.availHeight ? screen.availHeight : fieldHeight;
    document.body.appendChild(canvas);
    document.body.addEventListener('mousemove',  mouse.move,  false);
    canvas.addEventListener('mousemove',  mouse.move,  false);
    canvas.addEventListener('mousedown',  mouse.down,  false);
    canvas.addEventListener('mouseup',    mouse.up,    false);
    isMoving = false;
    initializeLevelControls();
    draw();
}

function Mouse() {
    this.move = function(event) {
        mouse.getCoords(event);
        if (selectedPoint != undefined) field.movePoint();
    }
    this.down = function(event) {
        isMoving = true;
        mouse.getCoords(event);
        field.selectPoint();
        field.movePoint();
    }
    this.up = function(event) {
        isMoving = false;
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