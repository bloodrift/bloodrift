#pragma strict

public class Map{
	public var map : Array; 
	public var lastPoint : Vector3;
	public var lastRotation : Quaternion;
	public var player : Cell;	
	public var cam : Cell;
	public var collisionEffect : GameObject;
	public var vesselOff : int;
	public var newVessel : int;
	public var newCell : int;
	public var AICells : Array;
	
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
	private var HEMOnum : int;
	
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
		player = new Cell(Global.typeRedCell, Global.RedCellRadius, Global.mainVessel, map, vesselOff);
		cam = new Cell(13, 0, Global.mainVessel, map, vesselOff);
		AICells = new Array();
	}
	
	public function Move(cell : Cell, time : float, index : int){
		if(cell.curVess - vesselOff < Global.mainVessel - 1){
			// modified by snowson
			GameObject.Destroy(cell.instance);
			AICells.RemoveAt(index);
		}
		var vess : Vessel = map[cell.curVess - vesselOff];
		//beneth is a unclear model, we can modify it later
		var rots = cell.RealRotate() * Mathf.PI / 180.0;
		var speedModifier : float = 1;
		if(vess.vessType%2 != 0){
			speedModifier = 1.0 / (1 - 0.1 * Mathf.Cos(rots) * cell.posOff.magnitude * vess.radius/vess.rotateRadius);
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
				
				//var motionBlur : MotionBlur = cam.instance.GetComponent(MotionBlur);
				//motionBlur.isMotionBlur = true;
				cam.instance.SendMessage("doBlur",true);
			}
		}
		
		if(Global.gameStart){
			cell.distance += nextPos - cell.centPos;
			cell.Shift(vess, time, cell == player);
		}
		if(cell == player){
			cell.speed = Mathf.Log(cell.distance + 8);
			if(cell.CEshow){
				collisionEffect.transform.position = cell.CEposition;
				collisionEffect.transform.rotation = cell.CErotation;
			}
		}
			
		cell.centPos = nextPos;
		// go to the next vessel--------------------------

		if (cell.centPos > vess.vessLength){
					//destroy the vessels
			if(cell == player){
				AbandonVessel();
				RandomGenerateVessel();
				
				RandomGenerateAICell(3, cell.speed / 2);
				RandomGenerateAICell(3, cell.speed / 2);
			}
			vess = SwitchToNextVessel(cell, vess);
		}
		//-----------------------------------
		cell.UpdatePos(vess);	
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
	
	private function RandomGenerateAICell(cellType : int, speed : float){
		//add new AICell
		var newcell : Cell = AddAICell(cellType, 6 + vesselOff);
		newcell.speed = speed;
		newCell++;
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
		
		if(!Global.gameStart)
			return;
		//-------------generate items-----------------------//
		while(ATPcentPos < vess.vessLength){
			if(ATPnum == 0){
				ATProt = 360 * Random.value;
				ATPoff = Random.value * 3 / 5 + 0.2;
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
			var voff = 4 * Random.value / 5 + 0.2;
			vess.AddItem(Global.typeVIRUS, Global.VIRUSradius, vcp, vrot, voff);
			VIRUSnum = -1;
		}
		else VIRUSnum = 1;
		
		if(HEMOnum >= 0){
			var hcp = Random.value * (vess.vessLength - Global.HEMOradius);
			var hrot = 360 * Random.value;
			var hoff = Random.value/2 + 0.5;
			vess.AddItem(Global.typeHEMO, Global.HEMOradius, hcp, hrot, hoff);
			HEMOnum = -5;
		}
		else HEMOnum += 1;
	}
	
	public function ItemHit(cell : Cell){
		var vess : Vessel = map[cell.curVess - vesselOff];
		var item : BloodItem;
		for (var j = 0; j < vess.items.length; ++j){
			item = vess.items[j];
			if(item.OnCollision(cell)){
				GameObject.Destroy(item.instance, 0);
				vess.items.remove(item);
				item.ActOn(cell, cam);
			}
		}
	}
	
	public function AddAICell(cellType : int, curVess : int) : Cell{
		var radius : float;
		var cell : Cell;
		switch (cellType){
			case Global.typeRedCell :
				cell = new Cell(Global.typeRedCell, Global.RedCellRadius, curVess, map, vesselOff);
				break;
			case Global.typeWhiteCell :
				cell = new Cell(Global.typeWhiteCell, Global.WhiteCellRadius, curVess, map, vesselOff);
				break;
			case Global.typeTriangleCell :
				cell = new Cell(Global.typeTriangleCell, Global.TriangleCellRadius, curVess, map, vesselOff);
				break;
			case Global.typeBubble :
				cell = new Cell(Global.typeBubble, Global.BubbleRadius, curVess, map, vesselOff);
				break;
		}
		//random a position not collider with other cells
		var vess : Vessel = map[curVess - vesselOff];
		
		while (true){
			var off = Random.insideUnitSphere;
			var centoff = 0.5 * (1 + off.z) * vess.vessLength; 
			var posoff : Vector3 = Vector3(off.x, off.y, 0) * (vess.GetRadius(centoff) - radius);
			cell.centPos = centoff;
			cell.posOff = posoff;
			cell.UpdatePos(vess);
			var i : int;
			for (i = 0; i < AICells.length; ++i)
				if(cell.OnCollision(AICells[i])){
					break;
				}
			if(i == AICells.length)
				break;
		}
		
		AICells.Add(cell);
		return cell;
	}
	
	
	public function AddVessel(type: int) : Vessel{
		var rot = 45 * (rand(3) - 1);
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
				vess = new Vessel(type, lastPoint, rot, lastRotation, 1);
				vess.SetProperty(3, 29);
				break;
			case 3 :
				vess = new Vessel(type, lastPoint, rot, lastRotation, 1);
				vess.SetProperty(5, 29);
				break;
			case 5 :
				vess = new Vessel(type, lastPoint, rot, lastRotation, 2);
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