# Range slider

http://www.masanoriiwata.jp/rangeslider/index.html


## Features

 * Simple and fast
 * Supports touch devices
 * Responsive designs
 * Use Babel
 * No jQuery

## Options

```js
new RangeSlider( {
  sliderId        : 'range-slider',
  handleId        : 'range-slider__handle',
  barId           : 'range-slider__bar',
  startPosition   : 0,
  scaleDimension  : 1,
  handleDefaultPos: -7,
  onDrag          : null,
  onDragging      : null,
  onDragged       : null,
  onChanged       : null,
  onRefreshed     : null,
  onInitialized   : null
} );
```
## Example

```html
<div class="range-slider__container">
  <div id="weather-slider__bar" class="range-slider__bar range-slider__bar--style_02"></div>
  <div id="weather-slider__handle" class="range-slider__handle range-slider__handle--style_02">
    <div class="range-slider__handle__item"></div>
  </div>
  <div id="weather-slider" class="range-slider__handle-area"></div>
  <div id="weather-slider__scale" class="range-slider__scale">
    <div id="range-slider__scale__item-0" style="left:0%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-1" style="left:12.5%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-2" style="left:25%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-3" style="left:37.5%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-4" style="left:50%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-5" style="left:62.5%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-6" style="left:75%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-7" style="left:87.5%" class="range-slider__scale__item"></div>
    <div id="range-slider__scale__item-8" style="left:100%" class="range-slider__scale__item"></div>
  </div>
  <div class="range-slider__timezone">
    <div class="range-slider__timezone__item">03:00</div>
    <div class="range-slider__timezone__item">09:00</div>
    <div class="range-slider__timezone__item">15:00</div>
    <div class="range-slider__timezone__item">21:00</div>
  </div>
</div>
```

```js
var imagesLoaded = {};
var images = {
  sun   : 'img/img_sun_01.png',
  rain  : 'img/img_rain_01.png',
  cloud1: 'img/img_cloud_01.png',
  cloud2: 'img/img_cloud_02.png'
};

( function( state, images ) {

  for ( var i = images.length; i--; ) ( function( i ) {

    var img = new Image();
    state[ images[ i ] ] = false;
    img.onload = function load() {

      state[ images[ i ] ] = true;

    };

    img.src = images[ i ];

  } )( i );

} )( imagesLoaded, Object.keys( images ).map( function( key ) {return images[ key ]} ) );

var weathers = {
  0   : images.rain,
  12.5: images.cloud1,
  25  : images.cloud2,
  37.5: images.sun,
  50  : images.sun,
  62.5: images.sun,
  75  : images.sun,
  87.5: images.cloud1,
  100 : images.cloud1
};

var weatherIcon = function weatherIcon( px, pct ) {

  var elem = document.getElementById( 'weather' );
  var loadedCheck = function() {

    if ( imagesLoaded[ weathers[ pct ] ] ) {

      elem.src = weathers[ pct ];
      clearInterval( weatherIcon.timers[ weathers[ pct ] ] );
      weatherIcon.timers[ weathers[ pct ] ] = null;
      return;

    }

  };

  if ( !weatherIcon.timers ) weatherIcon.timers = {};
  if ( !weatherIcon.timers[ weathers[ pct ] ] ) weatherIcon.timers[ weathers[ pct ] ] = null;

  for ( var key in weatherIcon.timers ) {

    if ( weatherIcon.timers[ key ] ) {

      clearInterval( weatherIcon.timers[ key ] );

    }

  }

  if ( imagesLoaded[ weathers[ pct ] ] ) {

    elem.src = weathers[ pct ];
    return;

  }

  elem.src = 'img/img_info_01.png';

  weatherIcon.timers[ weathers[ pct ] ] = setInterval( loadedCheck, 150 );

};

var example1 = new RangeSlider( {
  sliderId      : 'weather-slider',
  handleId      : 'weather-slider__handle',
  barId         : 'weather-slider__bar',
  scaleDimension: 12.5,
  onChanged     : weatherIcon,
  onInitialized : weatherIcon
} );

```
## License
© 2016 - 2017 MASANORI IWATA <info@masanoriiwata.jp>

rangeSlider.js: http://www.masanoriiwata.jp/rangeslider/index.html

Released under the MIT licenses<br>
http://opensource.org/licenses/mit-license.php

