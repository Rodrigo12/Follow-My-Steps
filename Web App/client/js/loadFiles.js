//OBJ with the css files information (path ex:plugins/plugins)
var cssArrayObj = {external:["bootstrap", {d3:["nv.d3.min"]}, {clockpicker:["clockpicker", "standalone"]}, {inputSlider:["inputSlider-1.0"]}, {circularPercentageBar:["circle"]}],
                   plugins:["plugins"],
                   none:["tooltip","menuClose","help", "settings", "toggleSwitch", "visualizations", "style", "slider", 'mapPopup', 'background', 'calendarHeatmap']};

//OBJ with the script files information (path ex:external/bootstrap)
var scriptArrayObj = {external:["bootstrap", "interact", {d3:["d3.min", "nv.d3.min"]}, {clockpicker:["clockpicker"]}, {inputSlider:["inputSlider-1.0"]}],
                      color:["color"],
                      map:["mapLeaflet"],
                      visualizations:["visualizations", "container", "previewsObjData", "text", "barChart", "image", "calendarHeatmap", "areaChart", "pieChart", "lineChart", "map", "mapAux", "mapOptions", "timeline"],
                      input:["inputText", "inputSlider", {dropdown: ["dropdown"]}, {modals: ["modal"]},{popover:["popover"]}],
                      slider:["slider"],
                      dragDrop:["dragDrop"],
                      plugins:["plugins"],
                      socket:["socketHandler"],
                      interaction:["commonInteraction", "interaction", "lateralButtons"],
                      animations: ["animations"],
                      conversions: ["time", "array", "xlsx", "numbers", "photo", "date", "coordinates"],
                      settings: [{advanced: ["cache", "report","save"]}, {files: ["addFiles", "updateFiles", "removeFiles"]}, {style: ["visualization", "background", "font"]}, "settings", "fileHandler"],
                      help:["help"],
                      timeline:["timeline"],
                      none:["feedback", "saveHandler", "object", "element", "main", "requestHandler"]}

//load all files and start loading plugins
function loadFiles() {
  loadFilesByObject("css", "", cssArrayObj);
  loadFilesByObject("js", "", scriptArrayObj);
  createContainersContent();
  loadPlugins();
  applyScroll("body", function(){ console.log('body applyScroll');$('#visualizationsBody').height($('body').height()); });
  getDataFromServer('definition', '/definitions', 'definitions', 'LoadData');
  $('body').css("visibility","visible");
  $('#visualizationsBodyBkg').css('width', window.innerWidth+'px');
  $('#visualizationsBodyBkg').css('height', window.innerHeight+'px');
}

function createContainersContent(){
  settingsCreateContent();

  createAddFilesContent();
  createUpdateFilesContent();
  createRemoveFilesContent();

  createVisualizationStyleContent();
  createBackgroundStyleContent();
  createFontStyleContent();

  createCacheAdvancedContent();
  createReportAdvancedContent();
  createSaveAdvancedContent();

  createAddVisualizationContainer();

  helpCreateContent();

  timelineCreateContent();
}

//load file passing an obj as input
function loadFilesByObject(type, scriptPath, objInput){
  var object = Object.keys(objInput);                                           //get object keys
  for (var index = 0; index < object.length; index++) {                         //loop through each key
    var currentObj = objInput[object[index]], currentKeyName = object[index];
    if(currentKeyName != "none")                                                //if its none it means that doesn't belong to a folder inside js folder (so don't add anything to the script path)
      scriptPath += currentKeyName + "/";
    for (var elem, scriptName, index2 = 0; index2 < currentObj.length; index2++) { //loop the array
      if (currentObj[index2] instanceof Object){                                //if is an object
        loadFilesByObject(type, scriptPath, currentObj[index2]);                //recursive call with scriptPath in the current folder
        continue;                                                               //continue to loop next iteration
      }
      if (type == "js")                                                         //if is of type js
        addScriptFiles(elem, scriptPath, currentObj[index2]);                   //add new script to the body
      else if(type == "css")                                                    //if is of type css
        addCssFiles(elem, scriptPath, currentObj[index2]);                      //add new css to the header
    }
    scriptPath = "";
  }
}

//Add script file to body element
function addScriptFiles(elem, scriptPath, scriptName) {
  elem = '<script src="/static/js/' + scriptPath + scriptName + '.js"></script>';                    //create the element
  $('body').append(elem);                                                                 //append to body
}

//Add css file to header element
function addCssFiles(elem, scriptPath, cssName) {
  elem = '<link rel="stylesheet" href="/static/css/'+ scriptPath + cssName + '.css"></script>';     //create the element
  $('head').append(elem);                                                                 //append to header
}
