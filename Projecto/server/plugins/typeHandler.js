module.exports = {
  typeDecoder:typeDecoder
}

function typeDecoder(table,request){
  var typesData = [];
  typesData = typesData.concat(typeFunction(table,request));

  //console.log(typesData);
  return typesData;
}


function typeFunction(table,request){
  var reqMessage     = request.split('|:|')[0];
  var timestamp      = request.split('/|/')[1];

  var reqContent     = JSON.parse(reqMessage).split("\n");
  var columns        = JSON.parse(reqMessage).split("\n")[0];
  var typesColumns   = columns.split(',');
  var types = [];
  for (var validElement, index = 0; index < typesColumns.length; index++) {
    validValue = getValidValue(reqContent, index);
    types.push(["ADD SOURCE", "Filename", table, typesColumns[index].trim(), getType(validValue), isTimestamp(timestamp, typesColumns[index])]);
  }
  return types;
}

function isTimestamp(timestamp, value){
  return (timestamp == value);
}

function getValidValue(content, columnValueIndex){
  for (var values, index2 = 1; index2 < content.length; index2++) {
    values = content[index2].split(",");
    if (values[columnValueIndex] != null && values[columnValueIndex] != "" && values[columnValueIndex] != "-")
      return values[columnValueIndex];
  }
  return '-'; //if column values are all empty then assing a string value ex:'-'
}


function getType(element){
  //console.log(!isNaN(element)+" elem: "+element);
  if(element instanceof Object)
    return "object";
  else if (element instanceof Array)
    return "array";
  else if (!isNaN(element.replace(/\$|£|€/gi, "")))
    return "number";
  else if ((typeof element) == "string")
    return "string";
  else
    return "unknown";
}

function getNumberType(element){
  var number = Number(element);
  if (isInt(number))
    return "number";
  else if (isFloat(number))
    return "number";
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
