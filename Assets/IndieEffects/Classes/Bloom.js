#pragma strict

@script RequireComponent (IndieEffects)
@script AddComponentMenu ("Indie Effects/Bloom")
import IndieEffects;

private var bloomMat : Material;
var bloomShader : Shader;
@range(0,1)
var amount : float;

function Start () {
	bloomMat = new Material(bloomShader);
}

function Update () {
	bloomMat.SetTexture("_MainTex", renderTexture);
	bloomMat.SetTexture("_BlurTex", renderTexture);
	bloomMat.SetFloat("_Amount", amount);
}

function OnPostRender () {
	FullScreenQuad(bloomMat);
}