$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  //////////
  // COMMON
  //////////

 	// Prevent # behavior
	$('[href="#"]').click(function(e) {
		e.preventDefault();
	});

  ///////////
  // FULLPAGE
  ///////////

  $('[js-fullpage]').fullpage({
    // options
    // scrollOverflow: true,
		// scrollOverflowReset: true,
		// scrollOverflowOptions: null,

    normalScrollElements: '.content',

    // callbacks
    onLeave: function(index, nextIndex, direction){
      // set classes for invisible elements
      var lastIndex = $('.section').last().index() + 1;
      if ( nextIndex >= 2 ){
        $('.header').addClass('is-half');
        $('.navigation').addClass('is-visible');
        $('.controls').addClass('is-visible');
      } else {
        $('.header').removeClass('is-half');
        $('.navigation').removeClass('is-visible')
        $('.controls').removeClass('is-visible');
      }

      if ( nextIndex == lastIndex ){

      }

      // custom navigation
      $('.section').each(function(i, section){
        var sectionIndex = i + 1
        if ( sectionIndex == nextIndex ){
          var currentSection = $(section).data('section');

          setHeaderNav(currentSection);
          setNavProximity(currentSection);
        }
      });
    }
  });

  function setHeaderNav(curSection){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href').substring(1) == curSection ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  function setNavProximity(curSection){
    $('.navigation__el').each(function(i, nav){
      if ( $(nav).data('ask-for') == curSection ){

        if ( $(nav).attr('data-proximity') == 1 ){
          // nothing changed - already current
        } else {
          $(nav).attr('data-proximity', 1);
          var curNavIndex = $(nav).index() + 1;
          updateNavSiblings(curNavIndex);
        }
      }
    });
  }

  function updateNavSiblings(curNavIndex){

    $('.navigation__el').each(function(i, nav){
      var navProximity = parseInt( $(nav).attr('data-proximity') );
      var thisIndex = $(nav).index() + 1;

      if ( thisIndex == curNavIndex){
        var activeEl = $(nav);

        if ( activeEl.prev() ){
          activeEl.prev().attr('data-proximity', 2 );
        }
        if ( activeEl.prev().prev() ){
          activeEl.prev().prev().attr('data-proximity', 3 );
        }
        if ( activeEl.prev().prev().prev() ){
          activeEl.prev().prev().prev().attr('data-proximity', 4 );
        }
        if ( activeEl.prev().prev().prev().prev() ){
          activeEl.prev().prev().prev().prev().attr('data-proximity', 5 );
        }

        if ( activeEl.next() ){
          activeEl.next().attr('data-proximity', 2 );
        }
        if ( activeEl.next().next() ){
          activeEl.next().next().attr('data-proximity', 3 );
        }
        if ( activeEl.next().next().next() ){
          activeEl.next().next().next().attr('data-proximity', 4 );
        }
        if ( activeEl.next().next().next().next() ){
          activeEl.next().next().next().next().attr('data-proximity', 5 );
        }
      }

    });
  }

  // HEADER NAVIGATION
  $('[js-header-navigation] a, [js-navigation] > div').each(function(i,nav){
    var self = $(nav);

    self.on('click', function(e){
      var targetName
      if ( self.attr('href') ){
        targetName = self.attr('href').substring(1)
      } else if ( self.attr('data-ask-for') ) {
        targetName = self.attr('data-ask-for');
      }

      var targetSection = $('.section[data-section='+targetName+']')

      if (targetSection){
        $.fn.fullpage.moveTo( targetSection.first().index() + 1 );
        return false
      }
    });

  });

  // MOUSE CONTROLS
  $('[js-next-section]').on('click', function(){
    $.fn.fullpage.moveSectionDown()
    return false
  });


  //////////////
  // CONTENT PART
  /////////////

  $('.content-slider__slide').on('click', function(){

    if ( $(this).data('tab-for') ){
      tabHandler( $(this).data('tab-for') );
    } else {
      $(this).siblings().removeClass('is-active');
      $(this).addClass('is-active');
    }

  });

  // tabs
  $('[js-tab]').on('click', function(){
    tabHandler( $(this).data('tab-for') )
  });

  function tabHandler(name){
    var targetNav = $('[js-tab][data-tab-for='+name+']');
    var targetSlide = $('.content-slider__slide[data-tab-for='+name+']');
    var targetImage = $('.content-image img[data-for='+name+']');
    var targetTab = $('.content__tab[data-tab='+name+']');

    if ( targetNav ){
      targetNav.siblings().removeClass('is-active')
      targetNav.addClass('is-active');
    }

    if ( targetSlide ){
      targetSlide.siblings().removeClass('is-active')
      targetSlide.addClass('is-active');
    }

    if ( targetImage ){
      targetImage.siblings().removeClass('is-active')
      targetImage.addClass('is-active');
    }

    if ( targetTab ){
      targetTab.siblings().removeClass('is-active')
      targetTab.addClass('is-active');
    }

  }


  //////////////
  // PRODUCTS SECTION
  /////////////
  $('[js-offer-trigger]').on('click', function(){
    $(this).parent().addClass('is-form')
  });

  $('[js-offer-reset]').on('click', function(){
    $(this).parent().removeClass('is-form').removeClass('is-ok');

    $(this).closest('.get-offer').find('input').val('')
  });

  //////////////
  // CONTACT SECTION
  /////////////

  // When the window has finished loading create our google map below
  google.maps.event.addDomListener(window, 'load', init);

  function init() {
      // Basic options for a simple Google Map
      // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
      var mapOptions = {
          // How zoomed in you want the map to start at (always required)
          zoom: 10,

          // The latitude and longitude to center the map (always required)
          center: new google.maps.LatLng(55.655826, 37.617300),

          // How you would like to style the map.
          // This is where you would paste any style found on Snazzy Maps.
          styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
      };

      // Get the HTML DOM element that will contain your map
      // We are using a div with id="map" seen below in the <body>
      var mapElement = document.getElementById('contact-map');

      // Create the Google Map using our element and options defined above
      var map = new google.maps.Map(mapElement, mapOptions);

      // Let's also add a marker while we're at it
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(55.546167, 37.575505),
          map: map,
          title: 'Snazzy!'
      });
  };

  // CONTACT TABS
  $('.contact-tab__head').on('click', function(){
    $(this).parent().siblings().removeClass('is-active');

    $(this).parent().toggleClass('is-active');
  })


  // HAMBURGER TOGGLER
  $('.hamburger').on('click', function(){
    $('.hamburger').toggleClass('active');
    $('.mobile-navi').toggleClass('active');
  });



});
