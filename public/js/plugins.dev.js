(jQuery)(function($){ 
	/*!
	    * smartresize: debounced resize event for jQuery
	    * http://github.com/lrbabe/jquery-smartresize
	    *
	    * Copyright (c) 2009 Louis-Remi Babe
	    * Licensed under the GPL license.
	    * http://docs.jquery.com/License
	    *
	 */
	var event = $.event,
		resizeTimeout;

	event.special[ "smartresize" ] = {
		setup: function() {
			$( this ).bind( "resize", event.special.smartresize.handler );
		},
		teardown: function() {
			$( this ).unbind( "resize", event.special.smartresize.handler );
		},
		handler: function( event, execAsap ) {
			// Save the context
			var context = this,
				args = arguments;

			// set correct event type
	        event.type = "smartresize";

			if(resizeTimeout)
				clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {
				jQuery.event.handle.apply( context, args );
			}, execAsap === "execAsap"? 0 : 100);
		}
	};

	$.fn.smartresize = function( fn ) {
		return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
	};
	
	// $('img.photo',this).imagesLoaded(myFunction)
	// execute a callback when all images have loaded.
	// needed because .load() doesn't work on cached images

	// mit license. paul irish. 2010.
	// webkit fix from Oren Solomianik. thx!

	// callback function is passed the last image to load
	//   as an argument, and the collection as `this`


	$.fn.imagesLoaded = function (callback) {
		var elems = this.filter('img'),
		    len = elems.length;

		elems.bind('load',function () {
		    if (--len <= 0){ callback.call(elems,this); }
		}).each(function(){
		   // cached images don't fire load sometimes, so we reset src.
		   if (this.complete || this.complete === undefined){
		      var src = this.src;
		      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
		      // data uri bypasses webkit log warning (thx doug jones)
		      this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		      this.src = src;
		   }  
	  }); 

	  return this;
	};	
});
/*
 * Generic Helper functions
*/
window.log = function(){
	log.history = log.history || [];
  	log.history.push(arguments);
  	if(window.console){
    	try{
    		console.log.apply(window,Array.prototype.slice.call(arguments));
    	} catch(e){ console.log(arguments) }
  	}
  	return false;
};
(function($){ 
	$.fn.exists = function () {
		return this.length > 0;
	}
})(jQuery);