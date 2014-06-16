using UnityEngine;
using System.Collections;

public class GUI_PlayerPlane_Input : MonoBehaviour {

	public UILabel displaylabel;

	void OnChange(string text){
		Debug.Log("change: "+text);
		displaylabel.text = text;
	}
}
