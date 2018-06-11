var ANIMATIONTIME = 500;

//Show the a container with its content
function showContainer(elemID, width, height, initialPosition, finalPosition, time, childIndex){
  $("#" + elemID).css({top: initialPosition.top, left: initialPosition.left, display:'block'});
  incrementAndMove(elemID, width+"px", height+"px", time, null, finalPosition);
  setTimeout(function (){showContainerChild(elemID, time, childIndex, "0px", "0px");}, time);
}

//Hide a container calling for the function that has the properties to hide
function hideContainer(elemID, time, finalPosition, hideContainerContent, callback){
  hideContainerContent(elemID, time, finalPosition);
}

function incrementWidthAndHeight(elemID, width, height, time, callback){
  $('#' + elemID).animate({
    width: width,
    height:height
  }, time, function(){
    if(callback!=null)
      callback();
  });
}

function incrementHeight(elemID, height, time, callback){
  $('#' + elemID).animate({
    height:height
  }, time, function(){
    if(callback!=null)
      callback();
  });
}

function incrementWidth(elemID, width, time, callback){
  $('#' + elemID).animate({
    width:width
  }, time, function(){
    if(callback!=null)
      callback();
  });
}

function incrementAndMove(elemID, width, height, time, callback, position){
  $('#' + elemID).animate({
    width: width,
    height: height,
    top: position[0],
    left: position[1]
  }, time, function(){
    if(callback!=null)
      callback();
  });
}

function fadeAndMove(elemID, opacity, time, callback, position, display){
  $('#' + elemID).animate({
    opacity:opacity,
    top: position[0],
    left: position[1]
  }, time, function(){
    $('#' + elemID).css("display", display);
    if(callback!=null)
      callback();
  });
}

function incrementAndFade(elemID, width, height, time, callback, opacity){
  $('#' + elemID).animate({
    width: width,
    height: height,
    opacity: opacity
  }, time, function(){
    if(callback!=null)
      callback();
  });
}

function fade(elemID, opacity, time, callback, display){
  $('#' + elemID).animate({
    opacity:opacity
  }, time, function(){
    $('#' + elemID).css("display", display);
    if(callback!=null)
      callback();
  });
}

function fadeClass(elemClass, opacity, time, callback, display){
  $('.' + elemClass).animate({
    opacity:opacity
  }, time, function(){
    $('.' + elemClass).css("display", display);
    if(callback!=null)
      callback();
  });
}

function fadeElement(element, opacity, time, callback, display){
  $(element).animate({
    opacity:opacity
  }, time, function(){
    $(element).css("display", display);
    if(callback!=null)
      callback();
  });
}

function fadeElements(elementsID, opacity, time, callback, display){
  for (var index = 0; index < elementsID.length; index++) {
    $('#' + elementsID[index]).animate({
      opacity:opacity
    }, time, function(){
      $('#' + elementsID[index]).css("display", display);
      if(callback!=null)
        callback();
    });
  }
}

function moveTo(elemID, time, callback, position){
  $('#' + elemID).animate({
    top: position[0],
    left: position[1]
  }, time, function(){
    if(callback!=null)
      callback();
  });
}

function moveHorizontal(elemID, left, time){
  $(elemID).animate({
    left:left
  }, time);
}

function moveVertical(elemID, top, time){
  $(elemID).animate({
    top:top
  }, time);
}

function changeOpacity(element, opacity, time){
  $(element).animate({
    opacity:opacity
  }, time);
}

function fadeInElement(type, element, time){
  if(type == "class")
    $('.'+element).fadeIn(time).css("display","inline-block");
  else if(type=="id")
    $('#'+element).fadeIn(time).css("display","inline-block");
}


function fadeOutElement(elemID, type, element, time, callback, position){
  if (callback == null) {
    if(type == "class")
        $('.'+element).fadeOut(time).css("display","none");
    else if(type=="id")
      $('#'+element).fadeOut(time);
  }else {
    if(type == "class")
        $('.'+element).fadeOut(time,callback(elemID, time, position)).css("display","none");
    else if(type=="id")
      $('#'+element).fadeOut(time,callback(elemID, time, position)).css("display","none");
  }
}

function hide(elemID, time, position){
  $('#' + elemID).animate({
    width: "0px",
    height: "0px",
    opacity: "1.0",
    top: position[0],
    left: position[1]
  }, time, function(){
    $('#' + elemID).css("display", "none");
  });
}

function borderRadius(elemID, borderRadius, time){
  $('#' + elemID).animate({
    borderRadius: borderRadius
  }, time);
}

function changeTextSize(elemID, textSize, time){
  $('#' + elemID).animate({
    fontSize: textSize
  }, time);
}

function blurBkg(elemID){
  $("#" + elemID).blurjs({
    source: elemID,
    radius: 200,
    overlay: 'rgba(0, 0, 0, 0.2)'
  });
}

function hideBlur(){
  $("#blurDiv").hide();
}
