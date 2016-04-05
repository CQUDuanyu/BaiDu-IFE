/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 var charData = {
    "day":[
        ["2016-01-01", 100],
        ["2016-01-02", 100],
        ["2016-01-03", 100]
    ],
    "week":[
        ["第1周", 100],
        ["第2周", 100],
        ["第3周", 100]
    ],
    "month":[
        ["1月", 100],
        ["2月", 100]
    ]
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
    var datStr = ''
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

//chartData中的属性值必须为数组，不能为对象，因为for..in遍历对象时具有无序性，而此柱状图必须从左
//到右按照时间顺序排列，因此必须用数组
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
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
    chartData[pageState.nowGraTime].forEach(function(item, index, arr) {
        div = document.createElement("div");
        div.className = "stretch";
        div.title = item[0] + "："+item[1];
        div.style.height = item[1] + "px";
        div.style.width = (Math.floor(1000/arr.length - 2)>70?100:Math.floor(1000/arr.length - 2)) + "px";
        div.style.opacity = item[1]/1000 + 0.5;
        div.style.backgroundColor = "#f00";
        fragment.appendChild(div);
    });
    chart.appendChild(fragment);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var formGraTime = document.querySelector("#form-gra-time"),
        radioList = formGraTime.querySelectorAll("input[name='gra-time']");

    for(var i=0; i<radioList.length; i++) {
        if(radioList[i].checked) {
            pageState.nowGraTime = radioList[i].value;
            break;
        }
    }

    formGraTime.onclick = function(event) {
        var target = event.target || window.event.srcElement;
        if(target.tagName.toLowerCase() == "input" && target.value != pageState.nowGraTime) {
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
    citySelect.onchange = function(event) {
        var target = event.target || window.event.srcElement;
        pageState.nowSelectCity = target.selectedIndex;
        citySelectChange();
    }
}

/**
 * 初始化图表需要的数据格式；只有在选择不同的城市时会初始化chartData，
 * 初始化过程会把天、周、月的数据全部放入chartData，这比每次单独计算各个数据减少了遍历源数据的次数
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式，dayData,weekData,monthData分别存储天、周、月的数据
    //originalData为根据所选城市而获得的原始数据
    var dayData = [], weekData = [], monthData = [],
        city = document.querySelector("#city-select"),
        originalData = aqiSourceData[city.options[pageState.nowSelectCity].value];
    //在generateDayData()中会产生一个monthDataObj,再在generateMonthData中，把monthDataObj
    //变成数组，即monthData
    var monthDataObj = {};

    function generateDayData() {
        var index = 0, str;
        for(var data in originalData) {
            dayData[index] = [];
            dayData[index].push(data);
            dayData[index].push(originalData[data]);
            index++;

            str = (new Date(data).getMonth()+1) + "月";
            if(!monthDataObj[str]) {
                monthDataObj[str] = [];
            }
            monthDataObj[str].push(originalData[data]);
        }
        dayData.sort(function(value1, value2) {
            if(value1[0]<value2[0]) {
                return -1;
            }
            return 1;
        });
    }
    function generateMonthData() {
        var monthAverage, index = 0;

        for(var month in monthDataObj) {
            monthAverage = (monthDataObj[month].reduce(function(pre, cur) {
                    return pre+cur;
                }))/monthDataObj[month].length;
            monthData[index] = [];
            monthData[index].push(month);
            monthData[index].push(Math.round(monthAverage));
            index++;
        }
    }

    function generateWeekData() {
        var count = 0,
            sum = 0,
            weekNum = 0;
        dayData.forEach(function(item, index, arr) {
            count++;
            sum += item[1];
            if(new Date(item[0]).getDay() == 0) {
                weekData[weekNum] = [];
                weekData[weekNum].push("第"+(weekNum+1)+"周");
                weekData[weekNum].push(Math.round(sum/count));
                count = 0;
                sum = 0;
                weekNum++;
            }


        });
        if(new Date(dayData[dayData.length-1][0]).getDay() != 0) {
            weekData[weekNum] = [];
            weekData[weekNum].push("第"+(weekNum+1)+"周");
            weekData[weekNum].push(Math.round(sum/count));
        }
    }
    //调用相应的函数，产生数据
    generateDayData();
    generateMonthData();
    generateWeekData();
    // 处理好的数据存到 chartData 中
    chartData["day"] = dayData;
    chartData["week"] = weekData;
    chartData["month"] = monthData;
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();

    renderChart();
}

init();
