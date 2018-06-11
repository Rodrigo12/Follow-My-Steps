module.exports = {
  uploadFile: uploadFile,
}

var fileReader = require('read-file'),
    conversion = require('../general/conversion.js'),
    finder = require('fs-finder'),
    fileHandler = require('../file/fileHandler.js'),
    imageFile   = require('../general/image.js'),
    postHandler = require('../requests/postHandler.js'),
    application = require('../../app.js');


function uploadFile(req, res){
  var files = req.body;
  var fileExtension, fileName, filesExtensionEqual = true;

  for (var table, index = 0; index < files.length; index++) {
    fileName      = files[index].filename;
    fileExtension = files[index].type;
    table         = fileHandler.getTableByFileExtension(fileExtension);

    if(index > 0 && fileExtension == files[index-1].type)//compare with the previous one (check if at least one is different)
      filesExtensionEqual = false;

    //console.log('filename: ' + fileName + ' table: ' + table + ' fileExtension: ' + fileExtension);

    if (table == 'general')
      readAndUploadFiles(fileName, table, fileExtension, files[index].timestamp);
    else if(table == 'photos')
      readAndUploadFiles(fileName, table, fileExtension, files[index].description);
    else
      readAndUploadFiles(fileName, table, fileExtension, '');
  }


  if(req.body.table!="life") {
    if (filesExtensionEqual) {
      if (imageFile.isImageFile(fileName))
       application.sendSocketMessage('uploadFeedback', {name: fileName, extension: 'photos'});
      else
       application.sendSocketMessage('uploadFeedback', {name: fileName, extension: fileHandler.getFileExtentionByName(fileName)});
    }else {
      application.sendSocketMessage('uploadFeedback', {name: files.length + ' Files', extension: 'files'});
    }
  }

  res.send('Done');
}


function readAndUploadFiles(fileName, table, fileExtension, propertyKey){
  console.log('fileName: ' + fileName + ' table: ' + table + ' extension: ' + fileExtension + ' propertyKey: ' + propertyKey);

  var filePath = finder.from('/Users/').findFirst().findFiles(fileName);
  if (table == 'photos') {
    var req          = {};
    req.body         = {};
    req.body.message = JSON.stringify([fileName, propertyKey]);  //propertyKey = description
    req.body.table   = table;
    req.body.plugin  = 'photos';
    req.body.filePath= filePath;
    req.body.fileName= fileName;

    postHandler.postPluginHandler(req, null, false);
    return;
  }


  fileReader(filePath, 'utf8', function(err, buffer) {
    if(err){  return console.error('Error reading file', err);  }

    var req          = {};
    req.body         = {};
    req.body.message = JSON.stringify(buffer) + '|:|' + fileName;
    req.body.table   = table;
    req.body.plugin  = (fileHandler.isImage(fileName)) ? 'photos' : fileExtension;
    req.body.filePath= filePath;
    req.body.fileName= fileName;

    if (table == 'general'){
      var data = buffer;
      if (fileExtension == 'xlsx')
        data = conversion.convertToCSV(filePath);
      req.body.message = JSON.stringify(data) + '|:|' + fileName + '/|/' + propertyKey; //propertyKey = timestamp
    }

    postHandler.postPluginHandler(req, null, false);
    //console.log('fileReaderEnded');
  });
}
