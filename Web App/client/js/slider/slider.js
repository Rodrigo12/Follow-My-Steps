function createSlider(sliderID, sliderClass, options){

  //Indicators and slides
  var optionsHtml = "", optionSlides = "";
  for (var currentOption, currentSlide, classType, index = 0; index < options.length; index++) {
    classType     = (index == 0) ? 'active' : '' ;

    //Indicators
    currentOption = createHtml('li', '', 'data-target="#'+sliderID+'" data-slide-to="'+index+'" class="'+classType+'"');
    optionsHtml   += currentOption;

    //slides
    currentSlide = createHtml('div', options[index], 'class="item '+classType+'"');
    optionSlides += currentSlide;
  }

  var carouselIndicators = createHtml('ol',  optionsHtml,  'class="carousel-indicators"');
  var carouselSlides     = createHtml('div', optionSlides, 'class="carousel-inner"');

  var controlsHeight = options[0].match(/[0-9]*px/);
  //Left and right controls
  var leftIcon      = createHtml('span', '', 'class="glyphicon glyphicon-chevron-left"');
  var leftText      = createHtml('span', '', '"sr-only"');
  var leftControler = createHtml('a', leftIcon + leftText, 'class="left carousel-control" href="#'+sliderID+'" data-slide="prev" style="height:'+controlsHeight+'; z-index:1;"');

  var rightIcon      = createHtml('span', '', 'class="glyphicon glyphicon-chevron-right"');
  var rightText      = createHtml('span', '', '"sr-only"');
  var rightControler = createHtml('a', rightIcon + rightText, 'class="right carousel-control" href="#'+sliderID+'" data-slide="next" style="height:'+controlsHeight+'; z-index:1;"');

  var slider = createHtml('div', carouselSlides + leftControler + rightControler, 'id="'+sliderID+'" class="'+sliderClass+' carousel slide"  data-ride="carousel"');

  return slider;
}

//update popup slider
function updateSlider(sliderID, options){
  var slider = $('#'+sliderID);

  var optionSlides = "";
  for (var currentSlide, index = 0; index < options.length; index++) {
    //slides
    currentSlide = createHtml('div', options[index], 'class="item"');
    optionSlides += currentSlide;
  }

  $(slider).find('.carousel-inner').append(optionSlides);
}
