using UnityEngine;
//using IndieEffects;

[RequireComponent(typeof(Camera))]
[AddComponentMenu("Indie Effects/Vignette")]
public class VignetteBlur : MonoBehaviour
{
    private Material sampleMat;
    public Shader shader;
    public Texture2D Vignette;

    private void RadialBlurQuad1 (Material renderMat) 
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i) 
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1f,1f,1f,1f));
		    GL.MultiTexCoord(0,new Vector3(0f,0f,0f));
		    GL.Vertex3(-0.01f,-0.01f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.01f,1.01f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.01f,1.01f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.01f,-0.01f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    private void RadialBlurQuad2 (Material renderMat) 
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i) 
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1f,1f,1f,1f));
		    GL.MultiTexCoord(0,new Vector3(0f,0f,0f));
		    GL.Vertex3(-0.02f,-0.02f,0);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.02f,1.02f,0);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.02f,1.02f,0);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.02f,-0.02f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    private void RadialBlurQuad3 (Material renderMat) 
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i) 
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1f,1f,1f,1f));
		    GL.MultiTexCoord(0,new Vector3(0f,0f,0f));
		    GL.Vertex3(-0.04f,-0.04f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.04f,1.04f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.04f,1.04f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.04f,-0.04f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    private void RadialBlurQuad4 (Material renderMat) 
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i) 
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1f,1f,1f,1f));
		    GL.MultiTexCoord(0,new Vector3(0f,0f,0f));
		    GL.Vertex3(-0.06f,-0.06f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.06f,1.06f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.06f,1.06f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.06f,-0.06f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    private void RadialBlurQuad5 (Material renderMat) 
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i)
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1f,1f,1f,1f));
		    GL.MultiTexCoord(0,new Vector3(0f,0f,0f));
		    GL.Vertex3(-0.08f,-0.08f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.08f,1.08f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.08f,1.08f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.08f,-0.08f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    private void RadialBlurQuad6 (Material renderMat) 
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i) 
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1f,1f,1f,1f));
		    GL.MultiTexCoord(0,new Vector3(0f,0f,0f));
		    GL.Vertex3(-0.1f,-0.1f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.1f,1.1f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.1f,1.1f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.1f,-0.1f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }


    private void Start () 
    {
	    sampleMat = new Material(shader);
    }

    private void Update () 
    {
	    sampleMat.SetTexture("_MainTex", IndieEffects.renderTexture);
        sampleMat.SetTexture("_Vignette", Vignette);
    }

    private void OnPostRender ()
    {
        IndieEffects.FullScreenQuad(sampleMat);
	    RadialBlurQuad1(sampleMat);
	    RadialBlurQuad2(sampleMat);
	    RadialBlurQuad3(sampleMat);
	    RadialBlurQuad4(sampleMat);
	    RadialBlurQuad5(sampleMat);
	    RadialBlurQuad6(sampleMat);
    }
}