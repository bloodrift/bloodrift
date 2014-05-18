using UnityEngine;

[RequireComponent(typeof(IndieEffects))]
public class _Normals : MonoBehaviour
{
    public Shader shader;
    public Texture2D Normals;
    public Texture2D tex;
    private GameObject NormCam;

    private void Start () 
    {
	    Normals = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
    }

    private void Update () 
    {
	    tex = Normals;
    }

    private void OnPreCull () 
    {
	    if (!NormCam)
        {
	        NormCam = new GameObject("NormalCamera");
	        Camera cam = NormCam.AddComponent<Camera>();
            cam.SetReplacementShader(shader, "");
            cam.enabled = false;
            cam.farClipPlane = camera.farClipPlane;
            cam.backgroundColor = Color.blue;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.depth = camera.depth - 2;
	    }

	    NormCam.transform.position = transform.position;
	    NormCam.transform.rotation = transform.rotation;
	    NormCam.camera.Render();
	    Normals.Resize(Screen.width,Screen.height,TextureFormat.RGB24,false);
	    Normals.ReadPixels(new Rect(0,0,Screen.width, Screen.height), 0, 0);
	    Normals.Apply();
    }
}