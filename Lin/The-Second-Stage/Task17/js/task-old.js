/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = [];

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: ""
};

/**
 * 渲染图表
 */
function renderChart() {
    var chart = document.getElementById("aqi-chart-wrap"),
        fragment = document.createDocumentFragment(),
        div;
    //每次重绘都得清空图表
    if(chart.hasChildNodes()) {
        chart.innerHTML = "";
    }
    //插入div表示的柱状图
    chartData.forEach(function(item, index, arr) {
        div = document.createElement("div");
        div.className = "histogram";
        div.style.height = item[1] + "px";
        div.style.backgroundColor = generateColor();
        fragment.appendChild(div);
    });
    chart.appendChild(fragment);
    /**
     * 随机产生颜色
     * @returns {string} 返回#ffffff格式的颜色代码
     */
    function generateColor() {
        var color;
        color = Math.ceil(Math.random()*parseInt("ffffff", 16)).toString(16);
        return "#"+color;
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    //初始化chartData
    initAqiChartData();
    //渲染图表
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var target = arguments[0].target || window.event.target;
    pageState.nowSelectCity = target.selectedIndex;
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */

function initGraTimeForm() {
    //页面渲染完毕时，判断哪个按钮已经被选中，初始化pageState
    var radioArr  = document.querySelector("#form-gra-time").querySelectorAll("input[name='gra-time']");
    for(var i=0; i<radioArr.length; i++) {
        if(radioArr[i].checked) {
            pageState.nowGraTime = radioArr[i].value;
            break;
        }
    }
    //给三个radio按钮绑定单击事件
    document.getElementById("form-gra-time").onclick = function(event) {
        var target = event.target || window.event.target;
        //满足两个条件：1、单击的是radio；2、单击的radio和pageState中的不一样。就调用graTimeChange()函数
        if(target.tagName.toLowerCase() == "input" && target.value != pageState.nowGraTime) {
            //更改pageState，并调用响应函数
            pageState.nowGraTime = target.value;
            graTimeChange();
        }
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var fragment = document.createDocumentFragment(),
        citySelect = document.getElementById("city-select"),
        option;
    for(var city in aqiSourceData) {
        option = document.createElement("option");
        option.value = city;
        option.innerHTML = city;
        fragment.appendChild(option);
    }
    citySelect.appendChild(fragment);
    //初始化pageState
    pageState.nowSelectCity = citySelect.selectedIndex;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelect.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式,处理好的数据存到 chartData 中
 */
function initAqiChartData01() {
    //handler根据所选的radio处理day,week或month数据
    var handler = {
        "day": handleDay,
        "week": handleWeek,
        "month": handleMonth
    };
    var city = document.querySelector("#city-select"),
        //根据所选的城市从aqiSourceData中获得原始的数据orginalData
        originalData = handleOriginData(aqiSourceData[city.options[pageState.nowSelectCity].value]);
    //处理根据城市从aqiSource拿到的数据，因为遍历对象属性石有无序性，所以把拿到的数据按时间排成数组
    function handleOriginData(originalData) {
        var handledData = [],
            index = 0;
        for(var data in originalData) {
            handledData[index] = [];
            handledData[index].push(data);
            handledData[index].push(originalData[data]);
            index++;
        }
        handledData.sort(function(value1, value2) {
            if(value1[0]<value2[0]) {
                return -1;
            }
            return 1;
        });

        return handledData;
    }

    //处理按天展示的数据。不用处理，直接把源数据拿过来就可以
    function handleDay() {
        chartData = originalData;
    }

    /**
     * 处理按星期展示的数据，因为originalData是一个对象，而对象的属性是没有顺序的,
     * 所以for..in输出的属性名顺序是不可预测的，因此用dateArr数组按顺序填装originalData中的属性，即日期。
     * 这样才能确保正确地计算每周的平均值
     */
    function handleWeek() {

        var count = 0,
            sum = 0,
            weekNum = 0;
        originalData.forEach(function(item, index, arr) {
            count++;
            sum += item[1];
            if(new Date(item[0]).getDay() == 0) {
                chartData[weekNum] = [];
                chartData[weekNum].push("第"+(weekNum+1)+"周");
                chartData[weekNum].push(Math.round(sum/count));
                count = 0;
                sum = 0;
                weekNum++;
            }
        });
        if(new Date(originalData[originalData.length-1][0]).getDay() != 0) {
            chartData[weekNum] = [];
            chartData[weekNum].push("第"+(weekNum+1)+"周");
            chartData[weekNum].push(Math.round(sum/count));
        }
        console.log(chartData);
    }

    /**
     * 处理按月展示的数据;field表示chartData中的属性，monthDta以数组的方式
     */
    function handleMonth() {
        var field,
            monthData,
            monthAverage;
        for(var data in originalData) {
            field = (new Date(data).getMonth()+1) + "月";
            if(!chartData[field]) {
                chartData[field] = [];
            }
            chartData[field].push(originalData[data]);
        }

        for(var month in chartData) {
            monthData = chartData[month];
            monthAverage = (monthData.reduce(function(pre, cur) {
                    return pre+cur;
                }))/monthData.length;
            chartData[month] = Math.round(monthAverage);
        }

    }
    chartData = [];
    handler[pageState.nowGraTime]();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    //初始化页面时，渲染默认的柱状图
    renderChart();
}

init();

