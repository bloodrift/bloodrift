#pragma strict

var mainLogic : MainLogic = gameObject.GetComponent(MainLogic);

var score_text : GameObject;
var distance_text : GameObject;

var a = new Array();
function Start () {
	a.push(1);
}

private var cur_score 	 : int = 0;
private var cur_distance : float = 0;

//function increaseScore( delta : int ){
//	cur_score += delta;
//}
//
//function decreaseScore( delta : int  ){
//	cur_score -= delta;
//}

function increaseDistance( delta : float ){
	cur_distance = delta;
}

function Update () {
	cur_score = mainLogic.getScore();
	if( cur_score < 0){
		// todo:
	}
	score_text.GetComponent(UILabel).text = ""+ cur_score ;
	distance_text.GetComponent(UILabel).text = "" + Mathf.FloorToInt(cur_distance);
	
}