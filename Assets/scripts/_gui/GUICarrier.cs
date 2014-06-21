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
	public GameObject gamePanel;
	public GameObject background;

	/* Start Panel */
	GameObject startPanelStartBtn;
	GameObject startPanelRankBtn;

	// Start Panel >> Player Panel
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
	public Color rankPanelTableColor;
	public UIFont rankPanelTableFont;

	void OnRankPanelBackBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(startPanel, true);
		NGUITools.SetActive(rankPanel,false);
	}

	void OnReloadRankPanel(){
		List<PlayerSystem.Player> players = playerSystem.players;
		string curPlayerName = playerSystem.getCurPlayerName();

		int i = 0;
		Color color; 

		GameObject container = rankPanelTable.transform.FindChild("Grid").gameObject;//GetComponentInChildren<UIGrid>();
		//container.gameObject.AddComponent<UICenterOnChild>();
		//container.arrangement = UIGrid.Arrangement.Vertical;
		foreach( PlayerSystem.Player p in players){
			i++;

			if( curPlayerName != null && p.name.Equals(curPlayerName))
				color = Color.yellow;
			else
				color = rankPanelTableColor;


			UILabel no = NGUITools.AddChild<UILabel>(container);
			no.color = color;
			no.font =  rankPanelTableFont;
			no.text = i.ToString()+"  "+p.name+"  "+p.distance.ToString();
			no.MakePixelPerfect();
			no.gameObject.AddComponent<UIDragPanelContents>();
			BoxCollider bno = no.gameObject.AddComponent<BoxCollider>();
			bno.size = no.transform.localScale;
			
//			UILabel playername = NGUITools.AddChild<UILabel>(rankPanelTable);
//			playername.color = color;
//			playername.font =  rankPanelTableFont;
//			playername.text = p.name;
//			playername.MakePixelPerfect();
//			playername.gameObject.AddComponent<UIDragPanelContents>();
//			playername.gameObject.AddComponent<BoxCollider>();
//			
//			UILabel playerdist = NGUITools.AddChild<UILabel>(rankPanelTable);
//			playerdist.color = color;
//			playerdist.font =  rankPanelTableFont;
//			playerdist.text = p.distance.ToString();
//			playerdist.MakePixelPerfect();
//			playerdist.gameObject.AddComponent<UIDragPanelContents>();
//			playerdist.gameObject.AddComponent<BoxCollider>();
			
		}
		container.GetComponent<UIGrid>().Reposition();
		//rankPanelTable.GetComponent<UIGrid>().Reposition();
	}

	/* Player Panel */
	GameObject playerPanelNextBtn;
	GameObject playerPanelBackBtn;
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
		OnReloadCellPanel();
	}

	void OnPlayerPanelBackBtn(GameObject go, bool isPress){
		NGUITools.SetActive(startPanel,true);
		NGUITools.SetActive(playerPanel,false);
	}

	/* Game Panel */
	UILabel overPanelDistanceLbl;
	public void OnGameOver(string distance){
		NGUITools.SetActive(overPanel,true);
		NGUITools.SetActive(gamePanel,false);
		background.GetComponent<UISprite>().enabled = true;
		overPanelDistanceLbl.text = distance;
	}
	
	/* Cell Panel */
	GameObject cellPanelStartBtn;

	GameObject cellPanelToy2;
	GameObject cellPanelToy3;

	const int secondThreshold = 20;
	const int thirdThreshold  = 50;
	void OnReloadCellPanel(){
		//cellPanelToy2.SetActive(false);
		if( playerSystem.curPlayer == null){
			Debug.LogError("OnReloadCellPanel: didn't find current player");
			return;
		}

		int curPlayerDist = playerSystem.curPlayer.distance;

		if( curPlayerDist >= secondThreshold){
			cellPanelToy2.transform.FindChild("Lock").gameObject.SetActive(false);
			cellPanelToy2.transform.FindChild("Cell").gameObject.SetActive(true);
			cellPanelToy2.GetComponent<UIButton>().isEnabled = true;
		}
		else{
			cellPanelToy2.transform.FindChild("Lock").gameObject.SetActive(true);
			cellPanelToy2.transform.FindChild("Cell").gameObject.SetActive(false);
			cellPanelToy2.GetComponent<UIButton>().isEnabled = false;
		}

		if( curPlayerDist >= thirdThreshold){
			cellPanelToy3.transform.FindChild("Lock").gameObject.SetActive(false);
			cellPanelToy3.transform.FindChild("Cell").gameObject.SetActive(true);
			cellPanelToy3.GetComponent<UIButton>().isEnabled = true;
		}
		else{
			cellPanelToy3.transform.FindChild("Lock").gameObject.SetActive(true);
			cellPanelToy3.transform.FindChild("Cell").gameObject.SetActive(false);
			cellPanelToy3.GetComponent<UIButton>().isEnabled = false;
		}

	}
	void OnCellPanelToy1(GameObject go, bool isPressed){
		OnCellPanelStart(0);

	}
	void OnCellPanelToy2(GameObject go, bool isPressed){
		OnCellPanelStart(1);
	
	}
	void OnCellPanelToy3(GameObject go, bool isPressed){
		OnCellPanelStart(2);
	}

	void OnCellPanelStart(int toynumber){
		//Application.LoadLevel("scene1");
		NGUITools.SetActive(gamePanel,true);
		NGUITools.SetActive(cellPanel,false);
		gameObject.GetComponent<MainUi>().OnGameStart();

		scriptCarrier.SendMessage("StartGame", toynumber);
		background.GetComponent<UISprite>().enabled = false;

	}
	void OnCellPanelBackBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(playerPanel,true);
		NGUITools.SetActive(cellPanel,false);
	}

	/* Over Panel */
	GameObject overPanelTryAgainBtn;
	GameObject scriptCarrier;
	void OnOverPanelTryAgainBtn(GameObject go, bool isPressed){
		//Application.LoadLevel("scene1");
		//scriptCarrier.SendMessage("Start");
		//NGUITools.SetActive(gamePanel,true);
		NGUITools.SetActive(overPanel,false);
		NGUITools.SetActive(cellPanel,true);
		OnReloadCellPanel();
		//OnCellPanelStart(overPanel,true);
	}

	// Use this for initialization
	void Start () {

		playerSystem = GameObject.Find("PlayerSystem").GetComponent<PlayerSystem>();
		scriptCarrier = GameObject.Find ("ScriptCarrier");
		
		startPanelStartBtn = startPanel.transform.FindChild("StartBtn").gameObject;
		startPanelRankBtn  = startPanel.transform.FindChild("StartTable/RankBtn").gameObject; 	
		UIEventListener.Get(startPanelStartBtn).onPress = OnStartPanelStartBtn; 
		UIEventListener.Get(startPanelRankBtn) .onPress = OnStartPanelRankBtn;

		rankPanelBackBtn = rankPanel.transform.FindChild("BackBtn").gameObject;
		UIEventListener.Get (rankPanelBackBtn).onPress = OnRankPanelBackBtn;
		rankPanelTable = rankPanel.transform.FindChild("Table").gameObject;

		playerPanelNextBtn = playerPanel.transform.FindChild("NextBtn").gameObject;
		playerPanelBackBtn = playerPanel.transform.FindChild("BackBtn").gameObject;
		playerPanelNameInput = playerPanel.transform.FindChild("NameInput").gameObject.GetComponent<UIPopupListAndInput>();
		playerPanelInvalidNameLbl = playerPanel.transform.FindChild("InvalidName").gameObject.GetComponent<UILabel>();
		playerPanelInvalidNameLbl.enabled = false;
		UIEventListener.Get (playerPanelNextBtn).onPress = OnPlayerPanelNextBtn;
		UIEventListener.Get (playerPanelBackBtn).onPress = OnPlayerPanelBackBtn;
	
		//cellPanelStartBtn = cellPanel.transform.FindChild("StartBtn").gameObject;
		GameObject cellPanelBackBtn = cellPanel.transform.FindChild("BackBtn").gameObject;
		//UIEventListener.Get(cellPanelStartBtn).onPress = OnCellPanelStartBtn;
		UIEventListener.Get(cellPanelBackBtn).onPress  = OnCellPanelBackBtn;

		GameObject cellPanelToy1 = cellPanel.transform.FindChild("Toy1").gameObject;
		cellPanelToy2 = cellPanel.transform.FindChild("Toy2").gameObject;
		cellPanelToy3 = cellPanel.transform.FindChild("Toy3").gameObject;
		UIEventListener.Get (cellPanelToy1).onPress = OnCellPanelToy1;
		UIEventListener.Get (cellPanelToy2).onPress = OnCellPanelToy2;
		UIEventListener.Get (cellPanelToy3).onPress = OnCellPanelToy3;


		overPanelTryAgainBtn = overPanel.transform.FindChild("TryAgainBtn").gameObject;
		UIEventListener.Get(overPanelTryAgainBtn).onPress = OnOverPanelTryAgainBtn;
		overPanelDistanceLbl = overPanel.transform.FindChild("DistanceLbl").gameObject.GetComponent<UILabel>();
	
	}

}