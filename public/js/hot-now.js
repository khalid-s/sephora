var updateHotNowPanels;

updateHotNowPanels = function() {
  var boundingClientRect, elt, eltHeight, elts, i, line, _height, _heights, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _results, _results1;
  elts = Sizzle('#hot-now > ul > li');
  for (_i = 0, _len = elts.length; _i < _len; _i++) {
    elt = elts[_i];
    elt.removeAttribute('style');
    elt.children[0].removeAttribute('style');
  }
  if (isMobile) {
    _heights = [];
    i = 1;
    line = 0;
    for (_j = 0, _len1 = elts.length; _j < _len1; _j++) {
      elt = elts[_j];
      line = Math.ceil(i / 2);
      boundingClientRect = elt.getBoundingClientRect();
      eltHeight = parseInt(boundingClientRect.bottom, 10) - parseInt(boundingClientRect.top, 10);
      if ((_heights[line] == null) || eltHeight > _heights[line]) {
        _heights[line] = eltHeight;
      }
      i += 1;
    }
    i = 1;
    line = 0;
    _results = [];
    for (_k = 0, _len2 = elts.length; _k < _len2; _k++) {
      elt = elts[_k];
      line = Math.ceil(i / 2);
      elt.setAttribute('style', "height: " + _heights[line] + "px !important");
      elt.children[0].setAttribute('style', "height: " + _heights[line] + "px !important");
      _results.push(i += 1);
    }
    return _results;
  } else {
    _height = 0;
    for (_l = 0, _len3 = elts.length; _l < _len3; _l++) {
      elt = elts[_l];
      boundingClientRect = elt.getBoundingClientRect();
      eltHeight = parseInt(boundingClientRect.bottom, 10) - parseInt(boundingClientRect.top, 10);
      if (eltHeight > _height) {
        _height = eltHeight;
      }
    }
    _results1 = [];
    for (_m = 0, _len4 = elts.length; _m < _len4; _m++) {
      elt = elts[_m];
      elt.setAttribute('style', "height: " + _height + "px !important");
      _results1.push(elt.children[0].setAttribute('style', "height: " + _height + "px !important"));
    }
    return _results1;
  }
};

$$.bindReady(function() {
  var evt, onOrientationChange, _i, _len, _ref;
  onOrientationChange = function() {
    return updateHotNowPanels();
  };
  _ref = ["orientationchange", "resize", "onresize"];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    evt = _ref[_i];
    $$.addEvent(evt, window, function() {
      return setTimeout(onOrientationChange, 1000);
    });
  }
  return setTimeout(onOrientationChange, 1000);
});
