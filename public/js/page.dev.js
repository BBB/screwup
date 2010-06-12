(jQuery)(function($){ 
	var ScrewUp = (function () {	
	
		return {
			init : function (callback) {
				if (callback === undefined) callback = function () {};
				$('html').removeClass('no-js').addClass('has-js');
				
				$('#nav').css({'margin-top' : -($('#nav').height() + 40)/2 });
				
				log('SCREWUP init');
				
			    $('#images img:last').load(function () {
			   	 	/*$('#images').masonry({
					    columnWidth: 5, 
					    itemSelector: '.image' 
					});*/
				});
				//this.ImageViewer.init();
				
				callback();		
			}		
		}		
	})();
	
	ScrewUp.ImageViewer = (function () {
		var src, 
			w, 
			h,
			timer,
			$img = $('<img />'),
			$viewer = $('<div id="viewer"></div>'),
			$close = $('<a />'),
			imgLoaded = false;
			
		var config = {
			baseMargin : 210,
			
		}
		
		var OpenArea = function () {
			
			$viewer.attr('style', $viewer.attr('style') + ' margin-top: -' + h/2 + 'px;' + ' margin-left: -' + w/2 + 'px;');
			
			log($viewer)
			
			$img = $('<img />').load(function () {
				log('loaded');
				imgLoaded = true;
			}).attr('src',src).hide();
			
			$('#content').width($('#content').width()).animate({ 'marginLeft' : $(window).width() }, 1000, function () {
				log('animated');
				
				$close.show();
				timer = setTimeout(function () {
					if (imgLoaded) {
						ShowImage();
					}
				}, 500);
			});	
					
		};
		
		var ShowImage = function () {
			
			clearTimeout(timer);
			log('showing image');
			$img.appendTo($viewer.show()).fadeIn();
			
		};
		
		var Clear = function (callback) {
			if (callback === undefined) callback = function () {};
			$img.fadeOut(100, function () {
				$viewer.hide().html('');
				src = '';
				w = 0;
				h = 0;
				timer = null;
				$img = null;
				imgLoaded = false;
				callback();
			});
			
			
		}
		
		var evts = {
			imageClick : function (e) {
				e.preventDefault();
				
				var $t = $(this),
					rel = $t.attr('rel').split(','); 				
				
				Clear(function () {
					
					log('clicked')
					src = $t.attr('href');
					w = rel[0];
					h = rel[1]
					OpenArea();
					
				});
			},
			closeViewer : function (e) {
				e.preventDefault();
				
				$close.hide('img-active');
				$img.fadeOut(100, function () {
					$('#content').animate({ 'marginLeft' : config.baseMargin }, 1000, function () {
					});					
				})
				
			}
		}
		
		return {
			init : function (callback) {
				if (callback === undefined) callback = function () {};
				var self = this;
				
				$('body').addClass('img-active');
				
				// handle window resize				
				$viewer.hide();				
				$viewer.appendTo($('body'));
				
				$close.attr('id', 'close-viewer').text('Close Viewer').hide();
				$close.appendTo($('div#content'));
				$close.click(evts.closeViewer);
				
				$('#images div.image a').click(evts.imageClick);				
				
				callback();
			}
		}
	})();
	
	// init the app
	ScrewUp.init(function () {
		log('all loaded');
	});
});