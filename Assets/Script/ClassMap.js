#pragma strict

public class Map{
	public var map : Array; 
	public var lastPoint : Vector3;
	public var lastRotation : Quaternion;
	public var lastModRotation : float;
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
	private var ATPoff : Vector3;
	private var lastATPEPos : int;
	
	private var VirusNum : int;
	private var VirusLevel : int;
	
	private var HEMOnum : int;
	public var GUICarrier : GameObject;
	
	public function Map(){
		map = new Array();
		lastPoint = Vector3.zero;
		lastRotation = Quaternion(0, 0, 0, 1);
s		if(Global.GameMode == Global.GameModeEndless){
			lastModRotation = 0;
			vesselOff = 0;
			VirusLevel = 1;
			for (var i = 0; i < 7; ++i){
				AddVessel(0);
			}
			for (var j = 0; j < 3; ++j){
				AddVessel(1);
			}
			curVesselRadius = 1;
			player = new Cell(Global.typeRedCell, Global.RedCellRadius, Global.MainVessel, map, vesselOff);
			cam = new Cell(42, 0, Global.MainVessel, map, vesselOff);
		}
		if(Global.GameMode == Global.GameModeRace){
			InitMap1();
			player = new Cell(Global.typeRedCell, Global.RedCellRadius, 0, map, vesselOff);
			cam = new Cell(42, 0, 0, map, vesselOff);
		}
	//	AICells = new Array();
	}
	
	public function EMove(time : float){
		var vess : Vessel = map[player.curVess - vesselOff];
		var nextPos = vess.NextCentPos(player.centPos, player.speed, time);
		if (player.onRush){
			var speed = player.ERushSpeed();
			nextPos = vess.NextCentPos(player.centPos, speed, time);
			player.leftRushTime -= time;
			player.EPosition = Global.EPositionCenter;
			if (player.leftRushTime <= 0){
				player.onRush = false;
				player.leftRushTime = 0;
				cam.instance.SendMessage("OnBlur", false);
			}
		}
		if(Global.GameStart){
			player.distance += nextPos - player.centPos;
		}
		player.speed = Mathf.Log(player.distance + 8);
		player.centPos = nextPos;
		if (player.centPos > vess.vessLength){
			AbandonVessel();
			RandomGenerateVessel();
			vess = SwitchToNextVessel(player, vess);
		}
		//move
		var aimPosOff = Global.EPosition2PosOff(player.EPosition);
		player.posOff += (aimPosOff - player.posOff) * Global.EShiftSpeed * time;
		if(player.BoundCheck(vess, true)){
			collisionEffect.transform.position = player.CEposition;
			collisionEffect.transform.rotation = player.CErotation;
		}
		player.ESelfRot *= Quaternion.AngleAxis(time * Global.ESelfRotSpeed, player.ESelfRotDirection);
		player.EUpdatePos(vess);	
	}
	
	public function EShift(direction : int){
		switch(direction){
			case Global.EShiftUp :
				player.ESelfRotDirection = Vector3(1, 0, 0);
				player.ESelfRot = Quaternion(0, 0, 0, 1);
				if(player.EPosition == Global.EPositionDown){
					player.EPosition = Global.EPositionCenter;
				}
				else if (player.EPosition == Global.EPositionUp){
					player.EPosition = Global.EPositionUpOut;
				}
				else if (player.EPosition == Global.EPositionUpOut){
					player.EPosition = Global.EPositionUpOut;
				}
				else if (player.EPosition == Global.EPositionDownOut){
					player.EPosition = Global.EPositionDown;
				}
				else {
					player.EPosition = Global.EPositionUp;
				}
				break;
			case Global.EShiftDown :
				player.ESelfRotDirection = Vector3(-1, 0, 0);
				player.ESelfRot = Quaternion(0, 0, 0, 1);
				if(player.EPosition == Global.EPositionUp){
					player.EPosition = Global.EPositionCenter;
				}
				else if (player.EPosition == Global.EPositionDown){
					player.EPosition = Global.EPositionDownOut;
				}
				else if (player.EPosition == Global.EPositionDownOut){
					player.EPosition = Global.EPositionDownOut;
				}
				else if (player.EPosition == Global.EPositionUpOut){
					player.EPosition = Global.EPositionUp;
				}
				else {
					player.EPosition = Global.EPositionDown;
				}
				break;
			case Global.EShiftLeft :
				player.ESelfRotDirection = Vector3(0, 1, 0);
				player.ESelfRot = Quaternion(0, 0, 0, 1);
				if(player.EPosition == Global.EPositionRight){
					player.EPosition = Global.EPositionCenter;
				}
				else if (player.EPosition == Global.EPositionLeft){
					player.EPosition = Global.EPositionLeftOut;
				}
				else if (player.EPosition == Global.EPositionLeftOut){
					player.EPosition = Global.EPositionLeftOut;
				}
				else if (player.EPosition == Global.EPositionRightOut){
					player.EPosition = Global.EPositionRight;
				}
				else {
					player.EPosition = Global.EPositionLeft;
				}
				break;
			case Global.EShiftRight :
				player.ESelfRotDirection = Vector3(0, -1, 0);
				player.ESelfRot = Quaternion(0, 0, 0, 1);
				if(player.EPosition == Global.EPositionLeft){
					player.EPosition = Global.EPositionCenter;
				}
				else if (player.EPosition == Global.EPositionRight){
					player.EPosition = Global.EPositionRightOut;
				}
				else if (player.EPosition == Global.EPositionLeftOut){
					player.EPosition = Global.EPositionLeft;
				}
				else if (player.EPosition == Global.EPositionRightOut){
					player.EPosition = Global.EPositionRightOut;
				}
				else {
					player.EPosition = Global.EPositionRight;
				}
				break;
		}
	}
	
	public function Move(cell : Cell, time : float, index : int){
		if(cell.curVess - vesselOff < Global.MainVessel - 1){
			// modified by snowson
			GameObject.Destroy(cell.instance);
			AICells.RemoveAt(index);
		}
		if(cell.curVess - vesselOff > Global.VesselNum - 1){
			return;
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
			var sp : float = cell.RushSpeed();
			nextPos = vess.NextCentPos(cell.centPos, sp, time);
			cell.leftRushTime -= time;
			if (cell.leftRushTime <= 0){
				cell.onRush = false;
				cell.leftRushTime = 0;
				cam.instance.SendMessage("OnBlur", false);
			}
		}
		
		if(Global.GameStart){
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
				
				RandomGenerateAICell(Global.typeBubble, cell.speed / 2);
				RandomGenerateAICell(Global.typeBubble, cell.speed / 2);
				if(AICells.length % 2 == 0)
					RandomGenerateAICell(Global.typeBigBubble, cell.speed / 2);
			}
			vess = SwitchToNextVessel(cell, vess);
		}
		//-----------------------------------
		cell.RUpdatePos(vess);	
	}
	
	public function ERush(cell : Cell){
		if(!cell.onRush && cell.energy == 100){
			cell.onRush = true;
			cell.leftRushTime = cell.ERushTime;
			cell.energy = 0;
			GUICarrier = GameObject.Find("GUICarrier");
			GUICarrier.SendMessage("OnRelease");
			cam.instance.SendMessage("OnBlur", true);
		}
	}
	
	public function Rush(cell : Cell){
		if(!cell.onRush && cell.energy == 100){
			cell.onRush = true;
			cell.leftRushTime = cell.totalRushTime;
			cell.energy = 0;
			GUICarrier = GameObject.Find("GUICarrier");
			GUICarrier.SendMessage("OnRelease");
			cam.instance.SendMessage("OnBlur", true);
		}
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
		if (numOfBT < 3 && x % 2 == 0)
			x = rand(2) * 2 + 1;
		else x = rand(1) * (rand(2) * 2 + 1);
		if (x % 2 != 0)
			numOfBT += 1;
		vess = AddVessel(x);
		if(!Global.GameStart)
			return;
		//-------------generate items-----------------------//
		/////////////////////ATP
		var hasAddATP : int = 0;
		while(ATPcentPos < vess.vessLength){
			if(ATPnum == 0){
				lastATPEPos = rand(5);
				ATPoff = Global.EPosition2PosOff(lastATPEPos);
			}
			if(ATPnum >= 10){
				ATPnum = -10;
			}
			if(ATPnum >= 0){
				hasAddATP = 1;
				vess.AddItem(Global.typeATP, Global.ATPradius, ATPcentPos, lastModRotation, ATPoff);
			}
			ATPnum ++;
			ATPcentPos += Global.ATPgap;
		}
		ATPcentPos -= vess.vessLength;
		//////////////////////Virus
		if ( player.distance < 300){
			VirusLevel = 1;
		}
		else if ( player.distance < 700){
			VirusLevel = 2;
		}
		else if ( player.distance < 1200){
			VirusLevel = 3;
		}
		else VirusLevel = 4;
		
		var arr : Array = new Array();
		var i : int;
		for( i = 0; i < 5; ++i)
			arr.Add(i);
		if (hasAddATP > 0){
			arr.RemoveAt(lastATPEPos);
		}
		
		if(HEMOnum >= 0){
			var hcp = Random.value * (vess.vessLength - Global.HEMOradius);
			var hoff = Global.EPosition2PosOff(arr[rand(5 - hasAddATP)]);
			vess.AddItem(Global.typeHEMO, Global.HEMOradius, hcp, lastModRotation, hoff);
			HEMOnum = -10;
		}
		else HEMOnum += 1;
		
		var vcp : float;
		var voff : Vector3;
		if(VirusNum >= 0){
			vcp = Random.value * (vess.vessLength - Global.VIRUSradius);
			for( i = 0; i < VirusLevel; ++i){
				x = rand(5 - i - hasAddATP);
				voff = Global.EPosition2PosOff(arr[x]);
				vess.AddItem(Global.typeVIRUS, Global.VIRUSradius, vcp, lastModRotation, voff);	
				arr.RemoveAt(x);
			}
			VirusNum = - (3 * VirusLevel - 2);
		}
		else VirusNum = 1;
	}
	
	public function ItemHit(cell : Cell){
		var vess : Vessel = map[cell.curVess - vesselOff];
		var item : BloodItem;
		if(cell.onRush){
			for (var i = 0; i < vess.items.length; ++i){
				item = vess.items[i];
				GameObject.Destroy(item.instance, 0);
				vess.items.remove(item);
			}
			return;
		}
		
		for (var j = 0; j < vess.items.length; ++j){
			item = vess.items[j];
			if(item.OnCollision(cell)){
				item.ActOn(cell, cam);
				GameObject.Destroy(item.instance, 0);
				vess.items.remove(item);
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
			case Global.typeBigBubble :
				cell = new Cell(Global.typeBigBubble, Global.BigBubbleRadius, curVess, map, vesselOff);
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
			cell.RUpdatePos(vess);
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
		lastModRotation += vess.modRotation;

		return vess;
	}
	
	private function InitMap1(){
	}

}