#pragma strict
//these are tubes and its prefabs

var ST_1_1_2 : GameObject;
var ST_1_2_2 : GameObject;
var ST_2_2_4 : GameObject;
var ST_2_1_2 : GameObject;
var BT_1_3_30 : GameObject;
var BT_1_5_30 : GameObject;
var BT_2_6_30 : GameObject;

var REDCELL : GameObject;
var CAM : GameObject;
var ATP : GameObject;
var VIRUS : GameObject;

var GUICarrier : GameObject;
//var mainui : MainUi ;

var Spark : GameObject;

public class Global{
	static public var gameStart : boolean = false;
	static public var mainVessel : int = 2;
	static public var maxVessel : int = 10;

	static public var rushSpeed : float = 15;
	static public var maxShiftSpeed : float = 3;
	static public var maxShiftForce : float = 12;
	static public var gravity : float = 0.6;
	
	static public var typeRedCell : int = 0;
	static public var RedCellRadius : float = 0.15;
	
	static public var typeATP : int = 0;
	static public var ATPgap : float = 0.5;
	static public var ATPradius : float = 0.15;
	
	static public var typeVIRUS : int = 1;
	static public var VIRUSradius : float = 0.15;
	
	static public var BoundFactor : float = 1.5;
	static public var visibleRange : float = 10;
	static public var AIActPerFrame : int = 5;
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
	
	var cell : Cell = vesselMap.cam;
	cell.instance = CAM;
	InstantiateCell(vesselMap.player);
	for (var i = 0 ; i < vesselMap.AICells.length; i++){
		cell = vesselMap.AICells[i];
		InstantiateCell(cell);
	}
	
	// find gui object;
	GUICarrier = GameObject.Find("GUICarrier");
	//mainui = GUICarrier.GetComponent(MainUi);
}

function InstantiateCell(cell : Cell){
	switch (cell.cellType){
		case Global.typeRedCell:
			cell.instance = Instantiate(REDCELL, cell.position, cell.rotation);
			break;
		default:
			break;
	}
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
static var frameCount : int = Global.AIActPerFrame - 1;

function Update(){
	frameCount = (frameCount + 1) % Global.AIActPerFrame;
	if(frameCount == 0)
		AICompute(vesselMap.AICells, vesselMap.player);
		
	
	
}

function FixedUpdate(){
	//add new vessels
	while(vesselMap.newVessel > 0){
		InstantiateVessel(vesselMap.map[vesselMap.map.length - vesselMap.newVessel]);
		vesselMap.newVessel -= 1;
	}
	
	while(vesselMap.newCell > 0){
		InstantiateCell(vesselMap.AICells[vesselMap.AICells.length - vesselMap.newCell]);
		vesselMap.newCell -= 1;
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
	
	vesselMap.Move(vesselMap.player, Time.deltaTime);
	var cell : Cell;
	for (var i = vesselMap.AICells.length - 1; i >=0 ; --i){
		cell = vesselMap.AICells[i];
		if(!vesselMap.Move(cell, Time.deltaTime)){
			Destroy(cell.instance);
			vesselMap.AICells.remove(i);
		}
	}
	
/*	if(Input.GetKeyDown(KeyCode.C)){
		vesselMap.player.Rush(3);
		var indieEffects : IndieEffects = CAM.GetComponent(IndieEffects);
		indieEffects.motionBlur = true;
	}*/
	
	vesselMap.ItemHit(vesselMap.player);
	vesselMap.cam.instance.transform.position = vesselMap.player.t_camPos;
	vesselMap.cam.instance.transform.rotation = vesselMap.player.camRot;
	
	//GUI_.SendMessage("increaseDistance", vesselMap.player.distance);
	//mainui.OnUpdateDistance(vesselMap.player.distance);
	GUICarrier.SendMessage("OnUpdateDistance",vesselMap.player.distance);
}

public function AICompute(cells : Array, mainCell : Cell){
	var totalPosOff : Vector3 = mainCell.posOff;
	var aimPosOff : Vector3;
	var cell : Cell;
	var otherCell : Cell;
	var count : int;
	for(var i = 0; i < cells.length; ++i){
		cell = cells[i];
		totalPosOff = Vector3.zero;
		count = 0;
		for(var j = 0; j < cells.length ; ++j){
			otherCell = cells[j];
		//	if(Vector3.Distance(cell.position, otherCell.position) < Global.visibleRange){
				totalPosOff += otherCell.posOff;
				count ++;
		//	}
		}
		if(Vector3.Distance(cell.position, mainCell.position) < Global.visibleRange){
			totalPosOff += mainCell.posOff;
			count ++;
		}
		aimPosOff = -totalPosOff/count;
		cell.posForce = Global.maxShiftForce * (aimPosOff - cell.posOff);
	}
}

	


