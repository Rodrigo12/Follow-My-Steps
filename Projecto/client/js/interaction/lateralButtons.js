var startDate = new Date(2000,0,1);
var endDate   = new Date();

var lateralButtonTimeout = null;
var lateralButtonHidden  = false;

function createAddVisualizationContainer(){
  var visualizationsDivs = "";
  for (var currentImage, currentDiv, currentText, currentKey, currentValue, index = 0; index < getObjectLength(visualizationsObj); index++) {
    currentKey   = getKeyByIndex(visualizationsObj, index);
    currentValue = getValueByKey(visualizationsObj, currentKey);

    currentImage = createHtml('img', '', 'class="visualizationPickerImage" src="./imgs/visualizations/'+currentKey+'.png" style="max-width:100%;max-height:75%; position:relative; left:50%; transform:translate(-50%, 0%);" alt="'+currentKey+'"');
    currentText  = createHtml('h5', currentValue, 'class="visualizationPickerText" style="position:relative;text-align:center;"');
    currentDiv   = createHtml('div', currentImage + currentText, 'class="visualizationPicker" style="position:relative; display:inline-block; width:200px; height:150px; margin-left:15px; margin-bottom:15px; border-radius:15px; border:1px solid rgba(0, 0, 0, 0.1); cursor:pointer;"');
    visualizationsDivs += currentDiv;
  }
  $("#visualizationContent").append(visualizationsDivs);
}

function updateInputDates(){
  setTimeout(function() {
    $(".date").each(function(index){
      var input = $(this).find('input')[0];
      var placeholderDate = (index == 0) ? startDate : endDate;
      input.placeholder = formatDate(new Date(placeholderDate), false);
    });
  }, 10);
}

function showLateralButtons(){
  $('.bodyLateralButton').each(function(index){
    moveHorizontal(this, '96%', ANIMATIONTIME + (index*100));
  });
}

function hideLateralButtons(){
  $('.bodyLateralButton').each(function(index){
    moveHorizontal(this, '110%', ANIMATIONTIME + (index*150));
  });
}
