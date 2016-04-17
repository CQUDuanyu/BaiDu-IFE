/**
 * 程序入口
 */
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
    var timer, head = null;
    show();
    function show() {
        head = traverseProcess.shift();//出队
        if(head) {
            head.style.backgroundColor = "#ccf";//显示紫色
            timer = setTimeout(function() {
                head.style.backgroundColor = "#fff";//600ms显示紫色
                show();//递归调用，要显示的节点不停的出队，知道出完为止
            }, 600);
        }else {
            buttonState(false);//出队结束后，按钮恢复可用
        }
    }
}

