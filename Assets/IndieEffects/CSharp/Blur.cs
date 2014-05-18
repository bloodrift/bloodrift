using UnityEngine;
//using IndieEffects;

[RequireComponent(typeof(IndieEffects))]
[AddComponentMenu ("Indie Effects/Blur")]
public class Blur : MonoBehaviour
{
    private Material blurMat;
    public Shader blurShader;
    [Range(0f,5f)]
    public float blur;

    private void Start () 
    {
	    blurMat = new Material(blurShader);
    }

    private void Update()
    {
        blurMat.SetTexture("_MainTex", IndieEffects.renderTexture);
	    blurMat.SetFloat("_Threshold", 0f);
	    blurMat.SetFloat("_Amount", blur);
    }

    private void OnPostRender()
    {
        IndieEffects.FullScreenQuad(blurMat);
    }
}