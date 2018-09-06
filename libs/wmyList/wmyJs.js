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

	return WmyJs;
})()