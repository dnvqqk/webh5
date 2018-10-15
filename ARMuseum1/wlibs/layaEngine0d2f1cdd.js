(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TAR"] = factory();
	else
		root["TAR"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 152);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(21);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(13);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(5);
var createDesc = __webpack_require__(14);
module.exports = __webpack_require__(2) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 13:
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 14:
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(153);


/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(9);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _ARView = __webpack_require__(154);

var _ARView2 = _interopRequireDefault(_ARView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Laya Laya3D VRFrameData */
/* eslint no-underscore-dangle: ["error", { "allow":
 [
    "_useProgram",
    "_renderScene",
    "_bindActive"
]}] */
var ANDROID_PLATFORM = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;

var LayaEngine = function () {
    function LayaEngine() {
        (0, _classCallCheck3.default)(this, LayaEngine);

        if (!LayaEngine.inited) {
            LayaEngine.init();
        }

        this.scene = new Laya.Scene3D();
        this.camera = new Laya.Camera(0, 0.1, 10000);
        this.scene.addChild(this.camera);

        this.gl = null;
        this.arView = null;
        this.vrDisplay = null;
    }

    /**
     * 某些引擎比较奇怪， 为了编译材质，需要把初始化前提
     */


    (0, _createClass3.default)(LayaEngine, [{
        key: 'load',
        value: function load(vrDisplay) {
            Laya.stage.addChild(this.scene);
            this.vrDisplay = vrDisplay;
            var self = this;

            // 注册背景帧渲染
            if (ANDROID_PLATFORM) {
                this.gl = Laya.WebGL.mainContext;
                this.arView = new _ARView2.default(vrDisplay, this.gl);
                Laya.WebGL.mainContext.useProgram(Laya.WebGLContext._useProgram);
                this.scene.oldRenderScene = this.scene._renderScene;
                this.scene._renderScene = function (p0, p1) {
                    if (self.arView !== null) {
                        Laya.WebGLContext.setDepthTest(Laya.WebGL.mainContext, false);
                        Laya.WebGLContext.setBlend(Laya.WebGL.mainContext, false);
                        Laya.WebGLContext.setCullFace(Laya.WebGL.mainContext, false);
                        self.arView.render();
                        Laya.WebGL.mainContext.useProgram(Laya.WebGLContext._useProgram);
                        if (Laya.Buffer._bindedVertexBuffer[Laya.WebGLContext.ARRAY_BUFFER]) {
                            Laya.WebGL.mainContext.bindBuffer(Laya.WebGLContext.ARRAY_BUFFER, Laya.Buffer._bindedVertexBuffer[Laya.WebGLContext.ARRAY_BUFFER]);
                        }
                        if (Laya.Buffer._bindedIndexBuffer[Laya.WebGLContext.ELEMENT_ARRAY_BUFFER]) {
                            Laya.WebGL.mainContext.bindBuffer(Laya.WebGLContext.ELEMENT_ARRAY_BUFFER, Laya.Buffer._bindedIndexBuffer[Laya.WebGLContext.ELEMENT_ARRAY_BUFFER]);
                        }
                    }
                    this.scene.oldRenderScene(p0, p1);
                };
            }
        }
    }, {
        key: 'onCameraTransformChange',
        value: function onCameraTransformChange() {
            var frameData = new VRFrameData();
            this.vrDisplay.getFrameData(frameData);

            this.camera.projectionMatrix = new Laya.Matrix4x4(frameData.leftProjectionMatrix[0], frameData.leftProjectionMatrix[1], frameData.leftProjectionMatrix[2], frameData.leftProjectionMatrix[3], frameData.leftProjectionMatrix[4], frameData.leftProjectionMatrix[5], frameData.leftProjectionMatrix[6], frameData.leftProjectionMatrix[7], frameData.leftProjectionMatrix[8], frameData.leftProjectionMatrix[9], frameData.leftProjectionMatrix[10], frameData.leftProjectionMatrix[11], frameData.leftProjectionMatrix[12], frameData.leftProjectionMatrix[13], frameData.leftProjectionMatrix[14], frameData.leftProjectionMatrix[15]);
            this.camera.transform.position = new Laya.Vector3(frameData.pose.position[0], frameData.pose.position[1], frameData.pose.position[2]);
            this.camera.transform.rotation = new Laya.Quaternion(frameData.pose.orientation[0], frameData.pose.orientation[1], frameData.pose.orientation[2], frameData.pose.orientation[3]);
        }
    }, {
        key: 'getScene',
        value: function getScene() {
            return this.scene;
        }
    }, {
        key: 'getCamera',
        value: function getCamera() {
            return this.camera;
        }
    }], [{
        key: 'init',
        value: function init() {
            if(!Laya._isinit){
                var Config3D={
                /**@private */
                "defaultPhysicsMemory":16,
                /**@private */
                "_editerEnvironment":false,
                /**
                *是否开启抗锯齿。
                */
                "isAntialias":true,
                /**
                *设置画布是否透明。
                */
                "isAlpha":true,
                /**
                *设置画布是否预乘。
                */
                "premultipliedAlpha":true,
                /**
                *设置画布的是否开启模板缓冲。
                */
                "isStencil":true,
                }
                Laya3D.init(0, 0,Config3D);
                Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
                Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
                Laya.stage.bgColor = 'none';
            }
            LayaEngine.inited = true;
        }
    }]);
    return LayaEngine;
}();

LayaEngine.inited = false;

window.LayaEngine = LayaEngine;
exports.default = LayaEngine;

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(9);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Creates and load a shader from a string, type specifies either 'vertex' or 'fragment'
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} str
 * @param {string} type
 * @return {!WebGLShader}
 */
function getShader(gl, str, type) {
    var shader = void 0;
    if (type === 'fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type === 'vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    var result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!result) {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

/**
 * Creates a shader program from vertex and fragment shader sources
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vs
 * @param {string} fs
 * @return {!WebGLProgram}
 */
function getProgram(gl, vs, fs) {
    var vertexShader = getShader(gl, vs, 'vertex');
    var fragmentShader = getShader(gl, fs, 'fragment');
    if (!fragmentShader) {
        return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    var result = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!result) {
        console.log('Could not initialise arview shaders');
    }

    return shaderProgram;
}

/**
 * Calculate the correct orientation depending on the device and the camera
 * orientations.
 *
 * @param {number} screenOrientation
 * @param {number} seeThroughCameraOrientation
 * @return {number}
 */
function combineOrientations(screenOrientation, seeThroughCameraOrientation) {
    var seeThroughCameraOrientationIndex = 0;
    switch (seeThroughCameraOrientation) {
        case 90:
            seeThroughCameraOrientationIndex = 1;
            break;
        case 180:
            seeThroughCameraOrientationIndex = 2;
            break;
        case 270:
            seeThroughCameraOrientationIndex = 3;
            break;
        default:
            seeThroughCameraOrientationIndex = 0;
            break;
    }
    var screenOrientationIndex = 0;
    switch (screenOrientation) {
        case 90:
            screenOrientationIndex = 1;
            break;
        case 180:
            screenOrientationIndex = 2;
            break;
        case 270:
            screenOrientationIndex = 3;
            break;
        default:
            screenOrientationIndex = 0;
            break;
    }
    var ret = screenOrientationIndex - seeThroughCameraOrientationIndex;
    if (ret < 0) {
        ret += 4;
    }
    return ret % 4;
}

/**
 * Renders the ar camera's video texture
 */

var ARVideoRenderer = function () {
    /**
     * @param {VRDisplay} vrDisplay
     * @param {WebGLRenderingContext} gl
     */
    function ARVideoRenderer(vrDisplay, gl) {
        (0, _classCallCheck3.default)(this, ARVideoRenderer);

        this.vrDisplay = vrDisplay;
        this.gl = gl;

        if (this.vrDisplay) {
            var vertexSource = 'attribute vec3 aVertexPosition;' + 'attribute vec2 aTextureCoord;' + 'varying vec2 vTextureCoord;' + 'void main(void) {' + '  gl_Position = vec4(aVertexPosition, 1.0);' + '   vTextureCoord = aTextureCoord;' + '}';
            var fragmentSource = '#extension GL_OES_EGL_image_external : require\n' + 'precision mediump float;' + 'varying vec2 vTextureCoord;' + 'uniform samplerExternalOES uSampler;' + 'void main(void) {' + '  gl_FragColor = texture2D(uSampler, vTextureCoord);' + '}';

            this.passThroughCamera = vrDisplay.getPassThroughCamera();
            this.program = getProgram(gl, vertexSource, fragmentSource);
        }

        gl.useProgram(this.program);

        // Setup a quad
        this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');
        this.textureCoordAttribute = gl.getAttribLocation(this.program, 'aTextureCoord');

        this.samplerUniform = gl.getUniformLocation(this.program, 'uSampler');

        this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];
        var f32Vertices = new Float32Array(vertices);
        gl.bufferData(gl.ARRAY_BUFFER, f32Vertices, gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = 12;

        this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        // Precalculate different texture UV coordinates depending on the possible
        // orientations of the device depending if there is a VRDisplay or not
        var textureCoords = null;
        if (this.vrDisplay) {
            var u = this.passThroughCamera.width / this.passThroughCamera.textureWidth;
            var v = this.passThroughCamera.height / this.passThroughCamera.textureHeight;
            textureCoords = [[0.0, 0.0, 0.0, v, u, 0.0, u, v], [u, 0.0, 0.0, 0.0, u, v, 0.0, v], [u, v, u, 0.0, 0.0, v, 0.0, 0.0], [0.0, v, u, v, 0.0, 0.0, u, 0.0]];
        } else {
            textureCoords = [[0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0]];
        }

        this.f32TextureCoords = [];
        for (var i = 0; i < textureCoords.length; i += 1) {
            this.f32TextureCoords.push(new Float32Array(textureCoords[i]));
        }
        // Store the current combined orientation to check if it has changed
        // during the update calls and use the correct texture coordinates.
        this.combinedOrientation = combineOrientations(window.screen.orientation.angle, this.passThroughCamera.orientation);

        gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);
        this.textureCoordBuffer.itemSize = 2;
        this.textureCoordBuffer.numItems = 8;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var indices = [0, 1, 2, 2, 1, 3];
        var ui16Indices = new Uint16Array(indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ui16Indices, gl.STATIC_DRAW);
        this.indexBuffer.itemSize = 1;
        this.indexBuffer.numItems = 6;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.texture = gl.createTexture();
        gl.useProgram(null);

        // The projection matrix will be based on an identify orthographic camera
        this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        return this;
    }

    /**
     * Renders the quad
     */


    (0, _createClass3.default)(ARVideoRenderer, [{
        key: 'render',
        value: function render() {
            
		    Laya.stage.event("tar_render",this.texture);
            this.gl.useProgram(this.program);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.gl.vertexAttribPointer(this.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);

            // Check the current orientation of the device combined with the
            // orientation of the VRSeeThroughCamera to determine the correct UV
            // coordinates to be used.
            var combinedOrientation = combineOrientations(window.screen.orientation.angle, this.passThroughCamera.orientation);
            if (combinedOrientation !== this.combinedOrientation) {
                this.combinedOrientation = combinedOrientation;
                this.gl.bufferData(this.gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], this.gl.STATIC_DRAW);
            }

            this.gl.enableVertexAttribArray(this.textureCoordAttribute);
            this.gl.vertexAttribPointer(this.textureCoordAttribute, this.textureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_EXTERNAL_OES, this.texture);
            // Update the content of the texture in every frame.
            this.gl.texImage2D(this.gl.TEXTURE_EXTERNAL_OES, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.passThroughCamera);
            this.gl.uniform1i(this.samplerUniform, 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
        }
    }]);
    return ARVideoRenderer;
}();

/**
 * A helper class that takes a VRDisplay with AR capabilities
 * and renders the see through camera to the passed in WebGLRenderer's
 * context.
 */


var ARView = function () {
    /**
     * @param {VRDisplay} vrDisplay
     * @param {THREE.WebGLRenderer} renderer
     */
    function ARView(vrDisplay, gl) {
        (0, _classCallCheck3.default)(this, ARView);

        this.vrDisplay = vrDisplay;
        if (this.isARKit(this.vrDisplay)) {
            return;
        }

        this.gl = gl;

        this.videoRenderer = new ARVideoRenderer(vrDisplay, this.gl);

        // Cache the width/height so we're not potentially forcing
        // a reflow if there's been a style invalidation
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    /**
     * Updates the stored width/height of window on resize.
     */


    (0, _createClass3.default)(ARView, [{
        key: 'onWindowResize',
        value: function onWindowResize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }, {
        key: 'isARKit',
        value: function isARKit(display) {
            if (display && display.displayName.toLowerCase().includes('arkit')) return true;
            return false;
        }

        /**
         * Renders the see through camera to the passed in renderer
         */

    }, {
        key: 'render',
        value: function render() {
            if (this.isARKit(this.vrDisplay)) {
                return;
            }

            var dpr = window.devicePixelRatio;
            var width = this.width * dpr;
            var height = this.height * dpr;

            if (this.gl.viewportWidth !== width) {
                this.gl.viewportWidth = width;
            }

            if (this.gl.viewportHeight !== height) {
                this.gl.viewportHeight = height;
            }

            this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
            this.videoRenderer.render();
        }
    }]);
    return ARView;
}();

exports.default = ARView;

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(1).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(2) && !__webpack_require__(8)(function () {
  return Object.defineProperty(__webpack_require__(16)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(8)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(22), __esModule: true };

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(23);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(3);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(2), 'Object', { defineProperty: __webpack_require__(5).f });


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var core = __webpack_require__(0);
var ctx = __webpack_require__(11);
var hide = __webpack_require__(12);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7);
var IE8_DOM_DEFINE = __webpack_require__(18);
var toPrimitive = __webpack_require__(17);
var dP = Object.defineProperty;

exports.f = __webpack_require__(2) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ })

/******/ });
});
//# sourceMappingURL=layaEngine.js.map