// SLIDER SWITCH
	var sls_target;
	var sls_width;
	var sls_type;
	var sls_handle_target;
	var sls_handle_width;
	var sls_input;
	var sls_handle_dist;

	var currentHandlerTouched;

var currentYearEnd = 2017, currentYearStart = 2017;

	//dateFromDay(2010, 365) -> "Fri Dec 31 2010"
	function dateYearDay(year, day){
		//console.log(day);
		//console.log(year);
	  var date = new Date(year, 0); // initialize a date in `year-01-01`
	  return new Date(date.setDate(day)); // add the number of days
	}

	// "Fri Dec 31 2010" ->
	function getMonthDay(date){
	  var dateArray = (date.toString()).split(' ');
	  return dateArray[1]+" "+dateArray[2]+" "+dateArray[3];
	}

	//set selected handle
	function setTimelineHandler(handler, dateValue, triggerTime){
		if (dateValue == ''){
			$(handler).html();
			return;
		}

		var month 						 = new Date(dateValue).getMonth() + 1;
		var day 							 = new Date(dateValue).getDate();
		var currentSliderWidth = $($(handler).closest('.timeline')[0]).width();
		var leftPosition 			 = (((month * currentSliderWidth)/13)*100)/currentSliderWidth - 5 + (((day * currentSliderWidth)/366)*100)/currentSliderWidth;

		$(handler).css({
			"left": leftPosition + "%"
		});

		var handleDate;
		try{
			handleDate = getFormatedDate(dateValue);
		} catch(err){
			handleDate = getTimelineFormatedDate(dateValue.toString());
		}

		$(handler).html(handleDate);

		if (triggerTime)
			sendTimeTrigger();
	}


//send time event
function sendTimeTrigger(){
	var dates = getStartEndDates();
	if (dates[0] != 'Invalid Date'){
		startDate = dates[0];
		currentYearStart = dates[0].getFullYear();
	}
	if (dates[1] != 'Invalid Date'){
		endDate 	= dates[1];
		currentYearEnd = dates[1].getFullYear();
	}

	$('.visualization').trigger('time', ['timelineTimeEvent']);
}

function getStartEndDates(){
	var parent = $(currentHandlerTouched).parent();
	var star, end, dates  = [];
	$(parent).find('.sls-handle').each(function(index){ //run through all handles on timeline
		if (index == 1) {	//if it is the second handle
			start = new Date(dates[0]);	//get date from the first one
			end 	= new Date($(this).html());	//get date from the second one
			if (start > end)	//if start date is bigger than the end date
				dates.splice(0, 0, end);	//insert end date in the beggining
			else
				dates.push(end);//otherwise insert end date in the end
		}else{
			end 	= new Date($(this).html());	//get date
			dates.push(end);//if is the firt handle insert date
		}
	});

	return dates;
}



//create timeline visualization
function createTimeline(timelineID, width, isPreview){
	// setting up
	$('#'+timelineID+" .sls").each(function(){
		//var width = $(this).width() - $(this).children(".sls-handle").width();
		var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"];

		//$(this).prepend("<div style='width:"+width+"px' class='sls-knob-stack'></div>");
		$(this).prepend("<div style='width:100%' class='sls-knob-stack'></div>");

		if($(this).attr("data-start") && $(this).attr("data-end") && !$(this).hasClass("sls-knob-disabled")){
			var start = parseInt($(this).attr("data-start"));
			var end 	= parseInt($(this).attr("data-end"));

			var diff 	= Math.abs(start - end);

//			var currentSliderWidth = 600;	//dots seperation valur
			var currentSliderWidth = width;	//dots seperation valur
			var monthDays = [0, 31, 29, 31, 30, 31 ,30, 31, 31, 30, 31, 30];//place jan at 0, feb 31 (from jan) days later, mar 29 (from feb) days later
			for(var monthRatio, i=0; i<12; i++){
				monthRatio = 1 - (31 - monthDays[i])/100;

				$(this).children(".sls-knob-stack").append("<span class='sls-knob' style='position:absolute; left:"+ (((i*currentSliderWidth)/13)*100)/currentSliderWidth +"%;'>"+monthNames[i]+"</span>");
				//$(this).children(".sls-knob-stack").append("<span class='sls-knob' style='position:absolute; left:"+ (((monthRatio*i*currentSliderWidth)/12)-25) +"px;'>"+monthNames[i]+"</span>");
			}
		}
		if($(this).attr("data-start") && $(this).attr("data-end")){
			$(this).children(".sls-handle").html("Drag me");
		}
		if($(this).hasClass("sls-limit")){
			// getting end value from attribute
			var end = parseInt($(this).attr("data-end"));
			// positioning the second button on the far right
			var second_handle_left = $(this).width() - $(this).find(".sls-handle").outerWidth();
			// adding button
			$(this).append("<div data-toggle='popover' data-container='body' data-trigger='manual' style='left:"+second_handle_left+"px;' class='sls-handle'>Drag me</div>");
		}
	});

	if (!isPreview) {
		$('.sls-handle').each(function(index){
			var datePlaceholder = $(this)[0].outerText;
			if (datePlaceholder = 'Drag Me') {
				datePlaceholder = ( index == 0 ) ? new Date(2000,0,1) : new Date();
			}
			var content = timelinePopupContent(datePlaceholder);
			createTimeLinePopover($(this)[0], 'bottom', content, true);
		});
	}


	$("div.sls > .sls-handle").on("mousedown touchstart", function(e){
		// on mousedown or touch it'll get and store all info about the slider into the global variables
		// that are in the beginning

		// next two line prevent selection on drag
		e.preventDefault();
		e.cancelBubble=true;
		// when the user press button the slider's data-drag attr will change to 1
		// that means it can be moved/dragged now (verified on mousemove)
		// if the user moves button up then it changes back to 0 (it's done later)
		$(this).parent().attr("data-drag","1");
		// next 3 lines sets gloal variable
		sls_target = $(this).parent();
		sls_handle_width = sls_target.find(".sls-handle").outerWidth();
		sls_width = sls_target.width();
		sls_input = sls_target.siblings("input");

		// it registers which handle is going to move, and it's used in mousemove
		// as an example, if the user press on the first handle then only first one gonna move
		sls_handle_target = $(this).index();
		sls_handle_dist = Math.abs(e.pageX - $(this).offset().left);


		// if user wants two handles then specify it in global variables
		if($(this).parent().hasClass("sls-limit")){
			sls_type = "limit";
		}else{
			sls_type = "single";
		}
	});


	// as said before when user unclick it'll be non-movable
	$('.sls-container').on("mouseup touchend", function(){
		var start, end;
		sls_target.attr("data-drag","0");
		var data = sls_target.find(".sls-handle").eq(0).text();
		data = getMonthDay(dateYearDay(currentYearStart, sls_target.find(".sls-handle").eq(0).text()));
		start = data;
		if(sls_target.find(".sls-handle").eq(1).length > 0){
			data += getMonthDay(dateYearDay(currentYearEnd, sls_target.find(".sls-handle").eq(1).text()));
			end = getMonthDay(dateYearDay(currentYearEnd, sls_target.find(".sls-handle").eq(1).text()));
		}
		sls_input.val(data);

		start = new Date(sls_target.find(".sls-handle").eq(0).text());
		end 	= new Date(sls_target.find(".sls-handle").eq(1).text());


		if (start == 'Invalid Date') { start = new Date(2000); }
		if (end == 'Invalid Date') { end = new Date(); }

		if (!isPreview){
			if (start < end) {
				startDate = start; endDate = end;
			}else{
				startDate = end; endDate = start;
			}

			$('.visualization').trigger('time', ['timelineTimeEvent']);
		}

	});


	// now the real part...
	$(document).on("mousemove touchmove", function(e){
		// if data-drag=1 then handles will move
		if(sls_target && sls_target.attr("data-drag") == 1){

			// getting event type, touch or mouse
			if(e.type == "touchmove"){
				var event = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			}else if(e.type == "mousemove"){
				var event = e;
			}

			// getting the active handle that
			// because of starting number i had to substarct 1 from original index number
			var handle = sls_target.find(".sls-handle").eq(sls_handle_target - 1);

			// if the active one is the first and has two switches (limit)
			if(sls_handle_target == 1 && sls_type == "limit"){
				// getting position of mouse
				var posX = event.pageX - sls_target.offset().left;

				// left position of the left handle
				var handle_left_pos = posX - sls_handle_dist;
				// if position is greated than 0 and less than (total width - handle width)
				// then move according to mouse position
				if(handle_left_pos >= 0 && handle_left_pos <= (sls_width - sls_handle_width)){
					// moving
					handle.css({
						"left": handle_left_pos + "px"
					});

					// if the first handle collides with the second then drag it with the first one
					// untill it stops
					// 	"posX + sls_handle_width" : because posX is the left position of first whitch
					//	that's why added it's width so the second one will drag like is would in real life

					// if end point of the first handle is biggert than start point of second handle

					//EDITED
					// if(handle_left_pos + sls_handle_width > parseInt(handle.next().css("left"))){
					// 	handle.next().css({
					// 		"left": handle_left_pos + sls_handle_width + "px"
					// 	}).addClass("merge-left");
					// 	handle.addClass("merge-right");
					// 	// calculation position & printing it on the handle
					// 	// while dragging with the first handle, second handle also need to change value as it drags
					// 	var start = parseInt(sls_target.attr("data-start"));
					// 	var end = parseInt(sls_target.attr("data-end"));
					// 	var length_value = (Math.round(parseInt(handle.next().css("left")) - sls_handle_width)/(sls_width - sls_handle_width*2) * 100);
					// 	var value = start + Math.round( length_value/(100/(end - start)));
					// 	var dateValue = getMonthDay(dateYearDay(currentYearEnd, value));
					//
					// 	handle.next().html(dateValue);
					// }else{
					// 	handle.removeClass("merge-right");
					// 	handle.next().removeClass("merge-left");
					// }



				// if reaches right end limit then set it to the right
			}else if(handle_left_pos > (sls_width - sls_handle_width)){
					handle.css({
						"left": sls_width - sls_handle_width + "px"
					});
					// if first handle reaches end end then
					// secont handle's left = end of width = bar width - handle width
					// because of perfection

					//EDITED
					// handle.next().css({
					// 	"left": sls_width - sls_handle_width + "px"
					// }).addClass("merge-left");

					// calculation position & printing it on the handle
					// again calculation if first handle reaches end..
					// otherwise adjustment of the second handle will be imperfect at the end
					var start = parseInt(sls_target.attr("data-start"));
					var end = parseInt(sls_target.attr("data-end"));
					var length_value = (Math.round(parseInt(handle.next().css("left")))/(sls_width - sls_handle_width) * 100);
					var value = start + Math.round( length_value/(100/(end - start)));
					var dateValue = getMonthDay(dateYearDay(currentYearEnd, value));
					//handle.next().html(value);
					handle.next().html(dateValue);
				// if reaches left end limit then set it to the left
				}else if(handle_left_pos <= 0){
					handle.css({
						"left": 0 + "px"
					});
				}

				// calculation position & printing it on the handle
				// (this same calculation is done in the previous two state)
				if(sls_target.attr("data-start") && sls_target.attr("data-end")){
					var start = parseInt(sls_target.attr("data-start"));
					var end = parseInt(sls_target.attr("data-end"));
					//Math.round(parseInt(handle.css("left")) - sls_handle_width)/(sls_width - sls_handle_width*2)
					var length_value = Math.round(parseInt(handle.css("left")) )/(sls_width - sls_handle_width) * 100;
					var value = start + Math.round( length_value/(100/(end - start)));
					var dateValue = getMonthDay(dateYearDay(currentYearStart, value));
					//handle.html(value);
					handle.html(dateValue);
				}
			// just like the first one second condition is 90% same
			// in this case if the second handle is active
			}else if(sls_handle_target == 2 && sls_type == "limit"){
				var posX = event.pageX - sls_target.offset().left;

				// left position of the left handle
				var handle_left_pos = posX - sls_handle_dist;

				if(handle_left_pos > 0 && (handle_left_pos) < (sls_width - sls_handle_width)){
					handle.css({
						"left": handle_left_pos + "px"
					});
					//
					// now, unlike the first condition, the second handle must stop before (0px + handle width)
					// from the left, because first handle is there
					//

					// again if second handle collides with first
					// then drag it with the second one

					//EDITED
					// if(handle_left_pos <= parseInt(handle.prev().css("left")) + sls_handle_width){
					// 	handle.prev().css({
					// 		"left": handle_left_pos - sls_handle_width + "px"
					// 	}).addClass("merge-right");
					// 	handle.addClass("merge-left");
					// 	// calculating..
					// 	var start = parseInt(sls_target.attr("data-start"));
					// 	var end = parseInt(sls_target.attr("data-end"));
					// 	var length_value = Math.round(parseInt(handle.prev().css("left"))/(sls_width - sls_handle_width*2) * 100);
					// 	var value = start + Math.round( length_value/(100/(end - start)));
					// 	var dateValue = getMonthDay(dateYearDay(currentYearStart, value));
					// 	//handle.prev().html(value);
					// 	handle.prev().html(dateValue);
					// }else{
					// 	handle.removeClass("merge-left");
					// 	handle.prev().removeClass("merge-right");
					// }

				// if reaches right end limit then set it to the right
				}else if((handle_left_pos) > (sls_width - sls_handle_width)){
					//EDITED
					handle.css({
						"left": sls_width- sls_handle_width  + "px"
					});

				// if reaches left end limit then set it to the left
			}else if(handle_left_pos < 0){

					//EDITED
					handle.css({
						"left": 0 + "px"
					});
					// if second hanndle reaches end then
					// first handle's left = 0
					// because of perfection
					// handle.prev().css({
					// 	"left": 0 + "px"
					// }).addClass("merge-right");
					// calculating...
					var start = parseInt(sls_target.attr("data-start"));
					var end = parseInt(sls_target.attr("data-end"));

					//EDITED
					// var length_value = Math.round(parseInt(handle.prev().css("left"))/(sls_width - sls_handle_width*2) * 100);
					// var value = start + Math.round( length_value/(100/(end - start)));

					var length_value = Math.round(parseInt(handle.prev().css("left"))/(sls_width ) * 100);
					var value 			 = Math.round( length_value/(100));
					var dateValue 	 = getMonthDay(dateYearDay(currentYearStart, value));

					//handle.prev().html(dateValue);

				}



				if(sls_target.attr("data-start") && sls_target.attr("data-end")){
					var start = parseInt(sls_target.attr("data-start"));
					var end = parseInt(sls_target.attr("data-end"));
					var length_value = (Math.round(parseInt(handle.css("left")) )/(sls_width - sls_handle_width) * 100);
					var value = start + Math.round( length_value/(100/(end - start)));
					var dateValue = getMonthDay(dateYearDay(currentYearEnd, value));
					//handle.html(value);
					handle.html(dateValue);
				}
			// else if user don't need two handles
			}else if(sls_handle_target == 1 && sls_type != "limit"){
				var posX = event.pageX - sls_target.offset().left;

				// left position of the left handle
				var handle_left_pos = posX - sls_handle_dist;

				handle.css({
					"left": handle_left_pos + "px"
				});

				// EDITED
				// if(handle_left_pos > 0 && handle_left_pos < (sls_width - sls_handle_width)){
				// 	handle.css({
				// 		"left": handle_left_pos + "px"
				// 	});
				// }else if(handle_left_pos > (sls_width - sls_handle_width)){
				// 	handle.css({
				// 		"left": sls_width - sls_handle_width + "px"
				// 	});
				// }else if(handle_left_pos < 0){
				// 	handle.css({
				// 		"left": 0 + "px"
				// 	});
				// }

				if(sls_target.attr("data-start") && sls_target.attr("data-end")){
					var start = parseInt(sls_target.attr("data-start"));
					var end = parseInt(sls_target.attr("data-end"));

					var length_value = Math.round(parseInt(handle.css("left"))/(sls_width - sls_handle_width) * 100);
					var value = start + Math.round( length_value/(100/(end - start)));

					var dateValue = getMonthDay(dateYearDay(currentYearStart, value));
					//handle.html(value);
					handle.html(dateValue);
				}
			}

		}
	});
}
