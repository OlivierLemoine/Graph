var editor = document.getElementById("editor");
var textField = document.getElementById("textfield");
var cursor = document.getElementById("cursor");
var customConsole = document.getElementById("console");

textField.addEventListener("keydown", (e) => {
    switch(e.key){
        case "CapsLock": break;
        case "Tab": break;
        case "Shift": break;
        case "Control": break;
        case "Alt": break;
        case "OS": break;

        case "Backspace":
            if(cursor.previousSibling != null)
                cursor.previousSibling.remove();
            else if(textField.childNodes.length > 1){
                var prevDiv = cursor.parentNode;
                cursor.parentNode.previousSibling.appendChild(cursor);
                while (prevDiv.firstChild != null){
                    cursor.parentElement.appendChild(prevDiv.firstChild);
                }
                prevDiv.remove();
            }
            break;
        case "Enter":
            var prevDiv = cursor.parentNode;
            var newDiv = document.createElement("div");

            while (cursor.nextSibling != null){
                newDiv.appendChild(cursor.nextSibling);
            }
            newDiv.insertBefore(cursor, newDiv.firstChild);
            prevDiv.parentNode.insertBefore(newDiv, prevDiv.nextSibling);
            break;

        case "ArrowLeft":
            if(cursor.previousSibling != null)
                cursor.parentNode.insertBefore(cursor, cursor.previousSibling);
            else if(cursor.parentNode.previousSibling != null)
                cursor.parentNode.previousSibling.appendChild(cursor);
            break;
        case "ArrowRight":
            if(cursor.nextSibling != null)
                cursor.parentNode.insertBefore(cursor.nextSibling, cursor);
            else if(cursor.parentNode.nextSibling != null){
                cursor.parentNode.nextSibling.appendChild(cursor);
                cursor.parentNode.insertBefore(cursor, cursor.parentNode.firstChild);
            }
            break;
        case "ArrowUp":
            if(cursor.parentNode.previousSibling != null){
                var count = 0;
                var ptr = cursor;
                while(ptr.previousSibling != null){
                    ptr = ptr.previousSibling;
                    count++;
                }
                ptr = cursor.parentNode.previousSibling.firstChild;
                while(ptr.nextSibling != null && count > -1){
                    count--;
                    ptr = ptr.nextSibling;
                }
                ptr.parentNode.insertBefore(cursor, ptr);
            }
            
            break;
        case "ArrowDown":
            if(cursor.parentNode.previousSibling != null){
                var count = 0;
                var ptr = cursor;
                while(ptr.previousSibling != null){
                    ptr = ptr.previousSibling;
                    count++;
                }
                ptr = cursor.parentNode.nextSibling.firstChild;
                while(ptr.nextSibling != null && count > -1){
                    count--;
                    ptr = ptr.nextSibling;
                }
                ptr.parentNode.insertBefore(cursor, ptr);
            }
            
            break;
        default:
            if(e.ctrlKey)
                break;
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
    }
});

textField.addEventListener("click", (e) => {
    if(e.button == 0 && e.target.parentNode.parentNode === textField){
        e.target.parentNode.insertBefore(cursor, e.target);
    }
})

function exeCode(){
    clean();
    try {
        eval(textField.textContent.trim()); 
    } catch (e) {
        console.log(e);
    }
    textField.focus();
}
textField.focus();

function txtTranform(s){
    var res = "";
    for(var i in s)
        res += "<span>" + s[i] + "</span>";
    return res;
}