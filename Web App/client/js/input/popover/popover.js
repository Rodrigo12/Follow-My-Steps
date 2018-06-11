//Create new popover with details
function createPopover(elemID, title, placement, content, isHtml){
  $(elemID).popover({
      html: isHtml,
      title: title,
      placement:placement,
      content: content,
      animation: true
  });
}

//Create new popover with details
function createTimeLinePopover(elemID, placement, content, isHtml){
  $(elemID).popover({
      html: isHtml,
      placement:placement,
      content: content,
      animation: true
  }).click(function(e) {
      e.preventDefault() ;
  }).dblclick(function(e) {
      $(this).popover('show');
      currentHandlerTouched = this;
  });
}

function loadPopover(containerID, filePath, evt){
  $( containerID ).load( filePath );
  evt.stopPropagation();
}

//Close popover
function closePopover(elemID){
  $(elemID).popover('hide');
}

//Close all other popovers
function closeOtherPopovers(elemID, evt){
  $(elemID).not(evt.target).popover('hide');
}

//Close all other popovers
function closeAllPopovers(){
  $('.popover').popover('hide');
}

//Allow to change the state, which means that we dont have to click twice to open the popover
$('body').on('hidden.bs.popover', function (e) {
    $(e.target).data("bs.popover").inState = { click: false, hover: false, focus: false }
});
