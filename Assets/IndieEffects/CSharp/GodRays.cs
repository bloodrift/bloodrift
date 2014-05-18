using UnityEngine;

[RequireComponent(typeof(Camera))]
[AddComponentMenu("Indie Effects/Radial Blur & GodRays")]
public class GodRays : MonoBehaviour
{
    private Material sampleMat;

    public Shader GodRaysShader;
    public Shader RadialBlurShader;
    public float BlurAmount;

    public enum BlurMode {
	    GodRays = 0,
	    Radialblur = 1,
    }

    public BlurMode blurMode = 0;
    public float GodRaysIntensity = .3f;

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
		    GL.Vertex3(-0.03f,-0.03f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.03f,1.03f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.03f,1.03f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.03f,-0.03f,0f);
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
		    GL.Vertex3(-0.05f,-0.05f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.05f,1.05f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.05f,1.05f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.05f,-0.05f,0f);
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
		    GL.Vertex3(-0.07f,-0.07f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.07f,1.07f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.07f,1.07f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.07f,-0.07f,0f);
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
		    GL.Vertex3(-0.09f,-0.09f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.09f,1.09f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.09f,1.09f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.09f,-0.09f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }

    private void RadialBlurQuad6(Material renderMat)
    {
	    GL.PushMatrix();
	    for (var i = 0; i < renderMat.passCount; ++i) 
        {
		    renderMat.SetPass(i);
		    GL.LoadOrtho();
		    GL.Begin(GL.QUADS); // Quad
		    GL.Color(new Color(1f,1f,1f,1f));
		    GL.MultiTexCoord(0,new Vector3(0f,0f,0f));
		    GL.Vertex3(-0.12f,-0.12f,0f);
		    GL.MultiTexCoord(0,new Vector3(0f,1f,0f));
		    GL.Vertex3(-0.12f,1.12f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,1f,0f));
		    GL.Vertex3(1.12f,1.12f,0f);
		    GL.MultiTexCoord(0,new Vector3(1f,0f,0f));
		    GL.Vertex3(1.12f,-0.12f,0f);
		    GL.End();
	    }
	    GL.PopMatrix();
    }


    private void Start () 
    {
        if (blurMode == BlurMode.GodRays)
	        sampleMat = new Material(GodRaysShader);
        if (blurMode == BlurMode.Radialblur)
	        sampleMat = new Material(RadialBlurShader);
    }

    private void Update () 
    {
	    sampleMat.mainTexture = IndieEffects.renderTexture;
        if (blurMode == BlurMode.GodRays)
		    sampleMat.SetFloat("_Intensity",GodRaysIntensity);
        if (blurMode == BlurMode.Radialblur)
		    sampleMat.SetFloat("_Blur",BlurAmount);
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