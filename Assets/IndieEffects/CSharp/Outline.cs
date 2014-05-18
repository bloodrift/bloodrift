using UnityEngine;

[RequireComponent(typeof(IndieEffects))]
[AddComponentMenu ("Indie Effects/Outline")]
public class Outline : MonoBehaviour
{
    //public IndieEffects indieEffects;
    public float treshold;
    private Material blurMat;
    public Shader outlineShader;

    private void Start () 
    {
        //indieEffects = transform.GetComponent("IndieEffects");
        blurMat = new Material(outlineShader);
    }

    private void Update()
    {
        blurMat.SetTexture("_MainTex", IndieEffects.renderTexture);
        blurMat.SetFloat("_Treshold", treshold);
    }

    private void OnPostRender()
    {
        IndieEffects.FullScreenQuad(blurMat);
    }
}