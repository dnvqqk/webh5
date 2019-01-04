/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";
//加载
loadLib("loadInfo.js");
//laya相关
loadLib("slibs/laya.core.js");
loadLib("slibs/laya.webgl.js");
loadLib("slibs/laya.d3.js");
loadLib("slibs/laya.physics3D.js");
loadLib("slibs/laya.html.js");
//FUI
loadLib("wlibs/fairygui.js");
//
//loadLib("wlibs/vconsole.min.js");
//主逻辑bundle
loadLib("js/bundle.js");