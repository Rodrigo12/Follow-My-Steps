var textVisualizationNumber = 0;
var textVisualizationObjArray = [];
var textVisualizationPreview;

function textContainerSetting(){
	createTextVisPreviewHeader();
	createTextVisualizationDetails();

	validateForm('visualizationForm', getFormValidators());

}


function createTextVisPreviewHeader(){
	$('.visualizationDetailsIcon').css('display', 'none');
	$('.noCircle').css('display', 'none');
	showVizualizationVariables();
	var textVisParentDiv = createHtml('div', '', 'id="textVisualizationPreviewDiv" class="textVisualization" style="position:relative;width:415px;left:50%;transform:translate(-53%, 100%);"');
	$('#visualizationHeaderPreview').html(textVisParentDiv);
  var textVisualizationPreview = createHtml('input', '', 'id="textVisualizationPreview" placeholder="Insert text here..."');
  $('#textVisualizationPreviewDiv').html(textVisualizationPreview);
}



function createTextVisualizationDetails(){
  //font size
  var optionsTextFontSize = ['px'];
  var inputTextFontSize   = createSpecialInputText(['0px', '0%'], 'Font Size: ________________', 'textFontSizeSelectTextVis', ['-7px', '73%'], 'textFontSizeTextVis', ['-25px', '28.5%'], 100, optionsTextFontSize );
  var divTextFontSize     = createHtml('div', inputTextFontSize, 'class="form-group" style="position:absolute; top:110px; left:60px; width:200px;"');

  //font family
  var textFont   = createHtml('p', 'Font Family: ______________', '');
  var opt0Font   = createHtml('option', '"Helvetica Neue", Helvetica, Arial, sans-serif', '');
  var opt1Font   = createHtml('option', 'Arial, Helvetica, sans-serif', '');
  var opt2Font   = createHtml('option', '"Arial Black", Gadget, sans-serif', '');
  var opt3Font   = createHtml('option', '"Comic Sans MS", cursive, sans-serif', '');
  var opt4Font   = createHtml('option', '"Courier New", Courier, monospace', '');
  var opt5Font   = createHtml('option', 'Impact, Charcoal, sans-serif', '');
  var opt6Font   = createHtml('option', 'Georgia, serif', '');
  var opt7Font   = createHtml('option', '"Lucida Console", Monaco, monospace', '');
  var opt8Font   = createHtml('option', '"Lucida Sans Unicode", "Lucida Grande", sans-serif', '');
  var opt9Font   = createHtml('option', '"Palatino Linotype", "Book Antiqua", Palatino, serif', '');
  var opt10Font  = createHtml('option', 'Tahoma, Geneva, sans-serif', '');
  var opt11Font  = createHtml('option', '"Times New Roman", Times, serif', '');
  var opt12Font  = createHtml('option', '"Trebuchet MS", Helvetica, sans-serif', '');
  var opt13Font  = createHtml('option', 'Verdana, Geneva, sans-serif', '');
  var selectFont = createHtml('select', opt0Font + opt1Font + opt2Font+ opt3Font+ opt4Font+ opt5Font+ opt6Font+ opt7Font + opt8Font + opt9Font + opt10Font + opt11Font + opt12Font + opt13Font, 'id="fontTextVisSelect" class="form-control updateSelect fontTextVisProperty" size="1" style="position:absolute; top:-5px; left:70px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFont    = createHtml('div', textFont + selectFont, 'class="form-group" style="position:absolute; top:152.5px; left:60px;"');

  //font shadow
  var fontShadowParagraph = createHtml('p', 'Font Shadow: _____________', 'style="position:absolute; top:195px; left:60px;"');
  var fontShadowInput1    = createInputText('fontShadowTextVisInput1', '', '', 'type="number" style="width:50px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:171px; left:120px;', 'specialSelect fontTextVisProperty');
  var fontShadowInput2    = createInputText('fontShadowTextVisInput2', '', '', 'type="number" style="width:50px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:171px; left:170px;', 'specialSelect fontTextVisProperty');
  var fontShadowSelect1   = createTextSelect('fontShadowTextVisSelect1', 'specialSelect fontTextVisProperty', 'position:absolute; top:189px; left:165px; width:39px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', ['px'], 1);
  var fontShadowSelect2   = createTextSelect('fontShadowTextVisSelect2', 'specialSelect fontTextVisProperty', 'position:absolute; top:189px; left:215px; width:39px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', ['px'], 1);
  var divShadowFont       = createHtml('div', fontShadowParagraph + fontShadowInput1 + fontShadowInput2 + fontShadowSelect1 + fontShadowSelect2);

  //font shadow color
  var colorTextShadowButton = createHtml('img', '', 'src="./imgs/icons/fontShadowColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
	var colorTextShadowLabel  = createHtml('label', colorTextShadowButton, 'for="fontTextVisShadowColor" style="position:absolute; top:0%; left:84%; width:30px; cursor:pointer;"');
	var colorInputShadowFont  = createHtml('input', '', 'id="fontTextVisShadowColor" class="fontTextVisProperty" type="color" value="#BCBCBC" style="position:absolute;z-index:-1;opacity:0;"');
  var divColorShadowFont    = createHtml('div', colorTextShadowLabel + colorInputShadowFont, 'class="form-group" style="position:absolute; top:5px; left:420px;"');


  //font transform
  var textTransformFont   = createHtml('p', 'Font Transform: ___________', '');
  var opt1TransformFont   = createHtml('option', 'none', '');
  var opt2TransformFont   = createHtml('option', 'uppercase', '');
  var opt3TransformFont   = createHtml('option', 'lowercase', '');
  var opt4TransformFont   = createHtml('option', 'capitalize', '');
  var selectTransformFont = createHtml('select', opt1TransformFont + opt2TransformFont+ opt3TransformFont+ opt4TransformFont, 'id="fontTextVisTransformSelect" class="form-control updateSelect fontTextVisProperty" size="1" style="position:absolute; top:-5px; left:95px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divTransformFont    = createHtml('div', textTransformFont + selectTransformFont, 'class="form-group" style="position:absolute; top:237.5px; left:60px;"');


  //text decoration
  var textTextDecoration   = createHtml('p', 'Text Decoration: ____________', '');
  var opt0TextDecoration   = createHtml('option', 'none', '');
  var opt1TextDecoration   = createHtml('option', 'underline', '');
  var opt2TextDecoration   = createHtml('option', 'overline', '');
  var opt3TextDecoration   = createHtml('option', 'line-through', '');
  var selectTextDecoration = createHtml('select', opt0TextDecoration + opt1TextDecoration + opt2TextDecoration + opt3TextDecoration, 'id="textVisDecorationSelect" class="form-control updateSelect fontTextVisProperty" size="1" style="position:absolute; top:-5px; left:105px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divTextDecoration    = createHtml('div', textTextDecoration + selectTextDecoration, 'class="form-group" style="position:absolute; top:110px; left:280px;"');

  //text overflow
  var textTextOverflow   = createHtml('p', 'Text Overflow: ______________', '');
  var opt0TextOverflow   = createHtml('option', 'none', '');
  var opt1TextOverflow   = createHtml('option', 'clip', '');
  var opt2TextOverflow   = createHtml('option', 'ellipsis', '');
  var selectTextOverflow = createHtml('select', opt0TextOverflow + opt1TextOverflow + opt2TextOverflow, 'id="textVisOverflowSelect" class="form-control updateSelect fontTextVisProperty" size="1" style="position:absolute; top:-5px; left:95px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divTextOverflow    = createHtml('div', textTextOverflow + selectTextOverflow, 'class="form-group" style="position:absolute; top:152.5px; left:280px;"');

  //text align
  var textTextAlign   = createHtml('p', 'Text Align: _________________', '');
  var opt0TextAlign   = createHtml('option', 'center', '');
  var opt1TextAlign   = createHtml('option', 'left', '');
  var opt2TextAlign   = createHtml('option', 'right', '');
  var opt3TextAlign   = createHtml('option', 'justify', '');
  var selectTextAlign = createHtml('select', opt0TextAlign + opt1TextAlign + opt2TextAlign + opt3TextAlign, 'id="textVisAlign" class="form-control updateSelect fontTextVisProperty" size="1" style="position:absolute; top:-5px; left:90px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divTextAlign    = createHtml('div', textTextAlign + selectTextAlign, 'class="form-group" style="position:absolute; top:195px; left:280px;"');


  //letter spacing
  var optionsLetterSpacing = ['px'];
  var inputLetterSpacing   = createSpecialInputText(['0px', '0%'], 'Letter Spacing: _____________', 'letterSpacingSelectTextVis', ['-7px', '50%'], 'letterSpacingTextVis', ['-25px', '25.5%'], 100, optionsLetterSpacing );
  var divLetterSpacing     = createHtml('div', inputLetterSpacing, 'class="form-group" style="position:absolute; top:237.5px; left:280px; width:280px;"');

  //font color
  var colorTextButton = createHtml('img', '', 'src="./imgs/icons/fontColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
	var colorTextLabel  = createHtml('label', colorTextButton, 'for="colorInputTextVisFont" style="position:absolute; top:0%; left:84%; width:30px; cursor:pointer;"');
	var colorInputFont  = createHtml('input', '', 'id="colorInputTextVisFont" class="fontTextVisProperty" type="color" value="#000000" style="position:absolute;z-index:-1;opacity:0;"');
  var divColorFont    = createHtml('div', colorTextLabel + colorInputFont, 'class="form-group" style="position:absolute; top:5px; left:380px;"');

  //apply button
  var fontStyleButton = createHtml('button', 'Apply', 'id="fontTextVisButton" class="btn btn-default" style="position:absolute; top:350px; left:50%; transform:translate(-50%, 0%);"');

  $('#visualizationDetails').html( divTextAlign+ divTextOverflow + divTextDecoration + divTextFontSize + divFont + divColorFont + divTransformFont + divLetterSpacing + fontStyleButton + divShadowFont + divColorShadowFont  );

	$('#visualizationDetails').css('top', '60px');
  $('#visualizationDetails').height('300px');

  $('#letterSpacingTextVis').val('0');
  $('#fontShadowTextVisInput1').val('0');
  $('#fontShadowTextVisInput2').val('0');
  $('#textFontSizeTextVis').val('21');
}


function updateTextPreview(){
  var fontPreview       = $('#textVisualizationPreview');
  var fontSize          = $('#textFontSizeTextVis').val();
  var fontSizeType      = $('#textFontSizeSelectTextVis').val();
  var fontFamily        = $('#fontTextVisSelect').val();
  var colorFontStyle    = $('#colorInputTextVisFont').val();
  var fontTransform     = $('#fontTextVisTransformSelect').val();
  var shadowTopFont     = $('#fontShadowTextVisInput1').val();
  var shadowLeftFont    = $('#fontShadowTextVisInput2').val();
  var shadowColorFont   = $('#fontTextVisShadowColor').val();
  var textVisDecoration = $('#textVisDecorationSelect').val();
  var textVisOverflow   = $('#textVisOverflowSelect').val();
  var textVisAlign      = $('#textVisAlign').val();
  var letterSpacingFont = $('#letterSpacingTextVis').val();

  $(fontPreview).css("color", colorFontStyle);

  $(fontPreview).css("font-size", fontSize + fontSizeType);
  $(fontPreview).css("font-family", fontFamily);
  $(fontPreview).css("textShadow", shadowTopFont + 'px ' + shadowLeftFont + 'px ' + shadowColorFont);
  $(fontPreview).css("text-transform", fontTransform);
  $(fontPreview).css("text-decoration", textVisDecoration);
  $(fontPreview).css("text-overflow", textVisOverflow);
  $(fontPreview).css("text-align", textVisAlign);
  $(fontPreview).css("letter-spacing", letterSpacingFont + 'px');
}

function textVisualizationElement(){
	if ($('#textVisualizationPreview').val() == '')
		$('#textVisualizationPreview').val('Text');

	textVisualizationNumber += 1;
  var textParentDiv = createHtml('div', '', 'id="textVisualization'+ textVisualizationNumber +'" class="textVisualization visualization" style="display: table; max-width: 50%; min-width: 100px;"');
  $('#visualizationsBody').append(textParentDiv);
  var spans = createVisualizationButtons('textVisualization'+ textVisualizationNumber);
	$('#textVisualization'+ textVisualizationNumber).append(spans);

	var textProperties = {
													fontSize: 			$('#textFontSizeTextVis').val() + $('#textFontSizeSelectTextVis').val(),
													fontFamily: 		$('#fontTextVisSelect').val(),
													fontShadow: 		$('#fontShadowTextVisInput1').val() + 'px ' + $('#fontShadowTextVisInput2').val() + 'px ' + $('#fontTextVisShadowColor').val(),
													fontTransform:  $('#fontTextVisTransformSelect').val(),
													textDecoration: $('#textVisDecorationSelect').val(),
													textOverflow: 	$('#textVisOverflowSelect').val(),
													textAlign: 			$('#textVisAlign').val(),
													letterSpacing: 	$('#letterSpacingTextVis').val() + 'px',
													color: 					$('#colorInputTextVisFont').val()
											 };

	addTextVisualization('textVisualization'+ textVisualizationNumber, $('#textVisualizationPreview').val(), textProperties);
	hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}

function addTextVisualization(textVisID, textContent, textProperties){
	var textVisualization = createHtml('p', textContent, "id='textVisText"+textVisualizationNumber+"'");
	$('#'+textVisID).append(textVisualization);

	//$('#'+textVisID).css('width', textProperties.fontSize * $('#textVisualizationPreview').val().length);

	textVisualization = $('#textVisText'+textVisualizationNumber);
	$(textVisualization).css("color", textProperties.color);
	$(textVisualization).css("font-size", textProperties.fontSize);
	$(textVisualization).css("font-family", textProperties.fontFamily);
	$(textVisualization).css("textShadow", textProperties.fontShadow);
	$(textVisualization).css("text-transform", textProperties.fontTransform);
	$(textVisualization).css("text-decoration", textProperties.textDecoration);
	$(textVisualization).css("text-overflow", textProperties.textOverflow);
	$(textVisualization).css("text-align", textProperties.textAlign);
	$(textVisualization).css("letter-spacing", textProperties.letterSpacing);

	$(textVisualization).attr("alt", $(textVisualization).width() + ':' + $(textVisualization).height() + ':' + $(textVisualization).css('font-size'));
	addNewTextVisualizationObj(textVisID, textContent, textProperties, $(textVisualization).attr("alt"));
	//updateStyleAllVisualizations();	//update text on graphs after the graph update
}

function addNewTextVisualizationObj(textVisID, textContent, textProperties, textSizeContent){
	var textVisualizationObj = {};

	textVisualizationObj['id'] 						 = textVisID;
	textVisualizationObj['textContent'] 	 = textContent;
	textVisualizationObj['color'] 	 			 = textProperties.color;
	textVisualizationObj['fontSize'] 			 = textProperties.fontSize;
	textVisualizationObj['fontFamily'] 		 = textProperties.fontFamily;
	textVisualizationObj['fontShadow'] 		 = textProperties.fontShadow;
	textVisualizationObj['fontTransform']  = textProperties.fontTransform;
	textVisualizationObj['textDecoration'] = textProperties.textDecoration;
	textVisualizationObj['textOverflow'] 	 = textProperties.textOverflow;
	textVisualizationObj['textAlign'] 		 = textProperties.textAlign;
	textVisualizationObj['letterSpacing']  = textProperties.letterSpacing;
	textVisualizationObj['alt'] 					 = textSizeContent;

	textVisualizationObjArray.push(textVisualizationObj);
}

function textVisualizationLoad(objData, elementID, properties, filename){
	var textParentDiv = createHtml('div', '', 'id="'+ elementID +'" class="textVisualization visualization" style="display: table; max-width: 50%; min-width: 100px;"');
	$('#visualizationsBody').append(textParentDiv);
	var spans = createVisualizationButtons(elementID);
	$('#'+ elementID).append(spans);

	textVisualizationNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, textVisualizationNumber + 1); // update textVisualizationNumber

	addTextVisualization(elementID, objData, properties);
}
