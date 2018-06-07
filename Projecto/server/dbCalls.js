module.exports = {
  createDatabaseIfNotExists: createDatabaseIfNotExists,
  createUserIfNotExists: createUserIfNotExists,
  createDatabaseExtension: createDatabaseExtension,

  checkIfTableExist:checkIfTableExist,
  checkIfRecordExist:checkIfRecordExist,

  createTable: createTableDB,
  insertTable: insertDataDB,
  updateTable: updateDataDB,
  updateColumns: updateColumnDataDB,
  deleteRowDB:deleteRowDB,
  deleteFromDB:deleteFromDB,
  getData:getDataDB,
  getInternalData:getInternalDataDB
}

var fs = require('fs'),
    dbAux = require('./dbCallsAux.js'),
    pg = require('pg'),
    dbInfo = require('./dbInfo.js'),
    imageFile = require('./general/image.js');

//Check if database already exists
function createDatabaseIfNotExists(client, databaseName, owner, callback){
  var dbSelectDBQuery = "SELECT 1 FROM pg_database WHERE datname='" + databaseName + "'";     //Get results where database name is "databaseName"
  client.query(dbSelectDBQuery, function(err, result) {                                       //Run query on the DB
    if (err)  console.log(databaseName + ' Database Exists Error');                           //If error log Database error
    if(result.rowCount == 0)                                                                  //If result.rowCount > 0 means that encounter databases with the "databaseName"
      createDatabase(client, databaseName, owner, callback);                                  //If there are non db with "databaseName", create one
  });
}

//Check if user already exists
function createUserIfNotExists(client, userName, password){
  var dbSelectUserQuery = "SELECT 1 FROM pg_roles WHERE rolname='" + userName + "'";          //Get results where user name is "userName"
  client.query(dbSelectUserQuery, function(err,result) {                                      //Run query on the DB
      if (err)console.log(userName + ' User Exists Error');                                   //If error log User error
      if(result.rowCount == 0)                                                                //If result.rowCount > 0 means that encounter databases with the "userName"
        createUser(client, userName, password);                                               //If there are non users with "userName", create one
  });
}

//Function to create a new Database
function createDatabase(client, databaseName, owner, callback){
  var dbCreateDBQuery = "CREATE DATABASE " + databaseName + " OWNER " + owner + ";";
  client.query(dbCreateDBQuery, function(err) {
      if (err)  console.log('Error creating database ' + databaseName + " ERROR: " + err);
      if(callback!="")  callback();
    });
}

//Create extension ex 'Postgis'
function createDatabaseExtension(client, databaseName, extension){
  var dbCreateDBQuery = "CREATE EXTENSION " + extension + ";";
  client.query(dbCreateDBQuery, function(err) {
      if (err)  console.log('Error creating database extension for ' + databaseName + " ERROR: " + err);
    });
}

//Function to create a new user
function createUser(client, userName, password){
  var dbCreateUserQuery = "CREATE USER " + userName + " WITH PASSWORD '" + password + "' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN";
  client.query(dbCreateUserQuery, function(err) {
      if (err)  console.log('Error creating user ' + userName + " ERROR: " + err);
    });
}

//Function to create a table in the database
//Require client, the table name, the columns, the data to be inserted and a callback function
function createTableDB(client, tableName, tableColumns){
  var dbCreateTableQuery = 'CREATE TABLE IF NOT EXISTS ' + tableName + '(' + tableColumns + ')';  //If the table doesn't exist create a new one
  //console.log(dbCreateTableQuery);
  client.query(dbCreateTableQuery, function(err) {
      if (err)  console.log('Error creating table ' + tableName + " ERROR: " + err);
    });
}

//Function to check if a certain table exist in the DB
//Require client, the column to check, the table, the conditions and a callback function
function checkIfTableExist(client, table, callback){
  var dbGetQuery = "SELECT 1 FROM " + table + " LIMIT 1;";
  client.query( dbGetQuery, function(err, result) {
    if (err){
      console.log("Table: " +table+ " not created");
      callback(false);
    }else{
      callback(true);
    }
  });
}

//Function to check if a record exist in a table
//Require client, the column to check, the table, the conditions and a callback function
function checkIfRecordExist(client, column, table, conditions, callback){
  var dbGetQuery = "SELECT " + column + " FROM " + table + " WHERE " + conditions;
  client.query( dbGetQuery, function(err, result) {
    if (err){ console.log("ERROR CHECKING: " + err);  }                                 //Return if got an error
    if (callback!=null)
      callback(result);                                                            //Call funtion after row creation (ex: update the empty row)
  });
}

//Function to insert data in the database
//Require client, the table name, the columns, the data to be inserted and a callback function
function insertDataDB(client, tableName, tableColumns, data, callback){
  var dbInsertQuery = "INSERT INTO " + tableName  + " DEFAULT VALUES RETURNING id";   //Add empty row to the table (ex:x: INSERT INTO other DEFAULT VALUES RETURNING id;)
  if(data != null ){
    client.query( dbInsertQuery, function(err, result) {
      if (err){ console.log("ERROR INSERTING: " + err);  }                     //Return if got an error
      if (result != null)
        callback(client, result.rows[0].id, tableName, tableColumns, data);             //Call funtion after row creation (ex: update the empty row)
    });
  }
}

//Function to update data in the database
//Require client, the row id, the table name, the columns and the data to be inserted
function updateDataDB(client, tableRowId, tableName, tableColumns, data){
  var regularExpression = /(^id[^,]+,)|int|float|text|boolean|unique|geography.+\)|\s/g;
  var columns = (tableColumns + "").replace(regularExpression,'');                                //remove the variables types from each column
  var setArray = "", columnArray = columns.split(',');                                            //Separate columns ex:['day','utc', ...]
  for(var index = 0; index < columnArray.length; index++){
    if(index != 0)  setArray += ',';
    if ((isNaN(data[index]) || data[index] == ' ') && !(data[index]+"").match(/^ST_GeomFromText.*/gi))                 //if is not a number add quotes " ' " (ex:"tags = 'movie', description = 'Deadpool'")
      (setArray += columnArray[index] + "= '" + data[index] + "'")
    else
      (setArray += columnArray[index] + "= " + data[index]);
  }
  var dbUpdateQuery = "UPDATE " + tableName  + " SET " + setArray + " WHERE id =" + tableRowId;   //ex: UPDATE other SET day = 20100202 WHERE id = 5;
  client.query(dbUpdateQuery, function(err, result) {
    if (err){ console.log("Updating Error: " + err);
              deleteRowDB(client, tableName, 'id=' + tableRowId, function(){});
    }

    if (tableName=="photos") {
        imageFile.getImageMetadata(client, data[0]);
    }                                                                //Throw error
  });
}

function deleteRowDB(client, tableName, conditions, callback){
  var dbDeleteQuery = "DELETE FROM " + tableName + " WHERE " + conditions + ";";   //ex:;
  //console.log(dbDeleteQuery);
  client.query(dbDeleteQuery, function(err, result) {
    if (err){ console.log("Deleting Error: " + err);   }
    callback();
  });
}

function deleteFromDB(client, dbDeleteQuery, callback){
  //console.log(dbDeleteQuery);
  client.query(dbDeleteQuery, function(err, result) {
    if (err){ console.log("Deleting Error: " + err);   }
    if (callback!=null)
      callback();
  });
}

//Function that updates columns of a certain table
function updateColumnDataDB(client, tableName, columnsValuesArray, conditions){
  var dbUpdateRowQuery = "UPDATE " + tableName  + " SET " + columnsValuesArray + " WHERE " + conditions;   //ex: UPDATE other SET day = 20100202 WHERE ;
  client.query(dbUpdateRowQuery, function(err, result) {
    if (err){ console.log("Updating Row Error: " + err);  }                                                                //Throw error
  });
}

//Function to get user's requested information from the database
function getDataDB(res, client, params, dbGetQuery, dataType, callback){
  client.query(dbGetQuery, function(err, result) {
    if (err){ console.log("Getting Error: " + err);  }

    dbAux.sortData(res, result, client, params, dataType);
    callback(result);
  });
}

//Function to get user's requested information from the database
function getInternalDataDB(client, dbGetQuery, dataType, callback){
  client.query(dbGetQuery, function(err, result) {
    if (err){ console.log("Getting Error: " + err);  }
    callback(result);
  });
}
