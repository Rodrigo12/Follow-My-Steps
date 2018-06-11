
module.exports = {
  postPluginHandler:postPluginHandler,
  postHandler:postHandler,
  cityCountry:cityCountry
}

var pluginHandler = require('../plugins/pluginsHandler.js'),
    typeHandler = require('../plugins/typeHandler.js'),
    db = require('../dbCalls.js'),
    dbInfo = require('../dbInfo.js'),
    pg = require('pg'),
    imageFile = require('../general/image.js'),
    fileUpdateHandler = require('../file/fileUpdateHandler.js'),
    fileHandler = require('../file/fileHandler.js'),
    application = require('../../app.js'),
    geocoding = new require('reverse-geocoding');


function postHandler(client, tableInfo, data){
    var table     = (tableInfo+"").split('.')[1];
    var tableName = table.replace('Table', '');
    db.createTable(client, tableName, eval(tableInfo));

    db.insertTable(client, tableName, eval(tableInfo), data, db.updateTable);    //Insert first element to create the row
    fileUpdateHandler.addFileToUpdate(data[0]);
}

//req={body:{message:"", plugin:"", table:""}
function postPluginHandler(req, res, isUpdate){
  //console.log(req.body);
  //console.log(req.body.message);
  var databaseData = [], typesData = [];
  databaseData = databaseData.concat(pluginHandler.pluginDecoder(req.body.plugin,req.body.message));       //concat allows to put all the data inside the same vector (allowing to store all data together in the db)

  //console.log(databaseData);

  var fileName = req.body.fileName;
  var filePath = req.body.filePath;
  if(databaseData != null)
    pg.connect(dbInfo.connect, function(err, client, done){
      if(err){  return console.error('error fetching client from pool', err);  }

      var tableColumns = eval("dbInfo." + req.body.table + "TableColumns");                                           //Eval allows to use the variable value (Ex: eval("otherDBQuery") = "other(id serial primary key not null, day int, ...)";)
      db.createTable(client, req.body.table, tableColumns);

      for(var fileData, dataIndex = 0; dataIndex < databaseData.length; dataIndex++){
        databaseData[dataIndex][0] = filePath;
        if(req.body.table!="life"){
          db.insertTable(client, req.body.table, tableColumns, databaseData[dataIndex], db.updateTable);    //Insert first element to create the row
        }


        ///////////////////////////////////////////////////////////////////////
        ///////////////////////////IMAGE ORIENTATION///////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if(req.body.table=="photos"){
          imageFile.checkImageOrientation(filePath);
        }
        //console.log(filePath);
        //console.log('filePath: ' + filePath + ' -> ' + (dataIndex+1) + " rows inserted from " + databaseData.length);
      }

      if (req.body.table=="general") {
        updateTypesTable(client, typesData, filePath, req.body.table, req.body.message);
      }

      if (!isUpdate)
        postHandler(client, 'dbInfo.filesTable', [filePath, fileName, "" + new Date()]);

      done();
      if (res != null)
       res.redirect('/static');

     if(isUpdate && req.body.table!="life") {//send socket message if is update
       if (imageFile.isImageFile(fileName))
        application.sendSocketMessage('updateFeedback', {name: fileName, extension: 'photos'});
       else
        application.sendSocketMessage('updateFeedback', {name: fileName, extension: fileHandler.getFileExtention(filePath)});
     }
    });

    if(req.body.table == "life" ){//|| req.body.table == "photos"
      pg.connect(dbInfo.connect, function(err, client, done){
        var tableColumns = eval("dbInfo." + req.body.table + "TableColumns");
        cityCountry(client, done, fileName, req.body.table, tableColumns, 0, databaseData, 100);
      });
    }
}


function updateTypesTable(client, typesData, filePath, table, requests){
  typesData = typeHandler.typeDecoder(table,requests);
  var filePathArray = filePath.split('/');
  var fileName      = filePathArray[filePathArray.length - 1]; //get filename
  db.createTable(client, "types", dbInfo.variablesTableType);
  for(var dataIndex = 0; dataIndex < typesData.length; dataIndex++){
    typesData[dataIndex][0] = filePath;
    typesData[dataIndex][1] = fileName;
    db.insertTable(client, "types", dbInfo.variablesTableType, typesData[dataIndex], db.updateTable);    //Insert first element to create the row
  }
}

//
function cityCountry(client, done, fileName, table, tableColumns, index, databaseData, time){
  if (client != null) {
    setCityCountry(client, done, fileName, table, tableColumns, index, databaseData, time);
  }else {
    pg.connect(dbInfo.connect, function(err, client, done){
      setCityCountry(client, done, fileName, table, tableColumns, index, databaseData, time);
    });
  }

}

function setCityCountry(client, done, fileName, table, tableColumns, index, databaseData, time){
  if (databaseData.length == index) {
    application.sendSocketMessage('updateFeedback', {'name': fileName, extension: 'life'});
    done();
    return;
  }

//console.log(databaseData[index][12]);
  if (databaseData[index][12] != 'Canonical Locations' && table == 'life') {
    db.insertTable(client, table, tableColumns, databaseData[index], db.updateTable);    //Insert first element to create the row
    cityCountry(client, done, fileName, table, tableColumns, index+1, databaseData, time);
    return;
  }

  var lat, lng;
  if (table == 'life') {
    var latLng      = databaseData[index][15]; //databaseData[0][15] is descriptions
    var latLngArray = latLng[1].split(',');
    lat             = parseFloat(latLngArray[0]);
    lng             = parseFloat(latLngArray[1]);
  }else if (table == 'photos') {
    lat             = parseFloat(databaseData[index][7]);
    lng             = parseFloat(databaseData[index][8]);
  }

  var config = {
    'latitude':  lat,
    'longitude': lng
  };

  geocoding.location(config, function (err, data){
    if(err){
      //console.log('Error: ' + err + ' time: ' + time + ' index: ' + index + ' size: ' + databaseData.length);
      time += 50;
      if (time > 10000) { //if it's taking too long then don't get country and city
        if (table == 'life')
          db.insertTable(client, table, tableColumns, databaseData[index], db.updateTable);    //Insert first element to create the row
        cityCountry(client, done, fileName, table, tableColumns, index+1, databaseData, time);
        return;
      }else{
        setTimeout(function(){cityCountry(client, done, fileName, table, tableColumns, index, databaseData, time);}, time);
        return;
      }
    }else{
     var address = (data.results[0].formatted_address).split(',');
     databaseData[index][3] = address[0];
     databaseData[index][4] = address[1].split(' ')[2];
     databaseData[index][5] = address[2];

     if (table == 'life')//if life insert new row in table
       db.insertTable(client, table, tableColumns, databaseData[index], db.updateTable);    //Insert first element to create the row
     else if(table == 'photos')//if photo the row is already created, so update that row
       db.updateColumns(client, 'photos', "street='"+databaseData[index][3]+"', city='"+databaseData[index][4]+"', country='"+databaseData[index][5]+"'", "source='"+databaseData[index][0]+"'");

     setTimeout(function(){cityCountry(client, done, fileName, table, tableColumns, index+1, databaseData, time);}, time);
     return;
    }
  });
}
