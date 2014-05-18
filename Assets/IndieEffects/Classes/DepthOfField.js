#pragma strict

@script RequireComponent(IndieEffects)
@script RequireComponent(_Depth)
@script AddComponentMenu("Indie Effects/Depth of Field")
import IndieEffects;
import _Depth;

var shader : Shader;
var texmonitor : Texture2D;
private var DOFMat : Material;
@range (0,20)
var FStop : float;
@range (0,5)
var BlurAmount : float;


function Start () {
	DOFMat = new Material(shader);
}

function Update () {
	DOFMat.SetTexture("_MainTex",renderTexture);
	DOFMat.SetTexture("_Depth",DepthTex);
	DOFMat.SetFloat ("_FStop", FStop/10);
	DOFMat.SetFloat ("_Amount", BlurAmount);
}

function OnPostRender () {
	FullScreenQuad(DOFMat);
	texmonitor = DepthTex;
}