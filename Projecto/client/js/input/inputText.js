function createInputText(id, labelText, placeholder, properties, style, inputClass){
  var label = createHtml("label", labelText, "for=" + id + "");
  var input = createHtml("input", "", "id=" + id + " class = 'form-control  input-sm "+inputClass+"' placeholder = '"+placeholder+"' "+ properties +"  ");
  var div = createHtml("div", label + input, "class='form-group col-xs-3' style='" + style + "'");

  return div;
}

function createTextInput(id, labelText, placeholder, properties, style, colSize){
  var label = createHtml("label", labelText, "for=" + id + "");
  var input = createHtml("input", "", "id=" + id + " class = 'form-control  input-sm' placeholder = '"+placeholder+"' "+ properties +"  ");
  var div = createHtml("div", label + input, "class='form-group col-xs-"+colSize+"' style='" + style + "'");

  return div;
}

function createSearchInput(id, placeholder, properties, style, colSize){
  var span  = createHtml("span", "", "class='glyphicon glyphicon-search' style='position:absolute; top:30%; left:88%;'");
  var input = createHtml("input", "", "id=" + id + " class = 'form-control  input-sm' placeholder = '"+placeholder+"' "+ properties +"  ");
  var div   = createHtml("div",  input + span, "class='form-group col-xs-"+colSize+"' style='" + style + "'");

  return div;
}

function createInputDate(id, labelText, placeholder, date, labelProperties, divProperties){
  var label      = createHtml('label', labelText, labelProperties); //'<label '+ properties +'>'+labelText+'</label>
  var input      = createHtml('input', '', 'type="text" class="form-control input-sm specialSelect" placeholder="'+formatDate(date)+'"');//<input type="text" class="form-control" placeholder="'+formatDate(date)+'" />
  var span       = createHtml('span', '', 'class="glyphicon glyphicon-calendar"');
  var spanParent = createHtml('span', span, 'class="input-group-addon"');
  var dateDiv    = createHtml('div', input + spanParent, 'class="input-group date" id="'+id+'"' + divProperties);//<div class="input-group date" id="'+id+'">
  return label + dateDiv;
}

function createSpecialInputSelect(selectID, paragraphPosition, paragraphValue, selectClass, selectPosition, inputSizeWidth, options ){
  var paragraph = createHtml('p',  paragraphValue, 'style="position:absolute; top:'+paragraphPosition[0]+'; left:'+paragraphPosition[1]+';"');
  var select    = createTextSelect(selectID,  'specialSelect ' + selectClass, 'position:absolute; top:'+selectPosition[0]+'; left:'+selectPosition[1]+';width:'+inputSizeWidth+'px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', options, 1);

  return paragraph + select;
}


function createSpecialInputText(paragraphPosition, paragraphValue, selectID, selectPosition, inputID, inputPosition, inputSizeWidth, options ){
  var paragraph = createHtml('p',  paragraphValue, 'style="position:absolute; top:'+paragraphPosition[0]+'; left:'+paragraphPosition[1]+';"');
  var select    = '';
  var input     = '';

  if (options.length > 0 && options[0] == "") {
    input = createInputText(inputID, '', '', 'type="number" style="width:'+inputSizeWidth+'px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:'+inputPosition[0]+'; left:'+inputPosition[1]+';', 'specialSelect');
  }else if (options.length > 0) {
    select = createTextSelect(selectID,  'specialSelect', 'position:absolute; top:'+selectPosition[0]+'; left:'+selectPosition[1]+';width:'+inputSizeWidth+'px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', options, 1);
    input = createInputText(inputID, '', '', 'type="number" style="width:'+inputSizeWidth+'px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:'+inputPosition[0]+'; left:'+inputPosition[1]+';', 'specialSelect');
  }else{
    input = createInputText(inputID, '', '', 'type="text" style="width:'+inputSizeWidth+'px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:'+inputPosition[0]+'; left:'+inputPosition[1]+';', 'specialSelect');
  }

  return paragraph + select + input;
}

function createColorInput(id, properties, inputClass){
  var input = createHtml("input", "", "id=" + id + " class = ' "+inputClass+"' type='color' "+ properties +"  ");
  return input;
}

function createSpecialColorText(specialColorTextID, inputColorID, inputTextID, position){
  var newColor   = getRandomColor();
  var colorInput = createColorInput(inputColorID, 'value="'+newColor+'" style="cursor:pointer;position:absolute;top:5%;left:0%;z-index:5;"', 'colorMapLegendPicker');
	var textInput  = createSpecialInputText(['10%', '25%'], '_____________', '', ['',''], inputTextID, ['-40%', '5%'], 100, [] );
	var colorDiv   = createHtml('div', '', 'style="position:absolute;top:15%;left:0%;width:15px;height:15px;border-radius:15px;background-color:'+newColor+';border:1px solid white; box-shadow:1px 1px 6px #444;"');
  return createHtml('div', colorDiv + textInput + colorInput, 'id="'+specialColorTextID+'" class="colorLabelDiv" style="position:absolute;top:'+position[0]+';left:'+position[1]+';width:100px;height:50px;"');
}


function createSelectOptions(array){
  var options = '';
  for (var index = 0; index < array.length; index++) {
      options += createHtml('option', array[index], '');
  }
  return options;
}
