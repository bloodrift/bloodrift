#pragma strict
//these are tubes and its prefabs


var ST_1_1_2 : GameObject;
var ST_1_2_2 : GameObject;
var ST_2_2_4 : GameObject;
var ST_2_1_2 : GameObject;
var BT_1_3_30 : GameObject;
var BT_1_5_30 : GameObject;
var BT_2_6_30 : GameObject;

var CELL : GameObject;
var CAM : GameObject;
var ATP : GameObject;
var VIRUS : GameObject;

var GUI_ : GameObject;

var Spark : GameObject;

public class Global{
	static public var rushSpeed : float = 15;
	static public var maxShiftSpeed : float = 3;
	static public var maxShiftForce : float = 12;
	static public var gravity : float = 0.6;
	
	
	static public var typeATP : int = 0;
	static public var typeVIRUS : int = 1;
	
	static public var ATPgap : float = 0.5;
	static public var ATPradius : float = 0.15;
	
	static public var VIRUSradius : float = 0.15;
}

static var vesselMap = new Map();
//static var vesselMap = new Map();

static function getCamPos(){
	return vesselMap.player.camPos;
}

static function getScore(){
	return vesselMap.player.energy;
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
			case 2:
				vess.instance = Instantiate(ST_1_2_2, vess.startPoint, vess.quaRotation);
				break;
			case 4:
				vess.instance = Instantiate(ST_2_2_4, vess.startPoint, vess.quaRotation);
				break;
			case 6:
				vess.instance = Instantiate(ST_2_1_2, vess.startPoint, vess.quaRotation);
				break;
			case 1:
				vess.instance = Instantiate(BT_1_3_30, vess.startPoint, vess.quaRotation);
				break;
			case 3:
				vess.instance = Instantiate(BT_1_5_30, vess.startPoint, vess.quaRotation);
				break;
			case 5:
				vess.instance = Instantiate(BT_2_6_30, vess.startPoint, vess.quaRotation);
				break;
			
		}
	//	vess.AddItemRandom(0);
	for (var j = 0; j < vess.items.length; ++j){
		item = vess.items[j];
		if(item.itemType == Global.typeATP){
			item.instance = Instantiate(ATP, item.position, item.rotation);
		}
		if(item.itemType == Global.typeVIRUS){ 
			item.instance = Instantiate(VIRUS, item.position, item.rotation);
		}
	}
}

static var rotateForce : float;
static var moveSpeed : float;
static var lrSpeed : float = 0;
static var udSpeed : float = 0;


function Update(){
	//add new vessels
	while(vesselMap.newVessel > 0){
		InstantiateVessel(vesselMap.map[vesselMap.map.length - vesselMap.newVessel]);
		vesselMap.newVessel -= 1;
	}
	

	if(Input.GetKeyDown(KeyCode.A)){
		lrSpeed = -Global.maxShiftForce;
	}
	if(Input.GetKeyUp(KeyCode.A)){
		if(lrSpeed == -Global.maxShiftForce)
			lrSpeed = 0;
	}
	if(Input.GetKeyDown(KeyCode.D)){
		lrSpeed = Global.maxShiftForce;
	}
	if(Input.GetKeyUp(KeyCode.D)){
		if(lrSpeed == Global.maxShiftForce)
			lrSpeed = 0;
	}
	if(Input.GetKeyDown(KeyCode.W)){
		udSpeed = Global.maxShiftForce;
	}
	if(Input.GetKeyDown(KeyCode.S)){
		udSpeed = -Global.maxShiftForce;
	}
	if(Input.GetKeyUp(KeyCode.W)){
		if(udSpeed == Global.maxShiftForce)
			udSpeed = 0;
	}
	if(Input.GetKeyUp(KeyCode.S)){
		if(udSpeed == -Global.maxShiftForce)
			udSpeed = 0;
	}
		
	vesselMap.SetShiftForce(vesselMap.player, Vector3(lrSpeed, udSpeed, 0));
	
	if(Input.GetKeyDown(KeyCode.C)){
		vesselMap.player.Rush(3);
		var indieEffects : IndieEffects = CAM.GetComponent(IndieEffects);
		indieEffects.motionBlur = true;
	}

	vesselMap.SetSpeed(vesselMap.player, moveSpeed);
	vesselMap.Move(vesselMap.player, Time.deltaTime);
	vesselMap.ItemHit(vesselMap.player);
	
	vesselMap.player.instance.transform.position = vesselMap.player.position;
	vesselMap.player.instance.transform.rotation = vesselMap.player.rotation;
	
	vesselMap.cam.instance.transform.position = vesselMap.player.t_camPos;
	vesselMap.cam.instance.transform.rotation = vesselMap.player.camRot;
	
	//Debug.Log(vesselMap.player.distance);
	GUI_.SendMessage("increaseDistance", vesselMap.player.distance);
	moveSpeed = Mathf.Log(vesselMap.player.distance+8);
	
//	Spark.transform.position = vesselMap.player.camPos + vesselMap.player.camRot * Vector3(0,0,5);
//	Spark.transform.rotation = Quaternion.LookRotation(vesselMap.player.camPos - Spark.transform.position);	
}

	


