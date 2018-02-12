var textField = document.getElementById("textfield");
var graph = document.getElementById("graph");
var cursor = document.getElementById("cursor");

function addTextToEditor(s){
    var txt = document.createElement("div");
    txt.innerHTML = txtTranform(s);
    textField.insertBefore(txt, cursor.parentNode);
}