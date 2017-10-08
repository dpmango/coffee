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
      if ( nextIndex >= 2 ){
        $('.header').addClass('is-half');
        $('.navigation').addClass('is-visible');
        $('.controls').addClass('is-visible');
      } else {
        $('.header').removeClass('is-half');
        $('.navigation').removeClass('is-visible')
        $('.controls').removeClass('is-visible');
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
    var targetTab = $('.content__tab[data-tab='+name+']');

    if ( targetNav ){
      targetNav.siblings().removeClass('is-active')
      targetNav.addClass('is-active');
    }

    if ( targetSlide ){
      targetSlide.siblings().removeClass('is-active')
      targetSlide.addClass('is-active');
    }

    if ( targetTab ){
      targetTab.siblings().removeClass('is-active')
      targetTab.addClass('is-active');
    }

  }

  // HAMBURGER TOGGLER
  $('.hamburger').on('click', function(){
    $('.hamburger').toggleClass('active');
    $('.mobile-navi').toggleClass('active');
  });



});
