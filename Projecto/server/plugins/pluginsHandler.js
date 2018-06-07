module.exports = {
  pluginDecoder: callPluginDecoder
}

var life    = require('./life.js');
var csv     = require('./csv.js');
var photos  = require('./photos.js');
var gpx     = require('./gpx.js');
var xlsx    = require('./xlsx.js');

//Call the proper plugin (function)
function callPluginDecoder(target, content){
  if (!(typeof eval(target).formatDecoder === "function")) {         //If the (ex:csv.formatDecoder) is not declared alert "plugin not available"
      console.log('This plugin is not available');
      return null;
  }
  var databaseData = eval(target).formatDecoder(content);            //Get the data from the respective plugin
  return databaseData;                                               //Return the data to insert in the database
}
