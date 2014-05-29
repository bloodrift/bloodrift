#pragma strict

public class Map{
	public var map : Array; 
	public var lastPoint : Vector3;
	public var lastRotation : Quaternion;
	public var player : Cell;	
	public var cam : Cell;
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
		map = new Array();
		lastPoint = Vector3.zero;
		lastRotation = Quaternion(0, 0, 0, 1);
		vesselOff = 0;
		for (var i = 0; i < 7; ++i){
			AddVessel(0);	
		}
		AddVessel(1);AddVessel(1);AddVessel(1);
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
		var nextPos : float;
		if (!cell.onRush)
			nextPos = vess.NextCentPos(cell.centPos, cell.speed * speedModifier, time);
		else {
			//get speed	
			var sp : float = cell.rushSpeed();
			nextPos = vess.NextCentPos(cell.centPos, sp, time);
			cell.leftRushTime -= time;
			if (cell.leftRushTime <= 0){
				cell.onRush = false;
				cell.leftRushTime = 0;
				var indieEffects : IndieEffects = cam.instance.GetComponent(IndieEffects);
				indieEffects.motionBlur = false;
			}
		}
		
		cell.distance += nextPos - cell.centPos;
		cell.centPos = nextPos;
		
		cell.Rotate(time);
		// go to the next vessel--------------------------
		
		if (cell.centPos > vess.vessLength){
					//destroy the vessels
			AbandonVessel();
			RandomGenerateVessel();	
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
	
	public function SetRotateForce(cell : Cell, rf : float){
		cell.rotateForce = rf;
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
		cell.rotateAngle -= vess.modRotation;

		if(vess.vessType % 2 != 0){	
			var rr = -100 *(1 + cell.speed / 14) * Mathf.Sin(cell.RealRotate() * Mathf.PI / 180.0);
			Debug.Log(cell.RealRotate());
			Debug.Log(rr);
			cell.rotateSpeed -= rr;
		}
		if(cell.rotateSpeed < -Global.maxRotateSpeed)
			cell.rotateSpeed = -Global.maxRotateSpeed;
		if(cell.rotateSpeed > Global.maxRotateSpeed)
			cell.rotateSpeed = Global.maxRotateSpeed;
			
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
				if(item.itemType == 1 && !cell.onRush){
					hasHitVirus = true;
				}
			}
		}
		return hasHitVirus;
	}
	
}