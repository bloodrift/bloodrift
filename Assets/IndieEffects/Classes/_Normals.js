#pragma strict

@script RequireComponent(IndieEffects)
import IndieEffects;

var shader : Shader;
static var Normals : Texture2D;
var tex : Texture2D;
private var NormCam : GameObject;
function Start () {
	Normals = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
}

function Update () {
	tex = Normals;
}

function OnPreCull () {
	if (!NormCam){
	NormCam = new GameObject("NormalCamera");
	NormCam.AddComponent("Camera");
	NormCam.camera.SetReplacementShader(shader,"");
	NormCam.camera.enabled = false;
	NormCam.camera.farClipPlane = camera.farClipPlane;
	NormCam.camera.backgroundColor = Color.blue;
	NormCam.camera.clearFlags = CameraClearFlags.SolidColor;
	NormCam.camera.depth = camera.depth-2;
	}
	NormCam.transform.position = transform.position;
	NormCam.transform.rotation = transform.rotation;
	NormCam.camera.Render();
	Normals.Resize(Screen.width,Screen.height,TextureFormat.RGB24,false);
	Normals.ReadPixels(Rect(0,0,Screen.width, Screen.height), 0, 0);
	Normals.Apply();
}