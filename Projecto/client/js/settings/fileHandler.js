var descriptionToAll = false;
var imageDescription = "-";
var dontShowDescription = false;

var pluginsNumber = 0;
var invalidFile = false;

var addFileWidth = 0, addFileHeight = 0;

//object that contains the database name for each file extension
var extensionsObj = {life: "life", csv: "general", xlsx: "general", png: "photos", jpg: "photos",
                     gif: "photos", jpeg: "photos", gpx: "gpx"};

//Create Event Listeners
function createEventListeners(){
  var plugins = document.getElementsByClassName("pluginFile");
  for(var index = 0; index < plugins.length; index++){
    plugins[index].addEventListener('change', readFiles, false);
  }
}

//Create Event Listeners
function createSingleEventListeners(elemID){
  document.getElementById(elemID).addEventListener('change', readFiles, false);
}


//Validate file extension
function validateFileExtension(fileName){
  var fileNameArray = fileName.split('.');
  var fileExtension = fileNameArray[fileNameArray.length-1];
  if(fileExtension in extensionsObj || validatePhotoExtension(fileName))
    return true;
  return false;
}



//Validate if file is image
function validatePhotoExtension(fileName){
  if (isImageFile(fileName))
    return true;
  return false;
}


//Input field only accept files that have the same extension (ex: .csv)
function validateIfExtensionsEqual(files){
  var index = 0;
  for (;index < files.length; index++) {
    if (!isHiddenFile(files[index].name))
      break;
  }

  var fileExtension = files[index].name.split('.')[1];
  var isImage = false;
  if(isImageFile(files[index].name)) isImage = true;

  for (var index = 1; index < files.length; index++) {
    if (fileExtension != files[index].name.split('.')[1] && !isImageFile(files[index].name) && !isImage)        //Allow to submit images with diferent formats
        return false;
  }
  return true;
}



//Check if the file was previously inserted
///////MUST BE UPDATED TO FILE PATH////////
//////////////NOT FILE NAME////////////////
//////////////!!!WARNING!!!////////////////
function fileAlreadyInserted(files){
  var filledInputFields = getInputFieldsData('pluginFile');
  for (var file, index = 0; index < files.length; index++) {                                         //run all files uploaded
    file = files[index];
    for (var index2 = 0; index2 < (filledInputFields.length-1); index2++){                           //check all file input
      for (var fileName, index3 = 0; index3 < (filledInputFields[index2].files.length); index3++){   //check all files in each input
        fileName = filledInputFields[index2].files[index3].name;
        if(file.name == fileName)
          return true;
      }
    }
  }
  return false;
}

//runs everytime that files are added to an input field
function readFiles(evt){

  addFileInfo(evt, evt.target.files, [], 0);

  if (!invalidFile && allInputFieldsFilled()) {
    changeInputFieldData(evt);
    newInputField();
  }
}


function addFileInfo(evt, files, inputValues, index){
  if (index == 0)
    inputValues = [];
  else if(index == files.length){
    descriptionToAll    = false;
    dontShowDescription = false;
    if (!invalidFile){
      $($(evt.target.parentElement).find('input')[1]).val(JSON.stringify(inputValues)); //hidden input
      $('#submitButton')[0].disabled = false;
    }
    return;
  }

  var file = files[index];
  var extension = getFileExtention(file.name);
  var table     = getTableByFileExtension(extension);

  if (isHiddenFile(file.name) || table == 'unknown'){
    console.log('Unknown File: ' + file.name);
    invalidFile = true;
    addFileInfo(evt, files, inputValues, index+1);
    return;
  }

  invalidFile = false;
  readFile(evt, files, file, extension, table, index, inputValues);
}


function readFile(evt, files, file, extension, table, index, inputValues){
  var objValue = {};
  objValue['filename'] = file.name;
  objValue['type']     = extension;
  inputValues.push(objValue);

  if (table != "photos" && table != "general") {
    updateCircleBarProgress(files, index, evt);
    setTimeout(function(){    addFileInfo(evt, files, inputValues, index+1);  }, 0.0001);
  }else if(table == "photos" && (descriptionToAll || dontShowDescription)){
    objValue['description'] = (descriptionToAll) ? $("#photoDescriptionField").val() : '-';
    updateCircleBarProgress(files, index, evt);
    setTimeout(function(){    addFileInfo(evt, files, inputValues, index+1);  }, 0.0001);
  }else{
    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var content = e.target.result;
        var elemID  = "fileData"+pluginsNumber;

        if(isBinaryFile(extension))
          content = convertToCSV(content);

       if(table == "general")
         callColumnModal(evt, elemID, files, index, objValue, inputValues, content);
       else if(table == "photos" && !descriptionToAll && !dontShowDescription)
         callPhotosModal(evt, elemID, files, index, objValue, inputValues, content);

       if(evt.target.files[0])
         if(isImageFile(evt.target.files[0].name) && evt.target.files.length == 1)
           evt.target.parentElement.getElementsByTagName('label')[0].getElementsByTagName('img')[0].src = content;
      }

      if(isBinaryFile(extension))                                                   //if file is of type xlsx read as binary
        reader.readAsBinaryString(file);
      else if(isImageFile(file.name))
        reader.readAsDataURL(file);
      else                                                                                     //if file is of other types read as string
        reader.readAsText(file);

    } else {
      alert("Failed to load file");
    }
  }
}


function updateCircleBarProgress(files, index, evt){
  var parent, progressBar, percentageText;
  var numberOfFiles = files.length;
  var fileNumber    = index + 1;
  var barPercentage = Math.floor((fileNumber/numberOfFiles)*100);

  if(evt.target){
    parent         = evt.target.parentElement;
    progressBar    = $($(parent)[0]).find('.c100')[0];
    percentageText = $($(progressBar)[0]).find('span')[0];
    $(progressBar).attr('class', 'c100 p' + barPercentage + ' darkGray small');
    $(percentageText).html(barPercentage+'%');

    if (barPercentage > 0)
      $(percentageText).css('opacity', '1.0');

    if (barPercentage == 100) {
      $(progressBar).fadeOut( ANIMATIONTIME, function() {
        showCheckMark(evt);
       });
    };
  }
}

function getFileExtention(filePath){
  var fileDirectories       = filePath.split('/');
  var fileDirectoriesLength = fileDirectories.length;
  var file                  = fileDirectories[fileDirectoriesLength - 1];
  var extensionArray        = file.split('.');
  var extension             = file.split('.')[extensionArray.length - 1];

  return extension;
}


function getTableByFileExtension(fileExtension){
  if (!fileExtension)
    return 'unknown';

  if (fileExtension.match(/.*(xlsx|csv)$/i))
    return 'general';
  else if(fileExtension.match(/.*(life)$/i))
    return 'life';
  else if(fileExtension.match(/.*(gpx)$/i))
    return 'gpx';
  else if (fileExtension.match(/.*(jpg)$|.*(png)$|.*(gif)$|.*(jpeg)$/i))
    return 'photos';
  else
    return 'unknown';
}






function readMultipleFiles(evt, index){
    var numberOfFiles = evt.target.files.length;              //number of files uploaded
    if(index < numberOfFiles)
      readSingleFile(evt, index);
}


function isHiddenFile(fileName){
  if(fileName == ".DS_Store"){                                                 //Ignore Mac directory file
    return true;
  }
  return false;
}



function showCheckMark(evt){
  if(evt.target){
    var parent = evt.target.parentElement;
    var img = parent.getElementsByTagName("IMG")[0];
    img.src = "/static/imgs/checkmarkBlockIcon.gif";
    img.style.visibility = "visible";
  }
}




//Returns true if the file is img
function isImageFile(fileName){
  if(fileName.match(/.(jpg|jpeg|png|gif)$/i))
    return true;
  return false;
}



//Returns true if the file is binary
function isBinaryFile(fileExtension){
  if(fileExtension == "xlsx")
    return true;
  return false;
}



function insertOnImageArray(file, data){
  var description, imageArray = [];
  description = $("#photoDescriptionField").val();
  if (descriptionToAll)
    description = imageDescription;
  if (dontShowDescription)
    description = "-";

   return imageArray = convertToPhotoObj(file, data, description);
}


function setImageDescription (description){
  imageDescription = description;
}

function setDescriptionToAllImg(bool){
  descriptionToAll = bool;
}

function setDontShowDescription(bool){
  dontShowDescription = bool;
}


//Get columns from specific file (ex: from csv or excel)
function getColumns(data, delimiter1, delimiter2){
  var options = [];
  var firstSentence = (data.split(delimiter1))[0];
  for (var column, index = 0; index < (firstSentence.split(delimiter2)).length; index++) {
    column = firstSentence.split(delimiter2)[index];
    options.push(column);
  }
  return options;
}



//Count the number of the columns in the file (only used when alt=general)
function getNumberOfColumns(data, delimiter1, delimiter2){
  var firstSentence = data.split(delimiter1)[0];
  return (firstSentence.split(delimiter2)).length;
}

//Check if file submitted is a folder
function isFolder(){
  return $( ".switch" ).find("input").is( ":checked" );
}
