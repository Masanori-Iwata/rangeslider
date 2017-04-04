function _percent( pos, max ) {

  return ( pos / max ) * 100;

}

function _pixel( pos, min, max ) {

  return ( ( max + Math.abs( min ) ) / ( 100 / pos ) ) - Math.abs( min );

}

function _getTouchY( e ) {

  return ( e.pageX === undefined ? e.touches[ 0 ].pageX : e.pageX );

}

class RangeSlider {

  static defaults() {

    return {
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
    };

  }

  constructor( options ) {

    this.options = {...this.constructor.defaults(), ...options};
    this.slider = document.getElementById( this.options.sliderId );
    this.handle = document.getElementById( this.options.handleId );
    this.bar = document.getElementById( this.options.barId );
    this.setup();
    this.init();

  }

  setup() {

    this.position = [];
    this.position.cache = [];
    this.handleDimension = this.handle.clientWidth;
    this.rangeLimitMin = this.options.handleDefaultPos;
    this.rangeLimitMax = this.bar.clientWidth + this.rangeLimitMin;

    this.onDragstart = this.dragstart.bind( this );
    this.onDragmove = this.dragmove.bind( this );
    this.onDragend = this.dragend.bind( this );
    this.onResize = this.refresh.bind( this );

  }

  init() {

    this.$( window ).on( 'resize' );

    this.$( this.slider ).on( 'touchstart mousedown' );
    this.resize = [ this.slider.clientWidth ];
    this.position = [ this.options.startPosition, 0 ];
    this.handle.style.left = `${this.options.startPosition}px`;
    this.slider.style.left = `${this.rangeLimitMin * 2}px`;
    this.slider.style.right = `${this.rangeLimitMin * 2}px`;
    this.position.cache = [ this.options.startPosition, this.options.startPosition ];

    const pos = _pixel( this.options.startPosition, this.rangeLimitMin, this.rangeLimitMax );
    this.setPosition( pos );

    this.callback( 'onInitialized' );

  }

  update() {

    this.rangeLimitMax = this.bar.clientWidth + this.rangeLimitMin;

  }

  $( elem ) {

    this.$.elem = null;
    this.$.elem = elem;
    return this;

  }

  on( event ) {

    this.listener( event, 'add' );
    return this;

  }

  off( event ) {

    this.listener( event, 'remove' );
    return this;

  }

  listener( eventTypes, actionType ) {

    const handlers = {
      resize    : [ this.onResize, false ],
      touchstart: [ this.onDragstart, false ],
      mousedown : [ this.onDragstart, false ],
      touchmove : [ this.onDragmove, false ],
      mousemove : [ this.onDragmove, false ],
      touchend  : [ this.onDragend, false ],
      mouseup   : [ this.onDragend, false ]
    };
    const wrap = ( action, eventName, handler ) => {

      const args = [
        ...[
          eventName, handler[ 0 ],
          ...handler.slice( 1 )
        ]
      ];

      if ( !this.listener.cache ) this.listener.cache = {};
      if ( action === 'add' ) this.listener.cache[ eventName ] = args;
      if ( this.listener.cache[ eventName ] ) this.$.elem[ `${action}EventListener` ]( ...this.listener.cache[ eventName ] );
      if ( action === 'remove' ) delete this.listener.cache[ eventName ];

    };

    eventTypes.split( ' ' ).forEach( ( key ) => wrap( actionType, key, handlers[ key ] ) );

  }

  dragstart( e ) {

    this.$( document ).on( 'touchmove touchend mousemove mouseup' );
    const posX = _getTouchY( e );
    const rectLeft = this.slider.getBoundingClientRect().left;
    const skipX = this.setPosition( posX - this.handleDimension - rectLeft );

    this.dragstart.posX = posX - skipX;

    this.callback( 'onDrag' );

  }

  dragmove( e ) {

    e.preventDefault();

    const posX = _getTouchY( e );
    const pos = this.dragmove.posX = posX - this.dragstart.posX;
    this.setPosition( pos );

    this.callback( 'onDragging' );

  }

  dragend() {

    const posX = this.position[ 0 ];
    const pct = _percent( posX, this.rangeLimitMax );
    this.position.cache[ 1 ] = pct;

    this.callback( 'onDragged' );
    this.$( document ).off( 'touchmove touchend mousemove mouseup' );

  }

  refresh() {

    this.update();

    const pos = _pixel( this.position.cache[ 1 ], this.rangeLimitMin, this.rangeLimitMax );
    this.setPosition( pos );

    this.callback( 'onRefreshed' );

  }

  setPosition( pos ) {

    pos = this.posBaranser( pos );

    this.handle.style.left = `${pos}px`;
    // Is changed
    if ( pos !== this.position.cache[ 0 ] ) {

      this.callback( 'onChanged' );

    }

    return ( this.position.cache[ 0 ] = pos );

  }

  posBaranser( pos ) {

    const [ min, max ] = [ this.rangeLimitMin, this.rangeLimitMax ];
    const dim = this.options.scaleDimension;
    const acceptable = dim / 2;

    if ( pos < min ) pos = min;
    if ( pos > max ) pos = max;

    const pct = _percent( pos + Math.abs( min ), max + Math.abs( min ) );
    const scale = this.position[ 1 ] = ( Math.floor( ( pct + acceptable ) / dim ) * dim );

    return ( this.position[ 0 ] = _pixel( scale, min, max ) );

  }

  callback( name ) {

    if ( typeof this.options[ name ] === 'function' ) {

      this.options[ name ].call( this, ...this.position );

    }

  }

}

export default RangeSlider;
window.RangeSlider = RangeSlider;
