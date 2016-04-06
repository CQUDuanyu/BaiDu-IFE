/**
 * 封装一个小jquery
 * @param str：要查找的元素
 * @returns {Element}：返回找到的元素
 */
function $(str) {
    return document.querySelector(str);
}

var inputArea = $("#input-area"),
    queueUI = $("#queue"),
    queueData = [];//用于渲染柱状图的数组数据
//给第一行的button按钮添加事件监听
$("#control").onclick = function(event) {
    var target = event.target || window.event.target;

    if(target.tagName.toLowerCase() == "button") {
        operateQueue(target);
    }
};
//给柱状图的每个元素添加事件监听，使之被点击后可删除
queueUI.onclick = function(event) {
    var target = event.target || window.event.srcElement;
    if(target.tagName.toLowerCase() == "span") {
        var index = Array.prototype.indexOf.call(this.childNodes, target);
        queueData.splice(index, 1);
        render();
    }
};

//操作队列
function operateQueue(target) {
    var operation = {
            "left-in": leftIn,
            "left-out": leftOut,
            "right-in": rightIn,
            "right-out": rightOut,
            "search": search
        },
        input;

    operation[target.id]();
    if(target.id != "search") {
        render();
    }
    //验证输入是否为空
    function testInput() {
        input = inputArea.value.trim();
        return (input != "");
    }
    //handleInput
    function handleInput() {
        input = input.split(/\r|,|，|、|\s|\.|;/g);
    }
    function leftIn() {
        if(!testInput()) {
            return;
        }
        handleInput();
        queueData = input.concat(queueData);
    }

    function leftOut() {
        if(!queueUI.hasChildNodes()) {
            return;
        }
        queueData.shift();
    }

    function rightIn() {
        if(!testInput()) {
            return;
        }
        handleInput();
        queueData = queueData.concat(input);
    }

    function rightOut() {
        if(!queue.hasChildNodes()) {
            return;
        }
        queueData.pop();
    }
    //查询字符，并标识
    function search() {
        var searchContent = document.querySelector("#search-content").value.trim();
        if(searchContent == "") {
            return;
        }
        render();//匹配前，先清除上次匹配后特殊标识
        queueUI.innerHTML = queueUI.innerHTML.replace(new RegExp(searchContent, "g"), "<i>"+searchContent+"</i>");
    }
}
/**
 * 渲染柱状图
 */
function render() {
    var str = "";
    queueData.forEach(function(item) {
        str += "<span>"+item+"</span>";
    });
    queueUI.innerHTML = str;
}


