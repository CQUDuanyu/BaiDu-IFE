window.onload = function() {
    var inputList = document.querySelectorAll("input");
    bindListener(inputList);
    document.querySelector("#submit").addEventListener("click", handleSubmit, false);
};
var prompts = {
    account: {
        suc: "账号可用",
        err: "账号必须为4~16字符"
    },
    password01: {
        suc: "密码可用",
        err: "密码必须为4~12个字符"
    },
    password02: {
        suc: "密码输入一致",
        err: "两次密码输入不一致"
    },
    email: {
        suc: "邮箱可用",
        err: "邮箱格式错误"
    },
    phoneNum: {
        suc: "手机号格式正确",
        err: "手机号格式错误"
    }
};
var isOK = false;
function bindListener(inputList) {
    for(var i=0; i<inputList.length; i++) {
        inputList[i].addEventListener("focus", handleFocus, false);
        inputList[i].addEventListener("blur", handleBlur, false);
    }
}

function handleFocus() {
    this.style.borderColor = "#ccf";
    this.nextElementSibling.style.display = "block";
}

function handleBlur() {
    var id = this.id,
        flag = false,
        value = this.value.trim(),
        prompt = this.nextElementSibling;
    switch(id) {
        case "account":
            flag = /^[a-zA-Z0-9_]{4,16}$/.test(value);
            break;
        case "password01":
            flag = /^[a-zA-Z0-9_~!@#$%^&*]{4,12}$/.test(value);
            break;
        case "password02":
            flag = (document.querySelector("#password01").value.trim() === value);
            break;
        case "email":
            flag = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
            break;
        case "phoneNum":
            flag = /^1[0-9]{10}$/.test(value);
            break;
    }
    if(!flag) {
        prompt.innerHTML = prompts[this.id].err;
        prompt.style.color = "#f00";
        this.style.borderColor = "#f00";
        isOK = false;
    } else{
        prompt.innerHTML = prompts[this.id].suc;
        prompt.style.color = "#0f0";
        this.style.borderColor = "#0f0";
        isOK = true;
    }
}

function handleSubmit() {
    /*var inputList = document.querySelectorAll("input");
    for(var i=0; i<inputList.length; i++) {
        inputList[i].focus();
        inputList[i].blur();
    }*/
    if(!isOK) {
        window.alert("填写有误，请仔细核对！");
    } else{
        window.alert("提交成功！");
    }
}