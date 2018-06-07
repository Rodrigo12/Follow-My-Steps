function convertToCSV(content){
  var sCSV, cfb = XLSX.read(content, {type: 'binary'});             //read content as binary
  cfb.SheetNames.forEach(function(sheetName) {                      //for each line convert to csv
      sCSV = XLSX.utils.sheet_to_csv(cfb.Sheets[sheetName]);
  });

  sCSV = sCSV.replace(/(,,,,+\n)|(\')/gm, "\n");                            //Remove empty lines
  sCSV = sCSV.replace(/(^,)/gm, "-,");                                 //After the removal of empty lines insert - between comas (error avoidance)
  sCSV = sCSV.replace(/(,,)/gm, ",-,");                                //After the removal of empty lines insert - between comas (error avoidance)
  sCSV = sCSV.replace(/(,\n+)/gm, ",-\n");                          //After the removal of empty lines insert - between comas (error avoidance)
  sCSV = sCSV.replace(/(^\n$)/gm, "");                          //After the removal of empty lines insert - between comas (error avoidance)

  return sCSV;
}



function convertToJSON(content){
  var oJS, cfb = XLSX.read(content, {type: 'binary'});
  cfb.SheetNames.forEach(function(sheetName) {
      oJS = XLS.utils.sheet_to_json(cfb.Sheets[sheetName]);
  });
  return oJS;
}
