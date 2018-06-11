function createFontStyleContent(){
  var fontTitle = createHtml('h1', 'Font', 'id="fontStyleTitle" style="text-align:center;margin:60px;"');

  //preview
  var textPreview    = createHtml('h3', 'Follow My Steps', 'style="text-align:center;margin:-20px;"');

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
  var selectFont = createHtml('select', opt0Font + opt1Font + opt2Font+ opt3Font+ opt4Font+ opt5Font+ opt6Font+ opt7Font + opt8Font + opt9Font + opt10Font + opt11Font + opt12Font + opt13Font, 'id="fontStyleSelect" class="form-control updateSelect fontStyleProperty" size="1" style="position:absolute; top:-5px; left:70px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFont    = createHtml('div', textFont + selectFont, 'class="form-group" style="position:absolute; top:220px; left:60px;"');

  // //font size
  // var optionsSizeFont   = ['px'];
  // var sizeInputFont = createSpecialInputText(['0px', '0%'], 'Font Size: ________________', 'fontSizeSelect', ['-7px', '73%'], 'fontSize', ['-25px', '30.5%'], 100, optionsSizeFont );
  // var divSizeFont   = createHtml('div', sizeInputFont, 'class="form-group" style="position:absolute; top:262.5px; left:60px; width:200px;"');

  //font shadow
  var fontShadowParagraph = createHtml('p', 'Font Shadow: _____________', 'style="position:absolute; top:262.5px; left:60px;"');
  var fontShadowInput1    = createInputText('fontShadowInput1', '', '', 'type="number" style="width:50px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:239px; left:120px;', 'specialSelect fontStyleProperty');
  var fontShadowInput2    = createInputText('fontShadowInput2', '', '', 'type="number" style="width:50px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:239px; left:170px;', 'specialSelect fontStyleProperty');
  var fontShadowSelect1   = createTextSelect('fontShadowSelect1', 'specialSelect fontStyleProperty', 'position:absolute; top:257px; left:165px; width:39px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', ['px'], 1);
  var fontShadowSelect2   = createTextSelect('fontShadowSelect2', 'specialSelect fontStyleProperty', 'position:absolute; top:257px; left:215px; width:39px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', ['px'], 1);
  var divShadowFont       = createHtml('div', fontShadowParagraph + fontShadowInput1 + fontShadowInput2 + fontShadowSelect1 + fontShadowSelect2);

  //font shadow color
  var colorTextShadowButton = createHtml('img', '', 'src="./imgs/icons/fontShadowColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
	var colorTextShadowLabel  = createHtml('label', colorTextShadowButton, 'for="fontShadowColor" style="position:absolute; top:0%; left:84%; width:30px; cursor:pointer;"');
	var colorInputShadowFont  = createHtml('input', '', 'id="fontShadowColor" class="fontStyleProperty" type="color" value="#BCBCBC" style="position:absolute;z-index:-1;opacity:0;"');
  var divColorShadowFont    = createHtml('div', colorTextShadowLabel + colorInputShadowFont, 'class="form-group" style="position:absolute; top:110px; left:420px;"');


  //font transform
  var textTransformFont   = createHtml('p', 'Font Transform: _____________', '');
  var opt1TransformFont   = createHtml('option', 'none', '');
  var opt2TransformFont   = createHtml('option', 'uppercase', '');
  var opt3TransformFont   = createHtml('option', 'lowercase', '');
  var opt4TransformFont   = createHtml('option', 'capitalize', '');
  var selectTransformFont = createHtml('select', opt1TransformFont + opt2TransformFont+ opt3TransformFont+ opt4TransformFont, 'id="fontStyleTransformSelect" class="form-control updateSelect fontStyleProperty" size="1" style="position:absolute; top:-5px; left:95px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divTransformFont    = createHtml('div', textTransformFont + selectTransformFont, 'class="form-group" style="position:absolute; top:220px; left:280px;"');

  //letter spacing
  var optionsLetterSpacing = ['px'];
  var inputLetterSpacing   = createSpecialInputText(['0px', '0%'], 'Letter Spacing: _____________', 'letterSpacingSelect', ['-7px', '73%'], 'letterSpacingVis', ['-25px', '30.5%'], 100, optionsLetterSpacing );
  var divLetterSpacing     = createHtml('div', inputLetterSpacing, 'class="form-group" style="position:absolute; top:262.5px; left:280px; width:200px;"');

  //font color
  var colorTextButton = createHtml('img', '', 'src="./imgs/icons/fontColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
	var colorTextLabel  = createHtml('label', colorTextButton, 'for="colorInputFont" style="position:absolute; top:0%; left:84%; width:30px; cursor:pointer;"');
	var colorInputFont  = createHtml('input', '', 'id="colorInputFont" class="fontStyleProperty" type="color" value="#000000" style="position:absolute;z-index:-1;opacity:0;"');
  var divColorFont    = createHtml('div', colorTextLabel + colorInputFont, 'class="form-group" style="position:absolute; top:110px; left:380px;"');

  //apply paragraph
  var opt0Paragraph        = createHtml('option', 'Headers', '');
  var opt1Paragraph        = createHtml('option', 'Text', '');
  var applyParagraph       = createHtml('p', 'The previous options will be applied to ________________ elements', '');
  var selectApplyParagraph = createHtml('select', opt0Paragraph + opt1Paragraph, 'id="selectApplyParagraph" class="form-control updateSelect fontStyleProperty" size="1" style="position:absolute; top:-5px; left:264px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divApplyParagraph    = createHtml('div', applyParagraph + selectApplyParagraph, 'style="position:absolute; top:315px; left:60px;"');

  //apply button
  var fontStyleButton = createHtml('button', 'Apply', 'id="fontStyleButton" class="btn btn-default" style="position:absolute; top:350px; left:50%; transform:translate(-50%, 0%);"');

  $('#fontContent').html(fontTitle + textPreview + divFont + divColorFont + divTransformFont + divLetterSpacing + fontStyleButton + divShadowFont + divColorShadowFont + divApplyParagraph);

  $('#letterSpacingVis').val('0');
  $('#fontSize').val('25');
  $('#fontShadowInput1').val('0');
  $('#fontShadowInput2').val('0');
}

function updateStyleFontPreview(){
  var fontPreview       = $('#fontContent').find('h3')[0];
  var fontStyleSelect   = $('#fontStyleSelect').val();
  var colorFontStyle    = $('#colorInputFont').val();
  var fontTransform     = $('#fontStyleTransformSelect').val();
  var letterSpacingFont = $('#letterSpacingVis').val();
  var shadowTopFont     = $('#fontShadowInput1').val();
  var shadowLeftFont    = $('#fontShadowInput2').val();
  var shadowColorFont   = $('#fontShadowColor').val();

  $(fontPreview).css("font-family", fontStyleSelect);
  $(fontPreview).css("color", colorFontStyle);
  $(fontPreview).css("text-transform", fontTransform);
  $(fontPreview).css("letter-spacing", letterSpacingFont + 'px');
  $(fontPreview).css("textShadow", shadowTopFont + 'px ' + shadowLeftFont + 'px ' + shadowColorFont);
}

function updateStyleFont(sendServer){
  var containersText, containers = $('.container');
  var fontPreview       = $('#fontContent').find('h3')[0];
  var fontStyleSelect   = $('#fontStyleSelect').val();
  var colorFontStyle    = $('#colorInputFont').val();
  var fontTransform     = $('#fontStyleTransformSelect').val();
  var letterSpacingFont = $('#letterSpacingVis').val();
  var shadowTopFont     = $('#fontShadowInput1').val();
  var shadowLeftFont    = $('#fontShadowInput2').val();
  var shadowColorFont   = $('#fontShadowColor').val();
  var textType          = $('#selectApplyParagraph').val();

  $(containers).each(function(){
    if (textType == 'Headers')
      containersText = $(this).find("h1, h2, h3, h4");
    else if(textType == 'Text')
      containersText = $(this).find("h5, h6, p");
    else
      containersText = $(this).find("h1, h2, h3, h4, h5, h6, p, text");


    $(containersText).each(function(){
      $(this).css("font-family", fontStyleSelect);
      $(this).css("color", colorFontStyle);
      $(this).css("text-transform", fontTransform);
      $(this).css("letter-spacing", letterSpacingFont + 'px');
      $(this).css("textShadow", shadowTopFont + 'px ' + shadowLeftFont + 'px ' + shadowColorFont);
    });
  });

  updateFontOptions(sendServer);
  hideContainer("settingsContainer", ANIMATIONTIME, ["5%", "95%"], hideContainerContent);
}


function updateFontOptions(sendServer){
  var fontObj = {};

  fontObj['fontFamily']      = $('#fontStyleSelect').val();
  fontObj['fontShadow']      = $('#fontShadowInput1').val() + ' ' + $('#fontShadowSelect1').val() + ' ' + $('#fontShadowInput2').val() + ' ' + $('#fontShadowSelect2').val();
  fontObj['fontTransform']   = $('#fontStyleTransformSelect').val();
  fontObj['letterSpacing']   = $('#letterSpacingVis').val() + ' ' + $('#letterSpacingSelect').val();
  fontObj['applyTo']         = $('#selectApplyParagraph').val();
  fontObj['fontColor']       = $('#colorInputFont').val();
  fontObj['fontShadowColor'] = $('#fontShadowColor').val();
  fontObj['type']            = 'font';

  if (sendServer)
    sendDataToServer(fontObj, '/definitions', null);
}

//Load font data stored in the server
function fontLoad(objData){
  $('#fontStyleSelect').val(objData.fontFamily);
  $('#fontShadowInput1').val(objData.fontShadow.split(' ')[0]);
  $('#fontShadowSelect1').val(objData.fontShadow.split(' ')[1]);
  $('#fontShadowInput2').val(objData.fontShadow.split(' ')[2]);
  $('#fontShadowSelect2').val(objData.fontShadow.split(' ')[3]);
  $('#fontStyleTransformSelect').val(objData.fontTransform);
  $('#letterSpacingVis').val(objData.letterSpacing.split(' ')[0]);
  $('#letterSpacingSelect').val(objData.letterSpacing.split(' ')[0]);
  $('#colorInputFont').val(objData.fontColor);
  $('#fontShadowColor').val(objData.fontShadowColor);
  $('#selectApplyParagraph').val(objData.applyTo);

  updateStyleFontPreview();
  updateStyleFont(false);
}
