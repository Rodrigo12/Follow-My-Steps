//Populate select with the possible removable files
function removePossibleFiles(data){
  var contentData = JSON.parse(data);
  var filesDivs = '';
  for (var fileName, currentTitle, parcialFilePathArray, parcialFilePath, removeBtn, currentObj, currentImg, currentFileName, currentExt, currentDiv, index = 0; index < contentData.length; index++) {
    currentObj   = contentData[index];

    if (currentObj.filename == null)
      continue;

    fileName     = currentObj.filename;
    currentExt   = (isImageFile(fileName)) ? 'photos' : getFileExtention(fileName);

    parcialFilePathArray = currentObj.source.split('/');
    parcialFilePath      = parcialFilePathArray[parcialFilePathArray.length-3]+'/'+parcialFilePathArray[parcialFilePathArray.length-2]+'/'+parcialFilePathArray[parcialFilePathArray.length-1];
    currentTitle         = '📄 File Path: ./' + parcialFilePath + '&#013 ⏱ File Last Update: ' + currentObj.lastupdated.replace(/GMT.*/, '');

    removeBtn       = createHtml('img', '', 'class="removableFileImg" src="./imgs/icons/containerIcons/originals/bin.png" style="position:absolute;top:3%;left:85%;transform:translate(-50%, 0%); width:20px; cursor:pointer;" alt="'+fileName+'"');
    currentImg      = createHtml('img', '', 'src="./imgs/pluginIcons/'+currentExt+'Icon.png" style="position:absolute;top:10%;left:50%;transform:translate(-50%, 0%); width:50px;"');
    currentFileName = createHtml('h6', getSubString(fileName, 15), 'style="position:absolute;width:100%;top:60%;left:0%; text-align: center;"');
    currentDiv      = createHtml('div', currentImg + currentFileName + removeBtn, 'class="removableFileDiv" title="'+currentTitle+'" data-container="body" style="position:relative;display:inline-block;margin:13px; margin-left:5px;width:120px;height:110px; "');

    filesDivs += currentDiv;
  }

  $('#removableFiles').html(filesDivs);
  $( '.removableFileDiv' ).tooltip();
}


//create remove file container content
function createRemoveFilesContent(){
  var removeTitle = createHtml('h1', 'Delete Files', 'id="removeTitle" style="text-align:center;margin:60px;"');

  //search box
  var inputSearch  = createHtml('input', '', "type='text' id='removeFilesSearch' class = 'form-control  input-sm' placeholder = 'Search Files...'");
  var spanSearch   = createHtml('span', '', "class='glyphicon glyphicon-search' style='position:absolute; top:30%; left:92%;'");
  var divFormGroup = createHtml('div', inputSearch + spanSearch, "class='form-group col-xs-9' style='margin-left:10px;'");

  //paragraph
  var paragraphFiles = createHtml('div', 'Files: _________', "style='position:absolute;top:28%;left:82%'");

  //files type select
  var opt1            = createHtml('option', 'All', '');
  var opt2            = createHtml('option', 'GPS', '');
  var opt3            = createHtml('option', 'CSV', '');
  var opt4            = createHtml('option', 'LIFE', '');
  var opt5            = createHtml('option', 'Excel', '');
  var opt6            = createHtml('option', 'Photos', '');
  var selectFilesType = createHtml('select', opt1+opt2+opt3+opt4+opt5+opt6, 'class="form-control updateSelect" id="removableFilesSelect" size="1" style="position:absolute; top:27%; left:87%;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divSelect       = createHtml('div', selectFilesType, 'class="form-group"');

  //removable files div
  var divRemovableFiles = createHtml('div', '', "id='removableFiles' style='position:relative;top:20px;margin:10px;width:100%;height:340px;overflow:scroll;'");

  $('#removeContent').html(removeTitle + divFormGroup + paragraphFiles + divSelect + divRemovableFiles);
}
