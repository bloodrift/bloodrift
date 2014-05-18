/*
This script is intended for use with Fuzzy Quill's True Motion Blur for Unity free script.

-Adam T. Ryder
http://1337atr.weebly.com
*/

@script RequireComponent (IndieEffects)
import IndieEffects;

private var mat : Material;
var shader : Shader;
var offset : float = 1.0;
var threshold : float = 0.8;
var amount : float = 1.0;
var radius : float = 7;

var tex : Texture2D;

function Start () {
	mat = new Material(shader);
	mat.SetFloat("_Threshold", Mathf.Clamp(threshold, 0.0f, 1.0f));
	if (radius <= 0) { radius = 1; }
	
	tex = new Texture2D (Screen.width, Screen.height, TextureFormat.RGB24, false);
}

function Update () {
	mat.SetTexture("_MainTex", renderTexture);
	mat.SetTexture("_BlurTex", tex);
}

function OnPostRender () {
	tex.ReadPixels(new Rect(0,0,Screen.width,Screen.height),0,0);
	tex.Apply();
	var tmpOffset : float = Mathf.Clamp(offset, 0.0f, 10.0f);
	mat.SetFloat("_OffsetScale", tmpOffset);
	
	var tmpAmount : float = Mathf.Clamp(amount, 0.0f, 10.0f);
	mat.SetFloat("_Amount", tmpAmount);
	
	FullScreenQuad(mat);
	
}