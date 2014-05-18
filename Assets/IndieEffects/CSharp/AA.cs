using UnityEngine;

/*
---------- Anti-Aliasing Indie Effects----------

This is an adaption of Unity Pro's AA Script, done by TheBlur (me)

*/

[RequireComponent(typeof(Camera))]
[AddComponentMenu ("Indie Effects/Anti-Aliasing")]
public class AA : MonoBehaviour
{
    public enum AAMode
    {
        FXAA2 = 0,
        FXAA3Console = 1,
        FXAA1PresetA = 2,
        FXAA1PresetB = 3,
        NFAA = 4,
        SSAA = 5,
        DLAA = 6,
    }

	public AAMode mode = AAMode.FXAA3Console;

	public bool showGeneratedNormals = false;
	public float offsetScale = .2f;
	public float blurRadius = 18f;

	public float edgeThresholdMin = 0.05f;
	public float edgeThreshold = 0.2f;
	public float edgeSharpness  = 4.0f;
		
	public bool dlaaSharp = false;

	public Shader ssaaShader;
	private Material ssaa;
	public Shader dlaaShader;
	private Material dlaa;
	public Shader nfaaShader;
	private Material nfaa;	
	public Shader shaderFXAAPreset2;
	private Material materialFXAAPreset2;
	public Shader shaderFXAAPreset3;
	private Material materialFXAAPreset3;
	public Shader shaderFXAAII;
	private Material materialFXAAII;
	public Shader shaderFXAAIII;
	private Material materialFXAAIII;
		
	Material CurrentAAMaterial ()
	{
        Material returnValue = null;

		switch(mode) {
			case AAMode.FXAA3Console:
				returnValue = materialFXAAIII;
				break;
			case AAMode.FXAA2:
				returnValue = materialFXAAII;
				break;
			case AAMode.FXAA1PresetA:
				returnValue = materialFXAAPreset2;
				break;
			case AAMode.FXAA1PresetB:
				returnValue = materialFXAAPreset3;
				break;
			case AAMode.NFAA:
				returnValue = nfaa;
				break;
			case AAMode.SSAA:
				returnValue = ssaa;
				break;
			case AAMode.DLAA:
				returnValue = dlaa;
				break;	
			default:
				returnValue = null;
				break;
			}
			
		return returnValue;
	}

	private void Start () 
    {			
		materialFXAAPreset2 = new Material (shaderFXAAPreset2);
		materialFXAAPreset3 = new Material (shaderFXAAPreset3);
		materialFXAAII = new Material (shaderFXAAII);
		materialFXAAIII = new Material (shaderFXAAIII);
		nfaa = new Material (nfaaShader);
		ssaa = new Material (ssaaShader); 
		dlaa = new Material (dlaaShader); 	            
	}

    private void Update()
    {
	    materialFXAAPreset2.mainTexture = IndieEffects.renderTexture;
	    materialFXAAPreset3.mainTexture = IndieEffects.renderTexture;
	    materialFXAAII.mainTexture = IndieEffects.renderTexture;
	    materialFXAAIII.mainTexture = IndieEffects.renderTexture;
	    nfaa.mainTexture = IndieEffects.renderTexture;
	    ssaa.mainTexture = IndieEffects.renderTexture;
	    dlaa.mainTexture = IndieEffects.renderTexture;
	}
	
    private void OnPostRender()
    {
 		// .............................................................................
		// FXAA antialiasing modes .....................................................
		
		if (mode == AAMode.FXAA3Console && (materialFXAAIII != null)) {
			materialFXAAIII.SetFloat("_EdgeThresholdMin", edgeThresholdMin);
			materialFXAAIII.SetFloat("_EdgeThreshold", edgeThreshold);
			materialFXAAIII.SetFloat("_EdgeSharpness", edgeSharpness);		
		
            IndieEffects.FullScreenQuad(materialFXAAIII);
        }        
		else if (mode == AAMode.FXAA1PresetB && (materialFXAAPreset3 != null)) {
            IndieEffects.FullScreenQuad(materialFXAAPreset3);
        }
        else if(mode == AAMode.FXAA1PresetA && materialFXAAPreset2 != null) {
            IndieEffects.renderTexture.anisoLevel = 4;
            IndieEffects.FullScreenQuad(materialFXAAPreset2);
            IndieEffects.renderTexture.anisoLevel = 0;
        }
        else if(mode == AAMode.FXAA2 && materialFXAAII != null) {
            IndieEffects.FullScreenQuad(materialFXAAII);
        }
		else if (mode == AAMode.SSAA && ssaa != null) {

		// .............................................................................
		// SSAA antialiasing ...........................................................
			
			IndieEffects.FullScreenQuad(ssaa);								
		}
		else if (mode == AAMode.DLAA && dlaa != null) {

		// .............................................................................
		// DLAA antialiasing ...........................................................
		
			IndieEffects.renderTexture.anisoLevel = 0;	
			IndieEffects.FullScreenQuad(dlaa);			
			IndieEffects.FullScreenQuad(dlaa);					
		}
		else if (mode == AAMode.NFAA && nfaa != null) {

		// .............................................................................
		// nfaa antialiasing ..............................................
			
			IndieEffects.renderTexture.anisoLevel = 0;	
		
			nfaa.SetFloat("_OffsetScale", offsetScale);
			nfaa.SetFloat("_BlurRadius", blurRadius);
				
			IndieEffects.FullScreenQuad(nfaa);					
		}
		else {
			// none of the AA is supported, fallback to a simple blit
			IndieEffects.FullScreenQuad(null);
		}
	}
}