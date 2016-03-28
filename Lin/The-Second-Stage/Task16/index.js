/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityInput = document.getElementById("aqi-city-input"),
        aqiInput = document.getElementById("aqi-value-input"),
        cityError = document.getElementById("city-error"),
        aqiError = document.getElementById("aqi-error"),
        city = cityInput.value.trim(),
        aqi = aqiInput.value.trim();
    //检验输入是否合法
    if(!isInputLegal(city, aqi)){
        return;
    }
    //验证合法则清除所有错误提示
    cityError.innerHTML = "";
    aqiError.innerHTML = "";
    //存入aqiData
    aqiData[city] = aqi;
    //清空input的内容
    cityInput.value = "";
    aqiInput.value = "";

    renderAqiList(city);//渲染table
}
/**
 * 判断输入是否合法：1、输入不能为空；2、city必须为中文或英文；3、aqi必须为正整数；4.输入城市已存在
 * @param city：输入的城市名
 * @param aqi：输入的aqi值
 * 输入合法返回true，输入不合法则返回false
 */
function isInputLegal(city, aqi) {

    var result = true,//要返回的结果
        cityError = document.getElementById("city-error"),
        aqiError = document.getElementById("aqi-error");
    //检验输入的城市是否已在aqiData中存在
    if(aqiData[city]) {
        cityError.innerHTML = "该城市已存在请重新输入";
        result = false;
    }
    //city不能为空且必须由中文或英文组成
    if(city.search(/^[a-zA-Z]+$|^[\u4e00-\u9fa5]+$/g) == -1) {
        cityError.innerHTML = "城市名字不能为空且只能由中文或英文组成";
        result = false;
    }
    //aqi不能为空且只能为正整数
    if(aqi.toString().search(/^[0-9]+$/g) == -1) {
        aqiError.innerHTML = "输入的aqi不能为空切只能为正整数";
        result = false;
    }
    return result;
}
/**
 * 渲染aqi-table表格
 * @param para：para如果为字符串，则要插入行；如果为数字，则说明要删除相应的行
 */
function renderAqiList(para) {
    var paraCons = para.constructor,
        aqiTable = document.getElementById("aqi-table");

    if(paraCons == String) {
        //插入行
        aqiTable.innerHTML += "<tr><td>"+para+"</td><td>"+aqiData[para]+"</td><td><button>删除</button></td></tr>";
    } else if(paraCons == Number) {
        //删除行
        aqiTable.deleteRow(para);
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */

function addBtnHandle() {
    addAqiData();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    var event = arguments[0] || window.event;
    event.stopPropagation();
    var target = event.target;
    if(target.tagName.toLowerCase() == "button") {
        var tr = target.parentNode.parentNode;
        renderAqiList(tr.rowIndex);
    }
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById("add-btn").onclick = addBtnHandle;

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    document.getElementById("aqi-table").onclick = delBtnHandle;
}

init();