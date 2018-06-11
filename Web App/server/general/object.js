module.exports = {
  objectHasProperty:objectHasProperty,
  objectHasProperties:objectHasProperties,
  objectArrayIndexValueInProperty:objectArrayIndexValueInProperty,
  objectArrayIndexesValuesInProperty:objectArrayIndexesValuesInProperty,
  getObjWithValueInArray:getObjWithValueInArray
}

///OBJ Functions///
function objectHasProperty(obj, key){
  if (key in obj) {
    return true;
  }
  return false;
}

function getObjWithValueInArray(array, key, value){
  for (var currentObj, index = 0; index < array.length; index++) {
    currentObj = array[index];
    if (currentObj[key] == value)
      return array[index];
  }
  return null;
}

function objectHasProperties(obj, keys){
  for (var index = 0; index < keys.length; index++) {
    if (objectHasProperty(obj, keys[index])) {
      return true;
    }
  }
  return false;
}

function objectArrayIndexValueInProperty(objArray, key, value){
  for (var currentObj, index = 0; index < objArray.length; index++) {
    currentObj = objArray[index];
    if (currentObj[key] != null && currentObj[key].match(value)) {
      return index;
    }
  }
  return -1;
}

function objectArrayIndexesValuesInProperty(objArray, key, value){
  var indexValuesArray = [];
  for (var currentObj, index = 0; index < objArray.length; index++) {
    currentObj = objArray[index];
    if (currentObj[key] != null && currentObj[key].match(value)) {
      indexValuesArray.push(index);
    }
  }
  return indexValuesArray;
}
