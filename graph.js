var graph = document.getElementById("graph");
var nodeMenu = document.getElementById("nodeMenu");
var edgeMenu = document.getElementById("edgeMenu");
var nodes = [];
var edges = [];
var currMenu = undefined;


class Node{
    constructor(name, x, y){
        this.edges = []
        this.prevPosition = {x: 0, y: 0};

        this.div = document.createElement("div");
        this.div.className = "node";
        this.div.style.top = y + "px";
        this.div.style.left = (x + graph.offsetLeft) + "px";
        this.div.innerHTML = name;
        this.div.draggable = true;
        graph.appendChild(this.div);

        this.reset();
    }

    reset(){
        this.div.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData('Text', "");
            this.prevPosition.x = e.screenX;
            this.prevPosition.y = e.screenY;
            hideContextMenu();
        });

        this.div.addEventListener("dragend", (e) => {
            var newPos = {
                x: parseInt(this.div.style.left) + e.screenX - this.prevPosition.x,
                y: parseInt(this.div.style.top) + e.screenY - this.prevPosition.y
            }
            if(newPos.x < graph.offsetLeft)
                newPos.x = graph.offsetLeft;
            this.div.style.left = newPos.x + "px";
            this.div.style.top = newPos.y + "px";
            this.prevPosition.x = 0;
            this.prevPosition.y = 0;

            updateNodeInCode(this, this.div.innerHTML, newPos.x - graph.offsetLeft, newPos.y);

            for(var i = 0; i < this.edges.length; i++)
                this.edges[i].update();
        });
    }

    addEdge(e){
        this.edges = this.edges.concat(e);
    }
    
    addEvent(callback){
        this.div.className += " selectNode";
        this.div.addEventListener("click", (e) => {
            if(e.button == 0){
                e.target.className = e.target.className.replace("selectNode", "");
                this.removeEvent()
                callback(this);
            }
        });
    }
    removeEvent(){
        this.div.className = "node";
        var tmp = this.div.cloneNode(true);
        this.div.parentNode.replaceChild(tmp, this.div);
        this.div = tmp;
        this.reset();
    }
    rename(name){
        updateNodeInCode(this, this.div.innerHTML, this.div.style.left, this.div.style.top);
        this.div.innerHTML = name;
    }
    delete(isDelFromCode){
        this.div.remove();
        for(var i = this.edges.length - 1; i > -1; i--){
            if(isDelFromCode)
                deleteEdge(this.edges[i]);
            this.edges[i].delete();
        }
        nodes.splice(nodes.indexOf(this), 1);
    }
    deleteEdge(elem){
        this.edges.splice(this.edges.indexOf(elem), 1);
    }
}

class Edge{
    constructor(a,b){
        a.addEdge(this);
        b.addEdge(this);
        this.a = a;
        this.b = b;
        this.div = document.createElement("div");
        this.div.className = "edge";

        graph.appendChild(this.div)

        this.update();
    }

    update(){
        var pos1 = {
            x: parseInt(this.a.div.style.left),
            y: parseInt(this.a.div.style.top),
        }
        var pos2 = {
            x: parseInt(this.b.div.style.left),
            y: parseInt(this.b.div.style.top),
        }

        this.div.style.left = (pos1.x + 25) + "px";
        this.div.style.top = (pos1.y + 25) + "px";

        var vect = {
            x: pos2.x - pos1.x,
            y: pos2.y - pos1.y,
        }

        var rad = Math.sqrt(vect.x * vect.x +  vect.y * vect.y)
        var angle = Math.atan2(vect.y, vect.x);

        this.div.style.height = (Math.floor(rad) - 50) + "px";
        this.div.style.transform = "rotate(" + (angle - Math.PI/2) + "rad) translate(0, 25px)";
    }

    delete(){
        this.div.remove();
        this.a.deleteEdge(this);
        this.b.deleteEdge(this);
        edges.splice(edges.indexOf(this), 1);
    }
}

document.addEventListener("contextmenu", (e) =>{
    e.preventDefault();
    for(var i = 0; i < nodes.length; i++){
        if(e.target === nodes[i].div){
            currMenu = nodes[i];
            openContextMenu(nodeMenu, 
                            parseInt(nodes[i].div.style.left) + e.layerX,
                            parseInt(nodes[i].div.style.top) + e.layerY);
        }
    }
    for(var i = 0; i < edges.length; i++){
        if(e.target === edges[i].div){
            currMenu = edges[i];
            openContextMenu(edgeMenu, 
                            parseInt(edges[i].div.style.left),
                            parseInt(edges[i].div.style.top));
        }
    }
});

document.addEventListener("click", (e) => {
    if(e.button == 0){
        if(e.target.parentNode.parentNode !== nodeMenu 
        && e.target.parentNode.parentNode.parentNode !== nodeMenu)
            hideContextMenu();
    }
});

function clean(){
    customConsole.innerHTML = "";
    for(var i = nodes.length - 1; i > -1; i--)
        nodes[i].delete();
}
//-------------------------------------------------------------------//
//-------------------------Fonctions html----------------------------//
//-------------------------------------------------------------------//
function btnAddEdge(){
    hideContextMenu();
    if(nodes.length > 1){
        document.querySelector("body").style.cursor = "crosshair";
        for(var i = 0; i < nodes.length; i++){
            if(nodes[i] !== currMenu){
                nodes[i].addEvent((e) => {
                    document.querySelector("body").style.cursor = "default";
                    addEdge(currMenu, e);
                    addTextToEditor("addEdge(nodes[" + nodes.indexOf(currMenu) + "], nodes[" + nodes.indexOf(e) + "]);");
                    for(var i = 0; i < nodes.length; i++){
                        nodes[i].removeEvent();
                    }
                });
            }
        }
    }
}
function btnAddNode(){
    nodes = nodes.concat(new Node('', 0, 0));
    addTextToEditor('addNode("", 0, 0);');
}

function addEdge(a,b){
    edges = edges.concat(new Edge(a, b));
}

function addNode(name, x, y){
    nodes = nodes.concat(new Node(name, x, y));
}

function rename(){
    var li = document.getElementById("renamefield");
    li.style.display = "block";
}

function submitRename(){
    var input = document.getElementById("namefield");
    currMenu.rename(input.value);
}


function del(type){
    hideContextMenu();
    currMenu.delete(true);
    if(type == "node")
        deleteNode(currMenu);
    else
        deleteEdge(currMenu);
}


//-------------------------------------------------------------------//
//---------------------Fonctions ultilitaires------------------------//
//-------------------------------------------------------------------//

function hideContextMenu(){
    var li = document.getElementById("renamefield");
    li.style.display = "none";
    nodeMenu.style.display = "none";
    edgeMenu.style.display = "none";
}

function openContextMenu(menu, x, y){
    menu.style.top = y + "px";
    menu.style.left = x + "px";
    menu.style.display = "block";
}