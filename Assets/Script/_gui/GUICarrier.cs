using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GUICarrier : MonoBehaviour {

	public PlayerSystem playerSystem;
	public GameObject scriptCarrier;

	public GameObject startPanel;
	public GameObject playerPanel;
	public GameObject modePanel;
	public GameObject cellPanel;
	public GameObject rankPanel;
	public GameObject overPanel;
	public GameObject gamePanel;
	public GameObject racingPanel;
	public GameObject background;
	public GameObject UILight;
	/*************************************************************************/
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
	/*************************************************************************/
	/* Rank Panel */
	GameObject rankPanelBackBtn;
	GameObject rankPanelGrid;
	public Color rankPanelGridColor;
	public UIFont rankPanelGridFont;

	void OnRankPanelBackBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(startPanel, true);
		NGUITools.SetActive(rankPanel,false);
	}

	void OnReloadRankPanel(){
		List<PlayerSystem.Player> players = playerSystem.players;
		string curPlayerName = playerSystem.getCurPlayerName();

		int i = 0;
		Color color; 

		//GameObject container = rankPanelGrid.transform.FindChild("Grid").gameObject;//GetComponentInChildren<UIGrid>();
		//container.gameObject.AddComponent<UICenterOnChild>();
		//container.arrangement = UIGrid.Arrangement.Vertical;

		foreach( Transform child in rankPanelGrid.transform){
			GameObject.Destroy(child.gameObject);
		}

		foreach( PlayerSystem.Player p in players){
			i++;

			if( curPlayerName != null && p.name.Equals(curPlayerName))
				color = Color.yellow;
			else
				color = rankPanelGridColor;


			UILabel no = NGUITools.AddChild<UILabel>(rankPanelGrid);
			no.color = color;
			no.font =  rankPanelGridFont;
			no.text = i.ToString()+"  "+p.name+"  "+p.distance.ToString();
			no.MakePixelPerfect();
			no.gameObject.AddComponent<UIDragPanelContents>();
			BoxCollider bno = no.gameObject.AddComponent<BoxCollider>();
			bno.size = no.transform.localScale;
			
//			UILabel playername = NGUITools.AddChild<UILabel>(rankPanelGrid);
//			playername.color = color;
//			playername.font =  rankPanelGridFont;
//			playername.text = p.name;
//			playername.MakePixelPerfect();
//			playername.gameObject.AddComponent<UIDragPanelContents>();
//			playername.gameObject.AddComponent<BoxCollider>();
//			
//			UILabel playerdist = NGUITools.AddChild<UILabel>(rankPanelGrid);
//			playerdist.color = color;
//			playerdist.font =  rankPanelGridFont;
//			playerdist.text = p.distance.ToString();
//			playerdist.MakePixelPerfect();
//			playerdist.gameObject.AddComponent<UIDragPanelContents>();
//			playerdist.gameObject.AddComponent<BoxCollider>();
			
		}
		rankPanelGrid.GetComponent<UIGrid>().Reposition();

	}

	/*************************************************************************/
	/* Player Panel */
	GameObject playerPanelNextBtn;
	GameObject playerPanelBackBtn;
	UIPopupListAndInput playerPanelNameInput;
	UILabel playerPanelInvalidNameLbl;

	// -->> Mode Panel
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
		
		NGUITools.SetActive(modePanel, true);
		NGUITools.SetActive(playerPanel , false);
	}

	// -->> Start Panel
	void OnPlayerPanelBackBtn(GameObject go, bool isPress){
		NGUITools.SetActive(startPanel,true);
		NGUITools.SetActive(playerPanel,false);
	}
	/***************************************************************************/
	/* Mode Panel */
	GameObject modePanelEndlessBtn;
	GameObject modePabelRacingBtn;

	enum GameMode { Endless, Racing };
	GameMode gameMode;
	void OnModePanelEndlessBtn(GameObject go,bool isPress){
		gameMode = GameMode.Endless;
		NGUITools.SetActive(cellPanel,true);
		NGUITools.SetActive(modePanel,false);
		OnReloadCellPanel();	
	}
	void OnModePanelRacingBtn(GameObject go, bool isPress){
		gameMode = GameMode.Racing;
		NGUITools.SetActive(cellPanel,true);
		NGUITools.SetActive(modePanel,false);
		OnReloadCellPanel();
	}
	void OnModePanelBackBtn(GameObject go, bool isPress){
		NGUITools.SetActive(playerPanel,true);
		NGUITools.SetActive(modePanel,false);
	}

	/***************************************************************************/
	/* Racing Panel */
	public void OnRacingOver(){
		NGUITools.SetActive(overPanel,true);
		NGUITools.SetActive(racingPanel,false);
		background.GetComponent<UISprite>().enabled = true;
		overPanelDistanceLbl.text = gameObject.GetComponent<RacingUi>().getAchievement();
	}

	/***************************************************************************/
	/* Game Panel */
	UILabel overPanelDistanceLbl;
	public void OnGameOver(float distance){
		NGUITools.SetActive(overPanel,true);
		NGUITools.SetActive(gamePanel,false);
		background.GetComponent<UISprite>().enabled = true;
		overPanelDistanceLbl.text = Mathf.FloorToInt(distance).ToString();
	}
	/***************************************************************************/
	/* Cell Panel */
	GameObject cellPanelStartBtn;

	GameObject cellPanelToy2;
	GameObject cellPanelToy3;

	const int secondThreshold = 99;
	const int thirdThreshold  = 999;
	void OnReloadCellPanel(){
		//if(gameMode == GameMode.Racing){
		//	return;
		//}

		/* Endless Mode */
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

		if(gameMode == GameMode.Racing){
			NGUITools.SetActive(racingPanel,true);
			NGUITools.SetActive(cellPanel,false);
			background.GetComponent<UISprite>().enabled = false;
			UILight.light.enabled = false;
			gameObject.GetComponent<RacingUi>().OnRacingStart();
			scriptCarrier.SendMessage("StartGameModeRacing", toynumber);
			return;
		}

		NGUITools.SetActive(gamePanel,true);
		NGUITools.SetActive(cellPanel,false);
		background.GetComponent<UISprite>().enabled = false;
		UILight.light.enabled = false;

		gameObject.GetComponent<MainUi>().OnGameStart();
		scriptCarrier.SendMessage("StartGameModeEndless", toynumber);
	
	}

	void OnCellPanelBackBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(modePanel,true);
		NGUITools.SetActive(cellPanel,false);
	}
	/***************************************************************************/
	/* Over Panel */
	GameObject overPanelTryAgainBtn;
	GameObject overPanelMenuBtn;
	GameObject overPanelRankBtn;
	GameObject overPanelExitBtn;

	// -->> Mode Panel
	void OnOverPanelTryAgainBtn(GameObject go, bool isPressed){

		NGUITools.SetActive(overPanel,false);
		NGUITools.SetActive(modePanel,true);
		OnReloadCellPanel();
		UILight.light.enabled = true;

	}

	void OnOverPanelMenuBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(startPanel, true);
		NGUITools.SetActive(overPanel, false);
	}

	void OnOverPanelRankBtn(GameObject go, bool isPressed){
		NGUITools.SetActive(rankPanel, true);
		NGUITools.SetActive(overPanel, false);
		
		OnReloadRankPanel();
	}

	void OnOverPanelExitBtn(GameObject go, bool isPressed){

		Application.Quit();
	}
	/***************************************************************************/
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
		rankPanelGrid = rankPanel.transform.FindChild("Table/Grid").gameObject;

		playerPanelNextBtn = playerPanel.transform.FindChild("NextBtn").gameObject;
		playerPanelBackBtn = playerPanel.transform.FindChild("BackBtn").gameObject;
		playerPanelNameInput = playerPanel.transform.FindChild("NameInput").gameObject.GetComponent<UIPopupListAndInput>();
		playerPanelInvalidNameLbl = playerPanel.transform.FindChild("InvalidName").gameObject.GetComponent<UILabel>();
		playerPanelInvalidNameLbl.enabled = false;
		UIEventListener.Get (playerPanelNextBtn).onPress = OnPlayerPanelNextBtn;
		UIEventListener.Get (playerPanelBackBtn).onPress = OnPlayerPanelBackBtn;
	
		modePanelEndlessBtn = modePanel.transform.FindChild("EndlessBtn").gameObject;
		modePabelRacingBtn	= modePanel.transform.FindChild("RacingBtn").gameObject;
		UIEventListener.Get (modePanelEndlessBtn).onPress = OnModePanelEndlessBtn;
		UIEventListener.Get (modePabelRacingBtn).onPress  = OnModePanelRacingBtn;

		GameObject cellPanelBackBtn = cellPanel.transform.FindChild("BackBtn").gameObject;
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
		overPanelMenuBtn = overPanel.transform.FindChild("MenuBtn").gameObject;
		overPanelRankBtn = overPanel.transform.FindChild("RankBtn").gameObject;
		overPanelExitBtn = overPanel.transform.FindChild("ExitBtn").gameObject;
		UIEventListener.Get(overPanelMenuBtn).onPress=OnOverPanelMenuBtn;
		UIEventListener.Get(overPanelRankBtn).onPress=OnOverPanelRankBtn;
		UIEventListener.Get(overPanelExitBtn).onPress=OnOverPanelExitBtn;

		UILight = GameObject.Find("UILight");

	}

}