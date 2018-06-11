var backgroundScrollApplyed = false;                                                      //index for browsing in the visualizationsObj

///////////////FIRST SECTION OF BACKGROUND IMAGE MENU///////////////
//choose between link or get server

function backgroundImagePicker(){
  //chose between images saved on server or external link
  var imageLink      = createHtml("img", "", "id='imageBkgLink'   class='bkgImageType' src='imgs/webLink.png'");
  var imageServer    = createHtml("img", "", "id='imageBkgServer' class='bkgImageType' src='imgs/serverImages.png'");
  var divImageLink   = createHtml("div", imageLink,   "id='divImageLink'   class='bkgSourceType' style='left:24%;' data-toggle='collapse' data-target='#divBkgLink' onclick='toogleBkgLink();' ");
  var divImageServer = createHtml("div", imageServer, "id='divImageServer' class='bkgSourceType' style='left:54%;' onclick='getImageData()'; ");

  //create text input if the user choosed the link
  var inputLinkSpan   = createHtml("span", '', 'id="inputLinkSpan" class="glyphicon glyphicon-chevron-right inputLinkSpan"');
  var inputLink       = createTextInput('inputBkgLink', inputLinkSpan, 'https://www.google.pt/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png', '', '', 11);
  var inputInsertText = createHtml("span", 'Insert Link:', 'id="inputInsertSpan"');
  var divBkgLink      = createHtml("div", inputInsertText+inputLink, 'id="divBkgLink" class="collapse"');

  $('#backgroundTitle').html('Background Image');
  $('#backgroundDetails').html( divImageServer + divImageLink + divBkgLink);
  $('#backgroundEditDetails').html('');

  var position = ["44px", "0px"];
  //move the actual content to the left while fading out
  fadeAndMove("backgroundDetails", 1.0, ANIMATIONTIME, function(){}, position, 'block');
}

//Function used to toogle between increase and decrease the link or server button in the background container
function toogleBkgLink(){
  if($('#divImageServer').css('opacity') == 1.0)
    resizeAndMoveBkgLink(180, 144, ['5%', '30%'], 0.0);
  else
    resizeAndMoveBkgLink(100, 80, ['25%', '24%'], 1.0);
}

//Function used to increase or decrease the link or server button in the background container
function resizeAndMoveBkgLink(divSize, imgSize, position, opacity){
  incrementAndMove('divImageLink', divSize, divSize, ANIMATIONTIME, null, position)
  incrementWidthAndHeight('imageBkgLink', imgSize, imgSize, ANIMATIONTIME, null);
  fade('divImageServer', opacity, ANIMATIONTIME, null, 'inline-block');
}

///////////////SECOND SECTION OF BACKGROUND IMAGE MENU///////////////
//getting and displaying information

function getImageData(){
  numberInfoLoadedDB = $('#backgroundDetails').find('.backgroundTypeContainer').length;
  $('#backgroundDetails').html('');
  var width = 540, height = 600;
  var containerFinalPosition      = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];
  //Increment and move the backgroundContainer and afterwards create the editable bkg elements
  incrementAndMove('settingsContainer', width, height, ANIMATIONTIME, null, containerFinalPosition);
  getDataFromServer('background', '/data', numberInfoLoadedDB, 'ImageHandler'); //send data to server with parameters
}

function backgroundImageHandler(data){
  imageHandler(data, 'backgroundDetails', 'background', 'ImageHandler');
}

///////////////THIRD SECTION OF BACKGROUND IMAGE MENU///////////////
//Edit background properties

//Change from source selecting to background edition
function changeToEditBkg(){
  var position = ["44px", "-30px"];
  //move the actual content to the left while fading out
  fadeAndMove("backgroundDetails", 0.0, ANIMATIONTIME, function(){
    $("#backgroundDetails").hide();
    showContainerChild('backgroundContent', ANIMATIONTIME, 2, "0px", "0px");
  }, position, function(){
    var width = 540, height = 600;
    var containerFinalPosition      = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];
    //Increment and move the backgroundContainer and afterwards create the editable bkg elements
    incrementAndMove('settingsContainer', width, height, ANIMATIONTIME, function(){
      createBackgroundElements($('#inputBkgLink').val(), $('#inputBkgLink').val());
    }, containerFinalPosition)
  });
}

//Function that creates the background preview menu and the other elements to edit it
function createBackgroundElements(imageSrc, imagePath){
  $('#backgroundTitle').html('Edit Background Image');

  //Create the preview Element
  var windowWidth  = window.innerWidth;
  var windowHeigth = window.innerHeight;
  var windowRatio  = 0.3;
  var backgroundPreview = createHtml('div', '', 'id="backgroundImagePreview" style="border:10px; border-style: solid; border-radius:10px;position:absolute; margin-top:30px; left:50%; transform: translate(-50%, -5%); height:'+(windowHeigth*windowRatio)+'px; width:'+(windowWidth*windowRatio)+'px; margin-bottom:1%;"');

  //Create the dropdown box Element
  var optionsRepeatInput = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'];
  var updateSelectRepeat = createSpecialInputSelect('updateSelectRepeat', ["65%", "15%"], 'Repeat: ______________', '', ["64%", "26%"], 100, optionsRepeatInput );

  var optionsAttachmentInput = ['fixed', 'scroll', 'local', 'initial', 'inherit'];
  var updateSelectAttachment = createSpecialInputSelect('updateSelectAttachment', ["75%", "15%"], 'Attachment: __________', '', ["74%", "30%"], 100, optionsAttachmentInput );

  var optionsPositionInput = ['left top', 'left center', 'left bottom', 'right top', 'right center', 'right bottom', 'center top', 'center center', 'center bottom'];
  var updateSelectPosition = createSpecialInputSelect('updateSelectPosition', ["65%", "60%"], 'Position: ___________', '', ["64%", "71%"], 100, optionsPositionInput );

  var optionsSizeInput = ['cover', 'contain', 'auto', '100% 100%'];
  var updateSelectSize = createSpecialInputSelect('updateSelectSize', ["75%", "60%"], 'Size: ______________', '', ["74%", "70%"], 100, optionsSizeInput );

  var button = createHtml("button", "Apply", "id='updateBkgButton' class='btn btn-default' type='button' style='position:absolute;top:85%;left:45%;'");

  //Add the element to the html
  $('#backgroundEditDetails').html(backgroundPreview + updateSelectRepeat + updateSelectAttachment + updateSelectPosition + updateSelectSize + button);

  //Update Preview with the options in the dropdown elements
  $("#backgroundImagePreview").css("background-image", "url('" + imageSrc + "')");
  $("#backgroundImagePreview").attr("alt", imagePath);
  $('#inputUpdateSizeWidth').val('100');$('#inputUpdateSizeHeight').val('100');
  var previewSize = parseInt($('#inputUpdateSizeWidth').val())*windowRatio + $('#updateSelectPositionWidth').val()  + " " + parseInt($('#inputUpdateSizeHeight').val())*windowRatio  + $('#updateSelectPositionHeight').val();
  updateBackgroundPreview($('#updateSelectRepeat').val(), $('#updateSelectAttachment').val(), $('#updateSelectPosition').val(), $('#updateSelectSize').val());
  createBkgEditEventListeners();
}

//Update handler
function updateBackgroundPreview(repeat, attachment, position, size){
  updateBkgPreviewRepeat(repeat);
  updateBkgPreviewPosition(position);
  updateBkgPreviewAttachment(attachment);
  updateBkgPreviewSize(size);
}

function updateBkgPreviewRepeat(repeat){$("#backgroundImagePreview").css("background-repeat", repeat);}
function updateBkgPreviewPosition(position){$("#backgroundImagePreview").css("background-position", position);}
function updateBkgPreviewAttachment(attachment){$("#backgroundImagePreview").css("background-attachment", attachment);}
function updateBkgPreviewSize(size){$("#backgroundImagePreview").css("background-size", size);}

function createBkgEditEventListeners(){
  $(document).on('change','#updateSelectRepeat',    function(){ updateBkgPreviewRepeat($('#updateSelectRepeat').val()); });
  $(document).on('change','#updateSelectAttachment',function(){ updateBkgPreviewAttachment($('#updateSelectAttachment').val()); });
  $(document).on('change','#updateSelectPosition',  function(){ updateBkgPreviewPosition($('#updateSelectPosition').val()); });
  $(document).on('change','#updateSelectSize ',     function(){ updateBkgPreviewSize($('#updateSelectSize').val()); });
}

$(document).on('click','#updateBkgButton',function(){
    updateApplyBkg();
    updateBackgroundOptions();
    hideContainer('settingsContainer', ANIMATIONTIME, ['5%', '95%'], hideContainerContent, hide);
  });

///////////////FOURTH SECTION OF BACKGROUND IMAGE MENU///////////////
//Applying to body's background

function updateApplyBkg(){
  $("body").css("background-image",      $("#backgroundImagePreview").css("background-image"));
  $("body").css("background-repeat",     $("#backgroundImagePreview").css("background-repeat"));
  $("body").css("background-position",   $("#backgroundImagePreview").css("background-position"));
  $("body").css("background-attachment", $("#backgroundImagePreview").css("background-attachment"));
  $("body").css("background-size",       $("#backgroundImagePreview").css("background-size"));
}


//create remove file container content
function createBackgroundStyleContent(){
  var backgroundTitle   = createHtml('h1', 'Background Image', 'id="backgroundTitle" style="text-align:center;margin-top:10%;margin-bottom:1%;"');

  //Bkg details
  var divBkgDetails     = createHtml('div', '', 'id="backgroundDetails"');

  //Bkg Edit details
  var divBkgEditDetails = createHtml('div', '', 'id="backgroundEditDetails" style="display:none"');

  $('#backgroundContent').html(backgroundTitle + divBkgDetails + divBkgEditDetails);
}

//update data in the server
function updateBackgroundOptions(){
  var backgroundObj = {};

  backgroundObj['repeat']     = $('#updateSelectRepeat').val();
  backgroundObj['attachment'] = $('#updateSelectAttachment').val() ;
  backgroundObj['position']   = $('#updateSelectPosition').val();
  backgroundObj['size']       = $('#updateSelectSize').val();

  backgroundObj['imageContent'] = $('#backgroundImagePreview').attr('alt');
  backgroundObj['type']         = 'background';

  sendDataToServer(backgroundObj, '/definitions', null);
}

//Load background data stored in the server
function backgroundLoad(objData){
  var imgUrl = (objData.hasOwnProperty('imageBase64')) ? objData.imageBase64 : objData.imageContent;
  $("body").css("background-image",      "url('" + imgUrl.replace('/|/', '') + "')");
  $("body").css("background-repeat",     objData.repeat);
  $("body").css("background-position",   objData.position);
  $("body").css("background-attachment", objData.attachment);
  $("body").css("background-size",       objData.size);
}
