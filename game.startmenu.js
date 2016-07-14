function createDiv(className, id, label) {
    let div = document.createElement("div");
    div.className = className;
    div.id = id;
    div.appendChild(document.createElement("label"));
    div.lastChild.innerHTML = label;
    return div;
}

function Menu() {
    this.createLayout = function() {
        let menu = createDiv("menu", "menu", "");
        menu.setAttribute("align", "center");
        menu.appendChild(createDiv("menu-selector", "newGame", "New game"));
        menu.lastChild.onclick = startClassicGame;
        menu.appendChild(createDiv("menu-selector", "timeRush", "Endless game"));
        menu.lastChild.onclick = startTimeRush;
        document.body.appendChild(menu);
    }
    this.loadGame = function() {
        let progressBar = document.createElement("div");
        progressBar.className = "progressBar";
        progressBar.id = "progressBar";
        progressBar.appendChild(createDiv("progressStatus", "progressStatus", ""));
        document.body.appendChild(progressBar);
        let progress = document.getElementById("progressStatus");
        let width = 10;
        let id = setInterval(frame, 15);
        function frame() {
            if (width >= 100) { clearInterval(id); menu.createLayout(); }
            else {
                ++width;
                progress.style.width = width + "%";
            }
        }
        document.body.style.backgroundColor = "#fff";
    }
    this.createLevelView = function() {
        let n = 3;
        for (let i = 0; i < n; ++i) {
            document.body.appendChild(createDiv("level-select-row", "row" + i, ""));
            for (let j = 0; j < n; ++j) {
                document.body.lastChild.appendChild(createDiv("level-select-tile", i * n + j, (i + 1) + j * n));
                document.body.lastChild.lastChild.onclick = function () {
                    currentLevel = (i + 1) + j * n - 1;
                    field.clear(document.body);
                    initializeField();
                };
            }
        }
    }
}

function startClassicGame() {
    mode = "classic";
    field.clear(document.body);
    menu.createLevelView();
}

function startTimeRush() {
    mode = "time";
    field.clear(document.body);
    initializeField();
}

function initializeMenu() {
    field.clear(document.body);
    menu.loadGame();
}

var menu = new Menu();
window.onload = initializeMenu;

