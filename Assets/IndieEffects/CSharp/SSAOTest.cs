using UnityEngine;
     
[RequireComponent (typeof(IndieEffects))]
[AddComponentMenu ("Indie Effects/SSAOTest")]
public class SSAOTest : MonoBehaviour
{
    public Texture2D mainTex;
    public Texture2D depthTex;
    public Texture2D randTex;

    private Material materialAO;
    public Shader shaderAO;

    public float strength = 1f;
    public float baseAmount = 0f;
    public float area = 0.035f;
    public float falloff = 0.01f;
    public float radius = 0.025f;

    private void Start () 
    {
        materialAO = new Material(shaderAO);
    }
     
    private void Update () 
    {
        mainTex = IndieEffects.renderTexture;
        depthTex = _Depth.DepthTex;
        materialAO.SetTexture("_MainTex", mainTex);
        materialAO.SetTexture("_DepthTextureSampler", depthTex);
        materialAO.SetTexture("_RandomTextureSampler", randTex);
        materialAO.SetFloat("_Strength", strength);
        materialAO.SetFloat("_Base", baseAmount);
        materialAO.SetFloat("_Area", area);
        materialAO.SetFloat("_Falloff", falloff);
        materialAO.SetFloat("_Radius", radius);
       
    }
     
    private void OnPostRender () 
    {
        IndieEffects.FullScreenQuadPass(materialAO,0);
        materialAO.SetTexture("_MainTex", mainTex);
        IndieEffects.FullScreenQuadPass(materialAO, 1);
    }
}