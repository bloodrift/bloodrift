using UnityEngine;
//using IndieEffects;

/*

				----------Negative----------
When i was playing around with the indie effects motion blur shader, i got 
this effect by accident. enjoy!
*/

[RequireComponent(typeof(IndieEffects))]
[AddComponentMenu ("Indie Effects/Negative")]
public class Negative : MonoBehaviour
{
    private Material ThermoMat;
    public Shader shader;
    public float noise;

    private void Start () 
    {
	    ThermoMat = new Material(shader);
    }

    private void Update()
    {
	    ThermoMat.SetFloat("_Noise", noise);
        ThermoMat.SetTexture("_MainTex", IndieEffects.renderTexture);
    }

    private void OnPostRender()
    {
        IndieEffects.FullScreenQuad(ThermoMat);
    }
}