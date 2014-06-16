using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GUI_RankPlane_Table : MonoBehaviour {

	public PlayerSystem playerSystem;
	public UIFont font;

	public Color color = Color.black;


	// Use this for initialization
	void Start () {
		playerSystem = GameObject.Find("PlayerSystem").GetComponent<PlayerSystem>();

		List<PlayerSystem.Player> players = playerSystem.players;

		int i = 0;
		foreach( PlayerSystem.Player p in players){
			i++;

			//UILabel no = (UILabel)NGUITools.AddChild(gameObject,label);
			UILabel no = NGUITools.AddChild<UILabel>(gameObject);
			no.color = color;
			no.font = font;
			no.text = i.ToString();
			no.MakePixelPerfect();

			UILabel playername = NGUITools.AddChild<UILabel>(gameObject);
			playername.color = color;
			playername.font = font;
			playername.text = p.name;
			playername.MakePixelPerfect();

			UILabel playerdist = NGUITools.AddChild<UILabel>(gameObject);
			playerdist.color = color;
			playerdist.font = font;
			playerdist.text = p.distance.ToString();
			playerdist.MakePixelPerfect();

		}
		gameObject.GetComponent<UITable>().Reposition();

	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
