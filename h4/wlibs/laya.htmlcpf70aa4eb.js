!function(t,e,i){i.un,i.uns;var n=i.static,s=i.class,r=i.getset,h=(i.__newvec,laya.utils.Browser),l=laya.utils.ClassUtils,a=(laya.resource.Context,laya.events.Event,laya.display.Graphics,laya.utils.HTMLChar),o=laya.utils.Handler,u=laya.net.Loader,c=laya.utils.Pool,d=laya.maths.Rectangle,_=laya.display.Sprite,f=laya.display.Text,p=laya.resource.Texture,y=laya.net.URL,g=laya.utils.Utils;i.interface("laya.html.utils.ILayout");!function(){function t(){}s(t,"laya.html.dom.HTMLBrElement");var e=t.prototype;e._addToLayout=function(t){t.push(this)},e.reset=function(){return this},e.destroy=function(){c.recover(m.getClassName(this),this.reset())},e._setParent=function(t){},e._getCSSStyle=function(){return t.brStyle||((t.brStyle=new w).setLineElement(!0),t.brStyle.block=!0),t.brStyle},e.renderSelfToGraphic=function(t,e,i,n){},r(0,e,"URI",null,function(t){}),r(0,e,"parent",null,function(t){}),r(0,e,"href",null,function(t){}),t.brStyle=null}();var m=function(){function t(){this._creates(),this.reset()}s(t,"laya.html.dom.HTMLElement");var e=t.prototype;return e._creates=function(){this._style=w.create()},e.reset=function(){if(this.URI=null,this.parent=null,this._style.reset(),this._style.ower=this,this._style.valign="middle",this._text&&this._text.words){var e=this._text.words,i=0,n=0;n=e.length;var s;for(i=0;i<n;i++)(s=e[i])&&s.recover()}return this._text=t._EMPTYTEXT,this._children&&(this._children.length=0),this._x=this._y=this._width=this._height=0,this},e._getCSSStyle=function(){return this._style},e._addChildsToLayout=function(t){var e=this._getWords();if(null==e&&(!this._children||0==this._children.length))return!1;if(e)for(var i=0,n=e.length;i<n;i++)t.push(e[i]);return this._children&&this._children.forEach(function(e,i,n){var s=e._style;s._enableLayout&&s._enableLayout()&&e._addToLayout(t)}),!0},e._addToLayout=function(t){if(this._style){var e=this._style;e.absolute||(e.block?t.push(this):this._addChildsToLayout(t)&&(this.x=this.y=0))}},e.repaint=function(t){void 0===t&&(t=!1),this.parentRepaint(t)},e.parentRepaint=function(t){void 0===t&&(t=!1),this.parent&&this.parent.repaint(t)},e._setParent=function(t){if(t instanceof laya.html.dom.HTMLElement){var e=t;this.URI||(this.URI=e.URI),this.style&&this.style.inherit(e.style)}},e.appendChild=function(t){return this.addChild(t)},e.addChild=function(t){return t.parent&&t.parent.removeChild(t),this._children||(this._children=[]),this._children.push(t),t.parent=this,t._setParent(this),this.repaint(),t},e.removeChild=function(t){if(!this._children)return null;var e=0,i=0;for(i=this._children.length,e=0;e<i;e++)if(this._children[e]==t)return this._children.splice(e,1),t;return null},e.destroy=function(){this._children&&(this.destroyChildren(),this._children.length=0),c.recover(t.getClassName(this),this.reset())},e.destroyChildren=function(){if(this._children){for(var t=this._children.length-1;t>-1;t--)this._children[t].destroy();this._children.length=0}},e._getWords=function(){if(!this._text)return null;var t=this._text.text;if(!t||0===t.length)return null;var e=this._text.words;if(e&&e.length===t.length)return e;null===e&&(this._text.words=e=[]),e.length=t.length;for(var i,n=this.style,s=n.font,r=0,h=t.length;r<h;r++)i=g.measureText(t.charAt(r),s),e[r]=a.create().setData(t.charAt(r),i.width,i.height||n.fontSize,n);return e},e._isChar=function(){return!1},e._layoutLater=function(){var t=this.style;512&t._type||(t.widthed(this)&&(this._children&&this._children.length>0||null!=this._getWords())&&t.block?(T.later(this),t._type|=512):this.parent&&this.parent._layoutLater())},e._setAttributes=function(t,e){switch(t){case"style":this.style.cssText(e);break;case"class":this.className=e;break;case"x":this.x=parseFloat(e);break;case"y":this.y=parseFloat(e);break;case"width":this.width=parseFloat(e);break;case"height":this.height=parseFloat(e);break;default:this[t]=e}},e.formatURL=function(e){return this.URI?t.formatURL1(e,this.URI?this.URI.path:null):e},e.drawToGraphic=function(t,e,i,n){e+=this.x,i+=this.y;var s=this.style;s.paddingLeft&&(e+=s.paddingLeft),s.paddingTop&&(i+=s.paddingTop),(null!=s.bgColor||s.borderColor)&&t.drawRect(e,i,this.width,this.height,s.bgColor,s.borderColor,1),this.renderSelfToGraphic(t,e,i,n);var r,h=0,l=0;if(this._children&&this._children.length>0)for(l=this._children.length,h=0;h<l;h++)null!=(r=this._children[h]).drawToGraphic&&r.drawToGraphic(t,e,i,n)},e.renderSelfToGraphic=function(t,e,i,n){var s=this.style,r=this._getWords();if(r){r.length;if(s){var h=s.font,l=s.color;if(s.stroke){var a=s.stroke;a=parseInt(a);var o=s.strokeColor;t.fillBorderWords(r,e,i,h,l,o,a)}else t.fillWords(r,e,i,h,l);if(this.href){var u=r[r.length-1],c=u.y+u.height;"none"!=s.textDecoration&&t.drawLine(r[0].x,c,u.x+u.width,c,l,1);var d=S.create();d.rec.setTo(r[0].x,u.y,u.x+u.width-r[0].x,u.height),d.href=this.href,n.push(d)}}}},r(0,e,"href",function(){return this._style?this._style.href:null},function(t){this._style&&t!=this._style.href&&(this._style.href=t,this.repaint())}),r(0,e,"color",null,function(t){this.style.color=t}),r(0,e,"id",null,function(t){x.document.setElementById(t,this)}),r(0,e,"innerTEXT",function(){return this._text.text},function(e){this._text===t._EMPTYTEXT?this._text={text:e,words:null}:(this._text.text=e,this._text.words&&(this._text.words.length=0)),this.repaint()}),r(0,e,"style",function(){return this._style}),r(0,e,"width",function(){return this._width},function(t){this._width!==t&&(this._width=t,this.repaint())}),r(0,e,"x",function(){return this._x},function(t){this._x!=t&&(this._x=t,this.parentRepaint())}),r(0,e,"y",function(){return this._y},function(t){this._y!=t&&(this._y=t,this.parentRepaint())}),r(0,e,"height",function(){return this._height},function(t){this._height!==t&&(this._height=t,this.repaint())}),r(0,e,"className",null,function(t){this.style.attrs(x.document.styleSheets["."+t])}),t.formatURL1=function(t,e){if(!t)return"null path";if(e||(e=y.basePath),t.indexOf(":")>0)return t;if(null!=y.customFormat&&(t=y.customFormat(t)),t.indexOf(":")>0)return t;var i=t.charAt(0);if("."===i)return y._formatRelativePath(e+t);if("~"===i)return y.rootPath+t.substring(1);if("d"===i){if(0===t.indexOf("data:image"))return t}else if("/"===i)return t;return e+t},t.getClassName=function(t){return"function"==typeof t?t.name:t.constructor.name},t._EMPTYTEXT={text:null,words:null},t}(),x=function(){function t(){this.all=new Array,this.styleSheets=w.styleSheets}s(t,"laya.html.dom.HTMLDocument");var e=t.prototype;return e.getElementById=function(t){return this.all[t]},e.setElementById=function(t,e){this.all[t]=e},n(t,["document",function(){return this.document=new t}]),t}(),S=function(){function t(){this.rec=new d,this.reset()}s(t,"laya.html.dom.HTMLHitRect");var e=t.prototype;return e.reset=function(){return this.rec.reset(),this.href=null,this},e.recover=function(){c.recover("HTMLHitRect",this.reset())},t.create=function(){return c.getItemByClass("HTMLHitRect",t)},t}(),L=function(){function t(){this.reset()}s(t,"laya.html.utils.HTMLExtendStyle");var e=t.prototype;return e.reset=function(){return this.stroke=0,this.strokeColor="#000000",this.leading=0,this.lineHeight=0,this.letterSpacing=0,this.href=null,this},e.recover=function(){this!=t.EMPTY&&c.recover("HTMLExtendStyle",this.reset())},t.create=function(){return c.getItemByClass("HTMLExtendStyle",t)},t.EMPTY=new t,t}(),v=function(){function t(){}return s(t,"laya.html.utils.HTMLParse"),t.getInstance=function(e){var i=c.getItem(t._htmlClassMapShort[e]);return i||(i=l.getInstance(e)),i},t.parse=function(e,i,n){i=(i="<root>"+(i=i.replace(/<br>/g,"<br/>"))+"</root>").replace(t.spacePattern,t.char255);var s=g.parseXMLFromString(i);t._parseXML(e,s.childNodes[0].childNodes,n)},t._parseXML=function(e,i,n,s){var r=0,h=0;if(i.join||i.item)for(r=0,h=i.length;r<h;++r)t._parseXML(e,i[r],n,s);else{var l,a;if(3==i.nodeType){var o;return void(e instanceof laya.html.dom.HTMLDivParser?(null==i.nodeName&&(i.nodeName="#text"),a=i.nodeName.toLowerCase(),(o=i.textContent.replace(/^\s+|\s+$/g,"")).length>0&&(l=t.getInstance(a))&&(e.addChild(l),l.innerTEXT=o.replace(t.char255AndOneSpacePattern," "))):(o=i.textContent.replace(/^\s+|\s+$/g,"")).length>0&&(e.innerTEXT=o.replace(t.char255AndOneSpacePattern," ")))}if("#comment"==(a=i.nodeName.toLowerCase()))return;if(l=t.getInstance(a)){"p"==a?(e.addChild(t.getInstance("br")),l=e.addChild(l),e.addChild(t.getInstance("br"))):l=e.addChild(l),l.URI=n,l.href=s;var u=i.attributes;if(u&&u.length>0)for(r=0,h=u.length;r<h;++r){var c=u[r],d=c.nodeName,_=c.value;l._setAttributes(d,_)}t._parseXML(l,i.childNodes,n,l.href)}else t._parseXML(e,i.childNodes,n,s)}},t.char255=String.fromCharCode(255),t.spacePattern=/&nbsp;|&#160;/g,t.char255AndOneSpacePattern=new RegExp(String.fromCharCode(255)+"|(\\s+)","g"),t._htmlClassMapShort={div:"HTMLDivParser",p:"HTMLElement",img:"HTMLImageElement",span:"HTMLElement",br:"HTMLBrElement",style:"HTMLStyleElement",font:"HTMLElement",a:"HTMLElement","#text":"HTMLElement",link:"HTMLLinkElement"},t}(),w=function(){function t(){this.padding=t._PADDING,this.reset()}s(t,"laya.html.utils.HTMLStyle");var e=t.prototype;return e._getExtendStyle=function(){return this._extendStyle===L.EMPTY&&(this._extendStyle=L.create()),this._extendStyle},e.reset=function(){return this.ower=null,this._type=0,this.wordWrap=!0,this.fontSize=f.defaultFontSize,this.family=f.defaultFont,this.color="#000000",this.valign="top",this.padding=t._PADDING,this.bold=!1,this.italic=!1,this.align="left",this.textDecoration=null,this.bgColor=null,this.borderColor=null,this._extendStyle&&this._extendStyle.recover(),this._extendStyle=L.EMPTY,this},e.recover=function(){c.recover("HTMLStyle",this.reset())},e.inherit=function(e){var i,n=0,s=0;s=(i=t._inheritProps).length;var r;for(n=0;n<s;n++)this[r=i[n]]=e[r]},e._widthAuto=function(){return 0!=(262144&this._type)},e.widthed=function(t){return 0!=(8&this._type)},e._calculation=function(t,e){return!1},e.heighted=function(t){return 0!=(8192&this._type)},e.size=function(t,e){var i=this.ower,n=!1;-1!==t&&t!=i.width&&(this._type|=8,i.width=t,n=!0),-1!==e&&e!=i.height&&(this._type|=8192,i.height=e,n=!0),n&&i._layoutLater()},e.getLineElement=function(){return 0!=(65536&this._type)},e.setLineElement=function(t){t?this._type|=65536:this._type&=-65537},e._enableLayout=function(){return 0==(2&this._type)&&0==(4&this._type)},e.cssText=function(e){this.attrs(t.parseOneCSS(e,";"))},e.attrs=function(t){if(t)for(var e=0,i=t.length;e<i;e++){var n=t[e];this[n[0]]=n[1]}},r(0,e,"font",function(){return(this.italic?"italic ":"")+(this.bold?"bold ":"")+this.fontSize+"px "+(h.onIPhone?f.fontFamilyMap[this.family]||this.family:this.family)},function(t){for(var e=t.split(" "),i=0,n=e.length;i<n;i++){var s=e[i];switch(s){case"italic":this.italic=!0;continue;case"bold":this.bold=!0;continue}s.indexOf("px")>0&&(this.fontSize=parseInt(s),this.family=e[i+1],i++)}}),r(0,e,"href",function(){return this._extendStyle.href},function(t){t!==this._extendStyle.href&&(this._getExtendStyle().href=t)}),r(0,e,"lineHeight",function(){return this._extendStyle.lineHeight},function(t){this._extendStyle.lineHeight!==t&&(this._getExtendStyle().lineHeight=t)}),r(0,e,"strokeColor",function(){return this._extendStyle.strokeColor},function(t){this._extendStyle.strokeColor!==t&&(this._getExtendStyle().strokeColor=t)}),r(0,e,"stroke",function(){return this._extendStyle.stroke},function(t){this._extendStyle.stroke!==t&&(this._getExtendStyle().stroke=t)}),r(0,e,"leading",function(){return this._extendStyle.leading},function(t){this._extendStyle.leading!==t&&(this._getExtendStyle().leading=t)}),r(0,e,"align",function(){var e=48&this._type;return t.align_Value[e]},function(e){e in t.alignVDic&&(this._type&=-49,this._type|=t.alignVDic[e])}),r(0,e,"valign",function(){var e=192&this._type;return t.vAlign_Value[e]},function(e){e in t.alignVDic&&(this._type&=-193,this._type|=t.alignVDic[e])}),r(0,e,"block",function(){return 0!=(1&this._type)},function(t){t?this._type|=1:this._type&=-2}),r(0,e,"wordWrap",function(){return 0==(131072&this._type)},function(t){t?this._type&=-131073:this._type|=131072}),r(0,e,"bold",function(){return 0!=(1024&this._type)},function(t){t?this._type|=1024:this._type&=-1025}),r(0,e,"italic",function(){return 0!=(2048&this._type)},function(t){t?this._type|=2048:this._type&=-2049}),r(0,e,"whiteSpace",function(){return 131072&this._type?"nowrap":""},function(t){"nowrap"===t&&(this._type|=131072),"none"===t&&(this._type&=-131073)}),r(0,e,"width",null,function(t){if(this._type|=8,"string"==typeof t){var e=t.indexOf("auto");if(e>=0&&(this._type|=262144,t=t.substr(0,e)),this._calculation("width",t))return;t=parseInt(t)}this.size(t,-1)}),r(0,e,"height",null,function(t){if(this._type|=8192,"string"==typeof t){if(this._calculation("height",t))return;t=parseInt(t)}this.size(-1,t)}),r(0,e,"letterSpacing",function(){return this._extendStyle.letterSpacing},function(t){"string"==typeof t&&(t=parseInt(t+"")),t!=this._extendStyle.letterSpacing&&(this._getExtendStyle().letterSpacing=t)}),r(0,e,"position",function(){return 4&this._type?"absolute":""},function(t){"absolute"===t?this._type|=4:this._type&=-5}),r(0,e,"absolute",function(){return 0!=(4&this._type)}),r(0,e,"paddingLeft",function(){return this.padding[3]}),r(0,e,"paddingTop",function(){return this.padding[0]}),t.create=function(){return c.getItemByClass("HTMLStyle",t)},t.parseOneCSS=function(e,i){for(var n,s=[],r=e.split(i),h=0,l=r.length;h<l;h++){var a=r[h],o=a.indexOf(":"),u=a.substr(0,o).replace(/^\s+|\s+$/g,"");if(0!==u.length){var c=a.substr(o+1).replace(/^\s+|\s+$/g,""),d=[u,c];switch(u){case"italic":case"bold":d[1]="true"==c;break;case"font-weight":"bold"==c&&(d[1]=!0,d[0]="bold");break;case"line-height":d[0]="lineHeight",d[1]=parseInt(c);break;case"font-size":d[0]="fontSize",d[1]=parseInt(c);break;case"stroke":d[0]="stroke",d[1]=parseInt(c);break;case"padding":(n=c.split(" ")).length>1||(n[1]=n[2]=n[3]=n[0]),d[1]=[parseInt(n[0]),parseInt(n[1]),parseInt(n[2]),parseInt(n[3])];break;default:(d[0]=t._CSSTOVALUE[u])||(d[0]=u)}s.push(d)}}return s},t.parseCSS=function(e,i){for(var n;null!=(n=t._parseCSSRegExp.exec(e));)t.styleSheets[n[1]]=t.parseOneCSS(n[2],";")},t._CSSTOVALUE={"letter-spacing":"letterSpacing","white-space":"whiteSpace","line-height":"lineHeight","font-family":"family","vertical-align":"valign","text-decoration":"textDecoration","background-color":"bgColor","border-color":"borderColor"},t._parseCSSRegExp=new RegExp("([.#]\\w+)\\s*{([\\s\\S]*?)}","g"),t.ALIGN_LEFT="left",t.ALIGN_CENTER="center",t.ALIGN_RIGHT="right",t.VALIGN_TOP="top",t.VALIGN_MIDDLE="middle",t.VALIGN_BOTTOM="bottom",t.styleSheets={},t.ADDLAYOUTED=512,t._PADDING=[0,0,0,0],t._HEIGHT_SET=8192,t._LINE_ELEMENT=65536,t._NOWARP=131072,t._WIDTHAUTO=262144,t._BOLD=1024,t._ITALIC=2048,t._CSS_BLOCK=1,t._DISPLAY_NONE=2,t._ABSOLUTE=4,t._WIDTH_SET=8,t._ALIGN=48,t._VALIGN=192,n(t,["_inheritProps",function(){return this._inheritProps=["italic","align","valign","leading","stroke","strokeColor","bold","fontSize","lineHeight","wordWrap","color"]},"alignVDic",function(){return this.alignVDic={left:0,center:16,right:32,top:0,middle:64,bottom:128}},"align_Value",function(){return this.align_Value={0:"left",16:"center",32:"right"}},"vAlign_Value",function(){return this.vAlign_Value={0:"top",64:"middle",128:"bottom"}}]),t}(),T=function(){function t(){}return s(t,"laya.html.utils.Layout"),t.later=function(e){null==t._will&&(t._will=[],i.stage.frameLoop(1,null,function(){if(!(t._will.length<1)){for(var e=0;e<t._will.length;e++)laya.html.utils.Layout.layout(t._will[e]);t._will.length=0}})),t._will.push(e)},t.layout=function(e){if(!e||!e._style)return null;if(0==(512&e._style._type))return null;e.style._type&=-513;return t._multiLineLayout(e)},t._multiLineLayout=function(e){function i(){I.y=w,w+=I.h+_,I.mWidth=R,R=0,I=new E,C.push(I),I.h=0,v=0,k=!0,b=!1}var n=new Array;e._addChildsToLayout(n);var s,r,h,l,a,o=0,u=n.length,c=e._getCSSStyle(),d=c.letterSpacing,_=c.leading,f=c.lineHeight,p=c._widthAuto()||!c.wordWrap,y=p?999999:e.width,g=(e.height,0),m=c.italic?c.fontSize/3:0,x=c.align,S=c.valign,L="top"!==S||"left"!==x||0!=f,v=0,w=0,T=0,H=0,C=new Array,I=C[0]=new E,b=!1,M=!1;I.h=0,c.italic&&(y-=c.fontSize/3);var R=0,k=!0;for(o=0;o<u;o++)if(null!=(s=n[o]))if(k=!1,s instanceof laya.html.dom.HTMLBrElement)i(),I.y=w,I.h=f;else{if(s._isChar()){if((l=s).isWord)b=M||"\n"===l.char,I.wordStartIndex=I.elements.length;else{if(C.length>0&&v+T>y&&I.wordStartIndex>0){var D=0;D=I.elements.length-I.wordStartIndex+1,I.elements.length=I.wordStartIndex,o-=D,i();continue}b=!1,R+=l.width}T=l.width+l.style.letterSpacing,H=l.height,M=!1,(b=b||v+T>y)&&i(),I.minTextHeight=Math.min(I.minTextHeight,s.height)}else a=s,h=(r=s._getCSSStyle()).padding,b=M||r.getLineElement(),T=a.width+h[1]+h[3]+r.letterSpacing,H=a.height+h[0]+h[2],M=r.getLineElement(),(b=b||v+T>y&&r.wordWrap)&&i();I.elements.push(s),I.h=Math.max(I.h,H),s.x=v,s.y=w,v+=T,I.w=v-d,I.y=w,g=Math.max(v+m,g)}else k||(v+=t.DIV_ELEMENT_PADDING),I.wordStartIndex=I.elements.length;if(w=I.y+I.h,L){var N=0,A=y;for(p&&e.width>0&&(A=e.width),o=0,u=C.length;o<u;o++)C[o].updatePos(0,A,o,N,x,S,f),N+=Math.max(f,C[o].h+_);w=N}return p&&(e.width=g),w>e.height&&(e.height=w),[g,w]},t.DIV_ELEMENT_PADDING=0,t._will=null,t}(),E=function(){function t(){this.x=0,this.y=0,this.w=0,this.h=0,this.wordStartIndex=0,this.minTextHeight=99999,this.mWidth=0,this.elements=new Array}s(t,"laya.html.utils.LayoutLine");return t.prototype.updatePos=function(t,e,i,n,s,r,h){var l,a=0;this.elements.length>0&&(a=(l=this.elements[this.elements.length-1]).x+l.width-this.elements[0].x),h=h||this.h;var o=0,u=NaN;"center"===s&&(o=(e-a)/2),"right"===s&&(o=e-a);for(var c=0,d=this.elements.length;c<d;c++){var _=(l=this.elements[c])._getCSSStyle();switch(0!==o&&(l.x+=o),_.valign){case"top":l.y=n;break;case"middle":var f=0;99999!=this.minTextHeight&&(f=this.minTextHeight);var p=(f+h)/2;p=Math.max(p,this.h),u=(laya.html.dom.HTMLImageElement,n+p-l.height),l.y=u;break;case"bottom":l.y=n+(h-l.height)}}},t}(),H=function(t){function e(){this.contextHeight=NaN,this.contextWidth=NaN,this._htmlBounds=null,this._boundsRec=null,this.repaintHandler=null,e.__super.call(this)}s(e,"laya.html.dom.HTMLDivParser",t);var n=e.prototype;return n.reset=function(){return t.prototype.reset.call(this),this._style.block=!0,this._style.setLineElement(!0),this._style.width=200,this._style.height=200,this.repaintHandler=null,this.contextHeight=0,this.contextWidth=0,this},n.appendHTML=function(t){v.parse(this,t,this.URI),this.layout()},n._addChildsToLayout=function(t){var e=this._getWords();if(null==e&&(!this._children||0==this._children.length))return!1;e&&e.forEach(function(e){t.push(e)});for(var i=!0,n=0,s=this._children.length;n<s;n++){var r=this._children[n];i?i=!1:t.push(null),r._addToLayout(t)}return!0},n._addToLayout=function(t){this.layout(),!this.style.absolute&&t.push(this)},n.getBounds=function(){return this._htmlBounds?(this._boundsRec||(this._boundsRec=d.create()),this._boundsRec.copyFrom(this._htmlBounds)):null},n.parentRepaint=function(e){void 0===e&&(e=!1),t.prototype.parentRepaint.call(this),this.repaintHandler&&this.repaintHandler.runWith(e)},n.layout=function(){this.style._type|=512;var t=T.layout(this);if(t){this._htmlBounds||(this._htmlBounds=d.create());var e=this._htmlBounds;e.x=e.y=0,e.width=this.contextWidth=t[0],e.height=this.contextHeight=t[1]}},r(0,n,"height",function(){return this._height?this._height:this.contextHeight},t.prototype._$set_height),r(0,n,"innerHTML",null,function(t){this.destroyChildren(),this.appendHTML(t)}),r(0,n,"width",function(){return this._width?this._width:this.contextWidth},function(t){var e=!1;e=0===t?t!=this._width:t!=this.width,i.superSet(m,this,"width",t),e&&this.layout()}),e}(m),C=(function(t){function e(){e.__super.call(this)}s(e,"laya.html.dom.HTMLImageElement",t);var i=e.prototype;i.reset=function(){return t.prototype.reset.call(this),this._tex&&this._tex.off("loaded",this,this.onloaded),this._tex=null,this._url=null,this},i.onloaded=function(){var t=this._style;t.widthed(this)||this._tex.width,t.heighted(this)||this._tex.height;t.widthed(this)||this._width==this._tex.width||(this.width=this._tex.width,this.parent&&this.parent._layoutLater()),t.heighted(this)||this._height==this._tex.height||(this.height=this._tex.height,this.parent&&this.parent._layoutLater()),this.repaint()},i._addToLayout=function(t){!this._style.absolute&&t.push(this)},i.renderSelfToGraphic=function(t,e,i,n){this._tex&&t.drawImage(this._tex,e,i,this.width||this._tex.width,this.height||this._tex.height)},r(0,i,"src",null,function(t){if(t=this.formatURL(t),this._url!==t){this._url=t;var e=this._tex=u.getRes(t);e||(this._tex=e=new p,e.load(t),u.cacheRes(t,e)),e.getIsReady()?this.onloaded():e.once("ready",this,this.onloaded)}})}(m),function(t){function e(){e.__super.call(this)}s(e,"laya.html.dom.HTMLLinkElement",t);var i=e.prototype;i._creates=function(){},i.drawToGraphic=function(t,e,i,n){},i.reset=function(){return this._loader&&this._loader.off("complete",this,this._onload),this._loader=null,this},i._onload=function(t){switch(this._loader&&(this._loader=null),this.type){case"text/css":w.parseCSS(t,this.URI)}this.repaint(!0)},r(0,i,"href",t.prototype._$get_href,function(t){t&&(t=this.formatURL(t),this.URI=new y(t),this._loader&&this._loader.off("complete",this,this._onload),u.getRes(t)?"text/css"==this.type&&w.parseCSS(u.getRes(t),this.URI):(this._loader=new u,this._loader.once("complete",this,this._onload),this._loader.load(t,"text")))}),e._cuttingStyle=new RegExp("((@keyframes[\\s\\t]+|)(.+))[\\t\\n\\r\\s]*{","g")}(m),function(t){function e(){e.__super.call(this)}s(e,"laya.html.dom.HTMLStyleElement",t);var i=e.prototype;i._creates=function(){},i.drawToGraphic=function(t,e,i,n){},i.reset=function(){return this},r(0,i,"innerTEXT",t.prototype._$get_innerTEXT,function(t){w.parseCSS(t,null)})}(m),function(t){function e(){this._element=null,this._recList=[],this._innerHTML=null,this._repaintState=0,e.__super.call(this),this._element=new H,this._element.repaintHandler=new o(this,this._htmlDivRepaint),this.mouseEnabled=!0,this.on("click",this,this._onMouseClick)}s(e,"laya.html.dom.HTMLDivElement",t);var i=e.prototype;return i.destroy=function(e){void 0===e&&(e=!0),this._element&&this._element.reset(),this._element=null,this._doClears(),t.prototype.destroy.call(this,e)},i._htmlDivRepaint=function(t){void 0===t&&(t=!1),t?this._repaintState<2&&(this._repaintState=2):this._repaintState<1&&(this._repaintState=1),this._repaintState>0&&this._setGraphicDirty()},i._updateGraphicWork=function(){switch(this._repaintState){case 1:this._updateGraphic();break;case 2:this._refresh()}},i._setGraphicDirty=function(){this.callLater(this._updateGraphicWork)},i._doClears=function(){if(this._recList){var t=0,e=this._recList.length;for(t=0;t<e;t++)this._recList[t].recover();this._recList.length=0}},i._updateGraphic=function(){this._doClears(),this.graphics.clear(!0),this._repaintState=0,this._element.drawToGraphic(this.graphics,-this._element.x,-this._element.y,this._recList);var t=this._element.getBounds();t&&this.setSelfBounds(t),this.size(t.width,t.height)},i._refresh=function(){this._repaintState=1,this._innerHTML&&(this._element.innerHTML=this._innerHTML),this._setGraphicDirty()},i._onMouseClick=function(){var t,e=this.mouseX,i=this.mouseY,n=0,s=0;for(s=this._recList.length,n=0;n<s;n++)(t=this._recList[n]).rec.contains(e,i)&&this._eventLink(t.href)},i._eventLink=function(t){this.event("link",[t])},r(0,i,"style",function(){return this._element.style}),r(0,i,"innerHTML",null,function(t){this._innerHTML!=t&&(this._repaintState=1,this._innerHTML=t,this._element.innerHTML=t,this._setGraphicDirty())}),r(0,i,"contextWidth",function(){return this._element.contextWidth}),r(0,i,"contextHeight",function(){return this._element.contextHeight}),e}(_));!function(t){function e(){e.__super.call(this),this._element._getCSSStyle().valign="middle"}s(e,"laya.html.dom.HTMLIframeElement",C);r(0,e.prototype,"href",null,function(t){var e=this;t=this._element.formatURL(t);var i=new u;i.once("complete",null,function(i){var n=e._element.URI;e._element.URI=new y(t),e.innerHTML=i,!n||(e._element.URI=n)}),i.load(t,"text")})}()}(window,document,Laya);