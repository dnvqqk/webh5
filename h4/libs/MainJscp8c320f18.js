var MainJs=function(){function n(){try{n.d=document,n.html=n.d.body.children[0]}catch(n){}var l=new laya.net.Loader;l.load("version.json?"+Date.now(),"json"),l.on("complete",this,this.loadOk)}return n.JssArr=function(){var n=[];return n.push("libs/laya.webgl.min.js"),n.push("libs/laya.d3.min.js"),n.push("libs/laya.physics3D.js"),n.push("libs/laya.html.min.js"),n.push("libs/fairygui.min.js"),n.push("libs/TweenMax.min.js"),n.push("js/bundle.js"),n},n.data=null,n.prototype.loadOk=function(l){n.data=l,n.mainJs()},n.mainJs=function(){var l=[];n.JssArr().forEach(function(t){l.push(n.getUrl(t))});var t=l.length,a=0,s=function(){if(null!=n.html&&null!=n.html.innerText&&(n.html.innerText="正在加载启动程序...("+a+"/"+t+")"),a<t){var i=l[a];n.loadJs([i],s),a+=1}};s()},n.loadJs=function(l,t){l.length>0&&require(l,t,function(l){null!=n.html&&null!=n.html.innerText&&(n.html.innerText="正在加载启动程序...(网络不稳定,出现故障,请刷新页面...)^-^!")})},n.getUrl=function(l){var t=l;return null!=n.data[t]&&(t=n.data[t]),t},n}();new MainJs;