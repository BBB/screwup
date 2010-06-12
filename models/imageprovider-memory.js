var imageCounter = 1;

ImageProvider = function() {};
ImageProvider.prototype.dummyData = [];

ImageProvider.prototype.findAll = function(callback) {
  	callback( null, this.dummyData )
};

ImageProvider.prototype.findById = function(id, callback) {
  	var result = null;
  	for (var i =0; i < this.dummyData.length; i++) {
    	if ( this.dummyData[i]._id == id ) {
      		result = this.dummyData[i];
      		break;
    	}
  	}
  	callback(null, result);
};


ImageProvider.prototype.save = function(images, callback) {
  	var image = null;

  	if (typeof(image) === "undefined") {
    	images = [images];
	}

  	for( var i = 0; i < images.length; i++) {
    	image = images[i];
    	image._id = imageCounter++;
    	image.created_at = new Date();

    if (image.comments === undefined ) {
      	image.comments = [];
	}

    for (var j = 0; j < image.comments.length; j++) {
      article.image[j].created_at = new Date();
    }
    this.dummyData[this.dummyData.length]= image;
  }
  callback(null, images);
};

/* Lets bootstrap with dummy data */
new ImageProvider().save(
	[
		{ id: 1, uid: 'abc', title: 'Post one', alt: 'image alt one', width: '250', height: '250', src: '2d46fd643fdcc9876263-img.jpg' },
	  	{ id: 2, uid: '123', title: 'Post two', alt: 'image alt two', width: '250', height: '250', src: '2d46fd643fdcc9876263-img.jpg'},
	  	{ id: 3, uid: 'a2c', title: 'Post three', alt: 'image alt three', width: '250', height: '250', src: '2d46fd643fdcc9876263-img.jpg' }
	], 
	function(error, images){
	
	}
);

exports.ImageProvider = ImageProvider;