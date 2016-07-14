function Menu() {
    this.createLayout = function() {
        document.body.appendChild(menuButtons);
    }
    this.loadGame = function() {
        document.body.appendChild(progressBar);
        let progress = document.getElementById("progress-status");
        let id = setInterval(frame, 15);
        function frame() {
            if (progressDelta >= 100) { clearInterval(id); menu.createLayout(); }
            else {
                ++progressDelta;
                progress.style.width = progressDelta + "%";
            }
        }
    }
    this.createLevelView = function() {
        for (let i = 0; i < n; ++i) document.body.appendChild(levelSelectTable[i]);
    }
}

function startClassicGame() {
    mode = "classic";
    field.clear(document.body);
    menu.createLevelView();
}

function startEndlessGame() {
    mode = "endless";
    field.clear(document.body);
    initializeField();
}

function initializeGameOnce() {
    menu.loadGame();
}

function initializeMenu() {
    field.clear(document.body);
    menu.loadGame();
}

var menu = new Menu();
window.onload = initializeGameOnce;