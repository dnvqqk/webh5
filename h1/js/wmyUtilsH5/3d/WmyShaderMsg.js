var WmyShaderMsg = /** @class */ (function () {
    function WmyShaderMsg() {
    }
    /**
     * @param	target	对象
     * @param	mat	材质
     * @param	shaderUrl	shader的地址
     * @param	isNewMateria	是否新材质
     */
    WmyShaderMsg.setShader = function (target, mat, shaderUrl, isNewMateria, spriteDefines, materialDefines) {
        if (isNewMateria === void 0) { isNewMateria = false; }
        if (spriteDefines === void 0) { spriteDefines = "null"; }
        if (materialDefines === void 0) { materialDefines = "null"; }
        var renderer;
        var sharedMaterial;
        if (target instanceof Laya.SkinnedMeshSprite3D) {
            renderer = target.skinnedMeshRenderer;
            sharedMaterial = renderer.sharedMaterial;
        }
        else {
            renderer = target.meshRenderer;
            sharedMaterial = renderer.sharedMaterial;
        }
        if (isNewMateria) {
            sharedMaterial = sharedMaterial.clone();
            renderer.sharedMaterial = sharedMaterial;
        }
        for (var key in mat) {
            try {
                sharedMaterial[key] = mat[key];
            }
            catch (error) {
            }
        }
        Laya.loader.load(shaderUrl, Laya.Handler.create(this, this.shaderConmplete, [sharedMaterial, spriteDefines, materialDefines]), null, Laya.Loader.XML);
        return sharedMaterial;
    };
    WmyShaderMsg.shaderConmplete = function (sharedMaterial, spriteDefines, materialDefines, data) {
        if (data == null)
            return;
        var xmlNode = data.firstChild;
        var shaderName = this.getAttributesValue(xmlNode, "name");
        var i, o, oName, v0, v1, initV;
        var attributeMap = {};
        var attributeMapNode = this.getNode(xmlNode, "attributeMap");
        var attributeMapArr = this.getNodeArr(attributeMapNode, "data");
        for (i = 0; i < attributeMapArr.length; i++) {
            o = attributeMapArr[i];
            oName = this.getAttributesValue(o, "name");
            v0 = this.getAttributesValue(o, "v0");
            attributeMap[oName] = this.getV(v0, "int");
        }
        var uniformMap = {};
        var uniformMapNode = this.getNode(xmlNode, "uniformMap");
        var uniformMapArr = this.getNodeArr(uniformMapNode, "data");
        for (i = 0; i < uniformMapArr.length; i++) {
            initV = null;
            o = uniformMapArr[i];
            oName = this.getAttributesValue(o, "name");
            v0 = this.getAttributesValue(o, "v0");
            v1 = this.getAttributesValue(o, "v1");
            var vArr = [];
            vArr[0] = this.getV(v0, "int");
            vArr[1] = this.getV(v1, "int");
            uniformMap[oName] = vArr;
            if (sharedMaterial["wmyValues"] != null) {
                if (sharedMaterial["wmyValues"]["cube"] != null) {
                    var cubeName = sharedMaterial["wmyValues"]["cube"];
                    Wmy_Load_Mag.getThis.getCube(cubeName, new Laya.Handler(this, function (cube, i) {
                        if (i == 0) {
                            sharedMaterial._shaderValues.setTexture(Laya.Scene3D.REFLECTIONTEXTURE, cube);
                        }
                    }));
                }
                initV = sharedMaterial["wmyValues"][oName];
            }
            //initV=this.getAttributesValue(o,"initV");
            if (initV != null) {
                initV = initV.split(",");
                if (initV.length == 4) {
                    sharedMaterial._shaderValues.setVector(vArr[0], new Laya.Vector4(parseFloat(initV[0]), parseFloat(initV[1]), parseFloat(initV[2]), parseFloat(initV[3])));
                }
                else if (initV.length == 3) {
                    sharedMaterial._shaderValues.setVector(vArr[0], new Laya.Vector3(parseFloat(initV[0]), parseFloat(initV[1]), parseFloat(initV[2])));
                }
                else if (initV.length == 2) {
                    sharedMaterial._shaderValues.setVector(vArr[0], new Laya.Vector2(parseFloat(initV[0]), parseFloat(initV[1])));
                }
                else if (initV.length == 1) {
                    if (!isNaN(parseFloat(initV[0]))) {
                        sharedMaterial._shaderValues.setNumber(vArr[0], parseFloat(initV[0]));
                    }
                    else {
                        var strObj = initV[0] + "";
                        if (strObj == "tex") {
                            var tex = sharedMaterial[oName];
                            sharedMaterial._shaderValues.setTexture(vArr[0], tex);
                        }
                    }
                }
            }
        }
        if (spriteDefines == "null") {
            spriteDefines = Laya.SkinnedMeshSprite3D.shaderDefines;
        }
        if (materialDefines == "null") {
            materialDefines = Laya.BlinnPhongMaterial.shaderDefines;
        }
        var shader = Laya.Shader3D.add(shaderName, attributeMap, uniformMap, spriteDefines, materialDefines);
        var SubShaderNode = this.getNode(xmlNode, "SubShader");
        var renderModeNode = this.getNode(xmlNode, "renderMode");
        if (renderModeNode != null) {
            var renderMode = this.getAttributesValue(renderModeNode, "v");
            if (renderMode != null) {
                sharedMaterial["renderMode"] = this.getV(renderMode);
            }
        }
        var PassArr = this.getNodeArr(SubShaderNode, "Pass");
        for (i = 0; i < PassArr.length; i++) {
            var pass = PassArr[i];
            var vsNode = this.getNode(pass, "VERTEX");
            var vs = vsNode.textContent;
            vs = vs.replace(/(\r)/g, "");
            var psNode = this.getNode(pass, "FRAGMENT");
            var ps = psNode.textContent;
            ps = ps.replace(/(\r)/g, "");
            if (i > 0) {
                var rs = sharedMaterial.getRenderState(0).clone();
                sharedMaterial._renderStates.push(rs);
            }
            var cullNode = this.getNode(pass, "cull");
            if (cullNode != null) {
                var cull = this.getAttributesValue(cullNode, "v");
                if (cull != null) {
                    sharedMaterial.getRenderState(i).cull = this.getV(cull);
                }
            }
            shader._addShaderPass(vs, ps);
        }
        sharedMaterial._shader = shader;
    };
    WmyShaderMsg.getV = function (obj, backType) {
        if (backType === void 0) { backType = "null"; }
        var tempNameArr, tempObj, tempV, ii;
        tempNameArr = obj.split(".");
        if (tempNameArr[0] === "Laya") {
            tempV = Laya;
        }
        else if (tempNameArr[0] === "laya") {
            tempV = laya;
        }
        for (ii = 1; ii < tempNameArr.length; ii++) {
            tempV = tempV[tempNameArr[ii]];
        }
        if (tempV != null) {
            return tempV;
        }
        else if (backType != "null") {
            if (backType == "int") {
                return parseInt(obj);
            }
            else {
                return obj;
            }
        }
        return null;
    };
    /**
     * Converts a string in the format "#rrggbb" or "rrggbb" to the corresponding
     * uint representation.
     *
     * @param color The color in string format.
     * @return The color in uint format.
     */
    WmyShaderMsg.colorStringToUint = function (color) {
        return Number("0x" + color.replace("#", ""));
    };
    WmyShaderMsg.getAttributesValue = function (node, key) {
        return key in node.attributes ? node["attributes"][key]["nodeValue"] : null;
    };
    WmyShaderMsg.getNode = function (xml, key) {
        var childNodes = xml.childNodes;
        var node = null;
        for (var i = 0; i < childNodes.length; i++) {
            var obj = childNodes[i];
            if (obj["nodeName"] == key) {
                node = obj;
                break;
            }
        }
        return node;
    };
    WmyShaderMsg.getNodeArr = function (xml, key) {
        var childNodes = xml.childNodes;
        var nodeArr = [];
        for (var i = 0; i < childNodes.length; i++) {
            var obj = childNodes[i];
            if (obj["nodeName"] == key) {
                nodeArr.push(obj);
            }
        }
        return nodeArr;
    };
    return WmyShaderMsg;
}());
//# sourceMappingURL=WmyShaderMsg.js.map