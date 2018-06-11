var MAXIMAGESVISUALIZATION = 9;
var imagesVizualizationSelected = [];
var imagesVizualizationSelectedPath = [];

var imagesNumber = 0;
var imagesObjArray = [];
var imageScrollApplyed = false;

function imageContainerSetting(data){

  $("#visualizationDetails").css('height', '395px');
	$("#visualizationDetails").css('top', '95px');
  $("#visualizationEditDetails").css('height', '350px');
  $("#visualizationEditDetails").css('top', '20px');

  createImageElements();
  imageHandler(data, 'visualizationDetails', 'image', 'ContainerSetting');
}

function imageHandler(data, containerID, dataType, functionSufix){
  var imageName    = data[0].split("/|/");
  var binaryImages = data[1].split("/|/");
  var imagePath    = data[2].split("/|/");

  for (var image = "", name = "", imageContainer = "", paramsString, index = 0; index < binaryImages.length; index++) {
    image = createHtml("img", "" ,"src= " + binaryImages[index] + " class='visualizationImageSelect' alt='"+imagePath[index]+"'");
    name  = createHtml("h5", getSubString(imageName[index],15), "class='imageTitleName'");
    imageContainer += createHtml("div", name + image, "class='"+dataType+"TypeContainer imageContainer' style='opacity:0;'");
  }

  var searchPhotoInput;
  if ($('#searchPhotoInput').length==0) {
    searchPhotoInput = createSearchInput('searchPhotoInput', 'Search for Image...', "class='searchImage'", 'position:absolute;top:10.5%;left:4.5%;border-radius:5px;z-index:10;', 7);
    $("#visualizationHeaderPreview").append(searchPhotoInput);
  }

  $('#loadingVisualizations').remove();
  $("#"+containerID).append(imageContainer);
  $('.imageContainer').each(function(){
    if ($(this).find('img').length == 1 && imagesVizualizationSelected.length == MAXIMAGESVISUALIZATION) {
      changeOpacity(this, 0.3, ANIMATIONTIME);
    }else {
      changeOpacity(this, 1.0, ANIMATIONTIME);
    }
  });

  if (dataType == 'background') {
    if(!backgroundScrollApplyed){
      applyScroll("#"+containerID, function(){  getDataFromServer(dataType, '/data', [numberInfoLoadedDB], functionSufix);  });
      backgroundScrollApplyed = true;
    }
  }else if(dataType == 'image'){
    if(!imageScrollApplyed){
      applyScroll("#"+containerID, function(){
        var numberOfImages = $('#imageVisualization'+imagesNumber).find('img').length;
        var params = [numberInfoLoadedDB, numberOfImages, $('#searchPhotoInput').val(), '', startDate, endDate];
        getDataFromServer(dataType, '/data', params, functionSufix);
      });
      imageScrollApplyed = true;
    }
  }
}

function getDisplayInformation(imagesMargin, numberOfImages, containerWidth, containerHeight, imagesMargin){
  var maxWidth, maxHeight, imageLeftType;
  if (numberOfImages<=3) {//one column
    maxWidth  = containerWidth - 2.2*imagesMargin;      //one column with two margins
    maxHeight = containerHeight/numberOfImages - (2.2 - numberOfImages*0.2)*imagesMargin;     //numberOfImages rows less the numberOfImages margins + 1 (ex:3 images and 4 margins)
    imageLeftType = 3;
  }else if (numberOfImages<=6) {//two columns
    maxWidth  = containerWidth/2 - 1.5*imagesMargin;
    maxHeight = containerHeight/3 - 1.5*imagesMargin;
    imageLeftType = 6;
  }else if (numberOfImages<=9) {//three columns
    maxWidth  = containerWidth/3 - 1.5*imagesMargin;
    maxHeight = containerHeight/3 - 1.5*imagesMargin;
    imageLeftType = 9;
  }
  return [maxWidth, maxHeight, imageLeftType];
}

//
function createImagesVisualization(width, height, imagesMargin, properties){
  var imagesInPreview = "";
  var numberOfImages  = imagesVizualizationSelected.length;
  var imageDisplayInfo = getDisplayInformation(imagesMargin, numberOfImages, width, height, imagesMargin);
  for (var left, top, currentImage, index = 0; index < imagesVizualizationSelected.length; index++) {
    top  = (imageDisplayInfo[1]+imagesMargin+1)*Math.floor(index/(imageDisplayInfo[2]/3));
    left = (imageDisplayInfo[0]+imagesMargin+1)*(index%(imageDisplayInfo[2]/3));
    currentImage     = createHtml('img', '', 'src="'+imagesVizualizationSelected[index]+'" class="visualizationImage" alt="'+imagesVizualizationSelectedPath[index]+'" style=" max-height:100%; max-width:100%; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);"');
    imagesInPreview += createHtml('div', currentImage, 'class="imageInVisualization draggable" style = "position:absolute; top:'+top+'px; left:'+left+'px; margin:'+imagesMargin+'px; width:'+imageDisplayInfo[0]+'px; height:'+imageDisplayInfo[1]+'px; "');
  }
  return createHtml('div', imagesInPreview, properties);
}

//Function that creates the background preview menu and the other elements to edit it
function createImageElements(){
  var divPreview = createImagesVisualization(300, 300, 5, 'id="imageDivPreview" class="imageDivPreview" style="position:absolute; left:50%; transform: translate(-50%, 0%); height:300px; width:300px; margin-bottom:1%; "');

  var optionsSizeInput = ['px', '%'];
  var widthSpecialInput  = createSpecialInputText(['100%', '5%'], 'Width:______________', 'imageSelectPositionWidth', ['98.5%', '24%'], 'inputImageSizeWidth', ['93.5%', '9%'], 100, optionsSizeInput );
	var heightSpecialInput = createSpecialInputText(['114%', '5%'], 'Height:_____________', 'imageSelectPositionHeight', ['112.5%', '24%'], 'inputImageSizeHeight', ['107.5%', '9%'], 100, optionsSizeInput );

  var optionsBorderInput   = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden'];
	var borderRadiusSpecialInput  = createSpecialInputText(['100%', '68%'], 'Border Radius:_______', 'borderRadiusSelect', ['98.5%', '91%'], 'borderImageRadius', ['93.5%', '76%'], 100, optionsSizeInput );
	var borderSpecialInput = createSpecialInputText(['114%', '68%'], 'Border:______________', 'borderImageSelect', ['112.5%', '88%'], 'borderImage', ['107.5%', '71.5%'], 100, optionsBorderInput );

  //visualizationImageDetails
  $('#visualizationEditDetails').html( divPreview + widthSpecialInput + heightSpecialInput + borderRadiusSpecialInput + borderSpecialInput);
  $("#visualizationEditDetails").css('top', '55px');

  $('#inputImageSizeWidth').val("300");$('#inputImageSizeHeight').val("300");
  $('#borderImageRadius').val("10");$('#borderImage').val("0");
}

function insertImage(width, height){
  var imagePreview = $('#imageDivPreview');
  var width        = $('#inputImageSizeWidth').val() ;
  var height       = $('#inputImageSizeHeight').val() ;
  var borderRadius 		 = $('#borderImageRadius').val();
	var borderRadiusType = $('#borderRadiusSelect').val();
	var borderImage  		 = $('#borderImage').val();
	var borderType	 		 = $('#borderImageSelect').val();

  var imagesVisualization = createImagesVisualization(width, height, 5, 'id="imageVisualization'+imagesNumber+'" class="imageVisualization visualization" style="position:relative; min-height:'+height+$('#imageSelectPositionHeight').val()+'; min-width:'+width+$('#imageSelectPositionWidth').val()+'; margin-bottom:1%;"');
  $('#visualizationsBody').append(imagesVisualization);
  var spans = createVisualizationButtons('imageVisualization'+imagesNumber);
	$('#imageVisualization'+imagesNumber).append(spans);

  $($('#imageVisualization'+imagesNumber).find('img')).each(function(){
    if($(this)[0].className == 'visualizationImage' ){
      $(this).css('border-radius', borderRadius + borderRadiusType );
      $(this).css('border', borderImage + "px " + borderType);
    }
  });

  var numberOfImages = $('#imageVisualization'+imagesNumber).find('img').length;
  //console.log(numberOfImages);
  var imageID = 'imageVisualization' + imagesNumber;
  $('#'+imageID).on('time',
									function (evt, param1){
                    var updateButton = $('#'+imageID).find('.updateVisualizationButton')[0];
                    var updateVis 	 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
                    if (updateAllVisualizations && updateVis) {
                      params = [numberInfoLoadedDB, numberOfImages, $('#searchPhotoInput').val(), '', startDate, endDate];
                      getDataFromServerToRefresh('#'+evt.target.id, null, 'image', '/data', params, 'imageUpdate');
                    }
						});

  imagesNumber++;
  imagesVizualizationSelected = [];
}

function imageUpdate(elementID, chart, data){
  var imgs    = $(elementID).find('.imageInVisualization');//divs containing images
  var dataSrc = data[1].split('/|/');
  for (var index = 0; index < imgs.length; index++) {
    $(imgs[index]).find('img')[0].src = dataSrc[index];//get image from each div
  }
}

function addImageObj(element){
  var elementID  = $(element)[0].id;
  console.log(element);
  var imagesContainer = $(element).find('.imageInVisualization');
  var imgContent      = element[0].outerHTML;

  var imageArray = imgContent.split('<img '), imagesPaths = [], imageContent = imageArray[0];
  console.log('imageArray.length = ' + imageArray.length);
  console.log(imageArray);
  console.log('imagesContainer.length = ' + imagesContainer.length);
  for (var currentImage, index = 1; index <= imagesContainer.length; index++) {
    imageContent +=  '<img INSERTSRC class="visualizationImage" ' + imageArray[index].replace(/src.*class=\"visualizationImage\"/g, '');
    currentImage = imagesContainer[index-1].getElementsByTagName('img')[0];
    if (currentImage.alt != '')
      imagesPaths.push(currentImage.alt);
  }

  var elementID = ($(element)[0].id.match('Preview')) ? ('imageVisualization' + (parseInt(imagesNumber) - 1)) : $(element)[0].id;

  var imgObj        = {};
  imgObj['id']      = elementID;
  imgObj['content'] = imageContent;
  imgObj['paths']   = imagesPaths;

  var obj = getObjWithValueInArray(imagesObjArray, 'id', elementID);
  if (obj != null){ //if it is on the array already update
    obj.content = imageContent;
    obj.paths   = imagesPaths;
  }else
    imagesObjArray.push(imgObj);
}

//save images changes during their use on the dashboard
function saveImagesChanges(imageElement){
  var imageParent = $(imageElement).closest('.visualization');
  if (imageParent!=null)
    addImageObj(imageParent);
}

function imageVisualizationLoad(objData, elementID, properties, filename){
  properties.content = JSON.parse(properties.content);
  imagesNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, imagesNumber + 1); // update imagesNumber
  var imageContentArray = objData.split('/|/');
  for (var index = 0, currentSrc; index < imageContentArray.length - 1; index++) {
    currentSrc = 'src=' + imageContentArray[index].replace('\"', '');
    properties.content = (properties.content).replace(/INSERTSRC/, currentSrc);
  }

  $('#visualizationsBody').append(properties.content);
  $('#visualizationsBody #imageDivPreview').attr('id', elementID);
  $('#'+elementID+' .visButtonsContainer').remove();//remove repeated elements
  $('#'+elementID+' .ui-resizable-handle').remove();//remove repeated elements
  $('#'+elementID).attr('class', 'imageVisualization visualization');
  addImageObj($('#'+elementID));
  var spans = createVisualizationButtons(elementID);
  $('#'+elementID).append(spans);
}
