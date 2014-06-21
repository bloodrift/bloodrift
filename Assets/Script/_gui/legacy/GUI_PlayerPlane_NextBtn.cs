using UnityEngine;
using System.Collections;

public class GUI_PlayerPlane_NextBtn : MonoBehaviour {

	public PlayerSystem playerSystem;
	public GameObject playerPlane;
	public GameObject cellPlane;

	public UIPopupListAndInput nameInput;
	public UILabel invalidNameLabel;
	public string username;

	void Awake(){

	}

	// Use this for initialization
	void Start () {
		GameObject go_playerSystem = GameObject.Find("PlayerSystem");
		playerSystem = go_playerSystem.GetComponent<PlayerSystem>();
		
		nameInput = GameObject.Find("NameInput").GetComponent<UIPopupListAndInput>();
		invalidNameLabel = GameObject.Find("InvalidName").GetComponent<UILabel>();
		invalidNameLabel.enabled = false;

		//playerPlane = GameObject.Find("PlayerPlane"); 
		//startPlane  = GameObject.Find("StartPlane");
	}

	// call this when the user inputs his name and press enter
//	void OnSubmit(string text){
//		Debug.Log("GUI_PlayerPlane_NextBtn: receive text: "+text);
//		if( text.Length <= 0){
//			// warning: name = null
//		}
//		username = text;
//	}

	void OnClick(){

		// get string from input sprite
		Debug.Log("GUI_PlayerPlane_NextBtn: onclick text: "+username);
		// check if empty.
		if(string.IsNullOrEmpty(nameInput.mText) ){
			// invalid username!
			invalidNameLabel.enabled = true;
			return;
		}

		username = nameInput.mText;
		playerSystem.OnUserEnterName(username);

		NGUITools.SetActive(cellPlane, true);
		NGUITools.SetActive(playerPlane , false);
	}
		
}
