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
	
	public var mode : int;
	public var centPos : float;
	public var curVess : int;
	public var speed : float;
	public var rotateAngle : float;
	
	//paras for rotate speed control
	static public var maxRotateSpeed : float = 500;
	public var rotateForce : float;
	public var rotateSpeed : float;
	
	//paras for drift mode
	public var posOff : Vector3;
	public var aimOff : Vector3;	
	public var onSwitch : boolean;
	
	public var distance : float;
	public var score : int;
	
	//paras for new items
	public var onRush : boolean;
	public var rushTime : float;
	public var leftRushTime : float;
	
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
	
	public function Rush(time : float){
		onRush = true;
		rushTime = time;
		leftRushTime += time;
	}
	
	public function dragForce() : float{
		// a = x^2/1000 + 250
		return rotateSpeed * rotateSpeed / 150 + 300;
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
	
	
	public function Rotate(time : float){
		var drag : float;
		if (rotateSpeed > 0)
			drag = -dragForce();
		else if (rotateSpeed == 0)
			drag = 0;
		else drag = dragForce();
		
		rotateSpeed += (drag + rotateForce) * 0.5 * time;
		
	//	Debug.Log(rotateSpeed);
		var angle = rotateSpeed * time;
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