

using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using System.Collections;
//You must include these namespaces
//to use BinaryFormatter
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

	void savePlayer(){
		BinaryFormatter b = new BinaryFormatter();
		MemoryStream m = new MemoryStream();
		b.Serialize(m, players);

		Debug.Log( m.ToString() );

		PlayerPrefs.SetString("players",Convert.ToBase64String(m.GetBuffer()));
	}

	void loadPlayer(){
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
			loadPlayer();
		}
		players.Add(Player.newPlayer(name,0));
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

	void Start(){
		//savePlayer();
		if( ! isLoadPlayers ){
			players.Clear();
			loadPlayer ();
			players.Sort();
			
			isLoadPlayers = true;
			
			for(int i=0;i< players.Count; i++){
				Debug.Log( players[i].ToString() );
			}
		}
	}

	void Update(){

			
	}
}