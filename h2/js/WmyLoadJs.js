var WmyLoadJs=function(){function s(){var i=document.all.wmy;if(null!=i){try{var r=i.attributes.assetUrl.nodeValue;s.assetUrl=r}catch(s){}try{var t=i.attributes.V.nodeValue;s.V=t}catch(s){}}document.URL.indexOf("file:///")>=0&&(s.jsUrl="../"),s.importJs()}return s.goJs=function(i){var r='<script src="'+s.jsUrl+"libs/layaLibs/laya.core.min.js"+s.V+'"><\/script><script src="'+s.jsUrl+"libs/layaLibs/laya.webgl.min.js"+s.V+'"><\/script><script src="'+s.jsUrl+"libs/layaLibs/laya.ani.min.js"+s.V+'"><\/script><script src="'+s.jsUrl+"libs/layaLibs/laya.d3.min.js"+s.V+'"><\/script><script src="'+s.jsUrl+"libs/layaLibs/laya.physics3D.js"+s.V+'"><\/script><script src="'+s.jsUrl+"libs/layaLibs/laya.html.min.js"+s.V+'"><\/script><script src="'+s.jsUrl+"libs/wmyList/fairygui/fairygui.js"+s.V+'"><\/script><script src="'+s.jsUrl+"libs/wmyList/greensock/minified/TweenMax.min.js"+s.V+'"><\/script>';i.forEach(function(i){r+='<script src="'+i+s.V+'"><\/script>'}),document.write(r)},s.importJs=function(){var i=[];i.push("js/wmyUtilsH5/Wmy_Load_Mag.js"),i.push("js/wmyUtilsH5/WmyUtils.js"),i.push("js/wmyUtilsH5/3d/WmyUtils3D.js"),i.push("js/wmyUtilsH5/3d/WmyShaderMsg.js"),i.push("js/wmyUtilsH5/3d/WmyLoadMats.js"),i.push("js/wmyUtilsH5/3d/WmyLoad3d.js"),i.push("js/wmyUtilsH5/3d/WmyPhysicsWorld_Character.js"),i.push("js/player/PlayerKz.js"),i.push("js/player/UnitAnimator.js"),i.push("js/LayaAir3D.js"),s.goJs(i)},s.assetUrl="",s.V="",s.jsUrl="https://dnvqqk.github.io/webh5/",s}();new WmyLoadJs;