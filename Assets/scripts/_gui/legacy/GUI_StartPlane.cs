using UnityEngine;
using System.Collections;

public class GUI_StartPlane : MonoBehaviour {

	GameObject startBtn;
	GameObject rankBtn;

	public GameObject playerPlane;
	public GameObject rankPlane;
	//public GameObject startPlane;

	void OnStartBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(playerPlane, true);
		NGUITools.SetActive(gameObject , false);
	}

	void OnRankBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(rankPlane, true);
		NGUITools.SetActive(gameObject , false);
	}

	// Use this for initialization
	void Start () {

		startBtn = transform.FindChild("StartBtn").gameObject;
		rankBtn = transform.FindChild("RankBtn").gameObject; 

		UIEventListener.Get(startBtn).onPress = OnStartBtn; 
		UIEventListener.Get(rankBtn).onPress = OnRankBtn;
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
