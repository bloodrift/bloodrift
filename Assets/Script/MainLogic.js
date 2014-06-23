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
var BUBBLE : GameObject;
var BIGBUBBLE : GameObject;

var COLLOSION :GameObject;

var GUICarrier : GameObject;
var PlayerSystem : GameObject;
//var mainui : MainUi ;

static public class Global{
	public var GameStart : boolean = false;
	public var GameOver : boolean = false;
	
	public var GameModeEndless : int = 0;
	public var GameModeRace : int = 1;
	public var GameMode : int = GameModeEndless;
	
 	public var MainVessel : int = 2;
 	public var VesselNum : int = 10;
 	
 	public var BlockRadius : float = 0.32;
 	public var EShiftUp : int = 0;
 	public var EShiftDown : int = 1;
 	public var EShiftLeft : int = 2;
 	public var EShiftRight : int = 3;
 	
 	public var EShiftSpeed : float = 4;
 	public var ESelfRotSpeed : float = 360;
 	
 	public var EPositionCenter : int = 0;
 	public var EPositionUp : int = 1;
 	public var EPositionDown : int = 2;
 	public var EPositionLeft : int = 3;
 	public var EPositionRight : int = 4;
 	public var EPositionUpOut : int = 5;
 	public var EPositionDownOut : int = 6;
 	public var EPositionLeftOut : int = 7;
 	public var EPositionRightOut : int = 8;

 	public var rushSpeed : float = 15;
	public var ERushSpeed : float = 15; 	

 	public var maxShiftSpeed : float = 3;
 	public var maxShiftForce : float = 6;
 	public var shiftDragForce : float = 3;
 	public var gravity : float = 0.6;
 	
 	public var RMaxMoveSpeed : float = 7;
 	public var RMaxMoveSpeedAtCross : float = 5;
 	public var RMaxAccelerateForce : float = 1.5;
 	public var RMaxAccelerateDrag : float = -RMaxAccelerateForce;
 	
 	public var RBrakeForce : float = -5;

 	public var typeRedCell : int = 0;
 	public var RedCellRadius : float = 0.1;
 	
	public var typeWhiteCell : int = 1;
	public var WhiteCellRadius : float = 0.12;
	
	public var typeTriangleCell : int = 2;
	public var TriangleCellRadius : float = 0.15;
	
	public var typeBubble : int = 3;
	public var BubbleRadius : float = 0.1; 
	
	public var typeBigBubble : int = 4;
	public var BigBubbleRadius : float = 0.2;
	
	public var typeATP : int = 0;
	public var ATPgap : float = 0.5;
	public var ATPradius : float = 0.15;
	
	public var typeVIRUS : int = 1;
	public var VIRUSradius : float = 0.15;
	
	public var typeHEMO : int = 2;
	public var HEMOradius : float = 0.25;
	
	public var boundFactor : float = 0.2;
	public var visibleRange : float = 1;
	public var AIActPerFrame : int = 5;
	
	public function EPosition2PosOff(epos : int) : Vector3{
		switch (epos){
			case EPositionCenter :
				return Vector3(0, 0, 0);
			case EPositionUp :
				return Vector3(0, BlockRadius * 2, 0);
			case EPositionDown :
				return Vector3(0, -BlockRadius * 2, 0);
			case EPositionLeft :
				return Vector3(-BlockRadius * 2, 0, 0);
			case EPositionRight :
				return Vector3(BlockRadius * 2, 0, 0);
			case EPositionUpOut :
				return Vector3(0, BlockRadius * 4, 0);
			case EPositionDownOut :
				return Vector3(0, -BlockRadius * 4, 0);
			case EPositionLeftOut :
				return Vector3(-BlockRadius * 4, 0, 0);
			case EPositionRightOut :
				return Vector3(BlockRadius * 4, 0, 0);
		}	
	}
}

static var vesselMap = new Map();
//static var vesselMap = new Map();

static function getCamPos(){
	return vesselMap.player.camPos;
}

static function getScore(){
	return vesselMap.player.energy;
}

function StartGameModeRacing(playerType : int){
	Global.GameMode = Global.GameModeRace;
	ClearMap();
	for (var i = 0; i < vesselMap.map.length; ++ i){
		InstantiateVessel(vesselMap.map[i]);
	}
	for (i = 0 ; i < vesselMap.AICells.length; i++){
		InstantiateCell(vesselMap.AICells[i]);
	}
	Global.GameStart = true;
	Global.GameOver = false;
	switch (playerType){
		case Global.typeRedCell :
			vesselMap.player = new Cell(Global.typeRedCell, Global.RedCellRadius, vesselMap.player.curVess, vesselMap.map, vesselMap.vesselOff);
			break;
		case Global.typeWhiteCell :
			vesselMap.player = new Cell(Global.typeWhiteCell, Global.WhiteCellRadius, vesselMap.player.curVess, vesselMap.map, vesselMap.vesselOff);
			break;
		case Global.typeTriangleCell :
			vesselMap.player = new Cell(Global.typeTriangleCell, Global.TriangleCellRadius, vesselMap.player.curVess, vesselMap.map, vesselMap.vesselOff);
			break;	
	}
	InstantiateCell(vesselMap.player);
	vesselMap.cam.instance = CAM;
}

function StartGameModeEndless(playerType : int){
	Global.GameMode = Global.GameModeEndless;
	ClearMap();
	Global.GameStart = true;
	Global.GameOver = false;
	switch (playerType){
		case Global.typeRedCell :
			vesselMap.player = new Cell(Global.typeRedCell, Global.RedCellRadius, vesselMap.player.curVess, vesselMap.map, vesselMap.vesselOff);
			break;
		case Global.typeWhiteCell :
			vesselMap.player = new Cell(Global.typeWhiteCell, Global.WhiteCellRadius, vesselMap.player.curVess, vesselMap.map, vesselMap.vesselOff);
			break;
		case Global.typeTriangleCell :
			vesselMap.player = new Cell(Global.typeTriangleCell, Global.TriangleCellRadius, vesselMap.player.curVess, vesselMap.map, vesselMap.vesselOff);
			break;	
	}
	InstantiateCell(vesselMap.player);
	vesselMap.cam.instance = CAM;
}

function GameOver(distance : float){
	Application.LoadLevel("gameover");
}

function Start(){
	GUICarrier = GameObject.Find("GUICarrier");
	PlayerSystem = GameObject.Find("PlayerSystem");
	var cell : Cell = vesselMap.cam;
	cell.instance = CAM;
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
		case Global.typeBubble :
			cell.instance = Instantiate(BUBBLE, cell.position, cell.rotation);
			break;
		case Global.typeBigBubble :
			cell.instance = Instantiate(BIGBUBBLE, cell.position, cell.rotation);
			break;
		default:
			break;
	}
	cell.CollisionEffect = Instantiate(COLLOSION, Vector3(-100, -100, -100), Quaternion(0, 0, 0, 1));
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
static var RMoveForce : float;
static var lrSpeed : float = 0;
static var udSpeed : float = 0;
static var frameCount : int = Global.AIActPerFrame - 1;

function Update(){
	if(Global.GameMode == Global.GameModeEndless){
		while(vesselMap.newVessel > 0){
			InstantiateVessel(vesselMap.map[vesselMap.map.length - vesselMap.newVessel]);
			vesselMap.newVessel -= 1;
		}
		if(Global.GameStart && !Global.GameOver){
			if(Input.GetKeyDown(KeyCode.W)){
				vesselMap.EShift(Global.EShiftUp);
			}
			if(Input.GetKeyDown(KeyCode.S)){
				vesselMap.EShift(Global.EShiftDown);
			}
			if(Input.GetKeyDown(KeyCode.A)){
				vesselMap.EShift(Global.EShiftLeft);
			}
			if(Input.GetKeyDown(KeyCode.D)){
				vesselMap.EShift(Global.EShiftRight);
			}
			if(Input.GetKeyDown(KeyCode.Space)){
				vesselMap.ERush(vesselMap.player);
			}
			GUICarrier.SendMessage("OnUpdateDistance", vesselMap.player.distance);
			GUICarrier.SendMessage("OnUpdateBlood", vesselMap.player.life);
		}
		vesselMap.EMove(Time.deltaTime);
		if(vesselMap.player.life <= 0 && !Global.GameOver){
			Global.GameOver = true;
			Destroy(vesselMap.player.instance);
			GUICarrier.SendMessage("OnGameOver",vesselMap.player.distance);
			PlayerSystem.SendMessage("OnGameOver",vesselMap.player.distance);
			vesselMap.player.distance = 0;
		}
		if(Global.GameStart && !Global.GameOver){
			vesselMap.ItemHit(vesselMap.player);
		}
	}
	if(Global.GameMode == Global.GameModeRace){
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
		if(Input.GetKeyDown(KeyCode.J)){
			RMoveForce += Global.RMaxAccelerateForce;
		}
		if(Input.GetKeyUp(KeyCode.J)){
			RMoveForce -= Global.RMaxAccelerateForce;
		}
		if(Input.GetKeyDown(KeyCode.K)){
			RMoveForce += Global.RMaxAccelerateDrag;
		}
		if(Input.GetKeyUp(KeyCode.K)){
			RMoveForce -= Global.RMaxAccelerateDrag;
		}
		Debug.Log(vesselMap.player.speed);
		vesselMap.SetAccelerateForce(vesselMap.player, RMoveForce);
		vesselMap.SetShiftForce(vesselMap.player, Vector3(lrSpeed, udSpeed, 0));
		if(Input.GetKeyDown(KeyCode.Space)){
			vesselMap.Rush(vesselMap.player);
		}	
		
		frameCount = (frameCount + 1) % Global.AIActPerFrame;
		if(frameCount == 0)
			AICompute(vesselMap.AICells, vesselMap.player, vesselMap.map);	
	
		vesselMap.RMove(vesselMap.player, Time.deltaTime);
		var cell : Cell;
		for (var i = vesselMap.AICells.length - 1; i >=0 ; --i){
			cell = vesselMap.AICells[i];
			vesselMap.RMove(cell, Time.deltaTime);
		}
	}
	
	vesselMap.cam.instance.transform.position = vesselMap.player.camPos;
	vesselMap.cam.instance.transform.rotation = vesselMap.player.camRot;	
}

public function ClearAICells(cells : Array){
	var cell : Cell;
	for(var i = cells.length - 1; i >= 0 ; --i){
		cell = cells[i];
		Destroy(cell.CollisionEffect);
		Destroy(cell.instance);
		cells.RemoveAt(i);
	}
}

public function ClearMap(){
	for (var i = vesselMap.map.length -1; i >= 0; --i){
		var oldVess : Vessel = vesselMap.map[i];
		var item : BloodItem;
		for(var j = 0; j < oldVess.items.length; ++j){
			item = oldVess.items[j];
			GameObject.Destroy(item.instance, 0);
		}
		GameObject.Destroy(oldVess.instance, 0);
		vesselMap.map.RemoveAt(i);
	}
	if(vesselMap.AICells != null){
		ClearAICells(vesselMap.AICells);
	}
	if(vesselMap.player.instance != 0){
		Destroy(vesselMap.player.instance);
		Destroy(vesselMap.player.CollisionEffect);
	}
	vesselMap = new Map();
}

public function AICompute(cells : Array, mainCell : Cell, map : Array){
	var cell : Cell; 
	var otherCell : Cell;
	var edgeForce = Vector3.zero;
	var shiftRotForce = Vector3.zero;
	var midForce = Vector3.zero;
	var cellForce = Vector3.zero;
	var centerForce = Vector3.zero;
	for (var i = 0; i < cells.length; ++i){
		cell = cells[i];
		var vess : Vessel = map[cell.curVess];
		var nextVess : Vessel = map[(cell.curVess + 1) % map.length];
		//
		centerForce = cell.posOff / 4;
		//BoundCheck
		var curRadius = vess.GetRadius(cell.centPos);
		var dis = Mathf.Max(cell.EdgeDistance(vess) / (curRadius * curRadius), 0.12);
		if(dis < 0.7 * curRadius){
			edgeForce = -cell.posOff.normalized / (100 * (dis - 0.1) * (dis - 0.1));
		}
		//In Cross Vessel
		vesselMap.SetAccelerateForce(cell, Global.RMaxAccelerateForce);
		if (vess.vessType%2 != 0 || nextVess.vessType % 2 != 0){
			if(cell.speed > Global.RMaxMoveSpeedAtCross){
				vesselMap.SetAccelerateForce(cell, Global.RMaxAccelerateDrag);
			}
			if(vess.vessType%2 != 0){
				shiftRotForce = -(Quaternion.AngleAxis(-cell.rotateAngle, Vector3(0, 0, 1)) * Vector3(0, 1, 0));	
				if(Vector3.Dot(cell.posOff , shiftRotForce) > 0.1)
					shiftRotForce = Vector3.zero;
			}
		} 
		//check for 2 to 1 vessel
		if( vess.vessType == 6)
			midForce = -(cell.posOff - cell.posOff.normalized);
		//	check for other cells
		for(var j = 0; j < cells.length ; ++j){
			otherCell = cells[j];
			dis = Mathf.Max(Vector3.Distance(cell.position, otherCell.position), 0.3);
			if( dis < Global.visibleRange){
				var posOff = (otherCell.posOff - cell.posOff).normalized;
				cellForce += -posOff / (10 * (dis - 0.2));
				if(cell.OnCollision(otherCell)){
					cell.posSpeed += posOff.normalized / 2; 
					otherCell.posSpeed += posOff.normalized / 2;
				}
			}
		}
		dis = Mathf.Max(Vector3.Distance(cell.position, mainCell.position), 0.3);
		if(dis < Global.visibleRange){
			posOff = (mainCell.posOff - cell.posOff).normalized;
			cellForce += -posOff / (10 * (dis - 0.2));
			if(cell.OnCollision(mainCell)){
				cell.posSpeed += posOff.normalized / 2; 
				mainCell.posSpeed += posOff.normalized / 2;
			}
		}
			
		var totalPosOff = edgeForce + midForce + shiftRotForce + cellForce;
	//	var totalPosOff = edgeForce;
		if(totalPosOff.sqrMagnitude > 1)
			totalPosOff = totalPosOff.normalized;
		cell.posForce = Global.maxShiftForce * totalPosOff;
	}
	
}

	


