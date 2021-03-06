/**
* rangeSlider.js v1.0.0
* 
* © 2016 - 2017 MASANORI IWATA <info@masanoriiwata.jp>
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
**/
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.rangeSliderBabel = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _percent(pos, max) {

    return pos / max * 100;
  }

  function _pixel(pos, min, max) {

    return (max + Math.abs(min)) / (100 / pos) - Math.abs(min);
  }

  function _getTouchY(e) {

    return e.pageX === undefined ? e.touches[0].pageX : e.pageX;
  }

  var RangeSlider = function () {
    _createClass(RangeSlider, null, [{
      key: 'defaults',
      value: function defaults() {

        return {
          sliderId: 'range-slider',
          handleId: 'range-slider__handle',
          barId: 'range-slider__bar',
          startPosition: 0,
          scaleDimension: 1,
          handleDefaultPos: -7,
          onDrag: null,
          onDragging: null,
          onDragged: null,
          onChanged: null,
          onRefreshed: null,
          onInitialized: null
        };
      }
    }]);

    function RangeSlider(options) {
      _classCallCheck(this, RangeSlider);

      this.options = _extends({}, this.constructor.defaults(), options);
      this.slider = document.getElementById(this.options.sliderId);
      this.handle = document.getElementById(this.options.handleId);
      this.bar = document.getElementById(this.options.barId);
      this.setup();
      this.init();
    }

    _createClass(RangeSlider, [{
      key: 'setup',
      value: function setup() {

        this.position = [];
        this.position.cache = [];
        this.handleDimension = this.handle.clientWidth;
        this.rangeLimitMin = this.options.handleDefaultPos;
        this.rangeLimitMax = this.bar.clientWidth + this.rangeLimitMin;

        this.onDragstart = this.dragstart.bind(this);
        this.onDragmove = this.dragmove.bind(this);
        this.onDragend = this.dragend.bind(this);
        this.onResize = this.refresh.bind(this);
      }
    }, {
      key: 'init',
      value: function init() {

        this.$(window).on('resize');

        this.$(this.slider).on('touchstart mousedown');
        this.resize = [this.slider.clientWidth];
        this.position = [this.options.startPosition, 0];
        this.handle.style.left = this.options.startPosition + 'px';
        this.slider.style.left = this.rangeLimitMin * 2 + 'px';
        this.slider.style.right = this.rangeLimitMin * 2 + 'px';
        this.position.cache = [this.options.startPosition, this.options.startPosition];

        var pos = _pixel(this.options.startPosition, this.rangeLimitMin, this.rangeLimitMax);
        this.setPosition(pos);

        this.callback('onInitialized');
      }
    }, {
      key: 'update',
      value: function update() {

        this.rangeLimitMax = this.bar.clientWidth + this.rangeLimitMin;
      }
    }, {
      key: '$',
      value: function $(elem) {

        this.$.elem = null;
        this.$.elem = elem;
        return this;
      }
    }, {
      key: 'on',
      value: function on(event) {

        this.listener(event, 'add');
        return this;
      }
    }, {
      key: 'off',
      value: function off(event) {

        this.listener(event, 'remove');
        return this;
      }
    }, {
      key: 'listener',
      value: function listener(eventTypes, actionType) {
        var _this = this;

        var handlers = {
          resize: [this.onResize, false],
          touchstart: [this.onDragstart, false],
          mousedown: [this.onDragstart, false],
          touchmove: [this.onDragmove, false],
          mousemove: [this.onDragmove, false],
          touchend: [this.onDragend, false],
          mouseup: [this.onDragend, false]
        };
        var wrap = function wrap(action, eventName, handler) {
          var _$$elem;

          var args = [eventName, handler[0]].concat(_toConsumableArray(handler.slice(1))).concat();

          if (!_this.listener.cache) _this.listener.cache = {};
          if (action === 'add') _this.listener.cache[eventName] = args;
          if (_this.listener.cache[eventName]) (_$$elem = _this.$.elem)[action + 'EventListener'].apply(_$$elem, _toConsumableArray(_this.listener.cache[eventName]));
          if (action === 'remove') delete _this.listener.cache[eventName];
        };

        eventTypes.split(' ').forEach(function (key) {
          return wrap(actionType, key, handlers[key]);
        });
      }
    }, {
      key: 'dragstart',
      value: function dragstart(e) {

        this.$(document).on('touchmove touchend mousemove mouseup');
        var posX = _getTouchY(e);
        var rectLeft = this.slider.getBoundingClientRect().left;
        var skipX = this.setPosition(posX - this.handleDimension - rectLeft);

        this.dragstart.posX = posX - skipX;

        this.callback('onDrag');
      }
    }, {
      key: 'dragmove',
      value: function dragmove(e) {

        e.preventDefault();

        var posX = _getTouchY(e);
        var pos = this.dragmove.posX = posX - this.dragstart.posX;
        this.setPosition(pos);

        this.callback('onDragging');
      }
    }, {
      key: 'dragend',
      value: function dragend() {

        var posX = this.position[0];
        var pct = _percent(posX, this.rangeLimitMax);
        this.position.cache[1] = pct;

        this.callback('onDragged');
        this.$(document).off('touchmove touchend mousemove mouseup');
      }
    }, {
      key: 'refresh',
      value: function refresh() {

        this.update();

        var pos = _pixel(this.position.cache[1], this.rangeLimitMin, this.rangeLimitMax);
        this.setPosition(pos);

        this.callback('onRefreshed');
      }
    }, {
      key: 'setPosition',
      value: function setPosition(pos) {

        pos = this.posBaranser(pos);

        this.handle.style.left = pos + 'px';
        // Is changed
        if (pos !== this.position.cache[0]) {

          this.callback('onChanged');
        }

        return this.position.cache[0] = pos;
      }
    }, {
      key: 'posBaranser',
      value: function posBaranser(pos) {
        var _ref = [this.rangeLimitMin, this.rangeLimitMax],
            min = _ref[0],
            max = _ref[1];

        var dim = this.options.scaleDimension;
        var acceptable = dim / 2;

        if (pos < min) pos = min;
        if (pos > max) pos = max;

        var pct = _percent(pos + Math.abs(min), max + Math.abs(min));
        var scale = this.position[1] = Math.floor((pct + acceptable) / dim) * dim;

        return this.position[0] = _pixel(scale, min, max);
      }
    }, {
      key: 'callback',
      value: function callback(name) {

        if (typeof this.options[name] === 'function') {
          var _options$name;

          (_options$name = this.options[name]).call.apply(_options$name, [this].concat(_toConsumableArray(this.position)));
        }
      }
    }]);

    return RangeSlider;
  }();

  exports.default = RangeSlider;

  window.RangeSlider = RangeSlider;
});
