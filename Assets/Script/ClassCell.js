#pragma strict
//------------------------
// 1 for Float Mode
// 0 for Ground Mode
public class Cell{
	public var cellType : int;
	
	public var position : Vector3;
	public var rotation : Quaternion;
	public var radius : float;
	public var instance : GameObject;
	
	public var centPos : float;
	public var curVess : int;
	public var speed : float;
	public var rotateAngle : float;
	
	//paras for rot
	public var selfRot : Quaternion;
	
	public var ESelfRot : Quaternion; 
	public var ESelfRotDirection : Vector3;
	
	//paras for drift mode
	public var posOff : Vector3;
	public var posSpeed : Vector3;
	public var posForce : Vector3;

	public var distance : float;
	public var life : int;
	public var energy : float;
	
	//paras for new items
	public var onRush : boolean;
	static public var totalRushTime : float = 10;
	static public var ERushTime : float = 5;
	public var leftRushTime : float;
	
	public var EPosition : int;
	
	public var camPos : Vector3;
	public var camRot : Quaternion;
	public var camPosOff : Vector3;
	public var camPosSpeed : Vector3;
	
	public var CEposition : Vector3;
	public var CErotation : Quaternion;
	public var CEshow : boolean;
	

	public function Cell(type : int, rd : float, cv : int, map : Array, vesselOff : int){
		cellType = type;
		radius = rd;
		curVess = cv;
		var vess : Vessel = map[curVess - vesselOff];
		posOff = Vector3(0, 0, 0);
		EPosition = 0;
		if(Global.GameMode == Global.GameModeEndless){
			ESelfRot = Quaternion(0, 0, 0, 1);
			ESelfRotDirection = Vector3(0, 1, 0);
			EUpdatePos(vess);
		}
		else {
			RUpdatePos(vess);
		}
		life = 100;
		energy = 0;
		distance = 0;
		onRush = false;
	}
	
	public function ERushSpeed() : float{
		var deltaTime = ERushTime - leftRushTime;
		if(deltaTime <= 2){
			return (speed * (2 - deltaTime) + Global.ERushSpeed * deltaTime) / 2;
		}
		if(leftRushTime <= 2){
			return (speed * (2 - leftRushTime) + Global.ERushSpeed * leftRushTime) / 2;
		}
		return Global.ERushSpeed;
	}
	
	public function RushSpeed() : float{
		var deltaTime = totalRushTime - leftRushTime;
		if(deltaTime <= 3){
			return (speed * (3 - deltaTime) + Global.rushSpeed * deltaTime) / 3;
		}
		if(leftRushTime <= 3){
			return (speed * (3 - leftRushTime) + Global.rushSpeed * leftRushTime) / 3;
		}
		return Global.rushSpeed;
	}

	public function shiftDragForce() : float{
		return posSpeed.sqrMagnitude / 1.5 + 3;
	}
	
	private function CamShift(vess : Vessel, time : float){
		var drag : Vector3 = -camPosOff * 5 - camPosSpeed * 1;
		var shiftRotForce : Vector3 = Vector3.zero;
		if (vess.vessType%2 != 0)
			shiftRotForce = 1 * (Quaternion.AngleAxis(-rotateAngle, Vector3(0, 0, 1)) * Vector3(0, 1, 0));
		camPosSpeed += (drag + shiftRotForce) * 0.5 * time;
		camPosOff += camPosSpeed * time;
	}
	
	public function BoundCheck(vess : Vessel, isPlayer : boolean) : boolean{
		var cellRadius = getRadiusInDir(vess.GetUpDir(centPos, RealRotate()));
		if(EdgeDistance(vess) < 0){
			if(isPlayer){
				var up = vess.GetUpDir(centPos, RealRotate());
				CEposition = vess.CentPos2RealPos(centPos) - up * (vess.GetRadius(centPos) - 0.05);
				CErotation = Quaternion.LookRotation(-vess.CentPos2ForwardDir(centPos), up);
				CEshow = true;
			}
		//	posOff = (vess.GetRadius(centPos) - cellRadius) * posOff.normalized;
			switch (EPosition){
				case Global.EPositionUpOut :
					EPosition = Global.EPositionUp;
					break;
				case Global.EPositionDownOut :
					EPosition = Global.EPositionDown;
					break;
				case Global.EPositionLeftOut :
					EPosition = Global.EPositionLeft;
					break;
				case Global.EPositionRightOut :
					EPosition = Global.EPositionRight;
					break;
			}
			life -= 3;	
			if(life < 0){
				life = 0;
			}
			return true; 
		}
		return false;
	}
	
	public function Shift(vess : Vessel, time : float, isPlayer : boolean){
		CamShift(vess, time);
		var drag : Vector3;
		if (posSpeed.sqrMagnitude == 0)
			drag = Vector3.zero;
		else drag = -posSpeed.normalized * shiftDragForce();
		var shiftRotForce : Vector3 = Vector3.zero;
		if (vess.vessType%2 != 0)
			shiftRotForce = (1 * Global.shiftDragForce + speed / Global.rushSpeed* (Global.maxShiftForce - Global.shiftDragForce)) * (Quaternion.AngleAxis(-rotateAngle, Vector3(0, 0, 1)) * Vector3(0, 1, 0));
		if(onRush)
			shiftRotForce += Global.maxShiftForce * - posOff;
		posSpeed += (drag + posForce + shiftRotForce) * 0.5 * time;

		selfRot = Quaternion.AngleAxis(posOff.magnitude * 270, Vector3(posOff.y, -posOff.x, 0));
		posOff += posSpeed * time;
		CEshow = false;
	
		var cellRadius = getRadiusInDir(vess.GetUpDir(centPos, RealRotate()));
		if(EdgeDistance(vess) < 0){
			if(isPlayer){
				var up = vess.GetUpDir(centPos, RealRotate());
				CEposition = vess.CentPos2RealPos(centPos) - up * (vess.GetRadius(centPos) - 0.05);
				CErotation = Quaternion.LookRotation(-vess.CentPos2ForwardDir(centPos), up);
				CEshow = true;
			}
			posOff = (vess.GetRadius(centPos) - cellRadius) * posOff.normalized;
			var upPos = posOff.normalized;
			if(Vector3.Dot(posSpeed, upPos) > 0){
				life -= 3;	
				if(life < 0)
					life = 0;
				var stridePos = 2 * upPos * Vector3.Dot(posSpeed, upPos);
				posSpeed -= (0.9 * stridePos + Global.boundFactor * upPos) ; 
			}
		}
	}
	
	public function EdgeDistance(vess : Vessel) : float{
		var cellRadius = getRadiusInDir(vess.GetUpDir(centPos, RealRotate()));
		return vess.GetRadius(centPos) - (posOff.magnitude + cellRadius);
	}
	
	public function RealRotate() : float{
	//	Debug.Log(posOff);
		var angle = Vector3.Angle(Vector3(0, -1, 0), posOff);
		if( posOff.x < 0)
			angle = -angle;
	//	Debug.Log(rotateAngle + angle);
		return rotateAngle + angle;
	}
	
	public function EUpdatePos(vess : Vessel){
		var lookat = vess.CentPos2ForwardDir(centPos);
		var up = vess.GetUpDir(centPos, rotateAngle);
		var rad = vess.GetRadius(centPos);
		rotation = Quaternion.LookRotation(lookat, up);
		position = vess.CentPos2RealPos(centPos);
		camPos = position - 1 * lookat;
		camPos += rotation * (posOff);
		position += rotation * posOff;
		camRot = Quaternion.LookRotation(position - camPos, up);
	//	rotation = rotation * ESelfRot;
		rotation = rotation * Quaternion.AngleAxis(posOff.magnitude * 270, Vector3(posOff.y, -posOff.x, 0));
		if(instance != null){
			instance.transform.position = position;
			instance.transform.rotation = rotation;
		}
	}
	
	public function RUpdatePos(vess : Vessel){
		var lookat = vess.CentPos2ForwardDir(centPos);
		var up = vess.GetUpDir(centPos, rotateAngle);
		var rad = vess.GetRadius(centPos);
		rotation = Quaternion.LookRotation(lookat, up);
		position = vess.CentPos2RealPos(centPos);
		camPos = position - 1 * lookat;
		camPos += rotation * (posOff);
		position += rotation * posOff;
		camRot = Quaternion.LookRotation(position - camPos, up);
		rotation = rotation * selfRot;
		
		if(instance != null){
			instance.transform.position = position;
			instance.transform.rotation = rotation;
		}
	}
	
	public function getRadiusInDir(dir : Vector3) : double{
		var rot = rotation * selfRot * Vector3(0, 0, 1);
		var angle = Vector3.Angle(dir, rot);
		return Mathf.Sin(angle * Mathf.PI / 180) * radius;
	}
	
	public function OnCollision(cell : Cell) : boolean{
		var cellRadius = cell.getRadiusInDir(cell.position - position);
		var myRadius = getRadiusInDir(cell.position - position);
		var sqrDis = (cell.position - position).sqrMagnitude;
		if(sqrDis < (cellRadius + myRadius) * (cellRadius + myRadius))
			return true;
		return false;
	}
}