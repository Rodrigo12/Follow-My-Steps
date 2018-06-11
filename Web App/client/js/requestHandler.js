var serverURL = 'http://localhost:3000';
var numberInfoLoadedDB = 0;

function showLoading(bool){
  if(bool)
    $("#loading").fadeIn("slow");
  else
    $("#loading").fadeOut("slow");
}


function sendDataToServer(dataToSend, endpoint, callback){
  showLoading(true);
  // console.log(dataToSend);
  $.ajax({
    type: 'POST',
    data: JSON.stringify(dataToSend),
    contentType: 'application/json',
    url: serverURL + endpoint,
    success: function(data) {
      console.log('success');                                                     //The server returned success
      showLoading(false);
      // index++;
      // if(index < size)
      //   callback(dataToSend, inputFields, index, size, endpoint);                 //Call this function as many times as the number of input fields with valid files
      if (callback)
        callback();
    },
    error: function (thrownError) {
        console.log("Error while posting: ");
        console.log(thrownError);
        showLoading(false);
      }
  });
}

function deleteDataInServer(dataToSend, endpoint, callback){
  // console.log(dataToSend);
  $.ajax({
    type: 'DELETE',
    data: JSON.stringify(dataToSend),
    contentType: 'application/json',
    url: serverURL + endpoint,
    success: function(data) {
      console.log('success');
      if (callback != null)
        callback();                 //Call this function as many times as the number of input fields with valid files
    },
    error: function (thrownError) {
        console.log("Error while getting: " + thrownError);
      }
  });
}

function getDataFromServer(dataType, endpoint, params, callbackSufix){
  var encoded = encodeURIComponent(params);
  var dates   = [new Date(startDate), new Date(endDate)];
  var url = serverURL + endpoint + "/" + dates + "/" + dataType + "/" + encoded;
 //console.log('getDataFromServer: ' + decodeURIComponent(url));
  var dataFromCache = getFromCache(url);
  if(dataFromCache != null && dataType != 'remove' && dataType != 'definition' && useCache){
    console.log('dataFromCache');
    setTimeout(function(){(window[dataType + callbackSufix]).apply(null, [dataFromCache]);}, 100);
    return;
  }

  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: url,
    success: function(data) {
      console.log("success");
      if (isException(data)) return;
      numberInfoLoadedDB += 9;
      (window[dataType + callbackSufix]).apply(null, [data]);
      if(dataType != 'remove' && dataType != 'definition' && useCache)
        updateCache(url, data);
    },
    error: function (thrownError) {
        console.log("Error while getting: " + thrownError);
      }
  });
}

function getDataFromServerToRefresh(elementID, chart, dataType, endpoint, params, callback){
  var encoded = encodeURIComponent(params);
  var dates   = [new Date(params[4]), new Date(params[5])];
  var url = serverURL + endpoint + "/" + dates + "/" + dataType + "/" + encoded;
// console.log('getDataFromServerToRefresh: ' + decodeURIComponent(url));
  var dataFromCache = getFromCache(url);
  if(dataFromCache != null && dataType != 'remove' && dataType != 'definition' && useCache){
    console.log('dataFromCache');
    (window[callback]).apply(null, [elementID, chart, dataFromCache]);
    return;
  }

  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: url,
    success: function(data) {
      console.log("success");
      (window[callback]).apply(null, [elementID, chart, data]);
      if(dataType != 'remove' && dataType != 'definition' && useCache)
        updateCache(url, data);
    },
    error: function (thrownError) {
        console.log("Error while getting: " + thrownError);
      }
  });
}

function isException(data){
  var dataContent = data;
  if (dataContent=='NO PHOTOS'){
    console.log("Database doesn't have photos");
    return true;
  }else if (dataContent=='NO MORE PHOTOS'){
    console.log("Database doesn't have more photos");
    return true;
  }
  return false;
}
