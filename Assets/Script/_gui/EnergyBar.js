#pragma strict

private var fg : Transform;
private var bg : Transform;

var curenergy   :float;
var totalenergy :float;

var percentage : float;

function Start () {

	fg = transform.Find("Foreground");
	bg = transform.Find("Background");
	
	if(fg == null || bg == null){
		Debug.LogError("Energy Bar can't find its child");
	}
}

function clear(){
	curenergy = 0;
}

function increase(inc : float){
	curenergy += inc;
	percentage = curenergy / totalenergy;
}

function Update () {
	fg.localPosition.x = 0;
	fg.localScale.x = percentage * bg.localScale.x;
}