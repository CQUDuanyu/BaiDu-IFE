
window.onload = function() {
    var traverseDFButton = document.querySelector("#traverseDF"),
        traverseBFButton = document.querySelector("#traverseBF"),
        root = document.querySelector("#root");

    traverseDFButton.addEventListener("click", function() {
        traverseDF(root);
        traverseProcess.push(root);
        animation();
    }, false);
    traverseBFButton.addEventListener("click", function() {
        traverseBF(root);
        animation();
    }, false);
};

var traverseProcess = [],
    found = null;
/**
 * 深度优先遍历
 * @param node：要遍历的节点
 */
function traverseDF(node) {
    var element = null;
    if(node.childElementCount !== 0) {
        element = node.firstElementChild;
        while(element) {
            traverseDF(element);
            traverseProcess.push(element);
            element = element.nextElementSibling;
        }
    }
}
/**
 * 广度优先遍历
 * @param node：要遍历的节点
 */
function traverseBF(node) {
    var queue = [], element = node;
    traverseProcess.push(node);
    while(element) {
        for(var i=0; i<element.childNodes.length; i++) {
            if(element.childNodes[i].nodeType === 1) {
                queue.push(element.childNodes[i]);
                traverseProcess.push(element.childNodes[i]);
            }
        }
        element = queue.shift();//出队
    }
}
//动画
function animation() {
    var timer, head = null,
        buttonList = document.querySelectorAll("button"),
        searchContent = document.querySelector("#search-content");
    if(found !== null) {
        found.style.backgroundColor = "";
    }
    buttonState(buttonList, true);
    show();
    function show() {
        head = traverseProcess.shift();//出队
        if(head) {
            if(head.firstChild.nodeValue.trim() === searchContent.value.trim()) {
                head.style.backgroundColor = "#ccf";
                buttonState(buttonList, false);
                found = head;
                traverseProcess = [];
            } else{
                head.style.backgroundColor = "#ccf";//显示紫色
                timer = setTimeout(function() {
                    head.style.backgroundColor = "";//600ms显示白色
                    show();//递归调用，要显示的节点不停的出队，知道出完为止
                }, 600);
            }
        }else {
            buttonState(buttonList, false);//出队结束后，按钮恢复可用
        }
    }
}

//控制按钮状态，动画进行时，按钮不可用
function buttonState(buttonList, state) {
    for(var i=0; i<buttonList.length; i++) {
        buttonList[i].disabled = state;
    }
}