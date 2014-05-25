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

static var vesselMap = new Map(2);

static function getCamPos(){
	return vesselMap.player.camPos;
}
static function getScore(){
	return vesselMap.player.score;
}

function gameOver(distance : float){
	
	// write player distance to file
	
	//var sw : StreamWriter = new StreamWriter("userinfo");
	//sw.WriteLine(distance);
	
	Application.LoadLevel("gameover");

}

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
				vess.instance = Instantiate(ST_1_1_2, vess.startPoint, vess.quaRotation);
				break;
			case 1:
				vess.instance = Instantiate(BT_1_2_60, vess.startPoint, vess.quaRotation);
				break;
			case 2:
				vess.instance = Instantiate(ST_1_1h_4, vess.startPoint, vess.quaRotation);
				break;
			case 3:
				vess.instance = Instantiate(BT_1_1_30, vess.startPoint, vess.quaRotation);
				break;
			case 4:
				vess.instance = Instantiate(ST_1h_1h_3, vess.startPoint, vess.quaRotation);
				break;
			case 5:
				vess.instance = Instantiate(BT_1_2_30, vess.startPoint, vess.quaRotation);
				break;
			case 6:
				vess.instance = Instantiate(ST_1h_1_4, vess.startPoint, vess.quaRotation);
				break;
			case 7:
				vess.instance = Instantiate(BT_1_3_30, vess.startPoint, vess.quaRotation);
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

static var rotateSpeed : float;
static var moveSpeed : float;
static var lrSpeed : float = 0;
static var udSpeed : float = 0;

function Update(){
	while(vesselMap.newVessel > 0){
		InstantiateVessel(vesselMap.map[vesselMap.map.length - vesselMap.newVessel]);
		vesselMap.newVessel -= 1;
	}
	if(vesselMap.player.mode == 0){
		if(Input.GetKeyDown(KeyCode.A)){
			rotateSpeed = -300;
		}
		if(Input.GetKeyDown(KeyCode.D)){
			rotateSpeed = 300;
		}
		if(Input.GetKeyUp(KeyCode.D) || Input.GetKeyUp(KeyCode.A)){
			rotateSpeed = 0;
		}
		if(!vesselMap.player.onSwitch)
			vesselMap.Rotate(vesselMap.player, rotateSpeed * Time.deltaTime);
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
		vesselMap.player.SwitchMode();
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
	
	Spark.transform.position = vesselMap.player.camPos + vesselMap.player.camRot * Vector3(0,0,5);
	Spark.transform.rotation = Quaternion.LookRotation(vesselMap.player.camPos - Spark.transform.position);	
/*	
	vesselMap.Rotate(vesselMap.cam, rotateSpeed * Time.deltaTime);
	vesselMap.SetSpeed(vesselMap.cam, moveSpeed);
	vesselMap.Move(vesselMap.cam, Time.deltaTime);
	*/
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
	
	//paras for random map generation
	public var curVesselRadius : float;
	public var curATPRotate : float;
	public var ATPnum : int;
	public var ATPoff : int;
	public var numOfBT : int;
	public var ATPGap : int;
	public var virusGap : int;
	
	public function Map(){
		mode = 0;
		map = new Array();
		lastPoint = Vector3.zero;
		lastRotation = Quaternion(0, 0, 0, 1);
		//now it's only a randon map
		AddVessel(0);AddVessel(1);AddVessel(0);AddVessel(0);AddVessel(0);
		AddVessel(1);AddVessel(0);AddVessel(0);AddVessel(1);AddVessel(1);
		AddVessel(0);AddVessel(0);AddVessel(0);AddVessel(0);AddVessel(0);
		AddVessel(1);AddVessel(1);AddVessel(0);			
		player = new Cell(0, 0.15, 0, 0, map, 0);
		//cam = new Cell(13, 0, 1, 17, map);
		cam = new Cell(13, 0, 1, 17, map, 0);
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
		player = new Cell(0, 0.15, 0, 1, map, 0);
		cam = new Cell(13, 0, 1, 0, map, 0);
	}
	
	public function Move(cell : Cell, time : float){
		var vess : Vessel = map[cell.curVess - vesselOff];
		//beneth is a unclear model, we can modify it later
		var rots = cell.RealRotate() * Mathf.PI / 180.0;
		var speedModifier : float = 1;
		if(vess.vessType%2 != 0){
			speedModifier = 1.0 / (1 - 0.5 * Mathf.Cos(rots) * cell.posOff.magnitude * vess.radius/vess.rotateRadius);
		}
		var nextPos = vess.NextCentPos(cell.centPos, cell.speed * speedModifier, time);
		cell.distance += nextPos - cell.centPos;
		cell.centPos = nextPos;
		// go to the next vessel--------------------------
		
		if (cell.centPos > vess.vessLength){
			if(mode == 2){
			//destroy the vessels
				AbandonVessel();
				RandomGenerateVessel();	
			}
			vess = SwitchToNextVessel(cell, vess);
		}
		//------------switch mode-------------------------------------------
		if(cell.onSwitch){
			cell.SmoothPosOff(time);
		}
		//-----------------------------------
		cell.UpdatePos(vess);	
	}
	
	public function SetSpeed(cell : Cell, sp : float){
		cell.speed = sp;
	}
	
	public function Rotate(cell : Cell, ra : float){
		cell.Rotate(ra);
		cell.UpdatePos(map[cell.curVess - vesselOff]);
	}
	
	public function AbandonVessel(){
		var oldVess : Vessel = map[0];
		var item : BloodItem;
		for(var j = 0; j < oldVess.items.length; ++j){
			item = oldVess.items[j];
			GameObject.Destroy(item.instance, 0);
		}
		GameObject.Destroy(oldVess.instance, 0);
		if(oldVess.vessType % 2 != 0)
			numOfBT -= 1;
		map.RemoveAt(0);
		vesselOff += 1;
	}
	
	public function SwitchToNextVessel(cell : Cell, vess : Vessel) : Vessel{
		cell.centPos -= vess.vessLength;
		cell.curVess += 1;
		// at the end
		vess = map[cell.curVess - vesselOff];	
		cell.Rotate(-vess.modRotation);
		return vess;
	}
	
	public function RandomGenerateVessel(){
		var vess : Vessel;
		if(numOfBT < 3){
			vess = AddVessel(1);
			numOfBT += 1;
		}
		else {	
			if (Random.value > 0.7){
				vess = AddVessel(1);
				numOfBT += 1;
			}
			else {
				vess = AddVessel(0);
			}
		}
		
		//ATP generation
		curATPRotate -= vess.modRotation;
		ATPoff = 1;
		if(ATPGap > 0){ // add no ATP
			ATPGap -= 1;
			if(ATPGap == 0){
				ATPnum = 0;
				curATPRotate = Random.Range(0, 360);
				//currently use ground 
				ATPoff = 1;
			}
		}
		else { // add ATP
			var num = 2;
			var perLen = vess.vessLength / num;
			for(var i = 0; i < num; i++){
				vess.AddItem(0, perLen * i, curATPRotate, ATPoff);
			}
			ATPnum += num;
			if(ATPnum == 5 * num){
				ATPGap = 3;
			}
		}
		
		//virus generation
		if (virusGap > 0){
			virusGap -= 1;
		}
		else {
			virusGap += 2;
			vess.AddItemRandom(1);
		}
	}
	
	public function AddVessel(type: int) : Vessel{
		var vess : Vessel;
		switch (type){
			case 0 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(2, 1);
				break;
			case 1 :
				vess = new Vessel(type, lastPoint, 45, lastRotation, 1);
				vess.SetProperty(2, 60);
				break;
			case 2 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(4, 1.5);
				break;
			case 3 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(1, 30);
				break;
			case 4 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1.5);
				vess.SetProperty(3, 1.5);
				break;
			case 5 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(2, 30);
				break;
			case 6 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1.5);
				vess.SetProperty(4, 1);
				break;
			case 7 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(3, 30);
				break;
			default :
				break;
		}
		map.Push(vess);
		newVessel += 1;
		lastPoint = vess.endPoint;
		lastRotation = vess.endRotation;
		return vess;
	}
	
	public function ItemHit(cell : Cell) : boolean{
		var vess : Vessel = map[cell.curVess - vesselOff];
		var item : BloodItem;
		var hasHitVirus = false;
		for (var j = 0; j < vess.items.length; ++j){
			item = vess.items[j];
			if(item.OnCollision(cell)){
				GameObject.Destroy(item.instance, 0);
				vess.items.remove(item);
				item.ActOn(cell);
				if(item.itemType == 1){
					hasHitVirus = true;
				}
			}
		}
		return hasHitVirus;
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
	
	//paras for drift mode
	public var posOff : Vector3;
	public var aimOff : Vector3;	
	public var onSwitch : boolean;
	
	public var distance : float;
	public var score : int;
	
	public var camPos : Vector3;
	public var camRot : Quaternion;

	public function Cell(type : int, rd : float, startMode : int, cv : int, map : Array, vesselOff : int){
		cellType = type;
		radius = rd;
		mode = startMode;
		curVess = cv;
		distance = 0;
		var vess : Vessel = map[curVess - vesselOff];
		if(mode == 0){
			posOff = Vector3(0, -1, 0);
		}
		else posOff = Vector3(0, 0, 0);
		UpdatePos(vess);
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
	
	public function Shift(offSpeed : Vector3){
		posOff += offSpeed;
		if(posOff.sqrMagnitude > 1)
			posOff.Normalize();
	}
	
	public function RealRotate() : float{
		var angle = Vector3.Angle(Vector3(0, -1, 0), posOff);
		if( posOff.x < 0)
			angle = -angle;
		return rotateAngle + angle;
	}
	
	public function UpdatePos(vess : Vessel){
		var lookat = vess.CentPos2ForwardDir(centPos);
		var up = vess.GetUpDir(centPos, rotateAngle);
		var rad = vess.GetRadius(centPos);
		rotation = Quaternion.LookRotation(lookat, up);
		position = vess.CentPos2RealPos(centPos);
		// to modified by speed later
		camPos = position - 2 * rad * lookat;
		
		position += (rad - radius) * (rotation * posOff);
	/*	
		if(instance != null){
			instance.transform.position = position;
			instance.transform.rotation = rotation;
		}*/
		camRot = Quaternion.LookRotation(lookat, up);
	}
	
	public function SwitchMode(){
		if(!onSwitch){
			mode = 1 - mode;
			onSwitch = true;
			if(mode == 0)
				aimOff = Vector3(0, -1, 0);
			else aimOff = Vector3(0, 0, 0);
		}
	}
	// speed = 1 / 0.5 = 2;
	public function SmoothPosOff(time : float){
		if((aimOff - posOff).sqrMagnitude < 0.01){
			onSwitch = false;
			return ;
		}
		posOff += (aimOff - posOff) * 4 * time;
	}
}

//---------------------------------------------------------------------------------------------------------
public class BloodItem{
	public var itemType : int;
	public var radius : float;
	public var position : Vector3;
	public var rotation : Quaternion;
	public var instance : GameObject;
	
	public function BloodItem(type : int, r : float, pos : Vector3, rot : Quaternion){	
		itemType = type;
		radius = r;
		position = pos;
		rotation = rot;
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
				cell.score -= 10;
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
		quaRotation =  qr * Quaternion.AngleAxis(modRotation, Vector3(0, 1, 0));
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
			endRotation = quaRotation  * Quaternion.AngleAxis(rotateAngle, Vector3(1, 0, 0));
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
		var lookat = CentPos2ForwardDir(cp);
		var up = GetUpDir(cp, Random.Range(0, 360));
		var rad = GetRadius(cp);
		var off = Random.insideUnitCircle;
		var posOff = Vector3(off.x, off.y, 0);
		var itemRad = 0.2;
		if(type == 1){
			itemRad = 0.4;
		}
		var rot = Quaternion.LookRotation(-lookat, up);
		pos = pos + (rad - itemRad) * (Quaternion.LookRotation(lookat, up) * up);
		var item = new BloodItem(type, itemRad, pos, rot);
		items.Add(item);
	}
	
	public function AddItem(type : int, cp : float, ra : float, off : float){
		var pos = CentPos2RealPos(cp);
		var lookat = CentPos2ForwardDir(cp);
		var up = GetUpDir(cp, ra);
		var rad = GetRadius(cp);
	//	var posOff = Vector3(off.x, off.y, 0);
		var itemRad = 0.2;
		if(type == 1){
			itemRad = 0.4;
		}
		var rot = Quaternion.LookRotation(-lookat, up);
		pos = pos - off * (rad - itemRad) * up;
		var item = new BloodItem(type, itemRad, pos, rot);
		items.Add(item);
	}
}