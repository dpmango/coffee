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
        $('.navigation').addClass('is-visible')
      } else {
        $('.header').removeClass('is-half');
        $('.navigation').removeClass('is-visible')
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

      // console.log( $(nav).attr('data-ask-for'), "curNavIndex" + curNavIndex, "navProximity" + navProximity )
      if ( curNavIndex > thisIndex){
        $(nav).attr('data-proximity', navProximity + 1 );
      }

      // пока работает только вперед

      // else if ( curNavIndex < thisIndex ) {
      //   $(nav).attr('data-proximity', navProximity - 1 );
      // }
    });

  }

  // HEADER NAVIGATION
  $('[js-header-navigation] a').each(function(i,nav){
    var self = $(nav);

    self.on('click', function(e){
      var targetName = self.attr('href').substring(1);
      var targetSection = $('.section[data-section='+targetName+']')

      if (targetSection){
        $.fn.fullpage.moveTo( targetSection.first().index() + 1 );
        return false
      }
    });

  });

  // HAMBURGER TOGGLER
  $('.hamburger').on('click', function(){
    $('.hamburger').toggleClass('active');
    $('.mobile-navi').toggleClass('active');
  });

  // VIDEO PLAY
  $('.promo-video .icon').on('click', function(){
    $(this).closest('.promo-video').toggleClass('playing');
    $(this).closest('.promo-video').find('iframe').attr("src", $("iframe").attr("src").replace("autoplay=0", "autoplay=1"));
  });


  //////////
  // SLIDERS
  //////////

  $('.trending__wrapper').slick({
    autoplay: true,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true
  });

  //////////
  // MODALS
  //////////
  // Custom modals
  // $('*[data-modal]').on('click', function(){
  //   // remove all active first
  //   $('.modal').removeClass('opened');
  //
  //   // find by id
  //   var target = $(this).data('modal');
  //   $('#'+target).addClass('opened');
  //
  //   window.location.hash = target;
  // });
  //
  // $('.modal__close').on('click', function(){
  //   $(this).closest('.modal').removeClass('opened');
  //   window.location.hash = "";
  // });
  //
  // // CHECK SAVED STATE
  // if(window.location.hash) {
  //   var hash = window.location.hash.substring(1);
  //   $('#'+hash).addClass('opened');
  // }
  //


  // Magnific Popup
  // var startWindowScroll = 0;
  $('.js-popup').magnificPopup({
    type: 'inline',
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'popup-buble',
    callbacks: {
      beforeOpen: function() {
        // startWindowScroll = _window.scrollTop();
        // $('html').addClass('mfp-helper');
      },
      close: function() {
        // $('html').removeClass('mfp-helper');
        // _window.scrollTop(startWindowScroll);
      }
    }
  });

  ////////////
  // UI
  ////////////

  // Masked input
  $(".js-dateMask").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
  $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});

});
