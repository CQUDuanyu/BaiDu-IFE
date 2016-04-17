
window.onload = function() {
    var traverseDFButton = document.querySelector("#traverseDF"),
        traverseBFButton = document.querySelector("#traverseBF"),
        root = document.querySelector("#root"),
        deleteNode = document.querySelector("#delete"),
        addNode = document.querySelector("#add-node");

    traverseDFButton.addEventListener("click", function() {
        traverseDF(root);
        traverseProcess.push(root);
        animation();
    }, false);
    traverseBFButton.addEventListener("click", function() {
        traverseBF(root);
        animation();
    }, false);
    root.addEventListener("click", handleClick, false);
    deleteNode.addEventListener("click", handleDelete, false);
    addNode.addEventListener("click", handleAdd, false);
};

var traverseProcess = [],
    selectedNode = null;
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
/**
 * 鼠标点击node改变背景色
 */
function handleClick() {
    var target = arguments[0].target || window.event.srcElement;
    if(selectedNode) {
        selectedNode.style.backgroundColor = "";
    }
    target.style.backgroundColor = "#ccf";
    selectedNode = target;
}
/**
 * 删除选中的node
 */
function handleDelete() {
    if(selectedNode !== null) {
        selectedNode.parentNode.removeChild(selectedNode);
        selectedNode = null;
    }
}
/**
 * 添加节点
 */
function handleAdd() {
    var addInput = document.querySelector("#add-content"),
        addContent = addInput.value.trim(),
        child = null;
    if(selectedNode !== null && addContent !== "") {
        child = document.createElement("div");
        child.className = "added";
        child.innerHTML = addContent;
        selectedNode.appendChild(child);

        selectedNode.style.backgroundColor = "";
        child.style.backgroundColor = "#ccf";
        selectedNode = child;
        addInput.value = "";
    }
}
/**
 * 根据遍历过程traverseProcess进行动画展示
 */
function animation() {
    var timer, head = null,
        buttonList = document.querySelectorAll("button"),
        searchContent = document.querySelector("#search-content").value.trim();
    if(selectedNode !== null) {
        selectedNode.style.backgroundColor = "";//上一个变色的，恢复颜色
    }
    buttonState(buttonList, true);
    show();
    function show() {
        head = traverseProcess.shift();//出队
        if(head) {
            if(head.firstChild.nodeValue.trim() === searchContent) {
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
            if(searchContent !== "") {
                alert("没有找找到 " + searchContent);
            }
        }
    }
}

//控制按钮状态，动画进行时，按钮不可用
function buttonState(buttonList, state) {
    for(var i=0; i<buttonList.length; i++) {
        buttonList[i].disabled = state;
    }
}