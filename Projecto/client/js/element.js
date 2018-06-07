function createHtml(elementType, elementChild, params){
  var element =  "<" + elementType + " " + params + ">" + elementChild + "</" + elementType + ">";
  return element;
}

function getSubString(string, maxLength){
  if(string.length > maxLength)                                                 //if the name of the file is bigger than 15 characteres
    return string.substring(0,maxLength-3) + "...";                             //add the first 12 and '...'
  else
    return string;
}

function getDivBackGroundImage(divInput){
  var bkg = eval(divInput).style.backgroundImage;
  if(bkg=="")
    bkg = 'url("/static/imgs/followmystepsBkg.png")';
  bkg = bkg.replace('url(','').replace(')','').replace(/\"/gi, "");
  return bkg;
}

function getElementIndexInArray(array, element){
	for (var index = 0; index < array.length; index++) {
		if(array[index].outerHTML == element.outerHTML)
      return index;
	}
}

//Center element in parent div
function centerElement(elemID, parentElemID, offset){
  var elementWidthPct = ($("#" + elemID).width() * 100)/$("#" + parentElemID).width();                          //Calculate the width percentage of the element according with the container (ex: settingsContainer)
  document.getElementById(elemID).style.left = offset - elementWidthPct/2 + "%";                                //Half of the container (or it should be) - the calculated percentage/2 (which allow to center the center if the element in the container)
}

function centerElementVertically(elemID, parentElemID, offset){
  var elementWidthPct = ($("#" + elemID).height() * 100)/$("#" + parentElemID).height();                          //Calculate the width percentage of the element according with the container (ex: settingsContainer)
  document.getElementById(elemID).style.top = offset - elementWidthPct/2 + "%";                                //Half of the container (or it should be) - the calculated percentage/2 (which allow to center the center if the element in the container)
}

function getElementChildrenIDArray(elemID){
    var childrenIDArray = [];
    $("#" + elemID).children().each(function(index){
      childrenIDArray.push(this.id);
    });
    return childrenIDArray;
}

function setElementTopPosition(elemID, top){
  var imagePosition = ($("#visualizationTypeImg").parent().width()/2) - ($("#visualizationTypeImg").width()/2);
  document.getElementById("visualizationTypeImg").style.left = imagePosition + "px";
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


function validateForm(formId, validationProperties){
	$('#' + formId).on('keyup keypress', function(e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode === 13) {
	    e.preventDefault();
	    return false;
	  }
	});

	$(document).ready(function() {
	    $('#' + formId).bootstrapValidator({
	        feedbackIcons: { valid: 'glyphicon glyphicon-ok', invalid: 'glyphicon glyphicon-remove', validating: 'glyphicon glyphicon-refresh'},
	        err: {container: 'popover'},
	        fields: validationProperties
	    });
	});
}

//Function that resizes text elements
//the maxchars represent the max lenght so that the size doesnt need to be resized
//the default value is the value without resize alteration and the limit value is the min or max value to apply to the text
//if valueFactor is positive increase the size otherwise decrease
function resizeTextElement(elementText, maxChars, defaultValue, limitValue, valueFactor){
	var textSize = defaultValue;                              //ex:2.5

	if(elementText.length > maxChars)
      textSize = defaultValue + (elementText.length - maxChars)*valueFactor;  //ex: 2.5 + (27 - 25)*(-0.1) = 2.3

  if(defaultValue > limitValue){ //decrease resizing
    if (textSize < limitValue)
      textSize = limitValue;
  }else {                         //increase resizing
    if (textSize > limitValue)
      textSize = limitValue;}

  return textSize  +'em';
}

function removeFromArrayByString(array, string){
  for (var index = 0; index < array.length; index++) {
    if (array[index] == string)
      array.splice(index, 1);
  }
}

function removeObjFromArrayByProperty(array, property){
  for (var index = 0; index < array.length; index++) {
    if (array[index].hasOwnProperty(property))
      array.splice(index, 1);
  }
}
