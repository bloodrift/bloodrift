﻿#pragma strict
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
	
	//paras for rot
	public var selfRot : Quaternion;
	
	//paras for drift mode
	public var posOff : Vector3;
	public var posSpeed : Vector3;
	public var posForce : Vector3;

	public var distance : float;
	public var life : int;
	public var energy : float;
	
	//paras for new items
	public var onRush : boolean;
	public var rushTime : float;
	public var leftRushTime : float;
	
	public var camPos : Vector3;
	public var camRot : Quaternion;
	public var t_camPos : Vector3;
	public var t_camRot : Quaternion;

	public function Cell(type : int, rd : float, cv : int, map : Array, vesselOff : int){
		cellType = type;
		radius = rd;
		curVess = cv;
		distance = 0;
		var vess : Vessel = map[curVess - vesselOff];
		posOff = Vector3(0, 0, 0);
		UpdatePos(vess);
	}
	
	public function rushSpeed() : float{
		var delta = rushTime - leftRushTime;
		if(delta <= 1){
			return speed * (1 - delta) + Global.rushSpeed * delta;
		}
		if(leftRushTime <= 1){
			return speed * (1 - leftRushTime) + Global.rushSpeed * leftRushTime;
		}
		return Global.rushSpeed;
	}
		
	public function Rush(time : float){
		onRush = true;
		rushTime = time;
		leftRushTime += time;
	}

	public function shiftDragForce() : float{
		return posSpeed.sqrMagnitude / 1.5 + 3;
	}
	
	public function Shift(vess : Vessel, time : float){
		var drag : Vector3;
		if (posSpeed.sqrMagnitude == 0)
			drag = Vector3.zero;
		else drag = -posSpeed.normalized * shiftDragForce();
		var shiftRotForce : Vector3 = Vector3.zero;
		if (vess.vessType%2 != 0)
			shiftRotForce = (0.5 + speed / 28.0) * (Quaternion.AngleAxis(-rotateAngle, Vector3(0, 0, 1)) * Vector3(0, Global.gravity * Global.maxShiftForce, 0));
		posSpeed += (drag + posForce + shiftRotForce) * 0.5 * time;
		
		selfRot = Quaternion.AngleAxis(posOff.magnitude * 270, Vector3(posOff.y, -posOff.x, 0));
		posOff += posSpeed * time;
		
		var cellRadius = getRadiusInDir(vess.GetUpDir(centPos, RealRotate()));
		if(posOff.magnitude + cellRadius> vess.radius){
			posOff = (vess.radius - cellRadius) * posOff.normalized;
			posSpeed = -Global.BoundFactor * posOff.normalized; 
		}
	}
	
	public function RealRotate() : float{
	//	Debug.Log(posOff);
		var angle = Vector3.Angle(Vector3(0, -1, 0), posOff);
		if( posOff.x < 0)
			angle = -angle;
	//	Debug.Log(rotateAngle + angle);
		return rotateAngle + angle;
	}
	
	public function UpdatePos(vess : Vessel){
		var lookat = vess.CentPos2ForwardDir(centPos);
		var up = vess.GetUpDir(centPos, rotateAngle);
		var rad = vess.GetRadius(centPos);
		rotation = Quaternion.LookRotation(lookat, up);
		position = vess.CentPos2RealPos(centPos);
		// to modified by speed later
		camPos = position - 2 * lookat;
		camRot = Quaternion.LookRotation(lookat, up);
		t_camPos = (t_camPos + camPos)/2;
		
		//position += (rad - radius) *(rotation * posOff);
		position += rotation * posOff;
	//	rotation = rotation * Quaternion.AngleAxis(selfVrot, Vector3(0, 0, 1)) * Quaternion.AngleAxis(selfHrot, Vector3(0, 1, 0));
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