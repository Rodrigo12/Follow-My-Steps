module.exports = {
  saveDefinitions:saveDefinitions,
  getDefinitions:getDefinitions
}

var db                = require('../dbCalls.js'),
    dbInfo            = require('../dbInfo.js'),
    application       = require('../../app.js'),
    pg                = require('pg'),
    fileUpdateHandler = require('../file/fileUpdateHandler.js'),
    emailHandler      = require('./emailHandler.js');


function saveDefinitions(req, res){
  console.log('saveDefinitions');
  var contentData = req.body, type;

  if (contentData.hasOwnProperty('type') )
    type = contentData.type;
  else
    type = 'visualization';

  pg.connect(dbInfo.connect, function(err, client, done){
    if(err){  return console.error('error fetching client from pool', err);  }

    db.createTable(client, 'definitions', eval('dbInfo.definitionsTable'));
    if (contentData.length != 0 && type == 'visualization')//Visualizations
      db.deleteFromDB(client, "DELETE FROM definitions WHERE type = '"+type+"'", function (){ insertDefinitionsTable(client, res, type, contentData); });
    else if (type == 'save' || type == 'report' || type == 'visualizationsDetails' || type == 'background' || type == 'font' || type == 'cache')//Report || save || visualizationsDetails
      db.deleteFromDB(client, "DELETE FROM definitions WHERE type = '"+type+"'", function(){ insertDefinitionsTable(client, res, type, contentData); });
    else if (type == 'update')//update files
      db.deleteFromDB(client, "DELETE FROM definitions WHERE type = '"+type+"'", function(){ insertDefinitionsTable(client, res, type, contentData); fileUpdateHandler.updateOptions(req); });
    else//delete
      db.deleteFromDB(client, "DELETE FROM definitions WHERE type = 'visualization'", function(){console.log('test deleteFromDB');res.send('Records from Definitions deleted');});

    done();
  });
}

function insertDefinitionsTable(client, res, type, contentData){
  var dataToInsert;
  if (type == 'report') { //report
    dataToInsert = [null, null, 'report', null, null, JSON.stringify(contentData)];
    db.insertTable(client, 'definitions', eval('dbInfo.definitionsTable'), dataToInsert, db.updateTable); //insert report details in the definitions table
    emailHandler.sendEmail();
    res.redirect('/static');
  }else if (type == 'save' || type == 'update' || type == 'visualizationsDetails' || type == 'background' || type == 'font' || type == 'cache') {  //
    dataToInsert = [null, null, type, null, null, JSON.stringify(contentData)];
    db.insertTable(client, 'definitions', eval('dbInfo.definitionsTable'), dataToInsert, db.updateTable); //insert save details in the definitions table
    res.redirect('/static');
  }else if (type == 'visualization') { //visualization
    for (var index = 0; index < contentData.length; index++) {
      dataToInsert = [contentData[index][0].filename, new Date() + '', contentData[index][0].type,  contentData[index][0].id, contentData[index][0].chartData, JSON.stringify(contentData[index][1])];
      db.insertTable(client, 'definitions', eval('dbInfo.definitionsTable'), dataToInsert, db.updateTable);    //Insert first element to create the row
      if(index==contentData.length-1){
        res.send('Record inserted on Definitions table');
      }
    }
  }
  application.sendSocketMessage('saveDefinitionsFeedback', {name: type, extension: 'saveDefinitions'});
}

function getDefinitions(params, res){
  pg.connect(dbInfo.connect, function(err, client, done){
    db.checkIfTableExist(client, 'definitions', function(bool){
      if (bool) {
        var dbGetQuery = 'SELECT * FROM definitions';
        db.getData(res, client, 'definitions', dbGetQuery, "", done);
      }else {
        res.send('No Records');
      }
    });
  });
}
