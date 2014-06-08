#pragma strict

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
	
	public function AddItem(type : int, itemRad : float, cp : float, ra : float, off : float){
		var pos = CentPos2RealPos(cp);
		var lookat = CentPos2ForwardDir(cp);
		var up = GetUpDir(cp, ra);
		var rot = Quaternion.LookRotation(-lookat, up);
		pos = pos - (GetRadius(cp) - itemRad) * off * up;
		var item = new BloodItem(type, itemRad, pos, rot, cp);
		items.Add(item);
	}
}