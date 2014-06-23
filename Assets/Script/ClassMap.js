#pragma strict

public class Map{
	public var map : Array; 
	public var lastPoint : Vector3;
	public var lastRotation : Quaternion;
	public var lastModRotation : float;
	public var player : Cell;	
	public var cam : Cell;
	public var vesselOff : int;
	public var newVessel : int;
	public var newCell : int;
	public var AICells : Array;
	
	public var CircleNum : int;
	public var DisPerCircle : float;
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
		if(Global.GameMode == Global.GameModeEndless){
			lastModRotation = 0;
			vesselOff = 0;
			VirusLevel = 1;
			for (var i = 0; i < 7; ++i){
				AddVessel(0, 0);
			}
			for (var j = 0; j < 3; ++j){
				AddVessel(1, 45 * (rand(3) - 1));
			}
			curVesselRadius = 1;
			player = new Cell(Global.typeRedCell, Global.RedCellRadius, Global.MainVessel, map, vesselOff);
			cam = new Cell(42, 0, Global.MainVessel, map, vesselOff);
		}
		if(Global.GameMode == Global.GameModeRace){
			DisPerCircle = 0;
			InitMap1();
			player = new Cell(Global.typeRedCell, Global.RedCellRadius, 0, map, vesselOff);
			cam = new Cell(42, 0, 0, map, vesselOff);
			AICells = new Array();
			CircleNum = 1;	
			RandomGenerateAICell(Global.typeBubble, 0);
			RandomGenerateAICell(Global.typeBubble, 0);
			RandomGenerateAICell(Global.typeBigBubble, 0);
			RandomGenerateAICell(Global.typeBigBubble, 0);
			RandomGenerateAICell(Global.typeTriangleCell, 0);
			RandomGenerateAICell(Global.typeWhiteCell, 0);
			RandomGenerateAICell(Global.typeRedCell, 0);
		}
		
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
			vess = ESwitchToNextVessel(player, vess);
		}
		//move
		var aimPosOff = Global.EPosition2PosOff(player.EPosition);
		player.posOff += (aimPosOff - player.posOff) * Global.EShiftSpeed * time;
		if(Global.GameStart){
			if(player.BoundCheck(vess, true)){
				player.CollisionEffect.transform.position = player.CEposition;
				player.CollisionEffect.transform.rotation = player.CErotation;
			}
			else {
			//	player.CollisionEffect.transform.position = Vector3(-100, -100, -100);
			}
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
	
	public function RMove(cell : Cell, time : float){
		var vess : Vessel = map[cell.curVess];
		//beneth is a unclear model, we can modify it later
		//calculateSpeed
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
			cell.UpdateSpeed(time);
		}
	
		if(cell.CEshow){
			cell.CollisionEffect.transform.position = cell.CEposition;
			cell.CollisionEffect.transform.rotation = cell.CErotation;
		}
		else {
			cell.CollisionEffect.transform.position = Vector3(-100, -100, -100);
		}
			
		cell.centPos = nextPos;
		// go to the next vessel--------------------------

		if (cell.centPos > vess.vessLength){
			vess = RSwitchToNextVessel(cell, vess);
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
	
	public function SetAccelerateForce(cell : Cell, af : float){
		cell.AccelerateForce = af;
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
	
	public function ESwitchToNextVessel(cell : Cell, vess : Vessel) : Vessel{
		cell.centPos -= vess.vessLength;
		cell.curVess += 1;
		// at the end
		vess = map[cell.curVess - vesselOff];
		cell.rotateAngle -= vess.modRotation;
		return vess;
	}
	
	public function RSwitchToNextVessel(cell : Cell, vess : Vessel) : Vessel{
		cell.centPos -= vess.vessLength;
		cell.curVess += 1;
		if(cell.curVess == map.length){
			cell.curVess = 0;
			if(cell == player){
				CircleNum ++;
				if(CircleNum > 3){
					Global.GameOver = true;
				}
			}
		}
		// at the end
		vess = map[cell.curVess];
		cell.rotateAngle -= vess.modRotation;
		return vess;
	}
	
	
	
	private function rand(num : int): int{
		var x = Random.value;
		if (x == 1)
			x = 0;
		return Mathf.Floor(x * num);
	}
	
	public function Progress() : float{
		return (player.distance - (CircleNum - 1) * DisPerCircle) / DisPerCircle;
	}
	
	public function Rank() : int {
		var rank : int = 1;
		for (var i = 0; i < AICells.length; ++i){
			var cell : Cell = AICells[i];
			if(cell.distance > player.distance){
				rank += 1;
			}
		}
		return rank;
	}
	
	private function RandomGenerateAICell(cellType : int, speed : float){
		//add new AICell
		var newcell : Cell = AddAICell(cellType, rand(4));
		var vess : Vessel;
		for(var i = 0; i < newcell.curVess; ++i){
			vess = map[i];
			newcell.distance += vess.vessLength;
		}
		newcell.distance += newcell.centPos;
		newcell.speed = speed;
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
		vess = AddVessel(x, 45 * (rand(3) - 1));
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
			VirusNum = - (2 * VirusLevel - 1);
		}
		else VirusNum += 1;
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

	public function AddVessel(type: int, rot : float) : Vessel{
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
				vess.SetProperty(3, 30);
				break;
			case 3 :
				vess = new Vessel(type, lastPoint, rot, lastRotation, 1);
				vess.SetProperty(5, 30);
				break;
			case 5 :
				vess = new Vessel(type, lastPoint, rot, lastRotation, 2);
				vess.SetProperty(6, 30);
				break;
			default :
				break;
		}
		map.Push(vess);
		newVessel += 1;
		lastPoint = vess.endPoint;
		lastRotation = vess.endRotation;
		lastModRotation += vess.modRotation;
		DisPerCircle += vess.vessLength;
		return vess;
	}
	private function MapAdd(type : int, time : int, rot : float){
		for(var i = 0; i < time; ++i){
			AddVessel(type, rot);
			rot= 0;
		}
	}
	
	private function InitMap1(){
		MapAdd(0, 5, 0);
		MapAdd(2, 1, 0);
		MapAdd(4, 4, 0);
		//
		MapAdd(5, 6, 0);
		//
		MapAdd(4, 4, 0);
		MapAdd(6, 1, 0);
		MapAdd(0, 5, 0);
		//
		MapAdd(3, 6, 90);
		//
		MapAdd(0, 15, 0);
		//
		MapAdd(1, 6, -90);
		//
		MapAdd(0, 5, 0);
		MapAdd(2, 1, 0);
		MapAdd(4, 4, 0);
		MapAdd(6, 1, 0);
		MapAdd(0, 7, 0);
		//
		MapAdd(1, 6, 0);
		MapAdd(3, 6, 90);
		//
		MapAdd(2, 1, 0);
		//
		MapAdd(5, 6, -90);
		MapAdd(6, 1, 0);
		MapAdd(0, 7, 0);
	}

}