var WmyJs=(function(){
	function WmyJs(){}
	WmyJs.escape=function(str){
		var newStr=escape(str);
		return newStr;
	}
	WmyJs.unescape=function(str){
		var newStr=unescape(str);
		return newStr;
	}
	WmyJs.loadLib=function(url) {
		var script = document.createElement("script");
		script.async = false;
		script.src = url;
		document.body.appendChild(script);
	}
	WmyJs.documentWrite=function(txt) {
		document.write(txt);
	}
	return WmyJs;
})()