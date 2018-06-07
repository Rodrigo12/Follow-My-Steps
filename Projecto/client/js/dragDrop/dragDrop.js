function allowDrop(ev) {
    ev.preventDefault();
}

function dragImage(ev) {
  var src    = ev.target.src;
  var width  = ev.target.width;
  var height = ev.target.height;
    ev.dataTransfer.setData("text", src + "/|/" + width + "/|/" + height);
}

function dropImage(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var dataContent = data.split('/|/');
    insertImage(dataContent[0], parseInt(dataContent[1])*2 + 'px', parseInt(dataContent[2])*2  + 'px');
    //ev.target.appendChild(document.getElementById(data));
}
