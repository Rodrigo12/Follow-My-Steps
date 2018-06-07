var helpVideoInitialPosition;
var helpVideosObjArray = [{'name':'How to add Images', 'link':'https://www.youtube.com/embed/NOzkSpKSw9o'}, {'name':'How to add Maps', 'link':'https://www.youtube.com/embed/9Lkpgq6BYZg'},
                          {'name':'How to add Files', 'link':'https://www.youtube.com/embed/ovwGU7i1VCQ'}, {'name':'How to add Bar Charts', 'link':'https://www.youtube.com/embed/wBgv_GUibTw'},
                          {'name':'How to change the Background', 'link':'https://www.youtube.com/embed/OuZ8tp0e1cY'}, {'name':'How to change the Report', 'link':'https://www.youtube.com/embed/Hj4vf_ZUJDk'},
                          {'name':'How to Delete Files', 'link':'https://www.youtube.com/embed/2Hu62ogLWN4'}];

function helpCreateContent(){
  var helpDivs           = '', numberOfHelpVideos = 7;
  for (var currentTitle, currentVideo, currentDiv, currentClickableDiv, index = 0; index < numberOfHelpVideos; index++) {
    currentTitle = createHtml('h5', getSubString(helpVideosObjArray[index].name, 20), 'class="helpVideoTitle"');

    currentVideo        = createHtml('iframe', '', 'src="'+helpVideosObjArray[index].link+'" class="helpVideo" type="text/html" title="Adobe Flash Player" allowfullscreen="true" frameBorder="0"');
    currentClickableDiv = createHtml('div', '', 'class="helpClickableDiv" style="position:absolute;width:150px; height:150px; z-index=10;cursor:pointer;"');
    currentDiv          = createHtml('div', currentClickableDiv + currentTitle + currentVideo, 'id="helpVideo'+index+'" class="helpDiv"');
    helpDivs    += currentDiv;
  }

  $('#helpContainerContent').html(helpDivs);
}

$(document).on('click', '.helpClickableDiv', function(){
  var parent      = $(this).parent();
  var parentClass = $(parent).attr('class');
  var parentID    = $(parent).attr('id');
  var finalPosition = [10 + 'px', 50 + 'px'];

  helpVideoInitialPosition = $(parent).position();
  console.log(helpVideoInitialPosition);

  $( '.' + parentClass ).not( parent ).css( "display", "none" );//hide other videos

  var closeHelpVideoButton = createHtml('img', '', 'src="/static/imgs/icons/containerIcons/arrows/close.png" class="closeHelpVideo" style="display:block; cursor:pointer; position:absolute; top:12px; right:10px; width:10px;"');
  $(parent).append(closeHelpVideoButton);
  incrementAndMove(parentID, 400, 300, ANIMATIONTIME, null, finalPosition);//expand clicked video
});

$(document).on('click', '.closeHelpVideo', function(){
  var parent      = $(this).parent();
  var parentClass = $(parent).attr('class');
  var parentID    = $(parent).attr('id');

  var elementLeftIndex = (helpVideoInitialPosition.left - 15) / 172;
  var elementTopIndex  = (helpVideoInitialPosition.top - 143) / 143;
  var finalPosition    = [elementTopIndex + 'px', elementLeftIndex + 'px'];


  $(this).remove();
  incrementAndMove(parentID, 150, 150, ANIMATIONTIME, null, finalPosition);//expand clicked video
  setTimeout(function(){ $( '.' + parentClass ).not( parent ).css( "display", "inline-block" ); }, ANIMATIONTIME);
});
