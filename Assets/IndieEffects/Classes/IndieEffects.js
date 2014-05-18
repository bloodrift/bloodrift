#pragma strict
/*
----------Indie Effects Base----------
This is the base for all other image effects to occur. this also incorporates motion blur as a
built-in feature for those who are impatient to see motion blur on unity free!
*/

@script RequireComponent(Camera);
@script AddComponentMenu("Indie Effects/IndieEffectsBase(with motion blur)");

//base effects
static var renderTexture : Texture2D;
//motionblur effects
private var BlurMat : Material;
var motionBlur : boolean;
var BlurShader : Shader;
var Accumulation : float = 0.65;

static function FullScreenQuad(renderMat : Material) {
	GL.PushMatrix();
	for (var i = 0; i < renderMat.passCount; ++i) {
		renderMat.SetPass(i);
		GL.LoadOrtho();
		GL.Begin(GL.QUADS); // Quad
		GL.Color(Color(1,1,1,1));
		GL.MultiTexCoord(0,Vector3(0,0,0));
		GL.Vertex3(0,0,0);
		GL.MultiTexCoord(0,Vector3(0,1,0));
		GL.Vertex3(0,1,0);
		GL.MultiTexCoord(0,Vector3(1,1,0));
		GL.Vertex3(1,1,0);
		GL.MultiTexCoord(0,Vector3(1,0,0));
		GL.Vertex3(1,0,0);
		GL.End();
	}
	GL.PopMatrix();
}

static function FullScreenQuadPass(renderMat : Material, pass : int){
	GL.PushMatrix();
	for (var i = 0; i < pass; ++i) {
		renderMat.SetPass(i);
		GL.LoadOrtho();
		GL.Begin(GL.QUADS); // Quad
		GL.Color(Color(1,1,1,1));
		GL.MultiTexCoord(0,Vector3(0,0,0));
		GL.Vertex3(0,0,0);
		GL.MultiTexCoord(0,Vector3(0,1,0));
		GL.Vertex3(0,1,0);
		GL.MultiTexCoord(0,Vector3(1,1,0));
		GL.Vertex3(1,1,0);
		GL.MultiTexCoord(0,Vector3(1,0,0));
		GL.Vertex3(1,0,0);
		GL.End();
	}
	GL.PopMatrix();
}

static function FullScreenQuadQueue(renderMat : Material, pass : int){
	GL.PushMatrix();
	for (var i = pass; i < renderMat.passCount; ++i) {
		renderMat.SetPass(i);
		GL.LoadOrtho();
		GL.Begin(GL.QUADS); // Quad
		GL.Color(Color(1,1,1,1));
		GL.MultiTexCoord(0,Vector3(0,0,0));
		GL.Vertex3(0,0,0);
		GL.MultiTexCoord(0,Vector3(0,1,0));
		GL.Vertex3(0,1,0);
		GL.MultiTexCoord(0,Vector3(1,1,0));
		GL.Vertex3(1,1,0);
		GL.MultiTexCoord(0,Vector3(1,0,0));
		GL.Vertex3(1,0,0);
		GL.End();
	}
	GL.PopMatrix();
}

function Start () {
	renderTexture = new Texture2D(camera.pixelWidth, camera.pixelHeight, TextureFormat.RGB24, false);
	BlurMat = new Material (BlurShader);
}

function Update () {
	BlurMat.SetTexture("_MainTex",renderTexture);
	BlurMat.SetFloat("_FrameAccumulation",Accumulation);
}

function OnPostRender() {
	//render motion blur if enabled
	if (motionBlur == true){
	FullScreenQuad(BlurMat);
	}
	//capture main texture
	renderTexture.Resize(camera.pixelWidth, camera.pixelHeight, TextureFormat.RGB24, false);
	renderTexture.ReadPixels(Rect(camera.pixelRect), 0, 0);
	renderTexture.Apply();
}