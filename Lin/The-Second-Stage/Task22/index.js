window.onload = function() {
    var root = document.querySelectorAll(".root")[0],
        dlr = document.querySelector("#dlr"),
        ldr = document.querySelector("#ldr"),
        lrd = document.querySelector("#lrd");

    dlr.addEventListener("click", handleClick, false);
    ldr.addEventListener("click", handleClick, false);
    lrd.addEventListener("click", handleClick, false);
    //处理按钮的点击事件
    function handleClick() {
        var target = arguments[0].target || window.event.srcElement;
        buttonState(true);
        switch (target.id) {
            case "dlr":
                perOrder(root);
                break;
            case "ldr":
                inOrder(root);
                break;
            case "lrd":
                postOrder(root);
                break;
            default:
                alert("没有该遍历方式");
        }
        animation();
    }

};
//依照遍历顺序储存遍历的节点
var traverseProcess = [];
//设置按钮的状态，当演示动画时，按钮不可用
function buttonState(disabled) {
    var button = document.querySelector("#button"),
        element = button.firstElementChild;
    while(element) {
        element.disabled = disabled;
        element = element.nextElementSibling;
    }
}
//先序遍历
function perOrder(node) {
    if(node !== null) {
        traverseProcess.push(node);
        perOrder(node.firstElementChild);
        perOrder(node.lastElementChild);
    }
}
//中序遍历
function inOrder(node) {
    if(node !== null) {
        inOrder(node.firstElementChild);
        traverseProcess.push(node);
        inOrder(node.lastElementChild);
    }
}
//后续遍历
function postOrder(node) {
    if(node !== null) {
        inOrder(node.firstElementChild);
        inOrder(node.lastElementChild);
        traverseProcess.push(node);
    }

}
//动画
function animation() {
    var index = 0,
        timer, previous = null;
    show();
    function show() {
        if(traverseProcess[index] === undefined) {
            clearTimeout(timer);
            traverseProcess = [];
            previous.style.backgroundColor = "#fff";
            buttonState(false);
            return;
        }
        if(previous !== null) {
            previous.style.backgroundColor = "#fff";
        }
        traverseProcess[index].style.backgroundColor = "blue";
        timer = setTimeout(show, 500);
        previous = traverseProcess[index];
        index++;
    }
}

