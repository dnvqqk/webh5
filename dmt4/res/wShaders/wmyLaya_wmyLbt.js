/*wmy版本_2018/12/29/13.15*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wmy_shader = (function (_super) {
    __extends(wmy_shader, _super);
    function wmy_shader() {
        //shader名字
        this.shaderName='wmyLaya_wmyLbt';
        //
        _super.call(this);
        
        this._uniformMap={
			'_wColor':[1000],
			'_Specular':[1001],
			'_Gloss':[1002],
		};

        this.vspsArr=[];
        
//pass0-------------------------------------------------------------------
this.vspsArr[0]=[];
//vs
this.vspsArr[0][0]=`
uniform vec4 _wColor;
uniform mat4 _Object2World;
uniform vec4 _Specular;
uniform float _Gloss;

varying vec3 g_worldNormal;
varying vec3 g_worldViewDir;

void wmyMain(){

    g_worldNormal = v_Normal;
    g_worldNormal.x*=-1.0;
	g_worldViewDir = v_ViewDir;

}
`
//ps
this.vspsArr[0][1]=`
uniform vec4 _wColor;
uniform mat4 _Object2World;
uniform vec4 _Specular;
uniform float _Gloss;

varying vec3 g_worldNormal;
varying vec3 g_worldViewDir;

vec4 wmyMain(vec4 _mainColor, vec3 _globalDiffuse, vec3 _diffuse, float shadowValue){
    vec4 wmyColor=_mainColor;

	vec3 ambient =u_AmbientColor/2.0;
	vec3 lightDir = normalize(-u_DirectionLight.Direction.xyz);
	float halfLambert = dot(g_worldNormal, lightDir) * 0.5 + 1.0;
	vec3 diffuse = u_DirectionLight.Color.rgb * halfLambert *_wColor.rgb;
				
	vec3 color = diffuse;

	vec3 viewDir = normalize(g_worldViewDir);
	vec3 halfDir = normalize(viewDir + lightDir);
	vec3 specular = vec3(0.0);
	specular = _Specular.rgb * pow(max(dot(g_worldNormal, halfDir), 0.0), _Gloss);
	color += specular;

    color *= 1.5;
    color+=shadowValue*0.1;
	wmyColor = vec4(color, 1.0);

//
return wmyColor;
}
`
//渲染模式
this.vspsArr[0][2]={};
        
        _super.prototype.setUniformMap.call(this, this._uniformMap);
        for (let i = 0; i < this.vspsArr.length; i++) {
            const vsps = this.vspsArr[i];
            _super.prototype.setVsPs.call(this, vsps[0], vsps[1], vsps[2]);
        }
        _super.prototype.init.call(this);
    }
    return wmy_shader;
}(window['Base_WmyShader']));
new wmy_shader();
