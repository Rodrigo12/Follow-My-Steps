var fileUpdateIntervalID, fileUpdateIntervalTime = 600000; //10 minutes by default

exports.fileUpdateIntervalID    = fileUpdateIntervalID;
exports.fileUpdateIntervalTime  = fileUpdateIntervalTime;

module.exports = {
  addFileToUpdate: addFileToUpdate,
  startInterval:startInterval,
  stopInterval:stopInterval,
  updateOptions:updateOptions
}

var fc = require('file-changed'),
    dbInfo = require('../dbInfo.js'),
    db = require('../dbCalls.js'),
    dbAux = require('../dbCallsAux.js'),
    pg = require('pg'),
    pluginHandler = require('../plugins/pluginsHandler.js'),
    conversion = require('../general/conversion.js'),
    postHandler = require('../requests/postHandler.js'),
    fileReader = require('read-file'),
    fileHandler = require('../file/fileHandler.js');

function stopInterval(){
  clearInterval(fileUpdateIntervalID);
}

function startInterval(){
  fileUpdateIntervalID = setInterval(function(){updateFiles();}, fileUpdateIntervalTime);
}

function updateOptions(req){
  var data = req.body;
  if (data.decision == 'I want') {
    stopInterval();
    var time = data.time.split(':');
    fileUpdateIntervalTime = conversion.convertToMilliseconds(parseInt(time[0]), parseInt(time[1]));
    updateFiles();
    startInterval();
    //console.log(fileUpdateIntervalID);
  }else{
    stopInterval();
    //console.log('stop timer');
  }
}

function updateFiles(){
  var filesChanged = fc.check();
  console.log('filesChanged: ' + filesChanged);
  if (areChangedFiles(filesChanged)) {
    pg.connect(dbInfo.connect, function(err, client, done){
      for (var fileName, timestamp, fileExtension, table, index = 0; index < filesChanged.length; index++) {
        fileName      = fileHandler.getFileName(filesChanged[index]);
        fileExtension = fileHandler.getFileExtention(filesChanged[index]);
        table         = fileHandler.getTableByFileExtension(fileExtension);

        if (table == 'photos') {
          continue;
        }else if (table == 'general') {
          var parameters = [filesChanged[index], fileExtension, table, fileName];
          dbAux.getTimestamp(client, parameters, function (params, timestampKey){
            readAndUpdateFile(params[0],params[1],params[2],params[3],timestampKey);
          });
        }else{
          readAndUpdateFile(filesChanged[index], fileExtension, table, fileName, '');
        }
      }
    });

  }else{
    console.log('Empty');
    return [];
  }
}

function readAndUpdateFile(fileChanged, fileExtension, table, fileName, timestampKey){
  removeFileDataFromDB(fileChanged, table);
  fileReader(fileChanged, 'utf8', function(err, buffer) {
    if(err){  return console.error('Error reading file', err);  }

    var req          = {};
    req.body         = {};
    req.body.message = JSON.stringify(buffer) + '|:|' + fileName;
    req.body.table   = table;
    req.body.plugin  = fileExtension;
    req.body.filePath= fileChanged;
    req.body.fileName= fileName;


    if (table == 'general'){
      var data = buffer;
      if (fileExtension == 'xlsx')
        data = conversion.convertToCSV(fileChanged);
      req.body.message = JSON.stringify(data) + '|:|' + fileName + '/|/' + timestampKey;
    }

    postHandler.postPluginHandler(req, null, true);
    //console.log('fileReaderEnded');
  });
}

function removeFileDataFromDB(filePath, table){
  pg.connect(dbInfo.connect, function(err, client, done){
    db.deleteRowDB(client, table, "source="+"'"+filePath+"'", done);    //delete from the table where the data was stored
    //db.deleteRowDB(client, 'files', 'source='+filePath);  //delete from the files
    db.deleteRowDB(client, 'types', "source="+"'"+filePath+"'", done);  //delete from the types table
    fc.update(filePath).save();
  });
}

function areChangedFiles(files){
  if (files.length != 0)
    return true;
  return false;
}

function addFileToUpdate(filePath){
  if (!fileHandler.isImage(filePath))         //since we only save the filepath of images if they get changed the image will change in the browser
    fc.addFile(filePath).update().save();
}
