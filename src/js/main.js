$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  var media = {
    tablet: 768
  }

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

  function startFullpage(){
    $('[js-fullpage]').fullpage({
      // options
      // scrollOverflow: true,
  		// scrollOverflowReset: true,
  		// scrollOverflowOptions: null,

      css3: true,
      scrollingSpeed: 1000,

      normalScrollElements: '.content--scrollable',

      // callbacks
      onLeave: function(index, nextIndex, direction){
        console.log('leaving')
        // set classes for invisible elements
        var lastIndex = $('.section').last().index() + 1;
        if ( nextIndex >= 2 ){
          $('.header').addClass('is-half');
          $('.controls').addClass('is-visible');

          if ( nextIndex == lastIndex ){
            $('.controls').addClass('is-last');
          } else {
            $('.controls').removeClass('is-last');
          }

        } else {
          // reset to hero
          $('.header').removeClass('is-half');
          $('.controls').removeClass('is-visible');
        }

        // custom navigation
        $('.section').each(function(i, section){
          var sectionIndex = i + 1
          if ( sectionIndex == nextIndex ){
            var currentSection = $(section).data('section');
            var currentAnchor = $(section).data('anchor');

            setHeaderNav(currentSection);
            setNavProximity(currentSection, currentAnchor);
          }
        });

        // increment progress
        var totalIndex = $('.section').length
        var incrementProgress = 70 - (30 / $('.section').length) * nextIndex

        $('.controls__progress').css({
          'transform': 'translate3d('+incrementProgress+'%,0,0)'
        });
      }
    });
  }

  function setHeaderNav(curSection){
    $('[js-header-navigation] li').each(function(i,val){
      if ( $(val).find('a').attr('href').substring(1) == curSection ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  function setNavProximity(curSection, currentAnchor){
    // show block with current section navigation
    $('[js-navigation]').removeClass('is-visible');
    $('[js-navigation][data-for='+curSection+']').addClass('is-visible');

    $('.navigation__el').each(function(i, nav){

      if ( $(nav).data('ask-for') == currentAnchor ){
        $(nav).attr('data-proximity', 1);
        var curNavIndex = $(nav).index() + 1;
        updateNavSiblings(curNavIndex);
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

        if ( activeEl.next() ){
          activeEl.next().attr('data-proximity', 2 );
        }
        if ( activeEl.next().next() ){
          activeEl.next().next().attr('data-proximity', 3 );
        }
        if ( activeEl.next().next().next() ){
          activeEl.next().next().next().attr('data-proximity', 4 );
        }
      }

    });
  }

  // DISABLE ON MOBILE
  function initFullpage(){
    if ( _window.width() < media.tablet ){
      // $.fn.fullpage.setAutoScrolling(false);
      if ( $('html').is('.fp-enabled') ){
        $.fn.fullpage.destroy('all');
      }

      // change data scr
      $('img').each(function(i, image){
        if ( $(image).attr('data-src') ){
          $(image).attr({
            src: $(image).attr('data-src')
          }).removeAttr('data-src');
        }
      })
    } else {
      // $.fn.fullpage.setAutoScrolling(true);
      if ( !$('html').is('.fp-enabled') ){
        startFullpage();
      }
      // $.fn.fullpage.reBuild();
    }
  }

  initFullpage();

  _window.resized(100, initFullpage)

  // HEADER NAVIGATION
  $('[js-header-navigation] a').each(function(i,nav){
    var self = $(nav);

    self.on('click', function(e){
      var targetName
      if ( self.attr('href') ){
        targetName = self.attr('href').substring(1)
      } else if ( self.attr('data-ask-for') ) {
        targetName = self.attr('data-ask-for');
      }

      var targetSection = $('.section[data-section='+targetName+']')

      // mobile navigation
      if ( !$('html').is('.fp-enabled') ){
        $('body, html').animate({
            scrollTop: targetSection.offset().top}, 1000);

        $('[js-toggle-mobile-menu]').removeClass('is-active');
        $('.header').removeClass('is-fixed')
        $('.mobile-menu').removeClass('is-active');

        return false;
      }

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

  $('[js-first-section]').on('click', function(){

    if ( _window.width() < media.tablet ){
      $('body, html').animate({
          scrollTop: 0}, 1000);
    } else {
      $.fn.fullpage.moveTo(1);
    }
    return false
  });


  //////////////
  // CONTENT PART
  /////////////

  $('.content-slider__slide').on('click', function(){
    if ( $(this).data('for-tab') ){
      tabHandler( $(this).data('for-tab') );
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
    var targetSlide = $('.content-slider__slide[data-for-tab='+name+']');
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

  // tab padding tab
  function setDynamicTabs(){
    $('[js-dymamic-tab-pad]').each(function(i, tab){
      var linkedEl = $('.content__tab-el[data-tab-for='+ $(tab).data('tab') +']');

      if ( linkedEl ){
        if ( _window.width() > media.tablet ){
          var linkedElOffset = linkedEl.position().top - parseInt(linkedEl.closest('.content__text').css('padding-top'),10) + linkedEl.height()
        } else {
          var linkedElOffset = 0;
        }

        $(tab).css({
          'padding-top': linkedElOffset - 10
        });
      }
    })
  }

  setDynamicTabs();

  _window.resized(500, setDynamicTabs);

  // mobile tabs teleport
  function teleportMobileTabs(){
    if ( _window.width() < media.tablet ){
      $('.content__tab').each(function(i, tab){
        var tab = $(tab);
        var tabName = $(tab).data('tab');
        var linkedTitle = $('.content__tab-el[data-tab-for='+ tabName +']');
        //var linkedSlide = $('.content-slider__slide[data-for-tab=' + tabName +']')
        console.log(linkedTitle)
        if ( linkedTitle.next('.content-slider__slide').length > 0 ){
          tab.insertAfter(linkedTitle.next('.content-slider__slide'));
          // if ( linkedSlide ){
          //   console.log(linkedSlide)
          //   linkedSlide.insertAfter(linkedTitle)
          // }
        } else if ( linkedTitle ){
          tab.insertAfter(linkedTitle)
        }


      })
    }
  }

  teleportMobileTabs();
  _window.resized(500, setDynamicTabs);



  //////////////
  // PRODUCTS SECTION
  /////////////
  $('[js-offer-trigger]').on('click', function(){
    $(this).parent().addClass('is-form')
  });

  $('[js-offer-reset]').on('click', function(){
    $(this).closest('.get-offer').removeClass('is-form').removeClass('is-ok');

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

      var icon = 'img/mapsMarker.png';

      // Get the HTML DOM element that will contain your map
      // We are using a div with id="map" seen below in the <body>
      var mapElement = document.getElementById('contact-map');

      // Create the Google Map using our element and options defined above
      var map = new google.maps.Map(mapElement, mapOptions);

      var contentString = '<div class="g-marker">'+
          '<p><b>Офис и производство</b>Синельниковская ул., 12</p>'+
          '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(55.546167, 37.575505),
          icon: icon,
          map: map,
          title: 'Офис и производство'
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

      // open on mobile by default
      if ( _window.width < media.tablet ){
        setTimeout(function(){
          infowindow.open(map, marker);
        }, 100)
      }

      google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
      });

      // INFOWINDOW CUSTOMIZE.
      google.maps.event.addListener(infowindow, 'domready', function() {

        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});

        // set dialog pos
        iwOuter.parent().parent().css({left: '-70px', top: '34px'});

        // remove arrow
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 10000px !important;'});
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 10000px !important;'});

        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'none', 'z-index' : '-100'});
        iwBackground.children(':nth-child(3)').find('div').children().css({'display': 'none'});

        //remove close btn
        var iwCloseBtn = iwOuter.next();
        iwCloseBtn.css({display: 'none'});
        $('.iw-bottom-gradient').css({display: 'none'});

      });

  };

  // CONTACT TABS
  $('.contact-tab__head').on('click', function(){
    $(this).parent().siblings().removeClass('is-active');

    $(this).parent().toggleClass('is-active');
  });

  // ANIMATIONS
  // scroll events and viewport won't be triggered with fullpage.js

  // $('.wow').each(function(i, el){
  //   var elWatcher = scrollMonitor.create( $(el) );
  //
  //   var delay;
  //   var animationName = "wowFade";
  //   if ( $(window).width() < 768 ){
  //     delay = 0
  //   } else {
  //     $(el).data('wow-delay');
  //   }
  //
  //   elWatcher.enterViewport(function() {
  //     $(el).css({
  //       'animation-name': animationName,
  //       'animation-delay': delay
  //     });
  //   });
  //   elWatcher.exitViewport(function() {
  //     $(el).css({
  //       'animation-name': 'none',
  //       'animation-delay': 0
  //     });
  //   });
  // });


  //////////////
  // BLOG SECTION
  /////////////

  // slider
  var slickBlog = $('[js-slick-blog]').slick({
    accesability: false,
    variableWidth: true,
    // centerMode: true,
    infinite: false,
    dots: false,
    arrows: false,
    responsive: [{
      breakpoint: 768,
      settings: {
        // variableWidth: false,
        // slidesToShow: 1,
        // slidesToScroll: 1,
        padding: 20
      }
    }]
  })

  $('[js-slick-next]').on('click', function(){
    slickBlog.slick('slickNext')
  })

  $('[js-slick-prev]').on('click', function(){
    slickBlog.slick('slickPrev')
  })

  // HAMBURGER TOGGLER
  $('[js-toggle-mobile-menu]').on('click', function(){
    $(this).toggleClass('is-active');
    $('.header').toggleClass('is-fixed')
    $('.mobile-menu').toggleClass('is-active');
  });


  // TELEPORT PLUGIN
  $('[js-teleport]').each(function (i, val) {
    var self = $(val)
    var objHtml = $(val).html();
    var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
    var conditionMedia = $(val).data('teleport-condition').substring(1);
    var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

    if (target && objHtml && conditionPosition) {
      _window.resized(100, function () {
        teleport()
      })

      function teleport() {
        var condition;

        if (conditionPosition === "<") {
          condition = _window.width() < conditionMedia;
        } else if (conditionPosition === ">") {
          condition = _window.width() > conditionMedia;
        }

        if (condition) {
          target.html(objHtml)
          self.html('')
        } else {
          self.html(objHtml)
          target.html("")
        }
      }
      teleport();
    }
  });

  // text hiden plugin
  $('[js-text-collapse]').each(function(i, el){
    var self = $(el);
    var firstParagraph;
    var hiddenParagraphs = [];
    var btnEl = $("<div class=content__mobile-more><a href='#' class='btn btn-outline btn-outline--black' js-expand-text> Подробнее </a></div>");

    function collapseCheckMedia(){
      if ( _window.width() < media.tablet ){
        self.find('p').each(function(index,p){
          if ( index == 0 ){
            firstParagraph = $(p)
          }
          if ( index >= 1 ){
            hiddenParagraphs.push ( $(p) );
            $(p).hide();
          }
          if ( self.find('p').length == index + 1){
            processHide();
          }
        })

        function processHide(){
          if ( hiddenParagraphs.length > 0 ){
            // console.log(btnEl, firstParagraph, hiddenParagraphs)
            btnEl.insertAfter(firstParagraph);

            // click handler - remove btn and expand text
            btnEl.on('click', function(e){
              btnEl.remove();

              $.each(hiddenParagraphs, function(i, p){
                p.fadeIn();
              })

              hiddenParagraphs = [];
              e.preventDefault();
            })
          }
        }

      } else {
        // if media, show all hidden
        if ( hiddenParagraphs.length > 0 ){
          btnEl.remove();
          $.each(hiddenParagraphs, function(i, p){
            p.show();
          })
        }
      }
    }

    collapseCheckMedia()

    _window.resized(300, collapseCheckMedia)
  });




});
