function convertArrayObjsToObj(array){
  //convert
  var result = {};
  for (var currentKey, index=0; index<array.length; index++) {
    currentKey = getKeyByIndex(array[index],0);
    result[currentKey] = getValueByKey(array[index], currentKey);
  }
  
  return result;
}
