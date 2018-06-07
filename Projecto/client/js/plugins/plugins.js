//Initial function that creates the container interface to upload files
function loadPlugins(){
  $('#plugins').html('');
  $('#submitButton').css('top', '314px');
  appendNewInput();
  $('#plugin'+pluginsNumber).load("/static/views/plugins/plugins.dust", function(){                                          //Load the plugin template
    addFileWidth = 300, addFileHeight = 350;
    createEventListeners();
  });
}

function changeInputFieldData(evt){
  var parent = evt.target.parentElement;
  var fileName, iconSource;
  var imgNameExtension;

  if (isFolder()) {
    fileName = evt.target.files[0].webkitRelativePath.split("/")[0];
  }else if(evt.target.files.length == 1){                                       //if number of files submitted is one
    var fileNameArray = (evt.target.files[0].name).split('.');                  //show the name of the file
    fileName = fileNameArray[0];
    for (var index = 1; index < fileNameArray.length; index++) {
      fileName += '.' + fileNameArray[index];
    }
  }else                                                                         //if number of files submitted is bigger than one
    fileName = evt.target.files.length + " Files";                              //show the number of files submitted

  fileName = getSubString(fileName, 14);

  iconSource = selectIconSource(evt);
  parent.getElementsByTagName('label')[0].getElementsByTagName('img')[0].src = iconSource;
  parent.getElementsByTagName('h3')[0].innerHTML = fileName;
}


function selectIconSource(evt){
  var iconSource, imgNameExtension;

  if(isFolder()){
    iconSource = "/static/imgs/pluginIcons/folderIcon.png";
  }else if(differentExtensions(evt.target.files)){
    iconSource = "/static/imgs/pluginIcons/filesIcon.png";
  }else if(isImageFile(evt.target.files[0].name)){
    iconSource = "/static/imgs/pluginIcons/photosIcon.png";
  }else{
    var imgNameExtensionArray = (evt.target.files[0].name).split('.');
    imgNameExtension = imgNameExtensionArray[imgNameExtensionArray.length-1] + "Icon.png";
    iconSource = "/static/imgs/pluginIcons/" + imgNameExtension;
  }
  return iconSource;
}

//check if input files have different extensions
function differentExtensions(files){
  var extension = getFileExtention(files[0].name);
  for (var index = 1; index < files.length; index++) {
    if(extension != getFileExtention(files[index].name)){
      if (!(isImageFile(files[0].name) && isImageFile(files[index].name)) )
        return true;
    }
  }
  return false;
}


function newInputField(){
  var widthOffset = 110, heightOffset = 90, numberPluginsPerRow = 3;
  var numberOfPlugins = $('.pluginDiv').length - 1;
  if(numberOfPlugins != 0 && (numberOfPlugins+1)%numberPluginsPerRow == 0){
    increaseContainerHeightSize(heightOffset, 1, createNewInputField);
  }else if(numberOfPlugins<numberPluginsPerRow){
    increaseContainerWidthSize(widthOffset, 1, createNewInputField);
  }else{
    createNewInputField();
  }
}

function increaseContainerHeightSize(heightOffset, factor, callback){
  var settingsContainerHeight = $("#settingsContainer").height();
  settingsContainerHeight += ($(".pluginDiv").height() + heightOffset)*factor;
  incrementHeight("settingsContainer", settingsContainerHeight, ANIMATIONTIME, callback);
  var submitButtonTop = $("#submitButton").position().top;
  var extra = (factor) ? 8 : 0;
  submitButtonTop += ($(".pluginDiv").height() + heightOffset)*factor + extra;
  moveVertical("#submitButton", submitButtonTop, ANIMATIONTIME);
  var settingsContainerTop = $("#settingsContainer").position().top;
  settingsContainerTop += (($(".pluginDiv").height() + heightOffset)/2)*(-1*factor);
  moveVertical("#settingsContainer", settingsContainerTop, ANIMATIONTIME);
}


function increaseContainerWidthSize(widthOffset, factor, callback){
  var settingsContainerWidth = $("#settingsContainer").width();
  var settingsContainerLeft = $("#settingsContainer").position().left;
  settingsContainerWidth += ($(".pluginDiv").width() + widthOffset)*factor;
  incrementWidth("settingsContainer", settingsContainerWidth, ANIMATIONTIME, callback);
  settingsContainerLeft += (($(".pluginDiv").width() + widthOffset)/2)*(-1*factor);
  moveHorizontal("#settingsContainer", settingsContainerLeft, ANIMATIONTIME);

}

//pluginsNumber is define in fileHandler
function createNewInputField(){
  pluginsNumber++;
  appendNewInput()
  $('#plugin'+pluginsNumber).load("/static/views/plugins/plugins.dust",function(){
    $('#plugin'+pluginsNumber).find('#file')
      .attr("id", 'file' + pluginsNumber)
    $('#plugin'+pluginsNumber).find('label')
      .attr("for", 'file' + pluginsNumber)
    $('#plugin'+pluginsNumber).css("opacity","0");
    fade('plugin'+pluginsNumber, 1, ANIMATIONTIME, null, 'inline-block');
    createSingleEventListeners('file'+pluginsNumber);
    if ($( ".switch" ).find("input").is( ":checked" )) {
      $('#plugin'+pluginsNumber).find('#file'+pluginsNumber).attr("webkitdirectory", "webkitdirectory");
    }
  });
}

function appendNewInput(){
  $('#plugins').append(
    $('<div/>')
      .attr("id", 'plugin' + pluginsNumber)
      .css("display","inline-block")
  );
}


function getCurrentInputPlugin(){
  var idNumber;
  console.log(pluginsNumber);
  if(pluginsNumber == 0)  idNumber="";                                          //If plugin number is 0 than return input with id='file'
  else idNumber=pluginsNumber;                                                //Otherwise return file and the number of the last input plugin created (ex:'file1')
  return $("#file" + idNumber);
}


function enableFoldersInput(inputPlugin){
  var pluginTitle = inputPlugin.parent().find('.pluginTitle')                   //Get plugin next input field
  pluginTitle.html("Select Folders");                                           //Change plugin title from 'Upload Files' to 'Upload Folders'
  $("#folderIcon").fadeIn(ANIMATIONTIME/4);                                     //Show folder icon
  $("#fileIcon").fadeOut(ANIMATIONTIME/4);                                      //Hide file icon
  inputPlugin[0].setAttribute("webkitdirectory", "webkitdirectory");            //Add attribute "webkitdirectory" to input, allowing folders upload
}

function enableFilesInput(inputPlugin){
  var pluginTitle = inputPlugin.parent().find('.pluginTitle');                  //Get plugin next input field
  pluginTitle.html("Select Files");                                             //Change plugin title from 'Upload Folders' to 'Upload Files'
  $("#fileIcon").fadeIn(ANIMATIONTIME/4);                                       //Hide folder icon
  $("#folderIcon").fadeOut(ANIMATIONTIME/4);                                    //Show file icon
  inputPlugin[0].removeAttribute("webkitdirectory");                            //Remove attribute "webkitdirectory" to input, allowing files upload
}


//Function that check if all input fields have file
function allInputFieldsFilled(){
  var inputsFilled = true;
  $('.pluginFile').each(function(){
    if($(this).val() == '')
      inputsFilled = false;
  });
  return inputsFilled;
}

//return all files info from inputs
function inputFieldsValuesObj(){
  var inputsFilledValues = [];
  $('.pluginFile').each(function(){
    if($(this).val() == '')
      continue;

    var objValue = {};
    objValue['filename'] = $(this).val();
    inputsFilledValues.push(objValue);
  });
  return inputsFilledValues;
}


function removeInputField(element){
  var widthOffset = 50, heightOffset = 75, numberPluginsPerRow = 3;
  var numberOfPlugins = $('.pluginDiv').length;

  if (numberOfPlugins == 2) //remove the plugin with data and keep the empty one
    $('#submitButton')[0].disabled = true;


  if(numberOfPlugins != 0 && (numberOfPlugins-1)%numberPluginsPerRow == 0){
    fade($(element)[0].id, 0, ANIMATIONTIME, function(){ $(element).remove(); increaseContainerHeightSize(heightOffset, -1, null);}, 'none');
  }else if(numberOfPlugins<=numberPluginsPerRow){
    fade($(element)[0].id, 0, ANIMATIONTIME, function(){ $(element).remove(); increaseContainerWidthSize(widthOffset, -1, null, 'none');});
  }else {
    fade($(element)[0].id, 0, ANIMATIONTIME, function(){ $(element).remove(); }, 'none');
  }
}
