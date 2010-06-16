require.paths.unshift('./lib/express/lib');
require.paths.unshift('./lib/mongoose');
require.paths.unshift('./lib/imagemagick');
require.paths.unshift('./lib');

require('express');
require('express/plugins');

var sys = require('sys'),
	querystring = require('./lib/query'),
	imagemanager = require('imagemanager'),
	fs = require('fs'),
	ut = require('./lib/utils')
	multipart = require('multipart'),
	config = require('./config/config');

var inspect = function(item){ sys.puts(sys.inspect(item)); }
	
var Mongoose = require('mongoose').Mongoose;
Mongoose.load(__dirname + '/models/image.js');
db = Mongoose.connect('mongodb://localhost/images');   	
Img = db.static('Image');
//Img.drop();
	

configure(function () {	
	use(MethodOverride)
	use(ContentLength)
	use(Cookie)
	use(Session, { expires: (12).hours , reapInterval: (2).minutes })
	use(Flash)
	use(Static)
	use(Logger)
	set('root', __dirname);
  	set('max upload size', (5).megabytes);
});

/* URLs
 * / 
 * /i/ -> images
 * /l/ -> listing
 * /u/ -> user
 * /g/ -> groups
 * /e/ -> error
 */

// Wildcards
get('/css/*', function(file) {	
	sys.puts('proxying: ' + './public/css/' + file);
	this.sendfile('./public/css/' + file);
});
get('/js/*', function(file) {	
	sys.puts('proxying: ' + './public/js/' + file);
	this.sendfile('./public/js/' +  file);
});
get('/img/*', function(file) {	
	sys.puts('proxying: ' + './public/img/' + file);
	this.sendfile('./public/img/' +  file);
});



// App Routing

get('/', function (data) {
	sys.puts(data);
	//this.redirect('/l/all')
});
/*
 * /i/ is for Image
*/
post('/i/upload', function () {
	var self = this,
		query,
		passcode = '';
		
	if (typeof this.url.search !== 'undefined') {
		query = new Query(this.url.search);
		passcode = query.getValue(config.url.keys.passcode);
	}
	
	// Assumes that all uploads will be .png
	var randomstring = ut.randomstring(40);
	var originalName = randomstring + config.images.sizeSeparator + config.images.sizes.original + '.png';
	var smallName = randomstring + config.images.sizeSeparator + config.images.sizes.small + '.png';
	
	var writeStream = fs.createWriteStream(config.images.basePath + originalName);	
	writeStream.write(self.body, encoding='binary');
	writeStream.end();
		
	var link = ut.randomstring(config.images.linkLength);
		
	// TODO: check link is unique
	//Img.find({ linkid : link }).one(function(img) {}, true);	
		
	var imageDetails = { 
		linkid: link, 
		sizes : {
			o : {
				width : 0,
				height : 0,
				name : originalName,
				views : 0
			},
			s : {
				width : 0,
				height : 0,
				name : smallName,
				views : 0
			}
		},
		uploaded: new Date(), 
		passcode: passcode 
	};
	
	// Create a thumbnail
	im.resize({
		srcPath: config.images.basePath + imageDetails.sizes.o.name,
		dstPath: config.images.basePath + imageDetails.sizes.s.name,
		width: config.images.small.w,
		height: config.images.small.h,
		format: '.png'
	}, function(err, stdout, stderr) {			
	 	if (err) { throw err } 		
		
		// Read Metadata for Original Image		
		im.identify(config.images.basePath + imageDetails.sizes.o.name, function(err, features) {
		  	if (err) throw err
						
			imageDetails.sizes.o.width = features.width;
			imageDetails.sizes.o.height = features.height;
					
			// Read Metadata for Small Image		
			im.identify(config.images.basePath + imageDetails.sizes.s.name, function(err, features) {
			  	if (err) throw err

				imageDetails.sizes.s.width = features.width;
				imageDetails.sizes.s.height = features.height;
				
				// create a new db entry
				var img = new Img(imageDetails);
				// save it
				img.save();
				
				self.response.writeHead(201);
				self.response.write(config.url.base + config.url.routes.image + link + '/' + config.images.sizes.original);
				self.response.end();
				
			});						
		});	
	});	
});

var fetchImage = function (id, size, pass) {
	/* 
	MATCHES:
	 * /i/link/size/
	 * /i/link/size/pass
	*/
			
	var self = this;
	
	Img.find({ linkid : id }).one(function(img) {
		
		if (img.passcode === '' || (img.passcode === pass)) {
					
			img.sizes[size].views++;			
			img.save();		
	
			self.sendfile(config.images.basePath +  img.sizes[size].name);	
		
		} else {	
				
			self.redirect('/');
		
		}
	
	}, true);
}

get('/i/:id/:size/:pass', fetchImage);
get('/i/:id/:size/', fetchImage);

get('/i/upload', function () {
	var self = this;
	
	if (!self.session.isAuthd) {
		self.redirect('/u/login?' + config.url.keys.referrer + '=/l/public');
	}

	self.render('upload.html.haml', {
	    locals: {
	      	title: 'Upload',
			debugmode: config.app.debugmode,
			currentpath: self.url.pathname,
			isAuthd: self.session.isAuthd
	    }
	});
});

post('/i/delete/:id', function (id) {
	var self = this;
			
	if (!self.session.isAuthd) {
		this.redirect('/u/login?' + config.url.keys.referrer + '=/l/all');
	}
	
	sys.puts('deleting: ' + id)
	
	Img.find({ linkid : id }).one(function(img) {
								
			img.remove(function () {			
				self.response.writeHead(200);
				self.response.write('All good');
				self.response.end();
			});		
		
    }, true);

	// nothing to delete
	//self.response.writeHead(400);
	//self.response.write('Image not found');
	//self.response.end();
});

/*
 * /u/ is for User
*/
post('/u/login', function(){      
	var self = this,
		query = '',
		referrer = '/l/all',
		user = self.params.post.username,
		pass = self.params.post.password;
		
	if (typeof user !== 'undefined' && typeof pass !== 'undefined') {
		
		if (user == config.admin.user && pass == config.admin.pass) {
			if (typeof this.url.search !== 'undefined') {
				query = new Query(this.url.search);
				referrer = query.getValue(config.url.keys.referrer);
			}
			self.session.isAuthd = true;
				
			self.redirect(referrer);         
		}
	} 
	return false;
});

get('/u/login', function () {    
	       
   	var self = this;
	
	self.render('login.html.haml', {
		layout: false,
	    locals: {
	      	title: 'Login',
			debugmode: config.app.debugmode,
			currentpath: self.url.pathname,
			isAuthd: self.session.isAuthd
	    }
	});
	
});

get('/u/logout', function () {

	this.session.isAuthd = false;	
	this.redirect('/');
	
});

/*
 * /l/ is for List
*/

get('/l/all', function () {
	var self = this;
	
	if (!self.session.isAuthd) {
		this.redirect('/u/login?' + config.url.keys.referrer + '=/l/all');
	}
	
		Img.find({}).sort('uploaded', 'desc').each(function(img) {

			if (self.session.isAuthd) {
				this.partial(img);
			} else if (img.passcode === null || typeof img.passcode === 'undefined' || img.passcode.length <= 0) {
		 		this.partial(img);
			}
	
		}).then(function(imgs){
		
			self.render('list.html.haml', {
			    locals: {
			      	title: 'List: All Images',
					isAuthd: self.session.isAuthd,
					debugmode: config.app.debugmode,
					currentpath: self.url.pathname,
					images: imgs,
					basepath:  config.images.basePath
			    }
			});
		
		});	
			
});

get('/l/public', function(){           
	var self = this;
	
	
	if (!self.session.isAuthd) {
		this.redirect('/u/login?' + config.url.keys.referrer + '=/l/public');
	}
	
	Img.find({}).each(function(img) {
	
		if ((img.passcode.length <= 0)) {
	 		this.partial(img);
		}

	}).then(function(imgs){
	
		self.render('list.html.haml', {
		    locals: {
		      	title: 'List: Public Images',
				isAuthd: self.session.isAuthd,
				debugmode: config.app.debugmode,
				currentpath: self.url.pathname,
				images: imgs,
				basepath:  config.images.basePath
		    }
		});
	
	});	
});

get('/l/private', function(){   
	        
   	var self = this;
	
	
	if (!self.session.isAuthd) {
		this.redirect('/u/login?' + config.url.keys.referrer + '=/l/private');
	}
	
	Img.find({}).each(function(img) {
	
		if (img.passcode.length > 0) {
	 		this.partial(img);
		}

	}).then(function(imgs){
	
		self.render('list.html.haml', {
		    locals: {
		      	title: 'List: Private Images',
				isAuthd: self.session.isAuthd,
				debugmode: config.app.debugmode,
				currentpath: self.url.pathname,
				images: imgs,
				basepath:  config.images.basePath
		    }
		});
	
	});		
	                      
});


get('/g/:id', function (id) {
});
get('/e/:code', function (code) {
	// error
	
});

	

run();
