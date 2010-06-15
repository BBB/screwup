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