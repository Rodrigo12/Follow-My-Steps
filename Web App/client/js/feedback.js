var feedbackContainerNumber = 0;

function createFeedbackMessage(feedbackMsg, imgType, msgObj, time){
  //console.log(msgObj);
  var closeButton         = createHtml('p', '&times;'                                   , 'class="feedbackClose"            id="feedbackClose'+feedbackContainerNumber+'"     onclick = "closeFeedbackButton(feedbackClose'+feedbackContainerNumber+')"');
  var image               = createHtml('img', ''                                        , 'class="feedbackImage"            id="feedbackImage'+feedbackContainerNumber+'"     src="./imgs/pluginIcons/'+msgObj.extension+'Icon.png"');
  var imageType           = createHtml('img', ''                                        , 'class="feedbackImageType"        id="feedbackImageType'+feedbackContainerNumber+'" src="./imgs/icons/containerIcons/originals/'+imgType+'.png"');
  var message             = createMessage(feedbackMsg, msgObj);
  var divContainerContent = createHtml('div', image + imageType + message + closeButton , 'class="feedbackContainerContent" id="feedbackContainerContent'+feedbackContainerNumber+'"');
  var divContainer        = createHtml('div', divContainerContent                       , 'class="feedbackContainer"        id="feedbackContainer'+feedbackContainerNumber+'"');
  $( "body" ).append(divContainer);

  slideOtherFeedbackContainers();
  incrementAndFade('feedbackContainer' + feedbackContainerNumber, 290, 60, ANIMATIONTIME, null, 1.0);

  var currentFeedbackContainerNumber = feedbackContainerNumber;
  setTimeout(function(){
    closeMessage('feedbackContainer' + currentFeedbackContainerNumber);
  }, time); //in seconds

  feedbackContainerNumber++;
}

function createMessage(feedbackMsg, msgObj){
  if (msgObj.extension == 'email')
    return createHtml('p'  , feedbackMsg + msgObj.email, 'class="feedbackMessage" id="feedbackMessage'+feedbackContainerNumber+'"');
  else {
    var filename = getSubString(msgObj.name, 27);
    return createHtml('p'  , filename + feedbackMsg, 'class="feedbackMessage" id="feedbackMessage'+feedbackContainerNumber+'"');
  }
}

function closeFeedbackButton(elem){
  var elemParentID = elem.parentNode.parentNode.id; // get feedbackContainer id
  closeMessage(elemParentID);
}

function closeMessage(elemID){
  incrementAndFade(elemID, 0, 60, ANIMATIONTIME, function(){
    $( '#' + elemID).remove();
    slideOtherFeedbackContainers();
  }, 0.0);
}

function slideOtherFeedbackContainers(){
  var feedbackContainers = $(".feedbackContainer");

  for (var currentContainer, currentContainerTop, index = 0; index < feedbackContainers.length; index++) {
    currentContainer    = feedbackContainers[index];
    currentContainerTop = (((feedbackContainers.length) - (index+1)) * 11) + 3;            //the three represent the container initial position
    moveVertical("#" + currentContainer.id, currentContainerTop + '%', ANIMATIONTIME);
  }
}
