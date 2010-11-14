/**
 * Module dependencies.
 */
 
var mongoose = require('./vendor/mongoose/lib/mongoose'), 
	document = mongoose.define;
 
var db = mongoose.connect('mongodb://localhost/mongoose');

var express = require('express'),
    sys = require('sys');

var app = module.exports = express.createServer(
		express.logger(),
	    express.cookieDecoder(),
	    express.session()
    );


// Configuration

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function () {
  app.use(express.errorHandler()); 
});

// Errors

function NotFound(path){
  	this.name = 'NotFound';
  	if (path) {
      	Error.call(this, 'Cannot find ' + path);
    	this.path = path;
  	} else {
    	Error.call(this, 'Not Found');
  	}
	Error.captureStackTrace(this, arguments.callee);
}
sys.inherits(NotFound, Error);
function NotLoggedIn(page){
    this.name = 'NotLoggedIn';
    Error.call(this, 'Not logged in (' + msg + ')');
    Error.captureStackTrace(this, arguments.callee);
}
sys.inherits(NotLoggedIn, Error);
function IncorrectAccessLevel(user, page){
    this.name = 'IncorrectAccessLevel';
    Error.call(this, 'Access level incorrect for: ' + page + ' (' + user + ')');
    Error.captureStackTrace(this, arguments.callee);
}
sys.inherits(IncorrectAccessLevel, Error);
function IncorrectPassword(msg){
    this.name = 'IncorrectPassword';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}
sys.inherits(IncorrectPassword, Error);

app.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', {
            status: 404,
            locals: {
                error: err
            }
        });
        
    } else if (err instanceof NotLoggedIn) {
    
    } else if (err instanceof IncorrectAccessLevel) {
    
    } else if (err instanceof IncorrectPassword) {
    
    } else {
        next(err);
    }
});

// User Auth
var User = {
	Login : function (req) {
		req.session.user = {};
		req.session.user.loggedIn = true;
	},
	Logout : function (req) {
		req.session.user.loggedIn = false;
		req.session.user = {};
	},
	IsLoggedIn : function (req) {
		return req.session.user && req.session.user.loggedIn === true;
	}
}

// Routes

/* URLs
 * / 
 * /i/ -> images
 * /l/ -> listing
 * /u/ -> user
 * /a/ -> admin
 * /e/ -> error
 */

app.get('/', function(req, res) {

	console.log('User is logged in: ' + (User.IsLoggedIn(req) ? 'true' : 'false'));
	
	if (User.IsLoggedIn(req)) {
	
		res.redirect('/l/all');
		
	} else {
	
		res.redirect('/u/login');
		
	}    
	
});


/*
 * /l/ is for Listing
 */
 
app.get('/l/all', function (req, res) {
	
	if (!User.IsLoggedIn(req)) {
		res.redirect('/u/login');
	} 	
	res.render('image-list', {
	  locals: {
	    title: 'All',
	    images: []
	  }
	});	
	/*
	
	Img.find({ userid: self.session.user._id  }).sort('uploaded', 'desc').each(function(img) {
	
		this.partial(img);
		
	}).then(function(imgs){
		self.render('list.jade', {
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
	*/

			
});
 
 /*
  * /u/ is for User
  */
app.post('/u/create', function () {      
	var self = this,
		user = self.params.post.username,
		email = self.params.post.email,
		pass = self.params.post.password;		
			
	Usr.find({ username : user }).one(function(usr) {
		return false
    }, true);
	
	Usr.find({ email : email }).one(function(usr) {
		return false
    }, true);	
	
	// create a new db entry
	var usr = new Usr({
		username : user,
		password : pass,
		email : email,
		joined : new Date(),
		lastlogin : new Date(),
		role : 'NORMAL'
	});
	// save it
	usr.save();

	return true;
});

app.post('/u/login', function (req, res) {     	  
	  
	if (!req.body || !req.body.user || !req.body.user.name || !req.body.user.password) {
	
		console.log('HAXX');
		res.redirect('back');
		
	} else {
	    
		var user = req.body.user.name,
		pass = req.body.user.password;
		
		if (typeof user !== 'undefined' && typeof pass !== 'undefined') {	
			
			console.log('logging in: ' + user);
			
			// check if user is in db... 
			
			// set session cookie
			User.Login(req);
			// 
			res.redirect('/');
			/*
			Usr.find({
				username: user,
				password: pass
			}).one(function(usr) {
	
				usr.lastlogin = new Date();
				usr.save();
				
				self.session.isAuthd = true;
				self.session.user = usr;
				self.redirect(self.session.redirectPage);
		
			}, true); */
			
		} 
		return false;
	
	}
});

app.get('/u/login', function (req, res) {    	      	
	res.render('login', {
	  locals: {
	    title: 'Login'
	  }
	});	
});

app.get('/u/logout', function () {
	
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
