var MAXCACHESIZE = 50000000;  //in bytes
var useCache = true;
var cacheCurrentSize = 0;
var cacheObj = {}; //req : [res, date, timesUsed]

function getFromCache(request){
  if(cacheObj.hasOwnProperty([request])){
    cacheObj[request][1] = new Date();  //update date
    cacheObj[request][2] += 1;          //update times used
    return cacheObj[request][0];        //obj result
  }else
    return null;
}

async function updateCache(request, result){
  var date = new Date();
  var requestSize = request.length * 2 + result.length * 2 + date.toString().length * 2 + 4; //in bytes

  if (requestSize > MAXCACHESIZE) {
    console.log('Not enought space in cache');
    return;
  }else if(cacheCurrentSize + requestSize <= MAXCACHESIZE){ //check if doesn't surpasses the MAXCACHESIZE
    cacheObj[request] = [result, new Date(), 1];  //add request to cache
  }else{ //if surpasses the MAXCACHESIZE
    var keyToRemove, valueToRemove;
    for (var datesDiff, currentKey, currentValue, index = 0; index < getObjectLength(cacheObj); index++) {  //for each value in cache
      currentKey   = getKeyByIndex(cacheObj, index);
      currentValue = getValueByKey(cacheObj, currentKey);

      if (keyToRemove != null) {
        datesDiff = getDatesDiff(currentValue[1], valueToRemove[1]);  //get the date difference between input value and the current value in array
      }

      if (index == 0){ //if the first time running
        keyToRemove   = currentKey;   //add info to keyToRemove
        valueToRemove = currentValue; //add info to valueToRemove
      }else if (datesDiff < -1 && currentValue[1] <= valueToRemove[1]) { //if there are more than one day between dates
        keyToRemove   = currentKey;
        valueToRemove = currentValue;
      }
    }
    //console.log(cacheObj);
    var removeKeySize   = keyToRemove.length * 2; //get keytoremove size
    var removeValueSize = valueToRemove[0].length * 2 + valueToRemove[1].toString().length * 2 + 4; //get valuetoremove size
    cacheCurrentSize    -= (removeKeySize + removeValueSize);
    delete cacheObj[keyToRemove]; //remove from cache
    updateCache(request, result);
    return;
  }

  cacheCurrentSize =  parseFloat(cacheCurrentSize) + parseFloat(requestSize);
  return;
}



//create cache container content
function createCacheAdvancedContent(){
  var cacheTitle = createHtml('h1', 'Cache', 'id="cacheTitle" style="text-align:center;margin:60px;"');

  //select
  var opt1              = createHtml('option', 'I want', '');
  var opt2              = createHtml('option', "I don't want", '');
  var selectFromControl = createHtml('select', opt1 + opt2, 'id="cacheSelect" class="form-control updateSelect" size="1" style="position:absolute; top:153px; left:30px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFormGroup      = createHtml('div', selectFromControl, 'class="form-group"');

  //paragraph
  var paragraph = createHtml('p', " _____________ Follow My Steps to use an incorporated cache in order to improve the system's speed while performing requests to the server. <br/>Use ___ MB.", 'id="updateText" style="text-align:justify; margin:20px;"');

  //input
  var sizeInput = createSpecialInputText(['61%', '64%'], '', 'sizeSelect', ['59%', '84%'], 'sizeInput', ['175px', '35px'], 50, [""]);

  //update button
  var cacheButton = createHtml('button', 'Apply', 'id="cacheButton" class="btn btn-default" onclick="updateCacheOptionsServer();updateCacheOptions();"');

  $('#cacheContent').html(cacheTitle + divFormGroup + paragraph + sizeInput + cacheButton);
  $('#sizeInput').val('50');
}

function updateCacheOptions(){
  var maxCacheSize = $('#sizeInput').val();
  if ($('#cacheSelect').val() == 'I want') {
    useCache = true;
    MAXCACHESIZE = parseFloat(maxCacheSize)*1000000;
  }else{
    useCache = false;
  }

  hideContainer('settingsContainer', ANIMATIONTIME, ['11%', '95%'], hideContainerContent, hide);
}

function updateCacheOptionsServer(){
  var cacheObj = {};

  cacheObj['periodTime'] = $('#cacheSelect').val().replace('\'','|');
  cacheObj['size']       = $('#sizeInput').val();
  cacheObj['type']       = 'cache';

  sendDataToServer(cacheObj, '/definitions', null);
}

//Load cache data stored in the server
function cacheLoad(objData){
  $('#cacheSelect').val(objData.periodTime.replace('|','\''));
  $('#sizeInput').val(objData.size);

  updateCacheOptions(false);
}
