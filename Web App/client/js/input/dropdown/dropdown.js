function createTextSelect(id, className, style, optionsInput, size){
  var options = '';
  for (var index = 0; index < optionsInput.length; index++) {
    options += createHtml('option', optionsInput[index], '');
  }
  var select       = createHtml('select', options, "class='form-control "+className+"' id='"+id+"' size='"+size+"' style='"+style+"'");
  return createHtml('div', select, 'class="form-group"');
}

function createDropdown(id, labelText, className, style, optionsInput){
  var label = createHtml("label", labelText, "for=" + id + "");
  var select = createHtml("select", createDropdownOptions(optionsInput), "id=" + id + " class = 'form-control input-sm "+ className +"'");
  var div = createHtml("div", label + select, "class='form-group col-xs-3' style='" + style + "'");
  return div;
}

function createDropdownOptions(options){
  for (var optionsElems = "", index = 0; index < options.length; index++) {
    optionsElems += "<option value='" + options[index][1] + "'>" + options[index][0] + "</option>";
  }
  return optionsElems;
}

function enableDropdownOptions(selectElement, optionToMatch){
  var optionIndex = null, updateOption = false;
  for (var selectedOption, currentOption, index = 0; index < selectElement.options.length; index++) { //loop through all options
    currentOption  = selectElement.options[index];                                                    //get current option
    selectedOption = getSelectOption(selectElement);                                                  //get the dropdown selected option
    if (optionToMatch == currentOption.value){                                                        //if the source of the column is the same
      currentOption.style.display = 'block';                                                          //then show this option
      //currentOption.disabled = false;
      if(optionIndex == null)                                                                         //and update optionIndex if it is null
        optionIndex = index;
    }else{
      currentOption.style.display = 'none';                                                           //otherwise don't show this option on the dropdown
      //currentOption.disabled = true;
      if (currentOption == selectedOption)                                                            //if this option is the option selected
        updateOption = true;                                                                          //then update the dropdown box option
    }
  }
  if (updateOption)
    selectOption(selectElement, optionIndex);
}

//enables all options in a dropdown/select element
function enableAllDropdownOptions(selectElement){
  for (var currentOption, index = 0; index < selectElement.options.length; index++) {
    currentOption = selectElement.options[index];
    currentOption.style.display = 'block';
  }
}

//select an option in a dropdown
function selectOption(selectElement, index){
  selectElement.options[index].selected = true;
}

function getSelectOption(selectElement){
  return selectElement.options[selectElement.selectedIndex];
}

function getSelectOptionText(selectElement){
  return selectElement.options[selectElement.selectedIndex].innerHTML;
}
