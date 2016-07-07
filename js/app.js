function getFormattedDate() {
    var d = new Date();
    // var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
    return d;
}
function getschedule(user) {	
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getScheduleByUsername&jsonPara=[(%22username%22:%22" + user + "%22)]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    rep = rep.replace(/\{/g, "");
    rep = rep.replace(/\}/g, "");
    rep = rep.replace(/\[/g, "");
    rep = rep.replace(/\]/g, "");
    rep = "{" + rep + "}";
    console.log(rep);
    var obj = JSON.parse(rep);
    if (obj.status != "200")return "";
    var schedules = obj.schedule.split("@");
    var urls = obj.url.split("@");
    var currentTime = obj.currentTime;
    // console.log(urls);
    
    var arr = [];
	var jsonStr = "";
    for (var i = 0; i < urls.length; i++) {
    	var d = new Date(schedules[i]* 1);
    	var formated = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " +  d.getHours() + ":" + ('0' + (d.getMinutes())).slice(-2);
   //  	var endtimes;
   //  	if(i+1<schedules.length){
			// endtimes=schedules[i+1];
   //  	}
    	var classSet;
    	if(i+1<schedules.length){
    		var last = new Date(schedules[i]* 1)
			var nowTime = new Date(currentTime);
			var next = new Date(schedules[i+1]* 1);
			console.log(last);
			console.log(nowTime);
			console.log(next);

			if(last.getTime()>nowTime.getTime()){
				classSet="event-info";
				console.log("event-info");
			}else if(nowTime.getTime()<next.getTime() && last.getTime()<nowTime.getTime()){
				classSet="event-success";
				console.log("event-success");
			}else{
				classSet="event-important";
				console.log("event-important");
			}			
    	}else{
    		var last = new Date(schedules[i]* 1)
			var nowTime = new Date(currentTime);
			if(last.getTime()>nowTime.getTime()){
				classSet="event-info";
				console.log("event-info");
			}else{
				classSet="event-success";
				console.log("event-success");
			}
    	}
    	var calobj = {"title": formated,"url":urls[i],"class": classSet,"start":schedules[i]};
    	arr.push(calobj);
    }
    return arr;
    console.log(arr);
//     return obj.status;
}


(function($) {
	
	"use strict";
	var MachineName = getCookie('cname');
	var options = {
		events_source: getschedule(MachineName),
		view: 'month',
		tmpl_path: 'tmpls/',
		tmpl_cache: false,
		day: getFormattedDate(),
		onAfterEventsLoad: function(events) {
			if(!events) {
				return;
			}
			var list = $('#eventlist');
			list.html('');

			$.each(events, function(key, val) {
				$(document.createElement('li'))
					.html('<a href="' + val.url + '">' + val.title + '</a>')
					.appendTo(list);
			});
		},
		onAfterViewLoad: function(view) {
			$('.page-header h3').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
		},
		classes: {
			months: {
				general: 'label'
			}
		}
	};

	var calendar = $('#calendar').calendar(options);

	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});

	$('#first_day').change(function(){
		var value = $(this).val();
		value = value.length ? parseInt(value) : null;
		calendar.setOptions({first_day: value});
		calendar.view();
	});

	$('#language').change(function(){
		calendar.setLanguage($(this).val());
		calendar.view();
	});

	$('#events-in-modal').change(function(){
		var val = $(this).is(':checked') ? $(this).val() : null;
		calendar.setOptions({modal: val});
	});
	$('#format-12-hours').change(function(){
		var val = $(this).is(':checked') ? true : false;
		calendar.setOptions({format12: val});
		calendar.view();
	});
	$('#show_wbn').change(function(){
		var val = $(this).is(':checked') ? true : false;
		calendar.setOptions({display_week_numbers: val});
		calendar.view();
	});
	$('#show_wb').change(function(){
		var val = $(this).is(':checked') ? true : false;
		calendar.setOptions({weekbox: val});
		calendar.view();
	});
	$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
		//e.preventDefault();
		//e.stopPropagation();
	});
}(jQuery));