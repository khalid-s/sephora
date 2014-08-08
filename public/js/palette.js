var enableLook, handleCategory, handleLook, handleMovie, onYouTubeIframeAPIReady, players, stopMovies;

players = new Array();

enableLook = function(elt) {
  var i, look, option, parent, replicateElt, _elt, _i, _id, _j, _len, _len1, _ref, _ref1;
  if (typeof elt === 'string') {
    _ref = Sizzle('.palette-category .looks li');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _elt = _ref[_i];
      if (_elt.children[0].getAttribute('href') === elt) {
        elt = _elt;
        $$.removeClassToMany('.palette-category', 'active');
        parent = $$.closest(elt, 'article');
        $$.addClass(parent, 'active');
        break;
      }
    }
  }
  $$.removeClassToMany('.look-details .look', 'active');
  $$.removeClassToMany('.palette-category .looks li', 'active');
  $$.addClass(elt, 'active');
  _id = '#' + Sizzle('a', elt)[0].getAttribute('href').split('#')[1];
  look = Sizzle(_id)[0];
  if (look != null) {
    $$.addClass(look, 'active');
  }
  replicateElt = Sizzle('.replicate')[0];
  _ref1 = replicateElt.options;
  for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
    option = _ref1[i];
    if (option.value === _id) {
      replicateElt.selectedIndex = i;
      break;
    }
  }
  return true;
};

handleMovie = function(elt) {
  return players.push(new YT.Player(elt, {
    width: 1280,
    height: 720,
    videoId: 'M7lc1UVf-VE'
  }));
};

stopMovies = function() {
  var player, _i, _len;
  for (_i = 0, _len = players.length; _i < _len; _i++) {
    player = players[_i];
    if (typeof player.stopVideo === "function") {
      player.stopVideo();
    }
  }
  return true;
};

handleLook = function(elt) {
  return $$.addEvent('click', elt, function(evt) {
    $$.preventDefault(evt);
    if (!$$.hasClass(elt, 'active')) {
      $$.removeClassToMany('.palette-category ul li', 'active');
      stopMovies();
      return enableLook(elt);
    }
  });
};

handleCategory = function(elt) {
  var look, looks, _i, _len, _ref;
  $$.addEvent('click', elt, function(evt) {
    var ul;
    $$.preventDefault(evt);
    if (!$$.hasClass(elt, 'active')) {
      stopMovies();
      $$.removeClassToMany('.palette-category', 'active');
      $$.addClass(elt, 'active');
      ul = Sizzle('ul', elt)[0];
      return enableLook(ul.children[0]);
    }
  });
  looks = Sizzle('ul', elt)[0];
  _ref = looks.children;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    look = _ref[_i];
    handleLook(look);
  }
  return true;
};

$$.bindReady(function() {
  var category, firstScriptTag, tag, ulReplicate, _i, _len, _ref;
  tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  _ref = Sizzle('.palette-category');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    category = _ref[_i];
    handleCategory(category);
  }
  enableLook(Sizzle('.palette-category ul li')[0]);
  ulReplicate = Sizzle('.replicate')[0];
  return $$.addEvent('change', ulReplicate, function() {
    return enableLook(ulReplicate.options[ulReplicate.selectedIndex].value);
  });
});

onYouTubeIframeAPIReady = function() {
  var movie, _i, _len, _ref, _results;
  _ref = Sizzle('.youtube-player');
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    movie = _ref[_i];
    _results.push(handleMovie(movie));
  }
  return _results;
};
