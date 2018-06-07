//Get the key from an object given the value (ex:in visualizationsObj: Image -> image)
function getKeyByValue(obj, textContent){
  for (var index = 0; index < Object.keys(obj).length; index++) {                                      //loop in the object properties
    if(obj[Object.keys(obj)[index]] == textContent)                                                    //check if the property match the text value
      return Object.keys(obj)[index];                                                                  //return the key
  }
  return null;
}

//Get the key from an object given the index (ex:in visualizationsObj: 0 -> image)
function getKeyByIndex(obj, index){
  return Object.keys(obj)[index];                                                                  //return the key
}

//Get the value from an object property given the index (ex:in visualizationsObj: 0 -> image)
function getValueByIndex(obj, index){
  return obj[Object.keys(obj)[index]];                                                                  //return the key
}

//Get the index from an object given the key (ex:in visualizationsObj: image -> 0)
function getIndexByKey(obj, key){
  for (var index = 0; index < Object.keys(obj).length; index++) {                                   //loop in the object properties
    if(Object.keys(obj)[index] == key)                                                              //check if the property match the key
      return index;                                                                                 //return the index
  }
  return null;
}

function getValueByKey(obj, key){
  return obj[key];
}

function getObjectLength(obj){
  return Object.keys(obj).length;
}

function getObjWithKeyInArray(array, key){
  for (var index = 0; index < array.length; index++) {
    if (key in array[index])
      return array[index];
  }
  return null;
}

function getObjWithValueInArray(array, key, value){
  for (var currentObj, index = 0; index < array.length; index++) {
    currentObj = array[index];
    if (currentObj[key] == value)
      return array[index];
  }
  return null;
}

function getObjIndexWithKeyInArray(array, key){
  for (var index = 0; index < array.length; index++) {
    if (key in array[index])
      return index;
  }
  return null;
}

function replaceAllValueByValueInObj(obj, replaceValue, newValue){
  for (const key of Object.keys(obj)) {
    if (obj[key] == replaceValue)
      obj[key] = newValue;
  }
  return obj;
}

function objectHasKey(obj, key){
  if(isEmpty(obj)) return false;

  if (obj.hasOwnProperty(key))
    return true;
  return false;
}

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
