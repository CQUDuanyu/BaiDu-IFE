function $(str) {
    return document.querySelector(str);
}

var tag = $("#tag"),
    tagList = $("#tag-list"),
    hobby = $("#hobby"),
    confirmHobby = $("#confirm-hobby"),
    hobbyList = $("#hobby-list"),
    displayArr = [];


tag.addEventListener("keyup", showTagList, false);
tagList.addEventListener("mouseover", deletTag, false);
tagList.addEventListener("mouseout", deletTag, false);
tagList.addEventListener("click", deletTag, false);
confirmHobby.addEventListener("click", showHobby, false);


function  showTagList() {
    var event = arguments[0] || window.event,
        keyCode = event.keyCode,
        keyCodeArr = [32, 13, 188, 229],
        input, length, span,
        fragment = document.createDocumentFragment();

    if(keyCodeArr.indexOf(keyCode) === -1) {
        return;
    }
    input = this.value.trim().replace(/,/g, "");

    if(displayArr.indexOf(input) !== -1 || input==="") {
        tag.value = "";
        return;
    }

    length = displayArr.push(input);
    if(length > 10) {
        displayArr.shift();
    }
    tagList.innerHTML = "";
    displayArr.forEach(function(item) {
        span = document.createElement("span");
        span.innerHTML = item;
        fragment.appendChild(span);
    });
    tagList.appendChild(fragment);
    tag.value = "";
}

function deletTag() {
    var event = arguments[0] || window.event,
        target = event.target || event.srcElement;

    if(target.tagName.toLowerCase() === "span") {
        if(event.type === "mouseover") {
            handleMouseover();
        }else if(event.type === "mouseout"){
            handleMouseout();
        }else if(event.type==="click"){
            handleClick();
        }
    }


    function handleMouseover() {
        target.innerHTML = "删除" + target.innerHTML;
    }

    function handleMouseout() {
        target.innerHTML = target.innerHTML.replace(/删除/, "");
    }

    function handleClick() {
        var index = Array.prototype.indexOf.call(tagList.querySelectorAll("span"), target);
        console.log(index);
        tagList.removeChild(target);
        displayArr.splice(index, 1);
    }
}
/**
 * 数组去重，去空字符
 * @param arr：待处理的数组
 * @returns {Array}：返回处理后的数组
 */
function unique(arr) {
    var newArr = [];
    arr.forEach(function(item, index) {
        if(item !== "" && newArr.indexOf(item)==-1) {
            newArr.push(item);
        }
    });
    return newArr;
}

function showHobby() {
    var inputHobby = hobby.value.trim();
    if(inputHobby==="") {
        return;
    }
    var hobbyArr = inputHobby.split((/\r|,|，|、|\s+|\.|;/g)),
        arr = [], span,
        fragment = document.createDocumentFragment();
    //hobbyArr = unique(hobbyArr);
    hobbyList.innerHTML = "";
    hobbyArr.forEach(function(item) {
        if(arr.indexOf(item)==-1) {
            arr.push(item);
            span = document.createElement("span");
            span.innerHTML = item;
            fragment.appendChild(span);
        }
    });
    hobbyList.appendChild(fragment);
    hobby.value = "";
}



