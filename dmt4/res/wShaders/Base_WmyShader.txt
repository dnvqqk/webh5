//wmy版本_2019/1/3/;
(function (window,document,Laya) {
var Base_WmyShader = (function () {
    function Base_WmyShader() {
        this.__attributeMap={
            'a_Position':/*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0,
            'a_Color':/*laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/1,
            'a_Normal':/*laya.d3.graphics.Vertex.VertexMesh.MESH_NORMAL0*/3,
            'a_Texcoord0':/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/2,
            'a_Texcoord1':/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE1*/8,
            'a_BoneWeights':/*laya.d3.graphics.Vertex.VertexMesh.MESH_BLENDWEIGHT0*/7,
            'a_BoneIndices':/*laya.d3.graphics.Vertex.VertexMesh.MESH_BLENDINDICES0*/6,
            'a_Tangent0':/*laya.d3.graphics.Vertex.VertexMesh.MESH_TANGENT0*/5,
            //var uniformMap:Object = {'u_MvpMatrix': [Sprite3D.MVPMATRIX, Shader3D.PERIOD_SPRITE], 'u_WorldMat': [Sprite3D.WORLDMATRIX, Shader3D.PERIOD_SPRITE]};
        };
        this.__uniformMap={
            'u_Bones':[ /*laya.d3.core.SkinnedMeshSprite3D.BONES*/0,/*laya.d3.shader.Shader3D.PERIOD_CUSTOM*/0],
            'u_DiffuseTexture':[ /*laya.d3.core.material.BlinnPhongMaterial.ALBEDOTEXTURE*/1,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_SpecularTexture':[ /*laya.d3.core.material.BlinnPhongMaterial.SPECULARTEXTURE*/3,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_NormalTexture':[ /*laya.d3.core.material.BlinnPhongMaterial.NORMALTEXTURE*/2,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_AlphaTestValue':[ /*laya.d3.core.material.BaseMaterial.ALPHATESTVALUE*/0,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_DiffuseColor':[ /*laya.d3.core.material.BlinnPhongMaterial.ALBEDOCOLOR*/5,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_MaterialSpecular':[ /*laya.d3.core.material.BlinnPhongMaterial.MATERIALSPECULAR*/6,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_Shininess':[ /*laya.d3.core.material.BlinnPhongMaterial.SHININESS*/7,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_TilingOffset':[ /*laya.d3.core.material.BlinnPhongMaterial.TILINGOFFSET*/8,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_WorldMat':[Laya.Sprite3D.WORLDMATRIX,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_MvpMatrix':[Laya.Sprite3D.MVPMATRIX,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_LightmapScaleOffset':[Laya.RenderableSprite3D.LIGHTMAPSCALEOFFSET,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_LightMap':[Laya.RenderableSprite3D.LIGHTMAP,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_CameraPos':[ /*laya.d3.core.BaseCamera.CAMERAPOS*/0,/*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3],
            'u_ReflectTexture':[ /*laya.d3.core.scene.Scene3D.REFLECTIONTEXTURE*/22,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_ReflectIntensity':[ /*laya.d3.core.scene.Scene3D.REFLETIONINTENSITY*/23,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogStart':[ /*laya.d3.core.scene.Scene3D.FOGSTART*/1,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogRange':[ /*laya.d3.core.scene.Scene3D.FOGRANGE*/2,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogColor':[ /*laya.d3.core.scene.Scene3D.FOGCOLOR*/0,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_DirectionLight.Color':[ /*laya.d3.core.scene.Scene3D.LIGHTDIRCOLOR*/4,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_DirectionLight.Direction':[ /*laya.d3.core.scene.Scene3D.LIGHTDIRECTION*/3,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_PointLight.Position':[ /*laya.d3.core.scene.Scene3D.POINTLIGHTPOS*/5,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_PointLight.Range':[ /*laya.d3.core.scene.Scene3D.POINTLIGHTRANGE*/6,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_PointLight.Color':[ /*laya.d3.core.scene.Scene3D.POINTLIGHTCOLOR*/8,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Position':[ /*laya.d3.core.scene.Scene3D.SPOTLIGHTPOS*/9,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Direction':[ /*laya.d3.core.scene.Scene3D.SPOTLIGHTDIRECTION*/10,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Range':[ /*laya.d3.core.scene.Scene3D.SPOTLIGHTRANGE*/12,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Spot':[ /*laya.d3.core.scene.Scene3D.SPOTLIGHTSPOTANGLE*/11,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Color':[ /*laya.d3.core.scene.Scene3D.SPOTLIGHTCOLOR*/14,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_AmbientColor':[ /*laya.d3.core.scene.Scene3D.AMBIENTCOLOR*/21,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowMap1':[ /*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE1*/18,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowMap2':[ /*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE2*/19,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowMap3':[ /*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE3*/20,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowPSSMDistance':[ /*laya.d3.core.scene.Scene3D.SHADOWDISTANCE*/15,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_lightShadowVP':[ /*laya.d3.core.scene.Scene3D.SHADOWLIGHTVIEWPROJECT*/16,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowPCFoffset':[ /*laya.d3.core.scene.Scene3D.SHADOWMAPPCFOFFSET*/17,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_Time':[ /*laya.d3.core.scene.Scene3D.TIME*/24,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_PMatrix':[2, 3],
            'u_VMatrix':[1, 3],
        };

        this._vsPsArr = [];
        Laya.Shader3D['wmyInit']=true;

        var _shaderName=this.shaderName;
        var spriteDefines=Laya.SkinnedMeshSprite3D.shaderDefines;
        var materialDefines=Laya.BlinnPhongMaterial.shaderDefines;
        this._shader=Laya.Shader3D.add(_shaderName,this.__attributeMap,this.__uniformMap,spriteDefines,materialDefines);
        // setTimeout(this.init,20,this);
    }

    Base_WmyShader.prototype.init = function () {
        this._shader['w_vsPsArr']=this._vsPsArr;
        for (var key in this._vsPsArr) {
            if (this._vsPsArr.hasOwnProperty(key)) {
                var vsps=this._vsPsArr[key];
                this._shader.addShaderPass(vsps[0],vsps[1]);
            }
        }
    }
    
    Base_WmyShader.prototype.setAttributeMap = function (attributeMap) {
        if (attributeMap != null) {
            for (var key in attributeMap) {
                if (attributeMap.hasOwnProperty(key)) {
                    this.__attributeMap[key] = attributeMap[key];
                }
            }
        }
    };
    
    Base_WmyShader.prototype.setUniformMap = function (uniformMap) {
        this._shader['w_uniformMap']=uniformMap;
        if (uniformMap != null) {
            for (var key in uniformMap) {
                if (uniformMap.hasOwnProperty(key)) {
                    uniformMap[key][1]=Laya.Shader3D.PERIOD_MATERIAL;
                    this.__uniformMap[key] = uniformMap[key];
                }
            }
        }
    };

    Base_WmyShader.prototype.setVsPs = function (vs,ps,renderData) {
        if (vs != null && ps!=null) {
            vs=this._setVs(vs);
            ps=this._setPs(ps);
            if(renderData==null){
                renderData={};
            }
            this._vsPsArr.push([vs,ps,renderData]);
        }
    };

    Base_WmyShader.prototype._setVs = function (vs) {
        if(vs==null)return '';
        if(vs.indexOf('wmyMain(')<0)return vs;
        var _Vs=`
#include 'Lighting.glsl';

attribute vec4 a_Position;
uniform mat4 u_MvpMatrix;

attribute vec2 a_Texcoord0;
#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))||(defined(LIGHTMAP)&&defined(UV))
    varying vec2 v_Texcoord0;
#endif

#if defined(LIGHTMAP)&&defined(UV1)
    attribute vec2 a_Texcoord1;
#endif

#ifdef LIGHTMAP
    uniform vec4 u_LightmapScaleOffset;
    varying vec2 v_LightMapUV;
#endif

#ifdef COLOR
    attribute vec4 a_Color;
    varying vec4 v_Color;
#endif

#ifdef BONE
    const int c_MaxBoneCount = 24;
    attribute vec4 a_BoneIndices;
    attribute vec4 a_BoneWeights;
    uniform mat4 u_Bones[c_MaxBoneCount];
#endif

attribute vec3 a_Normal;
varying vec3 v_Normal; 
uniform vec3 u_CameraPos;
varying vec3 v_ViewDir; 
attribute vec4 a_Tangent0;
varying mat3 worldInvMat;
varying vec3 v_Position;

varying vec3 v_Tangent;
varying vec3 v_Binormal;

uniform mat4 u_WorldMat;
varying vec3 v_PositionWorld;

varying float v_posViewZ;
#ifdef RECEIVESHADOW
    #ifdef SHADOWMAP_PSSM1 
    varying vec4 v_lightMVPPos;
    uniform mat4 u_lightShadowVP[4];
    #endif
#endif

#ifdef TILINGOFFSET
    uniform vec4 u_TilingOffset;
#endif

void main_castShadow()
{
    #ifdef BONE
        mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
        vec4 position=skinTransform*a_Position;
        v_Position=position.xyz;
        gl_Position = u_MvpMatrix * position;
    #else
        v_Position=a_Position.xyz;
        gl_Position = u_MvpMatrix * a_Position;
    #endif
        
    //TODO没考虑UV动画呢
    #if defined(DIFFUSEMAP)&&defined(ALPHATEST)
        v_Texcoord0=a_Texcoord0;
    #endif
        v_posViewZ = gl_Position.z;
}

mat3 inverse(mat3 m) {
    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

    float b01 = a22 * a11 - a12 * a21;
    float b11 = -a22 * a10 + a12 * a20;
    float b21 = a21 * a10 - a11 * a20;

    float det = a00 * b01 + a01 * b11 + a02 * b21;

    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

void main_normal()
{
    #ifdef BONE
        mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
        vec4 position=skinTransform*a_Position;
        v_Position=position.xyz;
        gl_Position = u_MvpMatrix * position;
    #else
        v_Position=a_Position.xyz;
        gl_Position = u_MvpMatrix * a_Position;
    #endif

    #ifdef BONE
        worldInvMat=inverse(mat3(u_WorldMat*skinTransform));
    #else
        worldInvMat=inverse(mat3(u_WorldMat));
    #endif  
    v_Normal=a_Normal*worldInvMat;

    v_Tangent=a_Tangent0.xyz*worldInvMat;
    v_Binormal=cross(v_Normal,v_Tangent)*a_Tangent0.w;

    #ifdef BONE
        v_PositionWorld=(u_WorldMat*position).xyz;
    #else
        v_PositionWorld=(u_WorldMat*a_Position).xyz;
    #endif
    
    v_ViewDir=u_CameraPos-v_PositionWorld;

    #if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))
        v_Texcoord0=a_Texcoord0;
        #ifdef TILINGOFFSET
            v_Texcoord0=TransformUV(v_Texcoord0,u_TilingOffset);
        #endif
    #endif

    #ifdef LIGHTMAP
        #ifdef SCALEOFFSETLIGHTINGMAPUV
            #ifdef UV1
                v_LightMapUV=vec2(a_Texcoord1.x,1.0-a_Texcoord1.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;
            #else
                v_LightMapUV=vec2(a_Texcoord0.x,1.0-a_Texcoord0.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;
            #endif 
            v_LightMapUV.y=1.0-v_LightMapUV.y;
        #else
            #ifdef UV1
                v_LightMapUV=a_Texcoord1;
            #else
                v_LightMapUV=a_Texcoord0;
            #endif 
        #endif 
    #endif

    #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
        v_Color=a_Color;
    #endif

    #ifdef RECEIVESHADOW
        v_posViewZ = gl_Position.w;
        #ifdef SHADOWMAP_PSSM1 
            v_lightMVPPos = u_lightShadowVP[0] * vec4(v_PositionWorld,1.0);
        #endif
    #endif
}

//--wmy-main-----------------
mat3 MATRIX_IT_MV(mat4 ModelViewMatrix) {
    return inverse(mat3(ModelViewMatrix));
}
mat3 getRotation(vec4 wTangent, vec3 wNormal) {
    vec3 binormal = cross(wNormal.xyz, wTangent.xyz) * -wTangent.w;
    mat3 rotation = mat3(
        wTangent.x, binormal.x, wNormal.x,
        wTangent.y, binormal.y, wNormal.y,
        wTangent.z, binormal.z, wNormal.z);
    return rotation;
}
${vs}
//--wmy----------------------

void main()
{
    #ifdef CASTSHADOW
        main_castShadow();
    #else
        main_normal();
        wmyMain();
    #endif
}        
        `;
        return _Vs;
    }


    Base_WmyShader.prototype._setPs = function (ps) {
        if(ps==null)return '';
        if(ps.indexOf('wmyMain(')<0)return ps;
        var _Ps=`
#ifdef HIGHPRECISION
precision highp float;
#else
precision mediump float;
#endif

#include 'Lighting.glsl';

uniform vec4 u_DiffuseColor;

#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
    varying vec4 v_Color;
#endif

varying vec3 v_ViewDir; 

#ifdef ALPHATEST
    uniform float u_AlphaTestValue;
#endif

#ifdef DIFFUSEMAP
    uniform sampler2D u_DiffuseTexture;
#endif

#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))
    varying vec2 v_Texcoord0;
#endif

#ifdef LIGHTMAP
    varying vec2 v_LightMapUV;
    uniform sampler2D u_LightMap;
#endif

#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
    uniform vec3 u_MaterialSpecular;
    uniform float u_Shininess;
    #ifdef SPECULARMAP 
        uniform sampler2D u_SpecularTexture;
    #endif
#endif

#ifdef FOG
    uniform float u_FogStart;
    uniform float u_FogRange;
    uniform vec3 u_FogColor;
#endif

varying vec3 v_Normal;
varying vec3 v_Position;

uniform sampler2D u_NormalTexture;
varying vec3 v_Tangent;
varying vec3 v_Binormal;

#ifdef DIRECTIONLIGHT
    uniform DirectionLight u_DirectionLight;
#endif

#ifdef POINTLIGHT
    uniform PointLight u_PointLight;
#endif

#ifdef SPOTLIGHT
    uniform SpotLight u_SpotLight;
#endif

uniform vec3 u_AmbientColor;


#if defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(RECEIVESHADOW)
    varying vec3 v_PositionWorld;
#endif

#include 'ShadowHelper.glsl'
varying float v_posViewZ;
#ifdef RECEIVESHADOW
    #if defined(SHADOWMAP_PSSM2)||defined(SHADOWMAP_PSSM3)
        uniform mat4 u_lightShadowVP[4];
    #endif
    #ifdef SHADOWMAP_PSSM1 
        varying vec4 v_lightMVPPos;
    #endif
#endif

void main_castShadow()
{
    //gl_FragColor=vec4(v_posViewZ,0.0,0.0,1.0);
    gl_FragColor=packDepth(v_posViewZ);
    #if defined(DIFFUSEMAP)&&defined(ALPHATEST)
        float alpha = texture2D(u_DiffuseTexture,v_Texcoord0).w;
        if( alpha < u_AlphaTestValue )
        {
            discard;
        }
    #endif
}

//--wmy-main-----------------
vec4 lerpV4(vec4 a, vec4 b, float s) { return vec4(a + (b - a)*s); }
vec3 lerpV3(vec3 a, vec3 b, float s) { return vec3(a + (b - a)*s); }
vec2 lerpV2(vec2 a, vec2 b, float s) { return vec2(a + (b - a)*s); }
float lerpF(float a, float b, float s) { return float(a + (b - a) * s); }
float saturate(float n) { return clamp(n, 0.0, 1.0); }
vec3 UnpackNormal(vec4 packednormal) {
	// This do the trick
	packednormal.x *= packednormal.w;
	vec3 normal;
	normal.xy = packednormal.xy * 2.0 - 1.0;
	normal.z = sqrt(1.0 - saturate(dot(normal.xy, normal.xy)));
	return normal;
}
${ps}
//--wmy----------------------

void main_normal()
{
	vec3 globalDiffuse=u_AmbientColor;
	#ifdef LIGHTMAP	
		globalDiffuse += DecodeLightmap(texture2D(u_LightMap, v_LightMapUV));
	#endif
	
	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
		vec3 normal;
		#if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&defined(NORMALMAP)
			vec3 normalMapSample = texture2D(u_NormalTexture, v_Texcoord0).rgb;
			normal = normalize(NormalSampleToWorldSpace(normalMapSample, v_Normal, v_Tangent,v_Binormal));
		#else
			normal = normalize(v_Normal);
		#endif
		vec3 viewDir= normalize(v_ViewDir);
	#endif
	
	vec4 mainColor=u_DiffuseColor;
	#ifdef DIFFUSEMAP
		vec4 difTexColor=texture2D(u_DiffuseTexture, v_Texcoord0);
		mainColor=mainColor*difTexColor;
	#endif 
	#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
		mainColor=mainColor*v_Color;
	#endif 
    
	#ifdef ALPHATEST
		if(mainColor.a<u_AlphaTestValue)
			discard;
	#endif
  
	vec3 diffuse = vec3(0.0);
	vec3 specular= vec3(0.0);
	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
		vec3 dif,spe;
		#ifdef SPECULARMAP
			vec3 gloss=texture2D(u_SpecularTexture, v_Texcoord0).rgb;
		#else
			#ifdef DIFFUSEMAP
				vec3 gloss=vec3(difTexColor.a);
			#else
				vec3 gloss=vec3(1.0);
			#endif
		#endif
	#endif

	#ifdef DIRECTIONLIGHT
		LayaAirBlinnPhongDiectionLight(u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_DirectionLight,dif,spe);
		diffuse+=dif;
		specular+=spe;
	#endif
 
	#ifdef POINTLIGHT
		LayaAirBlinnPhongPointLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_PointLight,dif,spe);
		diffuse+=dif;
		specular+=spe;
	#endif

	#ifdef SPOTLIGHT
		LayaAirBlinnPhongSpotLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_SpotLight,dif,spe);
		diffuse+=dif;
		specular+=spe;
	#endif
	
	#ifdef RECEIVESHADOW
		float shadowValue = 1.0;
		#ifdef SHADOWMAP_PSSM3
			shadowValue = getShadowPSSM3( u_shadowMap1,u_shadowMap2,u_shadowMap3,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);
		#endif
		#ifdef SHADOWMAP_PSSM2
			shadowValue = getShadowPSSM2( u_shadowMap1,u_shadowMap2,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);
		#endif 
		#ifdef SHADOWMAP_PSSM1
			shadowValue = getShadowPSSM1( u_shadowMap1,v_lightMVPPos,u_shadowPSSMDistance,u_shadowPCFoffset,v_posViewZ,0.001);
		#endif
		//gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse)*shadowValue,mainColor.a);
		//gl_FragColor = wmyMain(mainColor,(globalDiffuse + diffuse * shadowValue * 1.1));
        gl_FragColor = wmyMain(mainColor,globalDiffuse,diffuse,shadowValue);
	#else
		//gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse),mainColor.a);
		gl_FragColor = wmyMain(mainColor,globalDiffuse,diffuse,1.0);
	#endif
    /*
	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
		#ifdef RECEIVESHADOW
			gl_FragColor.rgb+=specular*shadowValue;
		#else
			gl_FragColor.rgb+=specular;
		#endif
	#endif
	*/
	#ifdef FOG
		float lerpFact=clamp((1.0/gl_FragCoord.w-u_FogStart)/u_FogRange,0.0,1.0);
		gl_FragColor.rgb=mix(gl_FragColor.rgb,u_FogColor,lerpFact);
	#endif
}

void main()
{
	#ifdef CASTSHADOW		
		main_castShadow();
	#else
		main_normal();
	#endif  
}
        `;
        
        return _Ps;
    }

    return Base_WmyShader;
}());

window['Base_WmyShader']=Base_WmyShader;
})(window,document,Laya)
