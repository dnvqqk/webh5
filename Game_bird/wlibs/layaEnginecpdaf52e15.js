!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.TAR=t():e.TAR=t()}(window,function(){return function(e){function t(i){if(r[i])return r[i].exports;var n=r[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,i){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)t.d(i,n,function(t){return e[t]}.bind(null,n));return i},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=152)}({0:function(e,t){var r=e.exports={version:"2.5.3"};"number"==typeof __e&&(__e=r)},1:function(e,t){var r=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},10:function(e,t,r){"use strict";t.__esModule=!0;var i=function(e){return e&&e.__esModule?e:{default:e}}(r(21));t.default=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i.default)(e,n.key,n)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()},11:function(e,t,r){var i=r(13);e.exports=function(e,t,r){if(i(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,i){return e.call(t,r,i)};case 3:return function(r,i,n){return e.call(t,r,i,n)}}return function(){return e.apply(t,arguments)}}},12:function(e,t,r){var i=r(5),n=r(14);e.exports=r(2)?function(e,t,r){return i.f(e,t,n(1,r))}:function(e,t,r){return e[t]=r,e}},13:function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},14:function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},152:function(e,t,r){e.exports=r(153)},153:function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=i(r(9)),o=i(r(10)),a=i(r(154)),u=navigator.userAgent.indexOf("Android")>-1||navigator.userAgent.indexOf("Adr")>-1,s=function(){function e(){(0,n.default)(this,e),e.inited||e.init(),this.scene=new Laya.Scene,this.camera=new Laya.Camera(0,.1,1e4),this.scene.addChild(this.camera),this.gl=null,this.arView=null,this.vrDisplay=null}return(0,o.default)(e,[{key:"load",value:function(e){Laya.stage.addChild(this.scene),this.vrDisplay=e;var t=this;u&&(this.gl=Laya.WebGL.mainContext,this.arView=new a.default(e,this.gl),Laya.WebGL.mainContext.useProgram(Laya.WebGLContext._useProgram),this.scene.oldRenderScene=this.scene._renderScene,this.scene._renderScene=function(e,r){null!==t.arView&&(Laya.WebGLContext.setDepthTest(Laya.WebGL.mainContext,!1),Laya.WebGLContext.setBlend(Laya.WebGL.mainContext,!1),Laya.WebGLContext.setCullFace(Laya.WebGL.mainContext,!1),t.arView.render(),Laya.WebGL.mainContext.useProgram(Laya.WebGLContext._useProgram),Laya.Buffer._bindActive[Laya.WebGL.mainContext.ARRAY_BUFFER]&&Laya.WebGL.mainContext.bindBuffer(Laya.WebGL.mainContext.ARRAY_BUFFER,Laya.Buffer._bindActive[Laya.WebGL.mainContext.ARRAY_BUFFER]),Laya.Buffer._bindActive[Laya.WebGL.mainContext.ELEMENT_ARRAY_BUFFER]&&Laya.WebGL.mainContext.bindBuffer(Laya.WebGL.mainContext.ELEMENT_ARRAY_BUFFER,Laya.Buffer._bindActive[Laya.WebGL.mainContext.ELEMENT_ARRAY_BUFFER])),this.scene.oldRenderScene(e,r)})}},{key:"onCameraTransformChange",value:function(){var e=new VRFrameData;this.vrDisplay.getFrameData(e),this.camera.projectionMatrix=new Laya.Matrix4x4(e.leftProjectionMatrix[0],e.leftProjectionMatrix[1],e.leftProjectionMatrix[2],e.leftProjectionMatrix[3],e.leftProjectionMatrix[4],e.leftProjectionMatrix[5],e.leftProjectionMatrix[6],e.leftProjectionMatrix[7],e.leftProjectionMatrix[8],e.leftProjectionMatrix[9],e.leftProjectionMatrix[10],e.leftProjectionMatrix[11],e.leftProjectionMatrix[12],e.leftProjectionMatrix[13],e.leftProjectionMatrix[14],e.leftProjectionMatrix[15]),this.camera.transform.position=new Laya.Vector3(e.pose.position[0],e.pose.position[1],e.pose.position[2]),this.camera.transform.rotation=new Laya.Quaternion(e.pose.orientation[0],e.pose.orientation[1],e.pose.orientation[2],e.pose.orientation[3])}},{key:"getScene",value:function(){return this.scene}},{key:"getCamera",value:function(){return this.camera}}],[{key:"init",value:function(){Laya3D.init(0,0),Laya.stage.scaleMode=Laya.Stage.SCALE_FULL,Laya.stage.screenMode=Laya.Stage.SCREEN_NONE,Laya.stage.bgColor="none",e.inited=!0}}]),e}();s.inited=!1,window.LayaEngine=s,t.default=s},154:function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t,r){var i=void 0;if("fragment"===r)i=e.createShader(e.FRAGMENT_SHADER);else{if("vertex"!==r)return null;i=e.createShader(e.VERTEX_SHADER)}e.shaderSource(i,t),e.compileShader(i);return e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.log(e.getShaderInfoLog(i)),null)}function o(e,t){var r=0;switch(t){case 90:r=1;break;case 180:r=2;break;case 270:r=3;break;default:r=0}var i=0;switch(e){case 90:i=1;break;case 180:i=2;break;case 270:i=3;break;default:i=0}var n=i-r;return n<0&&(n+=4),n%4}Object.defineProperty(t,"__esModule",{value:!0});var a=i(r(9)),u=i(r(10)),s=function(){function e(t,r){if((0,a.default)(this,e),this.vrDisplay=t,this.gl=r,this.vrDisplay){this.passThroughCamera=t.getPassThroughCamera(),this.program=function(e,t,r){var i=n(e,t,"vertex"),o=n(e,r,"fragment");if(!o)return null;var a=e.createProgram();return e.attachShader(a,i),e.attachShader(a,o),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)||console.log("Could not initialise arview shaders"),a}(r,"attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;varying vec2 vTextureCoord;void main(void) {  gl_Position = vec4(aVertexPosition, 1.0);   vTextureCoord = aTextureCoord;}","#extension GL_OES_EGL_image_external : require\nprecision mediump float;varying vec2 vTextureCoord;uniform samplerExternalOES uSampler;void main(void) {  gl_FragColor = texture2D(uSampler, vTextureCoord);}")}r.useProgram(this.program),this.vertexPositionAttribute=r.getAttribLocation(this.program,"aVertexPosition"),this.textureCoordAttribute=r.getAttribLocation(this.program,"aTextureCoord"),this.samplerUniform=r.getUniformLocation(this.program,"uSampler"),this.vertexPositionBuffer=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,this.vertexPositionBuffer);var i=new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]);r.bufferData(r.ARRAY_BUFFER,i,r.STATIC_DRAW),this.vertexPositionBuffer.itemSize=3,this.vertexPositionBuffer.numItems=12,this.textureCoordBuffer=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,this.textureCoordBuffer);var u=null;if(this.vrDisplay){var s=this.passThroughCamera.width/this.passThroughCamera.textureWidth,f=this.passThroughCamera.height/this.passThroughCamera.textureHeight;u=[[0,0,0,f,s,0,s,f],[s,0,0,0,s,f,0,f],[s,f,s,0,0,f,0,0],[0,f,s,f,0,0,s,0]]}else u=[[0,0,0,1,1,0,1,1],[1,0,0,0,1,1,0,1],[1,1,1,0,0,1,0,0],[0,1,1,1,0,0,1,0]];this.f32TextureCoords=[];for(var c=0;c<u.length;c+=1)this.f32TextureCoords.push(new Float32Array(u[c]));this.combinedOrientation=o(window.screen.orientation.angle,this.passThroughCamera.orientation),r.bufferData(r.ARRAY_BUFFER,this.f32TextureCoords[this.combinedOrientation],r.STATIC_DRAW),this.textureCoordBuffer.itemSize=2,this.textureCoordBuffer.numItems=8,r.bindBuffer(r.ARRAY_BUFFER,null),this.indexBuffer=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var l=new Uint16Array([0,1,2,2,1,3]);return r.bufferData(r.ELEMENT_ARRAY_BUFFER,l,r.STATIC_DRAW),this.indexBuffer.itemSize=1,this.indexBuffer.numItems=6,r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,null),this.texture=r.createTexture(),r.useProgram(null),this.projectionMatrix=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],this.mvMatrix=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],this}return(0,u.default)(e,[{key:"render",value:function(){this.gl.useProgram(this.program),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexPositionBuffer),this.gl.enableVertexAttribArray(this.vertexPositionAttribute),this.gl.vertexAttribPointer(this.vertexPositionAttribute,this.vertexPositionBuffer.itemSize,this.gl.FLOAT,!1,0,0),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.textureCoordBuffer);var e=o(window.screen.orientation.angle,this.passThroughCamera.orientation);e!==this.combinedOrientation&&(this.combinedOrientation=e,this.gl.bufferData(this.gl.ARRAY_BUFFER,this.f32TextureCoords[this.combinedOrientation],this.gl.STATIC_DRAW)),this.gl.enableVertexAttribArray(this.textureCoordAttribute),this.gl.vertexAttribPointer(this.textureCoordAttribute,this.textureCoordBuffer.itemSize,this.gl.FLOAT,!1,0,0),this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_EXTERNAL_OES,this.texture),this.gl.texImage2D(this.gl.TEXTURE_EXTERNAL_OES,0,this.gl.RGB,this.gl.RGB,this.gl.UNSIGNED_BYTE,this.passThroughCamera),this.gl.uniform1i(this.samplerUniform,0),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer),this.gl.drawElements(this.gl.TRIANGLES,this.indexBuffer.numItems,this.gl.UNSIGNED_SHORT,0)}}]),e}(),f=function(){function e(t,r){(0,a.default)(this,e),this.vrDisplay=t,this.isARKit(this.vrDisplay)||(this.gl=r,this.videoRenderer=new s(t,this.gl),this.width=window.innerWidth,this.height=window.innerHeight,window.addEventListener("resize",this.onWindowResize.bind(this),!1))}return(0,u.default)(e,[{key:"onWindowResize",value:function(){this.width=window.innerWidth,this.height=window.innerHeight}},{key:"isARKit",value:function(e){return!(!e||!e.displayName.toLowerCase().includes("arkit"))}},{key:"render",value:function(){if(!this.isARKit(this.vrDisplay)){var e=window.devicePixelRatio,t=this.width*e,r=this.height*e;this.gl.viewportWidth!==t&&(this.gl.viewportWidth=t),this.gl.viewportHeight!==r&&(this.gl.viewportHeight=r),this.gl.viewport(0,0,this.gl.viewportWidth,this.gl.viewportHeight),this.videoRenderer.render()}}}]),e}();t.default=f},16:function(e,t,r){var i=r(4),n=r(1).document,o=i(n)&&i(n.createElement);e.exports=function(e){return o?n.createElement(e):{}}},17:function(e,t,r){var i=r(4);e.exports=function(e,t){if(!i(e))return e;var r,n;if(t&&"function"==typeof(r=e.toString)&&!i(n=r.call(e)))return n;if("function"==typeof(r=e.valueOf)&&!i(n=r.call(e)))return n;if(!t&&"function"==typeof(r=e.toString)&&!i(n=r.call(e)))return n;throw TypeError("Can't convert object to primitive value")}},18:function(e,t,r){e.exports=!r(2)&&!r(8)(function(){return 7!=Object.defineProperty(r(16)("div"),"a",{get:function(){return 7}}).a})},2:function(e,t,r){e.exports=!r(8)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},21:function(e,t,r){e.exports={default:r(22),__esModule:!0}},22:function(e,t,r){r(23);var i=r(0).Object;e.exports=function(e,t,r){return i.defineProperty(e,t,r)}},23:function(e,t,r){var i=r(3);i(i.S+i.F*!r(2),"Object",{defineProperty:r(5).f})},3:function(e,t,r){var i=r(1),n=r(0),o=r(11),a=r(12),u="prototype",s=function(e,t,r){var f,c,l,h=e&s.F,d=e&s.G,g=e&s.S,p=e&s.P,v=e&s.B,x=e&s.W,m=d?n:n[t]||(n[t]={}),y=m[u],b=d?i:g?i[t]:(i[t]||{})[u];d&&(r=t);for(f in r)(c=!h&&b&&void 0!==b[f])&&f in m||(l=c?b[f]:r[f],m[f]=d&&"function"!=typeof b[f]?r[f]:v&&c?o(l,i):x&&b[f]==l?function(e){var t=function(t,r,i){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,i)}return e.apply(this,arguments)};return t[u]=e[u],t}(l):p&&"function"==typeof l?o(Function.call,l):l,p&&((m.virtual||(m.virtual={}))[f]=l,e&s.R&&y&&!y[f]&&a(y,f,l)))};s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,e.exports=s},4:function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},5:function(e,t,r){var i=r(7),n=r(18),o=r(17),a=Object.defineProperty;t.f=r(2)?Object.defineProperty:function(e,t,r){if(i(e),t=o(t,!0),i(r),n)try{return a(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},7:function(e,t,r){var i=r(4);e.exports=function(e){if(!i(e))throw TypeError(e+" is not an object!");return e}},8:function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},9:function(e,t,r){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}}})});