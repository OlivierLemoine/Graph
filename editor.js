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
        case "AltGraph": break;
        case "Escape": break;
        case "F1": break;
        case "F2": break;
        case "F3": break;
        case "F4": break;
        case "F5": break;
        case "F6": break;
        case "F7": break;
        case "F8": break;
        case "F9": break;
        case "F10": break;
        case "F11": break;
        case "F12": break;

        case "Backspace":
            if(cursor.previousElementSibling != null)
                cursor.previousElementSibling.remove();
            else if(textField.childNodes.length > 1){
                var prevDiv = cursor.parentNode;
                cursor.parentNode.previousElementSibling.appendChild(cursor);
                while (prevDiv.firstChild != null){
                    cursor.parentElement.appendChild(prevDiv.firstChild);
                }
                prevDiv.remove();
            }
            break;
        case "Enter":
            var prevDiv = cursor.parentNode;
            var newDiv = document.createElement("div");

            while (cursor.nextElementSibling != null){
                newDiv.appendChild(cursor.nextElementSibling);
            }
            newDiv.insertBefore(cursor, newDiv.firstChild);
            prevDiv.parentNode.insertBefore(newDiv, prevDiv.nextElementSibling);
            break;

        case "ArrowLeft":
            if(cursor.previousElementSibling != null)
                cursor.parentNode.insertBefore(cursor, cursor.previousElementSibling);
            else if(cursor.parentNode.previousElementSibling != null)
                cursor.parentNode.previousElementSibling.appendChild(cursor);
            break;
        case "ArrowRight":
            if(cursor.nextElementSibling != null)
                cursor.parentNode.insertBefore(cursor.nextElementSibling, cursor);
            else if(cursor.parentNode.nextElementSibling != null){
                cursor.parentNode.nextElementSibling.appendChild(cursor);
                cursor.parentNode.insertBefore(cursor, cursor.parentNode.firstChild);
            }
            break;
        case "ArrowUp":
            if(cursor.parentNode.previousElementSibling != null){
                var count = 0;
                var ptr = cursor;
                while(ptr.previousElementSibling != null){
                    ptr = ptr.previousElementSibling;
                    count++;
                }
                ptr = cursor.parentNode.previousElementSibling.firstElementChild;
                while(ptr.nextElementSibling != null && count > 1){
                    count--;
                    ptr = ptr.nextElementSibling;
                }
                ptr.parentNode.insertBefore(cursor, ptr.nextSibling);
            }
            
            break;
        case "ArrowDown":
            if(cursor.parentNode.nextElementSibling != null){
                var count = 0;
                var ptr = cursor;
                while(ptr.previousElementSibling != null){
                    ptr = ptr.previousElementSibling;
                    count++;
                }
                ptr = cursor.parentNode.nextElementSibling.firstElementChild;
                while(ptr.nextElementSibling != null && count > 1){
                    count--;
                    ptr = ptr.nextElementSibling;
                }
                ptr.parentNode.insertBefore(cursor, ptr.nextSibling);
            }
            
            break;
        case "Space":
            var elem = document.createElement("span");
            elem.innerText = "&nbsp;";
            cursor.parentNode.insertBefore(elem, cursor);

        case "{":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "}":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "&":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "#":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "'":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case '"':
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "(":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case ")":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "[":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "]":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
        case "|":
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;

        default:
        console.log(e.key);
            if(e.ctrlKey)
                break;
            var elem = document.createElement("span");
            elem.innerText = e.key;
            cursor.parentNode.insertBefore(elem, cursor);
            break;
    }
});

textField.addEventListener("click", (e) => {
    if(e.button == 0){
        if(e.target.parentNode.parentNode === textField){
            e.target.parentNode.insertBefore(cursor, e.target);
        } 
        else if(e.target.parentNode === textField){
            e.target.appendChild(cursor);
        }
        else if(e.target === textField){
            e.target.lastElementChild.appendChild(cursor);
        }
    }
})

function exeCode(){
    clean();
    console.log = function(m){
        customConsole.innerHTML = m;
    };
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