var visualizationsObj = {image:"Image", barChart: "Bar Chart", areaChart: "Area Chart", lineChart:"Line Chart",
                          pieChart:"Pie Chart", map:"Map", timeline:'Timeline',
                          calendarHeatmap:"Heatmap Calendar", text:"Text"};                 //Obj that contains info about the visualizations available
var currentVisualizationType = "";


function moveVisualizationContainerElement(){
  var imagePosition = ($("#visualizationTypeImg").parent().width()/2) - ($("#visualizationTypeImg").width()/2);
  document.getElementById("visualizationTypeImg").style.left = imagePosition + "px";
  fadeInElement("id", "visualizationTypeImg", ANIMATIONTIME);
  var leftArrowPosition = imagePosition/2 - ($("#visualizationArrowLeft").width()/2);
  var rightArrowPosition = imagePosition + $("#visualizationTypeImg").width() + leftArrowPosition;
  moveHorizontal("#visualizationArrowLeft", leftArrowPosition + "px", ANIMATIONTIME/2);
  moveHorizontal("#visualizationArrowRight", rightArrowPosition + "px", ANIMATIONTIME/2);
}

function createVisualizationEventListeners(){
  document.getElementById("visualizationArrowRight").addEventListener('click', nextVisualizationImage, false);
  document.getElementById("visualizationArrowLeft").addEventListener('click', previousVisualizationImage, false);
}

function createSlickImages(){
  for (var image, div, currentObj, index = 0; index < Object.keys(visualizationsObj).length; index++) {
    currentObj = Object.keys(visualizationsObj)[index];
    image = createHtml("img", "", "data-lazy= '" + getCurrentImagePath(currentObj) + "' ");
    $(".slickImages").append(div);
  }
}

function selectCurrentImage(elemID, fileName){
  $("#"+elemID).attr("src", "/static/imgs/visualizations/" + fileName + ".png");                       //get image from the visualization folder
}

function getCurrentImagePath(fileName){
  return "/static/imgs/visualizations/" + fileName + ".png";
}

function callVisualizationDetails(type){
  var title = getVisualizationTitle(type);
  var params = getVisualizationParams(type);
  var position = ["0px", "-30px"];
  $("#visualizationHeaderPreview").html('');
  $('.backArrowContainerIcon').css('display', 'block');
  $('.closeContainerIcon').css('display', 'block');
  fadeAndMove("visualizationContent", 0.0, ANIMATIONTIME/2, function(){           //move the visualization slightly left
    $("#visualizationEditDetails").html("");                                        //clear the visualization edit details
    $("#visualizationDetails").html(createLoadingIcon());                                        //clear the visualization details
    getDataFromServer(type, '/data', params, 'ContainerSetting');               //get data from server
    $('#visualizationTitle').html(title);                                       //add title (ex:"Pick An Image")
    $('#visualizationTitle').fadeIn(ANIMATIONTIME/2);                             //fade in title
    $('.visualizationDetailsIcon').css('display', 'block');
  	$('.noCircle').css('display', 'block');
    //fadeInElement("class", "closeButton", ANIMATIONTIME);                       //fade in close button
    showContainerChild('visualizationContainer', ANIMATIONTIME*2, 1, "0px", "0px");
  }, position, 'none');
}

function createLoadingIcon(){
  //<div id="loading" ><div><img src="/static/imgs/loading.gif" /></div></div>
  var loadingImg = createHtml('img', '', 'src="/static/imgs/loading.gif" style="position:absolute;top:15%;left:10%;width:60px;"');
  var loadingDiv = createHtml('div', loadingImg, 'id="loadingVisualizations" style="position:absolute; top:50%;left:44%;width:70px;height:70px;background-color:black;border-radius:100px;  border: 1px solid rgba(200, 200, 200, 1);box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"');
  return loadingDiv;
}

function getVisualizationType(){
  return currentVisualizationType;
  //return Object.keys(visualizationsObj)[currentVisualizationIndex];
}

function getVisualizationTitle(type){
  if( type == 'image')
      return "Select Images";
  else
      return "Select Variables";
}

//Get visualizations Parameters in order for the server to perform specific functions (ex: get options for a bar chart axis)
function getVisualizationParams(type){
  if( type == 'image' ){                   //if client request image then send to server the number of images loaded
    numberInfoLoadedDB=0;
    return numberInfoLoadedDB;
  }else{
    return "files";
  }
}

// function insertVisualization(contentHMTL){
//   hideContainer("visualizationContainer", ANIMATIONTIME, ["11%", "95%"], hideContainerContent);
//   var div = '<div class="resize-container draggable visualization"> <div class="resize-drag"> ' + contentHMTL + '</div> </div>';//<img style="width:100%; height:100%; z-index: 0;" src="/static/imgs/photo.jpg">
//   $('body').append(div);
// }
