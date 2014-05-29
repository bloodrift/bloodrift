#pragma strict
//these are tubes and its prefabs


var ST_1_1_2 : GameObject;
var ST_1_1h_4 : GameObject;
var ST_1h_1_4 : GameObject;
var ST_1h_1h_3 : GameObject;

var BT_1_1_30 : GameObject;
var BT_1_2_30 : GameObject;
var BT_1_3_30 : GameObject;
var BT_1_2_60 : GameObject;

var CELL : GameObject;
var CAM : GameObject;
var ATP : GameObject;
var VIRUS : GameObject;

var GUI_ : GameObject;

var Spark : GameObject;

public class Global{
	static public var maxRotateForce : float = 900;
	static public var maxRotateSpeed : float = 300;
	static public var rushSpeed : float = 15;
}

static var vesselMap = new Map();
//static var vesselMap = new Map();

static function getCamPos(){
	return vesselMap.player.camPos;
}

static function getScore(){
	return vesselMap.player.score;
}

static function hitATP(score : int){
	vesselMap.player.score += score;
}

function gameOver(distance : float){
	Application.LoadLevel("gameover");
}

function Start(){
	var cell : Cell = vesselMap.player;
	vesselMap.player.instance = Instantiate(CELL, cell.position, cell.rotation);
	var cam : Cell = vesselMap.cam;
	cam.instance = CAM;
}

function InstantiateVessel(vess : Vessel){
	var item : BloodItem;
	switch (vess.vessType){
			case 0:
				vess.instance = Instantiate(ST_1_1_2, vess.startPoint, vess.quaRotation);
				break;
			case 1:
				vess.instance = Instantiate(BT_1_2_60, vess.startPoint, vess.quaRotation);
				break;
		}
	//	vess.AddItemRandom(0);
	for (var j = 0; j < vess.items.length; ++j){
		item = vess.items[j];
		if(item.itemType == 0){
			item.instance = Instantiate(ATP, item.position, item.rotation);
		}
		else{ 
			item.instance = Instantiate(VIRUS, item.position, item.rotation);
		}
	}
}

static var rotateForce : float;
static var moveSpeed : float;
static var lrSpeed : float = 0;
static var udSpeed : float = 0;

//var moveSpeed = 1; 		// m/s
private var acceleration :float = 0.2 ; 	//m/s2
private var brakeAcceleration :float = 0.5 ;

function Update(){
	while(vesselMap.newVessel > 0){
		InstantiateVessel(vesselMap.map[vesselMap.map.length - vesselMap.newVessel]);
		vesselMap.newVessel -= 1;
	}
	if(vesselMap.player.mode == 0){
		if(Input.GetKeyDown(KeyCode.A)){
			rotateForce = -Global.maxRotateForce;
		}
		if(Input.GetKeyDown(KeyCode.D)){
			rotateForce = Global.maxRotateForce;
		}
		if(Input.GetKeyUp(KeyCode.D) || Input.GetKeyUp(KeyCode.A)){
			rotateForce = 0;
		}
		if(!vesselMap.player.onSwitch)
			vesselMap.SetRotateForce(vesselMap.player, rotateForce);
	}
	else {
		if(Input.GetKeyDown(KeyCode.A)){
			lrSpeed = -3;
		}
		if(Input.GetKeyDown(KeyCode.D)){
			lrSpeed = 3;
		}
		if(Input.GetKeyUp(KeyCode.D) || Input.GetKeyUp(KeyCode.A)){
			lrSpeed = 0;
		}
		if(Input.GetKeyDown(KeyCode.W)){
			udSpeed = 3;
		}
		if(Input.GetKeyDown(KeyCode.S)){
			udSpeed = -3;
		}
		if(Input.GetKeyUp(KeyCode.W) || Input.GetKeyUp(KeyCode.S)){
			udSpeed = 0;
		}
		if(!vesselMap.player.onSwitch)
			vesselMap.player.Shift(Vector3(lrSpeed, udSpeed, 0) * Time.deltaTime);
	}
	if(Input.GetKeyDown(KeyCode.Space)){
		vesselMap.SetRotateForce(vesselMap.player, 0);
		vesselMap.player.SwitchMode();
	}
	if(Input.GetKeyDown(KeyCode.C)){
		vesselMap.player.Rush(3);
		var indieEffects : IndieEffects = CAM.GetComponent(IndieEffects);
		indieEffects.motionBlur = true;
	}

	vesselMap.SetSpeed(vesselMap.player, moveSpeed);
	vesselMap.Move(vesselMap.player, Time.deltaTime);
	if(vesselMap.ItemHit(vesselMap.player)){
		vesselMap.cam.instance.SendMessage("hit");
	}
	
	vesselMap.player.instance.transform.position = vesselMap.player.position;
	vesselMap.player.instance.transform.rotation = vesselMap.player.rotation;
	
	vesselMap.cam.instance.transform.position = vesselMap.player.camPos;
	vesselMap.cam.instance.transform.rotation = vesselMap.player.camRot;
	
	//Debug.Log(vesselMap.player.distance);
	GUI_.SendMessage("increaseDistance", vesselMap.player.distance);
	moveSpeed = Mathf.Log(vesselMap.player.distance+8);
	
//	Spark.transform.position = vesselMap.player.camPos + vesselMap.player.camRot * Vector3(0,0,5);
//	Spark.transform.rotation = Quaternion.LookRotation(vesselMap.player.camPos - Spark.transform.position);	
}

	


