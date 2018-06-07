//File that create queries

module.exports = {
  formulateTableQuery:formulateTableQuery,
  formulateTablesQuery:formulateTablesQuery
}

//ex: "SELECT table1."+tableColumn+" AS x, CAST(table2.value AS FLOAT) AS y FROM general table1, general table2 WHERE table1.source = table2.source AND table1.timestamp = table2.timestamp AND "+tableRestrictions+" AND table1.value!='-' AND table2.value!='-' AND table2.value ~ '[0-9]+' ";
function formulateTableQuery(tableName, tableColumns, asArray, tableRestrictions, startIndexString , stringLength, agglomerationType){
    return "SELECT DISTINCT SUBSTRING(timestamp ,"+startIndexString+" , "+stringLength+" ) AS "+asArray[0]+", SUBSTRING("+tableColumns[0]+","+startIndexString+" , "+stringLength+" ) AS "+asArray[1]+", "+agglomerationType+"(CAST("+tableColumns[1]+" AS FLOAT)) AS "+asArray[2]+" FROM "+tableName+" WHERE "+tableRestrictions+ " GROUP BY SUBSTRING (timestamp,"+startIndexString+" , "+stringLength+" ) ORDER BY SUBSTRING (timestamp,"+startIndexString+" , "+stringLength+" );";
}

//ex: "SELECT table1."+tableColumn+" AS label, CAST(table2.value AS FLOAT) AS value FROM general table1, general table2 WHERE table1.source = table2.source AND table1.timestamp = table2.timestamp AND "+tableRestrictions+" AND table1.value!='-' AND table2.value!='-' AND table2.value ~ '[0-9]+' ";
function formulateTablesQuery(tablesName, tableColumns, tableColumnsProperties, asArray, tableRestrictions){
  //EX: "SELECT table0."+tableColumns[0]+" AS "+asArray[0]+", CAST(table1."+tableColumns[1]+" AS FLOAT) AS "+asArray[0]+" FROM "+tablesName[0]+" table0, "+tablesName[1]+" table1 WHERE "+tableRestrictions;
  var selectQuery = "SELECT DISTINCT table0.timestamp AS "+asArray[0]+",", fromQuery = " FROM ", whereQuery = " WHERE " + tableRestrictions + " GROUP BY table0.timestamp, table0.value ORDER BY table0.timestamp;";
  for (var index = 0; index < tablesName.length; index++) {
    if (tableColumnsProperties[index]!="")
      selectQuery += tableColumnsProperties[index].replace("CHANGETOVALUE", "table" + index + "." + tableColumns[index]) + " AS " + asArray[index+1];
    else
      selectQuery += "table" + index + "." + tableColumns[index] + " AS " + asArray[index+1];

    fromQuery += tablesName[index] + " table"+ index;

    if (index != tablesName.length-1){
      selectQuery += ", ";
      fromQuery   += ", ";
    }
  }

  // console.log('selectQuery + fromQuery + whereQuery');
  // console.log(selectQuery + fromQuery + whereQuery);
  return selectQuery + fromQuery + whereQuery;
}
