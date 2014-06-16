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

	public bool isLoadPlayers = false;
	public List<Player> players = new List<Player>();
	public Player curPlayer;

	// called when user close the game program.
	// save all information back to computer system.
	void savePlayers(){
		BinaryFormatter b = new BinaryFormatter();
		MemoryStream m = new MemoryStream();
		b.Serialize(m, players);

		//Debug.Log( m.ToString() );

		PlayerPrefs.SetString("players",Convert.ToBase64String(m.GetBuffer()));
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
	}
	
	void newPlayer(string name){
		if(! isLoadPlayers ){
			loadPlayers();
		}
		players.Add(Player.newPlayer(name,0));
	}

	// find the name from playerlist, or create new player
	public void OnUserEnterName(String name){
		curPlayer = Player.newPlayer(name,0);
	}

	// save current player information, update rank, 
	public void OnGameOver(){

	}

	public List<string> getPlayersName(){
		List<string> names = new List<string>();
		foreach(Player p in players){
			names.Add(p.name);
		}
		return names;
	}

	void OnDestroy(){
		savePlayers();
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

	void initializePlayerSystem(){
		players.Clear ();
	}

	void Awake(){
		
		DontDestroyOnLoad(gameObject); 
		//DontDestroyOnLoad(this); 

		//savePlayer();
		if( ! isLoadPlayers ){
			players.Clear();
			loadPlayers();

			players.Sort();
			
			isLoadPlayers = true;
			
//			for(int i=0;i< players.Count; i++){
//				Debug.Log( players[i].ToString() );
//			}
		}
	}
} 