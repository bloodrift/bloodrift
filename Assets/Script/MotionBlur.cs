using UnityEngine;
using System.Collections;

public class MotionBlur : MonoBehaviour {

	public bool isMotionBlur = false;
	public Shader sMotionBlur;
	public Material mMotionBlur;
	public float accumulation = 0.65f;
	public Texture2D renderTex;
	
	void Start () {
		renderTex = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
		mMotionBlur = new Material(sMotionBlur);
		mMotionBlur.SetFloat("_Accumulation", accumulation);
	}

	void OnBlur(bool isBlur){
		isMotionBlur = isBlur;
	}

	void OnPostRender(){
		if(isMotionBlur){
			GL.PushMatrix();
			for (var i = 0; i < mMotionBlur.passCount; ++i) 
			{
				mMotionBlur.SetPass(i);
				GL.LoadOrtho();
				GL.Color(new Color(1,1,1,1));
				GL.Begin(GL.QUADS);
				GL.TexCoord2(0,0);
				GL.Vertex3(0,0,0);
				GL.TexCoord2(0,1);
				GL.Vertex3(0,1,0);
				GL.TexCoord2(1,1);
				GL.Vertex3(1,1,0);
				GL.TexCoord2(1,0);
				GL.Vertex3(1,0,0);
				GL.End();
			}
			GL.PopMatrix();
		}
		renderTex.ReadPixels(new Rect(0,0,Screen.width,Screen.height), 0, 0);
		renderTex.Apply();
		mMotionBlur.SetTexture("_MainTex", renderTex);
	}
}
