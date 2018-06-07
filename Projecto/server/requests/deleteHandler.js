module.exports = {
  deleteFiles:deleteFiles
}

var dbInfo = require('../dbInfo.js'),
    pg = require('pg'),
    db = require('../dbCalls.js'),
    fileHandler = require('../file/fileHandler.js'),
    imageFile = require('../general/image.js'),
    application = require('../../app.js');


function deleteFiles(req, res){
  var filename  = req.body.filename;
  var extension = fileHandler.getFileExtention(filename);
  var table     = fileHandler.getTableByFileExtension(extension);

  console.log(filename);
  console.log(extension);
  console.log(table);

  var dbDeleteQuery = "DELETE FROM "+table+" WHERE filename = '"+filename+"';"
  dbDeleteQuery += "DELETE FROM files WHERE filename = '"+filename+"';"
  if (table == 'general')
    dbDeleteQuery += "DELETE FROM types WHERE filename = '"+filename+"';"
//console.log(dbDeleteQuery);
  pg.connect(dbInfo.connect, function(err, client, done){
    if(err){  return console.error('Error fetching client from pool on Delete Files', err);  }

    var callback = function() {
      if (res != null)
       res.send('Delete is done');

      if (imageFile.isImageFile(filename))
        application.sendSocketMessage('deleteFeedback', {name: filename, extension: 'photos'});
      else
        application.sendSocketMessage('deleteFeedback', {name: filename, extension: extension});

      done();
    }

    db.deleteFromDB(client, dbDeleteQuery, callback);
  });
}
