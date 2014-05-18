#pragma strict

//these are tubes and its prefabs

var TU_0 : GameObject;
var TU_1 : GameObject;
var CELL : GameObject;
var CAM : GameObject;
var ADDONE : GameObject;


static var vesselMap = new Map(2);

function Start(){
	// initialize models in real scene
/*	var vess : Vessel;
	for (var i = 0; i < vesselMap.map.length; ++i){
		vess = vesselMap.map[i];
		InstantiateVessel(vess);
	}*/
	var cell : Cell = vesselMap.player;
	vesselMap.player.instance = Instantiate(CELL, cell.position, cell.rotation);
	var cam : Cell = vesselMap.cam;
	cam.instance = Instantiate(CAM, cam.position, cam.rotation);
}

function InstantiateVessel(vess : Vessel){
	var item : BloodItem;
	switch (vess.vessType){
			case 0:
				vess.instance = Instantiate(TU_0, vess.startPoint, vess.quaRotation);
				break;
			case 1:
				vess.instance = Instantiate(TU_1, vess.startPoint, vess.quaRotation);
				break;
		}
	//	vess.AddItemRandom(0);
	for (var j = 0; j < vess.items.length; ++j){
		item = vess.items[j];
		item.instance = Instantiate(ADDONE, item.position, Quaternion(0, 0, 0, 1));
	}
}

static var rotateSpeed : float;
static var moveSpeed : float;

function Update(){
	while(vesselMap.newVessel > 0){
		InstantiateVessel(vesselMap.map[vesselMap.map.length - vesselMap.newVessel]);
		vesselMap.newVessel -= 1;
	}

	if(Input.GetKeyDown(KeyCode.A)){
		rotateSpeed = -100;
	}
	if(Input.GetKeyDown(KeyCode.D)){
		rotateSpeed = 100;
	}
	if(Input.GetKeyUp(KeyCode.D) || Input.GetKeyUp(KeyCode.A)){
		rotateSpeed = 0;
	}
	if(Input.GetKeyDown(KeyCode.W)){
		moveSpeed = 3;
	}
	if(Input.GetKeyUp(KeyCode.W)){
		moveSpeed = 0;
	}
	
	vesselMap.Rotate(vesselMap.player, rotateSpeed * Time.deltaTime);
	vesselMap.SetSpeed(vesselMap.player, moveSpeed);
	vesselMap.Move(vesselMap.player, Time.deltaTime);
	vesselMap.ItemHit(vesselMap.player);
	
	vesselMap.cam.instance.transform.position = vesselMap.player.camPos;
	vesselMap.cam.instance.transform.rotation = vesselMap.player.camRot;
	
}

public class Map{
	public var map : Array; 
	public var lastPoint : Vector3;
	public var lastRotation : Quaternion;
	public var player : Cell;	
	public var cam : Cell;
	public var mode : int;
	public var vesselOff : int;
	public var newVessel : int;
	
	
	public function Map(){
		mode = 0;
		map = new Array();
		lastPoint = Vector3.zero;
		lastRotation = Quaternion(0, 0, 0, 1);
		//now it's only a randon map
		AddVessel(0);
		AddVessel(1);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(1);
		AddVessel(0);
		AddVessel(0);
		AddVessel(1);
		AddVessel(1);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(1);
		AddVessel(1);
		AddVessel(0);		
		
		player = new Cell(0, 0.15, 0, 0, map);
		//cam = new Cell(13, 0, 1, 17, map);
		cam = new Cell(13, 0, 1, 17, map);
	}
	
	public function Map(gameMode : int){
		map = new Array();
		lastPoint = Vector3.zero;
		lastRotation = Quaternion(0, 0, 0, 1);
		mode = gameMode;
		if(mode == 2){	//endless mode
			vesselOff = 0;
			for (var i = 0; i < 10; ++i){
				AddVessel(0);	
			}
		}
		player = new Cell(0, 0.15, 0, 1, map);
		cam = new Cell(13, 0, 1, 0, map);
	}
	
	public function Move(cell : Cell, time : float){
		Debug.Log(cell.curVess - vesselOff);

		var vess : Vessel = map[cell.curVess - vesselOff];
		//beneth is a unclear model, we can modify it later
		var rots = cell.rotateAngle * Mathf.PI / 180.0;
		var speedModifier : float = 1;
		if(vess.vessType%2 != 0){
			speedModifier = 1.0 / (1 - Mathf.Cos(rots) * vess.radius/vess.rotateRadius);
		}
		var nextPos = vess.NextCentPos(cell.centPos, cell.speed * speedModifier, time);
		cell.distance += nextPos - cell.centPos;
		cell.centPos = nextPos;
		// go to the next vessel
		if (cell.centPos > vess.vessLength){
			if(mode == 2){
				//destroy the vessels
				var oldVess : Vessel = map[0];
				GameObject.Destroy(oldVess.instance, 0);
				map.RemoveAt(0);
				vesselOff += 1;
				if (Random.value > 0.5){
					AddVessel(1);
				}
				else {
					AddVessel(0);
				}
			}
			cell.centPos -= vess.vessLength;
			cell.curVess += 1;
			// at the end
			vess = map[cell.curVess - vesselOff];
		}
		cell.UpdatePos(vess);	
/*		if( cell == player){
			cam.instance.transform.position = cell.position 
		}*/
	}
	
	public function SetSpeed(cell : Cell, sp : float){
		cell.speed = sp;
	}
	
	public function Rotate(cell : Cell, ra : float){
		cell.Rotate(ra);
		cell.UpdatePos(map[cell.curVess - vesselOff]);
	}
	
	public function AddVessel(type: int){
		var vess : Vessel;
		switch (type){
			case 0 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(2, 1);
				break;
			case 1 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(2, 60);
				break;
			default :
				break;
		}
		map.Push(vess);
		newVessel += 1;
		lastPoint = vess.endPoint;
		lastRotation = vess.endRotation;
	}
	
	public function ItemHit(cell : Cell){
		var vess : Vessel = map[cell.curVess - vesselOff];
		var item : BloodItem;
		for (var j = 0; j < vess.items.length; ++j){
			item = vess.items[j];
			if(item.OnCollision(cell)){
				GameObject.Destroy(item.instance, 0);
				vess.items.remove(item);
				item.ActOn(cell);
			}
		}
	}
}
	
//------------------------
// 1 for Float Mode
// 0 for Ground Mode
public class Cell{
	public var cellType : int;
	
	public var position : Vector3;
	public var rotation : Quaternion;
	public var radius : float;
	public var instance : GameObject;
	
	public var mode : int;
	public var centPos : float;
	public var curVess : int;
	public var speed : float;
	public var rotateAngle : float;
	
	public var distance : float;
	public var score : int;
	
	public var camPos : Vector3;
	public var camRot : Quaternion;

	public function Cell(type : int, rd : float, startMode : int, cv : int, map : Array){
		cellType = type;
		radius = rd;
		mode = startMode;
		curVess = cv;
		distance = 0;
		var vess : Vessel = map[curVess];
		var lookat = vess.CentPos2ForwardDir(centPos);
		var up = vess.GetUpDir(centPos, rotateAngle);
		var rad = vess.GetRadius(centPos);
		rotation = Quaternion.LookRotation(lookat, up);
		position = vess.CentPos2RealPos(centPos);
		if(mode == 0){
			position -= (rad - radius) * up;
		}
	}
	
	public function Rotate(angle : float){
		rotateAngle = rotateAngle + angle;
		while(rotateAngle > 360){
			rotateAngle -= 360;
		}
		while(rotateAngle < 0){
			rotateAngle += 360;
		}
	}
	
	public function UpdatePos(vess : Vessel){
		var lookat = vess.CentPos2ForwardDir(centPos);
		var up = vess.GetUpDir(centPos, rotateAngle);
		var rad = vess.GetRadius(centPos);
		rotation = Quaternion.LookRotation(lookat, up);
		position = vess.CentPos2RealPos(centPos);
		// to modified by speed later
		camPos = position - 2 * rad * lookat;
		if(mode == 0){
			position -= (rad - radius) * up;
		}
		instance.transform.position = position;
		instance.transform.rotation = rotation;
		camRot = Quaternion.LookRotation(lookat, up);
	}
	
	public function SwitchMode(){
		mode = 1 - mode;
	}
}

//---------------------------------------------------------------------------------------------------------
public class BloodItem{
	public var itemType : int;
	public var radius : float;
	public var position : Vector3;
	public var instance : GameObject;
	
	public function BloodItem(type : int, r : float, pos : Vector3){	
		itemType = type;
		radius = r;
		position = pos;
	}
	
	public function OnCollision(cell : Cell) : boolean{
		var sqrDis = (cell.position - position).sqrMagnitude;
		if(sqrDis < (cell.radius + radius) * (cell.radius + radius))
			return true;
		return false;
	}
	
	public function ActOn(cell : Cell){
		switch (itemType){
			case 0:
				cell.score += 1;
				break;
			case 1:
				cell.score -= 1;
				break;
			default:
				break;
		}
	}
}
//---------------------------------------------------------------------------------------------------------

public class Vessel{
	public var vessType : int;  // 0 for straight tube , 1 for bend tube
	public var startPoint : Vector3;
	public var modRotation : float;
	public var quaRotation : Quaternion;
	public var radius : float;
	
	public var instance : GameObject;
	
	
	// these are properties of straight tube
	public var vessLength : float;
	public var endRadius : float; // radius changed rate  = delta radius/tu
	
	// these are properties of bend tube
	public var rotateRadius : float;
	public var rotateAngle : float;
	
	public var items : Array;
	
	//these are properties to be calculated
	public var endPoint : Vector3;
	public var endRotation : Quaternion;
	
	public function Vessel(type : int, sp : Vector3, mr : float, qr : Quaternion, r : float){
		vessType = type;
		startPoint = sp;
		modRotation = mr;
		quaRotation = qr * Quaternion.AngleAxis(modRotation, Vector3.up);
		radius = r;
		items = new Array();
	}
	
	public function SetProperty(a : float, b : float){
		if(vessType % 2 == 0){
			vessLength = a;
			endRadius = b;
			endPoint = startPoint + Vector3(0, vessLength, 0);
			endPoint = quaRotation * (endPoint - startPoint) + startPoint;
			endRotation = quaRotation;
		}
		else {
			rotateRadius = a;
			rotateAngle = b; 
			var rots = rotateAngle * Mathf.PI / 180.0;
			vessLength = rots * rotateRadius;
			endPoint = startPoint + Vector3(0, rotateRadius * Mathf.Sin(rots), rotateRadius * (1 - Mathf.Cos(rots)));			
			endPoint = quaRotation * (endPoint - startPoint) + startPoint;
			endRotation = Quaternion.AngleAxis(rotateAngle, Vector3(1, 0, 0)) * quaRotation;
		}
	}
	
	public function NextCentPos(prePos : float, speed : float, time : float) : float{
		return prePos + speed * time;
	}
	
	public function CentPos2RealPos(centPos : float) : Vector3{
		var pos : Vector3;
		if(vessType % 2 == 0){
			pos = (endPoint - startPoint) * (centPos / vessLength) + startPoint;
		}
		else{
			var rots  = centPos / rotateRadius;
			pos = startPoint + Vector3(0, rotateRadius * Mathf.Sin(rots), rotateRadius * (1 - Mathf.Cos(rots)));		
			pos = quaRotation * (pos - startPoint) + startPoint;
		}
		return pos;
	}
	
	public function CentPos2ForwardDir(centPos : float) : Vector3{
		var dir : Vector3;
		if(vessType % 2 == 0){
			dir = (endPoint - startPoint).normalized;
		}
		else{
			var angle = centPos / rotateRadius * 180 / Mathf.PI;
			var q = Quaternion.AngleAxis(angle, Vector3(1, 0, 0));
			dir = (quaRotation * q * Vector3.up).normalized;
		}
		return dir;
	}
	
	public function GetUpDir(centPos : float, rotAngle : float) : Vector3{
	//	rotAngle = 45;
		var dir : Vector3 = Vector3(0, 0, -1);
		if(vessType % 2 == 0){
			dir = quaRotation * Quaternion.AngleAxis(rotAngle, Vector3.up) * dir;
		}
		else{
			var angle = centPos / rotateRadius * 180 / Mathf.PI;
			dir = quaRotation * Quaternion.AngleAxis(angle, Vector3(1, 0 ,0)) * Quaternion.AngleAxis(rotAngle, Vector3(0, 1 ,0)) * dir;
		}
		return dir.normalized;
	}
	
	public function GetRadius(centPos: float) : float{
		var k : float = centPos / vessLength;
		if(vessType % 2 == 0){
			return (1 - k) * radius + k * endRadius;
		}
		else{
			return radius;
		}
	}
	
	public function AddItemRandom(type : int){
		var cp = Random.Range(0, vessLength);
		var pos = CentPos2RealPos(cp);
		var up = GetUpDir(cp, Random.Range(0, 360));
		var rad = GetRadius(cp);
		pos -= (rad - 0.1) * up;
		var item = new BloodItem(type, 0.1, pos);
		items.Add(item);
	}
}