function treeGenerate(amount) {
    pointsCount = amount;
    points = [];
    edges  = [];

    let nodes = [], node = {};
    node.parent = 0;
    node.root = 0;
    node.len = 0;
    node.ch = amount;
    node.last_rope = 0;
    node.last_delta = 1;
    node.delta = 1;
    nodes.push(node);

    let i = 0, n = 0, type = 1,lastPoint = 0;
    while(points.length < amount - 1) {
        ++nodes[n].len;
        let point = {};
        let edge = {};
        point.x = randInt(radius, fieldWidth - radius);
        point.y = randInt(radius, fieldHeight - radius);
        points.push(point);

        if(nodes[n].len >= nodes[n].ch) {
            if(lastPoint != nodes[n].root) {
                edge = {};
                edge.beginPoint = lastPoint;
                edge.endPoint = i;
                edges.push(edge);
            }
            lastPoint = i;
            let l = nodes[n].len;
            n = nodes[n].parent;
            i = nodes[n].root;
            nodes[n].len += l;
        }
        else if((i > 0) && (nodes[n].ch > 1)) {
            let act = randInt(1,3);

            switch(act) {
                //Create rope
                case 1:
                    if(lastPoint != nodes[n].root) {
                        edge = {};
                        edge.beginPoint = lastPoint;
                        edge.endPoint = i;
                        edges.push(edge);
                    }
                    lastPoint = i;
                    nodes[n].last_rope = i;
                    i = nodes[n].root;
                    nodes[n].last_delta = nodes[n].delta;
                    nodes[n].delta = nodes[n].root+nodes[n].len;
                    break;

                //Create node
                case 2:
                    let node = {};
                    node.parent = n;
                    node.root = node.last_rope = i;
                    node.last_delta = i+1;
                    node.delta = i+1;
                    node.len = 1;
                    node.ch = nodes[n].ch-nodes[n].len;
                    nodes.push(node);
                    n = nodes.length-1;
                    break;

                //Not declared - default
                case 3:

                    break;
            }
        }

        //TYPES OF EDGE
        if((nodes[n].last_rope > nodes[n].root) && (i > nodes[n].root)) type = randInt(1,5);
        else type = 1;
        switch(type) {
            case 1:
                edge = {};
                edge.beginPoint = i;
                edge.endPoint = points.length;
                edges.push(edge);
                break;

            case 2:
                edge = {};
                nodes[n].last_delta += randInt(0,nodes[n].last_rope-nodes[n].last_delta);
                edge.beginPoint = nodes[n].last_delta;
                edge.endPoint = i;
                edges.push(edge);
                break;

            default:
                edge = {};
                edge.beginPoint = i;
                edge.endPoint = points.length;
                edges.push(edge);

                nodes[n].last_delta += randInt(0,nodes[n].last_rope-nodes[n].last_delta);

                edge = {};
                edge.beginPoint = nodes[n].last_delta;
                edge.endPoint = i;
                edges.push(edge);
                break;
        }

        if(i < points.length) i = points.length;
        else ++i;
    }
    let point = {};
    point.x = randInt(radius, fieldWidth - radius);
    point.y = randInt(radius, fieldHeight - radius);
    points.push(point);

    let edge = {};
    edge.beginPoint = points.length - 1;
    edge.endPoint = lastPoint;
    edges.push(edge);
}

function triangleGenerate(amount) {
    let field = [2];
    let N_CONST_POINT = 2, N_POINT = 4*amount / 30, N_EDGES = 1.5;
    field.height = fieldHeight;
    field.width = fieldWidth;
    let level = 1;
    points = [];
    edges  = [];

    function add(a) {
        if (Math.floor(N_EDGES * Math.random())) {
            let edge = {};
            edge.beginPoint = a;
            edge.endPoint = points.length - 1;
            edges.push(edge);
            return true;
        }
    }
    let first = points.length;
    for (var i = 0; i < 3; i++) {
        points.push(new Array(2));
        points[first + i].x = Math.floor(field.width * Math.random());
    }
    for (var i = 0; i < 3; i++) {
        points[first + i].y = Math.floor(field.width * Math.random());
        if (i > 1) {
            add(0);
        }
    }
    add(1);

    function generate(a, b, c, counter) {
        if (counter <= 0 || points.length - 1 == amount) {
            return;
        }
        function mod_for_AB(a, b) {
            return Math.sqrt((points[a].x - points[b].x) * (points[a].x - points[b].x) + (points[a].y - points[b].y) * (points[a].y - points[b].y));
        }

        var lambda = mod_for_AB(a, c) / mod_for_AB(b, c);
        var F = [2];
        F.c = [5];
        F.c.x = (points[a].x + lambda * points[b].x) / (1 + lambda);
        F.c.y = (points[a].y + lambda * points[b].y) / (1 + lambda);
        F.c.a = points[c].y - F.c.y;
        F.c.b = F.c.x - points[c].x;
        F.c.c = points[c].x * F.c.y - F.c.x * points[c].y;

        lambda = mod_for_AB(b, a) / mod_for_AB(a, c);
        F.a = [5];
        F.a.x = (points[b].x + lambda * points[c].x) / (1 + lambda);
        F.a.y = (points[b].y + lambda * points[c].y) / (1 + lambda);
        F.a.a = points[a].y - F.a.y;
        F.a.b = F.a.x - points[a].x;
        F.a.c = points[a].x * F.a.y - F.a.x * points[a].y;
        var Centre = [2];
        Centre.x = (F.c.c - (F.c.b * F.a.c) / F.a.b) / ((F.c.b * F.a.a) / F.a.b - F.c.a);
        Centre.y = (-F.a.a * Centre.x - F.a.c) / F.a.b;
        var radius = ((points[a].y - points[b].y) * Centre.x + (points[b].x - points[a].x) * Centre.y +
            points[a].x * points[b].y - points[b].x * points[a].x) / mod_for_AB(a, b);


        points[points.length] = [3];
        if (Math.floor(2 * Math.random())) {
            points[points.length - 1].x = Centre.x + Math.floor(radius * Math.random());
        }
        else {
            points[points.length - 1].x = Centre.x - Math.floor(radius * Math.random());
        }
        if (Math.floor(2 * Math.random())) {
            points[points.length - 1].y = Centre.y + Math.floor(radius * Math.random());
        }
        else {
            points[points.length - 1].y = Centre.y - Math.floor(radius * Math.random());
        }
        var added = false;
        added = (add(a) == true) ? true : added;
        added = (add(b) == true) ? true : added;
        added = (add(c) == true) ? true : added;
        if (!added) {
            points.pop();
            return;
        }
        added = points.length - 1;
        generate(a, b, added, counter - 1);
        generate(a, added, c, counter - 1);
        generate(added, b, c, counter - 1);
    }
    generate(first, first + 1, first + 2, level * N_POINT);
    for (var i = 0; i < N_CONST_POINT; i++) {
        points[Math.floor((points.length - 1) * Math.random())].const = true;
    }
    for (let i = first; i < points.length; i++) {
        if (!points[i].const) {
            points[i].x = Math.floor(field.width * Math.random());
            points[i].y = Math.floor(field.height * Math.random());
        }
    }
}