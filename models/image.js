Mongoose.Model.define('Image',{
	collection : 'images',
	types: {
     	_id : Object, // if not defined, Mongoose automatically defines for you.
		linkid : String,
		sizes : {
			o : {
				width : Number,
				height : Number,
				name : String,
				views : Number
			},
			s : {
				width : Number,
				height : Number,
				name : String,
				views : Number
			}
		},
		uploaded: Date,
		passcode: String
  	},
	indexes : [
	  'linkid',
	  'uploaded'
	],
	static : {},
	methods : {},
	setters : {},
	getters : {}

 });