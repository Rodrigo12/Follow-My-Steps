var currentContainerID = null;                                                  //ID of the container that is currently opened

//Shows the content of the container interface to upload files (the plugins input and the submit button)
function showContainerChildren(elemID, time){
  var children = $( '#'+elemID ).children();
  //console.log('showContainerChildren of ' + elemID);
  for (var child, index = 0; index < children.length; index++) {
    child = children[index];
    $('#' + child.id).fadeIn(ANIMATIONTIME);
    $('#' + child.id).css({left:"0px",top:"0px"});
    fade(child.id, 1.0, ANIMATIONTIME, null, 'block');
  }
}

function showContainerChild(elemID, time, childIndex, top, left){
  //console.log('showContainerChild number ' + childIndex+ ' of ' + elemID);
  var children = $( '#'+elemID ).children();
  var child = children[childIndex];
  $('#' + child.id).fadeIn(ANIMATIONTIME);
  $('#' + child.id).css({left:left,top:top});
  fade(child.id, 1.0, ANIMATIONTIME, null, 'block');
}

function hideContainerContent(elemID, time, finalPosition){
  var children = $( '#'+elemID ).children();
  for (var child, index = 0; index < children.length; index++) {
    child = children[index];
    $(child).fadeOut(ANIMATIONTIME);
    $(child).css('display', 'none');
  }
  setTimeout(function (){hide(elemID, ANIMATIONTIME, finalPosition);},ANIMATIONTIME/1.4);
}

function definitionsHandler(data){
  //console.log(data);
  if (data == 'DEFINITIONS EMPTY') {
    loadPlugins();
  }else{
    var dataContent = JSON.parse(data);
    $('#visualizationsBody')[0].innerHTML = dataContent[0].htmlcontent;
    createInitialElements();
  }
}

function usingMobile(){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
    return true;
  else
    return false;
}
