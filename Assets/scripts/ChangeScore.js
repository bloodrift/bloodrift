#pragma strict

var score_text : GameObject;
var distance_text : GameObject;

var a = new Array();
function Start () {
	a.push(1);
	Debug.Log(a);
}

private var cur_score 	 : int = 0;
private var cur_distance : int = 0;

function increaseScore( delta : int ){
	cur_score += delta;
}

function decreaseScore( delta : int  ){
	cur_score -= delta;
}

function increaseDistance( delta : int ){
	cur_distance += delta;
}

function Update () {

	if( cur_score < 0){
		// todo:
	}
	score_text.GetComponent(UILabel).text = ""+ cur_score ;
	distance_text.GetComponent(UILabel).text = "" + cur_distance;
	
}