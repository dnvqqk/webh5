var Wmy_Load_Mag=function(){function a(){this._wetData={},this.resUrl="",this._resDataArr=[],this._callbackOk=[],this._callbackProgress=[]}return Object.defineProperty(a,"getThis",{get:function(){return null==a._this&&(a._this=new a),a._this},enumerable:!0,configurable:!0}),a.prototype.getWetData=function(a){return this._wetData[a]},a.prototype.setWetData=function(t,r){if(""==this.resUrl){this.resUrl=r;var s=null,o=null;try{s=JSON.parse(t)}catch(a){}try{var e=s[0].assetUrl;!a.isDebug&&document.URL.indexOf("file:///")>=0&&(e=""),a.assetUrl=e}catch(a){}try{o=s[0].V}catch(a){}try{a.jsV=s[0].jsV}catch(a){}null!=o&&(null==fairygui.UIPackage.wObj&&(fairygui.UIPackage.wObj={}),null==fairygui.UIPackage.wObj.V||""==fairygui.UIPackage.wObj.V?(a.V=o,fairygui.UIPackage.wObj.V=a.V):a.V=fairygui.UIPackage.wObj.V)}null==r&&(r=this.resUrl),this._wetData[r]=t},a.prototype.getResObj=function(a,t){var r;if(null==t&&(t=this.resUrl),null==(r=this.getWetData(t)))return console.log("空数据"),null;var s=null;if(r instanceof Array&&(s=r),null==s)try{s=JSON.parse(r)}catch(a){return console.log("加载材料数据错误",r),null}for(var o=null,e=0;e<s.length;e++){var l=s[e];if(l.resName==a){o=l;break}}return o},a.prototype.onLoadWetData=function(a,t){if(""!=a){if(null==this.getWetData(a)){return Laya.loader.load(a,new Laya.Handler(this,function(r){this.setWetData(r,a),t.runWith([this._wetData[a]])}))}t.runWith([this.getWetData(a)])}},a.prototype.onload=function(t,r,s){var o=t.resName;if(null!=this._resDataArr[o])this._resDataArr[o].runWith([this._resDataArr[o]]);else{if(null!=this._callbackOk[o])return this._callbackOk[o].push(r),void(null!=s&&this._callbackProgress[o].push(s));this._callbackOk[o]=[],this._callbackOk[o].push(r),this._callbackProgress[o]=[],null!=s&&this._callbackProgress[o].push(s);var e=t.Resres,l={},n=t.resData;if(null!=n&&""!=n)try{l=JSON.parse(n)}catch(a){console.log("加载材料数据错误",n)}for(var i,u=[],h=0;h<e.length;h++){var c=e[h].resUrl;c=WmyUtils.toCase(c);var d=a.assetUrl+c+a.V;c.indexOf(".txt")>=0?(u.push({url:d,type:Laya.Loader.BUFFER}),i=c.split(".")[0],i=a.assetUrl+i):c.indexOf(".jpg")>=0||c.indexOf(".png")>=0?u.push({url:d,type:Laya.Loader.IMAGE}):c.indexOf(".mp3")>=0?u.push({url:d,type:Laya.Loader.SOUND}):u.push({url:d})}Laya.loader.load(u,Laya.Handler.create(this,this.onAssetConmplete,[o,i,l]),Laya.Handler.create(this,this.onAssetProgress,[o],!1))}},a.prototype.onload3d=function(t,r,s){var o=t.resName;if(null!=this._resDataArr[o])this._resDataArr[o].runWith([this._resDataArr[o]]);else{if(null!=this._callbackOk[o])return this._callbackOk[o].push(r),void(null!=s&&this._callbackProgress[o].push(s));this._callbackOk[o]=[],this._callbackOk[o].push(r),this._callbackProgress[o]=[],null!=s&&this._callbackProgress[o].push(s);var e=t.Resres,l={},n=t.resData;if(null!=n&&""!=n)try{l=JSON.parse(n)}catch(a){console.log("加载材料数据错误",n)}for(var i=[],u=[],h=0;h<e.length;h++){var c=e[h].resUrl,d=a.assetUrl+c+a.V;c.indexOf(".ls")>=0&&(i.push({url:d}),u.push(d))}l.urlList=u,WmyLoad3d.getThis.onload3d(i,Laya.Handler.create(this,this.onAssetConmplete,[o,void 0,l]),Laya.Handler.create(this,this.onAssetProgress,[o],!1))}},a.prototype.onAssetProgress=function(a,t){for(var r=this._callbackProgress[a],s=0;s<r.length;s++){r[s].runWith([t])}},a.prototype.onAssetConmplete=function(t,r,s){var o=this._callbackOk[t];if(null!=r){var e=Laya.loader.getRes(r+".txt"+a.V);fairygui.UIPackage.addPackage(r,e);var l=r.split("/");s.bName=l[l.length-1],this._resDataArr[t]=s}for(var n=0;n<o.length;n++){o[n].runWith([s])}this._callbackOk[t]=null,this._callbackProgress[t]=null},a.prototype.onAutoLoadAll=function(a,t){var r=this.getWetData(this.resUrl);if(null==r)return console.log("空数据"),null;var s=null;if(r instanceof Array&&(s=r),null==s)try{s=JSON.parse(r)}catch(a){return console.log("加载材料数据错误",r),null}this._autoLoadrCallbackOk=a,this._autoLoadrCallbackProgress=t,this._autoLoadInfoArr={},this._autoLoadInfoArr.num=0,this._autoLoadInfoArr.cNum=0,this._autoLoadInfoArr.uiArr=[],this._autoLoadInfoArr.u3dArr=[];for(var o=0;o<s.length;o++){var e=s[o],l=e.resName,n=e.type;null!=l&&""!=l&&null!=n&&""!=n&&this.onAutoLoadObj(n,l)}},a.prototype.onAutoLoadObj=function(t,r){var s=this.getResObj(r);if(null!=s){var o=this._autoLoadInfoArr.num;if(this._autoLoadInfoArr[o]={},this._autoLoadInfoArr[o].n=r,this._autoLoadInfoArr[o].t=t,"ui"==t)this.onload(s,new Laya.Handler(this,this.onLoadOk,[o]),new Laya.Handler(this,this.onLoading,[o])),this._autoLoadInfoArr.num+=1;else if("mats"==t){for(var e=s.Resres,l=[],n=0;n<e.length;n++){var i=(h=e[n]).resUrl,u=a.assetUrl+i;l.push(u)}WmyLoadMats.getThis.onload3d(l,new Laya.Handler(this,this.onLoadOk,[o]),new Laya.Handler(this,this.onLoading,[o])),this._autoLoadInfoArr.num+=1}else if("cubeMap"==t)for(var e=s.Resres,n=0;n<e.length;n++){var h=e[n],i=h.resUrl,u=a.assetUrl+i+a.V;Laya.TextureCube.load(u,null)}else"u3d"==t&&(this.onload3d(s,new Laya.Handler(this,this.onLoadOk,[o]),new Laya.Handler(this,this.onLoading,[o])),this._autoLoadInfoArr.num+=1)}},a.prototype.getCube=function(t,r){var s=this.getResObj(t);if(null!=s){for(var o=s.Resres,e=[],l=0;l<o.length;l++){var n=o[l].resUrl,i=a.assetUrl+n+a.V;Laya.TextureCube.load(i,new Laya.Handler(this,function(a){e[l]=a,r.runWith([a,l])}))}return e}},a.prototype.onLoading=function(a,t){this._autoLoadInfoArr[a].p=t;for(var r=this._autoLoadInfoArr.num,s=0,o=0;o<r;o++){var e=this._autoLoadInfoArr[o].p;null!=e&&(s+=e)}var l=s/this._autoLoadInfoArr.num*100;isNaN(l)&&(l=0),null!=this._autoLoadrCallbackProgress&&this._autoLoadrCallbackProgress.runWith([l])},a.prototype.onLoadOk=function(a,t){this._autoLoadInfoArr.cNum+=1,"ui"==this._autoLoadInfoArr[a].t?this._autoLoadInfoArr.uiArr.push(t):"u3d"==this._autoLoadInfoArr[a].t&&this._autoLoadInfoArr.u3dArr.push(t),this._autoLoadInfoArr.cNum>=this._autoLoadInfoArr.num&&null!=this._autoLoadrCallbackOk&&this._autoLoadrCallbackOk.runWith([this._autoLoadInfoArr.uiArr,this._autoLoadInfoArr.u3dArr])},a.isDebug=!1,a.assetUrl="",a.V="",a.jsV="",a}();