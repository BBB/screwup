exports.app = {
	debugmode : true
}
exports.admin = {
	user: 'usr',
	pass: 'pss'
}
exports.url = {
	base: 'http://localhost:3000/',
	routes: {
		image: 'i/'
	}
}
exports.url.keys = {
	passcode: 'p',
	referrer: 'r'
}	
exports.images = {
	sizes: {
		small: 's',
		original: 'o'
	},
	basePath : './public/uploads/img/',
	sizeSeparator : '_',
	linkLength : 5 // Greater than 1
}