var timeZone = {};
var tmpTz = "tmp";
var tmpAry = new Array();
var tmpCity = "";
for (var s in moment.tz.names()) {
    // console.log(moment.tz.names()[s]);
    var str = moment.tz.names()[s];
    if (str.match(/\//g)) {
        var tmp = str.split("/");
        var tmpname = tmp[0];
        if (tmpname.localeCompare(tmpTz) != 0) {
            if (tmpAry.length != 0) timeZone[tmpTz.toString()] = tmpAry;
            tmpAry = [];
            // console.log(tmpAry.length);
            tmpTz = tmpname;
            tmpAry.push(tmp[1].toString());
            tmpCity = tmp[1].toString();
            // console.log(tmpCity);
        } else if (tmpCity.localeCompare(tmp[1].toString()) != 0) {
            tmpCity = tmp[1].toString();
            // console.log(tmpCity);
            tmpAry.push(tmpCity);
        }
        // timeZone[tmp[0]].push(tmp[1]);
    }
}

// for(var zone in timeZone){
// 	console.log(zone);
// 	$('<option>').val(zone).text(zone).appendTo('#tz');
// 	// $("#tz").append($("<option></option>").attr("value", zone).text(zone));
// }
function changeCity() {
    var zone = $("#tz").find(":selected").val();
    $("#city option").remove();
    $.each(timeZone[zone], function(key, value) {
        $('#city')
            .append($("<option></option>")
                .attr("value", value)
                .text(value));
    });
}

// function changeAssignCity() {
//     var zone = $("#astz").find(":selected").val();
//     $("#ascity option").remove();
//     $.each(timeZone[zone], function(key, value) {
//         $('#ascity')
//             .append($("<option></option>")
//                 .attr("value", value)
//                 .text(value));
//     });    
// }

// $("select#ascity").change(function(){
//     dateCmp();
// });

$.each(timeZone, function(key, value) {
    $('#astz')
        .append($("<option></option>")
            .attr("value", key)
            .text(key));
});

$.each(timeZone, function(key, value) {
    $('#tz')
        .append($("<option></option>")
            .attr("value", key)
            .text(key));
});

$("#assignDate").click(function() {
    if ($("#assignDate").prop("checked")) {  
        $("#asignSchedule").show();
    } else {
        $("#asignSchedule").hide();
    }
});

$("#assignDate2").click(function() {
    if ($("#assignDate2").prop("checked")) {  
        $("#asignSchedule2").show();
    } else {
        $("#asignSchedule2").hide();
    }
});

// function dateCmp(){

//     var astimeZone = "";
//     var zone = $("#astz").find(":selected").val();
//     var city = $('#ascity').find(":selected").val();    
//     if (city != undefined){
//       astimeZone = zone + "/" + city;
//       console.log(astimeZone);
//       // moment.tz.setDefault(timeZone); 
//     } 
//     var date = $("#aspicker").val();
//     var hr = $("#ashr").find(":selected").val();
//     var min = $('#asmin').find(":selected").val();
//     var times = date+" "+hr+":"+min;
//     console.log(times);
//     moment(times).format();
//     moment.tz.setDefault("Asia/Taipei");
//     var m = moment(times).tz("Asia/Taipei");
//     var show = m.tz(astimeZone).format('YYYY/MM/DD hh:mm:ss');
//     console.log(m.tz("Asia/Tokyo").format('YYYY/MM/DD hh:mm:ss'));
//     console.log(m.tz("Asia/Taipei").format('YYYY/MM/DD hh:mm:ss'));    
//     $("#dateCmp").text("= Taipei Time : "+show);
// }

function display_c() {
    var refresh = 1000; // Refresh rate in milli seconds
    mytime = setTimeout('display_ct()', refresh);
}

function display_ct() {
    var x = moment();
    var zone = $("#tz").find(":selected").val();
    var city = $('#city').find(":selected").val();
    var timeZone = "Asia/Taipei";
    
    if (city != undefined){
      timeZone = zone + "/" + city;
      // moment.tz.setDefault(timeZone); 
    } 
    // var taipeiTime = moment.tz(x, "Asia/Taipei").format('YYYY/MM/DD A hh:mm:ss');
    var TaipeiDate = moment.tz(x, "Asia/Taipei").format('YYYY/MM/DD');
    var TaipeiTimes = moment.tz(x, "Asia/Taipei").format('A hh:mm:ss');

    var nowDate = moment.tz(x, timeZone).format('YYYY/MM/DD');
    var nowTimes = moment.tz(x, timeZone).format('A hh:mm:ss');
    
    document.getElementById('currentTaiwan').innerHTML = '<div style="margin:0 auto;text-align:center;">'+"Asia/Taipei"+"<br>"+TaipeiDate+"<br>"+TaipeiTimes+"</div>";
    document.getElementById('current').innerHTML = '<div style="margin:0 auto;text-align:center;">'+timeZone+"<br>"+nowDate+"<br>"+nowTimes+"</div>";
    tt = display_c();
    // $('#clock').html(timeZone+"	"+nowTime);
}