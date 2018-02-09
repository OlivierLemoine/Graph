var graph = document.getElementById("graph");
var nodeMenu = document.getElementById("nodeMenu");
var edgeMenu = document.getElementById("edgeMenu");
var nodes = [];
var edges = [];
var currMenu = undefined;


class Node{
    constructor(name){
        this.edges = []
        this.prevPosition = {x: 0, y: 0};
        this.div = document.createElement("div");
        this.div.className = "node";
        this.div.style.top = 0;
        this.div.style.left = 0;
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
            this.div.style.left = parseInt(this.div.style.left) + e.screenX - this.prevPosition.x + "px";
            this.div.style.top = parseInt(this.div.style.top) + e.screenY - this.prevPosition.y + "px";
            this.prevPosition.x = 0;
            this.prevPosition.y = 0;

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
        this.div.innerHTML = name;
    }
    delete(){
        this.div.remove();
        for(var i = 0; i < this.edges.length; i++)
            this.edges[i].delete();
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

//-------------------------------------------------------------------//
//-------------------------Fonctions html----------------------------//
//-------------------------------------------------------------------//
function addEdge(){
    hideContextMenu();
    if(nodes.length > 1){
        document.querySelector("body").style.cursor = "crosshair";
        for(var i = 0; i < nodes.length; i++){
            if(nodes[i] !== currMenu){
                nodes[i].addEvent((e) => {
                    document.querySelector("body").style.cursor = "default";
                    edges = edges.concat(new Edge(currMenu, e));
                    for(var i = 0; i < nodes.length; i++){
                        nodes[i].removeEvent();
                    }
                });
            }
        }
    }
}

function addNode(){
    nodes = nodes.concat(new Node(""));
}

function rename(){
    var li = document.getElementById("renamefield");
    li.style.display = "block";
}

function submitRename(){
    var input = document.getElementById("namefield");
    currMenu.rename(input.value);
}

function del(e){
    hideContextMenu();
    currMenu.delete();
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