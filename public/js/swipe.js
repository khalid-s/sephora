var Swipe, isInDocument, toArray, transitionsSupport,
  __slice = [].slice;

if (!window.getComputedStyle) {
  window.getComputedStyle = function(el, pseudo) {
    this.el = el;
    this.getPropertyValue = function(prop) {
      var re;
      re = /(\-([a-z]){1})/g;
      if (prop === 'float') {
        prop = 'styleFloat';
      }
      if (re.test(prop)) {
        prop = prop.replace(re, function() {
          return arguments[2].toUpperCase();
        });
      }
      if (el.currentStyle[prop]) {
        return el.currentStyle[prop];
      }
      return null;
    };
    return this;
  };
}

toArray = function(iterable) {
  var length, results;
  if (!iterable) {
    return [];
  }
  if (iterable === 'object' && 'toArray' in iterable) {
    return iterable.toArray();
  }
  length = iterable.length || 0;
  results = new Array(length);
  while (length--) {
    results[length] = iterable[length];
  }
  return results;
};

transitionsSupport = function() {
  var prop, tmp, _i, _len, _ref;
  tmp = document.createElement('swipe');
  _ref = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    prop = _ref[_i];
    if (tmp.style[prop] != null) {
      return true;
    }
  }
  return false;
};

isInDocument = function(el) {
  var html;
  html = document.body.parentNode;
  while (el) {
    if (el === html) {
      return true;
    }
    el = el.parentNode;
    return false;
  }
};

Swipe = (function() {
  function Swipe(container, options) {
    var attr, element, elements, elt, i, lists, rootUl, rootUlLi, ul, _i, _len, _ref,
      _this = this;
    if (typeof container === 'string') {
      container = Sizzle(container);
      if (container.length > 0) {
        this.container = container[0];
      } else {
        console.error('No container !!!');
      }
    } else {
      this.container = container;
    }
    if (!this.container) {
      console.error('No container !!!');
      return;
    }
    this.noop = function() {};
    this.offloadFn = function() {};
    this.browser = {
      addEventListener: !!window.addEventListener,
      touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
      transitions: transitionsSupport()
    };
    this.slides = [];
    this.width = null;
    this.length = null;
    this.interval = null;
    this.delay = 0;
    this.nbPerSlide = 1;
    this.cloneDone = false;
    _ref = ['delay', 'nbPerSlide'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      attr = _ref[_i];
      if (options[attr]) {
        this[attr] = options[attr];
      }
    }
    this.isReady = false;
    this.start = {};
    this.delta = {};
    this.isScrolling = false;
    this.textDirection = Sizzle('html')[0].getAttribute('dir') || 'ltr';
    if (this.textDirection === 'ltr') {
      this.defaultFloat = 'left';
    } else {
      this.defaultFloat = 'right';
    }
    this.eventsCallbacks = {};
    this.options = options || {};
    if (this.nbPerSlide > 1) {
      elements = toArray(this.container.querySelector('ul').children);
      lists = [];
      rootUl = document.createElement('ul');
      while (elements.length) {
        ul = document.createElement('ul');
        i = 0;
        while (i < this.nbPerSlide) {
          elt = elements.shift();
          if (elt == null) {
            break;
          }
          elt.parentNode.removeChild(elt);
          ul.appendChild(elt);
          i++;
        }
        rootUlLi = document.createElement('li');
        rootUlLi.appendChild(ul);
        rootUl.appendChild(rootUlLi);
      }
      element = this.container.querySelector('ul');
      element.parentNode.removeChild(element);
      this.container.appendChild(rootUl);
    }
    this.element = this.container.querySelector('ul');
    this.index = parseInt(this.options.startSlide) || 0;
    this.speed = this.options.speed;
    this.speed = 300;
    if (typeof this.options.continuous === 'boolean') {
      this.continuous = this.options.continuous;
    } else {
      this.continuous = false;
    }
    this.setup();
    if (this.delay) {
      this.begin();
    }
    if (this.browser.addEventListener) {
      if (this.browser.touch) {
        this.element.addEventListener('touchstart', this, false);
      }
      if (this.browser.transitions) {
        this.element.addEventListener('webkitTransitionEnd', this, false);
        this.element.addEventListener('msTransitionEnd', this, false);
        this.element.addEventListener('oTransitionEnd', this, false);
        this.element.addEventListener('otransitionend', this, false);
        this.element.addEventListener('transitionend', this, false);
      }
      window.addEventListener('resize', this, false);
    } else {
      window.onresize = function() {
        return _this.setup();
      };
    }
  }

  Swipe.prototype.setup = function() {
    var firstElement, index, paddingLeft, paddingRight, pos, slide, styles;
    this.slides = this.element.children;
    if (this.length == null) {
      this.length = this.slides.length;
    }
    if (this.slides.length < 2) {
      this.continuous = false;
    }
    if (this.browser.transitions && this.continuous && this.slides.length < 3) {
      this.element.appendChild(this.slides[0].cloneNode(true));
      this.element.appendChild(this.element.children[1].cloneNode(true));
      this.slides = this.element.children;
    }
    if (!this.browser.transitions && this.continuous && !this.cloneDone) {
      firstElement = this.element.children[0];
      this.element.insertBefore(this.element.children[this.element.children.length - 1].cloneNode(true), firstElement);
      this.element.appendChild(firstElement.cloneNode(true));
      this.index = 1;
      this.cloneDone = true;
    }
    this.slidePos = new Array(this.slides.length);
    this.width = this.container.getBoundingClientRect().width || this.container.offsetWidth;
    styles = window.getComputedStyle(this.container, null);
    paddingLeft = parseInt(styles.getPropertyValue('padding-left'), 10);
    paddingRight = parseInt(styles.getPropertyValue('padding-right'), 10);
    this.width = this.width - paddingLeft - paddingRight;
    this.element.style.width = "" + ((this.slides.length * this.width) + 50) + "px";
    pos = this.slides.length;
    while (pos--) {
      slide = this.slides[pos];
      slide.style.width = "" + this.width + "px";
      slide.setAttribute('data-index', pos);
      if (this.browser.transitions) {
        slide.style[this.defaultFloat] = "" + (pos * -this.width) + "px";
        if (this.index > pos) {
          this.move(pos, -this.width, 0);
        } else if (this.index < pos) {
          this.move(pos, this.width, 0);
        } else {
          this.move(pos, 0, 0);
        }
      }
    }
    if (this.continuous && this.browser.transitions) {
      this.move(this.circle(this.index - 1), -this.width, 0);
      this.move(this.circle(this.index + 1), this.width, 0);
    }
    if (!this.browser.transitions) {
      this.element.style[this.defaultFloat] = "" + (this.index * -this.width) + "px";
    }
    this.container.style.visibility = 'visible';
    this.container.style.height = '';
    index = this.getPos();
    this.isReady = true;
    this.fire('ready', index, this.slides[index], this.length);
  };

  Swipe.prototype.getPos = function(index) {
    if (index == null) {
      index = this.index;
    }
    if (this.browser.transitions && this.continuous && this.length < 3 && index >= this.length) {
      return index - 2;
    }
    if (this.cloneDone) {
      index = index - 1;
      if (index < 0) {
        index = 0;
      }
    }
    return index;
  };

  Swipe.prototype.begin = function() {
    var interval,
      _this = this;
    return interval = setTimeout((function() {
      return _this._next();
    }), this.delay);
  };

  Swipe.prototype.stop = function() {
    this.delay = 0;
    return clearTimeout(this.interval);
  };

  Swipe.prototype._toLeft = function() {
    if (this.continuous || this.index) {
      return this._slide(this.index - 1);
    }
  };

  Swipe.prototype._toRight = function() {
    if (this.continuous || this.index < (this.slides.length - 1)) {
      return this._slide(this.index + 1);
    }
  };

  Swipe.prototype._prev = function() {
    if (this.textDirection === 'rtl') {
      this._toRight();
    } else {
      this._toLeft();
    }
  };

  Swipe.prototype.prev = function() {
    this.stop();
    return this._prev();
  };

  Swipe.prototype._next = function() {
    if (this.textDirection === 'rtl') {
      this._toLeft();
    } else {
      this._toRight();
    }
  };

  Swipe.prototype.next = function() {
    this.stop();
    return this._next();
  };

  Swipe.prototype.circle = function(index) {
    return (this.slides.length + (index % this.slides.length)) % this.slides.length;
  };

  Swipe.prototype._slide = function(to, slideSpeed) {
    var diff, direction, index, natural_direction;
    if (this.index === to) {
      return;
    }
    if (this.browser.transitions) {
      direction = Math.abs(this.index - to) / (this.index - to);
      if (this.continuous) {
        natural_direction = direction;
        direction = -this.slidePos[this.circle(to)] / this.width;
        if (direction !== natural_direction) {
          to = -direction * this.slides.length + to;
        }
      }
      diff = Math.abs(this.index - to) - 1;
      while (diff--) {
        if (to > this.index) {
          this.move(this.circle(to - diff - 1), this.width * direction, 0);
        } else {
          this.move(this.circle(this.index - diff - 1), this.width * direction, 0);
        }
      }
      to = this.circle(to);
      if (!this.continuous) {
        index = this.getPos(to);
        this.fire('willSlideTo', index, this.slides[to], this.length);
      }
      this.move(this.index, this.width * direction, slideSpeed || this.speed);
      this.move(to, 0, slideSpeed || this.speed);
      if (this.continuous) {
        index = this.circle(to - direction);
        this.fire('willSlideTo', this.getPos(index), this.slides[to], this.length);
        this.move(index, -(this.width * direction), 0);
      }
    } else {
      if (this.continuous && this.cloneDone) {
        to = this.circle(to);
        this.fire('willSlideTo', index, this.slides[to], this.length);
        this.animate(this.index * -this.width, to * -this.width, slideSpeed || this.speed);
        if (to === 0) {
          to = this.element.children.length - 2;
          this.animate(this.index * -this.width, to * -this.width, null);
        } else if (to === (this.element.children.length - 1)) {
          to = 1;
          this.animate(this.index * -this.width, to * -this.width, null);
        }
      } else {
        to = this.circle(to);
        index = this.getPos(to);
        this.fire('willSlideTo', index, this.slides[to], this.length);
        this.animate(this.index * -this.width, to * -this.width, slideSpeed || this.speed);
      }
    }
    this.index = to;
    return this.offloadFn(this.callback && this.callback(this.index, this.slides[this.index], this.length));
  };

  Swipe.prototype.slide = function(to, slideSpeed) {
    this.stop();
    return this._slide(to, slideSpeed);
  };

  Swipe.prototype.move = function(index, dist, speed) {
    this.translate(index, dist, speed);
    return this.slidePos[index] = dist;
  };

  Swipe.prototype.translate = function(index, dist, speed) {
    var slide, style;
    slide = this.slides[index];
    style = slide && slide.style;
    if (!style) {
      return;
    }
    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    return style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
  };

  Swipe.prototype.animate = function(from, to, speed) {
    var start, timer,
      _this = this;
    if (!speed) {
      this.element.style[this.defaultFloat] = to + 'px';
      return;
    }
    start = +new Date();
    return timer = setInterval((function() {
      var leftValue, timeElap;
      timeElap = +new Date() - start;
      if (timeElap > speed) {
        _this.element.style[_this.defaultFloat] = to + 'px';
        if (_this.delay) {
          _this.begin();
        }
        _this.transitionEnd && _this.transitionEnd.call(event, _this.index, _this.slides[_this.index]);
        clearInterval(timer);
        return;
      }
      leftValue = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';
      return _this.element.style[_this.defaultFloat] = leftValue;
    }), 4);
  };

  Swipe.prototype.handleEvent = function(evt) {
    var _this = this;
    switch (evt.type) {
      case 'touchstart':
        this._touchstart(evt);
        break;
      case 'touchmove':
        this._touchmove(evt);
        break;
      case 'touchend':
        this.offloadFn(this._touchend(evt));
        break;
      case 'webkitTransitionEnd':
      case 'msTransitionEnd':
      case 'oTransitionEnd':
      case 'otransitionend':
      case 'transitionend':
        this.offloadFn(this._transitionEnd(evt));
        break;
      case 'resize':
        this.element.style.display = "none";
        window.setTimeout((function() {
          _this.offloadFn(_this.setup());
          return _this.element.style.display = null;
        }), 500);
    }
    if (this.stopPropagation) {
      return evt.stopPropagation();
    }
  };

  Swipe.prototype._touchstart = function(evt) {
    var touches;
    touches = evt.touches[0];
    this.start = {
      x: touches.pageX,
      y: touches.pageY,
      time: +new Date()
    };
    this.isScrolling = void 0;
    this.delta = {};
    this.element.addEventListener('touchmove', this, false);
    return this.element.addEventListener('touchend', this, false);
  };

  Swipe.prototype._touchmove = function(evt) {
    var touches;
    if (evt.touches.length > 1 || evt.scale && evt.scale !== 1) {
      return;
    }
    if (this.disableScroll) {
      evt.prevtDefault();
    }
    touches = evt.touches[0];
    this.delta = {
      x: touches.pageX - this.start.x,
      y: touches.pageY - this.start.y
    };
    if (this.isScrolling == null) {
      this.isScrolling = !!(this.isScrolling || Math.abs(this.delta.x) < Math.abs(this.delta.y));
    }
    if (!this.isScrolling) {
      evt.preventDefault();
      this.stop();
      if (this.continuous) {
        this.translate(this.circle(this.index - 1), this.delta.x + this.slidePos[this.circle(this.index - 1)], 0);
        this.translate(this.index, this.delta.x + this.slidePos[this.index], 0);
        this.translate(this.circle(this.index + 1), this.delta.x + this.slidePos[this.circle(this.index + 1)], 0);
      } else {
        if (!this.index && this.delta.x > 0 || this.index === this.slides.length - 1 && this.delta.x < 0) {
          this.delta.x = this.delta.x / (Math.abs(this.delta.x) / this.width + 1);
        } else {
          this.delta.x = this.delta.x / 1;
        }
        this.translate(this.index - 1, this.delta.x + this.slidePos[this.index - 1], 0);
        this.translate(this.index, this.delta.x + this.slidePos[this.index], 0);
        this.translate(this.index + 1, this.delta.x + this.slidePos[this.index + 1], 0);
      }
    }
  };

  Swipe.prototype._touchend = function(event) {
    var direction, duration, isPastBounds, isValidSlide;
    duration = +new Date() - this.start.time;
    isValidSlide = Number(duration) < 250 && Math.abs(this.delta.x) > 20 || Math.abs(this.delta.x) > this.width / 2;
    isPastBounds = !this.index && this.delta.x > 0 || this.index === this.slides.length - 1 && this.delta.x < 0;
    if (this.continuous) {
      isPastBounds = false;
    }
    direction = this.delta.x < 0;
    if (!this.isScrolling) {
      if (isValidSlide && !isPastBounds) {
        if (direction) {
          if (this.continuous) {
            this.move(this.circle(this.index - 1), -this.width, 0);
            this.move(this.circle(this.index + 2), this.width, 0);
          } else {
            this.move(this.index - 1, -this.width, 0);
          }
          this.move(this.index, this.slidePos[this.index] - this.width, this.speed);
          this.move(this.circle(this.index + 1), this.slidePos[this.circle(this.index + 1)] - this.width, this.speed);
          this.index = this.circle(this.index + 1);
        } else {
          if (this.continuous) {
            this.move(this.circle(this.index + 1), this.width, 0);
            this.move(this.circle(this.index - 2), -this.width, 0);
          } else {
            this.move(this.index + 1, this.width, 0);
          }
          this.move(this.index, this.slidePos[this.index] + this.width, this.speed);
          this.move(this.circle(this.index - 1), this.slidePos[this.circle(this.index - 1)] + this.width, this.speed);
          this.index = this.circle(this.index - 1);
        }
        this.callback && this.callback(this.index, this.slides[this.index], this.length);
      } else {
        if (this.continuous) {
          this.move(this.circle(this.index - 1), -this.width, this.speed);
          this.move(this.index, 0, this.speed);
          this.move(this.circle(this.index + 1), this.width, this.speed);
        } else {
          this.move(this.index - 1, -this.width, this.speed);
          this.move(this.index, 0, this.speed);
          this.move(this.index + 1, this.width, this.speed);
        }
      }
    }
    this.element.removeEventListener('touchmove', this, false);
    return this.element.removeEventListener('touchend', this, false);
  };

  Swipe.prototype._transitionEnd = function(evt) {
    var index;
    if (parseInt(evt.target.getAttribute('data-index'), 10) === this.index) {
      index = this.getPos();
      this.fire('didSlideTo', index, this.slides[index], this.length);
      if (this.delay) {
        this.begin();
      }
      return this.transitionEnd && this.transitionEnd.call(evt, this.index, this.slides[this.index]);
    }
  };

  Swipe.prototype.callback = function(index, slide, length) {
    return this.fire('didSlideTo', this.getPos(index), slide, length);
  };

  Swipe.prototype.on = function(eventName, callback) {
    var eventArray, index, _base;
    eventArray = (_base = this.eventsCallbacks)[eventName] != null ? (_base = this.eventsCallbacks)[eventName] : _base[eventName] = [];
    eventArray.push(callback);
    if (eventName === 'ready' && this.isReady) {
      index = this.getPos();
      return callback(index, this.slides[index], this.length);
    }
  };

  Swipe.prototype.fire = function() {
    var args, callback, eventArray, eventName, _i, _len;
    eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    eventArray = this.eventsCallbacks[eventName];
    if (eventArray != null) {
      for (_i = 0, _len = eventArray.length; _i < _len; _i++) {
        callback = eventArray[_i];
        if (callback != null) {
          callback.apply(this, args);
        }
      }
      return true;
    }
    return false;
  };

  return Swipe;

})();

window.Swipe = Swipe;
