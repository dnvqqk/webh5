/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";
//加载
loadLib("loadInfo6fcd629e.js");
//laya相关
loadLib("slibs/laya.core44a89968.js");
loadLib("slibs/laya.webglb0adda52.js");
loadLib("slibs/laya.d3a3b1d97b.js");
loadLib("slibs/laya.physics3D0b89b83d.js");
loadLib("slibs/laya.htmlbc97b9a5.js");
//FUI
loadLib("wlibs/fairyguibb821e99.js");
//
loadLib("wlibs/vconsole.minbac6b63f.js");
//主逻辑bundle
loadLib("js/bundlecf695969.js");