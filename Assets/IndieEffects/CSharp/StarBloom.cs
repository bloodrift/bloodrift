using UnityEngine;

/*
This script is intended for use with Fuzzy Quill's True Motion Blur for Unity free script.

-Adam T. Ryder
http://1337atr.weebly.com
*/

[RequireComponent (typeof(IndieEffects))]
public class StarBloom : MonoBehaviour
{
    private Material mat;
    public Shader shader;
    public float offset = 1f;
    public float threshold = 0.8f;
    public float amount = 1f;
    public float radius = 7f;

    public Texture2D tex;

    private void Start () 
    {
	    mat = new Material(shader);
	    mat.SetFloat("_Threshold", Mathf.Clamp(threshold, 0f, 1f));
	    if (radius <= 0f) { radius = 1f; }
	
	    tex = new Texture2D (Screen.width, Screen.height, TextureFormat.RGB24, false);
    }

    private void Update () 
    {
	    mat.SetTexture("_MainTex", IndieEffects.renderTexture);
	    mat.SetTexture("_BlurTex", tex);
    }

    private void OnPostRender () 
    {
	    tex.ReadPixels(new Rect(0,0,Screen.width,Screen.height),0,0);
	    tex.Apply();
	    float tmpOffset = Mathf.Clamp(offset, 0.0f, 10.0f);
	    mat.SetFloat("_OffsetScale", tmpOffset);

        float tmpAmount = Mathf.Clamp(amount, 0.0f, 10.0f);
	    mat.SetFloat("_Amount", tmpAmount);
	
	    IndieEffects.FullScreenQuad(mat);	
    }
}