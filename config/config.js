exports.app = {
	debugmode : true
}
exports.admin = {
	user: 'usr',
	pass: 'pss'
}
exports.url = {
	baseUrl: 'http://localhost:3000/'
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