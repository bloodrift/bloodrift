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
	public var numOfBT : int;
	//FSM
	private var ATPnum : int;
	private var ATPgap : int;
	private var ATPcentPos : float;
	private var ATProt : float;
	private var ATPoff : float;
	
	private var VIRUSnum : int;
	
	public function Map(){
		map = new Array();
		lastPoint = Vector3.zero;
		lastRotation = Quaternion(0, 0, 0, 1);
		vesselOff = 0;
		for (var i = 0; i < 7; ++i){
			AddVessel(0);
		}
		for (var j = 0; j < 3; ++j){
			AddVessel(1);
		}
		curVesselRadius = 1;
		player = new Cell(0, 0.15, 1, map, 0);
		cam = new Cell(13, 0, 1, map, 0);
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
		
		//calculate rotate force
		cell.Shift(vess, time);

		// go to the next vessel--------------------------
		
		if (cell.centPos > vess.vessLength){
					//destroy the vessels
			AbandonVessel();
			RandomGenerateVessel();	
			vess = SwitchToNextVessel(cell, vess);
		}
		//-----------------------------------
		cell.UpdatePos(vess);	
	}
	
	public function SetSpeed(cell : Cell, sp : float){
		cell.speed = sp;
	}
	
	public function SetShiftForce(cell : Cell, sf : Vector3){
		cell.posForce = sf;
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
		return vess;
	}
	
	private function rand(num : int): int{
		var x = Random.value;
		if (x == 1)
			x = 0;
		return Mathf.Floor(x * num);
	}
	
	public function RandomGenerateVessel(){
		var vess : Vessel;
		Random.seed = Time.realtimeSinceStartup;
		var x : int;
		while (true){
			x = rand(7);
			if (curVesselRadius == 1 && x > 3)
				continue;
			if (curVesselRadius == 2 && x < 4)
				continue;
			if (numOfBT < 3 && x % 2 == 0)
				continue;
			break;
		}
		if (x % 2 != 0)
			numOfBT += 1;
		if (x <= 1 || x == 3 || x == 6)
			curVesselRadius = 1;
		else curVesselRadius = 2;
		vess = AddVessel(x);
		//-------------generate items-----------------------//
		while(ATPcentPos < vess.vessLength){
			if(ATPnum == 0){
				ATProt = 360 * Random.value;
				ATPoff = Random.value;
			}
			if(ATPnum >= 10){
				ATPnum = -10;
			}
			if(ATPnum >= 0){
				vess.AddItem(Global.typeATP, Global.ATPradius, ATPcentPos, ATProt, ATPoff);
			}
			ATPnum ++;
			ATPcentPos += Global.ATPgap;
		}
		ATPcentPos -= vess.vessLength;
		
		if(VIRUSnum >= 0){
			var vcp = Random.value * (vess.vessLength - Global.VIRUSradius);
			var vrot = 360 * Random.value;
			var voff = Random.value;
			vess.AddItem(Global.typeVIRUS, Global.VIRUSradius, vcp, vrot, voff);
			VIRUSnum = -1;
		}
		else VIRUSnum = 11;
	}
	
	
		
	public function ItemHit(cell : Cell){
		var vess : Vessel = map[cell.curVess - vesselOff];
		var item : BloodItem;
		for (var j = 0; j < vess.items.length; ++j){
			item = vess.items[j];
			if(item.OnCollision(cell)){
				GameObject.Destroy(item.instance, 0);
				vess.items.remove(item);
			//	item.ActOn(cell);
			}
			else if (item.centPos < cell.centPos - 1){
				GameObject.Destroy(item.instance, 0);
				vess.items.remove(item);
			}
		}
	}
	
	
	public function AddVessel(type: int) : Vessel{
		var vess : Vessel;
		switch (type){
			case 0 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(1.95, 1);
				break;
			case 2 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(1.95, 2);
				break;
			case 4 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 2);
				vess.SetProperty(3.9, 2);
				break;
			case 6 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 2);
				vess.SetProperty(1.95, 1);
				break;
				
			case 1 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(3, 29);
				break;
			case 3 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(5, 29);
				break;
			case 5 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 2);
				vess.SetProperty(6, 29);
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

}