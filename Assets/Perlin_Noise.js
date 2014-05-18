#pragma strict

var scriptCarrier: GameObject;
var other : MainLogic = gameObject.GetComponent(MainLogic);

var test = false; // for test

var magnitude :float = 0.5; 
var duration :float = 0.5; 
var elapse : float = 0;
var perlinRange :float = 10;

var originalPos :Vector3;

function Start(){
	
	//originalPos = transform.position;
}

function doShake(){
	var randomOnPerlinX = Random.Range(-100.0,100.0);
	var randomOnPerlinY = Random.Range(-100.0,100.0);
	//var originPos = transform.position; 
	
	while(elapse < duration){
		elapse += Time.deltaTime;
		
		var percentageComplete = elapse/duration;
		
		var h = Mathf.PerlinNoise( randomOnPerlinX + perlinRange*percentageComplete,0 )*2.0-1.0;
		var w = Mathf.PerlinNoise(0, randomOnPerlinY + perlinRange*percentageComplete )*2.0-1.0;
		
		var damper = 1.0 -  Mathf.Clamp(4*percentageComplete-3,0.0,1.0);
		h *=magnitude*damper;
		w *=magnitude*damper;
		
		var pos = MainLogic.getCamPos();
		pos.y += h;
		pos.x += w;
		transform.position = pos;
		yield;
	}
	//transform.position = originalPos;
	elapse = 0;
	test = false;
}

function Update () {
//	originalPos = transform.position;
	if(test){
		StopAllCoroutines();
		StartCoroutine("doShake");
	test = false;
		
	}
}