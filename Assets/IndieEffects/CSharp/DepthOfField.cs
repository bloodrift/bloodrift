using UnityEngine;
//using IndieEffects;
//using IndieEffects_Depth;

[RequireComponent(typeof(IndieEffects))]
[RequireComponent(typeof(_Depth))]
[AddComponentMenu("Indie Effects/Depth of Field")]
public class DepthOfField : MonoBehaviour
{
    public Shader shader;
    public Texture2D texmonitor;
    private Material DOFMat;
    [Range (0f,20f)]
    public float FStop;
    [Range (0f,5f)]
    public float BlurAmount;

    private void Start () 
    {
	    DOFMat = new Material(shader);
    }

    private void Update () 
    {
        DOFMat.SetTexture("_MainTex", IndieEffects.renderTexture);
        DOFMat.SetTexture("_Depth", _Depth.DepthTex);
	    DOFMat.SetFloat ("_FStop", FStop/10);
	    DOFMat.SetFloat ("_Amount", BlurAmount);
    }

    private void OnPostRender()
    {
        IndieEffects.FullScreenQuad(DOFMat);
        texmonitor = _Depth.DepthTex;
    }
}