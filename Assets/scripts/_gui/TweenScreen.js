#pragma strict

var test = true;

private var script : TweenColor;
private var widget : UIWidget;
function Start () {
	script = GetComponent(TweenColor);
	widget = GetComponentInChildren(UIWidget);
	
}

function onTweenFinished(){
	
}

function onTween(){
	test = false;
}

function disableTween(){
	test = true;
}

function Update () {

	if(test){
		//script.OnDisable();
		script.enabled = false;
		//widget.enabled = false;
	}
	else{
		script.enabled = true;
		//widget.enabled = true;
	}

}