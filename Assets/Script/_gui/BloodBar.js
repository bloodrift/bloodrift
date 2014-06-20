#pragma strict

private var fg : Transform;
private var bg : Transform;
var tweenScript : TweenScreen;

var totalblood : float = 100;
var curblood : float = 50;
var percentage : float;

function Start () {
	fg = transform.Find("Foreground");
	bg = transform.Find("Background");	
	if(fg == null || bg == null){
		Debug.LogError("Blood Bar can't find its child");
	}
	
	var tweenScreen = GameObject.Find("TweenScreen");
	tweenScript = tweenScreen.GetComponent(TweenScreen);
	if( tweenScreen == null ){
		Debug.LogError("Can't find TweenScreen GameObject.");
	}
	
	percentage = curblood / totalblood;
}

function setBlood(total : float, cur : float){
	totalblood = total;
	curblood   = cur;
	
	if(curblood < 0 ) curblood = 0;
	else if( curblood > totalblood) curblood = totalblood;
}

function onChangeBlood(value : float){

	curblood += value;
	if(curblood < 0 ) curblood = 0;
	else if( curblood > totalblood) curblood = totalblood;
	
	percentage = curblood / totalblood;
}

function Update () {
	// twinkle the screen
	if( percentage < 0.1){
		tweenScript.onTween();
	}
	else{
		tweenScript.disableTween();
	}
	
	// #Debug, should be moved after integration.
	// percentage should be set as private.
	if( percentage < 0 ) percentage = 0;
	else if( percentage > 1) percentage = 1;
	
	fg.localPosition.x = 0;
	fg.localScale.x = percentage * bg.localScale.x;
}