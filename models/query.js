Query = function(q) {
	require('sys').puts('parsing: ' + q);
	if(q.length > 1) {
		this.q = q.substring(1, q.length);
	} else {
		this.q = null;
	} 
	this.keyValuePairs = new Array();
	if(q) {
		for(var i=0; i < this.q.split("&").length; i++) {
			this.keyValuePairs[i] = this.q.split("&")[i];
		}
	}
};
Query.prototype.getValue = function(s) {
	for(var j=0; j < this.keyValuePairs.length; j++) {
		if(this.keyValuePairs[j].split("=")[0] == s) {
			return this.keyValuePairs[j].split("=")[1];
		}
	}
	return false;
};
Query.prototype.randomString = function(string_length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	document.randform.randomfield.value = randomstring;
}

exports.Query = Query;

