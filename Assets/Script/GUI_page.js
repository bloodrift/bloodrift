#pragma strict

import System.IO;

var score_text : GameObject;
var distance_text : GameObject;
var mainLogic : MainLogic;

var highest_str : String;

var a = new Array();
function Start () {
	var sr : StreamReader = new StreamReader("userinfo.txt");
	highest_str= sr.ReadLine();
	
	mainLogic = gameObject.GetComponent(MainLogic);
	a.push(1);
}

private var cur_score 	 : int = 0;
private var cur_distance : float = 0;

function increaseScore( delta : int ){
	cur_score += delta;
}

function decreaseScore( delta : int  ){
	cur_score -= delta;
}

function increaseDistance( delta : float ){
	cur_distance = delta;
}

function Update () {
	cur_score = mainLogic.getScore();
	if( cur_score < 0){
		
//		var sr : StreamReader = new StreamReader("userinfo.txt");
//		var highest_str : String;
//		highest_str = sr.ReadLine();
//		
//		var highest_distance :int = int.Parse(highest_str);
//		var cur_distance_int : int = Mathf.FloorToInt(cur_distance);
//		if( cur_distance_int > highest_distance ){
//			highest_distance = cur_distance_int;
//		}
		var cur_distance_int : int = Mathf.FloorToInt(cur_distance);
		
		var sw : StreamWriter = new StreamWriter("userinfo.txt");
		//sw.WriteLine(highest_distance);
		sw.WriteLine(cur_distance_int);
		sw.WriteLine(highest_str);
		sw.Flush();
		sw.Close();
	
		Application.LoadLevel("gameover");
	}
	score_text.GetComponent(UILabel).text = ""+ cur_score ;
	distance_text.GetComponent(UILabel).text = "" + Mathf.FloorToInt(cur_distance);
	
}