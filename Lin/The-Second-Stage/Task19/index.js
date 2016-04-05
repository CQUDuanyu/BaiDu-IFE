/**
 * 封装一个小jquery
 * @param str：要查找的元素
 * @returns {Element}：返回找到的元素
 */
function $(str) {
    return document.querySelector(str);
}

var inputNum = $("#input-num"),
    queueUI = $("#queue"),//柱状图
    queueData = [],//用于渲染柱状图的数组数据
    sortCollection = [],//用于展示排序过程的数据
    index = 0,
    timer;
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
            "right-out": rightOut
        },
        input;

    operation[target.id]();
    //验证输入是否合法
    function testInput() {
        input = inputNum.value.trim();
        return (input.search(/^\d+$/g) != -1 && input>=10 && input<=100)
    }

    function leftIn() {
        if(!testInput()) {
            return;
        }
        queueData.unshift(input);
        render();
    }

    function leftOut() {
        if(queueUI.hasChildNodes()) {
            queueData.shift();
            render();
        }
    }

    function rightIn() {
        if(!testInput()) {
            return;
        }
        queueData.push(input);
        render();
    }

    function rightOut() {
        if(queue.hasChildNodes()) {
            queueData.pop();
            render()
        }
    }
}
/**
 * 渲染柱状图
 */
function render() {
    var str = "";
    queueData.forEach(function(item) {
        str += "<span style='height: "+item*2+"px"+"'>"+item+"</span>";
    });
    queueUI.innerHTML = str;
}
/**
 * 产生随机数组
 * @param elementsNum：随机数组的长度
 */
function generateArr(elementsNum) {
    for(var i=0; i<elementsNum; i++) {
        queueData[i] = Math.ceil(Math.random()*100);
        queueData[i] = queueData[i]<10? queueData[i]+10: queueData[i];
    }
}
/**
 * 交换数组中两个元素的位置
 * @param arr：要操作的数组
 * @param index1
 * @param index2
 */
function swap(arr, index1, index2) {
    var temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}
/**
 * 根据排序算法的过程渲染柱状图，从而展现出排序的过程
 */
var mask = document.querySelector("#mask");
function show() {
    if(mask.className == "hidden") {
        mask.className = "";
    }
    queueData = sortCollection[index++];
    render();
    if(index == sortCollection.length) {
        clearTimeout(timer);
        mask.className = "hidden";
        return;
    }
    timer = setTimeout(show, 10);
}
/**
 * 重置数据
 */
function reset() {
    sortCollection = [];
    index = 0;
}
//产生随机数组
document.querySelector("#generate-arr").onclick = function() {
    var elementsNum = 50;
    for(var i=0; i<elementsNum; i++) {
        queueData[i] = Math.ceil(Math.random()*100);
        queueData[i] = queueData[i]<10? queueData[i]+10: queueData[i];
    }
    render();
};
//冒泡排序
document.querySelector("#bubble-sort").onclick = function() {
    reset();
    var arr = queueData.concat();//先创建一个源数据的副本
    for(var outer=arr.length; outer>=2; outer--) {
        for(var inner=0; inner<outer-1; inner++) {
            if(arr[inner] > arr[inner+1]) {
                swap(arr, inner, inner+1);
                sortCollection.push(arr.concat());//每次必须创建一个副本，否则push的都是同一个arr
            }
        }
    }
    console.log("bubble-->" + sortCollection.length);
    if(sortCollection.length > 0) {
        show();
    }
};
//选择排序
document.querySelector("#selection-sort").onclick = function() {
    reset();
    var arr = queueData.concat();
    for(var outer=0; outer<arr.length-1; outer++) {
        for(var inner=outer+1; inner<arr.length; inner++) {
            if(arr[outer] > arr[inner]) {
                swap(arr, outer, inner);
                sortCollection.push(arr.concat());//每次必须创建一个副本，否则push的都是同一个arr
            }
        }
    }
    console.log("selection-->" + sortCollection.length);
    if(sortCollection.length > 0) {
        show();
    }
};
//插入排序
document.querySelector("#insertion-sort").onclick = function() {
    reset();
    var arr = queueData.concat(),
        inner;
    for(var outer=1; outer<arr.length; outer++) {
        inner = outer;
        while(inner>0 && arr[inner] < arr[inner-1]) {
            swap(arr, inner, inner-1);
            sortCollection.push(arr.concat());
            inner--;
        }
    }
    console.log("insertion-->" + sortCollection.length);
    if(sortCollection.length > 0) {
        show();
    }
};
//快速排序，因为是递归调用，能力有限做不出可视化了
document.querySelector("#quick-sort").onclick = function() {
    reset();
    var arr = queueData.concat();
    function qSort(list) {
        if(list.length == 0) {
            return [];
        }
        var lesser = [],
            greater = [],
            pivot = list[0];
        for(var i=1; i<list.length; i++) {
            if(list[i] < pivot) {
                lesser.push(list[i]);
            } else {
                greater.push(list[i]);
            }
        }
        sortCollection.push(lesser.concat(pivot,greater));
        return qSort(lesser).concat(pivot, qSort(greater));
    }
    queueData = qSort(arr);
    render();
};

