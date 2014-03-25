/**
 *
 * jQuery.tiltToReveal - https://github.com/martinkr/jQuery.tiltToReveal
 *
 * Tilt your device to reveal more content.
 * e.g.: images in facebook's paper app.
 *
 * @Version: 1.0.1
 *
 *
 * Copyright (c) 2014 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (martinkr.github.io)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @requires
 * 	jQuery JavaScript Library - http://jquery.com/
 * 		Copyright 2010, John Resig
 * 		Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 *
 * @example
 * jQuery(document).ready(function () {
 * 		jQuery('.fx--tiltToReveal').tiltToReveal({});
 * 	});
 *
 */

/* jshint browser:true, jquery:true, strict: false, smarttabs:true, onevar:true, undef:true, unused:true, curly:true, latedef: true, sub:true */
/* global jQuery:true, -$:true */


/**
 * Setup requestAnimationFrame
 */
if(!window.requestAnimFrame=) {
	window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};})();
}

/**
 * Plugin
 */
;(function($) {

	'use strict';

	// main loops
	$.fn.tiltToReveal = function(oOptions_) {

		// build main oOptions_ before element iteration

		$.fn.tiltToReveal.options = $.extend({}, $.fn.tiltToReveal.defaults, oOptions_);

		// add deviceorientation event
		_addEvents();

		$.fn.tiltToReveal.requestTick();

		// handle all html elements
		return this.each(function() {
			var _$element = jQuery(this);
			$.fn.tiltToReveal.elements.push(_$element);
		});
	};

	//
	// private function for debugging
	//
	/**
	 * Add events
	 * @private
	 * @return {Void}
	 */
	function _addEvents() {
		window.addEventListener('deviceorientation',$.fn.tiltToReveal.onEvent,false);
		// jQuery(window).on('deviceorientation', $.fn.tiltToReveal.requestTick);
	}

	/**
	 * Request animation frame tick.
	 * Pushes the update function to the raf stack if there's none already stacked.
	 * @private
	 * @return {Void}
	 */
	function _requestTick() {
		if(!$.fn.tiltToReveal._rafTick) {
			window.requestAnimFrame($.fn.tiltToReveal.update);
			$.fn.tiltToReveal._rafTick = true;
		}
	}

	/**
	 * Basic function to set the properties for the css-based animation
	 * @param {Object}	oProp_ Animation properties: transition, transform
	 * @return {Void}
	 */
	function _setCss (oProp_) {
		var _$elements = $.fn.tiltToReveal.elements,
			_i,
			_iLength = _$elements.length,
			_element
		;

		for (_i=0; _i < _iLength; _i++) {
			_element = _$elements[_i].get(0);
			_element.style.webkitTransform = oProp_.transform;
			_element.style.MozTransform = oProp_.transform;
			_element.style.msTransform = oProp_.transform;
			_element.style.transform =  oProp_.transform;
			_element.style.webkitTransition = oProp_.transition;
			_element.style.MozTransition = oProp_.transition;
			_element.style.msTransition = oProp_.transition;
			_element.style.transition =  oProp_.transition;
		}

	}

	/**
	 * Update the css
	 * @param {Event}	event_
	 * @return {Void}
	 */
	function _update ( ) {

		var
			// local calculations
			_iLRNow = 0,
			_iFBNow = 0,
			_iPercentLR = 0,
			_iPercentFB = 0,
			_iValueLR = 0,
			_iValueFB = 0,

			_sTransformNow,
			_sTransformLast =  $.fn.tiltToReveal._sTransformLast,

			// options
			_iDistanceLR = $.fn.tiltToReveal.options.leftright.distance,
			_iDistanceFB = $.fn.tiltToReveal.options.frontback.distance,
			_iMaxAngleLR = $.fn.tiltToReveal.options.leftright.maxAngle,
			_iMaxAngleFB = $.fn.tiltToReveal.options.frontback.maxAngle,
			_iTresholdLR = $.fn.tiltToReveal.options.leftright.treshold,
			_iTresholdFB = $.fn.tiltToReveal.options.frontback.treshold,

			_iAnimationDuration = $.fn.tiltToReveal.options.animation.duration,
			_sAnimationEasing = $.fn.tiltToReveal.options.animation.easing,

			// calculate the medians
			_eventBeta = $.fn.tiltToReveal.event.betas.reduce(function(a, b){ return a + b; }) / $.fn.tiltToReveal.event.betas.length,
			_eventGamma = $.fn.tiltToReveal.event.gammas.reduce(function(a, b){ return a + b; }) / $.fn.tiltToReveal.event.betas.length,

			// normalize window.orientation
			_iOrientation = (!window.orientation) ? 0 : window.orientation
		;

		// adapt the values according to the orientation
		switch (_iOrientation) {

			case 0:
				_iLRNow = parseInt(_eventGamma);
				_iFBNow = parseInt(_eventBeta);
			break;

			case 180:
				_iLRNow = -1*parseInt(_eventGamma);
				_iFBNow = -1*parseInt(_eventBeta);
			break;

			case 90:
				_iLRNow = parseInt(_eventBeta);
				_iFBNow = parseInt(_eventGamma);
			break;

			case -90:
				_iLRNow = -1*parseInt(_eventBeta);
				_iFBNow = -1*parseInt(_eventGamma);
			break;

		}

		// use treshold and animate the elements with the whole distance if the tilt angle is bigger
		if ($.fn.tiltToReveal.options.useTreshold) { 

			if(_iLRNow < -1*_iTresholdLR ) {
				_iValueLR = -1 * _iDistanceLR;
			}

			if(_iLRNow > _iTresholdLR) {
				_iValueLR = 1 * _iDistanceLR;
			}

			if(_iFBNow < -1*_iTresholdFB ) {
				_iValueFB = -1 * _iDistanceFB;
			}

			if(_iFBNow > _iTresholdFB) {
				_iValueFB = 1 * _iDistanceFB;
			}

		}
		// or calculate the percentage and move the elements by this percentage of the total distance
		else {


			_iPercentLR = Math.min(Math.abs(_iLRNow) / (_iMaxAngleLR) ,1);
			_iPercentFB = Math.min(Math.abs(_iFBNow) / (_iMaxAngleFB) ,1);


			if(_iLRNow < 0 ) {
				_iValueLR =  -1* Math.abs(_iDistanceLR * _iPercentLR);
			}
			if(_iLRNow > 0) {
				_iValueLR = Math.abs(_iDistanceLR * _iPercentLR);
			}

			if(_iFBNow < 0 ) {
				_iValueFB =  -1* Math.abs(_iDistanceFB * _iPercentFB);
			}
			if(_iFBNow > 0) {
				_iValueFB = Math.abs(_iDistanceFB * _iPercentFB);
			}

		}

		// cerate transformation values
		_sTransformNow = ["translate3d(",_iValueLR,"px",", ",_iValueFB,"px",", ","0","px)"].join('');

		// change
		if(_sTransformNow !== _sTransformLast ) {
			$.fn.tiltToReveal._sTransformLast = _sTransformNow;
			_setCss({'transform':_sTransformNow,'transition': ["all"," ",_iAnimationDuration,"ms"," ",_sAnimationEasing].join('') });
		}

		// allow further rAFs to be called
		$.fn.tiltToReveal._rafTick = false;

	}

	/**
	 * API: eventhandler
	 * @param  {Event_} event_
	 * @return {Void}
	 */
	$.fn.tiltToReveal.onEvent = function(event_) {

		// keep the last ten events properties to calculate the median
		if($.fn.tiltToReveal.event.gammas.length >= 10) {
			$.fn.tiltToReveal.event.gammas.shift();
			$.fn.tiltToReveal.event.betas.shift();
		}

		$.fn.tiltToReveal.event.gammas.push(event_.gamma);
		$.fn.tiltToReveal.event.betas.push(event_.beta);

		// request animation frame
		$.fn.tiltToReveal.requestTick();
 	};

	/**
	 * API: RAF tick
	 * @return {Void}
	 */
	$.fn.tiltToReveal.requestTick = _requestTick;

	/**
	 * API: Update effect
	 * @return {Void}
	 */
	$.fn.tiltToReveal.update = _update;

	/**
	 * API: get all elements
	 * @return {Array}
	 */
	$.fn.tiltToReveal.getElements = function() {
		return $.fn.tiltToReveal.elements;
	};


	// store internal values
	$.fn.tiltToReveal._sTransformLast = '';
	$.fn.tiltToReveal._rafTick = false;

	$.fn.tiltToReveal.options = {} ;
	$.fn.tiltToReveal.elements = [];
	$.fn.tiltToReveal.event = { gammas: [0], betas:[0] };

	// plugin defaults
	$.fn.tiltToReveal.defaults = {
		useTreshold: false,
		leftright: {
			distance: 750,
			treshold: 10,
			maxAngle: 10
		},
		frontback: {
			distance: 0,
			treshold: 10,
			maxAngle: 10
		},
		animation : {
			duration: 1000,
			easing: 'linear'
		}
	};

})(jQuery);

