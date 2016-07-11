function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function saveCookie() {
    var tmpuser = document.getElementById("keyinUser").value;
    var tmppwd = document.getElementById("keyinPwd").value;
    setCookie('user', tmpuser, 365);
    // console.log("SAVE : "+tmpuser);
    setCookie('pwd', tmppwd, 365);
    // console.log("SAVE : "+tmppwd);
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString())

}

function checkCookie() {
    var user = getCookie('user');
    // console.log(user);
    var pwd = getCookie('pwd');
    // console.log(pwd);
    var loginResult = login(user, pwd);
    if (loginResult === "200") {
        $("#user").append(user);
        return "200";
    } else {
        alert("Wrong Username or Password !!");
        document.location = "login.html";
        return "";
    }
}

function eraseCookie() {
    setCookie('user', "", 365);
    setCookie('pwd', "", 365);
    setCookie('cname', "", 365);
    setCookie('curl', "", 365);
    setCookie('mac', "", 365);
    setCookie('redirect', "", 365);
    setCookie('time', "", 365);
    setCookie('allContent', "", 365);
    console.log("eraseCookie");
    document.location = "login.html";
}

function indexEnter() {
    if (checkCookie() === "200") {
        getAllMachine();
    }
}

function statusEnter() {
    if (checkCookie() === "200") {
        var MachineName = getCookie('cname');
        var url = getCookie('curl');
        var mac = getCookie('mac');
        var redirect = getCookie('redirect');
        var time = getCookie('time');
        lastActiveTime(MachineName);
        console.log(MachineName + ":" + url + ":" + mac + ":" + time);
        if (redirect === "false") {
            redirect = "No"
        } else {
            redirect = "Yes"
        }
        $("#macAddr").append(mac);
        $("#redirect").append(redirect);
        $("#Machinename").append(MachineName);
        $("li#Machinename").append(MachineName);
        $("#time").val(time);
        $("#curl").val(url);
        $("#link").append("<a href='" + url + "' target='_blank'>" + "  link" + "</a>");
        $("#iFramePhone").attr('src', url);
        $('#inputUser').val(MachineName);
        display_ct();
    }
}

function updateUrl() {
    var url = $('#curl').val();
    if ($('.error').css('display') == 'none' || $('.error').length == 0 && url.length != 0) {
        if (confirm("Are you sure change AD url?\n" + "Your url : " + url)) {
            var MachineName = getCookie('cname');
            setPageUrl(MachineName, url);
            getAllMachine();
            saveStatusCookie(MachineName);
            document.location = "status.html";
        }
    } else {
        alert("Wrong URL !");
    }
}

function updateTime() {
    var time = $('#time').val();
    if (!(time < 0 || time > 7200) && isNaN(time)) {
        alert("Wrong input !");
    } else {
        if (confirm("Are you sure change Session Time\n" + "Your time : " + time)) {
            var MachineName = getCookie('cname');
            setSessionTime(MachineName, time);
            getAllMachine();
            saveStatusCookie(MachineName);
            document.location = "status.html";
        }
    }
}


function Change(str) {
    $("#" + str + "-btn-update").show();
    $("#" + str + "-btn-cancel").show();
    $("#" + str + "-btn-change").hide();
    $("#" + str).attr("readonly", false);
    $("#" + str).val("");
}

function Cancel(str) {
    $("#" + str + "-btn-update").hide();
    $("#" + str + "-btn-cancel").hide();
    $("#" + str + "-btn-change").show();
    $("#" + str).attr("readonly", true);
    var data = getCookie(str);
    $("#" + str).val(data);
}

function loginEnter() {
    saveCookie();
    if (checkCookie() === "200") {
        document.location = "index.html";
    }
    console.log("loginEnter");
}

function login(user, pwd) {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=login&jsonPara=[(%22account%22:%22" + user + "%22),(%22password%22:%22" + pwd + "%22)]", false);
        xhttp.send();
        var rep = xhttp.responseText;
        rep = rep.replace(/\{/g, "");
        rep = rep.replace(/\}/g, "");
        rep = rep.replace(/\[/g, "");
        rep = rep.replace(/\]/g, "");
        rep = "{" + rep + "}";
        console.log(rep);
        var obj = JSON.parse(rep);
        return obj.status;
    } catch (err) {
        return "error";
    }
}

function getAllMachine() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getAllMachine&jsonPara=[]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    rep = rep.replace(/\{/g, "");
    rep = rep.replace(/\}/g, "");
    rep = rep.replace(/\[/g, "");
    rep = rep.replace(/\]/g, "");
    rep = "{" + rep + "}";
    console.log(rep);
    var obj = JSON.parse(rep);
    var msg = obj.message.split(",");
    if (obj.status != "200") return obj.status;
    setCookie('allContent', obj.message, 365);
    for (i = 0; i < msg.length; i++) {
        var content = msg[i].split("@");
        var name = content[0];
        var url = content[1];
        var redirect = content[2];
        var mac = content[3];
        MachineGenerator(name, url);
    }
    return obj.status;
}

function setPageUrl(user, url) {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=setPageUrl&jsonPara=[(%22username%22:%22" + user + "%22),(%22url%22:%22" + url + "%22)]", false);
        xhttp.send();
        var rep = xhttp.responseText;
        rep = rep.replace(/\{/g, "");
        rep = rep.replace(/\}/g, "");
        rep = rep.replace(/\[/g, "");
        rep = rep.replace(/\]/g, "");
        rep = "{" + rep + "}";
        console.log(rep);
        var obj = JSON.parse(rep);
        return obj.status;
    } catch (err) {
        return "error";
    }
}

function setSessionTime(user, time) {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=setSessionTime&jsonPara=[(%22username%22:%22" + user + "%22),(%22time%22:%22" + time + "%22)]", false);
        xhttp.send();
        var rep = xhttp.responseText;
        rep = rep.replace(/\{/g, "");
        rep = rep.replace(/\}/g, "");
        rep = rep.replace(/\[/g, "");
        rep = rep.replace(/\]/g, "");
        rep = "{" + rep + "}";
        console.log(rep);
        var obj = JSON.parse(rep);
        return obj.status;
    } catch (err) {
        return "error";
    }
}

function saveStatusCookie(user) {
    var msg = getCookie('allContent');
    var msg = msg.split(",");
    for (var i = 0; i < msg.length; i++) {
        var content = msg[i].split("@");
        var name = content[0];
        name = name.replace(" ", "");
        if (name == user) {
            console.log(content);
            var url = content[1];
            var redirect = content[2];
            var mac = content[3];
            var time = content[4];
            setCookie('cname', name, 365);
            setCookie('curl', url, 365);
            setCookie('mac', mac, 365);
            setCookie('redirect', redirect, 365);
            setCookie('time', time, 365);
            console.log(name);
            console.log(url);
            console.log(mac);
            console.log(time);
            return "";
        }
    }
}

function lastActiveTime(name) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getLastActive&jsonPara=[(%22username%22:%22" + name + "%22)]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    rep = rep.replace(/\{/g, "");
    rep = rep.replace(/\}/g, "");
    rep = rep.replace(/\[/g, "");
    rep = rep.replace(/\]/g, "");
    rep = "{" + rep + "}";
    console.log(rep);
    var obj = JSON.parse(rep);
    var msg = obj.message;
    if (obj.status != "200") {
        // $("#lastActiveTime").append(obj.status);
        document.getElementById("lastActiveTime").innerHTML = obj.status;
    } else {
        // $("#lastActiveTime").append(obj.message);
        document.getElementById("lastActiveTime").innerHTML = obj.message;
    }
}

function uploadImag() {
    document.imgFrom.action = "http://tarsanad.ddns.net/NiceAdmin/upload.php";
    document.getElementById("imgFrom").submit();
    console.log("!!!");
}

$("#selectOption").change(function() {
    /*
     * $(this).val() : #test1 的 value 值
     * $('#test1 :selected').text() : #test1 的 text 值     
     */
    var tmp = $('#selectOption :selected').val().split('x');
    var width = tmp[0];
    var height = tmp[1];
    console.log(tmp);
    if ($("#landscape").prop("checked")) {
        $('#iFramePhone').width(height);
        $('#iFramePhone').height(width);
        $('#showSize').text(height + "x" + width + " (" + $('#selectOption :selected').text() + ")");
    } else {
        $('#iFramePhone').width(width);
        $('#iFramePhone').height(height);
        $('#showSize').text(width + "x" + height + " (" + $('#selectOption :selected').text() + ")");
    }

});

$("#landscape").click(function() {
    var tmp = $('#selectOption :selected').val().split('x');
    var width = tmp[0];
    var height = tmp[1];
    if ($("#landscape").prop("checked")) {
        $('#iFramePhone').width(height);
        $('#iFramePhone').height(width);
        $('#showSize').text(height + "x" + width + " (" + $('#selectOption :selected').text() + ")");
    } else {
        $('#iFramePhone').width(width);
        $('#iFramePhone').height(height);
        $('#showSize').text(width + "x" + height + " (" + $('#selectOption :selected').text() + ")");
    }
});

function MachineGenerator(name, url) {
    name = name.replace(" ", "");
    $("#reviewAll").append('<div class=\"col-lg-3 col-md-3 col-sm-12 col-xs-12\"><div class=\"info-box ' + InfoBoxColor[makeUniqueRandom()] + '\"><i class=\"fa fa-hdd-o\"></i><div class=\"count\"><a onclick=\"saveStatusCookie(' + "'" + name + "'" + ')\" href=\"status.html\"><font color=\"#FFFFFF\">' + name + '</font></a></div><div><a href=\"' + url + '\" target=\"_blank\">Preview<iframe  class=\"col-md-12 col-sm-12 col-xs-12\" src=\"' + url + '\" frameborder=\"0\" allowfullscreen></iframe></a></div></div></div>');
}

var InfoBoxColor = ["linkedin-bg", "twitter-bg", "facebook-bg", "dark-bg", "brown-bg", "teal-bg", "magenta-bg", "lime-bg", "pink-bg", "purple-bg", "orange-bg", "yellow-bg", "green-bg", "blue-bg", "red-bg"];
var uniqueRandoms = [];
var numRandoms = 15;

function makeUniqueRandom() {
    // refill the array if needed
    if (!uniqueRandoms.length) {
        for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
    }
    var index = Math.floor(Math.random() * uniqueRandoms.length);
    var val = uniqueRandoms[index];

    // now remove that value from the array
    uniqueRandoms.splice(index, 1);

    return val;
}
