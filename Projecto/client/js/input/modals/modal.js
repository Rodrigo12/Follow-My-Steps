function createModal(modalID, modalTitle, modalParagraph, buttons){
  //header
  var modalHeaderCloseBtn = createHtml('button', '&times;', 'type="button" class="close" data-dismiss="modal"');
  var modalHeaderTitle    = createHtml('h4', modalTitle, 'class="modal-title"');
  var modalHeader         = createHtml('div', modalHeaderCloseBtn + modalHeaderTitle, 'class="modal-header"');

  //body
  var modalBodyParagraph = createHtml('p', modalParagraph, '');
  var modalBody          = createHtml('div', modalBodyParagraph, 'class="modal-body"');

  //footer
  var modalFooterBtns = '';
  for (var currentModalBtn, index = 0; index < buttons.length; index++) {
    currentModalBtn = createHtml('button', buttons[index], 'type="button" class="btn btn-default" data-dismiss="modal"');
    modalFooterBtns += currentModalBtn;
  }
  var modalFooter = createHtml('div', modalFooterBtns, 'class="modal-footer"');

  //modal
  var modalContent = createHtml('div', modalHeader + modalBody + modalFooter, 'class="modal-content"');
  var modalDialog  = createHtml('div', modalContent, 'class="modal-dialog modal-sm"');
  var modal        = createHtml('div', modalDialog, 'class="modal fade" id="'+modalID+'" role="dialog"');

  $('body').append(modal);
}

//////PLUGINS MODAL////////
//Insert the buttons, inside the array, on the modal
function createModalButtons(modalID, buttons){
  for(var btn, index = 0; index < buttons.length; index++){
    btn = createHtml('button', buttons[index], 'type="button" class="btn btn-default modalFooterBtn"');
    $($("#"+modalID+" .modal-footer")[0]).append(btn);                                               //Append the button to the modal footer
  }
}


//Insert the buttons, inside the array, on the modal
function createModalCheckBoxes(modalID, checkBoxes){
  var containers = '';
  for(var top, container, label, input, index = 0; index < checkBoxes.length; index++){
    top = 20*(index);
    input = createHtml('input', '', 'type="radio" name="optradio" value="' + index + '"');
    label = createHtml('label', input + checkBoxes[index], 'style="position:absolute; top:'+top+'px; left:0%;"');

    container  =  createHtml('div', label, 'class="radio"');
    containers += container;
  }
  var form = createHtml('form', containers, "id='"+modalID + "Form'");
  $($("#" + modalID + " .modal-footer")[0]).append(form);                                               //Append the button to the modal footer
}



function createModalContentButtons(buttons){
  var buttonsHtml = '';
  for(var btn, index = 0; index < buttons.length; index++){
    btn         =  createHtml('button', getSubString(buttons[index], 12), 'type= "button" class= "modalContentButton btn btn-default btn-sm" value="'+buttons[index]+'" style="margin:5px;width:100px;"')
    buttonsHtml += btn;
  }

  $($("#columnModal .modal-body")[0]).append(buttonsHtml);
}

$(document).on('click', '.modalContentButton', function(evt){
  $("#buttonSelected").val(evt.target.value);
});


function createModalContentPhotos(photoURL){
  var img = createHtml('img', '', 'src="'+photoURL+'" style="width:80%; margin-left:10%;"');
  $($("#photosModal .modal-body")[0]).append(img);
  createModalContentInput(img.value, "Add a description to the photo");
}



function createModalContentInput(description, placeholder){
  var inputField = createHtml('input', '', 'type="text" id="photoDescriptionField" class="form-control" placeholder="'+placeholder+'"  style="display:block;width:80%; margin-top:3%;margin-right:auto;margin-left:auto;"');
  $($("#photosModal .modal-body")[0]).append(inputField);
}



function createModalFooter(modalID, footerObj){
  if('checkBoxes' in footerObj)
    createModalCheckBoxes(modalID, footerObj.checkBoxes);

  if('buttons' in footerObj)
    createModalButtons(modalID, footerObj.buttons);
}



function cleanModalFields(modalID){
  $($("#"+modalID+" .modal-body")[0]).empty();
  $($("#"+modalID+" .modal-footer")[0]).empty();
}



//The basic modal structure with a title, subtitle, content and buttons
//The callback calls a function that defines what is inside the conten ex:createModalSelect
//The options is the set of parameters for that same callback ex:Porto, Benfica, Sporting in a select
function updateModal(modal, title, secondaryTitle, footerObj, callback, options){
  var modalID = $(modal).attr('id');
  cleanModalFields(modalID);

  $($("#" + modalID + " .modal-title")[0]).html(getSubString(title.toUpperCase(), 34));
  $($("#" + modalID + " .modal-title")[0]).attr("position", "relative");
  $($("#" + modalID + " .modal-title")[1]).html(secondaryTitle);
  createModalFooter(modalID, footerObj);
  callback(options);
  $("#" + modalID).modal('show');
}





//After reading the file, create a modal to select the column that represent the timespan
function callColumnModal(evt, elemId, files, index, objValue, inputValues, data){
  var file     = files[index];
  var fileName = file.name;
  $("#columnModalContainer").load("/static/views/modals/modal.dust", function(){
    var options = getColumns(data, "\n", ",");                       //the columns of the csv file
    var modalParentElement = $("#columnModalContainer").find('.modal')[0];
    $(modalParentElement).attr('id', 'columnModal');
    var secondaryTitle = "Select the column that represents the Timespan";
    var footerObj = {"buttons":["Ok", "Cancel"]};

    updateModal(modalParentElement, fileName, secondaryTitle, footerObj, createModalContentButtons, options);

    $('#columnModal').on('hidden.bs.modal', function () {
      var buttonSelected = $('#buttonSelected').val();
      if(buttonSelected == "" || buttonSelected == null || buttonSelected == "CancelButton"){ evt.target.value = ""; $("#modalFormID").val(""); }
      else{ $(elemId).val($(elemId).val() + "/|/" + $('#buttonSelected').val()); }

      var currentObj = objValue;
      currentObj['timestamp'] = ($("#buttonSelected").val()) ? buttonSelected : '-';
      updateCircleBarProgress(files, index, evt);
      addFileInfo(evt, files, inputValues, index+1);
    })
  });
}



//After reading the file, create a modal to select the column that represent the timespan
function callPhotosModal(evt, elemId, files, index, objValue, inputValues, data){
  var file = files[index];
  $("#photosModalContainer").load("/static/views/modals/modal.dust", function(){
    var options = [data];
    var modalParentElement = $("#photosModalContainer").find('.modal')[0];
    $(modalParentElement).attr('id', 'photosModal');
    var secondaryTitle = "Photo selected";
    var footerObj = {"buttons":["Ok", "Cancel"], "checkBoxes":["Apply to all", "Don't show this"]};

    updateModal(modalParentElement, file.name, secondaryTitle, footerObj, createModalContentPhotos, options);

    $('#photosModal').on('hidden.bs.modal', function () {
      // var photosDetails = $('#photosDetails').val();
      // if(photosDetails == "" || photosDetails == null || photosDetails == "CancelButton"){ evt.target.value = "";  }
      // else{ $(elemId).val($(elemId).val() + "/|/" + $('#photosDetails').val()+ "/|/" + evt.target.value); }
      var selectedOpt = $('#photosModalForm input:radio:checked').val();
      if(selectedOpt == "0"){
        setDescriptionToAllImg(true);
        setImageDescription($("#photoDescriptionField").val());
      }else if (selectedOpt == "1") {
        setDontShowDescription(true);
      }

      var currentObj = objValue;
      currentObj['description'] = ($("#photoDescriptionField").val()) ? $("#photoDescriptionField").val() : '-';
      updateCircleBarProgress(files, index, evt);
      addFileInfo(evt, files, inputValues, index+1);
    })
  });
}
