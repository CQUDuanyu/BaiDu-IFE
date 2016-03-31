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
var chartData = {};

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
    for(var data in chartData) {
        div = document.createElement("div");
        div.className = "histogram";
        div.style.height = chartData[data] + 'px';
        div.style.backgroundColor = generateColor();
        fragment.appendChild(div);
    }
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
    //初始化时，判断哪个按钮已经被选中
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
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var handler = {
        "day": handleDay,
        "week": handleWeek,
        "month": handleMonth
    };
    var city = document.querySelector("#city-select"),
        originalData = aqiSourceData[city.options[pageState.nowSelectCity].value];

    //按天展示数据
    function handleDay() {
        chartData = originalData;
    }
    //按星期展示数据
    function handleWeek() {
        var weekDate = null,
            date = null,
            dateArr = [],
            count = 0,
            sum = 0;
        for(var data in originalData) {
            dateArr.push(data);
        }
        dateArr.sort();
        for(var i=0; i<dateArr.length; i++) {
            count += 1;
            sum += originalData[dateArr[i]];
            if(new Date(dateArr[i]).getDay() == 0) {
                chartData[i] = Math.round(sum/count);
                count = 0;
                sum = 0;
            }
        }
        if(new Date(dateArr.length-1).getDay() != 0) {
            chartData[i] = Math.round(sum/count);
        }
    }
    //按月展示数据
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
    chartData = {};
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

