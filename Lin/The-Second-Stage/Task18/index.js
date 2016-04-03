/**
 * 封装一个小jquery
 * @param str：要查找的元素
 * @returns {Element}：返回找到的元素
 */
function $(str) {
    return document.querySelector(str);
}

var inputNum = $("#input-num"),
    queue = $("#queue");
//给button按钮添加事件监听
$("#control").onclick = function(event) {
    var target = event.target || window.event.target;

    if(target.tagName.toLowerCase() == "button") {
        operateQueue(target);
    }
};
//给队列中的每个元素添加事件监听
queue.onclick = function(event) {
    var target = event.target || window.event.target;
    if(target.tagName.toLowerCase() == "span") {
        queue.removeChild(target);
    }
};
//操作队列
function operateQueue(target) {
    var operation = {
        "left-in": leftIn,
        "left-out": leftOut,
        "right-in": rightIn,
        "right-out": rightOut
        },
        input;

    operation[target.id]();

    function testInput() {
        input = inputNum.value.trim();
        return (input != "" && input.search(/^\d+$/g) != -1)
    }

    function leftIn() {
        if(!testInput()) {
            return;
        }
        var span = document.createElement("span");
        span.textContent = input;
        queue.insertBefore(span, queue.firstElementChild);
    }

    function leftOut() {
        if(queue.hasChildNodes()) {
            queue.removeChild(queue.firstElementChild);
        }
    }

    function rightIn() {
        if(!testInput()) {
            return;
        }
        var span = document.createElement("span");
        span.textContent = input;
        queue.appendChild(span);
    }

    function  rightOut() {
        if(queue.hasChildNodes()) {
            queue.removeChild(queue.lastElementChild);
        }
    }
}



