var $body, $html, carouselOnHomepage, carouselsForProducts, checkIeVersion, handleDropdown, handleFaqClick, handleOrientationEvent, handlePopupClick, handleSearchResult, handleSocialLinkHover, handleTocAndTab, handleTocClick, handleTouchEffect, handleTouchEffectEnd, handleTouchEffectStart, homepagePanels, ie, initialize, isIOS, isMobile, lastUpdate, onContainerClick, onOrientationChange, onParentClick, productCarouselFor, registerContainerDropdownEvent, resetYoutubeIframe, setParentLinkClickable, toggleOpened, unregisterContainerDropdownEvent, updateHomepagePanels, updateTemplate4Grid;

isMobile = false;

$html = null;

$body = null;

isIOS = false;

lastUpdate = null;

homepagePanels = [];

checkIeVersion = function() {
  var all, div, undef, v;
  undef = void 0;
  v = 3;
  div = document.createElement("div");
  all = div.getElementsByTagName("i");
  while (1) {
    div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->";
    if (all[0] == null) {
      break;
    }
  }
  if (v > 4) {
    return v;
  }
  return null;
};

ie = checkIeVersion();

initialize = function() {
  var geoOptions, geocoder;
  geocoder = new google.maps.Geocoder();
  geoOptions = {
    address: 'Paris'
  };
  return geocoder.geocode(geoOptions, function(results, status) {
    var latlng, map, mapOptions, myCenter;
    if (status === google.maps.GeocoderStatus.OK) {
      latlng = new google.maps.LatLng(results[0].geometry.location.hb, results[0].geometry.location.ib);
      myCenter = new google.maps.LatLng(60.0, 105.0);
      mapOptions = {
        zoom: 8,
        center: myCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      return map.setCenter(results[0].geometry.location);
    }
  });
};

onParentClick = function(parent, elt) {
  return $$.addEvent('click', parent, function() {
    return window.location = elt.getAttribute('href');
  });
};

setParentLinkClickable = function(link, parentName) {
  var elt, parent, _i, _len, _ref, _results;
  _ref = Sizzle(link);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    elt = _ref[_i];
    parent = $$.closest(elt, parentName);
    $$.addClass(parent, 'clickable');
    _results.push(onParentClick(parent, elt));
  }
  return _results;
};

handleTouchEffectStart = function() {
  $$.addEvent('touchmove', this, function() {
    return $$.removeClass(this, 'touch');
  });
  return $$.addClass(this, 'touch');
};

handleTouchEffectEnd = function() {
  return $$.removeClass(this, 'touch');
};

handleTouchEffect = function(selector) {
  var elt, _i, _len, _ref, _results;
  _ref = Sizzle(selector);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    elt = _ref[_i];
    $$.addEvent('touchstart', elt, handleTouchEffectStart);
    _results.push($$.addEvent('touchend', elt, handleTouchEffectEnd));
  }
  return _results;
};

handlePopupClick = function(elt) {
  return $$.addEvent('click', elt, function(evt) {
    $$.preventDefault(evt);
    return window.open(elt.href, 'popup');
  });
};

updateHomepagePanels = function() {
  var elt, headerHeight, newHeaderHeight, panelWithImage, panelWithoutImage, panelsWithImage, panelsWithoutImage, _i, _len, _ref;
  if (homepagePanels.length) {
    for (_i = 0, _len = homepagePanels.length; _i < _len; _i++) {
      elt = homepagePanels[_i];
      elt.removeAttribute('style');
      if ((_ref = elt.querySelector('.header')) != null) {
        _ref.style.height = "auto";
      }
    }
    if (isMobile) {
      panelsWithImage = Sizzle('#homepage > .panels > li:not(:nth-child(1)):not(:nth-child(4)) > .panel.image .content:first-child');
      if (panelsWithImage.length === 1) {
        if ($$.heightFor(panelsWithImage[0]) < 150) {
          setTimeout(updateHomepagePanels, 500);
          return;
        }
        panelWithImage = panelsWithImage[0].parentNode.parentNode;
        panelsWithoutImage = Sizzle('#homepage > .panels > li:not(:nth-child(1)):not(:nth-child(4)) > .panel.image .content:nth-child(2)');
        if (panelsWithoutImage.length === 1) {
          panelWithoutImage = panelsWithoutImage[0].parentNode.parentNode;
          if ($$.heightFor(panelWithImage) > $$.heightFor(panelWithoutImage)) {
            headerHeight = $$.heightFor(panelWithoutImage.querySelector('.header'));
            newHeaderHeight = $$.heightFor(panelWithImage.querySelector('.content')) - $$.heightFor(panelWithoutImage.querySelector('.content'));
            return panelWithoutImage.querySelector('.header').style.height = "" + newHeaderHeight + "px";
          } else if ($$.heightFor(panelWithImage) < $$.heightFor(panelWithoutImage)) {
            return panelWithoutImage.children[0].setAttribute('style', "height: " + ($$.heightFor(panelWithImage.children[0])) + "px !important");
          }
        }
      }
    }
  }
};

updateTemplate4Grid = function(selector, nbPerLine, secondNbPerLine, nbPerLineMobile, substract) {
  var boundingClientRect, column, elt, eltHeight, elts, i, offset, updateThem, _column, _elementsToUpdate, _height, _i, _j, _left, _len, _len1, _substract,
    _this = this;
  if (substract == null) {
    substract = 0;
  }
  elts = Sizzle(selector);
  if (elts.length === 0) {
    return;
  }
  _elementsToUpdate = [];
  _height = 0;
  _left = null;
  _column = 0;
  nbPerLine = 3;
  _substract = 0;
  if (isMobile) {
    nbPerLine = nbPerLineMobile;
  }
  updateThem = function() {
    var elementToUpdate, _i, _len, _results;
    if (_elementsToUpdate.length && _height) {
      _results = [];
      for (_i = 0, _len = _elementsToUpdate.length; _i < _len; _i++) {
        elementToUpdate = _elementsToUpdate[_i];
        _results.push(elementToUpdate.setAttribute('style', "height: " + _height + "px !important"));
      }
      return _results;
    }
  };
  for (_i = 0, _len = elts.length; _i < _len; _i++) {
    elt = elts[_i];
    elt.setAttribute('style', '');
  }
  if (nbPerLine === 1) {
    return;
  }
  i = 1;
  for (_j = 0, _len1 = elts.length; _j < _len1; _j++) {
    elt = elts[_j];
    column = Math.ceil((i - _substract) / nbPerLine);
    offset = $$.getOffset(elt);
    if ((secondNbPerLine && (i > 0 && i <= 3 && nbPerLine === 3)) || column === _column) {

    } else {
      updateThem();
      _column = column;
      _left = 0;
      _height = 0;
      _elementsToUpdate = [];
    }
    _left = offset.left;
    boundingClientRect = elt.getBoundingClientRect();
    eltHeight = parseInt(boundingClientRect.bottom, 10) - parseInt(boundingClientRect.top, 10);
    if (eltHeight > _height) {
      _height = eltHeight;
    }
    _elementsToUpdate.push(elt);
    i += 1;
    if (nbPerLine === 3) {
      nbPerLine = 4;
      _substract = substract;
    }
    continue;
  }
  return updateThem();
};

onOrientationChange = function(date) {
  var aside, asideUl, boundingClientRect, dataAttributeName, elt, img, mvp, newHeight, orientation, screenHeight, screenWidth, socialLink, socialLinks, ss, stickyTop, viewportScale, windowHeight, _i, _j, _len, _len1, _ref;
  if ((lastUpdate != null) && lastUpdate > date) {
    return;
  }
  lastUpdate = new Date();
  updateHomepagePanels();
  updateTemplate4Grid('#best-sellers li:not(:first)', 3, 4, 2, 3);
  if (isMobile) {
    _ref = Sizzle('ol.stores > li');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elt = _ref[_i];
      elt.setAttribute('style', '');
    }
  } else {
    updateTemplate4Grid('ol.stores > li', 3, null, null, 0);
  }
  orientation = window.orientation;
  screenWidth = screen.width;
  screenHeight = screen.height;
  switch (orientation) {
    case 90:
    case -90:
      orientation = "landscape";
      if (isIOS) {
        screenWidth = screen.height;
        screenHeight = screen.width;
      }
      break;
    default:
      orientation = "portrait";
  }
  mvp = document.getElementById('viewport');
  if (mvp != null) {
    if (isMobile) {
      mvp.setAttribute('content', 'width=device-width, maximum-scale=1, minimum-scale=1');
    } else {
      viewportScale = screen.width / 980;
      mvp.setAttribute('content', "width=980, maximum-scale=" + viewportScale + ", minimum-scale=" + viewportScale + ", user-scalable=no, target-densitydpi=high-dpi");
    }
  }
  $$.removeClass($body, 'landscape portrait');
  $$.addClass($body, orientation);
  ss = document.styleSheets[0];
  try {
    ss.addRule(".xxxxxx", "position: relative");
  } catch (_error) {}
  if (homepagePanels.length) {
    socialLinks = Sizzle('.social-links li a');
    dataAttributeName = 'data-desktop';
    if (isMobile) {
      dataAttributeName = 'data-mobile';
    }
    for (_j = 0, _len1 = socialLinks.length; _j < _len1; _j++) {
      socialLink = socialLinks[_j];
      img = socialLink.querySelector('img');
      img.src = img.getAttribute(dataAttributeName);
    }
  }
  aside = Sizzle('#container > aside');
  if (aside.length) {
    aside = aside[0];
    asideUl = aside.querySelector('ul');
    boundingClientRect = aside.getBoundingClientRect();
    stickyTop = parseInt(boundingClientRect.top, 10);
    windowHeight = parseInt($$.getWindowHeight(), 10);
    newHeight = windowHeight - 300;
    asideUl.style.height = "" + newHeight + "px";
    if (asideUl.scrollHeight > aside.scrollHeight) {
      $$.show(aside.querySelector('.move-up'));
      $$.show(aside.querySelector('.move-down'));
    } else {
      $$.hide(aside.querySelector('.move-up'));
      $$.hide(aside.querySelector('.move-down'));
      asideUl.style.height = '';
    }
  }
  window.setTimeout((function() {
    $body.webkitTransform = 'rotateZ(0deg)';
    return $body.webkitTransform = 'none';
  }), 200);
  return true;
};

productCarouselFor = function(elt) {
  var article, evtName, moveLeftButton, moveRightButton, nbPerSlide, onProductCarouselChange, productCarousel, _i, _len, _ref;
  nbPerSlide = 2;
  if ($$.hasClass(elt, 'big-big')) {
    nbPerSlide = 4;
  } else if ($$.hasClass(elt, 'big')) {
    nbPerSlide = 3;
  }
  article = $$.closest(elt, 'article');
  if ($$.hasClass(article, 'template-1')) {
    nbPerSlide = 2;
  } else if (article.id === 'category' || $$.hasClass(article, 'template-lp-2')) {
    nbPerSlide = 3;
  } else if ($$.hasClass(article, 'template-lp-3')) {
    nbPerSlide = 4;
  }
  if (isMobile) {
    nbPerSlide = 2;
  }
  productCarousel = new Swipe(elt, {
    continuous: false,
    nbPerSlide: nbPerSlide
  });
  moveLeftButton = elt.querySelector('a.move-left');
  moveRightButton = elt.querySelector('a.move-right');
  onProductCarouselChange = function(index, slide, length) {
    if (index === (length - 1)) {
      $$.hide(moveRightButton);
    } else {
      $$.show(moveRightButton);
    }
    if (index === 0) {
      return $$.hide(moveLeftButton);
    } else {
      return $$.show(moveLeftButton);
    }
  };
  _ref = ['ready', 'willSlideTo', 'didSlideTo'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    evtName = _ref[_i];
    productCarousel.on(evtName, onProductCarouselChange);
  }
  $$.addEvent('click', moveLeftButton, function(evt) {
    $$.preventDefault(evt);
    productCarousel.prev();
    return false;
  });
  return $$.addEvent('click', moveRightButton, function(evt) {
    $$.preventDefault(evt);
    productCarousel.next();
    return false;
  });
};

carouselsForProducts = function() {
  var elt, eltSelector, elts, _i, _len, _results;
  eltSelector = '#homepage .carousel';
  elt = Sizzle(eltSelector);
  if (elt.length === 0) {
    eltSelector = '.carousel';
    elts = Sizzle(eltSelector);
    _results = [];
    for (_i = 0, _len = elts.length; _i < _len; _i++) {
      elt = elts[_i];
      elt.innerHTML = '<a href="#" class="move-left"></a>' + elt.innerHTML + '<a href="#" class="move-right"></a>';
      productCarouselFor(elt);
      continue;
    }
    return _results;
  }
};

handleSocialLinkHover = function(elt) {
  var attr, image, img, _i, _len, _ref;
  img = elt.querySelector('img');
  _ref = ['desktop', 'mobile'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    attr = _ref[_i];
    image = new Image();
    image.src = img.getAttribute("data-" + attr);
  }
  $$.addEvent('mouseover', elt, function() {
    if (isMobile) {
      return img.src = img.getAttribute('data-desktop');
    } else {
      return img.src = img.getAttribute('data-mobile');
    }
  });
  return $$.addEvent('mouseout', elt, function() {
    if (isMobile) {
      return img.src = img.getAttribute('data-mobile');
    } else {
      return img.src = img.getAttribute('data-desktop');
    }
  });
};

carouselOnHomepage = function() {
  var carousel, container, displayControls, elt, eltSelector, evtName, onCarouselChange, _i, _len, _ref;
  eltSelector = '#homepage .carousel';
  elt = Sizzle(eltSelector);
  if (elt.length === 0) {
    return;
  }
  container = elt[0];
  displayControls = container.children.length > 0 && container.children[0].children.length > 1;
  displayControls = true;
  if (displayControls) {
    container.innerHTML = container.innerHTML + '<a href="#" class="previous"></a><a href="#" class="next"><span class="position-in-slides"></span></a>';
  }
  carousel = new Swipe(container, {
    continuous: true,
    delay: 5000
  });
  if (displayControls) {
    onCarouselChange = function(index, slide, length) {
      return Sizzle("" + eltSelector + " .position-in-slides")[0].innerHTML = (index + 1) + '/' + length;
    };
    _ref = ['ready', 'willSlideTo', 'didSlideTo'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      evtName = _ref[_i];
      carousel.on(evtName, onCarouselChange);
    }
    $$.addEvent('click', Sizzle("" + eltSelector + " a.previous")[0], function(evt) {
      $$.preventDefault(evt);
      carousel.prev();
      return false;
    });
    $$.addEvent('click', Sizzle("" + eltSelector + " a.next")[0], function(evt) {
      $$.preventDefault(evt);
      carousel.next();
      return false;
    });
  }
};

toggleOpened = function(elt) {
  return $$.toggleClass(elt, 'opened');
};

handleFaqClick = function(elt) {
  $$.addClass(elt, 'clickable');
  return $$.addEvent('click', elt, function(evt) {
    var dl, _i, _len, _ref, _results;
    $$.preventDefault(evt);
    if ($$.hasClass(elt, 'closed')) {
      $$.addClassToMany('#faq .content > dl > dt', 'closed');
      $$.removeClass(elt, 'closed');
    } else {
      $$.addClassToMany('#faq .content > dl > dt', 'closed');
    }
    _ref = Sizzle('#faq .content > dl');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dl = _ref[_i];
      $$.addClass(dl, 'z');
      _results.push($$.removeClass(dl, 'z'));
    }
    return _results;
  });
};

onContainerClick = function(evt) {
  var openedDropdown;
  openedDropdown = Sizzle('.dropdown.opened');
  $$.preventDefault(evt);
  $$.removeClassToMany('.dropdown', 'opened');
  unregisterContainerDropdownEvent();
  return false;
};

registerContainerDropdownEvent = function() {
  if (Modernizr.touch && !isMobile) {
    return $$.addEvent('click', Sizzle('#container, #container-alt')[0], onContainerClick);
  }
};

unregisterContainerDropdownEvent = function() {
  return Sizzle('#container, #container-alt')[0].removeEventListener('click', onContainerClick);
};

handleDropdown = function(elt) {
  if (!$$.hasClass($html, 'touch')) {
    $$.addEvent('mouseover', elt, function() {
      return $$.addClass(elt, 'opened');
    });
    return $$.addEvent('mouseout', elt, function() {
      return $$.removeClass(elt, 'opened');
    });
  } else {
    return $$.addEvent('click', elt.querySelector('a'), function(evt) {
      var eltHasClass;
      eltHasClass = $$.hasClass(elt, 'opened');
      if (eltHasClass) {
        return true;
      } else {
        $$.preventDefault(evt);
        $$.removeClassToMany('.dropdown', 'opened');
        $$.addClass(elt, 'opened');
        registerContainerDropdownEvent();
        return false;
      }
      return true;
    });
  }
};

handleTocClick = function(elt) {
  return $$.addEvent('click', elt, function(evt) {
    var href, tab;
    $$.preventDefault(evt);
    href = elt.getAttribute('href');
    tab = Sizzle("" + href + ".tab");
    if (tab.length) {
      tab = tab[0];
      $$.addClassToMany('.tab', 'hidden');
      $$.removeClass(tab, 'hidden');
      $$.removeClassToMany('.toc li', 'active');
      return $$.addClass(closest(elt, 'li'), 'active');
    }
  });
};

handleTocAndTab = function(tocElt, tabsElt) {
  var elt, tabs, tocElts, _i, _j, _len, _len1, _ref, _results;
  tocElts = $$.toArray(tocElt.children);
  tabs = $$.toArray(tabsElt.children);
  _ref = tabs.slice(1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    elt = _ref[_i];
    $$.addClass(elt, 'hidden');
  }
  $$.addClass(tocElts[0], 'active');
  _results = [];
  for (_j = 0, _len1 = tocElts.length; _j < _len1; _j++) {
    elt = tocElts[_j];
    _results.push(handleTocClick(elt.querySelector('a')));
  }
  return _results;
};

handleSearchResult = function(elt) {
  return $$.addEvent('click', $$.closest(elt, 'article'), function() {
    var href;
    href = elt.getAttribute('href');
    return window.location = href;
  });
};

handleOrientationEvent = function(evt) {
  if ((ie != null) && ie < 9) {
    return;
  }
  if (Modernizr.touch && evt === 'resize') {
    return;
  }
  return $$.addEvent(evt, window, function() {
    return setTimeout((function() {
      return onOrientationChange(new Date());
    }), 0);
  });
};

resetYoutubeIframe = function(frame) {
  var frameURL;
  frameURL = frame.src;
  frame.src = null;
  return frame.src = frameURL;
};

$$.bindReady(function() {
  var aside, asideOffset, asideWidth, boundingClientRect, button, elt, eltUl, evt, h1, moveAsideInterval, moveDown, moveDownLink, moveUp, moveUpLink, socialNetworkWall, span, spanElement, stickyTop, tabsElt, tocElt, ulReplicate, updateScroll, userAgent, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _q, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
  _ref = Sizzle('.carousel');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    elt = _ref[_i];
    elt.style.visibility = 'hidden';
  }
  $html = Sizzle('html')[0];
  $body = Sizzle('body')[0];
  isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
  isMobile = (window.matchMedia != null) && (window.matchMedia('only screen and (max-width : 650px)').matches || window.matchMedia('only screen and (min-device-width : 719px) and (max-device-width : 721px) and (-webkit-min-device-pixel-ratio : 2) and (orientation : portrait)').matches || window.matchMedia('only screen and (max-device-width: 1280px) and (orientation:landscape) and (resolution: 306dpi)').matches);
  if (navigator.userAgent.match(/(BlackBerry)/g)) {
    isMobile = true;
  }
  homepagePanels = Sizzle('#homepage > .panels > li > .panel.image');
  _ref1 = Sizzle('.carousel');
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    elt = _ref1[_j];
    elt.style.visibility = 'hidden';
    elt.style.height = 0;
  }
  _ref2 = ["orientationchange", "resize", "onresize"];
  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
    evt = _ref2[_k];
    handleOrientationEvent(evt);
  }
  elt = Sizzle('#container > aside .content');
  if (elt.length) {
    elt = elt[0];
    elt.innerHTML = '<a href="#" class="move-up">^</a>' + elt.innerHTML + '<a href="#" class="move-down">v</a>';
    elt = Sizzle('#container > aside .content');
    elt = elt[0];
    eltUl = elt.querySelector('ul');
    $$.addEvent('mousewheel', eltUl, function(evt) {
      this.scrollTop -= evt.wheelDeltaY;
      return $$.preventDefault(evt);
    });
    moveUpLink = elt.querySelector('.move-up');
    moveDownLink = elt.querySelector('.move-down');
    moveUp = function() {
      return eltUl.scrollTop -= 20;
    };
    moveDown = function() {
      return eltUl.scrollTop += 20;
    };
    moveAsideInterval = null;
    $$.addEvent('click', moveUpLink, function(evt) {
      $$.preventDefault(evt);
      return moveUp();
    });
    $$.addEvent('mousedown', moveUpLink, function(evt) {
      $$.preventDefault(evt);
      moveAsideInterval = setInterval(moveUp, 50);
      return false;
    });
    $$.addEvent('click', moveDownLink, function(evt) {
      $$.preventDefault(evt);
      return moveDown();
    });
    $$.addEvent('mousedown', moveDownLink, function(evt) {
      $$.preventDefault(evt);
      moveAsideInterval = setInterval(moveDown, 50);
      return false;
    });
    _ref3 = [moveUpLink, moveDownLink];
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      button = _ref3[_l];
      $$.addEvent('mouseup', button, function(evt) {
        clearInterval(moveAsideInterval);
        return false;
      });
    }
  }
  onOrientationChange(new Date());
  carouselOnHomepage();
  carouselsForProducts();
  if (Modernizr.touch) {
    handleTouchEffect('a');
    handleTouchEffect('label');
  }
  $$.addEvent('click', Sizzle('#main-menu-link')[0], function() {
    var _len4, _m, _ref4;
    toggleOpened(Sizzle('nav[role="navigation"]')[0]);
    _ref4 = Sizzle('iframe.player');
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      elt = _ref4[_m];
      resetYoutubeIframe(elt);
    }
    return false;
  });
  if (!isMobile) {
    _ref4 = Sizzle('.dropdown');
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      elt = _ref4[_m];
      handleDropdown(elt);
    }
  }
  FastClick.attach(document.body);
  if ('ontouchstart' in document) {
    $$.removeClass($html, 'no-touch');
  }
  _ref5 = Sizzle('article.search-result a');
  for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
    elt = _ref5[_n];
    handleSearchResult(elt);
  }
  userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (userAgent.indexOf('Mobile') > -1) {
    if (userAgent.indexOf('Chrome') > -1) {
      $$.addClass($html, 'chrome-mobile');
    } else if (userAgent.indexOf('Android') > -1) {
      $$.addClass($html, 'android');
    } else if (userAgent.indexOf('Safari') > -1) {
      $$.addClass($html, 'ios');
    }
    if (userAgent.indexOf('iPad') > -1) {
      $$.addClass($html, 'ipad');
    }
    if (userAgent.indexOf('Android 2.3') > -1) {
      $$.addClass($html, 'gingerbread');
    }
  } else if (userAgent.indexOf('Android') > -1) {
    $$.addClass($html, 'android-desktop');
    if (userAgent.indexOf('Chrome') > -1) {
      $$.addClass($html, 'chrome-android');
    }
  }
  if (userAgent.match(/OS 5(_\d)+ like Mac OS X/i)) {
    $$.addClass($html, 'ios5');
  }
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
    $$.addClass($html, 'on-mobile');
  } else {
    $$.addClass($html, 'on-desktop');
  }
  if (navigator.appVersion.indexOf("Win") !== -1) {
    $$.addClass($html, 'win');
  }
  setParentLinkClickable('ol.stores article.store footer a', '.store');
  setParentLinkClickable('ul.full article .more-link', 'article');
  setParentLinkClickable('article.product.top header a', 'article');
  $$.addClassToMany('#faq .content > dl > dt:not(:first)', 'closed');
  _ref6 = Sizzle('#faq .content > dl > dt');
  for (_o = 0, _len6 = _ref6.length; _o < _len6; _o++) {
    elt = _ref6[_o];
    handleFaqClick(elt);
  }
  _ref7 = Sizzle('.social-links li a');
  for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
    elt = _ref7[_p];
    handleSocialLinkHover(elt);
    continue;
  }
  if (isMobile) {

  } else if (!Modernizr.touch) {
    aside = Sizzle('#container > aside');
    if (aside.length) {
      aside = aside[0];
      asideOffset = $$.getOffset(aside);
      stickyTop = parseInt(asideOffset.top, 10);
      boundingClientRect = aside.getBoundingClientRect();
      asideWidth = parseInt(boundingClientRect.right, 10) - parseInt(boundingClientRect.left, 10);
      updateScroll = function() {
        var windowTop;
        windowTop = $$.getScrollTop();
        if ((stickyTop - 20) <= windowTop) {
          aside.style.position = 'fixed';
          aside.style.top = '20px';
          aside.style.width = "" + asideWidth + "px";
        } else {
          aside.style.position = 'static';
          aside.style.width = '';
        }
      };
      if ('ontouchstart' in document) {
        $$.addEvent('touchmove', window, function() {
          return updateScroll();
        });
      }
      $$.addEvent('scroll', window, function() {
        return setTimeout(updateScroll, 50);
      });
    }
  }
  tocElt = Sizzle('.toc');
  tabsElt = Sizzle('.tabs');
  if (tocElt.length && tabsElt.length) {
    handleTocAndTab(tocElt[0], tabsElt[0]);
  }
  if (document.getElementById('map-canvas') !== null && typeof google !== 'undefined') {
    google.maps.event.addDomListener(window, 'load', initialize);
  }
  ulReplicate = Sizzle('#brands .replicate');
  if (ulReplicate.length) {
    ulReplicate = ulReplicate[0];
    $$.addEvent('change', ulReplicate, function() {
      return window.location = ulReplicate.options[ulReplicate.selectedIndex].value;
    });
  }
  _ref8 = Sizzle('a[data-popup]');
  for (_q = 0, _len8 = _ref8.length; _q < _len8; _q++) {
    elt = _ref8[_q];
    handlePopupClick(elt);
  }
  socialNetworkWall = Sizzle('#social-network-wall');
  if (socialNetworkWall.length) {
    socialNetworkWall = socialNetworkWall[0];
    span = Sizzle('h1 span', socialNetworkWall);
    h1 = Sizzle('h1', socialNetworkWall);
    if (span.length) {
      span = span[0];
      h1 = h1[0];
      spanElement = document.createElement("span");
      spanElement.className = 'test-social-network-wall';
      document.body.appendChild(spanElement);
      spanElement.innerHTML = span.innerHTML.replace(/<(?:.|\n)*?>/gm, '');
      if (isMobile) {
        h1.style.width = "" + ((spanElement.clientWidth || spanElement.offsetWidth) + 30) + "px";
      } else {
        h1.style.width = "" + ((spanElement.clientWidth || spanElement.offsetWidth) + 70) + "px";
      }
      return spanElement.parentNode.removeChild(spanElement);
    }
  }
});
