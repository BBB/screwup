(jQuery)(function($){ 
	var screwUp = (function () {	
		return {
			init : function (callback) {
				callback = callback || function(){};
				$('html').removeClass('no-js').addClass('has-js');
				
				$('#sidebar').css({'margin-top' : -($('#nav').height() + 40)/2 });
				
				log('SCREWUP init');
				
				$('#images img').imagesLoaded(this.imageShuffle.init)
											
				callback();		
			}		
		}		
	})();
		
	screwUp.imageShuffle = (function () {
		var $images,
			$container = $('div#content #images');

		var config = {
			baseLeft : 70,
			mxrowwidth : 1000,
			margin : 12,
			debug : true
		}
		
		var process = function (selector) {
			$images = $(selector),
				rowwidth = 0,
				futurerowwidth = 0,
				row = 0,
				col = 0,
				images = [['']];
				
			
		   	for (var i = 0; i < $images.length; i++) {
				var $this = $($images[i]),
					w = parseInt($this.width(), 10),
					h = parseInt($this.height(), 10);
					
				futurerowwidth = rowwidth + w + config.margin;
				
				if (futurerowwidth >= config.mxrowwidth) {
					// New row please
					rowwidth = 0;
					futurerowwidth = 0;
					row++;	
					i--;			
					col = 0;
					images[row] = [];
				} else {			
					$this.css({ 'width': w, 'height': h });
					images[row][col] = $this;
					rowwidth = futurerowwidth;
					col++;
				}	
			}
			
			return images;
			
		}
		
		var layout = function (images, speed) {
			var left = 0,
				top = 0,
				highest = 0;
				
			for (var r = 0; r < images.length; r++) {
				
				left = config.baseLeft;
				top += highest + config.margin;
				
				for (var c = 0; c < images[r].length; c++) {
					var $img = images[r][c],
						w = parseInt($img.css('width').replace(/px/, ''), 10),
						h = parseInt($img.css('height').replace(/px/, ''), 10),
						css = { 'position': 'absolute', 'top': top, 'left': left };
						
					highest = (h > highest ? h : highest)
					
					$img.animate(css, speed);
					
					left += w + config.margin;
					
				}
				
			}
			
		};
		
		var evts = {
			deleteImage : function (e) {
				e.preventDefault();
				var $this = $(this);
				if (config.debug) { 
					var $parent = $this.closest('.image');
					$parent.closest('.image').fadeOut(200, function () {
						$(this).remove();
						var images = process('div#images div.image');
						layout(images, true);						
					});
				} else {
					$.ajax({
					  	type: 'POST',
					  	url: $this.attr('href'),
					  	data: null,
					  	success: function (data) {
							var $parent = $this.closest('.image');
							$parent.closest('.image').fadeOut(200, function () {
								$(this).remove();
								var images = process('div#images div.image');
								layout(images, true);						
							});
						},
						error: function (err) {
							log(err);
							// throw this upto the user
						}
					});
				}
			},
			addImage : function (e) {
				var $img = $('<div class="image" style="width: 194px; height: 150px; position: absolute; top: -300px; left: -300px;">' +
					'<div class="wrapper" rel="825,638" style="background: rgb(30, 30, 30) url(/i/h1xLQ/s/) no-repeat scroll 0pt 0pt; width: 194px; height: 150px;">' +
						'<a class="delete" title="Delete Image" href="/i/delete/wyTk4">' +
							'<img title="Delete Image" src="/public/img/delete.png">' +
						'</a>' +
						'<a class="zoom" title="Uploaded on Fri Jun 11 2010 10:20:29 GMT+0100 (BST)" href="/i/wyTk4/o/">' +
							'<img title="View Image" src="/public/img/zoom.png">' +
						'</a>' +
						'<a class="link" title="Copy Link" href="#">' +
							'<img title="Copy Link" src="/public/img/link.png">' +
						'</a>' +
					'</div>' +
					'<div class="footer" style="top: 150px;">' +
						'<span>1 views</span>' +
					'</div>' +
				'</div>');
				
				var rand = Math.round(Math.random() * $('div#images .image').length-1);
				$('div#images .image:eq(' + rand + ')').after($img);				
				var images = process('div#images div.image');
				layout(images, true);
			}
		}
		return {
			init : function (callback) {
				callback = callback || function(){};
				var self = this;
				
				config.mxrowwidth = $(window).width() - 80;
									
				var $add = $('<a href="#" id="add">add</a>').appendTo('#nav');
				$('#nav #add').live('click',evts.addImage);
				$('a.delete', $images).live('click',evts.deleteImage);
				
				$(window).bind("smartresize", function (e) {
				    config.mxrowwidth = $(window).width() - 80;
					var images = process('div#images div.image');	
					layout(images, 500);
				});
				
				$(window).trigger("smartresize", ["execAsap"]);
				
				callback();
			}
		}
	})();
	
	// init the app
	screwUp.init(function () {
		log('all loaded');
	});
});