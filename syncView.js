function addTextToEditor(s){
    var txt = document.createElement("div");
    txt.innerHTML = txtTranform(s);
    textField.insertBefore(txt, cursor.parentNode);
}

function updateNodeInCode(e, name, x, y){
    var pos = nodes.indexOf(e);
    var lineNb = findLineOfNode("addNode", pos);
    if(lineNb != undefined)
        textField.children[lineNb].innerHTML = txtTranform('addNode("' + name + '", ' + x + ", " + y + ");");
    else
        console.log("Recherche introuvable");
}

function deleteNode(e){
    var pos = nodes.indexOf(e);
    var lineNb = findLineOfNode("addNode", pos);
    if(lineNb != undefined)
        deleteAt(lineNb);
}

function deleteEdge(e){
    var pos = edges.indexOf(e);
    var lineNb = findLineOfNode("addEdge", pos);
    if(lineNb != undefined)
        deleteAt(lineNb);
}

function deleteAt(line){
    if(textField.children.length > 1)
        textField.removeChild(textField.children[line]);
    else
    textField.children[lineNb].innerHTML = "";
}

function findLineOfNode(s, o){
    for(var i = 0; i < textField.children.length; i ++){
        if(textField.children[i].textContent.includes(s)){
            o--;
            if(o <= -1)
                return i;
        }
    }
    return undefined;
}

function updateGraphFromCode(){
    var txt = cursor.parentNode.textContent;
    if(txt.includes("addNode") || txt.includes("addEdge"))
        exeCode(false);
}