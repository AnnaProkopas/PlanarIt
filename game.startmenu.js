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
}

function startClassicGame() {
    mode = "classic";
    field.clear(document.body);
    initializeField();
}

function startTimeRush() {
    mode = "time";
    field.clear(document.body);
    initializeField();
}

function initializeMenu() {
    field.clear(document.body);
    menu.createLayout();
}

var menu = new Menu();
window.onload = initializeMenu;

