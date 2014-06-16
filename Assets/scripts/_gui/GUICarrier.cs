using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GUICarrier : MonoBehaviour {

	public PlayerSystem playerSystem;

	public GameObject startPanel;
	public GameObject playerPanel;
	public GameObject cellPanel;
	public GameObject rankPanel;
	public GameObject overPanel;

	/* Start Panel */
	GameObject startPanelStartBtn;
	GameObject startPanelRankBtn;
	
	void OnStartPanelStartBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(playerPanel, true);
		NGUITools.SetActive(startPanel , false);
	}
	
	void OnStartPanelRankBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(rankPanel, true);
		NGUITools.SetActive(startPanel , false);

		OnReloadRankPanel();
	}

	/* Rank Panel */
	GameObject rankPanelBackBtn;
	GameObject rankPanelTable;
	Color rankPanelTableColor = Color.black;
	public UIFont rankPanelTableFont;

	void OnRankPanelBackBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(startPanel, true);
		NGUITools.SetActive(rankPanel,false);
	}

	void OnReloadRankPanel(){
		List<PlayerSystem.Player> players = playerSystem.players;

		int i = 0;
		foreach( PlayerSystem.Player p in players){
			i++;
			
			//UILabel no = (UILabel)NGUITools.AddChild(gameObject,label);
			UILabel no = NGUITools.AddChild<UILabel>(rankPanelTable);
			no.color = rankPanelTableColor;
			no.font = rankPanelTableFont;
			no.text = i.ToString();
			no.MakePixelPerfect();
			
			UILabel playername = NGUITools.AddChild<UILabel>(rankPanelTable);
			playername.color = rankPanelTableColor;
			playername.font = rankPanelTableFont;
			playername.text = p.name;
			playername.MakePixelPerfect();
			
			UILabel playerdist = NGUITools.AddChild<UILabel>(rankPanelTable);
			playerdist.color = rankPanelTableColor;
			playerdist.font = rankPanelTableFont;
			playerdist.text = p.distance.ToString();
			playerdist.MakePixelPerfect();
			
		}
		rankPanelTable.GetComponent<UITable>().Reposition();
	}

	/* Player Panel */
	GameObject playerPanelNextBtn;
	UIPopupListAndInput playerPanelNameInput;
	UILabel playerPanelInvalidNameLbl;

	void OnPlayerPanelNextBtn(GameObject go, bool isPressed){
		// check if empty.
		if(string.IsNullOrEmpty( playerPanelNameInput.mText) ){
			// invalid username!
			playerPanelInvalidNameLbl.enabled = true;
			return;
		}

		playerPanelInvalidNameLbl.enabled = false;
		string username = playerPanelNameInput.mText;
		playerSystem.OnUserEnterName(username);
		
		NGUITools.SetActive(cellPanel, true);
		NGUITools.SetActive(playerPanel , false);
	}

	/* Cell Panel */
	GameObject cellPanelStartBtn;
	void OnCellPanelStartBtn(GameObject go, bool isPressed){
		Application.LoadLevel("scene1");
	}

	/* Over Panel */
	GameObject overPanelTryAgainBtn;
	void OnOverPanelTryAgainBtn(GameObject go, bool isPressed){
		Application.LoadLevel("scene1");
	}

	// Use this for initialization
	void Start () {

		playerSystem = GameObject.Find("PlayerSystem").GetComponent<PlayerSystem>();
		
		startPanelStartBtn = startPanel.transform.FindChild("StartBtn").gameObject;
		startPanelRankBtn  = startPanel.transform.FindChild("StartTable/RankBtn").gameObject; 	
		UIEventListener.Get(startPanelStartBtn).onPress = OnStartPanelStartBtn; 
		UIEventListener.Get(startPanelRankBtn) .onPress = OnStartPanelRankBtn;

		rankPanelBackBtn = rankPanel.transform.FindChild("BackBtn").gameObject;
		UIEventListener.Get (rankPanelBackBtn).onPress = OnRankPanelBackBtn;
		rankPanelTable = rankPanel.transform.FindChild("Table").gameObject;

		playerPanelNextBtn = playerPanel.transform.FindChild("NextBtn").gameObject;
		playerPanelNameInput = playerPanel.transform.FindChild("NameInput").gameObject.GetComponent<UIPopupListAndInput>();
		playerPanelInvalidNameLbl = playerPanel.transform.FindChild("InvalidName").gameObject.GetComponent<UILabel>();
		playerPanelInvalidNameLbl.enabled = false;
		UIEventListener.Get (playerPanelNextBtn).onPress = OnPlayerPanelNextBtn;
	
		cellPanelStartBtn = cellPanel.transform.FindChild("StartBtn").gameObject;
		UIEventListener.Get(cellPanelStartBtn).onPress = OnCellPanelStartBtn;
	
		overPanelTryAgainBtn = overPanel.transform.FindChild("TryAgainBtn").gameObject;
		UIEventListener.Get(overPanelTryAgainBtn).onPress = OnOverPanelTryAgainBtn;
	}
}
