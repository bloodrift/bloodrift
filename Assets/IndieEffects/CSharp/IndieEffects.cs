using UnityEngine;

/*
----------Indie Effects Base----------
This is the base for all other image effects to occur. this also incorporates motion blur as a
built-in feature for those who are impatient to see motion blur on unity free!
*/

[RequireComponent(typeof(Camera))]
[AddComponentMenu("Indie Effects/base(with motion blur)")]
public class IndieEffects : MonoBehaviour
{
    //base effects
    public static Texture2D renderTexture;

    //motionblur effects
    private Material BlurMat;
    public bool motionBlur;
    public Shader BlurShader;
    public float Accumulation = .65f;

    public static void FullScreenQuad(Material renderMat)
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i) 
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1,1,1,1));
            GL.MultiTexCoord(0, new Vector3(0, 0, 0));
		    GL.Vertex3(0,0,0);
            GL.MultiTexCoord(0, new Vector3(0, 1, 0));
		    GL.Vertex3(0,1,0);
            GL.MultiTexCoord(0, new Vector3(1, 1, 0));
		    GL.Vertex3(1,1,0);
            GL.MultiTexCoord(0, new Vector3(1, 0, 0));
		    GL.Vertex3(1,0,0);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    public static void FullScreenQuadPass(Material renderMat, int pass)
    {
	    GL.PushMatrix();
	    for (var i = 0; i < pass; ++i)
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1,1,1,1));
            GL.MultiTexCoord(0, new Vector3(0, 0, 0));
		    GL.Vertex3(0,0,0);
            GL.MultiTexCoord(0, new Vector3(0, 1, 0));
		    GL.Vertex3(0,1,0);
            GL.MultiTexCoord(0, new Vector3(1, 1, 0));
		    GL.Vertex3(1,1,0);
            GL.MultiTexCoord(0, new Vector3(1, 0, 0));
		    GL.Vertex3(1,0,0);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    public static void FullScreenQuadQueue(Material renderMat, int pass)
    {
	    GL.PushMatrix();
	    for (var i = pass; i < renderMat.passCount; ++i) 
        {
            renderMat.SetPass(i);
            GL.LoadOrtho();
            GL.Begin(GL.QUADS); // Quad
            GL.Color(new Color(1, 1, 1, 1));
            GL.MultiTexCoord(0, new Vector3(0, 0, 0));
            GL.Vertex3(0, 0, 0);
            GL.MultiTexCoord(0, new Vector3(0, 1, 0));
            GL.Vertex3(0, 1, 0);
            GL.MultiTexCoord(0, new Vector3(1, 1, 0));
            GL.Vertex3(1, 1, 0);
            GL.MultiTexCoord(0, new Vector3(1, 0, 0));
            GL.Vertex3(1, 0, 0);
            GL.End();
	    }
	    GL.PopMatrix();
    }

    private void Start () 
    {
	    renderTexture = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
	    BlurMat = new Material (BlurShader);
    }

    private void Update()
    {
	    BlurMat.SetTexture("_MainTex", renderTexture);
	    BlurMat.SetFloat("_FrameAccumulation", Accumulation);
    }

    private void OnPostRender()
    {
	    //render motion blur if enabled
	    if (motionBlur == true){
	        FullScreenQuad(BlurMat);
	    }
	    //capture main texture
	    renderTexture.Resize(Screen.width, Screen.height, TextureFormat.RGB24, false);
	    renderTexture.ReadPixels(new Rect(0,0,Screen.width,Screen.height), 0, 0);
        renderTexture.Apply();
    }
}