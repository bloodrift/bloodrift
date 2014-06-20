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
var WHITECELL : GameObject;
var TRIANGLECELL : GameObject;
var CAM : GameObject;
var ATP : GameObject;
var VIRUS : GameObject;
var HEMO : GameObject;

var GUICarrier : GameObject;
//var mainui : MainUi ;

var Spark : GameObject;

static public class Global{
	public var gameStart : boolean = false;
	static public var mainVessel : int = 2;
	static public var maxVessel : int = 10;

	static public var rushSpeed : float = 15;
	static public var maxShiftSpeed : float = 3;
	static public var maxShiftForce : float = 12;
	static public var shiftDragForce : float = 3;
	static public var gravity : float = 0.6;
	
	static public var typeRedCell : int = 0;
	static public var RedCellRadius : float = 0.15;
	
	static public var typeWhiteCell : int = 1;
	static public var WhiteCellRadius : float = 0.12;
	
	static public var typeTriangleCell : int = 2;
	static public var TriangleCellRadius : float = 0.15;
	
	static public var typeATP : int = 0;
	static public var ATPgap : float = 0.5;
	static public var ATPradius : float = 0.15;
	
	static public var typeVIRUS : int = 1;
	static public var VIRUSradius : float = 0.15;
	
	static public var typeHEMO : int = 2;
	static public var HEMOradius : float = 0.25;
	
	static public var boundFactor : float = 0.2;
	static public var visibleRange : float = 5;
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

function StartGame(){
		Global.gameStart = true;
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
		case Global.typeRedCell :
			cell.instance = Instantiate(REDCELL, cell.position, cell.rotation);
			break;
		case Global.typeWhiteCell :
			cell.instance = Instantiate(WHITECELL, cell.position, cell.rotation);
			break;
		case Global.typeTriangleCell :
			cell.instance = Instantiate(TRIANGLECELL, cell.position, cell.rotation);
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
		if(item.itemType == Global.typeHEMO){ 
			item.instance = Instantiate(HEMO, item.position, item.rotation);
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
		AICompute(vesselMap.AICells, vesselMap.player, vesselMap.map, vesselMap.vesselOff);	
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
	
	vesselMap.Move(vesselMap.player, Time.deltaTime, 0);
	var cell : Cell;
	for (var i = vesselMap.AICells.length - 1; i >=0 ; --i){
		cell = vesselMap.AICells[i];
		vesselMap.Move(cell, Time.deltaTime, i);
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
	if(Global.gameStart){
		GUICarrier.SendMessage("OnUpdateDistance", vesselMap.player.distance);
		GUICarrier.SendMessage("OnHitVirus", vesselMap.player.life);
	}
}

public function AICompute(cells : Array, mainCell : Cell, map : Array, vesselOff : int){
	var totalPosOff : Vector3 = mainCell.posOff;
	var aimPosOff : Vector3;
	var cell : Cell;
	var vess : Vessel;
	var otherCell : Cell;
	var dis : float;
	var edgeDis : float;
	var count : int;
	var posOff : Vector3;
	for(var i = 0; i < cells.length; ++i){
		cell = cells[i];
		totalPosOff = Vector3.zero;
		count = 0;
		vess = map[cell.curVess - vesselOff];
		// check for other cells
		for(var j = 0; j < cells.length ; ++j){
			otherCell = cells[j];
			dis = Mathf.Max(Vector3.Distance(cell.position, otherCell.position), 0.1);
			if( dis < Global.visibleRange){
				totalPosOff += (cell.posOff - otherCell.posOff).normalized / (1 * dis);
				count ++;
				if(cell.OnCollision(otherCell)){
					posOff = (otherCell.posOff - cell.posOff).normalized;
					cell.posSpeed += -2 * posOff.normalized / 2; 
					otherCell.posSpeed += 2 * posOff.normalized / 2;
				}
			}
		}
		dis = Mathf.Max(Vector3.Distance(cell.position, mainCell.position), 0.1);
		if(dis < Global.visibleRange){
			var playerPosOff = (cell.posOff - mainCell.posOff).normalized / (5 * dis);
			if(cell.OnCollision(mainCell)){
				posOff = (mainCell.posOff - cell.posOff).normalized;
		//		cell.posSpeed += -1.5 * (mainCell.posSpeed.magnitude + 1)/ Global.maxShiftSpeed * posOff.normalized / 2; 
		//		mainCell.posSpeed += 1.5 * (cell.posSpeed.magnitude + 1)/ Global.maxShiftSpeed * posOff.normalized / 2;
				cell.posSpeed += -2 * posOff.normalized / 2; 
				mainCell.posSpeed += 2 * posOff.normalized / 2;
			}
		}
	
		//check for bound
		var curRadius = vess.GetRadius(cell.centPos);
		dis = Mathf.Max(cell.EdgeDistance(vess) / (curRadius * curRadius), 0.12);
		if(dis < 0.65 * curRadius){
			var edgePosOff : Vector3 = - cell.posOff / (100 *  (dis - 0.1) * (dis - 0.1));
		}
		//final compute
		if (vess.vessType%2 != 0)
			var shiftRotForce : Vector3 = (2 * Global.shiftDragForce + cell.speed / Global.rushSpeed* (Global.maxShiftForce - Global.shiftDragForce)) * (Quaternion.AngleAxis(-cell.rotateAngle, Vector3(0, 0, 1)) * Vector3(0, 1, 0));
			
		if( vess.vessType == 6)
			var midForce = -(cell.posOff - cell.posOff.normalized);	
		
	//	totalPosOff = (totalPosOff / count) + edgePosOff - shiftRotForce / Global.maxShiftForce;
	//	totalPosOff = (totalPosOff / count) - shiftRotForce / Global.maxShiftForce;
	//	totalPosOff = - shiftRotForce / Global.maxShiftForce;
	//	totalPosOff = edgePosOff - shiftRotForce / Global.maxShiftForce;
		totalPosOff = edgePosOff + midForce + (totalPosOff / count) + playerPosOff;
		if(totalPosOff.sqrMagnitude > 1)
			totalPosOff = totalPosOff.normalized;
		cell.posForce = Global.maxShiftForce * totalPosOff;
	}
}

	


