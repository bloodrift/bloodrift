using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using System.Collections;
using System;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;

public class PlayerSystem : MonoBehaviour{
	[Serializable]
	public class Player : IComparable<Player>{
		public string name;
		public int distance;

		public static Player newPlayer(string name, int distance){
			Player p = new Player();
			p.name = name;
			p.distance = distance;
			return p;
		}

		// sort by descending order
		public int CompareTo( Player other){
			return - distance.CompareTo(other.distance);
		}

		public override string ToString(){
			return "Player name: "+name+" distance: "+distance;
		}
	}

	private bool isLoadPlayers = false;
	private bool isPlayersDirty = false;

	public List<Player> players = new List<Player>();
	public Player curPlayer;


	// called when user close the game program.
	// save all information back to computer system.
	void savePlayers(){
		if( isPlayersDirty ){
			BinaryFormatter b = new BinaryFormatter();
			MemoryStream m = new MemoryStream();
			b.Serialize(m, players);
			PlayerPrefs.SetString("players",Convert.ToBase64String(m.GetBuffer()));

			isPlayersDirty = false;
		}
	}

	// called when the program opened.
	// load players information from computer system.
	void loadPlayers(){
		string d = PlayerPrefs.GetString("players");
		if( string.IsNullOrEmpty(d) ){
			Debug.LogError("PlayerSystem: Empty player information!");
			return;
		}
		BinaryFormatter b = new BinaryFormatter();
		MemoryStream m = new MemoryStream(Convert.FromBase64String(d));
		players = (List<Player>)b.Deserialize(m);

		isLoadPlayers = true;  // players are loaded
		isPlayersDirty = false; // players are the newest now
	}

	// find the name from playerlist, or create new player
	public void OnUserEnterName(String name){

		// is there any player who names <name> ?
		foreach( Player p in players){
			if( p.name.Equals(name) ){
				curPlayer = p;
				return;
			}
		}
		// add a new player.
		curPlayer = Player.newPlayer(name,0);
		players.Add(curPlayer);
		isPlayersDirty = true;
	}

	// Everytime a player end the game.
	// save current player information, update rank, 
	public void OnGameOver(float distance){

		if( curPlayer.distance < Mathf.FloorToInt(distance)){
			curPlayer.distance = Mathf.FloorToInt(distance);
			isPlayersDirty = true;

			// update sort;
			players.Sort();
		}
	}

	// when user exits game, should store players information back disk?
	void OnDestroy(){
		savePlayers();
	}

	void OnApplicationQuit(){
//		Debug.Log("PlayerSystem: OnApplicationQuit");
		savePlayers();
	}

	// for debug.
	void OnApplicationPause(bool isPause){
		if(isPause){
			savePlayers();
		}
	}

	public void OnResetPlayerSystem(){
		players.Clear ();
		curPlayer = null;
		savePlayers();
	}

	public List<string> getPlayersName(){
		List<string> names = new List<string>();
		foreach(Player p in players){
			names.Add(p.name);
		}
		return names;
	}

	public string getCurPlayerName(){
		if(curPlayer != null){
			return curPlayer.name;
		}
		return null;
	}

	void Start(){
		
		DontDestroyOnLoad(gameObject); 

		if( ! isLoadPlayers ){
			players.Clear();
			loadPlayers();
			players.Sort();
			isLoadPlayers = true;
		}
	}

	void initializePlayerSystemForTesting(){
		players.Clear();
		for(int i =0;i<4;i++){
			Player p = new Player();
			p.name = "player"+i.ToString();
			p.distance = i;
			players.Add(p);
		}
		players.Add( Player.newPlayer("Max",1000));
		players.Add( Player.newPlayer("Second",500));
	}
} 