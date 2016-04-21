/**
 * 定义一个树
 * @param data：根节点的值
 * @constructor：产生一棵树
 */
function Tree(data) {
    this.root = new Node(data);
}
Tree.prototype.contains = function(callback, traverse) {
    traverse.call(this, callback);
};
Tree.prototype.traverseBF = function(callback) {
    var queue = [], result;
    queue.push(this.root);
    var currentNode = queue.shift();
    while(currentNode) {
        for(var i=0; i<currentNode.children.length; i++) {
            queue.push(currentNode.children[i]);
        }
        result = callback(currentNode);
        if(result) {
            break;
        }
        currentNode = queue.shift();
    }
};
Tree.prototype.renderSelf = function() {
    document.querySelector("#container").appendChild(this.root.dom);
};
/**
 * 定义一个节点
 * @param data：节点的值
 * @constructor：创建一个节点对象
 */
function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
    this.dom = this.createDOM();
    this.dom.node = this;
}
Node.prototype.addChild = function(child) {
    this.children.push(child);
    if(child instanceof Node) {
        child.parent = this;
    }
    this.dom.querySelectorAll(".children-container")[0].appendChild(child.dom);
    this.dom.firstElementChild.firstElementChild.classList.remove("empty-arrow");
    this.dom.firstElementChild.firstElementChild.classList.add("to-down");
};

Node.prototype.createDOM = function() {
    var div, label, span, childrenContainer;
    div = document.createElement("div");
    div.classList.add("node");
    label = document.createElement("label");
    span = document.createElement("span");
    span.classList.add("arrow");
    span.classList.add("empty-arrow");
    label.appendChild(span);
    span = document.createElement("span");
    span.classList.add("value");
    span.innerHTML = this.data;
    label.appendChild(span);
    div.appendChild(label);
    childrenContainer = document.createElement("div");
    childrenContainer.classList.add("children-container");
    div.appendChild(childrenContainer);

    return div;
};


function handleAdd() {
    var value = document.querySelector("#search-content").value.trim();
    if(value !== "" && selectedNode !== null) {
        selectedNode.node.addChild(new Node(value));
    }
}

function handleDelete() {
    if(selectedNode === null) {
        return;
    }
    //从树中先删除该节点,这个地方做不好，应该让别删除节点的每个后代节点都变为null,以便于垃圾回收
    var node = selectedNode.node;
    node.parent.children.splice(node.parent.children.indexOf(node), 1);
    //从dom中删除
    selectedNode.parentNode.removeChild(selectedNode);
    //如果没有子元素就去掉箭头
    if(node.parent.children.length === 0) {
        node.parent.dom.firstElementChild.firstElementChild.classList.remove("to-down");
        node.parent.dom.firstElementChild.firstElementChild.classList.add("empty-arrow");
    }

    node = null;
}

var selectedNode = null;
//==========程序入口====================
window.onload = function() {
    //============================先渲染一个DOM树========
    var tree = new Tree("爱好"),
        tech = new Node("技术"),
        front = new Node("前端"),
        nodeJS = new Node("nodeJS"),
        music = new Node("音乐"),
        song1 = new Node("花房姑娘");

    tree.root.addChild(tech);
    tree.root.addChild(music);
    tech.addChild(front);
    tech.addChild(nodeJS);
    music.addChild(song1);
    tree.renderSelf();
    //============绑定各种事件============
    var container = document.querySelector("#container"),
        addNode = document.querySelector("#add-node"),
        deleteNode = document.querySelector("#delete-node"),
        searchNode = document.querySelector("#search-node");
    //点击树，相应的node会变成紫色
    container.onclick = function() {
        var previous = null;
        return function() {
            var target = arguments[0].target,
                previousElement = null;
            if(selectedNode) {
                selectedNode.firstElementChild.querySelectorAll(".value")[0].style.backgroundColor = "";
                //selectedNode = null;
            }

            if(target.className !== "value") {
                return;
            }
            if(previous !== null) {
                if(previous === target && !target.previousElementSibling.classList.contains("empty-arrow")) {
                    //双击展开或隐藏，并改变箭头方向
                    previousElement = target.previousElementSibling;
                    previousElement.classList.toggle("to-right");
                    previousElement.classList.toggle("to-down");
                    target.style.backgroundColor = "#ccf";
                    target.parentNode.nextElementSibling.classList.toggle("hidden");
                    return;
                } else {
                    previous.style.backgroundColor = "";
                }
            }
            target.style.backgroundColor = "#ccf";
            previous = target;
            selectedNode = target.parentNode.parentNode;
        };
    }();
    //搜索按钮事件
    searchNode.onclick = function() {
        var searchContent = document.querySelector("#search-content").value.trim(),
            isExist = false;
        if(searchContent !== "") {
            tree.traverseBF(function(node) {
                if(node.data === searchContent) {
                    if(selectedNode) {
                        selectedNode.firstElementChild.querySelectorAll(".value")[0].style.backgroundColor = "";
                    }
                    node.dom.firstElementChild.querySelectorAll(".value")[0].style.backgroundColor = "#ccf";
                    selectedNode = node.dom;
                    while(node.parent) {
                        node.dom.parentNode.classList.remove("hidden");
                        node.parent.dom.firstElementChild.firstElementChild.classList.remove("to-right");
                        node.parent.dom.firstElementChild.firstElementChild.classList.add("to-down");
                        node = node.parent;
                    }
                    isExist = true;
                }
            });
            if(!isExist) {
                alert("您要查找的不存在！");
                isExist = false;
            }
            return true;
        }
        return false;
    };
    //增加按钮事件
    addNode.addEventListener("click", handleAdd, false);
    //删除按钮事件
    deleteNode.addEventListener("click", handleDelete, false);

};

