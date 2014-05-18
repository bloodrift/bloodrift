using UnityEngine;

/* 
						---Fisheye Image Effect---
This Indie Effects script is an adaption of the Unity Pro Fisheye Effect done by me.
If you want me to attempt to convert a unity pro image effect, consult the manual for my
forum link and email address.
*/

[RequireComponent(typeof(Camera))]
[AddComponentMenu ("Indie Effects/Fisheye")]
public class FisheyeEffect : MonoBehaviour
{
    public float strengthX = 0.2f;
    public float strengthY = 0.2f;
    public Shader fishEyeShader;
    private Texture2D tex;
    private Material fisheyeMaterial;
    private const float ONE_OVER_BASE_SIZE = 80f / 512f;
	
    private void Start ()
    {
	    fisheyeMaterial = new Material(fishEyeShader);		
    }
	
    private void Update () 
    {
        fisheyeMaterial.mainTexture = IndieEffects.renderTexture;
    }

    private void OnPostRender() 
    {		
        float ar = (Screen.width * 1f) / (Screen.height * 1f);

        fisheyeMaterial.SetVector("intensity", new Vector4(strengthX * ar * ONE_OVER_BASE_SIZE, strengthY * ONE_OVER_BASE_SIZE, strengthX * ar * ONE_OVER_BASE_SIZE, strengthY * ONE_OVER_BASE_SIZE));
	    IndieEffects.FullScreenQuad(fisheyeMaterial);
    }
}