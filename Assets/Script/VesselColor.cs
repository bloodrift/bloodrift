using UnityEngine;
using System.Collections;

public class VesselColor : MonoBehaviour {

	float freqency = 0.0003f;
	Vector3 phase = new Vector3(0,2,4);
	Vector3 center= new Vector3(0.7f,0.5f,0.5f);
	const float width  = 0.3f;
	int maxi ;


	int i = 0;

	public Color c;

	private void ColorGradient(){

		i++;
		if( i >= maxi) i = 0;

		//Color c = new Color(0,0,0);

		c.r = Mathf.Sin(freqency*i+phase[0]) * width + center[0];
		c.g = Mathf.Sin(freqency*i+phase[1]) * width + center[1];
		c.b = Mathf.Sin(freqency*i+phase[2]) * width + center[2];
	

	
	}

	void Start(){
		maxi = Mathf.FloorToInt(2*Mathf.PI/freqency);
	}

	// Update is called once per frame
	void Update () {
		Material vesselMat = renderer.sharedMaterial;
		ColorGradient();
		vesselMat.color = c;
	}
}
